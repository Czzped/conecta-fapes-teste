import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Home, Plus, Save, Search, Send, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onBack: () => void;
}

interface Documento {
  id: number;
  tipo: string;
  arquivo: string;
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
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.7)',
  display: 'block',
  marginBottom: '6px',
};

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: '#ffffff',
  margin: '0 0 4px',
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.5)',
  margin: '0 0 24px',
};

const parseCurrencyValue = (value: string) => Number(value.replace(/\./g, '').replace(',', '.')) || 0;

const formatCurrency = (value: number) => (
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);

const formatPercent = (value: number) => (
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
);

const calcularPercentualAcaoTransversal = (valor: number) => {
  if (valor < 50000) return 0;
  if (valor <= 2000000) return 5;
  if (valor <= 5000000) return 4;
  return 3;
};

const definirFaixaAcaoTransversal = (valor: number) => {
  if (valor < 50000) return 'Sem retenção';
  if (valor <= 2000000) return 'Faixa 1';
  if (valor <= 5000000) return 'Faixa 2';
  return 'Faixa 3';
};

const SelectField: React.FC<{
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ color: value ? '#ffffff' : 'rgba(255,255,255,0.3)' }}>
          {value ? options.find(o => o.value === value)?.label : (placeholder || 'Selecione...')}
        </span>
        <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
          backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius)', zIndex: 300, overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxHeight: '240px', overflowY: 'auto',
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none',
                backgroundColor: value === opt.value ? 'rgba(0,193,175,0.1)' : 'transparent',
                color: value === opt.value ? '#00c1af' : '#ffffff',
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchableInstitutionField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; cnpj: string }[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find(o => o.value === value);
  const normalizedQuery = query.toLowerCase().replace(/\D/g, '');
  const filtered = options.filter(option => {
    const labelMatch = option.label.toLowerCase().includes(query.toLowerCase());
    const cnpjMatch = option.cnpj.replace(/\D/g, '').includes(normalizedQuery);
    return query.length === 0 || labelMatch || cnpjMatch;
  });

  return (
    <div style={{ position: 'relative' }}>
      <label style={labelStyle}>{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ color: selected ? '#ffffff' : 'rgba(255,255,255,0.3)' }}>
          {selected ? `${selected.label} · ${selected.cnpj}` : (placeholder || 'Busque por nome ou CNPJ')}
        </span>
        <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '100%',
          backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius)', zIndex: 350, overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          <div style={{ position: 'relative', padding: '10px' }}>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Digite nome ou CNPJ"
              style={{ ...inputStyle, paddingLeft: '36px', backgroundColor: 'rgba(15,23,42,0.8)' }}
            />
            <Search size={15} style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          </div>
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {filtered.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setQuery('');
                  setOpen(false);
                }}
                style={{
                  width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none',
                  backgroundColor: value === opt.value ? 'rgba(0,193,175,0.1)' : 'transparent',
                  color: value === opt.value ? '#00c1af' : '#ffffff',
                  fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
                }}
              >
                <span style={{ display: 'block' }}>{opt.label}</span>
                <span style={{ display: 'block', marginTop: '3px', color: 'rgba(255,255,255,0.45)', fontSize: 'var(--text-xs)' }}>
                  CNPJ {opt.cnpj}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '12px 14px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)' }}>
                Nenhuma instituição encontrada.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const FormularioParceria: React.FC<Props> = ({ onBack }) => {
  const [nomeParceria, setNomeParceria] = useState('');
  const [instituicaoVinculada, setInstituicaoVinculada] = useState('');
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [dataAssinatura, setDataAssinatura] = useState('');
  const [dataVigenciaInicio, setDataVigenciaInicio] = useState('');
  const [dataVigenciaFim, setDataVigenciaFim] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [valorAporteOriginal, setValorAporteOriginal] = useState('');
  const [dataAporteOriginal, setDataAporteOriginal] = useState('');
  const [contaBancariaDestino, setContaBancariaDestino] = useState('');
  const [contaBancariaAcaoTransversal, setContaBancariaAcaoTransversal] = useState('');
  const [documentos, setDocumentos] = useState<Documento[]>([{ id: 1, tipo: '', arquivo: '' }]);
  const valorAporteOriginalNumerico = parseCurrencyValue(valorAporteOriginal);
  const percentualAcaoTransversal = calcularPercentualAcaoTransversal(valorAporteOriginalNumerico);
  const faixaAcaoTransversal = definirFaixaAcaoTransversal(valorAporteOriginalNumerico);
  const valorReservaAcaoTransversal = valorAporteOriginalNumerico * percentualAcaoTransversal / 100;
  const saldoAlocavelEmProgramas = Math.max(valorAporteOriginalNumerico - valorReservaAcaoTransversal, 0);

  const instituicoesOptions = [
    { value: 'ufes', label: 'Universidade Federal do Espírito Santo (Ufes)', cnpj: '32.479.123/0001-43' },
    { value: 'ifes', label: 'Instituto Federal do Espírito Santo (Ifes)', cnpj: '10.838.653/0001-06' },
    { value: 'cnpq', label: 'Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq)', cnpj: '33.654.831/0001-36' },
    { value: 'fapesp', label: 'Fundação de Amparo à Pesquisa do Estado de São Paulo (Fapesp)', cnpj: '43.828.151/0001-45' },
    { value: 'ufmg', label: 'Universidade Federal de Minas Gerais (UFMG)', cnpj: '17.217.985/0001-04' },
    { value: 'usp', label: 'Universidade de São Paulo (USP)', cnpj: '63.025.530/0001-04' },
    { value: 'capes', label: 'Coordenação de Aperfeiçoamento de Pessoal de Nível Superior (Capes)', cnpj: '00.889.834/0001-08' },
  ];

  const documentoOptions = [
    { value: 'termo-cooperacao', label: 'Termo de Cooperação' },
    { value: 'termo-descentralizacao', label: 'Termo de Descentralização' },
  ];

  const addDocumento = () => {
    setDocumentos(prev => [...prev, { id: Date.now(), tipo: '', arquivo: '' }]);
  };

  const updateDocumento = (id: number, field: 'tipo' | 'arquivo', value: string) => {
    setDocumentos(prev => prev.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '88px',
    lineHeight: '1.6',
  };

  const handleSalvarElaboracao = () => {
    toast.success('Parceria salva em elaboração.');
    setTimeout(onBack, 800);
  };

  const handleFormalizarParceria = () => {
    toast.success('Parceria formalizada como vigente.');
    setTimeout(onBack, 800);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}
          >
            Parcerias
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
            Nova Parceria
          </span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={18} style={{ color: '#00c1af' }} />
            </div>
            <div style={{ flex: 1, marginTop: '6px' }}>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px' }}>
                Nova Parceria
              </h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Registre a solicitação, a instituição única, a vigência original e o aporte financeiro da parceria.
              </p>
            </div>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '20px' }} />
        </div>

        <Section number="1" title="Identificação da Parceria" subtitle="Dados básicos da solicitação e do processo administrativo">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Field label="Nome da Parceria" value={nomeParceria} onChange={setNomeParceria} placeholder="Digite o nome da parceria" />
            <Field label="Número do Processo" value={numeroProcesso} onChange={setNumeroProcesso} placeholder="Ex: 2026-AB12F" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <SearchableInstitutionField
              label="Instituição vinculada"
              value={instituicaoVinculada}
              onChange={setInstituicaoVinculada}
              options={instituicoesOptions}
              placeholder="Busque por nome ou CNPJ"
            />
          </div>
          <label style={labelStyle}>Objetivo</label>
          <textarea
            placeholder="Descreva o objetivo da parceria"
            value={objetivo}
            onChange={e => setObjetivo(e.target.value)}
            style={textareaStyle}
          />
        </Section>

        <Section number="2" title="Vigência Original" subtitle="Período inicial de validade da parceria">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <DateField label="Data da Assinatura" value={dataAssinatura} onChange={setDataAssinatura} />
            <DateField label="Início da Vigência" value={dataVigenciaInicio} onChange={setDataVigenciaInicio} />
            <DateField label="Fim da Vigência" value={dataVigenciaFim} onChange={setDataVigenciaFim} />
          </div>
        </Section>

        <Section number="3" title="Aporte Financeiro Original" subtitle="Valor investido pela instituição vinculada e conta de destino">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Field label="Valor do Aporte Original (R$)" value={valorAporteOriginal} onChange={setValorAporteOriginal} placeholder="Ex: 1.000.000,00" />
            <DateField label="Data do Aporte" value={dataAporteOriginal} onChange={setDataAporteOriginal} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px', marginBottom: '16px', padding: '16px', border: '1px solid rgba(245,158,11,0.28)', borderRadius: '8px', backgroundColor: 'rgba(245,158,11,0.08)' }}>
            <Metric label="Política" value="Res. CCAF 334/2023" />
            <Metric label="Faixa aplicada" value={faixaAcaoTransversal} />
            <Metric label="Percentual Ação Transversal" value={formatPercent(percentualAcaoTransversal)} />
            <Metric label="Reserva Ação Transversal" value={formatCurrency(valorReservaAcaoTransversal)} highlight />
            <Metric label="Saldo alocável em programas" value={formatCurrency(saldoAlocavelEmProgramas)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Conta Bancária de Destino da Parceria" value={contaBancariaDestino} onChange={setContaBancariaDestino} placeholder="Banco / agência / conta" />
            <Field label="Conta Ação Transversal" value={contaBancariaAcaoTransversal} onChange={setContaBancariaAcaoTransversal} placeholder="BANESTES / agência / conta específica" />
          </div>
        </Section>

        <Section number="4" title="Documentos" subtitle="Documentos que sustentam a formalização da parceria">
          {documentos.map((documento, index) => (
            <div key={documento.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
                <UploadField
                  label={index === 0 ? 'Arquivo' : 'Arquivo'}
                  fileName={documento.arquivo}
                  onChange={(fileName) => updateDocumento(documento.id, 'arquivo', fileName)}
                />
                <SelectField
                  label={index === 0 ? 'Classificação do documento' : 'Classificação do documento'}
                  value={documento.tipo}
                  onChange={(v) => updateDocumento(documento.id, 'tipo', v)}
                  options={documentoOptions}
                  placeholder="Classifique o documento"
                />
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addDocumento}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid rgba(0,193,175,0.4)', borderRadius: 'var(--radius)', padding: '8px 14px', color: '#00c1af', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
            >
              <Plus size={14} />
              Adicionar Documento
            </button>
          </div>
        </Section>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={handleSalvarElaboracao}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius)', color: '#ffffff', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
          >
            <Save size={16} />
            Salvar em elaboração
          </button>
          <button
            onClick={handleFormalizarParceria}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#00c1af', border: 'none', borderRadius: 'var(--radius)', color: '#0f172a', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}
          >
            <Send size={16} />
            Formalizar parceria
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ number: string; title: string; subtitle: string; children: React.ReactNode }> = ({ number, title, subtitle, children }) => (
  <div style={sectionCardStyle}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>{number}</span>
      </div>
      <p style={sectionTitleStyle}>{title}</p>
    </div>
    <p style={sectionSubtitleStyle}>{subtitle}</p>
    {children}
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
  </div>
);

const Metric: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>{label}</div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: highlight ? '#f59e0b' : '#ffffff', fontWeight: highlight ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', margin: 0 }}>
      {value}
    </p>
  </div>
);

const DateField: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="date" value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
  </div>
);

const UploadField: React.FC<{ label: string; fileName: string; onChange: (fileName: string) => void }> = ({ label, fileName, onChange }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <label
      style={{
        ...inputStyle,
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        cursor: 'pointer',
        color: fileName ? '#ffffff' : 'rgba(255,255,255,0.45)',
      }}
    >
      <span>{fileName || 'Selecionar arquivo'}</span>
      <Upload size={15} style={{ color: '#00c1af', flexShrink: 0 }} />
      <input
        type="file"
        accept=".pdf,.doc,.docx,.odt"
        onChange={event => onChange(event.target.files?.[0]?.name || '')}
        style={{ display: 'none' }}
      />
    </label>
  </div>
);
