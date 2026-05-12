<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  title: string
  phase?: string
}>()

const route = useRoute()
</script>

<template>
  <div class="p-6 md:p-10 space-y-4">
    <div>
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <p class="text-sm text-muted-foreground">
        Stub ({{ phase ?? 'Fase 1' }}) — rota: <code>{{ route.fullPath }}</code>
      </p>
    </div>
    <UCard>
      <p>Conteúdo será portado em Fase 3.</p>
    </UCard>
  </div>
</template>
