import { useState } from 'react';
import { Home, LogOut, Menu, User, X } from 'lucide-react';
import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';
import { Header } from './Header';
import { MyInfoPage } from './MyInfoPage';

const FF = 'var(--font-family)';
const CLR_CYAN = '#06b6d4';

interface CidadaoMeusDadosPageProps {
  onBackToOpportunities: () => void;
  onLogout: () => void;
}

function CidadaoSidebar({
  isOpen,
  onClose,
  onBackToOpportunities,
  onLogout,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onBackToOpportunities: () => void;
  onLogout: () => void;
}) {
  const content = (
    <aside
      className="h-screen border-r flex flex-col sticky top-0"
      style={{
        width: '240px',
        borderRightColor: 'var(--sidebar-border)',
        backgroundColor: 'var(--sidebar)',
      }}
    >
      <div className="flex items-center justify-between" style={{ padding: '1rem', borderBottom: '1px solid var(--sidebar-border)' }}>
        <img src={fapesLogo} alt="FAPES" style={{ height: '36px', objectFit: 'contain' }} />
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--foreground)', cursor: 'pointer', display: 'inline-flex' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1" style={{ padding: '1rem' }}>
        <button
          onClick={onBackToOpportunities}
          className="w-full flex items-center gap-3"
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--muted-foreground)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontFamily: FF,
            fontSize: 'var(--text-sm)',
            padding: '0.75rem',
            textAlign: 'left',
            marginBottom: '0.5rem',
          }}
        >
          <Home size={18} />
          Oportunidades
        </button>
        <button
          className="w-full flex items-center gap-3"
          style={{
            border: 'none',
            backgroundColor: 'rgba(6,182,212,0.12)',
            color: CLR_CYAN,
            borderRadius: 'var(--radius)',
            cursor: 'default',
            fontFamily: FF,
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            padding: '0.75rem',
            textAlign: 'left',
          }}
        >
          <User size={18} />
          Meus Dados
        </button>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--sidebar-border)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3"
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--muted-foreground)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontFamily: FF,
            fontSize: 'var(--text-sm)',
            padding: '0.75rem',
            textAlign: 'left',
          }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );

  if (isOpen) {
    return (
      <>
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={onClose}
        />
        <div className="fixed inset-y-0 left-0 z-50 md:hidden">{content}</div>
      </>
    );
  }

  return <div className="hidden md:block">{content}</div>;
}

export function CidadaoMeusDadosPage({ onBackToOpportunities, onLogout }: CidadaoMeusDadosPageProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <CidadaoSidebar onBackToOpportunities={onBackToOpportunities} onLogout={onLogout} />
      {mobileOpen && (
        <CidadaoSidebar
          isOpen
          onClose={() => setMobileOpen(false)}
          onBackToOpportunities={onBackToOpportunities}
          onLogout={onLogout}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setMobileOpen(true)}
          onToggleMobileMenu={() => setMobileOpen(true)}
          isMobileMenuOpen={mobileOpen}
          onLogout={onLogout}
          accessType="cidadao"
        />
        <main className="flex-1" style={{ backgroundColor: 'var(--background)' }}>
          <MyInfoPage initialTab="dados" hideDocumentsTab />
        </main>
      </div>

      <button
        className="fixed bottom-5 left-5 md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '9999px',
          border: '1px solid rgba(6,182,212,0.35)',
          backgroundColor: 'var(--card)',
          color: CLR_CYAN,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
        }}
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
