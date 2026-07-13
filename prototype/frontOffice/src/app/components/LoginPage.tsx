import { User, UserCircle, GraduationCap, Users, Briefcase, Building, ClipboardCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';

interface LoginPageProps {
  onLogin: (accessType: AccessType) => void;
}

type AccessType = 'cidadao' | 'voluntario' | 'bolsista' | 'proponente' | 'coordenador' | 'avaliador' | 'diretor' | 'reitor';

export function LoginPage({ onLogin }: LoginPageProps) {
  const { t } = useLanguage();
  const [selectedAccessType, setSelectedAccessType] = useState<AccessType | null>(null);

  // Força dark mode na tela de login
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    return () => {
      // Mantém dark mode ao sair da tela de login
      // pois dark mode é o padrão do sistema
    };
  }, []);

  const handleLogin = (accessType: AccessType) => {
    // Aqui será integrada a lógica de autenticação com Acesso Cidadão
    console.log('Login with Acesso Cidadão as', accessType);
    onLogin(accessType);
  };

  const getLoginOptionBackground = (accessType: AccessType) =>
    selectedAccessType === accessType ? 'var(--sidebar-accent)' : 'transparent';
  const getLoginOptionColor = (accessType: AccessType) =>
    selectedAccessType === accessType ? 'var(--primary)' : 'var(--card-foreground)';
  const setLoginOptionHover = (element: HTMLButtonElement, accessType: AccessType) => {
    element.style.backgroundColor = 'var(--sidebar-accent)';
    element.style.color = getLoginOptionColor(accessType);
    element.style.transform = 'translateY(0)';
    element.style.boxShadow = 'none';
  };
  const resetLoginOption = (element: HTMLButtonElement, accessType: AccessType) => {
    element.style.backgroundColor = getLoginOptionBackground(accessType);
    element.style.color = getLoginOptionColor(accessType);
    element.style.transform = 'translateY(0)';
    element.style.boxShadow = 'none';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: 'var(--color-neutral-950)',
        padding: '1rem',
        position: 'relative',
      }}
    >
      <div 
        className="w-full max-w-md"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo Container */}
        <div 
          className="flex flex-col items-center gap-4"
          style={{
            marginBottom: '1rem',
          }}
        >
          <img
            src={fapesLogo}
            alt="FAPES Logo"
            style={{
              height: '60px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Login Card */}
        <div 
          className="login-card-border-glow w-full px-6 py-8 md:p-8"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-neutral-900) 92%, transparent)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
            border: '1px solid color-mix(in srgb, var(--color-neutral-700) 58%, transparent)',
            backdropFilter: 'blur(18px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <div className="text-center">
              <h2 
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--card-foreground)',
                  marginBottom: '0.5rem',
                }}
              >
                {t('login.welcome')}
              </h2>
              <p 
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                }}
              >
                {t('login.loginWithAcessoCidadao')}
              </p>
            </div>

            {/* Access Type Selection */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                width: '100%',
                marginBottom: '1rem',
              }}
              className="md:flex-row md:gap-4 md:w-auto"
            >
              <button
                onClick={() => {
                  setSelectedAccessType('cidadao');
                  handleLogin('cidadao');
                }}
                className="flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: getLoginOptionBackground('cidadao'),
                  color: getLoginOptionColor('cidadao'),
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: 'none',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  setLoginOptionHover(e.currentTarget, 'cidadao');
                }}
                onMouseLeave={(e) => {
                  resetLoginOption(e.currentTarget, 'cidadao');
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <UserCircle size={16} />
                <span>Cidadão</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAccessType('voluntario');
                  handleLogin('voluntario');
                }}
                className="flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: getLoginOptionBackground('voluntario'),
                  color: getLoginOptionColor('voluntario'),
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: 'none',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  setLoginOptionHover(e.currentTarget, 'voluntario');
                }}
                onMouseLeave={(e) => {
                  resetLoginOption(e.currentTarget, 'voluntario');
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <User size={16} />
                <span>{t('login.volunteer')}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAccessType('bolsista');
                  handleLogin('bolsista');
                }}
                className="flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: getLoginOptionBackground('bolsista'),
                  color: getLoginOptionColor('bolsista'),
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: 'none',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  setLoginOptionHover(e.currentTarget, 'bolsista');
                }}
                onMouseLeave={(e) => {
                  resetLoginOption(e.currentTarget, 'bolsista');
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <GraduationCap size={16} />
                <span>{t('login.scholar')}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAccessType('proponente');
                  handleLogin('proponente');
                }}
                className="flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: getLoginOptionBackground('proponente'),
                  color: getLoginOptionColor('proponente'),
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: 'none',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  setLoginOptionHover(e.currentTarget, 'proponente');
                }}
                onMouseLeave={(e) => {
                  resetLoginOption(e.currentTarget, 'proponente');
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Briefcase size={16} />
                <span>Proponente</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAccessType('coordenador');
                  handleLogin('coordenador');
                }}
                className="flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: getLoginOptionBackground('coordenador'),
                  color: getLoginOptionColor('coordenador'),
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: 'none',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  setLoginOptionHover(e.currentTarget, 'coordenador');
                }}
                onMouseLeave={(e) => {
                  resetLoginOption(e.currentTarget, 'coordenador');
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Users size={16} />
                <span>{t('login.coordinator')}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAccessType('avaliador');
                  // handleLogin('avaliador'); // Desabilitado - fluxo em construção
                }}
                className="flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: getLoginOptionBackground('avaliador'),
                  color: getLoginOptionColor('avaliador'),
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: 'none',
                  width: '100%',
                  opacity: 0.6,
                }}
                onMouseEnter={(e) => {
                  setLoginOptionHover(e.currentTarget, 'avaliador');
                }}
                onMouseLeave={(e) => {
                  resetLoginOption(e.currentTarget, 'avaliador');
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                disabled
              >
                <ClipboardCheck size={16} />
                <span>Avaliador</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAccessType('reitor');
                  handleLogin('reitor');
                }}
                className="flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: getLoginOptionBackground('reitor'),
                  color: getLoginOptionColor('reitor'),
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: 'none',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  setLoginOptionHover(e.currentTarget, 'reitor');
                }}
                onMouseLeave={(e) => {
                  resetLoginOption(e.currentTarget, 'reitor');
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Building size={16} />
                <span>Reitor e Diretor</span>
              </button>
            </div>

            {/* Info Text */}
            <div 
              className="text-center"
              style={{
                marginTop: '0.5rem',
              }}
            >
              <p 
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  lineHeight: '1.5',
                }}
              >
                {t('login.acessoCidadaoInfo')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
