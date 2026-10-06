import json
import re
import urllib.request
import os

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

ROOT_DICT = {
    "$HH": ("ش-ح-ح", "stinginess, greed, covetousness of soul", "Greed / Covetousness"),
    "$hd": ("ش-ه-د", "to witness, testify, observe, bear evidence", "Witness / Testify"),
    "$kr": ("ش-ك-ر", "to thank, be grateful, appreciate favors", "Gratitude / Thankfulness"),
    "$yA": ("ش-ي-ء", "to will, wish; thing, entity, affair", "Thing / Will"),
    "*kr": ("ذ-ك-ر", "to remember, mention, remind, admonish", "Reminder / Remembrance"),
    "*ll": ("ذ-ل-ل", "humble, abased, humiliated, submissive", "Abased / Lowly"),
    "*wq": ("ذ-و-ق", "to taste, experience directly, suffer consequence", "Taste / Suffer"),
    "A*n": ("أ-ذ-ن", "permission, leave, sanction; ear", "Permission / Leave"),
    "AHd": ("أ-ح-د", "one, single, someone, anyone", "One / Anyone"),
    "Abd": ("ع-ب-د", "servant, slave, worshipper; to serve", "Servant / Worship"),
    "Afk": ("أ-ف-ك", "to turn away, delude, falsify, lie", "Deluded / Turned away"),
    "Ajl": ("أ-ج-ل", "appointed term, span of life, deadline", "Appointed Term"),
    "Ajr": ("أ-ج-ر", "reward, recompense, spiritual compensation", "Reward / Recompense"),
    "Alh": ("إ-ل-ه", "God, deity, worshipped entity, Allah", "God / Deity"),
    "Alm": ("أ-ل-م", "painful, agonizing, severe ache", "Painful / Agonizing"),
    "Amn": ("أ-م-ن", "faith, belief, trust, security, safety", "Faith / Belief"),
    "Amr": ("أ-م-ر", "command, decree, matter, ordinance", "Command / Decree"),
    "Any": ("أ-ن-ي", "time, approach, season, right moment", "Time / Moment"),
    "ArD": ("أ-ر-ض", "earth, ground, land, terrestrial sphere", "Earth / Land"),
    "Aty": ("أ-ت-ي", "to come, arrive, bring, bestow", "Come / Bring"),
    "Ax*": ("أ-خ-ذ", "to take, seize, capture, punish", "Take / Seize"),
    "Axr": ("أ-خ-ر", "to delay, postpone; last, other, akhirah", "Delay / Last"),
    "Ayy": ("ء-ي-ي", "sign, miracle, proof, divine verse", "Sign / Verse"),
    "DEf": ("ض-ع-ف", "to multiply, double, fold; weak", "Multiply / Double"),
    "E*b": ("ع-ذ-ب", "punishment, chastisement, penalty, torment", "Punishment / Torment"),
    "EZm": ("ع-ظ-م", "great, immense, magnificent, supreme", "Great / Immense"),
    "Edw": ("ع-د-و", "enemy, hostility, transgression, foe", "Enemy / Hostility"),
    "Efw": ("ع-ف-و", "to pardon, overlook, waive punishment", "Pardon / Forbear"),
    "Ejb": ("ع-ج-ب", "to impress, astonish, admire, marvel", "Impress / Admire"),
    "Elm": ("ع-ل-م", "to know, perceive, realize, knowledge", "Knowledge / Know"),
    "Eln": ("ع-ل-ن", "open, manifest, public, announced", "Open / Public"),
    "Elw": ("ع-ل-و", "high, exalted, ascend, elevate", "Exalted / High"),
    "Eml": ("ع-م-ل", "to do, act, perform righteous deeds", "Deeds / Action"),
    "End": ("ع-ن-د", "presence, with, from, beside", "Presence / With"),
    "Ezz": ("ع-ز-ز", "mighty, honor, power, invincibility", "Honor / Might"),
    "H*r": ("ح-ذ-ر", "to beware, take caution, fear, guard against", "Beware / Caution"),
    "Hkm": ("ح-ك-م", "wisdom, judgment, decisive ordinance", "Wisdom / Judgment"),
    "Hlm": ("ح-ل-م", "forbearing, clement, patient, gentle", "Forbearing / Clement"),
    "Hmd": ("ح-م-د", "praise, laudation, gratitude, acclaim", "Praise / Laud"),
    "Hqq": ("ح-ق-ق", "truth, reality, justice, certainty", "Truth / Reality"),
    "Hsb": ("ح-س-ب", "to think, reckon, deem, calculate", "Think / Reckon"),
    "Hsn": ("ح-س-ن", "good, beautiful, excel, excellent loan", "Good / Excellent"),
    "SHb": ("ص-ح-ب", "companion, fellow, dweller, associate", "Companion / Associate"),
    "Sdd": ("ص-د-د", "to avert, obstruct, turn away, hinder", "Avert / Turn away"),
    "Sdq": ("ص-د-ق", "truthful, sincere; charity, sadaqah", "Charity / Truth"),
    "Sdr": ("ص-د-ر", "chest, bosom, interior thoughts, heart", "Chest / Bosom"),
    "SfH": ("ص-ف-ح", "to overlook, pardon gracefully, turn page", "Overlook / Forbear"),
    "SlH": ("ص-ل-ح", "righteous, upright, good, sound", "Righteous / Upright"),
    "Swb": ("ص-و-ب", "to afflict, strike, hit accurately", "Afflict / Strike"),
    "Swr": ("ص-و-ر", "to shape, fashion, form countenances", "Fashion / Shape"),
    "SyH": ("ص-ي-ح", "shout, cry, sudden loud blast", "Shout / Cry"),
    "Syr": ("ص-ي-ر", "ultimate destiny, return, final arrival", "Destiny / Return"),
    "TbE": ("ط-ب-ع", "to seal, imprint, stamp on hearts", "Seal / Stamp"),
    "TwE": ("ط-و-ع", "to obey, submit, comply willingly", "Obedience / Comply"),
    "b$r": ("ب-ش-ر", "mortal human being; glad tidings", "Mortal / Human"),
    "bAs": ("ب-أ-س", "adversity, distress, punishment, might", "Adversity / Might"),
    "bEv": ("ب-ع-ث", "to resurrect, raise from dead, send forth", "Resurrect / Raise"),
    "bSr": ("ب-ص-ر", "sight, vision, seeing, perception", "Sight / Vision"),
    "blg": ("ب-ل-غ", "clear conveyance, proclamation, reach", "Conveyance / Proclamation"),
    "byn": ("ب-ي-ن", "clear, manifest, plain evidence", "Clear / Plain"),
    "dxl": ("د-خ-ل", "to enter, admit, cause to go into", "Enter / Admit"),
    "fDD": ("ف-ض-ض", "to disperse, scatter away, break apart", "Disperse / Scatter"),
    "fEl": ("ف-ع-ل", "to do, act, execute, commit", "Do / Action"),
    "flH": ("ف-ل-ح", "to prosper, succeed, achieve salvation", "Prosper / Succeed"),
    "fqh": ("ف-ق-ه", "to comprehend, understand deeply", "Comprehend / Understand"),
    "fsq": ("ف-س-ق", "defiant disobedience, corruption, rebelliousness", "Disobedient / Rebellious"),
    "ftn": ("ف-ت-ن", "trial, test, examination, affliction", "Trial / Test"),
    "fwz": ("ف-و-ز", "triumph, supreme attainment, victory", "Triumph / Success"),
    "gbn": ("غ-ب-ن", "mutual loss and gain, outwit, deprivation", "Mutual Loss & Gain"),
    "gfr": ("غ-ف-ر", "to forgive, pardon, veil sins", "Forgive / Pardon"),
    "gny": ("غ-ن-ي", "self-sufficient, free of need, rich", "Self-sufficient / Rich"),
    "gyb": ("غ-ي-ب", "unseen, hidden, imperceptible realm", "Unseen / Hidden"),
    "hdy": ("ه-د-ي", "to guide, direct, show the true way", "Guide / Guidance"),
    "jmE": ("ج-م-ع", "to gather, assemble, bring together", "Gather / Assemble"),
    "jnn": ("ج-ن-ن", "gardens of Paradise, lush foliage, conceal", "Gardens / Paradise"),
    "jry": ("ج-ر-ي", "to flow, run, stream under gardens", "Flow / Run"),
    "jsm": ("ج-س-م", "bodies, physical forms, outward statures", "Bodies / Stature"),
    "jyA": ("ج-ي-ء", "to come, arrive, approach", "Come / Arrive"),
    "k*b": ("ك-ذ-ب", "to belie, deny truth, lie, falsify", "Belie / Deny"),
    "kbr": ("ك-ب-ر", "arrogant, proud, boastful, great", "Arrogant / Pride"),
    "kfr": ("ك-ف-ر", "to disbelieve, deny favors, cover truth", "Disbelieve / Deny"),
    "kll": ("ك-ل-ل", "all, every, total, entirety", "All / Every"),
    "kwn": ("ك-و-ن", "to be, exist, happen, become", "Be / Exist"),
    "lhw": ("ل-ه-و", "distraction, amusement, idle diversion", "Distraction / Diversion"),
    "lwy": ("ل-و-ي", "to twist, bend aside, turn away heads", "Twist / Turn away"),
    "mdn": ("م-د-ن", "city, Medina, settled dwelling", "City / Medina"),
    "mlk": ("م-ل-ك", "sovereignty, dominion, kingdom, possess", "Sovereignty / Dominion"),
    "mwl": ("م-و-ل", "wealth, riches, financial possessions", "Wealth / Possessions"),
    "mwt": ("م-و-ت", "death, die, demise, mortality", "Death / Die"),
    "nbA": ("ن-ب-أ", "news, tidings, momentous report", "News / Tidings"),
    "nfq": ("ن-ف-ق", "hypocrisy; to spend, expend in Allah's cause", "Spend / Hypocrisy"),
    "nfs": ("ن-ف-س", "soul, self, individual person, life", "Soul / Self"),
    "nhr": ("ن-ه-ر", "flowing rivers, streams, conduits of water", "Rivers / Streams"),
    "nwr": ("ن-و-ر", "light, divine illumination, radiance", "Light / Illumination"),
    "nzl": ("ن-ز-ل", "to reveal, send down, descend", "Reveal / Send down"),
    "qbl": ("ق-ب-ل", "before, prior; to accept, receive", "Before / Accept"),
    "qdr": ("ق-د-ر", "to measure, possess power, decree", "Measure / Power"),
    "qlb": ("ق-ل-ب", "heart, spiritual center, innermost core", "Heart / Core"),
    "qrD": ("ق-ر-ض", "to loan, advance credit; goodly loan", "Loan / Credit"),
    "qrb": ("ق-ر-ب", "to draw near, approach, be close", "Approach / Near"),
    "qtl": ("ق-ت-ل", "to fight, destroy, combat, slay", "Combat / Destroy"),
    "qwl": ("ق-و-ل", "to say, speak, utter, declare", "Say / Speak"),
    "qwm": ("ق-و-م", "people, nation, tribe, community; stand", "People / Stand"),
    "rAs": ("ر-أ-س", "heads, chief, top", "Heads / Top"),
    "rAy": ("ر-ء-ي", "to see, observe, look upon, consider", "See / Look"),
    "rHm": ("ر-ح-م", "mercy, compassion, maternal grace", "Mercy / Grace"),
    "rbb": ("ر-ب-ب", "Lord, Sustainer, Master, Cherisher", "Lord / Sustainer"),
    "rjE": ("ر-ج-ع", "to return, revert, go back", "Return / Revert"),
    "rsl": ("ر-س-ل", "messenger, envoy, apostle, dispatch", "Messenger / Envoy"),
    "rzq": ("ر-ز-ق", "provision, livelihood, divine sustenance", "Provision / Sustenance"),
    "sbH": ("س-ب-ح", "to glorify, extol, celebrate praise", "Glorify / Extol"),
    "sbl": ("س-ب-ل", "way, path, course in Allah's cause", "Way / Path"),
    "smE": ("س-م-ع", "to hear, listen, heed, pay attention", "Hear / Listen"),
    "smw": ("س-م-و", "heavens, skies, celestial realm", "Heavens / Skies"),
    "snd": ("س-ن-د", "to prop up, lean against, support", "Propped up / Lean"),
    "srr": ("س-ر-ر", "secret, conceal, inner mystery", "Secret / Conceal"),
    "swA": ("س-و-أ", "evil, wrongdoing, bad, harmful", "Evil / Bad"),
    "swy": ("س-و-ي", "equal, same, level, proportionate", "Equal / Same"),
    "tHt": ("ت-ح-ت", "underneath, beneath, below", "Underneath / Below"),
    "wbl": ("و-ب-ل", "evil consequence, disastrous outcome", "Evil consequence"),
    "wkl": ("و-ك-ل", "to trust, rely upon, entrust affairs", "Trust / Rely"),
    "wld": ("و-ل-د", "children, offspring, progeny", "Children / Offspring"),
    "wly": ("و-ل-ي", "ally, protector, friend; to turn away", "Ally / Turn away"),
    "wqy": ("و-ق-ي", "to protect, shield, be God-conscious (Taqwa)", "God-consciousness / Taqwa"),
    "x$b": ("خ-ش-ب", "timbers, wood, hollow propped logs", "Timbers / Wood"),
    "xbr": ("خ-ب-ر", "all-aware, fully cognizant, informed", "All-Aware / Cognizant"),
    "xld": ("خ-ل-د", "to abide eternally, remain forever", "Abide forever / Eternal"),
    "xlq": ("خ-ل-ق", "to create, originate, fashion from nothing", "Create / Originate"),
    "xrj": ("خ-ر-ج", "to emerge, bring out, exit", "Emerge / Bring out"),
    "xsr": ("خ-س-ر", "loss, bankruptcy, forfeit, loser", "Loss / Forfeit"),
    "xyr": ("خ-ي-ر", "better, superior, best, beneficial", "Better / Best"),
    "xzn": ("خ-ز-ن", "treasures, depositories, storehouses", "Treasures / Storehouses"),
    "ymn": ("ي-م-ن", "oaths, right hand, solemn pledges", "Oaths / Pledges"),
    "ysr": ("ي-س-ر", "easy, facilitate, smooth course", "Easy / Simple"),
    "ywm": ("ي-و-م", "day, momentous period, Day of Judgment", "Day / Period"),
    "zEm": ("ز-ع-م", "to claim, assert without proof, pretend", "Claim / Pretend"),
    "zwj": ("ز-و-ج", "spouses, partners, pairs, companions", "Spouses / Pairs")
}

def get_root_info(root_bw):
    if not root_bw:
        return None, None, None, []
    if root_bw in ROOT_DICT:
        ar_hyphen, desc, short_concept = ROOT_DICT[root_bw]
        letters = [bw_to_ar(c) for c in root_bw if c in BW_MAP]
        return ar_hyphen, desc, short_concept, letters
    ar = bw_to_ar(root_bw)
    letters = list(ar)
    hyphen = "-".join(letters)
    return hyphen, "classical triliteral root", ar, letters

FORM_MAP = {
    "(I)": ("Form I", "فَعَلَ", "Basic stem action"),
    "(II)": ("Form II", "فَعَّلَ", "Causative / Intensive action"),
    "(III)": ("Form III", "فَاعَلَ", "Associative / Reciprocal / Earnest effort"),
    "(IV)": ("Form IV", "أَفْعَلَ", "Causative / Transitive instigation"),
    "(V)": ("Form V", "تَفَعَّلَ", "Reflexive of Form II / Gradual inward action"),
    "(VI)": ("Form VI", "تَفَاعَلَ", "Mutual / Reciprocal collective interaction"),
    "(VII)": ("Form VII", "اِنْفَعَلَ", "Passive / Involuntary receptive action"),
    "(VIII)": ("Form VIII", "اِفْتَعَلَ", "Reflexive / Middle Voice / Earnest pursuit"),
    "(IX)": ("Form IX", "اِفْعَلَّ", "Acquiring color or physical attribute"),
    "(X)": ("Form X", "اِسْتَفْعَلَ", "Seeking, asking, or considering")
}

def analyze_soundness(root_bw):
    if not root_bw:
        return "sound", "صحيح"
    if "'" in root_bw or ">" in root_bw or "<" in root_bw or "A" in root_bw:
        return "sahih_mahmuz", "صحيح مهموز (Hamzated)"
    if len(root_bw) == 3 and root_bw[1] == root_bw[2]:
        return "sahih_muda'af", "صحيح مضعف (Geminated / Doubled)"
    if root_bw.startswith(('w', 'y')):
        return "mu'tal_mithal", "معتل مثال (First-weak / Assimilated)"
    if len(root_bw) == 3 and root_bw[1] in ('w', 'y'):
        return "mu'tal_ajwaf", "معتل أجوف (Second-weak / Hollow)"
    if root_bw.endswith(('w', 'y', 'Y')):
        return "mu'tal_naqis", "معتل ناقص (Third-weak / Defective)"
    return "sahih_salim", "صحيح سالم (Sound & Regular)"

COLOR_SCHEME = {
    "raf": {
        "case": "raf",
        "case_ar": "مرفوع (الرفع)",
        "vowel": "Dhumma (ـُ)",
        "color": "#2563eb",
        "bg": "#eff6ff",
        "border": "#3b82f6",
        "text": "#1e40af",
        "concept": "Elevation (الرفع) — Primary, independent, actor or initiator occupying the highest grammatical position."
    },
    "nasb": {
        "case": "nasb",
        "case_ar": "منصوب (النصب)",
        "vowel": "Fatha (ـَ)",
        "color": "#059669",
        "bg": "#ecfdf5",
        "border": "#10b981",
        "text": "#065f46",
        "concept": "Setting up / Erecting (النصب) — Dependency, subordination, acted-upon, and circumstantial detail."
    },
    "jarr": {
        "case": "jarr",
        "case_ar": "مجرور (الجر / الخفض)",
        "vowel": "Kasra (ـِ)",
        "color": "#7c3aed",
        "bg": "#f5f3ff",
        "border": "#8b5cf6",
        "text": "#5b21b6",
        "concept": "Dragging / Pulling down (الجر) — Attachment, dependency, prepositions, and possessive annexation (Idafa)."
    },
    "jazm": {
        "case": "jazm",
        "case_ar": "مجزوم (الجزم)",
        "vowel": "Sukun (ـْ)",
        "color": "#d97706",
        "bg": "#fffbeb",
        "border": "#f59e0b",
        "text": "#92400e",
        "concept": "Cutting / Clipping (الجزم) — Absence of vowel, decisive cutoff, commands, prohibitions, and conditions."
    },
    "mabni": {
        "case": "mabni",
        "case_ar": "مبني (البناء)",
        "vowel": "Fixed (مبني)",
        "color": "#64748b",
        "bg": "#f8fafc",
        "border": "#94a3b8",
        "text": "#334155",
        "concept": "Fixed base (المبني) — Invariable structural ending unaffected by preceding governing agents."
    }
}

POS_COLORS = {
    "ism": {"color": "#1d4ed8", "bg": "#dbeafe", "label": "Ism (Noun / Pronoun / Adjective)"},
    "fi'l": {"color": "#e11d48", "bg": "#ffe4e6", "label": "Fi'l (Verb)"},
    "harf": {"color": "#d97706", "bg": "#fef3c7", "label": "Harf (Particle)"}
}

NOUN_WAZN_MAP = {
    'منافقون': 'مُفَاعِلُونَ', 'منافقين': 'مُفَاعِلِينَ', 'رسول': 'فَعُول', 'رسولك': 'فَعُولكَ', 'رسوله': 'فَعُولهُ',
    'كاذبون': 'فَاعِلُونَ', 'كاذبين': 'فَاعِلِينَ', 'أيمان': 'أَفْعَال', 'جنة': 'فُعْلَة', 'سبيل': 'فَعِيل',
    'قلوب': 'فُعُول', 'أجسام': 'أَفْعَال', 'خشب': 'فُعُل', 'مسندة': 'مُفَعَّلَة', 'صيحة': 'فَعْلَة',
    'عدو': 'فَعُول', 'رءوس': 'فُعُول', 'مستكبرون': 'مُسْتَفْعِلُونَ', 'سواء': 'فَعَال', 'قوم': 'فَعْل',
    'فاسقين': 'فَاعِلِينَ', 'خزائن': 'فَعَائِل', 'سماوات': 'فَعَلَات', 'أرض': 'فَعْل', 'أعز': 'أَفْعَل',
    'أذل': 'أَفْعَل', 'عزة': 'فِعْلَة', 'مؤمنين': 'مُفْعِلِينَ', 'مؤمنون': 'مُفْعِلُونَ', 'أموال': 'أَفْعَال',
    'أولاد': 'أَفْعَال', 'خاسرون': 'فَاعِلُونَ', 'موت': 'فَعْل', 'أجل': 'فَعَل', 'صالحين': 'فَاعِلِينَ',
    'نفس': 'فَعْل', 'خبير': 'فَعِيل', 'غفور': 'فَعِيل', 'رحيم': 'فَعِيل', 'ملك': 'فُعْل', 'حمد': 'فَعْل',
    'شيء': 'فَعْل', 'قدير': 'فَعِيل', 'كافر': 'فَاعِل', 'مؤمن': 'مُفْعِل', 'بصير': 'فَعِيل', 'حق': 'فَعْل',
    'صور': 'فُعَل', 'مصير': 'مَفْعِل', 'أمر': 'فَعْل', 'وبال': 'فَعَال', 'عذاب': 'فَعَال', 'أليم': 'فَعِيل',
    'رسل': 'فُعُل', 'بينات': 'فَعِّلَات', 'بشر': 'فَعَل', 'غني': 'فَعِيل', 'حميد': 'فَعِيل', 'يسير': 'فَعِيل',
    'نور': 'فُعْل', 'يوم': 'فَعْل', 'جمع': 'فَعْل', 'تغابن': 'تَفَاعُل', 'جنات': 'فَعَلَات', 'أنهار': 'أَفْعَال',
    'فوز': 'فَعْل', 'عظيم': 'فَعِيل', 'أصحاب': 'أَفْعَال', 'نار': 'فَعَل', 'خالدين': 'فَاعِلِينَ', 'مصيبة': 'مُفْعِلَة',
    'إذن': 'فِعْل', 'قلب': 'فَعْل', 'عليم': 'فَعِيل', 'بلاغ': 'فَعَال', 'مبين': 'مُفْعِل', 'متوكلون': 'مُتَفَعِّلُونَ',
    'أزواج': 'أَفْعَال', 'حذر': 'فِعْل', 'فتنة': 'فِعْلَة', 'أجر': 'فَعْل', 'شح': 'فُعْل', 'مفلحون': 'مُفْعِلُونَ',
    'قرض': 'فَعْل', 'حسن': 'فَعَل', 'شكور': 'فَعُول', 'حليم': 'فَعِيل', 'عالم': 'فَاعِل', 'غيب': 'فَعْل',
    'شهادة': 'فَعَالَة', 'عزيز': 'فَعِيل', 'حكيم': 'فَعِيل', 'صدور': 'فُعُول', 'حسنة': 'فَعَلَة'
}

def clean_arabic_word(w):
    w = w.replace('ٰ', 'ا')
    w = re.sub(r'[ً-ٟۖ-ۭٓٔ]', '', w)
    w = w.replace('ٱ', 'ا').replace('ـ', '')
    w = w.replace('آ', 'ا').replace('إ', 'ا').replace('أ', 'ا')
    clean = re.sub(r'[^\w\s]', '', w).strip()
    for pref in ['وال', 'فال', 'بال', 'كال', 'لل', 'ال']:
        if clean.startswith(pref):
            clean = clean[len(pref):]
            break
    if len(clean) >= 3 and clean[0] in ['و', 'ف', 'ب', 'ك', 'ل']:
        clean = clean[1:]
    for suf in ['هم', 'كم', 'نا', 'ها', 'ه', 'ي', 'ك', 'ا', 'ون', 'ين', 'ات']:
        if len(clean) > len(suf) + 1 and clean.endswith(suf):
            clean = clean[:-len(suf)]
            break
    return clean

def deduce_wazn(primary_type, form, stem_pos, text_imlaei, text_clean):
    if primary_type == "fi'l":
        forms_verb = {
            'I': 'فَعَلَ', 'II': 'فَعَّلَ', 'III': 'فَاعَلَ', 'IV': 'أَفْعَلَ', 'V': 'تَفَعَّلَ',
            'VI': 'تَفَاعَلَ', 'VII': 'اِنْفَعَلَ', 'VIII': 'اِفْتَعَلَ', 'IX': 'اِفْعَلَّ', 'X': 'اِسْتَفْعَلَ'
        }
        return forms_verb.get(form, 'فَعَلَ')
    elif primary_type == 'ism':
        c_word = clean_arabic_word(text_clean)
        if c_word in NOUN_WAZN_MAP:
            return NOUN_WAZN_MAP[c_word]
        for k, v in NOUN_WAZN_MAP.items():
            if c_word == k or c_word.startswith(k) or k.startswith(c_word):
                return v
        if form and form in ['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'X']:
            forms_part_act = {
                'II': 'مُفَعِّل', 'III': 'مُفَاعِل', 'IV': 'مُفْعِل', 'V': 'مُتَفَعِّل',
                'VI': 'مُتَفَاعِل', 'VII': 'مُنْفَعِل', 'VIII': 'مُفْتَعِل', 'X': 'مُسْتَفْعِل'
            }
            forms_part_pass = {
                'II': 'مُفَعَّل', 'III': 'مُفَاعَل', 'IV': 'مُفْعَل', 'V': 'مُتَفَعَّل',
                'VI': 'مُتَفَاعَل', 'VII': 'مُنْفَعَل', 'VIII': 'مُفْتَعَل', 'X': 'مُسْتَفْعَل'
            }
            if 'ِ' in text_clean or text_clean.endswith(('ِرّ', 'ِع', 'ِر', 'دّكر', 'ين', 'ون')):
                return forms_part_act.get(form, 'مُفْعِل')
            return forms_part_pass.get(form, 'مُفْعَل')
        if text_clean.startswith('أ') and len(text_clean) >= 4:
            if text_clean.endswith(('ى', 'رّ', 'ر')):
                return 'أَفْعَل'
            return 'أَفْعَال'
        if text_clean.startswith('م') and len(text_clean) == 4:
            return 'مَفْعَل'
        if len(text_clean) == 4 and text_clean[2] == 'ي':
            return 'فَعِيل'
        if len(text_clean) == 4 and text_clean[1] == 'ا':
            return 'فَاعِل'
        if len(text_clean) == 5 and text_clean[1] == 'ا' and text_clean.endswith('ة'):
            return 'فَاعِلَة'
        if len(text_clean) == 3:
            return 'فَعْل'
    return None

def fetch_quran(ch):
    url = f'https://api.quran.com/api/v4/verses/by_chapter/{ch}?language=en&words=true&word_fields=text_uthmani,text_imlaei,location,audio_url&translations=20&per_page=50'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def load_corpus():
    corpus = {}
    with open('corpus_raw.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'): continue
            parts = line.split('\t')
            if len(parts) >= 4:
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

THEMATIC_SECTIONS_63 = [
    {
        "section_id": 1,
        "ayah_range": "1-4",
        "title_en": "The Deceit & True Character of the Hypocrites",
        "title_ar": "نفاق المنافقين وأوصافهم وصورهم الخادعة",
        "color": "#dc2626",
        "summary": "When the hypocrites come, they proclaim testimony with their tongues while their hearts belie it. They take oaths as shields and obstruct from Allah's path. Their bodies impress, yet they are like propped-up timbers, dreading every shout."
    },
    {
        "section_id": 2,
        "ayah_range": "5-8",
        "title_en": "Arrogance & Plotting Against the Believers",
        "title_ar": "استكبارهم وتآمرهم على المؤمنين وحقيقة العزة",
        "color": "#ea580c",
        "summary": "When urged to seek forgiveness from the Messenger, they twist their heads in haughty pride. They plot economic boycotts against the Prophet's companions and boast that the 'honorable' will expel the 'humiliated', unaware that true honor belongs exclusively to Allah, His Messenger, and the believers."
    },
    {
        "section_id": 3,
        "ayah_range": "9-11",
        "title_en": "Warning Against Distraction & Charity Before Death",
        "title_ar": "تحذير المؤمنين من الغفلة والحث على الإنفاق قبل الأجل",
        "color": "#16a34a",
        "summary": "Believers are warned never to let wealth or children divert them from Allah's remembrance. They must spend generously before death arrives suddenly, when a soul pleads in vain for a momentary delay; for Allah never postpones an appointed lifespan."
    }
]

THEMATIC_SECTIONS_64 = [
    {
        "section_id": 1,
        "ayah_range": "1-4",
        "title_en": "Cosmic Glorification, Sovereignty & Supreme Creation",
        "title_ar": "تسبيح الخلائق وعظمة الخالق وعلمه المحيط",
        "color": "#2563eb",
        "summary": "All things in the heavens and the earth celebrate Allah's glory. Sovereignty and praise belong entirely to Him. He created mankind into believers and deniers, shaped humanity in consummate balance, and knows whatever is concealed in the heavens, earth, and human hearts."
    },
    {
        "section_id": 2,
        "ayah_range": "5-7",
        "title_en": "The Fate of Ancient Deniers & The Reality of Resurrection",
        "title_ar": "عاقبة المكذبين وحتمية البعث والجزاء",
        "color": "#d97706",
        "summary": "Warnings from past destroyed civilizations who tasted the bitter harvest of rejection. Disbelievers audaciously presume they will never be resurrected; the Prophet is commanded to swear by his Lord that they will surely be raised and informed of every action."
    },
    {
        "section_id": 3,
        "ayah_range": "8-10",
        "title_en": "The Day of Gathering & Mutual Loss/Gain (At-Taghabun)",
        "title_ar": "يوم التغابن: فوز المتقين وخسران الكافرين",
        "color": "#7c3aed",
        "summary": "Call to believe in Allah, His Messenger, and the divine Light. On the Great Gathering Day—the Day of Mutual Loss and Gain (At-Taghabun)—believers enter gardens beneath which rivers flow forever, while rejecters face eternal agony."
    },
    {
        "section_id": 4,
        "ayah_range": "11-13",
        "title_en": "Divine Decree, Submission of Hearts & Absolute Trust",
        "title_ar": "الرضا بالقضاء والقدر وطاعة الرسول والتوكل",
        "color": "#0284c7",
        "summary": "No calamity strikes except by Allah's leave; whoever truly believes in Allah, He illuminates and guides their heart. True believers obey Allah and the Messenger and place unyielding trust solely in Him."
    },
    {
        "section_id": 5,
        "ayah_range": "14-18",
        "title_en": "Family Trials, Mindful Piety & The Multiplied Goodly Loan",
        "title_ar": "الابتلاء بالأهل والأموال وفضل التقوى والإنفاق المضاعف",
        "color": "#059669",
        "summary": "Spouses and offspring can be subtle spiritual trials, yet pardon, overlooking, and forgiveness bring immense divine mercy. Wealth and children are a test, while Allah holds an infinite reward. Fear Allah as much as you can, give charitably, and whoever advances a goodly loan to Allah—He multiplies it manifold and forgives."
    }
]

def derive_word(q_w, seg_list, prev_w, next_w, surah_num):
    loc = q_w['location']
    ay_num = int(loc.split(':')[1])
    w_pos = int(loc.split(':')[2])
    text_uth = q_w['text_uthmani']
    text_iml = q_w.get('text_imlaei', text_uth)
    transl = q_w.get('translation', {}).get('text', '')
    tlit = q_w.get('transliteration', {}).get('text', '')
    audio = q_w.get('audio_url', '')

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
    for f_part in stem_feat.split('|'):
        if f_part.startswith('ROOT:'):
            root_bw = f_part.split(':')[1]
        elif f_part.startswith('LEM:'):
            lem_bw = f_part.split(':')[1]

    root_hyphen, root_desc, root_short, root_letters = get_root_info(root_bw)
    lemma_ar = bw_to_ar(lem_bw) if lem_bw else ""

    if stem_pos in ['V']:
        primary_type = "fi'l"
        primary_type_ar = "فعل"
    elif stem_pos in ['N', 'PN', 'ADJ', 'PRON', 'DEM', 'REL', 'T', 'LOC']:
        primary_type = "ism"
        primary_type_ar = "اسم"
    else:
        primary_type = "harf"
        primary_type_ar = "حرف"

    classification_details = {}
    sarf_details = {
        "root": root_hyphen,
        "root_ar": bw_to_ar(root_bw) if root_bw else None,
        "root_meaning": root_desc,
        "root_concept": root_short,
        "lemma": lemma_ar,
        "root_letters": root_letters,
        "wazn": None,
        "verb_form": None,
        "person": None,
        "gender": None,
        "number": None
    }

    for pgn in ['1S', '1P', '2MS', '2FS', '2MD', '2MP', '2FP', '3MS', '3FS', '3MD', '3MP', '3FP']:
        if pgn in stem_feat.split('|'):
            sarf_details['person'] = pgn[0] + ("st" if pgn[0] == '1' else ("nd" if pgn[0] == '2' else "rd"))
            sarf_details['gender'] = "masculine" if 'M' in pgn else ("feminine" if 'F' in pgn else None)
            sarf_details['number'] = "singular" if 'S' in pgn else ("dual" if 'D' in pgn else "plural")
            break

    v_form = "I"
    if primary_type == "fi'l":
        tense = "past" if 'PERF' in stem_feat else ("present" if 'IMPF' in stem_feat else ("imperative" if 'IMPV' in stem_feat else "past"))
        tense_ar = "ماضٍ" if tense == "past" else ("مضارع" if tense == "present" else "أمر")
        voice = "passive" if 'PASS' in stem_feat else "active"
        voice_ar = "مبني للمجهول" if voice == "passive" else "مبني للمعلوم"

        v_form_ar = "فَعَلَ"
        v_form_meaning = "Form I: Basic stem action"
        for fm_key, fm_val in FORM_MAP.items():
            if fm_key in stem_feat:
                v_form = fm_key.strip('()')
                v_form_ar = fm_val[1]
                v_form_meaning = fm_val[0] + ": " + fm_val[2]
                break

        sound_key, sound_ar = analyze_soundness(root_bw)

        classification_details = {
            "category": "fi'l",
            "tense": tense,
            "tense_ar": tense_ar,
            "form": v_form,
            "form_ar": v_form_ar,
            "form_meaning": v_form_meaning,
            "voice": voice,
            "voice_ar": voice_ar,
            "transitivity": "intransitive" if v_form in ['VII', 'V'] or root_bw in ['mwt', 'rjE', 'sbH'] else "transitive",
            "soundness": sound_key,
            "soundness_ar": sound_ar
        }
        sarf_details['verb_form'] = v_form

    elif primary_type == "ism":
        for fm_key in FORM_MAP:
            if fm_key in stem_feat:
                v_form = fm_key.strip('()')
                sarf_details['verb_form'] = v_form
                break

        gender = "feminine" if 'F' in stem_feat or 'FS' in stem_feat or 'FP' in stem_feat or text_uth.endswith(('ة', 'ى', 'اء')) or root_bw in ['ArD', 'smw', 'nfs', 'nAr'] else "masculine"
        gender_marker = "ta_marbutah (ـة)" if text_uth.endswith('ة') else ("alif_maqsura (ـى)" if text_uth.endswith('ى') else ("alif_mamduda (ـاء)" if text_uth.endswith('اء') else ("semantic_feminine" if gender == "feminine" else "unmarked_masculine")))
        number = "dual" if ('D' in stem_feat or 'MD' in stem_feat or 'FD' in stem_feat) else ("plural" if ('P' in stem_feat or 'MP' in stem_feat or 'FP' in stem_feat) else "singular")
        definiteness = "definite" if any(p['pos'] == 'DET' for p in prefixes) or stem_pos == 'PN' or suffixes else ("indefinite" if 'INDEF' in stem_feat else "definite_by_context")

        derivation = "jamid"
        derivation_ar = "اسم جامد"
        if text_uth.startswith('مُّ') or text_uth.startswith('مُ'):
            if 'ِ' in text_uth or text_uth.endswith(('ِرٌّ', 'ِعٌ', 'ِرٍ', 'ين', 'ون')):
                derivation = "ism_fail"
                derivation_ar = "اسم فاعل (Active Participle)"
            else:
                derivation = "ism_maful"
                derivation_ar = "اسم مفعول (Passive Participle)"
        elif text_uth.startswith('مَ'):
            derivation = "ism_makan"
            derivation_ar = "اسم مكان / زمان (Noun of Place/Time)"
        elif root_bw in ['Ezz', 'kbr', 'Hkm', 'E*b', 'Sdq', 'xyr', 'Hsn', 'Hlm', 'EZm']:
            derivation = "sifa_mushabbaha"
            derivation_ar = "صفة مشبهة (Permanent Adjective)"
        elif text_uth.startswith('أَ') and any(text_uth.endswith(s) for s in ['ى', 'رّ', 'َر', 'زّ', 'لّ']):
            derivation = "ism_tafdhil"
            derivation_ar = "اسم تفضيل (Comparative / Elative)"

        is_nhp = False
        if number == "plural" and root_bw not in ['kfr', 'mtq', 'jrm', 'nAs', 'SHb', 'rsl', 'nfq', 'Amn', 'flH']:
            is_nhp = True

        classification_details = {
            "category": "ism",
            "noun_type": stem_pos,
            "derivation": derivation,
            "derivation_ar": derivation_ar,
            "gender": gender,
            "gender_marker": gender_marker,
            "number": number,
            "definiteness": definiteness,
            "is_non_human_plural": is_nhp,
            "agreement_rule": "Governs feminine singular agreement (treated as مفرد مؤنث)" if is_nhp else "Standard agreement"
        }

    else:
        classification_details = {
            "category": "harf",
            "particle_type": stem_pos,
            "governance": "Causes genitive (jarr)" if stem_pos == 'P' else ("Causes accusative (nasb)" if stem_pos == 'ACC' else ("Causes jussive (jazm)" if stem_pos in ['NEG', 'COND'] else "Non-governing (عاطل / غير عامل)"))
        }

    sarf_details['wazn'] = deduce_wazn(primary_type, v_form, stem_pos, text_iml, clean_arabic_word(text_uth))

    case_mood = "mabni"
    vowel_ending = "sukun"
    role_en = "particle_or_built"
    role_ar = "مبني"
    simplified_role = "Fixed Word"
    why_ending = "Has an invariable fixed base (مبني) that does not decline."
    beneficial_meaning = f"'{transl}' is an unchanging word in the sentence structure."
    idafa_role = "none"
    idafa_notes = None

    if primary_type == "ism":
        is_mp = 'MP' in stem_feat
        is_fp = 'FP' in stem_feat

        if 'NOM' in stem_feat:
            case_mood = "raf"
            role_en = "subject_or_predicate"
            role_ar = "مرفوع (فاعل / مبتدأ / خبر)"
            simplified_role = "Doer / Topic / Predicate"
            if is_mp:
                vowel_ending = "waw_plural"
                why_ending = "Marked by Waw (ـون) instead of Dhumma because it is a sound masculine plural in the nominative case (مرفوع بالواو). It stands in the independent role of subject, topic, or predicate."
            else:
                vowel_ending = "dhumma" if 'INDEF' not in stem_feat else "tanwin_damm"
                why_ending = "Takes Dhumma (ـُ) because it is in the nominative case (الرفع). In Arabic, the primary actor who performs the action, or the main topic being described, always holds this elevated, independent position."
            beneficial_meaning = f"Identifies the main actor or topic ('{transl}') in the elevated nominative case (Raf')."

        elif 'ACC' in stem_feat:
            case_mood = "nasb"
            role_en = "object_or_circumstance"
            role_ar = "منصوب (مفعول به / ظرف / حال)"
            simplified_role = "Receiver / Object / Circumstance"
            if is_mp:
                vowel_ending = "ya_plural"
                why_ending = "Marked by Ya (ـين) instead of Fatha because it is a sound masculine plural in the accusative case (منصوب بالياء), receiving the action or completing dependent description."
            elif is_fp:
                vowel_ending = "kasra_substitute"
                why_ending = "Takes Kasra (ـِ) as a substitute for Fatha because sound feminine plurals (ـات) take Kasra in the accusative case (منصوب بالكسرة نيابة عن الفتحة)."
            else:
                vowel_ending = "fatha" if 'INDEF' not in stem_feat else "tanwin_fath"
                why_ending = "Takes Fatha (ـَ) because it is in the accusative case (النصب). This marks words that receive an action (direct object), specify a circumstance of time or place, or describe a state."
            beneficial_meaning = f"Identifies what is acted upon or specified ('{transl}') in the dependent accusative case (Nasb)."

        elif 'GEN' in stem_feat:
            case_mood = "jarr"
            role_en = "genitive_annexed_or_prepositional"
            role_ar = "مجرور (بحرف الجر / مضاف إليه)"
            simplified_role = "After Preposition / Possessive Specifier"
            if is_mp:
                vowel_ending = "ya_plural"
                why_ending = "Marked by Ya (ـين) instead of Kasra because it is a sound masculine plural in the genitive case (مجرور بالياء), governed by a preposition or possessive construct (Idafa)."
            else:
                vowel_ending = "kasra" if 'INDEF' not in stem_feat else "tanwin_kasr"
                why_ending = "Takes Kasra (ـِ) because it is in the genitive case (الجر), governed by a preceding preposition or serving as the second specifying noun in a possessive construct (Idafa)."
            beneficial_meaning = f"Connects to the preceding word ('{transl}') through attachment in the genitive case (Jarr)."

        elif stem_pos in ['PRON']:
            case_mood = "mabni"
            vowel_ending = "fixed_pronoun"
            simplified_role = "Personal Pronoun"
            why_ending = "Personal pronoun with an invariable base ending (ضمير مبني في محل إعراب)."
            beneficial_meaning = f"Pronoun referring to '{transl}'."

        elif stem_pos in ['DEM']:
            case_mood = "mabni"
            vowel_ending = "fixed_demonstrative"
            simplified_role = "Demonstrative Pointer"
            why_ending = "Demonstrative noun with an invariable base ending (اسم إشارة مبني)."
            beneficial_meaning = f"Demonstrative pointing to '{transl}'."

        elif stem_pos in ['REL']:
            case_mood = "mabni"
            vowel_ending = "fixed_relative"
            simplified_role = "Relative Pronoun"
            why_ending = "Relative pronoun with an invariable base ending (اسم موصول مبني)."
            beneficial_meaning = f"Connecting relative noun ('{transl}')."

        elif stem_pos in ['T', 'LOC']:
            case_mood = "mabni"
            vowel_ending = "fixed_adverb"
            simplified_role = "Time / Place Adverb"
            why_ending = "Adverb of time or place with an invariable base ending (ظرف مبني على السكون في محل نصب)."
            beneficial_meaning = f"Specifies the time or place circumstance: '{transl}'."

        else:
            case_mood = "mabni"
            vowel_ending = "fixed"
            simplified_role = "Fixed Noun / Pointer"
            why_ending = "Noun with an unchanging base ending (مبني)."
            beneficial_meaning = f"Invariable noun referring to '{transl}'."

        if prefixes and any(p['pos'] == 'P' for p in prefixes):
            p_text = bw_to_ar(prefixes[0]['bw'])
            role_en = "ism_majrur"
            role_ar = "اسم مجرور بحرف الجر"
            case_mood = "jarr"
            simplified_role = "Noun Pulled by Preposition"
            if is_mp:
                vowel_ending = "ya_plural"
                why_ending = f"Marked by Ya (ـين) because it is a sound masculine plural pulled into the genitive state (Jarr) by the attached preposition '{p_text}'."
            else:
                vowel_ending = "kasra" if 'INDEF' not in stem_feat else "tanwin_kasr"
                why_ending = f"Takes Kasra (ـِ) because the preposition '{p_text}' directly governs this noun, pulling it into the genitive state (Jarr)."
            beneficial_meaning = f"Governed directly by the attached preposition '{p_text}' to mean '{transl}'."

    elif primary_type == "fi'l":
        if 'PERF' in stem_feat:
            case_mood = "mabni"
            vowel_ending = "fatha_base"
            role_en = "past_verb"
            role_ar = "فعل ماضٍ مبني على الفتح"
            simplified_role = "Completed Past Action"
            why_ending = "Built on Fatha (مبني على الفتح) as an invariable base, which is standard for all past-tense verbs in classical Arabic."
            beneficial_meaning = f"Expresses an accomplished, certain past action ('{transl}')."
            if suffixes and any('PRON:3MP' in s['features'] for s in suffixes):
                vowel_ending = "damma_plural"
                why_ending = "Built on Dammah (مبني على الضم) because it connects with the masculine plural subject pronoun Waw (واو الجماعة)."
                beneficial_meaning = f"Plural past action ('they {transl}')."
            elif suffixes and any('PRON:1P' in s['features'] for s in suffixes):
                vowel_ending = "sukun_we"
                why_ending = "Built on Sukun (مبني على السكون) because it connects with the first-person plural subject pronoun 'Nā' (نا الفاعلين)."
                beneficial_meaning = f"Plural past action by us ('we {transl}')."
        elif 'IMPF' in stem_feat:
            if 'MOOD:JUS' in stem_feat:
                case_mood = "jazm"
                vowel_ending = "sukun_or_cutoff"
                role_en = "jussive_verb"
                role_ar = "فعل مضارع مجزوم"
                simplified_role = "Clipped / Jussive Verb"
                why_ending = "Takes Sukun or omission of ending (الجزم) because it is governed by a preceding negative particle (such as 'lam' لَمْ) or conditional clause."
                beneficial_meaning = f"Action decisively negated or constrained: '{transl}'."
            elif 'MOOD:SUBJ' in stem_feat:
                case_mood = "nasb"
                vowel_ending = "fatha"
                role_en = "subjunctive_verb"
                role_ar = "فعل مضارع منصوب"
                simplified_role = "Intended / Subjunctive Verb"
                why_ending = "Takes Fatha (ـَ) because it follows a subjunctive particle of purpose or future intent, placing the verb in the dependent subjunctive mood (Nasb)."
                beneficial_meaning = f"Action expressing intent or purpose: '{transl}'."
            else:
                case_mood = "raf"
                vowel_ending = "dhumma"
                role_en = "indicative_verb"
                role_ar = "فعل مضارع مرفوع"
                simplified_role = "Present / Ongoing Action"
                why_ending = "Takes Dhumma (ـُ) in its default independent indicative mood (الرفع), because no preceding particle changed its ending."
                beneficial_meaning = f"Ongoing present or future action: '{transl}'."
        elif 'IMPV' in stem_feat:
            case_mood = "mabni"
            vowel_ending = "sukun_command"
            role_en = "imperative_verb"
            role_ar = "فعل أمر مبني على السكون"
            simplified_role = "Direct Command / Imperative"
            why_ending = "Built on Sukun (مبني على السكون) as a direct divine instruction or command."
            beneficial_meaning = f"A direct imperative command: '{transl}'."

    elif primary_type == "harf":
        case_mood = "mabni"
        vowel_ending = "sukun_or_fath"
        role_en = "particle"
        role_ar = "حرف مبني لا محل له من الإعراب"

        if stem_pos == 'ACC':
            simplified_role = "Emphasis Particle (Inna & Sisters)"
            why_ending = "Particle of emphasis (حرف توكيد ونصب مبني على الفتح). In Arabic, it confirms the statement and pulls the following noun into the accusative case (Nasb)."
            beneficial_meaning = f"Emphatic confirmation: '{transl}'."
        elif stem_pos in ['NEG', 'PRO']:
            simplified_role = "Negative / Prohibition Particle"
            why_ending = "Particle of negation or prohibition with an unchanging fixed base (حرف نفي أو نهي مبني)."
            beneficial_meaning = f"Negation: '{transl}'."
        elif stem_pos in ['COND']:
            simplified_role = "Conditional Particle"
            why_ending = "Conditional particle with a fixed ending (حرف شرط مبني) introducing a premise."
            beneficial_meaning = f"Introduces condition: '{transl}'."
        elif stem_pos in ['CONJ']:
            simplified_role = "Conjunction Particle"
            why_ending = "Connecting conjunction with an unchanging fixed base (حرف عطف مبني)."
            beneficial_meaning = f"Conjunction: '{transl}'."
        elif stem_pos in ['P']:
            simplified_role = "Preposition"
            why_ending = "Preposition with a fixed ending (حرف جر مبني) pulling the following noun into the genitive case (Jarr)."
            beneficial_meaning = f"Preposition: '{transl}'."
        elif stem_pos in ['EXH']:
            simplified_role = "Exhortation / Urging Particle"
            why_ending = "Exhortation particle urging action with a fixed ending (حرف تحضيض مبني)."
            beneficial_meaning = f"Urging: '{transl}'."
        elif stem_pos in ['VOC']:
            simplified_role = "Vocative Calling Particle"
            why_ending = "Vocative particle used for direct address with a fixed base (حرف نداء مبني)."
            beneficial_meaning = f"Direct address: '{transl}'."
        elif stem_pos in ['ANS']:
            simplified_role = "Affirmative Response Particle"
            why_ending = "Particle of affirmative reply overturning negative premise (حرف جواب مبني)."
            beneficial_meaning = f"Affirmative answer: '{transl}'."
        else:
            simplified_role = "Connecting / Modifying Particle"
            why_ending = "Particles possess fixed phonetic endings (مبني) and never decline for grammatical case."
            beneficial_meaning = f"Structural grammatical particle conveying '{transl}'."

    # Sub-segmentation (Lowest Level)
    morphemes = []
    seg_idx = 1

    # 1. Prefixes
    for p in prefixes:
        p_ar = bw_to_ar(p['bw'])
        p_pos = p['pos']
        color = "#d97706"
        p_meaning = "and (conjunction)" if p_ar == "وَ" else ("then/so (conjunction)" if p_ar == "فَ" else ("the (definite article)" if p_pos == "DET" else ("with/by (preposition)" if p_ar == "بِ" else ("for/to (preposition)" if p_ar == "لِ" else ("surely (emphatic lam)" if p_ar == "لَ" else ("will (future marker)" if p_ar == "سَ" else "prefix particle"))))))
        morphemes.append({
            "segment_index": seg_idx,
            "arabic": p_ar,
            "transliteration": p['bw'],
            "type": "prefix",
            "pos_tag": p_pos,
            "role": p_meaning,
            "vowel": "fatha" if p_ar in ['وَ', 'فَ', 'لَ', 'سَ'] else ("kasra" if p_ar in ['بِ', 'لِ'] else "sukun"),
            "color_code": color,
            "color_name": "amber_prefix"
        })
        seg_idx += 1

    # Stem
    if stem_seg:
        stem_ar = bw_to_ar(stem_seg['bw'])
        color = COLOR_SCHEME[case_mood]['color']
        morphemes.append({
            "segment_index": seg_idx,
            "arabic": stem_ar,
            "transliteration": stem_seg['bw'],
            "type": "stem",
            "pos_tag": stem_pos,
            "role": f"Core lexical stem ({transl})",
            "vowel": vowel_ending,
            "color_code": color,
            "color_name": f"{case_mood}_stem"
        })
        seg_idx += 1

    # Suffixes
    for s in suffixes:
        s_ar = bw_to_ar(s['bw'])
        s_feat = s['features']
        s_meaning = "attached pronoun" if 'PRON' in s_feat else ("feminine marker tā'" if 't' in s['bw'] else "suffix marker")
        if '3MP' in s_feat:
            s_meaning = "they / their (plural pronoun)"
        elif '3MS' in s_feat:
            s_meaning = "he / his / him (singular pronoun)"
        elif '1P' in s_feat:
            s_meaning = "we / our / us (plural pronoun)"
        elif '2MS' in s_feat:
            s_meaning = "you / your (singular pronoun)"
        elif '2MP' in s_feat:
            s_meaning = "you all / your (plural pronoun)"
        elif '3FS' in s_feat:
            s_meaning = "she / her (feminine singular pronoun)"

        morphemes.append({
            "segment_index": seg_idx,
            "arabic": s_ar,
            "transliteration": s['bw'],
            "type": "suffix",
            "pos_tag": s['pos'],
            "role": s_meaning,
            "vowel": "dhumma" if 'u' in s['bw'] else ("sukun" if 'o' in s['bw'] else "fatha"),
            "color_code": "#ec4899",
            "color_name": "pink_suffix"
        })
        seg_idx += 1

    if next_w and 'GEN' in next_w.get('features', '') and primary_type == 'ism':
        if not text_uth.startswith('ٱل') and 'ٌ' not in text_uth and 'ٍ' not in text_uth and 'ً' not in text_uth:
            idafa_role = "mudhaf"
            idafa_notes = "Functioning as Mudhaf (first noun in possessive construct): drops Tanween and definite article Al-."

    word_obj = {
        "id": q_w['id'],
        "location": loc,
        "surah": surah_num,
        "ayah": ay_num,
        "word_position": w_pos,
        "arabic_uthmani": text_uth,
        "arabic_clean": text_iml,
        "transliteration": tlit,
        "translation": transl,
        "audio_url": f"https://audio.qurancdn.com/{audio}" if audio else None,
        "classification": {
            "primary_type": primary_type,
            "primary_type_ar": primary_type_ar,
            "details": classification_details
        },
        "sarf": sarf_details,
        "irab_and_case": {
            "case_or_mood": case_mood,
            "case_or_mood_ar": COLOR_SCHEME[case_mood]['case_ar'],
            "case_concept": COLOR_SCHEME[case_mood]['concept'],
            "ending_vowel": vowel_ending,
            "grammatical_role": role_en,
            "grammatical_role_ar": role_ar,
            "simplified_role": simplified_role,
            "why_this_ending": why_ending,
            "beneficial_meaning": beneficial_meaning,
            "idafa": {
                "role": idafa_role,
                "notes": idafa_notes
            }
        },
        "lowest_level_breakdown": {
            "morphemes_count": len(morphemes),
            "morphemes": morphemes
        },
        "color_coding": {
            "case_color": COLOR_SCHEME[case_mood]['color'],
            "case_bg": COLOR_SCHEME[case_mood]['bg'],
            "case_border": COLOR_SCHEME[case_mood]['border'],
            "pos_color": POS_COLORS[primary_type]['color'],
            "pos_bg": POS_COLORS[primary_type]['bg'],
            "vowel_badge": f"{COLOR_SCHEME[case_mood]['vowel']} • {COLOR_SCHEME[case_mood]['case_ar']}",
            "pedagogical_badge": f"{primary_type_ar} • {COLOR_SCHEME[case_mood]['case_ar']}"
        }
    }
    return word_obj

def build_surah_dataset(surah_num, surah_name_ar, surah_name_en, surah_name_tr, chrono, thematic_sections, corpus_map):
    print(f"Fetching API data for Surah {surah_num}...")
    quran_data = fetch_quran(surah_num)

    verses_output = []
    all_words = []
    unique_roots_in_surah = set()

    for v in quran_data['verses']:
        ay_num = v['verse_number']
        raw_words = [w for w in v['words'] if w['char_type_name'] == 'word']

        section = None
        for sec in thematic_sections:
            r_start, r_end = map(int, sec['ayah_range'].split('-'))
            if r_start <= ay_num <= r_end:
                section = sec
                break

        verse_words = []
        for w_idx, q_w in enumerate(raw_words):
            loc = q_w['location']
            seg_list = corpus_map.get(loc, [])

            prev_w = raw_words[w_idx - 1] if w_idx > 0 else None
            next_w = raw_words[w_idx + 1] if w_idx < len(raw_words) - 1 else None
            next_feat = corpus_map.get(next_w['location'], [{}])[0].get('features', '') if next_w else ''

            w_obj = derive_word(q_w, seg_list, prev_w, {'features': next_feat} if next_w else None, surah_num)
            verse_words.append(w_obj)
            all_words.append(w_obj)

            if w_obj['sarf']['root_ar']:
                for seg in seg_list:
                    for fp in seg['features'].split('|'):
                        if fp.startswith('ROOT:'):
                            unique_roots_in_surah.add(fp.split(':')[1])

        v_trans = v['translations'][0]['text'] if 'translations' in v and v['translations'] else ""

        verse_obj = {
            "ayah_number": ay_num,
            "surah_number": surah_num,
            "text_uthmani": " ".join(w['text_uthmani'] for w in raw_words),
            "text_imlaei": " ".join(w.get('text_imlaei', w['text_uthmani']) for w in raw_words),
            "translation": v_trans,
            "thematic_section_id": section['section_id'] if section else 1,
            "thematic_section_title": section['title_en'] if section else "",
            "thematic_color": section['color'] if section else "#2563eb",
            "is_divine_refrain": False,
            "refrain_lesson": None,
            "words_count": len(verse_words),
            "words": verse_words
        }
        verses_output.append(verse_obj)

    root_list = []
    for r_bw in sorted(unique_roots_in_surah):
        hyphen, desc, concept, _ = get_root_info(r_bw)
        root_list.append({
            "root_bw": r_bw,
            "root_ar": hyphen,
            "meaning_en": desc,
            "concept_en": concept
        })

    total_morphemes = sum(w['lowest_level_breakdown']['morphemes_count'] for w in all_words)

    dataset = {
        "metadata": {
            "title": f"Surah {surah_name_en} ({surah_name_ar}) — Exhaustive Grammatical, Morphological & Color-Coded Dataset",
            "surah_number": surah_num,
            "surah_name_ar": surah_name_ar,
            "surah_name_en": surah_name_en,
            "surah_name_translation": surah_name_tr,
            "revelation_type": "Medinan (مدنية)",
            "chronological_order": chrono,
            "total_verses": len(verses_output),
            "total_words": len(all_words),
            "total_morphemes": total_morphemes,
            "version": "1.1.1",
            "updated_at": "2026-10-06 23:40",
            "compiler": "Antigravity Arabic Grammar Intelligence System",
            "guideline_basis": "Arabic grammar teaching system: A comprehensive guide to classification, morphology, pedagogy, and i'rab vowel color-coding",
            "license": "Open Data for Quranic Education (incorporating Quranic Arabic Corpus annotations by Kais Dukes under GPL)",
            "footer_version": "v1.1.1 (updated 2026-10-06 23:40)"
        },
        "color_coding_system": {
            "description": "Pedagogical color-coding matrix mapping phonetic vowels, grammatical cases (i'rab), word classes (ism/fi'l/harf), and morpheme tiers to visual color tokens.",
            "case_and_mood_palette": COLOR_SCHEME,
            "word_classification_palette": POS_COLORS,
            "morpheme_tier_palette": {
                "prefix": {
                    "color": "#d97706",
                    "bg": "#fef3c7",
                    "label": "Prefix (Conjunction, Preposition, Definite Article Al-, Interrogative Hamza)"
                },
                "stem_root": {
                    "color": "#2563eb",
                    "bg": "#eff6ff",
                    "label": "Stem Consonantal Root (3 Radical Core Letters: ف-ع-ل)"
                },
                "stem_augmented": {
                    "color": "#0284c7",
                    "bg": "#e0f2fe",
                    "label": "Augmented Letters from Sa'altumuniha (سَأَلْتُمُونِيهَا) Forming Forms I-X & Participles"
                },
                "suffix": {
                    "color": "#ec4899",
                    "bg": "#fce7f3",
                    "label": "Suffix (Attached Object/Subject Pronoun, Feminine Tā', Plural Markers)"
                }
            },
            "css_variables": {
                "--color-raf-blue": "#2563eb",
                "--bg-raf-blue": "#eff6ff",
                "--color-nasb-green": "#059669",
                "--bg-nasb-green": "#ecfdf5",
                "--color-jarr-purple": "#7c3aed",
                "--bg-jarr-purple": "#f5f3ff",
                "--color-jazm-amber": "#d97706",
                "--bg-jazm-amber": "#fffbeb",
                "--color-mabni-slate": "#64748b",
                "--bg-mabni-slate": "#f8fafc",
                "--color-fi-red": "#e11d48",
                "--bg-fi-red": "#ffe4e6",
                "--color-ism-blue": "#1d4ed8",
                "--bg-ism-blue": "#dbeafe",
                "--color-harf-gold": "#d97706",
                "--bg-harf-gold": "#fef3c7",
                "--color-suffix-pink": "#ec4899",
                "--bg-suffix-pink": "#fce7f3"
            }
        },
        "pedagogical_framework": {
            "title": "Pedagogical Principles & Systematic Grammar Guide",
            "trilateral_word_classification": {
                "ism": "Encompasses nouns, pronouns, adjectives, and adverbs—any word denoting meaning independent of time. Subdivided by gender (masculine/feminine), number (singular, dual, sound plural, broken plural), definiteness (nakira/ma'rifa), and derivation (jamid vs mushtaq vs masdar).",
                "fil": "Indicates actions associated with specific time: past (madi), present (mudari'), and imperative (amr). Inflects across voices (active/passive), transitivities (transitive/intransitive), root soundness (sahih vs mu'tal), and 10 primary patterns (Forms I-X).",
                "harf": "Comprises uninflected particles conveying meaning only in relation to other words: prepositions (huruf al-jarr), conjunctions (huruf al-'atf), subjunctive particles (huruf al-nasb), jussive particles (huruf al-jazm), and sisters of Inna."
            },
            "case_endings_irab_rationale": {
                "dhumma_raf": "Short sound 'u' marking Raf' (Nominative case), literally 'elevation'. Appears on subjects of verbal sentences (fa'il), nominal topics (mubtada'), and predicates (khabar). Positions elements as primary and independent.",
                "fatha_nasb": "Short sound 'a' marking Nasb (Accusative case), literally 'setting up / erecting'. Signals dependency and subordination: direct objects (maful bihi), adverbs of time/place/manner (zarf/hal), tamyiz, and subjects of Inna.",
                "kasra_jarr": "Short sound 'i' marking Jarr (Genitive case), literally 'dragging / pulling down'. Indicates attachment and dependency: all nouns following prepositions and second terms in possessive constructions (Idafa).",
                "sukun_jazm": "Marks absence of vowel, literally 'cutting / clipping'. Decisively cuts off alternatives in commands (amr), prohibitions (la al-nahiyah), past negation (lam), and conditional sentences."
            },
            "idafa_construction_rules": {
                "mudhaf": "The first noun (possessed/described). Crucially drops the definite article Al-, loses Tanween (nunation), and enters a dependent construct state.",
                "mudhaf_ilayhi": "The second noun (possessor/specifier). Strictly takes genitive case (kasra/jarr) and determines the definiteness of the entire phrase."
            },
            "gender_number_agreement_and_non_human_plurals": {
                "golden_rule": "ALL non-human plurals are grammatically treated as feminine singular (مفرد مؤنث). Adjectives, verbs, and pronouns referring to non-human plurals appear in feminine singular.",
                "broken_plurals": "Over 30 broken plural patterns (jam' taksir) involving internal vowel shifts and consonant reshaping (e.g., af'āl, fu'ūl, fi'āl)."
            },
            "eleven_step_sarf_progression": [
                "1. Word categories (Ism / Fi'l / Harf)",
                "2. Triliteral Root-Pattern template (ف-ع-ل)",
                "3. Basic verb conjugation (Past and Present)",
                "4. Derived nouns (Ism al-Fa'il, Ism al-Maf'ul, Masdar)",
                "5. Enhanced verb forms II-IV (Causative, Intensive, Associative)",
                "6. Regular masdar patterns for Forms II-X",
                "7. First-weak verbs (Mithal)",
                "8. Second-weak verbs (Ajwaf / Hollow)",
                "9. Third-weak verbs (Naqis / Defective)",
                "10. Remaining verb forms V-X (Reflexive, Passive, Seeking)",
                "11. Samā'ī Form I masdars and advanced derivatives"
            ]
        },
        "thematic_sections": thematic_sections,
        "verses": verses_output,
        "root_index": {
            "total_unique_roots": len(root_list),
            "roots": root_list
        }
    }
    return dataset

def main():
    print("Loading corpus...")
    corpus = load_corpus()
    print("Corpus loaded.")

    # Surah 63: Al-Munafiqun
    print("Building Surah 63 (Al-Munafiqun)...")
    dataset_63 = build_surah_dataset(
        surah_num=63,
        surah_name_ar="سورة المنافقون",
        surah_name_en="Surah Al-Munafiqun",
        surah_name_tr="The Hypocrites",
        chrono=104,
        thematic_sections=THEMATIC_SECTIONS_63,
        corpus_map=corpus
    )
    file_63 = "surah-al-munafiqun.json"
    with open(file_63, 'w', encoding='utf-8') as f:
        json.dump(dataset_63, f, ensure_ascii=False, indent=2)
    print(f"Generated {file_63}: {len(dataset_63['verses'])} verses, {dataset_63['metadata']['total_words']} words, {dataset_63['metadata']['total_morphemes']} morphemes.")

    # Surah 64: At-Taghabun
    print("Building Surah 64 (At-Taghabun)...")
    dataset_64 = build_surah_dataset(
        surah_num=64,
        surah_name_ar="سورة التغابن",
        surah_name_en="Surah At-Taghabun",
        surah_name_tr="Mutual Disillusion / Loss & Gain",
        chrono=108,
        thematic_sections=THEMATIC_SECTIONS_64,
        corpus_map=corpus
    )
    file_64 = "surah-at-taghabun.json"
    with open(file_64, 'w', encoding='utf-8') as f:
        json.dump(dataset_64, f, ensure_ascii=False, indent=2)
    print(f"Generated {file_64}: {len(dataset_64['verses'])} verses, {dataset_64['metadata']['total_words']} words, {dataset_64['metadata']['total_morphemes']} morphemes.")

if __name__ == '__main__':
    main()
