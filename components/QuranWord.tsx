import React from 'react';
import { QuranToken } from '../types/quran';
import { useQuran } from '../context/QuranContext';

interface QuranWordProps {
  token: QuranToken;
}

export const QuranWord: React.FC<QuranWordProps> = ({ token }) => {
  const { selectedToken, setSelectedToken, showAnimations } = useQuran();
  const isSelected = selectedToken?.id === token.id;

  let animClass = '';
  if (showAnimations) {
    if (token.pos_class === 'verb-past') animClass = 'pulse-past';
    if (token.pos_class === 'verb-present') animClass = 'animate-pulse';
    // verb-imperative gets ambient cyan text-shadow in CSS
  }

  return (
    <span
      className={`gram-word ${token.pos_class} ${token.case_class} ${token.syntax_class} ${animClass} ${
        isSelected ? 'is-selected' : ''
      }`}
      data-tooltip={token.tooltip}
      onClick={() => setSelectedToken(token)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setSelectedToken(token);
        }
      }}
      aria-label={`${token.text} - ${token.tooltip}`}
    >
      {token.text}
    </span>
  );
};
