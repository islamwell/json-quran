import React from 'react';
import { QuranToken } from '../types/quran';

interface RootExplorerProps {
  token: QuranToken;
}

export const RootExplorer: React.FC<RootExplorerProps> = ({ token }) => {
  const hasRoots = token.same_root_words && token.same_root_words.length > 0;
  const hasPatterns = token.same_pattern_words && token.same_pattern_words.length > 0;

  return (
    <div className="comp-card">
      <div className="comp-title">
        <span>🌱</span> Words with Same Root & Pattern
      </div>

      {hasRoots && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginBottom: '0.4rem' }}>
            Root ({token.root}):
          </div>
          <div className="chip-list">
            {token.same_root_words.map((r, idx) => (
              <span key={idx} className="intel-chip">
                <strong>{r.word}</strong>
                <span>({r.ayah}: {r.meaning})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {hasPatterns && (
        <div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginBottom: '0.4rem' }}>
            Morphological Pattern ({token.wazn}):
          </div>
          {token.same_pattern_words.map((p, idx) => (
            <div key={idx} className="chip-list" style={{ marginTop: '0.35rem' }}>
              {p.words.map((pw, wIdx) => (
                <span key={wIdx} className="intel-chip">
                  {pw}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {!hasRoots && !hasPatterns && (
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Uninflected grammatical particle (no triliteral root variation).
        </p>
      )}
    </div>
  );
};
