import { useNavigate } from 'react-router';
import { useAuth } from '@/app/auth/AuthContext';
import { caminho } from './paths';

// Shim de navegação: mantém a assinatura antiga `onNavigate(page, arg?)` usada
// pelos componentes, agora resolvendo o caminho DENTRO do perfil atual — o
// perfil faz parte da URL (`/coordenador/inicio`).
export function useAppNavigate() {
  const navigate = useNavigate();
  const { accessType } = useAuth();

  return (page: string, arg?: string | number) => {
    // Pseudo-rotas de certificados (deep-link para aba de diárias)
    if (page === 'certificados-diarias') {
      navigate(`${caminho(accessType, 'certificados')}?flow=diarias&diariaTab=solicitadas`);
      return;
    }
    if (page === 'certificados-diarias-criar') {
      navigate(`${caminho(accessType, 'certificados')}?flow=diarias&diariaTab=nova`);
      return;
    }

    navigate(caminho(accessType, page, arg));
  };
}
