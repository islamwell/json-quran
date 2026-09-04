=== WP Static Clean Converter (Cloudflare Edition) ===
Contributors: devassistant
Tags: static, cloudflare, html export, performance, security
Requires at least: 5.6
Tested up to: 6.7
Stable tag: 1.0.0
License: GPLv2 or later

Convert WordPress into a 100% static website without PHP or a MySQL database, designed for Cloudflare Pages.

== Description ==

This plugin solves the biggest headaches when converting WordPress to static:
1. Keeps heavy media (MP3, PPT, JPG, PNG, PDF) hosted on your original server so you don't breach Cloudflare's 25MB file limit.
2. Removes WordPress dynamic bloat (wp-emoji, heartbeat, embeds, RSD, generator tags).
3. Rewrites internal navigation links to clean static folder URLs (/page/index.html).
4. Generates a 1-click downloadable ZIP archive ready for Cloudflare Pages.

== Installation ==

1. Upload the `wp-static-converter` folder to `/wp-content/plugins/`.
2. Activate the plugin in WordPress under Plugins.
3. Go to Tools > Static Converter.
4. Click 'Start Static Conversion' and download the ZIP file!
