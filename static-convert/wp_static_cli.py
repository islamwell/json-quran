#!/usr/bin/env python3
"""
WordPress to Static Website Converter CLI
Optimized for Cloudflare Pages with Remote Media Offloading.

Converts dynamic WordPress sites into 100% static HTML, CSS, JS, and fonts,
while keeping heavy assets (MP3 audios, PPT slides, JPG/PNG images, PDFs, etc.)
hosted on the original server or a dedicated media CDN.

Zero external dependencies required (Pure Python 3 standard library).
"""

import os
import sys
import re
import json
import time
import shutil
import argparse
import urllib.parse
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed

VERSION = "1.0.5"

# Default extensions to keep remote (not downloaded into Cloudflare Pages static bundle)
DEFAULT_REMOTE_MEDIA_EXTENSIONS = {
    "mp3", "m4a", "wav", "ogg", "aac", "flac",
    "ppt", "pptx", "pdf", "doc", "docx", "xls", "xlsx",
    "jpg", "jpeg", "png", "webp", "gif", "svg", "ico",
    "mp4", "m4v", "mov", "webm", "mkv", "avi",
    "zip", "tar", "gz", "7z", "rar"
}

# Assets that MUST be downloaded and bundled locally for the static site to render properly
BUNDLED_ASSET_EXTENSIONS = {
    "css", "js", "woff", "woff2", "ttf", "eot", "otf"
}

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 WP-Static-Converter/1.0"


class WPStaticConverter:
    def __init__(self, base_url, output_dir, media_domain=None, remote_exts=None,
                 download_media=False, search_index=True, concurrency=6, limit=None,
                 custom_domain=None, specific_urls=None):
        self.base_url = base_url.rstrip("/")
        self.parsed_base = urllib.parse.urlparse(self.base_url)
        self.base_domain = self.parsed_base.netloc.lower()
        self.base_scheme = self.parsed_base.scheme or "https"
        self.base_path = self.parsed_base.path.rstrip("/")
        
        self.output_dir = os.path.abspath(output_dir)
        self.media_domain = (media_domain or self.base_url).rstrip("/")
        self.download_media = download_media
        self.remote_exts = set(ext.lower().lstrip(".") for ext in (remote_exts or DEFAULT_REMOTE_MEDIA_EXTENSIONS))
        self.search_index_enabled = search_index
        self.concurrency = max(1, concurrency)
        self.limit = limit
        self.custom_domain = custom_domain.rstrip("/") if custom_domain else None
        self.specific_urls = specific_urls or []

        # Tracking state
        self.discovered_urls = set()
        self.processed_pages = set()
        self.failed_pages = set()
        self.asset_cache = {}  # url -> local relative path
        self.search_records = []

        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)

    def log(self, message, prefix="ℹ️"):
        print(f"[{time.strftime('%H:%M:%S')}] {prefix} {message}")

    def fetch_url(self, url, max_retries=3, is_binary=False):
        """Fetch URL with custom User-Agent and retry logic."""
        headers = {
            "User-Agent": USER_AGENT,
            "Accept": "*/*",
            "Accept-Encoding": "identity"
        }
        # Encode URL if it contains non-ascii or spaces
        clean_req_url = urllib.parse.quote(url, safe=":/?#[]@!$&'()*+,;=-_.~%")
        req = urllib.request.Request(clean_req_url, headers=headers)

        for attempt in range(1, max_retries + 1):
            try:
                with urllib.request.urlopen(req, timeout=25) as resp:
                    data = resp.read()
                    if is_binary:
                        return data, resp.getheader("Content-Type", "")
                    try:
                        content_type = resp.getheader("Content-Type", "")
                        charset = "utf-8"
                        if "charset=" in content_type.lower():
                            charset = content_type.lower().split("charset=")[-1].split(";")[0].strip()
                        return data.decode(charset, errors="replace"), content_type
                    except Exception:
                        return data.decode("utf-8", errors="replace"), "text/html"
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    return None, f"HTTP {e.code}"
                if attempt == max_retries:
                    return None, f"HTTP {e.code}: {e.reason}"
            except Exception as e:
                if attempt == max_retries:
                    return None, str(e)
            time.sleep(1)
        return None, "Max retries exceeded"

    def discover_from_sitemaps(self):
        """Find all pages and posts from WordPress XML sitemaps."""
        if self.specific_urls:
            self.discovered_urls = sorted(list(set(self.specific_urls)))
            return self.discovered_urls

        sitemap_candidates = [
            f"{self.base_url}/wp-sitemap.xml",
            f"{self.base_url}/sitemap_index.xml",
            f"{self.base_url}/sitemap.xml"
        ]
        
        found_urls = set()
        sub_sitemaps = []

        self.log(f"Searching WordPress sitemaps on {self.base_url}...", "🔍")

        for sitemap_url in sitemap_candidates:
            xml_data, _ = self.fetch_url(sitemap_url)
            if not xml_data or "<sitemap" not in xml_data:
                continue

            self.log(f"Found root sitemap: {sitemap_url}", "✅")
            try:
                root = ET.fromstring(xml_data)
                ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
                for loc in root.findall(".//sm:loc", ns) or root.findall(".//loc"):
                    if loc.text and loc.text.strip():
                        item = loc.text.strip()
                        if item.endswith(".xml"):
                            sub_sitemaps.append(item)
                        else:
                            found_urls.add(self.normalize_wp_url(item))
            except Exception as e:
                self.log(f"Error parsing {sitemap_url}: {e}", "⚠️")

            if sub_sitemaps or found_urls:
                break

        for sub_url in sub_sitemaps:
            self.log(f"Reading sub-sitemap: {sub_url}", "📄")
            sub_data, _ = self.fetch_url(sub_url)
            if not sub_data:
                continue
            try:
                root = ET.fromstring(sub_data)
                ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
                for loc in root.findall(".//sm:loc", ns) or root.findall(".//loc"):
                    if loc.text and loc.text.strip():
                        u = loc.text.strip()
                        if not u.endswith(".xml") and u != "#":
                            found_urls.add(self.normalize_wp_url(u))
            except Exception as e:
                self.log(f"Error parsing sub-sitemap {sub_url}: {e}", "⚠️")

        found_urls.add(self.normalize_wp_url(self.base_url + "/"))
        self.discovered_urls = sorted(list(found_urls))
        self.log(f"Discovered {len(self.discovered_urls)} total URLs from WordPress sitemaps.", "🎯")
        return self.discovered_urls

    def normalize_wp_url(self, url):
        """Normalize URLs to match current site base without fragments or dynamic tracking query strings."""
        if not url:
            return ""
        parsed = urllib.parse.urlparse(url)
        path = parsed.path or "/"
        # Always uppercase percent-encoded escape sequences per RFC 3986
        path = re.sub(r'%[0-9a-fA-F]{2}', lambda m: m.group(0).upper(), path)
        query = parsed.query
        if query:
            q_pairs = [p for p in query.split("&") if not p.startswith(("utm_", "fbclid", "ref="))]
            query = "&".join(q_pairs)
        return urllib.parse.urlunparse((self.base_scheme, self.base_domain, path, "", query, ""))

    def is_internal_url(self, url):
        """Check if URL belongs to the target WordPress site."""
        if not url:
            return False
        parsed = urllib.parse.urlparse(url)
        if not parsed.netloc:
            return True
        return parsed.netloc.lower() == self.base_domain

    def get_extension(self, url):
        """Extract clean file extension from URL path."""
        path = urllib.parse.urlparse(url).path
        filename = os.path.basename(path)
        if "." in filename:
            return filename.rsplit(".", 1)[-1].lower()
        return ""

    def is_remote_media(self, url):
        """Determine if this asset is a media file that should remain hosted on the original server."""
        ext = self.get_extension(url)
        if ext in self.remote_exts:
            return True
        if "/wp-content/uploads/" in url and ext not in BUNDLED_ASSET_EXTENSIONS:
            return True
        return False

    def get_local_path_for_page(self, page_url):
        """Convert page URL to Cloudflare Pages directory structure (folder/index.html)."""
        path = urllib.parse.urlparse(page_url).path
        # Normalize percent-encoded sequences to uppercase (RFC 3986)
        path = re.sub(r'%[0-9a-fA-F]{2}', lambda m: m.group(0).upper(), path)
        rel_path = path.lstrip("/")
        if self.base_path and rel_path.startswith(self.base_path.lstrip("/")):
            rel_path = rel_path[len(self.base_path.lstrip("/")):].lstrip("/")

        if not rel_path or rel_path == "/":
            return os.path.join(self.output_dir, "index.html")

        rel_path = rel_path.rstrip("/")
        if rel_path.endswith((".html", ".xml", ".txt", ".json")):
            return os.path.join(self.output_dir, rel_path)

        return os.path.join(self.output_dir, rel_path, "index.html")

    def rewrite_to_media_domain(self, url):
        """Rewrite media asset URL to point to origin or dedicated media domain with proper slashes and safe percent-encoding."""
        parsed = urllib.parse.urlparse(url)
        path = parsed.path
        if not path.startswith("/"):
            path = "/" + path

        # Safely quote any non-ASCII / Unicode characters (e.g. Urdu filenames) using RFC 3986 uppercase hex
        path = urllib.parse.quote(urllib.parse.unquote(path), safe="/:?=&@")

        if self.media_domain:
            media_parsed = urllib.parse.urlparse(self.media_domain)
            scheme = media_parsed.scheme or self.base_scheme
            netloc = media_parsed.netloc or self.media_domain.replace("https://", "").replace("http://", "").split("/")[0]
            return urllib.parse.urlunparse((
                scheme,
                netloc,
                path,
                "",
                parsed.query,
                ""
            ))
        return urllib.parse.urlunparse((
            parsed.scheme or self.base_scheme,
            parsed.netloc or self.base_domain,
            path,
            "",
            parsed.query,
            ""
        ))

    def download_and_localize_asset(self, asset_url):
        """Download CSS, JS, and UI fonts, storing them in local static structure."""
        if asset_url in self.asset_cache:
            return self.asset_cache[asset_url]

        if not self.download_media and self.is_remote_media(asset_url):
            remote_url = self.rewrite_to_media_domain(asset_url)
            self.asset_cache[asset_url] = remote_url
            return remote_url

        parsed = urllib.parse.urlparse(asset_url)
        path = parsed.path
        ext = self.get_extension(asset_url)

        # Skip external 3rd party assets (Google Fonts, YouTube)
        if parsed.netloc and parsed.netloc.lower() != self.base_domain:
            self.asset_cache[asset_url] = asset_url
            return asset_url

        clean_path = path.lstrip("/")
        if self.base_path and clean_path.startswith(self.base_path.lstrip("/")):
            clean_path = clean_path[len(self.base_path.lstrip("/")):].lstrip("/")

        local_file_path = os.path.join(self.output_dir, clean_path)
        os.makedirs(os.path.dirname(local_file_path), exist_ok=True)

        fetch_src = urllib.parse.urljoin(self.base_url, path)
        if parsed.query:
            fetch_src += f"?{parsed.query}"

        is_binary = ext in {"woff", "woff2", "ttf", "eot", "otf", "png", "jpg", "jpeg", "webp", "gif", "ico"}
        content, _ = self.fetch_url(fetch_src, is_binary=is_binary)

        if content is None:
            self.asset_cache[asset_url] = asset_url
            return asset_url

        if ext == "css":
            css_text = content if isinstance(content, str) else content.decode("utf-8", errors="replace")
            css_text = self.process_css_content(css_text, fetch_src)
            with open(local_file_path, "w", encoding="utf-8") as f:
                f.write(css_text)
        else:
            mode = "wb" if is_binary else "w"
            with open(local_file_path, mode) as f:
                f.write(content)

        static_url = "/" + clean_path.replace("\\", "/")
        self.asset_cache[asset_url] = static_url
        return static_url

    def process_css_content(self, css_text, css_url):
        """Parse CSS for url(...) references (fonts, background images)."""
        def replace_css_url(match):
            raw_url = match.group(1).strip("'\" \t\r\n")
            if raw_url.startswith("data:") or raw_url.startswith("#"):
                return match.group(0)

            abs_url = urllib.parse.urljoin(css_url, raw_url)
            clean_abs_url = abs_url.split("?")[0].split("#")[0]
            ext = self.get_extension(clean_abs_url)

            if ext in {"woff", "woff2", "ttf", "eot", "otf"}:
                local_url = self.download_and_localize_asset(clean_abs_url)
                return f"url('{local_url}')"
            elif self.is_remote_media(clean_abs_url):
                remote_url = self.rewrite_to_media_domain(clean_abs_url)
                return f"url('{remote_url}')"
            else:
                return match.group(0)

        return re.sub(r'url\s*\(\s*([^\)]+)\s*\)', replace_css_url, css_text)

    def clean_wordpress_html(self, html_content, current_page_url):
        """Remove dynamic bloat, preserve media on origin, localize CSS/JS/fonts, fix links."""
        # 0. Fix missing slash typo in WP customizer (e.g. nq-international.comwp-content)
        html_content = re.sub(r'(https?://[^/"\'\s>]+)wp-content', r'\1/wp-content', html_content)

        # 1. Strip WP Emoji scripts, loader, JSON settings, and inline styles (covers all WP versions up to 6.7+)
        html_content = re.sub(r'<script[^>]*id=["\']wp-emoji-settings["\'][^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        html_content = re.sub(r'<script[^>]*wp-emoji-release\.min\.js[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        html_content = re.sub(r'<script[^>]*wp-emoji-loader\.min\.js[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        html_content = re.sub(r'<script[^>]*>\s*window\._wpemojiSettings\s*=.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        html_content = re.sub(r'<script[^>]*>\s*var e="script#wp-emoji-settings".*?//# sourceURL=[^\n]+', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        html_content = re.sub(r'<style[^>]*id=["\']wp-emoji-styles-inline-css["\'][^>]*>.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

        # 2. Strip WP bloat meta & link tags
        html_content = re.sub(r'<meta[^>]*name=["\']generator["\'][^>]*WordPress[^>]*>', '', html_content, flags=re.IGNORECASE)
        html_content = re.sub(r'<link[^>]*rel=["\']EditURI["\'][^>]*>', '', html_content, flags=re.IGNORECASE)
        html_content = re.sub(r'<link[^>]*rel=["\']wlwmanifest["\'][^>]*>', '', html_content, flags=re.IGNORECASE)
        html_content = re.sub(r'<link[^>]*rel=["\']https://api\.w\.org/["\'][^>]*>', '', html_content, flags=re.IGNORECASE)
        html_content = re.sub(r'<link[^>]*rel=["\']shortlink["\'][^>]*>', '', html_content, flags=re.IGNORECASE)

        # 3. Strip WP Embed & Heartbeat scripts
        html_content = re.sub(r'<script[^>]*wp-embed(\.min)?\.js[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        html_content = re.sub(r'<script[^>]*heartbeat(\.min)?\.js[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

        # 4. Remove WP Admin Bar markup
        html_content = re.sub(r'<div id="wpadminbar"[^>]*>.*?</div>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

        # 5. Fix inline background-image url("...") styles and <style> blocks with improper paths
        def fix_css_urls(text):
            def replace_style_url(u_match):
                u = u_match.group(1).strip("'\" \t\r\n")
                if u.startswith("data:") or u.startswith("#"):
                    return u_match.group(0)
                abs_u = urllib.parse.urljoin(current_page_url, u)
                if self.is_remote_media(abs_u):
                    return f'url("{self.rewrite_to_media_domain(abs_u)}")'
                return u_match.group(0)
            return re.sub(r'url\s*\(\s*([^\)]+)\s*\)', replace_style_url, text)

        def fix_inline_styles(match):
            return f'style="{fix_css_urls(match.group(1))}"'
        html_content = re.sub(r'style="([^"]*background[^"]*)"', fix_inline_styles, html_content, flags=re.IGNORECASE)

        def fix_style_tag(match):
            return f'<style{match.group(1)}>{fix_css_urls(match.group(2))}</style>'
        html_content = re.sub(r'<style\b([^>]*)>(.*?)</style>', fix_style_tag, html_content, flags=re.DOTALL | re.IGNORECASE)

        # 6. Extract search data
        if self.search_index_enabled:
            self.extract_search_record(html_content, current_page_url)

        # 7. Process tags with src or href while PRESERVING all other attributes (rel, class, id, media, alt)
        def replace_tag_element(tag_match):
            full_tag = tag_match.group(0)
            tag_name = tag_match.group(1).lower()

            def replace_attr_val(attr_match):
                attr = attr_match.group(1)
                quote = attr_match.group(2)
                val = attr_match.group(3)

                if val.startswith(("mailto:", "tel:", "javascript:", "#", "data:")):
                    return attr_match.group(0)

                val_no_hash = val.split("#")[0]
                fragment = "#" + val.split("#")[1] if "#" in val else ""
                val_clean = val_no_hash.split("?")[0]
                ext = self.get_extension(val_clean)
                abs_url = urllib.parse.urljoin(current_page_url, val_no_hash)

                # Canonical link
                if tag_name == "link" and 'rel="canonical"' in full_tag.lower():
                    target_host = self.custom_domain or ""
                    parsed = urllib.parse.urlparse(abs_url)
                    path = re.sub(r'%[0-9a-fA-F]{2}', lambda m: m.group(0).upper(), parsed.path)
                    return f'{attr}={quote}{target_host}{path}{quote}'

                # CASE A: Media file (MP3, PPT, JPG, PNG, PDF) -> Point to remote origin
                if self.is_remote_media(abs_url):
                    remote_media_url = self.rewrite_to_media_domain(abs_url)
                    return f'{attr}={quote}{remote_media_url}{fragment}{quote}'

                # CASE B: Bundled static asset (CSS, JS, Fonts) -> Download and serve locally
                if ext in BUNDLED_ASSET_EXTENSIONS:
                    if self.is_internal_url(abs_url):
                        local_asset_url = self.download_and_localize_asset(abs_url)
                        return f'{attr}={quote}{local_asset_url}{fragment}{quote}'
                    return attr_match.group(0)

                # CASE C: Internal navigation links (<a href="...">)
                if attr.lower() == "href" and tag_name == "a":
                    if self.is_internal_url(abs_url):
                        parsed = urllib.parse.urlparse(abs_url)
                        clean_path = parsed.path
                        if self.base_path and clean_path.startswith(self.base_path):
                            clean_path = clean_path[len(self.base_path):]
                        if not clean_path.startswith("/"):
                            clean_path = "/" + clean_path

                        # Always uppercase percent-encoded sequences for Cloudflare Pages (RFC 3986)
                        clean_path = re.sub(r'%[0-9a-fA-F]{2}', lambda m: m.group(0).upper(), clean_path)

                        if clean_path != "/" and not clean_path.endswith((".html", ".xml", ".txt", ".json", "/")):
                            clean_path += "/"

                        new_url = clean_path
                        if parsed.query:
                            new_url += f"?{parsed.query}"
                        new_url += fragment
                        return f'{attr}={quote}{new_url}{quote}'

                # Fallback: If src contains non-ASCII characters, safely quote them
                if attr.lower() == "src":
                    try:
                        val.encode("ascii")
                    except UnicodeEncodeError:
                        val_quoted = urllib.parse.quote(urllib.parse.unquote(val), safe="/:?=&@")
                        return f'{attr}={quote}{val_quoted}{quote}'

                return attr_match.group(0)

            return re.sub(r'\b(src|href)=(["\'])(.*?)\2', replace_attr_val, full_tag, flags=re.IGNORECASE)

        html_content = re.sub(r'<([a-zA-Z0-9]+)\b[^>]*>', replace_tag_element, html_content, flags=re.IGNORECASE)

        # 8. Rewrite srcset attributes for responsive images
        def replace_srcset(match):
            srcset_val = match.group(1)
            candidates = srcset_val.split(",")
            new_candidates = []
            for cand in candidates:
                cand = cand.strip()
                if not cand:
                    continue
                parts = cand.split()
                img_url = parts[0]
                descriptor = " " + parts[1] if len(parts) > 1 else ""
                abs_url = urllib.parse.urljoin(current_page_url, img_url)

                if self.is_remote_media(abs_url):
                    new_url = self.rewrite_to_media_domain(abs_url)
                else:
                    new_url = img_url
                new_candidates.append(f"{new_url}{descriptor}")
            return f'srcset="{", ".join(new_candidates)}"'

        html_content = re.sub(r'srcset=["\'](.*?)["\']', replace_srcset, html_content, flags=re.IGNORECASE)

        # 9. Inject client-side search engine before </body>
        if self.search_index_enabled and "</body>" in html_content:
            search_script = """
<!-- Cloudflare Static Search Client -->
<script>
(function() {
    window.WPStaticSearch = {
        index: null,
        async loadIndex() {
            if (this.index) return this.index;
            try {
                const res = await fetch('/search-index.json');
                this.index = await res.json();
                return this.index;
            } catch (e) {
                console.warn('Search index could not be loaded', e);
                return [];
            }
        },
        async search(query) {
            const data = await this.loadIndex();
            const q = query.toLowerCase().trim();
            if (!q) return [];
            return data.filter(item => 
                (item.title && item.title.toLowerCase().includes(q)) || 
                (item.excerpt && item.excerpt.toLowerCase().includes(q))
            );
        }
    };
})();
</script>
</body>
"""
            html_content = html_content.replace("</body>", search_script)

        return html_content

    def extract_search_record(self, html_content, url):
        """Extract title and text excerpt for client-side search indexing."""
        title_match = re.search(r'<title>(.*?)</title>', html_content, flags=re.IGNORECASE | re.DOTALL)
        title = title_match.group(1).split("–")[0].split("-")[0].strip() if title_match else ""

        text = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = ' '.join(text.split())[:300]

        path = urllib.parse.urlparse(url).path
        if self.base_path and path.startswith(self.base_path):
            path = path[len(self.base_path):]
        if not path:
            path = "/"

        if title and path not in [r["url"] for r in self.search_records]:
            self.search_records.append({
                "title": title,
                "url": path,
                "excerpt": text
            })

    def process_page(self, page_url):
        """Fetch and convert a single page to static HTML."""
        html_raw, status = self.fetch_url(page_url)
        if not html_raw:
            self.failed_pages.add((page_url, status))
            return False, f"Failed: {status}"

        cleaned_html = self.clean_wordpress_html(html_raw, page_url)
        dest_path = self.get_local_path_for_page(page_url)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        with open(dest_path, "w", encoding="utf-8") as f:
            f.write(cleaned_html)

        self.processed_pages.add(page_url)
        return True, dest_path

    def generate_cloudflare_headers(self):
        """Generate Cloudflare Pages _headers file for caching and security."""
        headers_file = os.path.join(self.output_dir, "_headers")
        content = """/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/wp-content/themes/*
  Cache-Control: public, max-age=31536000, immutable
/wp-includes/*
  Cache-Control: public, max-age=31536000, immutable
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
/*.woff
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
"""
        with open(headers_file, "w", encoding="utf-8") as f:
            f.write(content)
        self.log("Created Cloudflare Pages _headers file.", "🛡️")

        # Generate Cloudflare Pages _redirects file for resilient URL handling
        redirects_file = os.path.join(self.output_dir, "_redirects")
        redirects_content = """# Cloudflare Pages Redirects & Rewrites (Option C)
# 200 Rewrites proxy locally to ensure case-insensitive & Unicode routes match seamlessly
/audios/emaaniyat-%d8%a7%db%8c%d9%85%d8%a7%d9%86%db%8c%d8%a7%d8%aa/* /audios/emaaniyat-%D8%A7%DB%8C%D9%85%D8%A7%D9%86%DB%8C%D8%A7%D8%AA/:splat 200
/audios/emaaniyat-ایمانیات/* /audios/emaaniyat-%D8%A7%DB%8C%D9%85%D8%A7%D9%86%DB%8C%D8%A7%D8%AA/:splat 200

/audios/islamic-months/rabi-ul-awwal-%d8%b1%d8%a8%db%8c%d8%b9-%d8%a7%d9%84%d8%a7%d9%88%d9%91%d9%84/* /audios/islamic-months/rabi-ul-awwal-%D8%B1%D8%A8%DB%8C%D8%B9-%D8%A7%D9%84%D8%A7%D9%88%D9%91%D9%84/:splat 200
/audios/islamic-months/rabi-ul-awwal-ربیع-الاوّل/* /audios/islamic-months/rabi-ul-awwal-%D8%B1%D8%A8%DB%8C%D8%B9-%D8%A7%D9%84%D8%A7%D9%88%D9%91%D9%84/:splat 200

/audios/islamic-months/muharram-%d9%85%d8%ad%d8%b1%d9%91%d9%85/* /audios/islamic-months/muharram-%D9%85%D8%AD%D8%B1%D9%91%D9%85/:splat 200
/audios/islamic-months/muharram-محرّم/* /audios/islamic-months/muharram-%D9%85%D8%AD%D8%B1%D9%91%D9%85/:splat 200

/audios/worships/zakat-%d8%b2%da%a9%d8%a7%db%83/* /audios/worships/zakat-%D8%B2%DA%A9%D8%A7%DB%83/:splat 200
/audios/worships/zakat-زکاۃ/* /audios/worships/zakat-%D8%B2%DA%A9%D8%A7%DB%83/:splat 200
"""
        with open(redirects_file, "w", encoding="utf-8") as f:
            f.write(redirects_content)
        self.log("Created Cloudflare Pages _redirects file.", "🔀")

        # Copy _worker.js into output_dir
        worker_src = os.path.join(os.path.dirname(__file__), "_worker.js")
        if os.path.exists(worker_src):
            shutil.copy2(worker_src, os.path.join(self.output_dir, "_worker.js"))
            self.log("Installed Cloudflare Pages _worker.js (Scenario B media reverse proxy).", "⚡")

    def generate_unicode_route_mirrors(self):
        """Create dual directory mirrors for decoded Unicode characters (e.g. emaaniyat-ایمانیات alongside emaaniyat-%D8...)."""
        mirrored_count = 0
        for root, dirs, files in os.walk(self.output_dir):
            for d in list(dirs):
                if "%" in d:
                    decoded = urllib.parse.unquote(d)
                    if decoded != d:
                        src_dir = os.path.join(root, d)
                        dest_dir = os.path.join(root, decoded)
                        if not os.path.exists(dest_dir):
                            try:
                                shutil.copytree(src_dir, dest_dir)
                                mirrored_count += 1
                            except Exception as e:
                                self.log(f"Could not mirror Unicode route {decoded}: {e}", "⚠️")
        if mirrored_count > 0:
            self.log(f"Mirrored {mirrored_count} decoded Unicode route directories for universal browser compatibility.", "🌐")

    def generate_static_404(self):
        """Generate a clean 404.html page for Cloudflare Pages."""
        dest_404 = os.path.join(self.output_dir, "404.html")
        if not os.path.exists(dest_404):
            test_404_url = f"{self.base_url}/non-existent-page-404-test/"
            html_raw, _ = self.fetch_url(test_404_url)
            if html_raw and "404" in html_raw:
                cleaned = self.clean_wordpress_html(html_raw, test_404_url)
                with open(dest_404, "w", encoding="utf-8") as f:
                    f.write(cleaned)
                self.log("Exported native WordPress 404 template to 404.html", "📄")
            else:
                simple_404 = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><title>Page Not Found</title>
  <style>body{font-family:sans-serif;text-align:center;padding:50px;color:#333}h1{font-size:48px}a{color:#0073aa}</style>
</head>
<body>
  <h1>404</h1>
  <p>The page you requested could not be found.</p>
  <p><a href="/">Return to Homepage</a></p>
</body>
</html>"""
                with open(dest_404, "w", encoding="utf-8") as f:
                    f.write(simple_404)
                self.log("Created standard 404.html page.", "📄")

    def save_search_index(self):
        """Save search records to search-index.json."""
        if not self.search_records:
            return
        index_file = os.path.join(self.output_dir, "search-index.json")
        with open(index_file, "w", encoding="utf-8") as f:
            json.dump(self.search_records, f, ensure_ascii=False, indent=2)
        self.log(f"Generated search index with {len(self.search_records)} pages: /search-index.json", "🔍")

    def run(self):
        """Execute full conversion pipeline."""
        start_time = time.time()
        print("=" * 70)
        print("  ⚡ WordPress to Static Converter for Cloudflare Pages")
        print("=" * 70)
        self.log(f"Origin WordPress URL : {self.base_url}")
        self.log(f"Output Directory     : {self.output_dir}")
        self.log(f"Remote Media Domain  : {self.media_domain}")
        self.log(f"Media Offloading     : {'ACTIVE (MP3/PPT/Images stay remote)' if not self.download_media else 'INACTIVE (downloading all)'}")
        print("-" * 70)

        urls = self.discover_from_sitemaps()
        if not urls:
            self.log("No URLs discovered from sitemaps. Using root URL only.", "⚠️")
            urls = [self.base_url + "/"]

        if self.limit:
            self.log(f"Testing mode enabled: Limiting crawl to first {self.limit} URLs.", "🧪")
            urls = urls[:self.limit]

        total = len(urls)
        self.log(f"Starting conversion of {total} pages with {self.concurrency} worker threads...", "🚀")

        with ThreadPoolExecutor(max_workers=self.concurrency) as executor:
            future_to_url = {executor.submit(self.process_page, u): u for u in urls}
            completed = 0
            for future in as_completed(future_to_url):
                completed += 1
                url = future_to_url[future]
                try:
                    success, res = future.result()
                    status_icon = "✅" if success else "❌"
                    path_display = urllib.parse.urlparse(url).path or "/"
                    print(f"[{completed}/{total}] {status_icon} {path_display} -> {res if success else ''}")
                except Exception as e:
                    print(f"[{completed}/{total}] ❌ {url} -> Exception: {e}")

        self.generate_cloudflare_headers()
        self.generate_unicode_route_mirrors()
        self.generate_static_404()
        if self.search_index_enabled:
            self.save_search_index()

        elapsed = time.time() - start_time
        print("=" * 70)
        self.log(f"Conversion Complete in {elapsed:.2f} seconds!", "🎉")
        self.log(f"Successfully converted : {len(self.processed_pages)} pages")
        if self.failed_pages:
            self.log(f"Failed pages           : {len(self.failed_pages)} (see below)", "⚠️")
            for f_url, reason in list(self.failed_pages)[:5]:
                print(f"   - {f_url} ({reason})")
        self.log(f"Assets downloaded      : {len(self.asset_cache)} (CSS/JS/Fonts)")
        self.log(f"Destination folder     : {self.output_dir}")
        print("=" * 70)
        print("\n👉 Next Steps for Cloudflare Pages:")
        print(f"1. In Cloudflare Dashboard, go to 'Workers & Pages' > 'Create Application' > 'Pages'")
        print(f"2. Choose 'Upload Assets' and drag the folder: {self.output_dir}")
        print(f"3. Your static site is live with 0 PHP, 0 MySQL, and high-speed edge caching!\n")


def main():
    parser = argparse.ArgumentParser(
        description="Convert WordPress into 100% static HTML for Cloudflare Pages with Remote Media Offloading."
    )
    parser.add_argument("--url", default="https://nq-international.com",
                        help="WordPress site URL (default: https://nq-international.com)")
    parser.add_argument("--output", default="./dist",
                        help="Output directory for static site (default: ./dist)")
    parser.add_argument("--media-domain", default=None,
                        help="Domain where MP3/PPT/images remain hosted (default: matches --url)")
    parser.add_argument("--custom-domain", default=None,
                        help="Target domain for the static site (e.g. https://www.nq-international.com)")
    parser.add_argument("--download-media", action="store_true",
                        help="Download all media locally instead of keeping remote (warning: large file sizes)")
    parser.add_argument("--concurrency", type=int, default=6,
                        help="Number of concurrent download threads (default: 6)")
    parser.add_argument("--limit", type=int, default=None,
                        help="Limit number of pages to convert (useful for quick test runs)")
    parser.add_argument("--urls", nargs="*", default=None,
                        help="Specific page URLs to convert instead of sitemaps")
    parser.add_argument("--no-search", action="store_true",
                        help="Disable client-side search index generation")

    args = parser.parse_args()

    converter = WPStaticConverter(
        base_url=args.url,
        output_dir=args.output,
        media_domain=args.media_domain,
        download_media=args.download_media,
        search_index=not args.no_search,
        concurrency=args.concurrency,
        limit=args.limit,
        custom_domain=args.custom_domain,
        specific_urls=args.urls
    )
    converter.run()


if __name__ == "__main__":
    main()
