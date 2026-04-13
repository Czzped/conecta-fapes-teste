import React, { useState } from 'react';
import { ChevronRight, Home, Save, Plus, Trash2, ChevronDown } from 'lucide-react';

interface Props {
  onBack: () => void;
}

interface Unidade {
  id: number;
  nomeUnidade: string;
  sigla: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  cnpj: string;
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
      {label && label.length > 0 && <label style={labelStyle}>{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          ...inputStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ color: value ? '#ffffff' : 'rgba(255,255,255,0.3)' }}>
          {value ? options.find((o) => o.value === value)?.label : placeholder || 'Selecione...'}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: 'rgba(255,255,255,0.4)',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 'var(--radius)',
            zIndex: 300,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: value === opt.value ? 'rgba(0,193,175,0.1)' : 'transparent',
                color: value === opt.value ? '#00c1af' : '#ffffff',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent';
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

export const FormularioInstituicaoParceira: React.FC<Props> = ({ onBack }) => {
  // Card 1 - Dados da Instituição
  const [instituicao, setInstituicao] = useState('');
  const [siglaInstituicao, setSiglaInstituicao] = useState('');
  const [emailInstituicao, setEmailInstituicao] = useState('');
  const [telefoneInstituicao, setTelefoneInstituicao] = useState('');
  const [enderecoInstituicao, setEnderecoInstituicao] = useState('');
  const [bairroInstituicao, setBairroInstituicao] = useState('');
  const [cidadeInstituicao, setCidadeInstituicao] = useState('');
  const [ufInstituicao, setUfInstituicao] = useState('');
  const [cepInstituicao, setCepInstituicao] = useState('');
  const [cnpjInstituicao, setCnpjInstituicao] = useState('');
  const [naturezaJuridica, setNaturezaJuridica] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoOutro, setTipoOutro] = useState('');
  const [finalidade, setFinalidade] = useState('');

  // Card 2 - Dados Pessoais do Dirigente
  const [nomeDirigente, setNomeDirigente] = useState('');
  const [cpfDirigente, setCpfDirigente] = useState('');
  const [nomeCargo, setNomeCargo] = useState('');
  const [validadeMandato, setValidadeMandato] = useState('');
  const [emailDirigente, setEmailDirigente] = useState('');
  const [celularDirigente, setCelularDirigente] = useState('');
  const [enderecoDirigente, setEnderecoDirigente] = useState('');
  const [bairroDirigente, setBairroDirigente] = useState('');
  const [cidadeDirigente, setCidadeDirigente] = useState('');
  const [ufDirigente, setUfDirigente] = useState('');
  const [cepDirigente, setCepDirigente] = useState('');
  const [cadastroConecta, setCadastroConecta] = useState('');
  const [cadastroAcessoCidadao, setCadastroAcessoCidadao] = useState('');

  // Card 3 - Dados das Unidades
  const [unidades, setUnidades] = useState<Unidade[]>([
    {
      id: 1,
      nomeUnidade: '',
      sigla: '',
      email: '',
      telefone: '',
      endereco: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
      cnpj: '',
    },
  ]);

  const tipoOptions = [
    { value: 'ensino_basico', label: 'Ensino Básico' },
    { value: 'ensino_superior', label: 'Ensino Superior/Pesquisa' },
    { value: 'empresa', label: 'Empresa' },
    { value: 'outro', label: 'Outro' },
  ];

  const finalidadeOptions = [
    { value: 'com_fins', label: 'Com Fins Lucrativos' },
    { value: 'sem_fins', label: 'Sem Fins Lucrativos' },
  ];

  const simNaoOptions = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
  ];

  const addUnidade = () => {
    setUnidades([
      ...unidades,
      {
        id: Date.now(),
        nomeUnidade: '',
        sigla: '',
        email: '',
        telefone: '',
        endereco: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
        cnpj: '',
      },
    ]);
  };

  const removeUnidade = (id: number) => {
    setUnidades(unidades.filter((u) => u.id !== id));
  };

  const updateUnidade = (id: number, field: keyof Unidade, value: string) => {
    setUnidades(unidades.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Projetos
          </span>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Formulário
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              color: '#00c1af',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Instituição Parceira
          </span>
        </div>

        {/* Título da tela */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'rgba(0,193,175,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Plus size={18} style={{ color: '#00c1af' }} />
            </div>
            <div style={{ flex: 1, marginTop: '6px' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-md)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: '#ffffff',
                  margin: '0 0 4px',
                }}
              >
                Instituição Parceira
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                }}
              >
                Preencha as informações da instituição parceira.
              </p>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              marginTop: '20px',
            }}
          />
        </div>

        {/* Card 1: Dados da Instituição */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#00c1af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-medium)',
                  color: '#0f172a',
                }}
              >
                1
              </span>
            </div>
            <p style={sectionTitleStyle}>Dados da Instituição</p>
          </div>
          <p style={sectionSubtitleStyle}></p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Instituição</label>
              <input
                type="text"
                placeholder="Nome da instituição"
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Sigla</label>
              <input
                type="text"
                placeholder="Ex: UFES"
                value={siglaInstituicao}
                onChange={(e) => setSiglaInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input
                type="email"
                placeholder="contato@instituicao.br"
                value={emailInstituicao}
                onChange={(e) => setEmailInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Telefone</label>
              <input
                type="tel"
                placeholder="(27) 9999-9999"
                value={telefoneInstituicao}
                onChange={(e) => setTelefoneInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Endereço</label>
              <input
                type="text"
                placeholder="Rua, número"
                value={enderecoInstituicao}
                onChange={(e) => setEnderecoInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Bairro</label>
              <input
                type="text"
                placeholder="Bairro"
                value={bairroInstituicao}
                onChange={(e) => setBairroInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Cidade</label>
              <input
                type="text"
                placeholder="Cidade"
                value={cidadeInstituicao}
                onChange={(e) => setCidadeInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>UF</label>
              <input
                type="text"
                placeholder="ES"
                value={ufInstituicao}
                onChange={(e) => setUfInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>CEP</label>
              <input
                type="text"
                placeholder="00000-000"
                value={cepInstituicao}
                onChange={(e) => setCepInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>CNPJ</label>
              <input
                type="text"
                placeholder="00.000.000/0000-00"
                value={cnpjInstituicao}
                onChange={(e) => setCnpjInstituicao(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Natureza Jurídica</label>
              <input
                type="text"
                placeholder="Ex: Autarquia Federal"
                value={naturezaJuridica}
                onChange={(e) => setNaturezaJuridica(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: tipo === 'outro' ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '16px' }}>
            <SelectField label="Tipo" value={tipo} onChange={setTipo} options={tipoOptions} placeholder="Selecione o tipo" />
            {tipo === 'outro' && (
              <div>
                <label style={labelStyle}>Especificar</label>
                <input
                  type="text"
                  placeholder="Digite o tipo"
                  value={tipoOutro}
                  onChange={(e) => setTipoOutro(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>
            )}
          </div>

          <div>
            <SelectField
              label="Finalidade"
              value={finalidade}
              onChange={setFinalidade}
              options={finalidadeOptions}
              placeholder="Selecione a finalidade"
            />
          </div>
        </div>

        {/* Card 2: Dados Pessoais do Dirigente */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#00c1af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-medium)',
                  color: '#0f172a',
                }}
              >
                2
              </span>
            </div>
            <p style={sectionTitleStyle}>Dados Pessoais do Dirigente</p>
          </div>
          <p style={sectionSubtitleStyle}>Informações do dirigente máximo da instituição</p>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Nome Completo</label>
              <input
                type="text"
                placeholder="Nome completo do dirigente"
                value={nomeDirigente}
                onChange={(e) => setNomeDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpfDirigente}
                onChange={(e) => setCpfDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Nome do Cargo</label>
              <input
                type="text"
                placeholder="Ex: Reitor"
                value={nomeCargo}
                onChange={(e) => setNomeCargo(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Validade do Mandato</label>
              <input
                type="date"
                value={validadeMandato}
                onChange={(e) => setValidadeMandato(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input
                type="email"
                placeholder="dirigente@email.com"
                value={emailDirigente}
                onChange={(e) => setEmailDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Celular</label>
              <input
                type="tel"
                placeholder="(27) 99999-9999"
                value={celularDirigente}
                onChange={(e) => setCelularDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Endereço Residencial</label>
              <input
                type="text"
                placeholder="Rua, número"
                value={enderecoDirigente}
                onChange={(e) => setEnderecoDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Bairro</label>
              <input
                type="text"
                placeholder="Bairro"
                value={bairroDirigente}
                onChange={(e) => setBairroDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Cidade</label>
              <input
                type="text"
                placeholder="Cidade"
                value={cidadeDirigente}
                onChange={(e) => setCidadeDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>UF</label>
              <input
                type="text"
                placeholder="ES"
                value={ufDirigente}
                onChange={(e) => setUfDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
            <div>
              <label style={labelStyle}>CEP</label>
              <input
                type="text"
                placeholder="00000-000"
                value={cepDirigente}
                onChange={(e) => setCepDirigente(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <SelectField
              label="Possui Cadastro no Conecta?"
              value={cadastroConecta}
              onChange={setCadastroConecta}
              options={simNaoOptions}
              placeholder="Selecione"
            />
            <SelectField
              label="Possui Cadastro no Acesso Cidadão?"
              value={cadastroAcessoCidadao}
              onChange={setCadastroAcessoCidadao}
              options={simNaoOptions}
              placeholder="Selecione"
            />
          </div>
        </div>

        {/* Card 3: Dados das Unidades Vinculadas */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#00c1af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: '#0f172a',
                  }}
                >
                  3
                </span>
              </div>
              <p style={sectionTitleStyle}>Dados das Unidades Vinculadas à Instituição</p>
            </div>
            <button
              type="button"
              onClick={addUnidade}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(0,193,175,0.4)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: '#00c1af',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)';
                e.currentTarget.style.borderColor = '#00c1af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)';
              }}
            >
              <Plus size={14} />
              Adicionar Unidade
            </button>
          </div>
          <p style={sectionSubtitleStyle}>Informações dos centros e campi</p>

          {unidades.map((unidade, index) => (
            <div key={unidade.id} style={{ marginBottom: index < unidades.length - 1 ? '32px' : '0' }}>
              {index > 0 && (
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    marginBottom: '24px',
                  }}
                />
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={labelStyle}>Nome da Unidade</label>
                      <input
                        type="text"
                        placeholder="Nome da unidade"
                        value={unidade.nomeUnidade}
                        onChange={(e) => updateUnidade(unidade.id, 'nomeUnidade', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Sigla</label>
                      <input
                        type="text"
                        placeholder="Ex: CCAE"
                        value={unidade.sigla}
                        onChange={(e) => updateUnidade(unidade.id, 'sigla', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={labelStyle}>E-mail</label>
                      <input
                        type="email"
                        placeholder="unidade@email.com"
                        value={unidade.email}
                        onChange={(e) => updateUnidade(unidade.id, 'email', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Telefone</label>
                      <input
                        type="tel"
                        placeholder="(27) 9999-9999"
                        value={unidade.telefone}
                        onChange={(e) => updateUnidade(unidade.id, 'telefone', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={labelStyle}>Endereço</label>
                      <input
                        type="text"
                        placeholder="Rua, número"
                        value={unidade.endereco}
                        onChange={(e) => updateUnidade(unidade.id, 'endereco', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Bairro</label>
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={unidade.bairro}
                        onChange={(e) => updateUnidade(unidade.id, 'bairro', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Cidade</label>
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={unidade.cidade}
                        onChange={(e) => updateUnidade(unidade.id, 'cidade', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>UF</label>
                      <input
                        type="text"
                        placeholder="ES"
                        value={unidade.uf}
                        onChange={(e) => updateUnidade(unidade.id, 'uf', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>CEP</label>
                      <input
                        type="text"
                        placeholder="00000-000"
                        value={unidade.cep}
                        onChange={(e) => updateUnidade(unidade.id, 'cep', e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>CNPJ</label>
                    <input
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={unidade.cnpj}
                      onChange={(e) => updateUnidade(unidade.id, 'cnpj', e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                    />
                  </div>
                </div>

                {unidades.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUnidade(unidade.id)}
                    style={{
                      marginTop: '28px',
                      width: '36px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 'var(--radius)',
                      background: 'transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Trash2 size={14} style={{ color: 'rgba(239,68,68,0.7)' }} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botões de ação */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius)',
              padding: '11px 20px',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Save size={15} />
            Salvar Rascunho
          </button>

          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#00c1af',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '11px 20px',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00a99a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00c1af')}
          >
            <Save size={15} />
            Salvar Formulário
          </button>
        </div>
      </div>
    </div>
  );
};
