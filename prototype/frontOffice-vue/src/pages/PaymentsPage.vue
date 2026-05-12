<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

interface Payment {
  reference: string
  project: string
  beneficiary: string
  scholarship: string
  value: string
  paymentDate: string
  status: string
}

interface BankAccount {
  agency: string
  account: string
}

const route = useRoute()
const scope = (route.meta.scope as 'personal' | 'project' | undefined) ?? 'personal'
const embedded = false

const selectedProjects = ref<string[]>([])
const selectedBeneficiaries = ref<string[]>([])
const selectedYears = ref<string[]>([])
const selectedModalities = ref<string[]>([])
const selectedStatuses = ref<string[]>([])

const personalPayments: Payment[] = [
  { reference: 'IC-2026-002', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/02/2026', status: 'Pendente' },
  { reference: 'IC-2026-001', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/01/2026', status: 'Pago' },
  { reference: 'IC-2025-008', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/01/2026', status: 'Bônus' },
  { reference: 'IC-2025-007', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/12/2025', status: 'Pago' },
  { reference: 'IC-2025-006', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/11/2025', status: 'Pago' },
  { reference: 'IC-2025-005', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/10/2025', status: 'Pago' },
  { reference: 'IC-2025-004', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/09/2025', status: 'Pago' },
  { reference: 'IC-2025-003', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/08/2025', status: 'Pago' },
  { reference: 'IC-2025-002', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/07/2025', status: 'Pago' },
  { reference: 'IC-2025-001', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/06/2025', status: 'Pago' },
]

const projectPayments: Payment[] = [
  { reference: 'IC-2026-014', project: 'Conecta Fapes', beneficiary: 'Ana Souza', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/02/2026', status: 'Pendente' },
  { reference: 'IC-2026-013', project: 'Conecta Fapes', beneficiary: 'Bruno Lima', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/02/2026', status: 'Pago' },
  { reference: 'IC-2026-012', project: 'Conecta Fapes', beneficiary: 'Carolina Martins', scholarship: 'Mestrado', value: 'R$ 2.100,00', paymentDate: '05/01/2026', status: 'Pago' },
  { reference: 'IC-2026-011', project: 'Conecta Fapes', beneficiary: 'Diego Almeida', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/01/2026', status: 'Bônus' },
  { reference: 'IC-2025-021', project: 'Conecta Fapes', beneficiary: 'Fernanda Rocha', scholarship: 'Doutorado', value: 'R$ 3.100,00', paymentDate: '05/12/2025', status: 'Pago' },
  { reference: 'IC-2025-020', project: 'Conecta Fapes', beneficiary: 'Gabriel Costa', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/11/2025', status: 'Pago' },
  { reference: 'IC-2025-019', project: 'Conecta Fapes', beneficiary: 'Helena Dias', scholarship: 'Apoio Técnico', value: 'R$ 1.200,00', paymentDate: '05/10/2025', status: 'Pago' },
  { reference: 'IC-2025-018', project: 'Conecta Fapes', beneficiary: 'Igor Nascimento', scholarship: 'Mestrado', value: 'R$ 2.100,00', paymentDate: '05/09/2025', status: 'Pago' },
  { reference: 'IC-2025-017', project: 'Conecta Fapes', beneficiary: 'Juliana Freitas', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/08/2025', status: 'Pago' },
  { reference: 'IC-2025-016', project: 'Conecta Fapes', beneficiary: 'Paulo Sérgio Junior', scholarship: 'Iniciação Científica', value: 'R$ 700,00', paymentDate: '05/07/2025', status: 'Pago' },
]

const payments = scope === 'project' ? projectPayments : personalPayments
const pageTitle = scope === 'project' ? 'Pagamentos' : 'Meus Pagamentos'
const pageSubtitle = scope === 'project'
  ? 'Acompanhe todos os pagamentos do projeto.'
  : 'Acompanhe o histórico dos seus pagamentos de bolsa.'
const shouldShowBeneficiary = scope === 'project'
const shouldShowProjectColumn = !embedded
const shouldShowProjectFilter = scope !== 'project'

const bankAccountsByBeneficiary: Record<string, BankAccount> = {
  'Ana Souza': { agency: '0912', account: '12345-6' },
  'Bruno Lima': { agency: '0874', account: '98765-1' },
  'Carolina Martins': { agency: '1120', account: '45678-9' },
  'Diego Almeida': { agency: '0715', account: '74125-0' },
  'Fernanda Rocha': { agency: '1044', account: '85236-7' },
  'Gabriel Costa': { agency: '0631', account: '96325-4' },
  'Helena Dias': { agency: '0988', account: '15973-2' },
  'Igor Nascimento': { agency: '0750', account: '35791-8' },
  'Juliana Freitas': { agency: '0816', account: '24680-3' },
  'Paulo Sérgio Junior': { agency: '0921', account: '123456-7' },
}

const getBankAccount = (beneficiary: string): BankAccount =>
  bankAccountsByBeneficiary[beneficiary] ?? { agency: 'Não informada', account: 'Não informada' }

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pago':
      return { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.2)' }
    case 'Pendente':
      return { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.2)' }
    case 'Bônus':
      return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.2)' }
    default:
      return { bg: 'var(--muted)', color: 'var(--muted-foreground)', border: 'var(--border)' }
  }
}

const getPaymentYear = (date: string) => date.split('/')[2]

const projectOptions = Array.from(new Set(payments.map((p) => p.project)))
  .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  .map((project) => ({ value: project, label: project }))

const beneficiaryOptions = Array.from(new Set(payments.map((p) => p.beneficiary)))
  .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  .map((beneficiary) => ({ value: beneficiary, label: beneficiary }))

const yearOptions = Array.from(new Set(payments.map((p) => getPaymentYear(p.paymentDate))))
  .sort((a, b) => Number(b) - Number(a))
  .map((year) => ({ value: year, label: year }))

const modalityOptions = Array.from(new Set(payments.map((p) => p.scholarship)))
  .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  .map((modality) => ({ value: modality, label: modality }))

const statusOptions = Array.from(new Set(payments.map((p) => p.status)))
  .sort((a, b) => a.localeCompare(b, 'pt-BR'))
  .map((status) => ({ value: status, label: status }))

const filteredPayments = computed<Payment[]>(() =>
  payments.filter((payment) => {
    const projectMatches = selectedProjects.value.length === 0 || selectedProjects.value.includes(payment.project)
    const beneficiaryMatches = selectedBeneficiaries.value.length === 0 || selectedBeneficiaries.value.includes(payment.beneficiary)
    const yearMatches = selectedYears.value.length === 0 || selectedYears.value.includes(getPaymentYear(payment.paymentDate))
    const modalityMatches = selectedModalities.value.length === 0 || selectedModalities.value.includes(payment.scholarship)
    const statusMatches = selectedStatuses.value.length === 0 || selectedStatuses.value.includes(payment.status)
    return projectMatches && beneficiaryMatches && yearMatches && modalityMatches && statusMatches
  }),
)

const desktopGridCols = computed(() => {
  if (shouldShowBeneficiary) {
    return shouldShowProjectColumn
      ? '1.15fr 1.2fr 1fr 1.15fr 1.35fr 0.8fr 0.8fr'
      : '1.2fr 1fr 1.15fr 1.35fr 0.8fr 0.8fr'
  }
  return '1.25fr 1fr 1.15fr 1.65fr 0.8fr 0.8fr'
})
</script>

<template>
  <div :class="embedded ? 'w-full' : 'w-full px-4 md:px-8 py-8'">
    <template v-if="!embedded">
      <div class="flex items-center gap-3 mb-2">
        <div
          class="p-2"
          :style="{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }"
        >
          <UIcon name="i-lucide-credit-card" class="w-5 h-5" />
        </div>
        <h1 :style="{ color: 'var(--foreground)', margin: 0 }">{{ pageTitle }}</h1>
      </div>

      <p
        :style="{
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          marginLeft: 'calc(32px + 0.75rem)',
          marginBottom: '1.5rem',
        }"
      >
        {{ pageSubtitle }}
      </p>

      <div :style="{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '2rem' }" />
    </template>

    <section class="mb-8 mt-6">
      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-if="shouldShowProjectFilter">
            <label
              :style="{
                display: 'block',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: '0.5rem',
              }"
            >
              Projeto
            </label>
            <USelectMenu
              v-model="selectedProjects"
              :items="projectOptions"
              value-key="value"
              label-key="label"
              multiple
              placeholder="Todos"
              class="w-full"
            />
          </div>

          <div v-if="shouldShowBeneficiary">
            <label
              :style="{
                display: 'block',
                color: 'var(--foreground)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: '0.5rem',
              }"
            >
              Bolsista
            </label>
            <USelectMenu
              v-model="selectedBeneficiaries"
              :items="beneficiaryOptions"
              value-key="value"
              label-key="label"
              multiple
              placeholder="Todos"
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
              Ano
            </label>
            <USelectMenu
              v-model="selectedYears"
              :items="yearOptions"
              value-key="value"
              label-key="label"
              multiple
              placeholder="Todos"
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
              Modalidade
            </label>
            <USelectMenu
              v-model="selectedModalities"
              :items="modalityOptions"
              value-key="value"
              label-key="label"
              multiple
              placeholder="Todos"
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
              v-model="selectedStatuses"
              :items="statusOptions"
              value-key="value"
              label-key="label"
              multiple
              placeholder="Todos"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="hidden md:grid md:grid-cols-1 gap-4">
          <div
            v-for="(payment, index) in filteredPayments"
            :key="`d-${index}`"
            class="p-5"
            :style="{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }"
          >
            <div
              class="grid gap-4"
              :style="{ gridTemplateColumns: desktopGridCols, alignItems: 'start' }"
            >
              <div v-if="shouldShowProjectColumn">
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                  Projeto
                </div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">
                  {{ payment.project }}
                </div>
              </div>

              <div v-if="shouldShowBeneficiary">
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                  Bolsista
                </div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">
                  {{ payment.beneficiary }}
                </div>
              </div>

              <div>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                  Data do Pagamento
                </div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">
                  {{ payment.paymentDate }}
                </div>
              </div>

              <div>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                  Modalidade da Bolsa
                </div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">
                  {{ payment.scholarship }}
                </div>
              </div>

              <div>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                  Dados bancários
                </div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">
                  Agência {{ getBankAccount(payment.beneficiary).agency }}
                </div>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginTop: '0.25rem', wordBreak: 'break-word' }">
                  Conta {{ getBankAccount(payment.beneficiary).account }}
                </div>
              </div>

              <div>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                  Valor
                </div>
                <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', wordBreak: 'break-word' }">
                  {{ payment.value }}
                </div>
              </div>

              <div>
                <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                  Status
                </div>
                <span
                  class="inline-flex items-center px-2.5 py-1"
                  :style="{
                    backgroundColor: getStatusColor(payment.status).bg,
                    color: getStatusColor(payment.status).color,
                    border: `1px solid ${getStatusColor(payment.status).border}`,
                    borderRadius: '9999px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                  }"
                >
                  {{ payment.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="md:hidden space-y-4">
          <div
            v-for="(payment, index) in filteredPayments"
            :key="`m-${index}`"
            class="p-4"
            :style="{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }"
          >
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-3">
                <div v-if="shouldShowProjectColumn">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Projeto
                  </div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                    {{ payment.project }}
                  </div>
                </div>

                <div v-if="shouldShowBeneficiary">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Bolsista
                  </div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                    {{ payment.beneficiary }}
                  </div>
                </div>

                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Data do Pagamento
                  </div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                    {{ payment.paymentDate }}
                  </div>
                </div>

                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Dados bancários
                  </div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                    Agência {{ getBankAccount(payment.beneficiary).agency }}
                  </div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }">
                    Conta {{ getBankAccount(payment.beneficiary).account }}
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Modalidade da Bolsa
                  </div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                    {{ payment.scholarship }}
                  </div>
                </div>

                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Valor
                  </div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }">
                    {{ payment.value }}
                  </div>
                </div>

                <div>
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Status
                  </div>
                  <span
                    class="inline-flex items-center px-2 py-0.5"
                    :style="{
                      backgroundColor: getStatusColor(payment.status).bg,
                      color: getStatusColor(payment.status).color,
                      border: `1px solid ${getStatusColor(payment.status).border}`,
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }"
                  >
                    {{ payment.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="filteredPayments.length === 0"
          class="p-5 text-center"
          :style="{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
          }"
        >
          Nenhum pagamento encontrado para os filtros selecionados.
        </div>
      </div>
    </section>
  </div>
</template>
