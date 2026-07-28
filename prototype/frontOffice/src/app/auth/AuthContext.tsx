import { createContext, useContext, type ReactNode } from 'react';
import { useLocation } from 'react-router';

export type AccessType =
  | 'cidadao'
  | 'voluntario'
  | 'bolsista'
  | 'bolsistaSolicitarBolsa'
  | 'minhaEquipeExemplo'
  | 'proponente'
  | 'coordenador'
  | 'avaliador'
  | 'diretor'
  | 'reitor';

interface AuthContextValue {
  isLoggedIn: boolean;
  accessType: AccessType;
  login: (type: AccessType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Slug de URL -> perfil. Mantido aqui (e não em paths.ts) para evitar
// dependência circular: paths.ts importa o tipo AccessType deste módulo.
const SLUG_PARA_PERFIL: Record<string, AccessType> = {
  cidadao: 'cidadao',
  voluntario: 'voluntario',
  bolsista: 'bolsista',
  'bolsista-solicitar-bolsa': 'bolsistaSolicitarBolsa',
  'minha-equipe-exemplo': 'minhaEquipeExemplo',
  proponente: 'proponente',
  coordenador: 'coordenador',
  avaliador: 'avaliador',
  diretor: 'diretor',
  reitor: 'reitor',
};

function perfilNaUrl(pathname: string): AccessType | null {
  const slug = pathname.split('/').filter(Boolean)[0];
  return slug ? SLUG_PARA_PERFIL[slug] ?? null : null;
}

/**
 * O perfil é derivado da URL, sem estado paralelo.
 *
 * Cada perfil é uma aplicação diferente (o menu e várias telas mudam conforme
 * ele), então o caminho carrega essa informação: `/coordenador/inicio`. Duas
 * consequências desejadas:
 *
 * - abrir um link direto reproduz exatamente a tela, inclusive após refresh;
 * - `/login` sempre mostra o login, porque "estar logado" é apenas "haver um
 *   perfil válido no caminho" — não há estado que sobreviva à navegação.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const perfil = perfilNaUrl(location.pathname);

  const valor: AuthContextValue = {
    isLoggedIn: perfil !== null,
    accessType: perfil ?? 'bolsista',
    // Entrar e sair são navegações: quem chama leva para a URL do perfil ou
    // para /login. Não há nada a guardar aqui.
    login: () => {},
    logout: () => {},
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
