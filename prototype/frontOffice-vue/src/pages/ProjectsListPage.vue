<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

type ProjectStatus = 'Aberto' | 'Fechado' | 'Em Análise'

interface Project {
  id: string
  editalNumber: string
  status: ProjectStatus
  title: string
  description: string
  deadline: string
  validityPeriod: string
  inscriptions: number
  category: string
}

interface Option {
  value: string
  label: string
}

const router = useRouter()

const mockProjects: Project[] = [
  {
    id: '1',
    editalNumber: 'Edital Fapes Nº 27/2025',
    status: 'Aberto',
    title: 'Apoio à Editoração e Publicação de Periódicos Científicos',
    description: 'Apoio financeiro para publicação de periódicos científicos de instituições do Espírito Santo.',
    deadline: '01/06/2026',
    validityPeriod: '01/06/2026 - 01/06/2027',
    inscriptions: 42,
    category: 'Periódicos Científicos',
  },
  {
    id: '2',
    editalNumber: 'Edital Fapes Nº 15/2025',
    status: 'Aberto',
    title: 'Bolsas de Iniciação Científica - IC',
    description: 'Programa de bolsas para estudantes de graduação desenvolverem pesquisas científicas.',
    deadline: '15/07/2026',
    validityPeriod: '15/07/2026 - 15/07/2027',
    inscriptions: 128,
    category: 'Iniciação Científica',
  },
  {
    id: '3',
    editalNumber: 'Edital Fapes Nº 08/2025',
    status: 'Em Análise',
    title: 'Apoio a Eventos Científicos',
    description: 'Financiamento para realização de congressos, seminários e workshops científicos no ES.',
    deadline: '30/04/2026',
    validityPeriod: '30/04/2026 - 30/04/2027',
    inscriptions: 67,
    category: 'Eventos',
  },
  {
    id: '4',
    editalNumber: 'Edital Fapes Nº 03/2025',
    status: 'Fechado',
    title: 'Infraestrutura para Pesquisa',
    description: 'Aquisição de equipamentos e modernização de laboratórios de pesquisa.',
    deadline: '01/03/2026',
    validityPeriod: '01/03/2026 - 01/03/2027',
    inscriptions: 89,
    category: 'Infraestrutura',
  },
]

const searchTerm = ref('')
const selectedStatus = ref<string>('')
const selectedType = ref<string>('')
const selectedArea = ref<string>('')
const selectedCoordinator = ref<string>('')

const statusOptions: Option[] = [
  { value: '', label: 'Todos' },
  { value: 'Aberto', label: 'Aberto' },
  { value: 'Em Análise', label: 'Em Análise' },
  { value: 'Fechado', label: 'Fechado' },
]

const typeOptions: Option[] = [
  { value: '', label: 'Todos' },
  { value: 'carreira-cientifica', label: 'Carreira Científica' },
  { value: 'pesquisa', label: 'Pesquisa' },
  { value: 'difusao-conhecimento', label: 'Difusão do Conhecimento' },
  { value: 'extensao', label: 'Extensão' },
  { value: 'inovacao', label: 'Inovação' },
  { value: 'chamadas-internacionais', label: 'Chamadas Internacionais' },
]

const areaOptions: Option[] = [
  { value: '', label: 'Todos' },
  { value: 'ciencias-exatas', label: 'Ciências Exatas e da Terra' },
  { value: 'ciencias-biologicas', label: 'Ciências Biológicas' },
  { value: 'engenharias', label: 'Engenharias' },
  { value: 'ciencias-saude', label: 'Ciências da Saúde' },
  { value: 'ciencias-agrarias', label: 'Ciências Agrárias' },
  { value: 'ciencias-sociais', label: 'Ciências Sociais Aplicadas' },
  { value: 'ciencias-humanas', label: 'Ciências Humanas' },
  { value: 'linguistica', label: 'Linguística, Letras e Artes' },
]

const coordinatorOptions: Option[] = [
  { value: '', label: 'Todos' },
  { value: 'ana-silva', label: 'Ana Silva' },
  { value: 'carlos-santos', label: 'Carlos Santos' },
  { value: 'fernanda-oliveira', label: 'Fernanda Oliveira' },
  { value: 'joao-pereira', label: 'João Pereira' },
  { value: 'maria-costa', label: 'Maria Costa' },
  { value: 'pedro-almeida', label: 'Pedro Almeida' },
  { value: 'renata-souza', label: 'Renata Souza' },
  { value: 'roberto-lima', label: 'Roberto Lima' },
]

function getStatusColor(status: ProjectStatus) {
  switch (status) {
    case 'Aberto':
      return {
        bg: 'rgba(16, 185, 129, 0.1)',
        color: 'rgb(16, 185, 129)',
        border: 'rgba(16, 185, 129, 0.3)',
      }
    case 'Fechado':
      return {
        bg: 'rgba(239, 68, 68, 0.1)',
        color: 'rgb(239, 68, 68)',
        border: 'rgba(239, 68, 68, 0.3)',
      }
    case 'Em Análise':
      return {
        bg: 'rgba(245, 158, 11, 0.1)',
        color: 'rgb(245, 158, 11)',
        border: 'rgba(245, 158, 11, 0.3)',
      }
    default:
      return {
        bg: 'rgba(107, 114, 128, 0.1)',
        color: 'rgb(107, 114, 128)',
        border: 'rgba(107, 114, 128, 0.3)',
      }
  }
}

const filteredProjects = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.editalNumber.toLowerCase().includes(term)
    const matchesStatus =
      !selectedStatus.value || selectedStatus.value === 'todos' || project.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

function handleProjectClick(project: Project) {
  if (project.status === 'Aberto') {
    router.push(`/projetos/${project.id}`)
  }
}
</script>

<template>
  <div
    :style="{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }"
    class="px-4 sm:px-6 md:px-8"
  >
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-start gap-3 mb-6">
        <button
          class="p-2 transition-colors"
          :style="{
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            flexShrink: 0,
          }"
          aria-label="Projetos"
        >
          <UIcon name="i-lucide-folder-kanban" class="size-5" />
        </button>
        <div :style="{ flex: 1 }">
          <h1 :style="{ color: 'var(--foreground)', margin: 0, marginBottom: '0.5rem' }">
            Projetos
          </h1>
          <p
            :style="{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              margin: 0,
            }"
          >
            Acompanhe os projetos da sua instituição e suas informações.
          </p>
        </div>
      </div>

      <div :style="{ height: '1px', backgroundColor: 'var(--border)', width: '100%' }" />
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <div
        class="grid gap-4"
        :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }"
      >
        <div>
          <label
            :style="{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
            }"
          >
            Pesquisar
          </label>
          <UInput
            v-model="searchTerm"
            placeholder="Digite aqui"
            icon="i-lucide-search"
            class="w-full"
          />
        </div>

        <div>
          <label
            :style="{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
            }"
          >
            Status
          </label>
          <USelectMenu
            v-model="selectedStatus"
            :items="statusOptions"
            value-key="value"
            label-key="label"
            placeholder="Selecione"
            class="w-full"
          />
        </div>

        <div>
          <label
            :style="{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
            }"
          >
            Tipo
          </label>
          <USelectMenu
            v-model="selectedType"
            :items="typeOptions"
            value-key="value"
            label-key="label"
            placeholder="Selecione"
            class="w-full"
          />
        </div>

        <div>
          <label
            :style="{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
            }"
          >
            Área
          </label>
          <USelectMenu
            v-model="selectedArea"
            :items="areaOptions"
            value-key="value"
            label-key="label"
            placeholder="Selecione"
            class="w-full"
          />
        </div>

        <div>
          <label
            :style="{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
            }"
          >
            Coordenador
          </label>
          <USelectMenu
            v-model="selectedCoordinator"
            :items="coordinatorOptions"
            value-key="value"
            label-key="label"
            placeholder="Selecione"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Projects List -->
    <div :style="{ display: 'grid', gap: '1.5rem' }">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        :style="{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          cursor: project.status === 'Aberto' ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          position: 'relative',
        }"
        @click="handleProjectClick(project)"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }"
        >
          <div :style="{ display: 'flex', alignItems: 'center', gap: '0.75rem' }">
            <span
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--primary)',
              }"
            >
              {{ project.editalNumber }}
            </span>

            <span
              :style="{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: getStatusColor(project.status).color,
                backgroundColor: getStatusColor(project.status).bg,
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                border: `1.5px solid ${getStatusColor(project.status).border}`,
              }"
            >
              {{ project.status }}
            </span>
          </div>

          <UIcon
            name="i-lucide-chevron-right"
            class="size-5"
            :style="{ color: 'var(--muted-foreground)' }"
          />
        </div>

        <h3 :style="{ color: 'var(--card-foreground)', margin: 0, marginBottom: '0.5rem' }">
          {{ project.title }}
        </h3>

        <p
          :style="{
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            lineHeight: '1.5',
            marginBottom: '1rem',
          }"
        >
          {{ project.description }}
        </p>

        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }"
        >
          <div :style="{ display: 'flex', alignItems: 'center', gap: '0.5rem' }">
            <UIcon
              name="i-lucide-calendar"
              class="size-4"
              :style="{ color: 'var(--muted-foreground)' }"
            />
            <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
              Período de Vigência: {{ project.validityPeriod }}
            </span>
          </div>

          <div :style="{ display: 'flex', alignItems: 'center', gap: '0.5rem' }">
            <UIcon
              name="i-lucide-users"
              class="size-4"
              :style="{ color: 'var(--muted-foreground)' }"
            />
            <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
              {{ project.inscriptions }} Bolsistas
            </span>
          </div>

          <span
            :style="{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--primary)',
              backgroundColor: 'rgba(8, 145, 178, 0.1)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--primary)',
            }"
          >
            {{ project.category }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
