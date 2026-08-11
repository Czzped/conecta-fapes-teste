import React from 'react';
import { BookOpen, CalendarDays, ChevronRight, ClipboardList, Database, FileCheck2, Settings, ShieldCheck, Tags, Target } from 'lucide-react';
import { useThemeTokens } from '../theme/ThemeContext';

interface ConfiguracoesProps {
  onBack: () => void;
  onOpenPlanejamento: () => void;
  onOpenReferencias: () => void;
  onOpenRubricas: () => void;
  onOpenDocumentos: () => void;
  onOpenFormularios: () => void;
  onOpenRegrasAcaoTransversal: () => void;
  onOpenCalendarioFolha: () => void;
  onOpenControleAcessos: () => void;
}

const actions = [
  {
    title: 'Planejamento Estratégico',
    description: 'Cadastro e manutenção dos planejamentos estratégicos, eixos e visão de programas por eixo.',
    Icon: Target,
    key: 'planejamento',
  },
  {
    title: 'Formulários',
    description: 'Biblioteca de formulários de inscrição, avaliação, recurso e anexos usados nas captações.',
    Icon: BookOpen,
    key: 'formularios',
  },
  {
    title: 'Referências Corporativas',
    description: 'Áreas de conhecimento, rubricas financeiras, diárias, cidades, regiões e finalidades.',
    Icon: Database,
    key: 'referencias',
  },
  {
    title: 'Rubricas',
    description: 'Cadastro de rubricas e subrubricas por natureza da despesa, com situação e relação pai/filha.',
    Icon: Tags,
    key: 'rubricas',
  },
  {
    title: 'Documentos Exigidos',
    description: 'Base de documentos que podem ser exigidos dos proponentes em captações.',
    Icon: FileCheck2,
    key: 'documentos',
  },
  {
    title: 'Regras de Ação Transversal',
    description: 'Políticas, vigências, faixas percentuais e rubricas permitidas para a reserva normativa.',
    Icon: ClipboardList,
    key: 'regras-acao-transversal',
  },
  {
    title: 'Calendário da Folha',
    description: 'Definição anual das datas de solicitação, geração e pagamento da folha de bolsas.',
    Icon: CalendarDays,
    key: 'calendario-folha',
  },
  {
    title: 'Controle de Acessos',
    description: 'Gerencie o permissionamento dos funcionários.',
    Icon: ShieldCheck,
    key: 'controle-acessos',
  },
];

export const Configuracoes: React.FC<ConfiguracoesProps> = ({ onBack, onOpenPlanejamento, onOpenReferencias, onOpenRubricas, onOpenDocumentos, onOpenFormularios, onOpenRegrasAcaoTransversal, onOpenCalendarioFolha, onOpenControleAcessos }) => {
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
    if (key === 'documentos') {
      onOpenDocumentos();
      return;
    }
    if (key === 'rubricas') {
      onOpenRubricas();
      return;
    }
    if (key === 'formularios') {
      onOpenFormularios();
      return;
    }
    if (key === 'regras-acao-transversal') {
      onOpenRegrasAcaoTransversal();
      return;
    }
    if (key === 'calendario-folha') {
      onOpenCalendarioFolha();
      return;
    }
    if (key === 'controle-acessos') {
      onOpenControleAcessos();
      return;
    }
    onOpenReferencias();
  };

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: T.accentSoft, borderRadius: 'var(--radius)' }}>
              <Settings size={18} style={{ color: T.accent }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: T.textPrimary, margin: 0, lineHeight: '1.5' }}>
              Configurações
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0, lineHeight: '1.5' }}>
            Acesse cadastros estruturantes e rotinas usadas com menor frequência no backoffice.
          </p>
        </div>

        <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, margin: '20px 0 28px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
          {actions.map(({ title, description, Icon, key }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleOpen(key)}
              style={{ ...cardStyle, minHeight: '150px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '18px' }}
              onMouseEnter={event => {
                event.currentTarget.style.backgroundColor = T.bgSurfaceMuted;
                event.currentTarget.style.borderColor = T.borderDefault;
              }}
              onMouseLeave={event => {
                event.currentTarget.style.backgroundColor = T.bgCard;
                event.currentTarget.style.borderColor = T.borderSubtle;
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} style={{ color: T.accent }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                    {title}
                  </h3>
                </div>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 0 48px', lineHeight: 1.5 }}>
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
