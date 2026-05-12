import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { AccessType } from '@/stores/auth'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    /** Roles allowed. Undefined = public. */
    roles?: AccessType[]
    /** True when route should be accessible without login. */
    public?: boolean
    /** PaymentsPage scope discriminator. */
    scope?: 'personal' | 'project'
  }
}

const BOLSISTA_AREA: AccessType[] = ['voluntario', 'bolsista', 'coordenador', 'diretor', 'reitor']
const CIDADAO_ONLY: AccessType[] = ['cidadao']

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { public: true },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { roles: BOLSISTA_AREA },
    children: [
      { path: '', name: 'home', component: () => import('@/pages/HomePage.vue') },
      { path: 'informacoes', name: 'informacoes', component: () => import('@/pages/MyInfoPage.vue') },
      { path: 'projetos', name: 'projetos', component: () => import('@/pages/MyProjectsPage.vue') },
      { path: 'projetos/:id', name: 'projeto-detalhes', component: () => import('@/pages/ProjectDetailsPage.vue'), props: true },
      { path: 'projetos-lista', name: 'projetos-lista', component: () => import('@/pages/ProjectsListPage.vue') },
      { path: 'minha-equipe', name: 'minha-equipe', component: () => import('@/pages/MyTeamPage.vue') },
      { path: 'pagamentos', name: 'pagamentos', component: () => import('@/pages/PaymentsPage.vue'), meta: { roles: BOLSISTA_AREA, scope: 'personal' } },
      { path: 'pagamentos/projeto', name: 'pagamentos-projeto', component: () => import('@/pages/PaymentsPage.vue'), meta: { roles: BOLSISTA_AREA, scope: 'project' } },
      { path: 'certificados', name: 'certificados', component: () => import('@/pages/CertificatesPage.vue') },
      { path: 'prestacao-contas/tecnica', name: 'prestacao-contas-tecnica', component: () => import('@/pages/PrestacaoContasTecnica.vue') },
      { path: 'prestacao-contas/financeira', name: 'prestacao-contas-financeira', component: () => import('@/pages/PrestacaoContasFinanceira.vue') },
      { path: 'prestacao-contas/financeira/:id', name: 'financeira-detalhes', component: () => import('@/pages/FinanceiraDetalhes.vue'), props: true },
      { path: 'remanejamento', name: 'remanejamento', component: () => import('@/pages/RemanejamentoPage.vue') },
      {
        path: 'bolsistas/novo',
        name: 'cadastrar-bolsista',
        component: () => import('@/pages/CadastrarBolsista.vue'),
        meta: { roles: ['coordenador'] },
      },
      { path: 'editais', name: 'editais', component: () => import('@/pages/EditaisPage.vue') },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
    ],
  },
  {
    path: '/cidadao',
    component: () => import('@/layouts/CidadaoLayout.vue'),
    meta: { roles: CIDADAO_ONLY },
    children: [
      { path: '', name: 'cidadao-home', component: () => import('@/pages/cidadao/HomePage.vue') },
      { path: 'editais/:id', name: 'cidadao-edital', component: () => import('@/pages/cidadao/EditalDetailPage.vue'), props: true },
      { path: 'inscricao/:id', name: 'cidadao-inscricao', component: () => import('@/pages/cidadao/InscricaoPage.vue'), props: true },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) {
    if (auth.isLoggedIn && to.name === 'login') {
      return auth.landingRoute
    }
    return true
  }

  if (!auth.isLoggedIn) {
    return { name: 'login' }
  }

  const allowedRoles = (to.matched
    .map((m) => m.meta.roles)
    .filter(Boolean)
    .at(-1) ?? undefined) as AccessType[] | undefined

  if (allowedRoles && !auth.hasRole(allowedRoles)) {
    return auth.landingRoute
  }

  return true
})
