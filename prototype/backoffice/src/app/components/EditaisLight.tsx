import React, { useState } from 'react';
import {
  Search, ChevronDown, FileText, Clock, Users, ClipboardList,
  ChevronRight, CheckCircle, Plus, SlidersHorizontal, X, Filter
} from 'lucide-react';

interface EditalInscricao {
  id: number;
  edital: string;
  proponente: string;
  dataEnvio: string;
  setor: string;
  status: string;
}

type AreaFilter = 'Todas' | 'Carreira Científica' | 'Pesquisa' | 'Difusão do Conhecimento' | 'Extensão' | 'Inovação' | 'Internacional';
type SetorFilter = 'Todos' | 'Enviado' | 'Em Avaliação' | 'Avaliado' | 'Aprovado' | 'Reprovado';
type InstituicaoFilter = 'Todos' | 'Ufes' | 'Ifes';

const getStatusColor = (status: string): { bg: string; border: string; text: string } => {
  switch (status) {
    case 'Enviado':      return { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb' };
    case 'Em Avaliação': return { bg: '#fffbeb', border: '#fde68a', text: '#d97706' };
    case 'Avaliado':     return { bg: '#f0fdfa', border: '#99f6e4', text: '#0d9488' };
    case 'Aprovado':     return { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' };
    case 'Reprovado':    return { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' };
    default:             return { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280' };
  }
};

const inscricoesData: EditalInscricao[] = [
  { id: 1, edital: '001/2026 - Bolsas de Pesquisa',         proponente: 'João Silva',          dataEnvio: '15/03/2026 - 14:30', setor: 'Pesquisa',                status: 'Em Avaliação' },
  { id: 2, edital: '002/2026 - Inovação Tecnológica',       proponente: 'Maria Santos',        dataEnvio: '14/03/2026 - 16:45', setor: 'Inovação',                status: 'Enviado'      },
  { id: 3, edital: '003/2026 - Extensão Universitária',     proponente: 'Carlos Lima',         dataEnvio: '13/03/2026 - 10:20', setor: 'Extensão',                status: 'Avaliado'     },
  { id: 4, edital: '001/2026 - Bolsas de Pesquisa',         proponente: 'Ana Paula Rodrigues', dataEnvio: '12/03/2026 - 11:15', setor: 'Carreira Científica',     status: 'Em Avaliação' },
  { id: 5, edital: '004/2026 - Desenvolvimento Regional',   proponente: 'Pedro Costa',         dataEnvio: '11/03/2026 - 09:00', setor: 'Difusão do Conhecimento', status: 'Aprovado'     },
  { id: 6, edital: '005/2026 - Carreira Científica',        proponente: 'Sandra Oliveira',     dataEnvio: '10/03/2026 - 13:40', setor: 'Carreira Científica',     status: 'Reprovado'    },
  { id: 7, edital: '006/2026 - Difusão do Conhecimento',    proponente: 'Ricardo Melo',        dataEnvio: '09/03/2026 - 08:55', setor: 'Internacional',           status: 'Enviado'      },
];

const stats = [
  { label: 'Editais Abertos',    value: '6',   icon: FileText,      accent: '#00c1af', accentBg: '#f0fdfa' },
  { label: 'Em Andamento',       value: '4',   icon: Clock,         accent: '#d97706', accentBg: '#fffbeb' },
  { label: 'Em Avaliação',       value: '12',  icon: Users,         accent: '#2563eb', accentBg: '#eff6ff' },
  { label: 'Avaliados',          value: '38',  icon: CheckCircle,   accent: '#16a34a', accentBg: '#f0fdf4' },
  { label: 'Total de Inscrições',value: '247', icon: ClipboardList, accent: '#dc2626', accentBg: '#fef2f2' },
];

/* ─── NuxtUI tokens (light) ──────────────────────────────────── */
const C = {
  bg:          '#f9fafb',
  surface:     '#ffffff',
  border:      '#e5e7eb',
  borderHover: '#d1d5db',
  textPrimary: '#111827',
  textSecond:  '#6b7280',
  textMuted:   '#9ca3af',
  primary:     '#00c1af',
  primaryDark: '#00a99a',
  primaryBg:   '#f0fdfa',
  shadow:      '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd:    '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)',
};

/* ─── Reusable dropdown ───────────────────────────────────────── */
function Dropdown<T extends string>({
  label, value, options, open, onToggle, onSelect,
}: {
  label: string; value: T; options: T[];
  open: boolean; onToggle: () => void; onSelect: (v: T) => void;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        display: 'block', marginBottom: '6px',
        fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-weight-medium)', color: C.textSecond,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {label}
      </label>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '8px',
          backgroundColor: C.surface, border: `1px solid ${open ? C.primary : C.border}`,
          borderRadius: '8px', padding: '9px 12px', cursor: 'pointer',
          fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
          color: C.textPrimary, boxShadow: open ? `0 0 0 3px ${C.primary}22` : 'none',
          transition: 'all 0.15s',
        }}
      >
        <span>{value}</span>
        <ChevronDown size={14} style={{
          color: C.textMuted, transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'none',
        }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          width: '100%', zIndex: 200, backgroundColor: C.surface,
          border: `1px solid ${C.border}`, borderRadius: '10px',
          boxShadow: C.shadowMd, overflow: 'hidden',
        }}>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                width: '100%', padding: '9px 12px', textAlign: 'left',
                border: 'none', cursor: 'pointer',
                backgroundColor: value === opt ? C.primaryBg : 'transparent',
                color: value === opt ? C.primary : C.textPrimary,
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: value === opt ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = C.bg; }}
              onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt}
              {value === opt && (
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  backgroundColor: C.primary, flexShrink: 0,
                }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Mobile list card ────────────────────────────────────────── */
function MobileCard({ item }: { item: EditalInscricao }) {
  const s = getStatusColor(item.status);
  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '16px', boxShadow: C.shadow,
      transition: 'box-shadow 0.15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = C.shadowMd; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = C.shadow; }}
    >
      {/* Top row: edital + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
        <p style={{
          fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)', color: C.textPrimary,
          margin: 0, flex: 1,
        }}>
          {item.edital}
        </p>
        <span style={{
          flexShrink: 0, display: 'inline-flex', alignItems: 'center',
          gap: '4px', padding: '3px 10px', borderRadius: '9999px',
          backgroundColor: s.bg, border: `1px solid ${s.border}`,
          fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-medium)', color: s.text,
          whiteSpace: 'nowrap',
        }}>
          {item.status}
        </span>
      </div>

      {/* Meta row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: '10px', color: C.textMuted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proponente</p>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: C.textSecond, margin: 0 }}>{item.proponente}</p>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: '10px', color: C.textMuted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data de Envio</p>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: C.textSecond, margin: 0 }}>{item.dataEnvio}</p>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: '10px', color: C.textMuted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Área</p>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: C.textSecond, margin: 0 }}>{item.setor}</p>
        </div>
      </div>

      {/* Footer arrow */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
          color: C.primary, fontWeight: 'var(--font-weight-medium)',
        }}>
          Ver detalhes <ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
}

/* ─── Desktop list row ────────────────────────────────────────── */
function DesktopRow({ item }: { item: EditalInscricao }) {
  const s = getStatusColor(item.status);
  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '10px', padding: '16px 20px', boxShadow: C.shadow,
      transition: 'box-shadow 0.15s, border-color 0.15s', cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = C.shadowMd;
      e.currentTarget.style.borderColor = C.borderHover;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = C.shadow;
      e.currentTarget.style.borderColor = C.border;
    }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2.8fr 1.6fr 1.5fr 1.9fr 1fr auto', gap: '24px', alignItems: 'center' }}>
        {[
          { label: 'Edital',       value: item.edital },
          { label: 'Proponente',   value: item.proponente },
          { label: 'Data de Envio',value: item.dataEnvio },
          { label: 'Área',         value: item.setor },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: C.textMuted, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: C.textPrimary, margin: 0 }}>{value}</p>
          </div>
        ))}

        <div>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: C.textMuted, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p>
          <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
            borderRadius: '9999px', backgroundColor: s.bg,
            border: `1px solid ${s.border}`,
            fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)', color: s.text,
          }}>
            {item.status}
          </span>
        </div>

        <ChevronRight size={16} style={{ color: C.textMuted }} />
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */
export const EditaisLight: React.FC = () => {
  const [searchTerm, setSearchTerm]         = useState('');
  const [dataFilter, setDataFilter]         = useState('');
  const [areaFilter, setAreaFilter]         = useState<AreaFilter>('Todas');
  const [setorFilter, setSetorFilter]       = useState<SetorFilter>('Todos');
  const [instituicaoFilter, setInstituicaoFilter] = useState<InstituicaoFilter>('Todos');
  const [openDrop, setOpenDrop]             = useState<null | 'area' | 'status' | 'inst'>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoverBtn, setHoverBtn]             = useState(false);

  const toggle = (key: 'area' | 'status' | 'inst') =>
    setOpenDrop(openDrop === key ? null : key);

  const areaOptions: AreaFilter[]         = ['Todas', 'Carreira Científica', 'Pesquisa', 'Difusão do Conhecimento', 'Extensão', 'Inovação', 'Internacional'];
  const setorOptions: SetorFilter[]       = ['Todos', 'Enviado', 'Em Avaliação', 'Avaliado', 'Aprovado', 'Reprovado'];
  const instituicaoOptions: InstituicaoFilter[] = ['Todos', 'Ufes', 'Ifes'];

  const filtered = inscricoesData.filter((i) => {
    const matchSearch = searchTerm === '' || i.edital.toLowerCase().includes(searchTerm.toLowerCase()) || i.proponente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchArea   = areaFilter === 'Todas'   || i.setor  === areaFilter;
    const matchStatus = setorFilter === 'Todos'  || i.status === setorFilter;
    return matchSearch && matchArea && matchStatus;
  });

  const activeFilters = [
    areaFilter !== 'Todas'  && areaFilter,
    setorFilter !== 'Todos' && setorFilter,
    instituicaoFilter !== 'Todos' && instituicaoFilter,
  ].filter(Boolean) as string[];

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', fontFamily: 'var(--font-family)' }}
      onClick={() => setOpenDrop(null)}
    >
      {/* ── Top bar (mobile-style app bar) ── */}
      <header style={{
        backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`,
        boxShadow: C.shadow, position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 16px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          {/* Left: icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: C.primaryBg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ClipboardList size={17} style={{ color: C.primary }} />
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)', color: C.textPrimary,
                margin: 0, lineHeight: 1.2,
              }}>
                Editais
              </h1>
              {/* subtitle only on desktop */}
              <p className="hidden sm:block" style={{
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
                color: C.textSecond, margin: 0,
              }}>
                Editais abertos e em andamento
              </p>
            </div>
          </div>

          {/* Right: filter toggle (mobile) + create button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mobile filter button */}
            <button
              className="sm:hidden"
              onClick={(e) => { e.stopPropagation(); setShowMobileFilters(!showMobileFilters); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                border: `1px solid ${activeFilters.length ? C.primary : C.border}`,
                borderRadius: '8px', padding: '7px 10px',
                backgroundColor: activeFilters.length ? C.primaryBg : C.surface,
                color: activeFilters.length ? C.primary : C.textSecond,
                cursor: 'pointer', fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <Filter size={14} />
              {activeFilters.length > 0 && (
                <span style={{
                  backgroundColor: C.primary, color: '#fff',
                  borderRadius: '9999px', width: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 'var(--font-weight-medium)',
                }}>
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Create button */}
            <button
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: hoverBtn ? C.primaryDark : C.primary,
                border: 'none', borderRadius: '8px',
                padding: '8px 14px',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)', color: '#ffffff',
                cursor: 'pointer', transition: 'background-color 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Formulário de Inscrição</span>
              <span className="sm:hidden">Novo</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 16px 40px' }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Stats cards ── */}
        <div style={{
          display: 'grid',
          gap: '12px',
          marginBottom: '20px',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
          className="sm:grid-cols-3 lg:grid-cols-5"
        >
          {stats.map(({ label, value, icon: Icon, accent, accentBg }) => (
            <div key={label} style={{
              backgroundColor: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '10px', padding: '16px', boxShadow: C.shadow,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: accentBg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} style={{ color: accent }} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
                  color: C.textSecond, lineHeight: 1.3,
                }}>
                  {label}
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-medium)', color: C.textPrimary,
                margin: 0, lineHeight: 1,
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filters — DESKTOP ── */}
        <div className="hidden sm:grid" style={{
          gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px',
          marginBottom: '16px',
        }}>
          {/* Search */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: C.textSecond, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pesquisar
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text" placeholder="Buscar"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', backgroundColor: C.surface,
                  border: `1px solid ${searchTerm ? C.primary : C.border}`,
                  borderRadius: '8px', padding: '9px 12px 9px 34px',
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                  color: C.textPrimary, outline: 'none', boxSizing: 'border-box',
                  boxShadow: searchTerm ? `0 0 0 3px ${C.primary}22` : 'none',
                  transition: 'all 0.15s',
                }}
                onFocus={(e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22`; }}
                onBlur={(e) => { if (!searchTerm) { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; } }}
              />
              <Search size={14} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', color: C.textMuted, pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: C.textSecond, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Data
            </label>
            <input
              type="text" placeholder="dd/mm/yyyy"
              value={dataFilter} onChange={(e) => setDataFilter(e.target.value)}
              style={{
                width: '100%', backgroundColor: C.surface,
                border: `1px solid ${C.border}`, borderRadius: '8px',
                padding: '9px 12px', fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)', color: C.textPrimary,
                outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22`; }}
              onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown label="Área" value={areaFilter} options={areaOptions}
              open={openDrop === 'area'} onToggle={() => toggle('area')}
              onSelect={(v) => { setAreaFilter(v); setOpenDrop(null); }} />
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown label="Status" value={setorFilter} options={setorOptions}
              open={openDrop === 'status'} onToggle={() => toggle('status')}
              onSelect={(v) => { setSetorFilter(v); setOpenDrop(null); }} />
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown label="Instituição" value={instituicaoFilter} options={instituicaoOptions}
              open={openDrop === 'inst'} onToggle={() => toggle('inst')}
              onSelect={(v) => { setInstituicaoFilter(v); setOpenDrop(null); }} />
          </div>
        </div>

        {/* ── Filters — MOBILE (drawer) ── */}
        {showMobileFilters && (
          <div className="sm:hidden" style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '16px', marginBottom: '16px',
            boxShadow: C.shadowMd,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: C.textPrimary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SlidersHorizontal size={14} style={{ color: C.primary }} />
                Filtros
              </span>
              {activeFilters.length > 0 && (
                <button onClick={() => { setAreaFilter('Todas'); setSetorFilter('Todos'); setInstituicaoFilter('Todos'); }}
                  style={{ border: 'none', backgroundColor: 'transparent', color: C.primary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}>
                  Limpar tudo
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Search mobile */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: C.textSecond, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pesquisar</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '9px 12px 9px 34px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: C.textPrimary, outline: 'none', boxSizing: 'border-box' }} />
                  <Search size={14} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', color: C.textMuted }} />
                </div>
              </div>

              {/* Status chips */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: C.textSecond, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {setorOptions.map((opt) => {
                    const active = setorFilter === opt;
                    return (
                      <button key={opt} onClick={() => setSetorFilter(opt)}
                        style={{
                          padding: '5px 12px', borderRadius: '9999px',
                          border: `1px solid ${active ? C.primary : C.border}`,
                          backgroundColor: active ? C.primaryBg : C.surface,
                          color: active ? C.primary : C.textSecond,
                          fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
                          fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Area chips */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: C.textSecond, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Área</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {areaOptions.map((opt) => {
                    const active = areaFilter === opt;
                    return (
                      <button key={opt} onClick={() => setAreaFilter(opt)}
                        style={{
                          padding: '5px 12px', borderRadius: '9999px',
                          border: `1px solid ${active ? C.primary : C.border}`,
                          backgroundColor: active ? C.primaryBg : C.surface,
                          color: active ? C.primary : C.textSecond,
                          fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
                          fontWeight: active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Active filter chips ── */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {activeFilters.map((f) => (
              <span key={f} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                backgroundColor: C.primaryBg, border: `1px solid ${C.primary}44`,
                borderRadius: '9999px', padding: '3px 10px',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
                color: C.primary, fontWeight: 'var(--font-weight-medium)',
              }}>
                {f}
                <button onClick={() => {
                  if (areaOptions.includes(f as AreaFilter)) setAreaFilter('Todas');
                  else if (setorOptions.includes(f as SetorFilter)) setSetorFilter('Todos');
                  else setInstituicaoFilter('Todos');
                }} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: C.primary }}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* ── Results count ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: C.textMuted, margin: 0 }}>
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>

        {/* ── List ── */}
        {/* Mobile cards */}
        <div className="sm:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((item) => <MobileCard key={item.id} item={item} />)}
        </div>

        {/* Desktop rows */}
        <div className="hidden sm:flex" style={{ flexDirection: 'column', gap: '8px' }}>
          {filtered.map((item) => <DesktopRow key={item.id} item={item} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '48px 16px',
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', boxShadow: C.shadow,
          }}>
            <ClipboardList size={32} style={{ color: C.textMuted, margin: '0 auto 12px' }} />
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: C.textSecond, margin: 0 }}>
              Nenhum edital encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};