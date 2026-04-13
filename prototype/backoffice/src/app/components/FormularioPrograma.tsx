import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Home, Save, Send, Plus, Trash2, ChevronDown, Search, X } from 'lucide-react';

interface Membro { id: number; nome: string; }
interface Objetivo { id: number; descricao: string; }
interface ItemLista { id: number; texto: string; }
interface Recurso { id: number; valor: string; instituicao: string; dataAporte: string; documento: string; }

interface Props {
  onBack: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.7)',
  display: 'block',
  marginBottom: '6px',
};

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: '#ffffff',
  margin: '0 0 4px',
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.5)',
  margin: '0 0 24px',
};

const dividerStyle: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  margin: '20px 0',
};

// ── Select simples ──────────────────────────────────────────────────────────
const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => {
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
          backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius)', zIndex: 300, overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
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

// ── Select com busca (combobox) ─────────────────────────────────────────────
const SearchableSelect: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const displayValue = options.find(o => o.value === value)?.label ?? value;
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

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
          placeholder={open ? 'Buscar pesquisador...' : (placeholder || 'Selecione ou digite...')}
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

// ── Lista dinâmica com limite de 100 chars (Benefícios / Resultados) ────────
const MAX_CHARS = 100;

const ListaDinamica: React.FC<{
  label: string;
  items: ItemLista[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, texto: string) => void;
  placeholder: string;
  addLabel: string;
}> = ({ label, items, onAdd, onRemove, onUpdate, placeholder, addLabel }) => (
  <div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
      {items.map((item, idx) => (
        <div key={item.id}>
          <label style={{ ...labelStyle, marginBottom: '6px' }}>{label} {idx + 1}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder={placeholder}
                value={item.texto}
                maxLength={MAX_CHARS}
                onChange={e => onUpdate(item.id, e.target.value)}
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <span style={{
                display: 'block',
                marginTop: '4px',
                fontFamily: 'var(--font-family)',
                fontSize: '11px',
                color: item.texto.length >= MAX_CHARS ? '#ef4444' : 'rgba(255,255,255,0.3)',
              }}>
                {item.texto.length}/{MAX_CHARS} caracteres
              </span>
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                style={{
                  width: '36px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius)',
                  background: 'transparent', cursor: 'pointer', flexShrink: 0,
                  transition: 'background-color 0.15s',
                  alignSelf: 'flex-start',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Trash2 size={14} style={{ color: 'rgba(239,68,68,0.7)' }} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0' }}>
      <button
        type="button"
        onClick={onAdd}
        style={{
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
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; e.currentTarget.style.borderColor = '#00c1af'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
      >
        <Plus size={14} />
        {addLabel}
      </button>
    </div>
  </div>
);

// ── Componente principal ────────────────────────────────────────────────────
export const FormularioPrograma: React.FC<Props> = ({ onBack }) => {
  // Seção 1
  const [nome, setNome] = useState('');
  const [instituicaoDemandante, setInstituicaoDemandante] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [parceria, setParceria] = useState('');
  const [planejamento, setPlanejamento] = useState('');
  const [eixos, setEixos] = useState<string[]>([]);

  // Modal Novo Planejamento
  const [showModalNovoPlanejamento, setShowModalNovoPlanejamento] = useState(false);
  const [novoPlanejamentoNome, setNovoPlanejamentoNome] = useState('');
  const [novoPlanejamentoDataInicio, setNovoPlanejamentoDataInicio] = useState('');
  const [novoPlanejamentoDataFim, setNovoPlanejamentoDataFim] = useState('');
  const [novoPlanejamentoEixos, setNovoPlanejamentoEixos] = useState<{ id: number; nome: string }[]>([]);
  const nextEixoId = useRef(1);

  // Seção 2
  const [resumo, setResumo] = useState('');
  const [riscos, setRiscos] = useState('');
  const [enquadramento, setEnquadramento] = useState('');
  const [beneficios, setBeneficios] = useState<ItemLista[]>([{ id: 1, texto: '' }]);
  const [resultados, setResultados] = useState<ItemLista[]>([{ id: 1, texto: '' }]);

  // Seção 3 - Comitê
  const [membros, setMembros] = useState<Membro[]>([{ id: 1, nome: '' }]);

  // Seção 4 - Recursos
  const [recursos, setRecursos] = useState<Recurso[]>([{ id: 1, valor: '', instituicao: '', dataAporte: '', documento: '' }]);

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

  const instituicoesOrigemOptions = [
    { value: 'ufes', label: 'Universidade Federal do Espírito Santo (Ufes)' },
    { value: 'ifes', label: 'Instituto Federal do Espírito Santo (Ifes)' },
    { value: 'gov', label: 'Governo do Espírito Santo' },
  ];

  const parceriasOptions = [
    { value: 'capes', label: 'Parceria FAPES-CAPES' },
    { value: 'fapesp', label: 'Parceria FAPES-FAPESP' },
    { value: 'cnpq', label: 'Parceria FAPES-CNPq' },
    { value: 'ufes', label: 'Parceria FAPES-Ufes' },
    { value: 'ifes', label: 'Parceria FAPES-Ifes' },
  ];

  const toggleEixo = (eixo: string) => {
    setEixos(prev => prev.includes(eixo) ? prev.filter(e => e !== eixo) : [...prev, eixo]);
  };

  const addMembro = () => setMembros(prev => [...prev, { id: Date.now(), nome: '' }]);
  const removeMembro = (id: number) => setMembros(prev => prev.filter(m => m.id !== id));
  const updateMembro = (id: number, nome: string) => setMembros(prev => prev.map(m => m.id === id ? { ...m, nome } : m));

  const addRecurso = () => setRecursos(prev => [...prev, { id: Date.now(), valor: '', instituicao: '', dataAporte: '', documento: '' }]);
  const removeRecurso = (id: number) => setRecursos(prev => prev.filter(r => r.id !== id));
  const updateRecurso = (id: number, field: keyof Omit<Recurso, 'id'>, value: string) =>
    setRecursos(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  // Benefícios
  const addBeneficio = () => setBeneficios(prev => [...prev, { id: Date.now(), texto: '' }]);
  const removeBeneficio = (id: number) => setBeneficios(prev => prev.filter(b => b.id !== id));
  const updateBeneficio = (id: number, texto: string) => setBeneficios(prev => prev.map(b => b.id === id ? { ...b, texto } : b));

  // Resultados
  const addResultado = () => setResultados(prev => [...prev, { id: Date.now(), texto: '' }]);
  const removeResultado = (id: number) => setResultados(prev => prev.filter(r => r.id !== id));
  const updateResultado = (id: number, texto: string) => setResultados(prev => prev.map(r => r.id === id ? { ...r, texto } : r));

  const totalRecursos = recursos.reduce((acc, r) => {
    const val = parseFloat(r.valor.replace(/\./g, '').replace(',', '.')) || 0;
    return acc + val;
  }, 0);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">

        {/* Breadcrumb — sem "Gestão de Captação" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}
          >
            Programa
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
            Novo Programa
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
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px' }}>
                Novo Programa
              </h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
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
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>1</span>
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
              <label style={labelStyle}>Instituição Demandante</label>
              <input type="text" placeholder="Ex: FAPES" value={instituicaoDemandante} onChange={e => setInstituicaoDemandante(e.target.value)} style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
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
            <SelectField
              label="Parceria"
              value={parceria}
              onChange={setParceria}
              placeholder="Selecione a parceria"
              options={parceriasOptions}
            />
          </div>

          <div style={{ marginBottom: planejamento ? '20px' : '0', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
            <SelectField
              label="Planejamento Estratégico"
              value={planejamento}
              onChange={setPlanejamento}
              placeholder="Selecione o planejamento estratégico"
              options={[{ value: 'pe2024', label: 'Planejamento Estratégico 2024-2027' }]}
            />
            <button
              type="button"
              onClick={() => setShowModalNovoPlanejamento(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'rgba(0,193,175,0.1)',
                border: '1px solid rgba(0,193,175,0.3)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#00c1af',
                transition: 'background-color 0.2s, border-color 0.2s',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)';
                e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)';
                e.currentTarget.style.borderColor = 'rgba(0,193,175,0.3)';
              }}
            >
              <Plus size={16} />
              Novo Planejamento
            </button>
          </div>

          {planejamento && (
            <>
              <div style={dividerStyle} />
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
                            <path d="M1 4L3.5 6.5L9 1" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            </>
          )}
        </div>

        {/* ── Seção 2: Informações Complementares ── */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>2</span>
            </div>
            <p style={sectionTitleStyle}>Informações Complementares</p>
          </div>
          <p style={sectionSubtitleStyle}>Detalhamento do escopo e contexto do programa.</p>

          {/* Resumo */}
          <div style={{ marginBottom: '24px' }}>
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

          {/* Benefícios — lista dinâmica */}
          <div style={{ marginBottom: '0' }}>
            <ListaDinamica
              label="Benefícios"
              items={beneficios}
              onAdd={addBeneficio}
              onRemove={removeBeneficio}
              onUpdate={updateBeneficio}
              placeholder="Descreva um benefício esperado..."
              addLabel="Adicionar Benefício"
            />
          </div>

          {/* Resultados — lista dinâmica */}
          <div style={{ marginBottom: '16px' }}>
            <ListaDinamica
              label="Resultados"
              items={resultados}
              onAdd={addResultado}
              onRemove={removeResultado}
              onUpdate={updateResultado}
              placeholder="Descreva um resultado esperado..."
              addLabel="Adicionar Resultado"
            />
          </div>

          {/* Riscos */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Riscos e Restrições para a Viabilidade Técnica</label>
            <textarea
              placeholder="Descreva riscos e restrições para a viabilidade técnica..."
              value={riscos}
              onChange={e => setRiscos(e.target.value)}
              style={textareaStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          {/* Enquadramento */}
          <div>
            <label style={labelStyle}>Enquadramento dos Projetos ao Programa - Forma de Repasse dos Recursos Financeiros</label>
            <textarea
              placeholder="Descreva o enquadramento dos projetos ao programa..."
              value={enquadramento}
              onChange={e => setEnquadramento(e.target.value)}
              style={textareaStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>
        </div>

        {/* ── Seção 3: Comitê de Governança ── */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>3</span>
            </div>
            <p style={sectionTitleStyle}>Comitê de Governança</p>
          </div>
          <p style={sectionSubtitleStyle}>Membros responsáveis pela governança do programa. Podem ser funcionários da Fapes ou pessoas da sociedade.</p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {membros.map((membro, idx) => (
                <div key={membro.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <SearchableSelect
                      label="Membro do Comitê"
                      value={membro.nome}
                      onChange={v => updateMembro(membro.id, v)}
                      options={pesquisadoresOptions}
                      placeholder="Selecione ou digite o nome..."
                    />
                  </div>
                  {membros.length > 1 && (
                    <button type="button" onClick={() => removeMembro(membro.id)}
                      style={{
                        marginTop: '22px', width: '36px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
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

        {/* ── Seção 4: Recursos ── */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>4</span>
            </div>
            <p style={sectionTitleStyle}>Recursos</p>
          </div>
          <p style={sectionSubtitleStyle}>Recursos financeiros destinados ao programa.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {recursos.map((r, idx) => (
              <div key={r.id}>
                {idx > 0 && <div style={{ ...dividerStyle, marginBottom: '16px' }} />}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>Valor (R$)</label>
                        <input type="text" placeholder="0,00" value={r.valor} onChange={e => updateRecurso(r.id, 'valor', e.target.value)} style={inputStyle}
                          onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
                      </div>
                      <div>
                        <SelectField label="Instituição de Origem" value={r.instituicao} onChange={v => updateRecurso(r.id, 'instituicao', v)} options={instituicoesOrigemOptions} placeholder="Selecione..." />
                      </div>
                      <div>
                        <label style={labelStyle}>Data do Aporte</label>
                        <input type="date" value={r.dataAporte} onChange={e => updateRecurso(r.id, 'dataAporte', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                          onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
                      </div>
                      <div>
                        <label style={labelStyle}>Documento de Descentralização</label>
                        <input type="text" placeholder="Ex: DES-2026-001" value={r.documento} onChange={e => updateRecurso(r.id, 'documento', e.target.value)} style={inputStyle}
                          onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'} />
                      </div>
                    </div>
                  </div>
                  {recursos.length > 1 && (
                    <button type="button" onClick={() => removeRecurso(r.id)}
                      style={{
                        marginTop: '22px', width: '36px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
              </div>
            ))}
          </div>

          {/* Total de Recursos */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: 'rgba(0,193,175,0.06)', border: '1px solid rgba(0,193,175,0.2)',
            borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: '16px',
          }}>
            <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
              Total de Recursos
            </span>
            <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>
              {formatCurrency(totalRecursos)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={addRecurso} style={addBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; e.currentTarget.style.borderColor = '#00c1af'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
            >
              <Plus size={14} />
              Adicionar Recurso
            </button>
          </div>
        </div>

        {/* ── Botões de ação ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button type="button"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius)', padding: '11px 20px',
              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)', color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer', transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Save size={15} />
            Salvar Rascunho
          </button>

          <button type="button"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#00c1af', border: 'none',
              borderRadius: 'var(--radius)', padding: '11px 20px',
              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)', color: '#0f172a',
              cursor: 'pointer', transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a99a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
          >
            <Send size={15} />
            Publicar Programa
          </button>
        </div>

      </div>

      {/* Modal Novo Planejamento */}
      {showModalNovoPlanejamento && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '24px 24px 20px',
            }}>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: '#ffffff',
                  margin: '0 0 6px',
                }}>
                  Criar Novo Planejamento
                </h3>
                <p style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                }}>
                  Insira as informações básicas
                </p>
              </div>
              <button
                onClick={() => setShowModalNovoPlanejamento(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Nome do Planejamento</label>
                <input
                  type="text"
                  placeholder="Ex: Planejamento Estratégico 2024-2027"
                  value={novoPlanejamentoNome}
                  onChange={e => setNovoPlanejamentoNome(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Data de Início</label>
                  <input
                    type="date"
                    value={novoPlanejamentoDataInicio}
                    onChange={e => setNovoPlanejamentoDataInicio(e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Data de Fim</label>
                  <input
                    type="date"
                    value={novoPlanejamentoDataFim}
                    onChange={e => setNovoPlanejamentoDataFim(e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Eixo</label>
                  <button
                    type="button"
                    onClick={() => {
                      setNovoPlanejamentoEixos([...novoPlanejamentoEixos, { id: nextEixoId.current++, nome: '' }]);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(0,193,175,0.1)',
                      border: '1px solid rgba(0,193,175,0.3)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#00c1af',
                      transition: 'background-color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(0,193,175,0.3)';
                    }}
                  >
                    <Plus size={14} />
                    Adicionar Eixo
                  </button>
                </div>

                {novoPlanejamentoEixos.map((eixo, index) => (
                  <div key={eixo.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
                    <input
                      type="text"
                      placeholder={`Ex: Eixo ${index + 1}`}
                      value={eixo.nome}
                      onChange={e => {
                        setNovoPlanejamentoEixos(novoPlanejamentoEixos.map(ex => 
                          ex.id === eixo.id ? { ...ex, nome: e.target.value } : ex
                        ));
                      }}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNovoPlanejamentoEixos(novoPlanejamentoEixos.filter(ex => ex.id !== eixo.id));
                      }}
                      style={{
                        padding: '10px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                      }}
                    >
                      <Trash2 size={16} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              padding: '16px 24px 24px',
            }}>
              <button
                onClick={() => {
                  setShowModalNovoPlanejamento(false);
                  setNovoPlanejamentoNome('');
                  setNovoPlanejamentoDataInicio('');
                  setNovoPlanejamentoDataFim('');
                  setNovoPlanejamentoEixos([]);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'rgba(255,255,255,0.7)',
                  transition: 'background-color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aqui você salvaria o novo planejamento
                  setShowModalNovoPlanejamento(false);
                  setNovoPlanejamentoNome('');
                  setNovoPlanejamentoDataInicio('');
                  setNovoPlanejamentoDataFim('');
                  setNovoPlanejamentoEixos([]);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#00c1af',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: '#0f172a',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#00a99a'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#00c1af'; }}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};