import {
  Calendar,
  CheckCheck,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  MapPin,
  PlaneTakeoff,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  X,
  WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Dropdown } from '@/app/components/Dropdown';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';

type DocumentoSolicitacao = 'declaracao' | 'informe' | 'termo' | null;
type StatusDiaria = 'ALOCADA' | 'APROVADA' | 'CANCELADA' | 'RECUSADA';
type DiariaTab = 'solicitadas' | 'nova' | 'minhas';
type AccessType = 'cidadao' | 'voluntario' | 'bolsista' | 'coordenador' | 'diretor' | 'reitor';
type TipoDiariaCodigo = 'NACIONAL' | 'INTERNACIONAL';
type TipoViagemCodigo = 'DENTRO_ESTADO' | 'FORA_ESTADO' | 'INTERNACIONAL';
type DiariaBeneficiarioItem = DiariaRequest & {
  beneficiario: string;
  beneficiarioIndex: number;
  valorBeneficiario: number;
};

interface CertificatesPageProps {
  accessType?: AccessType;
  initialFlow?: 'diarias' | null;
}

interface DiariaRequest {
  id: string;
  bolsistas: string[];
  partida: string;
  chegada: string;
  destino: string;
  motivo: string;
  status: StatusDiaria;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  tipoDiariaRef: string;
  tipoDiaria: TipoDiariaCodigo;
  tipoViagem: TipoViagemCodigo;
  regraCalculo: string;
  transacaoComprometimentoRef?: string;
  transacaoReversaoRef?: string;
  justificativaCancelamento?: string;
  justificativaRecusa?: string;
}

const coordenadorAtual = 'Mariana Costa';
const bolsistaAtual = 'Ana Souza';
const bolsistasDoProjeto = ['Ana Souza', 'Bruno Lima', 'Carla Nunes', 'Diego Rocha', 'Fernanda Alves', 'João Pedro Martins'];
const beneficiariosDoProjeto = [coordenadorAtual, ...bolsistasDoProjeto];
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
  { referencia: 'DIA-2026-001', tipoViagem: 'DENTRO_ESTADO' as const, valor: 260, fracaoCalculo: '12h', vigenciaInicio: '05/01/2026' },
  { referencia: 'DIA-2026-002', tipoViagem: 'FORA_ESTADO' as const, valor: 320, fracaoCalculo: '12h', vigenciaInicio: '05/01/2026' },
  { referencia: 'DIA-2026-003', tipoViagem: 'INTERNACIONAL' as const, valor: 620, fracaoCalculo: '24h', vigenciaInicio: '05/01/2026' },
];

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function calcularDiarias(partida: string, chegada: string) {
  if (!partida || !chegada) return 0;

  const inicioData = new Date(partida);
  const fimData = new Date(chegada);
  const inicio = inicioData.getTime();
  const fim = fimData.getTime();

  if (!Number.isFinite(inicio) || !Number.isFinite(fim) || fim <= inicio) return 0;

  const horas = (fim - inicio) / 36e5;
  if (horas < 6) return 0;

  const diaInicio = new Date(inicioData.getFullYear(), inicioData.getMonth(), inicioData.getDate()).getTime();
  const diaFim = new Date(fimData.getFullYear(), fimData.getMonth(), fimData.getDate()).getTime();
  const diasFora = Math.round((diaFim - diaInicio) / 86400000);

  if (diasFora <= 0) return 0.5;

  const horaRetorno = fimData.getHours() + fimData.getMinutes() / 60;

  return diasFora + (horaRetorno > 14 ? 0.5 : 0);
}

function statusLabel(status: StatusDiaria) {
  const labels = {
    ALOCADA: 'Alocada',
    APROVADA: 'Aprovada',
    CANCELADA: 'Cancelada',
    RECUSADA: 'Recusada',
  };

  return labels[status];
}

function statusPendenteAceite(status: StatusDiaria) {
  return status === 'ALOCADA';
}

function dataInicioAindaNaoPassou(partida: string) {
  const inicio = new Date(partida).getTime();
  return Number.isFinite(inicio) && inicio > Date.now();
}

export function CertificatesPage({ accessType = 'bolsista', initialFlow = null }: CertificatesPageProps) {
  const [selectedOption, setSelectedOption] = useState<DocumentoSolicitacao>(null);
  const [activeFlow, setActiveFlow] = useState<'diarias' | null>(initialFlow);
  const [activeDiariaTab, setActiveDiariaTab] = useState<DiariaTab>('solicitadas');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedBolsistas, setSelectedBolsistas] = useState<string[]>(['Ana Souza']);
  const [bolsistaSearch, setBolsistaSearch] = useState('');
  const [diariaSearch, setDiariaSearch] = useState('');
  const [diariaStatusFilter, setDiariaStatusFilter] = useState<StatusDiaria | 'TODOS'>('TODOS');
  const [minhasDiariasSearch, setMinhasDiariasSearch] = useState('');
  const [minhasDiariasFilter, setMinhasDiariasFilter] = useState<'TODAS' | 'NOVAS' | 'HISTORICO'>('TODAS');
  const [partida, setPartida] = useState('2026-06-10T08:00');
  const [chegada, setChegada] = useState('2026-06-12T18:00');
  const [tipoViagemSelecionado, setTipoViagemSelecionado] = useState<TipoViagemCodigo>('DENTRO_ESTADO');
  const [destino, setDestino] = useState('Vitória/ES');
  const [motivo, setMotivo] = useState('Participação em atividade técnica do plano de trabalho.');
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [justificativaCancelamento, setJustificativaCancelamento] = useState('');
  const [recusandoId, setRecusandoId] = useState<string | null>(null);
  const [resumoAceiteId, setResumoAceiteId] = useState<string | null>(null);
  const [justificativaRecusa, setJustificativaRecusa] = useState('');
  const [diariasAceitas, setDiariasAceitas] = useState<string[]>([]);
  const [solicitacoesDiaria, setSolicitacoesDiaria] = useState<DiariaRequest[]>([
    {
      id: 'SD-2026-003',
      bolsistas: ['Mariana Costa'],
      partida: '2026-08-05T09:00',
      chegada: '2026-08-06T17:00',
      destino: 'Cachoeiro de Itapemirim/ES',
      motivo: 'Participação como bolsista em atividade técnica de projeto parceiro.',
      status: 'ALOCADA',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      transacaoComprometimentoRef: 'TR-2026-044',
    },
    {
      id: 'SD-2026-002',
      bolsistas: ['Ana Souza'],
      partida: '2026-07-03T07:00',
      chegada: '2026-07-04T19:00',
      destino: 'Linhares/ES',
      motivo: 'Coleta de dados em campo prevista no plano de trabalho.',
      status: 'ALOCADA',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      transacaoComprometimentoRef: 'TR-2026-043',
    },
    {
      id: 'SD-2026-001',
      bolsistas: ['Ana Souza', 'Bruno Lima'],
      partida: '2026-06-10T08:00',
      chegada: '2026-06-12T18:00',
      destino: 'Vitória/ES',
      motivo: 'Participação em reunião técnica do projeto.',
      status: 'APROVADA',
      quantidade: 2.5,
      valorUnitario: 260,
      valorTotal: 1300,
      tipoDiariaRef: 'DIA-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      transacaoComprometimentoRef: 'TR-2026-045',
    },
    {
      id: 'SD-2026-000',
      bolsistas: ['Carla Nunes'],
      partida: '2026-05-22T08:00',
      chegada: '2026-05-23T18:00',
      destino: 'Serra/ES',
      motivo: 'Acompanhamento presencial de oficina técnica.',
      status: 'RECUSADA',
      quantidade: 1.5,
      valorUnitario: 260,
      valorTotal: 390,
      tipoDiariaRef: 'DIA-2026-001',
      tipoDiaria: 'NACIONAL',
      tipoViagem: 'DENTRO_ESTADO',
      regraCalculo: 'Normativa FAPES',
      transacaoComprometimentoRef: 'TR-2026-040',
      transacaoReversaoRef: 'TR-2026-041',
      justificativaRecusa: 'Beneficiária recusou a viagem por conflito de agenda.',
    },
  ]);

  const tiposViagemComOrcamento = tiposViagem.filter((tipo) => (orcamentosRubricasDiarias[tipo.codigo] ?? 0) > 0);
  const tipoViagemAtual =
    tiposViagemComOrcamento.find((tipo) => tipo.codigo === tipoViagemSelecionado) ??
    tiposViagemComOrcamento[0] ??
    tiposViagem[0];
  const diariaVigenteAtual = diariasVigentes.find((diaria) => diaria.tipoViagem === tipoViagemAtual.codigo) ?? diariasVigentes[0];
  const tipoDiariaCalculado = tipoViagemAtual.abrangencia === 'Internacional' ? 'INTERNACIONAL' : 'NACIONAL';
  const tipoDiariaAtual = tiposDiaria.find((tipo) => tipo.codigo === tipoDiariaCalculado) ?? tiposDiaria[0];
  const quantidadeCalculada = useMemo(() => calcularDiarias(partida, chegada), [chegada, partida]);
  const valorTotalCalculado = quantidadeCalculada * diariaVigenteAtual.valor * selectedBolsistas.length;
  const solicitacaoPropriaCoordenador = selectedBolsistas.length === 1 && selectedBolsistas[0] === coordenadorAtual;
  const diariasFiltradas = useMemo(() => {
    const query = diariaSearch.trim().toLowerCase();

    return solicitacoesDiaria.filter((solicitacao) => {
      const matchesSearch =
        !query ||
        solicitacao.id.toLowerCase().includes(query) ||
        solicitacao.destino.toLowerCase().includes(query) ||
        solicitacao.bolsistas.join(' ').toLowerCase().includes(query);
      const matchesStatus = diariaStatusFilter === 'TODOS' || solicitacao.status === diariaStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [diariaSearch, diariaStatusFilter, solicitacoesDiaria]);
  const diariasPorBeneficiario = useMemo<DiariaBeneficiarioItem[]>(
    () =>
      diariasFiltradas.flatMap((solicitacao) =>
        solicitacao.bolsistas.map((beneficiario, beneficiarioIndex) => ({
          ...solicitacao,
          beneficiario,
          beneficiarioIndex,
          valorBeneficiario: solicitacao.valorTotal / solicitacao.bolsistas.length,
        })),
      ),
    [diariasFiltradas],
  );
  const totalComprometido = solicitacoesDiaria
    .filter((solicitacao) => solicitacao.status === 'APROVADA' || statusPendenteAceite(solicitacao.status))
    .reduce((total, solicitacao) => total + solicitacao.valorTotal, 0);
  const rubricasDashboard = tiposViagem
    .map((tipo) => {
      const total = orcamentosRubricasDiarias[tipo.codigo] ?? 0;
      const solicitacoesDaRubrica = solicitacoesDiaria.filter((solicitacao) => solicitacao.tipoViagem === tipo.codigo);
      const alocado = solicitacoesDaRubrica
        .filter((solicitacao) => statusPendenteAceite(solicitacao.status))
        .reduce((subtotal, solicitacao) => subtotal + solicitacao.valorTotal, 0);
      const utilizado = solicitacoesDaRubrica
        .filter((solicitacao) => solicitacao.status === 'APROVADA')
        .reduce((subtotal, solicitacao) => subtotal + solicitacao.valorTotal, 0);
      const aceitesPendentes = solicitacoesDaRubrica
        .filter((solicitacao) => statusPendenteAceite(solicitacao.status))
        .reduce((subtotal, solicitacao) => subtotal + solicitacao.bolsistas.length, 0);
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
  const orcamentoRubricaSelecionada = orcamentosRubricasDiarias[tipoViagemAtual.codigo] ?? 0;
  const totalComprometidoRubricaSelecionada = solicitacoesDiaria
    .filter(
      (solicitacao) =>
        solicitacao.tipoViagem === tipoViagemAtual.codigo &&
        (solicitacao.status === 'APROVADA' || statusPendenteAceite(solicitacao.status)),
    )
    .reduce((total, solicitacao) => total + solicitacao.valorTotal, 0);
  const saldoDisponivelDiarias = Math.max(0, orcamentoRubricaSelecionada - totalComprometidoRubricaSelecionada);
  const saldoAposSolicitacao = saldoDisponivelDiarias - valorTotalCalculado;
  const solicitacaoExcedeSaldo = valorTotalCalculado > saldoDisponivelDiarias;
  const beneficiarioLogado = accessType === 'coordenador' ? coordenadorAtual : bolsistaAtual;
  const minhasDiarias = solicitacoesDiaria.filter((solicitacao) => solicitacao.bolsistas.includes(beneficiarioLogado));
  const minhasDiariasFiltradas = useMemo(() => {
    const query = minhasDiariasSearch.trim().toLowerCase();

    return solicitacoesDiaria.filter((solicitacao) => {
      if (!solicitacao.bolsistas.includes(beneficiarioLogado)) return false;

      const matchesSearch =
        !query ||
        solicitacao.id.toLowerCase().includes(query) ||
        solicitacao.destino.toLowerCase().includes(query) ||
        solicitacao.motivo.toLowerCase().includes(query);
      const matchesFilter =
        minhasDiariasFilter === 'TODAS' ||
        (minhasDiariasFilter === 'NOVAS' && statusPendenteAceite(solicitacao.status)) ||
        (minhasDiariasFilter === 'HISTORICO' && !statusPendenteAceite(solicitacao.status));

      return matchesSearch && matchesFilter;
    });
  }, [beneficiarioLogado, minhasDiariasFilter, minhasDiariasSearch, solicitacoesDiaria]);
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
    setSelectedBolsistas((current) => (current.length === 1 ? current : current.filter((item) => item !== nome)));
  };

  const criarSolicitacaoDiaria = () => {
    if (!quantidadeCalculada || !destino.trim() || !motivo.trim() || solicitacaoExcedeSaldo) return;

    const nextNumber = String(solicitacoesDiaria.length + 1).padStart(3, '0');
    const novaSolicitacao: DiariaRequest = {
      id: `SD-2026-${nextNumber}`,
      bolsistas: [...selectedBolsistas],
      partida,
      chegada,
      destino,
      motivo,
      status: solicitacaoPropriaCoordenador ? 'APROVADA' : 'ALOCADA',
      quantidade: quantidadeCalculada,
      valorUnitario: diariaVigenteAtual.valor,
      valorTotal: valorTotalCalculado,
      tipoDiariaRef: diariaVigenteAtual.referencia,
      tipoDiaria: tipoDiariaAtual.codigo,
      tipoViagem: tipoViagemAtual.codigo,
      regraCalculo: tipoDiariaAtual.regra,
      transacaoComprometimentoRef: `TR-2026-${String(45 + solicitacoesDiaria.length + 1).padStart(3, '0')}`,
    };

    setSolicitacoesDiaria((current) => [novaSolicitacao, ...current]);
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
              transacaoReversaoRef: 'TR-2026-046',
              justificativaCancelamento,
            }
          : solicitacao,
      ),
    );
    setCancelandoId(null);
    setJustificativaCancelamento('');
  };

  const aceitarDiaria = (id: string) => {
    setDiariasAceitas((current) => (current.includes(id) ? current : [...current, id]));
    setSolicitacoesDiaria((current) =>
      current.map((solicitacao) =>
        solicitacao.id === id
          ? {
              ...solicitacao,
              status: 'APROVADA',
              transacaoComprometimentoRef: solicitacao.transacaoComprometimentoRef ?? `TR-2026-${String(45 + solicitacoesDiaria.length + 1).padStart(3, '0')}`,
            }
          : solicitacao,
      ),
    );
    setResumoAceiteId(null);
  };

  const recusarDiaria = (id: string) => {
    if (!justificativaRecusa.trim()) return;

    setSolicitacoesDiaria((current) =>
      current.map((solicitacao) =>
        solicitacao.id === id
          ? {
              ...solicitacao,
              status: 'RECUSADA',
              justificativaRecusa,
              transacaoReversaoRef: solicitacao.transacaoComprometimentoRef ? 'TR-2026-047' : solicitacao.transacaoReversaoRef,
            }
          : solicitacao,
      ),
    );
    setRecusandoId(null);
    setJustificativaRecusa('');
  };

  const renderMinhasDiarias = () => (
    <>
      {(() => {
        const diariaEmResumo = minhasDiarias.find((solicitacao) => solicitacao.id === resumoAceiteId);

        if (!diariaEmResumo) return null;

        return (
          <section
            className="p-5 mb-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 14%, transparent)',
              borderLeft: '3px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-start gap-3 mb-5">
              <ReceiptText size={20} style={{ color: 'var(--primary)', marginTop: '2px' }} />
              <div>
                <h2 style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', margin: '0 0 0.35rem' }}>
                  Resumo para aceite
                </h2>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  Confirme os dados da viagem antes de registrar o aceite da diária.
                </p>
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
              {[
                { label: 'Solicitação', value: diariaEmResumo.id },
                { label: 'Destino', value: diariaEmResumo.destino },
                { label: 'Partida', value: new Date(diariaEmResumo.partida).toLocaleString('pt-BR') },
                { label: 'Chegada', value: new Date(diariaEmResumo.chegada).toLocaleString('pt-BR') },
                { label: 'Diárias', value: diariaEmResumo.quantidade.toLocaleString('pt-BR') },
                { label: 'Valor unitário', value: currency.format(diariaEmResumo.valorUnitario) },
                { label: 'Valor total', value: currency.format(diariaEmResumo.valorTotal) },
                { label: 'Tipo de diária', value: diariaEmResumo.tipoDiariaRef },
              ].map((item) => (
                <div key={item.label}>
                  <span style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                  <strong className="block mt-1">{item.value}</strong>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: '0 0 1rem' }}>
              Ao confirmar, declaro ciencia da viagem e aceito receber a diaria na conta bancaria cadastrada.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => aceitarDiaria(diariaEmResumo.id)}
                className="px-4 py-2 flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                <CheckCheck size={16} />
                Confirmar aceite
              </button>
              <button
                onClick={() => setResumoAceiteId(null)}
                className="px-4 py-2"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--muted-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Cancelar
              </button>
            </div>
          </section>
        );
      })()}

      <section>
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input
              value={minhasDiariasSearch}
              onChange={(event) => setMinhasDiariasSearch(event.target.value)}
              placeholder="Buscar por código, destino ou motivo"
              className="w-full pl-10 pr-3 py-2"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
              }}
            />
          </div>
          <select
            value={minhasDiariasFilter}
            onChange={(event) => setMinhasDiariasFilter(event.target.value as 'TODAS' | 'NOVAS' | 'HISTORICO')}
            className="px-3 py-2"
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <option value="TODAS">Todas as diárias</option>
            <option value="NOVAS">Novas para aceite</option>
            <option value="HISTORICO">Histórico</option>
          </select>
        </div>

        <div className="space-y-3">
        {minhasDiariasFiltradas.map((solicitacao) => {
        const jaRespondida = diariasAceitas.includes(solicitacao.id) || !statusPendenteAceite(solicitacao.status);

        return (
          <article
            key={solicitacao.id}
            className="p-5"
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>{solicitacao.id}</strong>
                  <span
                    className="px-2 py-1"
                    style={{
                      borderRadius: '999px',
                      backgroundColor:
                        solicitacao.status === 'CANCELADA' || solicitacao.status === 'RECUSADA'
                          ? 'rgba(239, 68, 68, 0.12)'
                          : 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      color:
                        solicitacao.status === 'CANCELADA' || solicitacao.status === 'RECUSADA'
                          ? '#dc2626'
                          : 'var(--primary)',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    {statusLabel(solicitacao.status)}
                  </span>
                </div>
                <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.35rem' }}>
                  {solicitacao.destino}
                </p>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  {solicitacao.motivo}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                <div>
                  <span style={{ color: 'var(--muted-foreground)' }}>Partida</span>
                  <strong className="block mt-1">{new Date(solicitacao.partida).toLocaleString('pt-BR')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)' }}>Chegada</span>
                  <strong className="block mt-1">{new Date(solicitacao.chegada).toLocaleString('pt-BR')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)' }}>Diárias</span>
                  <strong className="block mt-1">{solicitacao.quantidade.toLocaleString('pt-BR')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground)' }}>Valor</span>
                  <strong className="block mt-1">{currency.format(solicitacao.valorTotal)}</strong>
                </div>
              </div>
            </div>

            {jaRespondida ? (
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', margin: '0.9rem 0 0' }}>
                {solicitacao.status === 'RECUSADA'
                    ? `Viagem recusada. Justificativa: ${solicitacao.justificativaRecusa}`
                    : 'Termo aceito ou diária já processada.'}
              </p>
            ) : recusandoId === solicitacao.id ? (
              <div className="mt-4">
                <textarea
                  value={justificativaRecusa}
                  onChange={(event) => setJustificativaRecusa(event.target.value)}
                  rows={2}
                  placeholder="Justificativa da recusa"
                  className="w-full px-3 py-2 mb-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => recusarDiaria(solicitacao.id)}
                    className="px-3 py-2"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    Confirmar recusa
                  </button>
                  <button
                    onClick={() => {
                      setRecusandoId(null);
                      setJustificativaRecusa('');
                    }}
                    className="px-3 py-2"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--muted-foreground)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setResumoAceiteId(solicitacao.id);
                    setRecusandoId(null);
                    setJustificativaRecusa('');
                  }}
                  className="px-4 py-2 flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  <CheckCircle size={16} />
                  Aceitar viagem
                </button>
                <button
                  onClick={() => setRecusandoId(solicitacao.id)}
                  className="px-4 py-2 flex items-center gap-2"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  <X size={16} />
                  Recusar viagem
                </button>
              </div>
            )}
          </article>
        );
        })}
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
                  <BreadcrumbPage>Minhas Diárias</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--primary)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            }}
          >
            {activeFlow === 'diarias' ? <PlaneTakeoff size={20} /> : <ClipboardList size={20} />}
          </div>
          <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
            {activeFlow === 'diarias' ? 'Minhas Diárias' : 'Solicitações'}
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
            ? 'Visualize suas viagens e aceite ou recuse o termo de diária quando houver solicitação pendente.'
            : 'Acesse documentos, informes e suas solicitações vinculadas ao projeto.'}
        </p>

        {activeFlow === 'diarias' ? (
          renderMinhasDiarias()
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
                <h3 style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 1rem 0' }}>
                  Minhas Diárias
                </h3>
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
      </div>
    );
  }

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
                <BreadcrumbPage>Diárias</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3 mb-2">
        <div
          className="p-2 transition-colors"
          style={{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }}
        >
          {activeFlow === 'diarias' ? <PlaneTakeoff size={20} /> : <ClipboardList size={20} />}
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
          {activeFlow === 'diarias' ? 'Painel de Diárias' : 'Solicitações'}
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
          ? 'Controle solicitações, aceites e remoções de diárias da iniciativa.'
          : 'Solicite diárias, acompanhe aceites e emita documentos da iniciativa.'}
      </p>

      {activeFlow === 'diarias' ? (
        <>
          <section
            className="mb-6 p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderLeft: '3px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div className="flex items-start gap-3">
                <div
                  className="p-2"
                  style={{
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                  }}
                >
                  <PlaneTakeoff size={20} />
                </div>
                <div>
                  <h2
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: '0 0 0.35rem',
                    }}
                  >
                    Painel de controle
                  </h2>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: '1.6', margin: 0 }}>
                    O coordenador solicita diárias quando há saldo na rubrica, acompanha os termos de aceite dos bolsistas e visualiza as transações.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveDiariaTab('nova')}
                className="px-4 py-2 flex items-center justify-center gap-2"
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
                Nova solicitação
              </button>
            </div>

            <div
              className="mt-5 overflow-x-auto"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  minWidth: '920px',
                  borderCollapse: 'collapse',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Rubrica', 'Total', 'Alocado', 'Utilizado', 'Saldo', 'Aceites pendentes'].map((header) => (
                      <th
                        key={header}
                        style={{
                          padding: '0.75rem 0.875rem',
                          textAlign: header === 'Rubrica' ? 'left' : 'right',
                          color: 'var(--muted-foreground)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rubricasDashboard.map((rubrica) => (
                    <tr key={rubrica.codigo}>
                      <td style={{ padding: '0.875rem', verticalAlign: 'top', borderBottom: '1px solid var(--border)' }}>
                        <strong style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                          {rubrica.nome}
                        </strong>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>
                          {rubrica.codigo}
                        </span>
                        <span style={{ display: 'block', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.35rem' }}>
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
                        <td
                          key={`${rubrica.codigo}-${index}`}
                          style={{
                            padding: '0.875rem',
                            textAlign: 'right',
                            verticalAlign: 'top',
                            borderBottom: '1px solid var(--border)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: index === 3 ? 'var(--primary)' : 'var(--foreground)',
                          }}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div
            className="hidden md:flex gap-1 mb-6"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {[
              { key: 'solicitadas' as DiariaTab, label: 'Diárias Solicitadas' },
              { key: 'nova' as DiariaTab, label: 'Nova Solicitação' },
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
                  color: activeDiariaTab === tab.key ? 'var(--primary)' : 'var(--muted-foreground)',
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

          {activeDiariaTab === 'solicitadas' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Solicitadas', value: String(solicitacoesDiaria.length), color: 'var(--foreground)' },
                { label: 'Aprovadas', value: String(solicitacoesDiaria.filter((item) => item.status === 'APROVADA').length), color: 'var(--primary)' },
                { label: 'Comprometido', value: currency.format(totalComprometido), color: 'var(--primary)' },
              ].map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                    borderRadius: 'var(--radius)',
                    padding: '1rem',
                  }}
                >
                  <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.5rem' }}>
                    {metric.label}
                  </p>
                  <strong style={{ color: metric.color, fontSize: 'var(--text-lg)' }}>{metric.value}</strong>
                </div>
              ))}
            </div>
          )}

          {activeDiariaTab === 'minhas' ? (
            renderMinhasDiarias()
          ) : activeDiariaTab === 'nova' ? (
      <section className="grid grid-cols-1 gap-6 items-start mb-8">
        <div
          className="p-5"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
            borderLeft: '3px solid var(--primary)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-3">
              <PlaneTakeoff size={20} style={{ color: 'var(--primary)', marginTop: '2px' }} />
              <div>
                <h2
                  style={{
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    margin: '0 0 0.35rem',
                  }}
                >
                  Solicitação de Diárias
                </h2>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                  Rubrica: {tipoViagemAtual.rubrica} · {currency.format(diariaVigenteAtual.valor)} · fração {diariaVigenteAtual.fracaoCalculo}
                </p>
              </div>
            </div>
            <WalletCards size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
              Tipo de viagem
              <select
                value={tipoViagemSelecionado}
                onChange={(event) => setTipoViagemSelecionado(event.target.value as TipoViagemCodigo)}
                className="mt-2 w-full px-3 py-2"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {tiposViagemComOrcamento.map((tipo) => {
                  const diaria = diariasVigentes.find((item) => item.tipoViagem === tipo.codigo) ?? diariasVigentes[0];

                  return (
                    <option key={tipo.codigo} value={tipo.codigo}>
                      {tipo.nome} · {tipo.rubrica} · {currency.format(diaria.valor)} · {diaria.fracaoCalculo}
                    </option>
                  );
                })}
              </select>
            </label>
            <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
              Partida
              <div className="mt-2 flex items-center gap-2">
                <Clock size={16} style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="datetime-local"
                  value={partida}
                  onChange={(event) => setPartida(event.target.value)}
                  className="w-full px-3 py-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>
            </label>

            <label style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
              Chegada
              <div className="mt-2 flex items-center gap-2">
                <Calendar size={16} style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="datetime-local"
                  value={chegada}
                  onChange={(event) => setChegada(event.target.value)}
                  className="w-full px-3 py-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>
            </label>
          </div>

          <label className="block mb-4" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            Destino
            <div className="mt-2 flex items-center gap-2">
              <MapPin size={16} style={{ color: 'var(--muted-foreground)' }} />
              <input
                value={destino}
                onChange={(event) => setDestino(event.target.value)}
                className="w-full px-3 py-2"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                }}
              />
            </div>
          </label>

          <label className="block mb-4" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            Beneficiários
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
                <input
                  value={bolsistaSearch}
                  onChange={(event) => setBolsistaSearch(event.target.value)}
                  placeholder="Buscar coordenador ou bolsista do projeto"
                  className="w-full px-3 py-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {bolsistasEncontrados.map((nome) => (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => adicionarBolsista(nome)}
                    className="px-3 py-2 flex items-center gap-2 transition-colors"
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'left',
                    }}
                  >
                    <CheckCircle size={16} style={{ color: 'var(--muted-foreground)' }} />
                    <span>
                      {nome}
                      {nome === coordenadorAtual && (
                        <span style={{ color: 'var(--muted-foreground)' }}> · Coordenadora</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>

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
              {solicitacaoPropriaCoordenador && (
                <p style={{ color: 'var(--primary)', fontSize: 'var(--text-xs)', margin: '0.75rem 0 0' }}>
                  Solicitação própria do coordenador: transação de comprometimento imediata na rubrica de Diárias.
                </p>
              )}
            </div>
          </label>

          <label className="block mb-5" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
            Motivo
            <textarea
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              rows={3}
              className="mt-2 w-full px-3 py-2"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                resize: 'vertical',
              }}
            />
          </label>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-5"
            style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}
          >
            <div>
              <span style={{ color: 'var(--muted-foreground)' }}>Diárias</span>
              <strong className="block mt-1">{quantidadeCalculada.toLocaleString('pt-BR')}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted-foreground)' }}>Rubrica</span>
              <strong className="block mt-1">{tipoViagemAtual.rubrica}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted-foreground)' }}>Valor unitário</span>
              <strong className="block mt-1">{currency.format(diariaVigenteAtual.valor)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted-foreground)' }}>Beneficiários</span>
              <strong className="block mt-1">{selectedBolsistas.length}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted-foreground)' }}>Total</span>
              <strong className="block mt-1">{currency.format(valorTotalCalculado)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted-foreground)' }}>Saldo disponível</span>
              <strong className="block mt-1" style={{ color: solicitacaoExcedeSaldo ? '#dc2626' : 'var(--foreground)' }}>
                {currency.format(saldoDisponivelDiarias)}
              </strong>
            </div>
          </div>

          <div
            className="mb-5 p-3"
            style={{
              border: `1px solid ${solicitacaoExcedeSaldo ? 'color-mix(in srgb, #dc2626 35%, var(--border))' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              backgroundColor: solicitacaoExcedeSaldo ? 'color-mix(in srgb, #dc2626 10%, var(--background))' : 'var(--background)',
              color: solicitacaoExcedeSaldo ? 'var(--foreground)' : 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
            }}
          >
            {solicitacaoExcedeSaldo
              ? `Saldo insuficiente na rubrica ${tipoViagemAtual.rubrica}. Faltam ${currency.format(Math.abs(saldoAposSolicitacao))} para esta solicitação.`
              : `Após esta solicitação, o saldo estimado da rubrica ${tipoViagemAtual.rubrica} será ${currency.format(saldoAposSolicitacao)}.`}
          </div>

          <button
            onClick={criarSolicitacaoDiaria}
            disabled={solicitacaoExcedeSaldo}
            className="px-4 py-2 transition-colors flex items-center gap-2"
            style={{
              backgroundColor: solicitacaoExcedeSaldo ? 'var(--muted)' : 'var(--primary)',
              color: solicitacaoExcedeSaldo ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              border: 'none',
              cursor: solicitacaoExcedeSaldo ? 'not-allowed' : 'pointer',
              opacity: solicitacaoExcedeSaldo ? 0.7 : 1,
            }}
          >
            <ReceiptText size={16} />
            Solicitar diária
          </button>
        </div>

      </section>
          ) : (
            <section>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    value={diariaSearch}
                    onChange={(event) => setDiariaSearch(event.target.value)}
                    placeholder="Buscar por código, destino ou beneficiário"
                    className="w-full pl-10 pr-3 py-2"
                    style={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </div>
                <select
                  value={diariaStatusFilter}
                  onChange={(event) => setDiariaStatusFilter(event.target.value as StatusDiaria | 'TODOS')}
                  className="px-3 py-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <option value="TODOS">Todos os status</option>
                  <option value="ALOCADA">Alocada</option>
                  <option value="APROVADA">Aprovada</option>
                  <option value="CANCELADA">Cancelada</option>
                  <option value="RECUSADA">Recusada</option>
                </select>
                <button
                  onClick={() => setActiveDiariaTab('nova')}
                  className="px-4 py-2 flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  <Plus size={16} />
                  Nova solicitação
                </button>
              </div>

              <div className="space-y-3">
                {diariasPorBeneficiario.map((solicitacao) => (
                  <article
                    key={`${solicitacao.id}-${solicitacao.beneficiarioIndex}`}
                    className="p-4"
                    style={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                            {solicitacao.id} · {solicitacao.beneficiario}
                          </strong>
                          <span
                            className="px-2 py-1"
                            style={{
                              borderRadius: '999px',
                              backgroundColor:
                                solicitacao.status === 'CANCELADA' || solicitacao.status === 'RECUSADA'
                                  ? 'rgba(239, 68, 68, 0.12)'
                                  : 'color-mix(in srgb, var(--primary) 12%, transparent)',
                              color: solicitacao.status === 'CANCELADA' || solicitacao.status === 'RECUSADA' ? '#dc2626' : 'var(--primary)',
                              fontSize: 'var(--text-xs)',
                            }}
                          >
                            {statusLabel(solicitacao.status)}
                          </span>
                        </div>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
                          {solicitacao.destino}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }}>
                        <div>
                          <span style={{ color: 'var(--muted-foreground)' }}>Diárias</span>
                          <strong className="block mt-1">{solicitacao.quantidade.toLocaleString('pt-BR')}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted-foreground)' }}>Beneficiário</span>
                          <strong className="block mt-1">{solicitacao.beneficiario}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted-foreground)' }}>Valor</span>
                          <strong className="block mt-1">{currency.format(solicitacao.valorBeneficiario)}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted-foreground)' }}>Cadastro</span>
                          <strong className="block mt-1">{solicitacao.tipoDiariaRef}</strong>
                        </div>
                      </div>
                    </div>

                    {(solicitacao.transacaoComprometimentoRef || solicitacao.transacaoReversaoRef) && (
                      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', margin: '0.75rem 0 0' }}>
                        {solicitacao.transacaoComprometimentoRef ? `Comprometimento: ${solicitacao.transacaoComprometimentoRef}` : ''}
                        {solicitacao.transacaoReversaoRef ? ` · Reversão: ${solicitacao.transacaoReversaoRef}` : ''}
                      </p>
                    )}

                    {solicitacao.justificativaRecusa && (
                      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', margin: '0.75rem 0 0' }}>
                        Recusa do bolsista: {solicitacao.justificativaRecusa}
                      </p>
                    )}

                    {(solicitacao.status === 'ALOCADA' || solicitacao.status === 'APROVADA') && dataInicioAindaNaoPassou(solicitacao.partida) && cancelandoId !== solicitacao.id && (
                      <button
                        onClick={() => setCancelandoId(solicitacao.id)}
                        className="mt-3 px-3 py-2 flex items-center gap-2"
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          backgroundColor: 'transparent',
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        <RotateCcw size={15} />
                        Remover diária
                      </button>
                    )}

                    {cancelandoId === solicitacao.id && (
                      <div className="mt-3">
                        <textarea
                          value={justificativaCancelamento}
                          onChange={(event) => setJustificativaCancelamento(event.target.value)}
                          rows={2}
                          placeholder="Justificativa da remoção"
                          className="w-full px-3 py-2 mb-2"
                          style={{
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--foreground)',
                            fontSize: 'var(--text-sm)',
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => cancelarDiaria(solicitacao.id)}
                            className="px-3 py-2"
                            style={{
                              backgroundColor: 'var(--primary)',
                              color: 'var(--primary-foreground)',
                              border: 'none',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-sm)',
                            }}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setCancelandoId(null)}
                            className="px-3 py-2"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--muted-foreground)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-sm)',
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
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
            Solicitar Diárias
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
    </div>
  );
}
