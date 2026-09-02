'use client';

import React from 'react';
import { QuranProvider, useQuran } from '../context/QuranContext';
import { Header } from '../components/Header';
import { ControlsBar } from '../components/ControlsBar';
import { VerseCard } from '../components/VerseCard';
import { AnalysisPanel } from '../components/AnalysisPanel';

function QuranAppContent() {
  const { surahData, colorMode, showTooltips } = useQuran();

  return (
    <div className={`app-root ${showTooltips ? 'show-tooltips' : ''} ${colorMode}-mode`}>
      <Header />
      <ControlsBar />

      <main className="verses-canvas">
        {surahData.verses.map((verse) => (
          <VerseCard key={verse.id} verse={verse} />
        ))}
      </main>

      <AnalysisPanel />

      <footer className="app-footer">
        <p>Surah {surahData.surah_name_en} ({surahData.surah_id}) — Grammar Intelligence & AI Linguistic Tutor</p>
        <p className="footer-version">v1.0.5 (updated 2026-09-03 00:58)</p>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <QuranProvider>
      <QuranAppContent />
    </QuranProvider>
  );
}
