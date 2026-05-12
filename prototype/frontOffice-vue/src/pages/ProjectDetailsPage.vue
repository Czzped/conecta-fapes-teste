<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const projectId = String(route.params.id ?? '')
const projectName = ref<string>(t('projectDetails.defaultName', 'Projeto Selecionado'))

const activeTab = ref<'projeto' | 'informacoes' | 'bolsistas' | 'aditivos'>('projeto')

const tabs = [
  { id: 'projeto', label: t('projectDetails.tabs.projeto', 'Projeto') },
  { id: 'informacoes', label: t('projectDetails.tabs.informacoes', 'Informações das Bolsas') },
  { id: 'bolsistas', label: t('projectDetails.tabs.bolsistas', 'Bolsistas do Projeto') },
  { id: 'aditivos', label: t('projectDetails.tabs.aditivos', 'Aditivos') },
] as const

interface Aditivo {
  id: string
  tipo: string
  situacao: string
  data: string
  dataFimAnterior: string
  dataFimAditada: string
  valor: string
  documento: string
  observacao: string
}

const aditivos: Aditivo[] = [
  {
    id: 'TA-2026-014',
    tipo: 'Tempo e financeiro',
    situacao: 'Aprovado',
    data: '15/02/2026',
    dataFimAnterior: '28/02/2026',
    dataFimAditada: '31/08/2026',
    valor: 'R$ 250.000,00',
    documento: 'Termo Aditivo 014/2026',
    observacao: 'Prorrogação de vigência e suplementação para continuidade das entregas previstas.',
  },
  {
    id: 'TA-2025-009',
    tipo: 'Financeiro',
    situacao: 'Aprovado',
    data: '10/09/2025',
    dataFimAnterior: '-',
    dataFimAditada: '-',
    valor: 'R$ 80.000,00',
    documento: 'Termo Aditivo 009/2025',
    observacao: 'Acréscimo financeiro para ampliação de rubricas de execução do projeto.',
  },
]

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/projetos-lista')
}
</script>

<template>
  <div
    class="px-4 sm:px-6 md:px-8"
    :style="{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }"
  >
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-start gap-3 mb-4">
        <button
          class="p-2 transition-colors flex items-center justify-center"
          :style="{
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            flexShrink: 0,
          }"
          :aria-label="t('projectDetails.header.title', 'Detalhes do Projeto')"
          @click="goBack"
        >
          <UIcon name="i-lucide-file-text" class="w-5 h-5" />
        </button>
        <div :style="{ flex: 1 }">
          <h1 :style="{ color: 'var(--foreground)', margin: 0, marginBottom: '0.5rem' }">
            {{ t('projectDetails.header.title', 'Detalhes do Projeto') }}
          </h1>
          <p
            :style="{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              margin: 0,
            }"
          >
            {{ t('projectDetails.header.subtitle', 'Informações do projeto') }}
            <span v-if="projectId"> — #{{ projectId }}</span>
            <span v-if="projectName"> · {{ projectName }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="mb-6">
      <div
        class="flex flex-col sm:flex-row gap-0 sm:gap-6"
        :style="{ borderBottom: '1px solid var(--border)', marginBottom: '1rem' }"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :style="{
            background: 'none',
            border: 'none',
            padding: '0.75rem 0',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-medium)',
            color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'color 0.2s ease',
            fontFamily: 'var(--font-family)',
            textAlign: 'left',
          }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <div
            v-if="activeTab === tab.id"
            :style="{
              position: 'absolute',
              bottom: '-1px',
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: 'var(--primary)',
            }"
          />
        </button>
      </div>

      <!-- Projeto -->
      <div v-if="activeTab === 'projeto'">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-folder-kanban" class="w-5 h-5" :style="{ color: 'var(--primary)' }" />
              <h2 class="font-semibold">
                {{ t('projectDetails.projeto.title', 'Dados do Projeto') }}
              </h2>
            </div>
          </template>
          <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">
            {{ t('projectDetails.projeto.placeholder', 'Conteúdo da aba Projeto. Reaproveita MyProjectsPage (coordenador) no React; aqui deixamos placeholder até porta.') }}
          </p>
        </UCard>
      </div>

      <!-- Informações das Bolsas -->
      <div v-else-if="activeTab === 'informacoes'">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-wallet" class="w-5 h-5" :style="{ color: 'var(--primary)' }" />
              <h2 class="font-semibold">
                {{ t('projectDetails.informacoes.title', 'Informações das Bolsas') }}
              </h2>
            </div>
          </template>
          <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">
            {{ t('projectDetails.informacoes.placeholder', 'Reaproveita MyTeamPage (defaultTab=informacoes) no React; placeholder até porta.') }}
          </p>
        </UCard>
      </div>

      <!-- Bolsistas -->
      <div v-else-if="activeTab === 'bolsistas'">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-users" class="w-5 h-5" :style="{ color: 'var(--primary)' }" />
              <h2 class="font-semibold">
                {{ t('projectDetails.bolsistas.title', 'Bolsistas do Projeto') }}
              </h2>
            </div>
          </template>
          <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">
            {{ t('projectDetails.bolsistas.placeholder', 'Reaproveita MyTeamPage (defaultTab=bolsistas) no React; placeholder até porta.') }}
          </p>
        </UCard>
      </div>

      <!-- Aditivos -->
      <div v-else-if="activeTab === 'aditivos'" class="space-y-4">
        <div class="flex items-center gap-3">
          <div
            class="p-2 flex items-center justify-center"
            :style="{
              color: 'var(--primary)',
              backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRadius: 'var(--radius)',
            }"
          >
            <UIcon name="i-lucide-file-text" class="w-5 h-5" />
          </div>
          <div>
            <h2
              :style="{
                color: 'var(--foreground)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: 0,
              }"
            >
              {{ t('projectDetails.aditivos.title', 'Dados dos aditivos') }}
            </h2>
            <p
              :style="{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                margin: '0.25rem 0 0',
              }"
            >
              {{ t('projectDetails.aditivos.subtitle', 'Acompanhe os termos aditivos vinculados ao projeto.') }}
            </p>
          </div>
        </div>

        <div v-if="aditivos.length > 0" class="space-y-3">
          <div
            v-for="aditivo in aditivos"
            :key="aditivo.id"
            class="p-4"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
              borderRadius: 'var(--radius)',
            }"
          >
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <strong :style="{ color: 'var(--foreground)', fontSize: 'var(--text-base)' }">
                    {{ aditivo.id }}
                  </strong>
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-1"
                    :style="{
                      color: 'var(--primary)',
                      backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--primary) 24%, transparent)',
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }"
                  >
                    <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5" />
                    {{ aditivo.situacao }}
                  </span>
                </div>
                <p
                  :style="{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.6',
                    margin: 0,
                  }"
                >
                  {{ aditivo.observacao }}
                </p>
              </div>

              <div
                class="px-3 py-2"
                :style="{
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  whiteSpace: 'nowrap',
                }"
              >
                {{ aditivo.documento }}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-file-text"
                  class="w-4 h-4"
                  :style="{ color: 'var(--primary)', marginTop: '2px' }"
                />
                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }">
                    {{ t('projectDetails.aditivos.tipo', 'Tipo') }}
                  </div>
                  <div
                    :style="{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }"
                  >
                    {{ aditivo.tipo }}
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-calendar-days"
                  class="w-4 h-4"
                  :style="{ color: 'var(--primary)', marginTop: '2px' }"
                />
                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }">
                    {{ t('projectDetails.aditivos.formalizacao', 'Formalização') }}
                  </div>
                  <div
                    :style="{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }"
                  >
                    {{ aditivo.data }}
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-clock"
                  class="w-4 h-4"
                  :style="{ color: 'var(--primary)', marginTop: '2px' }"
                />
                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }">
                    {{ t('projectDetails.aditivos.prazo', 'Prazo') }}
                  </div>
                  <div
                    :style="{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }"
                  >
                    <template v-if="aditivo.dataFimAditada !== '-'">
                      {{ aditivo.dataFimAnterior }} -&gt; {{ aditivo.dataFimAditada }}
                    </template>
                    <template v-else>
                      {{ t('projectDetails.aditivos.semAlteracao', 'Sem alteração') }}
                    </template>
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-wallet"
                  class="w-4 h-4"
                  :style="{ color: 'var(--primary)', marginTop: '2px' }"
                />
                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }">
                    {{ t('projectDetails.aditivos.valor', 'Valor aditivado') }}
                  </div>
                  <div
                    :style="{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }"
                  >
                    {{ aditivo.valor }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="p-6 text-center"
          :style="{
            color: 'var(--muted-foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--card)',
          }"
        >
          {{ t('projectDetails.aditivos.empty', 'Este projeto não possui aditivos registrados.') }}
        </div>
      </div>
    </div>
  </div>
</template>
