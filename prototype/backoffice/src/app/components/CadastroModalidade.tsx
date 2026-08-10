import React, { useMemo, useState } from 'react';
import { Layers, Plus, Search, Pencil, Trash2, ArrowLeft, Save, ChevronRight } from 'lucide-react';
import { ThemeTokens, useThemeTokens } from '../theme/ThemeContext';

type Tipo = 'BOLSA' | 'AUXILIO';

interface Requisito {
  id: number;
  nome: string;
  comprovante: string;
  descricao: string;
}

interface Nivel {
  id: number;
  sigla: string;
  valor: string;
  moeda: string;
  requisitosExclusivos: number;
  acumulaComNivel?: boolean;
  nivelAcumulavel?: string;
}

interface Modalidade {
  id: number;
  tipo: Tipo;
  sigla: string;
  nome: string;
  versaoNome: string;
  versaoStatus: string;
  versaoAtiva: string;
  versaoEmEdicao: string;
  resolucao: string;
  descricao: string;
  possuiReducao: boolean;
  reducaoPercentual: string;
  dataVigencia: string;
  modalidadesCompativeis: string[];
  requisitos: Requisito[];
  niveis: Nivel[];
  // Auxílio
  cotaUnica?: boolean;
  auxCompativeisAuxilios?: string; // 'TODOS' | sigla
  auxCompativeisBolsas?: string; // 'TODOS' | sigla
}

const TODOS = 'TODOS';

const RESOLUCOES = ['Resolução 324', 'Resolução 310', 'Resolução 298'];
const MOEDAS: Array<[string, string]> = [['BRL', 'Real Brasileiro'], ['USD', 'Dólar Americano'], ['EUR', 'Euro']];

const emptyModalidade = (): Modalidade => ({
  id: 0,
  tipo: 'BOLSA',
  sigla: '',
  nome: '',
  versaoNome: '',
  versaoStatus: 'Em edição',
  versaoAtiva: '',
  versaoEmEdicao: '',
  resolucao: '',
  descricao: '',
  possuiReducao: false,
  reducaoPercentual: '',
  dataVigencia: '',
  modalidadesCompativeis: [],
  requisitos: [],
  niveis: [{ id: Date.now(), sigla: '', valor: '', moeda: 'BRL', requisitosExclusivos: 0, acumulaComNivel: false, nivelAcumulavel: '' }],
  cotaUnica: false,
  auxCompativeisAuxilios: TODOS,
  auxCompativeisBolsas: TODOS,
});

const initialModalidades: Modalidade[] = [
  { id: 1, tipo: 'BOLSA', sigla: 'ICT', nome: 'BOLSAS DE INICIAÇÃO CIENTÍFICA E TECNOLÓGICA', versaoNome: 'ICT-2025', versaoStatus: 'Ativa', versaoAtiva: 'ICT-2025', versaoEmEdicao: '', resolucao: 'Resolução 324', descricao: 'Concessão de bolsas de iniciação científica e tecnológica.', possuiReducao: true, reducaoPercentual: '60', dataVigencia: '2025-01-01', modalidadesCompativeis: ['BPIG'], requisitos: [], niveis: [{ id: 11, sigla: 'ICT-I', valor: '700,00', moeda: 'BRL', requisitosExclusivos: 0 }] },
  { id: 2, tipo: 'BOLSA', sigla: 'ICJR', nome: 'Programa de Iniciação Científica Júnior do Espírito Santo – Pesquisador do Futuro.', versaoNome: 'ICJR-2025', versaoStatus: 'Ativa', versaoAtiva: 'ICJR-2025', versaoEmEdicao: '', resolucao: 'Resolução 310', descricao: 'Iniciação científica júnior.', possuiReducao: false, reducaoPercentual: '', dataVigencia: '2025-01-01', modalidadesCompativeis: [], requisitos: [], niveis: [{ id: 21, sigla: 'ICJR-I', valor: '300,00', moeda: 'BRL', requisitosExclusivos: 0 }] },
  { id: 3, tipo: 'BOLSA', sigla: 'BCO', nome: 'Coordenador de Projeto de pesquisa/ICJr', versaoNome: 'BCO-2025', versaoStatus: 'Ativa', versaoAtiva: 'BCO-2025', versaoEmEdicao: '', resolucao: 'Resolução 324', descricao: 'Coordenação de projeto de pesquisa.', possuiReducao: true, reducaoPercentual: '50', dataVigencia: '2025-01-01', modalidadesCompativeis: ['ICJR'], requisitos: [], niveis: [{ id: 31, sigla: 'BCO-I', valor: '1.500,00', moeda: 'BRL', requisitosExclusivos: 1 }] },
  { id: 4, tipo: 'AUXILIO', sigla: 'AUX-MOR', nome: 'Auxílio Moradia', versaoNome: 'AUX-MOR-2025', versaoStatus: 'Ativa', versaoAtiva: 'AUX-MOR-2025', versaoEmEdicao: '', resolucao: '', descricao: '', possuiReducao: false, reducaoPercentual: '', dataVigencia: '', modalidadesCompativeis: [], requisitos: [], niveis: [{ id: 41, sigla: 'AUX-MOR-I', valor: '1.000,00', moeda: 'BRL', requisitosExclusivos: 0 }] },
];

const buildStyles = (T: ThemeTokens) => ({
  page: { minHeight: '100vh', backgroundColor: T.bgPage, padding: '32px' } as React.CSSProperties,
  card: { backgroundColor: T.bgCard, border: `1px solid ${T.borderSubtle}`, borderRadius: '12px', padding: '24px' } as React.CSSProperties,
  input: { width: '100%', minWidth: 0, backgroundColor: T.bgInput, border: `1px solid ${T.borderDefault}`, borderRadius: '8px', padding: '11px 12px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties,
  label: { display: 'block', marginBottom: '8px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' } as React.CSSProperties,
  cardTitle: { margin: 0, color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-semibold)' } as React.CSSProperties,
  subtitle: { margin: '4px 0 0', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', lineHeight: 1.5 } as React.CSSProperties,
  colLabel: { color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.02em' } as React.CSSProperties,
  primaryBtn: { height: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 18px', border: 'none', borderRadius: '8px', backgroundColor: T.accent, color: T.accentText, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' } as React.CSSProperties,
  ghostBtn: { height: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 16px', border: `1px solid ${T.borderDefault}`, borderRadius: '8px', backgroundColor: 'transparent', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer', whiteSpace: 'nowrap' } as React.CSSProperties,
});

type S = ReturnType<typeof buildStyles>;

interface Props {
  onBack: () => void;
}

export const CadastroModalidade: React.FC<Props> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const St = buildStyles(T);

  const [modalidades, setModalidades] = useState<Modalidade[]>(initialModalidades);
  const [view, setView] = useState<'lista' | 'form'>('lista');
  const [draft, setDraft] = useState<Modalidade>(emptyModalidade());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pesquisarPor, setPesquisarPor] = useState<'Nome' | 'Sigla'>('Nome');
  const [busca, setBusca] = useState('');

  const isAux = draft.tipo === 'AUXILIO';
  const rotuloEntidade = isAux ? 'Auxílio' : 'Modalidade';
  const rotuloDaEntidade = isAux ? 'do auxílio' : 'da modalidade';

  const filtered = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return modalidades;
    return modalidades.filter(m => (pesquisarPor === 'Nome' ? m.nome : m.sigla).toLowerCase().includes(q));
  }, [modalidades, busca, pesquisarPor]);

  const set = (patch: Partial<Modalidade>) => setDraft(prev => ({ ...prev, ...patch }));

  const abrirNovo = () => { setDraft(emptyModalidade()); setEditingId(null); setView('form'); };
  const abrirEdicao = (m: Modalidade) => { setDraft({ ...m }); setEditingId(m.id); setView('form'); };

  const temNivelComValor = draft.niveis.some(n => n.valor.trim() !== '');
  const podeSalvar = draft.sigla.trim() !== '' && draft.nome.trim() !== '' && draft.versaoNome.trim() !== '' && temNivelComValor
    && (isAux || (draft.resolucao.trim() !== '' && draft.descricao.trim() !== ''));

  const salvar = () => {
    if (!podeSalvar) return;
    const item: Modalidade = { ...draft, id: editingId || Date.now(), sigla: draft.sigla.trim().toUpperCase(), versaoAtiva: draft.versaoNome, versaoStatus: 'Ativa' };
    setModalidades(prev => editingId ? prev.map(m => (m.id === editingId ? item : m)) : [...prev, item]);
    setView('lista');
  };

  /* ─────────────── LISTA ─────────────── */
  if (view === 'lista') {
    return (
      <div style={St.page}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Breadcrumb T={T} trail={['Gestão de Bolsas', 'Modalidades']} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ color: '#7b8cff', marginTop: '2px' }}><Layers size={22} /></div>
              <div>
                <h1 style={{ margin: 0, color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Modalidades</h1>
                <p style={St.subtitle}>Cadastre e gerencie as modalidades de bolsa, suas versões e níveis.</p>
              </div>
            </div>
            <button type="button" onClick={abrirNovo} style={St.primaryBtn}><Plus size={16} /> Cadastrar modalidade</button>
          </div>

          <div style={{ height: '1px', backgroundColor: T.borderSubtle, margin: '20px 0 24px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 0.6fr) minmax(0, 1.6fr) auto', gap: '14px', alignItems: 'end' }}>
            <LabeledSelect St={St} label="Pesquisar por" value={pesquisarPor} onChange={v => setPesquisarPor(v as 'Nome' | 'Sigla')} options={['Nome', 'Sigla']} />
            <div>
              <label style={St.label}>Palavra-chave</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquise a palavra-chave" style={{ ...St.input, paddingLeft: '36px' }} />
              </div>
            </div>
            <button type="button" style={{ ...St.primaryBtn, height: '43px' }}><Search size={16} /> Buscar</button>
          </div>

          <p style={{ textAlign: 'right', margin: '14px 0 18px', color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>Apresentando {filtered.length} resultados</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map(m => (
              <div key={m.id} style={{ ...St.card, padding: '20px 24px', display: 'grid', gridTemplateColumns: 'minmax(120px, 0.7fr) minmax(0, 2fr) 150px 150px 44px', gap: '20px', alignItems: 'center' }}>
                <Field2 T={T} label="SIGLA" value={m.sigla} strong badge={<TipoBadge T={T} tipo={m.tipo} />} />
                <Field2 T={T} label="NOME" value={m.nome} strong clamp />
                <Field2 T={T} label="VERSÃO ATIVA" value={m.versaoAtiva || '—'} versaoBadge={!!m.versaoAtiva} T2={T} />
                <Field2 T={T} label="VERSÃO EM EDIÇÃO" value={m.versaoEmEdicao || '—'} />
                <button type="button" aria-label="Editar" onClick={() => abrirEdicao(m)} style={{ width: '38px', height: '38px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Pencil size={18} /></button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ ...St.card, textAlign: 'center', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>Nenhuma modalidade encontrada.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────── FORM (Cadastrar / Editar) ─────────────── */
  return (
    <div style={St.page}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <Breadcrumb T={T} trail={['Gestão de Bolsas', 'Modalidades', `${editingId ? 'Editar' : 'Cadastrar'} ${rotuloEntidade}`]} />
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <div style={{ color: '#7b8cff', marginTop: '2px' }}><Layers size={22} /></div>
            <div>
              <h1 style={{ margin: 0, color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>{editingId ? 'Editar' : 'Cadastrar'} {rotuloEntidade}</h1>
              <p style={St.subtitle}>Edite as informações {rotuloDaEntidade}, gerencie requisitos e níveis.</p>
            </div>
          </div>
        </div>

        {/* Card 1 — Informações */}
        <section style={St.card}>
          <h2 style={{ ...St.cardTitle, marginBottom: '18px' }}>Informações {rotuloDaEntidade}</h2>

          {/* Toggle Tipo (Bolsa / Auxílio) */}
          <div style={{ marginBottom: '18px' }}>
            <label style={St.label}>Tipo</label>
            <div style={{ display: 'inline-flex', padding: '4px', gap: '4px', backgroundColor: T.bgInput, border: `1px solid ${T.borderDefault}`, borderRadius: '10px' }}>
              {(['BOLSA', 'AUXILIO'] as Tipo[]).map(t => {
                const active = draft.tipo === t;
                return (
                  <button key={t} type="button" onClick={() => set({ tipo: t })} style={{ padding: '8px 20px', border: 'none', borderRadius: '7px', cursor: 'pointer', backgroundColor: active ? T.accent : 'transparent', color: active ? T.accentText : T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {t === 'BOLSA' ? 'Bolsa' : 'Auxílio'}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }}>
              <LabeledSelect St={St} label="Resolução" required={!isAux} value={draft.resolucao} onChange={v => set({ resolucao: v })} options={[['', 'Selecione a resolução'], ...RESOLUCOES.map(r => [r, r] as [string, string])]} />
              <TextField St={St} label="Sigla" required value={draft.sigla} onChange={v => set({ sigla: v })} placeholder="BPIG" />
            </div>

            <TextField St={St} label={`Nome ${rotuloDaEntidade}`} required value={draft.nome} onChange={v => set({ nome: v })} placeholder="Bolsa em Projetos Institucionais de Governo" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <TextField St={St} label="Nome da versão" required value={draft.versaoNome} onChange={v => set({ versaoNome: v })} placeholder="BPIG-2025" />
              <TextField St={St} label="Status desta versão" value={draft.versaoStatus} onChange={() => {}} disabled />
            </div>

            <div>
              <label style={St.label}>Descrição {!isAux && <Req T={T} />}</label>
              <textarea value={draft.descricao} maxLength={500} onChange={e => set({ descricao: e.target.value })} placeholder="Descreva a modalidade" rows={4} style={{ ...St.input, resize: 'vertical', minHeight: '100px' }} />
              <p style={{ margin: '6px 0 0', color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>{draft.descricao.length}/500 caracteres</p>
            </div>

            {!isAux && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>
                <div>
                  <label style={{ ...St.label, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" checked={draft.possuiReducao} onChange={e => set({ possuiReducao: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: T.accent }} />
                    Redução em caso de vínculo empregatício <Req T={T} />
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input value={draft.reducaoPercentual} onChange={e => set({ reducaoPercentual: e.target.value })} disabled={!draft.possuiReducao} placeholder="60" style={{ ...St.input, opacity: draft.possuiReducao ? 1 : 0.5 }} />
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>%</span>
                  </div>
                  <p style={{ margin: '6px 0 0', color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>Percentual do valor da bolsa a ser pago em caso de vínculo empregatício.</p>
                </div>
                <TextField St={St} label="Data de vigência" required value={draft.dataVigencia} onChange={v => set({ dataVigencia: v })} type="date" />
              </div>
            )}

            {isAux && (
              <TextField St={St} label="Data de vigência" value={draft.dataVigencia} onChange={v => set({ dataVigencia: v })} type="date" />
            )}

            {isAux && (
              <>
                <div>
                  <label style={{ ...St.label, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <input type="checkbox" checked={!!draft.cotaUnica} onChange={e => set({ cotaUnica: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: T.accent }} />
                    Cota única (pago uma única vez)
                  </label>
                  <p style={{ margin: 0, color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)' }}>Se marcado, o auxílio é pago uma única vez e o solicitante não informa o período de vigência do pagamento.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <LabeledSelect St={St} label="Compatível com outros auxílios" value={draft.auxCompativeisAuxilios ?? TODOS} onChange={v => set({ auxCompativeisAuxilios: v })} options={[[TODOS, 'Todos'], ...modalidades.filter(m => m.tipo === 'AUXILIO' && m.id !== editingId).map(m => [m.sigla, `${m.sigla} — ${m.nome}`] as [string, string])]} />
                  <LabeledSelect St={St} label="Compatível com modalidades de bolsa" value={draft.auxCompativeisBolsas ?? TODOS} onChange={v => set({ auxCompativeisBolsas: v })} options={[[TODOS, 'Todos'], ...modalidades.filter(m => m.tipo === 'BOLSA').map(m => [m.sigla, `${m.sigla} — ${m.nome}`] as [string, string])]} />
                </div>
              </>
            )}

            {!isAux && (
              <LabeledSelect St={St} label="Modalidades compatíveis" value="" onChange={() => {}} options={[['', 'Selecione as modalidades compatíveis'], ...modalidades.filter(m => m.tipo === 'BOLSA' && m.id !== editingId).map(m => [m.sigla, `${m.sigla} — ${m.nome}`] as [string, string])]} />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '22px', paddingTop: '18px', borderTop: `1px solid ${T.borderSubtle}` }}>
            <button type="button" onClick={() => setView('lista')} style={St.ghostBtn}><ArrowLeft size={16} /> Voltar</button>
            <button type="button" onClick={salvar} disabled={!podeSalvar} style={{ ...St.primaryBtn, backgroundColor: podeSalvar ? T.accent : T.bgChip, color: podeSalvar ? T.accentText : T.textMuted, cursor: podeSalvar ? 'pointer' : 'not-allowed' }}><Save size={16} /> Salvar</button>
          </div>
        </section>

        {/* Card 2 — Requisitos */}
        <section style={St.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '18px' }}>
            <h2 style={St.cardTitle}>Requisitos {rotuloDaEntidade}</h2>
            <button type="button" onClick={() => set({ requisitos: [...draft.requisitos, { id: Date.now(), nome: '', comprovante: '', descricao: '' }] })} style={St.primaryBtn}><Plus size={16} /> Adicionar requisito</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {draft.requisitos.map(r => (
              <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.6fr 40px', gap: '14px', alignItems: 'start', padding: '16px', borderRadius: '10px', border: `1px solid ${T.borderSubtle}`, backgroundColor: T.bgInput }}>
                <MiniField St={St} T={T} label="REQUISITO" value={r.nome} onChange={v => set({ requisitos: draft.requisitos.map(x => x.id === r.id ? { ...x, nome: v } : x) })} placeholder="Nome do requisito" />
                <MiniField St={St} T={T} label="COMPROVANTE" value={r.comprovante} onChange={v => set({ requisitos: draft.requisitos.map(x => x.id === r.id ? { ...x, comprovante: v } : x) })} placeholder="Documento comprobatório" />
                <MiniField St={St} T={T} label="DESCRIÇÃO" value={r.descricao} onChange={v => set({ requisitos: draft.requisitos.map(x => x.id === r.id ? { ...x, descricao: v } : x) })} placeholder="—" />
                <button type="button" aria-label="Remover" onClick={() => set({ requisitos: draft.requisitos.filter(x => x.id !== r.id) })} style={{ marginTop: '22px', width: '34px', height: '34px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: T.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            ))}
            {draft.requisitos.length === 0 && (
              <div style={{ border: `1px dashed ${T.borderStrong}`, borderRadius: '10px', padding: '22px', textAlign: 'center', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>Nenhum requisito adicionado.</div>
            )}
          </div>
        </section>

        {/* Card 3 — Níveis */}
        <section style={St.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '18px' }}>
            <div>
              <h2 style={St.cardTitle}>Níveis {rotuloDaEntidade}</h2>
              <p style={St.subtitle}>É necessário ao menos 1 nível com valor.</p>
            </div>
            <button type="button" onClick={() => set({ niveis: [...draft.niveis, { id: Date.now(), sigla: '', valor: '', moeda: 'BRL', requisitosExclusivos: 0, acumulaComNivel: false, nivelAcumulavel: '' }] })} style={St.primaryBtn}><Plus size={16} /> Adicionar nível</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {draft.niveis.map(n => {
              const outrosNiveis = draft.niveis.filter(x => x.id !== n.id && x.sigla.trim() !== '');
              return (
              <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px', borderRadius: '10px', border: `1px solid ${T.borderSubtle}`, backgroundColor: T.bgInput }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.2fr 40px', gap: '14px', alignItems: 'end' }}>
                  <MiniField St={St} T={T} label="SIGLA" value={n.sigla} onChange={v => set({ niveis: draft.niveis.map(x => x.id === n.id ? { ...x, sigla: v } : x) })} placeholder="BPIG-I" />
                  <MiniField St={St} T={T} label="VALOR" value={n.valor} onChange={v => set({ niveis: draft.niveis.map(x => x.id === n.id ? { ...x, valor: v } : x) })} placeholder="1.500,00" />
                  <div>
                    <span style={St.colLabel}>MOEDA</span>
                    <select value={n.moeda} onChange={e => set({ niveis: draft.niveis.map(x => x.id === n.id ? { ...x, moeda: e.target.value } : x) })} style={{ ...St.input, marginTop: '6px' }}>
                      {MOEDAS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <button type="button" aria-label="Remover" onClick={() => set({ niveis: draft.niveis.filter(x => x.id !== n.id) })} disabled={draft.niveis.length === 1} style={{ width: '34px', height: '34px', border: 'none', borderRadius: '8px', backgroundColor: 'transparent', color: draft.niveis.length === 1 ? T.textMuted : T.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: draft.niveis.length === 1 ? 'not-allowed' : 'pointer' }}><Trash2 size={16} /></button>
                </div>
                {isAux && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '14px', alignItems: 'center', borderTop: `1px solid ${T.borderSubtle}`, paddingTop: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: T.textPrimary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
                      <input type="checkbox" checked={!!n.acumulaComNivel} onChange={e => set({ niveis: draft.niveis.map(x => x.id === n.id ? { ...x, acumulaComNivel: e.target.checked, nivelAcumulavel: e.target.checked ? x.nivelAcumulavel : '' } : x) })} style={{ width: '18px', height: '18px', accentColor: T.accent }} />
                      Pode acumular com outro nível
                    </label>
                    {n.acumulaComNivel && (
                      <select value={n.nivelAcumulavel ?? ''} onChange={e => set({ niveis: draft.niveis.map(x => x.id === n.id ? { ...x, nivelAcumulavel: e.target.value } : x) })} style={St.input}>
                        <option value="">{outrosNiveis.length ? 'Selecione o nível que pode acumular' : 'Cadastre outro nível com sigla primeiro'}</option>
                        {outrosNiveis.map(x => <option key={x.id} value={x.sigla}>{x.sigla}</option>)}
                      </select>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

/* ─────────────── helpers ─────────────── */
const Req: React.FC<{ T: ThemeTokens }> = ({ T }) => <span style={{ color: T.danger }}> *</span>;

const Breadcrumb: React.FC<{ T: ThemeTokens; trail: string[] }> = ({ T, trail }) => (
  <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>
    {trail.map((item, i) => {
      const last = i === trail.length - 1;
      return (
        <React.Fragment key={item}>
          <span style={{ color: last ? T.textPrimary : T.textMuted, fontWeight: last ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)' }}>{item}</span>
          {!last && <ChevronRight size={14} style={{ color: T.textMuted }} />}
        </React.Fragment>
      );
    })}
  </nav>
);

const TextField: React.FC<{ St: S; label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string; disabled?: boolean }> = ({ St, label, value, onChange, placeholder, required, type, disabled }) => {
  const { T } = useThemeTokens();
  return (
    <div>
      <label style={St.label}>{label}{required && <Req T={T} />}</label>
      <input type={type} value={value} disabled={disabled} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...St.input, opacity: disabled ? 0.6 : 1 }} />
    </div>
  );
};

const LabeledSelect: React.FC<{ St: S; label: string; value: string; onChange: (v: string) => void; options: string[] | Array<[string, string]>; required?: boolean }> = ({ St, label, value, onChange, options, required }) => {
  const { T } = useThemeTokens();
  return (
    <div>
      <label style={St.label}>{label}{required && <Req T={T} />}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={St.input}>
        {options.map(o => {
          const val = Array.isArray(o) ? o[0] : o;
          const lab = Array.isArray(o) ? o[1] : o;
          return <option key={val || 'empty'} value={val}>{lab}</option>;
        })}
      </select>
    </div>
  );
};

const MiniField: React.FC<{ St: S; T: ThemeTokens; label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ St, T, label, value, onChange, placeholder }) => (
  <div>
    <span style={St.colLabel}>{label}</span>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...St.input, marginTop: '6px' }} />
  </div>
);

const TipoBadge: React.FC<{ T: ThemeTokens; tipo: Tipo }> = ({ T, tipo }) => {
  const isAux = tipo === 'AUXILIO';
  return (
    <span style={{ display: 'inline-block', marginTop: '6px', width: 'fit-content', borderRadius: '999px', padding: '3px 9px', backgroundColor: isAux ? T.warningSoft : T.accentSoft, color: isAux ? T.warning : T.accent, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
      {isAux ? 'Auxílio' : 'Bolsa'}
    </span>
  );
};

const Field2: React.FC<{ T: ThemeTokens; T2?: ThemeTokens; label: string; value: string; strong?: boolean; clamp?: boolean; badge?: React.ReactNode; versaoBadge?: boolean }> = ({ T, label, value, strong, clamp, badge, versaoBadge }) => (
  <div style={{ minWidth: 0 }}>
    <span style={{ color: T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</span>
    {versaoBadge && value !== '—' ? (
      <div style={{ marginTop: '6px' }}>
        <span style={{ borderRadius: '6px', padding: '4px 10px', backgroundColor: T.successSoft, color: T.success, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)' }}>{value}</span>
      </div>
    ) : (
      <div title={value} style={{ marginTop: '6px', color: strong ? T.textPrimary : T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: strong ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)', ...(clamp ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' } : {}) }}>{value}</div>
    )}
    {badge}
  </div>
);
