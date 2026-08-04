import { useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import { ScenarioProvider } from '@/mocks/ScenarioContext';
import { AuthProvider } from '@/app/auth/AuthContext';
import { AppRoutes } from '@/app/routing/AppRoutes';

// Roteamento por URL (react-router). A navegação por estado antiga foi
// substituída pela árvore de rotas em AppRoutes; os componentes de página
// seguem quase intactos, alimentados por adapters de rota.
export default function App() {
  // Dark mode padrão do sistema (vale para todas as telas, inclusive login).
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ScenarioProvider>
          <AppRoutes />
        </ScenarioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
