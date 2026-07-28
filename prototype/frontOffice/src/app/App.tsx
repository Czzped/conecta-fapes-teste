import { useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import { ScenarioProvider } from '@/mocks/ScenarioContext';
import { AuthProvider } from '@/app/auth/AuthContext';
import { AppRoutes } from '@/app/routing/AppRoutes';

// Roteamento por URL (react-router). A navegação por estado antiga foi
// substituída pela árvore de rotas em AppRoutes; os componentes de página
// seguem quase intactos, alimentados por adapters de rota.
export default function App() {
  // Dark mode padrão do sistema (vale para todas as telas, inclusive login).
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
      case 'solicitar-auxilio':
        return <CadastrarBolsista tipo="auxilio" onBack={(tab = 'informacoes') => {
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
    <BrowserRouter>
      <AuthProvider>
        <ScenarioProvider>
          <AppRoutes />
        </ScenarioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
