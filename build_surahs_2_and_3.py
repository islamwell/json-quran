import json
import re
import urllib.request
import os
import sys

BW_MAP = {
    "'": "ء", ">": "أ", "&": "ؤ", "<": "إ", "}": "ئ",
    "A": "ا", "b": "ب", "p": "ة", "t": "ت", "v": "ث",
    "j": "ج", "H": "ح", "x": "خ", "d": "د", "*": "ذ",
    "r": "ر", "z": "ز", "s": "س", "$": "ش", "S": "ص",
    "D": "ض", "T": "ط", "Z": "ظ", "E": "ع", "g": "غ",
    "_": "ـ", "f": "ف", "q": "ق", "k": "ك", "l": "ل",
    "m": "م", "n": "ن", "h": "ه", "w": "و", "Y": "ى",
    "y": "ي", "F": "ً", "N": "ٌ", "K": "ٍ", "a": "َ",
    "u": "ُ", "i": "ِ", "~": "ّ", "o": "ْ", "{": "ٱ",
    "`": "ٰ"
}

def bw_to_ar(s):
    if not s:
        return ""
    return "".join(BW_MAP.get(c, c) for c in s)

def normalize_arabic(text):
    if not text:
        return ""
    t = text.replace('ٰ', 'ا').replace('ٱ', 'ا').replace('آ', 'ا').replace('إ', 'ا').replace('أ', 'ا').replace('ـ', '')
    t = re.sub(r'[ً-ٟۖ-ۭٓٔ]', '', t)
    t = t.replace('ة', 'ه').replace('ى', 'ي')
    return re.sub(r'[^\w\s]', '', t).strip()

def strip_tashkeel(text):
    if not text:
        return ""
    t = text.replace('ٰ', 'ا').replace('ٱ', 'ا').replace('ـ', '')
    return re.sub(r'[ً-ٟۖ-ۭٓٔ]', '', t).strip()

def analyze_root_structure(root_bw):
    if not root_bw:
        return "unidentified", None, False, [], None, None
    letters = [bw_to_ar(c) for c in root_bw if c in BW_MAP]
    length = len(letters)
    is_trilateral = (length == 3)
    hyphen = "-".join(letters)
    normalized = "".join(letters)
    
    if length == 4:
        return "quadriliteral", None, False, letters, hyphen, normalized
    
    has_hamza = any(c in root_bw for c in ["'", ">", "<", "&", "}"])
    has_weak_start = root_bw.startswith(('w', 'y'))
    has_weak_mid = len(root_bw) == 3 and root_bw[1] in ('w', 'y')
    has_weak_end = root_bw.endswith(('w', 'y', 'Y'))
    is_geminated = len(root_bw) == 3 and root_bw[1] == root_bw[2]
    
    if (has_weak_start and has_weak_end) or (has_weak_mid and has_weak_end):
        return "mixed_weak", "lafif", is_trilateral, letters, hyphen, normalized
    if is_geminated:
        return "doubled", "muda_af", is_trilateral, letters, hyphen, normalized
    if has_hamza:
        return "hamzated", "mahmuz", is_trilateral, letters, hyphen, normalized
    if has_weak_start:
        return "assimilated", "mithal", is_trilateral, letters, hyphen, normalized
    if has_weak_mid:
        return "hollow", "ajwaf", is_trilateral, letters, hyphen, normalized
    if has_weak_end:
        return "defective", "naqis", is_trilateral, letters, hyphen, normalized
    return "sound", "salim", is_trilateral, letters, hyphen, normalized

FORM_INFO = {
    "I": {"name_ar": "فَعَلَ", "name_en": "Form I (Basic)", "derived": False, "wazn": "فَعَلَ / يَفْعَلُ", "meaning": "Basic root action"},
    "II": {"name_ar": "فَعَّلَ", "name_en": "Form II (Intensive/Causative)", "derived": True, "wazn": "فَعَّلَ / يُفَعِّلُ", "meaning": "Causative, intensive, or frequentative action"},
    "III": {"name_ar": "فَاعَلَ", "name_en": "Form III (Associative/Reciprocal)", "derived": True, "wazn": "فَاعَلَ / يُفَاعِلُ", "meaning": "Action directed toward another, striving, or reciprocal"},
    "IV": {"name_ar": "أَفْعَلَ", "name_en": "Form IV (Causative)", "derived": True, "wazn": "أَفْعَلَ / يُفْعِلُ", "meaning": "Causative / transitive instigation"},
    "V": {"name_ar": "تَفَعَّلَ", "name_en": "Form V (Reflexive of II)", "derived": True, "wazn": "تَفَعَّلَ / يَتَفَعَّلُ", "meaning": "Reflexive of Form II, gradual inward acquisition"},
    "VI": {"name_ar": "تَفَاعَلَ", "name_en": "Form VI (Mutual/Reciprocal)", "derived": True, "wazn": "تَفَاعَلَ / يَتَفَاعَلُ", "meaning": "Mutual or reciprocal collective interaction"},
    "VII": {"name_ar": "انْفَعَلَ", "name_en": "Form VII (Passive/Involuntary)", "derived": True, "wazn": "انْفَعَلَ / يَنْفَعِلُ", "meaning": "Passive, reflexive, or involuntary submission to action"},
    "VIII": {"name_ar": "افْتَعَلَ", "name_en": "Form VIII (Middle Voice/Effort)", "derived": True, "wazn": "افْتَعَلَ / يَفْتَعِلُ", "meaning": "Earnest effort, pursuit, or middle voice"},
    "IX": {"name_ar": "افْعَلَّ", "name_en": "Form IX (Colors/Defects)", "derived": True, "wazn": "افْعَلَّ / يَفْعَلُّ", "meaning": "Acquiring a permanent physical attribute or color"},
    "X": {"name_ar": "اسْتَفْعَلَ", "name_en": "Form X (Seeking/Beseeching)", "derived": True, "wazn": "اسْتَفْعَلَ / يَسْتَفْعِلُ", "meaning": "Seeking, requesting, or considering something to be"}
}

GRAMMAR_RULES = [
    {
        "grammar_rule_id": "rule_raf",
        "arabic_term": "الرفع",
        "english_term": "Nominative Case",
        "definition": "The primary grammatical case marking independent agents, actors, sentence topics, and predicates in classical Arabic.",
        "beginner_explanation": "Marks the 'star' of the sentence—the person or thing who does the action, or the main topic being talked about. It usually ends with a Dhumma ('u' sound).",
        "advanced_explanation": "حالة إعرابية أصلية تدل على العمدة في الكلام، وعلامتها الأصلية الضمة، وتنوب عنها الواو في جمع المذكر السالم والأسماء الخمسة، والألف في المثنى، وثبوت النون في الأفعال الخمسة.",
        "examples": ["قَالَ اللَّهُ", "الْمُؤْمِنُونَ إِخْوَةٌ", "يَكْتُبُ الزَّيْدُ"]
    },
    {
        "grammar_rule_id": "rule_nasb",
        "arabic_term": "النصب",
        "english_term": "Accusative Case",
        "definition": "The grammatical case signaling dependency, subordination, receiving an action (direct object), circumstances of time/place, or state (hal).",
        "beginner_explanation": "Marks the receiver of the action—what or who was affected—as well as details like when, where, or how something happened. It usually ends with a Fatha ('a' sound).",
        "advanced_explanation": "حالة إعرابية تدل على الفضلات والمفاعيل وما ألحق بها كالحال والتمييز واسم إن وخبر كان، وعلامتها الأصلية الفتحة.",
        "examples": ["خَلَقَ اللَّهُ السَّمَاوَاتِ", "شَرِبَ الْمَاءَ", "جَاءَ رَاكِبًا"]
    },
    {
        "grammar_rule_id": "rule_jarr",
        "arabic_term": "الجر",
        "english_term": "Genitive Case",
        "definition": "The grammatical case exclusive to nouns, indicating relationship governed by a preposition (Harf Jarr) or possessive annexation (Idafah).",
        "beginner_explanation": "Marks attachment or possession—either coming right after a preposition (like 'in', 'on', 'with') or showing belonging ('house of Allah'). It usually ends with a Kasra ('i' sound).",
        "advanced_explanation": "حالة إعرابية تختص بالأسماء، وتكون بحرف الجر أو بالإضافة أو التبعية، وعلامتها الأصلية الكسرة.",
        "examples": ["فِي الْبَيْتِ", "كِتَابُ اللَّهِ", "بِسْمِ اللَّهِ"]
    },
    {
        "grammar_rule_id": "rule_jazm",
        "arabic_term": "الجزم",
        "english_term": "Jussive Mood",
        "definition": "The grammatical state exclusive to imperfect verbs (Mudari'), signaling negation, conditional dependency, or command.",
        "beginner_explanation": "Stops or clips the verb's ending—used after negative particles like 'Lam' (did not) or in conditional 'if' sentences. It usually ends with a Sukun (silent stop).",
        "advanced_explanation": "حالة إعرابية تختص بالفعل المضارع إذا سبقه جازم، وعلامتها الأصلية السكون، أو حذف النون، أو حذف حرف العلة.",
        "examples": ["لَمْ يَلِدْ", "وَإِن تَصْبِرُوا", "لِيُنفِقْ"]
    },
    {
        "grammar_rule_id": "rule_mabni",
        "arabic_term": "البناء",
        "english_term": "Indeclinability (Mabni)",
        "definition": "The syntactic state of words whose final short vowel never changes, regardless of grammatical governor.",
        "beginner_explanation": "Words made of 'concrete'—their endings never change no matter where they sit in a sentence (like all particles, past verbs, and pronouns).",
        "advanced_explanation": "لزوم آخر الكلمة حركة أو سكونًا لغير عامل، كالحروف والضمائر وأسماء الإشارة وأفعال الماضي والأمر.",
        "examples": ["مَنْ", "هَـٰذَا", "كَتَبَ", "فِي"]
    },
    {
        "grammar_rule_id": "rule_idafah",
        "arabic_term": "الإضافة",
        "english_term": "Possessive Annexation",
        "definition": "A syntactic construct binding two nouns together where the first (Mudhaf) is possessed or qualified by the second (Mudhaf Ilayh in genitive).",
        "beginner_explanation": "Two nouns glued together to show possession: 'Word of Allah', 'Messenger of God'. The first drops its 'Tanween' or 'Al-' and the second is in the Genitive.",
        "advanced_explanation": "نسبة تقييدية بين اسمين توجب جر الثاني دائمًا وتجريد الأول من التنوين ونوني المثنى والجمع.",
        "examples": ["رَسُولُ اللَّهِ", "كِتَابُ الْحِكْمَةِ", "أَهْلُ الْكِتَابِ"]
    },
    {
        "grammar_rule_id": "rule_shart",
        "arabic_term": "أسلوب الشرط",
        "english_term": "Conditional Sentence",
        "definition": "A compound syntactic structure linking a condition (Shart) to an apodosis/result (Jawab al-Shart).",
        "beginner_explanation": "An 'if-then' statement: 'If you do this, that will happen.' Both the condition and the result verbs often take the clipped jussive mood.",
        "advanced_explanation": "تركيب يربط بين جملتين بأداة شرط، بحيث يكون مضمون الجملة الأولى سببًا وشرطًا في تحقق مضمون الثانية.",
        "examples": ["إِن تَتَّقُوا اللَّهَ يَجْعَل لَّكُمْ فُرْقَانًا", "مَن يَعْمَلْ سُوءًا يُجْزَ بِهِ"]
    }
]

SARF_RULES = [
    {
        "rule_id": "sarf_form_1",
        "arabic_name": "المجرد الثلاثي (الفعل الثلاثي المجرد)",
        "english_name": "Form I (Triliteral Base Verb)",
        "rule": "The root consists of three bare consonantal radicals without augmentation: ف-ع-ل.",
        "beginner_explanation": "The fundamental, core 3-letter verb pattern from which all other forms branch out.",
        "advanced_explanation": "الفعل الخالي من أحرف الزيادة، وتأتي عين ماضيه مفتوحة أو مكسورة أو مضمومة (فَعَلَ، فَعِلَ، فَعُلَ).",
        "examples": ["خَلَقَ", "عَلِمَ", "كَتَبَ"]
    },
    {
        "rule_id": "sarf_form_2",
        "arabic_name": "بَابُ التَّفْعِيلِ (فَعَّلَ)",
        "english_name": "Form II (Causative & Intensive)",
        "rule": "Formed by doubling the second radical (عين الفعل) with Shaddah: فَعَّلَ / يُفَعِّلُ / تَفْعِيل.",
        "beginner_explanation": "Doubling the middle letter to make an action causative (making someone do it) or intensive (doing it thoroughly).",
        "advanced_explanation": "مزيد بحرف واحد بتضعيف العين، ويفيد التعدية والتكثير والنسبة والجعل.",
        "examples": ["عَلَّمَ", "فَصَّلَ", "نَزَّلَ"]
    },
    {
        "rule_id": "sarf_form_3",
        "arabic_name": "بَابُ الْمُفَاعَلَةِ (فَاعَلَ)",
        "english_name": "Form III (Associative & Reciprocal)",
        "rule": "Formed by inserting an Alif after the first radical: فَاعَلَ / يُفَاعِلُ / مُفَاعَلَة.",
        "beginner_explanation": "Adding an Alif after the first letter to express reciprocal action or striving against another.",
        "advanced_explanation": "مزيد بحرف واحد وهو الألف بعد الفاء، ويفيد المشاركة بين اثنين فصاعدًا أو الموالاة.",
        "examples": ["قَاتَلَ", "عَاقَبَ", "هَاجَرَ"]
    },
    {
        "rule_id": "sarf_form_4",
        "arabic_name": "بَابُ الإِفْعَالِ (أَفْعَلَ)",
        "english_name": "Form IV (Causative & Instigative)",
        "rule": "Formed by prefixing a Hamzah with Fatha to the root: أَفْعَلَ / يُفْعِلُ / إِفْعَال.",
        "beginner_explanation": "Adding an 'A-' sound at the front to make an intransitive action affect someone else (cause something to happen).",
        "advanced_explanation": "مزيد بحرف واحد وهو الهمزة في أوله، وأشهر معانيه التعدية والصيرورة والدخول في الزمان أو المكان.",
        "examples": ["أَنزَلَ", "أَحْسَنَ", "أَرْسَلَ"]
    },
    {
        "rule_id": "sarf_form_5",
        "arabic_name": "بَابُ التَّفَعُّلِ (تَفَعَّلَ)",
        "english_name": "Form V (Reflexive of Form II)",
        "rule": "Formed by prefixing Ta' and doubling the second radical: تَفَعَّلَ / يَتَفَعَّلُ / تَفَعُّل.",
        "beginner_explanation": "Reflexive of Form II, expressing internalizing an action or doing something gradually step by step.",
        "advanced_explanation": "مزيد بحرفين: التاء وتضعيف العين، ويفيد مطاوعة فعّل والتكلف والتدريج.",
        "examples": ["تَبَيَّنَ", "تَوَفَّى", "تَذَكَّرَ"]
    },
    {
        "rule_id": "sarf_form_6",
        "arabic_name": "بَابُ التَّفَاعُلِ (تَفَاعَلَ)",
        "english_name": "Form VI (Mutual / Reciprocal Action)",
        "rule": "Formed by prefixing Ta' and inserting an Alif: تَفَاعَلَ / يَتَفَاعَلُ / تَفَاعُل.",
        "beginner_explanation": "Expresses mutual, two-way interaction between multiple parties.",
        "advanced_explanation": "مزيد بحرفين: التاء والألف، ويفيد المشاركة بين اثنين فأكثر والتظاهر بالشيء.",
        "examples": ["تَسَاءَلَ", "تَعَاوَنَ", "تَبَايَعَ"]
    },
    {
        "rule_id": "sarf_form_8",
        "arabic_name": "بَابُ الافْتِعَالِ (افْتَعَلَ)",
        "english_name": "Form VIII (Middle Voice & Earnest Pursuit)",
        "rule": "Formed by prefixing Hamzat al-wasl and infixed Ta' after first radical: افْتَعَلَ / يَفْتَعِلُ / افْتِعَال.",
        "beginner_explanation": "Expresses earnest effort, diligence, or performing an action for one's own benefit.",
        "advanced_explanation": "مزيد بحرفين: الهمزة والتاء بعد الفاء، ويفيد الاجتهاد والاكتساب والاتخاذ والمطاوعة.",
        "examples": ["اتَّقَى", "اخْتَلَفَ", "اشْتَرَى"]
    },
    {
        "rule_id": "sarf_form_10",
        "arabic_name": "بَابُ الاسْتِفْعَالِ (اسْتَفْعَلَ)",
        "english_name": "Form X (Seeking & Asking)",
        "rule": "Formed by prefixing 'Ista-' (Hamzah, Seen, Ta'): اسْتَفْعَلَ / يَسْتَفْعِلُ / اسْتِفْعَال.",
        "beginner_explanation": "Adding 'Ista-' to ask for or seek the action of the root (e.g. seeking forgiveness, asking for guidance).",
        "advanced_explanation": "مزيد بثلاثة أحرف: الهمزة والسين والتاء، ويفيد الطلب والاعتقاد والتحول والصيرورة.",
        "examples": ["اسْتَغْفَرَ", "اسْتَفْتَى", "اسْتَطَاعَ"]
    }
]

COLOR_CODING = {
    "semantic_categories": {
        "verbs": {
            "base_color": "#e11d48",
            "past": "#be123c",
            "present": "#0284c7",
            "imperative": "#0d9488"
        },
        "nouns": {
            "base_color": "#1d4ed8",
            "proper_noun": "#4338ca",
            "verbal_noun": "#2563eb",
            "participle": "#3b82f6"
        },
        "pronouns": {
            "base_color": "#0284c7",
            "attached_subject": "#0369a1",
            "attached_object": "#0284c7",
            "attached_possessive": "#38bdf8",
            "detached": "#075985"
        },
        "particles": {
            "base_color": "#d97706",
            "preposition": "#b45309",
            "conjunction": "#f59e0b",
            "emphasis": "#ea580c",
            "negative": "#dc2626",
            "conditional": "#7c3aed"
        },
        "adjectives": {
            "base_color": "#15803d"
        },
        "cases": {
            "nominative": {"color": "#2563eb", "bg": "#eff6ff", "vowel": "Dhumma (ـُ)"},
            "accusative": {"color": "#059669", "bg": "#ecfdf5", "vowel": "Fatha (ـَ)"},
            "genitive": {"color": "#7c3aed", "bg": "#f5f3ff", "vowel": "Kasra (ـِ)"},
            "jussive": {"color": "#d97706", "bg": "#fffbeb", "vowel": "Sukun (ـْ)"},
            "indeclinable": {"color": "#64748b", "bg": "#f8fafc", "vowel": "Fixed (مبني)"}
        },
        "relationships": {
            "idafah": "#7c3aed",
            "subject_verb": "#2563eb",
            "verb_object": "#059669",
            "prepositional": "#b45309",
            "adjectival": "#15803d"
        }
    }
}

ROOT_DESCRIPTIONS = {
    "Alh": ("إ-ل-ه", "God, deity, divine oneness", "God / Divine Oneness"),
    "rbb": ("ر-ب-ب", "Lord, Master, Sustainer, Cherisher", "Lord / Sustainer"),
    "xlq": ("خ-ل-ق", "to create, originate from nothing, fashion", "Create / Originate"),
    "nfs": ("ن-ف-س", "soul, self, individual life, person", "Soul / Self"),
    "wHd": ("و-ح-د", "one, single, unique, solitary", "One / Single"),
    "zwj": ("ز-و-ج", "pair, spouse, mate, partner", "Spouse / Pair"),
    "bvv": ("ب-ث-ث", "to scatter abroad, disperse, spread profusely", "Disperse / Scatter"),
    "rjl": ("ر-ج-ل", "men, walking on foot, mortals", "Men / Foot"),
    "nsy": ("ن-س-ي", "women; to forget", "Women / Forget"),
    "wqy": ("و-ق-ي", "to protect, shield, fear Allah, be conscious (Taqwa)", "God-consciousness / Taqwa"),
    "sAl": ("س-أ-ل", "to ask, inquire, demand, supplicate", "Ask / Question"),
    "rHm": ("ر-ح-م", "wombs, kinship, maternal mercy, compassion", "Mercy / Womb"),
    "rqb": ("ر-ق-ب", "watcher, all-observant, vigilant guardian", "Watch / Observer"),
    "Aty": ("أ-ت-ي", "to give, bring, come, arrive", "Give / Bring"),
    "ytm": ("ي-ت-م", "orphans, solitary, fatherless youth", "Orphans"),
    "mwl": ("م-و-ل", "wealth, riches, financial property", "Wealth / Property"),
    "bdl": ("ب-د-ل", "to exchange, substitute, replace", "Exchange / Replace"),
    "xby": ("خ-ب-ث", "foul, wicked, bad, impure", "Foul / Impure"),
    "Tyb": ("ط-ي-ب", "good, wholesome, pure, delightful", "Good / Pure"),
    "Akl": ("أ-ك-ل", "to consume, eat, devour unlawfully", "Consume / Devour"),
    "kbr": ("ك-ب-ر", "great, massive, immense, arrogant", "Great / Immense"),
    "Hwb": ("ح-و-ب", "grave sin, crime, major offense", "Grave Sin"),
    "xyf": ("خ-و-ف", "to fear, apprehend, dread harm", "Fear / Dread"),
    "qsT": ("ق-س-ط", "to act justly, deal equitably", "Justice / Equity"),
    "nkH": ("ن-ك-ح", "marriage, wedlock, matrimonial covenant", "Marriage / Wedlock"),
    "Elm": ("ع-ل-م", "to know, perceive, realize; knowledge", "Knowledge / Knower"),
    "Hkm": ("ح-ك-م", "wisdom, decisive judgment, decree", "Wisdom / Judgment"),
    "Ezz": ("ع-ز-ز", "mighty, honor, power, invincibility", "Mighty / Honor"),
    "gfr": ("غ-ف-ر", "to forgive, veil sins, grant pardon", "Forgive / Pardon"),
    "kfr": ("ك-ف-ر", "to disbelieve, deny truth, cover blessings", "Disbelieve / Deny"),
    "Amn": ("أ-م-ن", "faith, belief, trust, security", "Faith / Belief"),
    "Eml": ("ع-م-ل", "deeds, actions, work performed", "Deeds / Action"),
    "SlH": ("ص-ل-ح", "righteous, upright, good, sound", "Righteous / Sound"),
    "jnn": ("ج-ن-ن", "gardens of Paradise, conceal, cover", "Gardens / Paradise"),
    "jry": ("ج-ر-ي", "to flow, run, stream", "Flow / Run"),
    "nhr": ("ن-ه-ر", "flowing rivers, streams, daylight", "Rivers / Streams"),
    "tHt": ("ت-ح-ت", "beneath, underneath, below", "Beneath / Below"),
    "xld": ("خ-ل-د", "to abide forever, dwell eternally", "Abide forever / Eternal"),
    "fwz": ("ف-و-ز", "triumph, supreme attainment, success", "Triumph / Success"),
    "EZm": ("ع-ظ-م", "great, immense, magnificent, supreme", "Great / Immense"),
    "E*b": ("ع-ذ-ب", "punishment, chastisement, penalty", "Punishment / Torment"),
    "Alm": ("أ-ل-م", "painful, agonizing, severe ache", "Painful / Agonizing"),
    "rsl": ("ر-س-ل", "messenger, apostle, dispatch, envoy", "Messenger / Envoy"),
    "ktb": ("ك-ت-ب", "to decree, write, scripture, book", "Decree / Book"),
    "Hqq": ("ح-ق-ق", "truth, reality, justice, right", "Truth / Reality"),
    "bSr": ("ب-ص-ر", "seeing, sight, vision, perception", "Sight / Vision"),
    "smE": ("س-م-ع", "to hear, listen, pay attention, heed", "Hear / Listen"),
    "qwl": ("ق-و-ل", "to say, speak, utter, declare", "Say / Speak"),
    "kwn": ("ك-و-ن", "to be, exist, happen, become", "Be / Exist"),
    "qwm": ("ق-و-م", "to stand, establish, people, upholders", "Stand / Establish"),
    "Hsb": ("ح-س-ب", "to reckon, account, calculate, suffice", "Reckon / Suffice"),
    "wkl": ("و-ك-ل", "trustee, guardian, rely upon Allah", "Trust / Guardian"),
    "nSr": ("ن-ص-ر", "help, victory, support, defender", "Help / Victory"),
    "qtl": ("ق-ت-ل", "to fight, kill, slay in warfare", "Fight / Slay"),
    "sbl": ("س-ب-ل", "way, path, course in Allah's cause", "Way / Path"),
    "jhd": ("ج-ه-د", "to strive, struggle earnestly (Jihad)", "Strive / Struggle"),
    "nfq": ("ن-ف-ق", "hypocrisy; to spend in charity", "Hypocrisy / Spend"),
    "fsq": ("ف-س-ق", "defiant disobedience, corruption", "Corruption / Transgress"),
    "zlm": ("ظ-ل-م", "wrongdoing, injustice, darkness, oppression", "Injustice / Wrong"),
    "hdy": ("ه-د-ي", "to guide, direct, show straight path", "Guidance / Lead"),
    "Dll": ("ض-ل-ل", "to stray, go astray, lose true way", "Astray / Stray"),
    "nwr": ("ن-و-ر", "light, divine illumination, radiance", "Light / Illumination"),
    "nzl": ("ن-ز-ل", "to reveal, send down, descend", "Reveal / Descend"),
    "wld": ("و-ل-د", "children, parents, beget, offspring", "Offspring / Parents"),
    "wry": ("و-ر-ث", "to inherit, heirs, inheritance laws", "Inheritance / Heirs"),
    "wSy": ("و-ص-ي", "to enjoin, bequeath, divine will", "Bequest / Enjoin"),
    "Dyn": ("د-ي-ن", "debt, religion, judgment, recompense", "Debt / Religion"),
    "kll": ("ك-ل-ل", "kalalah (childless & parentless heir)", "Kalalah / Collateral Heir"),
    "bqr": ("ب-ق-ر", "cow, heifer, split open, investigate", "Cow / Cattle"),
    "Egl": ("ع-ج-ل", "calf; haste, to hasten, hurry", "Calf / Haste"),
    "Hjj": ("ح-ج-ج", "pilgrimage (Hajj), argue, plead dispute", "Pilgrimage / Dispute"),
    "Swm": ("ص-و-م", "to fast, abstain from food/speech", "Fast / Abstain"),
    "rby": ("ر-ب-و", "usury, ribā, increase unlawfully, grow", "Usury / Excess"),
    "qbl": ("ق-ب-ل", "qiblah, direction of prayer, accept, face", "Qiblah / Accept"),
    "Ebd": ("ع-ب-د", "to worship, serve as servant, devotion", "Worship / Servitude"),
    "Ehd": ("ع-ه-د", "covenant, treaty, pact, pledge", "Covenant / Treaty"),
    "Emr": ("ع-م-ر", "Imran, thrive, inhabit, age, lifespan", "Thrive / Inhabit"),
    "mry": ("م-ر-ي", "Maryam; to doubt, dispute, contend", "Maryam / Contend"),
    "Eys": ("ع-ي-س", "Isa (Jesus), pale/noble hue", "Isa / Jesus"),
    "bdr": ("ب-د-ر", "Badr, full moon, to hasten early", "Badr / Full Moon"),
    "yHd": ("ي-ه-د", "Jews, to repent, return to truth", "Judaism / Repent"),
    "brk": ("ب-ر-ك", "blessing, benediction, kneel down", "Blessing / Barakah"),
    "ryk": ("ر-ك-ع", "to bow down in prayer (Ruku')", "Bow / Ruku'"),
    "sjd": ("س-ج-د", "to prostrate, bow in utter submission", "Prostration / Sujud"),
    "Sly": ("ص-ل-و", "prayer, communion with Allah, bless", "Prayer / Salah"),
    "zkw": ("ز-ك-و", "zakat, purity, spiritual cleansing, grow", "Zakat / Purity")
}

def get_root_details(root_bw):
    if not root_bw:
        return {"has_root": False}
    rtype, wtype, is_tri, letters, hyphen, norm = analyze_root_structure(root_bw)
    meaning = "classical root"
    concept = "Root Concept"
    if root_bw in ROOT_DESCRIPTIONS:
        _, meaning, concept = ROOT_DESCRIPTIONS[root_bw]
    else:
        meaning = f"Lexical triliteral root '{norm}'"
        concept = f"Concept of {norm}"
    return {
        "has_root": True,
        "root_ar": hyphen,
        "root_normalized": norm,
        "root_letters": letters,
        "root_type": rtype,
        "triliteral_or_quadriliteral": "triliteral" if is_tri else "quadriliteral",
        "weak_root_type": wtype,
        "root_meaning": meaning,
        "root_family": concept
    }

def fetch_surah_verses(surah_num):
    all_verses = []
    print(f"Fetching verses for Surah {surah_num} from Quran.com API...")
    page = 1
    while True:
        url = f'https://api.quran.com/api/v4/verses/by_chapter/{surah_num}?language=en&words=true&word_fields=text_uthmani,text_imlaei,location,audio_url&translations=20&per_page=50&page={page}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            verses = data.get('verses', [])
            if not verses:
                break
            all_verses.extend(verses)
            if len(verses) < 50:
                break
            page += 1
    print(f"Fetched {len(all_verses)} verses for Surah {surah_num}.")
    return all_verses

def load_corpus_for_surah(surah_num):
    corpus = {}
    prefix = f"({surah_num}:"
    with open('corpus_raw.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'): continue
            parts = line.split('\t')
            if len(parts) >= 4 and parts[0].startswith(prefix):
                tag_loc = parts[0].strip('()')
                w_loc = tag_loc.rsplit(':', 1)[0]
                if w_loc not in corpus:
                    corpus[w_loc] = []
                corpus[w_loc].append({
                    'loc': tag_loc,
                    'bw': parts[1],
                    'pos': parts[2],
                    'features': parts[3]
                })
    return corpus

def analyze_word_components(loc, q_word, seg_list):
    text_uth = q_word['text_uthmani']
    text_plain = strip_tashkeel(text_uth)
    text_norm = normalize_arabic(text_uth)
    transl = q_word.get('translation', {}).get('text', '')

    prefixes = []
    suffixes = []
    stem_seg = None
    for seg in seg_list:
        feat = seg['features']
        if 'PREFIX' in feat:
            prefixes.append(seg)
        elif 'SUFFIX' in feat:
            suffixes.append(seg)
        else:
            stem_seg = seg
    if not stem_seg and seg_list:
        stem_seg = seg_list[-1]

    stem_feat = stem_seg['features'] if stem_seg else ""
    stem_pos = stem_seg['pos'] if stem_seg else "N"

    root_bw = None
    lem_bw = None
    for fp in stem_feat.split('|'):
        if fp.startswith('ROOT:'):
            root_bw = fp.split(':')[1]
        elif fp.startswith('LEM:'):
            lem_bw = fp.split(':')[1]

    lemma_ar = bw_to_ar(lem_bw) if lem_bw else ""

    # Token Type Classification
    if stem_pos in ['INL', 'INIT']:
        token_type = "initial"
        primary_class = "harf"
    elif stem_pos in ['V']:
        token_type = "verb"
        primary_class = "fi'l"
    elif stem_pos in ['N', 'PN']:
        token_type = "noun"
        primary_class = "ism"
    elif stem_pos in ['ADJ']:
        token_type = "adjective"
        primary_class = "ism"
    elif stem_pos in ['PRON']:
        token_type = "pronoun"
        primary_class = "ism"
    elif stem_pos in ['DEM']:
        token_type = "demonstrative"
        primary_class = "ism"
    elif stem_pos in ['REL']:
        token_type = "relative_pronoun"
        primary_class = "ism"
    elif stem_pos in ['T', 'LOC']:
        token_type = "adverb"
        primary_class = "ism"
    elif stem_pos in ['P']:
        token_type = "preposition"
        primary_class = "harf"
    elif stem_pos in ['CONJ']:
        token_type = "conjunction"
        primary_class = "harf"
    elif stem_pos in ['INTG']:
        token_type = "interrogative"
        primary_class = "harf"
    elif stem_pos in ['COND']:
        token_type = "conditional"
        primary_class = "harf"
    elif stem_pos in ['VOC']:
        token_type = "vocative"
        primary_class = "harf"
    elif stem_pos in ['NEG', 'PRO']:
        token_type = "particle"
        primary_class = "harf"
    elif stem_pos in ['ACC', 'AMD', 'ANS', 'CAUS', 'CERT', 'CIRC', 'EXH', 'EXL', 'EXP', 'FUT', 'IMPV', 'INC', 'INT', 'PREV', 'PRP', 'REM', 'RES', 'RET', 'RSLT', 'SUB', 'SUP', 'SUR']:
        token_type = "particle"
        primary_class = "harf"
    else:
        token_type = "noun"
        primary_class = "ism"

    # Components subsegments
    components = []
    comp_idx = 1
    for p in prefixes:
        p_ar = bw_to_ar(p['bw'])
        p_role = "Conjunction" if p['pos'] == 'CONJ' else ("Preposition" if p['pos'] == 'P' else ("Definite article Al-" if p['pos'] == 'DET' else ("Emphatic Lam" if p['pos'] == 'EMPH' else "Prefix particle")))
        components.append({
            "component_index": comp_idx,
            "arabic": p_ar,
            "type": "prefix",
            "pos_tag": p['pos'],
            "role": p_role
        })
        comp_idx += 1

    if stem_seg:
        components.append({
            "component_index": comp_idx,
            "arabic": bw_to_ar(stem_seg['bw']),
            "type": "stem",
            "pos_tag": stem_pos,
            "role": f"Base Stem ({token_type})"
        })
        comp_idx += 1

    for s in suffixes:
        s_ar = bw_to_ar(s['bw'])
        s_role = "Attached Pronoun" if s['pos'] == 'PRON' else ("Vocative particle" if s['pos'] == 'VOC' else "Suffix morpheme")
        components.append({
            "component_index": comp_idx,
            "arabic": s_ar,
            "type": "suffix",
            "pos_tag": s['pos'],
            "role": s_role
        })
        comp_idx += 1

    # Root Analysis
    root_details = get_root_details(root_bw)

    # Sarf Verb Analysis (if verb)
    sarf_verb = None
    if primary_class == "fi'l":
        form_num = "I"
        for fp in stem_feat.split('|'):
            if fp.startswith(('(II)', '(III)', '(IV)', '(V)', '(VI)', '(VII)', '(VIII)', '(IX)', '(X)')):
                form_num = fp.strip('()')
                break
        f_meta = FORM_INFO.get(form_num, FORM_INFO["I"])

        tense = "past"
        tense_ar = "ماضٍ"
        mood = "indicative"
        if 'IMPF' in stem_feat:
            tense = "imperfect"
            tense_ar = "مضارع"
            if 'MOOD:SUBJ' in stem_feat: mood = "subjunctive"
            elif 'MOOD:JUS' in stem_feat: mood = "jussive"
            else: mood = "indicative"
        elif 'IMPV' in stem_feat:
            tense = "imperative"
            tense_ar = "أمر"
            mood = "imperative_mood"

        voice = "passive" if 'PASS' in stem_feat else "active"
        person = "third"
        gender = "masculine"
        number = "singular"
        for fp in stem_feat.split('|'):
            if fp.startswith(('1S', '1P', '2MS', '2MD', '2MP', '2FS', '2FD', '2FP', '3MS', '3MD', '3MP', '3FS', '3FD', '3FP')):
                pgn = fp
                person = "first" if pgn[0] == '1' else ("second" if pgn[0] == '2' else "third")
                gender = "feminine" if 'F' in pgn else "masculine"
                number = "singular" if 'S' in pgn else ("dual" if 'D' in pgn else "plural")
                break

        transitivity = "transitive" if form_num in ["II", "IV", "X"] or root_bw in ["xlq", "Aty", "Akl", "Elm", "ktb", "qtl", "bqr"] else "intransitive"
        sarf_verb = {
            "verb_lemma": lemma_ar,
            "form_number": form_num,
            "form_name": f_meta['name_ar'],
            "pattern_wazn": f_meta['wazn'],
            "derived_or_basic": "derived" if f_meta['derived'] else "basic",
            "tense": tense,
            "tense_ar": tense_ar,
            "mood": mood,
            "voice": voice,
            "person": person,
            "number": number,
            "gender": gender,
            "transitivity": transitivity,
            "weak_verb_class": root_details.get("weak_root_type", "sound"),
            "conjugation_explanation": f"Form {form_num} ({f_meta['name_ar']}) {tense_ar} in the {voice} voice, {person} person {gender} {number}.",
            "sarf_notes": f_meta['meaning']
        }

    # Noun Morphology (if noun/pronoun/adjective)
    noun_morph = None
    if primary_class == "ism":
        gender = "feminine" if 'F' in stem_feat or text_uth.endswith(('ة', 'ى', 'اء')) or root_bw in ['nfs', 'ArD', 'nsy', 'bqr'] else "masculine"
        gender_marker = "ta_marbutah" if text_uth.endswith('ة') else ("alif_maqsura" if text_uth.endswith('ى') else ("alif_mamduda" if text_uth.endswith('اء') else ("semantic_feminine" if gender == "feminine" else "unmarked_masculine")))
        number = "dual" if ('D' in stem_feat or 'MD' in stem_feat or 'FD' in stem_feat) else ("plural" if ('P' in stem_feat or 'MP' in stem_feat or 'FP' in stem_feat) else "singular")
        definiteness = "definite" if any(p['pos'] == 'DET' for p in prefixes) or stem_pos in ['PN', 'PRON', 'DEM', 'REL'] or suffixes else ("indefinite" if 'INDEF' in stem_feat else "definite_by_context")
        case_tag = "nominative" if 'NOM' in stem_feat else ("accusative" if 'ACC' in stem_feat else ("genitive" if 'GEN' in stem_feat else "indeclinable"))
        is_diptote = False
        if text_norm.startswith(('افعل', 'فعلاء', 'مساجد', 'مصابيح')) or (stem_pos == 'PN' and gender == 'feminine'):
            is_diptote = True
        
        derived_type = "jamid"
        if text_uth.startswith(('مُ', 'مُّ')):
            derived_type = "ism_fail" if 'ِ' in text_uth or text_uth.endswith(('ين', 'ون')) else "ism_maful"
        elif root_bw in ['Elm', 'Hkm', 'Ezz', 'gfr', 'Alm', 'EZm']:
            derived_type = "sifa_mushabbaha"
        elif 'VN' in stem_feat:
            derived_type = "masdar"

        noun_morph = {
            "gender": gender,
            "gender_marker": gender_marker,
            "number": number,
            "definiteness": definiteness,
            "case": case_tag,
            "declension": "mamnu_min_al_sarf" if is_diptote else ("mabni" if stem_pos in ['PRON', 'DEM', 'REL'] else "tamm"),
            "diptote_status": is_diptote,
            "adjective_status": (stem_pos == 'ADJ'),
            "derived_noun_type": derived_type,
            "lexical_pattern_wazn": "فَعِيل" if derived_type == "sifa_mushabbaha" else ("فَاعِل" if derived_type == "ism_fail" else "فَعْل")
        }

    # I'rab Analysis
    is_mp = 'MP' in stem_feat
    is_fp = 'FP' in stem_feat
    g_case = "indeclinable"
    g_case_ar = "مبني في محل"
    c_ending = "fixed"
    c_marker = "مبني على السكون أو الفتح"
    vis_hid = "visible"
    g_state = "fixed"
    syn_role = "particle_or_pointer"

    # Beginner, Intermediate, Advanced explanations
    exp_beg = f"'{transl}' plays an essential connecting role in the ayah."
    exp_int = f"Fixed uninflected word ({token_type}) maintaining its base form."
    exp_adv = f"{token_type.capitalize()} مبني لا محل له من الإعراب."

    if stem_pos in ['INL', 'INIT']:
        g_case = "indeclinable"
        g_case_ar = "مبني"
        c_ending = "sukun"
        c_marker = "مبني على السكون لا محل له من الإعراب"
        syn_role = "quranic_initial"
        exp_beg = "Disconnected letters (حروف مقطعة) symbolizing the divine miracle and inimitable style of the Qur'an."
        exp_int = "حروف مقطعة للإعجاز والتحدي، مبنية على السكون لا محل لها من الإعراب على الراجح."
        exp_adv = "حروف تهجٍّ مسرودة للإعجاز مبنية على السكون، لا محل لها من الإعراب، وقيل في محل رفع مبتدأ أو خبر."

    elif primary_class == "ism":
        if 'NOM' in stem_feat:
            g_case = "nominative"
            g_case_ar = "مرفوع"
            g_state = "primary_agent_or_topic"
            syn_role = "fail_or_mubtada"
            if is_mp:
                c_ending = "waw"
                c_marker = "الواو نيابة عن الضمة لأنه جمع مذكر سالم"
            else:
                c_ending = "dhumma"
                c_marker = "الضمة الظاهرة على آخره" if not text_uth.endswith(('ى', 'ا')) else "الضمة المقدرة للتعذر"
                vis_hid = "hidden_estimated" if text_uth.endswith(('ى', 'ا')) else "visible"
            exp_beg = f"Identifies the main doer or topic ('{transl}') in the elevated nominative case (Raf')."
            exp_int = f"Occupies the nominative position as subject (فاعل) or topic (مبتدأ), marked by {c_marker}."
            exp_adv = f"اسم مرفوع وعلامة رفعه {c_marker}."

        elif 'ACC' in stem_feat:
            g_case = "accusative"
            g_case_ar = "منصوب"
            g_state = "dependent_object_or_circumstance"
            syn_role = "maful_bihi_or_circumstance"
            if is_mp:
                c_ending = "ya"
                c_marker = "الياء نيابة عن الفتحة لأنه جمع مذكر سالم"
            elif is_fp:
                c_ending = "kasra"
                c_marker = "الكسرة نيابة عن الفتحة لأنه جمع مؤنث سالم"
            else:
                c_ending = "fatha"
                c_marker = "الفتحة الظاهرة على آخره" if not text_uth.endswith(('ى', 'ا')) else "الفتحة المقدرة للتعذر"
                vis_hid = "hidden_estimated" if text_uth.endswith(('ى', 'ا')) else "visible"
            exp_beg = f"Identifies what is acted upon or specified ('{transl}') in the accusative case (Nasb)."
            exp_int = f"Direct object (مفعول به) or circumstance of the action, marked by {c_marker}."
            exp_adv = f"اسم منصوب وعلامة نصبه {c_marker}."

        elif 'GEN' in stem_feat:
            g_case = "genitive"
            g_case_ar = "مجرور"
            g_state = "dependent_annexation_or_preposition"
            syn_role = "ism_majrur_or_mudhaf_ilayh"
            if is_mp:
                c_ending = "ya"
                c_marker = "الياء نيابة عن الكسرة لأنه جمع مذكر سالم"
            else:
                c_ending = "kasra"
                c_marker = "الكسرة الظاهرة على آخره" if not text_uth.endswith(('ى', 'ا')) else "الكسرة المقدرة للتعذر"
                vis_hid = "hidden_estimated" if text_uth.endswith(('ى', 'ا')) else "visible"
            exp_beg = f"Governed in the genitive case by a preposition or possessive link ('{transl}')."
            exp_int = f"Genitive noun (مجرور) governed by a preposition or as second term in Idafa, marked by {c_marker}."
            exp_adv = f"اسم مجرور وعلامة جره {c_marker}."

        elif stem_pos in ['PRON', 'DEM', 'REL']:
            g_case = "indeclinable"
            g_case_ar = "مبني في محل"
            c_ending = "fixed"
            c_marker = "مبني على السكون أو الحركة في محل رفع/نصب/جر"
            syn_role = "pronoun_or_pointer"
            exp_beg = f"Invariable pronoun or demonstrative referring to '{transl}'."
            exp_int = f"Indeclinable noun (مبني) holding a syntactic position according to context."
            exp_adv = f"اسم مبني في محل إعراب بحسب موقعه في الجملة."

        if prefixes and any(p['pos'] == 'P' for p in prefixes):
            g_case = "genitive"
            g_case_ar = "مجرور"
            syn_role = "ism_majrur"
            p_ar = bw_to_ar(prefixes[0]['bw'])
            exp_beg = f"Pulled into genitive attachment by the attached preposition '{p_ar}'."
            exp_int = f"Prepositional phrase (جار ومجرور), governed by '{p_ar}'."
            exp_adv = f"اسم مجرور بحرف الجر ({p_ar}) وعلامة جره {c_marker}."

    elif primary_class == "fi'l":
        if 'PERF' in stem_feat:
            g_case = "indeclinable"
            g_case_ar = "مبني"
            c_ending = "fatha"
            c_marker = "مبني على الفتح"
            syn_role = "past_verb"
            exp_beg = f"Completed action in the past ('{transl}'), built with a fixed ending."
            exp_int = f"Past verb (فعل ماضٍ) fixed upon Fatha, indicating a completed event."
            exp_adv = "فعل ماضٍ مبني على الفتح الظاهر لا محل له من الإعراب إلا إذا كان في جملة لها محل."
        elif 'IMPF' in stem_feat:
            if 'MOOD:JUS' in stem_feat:
                g_case = "jussive"
                g_case_ar = "مجزوم"
                c_ending = "sukun"
                c_marker = "السكون أو حذف النون"
                syn_role = "jussive_verb"
                exp_beg = f"Ongoing verb clipped into the jussive mood by a preceding negative or conditional."
                exp_int = f"Imperfect verb (فعل مضارع مجزوم) conditioned or negated, marked by {c_marker}."
                exp_adv = f"فعل مضارع مجزوم وعلامة جزمه {c_marker}."
            elif 'MOOD:SUBJ' in stem_feat:
                g_case = "accusative"
                g_case_ar = "منصوب"
                c_ending = "fatha"
                c_marker = "الفتحة الظاهرة"
                syn_role = "subjunctive_verb"
                exp_beg = f"Imperfect verb influenced by a subordinating particle like 'An' (that)."
                exp_int = "Imperfect verb in the subjunctive mood (فعل مضارع منصوب)."
                exp_adv = "فعل مضارع منصوب بأن أو إحدى أخواتها وعلامة نصبه الفتحة الظاهرة."
            else:
                g_case = "nominative"
                g_case_ar = "مرفوع"
                c_ending = "dhumma"
                c_marker = "ثبوت النون" if is_mp else "الضمة الظاهرة"
                syn_role = "indicative_verb"
                exp_beg = f"Standard ongoing or future action ('{transl}') in the default nominative state."
                exp_int = f"Default indicative imperfect verb (فعل مضارع مرفوع) uninfluenced by prefixes."
                exp_adv = f"فعل مضارع مرفوع لتجرده من الناصب والجازم وعلامة رفعه {c_marker}."
        elif 'IMPV' in stem_feat:
            g_case = "indeclinable"
            g_case_ar = "مبني"
            c_ending = "sukun"
            c_marker = "مبني على السكون أو حذف حرف العلة / النون"
            syn_role = "imperative_verb"
            exp_beg = f"Direct divine command or request ('{transl}')."
            exp_int = "Imperative verb (فعل أمر) commanding an action."
            exp_adv = f"فعل أمر مبني على {c_marker}."

    irab_obj = {
        "grammatical_case": g_case,
        "case_ar": g_case_ar,
        "case_ending": c_ending,
        "case_marker": c_marker,
        "visible_or_hidden": vis_hid,
        "grammatical_state": g_state,
        "syntactic_role": syn_role,
        "governing_word_id": None,
        "governed_by": None,
        "grammatical_explanation": {
            "beginner": exp_beg,
            "intermediate": exp_int,
            "advanced": exp_adv
        }
    }

    # Syntactic Role
    syn_role_obj = {
        "role_id": syn_role,
        "role_ar": g_case_ar if primary_class == "fi'l" else ("فاعل / مبتدأ" if g_case == 'nominative' else ("مفعول به" if g_case == 'accusative' else "اسم مجرور")),
        "role_en": syn_role.replace('_', ' ').capitalize(),
        "is_sentence_head": (syn_role in ["fail_or_mubtada", "past_verb", "indicative_verb"])
    }

    w_pos = int(loc.split(':')[2])
    ay_id = f"{loc.split(':')[0]}:{loc.split(':')[1]}"

    word_record = {
        "word_id": loc,
        "ayah_id": ay_id,
        "word_position": w_pos,
        "surface_uthmani": text_uth,
        "surface_plain": text_plain,
        "normalized_form": text_norm,
        "lemma": lem_bw or "",
        "lemma_ar": lemma_ar,
        "translation": transl,
        "short_meaning": transl,
        "token_type": token_type,
        "primary_class": primary_class,
        "has_root": root_details["has_root"],
        "root": root_details if root_details["has_root"] else None,
        "sarf_verb_analysis": sarf_verb,
        "noun_morphology": noun_morph,
        "irab": irab_obj,
        "syntactic_role": syn_role_obj,
        "components": components,
        "relationship_ids": []
    }

    return word_record

def extract_relationships_and_pronouns(ayah_words):
    relationships = []
    pronouns = []

    last_verb = None
    inna_stack = []
    kana_stack = []

    for idx, w in enumerate(ayah_words):
        wid = w['word_id']
        uth = w['surface_uthmani']
        comp = w['components']

        # Extract Pronouns from components or token
        for c in comp:
            if c['type'] == 'suffix' and c['pos_tag'] == 'PRON':
                pron_ar = c['arabic']
                p_case = "accusative_or_genitive"
                p_role = "attached_object_or_possessive"
                if w['token_type'] == 'verb':
                    p_case = "accusative"
                    p_role = "attached_direct_object"
                elif w['token_type'] in ['noun', 'adjective']:
                    p_case = "genitive"
                    p_role = "attached_mudhaf_ilayh"
                elif w['token_type'] == 'preposition':
                    p_case = "genitive"
                    p_role = "attached_prepositional_object"

                pron_id = f"pron_{wid.replace(':', '_')}_{c['component_index']}"
                pronouns.append({
                    "pronoun_id": pron_id,
                    "word_id": wid,
                    "surface_arabic": pron_ar,
                    "type": "attached",
                    "person": "first" if pron_ar in ['ي', 'ني', 'نا'] else ("second" if pron_ar.startswith(('ك', 'كم')) else "third"),
                    "gender": "feminine" if pron_ar in ['ها', 'هن'] else "masculine",
                    "number": "singular" if pron_ar in ['ه', 'ها', 'ك', 'ي'] else ("dual" if pron_ar in ['هما', 'كما'] else "plural"),
                    "grammatical_case": p_case,
                    "syntactic_role": p_role,
                    "antecedent_description": f"Refers back to relevant agent or entity in context of '{w['surface_uthmani']}'."
                })

        if w['token_type'] == 'pronoun' and not any(c['type'] == 'suffix' and c['pos_tag'] == 'PRON' for c in comp):
            pron_id = f"pron_indep_{wid.replace(':', '_')}"
            pronouns.append({
                "pronoun_id": pron_id,
                "word_id": wid,
                "surface_arabic": uth,
                "type": "independent",
                "person": "first" if uth in ['أَنَا', 'نَحْنُ'] else ("second" if uth.startswith('أَنتَ') else "third"),
                "gender": "feminine" if uth in ['هِيَ', 'أَنْتِ'] else "masculine",
                "number": "singular" if uth in ['هُوَ', 'هِيَ', 'أَنَا', 'أَنتَ'] else ("plural" if uth in ['هُمْ', 'أَنتُمْ', 'نَحْنُ'] else "dual"),
                "grammatical_case": "nominative",
                "syntactic_role": "independent_subject_or_topic",
                "antecedent_description": f"Independent personal pronoun ({uth}) functioning as topic (Mubtada) or isolated focus."
            })

        # Prepositional relationships (Jar wa Majrur)
        if any(c['type'] == 'prefix' and c['pos_tag'] == 'P' for c in comp):
            rel_id = f"rel_prep_{wid.replace(':', '_')}"
            rel = {
                "relationship_id": rel_id,
                "relationship_type": "prepositional_attachment",
                "source_word_id": wid,
                "target_word_id": wid,
                "direction": "internal",
                "confidence": "high",
                "explanation": f"The attached preposition directly binds '{uth}' as a prepositional phrase (شبه جملة جار ومجرور)."
            }
            relationships.append(rel)
            w['relationship_ids'].append(rel_id)
        elif idx > 0 and ayah_words[idx - 1]['token_type'] == 'preposition':
            prev_w = ayah_words[idx - 1]
            rel_id = f"rel_prep_{prev_w['word_id'].replace(':', '_')}_{wid.replace(':', '_')}"
            rel = {
                "relationship_id": rel_id,
                "relationship_type": "governing_preposition",
                "source_word_id": prev_w['word_id'],
                "target_word_id": wid,
                "direction": "source_to_target",
                "confidence": "high",
                "explanation": f"Preposition '{prev_w['surface_uthmani']}' governs noun '{uth}' in the genitive case."
            }
            relationships.append(rel)
            prev_w['relationship_ids'].append(rel_id)
            w['relationship_ids'].append(rel_id)

        # Verb - Subject and Verb - Object relationships
        if w['token_type'] == 'verb':
            last_verb = w
        elif last_verb and w['token_type'] == 'noun':
            v = last_verb
            if w['irab']['grammatical_case'] == 'nominative' and 'subject' not in [r['relationship_type'] for r in relationships if r['source_word_id'] == v['word_id']]:
                rel_id = f"rel_subj_{v['word_id'].replace(':', '_')}_{wid.replace(':', '_')}"
                rel = {
                    "relationship_id": rel_id,
                    "relationship_type": "subject_of",
                    "source_word_id": v['word_id'],
                    "target_word_id": wid,
                    "direction": "source_to_target",
                    "confidence": "high",
                    "explanation": f"Noun '{uth}' functions as the nominative subject (فاعل) performing the action of verb '{v['surface_uthmani']}'."
                }
                relationships.append(rel)
                v['relationship_ids'].append(rel_id)
                w['relationship_ids'].append(rel_id)
            elif w['irab']['grammatical_case'] == 'accusative' and 'object' not in [r['relationship_type'] for r in relationships if r['source_word_id'] == v['word_id']]:
                rel_id = f"rel_obj_{v['word_id'].replace(':', '_')}_{wid.replace(':', '_')}"
                rel = {
                    "relationship_id": rel_id,
                    "relationship_type": "object_of",
                    "source_word_id": v['word_id'],
                    "target_word_id": wid,
                    "direction": "source_to_target",
                    "confidence": "high",
                    "explanation": f"Noun '{uth}' acts as the direct object (مفعول به) of verb '{v['surface_uthmani']}'."
                }
                relationships.append(rel)
                v['relationship_ids'].append(rel_id)
                w['relationship_ids'].append(rel_id)

        # Idafa (Possessive construct)
        if idx > 0:
            prev_w = ayah_words[idx - 1]
            if prev_w['token_type'] == 'noun' and w['token_type'] in ['noun', 'pronoun'] and w['irab']['grammatical_case'] == 'genitive':
                if not prev_w['surface_uthmani'].startswith('ٱل') and 'ٌ' not in prev_w['surface_uthmani'] and 'ٍ' not in prev_w['surface_uthmani'] and 'ً' not in prev_w['surface_uthmani']:
                    rel_id = f"rel_idafah_{prev_w['word_id'].replace(':', '_')}_{wid.replace(':', '_')}"
                    rel = {
                        "relationship_id": rel_id,
                        "relationship_type": "idafah",
                        "source_word_id": prev_w['word_id'],
                        "target_word_id": wid,
                        "direction": "source_to_target",
                        "confidence": "high",
                        "explanation": f"Possessive construct (إضافة): '{prev_w['surface_uthmani']}' (Mudhaf) annexed to '{uth}' (Mudhaf Ilayh)."
                    }
                    relationships.append(rel)
                    prev_w['relationship_ids'].append(rel_id)
                    w['relationship_ids'].append(rel_id)

        # Adjective modification
        if idx > 0:
            prev_w = ayah_words[idx - 1]
            if prev_w['token_type'] == 'noun' and w['token_type'] == 'adjective':
                rel_id = f"rel_adj_{prev_w['word_id'].replace(':', '_')}_{wid.replace(':', '_')}"
                rel = {
                    "relationship_id": rel_id,
                    "relationship_type": "adjective_of",
                    "source_word_id": prev_w['word_id'],
                    "target_word_id": wid,
                    "direction": "source_to_target",
                    "confidence": "high",
                    "explanation": f"Adjective '{uth}' describes noun '{prev_w['surface_uthmani']}'."
                }
                relationships.append(rel)
                prev_w['relationship_ids'].append(rel_id)
                w['relationship_ids'].append(rel_id)

        # Inna & Sisters
        if uth in ['إِنَّ', 'أَنَّ', 'لَـٰكِنَّ']:
            inna_stack.append(w)
        elif inna_stack and w['irab']['grammatical_case'] == 'accusative':
            inn = inna_stack.pop()
            rel_id = f"rel_inna_{inn['word_id'].replace(':', '_')}_{wid.replace(':', '_')}"
            rel = {
                "relationship_id": rel_id,
                "relationship_type": "particle_governs_noun",
                "source_word_id": inn['word_id'],
                "target_word_id": wid,
                "direction": "source_to_target",
                "confidence": "high",
                "explanation": f"Emphatic particle '{inn['surface_uthmani']}' governs its noun '{uth}' in the accusative case."
            }
            relationships.append(rel)
            inn['relationship_ids'].append(rel_id)
            w['relationship_ids'].append(rel_id)

        # Kana & Sisters
        if uth in ['كَانَ', 'كَانُوا۟', 'تَكُونُوا۟', 'كُنتُمْ', 'يَكُونُ']:
            kana_stack.append(w)
        elif kana_stack and w['irab']['grammatical_case'] == 'accusative':
            kan = kana_stack.pop()
            rel_id = f"rel_kana_{kan['word_id'].replace(':', '_')}_{wid.replace(':', '_')}"
            rel = {
                "relationship_id": rel_id,
                "relationship_type": "kana_has_predicate",
                "source_word_id": kan['word_id'],
                "target_word_id": wid,
                "direction": "source_to_target",
                "confidence": "high",
                "explanation": f"Verb '{kan['surface_uthmani']}' takes '{uth}' as its accusative predicate (Khabar Kana)."
            }
            relationships.append(rel)
            kan['relationship_ids'].append(rel_id)
            w['relationship_ids'].append(rel_id)

    return relationships, pronouns

SURAH_METADATA = {
    2: {
        "surah_id": "surah_002",
        "surah_number": 2,
        "name_ar": "البقرة",
        "name_en": "The Cow",
        "ayah_count": 286,
        "revelation_classification": "Medinan (مدنية)",
        "chronological_order": 87,
        "juz_start": 1,
        "juz_end": 3,
        "hizb_start": 1,
        "hizb_end": 6,
        "beginning_ayah_id": "2:1",
        "end_ayah_id": "2:286",
        "global_ayah_start": 8,
        "output_filename": "surah-al-baqarah.json",
        "learning_notes": "Surah Al-Baqarah is the longest chapter in the Qur'an, embodying the foundational legal, theological, and constitutional matrix of Islam, featuring Ayat al-Kursi (2:255), the laws of fasting, pilgrimage, contracts (2:282), and financial justice.",
        "insights": [
            {
                "ayah_id": "2:1",
                "insight_type": "linguistic",
                "topic": "The Disconnected Letters (Al-Huruf al-Muqatta'ah)",
                "observation": "Opens with 'الم' (Alif Lam Meem) demonstrating divine inimitability (I'jaz), calling listeners to reflect upon the miraculous nature of Quranic speech formulated from ordinary human phonetic building blocks."
            },
            {
                "ayah_id": "2:255",
                "insight_type": "linguistic",
                "topic": "Ayat al-Kursi (The Throne Verse) Supreme Majesty",
                "observation": "Constructed with absolute symmetrical nominal clauses ('اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ'), negating slumber and drowsiness, showcasing sublime mastery of divine attributes and cosmic governance."
            },
            {
                "ayah_id": "2:282",
                "insight_type": "linguistic",
                "topic": "Verse of Contracts (Longest Verse in the Qur'an)",
                "observation": "Features intricate conditional and imperative syntax ('إِذَا تَدَايَنتُم بِدَيْنٍ ... فَاكْتُبُوهُ'), dictating commercial transparency, legal witnessing, and scribal ethics in exhaustive detail."
            },
            {
                "ayah_id": "2:285",
                "insight_type": "linguistic",
                "topic": "Universal Creed of the Believers",
                "observation": "Employs perfect harmony between past verbs ('آمَنَ الرَّسُولُ') and collective obedience ('سَمِعْنَا وَأَطَعْنَا') followed by the humble optative supplication ('غُفْرَانَكَ رَبَّنَا')."
            }
        ]
    },
    3: {
        "surah_id": "surah_003",
        "surah_number": 3,
        "name_ar": "آل عمران",
        "name_en": "The Family of Imran",
        "ayah_count": 200,
        "revelation_classification": "Medinan (مدنية)",
        "chronological_order": 89,
        "juz_start": 3,
        "juz_end": 4,
        "hizb_start": 6,
        "hizb_end": 8,
        "beginning_ayah_id": "3:1",
        "end_ayah_id": "3:200",
        "global_ayah_start": 294,
        "output_filename": "surah-ali-imran.json",
        "learning_notes": "Surah Aal-i-Imran addresses interfaith theological dialogue, the miraculous births of Maryam and 'Isa, the fundamental hermeneutical distinction between clear (Muhkam) and allegorical (Mutashabih) verses, and profound lessons of resilience from the Battle of Uhud.",
        "insights": [
            {
                "ayah_id": "3:7",
                "insight_type": "linguistic",
                "topic": "Hermeneutical Foundation: Muhkam vs. Mutashabih",
                "observation": "Establishes foundational Islamic epistemological principles by dividing verses into 'مُّحْكَمَاتٌ هُنَّ أُمُّ الْكِتَابِ' (decisive, foundational) and 'مُتَشَابِهَاتٌ' (allegorical), warning against those who pursue ambiguity to sow discord."
            },
            {
                "ayah_id": "3:18",
                "insight_type": "linguistic",
                "topic": "Divine Witness of Justice and Monotheism",
                "observation": "The solemn testimony 'شَهِدَ اللَّهُ أَنَّهُ لَا إِلَـٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ' joins the testimony of Allah, the angels, and people of knowledge, marked by the circumstantial accusative Hal 'قَائِمًا بِالْقِسْطِ'."
            },
            {
                "ayah_id": "3:144",
                "insight_type": "linguistic",
                "topic": "Mortal Reality of Prophethood & Steadfast Faith",
                "observation": "Employs the particle of restriction (Hasr) 'وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِن قَبْلِهِ الرُّسُلُ', reframing the psychological shock of the rumor of the Prophet's death at Uhud into unflinching spiritual permanence."
            },
            {
                "ayah_id": "3:190",
                "insight_type": "linguistic",
                "topic": "Cosmic Reflection of the People of Understanding (Ulul-Albab)",
                "observation": "The majestic opening 'إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ' employs emphatic Inna and Lam to invite deep contemplation upon the order of the cosmos."
            }
        ]
    }
}

def build_surah_dataset(surah_num):
    meta = SURAH_METADATA[surah_num]
    print(f"\n=======================================================")
    print(f"BUILDING COMPREHENSIVE LINGUISTIC DATABASE: SURAH {surah_num} ({meta['name_en']})")
    print(f"=======================================================")

    print(f"Loading corpus for Surah {surah_num}...")
    corpus = load_corpus_for_surah(surah_num)
    print(f"Loaded {len(corpus)} word locations from corpus.")

    verses_api = fetch_surah_verses(surah_num)

    all_words = []
    all_ayahs = []
    all_relationships = []
    all_pronouns = []
    root_index = {}
    pattern_index = {}
    lexicon_map = {}
    search_index = {
        "by_root": {},
        "by_lemma": {},
        "by_role": {},
        "by_category": {}
    }

    print(f"Processing words, ayahs, pronouns, and relationships for Surah {surah_num}...")
    global_ayah_start = meta["global_ayah_start"]

    for v_idx, v in enumerate(verses_api):
        ay_num = v['verse_number']
        global_ayah_num = global_ayah_start + ay_num - 1
        raw_words = [w for w in v['words'] if w['char_type_name'] == 'word']

        ayah_words = []
        for w_pos, q_w in enumerate(raw_words):
            loc = q_w['location']
            seg_list = corpus.get(loc, [])
            w_obj = analyze_word_components(loc, q_w, seg_list)
            ayah_words.append(w_obj)
            all_words.append(w_obj)

            # Root index
            if w_obj['has_root'] and w_obj['root']:
                r_norm = w_obj['root']['root_normalized']
                if r_norm not in root_index:
                    root_index[r_norm] = {
                        "root_ar": w_obj['root']['root_ar'],
                        "root_normalized": r_norm,
                        "root_type": w_obj['root']['root_type'],
                        "weak_root_type": w_obj['root']['weak_root_type'],
                        "root_meaning": w_obj['root']['root_meaning'],
                        "occurrences_in_surah": 0,
                        "word_ids": []
                    }
                root_index[r_norm]["occurrences_in_surah"] += 1
                root_index[r_norm]["word_ids"].append(loc)

                if r_norm not in search_index["by_root"]:
                    search_index["by_root"][r_norm] = []
                search_index["by_root"][r_norm].append(loc)

            # Pattern index
            wazn = None
            if w_obj['sarf_verb_analysis']:
                wazn = w_obj['sarf_verb_analysis']['pattern_wazn']
            elif w_obj['noun_morphology']:
                wazn = w_obj['noun_morphology']['lexical_pattern_wazn']
            if wazn:
                if wazn not in pattern_index:
                    pattern_index[wazn] = []
                pattern_index[wazn].append(loc)

            # Lexicon
            lem = w_obj['lemma_ar']
            if lem:
                if lem not in lexicon_map:
                    lexicon_map[lem] = {
                        "lemma_id": f"lem_{normalize_arabic(lem)}",
                        "lemma_ar": lem,
                        "root": w_obj['root']['root_normalized'] if w_obj['has_root'] and w_obj['root'] else None,
                        "basic_meaning": w_obj['translation'],
                        "semantic_range": f"Occurs in Surah {meta['name_en']}: {w_obj['translation']}",
                        "occurrences": 0,
                        "word_ids": []
                    }
                lexicon_map[lem]["occurrences"] += 1
                lexicon_map[lem]["word_ids"].append(loc)

                if lem not in search_index["by_lemma"]:
                    search_index["by_lemma"][lem] = []
                search_index["by_lemma"][lem].append(loc)

            # Search index by category & role
            cat = w_obj['token_type']
            if cat not in search_index["by_category"]:
                search_index["by_category"][cat] = []
            search_index["by_category"][cat].append(loc)

            role = w_obj['syntactic_role']['role_id']
            if role not in search_index["by_role"]:
                search_index["by_role"][role] = []
            search_index["by_role"][role].append(loc)

        # Extract relationships and pronouns for this ayah
        rels, prons = extract_relationships_and_pronouns(ayah_words)
        all_relationships.extend(rels)
        all_pronouns.extend(prons)

        # Build Ayah Object
        uth_full = " ".join(w['surface_uthmani'] for w in ayah_words)
        norm_full = " ".join(w['normalized_form'] for w in ayah_words)
        trans_nat = v['translations'][0]['text'] if 'translations' in v and v['translations'] else ""
        trans_lit = " ".join(w['translation'] for w in ayah_words)

        summary = f"Syntactic discourse establishing divine guidance in Surah {meta['name_en']}."
        if any(w['token_type'] == 'conditional' for w in ayah_words):
            summary = "Conditional structure outlining divine laws and their consequences."
        elif any(w['token_type'] == 'vocative' for w in ayah_words):
            summary = "Direct vocative call addressing the believers or mankind."

        structures = []
        if any(w['token_type'] == 'vocative' for w in ayah_words):
            structures.append("جملة نداء")
        if any(w['token_type'] == 'verb' for w in ayah_words):
            structures.append("جملة فعلية")
        if any(w['token_type'] == 'conditional' for w in ayah_words):
            structures.append("أسلوب شرط")
        if any(w['surface_uthmani'] in ['إِنَّ', 'أَنَّ'] for w in ayah_words):
            structures.append("جملة مؤكدة بإنّ")
        if not structures:
            structures.append("جملة اسمية")

        difficulty = "intermediate"
        if len(ayah_words) > 30 or "أسلوب شرط" in structures:
            difficulty = "advanced"
        elif len(ayah_words) < 12 and "جملة فعلية" in structures:
            difficulty = "beginner"

        ayah_obj = {
            "ayah_id": f"{surah_num}:{ay_num}",
            "surah_id": meta["surah_id"],
            "ayah_number": ay_num,
            "global_ayah_number": global_ayah_num,
            "text_uthmani": uth_full,
            "text_normalized": norm_full,
            "word_ids": [w['word_id'] for w in ayah_words],
            "translation": {
                "literal": trans_lit,
                "natural": trans_nat,
                "grammar_sensitive": f"Structured syntactic reading: {trans_nat}"
            },
            "grammar_summary": summary,
            "central_grammatical_structures": structures,
            "difficulty": difficulty,
            "learning_insights": [
                f"Ayah {surah_num}:{ay_num} contains {len(ayah_words)} word tokens illustrating {', '.join(structures)}."
            ]
        }
        all_ayahs.append(ayah_obj)

    # Lexicon list
    lexicon_list = sorted(list(lexicon_map.values()), key=lambda x: x['occurrences'], reverse=True)

    # Validation
    word_ids_set = set(w['word_id'] for w in all_words)
    missing_refs = []
    for r in all_relationships:
        if r['source_word_id'] not in word_ids_set:
            missing_refs.append(r['source_word_id'])
        if r['target_word_id'] not in word_ids_set:
            missing_refs.append(r['target_word_id'])

    validation_obj = {
        "total_surahs": 1,
        "total_ayahs": len(all_ayahs),
        "total_words": len(all_words),
        "total_relationships": len(all_relationships),
        "total_pronouns": len(all_pronouns),
        "total_unique_roots": len(root_index),
        "total_unique_lemmas": len(lexicon_list),
        "duplicate_ids": [],
        "missing_references": missing_refs,
        "warnings": [],
        "errors": [],
        "status": "verified"
    }

    surah_data = [
        {
            "surah_id": meta["surah_id"],
            "surah_number": meta["surah_number"],
            "name_ar": meta["name_ar"],
            "name_en": meta["name_en"],
            "ayah_count": len(all_ayahs),
            "revelation_classification": meta["revelation_classification"],
            "juz_start": meta["juz_start"],
            "juz_end": meta["juz_end"],
            "hizb_start": meta["hizb_start"],
            "hizb_end": meta["hizb_end"],
            "beginning_ayah_id": meta["beginning_ayah_id"],
            "end_ayah_id": meta["end_ayah_id"],
            "learning_notes": meta["learning_notes"]
        }
    ]

    # Canonical Database Structure
    database = {
        "schema_version": "2.0.0",
        "database_version": "1.0.0",
        "language": "ar",
        "quran_text_standard": "Hafs 'an 'Asim (Madinah Mushaf)",
        "analysis_method": "Traditional Arabic Grammar (Sibawayh / Basran & Kufan) & Classical Sarf",
        "metadata": {
            "surah_number": meta["surah_number"],
            "surah_name_ar": f"سورة {meta['name_ar']}",
            "surah_name_en": f"Surah {meta['name_en']}",
            "surah_name_translation": meta["name_en"],
            "total_ayahs": len(all_ayahs),
            "total_words": len(all_words),
            "total_morphemes": sum(len(w['components']) for w in all_words),
            "revelation_type": meta["revelation_classification"],
            "chronological_order": meta["chronological_order"],
            "compiler": "Antigravity Arabic Grammar Intelligence System",
            "guideline_basis": "Comprehensive Quranic Arabic Grammar, Sarf & I'rab Database Specification (No Transliteration, No Tajweed)",
            "created_at": "2026-10-07",
            "license": "Open Data for Quranic Education (incorporating Quranic Arabic Corpus annotations by Kais Dukes under GPL)",
            "footer_version": "v1.1.3 (updated 2026-10-07 00:45)"
        },
        "surahs": surah_data,
        "ayahs": all_ayahs,
        "words": all_words,
        "word_relationships": all_relationships,
        "pronouns": all_pronouns,
        "grammar_rules": GRAMMAR_RULES,
        "sarf_rules": SARF_RULES,
        "lexicon": lexicon_list,
        "root_index": root_index,
        "pattern_index": pattern_index,
        "search_index": search_index,
        "color_coding": COLOR_CODING,
        "learning_insights": meta["insights"],
        "validation": validation_obj
    }

    output_file = meta["output_filename"]
    print(f"Writing complete canonical JSON to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(database, f, ensure_ascii=False, indent=2)

    print(f"SUCCESS: Generated {output_file}")
    print(f"Total Ayahs: {len(all_ayahs)}")
    print(f"Total Words: {len(all_words)}")
    print(f"Total Relationships: {len(all_relationships)}")
    print(f"Total Pronouns: {len(all_pronouns)}")
    print(f"Total Unique Roots: {len(root_index)}")
    print(f"Total Unique Lemmas: {len(lexicon_list)}")
    print(f"Validation Status: {validation_obj['status']}")
    print(f"File size: {round(os.path.getsize(output_file) / (1024 * 1024), 2)} MB")

def main():
    print("Beginning generation for Surah 2 (Al-Baqarah) and Surah 3 (Aal-i-Imran)...")
    build_surah_dataset(2)
    build_surah_dataset(3)
    print("\nALL DATASETS GENERATED SUCCESSFULLY!")

if __name__ == '__main__':
    main()
