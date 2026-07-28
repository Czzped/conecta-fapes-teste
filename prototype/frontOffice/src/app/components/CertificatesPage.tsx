import {
  Banknote,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CircleDollarSign,
  Coins,
  Edit2,
  FileText,
  Hotel,
  MapPin,
  Paperclip,
  PiggyBank,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  Search,
  Send,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown } from '@/app/components/Dropdown';
import { ListPagination } from '@/app/components/ListPagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';

type DocumentoSolicitacao = 'declaracao' | 'informe' | 'termo' | null;
type StatusDiaria = 'RASCUNHO' | 'ALOCADA' | 'APROVADA' | 'CANCELADA' | 'RECUSADA';
type EstadoAceiteDiaria = 'PENDENTE' | 'ASSINADO' | 'RECUSADO' | 'CANCELADO';
type DiariaTab = 'solicitadas' | 'nova' | 'minhas';
type AccessType = 'cidadao' | 'voluntario' | 'bolsista' | 'bolsistaSolicitarBolsa' | 'proponente' | 'coordenador' | 'diretor' | 'reitor';
type TipoDiariaCodigo = 'NACIONAL' | 'INTERNACIONAL';
type TipoViagemCodigo = 'DENTRO_ESTADO' | 'FORA_ESTADO' | 'INTERNACIONAL';
type OrdenacaoDataPartida = 'RECENTE' | 'ANTIGA';
type DiariaBeneficiarioItem = DiariaRequest & {
  beneficiario: string;
  beneficiarioIndex: number;
  valorBeneficiario: number;
};

interface CertificatesPageProps {
  accessType?: AccessType;
  initialFlow?: 'diarias' | null;
  initialDiariaTab?: DiariaTab;
  onNavigate?: (page: string) => void;
}

interface AlocacaoBolsistaProjeto {
  ref: string;
  nome: string;
  papel: 'BOLSISTA' | 'COORDENADOR_BOLSISTA';
}

interface DiariaRequest {
  id: string;
  alocacaoBolsistaRef: string;
  bolsistaNome: string;
  partida: string;
  chegada: string;
  origem: string;
  destino: string;
  distanciaKm: number;
  deslocamentoRegiaoMetropolitana: boolean;
  municipioLimitrofe: boolean;
  transporteCusteadoOutraEntidade: boolean;
  hospedagemCusteadaOutraEntidade: boolean;
  alimentacaoCusteadaOutraEntidade: boolean;
  motivo: string;
  status: StatusDiaria;
  estadoAceite: EstadoAceiteDiaria;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  tipoDiariaRef: string;
  parametroCalculoDiariaRef: string;
  tipoDiaria: TipoDiariaCodigo;
  tipoViagem: TipoViagemCodigo;
  regraCalculo: string;
  memoriaCalculoSnapshot?: string;
  transacaoComprometimentoRef?: string;
  transacaoReversaoRef?: string;
  justificativaCancelamento?: string;
  justificativaRecusa?: string;
  comprovacaoAtividade?: {
    descricao: string;
    anexos: string[];
  };
}

const coordenadorAtual = 'Mariana Costa';
const bolsistaAtual = 'Ana Souza';
const bolsistaMinhasDiarias = 'Paulo Sergio Souza Junior';
const alocacoesDoProjeto: AlocacaoBolsistaProjeto[] = [
  { ref: 'ALO-2026-COORD-001', nome: coordenadorAtual, papel: 'COORDENADOR_BOLSISTA' },
  { ref: 'ALO-2026-001', nome: 'Ana Souza', papel: 'BOLSISTA' },
  { ref: 'ALO-2026-002', nome: 'Bruno Lima', papel: 'BOLSISTA' },
  { ref: 'ALO-2026-003', nome: 'Carla Nunes', papel: 'BOLSISTA' },
  { ref: 'ALO-2026-004', nome: 'Diego Rocha', papel: 'BOLSISTA' },
  { ref: 'ALO-2026-005', nome: 'Fernanda Alves', papel: 'BOLSISTA' },
  { ref: 'ALO-2026-006', nome: 'João Pedro Martins', papel: 'BOLSISTA' },
  { ref: 'ALO-2026-007', nome: bolsistaMinhasDiarias, papel: 'BOLSISTA' },
];
const beneficiariosDoProjeto = alocacoesDoProjeto.map((alocacao) => alocacao.nome);
const orcamentosRubricasDiarias: Record<TipoViagemCodigo, number> = {
  DENTRO_ESTADO: 5000,
  FORA_ESTADO: 3000,
  INTERNACIONAL: 2000,
};
const tiposDiaria = [
  { codigo: 'NACIONAL' as const, nome: 'Nacional', regra: 'Normativa FAPES', descricao: 'Diária por pernoite, meia diária para afastamento sem pernoite igual ou superior a 6h e meia adicional no retorno após 14h.' },
  { codigo: 'INTERNACIONAL' as const, nome: 'Internacional', regra: 'Normativa FAPES', descricao: 'Diária por pernoite, meia diária para afastamento sem pernoite igual ou superior a 6h e meia adicional no retorno após 14h.' },
];
const tiposViagem = [
  { codigo: 'DENTRO_ESTADO' as const, nome: 'Dentro do Estado', rubrica: 'Diária dentro do Estado', abrangencia: 'Nacional', referencia: 'RUB-DIA-DE' },
  { codigo: 'FORA_ESTADO' as const, nome: 'Nacional', rubrica: 'Diária nacional', abrangencia: 'Nacional', referencia: 'RUB-DIA-NAC' },
  { codigo: 'INTERNACIONAL' as const, nome: 'Internacional', rubrica: 'Diária internacional', abrangencia: 'Internacional', referencia: 'RUB-DIA-INT' },
];
const diariasVigentes = [
  { referencia: 'DIA-2026-001', parametroRef: 'PCD-2026-001', tipoViagem: 'DENTRO_ESTADO' as const, valor: 260, fracaoCalculo: '12h', vigenciaInicio: '05/01/2026' },
  { referencia: 'DIA-2026-002', parametroRef: 'PCD-2026-002', tipoViagem: 'FORA_ESTADO' as const, valor: 320, fracaoCalculo: '12h', vigenciaInicio: '05/01/2026' },
  { referencia: 'DIA-2026-003', parametroRef: 'PCD-2026-003', tipoViagem: 'INTERNACIONAL' as const, valor: 620, fracaoCalculo: '24h', vigenciaInicio: '05/01/2026' },
];

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const municipiosEsDiaria = [
  { id: 77, nome: 'Vitória/ES', distanciaCapitalKm: 0 },
  { id: 42, nome: 'Linhares/ES', distanciaCapitalKm: 133.86 },
  { id: 15, nome: 'Cachoeiro de Itapemirim/ES', distanciaCapitalKm: 143.4 },
  { id: 69, nome: 'Serra/ES', distanciaCapitalKm: 26.22 },
  { id: 76, nome: 'Vila Velha/ES', distanciaCapitalKm: 6.4 },
];
const origensDiaria = municipiosEsDiaria.map((municipio) => municipio.nome);
const destinosDiaria = [
  ...municipiosEsDiaria.map((municipio) => ({
    value: municipio.nome,
    label: municipio.nome,
    tipoViagem: 'DENTRO_ESTADO' as const,
    grupo: 'Dentro do Estado',
  })),
  { value: '(Fora do Estado)', label: '(Fora do Estado)', tipoViagem: 'FORA_ESTADO' as const, grupo: 'Opções especiais' },
  { value: 'São Paulo/SP', label: 'São Paulo/SP', tipoViagem: 'FORA_ESTADO' as const, grupo: 'Fora do Estado' },
  { value: 'Brasília/DF', label: 'Brasília/DF', tipoViagem: 'FORA_ESTADO' as const, grupo: 'Fora do Estado' },
  { value: 'Rio de Janeiro/RJ', label: 'Rio de Janeiro/RJ', tipoViagem: 'FORA_ESTADO' as const, grupo: 'Fora do Estado' },
  { value: '(Fora do País)', label: '(Fora do País)', tipoViagem: 'INTERNACIONAL' as const, grupo: 'Opções especiais' },
  { value: 'Lisboa/Portugal', label: 'Lisboa/Portugal', tipoViagem: 'INTERNACIONAL' as const, grupo: 'Fora do País' },
  { value: 'Buenos Aires/Argentina', label: 'Buenos Aires/Argentina', tipoViagem: 'INTERNACIONAL' as const, grupo: 'Fora do País' },
];

const gruposDestinoDiaria = ['Opções especiais', 'Dentro do Estado', 'Fora do Estado', 'Fora do País'];

const distanciasRodoviariasMockKm: Record<string, number> = {
  'Vitória/ES|Linhares/ES': 133.86,
  'Vitória/ES|Cachoeiro de Itapemirim/ES': 143.4,
  'Vitória/ES|Serra/ES': 26.22,
  'Vitória/ES|Vila Velha/ES': 6.4,
  'Linhares/ES|Cachoeiro de Itapemirim/ES': 270.5,
  'Linhares/ES|Serra/ES': 108.7,
  'Linhares/ES|Vila Velha/ES': 140.9,
  'Cachoeiro de Itapemirim/ES|Serra/ES': 167.8,
  'Cachoeiro de Itapemirim/ES|Vila Velha/ES': 137.2,
  'Serra/ES|Vila Velha/ES': 34.1,
};

const municipiosRegiaoMetropolitana = new Set(['Vitória/ES', 'Serra/ES', 'Vila Velha/ES']);
const paresMunicipiosLimitrofes = new Set([
  'Serra/ES|Vitória/ES',
  'Vila Velha/ES|Vitória/ES',
]);

const mensagemDistanciaMinimaDiaria = 'A distância mínima para solicitar uma Diária é de 150km';

function normalizarParLocalidades(origem: string, destino: string) {
  return [origem, destino].sort((a, b) => a.localeCompare(b, 'pt-BR')).join('|');
}

function calcularIndicadoresTerritoriais(origem: string, destino: string, usaDistancia: boolean) {
  if (!usaDistancia || origem === destino) {
    return {
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
    };
  }

  return {
    deslocamentoRegiaoMetropolitana: municipiosRegiaoMetropolitana.has(origem) && municipiosRegiaoMetropolitana.has(destino),
    municipioLimitrofe: paresMunicipiosLimitrofes.has(normalizarParLocalidades(origem, destino)),
  };
}

function buscarDistanciaRodoviaria(origem: string, destino: string) {
  if (origem === destino) return { distanciaKm: 0, origemCalculo: 'MESMA_LOCALIDADE' as const };

  const distanciaKm =
    distanciasRodoviariasMockKm[`${origem}|${destino}`] ??
    distanciasRodoviariasMockKm[`${destino}|${origem}`] ??
    0;

  return {
    distanciaKm,
    origemCalculo: distanciaKm ? 'TABELA_MEMORIA' as const : 'NAO_ENCONTRADA' as const,
  };
}

interface CalculoDiariaPreview {
  quantidade: number;
  bloqueado: boolean;
  motivoBloqueio: string;
  memoria: string;
}

function calcularDiarias(
  partida: string,
  chegada: string,
  distanciaKm: number,
  deslocamentoRegiaoMetropolitana: boolean,
  municipioLimitrofe: boolean,
  usaDistancia: boolean,
): CalculoDiariaPreview {
  const empty = { quantidade: 0, bloqueado: true, motivoBloqueio: 'Informe partida, chegada, origem e destino.', memoria: 'Dados insuficientes para calcular.' };

  if (!partida || !chegada) return empty;

  const inicioData = new Date(partida);
  const fimData = new Date(chegada);
  const inicio = inicioData.getTime();
  const fim = fimData.getTime();

  if (!Number.isFinite(inicio) || !Number.isFinite(fim) || fim <= inicio) {
    return { quantidade: 0, bloqueado: true, motivoBloqueio: 'A chegada deve ser posterior à partida.', memoria: 'Período inválido.' };
  }

  const horas = (fim - inicio) / 36e5;
  const diaInicio = new Date(inicioData.getFullYear(), inicioData.getMonth(), inicioData.getDate()).getTime();
  const diaFim = new Date(fimData.getFullYear(), fimData.getMonth(), fimData.getDate()).getTime();
  const diasFora = Math.round((diaFim - diaInicio) / 86400000);
  const possuiPernoite = diasFora > 0;
  const maximoDiasSeguidosNoMesmoMes = (() => {
    const cursor = new Date(inicioData.getFullYear(), inicioData.getMonth(), inicioData.getDate());
    const fimDia = new Date(fimData.getFullYear(), fimData.getMonth(), fimData.getDate());
    const diasPorMes = new Map<string, number>();

    while (cursor.getTime() <= fimDia.getTime()) {
      const chaveMes = `${cursor.getFullYear()}-${cursor.getMonth()}`;
      diasPorMes.set(chaveMes, (diasPorMes.get(chaveMes) ?? 0) + 1);
      cursor.setDate(cursor.getDate() + 1);
    }

    return Math.max(...diasPorMes.values());
  })();

  if (maximoDiasSeguidosNoMesmoMes > 15) {
    return {
      quantidade: 0,
      bloqueado: true,
      motivoBloqueio: 'É permitido solicitar no máximo 15 dias seguidos em um único mês.',
      memoria: 'Bloqueio por limite de 15 dias seguidos em um único mês.',
    };
  }

  if (usaDistancia && (!Number.isFinite(distanciaKm) || distanciaKm < 150)) {
    return { quantidade: 0, bloqueado: true, motivoBloqueio: mensagemDistanciaMinimaDiaria, memoria: 'Bloqueio por distância mínima de 150 km.' };
  }

  if (usaDistancia && !possuiPernoite && deslocamentoRegiaoMetropolitana) {
    return { quantidade: 0, bloqueado: true, motivoBloqueio: 'Sem pernoite, deslocamento em região metropolitana não gera diária.', memoria: 'Bloqueio por região metropolitana sem pernoite.' };
  }

  if (usaDistancia && !possuiPernoite && municipioLimitrofe) {
    return { quantidade: 0, bloqueado: true, motivoBloqueio: 'Sem pernoite, deslocamento para município limítrofe não gera diária.', memoria: 'Bloqueio por município limítrofe sem pernoite.' };
  }

  if (horas < 6) {
    return { quantidade: 0, bloqueado: true, motivoBloqueio: 'Afastamento inferior a 6 horas não gera diária.', memoria: 'Duração inferior ao mínimo normativo.' };
  }

  if (!possuiPernoite) {
    return { quantidade: 0.5, bloqueado: false, motivoBloqueio: '', memoria: `${horas.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}h sem pernoite: 0,5 diária.` };
  }

  const horaRetorno = fimData.getHours() + fimData.getMinutes() / 60;
  const acrescimoRetorno = horaRetorno > 14 ? 0.5 : 0;
  const quantidade = diasFora + acrescimoRetorno;

  return {
    quantidade,
    bloqueado: false,
    motivoBloqueio: '',
    memoria: `${diasFora} pernoite(s)${acrescimoRetorno ? ' + 0,5 por retorno após 14h' : ''}.`,
  };
}

function statusLabel(status: StatusDiaria) {
  const labels = {
    RASCUNHO: 'Rascunho',
    ALOCADA: 'Aguardando Bolsista',
    APROVADA: 'Aprovada',
    CANCELADA: 'Cancelado',
    RECUSADA: 'Recusada',
  };

  return labels[status];
}

function statusPendenteAceite(solicitacao: Pick<DiariaRequest, 'status' | 'estadoAceite'>) {
  return solicitacao.status === 'ALOCADA' && solicitacao.estadoAceite === 'PENDENTE';
}

function formatarDistanciaDiaria(solicitacao: Pick<DiariaRequest, 'tipoViagem' | 'distanciaKm'>) {
  if (solicitacao.tipoViagem !== 'DENTRO_ESTADO') return 'Não aplicada';

  return `${solicitacao.distanciaKm.toLocaleString('pt-BR')} km`;
}

function dataInicioAindaNaoPassou(partida: string) {
  const inicio = new Date(partida).getTime();
  return Number.isFinite(inicio) && inicio > Date.now();
}

function formatarDataPartida(partida: string) {
  return new Date(partida).toLocaleDateString('pt-BR');
}

function formatarPeriodoDiaria(partida: string, chegada: string) {
  return `${formatarDataPartida(partida)} a ${formatarDataPartida(chegada)}`;
}

function relatorioEnviadoDiaria(solicitacao: Pick<DiariaRequest, 'partida' | 'comprovacaoAtividade'>) {
  if (dataInicioAindaNaoPassou(solicitacao.partida)) return 'Não';

  return solicitacao.comprovacaoAtividade ? 'Sim' : 'Não';
}

function ordenarPorDataPartida<T extends Pick<DiariaRequest, 'partida'>>(items: T[], ordenacao: OrdenacaoDataPartida) {
  return [...items].sort((a, b) => {
    const partidaA = new Date(a.partida).getTime();
    const partidaB = new Date(b.partida).getTime();

    return ordenacao === 'RECENTE' ? partidaB - partidaA : partidaA - partidaB;
  });
}

function formatarInputData(valor: string) {
  return valor.split('T')[0] ?? '';
}

function formatarInputHora(valor: string) {
  return (valor.split('T')[1] ?? '').slice(0, 8);
}

function combinarDataHora(atual: string, proximoValor: string, parte: 'data' | 'hora') {
  const data = formatarInputData(atual) || '2026-06-10';
  const hora = formatarInputHora(atual) || '08:00:00';

  return parte === 'data' ? `${proximoValor}T${hora}` : `${data}T${proximoValor}`;
}

export function CertificatesPage({ accessType = 'bolsista', initialFlow = null, initialDiariaTab = 'solicitadas', onNavigate }: CertificatesPageProps) {
  const [selectedOption, setSelectedOption] = useState<DocumentoSolicitacao>(null);
  const [activeFlow, setActiveFlow] = useState<'diarias' | null>(initialFlow);
  const [activeDiariaTab, setActiveDiariaTab] = useState<DiariaTab>(initialFlow === 'diarias' ? initialDiariaTab : 'solicitadas');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedBolsistas, setSelectedBolsistas] = useState<string[]>([]);
  const [bolsistaSearch, setBolsistaSearch] = useState('');
  const [isBolsistaDropdownOpen, setIsBolsistaDropdownOpen] = useState(false);
  const [diariaSearch, setDiariaSearch] = useState('');
  const [diariaStatusFilter, setDiariaStatusFilter] = useState<StatusDiaria | 'TODOS'>('TODOS');
  const [diariaTipoViagemFilter, setDiariaTipoViagemFilter] = useState<TipoViagemCodigo | 'TODOS'>('TODOS');
  const [diariaDataPartidaSort, setDiariaDataPartidaSort] = useState<OrdenacaoDataPartida>('RECENTE');
  const [minhasDiariasSearch, setMinhasDiariasSearch] = useState('');
  const [minhasDiariasStatusFilter, setMinhasDiariasStatusFilter] = useState<StatusDiaria | 'TODOS'>('TODOS');
  const [minhasDiariasTipoViagemFilter, setMinhasDiariasTipoViagemFilter] = useState<TipoViagemCodigo | 'TODOS'>('TODOS');
  const [minhasDiariasDataPartidaSort, setMinhasDiariasDataPartidaSort] = useState<OrdenacaoDataPartida>('RECENTE');
  const [diariasSolicitadasPage, setDiariasSolicitadasPage] = useState(1);
  const [minhasDiariasPage, setMinhasDiariasPage] = useState(1);
  const [partida, setPartida] = useState('');
  const [chegada, setChegada] = useState('');
  const [tipoViagemSelecionado, setTipoViagemSelecionado] = useState<TipoViagemCodigo | ''>('');
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [transporteCusteadoOutraEntidade, setTransporteCusteadoOutraEntidade] = useState(false);
  const [hospedagemCusteadaOutraEntidade, setHospedagemCusteadaOutraEntidade] = useState(false);
  const [alimentacaoCusteadaOutraEntidade, setAlimentacaoCusteadaOutraEntidade] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [justificativaCancelamento, setJustificativaCancelamento] = useState('');
  const [solicitacaoDetalheId, setSolicitacaoDetalheId] = useState<string | null>(null);
  const [solicitacaoDetalheOrigem, setSolicitacaoDetalheOrigem] = useState<'solicitadas' | 'minhas'>('solicitadas');
  const [mostrarMotivoCancelamento, setMostrarMotivoCancelamento] = useState(false);
  const [mostrarJustificativaRecusa, setMostrarJustificativaRecusa] = useState(false);
  const [recusandoId, setRecusandoId] = useState<string | null>(null);
  const [resumoAceiteId, setResumoAceiteId] = useState<string | null>(null);
  const [confirmarCriacaoDiariaOpen, setConfirmarCriacaoDiariaOpen] = useState(false);
  const [confirmarAceiteDiariaId, setConfirmarAceiteDiariaId] = useState<string | null>(null);
  const [justificativaRecusa, setJustificativaRecusa] = useState('');
  const [descricaoComprovacaoAtividade, setDescricaoComprovacaoAtividade] = useState('');
  const [isComprovacaoDragging, setIsComprovacaoDragging] = useState(false);
  const [arquivosComprovacaoAtividade, setArquivosComprovacaoAtividade] = useState<File[]>([]);
  const [nomesArquivosComprovacaoAtividade, setNomesArquivosComprovacaoAtividade] = useState<string[]>([]);
  const [arquivoComprovacaoEditandoIdx, setArquivoComprovacaoEditandoIdx] = useState<number | null>(null);
  const [nomeArquivoComprovacaoTemporario, setNomeArquivoComprovacaoTemporario] = useState('');
  const [arquivoComprovacaoExpandidoIdx, setArquivoComprovacaoExpandidoIdx] = useState<number | null>(null);
  const comprovacaoFileInputRef = useRef<HTMLInputElement>(null);
  const [diariasAceitas, setDiariasAceitas] = useState<string[]>([]);
  const [solicitacoesDiaria, setSolicitacoesDiaria] = useState<DiariaRequest[]>([
    {
      id: 'SD-2026-003',
      alocacaoBolsistaRef: 'ALO-2026-COORD-001',
      bolsistaNome: 'Mariana Costa',
      partida: '2026-08-05T09:00',
      chegada: '2026-08-06T17:00',
      origem: 'Vitória/ES',
      destino: 'Cachoeiro de Itapemirim/ES',
      distanciaKm: 136,
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Participação como bolsista em atividade técnica de projeto parceiro.',
      status: 'ALOCADA',
      estadoAceite: 'PENDENTE',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '1 pernoite + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-044',
    },
    {
      id: 'SD-2026-002',
      alocacaoBolsistaRef: 'ALO-2026-001',
      bolsistaNome: 'Ana Souza',
      partida: '2026-07-03T07:00',
      chegada: '2026-07-04T19:00',
      origem: 'Vitória/ES',
      destino: 'Linhares/ES',
      distanciaKm: 135,
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Coleta de dados em campo prevista no plano de trabalho.',
      status: 'ALOCADA',
      estadoAceite: 'PENDENTE',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '1 pernoite + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-043',
    },
    {
      id: 'SD-2026-001',
      alocacaoBolsistaRef: 'ALO-2026-001',
      bolsistaNome: 'Ana Souza',
      partida: '2026-06-10T08:00',
      chegada: '2026-06-12T18:00',
      origem: 'Vila Velha/ES',
      destino: 'Vitória/ES',
      distanciaKm: 8,
      deslocamentoRegiaoMetropolitana: true,
      municipioLimitrofe: true,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Participação em reunião técnica do projeto.',
      status: 'APROVADA',
      estadoAceite: 'ASSINADO',
      quantidade: 2.5,
      valorUnitario: 260,
      valorTotal: 650,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '2 pernoites + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-045',
    },
    {
      id: 'SD-2026-004',
      alocacaoBolsistaRef: 'ALO-2026-002',
      bolsistaNome: 'Bruno Lima',
      partida: '2026-06-10T08:00',
      chegada: '2026-06-12T18:00',
      origem: 'Vila Velha/ES',
      destino: 'Vitória/ES',
      distanciaKm: 8,
      deslocamentoRegiaoMetropolitana: true,
      municipioLimitrofe: true,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Participação em reunião técnica do projeto.',
      status: 'APROVADA',
      estadoAceite: 'ASSINADO',
      quantidade: 2.5,
      valorUnitario: 260,
      valorTotal: 650,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '2 pernoites + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-046',
    },
    {
      id: 'SD-2026-000',
      alocacaoBolsistaRef: 'ALO-2026-003',
      bolsistaNome: 'Carla Nunes',
      partida: '2026-05-22T08:00',
      chegada: '2026-05-23T18:00',
      origem: 'Vitória/ES',
      destino: 'Serra/ES',
      distanciaKm: 27,
      deslocamentoRegiaoMetropolitana: true,
      municipioLimitrofe: true,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Acompanhamento presencial de oficina técnica.',
      status: 'RECUSADA',
      estadoAceite: 'RECUSADO',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '1 pernoite + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-040',
      transacaoReversaoRef: 'TR-2026-041',
      justificativaRecusa: 'Beneficiária recusou a viagem por conflito de agenda.',
    },
    {
      id: 'SD-2026-101',
      alocacaoBolsistaRef: 'ALO-2026-007',
      bolsistaNome: bolsistaMinhasDiarias,
      partida: '2026-09-02T08:00',
      chegada: '2026-09-03T18:00',
      origem: 'Vitória/ES',
      destino: 'Linhares/ES',
      distanciaKm: 133.86,
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Acompanhamento de atividade de campo.',
      status: 'ALOCADA',
      estadoAceite: 'PENDENTE',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '1 pernoite + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-101',
    },
    {
      id: 'SD-2026-102',
      alocacaoBolsistaRef: 'ALO-2026-007',
      bolsistaNome: bolsistaMinhasDiarias,
      partida: '2026-09-10T07:30',
      chegada: '2026-09-12T16:00',
      origem: 'Vitória/ES',
      destino: 'São Paulo/SP',
      distanciaKm: 0,
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Participação em seminário nacional.',
      status: 'APROVADA',
      estadoAceite: 'ASSINADO',
      quantidade: 2.5,
      valorUnitario: 320,
      valorTotal: 800,
      tipoDiariaRef: 'DIA-2026-002',
      parametroCalculoDiariaRef: 'PCD-2026-002',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'FORA_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '2 pernoites + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-102',
    },
    {
      id: 'SD-2026-103',
      alocacaoBolsistaRef: 'ALO-2026-007',
      bolsistaNome: bolsistaMinhasDiarias,
      partida: '2026-10-04T09:00',
      chegada: '2026-10-06T20:00',
      origem: 'Vitória/ES',
      destino: 'Brasília/DF',
      distanciaKm: 0,
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
      transporteCusteadoOutraEntidade: true,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Reunião técnica com parceiros institucionais.',
      status: 'RECUSADA',
      estadoAceite: 'RECUSADO',
      quantidade: 2.5,
      valorUnitario: 320,
      valorTotal: 800,
      tipoDiariaRef: 'DIA-2026-002',
      parametroCalculoDiariaRef: 'PCD-2026-002',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'FORA_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '2 pernoites + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-103',
      justificativaRecusa: 'Viagem substituída por agenda remota.',
    },
    {
      id: 'SD-2026-104',
      alocacaoBolsistaRef: 'ALO-2026-007',
      bolsistaNome: bolsistaMinhasDiarias,
      partida: '2026-11-15T14:00',
      chegada: '2026-11-18T22:00',
      origem: 'Vitória/ES',
      destino: 'Lisboa/Portugal',
      distanciaKm: 0,
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Apresentação de resultados em evento internacional.',
      status: 'APROVADA',
      estadoAceite: 'ASSINADO',
      quantidade: 3.5,
      valorUnitario: 620,
      valorTotal: 2170,
      tipoDiariaRef: 'DIA-2026-003',
      parametroCalculoDiariaRef: 'PCD-2026-003',
      tipoDiaria: 'INTERNACIONAL',
      tipoViagem: 'INTERNACIONAL',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '3 pernoites + 0,5 por retorno após 14h.',
      transacaoComprometimentoRef: 'TR-2026-104',
    },
    {
      id: 'SD-2026-105',
      alocacaoBolsistaRef: 'ALO-2026-007',
      bolsistaNome: bolsistaMinhasDiarias,
      partida: '2026-12-01T08:30',
      chegada: '2026-12-01T17:00',
      origem: 'Vitória/ES',
      destino: 'Cachoeiro de Itapemirim/ES',
      distanciaKm: 143.4,
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: true,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Visita técnica sem pernoite.',
      status: 'ALOCADA',
      estadoAceite: 'PENDENTE',
      quantidade: 0.5,
      valorUnitario: 260,
      valorTotal: 130,
      tipoDiariaRef: 'DIA-2026-001',
      parametroCalculoDiariaRef: 'PCD-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: '8,5h sem pernoite: 0,5 diária.',
      transacaoComprometimentoRef: 'TR-2026-105',
    },
    ...([
      {
        id: 'SD-2026-201',
        alocacaoBolsistaRef: 'ALO-2026-001',
        bolsistaNome: bolsistaAtual,
        partida: '2026-02-12T08:00',
        chegada: '2026-02-13T18:00',
        destino: 'Linhares/ES',
        distanciaKm: 133.86,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 1.5,
        valorUnitario: 260,
        valorTotal: 390,
        tipoDiariaRef: 'DIA-2026-001',
        parametroCalculoDiariaRef: 'PCD-2026-001',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'DENTRO_ESTADO',
      },
      {
        id: 'SD-2026-202',
        alocacaoBolsistaRef: 'ALO-2026-001',
        bolsistaNome: bolsistaAtual,
        partida: '2026-03-04T07:30',
        chegada: '2026-03-06T17:30',
        destino: 'São Paulo/SP',
        distanciaKm: 0,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 2.5,
        valorUnitario: 320,
        valorTotal: 800,
        tipoDiariaRef: 'DIA-2026-002',
        parametroCalculoDiariaRef: 'PCD-2026-002',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'FORA_ESTADO',
      },
      {
        id: 'SD-2026-203',
        alocacaoBolsistaRef: 'ALO-2026-001',
        bolsistaNome: bolsistaAtual,
        partida: '2026-04-18T09:00',
        chegada: '2026-04-18T18:00',
        destino: 'Cachoeiro de Itapemirim/ES',
        distanciaKm: 143.4,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 0.5,
        valorUnitario: 260,
        valorTotal: 130,
        tipoDiariaRef: 'DIA-2026-001',
        parametroCalculoDiariaRef: 'PCD-2026-001',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'DENTRO_ESTADO',
      },
      {
        id: 'SD-2026-204',
        alocacaoBolsistaRef: 'ALO-2026-001',
        bolsistaNome: bolsistaAtual,
        partida: '2026-05-07T08:00',
        chegada: '2026-05-08T16:00',
        destino: 'Brasília/DF',
        distanciaKm: 0,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 1.5,
        valorUnitario: 320,
        valorTotal: 480,
        tipoDiariaRef: 'DIA-2026-002',
        parametroCalculoDiariaRef: 'PCD-2026-002',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'FORA_ESTADO',
      },
      {
        id: 'SD-2026-205',
        alocacaoBolsistaRef: 'ALO-2026-001',
        bolsistaNome: bolsistaAtual,
        partida: '2026-08-14T08:00',
        chegada: '2026-08-16T18:00',
        destino: 'Linhares/ES',
        distanciaKm: 133.86,
        status: 'ALOCADA',
        estadoAceite: 'PENDENTE',
        quantidade: 2.5,
        valorUnitario: 260,
        valorTotal: 650,
        tipoDiariaRef: 'DIA-2026-001',
        parametroCalculoDiariaRef: 'PCD-2026-001',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'DENTRO_ESTADO',
      },
      {
        id: 'SD-2026-206',
        alocacaoBolsistaRef: 'ALO-2026-001',
        bolsistaNome: bolsistaAtual,
        partida: '2026-09-22T07:00',
        chegada: '2026-09-25T19:00',
        destino: 'Lisboa/Portugal',
        distanciaKm: 0,
        status: 'ALOCADA',
        estadoAceite: 'PENDENTE',
        quantidade: 3.5,
        valorUnitario: 620,
        valorTotal: 2170,
        tipoDiariaRef: 'DIA-2026-003',
        parametroCalculoDiariaRef: 'PCD-2026-003',
        tipoDiaria: 'INTERNACIONAL',
        tipoViagem: 'INTERNACIONAL',
      },
      {
        id: 'SD-2026-207',
        alocacaoBolsistaRef: 'ALO-2026-001',
        bolsistaNome: bolsistaAtual,
        partida: '2026-10-19T08:30',
        chegada: '2026-10-20T17:30',
        destino: 'São Paulo/SP',
        distanciaKm: 0,
        status: 'RECUSADA',
        estadoAceite: 'RECUSADO',
        quantidade: 1.5,
        valorUnitario: 320,
        valorTotal: 480,
        tipoDiariaRef: 'DIA-2026-002',
        parametroCalculoDiariaRef: 'PCD-2026-002',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'FORA_ESTADO',
      },
      {
        id: 'SD-2026-208',
        alocacaoBolsistaRef: 'ALO-2026-001',
        bolsistaNome: bolsistaAtual,
        partida: '2026-11-27T08:00',
        chegada: '2026-11-27T18:30',
        destino: 'Cachoeiro de Itapemirim/ES',
        distanciaKm: 143.4,
        status: 'ALOCADA',
        estadoAceite: 'PENDENTE',
        quantidade: 0.5,
        valorUnitario: 260,
        valorTotal: 130,
        tipoDiariaRef: 'DIA-2026-001',
        parametroCalculoDiariaRef: 'PCD-2026-001',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'DENTRO_ESTADO',
      },
      {
        id: 'SD-2026-106',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-01-22T08:00',
        chegada: '2026-01-23T17:00',
        destino: 'Linhares/ES',
        distanciaKm: 133.86,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 1.5,
        valorUnitario: 260,
        valorTotal: 390,
        tipoDiariaRef: 'DIA-2026-001',
        parametroCalculoDiariaRef: 'PCD-2026-001',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'DENTRO_ESTADO',
      },
      {
        id: 'SD-2026-107',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-03-13T07:00',
        chegada: '2026-03-15T19:00',
        destino: 'São Paulo/SP',
        distanciaKm: 0,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 2.5,
        valorUnitario: 320,
        valorTotal: 800,
        tipoDiariaRef: 'DIA-2026-002',
        parametroCalculoDiariaRef: 'PCD-2026-002',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'FORA_ESTADO',
      },
      {
        id: 'SD-2026-108',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-04-28T08:30',
        chegada: '2026-04-28T18:00',
        destino: 'Cachoeiro de Itapemirim/ES',
        distanciaKm: 143.4,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 0.5,
        valorUnitario: 260,
        valorTotal: 130,
        tipoDiariaRef: 'DIA-2026-001',
        parametroCalculoDiariaRef: 'PCD-2026-001',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'DENTRO_ESTADO',
      },
      {
        id: 'SD-2026-109',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-06-18T08:00',
        chegada: '2026-06-19T17:00',
        destino: 'Brasília/DF',
        distanciaKm: 0,
        status: 'ALOCADA',
        estadoAceite: 'PENDENTE',
        quantidade: 1.5,
        valorUnitario: 320,
        valorTotal: 480,
        tipoDiariaRef: 'DIA-2026-002',
        parametroCalculoDiariaRef: 'PCD-2026-002',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'FORA_ESTADO',
      },
      {
        id: 'SD-2026-110',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-08-24T08:00',
        chegada: '2026-08-26T18:00',
        destino: 'Lisboa/Portugal',
        distanciaKm: 0,
        status: 'ALOCADA',
        estadoAceite: 'PENDENTE',
        quantidade: 2.5,
        valorUnitario: 620,
        valorTotal: 1550,
        tipoDiariaRef: 'DIA-2026-003',
        parametroCalculoDiariaRef: 'PCD-2026-003',
        tipoDiaria: 'INTERNACIONAL',
        tipoViagem: 'INTERNACIONAL',
      },
      {
        id: 'SD-2026-111',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-09-14T08:00',
        chegada: '2026-09-15T17:30',
        destino: 'Colatina/ES',
        distanciaKm: 129.2,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 1.5,
        valorUnitario: 260,
        valorTotal: 390,
        tipoDiariaRef: 'DIA-2026-001',
        parametroCalculoDiariaRef: 'PCD-2026-001',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'DENTRO_ESTADO',
      },
      {
        id: 'SD-2026-112',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-10-02T07:30',
        chegada: '2026-10-03T18:00',
        destino: 'Rio de Janeiro/RJ',
        distanciaKm: 0,
        status: 'ALOCADA',
        estadoAceite: 'PENDENTE',
        quantidade: 1.5,
        valorUnitario: 320,
        valorTotal: 480,
        tipoDiariaRef: 'DIA-2026-002',
        parametroCalculoDiariaRef: 'PCD-2026-002',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'FORA_ESTADO',
      },
      {
        id: 'SD-2026-113',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-10-28T09:00',
        chegada: '2026-10-30T19:00',
        destino: 'Curitiba/PR',
        distanciaKm: 0,
        status: 'RECUSADA',
        estadoAceite: 'RECUSADO',
        quantidade: 2.5,
        valorUnitario: 320,
        valorTotal: 800,
        tipoDiariaRef: 'DIA-2026-002',
        parametroCalculoDiariaRef: 'PCD-2026-002',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'FORA_ESTADO',
      },
      {
        id: 'SD-2026-114',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-11-06T08:30',
        chegada: '2026-11-06T17:30',
        destino: 'Guarapari/ES',
        distanciaKm: 53.1,
        status: 'APROVADA',
        estadoAceite: 'ASSINADO',
        quantidade: 0.5,
        valorUnitario: 260,
        valorTotal: 130,
        tipoDiariaRef: 'DIA-2026-001',
        parametroCalculoDiariaRef: 'PCD-2026-001',
        tipoDiaria: 'NACIONAL',
        tipoViagem: 'DENTRO_ESTADO',
      },
      {
        id: 'SD-2026-115',
        alocacaoBolsistaRef: 'ALO-2026-007',
        bolsistaNome: bolsistaMinhasDiarias,
        partida: '2026-12-08T08:00',
        chegada: '2026-12-11T18:00',
        destino: 'Buenos Aires/Argentina',
        distanciaKm: 0,
        status: 'ALOCADA',
        estadoAceite: 'PENDENTE',
        quantidade: 3.5,
        valorUnitario: 620,
        valorTotal: 2170,
        tipoDiariaRef: 'DIA-2026-003',
        parametroCalculoDiariaRef: 'PCD-2026-003',
        tipoDiaria: 'INTERNACIONAL',
        tipoViagem: 'INTERNACIONAL',
      },
    ] as const).map((solicitacao): DiariaRequest => ({
      origem: 'Vitória/ES',
      deslocamentoRegiaoMetropolitana: false,
      municipioLimitrofe: false,
      transporteCusteadoOutraEntidade: false,
      hospedagemCusteadaOutraEntidade: false,
      alimentacaoCusteadaOutraEntidade: false,
      motivo: 'Atividade prevista no plano de trabalho da iniciativa.',
      regraCalculo: 'Normativa FAPES',
      memoriaCalculoSnapshot: 'Cálculo conforme período informado na solicitação.',
      transacaoComprometimentoRef: solicitacao.id.replace('SD', 'TR'),
      ...solicitacao,
      ...(['SD-2026-108', 'SD-2026-202', 'SD-2026-107', 'SD-2026-201', 'SD-2026-106'].includes(solicitacao.id)
        ? {
            comprovacaoAtividade: {
              descricao: 'Atividade realizada conforme cronograma aprovado, com participação em reuniões técnicas, coleta de evidências e registro dos encaminhamentos para continuidade do projeto.',
              anexos: [
                `registro-fotografico-${solicitacao.id.toLowerCase()}.png`,
                `relatorio-atividade-${solicitacao.id.toLowerCase()}.pdf`,
              ],
            },
          }
        : {}),
    })),
  ]);

  const tiposViagemComOrcamento = tiposViagem.filter((tipo) => (orcamentosRubricasDiarias[tipo.codigo] ?? 0) > 0);
  const tipoViagemAtual =
    tiposViagemComOrcamento.find((tipo) => tipo.codigo === tipoViagemSelecionado) ??
    tiposViagemComOrcamento[0] ??
    tiposViagem[0];
  const diariaVigenteAtual = diariasVigentes.find((diaria) => diaria.tipoViagem === tipoViagemAtual.codigo) ?? diariasVigentes[0];
  const tipoDiariaCalculado = tipoViagemAtual.abrangencia === 'Internacional' ? 'INTERNACIONAL' : 'NACIONAL';
  const tipoDiariaAtual = tiposDiaria.find((tipo) => tipo.codigo === tipoDiariaCalculado) ?? tiposDiaria[0];
  const usaDistanciaNoCalculo = tipoViagemAtual.codigo === 'DENTRO_ESTADO' && Boolean(tipoViagemSelecionado);
  const distanciaRodoviaria = useMemo(
    () => (usaDistanciaNoCalculo ? buscarDistanciaRodoviaria(origem, destino) : { distanciaKm: 0, origemCalculo: 'NAO_APLICADA' as const }),
    [destino, origem, usaDistanciaNoCalculo],
  );
  const distanciaKmNumerica = useMemo(
    () => distanciaRodoviaria.distanciaKm,
    [distanciaRodoviaria.distanciaKm],
  );
  const indicadoresTerritoriaisCalculados = useMemo(
    () => calcularIndicadoresTerritoriais(origem, destino, usaDistanciaNoCalculo),
    [destino, origem, usaDistanciaNoCalculo],
  );
  const { deslocamentoRegiaoMetropolitana, municipioLimitrofe } = indicadoresTerritoriaisCalculados;
  const calculoDiaria = useMemo(
    () => calcularDiarias(partida, chegada, distanciaKmNumerica, deslocamentoRegiaoMetropolitana, municipioLimitrofe, usaDistanciaNoCalculo),
    [chegada, deslocamentoRegiaoMetropolitana, distanciaKmNumerica, municipioLimitrofe, partida, usaDistanciaNoCalculo],
  );
  const quantidadeCalculada = calculoDiaria.quantidade;
  const valorTotalCalculado = quantidadeCalculada * diariaVigenteAtual.valor * selectedBolsistas.length;
  const diariaFormIncompleto = !tipoViagemSelecionado || !origem.trim() || !destino.trim() || !partida || !chegada || !motivo.trim() || selectedBolsistas.length === 0;
  const solicitacaoPropriaCoordenador = selectedBolsistas.length === 1 && selectedBolsistas[0] === coordenadorAtual;
  const partidaData = formatarInputData(partida);
  const partidaHorario = formatarInputHora(partida);
  const chegadaData = formatarInputData(chegada);
  const chegadaHorario = formatarInputHora(chegada);
  const diariasFiltradas = useMemo(() => {
    const query = diariaSearch.trim().toLowerCase();

    const filtradas = solicitacoesDiaria.filter((solicitacao) => {
      const matchesSearch =
        !query ||
        solicitacao.id.toLowerCase().includes(query) ||
        solicitacao.origem.toLowerCase().includes(query) ||
        solicitacao.destino.toLowerCase().includes(query) ||
        solicitacao.bolsistaNome.toLowerCase().includes(query) ||
        solicitacao.alocacaoBolsistaRef.toLowerCase().includes(query);
      const matchesStatus = diariaStatusFilter === 'TODOS' || solicitacao.status === diariaStatusFilter;
      const matchesTipoViagem = diariaTipoViagemFilter === 'TODOS' || solicitacao.tipoViagem === diariaTipoViagemFilter;

      return matchesSearch && matchesStatus && matchesTipoViagem;
    });

    return ordenarPorDataPartida(filtradas, diariaDataPartidaSort);
  }, [diariaDataPartidaSort, diariaSearch, diariaStatusFilter, diariaTipoViagemFilter, solicitacoesDiaria]);
  const diariasPorBeneficiario = useMemo<DiariaBeneficiarioItem[]>(
    () =>
      diariasFiltradas.map((solicitacao, beneficiarioIndex) => ({
        ...solicitacao,
        beneficiario: solicitacao.bolsistaNome,
        beneficiarioIndex,
        valorBeneficiario: solicitacao.valorTotal,
      })),
    [diariasFiltradas],
  );
  const diariasSolicitadasExibidas = useMemo(() => {
    const idsExemplo = new Set([
      'SD-2026-105',
      'SD-2026-104',
      'SD-2026-103',
      'SD-2026-102',
      'SD-2026-101',
      'SD-2026-208',
      'SD-2026-207',
      'SD-2026-206',
      'SD-2026-205',
      'SD-2026-203',
      'SD-2026-108',
      'SD-2026-202',
      'SD-2026-107',
      'SD-2026-201',
      'SD-2026-106',
    ]);

    return diariasPorBeneficiario.filter((solicitacao) => idsExemplo.has(solicitacao.id));
  }, [diariasPorBeneficiario]);
  const diariaPageSize = 10;
  const diariasSolicitadasTotalPages = Math.max(1, Math.ceil(diariasSolicitadasExibidas.length / diariaPageSize));
  const diariasSolicitadasSafePage = Math.min(diariasSolicitadasPage, diariasSolicitadasTotalPages);
  const diariasSolicitadasPaginadas = diariasSolicitadasExibidas.slice((diariasSolicitadasSafePage - 1) * diariaPageSize, diariasSolicitadasSafePage * diariaPageSize);
  const totalComprometido = solicitacoesDiaria
    .filter((solicitacao) => solicitacao.status === 'APROVADA' || statusPendenteAceite(solicitacao))
    .reduce((total, solicitacao) => total + solicitacao.valorTotal, 0);
  const rubricasDashboard = tiposViagem
    .map((tipo) => {
      const total = orcamentosRubricasDiarias[tipo.codigo] ?? 0;
      const solicitacoesDaRubrica = solicitacoesDiaria.filter((solicitacao) => solicitacao.tipoViagem === tipo.codigo);
      const alocado = solicitacoesDaRubrica
        .filter((solicitacao) => statusPendenteAceite(solicitacao))
        .reduce((subtotal, solicitacao) => subtotal + solicitacao.valorTotal, 0);
      const utilizado = solicitacoesDaRubrica
        .filter((solicitacao) => solicitacao.status === 'APROVADA')
        .reduce((subtotal, solicitacao) => subtotal + solicitacao.valorTotal, 0);
      const aceitesPendentes = solicitacoesDaRubrica
        .filter((solicitacao) => statusPendenteAceite(solicitacao))
        .reduce((subtotal) => subtotal + 1, 0);
      const diaria = diariasVigentes.find((item) => item.tipoViagem === tipo.codigo) ?? diariasVigentes[0];

      return {
        codigo: tipo.referencia,
        nome: tipo.rubrica,
        tipoViagem: tipo.nome,
        total,
        alocado,
        utilizado,
        saldo: Math.max(0, total - alocado - utilizado),
        aceitesPendentes,
        diariaVigente: `${diaria.referencia} · ${currency.format(diaria.valor)} · fração ${diaria.fracaoCalculo}`,
      };
    })
    .filter((rubrica) => rubrica.total > 0);
  const totalDisponivelDashboard = rubricasDashboard.reduce((total, rubrica) => total + rubrica.total, 0);
  const valorAlocadoDashboard = rubricasDashboard.reduce((total, rubrica) => total + rubrica.alocado, 0);
  const valorUtilizadoDashboard = rubricasDashboard.reduce((total, rubrica) => total + rubrica.utilizado, 0);
  const saldoDisponivelDashboard = rubricasDashboard.reduce((total, rubrica) => total + rubrica.saldo, 0);
  const saldoProjetoAposSolicitacao = saldoDisponivelDashboard - valorTotalCalculado;
  const orcamentoRubricaSelecionada = orcamentosRubricasDiarias[tipoViagemAtual.codigo] ?? 0;
  const totalComprometidoRubricaSelecionada = solicitacoesDiaria
    .filter(
      (solicitacao) =>
        solicitacao.tipoViagem === tipoViagemAtual.codigo &&
        (solicitacao.status === 'APROVADA' || statusPendenteAceite(solicitacao)),
    )
    .reduce((total, solicitacao) => total + solicitacao.valorTotal, 0);
  const saldoDisponivelDiarias = Math.max(0, orcamentoRubricaSelecionada - totalComprometidoRubricaSelecionada);
  const saldoAposSolicitacao = saldoDisponivelDiarias - valorTotalCalculado;
  const solicitacaoExcedeSaldo = valorTotalCalculado > saldoDisponivelDiarias;
  const solicitacaoBloqueada = diariaFormIncompleto || solicitacaoExcedeSaldo || calculoDiaria.bloqueado;
  const distanciaAbaixoMinimo = Boolean(
    usaDistanciaNoCalculo &&
      origem.trim() &&
      destino.trim() &&
      (!Number.isFinite(distanciaKmNumerica) || distanciaKmNumerica < 150),
  );
  const bloqueioDistanciaMinima = calculoDiaria.motivoBloqueio === mensagemDistanciaMinimaDiaria || distanciaAbaixoMinimo;
  const distanciaDiariaTexto = origem && destino
    ? bloqueioDistanciaMinima
      ? mensagemDistanciaMinimaDiaria
      : 'Aprovada'
    : 'Preencha origem e destino para calcular automaticamente.';
  const mensagemSolicitacaoDiaria = calculoDiaria.bloqueado
    ? calculoDiaria.motivoBloqueio
    : diariaFormIncompleto
    ? 'Preencha os campos obrigatórios para calcular e solicitar a diária.'
    : solicitacaoExcedeSaldo
    ? `Saldo insuficiente na rubrica ${tipoViagemAtual.rubrica}. Faltam ${currency.format(Math.abs(saldoAposSolicitacao))} para esta solicitação.`
    : `Após esta solicitação, o saldo estimado da rubrica ${tipoViagemAtual.rubrica} será ${currency.format(saldoAposSolicitacao)}.`;
  const beneficiarioLogado = accessType === 'coordenador' ? bolsistaMinhasDiarias : bolsistaAtual;
  const minhasDiarias = solicitacoesDiaria.filter((solicitacao) => solicitacao.bolsistaNome === beneficiarioLogado);
  const minhasDiariasFiltradas = useMemo(() => {
    const query = minhasDiariasSearch.trim().toLowerCase();

    const filtradas = solicitacoesDiaria.filter((solicitacao) => {
      if (solicitacao.bolsistaNome !== beneficiarioLogado) return false;

      const matchesSearch =
        !query ||
        solicitacao.id.toLowerCase().includes(query) ||
        solicitacao.origem.toLowerCase().includes(query) ||
        solicitacao.destino.toLowerCase().includes(query) ||
        solicitacao.motivo.toLowerCase().includes(query);
      const matchesStatus = minhasDiariasStatusFilter === 'TODOS' || solicitacao.status === minhasDiariasStatusFilter;
      const matchesTipoViagem = minhasDiariasTipoViagemFilter === 'TODOS' || solicitacao.tipoViagem === minhasDiariasTipoViagemFilter;

      return matchesSearch && matchesStatus && matchesTipoViagem;
    });

    return ordenarPorDataPartida(filtradas, minhasDiariasDataPartidaSort);
  }, [beneficiarioLogado, minhasDiariasDataPartidaSort, minhasDiariasSearch, minhasDiariasStatusFilter, minhasDiariasTipoViagemFilter, solicitacoesDiaria]);
  const minhasDiariasTotalPages = Math.max(1, Math.ceil(minhasDiariasFiltradas.length / diariaPageSize));
  const minhasDiariasSafePage = Math.min(minhasDiariasPage, minhasDiariasTotalPages);
  const minhasDiariasPaginadas = minhasDiariasFiltradas.slice((minhasDiariasSafePage - 1) * diariaPageSize, minhasDiariasSafePage * diariaPageSize);
  useEffect(() => {
    setDiariasSolicitadasPage(1);
  }, [diariaDataPartidaSort, diariaSearch, diariaStatusFilter, diariaTipoViagemFilter]);
  useEffect(() => {
    setMinhasDiariasPage(1);
  }, [minhasDiariasDataPartidaSort, minhasDiariasSearch, minhasDiariasStatusFilter, minhasDiariasTipoViagemFilter]);
  const bolsistasEncontrados = useMemo(() => {
    const query = bolsistaSearch.trim().toLowerCase();

    if (!query) return beneficiariosDoProjeto.filter((nome) => !selectedBolsistas.includes(nome)).slice(0, 4);

    return beneficiariosDoProjeto.filter((nome) => nome.toLowerCase().includes(query) && !selectedBolsistas.includes(nome));
  }, [bolsistaSearch, selectedBolsistas]);

  const adicionarBolsista = (nome: string) => {
    setSelectedBolsistas((current) => (current.includes(nome) ? current : [...current, nome]));
    setBolsistaSearch('');
  };

  const removerBolsista = (nome: string) => {
    setSelectedBolsistas((current) => current.filter((item) => item !== nome));
  };

  const limparFormularioDiaria = () => {
    setSelectedBolsistas([]);
    setBolsistaSearch('');
    setPartida('');
    setChegada('');
    setTipoViagemSelecionado('');
    setOrigem('');
    setDestino('');
    setTransporteCusteadoOutraEntidade(false);
    setHospedagemCusteadaOutraEntidade(false);
    setAlimentacaoCusteadaOutraEntidade(false);
    setMotivo('');
    setJustificativaCancelamento('');
    setSolicitacaoDetalheId(null);
    setSolicitacaoDetalheOrigem('solicitadas');
    setMostrarMotivoCancelamento(false);
    setMostrarJustificativaRecusa(false);
    setJustificativaRecusa('');
    setDescricaoComprovacaoAtividade('');
    setIsComprovacaoDragging(false);
    setArquivosComprovacaoAtividade([]);
    setNomesArquivosComprovacaoAtividade([]);
    setArquivoComprovacaoEditandoIdx(null);
    setNomeArquivoComprovacaoTemporario('');
    setArquivoComprovacaoExpandidoIdx(null);
  };

  const abrirNovaSolicitacaoDiaria = () => {
    limparFormularioDiaria();
    setActiveDiariaTab('nova');
  };

  const abrirDetalheSolicitacaoDiaria = (solicitacao: DiariaRequest, origemDetalhe: 'solicitadas' | 'minhas' = 'solicitadas') => {
    setSolicitacaoDetalheId(solicitacao.id);
    setSolicitacaoDetalheOrigem(origemDetalhe);
    setSelectedBolsistas([solicitacao.bolsistaNome]);
    setBolsistaSearch('');
    setPartida(solicitacao.partida);
    setChegada(solicitacao.chegada);
    setTipoViagemSelecionado(solicitacao.tipoViagem);
    setOrigem(solicitacao.origem);
    setDestino(solicitacao.destino);
    setTransporteCusteadoOutraEntidade(solicitacao.transporteCusteadoOutraEntidade);
    setHospedagemCusteadaOutraEntidade(solicitacao.hospedagemCusteadaOutraEntidade);
    setAlimentacaoCusteadaOutraEntidade(solicitacao.alimentacaoCusteadaOutraEntidade);
    setMotivo(solicitacao.motivo);
    setJustificativaCancelamento(solicitacao.justificativaCancelamento ?? '');
    setJustificativaRecusa(solicitacao.justificativaRecusa ?? '');
    setMostrarMotivoCancelamento(false);
    setMostrarJustificativaRecusa(false);
    setDescricaoComprovacaoAtividade(solicitacao.comprovacaoAtividade?.descricao ?? '');
    setIsComprovacaoDragging(false);
    setArquivosComprovacaoAtividade(
      (solicitacao.comprovacaoAtividade?.anexos ?? []).map((nome) => new File(['mock'], nome, { type: nome.endsWith('.pdf') ? 'application/pdf' : 'image/png' })),
    );
    setNomesArquivosComprovacaoAtividade(solicitacao.comprovacaoAtividade?.anexos ?? []);
    setArquivoComprovacaoEditandoIdx(null);
    setNomeArquivoComprovacaoTemporario('');
    setArquivoComprovacaoExpandidoIdx(null);
    setActiveDiariaTab('nova');
  };

  const cancelarSolicitacaoDetalhe = () => {
    if (!solicitacaoDetalheId || !justificativaCancelamento.trim()) return;

    setSolicitacoesDiaria((current) =>
      current.map((solicitacao) =>
        solicitacao.id === solicitacaoDetalheId
          ? {
              ...solicitacao,
              status: 'CANCELADA',
              estadoAceite: 'CANCELADO',
              transacaoReversaoRef: solicitacao.transacaoReversaoRef ?? 'TR-2026-046',
              justificativaCancelamento,
            }
          : solicitacao,
      ),
    );
    setActiveDiariaTab('solicitadas');
    setSolicitacaoDetalheId(null);
    setMostrarMotivoCancelamento(false);
    setJustificativaCancelamento('');
  };

  const recusarSolicitacaoDetalhe = () => {
    if (!solicitacaoDetalheId || !justificativaRecusa.trim()) return;

    setSolicitacoesDiaria((current) =>
      current.map((solicitacao) =>
        solicitacao.id === solicitacaoDetalheId
          ? {
              ...solicitacao,
              status: 'RECUSADA',
              estadoAceite: 'RECUSADO',
              justificativaRecusa,
              transacaoReversaoRef: solicitacao.transacaoReversaoRef ?? 'TR-2026-047',
            }
          : solicitacao,
      ),
    );
    setActiveDiariaTab('minhas');
    setSolicitacaoDetalheId(null);
    setMostrarJustificativaRecusa(false);
    setJustificativaRecusa('');
  };

  const alterarTipoViagem = (tipoViagem: TipoViagemCodigo | '') => {
    setTipoViagemSelecionado(tipoViagem);
    if (!tipoViagem) return;

    if (tipoViagem === 'INTERNACIONAL') {
      setDestino('');
      return;
    }

    const destinoCompativel = destinosDiaria.find((item) => item.value === destino && item.tipoViagem === tipoViagem);
    if (!destinoCompativel) {
      const primeiroDestino = destinosDiaria.find((item) => item.tipoViagem === tipoViagem);
      if (primeiroDestino) setDestino(primeiroDestino.value);
    }
  };

  const alterarDestino = (novoDestino: string) => {
    setDestino(novoDestino);

    const destinoSelecionado = destinosDiaria.find((item) => item.value === novoDestino);
    if (destinoSelecionado) setTipoViagemSelecionado(destinoSelecionado.tipoViagem);
  };

  const confirmarSolicitacaoDiaria = () => {
    if (diariaFormIncompleto || !quantidadeCalculada || solicitacaoExcedeSaldo || calculoDiaria.bloqueado) return;
    setConfirmarCriacaoDiariaOpen(true);
  };

  const criarSolicitacaoDiaria = () => {
    if (diariaFormIncompleto || !quantidadeCalculada || solicitacaoExcedeSaldo || calculoDiaria.bloqueado) return;

    const novasSolicitacoes = selectedBolsistas.flatMap((nome, index) => {
      const alocacao = alocacoesDoProjeto.find((item) => item.nome === nome);

      if (!alocacao) return [];

      const solicitacaoPropria = nome === coordenadorAtual;
      const nextNumber = String(solicitacoesDiaria.length + index + 1).padStart(3, '0');
      const custeiosExternos = [
        transporteCusteadoOutraEntidade && 'transporte',
        hospedagemCusteadaOutraEntidade && 'hospedagem',
        alimentacaoCusteadaOutraEntidade && 'alimentação',
      ].filter(Boolean).join(', ') || 'nenhum';

      return [{
        id: `SD-2026-${nextNumber}`,
        alocacaoBolsistaRef: alocacao.ref,
        bolsistaNome: nome,
        partida,
        chegada,
        origem,
        destino,
        distanciaKm: usaDistanciaNoCalculo ? distanciaKmNumerica : 0,
        deslocamentoRegiaoMetropolitana: usaDistanciaNoCalculo && deslocamentoRegiaoMetropolitana,
        municipioLimitrofe: usaDistanciaNoCalculo && municipioLimitrofe,
        transporteCusteadoOutraEntidade,
        hospedagemCusteadaOutraEntidade,
        alimentacaoCusteadaOutraEntidade,
        motivo,
        status: solicitacaoPropria ? 'APROVADA' : 'ALOCADA',
        estadoAceite: solicitacaoPropria ? 'ASSINADO' : 'PENDENTE',
        quantidade: quantidadeCalculada,
        valorUnitario: diariaVigenteAtual.valor,
        valorTotal: quantidadeCalculada * diariaVigenteAtual.valor,
        tipoDiariaRef: diariaVigenteAtual.referencia,
        parametroCalculoDiariaRef: diariaVigenteAtual.parametroRef,
        tipoDiaria: tipoDiariaAtual.codigo,
        tipoViagem: tipoViagemAtual.codigo,
        regraCalculo: tipoDiariaAtual.regra,
        memoriaCalculoSnapshot: `${calculoDiaria.memoria} Origem: ${origem}. Destino: ${destino}. ${usaDistanciaNoCalculo ? `Distância: ${distanciaKmNumerica.toLocaleString('pt-BR')} km.` : 'Distância aprovada para este tipo de viagem.'} Custeios externos: ${custeiosExternos}. Parâmetro ${diariaVigenteAtual.parametroRef}.`,
        transacaoComprometimentoRef: `TR-2026-${String(45 + solicitacoesDiaria.length + index + 1).padStart(3, '0')}`,
      } satisfies DiariaRequest];
    });

    setSolicitacoesDiaria((current) => [...novasSolicitacoes, ...current]);
    setConfirmarCriacaoDiariaOpen(false);
    limparFormularioDiaria();
    setActiveDiariaTab('solicitadas');
  };

  const cancelarDiaria = (id: string) => {
    if (!justificativaCancelamento.trim()) return;

    setSolicitacoesDiaria((current) =>
      current.map((solicitacao) =>
        solicitacao.id === id && dataInicioAindaNaoPassou(solicitacao.partida)
          ? {
              ...solicitacao,
              status: 'CANCELADA',
              estadoAceite: 'CANCELADO',
              transacaoReversaoRef: 'TR-2026-046',
              justificativaCancelamento,
            }
          : solicitacao,
      ),
    );
    setCancelandoId(null);
    setJustificativaCancelamento('');
  };

  const solicitarAceiteDiaria = (id: string) => {
    setConfirmarAceiteDiariaId(id);
  };

  const aceitarDiaria = (id: string) => {
    setDiariasAceitas((current) => (current.includes(id) ? current : [...current, id]));
    setSolicitacoesDiaria((current) =>
      current.map((solicitacao) =>
        solicitacao.id === id
          ? {
              ...solicitacao,
              status: 'APROVADA',
              estadoAceite: 'ASSINADO',
              transacaoComprometimentoRef: solicitacao.transacaoComprometimentoRef ?? `TR-2026-${String(45 + solicitacoesDiaria.length + 1).padStart(3, '0')}`,
            }
          : solicitacao,
      ),
    );
    setResumoAceiteId(null);
    setConfirmarAceiteDiariaId(null);
    if (solicitacaoDetalheId === id) {
      setActiveDiariaTab('minhas');
      setSolicitacaoDetalheId(null);
    }
  };

  const recusarDiaria = (id: string) => {
    if (!justificativaRecusa.trim()) return;

    setSolicitacoesDiaria((current) =>
      current.map((solicitacao) =>
        solicitacao.id === id
          ? {
              ...solicitacao,
              status: 'RECUSADA',
              estadoAceite: 'RECUSADO',
              justificativaRecusa,
              transacaoReversaoRef: solicitacao.transacaoComprometimentoRef ? 'TR-2026-047' : solicitacao.transacaoReversaoRef,
            }
          : solicitacao,
      ),
    );
    setRecusandoId(null);
    setJustificativaRecusa('');
  };

  const adicionarArquivosComprovacaoAtividade = (files: File[]) => {
    if (files.length === 0) return;

    setArquivosComprovacaoAtividade((current) => [...current, ...files]);
    setNomesArquivosComprovacaoAtividade((current) => [...current, ...files.map((file) => file.name)]);
  };

  const confirmarEdicaoNomeArquivoComprovacao = (index: number) => {
    if (nomeArquivoComprovacaoTemporario.trim()) {
      setNomesArquivosComprovacaoAtividade((current) =>
        current.map((nome, nomeIndex) => (nomeIndex === index ? nomeArquivoComprovacaoTemporario.trim() : nome)),
      );
    }
    setArquivoComprovacaoEditandoIdx(null);
    setNomeArquivoComprovacaoTemporario('');
  };

  const removerArquivoComprovacaoAtividade = (index: number) => {
    setArquivosComprovacaoAtividade((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setNomesArquivosComprovacaoAtividade((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setArquivoComprovacaoEditandoIdx((current) => (current === index ? null : current));
    setArquivoComprovacaoExpandidoIdx((current) => (current === index ? null : current));
  };

  const renderListaInfo = (total: number) => (
    <div className="flex justify-start mb-4">
      <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
        Mostrando {Math.min(diariaPageSize, total)} resultados de {total}
      </span>
    </div>
  );

  const renderMinhasDiarias = () => (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px_220px_220px] gap-3 mb-4">
        <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
          Pesquisar
          <div className="relative mt-2">
            <input
              value={minhasDiariasSearch}
              onChange={(event) => setMinhasDiariasSearch(event.target.value)}
              placeholder="Buscar"
              className="w-full pl-3 pr-10 py-2"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
              }}
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          </div>
        </label>
        <div>
          <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            Data de Partida
          </label>
          <div className="mt-2">
            <Dropdown
              value={minhasDiariasDataPartidaSort}
              onChange={(value) => setMinhasDiariasDataPartidaSort(value as OrdenacaoDataPartida)}
              showSelectedIcon={false}
              options={[
                { value: 'RECENTE', label: 'Próxima' },
                { value: 'ANTIGA', label: 'Anterior' },
              ]}
            />
          </div>
        </div>
        <div>
          <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            Tipo de Viagem
          </label>
          <div className="mt-2">
            <Dropdown
              value={minhasDiariasTipoViagemFilter}
              onChange={(value) => setMinhasDiariasTipoViagemFilter(value as TipoViagemCodigo | 'TODOS')}
              options={[
                { value: 'TODOS', label: 'Todos' },
                { value: 'DENTRO_ESTADO', label: 'Dentro do Estado' },
                { value: 'FORA_ESTADO', label: 'Nacional' },
                { value: 'INTERNACIONAL', label: 'Internacional' },
              ]}
            />
          </div>
        </div>
        <div>
          <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            Status
          </label>
          <div className="mt-2">
            <Dropdown
              value={minhasDiariasStatusFilter}
              onChange={(value) => setMinhasDiariasStatusFilter(value as StatusDiaria | 'TODOS')}
              options={[
                { value: 'TODOS', label: 'Todos' },
                { value: 'RASCUNHO', label: 'Rascunho' },
                { value: 'ALOCADA', label: 'Aguardando Bolsista' },
                { value: 'APROVADA', label: 'Aprovada' },
                { value: 'RECUSADA', label: 'Recusada' },
                { value: 'CANCELADA', label: 'Cancelada' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {renderListaInfo(minhasDiariasFiltradas.length)}
        {minhasDiariasPaginadas.map((solicitacao) => (
          <button
            key={solicitacao.id}
            type="button"
            onClick={() => abrirDetalheSolicitacaoDiaria(solicitacao, 'minhas')}
            className="w-full p-5 text-left transition-colors"
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = 'var(--muted)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = 'var(--card)';
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Bolsista', value: solicitacao.bolsistaNome },
                  { label: 'Valor Total', value: currency.format(solicitacao.valorTotal) },
                  { label: 'Período', value: formatarPeriodoDiaria(solicitacao.partida, solicitacao.chegada) },
                  { label: 'Destino', value: solicitacao.destino },
                ].map((item) => (
                  <div key={item.label} className="min-w-0" style={item.label === 'Valor Total' ? { paddingLeft: '1rem' } : undefined}>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                      {item.label}
                    </div>
                    <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: item.label === 'Valor Total' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', overflowWrap: 'anywhere' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
                <div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Status
                  </div>
                  <span
                    className="inline-flex items-center px-2.5 py-1"
                    style={{
                      backgroundColor:
                        solicitacao.status === 'APROVADA'
                          ? 'rgba(34, 197, 94, 0.12)'
                          : solicitacao.status === 'ALOCADA'
                          ? 'rgba(59, 130, 246, 0.12)'
                          : solicitacao.status === 'RECUSADA'
                          ? 'rgba(249, 115, 22, 0.14)'
                          : solicitacao.status === 'CANCELADA'
                          ? 'rgba(239, 68, 68, 0.12)'
                          : 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      color:
                        solicitacao.status === 'APROVADA'
                          ? '#22c55e'
                          : solicitacao.status === 'ALOCADA'
                          ? 'rgb(59, 130, 246)'
                          : solicitacao.status === 'RECUSADA'
                          ? '#f97316'
                          : solicitacao.status === 'CANCELADA'
                          ? '#dc2626'
                          : 'var(--primary)',
                      border: `1px solid ${
                        solicitacao.status === 'APROVADA'
                          ? 'rgba(34, 197, 94, 0.3)'
                          : solicitacao.status === 'ALOCADA'
                          ? 'rgba(59, 130, 246, 0.3)'
                          : solicitacao.status === 'RECUSADA'
                          ? 'rgba(249, 115, 22, 0.35)'
                          : solicitacao.status === 'CANCELADA'
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'color-mix(in srgb, var(--primary) 28%, transparent)'
                      }`,
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {statusLabel(solicitacao.status)}
                  </span>
                </div>
                <div style={{ paddingLeft: '1rem' }}>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                    Relatório Enviado
                  </div>
                  <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}>
                    {relatorioEnviadoDiaria(solicitacao)}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--muted-foreground)' }} />
            </div>
          </button>
        ))}
        {minhasDiariasFiltradas.length > diariaPageSize && (
          <ListPagination
            currentPage={minhasDiariasSafePage}
            totalPages={minhasDiariasTotalPages}
            onPageChange={setMinhasDiariasPage}
          />
        )}
        {minhasDiariasFiltradas.length === 0 && (
          <div
            className="p-5"
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
            }}
          >
            Nenhuma diária encontrada para os filtros selecionados.
          </div>
        )}
      </div>
    </section>
  );

  const isNovaSolicitacaoDiaria = activeFlow === 'diarias' && activeDiariaTab === 'nova';
  const solicitacaoDetalhe = solicitacaoDetalheId
    ? solicitacoesDiaria.find((solicitacao) => solicitacao.id === solicitacaoDetalheId)
    : null;
  const diariaSomenteLeitura = Boolean(solicitacaoDetalheId);
  const mostrarExcluirDiariaDetalheCoordenador =
    accessType === 'coordenador' &&
    activeFlow === 'diarias' &&
    activeDiariaTab === 'nova' &&
    Boolean(solicitacaoDetalheId) &&
    solicitacaoDetalhe?.status === 'ALOCADA' &&
    !mostrarMotivoCancelamento;
  const temDiariaPendenteBolsista = solicitacoesDiaria.some((solicitacao) => solicitacao.bolsistaNome === bolsistaAtual && statusPendenteAceite(solicitacao));

  const renderComprovacaoAtividadeCard = (comprovacaoEditavel: boolean, mostrarNumeroEtapa = false, somenteVisualizacao = false) => (
    <>
    <div
      className="mt-6 p-5"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        opacity: comprovacaoEditavel ? 1 : 0.72,
      }}
    >
      <div className="mb-5">
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {mostrarNumeroEtapa && (
              <span
                className="flex items-center justify-center"
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                  flexShrink: 0,
                }}
              >
                2
              </span>
            )}
            <h2 style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              Relatório da Diária
            </h2>
            {!comprovacaoEditavel && !mostrarNumeroEtapa && (
              <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>
                Disponível para edição após a data de partida.
              </span>
            )}
          </div>
          <p
            style={{
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              margin: mostrarNumeroEtapa ? '0.35rem 0 0 calc(22px + 0.5rem)' : '0.35rem 0 0',
            }}
          >
            Após a data da Diária, envie informações sobre a execução da atividade que motivou a Diária.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <label className="block" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
          Descreva a atividade realizada
          <textarea
            value={descricaoComprovacaoAtividade}
            onChange={(event) => setDescricaoComprovacaoAtividade(event.target.value)}
            disabled={!comprovacaoEditavel}
            rows={4}
            placeholder="Contextualize o que foi executado"
            className="mt-2 w-full px-3 py-2"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              resize: 'vertical',
              cursor: comprovacaoEditavel ? 'text' : 'not-allowed',
            }}
          />
        </label>

        {!somenteVisualizacao && (
          <>
            <div
              className="p-8 flex flex-col items-center justify-center text-center"
              onDragOver={(event) => {
                event.preventDefault();
                if (comprovacaoEditavel) setIsComprovacaoDragging(true);
              }}
              onDragLeave={() => setIsComprovacaoDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsComprovacaoDragging(false);
                if (!comprovacaoEditavel) return;
                adicionarArquivosComprovacaoAtividade(Array.from(event.dataTransfer.files ?? []));
              }}
              onClick={() => {
                if (comprovacaoEditavel) comprovacaoFileInputRef.current?.click();
              }}
              style={{
                backgroundColor: 'transparent',
                border: `2px dashed ${isComprovacaoDragging ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed',
                minHeight: '180px',
                transition: 'all .2s',
              }}
            >
              <div style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                <Upload size={32} />
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: '0 0 1.25rem' }}>
                Arraste e solte o arquivo aqui ou
              </p>
              <button
                type="button"
                disabled={!comprovacaoEditavel}
                className="inline-flex items-center gap-2 px-4 py-2"
                style={{
                  backgroundColor: 'transparent',
                  color: comprovacaoEditavel ? 'var(--foreground)' : 'var(--muted-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-family)',
                  cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed',
                  transition: 'all .2s',
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  if (comprovacaoEditavel) comprovacaoFileInputRef.current?.click();
                }}
                onMouseEnter={(event) => {
                  if (comprovacaoEditavel) event.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Paperclip size={16} />
                Anexar Arquivo
              </button>
            </div>
            <input
              ref={comprovacaoFileInputRef}
              type="file"
              className="hidden"
              multiple
              disabled={!comprovacaoEditavel}
              onChange={(event) => {
                adicionarArquivosComprovacaoAtividade(Array.from(event.target.files ?? []));
                event.target.value = '';
              }}
            />
          </>
        )}
        {arquivosComprovacaoAtividade.length > 0 && (
          <div className="space-y-2">
            {arquivosComprovacaoAtividade.map((file, index) => {
              const isEditing = arquivoComprovacaoEditandoIdx === index;
              const isExpanded = arquivoComprovacaoExpandidoIdx === index;

              return (
                <div key={`${file.name}-${index}`}>
                  <div
                    className="p-4 flex items-center gap-4"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={nomeArquivoComprovacaoTemporario}
                          onChange={(event) => setNomeArquivoComprovacaoTemporario(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') confirmarEdicaoNomeArquivoComprovacao(index);
                            if (event.key === 'Escape') {
                              setArquivoComprovacaoEditandoIdx(null);
                              setNomeArquivoComprovacaoTemporario('');
                            }
                          }}
                          autoFocus
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--primary)',
                            outline: 'none',
                            fontSize: 'var(--text-sm)',
                            fontFamily: 'var(--font-family)',
                            color: 'var(--foreground)',
                            width: '100%',
                            padding: '2px 0',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', color: 'var(--foreground)', overflowWrap: 'anywhere' }}>
                          {nomesArquivosComprovacaoAtividade[index]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => confirmarEdicaoNomeArquivoComprovacao(index)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'rgb(34,197,94)', display: 'flex', borderRadius: 'var(--radius)' }}
                          >
                            <Check size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setArquivoComprovacaoEditandoIdx(null);
                              setNomeArquivoComprovacaoTemporario('');
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)' }}
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={!comprovacaoEditavel}
                            onClick={() => {
                              setArquivoComprovacaoEditandoIdx(index);
                              setNomeArquivoComprovacaoTemporario(nomesArquivosComprovacaoAtividade[index]);
                            }}
                            style={{ background: 'none', border: 'none', cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'background-color .2s' }}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            type="button"
                            disabled={!comprovacaoEditavel}
                            onClick={() => removerArquivoComprovacaoAtividade(index)}
                            style={{ background: 'none', border: 'none', cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'background-color .2s' }}
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setArquivoComprovacaoExpandidoIdx(isExpanded ? null : index)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'all .2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          >
                            <ChevronDown size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div
                      className="mt-2 p-4"
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      Arquivo selecionado: <span style={{ color: 'var(--foreground)' }}>{file.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    {!somenteVisualizacao && (
    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
      <button
        type="button"
        disabled={!comprovacaoEditavel}
        className="px-4 py-2 flex items-center justify-center gap-2"
        style={{
          backgroundColor: 'transparent',
          color: comprovacaoEditavel ? 'var(--foreground)' : 'var(--muted-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed',
        }}
      >
        <Save size={16} />
        Salvar Rascunho
      </button>
      <button
        type="button"
        disabled={!comprovacaoEditavel}
        className="px-4 py-2 flex items-center justify-center gap-2"
        style={{
          backgroundColor: comprovacaoEditavel ? 'var(--primary)' : 'var(--muted)',
          color: comprovacaoEditavel ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed',
        }}
      >
        <Send size={16} />
        Enviar Comprovação
      </button>
    </div>
    )}
  </>
  );

  const renderDetalhesBolsistaDiaria = () => {
    if (!solicitacaoDetalhe) return null;

    const comprovacaoEditavel = !dataInicioAindaNaoPassou(solicitacaoDetalhe.partida);

    return (
      <section className="mb-8">
        <div
          className="p-5"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div className="mb-5">
            <h2 style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
              Informações Gerais
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            {[
              { label: 'Bolsista', value: solicitacaoDetalhe.bolsistaNome },
              { label: 'Tipo de Viagem', value: tiposViagem.find((tipo) => tipo.codigo === solicitacaoDetalhe.tipoViagem)?.nome ?? '-' },
              { label: 'Diária', value: solicitacaoDetalhe.quantidade.toLocaleString('pt-BR') },
              { label: 'Valor', value: currency.format(solicitacaoDetalhe.valorTotal) },
              { label: 'Origem', value: solicitacaoDetalhe.origem },
              { label: 'Destino', value: solicitacaoDetalhe.destino },
              { label: 'Partida', value: new Date(solicitacaoDetalhe.partida).toLocaleString('pt-BR') },
              { label: 'Chegada', value: new Date(solicitacaoDetalhe.chegada).toLocaleString('pt-BR') },
              { label: 'Status', value: statusLabel(solicitacaoDetalhe.status) },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <span style={{ display: 'block', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                  {item.label}
                </span>
                <strong style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', overflowWrap: 'anywhere' }}>
                  {item.value}
                </strong>
              </div>
            ))}
            <div className="min-w-0 lg:col-span-3">
              <span style={{ display: 'block', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                Motivo
              </span>
              <strong style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', overflowWrap: 'anywhere', lineHeight: 1.6 }}>
                {solicitacaoDetalhe.motivo}
              </strong>
            </div>
          </div>
        </div>

        {renderComprovacaoAtividadeCard(comprovacaoEditavel)}

        <div
          className="hidden mt-6 p-5"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            opacity: comprovacaoEditavel ? 1 : 0.72,
          }}
        >
          <div className="mb-5">
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <h2 style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                  Relatório da Diária
                </h2>
                {!comprovacaoEditavel && !mostrarNumeroEtapa && (
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>
                    Disponível para edição após a data de partida.
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', margin: '0.35rem 0 0' }}>
                Após a data da Diária, envie informações sobre a execução da atividade que motivou a Diária.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
              Descreva a atividade realizada
              <textarea
                value={descricaoComprovacaoAtividade}
                onChange={(event) => setDescricaoComprovacaoAtividade(event.target.value)}
                disabled={!comprovacaoEditavel}
                rows={4}
                placeholder="Contextualize o que foi executado"
                className="mt-2 w-full px-3 py-2"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  resize: 'vertical',
                  cursor: comprovacaoEditavel ? 'text' : 'not-allowed',
                }}
              />
            </label>

            <div
              className="p-8 flex flex-col items-center justify-center text-center"
              onDragOver={(event) => {
                event.preventDefault();
                if (comprovacaoEditavel) setIsComprovacaoDragging(true);
              }}
              onDragLeave={() => setIsComprovacaoDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsComprovacaoDragging(false);
                if (!comprovacaoEditavel) return;

                adicionarArquivosComprovacaoAtividade(Array.from(event.dataTransfer.files ?? []));
              }}
              onClick={() => {
                if (comprovacaoEditavel) comprovacaoFileInputRef.current?.click();
              }}
              style={{
                backgroundColor: 'transparent',
                border: `2px dashed ${isComprovacaoDragging ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed',
                minHeight: '180px',
                transition: 'all .2s',
              }}
            >
              <div style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                <Upload size={32} />
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', margin: '0 0 1.25rem' }}>
                Arraste e solte o arquivo aqui ou
              </p>
              <button
                type="button"
                disabled={!comprovacaoEditavel}
                className="inline-flex items-center gap-2 px-4 py-2"
                style={{
                  backgroundColor: 'transparent',
                  color: comprovacaoEditavel ? 'var(--foreground)' : 'var(--muted-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-family)',
                  cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed',
                  transition: 'all .2s',
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  if (comprovacaoEditavel) comprovacaoFileInputRef.current?.click();
                }}
                onMouseEnter={(event) => {
                  if (comprovacaoEditavel) event.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Paperclip size={16} />
                Anexar Arquivo
              </button>
            </div>
            <input
              ref={comprovacaoFileInputRef}
              type="file"
              className="hidden"
              multiple
              disabled={!comprovacaoEditavel}
              onChange={(event) => {
                adicionarArquivosComprovacaoAtividade(Array.from(event.target.files ?? []));
                event.target.value = '';
              }}
            />
            {arquivosComprovacaoAtividade.length > 0 && (
              <div className="space-y-2">
                {arquivosComprovacaoAtividade.map((file, index) => {
                  const isEditing = arquivoComprovacaoEditandoIdx === index;
                  const isExpanded = arquivoComprovacaoExpandidoIdx === index;

                  return (
                    <div key={`${file.name}-${index}`}>
                      <div
                        className="p-4 flex items-center gap-4"
                        style={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                          {isEditing ? (
                            <input
                              type="text"
                              value={nomeArquivoComprovacaoTemporario}
                              onChange={(event) => setNomeArquivoComprovacaoTemporario(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') confirmarEdicaoNomeArquivoComprovacao(index);
                                if (event.key === 'Escape') {
                                  setArquivoComprovacaoEditandoIdx(null);
                                  setNomeArquivoComprovacaoTemporario('');
                                }
                              }}
                              autoFocus
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--primary)',
                                outline: 'none',
                                fontSize: 'var(--text-sm)',
                                fontFamily: 'var(--font-family)',
                                color: 'var(--foreground)',
                                width: '100%',
                                padding: '2px 0',
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)', color: 'var(--foreground)', overflowWrap: 'anywhere' }}>
                              {nomesArquivosComprovacaoAtividade[index]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => confirmarEdicaoNomeArquivoComprovacao(index)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'rgb(34,197,94)', display: 'flex', borderRadius: 'var(--radius)' }}
                              >
                                <Check size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setArquivoComprovacaoEditandoIdx(null);
                                  setNomeArquivoComprovacaoTemporario('');
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)' }}
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={!comprovacaoEditavel}
                                onClick={() => {
                                  setArquivoComprovacaoEditandoIdx(index);
                                  setNomeArquivoComprovacaoTemporario(nomesArquivosComprovacaoAtividade[index]);
                                }}
                                style={{ background: 'none', border: 'none', cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'background-color .2s' }}
                                onMouseEnter={(event) => {
                                  if (comprovacaoEditavel) event.currentTarget.style.backgroundColor = 'var(--muted)';
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                type="button"
                                disabled={!comprovacaoEditavel}
                                onClick={() => removerArquivoComprovacaoAtividade(index)}
                                style={{ background: 'none', border: 'none', cursor: comprovacaoEditavel ? 'pointer' : 'not-allowed', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'background-color .2s' }}
                                onMouseEnter={(event) => {
                                  if (comprovacaoEditavel) event.currentTarget.style.backgroundColor = 'var(--muted)';
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Trash2 size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setArquivoComprovacaoExpandidoIdx(isExpanded ? null : index)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--muted-foreground)', display: 'flex', borderRadius: 'var(--radius)', transition: 'all .2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                onMouseEnter={(event) => {
                                  event.currentTarget.style.backgroundColor = 'var(--muted)';
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <ChevronDown size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {isExpanded && (
                        <div
                          className="mt-2 p-4"
                          style={{
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--muted-foreground)',
                            fontSize: 'var(--text-sm)',
                          }}
                        >
                          Arquivo selecionado: <span style={{ color: 'var(--foreground)' }}>{file.name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {mostrarJustificativaRecusa && (
          <div
            className="mt-6 p-5"
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
          >
            <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
              Justificativa da Recusa
              <textarea
                value={justificativaRecusa}
                onChange={(event) => setJustificativaRecusa(event.target.value)}
                rows={3}
                className="mt-2 w-full px-3 py-2"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  resize: 'vertical',
                }}
              />
            </label>
          </div>
        )}

        {solicitacaoDetalhe.status === 'ALOCADA' && dataInicioAindaNaoPassou(solicitacaoDetalhe.partida) && (
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            {mostrarJustificativaRecusa ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarJustificativaRecusa(false);
                    setJustificativaRecusa('');
                  }}
                  className="px-4 py-2"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={recusarSolicitacaoDetalhe}
                  disabled={!justificativaRecusa.trim()}
                  className="px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: justificativaRecusa.trim() ? 'var(--primary)' : 'var(--muted)',
                    color: justificativaRecusa.trim() ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: justificativaRecusa.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  Confirmar Recusa
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setMostrarJustificativaRecusa(true)}
                  className="px-4 py-2"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--primary)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Recusar
                </button>
                <button
                  type="button"
                  onClick={() => solicitarAceiteDiaria(solicitacaoDetalhe.id)}
                  className="px-4 py-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Aceitar
                </button>
              </>
            )}
          </div>
        )}
      </section>
    );
  };

  const renderModaisDiaria = () => (
    <>
      {confirmarCriacaoDiariaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.58)' }}>
          <div
            className="w-full max-w-md p-6"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)' }}
          >
            <h2 style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', margin: '0 0 0.75rem 0' }}>
              Confirmar solicitação
            </h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Após solicitar a diária, o bolsista precisa aceitar a solicitação na própria conta para que o fluxo avance.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmarCriacaoDiariaOpen(false)}
                className="px-4 py-2"
                style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={criarSolicitacaoDiaria}
                className="px-4 py-2"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmarAceiteDiariaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.58)' }}>
          <div
            className="w-full max-w-md p-6"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)' }}
          >
            <h2 style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', margin: '0 0 0.75rem 0' }}>
              Confirmar aceite
            </h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Confirme que você aceita a diária e está ciente das informações registradas na solicitação.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmarAceiteDiariaId(null)}
                className="px-4 py-2"
                style={{ backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => aceitarDiaria(confirmarAceiteDiariaId)}
                className="px-4 py-2"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (accessType === 'bolsista') {
    return (
      <div className="w-full px-4 md:px-8 py-8">
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              {activeFlow === 'diarias' ? (
                <BreadcrumbLink asChild>
                  <button
                    type="button"
                    onClick={() => setActiveFlow(null)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--muted-foreground)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      padding: 0,
                    }}
                  >
                    Solicitações
                  </button>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>Solicitações</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {activeFlow === 'diarias' && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {activeDiariaTab === 'nova' ? (
                    <BreadcrumbLink asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setSolicitacaoDetalheId(null);
                          setActiveDiariaTab('minhas');
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--muted-foreground)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-sm)',
                          padding: 0,
                        }}
                      >
                        Diária
                      </button>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>Diária</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            }}
          >
            {activeFlow === 'diarias' ? <Hotel size={20} /> : <ClipboardList size={20} />}
          </div>
          <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
            {activeFlow === 'diarias' ? (activeDiariaTab === 'nova' ? 'Detalhes da Diária' : 'Diárias') : 'Solicitações'}
          </h1>
        </div>

        <p
          className="mb-8"
          style={{
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            marginLeft: 'calc(32px + 0.75rem)',
          }}
        >
          {activeFlow === 'diarias'
            ? activeDiariaTab === 'nova'
              ? 'Confira as informações da solicitação da Diária.'
              : 'Visualize suas viagens e aceite ou recuse o termo de diária quando houver solicitação pendente.'
            : 'Acesse documentos, informes e suas solicitações vinculadas ao projeto.'}
        </p>
        <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }} />

        {activeFlow === 'diarias' ? (
          <>
            {activeDiariaTab === 'nova' ? renderDetalhesBolsistaDiaria() : renderMinhasDiarias()}
          </>
        ) : (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {[
                {
                  key: 'termo' as const,
                  title: 'Termo de Compromisso',
                  text: 'O Coordenador e o Bolsista devem aceitar o documento antes do início das atividades.',
                },
                {
                  key: 'declaracao' as const,
                  title: 'Declaração de Participação no Projeto',
                  text: 'Este documento comprova a participação no projeto de pesquisa como bolsista.',
                },
              ].map((card) => (
                <div
                  key={card.key}
                  onClick={() => setSelectedOption(selectedOption === card.key ? null : card.key)}
                  className="p-5 transition-all cursor-pointer flex flex-col h-full"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                    borderTop: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                    borderRight: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                    borderBottom: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                    borderLeft: selectedOption === card.key ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                    borderRadius: 'var(--radius)',
                    minHeight: '160px',
                  }}
                >
                  <h3 style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 1rem 0' }}>
                    {card.title}
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: 0 }}>
                    {card.text}
                  </p>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setActiveFlow('diarias')}
                className="p-5 transition-all cursor-pointer flex flex-col h-full text-left"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--primary) 18%, transparent)',
                  borderRadius: 'var(--radius)',
                  minHeight: '160px',
                  width: '100%',
                }}
              >
                <div className="flex items-start justify-between gap-3" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: 0 }}>
                    Diárias
                  </h3>
                  {temDiariaPendenteBolsista && (
                    <span
                      className="px-2 py-1"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                        color: 'var(--primary)',
                        border: '1px solid color-mix(in srgb, var(--primary) 28%, transparent)',
                        borderRadius: '9999px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Pendente
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: 0 }}>
                  Visualize suas viagens e aceite ou recuse o termo de diária quando houver solicitação pendente.
                </p>
              </button>
              <div
                onClick={() => setSelectedOption(selectedOption === 'informe' ? null : 'informe')}
                className="p-5 transition-all cursor-pointer flex flex-col h-full"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                  borderTop: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderRight: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderBottom: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderLeft: selectedOption === 'informe' ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderRadius: 'var(--radius)',
                  minHeight: '160px',
                }}
              >
                <h3 style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 1rem 0' }}>
                  Informe de Rendimentos
                </h3>
                <p style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
                  Gere seu IR para a declaração do Imposto de Renda da Pessoa Física (DIRPF).
                </p>
                <label style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', display: 'block', marginBottom: '0.5rem' }}>
                  Selecione o ano:
                </label>
                <div className="w-full md:w-[200px]">
                  <Dropdown
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={[
                      { value: '2024', label: '2024' },
                      { value: '2023', label: '2023' },
                      { value: '2022', label: '2022' },
                      { value: '2021', label: '2021' },
                    ]}
                    showSelectedIcon={false}
                  />
                </div>
              </div>
            </section>

            {selectedOption && (
              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  <FileText size={16} />
                  <span>Gerar Documento</span>
                </button>
              </div>
            )}
          </>
        )}
        {renderModaisDiaria()}
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {activeFlow === 'diarias' && (
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button
                  type="button"
                  onClick={() => setActiveFlow(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    padding: 0,
                  }}
                >
                  Solicitações
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button
                  type="button"
                  onClick={() => setActiveDiariaTab('solicitadas')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    padding: 0,
                  }}
                >
                  Diária
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {isNovaSolicitacaoDiaria && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {solicitacaoDetalheId ? 'Detalhes' : 'Criar Diária'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            }}
          >
            {activeFlow === 'diarias' ? <Hotel size={20} /> : <ClipboardList size={20} />}
          </div>
          <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
            {isNovaSolicitacaoDiaria ? (solicitacaoDetalheId ? 'Detalhes da Diária' : 'Criar Diária') : activeFlow === 'diarias' ? 'Diária' : 'Solicitações'}
          </h1>
        </div>
      </div>

      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        style={{ margin: '0.5rem 0 1.5rem calc(32px + 0.75rem)', position: 'relative' }}
      >
        <p
          style={{
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            margin: 0,
          }}
        >
          {isNovaSolicitacaoDiaria
            ? solicitacaoDetalheId
              ? 'Confira as informações da solicitação da Diária.'
              : 'Preencha as informações abaixo para criar uma nova Diária.'
            : activeFlow === 'diarias'
            ? 'Controle solicitações, aceites e remoções de diárias da iniciativa.'
            : 'Solicite diárias, acompanhe aceites e emita documentos da iniciativa.'}
        </p>
        {mostrarExcluirDiariaDetalheCoordenador && (
          <button
            type="button"
            onClick={() => setMostrarMotivoCancelamento(true)}
            className="px-4 py-2 flex items-center justify-center gap-2"
            style={{
              position: 'absolute',
              right: 0,
              top: '-0.75rem',
              backgroundColor: 'transparent',
              color: 'var(--destructive-foreground)',
              border: '1px solid color-mix(in srgb, var(--destructive-foreground) 35%, var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              whiteSpace: 'nowrap',
            }}
          >
            <Trash2 size={16} />
            Excluir
          </button>
        )}
        {activeFlow === 'diarias' && !isNovaSolicitacaoDiaria && (
          <button
            onClick={abrirNovaSolicitacaoDiaria}
            className="px-4 py-2 flex items-center justify-center gap-2 self-start md:self-auto"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={16} />
            Criar Diária
          </button>
        )}
      </div>
      {!(activeFlow === 'diarias' && !isNovaSolicitacaoDiaria) && (
        <div style={{ borderBottom: '1px solid var(--border)', marginBottom: isNovaSolicitacaoDiaria ? '1rem' : '2rem' }} />
      )}

      {activeFlow === 'diarias' ? (
        <>
          {!isNovaSolicitacaoDiaria && (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Valor Total Disponível', value: currency.format(totalDisponivelDashboard), icon: Banknote, tint: '#22d3ee' },
                  { label: 'Valor Alocado', value: currency.format(valorAlocadoDashboard), icon: Coins, tint: '#22d3ee' },
                  { label: 'Valor Utilizado', value: currency.format(valorUtilizadoDashboard), icon: CircleDollarSign, tint: '#22d3ee' },
                  { label: 'Saldo Disponível', value: currency.format(saldoDisponivelDashboard), icon: PiggyBank, tint: '#22d3ee' },
                ].map((card) => {
                  const Icon = card.icon;

                  return (
                    <article
                      key={card.label}
                      className="p-5"
                      style={{
                        minHeight: '116px',
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="p-2"
                          style={{
                            color: card.tint,
                            borderRadius: 'var(--radius)',
                            backgroundColor: `color-mix(in srgb, ${card.tint} 18%, transparent)`,
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                          {card.label}
                        </span>
                      </div>
                      <strong
                        className="block mt-5 text-center"
                        style={{ color: 'var(--foreground)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-semibold)' }}
                      >
                        {card.value}
                      </strong>
                    </article>
                  );
                })}
              </section>
            </>
          )}

          {!isNovaSolicitacaoDiaria && (
          <div
            className="hidden md:flex gap-1 mb-6"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {[
              { key: 'solicitadas' as DiariaTab, label: 'Diárias Solicitadas' },
              { key: 'minhas' as DiariaTab, label: 'Minhas Diárias' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveDiariaTab(tab.key)}
                style={{
                  padding: '0.625rem 1rem',
                  backgroundColor: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: activeDiariaTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                  color: activeDiariaTab === tab.key ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          )}

          {activeDiariaTab === 'minhas' ? (
            renderMinhasDiarias()
          ) : activeDiariaTab === 'nova' ? (
            <section className="mb-8">
              <div
                className="p-5"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '999px',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-normal)',
                      flexShrink: 0,
                    }}
                  >
                    1
                  </span>
                  <h2
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'inherit',
                      fontWeight: 'var(--font-weight-normal)',
                      margin: 0,
                    }}
                  >
                    Informações Gerais
                  </h2>
                </div>
                <p
                  style={{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.6,
                    margin: '-0.75rem 0 1.5rem 2.25rem',
                  }}
                >
                  O valor da diária deve ser transferido da conta do projeto para a conta bancária Banestes do bolsista individualmente.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    Tipo de Viagem
                    <div className="mt-2">
                      <Dropdown
                      value={tipoViagemSelecionado}
                      onChange={(value) => alterarTipoViagem(value as TipoViagemCodigo)}
                      placeholder="Selecione o tipo de viagem"
                      disabled={diariaSomenteLeitura}
                      showSelectedIcon={false}
                      options={[
                        { value: 'DENTRO_ESTADO', label: 'Dentro do estado - R$ 260 - 12h' },
                        { value: 'FORA_ESTADO', label: 'Nacional - R$ 320 - 12h' },
                        { value: 'INTERNACIONAL', label: 'Internacional - R$ 620 - 24h' },
                      ]}
                      />
                    </div>
                  </label>

                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px_150px] gap-4">
                      <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Ida - Origem
                        <div className="mt-2">
                          <Dropdown
                          value={origem}
                          onChange={setOrigem}
                          placeholder="Selecione a origem"
                          disabled={diariaSomenteLeitura}
                          showSelectedIcon={false}
                          options={origensDiaria.map((localidade) => ({ value: localidade, label: localidade }))}
                          />
                        </div>
                      </label>
                      <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Destino
                        <div className="mt-2">
                          {tipoViagemSelecionado === 'INTERNACIONAL' ? (
                            <input
                              value={destino}
                              onChange={(event) => setDestino(event.target.value)}
                              disabled={diariaSomenteLeitura}
                              placeholder="Digite o destino"
                              className="w-full px-3 py-2"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                color: 'var(--foreground)',
                                fontSize: 'var(--text-sm)',
                              }}
                            />
                          ) : (
                            <Dropdown
                            value={destino}
                            onChange={alterarDestino}
                            placeholder="Selecione o destino"
                            disabled={diariaSomenteLeitura}
                            options={destinosDiaria.map((item) => ({ value: item.value, label: item.label }))}
                            />
                          )}
                        </div>
                      </label>
                      <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Data da Ida
                        <input
                          type="date"
                          value={partidaData}
                          onChange={(event) => setPartida((current) => combinarDataHora(current, event.target.value, 'data'))}
                          disabled={diariaSomenteLeitura}
                          className="mt-2 w-full px-3 py-2"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                          }}
                        />
                      </label>
                      <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Horário
                        <input
                          type="time"
                          step="1"
                          value={partidaHorario}
                          onChange={(event) => setPartida((current) => combinarDataHora(current, event.target.value, 'hora'))}
                          disabled={diariaSomenteLeitura}
                          className="mt-2 w-full px-3 py-2"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px_150px] gap-4">
                      <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Volta - Origem
                        <div className="mt-2">
                          {tipoViagemSelecionado === 'INTERNACIONAL' ? (
                            <input
                              value={destino}
                              onChange={(event) => setDestino(event.target.value)}
                              disabled={diariaSomenteLeitura}
                              placeholder="Digite a origem da volta"
                              className="w-full px-3 py-2"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                color: 'var(--foreground)',
                                fontSize: 'var(--text-sm)',
                              }}
                            />
                          ) : (
                            <Dropdown
                            value={destino}
                            onChange={alterarDestino}
                            placeholder="Selecione a origem da volta"
                            disabled={diariaSomenteLeitura}
                            options={destinosDiaria.map((item) => ({ value: item.value, label: item.label }))}
                            />
                          )}
                        </div>
                      </label>
                      <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Destino
                        <div className="mt-2">
                          <Dropdown
                          value={origem}
                          onChange={setOrigem}
                          placeholder="Selecione o destino da volta"
                          disabled={diariaSomenteLeitura}
                          showSelectedIcon={false}
                          options={origensDiaria.map((localidade) => ({ value: localidade, label: localidade }))}
                          />
                        </div>
                      </label>
                      <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Data da Volta
                        <input
                          type="date"
                          value={chegadaData}
                          onChange={(event) => setChegada((current) => combinarDataHora(current, event.target.value, 'data'))}
                          disabled={diariaSomenteLeitura}
                          className="mt-2 w-full px-3 py-2"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                          }}
                        />
                      </label>
                      <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        Horário
                        <input
                          type="time"
                          step="1"
                          value={chegadaHorario}
                          onChange={(event) => setChegada((current) => combinarDataHora(current, event.target.value, 'hora'))}
                          disabled={diariaSomenteLeitura}
                          className="mt-2 w-full px-3 py-2"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {!solicitacaoDetalheId && (
                    <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                      Distância (mínima de 150 km)
                      <div
                        className="mt-2 px-3 py-2"
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        <span style={{ color: bloqueioDistanciaMinima ? 'var(--destructive-foreground)' : 'var(--foreground)' }}>
                          {distanciaDiariaTexto}
                        </span>
                      </div>
                    </label>
                  )}

                  {!solicitacaoDetalheId && (
                    <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                      Motivo
                      <textarea
                        value={motivo}
                        onChange={(event) => setMotivo(event.target.value)}
                        rows={4}
                        className="mt-2 w-full px-3 py-2"
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          resize: 'vertical',
                        }}
                      />
                    </label>
                  )}

                  <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    Equipe
                    <div className="mt-2">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                        <input
                          value={bolsistaSearch}
                          onFocus={() => setIsBolsistaDropdownOpen(true)}
                          onBlur={() => window.setTimeout(() => setIsBolsistaDropdownOpen(false), 120)}
                          onChange={(event) => {
                            setBolsistaSearch(event.target.value);
                            setIsBolsistaDropdownOpen(true);
                          }}
                          disabled={diariaSomenteLeitura}
                          placeholder="Digite ou selecione uma ou mais pessoas da equipe"
                          className="w-full pl-10 pr-3 py-2"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                          }}
                        />
                        {isBolsistaDropdownOpen && bolsistasEncontrados.length > 0 && (
                          <div
                            className="absolute z-50 w-full mt-1 overflow-hidden"
                            style={{
                              backgroundColor: 'var(--popover)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius)',
                              boxShadow: 'var(--elevation-sm)',
                            }}
                          >
                            {bolsistasEncontrados.map((nome) => (
                              <button
                                key={nome}
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                  adicionarBolsista(nome);
                                  setIsBolsistaDropdownOpen(false);
                                }}
                                className="w-full px-3 py-2.5 text-left transition-colors"
                                style={{
                                  backgroundColor: 'transparent',
                                  color: 'var(--foreground)',
                                  border: 'none',
                                  fontSize: 'var(--text-sm)',
                                  fontFamily: 'inherit',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(event) => {
                                  event.currentTarget.style.backgroundColor = 'var(--muted)';
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                {nome}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {selectedBolsistas.map((nome) => (
                      <span
                        key={nome}
                        className="px-3 py-2 flex items-center gap-2"
                        style={{
                          border: '1px solid var(--primary)',
                          borderRadius: '999px',
                          backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        {nome}
                        <button
                          type="button"
                          disabled={diariaSomenteLeitura}
                          onClick={() => removerBolsista(nome)}
                          aria-label={`Remover ${nome}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--muted-foreground)',
                            padding: 0,
                          }}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {solicitacaoDetalheId && (
                    <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                      Motivo
                      <textarea
                        value={motivo}
                        onChange={(event) => setMotivo(event.target.value)}
                        disabled={diariaSomenteLeitura}
                        rows={4}
                        className="mt-2 w-full px-3 py-2"
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          resize: 'vertical',
                        }}
                      />
                    </label>
                  )}

                  {!solicitacaoDetalheId && (
                    <div
                      className="p-5"
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                          Resumo da Diária no Projeto
                        </span>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)' }}>
                          Acompanhe o impacto desta solicitação no saldo disponível da rubrica de diária.
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        {[
                          {
                            label: 'Disponível atualmente',
                            value: currency.format(totalDisponivelDashboard),
                            Icon: Banknote,
                            helper: 'Saldo total da rubrica',
                          },
                          {
                            label: 'Consumo desta diária',
                            value: currency.format(valorTotalCalculado),
                            Icon: CircleDollarSign,
                            helper: selectedBolsistas.length > 1 ? `${selectedBolsistas.length} pessoas selecionadas` : '1 pessoa selecionada',
                          },
                          {
                            label: 'Saldo após solicitação',
                            value: currency.format(saldoProjetoAposSolicitacao),
                            Icon: PiggyBank,
                            helper: saldoProjetoAposSolicitacao < 0 ? 'Saldo insuficiente' : 'Saldo projetado',
                          },
                        ].map(({ label, value, Icon, helper }) => (
                          <div
                            key={label}
                            className="p-4"
                            style={{
                              backgroundColor: 'var(--muted)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius)',
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="flex items-center justify-center"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: 'var(--radius)',
                                  backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                                  color: 'var(--primary)',
                                  flexShrink: 0,
                                }}
                              >
                                <Icon size={17} />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <span style={{ display: 'block', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }}>
                                  {label}
                                </span>
                                <span
                                  style={{
                                    color: label === 'Saldo após solicitação' && saldoProjetoAposSolicitacao < 0 ? '#f87171' : 'var(--foreground)',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 'var(--font-weight-normal)',
                                  }}
                                >
                                  {value}
                                </span>
                                <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.75rem' }}>
                                  {helper}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          backgroundColor: 'color-mix(in srgb, var(--muted-foreground) 20%, transparent)',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          marginTop: '1rem',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, Math.max(0, (valorTotalCalculado / Math.max(totalDisponivelDashboard, 1)) * 100))}%`,
                            height: '100%',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '999px',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {!diariaFormIncompleto && solicitacaoBloqueada && !bloqueioDistanciaMinima && !solicitacaoExcedeSaldo && (
                    <div
                      role="alert"
                      className="p-3"
                      style={{
                        border: '1px solid color-mix(in srgb, var(--destructive-foreground) 35%, var(--border))',
                        borderRadius: 'var(--radius)',
                        backgroundColor: 'color-mix(in srgb, var(--destructive-foreground) 10%, var(--background))',
                        color: 'var(--destructive-foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {mensagemSolicitacaoDiaria}
                    </div>
                  )}
                  {!solicitacaoDetalheId && !diariaFormIncompleto && solicitacaoExcedeSaldo && (
                    <div
                      role="alert"
                      className="p-3"
                      style={{
                        border: '1px solid color-mix(in srgb, #dc2626 35%, var(--border))',
                        borderRadius: 'var(--radius)',
                        backgroundColor: 'color-mix(in srgb, #dc2626 10%, var(--background))',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                      }}
                    >
                      Você não possui disponível esse valor para usar em Diárias. Se precisar, você pode{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate?.('remanejamento')}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--foreground)',
                          cursor: 'pointer',
                          font: 'inherit',
                          fontWeight: 'var(--font-weight-medium)',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        Solicitar Remanejamento de Recursos.
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {solicitacaoDetalheId && solicitacaoDetalhe && (
                renderComprovacaoAtividadeCard(
                  !dataInicioAindaNaoPassou(solicitacaoDetalhe.partida),
                  true,
                )
              )}

              {solicitacaoDetalheId && mostrarMotivoCancelamento && (
                <div
                  className="mt-6 p-5"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    Motivo do Cancelamento
                    <textarea
                      value={justificativaCancelamento}
                      onChange={(event) => setJustificativaCancelamento(event.target.value)}
                      rows={3}
                      className="mt-2 w-full px-3 py-2"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        resize: 'vertical',
                      }}
                    />
                  </label>
                </div>
              )}

              {solicitacaoDetalheId && mostrarJustificativaRecusa && (
                <div
                  className="mt-6 p-5"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    Justificativa da Recusa
                    <textarea
                      value={justificativaRecusa}
                      onChange={(event) => setJustificativaRecusa(event.target.value)}
                      rows={3}
                      className="mt-2 w-full px-3 py-2"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        resize: 'vertical',
                      }}
                    />
                  </label>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                {solicitacaoDetalheId ? (
                  <>
                    {solicitacaoDetalheOrigem === 'minhas' && solicitacaoDetalhe?.status === 'ALOCADA' && dataInicioAindaNaoPassou(solicitacaoDetalhe.partida) ? (
                      mostrarJustificativaRecusa ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setMostrarJustificativaRecusa(false);
                              setJustificativaRecusa('');
                            }}
                            className="px-4 py-2"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--foreground)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={recusarSolicitacaoDetalhe}
                            disabled={!justificativaRecusa.trim()}
                            className="px-4 py-2 transition-colors"
                            style={{
                              backgroundColor: justificativaRecusa.trim() ? 'var(--primary)' : 'var(--muted)',
                              color: justificativaRecusa.trim() ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                              border: 'none',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                              cursor: justificativaRecusa.trim() ? 'pointer' : 'not-allowed',
                            }}
                          >
                            Confirmar Recusa
                          </button>
                        </>
	                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setMostrarJustificativaRecusa(true)}
                            className="px-4 py-2"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--primary)',
                              border: '1px solid var(--primary)',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            Recusar
                          </button>
                          <button
                            type="button"
                            onClick={() => solicitarAceiteDiaria(solicitacaoDetalheId)}
                            className="px-4 py-2"
                            style={{
                              backgroundColor: 'var(--primary)',
                              color: 'var(--primary-foreground)',
                              border: 'none',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            Aceitar
                          </button>
                        </>
                      )
                    ) : solicitacaoDetalhe?.status === 'CANCELADA' || (solicitacaoDetalhe?.status !== 'RECUSADA' && !dataInicioAindaNaoPassou(solicitacaoDetalhe?.partida ?? '')) ? null : mostrarMotivoCancelamento ? (
                      <button
                        type="button"
                        onClick={cancelarSolicitacaoDetalhe}
                        disabled={!justificativaCancelamento.trim()}
                        className="px-4 py-2 transition-colors"
                        style={{
                          backgroundColor: justificativaCancelamento.trim() ? 'var(--primary)' : 'var(--muted)',
                          color: justificativaCancelamento.trim() ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                          border: 'none',
                          borderRadius: 'var(--radius)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          cursor: justificativaCancelamento.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Confirmar Cancelamento
                      </button>
                    ) : null}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="px-4 py-2"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Salvar Rascunho
                    </button>
                    <button
                      onClick={confirmarSolicitacaoDiaria}
                      disabled={solicitacaoBloqueada}
                      className="px-4 py-2 transition-colors flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: solicitacaoBloqueada ? 'var(--muted)' : 'var(--primary)',
                        color: solicitacaoBloqueada ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        border: 'none',
                        cursor: solicitacaoBloqueada ? 'not-allowed' : 'pointer',
                        opacity: solicitacaoBloqueada ? 0.7 : 1,
                      }}
                    >
                      <ReceiptText size={16} />
                      Solicitar Diária
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px_220px_220px] gap-3 mb-4">
                <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                  Pesquisar
                  <div className="relative mt-2">
                    <input
                      value={diariaSearch}
                      onChange={(event) => setDiariaSearch(event.target.value)}
                      placeholder="Buscar"
                      className="w-full pl-3 pr-10 py-2"
                      style={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                      }}
                    />
                    <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  </div>
                </label>
                <div>
                  <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    Data de Partida
                  </label>
                  <div className="mt-2">
                    <Dropdown
                      value={diariaDataPartidaSort}
                      onChange={(value) => setDiariaDataPartidaSort(value as OrdenacaoDataPartida)}
                      showSelectedIcon={false}
                      options={[
                        { value: 'RECENTE', label: 'Próxima' },
                        { value: 'ANTIGA', label: 'Anterior' },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    Tipo de Viagem
                  </label>
                  <div className="mt-2">
                    <Dropdown
                      value={diariaTipoViagemFilter}
                      onChange={(value) => setDiariaTipoViagemFilter(value as TipoViagemCodigo | 'TODOS')}
                      options={[
                        { value: 'TODOS', label: 'Todos' },
                        { value: 'DENTRO_ESTADO', label: 'Dentro do Estado' },
                        { value: 'FORA_ESTADO', label: 'Nacional' },
                        { value: 'INTERNACIONAL', label: 'Internacional' },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                    Status
                  </label>
                  <div className="mt-2">
                    <Dropdown
                      value={diariaStatusFilter}
                      onChange={(value) => setDiariaStatusFilter(value as StatusDiaria | 'TODOS')}
                      options={[
                        { value: 'TODOS', label: 'Todos' },
                        { value: 'RASCUNHO', label: 'Rascunho' },
                        { value: 'ALOCADA', label: 'Aguardando Bolsista' },
                        { value: 'APROVADA', label: 'Aprovada' },
                        { value: 'RECUSADA', label: 'Recusada' },
                        { value: 'CANCELADA', label: 'Cancelada' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {renderListaInfo(diariasSolicitadasExibidas.length)}
                {diariasSolicitadasPaginadas.map((solicitacao) => (
                  <button
                    key={`${solicitacao.id}-${solicitacao.beneficiarioIndex}`}
                    type="button"
                    onClick={() => abrirDetalheSolicitacaoDiaria(solicitacao)}
                    className="w-full p-5 text-left transition-colors"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.backgroundColor = 'var(--muted)';
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.backgroundColor = 'var(--card)';
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
                      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                        {[
                          { label: 'Bolsista', value: solicitacao.beneficiario },
                          { label: 'Valor Total', value: currency.format(solicitacao.valorBeneficiario) },
                          { label: 'Período', value: formatarPeriodoDiaria(solicitacao.partida, solicitacao.chegada) },
                          { label: 'Destino', value: solicitacao.destino },
                        ].map((item) => (
                          <div key={item.label} className="min-w-0" style={item.label === 'Valor Total' ? { paddingLeft: '1rem' } : undefined}>
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                              {item.label}
                            </div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: item.label === 'Valor Total' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', overflowWrap: 'anywhere' }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                        <div>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Status
                          </div>
                          <span
                            className="inline-flex items-center px-2.5 py-1"
                            style={{
                              backgroundColor:
                                solicitacao.status === 'APROVADA'
                                  ? 'rgba(34, 197, 94, 0.12)'
                                  : solicitacao.status === 'ALOCADA'
                                  ? 'rgba(59, 130, 246, 0.12)'
                                  : solicitacao.status === 'RECUSADA'
                                  ? 'rgba(249, 115, 22, 0.14)'
                                  : solicitacao.status === 'CANCELADA'
                                  ? 'rgba(239, 68, 68, 0.12)'
                                  : 'color-mix(in srgb, var(--primary) 12%, transparent)',
                              color:
                                solicitacao.status === 'APROVADA'
                                  ? '#22c55e'
                                  : solicitacao.status === 'ALOCADA'
                                  ? 'rgb(59, 130, 246)'
                                  : solicitacao.status === 'RECUSADA'
                                  ? '#f97316'
                                  : solicitacao.status === 'CANCELADA'
                                  ? '#dc2626'
                                  : 'var(--primary)',
                              border: `1px solid ${
                                solicitacao.status === 'APROVADA'
                                  ? 'rgba(34, 197, 94, 0.3)'
                                  : solicitacao.status === 'ALOCADA'
                                  ? 'rgba(59, 130, 246, 0.3)'
                                  : solicitacao.status === 'RECUSADA'
                                  ? 'rgba(249, 115, 22, 0.35)'
                                  : solicitacao.status === 'CANCELADA'
                                  ? 'rgba(239, 68, 68, 0.3)'
                                  : 'color-mix(in srgb, var(--primary) 28%, transparent)'
                              }`,
                              borderRadius: '9999px',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-medium)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {statusLabel(solicitacao.status)}
                          </span>
                        </div>
                        <div style={{ paddingLeft: '1rem' }}>
                          <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }}>
                            Relatório Enviado
                          </div>
                          <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}>
                            {relatorioEnviadoDiaria(solicitacao)}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={20} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                  </button>
                ))}
                {diariasSolicitadasExibidas.length > diariaPageSize && (
                  <ListPagination
                    currentPage={diariasSolicitadasSafePage}
                    totalPages={diariasSolicitadasTotalPages}
                    onPageChange={setDiariasSolicitadasPage}
                  />
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {[
          {
            key: 'termo' as const,
            title: 'Termo de Compromisso',
            text: 'O Coordenador e o Bolsista devem aceitar o documento antes do início das atividades.',
          },
          {
            key: 'declaracao' as const,
            title: 'Declaração de Participação no Projeto',
            text: 'Este documento comprova a participação no projeto de pesquisa como bolsista.',
          },
        ].map((card) => (
          <div
            key={card.key}
            onClick={() => setSelectedOption(selectedOption === card.key ? null : card.key)}
            className="p-5 transition-all cursor-pointer flex flex-col h-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              borderTop: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRight: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderBottom: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderLeft: selectedOption === card.key ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRadius: 'var(--radius)',
              minHeight: '160px',
            }}
          >
            <h3 style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 1rem 0' }}>
              {card.title}
            </h3>
            <p style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: 0 }}>
              {card.text}
            </p>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setActiveFlow('diarias');
            setActiveDiariaTab('solicitadas');
          }}
          className="p-5 transition-all cursor-pointer flex flex-col h-full text-left"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 18%, transparent)',
            borderRadius: 'var(--radius)',
            minHeight: '160px',
            width: '100%',
          }}
        >
          <h3 style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 1rem 0' }}>
            Diárias
          </h3>
          <p style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: 0 }}>
            Entre no painel de controle para solicitar diárias, acompanhar aceites e remover solicitações antes do início.
          </p>
        </button>
        <div
          onClick={() => setSelectedOption(selectedOption === 'informe' ? null : 'informe')}
          className="p-5 transition-all cursor-pointer flex flex-col h-full"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderTop: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRight: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderBottom: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderLeft: selectedOption === 'informe' ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
            minHeight: '160px',
          }}
        >
          <h3 style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 1rem 0' }}>
            Informe de Rendimentos
          </h3>
          <p style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
            Gere seu IR para a declaração do Imposto de Renda da Pessoa Física (DIRPF).
          </p>
          <label style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)', display: 'block', marginBottom: '0.5rem' }}>
            Selecione o ano:
          </label>
          <div className="w-full md:w-[200px]">
            <Dropdown
              value={selectedYear}
              onChange={setSelectedYear}
              options={[
                { value: '2024', label: '2024' },
                { value: '2023', label: '2023' },
                { value: '2022', label: '2022' },
                { value: '2021', label: '2021' },
              ]}
              showSelectedIcon={false}
            />
          </div>
        </div>
      </section>

      {selectedOption && (
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 transition-colors flex items-center gap-2"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <FileText size={16} />
            <span>Gerar Documento</span>
          </button>
        </div>
      )}
        </>
      )}
      {renderModaisDiaria()}
    </div>
  );
}
