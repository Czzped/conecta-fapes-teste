<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'

const ui = useUiStore()
</script>

<template>
  <div class="flex min-h-screen" :style="{ backgroundColor: 'var(--background)' }">
    <!-- Desktop sidebar -->
    <div class="hidden md:block">
      <AppSidebar />
    </div>

    <!-- Mobile sidebar (USlideover) -->
    <USlideover v-model:open="ui.mobileMenuOpen" side="left" :ui="{ content: 'w-72 max-w-full' }">
      <template #content>
        <AppSidebar is-mobile />
      </template>
    </USlideover>

    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader />
      <main class="flex-1" :style="{ backgroundColor: 'var(--background)' }">
        <RouterView />
      </main>
    </div>
  </div>
</template>
