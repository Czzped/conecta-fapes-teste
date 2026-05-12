<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

type TabId = 'bolsistas' | 'informacoes' | 'pagamentos'
type DetailsTab = 'informacoes' | 'aprovacao'
type MemberStatus =
  | 'Em Andamento'
  | 'Finalizada'
  | 'Cancelada'
  | 'Reprovada'
  | 'Doc. Pendente'
type DocStatus = 'Validado' | 'Pendente' | 'Em Validação' | 'Reprovado'

interface TeamDocument {
  id: number
  requisito: string
  documento: string
  dataEnvio: string
  status: DocStatus
}

interface TeamMember {
  id: number
  name: string
  startDate: string
  endDate: string
  type: 'BPIG-VII' | 'BPIG-VI' | 'BPIG-V' | 'BPIG-IV' | 'BPIG-III' | 'BPIG-II'
  status: MemberStatus
  email: string
  phone: string
  documents: TeamDocument[]
}

const route = useRoute()
const router = useRouter()

const queryTab = (route.query.tab as TabId | undefined) ?? undefined
const activeTab = ref<TabId>(
  queryTab && ['bolsistas', 'informacoes', 'pagamentos'].includes(queryTab)
    ? queryTab
    : 'informacoes',
)

watch(
  () => route.query.tab,
  (val) => {
    if (val && ['bolsistas', 'informacoes', 'pagamentos'].includes(val as string)) {
      activeTab.value = val as TabId
    }
  },
)

const expandedBolsistaId = ref<number | null>(null)
const currentPage = ref(1)
const searchQuery = ref('')
const selectedModalidade = ref('Todos')
const selectedStatus = ref('Todos')
const sortOrder = ref<'recent' | 'oldest'>('recent')
const isDetailsModalOpen = ref(false)
const selectedMemberForDetails = ref<TeamMember | null>(null)
const detailsTab = ref<DetailsTab>('informacoes')
const isCancelModalOpen = ref(false)
const selectedMemberForCancel = ref<TeamMember | null>(null)
const cancelJustification = ref('')
const cancelDate = ref('')
const isCancelRequestModalOpen = ref(false)
const selectedMemberForCancelRequest = ref<TeamMember | null>(null)
const selectedYear = ref('2026')
const itemsPerPage = 10

const defaultDocuments: TeamDocument[] = [
  { id: 1, requisito: 'Nível Médio', documento: 'Imagem Frente e Verso do Diploma', dataEnvio: '20/02/2026', status: 'Pendente' },
  { id: 2, requisito: 'Nível Superior', documento: 'Imagem Frente e Verso do Diploma', dataEnvio: '20/02/2026', status: 'Em Validação' },
  { id: 3, requisito: 'RG', documento: 'Imagem Frente e Verso do RG', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 4, requisito: 'CPF', documento: 'CPF ou Comprovante de Situação Cadastral', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 5, requisito: 'Comprovante de Residência', documento: 'Dentre os últimos 6 meses', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 6, requisito: 'Lattes', documento: 'PDF gerado pela plataforma', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 7, requisito: 'Certidão Negativa de Débito - Municipal', documento: 'Certidão de Regularidade Fiscal Municipal', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 8, requisito: 'Certidão Negativa de Débito - Estadual', documento: 'Certidão de Regularidade Fiscal Estadual', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 9, requisito: 'Certidão Negativa de Débito - Federal', documento: 'Certidão de Regularidade Fiscal Federal', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 10, requisito: 'Certidão Negativa de Débito - Trabalhista', documento: 'Extrato CAGED', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 11, requisito: 'Nível Acadêmico', documento: 'Diploma de maior titulação', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 12, requisito: 'Plano de Trabalho', documento: 'Formulário de Atividades Bolsista', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 13, requisito: 'Não ter vínculo empregatício', documento: 'CNIS', dataEnvio: '20/02/2026', status: 'Reprovado' },
]

const teamMembers = ref<TeamMember[]>([
  { id: 1, name: 'Paulo Sérgio dos Santos Junior', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-VII', status: 'Doc. Pendente', email: 'paulo.junior@example.com', phone: '(27) 99999-9999', documents: defaultDocuments },
  { id: 2, name: 'Felipe Frechiani de Oliveira', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-VI', status: 'Doc. Pendente', email: 'felipe.frechiani@example.com', phone: '(27) 99888-8888', documents: defaultDocuments },
  { id: 3, name: 'Fabiano Borges Ruy', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-V', status: 'Finalizada', email: 'fabiano.ruy@example.com', phone: '(27) 99777-7777', documents: defaultDocuments },
  { id: 4, name: 'Victorio Albani de Carvalho', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-IV', status: 'Em Andamento', email: 'victorio.albani@example.com', phone: '(27) 99666-6666', documents: defaultDocuments },
  { id: 5, name: 'Sofia de Alcantara Silva', startDate: '01/08/2025', endDate: '01/08/2026', type: 'BPIG-III', status: 'Em Andamento', email: 'sofia.alcantara@example.com', phone: '(27) 99555-5555', documents: defaultDocuments },
  { id: 6, name: 'Rafael Emerick Zape de Oliveira', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-II', status: 'Cancelada', email: 'rafael.zape@example.com', phone: '(27) 99444-4444', documents: defaultDocuments },
  { id: 7, name: 'Moisés Savedra Omena', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-VII', status: 'Doc. Pendente', email: 'moises.omena@example.com', phone: '(27) 99333-3333', documents: defaultDocuments },
  { id: 8, name: 'Michele Rudio Constatino', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-VI', status: 'Em Andamento', email: 'michele.rudio@example.com', phone: '(27) 99222-2222', documents: defaultDocuments },
  { id: 9, name: 'Marcela Starling Ferreira Lage', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-V', status: 'Finalizada', email: 'marcela.lage@example.com', phone: '(27) 99111-1111', documents: defaultDocuments },
  { id: 10, name: 'Vinícius de Jesus Estevam', startDate: '01/08/2025', endDate: '01/08/2026', type: 'BPIG-IV', status: 'Em Andamento', email: 'vinicius.estevam@example.com', phone: '(27) 98999-9999', documents: defaultDocuments },
  { id: 11, name: 'Jennifer Gonçalves do Amaral', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-III', status: 'Reprovada', email: 'jennifer.amaral@example.com', phone: '(27) 98888-8888', documents: defaultDocuments },
  { id: 12, name: 'Maria Luiza Guimarães Silva Mantovanelli', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-II', status: 'Em Andamento', email: 'maria.mantovanelli@example.com', phone: '(27) 98777-7777', documents: defaultDocuments },
  { id: 13, name: 'Heitor Lima Peixoto', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-VII', status: 'Em Andamento', email: 'heitor.peixoto@example.com', phone: '(27) 98666-6666', documents: defaultDocuments },
  { id: 14, name: 'Felipe Costabeber Schneider', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-VI', status: 'Finalizada', email: 'felipe.schneider@example.com', phone: '(27) 98555-5555', documents: defaultDocuments },
  { id: 15, name: 'Diogo Alves do Nascimento Barcelos', startDate: '01/08/2025', endDate: '01/08/2026', type: 'BPIG-V', status: 'Em Andamento', email: 'diogo.barcelos@example.com', phone: '(27) 98444-4444', documents: defaultDocuments },
  { id: 16, name: 'Daniel Cruz Cavalieri', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-IV', status: 'Em Andamento', email: 'daniel.cavalieri@example.com', phone: '(27) 98333-3333', documents: defaultDocuments },
  { id: 17, name: 'Caio Lessa Simão', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-III', status: 'Cancelada', email: 'caio.simao@example.com', phone: '(27) 98222-2222', documents: defaultDocuments },
  { id: 18, name: 'Leandro Camatta de Assis', startDate: '01/06/2025', endDate: '01/06/2026', type: 'BPIG-II', status: 'Em Andamento', email: 'leandro.assis@example.com', phone: '(27) 98111-1111', documents: defaultDocuments },
  { id: 19, name: 'João Pedro Hulle Gomes de Jesus', startDate: '01/08/2025', endDate: '01/08/2026', type: 'BPIG-VII', status: 'Em Andamento', email: 'joao.jesus@example.com', phone: '(27) 97999-9999', documents: defaultDocuments },
  { id: 20, name: 'André Luiz Coelho Silva', startDate: '15/07/2025', endDate: '15/07/2026', type: 'BPIG-VI', status: 'Em Andamento', email: 'andre.silva@example.com', phone: '(27) 97888-8888', documents: defaultDocuments },
])

const modalidadeOptions = ['Todos', 'BPIG-VII', 'BPIG-VI', 'BPIG-V', 'BPIG-IV', 'BPIG-III', 'BPIG-II']
const statusOptions = ['Todos', 'Em Andamento', 'Doc. Pendente', 'Finalizada', 'Cancelada', 'Reprovada']
const yearOptions = ['2024', '2025', '2026']

const sortedTeamMembers = computed(() => {
  return [...teamMembers.value].sort((a, b) => {
    const dateA = new Date(a.endDate.split('/').reverse().join('-')).getTime()
    const dateB = new Date(b.endDate.split('/').reverse().join('-')).getTime()
    return sortOrder.value === 'recent' ? dateB - dateA : dateA - dateB
  })
})

const filteredMembers = computed(() => {
  return sortedTeamMembers.value.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesModalidade = selectedModalidade.value === 'Todos' || member.type === selectedModalidade.value
    const matchesStatus = selectedStatus.value === 'Todos' || member.status === selectedStatus.value
    return matchesSearch && matchesModalidade && matchesStatus
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredMembers.value.length / itemsPerPage)))
const currentMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredMembers.value.slice(start, start + itemsPerPage)
})

function goToPage(page: number) {
  currentPage.value = page
  expandedBolsistaId.value = null
}

function toggleExpand(id: number) {
  expandedBolsistaId.value = expandedBolsistaId.value === id ? null : id
}

function openDetails(member: TeamMember) {
  selectedMemberForDetails.value = member
  detailsTab.value = 'informacoes'
  isDetailsModalOpen.value = true
}

function openCancelAction(member: TeamMember) {
  if (member.status === 'Doc. Pendente') {
    selectedMemberForCancelRequest.value = member
    isCancelRequestModalOpen.value = true
  } else {
    selectedMemberForCancel.value = member
    isCancelModalOpen.value = true
  }
}

function closeCancelModal() {
  isCancelModalOpen.value = false
  cancelJustification.value = ''
  cancelDate.value = ''
}

function confirmCancel() {
  console.log('Cancelar bolsa:', {
    member: selectedMemberForCancel.value?.name,
    justification: cancelJustification.value,
    date: cancelDate.value,
  })
  closeCancelModal()
}

function closeCancelRequestModal() {
  isCancelRequestModalOpen.value = false
  selectedMemberForCancelRequest.value = null
}

function confirmCancelRequest() {
  const target = selectedMemberForCancelRequest.value
  if (target) {
    teamMembers.value = teamMembers.value.filter((m) => m.id !== target.id)
  }
  closeCancelRequestModal()
}

function navigateToCadastro() {
  router.push('/bolsistas/novo')
}

function statusBadgeStyle(status: MemberStatus) {
  switch (status) {
    case 'Em Andamento':
      return { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }
    case 'Finalizada':
      return { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }
    case 'Cancelada':
      return { backgroundColor: 'rgba(251, 146, 60, 0.1)', color: '#fb923c', border: '1px solid rgba(251, 146, 60, 0.3)' }
    case 'Reprovada':
      return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }
    case 'Doc. Pendente':
      return { backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }
  }
}

function docStatusStyle(status: DocStatus) {
  switch (status) {
    case 'Validado':
      return { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: '1px solid rgba(34, 197, 94, 0.2)' }
    case 'Pendente':
      return { backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: '1px solid rgba(234, 179, 8, 0.2)' }
    case 'Em Validação':
      return { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: '1px solid rgba(59, 130, 246, 0.2)' }
    case 'Reprovado':
      return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: '1px solid rgba(239, 68, 68, 0.2)' }
  }
}

const modalidades = [
  { name: 'BPIG-I', used: 2, total: 4 },
  { name: 'BPIG-II', used: 2, total: 3 },
  { name: 'BPIG-III', used: 1, total: 2 },
  { name: 'BPIG-IV', used: 0, total: 1 },
  { name: 'BPIG-V', used: 1, total: 2 },
].filter((m) => !(m.used === 0 && m.total === 0))

const chartDataByYear: Record<string, { ativas: number[]; entraram: number[]; sairam: number[] }> = {
  '2024': {
    ativas: [38, 40, 42, 44, 43, 41, 40, 38, 37, 35, 33, 30],
    entraram: [4, 2, 2, 3, 1, 0, 1, 0, 1, 0, 0, 0],
    sairam: [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 3],
  },
  '2025': {
    ativas: [30, 34, 38, 40, 42, 44, 45, 43, 42, 40, 38, 36],
    entraram: [0, 4, 4, 2, 2, 2, 1, 0, 0, 0, 0, 0],
    sairam: [0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2],
  },
  '2026': {
    ativas: [44, 48, 46, 45, 44, 44, 44, 39, 39, 31, 0, 0],
    entraram: [0, 5, 6, 1, 2, 2, 1, 0, 1, 0, 0, 0],
    sairam: [0, 0, 4, 1, 0, 0, 0, 0, 0, 8, 13, 0],
  },
}

const chartOption = computed(() => {
  const data = chartDataByYear[selectedYear.value]
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Ativas', 'Entraram', 'Saíram'],
      bottom: '0%',
      left: 'center',
      itemWidth: 16,
      itemHeight: 16,
    },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    },
    yAxis: { type: 'value', max: 50 },
    series: [
      { name: 'Ativas', type: 'line', smooth: true, data: data.ativas, lineStyle: { width: 3 }, itemStyle: { color: '#3b82f6' }, symbol: 'circle', symbolSize: 8 },
      { name: 'Entraram', type: 'line', smooth: true, data: data.entraram, lineStyle: { width: 3 }, itemStyle: { color: '#10b981' }, symbol: 'circle', symbolSize: 8 },
      { name: 'Saíram', type: 'line', smooth: true, data: data.sairam, lineStyle: { width: 3 }, itemStyle: { color: '#f59e0b' }, symbol: 'circle', symbolSize: 8 },
    ],
  }
})

watch([searchQuery, selectedModalidade, selectedStatus, sortOrder], () => {
  currentPage.value = 1
  expandedBolsistaId.value = null
})

onMounted(() => {
  // noop - placeholder for future chart resize hooks
})

onBeforeUnmount(() => {
  // noop
})
</script>

<template>
  <div class="max-w-full overflow-x-hidden p-4 md:p-8">
    <section>
      <!-- Header -->
      <div class="flex items-center gap-3 mb-2">
        <div
          class="p-2 transition-colors"
          :style="{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }"
        >
          <UIcon name="i-lucide-users" class="w-5 h-5" />
        </div>
        <h1 :style="{ color: 'var(--foreground)', margin: 0 }">Minha Equipe</h1>
      </div>
      <p
        class="mb-6"
        :style="{
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          marginLeft: 'calc(32px + 0.75rem)',
        }"
      >
        Acompanhe as informações dos bolsistas do seu projeto.
      </p>

      <!-- Tabs -->
      <div
        class="hidden md:flex gap-1 mb-6"
        :style="{ borderBottom: '1px solid var(--border)' }"
      >
        <button
          v-for="t in (['informacoes', 'bolsistas', 'pagamentos'] as TabId[])"
          :key="t"
          @click="activeTab = t"
          :style="{
            padding: '0.625rem 1rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === t ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === t ? 'var(--primary)' : 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            marginBottom: '-1px',
          }"
        >
          {{ t === 'informacoes' ? 'Informações das Bolsas' : t === 'bolsistas' ? 'Bolsistas do Projeto' : 'Pagamentos' }}
        </button>
      </div>

      <!-- Mobile Tabs -->
      <div
        class="flex md:hidden flex-col mb-6"
        :style="{ borderLeft: '2px solid var(--border)' }"
      >
        <button
          v-for="t in (['informacoes', 'bolsistas', 'pagamentos'] as TabId[])"
          :key="t"
          @click="activeTab = t"
          class="py-3 pl-4 text-left"
          :style="{
            backgroundColor: 'transparent',
            border: 'none',
            borderLeft: activeTab === t ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === t ? 'var(--primary)' : 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            marginLeft: '-2px',
          }"
        >
          {{ t === 'informacoes' ? 'Informações das Bolsas' : t === 'bolsistas' ? 'Bolsistas do Projeto' : 'Pagamentos' }}
        </button>
      </div>

      <!-- Tab: Informações -->
      <template v-if="activeTab === 'informacoes'">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div
            v-for="card in [
              { title: 'Orçamento', total: 'R$ 300.000', utilized: 'R$ 175.000', available: 'R$ 125.000,00' },
            ]"
            :key="card.title"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
            }"
          >
            <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '1rem' }">
              {{ card.title }}
            </p>
            <div class="space-y-3">
              <div>
                <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', margin: 0, marginBottom: '0.25rem' }">Total</p>
                <p :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }">{{ card.total }}</p>
              </div>
              <div>
                <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', margin: 0, marginBottom: '0.25rem' }">Utilizado</p>
                <p :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }">{{ card.utilized }}</p>
              </div>
              <div>
                <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', margin: 0, marginBottom: '0.25rem' }">Disponível</p>
                <p :style="{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }">{{ card.available }}</p>
              </div>
            </div>
          </div>

          <div
            v-for="metric in [
              { label: 'Ativas', value: '60' },
              { label: 'Alocadas', value: '82' },
              { label: 'Utilizadas', value: '68' },
              { label: 'Disponíveis', value: '14' },
            ]"
            :key="metric.label"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
            }"
          >
            <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem' }">
              {{ metric.label }}
            </p>
            <div class="flex-1 flex items-center justify-center">
              <p :style="{ color: 'var(--foreground)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }">{{ metric.value }}</p>
            </div>
          </div>
        </div>

        <!-- Bolsas por Modalidade -->
        <div
          :style="{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
          }"
        >
          <h2 :style="{ color: 'var(--foreground)', margin: 0, marginBottom: '0.5rem' }">Bolsas por Modalidade</h2>
          <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0, marginBottom: '1.5rem' }">
            Quantidade planejada vs utilizada por tipo de bolsa
          </p>

          <div class="space-y-4">
            <div v-for="modalidade in modalidades" :key="modalidade.name">
              <div class="flex items-center justify-between mb-2">
                <div class="flex-1">
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.25rem' }">
                    {{ modalidade.name }}
                  </div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }">
                    {{ modalidade.used }} de {{ modalidade.total }} utilizadas
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    v-if="modalidade.total - modalidade.used > 0"
                    :style="{
                      padding: '0.25rem 0.625rem',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }"
                  >
                    {{ modalidade.total - modalidade.used }}
                    {{ modalidade.total - modalidade.used === 1 ? 'disponível' : 'disponíveis' }}
                  </span>
                  <span
                    :style="{
                      padding: '0.25rem 0.625rem',
                      backgroundColor: '#60a5fa20',
                      color: '#60a5fa',
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-semibold)',
                      minWidth: '45px',
                      textAlign: 'center',
                    }"
                  >
                    {{ modalidade.total > 0 ? Math.round((modalidade.used / modalidade.total) * 100) : 0 }}%
                  </span>
                </div>
              </div>
              <div
                :style="{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'var(--muted)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }"
              >
                <div
                  :style="{
                    width: (modalidade.total > 0 ? Math.round((modalidade.used / modalidade.total) * 100) : 0) + '%',
                    height: '100%',
                    backgroundColor: '#60a5fa',
                    transition: 'width 0.3s ease',
                  }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Quantidade de Bolsas -->
        <div
          :style="{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            marginTop: '1.5rem',
          }"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h2 :style="{ color: 'var(--foreground)', margin: 0, marginBottom: '0.5rem' }">Quantidade de Bolsas</h2>
              <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }">
                Evolução mensal das bolsas ativas, entradas e saídas
              </p>
            </div>
            <USelectMenu
              v-model="selectedYear"
              :items="yearOptions"
              class="w-32"
            />
          </div>
          <div style="width: 100%; height: 350px">
            <VChart :option="chartOption" autoresize style="height: 100%; width: 100%" />
          </div>
        </div>
      </template>

      <!-- Tab: Bolsistas -->
      <template v-if="activeTab === 'bolsistas'">
        <div class="w-full max-w-full" style="overflow-x: hidden">
          <div class="flex flex-col md:flex-row gap-3 mb-6 w-full max-w-full">
            <div class="flex-1 min-w-0">
              <UFormField label="Pesquisar">
                <UInput
                  v-model="searchQuery"
                  placeholder="Buscar por nome"
                  icon="i-lucide-search"
                  class="w-full"
                />
              </UFormField>
            </div>
            <div class="w-full md:w-48 min-w-0">
              <UFormField label="Data">
                <UInput v-model="cancelDate" placeholder="Selecionar data" icon="i-lucide-calendar" class="w-full" />
              </UFormField>
            </div>
            <div class="w-full md:w-48 min-w-0">
              <UFormField label="Modalidade">
                <USelectMenu v-model="selectedModalidade" :items="modalidadeOptions" class="w-full" />
              </UFormField>
            </div>
            <div class="w-full md:w-48 min-w-0">
              <UFormField label="Status">
                <USelectMenu v-model="selectedStatus" :items="statusOptions" class="w-full" />
              </UFormField>
            </div>
            <div class="hidden md:flex items-end">
              <UButton
                variant="outline"
                color="primary"
                icon="i-lucide-plus"
                @click="navigateToCadastro"
              >
                Solicitar Bolsa
              </UButton>
            </div>
          </div>

          <div class="flex justify-end mb-6 md:hidden">
            <UButton
              variant="outline"
              color="primary"
              icon="i-lucide-plus"
              @click="navigateToCadastro"
            >
              Solicitar Bolsa
            </UButton>
          </div>

          <!-- Desktop Cards -->
          <div class="hidden md:block space-y-4 max-w-full">
            <div
              v-for="member in currentMembers"
              :key="member.id"
              :style="{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }"
            >
              <div class="p-5 cursor-pointer" @click="toggleExpand(member.id)">
                <div class="grid grid-cols-12 gap-x-24 items-center">
                  <div class="col-span-1 flex items-center">
                    <UIcon
                      name="i-lucide-chevron-down"
                      class="w-4 h-4 transition-transform"
                      :style="{
                        color: 'var(--muted-foreground)',
                        transform: expandedBolsistaId === member.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      }"
                    />
                  </div>
                  <div class="col-span-3" :style="{ marginLeft: '-2.5rem' }">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Nome</div>
                    <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ member.name }}</div>
                  </div>
                  <div class="col-span-2">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Início</div>
                    <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ member.startDate }}</div>
                  </div>
                  <div class="col-span-2">
                    <div
                      :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }"
                    >
                      Término
                      <button
                        type="button"
                        @click.stop="sortOrder = sortOrder === 'recent' ? 'oldest' : 'recent'"
                        :style="{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.125rem',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'var(--primary)',
                        }"
                      >
                        <UIcon
                          :name="sortOrder === 'recent' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-up'"
                          class="w-3.5 h-3.5"
                        />
                      </button>
                    </div>
                    <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ member.endDate }}</div>
                  </div>
                  <div class="col-span-2">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Modalidade</div>
                    <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ member.type }}</div>
                  </div>
                  <div class="col-span-2">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Status</div>
                    <span
                      class="inline-flex items-center px-3 py-1"
                      :style="{
                        ...statusBadgeStyle(member.status),
                        borderRadius: '9999px',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        whiteSpace: 'nowrap',
                      }"
                    >
                      {{ member.status }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Expanded -->
              <div
                v-if="expandedBolsistaId === member.id"
                class="px-5 pb-5"
                :style="{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }"
              >
                <div class="flex items-center justify-between mb-4">
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">Documentos Solicitados</div>
                  <div class="flex items-center gap-2">
                    <UButton variant="outline" color="neutral" size="sm" @click.stop="openDetails(member)">
                      Detalhes da Bolsa
                    </UButton>
                    <UButton variant="outline" color="neutral" size="sm" @click.stop="openCancelAction(member)">
                      {{ member.status === 'Doc. Pendente' ? 'Excluir Solicitação' : 'Cancelar Bolsa' }}
                    </UButton>
                  </div>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="doc in member.documents"
                    :key="doc.id"
                    :style="{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }"
                  >
                    <div class="grid grid-cols-12 gap-4">
                      <div class="col-span-3">
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Requisito</div>
                        <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">{{ doc.requisito }}</div>
                      </div>
                      <div class="col-span-4">
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Documento</div>
                        <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">{{ doc.documento }}</div>
                      </div>
                      <div class="col-span-3" :style="{ marginLeft: '4rem' }">
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Data de Envio</div>
                        <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ doc.dataEnvio }}</div>
                      </div>
                      <div class="col-span-2">
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Status</div>
                        <span
                          class="inline-flex items-center px-2.5 py-1"
                          :style="{
                            ...docStatusStyle(doc.status),
                            borderRadius: '9999px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)',
                          }"
                        >
                          {{ doc.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden space-y-4 max-w-full">
            <div
              v-for="member in currentMembers"
              :key="member.id"
              class="max-w-full overflow-hidden"
              :style="{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }"
            >
              <div class="p-4 cursor-pointer max-w-full" @click="toggleExpand(member.id)">
                <div class="flex justify-between items-start mb-3 gap-2">
                  <div class="flex items-start gap-2 flex-1 min-w-0">
                    <UIcon
                      name="i-lucide-chevron-down"
                      class="w-4 h-4 mt-1 flex-shrink-0 transition-transform"
                      :style="{
                        color: 'var(--muted-foreground)',
                        transform: expandedBolsistaId === member.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      }"
                    />
                    <div class="flex-1 min-w-0">
                      <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Nome</div>
                      <div
                        :style="{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', wordBreak: 'break-word' }"
                      >
                        {{ member.name }}
                      </div>
                    </div>
                  </div>
                  <span
                    class="inline-flex items-center px-2 py-0.5 flex-shrink-0"
                    :style="{
                      ...statusBadgeStyle(member.status),
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      whiteSpace: 'nowrap',
                    }"
                  >
                    {{ member.status }}
                  </span>
                </div>
                <div class="mb-3 ml-6">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Período de Vigência</div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                    {{ member.startDate }} - {{ member.endDate }}
                  </div>
                </div>
                <div class="ml-6">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Modalidade</div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ member.type }}</div>
                </div>
              </div>

              <div
                v-if="expandedBolsistaId === member.id"
                class="px-4 pb-4"
                :style="{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }"
              >
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', marginBottom: '1rem' }">Documentos Solicitados</div>
                <div class="space-y-3 mb-4">
                  <div
                    v-for="doc in member.documents"
                    :key="doc.id"
                    :style="{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem' }"
                  >
                    <div class="space-y-3">
                      <div>
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Requisito</div>
                        <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">{{ doc.requisito }}</div>
                      </div>
                      <div>
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Documento</div>
                        <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">{{ doc.documento }}</div>
                      </div>
                      <div>
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Data de Envio</div>
                        <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ doc.dataEnvio }}</div>
                      </div>
                      <div>
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Status</div>
                        <span
                          class="inline-flex items-center px-2.5 py-1"
                          :style="{
                            ...docStatusStyle(doc.status),
                            borderRadius: '9999px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)',
                          }"
                        >
                          {{ doc.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <UButton block variant="outline" color="neutral" @click.stop="openDetails(member)">Detalhes da Bolsa</UButton>
                  <UButton block variant="outline" color="neutral" @click.stop="openCancelAction(member)">
                    {{ member.status === 'Doc. Pendente' ? 'Excluir Solicitação' : 'Cancelar Bolsa' }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-end mt-6">
            <UPagination
              v-model:page="currentPage"
              :total="filteredMembers.length"
              :items-per-page="itemsPerPage"
              @update:page="goToPage"
            />
          </div>
        </div>
      </template>

      <!-- Tab: Pagamentos (placeholder) -->
      <template v-if="activeTab === 'pagamentos'">
        <div
          :style="{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
          }"
        >
          Conteúdo de pagamentos do projeto. Acesse a página completa em
          <RouterLink to="/pagamentos" :style="{ color: 'var(--primary)' }">Pagamentos</RouterLink>.
        </div>
      </template>
    </section>

    <!-- Details Modal -->
    <UModal v-model:open="isDetailsModalOpen">
      <template #content>
        <div class="p-6" v-if="selectedMemberForDetails">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-graduation-cap" class="w-6 h-6" :style="{ color: 'var(--primary)' }" />
              <h2 :style="{ color: 'var(--foreground)', margin: 0 }">Detalhes da Bolsa</h2>
            </div>
            <UButton variant="ghost" color="neutral" icon="i-lucide-x" @click="isDetailsModalOpen = false" />
          </div>

          <div class="flex gap-2 mb-4" :style="{ borderBottom: '1px solid var(--border)' }">
            <button
              v-for="dt in (['informacoes', 'aprovacao'] as DetailsTab[])"
              :key="dt"
              @click="detailsTab = dt"
              class="px-4 py-2 transition-colors"
              :style="{
                backgroundColor: 'transparent',
                color: detailsTab === dt ? 'var(--primary)' : 'var(--muted-foreground)',
                border: 'none',
                borderBottom: detailsTab === dt ? '2px solid var(--primary)' : '2px solid transparent',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
              }"
            >
              {{ dt === 'informacoes' ? 'Informações' : 'Aprovação FAPES' }}
            </button>
          </div>

          <div v-if="detailsTab === 'informacoes'" class="space-y-6">
            <div class="flex items-start justify-between">
              <div>
                <h3 :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.5rem' }">
                  {{ selectedMemberForDetails.name }}
                </h3>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">123.456.789-00</div>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">{{ selectedMemberForDetails.email }}</div>
                <div class="flex flex-wrap gap-2 mt-3">
                  <span :style="{ padding: '0.25rem 0.625rem', backgroundColor: 'var(--muted)', color: 'var(--foreground)', borderRadius: '9999px', fontSize: 'var(--text-xs)' }">
                    Iniciação Científica
                  </span>
                  <span :style="{ ...statusBadgeStyle(selectedMemberForDetails.status), padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: 'var(--text-xs)' }">
                    {{ selectedMemberForDetails.status }}
                  </span>
                </div>
              </div>
              <div :style="{ textAlign: 'right' }">
                <div :style="{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }">R$ 700,00</div>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">por mês</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div :style="{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }">
                <div class="flex items-center gap-2 mb-3" :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">
                  <UIcon name="i-lucide-user" class="w-4 h-4" /> Orientador
                </div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">Dr. Maria Silva</div>
              </div>
              <div :style="{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }">
                <div class="flex items-center gap-2 mb-3" :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4" /> Período da Bolsa
                </div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                  {{ selectedMemberForDetails.startDate }} até {{ selectedMemberForDetails.endDate }}
                </div>
              </div>
            </div>

            <div :style="{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }">
              <div class="flex items-center gap-2 mb-3" :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">
                <UIcon name="i-lucide-file-text" class="w-4 h-4" /> Plano de Trabalho
              </div>
              <p :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: 0 }">
                Desenvolvimento de algoritmos de machine learning para análise de imagens médicas, com foco em detecção precoce de anomalias em radiografias torácicas.
              </p>
            </div>

            <div :style="{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }">
              <div class="flex items-center gap-2 mb-3" :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">
                <UIcon name="i-lucide-target" class="w-4 h-4" /> Objetivos
              </div>
              <ol :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', lineHeight: 1.8, margin: 0, paddingLeft: '1.25rem' }">
                <li>Estudar técnicas de deep learning aplicadas à área médica</li>
                <li>Desenvolver modelos de classificação de imagens</li>
                <li>Validar resultados com especialistas da área de saúde</li>
              </ol>
            </div>
          </div>

          <div v-if="detailsTab === 'aprovacao'" class="space-y-6">
            <div class="flex items-center gap-3">
              <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">Status FAPES:</span>
              <span
                class="inline-flex items-center px-3 py-1"
                :style="{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }"
              >
                Aprovada pela FAPES
              </span>
            </div>

            <div class="space-y-6">
              <div
                v-for="ev in [
                  { icon: 'i-lucide-send', title: 'Solicitação Enviada', date: '09/02/2024', author: 'Dr. Maria Silva · Coordenador', desc: 'Solicitação de bolsa de IC para o aluno João Santos' },
                  { icon: 'i-lucide-check-circle', title: 'Aprovada pelo Gerente', date: '19/02/2024', author: 'Carlos Mendes · Gerente FAPES', desc: 'Documentação completa. Aprovado conforme edital.' },
                ]"
                :key="ev.title"
                class="flex gap-3"
              >
                <div
                  class="flex items-center justify-center flex-shrink-0"
                  :style="{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    border: '3px solid var(--primary)',
                    color: 'var(--primary)',
                  }"
                >
                  <UIcon :name="ev.icon" class="w-3.5 h-3.5" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4 :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }">{{ ev.title }}</h4>
                    <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">{{ ev.date }}</span>
                  </div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem' }">{{ ev.author }}</div>
                  <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }">{{ ev.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Cancel Modal -->
    <UModal v-model:open="isCancelModalOpen" @close="closeCancelModal">
      <template #content>
        <div class="p-6" v-if="selectedMemberForCancel">
          <div class="flex items-center justify-between mb-4">
            <h2 :style="{ color: 'var(--foreground)', margin: 0 }">Cancelar bolsa</h2>
            <UButton variant="ghost" color="neutral" icon="i-lucide-x" @click="closeCancelModal" />
          </div>
          <p :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', lineHeight: 1.5, marginBottom: '1rem' }">
            Tem certeza que deseja cancelar a bolsa de <strong>{{ selectedMemberForCancel.name }}</strong>? Essa ação é irreversível.
          </p>
          <div class="space-y-4">
            <UFormField label="Justificativa do cancelamento *">
              <UTextarea v-model="cancelJustification" :rows="5" placeholder="Digite aqui a justificativa" class="w-full" />
            </UFormField>
            <UFormField label="Último dia de atividades *">
              <UInput v-model="cancelDate" placeholder="dd/mm/yyyy" icon="i-lucide-calendar" class="w-full" />
            </UFormField>
            <p :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }">
              <strong>Observação:</strong> se o cancelamento da bolsa for feito após o dia 15, o bolsista irá receber o pagamento deste mês.
            </p>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <UButton variant="outline" color="neutral" @click="closeCancelModal">Cancelar</UButton>
            <UButton color="primary" @click="confirmCancel">Confirmar Cancelamento</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Cancel Request Modal -->
    <UModal v-model:open="isCancelRequestModalOpen" @close="closeCancelRequestModal">
      <template #content>
        <div class="p-6" v-if="selectedMemberForCancelRequest">
          <div class="flex items-center justify-between mb-4">
            <h2 :style="{ color: 'var(--foreground)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }">
              Excluir Solicitação
            </h2>
            <UButton variant="ghost" color="neutral" icon="i-lucide-x" @click="closeCancelRequestModal" />
          </div>
          <p :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', lineHeight: 1.5, marginBottom: '1.5rem' }">
            Tem certeza que deseja excluir essa solicitação de bolsa do bolsista
            <strong>{{ selectedMemberForCancelRequest.name }}</strong>?
          </p>
          <div class="flex justify-end gap-3">
            <UButton variant="outline" color="neutral" @click="closeCancelRequestModal">Não, voltar</UButton>
            <UButton color="primary" @click="confirmCancelRequest">Sim, excluir</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
