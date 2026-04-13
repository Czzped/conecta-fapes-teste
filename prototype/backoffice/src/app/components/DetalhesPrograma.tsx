import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

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

const innerCardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(15,23,42,0.5)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '20px 24px',
  marginBottom: '12px',
};

export const DetalhesPrograma: React.FC<Props> = ({ onBack }) => {
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
            Programa
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--text-sm)',
            color: '#00c1af',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Detalhes do Programa
          </span>
        </div>

        {/* Header com botão Voltar */}
        <div className="mb-6">
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
                Detalhes do Programa
              </h1>
              <p style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                color: 'rgba(255,255,255,0.55)',
                margin: 0,
              }}>
                Verifique as informações desse Programa.
              </p>
            </div>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '24px' }} />
        </div>

        {/* Identificação do Programa */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Identificação do Programa</h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Nome e Instituição Demandante */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input type="text" value="Programa de Pesquisa em Energia Renovável" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Instituição Demandante</label>
                <input type="text" value="FAPES" readOnly style={inputStyle} />
              </div>
            </div>

            {/* Data de Início e Data de Fim */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Data de Início</label>
                <input type="text" value="01/01/2026" readOnly style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Data de Fim</label>
                <input type="text" value="31/12/2028" readOnly style={inputStyle} />
              </div>
            </div>

            {/* Parceria */}
            <div>
              <label style={labelStyle}>Parceria</label>
              <input type="text" value="Parceria Internacional - Universidade de Lisboa" readOnly style={inputStyle} />
            </div>

            {/* Planejamento Estratégico */}
            <div>
              <label style={labelStyle}>Planejamento Estratégico</label>
              <input type="text" value="Planejamento Estratégico 2024-2027" readOnly style={inputStyle} />
            </div>

            <div style={dividerStyle} />

            {/* Eixos Estratégicos */}
            <div>
              <h3 style={subSectionTitleStyle}>Eixos Estratégicos Selecionados</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Eixo 1</label>
                  <input type="text" value="Inovação e Tecnologia" readOnly style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Eixo 2</label>
                  <input type="text" value="Desenvolvimento Sustentável" readOnly style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Complementares */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Informações Complementares</h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Resumo */}
            <div>
              <label style={labelStyle}>Resumo</label>
              <textarea
                value="O Programa de Pesquisa em Energia Renovável visa fomentar estudos e projetos inovadores na área de energias renováveis no Estado do Espírito Santo. O programa busca desenvolver soluções sustentáveis para a matriz energética estadual, promovendo a transição para fontes de energia limpa e contribuindo para o desenvolvimento econômico e social da região."
                readOnly
                rows={4}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: '1.6',
                }}
              />
            </div>

            <div style={dividerStyle} />

            {/* Benefícios */}
            <div>
              <h3 style={subSectionTitleStyle}>Benefícios</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={innerCardStyle}>
                  <input type="text" value="Redução da dependência de combustíveis fósseis" readOnly style={inputStyle} />
                </div>
                <div style={innerCardStyle}>
                  <input type="text" value="Geração de empregos qualificados na área de energia renovável" readOnly style={inputStyle} />
                </div>
                <div style={innerCardStyle}>
                  <input type="text" value="Fortalecimento da competitividade tecnológica do estado" readOnly style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={dividerStyle} />

            {/* Resultados */}
            <div>
              <h3 style={subSectionTitleStyle}>Resultados Esperados</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={innerCardStyle}>
                  <input type="text" value="Desenvolvimento de 20 projetos de pesquisa em energia renovável" readOnly style={inputStyle} />
                </div>
                <div style={innerCardStyle}>
                  <input type="text" value="Formação de 50 pesquisadores especializados na área" readOnly style={inputStyle} />
                </div>
                <div style={innerCardStyle}>
                  <input type="text" value="Publicação de pelo menos 30 artigos científicos em periódicos internacionais" readOnly style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={dividerStyle} />

            {/* Riscos */}
            <div>
              <label style={labelStyle}>Riscos e Restrições para a Viabilidade Técnica</label>
              <textarea
                value="Os principais riscos incluem: limitações tecnológicas para implementação em larga escala, dependência de fornecedores internacionais de equipamentos, necessidade de infraestrutura adequada para testes e validação, e possíveis mudanças regulatórias no setor energético que podem afetar a viabilidade dos projetos."
                readOnly
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: '1.6',
                }}
              />
            </div>

            {/* Enquadramento */}
            <div>
              <label style={labelStyle}>Enquadramento dos Projetos ao Programa - Forma de Repasse dos Recursos Financeiros</label>
              <textarea
                value="Os recursos serão repassados diretamente às instituições executoras através de convênios específicos. Cada projeto aprovado receberá recursos conforme cronograma de desembolso aprovado, mediante apresentação de relatórios técnicos e financeiros trimestrais. O repasse será realizado em até 3 parcelas anuais, condicionado ao cumprimento das metas estabelecidas."
                readOnly
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: '1.6',
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
