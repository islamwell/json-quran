
    const { useState } = React;

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
              beneficial_meaning: "Indeed, We — A divine guarantee of absolute certainty from Allah. Using the Royal 'We' (Plural of Majesty) highlights Allah's supreme power, grandeur, and closeness to the Prophet ﷺ before revealing the magnificent gift.",
              simplified_role: "Divine Guarantee of Certainty",
              word_id: "108:1:w1",
              word_order: "1",
              word_part: "single",
              display_text: "إِنَّآ",
              irab_easy_english: "Inna means 'Indeed, We'. It is an emphatic particle that gives 100% certainty. The attached 'Na' is the Royal 'We' (Plural of Majesty) referring to Allah as the sovereign Bestower.",
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
              same_pattern_words: [],
              nouman_ali_khan_analysis: {
              "gem_title": "The Royal Plural & Breaking Through Doubt (إِنَّ + نَا)",
              "summary": "Why does Allah begin with 'Inna' and use the Royal 'We' instead of 'I'?",
              "deep_dive": "Ustadh Nouman Ali Khan explains that Surah Al-Kawthar was revealed at a moment of profound personal heartbreak: the Prophet ﷺ had just buried his infant sons (Al-Qasim and Abdullah). The Qurayshi elite (led by Al-ʿĀṣ ibn Wāʾil) were publicly celebrating, sneering that Muhammad ﷺ was 'abtar' (a man whose lineage is severed and who will be forgotten). At this agonizing moment, Allah does not begin with an argument or debate. He begins with 'إِنَّ' (Inna) — a particle of 100% categorical certainty, annihilating all enemy gossip. Furthermore, Allah uses the Royal Plural 'نَا' (We) rather than 'أَعْطَيْتُكَ' (I gave you). In Arabic Balāghah, the stature of a gift is judged by the stature of the Giver: when the King of kings announces a bestowal with the Royal Plural of Majesty (نون العظمة), it signals that what is being bestowed is astronomical beyond human imagination.",
              "sub_morphemes": [
                            {
                                          "morpheme": "إِنَّ",
                                          "type": "حرف توكيد ونصب",
                                          "meaning": "Indeed / Verily — Particle of absolute conviction and sentence inception"
                            },
                            {
                                          "morpheme": "نَا",
                                          "type": "ضمير متصل (نون العظمة)",
                                          "meaning": "We (Royal Plural of Majesty) — Highlighting divine omnipotence and supreme dignity"
                            }
              ],
              "balaghah_secret": "Divine consolation begins by elevating the Giver so the recipient realizes how unimaginably massive the upcoming gift truly is."
}
            },
            {
              id: "108:1:2",
              beneficial_meaning: "We have granted you — Allah is the Bestower, and Prophet Muhammad ﷺ is the honored recipient. It is stated in the past tense ('We gave') to announce that this boundless divine favor is already decreed, sealed, and permanent forever.",
              simplified_role: "Action: Divine Bestowal",
              word_id: "108:1:w2",
              word_order: "2",
              word_part: "single",
              display_text: "أَعْطَيْنَـٰكَ",
              irab_easy_english: "Past tense verb meaning 'We have granted you'. 'Na' is the doer ('We' - Allah), and 'Ka' is the recipient ('you' - Prophet Muhammad ﷺ). The past tense guarantees this gift is already decreed and eternal.",
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
              ],
              nouman_ali_khan_analysis: {
              "gem_title": "The Master Contrast: 'أَعْطَى' (A'ṭā) vs 'آتَى' (Ātā)",
              "summary": "Why did Allah choose 'A'tayna' instead of the commonly used 'Aatayna'?",
              "deep_dive": "This is one of Ustadh Nouman Ali Khan's most celebrated linguistic gems. Throughout the Qur'an, Allah uses two verbs for giving: 'إِيتَاء' (Ītāʾ from آتَى) and 'إِعْطَاء' (Iʿṭāʾ from أَعْطَى). 'آتَى' is used when something is given conditionally, temporarily, or as a trust that can be revoked (e.g., 'تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ' — power is given, then stripped away; 'آتَيْنَاهُمُ الْكِتَابَ' — scripture given to trustees). In contrast, 'أَعْطَى' in classical Arabic is used exclusively for an absolute, unconditional, eternal gift that is permanently owned by the recipient and will NEVER be revoked or taken away! By saying 'أَعْطَيْنَاكَ', Allah comforts the Prophet ﷺ: 'The sons you lost belonged to Me, but the Kawthar I have granted you is yours forever — no enemy, no death, and no tragedy can ever diminish it.' Additionally, Allah uses the past tense ('أَعْطَيْنَا' - We gave) for future rewards (the river, the Hawd, the intercession) to indicate 'Taḥaqquq al-Wuqūʿ' — treated as already accomplished fact in divine reality.",
              "sub_morphemes": [
                            {
                                          "morpheme": "أَعْطَى",
                                          "type": "فعل ماضٍ (مزيد بحرف - وزن أَفْعَلَ)",
                                          "meaning": "Form IV doubly-transitive verb: to grant unconditionally and permanently"
                            },
                            {
                                          "morpheme": "نَا",
                                          "type": "ضمير متصل فاعل",
                                          "meaning": "We (the Divine Doer / Bestower)"
                            },
                            {
                                          "morpheme": "كَ",
                                          "type": "ضمير متصل مفعول به أول",
                                          "meaning": "You, [O Muhammad ﷺ] — Direct personal recipient, positioned adjacent for divine intimacy"
                            }
              ],
              "balaghah_secret": "The word 'A'ṭā' conveys permanent ownership, ensuring that the divine gift can never be touched by the vicissitudes of time or enemy malice."
}
            },
            {
              id: "108:1:3",
              beneficial_meaning: "The Ultimate Abundance (Al-Kawthar) — Endless divine goodness in this world and the next, including the glorious river and pearlescent fountain in Paradise reserved for the Prophet ﷺ and his followers.",
              simplified_role: "The Boundless Gift Received",
              word_id: "108:1:w3",
              word_order: "3",
              word_part: "single",
              display_text: "ٱلْكَوْثَرَ",
              irab_easy_english: "Direct object meaning 'The Abundance' (overflowing goodness and the special river in Paradise). It ends in a fatha ('al-Kawthara') because it receives the action of divine giving.",
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
              ],
              nouman_ali_khan_analysis: {
              "gem_title": "Why 'Al-Kawthar' over 'Katheer' or 'Akthar'? (فَوْعَل vs فَعِيل)",
              "summary": "The morphological distinction between ordinary abundance and ever-multiplying celestial abundance.",
              "deep_dive": "Nouman Ali Khan highlights the progression of Arabic abundance words: 'كَثِير' (Katheer) means much or plentiful. 'أَكْثَر' (Akthar) is comparative/superlative ('more' or 'most'). But Allah chose neither! He chose 'الْكَوْثَرَ' (Al-Kawthar), on the exceedingly rare hyperbolic pattern 'فَوْعَل' (Fawʿal). In Arabic morphology, the weight Fawʿal denotes an abundance that is dynamic and ceaseless — it continuously multiplies, overflows, and expands without ceiling! The definite article 'الـ' (Al-) signifies ultimate specificity: not just generic abundance, but THE Abundance — the heavenly river whose banks are made of gold and hollow pearls, the Hawḍ basin on the Day of Judgment, the Holy Qur'an, supreme wisdom, the highest station of intercession (Al-Maqām al-Maḥmūd), and billions of believers blessing his name across every corner of the earth.",
              "sub_morphemes": [
                            {
                                          "morpheme": "ٱلْـ",
                                          "type": "لام التعريف",
                                          "meaning": "The definite article — denoting supreme exclusivity and preeminence"
                            },
                            {
                                          "morpheme": "كَوْثَرَ",
                                          "type": "مفعول به ثانٍ (وزن فَوْعَل)",
                                          "meaning": "Ever-multiplying, inexhaustible abundance from root ك-ث-ر"
                            }
              ],
              "balaghah_secret": "The enemies claimed the Prophet ﷺ was left with nothing; Allah declared He gave him the abundance from which all other abundances pale in comparison."
}
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
              beneficial_meaning: "So / Therefore — Connects divine favor directly to grateful action: 'Because Allah has blessed you with limitless abundance in Verse 1, the natural, grateful response is to turn to your Lord in prayer!'",
              simplified_role: "Consequence Link (Gift → Gratitude)",
              word_id: "108:2:w1",
              word_order: "1 (Part 1)",
              word_part: "prefix",
              display_text: "فَ‍",
              irab_easy_english: "The letter Fa (فَـ) means 'So / Therefore'. It connects as a direct consequence of the great gift in Verse 1: 'Since We gave you abundant goodness (Al-Kawthar), therefore pray to your Lord!'. It always carries a fixed 'a' vowel sound (mabni 'ala al-fat-ha).",
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
              same_pattern_words: [],
              nouman_ali_khan_analysis: {
              "gem_title": "The Logical Connector of Loving Gratitude (فَـ)",
              "summary": "How 'Fā' al-Sababiyyah' transforms our understanding of Islamic worship.",
              "deep_dive": "Ustadh Nouman emphasizes that the single prefix 'فَـ' (Fa-) is the logical backbone of the entire Surah. It is 'Fā' al-Sababiyyah' (causal) and 'Fā' al-Faṣīḥah' (revealing an implied premise). It bridges Ayah 1 (divine gift) directly into Ayah 2 (human worship). This teaches a revolutionary concept in Islamic theology: worship is NOT framed as an oppressive penalty or paying off a divine debt. Rather, worship is the natural, loving, spontaneous reflex of a grateful heart overflowing with gratitude (شُكْر) for boundless blessings (نِعْمَة). 'Because We have showered you with such infinite abundance, therefore dedicate your entire being in prayer and sacrifice!'",
              "sub_morphemes": [
                            {
                                          "morpheme": "فَـ",
                                          "type": "الفاء السببية / الفصيحة",
                                          "meaning": "So / Therefore — Causal connector linking divine grace to grateful worship"
                            }
              ],
              "balaghah_secret": "Particles in Arabic are logical hinges: the 'Fā' teaches us to worship Allah out of gratitude, not out of burden."
}
            },
            {
              id: "108:2:2",
              beneficial_meaning: "Pray! — A direct loving command to establish prayer with sincere heart and steadfast devotion as the purest expression of thankfulness to Allah.",
              simplified_role: "Action: Command to Worship",
              word_id: "108:2:w1",
              word_order: "1 (Part 2)",
              word_part: "stem",
              display_text: "‍صَلِّ",
              irab_easy_english: "Command verb meaning 'Pray!'. It is built on dropping the final weak vowel letter (Yaa). The hidden doer of the action is 'you' [O Muhammad].",
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
              ],
              nouman_ali_khan_analysis: {
              "gem_title": "Bodily Devotion & The Form II Command (صَلِّ)",
              "summary": "The grammatical omission of the weak letter and the intensification of prayer.",
              "deep_dive": "Nouman Ali Khan highlights the pairing of worship types in Ayah 2: 'صَلِّ' represents bodily worship (عبادة بدنية). Morphologically, it is a Form II imperative verb (صَلَّى / يُصَلِّي / صَلِّ). Form II (فَعَّلَ) denotes intensification, dedication, and regularity: don't just perform occasional prayers, establish prayer as an unwavering pillar of your life. Grammatically, because root ص-ل-و is defective (ends in a weak letter), the imperative is formed by deleting the final weak letter (حذف حرف العلة), leaving the kasrah on the lām: 'صَلِّ' (addressing a prevalent spelling error where people mistakenly add a yā' 'صلي').",
              "sub_morphemes": [
                            {
                                          "morpheme": "صَلِّ",
                                          "type": "فعل أمر (مزيد مضعف العين - وزن فَعِّلْ)",
                                          "meaning": "Pray / Establish prayer steadfastly — Built on deleting the weak vowel letter"
                            },
                            {
                                          "morpheme": "(أَنْتَ)",
                                          "type": "ضمير مستتر وجوباً",
                                          "meaning": "You [O Prophet] — Implied doer"
                            }
              ],
              "balaghah_secret": "The Form II imperative demands consistent, elevated prayer as the primary anchor against grief and slander."
}
            },
            {
              id: "108:2:3",
              beneficial_meaning: "For your Lord alone — Direct every prayer and act of worship exclusively to your Creator and Cherisher, rejecting all false idols and seeking no human praise.",
              simplified_role: "Dedication: Exclusively to Allah",
              word_id: "108:2:w2",
              word_order: "2",
              word_part: "single",
              display_text: "لِرَبِّكَ",
              irab_easy_english: "Means 'To/For your Lord [alone]'. The letter 'Li' means 'exclusively for', 'Rabb' is your Lord (taking kasra), and 'Ka' means 'your'.",
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
              same_pattern_words: [],
              nouman_ali_khan_analysis: {
              "gem_title": "The Nurturing Master & Exclusive Devotion (لِرَبِّكَ)",
              "summary": "Why did Allah say 'Pray to your Rabb' rather than 'Pray to Allah'?",
              "deep_dive": "One of the most touching insights from Ustadh Nouman Ali Khan: why didn't Allah say 'فَصَلِّ لِلَّهِ' (Pray to Allah)? He chose 'لِرَبِّكَ' (to YOUR Lord). The word 'رَبّ' (Rabb) comes from the same root as 'تَرْبِيَة' (Tarbiyah) — the one who lovingly nurtures, feeds, fosters, protects, and raises someone step-by-step to their highest potential. When the Prophet ﷺ was in grief over losing his infant child, Allah did not invoke the awe-inspiring, majestic name 'Allah', but the intimate, comforting attribute 'Rabb'. And He added 'كَ' ('YOUR Rabb'): 'He is YOUR loving Sustainer; He hasn't abandoned you to the enemies.' The preposition 'لِـ' (Lām al-Ikhtiṣāṣ) establishes pure monotheism (إخلاص): the pagans prayed to idols and sacrificed for self-glory; your worship must be pure and exclusive to your Nurturing Master.",
              "sub_morphemes": [
                            {
                                          "morpheme": "لِـ",
                                          "type": "حرف جر للاختصاص والإخلاص",
                                          "meaning": "For / To ... alone — Denoting exclusive dedication and pure monotheism"
                            },
                            {
                                          "morpheme": "رَبِّ",
                                          "type": "اسم مجرور ومضاف",
                                          "meaning": "Lord / Sustainer — The caring Nurturer who provides loving Tarbiyah"
                            },
                            {
                                          "morpheme": "كَ",
                                          "type": "ضمير متصل مضاف إليه",
                                          "meaning": "Your — 2nd person singular pronoun creating intimate personal solace"
                            }
              ],
              "balaghah_secret": "The word 'Rabbika' acts as a warm divine embrace for a grieving father, reminding him of his Master's personal care."
}
            },
            {
              id: "108:2:4",
              beneficial_meaning: "And sacrifice! — Offer charity and feed the hungry in Allah's name alone, uniting bodily devotion (prayer) with selfless charity and sacrifice.",
              simplified_role: "Action: Command to Give & Feed",
              word_id: "108:2:w3",
              word_order: "3",
              word_part: "single",
              display_text: "وَٱنْحَرْ",
              irab_easy_english: "Conjunction 'Wa' (and) + command verb 'Inhar' (sacrifice / offer charity). Built on sukun.",
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
              ],
              nouman_ali_khan_analysis: {
              "gem_title": "Financial Sacrifice & The Camel Ritual (وَٱنْحَرْ)",
              "summary": "Why 'Nahr' instead of 'Dhabh', and the pairing of body and wealth.",
              "deep_dive": "Ayah 2 pairs bodily devotion ('صَلِّ' - prayer) with the pinnacle of financial charity ('وَٱنْحَرْ' - sacrifice). Nouman Ali Khan draws attention to the lexical choice: Arabic has words for animal slaughter, the most common being 'ذَبَحَ' (Dhabaha - used for sheep and goats). But Allah used 'نَحَرَ' (Nahara)! In classical Arabic, 'Naḥr' specifically refers to the sacrifice of **camels** by piercing the hollow at the base of the throat while standing. Camels were the prized crown jewels of Arabian wealth — the equivalent of luxury estates. By commanding 'Naḥr', Allah tells the Prophet ﷺ and believers: offer your most valuable wealth for the sake of Allah and feed the hungry, orphan, and impoverished en masse. True gratitude is proven through radical generosity.",
              "sub_morphemes": [
                            {
                                          "morpheme": "وَ",
                                          "type": "حرف عطف",
                                          "meaning": "And — Coupling bodily prayer with financial charity"
                            },
                            {
                                          "morpheme": "ٱنْحَرْ",
                                          "type": "فعل أمر (مبني على السكون)",
                                          "meaning": "Sacrifice camels / Give supreme wealth to feed the poor — Root ن-ح-ر"
                            }
              ],
              "balaghah_secret": "The pairing of Salah and Nahr unites internal spiritual purity with external humanitarian charity."
}
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
              beneficial_meaning: "Indeed — An absolute divine declaration of truth to comfort the Prophet ﷺ: the reality that follows is guaranteed by Allah Himself.",
              simplified_role: "Divine Guarantee of Truth",
              word_id: "108:3:w1",
              word_order: "1",
              word_part: "single",
              display_text: "إِنَّ",
              irab_easy_english: "Emphasis particle meaning 'Indeed / Truly'. It introduces absolute certainty that the following statement is true.",
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
              same_pattern_words: [],
              nouman_ali_khan_analysis: {
              "gem_title": "The Divine Verdict Against the Mockers (إِنَّ)",
              "summary": "Responding to slander not with defensive debate, but with sovereign decree.",
              "deep_dive": "Nouman Ali Khan highlights how Ayah 3 mirrors Ayah 1: both open with 'إِنَّ' (Inna). In Ayah 1, 'Inna' confirmed the Prophet's ﷺ eternal gift. In Ayah 3, 'Inna' seals the doom of his enemies. The mockers were shouting insults in the public markets of Makkah. Allah does not tell the Prophet ﷺ to argue back or defend himself. Allah silences the mockery with an incontrovertible divine decree that has echoed across 14 centuries.",
              "sub_morphemes": [
                            {
                                          "morpheme": "إِنَّ",
                                          "type": "حرف توكيد ونصب ناسخ",
                                          "meaning": "Indeed / Verily — Annulling particle affirming absolute decree"
                            }
              ],
              "balaghah_secret": "When Allah speaks in defense of His beloved Prophet ﷺ, He does not negotiate — He issues definitive verdicts."
}
            },
            {
              id: "108:3:2",
              beneficial_meaning: "The one who hates you — The arrogant enemies who mocked the Prophet ﷺ when his infant son passed away, spitefully claiming his legacy was finished.",
              simplified_role: "Subject: The Enemy / Mocker",
              word_id: "108:3:w2",
              word_order: "2",
              word_part: "single",
              display_text: "شَانِئَكَ",
              irab_easy_english: "Means 'Your enemy / the one who hates you'. It is the subject of Inna, carrying a fatha ending ('Shani'a-ka').",
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
              ],
              nouman_ali_khan_analysis: {
              "gem_title": "The Psychology of 'Shan'ān' & Divine Anonymity (شَانِئَكَ)",
              "summary": "Why 'Shani'aka' instead of 'Aduwwuka' (enemy) or 'Karihuka' (disliker)?",
              "deep_dive": "Nouman Ali Khan analyzes the word root: Arabic has 'كُرْه' (Kurh - simple dislike) and 'بُغْض' (Bughd - hatred). But 'شَنَآن' (Shan'ān) from root ش-ن-أ is a malicious, venomous hatred born out of jealousy — hating someone purely because of their goodness and success, finding joy in their pain. 'شَانِئ' is an Active Participle (اسم فاعل on وزن فَاعِل), indicating someone who has allowed hatred to become their primary habit and identity. Furthermore, Allah does not name the specific culprits (like Al-ʿĀṣ ibn Wāʾil or Abu Jahl). By keeping it general as 'شَانِئَكَ' (YOUR hater), Allah establishes an eternal, universal law: anyone who harbors malicious hatred against the Prophet ﷺ until the Day of Judgment will inevitably meet the same humiliated fate.",
              "sub_morphemes": [
                            {
                                          "morpheme": "شَانِئَ",
                                          "type": "اسم فاعل (اسم إن منصوب ومضاف)",
                                          "meaning": "The malicious hater consumed by spiteful jealousy — Root ش-ن-أ"
                            },
                            {
                                          "morpheme": "كَ",
                                          "type": "ضمير متصل مضاف إليه",
                                          "meaning": "Your — Pronominal marker maintaining personal divine protection"
                            }
              ],
              "balaghah_secret": "Divine anonymity strips the enemy of fame: Allah reduces them to a despised archetype rather than honoring them with a name in the eternal Book."
}
            },
            {
              id: "108:3:3",
              beneficial_meaning: "He is the one — A sharp divine reversal: Allah turns the insult right back onto the mockers—they alone are the ones forgotten and ruined, while Muhammad ﷺ is beloved and remembered forever.",
              simplified_role: "Focus & Reversal ('He alone')",
              word_id: "108:3:w3",
              word_order: "3",
              word_part: "single",
              display_text: "هُوَ",
              irab_easy_english: "Pronoun of separation meaning 'he [alone]'. It adds powerful exclusivity: 'He alone—and not you—is the one cut off!'",
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
              same_pattern_words: [],
              nouman_ali_khan_analysis: {
              "gem_title": "The Rhetorical Reversal: 'Huwa' as a Divine Shield (هُوَ)",
              "summary": "How the Pronoun of Separation turns the enemy's insult back upon their head.",
              "deep_dive": "This is one of the most stunning rhetorical masterstrokes highlighted by Ustadh Nouman Ali Khan. The Qurayshi mockers pointed their finger at the Prophet ﷺ and proclaimed: 'Muhammad is abtar!' When Allah responds, He inserts the independent pronoun 'هُوَ' (Huwa - Damīr al-Faṣl / Pronoun of Separation) right before 'Al-Abtar'. Grammatically, Damīr al-Faṣl produces 'Ḥaṣr' (exclusive restriction). Rhetorically, it acts as a divine shield that catches the enemy's spear and hurls it straight back: 'No! That hater of yours — HE AND HE ALONE is the one cut off!'",
              "sub_morphemes": [
                            {
                                          "morpheme": "هُوَ",
                                          "type": "ضمير فصل لا محل له من الإعراب",
                                          "meaning": "He [alone] — Generates exclusive restriction (حصر / قصر) and dramatic semantic reversal"
                            }
              ],
              "balaghah_secret": "The word 'Huwa' acts like an impenetrable mirror: whatever insult the enemy launched is magnified and reflected back upon them."
}
            },
            {
              id: "108:3:4",
              beneficial_meaning: "Cut off from all legacy — The mockers are completely severed from goodness, erased from honorable memory, while the Prophet's name ﷺ and message are praised by billions of believers across every land and era.",
              simplified_role: "The Outcome: Permanently Cut Off",
              word_id: "108:3:w4",
              word_order: "4",
              word_part: "single",
              display_text: "ٱلْأَبْتَرُ",
              irab_easy_english: "Predicate meaning 'The one cut off from all goodness and legacy'. It carries a damma ending ('al-Abtaru') as the predicate of Inna.",
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
              ],
              nouman_ali_khan_analysis: {
              "gem_title": "The Fulfilled Historical Miracle (ٱلْأَبْتَرُ)",
              "summary": "How a 7th-century linguistic condemnation became an ongoing historical prophecy.",
              "deep_dive": "Ustadh Nouman reflects on the historical miracle of 'Al-Abtar'. In pre-Islamic Arabia, 'Abtar' was an animal with its tail cut off, idiomatically used for a man with no male descendants whose name would die with him. The Quraysh thought physical sons were the only immortality. But what happened? The mockers died, their lineages scattered, and their memories are either completely forgotten or remembered with curse. Meanwhile, Muhammad ﷺ has a spiritual family of over 1.9 billion people who revere him like their own souls. In every second of every day, on minarets from Tokyo to Morocco, his name is called alongside Allah's name: 'Ashhadu anna Muhammadan Rasulullah'. The declaration 'He is the one cut off' was an impossible historical prophecy that stands verified before the eyes of the entire world.",
              "sub_morphemes": [
                            {
                                          "morpheme": "ٱلْـ",
                                          "type": "لام التعريف",
                                          "meaning": "The definite article — Indicating complete, absolute reality"
                            },
                            {
                                          "morpheme": "أَبْتَرُ",
                                          "type": "خبر إن مرفوع (وزن أَفْعَل)",
                                          "meaning": "The one completely severed from all legacy, goodness, and honorable remembrance"
                            }
              ],
              "balaghah_secret": "True legacy is not physical DNA — it is truth, righteous character, and the legacy bestowed by the Almighty."
}
            }
          ]
        }
      ]
    };

    function getWordGroups(tokens) {
      const groups = [];
      let currentGroup = [];
      let currentWordId = null;

      tokens.forEach((token) => {
        const wId = token.word_id || token.id;
        if (wId !== currentWordId) {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
          }
          currentGroup = [token];
          currentWordId = wId;
        } else {
          currentGroup.push(token);
        }
      });
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      return groups;
    }

        const COLOR_DIMENSIONS_INFO = {
      pos: {
        title: "🏷️ Word Class (Building Blocks)",
        benefit: "Why this helps: In Arabic, every single word is built from one of three categories: an Action (Verb), an Entity/Thing (Noun), or a Connector (Particle). Colors let your eyes immediately identify what kind of building block each word is without guessing.",
        legends: [
          { color: "#1e40af", label: "Action (Verb)", desc: "Commands and past deeds ('We gave', 'Pray', 'Sacrifice')" },
          { color: "#059669", label: "Entity (Noun)", desc: "People, places, qualities, and gifts ('Al-Kawthar', 'Lord', 'Enemy')" },
          { color: "#6d28d9", label: "Connector (Particle)", desc: "Glue holding words together ('Indeed', 'So/Therefore', 'For', 'And')" },
          { color: "#d97706", label: "Pointer (Pronoun)", desc: "Words pointing to people ('He', 'We', 'You')" }
        ]
      },
      case: {
        title: "⚖️ Case & Mood (Word Endings)",
        benefit: "Why this helps: In Arabic, the final vowel sound (u, a, i) shows what job the word is doing in the sentence—who did the action, who received it, and who is attached to a connector. Colors reveal these roles at a glance without memorizing charts.",
        legends: [
          { color: "#2563eb", label: "Actor / Primary (Raf')", desc: "The main topic or subject of the sentence (usually ends with 'u')" },
          { color: "#059669", label: "Receiver / Detail (Nasb)", desc: "The direct recipient of the action (usually ends with 'a')" },
          { color: "#7c3aed", label: "Attached (Jarr)", desc: "Connected after a preposition like 'for' or 'in' (usually ends with 'i')" },
          { color: "#64748b", label: "Fixed (Mabni)", desc: "Permanent building block that never changes its ending sound" }
        ]
      },
      syntax: {
        title: "🌳 Syntax Roles (Sentence Structure)",
        benefit: "Why this helps: Shows how complete thoughts and ideas connect—from divine promises to actions, objects, and conclusions. You see how every word contributes to the overarching message of the Surah.",
        legends: [
          { color: "#d97706", label: "Divine Guarantee (Inna)", desc: "Words of divine certainty anchoring the promise" },
          { color: "#dc2626", label: "Topic / Subject", desc: "Who the sentence is addressing or condemning" },
          { color: "#059669", label: "Gift / Receiver", desc: "What is being given or affected ('Al-Kawthar')" },
          { color: "#0284c7", label: "Action Command", desc: "The deeds demanded ('Pray', 'Sacrifice')" },
          { color: "#7c3aed", label: "Dedication Phrase", desc: "Exclusively for your Lord" }
        ]
      }
    };

      const WORD_QUIZZES = {
        "108:1:1": {
          id: "q108_1_1",
          token_id: "108:1:1",
          word_arabic: "إِنَّآ",
          ayah_num: 1,
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
          token_id: "108:1:2",
          word_arabic: "أَعْطَيْنَـٰكَ",
          ayah_num: 1,
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
          token_id: "108:1:3",
          word_arabic: "ٱلْكَوْثَرَ",
          ayah_num: 1,
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
          token_id: "108:2:1",
          word_arabic: "فَـ",
          ayah_num: 2,
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
          token_id: "108:2:2",
          word_arabic: "صَلِّ",
          ayah_num: 2,
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
          token_id: "108:2:3",
          word_arabic: "لِرَبِّكَ",
          ayah_num: 2,
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
          token_id: "108:2:4",
          word_arabic: "وَٱنْحَرْ",
          ayah_num: 2,
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
          token_id: "108:3:1",
          word_arabic: "إِنَّ",
          ayah_num: 3,
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
          token_id: "108:3:2",
          word_arabic: "شَانِئَكَ",
          ayah_num: 3,
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
          token_id: "108:3:3",
          word_arabic: "هُوَ",
          ayah_num: 3,
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
          token_id: "108:3:4",
          word_arabic: "ٱلْأَبْتَرُ",
          ayah_num: 3,
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

      const QUIZ_QUESTIONS = Object.values(WORD_QUIZZES);

    function Surah108App() {
      const [showAnimations, setShowAnimations] = useState(true);
      const [showTooltips, setShowTooltips] = useState(true);
      const [colorMode, setColorMode] = useState("pos"); // 'pos' | 'case' | 'syntax'
      const [selectedToken, setSelectedToken] = useState(KAWTHAR_DATA.verses[0].tokens[1]); // Default to أَعْطَيْنَاكَ
      const [aiLevel, setAiLevel] = useState('beginner'); // 'beginner' | 'intermediate' | 'advanced'
      const [playingAyah, setPlayingAyah] = useState(null);
      const [isPlayingSurah, setIsPlayingSurah] = useState(false);
      const [audioRef, setAudioRef] = useState(null);
      const [quizAnswers, setQuizAnswers] = useState({});
      const [showQuiz, setShowQuiz] = useState(false);
      const [copyToast, setCopyToast] = useState(null);

      const selectedWordQuiz = selectedToken ? WORD_QUIZZES[selectedToken.id] : null;
      const selectedWordAnswer = selectedWordQuiz ? quizAnswers[selectedWordQuiz.id] : null;



      const playAyahAudio = (ayahNumber, onEnd) => {
        if (playingAyah === ayahNumber && audioRef) {
          audioRef.pause();
          setPlayingAyah(null);
          setIsPlayingSurah(false);
          return;
        }
        if (audioRef) {
          audioRef.pause();
        }
        const ayahPadded = String(ayahNumber).padStart(3, '0');
        const url = 'https://everyayah.com/data/Alafasy_128kbps/108' + ayahPadded + '.mp3';
        const audio = new Audio(url);
        setAudioRef(audio);
        setPlayingAyah(ayahNumber);

        audio.play().catch(e => console.log('Audio playback prevented by browser', e));
        audio.onended = () => {
          setPlayingAyah(null);
          if (onEnd) onEnd();
        };
      };

      const togglePlaySurah = () => {
        if (isPlayingSurah || playingAyah) {
          if (audioRef) audioRef.pause();
          setIsPlayingSurah(false);
          setPlayingAyah(null);
        } else {
          setIsPlayingSurah(true);
          playAyahAudio(1, () => {
            playAyahAudio(2, () => {
              playAyahAudio(3, () => {
                setIsPlayingSurah(false);
                setPlayingAyah(null);
              });
            });
          });
        }
      };

      const copyAyahText = (verse) => {
        const text = '«' + verse.text_uthmani + '»\n' + verse.transliteration + '\n"' + verse.translation + '"\n(Surah Al-Kawthar 108:' + verse.number + ')';
        navigator.clipboard.writeText(text);
        setCopyToast('Copied Ayah ' + verse.number + ' to clipboard!');
        setTimeout(() => setCopyToast(null), 2500);
      };


      return (
        <div className={`app-root ${showTooltips ? 'show-tooltips' : ''} ${colorMode}-mode`}>

          <header className="app-header">
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <a href="index.html" className="back-nav-link">
                ← Return to Main Quran Explorer
              </a>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <a href="editor.html" className="back-nav-link" style={{ color: '#34d399' }}>
                🛠️ Open Cloudflare JSON Studio & Editor
              </a>
            </div>
            <div className="badge-pill">✨ Surah 108 — Master Multi-Layer Pilot</div>
            <div className="surah-title-row">
              <h1 className="surah-title">Surah Al-Kawthar</h1>
              <span className="surah-title-ar">سورة الكوثر</span>
            </div>
            <p className="surah-subtitle">
              Interactive Word-by-Word Grammar, Visual Syntax Tree, and Multi-Tier AI Linguistic Tutor
            </p>
            <div className="stats-row">
              <div className="stat-chip">
                <span className="stat-chip-num">{KAWTHAR_DATA.total_verses}</span>
                <span className="stat-chip-label">Verses</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-num">{KAWTHAR_DATA.total_words}</span>
                <span className="stat-chip-label">Words</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-num">{KAWTHAR_DATA.total_letters}</span>
                <span className="stat-chip-label">Letters</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-num">☪</span>
                <span className="stat-chip-label">{KAWTHAR_DATA.classification}</span>
              </div>
            </div>
          </header>

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
                className={`toggle-btn ${isPlayingSurah ? 'is-active' : ''}`}
                onClick={togglePlaySurah}
                title="Play continuous recitation by Sheikh Mishary Rashid Alafasy"
              >
                <span>{isPlayingSurah ? '⏸️' : '▶️'}</span> {isPlayingSurah ? 'Pause Recitation' : 'Play Full Surah'}
              </button>
              <button
                className={`toggle-btn ${showQuiz ? 'is-active' : ''}`}
                onClick={() => setShowQuiz(!showQuiz)}
                title="Test your knowledge of Surah 108"
              >
                <span>🎓</span> {showQuiz ? 'Close Challenge' : 'Linguistic Challenge'}
              </button>
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

          {/* ── Down-to-Earth Color Dimension Explainer Guide & Legends ── */}
          <section className="color-dimension-guide-wrapper">
            <div className="color-guide-card">
              <div className="color-guide-header">
                <div className="color-guide-title">
                  <span>🎨</span> 
                  <strong>Why do we color-code Arabic?</strong>
                </div>
                <span className="color-guide-active-tag">
                  {COLOR_DIMENSIONS_INFO[colorMode].title}
                </span>
              </div>
              <p className="color-guide-benefit">
                {COLOR_DIMENSIONS_INFO[colorMode].benefit}
              </p>
              <div className="legend-chips-row">
                {COLOR_DIMENSIONS_INFO[colorMode].legends.map((item, idx) => (
                  <div key={idx} className="legend-chip">
                    <span className="legend-color-dot" style={{ backgroundColor: item.color }}></span>
                    <span className="legend-chip-title">{item.label}:</span>
                    <span className="legend-chip-desc">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <main className="verses-canvas single-mushaf-layout">
            <div className="mushaf-card">
              <div className="mushaf-card-header">
                <div className="mushaf-header-left">
                  <span className="surah-mushaf-title">سُورَةُ الْكَوْثَرِ</span>
                  <span className="surah-mushaf-badge">Full Continuous Flow • 3 Ayāt</span>
                </div>
                <div className="mushaf-header-actions">
                  <button
                    onClick={togglePlaySurah}
                    className={`mushaf-audio-btn ${isPlayingSurah ? 'is-active' : ''}`}
                    title="Play continuous recitation of Surah Al-Kawthar"
                  >
                    <span>{isPlayingSurah ? '⏹ Stop' : '▶️ Play Recitation'}</span>
                  </button>
                  <button
                    onClick={() => {
                      const allText = KAWTHAR_DATA.verses.map(v => v.text_uthmani + ' ۝' + (v.number === 1 ? '١' : v.number === 2 ? '٢' : '٣')).join(' ');
                      navigator.clipboard.writeText(allText);
                      setCopyToast('Copied full Surah to clipboard!');
                      setTimeout(() => setCopyToast(null), 2500);
                    }}
                    className="mushaf-copy-btn"
                    title="Copy full Surah text"
                  >
                    📋 Copy Surah
                  </button>
                </div>
              </div>

              {/* WHEN A WORD IS CLICKED: Grammar card appears right here, PUSHING the Quranic Arabic paragraph down! */}
              {selectedToken && (
                <div className="inline-grammar-reveal-card" id="grammar-reveal-card">
                  <div className="reveal-header">
                    <div className="reveal-word-badge">
                      <span className="reveal-ar-text">{selectedToken.text}</span>
                      <div className="reveal-meta">
                        <div className="reveal-lemma">
                          <strong>{selectedToken.lemma || selectedToken.text}</strong>
                          <span className="reveal-role-tag">{selectedToken.pos_label}</span>
                        </div>
                        <div className="reveal-location-tag">
                          Ayah {selectedToken.id.split(':')[1]} • Word {selectedToken.word_order || selectedToken.id.split(':')[2]}
                        </div>
                      </div>
                    </div>
                    <div className="reveal-header-right">
                      <button 
                        className="reveal-deep-btn"
                        onClick={() => {
                          const el = document.getElementById('deep-inspector');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        title="Scroll down to deep morphology, patterns, and Quranic examples"
                      >
                        🔬 Deep Linguistic Tutor ↓
                      </button>
                      <button 
                        className="close-reveal-btn"
                        onClick={() => setSelectedToken(null)}
                        title="Close breakdown"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* SIMPLE BENEFICIAL MEANING (NO TECHNICAL JARGON, NO ARABIC GRAMMAR TEXT) */}
                  <div className="beneficial-meaning-card">
                    <div className="meaning-header">
                      <span>✨</span> <strong>Simple Meaning & Job in this Sentence:</strong>
                    </div>
                    <p className="meaning-text">
                      {selectedToken.beneficial_meaning || selectedToken.irab_easy_english || selectedToken.ai_explanations.beginner}
                    </p>
                  </div>

                  {/* Down-to-Earth Quick Facts */}
                  <div className="reveal-quick-facts">
                    <div className="reveal-chip">
                      <span className="chip-label">Building Block:</span>
                      <span className="chip-val">{selectedToken.pos_label}</span>
                    </div>
                    <div className="reveal-chip">
                      <span className="chip-label">Simple Role:</span>
                      <span className="chip-val">{selectedToken.simplified_role || selectedToken.case_class.replace('case-', '')}</span>
                    </div>
                    {selectedToken.root && (
                      <div className="reveal-chip">
                        <span className="chip-label">Root Idea:</span>
                        <span className="chip-val ar-font">{selectedToken.root}</span>
                      </div>
                    )}
                    {selectedToken.wazn && selectedToken.wazn !== '—' && (
                      <div className="reveal-chip">
                        <span className="chip-label">Rhythm Pattern:</span>
                        <span className="chip-val ar-font">{selectedToken.wazn}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

                            {/* SACRED BISMILLAH CALLIGRAPHY BANNER */}
              <div className="bismillah-banner" title="In the Name of Allah, the Entirely Merciful, the Especially Merciful">
                <div className="bismillah-arabic">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
                <div className="bismillah-sub">In the Name of Allah, the Entirely Merciful, the Especially Merciful</div>
              </div>

              {/* SINGLE CONTINUOUS MUSHAF PARAGRAPH (NO LINE BREAKS BETWEEN AYATS!) */}
              <div className="mushaf-paragraph" aria-label="Surah Al-Kawthar continuous text">
                {KAWTHAR_DATA.verses.map((verse) => {
                  const wordGroups = getWordGroups(verse.tokens);
                  return (
                    <React.Fragment key={verse.id}>
                      {wordGroups.map((group) => {
                        const isCompound = group.length > 1;
                        return (
                          <span
                            key={group[0].word_id || group[0].id}
                            className={`word-cluster ${isCompound ? 'compound-word' : ''}`}
                          >
                            {group.map((token) => {
                              const isSelected = selectedToken && selectedToken.id === token.id;
                              let animClass = "";
                              if (showAnimations && token.pos_class === "verb-past") animClass = "pulse-past";
                              const joinedClass = token.word_part ? `joined-${token.word_part}` : "";

                              return (
                                <span
                                  key={token.id}
                                  className={`gram-word ${token.pos_class} ${token.case_class} ${token.syntax_class} ${joinedClass} ${animClass} ${isSelected ? 'is-selected' : ''}`}
                                  data-tooltip={token.tooltip}
                                  onClick={() => setSelectedToken(token)}
                                >
                                  {token.display_text || token.text}
                                </span>
                              );
                            })}
                          </span>
                        );
                      })}
                      {/* Ayah End Medallion (The ONLY interruption between ayats!) */}
                      <span
                        className={`ayah-end-medallion ${playingAyah === verse.number ? 'is-playing' : ''}`}
                        title={`Ayah ${verse.number} • Click to listen`}
                        onClick={() => playAyahAudio(verse.number)}
                      >
                        <span className="medallion-symbol">۝</span>
                        <span className="medallion-num">
                          {verse.number === 1 ? '١' : verse.number === 2 ? '٢' : '٣'}
                        </span>
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Clean English Translation of the 3 Verses */}
              <div className="mushaf-translations-container">
                <div className="trans-header">
                  <span>📖</span> <strong>English Meaning of the Ayāt:</strong>
                </div>
                <div className="translations-list">
                  {KAWTHAR_DATA.verses.map((v) => (
                    <div 
                      key={v.id} 
                      className={`trans-line-item ${selectedToken && selectedToken.id.startsWith(v.id + ':') ? 'is-highlighted-verse' : ''}`}
                    >
                      <span className="trans-badge">Ayah {v.number}</span>
                      <p className="trans-quote">"{v.translation}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {selectedToken && (
            <section className="detail-inspector" id="deep-inspector">
              <div className="detail-inspector-inner">
              <div className="inspector-header">
                <div className="word-hero-left">
                  <span className="word-arabic-hero">{selectedToken.text}</span>
                  <div className="word-sub-meta">
                    <span className="word-translit">
                      {selectedToken.lemma} • {selectedToken.pos_label}
                    </span>
                    <span className="word-role-badge" title={`Linguistic Corpus Token ID: ${selectedToken.id}`}>
                      Ayah {selectedToken.id.split(':')[1]} • Word {selectedToken.word_order || selectedToken.id.split(':')[2]}
                    </span>
                  </div>
                </div>

                <div className="irab-text" style={{ textAlign: 'left', direction: 'ltr' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '4px' }}>
                    ✨ Simple Beneficial Meaning:
                  </div>
                  <div style={{ fontSize: '0.98rem', color: '#1e3a8a', lineHeight: 1.6, fontWeight: 500 }}>
                    {selectedToken.beneficial_meaning || selectedToken.irab_easy_english}
                  </div>
                </div>
              </div>

              {/* 🎙️ USTADH NOUMAN ALI KHAN (BAYYINAH) DEEP LINGUISTIC GEM CARD */}
              {selectedToken.nouman_ali_khan_analysis && (
                <div className="nak-gem-container">
                  <div className="nak-gem-header">
                    <div className="nak-badge-row">
                      <span className="nak-mic-badge">🎙️ Ustadh Nouman Ali Khan • Bayyinah</span>
                      <span className="nak-category-pill">Rhetorical & Linguistic Gem</span>
                    </div>
                    <h3 className="nak-gem-title">
                      {selectedToken.nouman_ali_khan_analysis.gem_title}
                    </h3>
                    <p className="nak-gem-summary">
                      {selectedToken.nouman_ali_khan_analysis.summary}
                    </p>
                  </div>

                  <div className="nak-gem-body">
                    <div className="nak-deep-dive-text">
                      {selectedToken.nouman_ali_khan_analysis.deep_dive}
                    </div>

                    {selectedToken.nouman_ali_khan_analysis.sub_morphemes && selectedToken.nouman_ali_khan_analysis.sub_morphemes.length > 0 && (
                      <div className="nak-submorphemes-box">
                        <div className="nak-box-title">
                          <span>🧩</span> Sub-Word Morpheme Analysis ({selectedToken.text})
                        </div>
                        <div className="nak-morpheme-grid">
                          {selectedToken.nouman_ali_khan_analysis.sub_morphemes.map((m, mIdx) => (
                            <div key={mIdx} className="nak-morpheme-item">
                              <span className="nak-morpheme-ar">{m.morpheme}</span>
                              <span className="nak-morpheme-type">{m.type}</span>
                              <span className="nak-morpheme-meaning">{m.meaning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedToken.nouman_ali_khan_analysis.balaghah_secret && (
                      <div className="nak-balaghah-secret">
                        <div className="nak-secret-label">
                          <span>✨</span> Rhetorical Secret (السِّرُّ البَلاغِي):
                        </div>
                        <div className="nak-secret-text">
                          {selectedToken.nouman_ali_khan_analysis.balaghah_secret}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                <div className={`ai-content-box level-${aiLevel}`}>
                  {selectedToken.ai_explanations[aiLevel]}
                </div>
              </div>

              <div className="morpho-grid">
                <div className="morpho-card">
                  <div className="morpho-label">Root (الجذر)</div>
                  <div className="morpho-val">
                    {selectedToken.root ? selectedToken.root : "Uninflected Particle"}
                  </div>
                </div>
                <div className="morpho-card">
                  <div className="morpho-label">Pattern (الوزن الصرفي)</div>
                  <div className="morpho-val" style={{ fontFamily: 'Amiri, serif', fontSize: '1.2rem', color: '#2563eb' }}>
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

              <div className="comparison-grid">
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

              {/* Thematic Knowledge Graph (Ontology) */}
              <div className="syntax-tree-card" style={{ marginTop: '1.5rem', background: '#faf5ff', borderColor: '#e9d5ff' }}>
                <div className="tree-title" style={{ color: '#6b21a8' }}>
                  <span>🧠</span> Thematic Knowledge Graph (Ontology)
                </div>
                <div className="syntax-chain">
                  <div className="syntax-edge" style={{ background: '#ffffff', border: '1px solid #f3e8ff' }}>
                    <span style={{ fontWeight: 600, color: '#4c1d95' }}>Allah</span>
                    <span className="edge-badge" style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
                      ── bestows kawthar upon ──▶
                    </span>
                    <strong style={{ color: '#1e1b4b' }}>Prophet Muhammad ﷺ</strong>
                  </div>
                  <div className="syntax-edge" style={{ background: '#ffffff', border: '1px solid #f3e8ff' }}>
                    <span style={{ fontWeight: 600, color: '#4c1d95' }}>Prophet Muhammad ﷺ</span>
                    <span className="edge-badge" style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
                      ── commands worship for ──▶
                    </span>
                    <strong style={{ color: '#1e1b4b' }}>Prayer (صَلِّ) & Sacrifice (ٱنْحَرْ)</strong>
                  </div>
                  <div className="syntax-edge" style={{ background: '#ffffff', border: '1px solid #f3e8ff' }}>
                    <span style={{ fontWeight: 600, color: '#4c1d95' }}>Enemies (Shani')</span>
                    <span className="edge-badge" style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
                      ── condemned to be ──▶
                    </span>
                    <strong style={{ color: '#1e1b4b' }}>Cut Off (Al-Abtar)</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Word-by-Word Pedagogical Quiz Card */}
              {selectedWordQuiz && (
                <div className="word-quiz-panel" style={{
                  marginTop: '1.75rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.35rem' }}>🎯</span>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        Word Mastery Quiz: <span style={{ fontFamily: "'Amiri Quran', 'Amiri', serif", color: '#2563eb', fontSize: '1.35rem' }}>{selectedToken.text}</span>
                      </h4>
                      <span style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '9999px'
                      }}>
                        Ayah {selectedToken.id.split(':')[1]} • Word {selectedToken.word_order || selectedToken.id.split(':')[2]}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                      High-Yield Linguistic Self-Test
                    </div>
                  </div>

                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', lineHeight: 1.55 }}>
                    {selectedWordQuiz.question}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    {selectedWordQuiz.options.map(opt => {
                      const isChosen = selectedWordAnswer?.id === opt.id;
                      let btnStyle = {
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#334155'
                      };
                      if (selectedWordAnswer) {
                        if (opt.correct) {
                          btnStyle = { background: '#ecfdf5', border: '2px solid #10b981', color: '#065f46', fontWeight: 700 };
                        } else if (isChosen && !opt.correct) {
                          btnStyle = { background: '#fef2f2', border: '2px solid #ef4444', color: '#991b1b', fontWeight: 700 };
                        }
                      }
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            if (!selectedWordAnswer) {
                              setQuizAnswers(prev => ({ ...prev, [selectedWordQuiz.id]: opt }));
                            }
                          }}
                          style={{
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.86rem',
                            cursor: selectedWordAnswer ? 'default' : 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                            lineHeight: 1.45,
                            ...btnStyle
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, opacity: 0.7 }}>{opt.id.toUpperCase()}.</span>
                            <span>{opt.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedWordAnswer && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                      <div style={{
                        padding: '0.85rem 1.15rem',
                        borderRadius: '10px',
                        background: selectedWordAnswer.correct ? '#f0fdf4' : '#fff1f2',
                        border: selectedWordAnswer.correct ? '1px solid #bbf7d0' : '1px solid #fecdd3',
                        fontSize: '0.84rem',
                        lineHeight: 1.55,
                        color: selectedWordAnswer.correct ? '#166534' : '#9f1239'
                      }}>
                        <strong>{selectedWordAnswer.correct ? '✓ Correct!' : '✕ Note:'}</strong> {selectedWordAnswer.explanation}
                      </div>

                      <div style={{
                        padding: '0.85rem 1.15rem',
                        borderRadius: '10px',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        fontSize: '0.84rem',
                        lineHeight: 1.55,
                        color: '#1e40af'
                      }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', color: '#1d4ed8', fontSize: '0.88rem' }}>
                          <span>💡</span> Why this is a good question (Pedagogical Rationale):
                        </strong>
                        {selectedWordQuiz.why_this_is_a_good_question}
                      </div>
                    </div>
                  )}
                </div>
              )}
              </div>
            </section>
          )}

          {showQuiz && (
            <section style={{
              width: '100%',
              maxWidth: '1080px',
              margin: '2rem auto 0',
              padding: '2rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎓</span> Surah Al-Kawthar Master Linguistic Challenge
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
                    Test your understanding of Sarf patterns, Nahw roles, and rhetorical secrets.
                  </p>
                </div>
                <div style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  Score: {Object.values(quizAnswers).filter(a => a.correct).length} / {QUIZ_QUESTIONS.length}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const selectedOpt = quizAnswers[q.id];
                  return (
                    <div key={q.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '9999px'
                          }}>
                            Ayah {q.ayah_num} • Word <span style={{ fontFamily: "'Amiri', serif", fontSize: '0.95rem' }}>{q.word_arabic}</span>
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Token {q.token_id}</span>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Question {idx + 1} of {QUIZ_QUESTIONS.length}</span>
                      </div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', lineHeight: 1.55 }}>
                        {q.question}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                        {q.options.map(opt => {
                          const isChosen = selectedOpt?.id === opt.id;
                          let btnStyle = {
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#334155'
                          };
                          if (selectedOpt) {
                            if (opt.correct) {
                              btnStyle = { background: '#ecfdf5', border: '2px solid #10b981', color: '#065f46', fontWeight: 700 };
                            } else if (isChosen && !opt.correct) {
                              btnStyle = { background: '#fef2f2', border: '2px solid #ef4444', color: '#991b1b', fontWeight: 700 };
                            }
                          }
                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (!selectedOpt) {
                                  setQuizAnswers(prev => ({ ...prev, [q.id]: opt }));
                                }
                              }}
                              style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                cursor: selectedOpt ? 'default' : 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s ease',
                                ...btnStyle
                              }}
                            >
                              <div style={{ display: 'flex', gap: '0.45rem' }}>
                                <span style={{ fontWeight: 700, opacity: 0.7 }}>{opt.id.toUpperCase()}.</span>
                                <span>{opt.text}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {selectedOpt && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.85rem' }}>
                          <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            background: selectedOpt.correct ? '#f0fdf4' : '#fff1f2',
                            border: selectedOpt.correct ? '1px solid #bbf7d0' : '1px solid #fecdd3',
                            fontSize: '0.82rem',
                            lineHeight: 1.5,
                            color: selectedOpt.correct ? '#166534' : '#9f1239'
                          }}>
                            <strong>{selectedOpt.correct ? '✓ Correct!' : '✕ Note:'}</strong> {selectedOpt.explanation}
                          </div>

                          <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            fontSize: '0.82rem',
                            lineHeight: 1.5,
                            color: '#1e40af'
                          }}>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem', color: '#1d4ed8' }}>
                              <span>💡</span> Why this is a good question:
                            </strong>
                            {q.why_this_is_a_good_question}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {copyToast && (
            <div style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: '#059669',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
              zIndex: 999
            }}>
              {copyToast}
            </div>
          )}

          <footer className="app-footer">
            <p className="footer-text">Surah Al-Kawthar — Grammar Intelligence & AI Tutor</p>
            <p className="footer-version">v1.1.10 (updated 2026-10-08 13:25)</p>
          </footer>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<Surah108App />);
  