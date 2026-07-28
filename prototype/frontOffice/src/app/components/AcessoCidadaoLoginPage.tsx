import { LockKeyhole } from 'lucide-react';

interface AcessoCidadaoLoginPageProps {
  onLogin: () => void;
}

export function AcessoCidadaoLoginPage({ onLogin }: AcessoCidadaoLoginPageProps) {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f7f7f7', color: '#5f6368', fontFamily: 'var(--font-family)' }}>
      <header
        style={{
          height: '84px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#38bdf8', fontWeight: 500 }}>ACESSO</span>
          <span style={{ color: '#38bdf8', border: '2px solid #38bdf8', borderRadius: '4px', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', lineHeight: 1 }}>›</span>
          <span style={{ color: '#f472b6', fontWeight: 600 }}>CIDADÃO</span>
          <span style={{ color: '#a3a3a3', marginLeft: '0.35rem' }}>|</span>
          <span style={{ color: '#38bdf8', fontWeight: 300 }}>10</span>
          <span style={{ color: '#a3a3a3', fontSize: '0.45rem', writingMode: 'vertical-rl', textTransform: 'uppercase', letterSpacing: '0.08em' }}>anos</span>
        </div>
      </header>

      <section
        style={{
          minHeight: 'calc(100vh - 84px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.5rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '980px',
            minHeight: '300px',
            display: 'grid',
            gridTemplateColumns: '0.8fr 1.2fr',
            alignItems: 'center',
            gap: '3.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid #d6d6d6',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
            padding: '3rem 3.25rem',
          }}
        >
          <div aria-label="gov.br" style={{ fontSize: '5.25rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.08em' }}>
            <span style={{ color: '#2f64b3' }}>go</span>
            <span style={{ color: '#43ad47' }}>v</span>
            <span style={{ color: '#2f64b3' }}>.</span>
            <span style={{ color: '#2f64b3' }}>br</span>
          </div>

          <div>
            <p style={{ fontSize: '1.35rem', lineHeight: 1.35, margin: '0 0 1.7rem' }}>
              Agora o Acesso Cidadão está totalmente integrado com o login gov.br.
            </p>
            <p style={{ fontSize: '1.35rem', lineHeight: 1.35, margin: '0 0 1.5rem' }}>
              Com a mesma conta você também acessa vários serviços do Estado do Espírito Santo.
            </p>
            <button
              type="button"
              onClick={onLogin}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#0b86b8',
                color: '#ffffff',
                padding: '1.25rem 1.5rem',
                fontSize: '1.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}
            >
              Faça seu Login
            </button>
          </div>
        </div>

        <button
          aria-label="Segurança"
          style={{
            position: 'fixed',
            left: '2.2rem',
            bottom: '1.7rem',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#93c5fd',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <LockKeyhole size={26} />
        </button>
      </section>
    </main>
  );
}
