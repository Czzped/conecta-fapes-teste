import React from 'react';
import { UserCircle } from 'lucide-react';
import logoFapes from '../../assets/logo-fapes.png';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <style>
        {`
          @keyframes fapesWaveBlue {
            0%, 100% { transform: translate3d(-1.5%, 0, 0); }
            50% { transform: translate3d(1.5%, 7px, 0); }
          }

          @keyframes fapesWaveGreen {
            0%, 100% { transform: translate3d(1.5%, 0, 0); }
            50% { transform: translate3d(-1.5%, -5px, 0); }
          }
        `}
      </style>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 pb-40 pt-12">
        <section className="mb-8 flex w-full max-w-[420px] flex-col items-center text-center">
          <img
            src={logoFapes}
            alt="FAPES"
            className="mb-8 h-auto w-[260px] max-w-full"
          />

          <h1
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: '24px',
              color: '#173b8f',
              margin: 0,
              fontWeight: 'var(--font-weight-semibold)',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            Bem-vindo ao Conecta FAPES
          </h1>
        </section>

        <section
          className="mx-auto w-full max-w-[420px] rounded-lg p-10"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 28px 90px rgba(15, 23, 42, 0.14)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-semibold)',
              color: '#1f2937',
              margin: '0 0 28px',
              textAlign: 'center',
            }}
          >
            Acesse sua conta
          </h2>

          <button
            type="button"
            onClick={onLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-md px-5 py-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: '#27348b',
              border: '1px solid #27348b',
              color: '#ffffff',
              boxShadow: '0 14px 28px rgba(39, 52, 139, 0.24)',
            }}
          >
            <UserCircle
              size={20}
              className="transition-transform duration-200 group-hover:scale-105"
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Entrar com Acesso Cidadão
            </span>
          </button>

          <p
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: '#64748b',
              lineHeight: 1.55,
              margin: '24px 0 0',
              textAlign: 'center',
            }}
          >
            O Acesso Cidadão é o sistema oficial de autenticação do Governo Federal.
          </p>
        </section>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          left: '-3%',
          right: '-3%',
          bottom: '-2px',
          width: '106%',
          height: '32vh',
          minHeight: '190px',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M0,114 C160,40 284,72 430,122 C590,176 744,194 920,142 C1090,92 1248,64 1440,102 L1440,260 L0,260 Z"
          fill="#083f8f"
          style={{ animation: 'fapesWaveBlue 6.5s ease-in-out infinite' }}
        />
        <path
          d="M0,217 C165,174 268,201 424,204 C596,207 698,152 872,174 C1042,195 1168,238 1440,194 L1440,260 L0,260 Z"
          fill="#b5dc1f"
          style={{ animation: 'fapesWaveGreen 5.5s ease-in-out infinite' }}
        />
      </svg>
    </div>
  );
};
