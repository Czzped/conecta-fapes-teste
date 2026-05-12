<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore, type AccessType } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

interface MenuItem {
  to: string
  icon: string
  labelKey: string
  label?: string
}

interface MenuSection {
  titleKey?: string
  items: MenuItem[]
}

const props = defineProps<{
  isMobile?: boolean
}>()

const { t } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const route = useRoute()
const router = useRouter()

const collapsed = computed(() => !props.isMobile && ui.sidebarCollapsed)

const role = computed<AccessType | null>(() => auth.accessType)

const sections = computed<MenuSection[]>(() => {
  const r = role.value
  if (!r) return []

  if (r === 'reitor' || r === 'diretor') {
    return [
      {
        items: [
          { to: '/dashboard', icon: 'i-lucide-bar-chart-3', labelKey: 'sidebar.dashboard', label: 'Dashboard' },
          { to: '/projetos-lista', icon: 'i-lucide-folder-kanban', labelKey: 'sidebar.projects', label: 'Projetos' },
        ],
      },
    ]
  }

  const home: MenuItem = { to: '/', icon: 'i-lucide-home', labelKey: 'sidebar.home' }

  const management: MenuItem[] = [
    { to: '/projetos', icon: 'i-lucide-folder-kanban', labelKey: 'sidebar.myProject' },
  ]
  if (r === 'coordenador') {
    management.push({ to: '/minha-equipe', icon: 'i-lucide-users', labelKey: 'sidebar.myTeam' })
  }
  management.push({ to: '/certificados', icon: 'i-lucide-clipboard-list', labelKey: 'sidebar.requests' })

  const profile: MenuItem[] = [
    { to: '/informacoes', icon: 'i-lucide-user', labelKey: 'sidebar.myInfo' },
  ]
  if (r !== 'voluntario') {
    profile.push({ to: '/pagamentos', icon: 'i-lucide-credit-card', labelKey: 'sidebar.payments' })
  }

  const result: MenuSection[] = [
    { items: [home] },
    { titleKey: r === 'coordenador' ? 'sidebar.management' : undefined, items: management },
    { items: profile },
  ]

  if (r === 'coordenador') {
    result.push({
      titleKey: 'sidebar.accountability',
      items: [
        { to: '/prestacao-contas/financeira', icon: 'i-lucide-dollar-sign', labelKey: 'sidebar.financial' },
        { to: '/prestacao-contas/tecnica', icon: 'i-lucide-file-text', labelKey: 'sidebar.technical' },
        { to: '/remanejamento', icon: 'i-lucide-refresh-cw', labelKey: 'sidebar.reallocation' },
      ],
    })
  }

  return result
})

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <aside
    class="h-screen sticky top-0 flex flex-col border-r transition-all duration-300"
    :class="collapsed ? 'w-20' : 'w-60'"
    :style="{
      backgroundColor: 'var(--sidebar)',
      borderRightColor: 'var(--sidebar-border)',
      color: 'var(--sidebar-foreground)',
    }"
  >
    <!-- Brand -->
    <div
      class="flex items-center px-4 py-4"
      :class="[isMobile ? 'justify-between' : 'justify-center']"
    >
      <RouterLink
        to="/"
        class="flex items-center gap-2 font-semibold tracking-tight"
        :class="collapsed ? 'text-base' : 'text-lg'"
        :aria-label="t('sidebar.home')"
      >
        <span
          class="inline-flex items-center justify-center rounded-md w-8 h-8"
          :style="{ backgroundColor: 'var(--sidebar-primary)', color: 'var(--sidebar-primary-foreground)' }"
        >
          F
        </span>
        <span v-if="!collapsed">FAPES</span>
      </RouterLink>
      <UButton
        v-if="isMobile"
        variant="ghost"
        color="neutral"
        icon="i-lucide-x"
        size="sm"
        @click="ui.closeMobileMenu"
      />
    </div>

    <!-- Collapse toggle (desktop only) -->
    <div v-if="!isMobile" class="flex items-center justify-center py-1">
      <UButton
        variant="soft"
        color="primary"
        size="xs"
        :icon="collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
        :aria-label="collapsed ? 'Expandir menu' : 'Colapsar menu'"
        @click="ui.toggleSidebar"
      />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-2 py-2 space-y-4">
      <div v-for="(section, i) in sections" :key="i">
        <div
          v-if="section.titleKey && !collapsed"
          class="px-3 pb-2 text-xs uppercase tracking-wider font-semibold"
          :style="{ color: 'var(--muted-foreground)' }"
        >
          {{ t(section.titleKey) }}
        </div>
        <ul class="space-y-1">
          <li v-for="item in section.items" :key="item.to">
            <RouterLink
              :to="item.to"
              custom
              v-slot="{ navigate }"
            >
              <button
                type="button"
                class="w-full flex items-center gap-3 py-2.5 rounded-md transition-colors text-sm group relative"
                :class="[
                  collapsed ? 'justify-center px-0 mx-auto' : 'justify-start px-3',
                  isActive(item.to) ? 'font-medium' : 'font-normal',
                ]"
                :style="{
                  backgroundColor: isActive(item.to) ? 'var(--sidebar-accent)' : 'transparent',
                  color: isActive(item.to) ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                  width: collapsed ? '56px' : '100%',
                  minHeight: collapsed ? '44px' : undefined,
                }"
                :aria-label="item.label ?? t(item.labelKey)"
                :title="collapsed ? (item.label ?? t(item.labelKey)) : undefined"
                @click="navigate"
              >
                <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
                <span v-if="!collapsed" class="text-left flex-1">
                  {{ item.label ?? t(item.labelKey) }}
                </span>
              </button>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Logout -->
    <div class="p-2 border-t" :style="{ borderColor: 'var(--sidebar-border)' }">
      <UButton
        block
        variant="ghost"
        color="neutral"
        icon="i-lucide-log-out"
        :class="collapsed ? 'justify-center' : 'justify-start'"
        @click="handleLogout"
      >
        <span v-if="!collapsed">{{ t('header.logout') }}</span>
      </UButton>
    </div>
  </aside>
</template>
