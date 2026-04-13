import React, { useState } from 'react';
import { ChevronRight, Home, ArrowLeft, ChevronDown, X, Send, Save } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '24px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: '#00c1af',
  margin: '0 0 20px',
};

const subSectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'rgba(255,255,255,0.9)',
  margin: '0 0 16px',
};

const dividerStyle: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  margin: '16px 0',
};

// Dados fictícios de avaliadores
const avaliadores = [
  { id: 1, nome: 'Carlos Alberto Silva', cpf: '123.456.789-00' },
  { id: 2, nome: 'Maria Fernanda Santos', cpf: '234.567.890-11' },
  { id: 3, nome: 'João Pedro Oliveira', cpf: '345.678.901-22' },
  { id: 4, nome: 'Ana Paula Costa', cpf: '456.789.012-33' },
  { id: 5, nome: 'Roberto Carlos Lima', cpf: '567.890.123-44' },
  { id: 6, nome: 'Patricia Souza Alves', cpf: '678.901.234-55' },
  { id: 7, nome: 'Fernando José Pereira', cpf: '789.012.345-66' },
  { id: 8, nome: 'Juliana Menezes Rocha', cpf: '890.123.456-77' },
];

export const DetalhesCaptacao: React.FC<Props> = ({ onBack }) => {
  const [showModal, setShowModal] = useState(false);
  const [avaliador1, setAvaliador1] = useState('');
  const [avaliador2, setAvaliador2] = useState('');
  const [avaliador3, setAvaliador3] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDropdown3, setShowDropdown3] = useState(false);

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        // Fecha os dropdowns se clicar fora deles
        if (e.target === e.currentTarget) {
          setShowDropdown1(false);
          setShowDropdown2(false);
          setShowDropdown3(false);
        }
      }}
      >
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => {
          // Impede a propagação para não fechar ao clicar dentro do modal
          e.stopPropagation();
        }}
        >
          {/* Header do Modal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#ffffff',
                margin: '0 0 8px',
              }}>
                Selecione os avaliadores
              </h2>
              <p style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
              }}>
                Informe quem irá avaliar essa Captação.
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Campos de Avaliadores */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Avaliador 1 */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="avaliador1" style={labelStyle}>Avaliador 1</label>
              <input
                id="avaliador1"
                type="text"
                placeholder="Digite ou selecione um avaliador"
                value={avaliador1}
                onChange={(e) => setAvaliador1(e.target.value)}
                onFocus={() => setShowDropdown1(true)}
                style={inputStyle}
              />
              {showDropdown1 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  marginTop: '4px',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {avaliadores
                    .filter(a => a.nome.toLowerCase().includes(avaliador1.toLowerCase()) || a.cpf.includes(avaliador1))
                    .map((av) => (
                      <button
                        key={av.id}
                        onClick={() => {
                          setAvaliador1(`${av.nome} - ${av.cpf}`);
                          setShowDropdown1(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>{av.nome}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{av.cpf}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Avaliador 2 */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="avaliador2" style={labelStyle}>Avaliador 2</label>
              <input
                id="avaliador2"
                type="text"
                placeholder="Digite ou selecione um avaliador"
                value={avaliador2}
                onChange={(e) => setAvaliador2(e.target.value)}
                onFocus={() => setShowDropdown2(true)}
                style={inputStyle}
              />
              {showDropdown2 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  marginTop: '4px',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {avaliadores
                    .filter(a => a.nome.toLowerCase().includes(avaliador2.toLowerCase()) || a.cpf.includes(avaliador2))
                    .map((av) => (
                      <button
                        key={av.id}
                        onClick={() => {
                          setAvaliador2(`${av.nome} - ${av.cpf}`);
                          setShowDropdown2(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>{av.nome}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{av.cpf}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Avaliador 3 */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="avaliador3" style={labelStyle}>Avaliador 3</label>
              <input
                id="avaliador3"
                type="text"
                placeholder="Digite ou selecione um avaliador"
                value={avaliador3}
                onChange={(e) => setAvaliador3(e.target.value)}
                onFocus={() => setShowDropdown3(true)}
                style={inputStyle}
              />
              {showDropdown3 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  marginTop: '4px',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {avaliadores
                    .filter(a => a.nome.toLowerCase().includes(avaliador3.toLowerCase()) || a.cpf.includes(avaliador3))
                    .map((av) => (
                      <button
                        key={av.id}
                        onClick={() => {
                          setAvaliador3(`${av.nome} - ${av.cpf}`);
                          setShowDropdown3(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>{av.nome}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{av.cpf}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Botões do Modal */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius)',
                color: '#ffffff',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                console.log({ avaliador1, avaliador2, avaliador3 });
                setShowModal(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#00c1af',
                border: 'none',
                borderRadius: 'var(--radius)',
                color: '#1e293b',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a89a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
            >
              <Save size={16} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Captação
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--text-sm)',
            color: '#00c1af',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Detalhes da Captação
          </span>
        </div>

        {/* Header com botão Voltar e botão Enviar Para Avaliação */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  flexShrink: 0,
                  backgroundColor: 'rgba(0,193,175,0.15)',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.25)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
              >
                <ArrowLeft size={18} style={{ color: '#00c1af' }} />
              </button>
              <div style={{ flex: 1 }}>
                <h1 style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: '#ffffff',
                  margin: '0 0 8px',
                  lineHeight: '1.4',
                }}>
                  Captação
                </h1>
                <p style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.55)',
                  margin: 0,
                }}>
                  Verifique as informações dessa Captação.
                </p>
              </div>
            </div>

            {/* Botão Enviar Para Avaliação */}
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: '#00c1af',
                border: 'none',
                borderRadius: 'var(--radius)',
                color: '#0f172a',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a89a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
            >
              <Send size={16} />
              Enviar Para Avaliação
            </button>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '24px' }} />
        </div>

        {/* Identificação da Captação */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Identificação da Captação</h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Título da Captação */}
            <div>
              <label style={labelStyle}>Título da Captação</label>
              <input type="text" value="Edital de Inovação Tecnológica 2026" readOnly style={inputStyle} />
            </div>

            {/* Tipo de Captação e Setor Responsável */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Tipo de Captação</label>
                <input type="text" value="Edital Aberto" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Setor Responsável</label>
                <input type="text" value="GEINOV" readOnly style={inputStyle} />
              </div>
            </div>

            {/* Tipo de Fomento e Número da Captação */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Tipo de Fomento</label>
                <input type="text" value="Inovação" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Número da Captação</label>
                <input type="text" value="001/2026" readOnly style={inputStyle} />
              </div>
            </div>

            {/* Data de Início e Data de Fim */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Data de Início</label>
                <input type="text" value="01/02/2026" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Data de Fim</label>
                <input type="text" value="31/12/2026" readOnly style={inputStyle} />
              </div>
            </div>

            {/* Descrição da Captação */}
            <div>
              <label style={labelStyle}>Descrição da Captação</label>
              <textarea
                value="Edital voltado para fomentar projetos de inovação tecnológica no Estado do Espírito Santo, com foco em soluções que promovam o desenvolvimento econômico e social sustentável."
                readOnly
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: '1.6',
                }}
              />
            </div>

            {/* Formulários */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Formulário de Inscrição</label>
                <input type="text" value="Formulário de Inovação" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Formulário de Avaliação</label>
                <input type="text" value="Avaliação de Inovação" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Formulário do Recurso</label>
                <input type="text" value="Recurso Padrão" readOnly style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* Parametrizações Gerais */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Parametrizações Gerais</h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Faixas de Financiamento */}
            <div>
              <label style={labelStyle}>Faixas de Financiamento</label>
              <input type="text" value="Habilitado" readOnly style={inputStyle} />
            </div>

            {/* Faixa 1 - SEM CARD */}
            <div>
              <h3 style={{ ...subSectionTitleStyle, marginBottom: '12px' }}>Faixa 1</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Duração (meses)</label>
                  <input type="text" value="24" readOnly style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Valor Mínimo (R$)</label>
                  <input type="text" value="R$ 50.000,00" readOnly style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Valor Máximo (R$)</label>
                  <input type="text" value="R$ 200.000,00" readOnly style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={dividerStyle} />

            {/* Regras Gerais de Submissão */}
            <div>
              <h3 style={subSectionTitleStyle}>Regras Gerais de Submissão</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Múltiplas Submissões</label>
                  <input type="text" value="Permitidas" readOnly style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Coordenador pode ter outro projeto</label>
                  <input type="text" value="Sim" readOnly style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requisitos do Coordenador */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Requisitos do Coordenador</h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Vinculada a Instituição</label>
                <input type="text" value="Sim" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nível Acadêmico</label>
                <input type="text" value="Doutorado" readOnly style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Restrição de Vínculo Empregatício</label>
                <input type="text" value="Sim" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Parceria com Instituições</label>
                <input type="text" value="Permitida" readOnly style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* Avaliação e Prestação de Contas */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Avaliação e Prestação de Contas</h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Necessita Avaliação</label>
                <input type="text" value="Sim" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Possui Prestação Técnica</label>
                <input type="text" value="Sim" readOnly style={inputStyle} />
              </div>
            </div>

            <div style={dividerStyle} />

            <div>
              <h3 style={subSectionTitleStyle}>Rubricas Permitidas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Rubrica 1</label>
                  <input type="text" value="Material Permanente" readOnly style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Rubrica 2</label>
                  <input type="text" value="Material de Consumo" readOnly style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Rubrica 3</label>
                  <input type="text" value="Pessoa Física" readOnly style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recursos Financeiros */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Recursos Financeiros</h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h3 style={subSectionTitleStyle}>Origens de Recurso</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Origem 1</label>
                  <input type="text" value="Tesouro Estadual" readOnly style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Origem 2</label>
                  <input type="text" value="Convênio Federal" readOnly style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={dividerStyle} />

            <div>
              <label style={labelStyle}>Valor Total Disponível</label>
              <input 
                type="text" 
                value="R$ 5.000.000,00" 
                readOnly 
                style={{
                  ...inputStyle,
                  color: '#00c1af',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Bolsas - SEM CARD */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Bolsas</h2>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ ...subSectionTitleStyle, marginBottom: '12px' }}>Bolsa 1</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Modalidade</label>
                <input type="text" value="IC" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nível</label>
                <input type="text" value="Graduação" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Máx. Bolsistas</label>
                <input type="text" value="2" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Quantidade Cotas</label>
                <input type="text" value="50" readOnly style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={dividerStyle} />

          <div>
            <h3 style={{ ...subSectionTitleStyle, marginBottom: '12px' }}>Bolsa 2</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Modalidade</label>
                <input type="text" value="Mestrado" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nível</label>
                <input type="text" value="Pós-Graduação" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Máx. Bolsistas</label>
                <input type="text" value="1" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Quantidade Cotas</label>
                <input type="text" value="30" readOnly style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de Avaliadores */}
      {renderModal()}
    </div>
  );
};