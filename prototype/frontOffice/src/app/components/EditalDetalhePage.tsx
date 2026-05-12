import { ArrowLeft, FileText } from 'lucide-react';
import { useState } from 'react';
import editalPdf from 'figma:asset/c454e09bf5c4ac7a664fc3442b7291d5bec3cf16.png';
import { InscricaoEditalFlow } from '@/app/components/InscricaoEditalFlow';

interface EditalDetalhePageProps {
  edital: {
    id: number;
    numero: string;
    titulo: string;
    descricao: string;
    prazo: string;
    status: string;
    modalidade: string;
    inscritos: number;
  };
  onBack: () => void;
}

export function EditalDetalhePage({ edital, onBack }: EditalDetalhePageProps) {
  const [showInscricao, setShowInscricao] = useState(false);

  if (showInscricao) {
    return (
      <InscricaoEditalFlow
        edital={edital}
        onBack={() => setShowInscricao(false)}
      />
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Header with Back Button and Inscrição Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-colors"
          style={{
            color: 'var(--primary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        <button
          className="px-6 py-2.5 transition-all"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
          }}
          onClick={() => setShowInscricao(true)}
        >
          Inscrição
        </button>
      </div>

      {/* Edital Info */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(8, 145, 178, 0.1)',
            }}
          >
            <FileText size={20} />
          </div>
          <span
            style={{
              color: 'var(--primary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            {edital.numero}
          </span>
        </div>
        <h1 
          style={{ 
            color: 'var(--foreground)',
            marginBottom: '0.5rem',
            marginLeft: '48px',
          }}
        >
          {edital.titulo}
        </h1>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--border)',
          marginBottom: '2rem',
        }}
      />

      {/* PDF Viewer */}
      <div
        style={{
          backgroundColor: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src={editalPdf}
          alt="Edital PDF"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}