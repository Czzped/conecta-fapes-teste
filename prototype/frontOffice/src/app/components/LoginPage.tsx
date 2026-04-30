import { User, UserCircle, GraduationCap, Users, Briefcase, Building, ClipboardCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

import backgroundImage from 'figma:asset/57dfbf595eb8fd2b733bc4ff608d932fd65501c6.png';
import fapesLogo from 'figma:asset/aec6ed8eb7cf2782d52002e0d4c19150c79afd78.png';

interface LoginPageProps {
  onLogin: (accessType: AccessType) => void;
}

type AccessType = 'cidadao' | 'voluntario' | 'bolsista' | 'coordenador' | 'avaliador' | 'diretor' | 'reitor';

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

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: 'var(--background)',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '1rem',
      }}
    >
      <div 
        className="w-full max-w-md"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
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
          className="w-full px-6 py-8 md:p-8"
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--elevation-sm)',
            border: '1px solid var(--border)',
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
                  backgroundColor: selectedAccessType === 'cidadao' ? 'var(--primary)' : 'var(--card)',
                  color: selectedAccessType === 'cidadao' ? 'var(--primary-foreground)' : 'var(--card-foreground)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#06b6d4';
                  e.currentTarget.style.color = 'var(--background)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedAccessType === 'cidadao' ? 'var(--primary)' : 'var(--card)';
                  e.currentTarget.style.color = selectedAccessType === 'cidadao' ? 'var(--primary-foreground)' : 'var(--card-foreground)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
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
                  backgroundColor: selectedAccessType === 'voluntario' ? 'var(--primary)' : 'var(--card)',
                  color: selectedAccessType === 'voluntario' ? 'var(--primary-foreground)' : 'var(--card-foreground)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#06b6d4';
                  e.currentTarget.style.color = 'var(--background)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedAccessType === 'voluntario' ? 'var(--primary)' : 'var(--card)';
                  e.currentTarget.style.color = selectedAccessType === 'voluntario' ? 'var(--primary-foreground)' : 'var(--card-foreground)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
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
                  backgroundColor: selectedAccessType === 'bolsista' ? 'var(--primary)' : 'var(--card)',
                  color: selectedAccessType === 'bolsista' ? 'var(--primary-foreground)' : 'var(--card-foreground)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#06b6d4';
                  e.currentTarget.style.color = 'var(--background)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedAccessType === 'bolsista' ? 'var(--primary)' : 'var(--card)';
                  e.currentTarget.style.color = selectedAccessType === 'bolsista' ? 'var(--primary-foreground)' : 'var(--card-foreground)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
              >
                <GraduationCap size={16} />
                <span>{t('login.scholar')}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAccessType('coordenador');
                  handleLogin('coordenador');
                }}
                className="flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: selectedAccessType === 'coordenador' ? 'var(--primary)' : 'var(--card)',
                  color: selectedAccessType === 'coordenador' ? 'var(--primary-foreground)' : 'var(--card-foreground)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#06b6d4';
                  e.currentTarget.style.color = 'var(--background)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedAccessType === 'coordenador' ? 'var(--primary)' : 'var(--card)';
                  e.currentTarget.style.color = selectedAccessType === 'coordenador' ? 'var(--primary-foreground)' : 'var(--card-foreground)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
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
                  backgroundColor: selectedAccessType === 'avaliador' ? 'var(--primary)' : 'var(--card)',
                  color: selectedAccessType === 'avaliador' ? 'var(--primary-foreground)' : 'var(--card-foreground)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  width: '100%',
                  opacity: 0.6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#06b6d4';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedAccessType === 'avaliador' ? 'var(--primary)' : 'var(--card)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
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
                  backgroundColor: selectedAccessType === 'reitor' ? 'var(--primary)' : 'var(--card)',
                  color: selectedAccessType === 'reitor' ? 'var(--primary-foreground)' : 'var(--card-foreground)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#06b6d4';
                  e.currentTarget.style.color = 'var(--background)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedAccessType === 'reitor' ? 'var(--primary)' : 'var(--card)';
                  e.currentTarget.style.color = selectedAccessType === 'reitor' ? 'var(--primary-foreground)' : 'var(--card-foreground)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
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