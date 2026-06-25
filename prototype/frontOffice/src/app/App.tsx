import { useState, useEffect } from 'react';
import { ScenarioProvider } from '@/mocks/ScenarioContext';
import { LoginPage } from './components/LoginPage';
import { CidadaoHomePage } from './components/CidadaoHomePage';
import { EditalDetailPage } from './components/EditalDetailPage';
import { InscricaoPage } from './components/InscricaoPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { MyInfoPage } from './components/MyInfoPage';
import { MyProjectsPage } from './components/MyProjectsPage';
import { MyTeamPage } from './components/MyTeamPage';
import { PaymentsPage } from './components/PaymentsPage';
import { CertificatesPage } from './components/CertificatesPage';
import { PrestacaoContasTecnica } from './components/PrestacaoContasTecnica';
import { PrestacaoContasFinanceira } from './components/PrestacaoContasFinanceira';
import { FinanceiraDetalhes } from './components/FinanceiraDetalhes';
import { RemanejamentoPage } from './components/RemanejamentoPage';
import { CadastrarBolsista } from './components/CadastrarBolsista';
import { EditaisPage } from './components/EditaisPage';
import { ProjectsListPage } from './components/ProjectsListPage';
import { DashboardPage } from './components/DashboardPage';
import { ProjectDetailsPage } from './components/ProjectDetailsPage';
import { Toaster } from 'sonner';

// Main App Component - LanguageProvider is in main.tsx
type AccessType = 'cidadao' | 'voluntario' | 'bolsista' | 'coordenador' | 'diretor' | 'reitor';
type CidadaoPage = 'home' | 'edital-detail' | 'inscricao';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessType, setAccessType] = useState<AccessType>('bolsista');
  const [currentPage, setCurrentPage] = useState('inicio');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [certificatesInitialFlow, setCertificatesInitialFlow] = useState<'diarias' | null>(null);
  const [certificatesInitialDiariaTab, setCertificatesInitialDiariaTab] = useState<'solicitadas' | 'minhas' | 'nova'>('solicitadas');
  const [myTeamInitialTab, setMyTeamInitialTab] = useState<'bolsistas' | 'informacoes' | 'pagamentos'>('informacoes');

  // Cidadão sub-navigation
  const [cidadaoPage, setCidadaoPage] = useState<CidadaoPage>('home');
  const [selectedEditalId, setSelectedEditalId] = useState<number>(1);

  // Define dark mode como padrão do sistema
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogin = (type: AccessType) => {
    setAccessType(type);
    setIsLoggedIn(true);
    // Se for reitor/diretor, navega direto para dashboard
    if (type === 'reitor' || type === 'diretor') {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('inicio'); // Reset to home page on logout
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = (page: string) => {
    if (page === 'certificados-diarias-criar') {
      setCertificatesInitialFlow('diarias');
      setCertificatesInitialDiariaTab('nova');
      setCurrentPage('certificados');
      setIsMobileMenuOpen(false);
      return;
    }

    if (page === 'certificados-diarias') {
      setCertificatesInitialFlow('diarias');
      setCertificatesInitialDiariaTab('solicitadas');
      setCurrentPage('certificados');
      setIsMobileMenuOpen(false);
      return;
    }

    if (page !== 'minha-equipe') {
      setMyTeamInitialTab('informacoes');
    }

    setCertificatesInitialFlow(null);
    setCertificatesInitialDiariaTab('solicitadas');
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <HomePage accessType={accessType} onNavigate={handleNavigate} />;
      case 'informacoes':
        return <MyInfoPage />;
      case 'projetos':
        return <MyProjectsPage accessType={accessType} />;
      case 'minha-equipe':
        return <MyTeamPage accessType={accessType} onNavigate={handleNavigate} defaultTab={myTeamInitialTab} />;
      case 'pagamentos-projeto':
        return <PaymentsPage scope="project" />;
      case 'pagamentos':
        return <PaymentsPage scope="personal" />;
      case 'certificados':
        return (
          <CertificatesPage
            accessType={accessType}
            initialFlow={certificatesInitialFlow}
            initialDiariaTab={certificatesInitialDiariaTab}
            onNavigate={handleNavigate}
          />
        );
      case 'prestacao-contas-tecnica':
        return <PrestacaoContasTecnica onBack={() => handleNavigate('inicio')} />;
      case 'financeira':
        return (
          <PrestacaoContasFinanceira 
            onBack={() => handleNavigate('inicio')} 
            onNavigateToDetails={(payment) => {
              setSelectedPayment(payment);
              handleNavigate('financeira-detalhes');
            }}
          />
        );
      case 'financeira-detalhes':
        return <FinanceiraDetalhes payment={selectedPayment} onBack={() => handleNavigate('financeira')} onNavigate={handleNavigate} />;
      case 'remanejamento':
        return <RemanejamentoPage />;
      case 'cadastrar-bolsista':
        return <CadastrarBolsista onBack={(tab = 'informacoes') => {
          setMyTeamInitialTab(tab);
          handleNavigate('minha-equipe');
        }} />;
      case 'editais':
        return <EditaisPage />;
      case 'projects-list':
        return <ProjectsListPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'project-details':
        return <ProjectDetailsPage onBack={() => handleNavigate('projects-list')} />;
      default:
        return <HomePage accessType={accessType} onNavigate={handleNavigate} />;
    }
  };

  return (
    <ScenarioProvider>
      {/* Show login page if not logged in */}
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : accessType === 'cidadao' ? (
        <>
          {cidadaoPage === 'home' && (
            <CidadaoHomePage
              onLogin={() => { setIsLoggedIn(false); setAccessType('bolsista'); }}
              onVerEdital={(id) => { setSelectedEditalId(id); setCidadaoPage('edital-detail'); window.scrollTo(0, 0); }}
              onInscricao={(id) => { setSelectedEditalId(id); setCidadaoPage('inscricao'); window.scrollTo(0, 0); }}
            />
          )}
          {cidadaoPage === 'edital-detail' && (
            <EditalDetailPage
              editalId={selectedEditalId}
              onBack={() => { setCidadaoPage('home'); window.scrollTo(0, 0); }}
              onInscricao={() => { setCidadaoPage('inscricao'); window.scrollTo(0, 0); }}
              onLogin={() => { setIsLoggedIn(false); setAccessType('bolsista'); }}
            />
          )}
          {cidadaoPage === 'inscricao' && (
            <InscricaoPage
              editalId={selectedEditalId}
              onBack={() => { setCidadaoPage('edital-detail'); window.scrollTo(0, 0); }}
              onLogin={() => { setIsLoggedIn(false); setAccessType('bolsista'); }}
            />
          )}
        </>
      ) : (
        <div 
          className="flex min-h-screen"
          style={{
            backgroundColor: 'var(--background)',
          }}
        >
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
          {/* Desktop Sidebar - Hidden on mobile */}
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

          {/* Mobile Sidebar - Overlay */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40 md:hidden"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
                onClick={toggleMobileMenu}
              />
              
              {/* Sidebar */}
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
              {renderPage()}
            </main>
          </div>
        </div>
      )}
    </ScenarioProvider>
  );
}
