import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Save, BookOpen, Plus, X, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeTokens } from '../theme/ThemeContext';
import { BackofficeDatePicker } from './BackofficeDatePicker';

/* ─── Shared style tokens ─────────────────────────────────── */
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

const sectionCard: React.CSSProperties = {
  backgroundColor: 'var(--form-card-bg)',
  border: '1px solid var(--form-border)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '20px',
};

const divider: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'var(--form-divider)',
  margin: '22px 0',
};

const innerCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--form-inner-card-bg)',
  border: '1px solid var(--form-border)',
  borderRadius: '8px',
  padding: '20px 24px',
};

/* ─── Section header helper ───────────────────────────────── */
const SectionHeader: React.FC<{ num: string; title: string; subtitle?: string }> = ({ num, title, subtitle }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: subtitle ? '4px' : '0' }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        backgroundColor: '#00c1af',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', color: '#171717', fontWeight: 'var(--font-weight-medium)' }}>{num}</span>
      </div>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: 0 }}>
        {title}
      </h2>
    </div>
    {subtitle && (
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: '2px 0 24px 34px' }}>
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
          backgroundColor: '#171717', border: '1px solid var(--form-border)',
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
                backgroundColor: value === opt.value ? 'rgba(0,193,175,0.1)' : '#171717',
                color: value === opt.value ? '#00c1af' : 'var(--form-text-primary)',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = '#242424'; }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = '#171717'; }}
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
          <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 18px' }}>
      {title}
    </p>
    {children}
  </div>
);

/* ─── Types ───────────────────────────────────────────────── */
interface Props {
  onBack: () => void;
  mode?: 'create' | 'edit';
  scope?: 'captacao' | 'fomento';
}

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
  nome: string;
  duracao: string;
  valorMin: string;
  valorMax: string;
  valorAportado: string;
}

interface EtapaCronograma {
  id: number;
  tipo: string;
  inicio: string;
  fim: string;
}

interface AdiamentoCronograma {
  id: number;
  etapaTipo: string;
  dias: number;
  justificativa: string;
  dataRegistro: string;
  dataInicioOriginal: string;
  dataFimOriginal: string;
  dataInicioNova: string;
  dataFimNova: string;
}

interface AporteFinanceiroCaptacao {
  id: number;
  origemTipo: 'programa' | 'parceria';
  origemId: string;
  valor: string;
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
          <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
export const FormularioEdital: React.FC<Props> = ({ onBack, mode = 'create', scope = 'captacao' }) => {
  const { T } = useThemeTokens();
  const isEditMode = mode === 'edit';
  const isFomento = scope === 'fomento';
  const moduleLabel = isFomento ? 'Fomento' : 'Captação';
  const createTitle = isEditMode ? `Editar ${moduleLabel}` : `Criar ${moduleLabel}`;
  const [statusFomento, setStatusFomento] = useState(isEditMode ? 'aprovado' : '');
  const [resultadoEsperado, setResultadoEsperado] = useState('');
  const [eixoEstrategico, setEixoEstrategico] = useState('');

  /* ── Section 1 ── */
  const [tipoCaptacao, setTipoCaptacao] = useState(isEditMode ? 'chamada_publica' : '');
  const [coordenadorResponsavel, setCoordenadorResponsavel] = useState('');
  const [showCoordenadorDropdown, setShowCoordenadorDropdown] = useState(false);
  const coordenadorRef = useRef<HTMLDivElement>(null);
  const [vinculacaoPrograma, setVinculacaoPrograma] = useState('nao');
  const [programaVinculado, setProgramaVinculado] = useState('');
  const [tituloCaptacao, setTituloCaptacao] = useState(isEditMode ? 'Edital de Inovação Tecnológica 2026' : '');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [numeroCaptacao, setNumeroCaptacao] = useState('');
  const [linkEdital, setLinkEdital] = useState(isEditMode ? 'https://fapes.es.gov.br/editais/inovacao-tecnologica-2026' : '');
  const [arquivoEdital, setArquivoEdital] = useState('');
  const [setorResponsavel, setSetorResponsavel] = useState(isEditMode ? 'geinov' : '');
  const [tipoFomento, setTipoFomento] = useState('');
  const [categoriasIniciativa, setCategoriasIniciativa] = useState<Record<string, boolean>>({
    capacitacao: false, difusao: false, extensao: false, inovacao: isEditMode, pesquisa: isEditMode,
  });
  const [showCategoriasDropdown, setShowCategoriasDropdown] = useState(false);
  const [tipoVinculoCaptacao, setTipoVinculoCaptacao] = useState<'programa' | 'parceria'>('programa');
  const [vinculoCaptacao, setVinculoCaptacao] = useState('');
  const [programa, setPrograma] = useState('');
  const [formularioInscricao, setFormularioInscricao] = useState('');
  const [formularioAvaliacao, setFormularioAvaliacao] = useState('');
  const [formularioRecurso, setFormularioRecurso] = useState('');
  const [formularioAnexo, setFormularioAnexo] = useState('');
  const [descricaoCaptacao, setDescricaoCaptacao] = useState(isEditMode ? 'Edital voltado para fomentar projetos de inovação tecnológica no Estado do Espírito Santo, com foco em soluções que promovam o desenvolvimento econômico e social sustentável.' : '');
  const [cronogramaCaptacao, setCronogramaCaptacao] = useState<EtapaCronograma[]>([
    { id: 1, tipo: 'publicacao', inicio: '2026-02-01', fim: '2026-02-01' },
    { id: 2, tipo: 'recebimento', inicio: '2026-02-01', fim: '2026-03-31' },
    { id: 3, tipo: 'documental', inicio: '2026-04-01', fim: '2026-04-15' },
    { id: 4, tipo: 'adhoc', inicio: '2026-04-16', fim: '2026-05-31' },
    { id: 5, tipo: 'preliminar', inicio: '2026-06-05', fim: '2026-06-05' },
    { id: 6, tipo: 'revisao', inicio: '2026-06-06', fim: '2026-06-15' },
    { id: 7, tipo: 'final', inicio: '2026-06-25', fim: '2026-06-25' },
  ]);
  const [captacaoCronogramaSelecionada, setCaptacaoCronogramaSelecionada] = useState('');
  const [captacaoFomentoSelecionada, setCaptacaoFomentoSelecionada] = useState('');
  const [nomeCaptacaoCronograma, setNomeCaptacaoCronograma] = useState('');
  const [quantidadeCaptacoesFomento, setQuantidadeCaptacoesFomento] = useState(1);
  const nextEtapaCronogramaId = useRef(8);
  const [adiamentosCronograma, setAdiamentosCronograma] = useState<AdiamentoCronograma[]>([]);
  const [diasAdiamentoPorEtapa, setDiasAdiamentoPorEtapa] = useState<Record<number, string>>({});
  const [justificativaAdiamentoPorEtapa, setJustificativaAdiamentoPorEtapa] = useState<Record<number, string>>({});
  const nextAdiamentoCronogramaId = useRef(1);

  /* ── Section 2 (Recursos Financeiros) ── */
  const [parceriaSelecionada, setParceriaSelecionada] = useState('');
  const [valorParceria, setValorParceria] = useState('');
  const [origensRecurso, setOrigensRecurso] = useState<Record<string, boolean>>({
    tesouroEstadual: false, convenioFederal: false, parceriaPrivado: false,
  });
  const [aportesFinanceiros, setAportesFinanceiros] = useState<AporteFinanceiroCaptacao[]>(isEditMode ? [
    { id: 1, origemTipo: 'programa', origemId: 'inovacao_tech', valor: 'R$ 3.000.000,00' },
    { id: 2, origemTipo: 'parceria', origemId: 'parceria_1', valor: 'R$ 2.000.000,00' },
  ] : [
    { id: 1, origemTipo: 'programa', origemId: '', valor: '' },
  ]);
  const nextAporteId = useRef(isEditMode ? 3 : 2);
  const [showModalNovoRecurso, setShowModalNovoRecurso] = useState(false);
  const [novoRecursoOrigem, setNovoRecursoOrigem] = useState('');
  const [habilitarFaixas, setHabilitarFaixas] = useState(isEditMode);
  const [faixas, setFaixas] = useState<Faixa[]>(isEditMode ? [
    { id: 1, nome: 'Faixa 1', duracao: '24', valorMin: 'R$ 50.000,00', valorMax: 'R$ 200.000,00', valorAportado: 'R$ 3.000.000,00' },
    { id: 2, nome: 'Faixa 2', duracao: '36', valorMin: 'R$ 200.001,00', valorMax: 'R$ 500.000,00', valorAportado: 'R$ 2.000.000,00' },
  ] : [
    { id: 1, nome: '', duracao: '', valorMin: '', valorMax: '', valorAportado: '' }
  ]);
  const nextFaixaId = useRef(isEditMode ? 3 : 2);

  /* ── Section 3 (Parametrizações Gerais) ── */
  const [regrasParticipacao, setRegrasParticipacao] = useState({
    multiplas: isEditMode, coordenadorOutro: isEditMode, coordenadorBolsa: false, apenasEscolhidos: false,
  });
  const [tipoProponenteEscolhido, setTipoProponenteEscolhido] = useState<'instituicoes' | 'pessoas'>('instituicoes');
  const [instituicoesEscolhidas, setInstituicoesEscolhidas] = useState<Record<string, boolean>>({});
  const [pessoasEscolhidas, setPessoasEscolhidas] = useState<Record<string, boolean>>({});

  /* ── Section 4 (Requisitos do Coordenador) ── */
  const [vinculadaInstituicao, setVinculadaInstituicao] = useState('nao');
  const [direcionamentoProposta, setDirecionamentoProposta] = useState('aberta');
  const [instituicaoProponente, setInstituicaoProponente] = useState('');
  const [tipoInstituicaoProponente, setTipoInstituicaoProponente] = useState('');
  const [restricaoEmpregaticio, setRestricaoEmpregaticio] = useState(isEditMode);
  const [restricaoInstitucional, setRestricaoInstitucional] = useState(false);
  const [gestorObrigatorio, setGestorObrigatorio] = useState(isEditMode);
  const [nivelAcademico, setNivelAcademico] = useState(isEditMode ? 'doutorado' : '');
  const [parceriaInstituicoes, setParceriaInstituicoes] = useState(isEditMode ? 'sim' : 'nao');

  /* ── Section 5 (Avaliação e Prestação de Contas) ── */
  const [necessitaAvaliacao, setNecessitaAvaliacao] = useState('sim');
  const [quantidadeMinimaRevisores, setQuantidadeMinimaRevisores] = useState('2');
  const [revisoresAdHocSelecionados, setRevisoresAdHocSelecionados] = useState<Record<string, boolean>>(isEditMode ? { 'rev-001': true, 'rev-002': true } : {});
  const [cpfRevisorAdHoc, setCpfRevisorAdHoc] = useState('');
  const [possuiPrestacaoTecnica, setPossuiPrestacaoTecnica] = useState(isEditMode ? 'sim' : 'nao');
  const [possuiPrestacaoFinanceira, setPossuiPrestacaoFinanceira] = useState(isEditMode ? 'sim' : 'nao');
  const [rubricas, setRubricas] = useState<Record<string, boolean>>({
    materialPermanente: isEditMode, materialConsumo: isEditMode, passagem: false,
    diaria: false, pessoaFisica: false, pessoaJuridica: false, bolsa: isEditMode,
  });
  const [subRubricas, setSubRubricas] = useState<Record<string, boolean>>({
    equipamentosLaboratorio: isEditMode,
    mobiliarioTecnico: false,
    reagentes: isEditMode,
    materialGrafico: false,
    passagemAerea: false,
    passagemTerrestre: false,
    diariaNacional: false,
    diariaInternacional: false,
    consultoriaPf: false,
    servicoTecnicoPf: false,
    consultoriaPj: false,
    softwareServico: false,
    bolsaIc: isEditMode,
    bolsaMestrado: false,
    bolsaDoutorado: false,
  });

  /* ── Section 6 ── */
  const [bolsas, setBolsas] = useState<Bolsa[]>(isEditMode ? [
    { id: 1, modalidade: 'ic', nivel: 'a', versao: 'Última versão ativa', maxBolsistas: '2', quantidadeCotas: '50', institucional: false },
    { id: 2, modalidade: 'pesquisa', nivel: 'c', versao: 'Última versão ativa', maxBolsistas: '1', quantidadeCotas: '30', institucional: true },
  ] : [
    { id: 1, modalidade: '', nivel: '', versao: '', maxBolsistas: '', quantidadeCotas: '', institucional: false },
  ]);
  const nextBolsaId = useRef(isEditMode ? 3 : 2);

  /* ── Section 7 ── */
  const [docsSubmissao, setDocsSubmissao] = useState<Record<string, boolean>>({
    contratoSocial: isEditMode,
    balancoPatrimonial: false,
    certidaoRegularidadeFiscal: false,
    comprovanteRepresentanteLegal: isEditMode,
    declaracaoCapacidadeTecnica: false,
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
  const toggleInstituicaoEscolhida = (k: string) => setInstituicoesEscolhidas(p => ({ ...p, [k]: !p[k] }));
  const togglePessoaEscolhida = (k: string) => setPessoasEscolhidas(p => ({ ...p, [k]: !p[k] }));
  const toggleCategoriaIniciativa = (k: string) => setCategoriasIniciativa(p => ({ ...p, [k]: !p[k] }));
  const toggleRubrica = (k: string) => setRubricas(p => ({ ...p, [k]: !p[k] }));
  const toggleSubRubrica = (k: string) => setSubRubricas(p => ({ ...p, [k]: !p[k] }));
  const toggleOrigem = (k: string) => setOrigensRecurso(p => ({ ...p, [k]: !p[k] }));
  const toggleDocSubmissao = (k: string) => setDocsSubmissao(p => ({ ...p, [k]: !p[k] }));
  const toggleArquivoPublico = (k: string) => setArquivosPublicos(p => ({ ...p, [k]: !p[k] }));
  const removerRevisorAdHoc = (k: string) => setRevisoresAdHocSelecionados(p => ({ ...p, [k]: false }));

  const addBolsa = () =>
    setBolsas(p => [...p, { id: nextBolsaId.current++, modalidade: '', nivel: '', versao: '', maxBolsistas: '', quantidadeCotas: '', institucional: false }]);
  const removeBolsa = (id: number) => setBolsas(p => p.filter(b => b.id !== id));
  const updateBolsa = <K extends keyof Bolsa>(id: number, field: K, value: Bolsa[K]) =>
    setBolsas(p => p.map(b => b.id === id ? { ...b, [field]: value } : b));

  const addFaixa = () => setFaixas(p => [...p, { id: nextFaixaId.current++, nome: '', duracao: '', valorMin: '', valorMax: '', valorAportado: '' }]);
  const removeFaixa = (id: number) => setFaixas(p => p.filter(f => f.id !== id));
  const updateFaixa = <K extends keyof Faixa>(id: number, field: K, value: Faixa[K]) =>
    setFaixas(p => p.map(f => f.id === id ? { ...f, [field]: value } : f));

  const addAporteFinanceiro = () =>
    setAportesFinanceiros(p => [...p, { id: nextAporteId.current++, origemTipo: 'programa', origemId: '', valor: '' }]);
  const removeAporteFinanceiro = (id: number) => setAportesFinanceiros(p => p.filter(aporte => aporte.id !== id));
  const updateAporteFinanceiro = <K extends keyof AporteFinanceiroCaptacao>(id: number, field: K, value: AporteFinanceiroCaptacao[K]) =>
    setAportesFinanceiros(p => p.map(aporte => aporte.id === id ? { ...aporte, [field]: value } : aporte));

  const addEtapaCronograma = () => {
    const proximaFase = fasesCronograma.find(fase => !cronogramaCaptacao.some(etapa => etapa.tipo === fase.key));
    if (!proximaFase) return;
    setCronogramaCaptacao(p => [...p, { id: nextEtapaCronogramaId.current++, tipo: proximaFase.key, inicio: '', fim: '' }]);
  };
  const addEtapaCronogramaFomento = () =>
    setCronogramaCaptacao(p => [...p, { id: nextEtapaCronogramaId.current++, tipo: '', inicio: '', fim: '' }]);
  const removeEtapaCronograma = (id: number) => setCronogramaCaptacao(p => p.filter(etapa => etapa.id !== id));
  const updateCronograma = <K extends keyof EtapaCronograma>(id: number, campo: K, value: EtapaCronograma[K]) =>
    setCronogramaCaptacao(p => p.map(etapa => etapa.id === id ? { ...etapa, [campo]: value } : etapa));

  const addDaysToDate = (date: string, days: number) => {
    if (!date) return date;
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;
    parsed.setDate(parsed.getDate() + days);
    return parsed.toISOString().slice(0, 10);
  };

  const formatDateLabel = (date: string) => {
    if (!date) return 'sem data';
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('pt-BR');
  };

  const aplicarAdiamentoCronograma = (etapa: EtapaCronograma) => {
    const dias = Number(diasAdiamentoPorEtapa[etapa.id]);
    const justificativa = (justificativaAdiamentoPorEtapa[etapa.id] || '').trim();
    if (!Number.isFinite(dias) || dias <= 0) {
      toast.error('Informe a quantidade de dias do adiamento.');
      return;
    }
    if (!justificativa) {
      toast.error('Informe a justificativa do adiamento.');
      return;
    }

    const ordemEtapa = fasesCronograma.findIndex(fase => fase.key === etapa.tipo);
    if (ordemEtapa < 0) {
      toast.error('Selecione uma etapa válida para aplicar o adiamento.');
      return;
    }
    const dataInicioNova = addDaysToDate(etapa.inicio, dias);
    const dataFimNova = addDaysToDate(etapa.fim, dias);
    setCronogramaCaptacao(p => p.map(item => {
      const ordemItem = fasesCronograma.findIndex(fase => fase.key === item.tipo);
      if (ordemItem < ordemEtapa || ordemItem < 0) return item;

      return {
        ...item,
        inicio: addDaysToDate(item.inicio, dias),
        fim: addDaysToDate(item.fim, dias),
      };
    }));
    setAdiamentosCronograma(p => [
      ...p,
      {
        id: nextAdiamentoCronogramaId.current++,
        etapaTipo: etapa.tipo,
        dias,
        justificativa,
        dataRegistro: new Date().toLocaleDateString('pt-BR'),
        dataInicioOriginal: etapa.inicio,
        dataFimOriginal: etapa.fim,
        dataInicioNova,
        dataFimNova,
      },
    ]);
    setDiasAdiamentoPorEtapa(p => ({ ...p, [etapa.id]: '' }));
    setJustificativaAdiamentoPorEtapa(p => ({ ...p, [etapa.id]: '' }));
  };

  const parseCurrency = (value: string) => {
    const normalized = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const valorTotalAportado = aportesFinanceiros.reduce((total, aporte) => total + parseCurrency(aporte.valor), 0);
  const valorTotalFaixas = faixas.reduce((total, faixa) => total + parseCurrency(faixa.valorAportado), 0);

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

  const categoriaIniciativaOpts = tipoFomentoOpts;
  const categoriasSelecionadas = categoriaIniciativaOpts.filter(item => categoriasIniciativa[item.value]);

  const tipoInstituicaoOpts = [
    { value: 'ensino', label: 'Instituição de ensino' },
    { value: 'empresa', label: 'Empresa' },
    { value: 'governo', label: 'Órgão de governo' },
    { value: 'osc', label: 'Organização da sociedade civil' },
  ];

  const instituicaoOpts = [
    { value: 'ufes', label: 'UFES - Universidade Federal do Espírito Santo' },
    { value: 'ifes', label: 'IFES - Instituto Federal do Espírito Santo' },
    { value: 'fapes', label: 'FAPES' },
  ];

  const fasesCronograma = [
    { key: 'publicacao', label: 'Publicação da Captação', periodo: false },
    { key: 'recebimento', label: 'Recedimento das Propostas', periodo: true },
    { key: 'documental', label: 'Habilitação de Documentos', periodo: true },
    { key: 'adhoc', label: 'Avaliação Ad Hoc', periodo: true },
    { key: 'preliminar', label: 'Publicação do Resultado Preliminar', periodo: false },
    { key: 'revisao', label: 'Revisão do Resultado Preliminar', periodo: true },
    { key: 'final', label: 'Publicação do Resultado Final', periodo: false },
  ];
  const captacaoCronogramaOptions = [
    { value: 'bolsas_pesquisa_2026', label: 'Bolsas de Pesquisa 2026' },
    { value: 'inovacao_tecnologica_2026', label: 'Inovação Tecnológica 2026' },
    { value: 'extensao_universitaria_2026', label: 'Extensão Universitária 2026' },
  ];
  const captacaoFomentoOptions = [
    { value: 'fomento_inovacao_2026', label: 'Fomento à Inovação 2026' },
    { value: 'fomento_pesquisa_2026', label: 'Fomento à Pesquisa 2026' },
    { value: 'fomento_extensao_2026', label: 'Fomento à Extensão 2026' },
  ];
  const cronogramasPorCaptacao: Record<string, EtapaCronograma[]> = {
    bolsas_pesquisa_2026: [
      { id: 1, tipo: 'publicacao', inicio: '2026-02-01', fim: '2026-02-01' },
      { id: 2, tipo: 'recebimento', inicio: '2026-02-01', fim: '2026-03-31' },
      { id: 3, tipo: 'documental', inicio: '2026-04-01', fim: '2026-04-15' },
      { id: 4, tipo: 'adhoc', inicio: '2026-04-16', fim: '2026-05-31' },
      { id: 5, tipo: 'preliminar', inicio: '2026-06-05', fim: '2026-06-05' },
      { id: 6, tipo: 'revisao', inicio: '2026-06-06', fim: '2026-06-15' },
      { id: 7, tipo: 'final', inicio: '2026-06-25', fim: '2026-06-25' },
    ],
    inovacao_tecnologica_2026: [
      { id: 1, tipo: 'publicacao', inicio: '2026-03-05', fim: '2026-03-05' },
      { id: 2, tipo: 'recebimento', inicio: '2026-03-05', fim: '2026-04-20' },
      { id: 3, tipo: 'documental', inicio: '2026-04-22', fim: '2026-05-05' },
      { id: 4, tipo: 'adhoc', inicio: '2026-05-06', fim: '2026-06-12' },
      { id: 5, tipo: 'preliminar', inicio: '2026-06-18', fim: '2026-06-18' },
      { id: 6, tipo: 'revisao', inicio: '2026-06-19', fim: '2026-06-26' },
      { id: 7, tipo: 'final', inicio: '2026-07-10', fim: '2026-07-10' },
    ],
    extensao_universitaria_2026: [
      { id: 1, tipo: 'publicacao', inicio: '2026-04-01', fim: '2026-04-01' },
      { id: 2, tipo: 'recebimento', inicio: '2026-04-01', fim: '2026-05-15' },
      { id: 3, tipo: 'documental', inicio: '2026-05-18', fim: '2026-05-29' },
      { id: 4, tipo: 'adhoc', inicio: '2026-06-01', fim: '2026-06-30' },
      { id: 5, tipo: 'preliminar', inicio: '2026-07-06', fim: '2026-07-06' },
      { id: 6, tipo: 'revisao', inicio: '2026-07-07', fim: '2026-07-14' },
      { id: 7, tipo: 'final', inicio: '2026-07-27', fim: '2026-07-27' },
    ],
  };
  const selecionarCaptacaoCronograma = (value: string) => {
    setCaptacaoCronogramaSelecionada(value);
    const template = cronogramasPorCaptacao[value];
    if (!template) return;
    setCronogramaCaptacao(template);
    nextEtapaCronogramaId.current = template.length + 1;
  };
  const etapasCronogramaFaltantes = fasesCronograma.filter(fase => !cronogramaCaptacao.some(etapa => etapa.tipo === fase.key));
  const cronogramaCompleto = etapasCronogramaFaltantes.length === 0;

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

  const revisoresAdHocData = [
    { id: 'rev-001', nome: 'Dra. Helena Martins', cpf: '123.456.789-00', area: 'Pesquisa em Saúde', titulacao: 'Doutorado', instituicao: 'UFES' },
    { id: 'rev-002', nome: 'Dr. Rafael Nogueira', cpf: '234.567.890-11', area: 'Inovação Tecnológica', titulacao: 'Doutorado', instituicao: 'IFES' },
    { id: 'rev-003', nome: 'Dra. Livia Barbosa', cpf: '345.678.901-22', area: 'Educação e Extensão', titulacao: 'Doutorado', instituicao: 'Ufes' },
    { id: 'rev-004', nome: 'Dr. Marcos Teixeira', cpf: '456.789.012-33', area: 'Ciências Agrárias', titulacao: 'Mestrado', instituicao: 'Incaper' },
  ];
  const termoBuscaRevisor = cpfRevisorAdHoc.trim().toLowerCase();
  const revisoresFiltradosAdHoc = revisoresAdHocData.filter(revisor =>
    !revisoresAdHocSelecionados[revisor.id] && (
      !termoBuscaRevisor ||
      revisor.cpf.includes(cpfRevisorAdHoc.trim()) ||
      revisor.nome.toLowerCase().includes(termoBuscaRevisor)
    )
  );
  const revisoresSelecionadosAdHoc = revisoresAdHocData.filter(revisor => revisoresAdHocSelecionados[revisor.id]);

  const selecionarRevisorAdHoc = (id: string) => {
    setRevisoresAdHocSelecionados(p => ({ ...p, [id]: true }));
    setCpfRevisorAdHoc('');
  };

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

  const rubricasPermitidasData = [
    {
      key: 'materialPermanente',
      label: 'Material Permanente',
      descricao: 'Bens permanentes e equipamentos.',
      subRubricas: [
        { key: 'equipamentosLaboratorio', label: 'Equipamentos de laboratório' },
        { key: 'mobiliarioTecnico', label: 'Mobiliário técnico' },
      ],
    },
    {
      key: 'materialConsumo',
      label: 'Material de Consumo',
      descricao: 'Itens consumíveis usados no projeto.',
      subRubricas: [
        { key: 'reagentes', label: 'Reagentes e insumos laboratoriais' },
        { key: 'materialGrafico', label: 'Material gráfico e expediente' },
      ],
    },
    {
      key: 'passagem',
      label: 'Passagens',
      descricao: 'Deslocamentos aéreos, terrestres ou similares.',
      subRubricas: [
        { key: 'passagemAerea', label: 'Passagem aérea' },
        { key: 'passagemTerrestre', label: 'Passagem terrestre' },
      ],
    },
    {
      key: 'diaria',
      label: 'Diárias',
      descricao: 'Diárias vinculadas às atividades do projeto.',
      subRubricas: [
        { key: 'diariaDentroEstado', label: 'Dentro do Estado' },
        { key: 'diariaNacional', label: 'Nacional' },
        { key: 'diariaInternacional', label: 'Internacional' },
      ],
    },
    {
      key: 'pessoaFisica',
      label: 'Pessoa Física',
      descricao: 'Serviços ou pagamentos para pessoa física.',
      subRubricas: [
        { key: 'consultoriaPf', label: 'Consultoria pessoa física' },
        { key: 'servicoTecnicoPf', label: 'Serviço técnico especializado' },
      ],
    },
    {
      key: 'pessoaJuridica',
      label: 'Pessoa Jurídica',
      descricao: 'Serviços contratados de pessoa jurídica.',
      subRubricas: [
        { key: 'consultoriaPj', label: 'Consultoria pessoa jurídica' },
        { key: 'softwareServico', label: 'Software e serviços digitais' },
      ],
    },
    {
      key: 'bolsa',
      label: 'Bolsa',
      descricao: 'Modalidades e níveis de bolsa permitidos na captação.',
      subRubricas: [
        { key: 'bolsaIc', label: 'Iniciação Científica' },
        { key: 'bolsaMestrado', label: 'Mestrado' },
        { key: 'bolsaDoutorado', label: 'Doutorado' },
        { key: 'bolsaPosDoutorado', label: 'Pós-Doutorado' },
        { key: 'bolsaBpcPq', label: 'BPC-PQ' },
        { key: 'bolsaBpcDt', label: 'BPC-DT' },
      ],
    },
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

  const pageShell = (children: React.ReactNode) => (
    <div
      style={{
        backgroundColor: T.bgPage,
        minHeight: '100vh',
        '--form-card-bg': T.bgCard,
        '--form-inner-card-bg': T.bgSurfaceMuted,
        '--form-input-bg': T.bgInput,
        '--form-border': T.borderDefault,
        '--form-divider': T.borderSubtle,
        '--form-text-primary': T.textPrimary,
        '--form-text-secondary': T.textSecondary,
        '--form-text-muted': T.textMuted,
      } as React.CSSProperties}
    >
      <div style={{ padding: '32px 32px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)' }}>
            {moduleLabel}
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
            {createTitle}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={18} style={{ color: '#00c1af' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 4px' }}>
              {createTitle}
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
              {isFomento ? 'Configure as informações principais de fomento.' : 'A partir do Cronograma criado em Fomento, configure as datas da Captação.'}
            </p>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--form-divider)', margin: '20px 0 28px' }} />

        {children}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
          <button type="button" onClick={onBack} style={{ padding: '11px 20px', backgroundColor: 'transparent', border: '1px solid var(--form-border)', borderRadius: 'var(--radius)', color: 'var(--form-text-secondary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
            Salvar Rascunho
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isFomento && !cronogramaCompleto) {
                toast.error(`Inclua um card para cada etapa obrigatória do cronograma: ${etapasCronogramaFaltantes.map(fase => fase.label).join(', ')}.`);
                return;
              }
              toast.success(`${moduleLabel} salvo com sucesso.`);
              onBack();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', backgroundColor: '#00c1af', border: 'none', borderRadius: 'var(--radius)', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}
          >
            {isFomento ? 'Ativar Fomento' : 'Ativar Captação'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderFinanceiroFomento = () => (
    <div style={sectionCard}>
      <SectionHeader num="2" title="Financeiro" subtitle="Configure aportes financeiros e faixas de financiamento" />
      <InnerCard title="Aportes Financeiros da Captação">
        <div style={{ display: 'grid', gap: '16px' }}>
          {aportesFinanceiros.map((aporte, index) => {
            const origemOpts = aporte.origemTipo === 'programa' ? programaOpts : parceriasData;
            return (
              <div key={aporte.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 180px auto', gap: '14px', alignItems: 'end' }}>
                <SelectField
                  label={index === 0 ? 'Origem' : undefined}
                  value={aporte.origemTipo}
                  onChange={value => updateAporteFinanceiro(aporte.id, 'origemTipo', value as 'programa' | 'parceria')}
                  options={[{ value: 'programa', label: 'Programa' }, { value: 'parceria', label: 'Parceria' }]}
                />
                <SelectField
                  label={index === 0 ? 'Programa ou parceria' : undefined}
                  value={aporte.origemId}
                  onChange={value => updateAporteFinanceiro(aporte.id, 'origemId', value)}
                  placeholder="Selecione..."
                  options={origemOpts}
                />
                <div>
                  {index === 0 && <label style={labelStyle}>Valor</label>}
                  <input type="text" placeholder="R$ 0,00" value={aporte.valor} onChange={e => updateAporteFinanceiro(aporte.id, 'valor', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                </div>
                {aportesFinanceiros.length > 1 && (
                  <button type="button" onClick={() => removeAporteFinanceiro(aporte.id)} style={{ padding: '10px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                    <Trash2 size={16} style={{ color: '#ef4444' }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af' }}>Total aportado: {formatCurrency(valorTotalAportado)}</span>
          <button type="button" onClick={addAporteFinanceiro} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'rgba(0,193,175,0.1)', border: '1px solid rgba(0,193,175,0.3)', borderRadius: 'var(--radius)', color: '#00c1af', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
            <Plus size={16} /> Adicionar Aporte
          </button>
        </div>
      </InnerCard>

      <div style={{ height: '18px' }} />

      <InnerCard title="Faixas de Financiamento">
        <div style={{ display: 'grid', gap: '16px' }}>
          {faixas.map((faixa, index) => (
            <div key={faixa.id} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Nome da Faixa</label>
                <input type="text" placeholder="Digite o nome da faixa" value={faixa.nome} onChange={e => updateFaixa(faixa.id, 'nome', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '14px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Duração máxima</label>
                  <input type="number" placeholder="Meses" value={faixa.duracao} onChange={e => updateFaixa(faixa.id, 'duracao', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                </div>
                <div>
                  <label style={labelStyle}>Valor mínimo</label>
                  <input type="text" placeholder="R$ 0,00" value={faixa.valorMin} onChange={e => updateFaixa(faixa.id, 'valorMin', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                </div>
                <div>
                  <label style={labelStyle}>Valor máximo</label>
                  <input type="text" placeholder="R$ 0,00" value={faixa.valorMax} onChange={e => updateFaixa(faixa.id, 'valorMax', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                </div>
                <div>
                  <label style={labelStyle}>Valor aportado</label>
                  <input type="text" placeholder="R$ 0,00" value={faixa.valorAportado} onChange={e => updateFaixa(faixa.id, 'valorAportado', e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                </div>
                {faixas.length > 1 ? (
                  <button type="button" onClick={() => removeFaixa(faixa.id)} style={{ padding: '10px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                    <Trash2 size={16} style={{ color: '#ef4444' }} />
                  </button>
                ) : <div />}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af' }}>Aportado nas faixas: {formatCurrency(valorTotalFaixas)}</span>
          <button type="button" onClick={addFaixa} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'rgba(0,193,175,0.1)', border: '1px solid rgba(0,193,175,0.3)', borderRadius: 'var(--radius)', color: '#00c1af', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
            <Plus size={16} /> Adicionar Faixa
          </button>
        </div>
      </InnerCard>
    </div>
  );

  const renderCronogramaCaptacao = (sectionNumber = '1', showNomeCaptacao = false) => (
    <div style={sectionCard}>
      <SectionHeader num={sectionNumber} title={showNomeCaptacao ? 'Cronograma' : 'Cronograma da Captação'} subtitle="Configure as fases obrigatórias da captação" />
      <div style={{ display: 'grid', gridTemplateColumns: showNomeCaptacao ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {!showNomeCaptacao && (
          <SelectField
            label="Fomento"
            value={captacaoFomentoSelecionada}
            onChange={setCaptacaoFomentoSelecionada}
            placeholder="Selecione o fomento..."
            options={captacaoFomentoOptions}
          />
        )}
        {!showNomeCaptacao && (
          <div>
            <label style={labelStyle}>Nome</label>
            <input type="text" placeholder="Digite o nome da captação" value={nomeCaptacaoCronograma} onChange={e => setNomeCaptacaoCronograma(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 6px' }}>Etapas do Cronograma</p>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>Adicione um card para cada etapa obrigatória da captação.</p>
        </div>
        {showNomeCaptacao && (
          <button type="button" onClick={addEtapaCronogramaFomento} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'rgba(0,193,175,0.1)', border: '1px solid rgba(0,193,175,0.3)', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>
            <Plus size={16} /> Adicionar Etapa
          </button>
        )}
      </div>

      {!cronogramaCompleto && (
        <div style={{ padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid rgba(0,193,175,0.24)', backgroundColor: 'rgba(0,193,175,0.08)', marginBottom: '18px' }}>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', margin: 0 }}>
            Faltam etapas obrigatórias: {etapasCronogramaFaltantes.map(fase => fase.label).join(', ')}.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {cronogramaCaptacao.map((etapa, index) => {
          const faseSelecionada = fasesCronograma.find(fase => fase.key === etapa.tipo);
          return (
            <div key={etapa.id} style={showNomeCaptacao ? { display: 'grid', gap: '8px' } : { ...innerCardStyle, padding: '18px' }}>
              {!showNomeCaptacao && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: 0 }}>Etapa {index + 1}</p>
                  <button type="button" onClick={() => removeEtapaCronograma(etapa.id)} disabled={Boolean(captacaoCronogramaSelecionada)} style={{ padding: '8px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', cursor: captacaoCronogramaSelecionada ? 'not-allowed' : 'pointer', display: 'flex', opacity: captacaoCronogramaSelecionada ? 0.35 : 1 }}>
                    <Trash2 size={15} style={{ color: '#ef4444' }} />
                  </button>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: showNomeCaptacao ? '1fr 46px' : '1.4fr 1fr 1fr', gap: '16px', alignItems: 'end' }}>
                {captacaoCronogramaSelecionada && !showNomeCaptacao ? (
                  <div>
                    <label style={labelStyle}>Etapa obrigatória</label>
                    <input type="text" value={faseSelecionada?.label || ''} readOnly style={{ ...inputStyle, color: 'var(--form-text-secondary)' }} />
                  </div>
                ) : (
                  <SelectField label={showNomeCaptacao ? `Etapa ${index + 1}` : 'Etapa obrigatória'} value={etapa.tipo} onChange={value => updateCronograma(etapa.id, 'tipo', value)} placeholder="Selecione a etapa..." options={(showNomeCaptacao || !etapa.tipo ? fasesCronograma : fasesCronograma.filter(fase => fase.key === etapa.tipo || !cronogramaCaptacao.some(item => item.tipo === fase.key))).map(fase => ({ value: fase.key, label: fase.label }))} />
                )}
                {showNomeCaptacao && (
                  <button type="button" onClick={() => removeEtapaCronograma(etapa.id)} style={{ height: '44px', width: '44px', padding: 0, backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={16} style={{ color: '#ef4444' }} />
                  </button>
                )}
                {!showNomeCaptacao && (
                  <>
                    <div>
                      <label style={labelStyle}>Data Inicial</label>
                      <BackofficeDatePicker value={etapa.inicio} onChange={value => updateCronograma(etapa.id, 'inicio', value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
                    </div>
                    <div style={{ opacity: faseSelecionada?.periodo ? 1 : 0.35 }}>
                      <label style={labelStyle}>Data final</label>
                      <BackofficeDatePicker value={etapa.fim} onChange={value => updateCronograma(etapa.id, 'fim', value)} style={inputStyle} disabled={!faseSelecionada?.periodo} onFocus={focusTeal} onBlur={blurGray} />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isFomento) {
    return pageShell(
      <>
        <div style={sectionCard}>
          <SectionHeader num="1" title="Identificação do Fomento" subtitle="Informações básicas do fomento" />
          <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.5fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div><label style={labelStyle}>Código</label><input type="text" placeholder="Ex: FOM-2026-001" value={numeroCaptacao} onChange={e => setNumeroCaptacao(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} /></div>
            <div><label style={labelStyle}>Título</label><input type="text" placeholder="Digite o título do fomento" value={tituloCaptacao} onChange={e => setTituloCaptacao(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} /></div>
            <SelectField label="Status" value={statusFomento} onChange={setStatusFomento} placeholder="Selecione..." options={[
              { value: 'em_elaboracao', label: 'Em Elaboração' },
              { value: 'aprovado', label: 'Aprovado' },
              { value: 'interrompido', label: 'Interrompido' },
              { value: 'encerrado', label: 'Encerrado' },
              { value: 'concluido', label: 'Concluído' },
            ]} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Descrição</label>
            <textarea placeholder="Descreva o fomento" value={descricaoCaptacao} onChange={e => setDescricaoCaptacao(e.target.value)} style={{ ...inputStyle, minHeight: '96px', resize: 'vertical' }} onFocus={focusTeal} onBlur={blurGray} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div><label style={labelStyle}>Data de Início</label><BackofficeDatePicker value={dataInicio} onChange={setDataInicio} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} /></div>
            <div><label style={labelStyle}>Data de Fim</label><BackofficeDatePicker value={dataFim} onChange={setDataFim} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} /></div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Resultado Esperado</label>
            <textarea placeholder="Informe o resultado esperado" value={resultadoEsperado} onChange={e => setResultadoEsperado(e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} onFocus={focusTeal} onBlur={blurGray} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
            <SelectField label="Área Técnica Responsável" value={setorResponsavel} onChange={setSetorResponsavel} placeholder="Selecione..." options={setorResponsavelOpts} />
            <div><label style={labelStyle}>Eixo Estratégico</label><input type="text" placeholder="Digite o eixo estratégico" value={eixoEstrategico} onChange={e => setEixoEstrategico(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} /></div>
          </div>
        </div>

        {renderFinanceiroFomento()}

        <div style={sectionCard}>
          <SectionHeader num="3" title="Parametrizações Gerais e Requisitos" subtitle="Defina regras de submissão e critérios de elegibilidade" />
          {[
            { key: 'multiplas', label: 'Permitir múltiplas propostas por proponente' },
            { key: 'coordenadorOutro', label: 'Coordenador pode ter outro projeto ou proposta ativa' },
            { key: 'coordenadorBolsa', label: 'Coordenador pode acumular bolsa' },
            { key: 'apenasEscolhidos', label: 'Apenas proponentes escolhidos podem submeter proposta' },
          ].map(item => (
            <div key={item.key} style={{ padding: '13px 0' }}>
              <CheckboxField label={item.label} checked={regrasParticipacao[item.key as keyof typeof regrasParticipacao]} onChange={() => toggleParticipacao(item.key as keyof typeof regrasParticipacao)} />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px', marginTop: '12px' }}>
            <SelectField label="Direcionamento das propostas" value={direcionamentoProposta} onChange={setDirecionamentoProposta} options={[
              { value: 'aberta', label: 'Aberta' },
              { value: 'instituicao', label: 'Instituição específica' },
              { value: 'tipo_instituicao', label: 'Tipo de instituição' },
            ]} />
            <SelectField label="Nível acadêmico mínimo exigido" value={nivelAcademico} onChange={setNivelAcademico} placeholder="Selecione..." options={nivelAcademicoOpts} />
          </div>
        </div>

        <div style={sectionCard}>
          <SectionHeader num="4" title="Rubricas" subtitle="Configure rubricas e sub-rubricas permitidas" />
          <div style={{ display: 'grid', gap: '10px' }}>
            {rubricasPermitidasData.map(item => {
              const checked = Boolean(rubricas[item.key]);
              const subRubricasFomento = ['diaria', 'bolsa'].includes(item.key) ? item.subRubricas : [];
              return (
                <div key={item.key} style={{ padding: '14px 16px', border: `1px solid ${checked ? 'rgba(0,193,175,0.35)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 'var(--radius)', backgroundColor: checked ? 'rgba(0,193,175,0.08)' : 'rgba(23,23,23,0.35)' }}>
                  <CheckboxField label={item.label} checked={checked} onChange={() => toggleRubrica(item.key)} />
                  {checked && subRubricasFomento.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginTop: '12px', paddingLeft: '28px' }}>
                      {subRubricasFomento.map(sub => <CheckboxField key={sub.key} label={sub.label} checked={Boolean(subRubricas[sub.key])} onChange={() => toggleSubRubrica(sub.key)} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={sectionCard}>
          <SectionHeader num="5" title="Documentos Exigidos do Proponente" subtitle="Selecione documentos exigidos para submissão" />
          <div>
            {[
              { key: 'contratoSocial', label: 'Contrato social ou estatuto' },
              { key: 'balancoPatrimonial', label: 'Balanço patrimonial' },
              { key: 'certidaoRegularidadeFiscal', label: 'Certidões de regularidade fiscal' },
              { key: 'comprovanteRepresentanteLegal', label: 'Comprovante do representante legal' },
              { key: 'declaracaoCapacidadeTecnica', label: 'Declaração de capacidade técnica' },
            ].map(item => (
              <div key={item.key} style={{ padding: '13px 0' }}>
                <CheckboxField label={item.label} checked={Boolean(docsSubmissao[item.key])} onChange={() => toggleDocSubmissao(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {renderCronogramaCaptacao('6', true)}
      </>
    );
  }

  if (!isFomento) {
    return pageShell(renderCronogramaCaptacao());
  }

  return (
    <div
      style={{
        backgroundColor: T.bgPage,
        minHeight: '100vh',
        '--form-card-bg': T.bgCard,
        '--form-inner-card-bg': T.bgSurfaceMuted,
        '--form-input-bg': T.bgInput,
        '--form-border': T.borderDefault,
        '--form-divider': T.borderSubtle,
        '--form-text-primary': T.textPrimary,
        '--form-text-secondary': T.textSecondary,
        '--form-text-muted': T.textMuted,
      } as React.CSSProperties}
    >
      <div style={{ padding: '32px 32px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)' }}>
            {moduleLabel}
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
            {createTitle}
          </span>
        </div>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={18} style={{ color: '#00c1af' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 4px' }}>
              {createTitle}
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
              {isEditMode ? `Edite a configuração do ${moduleLabel.toLowerCase()} usando os mesmos controles do cadastro.` : isFomento ? 'Crie e configure um novo fomento.' : 'Crie e configure o cronograma da captação.'}
            </p>
          </div>
        </div>

        {/* ══════ SESSÃO 1 — Identificação da Captação ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="1" title="Identificação da Captação" subtitle="Informações básicas da captação" />

          {/* Row 1: Código + Título da Captação + Tipo de Captação */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1.6fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Código da Captação</label>
              <input type="text" placeholder="Digite o código..." value={numeroCaptacao} onChange={e => setNumeroCaptacao(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
            </div>
            <div>
              <label style={labelStyle}>Título da Captação</label>
              <input type="text" placeholder="Digite o título..." value={tituloCaptacao} onChange={e => setTituloCaptacao(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
            </div>
            <SelectField label="Tipo de Captação" value={tipoCaptacao} onChange={setTipoCaptacao} placeholder="Selecione o tipo..."
              options={[{ value: 'chamada_publica', label: 'Chamada Pública' }, { value: 'demanda_induzida', label: 'Demanda Induzida' }]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '16px', alignItems: 'end', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Link do Edital</label>
              <input
                type="url"
                placeholder="https://..."
                value={linkEdital}
                onChange={e => setLinkEdital(e.target.value)}
                style={inputStyle}
                onFocus={focusTeal}
                onBlur={blurGray}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                minHeight: '42px',
                padding: '10px 16px',
                backgroundColor: 'rgba(0,193,175,0.1)',
                border: '1px solid rgba(0,193,175,0.3)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#00c1af',
                boxSizing: 'border-box',
              }}>
                <Plus size={16} />
                {arquivoEdital || 'Anexar Arquivo'}
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={event => setArquivoEdital(event.target.files?.[0]?.name || '')}
                />
              </label>
            </div>
          </div>

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

          <div style={{ marginBottom: '20px' }}>
            <SelectField
              label="Área Técnica Responsável"
              value={setorResponsavel}
              onChange={setSetorResponsavel}
              placeholder="Selecione a área..."
              options={setorResponsavelOpts}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Categorias de Projetos</label>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)' }}>
                {categoriasSelecionadas.length} selecionada(s)
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowCategoriasDropdown(!showCategoriasDropdown)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  backgroundColor: 'rgba(38, 38, 38, 0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                  {categoriasSelecionadas.length === 0 ? (
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.42)' }}>
                      Selecione uma ou mais categorias...
                    </span>
                  ) : categoriasSelecionadas.map(item => (
                    <span
                      key={item.value}
                      style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)',
                        color: '#00c1af',
                        padding: '5px 9px',
                        borderRadius: '999px',
                        border: '1px solid rgba(0,193,175,0.28)',
                        backgroundColor: 'rgba(0,193,175,0.08)',
                      }}
                    >
                      {item.label}
                    </span>
                  ))}
                </span>
                <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.55)', flexShrink: 0, transform: showCategoriasDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showCategoriasDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  zIndex: 30,
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'rgba(23, 23, 23,0.98)',
                  overflow: 'hidden',
                  boxShadow: '0 18px 45px rgba(0,0,0,0.35)',
                }}>
                  {categoriaIniciativaOpts.map((item, index) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleCategoriaIniciativa(item.value)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    padding: '13px 16px',
                    border: 'none',
                    borderBottom: index === categoriaIniciativaOpts.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: categoriasIniciativa[item.value] ? 'rgba(0,193,175,0.09)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)' }}>{item.label}</span>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: `2px solid ${categoriasIniciativa[item.value] ? '#00c1af' : 'rgba(255,255,255,0.24)'}`,
                    backgroundColor: categoriasIniciativa[item.value] ? '#00c1af' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {categoriasIniciativa[item.value] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 1b: Ortogado destinatário (apenas se Demanda Induzida) */}
          {tipoCaptacao === 'demanda_induzida' && (
            <div style={{ marginBottom: '20px' }} ref={coordenadorRef}>
              <label style={labelStyle}>Ortogado destinatário</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Busque pelo nome ou CPF do ortogado..."
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
                    backgroundColor: 'rgba(38, 38, 38, 0.95)',
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
                            color: 'var(--form-text-primary)',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div>{coord.nome} {coord.sobrenome}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--form-text-muted)' }}>{coord.cpf}</div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ ...innerCardStyle, marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 6px' }}>
                  Aportes Financeiros da Captação
                </p>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
                  Informe quais programas ou parcerias aportam recursos financeiros para esta captação.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {aportesFinanceiros.map((aporte, index) => (
                <div key={aporte.id}>
                  {index > 0 && <div style={{ ...divider, margin: '0 0 16px' }} />}
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <RadioGroup
                      value={aporte.origemTipo}
                      onChange={(value) => {
                        updateAporteFinanceiro(aporte.id, 'origemTipo', value as 'programa' | 'parceria');
                        updateAporteFinanceiro(aporte.id, 'origemId', '');
                      }}
                      options={[
                        { value: 'programa', label: 'Programa' },
                        { value: 'parceria', label: 'Parceria' },
                      ]}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px auto', gap: '16px', alignItems: 'end' }}>
                      <SelectField
                        label={aporte.origemTipo === 'programa' ? 'Programa aportador' : 'Parceria aportadora'}
                        value={aporte.origemId}
                        onChange={value => updateAporteFinanceiro(aporte.id, 'origemId', value)}
                        placeholder={aporte.origemTipo === 'programa' ? 'Selecione o programa...' : 'Selecione a parceria...'}
                        options={aporte.origemTipo === 'programa' ? programaOpts.filter(option => option.value !== 'nao_se_aplica') : parceriasData}
                      />
                      <div>
                        <label style={labelStyle}>Valor aportado (R$)</label>
                        <input
                          type="text"
                          placeholder="0,00"
                          value={aporte.valor}
                          onChange={e => updateAporteFinanceiro(aporte.id, 'valor', e.target.value)}
                          style={inputStyle}
                          onFocus={focusTeal}
                          onBlur={blurGray}
                        />
                      </div>
                      {aportesFinanceiros.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAporteFinanceiro(aporte.id)}
                        style={{ padding: '10px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={16} style={{ color: '#ef4444' }} />
                      </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>
                    Total dos aportes
                  </span>
                  <span style={{ display: 'block', marginTop: '4px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>
                    {formatCurrency(valorTotalAportado)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addAporteFinanceiro}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'rgba(0,193,175,0.1)', border: '1px solid rgba(0,193,175,0.3)', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}
                >
                  <Plus size={16} />
                  Adicionar Aporte
                </button>
              </div>
            </div>
          </div>

          <div style={{ ...innerCardStyle, marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 8px' }}>
                  Faixas de Financiamento
                </p>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
                  Distribua o valor aportado em faixas com duração máxima e limites financeiros.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              {faixas.map((faixa, index) => (
                <div key={faixa.id}>
                  {index > 0 && <div style={{ ...divider, margin: '16px 0' }} />}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '20px', alignItems: 'end' }}>
                    <div>
                      <label style={labelStyle}>Duração máxima do projeto (meses)</label>
                      <input
                        type="number"
                        placeholder="24"
                        value={faixa.duracao}
                        onChange={e => updateFaixa(faixa.id, 'duracao', e.target.value)}
                        style={inputStyle}
                        onFocus={focusTeal}
                        onBlur={blurGray}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Valor financeiro mínimo (R$)</label>
                      <input
                        type="number"
                        placeholder="50000"
                        value={faixa.valorMin}
                        onChange={e => updateFaixa(faixa.id, 'valorMin', e.target.value)}
                        style={inputStyle}
                        onFocus={focusTeal}
                        onBlur={blurGray}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Valor financeiro máximo (R$)</label>
                      <input
                        type="number"
                        placeholder="200000"
                        value={faixa.valorMax}
                        onChange={e => updateFaixa(faixa.id, 'valorMax', e.target.value)}
                        style={inputStyle}
                        onFocus={focusTeal}
                        onBlur={blurGray}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Valor aportado na faixa (R$)</label>
                      <input
                        type="number"
                        placeholder="250000"
                        value={faixa.valorAportado}
                        onChange={e => updateFaixa(faixa.id, 'valorAportado', e.target.value)}
                        style={inputStyle}
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
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>
                Aportado nas faixas
              </span>
              <span style={{ display: 'block', marginTop: '4px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#00c1af' }}>
                {formatCurrency(valorTotalFaixas)}
              </span>
            </div>
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
          </div>

        </div>

        {/* ══════ SESSÃO 2 — Cronograma da Captação ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="2" title="Cronograma da Captação" subtitle="Configure as fases obrigatórias da captação" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '18px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 6px' }}>
                Etapas do Cronograma
              </p>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
                Adicione um card para cada etapa obrigatória da captação.
              </p>
            </div>
            <button
              type="button"
              onClick={addEtapaCronograma}
              disabled={cronogramaCompleto}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: cronogramaCompleto ? 'rgba(255,255,255,0.06)' : 'rgba(0,193,175,0.1)',
                border: `1px solid ${cronogramaCompleto ? 'rgba(255,255,255,0.12)' : 'rgba(0,193,175,0.3)'}`,
                borderRadius: 'var(--radius)',
                cursor: cronogramaCompleto ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: cronogramaCompleto ? 'rgba(255,255,255,0.4)' : '#00c1af',
              }}
            >
              <Plus size={16} />
              Adicionar Etapa
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
            {fasesCronograma.map(fase => {
              const concluida = cronogramaCaptacao.some(etapa => etapa.tipo === fase.key);
              return (
                <span
                  key={fase.key}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '999px',
                    border: '1px solid rgba(0,193,175,0.35)',
                    backgroundColor: 'rgba(0,193,175,0.1)',
                    color: '#00c1af',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  {fase.label}
                </span>
              );
            })}
          </div>

          {!cronogramaCompleto && (
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid rgba(0,193,175,0.24)', backgroundColor: 'rgba(0,193,175,0.08)', marginBottom: '18px' }}>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', margin: 0 }}>
                Faltam etapas obrigatórias: {etapasCronogramaFaltantes.map(fase => fase.label).join(', ')}.
              </p>
            </div>
          )}

          <div style={{ display: 'grid', gap: '16px' }}>
            {cronogramaCaptacao.map((etapa, index) => {
              const faseSelecionada = fasesCronograma.find(fase => fase.key === etapa.tipo);
              return (
                <div key={etapa.id} style={{ ...innerCardStyle, padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: 0 }}>
                      Etapa {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeEtapaCronograma(etapa.id)}
                      style={{ padding: '8px', backgroundColor: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={15} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '16px', alignItems: 'end' }}>
                    <SelectField
                      label="Etapa obrigatória"
                      value={etapa.tipo}
                      onChange={value => updateCronograma(etapa.id, 'tipo', value)}
                      placeholder="Selecione a etapa..."
                      options={fasesCronograma
                        .filter(fase => fase.key === etapa.tipo || !cronogramaCaptacao.some(item => item.tipo === fase.key))
                        .map(fase => ({ value: fase.key, label: fase.label }))}
                    />
                    <div>
                      <label style={labelStyle}>{faseSelecionada?.periodo ? 'Data inicial' : 'Data'}</label>
                      <BackofficeDatePicker
                        value={etapa.inicio}
                        onChange={value => updateCronograma(etapa.id, 'inicio', value)}
                        style={inputStyle}
                        onFocus={focusTeal}
                        onBlur={blurGray}
                      />
                    </div>
                    <div style={{ opacity: faseSelecionada?.periodo ? 1 : 0.35 }}>
                      <label style={labelStyle}>Data final</label>
                      <BackofficeDatePicker
                        value={etapa.fim}
                        onChange={value => updateCronograma(etapa.id, 'fim', value)}
                        style={inputStyle}
                        disabled={!faseSelecionada?.periodo}
                        onFocus={focusTeal}
                        onBlur={blurGray}
                      />
                    </div>
                  </div>

                  <div style={{ ...divider, margin: '18px 0' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: '16px', alignItems: 'end' }}>
                    <div>
                      <label style={labelStyle}>Adiar por dias</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Ex: 7"
                        value={diasAdiamentoPorEtapa[etapa.id] || ''}
                        onChange={e => setDiasAdiamentoPorEtapa(p => ({ ...p, [etapa.id]: e.target.value }))}
                        style={inputStyle}
                        onFocus={focusTeal}
                        onBlur={blurGray}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Justificativa do adiamento</label>
                      <input
                        type="text"
                        placeholder="Informe o motivo do adiamento..."
                        value={justificativaAdiamentoPorEtapa[etapa.id] || ''}
                        onChange={e => setJustificativaAdiamentoPorEtapa(p => ({ ...p, [etapa.id]: e.target.value }))}
                        style={inputStyle}
                        onFocus={focusTeal}
                        onBlur={blurGray}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => aplicarAdiamentoCronograma(etapa)}
                      style={{
                        padding: '11px 16px',
                        backgroundColor: 'rgba(0,193,175,0.1)',
                        border: '1px solid rgba(0,193,175,0.3)',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: '#00c1af',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Aplicar adiamento
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {adiamentosCronograma.length > 0 && (
            <div style={{ ...innerCardStyle, marginTop: '18px', backgroundColor: 'rgba(0,193,175,0.06)', borderColor: 'rgba(0,193,175,0.2)' }}>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 12px' }}>
                Histórico de Adiamentos
              </p>
              <div style={{ display: 'grid', gap: '10px' }}>
                {adiamentosCronograma.map(adiamento => {
                  const fase = fasesCronograma.find(item => item.key === adiamento.etapaTipo);

                  return (
                    <div key={adiamento.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)' }}>
                          {fase?.label || 'Etapa'} adiada em {adiamento.dias} dia(s)
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#00c1af', marginTop: '3px' }}>
                          {formatDateLabel(adiamento.dataInicioOriginal)} → {formatDateLabel(adiamento.dataInicioNova)}
                          {adiamento.dataFimOriginal && ` · fim: ${formatDateLabel(adiamento.dataFimOriginal)} → ${formatDateLabel(adiamento.dataFimNova)}`}
                        </div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--form-text-muted)', marginTop: '3px' }}>
                          {adiamento.justificativa}
                        </div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#00c1af', whiteSpace: 'nowrap' }}>
                        {adiamento.dataRegistro}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ ...divider, margin: '24px 0' }} />

          <div>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 6px' }}>
              Formulários da Captação
            </p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: '0 0 16px' }}>
              Selecione os formulários usados nas etapas de inscrição, avaliação, recurso e anexos.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' }}>
              <SelectField label="Formulário de Submissão" value={formularioInscricao} onChange={setFormularioInscricao}
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
              <SelectField label="Formulário de Anexos" value={formularioAnexo} onChange={setFormularioAnexo}
                placeholder="Selecione o formulário..."
                options={formularioOpts}
              />
            </div>
          </div>
        </div>

        {/* ══════ SESSÃO 3 — Parametrizações Gerais ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="3" title="Parametrizações Gerais" subtitle="Defina regras de submissão e limites das propostas" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { key: 'multiplas', label: 'Permitir múltiplas propostas por proponente' },
              { key: 'coordenadorOutro', label: 'Coordenador pode ter outro projeto ou proposta ativa' },
              { key: 'coordenadorBolsa', label: 'Coordenador pode acumular bolsa' },
              { key: 'apenasEscolhidos', label: 'Apenas proponentes escolhidos podem submeter proposta' }
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

          {regrasParticipacao.apenasEscolhidos && (
            <div style={{ ...innerCardStyle, marginTop: '20px', backgroundColor: 'rgba(0,193,175,0.06)', borderColor: 'rgba(0,193,175,0.18)' }}>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 6px' }}>
                Proponentes Escolhidos
              </p>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: '0 0 16px' }}>
                Selecione quem poderá submeter proposta nesta captação.
              </p>

              <div style={{ marginBottom: '18px' }}>
                <RadioGroup
                  value={tipoProponenteEscolhido}
                  onChange={(value) => setTipoProponenteEscolhido(value as 'instituicoes' | 'pessoas')}
                  options={[
                    { value: 'instituicoes', label: 'Instituições' },
                    { value: 'pessoas', label: 'Pessoas' },
                  ]}
                />
              </div>

              <div style={{
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'rgba(23, 23, 23,0.35)',
                overflow: 'hidden',
              }}>
                {(tipoProponenteEscolhido === 'instituicoes' ? instituicaoOpts : coordenadoresData.map(pessoa => ({
                  value: pessoa.cpf,
                  label: `${pessoa.nome} ${pessoa.sobrenome} - ${pessoa.cpf}`,
                }))).map((item, index, arr) => {
                  const checked = tipoProponenteEscolhido === 'instituicoes'
                    ? Boolean(instituicoesEscolhidas[item.value])
                    : Boolean(pessoasEscolhidas[item.value]);

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => tipoProponenteEscolhido === 'instituicoes'
                        ? toggleInstituicaoEscolhida(item.value)
                        : togglePessoaEscolhida(item.value)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        padding: '13px 16px',
                        border: 'none',
                        borderBottom: index === arr.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: checked ? 'rgba(0,193,175,0.09)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)' }}>{item.label}</span>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: `2px solid ${checked ? '#00c1af' : 'rgba(255,255,255,0.24)'}`,
                        backgroundColor: checked ? '#00c1af' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {checked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ══════ SESSÃO 4 — Requisitos e Restrições ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="4" title="Requisitos e Restrições" subtitle="Defina critérios e condições de elegibilidade" />

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Direcionamento das propostas</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={direcionamentoProposta} onChange={setDirecionamentoProposta}
                options={[
                  { value: 'aberta', label: 'Aberta' },
                  { value: 'instituicao', label: 'Instituição específica' },
                  { value: 'tipo_instituicao', label: 'Tipo de instituição' },
                ]}
              />
            </div>
          </div>

          {direcionamentoProposta === 'instituicao' && (
            <div style={{ marginBottom: '24px' }}>
              <SelectField label="Instituição permitida" value={instituicaoProponente} onChange={setInstituicaoProponente} placeholder="Selecione a instituição..." options={instituicaoOpts} />
            </div>
          )}

          {direcionamentoProposta === 'tipo_instituicao' && (
            <div style={{ marginBottom: '24px' }}>
              <SelectField label="Tipo de instituição permitido" value={tipoInstituicaoProponente} onChange={setTipoInstituicaoProponente} placeholder="Selecione o tipo..." options={tipoInstituicaoOpts} />
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Permite parceria entre instituições?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={parceriaInstituicoes} onChange={setParceriaInstituicoes}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 4px' }}>Restrições de Vínculo</p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>Defina restrições sobre vínculo empregatício ou institucional</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { key: 'restricaoEmpregaticio', label: 'Restrições de vínculo empregatício', checked: restricaoEmpregaticio, onChange: () => setRestricaoEmpregaticio(!restricaoEmpregaticio) },
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
              label="Nível acadêmico mínimo exigido do coordenador do projeto"
              value={nivelAcademico}
              onChange={setNivelAcademico}
              placeholder="Selecione o nível..."
              options={nivelAcademicoOpts}
            />
          </div>
        </div>

        {/* ══════ SESSÃO 5 — Rubricas, Avaliação e Prestações ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="5" title="Rubricas, Avaliação e Prestações" subtitle="Configure rubricas, avaliação ad hoc e prestações exigidas" />

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Esta captação necessita de avaliação ad hoc?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={necessitaAvaliacao} onChange={setNecessitaAvaliacao}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          {necessitaAvaliacao === 'sim' && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Quantidade mínima de revisores ad hoc por proposta</label>
                <input type="number" min="1" placeholder="2" value={quantidadeMinimaRevisores} onChange={e => setQuantidadeMinimaRevisores(e.target.value)} style={inputStyle} onFocus={focusTeal} onBlur={blurGray} />
              </div>

              <div style={{ ...innerCardStyle, marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 6px' }}>
                      Pool de Revisores Ad Hoc
                    </p>
                    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
                      Informe o CPF para localizar e adicionar revisores ao pool desta captação.
                    </p>
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#00c1af', padding: '6px 10px', borderRadius: '999px', border: '1px solid rgba(0,193,175,0.28)', backgroundColor: 'rgba(0,193,175,0.08)', whiteSpace: 'nowrap' }}>
                    {revisoresSelecionadosAdHoc.length} selecionado(s)
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end', marginBottom: '14px' }}>
                  <div>
                    <label style={labelStyle}>CPF do revisor</label>
                    <input
                      type="text"
                      placeholder="Digite o CPF ou nome do revisor"
                      value={cpfRevisorAdHoc}
                      onChange={e => setCpfRevisorAdHoc(e.target.value)}
                      style={inputStyle}
                      onFocus={focusTeal}
                      onBlur={blurGray}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (revisoresFiltradosAdHoc[0]) selecionarRevisorAdHoc(revisoresFiltradosAdHoc[0].id);
                    }}
                    disabled={!revisoresFiltradosAdHoc[0]}
                    style={{
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 16px',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      backgroundColor: revisoresFiltradosAdHoc[0] ? '#00c1af' : 'rgba(255,255,255,0.08)',
                      color: revisoresFiltradosAdHoc[0] ? '#171717' : 'rgba(255,255,255,0.35)',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: revisoresFiltradosAdHoc[0] ? 'pointer' : 'not-allowed',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Plus size={16} />
                    Adicionar
                  </button>
                </div>

                {cpfRevisorAdHoc.trim() && (
                  <div style={{
                    display: 'grid',
                    gap: '8px',
                    marginBottom: '16px',
                  }}>
                    {revisoresFiltradosAdHoc.slice(0, 3).map(revisor => (
                      <button
                        key={revisor.id}
                        type="button"
                        onClick={() => selecionarRevisorAdHoc(revisor.id)}
                        style={{
                          width: '100%',
                          display: 'grid',
                          gridTemplateColumns: '1fr 150px 120px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '11px 12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 'var(--radius)',
                          backgroundColor: 'rgba(23, 23, 23,0.45)',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)' }}>{revisor.nome}</div>
                          <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{revisor.instituicao}</div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af' }}>{revisor.cpf}</span>
                        <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)', textAlign: 'right' }}>Selecionar</span>
                      </button>
                    ))}
                    {revisoresFiltradosAdHoc.length === 0 && (
                      <div style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', backgroundColor: 'rgba(23, 23, 23,0.35)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)' }}>
                        Nenhum revisor disponível encontrado para este CPF.
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'grid', gap: '12px' }}>
                  {revisoresSelecionadosAdHoc.length === 0 ? (
                    <div style={{ padding: '16px', border: '1px dashed rgba(255,255,255,0.18)', borderRadius: 'var(--radius)', backgroundColor: 'rgba(23, 23, 23,0.25)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)' }}>
                      Nenhum revisor ad hoc selecionado.
                    </div>
                  ) : revisoresSelecionadosAdHoc.map(revisor => (
                    <div
                      key={revisor.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.3fr 160px 1fr 120px auto',
                        gap: '12px',
                        alignItems: 'center',
                        padding: '14px',
                        border: '1px solid rgba(0,193,175,0.22)',
                        borderRadius: 'var(--radius)',
                        backgroundColor: 'rgba(23, 23, 23,0.42)',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)' }}>{revisor.nome}</div>
                        <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{revisor.instituicao}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af' }}>{revisor.cpf}</span>
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.68)' }}>{revisor.area}</span>
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.68)' }}>{revisor.titulacao}</span>
                      <button
                        type="button"
                        onClick={() => removerRevisorAdHoc(revisor.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(239,68,68,0.28)',
                          borderRadius: 'var(--radius)',
                          backgroundColor: 'rgba(239,68,68,0.08)',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Possui prestação de contas técnica?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={possuiPrestacaoTecnica} onChange={setPossuiPrestacaoTecnica}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Possui prestação de contas financeira?</label>
            <div style={{ paddingTop: '8px' }}>
              <RadioGroup value={possuiPrestacaoFinanceira} onChange={setPossuiPrestacaoFinanceira}
                options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]}
              />
            </div>
          </div>

          <div>
	            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 4px' }}>Rubricas Permitidas</p>
	            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>Selecione as rubricas de despesas que podem ser utilizadas. Ao selecionar uma rubrica, informe também quais sub-rubricas ficam permitidas.</p>
	            <div style={{
	              border: '1px solid rgba(255,255,255,0.12)',
	              borderRadius: 'var(--radius)',
	              backgroundColor: 'rgba(23, 23, 23,0.35)',
	              overflow: 'hidden',
	            }}>
	              {rubricasPermitidasData.map((item, index, lista) => {
	                const checked = Boolean(rubricas[item.key]);
                  const totalSubRubricasSelecionadas = item.subRubricas.filter(subRubrica => subRubricas[subRubrica.key]).length;
	
	                return (
	                  <div
	                    key={item.key}
	                    style={{
	                      borderBottom: index === lista.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.08)',
	                      backgroundColor: checked ? 'rgba(0,193,175,0.07)' : 'transparent',
	                    }}
	                  >
	                    <button
	                      type="button"
	                      onClick={() => toggleRubrica(item.key)}
	                      style={{
	                        width: '100%',
	                        display: 'grid',
	                        gridTemplateColumns: '1fr auto auto',
	                        alignItems: 'center',
	                        gap: '14px',
	                        padding: '14px 16px',
	                        border: 'none',
	                        backgroundColor: 'transparent',
	                        cursor: 'pointer',
	                        textAlign: 'left',
	                      }}
	                    >
	                      <span>
	                        <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)' }}>
	                          {item.label}
	                        </span>
	                        <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>
	                          {item.descricao}
	                        </span>
	                      </span>
	                      {checked && (
	                        <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: '#00c1af', padding: '5px 9px', borderRadius: '999px', border: '1px solid rgba(0,193,175,0.28)', backgroundColor: 'rgba(0,193,175,0.08)', whiteSpace: 'nowrap' }}>
	                          {totalSubRubricasSelecionadas} sub-rubrica(s)
	                        </span>
	                      )}
	                      <span style={{
	                        width: '18px',
	                        height: '18px',
	                        borderRadius: '4px',
	                        border: `2px solid ${checked ? '#00c1af' : 'rgba(255,255,255,0.24)'}`,
	                        backgroundColor: checked ? '#00c1af' : 'transparent',
	                        display: 'flex',
	                        alignItems: 'center',
	                        justifyContent: 'center',
	                      }}>
	                        {checked && (
	                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
	                            <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	                          </svg>
	                        )}
	                      </span>
	                    </button>

	                    {checked && (
	                      <div style={{
	                        padding: '0 16px 16px 16px',
	                        display: 'grid',
	                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	                        gap: '10px',
	                      }}>
	                        {item.subRubricas.map(subRubrica => {
	                          const subChecked = Boolean(subRubricas[subRubrica.key]);

	                          return (
	                            <button
	                              key={subRubrica.key}
	                              type="button"
	                              onClick={() => toggleSubRubrica(subRubrica.key)}
	                              style={{
	                                display: 'flex',
	                                alignItems: 'center',
	                                justifyContent: 'space-between',
	                                gap: '12px',
	                                minHeight: '42px',
	                                padding: '10px 12px',
	                                border: `1px solid ${subChecked ? 'rgba(0,193,175,0.34)' : 'rgba(255,255,255,0.1)'}`,
	                                borderRadius: 'var(--radius)',
	                                backgroundColor: subChecked ? 'rgba(0,193,175,0.1)' : 'rgba(23, 23, 23,0.35)',
	                                cursor: 'pointer',
	                                textAlign: 'left',
	                              }}
	                            >
	                              <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: subChecked ? '#ffffff' : 'rgba(255,255,255,0.7)' }}>
	                                {subRubrica.label}
	                              </span>
	                              <span style={{
	                                width: '16px',
	                                height: '16px',
	                                borderRadius: '4px',
	                                border: `2px solid ${subChecked ? '#00c1af' : 'rgba(255,255,255,0.24)'}`,
	                                backgroundColor: subChecked ? '#00c1af' : 'transparent',
	                                display: 'flex',
	                                alignItems: 'center',
	                                justifyContent: 'center',
	                                flexShrink: 0,
	                              }}>
	                                {subChecked && (
	                                  <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
	                                    <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	                                  </svg>
	                                )}
	                              </span>
	                            </button>
	                          );
	                        })}
	                      </div>
	                    )}
	                  </div>
	                );
	              })}
	            </div>
          </div>

          {rubricas.bolsa && (
            <div style={{ ...innerCardStyle, marginTop: '20px', backgroundColor: 'rgba(0,193,175,0.06)', borderColor: 'rgba(0,193,175,0.18)' }}>
              <div style={{ marginBottom: '18px' }}>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 6px' }}>
                  Modalidades e Níveis de Bolsa
                </p>
                <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
                  Configure as modalidades e níveis aceitos quando a rubrica Bolsa estiver permitida.
                </p>
              </div>

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
            </div>
          )}
        </div>

        {/* ══════ SESSÃO 6 — Documentos Exigidos ══════ */}
        <div style={sectionCard}>
          <SectionHeader num="6" title="Documentos Exigidos do Proponente" subtitle="Selecione documentos exigidos e cadastre novos parâmetros quando necessário" />

          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid rgba(0,193,175,0.24)', backgroundColor: 'rgba(0,193,175,0.08)', marginBottom: '18px' }}>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#00c1af', margin: '0 0 4px' }}>
              Observação
            </p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.68)', margin: 0, lineHeight: 1.45 }}>
              Os documentos exigidos podem variar conforme o tipo de proponente. Por exemplo, quando o proponente for uma empresa privada, a captação pode exigir documentos como balanço da empresa, contrato social, certidões ou outros comprovantes institucionais.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
            {[
              { key: 'contratoSocial', label: 'Contrato social ou estatuto', descricao: 'Documento constitutivo da instituição ou empresa proponente.', formatos: 'PDF', obrigatorio: true },
              { key: 'balancoPatrimonial', label: 'Balanço patrimonial', descricao: 'Demonstração contábil usada para comprovar capacidade econômico-financeira.', formatos: 'PDF ou XLSX', obrigatorio: false },
              { key: 'certidaoRegularidadeFiscal', label: 'Certidões de regularidade fiscal', descricao: 'Comprovação de regularidade perante órgãos fiscais e trabalhistas, quando aplicável.', formatos: 'PDF', obrigatorio: false },
              { key: 'comprovanteRepresentanteLegal', label: 'Comprovante do representante legal', descricao: 'Documento que comprova poderes de representação do responsável pela submissão.', formatos: 'PDF', obrigatorio: true },
              { key: 'declaracaoCapacidadeTecnica', label: 'Declaração de capacidade técnica', descricao: 'Declaração institucional de que o proponente possui estrutura para executar o projeto.', formatos: 'PDF', obrigatorio: false },
            ].map(item => {
              const checked = Boolean(docsSubmissao[item.key]);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleDocSubmissao(item.key)}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: 'var(--radius)',
                    border: `1px solid ${checked ? 'rgba(0,193,175,0.35)' : 'rgba(255,255,255,0.12)'}`,
                    backgroundColor: checked ? 'rgba(0,193,175,0.08)' : 'rgba(23, 23, 23,0.35)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)' }}>
                        {item.label}
                      </span>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '999px',
                        border: `1px solid ${item.obrigatorio ? 'rgba(0,193,175,0.3)' : 'rgba(255,255,255,0.14)'}`,
                        color: item.obrigatorio ? '#00c1af' : 'rgba(255,255,255,0.55)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--text-xs)',
                      }}>
                        {item.obrigatorio ? 'Obrigatório' : 'Opcional'}
                      </span>
                    </span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--form-text-muted)', lineHeight: 1.45 }}>
                      {item.descricao}
                    </span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.38)', marginTop: '8px' }}>
                      Formatos permitidos: {item.formatos}
                    </span>
                  </span>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    border: `2px solid ${checked ? '#00c1af' : 'rgba(255,255,255,0.24)'}`,
                    backgroundColor: checked ? '#00c1af' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {checked && (
                      <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowModalNovoArquivo(true)}
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
              }}
            >
              <Plus size={16} />
              Novo Documento Exigido
            </button>
          </div>
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
              color: 'var(--form-text-secondary)',
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
            {isEditMode ? 'Cancelar' : 'Salvar Rascunho'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!cronogramaCompleto) {
                toast.error(`Inclua um card para cada etapa obrigatória do cronograma: ${etapasCronogramaFaltantes.map(fase => fase.label).join(', ')}.`);
              }
            }}
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
              color: '#171717',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#00a99a'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#00c1af'; }}
          >
            <Save size={16} />
            {isEditMode ? 'Salvar Alterações' : 'Salvar Captação'}
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
                  color: 'var(--form-text-primary)',
                  margin: '0 0 6px',
                }}>
                  Criar Novo Recurso
                </h3>
                <p style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--form-text-muted)',
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
                  color: 'var(--form-text-muted)',
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
                  color: 'var(--form-text-secondary)',
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
                  color: '#171717',
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
                  color: 'var(--form-text-primary)',
                  margin: '0 0 6px',
                }}>
                  Criar Novo Arquivo
                </h3>
                <p style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--form-text-muted)',
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
                  color: 'var(--form-text-muted)',
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
                  color: 'var(--form-text-secondary)',
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
                  color: '#171717',
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
