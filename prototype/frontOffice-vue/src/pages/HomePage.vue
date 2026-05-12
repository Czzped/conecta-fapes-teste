<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const accessType = computed(() => auth.accessType)
const hasDiariaPendenteAceite = computed(
  () => accessType.value === 'bolsista' || accessType.value === 'coordenador',
)

interface ScholarItem {
  label: string
  value: string
  isBadge?: boolean
}

const scholarData = computed<ScholarItem[]>(() => [
  { label: 'Nome do Bolsista', value: 'Paulo Sérgio Junior' },
  { label: 'Projeto', value: 'Conecta Fapes' },
  {
    label: 'Tipo de Bolsa',
    value:
      accessType.value === 'voluntario' || accessType.value === 'bolsista'
        ? 'BPIG-VIII'
        : 'Iniciação Científica',
  },
  { label: 'Valor', value: 'R$ 700,00' },
  { label: 'Período de Vigência', value: '01/06/2025 - 01/06/2026' },
  { label: 'Status da Bolsa', value: 'Ativo', isBadge: true },
])

function goToCertificadosDiarias() {
  // TODO Fase 4: rota específica de certificados-diarias
  router.push('/certificados')
}

function goToEditais() {
  router.push('/editais')
}
</script>

<template>
  <div class="w-full px-4 md:px-8 py-8">
    <!-- Header with icon button -->
    <div class="flex items-center gap-3 mb-8">
      <div class="flex items-center gap-3">
        <button
          class="p-2 transition-colors"
          :style="{
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
          }"
          aria-label="Portal"
        >
          <UIcon name="i-lucide-briefcase" class="w-5 h-5" />
        </button>
        <h1 :style="{ color: 'var(--foreground)' }">Portal do Bolsista</h1>
      </div>
    </div>

    <!-- Project Card - Only for Coordenador -->
    <div v-if="accessType === 'coordenador'" class="mb-8">
      <div
        class="p-5 w-full"
        :style="{
          backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
          border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
          borderRadius: 'var(--radius)',
        }"
      >
        <!-- Header - Nome, Status, Bolsistas -->
        <div class="mb-6">
          <div class="flex items-center justify-between gap-3">
            <h3
              :style="{
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                margin: 0,
              }"
            >
              Conecta Fapes
            </h3>
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center px-2.5 py-1"
                :style="{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '9999px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                }"
              >
                Ativo
              </span>
              <div class="flex items-center gap-1.5">
                <UIcon
                  name="i-lucide-users"
                  class="w-3.5 h-3.5"
                  :style="{ color: 'var(--muted-foreground)' }"
                />
                <span
                  :style="{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                  }"
                >
                  60 Bolsistas
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bolsas Section -->
        <div class="mb-5">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-graduation-cap" class="w-[18px] h-[18px]" :style="{ color: '#3b82f6' }" />
              <span
                :style="{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }"
              >
                Bolsistas
              </span>
            </div>
            <span
              :style="{
                color: '#3b82f6',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-semibold)',
              }"
            >
              50%
            </span>
          </div>
          <div
            :style="{
              width: '100%',
              height: '6px',
              backgroundColor: 'color-mix(in srgb, #3b82f6 15%, transparent)',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginBottom: '0.5rem',
            }"
          >
            <div
              :style="{
                width: '50%',
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s ease',
              }"
            />
          </div>
          <div class="flex items-center justify-between">
            <span
              :style="{
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }"
            >
              R$ 60.000,00
            </span>
            <span
              :style="{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }"
            >
              R$ 120.000,00
            </span>
          </div>
        </div>

        <!-- Capital e Custeio Section -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-building-2" class="w-[18px] h-[18px]" :style="{ color: '#14b8a6' }" />
              <span
                :style="{
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }"
              >
                Capital e Custeio
              </span>
            </div>
            <span
              :style="{
                color: '#14b8a6',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-semibold)',
              }"
            >
              67%
            </span>
          </div>
          <div
            :style="{
              width: '100%',
              height: '6px',
              backgroundColor: 'color-mix(in srgb, #14b8a6 15%, transparent)',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginBottom: '0.5rem',
            }"
          >
            <div
              :style="{
                width: '67%',
                height: '100%',
                backgroundColor: '#14b8a6',
                transition: 'width 0.3s ease',
              }"
            />
          </div>
          <div class="flex items-center justify-between">
            <span
              :style="{
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }"
            >
              R$ 108.500,00
            </span>
            <span
              :style="{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
              }"
            >
              R$ 250.000,00
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificações Section -->
    <section class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="p-2 transition-colors"
          :style="{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
          }"
        >
          <UIcon name="i-lucide-bell" class="w-5 h-5" />
        </div>
        <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Notificações</h3>
      </div>

      <div class="space-y-3">
        <button
          v-if="hasDiariaPendenteAceite"
          type="button"
          class="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 text-left transition-colors"
          :style="{
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--primary) 24%, transparent)',
            borderRadius: 'var(--radius)',
          }"
          @click="goToCertificadosDiarias"
        >
          <div class="flex items-start gap-3">
            <UIcon
              name="i-lucide-hotel"
              class="w-5 h-5"
              :style="{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }"
            />
            <div>
              <p
                :style="{
                  color: 'var(--foreground)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: 'var(--text-sm)',
                  margin: '0 0 0.25rem 0',
                }"
              >
                Diária aguardando assinatura
              </p>
              <p
                :style="{
                  color: 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-normal)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: '1.5',
                  margin: 0,
                }"
              >
                Você possui uma Diária aguardando o seu aceite.
              </p>
              <p
                :style="{
                  color: 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-normal)',
                  fontSize: 'var(--text-xs)',
                  lineHeight: '1.5',
                  margin: '0.25rem 0 0',
                }"
              >
                Linhares/ES · partida em 03/07/2026 às 07:00.
              </p>
            </div>
          </div>
          <span
            class="inline-flex items-center gap-2"
            :style="{
              color: 'var(--primary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              whiteSpace: 'nowrap',
            }"
          >
            Assinar diária
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          </span>
        </button>
      </div>
    </section>

    <!-- Divider -->
    <div class="my-8" :style="{ height: '1px', backgroundColor: 'var(--border)' }" />

    <!-- Submissão de Propostas Section -->
    <section class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div
          class="p-2 transition-colors"
          :style="{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
          }"
        >
          <UIcon name="i-lucide-folder-open" class="w-5 h-5" />
        </div>
        <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Submissão de Propostas</h3>
      </div>

      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <button
          class="px-4 py-2 transition-colors self-end md:self-auto"
          :style="{
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
          }"
          @click="goToEditais"
        >
          Ver Todas
        </button>
      </div>

      <div>
        <a href="#" class="group" :style="{ display: 'block', textDecoration: 'none' }">
          <div
            class="p-4 transition-all"
            :style="{
              backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
            }"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h4
                  :style="{
                    color: 'var(--primary)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '0.5rem',
                  }"
                >
                  Edital Fapes Nº 27/2025 – Apoio à Editoração e Publicação de Periódicos Científicos
                </h4>
                <p
                  :style="{
                    color: 'var(--muted-foreground)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    margin: 0,
                  }"
                >
                  Inscrições até 01/06/2026
                </p>
              </div>
              <div
                class="transition-transform"
                :style="{ color: 'var(--primary)', flexShrink: 0 }"
              >
                <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>

    <!-- Dados do Bolsista Section -->
    <section>
      <div class="mb-8" :style="{ height: '1px', backgroundColor: 'var(--border)' }" />

      <div class="flex items-center gap-3 mb-6">
        <div
          class="p-2 transition-colors"
          :style="{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
          }"
        >
          <UIcon name="i-lucide-file-user" class="w-5 h-5" />
        </div>
        <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Informações da Bolsa</h3>
      </div>

      <div
        class="p-5"
        :style="{
          backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
          border: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
          borderRadius: 'var(--radius)',
        }"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :style="{ gap: '2rem' }">
          <div v-for="(item, index) in scholarData" :key="index">
            <label
              class="block mb-2"
              :style="{
                color: 'var(--muted-foreground)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-sm)',
              }"
            >
              {{ item.label }}
            </label>
            <span
              v-if="item.isBadge"
              class="inline-flex items-center px-3 py-1"
              :style="{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '9999px',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                whiteSpace: 'nowrap',
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
                wordBreak: 'break-word',
              }"
            >
              {{ item.value }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
