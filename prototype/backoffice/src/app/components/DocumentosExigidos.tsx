import React, { useState } from 'react';
import { ArrowLeft, FileCheck2, Plus, Trash2 } from 'lucide-react';

interface DocumentosExigidosProps {
  onBack: () => void;
}

interface DocumentoExigidoItem {
  id: number;
  nome: string;
  descricao: string;
  formatos: string;
  obrigatorio: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(30, 41, 59, 0.7)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.7)',
  display: 'block',
  marginBottom: '6px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '22px',
};

export const DocumentosExigidos: React.FC<DocumentosExigidosProps> = ({ onBack }) => {
  const [documentos, setDocumentos] = useState<DocumentoExigidoItem[]>([
    { id: 1, nome: 'Currículo Lattes', descricao: 'Currículo atualizado do proponente.', formatos: 'PDF', obrigatorio: true },
    { id: 2, nome: 'Projeto da iniciativa', descricao: 'Documento técnico da proposta submetida.', formatos: 'PDF, DOCX', obrigatorio: true },
  ]);
  const [draft, setDraft] = useState({ nome: '', descricao: '', formatos: 'PDF', obrigatorio: true });

  const addDocumento = () => {
    if (!draft.nome.trim()) return;
    setDocumentos(prev => [...prev, { id: Date.now(), ...draft }]);
    setDraft({ nome: '', descricao: '', formatos: 'PDF', obrigatorio: true });
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px' }}>
          <button
            onClick={onBack}
            style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', backgroundColor: 'rgba(30,41,59,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck2 size={18} style={{ color: '#00c1af' }} />
          </div>
          <div style={{ flex: 1, marginTop: '4px' }}>
            <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: '#ffffff', margin: '0 0 8px' }}>
              Documentos Exigidos
            </h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Cadastre documentos reutilizáveis que podem ser exigidos dos proponentes em uma captação.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '18px' }}>
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 18px' }}>
              Novo Documento
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input value={draft.nome} onChange={e => setDraft(prev => ({ ...prev, nome: e.target.value }))} placeholder="Ex: Declaração de vínculo" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Descrição</label>
                <textarea value={draft.descricao} onChange={e => setDraft(prev => ({ ...prev, descricao: e.target.value }))} placeholder="Orientação para o proponente" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>Formatos permitidos</label>
                <input value={draft.formatos} onChange={e => setDraft(prev => ({ ...prev, formatos: e.target.value }))} placeholder="PDF, DOCX" style={inputStyle} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)' }}>
                <input type="checkbox" checked={draft.obrigatorio} onChange={e => setDraft(prev => ({ ...prev, obrigatorio: e.target.checked }))} />
                Documento obrigatório por padrão
              </label>
              <button type="button" onClick={addDocumento} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 18px', border: 'none', borderRadius: 'var(--radius)', backgroundColor: '#00c1af', color: '#0f172a', cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                <Plus size={16} />
                Adicionar
              </button>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 18px' }}>
              Base de Documentos
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {documentos.map(documento => (
                <div key={documento.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', gap: '14px', alignItems: 'center', padding: '14px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(15,23,42,0.45)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>{documento.nome}</div>
                    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{documento.descricao}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)' }}>
                    {documento.formatos} · {documento.obrigatorio ? 'Obrigatório' : 'Opcional'}
                  </div>
                  <button type="button" onClick={() => setDocumentos(prev => prev.filter(item => item.id !== documento.id))} style={{ border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', backgroundColor: 'transparent', padding: '9px', cursor: 'pointer' }}>
                    <Trash2 size={15} style={{ color: '#ef4444' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
