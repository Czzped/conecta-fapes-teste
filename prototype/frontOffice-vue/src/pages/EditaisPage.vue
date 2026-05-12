<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { editais as editaisData, type Edital } from '@/data/editais'

const router = useRouter()

const selectedTipo = ref('Todos')
const selectedStatus = ref('Abertos')
const selectedDate = ref('')
const isDropdownOpen = ref(false)
const isStatusDropdownOpen = ref(false)
const searchQuery = ref('')

const tipoOptions = [
  'Todos',
  'Carreira Científica',
  'Pesquisa',
  'Difusão do Conhecimento',
  'Extensão',
  'Inovação',
  'Chamadas Internacionais',
]

const statusOptions = ['Abertos', 'Em Análise', 'Encerrados']

type StatusColor = { bg: string; color: string; border: string }

function getStatusColor(status: string): StatusColor {
  switch (status) {
    case 'Aberto':
    case 'Ativo':
      return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' }
    case 'Em análise':
    case 'Em Análise':
      return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' }
    case 'Encerrado':
    case 'Encerrados':
      return { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b', border: 'rgba(100, 116, 139, 0.3)' }
    default:
      return { bg: 'var(--muted)', color: 'var(--muted-foreground)', border: 'var(--border)' }
  }
}

function matchesStatus(edital: Edital): boolean {
  if (selectedStatus.value === 'Abertos') return edital.status === 'Ativo' || edital.status === 'Aberto'
  if (selectedStatus.value === 'Em Análise') return edital.status === 'Em análise' || edital.status === 'Em Análise'
  if (selectedStatus.value === 'Encerrados') return edital.status === 'Encerrado' || edital.status === 'Encerrados'
  return true
}

const filteredEditais = computed(() =>
  editaisData.filter((e) => {
    if (selectedTipo.value !== 'Todos' && e.area !== selectedTipo.value) return false
    if (!matchesStatus(e)) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const hay = `${e.titulo} ${e.numero ?? ''} ${e.descricao} ${e.programa} ${e.area}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
)

function openEdital(id: number) {
  router.push(`/editais/${id}`)
}

function selectTipo(t: string) {
  selectedTipo.value = t
  isDropdownOpen.value = false
}

function selectStatus(s: string) {
  selectedStatus.value = s
  isStatusDropdownOpen.value = false
}
</script>

<template>
  <div class="w-full px-4 md:px-8 py-8">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div
              :style="{
                padding: '0.5rem',
                backgroundColor: 'var(--primary)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
            >
              <UIcon name="i-lucide-file-text" :style="{ color: 'var(--background)', width: '20px', height: '20px' }" />
            </div>
            <h1 :style="{ color: 'var(--foreground)', margin: 0 }">Editais</h1>
          </div>
          <p
            :style="{
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              margin: 0,
              marginLeft: '48px',
            }"
          >
            Acompanhe as chamadas e se inscreva.
          </p>
        </div>

        <UButton color="primary" size="md">Demanda Induzida</UButton>
      </div>
    </div>

    <!-- Divider -->
    <div :style="{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '2rem' }" />

    <!-- Filters -->
    <div class="flex flex-col md:flex-row md:items-end gap-4 mb-6">
      <!-- Search -->
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          placeholder="Buscar editais..."
          icon="i-lucide-search"
          size="lg"
          class="w-full"
        />
      </div>

      <!-- Status -->
      <div class="relative" :style="{ minWidth: '200px' }">
        <label
          :style="{
            display: 'block',
            color: 'var(--foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            marginBottom: '0.5rem',
          }"
        >Status</label>
        <button
          type="button"
          class="w-full px-4 py-2 flex items-center justify-between"
          :style="{
            backgroundColor: 'var(--input-background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            textAlign: 'left',
          }"
          @click="isStatusDropdownOpen = !isStatusDropdownOpen"
        >
          <span>{{ selectedStatus }}</span>
          <UIcon name="i-lucide-chevron-down" :style="{ width: '16px', height: '16px', flexShrink: 0 }" />
        </button>
        <div
          v-if="isStatusDropdownOpen"
          class="absolute top-full left-0 right-0 mt-1 overflow-hidden"
          :style="{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            zIndex: 50,
          }"
        >
          <button
            v-for="status in statusOptions"
            :key="status"
            type="button"
            class="w-full px-4 py-2 text-left"
            :style="{
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              backgroundColor: selectedStatus === status
                ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                : 'transparent',
              border: 'none',
            }"
            @click="selectStatus(status)"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <!-- Tipo -->
      <div class="relative" :style="{ minWidth: '200px' }">
        <label
          :style="{
            display: 'block',
            color: 'var(--foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            marginBottom: '0.5rem',
          }"
        >Tipo</label>
        <button
          type="button"
          class="w-full px-4 py-2 flex items-center justify-between"
          :style="{
            backgroundColor: 'var(--input-background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            textAlign: 'left',
          }"
          @click="isDropdownOpen = !isDropdownOpen"
        >
          <span>{{ selectedTipo }}</span>
          <UIcon name="i-lucide-chevron-down" :style="{ width: '16px', height: '16px', flexShrink: 0 }" />
        </button>
        <div
          v-if="isDropdownOpen"
          class="absolute top-full left-0 right-0 mt-1 overflow-hidden"
          :style="{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            zIndex: 50,
          }"
        >
          <button
            v-for="tipo in tipoOptions"
            :key="tipo"
            type="button"
            class="w-full px-4 py-2 text-left"
            :style="{
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              backgroundColor: selectedTipo === tipo
                ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                : 'transparent',
              border: 'none',
            }"
            @click="selectTipo(tipo)"
          >
            {{ tipo }}
          </button>
        </div>
      </div>

      <!-- Data (DatePicker deferred -> placeholder UInput type=date) -->
      <div class="relative" :style="{ minWidth: '200px' }">
        <label
          :style="{
            display: 'block',
            color: 'var(--foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            marginBottom: '0.5rem',
          }"
        >Data</label>
        <UInput v-model="selectedDate" type="date" size="lg" class="w-full" />
      </div>
    </div>

    <!-- Editais List -->
    <div class="space-y-4">
      <a
        v-for="edital in filteredEditais"
        :key="edital.id"
        href="#"
        class="group block"
        :style="{ textDecoration: 'none' }"
        @click.prevent="openEdital(edital.id)"
      >
        <div
          class="p-5 transition-all"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
          }"
        >
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-3 mb-3">
                <span
                  :style="{
                    color: 'var(--primary)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }"
                >{{ edital.numero ?? `Edital #${edital.id}` }}</span>
                <span
                  class="inline-flex items-center px-2.5 py-1"
                  :style="{
                    backgroundColor: getStatusColor(edital.status).bg,
                    color: getStatusColor(edital.status).color,
                    border: `1px solid ${getStatusColor(edital.status).border}`,
                    borderRadius: '9999px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                  }"
                >{{ edital.status }}</span>
              </div>

              <h2 :style="{ color: 'var(--foreground)', marginBottom: '0.5rem' }">
                {{ edital.titulo }}
              </h2>

              <p
                :style="{
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  marginBottom: '1rem',
                }"
              >{{ edital.descricao }}</p>

              <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-calendar" :style="{ color: 'var(--muted-foreground)', width: '14px', height: '14px' }" />
                  <span
                    :style="{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                    }"
                  >Inscrições até {{ edital.prazo }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-users" :style="{ color: 'var(--muted-foreground)', width: '14px', height: '14px' }" />
                  <span
                    :style="{
                      color: 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                    }"
                  >{{ edital.vagas }} vagas</span>
                </div>
                <span
                  class="inline-flex items-center px-2.5 py-1"
                  :style="{
                    backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                  }"
                >{{ edital.area }}</span>
              </div>
            </div>

            <div
              class="transition-transform self-end md:self-auto"
              :style="{ color: 'var(--primary)', flexShrink: 0 }"
            >
              <UIcon name="i-lucide-chevron-right" :style="{ width: '20px', height: '20px' }" />
            </div>
          </div>
        </div>
      </a>
    </div>

    <!-- Empty -->
    <div
      v-if="filteredEditais.length === 0"
      class="flex flex-col items-center justify-center py-16"
      :style="{
        backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
        border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
        borderRadius: 'var(--radius)',
      }"
    >
      <UIcon name="i-lucide-file-text" :style="{ color: 'var(--muted-foreground)', width: '48px', height: '48px', marginBottom: '1rem' }" />
      <p
        :style="{
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-base)',
          textAlign: 'center',
        }"
      >Nenhum edital encontrado</p>
    </div>
  </div>
</template>
