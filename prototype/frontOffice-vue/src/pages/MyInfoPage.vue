<script setup lang="ts">
import { ref, computed } from 'vue'

type TabType = 'dados' | 'documentos'

const activeTab = ref<TabType>('documentos')
const expandedDocId = ref<number | null>(null)
const expandedCanceledScholarship = ref(false)
const dragActive = ref<number | null>(null)
const deletedDocuments = ref<number[]>([])
const termoQ1 = ref<'sim' | 'nao' | null>(null)
const termoQ2 = ref<'sim' | 'nao' | null>(null)
const termoQ3 = ref<'sim' | 'nao' | null>(null)
const termoSigned = ref(false)
const termoStatus = ref('Pendente')
const selectedEthnicity = ref('Parda')
const selectedAcademicLevel = ref('Ensino superior')

// Form fields (TODO Fase 4: VeeValidate+Zod)
const nomeCompleto = ref('Paulo Sérgio Junior')
const nomeSocial = ref('')
const cpf = ref('123.456.789-00')
const dataNascimento = ref('1995-03-15')
const email = ref('paulo.souza@example.com')
const celular = ref('(27) 99999-9999')
const genero = ref('Masculino')
const lattes = ref('http://lattes.cnpq.br/1234567890')
const rua = ref('Rua das Flores')
const numero = ref('123')
const complemento = ref('Apto 101')
const cep = ref('29000-000')
const bairro = ref('Centro')
const municipio = ref('Vitória')
const estado = ref('Espírito Santo')
const pais = ref('Brasil')
const banco = ref('Banestes')
const agencia = ref('0001')
const conta = ref('12345678-9')

const academicLevels = [
  'Selecione',
  'Não informado',
  'Ensino fundamental',
  'Ensino médio',
  'Ensino superior',
  'Especialização',
  'Mestrado',
  'Doutorado',
  'Pós-doutorado',
]

const ethnicities = ['Amarela', 'Branca', 'Indígena', 'Parda', 'Preta']

interface DocItem {
  id: number
  requisito: string
  documento: string
  dataEnvio: string
  status: string
  bolsa?: string
}

const generalDocuments: DocItem[] = [
  { id: 1, requisito: 'Nível Médio', documento: 'Imagem Frente e Verso do Diploma', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 2, requisito: 'Nível Superior', documento: 'Imagem Frente e Verso do Diploma', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 3, requisito: 'RG', documento: 'Imagem Frente e Verso do RG', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 4, requisito: 'CPF', documento: 'CPF ou Comprovante de Situação Cadastral', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 6, requisito: 'Lattes', documento: 'PDF gerado pela plataforma', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 7, requisito: 'Certidão Negativa de Débito - Municipal', documento: 'Certidão de Regularidade Fiscal Municipal', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 8, requisito: 'Certidão Negativa de Débito - Estadual', documento: 'Certidão de Regularidade Fiscal Estadual', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 9, requisito: 'Certidão Negativa de Débito - Federal', documento: 'Certidão de Regularidade Fiscal Federal', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 10, requisito: 'Certidão Negativa de Débito - Trabalhista', documento: 'Extrato CAGED', dataEnvio: '20/02/2026', status: 'Validado' },
  { id: 12, requisito: 'Plano de Trabalho', documento: 'Formulário de Atividades Bolsista', dataEnvio: '20/02/2026', status: 'Validado' },
]

const bpigIIDocuments = computed<DocItem[]>(() => [
  { id: 204, requisito: 'Termo de Responsabilidade', documento: 'Assinatura Digital', dataEnvio: '25/02/2026', status: termoStatus.value, bolsa: 'BPIG-II' },
  { id: 201, requisito: 'Titulação mínima ou comprovação de experiência profissional', documento: 'Diploma de maior titulação', dataEnvio: '-', status: 'Pendente', bolsa: 'BPIG-II' },
  { id: 202, requisito: 'Comprovante de Residência', documento: 'Dentre os últimos 6 meses', dataEnvio: '25/02/2026', status: 'Em Validação', bolsa: 'BPIG-II' },
  { id: 203, requisito: 'Não ter vínculo empregatício', documento: 'CNIS', dataEnvio: '25/02/2026', status: 'Reprovado', bolsa: 'BPIG-II' },
])

const documents = computed<DocItem[]>(() => [...bpigIIDocuments.value, ...generalDocuments])

function getStatusColor(status: string) {
  switch (status) {
    case 'Validado':
      return { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: 'rgba(34, 197, 94, 0.2)' }
    case 'Pendente':
      return { bg: 'rgba(234, 179, 8, 0.1)', color: 'rgb(234, 179, 8)', border: 'rgba(234, 179, 8, 0.2)' }
    case 'Em Validação':
      return { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: 'rgba(59, 130, 246, 0.2)' }
    case 'Reprovado':
      return { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: 'rgba(239, 68, 68, 0.2)' }
    default:
      return { bg: 'var(--muted)', color: 'var(--muted-foreground)', border: 'var(--border)' }
  }
}

const expandableIds = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 201, 202, 203])

function toggleExpand(docId: number, status: string) {
  if (status === 'Pendente' || status === 'Em Validação' || status === 'Reprovado' || expandableIds.has(docId)) {
    expandedDocId.value = expandedDocId.value === docId ? null : docId
  }
}

function handleDragEnter(e: DragEvent, docId: number) {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = docId
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = null
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}

function handleDrop(e: DragEvent, docId: number) {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = null
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    // TODO Fase 4: upload
    console.log(`Arquivo(s) anexado(s) ao documento ${docId}:`, files)
  }
}

function handleFileSelect(e: Event, docId: number) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    console.log(`Arquivo(s) selecionado(s) para o documento ${docId}:`, files)
  }
}

function handleDeleteDocument(docId: number) {
  deletedDocuments.value.push(docId)
}

function signTermo() {
  termoSigned.value = true
  termoStatus.value = 'Em Validação'
}

function saveChanges() {
  // TODO Fase 4: persist
  console.log('Salvando dados...')
}

const dataSectionStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '1.5rem',
}

</script>

<template>
  <div class="w-full px-4 md:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <div
        class="p-2 transition-colors"
        :style="{
          color: 'var(--primary)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'rgba(8, 145, 178, 0.1)',
        }"
      >
        <UIcon name="i-lucide-user" class="w-5 h-5" />
      </div>
      <h1 :style="{ color: 'var(--foreground)' }">Minhas Informações</h1>
    </div>

    <!-- Desktop Tab Bar -->
    <div
      class="hidden md:flex gap-6 mb-8"
      :style="{ borderBottom: '1px solid var(--border)' }"
    >
      <button
        class="pb-3 transition-all"
        :style="{
          color: activeTab === 'documentos' ? 'var(--primary)' : 'var(--muted-foreground)',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--text-sm)',
          marginBottom: '-1px',
          background: 'none',
          border: 'none',
          borderBottom: activeTab === 'documentos' ? '2px solid var(--primary)' : '2px solid transparent',
          cursor: 'pointer',
        }"
        @click="activeTab = 'documentos'"
      >
        Meus Documentos
      </button>
      <button
        class="pb-3 transition-all"
        :style="{
          color: activeTab === 'dados' ? 'var(--primary)' : 'var(--muted-foreground)',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--text-sm)',
          marginBottom: '-1px',
          background: 'none',
          border: 'none',
          borderBottom: activeTab === 'dados' ? '2px solid var(--primary)' : '2px solid transparent',
          cursor: 'pointer',
        }"
        @click="activeTab = 'dados'"
      >
        Meus Dados
      </button>
    </div>

    <!-- Mobile Tab Bar -->
    <div
      class="flex md:hidden flex-col mb-8"
      :style="{ borderLeft: '2px solid var(--border)' }"
    >
      <button
        class="py-3 pl-4 transition-all text-left"
        :style="{
          color: activeTab === 'documentos' ? 'var(--primary)' : 'var(--muted-foreground)',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--text-sm)',
          background: 'none',
          border: 'none',
          borderLeft: activeTab === 'documentos' ? '2px solid var(--primary)' : '2px solid transparent',
          marginLeft: '-2px',
          cursor: 'pointer',
        }"
        @click="activeTab = 'documentos'"
      >
        Meus Documentos
      </button>
      <button
        class="py-3 pl-4 transition-all text-left"
        :style="{
          color: activeTab === 'dados' ? 'var(--primary)' : 'var(--muted-foreground)',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--text-sm)',
          background: 'none',
          border: 'none',
          borderLeft: activeTab === 'dados' ? '2px solid var(--primary)' : '2px solid transparent',
          marginLeft: '-2px',
          cursor: 'pointer',
        }"
        @click="activeTab = 'dados'"
      >
        Meus Dados
      </button>
    </div>

    <!-- TAB: Dados -->
    <div v-if="activeTab === 'dados'" class="space-y-6">
      <!-- Section 1: Dados Pessoais -->
      <section :style="dataSectionStyle">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="flex items-center justify-center"
            :style="{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              flexShrink: 0,
            }"
          >1</span>
          <h3 :style="{ color: 'var(--foreground)', fontSize: '16px', margin: 0 }">Dados Pessoais</h3>
        </div>

        <div class="space-y-6">
          <!-- TODO Fase 4: validation -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Nome Completo">
              <UInput v-model="nomeCompleto" class="w-full" />
            </UFormField>
            <UFormField label="Nome Social">
              <UInput v-model="nomeSocial" class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="CPF">
              <UInput v-model="cpf" class="w-full" />
            </UFormField>
            <UFormField label="Data de Nascimento">
              <UInput v-model="dataNascimento" type="date" class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="E-mail">
              <UInput v-model="email" type="email" class="w-full" />
            </UFormField>
            <UFormField label="Celular">
              <UInput v-model="celular" type="tel" class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Gênero">
              <UInput v-model="genero" class="w-full" />
            </UFormField>
            <UFormField label="Etnia">
              <USelectMenu v-model="selectedEthnicity" :items="ethnicities" class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Lattes">
              <UInput v-model="lattes" type="url" class="w-full" />
            </UFormField>
            <UFormField label="Nível Acadêmico">
              <USelectMenu v-model="selectedAcademicLevel" :items="academicLevels" class="w-full" />
            </UFormField>
          </div>
        </div>
      </section>

      <!-- Section 2: Endereço Residencial -->
      <section :style="dataSectionStyle">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="flex items-center justify-center"
            :style="{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              flexShrink: 0,
            }"
          >2</span>
          <h3 :style="{ color: 'var(--foreground)', fontSize: '16px', margin: 0 }">Endereço Residencial</h3>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UFormField label="Rua">
              <UInput v-model="rua" class="w-full" />
            </UFormField>
            <UFormField label="Número">
              <UInput v-model="numero" class="w-full" />
            </UFormField>
            <UFormField label="Complemento">
              <UInput v-model="complemento" class="w-full" />
            </UFormField>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UFormField label="CEP">
              <UInput v-model="cep" class="w-full" />
            </UFormField>
            <UFormField label="Bairro">
              <UInput v-model="bairro" class="w-full" />
            </UFormField>
            <UFormField label="Município">
              <UInput v-model="municipio" class="w-full" />
            </UFormField>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Estado">
              <UInput v-model="estado" class="w-full" />
            </UFormField>
            <UFormField label="País">
              <UInput v-model="pais" class="w-full" />
            </UFormField>
          </div>
        </div>
      </section>

      <!-- Section 3: Dados Bancários -->
      <section :style="dataSectionStyle">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="flex items-center justify-center"
            :style="{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              flexShrink: 0,
            }"
          >3</span>
          <h3 :style="{ color: 'var(--foreground)', fontSize: '16px', margin: 0 }">Dados Bancários</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UFormField label="Banco">
            <UInput v-model="banco" readonly class="w-full" />
          </UFormField>
          <UFormField label="Agência">
            <UInput v-model="agencia" class="w-full" />
          </UFormField>
          <UFormField label="Conta">
            <UInput v-model="conta" class="w-full" />
          </UFormField>
        </div>
      </section>

      <!-- Save button -->
      <div class="flex justify-end">
        <UButton icon="i-lucide-save" color="primary" @click="saveChanges">
          Salvar Alterações
        </UButton>
      </div>
    </div>

    <!-- TAB: Documentos -->
    <div v-if="activeTab === 'documentos'">
      <section>
        <div class="flex items-center gap-3 mb-2">
          <div
            class="p-2 transition-colors"
            :style="{
              color: 'var(--primary)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(8, 145, 178, 0.1)',
            }"
          >
            <UIcon name="i-lucide-file-text" class="w-5 h-5" />
          </div>
          <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Documentos Solicitados</h3>
        </div>

        <p
          class="mb-8"
          :style="{
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            marginLeft: 'calc(32px + 0.75rem)',
          }"
        >
          Clique na linha para mais detalhes. O Comprovante de Residência é válido por 3 meses.
        </p>

        <!-- BPIG-II header -->
        <div class="mb-4 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Bolsa: BPIG-II</h3>
            <span
              class="inline-flex items-center px-2.5 py-1"
              :style="{
                borderRadius: '9999px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: 'rgb(34, 197, 94)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }"
            >
              Em Andamento
            </span>
          </div>
          <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }">
            Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
          </p>
        </div>

        <!-- Desktop cards -->
        <div class="hidden md:grid md:grid-cols-1 gap-4">
          <template v-for="(doc, index) in documents" :key="doc.id">
            <!-- Collapsed BPIG-I trigger card -->
            <button
              v-if="index === 4 && !expandedCanceledScholarship"
              type="button"
              class="w-full p-5 text-left"
              :style="{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                marginTop: '1.5rem',
              }"
              @click="expandedCanceledScholarship = true"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Bolsa: BPIG-I</h3>
                    <span
                      class="inline-flex items-center px-2.5 py-1"
                      :style="{
                        borderRadius: '9999px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'rgb(239, 68, 68)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                      }"
                    >
                      Cancelada
                    </span>
                  </div>
                  <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }">
                    Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
                  </p>
                </div>
                <UIcon name="i-lucide-chevron-down" :style="{ color: 'var(--muted-foreground)' }" />
              </div>
            </button>

            <!-- Doc card (visible when not collapsed) -->
            <div v-else-if="index < 4 || expandedCanceledScholarship">
              <!-- BPIG-I expanded header (right before index 4) -->
              <template v-if="index === 4">
                <div :style="{ height: '1px', backgroundColor: 'var(--border)', margin: '1.5rem 0' }" />
                <div class="flex flex-col gap-3 mb-4">
                  <button
                    type="button"
                    class="flex items-center justify-between gap-3 w-full text-left"
                    :style="{ backgroundColor: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }"
                    @click="expandedCanceledScholarship = false"
                  >
                    <div class="flex items-center gap-2">
                      <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Bolsa: BPIG-I</h3>
                      <span
                        class="inline-flex items-center px-2.5 py-1"
                        :style="{
                          borderRadius: '9999px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: 'rgb(239, 68, 68)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                        }"
                      >
                        Cancelada
                      </span>
                    </div>
                    <UIcon
                      name="i-lucide-chevron-down"
                      :style="{ color: 'var(--muted-foreground)', transform: 'rotate(180deg)' }"
                    />
                  </button>
                  <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }">
                    Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
                  </p>
                </div>
              </template>

              <div
                class="overflow-hidden"
                :style="{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }"
              >
                <!-- Card header -->
                <div
                  class="p-5"
                  :style="{ cursor: 'pointer' }"
                  @click="toggleExpand(doc.id, doc.status)"
                >
                  <div class="grid grid-cols-12 gap-4 items-center">
                    <div class="col-span-1 flex items-center">
                      <UIcon
                        name="i-lucide-chevron-down"
                        :style="{
                          color: 'var(--muted-foreground)',
                          transform: expandedDocId === doc.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }"
                      />
                    </div>
                    <div class="col-span-3" :style="{ marginLeft: '-1rem' }">
                      <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                        Requisito
                      </div>
                      <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">
                        {{ doc.requisito }}
                      </div>
                    </div>
                    <div class="col-span-4" :style="{ marginLeft: '2.5rem' }">
                      <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                        Documento
                      </div>
                      <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', wordBreak: 'break-word' }">
                        {{ doc.documento }}
                      </div>
                    </div>
                    <div class="col-span-2" :style="{ marginLeft: '2.5rem' }">
                      <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                        Data de Envio
                      </div>
                      <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                        {{ doc.dataEnvio }}
                      </div>
                    </div>
                    <div class="col-span-2" :style="{ marginLeft: '2.5rem' }">
                      <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                        Status
                      </div>
                      <span
                        class="inline-flex items-center px-2.5 py-1"
                        :style="{
                          backgroundColor: getStatusColor(doc.status).bg,
                          color: getStatusColor(doc.status).color,
                          border: `1px solid ${getStatusColor(doc.status).border}`,
                          borderRadius: '9999px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                        }"
                      >
                        {{ doc.status }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Expanded area -->
                <div
                  v-if="expandedDocId === doc.id"
                  class="px-5 pb-5"
                  :style="{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }"
                >
                  <!-- TODO Fase 4: Termo de Responsabilidade form (doc.id === 204) -->
                  <div v-if="doc.id === 204">
                    <!-- TODO Fase 4: Termo de Responsabilidade modal/form -->
                    <div v-if="!termoSigned">
                      <p :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 1.5rem 0' }">
                        Para dar continuidade ao processo de solicitação de bolsa, preencha os campos abaixo para aceitar o Termo de Responsabilidade:
                      </p>
                      <div
                        :style="{
                          backgroundColor: 'var(--muted)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          marginBottom: '1.5rem',
                          overflow: 'hidden',
                        }"
                      >
                        <div :style="{ padding: '1rem' }">
                          <p :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }">
                            Recebe outra bolsa?
                          </p>
                          <div class="flex gap-6">
                            <label v-for="val in (['sim','nao'] as const)" :key="val" class="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="termo-q1"
                                :value="val"
                                :checked="termoQ1 === val"
                                @change="termoQ1 = val"
                              />
                              <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                                {{ val === 'sim' ? 'Sim' : 'Não' }}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div :style="{ height: '1px', backgroundColor: 'var(--border)' }" />
                        <div :style="{ padding: '1rem' }">
                          <p :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }">
                            Possui vínculo de parentesco, consanguinidade ou afim, em linha reta ou colateral, até terceiro grau com o coordenador do projeto e com o orientador ou supervisor?
                          </p>
                          <div class="flex gap-6">
                            <label v-for="val in (['sim','nao'] as const)" :key="val" class="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="termo-q2"
                                :value="val"
                                :checked="termoQ2 === val"
                                @change="termoQ2 = val"
                              />
                              <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                                {{ val === 'sim' ? 'Sim' : 'Não' }}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div :style="{ height: '1px', backgroundColor: 'var(--border)' }" />
                        <div :style="{ padding: '1rem' }">
                          <p :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', margin: '0 0 0.75rem 0' }">
                            Exerce atividade remunerada de qualquer natureza, laboral ou não, em caráter eventual ou não?
                          </p>
                          <div class="flex gap-6">
                            <label v-for="val in (['sim','nao'] as const)" :key="val" class="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="termo-q3"
                                :value="val"
                                :checked="termoQ3 === val"
                                @change="termoQ3 = val"
                              />
                              <span :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                                {{ val === 'sim' ? 'Sim' : 'Não' }}
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <!-- TODO Fase 4: termo PDF preview images (figma assets omitidos) -->
                      <div
                        v-if="termoQ1 && termoQ2 && termoQ3"
                        class="flex justify-end"
                      >
                        <UButton color="primary" @click="signTermo">Assinar</UButton>
                      </div>
                    </div>
                    <div v-else class="flex flex-col gap-4">
                      <div
                        class="flex items-center gap-3 p-4"
                        :style="{
                          backgroundColor: 'rgba(34, 197, 94, 0.08)',
                          border: '1px solid rgba(34, 197, 94, 0.25)',
                          borderRadius: 'var(--radius)',
                        }"
                      >
                        <UIcon name="i-lucide-check-circle-2" :style="{ color: 'rgb(34,197,94)' }" />
                        <p :style="{ color: 'rgb(34, 197, 94)', fontSize: 'var(--text-sm)', margin: 0 }">
                          Termo de Responsabilidade assinado com sucesso. Aguardando validação da equipe.
                        </p>
                      </div>
                      <!-- TODO Fase 4: documento assinado (preview images) -->
                      <div
                        :style="{
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          padding: '1rem',
                          color: 'var(--muted-foreground)',
                          fontSize: 'var(--text-sm)',
                        }"
                      >
                        <UIcon name="i-lucide-paperclip" class="mr-2" /> Documento assinado
                      </div>
                    </div>
                  </div>

                  <!-- Upload area (Pendente, not termo) -->
                  <div
                    v-if="doc.status === 'Pendente' && doc.id !== 204"
                    class="flex flex-col items-center justify-center py-8 px-4 transition-all"
                    :style="{
                      border: '2px dashed',
                      borderColor: dragActive === doc.id ? 'var(--primary)' : 'var(--border)',
                      borderRadius: 'var(--radius)',
                      backgroundColor: dragActive === doc.id ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
                      cursor: 'pointer',
                      minHeight: '200px',
                    }"
                    @dragenter="handleDragEnter($event, doc.id)"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop($event, doc.id)"
                  >
                    <UIcon name="i-lucide-upload" class="mb-4 w-8 h-8" :style="{ color: 'var(--muted-foreground)' }" />
                    <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }">
                      Arraste e solte o arquivo aqui ou
                    </p>
                    <label
                      class="inline-flex items-center gap-2 px-4 py-2 cursor-pointer"
                      :style="{
                        backgroundColor: 'transparent',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-sm)',
                      }"
                    >
                      <UIcon name="i-lucide-paperclip" />
                      Anexar Arquivo
                      <input
                        type="file"
                        class="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        @change="handleFileSelect($event, doc.id)"
                      />
                    </label>
                  </div>

                  <!-- Em Validação / Validado preview -->
                  <div
                    v-if="(doc.status === 'Em Validação' || doc.status === 'Validado') && doc.id !== 204"
                    class="flex gap-4"
                  >
                    <!-- Figma asset placeholder -->
                    <div
                      :style="{
                        flex: '0 0 200px',
                        height: '140px',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--muted-foreground)',
                        fontSize: 'var(--text-xs)',
                      }"
                    >
                      <!-- TODO Fase 4: imagem do documento (figma asset) -->
                      Preview
                    </div>
                    <div class="flex-1">
                      <div :style="{ marginBottom: '1rem' }">
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                          Nome do arquivo
                        </div>
                        <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                          {{ doc.documento }}.pdf
                        </div>
                      </div>
                      <div :style="{ marginBottom: '1rem' }">
                        <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.5rem' }">
                          Data de envio
                        </div>
                        <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                          {{ doc.dataEnvio }}
                        </div>
                      </div>
                      <div
                        v-if="doc.status === 'Em Validação'"
                        class="flex items-center gap-2 px-3 py-2"
                        :style="{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: 'var(--radius)',
                          marginTop: '1rem',
                        }"
                      >
                        <div :style="{ color: 'rgb(59, 130, 246)', fontSize: 'var(--text-sm)' }">
                          Documento em validação pela equipe
                        </div>
                      </div>
                      <UButton
                        v-if="doc.status === 'Validado' && !deletedDocuments.includes(doc.id)"
                        icon="i-lucide-trash-2"
                        color="error"
                        variant="ghost"
                        size="sm"
                        class="mt-2"
                        @click="handleDeleteDocument(doc.id)"
                      >
                        Excluir Documento
                      </UButton>
                    </div>
                  </div>

                  <!-- Reprovado -->
                  <div v-if="doc.status === 'Reprovado'">
                    <div
                      class="mb-5 p-4"
                      :style="{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius)',
                      }"
                    >
                      <p :style="{ color: '#ef4444', fontSize: 'var(--text-sm)', margin: 0 }">
                        O documento enviado não foi aprovado. Por favor, verifique e envie um novo documento válido.
                      </p>
                    </div>
                    <div
                      class="flex flex-col items-center justify-center py-8 px-4 mb-5"
                      :style="{
                        border: '2px dashed',
                        borderColor: dragActive === doc.id ? 'var(--primary)' : 'var(--border)',
                        borderRadius: 'var(--radius)',
                        backgroundColor: dragActive === doc.id ? 'rgba(8, 145, 178, 0.05)' : 'var(--card)',
                        minHeight: '200px',
                      }"
                      @dragenter="handleDragEnter($event, doc.id)"
                      @dragover="handleDragOver"
                      @dragleave="handleDragLeave"
                      @drop="handleDrop($event, doc.id)"
                    >
                      <UIcon name="i-lucide-upload" class="mb-4 w-8 h-8" :style="{ color: 'var(--muted-foreground)' }" />
                      <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }">
                        Arraste e solte o arquivo aqui ou
                      </p>
                      <label
                        class="inline-flex items-center gap-2 px-4 py-2 cursor-pointer"
                        :style="{
                          backgroundColor: 'transparent',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          fontSize: 'var(--text-sm)',
                        }"
                      >
                        <UIcon name="i-lucide-paperclip" />
                        Anexar Arquivo
                        <input
                          type="file"
                          class="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          @change="handleFileSelect($event, doc.id)"
                        />
                      </label>
                    </div>
                    <div v-if="!deletedDocuments.includes(doc.id)">
                      <div class="mb-5" :style="{ height: '1px', backgroundColor: 'var(--border)' }" />
                      <!-- TODO Fase 4: imagem CNIS reprovado (figma asset) -->
                      <div
                        :style="{
                          height: '120px',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--muted-foreground)',
                          fontSize: 'var(--text-xs)',
                        }"
                      >
                        Documento reprovado (preview)
                      </div>
                      <UButton
                        icon="i-lucide-trash-2"
                        color="error"
                        variant="ghost"
                        size="sm"
                        class="mt-4"
                        @click="handleDeleteDocument(doc.id)"
                      >
                        Excluir documento reprovado
                      </UButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Mobile cards (structural, simplified) -->
        <div class="md:hidden space-y-4">
          <div class="flex flex-col gap-3 mb-2">
            <div class="flex items-center gap-2">
              <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Bolsa: BPIG-II</h3>
              <span
                class="inline-flex items-center px-2.5 py-1"
                :style="{
                  borderRadius: '9999px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: 'rgb(34, 197, 94)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }"
              >
                Em Andamento
              </span>
            </div>
            <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }">
              Projeto: ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação
            </p>
          </div>

          <template v-for="(doc, index) in documents" :key="`m-${doc.id}`">
            <button
              v-if="index === 4 && !expandedCanceledScholarship"
              type="button"
              class="w-full p-4 text-left"
              :style="{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                marginTop: '2rem',
              }"
              @click="expandedCanceledScholarship = true"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 :style="{ color: 'var(--foreground)', margin: 0 }">Bolsa: BPIG-I</h3>
                    <span
                      class="inline-flex items-center px-2.5 py-1"
                      :style="{
                        borderRadius: '9999px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'rgb(239, 68, 68)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                      }"
                    >
                      Cancelada
                    </span>
                  </div>
                  <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }">
                    Projeto: ConectaFapes
                  </p>
                </div>
                <UIcon name="i-lucide-chevron-down" :style="{ color: 'var(--muted-foreground)' }" />
              </div>
            </button>

            <div
              v-else-if="index < 4 || expandedCanceledScholarship"
              class="overflow-hidden"
              :style="{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                marginTop: index === 4 ? '2rem' : '0',
              }"
            >
              <div
                class="p-4"
                :style="{ cursor: 'pointer' }"
                @click="toggleExpand(doc.id, doc.status)"
              >
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-start gap-2">
                    <UIcon
                      name="i-lucide-chevron-down"
                      class="mt-1"
                      :style="{
                        color: 'var(--muted-foreground)',
                        transform: expandedDocId === doc.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      }"
                    />
                    <div>
                      <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                        Requisito
                      </div>
                      <div :style="{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }">
                        {{ doc.requisito }}
                      </div>
                    </div>
                  </div>
                  <span
                    class="inline-flex items-center px-2 py-0.5"
                    :style="{
                      backgroundColor: getStatusColor(doc.status).bg,
                      color: getStatusColor(doc.status).color,
                      border: `1px solid ${getStatusColor(doc.status).border}`,
                      borderRadius: '9999px',
                      fontSize: 'var(--text-xs)',
                    }"
                  >
                    {{ doc.status }}
                  </span>
                </div>
                <div class="mb-3 ml-6">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Documento
                  </div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                    {{ doc.documento }}
                  </div>
                </div>
                <div class="ml-6">
                  <div :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }">
                    Data de Envio
                  </div>
                  <div :style="{ color: 'var(--foreground)', fontSize: 'var(--text-sm)' }">
                    {{ doc.dataEnvio }}
                  </div>
                </div>
              </div>

              <!-- TODO Fase 4: detalhes expandidos mobile (replicar desktop) -->
              <div
                v-if="expandedDocId === doc.id"
                class="px-5 pb-5"
                :style="{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }"
              >
                <p :style="{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }">
                  Detalhes do documento. Status atual: {{ doc.status }}.
                </p>
              </div>
            </div>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>
