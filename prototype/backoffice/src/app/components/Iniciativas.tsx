import React, { useMemo, useState } from 'react';
import {
  Award,
  Box,
  Building2,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  FileEdit,
  FileText,
  FolderKanban,
  GraduationCap,
  Hotel,
  Landmark,
  Package,
  PauseCircle,
  Plane,
  PlaneTakeoff,
  PlayCircle,
  Plus,
  Save,
  Search,
  Send,
  User,
  Users,
  UserCheck,
  Wallet,
  XCircle,
} from 'lucide-react';

type StatusIniciativa = 'Submetida' | 'Aprovada' | 'Em contratação' | 'Em execução' | 'Suspensa' | 'Concluída' | 'Cancelada';
type DiariaPanelTab = 'solicitadas' | 'nova' | 'minhas';
type StatusPainelDiaria = 'ALOCADA' | 'APROVADA' | 'CANCELADA' | 'RECUSADA';

interface Iniciativa {
  codigo: string;
  titulo: string;
  proponente: string;
  coordenador: string;
  edital: string;
  status: StatusIniciativa;
  dataSubmissao: string;
  valorAprovado: string;
  dataAprovacaoOriginal: string;
  dataInicio: string;
  dataFimOriginal: string;
  dataFimVigente: string;
  orcamentoOriginal: string;
}

interface ContaBancariaIniciativa {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  titular: string;
  documentoTitular: string;
}

interface MembroEquipeIniciativa {
  nome: string;
  papel: string;
  modalidade: string;
  vigencia: string;
  status: 'Ativo' | 'Alocado' | 'Finalizado' | 'Suspenso';
  email: string;
  telefone?: string;
  inicio?: string;
  termino?: string;
}

interface RubricaDiariaPainel {
  codigo: string;
  nome: string;
  tipoViagem: string;
  diariaVigente: string;
  total: number;
  alocado: number;
  utilizado: number;
  saldo: number;
  aceitesPendentes: number;
}

interface DiariaPainelSolicitacao {
  id: string;
  iniciativa: string;
  status: StatusPainelDiaria;
  origem: string;
  destino: string;
  bolsista: string;
  quantidade: number;
  valor: number;
  distancia: string;
  tipoDiariaRef: string;
  parametroCalculoDiariaRef: string;
  partida: string;
  chegada: string;
  transacaoComprometimentoRef?: string;
  transacaoReversaoRef?: string;
  justificativaRecusa?: string;
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const iniciativas: Iniciativa[] = [
  {
    codigo: 'INI-2026-001',
    titulo: 'Conecta Fapes',
    proponente: 'Instituto Federal do Espírito Santo',
    coordenador: 'Marina Costa',
    edital: 'Edital 27/2025',
    status: 'Em execução',
    dataSubmissao: '15/01/2026',
    valorAprovado: 'R$ 1.250.000,00',
    dataAprovacaoOriginal: '20/02/2024',
    dataInicio: '01/03/2024',
    dataFimOriginal: '28/02/2026',
    dataFimVigente: '31/08/2026',
    orcamentoOriginal: 'R$ 1.000.000,00',
  },
  {
    codigo: 'INI-2026-002',
    titulo: 'Bioinsumos para agricultura de precisão',
    proponente: 'Universidade Federal do Espírito Santo',
    coordenador: 'André Carvalho',
    edital: 'Edital 18/2025',
    status: 'Submetida',
    dataSubmissao: '14/02/2026',
    valorAprovado: 'Em análise',
    dataAprovacaoOriginal: 'Pendente',
    dataInicio: 'Pendente',
    dataFimOriginal: 'Pendente',
    dataFimVigente: 'Pendente',
    orcamentoOriginal: 'Em análise',
  },
  {
    codigo: 'INI-2026-003',
    titulo: 'Observatório Capixaba de Inovação',
    proponente: 'Fundação de Apoio à Pesquisa',
    coordenador: 'Helena Duarte',
    edital: 'Edital 21/2025',
    status: 'Aprovada',
    dataSubmissao: '28/01/2026',
    valorAprovado: 'R$ 420.000,00',
    dataAprovacaoOriginal: '18/03/2026',
    dataInicio: 'Pendente',
    dataFimOriginal: 'Pendente',
    dataFimVigente: 'Pendente',
    orcamentoOriginal: 'R$ 420.000,00',
  },
  {
    codigo: 'INI-2026-004',
    titulo: 'Rede de sensores para cidades resilientes',
    proponente: 'Prefeitura Municipal de Vitória',
    coordenador: 'Ricardo Torres',
    edital: 'Edital 03/2026',
    status: 'Em contratação',
    dataSubmissao: '28/02/2026',
    valorAprovado: 'R$ 210.000,00',
    dataAprovacaoOriginal: '22/03/2026',
    dataInicio: 'Pendente',
    dataFimOriginal: 'Pendente',
    dataFimVigente: 'Pendente',
    orcamentoOriginal: 'R$ 210.000,00',
  },
  {
    codigo: 'INI-2025-017',
    titulo: 'Pesquisa aplicada em saúde digital',
    proponente: 'Hospital Universitário Cassiano Antonio Moraes',
    coordenador: 'Paula Nascimento',
    edital: 'Edital 09/2025',
    status: 'Suspensa',
    dataSubmissao: '11/09/2025',
    valorAprovado: 'R$ 360.000,00',
    dataAprovacaoOriginal: '15/10/2025',
    dataInicio: '01/11/2025',
    dataFimOriginal: '31/10/2027',
    dataFimVigente: '31/10/2027',
    orcamentoOriginal: 'R$ 360.000,00',
  },
  {
    codigo: 'INI-2024-042',
    titulo: 'Laboratório móvel de educação científica',
    proponente: 'Universidade Vila Velha',
    coordenador: 'Lucas Moreira',
    edital: 'Edital 12/2024',
    status: 'Concluída',
    dataSubmissao: '03/05/2024',
    valorAprovado: 'R$ 180.000,00',
    dataAprovacaoOriginal: '20/06/2024',
    dataInicio: '01/07/2024',
    dataFimOriginal: '30/06/2025',
    dataFimVigente: '30/06/2025',
    orcamentoOriginal: 'R$ 180.000,00',
  },
  {
    codigo: 'INI-2024-038',
    titulo: 'Plataforma de dados ambientais',
    proponente: 'Instituto Jones dos Santos Neves',
    coordenador: 'Sofia Almeida',
    edital: 'Edital 07/2024',
    status: 'Cancelada',
    dataSubmissao: '18/04/2024',
    valorAprovado: 'R$ 95.000,00',
    dataAprovacaoOriginal: '10/05/2024',
    dataInicio: 'Não iniciada',
    dataFimOriginal: 'Não iniciada',
    dataFimVigente: 'Não iniciada',
    orcamentoOriginal: 'R$ 95.000,00',
  },
];

const emptyContaBancaria: ContaBancariaIniciativa = {
  banco: '',
  agencia: '',
  conta: '',
  tipoConta: 'Conta corrente',
  titular: '',
  documentoTitular: '',
};

const contasIniciais: Record<string, ContaBancariaIniciativa> = {
  'INI-2026-001': {
    banco: 'Banco do Estado do Espírito Santo',
    agencia: '0215',
    conta: '112233-4',
    tipoConta: 'Conta corrente',
    titular: 'Instituto Federal do Espírito Santo',
    documentoTitular: '10.838.653/0001-06',
  },
};

const equipesIniciativas: Record<string, MembroEquipeIniciativa[]> = {
  'Conecta Fapes': [
    {
      nome: 'Marina Costa',
      papel: 'Coordenadora',
      modalidade: 'Coordenação do projeto',
      vigencia: '01/03/2024 - 31/08/2026',
      status: 'Ativo',
      email: 'marina.costa@ifes.edu.br',
      telefone: '(27) 99999-0001',
      inicio: '01/03/2024',
      termino: '31/08/2026',
    },
    {
      nome: 'Ana Souza',
      papel: 'Bolsista',
      modalidade: 'Iniciação Científica',
      vigencia: '01/06/2025 - 01/06/2026',
      status: 'Ativo',
      email: 'ana.souza@ifes.edu.br',
      telefone: '(27) 99999-0002',
      inicio: '01/06/2025',
      termino: '01/06/2026',
    },
    {
      nome: 'Bruno Lima',
      papel: 'Bolsista',
      modalidade: 'Iniciação Científica',
      vigencia: '01/06/2025 - 01/06/2026',
      status: 'Ativo',
      email: 'bruno.lima@ifes.edu.br',
      telefone: '(27) 99999-0003',
      inicio: '01/06/2025',
      termino: '01/06/2026',
    },
    {
      nome: 'Carla Nunes',
      papel: 'Bolsista',
      modalidade: 'Apoio técnico',
      vigencia: '01/05/2026 - 31/10/2026',
      status: 'Alocado',
      email: 'carla.nunes@ifes.edu.br',
      telefone: '(27) 99999-0004',
      inicio: '01/05/2026',
      termino: '31/10/2026',
    },
  ],
  'Bioinsumos para agricultura de precisão': [
    {
      nome: 'André Carvalho',
      papel: 'Coordenador',
      modalidade: 'Coordenação do projeto',
      vigencia: 'Pendente',
      status: 'Alocado',
      email: 'andre.carvalho@ufes.br',
      telefone: '(27) 99999-0101',
      inicio: 'Pendente',
      termino: 'Pendente',
    },
    {
      nome: 'Fernanda Alves',
      papel: 'Bolsista',
      modalidade: 'Apoio técnico',
      vigencia: 'Pendente',
      status: 'Alocado',
      email: 'fernanda.alves@ufes.br',
      telefone: '(27) 99999-0102',
      inicio: 'Pendente',
      termino: 'Pendente',
    },
  ],
};

const statusStyle: Record<StatusIniciativa, { color: string; bg: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }> = {
  Submetida: { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', Icon: FileText },
  Aprovada: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', Icon: CheckCircle },
  'Em contratação': { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', Icon: Clock },
  'Em execução': { color: '#00c1af', bg: 'rgba(0, 193, 175, 0.12)', Icon: PlayCircle },
  Suspensa: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', Icon: PauseCircle },
  Concluída: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.14)', Icon: CheckCircle },
  Cancelada: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', Icon: XCircle },
};

const filtros: Array<'Todas' | StatusIniciativa> = ['Todas', 'Submetida', 'Aprovada', 'Em contratação', 'Em execução', 'Suspensa', 'Concluída', 'Cancelada'];
type DetailTab = 'informacoes' | 'equipe' | 'diarias' | 'conta' | 'aditivos';

const projectStages = [
  { label: 'Submissão', date: '15/01/2024', Icon: Send, status: 'completed' },
  { label: 'Avaliação de Documentos', date: '20/01/2024', Icon: FileText, status: 'completed' },
  { label: 'Avaliação Ad Hoc', date: '05/02/2024', Icon: UserCheck, status: 'completed' },
  { label: 'Em Contratação', date: '20/02/2024', Icon: FileEdit, status: 'completed' },
  { label: 'Contratado', date: '01/03/2024', Icon: CheckCircle, status: 'completed' },
  { label: 'Em Execução', date: '16/03/2024', Icon: PlayCircle, status: 'current' },
  { label: 'Suspensa', date: '', Icon: PauseCircle, status: 'pending' },
  { label: 'Em Aprovação de Contas', date: '', Icon: DollarSign, status: 'pending' },
  { label: 'Concluído', date: '', Icon: Award, status: 'pending' },
  { label: 'Cancelada', date: '', Icon: XCircle, status: 'pending' },
];

const budgetCategories = [
  {
    name: 'Bolsa',
    total: 'R$ 4.738.032,00',
    consumido: 'R$ 2.100.000,00',
    alocado: 'R$ 1.122.000,00',
    disponivel: 'R$ 1.516.032,00',
    consumidoPercent: 44,
    alocadoPercent: 24,
    Icon: GraduationCap,
    color: '#60a5fa',
  },
  {
    name: 'Diárias',
    total: 'R$ 60.000,00',
    consumido: 'R$ 22.432,00',
    alocado: 'R$ 12.080,00',
    disponivel: 'R$ 25.488,00',
    consumidoPercent: 37,
    alocadoPercent: 20,
    Icon: Hotel,
    color: '#22d3ee',
  },
  {
    name: 'Material Permanente',
    total: 'R$ 500.000,00',
    consumido: 'R$ 180.000,00',
    alocado: null,
    disponivel: 'R$ 267.575,00',
    consumidoPercent: 46,
    alocadoPercent: 0,
    Icon: Package,
    color: '#22d3ee',
  },
  {
    name: 'Material de Consumo',
    total: 'R$ 260.000,00',
    consumido: 'R$ 150.992,80',
    alocado: null,
    disponivel: 'R$ 73.007,20',
    consumidoPercent: 72,
    alocadoPercent: 0,
    Icon: Box,
    color: '#22d3ee',
  },
  {
    name: 'Passagens',
    total: 'R$ 85.000,00',
    consumido: 'R$ 28.616,00',
    alocado: null,
    disponivel: 'R$ 45.384,00',
    consumidoPercent: 47,
    alocadoPercent: 0,
    Icon: Plane,
    color: '#22d3ee',
  },
  {
    name: 'Pessoa Jurídica',
    total: 'R$ 1.650.000,00',
    consumido: 'R$ 1.137.502,00',
    alocado: null,
    disponivel: 'R$ 312.498,00',
    consumidoPercent: 81,
    alocadoPercent: 0,
    Icon: Building2,
    color: '#22d3ee',
  },
];

const rubricasDiariasPainel: Record<string, RubricaDiariaPainel[]> = {
  'Conecta Fapes': [
    {
      codigo: 'DIA-2026-001',
      nome: 'Diária dentro do Estado',
      tipoViagem: 'Dentro do Estado',
      diariaVigente: 'R$ 260,00 · fração 12h',
      total: 28000,
      alocado: 7280,
      utilizado: 10140,
      saldo: 10580,
      aceitesPendentes: 2,
    },
    {
      codigo: 'DIA-2026-002',
      nome: 'Diária nacional',
      tipoViagem: 'Fora do Estado',
      diariaVigente: 'R$ 520,00 · fração 24h',
      total: 22000,
      alocado: 4800,
      utilizado: 8292,
      saldo: 8908,
      aceitesPendentes: 0,
    },
    {
      codigo: 'DIA-2026-003',
      nome: 'Diária internacional',
      tipoViagem: 'Fora do País',
      diariaVigente: 'US$ 220,00 · cotação turismo',
      total: 10000,
      alocado: 0,
      utilizado: 4000,
      saldo: 6000,
      aceitesPendentes: 0,
    },
  ],
};

const diariasPainelSolicitacoes: DiariaPainelSolicitacao[] = [
  {
    id: 'SD-2026-002',
    iniciativa: 'Conecta Fapes',
    status: 'APROVADA',
    origem: 'Vitória/ES',
    destino: 'Linhares/ES',
    bolsista: 'Carla Nunes',
    quantidade: 1.5,
    valor: 390,
    distancia: '133,86 km',
    tipoDiariaRef: 'DIA-2026-001',
    parametroCalculoDiariaRef: 'PCD-2026-001',
    partida: '18/06/2026 07:00',
    chegada: '19/06/2026 19:00',
    transacaoComprometimentoRef: 'TR-2026-047',
  },
  {
    id: 'SD-2026-005',
    iniciativa: 'Conecta Fapes',
    status: 'APROVADA',
    origem: 'Vitória/ES',
    destino: 'Linhares/ES',
    bolsista: 'Diego Rocha',
    quantidade: 1.5,
    valor: 390,
    distancia: '133,86 km',
    tipoDiariaRef: 'DIA-2026-001',
    parametroCalculoDiariaRef: 'PCD-2026-001',
    partida: '18/06/2026 07:00',
    chegada: '19/06/2026 19:00',
    transacaoComprometimentoRef: 'TR-2026-052',
  },
  {
    id: 'SD-2026-001',
    iniciativa: 'Conecta Fapes',
    status: 'ALOCADA',
    origem: 'Vitória/ES',
    destino: 'Cachoeiro de Itapemirim/ES',
    bolsista: 'Marina Costa',
    quantidade: 1.5,
    valor: 390,
    distancia: '143,40 km',
    tipoDiariaRef: 'DIA-2026-001',
    parametroCalculoDiariaRef: 'PCD-2026-001',
    partida: '24/06/2026 06:30',
    chegada: '25/06/2026 18:30',
    transacaoComprometimentoRef: 'TR-2026-044',
  },
  {
    id: 'SD-2026-004',
    iniciativa: 'Rede de sensores para cidades resilientes',
    status: 'RECUSADA',
    origem: 'Vitória/ES',
    destino: 'Cachoeiro de Itapemirim/ES',
    bolsista: 'Juliana Martins',
    quantidade: 1.5,
    valor: 390,
    distancia: '143,40 km',
    tipoDiariaRef: 'DIA-2026-001',
    parametroCalculoDiariaRef: 'PCD-2026-001',
    partida: '28/05/2026 08:00',
    chegada: '29/05/2026 17:00',
    transacaoComprometimentoRef: 'TR-2026-049',
    transacaoReversaoRef: 'TR-2026-050',
    justificativaRecusa: 'Beneficiária recusou a viagem por conflito de agenda acadêmica.',
  },
];

export const Iniciativas: React.FC = () => {
  const [iniciativaSelecionada, setIniciativaSelecionada] = useState<Iniciativa | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<'Todas' | StatusIniciativa>('Todas');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [instituicaoFiltro, setInstituicaoFiltro] = useState('Todas');
  const [showInstituicaoDropdown, setShowInstituicaoDropdown] = useState(false);
  const [busca, setBusca] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('informacoes');
  const [contasBancarias, setContasBancarias] = useState<Record<string, ContaBancariaIniciativa>>(contasIniciais);
  const [contaSalvaCodigo, setContaSalvaCodigo] = useState<string | null>(null);

  const iniciativasFiltradas = useMemo(() => {
    const normalizedBusca = busca.trim().toLowerCase();

    return iniciativas.filter((iniciativa) => {
      const matchStatus = statusFiltro === 'Todas' || iniciativa.status === statusFiltro;
      const matchInstituicao = instituicaoFiltro === 'Todas' || iniciativa.proponente === instituicaoFiltro;
      const matchBusca =
        !normalizedBusca ||
        iniciativa.titulo.toLowerCase().includes(normalizedBusca) ||
        iniciativa.proponente.toLowerCase().includes(normalizedBusca) ||
        iniciativa.coordenador.toLowerCase().includes(normalizedBusca);

      return matchStatus && matchInstituicao && matchBusca;
    });
  }, [busca, instituicaoFiltro, statusFiltro]);

  const instituicaoOptions = useMemo(() => ['Todas', ...Array.from(new Set(iniciativas.map((iniciativa) => iniciativa.proponente)))], []);

  const totalPorStatus = (status: StatusIniciativa) => iniciativas.filter((iniciativa) => iniciativa.status === status).length;
  const contaAtual = iniciativaSelecionada
    ? contasBancarias[iniciativaSelecionada.codigo] ?? emptyContaBancaria
    : emptyContaBancaria;
  const equipeAtual = iniciativaSelecionada
    ? equipesIniciativas[iniciativaSelecionada.titulo] ?? [
        {
          nome: iniciativaSelecionada.coordenador,
          papel: 'Coordenador',
          modalidade: 'Coordenação do projeto',
          vigencia: iniciativaSelecionada.dataInicio !== 'Pendente' ? `${iniciativaSelecionada.dataInicio} - ${iniciativaSelecionada.dataFimVigente}` : 'Pendente',
          status: iniciativaSelecionada.status === 'Suspensa' ? 'Suspenso' : iniciativaSelecionada.status === 'Concluída' ? 'Finalizado' : 'Alocado',
          email: 'coordenador@instituicao.br',
        },
      ]
    : [];
  const updateConta = (field: keyof ContaBancariaIniciativa, value: string) => {
    if (!iniciativaSelecionada) return;
    setContaSalvaCodigo(null);
    setContasBancarias((prev) => ({
      ...prev,
      [iniciativaSelecionada.codigo]: {
        ...(prev[iniciativaSelecionada.codigo] ?? emptyContaBancaria),
        [field]: value,
      },
    }));
  };

  const salvarConta = () => {
    if (!iniciativaSelecionada) return;
    setContaSalvaCodigo(iniciativaSelecionada.codigo);
  };

  const abrirIniciativa = (iniciativa: Iniciativa) => {
    setIniciativaSelecionada(iniciativa);
    setActiveDetailTab('informacoes');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '42px',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--dash-input-bg)',
    border: '1px solid var(--dash-card-border)',
    color: 'var(--dash-text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    padding: '0 12px',
  };

  return (
    <div className="pt-8 px-8 pb-10">
      {!iniciativaSelecionada && (
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: '36px', height: '36px', backgroundColor: 'rgba(0, 193, 175, 0.12)', borderRadius: 'var(--radius)' }}
          >
            <FolderKanban size={20} style={{ color: '#00c1af' }} />
          </div>
          <div className="flex-1" style={{ marginTop: '4px' }}>
            <h1 className="mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: 'var(--dash-text-primary)', lineHeight: '1.5' }}>
              Iniciativas
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
              Consulte as iniciativas submetidas, aprovadas, contratadas e em execução.
            </p>
          </div>
        </div>
        <div className="mt-6" style={{ width: '100%', height: '1px', backgroundColor: 'var(--dash-divider)' }} />
      </div>
      )}

      {iniciativaSelecionada ? (
        <section>
          <nav className="mb-5" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>
            <button
              type="button"
              onClick={() => setIniciativaSelecionada(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--dash-text-secondary)',
                cursor: 'pointer',
              }}
            >
              Iniciativas
            </button>
            <span style={{ color: 'var(--dash-text-muted)', margin: '0 8px' }}>&gt;</span>
            <span style={{ color: 'var(--dash-text-primary)' }}>Detalhe</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-start gap-3">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: '36px', height: '36px', backgroundColor: 'rgba(0, 193, 175, 0.12)', borderRadius: 'var(--radius)' }}
              >
                <FolderKanban size={20} style={{ color: '#00c1af' }} />
              </div>
              <div className="flex-1" style={{ marginTop: '4px' }}>
                <h1 className="mb-2" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: 'var(--dash-text-primary)', lineHeight: '1.5' }}>
                  {iniciativaSelecionada.titulo}
                </h1>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: 0 }}>
                  {iniciativaSelecionada.proponente} · Coordenador: {iniciativaSelecionada.coordenador}
                </p>
              </div>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Seções da iniciativa"
            className="flex flex-wrap items-center mb-8"
            style={{ borderBottom: '1px solid var(--dash-divider)', gap: '4px' }}
          >
            {[
              { key: 'informacoes' as DetailTab, label: 'Informações Gerais' },
              { key: 'equipe' as DetailTab, label: 'Equipe' },
              { key: 'diarias' as DetailTab, label: 'Diárias' },
              { key: 'conta' as DetailTab, label: 'Conta bancária' },
              { key: 'aditivos' as DetailTab, label: 'Dados dos Aditivos' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeDetailTab === key}
                onClick={() => setActiveDetailTab(key)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeDetailTab === key ? '2px solid #00c1af' : '2px solid transparent',
                  color: activeDetailTab === key ? '#00c1af' : 'var(--dash-text-secondary)',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                  padding: '12px 24px',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {activeDetailTab === 'informacoes' && (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Data inicial da iniciativa', value: iniciativaSelecionada.dataInicio, helper: 'Início formal da execução', Icon: PlayCircle },
                { label: 'Data final vigente', value: iniciativaSelecionada.dataFimVigente, helper: `Original: ${iniciativaSelecionada.dataFimOriginal}`, Icon: Clock },
                { label: 'Data de aprovação original', value: iniciativaSelecionada.dataAprovacaoOriginal, helper: 'Aprovação inicial antes de aditivos', Icon: CalendarDays },
                { label: 'Orçamento original', value: iniciativaSelecionada.orcamentoOriginal, helper: 'Valor aprovado na contratação original', Icon: Wallet },
              ].map((card) => (
                <MetricCard key={card.label} {...card} />
              ))}
          </div>

          <SectionHeader Icon={Clock} title="Ciclo de Fomento" subtitle="Acompanhe a jornada consolidada da iniciativa." />

          <div className="rounded-lg p-5 mb-8" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(10, minmax(0, 1fr))', gap: '10px', padding: '16px 6px 8px' }}>
              <div style={{ position: 'absolute', left: '5%', right: '5%', top: '43px', height: '3px', backgroundColor: 'rgba(163, 163, 163, 0.22)', borderRadius: '999px' }} />
              <div style={{ position: 'absolute', left: '5%', width: '50%', top: '43px', height: '3px', backgroundColor: '#14b8a6', borderRadius: '999px' }} />
              {projectStages.map((stage) => {
                const Icon = stage.Icon;
                const isCompleted = stage.status === 'completed';
                const isCurrent = stage.status === 'current';

                return (
                  <div key={stage.label} className="text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <div
                      className="mx-auto flex items-center justify-center rounded-full mb-3"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: isCompleted || isCurrent ? '#22d3ee' : '#1e293b',
                        color: isCompleted || isCurrent ? '#06111f' : 'var(--dash-text-muted)',
                        boxShadow: isCurrent ? '0 0 0 7px rgba(34, 211, 238, 0.18)' : 'none',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <p style={{ color: isCompleted || isCurrent ? 'var(--dash-text-primary)' : 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)', margin: 0, lineHeight: 1.35 }}>
                      {stage.label}
                    </p>
                    {stage.date && (
                      <span style={{ color: 'var(--dash-text-muted)', fontFamily: 'var(--font-family)', fontSize: '11px' }}>{stage.date}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <SectionHeader Icon={Wallet} title="Orçamento por rubrica" subtitle="Total, consumido, alocado e disponível por rubrica da iniciativa." />

          <div className="space-y-4 mb-8">
              {budgetCategories.map(({ name, total, consumido, alocado, disponivel, consumidoPercent, alocadoPercent, Icon, color }) => (
                <article
                  key={name}
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: 'var(--dash-input-bg)',
                    border: '1px solid var(--dash-card-border)',
                  }}
                >
                  <div
                    className="grid grid-cols-1 2xl:grid-cols-[260px_minmax(0,1fr)] gap-5"
                    style={{ alignItems: 'start' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-lg" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(0, 193, 175, 0.12)', color: '#00c1af' }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}>{name}</strong>
                        <span style={{ color: 'var(--dash-text-muted)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
                          {alocado ? 'Possui valor alocado' : 'Sem alocação operacional'}
                        </span>
                      </div>
                    </div>

                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
                      style={{ minWidth: 0 }}
                    >
                      {[
                        { label: 'Total', value: total, percent: 100, metricColor: 'var(--dash-text-primary)' },
                        { label: 'Consumido', value: consumido, percent: consumidoPercent, metricColor: 'var(--dash-text-primary)' },
                        ...(alocado ? [{ label: 'Alocado', value: alocado, percent: alocadoPercent, metricColor: 'var(--dash-text-primary)' }] : []),
                        { label: 'Disponível', value: disponivel, percent: 100 - consumidoPercent - alocadoPercent, metricColor: 'var(--dash-text-primary)' },
                      ].map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-lg px-3 py-2"
                          style={{
                            backgroundColor: 'var(--dash-card-bg)',
                            border: '1px solid var(--dash-card-border)',
                            minWidth: 0,
                          }}
                        >
                          <div style={{ color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)', marginBottom: '4px' }}>{metric.label}</div>
                          <div
                            style={{
                              color: metric.metricColor,
                              fontFamily: 'var(--font-family)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-normal)',
                              lineHeight: 1.35,
                            }}
                          >
                            <span>{metric.value}</span>
                            <span style={{ color: 'var(--dash-text-muted)', margin: '0 6px' }}>·</span>
                            <span>{metric.percent}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(163, 163, 163, 0.24)', borderRadius: '999px', overflow: 'hidden', display: 'flex', marginTop: '14px' }}>
                    <div style={{ width: `${consumidoPercent}%`, height: '100%', backgroundColor: '#14b8a6' }} />
                    {alocado && <div style={{ width: `${alocadoPercent}%`, height: '100%', backgroundColor: 'rgba(20, 184, 166, 0.45)' }} />}
                  </div>
                </article>
              ))}
          </div>

          <SectionHeader
            Icon={Landmark}
            title="Conta Bancária"
            subtitle="Campo administrativo da FAPES para definir a conta de movimentação da iniciativa."
          />

          <div className="rounded-lg p-5 mb-8" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <Field label="Banco" value={contaAtual.banco} onChange={(value) => updateConta('banco', value)} placeholder="Banco responsável" style={inputStyle} />
              <Field label="Agência" value={contaAtual.agencia} onChange={(value) => updateConta('agencia', value)} placeholder="0000" style={inputStyle} />
              <Field label="Conta" value={contaAtual.conta} onChange={(value) => updateConta('conta', value)} placeholder="000000-0" style={inputStyle} />
              <Field label="Tipo da conta" value={contaAtual.tipoConta} onChange={(value) => updateConta('tipoConta', value)} placeholder="Conta corrente" style={inputStyle} />
              <Field label="Titular" value={contaAtual.titular} onChange={(value) => updateConta('titular', value)} placeholder="Nome do titular" style={inputStyle} />
              <Field label="CPF/CNPJ do titular" value={contaAtual.documentoTitular} onChange={(value) => updateConta('documentoTitular', value)} placeholder="00.000.000/0000-00" style={inputStyle} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={salvarConta}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2"
                style={{
                  backgroundColor: '#00c1af',
                  border: '1px solid #00c1af',
                  color: '#06111f',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  cursor: 'pointer',
                }}
              >
                <Save size={16} />
                Salvar conta da iniciativa
              </button>
            </div>
            {contaSalvaCodigo === iniciativaSelecionada.codigo && (
              <p style={{ color: '#22c55e', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', margin: '12px 0 0' }}>
                Conta da iniciativa atualizada nesta sessão.
              </p>
            )}
          </div>
            </>
          )}

          {activeDetailTab === 'aditivos' && (
            <>
          <SectionHeader
            Icon={FileEdit}
            title="Dados dos Aditivos"
            subtitle="Aditivos de prazo ou recurso aprovados para a iniciativa."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {[
                {
                  title: 'TA-2026-014',
                  subtitle: 'Tempo e financeiro · aprovado em 15/02/2026',
                  description: 'Prorrogação da vigência para 31/08/2026 e suplementação de R$ 250.000,00.',
                },
                {
                  title: 'TA-2025-009',
                  subtitle: 'Financeiro · aprovado em 10/09/2025',
                  description: 'Acréscimo financeiro para ampliação de rubricas de execução da iniciativa.',
                },
              ].map((aditivo) => (
                <div key={aditivo.title} className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)' }}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <strong style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>{aditivo.title}</strong>
                    <span className="px-2 py-1 rounded-full" style={{ color: '#00c1af', backgroundColor: 'rgba(0, 193, 175, 0.12)', fontSize: 'var(--text-xs)' }}>Aprovado</span>
                  </div>
                  <p style={{ color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)', margin: '0 0 8px' }}>{aditivo.subtitle}</p>
                  <p style={{ color: 'var(--dash-text-secondary)', fontSize: 'var(--text-sm)', margin: 0, lineHeight: 1.6 }}>{aditivo.description}</p>
                </div>
              ))}
          </div>
            </>
          )}

          {activeDetailTab === 'equipe' && (
            <IniciativaEquipePage membros={equipeAtual} />
          )}

          {activeDetailTab === 'conta' && (
            <>
          <SectionHeader
            Icon={Landmark}
            title="Conta bancária da iniciativa"
            subtitle="Campo administrativo da FAPES para definir a conta de movimentação da iniciativa."
          />

          <div className="rounded-lg p-5 mb-8" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <Field label="Banco" value={contaAtual.banco} onChange={(value) => updateConta('banco', value)} placeholder="Banco responsável" style={inputStyle} />
              <Field label="Agência" value={contaAtual.agencia} onChange={(value) => updateConta('agencia', value)} placeholder="0000" style={inputStyle} />
              <Field label="Conta" value={contaAtual.conta} onChange={(value) => updateConta('conta', value)} placeholder="000000-0" style={inputStyle} />
              <Field label="Tipo da conta" value={contaAtual.tipoConta} onChange={(value) => updateConta('tipoConta', value)} placeholder="Conta corrente" style={inputStyle} />
              <Field label="Titular" value={contaAtual.titular} onChange={(value) => updateConta('titular', value)} placeholder="Nome do titular" style={inputStyle} />
              <Field label="CPF/CNPJ do titular" value={contaAtual.documentoTitular} onChange={(value) => updateConta('documentoTitular', value)} placeholder="00.000.000/0000-00" style={inputStyle} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--dash-divider)' }}>
              <span style={{ color: contaAtual.banco && contaAtual.agencia && contaAtual.conta ? '#00c1af' : 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>
                {contaAtual.banco && contaAtual.agencia && contaAtual.conta ? 'Conta bancária definida para a iniciativa.' : 'Conta bancária ainda pendente de definição.'}
              </span>
              <button
                type="button"
                onClick={salvarConta}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2"
                style={{
                  backgroundColor: '#00c1af',
                  border: '1px solid #00c1af',
                  color: '#06111f',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Save size={16} />
                Salvar conta da iniciativa
              </button>
            </div>
            {contaSalvaCodigo === iniciativaSelecionada.codigo && (
              <p style={{ color: '#22c55e', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', margin: '12px 0 0' }}>
                Conta da iniciativa atualizada nesta sessão.
              </p>
            )}
          </div>
            </>
          )}

          {activeDetailTab === 'diarias' && (
            <IniciativaDiariasPanel iniciativaTitulo={iniciativaSelecionada.titulo} />
          )}
        </section>
      ) : (
        <>
      <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        {[
          { label: 'Submetidas', value: totalPorStatus('Submetida'), status: 'Submetida' as StatusIniciativa },
          { label: 'Aprovadas', value: totalPorStatus('Aprovada'), status: 'Aprovada' as StatusIniciativa },
          { label: 'Em contratação', value: totalPorStatus('Em contratação'), status: 'Em contratação' as StatusIniciativa },
          { label: 'Em execução', value: totalPorStatus('Em execução'), status: 'Em execução' as StatusIniciativa },
          { label: 'Suspensas', value: totalPorStatus('Suspensa'), status: 'Suspensa' as StatusIniciativa },
          { label: 'Finalizadas', value: totalPorStatus('Concluída'), status: 'Concluída' as StatusIniciativa },
          { label: 'Canceladas', value: totalPorStatus('Cancelada'), status: 'Cancelada' as StatusIniciativa },
        ].map(({ label, value, status }) => {
          const { color, bg, Icon } = statusStyle[status];

          return (
            <button
              key={label}
              type="button"
              onClick={() => setStatusFiltro(status)}
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)', cursor: 'pointer', minHeight: '118px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex items-center justify-center rounded-lg" style={{ width: '32px', height: '32px', backgroundColor: bg, flexShrink: 0 }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-secondary)', lineHeight: 1.3 }}>{label}</span>
              </div>
              <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: 'var(--dash-text-primary)' }}>{value}</strong>
            </button>
          );
        })}
      </section>

      <section className="mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)_260px] gap-4">
          <div className="relative flex-1">
            <label style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginBottom: '8px' }}>
              Pesquisar
            </label>
            <Search size={18} style={{ position: 'absolute', right: 12, top: '39px', transform: 'translateY(-50%)', color: 'var(--dash-text-muted)' }} />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar"
              className="w-full rounded-lg"
              style={{
                padding: '10px 40px 10px 12px',
                backgroundColor: 'var(--dash-input-bg)',
                border: '1px solid var(--dash-card-border)',
                color: 'var(--dash-text-primary)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginBottom: '8px' }}>
              Instituições
            </label>
            <button
              type="button"
              onClick={() => {
                setShowInstituicaoDropdown(!showInstituicaoDropdown);
                setShowStatusDropdown(false);
              }}
              className="w-full rounded-lg"
              style={{
                padding: '10px 12px',
                backgroundColor: 'var(--dash-input-bg)',
                border: '1px solid var(--dash-card-border)',
                color: 'var(--dash-text-primary)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{instituicaoFiltro}</span>
              <ChevronDown size={16} style={{ flexShrink: 0, transform: showInstituicaoDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {showInstituicaoDropdown && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', backgroundColor: '#1e293b', border: '1px solid var(--dash-card-border)', borderRadius: 'var(--radius)', overflow: 'hidden', zIndex: 30, boxShadow: '0 12px 28px rgba(0,0,0,0.28)' }}>
                {instituicaoOptions.map((instituicao) => (
                  <button
                    key={instituicao}
                    type="button"
                    onClick={() => {
                      setInstituicaoFiltro(instituicao);
                      setShowInstituicaoDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      backgroundColor: instituicaoFiltro === instituicao ? 'rgba(0, 193, 175, 0.16)' : '#1e293b',
                      color: instituicaoFiltro === instituicao ? '#00c1af' : 'var(--dash-text-primary)',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    {instituicao}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', marginBottom: '8px' }}>
              Status
            </label>
            <button
              type="button"
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowInstituicaoDropdown(false);
              }}
              className="w-full rounded-lg"
              style={{
                padding: '10px 12px',
                backgroundColor: 'var(--dash-input-bg)',
                border: '1px solid var(--dash-card-border)',
                color: 'var(--dash-text-primary)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              {statusFiltro}
              <ChevronDown size={16} style={{ transform: showStatusDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {showStatusDropdown && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%', backgroundColor: '#1e293b', border: '1px solid var(--dash-card-border)', borderRadius: 'var(--radius)', overflow: 'hidden', zIndex: 30, boxShadow: '0 12px 28px rgba(0,0,0,0.28)' }}>
                {filtros.map((filtro) => (
                  <button
                    key={filtro}
                    type="button"
                    onClick={() => {
                      setStatusFiltro(filtro);
                      setShowStatusDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      backgroundColor: statusFiltro === filtro ? 'rgba(0, 193, 175, 0.16)' : '#1e293b',
                      color: statusFiltro === filtro ? '#00c1af' : 'var(--dash-text-primary)',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    {filtro}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {iniciativasFiltradas.map((iniciativa) => {
          const { color, bg, Icon } = statusStyle[iniciativa.status];

          return (
            <article
              key={iniciativa.codigo}
              className="rounded-lg"
              role="button"
              tabIndex={0}
              onClick={() => abrirIniciativa(iniciativa)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  abrirIniciativa(iniciativa);
                }
              }}
              style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)', cursor: 'pointer', padding: '18px 20px' }}
            >
              <div className="grid grid-cols-1 xl:grid-cols-[2fr_1.5fr_1.1fr_1fr_1fr_40px] gap-5 items-center">
                <div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>Iniciativa</p>
                  <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                    {iniciativa.titulo}
                  </strong>
                </div>

                <div>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>Instituição</p>
                  <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', fontWeight: 'var(--font-weight-normal)' }}>{iniciativa.proponente}</strong>
                </div>

                <div style={{ paddingLeft: '24px' }}>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>Coordenador</p>
                  <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', fontWeight: 'var(--font-weight-normal)' }}>{iniciativa.coordenador}</strong>
                </div>

                <div style={{ paddingLeft: '24px' }}>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>Submissão</p>
                  <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', fontWeight: 'var(--font-weight-normal)' }}>{iniciativa.dataSubmissao}</strong>
                </div>

                <div style={{ paddingLeft: '24px' }}>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>Status</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full" style={{ backgroundColor: bg, border: `1px solid ${color}`, color, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
                    {iniciativa.status}
                  </span>
                </div>

                <ChevronDown size={18} style={{ color: 'var(--dash-text-muted)', transform: 'rotate(-90deg)' }} />
              </div>
            </article>
          );
        })}
      </section>
        </>
      )}
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)', margin: '0 0 5px' }}>{label}</p>
    <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)' }}>{value}</strong>
  </div>
);

const SectionHeader: React.FC<{
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  subtitle: string;
}> = ({ Icon, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-4">
    <div
      className="flex items-center justify-center rounded-lg"
      style={{
        width: '36px',
        height: '36px',
        backgroundColor: 'rgba(0, 193, 175, 0.12)',
        color: '#00c1af',
        flexShrink: 0,
      }}
    >
      <Icon size={20} />
    </div>
    <div>
      <h2 style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)', margin: '0 0 5px' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', margin: 0 }}>
        {subtitle}
      </p>
    </div>
  </div>
);

const MetricCard: React.FC<{
  label: string;
  value: string;
  helper: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}> = ({ label, value, helper, Icon }) => (
  <div
    className="rounded-lg p-4"
    style={{
      backgroundColor: 'var(--dash-card-bg)',
      border: '1px solid var(--dash-card-border)',
      boxShadow: 'var(--dash-shadow)',
    }}
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <span style={{ color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>{label}</span>
      <Icon size={18} style={{ color: '#00c1af', flexShrink: 0 }} />
    </div>
    <strong style={{ display: 'block', color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-normal)', marginBottom: '6px' }}>
      {value}
    </strong>
    <p style={{ color: 'var(--dash-text-muted)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', lineHeight: 1.5, margin: 0 }}>
      {helper}
    </p>
  </div>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  style: React.CSSProperties;
}> = ({ label, value, onChange, placeholder, style }) => (
  <label style={{ display: 'block', color: 'var(--dash-text-muted)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
    {label}
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={{ ...style, marginTop: '8px' }}
    />
  </label>
);

const IniciativaDiariasPanel: React.FC<{ iniciativaTitulo: string }> = ({ iniciativaTitulo }) => {
  const [activeDiariaTab, setActiveDiariaTab] = useState<DiariaPanelTab>('solicitadas');
  const rubricas = rubricasDiariasPainel[iniciativaTitulo] ?? [
    {
      codigo: 'DIA-2026-001',
      nome: 'Diária dentro do Estado',
      tipoViagem: 'Dentro do Estado',
      diariaVigente: 'R$ 260,00 · fração 12h',
      total: 0,
      alocado: 0,
      utilizado: 0,
      saldo: 0,
      aceitesPendentes: 0,
    },
  ];
  const [tipoViagem, setTipoViagem] = useState(rubricas[0]?.tipoViagem ?? 'Dentro do Estado');
  const [partida, setPartida] = useState('24/06/2026 06:30');
  const [chegada, setChegada] = useState('25/06/2026 18:30');
  const [origem, setOrigem] = useState('Vitória/ES');
  const [destino, setDestino] = useState('Cachoeiro de Itapemirim/ES');
  const [bolsista, setBolsista] = useState('Marina Costa');
  const solicitacoes = diariasPainelSolicitacoes.filter((item) => item.iniciativa === iniciativaTitulo);
  const totalComprometido = solicitacoes
    .filter((item) => item.status === 'ALOCADA' || item.status === 'APROVADA')
    .reduce((total, item) => total + item.valor, 0);
  const minhasDiarias = solicitacoes.filter((item) => item.bolsista === 'Marina Costa');
  const rubricaSelecionada = rubricas.find((rubrica) => rubrica.tipoViagem === tipoViagem) ?? rubricas[0];
  const valorEstimado = tipoViagem === 'Fora do País' ? 1240 : tipoViagem === 'Fora do Estado' ? 520 : 390;
  const distanciaAutomatica = tipoViagem === 'Dentro do Estado' ? '143,40 km' : 'Não aplicada';

  const statusLabel = (status: StatusPainelDiaria) => {
    const labels: Record<StatusPainelDiaria, string> = {
      ALOCADA: 'Alocada',
      APROVADA: 'Aprovada',
      CANCELADA: 'Cancelada',
      RECUSADA: 'Recusada',
    };

    return labels[status];
  };

  const renderSolicitacoes = (items: DiariaPainelSolicitacao[]) => (
    <div className="space-y-3">
      {items.map((solicitacao) => (
        <article
          key={`${solicitacao.id}-${solicitacao.bolsista}`}
          className="p-5"
          style={{
            backgroundColor: 'var(--dash-card-bg)',
            border: '1px solid var(--dash-card-border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--dash-shadow)',
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span style={{ color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)' }}>Solicitação</span>
                  <strong style={{ color: 'var(--dash-text-primary)', fontSize: 'var(--text-base)' }}>{solicitacao.id}</strong>
                  <span
                    className="px-2 py-1"
                    style={{
                      borderRadius: '999px',
                      backgroundColor: solicitacao.status === 'CANCELADA' || solicitacao.status === 'RECUSADA' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 193, 175, 0.12)',
                      color: solicitacao.status === 'CANCELADA' || solicitacao.status === 'RECUSADA' ? '#ef4444' : '#00c1af',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                    }}
                  >
                    {statusLabel(solicitacao.status)}
                  </span>
                </div>
                <p style={{ color: 'var(--dash-text-secondary)', fontSize: 'var(--text-sm)', margin: '8px 0 0', overflowWrap: 'anywhere' }}>
                  {solicitacao.origem} <span aria-hidden="true">→</span> {solicitacao.destino}
                </p>
              </div>

              {(solicitacao.transacaoComprometimentoRef || solicitacao.transacaoReversaoRef) && (
                <div
                  className="px-3 py-2"
                  style={{
                    border: '1px solid var(--dash-card-border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--dash-text-secondary)',
                    fontSize: 'var(--text-xs)',
                    lineHeight: 1.5,
                  }}
                >
                  {solicitacao.transacaoComprometimentoRef && (
                    <span>Comprometimento: <strong style={{ color: 'var(--dash-text-primary)' }}>{solicitacao.transacaoComprometimentoRef}</strong></span>
                  )}
                  {solicitacao.transacaoReversaoRef && (
                    <span>{solicitacao.transacaoComprometimentoRef ? ' · ' : ''}Reversão: <strong style={{ color: 'var(--dash-text-primary)' }}>{solicitacao.transacaoReversaoRef}</strong></span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3" style={{ color: 'var(--dash-text-primary)', fontSize: 'var(--text-sm)' }}>
              {[
                { label: 'Bolsista', value: solicitacao.bolsista },
                { label: 'Diárias', value: solicitacao.quantidade.toLocaleString('pt-BR') },
                { label: 'Valor', value: currency.format(solicitacao.valor) },
                { label: 'Distância', value: solicitacao.distancia },
                { label: 'Cadastro/Parâmetro', value: `${solicitacao.tipoDiariaRef} · ${solicitacao.parametroCalculoDiariaRef}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 p-3"
                  style={{
                    border: '1px solid var(--dash-card-border)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--dash-input-bg)',
                  }}
                >
                  <span className="block" style={{ color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)' }}>{item.label}</span>
                  <strong className="block mt-1" style={{ color: 'var(--dash-text-primary)', fontSize: 'var(--text-sm)', lineHeight: 1.45, overflowWrap: 'anywhere' }}>
                    {item.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {solicitacao.justificativaRecusa && (
            <p style={{ color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)', margin: '12px 0 0' }}>
              Recusa do bolsista: {solicitacao.justificativaRecusa}
            </p>
          )}
        </article>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2" style={{ color: '#00c1af', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0, 193, 175, 0.12)' }}>
          <PlaneTakeoff size={20} />
        </div>
        <h2 style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', margin: 0 }}>Painel de Diárias</h2>
      </div>
      <p style={{ color: 'var(--dash-text-secondary)', fontSize: 'var(--text-sm)', margin: '0 0 24px 48px' }}>
        Controle solicitações, aceites e remoções de diárias da iniciativa.
      </p>

      <section
        className="mb-6 p-5"
        style={{
          backgroundColor: 'var(--dash-card-bg)',
          border: '1px solid var(--dash-card-border)',
          borderLeft: '3px solid #00c1af',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--dash-shadow)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="flex items-start gap-3">
            <div className="p-2" style={{ color: '#00c1af', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0, 193, 175, 0.12)' }}>
              <PlaneTakeoff size={20} />
            </div>
            <div>
              <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 'var(--text-base)', margin: '0 0 6px' }}>Painel de controle</h3>
              <p style={{ color: 'var(--dash-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: 0 }}>
                O coordenador solicita diárias quando há saldo na rubrica, acompanha os termos de aceite dos bolsistas e visualiza as transações.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveDiariaTab('nova')}
            className="px-4 py-2 flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#00c1af',
              color: '#06111f',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Nova solicitação
          </button>
        </div>

        <div className="mt-5 overflow-x-auto" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)', borderRadius: 'var(--radius)' }}>
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', color: 'var(--dash-text-primary)', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--dash-card-border)' }}>
                {['Rubrica', 'Total', 'Alocado', 'Utilizado', 'Saldo', 'Aceites pendentes'].map((header) => (
                  <th key={header} style={{ padding: '12px 14px', textAlign: header === 'Rubrica' ? 'left' : 'right', color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rubricas.map((rubrica) => (
                <tr key={rubrica.codigo}>
                  <td style={{ padding: '14px', verticalAlign: 'top', borderBottom: '1px solid var(--dash-card-border)' }}>
                    <strong style={{ display: 'block', color: 'var(--dash-text-primary)', fontSize: 'var(--text-sm)' }}>{rubrica.nome}</strong>
                    <span style={{ color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)' }}>{rubrica.codigo}</span>
                    <span style={{ display: 'block', color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)', marginTop: '6px' }}>
                      Tipo de viagem: {rubrica.tipoViagem} · {rubrica.diariaVigente}
                    </span>
                  </td>
                  {[
                    currency.format(rubrica.total),
                    currency.format(rubrica.alocado),
                    currency.format(rubrica.utilizado),
                    currency.format(rubrica.saldo),
                    String(rubrica.aceitesPendentes),
                  ].map((value, index) => (
                    <td key={`${rubrica.codigo}-${index}`} style={{ padding: '14px', textAlign: 'right', verticalAlign: 'top', borderBottom: '1px solid var(--dash-card-border)', fontWeight: 700, color: index === 3 ? '#22d3ee' : 'var(--dash-text-primary)' }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-1 mb-6" style={{ borderBottom: '1px solid var(--dash-divider)' }}>
        {[
          { key: 'solicitadas' as DiariaPanelTab, label: 'Diárias Solicitadas' },
          { key: 'nova' as DiariaPanelTab, label: 'Nova Solicitação' },
          { key: 'minhas' as DiariaPanelTab, label: 'Minhas Diárias' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveDiariaTab(tab.key)}
            style={{
              padding: '10px 16px',
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: activeDiariaTab === tab.key ? '2px solid #00c1af' : '2px solid transparent',
              color: activeDiariaTab === tab.key ? '#00c1af' : 'var(--dash-text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeDiariaTab === 'solicitadas' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Solicitadas', value: String(solicitacoes.length), color: 'var(--dash-text-primary)' },
              { label: 'Aprovadas', value: String(solicitacoes.filter((item) => item.status === 'APROVADA').length), color: '#00c1af' },
              { label: 'Comprometido', value: currency.format(totalComprometido), color: '#22d3ee' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
                <p style={{ color: 'var(--dash-text-secondary)', fontSize: 'var(--text-sm)', margin: '0 0 8px' }}>{metric.label}</p>
                <strong style={{ color: metric.color, fontSize: 'var(--text-lg)' }}>{metric.value}</strong>
              </div>
            ))}
          </div>
          {renderSolicitacoes(solicitacoes)}
        </>
      )}

      {activeDiariaTab === 'minhas' && renderSolicitacoes(minhasDiarias.length ? minhasDiarias : solicitacoes.slice(0, 1))}

      {activeDiariaTab === 'nova' && (
        <section className="p-5 mb-8" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', borderLeft: '3px solid #00c1af', borderRadius: 'var(--radius)', boxShadow: 'var(--dash-shadow)' }}>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-3">
              <PlaneTakeoff size={20} style={{ color: '#00c1af', marginTop: '2px' }} />
              <div>
                <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 'var(--text-base)', margin: '0 0 6px' }}>Solicitação de Diárias</h3>
                <p style={{ color: 'var(--dash-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  Rubrica: {rubricaSelecionada?.nome ?? 'Diárias'} · {rubricaSelecionada?.diariaVigente ?? 'Valor vigente'}
                </p>
              </div>
            </div>
            <Wallet size={20} style={{ color: 'var(--dash-text-muted)', flexShrink: 0 }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <SelectFilter label="Tipo de viagem" value={tipoViagem} options={rubricas.map((item) => item.tipoViagem)} onChange={setTipoViagem} />
            <Field label="Partida" value={partida} onChange={setPartida} placeholder="Data e hora" style={formInputStyle} />
            <Field label="Chegada" value={chegada} onChange={setChegada} placeholder="Data e hora" style={formInputStyle} />
            <SelectFilter label="Origem" value={origem} options={['Vitória/ES', 'Anchieta/ES', 'Linhares/ES']} onChange={setOrigem} />
            <SelectFilter label="Destino" value={destino} options={['Cachoeiro de Itapemirim/ES', 'Linhares/ES', '(Fora do Estado)', '(Fora do País)']} onChange={setDestino} />
            <SelectFilter label="Bolsista" value={bolsista} options={['Marina Costa', 'Carla Nunes', 'Diego Rocha', 'Juliana Martins']} onChange={setBolsista} />
          </div>

          <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Info label="Distância automática" value={distanciaAutomatica} />
              <Info label="Diárias calculadas" value={tipoViagem === 'Dentro do Estado' ? '1,5' : '1'} />
              <Info label="Valor estimado" value={currency.format(valorEstimado)} />
              <Info label="Saldo após solicitação" value={currency.format(Math.max((rubricaSelecionada?.saldo ?? 0) - valorEstimado, 0))} />
            </div>
          </div>

          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2" style={{ backgroundColor: '#00c1af', color: '#06111f', border: 'none', fontSize: 'var(--text-sm)', fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={16} />
            Criar solicitação
          </button>
        </section>
      )}
    </>
  );
};

const formInputStyle: React.CSSProperties = {
  width: '100%',
  height: '42px',
  borderRadius: 'var(--radius)',
  backgroundColor: 'var(--dash-input-bg)',
  border: '1px solid var(--dash-card-border)',
  color: 'var(--dash-text-primary)',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  padding: '0 12px',
};

const statusEquipeStyle: Record<MembroEquipeIniciativa['status'], { color: string; bg: string; border: string }> = {
  Ativo: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.10)', border: 'rgba(34, 197, 94, 0.30)' },
  Alocado: { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.30)' },
  Finalizado: { color: '#a3a3a3', bg: 'rgba(163, 163, 163, 0.12)', border: 'rgba(163, 163, 163, 0.28)' },
  Suspenso: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.30)' },
};

const IniciativaEquipePage: React.FC<{ membros: MembroEquipeIniciativa[] }> = ({ membros }) => {
  const [activeTeamTab, setActiveTeamTab] = useState<'informacoes' | 'bolsistas'>('informacoes');
  const [search, setSearch] = useState('');
  const [modalidade, setModalidade] = useState('Todos');
  const [status, setStatus] = useState('Todos');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const bolsistas = membros.filter((membro) => membro.papel === 'Bolsista');
  const modalidades = ['Todos', ...Array.from(new Set(bolsistas.map((membro) => membro.modalidade)))];
  const statuses = ['Todos', ...Array.from(new Set(membros.map((membro) => membro.status)))];
  const filteredMembers = membros.filter((membro) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [membro.nome, membro.email, membro.modalidade, membro.papel].join(' ').toLowerCase().includes(query);
    const matchesModalidade = modalidade === 'Todos' || membro.modalidade === modalidade;
    const matchesStatus = status === 'Todos' || membro.status === status;

    return matchesSearch && matchesModalidade && matchesStatus;
  });

  const modalidadesResumo = modalidades
    .filter((item) => item !== 'Todos')
    .map((item) => {
      const total = bolsistas.filter((membro) => membro.modalidade === item).length;
      const usadas = bolsistas.filter((membro) => membro.modalidade === item && (membro.status === 'Ativo' || membro.status === 'Finalizado')).length;
      const percent = total > 0 ? Math.round((usadas / total) * 100) : 0;

      return { name: item, total, usadas, disponiveis: Math.max(total - usadas, 0), percent };
    });

  return (
    <>
      <SectionHeader
        Icon={Users}
        title="Equipe"
        subtitle="Acompanhe as informações dos bolsistas da iniciativa."
      />

      <div className="flex gap-1 mb-6" style={{ borderBottom: '1px solid var(--dash-divider)' }}>
        {[
          { key: 'informacoes' as const, label: 'Informações das Bolsas' },
          { key: 'bolsistas' as const, label: 'Bolsistas do Projeto' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTeamTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTeamTab === tab.key ? '2px solid #00c1af' : '2px solid transparent',
              color: activeTeamTab === tab.key ? '#00c1af' : 'var(--dash-text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              marginBottom: '-1px',
              padding: '10px 16px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTeamTab === 'informacoes' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
              <p style={{ color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', margin: '0 0 14px' }}>Orçamento</p>
              {[
                { label: 'Total', value: 'R$ 300.000' },
                { label: 'Utilizado', value: 'R$ 175.000' },
                { label: 'Disponível', value: 'R$ 125.000,00', color: '#22d3ee' },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: '12px' }}>
                  <div style={{ color: 'var(--dash-text-muted)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>{item.label}</div>
                  <strong style={{ color: item.color ?? 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>{item.value}</strong>
                </div>
              ))}
            </div>

            {[
              { label: 'Ativas', value: bolsistas.filter((membro) => membro.status === 'Ativo').length || 60 },
              { label: 'Alocadas', value: bolsistas.length || 82 },
              { label: 'Utilizadas', value: bolsistas.filter((membro) => membro.status === 'Finalizado').length || 68 },
              { label: 'Disponíveis', value: 14 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg p-5"
                style={{
                  backgroundColor: 'var(--dash-card-bg)',
                  border: '1px solid var(--dash-card-border)',
                  boxShadow: 'var(--dash-shadow)',
                  minHeight: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', margin: 0 }}>{item.label}</p>
                <strong style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-3xl)' }}>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 mb-8">
            <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
              <h3 style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', margin: '0 0 6px' }}>Bolsas por Modalidade</h3>
              <p style={{ color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', margin: '0 0 20px' }}>Quantidade alocada vs utilizada por tipo de bolsa.</p>
              <div className="space-y-4">
                {(modalidadesResumo.length ? modalidadesResumo : [{ name: 'BPIG-VII', total: 4, usadas: 2, disponiveis: 2, percent: 50 }]).map((item) => (
                  <div key={item.name}>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div>
                        <strong style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>{item.name}</strong>
                        <div style={{ color: 'var(--dash-text-muted)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>{item.usadas} de {item.total} utilizadas</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.disponiveis > 0 && (
                          <span className="px-2 py-1 rounded-full" style={{ color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', fontSize: 'var(--text-xs)' }}>
                            {item.disponiveis} disponíveis
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-full" style={{ color: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.12)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                          {item.percent}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--dash-muted)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: '#60a5fa' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
              <h3 style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-base)', margin: '0 0 6px' }}>Quantidade de Bolsas</h3>
              <p style={{ color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', margin: '0 0 18px' }}>Resumo operacional da equipe.</p>
              {[
                { label: 'Coordenadores', value: membros.filter((membro) => membro.papel.includes('Coordenador')).length, Icon: UserCheck },
                { label: 'Bolsistas', value: bolsistas.length, Icon: GraduationCap },
                { label: 'Pendentes/Alocados', value: membros.filter((membro) => membro.status === 'Alocado').length, Icon: Clock },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--dash-divider)' }}>
                  <div className="flex items-center gap-3">
                    <item.Icon size={18} style={{ color: '#00c1af' }} />
                    <span style={{ color: 'var(--dash-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>{item.label}</span>
                  </div>
                  <strong style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)' }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTeamTab === 'bolsistas' && (
        <>
          <div className="rounded-lg p-5 mb-5" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px_180px] gap-4">
              <label style={{ color: 'var(--dash-text-muted)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
                Pesquisar
                <div style={{ position: 'relative', marginTop: '8px' }}>
                  <Search size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--dash-text-muted)' }} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar"
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--dash-input-bg)',
                      border: '1px solid var(--dash-card-border)',
                      color: 'var(--dash-text-primary)',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                      padding: '0 38px 0 12px',
                    }}
                  />
                </div>
              </label>

              <SelectFilter label="Modalidade" value={modalidade} options={modalidades} onChange={setModalidade} />
              <SelectFilter label="Status" value={status} options={statuses} onChange={setStatus} />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {filteredMembers.map((membro) => {
              const statusStyle = statusEquipeStyle[membro.status];
              const isExpanded = expandedMember === membro.nome;

              return (
                <article key={`${membro.nome}-${membro.email}`} className="rounded-lg" style={{ backgroundColor: 'var(--dash-card-bg)', border: '1px solid var(--dash-card-border)', boxShadow: 'var(--dash-shadow)' }}>
                  <button
                    type="button"
                    onClick={() => setExpandedMember(isExpanded ? null : membro.nome)}
                    className="w-full p-5 text-left"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[32px_minmax(0,1fr)_140px_160px_170px_130px] gap-4 items-center">
                      <ChevronDown size={16} style={{ color: 'var(--dash-text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 160ms ease' }} />
                      <div>
                        <div style={{ color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)', marginBottom: '6px' }}>Nome</div>
                        <strong style={{ color: 'var(--dash-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>{membro.nome}</strong>
                      </div>
                      <Info label="Início" value={membro.inicio ?? membro.vigencia.split(' - ')[0] ?? 'Pendente'} />
                      <Info label="Término" value={membro.termino ?? membro.vigencia.split(' - ')[1] ?? 'Pendente'} />
                      <Info label="Modalidade" value={membro.modalidade} />
                      <div>
                        <div style={{ color: 'var(--dash-text-muted)', fontSize: 'var(--text-xs)', marginBottom: '6px' }}>Status</div>
                        <span className="inline-flex px-3 py-1 rounded-full" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.border}`, fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                          {membro.status}
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5">
                      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--dash-input-bg)', border: '1px solid var(--dash-card-border)' }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Info label="Papel" value={membro.papel} />
                          <Info label="E-mail" value={membro.email} />
                          <Info label="Telefone" value={membro.telefone ?? 'Não informado'} />
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

const SelectFilter: React.FC<{ label: string; value: string; options: string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label style={{ color: 'var(--dash-text-muted)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
    {label}
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        width: '100%',
        height: '42px',
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--dash-input-bg)',
        border: '1px solid var(--dash-card-border)',
        color: 'var(--dash-text-primary)',
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--text-sm)',
        marginTop: '8px',
        outline: 'none',
        padding: '0 12px',
      }}
    >
      {options.map((option) => (
        <option key={option} value={option} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>{option}</option>
      ))}
    </select>
  </label>
);
