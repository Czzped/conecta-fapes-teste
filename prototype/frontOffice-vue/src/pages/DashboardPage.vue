<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const cnpqLevel = ref('Nível 3')
const cnpqOptions = ['Nível 1', 'Nível 2', 'Nível 3']

const stats = [
  { label: 'Projetos', value: '147', icon: 'i-lucide-folder-kanban' },
  { label: 'Coordenadores', value: '98', icon: 'i-lucide-user-check' },
  { label: 'Bolsistas', value: '1.245', icon: 'i-lucide-users' },
  { label: 'Valor Total', value: 'R$ 4,8M', icon: 'i-lucide-dollar-sign' },
]

const projectsOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item' },
  legend: {
    bottom: '5%',
    left: 'center',
    orient: 'horizontal',
    itemGap: 15,
    itemWidth: 16,
    itemHeight: 16,
    textStyle: { fontFamily: 'Poppins, sans-serif', fontSize: 12 },
  },
  series: [
    {
      name: 'Projetos por Área',
      type: 'pie',
      radius: ['40%', '55%'],
      center: ['50%', '40%'],
      avoidLabelOverlap: false,
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: 18, fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' },
      },
      labelLine: { show: false },
      data: [
        { value: 1048, name: 'Sistemas de Computação', itemStyle: { color: '#0891b2' } },
        { value: 735, name: 'Telecomunicações', itemStyle: { color: '#06b6d4' } },
        { value: 580, name: 'Matemática Aplicada', itemStyle: { color: '#0891b2' } },
        { value: 484, name: 'Saneamento Ambiental', itemStyle: { color: '#0e7490' } },
        { value: 300, name: 'Estatística', itemStyle: { color: '#155e75' } },
      ],
    },
  ],
}))

const fapesOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item' },
  legend: {
    bottom: '0%',
    left: 'center',
    orient: 'horizontal',
    itemGap: 15,
    itemWidth: 16,
    itemHeight: 16,
    textStyle: { fontFamily: 'Poppins, sans-serif', fontSize: 12 },
  },
  series: [
    {
      name: 'Classificação Fapes',
      type: 'pie',
      radius: ['40%', '55%'],
      center: ['50%', '40%'],
      avoidLabelOverlap: false,
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: 18, fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' },
      },
      labelLine: { show: false },
      data: [
        { value: 85, name: 'Pesquisa', itemStyle: { color: '#0891b2' } },
        { value: 78, name: 'Carreira Científica', itemStyle: { color: '#0e7490' } },
        { value: 58, name: 'Difusão do Conhecimento', itemStyle: { color: '#155e75' } },
        { value: 72, name: 'Inovação', itemStyle: { color: '#06b6d4' } },
        { value: 45, name: 'Chamadas Internacionais', itemStyle: { color: '#164e63' } },
        { value: 65, name: 'Extensão', itemStyle: { color: '#0891b2' } },
      ],
    },
  ],
}))

const budgetOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['Orçamento Aprovado', 'Orçamento Executado'],
    bottom: '0%',
    left: 'center',
    textStyle: { fontFamily: 'Poppins, sans-serif' },
  },
  grid: { left: '3%', right: '4%', bottom: '12%', top: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    axisLabel: { fontFamily: 'Poppins, sans-serif' },
  },
  yAxis: {
    type: 'value',
    axisLabel: { fontFamily: 'Poppins, sans-serif', formatter: 'R$ {value}k' },
  },
  series: [
    {
      name: 'Orçamento Aprovado',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
      smooth: true,
      itemStyle: { color: '#0891b2' },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(8, 145, 178, 0.3)' },
          { offset: 1, color: 'rgba(8, 145, 178, 0.0)' },
        ]),
      },
    },
    {
      name: 'Orçamento Executado',
      type: 'line',
      data: [45, 52, 38, 58, 35, 98, 85, 72, 78, 95, 115, 128],
      smooth: true,
      itemStyle: { color: '#0891b2' },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(8, 145, 178, 0.3)' },
          { offset: 1, color: 'rgba(8, 145, 178, 0.0)' },
        ]),
      },
    },
  ],
}))

const scholarsOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { show: false },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '0%', containLabel: true },
  xAxis: { type: 'value', axisLabel: { fontFamily: 'Poppins, sans-serif' } },
  yAxis: {
    type: 'category',
    data: ['BPIG-I', 'BPIG-II', 'BPIG-III', 'BPIG-IV', 'BPIG-V', 'IC', 'Mestrado', 'Doutorado'],
    axisLabel: { fontFamily: 'Poppins, sans-serif' },
  },
  series: [
    {
      name: 'Bolsistas',
      type: 'bar',
      data: [145, 198, 167, 132, 156, 320, 180, 150],
      barWidth: '40%',
      itemStyle: {
        color: new graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 0, color: '#0891b2' },
          { offset: 1, color: '#0891b2' },
        ]),
        borderRadius: [0, 8, 8, 0],
      },
    },
  ],
}))

const equipmentOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { show: false },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '0%', containLabel: true },
  xAxis: { type: 'value', axisLabel: { fontFamily: 'Poppins, sans-serif' } },
  yAxis: {
    type: 'category',
    data: [
      'Notebook',
      'Projetor',
      'Ar Condicionado',
      'Monitor',
      'Impressora',
      'Servidor',
      'Tablet',
      'Celular',
      'Microscópio',
      'Câmera',
    ],
    axisLabel: { fontFamily: 'Poppins, sans-serif' },
  },
  series: [
    {
      name: 'Material Permanente',
      type: 'bar',
      data: [245, 89, 56, 198, 112, 34, 145, 167, 78, 92],
      barWidth: '40%',
      itemStyle: {
        color: new graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 0, color: '#0891b2' },
          { offset: 1, color: '#0891b2' },
        ]),
        borderRadius: [0, 8, 8, 0],
      },
    },
  ],
}))
</script>

<template>
  <div class="px-4 sm:px-6 md:px-8 py-8 mx-auto max-w-[1400px]">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-start gap-3 mb-6">
        <div
          class="p-2 rounded-md shrink-0"
          style="background-color: rgba(8, 145, 178, 0.1); color: var(--primary)"
          aria-label="Dashboard"
        >
          <UIcon name="i-lucide-bar-chart-3" class="size-5" />
        </div>
        <div class="flex-1">
          <h1 class="text-xl font-medium mb-2" style="color: var(--foreground)">Dashboard</h1>
          <p class="text-sm" style="color: var(--muted-foreground)">
            Dados dos projetos da sua instituição.
          </p>
        </div>
      </div>
      <USeparator />
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 mb-8" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
        :ui="{ body: 'p-6' }"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="p-3 rounded-md"
            style="background-color: rgba(8, 145, 178, 0.1)"
          >
            <UIcon :name="stat.icon" class="size-5" style="color: var(--primary)" />
          </div>
          <p class="text-sm font-medium m-0" style="color: var(--muted-foreground)">
            {{ stat.label }}
          </p>
        </div>
        <h3 class="text-2xl text-center m-0" style="color: var(--foreground)">
          {{ stat.value }}
        </h3>
      </UCard>
    </div>

    <!-- Charts -->
    <div class="grid gap-6" style="grid-template-columns: repeat(2, 1fr)">
      <!-- Projects by Area -->
      <UCard :ui="{ body: 'p-6' }">
        <div class="flex items-center justify-between">
          <h2 class="text-sm m-0" style="color: var(--foreground)">
            Projetos por Área do CNPQ
          </h2>
          <USelectMenu
            v-model="cnpqLevel"
            :items="cnpqOptions"
            class="min-w-32"
          />
        </div>
        <VChart :option="projectsOption" autoresize style="width: 100%; height: 400px" />
      </UCard>

      <!-- Fapes -->
      <UCard :ui="{ body: 'p-6' }">
        <div class="flex items-center justify-between">
          <h2 class="text-sm m-0" style="color: var(--foreground)">
            Projetos por Classificação Fapes
          </h2>
          <div style="width: 130px; height: 40px" />
        </div>
        <VChart :option="fapesOption" autoresize style="width: 100%; height: 400px" />
      </UCard>

      <!-- Budget Evolution (full width) -->
      <UCard :ui="{ body: 'p-6' }" class="col-span-full">
        <h2 class="text-sm mb-4 m-0" style="color: var(--foreground)">Evolução Orçamentária</h2>
        <VChart :option="budgetOption" autoresize style="width: 100%; height: 350px" />
      </UCard>

      <!-- Scholars by Type -->
      <UCard :ui="{ body: 'p-6' }">
        <h2 class="text-sm mb-4 m-0" style="color: var(--foreground)">Bolsistas por Tipo</h2>
        <VChart :option="scholarsOption" autoresize style="width: 100%; height: 350px" />
      </UCard>

      <!-- Equipment by Type -->
      <UCard :ui="{ body: 'p-6' }">
        <h2 class="text-sm mb-4 m-0" style="color: var(--foreground)">Material permanente</h2>
        <VChart :option="equipmentOption" autoresize style="width: 100%; height: 350px" />
      </UCard>
    </div>
  </div>
</template>
