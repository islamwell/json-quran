import React from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useQuran } from '../context/QuranContext';

export const ControlsBar: React.FC = () => {
  const {
    showAnimations,
    setShowAnimations,
    showTooltips,
    setShowTooltips,
  } = useQuran();

  return (
    <section className="controls-wrapper" aria-label="Application controls">
      <ColorModeSwitcher />

      <div className="control-group">
        <button
          className={`toggle-btn ${showAnimations ? 'is-active' : ''}`}
          onClick={() => setShowAnimations(!showAnimations)}
          title="Toggle pulse animations and glowing text shadows"
        >
          <span>💫</span> {showAnimations ? 'Animations On' : 'Animations Off'}
        </button>

        <button
          className={`toggle-btn ${showTooltips ? 'is-active' : ''}`}
          onClick={() => setShowTooltips(!showTooltips)}
          title="Toggle hover tooltips above Arabic tokens"
        >
          <span>💬</span> {showTooltips ? 'Tooltips On' : 'Tooltips Off'}
        </button>
      </div>
    </section>
  );
};
