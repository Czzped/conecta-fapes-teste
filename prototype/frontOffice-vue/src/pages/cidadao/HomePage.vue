<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { editais } from '@/data/editais'

const router = useRouter()
const auth = useAuthStore()
const { toggle: toggleTheme } = useTheme()

const searchQuery = ref('')
const selectedArea = ref('Todas')
const selectedTab = ref('Aberto')

const oportunidadesRef = useTemplateRef<HTMLElement>('oportunidadesRef')

const areas = ['Todas', 'Carreira Científica', 'Pesquisa', 'Difusão do Conhecimento', 'Extensão', 'Inovação', 'Internacional']
const tabs = ['Aberto', 'Em Andamento', 'Finalizado']

const areaColors: Record<string, { bg: string; color: string }> = {
  'Carreira Científica':     { bg: 'var(--muted)', color: 'var(--muted-foreground)' },
  'Pesquisa':                { bg: 'var(--muted)', color: 'var(--muted-foreground)' },
  'Extensão':                { bg: 'var(--muted)', color: 'var(--muted-foreground)' },
  'Internacional':           { bg: 'var(--muted)', color: 'var(--muted-foreground)' },
  'Difusão do Conhecimento': { bg: 'var(--muted)', color: 'var(--muted-foreground)' },
  'Inovação':                { bg: 'var(--muted)', color: 'var(--muted-foreground)' },
}

const CONTAINER = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
} as const

const filtered = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return editais.filter(e => {
    const matchSearch =
      e.titulo.toLowerCase().includes(q) ||
      e.programa.toLowerCase().includes(q)
    const matchArea = selectedArea.value === 'Todas' || e.area === selectedArea.value
    const matchStatus = selectedTab.value === 'Aberto' || e.status === selectedTab.value
    return matchSearch && matchArea && matchStatus
  })
})

function getAreaColor(area: string) {
  return areaColors[area] ?? { bg: 'rgba(6,182,212,0.12)', color: '#0891b2' }
}

function scrollToOportunidades() {
  const el = oportunidadesRef.value
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 64
  window.scrollTo({ top, behavior: 'smooth' })
}

function onLogin() {
  auth.logout()
  router.push('/login')
}

function onVerEdital(id: number) {
  router.push(`/cidadao/editais/${id}`)
}
</script>

<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }">
    <!-- HEADER -->
    <header
      class="sticky top-0 z-50"
      :style="{
        backgroundColor: 'var(--app-header)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }"
    >
      <div
        :style="{
          ...CONTAINER,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }"
      >
        <div class="flex items-center gap-3">
          <div
            :style="{
              height: '36px',
              padding: '0 0.75rem',
              display: 'flex',
              alignItems: 'center',
              color: '#0891b2',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }"
          >
            FAPES
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="onLogin"
            :style="{
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              border: '1px solid #0891b2',
              backgroundColor: 'transparent',
              color: '#0891b2',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-family)',
            }"
            @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(8,145,178,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }"
            @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }"
          >
            Entrar com Acesso Cidadão
          </button>
          <button
            @click="toggleTheme"
            aria-label="Alternar tema"
            :style="{
              padding: '0.5rem',
              borderRadius: 'var(--radius)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }"
            @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--muted)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }"
            @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }"
          >
            <UIcon name="i-lucide-moon" :style="{ width: '18px', height: '18px' }" />
          </button>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <section
      class="relative overflow-hidden"
      :style="{
        backgroundColor: 'var(--background)',
        padding: '6rem 0 5rem',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
      }"
    >
      <div :style="{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, color-mix(in srgb, var(--card) 92%, transparent) 0%, color-mix(in srgb, var(--background) 98%, transparent) 68%)', pointerEvents: 'none' }" />
      <div :style="{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 44% 56% at 88% 24%, rgba(8,145,178,0.16) 0%, transparent 68%)', pointerEvents: 'none' }" />
      <div :style="{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 36% 42% at 6% 78%, rgba(8,145,178,0.08) 0%, transparent 72%)', pointerEvents: 'none' }" />
      <div :style="{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, var(--background))', pointerEvents: 'none', zIndex: 5 }" />

      <div :style="{ ...CONTAINER, width: '100%', position: 'relative', zIndex: 10 }">
        <div
          class="inline-flex items-center gap-2"
          :style="{
            padding: '0.35rem 0.875rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(6,182,212,0.15)',
            border: '1px solid rgba(6,182,212,0.4)',
            marginBottom: '2rem',
          }"
        >
          <span :style="{ color: '#0891b2', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '0.08em', fontFamily: 'var(--font-family)' }">
            TRANSPARÊNCIA &amp; CIÊNCIA
          </span>
        </div>

        <h1
          :style="{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            maxWidth: '700px',
            fontFamily: 'var(--font-family)',
          }"
        >
          Simplicidade no acesso a
          <span :style="{ color: '#0891b2' }">Editais</span>.
        </h1>

        <p
          :style="{
            fontSize: 'var(--text-base)',
            color: 'var(--muted-foreground)',
            maxWidth: '640px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            fontFamily: 'var(--font-family)',
          }"
        >
          Acompanhe as chamadas de captação da FAPES - Fundação de Amparo à Pesquisa e Inovação do Espírito Santo para projetos científicos, tecnológicos e de inovação. Informação clara para quem constrói o futuro.
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <button
            @click="scrollToOportunidades"
            :style="{
              padding: '0.75rem 1.75rem',
              borderRadius: 'var(--radius)',
              border: 'none',
              backgroundColor: '#06b6d4',
              color: '#0a0a0a',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-family)',
            }"
            @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#0891b2'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }"
            @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#06b6d4'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }"
          >
            Analisar Oportunidades
          </button>
        </div>
      </div>
    </section>

    <!-- OPORTUNIDADES -->
    <section ref="oportunidadesRef" :style="{ padding: '4rem 0 5rem', backgroundColor: 'var(--background)' }">
      <div :style="CONTAINER">
        <div :style="{ marginBottom: '2rem' }">
          <h2
            :style="{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: '0.375rem',
              fontFamily: 'var(--font-family)',
            }"
          >
            Oportunidades
          </h2>
          <p :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }">
            Explore os editais disponíveis.
          </p>
        </div>

        <div class="flex flex-col" :style="{ marginBottom: '2rem', gap: '1.25rem' }">
          <!-- Search -->
          <div
            class="flex items-center gap-2"
            :style="{
              backgroundColor: 'var(--input-background)',
              border: '1px solid rgba(6,182,212,0.22)',
              borderRadius: 'var(--radius)',
              padding: '0 1.125rem',
              maxWidth: '360px',
            }"
          >
            <UIcon name="i-lucide-search" :style="{ color: 'var(--muted-foreground)', flexShrink: 0, width: '18px', height: '18px' }" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por edital ou palavra-chave"
              :style="{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                padding: '0.5rem 0',
                fontFamily: 'var(--font-family)',
              }"
            />
          </div>

          <!-- Area filter pills -->
          <div class="flex flex-wrap gap-2" :style="{ marginTop: '0.75rem' }">
            <button
              v-for="area in areas"
              :key="area"
              @click="selectedArea = area"
              :style="{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedArea === area ? '#0891b2' : 'rgba(6,182,212,0.25)',
                backgroundColor: selectedArea === area ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.08)',
                color: selectedArea === area ? '#0891b2' : 'var(--muted-foreground)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-family)',
                whiteSpace: 'nowrap',
              }"
            >
              {{ area }}
            </button>
          </div>

          <!-- Tab bar -->
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid rgba(6,182,212,0.2)',
              width: 'fit-content',
            }"
          >
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="selectedTab = tab"
              :style="{
                position: 'relative',
                padding: '0.625rem 1.25rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: selectedTab === tab ? '#0891b2' : 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: selectedTab === tab ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)',
                transition: 'color 0.2s',
                outline: 'none',
                whiteSpace: 'nowrap',
              }"
              @mouseenter="(e) => { if (selectedTab !== tab) (e.currentTarget as HTMLElement).style.color = 'var(--foreground)' }"
              @mouseleave="(e) => { if (selectedTab !== tab) (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)' }"
            >
              {{ tab }}
              <span
                v-if="selectedTab === tab"
                :style="{
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: '#0891b2',
                  borderRadius: '2px 2px 0 0',
                }"
              />
            </button>
          </div>
        </div>

        <!-- Editais Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="edital in filtered"
            :key="edital.id"
            :style="{
              backgroundColor: 'rgba(6,182,212,0.06)',
              border: '1px solid rgba(6,182,212,0.18)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }"
            @mouseenter="(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(8,145,178,0.45)'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(6,182,212,0.1)'; el.style.backgroundColor = 'rgba(6,182,212,0.1)' }"
            @mouseleave="(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(6,182,212,0.18)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.backgroundColor = 'rgba(6,182,212,0.06)' }"
          >
            <div class="flex items-start justify-between gap-2">
              <span
                :style="{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#67e8f9',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-family)',
                }"
              >
                {{ edital.programa }}
              </span>
              <span
                :style="{
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  backgroundColor: getAreaColor(edital.area).bg,
                  color: getAreaColor(edital.area).color,
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-family)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }"
              >
                {{ edital.area }}
              </span>
            </div>

            <h3
              :style="{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                lineHeight: 1.4,
                fontFamily: 'var(--font-family)',
              }"
            >
              {{ edital.titulo }}
            </h3>

            <p
              :style="{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                lineHeight: 1.6,
                flex: 1,
                fontFamily: 'var(--font-family)',
              }"
            >
              {{ edital.descricao }}
            </p>

            <div
              :style="{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(6,182,212,0.18)',
              }"
            >
              <div>
                <div :style="{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '0.25rem', fontFamily: 'var(--font-family)' }">
                  Inscrição até
                </div>
                <div
                  class="flex items-center gap-1"
                  :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }"
                >
                  <UIcon name="i-lucide-calendar" :style="{ color: 'var(--muted-foreground)', width: '13px', height: '13px' }" />
                  {{ edital.prazo }}
                </div>
              </div>
              <div :style="{ textAlign: 'right' }">
                <div :style="{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '0.25rem', fontFamily: 'var(--font-family)' }">
                  Valor total
                </div>
                <div :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }">
                  {{ edital.valor }}
                </div>
              </div>
            </div>

            <button
              @click="onVerEdital(edital.id)"
              :style="{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(6,182,212,0.35)',
                backgroundColor: 'rgba(6,182,212,0.12)',
                color: '#0891b2',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                fontFamily: 'var(--font-family)',
              }"
              @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(6,182,212,0.22)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.55)' }"
              @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(6,182,212,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.35)' }"
            >
              Ver Edital
              <UIcon name="i-lucide-arrow-right" :style="{ width: '14px', height: '14px' }" />
            </button>
          </div>
        </div>

        <div
          v-if="filtered.length === 0"
          class="flex flex-col items-center justify-center py-16 gap-3"
          :style="{ color: 'var(--muted-foreground)' }"
        >
          <UIcon name="i-lucide-search" :style="{ opacity: 0.4, width: '40px', height: '40px' }" />
          <p :style="{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }">
            Nenhum edital encontrado com esses filtros.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
