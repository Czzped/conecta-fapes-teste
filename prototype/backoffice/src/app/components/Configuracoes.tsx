import React from 'react';
import { ArrowLeft, Building2, ChevronRight, Settings, Target } from 'lucide-react';

interface ConfiguracoesProps {
  onBack: () => void;
  onOpenPlanejamento: () => void;
  onOpenInstituicoes: () => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '22px',
};

const actions = [
  {
    title: 'Planejamento Estratégico',
    description: 'Cadastro e manutenção dos planejamentos estratégicos, eixos e visão de programas por eixo.',
    Icon: Target,
    color: '#38bdf8',
    key: 'planejamento',
  },
  {
    title: 'Instituições',
    description: 'Cadastro corporativo de instituições, unidades com CNPJ, setores sem CNPJ e dirigentes.',
    Icon: Building2,
    color: '#00c1af',
    key: 'instituicoes',
  },
];

export const Configuracoes: React.FC<ConfiguracoesProps> = ({ onBack, onOpenPlanejamento, onOpenInstituicoes }) => {
  const handleOpen = (key: string) => {
    if (key === 'planejamento') {
      onOpenPlanejamento();
      return;
    }
    onOpenInstituicoes();
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px' }}>
          <button
            onClick={onBack}
            style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', backgroundColor: 'rgba(30,41,59,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: 'rgba(0,193,175,0.15)', borderRadius: 'var(--radius)' }}>
            <Settings size={18} style={{ color: '#00c1af' }} />
          </div>
          <div style={{ flex: 1, marginTop: '4px' }}>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: '#ffffff', margin: '0 0 8px', lineHeight: '1.5' }}>
              Configurações
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.5' }}>
              Acesse cadastros estruturantes e rotinas usadas com menor frequência no backoffice.
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '20px 0 28px' }} />

        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
            Cadastros e Parâmetros
          </h2>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            Use esta área para manter dados de base que dão suporte aos módulos operacionais.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
          {actions.map(({ title, description, Icon, color, key }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleOpen(key)}
              style={{ ...cardStyle, minHeight: '150px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '18px' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius)', backgroundColor: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 8px' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.58)', margin: 0, lineHeight: 1.5 }}>
                  {description}
                </p>
              </div>
              <ChevronRight size={18} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
