import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  ChevronLeft, FileText, User, Users, Receipt, CalendarDays, Eye,
  Plus, CheckCircle2, Moon, Paperclip, Bell, Globe, FolderKanban,
} from 'lucide-react';
import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';
import { editais } from '../data/editais';
import { AccessibilityModal } from './AccessibilityModal';

interface InscricaoPageProps {
  editalId: number;
  onBack: () => void;
  onLogin?: () => void;
  hideDadosTab?: boolean;
  hideHeader?: boolean;
  hideTabs?: boolean;
  hideBackButton?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
  formHeading?: string;
  breadcrumb?: string[];
  showProjectTitleIcon?: boolean;
  showDocumentoEditalTab?: boolean;
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
const INPUT_BG = 'var(--input-background)';
const INPUT_BORDER = '1px solid var(--border)';
const INPUT_BORDER_FOCUS = '1px solid rgba(6,182,212,0.55)';
const INPUT_BG_FOCUS = 'rgba(6,182,212,0.07)';
const RADIUS = 'var(--radius)';
const RADIUS_LG = 'var(--radius-lg)';
const FF = 'var(--font-family)';
const CLR_FG = 'var(--foreground)';
const CLR_MUTED = 'var(--muted-foreground)';
const CLR_LABEL = 'var(--muted-foreground)';
const CLR_TEAL = '#22d3ee';
const CLR_TEAL_MID = '#22d3ee';

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
        minHeight: '42px',
        padding: '0.6rem 1rem',
        borderRadius: RADIUS,
        border: `1px solid rgba(6,182,212,${hov ? '0.45' : '0.25'})`,
        backgroundColor: `rgba(6,182,212,${hov ? '0.14' : '0.07'})`,
        color: CLR_TEAL,
        fontSize: 'var(--text-sm)',
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
type InscricaoTab = 'formulario' | 'dados';

function TabBar({
  activeTab,
  onChange,
  hideDadosTab = false,
}: {
  activeTab: InscricaoTab;
  onChange: (tab: InscricaoTab) => void;
  hideDadosTab?: boolean;
}) {
  const tabs: Array<{ id: InscricaoTab; label: string }> = [
    { id: 'formulario', label: 'Formulário do Projeto' },
    { id: 'dados', label: 'Meus Dados' },
  ].filter((tab) => !(hideDadosTab && tab.id === 'dados'));

  return (
    <div style={{ borderBottom: '1px solid rgba(6,182,212,0.14)', display: 'flex', gap: '2rem' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            border: 'none',
            borderBottom: activeTab === tab.id ? `2px solid ${CLR_TEAL}` : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === tab.id ? CLR_TEAL : CLR_MUTED,
            fontFamily: FF,
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            padding: '0 0 0.875rem',
            cursor: 'pointer',
            transition: 'all 0.18s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ReadOnlyInput({ value }: { value: string }) {
  return (
    <input
      value={value}
      readOnly
      style={{
        ...inputBase,
        color: CLR_FG,
        cursor: 'default',
      }}
    />
  );
}

function MyDataSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '9999px',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-semibold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontFamily: FF,
          }}
        >
          {number}
        </span>
        <h3
          style={{
            color: 'var(--foreground)',
            fontSize: '16px',
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: 1.2,
            margin: 0,
            fontFamily: FF,
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function MyDataLabel({ children, required = true }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block mb-2" style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontFamily: FF }}>
      {children}
      {required && <span style={{ color: 'var(--destructive-foreground)', marginLeft: '4px' }}>*</span>}
    </label>
  );
}

function MyDataField({
  label,
  value,
  required = true,
  link = false,
}: {
  label: string;
  value: string;
  required?: boolean;
  link?: boolean;
}) {
  return (
    <div>
      <MyDataLabel required={required}>{label}</MyDataLabel>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full px-4 py-2 border transition-colors"
        style={{
          backgroundColor: 'var(--input-background)',
          color: link ? 'var(--primary)' : 'var(--foreground)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius)',
          textDecoration: link ? 'underline' : 'none',
          fontSize: 'var(--text-sm)',
          fontFamily: FF,
          cursor: 'default',
        }}
      />
    </div>
  );
}

function DadosPessoaisTab() {
  return (
    <div className="space-y-6">
      <MyDataSection number={1} title="Dados Pessoais">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MyDataField label="Nome Completo" value="Paulo Sérgio Junior" />
            <MyDataField label="Nome Social" value="" required={false} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MyDataField label="CPF" value="123.456.789-00" />
            <MyDataField label="Data de Nascimento" value="15/03/1995" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MyDataField label="E-mail" value="paulo.souza@example.com" />
            <MyDataField label="Celular" value="(27) 99999-9999" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MyDataField label="Gênero" value="Masculino" />
            <MyDataField label="Etnia" value="Parda" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MyDataField label="Lattes" value="http://lattes.cnpq.br/1234567890" link />
            <MyDataField label="Nível Acadêmico" value="Ensino superior" />
          </div>
        </div>
      </MyDataSection>

      <MyDataSection number={2} title="Documento de Identificação">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MyDataField label="Tipo de Documento" value="Identidade" />
            <MyDataField label="Número" value="1234567" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MyDataField label="Órgão Emissor" value="SSP" />
            <MyDataField label="UF do Órgão Emissor" value="ES" />
            <MyDataField label="Data de Emissão" value="10/03/2015" />
          </div>
        </div>
      </MyDataSection>

      <MyDataSection number={3} title="Endereço Residencial">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MyDataField label="CEP" value="29000-000" />
              <MyDataField label="Rua" value="Rua das Flores" />
              <MyDataField label="Número" value="123" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MyDataField label="Complemento" value="Apto 101" required={false} />
              <MyDataField label="Bairro" value="Centro" />
              <MyDataField label="Municipio" value="Vitória" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MyDataField label="Estado" value="Espírito Santo" />
              <MyDataField label="País" value="Brasil" />
            </div>
          </div>
        </div>
      </MyDataSection>
    </div>
  );
}

function PrimaryActionButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.6rem 1.75rem',
        borderRadius: RADIUS,
        border: 'none',
        backgroundColor: disabled ? 'rgba(6,182,212,0.4)' : CLR_TEAL_MID,
        color: '#0a0a0a',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FF,
        transition: 'all 0.18s',
        opacity: disabled ? 0.7 : 1,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = '#22d3ee'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = CLR_TEAL_MID; }}
    >
      {children}
    </button>
  );
}

function SecondaryActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
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
      {children}
    </button>
  );
}

function LoggedHeaderActions({ onAccessibility }: { onAccessibility: () => void }) {
  const iconButton: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: RADIUS,
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--foreground)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onAccessibility}
        aria-label="Alternar tema"
        style={iconButton}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <Moon size={20} />
      </button>
      <button
        aria-label="Notificações"
        style={iconButton}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <Bell size={20} />
        <span
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '9px',
            height: '9px',
            borderRadius: '9999px',
            backgroundColor: '#ff5d73',
          }}
        />
      </button>
      <button
        aria-label="Idioma"
        style={iconButton}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <Globe size={21} />
      </button>
      <button
        aria-label="Usuário logado"
        style={{
          ...iconButton,
          backgroundColor: 'var(--muted)',
          marginLeft: '0.25rem',
        }}
      >
        <User size={21} />
      </button>
    </div>
  );
}

export function InscricaoPage({
  editalId,
  onBack,
  onLogin,
  hideDadosTab = false,
  hideHeader = false,
  hideTabs = false,
  hideBackButton = false,
  pageTitle,
  pageSubtitle,
  pageDescription,
  formHeading,
  breadcrumb,
  showProjectTitleIcon = false,
  showDocumentoEditalTab = false,
}: InscricaoPageProps) {
  const edital = editais.find(e => e.id === editalId) ?? editais[0];
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [activeTab, setActiveTab] = useState<InscricaoTab>('formulario');
  const [customActiveTab, setCustomActiveTab] = useState<'formulario' | 'edital'>('formulario');
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

  const [instituicao, setInstituicao] = useState('');

  // Equipe
  const [membros, setMembros] = useState<Membro[]>([{ nome: '', cpf: '', funcao: '', bolsa: '', tipo: 'completo' }]);

  // Despesas
  const [despesas, setDespesas] = useState<Despesa[]>([{ nome: '', categoria: '', quantidade: '', custo: '', justificativa: '' }]);

  // Cronograma
  const [atividades, setAtividades] = useState<Atividade[]>([{ descricao: '', inicio: '', conclusao: '' }]);
  const [documentoProjeto, setDocumentoProjeto] = useState('');
  const documentoInputRef = useRef<HTMLInputElement>(null);

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
            <LoggedHeaderActions onAccessibility={() => setShowAccessibility(true)} />
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
      {!hideHeader && (
        <header
          className="sticky top-0 z-50"
          style={{ backgroundColor: 'var(--app-header)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--app-header-border)' }}
        >
          <div style={{ ...CONTAINER, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src={fapesLogo} alt="FAPES" style={{ height: '36px', objectFit: 'contain' }} />
            <LoggedHeaderActions onAccessibility={() => setShowAccessibility(true)} />
          </div>
        </header>
      )}
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} />

      {/* ── PAGE TITLE BAR ── */}
      <div>
        <div style={pageTitle ? { width: '100%', padding: '2rem 2rem 0' } : { ...CONTAINER, padding: '1rem 1.5rem' }}>
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="flex items-center gap-2" style={{ color: CLR_MUTED, fontSize: 'var(--text-sm)', fontFamily: FF, marginBottom: '1.5rem' }}>
              {breadcrumb.map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                  <span style={{ color: index === breadcrumb.length - 1 ? CLR_FG : CLR_MUTED }}>
                    {item}
                  </span>
                  {index < breadcrumb.length - 1 && <span style={{ color: CLR_MUTED }}>›</span>}
                </span>
              ))}
            </div>
          )}
          {!hideBackButton && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: CLR_MUTED, fontSize: 'var(--text-sm)', fontFamily: FF, padding: 0, marginBottom: '0.625rem', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = CLR_TEAL; }}
              onMouseLeave={e => { e.currentTarget.style.color = CLR_MUTED; }}
            >
              <ChevronLeft size={16} /> Voltar para Oportunidades
            </button>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                {showProjectTitleIcon && (
                  <span
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: RADIUS,
                      backgroundColor: 'rgba(34, 211, 238, 0.12)',
                      color: CLR_TEAL,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FolderKanban size={20} />
                  </span>
                )}
                <h1 style={{ color: CLR_FG, fontFamily: FF, margin: 0 }}>
                  {pageTitle ?? edital.titulo}
                </h1>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: CLR_MUTED, fontFamily: FF, marginTop: pageTitle ? '0.5rem' : '2px', marginLeft: showProjectTitleIcon ? 'calc(36px + 0.75rem)' : 0 }}>
                {pageSubtitle ?? `Submissão da Proposta · ${edital.numero}`}
              </div>
            </div>
          </div>
          {pageDescription !== '' && (
            <div style={{ fontSize: 'var(--text-sm)', color: CLR_MUTED, fontFamily: FF, marginTop: '0.5rem' }}>
              {pageDescription ?? 'Preencha os dados a baixo para enviar sua proposta'}
            </div>
          )}
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <div style={pageTitle ? { width: '100%', padding: '2rem 2rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' } : { ...CONTAINER, paddingTop: '2rem', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {formHeading && !showDocumentoEditalTab && (
          <h2 style={{ color: CLR_FG, fontFamily: FF, fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
            {formHeading}
          </h2>
        )}
        {showDocumentoEditalTab && (
          <div
            className="hidden md:flex gap-6"
            style={{
              borderBottom: '1px solid var(--border)',
            }}
          >
            {[
              { id: 'formulario' as const, label: 'Formulário de Submissão' },
              { id: 'edital' as const, label: 'Documento do Edital' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCustomActiveTab(tab.id)}
                className="pb-3 transition-all"
                style={{
                  color: customActiveTab === tab.id ? 'var(--tab-selected-foreground)' : 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: 'var(--text-sm)',
                  marginBottom: '-1px',
                  background: 'none',
                  border: 'none',
                  borderBottom: customActiveTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        {!hideTabs && <TabBar activeTab={activeTab} onChange={setActiveTab} hideDadosTab={hideDadosTab} />}

        {showDocumentoEditalTab && customActiveTab === 'edital' ? (
          <section
            style={{
              backgroundColor: CARD_BG,
              border: CARD_BORDER,
              borderRadius: RADIUS_LG,
              padding: '1.5rem',
            }}
          >
            <h2 style={{ color: CLR_FG, fontFamily: FF, fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', margin: '0 0 1rem' }}>
              Documento do Edital
            </h2>
            <p style={{ color: CLR_MUTED, fontFamily: FF, fontSize: 'var(--text-sm)', lineHeight: 1.7, margin: 0 }}>
              Edital de demanda induzida para participação em projeto estratégico da FAPES. O documento reúne objetivo, critérios de participação,
              etapas de submissão, prazos e requisitos para envio da proposta.
            </p>
          </section>
        ) : (hideTabs || activeTab === 'formulario') ? (
          <>
            <MyDataSection number={1} title="Informações Gerais">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Título do Projeto">
                    <FocusInput placeholder="Digite o título do projeto" value={titulo} onChange={setTitulo} />
                  </Field>
                  <Field label="Coordenador">
                    <FocusInput placeholder="Nome do coordenador" value={coordenador} onChange={setCoordenador} />
                  </Field>
                </div>
                <Field label="Instituição">
                  <FocusSelect value={instituicao} onChange={setInstituicao} placeholder="Selecione...">
                    <option value="UFES">Universidade Federal do Espírito Santo (UFES)</option>
                    <option value="IFES">Instituto Federal do Espírito Santo (IFES)</option>
                    <option value="UVV">Universidade Vila Velha (UVV)</option>
                    <option value="MULTIVIX">Faculdade Multivix</option>
                    <option value="EMESCAM">EMESCAM</option>
                    <option value="outro">Outra</option>
                  </FocusSelect>
                </Field>
                <Field label="Resumo">
                  <FocusTextarea placeholder="Descreva brevemente o projeto" value={resumo} onChange={setResumo} rows={4} />
                </Field>
                <div className="grid grid-cols-1 gap-4">
                  <Field label="Objetivo Geral">
                    <FocusTextarea placeholder="Descreva o objetivo geral" value={objGeral} onChange={setObjGeral} rows={4} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Field label="Objetivo Específico">
                    <FocusTextarea placeholder="Descreva os objetivos específicos" value={objEspecifico} onChange={setObjEspecifico} rows={4} />
                  </Field>
                </div>
                <Field label="Resultados">
                  <FocusTextarea placeholder="Quais resultados são esperados?" value={resultados} onChange={setResultados} rows={4} />
                </Field>
              </div>
            </MyDataSection>

        {/* ── EQUIPE ── */}
        <MyDataSection number={2} title="Equipe">
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <AddButton label="Adicionar Membro" onClick={() => setMembros(prev => [...prev, { nome: '', cpf: '', funcao: '', bolsa: '', tipo: 'completo' }])} />
            </div>
          </div>
        </MyDataSection>

        {/* ── DESPESAS ── */}
        <MyDataSection number={3} title="Despesas">
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
        </MyDataSection>

        {/* ── CRONOGRAMA ── */}
        <MyDataSection number={4} title="Cronograma">
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
        </MyDataSection>

        <MyDataSection number={5} title="Documento">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: '1rem',
                alignItems: 'end',
              }}
            >
              <Field label="Documento">
                <ReadOnlyInput value="Projeto em PDF" />
              </Field>
              <button
                type="button"
                onClick={() => documentoInputRef.current?.click()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  minHeight: '42px',
                  padding: '0.6rem 1rem',
                  borderRadius: RADIUS,
                  border: '1px solid rgba(6,182,212,0.35)',
                  backgroundColor: 'rgba(6,182,212,0.12)',
                  color: CLR_TEAL,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  fontFamily: FF,
                  whiteSpace: 'nowrap',
                }}
              >
                <Paperclip size={16} />
                Anexar Arquivo
              </button>
              <input
                ref={documentoInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setDocumentoProjeto(file.name);
                }}
              />
            </div>

            {documentoProjeto && (
              <div
                className="p-4 flex items-center gap-4"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <FileText size={20} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-sm)', fontFamily: FF, color: 'var(--foreground)' }}>
                  {documentoProjeto}
                </span>
              </div>
            )}
          </div>
        </MyDataSection>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              <SecondaryActionButton onClick={onBack}>
                Salvar Rascunho
              </SecondaryActionButton>
              <PrimaryActionButton onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Proposta'}
              </PrimaryActionButton>
              {submitError && (
                <p style={{ color: '#ef4444', fontSize: 'var(--text-xs)', fontFamily: FF, marginTop: '0.5rem', textAlign: 'right' }}>
                  {submitError}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <DadosPessoaisTab />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <PrimaryActionButton onClick={() => toast.success('Alterações salvas com sucesso.')}>
                Salvar Alterações
              </PrimaryActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
