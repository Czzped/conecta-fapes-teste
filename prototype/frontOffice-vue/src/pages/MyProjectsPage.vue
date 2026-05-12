<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  hideHeader?: boolean
}
const props = withDefaults(defineProps<Props>(), { hideHeader: false })

const auth = useAuthStore()
const accessType = computed(() => auth.accessType ?? 'bolsista')

const isWorkPlanExpanded = ref(false)

interface Stage {
  id: number
  label: string
  phase: string
  source: string
  date: string
  icon: string
  status: 'completed' | 'current' | 'pending'
}

const projectStages: Stage[] = [
  { id: 1, label: 'Submissão', phase: 'Pre-award', source: 'M011', date: '15/01/2024', icon: 'i-lucide-send', status: 'completed' },
  { id: 2, label: 'Avaliação de Documentos', phase: 'Pre-award', source: 'M011', date: '20/01/2024', icon: 'i-lucide-file-text', status: 'completed' },
  { id: 3, label: 'Avaliação Ad Hoc', phase: 'Pre-award', source: 'M011', date: '05/02/2024', icon: 'i-lucide-user-check', status: 'completed' },
  { id: 4, label: 'Em Contratação', phase: 'Award', source: 'M022', date: '20/02/2024', icon: 'i-lucide-file-edit', status: 'completed' },
  { id: 5, label: 'Contratado', phase: 'Award', source: 'M003', date: '01/03/2024', icon: 'i-lucide-check-circle', status: 'completed' },
  { id: 6, label: 'Em Execução', phase: 'Post-award', source: 'M003', date: '16/03/2024', icon: 'i-lucide-play-circle', status: 'current' },
  { id: 7, label: 'Suspensa', phase: 'Post-award', source: 'M015', date: '', icon: 'i-lucide-pause-circle', status: 'pending' },
  { id: 8, label: 'Em Aprovação de Contas', phase: 'Post-award', source: 'M014', date: '', icon: 'i-lucide-dollar-sign', status: 'pending' },
  { id: 9, label: 'Concluído', phase: 'Post-award', source: 'M015', date: '', icon: 'i-lucide-award', status: 'pending' },
  { id: 10, label: 'Cancelada', phase: 'Post-award', source: 'M015', date: '', icon: 'i-lucide-x-circle', status: 'pending' },
]

const projectData = computed(() => {
  const isScholar = accessType.value === 'voluntario' || accessType.value === 'bolsista'
  return [
    { label: isScholar ? 'Modalidade da Bolsa' : 'Nível', value: isScholar ? 'BPIG-VIII' : 'V - Atualizada', badge: false },
    { label: 'Valor', value: 'R$ 700,00', badge: false },
    { label: 'Período de Vigência', value: '01/06/2025 - 01/06/2026', badge: false },
    { label: 'Status da Bolsa', value: 'Ativa', badge: true },
  ]
})

const projectTermData = {
  dataInicio: '01/03/2024',
  dataFimVigente: '31/08/2026',
}

interface BudgetCategory {
  name: string
  total: string
  consumido: string
  alocado: string | null
  disponivel: string
  consumidoPercent: number
  alocadoPercent: number
  icon: string
}

const budgetCategories: BudgetCategory[] = [
  { name: 'Bolsa', total: 'R$ 4.738.032,00', consumido: 'R$ 2.100.000,00', alocado: 'R$ 1.122.000,00', disponivel: 'R$ 1.516.032,00', consumidoPercent: 44, alocadoPercent: 24, icon: 'i-lucide-graduation-cap' },
  { name: 'Diárias', total: 'R$ 60.000,00', consumido: 'R$ 22.432,00', alocado: 'R$ 12.080,00', disponivel: 'R$ 25.488,00', consumidoPercent: 37, alocadoPercent: 20, icon: 'i-lucide-hotel' },
  { name: 'Material Permanente', total: 'R$ 500.000,00', consumido: 'R$ 180.000,00', alocado: null, disponivel: 'R$ 267.575,00', consumidoPercent: 46, alocadoPercent: 0, icon: 'i-lucide-package' },
  { name: 'Material de Consumo', total: 'R$ 260.000,00', consumido: 'R$ 150.992,80', alocado: null, disponivel: 'R$ 73.007,20', consumidoPercent: 72, alocadoPercent: 0, icon: 'i-lucide-box' },
  { name: 'Passagens', total: 'R$ 85.000,00', consumido: 'R$ 28.616,00', alocado: null, disponivel: 'R$ 45.384,00', consumidoPercent: 47, alocadoPercent: 0, icon: 'i-lucide-plane' },
  { name: 'Pessoa Jurídica', total: 'R$ 1.650.000,00', consumido: 'R$ 1.137.502,00', alocado: null, disponivel: 'R$ 312.498,00', consumidoPercent: 81, alocadoPercent: 0, icon: 'i-lucide-building-2' },
]

function metricsFor(c: BudgetCategory) {
  const arr: { label: string; value: string; percent: number; color: string }[] = [
    { label: 'Total', value: c.total, percent: 100, color: 'var(--muted-foreground)' },
    { label: 'Consumido', value: c.consumido, percent: c.consumidoPercent, color: 'var(--foreground)' },
  ]
  if (c.alocado) arr.push({ label: 'Alocado', value: c.alocado, percent: c.alocadoPercent, color: '#60a5fa' })
  arr.push({ label: 'Disponível', value: c.disponivel, percent: 100 - c.consumidoPercent - c.alocadoPercent, color: 'var(--primary)' })
  return arr
}

const activities = [
  { id: 'A.1', title: 'Apoio na elicitação de requisitos com stakeholders', description: 'Dar suporte na preparação, condução e registro de reuniões com stakeholders, utilizando técnicas como entrevistas, brainstorming, observação direta e workshops, com foco na identificação precisa das necessidades de negócio da plataforma Conecta FAPES.' },
  { id: 'A.2', title: 'Colaboração na modelagem de requisitos', description: 'Auxiliar na elaboração de artefatos de análise, como diagramas de casos de uso, diagramas de classe, fluxogramas, mapas de processo (BPMN) e protótipos de tela, apoiando o entendimento sistêmico e a comunicação entre as partes envolvidas no projeto.' },
  { id: 'A.3', title: 'Suporte na documentação técnica e funcional', description: 'Acompanhar a redação e manutenção da documentação de requisitos funcionais e não funcionais, especificações de regras de negócio, critérios de aceitação e glossários, assegurando padronização e versionamento adequado.' },
  { id: 'A.4', title: 'Apoio na validação de requisitos com usuários', description: 'Auxiliar a organização e execução de atividades de validação de requisitos com os usuários finais e stakeholders, por meio de apresentações, testes de protótipos e ciclos de feedback, garantindo o alinhamento entre as expectativas e a solução a ser desenvolvida.' },
  { id: 'A.5', title: 'Participação em reuniões de planejamento e acompanhamento', description: 'Participar de reuniões de planejamento de sprints, cerimônias ágeis (daily standups, planning, review e retrospective) e demais eventos de acompanhamento do projeto, contribuindo ativamente com a visão da Engenharia de Requisitos e apoiando a tomada de decisões.' },
  { id: 'A.6', title: 'Assistência na gestão de mudanças de requisitos', description: 'Auxiliar no registro, análise e controle de mudanças de requisitos, avaliando impactos, priorizações e riscos associados, de modo a apoiar a rastreabilidade e o controle de alterações durante o ciclo de vida do sistema.' },
]

const currentStageIndex = computed(() => projectStages.findIndex(s => s.status === 'current'))

const progressLineStyle = computed(() => ({
  backgroundColor: 'var(--primary)',
  left: `calc(100% / ${projectStages.length * 2})`,
  width: `calc(${((currentStageIndex.value + 1) / projectStages.length) * 100}% - (100% / ${projectStages.length}))`,
}))

const verticalActiveLineStyle = computed(() => ({
  backgroundColor: 'var(--primary)',
  height: `calc(${((currentStageIndex.value + 1) / projectStages.length) * 100}% - 24px)`,
}))

const keywords = ['Plataforma', 'Apoio a FAPES', 'Inovação', 'Pesquisa']
</script>

<template>
  <div :class="`w-full ${!props.hideHeader ? 'px-4 md:px-8 py-8' : ''}`">
    <!-- Header -->
    <template v-if="!props.hideHeader">
      <div class="flex items-center gap-3 mb-2">
        <div
          class="p-2 transition-colors"
          :style="{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }"
        >
          <UIcon name="i-lucide-folder-kanban" class="size-5" />
        </div>
        <h1 :style="{ color: 'var(--foreground)', margin: 0 }">Meu Projeto</h1>
      </div>
      <p
        :style="{
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          marginLeft: 'calc(32px + 0.75rem)',
          marginBottom: '1.5rem',
        }"
      >
        Informações do projeto que você participa.
      </p>
      <div :style="{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '2rem' }" />
    </template>

    <!-- Estágio do Projeto - Coordenador -->
    <div v-if="accessType === 'coordenador'" class="mb-12">
      <div
        class="p-6"
        :style="{
          backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
          borderTop: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
          borderRight: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
          borderBottom: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
          borderLeft: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
          borderRadius: 'var(--radius)',
        }"
      >
        <!-- Desktop -->
        <div class="hidden md:block">
          <div class="relative">
            <div
              class="absolute top-6 h-0.5"
              :style="{
                backgroundColor: 'var(--border)',
                left: `calc(100% / ${projectStages.length * 2})`,
                right: `calc(100% / ${projectStages.length * 2})`,
              }"
            />
            <div class="absolute top-6 h-0.5 transition-all duration-500" :style="progressLineStyle" />
            <div class="relative flex justify-between">
              <div
                v-for="stage in projectStages"
                :key="stage.id"
                class="flex flex-col items-center"
                :style="{ flex: 1 }"
              >
                <div
                  class="relative z-10 flex items-center justify-center transition-all duration-300"
                  :style="{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: stage.status === 'completed' || stage.status === 'current' ? 'var(--primary)' : 'var(--muted)',
                    border: stage.status === 'current' ? '3px solid var(--primary)' : 'none',
                    boxShadow: stage.status === 'current' ? '0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent)' : 'none',
                  }"
                >
                  <UIcon
                    :name="stage.icon"
                    class="size-5"
                    :style="{ color: stage.status === 'completed' || stage.status === 'current' ? 'var(--background)' : 'var(--muted-foreground)' }"
                  />
                </div>
                <p
                  class="mt-3 text-center"
                  :style="{
                    color: stage.status === 'completed' || stage.status === 'current' ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: stage.status === 'current' ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    maxWidth: '100px',
                    lineHeight: '1.3',
                  }"
                >
                  {{ stage.label }}
                </p>
                <p
                  v-if="stage.date"
                  class="mt-1"
                  :style="{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-normal)',
                  }"
                >
                  {{ stage.date }}
                </p>
                <p
                  class="mt-1 text-center"
                  :style="{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-normal)',
                    maxWidth: '96px',
                    lineHeight: '1.3',
                  }"
                >
                  {{ stage.phase }} · {{ stage.source }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile -->
        <div class="md:hidden">
          <div class="relative pl-20">
            <div class="absolute left-6 top-0 bottom-0 w-0.5" :style="{ backgroundColor: 'var(--border)' }" />
            <div class="absolute left-6 top-0 w-0.5 transition-all duration-500" :style="verticalActiveLineStyle" />
            <div class="space-y-8">
              <div v-for="stage in projectStages" :key="stage.id" class="relative flex items-start gap-4">
                <div
                  class="absolute -left-20 flex items-center justify-center transition-all duration-300"
                  :style="{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: stage.status === 'completed' || stage.status === 'current' ? 'var(--primary)' : 'var(--muted)',
                    border: stage.status === 'current' ? '3px solid var(--primary)' : 'none',
                    boxShadow: stage.status === 'current' ? '0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent)' : 'none',
                  }"
                >
                  <UIcon
                    :name="stage.icon"
                    class="size-5"
                    :style="{ color: stage.status === 'completed' || stage.status === 'current' ? 'var(--background)' : 'var(--muted-foreground)' }"
                  />
                </div>
                <div class="flex-1 pt-2">
                  <p
                    :style="{
                      color: stage.status === 'completed' || stage.status === 'current' ? 'var(--foreground)' : 'var(--muted-foreground)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: stage.status === 'current' ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      marginBottom: '4px',
                    }"
                  >
                    {{ stage.label }}
                  </p>
                  <p
                    v-if="stage.date"
                    :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)' }"
                  >
                    {{ stage.date }}
                  </p>
                  <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)' }">
                    {{ stage.phase }} · {{ stage.source }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget - Coordenador -->
    <div v-if="accessType === 'coordenador'" class="mb-12" :style="{ marginTop: '-1.5rem' }">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Total -->
        <div
          class="p-6"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
            borderTop: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderRight: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderLeft: '4px solid var(--primary)',
            borderRadius: 'var(--radius)',
          }"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="p-2"
              :style="{
                color: 'var(--primary)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
              }"
            >
              <UIcon name="i-lucide-wallet" class="size-5" />
            </div>
            <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">
              Valor Total do Projeto
            </div>
          </div>
          <div :style="{ color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: 'var(--font-weight-semibold)', marginBottom: '12px' }">
            R$ 7.350.780,00
          </div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', fontSize: 'var(--text-sm)' }">
            <div>
              <span :style="{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)' }">Utilizado: </span>
              <span :style="{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }">R$ 7.350.780,00</span>
            </div>
            <div>
              <span :style="{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)' }">Disponível: </span>
              <span :style="{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }">R$ 2.572.773,00</span>
            </div>
          </div>
        </div>

        <!-- Data Início -->
        <div
          class="p-6"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
            borderTop: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderRight: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderLeft: '4px solid var(--primary)',
            borderRadius: 'var(--radius)',
          }"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="p-2"
              :style="{
                color: 'var(--primary)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
              }"
            >
              <UIcon name="i-lucide-calendar-days" class="size-5" />
            </div>
            <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">
              Data de Inicio
            </div>
          </div>
          <div :style="{ color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: 'var(--font-weight-semibold)' }">
            {{ projectTermData.dataInicio }}
          </div>
        </div>

        <!-- Data Fim -->
        <div
          class="p-6"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
            borderTop: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderRight: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderLeft: '4px solid var(--primary)',
            borderRadius: 'var(--radius)',
          }"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="p-2"
              :style="{
                color: 'var(--primary)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
              }"
            >
              <UIcon name="i-lucide-clock" class="size-5" />
            </div>
            <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">
              Data de Fim
            </div>
          </div>
          <div :style="{ color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: 'var(--font-weight-semibold)' }">
            {{ projectTermData.dataFimVigente }}
          </div>
        </div>
      </div>

      <!-- Budget Categories -->
      <div class="space-y-4">
        <article
          v-for="cat in budgetCategories"
          :key="cat.name"
          class="rounded-lg p-4"
          :style="{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }"
        >
          <div class="grid grid-cols-1 2xl:grid-cols-[260px_minmax(0,1fr)] gap-5" :style="{ alignItems: 'start' }">
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center rounded-lg"
                :style="{
                  width: '40px',
                  height: '40px',
                  color: 'var(--primary)',
                  backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                }"
              >
                <UIcon :name="cat.icon" class="size-[18px]" />
              </div>
              <div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }">
                  {{ cat.name }}
                </div>
                <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)' }">
                  {{ cat.alocado ? 'Possui valor alocado' : 'Sem alocação operacional' }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3" :style="{ minWidth: 0 }">
              <div
                v-for="metric in metricsFor(cat)"
                :key="metric.label"
                class="rounded-lg px-3 py-2"
                :style="{ border: '1px solid var(--border)', backgroundColor: 'var(--muted)', minWidth: 0 }"
              >
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-normal)', marginBottom: '4px' }">
                  {{ metric.label }}
                </div>
                <div
                  :style="{
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    lineHeight: 1.35,
                  }"
                >
                  <span>{{ metric.value }}</span>
                  <span :style="{ color: 'var(--muted-foreground)', margin: '0 6px' }">·</span>
                  <span>{{ metric.percent }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div
            :style="{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--muted)',
              borderRadius: '999px',
              overflow: 'hidden',
              display: 'flex',
              marginTop: '14px',
            }"
          >
            <div
              :style="{
                width: `${cat.consumidoPercent}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease',
              }"
            />
            <div
              v-if="cat.alocado"
              :style="{
                width: `${cat.alocadoPercent}%`,
                height: '100%',
                backgroundColor: 'color-mix(in srgb, var(--primary) 45%, transparent)',
                transition: 'width 0.3s ease',
              }"
            />
          </div>
        </article>
      </div>
    </div>

    <section>
      <!-- Objetivo do Projeto -->
      <div v-if="accessType !== 'coordenador'" class="mb-8">
        <label
          class="block mb-2"
          :style="{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-sm)' }"
        >
          Objetivo do Projeto
        </label>
        <p
          :style="{
            color: 'var(--foreground)',
            fontWeight: 'var(--font-weight-normal)',
            fontSize: 'var(--text-sm)',
            lineHeight: '1.7',
          }"
        >
          O projeto "ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação" é fruto de uma parceria entre a Fundação de Amparo à Pesquisa e Inovação do Espírito Santo (FAPES) e o Laboratório de Extensão em Desenvolvimento de Soluções (LEDS) do Instituto Federal de Educação, Ciência e Tecnologia do Espírito Santo (IFES). O projeto tem como objetivo a realização de pesquisas e o desenvolvimento de uma plataforma que permita: (i) gerenciar os processos operacionais de apoio à Pesquisa, Desenvolvimento e Inovação da FAPES, (ii) promover a integração com as diversas entidades externas à FAPES e (iii) compartilhar informações de Pesquisa, Desenvolvimento, Inovação e Extensão com pesquisadores, instituições e a sociedade em geral, visando ampliar as possibilidades de desenvolvimento nos âmbitos de atuação dos entes envolvidos e fomentar possibilidades de atuação conjunta pela via do estreitamento de relações de interesse mútuo.
        </p>
      </div>

      <!-- Project Info Grid -->
      <div v-if="accessType !== 'coordenador'" class="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
        <div v-for="(item, index) in projectData" :key="index">
          <label
            class="block mb-2"
            :style="{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-sm)' }"
          >
            {{ item.label }}
          </label>
          <div :style="{ minHeight: '32px', display: 'flex', alignItems: 'center' }">
            <span
              v-if="item.badge"
              class="inline-flex items-center px-3 py-1"
              :style="{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                borderTop: '1px solid rgba(34, 197, 94, 0.3)',
                borderRight: '1px solid rgba(34, 197, 94, 0.3)',
                borderBottom: '1px solid rgba(34, 197, 94, 0.3)',
                borderLeft: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '9999px',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }"
            >
              {{ item.value }}
            </span>
            <p
              v-else
              :style="{
                color: 'var(--foreground)',
                fontWeight: 'var(--font-weight-normal)',
                fontSize: 'var(--text-sm)',
                margin: 0,
              }"
            >
              {{ item.value }}
            </p>
          </div>
        </div>
      </div>

      <!-- Work Plan Collapsible -->
      <div class="mt-8">
        <button
          class="w-full flex items-center justify-between py-3 px-4 transition-colors"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
            borderRadius: 'var(--radius)',
            borderTop: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderRight: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            borderLeft: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
          }"
          @click="isWorkPlanExpanded = !isWorkPlanExpanded"
        >
          <label
            class="cursor-pointer"
            :style="{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-sm)' }"
          >
            Plano de Trabalho
          </label>
          <UIcon
            name="i-lucide-chevron-down"
            class="size-5"
            :style="{
              color: 'var(--primary)',
              transform: isWorkPlanExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }"
          />
        </button>

        <div v-if="isWorkPlanExpanded" class="mt-6 space-y-6">
          <!-- Palavras-chave -->
          <div
            class="p-5"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderLeft: '3px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }"
          >
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-tag" class="size-[18px]" :style="{ color: 'var(--primary)' }" />
              <h3
                :style="{
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--text-sm)',
                  margin: 0,
                }"
              >
                PALAVRAS-CHAVE DO PROJETO
              </h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(kw, i) in keywords"
                :key="i"
                class="inline-flex items-center px-3 py-1"
                :style="{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                  color: 'var(--primary)',
                  borderTop: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                  borderRight: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                  borderBottom: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                  borderLeft: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                  borderRadius: '9999px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }"
              >
                {{ kw }}
              </span>
            </div>
          </div>

          <!-- Resumo Plano Atividades -->
          <div
            class="p-5"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderLeft: '3px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }"
          >
            <div class="flex items-center gap-2 mb-5">
              <UIcon name="i-lucide-list-checks" class="size-[18px]" :style="{ color: 'var(--primary)' }" />
              <h3
                :style="{
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--text-sm)',
                  margin: 0,
                }"
              >
                RESUMO DO PLANO DE ATIVIDADES
              </h3>
            </div>

            <div class="space-y-5">
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="p-4"
                :style="{
                  backgroundColor: 'var(--background)',
                  borderRadius: 'var(--radius)',
                  borderTop: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                  borderRight: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                  borderBottom: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                  borderLeft: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                }"
              >
                <h4
                  class="mb-2 flex items-start gap-2"
                  :style="{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-sm)' }"
                >
                  <span
                    class="inline-flex items-center justify-center flex-shrink-0"
                    :style="{
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                      borderRadius: '50%',
                      fontSize: '11px',
                      fontWeight: 'var(--font-weight-bold)',
                    }"
                  >
                    {{ activity.id }}
                  </span>
                  <span>{{ activity.title }}</span>
                </h4>
                <p
                  class="ml-8"
                  :style="{
                    color: 'var(--muted-foreground)',
                    fontWeight: 'var(--font-weight-normal)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.7',
                    margin: 0,
                  }"
                >
                  {{ activity.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Objetivos -->
          <div
            class="p-5"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderLeft: '3px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }"
          >
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-target" class="size-[18px]" :style="{ color: 'var(--primary)' }" />
              <h3
                :style="{
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--text-sm)',
                  margin: 0,
                }"
              >
                OBJETIVOS, METAS E ATIVIDADES
              </h3>
            </div>
            <p
              :style="{
                color: 'var(--muted-foreground)',
                fontWeight: 'var(--font-weight-normal)',
                fontSize: 'var(--text-sm)',
                lineHeight: '1.7',
                margin: 0,
              }"
            >
              Os objetivos e metas deste apoio são garantir a organização e a clareza das informações levantadas junto aos clientes, contribuindo para uma documentação completa e precisa dos processos e requisitos. Espera-se que o Analista de Requisitos facilite a comunicação entre as partes envolvidas, ajude a manter os registros atualizados e colabore para o bom andamento do projeto, apoiando a tomada de decisões assertivas na construção da solução.
            </p>
          </div>

          <!-- Métodos -->
          <div
            class="p-5"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
              borderLeft: '3px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }"
          >
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-zap" class="size-[18px]" :style="{ color: 'var(--primary)' }" />
              <h3
                :style="{
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--text-sm)',
                  margin: 0,
                }"
              >
                MÉTODOS
              </h3>
            </div>
            <p
              :style="{
                color: 'var(--muted-foreground)',
                fontWeight: 'var(--font-weight-normal)',
                fontSize: 'var(--text-sm)',
                lineHeight: '1.7',
                margin: 0,
              }"
            >
              Aplicar métodos e práticas reconhecidos de Engenharia de Software e Métodos Ágeis no desenvolvimento da Plataforma ConectaFapes.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
