/**
 * Master TypeScript Definitions for Quranic Linguistic Intelligence System
 * Version: v1.0.5 (updated 2026-09-03 00:58)
 */

export type ColorMode = 'pos' | 'case' | 'syntax';

export type AiLevel = 'beginner' | 'intermediate' | 'advanced';

export type PosClass =
  | 'verb-past'
  | 'verb-present'
  | 'verb-imperative'
  | 'noun'
  | 'preposition'
  | 'particle'
  | 'negative'
  | 'pronoun';

export type CaseClass =
  | 'case-marfoo'
  | 'case-mansoob'
  | 'case-majroor'
  | 'case-mabni';

export interface SyntaxEdge {
  from: string;
  to: string;
  relation: string;
  description?: string;
}

export interface QuranToken {
  id: string; // e.g. "108:1:2"
  text: string;
  lemma: string;
  root: string | null;
  root_letters?: string[];
  pos_class: PosClass;
  pos_label: string;
  case_class: CaseClass;
  syntax_class: string;
  irab: string;
  tooltip: string;
  wazn: string;
  verb_form?: number;
  tense?: 'past' | 'present' | 'imperative';
  ai_explanations: Record<AiLevel, string>;
  syntax_tree: SyntaxEdge[];
  similar_quran_examples: Array<{
    ayah: string;
    text: string;
    explanation: string;
  }>;
  same_root_words: Array<{
    word: string;
    ayah: string;
    meaning: string;
  }>;
  same_pattern_words: Array<{
    pattern: string;
    words: string[];
  }>;
}

export interface Verse {
  id: string;
  number: number;
  text_uthmani: string;
  translation: string;
  transliteration: string;
  tokens: QuranToken[];
}

export interface OntologyConcept {
  token: string;
  concept: string;
  description: string;
}

export interface BalaghahFeature {
  type: string;
  word?: string;
  pattern?: string[];
  rhyme?: string;
  effect: string;
}

export interface KnowledgeGraphEdge {
  from: string;
  to: string;
  relation: string;
}

export interface SurahData {
  surah_id: number;
  surah_name_ar: string;
  surah_name_en: string;
  meaning: string;
  classification: 'Makki' | 'Madani';
  total_verses: number;
  total_words: number;
  total_letters: number;
  verses: Verse[];
  ontology?: OntologyConcept[];
  balaghah?: BalaghahFeature[];
  knowledge_graph?: KnowledgeGraphEdge[];
}

/**
 * Master Architecture v2.0 — 4-Level Linguistic Ontology
 */
export interface MorphemeItem {
  morpheme_id: string; // e.g. "1:5:3:1"
  text: string;
  type: 'prefix' | 'stem' | 'suffix' | string;
  pos_ar: string;
  function?: string;
  meaning?: string;
  i3rab_ar?: string;
}

export interface RhetoricContrast {
  device: string;
  device_en?: string;
  ordinary_order?: string;
  quranic_order?: string;
  effect: string;
  contrast?: {
    ordinary_meaning: string;
    quranic_meaning: string;
  };
}

export interface VerbConjugation {
  past: string;
  present: string;
  imperative: string;
  first_person_singular?: string;
  first_person_plural?: string;
  second_person_singular_m?: string;
  third_person_singular_m?: string;
}

export interface SarfAdvancedDerivation {
  root: string;
  theoretical_origin?: string;
  phonological_steps?: string[];
  semantic_value_of_form?: string;
  note?: string;
}

export interface GrammarSubject {
  type: string; // e.g. "ضمير مستتر وجوبا"
  taqdir: string; // e.g. "نحن"
  person?: 'first' | 'second' | 'third';
  number?: 'singular' | 'dual' | 'plural';
  i3rab_ar?: string;
}

export interface TeachingLayerItem {
  lesson: string;
  grammar?: string;
  sarf?: string;
  rhetoric?: string;
}

export interface TeachingLayers {
  beginner: TeachingLayerItem;
  intermediate: TeachingLayerItem;
  advanced: TeachingLayerItem;
}

export interface AlternativeAnalysisItem {
  topic: string;
  analysis: string;
  scholars_or_schools?: string[];
  source?: string;
  confidence?: 'mutawatir' | 'high' | 'medium' | 'disputed';
}

export interface MasterAyahWord {
  word_id: number;
  position: number;
  surface_uthmani: string;
  surface_simple: string;
  lemma: string;
  root: string | null;
  has_root: boolean;
  word_type: string;
  pos: string;
  subtype?: string;
  english_gloss: string[];
  meaning_in_context: string;
  morphemes: MorphemeItem[];
  morphology: {
    sarf_applicable: boolean;
    is_verb: boolean;
    form?: string;
    form_number?: number;
    pattern?: string | null;
    tense?: string;
    mood?: string;
    voice?: string;
    transitivity?: string;
    masdar?: string;
    pronoun_type?: string;
    person?: string;
    gender?: string;
    number?: string;
    grammatical_state?: string;
  };
  conjugation?: VerbConjugation;
  sarf_advanced_derivation?: SarfAdvancedDerivation;
  grammar: {
    i3rab: {
      case: string;
      case_reason: string;
      visible_marker: string;
      i3rab_ar: string;
    };
    subject?: GrammarSubject;
    syntactic_role: string | string[];
    sentence_role?: string;
    governor?: {
      word_id: number;
      surface: string;
      role: string;
    };
    case_ending?: string;
  };
  rhetoric?: RhetoricContrast;
  visual: {
    category: string;
    color_group: string;
    highlight?: boolean;
    expandable?: boolean;
  };
}

export interface MasterAyah {
  schema_version: '2.0';
  ayah: {
    surah_number: number;
    surah_name_ar: string;
    surah_name_en: string;
    ayah_number: number;
    juz: number;
    hizb?: number | null;
    rub?: number | null;
    page_madinah_mushaf?: number | null;
    revelation_place: 'Makkah' | 'Madinah';
    revelation_order?: number | null;
    text_uthmani: string;
    text_simple: string;
    orthographic_word_count: number;
    morpheme_count: number;
    ayah_end_marker: boolean;
  };
  translations: {
    english: {
      literal: string;
      natural: string;
      easy: string;
    };
    norwegian?: {
      natural: string;
    };
  };
  ayah_meaning: {
    main_meaning: string;
    simple_explanation: string;
    key_message: string;
    practical_takeaway: string;
  };
  context: {
    previous_ayah_connection: {
      previous_ayah: string;
      connection: string;
      lesson?: string;
    };
    next_ayah_connection: {
      next_ayah: string;
      connection: string;
      lesson?: string;
    };
  };
  words: MasterAyahWord[];
  teaching_layers: TeachingLayers;
  alternative_analyses: AlternativeAnalysisItem[];
  sources: {
    quran_text_source: string;
    grammar_sources: string[];
    tafsir_sources: string[];
    source_verification_status: 'verified' | 'pending' | 'needs_review';
  };
}

