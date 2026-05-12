<script setup lang="ts">
import { ref, computed } from 'vue'

type TabKey = 'interno' | 'fapes' | 'bolsa'
type FapesType = 'category' | 'item'

const activeTab = ref<TabKey>('interno')

// Interno states
const fromCategory = ref('')
const toCategory = ref('')
const toItem = ref('')
const transferValue = ref('')
const justification = ref('')
const expandedCategory = ref<number | null>(null)

// Fapes states
const fapesType = ref<FapesType>('item')
const newCategoryType = ref('')
const newItemType = ref('')
const newItemName = ref('')
const fapesFromCategory = ref('')
const fapesValue = ref('')
const fapesJustification = ref('')

// Bolsa states - cotas desejadas
const quotasBpigX = ref(0)
const quotasBpigIX = ref(0)
const quotasBpigVIII = ref(0)
const quotasBpigVII = ref(0)
const quotasBpigVI = ref(0)
const quotasBpigV = ref(0)
const quotasBpigIV = ref(0)
const quotasBpigIII = ref(0)
const quotasBpigII = ref(0)
const quotasBpigI = ref(0)

interface CategoryHistoryEntry {
  date: string
  title: string
  description: string
}
interface CategoryData {
  id: number
  name: string
  approved: string
  used: string
  available: string
  progress: number
  history: CategoryHistoryEntry[]
}

const availableCategories = [
  { value: 'material-permanente', label: 'Material Permanente' },
  { value: 'material-consumo', label: 'Material de Consumo' },
  { value: 'passagem', label: 'Passagem' },
  { value: 'diaria', label: 'Diária' },
  { value: 'pessoa-fisica', label: 'Pessoa Física' },
  { value: 'pessoa-juridica', label: 'Pessoa Jurídica' },
]

const categoryMapping: Record<string, string> = {
  'material-permanente': 'Material Permanente',
  'material-consumo': 'Material de Consumo',
  'passagem': 'Passagem',
  'diaria': 'Diária',
  'pessoa-fisica': 'Pessoa Física',
  'pessoa-juridica': 'Pessoa Jurídica',
  'servicos-terceiros': 'Serviços de Terceiros',
  'equipamentos': 'Equipamentos',
  'bolsas': 'Bolsas',
}

const categories: CategoryData[] = [
  {
    id: 1,
    name: 'Material Permanente',
    approved: 'R$ 486.500,00',
    used: 'R$ 315.085,17',
    available: 'R$ 171.434,83',
    progress: 64.8,
    history: [
      {
        date: '08/01/2026',
        title: 'Transferência de R$ 50.000,00 para Material de Consumo',
        description: 'Remanejamento aprovado para compra de insumos laboratoriais',
      },
      {
        date: '15/12/2025',
        title: 'Transferência de R$ 25.000,00 para Passagem',
        description: 'Remanejamento aprovado para participação em congresso internacional',
      },
    ],
  },
  {
    id: 2,
    name: 'Material de Consumo',
    approved: 'R$ 260.740,00',
    used: 'R$ 2.630,72',
    available: 'R$ 258.109,28',
    progress: 10,
    history: [
      {
        date: '08/01/2026',
        title: 'Recebimento de R$ 50.000,00 de Material Permanente',
        description: 'Remanejamento aprovado para compra de insumos laboratoriais',
      },
    ],
  },
  {
    id: 3,
    name: 'Passagem',
    approved: 'R$ 73.200,00',
    used: 'R$ 695,74',
    available: 'R$ 72.504,26',
    progress: 1.0,
    history: [
      {
        date: '15/12/2025',
        title: 'Recebimento de R$ 25.000,00 de Material Permanente',
        description: 'Remanejamento aprovado para participação em congresso internacional',
      },
    ],
  },
  {
    id: 4,
    name: 'Diária',
    approved: 'R$ 56.640,00',
    used: 'R$ 0,00',
    available: 'R$ 56.640,00',
    progress: 0.0,
    history: [],
  },
  {
    id: 5,
    name: 'Pessoa Jurídica',
    approved: 'R$ 1.736.100,00',
    used: 'R$ 83.392,17',
    available: 'R$ 1.652.707,83',
    progress: 4.8,
    history: [],
  },
  {
    id: 6,
    name: 'Pessoa Física',
    approved: 'R$ 0,00',
    used: 'R$ 0,00',
    available: 'R$ 0,00',
    progress: 0.0,
    history: [],
  },
]

const getCategoryData = (categoryValue: string): CategoryData | undefined => {
  const categoryName = categoryMapping[categoryValue]
  return categories.find(cat => cat.name === categoryName)
}

interface DropdownOption {
  value: string
  label: string
  info?: string
}

const getCategoryOptions = (excludeCategory?: string): DropdownOption[] => {
  return availableCategories
    .filter(cat => cat.value !== excludeCategory)
    .map(cat => {
      const categoryData = getCategoryData(cat.value)
      return {
        value: cat.value,
        label: cat.label,
        info: categoryData ? `Disponível: ${categoryData.available}` : undefined,
      }
    })
}

const fromCategoryOptions = computed(() => getCategoryOptions(toCategory.value))
const toCategoryOptions = computed(() => getCategoryOptions(fromCategory.value))

const itemOptions: DropdownOption[] = [
  { value: 'item1', label: 'Item 1' },
  { value: 'item2', label: 'Item 2' },
  { value: 'item3', label: 'Item 3' },
]

const parseCurrency = (value: string): number => {
  if (!value) return 0
  const cleaned = value.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const fromCategoryData = computed(() => getCategoryData(fromCategory.value))
const toCategoryData = computed(() => getCategoryData(toCategory.value))

const fromAfterTransfer = computed(() => {
  if (!fromCategoryData.value) return 0
  return parseCurrency(fromCategoryData.value.available) - parseCurrency(transferValue.value)
})
const toAfterTransfer = computed(() => {
  if (!toCategoryData.value) return 0
  return parseCurrency(toCategoryData.value.available) + parseCurrency(transferValue.value)
})

const showSimulation = computed(() =>
  Boolean(fromCategory.value && toCategory.value && transferValue.value)
)

const isInternoFormValid = computed(() =>
  Boolean(
    fromCategory.value &&
    toCategory.value &&
    toItem.value &&
    transferValue.value &&
    justification.value
  )
)

const hasQuotasChanged = computed(() =>
  quotasBpigX.value > 0 || quotasBpigIX.value > 0 || quotasBpigVIII.value > 0 ||
  quotasBpigVII.value > 0 || quotasBpigVI.value > 0 || quotasBpigV.value > 0 ||
  quotasBpigIV.value > 0 || quotasBpigIII.value > 0 || quotasBpigII.value > 0 ||
  quotasBpigI.value > 0
)

const handleClear = () => {
  fromCategory.value = ''
  toCategory.value = ''
  toItem.value = ''
  transferValue.value = ''
  justification.value = ''
}

const handleConfirm = () => {
  const fromCategoryName = categoryMapping[fromCategory.value]
  const toCategoryName = categoryMapping[toCategory.value]
  console.log(`Transferência de ${transferValue.value} de ${fromCategoryName} para ${toCategoryName}`)
  handleClear()
}

const handleFapesClear = () => {
  newCategoryType.value = ''
  newItemType.value = ''
  newItemName.value = ''
  fapesFromCategory.value = ''
  fapesValue.value = ''
  fapesJustification.value = ''
}

const handleFapesSubmit = () => {
  console.log('Fapes request submitted')
}

const handleSaveRemanejamento = () => {
  console.log('Remanejamento saved:', {
    'BPIG-X': quotasBpigX.value,
    'BPIG-IX': quotasBpigIX.value,
    'BPIG-VIII': quotasBpigVIII.value,
    'BPIG-VII': quotasBpigVII.value,
    'BPIG-VI': quotasBpigVI.value,
    'BPIG-V': quotasBpigV.value,
    'BPIG-IV': quotasBpigIV.value,
    'BPIG-III': quotasBpigIII.value,
    'BPIG-II': quotasBpigII.value,
    'BPIG-I': quotasBpigI.value,
  })
}

interface BolsaItem {
  modalidade: string
  valor: number
  cotasDisponiveis: number
  model: typeof quotasBpigX
}

const bolsasList: BolsaItem[] = [
  { modalidade: 'BPIG-X', valor: 300, cotasDisponiveis: 4, model: quotasBpigX },
  { modalidade: 'BPIG-IX', valor: 450, cotasDisponiveis: 3, model: quotasBpigIX },
  { modalidade: 'BPIG-VIII', valor: 700, cotasDisponiveis: 2, model: quotasBpigVIII },
  { modalidade: 'BPIG-VII', valor: 1200, cotasDisponiveis: 1, model: quotasBpigVII },
  { modalidade: 'BPIG-VI', valor: 1800, cotasDisponiveis: 3, model: quotasBpigVI },
  { modalidade: 'BPIG-V', valor: 2700, cotasDisponiveis: 2, model: quotasBpigV },
  { modalidade: 'BPIG-IV', valor: 3500, cotasDisponiveis: 5, model: quotasBpigIV },
  { modalidade: 'BPIG-III', valor: 5500, cotasDisponiveis: 4, model: quotasBpigIII },
  { modalidade: 'BPIG-II', valor: 7500, cotasDisponiveis: 3, model: quotasBpigII },
  { modalidade: 'BPIG-I', valor: 10000, cotasDisponiveis: 2, model: quotasBpigI },
]
</script>

<template>
  <div class="w-full max-w-full px-4 md:px-8 py-8" style="overflow-x: hidden">
    <!-- Header with icon -->
    <div class="flex items-center gap-3 mb-2">
      <div
        class="p-2 transition-colors"
        :style="{
          color: 'var(--primary)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
        }"
      >
        <UIcon name="i-lucide-refresh-cw" class="w-5 h-5" />
      </div>
      <h1 :style="{ color: 'var(--foreground)', margin: 0, wordBreak: 'break-word' }">
        Remanejamento de Recursos
      </h1>
    </div>

    <!-- Subtitle -->
    <p
      class="mb-8"
      :style="{
        color: 'var(--muted-foreground)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-normal)',
        marginLeft: 'calc(32px + 0.75rem)',
        wordBreak: 'break-word',
      }"
    >
      Se você possui a categoria, o valor e o item aprovados, pode fazer o Remanejamento Interno de valores entre categorias sem solicitar a Fapes. Se deseja criar uma nova categoria ou item, faça a Solicitar Aprovação de Novo Item ou Nova Categoria.
    </p>

    <!-- Desktop Tab Bar -->
    <div
      class="hidden md:flex gap-6 mb-8 overflow-x-auto"
      style="border-bottom: 1px solid var(--border)"
    >
      <button
        v-for="tab in ([
          { key: 'interno', label: 'Remanejamento Interno' },
          { key: 'fapes', label: 'Remanejamento Fapes' },
          { key: 'bolsa', label: 'Remanejamento de Bolsa' },
        ] as { key: TabKey; label: string }[])"
        :key="tab.key"
        class="pb-3 transition-all"
        :style="{
          color: activeTab === tab.key ? 'var(--primary)' : 'var(--muted-foreground)',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--text-sm)',
          marginBottom: '-1px',
          background: 'none',
          border: 'none',
          borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
          cursor: 'pointer',
        }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Mobile Tab Bar -->
    <div
      class="flex md:hidden flex-col mb-8"
      style="border-left: 2px solid var(--border)"
    >
      <button
        v-for="tab in ([
          { key: 'interno', label: 'Remanejamento Interno' },
          { key: 'fapes', label: 'Remanejamento Fapes' },
          { key: 'bolsa', label: 'Remanejamento de Bolsa' },
        ] as { key: TabKey; label: string }[])"
        :key="tab.key"
        class="py-3 pl-4 transition-all text-left"
        :style="{
          color: activeTab === tab.key ? 'var(--primary)' : 'var(--muted-foreground)',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--text-sm)',
          background: 'none',
          border: 'none',
          borderLeft: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
          marginLeft: '-2px',
          cursor: 'pointer',
        }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- INTERNO -->
    <template v-if="activeTab === 'interno'">
      <div
        class="p-4 md:p-6 lg:p-8 w-full max-w-full"
        :style="{
          backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
          borderRadius: 'var(--radius)',
          border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
        }"
      >
        <h1
          class="mb-6"
          :style="{ color: 'var(--foreground)', margin: '0 0 1.5rem 0', wordBreak: 'break-word' }"
        >
          Transferir Valores Entre Categorias
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- De (Origem) -->
          <div>
            <label
              class="block mb-4"
              :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
            >
              De (Origem)
            </label>

            <div class="mb-4">
              <USelectMenu
                v-model="fromCategory"
                :items="fromCategoryOptions"
                value-key="value"
                label-key="label"
                placeholder="Selecione uma categoria"
                class="w-full"
              />
            </div>

            <label
              class="block mb-2"
              :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
            >
              Valor a Transferir
            </label>
            <UInput
              v-model="transferValue"
              type="text"
              placeholder="R$ 0,00"
              class="w-full"
            />
          </div>

          <!-- Para (Destino) -->
          <div>
            <label
              class="block mb-4"
              :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
            >
              Para (Destino)
            </label>

            <div class="mb-4">
              <USelectMenu
                v-model="toCategory"
                :items="toCategoryOptions"
                value-key="value"
                label-key="label"
                placeholder="Selecione uma categoria"
                class="w-full"
              />
            </div>

            <label
              class="block mb-2"
              :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
            >
              Informe para qual item irá o valor
            </label>
            <USelectMenu
              v-model="toItem"
              :items="itemOptions"
              value-key="value"
              label-key="label"
              placeholder="Selecione um item"
              class="w-full"
            />
          </div>
        </div>

        <!-- Resumo da Transferência -->
        <div v-if="showSimulation" class="mb-6">
          <label
            class="block mb-4"
            :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
          >
            Simulação
          </label>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-if="fromCategoryData"
              class="p-4"
              :style="{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }"
            >
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.75rem' }">
                {{ fromCategoryData.name }}
              </div>
              <div class="flex justify-between items-center mb-2">
                <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">Disponível atual:</span>
                <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ fromCategoryData.available }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">Após transferência:</span>
                <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ formatCurrency(fromAfterTransfer) }}</span>
              </div>
            </div>

            <div
              v-if="toCategoryData"
              class="p-4"
              :style="{
                backgroundColor: 'color-mix(in srgb, var(--primary) 8%, var(--card))',
                border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                borderRadius: 'var(--radius)',
              }"
            >
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.75rem' }">
                {{ toCategoryData.name }}
              </div>
              <div class="flex justify-between items-center mb-2">
                <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">Disponível atual:</span>
                <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ toCategoryData.available }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">Após transferência:</span>
                <span :style="{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">{{ formatCurrency(toAfterTransfer) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Justification -->
        <div class="mb-6">
          <label
            class="block mb-2"
            :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
          >
            Justifique a transferência de valor:
          </label>
          <UInput
            v-model="justification"
            type="text"
            placeholder="Exemplo: adequação às necessidades do projeto"
            class="w-full"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="handleClear">Limpar</UButton>
          <UButton :disabled="!isInternoFormValid" @click="handleConfirm">Confirmar Transferência</UButton>
        </div>
      </div>

      <!-- Valores por Categoria -->
      <div class="mt-12 w-full max-w-full">
        <h1 :style="{ color: 'var(--foreground)', margin: '0 0 0.5rem 0', wordBreak: 'break-word' }">
          Valores por Categoria
        </h1>
        <p
          :style="{
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            margin: '0 0 1.5rem 0',
            wordBreak: 'break-word',
          }"
        >
          Visualize o orçamento aprovado, valores já gastos e saldo disponível em cada categoria.
        </p>

        <div class="grid grid-cols-1 gap-4 w-full max-w-full">
          <div
            v-for="category in categories"
            :key="category.id"
            class="overflow-hidden w-full max-w-full"
            :style="{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }"
          >
            <div
              class="p-4 md:p-5 w-full max-w-full"
              style="cursor: pointer"
              @click="expandedCategory = expandedCategory === category.id ? null : category.id"
            >
              <!-- Desktop Layout -->
              <div class="hidden md:grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1 flex items-center">
                  <UIcon
                    name="i-lucide-chevron-down"
                    class="w-4 h-4"
                    :style="{
                      color: 'var(--muted-foreground)',
                      transform: expandedCategory === category.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }"
                  />
                </div>

                <div class="col-span-2" style="margin-left: -1rem">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Categoria</div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ category.name }}</div>
                </div>

                <div class="col-span-2">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Aprovado</div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ category.approved }}</div>
                </div>

                <div class="col-span-2">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Utilizado</div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">{{ category.used }}</div>
                </div>

                <div class="col-span-2">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Disponível</div>
                  <div :style="{ color: 'var(--primary)', fontSize: 'var(--text-sm)' }">{{ category.available }}</div>
                </div>

                <div class="col-span-3">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Progresso</div>
                  <div class="flex items-center gap-2">
                    <div :style="{ flex: 1, height: '6px', backgroundColor: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }">
                      <div :style="{ width: `${category.progress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s ease' }" />
                    </div>
                    <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', minWidth: '45px' }">{{ category.progress }}%</span>
                  </div>
                </div>
              </div>

              <!-- Mobile Layout -->
              <div class="md:hidden w-full max-w-full">
                <div class="flex items-center justify-between mb-4 w-full max-w-full">
                  <div class="flex-1 min-w-0 pr-2">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Categoria</div>
                    <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', wordBreak: 'break-word' }">
                      {{ category.name }}
                    </div>
                  </div>
                  <UIcon
                    name="i-lucide-chevron-down"
                    class="w-4 h-4 shrink-0"
                    :style="{
                      color: 'var(--muted-foreground)',
                      transform: expandedCategory === category.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }"
                  />
                </div>

                <div class="grid grid-cols-3 gap-3 mb-4 w-full max-w-full">
                  <div class="min-w-0">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Aprovado</div>
                    <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">{{ category.approved }}</div>
                  </div>
                  <div class="min-w-0">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Utilizado</div>
                    <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">{{ category.used }}</div>
                  </div>
                  <div class="min-w-0">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">Disponível</div>
                    <div :style="{ color: 'var(--primary)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">{{ category.available }}</div>
                  </div>
                </div>

                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">Progresso</div>
                  <div class="flex items-center gap-2">
                    <div :style="{ flex: 1, height: '6px', backgroundColor: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }">
                      <div :style="{ width: `${category.progress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s ease' }" />
                    </div>
                    <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', minWidth: '45px' }">{{ category.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- History -->
            <div
              v-if="expandedCategory === category.id && category.history.length > 0"
              class="px-4 md:px-5 pb-4 md:pb-5 w-full max-w-full"
              :style="{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', paddingLeft: 'calc(8.33% + 1rem)' }"
            >
              <h2
                :style="{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '1rem',
                  wordBreak: 'break-word',
                }"
              >
                Histórico de Remanejamentos
              </h2>
              <div class="relative w-full max-w-full">
                <div
                  v-for="(entry, index) in category.history"
                  :key="index"
                  class="flex gap-4 pb-8 relative"
                >
                  <div
                    v-if="index !== category.history.length - 1"
                    :style="{
                      position: 'absolute',
                      left: '14px',
                      top: '28px',
                      height: 'calc(100% - 28px)',
                      width: '2px',
                      backgroundColor: 'var(--primary)',
                    }"
                  />
                  <div style="position: relative; flex-shrink: 0">
                    <div
                      :style="{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: index === category.history.length - 1 ? 'var(--muted)' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }"
                    >
                      <UIcon
                        name="i-lucide-refresh-cw"
                        class="w-3.5 h-3.5"
                        :style="{ color: index === category.history.length - 1 ? 'var(--muted-foreground)' : 'var(--background)' }"
                      />
                    </div>
                  </div>
                  <div :style="{ flex: 1, paddingTop: '2px', minWidth: 0 }">
                    <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem' }">
                      {{ entry.date }}
                    </div>
                    <div
                      :style="{
                        color: 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: '0.25rem',
                        wordBreak: 'break-word',
                      }"
                    >
                      {{ entry.title }}
                    </div>
                    <div
                      :style="{
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-normal)',
                        lineHeight: '1.5',
                        wordBreak: 'break-word',
                      }"
                    >
                      {{ entry.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="expandedCategory === category.id && category.history.length === 0"
              class="px-5 pb-5"
              :style="{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', paddingLeft: 'calc(8.33% + 1rem)' }"
            >
              <h2
                :style="{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  marginBottom: '0.5rem',
                }"
              >
                Histórico de Alterações
              </h2>
              <p
                :style="{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  lineHeight: '1.5',
                }"
              >
                Não foram feitas transferências De (Origem) ou para (Destino) essa categoria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- FAPES -->
    <template v-else-if="activeTab === 'fapes'">
      <div
        class="p-4 md:p-6 lg:p-8 w-full max-w-full"
        :style="{
          backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
          borderRadius: 'var(--radius)',
          border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
        }"
      >
        <h1
          class="mb-6"
          :style="{ color: 'var(--foreground)', margin: '0 0 1.5rem 0', wordBreak: 'break-word' }"
        >
          Solicitar Aprovação de Novo Item ou Nova Categoria
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              class="block mb-2"
              :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
            >
              Tipo de Remanejamento
            </label>
            <USelectMenu
              v-model="fapesType"
              :items="[
                { value: 'item', label: 'Solicitar Criar Novo Item' },
                { value: 'category', label: 'Solicitar Criar Nova Categoria' },
              ]"
              value-key="value"
              label-key="label"
              class="w-full"
            />
          </div>

          <div v-if="fapesType === 'category'">
            <label
              class="block mb-2"
              :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
            >
              Novo Tipo de Categoria
            </label>
            <USelectMenu
              v-model="newCategoryType"
              :items="availableCategories"
              value-key="value"
              label-key="label"
              placeholder="Selecione um tipo de categoria"
              class="w-full"
            />
          </div>

          <div v-if="fapesType === 'item'">
            <label
              :style="{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: '0.5rem',
                color: 'var(--muted-foreground)',
              }"
            >
              Categoria que o item pertence
            </label>
            <USelectMenu
              v-model="newItemType"
              :items="[
                { value: 'material-permanente', label: 'Material Permanente' },
                { value: 'material-consumo', label: 'Material de Consumo' },
              ]"
              value-key="value"
              label-key="label"
              placeholder="Selecione a categoria"
              class="w-full"
            />
          </div>
        </div>

        <div v-if="fapesType === 'item'" class="mb-6">
          <label
            class="block mb-2"
            :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
          >
            Nome do Novo Item (Usar o nome que estará na Nota Fiscal)
          </label>
          <UInput
            v-model="newItemName"
            type="text"
            placeholder="Exemplo: Equipamento de Laboratório"
            class="w-full"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              class="block mb-2"
              :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
            >
              De (Origem)
            </label>
            <USelectMenu
              v-model="fapesFromCategory"
              :items="availableCategories"
              value-key="value"
              label-key="label"
              placeholder="Selecione uma categoria"
              class="w-full"
            />
          </div>

          <div>
            <label
              class="block mb-2"
              :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
            >
              Valor a Transferir
            </label>
            <UInput
              v-model="fapesValue"
              type="text"
              placeholder="R$ 0,00"
              class="w-full"
            />
          </div>
        </div>

        <div class="mb-6">
          <label
            class="block mb-2"
            :style="{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }"
          >
            Justifique a transferência de valor:
          </label>
          <UTextarea
            v-model="fapesJustification"
            placeholder="Exemplo: adequação às necessidades do projeto"
            :rows="4"
            class="w-full"
          />
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="handleFapesClear">Limpar</UButton>
          <UButton color="primary" variant="soft" @click="handleFapesSubmit">Enviar Solicitação</UButton>
        </div>
      </div>
    </template>

    <!-- BOLSA -->
    <template v-else-if="activeTab === 'bolsa'">
      <div class="w-full max-w-full">
        <!-- Progress Card -->
        <div
          class="p-4 md:p-6 w-full max-w-full"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
            borderRadius: 'var(--radius)',
          }"
        >
          <div class="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-0 mb-1 w-full max-w-full">
            <div class="min-w-0">
              <div
                :style="{
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: 'var(--text-sm)',
                  marginBottom: '0.125rem',
                  wordBreak: 'break-word',
                }"
              >
                Orçamento total para bolsas
              </div>
              <div
                :style="{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  wordBreak: 'break-word',
                }"
              >
                Disponibilizado: R$ 300.000
              </div>
            </div>

            <div class="min-w-0 w-full md:w-auto" style="text-align: left">
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.125rem' }">
                Saldo disponível
              </div>
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }">
                R$ 125.000,00
              </div>
            </div>
          </div>

          <div style="margin-top: 1.5rem">
            <div class="mb-2">
              <div :style="{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }">
                <div :style="{ width: '58.33%', height: '100%', backgroundColor: '#60a5fa', transition: 'width 0.3s ease' }" />
              </div>
            </div>
            <div>
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">Utilizado: R$ 175.000</div>
            </div>
          </div>
        </div>

        <!-- Gerenciar Cotas de Bolsas -->
        <div class="w-full max-w-full" style="margin-top: 2rem">
          <h3
            :style="{
              color: 'var(--foreground)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--text-sm)',
              marginBottom: '1rem',
              wordBreak: 'break-word',
            }"
          >
            Gerenciar Cotas de Bolsas
          </h3>

          <!-- BolsaCard stubs -->
          <!-- TODO Fase 4: extrair BolsaCard como componente próprio -->
          <div class="grid grid-cols-1 gap-4 w-full max-w-full">
            <UCard
              v-for="bolsa in bolsasList"
              :key="bolsa.modalidade"
            >
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div class="flex flex-col">
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }">
                    {{ bolsa.modalidade }}
                  </div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }">
                    Valor: R$ {{ bolsa.valor.toLocaleString('pt-BR') }} · Disponíveis: {{ bolsa.cotasDisponiveis }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <UButton
                    icon="i-lucide-minus"
                    size="xs"
                    color="neutral"
                    variant="outline"
                    :disabled="bolsa.model.value <= 0"
                    @click="bolsa.model.value = Math.max(0, bolsa.model.value - 1)"
                  />
                  <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', minWidth: '32px', textAlign: 'center' }">
                    {{ bolsa.model.value }}
                  </span>
                  <UButton
                    icon="i-lucide-plus"
                    size="xs"
                    color="neutral"
                    variant="outline"
                    :disabled="bolsa.model.value >= bolsa.cotasDisponiveis"
                    @click="bolsa.model.value = Math.min(bolsa.cotasDisponiveis, bolsa.model.value + 1)"
                  />
                </div>
              </div>
            </UCard>
          </div>

          <div v-if="hasQuotasChanged" class="flex justify-end mt-6">
            <UButton icon="i-lucide-save" @click="handleSaveRemanejamento">
              Salvar Remanejamento
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
