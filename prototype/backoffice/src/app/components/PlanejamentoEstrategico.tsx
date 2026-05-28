import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle, ChevronRight, DollarSign, Edit3, Flag, Plus, Save, Search, Target, Trash2, X } from 'lucide-react';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

type EstadoPlano = 'Ativo' | 'Em elaboração' | 'Encerrado';

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
  if (estado === 'Em elaboração') return '#f59e0b';
  return '#a3a3a3';
};

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
          { id: 1, nome: 'Programa de Pesquisa Aplicada', estado: 'Vigente', valorInvestido: 2900000 },
          { id: 2, nome: 'Programa de Inovação Aberta', estado: 'Vigente', valorInvestido: 2100000 },
          { id: 3, nome: 'Programa de Laboratórios Estratégicos', estado: 'Em elaboração', valorInvestido: 1800000 },
          { id: 4, nome: 'Programa de Transferência Tecnológica', estado: 'Vigente', valorInvestido: 1600000 },
        ],
      },
      {
        id: 2,
        nome: 'Desenvolvimento regional sustentável',
        descricao: 'Ações orientadas ao desenvolvimento territorial, social, ambiental e econômico.',
        programas: 3,
        valorInvestido: 5200000,
        programasAssociados: [
          { id: 5, nome: 'Programa Territórios Sustentáveis', estado: 'Vigente', valorInvestido: 2200000 },
          { id: 6, nome: 'Programa Economia Verde', estado: 'Vigente', valorInvestido: 1700000 },
          { id: 7, nome: 'Programa Cidades Resilientes', estado: 'Suspenso', valorInvestido: 1300000 },
        ],
      },
      {
        id: 3,
        nome: 'Formação de pesquisadores',
        descricao: 'Apoio à formação, atração e fixação de talentos científicos.',
        programas: 5,
        valorInvestido: 7300000,
        programasAssociados: [
          { id: 8, nome: 'Programa de Bolsas de Mestrado', estado: 'Vigente', valorInvestido: 1800000 },
          { id: 9, nome: 'Programa de Bolsas de Doutorado', estado: 'Vigente', valorInvestido: 2200000 },
          { id: 10, nome: 'Programa Pesquisador Visitante', estado: 'Vigente', valorInvestido: 950000 },
          { id: 11, nome: 'Programa Jovens Cientistas', estado: 'Em elaboração', valorInvestido: 1150000 },
          { id: 12, nome: 'Programa Fixação de Talentos', estado: 'Vigente', valorInvestido: 1200000 },
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
    estado: 'Encerrado',
    eixos: [
      {
        id: 1,
        nome: 'Pesquisa científica',
        descricao: 'Ampliação da base científica e tecnológica do estado.',
        programas: 6,
        valorInvestido: 6900000,
        programasAssociados: [
          { id: 13, nome: 'Programa Universal de Pesquisa', estado: 'Encerrado', valorInvestido: 1800000 },
          { id: 14, nome: 'Programa Primeiros Projetos', estado: 'Encerrado', valorInvestido: 900000 },
          { id: 15, nome: 'Programa Núcleos Emergentes', estado: 'Encerrado', valorInvestido: 1200000 },
          { id: 16, nome: 'Programa Infraestrutura de Pesquisa', estado: 'Encerrado', valorInvestido: 1400000 },
          { id: 17, nome: 'Programa Cooperação Científica', estado: 'Encerrado', valorInvestido: 850000 },
          { id: 18, nome: 'Programa Redes Temáticas', estado: 'Encerrado', valorInvestido: 750000 },
        ],
      },
      {
        id: 2,
        nome: 'Inovação e empreendedorismo',
        descricao: 'Apoio à inovação em ambientes produtivos e institucionais.',
        programas: 3,
        valorInvestido: 3600000,
        programasAssociados: [
          { id: 19, nome: 'Programa Centelha', estado: 'Encerrado', valorInvestido: 1400000 },
          { id: 20, nome: 'Programa Tecnova', estado: 'Encerrado', valorInvestido: 1600000 },
          { id: 21, nome: 'Programa Ambientes de Inovação', estado: 'Encerrado', valorInvestido: 600000 },
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
    estado: 'Em elaboração',
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

export const PlanejamentoEstrategico: React.FC = () => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);

  const [planos, setPlanos] = useState<PlanoEstrategico[]>(planosIniciais);
  const [selectedPlanoId, setSelectedPlanoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<EstadoPlano | 'Todos'>('Todos');
  const [activeTab, setActiveTab] = useState<'cadastro' | 'dashboard'>('cadastro');
  const [editing, setEditing] = useState(false);
  const [draftPlano, setDraftPlano] = useState<Omit<PlanoEstrategico, 'eixos'> | null>(null);
  const [novoEixo, setNovoEixo] = useState({
    nome: '',
    descricao: '',
  });
  const [editingEixoId, setEditingEixoId] = useState<number | null>(null);
  const [selectedEixoDashboardId, setSelectedEixoDashboardId] = useState<number | null>(null);
  const [draftEixo, setDraftEixo] = useState({
    nome: '',
    descricao: '',
  });

  const selectedPlano = planos.find(plano => plano.id === selectedPlanoId) || null;
  const planoAtivo = planos.find(plano => plano.estado === 'Ativo');

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
    setNovoEixo({ nome: '', descricao: '' });
    setEditingEixoId(null);
    setSelectedEixoDashboardId(null);
    setDraftEixo({ nome: '', descricao: '' });
  };

  const criarPlano = () => {
    const novoPlano: PlanoEstrategico = {
      id: Math.max(...planos.map(plano => plano.id), 0) + 1,
      nome: 'Novo Planejamento Estratégico',
      descricao: 'Descreva as diretrizes estratégicas deste ciclo.',
      dataInicio: '',
      dataFim: '',
      estado: 'Em elaboração',
      eixos: [],
    };
    setPlanos(prev => [...prev, novoPlano]);
    setSelectedPlanoId(novoPlano.id);
    setDraftPlano(planoSemEixos(novoPlano));
    setActiveTab('cadastro');
    setEditing(true);
    setEditingEixoId(null);
    setSelectedEixoDashboardId(null);
    setDraftEixo({ nome: '', descricao: '' });
  };

  const salvarPlano = () => {
    if (!draftPlano) return;
    setPlanos(prev => prev.map(plano => {
      if (plano.id !== draftPlano.id) return plano;
      return { ...plano, ...draftPlano };
    }));
    setEditing(false);
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
          title="Planejamentos Estratégicos"
          subtitle="Gerencie os ciclos estratégicos e abra um planejamento para cadastrar seus eixos."
          action={<SmallButton icon={<Plus size={14} />} label="Novo planejamento" onClick={criarPlano} />}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <MetricCard icon={<CheckCircle size={20} />} label="Planejamento ativo" value={planoAtivo?.nome || 'Nenhum'} color="#22c55e" />
          <MetricCard icon={<Target size={20} />} label="Total de planejamentos" value={String(planos.length)} color="#38bdf8" />
          <MetricCard icon={<Flag size={20} />} label="Eixos cadastrados" value={String(planos.reduce((total, plano) => total + plano.eixos.length, 0))} color="#fbbf24" />
          <MetricCard icon={<Calendar size={20} />} label="Em elaboração" value={String(planos.filter(plano => plano.estado === 'Em elaboração').length)} color="#a855f7" />
        </div>

        <div style={{ ...S.card, marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
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
            <Field label="Estado">
              <select value={estadoFilter} onChange={(event) => setEstadoFilter(event.target.value as EstadoPlano | 'Todos')} style={S.input}>
                <option>Todos</option>
                <option>Ativo</option>
                <option>Em elaboração</option>
                <option>Encerrado</option>
              </select>
            </Field>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredPlanos.map(plano => (
            <button
              key={plano.id}
              onClick={() => openPlano(plano)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 0.8fr 1fr 40px',
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
              <div>
                <div style={S.cellLabel}>Estado</div>
                <StatusBadge label={plano.estado} color={estadoColor(plano.estado)} />
              </div>
              <ReadCell label="Vigência" value={`${plano.dataInicio || 'Pendente'} - ${plano.dataFim || 'Pendente'}`} />
              <ReadCell label="Eixos" value={String(plano.eixos.length)} />
              <ReadCell label="Programas vinculados" value={String(plano.eixos.reduce((total, eixo) => total + totalProgramasEixo(eixo), 0))} />
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

  return (
    <div style={{ padding: '32px' }}>
      <Header
        title={selectedPlano.nome}
        subtitle="Cadastro do planejamento estratégico e gestão dos eixos associados."
        action={editing ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <SmallButton icon={<X size={14} />} label="Cancelar" onClick={() => { setDraftPlano(planoSemEixos(selectedPlano)); setEditing(false); }} muted />
            <SmallButton icon={<Save size={14} />} label="Salvar" onClick={salvarPlano} />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <SmallButton icon={<X size={14} />} label="Voltar" onClick={() => setSelectedPlanoId(null)} muted />
            <SmallButton icon={<Edit3 size={14} />} label="Editar plano" onClick={() => setEditing(true)} />
          </div>
        )}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <MetricCard icon={<CheckCircle size={20} />} label="Estado" value={selectedPlano.estado} color={estadoColor(selectedPlano.estado)} />
        <MetricCard icon={<Calendar size={20} />} label="Vigência" value={`${selectedPlano.dataInicio || 'Pendente'} - ${selectedPlano.dataFim || 'Pendente'}`} color="#38bdf8" />
        <MetricCard icon={<Flag size={20} />} label="Eixos" value={String(selectedPlano.eixos.length)} color="#fbbf24" />
        <MetricCard icon={<DollarSign size={20} />} label="Valor investido" value={formatCurrency(totalInvestido)} color="#a855f7" />
      </div>

      <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${T.borderSubtle}`, marginBottom: '24px' }}>
        {[
          { id: 'cadastro', label: 'Cadastro' },
          { id: 'dashboard', label: 'Dashboard' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${T.accent}` : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === tab.id ? T.accent : T.textSecondary, cursor: 'pointer', marginBottom: '-1px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'cadastro' && (
        <>
          <div style={{ ...S.card, marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 20px' }}>
              Cadastro do plano
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <Field label="Nome">
                {editing ? (
                  <input value={currentDraft.nome} onChange={(event) => setDraftPlano(prev => prev ? { ...prev, nome: event.target.value } : prev)} style={S.input} />
                ) : (
                  <ReadValue value={selectedPlano.nome} />
                )}
              </Field>
              <Field label="Início">
                {editing ? (
                  <input value={currentDraft.dataInicio} onChange={(event) => setDraftPlano(prev => prev ? { ...prev, dataInicio: event.target.value } : prev)} style={S.input} />
                ) : (
                  <ReadValue value={selectedPlano.dataInicio || 'Pendente'} />
                )}
              </Field>
              <Field label="Fim">
                {editing ? (
                  <input value={currentDraft.dataFim} onChange={(event) => setDraftPlano(prev => prev ? { ...prev, dataFim: event.target.value } : prev)} style={S.input} />
                ) : (
                  <ReadValue value={selectedPlano.dataFim || 'Pendente'} />
                )}
              </Field>
              <Field label="Estado">
                {editing ? (
                  <select value={currentDraft.estado} onChange={(event) => setDraftPlano(prev => prev ? { ...prev, estado: event.target.value as EstadoPlano } : prev)} style={S.input}>
                    <option>Ativo</option>
                    <option>Em elaboração</option>
                    <option>Encerrado</option>
                  </select>
                ) : (
                  <ReadValue value={selectedPlano.estado} />
                )}
              </Field>
            </div>

            <Field label="Descrição">
              {editing ? (
                <textarea value={currentDraft.descricao} onChange={(event) => setDraftPlano(prev => prev ? { ...prev, descricao: event.target.value } : prev)} rows={4} style={{ ...S.input, resize: 'vertical' }} />
              ) : (
                <ReadValue value={selectedPlano.descricao} />
              )}
            </Field>
          </div>

          <div style={{ ...S.card, marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 20px' }}>
              Novo eixo estratégico
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr auto', gap: '16px', alignItems: 'end' }}>
              <Field label="Nome do eixo">
                <input value={novoEixo.nome} onChange={(event) => setNovoEixo(prev => ({ ...prev, nome: event.target.value }))} placeholder="Ex.: Saúde e bem-estar" style={S.input} />
              </Field>
              <Field label="Descrição">
                <input value={novoEixo.descricao} onChange={(event) => setNovoEixo(prev => ({ ...prev, descricao: event.target.value }))} placeholder="Orientação estratégica do eixo" style={S.input} />
              </Field>
              <SmallButton icon={<Plus size={14} />} label="Adicionar" onClick={adicionarEixo} />
            </div>
          </div>

          <div style={S.card}>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 20px' }}>
              Eixos estratégicos cadastrados
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedPlano.eixos.map(eixo => {
                const isEditingEixo = editingEixoId === eixo.id;
                return (
                  <div
                    key={eixo.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 0.55fr 0.9fr 1.8fr auto',
                      gap: '16px',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: T.bgSurfaceMuted,
                      border: `1px solid ${T.borderSubtle}`,
                      borderRadius: '8px',
                    }}
                  >
                    <Field label="Eixo">
                      {isEditingEixo ? (
                        <input value={draftEixo.nome} onChange={(event) => setDraftEixo(prev => ({ ...prev, nome: event.target.value }))} style={S.input} />
                      ) : (
                        <ReadValue value={eixo.nome} />
                      )}
                    </Field>
                    <ReadCell label="Programas" value={String(totalProgramasEixo(eixo))} />
                    <ReadCell label="Valor investido" value={formatCurrency(eixo.valorInvestido)} />
                    <Field label="Descrição">
                      {isEditingEixo ? (
                        <input value={draftEixo.descricao} onChange={(event) => setDraftEixo(prev => ({ ...prev, descricao: event.target.value }))} style={S.input} />
                      ) : (
                        <ReadValue value={eixo.descricao} />
                      )}
                    </Field>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      {isEditingEixo ? (
                        <>
                          <IconButton icon={<X size={15} />} label="Cancelar edição" onClick={cancelarEdicaoEixo} muted />
                          <IconButton icon={<Save size={15} />} label="Salvar eixo" onClick={salvarEdicaoEixo} />
                        </>
                      ) : (
                        <>
                          <IconButton icon={<Edit3 size={15} />} label="Editar eixo" onClick={() => iniciarEdicaoEixo(eixo)} />
                          <IconButton icon={<Trash2 size={15} />} label="Remover eixo" onClick={() => removerEixo(eixo.id)} danger />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
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
                    <div
                      key={programa.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.7fr 0.8fr 0.9fr',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '14px 16px',
                        backgroundColor: T.bgSurfaceMuted,
                        border: `1px solid ${T.borderSubtle}`,
                        borderRadius: '8px',
                      }}
                    >
                      <ReadCell label="Programa" value={programa.nome} strong />
                      <ReadCell label="Estado" value={programa.estado} />
                      <ReadCell label="Valor investido" value={formatCurrency(programa.valorInvestido)} />
                    </div>
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

const Header: React.FC<{ title: string; subtitle: string; action: React.ReactNode }> = ({ title, subtitle, action }) => {
  const { T } = useThemeTokens();
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: T.accentSoft, borderRadius: 'var(--radius)' }}>
          <Target size={22} style={{ color: T.accent }} />
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: T.textPrimary, margin: '0 0 8px' }}>
            {title}
          </h1>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
            {subtitle}
          </p>
        </div>
      </div>
      {action}
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

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={S.card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: `${color}1f`, borderRadius: 'var(--radius)', color }}>
          {icon}
        </div>
        <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
          {label}
        </p>
      </div>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: T.textPrimary, margin: 0, textAlign: 'center', lineHeight: 1.35 }}>
        {value}
      </p>
    </div>
  );
};

const SmallButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; muted?: boolean }> = ({ icon, label, onClick, muted }) => {
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
        border: muted ? `1px solid ${T.borderDefault}` : `1px solid ${T.accent}`,
        backgroundColor: muted ? T.bgSurfaceMuted : T.accentSoft,
        color: muted ? T.textSecondary : T.accent,
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
