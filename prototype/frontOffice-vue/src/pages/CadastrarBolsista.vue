<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

type EquipeTab = 'bolsistas' | 'informacoes' | 'pagamentos'

function onBack(tab?: EquipeTab) {
  router.push({ path: '/minha-equipe', query: tab ? { tab } : {} })
}

// TODO Fase 4: VeeValidate+Zod
const cpf = ref('')
const bolsistaName = ref('')
const orientador = ref('')
const orientadorIsCoordinator = ref(false)
const modalidade = ref('BPIG-X')
const tipoBolsa = ref('Iniciação Científica')
const quantidadeCotas = ref('1')
const dataInicio = ref('')
const dataTermino = ref('')
const nomeAtividade = ref('')
const planoTrabalho = ref('')
const objetivos = ref('')
const areaConhecimentoSearch = ref('')
const isConfirmModalOpen = ref(false)

interface AreaConhecimento {
  nivel1: string
  nivel2: string
  nivel3: string
}

const selectedAreaConhecimento = ref<AreaConhecimento | null>(null)

const modalidades = [
  'BPIG-I', 'BPIG-II', 'BPIG-III', 'BPIG-IV', 'BPIG-V',
  'BPIG-VI', 'BPIG-VII', 'BPIG-VIII', 'BPIG-IX', 'BPIG-X',
]

const tiposBolsa = [
  'Iniciação Científica',
  'Mestrado',
  'Doutorado',
  'Pós-Doutorado',
]

const coordenadorProjeto = 'Paulo Sergio dos Santos Junior'

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const mesesCurtos = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const areasConhecimentoCnpq: AreaConhecimento[] = [
  { nivel1: 'Ciências Exatas e da Terra', nivel2: 'Ciência da Computação', nivel3: 'Sistemas de Computação' },
  { nivel1: 'Ciências Exatas e da Terra', nivel2: 'Ciência da Computação', nivel3: 'Engenharia de Software' },
  { nivel1: 'Ciências Exatas e da Terra', nivel2: 'Matemática', nivel3: 'Matemática Aplicada' },
  { nivel1: 'Engenharias', nivel2: 'Engenharia Elétrica', nivel3: 'Telecomunicações' },
  { nivel1: 'Engenharias', nivel2: 'Engenharia de Produção', nivel3: 'Pesquisa Operacional' },
  { nivel1: 'Ciências Humanas', nivel2: 'Educação', nivel3: 'Ensino-Aprendizagem' },
  { nivel1: 'Ciências Sociais Aplicadas', nivel2: 'Administração', nivel3: 'Administração Pública' },
  { nivel1: 'Ciências da Saúde', nivel2: 'Saúde Coletiva', nivel3: 'Epidemiologia' },
]

const isAreaConhecimentoOpen = ref(false)
const filteredAreasConhecimento = computed(() =>
  areasConhecimentoCnpq.filter((area) =>
    `${area.nivel1} ${area.nivel2} ${area.nivel3}`
      .toLowerCase()
      .includes(areaConhecimentoSearch.value.toLowerCase()),
  ),
)

function formatCPF(value: string) {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return value
}

function onCpfInput(e: Event) {
  const input = e.target as HTMLInputElement
  cpf.value = formatCPF(input.value)
}

function handleBuscarCPF() {
  if (cpf.value.length >= 3) {
    bolsistaName.value = 'Marcela Starling'
  }
}

function onOrientadorInput(value: string) {
  orientador.value = value
  if (orientadorIsCoordinator.value && value !== coordenadorProjeto) {
    orientadorIsCoordinator.value = false
  }
}

function onOrientadorCoordCheck(checked: boolean) {
  orientadorIsCoordinator.value = checked
  orientador.value = checked ? coordenadorProjeto : ''
}

function formatMonthYear(value: string) {
  const [year, month] = value.split('-').map(Number)
  if (!year || !month) return ''
  return `${meses[month - 1]} de ${year}`
}

function addMonths(value: string, monthsToAdd: number) {
  const [year, month] = value.split('-').map(Number)
  if (!year || !month || monthsToAdd < 0) return ''
  const date = new Date(year, month - 1 + monthsToAdd, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function updateFimAtividades(inicio = dataInicio.value, cotas = quantidadeCotas.value) {
  const quantidade = Number(cotas)
  if (!inicio || !Number.isFinite(quantidade) || quantidade <= 0) return
  dataTermino.value = addMonths(inicio, quantidade - 1)
}

function onQuantidadeCotasChange(value: string) {
  quantidadeCotas.value = value
  updateFimAtividades(dataInicio.value, value)
}

function onInicioAtividadesChange(value: string) {
  dataInicio.value = value
  updateFimAtividades(value, quantidadeCotas.value)
}

// Month picker state (per picker)
const inicioOpen = ref(false)
const inicioDisplayYear = ref(2026)
const fimOpen = ref(false)
const fimDisplayYear = ref(2026)

function openInicio() {
  inicioOpen.value = !inicioOpen.value
  const y = Number(dataInicio.value.split('-')[0])
  if (Number.isFinite(y) && y > 0) inicioDisplayYear.value = y
}
function openFim() {
  fimOpen.value = !fimOpen.value
  const y = Number(dataTermino.value.split('-')[0])
  if (Number.isFinite(y) && y > 0) fimDisplayYear.value = y
}

function pickInicio(monthIdx: number) {
  const v = `${inicioDisplayYear.value}-${String(monthIdx + 1).padStart(2, '0')}`
  onInicioAtividadesChange(v)
  inicioOpen.value = false
}
function pickFim(monthIdx: number) {
  const v = `${fimDisplayYear.value}-${String(monthIdx + 1).padStart(2, '0')}`
  dataTermino.value = v
  fimOpen.value = false
}

function pickArea(area: AreaConhecimento) {
  selectedAreaConhecimento.value = area
  areaConhecimentoSearch.value = area.nivel3
  isAreaConhecimentoOpen.value = false
}

function onAreaInput(value: string) {
  areaConhecimentoSearch.value = value
  selectedAreaConhecimento.value = null
  isAreaConhecimentoOpen.value = true
}

function onAreaBlur() {
  window.setTimeout(() => {
    isAreaConhecimentoOpen.value = false
  }, 120)
}

function handleCadastrar() {
  isConfirmModalOpen.value = true
}

function handleConfirmSalvar() {
  isConfirmModalOpen.value = false
  onBack('bolsistas')
  // TODO Fase 4: toast.success('Solicitação de bolsa enviada com sucesso!')
}

function handleCancel() {
  onBack()
}

const formFieldBackground = '#171717'
const formSectionStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '1.5rem',
}

const confirmRows = computed(() => [
  { label: t('cadastrarBolsista.confirm.bolsista', 'Bolsista'), value: bolsistaName.value || '—', highlight: false },
  { label: t('cadastrarBolsista.confirm.modalidade', 'Modalidade'), value: modalidade.value, highlight: true },
  { label: t('cadastrarBolsista.confirm.tipoBolsa', 'Tipo de Bolsa'), value: tipoBolsa.value, highlight: false },
  {
    label: t('cadastrarBolsista.confirm.vigencia', 'Data de vigência'),
    value: `${dataInicio.value ? formatMonthYear(dataInicio.value) : '—'} até ${dataTermino.value ? formatMonthYear(dataTermino.value) : '—'}`,
    highlight: false,
  },
])
</script>

<template>
  <div class="w-full px-4 md:px-8 py-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 mb-6">
      <button
        type="button"
        class="bg-transparent border-0 cursor-pointer p-0"
        :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }"
        @click="onBack()"
      >
        {{ t('cadastrarBolsista.breadcrumb.equipe', 'Minha Equipe') }}
      </button>
      <UIcon name="i-lucide-chevron-right" class="size-4" :style="{ color: 'var(--muted-foreground)' }" />
      <span
        :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }"
      >
        {{ t('cadastrarBolsista.breadcrumb.title', 'Solicitar Bolsa') }}
      </span>
    </div>

    <!-- Header with icon -->
    <div class="flex items-center gap-3 mb-2">
      <div
        class="p-2"
        :style="{
          color: 'var(--primary)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
        }"
      >
        <UIcon name="i-lucide-user-plus" class="size-5" />
      </div>
      <h1 :style="{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }">
        {{ t('cadastrarBolsista.title', 'Solicitar Bolsa') }}
      </h1>
    </div>

    <!-- Subtitle -->
    <p
      :style="{
        color: 'var(--muted-foreground)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-normal)',
        marginLeft: 'calc(32px + 0.75rem)',
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-family)',
      }"
    >
      {{ t('cadastrarBolsista.subtitle', 'Incluir nova pessoa para atuar no projeto ou atualizar bolsa de pessoa que já atua no projeto') }}
    </p>

    <!-- Divider -->
    <div :style="{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '2rem' }" />

    <!-- Form -->
    <div class="space-y-6">
      <!-- Section 1: Informações da Bolsa -->
      <section :style="formSectionStyle">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="flex items-center justify-center"
            :style="{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              flexShrink: 0,
              fontFamily: 'var(--font-family)',
            }"
          >1</span>
          <h2 :style="{ color: 'var(--foreground)', fontSize: '16px', fontWeight: 'var(--font-weight-normal)', lineHeight: 1.2, margin: 0, fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.section1', 'Informações da Bolsa') }}
          </h2>
        </div>

        <!-- Projeto Vinculado -->
        <div class="mb-6">
          <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.fields.projeto', 'Projeto Vinculado') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
          </label>
          <input
            type="text"
            value="ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação"
            readonly
            :style="{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', cursor: 'not-allowed', fontFamily: 'var(--font-family)' }"
          />
        </div>

        <!-- CPF do Bolsista -->
        <div class="mb-6">
          <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.fields.cpf', 'CPF do Bolsista') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              :value="cpf"
              placeholder="000.000.000-00"
              :maxlength="14"
              :style="{ flex: 1, padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }"
              @input="onCpfInput"
            />
            <button
              type="button"
              :style="{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-family)' }"
              @click="handleBuscarCPF"
            >
              <UIcon name="i-lucide-search" class="size-4" />
              {{ t('cadastrarBolsista.actions.buscar', 'Buscar') }}
            </button>
          </div>
          <div
            v-if="bolsistaName"
            class="flex items-center gap-2 mt-2 px-3 py-2"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderRadius: 'var(--radius)',
            }"
          >
            <div :style="{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }" />
            <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }">
              {{ bolsistaName }}
            </span>
            <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }">
              {{ t('cadastrarBolsista.encontrado', 'encontrado') }}
            </span>
          </div>
        </div>

        <!-- Orientador -->
        <div class="mb-6">
          <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.fields.orientador', 'Orientador') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
          </label>
          <input
            type="text"
            :value="orientador"
            :placeholder="t('cadastrarBolsista.placeholders.orientador', 'Nome do orientador responsável')"
            :style="{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }"
            @input="onOrientadorInput(($event.target as HTMLInputElement).value)"
          />
          <label class="flex items-center gap-2 mt-3" :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }">
            <input
              type="checkbox"
              :checked="orientadorIsCoordinator"
              :style="{ accentColor: 'var(--primary)' }"
              @change="onOrientadorCoordCheck(($event.target as HTMLInputElement).checked)"
            />
            {{ t('cadastrarBolsista.orientadorIsCoord', 'Orientador é o coordenador do projeto.') }}
          </label>
        </div>

        <!-- Modalidade and Tipo de Bolsa -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
              {{ t('cadastrarBolsista.fields.modalidade', 'Modalidade') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
            </label>
            <USelectMenu
              v-model="modalidade"
              :items="modalidades"
              class="w-full"
            />
          </div>
          <div>
            <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
              {{ t('cadastrarBolsista.fields.tipoBolsa', 'Tipo de Bolsa') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
            </label>
            <USelectMenu
              v-model="tipoBolsa"
              :items="tiposBolsa"
              class="w-full"
            />
          </div>
        </div>

        <!-- Quantidade de Cotas, Início, Fim -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
              {{ t('cadastrarBolsista.fields.quantidadeCotas', 'Quantidade de Cotas') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
            </label>
            <input
              type="number"
              min="1"
              :value="quantidadeCotas"
              :style="{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }"
              @input="onQuantidadeCotasChange(($event.target as HTMLInputElement).value)"
            />
          </div>

          <!-- Início Month Picker -->
          <div>
            <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
              {{ t('cadastrarBolsista.fields.inicio', 'Início das Atividades') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
            </label>
            <div class="relative">
              <button
                type="button"
                class="w-full flex items-center justify-between"
                :style="{ padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: dataInicio ? 'var(--foreground)' : 'var(--muted-foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-family)' }"
                @click="openInicio"
              >
                <span>{{ dataInicio ? formatMonthYear(dataInicio) : t('cadastrarBolsista.placeholders.inicio', 'Selecione o mês de início') }}</span>
                <UIcon name="i-lucide-calendar" class="size-4" :style="{ color: 'var(--muted-foreground)' }" />
              </button>
              <template v-if="inicioOpen">
                <div :style="{ position: 'fixed', inset: 0, zIndex: 40 }" @click="inicioOpen = false" />
                <div
                  class="p-5"
                  :style="{
                    position: 'absolute',
                    top: 'calc(100% + 0.75rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(100vw - 2rem, 520px)',
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--elevation-sm)',
                    zIndex: 50,
                  }"
                >
                  <div class="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      class="p-2"
                      :style="{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer' }"
                      aria-label="Ano anterior"
                      @click="inicioDisplayYear--"
                    >
                      <UIcon name="i-lucide-chevron-left" class="size-5" />
                    </button>
                    <strong :style="{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }">
                      {{ inicioDisplayYear }}
                    </strong>
                    <button
                      type="button"
                      class="p-2"
                      :style="{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer' }"
                      aria-label="Próximo ano"
                      @click="inicioDisplayYear++"
                    >
                      <UIcon name="i-lucide-chevron-right" class="size-5" />
                    </button>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <button
                      v-for="(mes, index) in mesesCurtos"
                      :key="mes"
                      type="button"
                      class="px-4 py-3"
                      :style="{
                        backgroundColor: dataInicio === `${inicioDisplayYear}-${String(index + 1).padStart(2, '0')}` ? 'var(--primary)' : 'transparent',
                        color: dataInicio === `${inicioDisplayYear}-${String(index + 1).padStart(2, '0')}` ? 'var(--primary-foreground)' : 'var(--foreground)',
                        border: `1px solid ${dataInicio === `${inicioDisplayYear}-${String(index + 1).padStart(2, '0')}` ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        cursor: 'pointer',
                      }"
                      @click="pickInicio(index)"
                    >
                      {{ mes }}
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Fim Month Picker -->
          <div>
            <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
              {{ t('cadastrarBolsista.fields.fim', 'Fim das Atividades') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
            </label>
            <div class="relative">
              <button
                type="button"
                class="w-full flex items-center justify-between"
                :style="{ padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: dataTermino ? 'var(--foreground)' : 'var(--muted-foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-family)' }"
                @click="openFim"
              >
                <span>{{ dataTermino ? formatMonthYear(dataTermino) : t('cadastrarBolsista.placeholders.fim', 'Selecione o mês de fim') }}</span>
                <UIcon name="i-lucide-calendar" class="size-4" :style="{ color: 'var(--muted-foreground)' }" />
              </button>
              <template v-if="fimOpen">
                <div :style="{ position: 'fixed', inset: 0, zIndex: 40 }" @click="fimOpen = false" />
                <div
                  class="p-5"
                  :style="{
                    position: 'absolute',
                    top: 'calc(100% + 0.75rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(100vw - 2rem, 520px)',
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--elevation-sm)',
                    zIndex: 50,
                  }"
                >
                  <div class="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      class="p-2"
                      :style="{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer' }"
                      aria-label="Ano anterior"
                      @click="fimDisplayYear--"
                    >
                      <UIcon name="i-lucide-chevron-left" class="size-5" />
                    </button>
                    <strong :style="{ color: 'var(--foreground)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }">
                      {{ fimDisplayYear }}
                    </strong>
                    <button
                      type="button"
                      class="p-2"
                      :style="{ backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', cursor: 'pointer' }"
                      aria-label="Próximo ano"
                      @click="fimDisplayYear++"
                    >
                      <UIcon name="i-lucide-chevron-right" class="size-5" />
                    </button>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <button
                      v-for="(mes, index) in mesesCurtos"
                      :key="mes"
                      type="button"
                      class="px-4 py-3"
                      :style="{
                        backgroundColor: dataTermino === `${fimDisplayYear}-${String(index + 1).padStart(2, '0')}` ? 'var(--primary)' : 'transparent',
                        color: dataTermino === `${fimDisplayYear}-${String(index + 1).padStart(2, '0')}` ? 'var(--primary-foreground)' : 'var(--foreground)',
                        border: `1px solid ${dataTermino === `${fimDisplayYear}-${String(index + 1).padStart(2, '0')}` ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        cursor: 'pointer',
                      }"
                      @click="pickFim(index)"
                    >
                      {{ mes }}
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Informações Gerais -->
      <section :style="formSectionStyle">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="flex items-center justify-center"
            :style="{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              flexShrink: 0,
              fontFamily: 'var(--font-family)',
            }"
          >2</span>
          <h2 :style="{ color: 'var(--foreground)', fontSize: '16px', fontWeight: 'var(--font-weight-normal)', lineHeight: 1.2, margin: 0, fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.section2', 'Informações Gerais') }}
          </h2>
        </div>

        <!-- Plano de Trabalho -->
        <div class="mb-6">
          <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.fields.plano', 'Plano de Trabalho') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
          </label>
          <textarea
            v-model="planoTrabalho"
            :placeholder="t('cadastrarBolsista.placeholders.plano', 'Descreva o plano de trabalho do bolsista, incluindo atividades previstas e metodologia...')"
            :rows="4"
            :style="{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-family)' }"
          />
        </div>

        <!-- Nome da Atividade -->
        <div class="mb-6">
          <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.fields.nomeAtividade', 'Nome da Atividade') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
          </label>
          <input
            v-model="nomeAtividade"
            type="text"
            :placeholder="t('cadastrarBolsista.placeholders.nomeAtividade', 'Nome da função que será realizada pelo bolsista')"
            :style="{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }"
          />
        </div>

        <!-- Objetivos -->
        <div class="mb-6">
          <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.fields.objetivos', 'Objetivos') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
          </label>
          <textarea
            v-model="objetivos"
            :placeholder="t('cadastrarBolsista.placeholders.objetivos', 'Liste os objetivos do bolsista (um por linha) 1. Objetivo 1 2. Objetivo 2 3. Objetivo 3')"
            :rows="4"
            :style="{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-family)' }"
          />
        </div>

        <!-- Área do Conhecimento -->
        <div class="mb-8">
          <label :style="{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
            {{ t('cadastrarBolsista.fields.areaConhecimento', 'Área do Conhecimento') }} <span :style="{ color: 'var(--destructive-foreground)' }">*</span>
          </label>
          <div class="relative">
            <input
              type="text"
              :value="areaConhecimentoSearch"
              :placeholder="t('cadastrarBolsista.placeholders.area', 'Digite ou selecione uma área CNPq')"
              :style="{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: formFieldBackground, color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }"
              @focus="isAreaConhecimentoOpen = true"
              @blur="onAreaBlur"
              @input="onAreaInput(($event.target as HTMLInputElement).value)"
            />
            <div
              v-if="isAreaConhecimentoOpen && filteredAreasConhecimento.length > 0"
              :style="{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)', zIndex: 50, maxHeight: '220px', overflowY: 'auto' }"
            >
              <button
                v-for="area in filteredAreasConhecimento"
                :key="`${area.nivel1}-${area.nivel2}-${area.nivel3}`"
                type="button"
                :style="{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }"
                @mousedown.prevent
                @click="pickArea(area)"
              >
                {{ area.nivel3 }}
              </button>
            </div>
          </div>
          <div v-if="selectedAreaConhecimento" class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div :style="{ padding: '0.75rem', backgroundColor: 'color-mix(in srgb, var(--primary) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 18%, transparent)', borderRadius: 'var(--radius)' }">
              <span :style="{ display: 'block', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">{{ t('cadastrarBolsista.area.nivel1', 'Nível 1 CNPq') }}</span>
              <strong :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">{{ selectedAreaConhecimento.nivel1 }}</strong>
            </div>
            <div :style="{ padding: '0.75rem', backgroundColor: 'color-mix(in srgb, var(--primary) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 18%, transparent)', borderRadius: 'var(--radius)' }">
              <span :style="{ display: 'block', color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">{{ t('cadastrarBolsista.area.nivel2', 'Nível 2 CNPq') }}</span>
              <strong :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">{{ selectedAreaConhecimento.nivel2 }}</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          :style="{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: 'var(--font-family)' }"
          @click="handleCancel"
        >
          {{ t('cadastrarBolsista.actions.cancelar', 'Cancelar') }}
        </button>
        <button
          type="button"
          :style="{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: 'var(--font-family)' }"
          @click="handleCadastrar"
        >
          {{ t('cadastrarBolsista.actions.solicitar', 'Solicitar Bolsa') }}
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <template v-if="isConfirmModalOpen">
      <div
        :style="{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }"
        @click="isConfirmModalOpen = false"
      />
      <div
        :style="{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--popover)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          width: '90%',
          maxWidth: '480px',
          zIndex: 1000,
          boxShadow: 'var(--elevation-sm)',
          fontFamily: 'var(--font-family)',
        }"
      >
        <div :style="{ padding: '1.5rem' }">
          <div class="flex items-start justify-between" :style="{ marginBottom: '1.25rem' }">
            <div class="flex items-center gap-3">
              <div
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }"
              >
                <UIcon name="i-lucide-alert-circle" class="size-5" />
              </div>
              <h2
                :style="{
                  color: 'var(--foreground)',
                  fontSize: '18px',
                  fontWeight: 'var(--font-weight-normal)',
                  margin: 0,
                  fontFamily: 'var(--font-family)',
                }"
              >
                {{ t('cadastrarBolsista.confirm.title', 'Solicitar Bolsa') }}
              </h2>
            </div>
            <button
              type="button"
              :style="{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', flexShrink: 0 }"
              @click="isConfirmModalOpen = false"
            >
              <UIcon name="i-lucide-x" class="size-5" />
            </button>
          </div>

          <p
            :style="{
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground)',
              lineHeight: '1.6',
              margin: '0 0 1.25rem 0',
              fontFamily: 'var(--font-family)',
            }"
          >
            {{ t('cadastrarBolsista.confirm.message1', 'Tem certeza que deseja solicitar a bolsa de') }}
            <strong :style="{ fontWeight: 'var(--font-weight-semibold)' }">
              {{ bolsistaName || t('cadastrarBolsista.confirm.bolsistaFallback', 'bolsista') }}
            </strong>
            {{ t('cadastrarBolsista.confirm.message2', 'na modalidade') }}
            <strong :style="{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }">
              {{ modalidade }}
            </strong>
            ?
          </p>

          <div
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
              borderRadius: 'var(--radius)',
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }"
          >
            <div v-for="(row, idx) in confirmRows" :key="row.label">
              <div class="flex items-center justify-between">
                <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }">
                  {{ row.label }}
                </span>
                <span
                  :style="{
                    color: row.highlight ? 'var(--primary)' : 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontFamily: 'var(--font-family)',
                  }"
                >
                  {{ row.value }}
                </span>
              </div>
              <div
                v-if="idx < confirmRows.length - 1"
                :style="{ height: '1px', backgroundColor: 'color-mix(in srgb, var(--border) 60%, transparent)', marginTop: '0.625rem' }"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              :style="{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: 'var(--font-family)' }"
              @click="isConfirmModalOpen = false"
            >
              {{ t('cadastrarBolsista.actions.cancelar', 'Cancelar') }}
            </button>
            <button
              type="button"
              :style="{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: 'var(--font-family)' }"
              @click="handleConfirmSalvar"
            >
              {{ t('cadastrarBolsista.actions.confirmar', 'Confirmar') }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
