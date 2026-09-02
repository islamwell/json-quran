/**
 * Visual Styling & Color Dimensions for Quranic Grammar
 * Version: v1.0.5 (updated 2026-09-03 00:58)
 */

import { ColorMode, PosClass, CaseClass } from '../types/quran';

export const GRAMMAR_COLORS = {
  // Parts of Speech (User's Exact Palette)
  pos: {
    verbPast: '#0D47A1',        // Deep Blue with pulsePast
    verbPresent: '#2196F3',     // Sky Blue with pulsePresent
    verbImperative: '#00BCD4',  // Glowing Cyan with 0 0 14px text-shadow
    noun: '#4CAF50',            // Vibrant Emerald Green
    preposition: '#9C27B0',     // Purple
    particle: '#7B1FA2',        // Deep Violet / Magenta
    negative: '#E53935',        // Crimson Red
    pronoun: '#F57C00',         // Amber Orange
  },

  // Grammatical Cases (I'rab)
  case: {
    marfoo: '#2563eb',          // Nominative (Raf' / Dhumma)
    mansoob: '#059669',         // Accusative (Nasb / Fatha)
    majroor: '#7c3aed',         // Genitive (Jarr / Kasra)
    majzoom: '#d97706',         // Jussive (Jazm / Sukun)
    mabni: '#64748b',           // Invariable (Mabni / Fixed)
  },

  // Syntax Roles
  syntax: {
    inna: '#d97706',            // Emphatic particles & governors
    subject: '#dc2626',         // Ism Inna / Fa'il
    predicate: '#2563eb',       // Khabar Inna / Predicate
    object: '#059669',          // Maf'ul bihi
    verb: '#0284c7',            // Verbal predicate
    preposition: '#7c3aed',     // Jar wa majroor
    pronoun: '#e11d48',         // Damir fasl
  }
};

export function getWordColor(
  mode: ColorMode,
  posClass: PosClass,
  caseClass: CaseClass,
  syntaxClass: string
): string {
  if (mode === 'case') {
    switch (caseClass) {
      case 'case-marfoo': return GRAMMAR_COLORS.case.marfoo;
      case 'case-mansoob': return GRAMMAR_COLORS.case.mansoob;
      case 'case-majroor': return GRAMMAR_COLORS.case.majroor;
      case 'case-mabni': return GRAMMAR_COLORS.case.mabni;
      default: return '#334155';
    }
  }

  if (mode === 'syntax') {
    if (syntaxClass.includes('inna')) return GRAMMAR_COLORS.syntax.inna;
    if (syntaxClass.includes('subject')) return GRAMMAR_COLORS.syntax.subject;
    if (syntaxClass.includes('object')) return GRAMMAR_COLORS.syntax.object;
    if (syntaxClass.includes('verb')) return GRAMMAR_COLORS.syntax.verb;
    if (syntaxClass.includes('predicate')) return GRAMMAR_COLORS.syntax.predicate;
    return '#334155';
  }

  // Default: 'pos' mode
  switch (posClass) {
    case 'verb-past': return GRAMMAR_COLORS.pos.verbPast;
    case 'verb-present': return GRAMMAR_COLORS.pos.verbPresent;
    case 'verb-imperative': return GRAMMAR_COLORS.pos.verbImperative;
    case 'noun': return GRAMMAR_COLORS.pos.noun;
    case 'preposition': return GRAMMAR_COLORS.pos.preposition;
    case 'particle': return GRAMMAR_COLORS.pos.particle;
    case 'negative': return GRAMMAR_COLORS.pos.negative;
    case 'pronoun': return GRAMMAR_COLORS.pos.pronoun;
    default: return '#334155';
  }
}
