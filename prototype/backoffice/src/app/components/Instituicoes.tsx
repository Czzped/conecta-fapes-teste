import React, { useMemo, useState } from 'react';
import { ArrowLeft, Building2, ChevronDown, ChevronRight, Plus, Save, Search, Trash2 } from 'lucide-react';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

type NaturezaJuridica = 'Publica' | 'Privada';
type SituacaoInstituicao = 'Ativa' | 'Inativa';
type ActiveTab = 'listagem' | 'dashboard';

interface InstituicaoItem {
  id: number;
  nome: string;
  sigla: string;
  cnpj: string;
  razaoSocial: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  natureza: NaturezaJuridica;
  municipio: string;
  uf: string;
  responsavel: string;
  dataInicioMandato: string;
  dataFimMandato: string;
  superior?: string;
  situacao: SituacaoInstituicao;
}

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

const onlyDigits = (s: string) => (s || '').replace(/\D/g, '');
const maskCep = (s: string) => {
  const d = onlyDigits(s).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

async function fetchViaCep(cep: string): Promise<ViaCepResponse | null> {
  const d = onlyDigits(cep);
  if (d.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    if (!res.ok) return null;
    const data: ViaCepResponse = await res.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}

type ModoSubestrutura = 'EXISTENTE' | 'NOVA';

interface SubestruturaDraft {
  id: number;
  modo: ModoSubestrutura;
  vinculadaId: number | null;
  nome: string;
  sigla: string;
  cnpj: string;
}

const buildStyles = (T: ThemeTokens) => ({
  input: {
    width: '100%',
    backgroundColor: T.bgInput,
    border: `1px solid ${T.borderDefault}`,
    borderRadius: '6px',
    padding: '10px 12px',
    color: T.textPrimary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    marginBottom: '8px',
  } as React.CSSProperties,
  card: {
    backgroundColor: T.bgCard,
    border: `1px solid ${T.borderSubtle}`,
    borderRadius: '10px',
    padding: '20px',
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textPrimary,
    fontWeight: 'var(--font-weight-medium)',
    margin: '0 0 6px',
  } as React.CSSProperties,
  sectionSubtitle: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    margin: 0,
  } as React.CSSProperties,
});

const statusColor = (situacao: SituacaoInstituicao) => situacao === 'Ativa' ? '#22c55e' : '#a3a3a3';

const formatCurrency = (value: number) => (
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);

const formatPercent = (value: number) => (
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
);

const maskCnpj = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const emptyInstituicao: InstituicaoItem = {
  id: 0,
  nome: '',
  sigla: '',
  cnpj: '',
  razaoSocial: '',
  email: '',
  telefone: '',
  cep: '',
  endereco: '',
  bairro: '',
  natureza: 'Publica',
  municipio: '',
  uf: 'ES',
  responsavel: '',
  dataInicioMandato: '',
  dataFimMandato: '',
  superior: '',
  situacao: 'Ativa',
};

const initialInstituicoes: InstituicaoItem[] = [
  { id: 1, nome: 'Universidade Federal do Espírito Santo', sigla: 'UFES', cnpj: '32.479.123/0001-43', razaoSocial: 'Universidade Federal do Espírito Santo', email: 'gabinete@ufes.br', telefone: '(27) 4009-2000', endereco: 'Av. Fernando Ferrari, 514 - Goiabeiras', natureza: 'Publica', municipio: 'Vitória', uf: 'ES', responsavel: 'Prof. Paulo Vargas', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', situacao: 'Ativa' },
  { id: 2, nome: 'Centro Tecnológico da UFES', sigla: 'CT-UFES', cnpj: '', razaoSocial: '', email: 'ct@ufes.br', telefone: '(27) 4009-2600', endereco: 'Campus Goiabeiras', natureza: 'Publica', municipio: 'Vitória', uf: 'ES', responsavel: 'Prof. Ana Ribeiro', dataInicioMandato: '2023-03-01', dataFimMandato: '2027-02-28', superior: 'Universidade Federal do Espírito Santo', situacao: 'Ativa' },
  { id: 3, nome: 'Instituto Federal do Espírito Santo', sigla: 'IFES', cnpj: '10.838.653/0001-06', razaoSocial: 'Instituto Federal de Educação, Ciência e Tecnologia do Espírito Santo', email: 'reitoria@ifes.edu.br', telefone: '(27) 3357-7500', endereco: 'Av. Rio Branco, 50 - Santa Lúcia', natureza: 'Publica', municipio: 'Vitória', uf: 'ES', responsavel: 'Jadir Pela', dataInicioMandato: '2021-10-01', dataFimMandato: '2025-09-30', situacao: 'Ativa' },
  { id: 4, nome: 'IFES Campus Serra', sigla: 'IFES Serra', cnpj: '10.838.653/0010-99', razaoSocial: 'Instituto Federal do Espírito Santo - Campus Serra', email: 'campus.serra@ifes.edu.br', telefone: '(27) 3348-9200', endereco: 'Rodovia ES-010, Km 6,5 - Manguinhos', natureza: 'Publica', municipio: 'Serra', uf: 'ES', responsavel: 'Marta Souza', dataInicioMandato: '2022-01-01', dataFimMandato: '2026-12-31', superior: 'Instituto Federal do Espírito Santo', situacao: 'Ativa' },
  { id: 5, nome: 'Fucape Business School', sigla: 'FUCAPE', cnpj: '03.389.451/0001-66', razaoSocial: 'Fundação Instituto Capixaba de Pesquisas em Contabilidade, Economia e Finanças', email: 'contato@fucape.br', telefone: '(27) 4009-4444', endereco: 'Av. Fernando Ferrari, 1358 - Boa Vista', natureza: 'Privada', municipio: 'Vitória', uf: 'ES', responsavel: 'Valcemiro Nossa', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', situacao: 'Ativa' },
  { id: 6, nome: 'Departamento de Pesquisa Aplicada', sigla: 'DPA', cnpj: '', razaoSocial: '', email: 'pesquisa@fucape.br', telefone: '(27) 4009-4450', endereco: 'Sede Fucape', natureza: 'Privada', municipio: 'Vitória', uf: 'ES', responsavel: 'Carla Mendes', dataInicioMandato: '2024-02-01', dataFimMandato: '2026-01-31', superior: 'Fucape Business School', situacao: 'Inativa' },
];

const instituicoesParceiras = [
  { nome: 'MIT', totalInvestido: 8900000 },
  { nome: 'USP', totalInvestido: 4500000 },
  { nome: 'Ifes', totalInvestido: 3800000 },
  { nome: 'Findes', totalInvestido: 3200000 },
  { nome: 'Sesa', totalInvestido: 2850000 },
  { nome: 'Ufes', totalInvestido: 2500000 },
  { nome: 'Secti', totalInvestido: 2100000 },
  { nome: 'UVV', totalInvestido: 1950000 },
  { nome: 'IJSN', totalInvestido: 1650000 },
  { nome: 'UFMG', totalInvestido: 1200000 },
];

const getClassificacao = (item: Pick<InstituicaoItem, 'cnpj' | 'superior'>) => {
  if (!item.cnpj) return 'Setor sem CNPJ';
  return item.superior ? 'Unidade com CNPJ' : 'Instituição raiz';
};

export const Instituicoes: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);

  const [activeTab, setActiveTab] = useState<ActiveTab>('listagem');
  const [searchTerm, setSearchTerm] = useState('');
  const [naturezaFilter, setNaturezaFilter] = useState<'Todos' | NaturezaJuridica>('Todos');
  const [showNaturezaDropdown, setShowNaturezaDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<InstituicaoItem | null>(null);
  const [draft, setDraft] = useState<InstituicaoItem>(emptyInstituicao);
  const [draftFiliais, setDraftFiliais] = useState<SubestruturaDraft[]>([]);
  const [draftUnidades, setDraftUnidades] = useState<SubestruturaDraft[]>([]);
  const [instituicoes, setInstituicoes] = useState<InstituicaoItem[]>(initialInstituicoes);

  const filtered = instituicoes.filter(item => {
    const query = searchTerm.toLowerCase();
    const matchSearch =
      item.nome.toLowerCase().includes(query) ||
      item.sigla.toLowerCase().includes(query) ||
      item.razaoSocial.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.cnpj.toLowerCase().includes(query);
    const matchNatureza = naturezaFilter === 'Todos' || item.natureza === naturezaFilter;
    return matchSearch && matchNatureza;
  });

  const totalPublicas = instituicoes.filter(item => item.natureza === 'Publica').length;
  const totalPrivadas = instituicoes.filter(item => item.natureza === 'Privada').length;
  const totalComCnpj = instituicoes.filter(item => item.cnpj).length;
  const totalSemCnpj = instituicoes.filter(item => !item.cnpj).length;
  const instituicoesRaiz = instituicoes.filter(item => !item.superior).length;
  const totalInvestidoParceiras = instituicoesParceiras.reduce((total, instituicao) => total + instituicao.totalInvestido, 0);
  const estruturasPorTipo = useMemo(() => ([
    { nome: 'Instituições raiz', valor: instituicoes.filter(item => item.cnpj && !item.superior).length, color: '#38bdf8' },
    { nome: 'Unidades com CNPJ', valor: instituicoes.filter(item => item.cnpj && item.superior).length, color: '#22c55e' },
    { nome: 'Setores sem CNPJ', valor: instituicoes.filter(item => !item.cnpj).length, color: '#f59e0b' },
  ]), [instituicoes]);

  const openNew = () => {
    setDraft({ ...emptyInstituicao, id: Date.now() });
    setDraftFiliais([]);
    setDraftUnidades([]);
    setShowForm(true);
    setSelected(null);
  };

  const openDetails = (item: InstituicaoItem) => {
    setDraft({ ...item });
    const subs = instituicoes.filter(instituicao => instituicao.superior === item.nome);
    setDraftFiliais(
      subs
        .filter(s => !!s.cnpj)
        .map(s => ({ id: s.id, modo: 'EXISTENTE' as ModoSubestrutura, vinculadaId: s.id, nome: s.nome, sigla: s.sigla, cnpj: s.cnpj }))
    );
    setDraftUnidades(
      subs
        .filter(s => !s.cnpj)
        .map(s => ({ id: s.id, modo: 'EXISTENTE' as ModoSubestrutura, vinculadaId: s.id, nome: s.nome, sigla: s.sigla, cnpj: s.cnpj }))
    );
    setSelected(item);
    setShowForm(false);
  };

  const updateDraft = (field: keyof InstituicaoItem, value: string | boolean) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const makeSetter = (setState: React.Dispatch<React.SetStateAction<SubestruturaDraft[]>>) => ({
    add: () => setState(prev => [
      ...prev,
      { id: Date.now() + prev.length, modo: 'EXISTENTE', vinculadaId: null, nome: '', sigla: '', cnpj: '' },
    ]),
    update: (id: number, field: keyof SubestruturaDraft, value: string | number | null) =>
      setState(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item)),
    setModo: (id: number, modo: ModoSubestrutura) =>
      setState(prev => prev.map(item => item.id === id ? { ...item, modo, vinculadaId: null, nome: '', sigla: '', cnpj: '' } : item)),
    vincular: (id: number, instituicaoId: number) => {
      const inst = instituicoes.find(i => i.id === instituicaoId);
      if (!inst) return;
      setState(prev => prev.map(item => item.id === id
        ? { ...item, vinculadaId: instituicaoId, nome: inst.nome, sigla: inst.sigla, cnpj: inst.cnpj }
        : item));
    },
    remove: (id: number) => setState(prev => prev.filter(item => item.id !== id)),
  });

  const filiaisOps = makeSetter(setDraftFiliais);
  const unidadesOps = makeSetter(setDraftUnidades);

  const saveDraft = () => {
    const isSetorSemCnpj = !draft.cnpj;
    const saved = { ...draft, razaoSocial: isSetorSemCnpj ? '' : draft.razaoSocial };
    const previousParentName = selected?.nome || saved.nome;
    const draftSubestruturas = [...draftFiliais, ...draftUnidades];
    const subestruturas: InstituicaoItem[] = draftSubestruturas
      .filter(item => item.modo === 'NOVA' && item.nome.trim())
      .map(item => ({
        ...emptyInstituicao,
        id: item.id,
        nome: item.nome.trim(),
        sigla: item.sigla.trim(),
        cnpj: item.cnpj,
        natureza: saved.natureza,
        municipio: saved.municipio,
        uf: saved.uf,
        superior: saved.nome,
        situacao: 'Ativa',
      }));

    setInstituicoes(prev => {
      const remaining = prev.filter(item => item.id !== saved.id && item.superior !== previousParentName);
      return [...remaining, saved, ...subestruturas];
    });
    setShowForm(false);
    setSelected(saved);
  };

  const removeDraft = () => {
    if (!selected) return;
    setInstituicoes(prev => prev.filter(item => item.id !== selected.id));
    setSelected(null);
    setShowForm(false);
  };

  if (showForm || selected) {
    const isSetorSemCnpj = !draft.cnpj;
    const isSituacaoAtiva = draft.situacao === 'Ativa';
    const superiorOptions = [
      '',
      ...instituicoes
        .filter(item => item.id !== draft.id)
        .map(item => (item.cnpj ? `${item.nome} — CNPJ ${item.cnpj}` : `${item.nome} — sem CNPJ`)),
    ];

    const renderSubestruturaBlock = (cfg: {
      T: ThemeTokens;
      titulo: string;
      subtitulo: string;
      draftItens: SubestruturaDraft[];
      ops: ReturnType<typeof makeSetter>;
      opcoesExistentes: InstituicaoItem[];
      labelExistente: string;
      labelNova: { nome: string; sigla: string; cnpj: string };
      cnpjObrigatorio: boolean;
      vazio: string;
    }) => (
      <div style={{ borderTop: `1px solid ${cfg.T.borderSubtle}`, paddingTop: '18px', marginTop: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: cfg.T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 4px' }}>{cfg.titulo}</h3>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: cfg.T.textMuted, margin: 0 }}>{cfg.subtitulo}</p>
          </div>
          <button
            type="button"
            onClick={cfg.ops.add}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: cfg.T.accentSoft, border: `1px solid ${cfg.T.accent}`, borderRadius: 'var(--radius)', padding: '8px 12px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: cfg.T.accent, cursor: 'pointer', flexShrink: 0 }}
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>
        {cfg.draftItens.length === 0 ? (
          <div style={{ border: `1px dashed ${cfg.T.borderDefault}`, borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: cfg.T.textMuted }}>
            {cfg.vazio}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cfg.draftItens.map(item => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '14px', border: `1px solid ${cfg.T.borderSubtle}`, borderRadius: '8px', backgroundColor: cfg.T.bgSurfaceMuted }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', padding: '3px', backgroundColor: cfg.T.bgPage, border: `1px solid ${cfg.T.borderSubtle}`, borderRadius: 'var(--radius)' }}>
                    <button
                      type="button"
                      onClick={() => cfg.ops.setModo(item.id, 'EXISTENTE')}
                      style={{ padding: '6px 12px', border: 'none', borderRadius: 'calc(var(--radius) - 2px)', backgroundColor: item.modo === 'EXISTENTE' ? cfg.T.accentSoft : 'transparent', color: item.modo === 'EXISTENTE' ? cfg.T.accent : cfg.T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' as any, cursor: 'pointer' }}
                    >
                      Vincular existente
                    </button>
                    <button
                      type="button"
                      onClick={() => cfg.ops.setModo(item.id, 'NOVA')}
                      style={{ padding: '6px 12px', border: 'none', borderRadius: 'calc(var(--radius) - 2px)', backgroundColor: item.modo === 'NOVA' ? cfg.T.accentSoft : 'transparent', color: item.modo === 'NOVA' ? cfg.T.accent : cfg.T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' as any, cursor: 'pointer' }}
                    >
                      Cadastrar nova
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => cfg.ops.remove(item.id)}
                    style={{ width: '34px', height: '34px', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 'var(--radius)', backgroundColor: 'transparent', color: cfg.T.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    aria-label="Remover"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                {item.modo === 'EXISTENTE' ? (
                  <div>
                    <label style={{ ...buildStyles(cfg.T).label, display: 'block' }}>{cfg.labelExistente}</label>
                    <select
                      value={item.vinculadaId ?? ''}
                      onChange={e => {
                        const id = parseInt(e.target.value, 10);
                        if (Number.isFinite(id)) cfg.ops.vincular(item.id, id);
                        else cfg.ops.update(item.id, 'vinculadaId', null);
                      }}
                      style={{ ...buildStyles(cfg.T).input }}
                    >
                      <option value="">Buscar...</option>
                      {cfg.opcoesExistentes.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.cnpj ? `${opt.nome} — CNPJ ${opt.cnpj}` : `${opt.nome} — sem CNPJ`}
                        </option>
                      ))}
                    </select>
                    {item.vinculadaId && (
                      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: cfg.T.textMuted, margin: '6px 0 0' }}>
                        Vinculada: {item.nome} {item.cnpj && `· CNPJ ${item.cnpj}`}
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: cfg.labelNova.cnpj ? '1.2fr 0.5fr 0.7fr' : '1.5fr 0.5fr', gap: '12px' }}>
                    <Field label={cfg.labelNova.nome} value={item.nome} onChange={value => cfg.ops.update(item.id, 'nome', value)} placeholder="Nome" />
                    <Field label={cfg.labelNova.sigla} value={item.sigla} onChange={value => cfg.ops.update(item.id, 'sigla', value)} placeholder="Sigla" />
                    {cfg.labelNova.cnpj && (
                      <Field label={cfg.cnpjObrigatorio ? `${cfg.labelNova.cnpj} (obrigatorio)` : cfg.labelNova.cnpj} value={item.cnpj} onChange={value => cfg.ops.update(item.id, 'cnpj', maskCnpj(value))} placeholder={cfg.cnpjObrigatorio ? '00.000.000/0000-00' : 'Opcional'} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );

    // Mock — em producao vira de GET /api/v1/m008/responsaveis?instituicaoId={id}&estado=encerrado
    const historicoDoSelecionado: { pessoa: string; papel: string; dataInicio: string; dataFim: string; motivo: string }[] = !showForm && selected
      ? [
          { pessoa: 'Prof. Joao Silva',  papel: 'Reitor',     dataInicio: '2020-01-01', dataFim: '2023-12-31', motivo: 'Fim de mandato' },
          { pessoa: 'Prof. Pedro Lima',  papel: 'Reitor Pro Tempore', dataInicio: '2017-01-01', dataFim: '2019-12-31', motivo: 'Fim de mandato' },
          { pessoa: 'Profa. Carla Mendes', papel: 'Reitora', dataInicio: '2013-01-01', dataFim: '2016-12-31', motivo: 'Fim de mandato' },
        ]
      : [];

    return (
      <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
        <div className="pt-8 px-8 pb-8">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px' }}>
            <button
              onClick={() => { setShowForm(false); setSelected(null); }}
              style={{ width: '36px', height: '36px', border: 'none', borderRadius: 'var(--radius)', backgroundColor: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowLeft size={18} style={{ color: T.accent }} />
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 8px' }}>
                {showForm ? 'Nova Instituição' : draft.nome}
              </h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
                Cadastre instituições, unidades com CNPJ e setores sem CNPJ na mesma estrutura organizacional.
              </p>
            </div>
            {selected && (
              <button
                type="button"
                onClick={openNew}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: T.accentSoft, border: `1px solid ${T.accent}`, borderRadius: 'var(--radius)', padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.accent, cursor: 'pointer' }}
              >
                <Plus size={15} />
                Nova Instituição
              </button>
            )}
          </div>

          <FormSection number="1" title="Identificação" subtitle="Dados básicos da instituição (nome, CNPJ, natureza) + dados institucionais de contato (email, telefone, endereço da entidade jurídica). Não confundir com email/telefone do Responsável (PessoaFísica).">
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '16px', marginBottom: '16px' }}>
              <Field label="Nome" value={draft.nome} onChange={value => updateDraft('nome', value)} placeholder="Nome da instituição ou unidade" />
              <Field label="Sigla" value={draft.sigla} onChange={value => updateDraft('sigla', value)} placeholder="Sigla" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px', marginBottom: '16px' }}>
              <Field label={isSetorSemCnpj ? 'Razão social' : 'Razão social obrigatória'} value={draft.razaoSocial} onChange={value => updateDraft('razaoSocial', value)} placeholder={isSetorSemCnpj ? 'Não se aplica a setor interno' : 'Razão social da instituição'} disabled={isSetorSemCnpj} />
              <Field label="CNPJ" value={draft.cnpj} onChange={value => updateDraft('cnpj', maskCnpj(value))} placeholder="Deixe vazio para setor sem CNPJ" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
              <Select label="Natureza" value={draft.natureza} onChange={value => updateDraft('natureza', value)} options={['Publica', 'Privada']} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr', gap: '16px', marginBottom: '16px' }}>
              <Field label="Email institucional" value={draft.email} onChange={value => updateDraft('email', value)} placeholder="email@instituicao.br" />
              <Field label="Telefone" value={draft.telefone} onChange={value => updateDraft('telefone', value)} placeholder="(00) 0000-0000" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.6fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <Field
                label="CEP"
                value={draft.cep}
                onChange={value => updateDraft('cep', maskCep(value))}
                onBlur={async () => {
                  const data = await fetchViaCep(draft.cep);
                  if (data) {
                    if (data.logradouro) updateDraft('endereco', data.logradouro);
                    if (data.bairro) updateDraft('bairro', data.bairro);
                    if (data.localidade) updateDraft('municipio', data.localidade);
                    if (data.uf) updateDraft('uf', data.uf);
                  }
                }}
                placeholder="00000-000"
              />
              <Field label="Endereço" value={draft.endereco} onChange={value => updateDraft('endereco', value)} placeholder="Logradouro" />
              <Field label="Bairro" value={draft.bairro} onChange={value => updateDraft('bairro', value)} placeholder="Bairro" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.3fr', gap: '16px' }}>
              <Field label="Município" value={draft.municipio} onChange={value => updateDraft('municipio', value)} placeholder="Município" />
              <Field label="UF" value={draft.uf} onChange={value => updateDraft('uf', value.toUpperCase().slice(0, 2))} placeholder="UF" />
            </div>
          </FormSection>

          <FormSection number="2" title="Estrutura Organizacional" subtitle="Vínculo hierárquico. Instituição sem CNPJ deve possuir superior.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '20px' }}>
              <Select label="Instituição superior" value={draft.superior || ''} onChange={value => updateDraft('superior', value)} options={superiorOptions} />
            </div>

            {renderSubestruturaBlock({
              T,
              titulo: 'Filiais',
              subtitulo: 'Outras Instituições com CNPJ próprio vinculadas a esta como matriz (campus, filial, unidade jurídica).',
              draftItens: draftFiliais,
              ops: filiaisOps,
              opcoesExistentes: instituicoes.filter(i => i.id !== draft.id && !!i.cnpj),
              labelExistente: 'Selecione uma Instituição com CNPJ',
              labelNova: { nome: 'Nome da filial', sigla: 'Sigla', cnpj: 'CNPJ' },
              cnpjObrigatorio: true,
              vazio: 'Nenhuma filial vinculada.',
            })}

            {renderSubestruturaBlock({
              T,
              titulo: 'Unidades Organizacionais',
              subtitulo: 'Subdivisões internas sem CNPJ próprio (centro, departamento, coordenação, laboratório, setor).',
              draftItens: draftUnidades,
              ops: unidadesOps,
              opcoesExistentes: instituicoes.filter(i => i.id !== draft.id && !i.cnpj),
              labelExistente: 'Selecione uma Unidade Organizacional sem CNPJ',
              labelNova: { nome: 'Nome da unidade', sigla: 'Sigla', cnpj: '' },
              cnpjObrigatorio: false,
              vazio: 'Nenhuma unidade organizacional cadastrada.',
            })}
          </FormSection>

          <FormSection number="3" title="Responsável" subtitle="Responsável é o vínculo temporal entre uma Pessoa Física já cadastrada e uma Instituição, com mandato definido (RN04/RN11).">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.5fr 0.6fr 0.5fr', gap: '16px' }}>
              <Select label="Pessoa responsável" value={draft.responsavel} onChange={value => updateDraft('responsavel', value)} options={['', 'Prof. Paulo Vargas', 'Prof. Ana Ribeiro', 'Jadir Pela', 'Marta Souza', 'Valcemiro Nossa', 'Carla Mendes']} />
              <Field label="Início do mandato" value={draft.dataInicioMandato} onChange={value => updateDraft('dataInicioMandato', value)} placeholder="AAAA-MM-DD" />
              <Field
                label={isSituacaoAtiva ? 'Fim do mandato (opcional)' : 'Fim do mandato'}
                value={draft.dataFimMandato}
                onChange={value => updateDraft('dataFimMandato', value)}
                placeholder={isSituacaoAtiva ? 'Em aberto enquanto ativa' : 'AAAA-MM-DD'}
              />
              <Select label="Situação" value={draft.situacao} onChange={value => updateDraft('situacao', value)} options={['Ativa', 'Inativa']} />
            </div>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, margin: '8px 0 0' }}>
              {isSituacaoAtiva
                ? 'Mandato em curso — fim do mandato não é obrigatório enquanto a situação for Ativa.'
                : 'Mandato encerrado — preencha o fim do mandato.'}
            </p>

            <div style={{ marginTop: '24px', borderTop: `1px solid ${T.borderSubtle}`, paddingTop: '18px' }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: '0 0 4px' }}>
                  Histórico de Responsáveis
                </h3>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, margin: 0 }}>
                  Mandatos encerrados desta instituição (ordenados por mandato mais recente).
                </p>
              </div>
              {historicoDoSelecionado.length === 0 ? (
                <div style={{ border: `1px dashed ${T.borderDefault}`, borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textMuted }}>
                  Nenhum responsável anterior registrado.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {historicoDoSelecionado.map((h, idx) => (
                    <div
                      key={`${h.pessoa}-${idx}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.2fr 1.6fr 2fr',
                        gap: '12px',
                        padding: '10px 14px',
                        border: `1px solid ${T.borderSubtle}`,
                        borderRadius: '8px',
                        backgroundColor: T.bgSurfaceMuted,
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        color: T.textPrimary,
                      }}
                    >
                      <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{h.pessoa}</span>
                      <span>{h.papel}</span>
                      <span>{h.dataInicio} → {h.dataFim}</span>
                      <span style={{ color: T.textMuted }}>{h.motivo}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSection>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            {selected && (
              <button type="button" onClick={removeDraft} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 'var(--radius)', padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.danger, cursor: 'pointer' }}>
                <Trash2 size={15} />
                Remover
              </button>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flex: 1 }}>
              <button type="button" onClick={() => { setShowForm(false); setSelected(null); }} style={{ backgroundColor: 'transparent', border: `1px solid ${T.borderStrong}`, borderRadius: 'var(--radius)', padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button type="button" onClick={saveDraft} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: T.accent, border: 'none', borderRadius: 'var(--radius)', padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: T.accentText, cursor: 'pointer' }}>
                <Save size={15} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: T.accentSoft, borderRadius: 'var(--radius)' }}>
                <Building2 size={18} style={{ color: T.accent }} />
              </div>
              <div style={{ flex: 1, marginTop: '6px' }}>
                <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: T.textPrimary, lineHeight: '1.5' }}>
                  Instituições
                </h1>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0, lineHeight: '1.5' }}>
                  Gerencie instituições públicas e privadas, unidades com CNPJ e setores sem CNPJ.
                </p>
              </div>
            </div>
            <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: T.accent, border: 'none', borderRadius: 'var(--radius)', padding: '10px 18px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: T.accentText, cursor: 'pointer', flexShrink: 0 }}>
              <Plus size={16} />
              Nova Instituição
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${T.borderSubtle}`, marginBottom: '28px' }}>
          {[
            { id: 'listagem' as ActiveTab, label: 'Instituições' },
            { id: 'dashboard' as ActiveTab, label: 'Dashboard' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${T.accent}` : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === tab.id ? T.accent : T.textSecondary, cursor: 'pointer', marginBottom: '-1px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <Metric label="Total de instituições" value={String(instituicoes.length)} color={T.textPrimary} bg={T.bgChip} />
              <Metric label="Públicas" value={String(totalPublicas)} color="#38bdf8" bg="rgba(56,189,248,0.12)" />
              <Metric label="Privadas" value={String(totalPrivadas)} color="#a855f7" bg="rgba(168,85,247,0.12)" />
              <Metric label="Raiz" value={String(instituicoesRaiz)} color="#f59e0b" bg="rgba(245,158,11,0.12)" />
            </div>

            <div style={S.card}>
              <h2 style={S.sectionTitle}>Estruturas por tipo</h2>
              <p style={{ ...S.sectionSubtitle, marginBottom: '20px' }}>
                Distribuição entre instituições raiz, unidades que possuem CNPJ e setores sem CNPJ.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {estruturasPorTipo.map(item => {
                  const percentual = instituicoes.length > 0 ? (item.valor / instituicoes.length) * 100 : 0;
                  return (
                    <div key={item.nome} style={{ padding: '16px', border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 0.8fr', gap: '16px', marginBottom: '12px' }}>
                        <ListCell label="Tipo" value={item.nome} strong />
                        <ListCell label="Quantidade" value={String(item.valor)} highlight />
                        <ListCell label="Participação" value={`${percentual.toFixed(2).replace('.', ',')}%`} />
                      </div>
                      <div style={{ height: '8px', width: '100%', borderRadius: '999px', backgroundColor: T.bgChip, overflow: 'hidden' }}>
                        <div style={{ width: `${percentual}%`, height: '100%', borderRadius: '999px', backgroundColor: item.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ ...S.card, marginTop: '24px' }}>
              <h2 style={S.sectionTitle}>Identificação fiscal</h2>
              <p style={{ ...S.sectionSubtitle, marginBottom: '20px' }}>
                Controle de estruturas que possuem CNPJ próprio e estruturas internas cadastradas como setores.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Metric label="Com CNPJ" value={String(totalComCnpj)} color="#22c55e" bg="rgba(34,197,94,0.12)" />
                <Metric label="Sem CNPJ" value={String(totalSemCnpj)} color="#f59e0b" bg="rgba(245,158,11,0.12)" />
              </div>
            </div>

            <div style={{ ...S.card, marginTop: '24px' }}>
              <h2 style={S.sectionTitle}>Instituições parceiras</h2>
              <p style={{ ...S.sectionSubtitle, marginBottom: '18px' }}>
                Total investido por instituição parceira.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {instituicoesParceiras.map(instituicao => {
                  const percentualInvestido = totalInvestidoParceiras > 0 ? (instituicao.totalInvestido / totalInvestidoParceiras) * 100 : 0;
                  return (
                    <div key={instituicao.nome} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', alignItems: 'center', padding: '14px 16px', border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted }}>
                      <ListCell label="Instituição" value={instituicao.nome} strong />
                      <ListCell label="Total investido" value={formatCurrency(instituicao.totalInvestido)} detail={`${formatPercent(percentualInvestido)} do total`} highlight />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listagem' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={S.label}>Pesquisar</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Buscar" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} style={{ ...S.input, paddingRight: '36px' }} />
                  <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                </div>
              </div>
              <DropdownFilter label="Natureza" value={naturezaFilter} options={['Todos', 'Publica', 'Privada']} open={showNaturezaDropdown} setOpen={setShowNaturezaDropdown} onSelect={value => setNaturezaFilter(value as typeof naturezaFilter)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(item => (
                <button key={item.id} onClick={() => openDetails(item)} style={{ textAlign: 'left', backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '10px', padding: '18px 20px', cursor: 'pointer' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 1.2fr 1fr 0.7fr auto', gap: '18px', alignItems: 'start' }}>
                    <ListCell label="Instituição" value={`${item.sigla} · ${item.nome}`} strong />
                    <ListCell label="Natureza" value={item.natureza === 'Publica' ? 'Pública' : 'Privada'} />
                    <ListCell label="Classificação" value={getClassificacao(item)} />
                    <ListCell label="CNPJ" value={item.cnpj || 'Não possui'} detail={item.superior ? `Superior: ${item.superior}` : 'Sem superior'} />
                    <ListCell label="Responsavel" value={item.responsavel} detail={`${item.dataInicioMandato || '-'} a ${item.dataFimMandato || '-'}`} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Situação</div>
                      <span style={{ display: 'inline-block', backgroundColor: `${statusColor(item.situacao)}20`, border: `1px solid ${statusColor(item.situacao)}`, borderRadius: '999px', padding: '3px 12px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: statusColor(item.situacao) }}>
                        {item.situacao}
                      </span>
                    </div>
                    <ChevronRight size={18} style={{ color: T.iconSubdued, marginTop: '20px' }} />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; onBlur?: () => void; placeholder?: string; disabled?: boolean }> = ({ label, value, onChange, onBlur, placeholder, disabled }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div>
      <label style={S.label}>{label}</label>
      <input type="text" value={disabled ? '' : value} placeholder={placeholder} disabled={disabled} onChange={event => onChange(event.target.value)} onBlur={onBlur} style={{ ...S.input, opacity: disabled ? 0.55 : 1 }} />
    </div>
  );
};

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[]; disabled?: boolean }> = ({ label, value, onChange, options, disabled }) => {
  const { T, isLight } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div>
      <label style={S.label}>{label}</label>
      <select value={disabled ? '' : value} disabled={disabled} onChange={event => onChange(event.target.value)} style={{ ...S.input, colorScheme: isLight ? 'light' : 'dark', opacity: disabled ? 0.55 : 1 }}>
        {options.map(option => (
          <option key={option} value={option}>{option || 'Nenhuma'}</option>
        ))}
      </select>
    </div>
  );
};

const FormSection: React.FC<{ number: string; title: string; subtitle: string; children: React.ReactNode }> = ({ number, title, subtitle, children }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={{ ...S.card, marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: T.accentSoft, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
          {number}
        </div>
        <div>
          <h2 style={S.sectionTitle}>{title}</h2>
          <p style={S.sectionSubtitle}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string; color: string; bg: string }> = ({ label, value, color, bg }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={S.card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: bg, borderRadius: 'var(--radius)', flexShrink: 0 }}>
          <Building2 size={20} style={{ color }} />
        </div>
        <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>{label}</p>
      </div>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: T.textPrimary, textAlign: 'center', margin: 0 }}>{value}</p>
    </div>
  );
};

const ListCell: React.FC<{ label: string; value: string; detail?: string; strong?: boolean; highlight?: boolean }> = ({ label, value, detail, strong, highlight }) => {
  const { T } = useThemeTokens();
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: highlight ? '#22c55e' : strong ? T.textPrimary : T.textSecondary, fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', lineHeight: 1.4 }}>{value || '-'}</div>
      {detail && <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginTop: '4px' }}>{detail}</div>}
    </div>
  );
};

const DropdownFilter: React.FC<{ label: string; value: string; options: string[]; open: boolean; setOpen: (open: boolean) => void; onSelect: (value: string) => void; onBeforeOpen?: () => void }> = ({ label, value, options, open, setOpen, onSelect, onBeforeOpen }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  return (
    <div style={{ position: 'relative' }}>
      <label style={S.label}>{label}</label>
      <button onClick={() => { onBeforeOpen?.(); setOpen(!open); }} style={{ width: '100%', backgroundColor: T.bgInput, border: `1px solid ${T.borderDefault}`, borderRadius: '6px', padding: '10px 12px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <span>{value}</span>
        <ChevronDown size={16} style={{ color: T.iconSubdued, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`, borderRadius: '6px', overflow: 'hidden', zIndex: 100, boxShadow: T.shadowMd }}>
          {options.map(option => (
            <button key={option} onClick={() => { onSelect(option); setOpen(false); }} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: value === option ? T.accentSoft : 'transparent', color: value === option ? T.accent : T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
