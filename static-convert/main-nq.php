<?php
/**
 * Plugin Name: NQ Static Site Generator
 * Description: Generates clean static files for nurulquran.com with auto-sync — no ?ver= in filenames, no broken paths, no double domains.
 * Version: 3.0
 * Author: NurulQuran
 */

if (!defined('ABSPATH'))
    exit;

// ─────────────────────────────────────────────
// CONFIGURATION — Edit these if paths change
// ─────────────────────────────────────────────
define('NQ_STATIC_OUTPUT', '/var/www/vhosts/nurulquranlive.com/fast.nurulquran.com/httpdocs/static-export');
define('NQ_SOURCE_BASE', '/var/www/vhosts/nurulquranlive.com/fast.nurulquran.com/httpdocs');
define('NQ_SOURCE_DOMAIN', 'fast.nurulquran.com');
define('NQ_TARGET_DOMAIN', 'nurulquran.com');
define('NQ_TARGET_DOCROOT', '/var/www/vhosts/nurulquranlive.com/nurulquran.com/httpdocs');
define('NQ_STATIC_LOG', WP_CONTENT_DIR . '/nq-static-generator.log');
define('NQ_MAX_LOG_SIZE', 512 * 1024); // 512KB max log before rotating
define('NQ_SYNC_INTERVAL', 600); // 10 minutes in seconds
define('NQ_SYNC_STATE_FILE', WP_CONTENT_DIR . '/nq-sync-state.json');
define('NQ_SYNC_LOCK_FILE', WP_CONTENT_DIR . '/nq-sync.lock');

// Allowed file extensions to copy — NO PHP, NO SQL
define('NQ_ALLOWED_EXTENSIONS', [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'svg',
    'ico',
    'apng',
    'avif',
    'bmp',
    'tif',
    'tiff',
    'woff',
    'woff2',
    'ttf',
    'eot',
    'otf',
    'mp3',
    'mp4',
    'webm',
    'ogg',
    'wav',
    'm4a',
    'pdf',
    'css',
    'js',
    'map',
    'htc',
    'cur',
    'json',
    'xml',
    'txt',
    'zip', // downloadable zips only — not PHP zips
]);

// ─────────────────────────────────────────────
// AUTO-SYNC CRON SETUP
// ─────────────────────────────────────────────
define('NQ_SYNC_BATCH_SIZE', 5);      // Max pages per sync tick (prevents resource exhaustion)
define('NQ_SYNC_TIME_LIMIT', 60);     // Max seconds per sync run (stay within PHP-FPM limits)
define('NQ_SYNC_BATCH_STATE', WP_CONTENT_DIR . '/nq-sync-batch.json'); // Tracks batched progress

add_filter('cron_schedules', function ($schedules) {
    $schedules['nq_ten_minutes'] = [
        'interval' => NQ_SYNC_INTERVAL,
        'display' => 'Every 10 Minutes (NQ Auto-Sync)',
    ];
    return $schedules;
});

// Schedule cron on init if not already scheduled
add_action('init', function () {
    if (get_option('nq_sync_enabled', true) && !wp_next_scheduled('nq_auto_sync_hook')) {
        wp_schedule_event(time(), 'nq_ten_minutes', 'nq_auto_sync_hook');
    }
});

// Clean up cron on plugin deactivation
register_deactivation_hook(__FILE__, function () {
    wp_clear_scheduled_hook('nq_auto_sync_hook');
});

// The auto-sync cron handler — spawns a non-blocking background request
// so that WP-Cron doesn't block the visitor's page load
add_action('nq_auto_sync_hook', 'nq_auto_sync_spawn');

// Background endpoint for the actual sync work
add_action('wp_ajax_nopriv_nq_bg_sync', 'nq_auto_sync');
add_action('wp_ajax_nq_bg_sync', 'nq_auto_sync');

// ─────────────────────────────────────────────
// STARTUP CHECKS
// ─────────────────────────────────────────────
add_action('admin_init', function () {
    // Warn if output directory is missing or not writable
    if (!is_dir(NQ_STATIC_OUTPUT)) {
        add_action('admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>NQ Static Generator:</strong> Output directory does not exist: <code>' . NQ_STATIC_OUTPUT . '</code>. Please create it first.</p></div>';
        });
    } elseif (!is_writable(NQ_STATIC_OUTPUT)) {
        add_action('admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>NQ Static Generator:</strong> Output directory is not writable: <code>' . NQ_STATIC_OUTPUT . '</code>. Run: <code>chown -R ' . get_current_user() . ' ' . NQ_STATIC_OUTPUT . '</code></p></div>';
        });
    }

    if (!is_dir(NQ_SOURCE_BASE)) {
        add_action('admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>NQ Static Generator:</strong> Source WordPress directory not found: <code>' . NQ_SOURCE_BASE . '</code></p></div>';
        });
    }

    if (!is_dir(NQ_TARGET_DOCROOT)) {
        add_action('admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>NQ Static Generator:</strong> Target docroot does not exist: <code>' . NQ_TARGET_DOCROOT . '</code></p></div>';
        });
    } elseif (!is_writable(NQ_TARGET_DOCROOT)) {
        add_action('admin_notices', function () {
            echo '<div class="notice notice-warning"><p><strong>NQ Static Generator:</strong> Target docroot is not writable: <code>' . NQ_TARGET_DOCROOT . '</code>. Auto-sync will fail.</p></div>';
        });
    }
});

// ─────────────────────────────────────────────
// ADMIN MENU
// ─────────────────────────────────────────────
add_action('admin_menu', function () {
    add_menu_page(
        'NQ Static Generator',
        'Static Generator',
        'manage_options',
        'nq-static-generator',
        'nq_static_admin_page',
        'dashicons-download',
        30
    );
});

// ─────────────────────────────────────────────
// ADMIN PAGE
// ─────────────────────────────────────────────
function nq_static_admin_page()
{
    // Check output dir writable before rendering
    $output_ok = is_dir(NQ_STATIC_OUTPUT) && is_writable(NQ_STATIC_OUTPUT);
    $source_ok = is_dir(NQ_SOURCE_BASE);
    $target_ok = is_dir(NQ_TARGET_DOCROOT) && is_writable(NQ_TARGET_DOCROOT);
    $sync_enabled = (bool) get_option('nq_sync_enabled', true);
    $last_sync = get_option('nq_last_sync', []);
    $next_sync = wp_next_scheduled('nq_auto_sync_hook');
    ?>
    <div class="wrap">
        <h1>🕌 NQ Static Site Generator v3.0</h1>

        <table class="widefat" style="margin-bottom:15px">
            <tr>
                <td><strong>Output directory:</strong></td>
                <td><code><?php echo NQ_STATIC_OUTPUT; ?></code></td>
                <td><?php echo $output_ok ? '✅ OK' : '❌ Missing or not writable'; ?></td>
            </tr>
            <tr>
                <td><strong>Source WordPress:</strong></td>
                <td><code><?php echo NQ_SOURCE_BASE; ?></code></td>
                <td><?php echo $source_ok ? '✅ OK' : '❌ Not found'; ?></td>
            </tr>
            <tr>
                <td><strong>Domain replacement:</strong></td>
                <td><code><?php echo NQ_SOURCE_DOMAIN; ?></code> → <code><?php echo NQ_TARGET_DOMAIN; ?></code></td>
                <td>✅ Active</td>
            </tr>
            <tr>
                <td><strong>Target docroot:</strong></td>
                <td><code><?php echo NQ_TARGET_DOCROOT; ?></code></td>
                <td><?php echo $target_ok ? '✅ OK' : '❌ Missing or not writable'; ?></td>
            </tr>
            <tr>
                <td><strong>Auto-Sync:</strong></td>
                <td>
                    Every <?php echo NQ_SYNC_INTERVAL / 60; ?> min (batch: <?php echo NQ_SYNC_BATCH_SIZE; ?> pages/run)
                    <?php if ($last_sync): ?>
                        | Last: <?php echo isset($last_sync['time']) ? date('Y-m-d H:i:s', $last_sync['time']) : 'never'; ?>
                        (<?php echo $last_sync['changed_pages'] ?? 0; ?> pages, <?php echo $last_sync['deployed_files'] ?? 0; ?>
                        files<?php if (!empty($last_sync['remaining'])): ?>, <strong style="color:orange"><?php echo $last_sync['remaining']; ?> queued</strong><?php endif; ?>)
                        <?php if (($last_sync['status'] ?? '') === 'partial'): ?>
                            <span style="color:orange">⏳ Partial — more pages in next run</span>
                        <?php endif; ?>
                    <?php endif; ?>
                </td>
                <td>
                    <?php if ($sync_enabled && $next_sync): ?>
                        ✅ Active — next: <?php echo date('H:i:s', $next_sync); ?>
                    <?php else: ?>
                        ❌ Disabled
                    <?php endif; ?>
                </td>
            </tr>
        </table>

        <h2>Actions</h2>
        <?php if (!$output_ok || !$source_ok): ?>
            <div class="notice notice-error">
                <p>Fix the directory errors above before using the generator.</p>
            </div>
        <?php else: ?>
            <table class="form-table">
                <tr>
                    <th style="width:200px">Generate Page(s)</th>
                    <td>
                        <input type="text" id="nq_page_url" placeholder="https://fast.nurulquran.com/volunteer/"
                            style="width:420px">
                        <button class="button button-primary" onclick="nqRun('page')">Generate</button>
                        <button class="button" onclick="nqRun('test_fetch')" title="Test if fetch works without saving">Test
                            Fetch Only</button>
                        <p class="description">
                            Enter a single URL <em>or</em> use <strong>*</strong> as a wildcard to match multiple pages.<br>
                            Examples:<br>
                            &nbsp;• <code>https://fast.nurulquran.com/volunteer/</code> — single page<br>
                            &nbsp;• <code>https://fast.nurulquran.com/T*</code> — all pages whose path starts with /T<br>
                            &nbsp;• <code>https://fast.nurulquran.com/ramadan*</code> — all pages containing ramadan in path<br>
                            &nbsp;• <code>https://fast.nurulquran.com/category/*</code> — all pages under /category/<br>
                            &nbsp;• <code>*</code> or <code>/*</code> — all pages (same as Generate All)<br>
                            Wildcards match against all published pages, posts, and custom post types.
                        </p>
                    </td>
                </tr>
                <tr>
                    <th>Copy All Assets</th>
                    <td>
                        <button class="button button-primary" onclick="nqRun('assets')">Copy Assets</button>
                        <p class="description">Copies images, CSS, JS, fonts, PDFs from wp-content and wp-includes. Skips files
                            that already exist.</p>
                    </td>
                </tr>
                <tr>
                    <th>Generate by Date</th>
                    <td>
                        <select id="nq_date_range" style="height:30px;font-size:13px">
                            <option value="all">All time (no filter)</option>
                            <option value="7days">Last 7 days</option>
                            <option value="1month">Last 1 month</option>
                            <option value="3months">Last 3 months</option>
                            <option value="6months">Last 6 months</option>
                            <option value="1year">Last 1 year</option>
                            <option value="2years">Last 2 years</option>
                            <option value="3years">Last 3 years</option>
                            <option value="custom">Custom date range →</option>
                        </select>
                        &nbsp;
                        <span id="nq_custom_dates" style="display:none">
                            From: <input type="date" id="nq_date_from" style="height:28px">
                            To: <input type="date" id="nq_date_to" style="height:28px" value="<?php echo date('Y-m-d'); ?>">
                        </span>
                        &nbsp;
                        <button class="button button-primary" onclick="nqRunDate()">Generate by Date</button>
                        <p class="description">Generates all published pages and posts modified or created within the selected
                            period. Useful for updating only recently changed content.</p>
                    </td>
                </tr>
                <tr>
                    <th>Generate All Pages</th>
                    <td>
                        <button class="button" onclick="nqRun('all')"
                            style="background:#d63638;color:white;border-color:#d63638">
                            Generate All Pages + Assets
                        </button>
                        <p class="description">
                            ⚠️ Generates every published page, post, category, tag page, and copies all assets.
                            Runs in background — check the log below for progress.
                            <strong>Note:</strong> If PHP-FPM timeout is set to 5s, increase it temporarily in Plesk for this
                            operation.
                        </p>
                    </td>
                </tr>
                <tr>
                    <th>Fix Existing Files</th>
                    <td>
                        <button class="button button-secondary" onclick="nqRun('fix')">Fix All Files</button>
                        <p class="description">Strips ?ver= from filenames and HTML, fixes old domain references, cleans up bad
                            characters in existing static files.</p>
                    </td>
                </tr>
                <tr>
                    <th>Convert PHP CSS Files</th>
                    <td>
                        <button class="button button-secondary" onclick="nqRun('php_css')">Convert PHP → CSS</button>
                        <p class="description">
                            Finds PHP files used as stylesheets (like <code>theme_styles.php</code>) that cause 404s on the
                            static site,
                            fetches their CSS output from WordPress, and saves them as real <code>.css</code> files.
                            Also fixes all HTML references from <code>.php</code> to <code>.css</code>.
                            <strong>Run this if menus or styles look broken.</strong>
                        </p>
                    </td>
                </tr>
            </table>
        <?php endif; ?>

        <hr>
        <h2>🔄 Auto-Sync Controls</h2>
        <table class="form-table">
            <tr>
                <th style="width:200px">Sync Now</th>
                <td>
                    <button class="button button-primary" onclick="nqRun('sync_now')">🔄 Sync Now</button>
                    <p class="description">Check for changes, regenerate modified pages, and deploy to nurulquran.com
                        immediately.</p>
                </td>
            </tr>
            <tr>
                <th>Deploy Only</th>
                <td>
                    <button class="button" onclick="nqRun('deploy_only')">📤 Deploy to Target</button>
                    <p class="description">Copy all files from static-export to nurulquran.com without regenerating. Useful
                        after manual generation.</p>
                </td>
            </tr>
            <tr>
                <th>Auto-Sync Schedule</th>
                <td>
                    <?php if ($sync_enabled): ?>
                        <button class="button" onclick="nqRun('toggle_sync')"
                            style="background:#d63638;color:white;border-color:#d63638">⏸ Disable Auto-Sync</button>
                        <span style="color:green;font-weight:bold;margin-left:10px">● Running every
                            <?php echo NQ_SYNC_INTERVAL / 60; ?> minutes</span>
                    <?php else: ?>
                        <button class="button button-primary" onclick="nqRun('toggle_sync')">▶ Enable Auto-Sync</button>
                        <span style="color:red;font-weight:bold;margin-left:10px">● Disabled</span>
                    <?php endif; ?>
                    <p class="description">When enabled, auto-detects content changes and deploys to nurulquran.com every 10
                        minutes via WP-Cron.</p>
                </td>
            </tr>
        </table>

        <hr>
        <h2>Activity Log</h2>
        <div id="nq_log" style="background:#1e1e1e;color:#00ff00;padding:15px;font-family:monospace;
                    font-size:12px;height:400px;overflow-y:auto;border-radius:4px;white-space:pre-wrap;">
            <span style="color:#888">Ready. Click an action above to start.</span>
        </div>
        <br>
        <button class="button" onclick="nqClearLog()">Clear Display</button>
        <button class="button" onclick="nqLoadLog()">Refresh from File</button>
        <button class="button button-secondary" onclick="if(confirm('Delete the log file?')) nqRun('clear_log')"
            style="color:#d63638">Delete Log File</button>
        <p class="description">Log file: <code><?php echo NQ_STATIC_LOG; ?></code></p>
    </div>

    <script>
        function nqLog(msg, color) {
            var log = document.getElementById('nq_log');
            var line = document.createElement('div');
            line.style.color = color || '#00ff00';
            // Escape HTML to prevent XSS from log messages
            line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
            log.appendChild(line);
            log.scrollTop = log.scrollHeight;
        }

        function nqClearLog() {
            document.getElementById('nq_log').innerHTML =
                '<span style="color:#888">Log display cleared. File log still exists.</span>';
        }

        // Show/hide custom date inputs
        document.getElementById('nq_date_range').addEventListener('change', function () {
            document.getElementById('nq_custom_dates').style.display =
                this.value === 'custom' ? 'inline' : 'none';
        });

        function nqRunDate() {
            var range = document.getElementById('nq_date_range').value;
            var dateFrom = '';
            var dateTo = '';

            if (range === 'custom') {
                dateFrom = document.getElementById('nq_date_from').value;
                dateTo = document.getElementById('nq_date_to').value;
                if (!dateFrom) { alert('Please select a From date'); return; }
                if (!dateTo) { alert('Please select a To date'); return; }
            }

            nqLog('▶ Starting date-filtered generate: ' + range, '#ffff00');
            document.querySelectorAll('.button').forEach(b => b.disabled = true);

            var body = 'action=nq_static_run'
                + '&nq_action=date'
                + '&nq_date_range=' + encodeURIComponent(range)
                + '&nq_date_from=' + encodeURIComponent(dateFrom)
                + '&nq_date_to=' + encodeURIComponent(dateTo)
                + '&nq_url='
                + '&_wpnonce=' + encodeURIComponent('<?php echo esc_js(wp_create_nonce('nq_static')); ?>');

            var controller = new AbortController();
            var timeoutId = setTimeout(() => controller.abort(), 600000);

            fetch(ajaxurl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body,
                signal: controller.signal
            })
                .then(r => { clearTimeout(timeoutId); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .then(data => {
                    if (data.log && Array.isArray(data.log)) {
                        data.log.forEach(function (line) {
                            var color = '#cccccc';
                            if (line.indexOf('✅') === 0) color = '#00ff00';
                            else if (line.indexOf('❌') === 0) color = '#ff4444';
                            else if (line.indexOf('⚠️') === 0) color = '#ffaa00';
                            else if (line.indexOf('⚙️') === 0) color = '#88aaff';
                            nqLog(line, color);
                        });
                    }
                    nqLog('══ Finished: ' + (data.message || 'Done') + ' ══', '#00ffff');
                })
                .catch(function (e) {
                    nqLog('❌ ' + (e.name === 'AbortError' ? 'Timed out after 10 min' : e.message), '#ff4444');
                })
                .finally(function () {
                    document.querySelectorAll('.button').forEach(b => b.disabled = false);
                });
        }

        function nqRun(action) {
            var pageUrl = '';
            if (action === 'page') {
                pageUrl = document.getElementById('nq_page_url').value.trim();
                if (!pageUrl) { alert('Please enter a page URL'); return; }
                if (pageUrl.indexOf('http') !== 0) {
                    alert('URL must start with http:// or https://');
                    return;
                }
            }

            nqLog('▶ Starting: ' + action + (pageUrl ? ' → ' + pageUrl : ''), '#ffff00');

            // Disable buttons during run
            document.querySelectorAll('.button').forEach(b => b.disabled = true);

            var body = 'action=nq_static_run'
                + '&nq_action=' + encodeURIComponent(action)
                + '&nq_url=' + encodeURIComponent(pageUrl)
                + '&_wpnonce=' + encodeURIComponent('<?php echo esc_js(wp_create_nonce('nq_static')); ?>');

            // Long timeout for generate-all
            var controller = new AbortController();
            var timeoutId = setTimeout(() => controller.abort(), 600000); // 10 min

            fetch(ajaxurl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body,
                signal: controller.signal
            })
                .then(r => {
                    clearTimeout(timeoutId);
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.json();
                })
                .then(data => {
                    if (data.log && Array.isArray(data.log)) {
                        data.log.forEach(function (line) {
                            var color = '#cccccc';
                            if (line.indexOf('✅') === 0) color = '#00ff00';
                            else if (line.indexOf('❌') === 0) color = '#ff4444';
                            else if (line.indexOf('⚠️') === 0) color = '#ffaa00';
                            else if (line.indexOf('⚙️') === 0) color = '#88aaff';
                            nqLog(line, color);
                        });
                    }
                    nqLog('══ Finished: ' + (data.message || 'Done') + ' ══', '#00ffff');
                })
                .catch(function (e) {
                    if (e.name === 'AbortError') {
                        nqLog('❌ Request timed out after 10 minutes', '#ff4444');
                    } else {
                        nqLog('❌ Error: ' + e.message, '#ff4444');
                    }
                })
                .finally(function () {
                    document.querySelectorAll('.button').forEach(b => b.disabled = false);
                });
        }

        function nqLoadLog() {
            fetch(ajaxurl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=nq_static_get_log&_wpnonce=<?php echo esc_js(wp_create_nonce('nq_static')); ?>'
            })
                .then(r => r.json())
                .then(data => {
                    var log = document.getElementById('nq_log');
                    log.innerHTML = '';
                    var pre = document.createElement('pre');
                    pre.style.color = '#ccc';
                    pre.style.margin = '0';
                    pre.textContent = data.log || 'Log is empty.';
                    log.appendChild(pre);
                    log.scrollTop = log.scrollHeight;
                })
                .catch(e => nqLog('❌ Could not load log: ' + e.message, '#ff4444'));
        }
    </script>
    <?php
}

// ─────────────────────────────────────────────
// AJAX — MAIN HANDLER
// ─────────────────────────────────────────────
add_action('wp_ajax_nq_static_run', function () {
    check_ajax_referer('nq_static', '_wpnonce');
    if (!current_user_can('manage_options'))
        wp_die('Unauthorized');

    // BUG FIX: set_time_limit only works if PHP is not in safe mode
    // and overrides php-fpm timeout — warn user if it can't be raised
    @set_time_limit(600);
    @ini_set('memory_limit', '512M');

    $action = sanitize_text_field($_POST['nq_action'] ?? '');
    $url = esc_url_raw(trim($_POST['nq_url'] ?? ''));
    $log = [];

    // Validate output dir before doing anything
    if (!is_dir(NQ_STATIC_OUTPUT)) {
        wp_send_json(['message' => 'Error', 'log' => ['❌ Output directory does not exist: ' . NQ_STATIC_OUTPUT]]);
        return;
    }
    if (!is_writable(NQ_STATIC_OUTPUT)) {
        wp_send_json(['message' => 'Error', 'log' => ['❌ Output directory is not writable: ' . NQ_STATIC_OUTPUT]]);
        return;
    }

    switch ($action) {
        case 'test_fetch':
            if (empty($url)) {
                $log[] = '❌ Enter a URL first';
            } else {
                $log[] = "⚙️ TEST FETCH (no file will be saved): $url";
                $response = wp_remote_get($url, [
                    'timeout' => 45,
                    'sslverify' => false,
                    'user-agent' => 'NQ-Static-Generator/2.1',
                ]);
                if (is_wp_error($response)) {
                    $log[] = '❌ Error: ' . $response->get_error_message();
                } else {
                    $code = wp_remote_retrieve_response_code($response);
                    $body = wp_remote_retrieve_body($response);
                    $size = strlen((string) $body);
                    $log[] = "HTTP $code | Body: $size bytes";
                    if ($size > 0) {
                        $log[] = "First 300 chars: " . esc_html(substr((string) $body, 0, 300));
                    } else {
                        $log[] = '⚠️ Empty body — WordPress may be blocking loopback. Try increasing PHP-FPM timeout in Plesk temporarily.';
                    }
                }
            }
            break;
        case 'date':
            $range = sanitize_text_field($_POST['nq_date_range'] ?? 'all');
            $date_from = sanitize_text_field($_POST['nq_date_from'] ?? '');
            $date_to = sanitize_text_field($_POST['nq_date_to'] ?? '');
            nq_generate_by_date($range, $date_from, $date_to, $log);
            break;
        case 'page':
            // Auto-detect wildcard — if URL contains * treat as pattern
            if (strpos($url, '*') !== false) {
                nq_generate_wildcard($url, $log);
            } else {
                nq_generate_page($url, $log);
            }
            break;
        case 'assets':
            nq_copy_assets($log);
            break;
        case 'all':
            nq_generate_all_pages($log);
            nq_copy_assets($log);
            nq_convert_php_css($log);
            break;
        case 'fix':
            nq_fix_existing_files($log);
            break;
        case 'php_css':
            nq_convert_php_css($log);
            break;
        case 'clear_log':
            if (file_exists(NQ_STATIC_LOG)) {
                unlink(NQ_STATIC_LOG);
                $log[] = '✅ Log file deleted';
            } else {
                $log[] = '⚠️ No log file to delete';
            }
            break;
        case 'sync_now':
            $log[] = '⚙️ Manual sync triggered...';
            if (!nq_acquire_sync_lock()) {
                $log[] = '⚠️ Another sync is already running. Please wait.';
                break;
            }
            try {
                $changed = nq_detect_changes($log);
                if (!empty($changed['pages'])) {
                    foreach ($changed['pages'] as $sync_url) {
                        nq_generate_page($sync_url, $log);
                    }
                }
                // Copy new/modified uploads (images, PDFs, etc.)
                nq_sync_uploads($log);
                $deploy = nq_deploy_to_target($log);
                nq_save_sync_state();
                update_option('nq_last_sync', [
                    'time' => time(),
                    'changed_pages' => count($changed['pages'] ?? []),
                    'deployed_files' => $deploy['copied'] ?? 0,
                    'status' => 'success',
                ]);
                $log[] = '✅ Manual sync completed';
            } finally {
                nq_release_sync_lock();
            }
            break;
        case 'deploy_only':
            $log[] = '⚙️ Deploy-only mode (no regeneration)...';
            // Sync uploads and assets from WordPress source to static export first
            nq_sync_uploads($log);
            nq_sync_theme_assets($log);
            $deploy = nq_deploy_to_target($log);
            $log[] = '✅ Deploy completed';
            break;
        case 'toggle_sync':
            $currently_enabled = (bool) get_option('nq_sync_enabled', true);
            if ($currently_enabled) {
                update_option('nq_sync_enabled', false);
                wp_clear_scheduled_hook('nq_auto_sync_hook');
                $log[] = '✅ Auto-sync DISABLED. No more automatic checks.';
            } else {
                update_option('nq_sync_enabled', true);
                if (!wp_next_scheduled('nq_auto_sync_hook')) {
                    wp_schedule_event(time(), 'nq_ten_minutes', 'nq_auto_sync_hook');
                }
                $log[] = '✅ Auto-sync ENABLED. Next check in ~10 minutes.';
            }
            $log[] = '⚙️ Reload this page to see updated status.';
            break;
        default:
            $log[] = '❌ Unknown action: ' . esc_html($action);
    }

    // Rotate log if too large
    nq_write_log($log);

    wp_send_json(['message' => 'Done (' . count($log) . ' log lines)', 'log' => $log]);
});

// ─────────────────────────────────────────────
// AJAX — GET LOG FILE
// ─────────────────────────────────────────────
add_action('wp_ajax_nq_static_get_log', function () {
    check_ajax_referer('nq_static', '_wpnonce');
    if (!current_user_can('manage_options'))
        wp_die('Unauthorized');

    if (!file_exists(NQ_STATIC_LOG)) {
        wp_send_json(['log' => 'No log file yet. Run an action to start.']);
        return;
    }

    // BUG FIX: Don't load huge log into memory — read last 50KB only
    $size = filesize(NQ_STATIC_LOG);
    $fp = fopen(NQ_STATIC_LOG, 'r');
    if ($size > 51200) {
        fseek($fp, -51200, SEEK_END);
        fgets($fp); // skip partial line
        $log = "... [log truncated — showing last 50KB] ...\n" . fread($fp, 51200);
    } else {
        $log = fread($fp, $size);
    }
    fclose($fp);

    wp_send_json(['log' => $log]);
});

// ─────────────────────────────────────────────
// WRITE LOG — Rotate if too large
// ─────────────────────────────────────────────
function nq_write_log($log_lines)
{
    // Rotate if log exceeds max size
    if (file_exists(NQ_STATIC_LOG) && filesize(NQ_STATIC_LOG) > NQ_MAX_LOG_SIZE) {
        rename(NQ_STATIC_LOG, NQ_STATIC_LOG . '.old');
    }
    $entry = '[' . date('Y-m-d H:i:s') . ']' . "\n"
        . implode("\n", $log_lines) . "\n\n";
    file_put_contents(NQ_STATIC_LOG, $entry, FILE_APPEND | LOCK_EX);
}

// ─────────────────────────────────────────────
// GENERATE A SINGLE PAGE
// ─────────────────────────────────────────────
function nq_generate_page($url, &$log)
{
    if (empty($url)) {
        $log[] = '❌ No URL provided';
        return false;
    }

    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        $log[] = '❌ Invalid URL: ' . esc_html($url);
        return false;
    }

    $log[] = "⚙️ Fetching: $url";

    $response = wp_remote_get($url, [
        'timeout' => 45,
        'user-agent' => 'NQ-Static-Generator/2.1',
        'sslverify' => false,
        'redirection' => 3,
    ]);

    if (is_wp_error($response)) {
        $log[] = '❌ Failed to fetch: ' . $response->get_error_message();
        return false;
    }

    $http_code = wp_remote_retrieve_response_code($response);
    $html = wp_remote_retrieve_body($response);
    $body_size = strlen((string) $html);

    if ($http_code !== 200) {
        $log[] = "❌ HTTP $http_code for: $url — skipping";
        return false;
    }

    if ($body_size < 100) {
        $log[] = "❌ Response too small ($body_size bytes) for: $url";
        $log[] = "⚙️ Preview: " . esc_html(substr((string) $html, 0, 200));
        $log[] = "⚠️ Tip: If this keeps happening, increase PHP-FPM timeout in Plesk temporarily";
        return false;
    }

    // Parse path from URL
    $path = parse_url($url, PHP_URL_PATH);
    if ($path === null || $path === '' || $path === '/') {
        $output_dir = NQ_STATIC_OUTPUT;
        $output_file = NQ_STATIC_OUTPUT . '/index.html';
    } else {
        $path = '/' . trim($path, '/');
        $output_dir = NQ_STATIC_OUTPUT . $path;
        $output_file = $output_dir . '/index.html';
    }

    // Security: prevent path traversal
    $real_output = realpath(NQ_STATIC_OUTPUT);
    if ($real_output && !str_starts_with(realpath($output_dir) ?: $output_dir, $real_output)) {
        $log[] = '❌ Security: path traversal detected for: ' . $url;
        return false;
    }

    if (!is_dir($output_dir)) {
        if (!mkdir($output_dir, 0755, true)) {
            $log[] = '❌ Could not create directory: ' . $output_dir;
            return false;
        }
    }

    $html = nq_clean_html((string) $html);
    $bytes = file_put_contents($output_file, $html);

    if ($bytes === false) {
        $log[] = '❌ Could not write file: ' . $output_file;
        return false;
    }

    @chmod($output_file, 0644);
    $log[] = "✅ Saved: $output_file (" . number_format(strlen($html)) . " bytes)";
    return true;
}

// ─────────────────────────────────────────────
// GENERATE PAGES FILTERED BY DATE
// ─────────────────────────────────────────────
function nq_generate_by_date($range, $date_from, $date_to, &$log)
{

    // Calculate date_after from range preset
    $date_after = '';
    $date_before = '';
    $label = '';

    if ($range === 'custom') {
        if (empty($date_from) || empty($date_to)) {
            $log[] = '❌ Custom range requires both From and To dates';
            return;
        }
        $date_after = $date_from . ' 00:00:00';
        $date_before = $date_to . ' 23:59:59';
        $label = "custom range $date_from → $date_to";
    } elseif ($range !== 'all') {
        $intervals = [
            '7days' => '-7 days',
            '1month' => '-1 month',
            '3months' => '-3 months',
            '6months' => '-6 months',
            '1year' => '-1 year',
            '2years' => '-2 years',
            '3years' => '-3 years',
        ];
        if (!isset($intervals[$range])) {
            $log[] = '❌ Unknown date range: ' . esc_html($range);
            return;
        }
        $date_after = date('Y-m-d H:i:s', strtotime($intervals[$range]));
        $date_before = date('Y-m-d H:i:s'); // now
        $label = $range . ' (since ' . date('Y-m-d', strtotime($intervals[$range])) . ')';
    } else {
        $label = 'all time';
    }

    $log[] = "⚙️ Generating pages: $label";

    // Build date query args
    $date_query = [];
    if ($date_after || $date_before) {
        $date_query = [
            [
                'after' => $date_after ?: '2000-01-01',
                'before' => $date_before ?: date('Y-m-d H:i:s'),
                'inclusive' => true,
                'column' => 'post_modified', // use modified date so updated posts are included
            ]
        ];
    }

    $urls = [];
    $post_args = [
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids',
        'date_query' => $date_query,
        'orderby' => 'modified',
        'order' => 'DESC',
    ];

    // Pages
    $items = get_posts(array_merge($post_args, ['post_type' => 'page']));
    foreach ($items as $id) {
        $link = get_permalink($id);
        if ($link)
            $urls[] = $link;
    }

    // Posts
    $items = get_posts(array_merge($post_args, ['post_type' => 'post']));
    foreach ($items as $id) {
        $link = get_permalink($id);
        if ($link)
            $urls[] = $link;
    }

    // Custom post types
    foreach (get_post_types(['_builtin' => false, 'public' => true]) as $type) {
        $items = get_posts(array_merge($post_args, ['post_type' => $type]));
        foreach ($items as $id) {
            $link = get_permalink($id);
            if ($link)
                $urls[] = $link;
        }
    }

    // Always include home page
    $urls[] = home_url('/');
    $urls = array_unique($urls);

    if (empty($urls)) {
        $log[] = "⚠️ No pages found for: $label";
        return;
    }

    $log[] = '✅ Found ' . count($urls) . ' page(s) to generate';
    $success = 0;
    $failed = 0;

    foreach ($urls as $url) {
        $ok = nq_generate_page($url, $log);
        if ($ok)
            $success++;
        else
            $failed++;
    }

    $log[] = "✅ Generated: $success | ❌ Failed: $failed";
}

// ─────────────────────────────────────────────
// GENERATE PAGES MATCHING A WILDCARD PATTERN
// e.g. https://fast.nurulquran.com/T*
//      https://fast.nurulquran.com/ramadan*
//      https://fast.nurulquran.com/category/*
// ─────────────────────────────────────────────
function nq_generate_wildcard($pattern, &$log)
{
    $log[] = "⚙️ Wildcard pattern: $pattern";

    // Extract just the path pattern from the URL
    // Handles: full URL, //domain/path*, /path*, path*
    $path_pattern = $pattern;

    // Strip protocol + domain if present
    $path_pattern = preg_replace('|^https?://[^/]+|i', '', $path_pattern);
    // Strip // domain
    $path_pattern = preg_replace('|^//[^/]+|', '', $path_pattern);
    // Ensure it starts with /
    if ($path_pattern !== '' && $path_pattern[0] !== '/') {
        $path_pattern = '/' . $path_pattern;
    }
    // If just * or /*, match everything
    if ($path_pattern === '*' || $path_pattern === '/*') {
        $log[] = '⚙️ Pattern matches everything — running Generate All instead';
        nq_generate_all_pages($log);
        return;
    }

    $log[] = "⚙️ Path pattern: $path_pattern";

    // Convert wildcard pattern to regex
    // Escape everything except * then convert * to .*
    $regex = '|^' . str_replace('\*', '.*', preg_quote($path_pattern, '|')) . '|i';
    $log[] = "⚙️ Regex: $regex";

    // Collect all published URLs
    $all_urls = nq_get_all_urls();
    $log[] = '⚙️ Total published URLs: ' . count($all_urls);

    // Filter by pattern
    $matched = [];
    foreach ($all_urls as $url) {
        $path = parse_url($url, PHP_URL_PATH) ?? '/';
        if (preg_match($regex, $path)) {
            $matched[] = $url;
        }
    }

    if (empty($matched)) {
        $log[] = "⚠️ No URLs matched pattern: $path_pattern";
        $log[] = '⚙️ Tip: Pattern is matched against the URL path only (e.g. /T for fast.nurulquran.com/T*)';
        $log[] = '⚙️ Sample paths available: ' . implode(', ', array_slice(
            array_map(fn($u) => parse_url($u, PHP_URL_PATH), $all_urls),
            0,
            10
        ));
        return;
    }

    $log[] = "✅ Found " . count($matched) . " matching URL(s)";
    $success = 0;
    $failed = 0;

    foreach ($matched as $url) {
        $ok = nq_generate_page($url, $log);
        if ($ok)
            $success++;
        else
            $failed++;
    }

    $log[] = "✅ Generated: $success | ❌ Failed: $failed";
}

// ─────────────────────────────────────────────
// GET ALL PUBLISHED URLS (reused by wildcard + generate all)
// ─────────────────────────────────────────────
function nq_get_all_urls()
{
    $urls = [];

    // Home page
    $urls[] = home_url('/');

    // Pages + posts
    foreach (['page', 'post'] as $type) {
        $items = get_posts([
            'post_type' => $type,
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
        ]);
        foreach ($items as $id) {
            $link = get_permalink($id);
            if ($link)
                $urls[] = $link;
        }
    }

    // Custom post types
    foreach (get_post_types(['_builtin' => false, 'public' => true]) as $type) {
        $items = get_posts([
            'post_type' => $type,
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
        ]);
        foreach ($items as $id) {
            $link = get_permalink($id);
            if ($link)
                $urls[] = $link;
        }
    }

    // Categories + tags
    foreach (get_categories(['hide_empty' => true]) as $cat) {
        $link = get_category_link($cat->term_id);
        if ($link)
            $urls[] = $link;
    }
    foreach (get_tags(['hide_empty' => true]) as $tag) {
        $link = get_tag_link($tag->term_id);
        if ($link)
            $urls[] = $link;
    }

    return array_unique($urls);
}

// ─────────────────────────────────────────────
// GENERATE ALL PUBLISHED PAGES & POSTS
// ─────────────────────────────────────────────
function nq_generate_all_pages(&$log)
{
    $log[] = '⚙️ Collecting all URLs to generate...';

    $urls = nq_get_all_urls();
    $log[] = '✅ Found ' . count($urls) . ' URLs to generate';

    $success = 0;
    $failed = 0;

    foreach ($urls as $url) {
        $ok = nq_generate_page($url, $log);
        if ($ok)
            $success++;
        else
            $failed++;
    }

    $log[] = "✅ Generated: $success pages | ❌ Failed: $failed pages";
}

// ─────────────────────────────────────────────
// COPY ALL ASSETS FROM WORDPRESS TO STATIC
// Copies specific subdirectories of wp-content
// instead of the entire tree to avoid timeouts.
// ─────────────────────────────────────────────
function nq_copy_assets(&$log)
{
    // Copy targeted wp-content subdirectories (NOT the entire wp-content tree)
    // This avoids PHP timeout/memory errors from iterating cache, backups, etc.
    $wp_content_subdirs = [
        'wp-content/uploads',   // Media files (images, PDFs, audio, video)
        'wp-content/themes',    // Theme CSS, JS, images, fonts
        'wp-content/plugins',   // Plugin static assets (CSS, JS, images)
    ];

    foreach ($wp_content_subdirs as $subdir) {
        $source = NQ_SOURCE_BASE . '/' . $subdir;
        $target = NQ_STATIC_OUTPUT . '/' . $subdir;

        if (!is_dir($source)) {
            $log[] = "⚠️ Source not found, skipping: $subdir";
            continue;
        }

        $log[] = "⚙️ Copying $subdir ...";
        $result = nq_copy_directory($source, $target, $log);
        $log[] = "✅ $subdir — copied: {$result['copied']}, skipped: {$result['skipped']}, failed: {$result['failed']}";
    }

    // wp-includes (core JS/CSS/images — relatively small)
    $wp_includes_source = NQ_SOURCE_BASE . '/wp-includes';
    $wp_includes_target = NQ_STATIC_OUTPUT . '/wp-includes';
    if (is_dir($wp_includes_source)) {
        $log[] = '⚙️ Copying wp-includes ...';
        $result = nq_copy_directory($wp_includes_source, $wp_includes_target, $log);
        $log[] = "✅ wp-includes — copied: {$result['copied']}, skipped: {$result['skipped']}, failed: {$result['failed']}";
    }

    // Root-level files
    $root_files = [
        'favicon.ico',
        'favicon.png',
        'robots.txt',
        'sitemap.xml',
        'sitemap_index.xml',
        'browserconfig.xml',
        'manifest.json',
        'apple-touch-icon.png',
        '.htaccess',
    ];

    foreach ($root_files as $file) {
        $src = NQ_SOURCE_BASE . '/' . $file;
        $dst = NQ_STATIC_OUTPUT . '/' . $file;
        if (file_exists($src) && !file_exists($dst)) {
            if (copy($src, $dst)) {
                @chmod($dst, 0644);
                $log[] = "✅ Copied root: $file";
            } else {
                $log[] = "❌ Failed to copy root: $file";
            }
        }
    }
}

// ─────────────────────────────────────────────
// SYNC THEME ASSETS: Copy new/modified files from
// wp-content/themes/ to the static export.
// Lighter than full nq_copy_assets, used by deploy.
// ─────────────────────────────────────────────
function nq_sync_theme_assets(&$log)
{
    $source = NQ_SOURCE_BASE . '/wp-content/themes';
    $target = NQ_STATIC_OUTPUT . '/wp-content/themes';

    if (!is_dir($source)) {
        $log[] = '⚠️ Themes directory not found: ' . $source;
        return;
    }

    $log[] = '⚙️ Syncing wp-content/themes ...';

    $allowed = NQ_ALLOWED_EXTENSIONS;
    $counts = ['copied' => 0, 'skipped' => 0, 'failed' => 0];

    if (!is_dir($target)) {
        mkdir($target, 0755, true);
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $item) {
        $relative = substr($item->getPathname(), strlen($source));

        if ($item->isDir()) {
            $target_dir = $target . $relative;
            if (!is_dir($target_dir)) {
                mkdir($target_dir, 0755, true);
            }
            continue;
        }

        $clean_filename = nq_clean_filename($item->getFilename());
        $ext = strtolower(pathinfo($clean_filename, PATHINFO_EXTENSION));

        if (!in_array($ext, $allowed)) {
            continue;
        }

        $clean_relative = nq_clean_filename_path($relative);
        $target_file = $target . $clean_relative;
        $target_dir = dirname($target_file);

        // Skip if target exists with same size and equal/newer modification time
        if (file_exists($target_file)) {
            $src_mtime = filemtime($item->getPathname());
            $tgt_mtime = filemtime($target_file);
            $src_size  = filesize($item->getPathname());
            $tgt_size  = filesize($target_file);

            if ($src_mtime <= $tgt_mtime && $src_size === $tgt_size) {
                $counts['skipped']++;
                continue;
            }
        }

        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0755, true);
        }

        if (copy($item->getPathname(), $target_file)) {
            @chmod($target_file, 0644);
            @touch($target_file, filemtime($item->getPathname()));
            $counts['copied']++;
        } else {
            $log[] = '❌ Theme asset copy failed: ' . $clean_relative;
            $counts['failed']++;
        }
    }

    if ($counts['copied'] > 0 || $counts['failed'] > 0) {
        $log[] = "✅ Themes — copied: {$counts['copied']}, skipped: {$counts['skipped']}, failed: {$counts['failed']}";
    } else {
        $log[] = '✅ Themes — all files up to date (' . $counts['skipped'] . ' checked)';
    }
}

// ─────────────────────────────────────────────
// CONVERT PHP-GENERATED CSS FILES TO REAL .CSS
// ─────────────────────────────────────────────
function nq_convert_php_css(&$log)
{
    $log[] = '⚙️ Scanning for PHP-generated CSS files in HTML...';

    $found = [];
    $done = 0;
    $failed = 0;

    // Scan all HTML files in the static export for .php?... stylesheet links
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator(NQ_STATIC_OUTPUT, RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $item) {
        if ($item->isDir())
            continue;
        if (strtolower(pathinfo($item->getFilename(), PATHINFO_EXTENSION)) !== 'html')
            continue;

        $content = file_get_contents($item->getPathname());
        if ($content === false)
            continue;

        // Find all PHP stylesheet references that are now .css (after clean_html ran)
        // or still .php in older files
        // Match: href="...wp-content/....php" or href="...wp-content/....css" that was .php
        preg_match_all(
            '|href=["\']([^"\']*(?:wp-content|wp-includes)/[^"\']*\.php(?:\?[^"\']*)?)["\']|i',
            $content,
            $matches
        );

        foreach ($matches[1] as $php_url) {
            $php_url = html_entity_decode($php_url);
            // Convert to absolute URL on source domain
            if (strpos($php_url, 'http') !== 0) {
                $php_url = 'https://' . NQ_SOURCE_DOMAIN . '/' . ltrim($php_url, '/');
            }
            // Replace target domain back to source for fetching
            $php_url = str_replace(
                ['https://' . NQ_TARGET_DOMAIN, 'http://' . NQ_TARGET_DOMAIN],
                'https://' . NQ_SOURCE_DOMAIN,
                $php_url
            );
            $found[$php_url] = true;
        }
    }

    if (empty($found)) {
        $log[] = '✅ No PHP stylesheet references found in HTML files';
    } else {
        $log[] = '⚙️ Found ' . count($found) . ' PHP stylesheet(s) to convert';
    }

    foreach (array_keys($found) as $php_url) {
        // Determine local path from URL
        $path = parse_url($php_url, PHP_URL_PATH); // e.g. /wp-content/themes/uoc-theme/include/theme_styles.php
        $path = preg_replace('/\?.*$/', '', $path);  // strip query string from path

        // Destination .css file path (replace .php with .css)
        $css_path = preg_replace('/\.php$/i', '.css', $path);
        $target_file = NQ_STATIC_OUTPUT . $css_path;
        $target_dir = dirname($target_file);

        // Skip if already done
        if (file_exists($target_file)) {
            $log[] = "⚠️ Already exists, skipping: " . basename($css_path);
            $done++;
            continue;
        }

        $log[] = "⚙️ Fetching PHP CSS: $php_url";

        $response = wp_remote_get($php_url, [
            'timeout' => 15,
            'user-agent' => 'NQ-Static-Generator/2.0',
            'sslverify' => false,
        ]);

        if (is_wp_error($response)) {
            $log[] = "❌ Fetch failed: " . $response->get_error_message();
            $failed++;
            continue;
        }

        $http_code = wp_remote_retrieve_response_code($response);
        if ($http_code !== 200) {
            $log[] = "❌ HTTP $http_code for: $php_url";
            $failed++;
            continue;
        }

        $css = wp_remote_retrieve_body($response);
        if (empty(trim($css))) {
            $log[] = "⚠️ Empty response for: $php_url — skipping";
            continue;
        }

        // Apply domain replacement in the CSS itself
        $css = nq_clean_content($css);

        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0755, true);
        }

        if (file_put_contents($target_file, $css) !== false) {
            @chmod($target_file, 0644);
            $log[] = "✅ Saved: $css_path (" . number_format(strlen($css)) . " bytes)";
            $done++;
        } else {
            $log[] = "❌ Could not write: $target_file";
            $failed++;
        }
    }

    // Also fix any remaining .php references in HTML files
    $fixed_html = 0;
    $iterator2 = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator(NQ_STATIC_OUTPUT, RecursiveDirectoryIterator::SKIP_DOTS)
    );
    foreach ($iterator2 as $item) {
        if ($item->isDir())
            continue;
        if (strtolower(pathinfo($item->getFilename(), PATHINFO_EXTENSION)) !== 'html')
            continue;

        $content = file_get_contents($item->getPathname());
        $original = $content;

        // Replace any remaining PHP stylesheet references with .css
        $content = preg_replace(
            '|((?:wp-content|wp-includes)/[^"\']*?)\.php(?:\?[^"\']*)?(?=["\'])|i',
            '$1.css',
            $content
        );

        if ($content !== $original) {
            file_put_contents($item->getPathname(), $content);
            $fixed_html++;
        }
    }

    $log[] = "✅ PHP CSS converted: $done | ❌ Failed: $failed | HTML files fixed: $fixed_html";
}

// ─────────────────────────────────────────────
// RECURSIVE DIRECTORY COPY (allowed types only)
// ─────────────────────────────────────────────
function nq_copy_directory($source, $target, &$log)
{
    $allowed = NQ_ALLOWED_EXTENSIONS;
    $counts = ['copied' => 0, 'skipped' => 0, 'failed' => 0];

    if (!is_dir($source)) {
        $log[] = "❌ Source directory not found: $source";
        return $counts;
    }

    if (!is_dir($target)) {
        mkdir($target, 0755, true);
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $item) {
        $relative = substr($item->getPathname(), strlen($source));

        if ($item->isDir()) {
            $target_dir = $target . $relative;
            if (!is_dir($target_dir)) {
                mkdir($target_dir, 0755, true);
            }
            continue;
        }

        // BUG FIX: Clean filename FIRST before checking extension
        // pathinfo() on 'style.css?ver=1.0' returns ext='0' not 'css'
        $original_filename = $item->getFilename();
        $clean_filename = nq_clean_filename($original_filename);
        $ext = strtolower(pathinfo($clean_filename, PATHINFO_EXTENSION));

        if (!in_array($ext, $allowed)) {
            continue;
        }

        // BUG FIX: Clean the full relative path (not just filename)
        $clean_relative = nq_clean_filename_path($relative);
        $target_file = $target . $clean_relative;
        $target_dir = dirname($target_file);

        // Skip if already exists (don't overwrite)
        if (file_exists($target_file)) {
            $counts['skipped']++;
            continue;
        }

        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0755, true);
        }

        // BUG FIX: Check copy() return value
        if (copy($item->getPathname(), $target_file)) {
            @chmod($target_file, 0644);
            $counts['copied']++;
        } else {
            $log[] = "❌ Copy failed: $clean_relative";
            $counts['failed']++;
        }
    }

    return $counts;
}

// ─────────────────────────────────────────────
// FIX EXISTING STATIC FILES
// ─────────────────────────────────────────────
function nq_fix_existing_files(&$log)
{
    $target = NQ_STATIC_OUTPUT;
    $log[] = '⚙️ Scanning and fixing: ' . $target;

    $html_fixed = 0;
    $renamed = 0;
    $errors = 0;

    // BUG FIX: Collect files to rename first, then rename
    // Modifying filesystem while iterating causes issues
    $to_rename = [];
    $to_fix = [];

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($target, RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $item) {
        if ($item->isDir())
            continue;

        $filepath = $item->getPathname();
        $filename = $item->getFilename();

        // Collect files needing rename
        if (strpos($filename, '?') !== false || strpos($filename, '%3F') !== false || strpos($filename, '%3f') !== false) {
            $to_rename[] = [
                'old' => $filepath,
                'new' => $item->getPath() . '/' . nq_clean_filename($filename),
            ];
        } else {
            // Collect HTML/CSS/JS files to fix content
            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            if (in_array($ext, ['html', 'htm', 'css', 'js'])) {
                $to_fix[] = $filepath;
            }
        }
    }

    // Rename files
    foreach ($to_rename as $pair) {
        if ($pair['old'] === $pair['new'])
            continue;
        if (file_exists($pair['new'])) {
            $log[] = "⚠️ Skip rename (target exists): " . basename($pair['new']);
            continue;
        }
        if (rename($pair['old'], $pair['new'])) {
            $log[] = "✅ Renamed: " . basename($pair['old']) . " → " . basename($pair['new']);
            $renamed++;
            // After rename, fix content too
            $ext = strtolower(pathinfo($pair['new'], PATHINFO_EXTENSION));
            if (in_array($ext, ['html', 'htm', 'css', 'js'])) {
                $to_fix[] = $pair['new'];
            }
        } else {
            $log[] = "❌ Rename failed: " . basename($pair['old']);
            $errors++;
        }
    }

    // Fix file contents
    foreach ($to_fix as $filepath) {
        if (!file_exists($filepath))
            continue;

        $content = file_get_contents($filepath);
        if ($content === false) {
            $log[] = "❌ Cannot read: " . basename($filepath);
            $errors++;
            continue;
        }

        $original = $content;
        $content = nq_clean_content($content);

        if ($content !== $original) {
            if (file_put_contents($filepath, $content) !== false) {
                $html_fixed++;
            } else {
                $log[] = "❌ Cannot write: " . basename($filepath);
                $errors++;
            }
        }
    }

    $log[] = "✅ Fixed content: $html_fixed files";
    $log[] = "✅ Renamed: $renamed files";
    if ($errors > 0) {
        $log[] = "⚠️ Errors: $errors (check file permissions)";
    }

    nq_fix_permissions($target, $log);
}

// ─────────────────────────────────────────────
// CLEAN HTML — Fix all domain and path issues
// ─────────────────────────────────────────────
function nq_clean_html($html)
{
    // 1. Replace http and https old domain with new domain
    $html = str_replace(
        ['https://' . NQ_SOURCE_DOMAIN, 'http://' . NQ_SOURCE_DOMAIN],
        'https://' . NQ_TARGET_DOMAIN,
        $html
    );

    // 2. Fix double domain: nurulquran.com/nurulquran.com/
    $html = preg_replace(
        '|https?://nurulquran\.com/+nurulquran\.com/+|i',
        'https://nurulquran.com/',
        $html
    );

    // 3. Fix double slashes after domain (but preserve https://)
    $html = preg_replace(
        '|(https://nurulquran\.com)//{1,}|',
        '$1/',
        $html
    );

    // 4. Fix Google Fonts/gstatic if domain was prepended
    $external = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'ajax.googleapis.com',
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com'
    ];
    foreach ($external as $ext_domain) {
        $html = str_replace(
            'https://nurulquran.com/' . $ext_domain,
            'https://' . $ext_domain,
            $html
        );
        $html = str_replace(
            'http://nurulquran.com/' . $ext_domain,
            'https://' . $ext_domain,
            $html
        );
    }

    // 5. Remove ?ver= from ALL asset URLs (css, js, fonts, images)
    $html = preg_replace(
        '/(\.(css|js|woff2?|ttf|eot|otf|svg|png|jpg|jpeg|gif|webp|ico))\?ver=[a-zA-Z0-9._%-]*/i',
        '$1',
        $html
    );

    // 6. Remove other query strings from font files specifically
    $html = preg_replace(
        '/(\.(woff2?|ttf|eot|otf|svg))\?[a-zA-Z0-9._%-]*/i',
        '$1',
        $html
    );

    // 7. Upgrade any remaining http:// internal links to https://
    $html = str_replace(
        'http://' . NQ_TARGET_DOMAIN,
        'https://' . NQ_TARGET_DOMAIN,
        $html
    );

    // 8. Remove WordPress admin bar injected script/style
    $html = preg_replace('|<link[^>]*wp-admin[^>]*/?>\s*|i', '', $html);
    $html = preg_replace('|<script[^>]*wp-admin[^>]*/?>.*?</script>\s*|is', '', $html);

    // 9. Remove Gravitec push notifications (PHP-based, useless on static)
    $html = preg_replace('|<script[^>]*gravitec[^>]*/?>.*?</script>\s*|is', '', $html);
    $html = preg_replace('|<script[^>]*gravitec[^>]*/?>|i', '', $html);
    $html = preg_replace('|<link[^>]*gravitec[^>]*/?>\s*|i', '', $html);

    // 10. Remove wp-json REST API discovery links (PHP-based, useless on static)
    $html = preg_replace('|<link[^>]*wp/v2[^>]*/?>\s*|i', '', $html);
    $html = preg_replace('|<link[^>]*wp-json[^>]*/?>\s*|i', '', $html);

    // 11. Remove WP oEmbed discovery link
    $html = preg_replace('|<link[^>]*application/json\+oembed[^>]*/?>\s*|i', '', $html);
    $html = preg_replace('|<link[^>]*text/xml\+oembed[^>]*/?>\s*|i', '', $html);

    // 12. Convert PHP-generated CSS stylesheet href references → .css
    // SAFE: only replaces inside href="..." of <link> stylesheet tags
    // e.g. theme_styles.php?ver=1.5 → theme_styles.css
    // BAD regex was: [^"']*? which could corrupt nearby tags
    $html = preg_replace_callback(
        '|(<link\b[^>]*\brel=["\']stylesheet["\'][^>]*\bhref=["\'])([^"\']+)(\.php)(\?[^"\']*)?(["\'][^>]*>)|i',
        function ($m) {
            // $m[1] = everything up to the path
            // $m[2] = path before .php
            // $m[3] = .php
            // $m[4] = ?query (optional)
            // $m[5] = closing quote + rest of tag
            return $m[1] . $m[2] . '.css' . $m[5];
        },
        $html
    );
    // Also handle href before rel (both attribute orders exist in WordPress output)
    $html = preg_replace_callback(
        '|(<link\b[^>]*\bhref=["\'])([^"\']+)(\.php)(\?[^"\']*)?(["\'][^>]*\brel=["\']stylesheet["\'][^>]*>)|i',
        function ($m) {
            return $m[1] . $m[2] . '.css' . $m[5];
        },
        $html
    );

    return $html;
}

// ─────────────────────────────────────────────
// CLEAN CSS/JS CONTENT
// ─────────────────────────────────────────────
function nq_clean_content($content)
{
    // Replace old domain
    $content = str_replace(
        ['https://' . NQ_SOURCE_DOMAIN, 'http://' . NQ_SOURCE_DOMAIN],
        'https://' . NQ_TARGET_DOMAIN,
        $content
    );

    // Fix double domain
    $content = preg_replace(
        '|https?://nurulquran\.com/+nurulquran\.com/+|i',
        'https://nurulquran.com/',
        $content
    );

    // Fix double slashes after domain
    $content = preg_replace(
        '|(https://nurulquran\.com)//{1,}|',
        '$1/',
        $content
    );

    // Remove ?ver= from asset URLs
    $content = preg_replace(
        '/(\.(css|js|woff2?|ttf|eot|otf|svg|png|jpg|jpeg|gif|webp))\?ver=[a-zA-Z0-9._%-]*/i',
        '$1',
        $content
    );

    // Remove query strings from font files
    $content = preg_replace(
        '/(\.(woff2?|ttf|eot|otf|svg))\?[a-zA-Z0-9._%-]*/i',
        '$1',
        $content
    );

    // Fix Google Fonts
    foreach (['fonts.googleapis.com', 'fonts.gstatic.com'] as $ext_domain) {
        $content = str_replace(
            'https://nurulquran.com/' . $ext_domain,
            'https://' . $ext_domain,
            $content
        );
    }

    // Upgrade http to https for target domain
    $content = str_replace(
        'http://' . NQ_TARGET_DOMAIN,
        'https://' . NQ_TARGET_DOMAIN,
        $content
    );

    return $content;
}

// ─────────────────────────────────────────────
// CLEAN FILENAME — Remove ?query strings
// ─────────────────────────────────────────────
function nq_clean_filename($filename)
{
    // Remove ?anything from filename
    $filename = preg_replace('/\?.*$/', '', $filename);

    // Remove %3F (URL-encoded ?) and everything after
    $filename = preg_replace('/%3[Ff].*$/i', '', $filename);

    // Remove %xx encoded sequences that are NOT part of valid filenames
    // But preserve dots, underscores, hyphens which are valid
    $filename = preg_replace('/%[0-9A-Fa-f]{2}/', '', $filename);

    // Remove any leftover empty extensions like "file."
    $filename = rtrim($filename, '.');

    return $filename;
}

// ─────────────────────────────────────────────
// CLEAN FULL PATH — Clean each component
// ─────────────────────────────────────────────
function nq_clean_filename_path($path)
{
    // Split path into parts, clean each filename, rejoin
    $parts = explode('/', $path);
    $cleaned = array_map(function ($part) {
        // Only clean the filename part (last segment), leave directory names alone
        // unless they also have query strings
        if (strpos($part, '?') !== false || strpos($part, '%3F') !== false) {
            return nq_clean_filename($part);
        }
        return $part;
    }, $parts);
    return implode('/', $cleaned);
}

// ─────────────────────────────────────────────
// FIX PERMISSIONS
// ─────────────────────────────────────────────
function nq_fix_permissions($dir, &$log)
{
    $log[] = '⚙️ Fixing permissions...';

    if (!is_dir($dir)) {
        $log[] = '❌ Directory not found for permissions fix: ' . $dir;
        return;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    $count = 0;
    foreach ($iterator as $item) {
        if ($item->isDir()) {
            @chmod($item->getPathname(), 0755);
        } else {
            @chmod($item->getPathname(), 0644);
        }
        $count++;
    }

    $log[] = "✅ Permissions fixed on $count items";
}

// ─────────────────────────────────────────────
// AUTO-GENERATE ON POST PUBLISH/UPDATE
// ─────────────────────────────────────────────
add_action('save_post', function ($post_id) {
    // BUG FIX: Skip auto-runs during AJAX (e.g. Elementor autosave) to avoid
    // overloading server. Only run on direct admin saves.
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
        return;
    if (defined('DOING_AJAX') && DOING_AJAX)
        return;
    if (wp_is_post_revision($post_id))
        return;
    if (get_post_status($post_id) !== 'publish')
        return;

    $url = get_permalink($post_id);
    if (!$url)
        return;

    // BUG FIX: Validate output dir before auto-run
    if (!is_dir(NQ_STATIC_OUTPUT) || !is_writable(NQ_STATIC_OUTPUT))
        return;

    $log = [];
    nq_generate_page($url, $log);

    // Write just a summary to the log (not every line)
    $status = in_array(true, array_map(fn($l) => str_starts_with($l, '✅'), $log)) ? 'OK' : 'FAILED';
    file_put_contents(
        NQ_STATIC_LOG,
        '[AUTO-SAVE] ' . date('Y-m-d H:i:s') . ' | ' . $status . ' | ' . $url . "\n",
        FILE_APPEND | LOCK_EX
    );
});

// ─────────────────────────────────────────────
// AUTO-SYNC: SPAWN — Non-blocking background trigger
// Called by WP-Cron; fires off a background HTTP request
// so the visitor's page load is NOT blocked.
// ─────────────────────────────────────────────
function nq_auto_sync_spawn()
{
    if (!get_option('nq_sync_enabled', true)) {
        return;
    }

    // Don't spawn if already locked (another sync is running)
    if (file_exists(NQ_SYNC_LOCK_FILE)) {
        $lock_age = time() - filemtime(NQ_SYNC_LOCK_FILE);
        if ($lock_age < 600) {
            return; // Still locked by a recent run
        }
    }

    // Fire a non-blocking POST to ourselves — the actual sync
    // runs in a separate PHP process, not in the visitor's request
    $url = admin_url('admin-ajax.php');
    wp_remote_post($url, [
        'timeout'   => 0.01,  // Don't wait for response (fire-and-forget)
        'blocking'  => false, // Non-blocking — returns immediately
        'sslverify' => false,
        'body'      => [
            'action'       => 'nq_bg_sync',
            'nq_sync_key'  => wp_hash('nq_auto_sync_' . AUTH_KEY),
        ],
    ]);
}

// ─────────────────────────────────────────────
// AUTO-SYNC: MAIN HANDLER (runs in background)
// Processes at most NQ_SYNC_BATCH_SIZE pages per run
// to avoid monopolizing server resources.
// ─────────────────────────────────────────────
function nq_auto_sync()
{
    // Verify this is a legitimate background sync request
    if (isset($_POST['action']) && $_POST['action'] === 'nq_bg_sync') {
        $expected_key = wp_hash('nq_auto_sync_' . AUTH_KEY);
        if (!isset($_POST['nq_sync_key']) || !hash_equals($expected_key, $_POST['nq_sync_key'])) {
            wp_die('Unauthorized', 403);
        }
    }

    // Check if sync is enabled
    if (!get_option('nq_sync_enabled', true)) {
        return;
    }

    // Acquire lock to prevent concurrent runs
    if (!nq_acquire_sync_lock()) {
        return;
    }

    try {
        @set_time_limit(NQ_SYNC_TIME_LIMIT + 30); // Give a little buffer beyond our self-imposed limit
        @ini_set('memory_limit', '256M');          // Reduced from 512M — we process fewer pages now

        $start_time = time();
        $log = [];
        $log[] = '⚙️ AUTO-SYNC started at ' . date('Y-m-d H:i:s') . ' (batch=' . NQ_SYNC_BATCH_SIZE . ', limit=' . NQ_SYNC_TIME_LIMIT . 's)';

        // Validate directories
        if (!is_dir(NQ_STATIC_OUTPUT) || !is_writable(NQ_STATIC_OUTPUT)) {
            $log[] = '❌ Static output directory not writable: ' . NQ_STATIC_OUTPUT;
            nq_write_log($log);
            return;
        }
        if (!is_dir(NQ_TARGET_DOCROOT) || !is_writable(NQ_TARGET_DOCROOT)) {
            $log[] = '❌ Target docroot not writable: ' . NQ_TARGET_DOCROOT;
            nq_write_log($log);
            return;
        }

        // Check for a pending batch from a previous run
        $batch_state = nq_load_batch_state();
        $pages_to_process = [];

        if (!empty($batch_state['remaining'])) {
            // Continue processing a previous batch
            $pages_to_process = $batch_state['remaining'];
            $log[] = '⚙️ Resuming previous batch — ' . count($pages_to_process) . ' page(s) remaining';
        } else {
            // Detect new changes
            $changed = nq_detect_changes($log);
            $pages_to_process = $changed['pages'] ?? [];
        }

        // Batch: take only NQ_SYNC_BATCH_SIZE pages
        $batch = array_slice($pages_to_process, 0, NQ_SYNC_BATCH_SIZE);
        $remaining = array_slice($pages_to_process, NQ_SYNC_BATCH_SIZE);

        // Regenerate this batch
        $regen_count = 0;
        if (!empty($batch)) {
            $log[] = '⚙️ Processing batch of ' . count($batch) . ' page(s)' .
                     (!empty($remaining) ? ' (' . count($remaining) . ' queued for next run)' : '');

            foreach ($batch as $url) {
                // Time check: abort if we're approaching the time limit
                if ((time() - $start_time) >= NQ_SYNC_TIME_LIMIT) {
                    $log[] = '⚠️ Time limit reached (' . NQ_SYNC_TIME_LIMIT . 's) — deferring remaining pages';
                    // Put unprocessed pages from this batch back into remaining
                    $remaining = array_merge(
                        array_slice($batch, array_search($url, $batch)),
                        $remaining
                    );
                    break;
                }

                if (nq_generate_page($url, $log)) {
                    $regen_count++;
                }
            }
        }

        // Save remaining pages for next cron tick
        if (!empty($remaining)) {
            nq_save_batch_state($remaining);
            $log[] = '⚙️ ' . count($remaining) . ' page(s) queued for next sync run';
        } else {
            nq_clear_batch_state();
        }

        // Copy new/modified uploads (images, PDFs, etc.) to static export
        nq_sync_uploads($log);

        // Deploy to target only when no more pages are queued
        // (or always deploy if this batch had changes)
        $deploy = ['copied' => 0];
        if (empty($remaining) || $regen_count > 0) {
            $deploy = nq_deploy_to_target($log);
        }

        // Save sync state only when fully caught up
        if (empty($remaining)) {
            nq_save_sync_state();
        }

        // Record result
        update_option('nq_last_sync', [
            'time' => time(),
            'changed_pages' => $regen_count,
            'deployed_files' => $deploy['copied'] ?? 0,
            'remaining' => count($remaining),
            'status' => empty($remaining) ? 'success' : 'partial',
        ]);

        $elapsed = time() - $start_time;
        $log[] = '✅ AUTO-SYNC completed in ' . $elapsed . 's — ' . $regen_count . ' regenerated, ' .
                 ($deploy['copied'] ?? 0) . ' deployed' .
                 (!empty($remaining) ? ', ' . count($remaining) . ' remaining' : '');
        nq_write_log($log);

    } finally {
        nq_release_sync_lock();
    }

    // If called via AJAX, send response and exit
    if (isset($_POST['action']) && $_POST['action'] === 'nq_bg_sync') {
        wp_send_json(['status' => 'done']);
    }
}

// ─────────────────────────────────────────────
// DETECT CHANGES: Check for modified content
// ─────────────────────────────────────────────
function nq_detect_changes(&$log)
{
    $changed = ['pages' => [], 'options' => false];

    // Load previous sync state
    $state = nq_load_sync_state();
    $last_check = $state['last_check'] ?? 0;

    // First run — queue all pages (they'll be processed in batches)
    if ($last_check === 0) {
        $all_urls = array_values(nq_get_all_urls());
        $log[] = '⚙️ First sync — queuing ' . count($all_urls) . ' pages (will process in batches of ' . NQ_SYNC_BATCH_SIZE . ')';
        $changed['pages'] = $all_urls;
        return $changed;
    }

    $last_check_date = date('Y-m-d H:i:s', $last_check);
    $log[] = "⚙️ Checking for changes since: $last_check_date";

    // Check for modified posts/pages (including scheduled posts that went live)
    $post_types = array_merge(['post', 'page'], array_values(get_post_types(['_builtin' => false, 'public' => true])));

    $modified_ids = get_posts([
        'post_type' => $post_types,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids',
        'date_query' => [
            [
                'after' => $last_check_date,
                'column' => 'post_modified_gmt',
                'inclusive' => true,
            ]
        ],
    ]);

    foreach ($modified_ids as $post_id) {
        $url = get_permalink($post_id);
        if ($url) {
            $changed['pages'][] = $url;
        }
    }

    // Check for menu/widget/theme customizer changes via options hash
    $option_keys = ['nav_menu_options', 'sidebars_widgets', 'theme_mods_' . get_stylesheet()];
    $current_hash = '';
    foreach ($option_keys as $key) {
        $current_hash .= md5(serialize(get_option($key)));
    }
    $current_hash = md5($current_hash);

    if (isset($state['options_hash']) && $state['options_hash'] !== $current_hash) {
        $log[] = '⚙️ Menu/widget/theme changes detected — regenerating all pages';
        $changed['pages'] = array_values(nq_get_all_urls());
        $changed['options'] = true;
    }

    // Deduplicate
    $changed['pages'] = array_values(array_unique($changed['pages']));

    // Always include home page if anything changed (sidebars, recent posts, etc.)
    if (!empty($changed['pages'])) {
        $home = home_url('/');
        if (!in_array($home, $changed['pages'])) {
            $changed['pages'][] = $home;
        }
    }

    if (empty($changed['pages'])) {
        $log[] = '✅ No content changes detected';
    } else {
        $log[] = '⚙️ Found ' . count($changed['pages']) . ' changed page(s)';
    }

    return $changed;
}

// ─────────────────────────────────────────────
// DEPLOY: Copy static-export → target docroot
// Only copies files that are new or changed
// ─────────────────────────────────────────────
function nq_deploy_to_target(&$log)
{
    $source = NQ_STATIC_OUTPUT;
    $target = NQ_TARGET_DOCROOT;
    $result = ['copied' => 0, 'skipped' => 0, 'failed' => 0];

    $log[] = "⚙️ Deploying: $source → $target";

    if (!is_dir($source)) {
        $log[] = '❌ Source directory not found: ' . $source;
        return $result;
    }
    if (!is_dir($target)) {
        $log[] = '❌ Target directory not found: ' . $target;
        return $result;
    }
    if (!is_writable($target)) {
        $log[] = '❌ Target directory not writable: ' . $target;
        return $result;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $item) {
        $relative = substr($item->getPathname(), strlen($source));
        $target_path = $target . $relative;

        if ($item->isDir()) {
            if (!is_dir($target_path)) {
                mkdir($target_path, 0755, true);
            }
            continue;
        }

        // Skip if target exists with same size and equal/newer modification time
        if (file_exists($target_path)) {
            $src_mtime = filemtime($item->getPathname());
            $tgt_mtime = filemtime($target_path);
            $src_size = filesize($item->getPathname());
            $tgt_size = filesize($target_path);

            if ($src_mtime <= $tgt_mtime && $src_size === $tgt_size) {
                $result['skipped']++;
                continue;
            }
        }

        // Ensure target directory exists
        $target_dir = dirname($target_path);
        if (!is_dir($target_dir)) {
            if (!@mkdir($target_dir, 0755, true)) {
                $err = error_get_last();
                $log[] = '❌ Deploy mkdir failed: ' . $target_dir;
                $log[] = '   ↳ Error: ' . ($err['message'] ?? 'unknown');
                $log[] = '   ↳ Parent exists: ' . (is_dir(dirname($target_dir)) ? 'yes' : 'NO');
                $log[] = '   ↳ Parent writable: ' . (is_writable(dirname($target_dir)) ? 'yes' : 'NO');
                $result['failed']++;
                continue;
            }
        }

        // Clear any previous error before copy attempt
        @trigger_error('', E_USER_NOTICE);
        if (copy($item->getPathname(), $target_path)) {
            @chmod($target_path, 0644);
            // Preserve source mtime so future comparisons work correctly
            @touch($target_path, filemtime($item->getPathname()));
            $result['copied']++;
        } else {
            $err = error_get_last();
            $src_path = $item->getPathname();
            $log[] = '❌ Deploy failed: ' . $relative;
            $log[] = '   ↳ Error: ' . ($err['message'] ?? 'unknown');
            $log[] = '   ↳ Source: ' . $src_path;
            $log[] = '   ↳ Source exists: ' . (file_exists($src_path) ? 'yes (' . filesize($src_path) . ' bytes)' : 'NO');
            $log[] = '   ↳ Source readable: ' . (is_readable($src_path) ? 'yes' : 'NO');
            $log[] = '   ↳ Source perms: ' . (file_exists($src_path) ? decoct(fileperms($src_path) & 0777) : 'N/A');
            $log[] = '   ↳ Target dir: ' . $target_dir;
            $log[] = '   ↳ Target dir exists: ' . (is_dir($target_dir) ? 'yes' : 'NO');
            $log[] = '   ↳ Target dir writable: ' . (is_writable($target_dir) ? 'yes' : 'NO');
            $log[] = '   ↳ Target dir perms: ' . (is_dir($target_dir) ? decoct(fileperms($target_dir) & 0777) : 'N/A');
            $log[] = '   ↳ PHP user: ' . (function_exists('posix_getpwuid') ? posix_getpwuid(posix_geteuid())['name'] : get_current_user());
            $result['failed']++;
        }
    }

    $log[] = "✅ Deploy: {$result['copied']} copied, {$result['skipped']} unchanged, {$result['failed']} failed";
    return $result;
}

// ─────────────────────────────────────────────
// SYNC STATE: Load/Save last sync info
// ─────────────────────────────────────────────
function nq_load_sync_state()
{
    if (!file_exists(NQ_SYNC_STATE_FILE)) {
        return [];
    }
    $json = file_get_contents(NQ_SYNC_STATE_FILE);
    return json_decode($json, true) ?: [];
}

function nq_save_sync_state()
{
    $option_keys = ['nav_menu_options', 'sidebars_widgets', 'theme_mods_' . get_stylesheet()];
    $hash = '';
    foreach ($option_keys as $key) {
        $hash .= md5(serialize(get_option($key)));
    }

    $state = [
        'last_check' => time(),
        'options_hash' => md5($hash),
    ];
    file_put_contents(NQ_SYNC_STATE_FILE, json_encode($state, JSON_PRETTY_PRINT), LOCK_EX);
}

// ─────────────────────────────────────────────
// SYNC LOCK: Prevent concurrent auto-sync runs
// ─────────────────────────────────────────────
function nq_acquire_sync_lock()
{
    // Check if lock exists and is stale (older than 10 minutes)
    if (file_exists(NQ_SYNC_LOCK_FILE)) {
        $lock_age = time() - filemtime(NQ_SYNC_LOCK_FILE);
        if ($lock_age < 600) {
            return false; // Still locked by a recent run
        }
        // Stale lock — remove it
        @unlink(NQ_SYNC_LOCK_FILE);
    }

    file_put_contents(NQ_SYNC_LOCK_FILE, getmypid() . "\n" . date('Y-m-d H:i:s'), LOCK_EX);
    return true;
}

function nq_release_sync_lock()
{
    if (file_exists(NQ_SYNC_LOCK_FILE)) {
        @unlink(NQ_SYNC_LOCK_FILE);
    }
}

// ─────────────────────────────────────────────
// BATCH STATE: Track queued pages across cron ticks
// ─────────────────────────────────────────────
function nq_load_batch_state()
{
    if (!file_exists(NQ_SYNC_BATCH_STATE)) {
        return [];
    }
    $json = file_get_contents(NQ_SYNC_BATCH_STATE);
    $data = json_decode($json, true);
    if (!is_array($data)) {
        return [];
    }
    // Expire stale batches (older than 1 hour)
    if (isset($data['created']) && (time() - $data['created']) > 3600) {
        @unlink(NQ_SYNC_BATCH_STATE);
        return [];
    }
    return $data;
}

function nq_save_batch_state($remaining_urls)
{
    $data = [
        'remaining' => array_values($remaining_urls),
        'created'   => file_exists(NQ_SYNC_BATCH_STATE)
            ? (json_decode(file_get_contents(NQ_SYNC_BATCH_STATE), true)['created'] ?? time())
            : time(),
        'updated'   => time(),
    ];
    file_put_contents(NQ_SYNC_BATCH_STATE, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
}

function nq_clear_batch_state()
{
    if (file_exists(NQ_SYNC_BATCH_STATE)) {
        @unlink(NQ_SYNC_BATCH_STATE);
    }
}

// ─────────────────────────────────────────────
// SYNC UPLOADS: Copy new/modified files from
// wp-content/uploads/ to the static export.
// Runs during every auto-sync and manual sync
// so media files are always up to date.
// ─────────────────────────────────────────────
function nq_sync_uploads(&$log)
{
    $source = NQ_SOURCE_BASE . '/wp-content/uploads';
    $target = NQ_STATIC_OUTPUT . '/wp-content/uploads';

    if (!is_dir($source)) {
        $log[] = '⚠️ Uploads directory not found: ' . $source;
        return ['copied' => 0, 'skipped' => 0, 'failed' => 0];
    }

    $log[] = '⚙️ Syncing wp-content/uploads ...';

    $allowed = NQ_ALLOWED_EXTENSIONS;
    $counts = ['copied' => 0, 'skipped' => 0, 'failed' => 0];

    if (!is_dir($target)) {
        mkdir($target, 0755, true);
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $item) {
        $relative = substr($item->getPathname(), strlen($source));

        if ($item->isDir()) {
            $target_dir = $target . $relative;
            if (!is_dir($target_dir)) {
                mkdir($target_dir, 0755, true);
            }
            continue;
        }

        // Check file extension against allowed list
        $clean_filename = nq_clean_filename($item->getFilename());
        $ext = strtolower(pathinfo($clean_filename, PATHINFO_EXTENSION));

        if (!in_array($ext, $allowed)) {
            continue;
        }

        $clean_relative = nq_clean_filename_path($relative);
        $target_file = $target . $clean_relative;
        $target_dir = dirname($target_file);

        // Skip if target exists with same size and equal/newer modification time
        if (file_exists($target_file)) {
            $src_mtime = filemtime($item->getPathname());
            $tgt_mtime = filemtime($target_file);
            $src_size  = filesize($item->getPathname());
            $tgt_size  = filesize($target_file);

            if ($src_mtime <= $tgt_mtime && $src_size === $tgt_size) {
                $counts['skipped']++;
                continue;
            }
        }

        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0755, true);
        }

        if (copy($item->getPathname(), $target_file)) {
            @chmod($target_file, 0644);
            // Preserve source mtime so future comparisons work correctly
            @touch($target_file, filemtime($item->getPathname()));
            $counts['copied']++;
        } else {
            $log[] = '❌ Upload copy failed: ' . $clean_relative;
            $counts['failed']++;
        }
    }

    if ($counts['copied'] > 0 || $counts['failed'] > 0) {
        $log[] = "✅ Uploads — copied: {$counts['copied']}, skipped: {$counts['skipped']}, failed: {$counts['failed']}";
    } else {
        $log[] = '✅ Uploads — all files up to date (' . $counts['skipped'] . ' checked)';
    }

    return $counts;
}