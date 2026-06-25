import { useState } from 'react';
import { ChevronLeft, Calendar, FileText, Moon } from 'lucide-react';
import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';
import { editais } from '../data/editais';
import { AccessibilityModal } from './AccessibilityModal';

interface EditalDetailPageProps {
  editalId: number;
  onBack: () => void;
  onInscricao: () => void;
  onLogin?: () => void;
}

const CONTAINER: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

const areaColors: Record<string, { bg: string; color: string }> = {
  'Carreira Científica':     { bg: 'rgba(34, 211, 238,0.12)', color: '#22d3ee' },
  'Pesquisa':                { bg: 'rgba(34, 211, 238,0.12)', color: '#22d3ee' },
  'Extensão':                { bg: 'rgba(34, 211, 238,0.12)', color: '#22d3ee' },
  'Internacional':           { bg: 'rgba(34, 211, 238,0.12)', color: '#22d3ee' },
  'Difusão do Conhecimento': { bg: 'rgba(34, 211, 238,0.12)', color: '#22d3ee' },
  'Inovação':                { bg: 'rgba(34, 211, 238,0.12)', color: '#22d3ee' },
};

const editalTextSections = [
  {
    title: '1. Apresentação',
    content:
      'A Fundação de Amparo à Pesquisa e Inovação do Espírito Santo torna pública a abertura de inscrições para seleção de propostas voltadas ao desenvolvimento científico, tecnológico e de inovação, conforme as diretrizes institucionais da FAPES.',
  },
  {
    title: '2. Objetivo',
    content:
      'Apoiar projetos que contribuam para a formação de recursos humanos, fortalecimento da pesquisa aplicada, difusão do conhecimento e geração de soluções para desafios estratégicos do Estado do Espírito Santo.',
  },
  {
    title: '3. Público-alvo',
    content:
      'Poderão submeter propostas pesquisadores, estudantes, profissionais vinculados a instituições científicas, tecnológicas, de inovação, ensino superior ou organizações elegíveis conforme as regras deste edital.',
  },
  {
    title: '4. Recursos disponíveis',
    content:
      'Os recursos financeiros serão destinados conforme disponibilidade orçamentária, critérios de mérito técnico-científico e atendimento aos requisitos formais estabelecidos no cronograma da chamada.',
  },
  {
    title: '5. Inscrição e envio da proposta',
    content:
      'A inscrição deverá ser realizada exclusivamente pelo sistema Conecta FAPES. O proponente deve preencher o formulário eletrônico, anexar os documentos exigidos e enviar a proposta dentro do prazo indicado.',
  },
  {
    title: '6. Análise e resultado',
    content:
      'As propostas serão analisadas quanto à habilitação documental, aderência ao edital, mérito técnico e disponibilidade de recursos. O resultado será publicado nos canais oficiais da FAPES.',
  },
];

export function EditalDetailPage({ editalId, onBack, onInscricao, onLogin }: EditalDetailPageProps) {
  const [showAccessibility, setShowAccessibility] = useState(false);
  const edital = editais.find(e => e.id === editalId) ?? editais[0];
  const areaColor = areaColors[edital.area] ?? { bg: 'rgba(34, 211, 238,0.12)', color: '#22d3ee' };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-family)' }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'var(--app-header)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(6,182,212,0.15)',
        }}
      >
        <div
          style={{
            ...CONTAINER,
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <img src={fapesLogo} alt="FAPES" style={{ height: '36px', objectFit: 'contain' }} />
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                border: '1px solid #22d3ee',
                backgroundColor: 'transparent',
                color: '#22d3ee',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-family)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(8,145,178,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Entrar com Acesso Cidadão
            </button>
            <button
              onClick={() => setShowAccessibility(true)}
              aria-label="Acessibilidade"
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius)',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--foreground)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Moon size={18} />
            </button>
          </div>
        </div>
      </header>
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} />

      {/* ── BREADCRUMB / BACK ── */}
      <div style={{ ...CONTAINER, paddingTop: '1.75rem', paddingBottom: '0.5rem' }}>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-family)',
            padding: 0,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#22d3ee'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}
        >
          <ChevronLeft size={16} />
          Voltar para Oportunidades
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ ...CONTAINER, paddingTop: '1.5rem', paddingBottom: '3rem' }}>

        {/* Header info bar */}
        <div
          style={{
            backgroundColor: 'rgba(6,182,212,0.06)',
            border: '1px solid rgba(6,182,212,0.18)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Left: title block */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.625rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#67e8f9',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-family)',
                }}
              >
                {edital.programa}
              </span>
              <span
                style={{
                  padding: '0.2rem 0.625rem',
                  borderRadius: '9999px',
                  backgroundColor: areaColor.bg,
                  color: areaColor.color,
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-family)',
                }}
              >
                {edital.area}
              </span>
              {edital.numero && (
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--muted-foreground)',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  {edital.numero}
                </span>
              )}
            </div>
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                lineHeight: 1.3,
                fontFamily: 'var(--font-family)',
                marginBottom: '0.5rem',
              }}
            >
              {edital.titulo}
            </h1>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                lineHeight: 1.6,
                fontFamily: 'var(--font-family)',
              }}
            >
              {edital.descricao}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: '0 0 auto',
              justifyContent: 'flex-start',
              marginTop: '0.1rem',
            }}
          >
            <span style={{ color: 'var(--muted-foreground)', display: 'inline-flex' }}>
              <Calendar size={15} />
            </span>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', lineHeight: 1 }}>
                Inscrições até
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>
                {edital.prazo}
              </div>
            </div>
          </div>
        </div>

        {/* Document viewer label */}
        <div
          style={{
            marginLeft: '2rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div className="flex items-center gap-2">
            <FileText size={16} style={{ color: 'var(--muted-foreground)' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
              Documento do Edital
            </span>
          </div>
          <button
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(6,182,212,0.35)',
              backgroundColor: 'rgba(6,182,212,0.12)',
              color: '#22d3ee',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              whiteSpace: 'nowrap',
            }}
          >
            Baixar Arquivo
          </button>
        </div>

        <article style={{ maxWidth: '860px', marginLeft: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ color: '#22d3ee', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.06em', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              {edital.numero ?? 'EDITAL FAPES'}
            </div>
            <h2 style={{ color: 'var(--foreground)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 1.35, margin: '0 0 0.75rem', fontFamily: 'var(--font-family)' }}>
              {edital.titulo}
            </h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.7, margin: 0, fontFamily: 'var(--font-family)' }}>
              Texto demonstrativo do edital para visualização no protótipo. As informações abaixo são mockadas e representam a estrutura textual que será exibida ao cidadão.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {editalTextSections.map(section => (
              <section key={section.title}>
                <h3 style={{ color: 'var(--foreground)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-semibold)', margin: '0 0 0.5rem', fontFamily: 'var(--font-family)' }}>
                  {section.title}
                </h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.8, margin: 0, fontFamily: 'var(--font-family)' }}>
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </article>
      </div>

    </div>
  );
}
