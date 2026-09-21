import React, { useState } from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';

export default function CommunityPoll() {
  const [votedOption, setVotedOption] = useState(null);
  const [pollData, setPollData] = useState([
    { id: 1, text: 'La grabación de audio secreta del expediente', votes: 142 },
    { id: 2, text: 'El reverso de la fotografía del cuadro', votes: 98 },
    { id: 3, text: 'La carpeta de localizaciones del mapa (11770)', votes: 215 },
    { id: 4, text: 'El código del teléfono retro (662552)', votes: 110 },
  ]);

  const totalVotes = pollData.reduce((acc, curr) => acc + curr.votes, 0);

  const handleVote = (id) => {
    if (votedOption === id) return;
    setPollData((prev) =>
      prev.map((opt) => {
        if (opt.id === id) return { ...opt, votes: opt.votes + 1 };
        if (votedOption && opt.id === votedOption) return { ...opt, votes: opt.votes - 1 };
        return opt;
      })
    );
    setVotedOption(id);
  };

  return (
    <div className="widget-card">
      <div className="widget-title">
        <BarChart3 size={20} color="var(--accent-gold)" />
        <span>Encuesta del Caso Picasso</span>
      </div>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        ¿Qué prueba o documento crees que esconde la clave final del cuadro Picasso?
      </p>

      {pollData.map((opt) => {
        const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
        const isSelected = votedOption === opt.id;

        return (
          <div
            key={opt.id}
            className="poll-option"
            onClick={() => handleVote(opt.id)}
            style={{
              borderColor: isSelected ? 'var(--accent-gold)' : undefined,
            }}
          >
            <div className="poll-progress" style={{ width: `${percentage}%` }} />
            <div className="poll-option-content">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isSelected && <CheckCircle2 size={16} color="var(--accent-gold)" />}
                {opt.text}
              </span>
              <span className="poll-votes">{percentage}% ({opt.votes})</span>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
        Total votos: {totalVotes}
      </div>
    </div>
  );
}
