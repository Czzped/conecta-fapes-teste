import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Toaster } from 'sonner';
import { Sidebar } from '@/app/components/Sidebar';
import { Header } from '@/app/components/Header';
import { useAuth } from '@/app/auth/AuthContext';
import { useAppNavigate } from '@/app/routing/useAppNavigate';
import { pathToPageKey } from '@/app/routing/paths';

// Casca da área interna: Sidebar + Header + <Outlet/> para a página da rota.
// Substitui o wrapper duplicado que existia no App.tsx antigo.
export function AppLayout() {
  const { accessType, logout } = useAuth();
  const navigate = useNavigate();
  const handleNavigate = useAppNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Fecha o menu mobile a cada navegação (inclui voltar/avançar do navegador).
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const currentPage = pathToPageKey(location.pathname);
  const toggleSidebar = () => setIsCollapsed((v) => !v);
  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Toaster
        richColors
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          },
          className: 'sonner-toast',
        }}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
          onLogout={handleLogout}
          accessType={accessType}
        />
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={toggleMobileMenu}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar
              currentPage={currentPage}
              onNavigate={handleNavigate}
              isCollapsed={false}
              onToggle={toggleMobileMenu}
              isMobile={true}
              onLogout={handleLogout}
              accessType={accessType}
            />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={toggleSidebar}
          onToggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          accessType={accessType}
        />
        <main className="flex-1" style={{ backgroundColor: 'var(--background)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
