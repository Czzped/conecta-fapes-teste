<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { editais } from '@/data/editais'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const CONTAINER = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
} as const

const areaColors: Record<string, { bg: string; color: string }> = {
  'Carreira Científica':     { bg: 'rgba(8,145,178,0.12)', color: '#0891b2' },
  'Pesquisa':                { bg: 'rgba(8,145,178,0.12)', color: '#0891b2' },
  'Extensão':                { bg: 'rgba(8,145,178,0.12)', color: '#0891b2' },
  'Internacional':           { bg: 'rgba(8,145,178,0.12)', color: '#0891b2' },
  'Difusão do Conhecimento': { bg: 'rgba(8,145,178,0.12)', color: '#0891b2' },
  'Inovação':                { bg: 'rgba(8,145,178,0.12)', color: '#0891b2' },
}

const editalId = computed(() => Number(route.params.id))
const edital = computed(
  () => editais.find(e => e.id === editalId.value) ?? editais[0],
)
const areaColor = computed(
  () => areaColors[edital.value.area] ?? { bg: 'rgba(8,145,178,0.12)', color: '#0891b2' },
)

const metaChips = computed(() => [
  { icon: 'i-lucide-calendar', label: 'Inscrição até', value: edital.value.prazo },
  { icon: 'i-lucide-users', label: 'Vagas', value: `${edital.value.vagas} vagas` },
  { icon: 'i-lucide-dollar-sign', label: 'Valor total', value: edital.value.valor },
])

function onBack() {
  router.push('/cidadao')
}

function onInscricao() {
  router.push(`/cidadao/inscricao/${editalId.value}`)
}

function onLogin() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div
    class="min-h-screen"
    :style="{ backgroundColor: '#071f2e', color: '#f0f9ff', fontFamily: 'var(--font-family)' }"
  >
    <header
      class="sticky top-0 z-50"
      :style="{
        backgroundColor: 'rgba(7,31,46,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(6,182,212,0.15)',
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
        <div
          :style="{
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            color: '#67e8f9',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }"
        >
          FAPES
        </div>
        <button
          @click="onLogin"
          :style="{
            padding: '0.45rem 1.1rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-family)',
          }"
        >
          Entrar com Acesso Cidadão
        </button>
      </div>
    </header>

    <div :style="{ ...CONTAINER, paddingTop: '1.75rem', paddingBottom: '0.5rem' }">
      <button
        @click="onBack"
        class="inline-flex items-center gap-2"
        :style="{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(186,230,253,0.65)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--font-family)',
          padding: 0,
        }"
      >
        <UIcon name="i-lucide-chevron-left" class="size-4" />
        Voltar para Oportunidades
      </button>
    </div>

    <div :style="{ ...CONTAINER, paddingTop: '1.5rem', paddingBottom: '8rem' }">
      <div
        :style="{
          backgroundColor: 'rgba(6,182,212,0.06)',
          border: '1px solid rgba(6,182,212,0.18)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }"
      >
        <div :style="{ flex: '1 1 300px' }">
          <div
            class="flex items-center gap-2"
            :style="{ marginBottom: '0.625rem', flexWrap: 'wrap' }"
          >
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
                padding: '0.2rem 0.625rem',
                borderRadius: '9999px',
                backgroundColor: areaColor.bg,
                color: areaColor.color,
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                fontFamily: 'var(--font-family)',
              }"
            >
              {{ edital.area }}
            </span>
            <span
              v-if="edital.numero"
              :style="{
                fontSize: 'var(--text-xs)',
                color: 'rgba(186,230,253,0.5)',
                fontFamily: 'var(--font-family)',
              }"
            >
              {{ edital.numero }}
            </span>
          </div>
          <h1
            :style="{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: '#f0f9ff',
              lineHeight: 1.3,
              fontFamily: 'var(--font-family)',
              marginBottom: '0.5rem',
            }"
          >
            {{ edital.titulo }}
          </h1>
          <p
            :style="{
              fontSize: 'var(--text-sm)',
              color: 'rgba(186,230,253,0.7)',
              lineHeight: 1.6,
              fontFamily: 'var(--font-family)',
            }"
          >
            {{ edital.descricao }}
          </p>
        </div>

        <div
          :style="{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            minWidth: '180px',
          }"
        >
          <div
            v-for="item in metaChips"
            :key="item.label"
            class="flex items-center gap-2"
          >
            <span :style="{ color: 'rgba(186,230,253,0.45)' }">
              <UIcon :name="item.icon" class="size-[15px]" />
            </span>
            <div>
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(186,230,253,0.5)',
                  fontFamily: 'var(--font-family)',
                  lineHeight: 1,
                }"
              >
                {{ item.label }}
              </div>
              <div
                :style="{
                  fontSize: 'var(--text-sm)',
                  color: '#f0f9ff',
                  fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-family)',
                }"
              >
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2" :style="{ marginBottom: '1rem' }">
        <UIcon name="i-lucide-file-text" class="size-4" :style="{ color: 'rgba(186,230,253,0.5)' }" />
        <span
          :style="{
            fontSize: 'var(--text-sm)',
            color: 'rgba(186,230,253,0.55)',
            fontFamily: 'var(--font-family)',
          }"
        >
          Documento do Edital
        </span>
      </div>

      <div
        :style="{
          border: '1px solid rgba(6,182,212,0.2)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }"
      >
        <div
          :style="{
            backgroundColor: 'rgba(6,182,212,0.08)',
            borderBottom: '1px solid rgba(6,182,212,0.15)',
            padding: '0.625rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }"
        >
          <span
            :style="{
              fontSize: 'var(--text-xs)',
              color: 'rgba(186,230,253,0.55)',
              fontFamily: 'var(--font-family)',
            }"
          >
            {{ edital.numero ?? 'Edital FAPES' }} — Página 1 de 53
          </span>
          <button
            :style="{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(186,230,253,0.55)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-family)',
            }"
          >
            <UIcon name="i-lucide-external-link" class="size-[13px]" />
            Abrir em nova aba
          </button>
        </div>

        <div
          :style="{
            backgroundColor: '#e8e8e8',
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }"
        >
          <div
            :style="{
              width: '100%',
              maxWidth: '860px',
              minHeight: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              color: '#94a3b8',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
              borderRadius: '2px',
            }"
          >
            Pré-visualização do edital indisponível
          </div>
        </div>
      </div>
    </div>

    <div
      :style="{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: 'rgba(7,31,46,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(6,182,212,0.2)',
        padding: '1rem 0',
      }"
    >
      <div
        :style="{
          ...CONTAINER,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }"
      >
        <div>
          <div
            :style="{
              fontSize: 'var(--text-xs)',
              color: 'rgba(186,230,253,0.5)',
              fontFamily: 'var(--font-family)',
              marginBottom: '0.2rem',
            }"
          >
            Edital aberto
          </div>
          <div
            :style="{
              fontSize: 'var(--text-sm)',
              color: '#f0f9ff',
              fontWeight: 'var(--font-weight-medium)',
              fontFamily: 'var(--font-family)',
            }"
          >
            {{ edital.titulo }} · Inscrições até {{ edital.prazo }}
          </div>
        </div>
        <button
          @click="onInscricao"
          :style="{
            padding: '0.75rem 2rem',
            borderRadius: 'var(--radius)',
            border: 'none',
            backgroundColor: '#06b6d4',
            color: 'rgba(7,31,46,1)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            whiteSpace: 'nowrap',
          }"
        >
          Fazer Inscrição
        </button>
      </div>
    </div>
  </div>
</template>
