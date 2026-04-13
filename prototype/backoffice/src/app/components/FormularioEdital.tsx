import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, Home, ChevronDown, Save, Send, BookOpen, Plus, X, Trash2,
} from 'lucide-react';

/* ─── Shared style tokens ─────────────────────────────────── */
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

const sectionCard: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '20px',
};

const divider: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  margin: '22px 0',
};

const innerCardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(15,23,42,0.5)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '20px 24px',
};

/* ─── Section header helper ───────────────────────────────── */
const SectionHeader: React.FC<{ num: string; title: string; subtitle?: string }> = ({ num, title, subtitle }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: subtitle ? '4px' : '0' }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        backgroundColor: 'rgba(0,193,175,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#00c1af', fontWeight: 'var(--font-weight-medium)' }}>{num}</span>
      </div>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: 0 }}>
        {title}
      </h2>
    </div>
    {subtitle && (
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0 34px' }}>
        {subtitle}
      </p>
    )}
  </>
);

/* ─── Select component ────────────────────────────────────── */
const SelectField: React.FC<{
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          ...inputStyle,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ color: value ? '#ffffff' : 'rgba(255,255,255,0.3)' }}>
          {value ? options.find(o => o.value === value)?.label : (placeholder || 'Selecione...')}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: 'rgba(255,255,255,0.4)', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s',
          }}
        />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
          backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius)', zIndex: 400, overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
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

/* ─── Radio group component ───────────────────────────────── */
const RadioGroup: React.FC<{
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div>
    {label && <label style={labelStyle}>{label}</label>}
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div style={{
            width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
            border: `2px solid ${value === opt.value ? '#00c1af' : 'rgba(255,255,255,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.2s',
          }}>
            {value === opt.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00c1af' }} />}
          </div>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: value === opt.value ? '#ffffff' : 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}>
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  </div>
);

/* ─── Checkbox component ──────────────────────────────────── */
const CheckboxField: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
  >
    <div style={{
      width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, marginTop: '1px',
      border: `2px solid ${checked ? '#00c1af' : 'rgba(255,255,255,0.25)'}`,
      backgroundColor: checked ? '#00c1af' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background-color 0.2s, border-color 0.2s',
    }}>
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: checked ? '#ffffff' : 'rgba(255,255,255,0.65)', transition: 'color 0.2s', lineHeight: '1.5' }}>
      {label}
    </span>
  </button>
);

/* ─── Sub-section inner card ──────────────────────────────── */
const InnerCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={innerCardStyle}>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 18px' }}>
      {title}
    </p>
    {children}
  </div>
);

/* ─── Types ───────────────────────────────────────────────── */
interface Props { onBack: () => void; }

interface Bolsa {
  id: number;
  modalidade: string;
  nivel: string;
  versao: string;
  maxBolsistas: string;
  quantidadeCotas: string;
  institucional: boolean;
}

interface Faixa {
  id: number;
  duracao: string;
  valorMin: string;
  valorMax: string;
}

interface FormularioAdicional {
  id: number;
  tipo: string;
  formulario: string;
}

const modalidadeOpts = [
  { value: 'ic', label: 'Iniciação Científica' },
  { value: 'dt', label: 'Desenvolvimento Tecnológico' },
  { value: 'pd', label: 'Pós-Doutorado' },
  { value: 'pesquisa', label: 'Pesquisa' },
  { value: 'extensao', label: 'Extensão' },
];

const nivelBolsaOpts = [
  { value: 'a', label: 'Nível A' },
  { value: 'b', label: 'Nível B' },
  { value: 'c', label: 'Nível C' },
  { value: 'd', label: 'Nível D' },
];

/* ─── Rubrica chip ────────────────────────────────────────── */
const RubricaChip: React.FC<{ label: string; checked: boolean; onToggle: () => void }> = ({ label, checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '8px 14px',
      borderRadius: '6px',
      border: `1px solid ${checked ? '#00c1af' : 'rgba(255,255,255,0.15)'}`,
      backgroundColor: checked ? 'rgba(0,193,175,0.1)' : 'rgba(255,255,255,0.04)',
      cursor: 'pointer',
      transition: 'border-color 0.15s, background-color 0.15s',
    }}
    onMouseEnter={e => { if (!checked) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; } }}
    onMouseLeave={e => { if (!checked) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; } }}
  >
    <div style={{
      width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
      border: `2px solid ${checked ? '#00c1af' : 'rgba(255,255,255,0.25)'}`,
      backgroundColor: checked ? '#00c1af' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background-color 0.15s, border-color 0.15s',
    }}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span style={{
      fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
      color: checked ? '#00c1af' : 'rgba(255,255,255,0.65)',
      transition: 'color 0.15s',
    }}>
      {label}
    </span>
  </button>
);

/* ─── Document checkbox row ───────────────────────────────── */
const DocCheckRow: React.FC<{ label: string; checked: boolean; onToggle: () => void }> = ({ label, checked, onToggle }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0',
  }}>
    <button
      type="button"
      onClick={onToggle}
      style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1, textAlign: 'left' }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
        border: `2px solid ${checked ? '#00c1af' : 'rgba(255,255,255,0.2)'}`,
        backgroundColor: checked ? '#00c1af' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background-color 0.15s, border-color 0.15s',
      }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{
        fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)',
        color: checked ? '#ffffff' : 'rgba(255,255,255,0.7)',
        transition: 'color 0.15s',
      }}>
        {label}
      </span>
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
export const FormularioEdital: React.FC<Props> = ({ onBack }) => {

  /* ── Section 1 ── */
  const [tipoCaptacao, setTipoCaptacao] = useState('');
  const [coordenadorResponsavel, setCoordenadorResponsavel] = useState('');
  const [showCoordenadorDropdown, setShowCoordenadorDropdown] = useState(false);
  const coordenadorRef = useRef<HTMLDivElement>(null);
  const [vinculacaoPrograma, setVinculacaoPrograma] = useState('nao');
  const [programaVinculado, setProgramaVinculado] = useState('');
  const [tituloCaptacao, setTituloCaptacao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [numeroCaptacao, setNumeroCaptacao] = useState('');
  const [setorResponsavel, setSetorResponsavel] = useState('');
  const [tipoFomento, setTipoFomento] = useState('');
  const [programa, setPrograma] = useState('');
  const [formularioInscricao, setFormularioInscricao] = useState('');
  const [formularioAvaliacao, setFormularioAvaliacao] = useState('');
  const [formularioRecurso, setFormularioRecurso] = useState('');
  const [formulariosAdicionais, setFormulariosAdicionais] = useState<FormularioAdicional[]>([]);
  const nextFormularioId = useRef(1);
  const [descricaoCaptacao, setDescricaoCaptacao] = useState('');

  /* ── Section 2 (Recursos Financeiros) ── */
  const [parceriaSelecionada, setParceriaSelecionada] = useState('');
  const [valorParceria, setValorParceria] = useState('');
  const [origensRecurso, setOrigensRecurso] = useState<Record<string, boolean>>({
    tesouroEstadual: false, convenioFederal: false, parceriaPrivado: false,
  });
  const [valorTotalDisponivel, setValorTotalDisponivel] = useState('');
  const [showModalNovoRecurso, setShowModalNovoRecurso] = useState(false);
  const [novoRecursoOrigem, setNovoRecursoOrigem] = useState('');
  const [habilitarFaixas, setHabilitarFaixas] = useState(false);
  const [faixas, setFaixas] = useState<Faixa[]>([
    { id: 1, duracao: '', valorMin: '', valorMax: '' }
  ]);
  const nextFaixaId = useRef(2);

  /* ── Section 3 (Parametrizações Gerais) ── */
  const [regrasParticipacao, setRegrasParticipacao] = useState({
    multiplas: false, coordenadorOutro: false, coordenadorBolsa: false, apenasEscolhidos: false,
  });

  /* ── Section 4 (Requisitos do Coordenador) ── */
  const [vinculadaInstituicao, setVinculadaInstituicao] = useState('nao');
  const [restricaoEmpregaticio, setRestricaoEmpregaticio] = useState(false);
  const [restricaoInstitucional, setRestricaoInstitucional] = useState(false);
  const [gestorObrigatorio, setGestorObrigatorio] = useState(false);
  const [nivelAcademico, setNivelAcademico] = useState('');
  const [parceriaInstituicoes, setParceriaInstituicoes] = useState('nao');

  /* ── Section 5 (Avaliação e Prestação de Contas) ── */
  const [necessitaAvaliacao, setNecessitaAvaliacao] = useState('nao');
  const [possuiPrestacaoTecnica, setPossuiPrestacaoTecnica] = useState('nao');
  const [rubricas, setRubricas] = useState<Record<string, boolean>>({
    materialPermanente: false, materialConsumo: false, passagem: false,
    diaria: false, pessoaFisica: false, pessoaJuridica: false,
  });

  /* ── Section 6 ── */
  const [possuiBolsistas, setPossuiBolsistas] = useState('nao');
  const [bolsas, setBolsas] = useState<Bolsa[]>([
    { id: 1, modalidade: '', nivel: '', versao: '', maxBolsistas: '', quantidadeCotas: '', institucional: false },
  ]);
  const nextBolsaId = useRef(2);

  /* ── Section 7 ── */
  const [docsSubmissao, setDocsSubmissao] = useState<Record<string, boolean>>({
    curriculoLattes: false,
    projetoPesquisa: false,
    cartaAnuencia: false,
    declaracaoVinculo: false,
    orcamentoDetalhado: false,
  });
  const [arquivosPublicos, setArquivosPublicos] = useState<Record<string, boolean>>({
    editalCompleto: false,
    manualSubmissao: false,
    modeloProjeto: false,
    planilhaOrcamento: false,
  });
  const [showModalNovoArquivo, setShowModalNovoArquivo] = useState(false);
  const [novoArquivoNome, setNovoArquivoNome] = useState('');
  const [novoArquivoDescricao, setNovoArquivoDescricao] = useState('');
  const [novoArquivoFormatos, setNovoArquivoFormatos] = useState<Record<string, boolean>>({
    PDF: false, PNG: false, DOCX: false, JPEG: false, XLSX: false, CSV: false, MOV: false, MP4: false, MP3: false, XML: false, ZIP: false
  });
  const [novoArquivoObrigatorio, setNovoArquivoObrigatorio] = useState('sim');

  /* ── helpers ── */
  const toggleParticipacao = (k: keyof typeof regrasParticipacao) =>
    setRegrasParticipacao(p => ({ ...p, [k]: !p[k] }));
  const toggleRubrica = (k: string) => setRubricas(p => ({ ...p, [k]: !p[k] }));
  const toggleOrigem = (k: string) => setOrigensRecurso(p => ({ ...p, [k]: !p[k] }));
  const toggleDocSubmissao = (k: string) => setDocsSubmissao(p => ({ ...p, [k]: !p[k] }));
  const toggleArquivoPublico = (k: string) => setArquivosPublicos(p => ({ ...p, [k]: !p[k] }));

  const addBolsa = () =>
    setBolsas(p => [...p, { id: nextBolsaId.current++, modalidade: '', nivel: '', versao: '', maxBolsistas: '', quantidadeCotas: '', institucional: false }]);
  const removeBolsa = (id: number) => setBolsas(p => p.filter(b => b.id !== id));
  const updateBolsa = <K extends keyof Bolsa>(id: number, field: K, value: Bolsa[K]) =>
    setBolsas(p => p.map(b => b.id === id ? { ...b, [field]: value } : b));

  const addFaixa = () => setFaixas(p => [...p, { id: nextFaixaId.current++, duracao: '', valorMin: '', valorMax: '' }]);
  const removeFaixa = (id: number) => setFaixas(p => p.filter(f => f.id !== id));
  const updateFaixa = <K extends keyof Faixa>(id: number, field: K, value: Faixa[K]) =>
    setFaixas(p => p.map(f => f.id === id ? { ...f, [field]: value } : f));

  const addFormularioAdicional = () => setFormulariosAdicionais(p => [...p, { id: nextFormularioId.current++, tipo: '', formulario: '' }]);
  const removeFormularioAdicional = (id: number) => setFormulariosAdicionais(p => p.filter(f => f.id !== id));
  const updateFormularioAdicional = <K extends keyof FormularioAdicional>(id: number, field: K, value: FormularioAdicional[K]) =>
    setFormulariosAdicionais(p => p.map(f => f.id === id ? { ...f, [field]: value } : f));

  const nivelAcademicoOpts = [
    { value: 'graduacao', label: 'Graduação' },
    { value: 'especializacao', label: 'Especialização' },
    { value: 'mestrado', label: 'Mestrado' },
    { value: 'doutorado', label: 'Doutorado' },
    { value: 'pos_doutorado', label: 'Pós-Doutorado' },
  ];

  const setorResponsavelOpts = [
    { value: 'geaf', label: 'GEAF' },
    { value: 'gecap', label: 'GECAP' },
    { value: 'geinov', label: 'GEINOV' },
    { value: 'geop', label: 'GEOP' },
    { value: 'geped', label: 'GEPED' },
  ];

  const tipoFomentoOpts = [
    { value: 'capacitacao', label: 'Capacitação' },
    { value: 'difusao', label: 'Difusão' },
    { value: 'extensao', label: 'Extensão' },
    { value: 'inovacao', label: 'Inovação' },
    { value: 'pesquisa', label: 'Pesquisa' },
  ];

  const programaOpts = [
    { value: 'nao_se_aplica', label: 'Não se aplica' },
    { value: 'bolsas_2026', label: 'Bolsas de Pesquisa 2026' },
    { value: 'inovacao_tech', label: 'Inovação Tecnológica' },
    { value: 'extensao_univ', label: 'Extensão Universitária' },
    { value: 'infraestrutura', label: 'Infraestrutura Laboratorial' },
  ];

  const coordenadoresData = [
    { nome: 'Carlos', sobrenome: 'Silva', cpf: '123.456.789-00' },
    { nome: 'Maria', sobrenome: 'Santos', cpf: '234.567.890-11' },
    { nome: 'João', sobrenome: 'Oliveira', cpf: '345.678.901-22' },
    { nome: 'Ana', sobrenome: 'Costa', cpf: '456.789.012-33' },
    { nome: 'Roberto', sobrenome: 'Lima', cpf: '567.890.123-44' },
  ];

  const parceriasData = [
    { value: 'parceria_1', label: 'Cooperação Ufes-CNPq' },
    { value: 'parceria_2', label: 'Termo Ufes-UFM' },
    { value: 'parceria_3', label: 'Cooperação Internacional' },
    { value: 'parceria_4', label: 'Carreira Científica' },
  ];

  const formularioOpts = [
    { value: 'nao_se_aplica', label: 'Não se aplica' },
    { value: 'inovacao', label: 'Formulário de Inovação' },
    { value: 'geral', label: 'Formulário Geral' }
  ];

  const formularioAvaliacaoOpts = [
    { value: 'nao_se_aplica', label: 'Não se aplica' },
    { value: 'avaliacao_padrao', label: 'Avaliação Padrão' },
    { value: 'avaliacao_tecnica', label: 'Avaliação Técnica' },
    { value: 'avaliacao_inovacao', label: 'Avaliação de Inovação' }
  ];

  const formularioRecursoOpts = [
    { value: 'nao_se_aplica', label: 'Não se aplica' },
    { value: 'recurso_padrao', label: 'Recurso Padrão' },
    { value: 'recurso_tecnico', label: 'Recurso Técnico' }
  ];

  const focusTeal = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)');
  const blurGray = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (coordenadorRef.current && !coordenadorRef.current.contains(e.target as Node)) {
        setShowCoordenadorDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div style={{ padding: '32px 32px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>
            Captação
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
            Criar Captação
          </span>
        </div>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={18} style={{ color: '#00c1af' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px' }}>Criar Captação</h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Crie e configure uma nova chamada para projetos.</p>
          </div>
        </div>
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '20px 0 28px' }} />

        {/* ══════ SESSÃO 1 — Identificação da Captação ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="1" title="Identificação da Captação" subtitle="Informações básicas da captação" />
          <div style={divider} />

          {/* Row 1: Título da Captação + Tipo de Captação */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Título da Captação</label>
              <input type="text" placeholder="Digite o título..." value={tituloCaptacao} onChange={e => setTituloCaptacao(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
            </div>
            <SelectField label="Tipo de Captação" value={tipoCaptacao} onChange={setTipoCaptacao} placeholder="Selecione o tipo..."
              options={[{ value: 'edital_aberto', label: 'Edital Aberto' }, { value: 'demanda_induzida', label: 'Demanda Induzida' }]}
            />
          </div>

          {/* Row 1b: Coordenador Responsável (apenas se Demanda Induzida) */}
          {tipoCaptacao === 'demanda_induzida' && (
            <div style={{ marginBottom: '20px' }} ref={coordenadorRef}>
              <label style={labelStyle}>Coordenador Responsável</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Digite ou selecione um coordenador..." 
                  value={coordenadorResponsavel} 
                  onChange={e => setCoordenadorResponsavel(e.target.value)}
                  onFocus={(e) => {
                    setShowCoordenadorDropdown(true);
                    focusTeal(e);
                  }}
                  style={inputStyle}
                  onBlur={blurGray} 
                />
                {showCoordenadorDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius)',
                    marginTop: '4px',
                    zIndex: 10,
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}>
                    {coordenadoresData
                      .filter(c => 
                        coordenadorResponsavel === '' ||
                        c.nome.toLowerCase().includes(coordenadorResponsavel.toLowerCase()) ||
                        c.sobrenome.toLowerCase().includes(coordenadorResponsavel.toLowerCase()) ||
                        c.cpf.includes(coordenadorResponsavel)
                      )
                      .map((coord, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCoordenadorResponsavel(`${coord.nome} ${coord.sobrenome} - ${coord.cpf}`);
                            setShowCoordenadorDropdown(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            fontFamily: 'var(--font-family)',
                            fontSize: 'var(--text-sm)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div>{coord.nome} {coord.sobrenome}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{coord.cpf}</div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Row 2: Setor Responsável + Tipo de Fomento + Programa */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <SelectField 
              label="Setor Responsável" 
              value={setorResponsavel} 
              onChange={setSetorResponsavel} 
              placeholder="Selecione o setor..."
              options={setorResponsavelOpts}
            />
            <SelectField 
              label="Tipo de Fomento" 
              value={tipoFomento} 
              onChange={setTipoFomento} 
              placeholder="Selecione o tipo..."
              options={tipoFomentoOpts}
            />
            <SelectField 
              label="Programa" 
              value={programa} 
              onChange={setPrograma} 
              placeholder="Selecione o programa..."
              options={programaOpts}
            />
          </div>

          {/* Row 3: Número da Captação + Data de Início + Data de Fim */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Número da Captação</label>
              <input type="text" placeholder="001/2026" value={numeroCaptacao} onChange={e => setNumeroCaptacao(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
            </div>
            <div>
              <label style={labelStyle}>Data de Início</label>
              <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
            </div>
            <div>
              <label style={labelStyle}>Data de Fim</label>
              <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
            </div>
          </div>

          {/* Row 4: Descrição da Captação */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Descrição da Captação</label>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: descricaoCaptacao.length > 180 ? (descricaoCaptacao.length >= 200 ? '#ef4444' : '#fbbf24') : 'rgba(255,255,255,0.35)' }}>
                {descricaoCaptacao.length}/200
              </span>
            </div>
            <textarea placeholder="Descreva o objetivo e escopo desta captação..." value={descricaoCaptacao}
              onChange={e => { if (e.target.value.length <= 200) setDescricaoCaptacao(e.target.value); }} rows={4}
              maxLength={200}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '110px', lineHeight: '1.6' }}
              onFocus={focusTeal} onBlur={blurGray}
            />
          </div>

          {/* Row 5: Formulários — Inscrição, Avaliação, Recurso */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <SelectField label="Formulário de Inscrição" value={formularioInscricao} onChange={setFormularioInscricao}
              placeholder="Selecione o formulário..."
              options={formularioOpts}
            />
            <SelectField label="Formulário de Avaliação" value={formularioAvaliacao} onChange={setFormularioAvaliacao}
              placeholder="Selecione o formulário..."
              options={formularioAvaliacaoOpts}
            />
            <SelectField label="Formulário do Recurso" value={formularioRecurso} onChange={setFormularioRecurso}
              placeholder="Selecione o formulário..."
              options={formularioRecursoOpts}
            />
          </div>

          {/* Formulários Adicionais */}
          {formulariosAdicionais.map((form) => (
            <div key={form.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', marginBottom: '20px', alignItems: 'end' }}>
              <SelectField 
                label="Formulário" 
                value={form.formulario} 
                onChange={v => updateFormularioAdicional(form.id, 'formulario', v)}
                placeholder="Selecione o formulário..."
                options={formularioOpts}
              />
              <button
                type="button"
                onClick={() => removeFormularioAdicional(form.id)}
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

          {/* Botão Adicionar Formulário */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addFormularioAdicional}
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
              Adicionar Formulário
            </button>
          </div>
        </div>

        {/* ══════ SESSÃO 2 — Recursos Financeiros ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="2" title="Recursos Financeiros" subtitle="Configure as fontes de recursos e valores disponíveis" />
          <div style={divider} />

          {/* Parceria */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <SelectField 
              label="Parceria" 
              value={parceriaSelecionada} 
              onChange={setParceriaSelecionada} 
              placeholder="Selecione uma parceria..."
              options={parceriasData}
            />
            <div>
              <label style={labelStyle}>Valor da Parceria (R$)</label>
              <input 
                type="text" 
                placeholder="Digite o valor..." 
                value={valorParceria} 
                onChange={e => setValorParceria(e.target.value)}
                style={inputStyle} 
                onFocus={focusTeal} 
                onBlur={blurGray} 
              />
            </div>
          </div>

          {/* Habilitar Faixas de Financiamento */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 8px' }}>
              Habilitar Faixas de Financiamento
            </p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px' }}>
              Se a Captação precisar, informe quanto cada projeto participante deve receber e em qual período.
            </p>
            <div style={{ padding: '13px 0' }}>
              <CheckboxField label="Habilitar Faixas de Financiamento" checked={habilitarFaixas} onChange={() => setHabilitarFaixas(!habilitarFaixas)} />
            </div>
          </div>

          {/* Faixas - SEM CARD */}
          <div style={{ marginBottom: '24px' }}>
            {faixas.map((faixa, index) => (
              <div key={faixa.id}>
                {index > 0 && <div style={{ ...divider, margin: '16px 0' }} />}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '20px', alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>Duração (meses)</label>
                    <input 
                      type="number" 
                      placeholder="24" 
                      value={faixa.duracao} 
                      onChange={e => updateFaixa(faixa.id, 'duracao', e.target.value)} 
                      style={{
                        ...inputStyle,
                        opacity: habilitarFaixas ? 1 : 0.5,
                        cursor: habilitarFaixas ? 'text' : 'not-allowed'
                      }} 
                      disabled={!habilitarFaixas}
                      onFocus={focusTeal} 
                      onBlur={blurGray} 
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Valor Mínimo (R$)</label>
                    <input 
                      type="number" 
                      placeholder="50000" 
                      value={faixa.valorMin} 
                      onChange={e => updateFaixa(faixa.id, 'valorMin', e.target.value)} 
                      style={{
                        ...inputStyle,
                        opacity: habilitarFaixas ? 1 : 0.5,
                        cursor: habilitarFaixas ? 'text' : 'not-allowed'
                      }} 
                      disabled={!habilitarFaixas}
                      onFocus={focusTeal} 
                      onBlur={blurGray} 
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Valor Máximo (R$)</label>
                    <input 
                      type="number" 
                      placeholder="200000" 
                      value={faixa.valorMax} 
                      onChange={e => updateFaixa(faixa.id, 'valorMax', e.target.value)} 
                      style={{
                        ...inputStyle,
                        opacity: habilitarFaixas ? 1 : 0.5,
                        cursor: habilitarFaixas ? 'text' : 'not-allowed'
                      }} 
                      disabled={!habilitarFaixas}
                      onFocus={focusTeal} 
                      onBlur={blurGray} 
                    />
                  </div>
                  {faixas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaixa(faixa.id)}
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
                  )}
                </div>
              </div>
            ))}
            {habilitarFaixas && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={addFaixa}
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
                  Adicionar Faixa
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══════ SESSÃO 3 — Parametrizações Gerais ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="3" title="Parametrizações Gerais" subtitle="Defina regras de submissão e limites das propostas" />
          <div style={divider} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { key: 'multiplas', label: 'O pesquisador pode enviar mais de uma proposta para este edital' },
              { key: 'coordenadorOutro', label: 'O coordenador pode estar como participante em outra proposta do mesmo edital' },
              { key: 'coordenadorBolsa', label: 'O coordenador pode ter bolsas ativas em outros projetos' },
              { key: 'apenasEscolhidos', label: 'Submissão restrita apenas a pesquisadores previamente escolhidos' }
            ].map(item => (
              <div key={item.key} style={{ padding: '13px 0' }}>
                <CheckboxField 
                  label={item.label} 
                  checked={regrasParticipacao[item.key as keyof typeof regrasParticipacao]} 
                  onChange={() => toggleParticipacao(item.key as keyof typeof regrasParticipacao)} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* ══════ SESSÃO 4 — Requisitos e Restrições ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="4" title="Requisitos e Restrições" subtitle="Defina critérios e condições de elegibilidade" />
          <div style={divider} />

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>A proposta precisa estar vinculada a uma instituição?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={vinculadaInstituicao} onChange={setVinculadaInstituicao}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Permite parceria entre instituições?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={parceriaInstituicoes} onChange={setParceriaInstituicoes}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px' }}>Restrições de Vínculo</p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>Defina restrições sobre vínculo empregatício ou institucional</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { key: 'restricaoEmpregaticio', label: 'Exigir vínculo empregatício ativo', checked: restricaoEmpregaticio, onChange: () => setRestricaoEmpregaticio(!restricaoEmpregaticio) },
                { key: 'gestorObrigatorio', label: 'Obrigar a indicação de um gestor institucional', checked: gestorObrigatorio, onChange: () => setGestorObrigatorio(!gestorObrigatorio) }
              ].map(item => (
                <div key={item.key} style={{ padding: '13px 0' }}>
                  <CheckboxField label={item.label} checked={item.checked} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <SelectField
              label="Nível Acadêmico Mínimo Exigido do Coordenador do Projeto"
              value={nivelAcademico}
              onChange={setNivelAcademico}
              placeholder="Selecione o nível..."
              options={nivelAcademicoOpts}
            />
          </div>
        </div>

        {/* ══════ SESSÃO 5 — Rubricas e Despesas Permitidas ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="5" title="Rubricas e Despesas Permitidas" subtitle="Configure quais categorias de despesa podem ser financiadas" />
          <div style={divider} />

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Este edital necessita de avaliação?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={necessitaAvaliacao} onChange={setNecessitaAvaliacao}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Possui prestação de contas técnica?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={possuiPrestacaoTecnica} onChange={setPossuiPrestacaoTecnica}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px' }}>Rubricas Permitidas</p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>Selecione as rubricas de despesas que podem ser utilizadas</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { key: 'materialPermanente', label: 'Material Permanente' },
                { key: 'materialConsumo', label: 'Material de Consumo' },
                { key: 'passagem', label: 'Passagens' },
                { key: 'diaria', label: 'Diárias' },
                { key: 'pessoaFisica', label: 'Pessoa Física' },
                { key: 'pessoaJuridica', label: 'Pessoa Jurídica' }
              ].map(item => (
                <div key={item.key} style={{ padding: '13px 0' }}>
                  <CheckboxField label={item.label} checked={rubricas[item.key]} onChange={() => toggleRubrica(item.key)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════ SESSÃO 6 — Bolsas ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="6" title="Bolsas" subtitle="Configure modalidades e quantidades de bolsa. O valor das Bolsas consomem o valor total do projeto." />
          <div style={divider} />

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>O projeto possui bolsistas?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={possuiBolsistas} onChange={setPossuiBolsistas}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          {possuiBolsistas === 'sim' && (
            <>
              {bolsas.map((bolsa, idx) => (
                <div key={bolsa.id}>
                  {idx > 0 && <div style={divider} />}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'end', marginBottom: '16px' }}>
                    <SelectField label="Modalidade" value={bolsa.modalidade} onChange={v => updateBolsa(bolsa.id, 'modalidade', v)} options={modalidadeOpts} placeholder="Selecione..." />
                    <SelectField label="Nível" value={bolsa.nivel} onChange={v => updateBolsa(bolsa.id, 'nivel', v)} options={nivelBolsaOpts} placeholder="Selecione..." />
                    <div>
                      <label style={labelStyle}>Versão</label>
                      <input type="text" placeholder="v1.0" value={bolsa.versao} onChange={e => updateBolsa(bolsa.id, 'versao', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                    </div>
                    <div>
                      <label style={labelStyle}>Máximo de Bolsistas</label>
                      <input type="number" placeholder="10" value={bolsa.maxBolsistas} onChange={e => updateBolsa(bolsa.id, 'maxBolsistas', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                    </div>
                    <div>
                      <label style={labelStyle}>Quantidade de Cotas</label>
                      <input type="number" placeholder="5" value={bolsa.quantidadeCotas} onChange={e => updateBolsa(bolsa.id, 'quantidadeCotas', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                    </div>
                {bolsas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBolsa(bolsa.id)}
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
                )}
              </div>
              <div style={{ padding: '13px 0' }}>
                <CheckboxField label="Bolsa Institucional (não precisa de CPF do bolsista)" checked={bolsa.institucional} onChange={() => updateBolsa(bolsa.id, 'institucional', !bolsa.institucional)} />
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="button"
              onClick={addBolsa}
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
              Adicionar Bolsa
            </button>
          </div>
            </>
          )}
        </div>

        {/* Bottom buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
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
            Salvar Rascunho
          </button>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
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
            <Save size={16} />
            Salvar Captação
          </button>
        </div>
      </div>

      {/* Modal Novo Recurso */}
      {showModalNovoRecurso && (
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
            width: '650px',
            maxWidth: '90vw',
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
                  Criar Novo Recurso
                </h3>
                <p style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                }}>
                  Inclua as informações da nova origem do recurso financeiro.
                </p>
              </div>
              <button
                onClick={() => setShowModalNovoRecurso(false)}
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
            <div style={{ padding: '24px' }}>
              <div>
                <label style={labelStyle}>Origem do Recurso</label>
                <input
                  type="text"
                  placeholder="Ex: Fundação de Amparo à Pesquisa"
                  value={novoRecursoOrigem}
                  onChange={e => setNovoRecursoOrigem(e.target.value)}
                  style={inputStyle}
                  onFocus={focusTeal}
                  onBlur={blurGray}
                />
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
                  setShowModalNovoRecurso(false);
                  setNovoRecursoOrigem('');
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
                  // Aqui você salvaria o novo recurso
                  setShowModalNovoRecurso(false);
                  setNovoRecursoOrigem('');
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

      {/* Modal Novo Arquivo */}
      {showModalNovoArquivo && (
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
                  Criar Novo Arquivo
                </h3>
                <p style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                }}>
                  Inclua as informações do arquivo.
                </p>
              </div>
              <button
                onClick={() => setShowModalNovoArquivo(false)}
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
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Nome do Arquivo</label>
                <input
                  type="text"
                  placeholder="Ex: Modelo de Proposta"
                  value={novoArquivoNome}
                  onChange={e => setNovoArquivoNome(e.target.value)}
                  style={inputStyle}
                  onFocus={focusTeal}
                  onBlur={blurGray}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Descrição</label>
                <textarea
                  placeholder="Descreva o conteúdo do arquivo..."
                  value={novoArquivoDescricao}
                  onChange={e => setNovoArquivoDescricao(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: '1.6' }}
                  onFocus={focusTeal}
                  onBlur={blurGray}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ ...labelStyle, marginBottom: '12px' }}>Formato Permitido</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {Object.keys(novoArquivoFormatos).map(formato => (
                    <div key={formato} style={{ padding: '8px 0' }}>
                      <CheckboxField
                        label={formato}
                        checked={novoArquivoFormatos[formato]}
                        onChange={() => setNovoArquivoFormatos(p => ({ ...p, [formato]: !p[formato] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Obrigatoriedade</label>
                <div style={{ paddingTop: '8px' }}>
                  <RadioGroup
                    value={novoArquivoObrigatorio}
                    onChange={setNovoArquivoObrigatorio}
                    options={[
                      { value: 'sim', label: 'Sim, é um arquivo obrigatório' },
                      { value: 'nao', label: 'Não, é um arquivo opcional' }
                    ]}
                  />
                </div>
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
                  setShowModalNovoArquivo(false);
                  setNovoArquivoNome('');
                  setNovoArquivoDescricao('');
                  setNovoArquivoFormatos({
                    PDF: false, PNG: false, DOCX: false, JPEG: false, XLSX: false, CSV: false, MOV: false, MP4: false, MP3: false, XML: false, ZIP: false
                  });
                  setNovoArquivoObrigatorio('sim');
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
                  // Aqui você salvaria o novo arquivo
                  setShowModalNovoArquivo(false);
                  setNovoArquivoNome('');
                  setNovoArquivoDescricao('');
                  setNovoArquivoFormatos({
                    PDF: false, PNG: false, DOCX: false, JPEG: false, XLSX: false, CSV: false, MOV: false, MP4: false, MP3: false, XML: false, ZIP: false
                  });
                  setNovoArquivoObrigatorio('sim');
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
