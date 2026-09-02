/**
 * Grammatical & Morphological Utilities for Quranic Arabic
 * Version: v1.0.5 (updated 2026-09-03 00:58)
 */

export const ARABIC_WORD_CLASSES = {
  ism: {
    name_en: "Noun (Ism)",
    name_ar: "اسم",
    definition: "A word pointing to a meaning in itself, completely independent of time."
  },
  fil: {
    name_en: "Verb (Fi'l)",
    name_ar: "فعل",
    definition: "A word pointing to an action bound directly to past, present, or future time."
  },
  harf: {
    name_en: "Particle (Harf)",
    name_ar: "حرف",
    definition: "A connector word that only yields complete meaning in relation to another."
  }
};

export const VERB_TENSES = {
  madi: { name_ar: "ماض", name_en: "Past tense", effect: "Action definitively settled" },
  mudari: { name_ar: "مضارع", name_en: "Present/Future tense", effect: "Continuous, unfolding action" },
  amr: { name_ar: "أمر", name_en: "Imperative", effect: "Divine directive, command, or request" }
};

export function formatWazn(wazn: string): string {
  if (!wazn || wazn === '—') return 'Non-inflected';
  return `Pattern: ${wazn}`;
}

export function cleanArabicDiacritics(text: string): string {
  return text.replace(/[\u0617-\u061A\u064B-\u0652]/g, '');
}
