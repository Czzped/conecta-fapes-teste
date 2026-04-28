import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, BookOpen, CheckCircle2, Copy, Eye, FileJson, FilePlus2, PlayCircle, Save, Search, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Model } from 'survey-core';
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react';
import { Survey } from 'survey-react-ui';
import type { ICreatorOptions } from 'survey-creator-core';
import type { ITheme } from 'survey-core';
import 'survey-core/survey-core.css';
import 'survey-creator-core/survey-creator-core.css';

interface SurveyFormBuilderProps {
  onBack: () => void;
}

interface StoredForm {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Rascunho' | 'Publicado';
  version: number;
  updatedAt: string;
  json: Record<string, unknown>;
}

type ViewMode = 'list' | 'builder' | 'usage';

const STORAGE_KEY = 'conecta-fapes-surveyjs-forms';

const defaultSurveyJson = {
  title: 'Novo formulario',
  description: 'Defina as secoes, campos e regras deste formulario.',
  pages: [
    {
      name: 'dados_gerais',
      title: 'Dados gerais',
      elements: [
        {
          type: 'text',
          name: 'titulo_proposta',
          title: 'Titulo da proposta',
          isRequired: true,
        },
      ],
    },
  ],
};

const creatorOptions: ICreatorOptions = {
  autoSaveEnabled: true,
  collapseOnDrag: true,
  showLogicTab: true,
  showTranslationTab: false,
  showThemeTab: true,
};

const conectaSurveyTheme: ITheme = {
  themeName: 'conecta-fapes',
  colorPalette: 'dark',
  isPanelless: false,
  cssVariables: {
    '--sjs-general-backcolor': '#111c30',
    '--sjs-general-backcolor-dark': '#0f172a',
    '--sjs-general-backcolor-dim': '#0b1222',
    '--sjs-general-backcolor-dim-light': '#17233a',
    '--sjs-general-backcolor-dim-dark': '#08101f',
    '--sjs-general-forecolor': '#ffffff',
    '--sjs-general-forecolor-light': 'rgba(255, 255, 255, 0.66)',
    '--sjs-general-dim-forecolor': '#ffffff',
    '--sjs-general-dim-forecolor-light': 'rgba(255, 255, 255, 0.56)',
    '--sjs-primary-backcolor': '#00c1af',
    '--sjs-primary-backcolor-light': 'rgba(0, 193, 175, 0.14)',
    '--sjs-primary-backcolor-dark': '#00a99a',
    '--sjs-primary-forecolor': '#0b1222',
    '--sjs-primary-forecolor-light': '#0b1222',
    '--sjs-secondary-backcolor': '#4f6fce',
    '--sjs-secondary-backcolor-light': 'rgba(79, 111, 206, 0.18)',
    '--sjs-secondary-backcolor-semi-light': 'rgba(79, 111, 206, 0.28)',
    '--sjs-secondary-forecolor': '#ffffff',
    '--sjs-border-light': 'rgba(255, 255, 255, 0.10)',
    '--sjs-border-default': 'rgba(255, 255, 255, 0.16)',
    '--sjs-border-inside': 'rgba(255, 255, 255, 0.08)',
    '--sjs-corner-radius': '6px',
    '--sjs-base-unit': '8px',
    '--sjs-font-family': 'var(--font-family)',
    '--sjs-shadow-small': '0 1px 3px rgba(0, 0, 0, 0.18)',
    '--sjs-shadow-medium': '0 10px 28px rgba(0, 0, 0, 0.22)',
    '--sjs-shadow-large': '0 18px 48px rgba(0, 0, 0, 0.30)',
    '--sjs-special-red': '#ef4444',
    '--sjs-special-red-light': 'rgba(239, 68, 68, 0.14)',
    '--sjs-special-green': '#00c1af',
    '--sjs-special-green-light': 'rgba(0, 193, 175, 0.14)',
    '--sjs-special-blue': '#3b82f6',
    '--sjs-special-blue-light': 'rgba(59, 130, 246, 0.15)',
    '--sjs-special-yellow': '#f59e0b',
    '--sjs-special-yellow-light': 'rgba(245, 158, 11, 0.16)',
    '--sjs-questionpanel-backcolor': 'rgba(30, 41, 59, 0.78)',
    '--sjs-questionpanel-hovercolor': 'rgba(255, 255, 255, 0.045)',
    '--sjs-editorpanel-backcolor': 'rgba(15, 23, 42, 0.82)',
    '--sjs-font-questiontitle-color': '#ffffff',
    '--sjs-font-questiondescription-color': 'rgba(255, 255, 255, 0.56)',
    '--sjs-font-editorfont-color': '#ffffff',
    '--sjs-font-editorfont-placeholdercolor': 'rgba(255, 255, 255, 0.38)',
  },
};

const conectaCreatorTheme = {
  themeName: 'conecta-fapes-creator',
  isLight: false,
  cssVariables: {
    '--ctr-font-family': 'var(--font-family)',
    '--ctr-list-item-background-color-selected': '#00c1af',
    '--ctr-list-item-text-color-selected': '#0b1222',
    '--ctr-list-item-icon-color-selected': '#0b1222',
    '--ctr-list-item-background-color-hovered': 'rgba(0, 193, 175, 0.12)',
    '--ctr-list-item-icon-color-hovered': '#00c1af',
    '--ctr-list-search-border-color': 'rgba(255, 255, 255, 0.12)',
    '--ctr-list-search-text-color': '#ffffff',
    '--ctr-list-search-text-color-placeholder': 'rgba(255, 255, 255, 0.42)',
    '--ctr-separator-color': 'rgba(255, 255, 255, 0.10)',
    '--ctr-survey-contextual-button-background-color': '#111c30',
    '--ctr-survey-contextual-button-icon-color': 'rgba(255, 255, 255, 0.66)',
    '--ctr-survey-contextual-button-icon-color-positive': '#00c1af',
    '--ctr-survey-contextual-button-icon-color-negative': '#ef4444',
  },
};

const makeId = () => `FORM-${Date.now().toString(36).toUpperCase()}`;

const readForms = (): StoredForm[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeForms = (forms: StoredForm[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
};

const createInitialForm = (): StoredForm => ({
  id: makeId(),
  name: 'Formulario de Submissao',
  description: 'Formulario base para captacao de iniciativas.',
  category: 'Submissao',
  status: 'Rascunho',
  version: 1,
  updatedAt: new Date().toISOString(),
  json: defaultSurveyJson,
});

const weightedEvaluationJson = {
  title: 'Avaliacao Ponderada de Proposta',
  description: 'Informe a nota e o peso de cada criterio. A nota final e calculada automaticamente.',
  pages: [
    {
      name: 'criterios_avaliacao',
      title: 'Criterios de avaliacao',
      description: 'Use pesos em percentual. A soma esperada dos pesos e 100.',
      elements: [
        {
          type: 'panel',
          name: 'aderencia_edital',
          title: 'Aderencia ao edital',
          elements: [
            {
              type: 'text',
              name: 'nota_aderencia',
              title: 'Nota',
              inputType: 'number',
              defaultValue: 0,
              isRequired: true,
              validators: [{ type: 'numeric', minValue: 0, maxValue: 10 }],
            },
            {
              type: 'text',
              name: 'peso_aderencia',
              title: 'Peso (%)',
              inputType: 'number',
              defaultValue: 30,
              isRequired: true,
              validators: [{ type: 'numeric', minValue: 0, maxValue: 100 }],
            },
            {
              type: 'comment',
              name: 'justificativa_aderencia',
              title: 'Justificativa',
            },
          ],
        },
        {
          type: 'panel',
          name: 'merito_tecnico',
          title: 'Merito tecnico-cientifico',
          elements: [
            {
              type: 'text',
              name: 'nota_merito',
              title: 'Nota',
              inputType: 'number',
              defaultValue: 0,
              isRequired: true,
              validators: [{ type: 'numeric', minValue: 0, maxValue: 10 }],
            },
            {
              type: 'text',
              name: 'peso_merito',
              title: 'Peso (%)',
              inputType: 'number',
              defaultValue: 25,
              isRequired: true,
              validators: [{ type: 'numeric', minValue: 0, maxValue: 100 }],
            },
            {
              type: 'comment',
              name: 'justificativa_merito',
              title: 'Justificativa',
            },
          ],
        },
        {
          type: 'panel',
          name: 'viabilidade_execucao',
          title: 'Viabilidade de execucao',
          elements: [
            {
              type: 'text',
              name: 'nota_viabilidade',
              title: 'Nota',
              inputType: 'number',
              defaultValue: 0,
              isRequired: true,
              validators: [{ type: 'numeric', minValue: 0, maxValue: 10 }],
            },
            {
              type: 'text',
              name: 'peso_viabilidade',
              title: 'Peso (%)',
              inputType: 'number',
              defaultValue: 25,
              isRequired: true,
              validators: [{ type: 'numeric', minValue: 0, maxValue: 100 }],
            },
            {
              type: 'comment',
              name: 'justificativa_viabilidade',
              title: 'Justificativa',
            },
          ],
        },
        {
          type: 'panel',
          name: 'impacto_resultados',
          title: 'Impacto e resultados esperados',
          elements: [
            {
              type: 'text',
              name: 'nota_impacto',
              title: 'Nota',
              inputType: 'number',
              defaultValue: 0,
              isRequired: true,
              validators: [{ type: 'numeric', minValue: 0, maxValue: 10 }],
            },
            {
              type: 'text',
              name: 'peso_impacto',
              title: 'Peso (%)',
              inputType: 'number',
              defaultValue: 20,
              isRequired: true,
              validators: [{ type: 'numeric', minValue: 0, maxValue: 100 }],
            },
            {
              type: 'comment',
              name: 'justificativa_impacto',
              title: 'Justificativa',
            },
          ],
        },
        {
          type: 'panel',
          name: 'resultado_calculado',
          title: 'Resultado calculado',
          elements: [
            {
              type: 'expression',
              name: 'soma_pesos',
              title: 'Soma dos pesos',
              expression: '{peso_aderencia} + {peso_merito} + {peso_viabilidade} + {peso_impacto}',
            },
            {
              type: 'expression',
              name: 'nota_final',
              title: 'Nota final ponderada',
              expression: '({nota_aderencia} * {peso_aderencia} + {nota_merito} * {peso_merito} + {nota_viabilidade} * {peso_viabilidade} + {nota_impacto} * {peso_impacto}) / 100',
            },
            {
              type: 'comment',
              name: 'parecer_final',
              title: 'Parecer final',
              isRequired: true,
            },
            {
              type: 'radiogroup',
              name: 'recomendacao',
              title: 'Recomendacao',
              isRequired: true,
              choices: ['Recomendar aprovacao', 'Recomendar ajustes', 'Nao recomendar aprovacao'],
            },
          ],
        },
      ],
    },
  ],
};

const createSeedForms = (): StoredForm[] => [
  {
    id: 'FORM-SUBMISSAO-2026-001',
    name: 'Formulario de Submissao',
    description: 'Formulario base para captacao de iniciativas.',
    category: 'Submissao',
    status: 'Rascunho',
    version: 1,
    updatedAt: '2026-04-20T13:35:00.000Z',
    json: defaultSurveyJson,
  },
  {
    id: 'FORM-AVALIACAO-2026-001',
    name: 'Avaliacao Ad Hoc',
    description: 'Parecer tecnico para revisores externos.',
    category: 'Avaliacao',
    status: 'Publicado',
    version: 3,
    updatedAt: '2026-04-18T17:20:00.000Z',
    json: {
      title: 'Avaliacao Ad Hoc',
      description: 'Formulario para analise de merito.',
      pages: [
        {
          name: 'parecer',
          title: 'Parecer do revisor',
          elements: [
            { type: 'rating', name: 'aderencia', title: 'Aderencia ao edital', rateMin: 1, rateMax: 5, isRequired: true },
            { type: 'comment', name: 'justificativa', title: 'Justificativa do parecer', isRequired: true },
          ],
        },
      ],
    },
  },
  {
    id: 'FORM-AVALIACAO-PESOS-2026-001',
    name: 'Avaliacao Ponderada de Proposta',
    description: 'Formulario de avaliacao com pesos por criterio e nota final calculada automaticamente.',
    category: 'Avaliacao',
    status: 'Publicado',
    version: 1,
    updatedAt: '2026-04-24T14:00:00.000Z',
    json: weightedEvaluationJson,
  },
  {
    id: 'FORM-RECURSO-2026-001',
    name: 'Pedido de Recurso',
    description: 'Solicitacao de reconsideracao de resultado.',
    category: 'Recurso',
    status: 'Publicado',
    version: 2,
    updatedAt: '2026-04-12T11:45:00.000Z',
    json: {
      title: 'Pedido de Recurso',
      pages: [
        {
          name: 'recurso',
          title: 'Dados do recurso',
          elements: [
            { type: 'text', name: 'numero_processo', title: 'Numero do processo', isRequired: true },
            { type: 'comment', name: 'argumentacao', title: 'Argumentacao', isRequired: true },
          ],
        },
      ],
    },
  },
  {
    id: 'FORM-PRESTACAO-2026-001',
    name: 'Prestacao de Contas Tecnica',
    description: 'Relatorio tecnico de acompanhamento e resultados.',
    category: 'Prestacao de contas',
    status: 'Rascunho',
    version: 1,
    updatedAt: '2026-04-08T20:10:00.000Z',
    json: {
      title: 'Prestacao de Contas Tecnica',
      pages: [
        {
          name: 'resultados',
          title: 'Resultados alcancados',
          elements: [
            { type: 'comment', name: 'resumo_resultados', title: 'Resumo dos resultados', isRequired: true },
            { type: 'file', name: 'anexos', title: 'Anexos comprobatorios' },
          ],
        },
      ],
    },
  },
];

const mergeSeedForms = (stored: StoredForm[]) => {
  const storedIds = new Set(stored.map((form) => form.id));
  const missingSeeds = createSeedForms().filter((form) => !storedIds.has(form.id));
  return [...stored, ...missingSeeds];
};

const initializeForms = () => {
  const stored = readForms();
  const forms = stored.length > 0 ? mergeSeedForms(stored) : createSeedForms();

  if (typeof window !== 'undefined' && forms.length !== stored.length) {
    writeForms(forms);
  }

  return forms;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const SurveyFormBuilder: React.FC<SurveyFormBuilderProps> = ({ onBack }) => {
  const [forms, setForms] = useState<StoredForm[]>(initializeForms);
  const [selectedId, setSelectedId] = useState(() => forms[0]?.id ?? '');
  const [showJson, setShowJson] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | StoredForm['status']>('Todos');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const selectedForm = forms.find((form) => form.id === selectedId) ?? forms[0];
  const metrics = useMemo(() => ({
    total: forms.length,
    published: forms.filter((form) => form.status === 'Publicado').length,
    drafts: forms.filter((form) => form.status === 'Rascunho').length,
    categories: new Set(forms.map((form) => form.category)).size,
  }), [forms]);
  const filteredForms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return forms.filter((form) => {
      const matchesStatus = statusFilter === 'Todos' || form.status === statusFilter;
      const matchesQuery =
        !query ||
        form.name.toLowerCase().includes(query) ||
        form.description.toLowerCase().includes(query) ||
        form.category.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [forms, searchTerm, statusFilter]);

  const creator = useMemo(() => {
    const model = new SurveyCreator(creatorOptions);
    model.applyTheme(conectaSurveyTheme);
    model.applyCreatorTheme(conectaCreatorTheme);
    return model;
  }, []);

  const persistForms = useCallback((updater: (current: StoredForm[]) => StoredForm[]) => {
    setForms((current) => {
      const next = updater(current);
      writeForms(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!selectedForm) return;
    creator.JSON = selectedForm.json;
  }, [creator, selectedForm?.id]);

  useEffect(() => {
    creator.saveSurveyFunc = (saveNo: number, callback: (num: number, status: boolean) => void) => {
      persistForms((current) =>
        current.map((form) =>
          form.id === selectedId
            ? {
                ...form,
                json: creator.JSON as Record<string, unknown>,
                updatedAt: new Date().toISOString(),
              }
            : form,
        ),
      );
      callback(saveNo, true);
    };
  }, [creator, persistForms, selectedId]);

  const updateSelected = (patch: Partial<StoredForm>) => {
    persistForms((current) =>
      current.map((form) =>
        form.id === selectedId
          ? {
              ...form,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : form,
      ),
    );
  };

  const createForm = () => {
    const form = createInitialForm();
    form.name = 'Novo formulario';
    persistForms((current) => [form, ...current]);
    setSelectedId(form.id);
    setViewMode('builder');
    toast.success('Formulario criado');
  };

  const openForm = (id: string) => {
    setSelectedId(id);
    setShowJson(false);
    setViewMode('builder');
  };

  const simulateForm = (id: string) => {
    setSelectedId(id);
    setShowJson(false);
    setViewMode('usage');
  };

  const duplicateForm = () => {
    if (!selectedForm) return;
    const duplicated: StoredForm = {
      ...selectedForm,
      id: makeId(),
      name: `${selectedForm.name} - copia`,
      status: 'Rascunho',
      version: selectedForm.version + 1,
      updatedAt: new Date().toISOString(),
      json: creator.JSON as Record<string, unknown>,
    };

    persistForms((current) => [duplicated, ...current]);
    setSelectedId(duplicated.id);
    toast.success('Versao em rascunho criada');
  };

  const saveDraft = () => {
    updateSelected({
      status: 'Rascunho',
      json: creator.JSON as Record<string, unknown>,
    });
    toast.success('Rascunho salvo');
  };

  const publishForm = () => {
    updateSelected({
      status: 'Publicado',
      json: creator.JSON as Record<string, unknown>,
    });
    toast.success('Formulario publicado');
  };

  const removeForm = () => {
    if (!selectedForm || forms.length <= 1) {
      toast.error('Mantenha ao menos um formulario na biblioteca');
      return;
    }

    const next = forms.filter((form) => form.id !== selectedForm.id);
    persistForms(() => next);
    setSelectedId(next[0].id);
    setViewMode('list');
    toast.success('Formulario removido');
  };

  if (!selectedForm) return null;

  if (viewMode === 'list') {
    return (
      <div className="survey-form-builder min-h-screen" style={{ backgroundColor: '#0f172a' }}>
        <div className="px-8 py-8">
          <div className="mb-6 flex items-start gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Voltar para configuracoes"
              className="flex h-9 w-9 items-center justify-center rounded-md"
              style={{ backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: 'rgba(0,193,175,0.15)' }}>
              <BookOpen size={18} style={{ color: '#00c1af' }} />
            </div>
            <div className="min-w-0 flex-1" style={{ marginTop: 4 }}>
              <h1 style={{ color: '#ffffff', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', margin: '0 0 8px', lineHeight: 1.5 }}>
                Formularios
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)', margin: 0, lineHeight: 1.5 }}>
                Gerencie formularios reutilizaveis de submissao, avaliacao, recurso, cadastro e prestacao de contas.
              </p>
            </div>
            <button type="button" onClick={createForm} className="survey-action-button primary">
              <FilePlus2 size={15} />
              Criar formulario
            </button>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '20px 0 28px' }} />

          <div className="mb-6 grid gap-4 lg:grid-cols-4">
            <MetricCard label="Total" value={String(metrics.total)} />
            <MetricCard label="Publicados" value={String(metrics.published)} />
            <MetricCard label="Rascunhos" value={String(metrics.drafts)} />
            <MetricCard label="Classificacoes" value={String(metrics.categories)} />
          </div>

          <section className="rounded-lg p-5" style={{ backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 style={{ color: '#ffffff', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>Formularios criados</h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-sm)', margin: 0 }}>Filtre, consulte e abra formularios para editar a estrutura no builder.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="survey-list-search">
                  <Search size={15} />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar formulario"
                    aria-label="Buscar formulario"
                  />
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'Todos' | StoredForm['status'])}
                  aria-label="Filtrar por status"
                  className="survey-list-filter"
                >
                  <option>Todos</option>
                  <option>Rascunho</option>
                  <option>Publicado</option>
                </select>
              </div>
            </div>

            <div className="survey-forms-table">
              <div className="survey-forms-table-header">
                <span>Formulario</span>
                <span>Classificacao</span>
                <span>Status</span>
                <span>Versao</span>
                <span>Atualizacao</span>
                <span />
              </div>
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="survey-forms-row"
                >
                  <span className="min-w-0">
                    <span className="survey-forms-row-title">{form.name}</span>
                    <span className="survey-forms-row-description">{form.description}</span>
                  </span>
                  <span>{form.category}</span>
                  <span>
                    <span className={form.status === 'Publicado' ? 'survey-status published' : 'survey-status draft'}>{form.status}</span>
                  </span>
                  <span>v{form.version}</span>
                  <span>{formatDate(form.updatedAt)}</span>
                  <span className="survey-row-actions">
                    <button type="button" onClick={() => openForm(form.id)} className="survey-row-action">
                      <Eye size={15} />
                      Abrir
                    </button>
                    <button type="button" onClick={() => simulateForm(form.id)} className="survey-row-action">
                      <PlayCircle size={15} />
                      Simular
                    </button>
                  </span>
                </div>
              ))}
              {filteredForms.length === 0 && (
                <div className="survey-empty-list">Nenhum formulario encontrado para os filtros selecionados.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (viewMode === 'usage') {
    return (
      <div className="survey-form-builder min-h-screen" style={{ backgroundColor: '#0f172a' }}>
        <div className="px-8 py-8">
          <div className="mb-6 flex items-start gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Voltar para listagem"
              className="flex h-9 w-9 items-center justify-center rounded-md"
              style={{ backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: 'rgba(0,193,175,0.15)' }}>
              <PlayCircle size={18} style={{ color: '#00c1af' }} />
            </div>
            <div className="min-w-0 flex-1" style={{ marginTop: 4 }}>
              <h1 style={{ color: '#ffffff', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', margin: '0 0 8px', lineHeight: 1.5 }}>
                Uso do formulario
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)', margin: 0, lineHeight: 1.5 }}>
                Simulacao de preenchimento do formulario selecionado em um fluxo operacional.
              </p>
            </div>
            <button type="button" onClick={() => setViewMode('builder')} className="survey-action-button secondary">
              <Eye size={15} />
              Editar estrutura
            </button>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '20px 0 28px' }} />

          <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <section className="rounded-lg p-4" style={{ backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, margin: '0 0 14px' }}>Contexto de uso</h2>
                <div className="survey-usage-context">
                  <span>Formulario</span>
                  <strong>{selectedForm.name}</strong>
                  <span>Classificacao</span>
                  <strong>{selectedForm.category}</strong>
                  <span>Versao</span>
                  <strong>v{selectedForm.version}</strong>
                  <span>Status</span>
                  <strong>{selectedForm.status}</strong>
                  <span>Fluxo simulado</span>
                  <strong>{getUsageFlow(selectedForm.category)}</strong>
                </div>
              </section>

              <section className="rounded-lg p-4" style={{ backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, margin: '0 0 14px' }}>Linha do tempo</h2>
                {[
                  'Formulario selecionado pela area tecnica',
                  'Usuario preenche os campos obrigatorios',
                  'Sistema valida e registra a resposta',
                  'Modulo consumidor recebe a submissao',
                ].map((item) => (
                  <div key={item} className="survey-usage-step">
                    <CheckCircle2 size={15} />
                    <span>{item}</span>
                  </div>
                ))}
              </section>
            </aside>

            <section className="survey-runtime-panel">
              <SurveyRuntime form={selectedForm} />
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-form-builder min-h-screen" style={{ backgroundColor: '#0b1222' }}>
      <div className="px-8 py-8">
        <div className="mb-6 flex items-start gap-3">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="Voltar para listagem"
            className="flex h-9 w-9 items-center justify-center rounded-md"
            style={{ backgroundColor: 'rgba(30,41,59,0.72)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.72)' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: 'rgba(0,193,175,0.14)' }}>
            <BookOpen size={18} style={{ color: '#00c1af' }} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, margin: 0 }}>{selectedForm.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '14px', margin: '4px 0 0' }}>
              Edite a estrutura do formulario no SurveyJS.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={createForm} className="survey-action-button secondary">
              <FilePlus2 size={15} />
              Novo
            </button>
            <button type="button" onClick={duplicateForm} className="survey-action-button secondary">
              <Copy size={15} />
              Nova versao
            </button>
            <button type="button" onClick={saveDraft} className="survey-action-button secondary">
              <Save size={15} />
              Salvar
            </button>
            <button type="button" onClick={publishForm} className="survey-action-button primary">
              <Send size={15} />
              Publicar
            </button>
            <button type="button" onClick={() => setViewMode('usage')} className="survey-action-button secondary">
              <PlayCircle size={15} />
              Simular uso
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-lg p-4" style={{ backgroundColor: 'rgba(30,41,59,0.62)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="mb-3 flex items-center justify-between">
                <h2 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, margin: 0 }}>Biblioteca</h2>
                <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: '12px' }}>{forms.length} itens</span>
              </div>
              <div className="space-y-2">
                {forms.map((form) => {
                  const active = form.id === selectedId;
                  return (
                    <button
                      key={form.id}
                      type="button"
                      onClick={() => setSelectedId(form.id)}
                      className="w-full rounded-md p-3 text-left transition-colors"
                      style={{
                        backgroundColor: active ? 'rgba(0,193,175,0.13)' : 'rgba(255,255,255,0.035)',
                        border: `1px solid ${active ? 'rgba(0,193,175,0.42)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span style={{ display: 'block', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>{form.name}</span>
                          <span style={{ display: 'block', color: 'rgba(255,255,255,0.46)', fontSize: '12px', marginTop: 3 }}>
                            {form.category} - v{form.version}
                          </span>
                        </span>
                        <span className={form.status === 'Publicado' ? 'survey-status published' : 'survey-status draft'}>{form.status}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg p-4" style={{ backgroundColor: 'rgba(30,41,59,0.62)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, margin: '0 0 14px' }}>Metadados</h2>
              <label className="survey-field-label" htmlFor="form-name">Nome</label>
              <input id="form-name" value={selectedForm.name} onChange={(event) => updateSelected({ name: event.target.value })} className="survey-field-input" />

              <label className="survey-field-label" htmlFor="form-category">Classificacao</label>
              <select id="form-category" value={selectedForm.category} onChange={(event) => updateSelected({ category: event.target.value })} className="survey-field-input">
                <option>Submissao</option>
                <option>Avaliacao</option>
                <option>Recurso</option>
                <option>Prestacao de contas</option>
                <option>Cadastro</option>
              </select>

              <label className="survey-field-label" htmlFor="form-description">Descricao</label>
              <textarea
                id="form-description"
                value={selectedForm.description}
                onChange={(event) => updateSelected({ description: event.target.value })}
                className="survey-field-input"
                rows={4}
              />

              <div className="mt-4 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.52)', fontSize: '12px' }}>
                <BadgeCheck size={14} style={{ color: '#00c1af' }} />
                Atualizado em {formatDate(selectedForm.updatedAt)}
              </div>
            </section>

            <section className="rounded-lg p-4" style={{ backgroundColor: 'rgba(30,41,59,0.62)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button type="button" onClick={() => setShowJson((value) => !value)} className="survey-json-toggle">
                <FileJson size={15} />
                {showJson ? 'Ocultar JSON' : 'Ver JSON'}
              </button>
              {showJson && (
                <pre className="mt-3 max-h-64 overflow-auto rounded-md p-3" style={{ backgroundColor: 'rgba(2,6,23,0.7)', color: 'rgba(255,255,255,0.72)', fontSize: '11px' }}>
                  {JSON.stringify(creator.JSON, null, 2)}
                </pre>
              )}
              <button type="button" onClick={removeForm} className="survey-remove-button">
                <Trash2 size={15} />
                Remover formulario
              </button>
            </section>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-lg" style={{ backgroundColor: '#0b1222', border: '1px solid rgba(255,255,255,0.1)' }}>
            <SurveyCreatorComponent creator={creator} />
          </section>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    className="rounded-lg p-4"
    style={{
      backgroundColor: 'rgba(30,41,59,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: 600, marginBottom: 8 }}>
      {label}
    </div>
    <div style={{ color: '#ffffff', fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>
      {value}
    </div>
  </div>
);

const getUsageFlow = (category: string) => {
  if (category === 'Avaliacao') return 'Parecer de revisor';
  if (category === 'Recurso') return 'Solicitacao de recurso';
  if (category === 'Prestacao de contas') return 'Acompanhamento da iniciativa';
  if (category === 'Cadastro') return 'Cadastro administrativo';
  return 'Submissao de proposta';
};

const SurveyRuntime: React.FC<{ form: StoredForm }> = ({ form }) => {
  const survey = useMemo(() => {
    const model = new Model(form.json);
    model.applyTheme(conectaSurveyTheme);
    return model;
  }, [form.id, form.updatedAt]);

  useEffect(() => {
    const handler = (sender: Model) => {
      toast.success('Resposta registrada na simulacao');
      console.info('Simulated SurveyJS response', sender.data);
    };

    survey.onComplete.add(handler);
    return () => {
      survey.onComplete.remove(handler);
    };
  }, [survey]);

  return (
    <div>
      <div className="survey-runtime-header">
        <div>
          <h2>{form.name}</h2>
          <p>{form.description}</p>
        </div>
        <span className={form.status === 'Publicado' ? 'survey-status published' : 'survey-status draft'}>
          {form.status}
        </span>
      </div>
      <div className="survey-runtime-surface">
        <Survey model={survey} />
      </div>
    </div>
  );
};
