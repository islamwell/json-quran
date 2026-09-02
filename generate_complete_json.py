import json
import re
from datetime import datetime

# Load Quran.com raw data and corpus raw lines
with open('quran_raw.json', 'r', encoding='utf-8') as f:
    quran_raw = json.load(f)

corpus_words = {}
with open('corpus_raw.txt', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        parts = line.split('\t')
        if len(parts) >= 4:
            tag_loc = parts[0].strip('()')
            word_loc = tag_loc.rsplit(':', 1)[0]
            if word_loc not in corpus_words:
                corpus_words[word_loc] = []
            corpus_words[word_loc].append({
                'loc': tag_loc,
                'bw': parts[1],
                'pos': parts[2],
                'features': parts[3]
            })

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
    "qrb": ("ق-ر-ب", "to approach, draw near, be close", "Approach / Nearness"),
    "swE": ("س-و-ع", "period of time, appointed hour, moment", "Hour / Appointed Time"),
    "$qq": ("ش-ق-ق", "to split, cleave asunder, tear open", "Split / Cleave"),
    "qmr": ("ق-م-ر", "moon, celestial white orb", "Moon"),
    "rAy": ("ر-ء-ي", "to see, perceive, behold, observe", "See / Behold"),
    "Ayy": ("ء-ي-ي", "sign, miracle, proof, divine token", "Sign / Miracle"),
    "ErD": ("ع-ر-ض", "to turn away, avert, reject, broad", "Turn away / Avert"),
    "qwl": ("ق-و-ل", "to say, speak, utter, articulate", "Say / State"),
    "sHr": ("س-ح-ر", "magic, sorcery, delusion, early dawn", "Magic / Sorcery"),
    "mrr": ("م-ر-ر", "to pass by, continue, endure, be bitter", "Continue / Pass"),
    "k*b": ("ك-ذ-ب", "to deny, belie, reject truth, lie", "Belie / Deny"),
    "tbE": ("ت-ب-ع", "to follow, pursue, comply with", "Follow / Comply"),
    "hwy": ("ه-و-ي", "desire, lust, whim, vain inclination", "Desires / Whims"),
    "kll": ("ك-ل-ل", "all, every, total, entirety", "All / Every"),
    "Amr": ("أ-م-ر", "matter, decree, command, affair", "Matter / Decree"),
    "qrr": ("ق-ر-ر", "to settle, establish, confirm, be cool", "Settle / Confirm"),
    "jYA": ("ج-ي-ء", "to come, arrive, approach", "Come / Arrive"),
    "nbA": ("ن-ب-أ", "news, momentous tidings, report", "News / Tidings"),
    "zjr": ("ز-ج-ر", "to deter, rebuke, drive away, restrain", "Deter / Rebuke"),
    "Hkm": ("ح-ك-م", "wisdom, judgment, decisive ordinance", "Wisdom / Judgment"),
    "blg": ("ب-ل-غ", "to reach, attain maturity, consummate", "Consummate / Reach"),
    "gny": ("غ-ن-ي", "to avail, suffice, enrich, dispense with", "Avail / Suffice"),
    "n*r": ("ن-ذ-ر", "warner, warning, admonition, vow", "Warning / Warner"),
    "twl": ("ت-و-ل", "to turn away, depart, withdraw, take charge", "Turn away"),
    "ywm": ("ي-و-م", "day, period, time of reckoning", "Day / Reckoning"),
    "dEw": ("د-ع-و", "to call, summon, invite, supplicate", "Call / Summon"),
    "nkr": ("ن-ك-ر", "dreadful, terrifying, unacknowledged, terrible", "Dreadful / Unknown"),
    "x$E": ("خ-ش-ع", "to humble, cast down eyes in awe, submit", "Humble / Downcast"),
    "bSr": ("ب-ص-ر", "sight, vision, eyes, perception", "Vision / Eyes"),
    "xrj": ("خ-ر-ج", "to emerge, come out, exit", "Emerge / Exit"),
    "jdv": ("ج-د-ث", "grave, sepulcher, tomb", "Grave / Tomb"),
    "kAn": ("ك-و-ن", "to be, exist, happen, become", "Be / Exist"),
    "jrd": ("ج-ر-د", "locusts, swarm stripped of vegetation", "Locusts"),
    "n$r": ("ن-ش-ر", "to scatter, spread abroad, disperse", "Scatter / Disperse"),
    "hTE": ("ه-ط-ع", "to rush with necks outstretched, hurry headlong", "Rush headlong"),
    "kfr": ("ك-ف-ر", "to disbelieve, deny favors, cover truth", "Disbelieve / Deny"),
    "Esr": ("ع-س-ر", "hard, severe, difficult, arduous", "Hard / Difficult"),
    "qbl": ("ق-ب-ل", "before, prior, front, to accept", "Before / Prior"),
    "qwm": ("ق-و-م", "people, nation, tribe, to stand", "People / Nation"),
    "nwH": ("ن-و-ح", "Noah (Prophet)", "Noah"),
    "Ebd": ("ع-ب-د", "servant, slave, worshipper", "Servant / Slave"),
    "jnn": ("ج-ن-ن", "mad, possessed, hidden, jinn", "Mad / Possessed"),
    "dEA": ("د-ع-ا", "to supplicate, pray, call upon", "Supplicate / Call"),
    "rbb": ("ر-ب-ب", "Lord, Sustainer, Master, Cherisher", "Lord / Sustainer"),
    "glb": ("غ-ل-ب", "to vanquish, overcome, overpower", "Vanquish / Overcome"),
    "nSr": ("ن-ص-ر", "to help, grant victory, defend", "Help / Victory"),
    "ftH": ("ف-ت-ح", "to open, unlock, grant victory", "Open / Unlock"),
    "Abw": ("أ-ب-و", "doors, gates, portals", "Gates / Portals"),
    "smw": ("س-م-و", "sky, heaven, celestial heights", "Sky / Heaven"),
    "myh": ("م-و-ه", "water, flood, torrential stream", "Water / Flood"),
    "hmr": ("ه-م-ر", "to pour down abundantly, burst forth", "Pour down"),
    "fjr": ("ف-ج-ر", "to gush forth, break open, erupt", "Gush forth"),
    "ArD": ("أ-ر-ض", "earth, land, ground", "Earth / Ground"),
    "Eyn": ("ع-ي-ن", "spring, fountain, eye", "Spring / Fountain"),
    "ltq": ("ل-ق-ي", "to meet, converge, unite", "Meet / Converge"),
    "qdr": ("ق-د-ر", "to measure, decree, destiny, ordain", "Decree / Measure"),
    "Hml": ("ح-م-ل", "to carry, bear, convey upon", "Carry / Convey"),
    "lHw": ("ل-و-ح", "planks, broad timbers, tablets", "Planks / Boards"),
    "dsr": ("د-س-ر", "nails, caulking, fiber bindings", "Nails / Bindings"),
    "jry": ("ج-ر-ي", "to sail, float, run smoothly", "Sail / Flow"),
    "jzy": ("ج-ز-ي", "recompense, retribution, reward", "Recompense"),
    "trk": ("ت-ر-ك", "to leave behind, abandon, preserve as sign", "Leave behind"),
    "mdd": ("م-د-د", "to remember, heed, contemplate", "Remember / Heed"),
    "*kr": ("ذ-ك-ر", "to remember, remind, admonish", "Reminder / Heed"),
    "kyf": ("ك-ي-ف", "how, in what wondrous manner", "How"),
    "E*b": ("ع-ذ-ب", "punishment, torment, chastisement", "Punishment / Torment"),
    "ysr": ("ي-س-ر", "to make easy, facilitate, smooth", "Make easy"),
    "qrA": ("ق-ر-أ", "to recite, read, Quran", "Recite / Quran"),
    "Ewd": ("ع-و-د", "'Ad (ancient people), to return", "Ad"),
    "Ars": ("أ-ر-س", "to send forth, dispatch", "Send forth"),
    "ryH": ("ر-ي-ح", "wind, violent hurricane", "Wind / Gale"),
    "SrS": ("ص-ر-ص", "furious, roaring, freezing wind", "Roaring / Frigid"),
    "nHz": ("ن-ح-س", "calamitous, ill-omened, sinister", "Calamitous / Sinister"),
    "nzE": ("ن-ز-ع", "to tear away, pluck out, uproot", "Tear away / Uproot"),
    "nAs": ("ن-و-س", "people, human beings", "People / Mankind"),
    "Ejz": ("ع-ج-ز", "trunks, stumps, hollow bases", "Trunks / Stumps"),
    "nxl": ("ن-خ-ل", "date palm trees", "Date palms"),
    "qEr": ("ق-ع-ر", "uprooted, hollowed out, unseated", "Uprooted / Hollowed"),
    "vmd": ("ث-م-د", "Thamud (ancient people)", "Thamud"),
    "b$r": ("ب-ش-ر", "mortal human, skin, human being", "Mortal / Human"),
    "wHd": ("و-ح-د", "one, single, alone", "One / Single"),
    "Dll": ("ض-ل-ل", "error, astray, losing the right path", "Astray / Error"),
    "sEr": ("س-ع-ر", "blazing fire, madness, frenzy", "Blazing fire / Frenzy"),
    "Alq": ("أ-ل-ق", "to cast down, bestow, reveal upon", "Cast / Bestow"),
    "bnn": ("ب-ي-ن", "between, among, distinct", "Between / Among"),
    "bll": ("ب-ل-ل", "nay, rather, on the contrary", "Rather / Nay"),
    "A$r": ("أ-ش-ر", "insolent, arrogant, boastful liar", "Insolent / Boastful"),
    "Elm": ("ع-ل-م", "to know, perceive, realize", "Know / Realize"),
    "gdw": ("غ-د-و", "tomorrow, early morning, next day", "Tomorrow / Early"),
    "ftn": ("ف-ت-ن", "trial, test, examination, affliction", "Trial / Test"),
    "rqb": ("ر-ق-ب", "to watch, observe patiently, wait", "Watch / Observe"),
    "Sbr": ("ص-ب-ر", "to endure with patience, be steadfast", "Be patient"),
    "nbt": ("ن-ب-أ", "to inform, announce, tell news", "Inform / Notify"),
    "qsm": ("ق-س-م", "apportionment, share, divided drinking", "Share / Division"),
    "HDr": ("ح-ض-ر", "to attend, be present, witnessed", "Attend / Witness"),
    "ndy": ("ن-د-و", "to call out, summon companion", "Call out / Summon"),
    "SHb": ("ص-ح-ب", "companion, fellow, comrade", "Companion"),
    "ETw": ("ع-ط-و", "to take boldly, grasp, venture", "Grasp / Hamstring"),
    "Eqr": ("ع-ق-ر", "to hamstring, slaughter she-camel", "Hamstring / Slaughter"),
    "SyH": ("ص-ي-ح", "mighty blast, shriek, thunderous cry", "Mighty blast / Shriek"),
    "H$m": ("ح-ش-م", "trampled dry twigs, crushed stalks", "Dry twigs / Fence"),
    "mHt": ("ح-ظ-ر", "builder of sheepfold / thorn enclosure", "Enclosure builder"),
    "lwt": ("ل-و-ط", "Lot (Prophet)", "Lot"),
    "HSb": ("ح-ص-ب", "shower of pelting stones, gale", "Pelting stones"),
    "All": ("أ-ه-ل", "family, people, household", "Family / Household"),
    "njw": ("ن-ج-و", "to save, deliver, rescue", "Rescue / Deliver"),
    "sHr": ("س-ح-ر", "last part of night, early dawn", "Early dawn"),
    "nEm": ("ن-ع-م", "favor, grace, bounty, blessing", "Blessing / Favor"),
    "End": ("ع-ن-د", "presence, from, near", "Presence / From"),
    "bT$": ("ب-ط-ش", "violent seizure, mighty strike", "Seizure / Strike"),
    "mry": ("م-ر-ي", "to dispute, doubt, wrangle over", "Dispute / Wrangle"),
    "rwd": ("ر-و-د", "to solicit, demand dishonorable entry", "Solicit / Seduce"),
    "Dyf": ("ض-ي-ف", "guests, visitors", "Guests"),
    "Tms": ("ط-م-س", "to obliterate, blind, efface sight", "Obliterate / Blind"),
    "*wq": ("ذ-و-ق", "to taste, experience directly", "Taste / Experience"),
    "Sbb": ("ص-ب-ب", "to pour down upon, descend early", "Pour down"),
    "bkr": ("ب-ك-ر", "early morning, daybreak", "Early morning"),
    "mst": ("م-س-ت", "settled, abiding, perpetual", "Settled / Abiding"),
    "Al": ("أ-و-ل", "dynasty, family, followers", "Dynasty / Family"),
    "frE": ("ف-ر-ع", "Pharaoh", "Pharaoh"),
    "Axd": ("أ-خ-ذ", "to seize, punish, capture", "Seize / Punish"),
    "Ezz": ("ع-ز-ز", "mighty, invincible, all-honored", "Mighty / Invincible"),
    "xyr": ("خ-ي-ر", "better, superior, good", "Better / Superior"),
    "Awl": ("أ-و-ل", "those, these people", "Those"),
    "brA": ("ب-ر-ء", "exemption, immunity, clearance", "Immunity / Clearance"),
    "zbr": ("ز-ب-ر", "written scriptures, divine books", "Scriptures / Books"),
    "jme": ("ج-م-ع", "host, multitude, combined force", "Multitude / Force"),
    "mnS": ("ن-ص-ر", "victorious, defended, triumphant", "Victorious / Defended"),
    "hzm": ("ه-ز-م", "to be routed, broken, defeated", "Routed / Defeated"),
    "wly": ("و-ل-ي", "to turn backs in flight, flee", "Turn back / Flee"),
    "dbr": ("د-ب-ر", "backs, retreat, behind", "Backs / Retreat"),
    "mwd": ("و-ع-د", "appointed meeting, promised hour", "Appointed time"),
    "dhy": ("د-ه-ي", "more calamitous, catastrophic", "More calamitous"),
    "jrm": ("ج-ر-م", "criminals, wicked transgressors", "Criminals / Transgressors"),
    "sHb": ("س-ح-ب", "to drag along on faces", "Drag / Pull"),
    "wjh": ("و-ج-ه", "faces, countenances", "Faces"),
    "sqr": ("س-ق-ر", "Saqar (raging Hellfire)", "Saqar / Hellfire"),
    "xlq": ("خ-ل-ق", "to create, fashion, originate", "Create / Fashion"),
    "lH": ("ل-م-ح", "glance, blink, twinkling of eye", "Twinkling / Glance"),
    "$yE": ("ش-ي-ع", "counterparts, factions, past kinds", "Counterparts / Factions"),
    "str": ("س-ط-ر", "written in lines, recorded in ledger", "Recorded / Inscribed"),
    "Sgr": ("ص-غ-ر", "small, minute, minor", "Small / Minor"),
    "kbr": ("ك-ب-ر", "great, massive, major", "Great / Major"),
    "mtq": ("و-ق-ي", "God-fearing, righteous, mindful", "Righteous / God-fearing"),
    "jnt": ("جنن", "gardens of paradise, bliss", "Gardens / Paradise"),
    "nhr": ("ن-ه-ر", "flowing rivers, streams, abundance", "Rivers / Streams"),
    "mqE": ("ق-ع-د", "seat, assembly, place of honor", "Seat / Assembly"),
    "Sdq": ("ص-د-ق", "truth, sincere honor, righteousness", "Truth / Honor"),
    "mlk": ("م-ل-ك", "Sovereign King, Supreme Ruler", "Sovereign King")
}

def get_root_info(root_bw):
    if not root_bw:
        return None, None, None
    if root_bw in ROOT_DICT:
        return ROOT_DICT[root_bw]
    ar = bw_to_ar(root_bw)
    hyphen = "-".join(list(ar))
    return hyphen, "classical triliteral root", ar

FORM_MAP = {
    "(I)": ("Form I", "فَعَلَ", "Basic stem action"),
    "(II)": ("Form II", "فَعَّلَ", "Causative / Intensive action"),
    "(III)": ("Form III", "فَاعَلَ", "Associative / Reciprocal action"),
    "(IV)": ("Form IV", "أَفْعَلَ", "Causative / Transitive instigation"),
    "(V)": ("Form V", "تَفَعَّلَ", "Reflexive of Form II / Gradual action"),
    "(VI)": ("Form VI", "تَفَاعَلَ", "Reciprocal / Simulated mutual action"),
    "(VII)": ("Form VII", "اِنْفَعَلَ", "Passive / Involuntary receptive action"),
    "(VIII)": ("Form VIII", "اِفْتَعَلَ", "Reflexive / Middle Voice / Earnest effort"),
    "(IX)": ("Form IX", "اِفْعَلَّ", "Acquiring color or physical attribute"),
    "(X)": ("Form X", "اِسْتَفْعَلَ", "Seeking, beseeching, or considering")
}

def analyze_soundness(root_bw):
    if not root_bw:
        return "sound", "صحيح"
    if "'" in root_bw or ">" in root_bw or "<" in root_bw:
        return "sahih_mahmuz", "صحيح مهموز (Hamzated)"
    if len(root_bw) == 3 and root_bw[1] == root_bw[2]:
        return "sahih_muda'af", "صحيح مضعف (Geminated / Doubled)"
    if root_bw.startswith(('w', 'y')):
        return "mu'tal_mithal", "معتل مثال (First-weak / Assimilated)"
    if len(root_bw) == 3 and root_bw[1] in ('w', 'y', 'A'):
        return "mu'tal_ajwaf", "معتل أجوف (Second-weak / Hollow)"
    if root_bw.endswith(('w', 'y', 'A', 'Y')):
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
    'ساعة': 'فَاعِلَة', 'قمر': 'فَعَل', 'آية': 'فَعَلَة', 'سحر': 'فِعْل',
    'أمر': 'فَعْل', 'كل': 'فُعْل', 'أنباء': 'أَفْعَال', 'حكمة': 'فِعْلَة',
    'بالغة': 'فَاعِلَة', 'نذر': 'فُعُل', 'يوم': 'فَعْل', 'داع': 'فَاعِل',
    'شيء': 'فَعْل', 'نكر': 'فُعُل', 'خشعا': 'فُعَّل', 'أبصار': 'أَفْعَال',
    'أجداث': 'أَفْعَال', 'جراد': 'فَعَال', 'كافرون': 'فَاعِلُونَ', 'عسر': 'فَعِل',
    'قوم': 'فَعْل', 'نوح': 'فَعْل', 'عبد': 'فَعْل', 'مجنون': 'مَفْعُول',
    'رب': 'فَعْل', 'أبواب': 'أَفْعَال', 'سماء': 'فَعَال', 'ماء': 'فَعَل',
    'أرض': 'فَعْل', 'عيون': 'فُعُول', 'قدر': 'فَعَل', 'ألواح': 'أَفْعَال',
    'دسر': 'فُعُل', 'أعين': 'أَفْعُل', 'جزاء': 'فَعَال', 'عذاب': 'فَعَال',
    'قرآن': 'فُعْلَان', 'ذكر': 'فِعْل', 'عاد': 'فَعْل', 'ريح': 'فِعْل',
    'صرصر': 'فَعْلَل', 'نحس': 'فَعْل', 'ناس': 'فَعَل', 'أعجاز': 'أَفْعَال',
    'نخل': 'فَعْل', 'ثمود': 'فَعُول', 'بشر': 'فَعَل', 'واحد': 'فَاعِل',
    'ضلال': 'فَعَال', 'سعر': 'فُعُل', 'أشر': 'فَعِل', 'غد': 'فَعَل',
    'فتنة': 'فِعْلَة', 'ناقة': 'فَاعِلَة', 'قسمة': 'فِعْلَة', 'شرب': 'فِعْل',
    'صاحب': 'فَاعِل', 'صيحة': 'فَعْلَة', 'واحدة': 'فَاعِلَة', 'هشيم': 'فَعِيل',
    'لوط': 'فَعْل', 'حاصب': 'فَاعِل', 'آل': 'فَعَل', 'سحر': 'فَعَل',
    'نعمة': 'فِعْلَة', 'بطشة': 'فَعْلَة', 'ضيف': 'فَعْل', 'بكرة': 'فُعْلَة',
    'فرعون': 'فِعْلَوْن', 'عزيز': 'فَعِيل', 'خير': 'فَعْل', 'براءة': 'فَعَالَة',
    'زبر': 'فُعُل', 'جمع': 'فَعْل', 'جميع': 'فَعِيل', 'دبر': 'فُعُل',
    'موعد': 'مَفْعِل', 'أدهى': 'أَفْعَل', 'مجرمون': 'مُفْعِلُونَ', 'وجوه': 'فُعُول',
    'سقر': 'فَعَل', 'مس': 'فَعْل', 'لمح': 'فَعْل', 'بصر': 'فَعَل',
    'أشياع': 'أَفْعَال', 'صغير': 'فَعِيل', 'كبير': 'فَعِيل', 'متقين': 'مُفْتَعِلِينَ',
    'جنات': 'فَعَلَات', 'نهر': 'فَعَل', 'مقعد': 'مَفْعَل', 'صدق': 'فِعْل',
    'مليك': 'فَعِيل', 'مستمر': 'مُسْتَفْعِل', 'مستقر': 'مُسْتَفْعَل', 'مزدجر': 'مُفْتَعَل',
    'منهمر': 'مُنْفَعِل', 'مدكر': 'مُفْتَعِل', 'منتشر': 'مُفْتَعِل', 'مهطعين': 'مُفْعِلِينَ',
    'منقعر': 'مُنْفَعِل', 'محتظر': 'مُفْتَعِل', 'مقتدر': 'مُفْتَعِل',
    'كذاب': 'فَعَّال', 'مغلوب': 'مَفْعُول', 'بين': 'فَعْل', 'قبل': 'فَعْل', 'عند': 'فِعْل', 'كيف': 'فَعْل', 'نار': 'فَعَل',
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

THEMATIC_SECTIONS = [
    {
        "section_id": 1,
        "ayah_range": "1-8",
        "title_en": "The Splitting of the Moon & The Warning to Mecca",
        "title_ar": "اقتراب الساعة وانشقاق القمر وإعراض الكفار",
        "color": "#2563eb",
        "summary": "The Hour has drawn near and the moon has split, yet the deniers dismiss this cosmic miracle as fleeting sorcery. They follow their whims, ignore all deterrent reports, and will soon emerge from their graves like scattered locusts rushing toward the caller on a dreadful day."
    },
    {
        "section_id": 2,
        "ayah_range": "9-17",
        "title_en": "The People of Nuh (Noah) & The Cataclysmic Deluge",
        "title_ar": "قصة قوم نوح عليه السلام وطوفان الماء المنهمر",
        "color": "#059669",
        "summary": "Before Mecca, Noah's people belied Our servant, calling him mad and driving him off. Noah called upon his Lord: 'I am overcome, so help!' Allah opened the gates of heaven with torrential water and erupted the earth into springs, carrying Noah on an ark of planks and nails. Concludes with the famous Divine Refrain."
    },
    {
        "section_id": 3,
        "ayah_range": "18-22",
        "title_en": "The People of 'Ad & The Violent Frigid Wind",
        "title_ar": "قصة عاد والريح الصرصر العاتية",
        "color": "#d97706",
        "summary": "'Ad denied, and Allah unleashed upon them a screaming, freezing wind on an unrelenting day of sinister calamity, tearing men away like hollow, uprooted palm stumps. Concludes with the Divine Refrain."
    },
    {
        "section_id": 4,
        "ayah_range": "23-32",
        "title_en": "The People of Thamud, Prophet Salih & The She-Camel",
        "title_ar": "قصة ثمود وناقة صالح عليه السلام والصيحة الواحدة",
        "color": "#7c3aed",
        "summary": "Thamud rejected the warnings, refusing to follow a solitary mortal from among themselves. Allah sent the she-camel as a divine test with apportioned water turns. They summoned their companion who boldly hamstrung her. Allah sent a single thunderous blast, leaving them like the crushed, trampled twigs of an animal pen builder. Concludes with the Divine Refrain."
    },
    {
        "section_id": 5,
        "ayah_range": "33-40",
        "title_en": "The People of Lut (Lot) & The Pelting Stones",
        "title_ar": "قصة قوم لوط عليه السلام وحجارة السجيل",
        "color": "#e11d48",
        "summary": "The people of Lot rejected warnings, wrangling in dispute and storming his home demanding dishonorable entry to his angelic guests. Allah obliterated their eyes and sent a storm of pelting stones upon them at daybreak, delivering Lot's family in the early dawn as a grace from Us. Concludes with the Divine Refrain."
    },
    {
        "section_id": 6,
        "ayah_range": "41-42",
        "title_en": "The Dynasty of Pharaoh & The Seizure of the Mighty",
        "title_ar": "قصة آل فرعون والأخذ العزيز المقتدر",
        "color": "#0284c7",
        "summary": "The warnings came to the dynasty of Pharaoh, but they denied all of Allah's signs, so Allah seized them with the seizure of an Almighty, All-Powerful Sovereign."
    },
    {
        "section_id": 7,
        "ayah_range": "43-53",
        "title_en": "Direct Challenge to Quraysh & The Inescapable Decree",
        "title_ar": "خطاب كفار قريش ومصير المجرمين في سقر وحقيقة القدر",
        "color": "#ea580c",
        "summary": "Are your disbelievers better than those ancient destroyed superpowers, or do you possess an exemption in the Scriptures? Their combined multitude will be routed. The Hour is their promised meeting—and it is most catastrophic and bitter. The criminals will be dragged into Hellfire on their faces: 'Taste the touch of Saqar!' Everything is created by precise decree, and Allah's command is executed like the twinkling of an eye."
    },
    {
        "section_id": 8,
        "ayah_range": "54-55",
        "title_en": "The Honor & Bliss of the God-Fearing in Paradise",
        "title_ar": "مقام المتقين في جنات ونهر عند مليك مقتدر",
        "color": "#10b981",
        "summary": "In breathtaking contrast, the God-fearing and righteous abide in lush gardens and flowing rivers of Paradise, in an assembly of consummate truth and honor, in the immediate presence of an Omnipotent Sovereign King."
    }
]

REFRAIN_AYAH_NUMBERS = [17, 22, 32, 40]

def deduce_wazn_detailed(primary_type, form, stem_pos, root_bw, text_clean):
    if primary_type == "fi'l":
        if form:
            forms_verb = {
                'I': 'فَعَلَ', 'II': 'فَعَّلَ', 'III': 'فَاعَلَ', 'IV': 'أَفْعَلَ', 'V': 'تَفَعَّلَ',
                'VI': 'تَفَاعَلَ', 'VII': 'اِنْفَعَلَ', 'VIII': 'اِفْتَعَلَ', 'IX': 'اِفْعَلَّ', 'X': 'اِسْتَفْعَلَ'
            }
            return forms_verb.get(form, 'فَعَلَ')
        return 'فَعَلَ'
    elif primary_type == 'ism':
        c_word = clean_arabic_word(text_clean)
        if c_word in NOUN_WAZN_MAP:
            return NOUN_WAZN_MAP[c_word]
        for k, v in NOUN_WAZN_MAP.items():
            if c_word.startswith(k) or k.startswith(c_word):
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
            if text_clean.startswith('م'):
                if 'ِ' in text_clean or text_clean.endswith(('ِرّ', 'ِع', 'ِر', 'دّكر')):
                    return forms_part_act.get(form, 'مُفْتَعِل' if form=='VIII' else 'مُفْعِل')
                else:
                    return forms_part_pass.get(form, 'مُفْتَعَل' if form=='VIII' else 'مُفْعَل')
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

def split_subsegments(text_uthmani, seg_list, primary_type, stem_feat):
    # If 3FS past verb ending in ta' al-ta'neeth
    if primary_type == "fi'l" and 'PERF' in stem_feat and '3FS' in stem_feat:
        m = re.match(r'^(.*َ)(ت[ِْ]?)$', text_uthmani)
        if m:
            base_txt = m.group(1)
            suffix_txt = m.group(2)
            return [
                {
                    "type": "stem",
                    "arabic": base_txt,
                    "pos_tag": "V",
                    "role": "Past active verb stem",
                    "vowel": "fatha"
                },
                {
                    "type": "suffix",
                    "arabic": suffix_txt,
                    "pos_tag": "PRON/FEM",
                    "role": "Feminine marker tā' al-ta'nīth (تاء التأنيث الساكنة)",
                    "vowel": "kasra_transitional" if suffix_txt.endswith('ِ') else "sukun"
                }
            ]
    return None

def derive_word_data(q_word, seg_list, prev_word, next_word):
    loc = q_word['location']
    text_uthmani = q_word['text_uthmani']
    text_imlaei = q_word.get('text_imlaei', text_uthmani)
    transliteration = q_word.get('transliteration', {}).get('text', '')
    translation = q_word.get('translation', {}).get('text', '')
    audio_url = q_word.get('audio_url', '')

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

    root_hyphen, root_desc, root_short = get_root_info(root_bw)
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
        "root_letters": list(bw_to_ar(root_bw)) if root_bw else [],
        "wazn": None,
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
            "transitivity": "intransitive" if v_form in ['VII', 'V'] or root_bw in ['qrb', 'xrj', 'jry'] else "transitive",
            "soundness": sound_key,
            "soundness_ar": sound_ar
        }

    elif primary_type == "ism":
        for fm_key in FORM_MAP:
            if fm_key in stem_feat:
                v_form = fm_key.strip('()')
                break

        gender = "feminine" if 'F' in stem_feat or 'FS' in stem_feat or 'FP' in stem_feat or text_uthmani.endswith(('ة', 'ى', 'اء')) or root_bw in ['ArD', 'smw', 'ryH', 'Eyn'] else "masculine"
        gender_marker = "ta_marbutah (ـة)" if text_uthmani.endswith('ة') else ("alif_maqsura (ـى)" if text_uthmani.endswith('ى') else ("alif_mamduda (ـاء)" if text_uthmani.endswith('اء') else ("semantic_feminine" if gender == "feminine" else "unmarked_masculine")))
        number = "dual" if ('D' in stem_feat or 'MD' in stem_feat or 'FD' in stem_feat) else ("plural" if ('P' in stem_feat or 'MP' in stem_feat or 'FP' in stem_feat) else "singular")
        definiteness = "definite" if any(p['pos'] == 'DET' for p in prefixes) or stem_pos == 'PN' or suffixes else ("indefinite" if 'INDEF' in stem_feat else "definite_by_context")
        
        derivation = "jamid"
        derivation_ar = "اسم جامد"
        if text_uthmani.startswith('مُّ') or text_uthmani.startswith('مُ'):
            if 'ِ' in text_uthmani or text_uthmani.endswith(('ِرٌّ', 'ِعٌ', 'ِرٍ')):
                derivation = "ism_fail"
                derivation_ar = "اسم فاعل (Active Participle)"
            else:
                derivation = "ism_maful"
                derivation_ar = "اسم مفعول (Passive Participle)"
        elif text_uthmani.startswith('مَ'):
            derivation = "ism_makan"
            derivation_ar = "اسم مكان / زمان (Noun of Place/Time)"
        elif root_bw in ['Ezz', 'kbr', 'Hkm', 'E*b', 'Sdq', 'xyr']:
            derivation = "sifa_mushabbaha"
            derivation_ar = "صفة مشبهة (Permanent Adjective)"
        elif text_uthmani.startswith('أَ') and any(text_uthmani.endswith(s) for s in ['ى', 'رّ', 'َر']):
            derivation = "ism_tafdhil"
            derivation_ar = "اسم تفضيل (Comparative / Elative)"

        is_nhp = False
        if number == "plural" and root_bw not in ['kfr', 'mtq', 'jrm', 'nAs', 'SHb', 'rsl', 'Axd']:
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

    sarf_details['wazn'] = deduce_wazn_detailed(primary_type, v_form, stem_pos, root_bw, text_imlaei)

    case_mood = "mabni"
    vowel_ending = "sukun"
    role_en = "particle_or_built"
    role_ar = "مبني"
    why_ending = "Fixed base (مبني) invariable ending."
    idafa_role = "none"
    idafa_notes = None

    if primary_type == "ism":
        if 'NOM' in stem_feat:
            case_mood = "raf"
            vowel_ending = "dhumma" if 'INDEF' not in stem_feat else "tanwin_damm"
            role_en = "subject_or_predicate"
            role_ar = "مرفوع (فاعل / مبتدأ / خبر)"
            why_ending = "Takes Dhumma (ـُ) because it occupies the nominative case (الرفع). Raf' represents the primary, elevated, independent element in the sentence (the subject/initiator of action or topic)."
        elif 'ACC' in stem_feat:
            case_mood = "nasb"
            vowel_ending = "fatha" if 'INDEF' not in stem_feat else "tanwin_fath"
            role_en = "object_or_circumstance"
            role_ar = "منصوب (مفعول به / ظرف / حال)"
            why_ending = "Takes Fatha (ـَ) because it occupies the accusative case (النصب). Nasb represents dependency and subordination, marking the receiver of action (direct object), time/place circumstance, or state."
        elif 'GEN' in stem_feat:
            case_mood = "jarr"
            vowel_ending = "kasra" if 'INDEF' not in stem_feat else "tanwin_kasr"
            role_en = "genitive_annexed_or_prepositional"
            role_ar = "مجرور (بحرف الجر / مضاف إليه)"
            why_ending = "Takes Kasra (ـِ) because it occupies the genitive case (الجر). Jarr represents attachment and subordination, governed by a preceding preposition or serving as the specifying possessor in an Idafa construction."
        else:
            case_mood = "mabni"
            vowel_ending = "fixed"
            why_ending = "Pronoun or demonstrative with fixed base ending (مبني في محل إعراب)."

        if prefixes and any(p['pos'] == 'P' for p in prefixes):
            role_en = "ism_majrur"
            role_ar = "اسم مجرور بحرف الجر"
            case_mood = "jarr"
            vowel_ending = "kasra" if 'INDEF' not in stem_feat else "tanwin_kasr"
            p_text = bw_to_ar(prefixes[0]['bw'])
            why_ending = f"Takes Kasra (ـِ) because it is governed by the preceding preposition '{p_text}' (حرف جر). In Arabic grammar, prepositions pull following nouns into the genitive state (Jarr)."

    elif primary_type == "fi'l":
        if 'PERF' in stem_feat:
            case_mood = "mabni"
            vowel_ending = "fatha_base"
            role_en = "past_verb"
            role_ar = "فعل ماضٍ مبني على الفتح"
            why_ending = "Built on Fatha (مبني على الفتح) because all past-tense verbs have a fixed consonantal base in Arabic."
            if suffixes and any('PRON:3MP' in s['features'] for s in suffixes):
                vowel_ending = "damma_plural"
                why_ending = "Built on Dammah (مبني على الضم) due to connection with the plural Waw (واو الجماعة)."
            elif suffixes and any('PRON:1P' in s['features'] for s in suffixes):
                vowel_ending = "sukun_we"
                why_ending = "Built on Sukun (مبني على السكون) due to connection with the first-person plural subject pronoun 'nā' (نا الفاعلين)."
        elif 'IMPF' in stem_feat:
            if 'MOOD:JUS' in stem_feat:
                case_mood = "jazm"
                vowel_ending = "hazf_noon_or_sukun"
                role_en = "jussive_verb"
                role_ar = "فعل مضارع مجزوم"
                why_ending = "Jussive mood (مجزوم) marked by Sukun or omission of Noon (حذف النون) because it is governed by a jussive particle or occurs as the condition/response in a conditional sentence."
            elif 'MOOD:SUBJ' in stem_feat:
                case_mood = "nasb"
                vowel_ending = "fatha"
                role_en = "subjunctive_verb"
                role_ar = "فعل مضارع منصوب"
                why_ending = "Subjunctive mood (منصوب) marked by Fatha or omission of Noon because it follows a subjunctive particle (أن / لن / كي / حتى)."
            else:
                case_mood = "raf"
                vowel_ending = "dhumma"
                role_en = "indicative_verb"
                role_ar = "فعل مضارع مرفوع"
                why_ending = "Default indicative mood (مرفوع بالضمة) because it is free from preceding accusative or jussive particles."
        elif 'IMPV' in stem_feat:
            case_mood = "mabni"
            vowel_ending = "sukun_command"
            role_en = "imperative_verb"
            role_ar = "فعل أمر مبني على السكون"
            why_ending = "Built on Sukun (مبني على السكون) as a direct imperative command."

    elif primary_type == "harf":
        case_mood = "mabni"
        vowel_ending = "sukun_or_fath"
        role_en = "particle"
        role_ar = "حرف مبني لا محل له من الإعراب"
        why_ending = "Particles are inherently Mabni (fixed base) and do not inflect for case endings."

    # Sub-segmentation (Lowest Level)
    morphemes = []
    seg_idx = 1
    
    # 1. Prefixes
    for p in prefixes:
        p_ar = bw_to_ar(p['bw'])
        p_pos = p['pos']
        color = "#d97706"
        p_meaning = "and (conjunction)" if p_ar == "وَ" else ("then/so (conjunction)" if p_ar == "فَ" else ("the (definite article)" if p_pos == "DET" else ("with/by (preposition)" if p_ar == "بِ" else ("for/to (preposition/emphatic)" if p_ar == "لِ" else ("certainly (emphatic lam)" if p_ar == "لَ" else ("will (future)" if p_ar == "سَ" else "prefix particle"))))))
        morphemes.append({
            "segment_index": seg_idx,
            "arabic": p_ar,
            "transliteration": p['bw'],
            "type": "prefix",
            "pos_tag": p_pos,
            "role": p_meaning,
            "vowel": "fatha" if p_ar in ['وَ', 'فَ', 'لَ'] else ("kasra" if p_ar in ['بِ', 'لِ'] else "sukun"),
            "color_code": color,
            "color_name": "amber_prefix"
        })
        seg_idx += 1

    # Check sub-segmentation on stem
    sub_segs = split_subsegments(text_uthmani, seg_list, primary_type, stem_feat)
    if sub_segs:
        for ssub in sub_segs:
            c_code = COLOR_SCHEME['mabni']['color'] if ssub['type'] == 'stem' else "#ec4899"
            morphemes.append({
                "segment_index": seg_idx,
                "arabic": ssub['arabic'],
                "transliteration": ssub['arabic'],
                "type": ssub['type'],
                "pos_tag": ssub['pos_tag'],
                "role": ssub['role'],
                "vowel": ssub['vowel'],
                "color_code": c_code,
                "color_name": f"{ssub['type']}_subsegment"
            })
            seg_idx += 1
    else:
        if stem_seg:
            stem_ar = bw_to_ar(stem_seg['bw'])
            color = COLOR_SCHEME[case_mood]['color']
            morphemes.append({
                "segment_index": seg_idx,
                "arabic": stem_ar,
                "transliteration": stem_seg['bw'],
                "type": "stem",
                "pos_tag": stem_pos,
                "role": f"Core lexical stem ({translation})",
                "vowel": vowel_ending,
                "color_code": color,
                "color_name": f"{case_mood}_stem"
            })
            seg_idx += 1

    # 3. Suffixes
    for s in suffixes:
        s_ar = bw_to_ar(s['bw'])
        s_feat = s['features']
        s_meaning = "attached pronoun" if 'PRON' in s_feat else ("feminine marker tā'" if 't' in s['bw'] else "suffix marker")
        if '3MP' in s_feat:
            s_meaning = "they / their (3rd masc. plural pronoun)"
        elif '3MS' in s_feat:
            s_meaning = "him / his (3rd masc. singular pronoun)"
        elif '1P' in s_feat:
            s_meaning = "we / our (1st person plural pronoun)"
        elif '2MS' in s_feat:
            s_meaning = "you / your (2nd masc. singular pronoun)"
        elif '2MP' in s_feat:
            s_meaning = "you all / your (2nd masc. plural pronoun)"
            
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

    if next_word and 'GEN' in next_word.get('features', '') and primary_type == 'ism':
        if not text_uthmani.startswith('ٱل') and 'ٌ' not in text_uthmani and 'ٍ' not in text_uthmani and 'ً' not in text_uthmani:
            idafa_role = "mudhaf"
            idafa_notes = "Functioning as Mudhaf (المضاف): enters construct state, loses Tanween and drops definite article ال."

    word_obj = {
        "id": q_word['id'],
        "location": loc,
        "surah": 54,
        "ayah": int(loc.split(':')[1]),
        "word_position": int(loc.split(':')[2]),
        "arabic_uthmani": text_uthmani,
        "arabic_clean": text_imlaei,
        "transliteration": transliteration,
        "translation": translation,
        "audio_url": f"https://audio.qurancdn.com/{audio_url}" if audio_url else None,
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
            "why_this_ending": why_ending,
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

# Iterate over all 55 verses
verses_output = []
all_words_flat = []

for v_idx, v in enumerate(quran_raw['verses']):
    ay_num = v['verse_number']
    raw_words = [w for w in v['words'] if w['char_type_name'] == 'word']
    
    section = None
    for sec in THEMATIC_SECTIONS:
        r_start, r_end = map(int, sec['ayah_range'].split('-'))
        if r_start <= ay_num <= r_end:
            section = sec
            break

    verse_words = []
    for w_idx, q_w in enumerate(raw_words):
        loc = q_w['location']
        seg_list = corpus_words.get(loc, [])
        
        prev_w = raw_words[w_idx - 1] if w_idx > 0 else None
        next_w = raw_words[w_idx + 1] if w_idx < len(raw_words) - 1 else None
        
        next_feat = corpus_words.get(next_w['location'], [{}])[0].get('features', '') if next_w else ''
        
        w_obj = derive_word_data(q_w, seg_list, prev_w, {'features': next_feat} if next_w else None)
        verse_words.append(w_obj)
        all_words_flat.append(w_obj)

    verse_obj = {
        "ayah_number": ay_num,
        "surah_number": 54,
        "text_uthmani": " ".join(w['text_uthmani'] for w in raw_words),
        "text_imlaei": " ".join(w.get('text_imlaei', w['text_uthmani']) for w in raw_words),
        "translation": v['translations'][0]['text'] if 'translations' in v and v['translations'] else "",
        "thematic_section_id": section['section_id'] if section else 1,
        "thematic_section_title": section['title_en'] if section else "",
        "thematic_color": section['color'] if section else "#2563eb",
        "is_divine_refrain": ay_num in REFRAIN_AYAH_NUMBERS,
        "refrain_lesson": "«وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ» — And We have certainly made the Quran easy for remembrance, so is there any who will remember?" if ay_num in REFRAIN_AYAH_NUMBERS else None,
        "words_count": len(verse_words),
        "words": verse_words
    }
    verses_output.append(verse_obj)

# Assemble Complete Dataset
full_dataset = {
    "metadata": {
        "title": "Surah Al-Qamar (سورة القمر) — Exhaustive Grammatical, Morphological & Color-Coded Dataset",
        "surah_number": 54,
        "surah_name_ar": "سورة القمر",
        "surah_name_en": "Surah Al-Qamar",
        "surah_name_translation": "The Moon",
        "revelation_type": "Meccan (مكية)",
        "chronological_order": 37,
        "total_verses": len(verses_output),
        "total_words": len(all_words_flat),
        "total_morphemes": sum(w['lowest_level_breakdown']['morphemes_count'] for w in all_words_flat),
        "version": "1.0.0",
        "updated_at": "2026-09-02 18:30",
        "compiler": "Antigravity Arabic Grammar Intelligence System",
        "guideline_basis": "Arabic grammar teaching system: A comprehensive guide to classification, morphology, pedagogy, and i'rab vowel color-coding",
        "license": "Open Data for Quranic Education (incorporating Quranic Arabic Corpus annotations by Kais Dukes under GPL)",
        "footer_version": "v1.0.0 (updated 2026-09-02 18:30)"
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
    "thematic_sections": THEMATIC_SECTIONS,
    "verses": verses_output,
    "root_index": {
        "total_unique_roots": len(ROOT_DICT),
        "roots": [
            {
                "root_bw": k,
                "root_ar": v[0],
                "meaning_en": v[1],
                "concept_en": v[2]
            }
            for k, v in sorted(ROOT_DICT.items())
        ]
    }
}

output_filename = "surah-al-qamar.json"
with open(output_filename, 'w', encoding='utf-8') as f:
    json.dump(full_dataset, f, ensure_ascii=False, indent=2)

print(f"SUCCESS: Generated {output_filename}")
print(f"Total Verses: {len(verses_output)}")
print(f"Total Words: {len(all_words_flat)}")
print(f"File size: {round(len(json.dumps(full_dataset, ensure_ascii=False)) / 1024, 1)} KB")
