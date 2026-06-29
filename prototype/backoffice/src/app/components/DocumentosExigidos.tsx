import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, FileCheck2, Plus, Search } from 'lucide-react';
import { ConfiguracoesPageHeader } from './ConfiguracoesPageHeader';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

interface DocumentosExigidosProps {
  onBack: () => void;
}

type DocumentoStatus = 'Ativo' | 'Rascunho' | 'Finalizado';
type Obrigatoriedade = 'Obrigatório' | 'Opcional';

interface DocumentoExigidoItem {
  id: number;
  nome: string;
  descricao: string;
  formato: string;
  obrigatoriedade: Obrigatoriedade;
  status: DocumentoStatus;
}

const documentosIniciais: DocumentoExigidoItem[] = [
  { id: 1, nome: 'Currículo Lattes', descricao: 'Currículo atualizado do proponente.', formato: 'PDF', obrigatoriedade: 'Obrigatório', status: 'Ativo' },
  { id: 2, nome: 'Projeto', descricao: 'Documento técnico da proposta submetida.', formato: 'PDF, DOCX', obrigatoriedade: 'Obrigatório', status: 'Ativo' },
  { id: 3, nome: 'Declaração de vínculo', descricao: 'Comprovante institucional do vínculo informado.', formato: 'PDF', obrigatoriedade: 'Opcional', status: 'Rascunho' },
];

const emptyDocumento: DocumentoExigidoItem = {
  id: 0,
  nome: '',
  descricao: '',
  formato: 'PDF',
  obrigatoriedade: 'Obrigatório',
  status: 'Rascunho',
};

export const DocumentosExigidos: React.FC<DocumentosExigidosProps> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const S = buildStyles(T);

  const [documentos] = useState<DocumentoExigidoItem[]>(documentosIniciais);
  const [mode, setMode] = useState<'list' | 'create' | 'detail'>('list');
  const [selected, setSelected] = useState<DocumentoExigidoItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formatoFilter, setFormatoFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState<DocumentoStatus | 'Todos'>('Todos');
  const [formatoOpen, setFormatoOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [draft, setDraft] = useState<DocumentoExigidoItem>(emptyDocumento);
  const [obrigatoriedadeOpen, setObrigatoriedadeOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return documentos.filter(documento => {
      const matchesText = `${documento.nome} ${documento.descricao}`.toLowerCase().includes(query);
      const matchesFormato = formatoFilter === 'Todos' || documento.formato.includes(formatoFilter);
      const matchesStatus = statusFilter === 'Todos' || documento.status === statusFilter;
      return matchesText && matchesFormato && matchesStatus;
    });
  }, [documentos, formatoFilter, searchTerm, statusFilter]);

  const openCreate = () => {
    setDraft({ ...emptyDocumento, id: Date.now() });
    setSelected(null);
    setMode('create');
  };

  const openDetail = (documento: DocumentoExigidoItem) => {
    setSelected(documento);
    setDraft(documento);
    setMode('detail');
  };

  const updateDraft = (field: keyof DocumentoExigidoItem, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const toggleFormato = (formato: string) => {
    const selectedFormatos = draft.formato.split(', ').filter(Boolean);
    const next = selectedFormatos.includes(formato)
      ? selectedFormatos.filter(item => item !== formato)
      : [...selectedFormatos, formato];
    updateDraft('formato', next.join(', '));
  };

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">
        <ConfiguracoesPageHeader
          title={mode === 'list' ? 'Documentos Exigidos' : mode === 'create' ? 'Criar Documento' : (selected ? selected.nome : 'Detalhes')}
          subtitle="Cadastre documentos reutilizáveis que podem ser exigidos dos proponentes em uma captação."
          icon={FileCheck2}
          onBack={onBack}
          breadcrumbParent={mode !== 'list' ? 'Documentos Exigidos' : undefined}
          breadcrumbTitle={mode === 'create' ? 'Criar Documento' : mode === 'detail' ? 'Detalhes' : undefined}
          onBreadcrumbParentClick={mode !== 'list' ? () => setMode('list') : undefined}
          action={mode === 'list' ? (
            <button type="button" onClick={openCreate} style={S.primaryButton}>
              <Plus size={15} />
              Criar Documento
            </button>
          ) : undefined}
        />

        {mode === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.8fr', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={S.label}>Buscar</label>
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                  <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Buscar" style={{ ...S.input, paddingRight: '36px' }} />
                </div>
              </div>
              <SystemDropdown label="Formato" value={formatoFilter} options={['Todos', 'PDF', 'DOCX', 'XLSX']} isOpen={formatoOpen} onOpen={() => setFormatoOpen(open => !open)} onChange={value => { setFormatoFilter(value); setFormatoOpen(false); }} S={S} T={T} />
              <SystemDropdown label="Status" value={statusFilter} options={['Todos', 'Ativo', 'Finalizado', 'Rascunho']} isOpen={statusOpen} onOpen={() => setStatusOpen(open => !open)} onChange={value => { setStatusFilter(value as DocumentoStatus | 'Todos'); setStatusOpen(false); }} S={S} T={T} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary }}>
                Exibindo {filtered.length} resultado{filtered.length === 1 ? '' : 's'} de {documentos.length}
              </div>
              {filtered.map(documento => (
                <button
                  key={documento.id}
                  type="button"
                  onClick={() => openDetail(documento)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 0.8fr 0.7fr 40px',
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
                  <ReadCell T={T} label="Nome" value={documento.nome} strong />
                  <ReadCell T={T} label="Formato" value={documento.formato} />
                  <div>
                    <div style={S.cellLabel}>Status</div>
                    <StatusBadge status={documento.status} />
                  </div>
                  <ChevronRight size={18} style={{ color: T.iconSubdued, justifySelf: 'center' }} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: T.accentText }}>1</span>
                </div>
                <h2 style={{ ...S.sectionTitle, margin: 0 }}>Informações do Documento</h2>
              </div>

              {mode === 'create' ? (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <Field label="Nome" value={draft.nome} onChange={value => updateDraft('nome', value)} placeholder="Ex.: Declaração de vínculo" S={S} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <FormatosGrid formatos={['PDF', 'DOCX', 'XLSX']} selectedFormatos={draft.formato} onToggle={toggleFormato} T={T} label="Formato Permitido" />
                    <SystemDropdown label="Obrigatoriedade" value={draft.obrigatoriedade} options={['Obrigatório', 'Opcional']} isOpen={obrigatoriedadeOpen} onOpen={() => setObrigatoriedadeOpen(open => !open)} onChange={value => { updateDraft('obrigatoriedade', value); setObrigatoriedadeOpen(false); }} S={S} T={T} />
                  </div>

                  <div>
                    <label style={S.label}>Descrição</label>
                    <textarea value={draft.descricao} onChange={event => updateDraft('descricao', event.target.value)} rows={3} placeholder="Orientação para o proponente" style={{ ...S.input, resize: 'vertical' }} />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <ReadField label="Nome" value={draft.nome} S={S} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <FormatosGrid formatos={['PDF', 'DOCX', 'XLSX']} selectedFormatos={draft.formato} T={T} label="Formato Permitido" readOnly />
                    <ReadField label="Obrigatoriedade" value={draft.obrigatoriedade} S={S} />
                  </div>

                  <div>
                    <label style={S.label}>Descrição</label>
                    <div style={{ ...S.readInput, minHeight: '84px' }}>{draft.descricao || 'Sem descrição'}</div>
                  </div>
                </>
              )}
            </div>

            {mode === 'create' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '18px' }}>
                <button type="button" style={S.secondaryButton}>Salvar Rascunho</button>
                <button type="button" style={S.primaryButton}>Ativar Documento</button>
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
});

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; S: ReturnType<typeof buildStyles>; placeholder?: string }> = ({ label, value, onChange, S, placeholder }) => (
  <div>
    <label style={S.label}>{label}</label>
    <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} style={S.input} />
  </div>
);

const ReadField: React.FC<{ label: string; value: string; S: ReturnType<typeof buildStyles> }> = ({ label, value, S }) => (
  <div>
    <label style={S.label}>{label}</label>
    <div style={S.readInput}>{value}</div>
  </div>
);

const FormatosGrid: React.FC<{
  formatos: string[];
  selectedFormatos: string;
  T: ThemeTokens;
  label: string;
  onToggle?: (formato: string) => void;
  readOnly?: boolean;
}> = ({ formatos, selectedFormatos, T, label, onToggle, readOnly }) => {
  const selected = selectedFormatos.split(', ').filter(Boolean);

  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, marginBottom: '8px' }}>{label}</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
        {formatos.map(formato => {
          const checked = selected.includes(formato);
          return (
            <label key={formato} style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '42px', padding: '10px 12px', border: `1px solid ${checked ? T.accent : T.borderSubtle}`, borderRadius: '8px', backgroundColor: checked ? T.accentSoft : T.bgSurfaceMuted, color: checked ? T.accent : T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: readOnly ? 'default' : 'pointer' }}>
              <input type="checkbox" checked={checked} disabled={readOnly} onChange={() => onToggle?.(formato)} style={{ width: '16px', height: '16px', accentColor: T.accent, cursor: readOnly ? 'default' : 'pointer' }} />
              {formato}
            </label>
          );
        })}
      </div>
    </div>
  );
};

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
    <button type="button" onClick={onOpen} style={{ ...S.input, minHeight: '42px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer', textAlign: 'left', border: `1px solid ${isOpen ? T.accent : T.borderDefault}` }}>
      <span>{value}</span>
      <ChevronDown size={16} style={{ color: T.iconSubdued }} />
    </button>
    {isOpen && (
      <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30, backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`, borderRadius: 'var(--radius)', boxShadow: T.shadowMd, overflow: 'hidden' }}>
        {options.map(option => (
          <button key={option} type="button" onClick={() => onChange(option)} style={{ width: '100%', minHeight: '42px', padding: '10px 12px', border: 'none', backgroundColor: option === value ? T.accentSoft : T.bgSurface, color: option === value ? T.accent : T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer' }}>
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
);

const ReadCell: React.FC<{ T: ThemeTokens; label: string; value: string; strong?: boolean }> = ({ T, label, value, strong }) => (
  <div style={{ minWidth: 0 }}>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>{label}</div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: strong ? T.textPrimary : T.textSecondary, fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {value}
    </p>
  </div>
);

const StatusBadge: React.FC<{ status: DocumentoStatus }> = ({ status }) => {
  const color = status === 'Ativo' ? '#22c55e' : status === 'Rascunho' ? '#f59e0b' : '#a3a3a3';
  return (
    <span style={{ flexShrink: 0, padding: '4px 8px', borderRadius: '999px', backgroundColor: `${color}22`, border: `1px solid ${color}66`, color, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>
      {status}
    </span>
  );
};
