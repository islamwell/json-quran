import React from 'react';
import { ColorMode } from '../types/quran';
import { useQuran } from '../context/QuranContext';

export const ColorModeSwitcher: React.FC = () => {
  const { colorMode, setColorMode } = useQuran();

  const modes: Array<{ id: ColorMode; label: string; icon: string }> = [
    { id: 'pos', label: 'Word Class (POS)', icon: '🏷️' },
    { id: 'case', label: 'Case & Mood', icon: '⚖️' },
    { id: 'syntax', label: 'Syntax Roles', icon: '🌳' },
  ];

  return (
    <div className="control-group">
      <span className="control-label">Color Dimension:</span>
      <div className="segmented-group" role="radiogroup" aria-label="Color dimension selector">
        {modes.map((m) => (
          <button
            key={m.id}
            className={`seg-btn ${colorMode === m.id ? 'active' : ''}`}
            onClick={() => setColorMode(m.id)}
            role="radio"
            aria-checked={colorMode === m.id}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>
    </div>
  );
};
