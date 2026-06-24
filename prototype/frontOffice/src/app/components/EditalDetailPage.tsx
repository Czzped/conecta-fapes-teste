import { useState } from 'react';
import { ChevronLeft, Calendar, Users, DollarSign, FileText, ExternalLink, Moon } from 'lucide-react';
import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';
import editalImg from 'figma:asset/87cbb34a404391c3629605e4569ee0dab2b3e31f.png';
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
      <div style={{ ...CONTAINER, paddingTop: '1.5rem', paddingBottom: '8rem' }}>

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

          {/* Right: meta chips */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minWidth: '180px',
            }}
          >
            {[
              { icon: <Calendar size={15} />, label: 'Inscrição até', value: edital.prazo },
              { icon: <Users size={15} />, label: 'Vagas', value: `${edital.vagas} vagas` },
              { icon: <DollarSign size={15} />, label: 'Valor total', value: edital.valor },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <span style={{ color: 'var(--muted-foreground)' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', lineHeight: 1 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document viewer label */}
        <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
          <FileText size={16} style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
            Documento do Edital
          </span>
        </div>

        {/* Document image frame */}
        <div
          style={{
            border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Viewer toolbar */}
          <div
            style={{
              backgroundColor: 'rgba(6,182,212,0.08)',
              borderBottom: '1px solid rgba(6,182,212,0.15)',
              padding: '0.625rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
              {edital.numero ?? 'Edital FAPES'} — Página 1 de 53
            </span>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-family)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#22d3ee'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}
            >
              <ExternalLink size={13} />
              Abrir em nova aba
            </button>
          </div>

          {/* The document */}
          <div style={{ backgroundColor: '#e8e8e8', display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
            <img
              src={editalImg}
              alt={`Edital ${edital.titulo}`}
              style={{
                width: '100%',
                maxWidth: '860px',
                display: 'block',
                boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: 'var(--app-header)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(6,182,212,0.2)',
          padding: '1rem 0',
        }}
      >
        <div
          style={{
            ...CONTAINER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)', marginBottom: '0.2rem' }}>
              Edital aberto
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>
              {edital.titulo} · Inscrições até {edital.prazo}
            </div>
          </div>
          <button
            onClick={onInscricao}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius)',
              border: 'none',
              backgroundColor: '#22d3ee',
              color: '#0a0a0a',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-family)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#22d3ee'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#22d3ee'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Fazer Inscrição
          </button>
        </div>
      </div>
    </div>
  );
}
