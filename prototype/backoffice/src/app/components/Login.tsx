import React from 'react';
import conectaSymbol from 'figma:asset/db135b6708f6cc7f72f27c6a31dd02aa5500d030.png';
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
          background: 'radial-gradient(circle at 50% 24%, rgba(0, 193, 175, 0.32) 0%, rgba(10, 23, 42, 0.98) 46%, rgba(7, 13, 28, 1) 100%)',
          backgroundColor: '#07101f'
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Marca Conecta */}
        <div className="mb-12 flex items-center gap-5">
          <img
            src={conectaSymbol}
            alt=""
            aria-hidden="true"
            className="h-20 w-20 object-contain"
          />
          <span
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: '44px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            Conecta
          </span>
        </div>

        {/* Card de Login */}
        <div 
          className="w-full max-w-md rounded-lg p-10 shadow-2xl"
          style={{
            backgroundColor: 'rgba(17, 28, 48, 0.86)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.32)',
            backdropFilter: 'blur(18px)'
          }}
        >
          {/* Título */}
          <div className="mb-8 text-center">
            <h2 
              className="mb-2"
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: '28px',
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
                color: 'rgba(255, 255, 255, 0.72)'
              }}
            >
              Faça login usando sua conta do Acesso Cidadão
            </p>
          </div>

          {/* Botão Admin Fapes */}
          <button
            onClick={onLogin}
            className="group relative flex w-full items-center justify-center gap-3 rounded-lg px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.16)'
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
