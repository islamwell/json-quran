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
