<?php
/**
 * Plugin Name: WP Static Clean Converter (Cloudflare Edition)
 * Plugin URI:  https://github.com/wp-static-clean
 * Description: Converts WordPress into 100% static HTML, CSS, JS and fonts for Cloudflare Pages, with automatic remote media offloading (MP3, JPG, PPT stay hosted on origin) and bloat removal.
 * Version:     1.0.0
 * Author:      Dev Assistant
 * Text Domain: wp-static-clean
 */

if (!defined('ABSPATH')) {
    exit;
}

class WP_Static_Clean_Converter {
    const OPTION_KEY = 'wpsc_converter_settings';
    
    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('wp_ajax_wpsc_get_urls', [$this, 'ajax_get_urls']);
        add_action('wp_ajax_wpsc_process_batch', [$this, 'ajax_process_batch']);
        add_action('wp_ajax_wpsc_finalize_zip', [$this, 'ajax_finalize_zip']);
    }

    public function add_admin_menu() {
        add_management_page(
            'Static Site Converter',
            'Static Converter',
            'manage_options',
            'wp-static-converter',
            [$this, 'render_admin_page']
        );
    }

    public function register_settings() {
        register_setting('wpsc_settings_group', self::OPTION_KEY);
    }

    private function get_settings() {
        $defaults = [
            'remote_media'      => 1,
            'media_domain'      => home_url(),
            'target_domain'     => '',
            'strip_bloat'       => 1,
            'gen_search_index'  => 1,
            'remote_extensions' => 'mp3,m4a,ppt,pptx,jpg,jpeg,png,webp,gif,pdf,mp4,zip'
        ];
        return wp_parse_args(get_option(self::OPTION_KEY, []), $defaults);
    }

    public function render_admin_page() {
        $settings = $this->get_settings();
        ?>
        <div class="wrap" style="max-width: 900px;">
            <h1>⚡ WP Static Site Converter (Cloudflare Edition)</h1>
            <p>Convert your WordPress site into 100% static HTML for <strong>Cloudflare Pages</strong> with zero PHP and zero database. Keep heavy audio (MP3), slides (PPT), and images hosted right here on this server!</p>
            
            <div style="background:#fff; border:1px solid #ccd0d4; padding:20px; border-radius:8px; margin-top:20px;">
                <h2>⚙️ Export Configuration</h2>
                <form id="wpsc-settings-form">
                    <table class="form-table">
                        <tr>
                            <th scope="row">Media Offloading</th>
                            <td>
                                <label>
                                    <input type="checkbox" id="wpsc_remote_media" name="remote_media" value="1" <?php checked($settings['remote_media'], 1); ?>>
                                    <strong>Keep heavy media hosted remotely</strong> (recommended for Cloudflare Pages 25MB limit)
                                </label>
                                <p class="description">MP3 audios, PPT slides, PDFs, and images will stay hosted on this server. Only HTML, CSS, JS, and fonts are exported.</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Media Origin Domain</th>
                            <td>
                                <input type="url" id="wpsc_media_domain" name="media_domain" value="<?php echo esc_attr($settings['media_domain']); ?>" class="regular-text">
                                <p class="description">The URL where media files will be loaded from (e.g. <code><?php echo home_url(); ?></code> or <code>https://media.yourdomain.com</code>).</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Remote File Extensions</th>
                            <td>
                                <input type="text" id="wpsc_remote_extensions" name="remote_extensions" value="<?php echo esc_attr($settings['remote_extensions']); ?>" class="large-text">
                                <p class="description">Comma-separated list of file extensions that stay remote.</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Optimization & Bloat Removal</th>
                            <td>
                                <label><input type="checkbox" id="wpsc_strip_bloat" name="strip_bloat" value="1" <?php checked($settings['strip_bloat'], 1); ?>> Strip WordPress bloat (wp-emoji, heartbeat, embeds, RSD, generator tags)</label><br>
                                <label><input type="checkbox" id="wpsc_gen_search" name="gen_search_index" value="1" <?php checked($settings['gen_search_index'], 1); ?>> Generate client-side static search index (<code>/search-index.json</code>)</label>
                            </td>
                        </tr>
                    </table>

                    <div style="margin-top:20px; padding-top:15px; border-top:1px solid #eee;">
                        <button type="button" id="wpsc-start-btn" class="button button-primary button-hero">🚀 Start Static Conversion</button>
                    </div>
                </form>
            </div>

            <!-- Progress Box -->
            <div id="wpsc-progress-box" style="display:none; background:#fff; border:1px solid #ccd0d4; padding:20px; border-radius:8px; margin-top:20px;">
                <h3 id="wpsc-progress-title">⏳ Crawling and converting site...</h3>
                <div style="background:#e0e0e0; border-radius:4px; height:22px; overflow:hidden; margin:15px 0;">
                    <div id="wpsc-progress-bar" style="background:#2271b1; height:100%; width:0%; transition: width 0.2s;"></div>
                </div>
                <div id="wpsc-progress-status" style="font-family:monospace; font-size:13px; color:#555;">Initializing...</div>
                <div id="wpsc-result-actions" style="display:none; margin-top:20px;">
                    <a id="wpsc-download-zip" href="#" class="button button-primary button-hero">📥 Download Static ZIP for Cloudflare Pages</a>
                </div>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            let urlsToProcess = [];
            let processedCount = 0;
            let exportSessionId = 'wpsc_' + Date.now();

            $('#wpsc-start-btn').on('click', function() {
                $(this).prop('disabled', true);
                $('#wpsc-progress-box').slideDown();
                $('#wpsc-progress-status').text('Discovering WordPress URLs...');

                $.post(ajaxurl, {
                    action: 'wpsc_get_urls',
                    _ajax_nonce: '<?php echo wp_create_nonce("wpsc_nonce"); ?>'
                }, function(res) {
                    if (res.success && res.data.urls.length) {
                        urlsToProcess = res.data.urls;
                        processedCount = 0;
                        $('#wpsc-progress-status').text('Found ' + urlsToProcess.length + ' pages. Beginning conversion...');
                        processBatch();
                    } else {
                        $('#wpsc-progress-status').text('Error finding URLs: ' + (res.data || 'unknown error'));
                    }
                });
            });

            function processBatch() {
                if (urlsToProcess.length === 0) {
                    finalizeZip();
                    return;
                }

                let batch = urlsToProcess.splice(0, 5); // 5 pages at a time
                $.post(ajaxurl, {
                    action: 'wpsc_process_batch',
                    urls: batch,
                    session_id: exportSessionId,
                    remote_media: $('#wpsc_remote_media').is(':checked') ? 1 : 0,
                    media_domain: $('#wpsc_media_domain').val(),
                    remote_exts: $('#wpsc_remote_extensions').val(),
                    strip_bloat: $('#wpsc_strip_bloat').is(':checked') ? 1 : 0,
                    gen_search: $('#wpsc_gen_search').is(':checked') ? 1 : 0,
                    _ajax_nonce: '<?php echo wp_create_nonce("wpsc_nonce"); ?>'
                }, function(res) {
                    processedCount += batch.length;
                    let total = processedCount + urlsToProcess.length;
                    let pct = Math.round((processedCount / total) * 100);
                    $('#wpsc-progress-bar').css('width', pct + '%');
                    $('#wpsc-progress-status').text('Converted ' + processedCount + ' of ' + total + ' pages (' + pct + '%)...');
                    processBatch();
                }).fail(function() {
                    $('#wpsc-progress-status').text('Batch error encountered, continuing...');
                    processBatch();
                });
            }

            function finalizeZip() {
                $('#wpsc-progress-status').text('Creating Cloudflare Pages ZIP package...');
                $.post(ajaxurl, {
                    action: 'wpsc_finalize_zip',
                    session_id: exportSessionId,
                    _ajax_nonce: '<?php echo wp_create_nonce("wpsc_nonce"); ?>'
                }, function(res) {
                    if (res.success && res.data.zip_url) {
                        $('#wpsc-progress-bar').css('width', '100%');
                        $('#wpsc-progress-title').text('✅ Static Conversion Complete!');
                        $('#wpsc-progress-status').html('All pages converted. Zero PHP. Ready for Cloudflare Pages.');
                        $('#wpsc-download-zip').attr('href', res.data.zip_url);
                        $('#wpsc-result-actions').show();
                    } else {
                        $('#wpsc-progress-status').text('Failed to build ZIP: ' + (res.data || 'unknown error'));
                    }
                });
            }
        });
        </script>
        <?php
    }

    public function ajax_get_urls() {
        check_ajax_referer('wpsc_nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        $urls = [];
        $urls[] = home_url('/');

        // Get all published posts, pages, custom post types
        $post_types = get_post_types(['public' => true], 'names');
        $query = new WP_Query([
            'post_type'      => $post_types,
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids'
        ]);

        foreach ($query->posts as $post_id) {
            $permalink = get_permalink($post_id);
            if ($permalink) {
                $urls[] = $permalink;
            }
        }

        // Get categories and tags
        $taxonomies = get_taxonomies(['public' => true], 'names');
        foreach ($taxonomies as $taxonomy) {
            $terms = get_terms(['taxonomy' => $taxonomy, 'hide_empty' => true]);
            if (!is_wp_error($terms)) {
                foreach ($terms as $term) {
                    $tlink = get_term_link($term);
                    if (!is_wp_error($tlink)) {
                        $urls[] = $tlink;
                    }
                }
            }
        }

        $urls = array_values(array_unique($urls));
        wp_send_json_success(['urls' => $urls]);
    }

    public function ajax_process_batch() {
        check_ajax_referer('wpsc_nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        $urls = isset($_POST['urls']) ? (array)$_POST['urls'] : [];
        $session_id = sanitize_key($_POST['session_id'] ?? 'wpsc_export');
        $remote_media = !empty($_POST['remote_media']);
        $media_domain = esc_url_raw($_POST['media_domain'] ?? home_url());
        $remote_exts_raw = sanitize_text_field($_POST['remote_exts'] ?? 'mp3,ppt,pptx,jpg,jpeg,png,webp,gif,pdf');
        $remote_exts = array_filter(array_map('trim', explode(',', strtolower($remote_exts_raw))));
        $strip_bloat = !empty($_POST['strip_bloat']);

        $upload_dir = wp_upload_dir();
        $export_root = trailingslashit($upload_dir['basedir']) . 'wpsc-exports/' . $session_id;
        wp_mkdir_p($export_root);

        foreach ($urls as $url) {
            $response = wp_remote_get($url, [
                'timeout'   => 20,
                'sslverify' => false,
                'headers'   => ['X-WP-Static-Export' => '1']
            ]);

            if (is_wp_error($response)) {
                continue;
            }

            $html = wp_remote_retrieve_body($response);
            if (!$html) {
                continue;
            }

            // 1. Strip WP bloat if enabled
            if ($strip_bloat) {
                $html = preg_replace('/<script[^>]*id=["\']wp-emoji-settings["\'][^>]*>.*?<\/script>/is', '', $html);
                $html = preg_replace('/<script[^>]*wp-emoji-release\.min\.js[^>]*>.*?<\/script>/is', '', $html);
                $html = preg_replace('/<script[^>]*>\s*window\._wpemojiSettings\s*=.*?<\/script>/is', '', $html);
                $html = preg_replace('/<style[^>]*id=["\']wp-emoji-styles-inline-css["\'][^>]*>.*?<\/style>/is', '', $html);
                $html = preg_replace('/<meta[^>]*name=["\']generator["\'][^>]*WordPress[^>]*>/i', '', $html);
                $html = preg_replace('/<link[^>]*rel=["\'](EditURI|wlwmanifest|https:\/\/api\.w\.org\/|shortlink)["\'][^>]*>/i', '', $html);
                $html = preg_replace('/<script[^>]*wp-embed(\.min)?\.js[^>]*>.*?<\/script>/is', '', $html);
                $html = preg_replace('/<div id="wpadminbar"[^>]*>.*?<\/div>/is', '', $html);
            }

            // 2. Rewrite URLs & media
            $base_url = home_url();
            $media_pattern = '/\b(src|href)=([\'"])(https?:\/\/[^\'"]+\.(' . implode('|', $remote_exts) . ')([\?#][^\'"]*)?)\2/i';
            $html = preg_replace_callback($media_pattern, function($m) use ($base_url, $media_domain) {
                $orig_url = $m[3];
                $new_url = str_replace($base_url, $media_domain, $orig_url);
                return $m[1] . '=' . $m[2] . $new_url . $m[2];
            }, $html);

            // 3. Rewrite internal navigation links to root-relative clean paths
            $html = preg_replace_callback('/<a\s+[^>]*\bhref=([\'"])(' . preg_quote($base_url, '/') . '([^\'"#\?]*)([\?#][^\'"]*)?)\1/i', function($m) {
                $path = $m[3] ?: '/';
                if ($path !== '/' && substr($path, -1) !== '/' && !preg_match('/\.(html|xml|json|txt)$/', $path)) {
                    $path .= '/';
                }
                return str_replace($m[2], $path . ($m[4] ?? ''), $m[0]);
            }, $html);

            // 4. Save file in directory structure (e.g. /audios/ireland/index.html)
            $parsed = parse_url($url);
            $path = trim($parsed['path'] ?? '', '/');
            if (empty($path)) {
                $dest_file = $export_root . '/index.html';
            } else {
                $dest_dir = $export_root . '/' . $path;
                wp_mkdir_p($dest_dir);
                $dest_file = $dest_dir . '/index.html';
            }

            file_put_contents($dest_file, $html);
        }

        wp_send_json_success(['processed' => count($urls)]);
    }

    public function ajax_finalize_zip() {
        check_ajax_referer('wpsc_nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        $session_id = sanitize_key($_POST['session_id'] ?? 'wpsc_export');
        $upload_dir = wp_upload_dir();
        $export_root = trailingslashit($upload_dir['basedir']) . 'wpsc-exports/' . $session_id;

        if (!is_dir($export_root)) {
            wp_send_json_error('Export folder not found.');
        }

        // Add Cloudflare _headers file
        file_put_contents($export_root . '/_headers', "/*\n  X-Content-Type-Options: nosniff\n/*.html\n  Cache-Control: public, max-age=0, must-revalidate\n");

        // Create Zip
        $zip_file = trailingslashit($upload_dir['basedir']) . 'wpsc-exports/' . $session_id . '.zip';
        $zip_url  = trailingslashit($upload_dir['baseurl']) . 'wpsc-exports/' . $session_id . '.zip';

        if (class_exists('ZipArchive')) {
            $zip = new ZipArchive();
            if ($zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
                $files = new RecursiveIteratorIterator(
                    new RecursiveDirectoryIterator($export_root, RecursiveDirectoryIterator::SKIP_DOTS),
                    RecursiveIteratorIterator::LEAVES_ONLY
                );
                foreach ($files as $file) {
                    if (!$file->isDir()) {
                        $filePath = $file->getRealPath();
                        $relativePath = substr($filePath, strlen($export_root) + 1);
                        $zip->addFile($filePath, $relativePath);
                    }
                }
                $zip->close();
                wp_send_json_success(['zip_url' => $zip_url]);
                return;
            }
        }

        wp_send_json_error('ZipArchive extension not enabled on this server.');
    }
}

new WP_Static_Clean_Converter();
