<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { editais } from '@/data/editais'

// TODO Fase 4: validation (VeeValidate + Zod)

interface Membro {
  nome: string
  cpf: string
  funcao: string
  bolsa: string
  tipo: 'completo' | 'bolsa'
}
interface Despesa {
  nome: string
  categoria: string
  quantidade: string
  custo: string
  justificativa: string
}
interface Atividade {
  descricao: string
  inicio: string
  conclusao: string
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const editalId = computed(() => Number(route.params.id))
const edital = computed(
  () => editais.find((e) => e.id === editalId.value) ?? editais[0],
)

const submitted = ref(false)

// Dados Gerais
const titulo = ref('')
const coordenador = ref('')
const resumo = ref('')
const objGeral = ref('')
const objEspecifico = ref('')
const resultados = ref('')

// Proponente
const nomeCompleto = ref('')
const cpf = ref('')
const telefone = ref('')
const email = ref('')
const endereco = ref('')
const instituicao = ref('')

// Equipe
const membros = ref<Membro[]>([
  { nome: '', cpf: '', funcao: '', bolsa: '', tipo: 'completo' },
])

// Despesas
const despesas = ref<Despesa[]>([
  { nome: '', categoria: '', quantidade: '', custo: '', justificativa: '' },
])

// Cronograma
const atividades = ref<Atividade[]>([
  { descricao: '', inicio: '', conclusao: '' },
])

const instituicaoOptions = [
  { label: 'Universidade Federal do Espírito Santo (UFES)', value: 'UFES' },
  { label: 'Instituto Federal do Espírito Santo (IFES)', value: 'IFES' },
  { label: 'Universidade Vila Velha (UVV)', value: 'UVV' },
  { label: 'Faculdade Multivix', value: 'MULTIVIX' },
  { label: 'EMESCAM', value: 'EMESCAM' },
  { label: 'Outra', value: 'outro' },
]

const categoriaOptions = [
  { label: 'Capital', value: 'capital' },
  { label: 'Custeio', value: 'custeio' },
  { label: 'Bolsa', value: 'bolsa' },
  { label: 'Serviço de Terceiros', value: 'servico' },
  { label: 'Passagens e Diárias', value: 'passagem' },
]

function goBack() {
  router.push(`/cidadao/editais/${editalId.value}`)
}

function goLogin() {
  auth.logout()
  router.push('/login')
}

function handleSubmit() {
  submitted.value = true
}

function addMembroCompleto() {
  membros.value.push({
    nome: '',
    cpf: '',
    funcao: '',
    bolsa: '',
    tipo: 'completo',
  })
}

function addMembroBolsa() {
  membros.value.push({
    nome: '',
    cpf: '',
    funcao: '',
    bolsa: '',
    tipo: 'bolsa',
  })
}

function addDespesa() {
  despesas.value.push({
    nome: '',
    categoria: '',
    quantidade: '',
    custo: '',
    justificativa: '',
  })
}

function addAtividade() {
  atividades.value.push({ descricao: '', inicio: '', conclusao: '' })
}

// ── style tokens (mirrored from React source) ──
const PAGE_BG = '#071f2e'
const CARD_BG = 'rgba(255,255,255,0.03)'
const CARD_BORDER = '1px solid rgba(6,182,212,0.14)'
const SECTION_HEAD_BG = 'rgba(6,182,212,0.06)'
const SECTION_HEAD_BORDER = '1px solid rgba(6,182,212,0.14)'
const INPUT_BG = 'rgba(0,0,0,0.25)'
const INPUT_BORDER = '1px solid rgba(6,182,212,0.2)'
const RADIUS = 'var(--radius)'
const RADIUS_LG = 'var(--radius-lg)'
const FF = 'var(--font-family)'
const CLR_FG = '#f0f9ff'
const CLR_MUTED = 'rgba(186,230,253,0.55)'
const CLR_LABEL = 'rgba(186,230,253,0.65)'
const CLR_TEAL = '#0891b2'
const CLR_TEAL_MID = '#06b6d4'

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
}

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.85rem',
  borderRadius: RADIUS,
  border: INPUT_BORDER,
  backgroundColor: INPUT_BG,
  color: CLR_FG,
  fontSize: 'var(--text-sm)',
  fontFamily: FF,
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical' as const,
  lineHeight: 1.65,
  minHeight: '90px',
}

const labelStyle = {
  display: 'block',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: CLR_LABEL,
  marginBottom: '0.35rem',
  fontFamily: FF,
}

function reviewValueStyle(value: string) {
  return {
    fontSize: 'var(--text-sm)',
    color: value && value !== '' ? CLR_FG : CLR_MUTED,
    fontFamily: FF,
  }
}
</script>

<template>
  <!-- ── Success screen ── -->
  <div
    v-if="submitted"
    class="min-h-screen flex flex-col"
    :style="{ backgroundColor: PAGE_BG, color: CLR_FG, fontFamily: FF }"
  >
    <header
      class="sticky top-0 z-50"
      :style="{
        backgroundColor: 'rgba(7,31,46,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(6,182,212,0.15)',
      }"
    >
      <div
        :style="{
          ...containerStyle,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }"
      >
        <div
          :style="{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: CLR_TEAL,
            fontFamily: FF,
          }"
        >
          FAPES
        </div>
        <UButton color="primary" variant="solid" @click="goLogin">
          Entrar com Acesso Cidadão
        </UButton>
      </div>
    </header>

    <div
      class="flex-1 flex flex-col items-center justify-center"
      :style="{ padding: '4rem 1.5rem', textAlign: 'center' }"
    >
      <div
        :style="{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(6,182,212,0.15)',
          border: '2px solid rgba(6,182,212,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }"
      >
        <UIcon
          name="i-lucide-check-circle-2"
          :style="{ color: CLR_TEAL, fontSize: '36px' }"
        />
      </div>
      <h1
        :style="{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: CLR_FG,
          fontFamily: FF,
          marginBottom: '0.75rem',
        }"
      >
        Proposta enviada com sucesso!
      </h1>
      <p
        :style="{
          fontSize: 'var(--text-sm)',
          color: CLR_MUTED,
          fontFamily: FF,
          maxWidth: '480px',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
        }"
      >
        Sua inscrição para
        <strong :style="{ color: CLR_TEAL }">{{ edital.titulo }}</strong>
        foi recebida pela FAPES. Um e-mail de confirmação será enviado em
        breve.
      </p>
      <UButton color="primary" variant="soft" @click="goBack">
        Voltar para Oportunidades
      </UButton>
    </div>
  </div>

  <!-- ── Form ── -->
  <div
    v-else
    :style="{
      backgroundColor: PAGE_BG,
      color: CLR_FG,
      fontFamily: FF,
      minHeight: '100vh',
    }"
  >
    <!-- HEADER -->
    <header
      class="sticky top-0 z-50"
      :style="{
        backgroundColor: 'rgba(7,31,46,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(6,182,212,0.15)',
      }"
    >
      <div
        :style="{
          ...containerStyle,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }"
      >
        <div
          :style="{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: CLR_TEAL,
            fontFamily: FF,
          }"
        >
          FAPES
        </div>
        <UButton color="primary" variant="solid" @click="goLogin">
          Entrar com Acesso Cidadão
        </UButton>
      </div>
    </header>

    <!-- TITLE BAR -->
    <div>
      <div :style="{ ...containerStyle, padding: '1rem 1.5rem' }">
        <UButton
          variant="link"
          color="neutral"
          icon="i-lucide-chevron-left"
          :padded="false"
          class="!px-0 !py-0 mb-2"
          @click="goBack"
        >
          Voltar para o Edital
        </UButton>
        <div
          :style="{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: CLR_FG,
            fontFamily: FF,
          }"
        >
          Submissão de Proposta
        </div>
        <div
          :style="{
            fontSize: 'var(--text-sm)',
            color: CLR_MUTED,
            fontFamily: FF,
            marginTop: '2px',
          }"
        >
          Preencha todos os campos para submeter sua proposta ·
          {{ edital.titulo }} · {{ edital.numero }}
        </div>
      </div>
    </div>

    <!-- FORM BODY -->
    <div
      :style="{
        ...containerStyle,
        paddingTop: '2rem',
        paddingBottom: '7rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }"
    >
      <!-- DADOS GERAIS -->
      <div
        :style="{
          backgroundColor: CARD_BG,
          border: CARD_BORDER,
          borderRadius: RADIUS_LG,
          overflow: 'hidden',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            backgroundColor: SECTION_HEAD_BG,
            borderBottom: SECTION_HEAD_BORDER,
          }"
        >
          <div
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(6,182,212,0.18)',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }"
          >
            <UIcon
              name="i-lucide-file-text"
              :style="{ color: CLR_TEAL, fontSize: '16px' }"
            />
          </div>
          <div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_FG,
                fontFamily: FF,
              }"
            >
              Dados Gerais
            </div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                color: CLR_MUTED,
                fontFamily: FF,
                marginTop: '1px',
              }"
            >
              Preencha os dados básicos do projeto.
            </div>
          </div>
        </div>
        <div :style="{ padding: '1.5rem' }">
          <div
            :style="{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
            }"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label :style="labelStyle">Título do Projeto</label>
                <input
                  v-model="titulo"
                  type="text"
                  placeholder="Digite o título do projeto"
                  :style="inputStyle"
                />
              </div>
              <div>
                <label :style="labelStyle">Coordenador</label>
                <input
                  v-model="coordenador"
                  type="text"
                  placeholder="Nome do coordenador"
                  :style="inputStyle"
                />
              </div>
            </div>
            <div>
              <label :style="labelStyle">Resumo</label>
              <textarea
                v-model="resumo"
                placeholder="Descreva brevemente o projeto"
                rows="4"
                :style="textareaStyle"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label :style="labelStyle">Objetivo Geral</label>
                <textarea
                  v-model="objGeral"
                  placeholder="Descreva o objetivo geral"
                  rows="4"
                  :style="textareaStyle"
                />
              </div>
              <div>
                <label :style="labelStyle">Objetivo Específico</label>
                <textarea
                  v-model="objEspecifico"
                  placeholder="Descreva os objetivos específicos"
                  rows="4"
                  :style="textareaStyle"
                />
              </div>
            </div>
            <div>
              <label :style="labelStyle">Resultados</label>
              <textarea
                v-model="resultados"
                placeholder="Quais resultados são esperados?"
                rows="4"
                :style="textareaStyle"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- PROPONENTE -->
      <div
        :style="{
          backgroundColor: CARD_BG,
          border: CARD_BORDER,
          borderRadius: RADIUS_LG,
          overflow: 'hidden',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            backgroundColor: SECTION_HEAD_BG,
            borderBottom: SECTION_HEAD_BORDER,
          }"
        >
          <div
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(6,182,212,0.18)',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }"
          >
            <UIcon
              name="i-lucide-user"
              :style="{ color: CLR_TEAL, fontSize: '16px' }"
            />
          </div>
          <div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_FG,
                fontFamily: FF,
              }"
            >
              Proponente
            </div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                color: CLR_MUTED,
                fontFamily: FF,
                marginTop: '1px',
              }"
            >
              Informe os dados do responsável pelo projeto.
            </div>
          </div>
        </div>
        <div :style="{ padding: '1.5rem' }">
          <div
            :style="{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
            }"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label :style="labelStyle">Nome Completo</label>
                <input
                  v-model="nomeCompleto"
                  type="text"
                  placeholder="Nome completo"
                  :style="inputStyle"
                />
              </div>
              <div>
                <label :style="labelStyle">CPF</label>
                <input
                  v-model="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  :style="inputStyle"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label :style="labelStyle">Telefone</label>
                <input
                  v-model="telefone"
                  type="text"
                  placeholder="(27) 00000-0000"
                  :style="inputStyle"
                />
              </div>
              <div>
                <label :style="labelStyle">E-mail</label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="email@exemplo.com.br"
                  :style="inputStyle"
                />
              </div>
            </div>
            <div>
              <label :style="labelStyle">Endereço</label>
              <input
                v-model="endereco"
                type="text"
                placeholder="Rua, número, bairro, cidade – UF"
                :style="inputStyle"
              />
            </div>
            <div>
              <label :style="labelStyle">Sua Instituição</label>
              <select v-model="instituicao" :style="inputStyle">
                <option value="">Selecione...</option>
                <option
                  v-for="opt in instituicaoOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- EQUIPE -->
      <div
        :style="{
          backgroundColor: CARD_BG,
          border: CARD_BORDER,
          borderRadius: RADIUS_LG,
          overflow: 'hidden',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            backgroundColor: SECTION_HEAD_BG,
            borderBottom: SECTION_HEAD_BORDER,
          }"
        >
          <div
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(6,182,212,0.18)',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }"
          >
            <UIcon
              name="i-lucide-users"
              :style="{ color: CLR_TEAL, fontSize: '16px' }"
            />
          </div>
          <div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_FG,
                fontFamily: FF,
              }"
            >
              Equipe
            </div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                color: CLR_MUTED,
                fontFamily: FF,
                marginTop: '1px',
              }"
            >
              Adicione os membros da equipe que participarão e liste as
              bolsas.
            </div>
          </div>
        </div>
        <div :style="{ padding: '1.5rem' }">
          <div
            :style="{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }"
          >
            <div v-for="(m, i) in membros" :key="i">
              <div
                v-if="i > 0"
                :style="{
                  height: '1px',
                  backgroundColor: 'rgba(6,182,212,0.1)',
                  margin: '1.25rem 0',
                }"
              />
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: CLR_MUTED,
                  fontFamily: FF,
                  marginBottom: '0.75rem',
                }"
              >
                {{ m.tipo === 'bolsa' ? `Bolsa ${i + 1}` : `Membro ${i + 1}` }}
              </div>
              <div
                v-if="m.tipo === 'completo'"
                class="grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <div>
                  <label :style="labelStyle">Nome Completo</label>
                  <input
                    v-model="m.nome"
                    type="text"
                    placeholder="Nome completo"
                    :style="inputStyle"
                  />
                </div>
                <div>
                  <label :style="labelStyle">CPF</label>
                  <input
                    v-model="m.cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    :style="inputStyle"
                  />
                </div>
                <div>
                  <label :style="labelStyle">Função</label>
                  <input
                    v-model="m.funcao"
                    type="text"
                    placeholder="Ex: Pesquisador"
                    :style="inputStyle"
                  />
                </div>
                <div>
                  <label :style="labelStyle">Bolsa</label>
                  <input
                    v-model="m.bolsa"
                    type="text"
                    placeholder="Ex: IC, PQ..."
                    :style="inputStyle"
                  />
                </div>
              </div>
              <div v-else :style="{ maxWidth: '240px' }">
                <label :style="labelStyle">Bolsa</label>
                <input
                  v-model="m.bolsa"
                  type="text"
                  placeholder="Ex: IC, PQ..."
                  :style="inputStyle"
                />
              </div>
            </div>
            <div
              :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }"
            >
              <UButton
                variant="outline"
                color="primary"
                icon="i-lucide-plus"
                size="sm"
                @click="addMembroBolsa"
              >
                Adicionar Apenas Bolsa
              </UButton>
              <UButton
                variant="outline"
                color="primary"
                icon="i-lucide-plus"
                size="sm"
                @click="addMembroCompleto"
              >
                Adicionar Membro
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- DESPESAS -->
      <div
        :style="{
          backgroundColor: CARD_BG,
          border: CARD_BORDER,
          borderRadius: RADIUS_LG,
          overflow: 'hidden',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            backgroundColor: SECTION_HEAD_BG,
            borderBottom: SECTION_HEAD_BORDER,
          }"
        >
          <div
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(6,182,212,0.18)',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }"
          >
            <UIcon
              name="i-lucide-receipt"
              :style="{ color: CLR_TEAL, fontSize: '16px' }"
            />
          </div>
          <div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_FG,
                fontFamily: FF,
              }"
            >
              Despesas
            </div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                color: CLR_MUTED,
                fontFamily: FF,
                marginTop: '1px',
              }"
            >
              Lista os itens de capital e de custeio. Se o projeto for
              aprovado, será possível apenas usar o recurso com esses itens.
            </div>
          </div>
        </div>
        <div :style="{ padding: '1.5rem' }">
          <div
            :style="{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }"
          >
            <div v-for="(d, i) in despesas" :key="i">
              <div
                v-if="i > 0"
                :style="{
                  height: '1px',
                  backgroundColor: 'rgba(6,182,212,0.1)',
                  margin: '1.25rem 0',
                }"
              />
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: CLR_MUTED,
                  fontFamily: FF,
                  marginBottom: '0.75rem',
                }"
              >
                Item {{ i + 1 }}
              </div>
              <div
                class="grid grid-cols-1 md:grid-cols-4 gap-3"
                :style="{ marginBottom: '0.75rem' }"
              >
                <div>
                  <label :style="labelStyle">Nome</label>
                  <input
                    v-model="d.nome"
                    type="text"
                    placeholder="Nome do item"
                    :style="inputStyle"
                  />
                </div>
                <div>
                  <label :style="labelStyle">Categoria</label>
                  <select v-model="d.categoria" :style="inputStyle">
                    <option value="">Selecione...</option>
                    <option
                      v-for="opt in categoriaOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label :style="labelStyle">Quantidade</label>
                  <input
                    v-model="d.quantidade"
                    type="text"
                    placeholder="Ex: 3"
                    :style="inputStyle"
                  />
                </div>
                <div>
                  <label :style="labelStyle">Custo Total (R$)</label>
                  <input
                    v-model="d.custo"
                    type="text"
                    placeholder="0,00"
                    :style="inputStyle"
                  />
                </div>
              </div>
              <div>
                <label :style="labelStyle">Justificativa</label>
                <textarea
                  v-model="d.justificativa"
                  placeholder="Por que este item é necessário para o projeto?"
                  rows="3"
                  :style="textareaStyle"
                />
              </div>
            </div>
            <div :style="{ display: 'flex', justifyContent: 'flex-end' }">
              <UButton
                variant="outline"
                color="primary"
                icon="i-lucide-plus"
                size="sm"
                @click="addDespesa"
              >
                Adicionar Item
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- CRONOGRAMA -->
      <div
        :style="{
          backgroundColor: CARD_BG,
          border: CARD_BORDER,
          borderRadius: RADIUS_LG,
          overflow: 'hidden',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            backgroundColor: SECTION_HEAD_BG,
            borderBottom: SECTION_HEAD_BORDER,
          }"
        >
          <div
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(6,182,212,0.18)',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }"
          >
            <UIcon
              name="i-lucide-calendar-days"
              :style="{ color: CLR_TEAL, fontSize: '16px' }"
            />
          </div>
          <div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_FG,
                fontFamily: FF,
              }"
            >
              Cronograma
            </div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                color: CLR_MUTED,
                fontFamily: FF,
                marginTop: '1px',
              }"
            >
              Defina o período de execução e entrega concreta para cada
              objetivo específico. Dê preferência a entregas mensais.
            </div>
          </div>
        </div>
        <div :style="{ padding: '1.5rem' }">
          <div
            :style="{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }"
          >
            <div v-for="(a, i) in atividades" :key="i">
              <div
                v-if="i > 0"
                :style="{
                  height: '1px',
                  backgroundColor: 'rgba(6,182,212,0.1)',
                  margin: '1.25rem 0',
                }"
              />
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: CLR_MUTED,
                  fontFamily: FF,
                  marginBottom: '0.75rem',
                }"
              >
                Atividade {{ i + 1 }}
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label :style="labelStyle">Descrição da Atividade</label>
                  <input
                    v-model="a.descricao"
                    type="text"
                    placeholder="Descreva a atividade"
                    :style="inputStyle"
                  />
                </div>
                <div>
                  <label :style="labelStyle">Data de Início</label>
                  <input
                    v-model="a.inicio"
                    type="text"
                    placeholder="dd/mm/aaaa"
                    :style="inputStyle"
                  />
                </div>
                <div>
                  <label :style="labelStyle">Data de Conclusão</label>
                  <input
                    v-model="a.conclusao"
                    type="text"
                    placeholder="dd/mm/aaaa"
                    :style="inputStyle"
                  />
                </div>
              </div>
            </div>
            <div :style="{ display: 'flex', justifyContent: 'flex-end' }">
              <UButton
                variant="outline"
                color="primary"
                icon="i-lucide-plus"
                size="sm"
                @click="addAtividade"
              >
                Adicionar Atividade
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- RESUMO -->
      <div
        :style="{
          backgroundColor: CARD_BG,
          border: CARD_BORDER,
          borderRadius: RADIUS_LG,
          overflow: 'hidden',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            backgroundColor: SECTION_HEAD_BG,
            borderBottom: SECTION_HEAD_BORDER,
          }"
        >
          <div
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(6,182,212,0.18)',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }"
          >
            <UIcon
              name="i-lucide-eye"
              :style="{ color: CLR_TEAL, fontSize: '16px' }"
            />
          </div>
          <div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_FG,
                fontFamily: FF,
              }"
            >
              Resumo
            </div>
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                color: CLR_MUTED,
                fontFamily: FF,
                marginTop: '1px',
              }"
            >
              Revise todas as informações inseridas antes de submeter sua
              proposta.
            </div>
          </div>
        </div>
        <div :style="{ padding: '1.5rem' }">
          <!-- Dados Gerais -->
          <div :style="{ marginBottom: '1.5rem' }">
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_TEAL,
                fontFamily: FF,
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
              }"
            >
              Dados Gerais
            </div>
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3"
              :style="{ marginBottom: '0.5rem' }"
            >
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Título do Projeto
                </div>
                <div :style="reviewValueStyle(titulo)">{{ titulo || '—' }}</div>
              </div>
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Coordenador
                </div>
                <div :style="reviewValueStyle(coordenador)">
                  {{ coordenador || '—' }}
                </div>
              </div>
            </div>
            <div :style="{ marginBottom: '0.5rem' }">
              <div
                :style="{
                  fontSize: 'var(--text-sm)',
                  color: CLR_MUTED,
                  fontFamily: FF,
                  marginBottom: '2px',
                }"
              >
                Resumo
              </div>
              <div :style="reviewValueStyle(resumo)">{{ resumo || '—' }}</div>
            </div>
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3"
              :style="{ marginBottom: '0.5rem' }"
            >
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Objetivo Geral
                </div>
                <div :style="reviewValueStyle(objGeral)">
                  {{ objGeral || '—' }}
                </div>
              </div>
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Objetivo Específico
                </div>
                <div :style="reviewValueStyle(objEspecifico)">
                  {{ objEspecifico || '—' }}
                </div>
              </div>
            </div>
            <div>
              <div
                :style="{
                  fontSize: 'var(--text-sm)',
                  color: CLR_MUTED,
                  fontFamily: FF,
                  marginBottom: '2px',
                }"
              >
                Resultados
              </div>
              <div :style="reviewValueStyle(resultados)">
                {{ resultados || '—' }}
              </div>
            </div>
          </div>

          <div
            :style="{
              height: '1px',
              backgroundColor: 'rgba(6,182,212,0.1)',
              margin: '1.25rem 0',
            }"
          />

          <!-- Proponente -->
          <div :style="{ marginBottom: '1.5rem' }">
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_TEAL,
                fontFamily: FF,
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
              }"
            >
              Proponente
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Nome Completo
                </div>
                <div :style="reviewValueStyle(nomeCompleto)">
                  {{ nomeCompleto || '—' }}
                </div>
              </div>
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  CPF
                </div>
                <div :style="reviewValueStyle(cpf)">{{ cpf || '—' }}</div>
              </div>
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Telefone
                </div>
                <div :style="reviewValueStyle(telefone)">
                  {{ telefone || '—' }}
                </div>
              </div>
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  E-mail
                </div>
                <div :style="reviewValueStyle(email)">{{ email || '—' }}</div>
              </div>
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Endereço
                </div>
                <div :style="reviewValueStyle(endereco)">
                  {{ endereco || '—' }}
                </div>
              </div>
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Instituição
                </div>
                <div :style="reviewValueStyle(instituicao)">
                  {{ instituicao || '—' }}
                </div>
              </div>
            </div>
          </div>

          <div
            :style="{
              height: '1px',
              backgroundColor: 'rgba(6,182,212,0.1)',
              margin: '1.25rem 0',
            }"
          />

          <!-- Equipe -->
          <div :style="{ marginBottom: '1.5rem' }">
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_TEAL,
                fontFamily: FF,
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
              }"
            >
              Equipe
            </div>
            <div
              v-for="(m, i) in membros"
              :key="i"
              :style="{
                marginBottom: i < membros.length - 1 ? '0.75rem' : 0,
              }"
            >
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  color: CLR_MUTED,
                  fontFamily: FF,
                  marginBottom: '0.4rem',
                }"
              >
                Membro {{ i + 1 }}
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Nome Completo
                  </div>
                  <div :style="reviewValueStyle(m.nome)">
                    {{ m.nome || '—' }}
                  </div>
                </div>
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    CPF
                  </div>
                  <div :style="reviewValueStyle(m.cpf)">
                    {{ m.cpf || '—' }}
                  </div>
                </div>
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Função
                  </div>
                  <div :style="reviewValueStyle(m.funcao)">
                    {{ m.funcao || '—' }}
                  </div>
                </div>
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Bolsa
                  </div>
                  <div :style="reviewValueStyle(m.bolsa)">
                    {{ m.bolsa || '—' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            :style="{
              height: '1px',
              backgroundColor: 'rgba(6,182,212,0.1)',
              margin: '1.25rem 0',
            }"
          />

          <!-- Despesas -->
          <div :style="{ marginBottom: '1.5rem' }">
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_TEAL,
                fontFamily: FF,
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
              }"
            >
              Despesas
            </div>
            <div
              v-for="(d, i) in despesas"
              :key="i"
              :style="{
                marginBottom: i < despesas.length - 1 ? '0.75rem' : 0,
              }"
            >
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  color: CLR_MUTED,
                  fontFamily: FF,
                  marginBottom: '0.4rem',
                }"
              >
                Item {{ i + 1 }}
              </div>
              <div
                class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2"
                :style="{ marginBottom: '0.4rem' }"
              >
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Nome
                  </div>
                  <div :style="reviewValueStyle(d.nome)">
                    {{ d.nome || '—' }}
                  </div>
                </div>
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Categoria
                  </div>
                  <div :style="reviewValueStyle(d.categoria)">
                    {{ d.categoria || '—' }}
                  </div>
                </div>
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Quantidade
                  </div>
                  <div :style="reviewValueStyle(d.quantidade)">
                    {{ d.quantidade || '—' }}
                  </div>
                </div>
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Custo Total (R$)
                  </div>
                  <div :style="reviewValueStyle(d.custo)">
                    {{ d.custo || '—' }}
                  </div>
                </div>
              </div>
              <div>
                <div
                  :style="{
                    fontSize: 'var(--text-sm)',
                    color: CLR_MUTED,
                    fontFamily: FF,
                    marginBottom: '2px',
                  }"
                >
                  Justificativa
                </div>
                <div :style="reviewValueStyle(d.justificativa)">
                  {{ d.justificativa || '—' }}
                </div>
              </div>
            </div>
          </div>

          <div
            :style="{
              height: '1px',
              backgroundColor: 'rgba(6,182,212,0.1)',
              margin: '1.25rem 0',
            }"
          />

          <!-- Cronograma -->
          <div :style="{ marginBottom: '1.5rem' }">
            <div
              :style="{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: CLR_TEAL,
                fontFamily: FF,
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
              }"
            >
              Cronograma
            </div>
            <div
              v-for="(a, i) in atividades"
              :key="i"
              :style="{
                marginBottom: i < atividades.length - 1 ? '0.75rem' : 0,
              }"
            >
              <div
                :style="{
                  fontSize: 'var(--text-xs)',
                  color: CLR_MUTED,
                  fontFamily: FF,
                  marginBottom: '0.4rem',
                }"
              >
                Atividade {{ i + 1 }}
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Descrição
                  </div>
                  <div :style="reviewValueStyle(a.descricao)">
                    {{ a.descricao || '—' }}
                  </div>
                </div>
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Data de Início
                  </div>
                  <div :style="reviewValueStyle(a.inicio)">
                    {{ a.inicio || '—' }}
                  </div>
                </div>
                <div>
                  <div
                    :style="{
                      fontSize: 'var(--text-sm)',
                      color: CLR_MUTED,
                      fontFamily: FF,
                      marginBottom: '2px',
                    }"
                  >
                    Data de Conclusão
                  </div>
                  <div :style="reviewValueStyle(a.conclusao)">
                    {{ a.conclusao || '—' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- STICKY BOTTOM BAR -->
    <div
      :style="{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: 'rgba(7,31,46,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(6,182,212,0.2)',
        padding: '0.875rem 0',
      }"
    >
      <div
        :style="{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
        }"
      >
        <UButton variant="outline" color="neutral" @click="goBack">
          Cancelar
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          :style="{ backgroundColor: CLR_TEAL_MID }"
          @click="handleSubmit"
        >
          Submeter Proposta
        </UButton>
      </div>
    </div>
  </div>
</template>
