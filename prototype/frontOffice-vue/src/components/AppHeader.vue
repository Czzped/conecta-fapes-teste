<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useTheme } from '@/composables/useTheme'
import { setLocale, type Locale } from '@/i18n'

const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const theme = useTheme()

function logout() {
  auth.logout()
  router.push('/login')
}

const languageItems = computed<DropdownMenuItem[][]>(() => [
  (['pt', 'en', 'es'] as Locale[]).map((lang) => ({
    label:
      lang === 'pt' ? t('header.portuguese')
      : lang === 'en' ? t('header.english')
      : t('header.spanish'),
    icon: locale.value === lang ? 'i-lucide-check' : undefined,
    onSelect: () => setLocale(lang),
  })),
])

const profileItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: t('header.logout'),
      icon: 'i-lucide-log-out',
      onSelect: logout,
    },
  ],
])

const projectItems: DropdownMenuItem[][] = [
  [
    { label: 'Conecta FAPES' },
    { label: 'Outro Exemplo de Projeto' },
    { label: 'Mais um Exemplo de Projeto' },
  ],
]
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b backdrop-blur"
    :style="{
      backgroundColor: 'var(--app-header)',
      borderBottomColor: 'var(--app-header-border)',
    }"
  >
    <div class="flex items-center justify-between h-16 px-4 md:px-8">
      <!-- Left: mobile menu -->
      <div class="flex items-center gap-2">
        <UButton
          class="md:hidden"
          variant="ghost"
          color="neutral"
          icon="i-lucide-menu"
          :aria-label="t('header.toggleMenu') === 'header.toggleMenu' ? 'Toggle menu' : t('header.toggleMenu')"
          @click="ui.toggleMobileMenu"
        />
      </div>

      <!-- Right: actions -->
      <div class="flex items-center gap-1">
        <!-- Project picker (coordenador only) -->
        <UDropdownMenu
          v-if="auth.accessType === 'coordenador'"
          :items="projectItems"
          :ui="{ content: 'min-w-[240px]' }"
        >
          <UButton
            variant="outline"
            color="neutral"
            trailing-icon="i-lucide-chevron-down"
            class="hidden md:inline-flex min-w-[220px] justify-between"
          >
            {{ t('home.selectProject') }}
          </UButton>
        </UDropdownMenu>

        <!-- Theme toggle -->
        <UButton
          variant="ghost"
          color="neutral"
          :icon="theme.isDark.value ? 'i-lucide-moon' : 'i-lucide-sun'"
          aria-label="Toggle theme"
          @click="theme.toggle"
        />

        <!-- Notifications (stub — Fase 3 conecta NotificationsSidebar) -->
        <UButton
          variant="ghost"
          color="neutral"
          :aria-label="t('header.notifications')"
          class="relative"
        >
          <UIcon name="i-lucide-bell" class="w-5 h-5" />
          <span
            class="absolute top-1 right-1 w-2 h-2 rounded-full"
            :style="{ backgroundColor: 'var(--destructive-foreground)' }"
          />
        </UButton>

        <!-- Language -->
        <UDropdownMenu :items="languageItems">
          <UButton
            class="hidden md:inline-flex"
            variant="ghost"
            color="neutral"
            icon="i-lucide-globe"
            :aria-label="t('header.language')"
          />
        </UDropdownMenu>

        <!-- Profile -->
        <UDropdownMenu :items="profileItems">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-user"
            :aria-label="t('header.profile')"
          />
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>
