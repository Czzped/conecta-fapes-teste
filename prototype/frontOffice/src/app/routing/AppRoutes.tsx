import { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from 'react-router';

import { useAuth, type AccessType } from '@/app/auth/AuthContext';
import { useAppNavigate } from '@/app/routing/useAppNavigate';
import { RequireInternal, RequireCidadao, RequireRole } from '@/app/routing/guards';
import { AppLayout } from '@/app/layouts/AppLayout';
import { CidadaoLayout } from '@/app/layouts/CidadaoLayout';
import { payments } from '@/app/data/pagamentos';

import { LoginPage } from '@/app/components/LoginPage';
import { CidadaoHomePage } from '@/app/components/CidadaoHomePage';
import { EditalDetailPage } from '@/app/components/EditalDetailPage';
import { AcessoCidadaoLoginPage } from '@/app/components/AcessoCidadaoLoginPage';
import { InscricaoOptionsPage } from '@/app/components/InscricaoOptionsPage';
import { CidadaoMeusDadosPage } from '@/app/components/CidadaoMeusDadosPage';
import { InscricaoPage } from '@/app/components/InscricaoPage';
import { HomePage } from '@/app/components/HomePage';
import { MyInfoPage } from '@/app/components/MyInfoPage';
import { MyProjectsPage } from '@/app/components/MyProjectsPage';
import { MyTeamPage } from '@/app/components/MyTeamPage';
import { PaymentsPage } from '@/app/components/PaymentsPage';
import { CertificatesPage } from '@/app/components/CertificatesPage';
import { PrestacaoContasTecnica } from '@/app/components/PrestacaoContasTecnica';
import { PrestacaoContasFinanceira } from '@/app/components/PrestacaoContasFinanceira';
import { FinanceiraDetalhes } from '@/app/components/FinanceiraDetalhes';
import { RemanejamentoPage } from '@/app/components/RemanejamentoPage';
import { CadastrarBolsista } from '@/app/components/CadastrarBolsista';
import { EditaisPage } from '@/app/components/EditaisPage';
import { ProjectsListPage } from '@/app/components/ProjectsListPage';
import { DashboardPage } from '@/app/components/DashboardPage';
import { ProjectDetailsPage } from '@/app/components/ProjectDetailsPage';

// Rota de destino após login, conforme o perfil.
function landingPath(type: AccessType): string {
  if (type === 'cidadao') return '/cidadao';
  if (type === 'proponente') return '/informacoes';
  if (type === 'minhaEquipeExemplo') return '/minha-equipe';
  if (type === 'reitor' || type === 'diretor') return '/dashboard';
  return '/inicio';
}

function LoginRoute() {
  const { isLoggedIn, accessType, login } = useAuth();
  const navigate = useNavigate();
  if (isLoggedIn) return <Navigate to={landingPath(accessType)} replace />;
  return (
    <LoginPage
      onLogin={(type: AccessType) => {
        login(type);
        navigate(landingPath(type), { replace: true });
      }}
    />
  );
}

/* ------------------------------ Cidadão ------------------------------ */

function CidadaoHomeRoute() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const [scrollOport, setScrollOport] = useState(
    Boolean((location.state as { scrollToOportunidades?: boolean } | null)?.scrollToOportunidades),
  );
  return (
    <CidadaoHomePage
      onLogin={() => {
        logout();
        navigate('/login');
      }}
      onVerEdital={(id: number) => navigate(`/cidadao/edital/${id}`)}
      onInscricao={(id: number) => navigate(`/cidadao/edital/${id}/acesso`)}
      scrollToOportunidades={scrollOport}
      onScrolledToOportunidades={() => setScrollOport(false)}
    />
  );
}

function EditalDetailRoute() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { editalId } = useParams();
  const id = Number(editalId);
  return (
    <EditalDetailPage
      editalId={id}
      onBack={() => navigate('/cidadao')}
      onInscricao={() => navigate(`/cidadao/edital/${id}/acesso`)}
      onLogin={() => {
        logout();
        navigate('/login');
      }}
    />
  );
}

// Etapa "Acesso Cidadão" da inscrição.
function AcessoCidadaoRoute() {
  const navigate = useNavigate();
  const { editalId } = useParams();
  return <AcessoCidadaoLoginPage onLogin={() => navigate(`/cidadao/edital/${editalId}/opcoes`)} />;
}

// Opções de inscrição (3 caminhos).
function OpcoesInscricaoRoute() {
  const navigate = useNavigate();
  const { editalId } = useParams();
  return (
    <InscricaoOptionsPage
      onBack={() => navigate(`/cidadao/edital/${editalId}/acesso`)}
      onOption1={() => navigate(`/cidadao/edital/${editalId}/inscricao`)}
      onOption2Complete={() => navigate(`/cidadao/edital/${editalId}/inscricao?hideDados=1`)}
      onOption3={() => navigate('/cidadao/meus-dados')}
    />
  );
}

function InscricaoRoute() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { editalId } = useParams();
  const [searchParams] = useSearchParams();
  return (
    <InscricaoPage
      editalId={Number(editalId)}
      hideDadosTab={searchParams.get('hideDados') === '1'}
      onBack={() => navigate('/cidadao', { state: { scrollToOportunidades: true } })}
      onLogin={() => {
        logout();
        navigate('/login');
      }}
    />
  );
}

function CidadaoMeusDadosRoute() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <CidadaoMeusDadosPage
      onBackToOpportunities={() => navigate('/cidadao', { state: { scrollToOportunidades: true } })}
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    />
  );
}

/* ------------------------------ Interno ------------------------------ */

function HomeRoute() {
  const { accessType } = useAuth();
  const navigate = useAppNavigate();
  return <HomePage accessType={accessType} onNavigate={navigate} />;
}

function MyInfoRoute() {
  const { accessType } = useAuth();
  return <MyInfoPage initialTab="dados" hideDocumentsTab={accessType === 'proponente'} />;
}

// Demanda Induzida: InscricaoPage reaproveitada como página interna.
function DemandaInduzidaRoute() {
  const navigate = useAppNavigate();
  return (
    <InscricaoPage
      editalId={1}
      onBack={() => navigate('inicio')}
      hideHeader
      hideTabs
      hideBackButton
      pageTitle="Demanda Induzida"
      pageSubtitle="Você possui uma proposta da Fapes para participar de um projeto. Atualize seus dados e preencha o formulário do projeto"
      pageDescription=""
      formHeading="Formulário de Submissão"
      breadcrumb={['Início', 'Demanda Induzida']}
      showProjectTitleIcon
      showDocumentoEditalTab
    />
  );
}

function MyProjectsRoute() {
  const { accessType } = useAuth();
  return <MyProjectsPage accessType={accessType} />;
}

function MyTeamRoute() {
  const { accessType } = useAuth();
  const navigate = useAppNavigate();
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get('tab') as 'bolsistas' | 'informacoes' | 'pagamentos') || 'informacoes';
  return <MyTeamPage accessType={accessType} onNavigate={navigate} defaultTab={tab} />;
}

function CadastrarBolsistaRoute() {
  const navigate = useNavigate();
  const { accessType } = useAuth();
  return (
    <CadastrarBolsista
      onBack={(tab: string = 'informacoes') => navigate(`/minha-equipe?tab=${tab}`)}
      showBolsistasBreadcrumb={accessType === 'minhaEquipeExemplo'}
    />
  );
}

function CertificatesRoute() {
  const { accessType } = useAuth();
  const navigate = useAppNavigate();
  const [searchParams] = useSearchParams();
  const initialFlow = searchParams.get('flow') === 'diarias' ? 'diarias' : null;
  const initialDiariaTab =
    (searchParams.get('diariaTab') as 'solicitadas' | 'minhas' | 'nova') || 'solicitadas';
  return (
    <CertificatesPage
      accessType={accessType}
      initialFlow={initialFlow}
      initialDiariaTab={initialDiariaTab}
      onNavigate={navigate}
    />
  );
}

function FinanceiraListRoute() {
  const navigate = useAppNavigate();
  return (
    <PrestacaoContasFinanceira
      onBack={() => navigate('inicio')}
      onNavigateToDetails={(payment: { id: number }) => navigate('financeira-detalhes', payment.id)}
    />
  );
}

function FinanceiraDetalhesRoute() {
  const navigate = useAppNavigate();
  const { paymentId } = useParams();
  const payment = payments.find((p) => String(p.id) === paymentId);
  if (!payment) return <Navigate to="/financeira" replace />;
  return (
    <FinanceiraDetalhes payment={payment} onBack={() => navigate('financeira')} onNavigate={navigate} />
  );
}

function PrestacaoTecnicaRoute() {
  const navigate = useAppNavigate();
  return <PrestacaoContasTecnica onBack={() => navigate('inicio')} />;
}

function ProjectsListRoute() {
  const navigate = useAppNavigate();
  return <ProjectsListPage onNavigate={navigate} />;
}

function ProjectDetailsRoute() {
  const navigate = useAppNavigate();
  return <ProjectDetailsPage onBack={() => navigate('projects-list')} />;
}

/* ------------------------------ Árvore ------------------------------ */

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      {/* Área pública do cidadão */}
      <Route element={<RequireCidadao />}>
        <Route path="/cidadao" element={<CidadaoLayout />}>
          <Route index element={<CidadaoHomeRoute />} />
          <Route path="meus-dados" element={<CidadaoMeusDadosRoute />} />
          <Route path="edital/:editalId" element={<EditalDetailRoute />} />
          <Route path="edital/:editalId/acesso" element={<AcessoCidadaoRoute />} />
          <Route path="edital/:editalId/opcoes" element={<OpcoesInscricaoRoute />} />
          <Route path="edital/:editalId/inscricao" element={<InscricaoRoute />} />
        </Route>
      </Route>

      {/* Área interna */}
      <Route element={<RequireInternal />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/inicio" replace />} />
          <Route path="inicio" element={<HomeRoute />} />
          <Route path="informacoes" element={<MyInfoRoute />} />
          <Route path="demanda-induzida" element={<DemandaInduzidaRoute />} />
          <Route path="projetos" element={<MyProjectsRoute />} />
          <Route path="minha-equipe" element={<MyTeamRoute />} />
          <Route path="cadastrar-bolsista" element={<CadastrarBolsistaRoute />} />
          <Route path="pagamentos" element={<PaymentsPage scope="personal" />} />
          <Route path="pagamentos-projeto" element={<PaymentsPage scope="project" />} />
          <Route path="certificados" element={<CertificatesRoute />} />
          <Route path="financeira" element={<FinanceiraListRoute />} />
          <Route path="financeira/:paymentId" element={<FinanceiraDetalhesRoute />} />
          <Route path="prestacao-contas-tecnica" element={<PrestacaoTecnicaRoute />} />
          <Route path="remanejamento" element={<RemanejamentoPage />} />
          <Route path="editais" element={<EditaisPage />} />

          {/* Somente reitor/diretor */}
          <Route element={<RequireRole roles={['reitor', 'diretor']} />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects-list" element={<ProjectsListRoute />} />
            <Route path="projects-list/:projectId" element={<ProjectDetailsRoute />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}
