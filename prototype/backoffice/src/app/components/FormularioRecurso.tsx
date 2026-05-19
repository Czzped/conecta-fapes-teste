import React, { useState } from 'react';
import { ChevronRight, Home, Paperclip, FileText } from 'lucide-react';

interface Props {
  onBack: () => void;
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
  minHeight: '120px',
  lineHeight: '1.6',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255, 255, 255, 0.65)',
  display: 'block',
  marginBottom: '6px',
};

export const FormularioRecurso: React.FC<Props> = ({ onBack }) => {
  const [edital, setEdital] = useState('');
  const [nomeProponente, setNomeProponente] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [motivoRecurso, setMotivoRecurso] = useState('');
  const [outroMotivo, setOutroMotivo] = useState('');
  const [descricaoRecurso, setDescricaoRecurso] = useState('');
  const [aceitaDeclaracao, setAceitaDeclaracao] = useState(false);

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
              Template - Formulário de Recurso
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              Para personalizar, exclua ou adicione novos campos.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '28px' }} />

        {/* ── Section 1: Identificação ── */}
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
                Identificação
              </h2>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Dados do proponente e edital.
              </p>
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Edital</label>
            <input
              type="text"
              placeholder="Digite o nome do edital..."
              value={edital}
              onChange={(e) => setEdital(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Nome do Proponente</label>
            <input
              type="text"
              placeholder="Digite o nome completo..."
              value={nomeProponente}
              onChange={(e) => setNomeProponente(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Instituição Vinculada</label>
            <input
              type="text"
              placeholder="Digite a instituição..."
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* ── Section 2: Motivo do Recurso ── */}
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
                Motivo do Recurso
              </h2>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Selecione o motivo e descreva a solicitação.
              </p>
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {[
              { value: 'resultado_analise', label: 'Resultado da análise da proposta' },
              { value: 'decisao_fapes', label: 'Decisão da Fapes durante a execução do projeto, bolsa ou auxílio' },
              { value: 'outros', label: 'Outros' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setMotivoRecurso(opt.value);
                  if (opt.value !== 'outros') setOutroMotivo('');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `2px solid ${motivoRecurso === opt.value ? '#00c1af' : 'rgba(255,255,255,0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.2s',
                }}>
                  {motivoRecurso === opt.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00c1af' }} />}
                </div>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: motivoRecurso === opt.value ? '#ffffff' : 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {motivoRecurso === 'outros' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Especifique</label>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: outroMotivo.length > 80 ? (outroMotivo.length >= 100 ? '#ef4444' : '#fbbf24') : 'rgba(255,255,255,0.35)' }}>
                  {outroMotivo.length}/100
                </span>
              </div>
              <input
                type="text"
                placeholder="Digite o motivo..."
                value={outroMotivo}
                onChange={(e) => { if (e.target.value.length <= 100) setOutroMotivo(e.target.value); }}
                maxLength={100}
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Descrição do Recurso</label>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>
              Aponte os motivos de discordar com o resultado
            </p>
            <textarea
              placeholder="Digite a descrição detalhada..."
              value={descricaoRecurso}
              onChange={(e) => setDescricaoRecurso(e.target.value)}
              style={textareaStyle}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'rgba(0,193,175,0.1)',
                border: '1px solid rgba(0,193,175,0.4)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#00c1af',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)'; }}
            >
              <Paperclip size={16} />
              Anexar Arquivo
            </button>
          </div>

          {/* Checkbox dentro da seção Motivo do Recurso */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              type="button"
              onClick={() => setAceitaDeclaracao(!aceitaDeclaracao)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                flexShrink: 0,
                marginTop: '1px',
                border: `2px solid ${aceitaDeclaracao ? '#00c1af' : 'rgba(255,255,255,0.25)'}`,
                backgroundColor: aceitaDeclaracao ? '#00c1af' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}>
                {aceitaDeclaracao && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: aceitaDeclaracao ? '#ffffff' : 'rgba(255,255,255,0.65)', margin: 0, lineHeight: '1.5' }}>
                Declaro que tenho conhecimento das normas estabelecidas no Edital do qual sou proponente/participante, bem como da sistemática adotada pela FAPES para análise dos Recursos Administrativos. Ainda, declaro que as informações aqui apresentadas foram por mim revisadas e que informações incorretas indevidamente incluídas no presente Recurso Administrativo poderão ser utilizadas no seu indeferimento.
              </p>
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
