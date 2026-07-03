import { useEffect, useState, useRef } from 'react';
import { Search, Calendar, ArrowRight, Moon } from 'lucide-react';
import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';
import { AccessibilityModal } from './AccessibilityModal';

interface CidadaoHomePageProps {
  onLogin?: () => void;
  onVerEdital?: (editalId: number) => void;
  onInscricao?: (editalId: number) => void;
  scrollToOportunidades?: boolean;
  onScrolledToOportunidades?: () => void;
}

const editais = [
  {
    id: 1,
    titulo: 'Iniciação Científica 2025',
    programa: 'PIBIC',
    area: 'Carreira Científica',
    prazo: '30/04/2025',
    status: 'Ativo',
    vagas: 120,
    valor: 'R$ 7.000',
    descricao: 'Programa de bolsas de iniciação científica para estudantes de graduação em parceria com universidades capixabas.',
  },
  {
    id: 2,
    titulo: 'Pesquisa e Inovação Tecnológica',
    programa: 'BPIG',
    area: 'Pesquisa',
    prazo: '15/05/2025',
    status: 'Ativo',
    vagas: 80,
    valor: 'R$ 1.200.000',
    descricao: 'Apoio a projetos de pesquisa aplicada voltados para inovação tecnológica nas empresas do Espírito Santo.',
  },
  {
    id: 3,
    titulo: 'Extensão Universitária',
    programa: 'ProExt',
    area: 'Extensão',
    prazo: '20/05/2025',
    status: 'Ativo',
    vagas: 60,
    valor: 'R$ 5.000',
    descricao: 'Fomento a projetos de extensão que promovam a integração entre universidade e comunidade local.',
  },
  {
    id: 4,
    titulo: 'Desenvolvimento Científico Regional',
    programa: 'DCR',
    area: 'Internacional',
    prazo: '10/06/2025',
    status: 'Ativo',
    vagas: 40,
    valor: 'R$ 18.000',
    descricao: 'Atração de pesquisadores para desenvolvimento de projetos científicos em instituições do interior do estado.',
  },
  {
    id: 5,
    titulo: 'Apoio a Grupos de Pesquisa',
    programa: 'Universal',
    area: 'Difusão do Conhecimento',
    prazo: '25/06/2025',
    status: 'Ativo',
    vagas: 200,
    valor: 'Até R$ 50.000',
    descricao: 'Apoio financeiro a grupos de pesquisa consolidados em todas as áreas do conhecimento.',
  },
  {
    id: 6,
    titulo: 'Pós-Doutorado em ES',
    programa: 'PRODOC',
    area: 'Inovação',
    prazo: '05/07/2025',
    status: 'Ativo',
    vagas: 25,
    valor: 'R$ 41.000',
    descricao: 'Bolsas de pós-doutorado para pesquisadores sênior em instituições públicas do Espírito Santo.',
  },
];

const editaisEmAndamento = editais.slice(0, 4).map((edital, index) => ({
  ...edital,
  id: 101 + index,
  status: 'Em Andamento',
  prazo: ['12/02/2025', '28/02/2025', '15/03/2025', '30/03/2025'][index],
}));

const editaisFinalizados = editais.slice(2, 6).map((edital, index) => ({
  ...edital,
  id: 201 + index,
  status: 'Finalizado',
  prazo: ['10/12/2024', '20/12/2024', '15/01/2025', '31/01/2025'][index],
}));

const areaColors: Record<string, { bg: string; color: string }> = {
  'Carreira Científica':     { bg: 'rgba(20,184,166,0.14)', color: '#14b8a6' },
  'Pesquisa':                { bg: 'rgba(20,184,166,0.14)', color: '#14b8a6' },
  'Extensão':                { bg: 'rgba(20,184,166,0.14)', color: '#14b8a6' },
  'Internacional':           { bg: 'rgba(20,184,166,0.14)', color: '#14b8a6' },
  'Difusão do Conhecimento': { bg: 'rgba(20,184,166,0.14)', color: '#14b8a6' },
  'Inovação':                { bg: 'rgba(20,184,166,0.14)', color: '#14b8a6' },
};

/* Shared max-width + horizontal padding — matches across all sections */
const CONTAINER: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

export function CidadaoHomePage({ onLogin, onVerEdital, onInscricao, scrollToOportunidades, onScrolledToOportunidades }: CidadaoHomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas');
  const [selectedTab, setSelectedTab] = useState('Aberto');
  const [showAccessibility, setShowAccessibility] = useState(false);

  const oportunidadesRef = useRef<HTMLElement>(null);

  const handleScrollToOportunidades = () => {
    if (!oportunidadesRef.current) return;
    const top = oportunidadesRef.current.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!scrollToOportunidades || !oportunidadesRef.current) return;
    const top = oportunidadesRef.current.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
    onScrolledToOportunidades?.();
  }, [scrollToOportunidades, onScrolledToOportunidades]);

  const areas = ['Todas', 'Carreira Científica', 'Pesquisa', 'Difusão do Conhecimento', 'Extensão', 'Inovação', 'Internacional'];
  const tabs = ['Aberto', 'Em Andamento', 'Finalizado'];

  const editaisByTab = selectedTab === 'Em Andamento'
    ? editaisEmAndamento
    : selectedTab === 'Finalizado'
      ? editaisFinalizados
      : editais;

  const filtered = editaisByTab.filter(e => {
    const matchSearch =
      e.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.programa.toLowerCase().includes(searchQuery.toLowerCase());
    const matchArea = selectedArea === 'Todas' || e.area === selectedArea;
    const matchStatus = selectedTab === 'Aberto' || e.status === selectedTab;
    return matchSearch && matchArea && matchStatus;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--app-header) 82%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--app-header-border)',
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
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={fapesLogo} alt="FAPES" style={{ height: '36px', objectFit: 'contain' }} />
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                border: '1px solid #06b6d4',
                backgroundColor: 'transparent',
                color: '#06b6d4',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-family)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(6,182,212,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
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

      {/* ── HERO SECTION ── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--background)',
          padding: '6rem 0 5rem',
          minHeight: '520px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Background glow blobs */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, color-mix(in srgb, var(--card) 92%, transparent) 0%, color-mix(in srgb, var(--background) 98%, transparent) 68%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 54% 78% at 86% 34%, rgba(6,182,212,0.26) 0%, rgba(6,182,212,0.14) 44%, transparent 76%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 36% 42% at 6% 78%, rgba(6,182,212,0.08) 0%, transparent 72%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, var(--background))', pointerEvents: 'none', zIndex: 5 }} />

        <div
          style={{
            ...CONTAINER,
            width: '100%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2"
            style={{
              padding: '0.35rem 0.875rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(6,182,212,0.15)',
              border: '1px solid rgba(6,182,212,0.4)',
              marginBottom: '2rem',
            }}
          >
            <span style={{ color: '#06b6d4', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.08em', fontFamily: 'var(--font-family)' }}>
              TRANSPARÊNCIA &amp; CIÊNCIA
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--foreground)',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              maxWidth: '700px',
              fontFamily: 'var(--font-family)',
            }}
          >
            Simplicidade no acesso a{' '}
            <span style={{ color: '#06b6d4' }}>Projetos</span>.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--muted-foreground)',
              maxWidth: '640px',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              fontFamily: 'var(--font-family)',
            }}
          >
            Acompanhe as opções de inscrição da FAPES - Fundação de Amparo à Pesquisa e Inovação do Espírito Santo para projetos científicos, tecnológicos e de inovação.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleScrollToOportunidades}
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius)',
                border: 'none',
                backgroundColor: '#06b6d4',
                color: 'var(--background)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-family)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#06b6d4'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#06b6d4'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Analisar Oportunidades
            </button>
          </div>
        </div>
      </section>

      {/* ── OPORTUNIDADES SECTION ── */}
      <section ref={oportunidadesRef} style={{ padding: '4rem 0 5rem', backgroundColor: 'var(--background)' }}>
        <div style={{ ...CONTAINER }}>

          {/* Section header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                marginBottom: '0.375rem',
                fontFamily: 'var(--font-family)',
              }}
            >
              Oportunidades
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }}>
              Explore os fomentos disponíveis.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col" style={{ marginBottom: '2rem', gap: '1.25rem' }}>

            {/* Search */}
            <div
              className="flex items-center gap-2"
              style={{
                backgroundColor: 'var(--input-background)',
                border: '1px solid rgba(6,182,212,0.22)',
                borderRadius: 'var(--radius)',
                padding: '0 1.125rem',
                maxWidth: '360px',
              }}
            >
              <Search size={18} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Buscar por palavra-chave"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  padding: '0.5rem 0',
                  fontFamily: 'var(--font-family)',
                }}
              />
            </div>

            {/* Area filter pills */}
            <div className="flex flex-wrap gap-2" style={{ marginTop: '0.75rem' }}>
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: selectedArea === area ? '#06b6d4' : 'rgba(6,182,212,0.25)',
                    backgroundColor: selectedArea === area ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.08)',
                    color: selectedArea === area ? '#06b6d4' : 'var(--muted-foreground)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-family)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {area}
                </button>
              ))}
            </div>

            {/* Tab Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid rgba(6,182,212,0.2)',
                width: 'fit-content',
              }}
            >
              {tabs.map(tab => {
                const isActive = selectedTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    style={{
                      position: 'relative',
                      padding: '0.625rem 1.25rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: isActive ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-family)',
                      transition: 'color 0.2s',
                      outline: 'none',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--foreground)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--muted-foreground)'; }}
                  >
                    {tab}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-1px',
                          left: 0,
                          right: 0,
                          height: '2px',
                          backgroundColor: '#06b6d4',
                          borderRadius: '2px 2px 0 0',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editais Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(edital => {
              const areaColor = areaColors[edital.area] ?? { bg: 'rgba(20,184,166,0.14)', color: '#14b8a6' };
              return (
                <div
                  key={edital.id}
                  style={{
                    backgroundColor: 'rgba(6,182,212,0.06)',
                    border: '1px solid rgba(6,182,212,0.18)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212,0.45)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(6,182,212,0.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(6,182,212,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.18)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = 'rgba(6,182,212,0.06)';
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: '#06b6d4',
                        letterSpacing: '0.06em',
                        fontFamily: 'var(--font-family)',
                      }}
                    >
                      {edital.programa}
                    </span>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(20,184,166,0.35)',
                        backgroundColor: areaColor.bg,
                        color: areaColor.color,
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {edital.area}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--foreground)',
                      lineHeight: 1.4,
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    {edital.titulo}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      lineHeight: 1.6,
                      flex: 1,
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    {edital.descricao}
                  </p>

                  {/* Meta info */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(6,182,212,0.18)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '0.25rem', fontFamily: 'var(--font-family)' }}>
                        Inscrição até
                      </div>
                      <div
                        className="flex items-center gap-1"
                        style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}
                      >
                        <Calendar size={13} style={{ color: 'var(--muted-foreground)' }} />
                        {edital.prazo}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '0.25rem', fontFamily: 'var(--font-family)' }}>
                        Valor total
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>
                        {edital.valor}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => onVerEdital?.(edital.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(6,182,212,0.35)',
                      backgroundColor: 'rgba(6,182,212,0.12)',
                      color: '#06b6d4',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                      fontFamily: 'var(--font-family)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(6,182,212,0.22)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.55)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(6,182,212,0.12)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)'; }}
                  >
                    Ver Edital
                    <ArrowRight size={14} />
                  </button>
                  {selectedTab === 'Em Andamento' && (
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid rgba(20,184,166,0.35)',
                        backgroundColor: 'rgba(20,184,166,0.12)',
                        color: '#14b8a6',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        width: '100%',
                        fontFamily: 'var(--font-family)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(20,184,166,0.22)'; e.currentTarget.style.borderColor = 'rgba(20,184,166,0.55)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(20,184,166,0.12)'; e.currentTarget.style.borderColor = 'rgba(20,184,166,0.35)'; }}
                    >
                      Ver Andamento
                    </button>
                  )}
                  {selectedTab !== 'Em Andamento' && (
                    <button
                      onClick={() => {
                        if (selectedTab === 'Aberto') onInscricao?.(edital.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid rgba(20,184,166,0.35)',
                        backgroundColor: 'rgba(20,184,166,0.12)',
                        color: '#14b8a6',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        width: '100%',
                        fontFamily: 'var(--font-family)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(20,184,166,0.22)'; e.currentTarget.style.borderColor = 'rgba(20,184,166,0.55)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(20,184,166,0.12)'; e.currentTarget.style.borderColor = 'rgba(20,184,166,0.35)'; }}
                    >
                      {selectedTab === 'Finalizado' ? 'Ver Resultado' : 'Fazer Inscrição'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <Search size={40} style={{ opacity: 0.4 }} />
              <p style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }}>
                Nenhum edital encontrado com esses filtros.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
