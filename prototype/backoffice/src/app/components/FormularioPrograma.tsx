import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Plus, Trash2, ChevronDown, Search } from 'lucide-react';
import { useThemeTokens } from '../theme/ThemeContext';

interface Membro { id: number; nome: string; }
interface AportePrograma { id: number; parceria: string; valor: string; dataAporte: string; }

interface Props {
  onBack: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--form-input-bg)',
  border: '1px solid var(--form-border)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  color: 'var(--form-text-primary)',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'var(--form-text-secondary)',
  display: 'block',
  marginBottom: '6px',
};

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--form-card-bg)',
  border: '1px solid var(--form-border)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--form-text-primary)',
  margin: '0 0 4px',
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'var(--form-text-muted)',
  margin: '0 0 24px 32px',
};

const dividerStyle: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'var(--form-divider)',
  margin: '20px 0',
};

const maskCurrency = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const numberValue = Number(digits) / 100;
  return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseCurrency = (value: string) => Number(value.replace(/\./g, '').replace(',', '.')) || 0;

const formatCurrency = (value: number) => (
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
);

// ── Select simples ──────────────────────────────────────────────────────────
const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => {
  const { T } = useThemeTokens();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <label style={labelStyle}>{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ color: value ? '#ffffff' : 'rgba(255,255,255,0.3)' }}>
          {value ? options.find(o => o.value === value)?.label : (placeholder || 'Selecione...')}
        </span>
        <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
          backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`,
          borderRadius: 'var(--radius)', zIndex: 300, overflow: 'hidden',
          boxShadow: T.shadowMd,
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none',
                backgroundColor: value === opt.value ? T.accentSoft : 'transparent',
                color: value === opt.value ? T.accent : T.textPrimary,
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = T.bgHover; }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Select com busca (combobox) ─────────────────────────────────────────────
const SearchableSelect: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; searchText?: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
}> = ({ label, value, onChange, options, placeholder, searchPlaceholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const displayValue = options.find(o => o.value === value)?.label ?? value;
  const filtered = options.filter(o => {
    const searchable = `${o.label} ${o.searchText ?? ''}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={labelStyle}>{label}</label>
      <div
        style={{
          ...inputStyle,
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'text', padding: '0',
        }}
        onClick={() => setOpen(true)}
      >
        <Search size={14} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginLeft: '12px' }} />
        <input
          type="text"
          placeholder={open ? (searchPlaceholder || 'Buscar...') : (placeholder || 'Selecione ou digite...')}
          value={open ? query : displayValue}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); }}
          onFocus={() => { setOpen(true); setQuery(''); }}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: value ? '#ffffff' : 'rgba(255,255,255,0.35)',
            fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
            padding: '10px 0',
          }}
        />
        <ChevronDown
          size={15}
          onClick={e => { e.stopPropagation(); setOpen(!open); setQuery(''); }}
          style={{
            color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginRight: '12px',
            cursor: 'pointer',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s',
          }}
        />
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
          backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius)', zIndex: 300, overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxHeight: '220px', overflowY: 'auto',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 14px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.4)' }}>
              Nenhum resultado
            </div>
          ) : filtered.map(opt => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={e => {
                e.preventDefault();
                onChange(opt.value);
                setOpen(false);
                setQuery('');
              }}
              style={{
                width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none',
                backgroundColor: value === opt.value ? 'rgba(0,193,175,0.1)' : 'transparent',
                color: value === opt.value ? '#00c1af' : '#ffffff',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Componente principal ────────────────────────────────────────────────────
export const FormularioPrograma: React.FC<Props> = ({ onBack }) => {
  const { T } = useThemeTokens();
  // Seção 1
  const [nome, setNome] = useState('');
  const [instituicaoDemandante, setInstituicaoDemandante] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [planejamento, setPlanejamento] = useState('');
  const [eixos, setEixos] = useState<string[]>([]);

  const [resumo, setResumo] = useState('');

  // Seção 2 - Aporte financeiro
  const [aportes, setAportes] = useState<AportePrograma[]>([{ id: 1, parceria: '', valor: '', dataAporte: '' }]);

  // Seção 3 - Comitê
  const [membros, setMembros] = useState<Membro[]>([{ id: 1, nome: '' }]);

  const eixosOptions = [
    'Ciência e Tecnologia',
    'Inovação e Desenvolvimento',
    'Formação de Recursos Humanos',
    'Infraestrutura de Pesquisa',
  ];

  const pesquisadoresOptions = [
    { value: 'marcos', label: 'Prof. Dr. Marcos Andrade' },
    { value: 'fernanda', label: 'Dra. Fernanda Rocha' },
    { value: 'eduardo', label: 'Prof. Eduardo Martins' },
    { value: 'carla', label: 'Dra. Carla Vasconcelos' },
    { value: 'ricardo', label: 'Prof. Dr. Ricardo Fontes' },
    { value: 'patricia', label: 'Dra. Patrícia Lemos' },
  ];

  const instituicoesDemandantesOptions = [
    { value: 'fapes', label: 'FAPES - Fundação de Amparo à Pesquisa e Inovação do Espírito Santo', searchText: 'FAPES 07.436.100/0001-46' },
    { value: 'ufes', label: 'UFES - Universidade Federal do Espírito Santo', searchText: 'UFES 32.479.123/0001-43' },
    { value: 'ifes', label: 'IFES - Instituto Federal do Espírito Santo', searchText: 'IFES 10.838.653/0001-06' },
    { value: 'secti', label: 'SECTI - Secretaria de Ciência, Tecnologia, Inovação e Educação Profissional', searchText: 'SECTI 27.080.530/0001-43' },
    { value: 'fucape', label: 'Fucape Business School', searchText: 'Fucape 03.324.470/0001-23' },
  ];

  const parceriasOptions = [
    { value: 'parceria-fapes-capes', label: 'Parceria FAPES-CAPES', searchText: 'CAPES saldo disponível 1.250.000,00' },
    { value: 'parceria-fapes-cnpq', label: 'Parceria FAPES-CNPq', searchText: 'CNPq saldo disponível 980.000,00' },
    { value: 'parceria-fapes-ifes', label: 'Parceria Fapes-Ifes para Inovação', searchText: 'Ifes saldo disponível 640.000,00' },
    { value: 'parceria-lisboa', label: 'Parceria Internacional - Universidade de Lisboa', searchText: 'Universidade de Lisboa saldo disponível 2.400.000,00' },
    { value: 'parceria-mit', label: 'Parceria Internacional MIT', searchText: 'MIT saldo disponível 1.800.000,00' },
  ];

  const toggleEixo = (eixo: string) => {
    setEixos(prev => prev.includes(eixo) ? prev.filter(e => e !== eixo) : [...prev, eixo]);
  };

  const addMembro = () => setMembros(prev => [...prev, { id: Date.now(), nome: '' }]);
  const removeMembro = (id: number) => setMembros(prev => prev.filter(m => m.id !== id));
  const updateMembro = (id: number, nome: string) => setMembros(prev => prev.map(membro => membro.id === id ? { ...membro, nome } : membro));

  const addAporte = () => setAportes(prev => [...prev, { id: Date.now(), parceria: '', valor: '', dataAporte: '' }]);
  const removeAporte = (id: number) => setAportes(prev => prev.filter(aporte => aporte.id !== id));
  const updateAporte = (id: number, field: keyof Omit<AportePrograma, 'id'>, value: string) => {
    setAportes(prev => prev.map(aporte => aporte.id === id ? { ...aporte, [field]: value } : aporte));
  };

  const totalAportado = aportes.reduce((total, aporte) => total + parseCurrency(aporte.valor), 0);

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '88px',
    lineHeight: '1.6',
  };

  const addBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(0,193,175,0.4)',
    borderRadius: 'var(--radius)',
    padding: '8px 14px',
    color: '#00c1af',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    flexShrink: 0,
  };

  return (
    <div
      style={{
        backgroundColor: T.bgPage,
        minHeight: '100vh',
        '--form-card-bg': T.bgCard,
        '--form-input-bg': T.bgInput,
        '--form-border': T.borderDefault,
        '--form-divider': T.borderSubtle,
        '--form-text-primary': T.textPrimary,
        '--form-text-secondary': T.textSecondary,
        '--form-text-muted': T.textMuted,
      } as React.CSSProperties}
    >
      <div className="pt-8 px-8 pb-16">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)' }}
          >
            Programa
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
            Criar Programa
          </span>
        </div>

        {/* Título da tela */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(0,193,175,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Plus size={18} style={{ color: '#00c1af' }} />
            </div>
            <div style={{ flex: 1, marginTop: '6px' }}>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 4px' }}>
                Criar Programa
              </h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
                Preencha as informações abaixo para criar um novo programa de fomento.
              </p>
            </div>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '20px' }} />
        </div>

        {/* ── Seção 1: Identificação ── */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>1</span>
            </div>
            <p style={sectionTitleStyle}>Identificação do Programa</p>
          </div>
          <p style={sectionSubtitleStyle}>Informações básicas do programa de fomento.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Nome</label>
              <input type="text" placeholder="Nome do programa" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
            <div>
              <SearchableSelect
                label="Instituição Demandante"
                value={instituicaoDemandante}
                onChange={setInstituicaoDemandante}
                options={instituicoesDemandantesOptions}
                placeholder="Busque por nome ou CNPJ"
                searchPlaceholder="Buscar por nome ou CNPJ..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Data de Início</label>
              <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
            <div>
              <label style={labelStyle}>Data de Fim</label>
              <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Resumo</label>
            <textarea
              placeholder="Descreva um resumo com a justificativa e o objetivo geral do programa"
              value={resumo}
              onChange={e => setResumo(e.target.value)}
              style={textareaStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <SelectField
              label="Planejamento Estratégico"
              value={planejamento}
              onChange={setPlanejamento}
              placeholder="Selecione o planejamento estratégico"
              options={[
                { value: 'pe2026', label: 'Planejamento Estratégico 2026-2029' },
                { value: 'pe2024', label: 'Planejamento Estratégico 2024-2027' },
              ]}
            />
          </div>

          <div>
            <label style={labelStyle}>Selecione o Eixo Estratégico</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {eixosOptions.map(eixo => (
                <button key={eixo} type="button" onClick={() => toggleEixo(eixo)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '8px 12px', borderRadius: 'var(--radius)',
                    backgroundColor: eixos.includes(eixo) ? 'rgba(0,193,175,0.08)' : 'rgba(255,255,255,0.03)',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => { if (!eixos.includes(eixo)) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { if (!eixos.includes(eixo)) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
                >
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                    border: eixos.includes(eixo) ? '2px solid #00c1af' : '2px solid rgba(255,255,255,0.25)',
                    backgroundColor: eixos.includes(eixo) ? '#00c1af' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {eixos.includes(eixo) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: eixos.includes(eixo) ? '#00c1af' : 'rgba(255,255,255,0.8)' }}>
                    {eixo}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Seção 2: Aporte financeiro ── */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>2</span>
            </div>
            <p style={sectionTitleStyle}>Aporte Financeiro</p>
          </div>
          <p style={sectionSubtitleStyle}>Recursos destinados ao programa por meio de uma ou mais parcerias.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {aportes.map((aporte, idx) => (
              <div key={aporte.id}>
                {idx > 0 && <div style={{ ...dividerStyle, marginBottom: '16px' }} />}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1.4fr) minmax(160px, 0.7fr) minmax(150px, 0.6fr) auto', gap: '12px', alignItems: 'end' }}>
                  <SearchableSelect
                    label="Parceria aportante"
                    value={aporte.parceria}
                    onChange={value => updateAporte(aporte.id, 'parceria', value)}
                    options={parceriasOptions}
                    placeholder="Busque uma parceria"
                    searchPlaceholder="Buscar parceria..."
                  />
                  <div>
                    <label style={labelStyle}>Valor aportado (R$)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0,00"
                      value={aporte.valor}
                      onChange={e => updateAporte(aporte.id, 'valor', maskCurrency(e.target.value))}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Data do aporte</label>
                    <input
                      type="date"
                      value={aporte.dataAporte}
                      onChange={e => updateAporte(aporte.id, 'dataAporte', e.target.value)}
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                  </div>
                  {aportes.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeAporte(aporte.id)}
                      style={{
                        width: '36px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 'var(--radius)',
                        background: 'transparent', cursor: 'pointer', flexShrink: 0,
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 size={14} style={{ color: 'rgba(239,68,68,0.7)' }} />
                    </button>
                  ) : (
                    <div style={{ width: '36px' }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '16px',
          }}>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)' }}>
                Total aportado no programa
              </span>
              <span style={{ display: 'block', marginTop: '4px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>
                {formatCurrency(totalAportado)}
              </span>
            </div>
            <button
              type="button"
              onClick={addAporte}
              style={addBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; e.currentTarget.style.borderColor = '#00c1af'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
            >
              <Plus size={14} />
              Adicionar Parceria
            </button>
          </div>
        </div>

        {/* ── Seção 3: Comitê de Governança ── */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>3</span>
            </div>
            <p style={sectionTitleStyle}>Comitê de Governança</p>
          </div>
          <p style={sectionSubtitleStyle}>Membros responsáveis pela governança do programa. Podem ser funcionários da Fapes ou pessoas da sociedade.</p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {membros.map((membro, idx) => (
                <div key={membro.id} style={{ display: 'flex', alignItems: 'end', gap: '10px' }}>
                  {idx > 0 && <div style={{ ...dividerStyle, marginBottom: '16px' }} />}
                  <div style={{ flex: 1 }}>
                    <SearchableSelect
                      label="Pessoa do Comitê"
                      value={membro.nome}
                      onChange={v => updateMembro(membro.id, v)}
                      options={pesquisadoresOptions}
                      placeholder="Selecione ou digite o nome..."
                      searchPlaceholder="Buscar pesquisador..."
                    />
                  </div>
                  {membros.length > 1 && (
                    <button type="button" onClick={() => removeMembro(membro.id)}
                      style={{
                        marginBottom: 0,
                        width: '36px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)',
                        background: 'transparent', cursor: 'pointer', flexShrink: 0,
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 size={14} style={{ color: 'rgba(239,68,68,0.7)' }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button type="button" onClick={addMembro} style={addBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; e.currentTarget.style.borderColor = '#00c1af'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
              >
                <Plus size={14} />
                Adicionar Membro
              </button>
            </div>
          </div>
        </div>

        {/* ── Botões de ação ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button type="button"
            style={{
              display: 'flex', alignItems: 'center',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius)', padding: '11px 20px',
              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-secondary)',
              cursor: 'pointer', transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Salvar Rascunho
          </button>

          <button type="button"
            style={{
              display: 'flex', alignItems: 'center',
              backgroundColor: '#00c1af', border: 'none',
              borderRadius: 'var(--radius)', padding: '11px 20px',
              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)', color: '#171717',
              cursor: 'pointer', transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a99a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
          >
            Ativar Programa
          </button>
        </div>

      </div>

    </div>
  );
};
