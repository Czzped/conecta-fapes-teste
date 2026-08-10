import React, { useMemo, useState } from 'react';
import { ArrowLeft, Building2, ChevronDown, ChevronRight, Plus, Search, Trash2 } from 'lucide-react';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

type NaturezaJuridica = '' | 'Publica' | 'Privada';
type SituacaoInstituicao = 'Ativa' | 'Inativa' | 'Rascunho';
type ClassificacaoInstituicao =
  | ''
  | 'Instituição Científica, Tecnológica e de Inovação (ICT)'
  | 'Instituição de Ensino Superior (IES)'
  | 'Organização Sem Fins Lucrativos (OSFL)'
  | 'Empresa';
type NivelInstituicao = '' | 'Municipal' | 'Estadual' | 'Federal' | 'Internacional';
type ActiveTab = 'listagem' | 'dashboard';

interface InstituicaoItem {
  id: number;
  nome: string;
  sigla: string;
  classificacao: ClassificacaoInstituicao;
  filial: string;
  cnpj: string;
  razaoSocial: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  natureza: NaturezaJuridica;
  nivel?: NivelInstituicao;
  municipio: string;
  uf: string;
  responsavel: string;
  dataInicioMandato: string;
  dataFimMandato: string;
  projetosAtivos: number;
  bolsasAtivas: number;
  valorRecebido: number;
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

const classificacaoOptions: ClassificacaoInstituicao[] = [
  'Instituição Científica, Tecnológica e de Inovação (ICT)',
  'Instituição de Ensino Superior (IES)',
  'Organização Sem Fins Lucrativos (OSFL)',
  'Empresa',
];

const emptyInstituicao: InstituicaoItem = {
  id: 0,
  nome: '',
  sigla: '',
  classificacao: '',
  filial: '',
  cnpj: '',
  razaoSocial: '',
  email: '',
  telefone: '',
  cep: '',
  endereco: '',
  bairro: '',
  natureza: '',
  nivel: '',
  municipio: '',
  uf: 'ES',
  responsavel: '',
  dataInicioMandato: '',
  dataFimMandato: '',
  projetosAtivos: 0,
  bolsasAtivas: 0,
  valorRecebido: 0,
  superior: '',
  situacao: 'Ativa',
};

const initialInstituicoes: InstituicaoItem[] = [
  { id: 1, nome: 'Universidade Federal do Espírito Santo', sigla: 'UFES', classificacao: 'Instituição de Ensino Superior (IES)', filial: 'PPGI', cnpj: '32.479.123/0001-43', razaoSocial: 'Universidade Federal do Espírito Santo', email: 'gabinete@ufes.br', telefone: '(27) 4009-2000', endereco: 'Av. Fernando Ferrari, 514 - Goiabeiras', natureza: 'Publica', municipio: 'Vitória', uf: 'ES', responsavel: 'Paulo Vargas', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', projetosAtivos: 18, bolsasAtivas: 11, valorRecebido: 2450000, situacao: 'Ativa' },
  { id: 2, nome: 'Universidade Federal do Espírito Santo', sigla: 'UFES', classificacao: 'Instituição de Ensino Superior (IES)', filial: 'Centro Tecnológico', cnpj: '32.479.123/0001-43', razaoSocial: 'Universidade Federal do Espírito Santo', email: 'ct@ufes.br', telefone: '(27) 4009-2600', endereco: 'Campus Goiabeiras', natureza: 'Publica', municipio: 'Vitória', uf: 'ES', responsavel: 'Ana Ribeiro', dataInicioMandato: '2023-03-01', dataFimMandato: '2027-02-28', projetosAtivos: 9, bolsasAtivas: 17, valorRecebido: 1280000, superior: 'Universidade Federal do Espírito Santo', situacao: 'Ativa' },
  { id: 3, nome: 'Universidade Federal do Espírito Santo', sigla: 'UFES', classificacao: 'Instituição de Ensino Superior (IES)', filial: 'Centro de Saúde', cnpj: '32.479.123/0001-43', razaoSocial: 'Universidade Federal do Espírito Santo', email: 'saude@ufes.br', telefone: '(27) 4009-2100', endereco: 'Campus Maruípe', natureza: 'Publica', municipio: 'Vitória', uf: 'ES', responsavel: 'Mariana Duarte', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', projetosAtivos: 12, bolsasAtivas: 32, valorRecebido: 1640000, superior: 'Universidade Federal do Espírito Santo', situacao: 'Ativa' },
  { id: 4, nome: 'Ifes Campus Serra', sigla: 'IFES', classificacao: 'Instituição de Ensino Superior (IES)', filial: 'Mestrado em Informática', cnpj: '10.838.653/0001-06', razaoSocial: 'Instituto Federal de Educação, Ciência e Tecnologia do Espírito Santo', email: 'reitoria@ifes.edu.br', telefone: '(27) 3357-7500', endereco: 'Av. Rio Branco, 50 - Santa Lúcia', natureza: 'Publica', municipio: 'Vitória', uf: 'ES', responsavel: 'Jadir Pela', dataInicioMandato: '2021-10-01', dataFimMandato: '2025-09-30', projetosAtivos: 14, bolsasAtivas: 46, valorRecebido: 1980000, situacao: 'Ativa' },
  { id: 5, nome: 'Fucape Business School', sigla: 'FUCAPE', classificacao: 'Instituição de Ensino Superior (IES)', filial: 'Não Possui', cnpj: '03.389.451/0001-66', razaoSocial: 'Fundação Instituto Capixaba de Pesquisas em Contabilidade, Economia e Finanças', email: 'contato@fucape.br', telefone: '(27) 4009-4444', endereco: 'Av. Fernando Ferrari, 1358 - Boa Vista', natureza: 'Privada', municipio: 'Vitória', uf: 'ES', responsavel: 'Valcemiro Nossa', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', projetosAtivos: 6, bolsasAtivas: 11, valorRecebido: 640000, situacao: 'Ativa' },
  { id: 6, nome: 'Universidade Vila Velha', sigla: 'UVV', classificacao: 'Instituição de Ensino Superior (IES)', filial: 'Não Possui', cnpj: '39.268.702/0001-28', razaoSocial: 'Universidade Vila Velha', email: 'contato@uvv.br', telefone: '(27) 3421-2000', endereco: 'Av. Comissário José Dantas de Melo, 21', natureza: 'Privada', municipio: 'Vila Velha', uf: 'ES', responsavel: 'Carolina Nunes', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', projetosAtivos: 8, bolsasAtivas: 17, valorRecebido: 720000, situacao: 'Ativa' },
  { id: 7, nome: 'Instituto Jones dos Santos Neves', sigla: 'IJSN', classificacao: 'Instituição Científica, Tecnológica e de Inovação (ICT)', filial: 'Não Possui', cnpj: '27.316.918/0001-23', razaoSocial: 'Instituto Jones dos Santos Neves', email: 'contato@ijsn.es.gov.br', telefone: '(27) 3636-8050', endereco: 'Av. Marechal Mascarenhas de Moraes, 2524', natureza: 'Publica', municipio: 'Vitória', uf: 'ES', responsavel: 'Rafael Oliveira', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', projetosAtivos: 5, bolsasAtivas: 32, valorRecebido: 510000, situacao: 'Ativa' },
  { id: 8, nome: 'Senai', sigla: 'SENAI', classificacao: 'Organização Sem Fins Lucrativos (OSFL)', filial: 'Não Possui', cnpj: '03.810.480/0001-85', razaoSocial: 'Serviço Nacional de Aprendizagem Industrial', email: 'contato@senai-es.org.br', telefone: '(27) 3334-5600', endereco: 'Av. Nossa Senhora da Penha, 2053', natureza: 'Privada', municipio: 'Vitória', uf: 'ES', responsavel: 'Bruno Matos', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', projetosAtivos: 4, bolsasAtivas: 46, valorRecebido: 430000, situacao: 'Ativa' },
  { id: 9, nome: 'Vale', sigla: 'VALE', classificacao: 'Empresa', filial: 'Não Possui', cnpj: '33.592.510/0001-54', razaoSocial: 'Vale S.A.', email: 'inovacao@vale.com', telefone: '(27) 3333-3000', endereco: 'Complexo de Tubarão', natureza: 'Privada', municipio: 'Vitória', uf: 'ES', responsavel: 'Fernanda Costa', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', projetosAtivos: 7, bolsasAtivas: 11, valorRecebido: 950000, situacao: 'Ativa' },
  { id: 10, nome: 'Arcelor', sigla: 'ARCELOR', classificacao: 'Empresa', filial: 'Não Possui', cnpj: '17.469.701/0001-77', razaoSocial: 'ArcelorMittal Brasil S.A.', email: 'pesquisa@arcelor.com', telefone: '(27) 3348-9000', endereco: 'Av. Brigadeiro Eduardo Gomes, 930', natureza: 'Privada', municipio: 'Serra', uf: 'ES', responsavel: 'Marcelo Lima', dataInicioMandato: '2024-01-01', dataFimMandato: '2028-12-31', projetosAtivos: 3, bolsasAtivas: 17, valorRecebido: 390000, situacao: 'Ativa' },
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

const projetosPorInstituicao: Record<string, Array<{
  projeto: string;
  unidade: string;
  coordenador: string;
  area: string;
  periodo: string;
  valorRecebido: number;
  bolsistasAtivos: number;
  status: 'Ativo' | 'Finalizado';
}>> = {
  'Universidade Federal do Espírito Santo': [
    { projeto: 'Monitoramento Inteligente de Recursos Hídricos', unidade: 'PPGI', coordenador: 'Mariana Duarte', area: 'Tecnologia', periodo: '2025-2027', valorRecebido: 620000, bolsistasAtivos: 11, status: 'Ativo' },
    { projeto: 'Materiais Avançados para Energia Limpa', unidade: 'Centro Tecnológico', coordenador: 'Paulo Vargas', area: 'Engenharia', periodo: '2024-2026', valorRecebido: 480000, bolsistasAtivos: 17, status: 'Ativo' },
    { projeto: 'Saúde Digital no SUS Capixaba', unidade: 'Centro de Saúde', coordenador: 'Ana Ribeiro', area: 'Saúde', periodo: '2023-2025', valorRecebido: 540000, bolsistasAtivos: 32, status: 'Finalizado' },
  ],
  'Ifes Campus Serra': [
    { projeto: 'Computação Aplicada à Indústria 4.0', unidade: 'Mestrado em Informática', coordenador: 'Jadir Pela', area: 'Tecnologia', periodo: '2025-2027', valorRecebido: 720000, bolsistasAtivos: 46, status: 'Ativo' },
    { projeto: 'Automação de Processos Educacionais', unidade: 'Mestrado em Informática', coordenador: 'Marta Souza', area: 'Educação', periodo: '2024-2026', valorRecebido: 390000, bolsistasAtivos: 17, status: 'Ativo' },
  ],
  'Fucape Business School': [
    { projeto: 'Gestão Pública Baseada em Evidências', unidade: 'Não Possui', coordenador: 'Valcemiro Nossa', area: 'Gestão', periodo: '2024-2026', valorRecebido: 320000, bolsistasAtivos: 11, status: 'Ativo' },
  ],
  'Universidade Vila Velha': [
    { projeto: 'Biotecnologia Marinha Aplicada', unidade: 'Não Possui', coordenador: 'Carolina Nunes', area: 'Meio Ambiente', periodo: '2025-2027', valorRecebido: 420000, bolsistasAtivos: 17, status: 'Ativo' },
  ],
  'Instituto Jones dos Santos Neves': [
    { projeto: 'Indicadores Territoriais do Espírito Santo', unidade: 'Não Possui', coordenador: 'Rafael Oliveira', area: 'Políticas Públicas', periodo: '2024-2025', valorRecebido: 260000, bolsistasAtivos: 32, status: 'Finalizado' },
  ],
  Senai: [
    { projeto: 'Manufatura Inteligente Capixaba', unidade: 'Não Possui', coordenador: 'Bruno Matos', area: 'Indústria', periodo: '2025-2027', valorRecebido: 430000, bolsistasAtivos: 46, status: 'Ativo' },
  ],
  Vale: [
    { projeto: 'Mineração Sustentável e Segurança Operacional', unidade: 'Não Possui', coordenador: 'Fernanda Costa', area: 'Sustentabilidade', periodo: '2024-2026', valorRecebido: 950000, bolsistasAtivos: 11, status: 'Ativo' },
  ],
  Arcelor: [
    { projeto: 'Aços Verdes para Cadeias Produtivas', unidade: 'Não Possui', coordenador: 'Marcelo Lima', area: 'Materiais', periodo: '2025-2027', valorRecebido: 390000, bolsistasAtivos: 17, status: 'Ativo' },
  ],
};

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
  const [statusFilter, setStatusFilter] = useState<'Todos' | SituacaoInstituicao>('Todos');
  const [showNaturezaDropdown, setShowNaturezaDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<InstituicaoItem | null>(null);
  const [draft, setDraft] = useState<InstituicaoItem>(emptyInstituicao);
  const [draftFiliais, setDraftFiliais] = useState<SubestruturaDraft[]>([]);
  const [draftUnidades, setDraftUnidades] = useState<SubestruturaDraft[]>([]);
  const [estruturaUnidade, setEstruturaUnidade] = useState('');
  const [estruturaSigla, setEstruturaSigla] = useState('');
  const [estruturaResponsavel, setEstruturaResponsavel] = useState('');
  const [instituicoes, setInstituicoes] = useState<InstituicaoItem[]>(initialInstituicoes);
  const [dashboardInstituicao, setDashboardInstituicao] = useState('Todos');
  const [projetoSearch, setProjetoSearch] = useState('');
  const [projetoUnidade, setProjetoUnidade] = useState('');
  const [projetoCoordenador, setProjetoCoordenador] = useState('');
  const [projetoData, setProjetoData] = useState('');
  const [projetoStatus, setProjetoStatus] = useState('Todos');

  const filtered = instituicoes.filter(item => {
    const query = searchTerm.toLowerCase();
    const matchSearch =
      item.nome.toLowerCase().includes(query) ||
      item.sigla.toLowerCase().includes(query) ||
      item.razaoSocial.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.cnpj.toLowerCase().includes(query);
    const matchNatureza = naturezaFilter === 'Todos' || item.natureza === naturezaFilter;
    const matchStatus = statusFilter === 'Todos' || item.situacao === statusFilter;
    return matchSearch && matchNatureza && matchStatus;
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
  const instituicaoOptions = ['Todos', ...Array.from(new Set(instituicoes.map(item => item.nome)))];
  const dashboardInstituicoesSelecionadas = dashboardInstituicao === 'Todos'
    ? instituicoes
    : instituicoes.filter(item => item.nome === dashboardInstituicao);
  const dashboardProjetos = dashboardInstituicao === 'Todos'
    ? Object.values(projetosPorInstituicao).flat()
    : projetosPorInstituicao[dashboardInstituicao] || [];
  const projetoUnidadeOptions = Array.from(new Set(dashboardProjetos.map(projeto => projeto.unidade)));
  const projetoCoordenadorOptions = Array.from(new Set(dashboardProjetos.map(projeto => projeto.coordenador)));
  const dashboardProjetosFiltrados = dashboardProjetos.filter(projeto => {
    const query = projetoSearch.toLowerCase();
    const matchSearch = !query || projeto.projeto.toLowerCase().includes(query) || projeto.unidade.toLowerCase().includes(query) || projeto.coordenador.toLowerCase().includes(query);
    const matchUnidade = !projetoUnidade || projeto.unidade.toLowerCase().includes(projetoUnidade.toLowerCase());
    const matchCoordenador = !projetoCoordenador || projeto.coordenador.toLowerCase().includes(projetoCoordenador.toLowerCase());
    const matchData = !projetoData || projeto.periodo.toLowerCase().includes(projetoData.toLowerCase());
    const matchStatus = projetoStatus === 'Todos' || projeto.status === projetoStatus;
    return matchSearch && matchUnidade && matchCoordenador && matchData && matchStatus;
  });
  const dashboardProjetosAtivos = dashboardInstituicoesSelecionadas.reduce((total, item) => total + item.projetosAtivos, 0);
  const dashboardBolsasAtivas = dashboardInstituicoesSelecionadas.reduce((total, item) => total + item.bolsasAtivas, 0);
  const dashboardValorRecebido = dashboardInstituicoesSelecionadas.reduce((total, item) => total + item.valorRecebido, 0);

  const openNew = () => {
    setDraft({ ...emptyInstituicao, id: Date.now() });
    setDraftFiliais([]);
    setDraftUnidades([]);
    setEstruturaUnidade('');
    setEstruturaSigla('');
    setEstruturaResponsavel('');
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
    setEstruturaUnidade(item.filial === 'Não Possui' ? '' : item.filial);
    setEstruturaSigla('');
    setEstruturaResponsavel(item.responsavel);
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
  const responsaveisOptions = ['Paulo Vargas', 'Ana Ribeiro', 'Jadir Pela', 'Marta Souza', 'Valcemiro Nossa', 'Carla Mendes'];

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
        filial: '',
        projetosAtivos: 0,
        bolsasAtivas: 0,
        valorRecebido: 0,
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
    const historicoDoSelecionado: { pessoa: string; dataInicio: string; dataFim: string }[] = !showForm && selected
      ? [
          { pessoa: 'Joao Silva', dataInicio: '2020-01-01', dataFim: '2023-12-31' },
          { pessoa: 'Pedro Lima', dataInicio: '2017-01-01', dataFim: '2019-12-31' },
          { pessoa: 'Carla Mendes', dataInicio: '2013-01-01', dataFim: '2016-12-31' },
        ]
      : [];

    return (
      <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
        <div className="pt-8 px-8 pb-8">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSelected(null); }}
                  style={{ background: 'none', border: 'none', padding: 0, color: T.textMuted, cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}
                >
                  Instituição
                </button>
                <ChevronRight size={13} style={{ color: T.iconSubdued }} />
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)' }}>
                  {showForm ? 'Criar Instituição' : 'Detalhes'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <button
                  onClick={() => { setShowForm(false); setSelected(null); }}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: 'var(--radius)', backgroundColor: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                >
                  <ArrowLeft size={18} style={{ color: T.accent }} />
                </button>
                <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', color: T.textPrimary, fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                  {showForm ? 'Criar Instituição' : draft.nome}
                </h1>
              </div>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 0 48px' }}>
                {showForm ? 'Preencha as informações abaixo para criar uma nova Instituição' : 'Verifique as informações dessa Instituição'}
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, margin: '-8px 0 32px' }} />

          <FormSection number="1" title="Identificação" subtitle="Dados básicos">
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '16px', marginBottom: '16px' }}>
              <Field label="Nome" value={draft.nome} onChange={value => updateDraft('nome', value)} placeholder="Nome da Instituição" />
              <Field label="Sigla" value={draft.sigla} onChange={value => updateDraft('sigla', value)} placeholder="Sigla" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.6fr', gap: '16px', marginBottom: '16px' }}>
              <Field label="CNPJ" value={draft.cnpj} onChange={value => updateDraft('cnpj', maskCnpj(value))} placeholder="Deixe vazio para setor sem CNPJ" />
              <Field label={isSetorSemCnpj ? 'Razão Social' : 'Razão Social obrigatória'} value={draft.razaoSocial} onChange={value => updateDraft('razaoSocial', value)} placeholder={isSetorSemCnpj ? 'Não se aplica a setor interno' : 'Razão Social'} disabled={isSetorSemCnpj} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.7fr', gap: '16px', marginBottom: '16px' }}>
              <Select
                label="Classificação"
                value={draft.classificacao}
                onChange={value => updateDraft('classificacao', value)}
                options={classificacaoOptions}
                placeholder="Selecione"
              />
              <Select label="Natureza" value={draft.natureza} onChange={value => updateDraft('natureza', value)} options={['Publica', 'Privada']} placeholder="Selecione" />
              <Select
                label="Nível"
                value={draft.nivel || ''}
                onChange={value => updateDraft('nivel', value)}
                options={['Municipal', 'Estadual', 'Federal', 'Internacional']}
                placeholder="Selecione"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.7fr', gap: '16px', marginBottom: '16px' }}>
              <Field label="E-mail Institucional" value={draft.email} onChange={value => updateDraft('email', value)} placeholder="email@instituicao.br" />
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

          <FormSection number="2" title="Responsável" subtitle="Pessoa responsável pela Instituição">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.5fr 0.6fr', gap: '16px' }}>
              <ComboField label="Pessoa responsável" value={draft.responsavel} onChange={value => updateDraft('responsavel', value)} options={responsaveisOptions} placeholder="Digite ou selecione uma pessoa" />
              <Field label="Início do mandato" value={draft.dataInicioMandato} onChange={value => updateDraft('dataInicioMandato', value)} placeholder="AAAA-MM-DD" />
              <Field
                label="Fim do mandato"
                value={draft.dataFimMandato}
                onChange={value => updateDraft('dataFimMandato', value)}
                placeholder="AAAA-MM-DD"
              />
            </div>

            {!showForm && selected && (
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
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr',
                        gap: '12px',
                        padding: '0 14px',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)',
                        color: T.textMuted,
                      }}
                    >
                      <span>Responsável</span>
                      <span>Início do Mandato</span>
                      <span>Fim do Mandato</span>
                    </div>
                    {historicoDoSelecionado.map((h, idx) => (
                      <div
                        key={`${h.pessoa}-${idx}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr',
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
                        <span>{h.dataInicio}</span>
                        <span>{h.dataFim}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </FormSection>

          <FormSection number="3" title="Estrutura organizacional" subtitle="Se na instituição houver, inclua as unidades">
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.5fr 1fr', gap: '16px' }}>
              <Field label="Unidade" value={estruturaUnidade} onChange={setEstruturaUnidade} placeholder="Exemplos: Filial, Centro, Setor, Laboratório, Mestrado ou Doutorado" />
              <Field label="Sigla" value={estruturaSigla} onChange={setEstruturaSigla} placeholder="Sigla" />
              <ComboField label="Responsável" value={estruturaResponsavel} onChange={setEstruturaResponsavel} options={responsaveisOptions} placeholder="Digite ou selecione uma pessoa" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setEstruturaUnidade('');
                  setEstruturaSigla('');
                  setEstruturaResponsavel('');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: T.accentSoft, border: `1px solid ${T.accent}`, borderRadius: 'var(--radius)', padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.accent, cursor: 'pointer' }}
              >
                <Plus size={15} />
                Adicionar
              </button>
            </div>
          </FormSection>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flex: 1 }}>
              <button type="button" onClick={() => { setShowForm(false); setSelected(null); }} style={{ backgroundColor: 'transparent', border: `1px solid ${T.borderStrong}`, borderRadius: 'var(--radius)', padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, cursor: 'pointer' }}>
                {showForm ? 'Salvar Rascunho' : 'Cancelar'}
              </button>
              <button type="button" onClick={saveDraft} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: T.accent, border: 'none', borderRadius: 'var(--radius)', padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: T.accentText, cursor: 'pointer' }}>
                {showForm ? 'Ativar Instituição' : 'Salvar'}
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
              Criar Instituição
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${T.borderSubtle}`, marginBottom: '28px' }}>
          {[
            { id: 'listagem' as ActiveTab, label: 'Instituições' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${T.accent}` : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === tab.id ? T.accent : T.textSecondary, cursor: 'pointer', marginBottom: '-1px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <Metric label="Projetos Ativos" value={String(dashboardProjetosAtivos)} color={T.accent} bg={T.accentSoft} />
              <Metric label="Bolsas Ativas" value={String(dashboardBolsasAtivas)} color={T.accent} bg={T.accentSoft} />
              <Metric label="Valor Recebido" value={formatCurrency(dashboardValorRecebido)} color={T.accent} bg={T.accentSoft} />
            </div>

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.7fr 0.8fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={S.label}>Pesquisar</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" placeholder="Buscar" value={projetoSearch} onChange={event => setProjetoSearch(event.target.value)} style={{ ...S.input, paddingRight: '36px' }} />
                    <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                  </div>
                </div>
                <Select label="Instituição" value={dashboardInstituicao} onChange={setDashboardInstituicao} options={instituicaoOptions} />
                <ComboField label="Unidade" value={projetoUnidade} onChange={setProjetoUnidade} options={projetoUnidadeOptions} placeholder="Todos" />
                <ComboField label="Coordenador" value={projetoCoordenador} onChange={setProjetoCoordenador} options={projetoCoordenadorOptions} placeholder="Todos" />
                <Field label="Data" value={projetoData} onChange={setProjetoData} placeholder="AAAA" />
                <Select label="Status" value={projetoStatus} onChange={setProjetoStatus} options={['Todos', 'Ativo', 'Finalizado']} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dashboardProjetosFiltrados.map(projeto => (
                  <div key={projeto.projeto} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.9fr 0.9fr 0.7fr 0.7fr', gap: '14px', alignItems: 'start', padding: '14px 16px', border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted }}>
                    <ListCell label="Projeto" value={projeto.projeto} strong />
                    <ListCell label="Unidade" value={projeto.unidade} />
                    <ListCell label="Coordenador" value={projeto.coordenador} />
                    <ListCell label="Período de Execução" value={projeto.periodo} />
                    <ListCell label="Valor Recebido" value={formatCurrency(projeto.valorRecebido)} />
                    <ListCell label="Bolsistas Ativos" value={String(projeto.bolsistasAtivos)} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Status</div>
                      <span style={{ display: 'inline-block', backgroundColor: `${statusColor(projeto.status === 'Ativo' ? 'Ativa' : 'Inativa')}20`, border: `1px solid ${statusColor(projeto.status === 'Ativo' ? 'Ativa' : 'Inativa')}`, borderRadius: '999px', padding: '3px 12px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: statusColor(projeto.status === 'Ativo' ? 'Ativa' : 'Inativa') }}>
                        {projeto.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listagem' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={S.label}>Pesquisar</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Buscar" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} style={{ ...S.input, paddingRight: '36px' }} />
                  <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                </div>
              </div>
              <DropdownFilter label="Natureza" value={naturezaFilter} options={['Todos', 'Publica', 'Privada']} open={showNaturezaDropdown} setOpen={setShowNaturezaDropdown} onSelect={value => setNaturezaFilter(value as typeof naturezaFilter)} />
              <DropdownFilter label="Status" value={statusFilter} options={['Todos', 'Ativa', 'Inativa', 'Rascunho']} open={showStatusDropdown} setOpen={setShowStatusDropdown} onSelect={value => setStatusFilter(value as typeof statusFilter)} />
            </div>

            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 12px' }}>
              Exibindo {filtered.length} resultados de {instituicoes.length}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(item => (
                <button key={item.id} onClick={() => openDetails(item)} onMouseEnter={event => { event.currentTarget.style.backgroundColor = T.bgHover; }} onMouseLeave={event => { event.currentTarget.style.backgroundColor = T.bgCard; }} style={{ textAlign: 'left', backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '10px', padding: '18px 20px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 0.9fr minmax(92px, 0.8fr) 18px', gap: '14px', alignItems: 'start' }}>
                    <ListCell label="Instituição" value={item.nome} strong />
                    <ListCell label="Unidade" value={item.filial} />
                    <ListCell label="Natureza" value={item.natureza === 'Publica' ? 'Pública' : 'Privada'} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>Status</div>
                      <span style={{ display: 'inline-block', backgroundColor: `${statusColor(item.situacao)}20`, border: `1px solid ${statusColor(item.situacao)}`, borderRadius: '999px', padding: '3px 12px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: statusColor(item.situacao) }}>
                        {item.situacao}
                      </span>
                    </div>
                    <ChevronRight size={18} style={{ color: T.iconSubdued, marginTop: '20px', justifySelf: 'end' }} />
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

const ComboField: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder?: string; disabled?: boolean }> = ({ label, value, onChange, options, placeholder, disabled }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  const [open, setOpen] = useState(false);
  const filteredOptions = options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
  const visibleOptions = filteredOptions.length > 0 ? filteredOptions : options;

  return (
    <div style={{ position: 'relative' }}>
      <label style={S.label}>{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={event => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        style={{ ...S.input, paddingRight: '36px', opacity: disabled ? 0.55 : 1 }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(prev => !prev)}
        style={{ position: 'absolute', right: '8px', top: '34px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: T.iconSubdued, cursor: disabled ? 'not-allowed' : 'pointer' }}
        aria-label="Abrir opções"
      >
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && !disabled && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`, borderRadius: '6px', overflow: 'hidden', zIndex: 100, boxShadow: T.shadowMd }}>
          {visibleOptions.map(option => {
            const active = value === option;
            return (
              <button
                key={option}
                type="button"
                onMouseDown={event => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                onMouseEnter={event => {
                  if (!active) event.currentTarget.style.backgroundColor = T.bgHover;
                }}
                onMouseLeave={event => {
                  if (!active) event.currentTarget.style.backgroundColor = 'transparent';
                }}
                style={{ width: '100%', padding: '10px 12px', textAlign: 'left', backgroundColor: active ? T.accentSoft : 'transparent', color: active ? T.accent : T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', border: 'none', cursor: 'pointer' }}
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

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[]; disabled?: boolean; placeholder?: string }> = ({ label, value, onChange, options, disabled, placeholder = 'Nenhuma' }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  const [open, setOpen] = useState(false);
  const displayValue = value || placeholder;

  return (
    <div style={{ position: 'relative' }}>
      <label style={S.label}>{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(prev => !prev)}
        style={{
          ...S.input,
          opacity: disabled ? 0.55 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
        }}
      >
        <span>{displayValue}</span>
        <ChevronDown size={16} style={{ color: T.iconSubdued, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && !disabled && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`, borderRadius: '6px', overflow: 'hidden', zIndex: 100, boxShadow: T.shadowMd }}>
          {options.map(option => {
            const labelOption = option || 'Nenhuma';
            const active = value === option;
            return (
              <button
                key={option || 'empty'}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                onMouseEnter={event => {
                  if (!active) event.currentTarget.style.backgroundColor = T.bgHover;
                }}
                onMouseLeave={event => {
                  if (!active) event.currentTarget.style.backgroundColor = 'transparent';
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  textAlign: 'left',
                  backgroundColor: active ? T.accentSoft : 'transparent',
                  color: active ? T.accent : T.textPrimary,
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {labelOption}
              </button>
            );
          })}
        </div>
      )}
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
