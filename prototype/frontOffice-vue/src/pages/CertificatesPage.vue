<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

type DocumentoSolicitacao = 'declaracao' | 'informe' | 'termo' | null
type StatusDiaria = 'RASCUNHO' | 'ALOCADA' | 'APROVADA' | 'CANCELADA' | 'RECUSADA'
type EstadoAceiteDiaria = 'PENDENTE' | 'ASSINADO' | 'RECUSADO' | 'CANCELADO'
type DiariaTab = 'solicitadas' | 'nova' | 'minhas'
type TipoDiariaCodigo = 'NACIONAL' | 'INTERNACIONAL'
type TipoViagemCodigo = 'DENTRO_ESTADO' | 'FORA_ESTADO' | 'INTERNACIONAL'

interface DiariaRequest {
  id: string
  alocacaoBolsistaRef: string
  bolsistaNome: string
  partida: string
  chegada: string
  origem: string
  destino: string
  distanciaKm: number
  deslocamentoRegiaoMetropolitana: boolean
  municipioLimitrofe: boolean
  transporteCusteadoOutraEntidade: boolean
  hospedagemCusteadaOutraEntidade: boolean
  alimentacaoCusteadaOutraEntidade: boolean
  motivo: string
  status: StatusDiaria
  estadoAceite: EstadoAceiteDiaria
  quantidade: number
  valorUnitario: number
  valorTotal: number
  tipoDiariaRef: string
  parametroCalculoDiariaRef: string
  tipoDiaria: TipoDiariaCodigo
  tipoViagem: TipoViagemCodigo
  regraCalculo: string
  memoriaCalculoSnapshot?: string
  transacaoComprometimentoRef?: string
  transacaoReversaoRef?: string
  justificativaCancelamento?: string
  justificativaRecusa?: string
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const accessType = computed(() => auth.accessType ?? 'bolsista')
const isBolsista = computed(() => accessType.value === 'bolsista')

const bolsistaMinhasDiarias = 'Paulo Sergio Souza Junior'
const bolsistaAtual = 'Ana Souza'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const orcamentosRubricasDiarias: Record<TipoViagemCodigo, number> = {
  DENTRO_ESTADO: 5000,
  FORA_ESTADO: 3000,
  INTERNACIONAL: 2000,
}

const tiposViagem = [
  { codigo: 'DENTRO_ESTADO' as const, nome: 'Dentro do Estado', rubrica: 'Diária dentro do Estado', abrangencia: 'Nacional', referencia: 'RUB-DIA-DE' },
  { codigo: 'FORA_ESTADO' as const, nome: 'Nacional', rubrica: 'Diária nacional', abrangencia: 'Nacional', referencia: 'RUB-DIA-NAC' },
  { codigo: 'INTERNACIONAL' as const, nome: 'Internacional', rubrica: 'Diária internacional', abrangencia: 'Internacional', referencia: 'RUB-DIA-INT' },
]

const diariasVigentes = [
  { referencia: 'DIA-2026-001', parametroRef: 'PCD-2026-001', tipoViagem: 'DENTRO_ESTADO' as const, valor: 260, fracaoCalculo: '12h', vigenciaInicio: '05/01/2026' },
  { referencia: 'DIA-2026-002', parametroRef: 'PCD-2026-002', tipoViagem: 'FORA_ESTADO' as const, valor: 320, fracaoCalculo: '12h', vigenciaInicio: '05/01/2026' },
  { referencia: 'DIA-2026-003', parametroRef: 'PCD-2026-003', tipoViagem: 'INTERNACIONAL' as const, valor: 620, fracaoCalculo: '24h', vigenciaInicio: '05/01/2026' },
]

function statusLabel(status: StatusDiaria) {
  const labels: Record<StatusDiaria, string> = {
    RASCUNHO: 'Rascunho',
    ALOCADA: 'Aguardando Bolsista',
    APROVADA: 'Aprovada',
    CANCELADA: 'Cancelado',
    RECUSADA: 'Recusada',
  }
  return labels[status]
}

function statusPendenteAceite(s: Pick<DiariaRequest, 'status' | 'estadoAceite'>) {
  return s.status === 'ALOCADA' && s.estadoAceite === 'PENDENTE'
}

function statusBadgeStyle(status: StatusDiaria) {
  if (status === 'APROVADA') return { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' }
  if (status === 'RECUSADA') return { bg: 'rgba(249, 115, 22, 0.14)', color: '#f97316', border: 'rgba(249, 115, 22, 0.35)' }
  if (status === 'CANCELADA') return { bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' }
  return {
    bg: 'color-mix(in srgb, var(--primary) 12%, transparent)',
    color: 'var(--primary)',
    border: 'color-mix(in srgb, var(--primary) 28%, transparent)',
  }
}

const initialFlow = (route.query.flow as 'diarias' | undefined) ?? null

const selectedOption = ref<DocumentoSolicitacao>(null)
const activeFlow = ref<'diarias' | null>(initialFlow)
const activeDiariaTab = ref<DiariaTab>('solicitadas')
const selectedYear = ref('2024')

const diariaSearch = ref('')
const diariaStatusFilter = ref<StatusDiaria | 'TODOS'>('TODOS')
const diariaTipoViagemFilter = ref<TipoViagemCodigo | 'TODOS'>('TODOS')
const minhasDiariasSearch = ref('')
const minhasDiariasStatusFilter = ref<StatusDiaria | 'TODOS'>('TODOS')
const minhasDiariasTipoViagemFilter = ref<TipoViagemCodigo | 'TODOS'>('TODOS')

const solicitacaoDetalheId = ref<string | null>(null)

const solicitacoesDiaria = ref<DiariaRequest[]>([
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
])

const beneficiarioLogado = computed(() =>
  accessType.value === 'coordenador' ? bolsistaMinhasDiarias : bolsistaAtual,
)

const temDiariaPendenteBolsista = computed(() =>
  solicitacoesDiaria.value.some(
    (s) => s.bolsistaNome === bolsistaAtual && statusPendenteAceite(s),
  ),
)

const diariasFiltradas = computed(() => {
  const query = diariaSearch.value.trim().toLowerCase()
  return solicitacoesDiaria.value.filter((s) => {
    const matchesSearch =
      !query ||
      s.id.toLowerCase().includes(query) ||
      s.origem.toLowerCase().includes(query) ||
      s.destino.toLowerCase().includes(query) ||
      s.bolsistaNome.toLowerCase().includes(query) ||
      s.alocacaoBolsistaRef.toLowerCase().includes(query)
    const matchesStatus = diariaStatusFilter.value === 'TODOS' || s.status === diariaStatusFilter.value
    const matchesTipoViagem = diariaTipoViagemFilter.value === 'TODOS' || s.tipoViagem === diariaTipoViagemFilter.value
    return matchesSearch && matchesStatus && matchesTipoViagem
  })
})

const minhasDiariasFiltradas = computed(() => {
  const query = minhasDiariasSearch.value.trim().toLowerCase()
  return solicitacoesDiaria.value.filter((s) => {
    if (s.bolsistaNome !== beneficiarioLogado.value) return false
    const matchesSearch =
      !query ||
      s.id.toLowerCase().includes(query) ||
      s.origem.toLowerCase().includes(query) ||
      s.destino.toLowerCase().includes(query) ||
      s.motivo.toLowerCase().includes(query)
    const matchesStatus = minhasDiariasStatusFilter.value === 'TODOS' || s.status === minhasDiariasStatusFilter.value
    const matchesTipoViagem = minhasDiariasTipoViagemFilter.value === 'TODOS' || s.tipoViagem === minhasDiariasTipoViagemFilter.value
    return matchesSearch && matchesStatus && matchesTipoViagem
  })
})

const rubricasDashboard = computed(() =>
  tiposViagem
    .map((tipo) => {
      const total = orcamentosRubricasDiarias[tipo.codigo] ?? 0
      const solicitacoesDaRubrica = solicitacoesDiaria.value.filter((s) => s.tipoViagem === tipo.codigo)
      const alocado = solicitacoesDaRubrica
        .filter((s) => statusPendenteAceite(s))
        .reduce((sum, s) => sum + s.valorTotal, 0)
      const utilizado = solicitacoesDaRubrica
        .filter((s) => s.status === 'APROVADA')
        .reduce((sum, s) => sum + s.valorTotal, 0)
      const diaria = diariasVigentes.find((d) => d.tipoViagem === tipo.codigo) ?? diariasVigentes[0]
      return {
        codigo: tipo.referencia,
        nome: tipo.rubrica,
        tipoViagem: tipo.nome,
        total,
        alocado,
        utilizado,
        saldo: Math.max(0, total - alocado - utilizado),
        diariaVigente: `${diaria.referencia} · ${currency.format(diaria.valor)} · fração ${diaria.fracaoCalculo}`,
      }
    })
    .filter((r) => r.total > 0),
)

const totalDisponivelDashboard = computed(() =>
  rubricasDashboard.value.reduce((sum, r) => sum + r.total, 0),
)
const valorAlocadoDashboard = computed(() =>
  rubricasDashboard.value.reduce((sum, r) => sum + r.alocado, 0),
)
const valorUtilizadoDashboard = computed(() =>
  rubricasDashboard.value.reduce((sum, r) => sum + r.utilizado, 0),
)
const saldoDisponivelDashboard = computed(() =>
  rubricasDashboard.value.reduce((sum, r) => sum + r.saldo, 0),
)

const isNovaSolicitacaoDiaria = computed(
  () => activeFlow.value === 'diarias' && activeDiariaTab.value === 'nova',
)

const headerTitle = computed(() => {
  if (isBolsista.value) {
    if (activeFlow.value === 'diarias') {
      return activeDiariaTab.value === 'nova' ? 'Detalhes da Solicitação' : 'Minhas Diárias'
    }
    return 'Solicitações'
  }
  if (isNovaSolicitacaoDiaria.value) {
    return solicitacaoDetalheId.value ? 'Detalhes da Solicitação' : 'Nova Solicitação'
  }
  return activeFlow.value === 'diarias' ? 'Diária' : 'Solicitações'
})

const headerSubtitle = computed(() => {
  if (isBolsista.value) {
    if (activeFlow.value === 'diarias') {
      return activeDiariaTab.value === 'nova'
        ? 'Confira as informações da solicitação da Diária.'
        : 'Visualize suas viagens e aceite ou recuse o termo de diária quando houver solicitação pendente.'
    }
    return 'Acesse documentos, informes e suas solicitações vinculadas ao projeto.'
  }
  if (isNovaSolicitacaoDiaria.value) {
    return solicitacaoDetalheId.value
      ? 'Confira as informações da solicitação da Diária.'
      : 'Preencha as informações abaixo para solicitar uma nova Diária.'
  }
  return activeFlow.value === 'diarias'
    ? 'Controle solicitações, aceites e remoções de diárias da iniciativa.'
    : 'Solicite diárias, acompanhe aceites e emita documentos da iniciativa.'
})

const headerIcon = computed(() =>
  activeFlow.value === 'diarias' ? 'i-lucide-hotel' : 'i-lucide-clipboard-list',
)

const cardKeyOptions: Array<{ key: NonNullable<DocumentoSolicitacao>; title: string; text: string }> = [
  {
    key: 'termo',
    title: 'Termo de Compromisso',
    text: 'O Coordenador e o Bolsista devem aceitar o documento antes do início das atividades.',
  },
  {
    key: 'declaracao',
    title: 'Declaração de Participação no Projeto',
    text: 'Este documento comprova a participação no projeto de pesquisa como bolsista.',
  },
]

const dashboardCards = computed(() => [
  { label: 'Valor Total Disponível', value: currency.format(totalDisponivelDashboard.value), icon: 'i-lucide-banknote', tint: 'var(--primary)' },
  { label: 'Valor Alocado', value: currency.format(valorAlocadoDashboard.value), icon: 'i-lucide-coins', tint: '#f59e0b' },
  { label: 'Valor Utilizado', value: currency.format(valorUtilizadoDashboard.value), icon: 'i-lucide-circle-dollar-sign', tint: '#22c55e' },
  { label: 'Saldo Disponível', value: currency.format(saldoDisponivelDashboard.value), icon: 'i-lucide-piggy-bank', tint: '#38bdf8' },
])

function abrirFluxoDiarias() {
  activeFlow.value = 'diarias'
  activeDiariaTab.value = 'solicitadas'
}

function voltarParaSolicitacoes() {
  activeFlow.value = null
  activeDiariaTab.value = 'solicitadas'
  solicitacaoDetalheId.value = null
}

function abrirNovaSolicitacao() {
  activeDiariaTab.value = 'nova'
  solicitacaoDetalheId.value = null
}

function abrirDetalheSolicitacao(s: DiariaRequest) {
  solicitacaoDetalheId.value = s.id
  activeDiariaTab.value = 'nova'
}

function formatarData(iso: string) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString('pt-BR')
  } catch {
    return iso
  }
}

const solicitacaoDetalhe = computed(() =>
  solicitacaoDetalheId.value
    ? solicitacoesDiaria.value.find((s) => s.id === solicitacaoDetalheId.value) ?? null
    : null,
)

onMounted(() => {
  if (initialFlow === 'diarias') activeFlow.value = 'diarias'
})

// Translation safety
void t
void router
</script>

<template>
  <div class="w-full px-4 md:px-8 py-8">
    <!-- Breadcrumb -->
    <nav v-if="activeFlow === 'diarias'" class="mb-5 flex items-center gap-2 text-sm" :style="{ color: 'var(--muted-foreground)' }">
      <button
        type="button"
        class="bg-transparent border-0 cursor-pointer p-0"
        :style="{ color: 'var(--muted-foreground)' }"
        @click="voltarParaSolicitacoes"
      >
        Solicitações
      </button>
      <UIcon name="i-lucide-chevron-right" class="size-3.5" />
      <button
        v-if="activeDiariaTab !== 'solicitadas'"
        type="button"
        class="bg-transparent border-0 cursor-pointer p-0"
        :style="{ color: 'var(--muted-foreground)' }"
        @click="activeDiariaTab = 'solicitadas'"
      >
        Diária
      </button>
      <span v-else :style="{ color: 'var(--foreground)' }">Diária</span>
      <template v-if="activeDiariaTab !== 'solicitadas'">
        <UIcon name="i-lucide-chevron-right" class="size-3.5" />
        <span :style="{ color: 'var(--foreground)' }">
          {{ activeDiariaTab === 'nova' ? (solicitacaoDetalheId ? 'Detalhes' : 'Nova Solicitação') : 'Minhas Diárias' }}
        </span>
      </template>
    </nav>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
      <div class="flex items-center gap-3">
        <div
          class="p-2 transition-colors"
          :style="{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }"
        >
          <UIcon :name="headerIcon" class="size-5" />
        </div>
        <h1 :style="{ color: 'var(--foreground)', margin: 0 }">{{ headerTitle }}</h1>
      </div>
      <UButton
        v-if="!isBolsista && activeFlow === 'diarias' && !isNovaSolicitacaoDiaria"
        color="primary"
        icon="i-lucide-plus"
        @click="abrirNovaSolicitacao"
      >
        Nova Solicitação
      </UButton>
    </div>

    <p
      class="mb-6"
      :style="{
        color: 'var(--muted-foreground)',
        fontSize: 'var(--text-sm)',
        marginLeft: 'calc(32px + 0.75rem)',
      }"
    >
      {{ headerSubtitle }}
    </p>
    <div :style="{ borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }" />

    <!-- Hub landing (no flow active) -->
    <template v-if="activeFlow !== 'diarias'">
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div
          v-for="card in cardKeyOptions"
          :key="card.key"
          class="p-5 transition-all cursor-pointer flex flex-col h-full"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderTop: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRight: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderBottom: selectedOption === card.key ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderLeft: selectedOption === card.key ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
            minHeight: '160px',
          }"
          @click="selectedOption = selectedOption === card.key ? null : card.key"
        >
          <h3 :style="{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 1rem 0' }">
            {{ card.title }}
          </h3>
          <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: 0 }">
            {{ card.text }}
          </p>
        </div>

        <button
          type="button"
          class="p-5 transition-all cursor-pointer flex flex-col h-full text-left"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 18%, transparent)',
            borderRadius: 'var(--radius)',
            minHeight: '160px',
            width: '100%',
          }"
          @click="abrirFluxoDiarias"
        >
          <div class="flex items-start justify-between gap-3 mb-4">
            <h3 :style="{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: 0 }">
              {{ isBolsista ? 'Minhas Diárias' : 'Diárias' }}
            </h3>
            <span
              v-if="temDiariaPendenteBolsista && isBolsista"
              class="px-2 py-1"
              :style="{
                backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                color: 'var(--primary)',
                border: '1px solid color-mix(in srgb, var(--primary) 28%, transparent)',
                borderRadius: '9999px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                whiteSpace: 'nowrap',
              }"
            >
              Pendente
            </span>
          </div>
          <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: 0 }">
            {{
              isBolsista
                ? 'Visualize suas viagens e aceite ou recuse o termo de diária quando houver solicitação pendente.'
                : 'Entre no painel de controle para solicitar diárias, acompanhar aceites e remover solicitações antes do início.'
            }}
          </p>
        </button>

        <div
          class="p-5 transition-all cursor-pointer flex flex-col h-full"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderTop: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRight: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderBottom: selectedOption === 'informe' ? '1px solid var(--primary)' : '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderLeft: selectedOption === 'informe' ? '3px solid var(--primary)' : '3px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
            minHeight: '160px',
          }"
          @click="selectedOption = selectedOption === 'informe' ? null : 'informe'"
        >
          <h3 :style="{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)', margin: '0 0 1rem 0' }">
            Informe de Rendimentos
          </h3>
          <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: '1.7', margin: '0 0 1rem 0' }">
            Gere seu IR para a declaração do Imposto de Renda da Pessoa Física (DIRPF).
          </p>
          <label :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', display: 'block', marginBottom: '0.5rem' }">
            Selecione o ano:
          </label>
          <div class="w-full md:w-[200px]" @click.stop>
            <USelectMenu
              v-model="selectedYear"
              :items="['2024', '2023', '2022', '2021']"
            />
          </div>
        </div>
      </section>

      <div v-if="selectedOption" class="flex justify-end mt-6">
        <UButton color="primary" icon="i-lucide-file-text">Gerar Documento</UButton>
      </div>
    </template>

    <!-- Diárias flow -->
    <template v-else>
      <!-- Dashboard cards (coordenador apenas, fora da aba nova) -->
      <section
        v-if="!isBolsista && !isNovaSolicitacaoDiaria"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
      >
        <article
          v-for="card in dashboardCards"
          :key="card.label"
          class="p-5"
          :style="{
            minHeight: '116px',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }"
        >
          <div class="flex items-center gap-4">
            <div
              class="p-2"
              :style="{
                color: card.tint,
                borderRadius: 'var(--radius)',
                backgroundColor: `color-mix(in srgb, ${card.tint} 18%, transparent)`,
              }"
            >
              <UIcon :name="card.icon" class="size-[18px]" />
            </div>
            <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">
              {{ card.label }}
            </span>
          </div>
          <strong
            class="block mt-5 text-center"
            :style="{ color: 'var(--foreground)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-semibold)' }"
          >
            {{ card.value }}
          </strong>
        </article>
      </section>

      <!-- Tabs (coordenador) -->
      <div
        v-if="!isBolsista && !isNovaSolicitacaoDiaria"
        class="hidden md:flex gap-1 mb-6"
        :style="{ borderBottom: '1px solid var(--border)' }"
      >
        <button
          v-for="tab in ([
            { key: 'solicitadas', label: 'Diárias Solicitadas' },
            { key: 'minhas', label: 'Minhas Diárias' },
          ] as { key: DiariaTab; label: string }[])"
          :key="tab.key"
          :style="{
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
          }"
          @click="activeDiariaTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Nova / Detalhes (stub) -->
      <section
        v-if="isNovaSolicitacaoDiaria || (isBolsista && activeDiariaTab === 'nova')"
        class="mb-8"
      >
        <div
          v-if="solicitacaoDetalhe"
          class="p-5"
          :style="{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }"
          >
            <div
              v-for="item in [
                { label: 'Bolsista', value: solicitacaoDetalhe.bolsistaNome },
                { label: 'Tipo de Viagem', value: tiposViagem.find((tp) => tp.codigo === solicitacaoDetalhe?.tipoViagem)?.nome ?? '-' },
                { label: 'Diária', value: solicitacaoDetalhe.quantidade.toLocaleString('pt-BR') },
                { label: 'Valor', value: currency.format(solicitacaoDetalhe.valorTotal) },
                { label: 'Origem', value: solicitacaoDetalhe.origem },
                { label: 'Destino', value: solicitacaoDetalhe.destino },
                { label: 'Partida', value: formatarData(solicitacaoDetalhe.partida) },
                { label: 'Chegada', value: formatarData(solicitacaoDetalhe.chegada) },
                { label: 'Status', value: statusLabel(solicitacaoDetalhe.status) },
                { label: 'Motivo', value: solicitacaoDetalhe.motivo },
              ]"
              :key="item.label"
              class="min-w-0"
            >
              <span
                :style="{
                  display: 'block',
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-xs)',
                  marginBottom: '0.5rem',
                }"
              >
                {{ item.label }}
              </span>
              <strong
                :style="{
                  display: 'block',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  overflowWrap: 'anywhere',
                }"
              >
                {{ item.value }}
              </strong>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <UButton variant="outline" @click="solicitacaoDetalheId = null; activeDiariaTab = 'solicitadas'">
              Voltar
            </UButton>
          </div>
        </div>

        <UCard v-else>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-construction" class="size-5 mt-0.5" :style="{ color: 'var(--primary)' }" />
            <div>
              <h3 :style="{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', margin: '0 0 0.5rem 0' }">
                Nova Solicitação de Diária
              </h3>
              <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: 0 }">
                <!-- TODO Fase 4: formulário completo (tipo viagem, origem, destino, datas, distância, motivo, custeios, equipe, cálculo, confirmação, modais). -->
                Formulário completo será portado na próxima fase. Inclui seleção de tipo de viagem, origem/destino, datas de partida e chegada, custeios externos, equipe de bolsistas, cálculo automático e modais de confirmação.
              </p>
              <div class="mt-4 flex gap-2">
                <UButton variant="outline" @click="activeDiariaTab = 'solicitadas'">Voltar para Solicitadas</UButton>
              </div>
            </div>
          </div>
        </UCard>
      </section>

      <!-- Minhas Diárias (bolsista ou aba minhas do coordenador) -->
      <section v-else-if="isBolsista || activeDiariaTab === 'minhas'">
        <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px_240px] gap-3 mb-4">
          <label :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
            Pesquisar
            <div class="relative mt-2">
              <input
                v-model="minhasDiariasSearch"
                placeholder="Buscar"
                class="w-full pl-3 pr-10 py-2"
                :style="{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                }"
              />
              <UIcon
                name="i-lucide-search"
                class="absolute right-3 top-1/2 -translate-y-1/2 size-4"
                :style="{ color: 'var(--muted-foreground)' }"
              />
            </div>
          </label>
          <div>
            <label :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">Tipo de Viagem</label>
            <div class="mt-2">
              <USelectMenu
                v-model="minhasDiariasTipoViagemFilter"
                value-key="value"
                :items="[
                  { value: 'TODOS', label: 'Todos' },
                  { value: 'DENTRO_ESTADO', label: 'Dentro do Estado' },
                  { value: 'FORA_ESTADO', label: 'Nacional' },
                  { value: 'INTERNACIONAL', label: 'Internacional' },
                ]"
              />
            </div>
          </div>
          <div>
            <label :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">Status</label>
            <div class="mt-2">
              <USelectMenu
                v-model="minhasDiariasStatusFilter"
                value-key="value"
                :items="[
                  { value: 'TODOS', label: 'Todos' },
                  { value: 'RASCUNHO', label: 'Rascunho' },
                  { value: 'ALOCADA', label: 'Aguardando Bolsista' },
                  { value: 'APROVADA', label: 'Aprovada' },
                  { value: 'RECUSADA', label: 'Recusada' },
                  { value: 'CANCELADA', label: 'Cancelada' },
                ]"
              />
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            v-for="s in minhasDiariasFiltradas"
            :key="s.id"
            type="button"
            class="w-full p-5 text-left transition-colors"
            :style="{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }"
            @click="abrirDetalheSolicitacao(s)"
          >
            <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
              <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div
                  v-for="item in [
                    { label: 'Bolsista', value: s.bolsistaNome },
                    { label: 'Diária', value: s.quantidade.toLocaleString('pt-BR') },
                    { label: 'Valor Total', value: currency.format(s.valorTotal) },
                    { label: 'Origem', value: s.origem },
                    { label: 'Destino', value: s.destino },
                  ]"
                  :key="item.label"
                  class="min-w-0"
                >
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                    {{ item.label }}
                  </div>
                  <div
                    :style="{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: item.label === 'Valor Total' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                      overflowWrap: 'anywhere',
                    }"
                  >
                    {{ item.value }}
                  </div>
                </div>
                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                    Status
                  </div>
                  <span
                    class="inline-flex items-center px-2.5 py-1"
                    :style="{
                      backgroundColor: statusBadgeStyle(s.status).bg,
                      color: statusBadgeStyle(s.status).color,
                      border: `1px solid ${statusBadgeStyle(s.status).border}`,
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ statusLabel(s.status) }}
                  </span>
                </div>
              </div>
              <UIcon name="i-lucide-chevron-right" class="size-5" :style="{ color: 'var(--muted-foreground)' }" />
            </div>
          </button>

          <div
            v-if="minhasDiariasFiltradas.length === 0"
            class="p-5"
            :style="{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
            }"
          >
            Nenhuma diária encontrada para os filtros selecionados.
          </div>
        </div>
      </section>

      <!-- Diárias Solicitadas (coordenador, aba solicitadas) -->
      <section v-else>
        <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px_240px] gap-3 mb-4">
          <label :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
            Pesquisar
            <div class="relative mt-2">
              <input
                v-model="diariaSearch"
                placeholder="Buscar"
                class="w-full pl-3 pr-10 py-2"
                :style="{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                }"
              />
              <UIcon
                name="i-lucide-search"
                class="absolute right-3 top-1/2 -translate-y-1/2 size-4"
                :style="{ color: 'var(--muted-foreground)' }"
              />
            </div>
          </label>
          <div>
            <label :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">Tipo de Viagem</label>
            <div class="mt-2">
              <USelectMenu
                v-model="diariaTipoViagemFilter"
                value-key="value"
                :items="[
                  { value: 'TODOS', label: 'Todos' },
                  { value: 'DENTRO_ESTADO', label: 'Dentro do Estado' },
                  { value: 'FORA_ESTADO', label: 'Nacional' },
                  { value: 'INTERNACIONAL', label: 'Internacional' },
                ]"
              />
            </div>
          </div>
          <div>
            <label :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">Status</label>
            <div class="mt-2">
              <USelectMenu
                v-model="diariaStatusFilter"
                value-key="value"
                :items="[
                  { value: 'TODOS', label: 'Todos' },
                  { value: 'RASCUNHO', label: 'Rascunho' },
                  { value: 'ALOCADA', label: 'Aguardando Bolsista' },
                  { value: 'APROVADA', label: 'Aprovada' },
                  { value: 'RECUSADA', label: 'Recusada' },
                  { value: 'CANCELADA', label: 'Cancelada' },
                ]"
              />
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            v-for="s in diariasFiltradas"
            :key="s.id"
            type="button"
            class="w-full p-5 text-left transition-colors"
            :style="{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }"
            @click="abrirDetalheSolicitacao(s)"
          >
            <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
              <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div
                  v-for="item in [
                    { label: 'Bolsista', value: s.bolsistaNome },
                    { label: 'Diária', value: s.quantidade.toLocaleString('pt-BR') },
                    { label: 'Valor Total', value: currency.format(s.valorTotal) },
                    { label: 'Origem', value: s.origem },
                    { label: 'Destino', value: s.destino },
                  ]"
                  :key="item.label"
                  class="min-w-0"
                >
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                    {{ item.label }}
                  </div>
                  <div
                    :style="{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: item.label === 'Valor Total' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                      overflowWrap: 'anywhere',
                    }"
                  >
                    {{ item.value }}
                  </div>
                </div>
                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                    Status
                  </div>
                  <span
                    class="inline-flex items-center px-2.5 py-1"
                    :style="{
                      backgroundColor: statusBadgeStyle(s.status).bg,
                      color: statusBadgeStyle(s.status).color,
                      border: `1px solid ${statusBadgeStyle(s.status).border}`,
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ statusLabel(s.status) }}
                  </span>
                </div>
              </div>
              <UIcon name="i-lucide-chevron-right" class="size-5" :style="{ color: 'var(--muted-foreground)' }" />
            </div>
          </button>

          <div
            v-if="diariasFiltradas.length === 0"
            class="p-5"
            :style="{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
            }"
          >
            Nenhuma diária encontrada para os filtros selecionados.
          </div>
        </div>
      </section>

      <!-- TODO Fase 4: modais (confirmarCriacaoDiariaOpen, confirmarAceiteDiariaId), justificativa cancelamento/recusa, salvar rascunho. -->
    </template>
  </div>
</template>
