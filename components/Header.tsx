import React from 'react';
import { useQuran } from '../context/QuranContext';

export const Header: React.FC = () => {
  const { surahData } = useQuran();

  return (
    <header className="app-header">
      <div className="badge-pill">
        <span>✨</span> Surah {surahData.surah_id} — Master Multi-Layer Linguistic Pilot
      </div>

      <div className="surah-title-row">
        <h1 className="surah-title">Surah {surahData.surah_name_en}</h1>
        <span className="surah-title-ar">{surahData.surah_name_ar}</span>
      </div>

      <p className="surah-subtitle">
        Interactive Word-by-Word Grammar, Visual Syntax Tree, and Multi-Tier AI Linguistic Tutor
      </p>
    </header>
  );
};
