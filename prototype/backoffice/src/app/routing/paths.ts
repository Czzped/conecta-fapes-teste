// Mapa página -> caminho de URL do backoffice.
// As chaves são exatamente os valores do tipo `ActivePage` do Dashboard, para que
// toda a navegação existente (`setActivePage('financeira')`) continue funcionando
// sem alteração nos ~40 pontos de chamada — só o destino passa a ser a URL.

export const DEFAULT_PAGE = 'parceria';

export const PAGE_TO_PATH: Record<string, string> = {
  home: '/home',
  dashboard: '/dashboard',
  'caixa-entrada': '/caixa-entrada',
  financeira: '/financeira',
  // 'detalhes' não entra aqui: o caminho carrega o id (/financeira/:id) e é
  // construído a partir do pagamento selecionado.
  pagamento: '/pagamento',
  'contabilidade-financeiro': '/contabilidade-financeiro',
  fomento: '/fomento',
  editais: '/editais',
  'editais-light': '/editais-light',
  programa: '/programa',
  parceria: '/parceria',
  instituicoes: '/instituicoes',
  iniciativas: '/iniciativas',
  // Configurações e suas telas filhas, aninhadas na URL.
  configuracoes: '/configuracoes',
  planejamento: '/configuracoes/planejamento',
  formulario: '/configuracoes/formulario',
  rubricas: '/configuracoes/rubricas',
  pessoas: '/configuracoes/pessoas',
  referencias: '/configuracoes/referencias',
  documentos: '/configuracoes/documentos',
  'regras-acao-transversal': '/configuracoes/regras-acao-transversal',
  'calendario-folha': '/configuracoes/calendario-folha',
  'controle-acessos': '/configuracoes/controle-acessos',
};

/** Página correspondente ao caminho atual, ou null se não houver. */
export function pathToPage(pathname: string): string | null {
  const found = Object.entries(PAGE_TO_PATH).find(([, path]) => path === pathname);
  return found ? found[0] : null;
}

/** Id do pagamento quando o caminho é a tela de detalhes (/financeira/:id). */
export function detalhesIdFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/financeira\/([^/]+)\/?$/);
  return m ? m[1] : null;
}
