<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface StatusColor {
  bg: string
  color: string
  border: string
}

interface Payment {
  id: string
  tipo: string
  operacao?: string
  classificacao?: string
  valor: string
  data: string
  cnpj: string
  status: string
  statusColor: StatusColor
  origemTerceiro?: string
  prestacaoAssociada?: string
  situacaoDebito?: string
  efeitoLiquido?: string
  modoAssociacao?: string
  valorOriginal?: string
  valorDevolvido?: string
  valorResidual?: string
  comprovanteObrigatorio?: string
}

const route = useRoute()
const router = useRouter()
useI18n()

// ── Mock payment lookup by id (source originally received `payment` prop) ──
const STATUS_COLORS: Record<string, StatusColor> = {
  'Pendente':       { bg: 'rgba(234,179,8,.1)', color: 'rgb(234,179,8)', border: 'rgba(234,179,8,.3)' },
  'Em Validação':   { bg: 'rgba(59,130,246,.1)', color: 'rgb(59,130,246)', border: 'rgba(59,130,246,.3)' },
  'Aprovado':       { bg: 'rgba(34,197,94,.1)', color: 'rgb(34,197,94)', border: 'rgba(34,197,94,.3)' },
  'Reprovado':      { bg: 'rgba(239,68,68,.1)', color: 'rgb(239,68,68)', border: 'rgba(239,68,68,.3)' },
  'Revisar':        { bg: 'rgba(234,179,8,.1)', color: 'rgb(234,179,8)', border: 'rgba(234,179,8,.3)' },
}

const paymentId = String(route.params.id ?? '1')

const payment = computed<Payment>(() => ({
  id: paymentId,
  tipo: 'Débito de Compra',
  operacao: 'DEBITO',
  classificacao: '-',
  valor: 'R$ 3.000,00',
  data: '15/03/2026',
  cnpj: '12.345.678/0001-90',
  status: 'Pendente',
  statusColor: STATUS_COLORS['Pendente'],
  origemTerceiro: 'Fornecedor X',
  prestacaoAssociada: 'PC-2026-001',
  situacaoDebito: 'Em aberto',
  efeitoLiquido: 'R$ 0,00',
  modoAssociacao: 'Manual',
  valorOriginal: 'R$ 3.000,00',
  valorDevolvido: 'R$ 1.500,00',
  valorResidual: 'R$ 1.500,00',
  comprovanteObrigatorio: 'Pendente',
}))

const isReadOnly = computed(() => payment.value.status !== 'Pendente')
const isCreditoEstorno = computed(() =>
  payment.value.operacao === 'CREDITO' && payment.value.classificacao === 'ESTORNO',
)
const isCreditoDevolucao = computed(() =>
  payment.value.operacao === 'CREDITO' && payment.value.classificacao === 'DEVOLUCAO',
)

const estornoAssociado = ref(false)
const devolucaoComprovanteAnexado = ref(false)
const devolucaoAssociada = ref(false)

// ── Step 1 ──
const documentos = [
  'Nota Fiscal (Produto ou Serviço)',
  'Diária',
  'Passagem',
  'Invoice (Pagamento Internacional)',
]
const documentosOptions = documentos.map(label => ({ label, value: label }))
const selectedDocumento = ref('')
const descricao = ref('')
const maxDesc = 250

// ── status alert ──
interface StatusMessage { text: string; bg: string; border: string; color: string }
const statusMessage = computed<StatusMessage | null>(() => {
  switch (payment.value.status) {
    case 'Em Validação':
      return {
        text: 'Esta Prestação de Contas está Em Validação. Após verificarmos todos os dados enviados, seu status irá ser atualizado na tela inicial. Enquanto isso, você não consegue alterar as informações enviadas.',
        bg: 'rgba(59,130,246,.1)', border: 'rgba(59,130,246,.3)', color: 'rgb(59,130,246)',
      }
    case 'Reprovado':
      return {
        text: 'Esta Prestação de Contas não foi aprovada por X motivo. Você deve repositar o valor para a conta do projeto em até 30 dias corridos.',
        bg: 'rgba(239,68,68,.1)', border: 'rgba(239,68,68,.3)', color: 'rgb(239,68,68)',
      }
    case 'Revisar':
      return {
        text: 'Esta Prestação de Contas ainda não foi aprovada e precisa de revisão.\n\nMensagem enviada pela Fapes: X',
        bg: 'rgba(234,179,8,.1)', border: 'rgba(234,179,8,.3)', color: 'rgb(234,179,8)',
      }
    default:
      return null
  }
})

const paymentSummary = computed(() => [
  { label: 'Pagamento', value: payment.value.tipo },
  { label: 'Valor', value: payment.value.valor },
  { label: 'Data', value: payment.value.data },
  { label: 'CNPJ', value: payment.value.cnpj },
])

function onBack() {
  if (window.history.length > 1) router.back()
  else router.push('/prestacao-contas/financeira')
}
</script>

<template>
  <div class="w-full px-4 md:px-8 py-8">
    <!-- Breadcrumb -->
    <nav
      class="flex items-center gap-2 mb-6"
      :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-family)' }"
    >
      <button
        type="button"
        class="flex items-center"
        :style="{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)' }"
        @click="onBack"
      >
        <UIcon name="i-lucide-home" class="size-4" />
      </button>
      <span>&gt;</span>
      <button
        type="button"
        class="hidden md:inline"
        :style="{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }"
        @click="onBack"
      >
        Prestação de Contas
      </button>
      <span class="hidden md:inline">&gt;</span>
      <button
        type="button"
        :style="{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }"
        @click="onBack"
      >
        Financeira
      </button>
      <span>&gt;</span>
      <span :style="{ color: 'var(--foreground)', fontFamily: 'var(--font-family)' }">Detalhes</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <div
        class="p-2 transition-colors"
        :style="{
          color: 'var(--primary)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
        }"
      >
        <UIcon name="i-lucide-dollar-sign" class="size-5" />
      </div>
      <h1
        class="text-xl font-semibold"
        :style="{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }"
      >
        Detalhes do Pagamento #{{ payment.id }}
      </h1>
    </div>

    <!-- Payment summary card -->
    <UCard class="mb-6">
      <div class="hidden md:grid grid-cols-5 gap-6">
        <div v-for="item in paymentSummary" :key="item.label">
          <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
            {{ item.label }}
          </div>
          <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }">
            {{ item.value }}
          </div>
        </div>
        <div>
          <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }">
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
              fontFamily: 'var(--font-family)',
            }"
          >
            {{ payment.status }}
          </span>
        </div>
      </div>

      <div class="md:hidden space-y-4">
        <div v-for="item in paymentSummary" :key="item.label">
          <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem', fontFamily: 'var(--font-family)' }">
            {{ item.label }}
          </div>
          <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }">
            {{ item.value }}
          </div>
        </div>
        <div>
          <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '0.25rem', fontFamily: 'var(--font-family)' }">
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
              fontFamily: 'var(--font-family)',
            }"
          >
            {{ payment.status }}
          </span>
        </div>
      </div>
    </UCard>

    <!-- Crédito Estorno panel -->
    <section v-if="isCreditoEstorno" class="mb-6">
      <div
        class="p-5"
        :style="{
          backgroundColor: 'color-mix(in srgb, rgb(34, 197, 94) 8%, transparent)',
          border: '1px solid color-mix(in srgb, rgb(34, 197, 94) 24%, transparent)',
          borderRadius: 'var(--radius)',
        }"
      >
        <div class="flex items-start gap-3 mb-4">
          <div>
            <h2
              class="text-lg font-semibold"
              :style="{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }"
            >
              Estorno identificado
            </h2>
            <p :style="{ color: 'var(--muted-foreground)', margin: '0.75rem 0 0', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }">
              Crédito de terceiro que anula um débito anterior e pode ser associado como ajuste conciliatório.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" :style="{ fontFamily: 'var(--font-family)' }">
          <div v-for="row in [
            { label: 'Terceiro', value: payment.origemTerceiro ?? payment.cnpj, color: null as string | null },
            { label: 'Crédito', value: payment.valor, color: 'rgb(34, 197, 94)' },
            { label: 'Classificação', value: payment.classificacao ?? '-', color: null },
            { label: 'Situação do débito', value: payment.situacaoDebito ?? '-', color: null },
            { label: 'Efeito líquido', value: payment.efeitoLiquido ?? '-', color: 'var(--primary)' },
            { label: 'Modo', value: payment.modoAssociacao ?? '-', color: null },
          ]" :key="row.label">
            <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }">
              {{ row.label }}
            </div>
            <div :style="{ color: row.color ?? 'var(--foreground)', fontWeight: 'var(--font-weight-normal)', fontSize: 'var(--text-sm)' }">
              {{ row.value }}
            </div>
          </div>
        </div>

        <div
          v-if="estornoAssociado"
          class="mt-4 p-3"
          :style="{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 'var(--radius)',
            color: 'rgb(34, 197, 94)',
            fontSize: 'var(--text-sm)',
          }"
        >
          Estorno associado à {{ payment.prestacaoAssociada ?? 'prestação existente' }} como {{ payment.modoAssociacao ?? 'ajuste conciliatório' }}.
        </div>

        <div class="mt-4 flex justify-end">
          <UButton
            :icon="estornoAssociado ? 'i-lucide-check-circle' : 'i-lucide-rotate-ccw'"
            :color="estornoAssociado ? 'success' : 'primary'"
            :variant="estornoAssociado ? 'soft' : 'solid'"
            :disabled="estornoAssociado"
            @click="estornoAssociado = true"
          >
            {{ estornoAssociado ? 'Associado à prestação existente' : 'Associar à prestação existente' }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Crédito Devolução panel -->
    <section v-if="isCreditoDevolucao" class="mb-6">
      <div
        class="p-5"
        :style="{
          backgroundColor: 'color-mix(in srgb, rgb(234, 179, 8) 8%, transparent)',
          border: '1px solid color-mix(in srgb, rgb(234, 179, 8) 24%, transparent)',
          borderRadius: 'var(--radius)',
        }"
      >
        <div class="flex items-start gap-3 mb-4">
          <div
            class="p-2"
            :style="{
              color: 'rgb(234, 179, 8)',
              backgroundColor: 'rgba(234, 179, 8, 0.12)',
              borderRadius: 'var(--radius)',
            }"
          >
            <UIcon name="i-lucide-upload" class="size-4" />
          </div>
          <div>
            <h2
              class="text-lg font-semibold"
              :style="{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }"
            >
              Devolução do coordenador
            </h2>
            <p :style="{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family)' }">
              Crédito feito pelo coordenador para devolver valor integral ou parcial. Exige comprovante, como Pix, TED ou boleto.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" :style="{ fontFamily: 'var(--font-family)' }">
          <div v-for="row in [
            { label: 'Origem do crédito', value: payment.cnpj, color: null as string | null },
            { label: 'Valor devolvido', value: payment.valorDevolvido ?? payment.valor, color: 'rgb(34, 197, 94)' },
            { label: 'Valor original', value: payment.valorOriginal ?? '-', color: null },
            {
              label: 'Comprovante',
              value: devolucaoComprovanteAnexado ? 'Anexado' : (payment.comprovanteObrigatorio ?? '-'),
              color: devolucaoComprovanteAnexado ? 'rgb(34, 197, 94)' : 'rgb(234, 179, 8)',
            },
            { label: 'Modo', value: payment.modoAssociacao ?? '-', color: null },
            { label: 'Classificação', value: payment.classificacao ?? '-', color: null },
          ]" :key="row.label">
            <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.35rem' }">
              {{ row.label }}
            </div>
            <div :style="{ color: row.color ?? 'var(--foreground)', fontSize: 'var(--text-sm)' }">
              {{ row.value }}
            </div>
          </div>
        </div>

        <div
          v-if="devolucaoAssociada"
          class="mt-4 p-3"
          :style="{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 'var(--radius)',
            color: 'rgb(34, 197, 94)',
            fontSize: 'var(--text-sm)',
          }"
        >
          Devolução associada à {{ payment.prestacaoAssociada ?? 'prestação existente' }}. Saldo residual: {{ payment.valorResidual ?? '-' }}.
        </div>

        <div class="mt-4 flex flex-col sm:flex-row justify-end gap-2">
          <UButton
            :icon="devolucaoComprovanteAnexado ? 'i-lucide-check-circle' : 'i-lucide-upload'"
            :color="devolucaoComprovanteAnexado ? 'success' : 'neutral'"
            variant="outline"
            @click="devolucaoComprovanteAnexado = true"
          >
            {{ devolucaoComprovanteAnexado ? 'Comprovante anexado' : 'Anexar comprovante' }}
          </UButton>
          <UButton
            :icon="devolucaoAssociada ? 'i-lucide-check-circle' : 'i-lucide-rotate-ccw'"
            :color="devolucaoAssociada ? 'success' : 'primary'"
            :variant="devolucaoAssociada ? 'soft' : 'solid'"
            :disabled="!devolucaoComprovanteAnexado || devolucaoAssociada"
            @click="devolucaoAssociada = true"
          >
            {{ devolucaoAssociada ? 'Devolução associada' : 'Associar prestação' }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Status alert -->
    <div
      v-if="statusMessage"
      class="p-4 mb-6"
      :style="{
        backgroundColor: statusMessage.bg,
        border: `1px solid ${statusMessage.border}`,
        borderRadius: 'var(--radius)',
      }"
    >
      <p
        :style="{
          color: statusMessage.color,
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--font-family)',
          margin: 0,
          lineHeight: '1.5',
          whiteSpace: 'pre-line',
        }"
      >
        {{ statusMessage.text }}
      </p>
    </div>

    <!-- ══ Steps container ══ -->
    <div
      :style="{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        marginBottom: '2rem',
      }"
    >
      <!-- ─── Step 1: Informações Gerais ─── -->
      <section class="mb-8">
        <div class="flex items-start gap-3 mb-1">
          <div
            :style="{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }"
          >
            1
          </div>
          <h2
            class="text-base font-semibold"
            :style="{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }"
          >
            Informações Gerais <span :style="{ color: 'rgb(239,68,68)' }">*</span>
          </h2>
        </div>
        <p
          :style="{
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-family)',
            marginLeft: '36px',
            marginBottom: '1.5rem',
            marginTop: '0.25rem',
            lineHeight: '1.5',
            maxWidth: '800px',
          }"
        >
          Selecione o tipo de Documento e descreva o contexto da compra.
        </p>

        <div :style="{ marginLeft: '36px' }">
          <UFormField label="Documento" required class="mb-4" :ui="{ root: 'max-w-[480px]' }">
            <USelectMenu
              v-model="selectedDocumento"
              :items="documentosOptions"
              value-key="value"
              placeholder="Selecione um documento"
              :disabled="isReadOnly"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Descrição" :ui="{ root: 'max-w-3xl' }">
            <UTextarea
              v-model="descricao"
              :maxlength="maxDesc"
              :disabled="isReadOnly"
              :rows="4"
              placeholder="Descreva o contexto da compra"
              class="w-full"
            />
            <template #help>
              <span :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }">
                {{ descricao.length }}/{{ maxDesc }}
              </span>
            </template>
          </UFormField>
        </div>
      </section>

      <!-- TODO Fase 4 — Step 2 (Anexar Documento Fiscal), Step 3 (Associar Compra / Diária / Passagem),
           Nota Fiscal expand, Cotação upload, Diária modal, modais Beneficiário/Passageiro,
           botões salvar/enviar/excluir. -->
      <UCard variant="subtle" class="mb-2">
        <div class="flex items-start gap-3">
          <UIcon name="i-lucide-info" class="size-5 text-primary mt-0.5" />
          <div class="text-sm">
            <p class="font-medium mb-1">Seções pendentes (Fase 4)</p>
            <ul class="list-disc ml-5 space-y-1 text-muted-foreground">
              <li>Step 2 — Anexar Documento Fiscal / Comprovantes (upload, drag-drop, preview)</li>
              <li>Step 3 — Associar Compra (Nota Fiscal/Invoice) e/ou Diária e/ou Passagem</li>
              <li>Tabela de diárias elegíveis + modal Criar Diária</li>
              <li>Expandir Nota Fiscal (chave, itens, impostos)</li>
              <li>Upload de Cotações + seleção</li>
              <li>Ações finais: Salvar rascunho, Excluir, Enviar para validação</li>
            </ul>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Action buttons (deferred) -->
    <div class="flex flex-col sm:flex-row justify-end gap-2">
      <UButton variant="outline" icon="i-lucide-arrow-left" @click="onBack">
        Voltar
      </UButton>
      <UButton variant="outline" icon="i-lucide-save" disabled>
        Salvar rascunho
      </UButton>
      <UButton color="primary" icon="i-lucide-send" disabled>
        Enviar para validação
      </UButton>
    </div>
  </div>
</template>
