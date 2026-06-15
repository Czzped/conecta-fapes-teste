import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Search, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useThemeTokens } from '../theme/ThemeContext';

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
  backgroundColor: 'var(--form-input-bg)',
  border: '1px solid var(--form-border)',
  borderRadius: 'var(--radius)',
  padding: '10px 14px',
  color: 'var(--form-text-primary)',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'var(--form-text-secondary)',
  display: 'block',
  marginBottom: '6px',
};

const RequiredLabel: React.FC<{ label: string; required?: boolean }> = ({ label, required = true }) => (
  <label style={labelStyle}>
    {label}
    {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
  </label>
);

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--form-card-bg)',
  border: '1px solid var(--form-border)',
  borderRadius: '10px',
  padding: '28px',
  marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--form-text-primary)',
  margin: '0 0 4px',
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'var(--form-text-muted)',
  margin: '0 0 24px 32px',
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
  required?: boolean;
}> = ({ label, value, onChange, options, placeholder, required = true }) => {
  const { T } = useThemeTokens();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {label && <RequiredLabel label={label} required={required} />}
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
          backgroundColor: T.bgSurface, border: `1px solid ${T.borderDefault}`,
          borderRadius: 'var(--radius)', zIndex: 300, overflow: 'hidden',
          boxShadow: T.shadowMd, maxHeight: '240px', overflowY: 'auto',
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none',
                backgroundColor: value === opt.value ? T.accentSoft : 'transparent',
                color: value === opt.value ? T.accent : T.textPrimary,
                fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = T.bgHover; }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
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
  required?: boolean;
}> = ({ label, value, onChange, options, placeholder, required = true }) => {
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
      <RequiredLabel label={label} required={required} />
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
              style={{ ...inputStyle, paddingLeft: '36px', backgroundColor: 'var(--form-input-bg)' }}
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
  const { T } = useThemeTokens();
  const [nomeParceria, setNomeParceria] = useState('');
  const [instituicaoVinculada, setInstituicaoVinculada] = useState('');
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [ano, setAno] = useState('');
  const [dataAssinatura, setDataAssinatura] = useState('');
  const [dataVigenciaInicio, setDataVigenciaInicio] = useState('');
  const [dataVigenciaFim, setDataVigenciaFim] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [valorAporteOriginal, setValorAporteOriginal] = useState('');
  const [dataAporteOriginal, setDataAporteOriginal] = useState('');
  const [contaBancariaDestino, setContaBancariaDestino] = useState('');
  const [contaBancariaAcaoTransversal, setContaBancariaAcaoTransversal] = useState('');
  const [documentos, setDocumentos] = useState<Documento[]>([{ id: 1, tipo: '', arquivo: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingFormalizar, setIsConfirmingFormalizar] = useState(false);
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
    setIsLoading(true);
    toast.success('Parceria salva como rascunho.');
    setTimeout(() => { setIsLoading(false); onBack(); }, 800);
  };

  const handleFormalizarParceria = () => {
    setIsConfirmingFormalizar(true);
  };

  const handleConfirmFormalizar = () => {
    setIsConfirmingFormalizar(false);
    setIsLoading(true);
    toast.success('Parceria formalizada como ativa.');
    setTimeout(() => { setIsLoading(false); onBack(); }, 800);
  };

  return (
    <div
      style={{
        backgroundColor: T.bgPage,
        minHeight: '100vh',
        '--form-card-bg': T.bgCard,
        '--form-input-bg': T.bgInput,
        '--form-border': T.borderDefault,
        '--form-text-primary': T.textPrimary,
        '--form-text-secondary': T.textSecondary,
        '--form-text-muted': T.textMuted,
      } as React.CSSProperties}
    >
      <div className="pt-8 px-8 pb-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)' }}
          >
            Parcerias
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
            Criar Parceira
          </span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={18} style={{ color: '#00c1af' }} />
            </div>
            <div style={{ flex: 1, marginTop: '6px' }}>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 4px' }}>
                Criar Parceria
              </h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: 0 }}>
                Registre a solicitação, a instituição única, a vigência original e o aporte financeiro da parceria.
              </p>
            </div>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '20px' }} />
        </div>

        <Section number="1" title="Identificação da Parceria" subtitle="Dados básicos da solicitação e do processo administrativo">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.6fr', gap: '16px', marginBottom: '16px' }}>
            <Field label="Nome da Parceria" value={nomeParceria} onChange={setNomeParceria} placeholder="Digite o nome da parceria" />
            <Field label="Número do Processo" value={numeroProcesso} onChange={setNumeroProcesso} placeholder="Ex: 2026-AB12F" />
            <Field label="Ano" value={ano} onChange={setAno} placeholder="2026" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <SearchableInstitutionField
              label="Instituição Parceira"
              value={instituicaoVinculada}
              onChange={setInstituicaoVinculada}
              options={instituicoesOptions}
              placeholder="Busque por nome ou CNPJ"
            />
          </div>
          <RequiredLabel label="Objetivo" />
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '16px', padding: '16px', border: '1px solid rgba(0,193,175,0.28)', borderRadius: '8px', backgroundColor: 'rgba(0,193,175,0.08)' }}>
            <Metric label="Faixa aplicada" value={faixaAcaoTransversal} />
            <Metric label="Percentual Ação Transversal" value={formatPercent(percentualAcaoTransversal)} />
            <Metric label="Reserva Ação Transversal" value={formatCurrency(valorReservaAcaoTransversal)} />
            <Metric label="Saldo alocável em programas" value={formatCurrency(saldoAlocavelEmProgramas)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Conta Bancária de Destino da Parceria" value={contaBancariaDestino} onChange={setContaBancariaDestino} placeholder="Banco / agência / conta" required={false} />
            <Field label="Conta Ação Transversal" value={contaBancariaAcaoTransversal} onChange={setContaBancariaAcaoTransversal} placeholder="BANESTES / agência / conta específica" required={false} />
          </div>
        </Section>

        <Section number="4" title="Documentos" subtitle="Documentos que sustentam a formalização da parceria">
          {documentos.map((documento, index) => (
            <div key={documento.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
                <SelectField
                  label="Classificação do Documento"
                  value={documento.tipo}
                  onChange={(v) => updateDocumento(documento.id, 'tipo', v)}
                  options={documentoOptions}
                  placeholder="Classifique o documento"
                />
                <UploadField
                  label="Arquivo"
                  fileName={documento.arquivo}
                  onChange={(fileName) => updateDocumento(documento.id, 'arquivo', fileName)}
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
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius)', color: 'var(--form-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? 'Salvando...' : 'Salvar Rascunho'}
          </button>
          <button
            onClick={handleFormalizarParceria}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#00c1af', border: 'none', borderRadius: 'var(--radius)', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
          >
            Ativar Parceria
          </button>
        </div>

        {isConfirmingFormalizar && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500 }}>
            <div style={{ backgroundColor: 'var(--form-card-bg)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '28px', maxWidth: '440px', width: '90%' }}>
              <h3 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: 'var(--form-text-primary)', margin: '0 0 12px' }}>
                Ativar Parceria
              </h3>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--form-text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
                Esta ação tornará a parceria <strong style={{ color: '#00c1af' }}>{nomeParceria || 'sem nome'}</strong> ativa e não poderá ser desfeita. Confirmar?
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setIsConfirmingFormalizar(false)}
                  style={{ padding: '8px 18px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius)', color: 'var(--form-text-primary)', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmFormalizar}
                  style={{ padding: '8px 18px', backgroundColor: '#00c1af', border: 'none', borderRadius: 'var(--radius)', color: '#171717', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}
                >
                  Confirmar Ativação
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{ number: string; title: string; subtitle: string; children: React.ReactNode }> = ({ number, title, subtitle, children }) => (
  <div style={sectionCardStyle}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#171717' }}>{number}</span>
      </div>
      <p style={sectionTitleStyle}>{title}</p>
    </div>
    <p style={sectionSubtitleStyle}>{subtitle}</p>
    {children}
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }> = ({ label, value, onChange, placeholder, required = true }) => (
  <div>
    <RequiredLabel label={label} required={required} />
    <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
  </div>
);

const Metric: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value }) => (
  <div>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--form-text-muted)', marginBottom: '5px' }}>{label}</div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-normal)', margin: 0 }}>
      {value}
    </p>
  </div>
);

const DateField: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <RequiredLabel label={label} />
    <input type="date" value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
  </div>
);

const UploadField: React.FC<{ label: string; fileName: string; onChange: (fileName: string) => void }> = ({ label, fileName, onChange }) => (
  <div>
    <RequiredLabel label={label} />
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
