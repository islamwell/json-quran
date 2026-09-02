import React from 'react';
import { useQuran } from '../context/QuranContext';

export const KnowledgeGraph: React.FC = () => {
  const { surahData } = useQuran();
  const graph = surahData.knowledge_graph || [];

  if (graph.length === 0) return null;

  return (
    <div className="syntax-tree-card" style={{ marginTop: '1.5rem', background: '#faf5ff', borderColor: '#e9d5ff' }}>
      <div className="tree-title" style={{ color: '#6b21a8' }}>
        <span>🧠</span> Thematic Knowledge Graph (Ontology)
      </div>

      <div className="syntax-chain">
        {graph.map((edge, idx) => (
          <div key={idx} className="syntax-edge" style={{ background: '#ffffff', border: '1px solid #f3e8ff' }}>
            <span style={{ fontWeight: 600, color: '#4c1d95' }}>{edge.from}</span>
            <span
              className="edge-badge"
              style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}
            >
              ── {edge.relation.replace(/_/g, ' ')} ──▶
            </span>
            <strong style={{ color: '#1e1b4b' }}>{edge.to}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
