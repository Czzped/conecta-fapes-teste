import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, User, X } from 'lucide-react';
import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';

const CONTAINER: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

const FF = 'var(--font-family)';
const CLR_FG = 'var(--foreground)';
const CLR_MUTED = 'var(--muted-foreground)';
const CLR_CYAN = '#06b6d4';
const RADIUS = 'var(--radius)';
const RADIUS_LG = 'var(--radius-lg)';

interface InscricaoOptionsPageProps {
  onBack: () => void;
  onOption1: () => void;
  onOption2Complete: () => void;
  onOption3: () => void;
}

const steps = [
  {
    title: 'Dados Pessoais',
    fields: [
      ['Nome Completo', 'Paulo Sérgio Junior'],
      ['Nome Social', ''],
      ['CPF', '123.456.789-00'],
      ['Data de Nascimento', '15/03/1995'],
      ['E-mail', 'paulo.souza@example.com'],
      ['Celular', '(27) 99999-9999'],
      ['Gênero', 'Masculino'],
      ['Etnia', 'Parda'],
      ['Lattes', 'http://lattes.cnpq.br/1234567890'],
      ['Nível Acadêmico', 'Ensino superior'],
    ],
  },
  {
    title: 'Documento de Identificação',
    fields: [
      ['Tipo de Documento', 'Identidade'],
      ['Número', '1234567'],
      ['Órgão Emissor', 'SSP'],
      ['UF do Órgão Emissor', 'ES'],
      ['Data de Emissão', '10/03/2015'],
    ],
  },
  {
    title: 'Endereço Residencial',
    fields: [
      ['CEP', '29000-000'],
      ['Rua', 'Rua das Flores'],
      ['Número', '123'],
      ['Complemento', 'Apto 101'],
      ['Bairro', 'Centro'],
      ['Municipio', 'Vitória'],
      ['Estado', 'Espírito Santo'],
      ['País', 'Brasil'],
    ],
  },
];

function Header({ onBack }: { onBack: () => void }) {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--app-header)',
        borderBottom: '1px solid var(--app-header-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ ...CONTAINER, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={fapesLogo} alt="FAPES" style={{ height: '36px', objectFit: 'contain' }} />
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: CLR_MUTED,
            cursor: 'pointer',
            fontFamily: FF,
            fontSize: 'var(--text-sm)',
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>
    </header>
  );
}

function TextOptionButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '1rem 1.25rem',
        borderRadius: RADIUS,
        border: '1px solid rgba(6,182,212,0.35)',
        backgroundColor: 'rgba(6,182,212,0.08)',
        color: CLR_CYAN,
        fontFamily: FF,
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-weight-medium)',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = 'rgba(6,182,212,0.14)';
        event.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = 'rgba(6,182,212,0.08)';
        event.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)';
      }}
    >
      {children}
    </button>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          color: CLR_MUTED,
          fontFamily: FF,
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          marginBottom: '0.35rem',
        }}
      >
        {label}
      </label>
      <div
        style={{
          width: '100%',
          minHeight: '44px',
          borderRadius: RADIUS,
          border: '1px solid var(--border)',
          backgroundColor: 'var(--input-background)',
          color: CLR_FG,
          fontFamily: FF,
          fontSize: 'var(--text-sm)',
          display: 'flex',
          alignItems: 'center',
          padding: '0.6rem 0.85rem',
        }}
      >
        {value || '-'}
      </div>
    </div>
  );
}

function DadosModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [step, setStep] = useState(0);
  if (!open) return null;

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const close = () => {
    setStep(0);
    onClose();
  };

  const save = () => {
    setStep(0);
    onSave();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.72)', padding: '1.5rem' }}
    >
      <div
        style={{
          width: 'min(920px, 100%)',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: RADIUS_LG,
          border: '1px solid var(--border)',
          backgroundColor: '#111111',
          boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: '1.25rem 1.5rem' }}
        >
          <div>
            <div style={{ color: CLR_FG, fontFamily: FF, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
              Atualizar Meus Dados
            </div>
            <div style={{ color: CLR_MUTED, fontFamily: FF, fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>
              Etapa {step + 1} de {steps.length} · {currentStep.title}
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Fechar"
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              color: CLR_MUTED,
              cursor: 'pointer',
              padding: '0.35rem',
              display: 'inline-flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                backgroundColor: CLR_CYAN,
                color: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FF,
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              {step + 1}
            </div>
            <h2 style={{ color: CLR_FG, fontFamily: FF, fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
              {currentStep.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentStep.fields.map(([label, value]) => (
              <ReadonlyField key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        <div
          className="flex items-center justify-between"
          style={{ padding: '1.25rem 1.5rem' }}
        >
          <button
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2"
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: step === 0 ? CLR_MUTED : CLR_FG,
              opacity: step === 0 ? 0.45 : 1,
              borderRadius: RADIUS,
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              fontFamily: FF,
              fontSize: 'var(--text-sm)',
              padding: '0.65rem 1rem',
            }}
          >
            <ChevronLeft size={16} />
            Voltar
          </button>

          <button
            onClick={isLastStep ? save : () => setStep((value) => value + 1)}
            className="inline-flex items-center gap-2"
            style={{
              border: 'none',
              backgroundColor: CLR_CYAN,
              color: '#020617',
              borderRadius: RADIUS,
              cursor: 'pointer',
              fontFamily: FF,
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              padding: '0.7rem 1.2rem',
            }}
          >
            {isLastStep ? 'Salvar' : 'Próximo'}
            {!isLastStep && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function InscricaoOptionsPage({
  onBack,
  onOption1,
  onOption2Complete,
  onOption3,
}: InscricaoOptionsPageProps) {
  const [showDadosModal, setShowDadosModal] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: CLR_FG, fontFamily: FF }}>
      <Header onBack={onBack} />
      <main style={{ ...CONTAINER, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: RADIUS,
              backgroundColor: 'rgba(6,182,212,0.14)',
              color: CLR_CYAN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <User size={24} />
          </div>
          <h1 style={{ color: CLR_FG, fontFamily: FF, fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.75rem' }}>
            Como deseja continuar?
          </h1>
          <p style={{ color: CLR_MUTED, fontFamily: FF, fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Escolha uma das opções abaixo para seguir com a inscrição da proposta.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <TextOptionButton onClick={onOption1}>Opção 1</TextOptionButton>
            <TextOptionButton onClick={() => setShowDadosModal(true)}>Opção 2</TextOptionButton>
            <TextOptionButton onClick={onOption3}>Opção 3</TextOptionButton>
          </div>

          <div className="flex items-center gap-2" style={{ color: CLR_MUTED, fontSize: 'var(--text-sm)', marginTop: '1.5rem' }}>
            <FileText size={16} style={{ color: CLR_CYAN }} />
            A Opção 1 mantém o fluxo atual de submissão da proposta.
          </div>
        </div>
      </main>

      <DadosModal open={showDadosModal} onClose={() => setShowDadosModal(false)} onSave={onOption2Complete} />
    </div>
  );
}
