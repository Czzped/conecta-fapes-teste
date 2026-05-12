<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// TODO Fase 4: VeeValidate + Zod
const router = useRouter()
const { t: _t } = useI18n()

const objectiveOptions = [
  { value: 'sim-totalmente', label: 'Sim, totalmente' },
  { value: 'sim-parcialmente', label: 'Sim, parcialmente' },
  { value: 'nao', label: 'Não' },
]

const palavrasChave = ref('')
const resumoPublicacao = ref('')
const introducao = ref('')
const objetivosPropostos = ref('')
const metodologia = ref('')
const selectedObjective = ref<string>('')
const justifique = ref('')
const parcerias = ref('')
const dificuldades = ref('')
const conclusoes = ref('')
const publicoAlvo = ref('')
const numeroPessoas = ref('')

const inovacaoTecnologica = ref<string>('')
const repassadoTerceiros = ref<string>('')
const protecao = ref<string>('')
const ensinoPesquisaExtensao = ref<string>('')
const sociedadeCivil = ref<string>('')

function wordCount(v: string): number {
  return v.trim() ? v.trim().split(/\s+/).length : 0
}
const resumoCount = computed(() => wordCount(resumoPublicacao.value))
const introducaoCount = computed(() => wordCount(introducao.value))
const objetivosCount = computed(() => wordCount(objetivosPropostos.value))
const metodologiaCount = computed(() => wordCount(metodologia.value))
const justifiqueCount = computed(() => wordCount(justifique.value))
const parceriasCount = computed(() => wordCount(parcerias.value))
const dificuldadesCount = computed(() => wordCount(dificuldades.value))
const conclusoesCount = computed(() => wordCount(conclusoes.value))
const publicoCount = computed(() => wordCount(publicoAlvo.value))

const yesNo = [
  { label: 'Sim', value: 'sim' },
  { label: 'Não', value: 'nao' },
]

function onSaveDraft() {
  // TODO Fase 4
}
function onSubmit() {
  // TODO Fase 4
  router.push('/')
}
function onAttach() {
  // TODO Fase 4
}
</script>

<template>
  <div class="w-full px-4 md:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-2">
      <div
        class="p-2 transition-colors"
        :style="{
          color: 'var(--primary)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'rgba(8, 145, 178, 0.1)',
        }"
      >
        <UIcon name="i-lucide-file-text" class="size-5" />
      </div>
      <h1 :style="{ color: 'var(--foreground)', margin: 0 }">
        Prestação de Contas Técnica
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
      Este relatório técnico deve informar os resultados do projeto, metas alcançadas e atividades cumpridas.
    </p>

    <USeparator class="mb-8" />

    <!-- Form -->
    <div :style="{ display: 'flex', flexDirection: 'column', gap: '2rem' }">
      <!-- Palavras-chave -->
      <UFormField required>
        <template #label>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }">
            Palavras-chave <span :style="{ color: '#fb2c36' }">*</span>
          </span>
        </template>
        <template #description>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
            Indique de três a cinco palavras-chave que identificam a pesquisa
          </span>
        </template>
        <UInput
          v-model="palavrasChave"
          placeholder="Ex: Educação, Tecnologia, Inovação"
          class="w-full"
        />
      </UFormField>

      <!-- Resumo para Publicação -->
      <UFormField required>
        <template #label>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }">
            Resumo para Publicação no site da Fapes <span :style="{ color: '#fb2c36' }">*</span>
          </span>
        </template>
        <template #description>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
            Descreva de forma objetiva, com mínimo de 250 e máximo de 500 palavras.
          </span>
        </template>
        <UTextarea
          v-model="resumoPublicacao"
          placeholder="Digite aqui"
          :rows="6"
          class="w-full"
        />
        <template #help>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
            Máximo de 500 palavras ({{ resumoCount }}/500)
          </span>
        </template>
      </UFormField>

      <!-- Descrição do Projeto -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '1rem' }">
        <h2
          :style="{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--foreground)',
          }"
        >
          Descrição do Projeto <span :style="{ color: '#fb2c36' }">*</span>
        </h2>

        <UFormField label="Introdução">
          <UTextarea
            v-model="introducao"
            placeholder="Digite aqui"
            :rows="6"
            class="w-full"
          />
          <template #help>
            <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
              Máximo de 2.000 palavras ({{ introducaoCount }}/2000)
            </span>
          </template>
        </UFormField>

        <UFormField label="Objetivos Propostos">
          <UTextarea
            v-model="objetivosPropostos"
            placeholder="Digite aqui"
            :rows="6"
            class="w-full"
          />
          <template #help>
            <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
              Máximo de 500 palavras ({{ objetivosCount }}/500)
            </span>
          </template>
        </UFormField>

        <UFormField label="Metodologia">
          <UTextarea
            v-model="metodologia"
            placeholder="Digite aqui"
            :rows="6"
            class="w-full"
          />
          <template #help>
            <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
              Máximo de 500 palavras ({{ metodologiaCount }}/500)
            </span>
          </template>
        </UFormField>
      </div>

      <!-- Objetivos Alcançados -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '1rem' }">
        <h2
          :style="{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--foreground)',
          }"
        >
          Objetivos Alcançados
        </h2>

        <UFormField label="Até o momento, os objetivos da pesquisa foram atingidos?">
          <USelectMenu
            v-model="selectedObjective"
            :items="objectiveOptions"
            value-key="value"
            placeholder="Selecione uma opção"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Justifique">
          <UTextarea
            v-model="justifique"
            placeholder="Digite aqui"
            :rows="6"
            class="w-full"
          />
          <template #help>
            <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
              Máximo de 250 palavras ({{ justifiqueCount }}/250)
            </span>
          </template>
        </UFormField>
      </div>

      <USeparator />

      <!-- Parcerias Institucionais -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '1rem' }">
        <h2
          :style="{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--foreground)',
          }"
        >
          Parcerias Institucionais
        </h2>
        <p :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
          Indicar as instituições de P&D, empresas, órgãos públicos e não governamentais ou sociedade civil que foram parceiras durante a execução da pesquisa, mostrando articulação institucional vivenciada pela pesquisa.
        </p>
        <UTextarea
          v-model="parcerias"
          placeholder="Digite aqui"
          :rows="6"
          class="w-full"
        />
        <p :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
          {{ parceriasCount }}/500 palavras
        </p>
      </div>

      <!-- Dificuldades -->
      <UFormField required>
        <template #label>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }">
            Dificuldades encontradas e sugestões <span :style="{ color: '#fb2c36' }">*</span>
          </span>
        </template>
        <template #description>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
            Descreva dificuldades de caráter técnico-científico, financeiro, administrativo e gerencial, enfrentadas durante a realização da pesquisa.
          </span>
        </template>
        <UTextarea
          v-model="dificuldades"
          placeholder="Digite aqui"
          :rows="6"
          class="w-full"
        />
        <template #help>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
            {{ dificuldadesCount }}/250 palavras
          </span>
        </template>
      </UFormField>

      <!-- Conclusões e Perspectivas -->
      <UFormField required>
        <template #label>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }">
            Conclusões e Perspectivas <span :style="{ color: '#fb2c36' }">*</span>
          </span>
        </template>
        <template #description>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
            Descreva as conclusões do projeto e apresente perspectivas de trabalhos futuros que poderão ser financiados.
          </span>
        </template>
        <UTextarea
          v-model="conclusoes"
          placeholder="Digite aqui"
          :rows="6"
          class="w-full"
        />
        <template #help>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
            {{ conclusoesCount }}/1000 palavras
          </span>
        </template>
      </UFormField>

      <USeparator />

      <!-- Avaliação Geral -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }">
        <h2
          :style="{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--foreground)',
          }"
        >
          Avaliação Geral <span :style="{ color: '#fb2c36' }">*</span>
        </h2>

        <UFormField label="O resultado do projeto tem inovação tecnológica?">
          <URadioGroup v-model="inovacaoTecnologica" :items="yesNo" orientation="horizontal" />
        </UFormField>

        <UFormField label="O resultado do projeto (tecnologia gerada) pode ser repassado a terceiros?">
          <URadioGroup v-model="repassadoTerceiros" :items="yesNo" orientation="horizontal" />
        </UFormField>

        <UFormField label="O resultado do projeto é passível de proteção (patentes, cultivares, direitos autorais ou softwares)?">
          <URadioGroup v-model="protecao" :items="yesNo" orientation="horizontal" />
        </UFormField>

        <UFormField label="Houve relação de pesquisa com atividades de ensino e de extensão na sua instituição (Ensino, Pesquisa e Extensão)?">
          <URadioGroup v-model="ensinoPesquisaExtensao" :items="yesNo" orientation="horizontal" />
        </UFormField>

        <UFormField label="Houve durante a execução da pesquisa momentos de interação e integração com a sociedade civil?">
          <URadioGroup v-model="sociedadeCivil" :items="yesNo" orientation="horizontal" />
        </UFormField>
      </div>

      <!-- Público-alvo -->
      <UFormField label="Descreva o público-alvo que pode se beneficiar com os resultados da pesquisa.">
        <UTextarea
          v-model="publicoAlvo"
          placeholder="Digite aqui"
          :rows="6"
          class="w-full"
        />
        <template #help>
          <span :style="{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }">
            {{ publicoCount }}/500 palavras
          </span>
        </template>
      </UFormField>

      <!-- Número estimado de pessoas -->
      <UFormField label="Qual o número estimado de pessoas que podem se beneficiar com os resultados da pesquisa?">
        <UInput
          v-model="numeroPessoas"
          placeholder="000000"
          :style="{ maxWidth: '200px' }"
        />
      </UFormField>

      <USeparator />

      <!-- Inclusão de Arquivos -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
        <h2
          :style="{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--foreground)',
            marginBottom: '0.25rem',
          }"
        >
          Inclusão de Arquivos
        </h2>
        <p
          :style="{
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            marginBottom: '0.5rem',
          }"
        >
          Incluir documentos ou imagens relevantes para documentar o projeto
        </p>
        <UButton
          icon="i-lucide-paperclip"
          variant="outline"
          color="neutral"
          class="self-end"
          @click="onAttach"
        >
          Anexar Comprovação
        </UButton>
      </div>

      <USeparator />

      <!-- Action Buttons -->
      <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }">
        <UButton variant="outline" color="primary" @click="onSaveDraft">
          Salvar Rascunho
        </UButton>
        <UButton color="primary" icon="i-lucide-send" trailing @click="onSubmit">
          Enviar
        </UButton>
      </div>
    </div>
  </div>
</template>
