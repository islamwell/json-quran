/**
 * WordPress to Static Converter - Companion App
 */

document.addEventListener("DOMContentLoaded", () => {
  // Tab Switching
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");

      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // CLI Command Generator
  const cliUrl = document.getElementById("cli-url");
  const cliOutput = document.getElementById("cli-output");
  const cliMedia = document.getElementById("cli-media");
  const cliLimit = document.getElementById("cli-limit");
  const cliConcurrency = document.getElementById("cli-concurrency");
  const cliSearch = document.getElementById("cli-search");
  const generatedCommand = document.getElementById("generated-command");
  const copyCliBtn = document.getElementById("copy-cli-btn");

  function updateCommand() {
    if (!generatedCommand) return;
    const url = (cliUrl && cliUrl.value.trim()) || "https://nq-international.com";
    const out = (cliOutput && cliOutput.value.trim()) || "./dist";
    const media = (cliMedia && cliMedia.value.trim()) || "";
    const limit = (cliLimit && cliLimit.value.trim()) || "";
    const conc = (cliConcurrency && cliConcurrency.value.trim()) || "6";
    const search = cliSearch && !cliSearch.checked;

    let cmd = `python3 wp_static_cli.py --url "${url}" --output "${out}"`;
    if (media && media !== url) {
      cmd += ` --media-domain "${media}"`;
    }
    if (conc !== "6") {
      cmd += ` --concurrency ${conc}`;
    }
    if (limit) {
      cmd += ` --limit ${limit}`;
    }
    if (search) {
      cmd += ` --no-search`;
    }

    generatedCommand.textContent = cmd;
  }

  [cliUrl, cliOutput, cliMedia, cliLimit, cliConcurrency, cliSearch].forEach(input => {
    if (input) {
      input.addEventListener("input", updateCommand);
      input.addEventListener("change", updateCommand);
    }
  });

  if (copyCliBtn && generatedCommand) {
    copyCliBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(generatedCommand.textContent).then(() => {
        const orig = copyCliBtn.textContent;
        copyCliBtn.textContent = "✅ Copied!";
        setTimeout(() => { copyCliBtn.textContent = orig; }, 2000);
      });
    });
  }

  // Live HTML Cleaner Demo
  const inputHtml = document.getElementById("cleaner-input");
  const outputHtml = document.getElementById("cleaner-output");
  const cleanBtn = document.getElementById("cleaner-run-btn");
  const resetBtn = document.getElementById("cleaner-sample-btn");

  const sampleWPHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="generator" content="WordPress 6.7.1" />
  <link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://nq-international.com/xmlrpc.php?rsd" />
  <link rel="https://api.w.org/" href="https://nq-international.com/wp-json/" />
  <link rel="stylesheet" href="https://nq-international.com/wp-content/themes/evolve/style.css?ver=6.4.2" />
  <script id="wp-emoji-settings" type="application/json">{"concatemoji":"wp-emoji-release.min.js"}</script>
  <title>Ireland Lecture | NurulQuran International</title>
</head>
<body>
  <div id="wpadminbar">Admin bar here</div>
  <header>
    <a href="https://nq-international.com/aboutus/">About Us</a>
  </header>
  <main>
    <h2>Wake up Ummah Lecture</h2>
    <audio controls>
      <source src="https://nq-international.com/wp-content/uploads/Ireland/Wake up Ummah.mp3" type="audio/mpeg">
    </audio>
    <p>Download presentation: <a href="https://nq-international.com/wp-content/uploads/Ireland/slides.ppt">Lecture Slides.ppt</a></p>
    <img src="https://nq-international.com/wp-content/uploads/2024/01/banner.jpg" srcset="https://nq-international.com/wp-content/uploads/2024/01/banner-300x200.jpg 300w, https://nq-international.com/wp-content/uploads/2024/01/banner.jpg 800w" />
  </main>
  <script src="https://nq-international.com/wp-includes/js/wp-embed.min.js"></script>
</body>
</html>`;

  function runCleaningDemo() {
    if (!inputHtml || !outputHtml) return;
    let html = inputHtml.value;

    // 1. Remove bloat
    html = html.replace(/<meta[^>]*name=["']generator["'][^>]*>/gi, "");
    html = html.replace(/<link[^>]*rel=["'](EditURI|https:\/\/api\.w\.org\/)["'][^>]*>/gi, "");
    html = html.replace(/<script[^>]*id=["']wp-emoji-settings["'][^>]*>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<script[^>]*wp-embed[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<div id=["']wpadminbar["']>[\s\S]*?<\/div>/gi, "");

    // 2. Rewrite internal navigation links to clean relative static paths
    html = html.replace(/href=["']https:\/\/nq-international\.com\/([a-zA-Z0-9_\-\/]+)\/["']/gi, 'href="/$1/"');

    // 3. Keep MP3, PPT, and JPG on original server
    // Note: They stay pointing to https://nq-international.com!
    outputHtml.value = html;
  }

  if (cleanBtn) {
    cleanBtn.addEventListener("click", runCleaningDemo);
  }

  if (resetBtn && inputHtml) {
    resetBtn.addEventListener("click", () => {
      inputHtml.value = sampleWPHtml;
      runCleaningDemo();
    });
  }

  // Initialize
  updateCommand();
  if (inputHtml && !inputHtml.value) {
    inputHtml.value = sampleWPHtml;
    runCleaningDemo();
  }
});
