import React, { useMemo, useState } from 'react';
import { CheckCircle, Edit3, FileText, FolderTree, Plus, Save, Search, Tags, Trash2 } from 'lucide-react';
import { ThemeTokens, useThemeTokens } from '../theme/ThemeContext';
import { ConfiguracoesPageHeader } from './ConfiguracoesPageHeader';

type NaturezaDespesa = 'CUSTEIO' | 'CAPITAL';

interface RubricaItem {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  naturezaDespesa: NaturezaDespesa;
  rubricaPaiId?: number;
  ativa: boolean;
}

const emptyRubrica: RubricaItem = {
  id: 0,
  codigo: '',
  nome: '',
  descricao: '',
  naturezaDespesa: 'CUSTEIO',
  rubricaPaiId: undefined,
  ativa: true,
};

const initialRubricas: RubricaItem[] = [
  { id: 1, codigo: 'RUB-BOLSAS', nome: 'Bolsas', descricao: 'Apoio financeiro por modalidade e nível de bolsa.', naturezaDespesa: 'CUSTEIO', ativa: true },
  { id: 2, codigo: 'RUB-DIARIAS', nome: 'Diárias', descricao: 'Diárias estaduais, nacionais e internacionais vinculadas ao projeto.', naturezaDespesa: 'CUSTEIO', ativa: true },
  { id: 3, codigo: 'RUB-DIARIA-ES', nome: 'Diária dentro do Estado', descricao: 'Deslocamentos dentro do Espírito Santo.', naturezaDespesa: 'CUSTEIO', rubricaPaiId: 2, ativa: true },
  { id: 4, codigo: 'RUB-DIARIA-NAC', nome: 'Diária nacional', descricao: 'Deslocamentos nacionais para fora do Espírito Santo.', naturezaDespesa: 'CUSTEIO', rubricaPaiId: 2, ativa: true },
  { id: 5, codigo: 'RUB-DIARIA-INT', nome: 'Diária internacional', descricao: 'Deslocamentos para fora do Brasil.', naturezaDespesa: 'CUSTEIO', rubricaPaiId: 2, ativa: true },
  { id: 6, codigo: 'RUB-MAT-CONSUMO', nome: 'Material de Consumo', descricao: 'Insumos e materiais consumíveis usados no projeto.', naturezaDespesa: 'CUSTEIO', ativa: true },
  { id: 7, codigo: 'RUB-MAT-PERM', nome: 'Material Permanente', descricao: 'Bens permanentes e equipamentos incorporáveis.', naturezaDespesa: 'CAPITAL', ativa: true },
  { id: 8, codigo: 'RUB-SOFTWARE', nome: 'Software', descricao: 'Aquisição de software enquadrada como capital.', naturezaDespesa: 'CAPITAL', ativa: false },
];

const buildStyles = (T: ThemeTokens) => ({
  page: {
    minHeight: '100vh',
    backgroundColor: T.bgPage,
    padding: '32px',
  } as React.CSSProperties,
  card: {
    backgroundColor: T.bgCard,
    border: `1px solid ${T.borderSubtle}`,
    borderRadius: '10px',
    padding: '20px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    minWidth: 0,
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
    marginBottom: '8px',
    color: T.textSecondary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
  } as React.CSSProperties,
  sectionTitle: {
    margin: 0,
    color: T.textPrimary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-md)',
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: 1.3,
  } as React.CSSProperties,
  sectionSubtitle: {
    margin: '6px 0 0',
    color: T.textSecondary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.5,
  } as React.CSSProperties,
});

interface RubricasProps {
  onBack: () => void;
}

export const Rubricas: React.FC<RubricasProps> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);
  const catalogGrid = 'minmax(112px, 0.95fr) minmax(150px, 1.25fr) 76px 104px 68px 70px';
  const [rubricas, setRubricas] = useState<RubricaItem[]>(initialRubricas);
  const [draft, setDraft] = useState<RubricaItem>(emptyRubrica);
  const [searchTerm, setSearchTerm] = useState('');
  const [naturezaFilter, setNaturezaFilter] = useState<'Todas' | NaturezaDespesa>('Todas');
  const [ativaFilter, setAtivaFilter] = useState<'Todas' | 'Ativa' | 'Inativa'>('Todas');
  const [editingId, setEditingId] = useState<number | null>(null);

  const rubricasPai = rubricas.filter(item => !item.rubricaPaiId);

  const filteredRubricas = rubricas.filter(item => {
    const query = searchTerm.trim().toLowerCase();
    const parentName = item.rubricaPaiId ? rubricas.find(parent => parent.id === item.rubricaPaiId)?.nome || '' : '';
    const matchSearch =
      !query ||
      item.codigo.toLowerCase().includes(query) ||
      item.nome.toLowerCase().includes(query) ||
      item.descricao.toLowerCase().includes(query) ||
      parentName.toLowerCase().includes(query);
    const matchNatureza = naturezaFilter === 'Todas' || item.naturezaDespesa === naturezaFilter;
    const matchAtiva = ativaFilter === 'Todas' || (ativaFilter === 'Ativa' ? item.ativa : !item.ativa);
    return matchSearch && matchNatureza && matchAtiva;
  });

  const metrics = useMemo(() => {
    const ativas = rubricas.filter(item => item.ativa).length;
    const custeio = rubricas.filter(item => item.naturezaDespesa === 'CUSTEIO').length;
    const capital = rubricas.filter(item => item.naturezaDespesa === 'CAPITAL').length;
    const subrubricas = rubricas.filter(item => item.rubricaPaiId).length;
    return { total: rubricas.length, ativas, custeio, capital, subrubricas };
  }, [rubricas]);

  const updateDraft = (field: keyof RubricaItem, value: string | number | boolean | undefined) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const saveRubrica = () => {
    if (!draft.codigo.trim() || !draft.nome.trim() || !draft.descricao.trim()) return;

    const item: RubricaItem = {
      ...draft,
      id: editingId || Date.now(),
      codigo: draft.codigo.trim().toUpperCase(),
      nome: draft.nome.trim(),
      descricao: draft.descricao.trim(),
    };

    setRubricas(prev => editingId ? prev.map(row => row.id === editingId ? item : row) : [...prev, item]);
    setEditingId(null);
    setDraft(emptyRubrica);
  };

  const editRubrica = (item: RubricaItem) => {
    setEditingId(item.id);
    setDraft({ ...item });
  };

  const removeRubrica = (id: number) => {
    setRubricas(prev => prev.filter(item => item.id !== id && item.rubricaPaiId !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft(emptyRubrica);
    }
  };

  return (
    <div style={S.page}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <ConfiguracoesPageHeader
          title="Rubricas"
          subtitle="Cadastre a categoria orçamentária usada por editais, projetos e prestação de contas, informando a natureza da despesa. Rubrica é categoria; movimentação de saldo acontece por transação no orçamento do projeto."
          icon={Tags}
          onBack={onBack}
          action={(
            <button type="button" onClick={() => { setEditingId(null); setDraft(emptyRubrica); }} style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', border: 'none', borderRadius: '8px', backgroundColor: T.accent, color: T.accentText, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Plus size={16} />
              Nova rubrica
            </button>
          )}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '14px', marginBottom: '22px' }}>
          <Metric T={T} icon={<FileText size={18} />} label="Total" value={metrics.total} />
          <Metric T={T} icon={<CheckCircle size={18} />} label="Ativas" value={metrics.ativas} />
          <Metric T={T} icon={<Tags size={18} />} label="Custeio" value={metrics.custeio} />
          <Metric T={T} icon={<Tags size={18} />} label="Capital" value={metrics.capital} />
          <Metric T={T} icon={<FolderTree size={18} />} label="Subrubricas" value={metrics.subrubricas} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 0.85fr) minmax(0, 1.4fr)', gap: '18px', alignItems: 'start' }}>
          <section style={S.card}>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={S.sectionTitle}>{editingId ? 'Editar rubrica' : 'Nova rubrica'}</h2>
              <p style={S.sectionSubtitle}>Informe apenas os dados cadastrais da categoria. Não há documento fonte neste cadastro.</p>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              <Field S={S} label="Código" value={draft.codigo} onChange={value => updateDraft('codigo', value)} placeholder="RUB-DIARIAS" />
              <Field S={S} label="Nome" value={draft.nome} onChange={value => updateDraft('nome', value)} placeholder="Diárias" />
              <div>
                <label style={S.label}>Descrição</label>
                <textarea value={draft.descricao} onChange={event => updateDraft('descricao', event.target.value)} placeholder="Descreva o uso da rubrica" rows={4} style={{ ...S.input, resize: 'vertical', minHeight: '96px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Select S={S} label="Natureza da despesa" value={draft.naturezaDespesa} onChange={value => updateDraft('naturezaDespesa', value as NaturezaDespesa)} options={['CUSTEIO', 'CAPITAL']} />
                <Select S={S} label="Ativa" value={draft.ativa ? 'true' : 'false'} onChange={value => updateDraft('ativa', value === 'true')} options={[['true', 'Sim'], ['false', 'Não']]} />
              </div>
              <Select
                S={S}
                label="Rubrica pai"
                value={draft.rubricaPaiId ? String(draft.rubricaPaiId) : ''}
                onChange={value => updateDraft('rubricaPaiId', value ? Number(value) : undefined)}
                options={[['', 'Nenhuma'], ...rubricasPai.filter(item => item.id !== editingId).map(item => [String(item.id), item.nome] as [string, string])]}
              />

              <button type="button" onClick={saveRubrica} disabled={!draft.codigo.trim() || !draft.nome.trim() || !draft.descricao.trim()} style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px', border: 'none', borderRadius: '8px', backgroundColor: !draft.codigo.trim() || !draft.nome.trim() || !draft.descricao.trim() ? T.bgChip : T.accent, color: !draft.codigo.trim() || !draft.nome.trim() || !draft.descricao.trim() ? T.textMuted : T.accentText, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: !draft.codigo.trim() || !draft.nome.trim() || !draft.descricao.trim() ? 'not-allowed' : 'pointer' }}>
                <Save size={16} />
                Salvar rubrica
              </button>
            </div>
          </section>

          <section style={S.card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '18px' }}>
              <div>
                <h2 style={S.sectionTitle}>Catálogo de rubricas</h2>
                <p style={S.sectionSubtitle}>Consulte, filtre e mantenha a hierarquia simples por rubrica pai e subrubrica.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 150px 150px', gap: '12px', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Buscar" style={{ ...S.input, paddingRight: '36px' }} />
                <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
              </div>
              <Select S={S} label="" value={naturezaFilter} onChange={value => setNaturezaFilter(value as typeof naturezaFilter)} options={['Todas', 'CUSTEIO', 'CAPITAL']} />
              <Select S={S} label="" value={ativaFilter} onChange={value => setAtivaFilter(value as typeof ativaFilter)} options={['Todas', 'Ativa', 'Inativa']} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: catalogGrid, gap: '12px', padding: '0 12px 8px', color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
              <span>Código</span>
              <span>Nome</span>
              <span>Natureza</span>
              <span>Rubrica pai</span>
              <span>Ativa</span>
              <span />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredRubricas.map(item => {
                const parent = item.rubricaPaiId ? rubricas.find(row => row.id === item.rubricaPaiId) : undefined;
                const childrenCount = rubricas.filter(row => row.rubricaPaiId === item.id).length;
                return (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: catalogGrid, gap: '12px', alignItems: 'center', padding: '14px 12px', border: `1px solid ${editingId === item.id ? T.accent : T.borderSubtle}`, borderRadius: '8px', backgroundColor: editingId === item.id ? T.accentSoft : T.bgInput }}>
                    <Cell T={T} strong value={item.codigo} detail={childrenCount ? `${childrenCount} subrubrica${childrenCount > 1 ? 's' : ''}` : undefined} />
                    <Cell T={T} strong value={item.nome} detail={item.descricao} />
                    <Badge T={T} tone={item.naturezaDespesa === 'CUSTEIO' ? 'info' : 'accent'}>{item.naturezaDespesa}</Badge>
                    <Cell T={T} value={parent?.nome || 'Rubrica principal'} />
                    <Badge T={T} tone={item.ativa ? 'success' : 'muted'}>{item.ativa ? 'Ativa' : 'Inativa'}</Badge>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <IconButton T={T} label="Editar" onClick={() => editRubrica(item)}>
                        <Edit3 size={14} />
                      </IconButton>
                      <IconButton T={T} label="Remover" danger onClick={() => removeRubrica(item.id)}>
                        <Trash2 size={14} />
                      </IconButton>
                    </div>
                  </div>
                );
              })}

              {filteredRubricas.length === 0 && (
                <div style={{ border: `1px dashed ${T.borderStrong}`, borderRadius: '8px', padding: '28px', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                  Nenhuma rubrica encontrada para os filtros selecionados.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ S: ReturnType<typeof buildStyles>; label: string; value: string; onChange: (value: string) => void; placeholder?: string }> = ({ S, label, value, onChange, placeholder }) => (
  <div>
    <label style={S.label}>{label}</label>
    <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} style={S.input} />
  </div>
);

const Select: React.FC<{ S: ReturnType<typeof buildStyles>; label: string; value: string; onChange: (value: string) => void; options: string[] | Array<[string, string]> }> = ({ S, label, value, onChange, options }) => (
  <div>
    {label && <label style={S.label}>{label}</label>}
    <select value={value} onChange={event => onChange(event.target.value)} style={S.input}>
      {options.map(option => {
        const optionValue = Array.isArray(option) ? option[0] : option;
        const optionLabel = Array.isArray(option) ? option[1] : option;
        return <option key={optionValue || 'empty'} value={optionValue}>{optionLabel}</option>;
      })}
    </select>
  </div>
);

const Metric: React.FC<{ T: ThemeTokens; icon: React.ReactNode; label: string; value: number }> = ({ T, icon, label, value }) => (
  <div style={{ backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: T.accentSoft, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
    <div>
      <p style={{ margin: 0, color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>{label}</p>
      <p style={{ margin: '4px 0 0', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>{value}</p>
    </div>
  </div>
);

const Cell: React.FC<{ T: ThemeTokens; value: string; detail?: string; strong?: boolean }> = ({ T, value, detail, strong }) => (
  <div style={{ minWidth: 0 }}>
    <div title={value} style={{ color: strong ? T.textPrimary : T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: strong ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    {detail && <div title={detail} style={{ marginTop: '4px', color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detail}</div>}
  </div>
);

const Badge: React.FC<{ T: ThemeTokens; tone: 'success' | 'info' | 'accent' | 'muted'; children: React.ReactNode }> = ({ T, tone, children }) => {
  const palette = {
    success: { bg: T.successSoft, color: T.success },
    info: { bg: 'rgba(56,189,248,0.14)', color: '#38bdf8' },
    accent: { bg: T.accentSoft, color: T.accent },
    muted: { bg: T.bgChip, color: T.textMuted },
  }[tone];
  return (
    <span style={{ width: 'fit-content', borderRadius: '999px', padding: '5px 10px', backgroundColor: palette.bg, color: palette.color, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
      {children}
    </span>
  );
};

const IconButton: React.FC<{ T: ThemeTokens; label: string; danger?: boolean; onClick: () => void; children: React.ReactNode }> = ({ T, label, danger, onClick, children }) => (
  <button type="button" aria-label={label} title={label} onClick={onClick} style={{ width: '30px', height: '30px', border: `1px solid ${danger ? 'rgba(239,68,68,0.36)' : 'rgba(0,193,175,0.36)'}`, borderRadius: '8px', backgroundColor: danger ? 'transparent' : T.accentSoft, color: danger ? T.danger : T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
    {children}
  </button>
);
