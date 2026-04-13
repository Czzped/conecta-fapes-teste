import React from 'react';
import logoFapes from 'figma:asset/affecf58de5f5168c562fa312b9d450b8432233b.png';
import { UserCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background com gradiente radial */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 193, 175, 0.4) 0%, rgba(15, 23, 43, 1) 70%)',
          backgroundColor: '#0f172b'
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo FAPES */}
        <div className="mb-12">
          <img 
            src={logoFapes} 
            alt="FAPES" 
            className="h-20 w-auto"
          />
        </div>

        {/* Card de Login */}
        <div 
          className="w-full max-w-md rounded-lg p-12 shadow-2xl"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Título */}
          <div className="mb-8 text-center">
            <h2 
              className="mb-2"
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-semibold)',
                color: '#ffffff'
              }}
            >
              Bem-vindo
            </h2>
            <p 
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              Faça login usando sua conta do Acesso Cidadão
            </p>
          </div>

          {/* Botão Admin Fapes */}
          <button
            onClick={onLogin}
            className="group relative flex w-full items-center justify-center gap-3 rounded-lg px-6 py-4 transition-all duration-200 hover:bg-white/10"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <UserCircle 
              className="transition-transform group-hover:scale-110" 
              style={{ 
                width: '20px', 
                height: '20px',
                color: '#ffffff'
              }} 
            />
            <span 
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#ffffff'
              }}
            >
              Admin Fapes
            </span>
          </button>

          {/* Texto explicativo */}
          <div className="mt-8 text-center">
            <p 
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: '1.6'
              }}
            >
              O Acesso Cidadão é o sistema oficial de autenticação
              <br />
              do Governo Federal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};