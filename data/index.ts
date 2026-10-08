/**
 * Quranic Data Registry & Loader
 * Version: v1.0.5 (updated 2026-09-03 00:58)
 */

import { SurahData, MasterAyah } from '../types/quran';
import surah108 from './surah108.json';
import surahFatihahV2 from '../surah-al-fatihah-4-5.json';
import surahFatihahFull from '../surah-al-fatihah.json';

export const SURAH_REGISTRY: Record<number, SurahData> = {
  108: surah108 as unknown as SurahData,
};

export const MASTER_ARCH_V2_REGISTRY: Record<string | number, MasterAyah[]> = {
  1: surahFatihahFull as unknown as MasterAyah[],
  '1:4-5': surahFatihahV2 as unknown as MasterAyah[],
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

export { surah108, surahFatihahV2, surahFatihahFull };


