<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

type Payment = {
  id?: string
  tipo: string
  operacao: 'DEBITO' | 'CREDITO'
  classificacao: string
  valor: string
  data: string
  cnpj: string
  status: string
  statusColor: { bg: string; color: string; border: string }
  [k: string]: unknown
}

const searchTerm = ref('')
const selectedDate = ref<string>('')
const selectedStatus = ref<{ value: string; label: string }>({ value: '', label: 'Todos' })
const selectedCategory = ref<{ value: string; label: string }>({ value: '', label: 'Todos' })
const currentPage = ref(1)

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'rejeitado', label: 'Rejeitado' },
]

const categoryOptions = [
  { value: '', label: 'Todos' },
  { value: 'material-permanente', label: 'Material Permanente' },
  { value: 'material-consumo', label: 'Material de Consumo' },
  { value: 'passagem', label: 'Passagem' },
  { value: 'diaria', label: 'Diária' },
  { value: 'pessoal', label: 'Pessoal' },
]

const categoriesConsumed = [
  { name: 'Material Permanente', value: 'R$ 200.000,00' },
  { name: 'Material de Consumo', value: 'R$ 31.606,15' },
  { name: 'Passagem', value: 'R$ 31.606,15' },
  { name: 'Diária', value: 'R$ 0,00' },
  { name: 'Pessoal', value: 'R$ 0,00' },
]

const categoriesRemaining = [
  { name: 'Material Permanente', value: 'R$ 80.000,00' },
  { name: 'Material de Consumo', value: 'R$ 12.642,46' },
  { name: 'Passagem', value: 'R$ 12.642,46' },
  { name: 'Diária', value: 'R$ 0,00' },
  { name: 'Pessoal', value: 'R$ 0,00' },
]

const payments: Payment[] = [
  { id: 'TR-2026-001', tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 3.456,70', data: '27/02/2026 - 09:35', cnpj: 'Magazine Luiza', status: 'Pendente', statusColor: { bg: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: 'rgba(249, 115, 22, 0.3)' } },
  { id: 'TR-2026-002', tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 4.567,90', data: '25/02/2026 - 10:05', cnpj: 'Magazine Luiza', status: 'Em Validação', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
  { id: 'TR-2026-003', tipo: 'Crédito de terceiro', operacao: 'CREDITO', classificacao: 'ESTORNO', valor: 'R$ 1.250,00', data: '24/02/2026 - 15:10', cnpj: 'Fornecedor Alfa', status: 'Classificado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 'TR-2026-004', tipo: 'Pix recebido', operacao: 'CREDITO', classificacao: 'DEVOLUCAO', valor: 'R$ 400,00', data: '24/02/2026 - 16:35', cnpj: 'Coordenador do projeto', status: 'Comprovar', statusColor: { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.3)' } },
  { id: 'TR-2026-005', tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 789,00', data: '23/02/2026 - 12:50', cnpj: 'Kalunga', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 'TR-2026-006', tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.100,00', data: '22/02/2026 - 11:20', cnpj: 'Kalunga', status: 'Revisar', statusColor: { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.3)' } },
  { id: 'TR-2026-007', tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 1.890,50', data: '20/02/2026 - 11:45', cnpj: 'Americanas', status: 'Reprovado', statusColor: { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: 'rgba(239, 68, 68, 0.3)' } },
  { id: 'TR-2026-008', tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.345,60', data: '19/02/2026 - 17:25', cnpj: 'Americanas', status: 'Em Validação', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
  { id: 'TR-2026-009', tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 567,80', data: '18/02/2026 - 16:45', cnpj: 'Americanas', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 'TR-2026-010', tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 2.567,30', data: '15/02/2026 - 16:00', cnpj: 'Amazon', status: 'Pendente', statusColor: { bg: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: 'rgba(249, 115, 22, 0.3)' } },
  { id: 'TR-2026-011', tipo: 'Pix', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 5.234,20', data: '14/02/2026 - 08:40', cnpj: 'Amazon', status: 'Validado', statusColor: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.3)' } },
  { id: 'TR-2026-012', tipo: 'Boleto', operacao: 'DEBITO', classificacao: 'DESPESA', valor: 'R$ 3.890,00', data: '12/02/2026 - 09:15', cnpj: 'Amazon', status: 'Em Validação', statusColor: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.3)' } },
]

const openableStatuses = new Set([
  'Pendente',
  'Em Validação',
  'Reprovado',
  'Revisar',
  'Validado',
  'Classificado',
  'Comprovar',
])

const filteredPayments = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  return payments.filter(p => {
    if (term && !`${p.tipo} ${p.cnpj} ${p.valor} ${p.data}`.toLowerCase().includes(term)) return false
    if (selectedStatus.value.value && p.status.toLowerCase() !== selectedStatus.value.label.toLowerCase()) return false
    return true
  })
})

function canOpen(p: Payment) {
  return openableStatuses.has(p.status)
}

function openDetails(p: Payment) {
  if (!canOpen(p)) return
  router.push({ path: `/prestacao-contas/financeira/${p.id ?? ''}` })
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}
</script>

<template>
  <div class="w-full px-4 md:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-2">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="sm"
        :aria-label="t('common.back', 'Voltar')"
        @click="goBack"
      />
      <div
        class="p-2"
        :style="{
          color: 'var(--primary)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'rgba(8, 145, 178, 0.1)',
        }"
      >
        <UIcon name="i-lucide-dollar-sign" class="w-5 h-5" />
      </div>
      <h1 :style="{ color: 'var(--foreground)', margin: 0 }">
        {{ t('prestacaoContasFinanceira.title', 'Prestação de Contas Financeira') }}
      </h1>
    </div>

    <!-- Subtitle -->
    <p
      class="mb-6"
      :style="{
        color: 'var(--muted-foreground)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-normal)',
        marginLeft: 'calc(32px + 0.75rem)',
      }"
    >
      {{ t('prestacaoContasFinanceira.subtitle', 'Comprove os pagamentos realizados na conta bancária do seu projeto. As informações aparecem após 1 dia útil.') }}
    </p>

    <!-- Divider -->
    <div class="mb-8" :style="{ height: '1px', backgroundColor: 'var(--border)' }" />

    <!-- Controle de Gastos -->
    <section class="mb-8">
      <h1 :style="{ color: 'var(--foreground)', margin: 0, marginBottom: '0.5rem' }">
        {{ t('prestacaoContasFinanceira.controleGastos', 'Controle de Gastos') }}
      </h1>
      <p
        :style="{
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          marginBottom: '2rem',
        }"
      >
        {{ t('prestacaoContasFinanceira.controleGastosDesc', 'Acompanhe o valor que já gastou e o valor que ainda possui em Custeio e Capital. Clique no gráfico e veja o valor para cada categoria.') }}
      </p>

      <div
        class="p-6"
        :style="{
          backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
          borderRadius: 'var(--radius)',
          border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
        }"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3
              :style="{
                color: 'var(--foreground)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-sm)',
                marginBottom: '0.25rem',
              }"
            >
              {{ t('prestacaoContasFinanceira.progresso', 'Progresso do Orçamento') }}
            </h3>
            <p
              :style="{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                margin: 0,
              }"
            >
              75% utilizado
            </p>
          </div>
          <div :style="{ textAlign: 'right' }">
            <p
              :style="{
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)',
                marginBottom: '0.25rem',
              }"
            >
              {{ t('prestacaoContasFinanceira.valorGasto', 'Valor gasto') }}
            </p>
            <p
              :style="{
                color: 'var(--foreground)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: 0,
              }"
            >
              R$ 75.000
            </p>
          </div>
        </div>

        <UProgress :model-value="75" class="mb-3" />

        <div :style="{ textAlign: 'right' }">
          <p
            :style="{
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              margin: 0,
            }"
          >
            Total: R$ 100.000
          </p>
        </div>

        <!-- Breakdown lists -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <div :style="{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }" />
              <h4 :style="{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }">
                {{ t('prestacaoContasFinanceira.totalConsumido', 'Total Consumido por Categoria') }}
              </h4>
            </div>
            <div class="flex flex-col gap-1">
              <div
                v-for="(c, i) in categoriesConsumed"
                :key="`c-${i}`"
                class="flex justify-between"
              >
                <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">{{ c.name }}</span>
                <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">{{ c.value }}</span>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-2">
              <div :style="{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }" />
              <h4 :style="{ color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', margin: 0 }">
                {{ t('prestacaoContasFinanceira.totalRestante', 'Total Restante por Categoria') }}
              </h4>
            </div>
            <div class="flex flex-col gap-1">
              <div
                v-for="(c, i) in categoriesRemaining"
                :key="`r-${i}`"
                class="flex justify-between"
              >
                <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">{{ c.name }}</span>
                <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">{{ c.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Extrato do Projeto -->
    <section class="mb-8">
      <h1 :style="{ color: 'var(--foreground)', margin: 0, marginBottom: '0.5rem' }">
        {{ t('prestacaoContasFinanceira.extrato', 'Extrato do Projeto') }}
      </h1>
      <p
        :style="{
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          marginBottom: '2rem',
        }"
      >
        {{ t('prestacaoContasFinanceira.extratoDesc', 'Clique na linha e verifique os detalhes do pagamento. Se você deseja fazer uma compra de um item não presente no seu edital, primeiro faça a Solicitação de Remanejamento de Recursos.') }}
      </p>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label
            :style="{
              display: 'block',
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: '0.5rem',
            }"
          >
            {{ t('common.search', 'Pesquisar') }}
          </label>
          <UInput
            v-model="searchTerm"
            :placeholder="t('common.search', 'Buscar')"
            icon="i-lucide-search"
            class="w-full"
          />
        </div>

        <div>
          <label
            :style="{
              display: 'block',
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: '0.5rem',
            }"
          >
            {{ t('common.date', 'Data') }}
          </label>
          <UInput
            v-model="selectedDate"
            type="date"
            :placeholder="t('common.all', 'Todos')"
            class="w-full"
          />
        </div>

        <div>
          <label
            :style="{
              display: 'block',
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: '0.5rem',
            }"
          >
            Status
          </label>
          <USelectMenu
            v-model="selectedStatus"
            :items="statusOptions"
            value-key="value"
            label-key="label"
            :placeholder="t('common.all', 'Todos')"
            class="w-full"
          />
        </div>

        <div>
          <label
            :style="{
              display: 'block',
              color: 'var(--foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: '0.5rem',
            }"
          >
            {{ t('common.category', 'Categoria') }}
          </label>
          <USelectMenu
            v-model="selectedCategory"
            :items="categoryOptions"
            value-key="value"
            label-key="label"
            :placeholder="t('common.all', 'Todos')"
            class="w-full"
          />
        </div>
      </div>
    </section>

    <!-- Payments List -->
    <div class="space-y-4 mb-8">
      <div
        v-for="(payment, index) in filteredPayments"
        :key="payment.id ?? index"
        class="p-5"
        :style="{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          cursor: canOpen(payment) ? 'pointer' : 'default',
        }"
        @click="openDetails(payment)"
      >
        <!-- Desktop -->
        <div class="hidden md:block">
          <div class="grid grid-cols-12 gap-4 items-center">
            <div class="col-span-2">
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                {{ t('prestacaoContasFinanceira.movimento', 'Movimento') }}
              </div>
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', whiteSpace: 'nowrap' }">
                {{ payment.tipo }}
              </div>
              <div
                :style="{
                  color: payment.operacao === 'CREDITO' ? 'rgb(34, 197, 94)' : 'var(--muted-foreground)',
                  fontSize: 'var(--text-xs)',
                  marginTop: '0.35rem',
                  whiteSpace: 'nowrap',
                }"
              >
                {{ payment.operacao }} · {{ payment.classificacao }}
              </div>
            </div>

            <div class="col-span-2">
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                {{ t('prestacaoContasFinanceira.valor', 'Valor') }}
              </div>
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }">
                {{ payment.valor }}
              </div>
            </div>

            <div class="col-span-2">
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                {{ t('common.date', 'Data') }}
              </div>
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }">
                {{ payment.data }}
              </div>
            </div>

            <div class="col-span-3">
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                {{ t('prestacaoContasFinanceira.terceiro', 'Terceiro') }}
              </div>
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }">
                {{ payment.cnpj }}
              </div>
            </div>

            <div class="col-span-2">
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                Status
              </div>
              <span
                class="inline-flex items-center px-2.5 py-1"
                :style="{
                  backgroundColor: payment.statusColor.bg,
                  color: payment.statusColor.color,
                  border: `1px solid ${payment.statusColor.border}`,
                  borderRadius: '9999px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  whiteSpace: 'nowrap',
                }"
              >
                {{ payment.status }}
              </span>
            </div>

            <div class="col-span-1 flex justify-end">
              <UIcon
                v-if="canOpen(payment)"
                name="i-lucide-chevron-right"
                class="w-5 h-5"
                :style="{ color: 'var(--muted-foreground)' }"
              />
            </div>
          </div>
        </div>

        <!-- Mobile -->
        <div class="md:hidden">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                {{ t('prestacaoContasFinanceira.movimento', 'Movimento') }}
              </div>
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }">
                {{ payment.tipo }}
              </div>
              <div
                :style="{
                  color: payment.operacao === 'CREDITO' ? 'rgb(34, 197, 94)' : 'var(--muted-foreground)',
                  fontSize: 'var(--text-xs)',
                  marginTop: '0.35rem',
                }"
              >
                {{ payment.operacao }} · {{ payment.classificacao }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center px-2.5 py-1"
                :style="{
                  backgroundColor: payment.statusColor.bg,
                  color: payment.statusColor.color,
                  border: `1px solid ${payment.statusColor.border}`,
                  borderRadius: '9999px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  whiteSpace: 'nowrap',
                }"
              >
                {{ payment.status }}
              </span>
              <UIcon
                v-if="canOpen(payment)"
                name="i-lucide-chevron-right"
                class="w-5 h-5 flex-shrink-0"
                :style="{ color: 'var(--muted-foreground)' }"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                {{ t('prestacaoContasFinanceira.valor', 'Valor') }}
              </div>
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                {{ payment.valor }}
              </div>
            </div>

            <div>
              <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                {{ t('common.date', 'Data') }}
              </div>
              <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                {{ payment.data }}
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
              {{ t('prestacaoContasFinanceira.terceiro', 'Terceiro') }}
            </div>
            <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
              {{ payment.cnpj }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end">
      <UPagination
        v-model:page="currentPage"
        :total="filteredPayments.length"
        :items-per-page="12"
      />
    </div>
  </div>
</template>
