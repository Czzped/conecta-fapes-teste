import { Navigate, Outlet } from 'react-router';
import { useAuth, type AccessType } from '@/app/auth/AuthContext';

// Área interna (bolsista/coordenador/diretor/reitor): exige login e NÃO cidadão.
export function RequireInternal() {
  const { isLoggedIn, accessType } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (accessType === 'cidadao') return <Navigate to="/cidadao" replace />;
  return <Outlet />;
}

// Área pública do cidadão: exige login como cidadão.
export function RequireCidadao() {
  const { isLoggedIn, accessType } = useAuth();
  if (!isLoggedIn || accessType !== 'cidadao') return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Bloqueio por perfil para rotas específicas (ex.: dashboard reitor/diretor).
export function RequireRole({ roles }: { roles: AccessType[] }) {
  const { accessType } = useAuth();
  if (!roles.includes(accessType)) return <Navigate to="/inicio" replace />;
  return <Outlet />;
}
