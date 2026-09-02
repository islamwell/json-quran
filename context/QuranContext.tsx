import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuranToken, ColorMode, AiLevel, SurahData } from '../types/quran';
import { surah108 } from '../data';

interface QuranContextType {
  surahData: SurahData;
  setSurahData: (data: SurahData) => void;
  selectedToken: QuranToken | null;
  setSelectedToken: (token: QuranToken | null) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  aiLevel: AiLevel;
  setAiLevel: (level: AiLevel) => void;
  showAnimations: boolean;
  setShowAnimations: (val: boolean) => void;
  showTooltips: boolean;
  setShowTooltips: (val: boolean) => void;
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export function QuranProvider({
  children,
  initialSurah = surah108 as unknown as SurahData
}: {
  children: ReactNode;
  initialSurah?: SurahData;
}) {
  const [surahData, setSurahData] = useState<SurahData>(initialSurah);
  const defaultToken = initialSurah?.verses[0]?.tokens[1] || null;
  const [selectedToken, setSelectedToken] = useState<QuranToken | null>(defaultToken);
  const [colorMode, setColorMode] = useState<ColorMode>('pos');
  const [aiLevel, setAiLevel] = useState<AiLevel>('beginner');
  const [showAnimations, setShowAnimations] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true);

  return (
    <QuranContext.Provider
      value={{
        surahData,
        setSurahData,
        selectedToken,
        setSelectedToken,
        colorMode,
        setColorMode,
        aiLevel,
        setAiLevel,
        showAnimations,
        setShowAnimations,
        showTooltips,
        setShowTooltips
      }}
    >
      {children}
    </QuranContext.Provider>
  );
}

export function useQuran(): QuranContextType {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
}
