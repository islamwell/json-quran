/**
 * Surah Al-Qamar Word-by-Word Intelligence Application
 * Version: v1.0.0 (updated 2026-09-02 18:35)
 */

class SurahQamarApp {
  constructor() {
    this.data = null;
    this.activeColorMode = 'case'; // 'case' | 'pos' | 'morpheme'
    this.activeThemeFilter = 'all';
    this.activeCaseFilter = 'all';
    this.searchQuery = '';
    this.currentAudio = null;

    this.init();
  }

  async init() {
    try {
      const response = await fetch('surah-al-qamar.json');
      this.data = await response.json();
      this.setupEventListeners();
      this.renderLegend();
      this.renderVerses();
    } catch (err) {
      console.error('Failed to load surah-al-qamar.json:', err);
      const container = document.getElementById('verses-container');
      if (container) {
        container.innerHTML = `
          <div class="loading-state" style="color: #ef4444;">
            <p><strong>Error loading data.</strong> Please ensure <code>surah-al-qamar.json</code> is accessible.</p>
          </div>
        `;
      }
    }
  }

  setupEventListeners() {
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
        dlAnchor.setAttribute("download", "surah-al-qamar.json");
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
          <strong>Raf' (الرفع / الضمة)</strong>: Actor, Subject, Primary Independent [Blue]
        </span>
        <span class="legend-chip" style="background:${palette.nasb.bg}; color:${palette.nasb.text}; border-color:${palette.nasb.border};">
          <span class="legend-dot" style="background:${palette.nasb.color};"></span>
          <strong>Nasb (النصب / الفتحة)</strong>: Direct Object, Circumstance, Dependent [Green]
        </span>
        <span class="legend-chip" style="background:${palette.jarr.bg}; color:${palette.jarr.text}; border-color:${palette.jarr.border};">
          <span class="legend-dot" style="background:${palette.jarr.color};"></span>
          <strong>Jarr (الجر / الكسرة)</strong>: Preposition, Idafa Specifier [Purple]
        </span>
        <span class="legend-chip" style="background:${palette.jazm.bg}; color:${palette.jazm.text}; border-color:${palette.jazm.border};">
          <span class="legend-dot" style="background:${palette.jazm.color};"></span>
          <strong>Jazm (الجزم / السكون)</strong>: Command, Condition, Cutoff [Amber]
        </span>
        <span class="legend-chip" style="background:${palette.mabni.bg}; color:${palette.mabni.text}; border-color:${palette.mabni.border};">
          <span class="legend-dot" style="background:${palette.mabni.color};"></span>
          <strong>Mabni (المبني)</strong>: Invariable Base (Past verbs, Particles) [Slate]
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
          <strong>Harf (حرف)</strong>: Particle (Meaning depends on adjacent words)
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
        return v.text_uthmani.includes(q) ||
               v.text_imlaei.includes(q) ||
               v.translation.toLowerCase().includes(q) ||
               v.words.some(w => 
                 w.arabic_uthmani.includes(q) ||
                 w.translation.toLowerCase().includes(q) ||
                 (w.sarf.root_ar && w.sarf.root_ar.includes(q)) ||
                 (w.sarf.root && w.sarf.root.includes(q)) ||
                 w.irab_and_case.why_this_ending.toLowerCase().includes(q)
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

    return `
      <article class="verse-card ${v.is_divine_refrain ? 'is-refrain' : ''}" id="verse-${v.ayah_number}">
        <div class="verse-header">
          <div class="verse-meta">
            <span class="ayah-badge">Ayah ${v.ayah_number}</span>
            <span class="theme-pill" style="border-color:${v.thematic_color}; color:${v.thematic_color}; background:${v.thematic_color}10;">
              ${v.thematic_section_title}
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
            «${v.text_uthmani}»
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

    modalBody.innerHTML = `
      ${audioBtn}

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
            ${w.sarf.root ? `<strong>${w.sarf.root}</strong> (${w.sarf.root_concept || ''})` : 'Uninflected / Non-triliteral'}
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-label">Pattern (الوزن الصرفي)</div>
          <div class="detail-value" style="font-family:'Amiri', serif; font-size:1.15rem; color:#2563eb;">
            ${w.sarf.wazn || '—'}
          </div>
        </div>
      </div>

      <!-- Extra Morphological Features -->
      ${w.classification.primary_type === 'fi\'l' ? `
        <div class="detail-grid">
          <div class="detail-card">
            <div class="detail-label">Verb Form (الباب)</div>
            <div class="detail-value">${w.classification.details.form} (${w.classification.details.form_ar})</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">${w.classification.details.form_meaning}</div>
          </div>
          <div class="detail-card">
            <div class="detail-label">Tense & Voice (الزمن والبناء)</div>
            <div class="detail-value">${w.classification.details.tense_ar} • ${w.classification.details.voice_ar}</div>
          </div>
          <div class="detail-card">
            <div class="detail-label">Soundness (الصحة والاعتلال)</div>
            <div class="detail-value">${w.classification.details.soundness_ar}</div>
          </div>
        </div>
      ` : ''}

      ${w.classification.primary_type === 'ism' ? `
        <div class="detail-grid">
          <div class="detail-card">
            <div class="detail-label">Noun Derivation (الاشتقاق)</div>
            <div class="detail-value">${w.classification.details.derivation_ar || w.classification.details.derivation}</div>
          </div>
          <div class="detail-card">
            <div class="detail-label">Gender & Number</div>
            <div class="detail-value">${w.classification.details.gender} • ${w.classification.details.number}</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Marker: ${w.classification.details.gender_marker}</div>
          </div>
          <div class="detail-card">
            <div class="detail-label">Agreement Rule</div>
            <div class="detail-value" style="${w.classification.details.is_non_human_plural ? 'color:#dc2626;' : ''}">
              ${w.classification.details.agreement_rule || 'Standard agreement'}
            </div>
          </div>
        </div>
      ` : ''}

      ${w.irab_and_case.idafa.role !== 'none' ? `
        <div style="background:#f1f5f9; padding:12px; border-radius:6px; font-size:0.85rem; color:#334155; border-left:4px solid #7c3aed;">
          <strong>Idafa Construction (إضافة):</strong> ${w.irab_and_case.idafa.notes}
        </div>
      ` : ''}

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
        <p><strong>Ism (اسم):</strong> ${framework.trilateral_word_classification.ism}</p>
        <p><strong>Fi'l (فعل):</strong> ${framework.trilateral_word_classification.fil}</p>
        <p><strong>Harf (حرف):</strong> ${framework.trilateral_word_classification.harf}</p>
      </div>

      <div class="pedagogy-section">
        <h3><span>2.</span> Case Endings & Vowel Marking (أسرار حركات الإعراب)</h3>
        <p><strong style="color:var(--raf-blue);">Dhumma / Raf' (الرفع / الضمة):</strong> ${framework.case_endings_irab_rationale.dhumma_raf}</p>
        <p><strong style="color:var(--nasb-green);">Fatha / Nasb (النصب / الفتحة):</strong> ${framework.case_endings_irab_rationale.fatha_nasb}</p>
        <p><strong style="color:var(--jarr-purple);">Kasra / Jarr (الجر / الكسرة):</strong> ${framework.case_endings_irab_rationale.kasra_jarr}</p>
        <p><strong style="color:var(--jazm-amber);">Sukun / Jazm (الجزم / السكون):</strong> ${framework.case_endings_irab_rationale.sukun_jazm}</p>
      </div>

      <div class="pedagogy-section">
        <h3><span>3.</span> The Idafa Construction (قواعد الإضافة)</h3>
        <p><strong>Mudhaf (المضاف):</strong> ${framework.idafa_construction_rules.mudhaf}</p>
        <p><strong>Mudhaf Ilayhi (المضاف إليه):</strong> ${framework.idafa_construction_rules.mudhaf_ilayhi}</p>
      </div>

      <div class="pedagogy-section">
        <h3><span>4.</span> Non-Human Plurals Agreement (قاعدة جمع غير العاقل)</h3>
        <p><strong>Golden Rule:</strong> ${framework.gender_number_agreement_and_non_human_plurals.golden_rule}</p>
        <p><strong>Broken Plurals (جموع التكسير):</strong> ${framework.gender_number_agreement_and_non_human_plurals.broken_plurals}</p>
      </div>

      <div class="pedagogy-section">
        <h3><span>5.</span> Eleven-Step Systematic Morphology Sequence</h3>
        <ol>
          ${framework.eleven_step_sarf_progression.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
    `;
  }
}

// Instantiate on load
document.addEventListener('DOMContentLoaded', () => {
  window.qamarApp = new SurahQamarApp();
});
