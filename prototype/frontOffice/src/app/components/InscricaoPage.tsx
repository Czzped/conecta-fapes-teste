import { useState } from 'react';
import { toast } from 'sonner';
import {
  ChevronLeft, FileText, User, Users, Receipt, CalendarDays, Eye,
  Plus, CheckCircle2, Moon,
} from 'lucide-react';
import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';
import { editais } from '../data/editais';
import { AccessibilityModal } from './AccessibilityModal';

interface InscricaoPageProps {
  editalId: number;
  onBack: () => void;
  onLogin?: () => void;
}

// ── same max-width as EditalDetailPage ──
const CONTAINER: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

// ── shared style helpers ──
const PAGE_BG = 'var(--background)';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = '1px solid rgba(6,182,212,0.14)';
const SECTION_HEAD_BG = 'rgba(6,182,212,0.06)';
const SECTION_HEAD_BORDER = '1px solid rgba(6,182,212,0.14)';
const INPUT_BG = 'rgba(0,0,0,0.25)';
const INPUT_BORDER = '1px solid rgba(6,182,212,0.2)';
const INPUT_BORDER_FOCUS = '1px solid rgba(6,182,212,0.55)';
const INPUT_BG_FOCUS = 'rgba(6,182,212,0.07)';
const RADIUS = 'var(--radius)';
const RADIUS_LG = 'var(--radius-lg)';
const FF = 'var(--font-family)';
const CLR_FG = 'var(--foreground)';
const CLR_MUTED = 'var(--muted-foreground)';
const CLR_LABEL = 'var(--muted-foreground)';
const CLR_TEAL = '#0891b2';
const CLR_TEAL_MID = '#06b6d4';

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.85rem',
  borderRadius: RADIUS,
  border: INPUT_BORDER,
  backgroundColor: INPUT_BG,
  color: CLR_FG,
  fontSize: 'var(--text-sm)',
  fontFamily: FF,
  outline: 'none',
  transition: 'border 0.18s, background 0.18s',
  boxSizing: 'border-box',
};

const textareaBase: React.CSSProperties = {
  ...inputBase,
  resize: 'vertical',
  lineHeight: 1.65,
  minHeight: '90px',
};

const labelBase: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: CLR_LABEL,
  marginBottom: '0.35rem',
  fontFamily: FF,
};

function Field({
  label, children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelBase}>{label}</label>
      {children}
    </div>
  );
}

function FocusInput({
  placeholder, value, onChange, type = 'text',
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        border: focused ? INPUT_BORDER_FOCUS : INPUT_BORDER,
        backgroundColor: focused ? INPUT_BG_FOCUS : INPUT_BG,
      }}
    />
  );
}

function FocusTextarea({
  placeholder, value, onChange, rows = 4,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...textareaBase,
        border: focused ? INPUT_BORDER_FOCUS : INPUT_BORDER,
        backgroundColor: focused ? INPUT_BG_FOCUS : INPUT_BG,
      }}
    />
  );
}

function FocusSelect({
  value, onChange, children, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        border: focused ? INPUT_BORDER_FOCUS : INPUT_BORDER,
        backgroundColor: focused ? INPUT_BG_FOCUS : INPUT_BG,
        cursor: 'pointer',
        WebkitAppearance: 'none',
        appearance: 'none',
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

// ── Section card ──
function SectionCard({
  icon, title, subtitle, children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: CARD_BG,
        border: CARD_BORDER,
        borderRadius: RADIUS_LG,
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          backgroundColor: SECTION_HEAD_BG,
          borderBottom: SECTION_HEAD_BORDER,
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'rgba(6,182,212,0.18)',
            border: '1px solid rgba(6,182,212,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '1px',
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: CLR_FG, fontFamily: FF }}>
            {title}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: CLR_MUTED, fontFamily: FF, marginTop: '1px' }}>
            {subtitle}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
}

// ── Review row ──
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--text-sm)', color: CLR_MUTED, fontFamily: FF, marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: 'var(--text-sm)', color: value && value !== '' ? CLR_FG : CLR_MUTED, fontFamily: FF }}>{value || '—'}</div>
    </div>
  );
}

function ReviewGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: CLR_TEAL, fontFamily: FF, letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ── Divider ──
function Divider() {
  return <div style={{ height: '1px', backgroundColor: 'rgba(6,182,212,0.1)', margin: '1.25rem 0' }} />;
}

// ── Add button ──
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.45rem 1rem',
        borderRadius: RADIUS,
        border: `1px solid rgba(6,182,212,${hov ? '0.45' : '0.25'})`,
        backgroundColor: `rgba(6,182,212,${hov ? '0.14' : '0.07'})`,
        color: CLR_TEAL,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        fontFamily: FF,
        transition: 'all 0.18s',
      }}
    >
      <Plus size={13} />
      {label}
    </button>
  );
}

// ── Main component ──
interface Membro { nome: string; cpf: string; funcao: string; bolsa: string; tipo: 'completo' | 'bolsa'; }
interface Despesa { nome: string; categoria: string; quantidade: string; custo: string; justificativa: string; }
interface Atividade { descricao: string; inicio: string; conclusao: string; }

export function InscricaoPage({ editalId, onBack, onLogin }: InscricaoPageProps) {
  const edital = editais.find(e => e.id === editalId) ?? editais[0];
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dados Gerais
  const [titulo, setTitulo] = useState('');
  const [coordenador, setCoordenador] = useState('');
  const [resumo, setResumo] = useState('');
  const [objGeral, setObjGeral] = useState('');
  const [objEspecifico, setObjEspecifico] = useState('');
  const [resultados, setResultados] = useState('');

  // Proponente
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [instituicao, setInstituicao] = useState('');

  // Equipe
  const [membros, setMembros] = useState<Membro[]>([{ nome: '', cpf: '', funcao: '', bolsa: '', tipo: 'completo' }]);

  // Despesas
  const [despesas, setDespesas] = useState<Despesa[]>([{ nome: '', categoria: '', quantidade: '', custo: '', justificativa: '' }]);

  // Cronograma
  const [atividades, setAtividades] = useState<Atividade[]>([{ descricao: '', inicio: '', conclusao: '' }]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
    } catch {
      const msg = 'Falha ao enviar a proposta. Verifique sua conexão e tente novamente.';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAGE_BG, color: CLR_FG, fontFamily: FF }}>
        <header className="sticky top-0 z-50" style={{ backgroundColor: 'var(--app-header)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--app-header-border)' }}>
          <div style={{ ...CONTAINER, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src={fapesLogo} alt="FAPES" style={{ height: '36px', objectFit: 'contain' }} />
            <div className="flex items-center gap-3">
              <button onClick={onLogin} style={{ padding: '0.45rem 1.1rem', borderRadius: '9999px', border: '1px solid #0891b2', backgroundColor: 'transparent', color: '#0891b2', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: FF }}>
                Entrar com Acesso Cidadão
              </button>
              <button
                onClick={() => setShowAccessibility(true)}
                aria-label="Acessibilidade"
                style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: 'none', backgroundColor: 'transparent', color: 'var(--foreground)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Moon size={18} />
              </button>
            </div>
          </div>
        </header>
        <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} />
        <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(6,182,212,0.15)', border: '2px solid rgba(6,182,212,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={36} style={{ color: CLR_TEAL }} />
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', color: CLR_FG, fontFamily: FF, marginBottom: '0.75rem' }}>Proposta enviada com sucesso!</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: CLR_MUTED, fontFamily: FF, maxWidth: '480px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Sua inscrição para <strong style={{ color: CLR_TEAL }}>{edital.titulo}</strong> foi recebida pela FAPES. Um e-mail de confirmação será enviado em breve.
          </p>
          <button onClick={onBack} style={{ padding: '0.75rem 2rem', borderRadius: RADIUS, border: '1px solid rgba(6,182,212,0.35)', backgroundColor: 'rgba(6,182,212,0.12)', color: CLR_TEAL, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: FF }}>
            Voltar para Oportunidades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: PAGE_BG, color: CLR_FG, fontFamily: FF, minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50"
        style={{ backgroundColor: 'var(--app-header)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--app-header-border)' }}
      >
        <div style={{ ...CONTAINER, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={fapesLogo} alt="FAPES" style={{ height: '36px', objectFit: 'contain' }} />
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              style={{ padding: '0.45rem 1.1rem', borderRadius: '9999px', border: '1px solid #0891b2', backgroundColor: 'transparent', color: '#0891b2', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', fontFamily: FF }}
            >
              Entrar com Acesso Cidadão
            </button>
            <button
              onClick={() => setShowAccessibility(true)}
              aria-label="Acessibilidade"
              style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: 'none', backgroundColor: 'transparent', color: 'var(--foreground)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Moon size={18} />
            </button>
          </div>
        </div>
      </header>
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} />

      {/* ── PAGE TITLE BAR ── */}
      <div>
        <div style={{ ...CONTAINER, padding: '1rem 1.5rem' }}>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: CLR_MUTED, fontSize: 'var(--text-sm)', fontFamily: FF, padding: 0, marginBottom: '0.625rem', transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = CLR_TEAL; }}
            onMouseLeave={e => { e.currentTarget.style.color = CLR_MUTED; }}
          >
            <ChevronLeft size={16} /> Voltar para o Edital
          </button>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: CLR_FG, fontFamily: FF }}>
            Submissão de Proposta
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: CLR_MUTED, fontFamily: FF, marginTop: '2px' }}>
            Preencha todos os campos para submeter sua proposta · {edital.titulo} · {edital.numero}
          </div>
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <div style={{ ...CONTAINER, paddingTop: '2rem', paddingBottom: '7rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── DADOS GERAIS ── */}
        <SectionCard
          icon={<FileText size={16} style={{ color: CLR_TEAL }} />}
          title="Dados Gerais"
          subtitle="Preencha os dados básicos do projeto."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Row: Título + Coordenador */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Título do Projeto">
                <FocusInput placeholder="Digite o título do projeto" value={titulo} onChange={setTitulo} />
              </Field>
              <Field label="Coordenador">
                <FocusInput placeholder="Nome do coordenador" value={coordenador} onChange={setCoordenador} />
              </Field>
            </div>
            <Field label="Resumo">
              <FocusTextarea placeholder="Descreva brevemente o projeto" value={resumo} onChange={setResumo} rows={4} />
            </Field>
            {/* Row: Objetivo Geral + Objetivo Específico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Objetivo Geral">
                <FocusTextarea placeholder="Descreva o objetivo geral" value={objGeral} onChange={setObjGeral} rows={4} />
              </Field>
              <Field label="Objetivo Específico">
                <FocusTextarea placeholder="Descreva os objetivos específicos" value={objEspecifico} onChange={setObjEspecifico} rows={4} />
              </Field>
            </div>
            <Field label="Resultados">
              <FocusTextarea placeholder="Quais resultados são esperados?" value={resultados} onChange={setResultados} rows={4} />
            </Field>
          </div>
        </SectionCard>

        {/* ── PROPONENTE ── */}
        <SectionCard
          icon={<User size={16} style={{ color: CLR_TEAL }} />}
          title="Proponente"
          subtitle="Informe os dados do responsável pelo projeto."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nome Completo">
                <FocusInput placeholder="Nome completo" value={nomeCompleto} onChange={setNomeCompleto} />
              </Field>
              <Field label="CPF">
                <FocusInput placeholder="000.000.000-00" value={cpf} onChange={setCpf} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Telefone">
                <FocusInput placeholder="(27) 00000-0000" value={telefone} onChange={setTelefone} />
              </Field>
              <Field label="E-mail">
                <FocusInput placeholder="email@exemplo.com.br" value={email} onChange={setEmail} type="email" />
              </Field>
            </div>
            <Field label="Endereço">
              <FocusInput placeholder="Rua, número, bairro, cidade – UF" value={endereco} onChange={setEndereco} />
            </Field>
            <Field label="Sua Instituição">
              <FocusSelect value={instituicao} onChange={setInstituicao} placeholder="Selecione...">
                <option value="UFES">Universidade Federal do Espírito Santo (UFES)</option>
                <option value="IFES">Instituto Federal do Espírito Santo (IFES)</option>
                <option value="UVV">Universidade Vila Velha (UVV)</option>
                <option value="MULTIVIX">Faculdade Multivix</option>
                <option value="EMESCAM">EMESCAM</option>
                <option value="outro">Outra</option>
              </FocusSelect>
            </Field>
          </div>
        </SectionCard>

        {/* ── EQUIPE ── */}
        <SectionCard
          icon={<Users size={16} style={{ color: CLR_TEAL }} />}
          title="Equipe"
          subtitle="Adicione os membros da equipe que participarão e liste as bolsas."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {membros.map((m, i) => (
              <div key={i}>
                {i > 0 && <Divider />}
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: CLR_MUTED, fontFamily: FF, marginBottom: '0.75rem' }}>
                  {m.tipo === 'bolsa' ? `Bolsa ${i + 1}` : `Membro ${i + 1}`}
                </div>
                {m.tipo === 'completo' ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Field label="Nome Completo">
                      <FocusInput placeholder="Nome completo" value={m.nome} onChange={v => setMembros(prev => prev.map((x, j) => j === i ? { ...x, nome: v } : x))} />
                    </Field>
                    <Field label="CPF">
                      <FocusInput placeholder="000.000.000-00" value={m.cpf} onChange={v => setMembros(prev => prev.map((x, j) => j === i ? { ...x, cpf: v } : x))} />
                    </Field>
                    <Field label="Função">
                      <FocusInput placeholder="Ex: Pesquisador" value={m.funcao} onChange={v => setMembros(prev => prev.map((x, j) => j === i ? { ...x, funcao: v } : x))} />
                    </Field>
                    <Field label="Bolsa">
                      <FocusInput placeholder="Ex: IC, PQ..." value={m.bolsa} onChange={v => setMembros(prev => prev.map((x, j) => j === i ? { ...x, bolsa: v } : x))} />
                    </Field>
                  </div>
                ) : (
                  <div style={{ maxWidth: '240px' }}>
                    <Field label="Bolsa">
                      <FocusInput placeholder="Ex: IC, PQ..." value={m.bolsa} onChange={v => setMembros(prev => prev.map((x, j) => j === i ? { ...x, bolsa: v } : x))} />
                    </Field>
                  </div>
                )}
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <AddButton label="Adicionar Apenas Bolsa" onClick={() => setMembros(prev => [...prev, { nome: '', cpf: '', funcao: '', bolsa: '', tipo: 'bolsa' }])} />
              <AddButton label="Adicionar Membro" onClick={() => setMembros(prev => [...prev, { nome: '', cpf: '', funcao: '', bolsa: '', tipo: 'completo' }])} />
            </div>
          </div>
        </SectionCard>

        {/* ── DESPESAS ── */}
        <SectionCard
          icon={<Receipt size={16} style={{ color: CLR_TEAL }} />}
          title="Despesas"
          subtitle="Lista os itens de capital e de custeio. Se o projeto for aprovado, será possível apenas usar o recurso com esses itens."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {despesas.map((d, i) => (
              <div key={i}>
                {i > 0 && <Divider />}
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: CLR_MUTED, fontFamily: FF, marginBottom: '0.75rem' }}>
                  Item {i + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3" style={{ marginBottom: '0.75rem' }}>
                  <Field label="Nome">
                    <FocusInput placeholder="Nome do item" value={d.nome} onChange={v => setDespesas(prev => prev.map((x, j) => j === i ? { ...x, nome: v } : x))} />
                  </Field>
                  <Field label="Categoria">
                    <FocusSelect value={d.categoria} onChange={v => setDespesas(prev => prev.map((x, j) => j === i ? { ...x, categoria: v } : x))} placeholder="Selecione...">
                      <option value="capital">Capital</option>
                      <option value="custeio">Custeio</option>
                      <option value="bolsa">Bolsa</option>
                      <option value="servico">Serviço de Terceiros</option>
                      <option value="passagem">Passagens e Diárias</option>
                    </FocusSelect>
                  </Field>
                  <Field label="Quantidade">
                    <FocusInput placeholder="Ex: 3" value={d.quantidade} onChange={v => setDespesas(prev => prev.map((x, j) => j === i ? { ...x, quantidade: v } : x))} />
                  </Field>
                  <Field label="Custo Total (R$)">
                    <FocusInput placeholder="0,00" value={d.custo} onChange={v => setDespesas(prev => prev.map((x, j) => j === i ? { ...x, custo: v } : x))} />
                  </Field>
                </div>
                <Field label="Justificativa">
                  <FocusTextarea placeholder="Por que este item é necessário para o projeto?" value={d.justificativa} onChange={v => setDespesas(prev => prev.map((x, j) => j === i ? { ...x, justificativa: v } : x))} rows={3} />
                </Field>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AddButton label="Adicionar Item" onClick={() => setDespesas(prev => [...prev, { nome: '', categoria: '', quantidade: '', custo: '', justificativa: '' }])} />
            </div>
          </div>
        </SectionCard>

        {/* ── CRONOGRAMA ── */}
        <SectionCard
          icon={<CalendarDays size={16} style={{ color: CLR_TEAL }} />}
          title="Cronograma"
          subtitle="Defina o período de execução e entrega concreta para cada objetivo específico. Dê preferência a entregas mensais."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {atividades.map((a, i) => (
              <div key={i}>
                {i > 0 && <Divider />}
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: CLR_MUTED, fontFamily: FF, marginBottom: '0.75rem' }}>
                  Atividade {i + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Descrição da Atividade">
                    <FocusInput placeholder="Descreva a atividade" value={a.descricao} onChange={v => setAtividades(prev => prev.map((x, j) => j === i ? { ...x, descricao: v } : x))} />
                  </Field>
                  <Field label="Data de Início">
                    <FocusInput placeholder="dd/mm/aaaa" value={a.inicio} onChange={v => setAtividades(prev => prev.map((x, j) => j === i ? { ...x, inicio: v } : x))} />
                  </Field>
                  <Field label="Data de Conclusão">
                    <FocusInput placeholder="dd/mm/aaaa" value={a.conclusao} onChange={v => setAtividades(prev => prev.map((x, j) => j === i ? { ...x, conclusao: v } : x))} />
                  </Field>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AddButton label="Adicionar Atividade" onClick={() => setAtividades(prev => [...prev, { descricao: '', inicio: '', conclusao: '' }])} />
            </div>
          </div>
        </SectionCard>

        {/* ── RESUMO ── */}
        <SectionCard
          icon={<Eye size={16} style={{ color: CLR_TEAL }} />}
          title="Resumo"
          subtitle="Revise todas as informações inseridas antes de submeter sua proposta."
        >
          {/* Dados Gerais */}
          <ReviewGroup title="Dados Gerais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3" style={{ marginBottom: '0.5rem' }}>
              <ReviewRow label="Título do Projeto" value={titulo} />
              <ReviewRow label="Coordenador" value={coordenador} />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <ReviewRow label="Resumo" value={resumo} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3" style={{ marginBottom: '0.5rem' }}>
              <ReviewRow label="Objetivo Geral" value={objGeral} />
              <ReviewRow label="Objetivo Específico" value={objEspecifico} />
            </div>
            <ReviewRow label="Resultados" value={resultados} />
          </ReviewGroup>

          <Divider />

          {/* Proponente */}
          <ReviewGroup title="Proponente">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <ReviewRow label="Nome Completo" value={nomeCompleto} />
              <ReviewRow label="CPF" value={cpf} />
              <ReviewRow label="Telefone" value={telefone} />
              <ReviewRow label="E-mail" value={email} />
              <ReviewRow label="Endereço" value={endereco} />
              <ReviewRow label="Instituição" value={instituicao} />
            </div>
          </ReviewGroup>

          <Divider />

          {/* Equipe */}
          <ReviewGroup title="Equipe">
            {membros.map((m, i) => (
              <div key={i} style={{ marginBottom: i < membros.length - 1 ? '0.75rem' : 0 }}>
                <div style={{ fontSize: 'var(--text-xs)', color: CLR_MUTED, fontFamily: FF, marginBottom: '0.4rem' }}>Membro {i + 1}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                  <ReviewRow label="Nome Completo" value={m.nome} />
                  <ReviewRow label="CPF" value={m.cpf} />
                  <ReviewRow label="Função" value={m.funcao} />
                  <ReviewRow label="Bolsa" value={m.bolsa} />
                </div>
              </div>
            ))}
          </ReviewGroup>

          <Divider />

          {/* Despesas */}
          <ReviewGroup title="Despesas">
            {despesas.map((d, i) => (
              <div key={i} style={{ marginBottom: i < despesas.length - 1 ? '0.75rem' : 0 }}>
                <div style={{ fontSize: 'var(--text-xs)', color: CLR_MUTED, fontFamily: FF, marginBottom: '0.4rem' }}>Item {i + 1}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2" style={{ marginBottom: '0.4rem' }}>
                  <ReviewRow label="Nome" value={d.nome} />
                  <ReviewRow label="Categoria" value={d.categoria} />
                  <ReviewRow label="Quantidade" value={d.quantidade} />
                  <ReviewRow label="Custo Total (R$)" value={d.custo} />
                </div>
                <ReviewRow label="Justificativa" value={d.justificativa} />
              </div>
            ))}
          </ReviewGroup>

          <Divider />

          {/* Cronograma */}
          <ReviewGroup title="Cronograma">
            {atividades.map((a, i) => (
              <div key={i} style={{ marginBottom: i < atividades.length - 1 ? '0.75rem' : 0 }}>
                <div style={{ fontSize: 'var(--text-xs)', color: CLR_MUTED, fontFamily: FF, marginBottom: '0.4rem' }}>Atividade {i + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                  <ReviewRow label="Descrição" value={a.descricao} />
                  <ReviewRow label="Data de Início" value={a.inicio} />
                  <ReviewRow label="Data de Conclusão" value={a.conclusao} />
                </div>
              </div>
            ))}
          </ReviewGroup>
        </SectionCard>
      </div>

      {/* ── STICKY BOTTOM BAR ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: 'var(--app-header)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(6,182,212,0.2)',
          padding: '0.875rem 0',
        }}
      >
        <div
          style={{
            ...CONTAINER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          <button
            onClick={onBack}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: RADIUS,
              border: '1px solid rgba(6,182,212,0.25)',
              backgroundColor: 'transparent',
              color: CLR_MUTED,
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              fontFamily: FF,
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = CLR_FG; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = CLR_MUTED; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)'; }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: '0.6rem 1.75rem',
              borderRadius: RADIUS,
              border: 'none',
              backgroundColor: isSubmitting ? 'rgba(6,182,212,0.4)' : CLR_TEAL_MID,
              color: '#0a0a0a',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: FF,
              transition: 'all 0.18s',
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#0891b2'; }}
            onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = CLR_TEAL_MID; }}
          >
            {isSubmitting ? 'Enviando...' : 'Submeter Proposta'}
          </button>
          {submitError && (
            <p style={{ color: '#ef4444', fontSize: 'var(--text-xs)', fontFamily: FF, marginTop: '0.5rem', textAlign: 'right' }}>
              {submitError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
