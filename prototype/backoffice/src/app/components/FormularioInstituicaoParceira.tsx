import React, { useMemo, useState } from 'react';
import { ChevronRight, Home, Save, Plus, Trash2, ChevronDown, Search, UserPlus, History } from 'lucide-react';
import { BackofficeDatePicker } from './BackofficeDatePicker';

interface Props {
  onBack: () => void;
}

interface PessoaFisica {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  estado: 'ATIVA' | 'SUSPENSA';
  jaFoiResponsavel: boolean;
}

interface ResponsavelHistorico {
  pessoaId: string;
  nome: string;
  papel: string;
  dataInicio: string;
  dataFim: string;
  motivo?: string;
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
  backgroundColor: 'rgba(38, 38, 38, 0.7)',
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
  backgroundColor: 'rgba(38, 38, 38, 0.5)',
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

  // Card 2 - Responsavel (vinculo temporal PessoaFisica <-> Instituicao, RN04/RN11)
  const [responsavelSelecionado, setResponsavelSelecionado] = useState<PessoaFisica | null>(null);
  const [papelResponsavel, setPapelResponsavel] = useState('');
  const [dataInicioMandato, setDataInicioMandato] = useState('');
  const [dataFimMandato, setDataFimMandato] = useState('');
  const [buscaResponsavel, setBuscaResponsavel] = useState('');
  const [buscaAberta, setBuscaAberta] = useState(false);

  // Mock — em producao vira de GET /api/v1/m008/pessoas?search={termo}
  const pessoasCadastradas: PessoaFisica[] = [
    { id: 'PES-2026-001', nome: 'Maria Souza',   cpf: '111.111.111-11', email: 'maria@ufes.br',  telefone: '(27) 99111-1111', estado: 'ATIVA',    jaFoiResponsavel: true  },
    { id: 'PES-2026-002', nome: 'Joao Silva',    cpf: '222.222.222-22', email: 'joao@ufes.br',   telefone: '(27) 99222-2222', estado: 'ATIVA',    jaFoiResponsavel: true  },
    { id: 'PES-2026-003', nome: 'Pedro Lima',    cpf: '333.333.333-33', email: 'pedro@ifes.br',  telefone: '(27) 99333-3333', estado: 'ATIVA',    jaFoiResponsavel: true  },
    { id: 'PES-2026-004', nome: 'Ana Costa',     cpf: '444.444.444-44', email: 'ana@ifes.br',    telefone: '(27) 99444-4444', estado: 'ATIVA',    jaFoiResponsavel: false },
    { id: 'PES-2026-005', nome: 'Carlos Mendes', cpf: '555.555.555-55', email: 'carlos@fapes',   telefone: '(27) 99555-5555', estado: 'SUSPENSA', jaFoiResponsavel: false },
  ];

  // Mock — em producao vira de GET /api/v1/m008/responsaveis?instituicaoId={id}&estado=encerrado
  const historicoResponsaveis: ResponsavelHistorico[] = [
    { pessoaId: 'PES-2026-002', nome: 'Joao Silva', papel: 'Reitor',     dataInicio: '2020-01-01', dataFim: '2023-12-31', motivo: 'Fim de mandato' },
    { pessoaId: 'PES-2026-003', nome: 'Pedro Lima', papel: 'Reitor Pro Tempore', dataInicio: '2017-01-01', dataFim: '2019-12-31', motivo: 'Fim de mandato' },
  ];

  const sugestoes = useMemo(
    () => pessoasCadastradas.filter((p) => p.jaFoiResponsavel && p.estado === 'ATIVA'),
    [pessoasCadastradas]
  );

  const resultadoBusca = useMemo(() => {
    const termo = buscaResponsavel.trim().toLowerCase();
    if (!termo) return [];
    return pessoasCadastradas.filter(
      (p) =>
        p.estado === 'ATIVA' &&
        (p.nome.toLowerCase().includes(termo) || p.cpf.replace(/\D/g, '').includes(termo.replace(/\D/g, '')))
    );
  }, [buscaResponsavel, pessoasCadastradas]);

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
    <div style={{ backgroundColor: '#171717', minHeight: '100vh' }}>
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
                  color: '#171717',
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

        {/* Card 2: Responsavel (PessoaFisica com mandato) */}
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
                  color: '#171717',
                }}
              >
                2
              </span>
            </div>
            <p style={sectionTitleStyle}>Responsável</p>
          </div>
          <p style={sectionSubtitleStyle}>
            Vínculo temporal entre uma PessoaFísica cadastrada e a Instituição (RN04/RN11). Selecione uma pessoa já cadastrada no sistema.
          </p>

          {/* Sugestoes — pessoas que ja foram Responsavel */}
          {!responsavelSelecionado && sugestoes.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <History size={14} style={{ color: 'rgba(0,193,175,0.8)' }} />
                <span style={{ ...labelStyle, marginBottom: 0, color: 'rgba(0,193,175,0.9)' }}>Sugestões — já foram Responsável</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {sugestoes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setResponsavelSelecionado(p)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'rgba(0,193,175,0.08)',
                      border: '1px solid rgba(0,193,175,0.3)',
                      borderRadius: 'var(--radius)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {p.nome} <span style={{ opacity: 0.5 }}>· {p.cpf}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Campo de busca por nome ou CPF */}
          {!responsavelSelecionado && (
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <label style={labelStyle}>Buscar PessoaFísica por nome ou CPF</label>
              <div style={{ position: 'relative' }}>
                <Search
                  size={15}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}
                />
                <input
                  type="text"
                  placeholder="Digite nome ou CPF da pessoa..."
                  value={buscaResponsavel}
                  onChange={(e) => {
                    setBuscaResponsavel(e.target.value);
                    setBuscaAberta(true);
                  }}
                  onFocus={() => setBuscaAberta(true)}
                  style={{ ...inputStyle, paddingLeft: '36px' }}
                />
              </div>
              {buscaAberta && buscaResponsavel.trim() && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '100%',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius)',
                    zIndex: 200,
                    maxHeight: '260px',
                    overflowY: 'auto',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  {resultadoBusca.length === 0 ? (
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>
                        Pessoa não encontrada no banco de dados.
                      </span>
                      <button
                        type="button"
                        onClick={() => alert('Redirecionar para cadastro de PessoaFísica em M008/pessoas')}
                        style={{
                          alignSelf: 'flex-start',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: 'rgba(0,193,175,0.15)',
                          border: '1px solid rgba(0,193,175,0.4)',
                          borderRadius: 'var(--radius)',
                          color: '#00c1af',
                          fontSize: 'var(--text-sm)',
                          cursor: 'pointer',
                        }}
                      >
                        <UserPlus size={13} />
                        Cadastrar pessoa primeiro
                      </button>
                    </div>
                  ) : (
                    resultadoBusca.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setResponsavelSelecionado(p);
                          setBuscaResponsavel('');
                          setBuscaAberta(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#ffffff',
                          fontFamily: 'var(--font-family)',
                          fontSize: 'var(--text-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span>{p.nome}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                          CPF {p.cpf} · {p.email}
                          {p.jaFoiResponsavel && <span style={{ marginLeft: '6px', color: '#00c1af' }}>· já foi Responsável</span>}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pessoa selecionada + dados do mandato */}
          {responsavelSelecionado && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  backgroundColor: 'rgba(0,193,175,0.08)',
                  border: '1px solid rgba(0,193,175,0.3)',
                  borderRadius: 'var(--radius)',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
                    {responsavelSelecionado.nome}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                    CPF {responsavelSelecionado.cpf} · {responsavelSelecionado.email} · {responsavelSelecionado.telefone}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResponsavelSelecionado(null)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 'var(--radius)',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-family)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Trocar pessoa
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Papel (texto livre)</label>
                  <input
                    type="text"
                    placeholder="Ex: Reitor, Diretor, Coordenador"
                    value={papelResponsavel}
                    onChange={(e) => setPapelResponsavel(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Início do Mandato</label>
                  <BackofficeDatePicker value={dataInicioMandato} onChange={setDataInicioMandato} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Fim do Mandato</label>
                  <BackofficeDatePicker value={dataFimMandato} onChange={setDataFimMandato} style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* Historico de Responsaveis encerrados */}
          {historicoResponsaveis.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <History size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
                <span style={{ ...labelStyle, marginBottom: 0 }}>Histórico de Responsáveis (mandatos encerrados)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {historicoResponsaveis.map((h, idx) => (
                  <div
                    key={`${h.pessoaId}-${idx}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1.5fr 2fr',
                      gap: '12px',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(38, 38, 38, 0.5)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{h.nome}</span>
                    <span>{h.papel}</span>
                    <span>{h.dataInicio} → {h.dataFim}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{h.motivo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    color: '#171717',
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
              color: '#171717',
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
