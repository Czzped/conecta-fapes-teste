import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronDown, Plus, Trash2, Copy,
  AlignLeft, AlignJustify, Circle, CheckSquare, List,
  Upload, Star, Grid2x2, LayoutGrid, Calendar, Clock,
  GripHorizontal, X, Minus, Save, Send, BookOpen,
} from 'lucide-react';
import { ConfiguracoesPageHeader } from './ConfiguracoesPageHeader';

/* ─── Types ─────────────────────────────────────────────── */
type FieldType =
  | 'resposta_curta' | 'paragrafo'
  | 'multipla_escolha' | 'caixas_selecao' | 'lista_suspensa'
  | 'upload' | 'escala_linear' | 'classificacao'
  | 'grade_multipla' | 'grade_caixas'
  | 'data' | 'horario';

interface Opcao { id: number; texto: string; }

interface Questao {
  id: number;
  pergunta: string;
  tipo: FieldType;
  obrigatoria: boolean;
  opcoes: Opcao[];
  escalaMin: number;
  escalaMax: number;
  escalaMinLabel: string;
  escalaMaxLabel: string;
  linhas: Opcao[];
  colunas: Opcao[];
  numEstrelas: number;
}

interface FieldTypeDef {
  value: FieldType;
  label: string;
  icon: React.ReactNode;
  separator?: boolean;
}

interface Props { onBack: () => void; }

/* ─── Helpers ────────────────────────────────────────────── */
let _uid = 400;
const uid = () => ++_uid;
const mkOpcao = (t: string): Opcao => ({ id: uid(), texto: t });
const mkQuestao = (): Questao => ({
  id: uid(), pergunta: '', tipo: 'multipla_escolha', obrigatoria: false,
  opcoes: [mkOpcao('Opção 1')],
  escalaMin: 1, escalaMax: 5, escalaMinLabel: '', escalaMaxLabel: '',
  linhas: [mkOpcao('Linha 1')], colunas: [mkOpcao('Coluna 1')],
  numEstrelas: 5,
});

/* ─── Field type definitions ─────────────────────────────── */
const FIELD_TYPES: FieldTypeDef[] = [
  { value: 'resposta_curta',   label: 'Resposta curta',              icon: <AlignLeft size={15} /> },
  { value: 'paragrafo',        label: 'Parágrafo',                   icon: <AlignJustify size={15} /> },
  { value: 'multipla_escolha', label: 'Múltipla escolha',            icon: <Circle size={15} />,      separator: true },
  { value: 'caixas_selecao',   label: 'Caixas de seleção',           icon: <CheckSquare size={15} /> },
  { value: 'lista_suspensa',   label: 'Lista suspensa',              icon: <List size={15} /> },
  { value: 'upload',           label: 'Upload de arquivo',           icon: <Upload size={15} />,      separator: true },
  { value: 'escala_linear',    label: 'Escala linear',               icon: <Minus size={15} />,       separator: true },
  { value: 'classificacao',    label: 'Classificação',               icon: <Star size={15} /> },
  { value: 'grade_multipla',   label: 'Grade de múltipla escolha',   icon: <Grid2x2 size={15} /> },
  { value: 'grade_caixas',     label: 'Grade da caixa de seleção',   icon: <LayoutGrid size={15} /> },
  { value: 'data',             label: 'Data',                        icon: <Calendar size={15} />,    separator: true },
  { value: 'horario',          label: 'Horário',                     icon: <Clock size={15} /> },
];

const EDITAIS_OPTS = [
  { value: '001', label: '001/2026 - Bolsas de Pesquisa' },
  { value: '002', label: '002/2026 - Inovação Tecnológica' },
  { value: '003', label: '003/2026 - Extensão Universitária' },
  { value: '004', label: '004/2026 - Desenvolvimento Regional' },
  { value: '005', label: '005/2026 - Carreira Científica' },
];

/* ─── Shared style tokens ────────────────────────────────── */
const CARD: React.CSSProperties = {
  backgroundColor: 'rgba(38, 38, 38,0.6)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  overflow: 'hidden',
  marginBottom: '12px',
};

const INLINE_INPUT: React.CSSProperties = {
  backgroundColor: 'transparent', border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  color: '#ffffff', fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)', padding: '7px 0', outline: 'none', width: '100%',
};

const BTN_GHOST: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: '8px', borderRadius: '6px',
  color: 'rgba(255,255,255,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background-color 0.15s, color 0.15s',
};

/* ─── Toggle component ───────────────────────────────────── */
const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    onClick={e => { e.stopPropagation(); onChange(); }}
    style={{
      width: '38px', height: '20px', borderRadius: '10px', border: 'none',
      cursor: 'pointer', padding: '2px', flexShrink: 0,
      backgroundColor: checked ? '#00c1af' : 'rgba(255,255,255,0.18)',
      display: 'flex', alignItems: 'center',
      justifyContent: checked ? 'flex-end' : 'flex-start',
      transition: 'background-color 0.2s',
    }}
    aria-checked={checked}
  >
    <div style={{
      width: '16px', height: '16px', borderRadius: '50%',
      backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
    }} />
  </button>
);

/* ─── Option row (shared by multiple/checkbox/dropdown) ─── */
const OptionRow: React.FC<{
  opcao: Opcao; index: number; isActive: boolean;
  tipo: FieldType;
  onUpdate: (texto: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}> = ({ opcao, index, isActive, tipo, onUpdate, onRemove, canRemove }) => {
  const indicator =
    tipo === 'multipla_escolha' ? (
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.25)', flexShrink: 0 }} />
    ) : tipo === 'caixas_selecao' ? (
      <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: '2px solid rgba(255,255,255,0.25)', flexShrink: 0 }} />
    ) : (
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.4)', flexShrink: 0, minWidth: '18px' }}>
        {index + 1}.
      </span>
    );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      {indicator}
      <input
        type="text"
        value={opcao.texto}
        onChange={e => onUpdate(e.target.value)}
        readOnly={!isActive}
        placeholder={`Opção ${index + 1}`}
        style={{ ...INLINE_INPUT, borderBottom: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)' }}
      />
      {isActive && canRemove && (
        <button onClick={onRemove} style={{ ...BTN_GHOST, padding: '4px', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────── */
export const FormularioPersonalizado: React.FC<Props> = ({ onBack }) => {
  const [edital, setEdital]             = useState('');
  const [showEditalDd, setShowEditalDd] = useState(false);
  const [formTitulo, setFormTitulo]     = useState('');
  const [formDesc, setFormDesc]         = useState('');
  const [questoes, setQuestoes]         = useState<Questao[]>(() => [mkQuestao()]);
  const [activeId, setActiveId]         = useState<number>(() => questoes[0].id);
  const [typeDdId, setTypeDdId]         = useState<number | null>(null);

  const editalRef = useRef<HTMLDivElement>(null);
  const typeRefs  = useRef<Record<number, HTMLDivElement | null>>({});

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (editalRef.current && !editalRef.current.contains(e.target as Node)) setShowEditalDd(false);
      // type dropdowns are closed per-button
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Questão CRUD ── */
  const updateQ = useCallback((id: number, patch: Partial<Questao>) =>
    setQuestoes(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q)), []);

  const addQ = (afterId?: number) => {
    const q = mkQuestao();
    setQuestoes(prev => {
      if (afterId === undefined) return [...prev, q];
      const idx = prev.findIndex(x => x.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, q);
      return next;
    });
    setActiveId(q.id);
  };

  const dupQ = (id: number) => {
    const orig = questoes.find(q => q.id === id);
    if (!orig) return;
    const dup: Questao = {
      ...orig, id: uid(),
      opcoes:  orig.opcoes.map(o  => ({ ...o,  id: uid() })),
      linhas:  orig.linhas.map(l  => ({ ...l,  id: uid() })),
      colunas: orig.colunas.map(c => ({ ...c,  id: uid() })),
    };
    setQuestoes(prev => {
      const idx = prev.findIndex(q => q.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, dup);
      return next;
    });
    setActiveId(dup.id);
  };

  const delQ = (id: number) => {
    setQuestoes(prev => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex(q => q.id === id);
      const next = prev.filter(q => q.id !== id);
      setActiveId(next[Math.max(0, idx - 1)].id);
      return next;
    });
  };

  /* ── Option CRUD helpers ── */
  const addOpcao = (qId: number, field: 'opcoes' | 'linhas' | 'colunas') => {
    setQuestoes(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const arr = q[field];
      const lbl: Record<string, string> = { opcoes: 'Opção', linhas: 'Linha', colunas: 'Coluna' };
      return { ...q, [field]: [...arr, mkOpcao(`${lbl[field]} ${arr.length + 1}`)] };
    }));
  };
  const remOpcao = (qId: number, oId: number, field: 'opcoes' | 'linhas' | 'colunas') => {
    setQuestoes(prev => prev.map(q => {
      if (q.id !== qId || q[field].length <= 1) return q;
      return { ...q, [field]: q[field].filter(o => o.id !== oId) };
    }));
  };
  const updOpcao = (qId: number, oId: number, texto: string, field: 'opcoes' | 'linhas' | 'colunas') => {
    setQuestoes(prev => prev.map(q => {
      if (q.id !== qId) return q;
      return { ...q, [field]: q[field].map(o => o.id === oId ? { ...o, texto } : o) };
    }));
  };

  /* ── Render question body ── */
  const renderBody = (q: Questao, isActive: boolean) => {
    const selectStyle: React.CSSProperties = {
      backgroundColor: 'rgba(38, 38, 38,0.8)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 'var(--radius)', padding: '6px 10px',
      color: '#ffffff', fontFamily: 'var(--font-family)',
      fontSize: 'var(--text-sm)', cursor: 'pointer', outline: 'none',
    };

    switch (q.tipo) {
      case 'resposta_curta':
        return (
          <div style={{ ...INLINE_INPUT, color: 'rgba(255,255,255,0.25)', pointerEvents: 'none', paddingBottom: '10px' }}>
            Resposta de texto curto
          </div>
        );

      case 'paragrafo':
        return (
          <div style={{ ...INLINE_INPUT, color: 'rgba(255,255,255,0.25)', pointerEvents: 'none', paddingBottom: '32px' }}>
            Resposta de texto longo
          </div>
        );

      case 'multipla_escolha':
      case 'caixas_selecao':
      case 'lista_suspensa':
        return (
          <div>
            {q.opcoes.map((o, i) => (
              <OptionRow key={o.id} opcao={o} index={i} isActive={isActive} tipo={q.tipo}
                onUpdate={txt => updOpcao(q.id, o.id, txt, 'opcoes')}
                onRemove={() => remOpcao(q.id, o.id, 'opcoes')}
                canRemove={q.opcoes.length > 1}
              />
            ))}
            {isActive && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <div style={{ width: '16px', flexShrink: 0 }} />
                <button onClick={() => addOpcao(q.id, 'opcoes')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                >
                  + Adicionar opção
                </button>
                {(q.tipo === 'multipla_escolha' || q.tipo === 'caixas_selecao') && (
                  <>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.25)' }}>ou</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af' }}>
                      adicionar "Outro"
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );

      case 'upload':
        return (
          <div style={{
            border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '8px',
            padding: '32px 20px', textAlign: 'center',
          }}>
            <Upload size={28} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 10px', display: 'block' }} />
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              O respondente poderá enviar um arquivo
            </p>
          </div>
        );

      case 'escala_linear':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <select value={q.escalaMin} onChange={e => updateQ(q.id, { escalaMin: +e.target.value })} style={selectStyle}>
                {[0, 1].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.4)' }}>a</span>
              <select value={q.escalaMax} onChange={e => updateQ(q.id, { escalaMax: +e.target.value })} style={selectStyle}>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {Array.from({ length: q.escalaMax - q.escalaMin + 1 }, (_, i) => i + q.escalaMin).map(n => (
                <div key={n} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {n}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '8px 12px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>{q.escalaMin}</span>
              <input type="text" placeholder="Rótulo (opcional)" value={q.escalaMinLabel}
                onChange={e => updateQ(q.id, { escalaMinLabel: e.target.value })}
                style={INLINE_INPUT} />
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>{q.escalaMax}</span>
              <input type="text" placeholder="Rótulo (opcional)" value={q.escalaMaxLabel}
                onChange={e => updateQ(q.id, { escalaMaxLabel: e.target.value })}
                style={INLINE_INPUT} />
            </div>
          </div>
        );

      case 'classificacao':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)' }}>Estrelas:</span>
              <select value={q.numEstrelas} onChange={e => updateQ(q.id, { numEstrelas: +e.target.value })} style={selectStyle}>
                {[3, 4, 5, 6, 7, 8, 9, 10].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: q.numEstrelas }, (_, i) => (
                <Star key={i} size={26}
                  style={{ color: i < 3 ? '#fbbf24' : 'rgba(255,255,255,0.15)', transition: 'color 0.2s' }}
                />
              ))}
            </div>
          </div>
        );

      case 'grade_multipla':
      case 'grade_caixas':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {(['linhas', 'colunas'] as const).map(field => (
              <div key={field}>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {field === 'linhas' ? 'Linhas' : 'Colunas'}
                </div>
                {q[field].map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)', minWidth: '16px', textAlign: 'right' }}>{idx + 1}.</span>
                    <input type="text" value={item.texto}
                      onChange={e => updOpcao(q.id, item.id, e.target.value, field)}
                      style={INLINE_INPUT} />
                    {q[field].length > 1 && isActive && (
                      <button onClick={() => remOpcao(q.id, item.id, field)}
                        style={{ ...BTN_GHOST, padding: '3px', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                      ><X size={13} /></button>
                    )}
                  </div>
                ))}
                {isActive && (
                  <button onClick={() => addOpcao(q.id, field)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af' }}
                  >
                    + Adicionar {field === 'linhas' ? 'linha' : 'coluna'}
                  </button>
                )}
              </div>
            ))}
          </div>
        );

      case 'data':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
            <div style={{ backgroundColor: 'rgba(38, 38, 38,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>
              <Calendar size={15} />
              DD/MM/AAAA
            </div>
          </div>
        );

      case 'horario':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
            <div style={{ backgroundColor: 'rgba(38, 38, 38,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>
              <Clock size={15} />
              HH:MM
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const typeDef = (tipo: FieldType) => FIELD_TYPES.find(f => f.value === tipo)!;

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div style={{ backgroundColor: '#171717', minHeight: '100vh' }}>
      <div style={{ padding: '32px 32px 80px' }}>

        <ConfiguracoesPageHeader
          title="Formulários"
          subtitle="Crie um novo formulário."
          icon={BookOpen}
          onBack={onBack}
        />

        {/* Two-column layout: form + sidebar */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* ── Main form area ── */}
          <div style={{ flex: 1 }}>

            {/* ① Edital selection */}
            <div ref={editalRef} style={{ ...CARD, marginBottom: '16px', overflow: 'visible' }}>
              <div style={{ padding: '20px 24px' }}>
                <label style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
                  Vincular Formulário de Submissão ao Edital:
                </label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowEditalDd(!showEditalDd)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      backgroundColor: 'rgba(38, 38, 38,0.8)', border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 'var(--radius)', padding: '11px 14px',
                      fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
                      color: edital ? '#ffffff' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    <span>{edital ? EDITAIS_OPTS.find(o => o.value === edital)?.label : 'Selecione o edital...'}</span>
                    <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.4)', transform: showEditalDd ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>
                  {showEditalDd && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
                      backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 'var(--radius)', zIndex: 300, overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    }}>
                      {EDITAIS_OPTS.map(opt => (
                        <button key={opt.value}
                          onClick={() => { setEdital(opt.value); setShowEditalDd(false); }}
                          style={{
                            width: '100%', padding: '11px 16px', textAlign: 'left', border: 'none',
                            backgroundColor: edital === opt.value ? 'rgba(0,193,175,0.1)' : 'transparent',
                            color: edital === opt.value ? '#00c1af' : '#ffffff',
                            fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
                          }}
                          onMouseEnter={e => { if (edital !== opt.value) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={e => { if (edital !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ② Form title card */}
            <div style={{ ...CARD, marginBottom: '16px' }}>
              <div style={{ padding: '24px 28px' }}>
                <input
                  type="text"
                  placeholder="Título do formulário"
                  value={formTitulo}
                  onChange={e => setFormTitulo(e.target.value)}
                  style={{
                    width: '100%', border: 'none', background: 'transparent', outline: 'none',
                    borderBottom: '2px solid rgba(255,255,255,0.15)',
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)',
                    fontWeight: 'var(--font-weight-medium)', color: '#ffffff',
                    padding: '8px 0 10px', marginBottom: '16px', boxSizing: 'border-box',
                  }}
                />
                <input
                  type="text"
                  placeholder="Descrição do formulário (opcional)"
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  style={{
                    width: '100%', border: 'none', background: 'transparent', outline: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                    color: 'rgba(255,255,255,0.7)', padding: '6px 0', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* ③ Question cards */}
            {questoes.map((q, qIdx) => {
              const isActive = q.id === activeId;
              const td = typeDef(q.tipo);

              return (
                <div key={q.id} style={{ position: 'relative' }}>
                  <div
                    onClick={() => { if (!isActive) { setActiveId(q.id); setTypeDdId(null); } }}
                    style={{
                      ...CARD,
                      border: isActive
                        ? '1px solid rgba(255,255,255,0.18)'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderLeft: 'none',
                      backgroundColor: isActive ? 'rgba(38, 38, 38,0.8)' : 'rgba(38, 38, 38,0.5)',
                      cursor: isActive ? 'default' : 'pointer',
                      transition: 'background-color 0.2s, border-color 0.2s',
                      marginBottom: '12px',
                    }}
                  >
                    {/* Drag handle */}
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 2px', color: 'rgba(255,255,255,0.15)' }}>
                      <GripHorizontal size={18} />
                    </div>

                    <div style={{ padding: '4px 24px 0' }}>
                      {/* Question number badge */}
                      {!isActive && (
                        <div style={{ marginBottom: '6px' }}>
                          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)' }}>
                            Informação Solicitada
                          </span>
                        </div>
                      )}

                      {/* Top row: Question input + Type selector */}
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
                        {/* Question text input */}
                        <div style={{ flex: 1 }}>
                          {isActive && (
                            <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '4px' }}>
                              Informação Solicitada
                            </span>
                          )}
                          <input
                            type="text"
                            placeholder="Informação"
                            value={q.pergunta}
                            onChange={e => updateQ(q.id, { pergunta: e.target.value })}
                            readOnly={!isActive}
                            style={{
                              width: '100%', border: 'none', background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                              outline: 'none', borderBottom: `2px solid ${isActive ? '#00c1af' : 'rgba(255,255,255,0.06)'}`,
                              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                              color: q.pergunta ? '#ffffff' : 'rgba(255,255,255,0.3)',
                              padding: isActive ? '10px 12px 10px' : '6px 0',
                              borderRadius: isActive ? '6px 6px 0 0' : '0',
                              boxSizing: 'border-box', cursor: isActive ? 'text' : 'pointer',
                              transition: 'background-color 0.2s',
                            }}
                          />
                        </div>

                        {/* Type selector — only fully interactive when active */}
                        <div style={{ position: 'relative', flexShrink: 0 }}
                          ref={el => { typeRefs.current[q.id] = el; }}
                        >
                          <button
                            disabled={!isActive}
                            onClick={e => { e.stopPropagation(); setTypeDdId(typeDdId === q.id ? null : q.id); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '8px',
                              backgroundColor: isActive ? 'rgba(38, 38, 38,0.9)' : 'transparent',
                              border: isActive ? '1px solid rgba(255,255,255,0.15)' : 'none',
                              borderRadius: 'var(--radius)', padding: isActive ? '10px 14px' : '6px 0',
                              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
                              fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                              cursor: isActive ? 'pointer' : 'default',
                              minWidth: isActive ? '220px' : 'auto',
                              justifyContent: 'space-between',
                              transition: 'background-color 0.2s',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {td.icon}
                              {isActive ? td.label : ''}
                            </div>
                            {isActive && (
                              <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.5)', transform: typeDdId === q.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                            )}
                          </button>

                          {/* Type dropdown */}
                          {typeDdId === q.id && (
                            <div
                              onClick={e => e.stopPropagation()}
                              style={{
                                position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '260px',
                                backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 'var(--radius)', zIndex: 500, overflow: 'hidden',
                                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                              }}
                            >
                              <div style={{ padding: '8px 14px 6px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                  Tipo de campo
                                </span>
                              </div>
                              <div style={{ padding: '6px 0' }}>
                                {FIELD_TYPES.map((ft, i) => (
                                  <React.Fragment key={ft.value}>
                                    {ft.separator && <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />}
                                    <button
                                      onClick={() => { updateQ(q.id, { tipo: ft.value }); setTypeDdId(null); }}
                                      style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '9px 16px', border: 'none', textAlign: 'left', cursor: 'pointer',
                                        backgroundColor: q.tipo === ft.value ? 'rgba(0,193,175,0.1)' : 'transparent',
                                        color: q.tipo === ft.value ? '#00c1af' : '#ffffff',
                                        fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                                        transition: 'background-color 0.1s',
                                      }}
                                      onMouseEnter={e => { if (q.tipo !== ft.value) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                                      onMouseLeave={e => { if (q.tipo !== ft.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                      <span style={{ color: q.tipo === ft.value ? '#00c1af' : 'rgba(255,255,255,0.55)', flexShrink: 0 }}>{ft.icon}</span>
                                      {ft.label}
                                      {q.tipo === ft.value && (
                                        <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00c1af', flexShrink: 0 }} />
                                      )}
                                    </button>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Question body */}
                      <div style={{ marginBottom: '20px' }}>
                        {renderBody(q, isActive)}
                      </div>
                    </div>

                    {/* Card footer — only active */}
                    {isActive && (
                      <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        padding: '10px 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px',
                      }}>
                        {/* Duplicate */}
                        <button onClick={() => dupQ(q.id)} title="Duplicar" style={BTN_GHOST}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#ffffff'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                        >
                          <Copy size={17} />
                        </button>

                        {/* Delete */}
                        <button onClick={() => delQ(q.id)} title="Excluir" style={BTN_GHOST}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                        >
                          <Trash2 size={17} />
                        </button>

                        {/* Divider */}
                        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 10px' }} />

                        {/* Required toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.65)' }}>
                            Obrigatória
                          </span>
                          <Toggle checked={q.obrigatoria} onChange={() => updateQ(q.id, { obrigatoria: !q.obrigatoria })} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add question between cards (shown below active) */}
                  {isActive && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '-4px 0 12px' }}>
                      <button
                        onClick={() => addQ(q.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          backgroundColor: 'rgba(0,193,175,0.06)',
                          border: '1px solid rgba(0,193,175,0.25)', borderRadius: '999px',
                          padding: '6px 18px', color: '#00c1af',
                          fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)',
                          cursor: 'pointer', transition: 'background-color 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.12)'; e.currentTarget.style.borderColor = '#00c1af'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.25)'; }}
                      >
                        <Plus size={13} />
                        Adicionar pergunta aqui
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius)', padding: '11px 20px',
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Save size={15} />
                Salvar Rascunho
              </button>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backgroundColor: '#00c1af', border: 'none',
                  borderRadius: 'var(--radius)', padding: '11px 20px',
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)', color: '#171717', cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a99a'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
              >
                <Send size={15} />
                Publicar Formulário
              </button>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div style={{
            position: 'sticky', top: '24px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: '8px',
            paddingTop: '220px',
          }}>
            {/* Add question */}
            <button
              onClick={() => addQ(activeId)}
              title="Adicionar pergunta"
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: '#00c1af', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,193,175,0.35)',
                transition: 'background-color 0.2s, transform 0.15s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#00a99a'; e.currentTarget.style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#00c1af'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Plus size={22} style={{ color: '#171717' }} />
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '2px auto' }} />

            {/* Duplicate active */}
            <button
              onClick={() => dupQ(activeId)}
              title="Duplicar pergunta"
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: 'rgba(38, 38, 38,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.2s, border-color 0.2s, transform 0.15s',
                color: 'rgba(255,255,255,0.5)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38,0.8)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Copy size={18} />
            </button>

            {/* Delete active */}
            <button
              onClick={() => delQ(activeId)}
              title="Excluir pergunta"
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: 'rgba(38, 38, 38,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.2s, border-color 0.2s, transform 0.15s',
                color: 'rgba(255,255,255,0.5)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38,0.8)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Trash2 size={18} />
            </button>

            {/* Question count */}
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.25)', display: 'block' }}>
                {questoes.length}
              </span>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {questoes.length === 1 ? 'campo' : 'campos'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
