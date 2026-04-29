import React, { useMemo, useState } from 'react';
import { ArrowLeft, ClipboardList, Plus, Save, Search, Trash2 } from 'lucide-react';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

type SituacaoRegra = 'Vigente' | 'Programada' | 'Inativa';

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

const emptyFaixa = (): FaixaRegra => ({
  id: Date.now(),
  valorMinimo: '',
  valorMaximo: '',
  percentual: '',
});

const emptyRegra: RegraAcaoTransversal = {
  id: 0,
  nome: '',
  baseLegal: '',
  vigenciaInicio: '',
  vigenciaFim: '',
  situacao: 'Programada',
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
    situacao: 'Vigente',
    rubricasPermitidas: 'Diárias, passagens, publicações, serviços de terceiros e material permanente',
    observacoes: 'Percentuais aplicados sobre aporte original e aditivos financeiros.',
    faixas: [
      { id: 11, valorMinimo: '0,00', valorMaximo: '2.000.000,00', percentual: '5,00' },
      { id: 12, valorMinimo: '2.000.000,01', valorMaximo: '5.000.000,00', percentual: '4,00' },
      { id: 13, valorMinimo: '5.000.000,01', valorMaximo: '', percentual: '3,00' },
    ],
  },
];

export const RegrasAcaoTransversal: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);

  const [searchTerm, setSearchTerm] = useState('');
  const [regras, setRegras] = useState<RegraAcaoTransversal[]>(initialRegras);
  const [selected, setSelected] = useState<RegraAcaoTransversal | null>(initialRegras[0]);
  const [draft, setDraft] = useState<RegraAcaoTransversal>(initialRegras[0]);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return regras.filter(item =>
      item.nome.toLowerCase().includes(query) ||
      item.baseLegal.toLowerCase().includes(query) ||
      item.rubricasPermitidas.toLowerCase().includes(query)
    );
  }, [regras, searchTerm]);

  const metrics = useMemo(() => ({
    total: regras.length,
    vigentes: regras.filter(item => item.situacao === 'Vigente').length,
    programadas: regras.filter(item => item.situacao === 'Programada').length,
    faixas: regras.reduce((total, item) => total + item.faixas.length, 0),
  }), [regras]);

  const updateDraft = (field: keyof RegraAcaoTransversal, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const updateFaixa = (id: number, field: keyof Omit<FaixaRegra, 'id'>, value: string) => {
    setDraft(prev => ({
      ...prev,
      faixas: prev.faixas.map(faixa => faixa.id === id ? { ...faixa, [field]: value } : faixa),
    }));
  };

  const openNew = () => {
    const nova = { ...emptyRegra, id: Date.now(), faixas: [{ ...emptyRegra.faixas[0], id: Date.now() + 1 }] };
    setDraft(nova);
    setSelected(null);
  };

  const openEdit = (regra: RegraAcaoTransversal) => {
    setDraft({ ...regra, faixas: regra.faixas.map(faixa => ({ ...faixa })) });
    setSelected(regra);
  };

  const save = () => {
    const item = { ...draft, id: draft.id || Date.now(), faixas: draft.faixas.length ? draft.faixas : [emptyFaixa()] };
    setRegras(prev => {
      const exists = prev.some(regra => regra.id === item.id);
      return exists ? prev.map(regra => regra.id === item.id ? item : regra) : [item, ...prev];
    });
    setSelected(item);
    setDraft(item);
  };

  const removeSelected = () => {
    if (!selected) return;
    const next = regras.filter(item => item.id !== selected.id);
    setRegras(next);
    const nextSelected = next[0] || null;
    setSelected(nextSelected);
    setDraft(nextSelected || emptyRegra);
  };

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onBack} title="Voltar" style={S.iconButton}>
            <ArrowLeft size={16} style={{ color: T.textSecondary }} />
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClipboardList size={18} style={{ color: T.accent }} />
          </div>
          <div style={{ flex: 1, marginTop: '4px' }}>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: T.textPrimary, margin: '0 0 6px' }}>
              Regras de Ação Transversal
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
              Cadastre políticas, vigências, faixas percentuais e rubricas permitidas para cálculo da reserva.
            </p>
          </div>
          <button onClick={openNew} style={S.primaryButton}>
            <Plus size={15} />
            Nova regra
          </button>
        </div>

        <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, marginBottom: '24px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <Metric T={T} label="Regras" value={String(metrics.total)} />
          <Metric T={T} label="Vigentes" value={String(metrics.vigentes)} />
          <Metric T={T} label="Programadas" value={String(metrics.programadas)} />
          <Metric T={T} label="Faixas cadastradas" value={String(metrics.faixas)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.85fr) minmax(0, 1.35fr)', gap: '18px', alignItems: 'start' }}>
          <div style={S.card}>
            <div style={{ marginBottom: '16px' }}>
              <label style={S.label}>Pesquisar</label>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Buscar por norma, nome ou rubrica" style={{ ...S.input, paddingLeft: '36px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(regra => {
                const active = draft.id === regra.id;
                return (
                  <button
                    key={regra.id}
                    onClick={() => openEdit(regra)}
                    style={{
                      textAlign: 'left',
                      border: `1px solid ${active ? T.accent : T.borderSubtle}`,
                      backgroundColor: active ? T.accentSoft : T.bgSurfaceMuted,
                      borderRadius: '8px',
                      padding: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                      <strong style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>{regra.nome}</strong>
                      <StatusBadge situacao={regra.situacao} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: '0 0 6px' }}>{regra.baseLegal}</p>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, margin: 0 }}>{regra.faixas.length} faixa(s) percentual(is)</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' }}>
              <div>
                <h2 style={S.sectionTitle}>Cadastro da regra</h2>
                <p style={S.sectionSubtitle}>As faixas não devem se sobrepor e a política vigente será usada nos cálculos das parcerias.</p>
              </div>
              {selected && (
                <button onClick={removeSelected} style={S.dangerButton}>
                  <Trash2 size={15} />
                  Remover
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <Field label="Nome" value={draft.nome} onChange={value => updateDraft('nome', value)} placeholder="Política padrão de Ação Transversal" S={S} />
              <Field label="Base legal" value={draft.baseLegal} onChange={value => updateDraft('baseLegal', value)} placeholder="Resolução CCAF nº 334/2023" S={S} />
              <Field label="Vigência inicial" type="date" value={draft.vigenciaInicio} onChange={value => updateDraft('vigenciaInicio', value)} S={S} />
              <Field label="Vigência final" type="date" value={draft.vigenciaFim} onChange={value => updateDraft('vigenciaFim', value)} S={S} />
              <Select label="Situação" value={draft.situacao} onChange={value => updateDraft('situacao', value)} options={['Vigente', 'Programada', 'Inativa']} S={S} />
              <Field label="Rubricas permitidas" value={draft.rubricasPermitidas} onChange={value => updateDraft('rubricasPermitidas', value)} placeholder="Diárias, passagens, publicações..." S={S} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={S.label}>Observações</label>
              <textarea value={draft.observacoes} onChange={event => updateDraft('observacoes', event.target.value)} rows={3} style={{ ...S.input, resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={S.sectionTitle}>Faixas percentuais</h3>
                <button onClick={() => setDraft(prev => ({ ...prev, faixas: [...prev.faixas, emptyFaixa()] }))} style={S.secondaryButton}>
                  <Plus size={14} />
                  Adicionar faixa
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {draft.faixas.map(faixa => (
                  <div key={faixa.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr auto', gap: '10px', alignItems: 'end', padding: '12px', border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted }}>
                    <Field label="Valor mínimo" value={faixa.valorMinimo} onChange={value => updateFaixa(faixa.id, 'valorMinimo', value)} placeholder="0,00" S={S} />
                    <Field label="Valor máximo" value={faixa.valorMaximo} onChange={value => updateFaixa(faixa.id, 'valorMaximo', value)} placeholder="Sem limite" S={S} />
                    <Field label="Percentual" value={faixa.percentual} onChange={value => updateFaixa(faixa.id, 'percentual', value)} placeholder="4,00" S={S} />
                    <button
                      onClick={() => setDraft(prev => ({ ...prev, faixas: prev.faixas.filter(item => item.id !== faixa.id) }))}
                      title="Remover faixa"
                      style={{ ...S.iconButton, width: '40px', height: '40px' }}
                    >
                      <Trash2 size={15} style={{ color: T.danger }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={save} style={S.primaryButton}>
                <Save size={15} />
                Salvar regra
              </button>
            </div>
          </div>
        </div>
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
  label: {
    display: 'block',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    color: T.textSecondary,
    marginBottom: '8px',
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
    <input type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} style={S.input} />
  </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[]; S: ReturnType<typeof buildStyles> }> = ({ label, value, onChange, options, S }) => (
  <div>
    <label style={S.label}>{label}</label>
    <select value={value} onChange={event => onChange(event.target.value)} style={S.input}>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

const Metric: React.FC<{ T: ThemeTokens; label: string; value: string }> = ({ T, label, value }) => (
  <div style={{ backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '10px', padding: '16px' }}>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, margin: '0 0 8px' }}>{label}</p>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', color: T.textPrimary, margin: 0 }}>{value}</p>
  </div>
);

const StatusBadge: React.FC<{ situacao: SituacaoRegra }> = ({ situacao }) => {
  const color = situacao === 'Vigente' ? '#22c55e' : situacao === 'Programada' ? '#38bdf8' : '#94a3b8';
  return (
    <span style={{ flexShrink: 0, padding: '4px 8px', borderRadius: '999px', backgroundColor: `${color}22`, color, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
      {situacao}
    </span>
  );
};
