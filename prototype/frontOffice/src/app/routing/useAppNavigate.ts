import { useNavigate } from 'react-router';
import { PAGE_TO_PATH } from './paths';

// Shim de navegação: mantém a assinatura antiga onNavigate(page, arg?) usada
// pelos componentes, traduzindo as chaves de página (e os casos especiais de
// deep-link) para navegação por URL do react-router.
export function useAppNavigate() {
  const navigate = useNavigate();

  return (page: string, arg?: string | number) => {
    // Pseudo-rotas de certificados (deep-link para aba de diárias)
    if (page === 'certificados-diarias') {
      navigate('/certificados?flow=diarias&diariaTab=solicitadas');
      return;
    }
    if (page === 'certificados-diarias-criar') {
      navigate('/certificados?flow=diarias&diariaTab=nova');
      return;
    }
    // Rotas de detalhe com id na URL
    if (page === 'financeira-detalhes' && arg != null) {
      navigate(`/financeira/${arg}`);
      return;
    }
    if (page === 'project-details' && arg != null) {
      navigate(`/projects-list/${arg}`);
      return;
    }

    navigate(PAGE_TO_PATH[page] ?? '/inicio');
  };
}
