import { Info, Briefcase, Bell, FileUser, FolderOpen, Check, GraduationCap, Building2, Users, ChevronRight, Hotel, HeartHandshake } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

type AccessType = 'voluntario' | 'bolsista' | 'bolsistaSolicitarBolsa' | 'proponente' | 'coordenador';

interface HomePageProps {
  accessType?: AccessType;
  onNavigate?: (page: string) => void;
}

export function HomePage({ accessType, onNavigate }: HomePageProps) {
  const { t, language } = useLanguage();

  useEffect(() => {
    console.log('🏠 HomePage language changed to:', language);
  }, [language]);

  const scholarData = [
    { label: t('home.scholarName'), value: 'Paulo Sérgio Junior' },
    { label: t('home.project'), value: 'Conecta Fapes' },
    { label: t('home.scholarshipType'), value: accessType === 'voluntario' || accessType === 'bolsista' || accessType === 'bolsistaSolicitarBolsa' ? 'BPIG-VIII' : 'Iniciação Científica' },
    { label: t('home.amount'), value: 'R$ 700,00' },
    { label: t('home.validityPeriod'), value: '01/06/2025 - 01/06/2026' },
    { label: t('home.scholarshipStatus'), value: t('home.active'), isBadge: true },
  ];
  const hasDiariaPendenteAceite = accessType === 'bolsista' || accessType === 'coordenador';
  const [conviteVoluntario, setConviteVoluntario] = useState<'pendente' | 'aceito' | 'recusado'>('pendente');
  const [conviteSolicitarBolsa, setConviteSolicitarBolsa] = useState<'pendente' | 'aceito' | 'recusado'>('pendente');

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Header with icon button */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <button
            className="p-2 transition-colors"
            style={{
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              color: 'var(--title-icon-foreground)',
              borderRadius: 'var(--radius)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
            }}
            aria-label="Portal"
          >
            <Briefcase size={20} />
          </button>
          <h1 
            style={{
              color: 'var(--foreground)',
            }}
          >
            {t('home.portalTitle')}
          </h1>
        </div>
        {accessType === 'coordenador' && (
          <button
            type="button"
            onClick={() => onNavigate?.('demanda-induzida')}
            style={{
              padding: '0.75rem 1.1rem',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(34, 211, 238, 0.35)',
              backgroundColor: 'rgba(34, 211, 238, 0.12)',
              color: 'var(--primary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              fontFamily: 'var(--font-family)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Demanda Induzida Aberta
          </button>
        )}
      </div>

      {/* Project Card - Only for Coordenador */}
      {accessType === 'coordenador' && (
        <div className="mb-8">
          {/* Project Card */}
          <div
            className="p-5 w-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
              borderRadius: 'var(--radius)',
            }}
          >
            {/* Header - Nome do Projeto, Status, Bolsistas */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-3">
                <h3 
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    margin: 0,
                  }}
                >
                  Conecta Fapes
                </h3>
                
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center px-2.5 py-1"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {t('home.active')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} style={{ color: 'var(--muted-foreground)' }} />
                    <span 
                      style={{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                      }}
                    >
                      60 {t('home.scholars')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bolsas Section */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} style={{ color: '#3b82f6' }} />
                  <span 
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {t('home.scholars')}
                  </span>
                </div>
                <span 
                  style={{
                    color: '#3b82f6',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  50%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div 
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'color-mix(in srgb, #3b82f6 15%, transparent)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                }}
              >
                <div 
                  style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              
              {/* Values */}
              <div className="flex items-center justify-between">
                <span 
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  R$ 60.000,00
                </span>
                <span 
                  style={{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  R$ 120.000,00
                </span>
              </div>
            </div>

            {/* Capital e Custeio Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 size={18} style={{ color: '#14b8a6' }} />
                  <span 
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    Capital e Custeio
                  </span>
                </div>
                <span 
                  style={{
                    color: '#14b8a6',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  67%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div 
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'color-mix(in srgb, #14b8a6 15%, transparent)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                }}
              >
                <div 
                  style={{
                    width: '67%',
                    height: '100%',
                    backgroundColor: '#14b8a6',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              
              {/* Values */}
              <div className="flex items-center justify-between">
                <span 
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  R$ 108.500,00
                </span>
                <span 
                  style={{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }}
                >
                  R$ 250.000,00
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificações Section */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
            }}
          >
            <Bell size={20} />
          </div>
          <h3 style={{ color: 'var(--foreground)', margin: 0 }}>
            {t('notifications.title')}
          </h3>
        </div>
        
        <div className="space-y-3">
          {hasDiariaPendenteAceite && (
            <button
              type="button"
              onClick={() => onNavigate?.('certificados-diarias')}
              className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 text-left transition-colors"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 24%, transparent)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div className="flex items-start gap-3">
                <Hotel size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{
                    color: 'var(--foreground)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--text-sm)',
                    margin: '0 0 0.25rem 0',
                  }}>
                    Diária aguardando assinatura
                  </p>
                  <p style={{
                    color: 'var(--muted-foreground)',
                    fontWeight: 'var(--font-weight-normal)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.5',
                    margin: 0,
                  }}>
                    Você possui uma Diária aguardando o seu aceite.
                  </p>
                  <p style={{
                    color: 'var(--muted-foreground)',
                    fontWeight: 'var(--font-weight-normal)',
                    fontSize: 'var(--text-xs)',
                    lineHeight: '1.5',
                    margin: '0.25rem 0 0',
                  }}>
                    Linhares/ES · partida em 03/07/2026 às 07:00.
                  </p>
                </div>
              </div>
              <span
                className="inline-flex items-center gap-2"
                style={{
                  color: 'var(--primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  whiteSpace: 'nowrap',
                }}
              >
                Assinar diária
                <ChevronRight size={16} />
              </span>
            </button>
          )}

          {accessType === 'bolsistaSolicitarBolsa' && conviteSolicitarBolsa === 'pendente' && (
            <div
              className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 24%, transparent)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div className="flex items-start gap-3">
                <Users size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-sm)', margin: '0 0 0.25rem 0' }}>
                    Convite para acessar Solicitar Bolsa
                  </p>
                  <p style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', lineHeight: '1.5', margin: 0 }}>
                    O Coordenador Paulo Sergio Junior, do Projeto Conecta Fapes, convidou você para ter acesso a<br />
                    funcionalidade de Solicitar Bolsa. Deseja aceitar?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:shrink-0">
                <button
                  type="button"
                  onClick={() => { setConviteSolicitarBolsa('recusado'); toast('Você recusou o convite para acessar Solicitar Bolsa.'); }}
                  className="px-4 py-2 transition-colors"
                  style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Recusar
                </button>
                <button
                  type="button"
                  onClick={() => { setConviteSolicitarBolsa('aceito'); toast.success('Você aceitou o convite para acessar Solicitar Bolsa.'); }}
                  className="px-4 py-2 transition-colors"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  Aceitar
                </button>
              </div>
            </div>
          )}

          {accessType === 'voluntario' && conviteVoluntario === 'pendente' && (
            <div
              className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 24%, transparent)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div className="flex items-start gap-3">
                <HeartHandshake size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-sm)', margin: '0 0 0.25rem 0' }}>
                    Convite para participar como voluntário
                  </p>
                  <p style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', lineHeight: '1.5', margin: 0 }}>
                    Você foi indicado para ser voluntário do projeto{' '}
                    <strong style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>Conecta Fapes</strong>. Deseja aceitar?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:shrink-0">
                <button
                  type="button"
                  onClick={() => { setConviteVoluntario('recusado'); toast('Você recusou o convite para ser voluntário.'); }}
                  className="px-4 py-2 transition-colors"
                  style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Recusar
                </button>
                <button
                  type="button"
                  onClick={() => { setConviteVoluntario('aceito'); toast.success('Você aceitou participar do projeto como voluntário.'); }}
                  className="px-4 py-2 transition-colors"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  Aceitar
                </button>
              </div>
            </div>
          )}

          {accessType === 'voluntario' && conviteVoluntario !== 'pendente' && (
            <div
              className="flex items-start gap-3 p-4"
              style={{
                backgroundColor: 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <Check size={20} style={{ color: conviteVoluntario === 'aceito' ? '#22c55e' : 'var(--muted-foreground)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: '1.5', margin: 0 }}>
                {conviteVoluntario === 'aceito'
                  ? 'Você aceitou o convite para ser voluntário do projeto Conecta Fapes.'
                  : 'Você recusou o convite para ser voluntário do projeto Conecta Fapes.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Divider */}
      <div 
        className="my-8"
        style={{
          height: '1px',
          backgroundColor: 'var(--border)',
        }}
      />

      {/* Submissão de Propostas Section */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
            }}
          >
            <FolderOpen size={20} />
          </div>
          <h3 style={{ color: 'var(--foreground)', margin: 0 }}>
            Submissão de Propostas
          </h3>
        </div>

        {/* Subtitle and Button on the same line */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
          <button
            className="px-4 py-2 transition-colors self-end md:self-auto"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
            }}
            onClick={() => onNavigate?.('editais')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 10%, transparent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Ver Todas
          </button>
        </div>

        {/* Content - Clickable Card */}
        <div>
          <a
            href="#"
            className="group"
            style={{
              display: 'block',
              textDecoration: 'none',
            }}
          >
            <div
              className="p-4 transition-all"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                borderTop: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
                borderRight: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
                borderBottom: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
                borderLeft: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 8%, transparent)';
                e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary) 25%, transparent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 3%, transparent)';
                e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--primary) 12%, transparent)';
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 
                    style={{
                      color: 'var(--primary)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Edital Fapes Nº 27/2025 – Apoio à Editoração e Publicação de Periódicos Científicos
                  </h4>
                  <p
                    style={{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-normal)',
                      margin: 0,
                    }}
                  >
                    Inscrições até 01/06/2026
                  </p>
                </div>
                <div 
                  className="transition-transform"
                  style={{
                    color: 'var(--primary)',
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Dados do Bolsista Section */}
      <section>
        {/* Divider */}
        <div 
          className="mb-8"
          style={{
            height: '1px',
            backgroundColor: 'var(--border)',
          }}
        />

        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
            }}
          >
            <FileUser size={20} />
          </div>
          <h3 style={{ color: 'var(--foreground)', margin: 0 }}>
            Informações da Bolsa
          </h3>
        </div>
        
        <div 
          className="p-5"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderLeft: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
            {scholarData.map((item, index) => (
              <div key={index}>
                <label 
                  className="block mb-2"
                  style={{ 
                    color: 'var(--muted-foreground)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  {item.label}
                </label>
                {item.isBadge ? (
                  <span
                    className="inline-flex items-center px-3 py-1"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '9999px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.value}
                  </span>
                ) : (
                  <p 
                    style={{ 
                      color: 'var(--foreground)',
                      fontWeight: 'var(--font-weight-normal)',
                      fontSize: 'var(--text-sm)',
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
