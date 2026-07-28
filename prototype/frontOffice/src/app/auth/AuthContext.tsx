import { createContext, useContext, useState, type ReactNode } from 'react';

export type AccessType =
  | 'cidadao'
  | 'voluntario'
  | 'bolsista'
  | 'bolsistaSolicitarBolsa'
  | 'minhaEquipeExemplo'
  | 'proponente'
  | 'coordenador'
  | 'diretor'
  | 'reitor';

interface AuthContextValue {
  isLoggedIn: boolean;
  accessType: AccessType;
  login: (type: AccessType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessType, setAccessType] = useState<AccessType>('bolsista');

  const login = (type: AccessType) => {
    setAccessType(type);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAccessType('bolsista');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, accessType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
