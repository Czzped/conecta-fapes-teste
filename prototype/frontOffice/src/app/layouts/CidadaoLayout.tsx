import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';

// Layout da área pública do cidadão: rola para o topo a cada troca de rota
// (comportamento que antes era feito com window.scrollTo em cada navegação).
export function CidadaoLayout() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <Outlet />;
}
