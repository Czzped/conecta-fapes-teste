import React from 'react';
import { ArrowLeft, BookOpen, Building2, ChevronRight, Database, FileCheck2, Settings, Target, UserRound } from 'lucide-react';
import { useThemeTokens } from '../theme/ThemeContext';

interface ConfiguracoesProps {
  onBack: () => void;
  onOpenPlanejamento: () => void;
  onOpenInstituicoes: () => void;
  onOpenPessoas: () => void;
  onOpenReferencias: () => void;
  onOpenDocumentos: () => void;
  onOpenFormularios: () => void;
}

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
  {
    title: 'Pessoas Físicas',
    description: 'Cadastro de pessoas com CPF único, situação cadastral, contato e currículo Lattes.',
    Icon: UserRound,
    color: '#a855f7',
    key: 'pessoas',
  },
  {
    title: 'Referências Corporativas',
    description: 'Áreas de conhecimento, rubricas financeiras, cidades, regiões e finalidades.',
    Icon: Database,
    color: '#f59e0b',
    key: 'referencias',
  },
  {
    title: 'Documentos Exigidos',
    description: 'Base de documentos que podem ser exigidos dos proponentes em captações.',
    Icon: FileCheck2,
    color: '#22c55e',
    key: 'documentos',
  },
  {
    title: 'Formulários',
    description: 'Biblioteca de formulários de inscrição, avaliação, recurso e anexos usados nas captações.',
    Icon: BookOpen,
    color: '#38bdf8',
    key: 'formularios',
  },
];

export const Configuracoes: React.FC<ConfiguracoesProps> = ({ onBack, onOpenPlanejamento, onOpenInstituicoes, onOpenPessoas, onOpenReferencias, onOpenDocumentos, onOpenFormularios }) => {
  const { T } = useThemeTokens();

  const cardStyle: React.CSSProperties = {
    backgroundColor: T.bgCard,
    border: `1px solid ${T.borderSubtle}`,
    borderRadius: '10px',
    padding: '22px',
  };

  const handleOpen = (key: string) => {
    if (key === 'planejamento') {
      onOpenPlanejamento();
      return;
    }
    if (key === 'instituicoes') {
      onOpenInstituicoes();
      return;
    }
    if (key === 'pessoas') {
      onOpenPessoas();
      return;
    }
    if (key === 'documentos') {
      onOpenDocumentos();
      return;
    }
    if (key === 'formularios') {
      onOpenFormularios();
      return;
    }
    onOpenReferencias();
  };

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px' }}>
          <button
            onClick={onBack}
            style={{ width: '36px', height: '36px', border: `1px solid ${T.borderSubtle}`, borderRadius: 'var(--radius)', backgroundColor: T.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} style={{ color: T.textSecondary }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: T.accentSoft, borderRadius: 'var(--radius)' }}>
            <Settings size={18} style={{ color: T.accent }} />
          </div>
          <div style={{ flex: 1, marginTop: '4px' }}>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: T.textPrimary, margin: '0 0 8px', lineHeight: '1.5' }}>
              Configurações
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0, lineHeight: '1.5' }}>
              Acesse cadastros estruturantes e rotinas usadas com menor frequência no backoffice.
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, margin: '20px 0 28px' }} />

        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
            Cadastros e Parâmetros
          </h2>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
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
                <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 8px' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  {description}
                </p>
              </div>
              <ChevronRight size={18} style={{ color: T.iconSubdued, flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
