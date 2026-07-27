// Mapa chave-de-página -> caminho de URL. Mantém compatibilidade com as chaves
// de string usadas em toda a navegação por estado antiga (onNavigate('inicio')),
// para que os componentes-folha (Sidebar, Header, etc.) não precisem mudar.

export const PAGE_TO_PATH: Record<string, string> = {
  inicio: '/inicio',
  informacoes: '/informacoes',
  projetos: '/projetos',
  'minha-equipe': '/minha-equipe',
  'cadastrar-bolsista': '/cadastrar-bolsista',
  pagamentos: '/pagamentos',
  'pagamentos-projeto': '/pagamentos-projeto',
  certificados: '/certificados',
  'demanda-induzida': '/demanda-induzida',
  financeira: '/financeira',
  'prestacao-contas-tecnica': '/prestacao-contas-tecnica',
  remanejamento: '/remanejamento',
  editais: '/editais',
  dashboard: '/dashboard',
  'projects-list': '/projects-list',
};

// Deriva a chave de página a partir do pathname atual (para destacar o item
// ativo na Sidebar). Usa correspondência por prefixo para rotas com parâmetro.
export function pathToPageKey(pathname: string): string {
  if (pathname.startsWith('/financeira')) return 'financeira';
  if (pathname.startsWith('/projects-list')) return 'projects-list';
  const match = Object.entries(PAGE_TO_PATH).find(([, path]) => path === pathname);
  return match ? match[0] : 'inicio';
}
