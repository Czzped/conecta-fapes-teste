import React, { useState } from 'react';
import { ChevronRight, Home, Save, Send, Plus, Trash2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onBack: () => void;
}

interface InstituicaoParceira {
  id: number;
  instituicao: string;
  valorInvestido: string;
}

interface Formulario {
  id: number;
  tipo: string;
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
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
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

export const FormularioParceria: React.FC<Props> = ({ onBack }) => {
  const [nomeParceria, setNomeParceria] = useState('');
  const [instituicoes, setInstituicoes] = useState<InstituicaoParceira[]>([{ id: 1, instituicao: '', valorInvestido: '' }]);
  const [area, setArea] = useState('');
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [dataAssinatura, setDataAssinatura] = useState('');
  const [dataVigenciaInicio, setDataVigenciaInicio] = useState('');
  const [dataVigenciaFim, setDataVigenciaFim] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [coordenadorNome, setCoordenadorNome] = useState('');
  const [coordenadorEmail, setCoordenadorEmail] = useState('');
  const [coordenadorCelular, setCoordenadorCelular] = useState('');
  const [pontoFocalFapes, setPontoFocalFapes] = useState('');
  const [gerenciaResponsavel, setGerenciaResponsavel] = useState('');
  const [formularios, setFormularios] = useState<Formulario[]>([{ id: 1, tipo: '' }]);

  const instituicoesOptions = [
    { value: 'ufes', label: 'Universidade Federal do Espírito Santo (Ufes)' },
    { value: 'ifes', label: 'Instituto Federal do Espírito Santo (Ifes)' },
    { value: 'cnpq', label: 'Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq)' },
    { value: 'fapesp', label: 'Fundação de Amparo à Pesquisa do Estado de São Paulo (Fapesp)' },
    { value: 'ufmg', label: 'Universidade Federal de Minas Gerais (UFMG)' },
    { value: 'usp', label: 'Universidade de São Paulo (USP)' },
    { value: 'capes', label: 'Coordenação de Aperfeiçoamento de Pessoal de Nível Superior (Capes)' },
  ];

  const areaOptions = [
    { value: 'carreira', label: 'Carreira Científica' },
    { value: 'pesquisa', label: 'Pesquisa' },
    { value: 'difusao', label: 'Difusão do Conhecimento' },
    { value: 'extensao', label: 'Extensão' },
    { value: 'inovacao', label: 'Inovação' },
    { value: 'internacional', label: 'Internacional' },
  ];

  const formularioOptions = [
    { value: 'monitoramento', label: 'Monitoramento' },
    { value: 'termo', label: 'Termo de Cooperação' },
    { value: 'avaliacao', label: 'Avaliação' },
    { value: 'relatorio', label: 'Relatório' },
  ];

  const gerenciaOptions = [
    { value: 'geaf', label: 'GEAF' },
    { value: 'gecap', label: 'GECAP' },
    { value: 'geinov', label: 'GEINOV' },
    { value: 'geop', label: 'GEOP' },
    { value: 'geped', label: 'GEPED' },
  ];

  const pesquisadoresOptions = [
    { value: 'marcos', label: 'Prof. Dr. Marcos Andrade' },
    { value: 'fernanda', label: 'Dra. Fernanda Rocha' },
    { value: 'eduardo', label: 'Prof. Eduardo Martins' },
    { value: 'carla', label: 'Dra. Carla Vasconcelos' },
  ];

  const addInstituicao = () => {
    setInstituicoes(prev => [...prev, { id: Date.now(), instituicao: '', valorInvestido: '' }]);
  };

  const removeInstituicao = (id: number) => {
    if (instituicoes.length > 1) {
      setInstituicoes(prev => prev.filter(i => i.id !== id));
    }
  };

  const updateInstituicao = (id: number, field: 'instituicao' | 'valorInvestido', value: string) => {
    setInstituicoes(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const addFormulario = () => {
    setFormularios(prev => [...prev, { id: Date.now(), tipo: '' }]);
  };

  const removeFormulario = (id: number) => {
    if (formularios.length > 1) {
      setFormularios(prev => prev.filter(f => f.id !== id));
    }
  };

  const updateFormulario = (id: number, tipo: string) => {
    setFormularios(prev => prev.map(f => f.id === id ? { ...f, tipo } : f));
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '88px',
    lineHeight: '1.6',
  };

  const handlePublicarParceria = () => {
    toast.success('Parceria cadastrada com sucesso!');
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Home size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}
          >
            Parceria
          </button>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)' }}>
            Nova Parceria
          </span>
        </div>

        {/* Título da tela */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius)',
              backgroundColor: 'rgba(0,193,175,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Plus size={18} style={{ color: '#00c1af' }} />
            </div>
            <div style={{ flex: 1, marginTop: '6px' }}>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: '#ffffff', margin: '0 0 4px' }}>
                Nova Parceria
              </h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Preencha as informações abaixo para criar uma nova parceria.
              </p>
            </div>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginTop: '20px' }} />
        </div>

        {/* Seção 1: Identificação da Parceria */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>1</span>
            </div>
            <p style={sectionTitleStyle}>Identificação da Parceria</p>
          </div>
          <p style={sectionSubtitleStyle}>Informações básicas da cooperação</p>

          {/* Nome da Parceria */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Nome da Parceria</label>
            <input 
              type="text" 
              placeholder="Digite o nome da parceria" 
              value={nomeParceria} 
              onChange={e => setNomeParceria(e.target.value)} 
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          {/* Área e Número do Processo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <SelectField
              label="Área"
              value={area}
              onChange={setArea}
              options={areaOptions}
              placeholder="Selecione a área"
            />
            
            <div>
              <label style={labelStyle}>Número do Processo</label>
              <input 
                type="text" 
                placeholder="Digite o número do processo" 
                value={numeroProcesso} 
                onChange={e => setNumeroProcesso(e.target.value)} 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
          </div>

          {/* Data da Assinatura e Data de Vigência */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Data da Assinatura</label>
              <input 
                type="date" 
                value={dataAssinatura} 
                onChange={e => setDataAssinatura(e.target.value)} 
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Data de Vigência (Início)</label>
              <input 
                type="date" 
                value={dataVigenciaInicio} 
                onChange={e => setDataVigenciaInicio(e.target.value)} 
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Data de Vigência (Fim)</label>
              <input 
                type="date" 
                value={dataVigenciaFim} 
                onChange={e => setDataVigenciaFim(e.target.value)} 
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
          </div>

          {/* Objetivo */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Objetivo</label>
            <textarea
              placeholder="Descreva os objetivos da parceria"
              value={objetivo}
              onChange={e => setObjetivo(e.target.value)}
              style={textareaStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          {/* Instituições Parceiras */}
          <div>
            <label style={{ ...labelStyle, marginBottom: '6px' }}>Instituição Parceira</label>
            
            {instituicoes.map((inst, idx) => (
              <div key={inst.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                  <SelectField
                    label=""
                    value={inst.instituicao}
                    onChange={(v) => updateInstituicao(inst.id, 'instituicao', v)}
                    options={instituicoesOptions}
                    placeholder="Selecione a instituição"
                  />
                  
                  <div>
                    {idx === 0 && <label style={labelStyle}>Valor Investido (R$)</label>}
                    <input
                      type="text"
                      placeholder="Ex: 1.000.000,00"
                      value={inst.valorInvestido}
                      onChange={e => updateInstituicao(inst.id, 'valorInvestido', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeInstituicao(inst.id)}
                    disabled={instituicoes.length === 1}
                    style={{
                      width: '36px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: instituicoes.length === 1 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 'var(--radius)',
                      background: 'transparent',
                      cursor: instituicoes.length === 1 ? 'not-allowed' : 'pointer',
                      flexShrink: 0,
                      transition: 'background-color 0.15s',
                      opacity: instituicoes.length === 1 ? 0.3 : 1,
                    }}
                    onMouseEnter={e => { if (instituicoes.length > 1) e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Trash2 size={14} style={{ color: instituicoes.length === 1 ? 'rgba(255,255,255,0.3)' : 'rgba(239,68,68,0.7)' }} />
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={addInstituicao}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(0,193,175,0.4)',
                  borderRadius: 'var(--radius)',
                  padding: '8px 14px',
                  color: '#00c1af',
                  fontFamily: 'var(--font-family)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; e.currentTarget.style.borderColor = '#00c1af'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
              >
                <Plus size={14} />
                Adicionar Instituição
              </button>
            </div>
          </div>
        </div>

        {/* Seção 2: Coordenador */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>2</span>
            </div>
            <p style={sectionTitleStyle}>Coordenador</p>
          </div>
          <p style={sectionSubtitleStyle}>Informações do coordenador da parceria</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nome</label>
              <input 
                type="text" 
                placeholder="Nome do coordenador" 
                value={coordenadorNome} 
                onChange={e => setCoordenadorNome(e.target.value)} 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input 
                type="email" 
                placeholder="email@exemplo.com" 
                value={coordenadorEmail} 
                onChange={e => setCoordenadorEmail(e.target.value)} 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Celular</label>
              <input 
                type="tel" 
                placeholder="(00) 00000-0000" 
                value={coordenadorCelular} 
                onChange={e => setCoordenadorCelular(e.target.value)} 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,193,175,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
          </div>
        </div>

        {/* Seção 3: Gestão */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>3</span>
            </div>
            <p style={sectionTitleStyle}>Gestão</p>
          </div>
          <p style={sectionSubtitleStyle}>Informações de gestão da parceria</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <SelectField
              label="Ponto Focal Fapes"
              value={pontoFocalFapes}
              onChange={setPontoFocalFapes}
              options={pesquisadoresOptions}
              placeholder="Selecione o ponto focal"
            />
            <SelectField
              label="Gerência Responsável"
              value={gerenciaResponsavel}
              onChange={setGerenciaResponsavel}
              options={gerenciaOptions}
              placeholder="Selecione a gerência"
            />
          </div>
        </div>

        {/* Seção 4: Formulários */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: '#0f172a' }}>4</span>
            </div>
            <p style={sectionTitleStyle}>Formulários</p>
          </div>
          <p style={sectionSubtitleStyle}>Documentos e formulários relacionados à parceria</p>

          {formularios.map((form, idx) => (
            <div key={form.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end' }}>
                <SelectField
                  label={idx === 0 ? 'Tipo de Formulário' : ''}
                  value={form.tipo}
                  onChange={(v) => updateFormulario(form.id, v)}
                  options={formularioOptions}
                  placeholder="Selecione o tipo"
                />

                <button
                  type="button"
                  onClick={() => removeFormulario(form.id)}
                  disabled={formularios.length === 1}
                  style={{
                    width: '36px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: formularios.length === 1 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 'var(--radius)',
                    background: 'transparent',
                    cursor: formularios.length === 1 ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                    transition: 'background-color 0.15s',
                    opacity: formularios.length === 1 ? 0.3 : 1,
                  }}
                  onMouseEnter={e => { if (formularios.length > 1) e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Trash2 size={14} style={{ color: formularios.length === 1 ? 'rgba(255,255,255,0.3)' : 'rgba(239,68,68,0.7)' }} />
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={addFormulario}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(0,193,175,0.4)',
                borderRadius: 'var(--radius)',
                padding: '8px 14px',
                color: '#00c1af',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(0,193,175,0.08)'; e.currentTarget.style.borderColor = '#00c1af'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,193,175,0.4)'; }}
            >
              <Plus size={14} />
              Adicionar Formulário
            </button>
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius)',
              color: '#ffffff',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Save size={16} />
            Salvar Rascunho
          </button>
          <button
            onClick={handlePublicarParceria}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#00c1af',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: '#0f172a',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00a99a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00c1af'}
          >
            <Send size={16} />
            Publicar Parceria
          </button>
        </div>
      </div>
    </div>
  );
};