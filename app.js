/**
 * Quran Word-by-Word Grammatical Intelligence & AI Tutor Application
 * Version: v1.1.4 (updated 2026-10-07 01:00)
 */

window.GLOBAL_WORD_QUIZZES = {
  "108:1:1": {
    id: "q108_1_1",
    question: "What is the grammatical construction and rhetorical significance of 'إِنَّآ' (Innā)?",
    options: [
      { id: "a", text: "A simple conditional particle meaning 'if' with a present tense marker", correct: false, explanation: "Conditional 'if' is 'إِنْ' (in) with sukun. 'إِنَّآ' is Inna with shaddah + attached pronoun." },
      { id: "b", text: "A compound of 'إِنَّ' (particle of absolute emphasis & inception) + 'نَا' (Royal Plural pronoun of majesty 'We'), conveying supreme divine honor and certainty", correct: true, explanation: "Spot on! 'إِنَّآ' is an elision of 'إِنَّ + نَا'. 'إِنَّ' is a Harf Tawkeed wa Nasb, and 'نَا' is the Attached Pronoun acting as Ism Inna in the accusative state (محل نصب). The Royal Plural (نُون العظمة) expresses divine majesty and absolute decree." },
      { id: "c", text: "A preposition denoting 'from' with an attached second-person pronoun", correct: false, explanation: "That would be 'مِنَّا' (minnā) from 'مِنْ', which is a preposition, unlike 'إِنَّ'." },
      { id: "d", text: "A vocative exclamation particle addressed to mankind", correct: false, explanation: "Vocative particles are like 'يَا' (Yā) or 'أَيُّهَا', not 'إِنَّ'." }
    ],
    why_this_is_a_good_question: "Beginners often mistake 'إِنَّا' for a simple indivisible particle or confuse plural pronouns with numerical plurality. This question rigorously tests morphological elision (إِنَّ + نَا = إِنَّا), case governance (Ism Inna in the accusative state), and theological balāghah (how the Royal Plural 'We' in Semitic languages expresses supreme divine majesty)."
  },
  "108:1:2": {
    id: "q108_1_2",
    question: "How many grammatical arguments are packed inside 'أَعْطَيْنَـٰكَ' (aʿṭaynāka), and why is a past tense verb used for a divine grant?",
    options: [
      { id: "a", text: "Two elements; past tense expresses an uncertain wish", correct: false, explanation: "Divine speech contains no uncertainty; the word contains three distinct grammatical elements." },
      { id: "b", text: "Three elements: Form IV verb root (أَعْطَى), subject pronoun (نَا - We), and 1st direct object (كَ - you); the past tense denotes that the decree is so certain it is treated as already accomplished fact", correct: true, explanation: "Excellent! 'أَعْطَيْنَاكَ' is a complete syntactic sentence in a single word: Verb (أَعْطَى, Form IV) + Subject (نَا, the Royal Plural Doer) + 1st Object (كَ, referring to the Prophet ﷺ). Using the past tense (Māḍī) for divine bestowal expresses absolute certainty (تحقق الوقوع) — an irrevocable reality." },
      { id: "c", text: "Four elements; the verb is present tense denoting ongoing negotiation", correct: false, explanation: "It is not present tense (imperfect would be يُعْطِي / نُعْطِي), and there is no negotiation." },
      { id: "d", text: "A derived noun with two attached possessive adjectives", correct: false, explanation: "'أَعْطَى' is unequivocally a verb, not a noun." }
    ],
    why_this_is_a_good_question: "This question highlights the profound synthetic nature of Arabic morphology, where a verb, its doer, and its recipient are seamlessly fused into one token. Additionally, it addresses the key rhetorical principle of 'Taḥaqquq al-Wuqūʿ' (تحقق الوقوع) — why Allah uses the past tense for future divine promises to signify unshakeable certainty."
  },
  "108:1:3": {
    id: "q108_1_3",
    question: "What is the syntactic role of 'ٱلْكَوْثَرَ' (al-Kawthar) and what distinguishes its morphological weight (فَوْعَل) from ordinary words for 'much' (كَثِير)?",
    options: [
      { id: "a", text: "It is the 2nd direct object (مفعول به ثان); its weight 'فَوْعَل' (Fawʿal) is a hyper-intensive pattern signifying inexhaustible, limitless abundance", correct: true, explanation: "Brilliant! The verb 'أَعْطَى' is doubly-transitive (ينصب مفعولين): the 1st object is 'كَ' and the 2nd is 'ٱلْكَوْثَرَ' (mansūb with fatḥah). Morphologically, 'فَوْعَل' from root ك-ث-ر denotes abundance multiplied without ceiling or end — including the celestial river, supreme wisdom, and perpetual legacy." },
      { id: "b", text: "It is an adjective (صفة) modifying the Prophet ﷺ on the pattern فَعِيل", correct: false, explanation: "'فَعِيل' would be كَثِير. Al-Kawthar is a noun functioning as the direct object, not an adjective." },
      { id: "c", text: "It is a circumstantial adverb (حال) indicating speed on pattern مَفْعُول", correct: false, explanation: "It is not a Ḥāl, nor is it on the passive participle pattern Maf'ool." },
      { id: "d", text: "It is a delayed subject (فاعل مؤخر) on the pattern أَفْعَل", correct: false, explanation: "The subject is already 'نَا' inside the verb; 'أَفْعَل' would be 'أَكْثَر'." }
    ],
    why_this_is_a_good_question: "Many Arabic students believe sentences only have one direct object; this question tests the syntactic valency of doubly-transitive verbs (أفعال المنح والعطاء). Morphologically, it reveals why the Qur'an chose the rare, superlative weight 'فَوْعَل' over everyday words like 'كَثِير' or 'أَكْثَر' to describe infinite celestial abundance."
  },
  "108:2:1": {
    id: "q108_2_1",
    question: "What specific type of particle is the prefix 'فَـ' (Fa-) here, and what logical relationship does it forge between Ayah 1 and Ayah 2?",
    options: [
      { id: "a", text: "An interrogative particle asking a rhetorical question", correct: false, explanation: "Interrogative particles are 'هَلْ' or 'أَ', not 'فَـ'." },
      { id: "b", text: "Fāʾ al-Faṣīḥah / al-Sababiyyah (causative connector): establishing that because you have received boundless favor, therefore dedicate pure worship in gratitude", correct: true, explanation: "Exactly! The 'فَـ' is Fā' al-Faṣīḥah (الفاء الفصيحة) or Sababiyyah: it introduces the inevitable response to an unstated premise: 'Since We have granted you such immense abundance, then dedicate all your prayer and sacrifice to your Lord alone!'" },
      { id: "c", text: "A negative conjunction indicating exception", correct: false, explanation: "Particles of exception are 'إِلَّا' or 'غَيْر', not 'فَـ'." },
      { id: "d", text: "A decorative poetic letter with no logical or syntactic function", correct: false, explanation: "In Qur'anic Arabic, every particle carries precise logical, grammatical, and theological architecture." }
    ],
    why_this_is_a_good_question: "Students routinely dismiss single-letter prefixes as generic 'and's. This question demonstrates how 'Fāʾ al-Faṣīḥah' operates as a logical pivot, teaching students that Islamic worship (Shukr) is structurally presented as a loving, grateful response to divine grace (Niʿmah)."
  },
  "108:2:2": {
    id: "q108_2_2",
    question: "Why does the imperative verb 'صَلِّ' (ṣalli) end with a kasrah on the lām rather than a long vowel yāʾ ('صلي'), and what is its grammatical rule?",
    options: [
      { id: "a", text: "It is a feminine command addressed to a woman", correct: false, explanation: "The feminine command is 'صَلِّي' with a yā' (Yā' al-Mukhāṭabah). The masculine command drops the weak letter." },
      { id: "b", text: "It is an imperative of a defective verb (مُعْتَلّ الآخِر), built upon omitting the final weak letter (حَذْف حَرْف العِلَّة)", correct: true, explanation: "Precisely! The root is ص-ل-و (Form II: صَلَّى / يُصَلِّي). The imperative of a defective verb is built on what makes its imperfect jussive: deleting the final weak letter (حذف حرف العلة), leaving only the kasrah on the lām: صَلِّ." },
      { id: "c", text: "The kasrah is a dialectal variation with no grammatical significance", correct: false, explanation: "It is the standard, strict rule of classical Arabic Nahw and Sarf." },
      { id: "d", text: "It is a past tense verb in the genitive case", correct: false, explanation: "Verbs never take the genitive case (Jarr is exclusive to nouns), and this is an imperative command." }
    ],
    why_this_is_a_good_question: "This addresses one of the most widespread spelling and grammatical errors across the Arabic-speaking world — writing 'اللهم صلي' with a yā' instead of 'اللهم صلِّ'. Testing this cements the fundamental morphological rule governing defective imperative verbs."
  },
  "108:2:3": {
    id: "q108_2_3",
    question: "What does the combination of the preposition 'لِـ' and the noun 'رَبِّكَ' (li-Rabbika) establish grammatically and theologically?",
    options: [
      { id: "a", text: "The preposition 'لِـ' indicates exclusivity and dedication (الاخْتِصَاص والإِخْلاص); worship must be devoted purely to your Sustainer, contrasting with pagan polytheism", correct: true, explanation: "Right on point! Grammatically, 'لِـ' is a Harf Jarr producing the genitive (مجرور بالكسرة: رَبِّ), followed by the attached pronoun 'كَ' as Muḍāf Ilayh. Semantically, Lām al-Ikhtiṣāṣ signifies that prayer is reserved exclusively for Allah, dismantling the pagan practice of praying to idols." },
      { id: "b", text: "The 'لِـ' is an oath particle meaning 'I swear by your Lord'", correct: false, explanation: "Oath particles are Wāw, Bā', or Tā' (وَاللهِ، بِاللهِ، تَاللهِ), not Lām." },
      { id: "c", text: "The word 'رَبِّ' is nominative because it is the grammatical subject", correct: false, explanation: "It is preceded by a preposition, making it genitive (Majrūr with kasrah), not nominative." },
      { id: "d", text: "It indicates physical movement towards a spatial destination", correct: false, explanation: "Physical movement is denoted by 'إِلَى' (ilā). Here 'لِـ' expresses purpose and exclusive dedication." }
    ],
    why_this_is_a_good_question: "This question bridges grammar (Jarr wa Majrūr + Iḍāfah) directly into the Qur'an's core theological objective: Tawḥīd al-ʿIbādah (directing worship exclusively to the Creator). It shows how a single prefix particle can deliver pure monotheism."
  },
  "108:2:4": {
    id: "q108_2_4",
    question: "What is the lexical root of 'وَٱنْحَرْ' (wan-ḥar), and why is 'نَحَرَ' used here instead of common slaughter verbs like 'ذَبَحَ'?",
    options: [
      { id: "a", text: "Root ح-ر-ر meaning 'to liberate captives'", correct: false, explanation: "The root is ن-ح-ر, not ح-ر-ر." },
      { id: "b", text: "Root ن-ح-ر specifically denoting the sacrifice of camels at the base of the throat (نَحْر), representing the most prized and generous of all offerings in Arabia", correct: true, explanation: "Spot on! In classical Arabic, 'ذَبَحَ' is used for smaller livestock (sheep, goats), whereas 'نَحَرَ' is exclusively used for camels (piercing the hollow at the base of the neck). Camels were the pinnacle of Arabian wealth; commanding Naḥr symbolizes the ultimate sacrifice and massive distribution of food to the needy." },
      { id: "c", text: "Root ن-ح-ل meaning 'to give gifts of honey'", correct: false, explanation: "The root is clearly ن-ح-ر." },
      { id: "d", text: "Root ح-ر-ب meaning 'to wage war'", correct: false, explanation: "This is completely unrelated to warfare." }
    ],
    why_this_is_a_good_question: "Arabic possesses astonishing lexical precision: synonyms are never truly interchangeable. This question trains the learner in root discernment and illuminates why the Qur'an chose the specific verb for camel sacrifice to command maximum sacrificial generosity."
  },
  "108:3:1": {
    id: "q108_3_1",
    question: "What grammatical role does 'إِنَّ' (Inna) play in Ayah 3, and how does it govern the case endings of the subsequent words?",
    options: [
      { id: "a", text: "It is a negative particle that negates the verb", correct: false, explanation: "Inna confirms and emphasizes; it never negates." },
      { id: "b", text: "It is an annulling particle of emphasis (حرف توكيد ونصب) that puts its subject into the accusative (منصوب) and its predicate into the nominative (مرفوع)", correct: true, explanation: "Correct! 'إِنَّ' enters upon a nominal sentence: it puts its noun (Ism Inna: شَانِئَكَ) into the accusative (منصوب بالفتحة) and keeps its predicate (Khabar Inna: ٱلْأَبْتَرُ) in the nominative (مرفوع بالضمة)." },
      { id: "c", text: "It is a preposition that causes all following words to end with a kasrah", correct: false, explanation: "Inna is a particle of emphasis (Ḥarf Nāsikh), not a preposition (Ḥarf Jarr)." },
      { id: "d", text: "It is an interrogative particle asking if the enemy will perish", correct: false, explanation: "It is an assertion of fact, not a question." }
    ],
    why_this_is_a_good_question: "This tests the most fundamental rule of sentence government in classical Arabic: 'Inna and its sisters' (إنّ وأخواتها). Understanding how Inna changes the case of the subject from nominative to accusative while keeping the predicate nominative is critical for parsing Qur'anic syntax."
  },
  "108:3:2": {
    id: "q108_3_2",
    question: "What morphological derivative (Ism Mushtaqq) is 'شَانِئَ' (shāni'a), and what psychological attitude does its root 'ش-ن-أ' specifically signify?",
    options: [
      { id: "a", text: "Passive participle (اسم مفعول) meaning 'the one who is pitied'", correct: false, explanation: "The passive participle would be مَشْنُوء (mashnū')." },
      { id: "b", text: "Active participle (اسم فاعل on pattern فَاعِل) denoting someone actively filled with deep-seated, malicious hatred and spite", correct: true, explanation: "Exactly! 'شَانِئ' is an Active Participle (اسم فاعل) from root ش-ن-أ (Shan'ān). In Arabic linguistics, Shan'ān is not mild dislike; it is intense, festering, spiteful malice. Joined with 'كَ', it refers specifically to the detractor harboring bitter malice against the Prophet ﷺ." },
      { id: "c", text: "Superlative noun (اسم تفضيل) on pattern أَفْعَل meaning 'the least'", correct: false, explanation: "Superlative would be أَشْنَأ, not شَانِئ." },
      { id: "d", text: "Verbal noun (مصدر) meaning 'calmness and reconciliation'", correct: false, explanation: "The root means hatred and spite, the opposite of reconciliation." }
    ],
    why_this_is_a_good_question: "This question reinforces recognition of the Active Participle pattern (اسم فاعل: فَاعِل) while exposing the student to the psychological depth of Qur'anic vocabulary. It shows how morphology communicates active, ongoing human malice."
  },
  "108:3:3": {
    id: "q108_3_3",
    question: "What is the specialized rhetorical and syntactic function of the independent pronoun 'هُوَ' (huwa) situated between 'شَانِئَكَ' and 'ٱلْأَبْتَرُ'?",
    options: [
      { id: "a", text: "It is a Pronoun of Separation (ضَمِير فَصْل) that creates exclusive restriction (حَصْر / قَصْر): 'HE ALONE is the one cut off'", correct: true, explanation: "Brilliant! 'هُوَ' functions as Ḍamīr al-Faṣl (ضمير فصل). Syntactically, it separates the noun from the predicate to prevent it being read as an adjective. Rhetorically, it generates restriction (Ḥaṣr): turning the enemy's insult back on them: 'No, HE and HE ALONE is the one cut off from all good!'" },
      { id: "b", text: "It is a direct object of an elided verb", correct: false, explanation: "Independent personal pronouns (هُوَ) do not serve as direct objects in this construction." },
      { id: "c", text: "It is a preposition connecting the two clauses", correct: false, explanation: "'هُوَ' is a personal pronoun, never a preposition." },
      { id: "d", text: "An accidental pronoun inserted for syllable count with no meaning", correct: false, explanation: "There are no accidental words in the Qur'an; every token carries immense rhetorical and syntactic weight." }
    ],
    why_this_is_a_good_question: "Many students think pronouns only serve as standard subjects. This question introduces 'Ḍamīr al-Faṣl', a sophisticated tool in Arabic syntax and Balāghah that creates dramatic semantic reversal and exclusive restriction (Ḥaṣr)."
  },
  "108:3:4": {
    id: "q108_3_4",
    question: "What is the syntactic role and case ending of 'ٱلْأَبْتَرُ' (al-abtar), and what historical reality did this word prophesy?",
    options: [
      { id: "a", text: "Khabar Inna (خبر إنّ) in the nominative case with ḍammah; it prophesied that the enemies' lineage and memory would be extinguished while the Prophet's ﷺ remembrance would endure forever", correct: true, explanation: "Outstanding! 'ٱلْأَبْتَرُ' is Khabar Inna, taking the nominative case (مرفوع بالضمة). Lexically, 'Abtar' refers to being amputated or cut off without legacy. The verse prophesied that the mockers (like al-ʿĀṣ ibn Wāʾil) would be utterly forgotten or despised, while the Prophet ﷺ would be honored by billions across all generations." },
      { id: "b", text: "An accusative adjective describing a battle weapon", correct: false, explanation: "It has a ḍammah (marfūʿ), not fatḥah, and it describes a person cut off from good." },
      { id: "c", text: "A past tense verb meaning 'he severed'", correct: false, explanation: "It has the definite article 'الـ', which only attaches to nouns, never verbs." },
      { id: "d", text: "A genitive noun dependent on an invisible preposition", correct: false, explanation: "It ends with ḍammah, which is the mark of the nominative (Rafʿ), not genitive." }
    ],
    why_this_is_a_good_question: "This question completes the syntactic loop of Inna (identifying Khabar Inna with its nominative ḍammah) and tests the recognition that nouns starting with 'الـ' cannot be verbs. Furthermore, it highlights the fulfilled historical prophecy contained inside a single Qur'anic word."
  }
};

class QuranGrammarApp {
  constructor() {
    this.data = null;
    const urlParams = new URLSearchParams(window.location.search);
    const surahParam = urlParams.get('surah');
    if (surahParam === 'kawthar' || surahParam === '108') {
      this.currentSurahFile = 'surah-al-kawthar.json';
    } else if (surahParam === 'asr' || surahParam === '103') {
      this.currentSurahFile = 'surah-al-asr.json';
    } else if (surahParam === 'munafiqun' || surahParam === '63') {
      this.currentSurahFile = 'surah-al-munafiqun.json';
    } else if (surahParam === 'taghabun' || surahParam === '64') {
      this.currentSurahFile = 'surah-at-taghabun.json';
    } else if (surahParam === 'nisa' || surahParam === 'an-nisa' || surahParam === '4') {
      this.currentSurahFile = 'surah-an-nisa.json';
    } else if (surahParam === 'baqarah' || surahParam === 'al-baqarah' || surahParam === '2') {
      this.currentSurahFile = 'surah-al-baqarah.json';
    } else if (surahParam === 'imran' || surahParam === 'ali-imran' || surahParam === 'aal-imran' || surahParam === '3') {
      this.currentSurahFile = 'surah-ali-imran.json';
    } else {
      this.currentSurahFile = 'surah-al-qamar.json';
    }
    this.activeColorMode = 'case'; // 'case' | 'pos' | 'syntax' | 'morpheme'
    this.activeThemeFilter = 'all';
    this.activeCaseFilter = 'all';
    this.searchQuery = '';
    this.currentAudio = null;
    this.settings = {
      // Arabic Typography
      fontFamily: 'me_quran',
      ayahFontSize: 2.15,
      wordFontSize: 1.55,
      lineHeight: 2.4,
      arabicScale: 1.0,

      // English Typography
      englishTranslationSize: 0.95,
      englishWordSize: 0.80,
      englishNotesSize: 0.90,
      englishScale: 1.0
    };
    this.loadSettings();
    this.applySettings();

    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadSurah(this.currentSurahFile);
  }

  normalizeData() {
    if (!this.data) return;
    if (!this.data.metadata) {
      this.data.metadata = {
        surah_number: this.data.surah_id || 108,
        surah_name_en: this.data.surah_name_en || 'Al-Kawthar',
        surah_name_ar: this.data.surah_name_ar || this.data.surah_name || 'الكوثر',
        total_verses: this.data.total_verses || (this.data.verses ? this.data.verses.length : 3),
        total_words: this.data.total_words || 10,
        total_morphemes: 24
      };
    }
    if (!this.data.thematic_sections) {
      if (this.data.metadata && this.data.metadata.surah_number === 2) {
        this.data.thematic_sections = [
          { section_id: 1, title_en: "Prologue, Three Human Types & Creation of Adam", ayah_range: "2:1-39", start_ayah: 1, end_ayah: 39 },
          { section_id: 2, title_en: "Covenant with Bani Isra'il & The Golden Calf / Heifer", ayah_range: "2:40-123", start_ayah: 40, end_ayah: 123 },
          { section_id: 3, title_en: "Legacy of Ibrahim, The Ka'bah & The New Ummah", ayah_range: "2:124-162", start_ayah: 124, end_ayah: 162 },
          { section_id: 4, title_en: "Constitutional Ordinances: Food, Fasting & Warfare", ayah_range: "2:163-214", start_ayah: 163, end_ayah: 214 },
          { section_id: 5, title_en: "Social Jurisprudence: Marriage, Divorce & Orphanhood", ayah_range: "2:215-242", start_ayah: 215, end_ayah: 242 },
          { section_id: 6, title_en: "Historical Striving, Talut & Dawud", ayah_range: "2:243-253", start_ayah: 243, end_ayah: 253 },
          { section_id: 7, title_en: "Ayat al-Kursi, Divine Sovereignty & Invalidation of Riba", ayah_range: "2:254-281", start_ayah: 254, end_ayah: 281 },
          { section_id: 8, title_en: "Commercial Contracts (2:282) & The Epilogue of Faith", ayah_range: "2:282-286", start_ayah: 282, end_ayah: 286 }
        ];
      } else if (this.data.metadata && this.data.metadata.surah_number === 3) {
        this.data.thematic_sections = [
          { section_id: 1, title_en: "Muhkam vs. Mutashabih & Divine Unity", ayah_range: "3:1-32", start_ayah: 1, end_ayah: 32 },
          { section_id: 2, title_en: "The Family of Imran: Maryam, Zakariyya & 'Isa", ayah_range: "3:33-63", start_ayah: 33, end_ayah: 63 },
          { section_id: 3, title_en: "Dialogue & Challenge with the People of the Book", ayah_range: "3:64-120", start_ayah: 64, end_ayah: 120 },
          { section_id: 4, title_en: "Lessons of Uhud & Badr: Resilience & Divine Mercy", ayah_range: "3:121-179", start_ayah: 121, end_ayah: 179 },
          { section_id: 5, title_en: "Cosmic Reflection of the Wise (Ulul-Albab) & Epilogue", ayah_range: "3:180-200", start_ayah: 180, end_ayah: 200 }
        ];
      } else if (this.data.metadata && this.data.metadata.surah_number === 4) {
        this.data.thematic_sections = [
          { section_id: 1, title_en: "Family, Orphans & Matrimonial Justice", ayah_range: "4:1-35", start_ayah: 1, end_ayah: 35 },
          { section_id: 2, title_en: "Trusts, Authority & Faithful Obedience", ayah_range: "4:36-87", start_ayah: 36, end_ayah: 87 },
          { section_id: 3, title_en: "Hypocrisy, Defense & Legal Safeguards", ayah_range: "4:88-134", start_ayah: 88, end_ayah: 134 },
          { section_id: 4, title_en: "Theological Truth, People of the Book & Inheritance", ayah_range: "4:135-176", start_ayah: 135, end_ayah: 176 }
        ];
      } else {
        this.data.thematic_sections = [
          { section_id: 1, title_en: "Divine Gift & Gratitude", ayah_range: "108:1-2", start_ayah: 1, end_ayah: 2 },
          { section_id: 2, title_en: "The Enemy Cut Off", ayah_range: "108:3", start_ayah: 3, end_ayah: 3 }
        ];
      }
    }

    if (!this.data.verses && this.data.ayahs) {
      const wordMap = {};
      if (this.data.words) {
        this.data.words.forEach(w => {
          wordMap[w.word_id] = w;
        });
      }
      this.data.verses = this.data.ayahs.map(a => {
        let secId = 1;
        let secTitle = "Divine Guidance";
        if (this.data.thematic_sections) {
          for (const s of this.data.thematic_sections) {
            if (a.ayah_number >= s.start_ayah && a.ayah_number <= s.end_ayah) {
              secId = s.section_id;
              secTitle = s.title_en;
              break;
            }
          }
        }
        return {
          ayah_number: a.ayah_number,
          surah_number: this.data.metadata.surah_number || 4,
          text_uthmani: a.text_uthmani,
          text_imlaei: a.text_normalized,
          translation: typeof a.translation === 'object' ? a.translation.natural : (a.translation || ''),
          thematic_section_id: secId,
          thematic_section_title: secTitle,
          thematic_color: "#7c3aed",
          words_count: a.word_ids ? a.word_ids.length : 0,
          words: a.word_ids ? a.word_ids.map(wid => {
            const rawW = wordMap[wid] || {};
            const isVerb = rawW.token_type === 'verb';
            const isPart = ['preposition', 'conjunction', 'particle', 'interrogative', 'conditional', 'vocative'].includes(rawW.token_type);
            const pClass = isVerb ? 'fi\'l' : (isPart ? 'harf' : 'ism');
            const pClassAr = isVerb ? 'فعل' : (isPart ? 'حرف' : 'اسم');
            const cCase = (rawW.irab && rawW.irab.grammatical_case) || 'indeclinable';
            const cColor = cCase === 'nominative' ? '#2563eb' : (cCase === 'accusative' ? '#059669' : (cCase === 'genitive' ? '#7c3aed' : (cCase === 'jussive' ? '#d97706' : '#64748b')));
            const pColor = isVerb ? '#e11d48' : (isPart ? '#d97706' : '#1d4ed8');
            const pBg = isVerb ? '#ffe4e6' : (isPart ? '#fef3c7' : '#dbeafe');

            return {
              id: wid,
              location: wid,
              surah: 4,
              ayah: a.ayah_number,
              word_position: rawW.word_position || 1,
              arabic_uthmani: rawW.surface_uthmani || '',
              arabic_clean: rawW.surface_plain || '',
              translation: rawW.translation || '',
              classification: {
                primary_type: pClass,
                primary_type_ar: pClassAr
              },
              sarf: {
                root: rawW.root ? rawW.root.root_ar : '—',
                root_ar: rawW.root ? rawW.root.root_normalized : '—',
                root_meaning: rawW.root ? rawW.root.root_meaning : '—',
                root_concept: rawW.root ? rawW.root.root_family : '—',
                lemma: rawW.lemma_ar || '—',
                wazn: (rawW.sarf_verb_analysis && rawW.sarf_verb_analysis.pattern_wazn) || (rawW.noun_morphology && rawW.noun_morphology.lexical_pattern_wazn) || '—',
                verb_form: rawW.sarf_verb_analysis ? `Form ${rawW.sarf_verb_analysis.form_number}` : '—'
              },
              irab_and_case: {
                case_or_mood: cCase,
                case_or_mood_ar: (rawW.irab && rawW.irab.case_ar) || 'مبني',
                case_concept: (rawW.irab && rawW.irab.grammatical_state) || 'fixed',
                ending_vowel: (rawW.irab && rawW.irab.case_ending) || 'fixed',
                grammatical_role: (rawW.irab && rawW.irab.syntactic_role) || 'node',
                grammatical_role_ar: (rawW.syntactic_role && rawW.syntactic_role.role_ar) || 'مبني',
                why_this_ending: (rawW.irab && rawW.irab.grammatical_explanation && rawW.irab.grammatical_explanation.beginner) || '',
                beneficial_meaning: (rawW.irab && rawW.irab.grammatical_explanation && rawW.irab.grammatical_explanation.intermediate) || '',
                simplified_role: rawW.token_type || 'Word'
              },
              lowest_level_breakdown: {
                morphemes_count: rawW.components ? rawW.components.length : 1,
                morphemes: rawW.components ? rawW.components.map(c => ({
                  segment_index: c.component_index,
                  arabic: c.arabic,
                  type: c.type,
                  pos_tag: c.pos_tag,
                  role: c.role,
                  vowel: "base",
                  color_code: "#2563eb",
                  color_name: c.type
                })) : []
              },
              color_coding: {
                pos_color: pColor,
                pos_bg: pBg,
                case_color: cColor,
                case_bg: '#f8fafc',
                vowel_badge: (rawW.irab && rawW.irab.case_ar) || 'مبني',
                pedagogical_badge: rawW.token_type
              }
            };
          }) : []
        };
      });
    }

    let globalWordId = (this.data.metadata.surah_number || 108) * 1000000;
    this.data.verses.forEach(v => {
      if (!v.ayah_number) v.ayah_number = v.number || 1;
      if (!v.thematic_section_id) v.thematic_section_id = v.ayah_number <= 2 ? 1 : 2;
      if (!v.thematic_section_title) v.thematic_section_title = v.ayah_number <= 2 ? "Divine Gift & Gratitude" : "The Enemy Cut Off";
      
      if (!v.words && v.tokens) {
        v.words = v.tokens.map((t, idx) => {
          globalWordId++;
          const posMap = {
            'verb-past': { color: '#0D47A1', bg: '#eff6ff', border: '#bfdbfe', label: "Fi'l Madi (Past Verb)" },
            'verb-present': { color: '#2196F3', bg: '#f0f9ff', border: '#bae6fd', label: "Fi'l Mudari (Present Verb)" },
            'verb-imperative': { color: '#00BCD4', bg: '#ecfeff', border: '#a5f3fc', label: "Fi'l Amr (Imperative)" },
            'noun': { color: '#4CAF50', bg: '#f0fdf4', border: '#bbf7d0', label: "Ism (Noun)" },
            'particle': { color: '#7B1FA2', bg: '#faf5ff', border: '#e9d5ff', label: "Harf (Particle)" },
            'preposition': { color: '#9C27B0', bg: '#fdf4ff', border: '#f5d0fe', label: "Harf Jarr (Preposition)" },
            'negative': { color: '#E53935', bg: '#fef2f2', border: '#fecaca', label: "Harf Nafy (Negative)" },
            'pronoun': { color: '#F57C00', bg: '#fffbeb', border: '#fde68a', label: "Damir (Pronoun)" }
          };
          const posInfo = posMap[t.pos_class] || posMap['noun'];
          const caseName = (t.case_class || 'case-mabni').replace('case-', '');
          const caseColors = {
            'marfoo': { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Marfoo (Nominative)' },
            'mansoob': { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', label: 'Mansoob (Accusative)' },
            'majroor': { color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', label: 'Majroor (Genitive)' },
            'mabni': { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', label: 'Mabni (Fixed)' }
          };
          const caseInfo = caseColors[caseName] || caseColors['mabni'];

          return {
            id: globalWordId,
            position: idx + 1,
            word_position: idx + 1,
            location: t.id || `${v.ayah_number}:${idx+1}`,
            surah: this.data.metadata.surah_number,
            ayah: v.ayah_number,
            token: t.text,
            token_clean: t.text.replace(/[\u0617-\u061A\u064B-\u0652]/g, ''),
            arabic_uthmani: t.text,
            arabic_clean: t.text.replace(/[\u0617-\u061A\u064B-\u0652]/g, ''),
            translation: t.display_text || t.tooltip || t.lemma,
            lemma: t.lemma,
            sarf: {
              root: t.root || '—',
              root_ar: t.root || '—',
              wazn: t.wazn || '—',
              verb_form: t.verb_form ? `Form ${t.verb_form}` : '—',
              part_of_speech: t.pos_label || posInfo.label
            },
            nahw: {
              grammatical_role: t.syntax_class || 'Linguistic Node',
              case_or_mood: caseInfo.label,
              irab: t.irab || ''
            },
            irab_and_case: {
              case_or_mood: caseName,
              why_this_ending: t.irab || t.tooltip,
              ending_vowel: caseInfo.label
            },
            color_coding: {
              pos_color: posInfo.color,
              pos_bg: posInfo.bg,
              pos_border: posInfo.border,
              case_color: caseInfo.color,
              case_bg: caseInfo.bg,
              case_border: caseInfo.border,
              syntax_color: '#3b82f6',
              syntax_bg: '#eff6ff',
              syntax_border: '#bfdbfe'
            },
            pedagogy_notes: (t.ai_explanations && t.ai_explanations.beginner) || t.irab,
            ai_explanations: t.ai_explanations,
            morphemes: [
              {
                text: t.text,
                transliteration: t.lemma,
                type: t.pos_label || posInfo.label,
                meaning: t.display_text || t.tooltip || ''
              }
            ]
          };
        });
      }
    });
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
      this.normalizeData();
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
    if (brandIcon) {
      if (meta.surah_number === 108) brandIcon.textContent = '⚡';
      else if (meta.surah_number === 103) brandIcon.textContent = '⏳';
      else if (meta.surah_number === 63) brandIcon.textContent = '🛡️';
      else if (meta.surah_number === 64) brandIcon.textContent = '⚖️';
      else if (meta.surah_number === 4) brandIcon.textContent = '📜';
      else if (meta.surah_number === 2) brandIcon.textContent = '📖';
      else if (meta.surah_number === 3) brandIcon.textContent = '🏛️';
      else brandIcon.textContent = '🌙';
    }
    if (brandSubtitle) {
      if (meta.surah_number === 108) {
        brandSubtitle.textContent = 'Master Multi-Layer Dataset: AI Tutor Levels, Visual Syntax Trees, and Abundance Intelligence';
      } else if (meta.surah_number === 103) {
        brandSubtitle.textContent = 'Master Multi-Layer Dataset: AI Tutor Levels, Visual Syntax Trees, and Root Intelligence';
      } else if (meta.surah_number === 63) {
        brandSubtitle.textContent = 'Word-by-word lowest-level morpheme breakdown, Sarf morphology, and I\'rab color coding for Surah Al-Munafiqun (63:1-11)';
      } else if (meta.surah_number === 64) {
        brandSubtitle.textContent = 'Word-by-word lowest-level morpheme breakdown, Sarf morphology, and I\'rab color coding for Surah At-Taghabun (64:1-18)';
      } else if (meta.surah_number === 4) {
        brandSubtitle.textContent = 'Machine-Readable Linguistic Database: 176 Ayahs, 3,747 Words, Verbal Ṣarf (Forms I–X), Noun Morphology, Iʿrāb (3 Levels), Roots & Word Relationships';
      } else if (meta.surah_number === 2) {
        brandSubtitle.textContent = 'Exhaustive Machine-Readable Linguistic Database: 286 Ayahs, 6,116 Words, Verbal Ṣarf (Forms I–X), Noun Morphology, Iʿrāb (3 Levels), Roots & Word Relationships';
      } else if (meta.surah_number === 3) {
        brandSubtitle.textContent = 'Exhaustive Machine-Readable Linguistic Database: 200 Ayahs, 3,481 Words, Verbal Ṣarf (Forms I–X), Noun Morphology, Iʿrāb (3 Levels), Roots & Word Relationships';
      } else {
        brandSubtitle.textContent = 'Word-by-word lowest-level morpheme breakdown, Sarf morphology, and I\'rab color coding';
      }
    }

    // Stats
    const statAyahs = document.getElementById('stat-ayahs');
    const statWords = document.getElementById('stat-words');
    const statMorphemes = document.getElementById('stat-morphemes');
    const statRoots = document.getElementById('stat-roots');
    const refrainsDivider = document.getElementById('stat-refrains-divider');
    const refrainsItem = document.getElementById('stat-refrains-item');

    if (statAyahs) statAyahs.textContent = meta.total_verses || meta.total_ayahs || (this.data.ayahs ? this.data.ayahs.length : 0);
    if (statWords) statWords.textContent = meta.total_words;
    if (statMorphemes) statMorphemes.textContent = meta.total_morphemes || 32;
    if (statRoots) {
      const rootCount = this.data.root_network ? Object.keys(this.data.root_network).length : (this.data.root_index ? (Array.isArray(this.data.root_index) ? this.data.root_index.length : Object.keys(this.data.root_index).length) : 9);
      statRoots.textContent = rootCount;
    }

    const footerVer = document.getElementById('footer-version-tag');
    if (footerVer) {
      footerVer.textContent = 'v1.1.4 (updated 2026-10-07 01:00)';
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
      const saved = localStorage.getItem('quran_reader_settings_v2');
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
      localStorage.setItem('quran_reader_settings_v2', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage', e);
    }
  }

  applySettings() {
    const root = document.documentElement;
    const font = this.settings.fontFamily || 'me_quran';
    const arScale = this.settings.arabicScale || 1.0;
    const enScale = this.settings.englishScale || 1.0;

    const ayahSize = (this.settings.ayahFontSize * arScale).toFixed(2);
    const wordSize = (this.settings.wordFontSize * arScale).toFixed(2);
    const lineH = this.settings.lineHeight.toFixed(1);

    const enTrans = (this.settings.englishTranslationSize * enScale).toFixed(2);
    const enWord = (this.settings.englishWordSize * enScale).toFixed(2);
    const enNotes = (this.settings.englishNotesSize * enScale).toFixed(2);

    // Apply CSS variables
    root.style.setProperty('--quran-font-family', `'${font}', 'UthmanicHafs', 'UthmanTN', 'Amiri Quran', serif`);
    root.style.setProperty('--ayah-font-size', `${ayahSize}rem`);
    root.style.setProperty('--word-font-size', `${wordSize}rem`);
    root.style.setProperty('--ayah-line-height', lineH);
    root.style.setProperty('--arabic-scale', arScale);

    root.style.setProperty('--english-translation-size', `${enTrans}rem`);
    root.style.setProperty('--english-word-size', `${enWord}rem`);
    root.style.setProperty('--english-notes-size', `${enNotes}rem`);
    root.style.setProperty('--english-scale', enScale);

    // Update Quick Steppers Displays
    const arDisplay = document.getElementById('quick-ar-display');
    if (arDisplay) arDisplay.textContent = `${Math.round(arScale * 100)}%`;

    const enDisplay = document.getElementById('quick-en-display');
    if (enDisplay) enDisplay.textContent = `${Math.round(enScale * 100)}%`;

    // Update Arabic Sliders & Badges
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

    // Update English Sliders & Badges
    const enTransVal = document.getElementById('en-translation-size-val');
    if (enTransVal) enTransVal.textContent = `${enTrans}rem`;

    const enWordVal = document.getElementById('en-word-size-val');
    if (enWordVal) enWordVal.textContent = `${enWord}rem`;

    const enNotesVal = document.getElementById('en-notes-size-val');
    if (enNotesVal) enNotesVal.textContent = `${enNotes}rem`;

    const sliderEnTrans = document.getElementById('slider-en-trans');
    if (sliderEnTrans) sliderEnTrans.value = this.settings.englishTranslationSize;

    const sliderEnWord = document.getElementById('slider-en-word');
    if (sliderEnWord) sliderEnWord.value = this.settings.englishWordSize;

    const sliderEnNotes = document.getElementById('slider-en-notes');
    if (sliderEnNotes) sliderEnNotes.value = this.settings.englishNotesSize;

    // Update Font Badge
    const fontBadge = document.getElementById('current-font-name');
    const fontNames = {
      'me_quran': 'Madina Othmani (Tanzil)',
      'UthmanicHafs': 'Madina Mushaf (KFGQPC)',
      'UthmanTN': 'Uthman Taha Naskh',
      'Amiri Quran': 'Amiri Quran'
    };
    if (fontBadge) fontBadge.textContent = fontNames[font] || font;

    // Update Font Cards Active state
    document.querySelectorAll('.font-card').forEach(card => {
      card.classList.toggle('active', card.dataset.font === font);
    });

    // Update Live Dual Preview in Modal
    const previewAr = document.getElementById('settings-preview-ar');
    if (previewAr) {
      previewAr.style.fontFamily = `'${font}', serif`;
      previewAr.style.fontSize = `${ayahSize}rem`;
      previewAr.style.lineHeight = lineH;
    }

    const previewTranslit = document.getElementById('settings-preview-translit');
    if (previewTranslit) {
      previewTranslit.style.fontSize = `${enWord}rem`;
    }

    const previewEn = document.getElementById('settings-preview-en');
    if (previewEn) {
      previewEn.style.fontSize = `${enTrans}rem`;
    }
  }

  setupSettingsListeners() {
    // Open/Close Modal
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

    // Tab Switching (Arabic vs English)
    const tabBtnAr = document.getElementById('tab-btn-ar');
    const tabBtnEn = document.getElementById('tab-btn-en');
    const panelAr = document.getElementById('settings-panel-ar');
    const panelEn = document.getElementById('settings-panel-en');

    if (tabBtnAr && tabBtnEn && panelAr && panelEn) {
      tabBtnAr.addEventListener('click', () => {
        tabBtnAr.classList.add('active');
        tabBtnEn.classList.remove('active');
        panelAr.style.display = 'block';
        panelEn.style.display = 'none';
      });

      tabBtnEn.addEventListener('click', () => {
        tabBtnEn.classList.add('active');
        tabBtnAr.classList.remove('active');
        panelEn.style.display = 'block';
        panelAr.style.display = 'none';
      });
    }

    // Font Face Selection
    document.querySelectorAll('.font-card').forEach(card => {
      card.addEventListener('click', () => {
        this.settings.fontFamily = card.dataset.font;
        this.saveSettings();
        this.applySettings();
      });
    });

    // 1. Quick Stepper — Arabic (عربي)
    const quickDecAr = document.getElementById('quick-dec-ar');
    const quickIncAr = document.getElementById('quick-inc-ar');
    if (quickDecAr) {
      quickDecAr.addEventListener('click', () => {
        if (this.settings.arabicScale > 0.7) {
          this.settings.arabicScale = Math.max(0.7, parseFloat((this.settings.arabicScale - 0.1).toFixed(2)));
          this.saveSettings();
          this.applySettings();
        }
      });
    }
    if (quickIncAr) {
      quickIncAr.addEventListener('click', () => {
        if (this.settings.arabicScale < 1.8) {
          this.settings.arabicScale = Math.min(1.8, parseFloat((this.settings.arabicScale + 0.1).toFixed(2)));
          this.saveSettings();
          this.applySettings();
        }
      });
    }

    // 2. Quick Stepper — English (EN)
    const quickDecEn = document.getElementById('quick-dec-en');
    const quickIncEn = document.getElementById('quick-inc-en');
    if (quickDecEn) {
      quickDecEn.addEventListener('click', () => {
        if (this.settings.englishScale > 0.7) {
          this.settings.englishScale = Math.max(0.7, parseFloat((this.settings.englishScale - 0.1).toFixed(2)));
          this.saveSettings();
          this.applySettings();
        }
      });
    }
    if (quickIncEn) {
      quickIncEn.addEventListener('click', () => {
        if (this.settings.englishScale < 1.8) {
          this.settings.englishScale = Math.min(1.8, parseFloat((this.settings.englishScale + 0.1).toFixed(2)));
          this.saveSettings();
          this.applySettings();
        }
      });
    }

    // Arabic Sliders
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

    // Arabic Steppers (- / +)
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

    // English Sliders
    const sliderEnTrans = document.getElementById('slider-en-trans');
    if (sliderEnTrans) {
      sliderEnTrans.addEventListener('input', (e) => {
        this.settings.englishTranslationSize = parseFloat(e.target.value);
        this.saveSettings();
        this.applySettings();
      });
    }

    const sliderEnWord = document.getElementById('slider-en-word');
    if (sliderEnWord) {
      sliderEnWord.addEventListener('input', (e) => {
        this.settings.englishWordSize = parseFloat(e.target.value);
        this.saveSettings();
        this.applySettings();
      });
    }

    const sliderEnNotes = document.getElementById('slider-en-notes');
    if (sliderEnNotes) {
      sliderEnNotes.addEventListener('input', (e) => {
        this.settings.englishNotesSize = parseFloat(e.target.value);
        this.saveSettings();
        this.applySettings();
      });
    }

    // English Steppers (- / +)
    const btnDecEnTrans = document.getElementById('btn-dec-en-trans');
    const btnIncEnTrans = document.getElementById('btn-inc-en-trans');
    if (btnDecEnTrans && sliderEnTrans) {
      btnDecEnTrans.addEventListener('click', () => {
        this.settings.englishTranslationSize = Math.max(0.75, parseFloat((this.settings.englishTranslationSize - 0.05).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }
    if (btnIncEnTrans && sliderEnTrans) {
      btnIncEnTrans.addEventListener('click', () => {
        this.settings.englishTranslationSize = Math.min(1.6, parseFloat((this.settings.englishTranslationSize + 0.05).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }

    const btnDecEnWord = document.getElementById('btn-dec-en-word');
    const btnIncEnWord = document.getElementById('btn-inc-en-word');
    if (btnDecEnWord && sliderEnWord) {
      btnDecEnWord.addEventListener('click', () => {
        this.settings.englishWordSize = Math.max(0.65, parseFloat((this.settings.englishWordSize - 0.05).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }
    if (btnIncEnWord && sliderEnWord) {
      btnIncEnWord.addEventListener('click', () => {
        this.settings.englishWordSize = Math.min(1.3, parseFloat((this.settings.englishWordSize + 0.05).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }

    const btnDecEnNotes = document.getElementById('btn-dec-en-notes');
    const btnIncEnNotes = document.getElementById('btn-inc-en-notes');
    if (btnDecEnNotes && sliderEnNotes) {
      btnDecEnNotes.addEventListener('click', () => {
        this.settings.englishNotesSize = Math.max(0.75, parseFloat((this.settings.englishNotesSize - 0.05).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }
    if (btnIncEnNotes && sliderEnNotes) {
      btnIncEnNotes.addEventListener('click', () => {
        this.settings.englishNotesSize = Math.min(1.4, parseFloat((this.settings.englishNotesSize + 0.05).toFixed(2)));
        this.saveSettings();
        this.applySettings();
      });
    }

    // Presets (Arabic and English)
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type; // 'ar' or 'en'
        const preset = btn.dataset.preset;

        document.querySelectorAll(`.preset-btn[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (type === 'ar') {
          if (preset === 'compact') {
            this.settings.arabicScale = 0.8;
            this.settings.ayahFontSize = 1.85;
            this.settings.wordFontSize = 1.35;
          } else if (preset === 'normal') {
            this.settings.arabicScale = 1.0;
            this.settings.ayahFontSize = 2.15;
            this.settings.wordFontSize = 1.55;
          } else if (preset === 'large') {
            this.settings.arabicScale = 1.2;
            this.settings.ayahFontSize = 2.45;
            this.settings.wordFontSize = 1.75;
          } else if (preset === 'xlarge') {
            this.settings.arabicScale = 1.4;
            this.settings.ayahFontSize = 2.75;
            this.settings.wordFontSize = 1.95;
          }
        } else if (type === 'en') {
          if (preset === 'compact') {
            this.settings.englishScale = 0.8;
            this.settings.englishTranslationSize = 0.85;
            this.settings.englishWordSize = 0.70;
            this.settings.englishNotesSize = 0.80;
          } else if (preset === 'normal') {
            this.settings.englishScale = 1.0;
            this.settings.englishTranslationSize = 0.95;
            this.settings.englishWordSize = 0.80;
            this.settings.englishNotesSize = 0.90;
          } else if (preset === 'large') {
            this.settings.englishScale = 1.2;
            this.settings.englishTranslationSize = 1.15;
            this.settings.englishWordSize = 0.95;
            this.settings.englishNotesSize = 1.05;
          } else if (preset === 'xlarge') {
            this.settings.englishScale = 1.4;
            this.settings.englishTranslationSize = 1.35;
            this.settings.englishWordSize = 1.10;
            this.settings.englishNotesSize = 1.20;
          }
        }

        this.saveSettings();
        this.applySettings();
      });
    });

    // Reset All Defaults
    const resetBtn = document.getElementById('reset-settings-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.settings = {
          fontFamily: 'me_quran',
          ayahFontSize: 2.15,
          wordFontSize: 1.55,
          lineHeight: 2.4,
          arabicScale: 1.0,
          englishTranslationSize: 0.95,
          englishWordSize: 0.80,
          englishNotesSize: 0.90,
          englishScale: 1.0
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

    // Word-by-Word Pedagogical Quiz
    const wordQuiz = w.quiz || (window.GLOBAL_WORD_QUIZZES && window.GLOBAL_WORD_QUIZZES[w.location]);
    let quizHtml = '';
    if (wordQuiz) {
      quizHtml = `
        <div class="word-quiz-box" style="margin-top:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.2rem;">🎯</span>
              <strong style="font-size:1rem; color:#0f172a;">Word Mastery Challenge</strong>
              <span class="badge" style="background:#dbeafe; color:#1e40af; font-size:0.75rem; padding:2px 8px; border-radius:9999px;">${w.location}</span>
            </div>
            <span style="font-size:0.78rem; color:#64748b; font-weight:600;">High-Yield Pedagogical Quiz</span>
          </div>

          <div style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:14px; line-height:1.5;">
            ${wordQuiz.question}
          </div>

          <div class="quiz-options-list" style="display:grid; grid-template-columns:1fr; gap:8px;">
            ${wordQuiz.options.map(opt => `
              <button class="quiz-opt-btn" data-qid="${wordQuiz.id}" data-optid="${opt.id}" data-correct="${opt.correct}" data-exp="${encodeURIComponent(opt.explanation)}" style="padding:10px 14px; border-radius:8px; border:1px solid #cbd5e1; background:#ffffff; text-align:left; font-size:0.86rem; color:#334155; cursor:pointer; transition:all 0.15s ease; display:flex; gap:8px;">
                <span style="font-weight:700; color:#64748b;">${opt.id.toUpperCase()}.</span>
                <span>${opt.text}</span>
              </button>
            `).join('')}
          </div>

          <div class="quiz-feedback-box" style="display:none; margin-top:12px; flex-direction:column; gap:10px;">
            <div class="quiz-answer-alert" style="padding:10px 14px; border-radius:8px; font-size:0.84rem; line-height:1.5;"></div>
            <div class="quiz-rationale-alert" style="padding:10px 14px; border-radius:8px; background:#eff6ff; border:1px solid #bfdbfe; color:#1e40af; font-size:0.84rem; line-height:1.5;">
              <strong style="display:flex; align-items:center; gap:4px; margin-bottom:4px; color:#1d4ed8;">
                <span>💡</span> Why this is a good question (Pedagogical Rationale):
              </strong>
              ${wordQuiz.why_this_is_a_good_question}
            </div>
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

      ${quizHtml}
    `;

    // Hook up quiz option clicks
    if (wordQuiz) {
      const optButtons = modalBody.querySelectorAll('.quiz-opt-btn');
      const feedbackBox = modalBody.querySelector('.quiz-feedback-box');
      const alertBox = modalBody.querySelector('.quiz-answer-alert');

      optButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.dataset.correct === 'true';
          const exp = decodeURIComponent(btn.dataset.exp);

          optButtons.forEach(b => {
            b.disabled = true;
            b.style.cursor = 'default';
            if (b.dataset.correct === 'true') {
              b.style.background = '#ecfdf5';
              b.style.borderColor = '#10b981';
              b.style.color = '#065f46';
              b.style.fontWeight = '700';
            }
          });

          if (!isCorrect) {
            btn.style.background = '#fef2f2';
            btn.style.borderColor = '#ef4444';
            btn.style.color = '#991b1b';
            btn.style.fontWeight = '700';
          }

          if (alertBox) {
            alertBox.style.background = isCorrect ? '#f0fdf4' : '#fff1f2';
            alertBox.style.border = isCorrect ? '1px solid #bbf7d0' : '1px solid #fecdd3';
            alertBox.style.color = isCorrect ? '#166534' : '#9f1239';
            alertBox.innerHTML = `<strong>${isCorrect ? '✓ Correct!' : '✕ Note:'}</strong> ${exp}`;
          }

          if (feedbackBox) {
            feedbackBox.style.display = 'flex';
          }
        });
      });
    }

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
