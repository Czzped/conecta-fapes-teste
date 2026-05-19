import React, { useState, useRef } from 'react';
import { ChevronRight, Home, Plus, Trash2, FileText } from 'lucide-react';

interface Props {
  onBack: () => void;
}

interface Pergunta {
  id: number;
  pergunta: string;
  justificativa: string;
  nota: string;
  peso: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(38, 38, 38, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  padding: '10px 12px',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical' as const,
  minHeight: '86px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255, 255, 255, 0.65)',
  display: 'block',
  marginBottom: '6px',
};

export const FormularioAvaliacao: React.FC<Props> = ({ onBack }) => {
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([
    { id: 1, pergunta: '', justificativa: '', nota: '', peso: '' }
  ]);
  const nextPerguntaId = useRef(2);

  const addPergunta = () => {
    setPerguntas([...perguntas, { id: nextPerguntaId.current++, pergunta: '', justificativa: '', nota: '', peso: '' }]);
  };

  const removePergunta = (id: number) => {
    setPerguntas(perguntas.filter(p => p.id !== id));
  };

  const updatePergunta = <K extends keyof Pergunta>(id: number, field: K, value: Pergunta[K]) => {
    setPerguntas(perguntas.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="flex-1" style={{ backgroundColor: '#171717', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>
            Formulário
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', fontWeight: 'var(--font-weight-medium)' }}>
            Template
          </span>
        </div>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: 'rgba(0,193,175,0.15)', borderRadius: 'var(--radius)' }}>
            <FileText size={18} style={{ color: '#00c1af' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px' }}>
              Template - Formulário de Avaliação
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              Para personalizar, exclua ou adicione novos campos.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '28px' }} />

        {/* ── Section 1: Dados da Avaliação ── */}
        <div style={{
          backgroundColor: 'rgba(38, 38, 38, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '28px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: '#00c1af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-family)',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
                color: '#171717',
              }}>
                1
              </span>
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px 0' }}>
                Dados da Avaliação
              </h2>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Informações e termo de confidencialidade.
              </p>
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

          <div style={{ marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => setAceitaTermos(!aceitaTermos)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                flexShrink: 0,
                marginTop: '1px',
                border: `2px solid ${aceitaTermos ? '#00c1af' : 'rgba(255,255,255,0.25)'}`,
                backgroundColor: aceitaTermos ? '#00c1af' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}>
                {aceitaTermos && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: aceitaTermos ? '#ffffff' : 'rgba(255,255,255,0.65)', margin: '0 0 4px', fontWeight: 'var(--font-weight-medium)' }}>
                  Termo de Sigilo e Confidencialidade
                </p>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: '1.5' }}>
                  Declaro não haver nenhuma circunstância que caracterize situação de potencial conflito de interesse e que possa ser percebida como impeditiva para um parecer isento nesta avaliação e comprometo-me a manter sob sigilo todas as informações das quais obtive acesso através da apresentação analisada e teor deste parecer.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ── Section 2: Avaliação da Proposta ── */}
        <div style={{
          backgroundColor: 'rgba(38, 38, 38, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '28px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: '#00c1af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-family)',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
                color: '#171717',
              }}>
                2
              </span>
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px 0' }}>
                Avaliação da Proposta
              </h2>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Responda as perguntas abaixo.
              </p>
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

          {perguntas.map((pergunta, index) => (
            <div key={pergunta.id} style={{ marginBottom: index < perguntas.length - 1 ? '32px' : '0' }}>
              {index > 0 && <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />}
              
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Pergunta</label>
                <input
                  type="text"
                  placeholder="Digite a pergunta a ser respondida..."
                  value={pergunta.pergunta}
                  onChange={(e) => updatePergunta(pergunta.id, 'pergunta', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Justificativa</label>
                <textarea
                  placeholder="Campo aberto para justificativa..."
                  value={pergunta.justificativa}
                  onChange={(e) => updatePergunta(pergunta.id, 'justificativa', e.target.value)}
                  style={textareaStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Nota</label>
                  <input
                    type="number"
                    placeholder="Ex: 10"
                    value={pergunta.nota}
                    onChange={(e) => updatePergunta(pergunta.id, 'nota', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Peso</label>
                  <input
                    type="number"
                    placeholder="Ex: 1"
                    value={pergunta.peso}
                    onChange={(e) => updatePergunta(pergunta.id, 'peso', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                {perguntas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePergunta(pergunta.id)}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '10px',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                      height: '40px',
                      width: '40px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="button"
              onClick={addPergunta}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: 'rgba(0,193,175,0.1)',
                border: '1px solid rgba(0,193,175,0.4)',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#00c1af',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)'; }}
            >
              <Plus size={18} />
              Adicionar Pergunta
            </button>
          </div>
        </div>

        {/* Bottom buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '10px 20px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
          >
            Salvar Rascunho
          </button>
          <button
            type="button"
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: 'var(--radius)',
              backgroundColor: '#00c1af',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: '#171717',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#00a99a'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#00c1af'; }}
          >
            Salvar Formulário
          </button>
        </div>

      </div>
    </div>
  );
};
