import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ClipboardList, Plus, Search } from 'lucide-react';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';
import { ConfiguracoesPageHeader } from './ConfiguracoesPageHeader';
import { BackofficeDatePicker } from './BackofficeDatePicker';

type SituacaoRegra = 'Ativo' | 'Finalizado' | 'Rascunho';

interface FaixaRegra {
  id: number;
  valorMinimo: string;
  valorMaximo: string;
  percentual: string;
}

interface RegraAcaoTransversal {
  id: number;
  nome: string;
  baseLegal: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  situacao: SituacaoRegra;
  rubricasPermitidas: string;
  observacoes: string;
  faixas: FaixaRegra[];
}

const emptyRegra: RegraAcaoTransversal = {
  id: 0,
  nome: '',
  baseLegal: '',
  vigenciaInicio: '',
  vigenciaFim: '',
  situacao: 'Rascunho',
  rubricasPermitidas: '',
  observacoes: '',
  faixas: [
    { id: 1, valorMinimo: '0,00', valorMaximo: '2.000.000,00', percentual: '5,00' },
  ],
};

const initialRegras: RegraAcaoTransversal[] = [
  {
    id: 1,
    nome: 'Política padrão de Ação Transversal',
    baseLegal: 'Resolução CCAF nº 334/2023',
    vigenciaInicio: '2026-01-01',
    vigenciaFim: '',
    situacao: 'Ativo',
    rubricasPermitidas: 'Diária, Passagem, Material Permanente, Material de Consumo, Pessoa Jurídica',
    observacoes: 'Percentuais aplicados sobre aporte original e aditivos financeiros.',
    faixas: [
      { id: 11, valorMinimo: '0,00', valorMaximo: '2.000.000,00', percentual: '5,00' },
      { id: 12, valorMinimo: '2.000.000,01', valorMaximo: '5.000.000,00', percentual: '4,00' },
      { id: 13, valorMinimo: '5.000.000,01', valorMaximo: '', percentual: '3,00' },
    ],
  },
];

const formatVigencia = (inicio: string, fim: string) => `${inicio || 'Sem data'} - ${fim || 'Sem data'}`;

export const RegrasAcaoTransversal: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);

  const [searchTerm, setSearchTerm] = useState('');
  const [regras] = useState<RegraAcaoTransversal[]>(initialRegras);
  const [selected, setSelected] = useState<RegraAcaoTransversal | null>(null);
  const [draft, setDraft] = useState<RegraAcaoTransversal>(initialRegras[0]);
  const [mode, setMode] = useState<'list' | 'detail' | 'create'>('list');
  const [statusFilter, setStatusFilter] = useState<SituacaoRegra | 'Todos'>('Todos');
  const [statusOpen, setStatusOpen] = useState(false);

  const rubricaOptions = ['Material Permanente', 'Material de Consumo', 'Passagem', 'Diária', 'Pessoa Jurídica', 'Pessoa Física'];

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return regras.filter(item => {
      const matchesText = item.nome.toLowerCase().includes(query) ||
        item.baseLegal.toLowerCase().includes(query) ||
        item.rubricasPermitidas.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'Todos' || item.situacao === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [regras, searchTerm, statusFilter]);

  const openNew = () => {
    const nova = { ...emptyRegra, id: Date.now(), faixas: [{ ...emptyRegra.faixas[0], id: Date.now() + 1 }] };
    setDraft(nova);
    setSelected(null);
    setMode('create');
  };

  const openEdit = (regra: RegraAcaoTransversal) => {
    setDraft({ ...regra, faixas: regra.faixas.map(faixa => ({ ...faixa })) });
    setSelected(regra);
    setMode('detail');
  };

  const updateDraft = (field: keyof RegraAcaoTransversal, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const updateFaixa = (id: number, field: keyof Omit<FaixaRegra, 'id'>, value: string) => {
    setDraft(prev => ({
      ...prev,
      faixas: prev.faixas.map(faixa => faixa.id === id ? { ...faixa, [field]: value } : faixa),
    }));
  };

  const toggleRubrica = (rubrica: string) => {
    const selectedRubricas = draft.rubricasPermitidas ? draft.rubricasPermitidas.split(', ').filter(Boolean) : [];
    const next = selectedRubricas.includes(rubrica)
      ? selectedRubricas.filter(item => item !== rubrica)
      : [...selectedRubricas, rubrica];
    updateDraft('rubricasPermitidas', next.join(', '));
  };

  const detailTitle = mode === 'create' ? 'Criar Regra' : 'Detalhes';

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">
        <ConfiguracoesPageHeader
          title={mode === 'list' ? 'Regras de Ação Transversal' : mode === 'create' ? 'Criar Regra' : (selected ? selected.nome : 'Detalhes')}
          subtitle="Cadastre políticas, vigências, faixas percentuais e rubricas permitidas para cálculo da reserva."
          icon={ClipboardList}
          onBack={onBack}
          breadcrumbParent={mode !== 'list' ? 'Regras de Ação Transversal' : undefined}
          breadcrumbTitle={mode !== 'list' ? detailTitle : undefined}
          onBreadcrumbParentClick={mode !== 'list' ? () => setMode('list') : undefined}
          action={mode === 'list' ? (
            <button onClick={openNew} style={S.primaryButton}>
              <Plus size={15} />
              Criar Regra
            </button>
          ) : undefined}
        />

        {mode === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.7fr', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={S.label}>Pesquisar</label>
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                  <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Buscar" style={{ ...S.input, paddingRight: '36px' }} />
                </div>
              </div>
              <SystemDropdown
                label="Status"
                value={statusFilter}
                options={['Todos', 'Ativo', 'Finalizado', 'Rascunho']}
                isOpen={statusOpen}
                onOpen={() => setStatusOpen(open => !open)}
                onChange={value => {
                  setStatusFilter(value as SituacaoRegra | 'Todos');
                  setStatusOpen(false);
                }}
                S={S}
                T={T}
              />
            </div>

            <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary }}>
              Exibindo {filtered.length} resultado{filtered.length === 1 ? '' : 's'} de {regras.length}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(regra => {
                return (
                  <button
                    key={regra.id}
                    onClick={() => openEdit(regra)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.35fr 1fr 1fr 0.7fr 40px',
                      gap: '16px',
                      alignItems: 'center',
                      textAlign: 'left',
                      border: `1px solid ${T.borderSubtle}`,
                      backgroundColor: T.bgCard,
                      borderRadius: '10px',
                      padding: '18px 20px',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={event => {
                      event.currentTarget.style.backgroundColor = T.bgSurfaceMuted;
                      event.currentTarget.style.borderColor = T.borderDefault;
                    }}
                    onMouseLeave={event => {
                      event.currentTarget.style.backgroundColor = T.bgCard;
                      event.currentTarget.style.borderColor = T.borderSubtle;
                    }}
                  >
                    <ReadCell T={T} label="Política" value={regra.nome} strong />
                    <ReadCell T={T} label="Base legal" value={regra.baseLegal} />
                    <ReadCell T={T} label="Vigência" value={formatVigencia(regra.vigenciaInicio, regra.vigenciaFim)} />
                    <div>
                      <div style={S.cellLabel}>Status</div>
                      <StatusBadge situacao={regra.situacao} />
                    </div>
                    <ChevronRight size={18} style={{ color: T.iconSubdued, justifySelf: 'center' }} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
          <div style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: T.accentText }}>1</span>
              </div>
              <h2 style={{ ...S.sectionTitle, margin: 0 }}>Informações da Regra</h2>
            </div>

            {mode === 'create' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <Field label="Nome" value={draft.nome} onChange={value => updateDraft('nome', value)} placeholder="Política padrão de Ação Transversal" S={S} />
                  <Field label="Base legal" value={draft.baseLegal} onChange={value => updateDraft('baseLegal', value)} placeholder="Resolução CCAF nº 334/2023" S={S} />
                  <Field label="Data de Início" type="date" value={draft.vigenciaInicio} onChange={value => updateDraft('vigenciaInicio', value)} S={S} />
                  <Field label="Data de Fim" type="date" value={draft.vigenciaFim} onChange={value => updateDraft('vigenciaFim', value)} S={S} />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={S.label}>Descrição</label>
                  <textarea value={draft.observacoes} onChange={event => updateDraft('observacoes', event.target.value)} rows={3} style={{ ...S.input, resize: 'vertical' }} />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={S.label}>Rubricas Permitidas</label>
                  <RubricasGrid
                    options={rubricaOptions}
                    selectedRubricas={draft.rubricasPermitidas}
                    T={T}
                    onToggle={toggleRubrica}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <ReadField label="Nome" value={draft.nome} S={S} />
                  <ReadField label="Base legal" value={draft.baseLegal} S={S} />
                  <ReadField label="Data de Início" value={draft.vigenciaInicio || 'Sem data'} S={S} />
                  <ReadField label="Data de Fim" value={draft.vigenciaFim || 'Sem data'} S={S} />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={S.label}>Descrição</label>
                  <div style={{ ...S.readInput, minHeight: '84px' }}>
                    {draft.observacoes || 'Sem descrição'}
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={S.label}>Rubricas Permitidas</label>
                  <RubricasGrid
                    options={rubricaOptions}
                    selectedRubricas={draft.rubricasPermitidas}
                    T={T}
                    readOnly
                  />
                </div>
              </>
            )}

            <div style={{ margin: '18px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={S.sectionTitle}>Faixas percentuais</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {draft.faixas.map(faixa => (
                  <div key={faixa.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: '10px', alignItems: 'end' }}>
                    {mode === 'create' ? (
                      <>
                        <Field label="Valor mínimo" value={faixa.valorMinimo} onChange={value => updateFaixa(faixa.id, 'valorMinimo', value)} placeholder="0,00" S={S} />
                        <Field label="Valor máximo" value={faixa.valorMaximo} onChange={value => updateFaixa(faixa.id, 'valorMaximo', value)} placeholder="Sem limite" S={S} />
                        <Field label="Percentual" value={faixa.percentual} onChange={value => updateFaixa(faixa.id, 'percentual', value)} placeholder="4,00" S={S} />
                      </>
                    ) : (
                      <>
                        <ReadField label="Valor mínimo" value={faixa.valorMinimo || '0,00'} S={S} />
                        <ReadField label="Valor máximo" value={faixa.valorMaximo || 'Sem limite'} S={S} />
                        <ReadField label="Percentual" value={faixa.percentual || '0,00'} S={S} />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {mode === 'create' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '18px' }}>
              <button type="button" style={S.secondaryButton}>Salvar Rascunho</button>
              <button type="button" style={S.primaryButton}>Ativar Regra</button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
};

const buildStyles = (T: ThemeTokens) => ({
  card: {
    backgroundColor: T.bgCard,
    border: `1px solid ${T.borderSubtle}`,
    borderRadius: '10px',
    padding: '20px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    backgroundColor: T.bgInput,
    border: `1px solid ${T.borderDefault}`,
    borderRadius: '6px',
    padding: '10px 12px',
    color: T.textPrimary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  readInput: {
    width: '100%',
    minHeight: '42px',
    backgroundColor: T.bgSurfaceMuted,
    border: `1px solid ${T.borderDefault}`,
    borderRadius: '6px',
    padding: '10px 12px',
    color: T.textPrimary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    marginBottom: '8px',
  } as React.CSSProperties,
  cellLabel: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-xs)',
    color: T.textMuted,
    marginBottom: '4px',
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textPrimary,
    fontWeight: 'var(--font-weight-medium)',
    margin: '0 0 6px',
  } as React.CSSProperties,
  sectionSubtitle: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    margin: 0,
    lineHeight: 1.5,
  } as React.CSSProperties,
  iconButton: {
    width: '36px',
    height: '36px',
    border: `1px solid ${T.borderSubtle}`,
    borderRadius: 'var(--radius)',
    backgroundColor: T.bgCard,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  } as React.CSSProperties,
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: T.accent,
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '10px 16px',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: T.accentText,
    cursor: 'pointer',
  } as React.CSSProperties,
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: `1px solid ${T.borderStrong}`,
    borderRadius: 'var(--radius)',
    padding: '9px 12px',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    cursor: 'pointer',
  } as React.CSSProperties,
  dangerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239,68,68,0.35)',
    borderRadius: 'var(--radius)',
    padding: '9px 12px',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.danger,
    cursor: 'pointer',
  } as React.CSSProperties,
});

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; S: ReturnType<typeof buildStyles>; placeholder?: string; type?: string }> = ({ label, value, onChange, S, placeholder, type = 'text' }) => (
  <div>
    <label style={S.label}>{label}</label>
    {type === 'date'
      ? <BackofficeDatePicker value={value} onChange={onChange} placeholder={placeholder} style={S.input} />
      : <input type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} style={S.input} />}
  </div>
);

const ReadField: React.FC<{ label: string; value: string; S: ReturnType<typeof buildStyles> }> = ({ label, value, S }) => (
  <div>
    <label style={S.label}>{label}</label>
    <div style={S.readInput}>
      {value}
    </div>
  </div>
);

const SystemDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onOpen: () => void;
  onChange: (value: string) => void;
  S: ReturnType<typeof buildStyles>;
  T: ThemeTokens;
}> = ({ label, value, options, isOpen, onOpen, onChange, S, T }) => (
  <div style={{ position: 'relative' }}>
    <label style={S.label}>{label}</label>
    <button
      type="button"
      onClick={onOpen}
      style={{
        ...S.input,
        minHeight: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        textAlign: 'left',
        cursor: 'pointer',
        border: `1px solid ${isOpen ? T.accent : T.borderDefault}`,
      }}
    >
      <span>{value}</span>
      <ChevronDown size={16} style={{ color: T.iconSubdued }} />
    </button>
    {isOpen && (
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          zIndex: 30,
          backgroundColor: T.bgSurface,
          border: `1px solid ${T.borderDefault}`,
          borderRadius: 'var(--radius)',
          boxShadow: T.shadowMd,
          overflow: 'hidden',
        }}
      >
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            style={{
              width: '100%',
              minHeight: '42px',
              padding: '10px 12px',
              border: 'none',
              backgroundColor: option === value ? T.accentSoft : T.bgSurface,
              color: option === value ? T.accent : T.textPrimary,
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
);

const ReadCell: React.FC<{ T: ThemeTokens; label: string; value: string; strong?: boolean }> = ({ T, label, value, strong }) => (
  <div style={{ minWidth: 0 }}>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>
      {label}
    </div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: strong ? T.textPrimary : T.textSecondary, fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {value}
    </p>
  </div>
);

const RubricasGrid: React.FC<{
  options: string[];
  selectedRubricas: string;
  T: ThemeTokens;
  onToggle?: (rubrica: string) => void;
  readOnly?: boolean;
}> = ({ options, selectedRubricas, T, onToggle, readOnly }) => {
  const selected = selectedRubricas.split(', ').filter(Boolean);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
      {options.map(rubrica => {
        const checked = selected.includes(rubrica);
        return (
          <label
            key={rubrica}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              border: `1px solid ${checked ? T.accent : T.borderSubtle}`,
              borderRadius: '8px',
              backgroundColor: checked ? T.accentSoft : T.bgSurfaceMuted,
              color: checked ? T.accent : T.textPrimary,
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              cursor: readOnly ? 'default' : 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={readOnly}
              onChange={() => onToggle?.(rubrica)}
              style={{ width: '16px', height: '16px', accentColor: T.accent, cursor: readOnly ? 'default' : 'pointer' }}
            />
            {rubrica}
          </label>
        );
      })}
    </div>
  );
};

const StatusBadge: React.FC<{ situacao: SituacaoRegra }> = ({ situacao }) => {
  const color = situacao === 'Ativo' ? '#22c55e' : situacao === 'Rascunho' ? '#f59e0b' : '#a3a3a3';
  return (
    <span style={{ flexShrink: 0, padding: '4px 8px', borderRadius: '999px', backgroundColor: `${color}22`, border: `1px solid ${color}66`, color, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
      {situacao}
    </span>
  );
};
