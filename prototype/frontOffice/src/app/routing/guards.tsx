import { Navigate, Outlet, useParams } from 'react-router';
import { useAuth, type AccessType } from '@/app/auth/AuthContext';
import { perfilDoSlug, telaInicial } from './paths';

/**
 * Área interna: o perfil vem do primeiro segmento da URL (`/:perfil/...`).
 * Perfil desconhecido cai no login; `cidadao` tem área própria.
 */
export function RequireInternal() {
  const { perfil: slug } = useParams();
  const perfil = perfilDoSlug(slug);
  if (!perfil) return <Navigate to="/login" replace />;
  if (perfil === 'cidadao') return <Navigate to="/cidadao" replace />;
  return <Outlet />;
}

/** Área do cidadão. */
export function RequireCidadao() {
  const { accessType, isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (accessType !== 'cidadao') return <Navigate to={telaInicial(accessType)} replace />;
  return <Outlet />;
}

/**
 * Bloqueio por perfil em telas específicas (ex.: dashboard de reitor/diretor).
 * Quem não tem acesso volta para a tela inicial do próprio perfil.
 */
export function RequireRole({ roles }: { roles: AccessType[] }) {
  const { perfil: slug } = useParams();
  const perfil = perfilDoSlug(slug);
  if (!perfil) return <Navigate to="/login" replace />;
  if (!roles.includes(perfil)) return <Navigate to={telaInicial(perfil)} replace />;
  return <Outlet />;
}
