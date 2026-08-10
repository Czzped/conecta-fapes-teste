import type { AccessType } from '@/app/auth/AuthContext';

// O PERFIL faz parte da URL: `/coordenador/inicio`, `/bolsista/inicio`, ...
//
// Motivo: cada perfil é, na prática, uma aplicação diferente — o `accessType`
// muda a interface em ~26 pontos (menu, home, minha equipe, certificados...).
// Antes ele vivia só na memória, então `/inicio` significava coisas distintas
// para bolsista, voluntário e coordenador, e dar refresh perdia o perfil e
// voltava para o login. Com o perfil no caminho, o link reproduz o que a pessoa
// estava vendo.

/** Segmento de URL de cada perfil. */
export const PERFIL_PARA_SLUG: Record<AccessType, string> = {
  cidadao: 'cidadao',
  voluntario: 'voluntario',
  bolsista: 'bolsista',
  bolsistaSolicitarBolsa: 'bolsista-solicitar-bolsa',
  minhaEquipeExemplo: 'minha-equipe-exemplo',
  proponente: 'proponente',
  coordenador: 'coordenador',
  avaliador: 'avaliador',
  diretor: 'diretor',
  reitor: 'reitor',
};

export const SLUG_PARA_PERFIL: Record<string, AccessType> = Object.fromEntries(
  Object.entries(PERFIL_PARA_SLUG).map(([perfil, slug]) => [slug, perfil as AccessType]),
) as Record<string, AccessType>;

export function perfilDoSlug(slug: string | undefined): AccessType | null {
  return slug ? SLUG_PARA_PERFIL[slug] ?? null : null;
}

// Caminhos das telas, RELATIVOS ao perfil. As chaves são as mesmas usadas pela
// navegação antiga (`onNavigate('inicio')`), para que os componentes-folha
// (Sidebar, Header, ...) sigam sem alteração.
export const PAGE_TO_PATH: Record<string, string> = {
  inicio: 'inicio',
  informacoes: 'informacoes',
  projetos: 'projetos',
  'minha-equipe': 'minha-equipe',
  'cadastrar-bolsista': 'cadastrar-bolsista',
  'solicitar-auxilio': 'solicitar-auxilio',
  pagamentos: 'pagamentos',
  'pagamentos-projeto': 'pagamentos-projeto',
  certificados: 'certificados',
  'demanda-induzida': 'demanda-induzida',
  financeira: 'financeira',
  'prestacao-contas-tecnica': 'prestacao-contas-tecnica',
  remanejamento: 'remanejamento',
  editais: 'editais',
  dashboard: 'dashboard',
  'projects-list': 'projects-list',
};

/** Caminho absoluto de uma tela dentro do perfil. */
export function caminho(perfil: AccessType, page: string, arg?: string | number): string {
  const base = `/${PERFIL_PARA_SLUG[perfil]}`;
  if (page === 'financeira-detalhes' && arg != null) return `${base}/financeira/${arg}`;
  if (page === 'project-details' && arg != null) return `${base}/projects-list/${arg}`;
  return `${base}/${PAGE_TO_PATH[page] ?? 'inicio'}`;
}

/** Tela inicial de cada perfil, logo após o login. */
export function telaInicial(perfil: AccessType): string {
  switch (perfil) {
    case 'cidadao':
      return `/${PERFIL_PARA_SLUG.cidadao}`;
    case 'proponente':
      return caminho(perfil, 'informacoes');
    case 'minhaEquipeExemplo':
      return caminho(perfil, 'minha-equipe');
    case 'reitor':
    case 'diretor':
      return caminho(perfil, 'dashboard');
    default:
      return caminho(perfil, 'inicio');
  }
}

/**
 * Chave da página a partir do pathname, para destacar o item ativo na Sidebar.
 * O primeiro segmento é o perfil e é descartado aqui.
 */
export function pathToPageKey(pathname: string): string {
  const partes = pathname.split('/').filter(Boolean);
  const resto = partes.slice(1); // remove o perfil
  const primeiro = resto[0] ?? 'inicio';
  if (primeiro === 'financeira') return 'financeira';
  if (primeiro === 'projects-list') return 'projects-list';
  const match = Object.entries(PAGE_TO_PATH).find(([, path]) => path === primeiro);
  return match ? match[0] : 'inicio';
}
