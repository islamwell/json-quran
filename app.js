/**
 * Quran Word-by-Word Grammatical Intelligence & AI Tutor Application
 * Version: v1.0.6 (updated 2026-09-03 01:15)
 */

class QuranGrammarApp {
  constructor() {
    this.data = null;
    const urlParams = new URLSearchParams(window.location.search);
    const surahParam = urlParams.get('surah');
    this.currentSurahFile = (surahParam === 'asr' || surahParam === '103') ? 'surah-al-asr.json' : 'surah-al-qamar.json';
    this.activeColorMode = 'case'; // 'case' | 'pos' | 'syntax' | 'morpheme'
    this.activeThemeFilter = 'all';
    this.activeCaseFilter = 'all';
    this.searchQuery = '';
    this.currentAudio = null;
    this.settings = {
      fontFamily: 'me_quran',
      ayahFontSize: 2.15,
      wordFontSize: 1.55,
      lineHeight: 2.4,
      scale: 1.0
    };
    this.loadSettings();
    this.applySettings();

    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadSurah(this.currentSurahFile);
  }

  async loadSurah(filename) {
    this.currentSurahFile = filename;
    const sel = document.getElementById('surah-select');
    if (sel) sel.value = filename;
    const container = document.getElementById('verses-container');
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading Quranic dataset and morphological matrix...</p>
        </div>
      `;
    }

    try {
      const response = await fetch(filename);
      this.data = await response.json();
      this.updateHeaderAndStats();
      this.populateThemeFilter();
      this.renderLegend();
      this.renderVerses();
    } catch (err) {
      console.error('Failed to load dataset:', err);
      if (container) {
        container.innerHTML = `
          <div class="loading-state" style="color: #ef4444;">
            <p><strong>Error loading data.</strong> Please ensure <code>${filename}</code> is accessible.</p>
          </div>
        `;
      }
    }
  }

  updateHeaderAndStats() {
    if (!this.data) return;
    const meta = this.data.metadata;

    // Header Title
    const brandIcon = document.getElementById('brand-icon');
    const brandTitle = document.getElementById('brand-title');
    const brandTitleAr = document.getElementById('brand-title-ar');
    const brandSubtitle = document.getElementById('brand-subtitle');

    if (brandTitle) brandTitle.childNodes[0].textContent = meta.surah_name_en + ' ';
    if (brandTitleAr) brandTitleAr.textContent = meta.surah_name_ar;
    if (brandIcon) brandIcon.textContent = meta.surah_number === 103 ? '⏳' : '🌙';
    if (brandSubtitle) {
      brandSubtitle.textContent = meta.surah_number === 103
        ? 'Master Multi-Layer Dataset: AI Tutor Levels, Visual Syntax Trees, and Root Intelligence'
        : 'Word-by-word lowest-level morpheme breakdown, Sarf morphology, and I\'rab color coding';
    }

    // Stats
    const statAyahs = document.getElementById('stat-ayahs');
    const statWords = document.getElementById('stat-words');
    const statMorphemes = document.getElementById('stat-morphemes');
    const statRoots = document.getElementById('stat-roots');
    const refrainsDivider = document.getElementById('stat-refrains-divider');
    const refrainsItem = document.getElementById('stat-refrains-item');

    if (statAyahs) statAyahs.textContent = meta.total_verses;
    if (statWords) statWords.textContent = meta.total_words;
    if (statMorphemes) statMorphemes.textContent = meta.total_morphemes || 32;
    if (statRoots) {
      const rootCount = this.data.root_network ? Object.keys(this.data.root_network).length : (this.data.root_index ? this.data.root_index.length : 9);
      statRoots.textContent = rootCount;
    }

    if (refrainsDivider && refrainsItem) {
      if (meta.surah_number === 54) {
        refrainsDivider.style.display = 'block';
        refrainsItem.style.display = 'flex';
      } else {
        refrainsDivider.style.display = 'none';
        refrainsItem.style.display = 'none';
      }
    }
  }

  populateThemeFilter() {
    const themeFilter = document.getElementById('theme-filter');
    if (!themeFilter || !this.data || !this.data.thematic_sections) return;

    const sections = this.data.thematic_sections;
    let html = `<option value="all">All Stories & Themes (${sections.length} Sections)</option>`;
    sections.forEach(sec => {
      html += `<option value="${sec.section_id}">${sec.section_id}. ${sec.title_en} (${sec.ayah_range})</option>`;
    });
    themeFilter.innerHTML = html;
    this.activeThemeFilter = 'all';
  }

  setupEventListeners() {
    this.setupSettingsListeners();
    // Surah selector
    const surahSelect = document.getElementById('surah-select');
    if (surahSelect) {
      surahSelect.addEventListener('change', (e) => {
        this.loadSurah(e.target.value);
      });
    }

    // Mode toggles
    const modeButtons = document.querySelectorAll('#color-mode-toggle .segment');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeColorMode = btn.dataset.mode;
        this.renderLegend();
        this.renderVerses();
      });
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (clearBtn) clearBtn.style.display = this.searchQuery ? 'block' : 'none';
        this.renderVerses();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.searchQuery = '';
        clearBtn.style.display = 'none';
        this.renderVerses();
      });
    }

    // Select filters
    const themeFilter = document.getElementById('theme-filter');
    if (themeFilter) {
      themeFilter.addEventListener('change', (e) => {
        this.activeThemeFilter = e.target.value;
        this.renderVerses();
      });
    }

    const caseFilter = document.getElementById('case-filter');
    if (caseFilter) {
      caseFilter.addEventListener('change', (e) => {
        this.activeCaseFilter = e.target.value;
        this.renderVerses();
      });
    }

    // Reset filters
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        if (themeFilter) themeFilter.value = 'all';
        if (caseFilter) caseFilter.value = 'all';
        this.searchQuery = '';
        this.activeThemeFilter = 'all';
        this.activeCaseFilter = 'all';
        this.renderVerses();
      });
    }

    // Modal close
    const modalBackdrop = document.getElementById('word-modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn && modalBackdrop) {
      modalCloseBtn.addEventListener('click', () => {
        modalBackdrop.style.display = 'none';
      });
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.style.display = 'none';
      });
    }

    // Drawer toggles
    const openPedagogyBtn = document.getElementById('open-pedagogy-btn');
    const pedagogyBackdrop = document.getElementById('pedagogy-drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    if (openPedagogyBtn && pedagogyBackdrop) {
      openPedagogyBtn.addEventListener('click', () => {
        this.renderPedagogyDrawer();
        pedagogyBackdrop.style.display = 'flex';
      });
    }
    if (drawerCloseBtn && pedagogyBackdrop) {
      drawerCloseBtn.addEventListener('click', () => {
        pedagogyBackdrop.style.display = 'none';
      });
      pedagogyBackdrop.addEventListener('click', (e) => {
        if (e.target === pedagogyBackdrop) pedagogyBackdrop.style.display = 'none';
      });
    }

    // Download JSON
    const downloadBtn = document.getElementById('download-json-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", this.currentSurahFile);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
      });
    }
  }

  renderLegend() {
    const container = document.getElementById('legend-chips-container');
    if (!container || !this.data) return;

    if (this.activeColorMode === 'case') {
      const palette = this.data.color_coding_system.case_and_mood_palette;
      container.innerHTML = `
        <span class="legend-chip" style="background:${palette.raf.bg}; color:${palette.raf.text}; border-color:${palette.raf.border};">
          <span class="legend-dot" style="background:${palette.raf.color};"></span>
          <strong>Raf' (الرفع / الضمة)</strong>: Actor, Subject, Primary Independent
        </span>
        <span class="legend-chip" style="background:${palette.nasb.bg}; color:${palette.nasb.text}; border-color:${palette.nasb.border};">
          <span class="legend-dot" style="background:${palette.nasb.color};"></span>
          <strong>Nasb (النصب / الفتحة)</strong>: Direct Object, Inna Subject, Dependent
        </span>
        <span class="legend-chip" style="background:${palette.jarr.bg}; color:${palette.jarr.text}; border-color:${palette.jarr.border};">
          <span class="legend-dot" style="background:${palette.jarr.color};"></span>
          <strong>Jarr (الجر / الكسرة)</strong>: Preposition, Oath Noun, Idafa Specifier
        </span>
        <span class="legend-chip" style="background:${palette.jazm.bg}; color:${palette.jazm.text}; border-color:${palette.jazm.border};">
          <span class="legend-dot" style="background:${palette.jazm.color};"></span>
          <strong>Jazm (الجزم / السكون)</strong>: Command, Condition, Cutoff
        </span>
        <span class="legend-chip" style="background:${palette.mabni.bg}; color:${palette.mabni.text}; border-color:${palette.mabni.border};">
          <span class="legend-dot" style="background:${palette.mabni.color};"></span>
          <strong>Mabni (المبني)</strong>: Invariable Base (Past verbs, Particles)
        </span>
      `;
    } else if (this.activeColorMode === 'pos') {
      const palette = this.data.color_coding_system.word_classification_palette;
      container.innerHTML = `
        <span class="legend-chip" style="background:${palette.ism.bg}; color:#1e40af; border-color:#93c5fd;">
          <span class="legend-dot" style="background:${palette.ism.color};"></span>
          <strong>Ism (اسم)</strong>: Noun, Pronoun, Adjective (Independent of time)
        </span>
        <span class="legend-chip" style="background:${palette.fi_l ? palette.fi_l.bg : '#ffe4e6'}; color:#9f1239; border-color:#fecdd3;">
          <span class="legend-dot" style="background:#e11d48;"></span>
          <strong>Fi'l (فعل)</strong>: Verb (Past, Present, Imperative Action)
        </span>
        <span class="legend-chip" style="background:${palette.harf.bg}; color:#92400e; border-color:#fde68a;">
          <span class="legend-dot" style="background:${palette.harf.color};"></span>
          <strong>Harf (حرف)</strong>: Particle (Prepositions, Conjunctions, Emphasis)
        </span>
      `;
    } else if (this.activeColorMode === 'syntax') {
      container.innerHTML = `
        <span class="legend-chip" style="background:#f4ecf7; color:#6c3483; border-color:#d7bde2;">
          <span class="legend-dot" style="background:#8e44ad;"></span>
          <strong>Sworn Oaths (مقسم به)</strong>
        </span>
        <span class="legend-chip" style="background:#fef5e7; color:#b9770e; border-color:#f9e79f;">
          <span class="legend-dot" style="background:#e67e22;"></span>
          <strong>Subject of Inna (اسم إن)</strong>
        </span>
        <span class="legend-chip" style="background:#eafaf1; color:#1e8449; border-color:#a9dfbf;">
          <span class="legend-dot" style="background:#27ae60;"></span>
          <strong>Predicate of Inna (خبر إن)</strong>
        </span>
        <span class="legend-chip" style="background:#fbeee6; color:#a04000; border-color:#edbb99;">
          <span class="legend-dot" style="background:#d35400;"></span>
          <strong>Excepted Entity (مستثنى)</strong>
        </span>
        <span class="legend-chip" style="background:#e8f8f5; color:#117a65; border-color:#a3e4d7;">
          <span class="legend-dot" style="background:#16a085;"></span>
          <strong>Direct Object (مفعول به)</strong>
        </span>
        <span class="legend-chip" style="background:#fdedec; color:#922b21; border-color:#f5b7b1;">
          <span class="legend-dot" style="background:#c0392b;"></span>
          <strong>Form VI Reciprocal Verb (تفاعل)</strong>
        </span>
      `;
    } else if (this.activeColorMode === 'morpheme') {
      const palette = this.data.color_coding_system.morpheme_tier_palette;
      container.innerHTML = `
        <span class="legend-chip" style="background:${palette.prefix.bg}; color:#92400e; border-color:#fde68a;">
          <span class="legend-dot" style="background:${palette.prefix.color};"></span>
          <strong>Prefix (سابق)</strong>: Conjunctions (و/ف), Prepositions (بـ/لـ), Definite Article (الـ)
        </span>
        <span class="legend-chip" style="background:${palette.stem_root.bg}; color:#1e40af; border-color:#bfdbfe;">
          <span class="legend-dot" style="background:${palette.stem_root.color};"></span>
          <strong>Core Stem (جذع)</strong>: Triliteral Root + Pattern (ف-ع-ل)
        </span>
        <span class="legend-chip" style="background:${palette.suffix.bg}; color:#9d174d; border-color:#fbcfe8;">
          <span class="legend-dot" style="background:${palette.suffix.color};"></span>
          <strong>Suffix (لاحق)</strong>: Attached Pronouns, Feminine Tā', Plural Markers
        </span>
      `;
    }
  }


  loadSettings() {
    try {
      const saved = localStorage.getItem('quran_reader_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load settings from localStorage', e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('quran_reader_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage', e);
    }
  }

  applySettings() {
    const root = document.documentElement;
    const font = this.settings.fontFamily || 'me_quran';
    const ayahSize = (this.settings.ayahFontSize * this.settings.scale).toFixed(2);
    const wordSize = (this.settings.wordFontSize * this.settings.scale).toFixed(2);
    const lineH = this.settings.lineHeight.toFixed(1);

    // Apply CSS variables
    root.style.setProperty('--quran-font-family', `'${font}', 'UthmanicHafs', 'UthmanTN', 'Amiri Quran', serif`);
    root.style.setProperty('--ayah-font-size', `${ayahSize}rem`);
    root.style.setProperty('--word-font-size', `${wordSize}rem`);
    root.style.setProperty('--ayah-line-height', lineH);

    // Update UI Elements
    const quickDisplay = document.getElementById('quick-font-display');
    if (quickDisplay) quickDisplay.textContent = `${Math.round(this.settings.scale * 100)}%`;

    const ayahVal = document.getElementById('ayah-size-val');
    if (ayahVal) ayahVal.textContent = `${ayahSize}rem`;

    const wordVal = document.getElementById('word-size-val');
    if (wordVal) wordVal.textContent = `${wordSize}rem`;

    const lineVal = document.getElementById('line-height-val');
    if (lineVal) lineVal.textContent = lineH;

    const sliderAyah = document.getElementById('slider-ayah-size');
    if (sliderAyah) sliderAyah.value = this.settings.ayahFontSize;

    const sliderWord = document.getElementById('slider-word-size');
    if (sliderWord) sliderWord.value = this.settings.wordFontSize;

    const sliderLine = document.getElementById('slider-line-height');
    if (sliderLine) sliderLine.value = this.settings.lineHeight;

    const fontBadge = document.getElementById('current-font-name');
    const fontNames = {
      'me_quran': 'Madina Othmani (Tanzil)',
      'UthmanicHafs': 'Madina Mushaf (KFGQPC)',
      'UthmanTN': 'Uthman Taha Naskh',
      'Amiri Quran': 'Amiri Quran'
    };
    if (fontBadge) fontBadge.textContent = fontNames[font] || font;

    // Update active font cards
    document.querySelectorAll('.font-card').forEach(card => {
      card.classList.toggle('active', card.dataset.font === font);
    });

    // Update live preview in modal
    const preview = document.getElementById('settings-preview-text');
    if (preview) {
      preview.style.fontFamily = `'${font}', serif`;
      preview.style.fontSize = `${ayahSize}rem`;
      preview.style.lineHeight = lineH;
    }
  }

  setupSettingsListeners() {
    // Open/Close Settings Modal
    const openBtn = document.getElementById('open-settings-btn');
    const closeBtn = document.getElementById('settings-close-btn');
    const saveBtn = document.getElementById('save-settings-btn');
    const backdrop = document.getElementById('settings-modal-backdrop');

    if (openBtn && backdrop) {
      openBtn.addEventListener('click', () => {
        this.applySettings();
        backdrop.style.display = 'flex';
      });
    }

    const closeModal = () => {
      if (backdrop) backdrop.style.display = 'none';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (saveBtn) saveBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    // Font card selection
    document.querySelectorAll('.font-card').forEach(card => {
      card.addEventListener('click', () => {
        this.settings.fontFamily = card.dataset.font;
        this.saveSettings();
        this.applySettings();
      });
    });

    // Quick Stepper (A- / A+)
    const quickDec = document.getElementById('quick-dec-font');
    const quickInc = document.getElementById('quick-inc-font');
    if (quickDec) {
      quickDec.addEventListener('click', () => {
        if (this.settings.scale > 0.7) {
          this.settings.scale = Math.max(0.7, parseFloat((this.settings.scale - 0.1).toFixed(2)));
          this.saveSettings();
          this.applySettings();
        }
      });
    }
    if (quickInc) {
      quickInc.addEventListener('click', () => {
        if (this.settings.scale < 1.8) {
          this.settings.scale = Math.min(1.8, parseFloat((this.settings.scale + 0.1).toFixed(2)));
          this.saveSettings();
          this.applySettings();
        }
      });
    }

    // Sliders
    const sliderAyah = document.getElementById('slider-ayah-size');
    if (sliderAyah) {
      sliderAyah.addEventListener('input', (e) => {
        this.settings.ayahFontSize = parseFloat(e.target.value);
        this.saveSettings();
        this.applySettings();
      });
    }

    const sliderWord = document.getElementById('slider-word-size');
    if (sliderWord) {
      sliderWord.addEventListener('input', (e) => {
        this.settings.wordFontSize = parseFloat(e.target.value);
        this.saveSettings();
        this.applySettings();
      });
    }

    const sliderLine = document.getElementById('slider-line-height');
    if (sliderLine) {
      sliderLine.addEventListener('input', (e) => {
        this.settings.lineHeight = parseFloat(e.target.value);
        this.saveSettings();
        this.applySettings();
      });
    }

    // Individual Slider Steppers (- / +)
    const btnDecAyah = document.getElementById('btn-dec-ayah');
    const btnIncAyah = document.getElementById('btn-inc-ayah');
    if (btnDecAyah && sliderAyah) {
      btnDecAyah.addEventListener('click', () => {
        this.settings.ayahFontSize = Math.max(1.4, parseFloat((this.settings.ayahFontSize - 0.1).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }
    if (btnIncAyah && sliderAyah) {
      btnIncAyah.addEventListener('click', () => {
        this.settings.ayahFontSize = Math.min(3.4, parseFloat((this.settings.ayahFontSize + 0.1).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }

    const btnDecWord = document.getElementById('btn-dec-word');
    const btnIncWord = document.getElementById('btn-inc-word');
    if (btnDecWord && sliderWord) {
      btnDecWord.addEventListener('click', () => {
        this.settings.wordFontSize = Math.max(1.1, parseFloat((this.settings.wordFontSize - 0.05).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }
    if (btnIncWord && sliderWord) {
      btnIncWord.addEventListener('click', () => {
        this.settings.wordFontSize = Math.min(2.5, parseFloat((this.settings.wordFontSize + 0.05).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }

    const btnDecLine = document.getElementById('btn-dec-line');
    const btnIncLine = document.getElementById('btn-inc-line');
    if (btnDecLine && sliderLine) {
      btnDecLine.addEventListener('click', () => {
        this.settings.lineHeight = Math.max(1.8, parseFloat((this.settings.lineHeight - 0.1).toFixed(1)));
        this.saveSettings();
        this.applySettings();
      });
    }
    if (btnIncLine && sliderLine) {
      btnIncLine.addEventListener('click', () => {
        this.settings.lineHeight = Math.min(3.4, parseFloat((this.settings.lineHeight + 0.1).toFixed(1)));
        this.saveSettings();
        this.applySettings();
      });
    }

    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.dataset.preset;
        if (preset === 'compact') {
          this.settings.scale = 0.8;
          this.settings.ayahFontSize = 1.85;
          this.settings.wordFontSize = 1.35;
        } else if (preset === 'normal') {
          this.settings.scale = 1.0;
          this.settings.ayahFontSize = 2.15;
          this.settings.wordFontSize = 1.55;
        } else if (preset === 'large') {
          this.settings.scale = 1.25;
          this.settings.ayahFontSize = 2.45;
          this.settings.wordFontSize = 1.75;
        } else if (preset === 'xlarge') {
          this.settings.scale = 1.5;
          this.settings.ayahFontSize = 2.75;
          this.settings.wordFontSize = 1.95;
        }
        this.saveSettings();
        this.applySettings();
      });
    });

    // Reset settings
    const resetBtn = document.getElementById('reset-settings-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.settings = {
          fontFamily: 'me_quran',
          ayahFontSize: 2.15,
          wordFontSize: 1.55,
          lineHeight: 2.4,
          scale: 1.0
        };
        this.saveSettings();
        this.applySettings();
      });
    }
  }

  renderVerses() {
    const container = document.getElementById('verses-container');
    if (!container || !this.data) return;

    let filtered = this.data.verses;

    // Theme filter
    if (this.activeThemeFilter !== 'all') {
      const sectionId = parseInt(this.activeThemeFilter);
      filtered = filtered.filter(v => v.thematic_section_id === sectionId);
    }

    // Case filter
    if (this.activeCaseFilter !== 'all') {
      filtered = filtered.filter(v => 
        v.words.some(w => w.irab_and_case.case_or_mood === this.activeCaseFilter)
      );
    }

    // Search query
    if (this.searchQuery) {
      const q = this.searchQuery;
      filtered = filtered.filter(v => {
        return (v.text_uthmani && v.text_uthmani.includes(q)) ||
               (v.text && v.text.uthmani && v.text.uthmani.includes(q)) ||
               (v.translation && v.translation.toLowerCase().includes(q)) ||
               v.words.some(w => 
                 w.arabic_uthmani.includes(q) ||
                 (w.translation && w.translation.toLowerCase().includes(q)) ||
                 (w.sarf.root_ar && w.sarf.root_ar.includes(q)) ||
                 (w.sarf.root && typeof w.sarf.root === 'string' && w.sarf.root.includes(q)) ||
                 (w.irab_and_case && w.irab_and_case.why_this_ending && w.irab_and_case.why_this_ending.toLowerCase().includes(q))
               );
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="loading-state">
          <p>No matching verses found for the selected filters or search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(v => this.renderVerseCard(v)).join('');

    // Attach click handlers to words
    container.querySelectorAll('.word-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const wordId = parseInt(e.currentTarget.dataset.wordId);
        const wordData = this.findWordById(wordId);
        if (wordData) {
          this.openWordModal(wordData);
        }
      });
    });
  }

  renderVerseCard(v) {
    const wordsHtml = v.words.map(w => this.renderWordCard(w)).join('');
    const verseText = v.text_uthmani || (v.text ? v.text.uthmani : '');
    const themeColor = v.thematic_color || '#10b981';

    return `
      <article class="verse-card ${v.is_divine_refrain ? 'is-refrain' : ''}" id="verse-${v.ayah_number}">
        <div class="verse-header">
          <div class="verse-meta">
            <span class="ayah-badge">Ayah ${v.ayah_number}</span>
            <span class="theme-pill" style="border-color:${themeColor}; color:${themeColor}; background:${themeColor}10;">
              ${v.thematic_section_title || 'Sacred Text'}
            </span>
            ${v.is_divine_refrain ? `
              <span class="refrain-badge">
                ⭐ Divine Refrain
              </span>
            ` : ''}
          </div>
        </div>

        <div class="verse-body">
          <div class="verse-full-arabic">
            «${verseText}»
          </div>

          <div class="words-grid">
            ${wordsHtml}
          </div>
        </div>

        <div class="verse-translation">
          <div class="translation-label">Translation (Sahih International):</div>
          "${v.translation}"
          ${v.is_divine_refrain ? `
            <div style="margin-top:8px; font-weight:600; color:#b45309; font-size:0.85rem;">
              💡 <em>Refrain Lesson: Repeated 4 times across Surah Al-Qamar to anchor active reflection: the Quran is unlocked and made effortless for anyone seeking sincere remembrance!</em>
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }

  renderWordCard(w) {
    let wordColor = w.color_coding.case_color;
    let badgeText = w.irab_and_case.ending_vowel;
    let badgeBg = w.color_coding.case_bg;
    let badgeBorder = w.color_coding.case_border;
    let badgeColor = w.color_coding.case_color;

    if (this.activeColorMode === 'pos') {
      wordColor = w.color_coding.pos_color;
      badgeText = w.classification.primary_type_ar;
      badgeBg = w.color_coding.pos_bg;
      badgeBorder = w.color_coding.pos_color;
      badgeColor = w.color_coding.pos_color;
    } else if (this.activeColorMode === 'syntax') {
      const role = w.irab_and_case.grammatical_role;
      if (role.includes('muqsam_bihi')) {
        wordColor = '#8e44ad';
        badgeText = 'مقسم به (Oath)';
        badgeBg = '#f4ecf7';
        badgeBorder = '#8e44ad';
        badgeColor = '#6c3483';
      } else if (role.includes('ism_inna')) {
        wordColor = '#e67e22';
        badgeText = 'اسم إن (Subject)';
        badgeBg = '#fef5e7';
        badgeBorder = '#e67e22';
        badgeColor = '#b9770e';
      } else if (role.includes('khabar_inna') || role.includes('majroor_bi_fi')) {
        wordColor = '#27ae60';
        badgeText = 'خبر إن (Predicate)';
        badgeBg = '#eafaf1';
        badgeBorder = '#27ae60';
        badgeColor = '#1e8449';
      } else if (role.includes('mustathna')) {
        wordColor = '#d35400';
        badgeText = 'مستثنى (Excepted)';
        badgeBg = '#fbeee6';
        badgeBorder = '#d35400';
        badgeColor = '#a04000';
      } else if (role.includes('mafool_bihi')) {
        wordColor = '#16a085';
        badgeText = 'مفعول به (Object)';
        badgeBg = '#e8f8f5';
        badgeBorder = '#16a085';
        badgeColor = '#117a65';
      } else if (role.includes('reciprocal')) {
        wordColor = '#c0392b';
        badgeText = 'فعل تفاعلي (Form VI)';
        badgeBg = '#fdedec';
        badgeBorder = '#c0392b';
        badgeColor = '#922b21';
      } else {
        wordColor = '#2980b9';
        badgeText = 'صلة / عاطف';
        badgeBg = '#ebf5fb';
        badgeBorder = '#2980b9';
        badgeColor = '#1f618d';
      }
    } else if (this.activeColorMode === 'morpheme') {
      wordColor = '#2563eb';
      badgeText = `${w.lowest_level_breakdown.morphemes_count} morphemes`;
      badgeBg = '#f1f5f9';
      badgeBorder = '#cbd5e1';
      badgeColor = '#475569';
    }

    const morphemesHtml = w.lowest_level_breakdown.morphemes.map(m => `
      <span class="morpheme-pill" style="border-color:${m.color_code}; color:${m.color_code}; background:${m.color_code}15;">
        ${m.arabic}
      </span>
    `).join('');

    return `
      <div class="word-card" data-word-id="${w.id}">
        <span class="word-position-badge">${w.location}</span>
        <div class="word-arabic" style="color: ${wordColor};">
          ${w.arabic_uthmani}
        </div>
        <div class="word-translit">${w.transliteration}</div>
        <div class="word-meaning">${w.translation}</div>
        <span class="case-badge" style="background:${badgeBg}; border-color:${badgeBorder}; color:${badgeColor};">
          ${badgeText}
        </span>
        <div class="word-morphemes-bar" title="Sub-word morphemes">
          ${morphemesHtml}
        </div>
      </div>
    `;
  }

  findWordById(id) {
    for (const v of this.data.verses) {
      for (const w of v.words) {
        if (w.id === id) return w;
      }
    }
    return null;
  }

  openWordModal(w) {
    const modalBackdrop = document.getElementById('word-modal-backdrop');
    const locBadge = document.getElementById('modal-loc-badge');
    const arText = document.getElementById('modal-word-arabic');
    const translitText = document.getElementById('modal-word-translit');
    const modalBody = document.getElementById('modal-body-content');

    if (!modalBackdrop || !modalBody) return;

    locBadge.textContent = w.location;
    arText.textContent = w.arabic_uthmani;
    arText.style.color = w.color_coding.case_color;
    translitText.textContent = `"${w.transliteration}" — ${w.translation}`;

    // Audio button
    const audioBtn = w.audio_url ? `
      <button class="btn btn-sm btn-outline" id="play-modal-audio-btn" style="margin-bottom:12px;">
        🔊 Listen Word Audio
      </button>
    ` : '';

    // Morpheme Rows
    const morphemeRows = w.lowest_level_breakdown.morphemes.map(m => `
      <tr>
        <td class="ar-cell" style="color:${m.color_code}; font-weight:700;">${m.arabic}</td>
        <td><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${m.color_code}; margin-right:4px;"></span>${m.type.toUpperCase()}</td>
        <td><code>${m.pos_tag}</code></td>
        <td>${m.role}</td>
        <td><code>${m.vowel}</code></td>
      </tr>
    `).join('');

    // Look for AI Explanation entry
    const aiData = this.data.ai_explanations
      ? this.data.ai_explanations.find(item => item.token_id === w.location)
      : null;

    let aiTutorHtml = '';
    if (aiData) {
      // Visual Syntax Tree Connections
      const connectionsHtml = aiData.syntax_tree_connections ? aiData.syntax_tree_connections.map(c => `
        <div class="syntax-connection-chip">
          <span class="syntax-badge">${c.relation}</span>
          <span>${c.node}</span>
        </div>
      `).join('') : '';

      // Similar Quran Examples
      const similarExamplesHtml = aiData.similar_quran_examples ? aiData.similar_quran_examples.map(ex => `
        <div class="quran-example-card">
          <div class="quran-example-meta">
            <span>Surah ${ex.ayah}</span>
          </div>
          <div class="quran-example-ayah">${ex.text}</div>
          <div class="quran-example-exp">${ex.explanation}</div>
        </div>
      `).join('') : '';

      // Same Root Words
      const sameRootHtml = aiData.same_root_words && aiData.same_root_words.length > 0 ? aiData.same_root_words.map(r => `
        <span class="tag-pill">
          <strong>${r.word}</strong>
          <span>(${r.ayah}: ${r.meaning})</span>
        </span>
      `).join('') : '<span style="color:#64748b; font-size:0.85rem;">Non-inflected particle</span>';

      // Same Pattern Words
      const samePatternHtml = aiData.same_pattern_words && aiData.same_pattern_words.length > 0 ? aiData.same_pattern_words.map(p => `
        <div style="font-size:0.85rem; color:#334155; margin-top:4px;">
          <strong>Pattern ${p.pattern}:</strong>
          <span class="tags-pills-row" style="display:inline-flex; margin-left:6px;">
            ${p.words.map(pw => `<span class="tag-pill">${pw}</span>`).join('')}
          </span>
        </div>
      `).join('') : '<span style="color:#64748b; font-size:0.85rem;">—</span>';

      aiTutorHtml = `
        <!-- AI Arabic Tutor Box -->
        <div class="ai-tutor-box">
          <div class="ai-tutor-header">
            <div class="ai-tutor-title">
              <span>🤖</span> AI Arabic Tutor
            </div>
            <div class="ai-level-tabs" id="ai-level-tabs">
              <button class="ai-tab-btn active" data-level="beginner">🌱 Beginner</button>
              <button class="ai-tab-btn" data-level="intermediate">📘 Intermediate</button>
              <button class="ai-tab-btn" data-level="advanced">🔬 Advanced</button>
            </div>
          </div>
          <div class="ai-explanation-content" id="modal-ai-content">
            ${aiData.beginner.text}
          </div>
        </div>

        <!-- Visual Syntax Tree Connections -->
        ${connectionsHtml ? `
          <div class="syntax-tree-box">
            <div class="syntax-tree-title"><span>🌳</span> Visual Syntax Tree Connections</div>
            <div class="syntax-connections-list">
              ${connectionsHtml}
            </div>
          </div>
        ` : ''}

        <!-- Similar Qur'an Examples -->
        ${similarExamplesHtml ? `
          <div class="syntax-tree-box" style="background:#ffffff;">
            <div class="syntax-tree-title"><span>📖</span> Similar Qur'an Examples</div>
            <div class="quran-cards-list">
              ${similarExamplesHtml}
            </div>
          </div>
        ` : ''}

        <!-- Same Root & Pattern Intelligence -->
        <div class="syntax-tree-box" style="background:#ffffff;">
          <div class="syntax-tree-title"><span>🌱</span> Words with Same Root in Qur'an</div>
          <div class="tags-pills-row">
            ${sameRootHtml}
          </div>

          <div class="syntax-tree-title" style="margin-top:14px;"><span>📐</span> Words on Same Pattern (Wazn)</div>
          <div>
            ${samePatternHtml}
          </div>
        </div>
      `;
    }

    modalBody.innerHTML = `
      ${audioBtn}

      ${aiTutorHtml}

      <!-- Why This Ending Box (Golden Pedagogical Box) -->
      <div class="why-ending-box">
        <div class="why-ending-title">
          <span>✨</span> Why This Ending? (عامل الإعراب وحركة الآخِر)
        </div>
        <div class="why-ending-text">
          ${w.irab_and_case.why_this_ending}
        </div>
      </div>

      <!-- Classification & Sarf Details Grid -->
      <div class="detail-grid">
        <div class="detail-card">
          <div class="detail-label">Word Category (النوع)</div>
          <div class="detail-value" style="color:${w.color_coding.pos_color};">
            ${w.classification.primary_type.toUpperCase()} (${w.classification.primary_type_ar})
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-label">Case & Mood (الحالة الإعرابية)</div>
          <div class="detail-value" style="color:${w.color_coding.case_color};">
            ${w.irab_and_case.case_or_mood_ar} (${w.irab_and_case.case_or_mood.toUpperCase()})
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-label">Root (الجذر)</div>
          <div class="detail-value">
            ${w.sarf.root ? `<strong>${typeof w.sarf.root === 'string' ? w.sarf.root : (w.sarf.root.normalized || '')}</strong>` : 'Uninflected / Non-triliteral'}
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-label">Pattern (الوزن الصرفي)</div>
          <div class="detail-value" style="font-family:'Amiri', serif; font-size:1.15rem; color:#2563eb;">
            ${w.sarf.wazn || '—'}
          </div>
        </div>
      </div>

      <!-- Lowest Level Morpheme Table -->
      <div>
        <div class="morpheme-table-title">
          <span>🧩</span> Lowest-Level Morpheme Breakdown (${w.lowest_level_breakdown.morphemes_count} segments)
        </div>
        <table class="morpheme-table">
          <thead>
            <tr>
              <th style="width:25%;">Segment</th>
              <th>Tier</th>
              <th>POS Tag</th>
              <th>Grammatical Role</th>
              <th>Vowel Mark</th>
            </tr>
          </thead>
          <tbody>
            ${morphemeRows}
          </tbody>
        </table>
      </div>
    `;

    // Tab level switcher logic
    if (aiData) {
      const tabBtns = modalBody.querySelectorAll('.ai-tab-btn');
      const contentBox = document.getElementById('modal-ai-content');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const level = btn.dataset.level;
          if (contentBox && aiData[level]) {
            contentBox.textContent = aiData[level].text;
          }
        });
      });
    }

    // Audio listener
    const playAudioBtn = document.getElementById('play-modal-audio-btn');
    if (playAudioBtn && w.audio_url) {
      playAudioBtn.addEventListener('click', () => {
        if (this.currentAudio) this.currentAudio.pause();
        this.currentAudio = new Audio(w.audio_url);
        this.currentAudio.play();
      });
    }

    modalBackdrop.style.display = 'flex';
  }

  renderPedagogyDrawer() {
    const container = document.getElementById('drawer-body-content');
    if (!container || !this.data) return;

    const framework = this.data.pedagogical_framework;

    container.innerHTML = `
      <div class="pedagogy-section">
        <h3><span>1.</span> The Trilateral Classification (ثلاثية الكلمة: اسم / فعل / حرف)</h3>
        <p>${framework.trilateral_word_classification ? (framework.trilateral_word_classification.ism || JSON.stringify(framework.trilateral_word_classification)) : 'Encompasses nouns, verbs, and particles.'}</p>
      </div>

      <div class="pedagogy-section">
        <h3><span>2.</span> Surah Architectural Thesis (الأطروحة التربوية للسورة)</h3>
        <p>${framework.core_surah_thesis || framework.historical_maxim || 'A concise constitution of human deliverance.'}</p>
      </div>
    `;
  }
}

// Instantiate on load
document.addEventListener('DOMContentLoaded', () => {
  window.quranApp = new QuranGrammarApp();
});
