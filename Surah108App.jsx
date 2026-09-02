import React, { useState } from "react";

// Complete Master Dataset for Surah Al-Kawthar (108)
const KAWTHAR_DATA = {
  surah_id: 108,
  surah_name_ar: "الكوثر",
  surah_name_en: "Al-Kawthar",
  meaning: "The Abundance",
  classification: "Makki",
  total_verses: 3,
  total_words: 10,
  total_letters: 42,
  verses: [
    {
      id: "108:1",
      number: 1,
      text_uthmani: "إِنَّآ أَعْطَيْنَـٰكَ ٱلْكَوْثَرَ",
      translation: "Indeed, We have granted you, [O Muhammad], al-Kawthar.",
      transliteration: "Innā aʿṭaynāka l-kawthar",
      tokens: [
        {
          id: "108:1:1",
          text: "إِنَّآ",
          lemma: "إِنَّ",
          root: null,
          pos_class: "particle",
          pos_label: "Particle + Pronoun",
          tooltip: "Particle + Pronoun: Indeed, We",
          case_class: "case-mansoob",
          syntax_class: "syntax-inna",
          irab: "حرف توكيد ونصب مبني على الفتح، و(نا) ضمير متصل مبني في محل نصب اسم إن",
          wazn: "—",
          ai_explanations: {
            beginner: "Inna means 'Indeed, We'. Allah uses the royal 'We' (Plural of Majesty) to declare His boundless power, honor, and closeness to the Prophet ﷺ.",
            intermediate: "A contraction of Harf Tawkeed wa Nasb (إِنَّ) and the first-person plural attached pronoun (نَا). It governs the nominal sentence, setting the foundation of certainty.",
            advanced: "The assimilation of Inna with Na of majesty (نون العظمة) highlights the sovereign grandeur of the divine Bestower before unveiling the magnificence of the gift itself."
          },
          syntax_tree: [
            { from: "Allah (Majesty)", to: "إِنَّآ", relation: "divine_speaker" },
            { from: "إِنَّآ", to: "أَعْطَيْنَـٰكَ", relation: "khabar_inna_sentence" }
          ],
          similar_quran_examples: [
            { ayah: "97:1", text: "إِنَّآ أَنزَلْنَـٰهُ فِى لَيْلَةِ ٱلْقَدْرِ", explanation: "Plural of majesty introducing the Quran's revelation" },
            { ayah: "48:1", text: "إِنَّا فَتَحْنَا لَكَ فَتْحًۭا مُّبِينًۭا", explanation: "Plural of majesty guaranteeing victory" }
          ],
          same_root_words: [],
          same_pattern_words: []
        },
        {
          id: "108:1:2",
          text: "أَعْطَيْنَـٰكَ",
          lemma: "أَعْطَىٰ",
          root: "ع-ط-ي",
          root_letters: ["ع", "ط", "ي"],
          pos_class: "verb-past",
          pos_label: "Verb (Past Form IV)",
          tooltip: "Verb (Past Form IV) + Subject + Object: We have granted you",
          case_class: "case-mabni",
          syntax_class: "syntax-verb",
          irab: "فعل ماض مبني على السكون لاتصاله بنا الفاعلين، و(نا) فاعل، والكاف مفعول به أول",
          wazn: "أَفْعَلْنَاكَ",
          verb_form: 4,
          tense: "past",
          ai_explanations: {
            beginner: "A'tayna means 'We gave', and 'ka' means 'to you'. Allah has already granted the Prophet ﷺ unmatched favors in this life and the next.",
            intermediate: "Form IV past active verb (أَفْعَلَ) taking two objects. Suffix 'Na' is the subject pronoun (Fa'il), and suffix 'Ka' is the first direct object (Maf'ul bihi 1).",
            advanced: "The past tense denotes absolute, irreversible divine certainty: although the fountain of Paradise will be enjoyed in the Hereafter, Allah speaks of it as already completed."
          },
          syntax_tree: [
            { from: "Allah", to: "أَعْطَيْنَـٰكَ", relation: "subject_actor" },
            { from: "أَعْطَيْنَـٰكَ", to: "كَ (Prophet ﷺ)", relation: "first_direct_object" },
            { from: "أَعْطَيْنَـٰكَ", to: "ٱلْكَوْثَرَ", relation: "second_direct_object" }
          ],
          similar_quran_examples: [
            { ayah: "93:5", text: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", explanation: "Promise of continuous divine giving until complete pleasure" }
          ],
          same_root_words: [
            { word: "عَطَاء", ayah: "78:36", meaning: "divine gift and calculation" },
            { word: "أَعْطَىٰ", ayah: "92:5", meaning: "he gave in charity" }
          ],
          same_pattern_words: [
            { pattern: "أَفْعَلْنَا", words: ["أَنزَلْنَا (We sent down)", "أَرْسَلْنَا (We sent)", "أَكْرَمْنَا (We honored)"] }
          ]
        },
        {
          id: "108:1:3",
          text: "ٱلْكَوْثَرَ",
          lemma: "كَوْثَر",
          root: "ك-ث-ر",
          root_letters: ["ك", "ث", "ر"],
          pos_class: "noun",
          pos_label: "Noun (Intensive Pattern)",
          tooltip: "Noun (Accusative): The Abundance / River in Paradise",
          case_class: "case-mansoob",
          syntax_class: "syntax-object",
          irab: "مفعول به ثان منصوب وعلامة نصبه الفتحة الظاهرة على آخره",
          wazn: "فَوْعَل",
          ai_explanations: {
            beginner: "Al-Kawthar means 'endless good', including the special river and pearlescent fountain in Paradise reserved for the Prophet ﷺ and his followers.",
            intermediate: "Second direct object (Maf'ul bihi 2), taking Fatha (mansoob). Morphologically molded on the intensive hyperbolic pattern Faw'al (فَوْعَل) from root K-Th-R.",
            advanced: "Pattern Faw'al signifies infinite, inexhaustible multiplicity: not merely 'many', but a self-replenishing ocean of grace, wisdom, prophethood, intercession, and posterity."
          },
          syntax_tree: [
            { from: "أَعْطَيْنَـٰكَ", to: "ٱلْكَوْثَرَ", relation: "governed_second_object" }
          ],
          similar_quran_examples: [
            { ayah: "102:1", text: "أَلْهَىٰكُمُ ٱلتَّكَاثُرُ", explanation: "Competition in worldly increase vs eternal Kawthar" }
          ],
          same_root_words: [
            { word: "كَثِير", ayah: "2:26", meaning: "abundant / many" },
            { word: "تَكَاثُر", ayah: "102:1", meaning: "rivalry in accumulation" }
          ],
          same_pattern_words: [
            { pattern: "فَوْعَل", words: ["جَوْهَر (Jewel/Essence)", "نَوْفَل (Bountiful sea)", "كَوْثَر (Endless abundance)"] }
          ]
        }
      ]
    },
    {
      id: "108:2",
      number: 2,
      text_uthmani: "فَصَلِّ لِرَبِّكَ وَٱنْحَرْ",
      translation: "So pray to your Lord and sacrifice [to Him alone].",
      transliteration: "Fa-ṣalli li-rabbika wan-ḥar",
      tokens: [
        {
          id: "108:2:1",
          text: "فَـ",
          lemma: "فَـ",
          root: null,
          pos_class: "particle",
          pos_label: "Particle (Consequence)",
          tooltip: "Particle: So / Therefore (Gratitude through Devotion)",
          case_class: "case-mabni",
          syntax_class: "syntax-particle",
          irab: "الفاء فصيحة أو سببية مبنية على الفتح",
          wazn: "—",
          ai_explanations: {
            beginner: "Fa means 'So' or 'Therefore'. Because Allah gave you so much good, the immediate answer is grateful prayer.",
            intermediate: "Fa al-Sababiyyah (causative Fa) or Fa al-Fasiha. Grammatically connects the prior bounty (Verse 1) to the mandate of devotion (Verse 2).",
            advanced: "Rhetorically asserts the foundational rule of gratitude (Shukr): divine favor demands physical and spiritual submission to the Bestower alone."
          },
          syntax_tree: [
            { from: "ٱلْكَوْثَرَ (Bounty)", to: "صَلِّ (Prayer)", relation: "causal_link_fa" }
          ],
          similar_quran_examples: [],
          same_root_words: [],
          same_pattern_words: []
        },
        {
          id: "108:2:2",
          text: "صَلِّ",
          lemma: "صَلَّىٰ",
          root: "ص-ل-و",
          root_letters: ["ص", "ل", "و"],
          pos_class: "verb-imperative",
          pos_label: "Verb (Imperative Form II)",
          tooltip: "Verb (Imperative Form II): Pray!",
          case_class: "case-mabni",
          syntax_class: "syntax-verb",
          irab: "فعل أمر مبني على حذف حرف العلة (الياء)، والفاعل ضمير مستتر تقديره أنت",
          wazn: "فَعِّلْ",
          verb_form: 2,
          tense: "imperative",
          ai_explanations: {
            beginner: "Salli means 'Pray!'. Prayer is the pure conversation and gratitude between servant and Lord.",
            intermediate: "Form II imperative verb (فَعِّلْ). Built on the deletion of the final weak radical (حذف حرف العلة). Hidden subject is 'anta' (thou).",
            advanced: "Form II conveys intensive and steadfast dedication. Rebukes pagan ostentation by anchoring prayer in pure monotheistic devotion (Ikhlas)."
          },
          syntax_tree: [
            { from: "صَلِّ", to: "لِرَبِّكَ", relation: "prepositional_attachment" },
            { from: "صَلِّ", to: "وَٱنْحَرْ", relation: "conjoined_command" }
          ],
          similar_quran_examples: [
            { ayah: "87:15", text: "وَذَكَرَ ٱسْمَ رَبِّهِۦ فَصَلَّىٰ", explanation: "Remembrance followed by heartfelt prayer" }
          ],
          same_root_words: [
            { word: "صَلَاة", ayah: "2:3", meaning: "prayer" },
            { word: "مُصَلًّى", ayah: "2:125", meaning: "place of prayer" }
          ],
          same_pattern_words: [
            { pattern: "فَعِّلْ", words: ["سَبِّحْ (Glorify!)", "كَبِّرْ (Magnify!)", "يَسِّرْ (Make easy!)"] }
          ]
        },
        {
          id: "108:2:3",
          text: "لِرَبِّكَ",
          lemma: "رَبّ",
          root: "ر-ب-ب",
          root_letters: ["ر", "ب", "ب"],
          pos_class: "preposition",
          pos_label: "Preposition + Noun + Pronoun",
          tooltip: "Preposition + Noun + Pronoun: For your Lord alone",
          case_class: "case-majroor",
          syntax_class: "syntax-preposition",
          irab: "اللام حرف جر للاختصاص، رب اسم مجرور بالكسرة وهو مضاف، والكاف مضاف إليه",
          wazn: "فَعْل",
          ai_explanations: {
            beginner: "Li-Rabbika means 'for your Lord'. Worship Allah alone, not false idols or for the praise of people.",
            intermediate: "Preposition Lam (denoting exclusivity) + noun Rabb in genitive (majroor) + attached pronoun Ka as Mudaf Ilayh.",
            advanced: "The name Rabb invokes nurturing providence, cherishing guardianship, and supreme authority. It specifically negates Meccan polytheistic dedications."
          },
          syntax_tree: [
            { from: "لِـ (Preposition)", to: "رَبِّ (Majroor)", relation: "governing_jarr" },
            { from: "رَبِّ", to: "كَ (Pronoun)", relation: "possessive_idafa" }
          ],
          similar_quran_examples: [
            { ayah: "6:162", text: "قُلْ إِنَّ صَلَاتِى وَنُسُكِى وَمَحْيَاىَ وَمَمَاتِى لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", explanation: "Dedication of prayer and sacrifice solely to Allah" }
          ],
          same_root_words: [
            { word: "رَبّ", ayah: "1:2", meaning: "Lord and Cherisher" }
          ],
          same_pattern_words: []
        },
        {
          id: "108:2:4",
          text: "وَٱنْحَرْ",
          lemma: "نَحَرَ",
          root: "ن-ح-ر",
          root_letters: ["ن", "ح", "ر"],
          pos_class: "verb-imperative",
          pos_label: "Verb (Imperative Form I)",
          tooltip: "Conjunction + Verb (Imperative Form I): And sacrifice!",
          case_class: "case-mabni",
          syntax_class: "syntax-verb",
          irab: "الواو عاطفة، وانحر فعل أمر مبني على السكون، والفاعل ضمير مستتر تقديره أنت",
          wazn: "اِفْعَلْ",
          verb_form: 1,
          tense: "imperative",
          ai_explanations: {
            beginner: "Wanhar means 'and sacrifice'. Offering food and charity in gratitude to Allah and to feed the needy.",
            intermediate: "Conjunction Waw + Form I imperative verb on pattern If'al (اِفْعَلْ), built on Sukun. Conjoined to Salli.",
            advanced: "Nahr specifies the slaughter of camels (the most prized Arabian commodity). Combining prayer (bodily devotion) and Nahr (financial sacrifice) covers total worship."
          },
          syntax_tree: [
            { from: "صَلِّ", to: "وَٱنْحَرْ", relation: "conjoined_deed" }
          ],
          similar_quran_examples: [
            { ayah: "22:36", text: "وَٱلْبُدْنَ جَعَلْنَـٰهَا لَكُم مِّن شَعَـٰٓئِرِ ٱللَّهِ", explanation: "Sacrificial camels as sacred symbols of gratitude" }
          ],
          same_root_words: [],
          same_pattern_words: [
            { pattern: "اِفْعَلْ", words: ["ٱصْبِرْ (Endure!)", "ٱعْلَمْ (Know!)", "ٱقْرَأْ (Recite!)"] }
          ]
        }
      ]
    },
    {
      id: "108:3",
      number: 3,
      text_uthmani: "إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ",
      translation: "Indeed, your enemy is the one cut off.",
      transliteration: "Inna shāni'aka huwa l-abtar",
      tokens: [
        {
          id: "108:3:1",
          text: "إِنَّ",
          lemma: "إِنَّ",
          root: null,
          pos_class: "particle",
          pos_label: "Particle (Emphasis)",
          tooltip: "Particle: Indeed (Firm Divine Declaration)",
          case_class: "case-mabni",
          syntax_class: "syntax-inna",
          irab: "حرف توكيد ونصب ينصب الاسم ويرفع الخبر",
          wazn: "—",
          ai_explanations: {
            beginner: "Inna means 'Indeed'. Allah guarantees that His promise will come to pass without question.",
            intermediate: "Harf Tawkeed wa Nasb. It governs Shani'aka in accusative and Al-Abtar in nominative.",
            advanced: "Reiterating Inna at the start of Verse 3 forms an emphatic rhetorical envelope, comforting the Prophet ﷺ against slander."
          },
          syntax_tree: [
            { from: "إِنَّ", to: "شَانِئَكَ", relation: "governs_ism_inna" },
            { from: "إِنَّ", to: "ٱلْأَبْتَرُ", relation: "governs_khabar_inna" }
          ],
          similar_quran_examples: [],
          same_root_words: [],
          same_pattern_words: []
        },
        {
          id: "108:3:2",
          text: "شَانِئَكَ",
          lemma: "شَانِئ",
          root: "ش-ن-أ",
          root_letters: ["ش", "ن", "أ"],
          pos_class: "noun",
          pos_label: "Active Participle (Ism Fa'il)",
          tooltip: "Active Participle (Ism Inna) + Pronoun: Your enemy / hater",
          case_class: "case-mansoob",
          syntax_class: "syntax-subject",
          irab: "اسم إن منصوب وعلامة نصبه الفتحة وهو مضاف، والكاف مضاف إليه",
          wazn: "فَاعِل",
          ai_explanations: {
            beginner: "Shani'aka means 'your enemy or hater'. It refers to the pagan Meccans who insulted the Prophet ﷺ.",
            intermediate: "Active participle (Ism Fa'il) on pattern Fa'il, serving as Ism Inna in accusative (mansoob with Fatha), with attached pronoun Ka.",
            advanced: "Root Sh-N-A signifies spiteful, bitter hatred. Using the active participle describes a person who has made spite their permanent identity."
          },
          syntax_tree: [
            { from: "شَانِئَ", to: "كَ", relation: "possessive_idafa" },
            { from: "شَانِئَكَ", to: "هُوَ", relation: "separation_link" }
          ],
          similar_quran_examples: [
            { ayah: "5:8", text: "وَلَا يَجْرِمَنَّكُمْ شَنَـَٔانُ قَوْمٍ", explanation: "Warning against allowing hatred of people to cause injustice" }
          ],
          same_root_words: [
            { word: "شَنَـَٔان", ayah: "5:2", meaning: "hostility / resentment" }
          ],
          same_pattern_words: [
            { pattern: "فَاعِل", words: ["صَالِح (Righteous)", "صَابِر (Patient)", "شَاكِر (Grateful)"] }
          ]
        },
        {
          id: "108:3:3",
          text: "هُوَ",
          lemma: "هُوَ",
          root: null,
          pos_class: "negative",
          pos_label: "Pronoun (Separation / Exclusivity)",
          tooltip: "Pronoun: He alone (Damir Fasl - Restriction)",
          case_class: "case-mabni",
          syntax_class: "syntax-pronoun",
          irab: "ضمير فصل مبني على الفتح لا محل له من الإعراب يفيد الحصر والتوكيد",
          wazn: "—",
          ai_explanations: {
            beginner: "Huwa means 'he' or 'he is the one'. It turns the insult completely back onto the hater.",
            intermediate: "Damir Fasl (Pronoun of Separation). It separates subject from predicate and produces rhetorical restriction (Hasr).",
            advanced: "Grammatically neutral (لا محل له من الإعراب), yet rhetorically crucial: 'He alone—and not you—is the one stripped of all goodness and progeny.'"
          },
          syntax_tree: [
            { from: "هُوَ (Damir Fasl)", to: "ٱلْأَبْتَرُ", relation: "emphatic_copula" }
          ],
          similar_quran_examples: [
            { ayah: "2:37", text: "إِنَّهُۥ هُوَ ٱلتَّوَّابُ ٱلرَّحِيمُ", explanation: "Damir Fasl reinforcing unique divine forgiveness" }
          ],
          same_root_words: [],
          same_pattern_words: []
        },
        {
          id: "108:3:4",
          text: "ٱلْأَبْتَرُ",
          lemma: "أَبْتَر",
          root: "ب-ت-ر",
          root_letters: ["ب", "ت", "ر"],
          pos_class: "noun",
          pos_label: "Adjective (Elative / Defect)",
          tooltip: "Adjective (Khabar Inna): The one cut off without legacy",
          case_class: "case-marfoo",
          syntax_class: "syntax-predicate",
          irab: "خبر إن مرفوع وعلامة رفعه الضمة الظاهرة على آخره",
          wazn: "أَفْعَل",
          ai_explanations: {
            beginner: "Al-Abtar means 'cut off'. The enemies mocked the Prophet ﷺ when his infant son passed away, but Allah ensured their names were erased while Muhammad's name ﷺ is honored globally forever.",
            intermediate: "Adjective on pattern Af'al (أَفْعَل). Functions as Khabar Inna in the nominative case (marfoo' with Dhumma).",
            advanced: "Batar (بتر) denotes total severance without trace. Prophecy fulfilled: the mockers were extinguished, while the spiritual lineage of Muhammad ﷺ embraces billions of believers."
          },
          syntax_tree: [
            { from: "شَانِئَكَ", to: "ٱلْأَبْتَرُ", relation: "subject_to_predicate" }
          ],
          similar_quran_examples: [
            { ayah: "94:4", text: "وَرَفَعْنَا لَكَ ذِكْرَكَ", explanation: "And We raised high for you your repute" }
          ],
          same_root_words: [
            { word: "بَتْر", ayah: "Lexicon", meaning: "cutting off completely" }
          ],
          same_pattern_words: [
            { pattern: "أَفْعَل", words: ["أَعْظَم (Greater)", "أَحْسَن (Best)", "أَبْتَر (Cut off)"] }
          ]
        }
      ]
    }
  ]
};

export default function Surah108App() {
  const [showAnimations, setShowAnimations] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true);
  const [colorMode, setColorMode] = useState("pos"); // 'pos' | 'case' | 'syntax'
  const [selectedToken, setSelectedToken] = useState(KAWTHAR_DATA.verses[0].tokens[1]); // default to أَعْطَيْنَاكَ
  const [aiLevel, setAiLevel] = useState("beginner"); // 'beginner' | 'intermediate' | 'advanced'

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    :root {
      --font-arabic: 'Amiri Quran', 'Amiri', 'Traditional Arabic', serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .app-root {
      min-height: 100vh;
      background: linear-gradient(180deg, #f8fafc 0%, #eef2f6 100%);
      font-family: var(--font-sans);
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1.25rem 3rem 1.25rem;
    }

    /* Top Navigation Header */
    .app-header {
      width: 100%;
      max-width: 1060px;
      text-align: center;
      margin-bottom: 2rem;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }

    .surah-title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }

    h1.surah-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #0f172a;
    }

    .surah-title-ar {
      font-family: var(--font-arabic);
      font-size: 2.6rem;
      color: #2563eb;
      direction: rtl;
    }

    p.surah-subtitle {
      color: #64748b;
      font-size: 1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Interactive Controls Bar */
    .controls-wrapper {
      width: 100%;
      max-width: 1060px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
      margin-bottom: 2rem;
    }

    .control-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .control-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-right: 0.25rem;
    }

    .segmented-group {
      display: flex;
      background: #f1f5f9;
      padding: 0.25rem;
      border-radius: 0.5rem;
      gap: 0.25rem;
    }

    .seg-btn {
      border: none;
      background: transparent;
      padding: 0.45rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      border-radius: 0.35rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .seg-btn:hover { color: #1e293b; }
    .seg-btn.active {
      background: #ffffff;
      color: #2563eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .toggle-btn {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      padding: 0.45rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #334155;
      border-radius: 0.5rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s ease;
    }

    .toggle-btn:hover { background: #f8fafc; border-color: #94a3b8; }
    .toggle-btn.is-active {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1d4ed8;
    }

    /* Verses Display Canvas */
    .verses-canvas {
      width: 100%;
      max-width: 1060px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .verse-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.25rem;
      padding: 1.75rem 2rem;
      box-shadow: 0 4px 10px -2px rgba(0,0,0,0.03);
      position: relative;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .verse-box:hover {
      border-color: #cbd5e1;
    }

    .verse-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .ayah-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      background: #f1f5f9;
      color: #475569;
      border-radius: 6px;
    }

    .instruction-hint {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    /* Arabic Sentence Formatting */
    .sentence {
      direction: rtl;
      unicode-bidi: embed;
      font-family: var(--font-arabic);
      font-size: 3rem;
      line-height: 2.1;
      text-align: right;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem 1.5rem;
      padding: 0.5rem 0;
    }

    /* Word Coloring Guide Modes */
    /* 1. Word Class (POS) Mode */
    .pos-mode .verb-past { color: #0D47A1; }
    .pos-mode .verb-present { color: #2196F3; }
    .pos-mode .verb-imperative { color: #00BCD4; text-shadow: 0 0 14px rgba(0,188,212,0.8); }
    .pos-mode .noun { color: #4CAF50; }
    .pos-mode .preposition { color: #9C27B0; }
    .pos-mode .particle { color: #7B1FA2; }
    .pos-mode .negative { color: #E53935; }
    .pos-mode .pronoun { color: #F57C00; }

    /* 2. Case & Mood Mode */
    .case-mode .case-marfoo { color: #2563eb; }
    .case-mode .case-mansoob { color: #059669; }
    .case-mode .case-majroor { color: #7c3aed; }
    .case-mode .case-mabni { color: #64748b; }

    /* 3. Syntax Mode */
    .syntax-mode .syntax-inna { color: #d97706; }
    .syntax-mode .syntax-subject { color: #dc2626; }
    .syntax-mode .syntax-object { color: #059669; }
    .syntax-mode .syntax-verb { color: #0284c7; }
    .syntax-mode .syntax-predicate { color: #2563eb; }
    .syntax-mode .syntax-preposition { color: #7c3aed; }
    .syntax-mode .syntax-pronoun { color: #e11d48; }

    /* Keyframe Animations */
    @keyframes pulsePast {
      0%, 100% { text-shadow: 0 0 0 rgba(13,71,161,0.3); }
      50% { text-shadow: 0 0 12px rgba(13,71,161,0.7); }
    }

    @keyframes pulsePresent {
      0%, 100% { text-shadow: 0 0 0 rgba(33,150,243,0.3); }
      50% { text-shadow: 0 0 12px rgba(33,150,243,0.8); }
    }

    .pulse-past { animation: pulsePast 3s ease-in-out infinite; }
    .animate-pulse { animation: pulsePresent 3s ease-in-out infinite; }

    /* Clickable Word Token */
    .gram-word {
      cursor: pointer;
      position: relative;
      display: inline-block;
      padding: 0.1rem 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      user-select: none;
    }

    .gram-word:hover {
      background: rgba(37, 99, 235, 0.08);
      transform: translateY(-2px);
    }

    .gram-word.is-selected {
      background: rgba(37, 99, 235, 0.15);
      outline: 2px solid #2563eb;
    }

    /* Tooltip */
    .gram-word::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 125%;
      right: 50%;
      transform: translateX(50%);
      background: rgba(15, 23, 42, 0.95);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      white-space: nowrap;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 500;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease-in-out, transform 0.25s ease;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
      z-index: 50;
    }

    .show-tooltips .gram-word:hover::after {
      opacity: 1;
      transform: translateX(50%) translateY(-4px);
    }

    .verse-translation {
      margin-top: 1rem;
      color: #475569;
      font-size: 1rem;
      line-height: 1.6;
      border-top: 1px dashed #e2e8f0;
      padding-top: 0.75rem;
    }

    /* Word Intelligence Detail Drawer */
    .detail-inspector {
      width: 100%;
      max-width: 1060px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 1.25rem;
      padding: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .inspector-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1.25rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .word-hero-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .word-arabic-hero {
      font-family: var(--font-arabic);
      font-size: 3rem;
      color: #2563eb;
      line-height: 1;
    }

    .word-sub-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .word-translit {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
    }

    .word-role-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      color: #475569;
      background: #f1f5f9;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    /* AI Tutor Level Tabs */
    .ai-tutor-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .ai-tutor-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .ai-tutor-title {
      font-size: 0.95rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #1e293b;
    }

    .ai-level-pills {
      display: flex;
      background: #e2e8f0;
      padding: 0.25rem;
      border-radius: 0.5rem;
      gap: 0.25rem;
    }

    .ai-pill-btn {
      border: none;
      background: transparent;
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      border-radius: 0.35rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .ai-pill-btn.active {
      background: #ffffff;
      color: #2563eb;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .ai-content-box {
      font-size: 0.95rem;
      line-height: 1.7;
      color: #334155;
      background: #ffffff;
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      border-left: 4px solid #2563eb;
    }

    /* Morphological & Grammatical Grid */
    .morpho-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .morpho-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 1rem;
    }

    .morpho-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.35rem;
    }

    .morpho-val {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }

    /* Visual Syntax Tree Box */
    .syntax-tree-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 0.85rem;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .tree-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #334155;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .syntax-chain {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .syntax-edge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #f8fafc;
      padding: 0.65rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
    }

    .edge-badge {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      font-family: var(--font-mono);
    }

    /* Similar Quran Examples & Roots */
    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .comp-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 0.85rem;
      padding: 1.25rem;
    }

    .comp-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quran-ayah-item {
      border-left: 3px solid #3b82f6;
      background: #f8fafc;
      padding: 0.75rem 1rem;
      border-radius: 0 0.5rem 0.5rem 0;
      margin-bottom: 0.75rem;
    }

    .quran-ayah-ar {
      font-family: var(--font-arabic);
      font-size: 1.35rem;
      color: #1e293b;
      direction: rtl;
      margin-bottom: 0.25rem;
    }

    .quran-ayah-exp {
      font-size: 0.8rem;
      color: #64748b;
    }

    .chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .intel-chip {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      color: #334155;
    }

    .intel-chip strong {
      font-family: var(--font-arabic);
      font-size: 1.05rem;
      color: #1d4ed8;
      margin-right: 0.35rem;
    }

    /* Footer Versioning Tag */
    .app-footer {
      margin-top: auto;
      padding-top: 3rem;
      text-align: center;
      color: #94a3b8;
      font-size: 0.85rem;
    }

    .footer-version {
      font-family: var(--font-mono);
      font-weight: 600;
      color: #64748b;
      margin-top: 0.35rem;
    }
  `;

  return (
    <div className={`app-root ${showTooltips ? 'show-tooltips' : ''} ${colorMode}-mode`}>
      <style>{styles}</style>

      {/* Header */}
      <header className="app-header">
        <div className="badge-pill">✨ Surah 108 — Master Multi-Layer Pilot</div>
        <div className="surah-title-row">
          <h1 className="surah-title">Surah Al-Kawthar</h1>
          <span className="surah-title-ar">سورة الكوثر</span>
        </div>
        <p className="surah-subtitle">
          Interactive Word-by-Word Grammar, Visual Syntax Tree, and Multi-Tier AI Linguistic Tutor
        </p>
      </header>

      {/* Controls Bar */}
      <section className="controls-wrapper">
        <div className="control-group">
          <span className="control-label">Color Dimension:</span>
          <div className="segmented-group">
            <button
              className={`seg-btn ${colorMode === 'pos' ? 'active' : ''}`}
              onClick={() => setColorMode('pos')}
            >
              🏷️ Word Class (POS)
            </button>
            <button
              className={`seg-btn ${colorMode === 'case' ? 'active' : ''}`}
              onClick={() => setColorMode('case')}
            >
              ⚖️ Case & Mood
            </button>
            <button
              className={`seg-btn ${colorMode === 'syntax' ? 'active' : ''}`}
              onClick={() => setColorMode('syntax')}
            >
              🌳 Syntax Roles
            </button>
          </div>
        </div>

        <div className="control-group">
          <button
            className={`toggle-btn ${showAnimations ? 'is-active' : ''}`}
            onClick={() => setShowAnimations(!showAnimations)}
          >
            <span>💫</span> {showAnimations ? 'Animations On' : 'Animations Off'}
          </button>
          <button
            className={`toggle-btn ${showTooltips ? 'is-active' : ''}`}
            onClick={() => setShowTooltips(!showTooltips)}
          >
            <span>💬</span> {showTooltips ? 'Tooltips On' : 'Tooltips Off'}
          </button>
        </div>
      </section>

      {/* Verses Canvas */}
      <main className="verses-canvas">
        {KAWTHAR_DATA.verses.map((verse) => (
          <article key={verse.id} className="verse-box">
            <div className="verse-meta-row">
              <span className="ayah-pill">Ayah {verse.number}</span>
              <span className="instruction-hint">Click any word to inspect in AI Tutor</span>
            </div>

            <div className="sentence" aria-label={`Surah Al-Kawthar Ayah ${verse.number}`}>
              {verse.tokens.map((token) => {
                const isSelected = selectedToken && selectedToken.id === token.id;
                let animClass = "";
                if (showAnimations) {
                  if (token.pos_class === "verb-past") animClass = "pulse-past";
                  if (token.pos_class === "verb-imperative") animClass = ""; // handled by text-shadow
                }

                return (
                  <span
                    key={token.id}
                    className={`gram-word ${token.pos_class} ${token.case_class} ${token.syntax_class} ${animClass} ${isSelected ? 'is-selected' : ''}`}
                    data-tooltip={token.tooltip}
                    onClick={() => setSelectedToken(token)}
                  >
                    {token.text}
                  </span>
                );
              })}
            </div>

            <div className="verse-translation">
              <em>"{verse.translation}"</em>
            </div>
          </article>
        ))}
      </main>

      {/* Word Intelligence Detail Drawer */}
      {selectedToken && (
        <section className="detail-inspector">
          <div className="inspector-header">
            <div className="word-hero-left">
              <span className="word-arabic-hero">{selectedToken.text}</span>
              <div className="word-sub-meta">
                <span className="word-translit">
                  {selectedToken.lemma} • {selectedToken.pos_label}
                </span>
                <span className="word-role-badge">Token ID: {selectedToken.id}</span>
              </div>
            </div>

            <div className="irab-summary" style={{ direction: 'rtl', fontFamily: 'var(--font-arabic)', fontSize: '1.2rem', color: '#1e40af' }}>
              {selectedToken.irab}
            </div>
          </div>

          {/* AI Arabic Tutor Layer */}
          <div className="ai-tutor-container">
            <div className="ai-tutor-nav">
              <div className="ai-tutor-title">
                <span>🤖</span> AI Linguistic Tutor
              </div>
              <div className="ai-level-pills">
                <button
                  className={`ai-pill-btn ${aiLevel === 'beginner' ? 'active' : ''}`}
                  onClick={() => setAiLevel('beginner')}
                >
                  🌱 Beginner
                </button>
                <button
                  className={`ai-pill-btn ${aiLevel === 'intermediate' ? 'active' : ''}`}
                  onClick={() => setAiLevel('intermediate')}
                >
                  📘 Intermediate
                </button>
                <button
                  className={`ai-pill-btn ${aiLevel === 'advanced' ? 'active' : ''}`}
                  onClick={() => setAiLevel('advanced')}
                >
                  🔬 Advanced
                </button>
              </div>
            </div>
            <div className="ai-content-box">
              {selectedToken.ai_explanations[aiLevel]}
            </div>
          </div>

          {/* Morphological Facts */}
          <div className="morpho-grid">
            <div className="morpho-card">
              <div className="morpho-label">Root (الجذر)</div>
              <div className="morpho-val">
                {selectedToken.root ? selectedToken.root : "Uninflected Particle"}
              </div>
            </div>
            <div className="morpho-card">
              <div className="morpho-label">Pattern (الوزن الصرفي)</div>
              <div className="morpho-val" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.2rem', color: '#2563eb' }}>
                {selectedToken.wazn}
              </div>
            </div>
            <div className="morpho-card">
              <div className="morpho-label">Category</div>
              <div className="morpho-val">{selectedToken.pos_label}</div>
            </div>
            {selectedToken.verb_form && (
              <div className="morpho-card">
                <div className="morpho-label">Verb Form</div>
                <div className="morpho-val">Form {selectedToken.verb_form} ({selectedToken.tense})</div>
              </div>
            )}
          </div>

          {/* Visual Syntax Tree Connections */}
          {selectedToken.syntax_tree && selectedToken.syntax_tree.length > 0 && (
            <div className="syntax-tree-card">
              <div className="tree-title">
                <span>🌳</span> Visual Syntax Tree Connections
              </div>
              <div className="syntax-chain">
                {selectedToken.syntax_tree.map((edge, idx) => (
                  <div key={idx} className="syntax-edge">
                    <span>{edge.from}</span>
                    <span className="edge-badge">── {edge.relation} ──▶</span>
                    <strong>{edge.to}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison & Cross-Root Intelligence */}
          <div className="comparison-grid">
            {/* Similar Quranic Examples */}
            <div className="comp-card">
              <div className="comp-title">
                <span>📖</span> Similar Qur'an Examples
              </div>
              {selectedToken.similar_quran_examples && selectedToken.similar_quran_examples.length > 0 ? (
                selectedToken.similar_quran_examples.map((ex, idx) => (
                  <div key={idx} className="quran-ayah-item">
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', marginBottom: '2px' }}>
                      Surah {ex.ayah}
                    </div>
                    <div className="quran-ayah-ar">{ex.text}</div>
                    <div className="quran-ayah-exp">{ex.explanation}</div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Unique standalone Quranic construct.</p>
              )}
            </div>

            {/* Same Root & Same Pattern Words */}
            <div className="comp-card">
              <div className="comp-title">
                <span>🌱</span> Words with Same Root & Pattern
              </div>

              {selectedToken.same_root_words && selectedToken.same_root_words.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Root ({selectedToken.root}):
                  </div>
                  <div className="chip-list">
                    {selectedToken.same_root_words.map((r, idx) => (
                      <span key={idx} className="intel-chip">
                        <strong>{r.word}</strong>
                        <span>({r.ayah}: {r.meaning})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedToken.same_pattern_words && selectedToken.same_pattern_words.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Pattern ({selectedToken.wazn}):
                  </div>
                  {selectedToken.same_pattern_words.map((p, idx) => (
                    <div key={idx} className="chip-list" style={{ marginTop: '0.25rem' }}>
                      {p.words.map((pw, wIdx) => (
                        <span key={wIdx} className="intel-chip">
                          {pw}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {(!selectedToken.same_root_words || selectedToken.same_root_words.length === 0) &&
               (!selectedToken.same_pattern_words || selectedToken.same_pattern_words.length === 0) && (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Uninflected structural particle.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer Versioning */}
      <footer className="app-footer">
        <p>Surah Al-Kawthar Grammar Intelligence & AI Tutor Demo</p>
        <p className="footer-version">v1.0.4 (updated 2026-09-03 00:52)</p>
      </footer>
    </div>
  );
}
