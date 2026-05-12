<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore, type AccessType } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

type ButtonRole = AccessType | 'avaliador'

interface RoleButton {
  value: ButtonRole
  labelKey?: string
  fallback: string
  icon: string
  disabled?: boolean
}

const roles: RoleButton[] = [
  { value: 'cidadao', fallback: 'Cidadão', icon: 'i-lucide-user-circle' },
  { value: 'voluntario', labelKey: 'login.volunteer', fallback: 'Voluntário', icon: 'i-lucide-user' },
  { value: 'bolsista', labelKey: 'login.scholar', fallback: 'Bolsista', icon: 'i-lucide-graduation-cap' },
  { value: 'coordenador', labelKey: 'login.coordinator', fallback: 'Coordenador', icon: 'i-lucide-users' },
  { value: 'avaliador', fallback: 'Avaliador', icon: 'i-lucide-clipboard-check', disabled: true },
  { value: 'reitor', fallback: 'Reitor e Diretor', icon: 'i-lucide-building' },
]

const selected = ref<ButtonRole | null>(null)

function label(r: RoleButton) {
  if (!r.labelKey) return r.fallback
  const v = t(r.labelKey)
  return v === r.labelKey ? r.fallback : v
}

function handleSelect(r: RoleButton) {
  if (r.disabled) {
    selected.value = r.value
    return
  }
  selected.value = r.value
  auth.login(r.value as AccessType)
  router.push(auth.landingRoute)
}

onMounted(() => {
  document.documentElement.classList.add('dark')
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center p-4"
    :style="{ backgroundColor: 'var(--background)' }"
  >
    <div class="w-full max-w-md flex flex-col items-center gap-8">
      <!-- Brand placeholder (Figma logo deferred) -->
      <div
        class="flex items-center gap-3 px-5 py-3 rounded-lg"
        :style="{
          backgroundColor: 'color-mix(in srgb, var(--sidebar-primary) 12%, transparent)',
          border: '1px solid var(--border)',
        }"
      >
        <span
          class="inline-flex items-center justify-center w-10 h-10 rounded-md font-bold text-lg"
          :style="{ backgroundColor: 'var(--sidebar-primary)', color: 'var(--sidebar-primary-foreground)' }"
        >F</span>
        <span class="text-xl font-semibold tracking-tight">FAPES</span>
      </div>

      <div
        class="w-full px-6 py-8 md:p-8 space-y-6"
        :style="{
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-sm)',
          border: '1px solid var(--border)',
        }"
      >
        <div class="text-center space-y-1">
          <h2 class="text-lg font-semibold" :style="{ color: 'var(--card-foreground)' }">
            {{ t('login.welcome') }}
          </h2>
          <p class="text-sm" :style="{ color: 'var(--muted-foreground)' }">
            {{ t('login.loginWithAcessoCidadao') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            v-for="r in roles"
            :key="r.value"
            type="button"
            :disabled="r.disabled"
            class="flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all border"
            :class="r.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'"
            :style="{
              backgroundColor: selected === r.value && !r.disabled ? 'var(--primary)' : 'var(--card)',
              color: selected === r.value && !r.disabled ? 'var(--primary-foreground)' : 'var(--card-foreground)',
              borderColor: 'var(--border)',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }"
            @click="handleSelect(r)"
          >
            <UIcon :name="r.icon" class="w-4 h-4" />
            <span>{{ label(r) }}</span>
          </button>
        </div>

        <p class="text-center text-sm leading-relaxed" :style="{ color: 'var(--muted-foreground)' }">
          {{ t('login.acessoCidadaoInfo') }}
        </p>
      </div>
    </div>
  </div>
</template>
