import React from 'react';
import { Verse } from '../types/quran';
import { QuranWord } from './QuranWord';

interface VerseCardProps {
  verse: Verse;
}

export const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  return (
    <article className="verse-box" id={`verse-${verse.number}`}>
      <div className="verse-meta-row">
        <span className="ayah-pill">Ayah {verse.number}</span>
        <span className="instruction-hint">Click word to inspect in AI Linguistic Tutor</span>
      </div>

      <div className="sentence" aria-label={`Surah verse ${verse.number}`}>
        {verse.tokens.map((token) => (
          <QuranWord key={token.id} token={token} />
        ))}
      </div>

      <div className="verse-translation">
        <em>"{verse.translation}"</em>
      </div>
    </article>
  );
};
