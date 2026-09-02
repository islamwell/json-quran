import React from 'react';
import { useQuran } from '../context/QuranContext';
import { AiLevel } from '../types/quran';
import { SyntaxTree } from './SyntaxTree';
import { RootExplorer } from './RootExplorer';
import { KnowledgeGraph } from './KnowledgeGraph';

export const AnalysisPanel: React.FC = () => {
  const { selectedToken, aiLevel, setAiLevel } = useQuran();

  if (!selectedToken) {
    return (
      <div className="detail-inspector" style={{ textAlign: 'center', color: '#64748b' }}>
        <p>Click any Arabic word above to inspect its morphology, visual syntax tree, and AI explanation.</p>
      </div>
    );
  }

  const aiLevels: Array<{ id: AiLevel; label: string; icon: string }> = [
    { id: 'beginner', label: 'Beginner', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediate', icon: '📘' },
    { id: 'advanced', label: 'Advanced', icon: '🔬' },
  ];

  return (
    <section className="detail-inspector" aria-label="Word Analysis and AI Tutor">
      {/* Header */}
      <div className="inspector-header">
        <div className="word-hero-left">
          <span className="word-arabic-hero">{selectedToken.text}</span>
          <div className="word-sub-meta">
            <span className="word-translit">
              {selectedToken.lemma} • {selectedToken.pos_label}
            </span>
            <span className="word-role-badge">Token ID: {selectedToken.id}</span>
          </div>
        </div>

        <div
          className="irab-summary"
          style={{
            direction: 'rtl',
            fontFamily: "'Amiri Quran', 'Amiri', serif",
            fontSize: '1.25rem',
            color: '#1e40af',
            lineHeight: 1.8,
            maxWidth: '500px'
          }}
        >
          {selectedToken.irab}
        </div>
      </div>

      {/* AI Arabic Linguistic Tutor */}
      <div className="ai-tutor-container">
        <div className="ai-tutor-nav">
          <div className="ai-tutor-title">
            <span>🤖</span> AI Linguistic Tutor
          </div>

          <div className="ai-level-pills" role="tablist" aria-label="AI Explanation Depth">
            {aiLevels.map((lvl) => (
              <button
                key={lvl.id}
                className={`ai-pill-btn ${aiLevel === lvl.id ? 'active' : ''}`}
                onClick={() => setAiLevel(lvl.id)}
                role="tab"
                aria-selected={aiLevel === lvl.id}
              >
                <span>{lvl.icon}</span> {lvl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-content-box" role="tabpanel">
          {selectedToken.ai_explanations[aiLevel] || 'No explanation available.'}
        </div>
      </div>

      {/* Morphological Facts Grid */}
      <div className="morpho-grid">
        <div className="morpho-card">
          <div className="morpho-label">Root (الجذر)</div>
          <div className="morpho-val">
            {selectedToken.root ? selectedToken.root : 'Uninflected Particle'}
          </div>
        </div>

        <div className="morpho-card">
          <div className="morpho-label">Pattern (الوزن الصرفي)</div>
          <div
            className="morpho-val"
            style={{ fontFamily: "'Amiri Quran', 'Amiri', serif", fontSize: '1.3rem', color: '#2563eb' }}
          >
            {selectedToken.wazn}
          </div>
        </div>

        <div className="morpho-card">
          <div className="morpho-label">Word Category</div>
          <div className="morpho-val">{selectedToken.pos_label}</div>
        </div>

        {selectedToken.verb_form && (
          <div className="morpho-card">
            <div className="morpho-label">Verb Form & Tense</div>
            <div className="morpho-val">
              Form {selectedToken.verb_form} ({selectedToken.tense})
            </div>
          </div>
        )}
      </div>

      {/* Visual Syntax Tree Connections */}
      <SyntaxTree edges={selectedToken.syntax_tree} />

      {/* Comparison Grid: Similar Quran Examples & Roots */}
      <div className="comparison-grid">
        {/* Similar Qur'an Examples */}
        <div className="comp-card">
          <div className="comp-title">
            <span>📖</span> Similar Qur'an Examples
          </div>
          {selectedToken.similar_quran_examples && selectedToken.similar_quran_examples.length > 0 ? (
            selectedToken.similar_quran_examples.map((ex, idx) => (
              <div key={idx} className="quran-ayah-item">
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
                  Surah {ex.ayah}
                </div>
                <div className="quran-ayah-ar">{ex.text}</div>
                <div className="quran-ayah-exp">{ex.explanation}</div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Unique standalone Quranic construct.
            </p>
          )}
        </div>

        {/* Trilateral Root & Pattern Explorer */}
        <RootExplorer token={selectedToken} />
      </div>

      {/* Thematic Knowledge Graph */}
      <KnowledgeGraph />
    </section>
  );
};
