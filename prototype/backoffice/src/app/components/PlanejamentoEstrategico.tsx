import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, DollarSign, Edit3, Plus, Save, Search, Target, Trash2, X } from 'lucide-react';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';
import { ConfiguracoesPageHeader } from './ConfiguracoesPageHeader';
import { BackofficeDatePicker } from './BackofficeDatePicker';

type EstadoPlano = 'Ativo' | 'Finalizado' | 'Rascunho';

interface ProgramaAssociado {
  id: number;
  nome: string;
  estado: string;
  valorInvestido: number;
}

interface EixoEstrategico {
  id: number;
  nome: string;
  descricao: string;
  programas: number;
  valorInvestido: number;
  programasAssociados?: ProgramaAssociado[];
}

interface PlanoEstrategico {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  estado: EstadoPlano;
  eixos: EixoEstrategico[];
}

const buildStyles = (T: ThemeTokens) => ({
  card: {
    backgroundColor: T.bgCard,
    border: `1px solid ${T.borderSubtle}`,
    borderRadius: '10px',
    padding: '24px',
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    marginBottom: '8px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    backgroundColor: T.bgInput,
    border: `1px solid ${T.borderDefault}`,
    borderRadius: 'var(--radius)',
    padding: '10px 12px',
    color: T.textPrimary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  cellLabel: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-xs)',
    color: T.textMuted,
    marginBottom: '4px',
  } as React.CSSProperties,
});

const estadoColor = (estado: EstadoPlano) => {
  if (estado === 'Ativo') return '#22c55e';
  if (estado === 'Rascunho') return '#f59e0b';
  return '#a3a3a3';
};

const statusProgramaAssociado = (estado: string): 'Ativo' | 'Finalizado' => (
  ['Finalizado', 'Encerrado'].includes(estado) ? 'Finalizado' : 'Ativo'
);

const statusProgramaColor = (status: 'Ativo' | 'Finalizado') => (
  status === 'Ativo' ? '#22c55e' : '#a3a3a3'
);

const formatCurrency = (value: number) => (
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);

const formatPercent = (value: number) => (
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
);

const totalProgramasEixo = (eixo: EixoEstrategico) => eixo.programasAssociados?.length ?? eixo.programas;

const planosIniciais: PlanoEstrategico[] = [
  {
    id: 1,
    nome: 'Planejamento Estratégico 2026-2029',
    descricao: 'Diretrizes estratégicas para orientar programas, parcerias e captações do ciclo 2026-2029.',
    dataInicio: '01/01/2026',
    dataFim: '31/12/2029',
    estado: 'Ativo',
    eixos: [
      {
        id: 1,
        nome: 'Ciência, tecnologia e inovação',
        descricao: 'Fomento a projetos de pesquisa aplicada, inovação e transferência de conhecimento.',
        programas: 4,
        valorInvestido: 8400000,
        programasAssociados: [
          { id: 1, nome: 'Programa de Pesquisa Aplicada', estado: 'Ativo', valorInvestido: 2900000 },
          { id: 2, nome: 'Programa de Inovação Aberta', estado: 'Ativo', valorInvestido: 2100000 },
          { id: 3, nome: 'Programa de Laboratórios Estratégicos', estado: 'Ativo', valorInvestido: 1800000 },
          { id: 4, nome: 'Programa de Transferência Tecnológica', estado: 'Ativo', valorInvestido: 1600000 },
        ],
      },
      {
        id: 2,
        nome: 'Desenvolvimento regional sustentável',
        descricao: 'Ações orientadas ao desenvolvimento territorial, social, ambiental e econômico.',
        programas: 3,
        valorInvestido: 5200000,
        programasAssociados: [
          { id: 5, nome: 'Programa Territórios Sustentáveis', estado: 'Ativo', valorInvestido: 2200000 },
          { id: 6, nome: 'Programa Economia Verde', estado: 'Ativo', valorInvestido: 1700000 },
          { id: 7, nome: 'Programa Cidades Resilientes', estado: 'Finalizado', valorInvestido: 1300000 },
        ],
      },
      {
        id: 3,
        nome: 'Formação de pesquisadores',
        descricao: 'Apoio à formação, atração e fixação de talentos científicos.',
        programas: 5,
        valorInvestido: 7300000,
        programasAssociados: [
          { id: 8, nome: 'Programa de Bolsas de Mestrado', estado: 'Ativo', valorInvestido: 1800000 },
          { id: 9, nome: 'Programa de Bolsas de Doutorado', estado: 'Ativo', valorInvestido: 2200000 },
          { id: 10, nome: 'Programa Pesquisador Visitante', estado: 'Ativo', valorInvestido: 950000 },
          { id: 11, nome: 'Programa Jovens Cientistas', estado: 'Ativo', valorInvestido: 1150000 },
          { id: 12, nome: 'Programa Fixação de Talentos', estado: 'Ativo', valorInvestido: 1200000 },
        ],
      },
    ],
  },
  {
    id: 2,
    nome: 'Planejamento Estratégico 2022-2025',
    descricao: 'Ciclo estratégico anterior, usado como referência histórica para continuidade de programas.',
    dataInicio: '01/01/2022',
    dataFim: '31/12/2025',
    estado: 'Finalizado',
    eixos: [
      {
        id: 1,
        nome: 'Pesquisa científica',
        descricao: 'Ampliação da base científica e tecnológica do estado.',
        programas: 6,
        valorInvestido: 6900000,
        programasAssociados: [
          { id: 13, nome: 'Programa Universal de Pesquisa', estado: 'Finalizado', valorInvestido: 1800000 },
          { id: 14, nome: 'Programa Primeiros Projetos', estado: 'Finalizado', valorInvestido: 900000 },
          { id: 15, nome: 'Programa Núcleos Emergentes', estado: 'Finalizado', valorInvestido: 1200000 },
          { id: 16, nome: 'Programa Infraestrutura de Pesquisa', estado: 'Finalizado', valorInvestido: 1400000 },
          { id: 17, nome: 'Programa Cooperação Científica', estado: 'Finalizado', valorInvestido: 850000 },
          { id: 18, nome: 'Programa Redes Temáticas', estado: 'Finalizado', valorInvestido: 750000 },
        ],
      },
      {
        id: 2,
        nome: 'Inovação e empreendedorismo',
        descricao: 'Apoio à inovação em ambientes produtivos e institucionais.',
        programas: 3,
        valorInvestido: 3600000,
        programasAssociados: [
          { id: 19, nome: 'Programa Centelha', estado: 'Finalizado', valorInvestido: 1400000 },
          { id: 20, nome: 'Programa Tecnova', estado: 'Finalizado', valorInvestido: 1600000 },
          { id: 21, nome: 'Programa Ambientes de Inovação', estado: 'Finalizado', valorInvestido: 600000 },
        ],
      },
    ],
  },
  {
    id: 3,
    nome: 'Planejamento Estratégico 2030-2033',
    descricao: 'Rascunho inicial para o próximo ciclo de planejamento institucional.',
    dataInicio: '01/01/2030',
    dataFim: '31/12/2033',
    estado: 'Rascunho',
    eixos: [
      {
        id: 1,
        nome: 'Transformação digital',
        descricao: 'Uso de dados, automação e infraestrutura digital para fomento.',
        programas: 0,
        valorInvestido: 0,
        programasAssociados: [],
      },
    ],
  },
];

const planoSemEixos = ({ eixos: _eixos, ...plano }: PlanoEstrategico): Omit<PlanoEstrategico, 'eixos'> => plano;

interface PlanejamentoEstrategicoProps {
  onBack: () => void;
}

export const PlanejamentoEstrategico: React.FC<PlanejamentoEstrategicoProps> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);

  const [planos, setPlanos] = useState<PlanoEstrategico[]>(planosIniciais);
  const [selectedPlanoId, setSelectedPlanoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<EstadoPlano | 'Todos'>('Todos');
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cadastro' | 'dashboard'>('cadastro');
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [draftPlano, setDraftPlano] = useState<Omit<PlanoEstrategico, 'eixos'> | null>(null);
  const [novoEixo, setNovoEixo] = useState({
    nome: '',
    descricao: '',
  });
  const [eixosCriacao, setEixosCriacao] = useState([{ nome: '', descricao: '' }]);
  const [editingEixoId, setEditingEixoId] = useState<number | null>(null);
  const [selectedEixoDashboardId, setSelectedEixoDashboardId] = useState<number | null>(null);
  const [draftEixo, setDraftEixo] = useState({
    nome: '',
    descricao: '',
  });

  const selectedPlano = planos.find(plano => plano.id === selectedPlanoId) || null;
  const filteredPlanos = useMemo(() => {
    return planos.filter(plano => {
      const matchesText = `${plano.nome} ${plano.descricao}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado = estadoFilter === 'Todos' || plano.estado === estadoFilter;
      return matchesText && matchesEstado;
    });
  }, [estadoFilter, planos, searchTerm]);

  const openPlano = (plano: PlanoEstrategico) => {
    setSelectedPlanoId(plano.id);
    setDraftPlano(planoSemEixos(plano));
    setActiveTab('cadastro');
    setEditing(false);
    setCreating(false);
    setNovoEixo({ nome: '', descricao: '' });
    setEditingEixoId(null);
    setSelectedEixoDashboardId(null);
    setDraftEixo({ nome: '', descricao: '' });
    setEixosCriacao([{ nome: '', descricao: '' }]);
  };

  const criarPlano = () => {
    const novoPlano: PlanoEstrategico = {
      id: Math.max(...planos.map(plano => plano.id), 0) + 1,
      nome: 'Novo Planejamento Estratégico',
      descricao: 'Descreva as diretrizes estratégicas deste ciclo.',
      dataInicio: '',
      dataFim: '',
      estado: 'Rascunho',
      eixos: [],
    };
    setPlanos(prev => [...prev, novoPlano]);
    setSelectedPlanoId(novoPlano.id);
    setDraftPlano(planoSemEixos(novoPlano));
    setActiveTab('cadastro');
    setEditing(true);
    setCreating(true);
    setEditingEixoId(null);
    setSelectedEixoDashboardId(null);
    setDraftEixo({ nome: '', descricao: '' });
  };

  const salvarPlano = () => {
    if (!draftPlano) return;
    setPlanos(prev => prev.map(plano => {
      if (plano.id !== draftPlano.id) return plano;
      const eixos = creating
        ? eixosCriacao
          .filter(eixo => eixo.nome.trim())
          .map((eixo, index) => ({
            id: index + 1,
            nome: eixo.nome,
            descricao: eixo.descricao || 'Descrição pendente.',
            programas: 0,
            valorInvestido: 0,
            programasAssociados: [],
          }))
        : plano.eixos;
      return { ...plano, ...draftPlano, eixos };
    }));
    setEditing(false);
    setCreating(false);
  };

  const ativarPlano = () => {
    if (!draftPlano) return;
    const ativo = { ...draftPlano, estado: 'Ativo' as EstadoPlano };
    const eixos = creating
      ? eixosCriacao
        .filter(eixo => eixo.nome.trim())
        .map((eixo, index) => ({
          id: index + 1,
          nome: eixo.nome,
          descricao: eixo.descricao || 'Descrição pendente.',
          programas: 0,
          valorInvestido: 0,
          programasAssociados: [],
        }))
      : undefined;
    setDraftPlano(ativo);
    setPlanos(prev => prev.map(plano => plano.id === ativo.id ? { ...plano, ...ativo, ...(eixos ? { eixos } : {}) } : plano));
    setEditing(false);
    setCreating(false);
  };

  const adicionarEixo = () => {
    if (!selectedPlano || !novoEixo.nome.trim()) return;
    const eixo: EixoEstrategico = {
      id: Math.max(...selectedPlano.eixos.map(item => item.id), 0) + 1,
      nome: novoEixo.nome,
      descricao: novoEixo.descricao || 'Descrição pendente.',
      programas: 0,
      valorInvestido: 0,
      programasAssociados: [],
    };
    setPlanos(prev => prev.map(plano => plano.id === selectedPlano.id ? { ...plano, eixos: [...plano.eixos, eixo] } : plano));
    setNovoEixo({ nome: '', descricao: '' });
  };

  const removerEixo = (id: number) => {
    if (!selectedPlano) return;
    setPlanos(prev => prev.map(plano => plano.id === selectedPlano.id ? { ...plano, eixos: plano.eixos.filter(eixo => eixo.id !== id) } : plano));
    if (editingEixoId === id) {
      setEditingEixoId(null);
      setDraftEixo({ nome: '', descricao: '' });
    }
  };

  const iniciarEdicaoEixo = (eixo: EixoEstrategico) => {
    setEditingEixoId(eixo.id);
    setDraftEixo({ nome: eixo.nome, descricao: eixo.descricao });
  };

  const cancelarEdicaoEixo = () => {
    setEditingEixoId(null);
    setDraftEixo({ nome: '', descricao: '' });
  };

  const salvarEdicaoEixo = () => {
    if (!selectedPlano || !editingEixoId || !draftEixo.nome.trim()) return;
    setPlanos(prev => prev.map(plano => {
      if (plano.id !== selectedPlano.id) return plano;
      return {
        ...plano,
        eixos: plano.eixos.map(eixo => eixo.id === editingEixoId ? {
          ...eixo,
          nome: draftEixo.nome,
          descricao: draftEixo.descricao || 'Descrição pendente.',
        } : eixo),
      };
    }));
    cancelarEdicaoEixo();
  };

  if (!selectedPlano) {
    return (
      <div style={{ padding: '32px' }}>
        <Header
          title="Planejamento Estratégico"
          subtitle="Gerencie os ciclos estratégicos e abra um planejamento para cadastrar seus eixos."
          onBack={onBack}
          action={<SmallButton icon={<Plus size={14} />} label="Criar Planejamento" onClick={criarPlano} filled />}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={S.label}>Pesquisar</label>
              <div style={{ position: 'relative' }}>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar"
                  style={{ ...S.input, paddingRight: '40px' }}
                />
                <Search size={17} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
              </div>
            </div>
            <SystemDropdown
              label="Status"
              value={estadoFilter}
              options={['Todos', 'Ativo', 'Finalizado', 'Rascunho']}
              isOpen={statusFilterOpen}
              onOpen={() => setStatusFilterOpen(open => !open)}
              onChange={value => {
                setEstadoFilter(value as EstadoPlano | 'Todos');
                setStatusFilterOpen(false);
              }}
            />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary }}>
            Exibindo {Math.min(filteredPlanos.length, 10)} resultados de {filteredPlanos.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredPlanos.map(plano => (
            <button
              key={plano.id}
              onClick={() => openPlano(plano)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 0.7fr 1.15fr 1fr 1fr 40px',
                gap: '16px',
                alignItems: 'center',
                width: '100%',
                padding: '20px 24px',
                backgroundColor: T.bgCard,
                border: `1px solid ${T.borderSubtle}`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <ReadCell label="Planejamento" value={plano.nome} strong />
              <ReadCell label="Eixos" value={String(plano.eixos.length)} />
              <ReadCell label="Vigência" value={`${plano.dataInicio || 'Pendente'} - ${plano.dataFim || 'Pendente'}`} />
              <ReadCell label="Programas Vinculados" value={String(plano.eixos.reduce((total, eixo) => total + totalProgramasEixo(eixo), 0))} />
              <div>
                <div style={S.cellLabel}>Status</div>
                <StatusBadge label={plano.estado} color={estadoColor(plano.estado)} />
              </div>
              <ChevronRight size={18} style={{ color: T.iconSubdued, justifySelf: 'center' }} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const totalProgramas = selectedPlano.eixos.reduce((total, eixo) => total + totalProgramasEixo(eixo), 0);
  const totalInvestido = selectedPlano.eixos.reduce((total, eixo) => total + eixo.valorInvestido, 0);
  const maiorInvestimentoEixo = Math.max(...selectedPlano.eixos.map(eixo => eixo.valorInvestido), 1);
  const currentDraft = draftPlano || planoSemEixos(selectedPlano);
  const selectedEixoDashboard = selectedPlano.eixos.find(eixo => eixo.id === selectedEixoDashboardId) || null;

  if (creating) {
    return (
      <div style={{ padding: '32px' }}>
        <Header
          title="Criar Planejamento Estratégico"
          subtitle="Preencha as informações abaixo para criar um novo planejamento estratégico."
          onBack={onBack}
          breadcrumbParent="Planejamento Estratégico"
          breadcrumbTitle="Criar Planejamento"
          onBreadcrumbParentClick={() => setSelectedPlanoId(null)}
        />

        <div style={{ ...S.card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: T.accentText }}>1</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              Identificação do Planejamento
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Field label="Nome">
              <input value={currentDraft.nome} onChange={(event) => setDraftPlano(prev => prev ? { ...prev, nome: event.target.value } : prev)} style={S.input} />
            </Field>
            <Field label="Data de Início">
              <BackofficeDatePicker value={currentDraft.dataInicio} onChange={(value) => setDraftPlano(prev => prev ? { ...prev, dataInicio: value } : prev)} style={S.input} />
            </Field>
            <Field label="Data de Fim">
              <BackofficeDatePicker value={currentDraft.dataFim} onChange={(value) => setDraftPlano(prev => prev ? { ...prev, dataFim: value } : prev)} style={S.input} />
            </Field>
          </div>

          <Field label="Descrição">
            <textarea value={currentDraft.descricao} onChange={(event) => setDraftPlano(prev => prev ? { ...prev, descricao: event.target.value } : prev)} rows={4} style={{ ...S.input, resize: 'vertical' }} />
          </Field>

        </div>

        <div style={{ ...S.card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: T.accentText }}>2</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              Eixo Estratégico
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {eixosCriacao.map((eixo, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                <Field label="Nome">
                  <input
                    value={eixo.nome}
                    onChange={(event) => setEixosCriacao(prev => prev.map((item, itemIndex) => itemIndex === index ? { ...item, nome: event.target.value } : item))}
                    placeholder="Nome do eixo estratégico"
                    style={S.input}
                  />
                </Field>
                <Field label="Descrição">
                  <input
                    value={eixo.descricao}
                    onChange={(event) => setEixosCriacao(prev => prev.map((item, itemIndex) => itemIndex === index ? { ...item, descricao: event.target.value } : item))}
                    placeholder="Descrição do eixo estratégico"
                    style={S.input}
                  />
                </Field>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SmallButton icon={<Plus size={14} />} label="Adicionar Eixo" onClick={() => setEixosCriacao(prev => [...prev, { nome: '', descricao: '' }])} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <SmallButton icon={null} label="Salvar Rascunho" onClick={salvarPlano} muted />
          <SmallButton icon={null} label="Ativar Planejamento" onClick={ativarPlano} filled />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      <Header
        title={selectedPlano.nome}
        subtitle="Cadastro do planejamento estratégico e gestão dos eixos associados."
        onBack={onBack}
        breadcrumbParent="Planejamento Estratégico"
        breadcrumbTitle="Detalhes"
        onBreadcrumbParentClick={() => setSelectedPlanoId(null)}
        hideDivider
      />

      {activeTab === 'cadastro' && (
        <>
          <div style={{ ...S.card, marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: T.accentText }}>1</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                Identificação do Planejamento
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <Field label="Nome">
                <ReadValue value={selectedPlano.nome} />
              </Field>
              <Field label="Data de Início">
                <ReadValue value={selectedPlano.dataInicio || 'Pendente'} />
              </Field>
              <Field label="Data de Fim">
                <ReadValue value={selectedPlano.dataFim || 'Pendente'} />
              </Field>
            </div>

            <Field label="Descrição">
              <ReadValue value={selectedPlano.descricao} />
            </Field>
          </div>

          <div style={{ ...S.card, marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: T.accentText }}>2</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                Eixo Estratégico
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedPlano.eixos.map(eixo => (
                <div key={eixo.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px' }}>
                  <Field label="Nome">
                    <ReadValue value={eixo.nome} />
                  </Field>
                  <Field label="Descrição">
                    <ReadValue value={eixo.descricao} />
                  </Field>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'dashboard' && (
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '22px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>
                Investimento por eixo estratégico
              </h2>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
                Distribuição dos programas e do valor investido nos eixos do planejamento selecionado.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={S.cellLabel}>Valor total investido</div>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: T.textPrimary, margin: 0 }}>
                {formatCurrency(totalInvestido)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {selectedPlano.eixos.map(eixo => {
              const percentualInvestido = totalInvestido > 0 ? (eixo.valorInvestido / totalInvestido) * 100 : 0;
              const larguraBarra = maiorInvestimentoEixo > 0 ? (eixo.valorInvestido / maiorInvestimentoEixo) * 100 : 0;
              const isSelected = selectedEixoDashboardId === eixo.id;
              return (
                <button
                  key={`${eixo.id}-dashboard`}
                  onClick={() => setSelectedEixoDashboardId(eixo.id)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: isSelected ? T.accentSoft : T.bgSurfaceMuted,
                    border: isSelected ? `1px solid ${T.accent}` : `1px solid ${T.borderSubtle}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.6fr 0.9fr 0.7fr', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <ReadCell label="Eixo" value={eixo.nome} strong />
                    <ReadCell label="Programas" value={String(totalProgramasEixo(eixo))} />
                    <ReadCell label="Valor investido" value={formatCurrency(eixo.valorInvestido)} />
                    <ReadCell label="Participação" value={formatPercent(percentualInvestido)} />
                  </div>
                  <div style={{ height: '10px', backgroundColor: T.bgSurfaceMuted, borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${larguraBarra}%`, height: '100%', backgroundColor: T.accent, borderRadius: '999px' }} />
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '24px', paddingTop: '22px', borderTop: `1px solid ${T.borderSubtle}` }}>
            <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 14px' }}>
              Programas associados ao eixo
            </h3>
            {selectedEixoDashboard ? (
              selectedEixoDashboard.programasAssociados && selectedEixoDashboard.programasAssociados.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedEixoDashboard.programasAssociados.map(programa => (
                    (() => {
                      const status = statusProgramaAssociado(programa.estado);
                      return (
                        <div
                          key={programa.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.7fr 0.9fr 0.8fr',
                            gap: '16px',
                            alignItems: 'center',
                            padding: '14px 16px',
                            backgroundColor: T.bgSurfaceMuted,
                            border: `1px solid ${T.borderSubtle}`,
                            borderRadius: '8px',
                          }}
                        >
                          <ReadCell label="Programa" value={programa.nome.replace(/^Programa de\s+/i, '').replace(/^Programa\s+/i, '')} strong />
                          <ReadCell label="Valor investido" value={formatCurrency(programa.valorInvestido)} />
                          <div>
                            <div style={S.cellLabel}>Status</div>
                            <StatusBadge label={status} color={statusProgramaColor(status)} />
                          </div>
                        </div>
                      );
                    })()
                  ))}
                </div>
              ) : (
                <EmptyMessage text="Este eixo ainda não possui programas associados." />
              )
            ) : (
              <EmptyMessage text="Clique em um eixo estratégico para visualizar os programas associados." />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC<{ title: string; subtitle: string; action?: React.ReactNode; onBack: () => void; breadcrumbParent?: string; breadcrumbTitle?: string; onBreadcrumbParentClick?: () => void; hideDivider?: boolean }> = ({ title, subtitle, action, onBack, breadcrumbParent, breadcrumbTitle, onBreadcrumbParentClick, hideDivider }) => (
  <ConfiguracoesPageHeader title={title} subtitle={subtitle} icon={Target} onBack={onBack} action={action} breadcrumbParent={breadcrumbParent} breadcrumbTitle={breadcrumbTitle} onBreadcrumbParentClick={onBreadcrumbParentClick} hideDivider={hideDivider} />
);

const SystemDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onOpen: () => void;
  onChange: (value: string) => void;
}> = ({ label, value, options, isOpen, onOpen, onChange }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);

  return (
    <div style={{ position: 'relative' }}>
      <label style={S.label}>{label}</label>
      <button
        type="button"
        onClick={onOpen}
        style={{
          ...S.input,
          minHeight: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          cursor: 'pointer',
          textAlign: 'left',
          border: `1px solid ${isOpen ? T.accent : T.borderDefault}`,
        }}
      >
        <span>{value}</span>
        <ChevronDown size={16} style={{ color: T.iconSubdued, flexShrink: 0 }} />
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 30,
            backgroundColor: '#171717',
            border: `1px solid ${T.borderDefault}`,
            borderRadius: 'var(--radius)',
            boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
            overflow: 'hidden',
          }}
        >
          {options.map(option => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                style={{
                  width: '100%',
                  minHeight: '42px',
                  padding: '10px 12px',
                  border: 'none',
                  backgroundColor: selected ? 'rgba(0,193,175,0.12)' : '#171717',
                  color: selected ? T.accent : T.textPrimary,
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onMouseEnter={event => {
                  event.currentTarget.style.backgroundColor = selected ? 'rgba(0,193,175,0.16)' : 'rgba(38,38,38,0.95)';
                }}
                onMouseLeave={event => {
                  event.currentTarget.style.backgroundColor = selected ? 'rgba(0,193,175,0.12)' : '#171717';
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <label>
      <span style={S.label}>{label}</span>
      {children}
    </label>
  );
};

const ReadValue: React.FC<{ value: string }> = ({ value }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={{ ...S.input, minHeight: '42px', backgroundColor: T.bgSurfaceMuted, color: T.textPrimary }}>
      {value}
    </div>
  );
};

const SmallButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; muted?: boolean; filled?: boolean }> = ({ icon, label, onClick, muted, filled }) => {
  const { T } = useThemeTokens();
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minHeight: '38px',
        padding: '9px 13px',
        borderRadius: 'var(--radius)',
        border: muted ? `1px solid ${T.borderDefault}` : filled ? 'none' : `1px solid ${T.accent}`,
        backgroundColor: muted ? T.bgSurfaceMuted : filled ? T.accent : T.accentSoft,
        color: muted ? T.textSecondary : filled ? T.accentText : T.accent,
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </button>
  );
};

const IconButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; muted?: boolean; danger?: boolean }> = ({ icon, label, onClick, muted, danger }) => {
  const { T } = useThemeTokens();
  const color = danger ? T.danger : muted ? T.textSecondary : T.accent;
  const borderColor = danger ? 'rgba(239,68,68,0.25)' : muted ? T.borderDefault : T.accent;
  const backgroundColor = danger ? T.dangerSoft : muted ? T.bgSurfaceMuted : T.accentSoft;

  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: `1px solid ${borderColor}`,
        backgroundColor,
        color,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {icon}
    </button>
  );
};

const ReadCell: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={{ minWidth: 0 }}>
      <div style={S.cellLabel}>{label}</div>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: strong ? T.textPrimary : T.textSecondary, fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </p>
    </div>
  );
};

const EmptyMessage: React.FC<{ text: string }> = ({ text }) => {
  const { T } = useThemeTokens();
  return (
    <div style={{ padding: '18px', borderRadius: '8px', border: `1px dashed ${T.borderDefault}`, backgroundColor: T.bgSurfaceMuted }}>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textMuted, margin: 0 }}>
        {text}
      </p>
    </div>
  );
};

const StatusBadge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', backgroundColor: `${color}1f`, color, border: `1px solid ${color}55`, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
    {label}
  </span>
);
