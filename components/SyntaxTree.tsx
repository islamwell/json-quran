import React from 'react';
import { SyntaxEdge } from '../types/quran';

interface SyntaxTreeProps {
  edges: SyntaxEdge[];
}

export const SyntaxTree: React.FC<SyntaxTreeProps> = ({ edges }) => {
  if (!edges || edges.length === 0) return null;

  return (
    <div className="syntax-tree-card">
      <div className="tree-title">
        <span>🌳</span> Visual Syntax Tree Connections
      </div>

      <div className="syntax-chain">
        {edges.map((edge, idx) => (
          <div key={idx} className="syntax-edge">
            <span>{edge.from}</span>
            <span className="edge-badge">── {edge.relation} ──▶</span>
            <strong>{edge.to}</strong>
            {edge.description && (
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>
                ({edge.description})
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
