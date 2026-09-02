/**
 * Quranic Data Registry & Loader
 * Version: v1.0.5 (updated 2026-09-03 00:58)
 */

import { SurahData } from '../types/quran';
import surah108 from './surah108.json';

export const SURAH_REGISTRY: Record<number, SurahData> = {
  108: surah108 as unknown as SurahData,
};

export function getSurah(id: number): SurahData {
  const surah = SURAH_REGISTRY[id];
  if (!surah) {
    throw new Error(`Surah with id ${id} not found in registry.`);
  }
  return surah;
}

export function getAllSurahs(): SurahData[] {
  return Object.values(SURAH_REGISTRY);
}

export { surah108 };
