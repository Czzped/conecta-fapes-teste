import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Search, ShieldCheck, X } from 'lucide-react';
import { useThemeTokens } from '../theme/ThemeContext';
import { ConfiguracoesPageHeader } from './ConfiguracoesPageHeader';

interface ControleAcessosProps {
  onBack: () => void;
}

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  setor: string;
  status: 'Ativo' | 'Desativado';
}

const funcionariosIniciais: Funcionario[] = [
  { id: 1, nome: 'Mariana Souza', email: 'mariana.souza@fapes.es.gov.br', funcao: 'Administrador', setor: 'T.I.', status: 'Ativo' },
  { id: 2, nome: 'Rafael Costa', email: 'rafael.costa@fapes.es.gov.br', funcao: 'Analista', setor: 'GECAP', status: 'Ativo' },
  { id: 3, nome: 'Camila Rocha', email: 'camila.rocha@fapes.es.gov.br', funcao: 'Gestor', setor: 'GEINOV', status: 'Ativo' },
  { id: 4, nome: 'Bruno Martins', email: 'bruno.martins@fapes.es.gov.br', funcao: 'Analista', setor: 'DINOV', status: 'Desativado' },
  { id: 5, nome: 'Aline Ferreira', email: 'aline.ferreira@fapes.es.gov.br', funcao: 'Gestor', setor: 'GEPED', status: 'Ativo' },
  { id: 6, nome: 'Lucas Almeida', email: 'lucas.almeida@fapes.es.gov.br', funcao: 'Administrador', setor: 'GEAF', status: 'Ativo' },
  { id: 7, nome: 'Patricia Lima', email: 'patricia.lima@fapes.es.gov.br', funcao: 'Analista', setor: 'DIRAF', status: 'Desativado' },
  { id: 8, nome: 'Diego Ribeiro', email: 'diego.ribeiro@fapes.es.gov.br', funcao: 'Gestor', setor: 'GECAP', status: 'Ativo' },
  { id: 9, nome: 'Fernanda Lopes', email: 'fernanda.lopes@fapes.es.gov.br', funcao: 'Analista', setor: 'GEINOV', status: 'Ativo' },
  { id: 10, nome: 'João Pereira', email: 'joao.pereira@fapes.es.gov.br', funcao: 'Auditor', setor: 'T.I.', status: 'Ativo' },
];

export const ControleAcessos: React.FC<ControleAcessosProps> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const [showModal, setShowModal] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(funcionariosIniciais);
  const [draft, setDraft] = useState({ nome: '', email: '', funcao: '', setor: '' });
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [statusDraft, setStatusDraft] = useState<Funcionario['status']>('Ativo');
  const [searchTerm, setSearchTerm] = useState('');
  const [funcaoFilter, setFuncaoFilter] = useState('Todos');
  const [setorFilter, setSetorFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: T.bgInput,
    border: `1px solid ${T.borderDefault}`,
    borderRadius: 'var(--radius)',
    padding: '10px 12px',
    color: T.textPrimary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: T.textSecondary,
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
  };

  const funcoes = ['Todos', ...Array.from(new Set(funcionarios.map(item => item.funcao)))];
  const setores = ['Todos', ...Array.from(new Set(funcionarios.map(item => item.setor)))];
  const statuses = ['Todos', 'Ativo', 'Desativado'];
  const filteredFuncionarios = funcionarios.filter(funcionario => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || `${funcionario.nome} ${funcionario.email}`.toLowerCase().includes(query);
    const matchesFuncao = funcaoFilter === 'Todos' || funcionario.funcao === funcaoFilter;
    const matchesSetor = setorFilter === 'Todos' || funcionario.setor === setorFilter;
    const matchesStatus = statusFilter === 'Todos' || funcionario.status === statusFilter;
    return matchesSearch && matchesFuncao && matchesSetor && matchesStatus;
  });

  const resetDraft = () => setDraft({ nome: '', email: '', funcao: '', setor: '' });
  const closeModal = () => {
    resetDraft();
    setShowModal(false);
  };

  const saveFuncionario = () => {
    if (!draft.nome.trim() || !draft.email.trim() || !draft.funcao.trim() || !draft.setor.trim()) return;
    setFuncionarios(prev => [{ id: Date.now(), ...draft, status: 'Ativo' }, ...prev]);
    closeModal();
  };

  const openFuncionario = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setStatusDraft(funcionario.status);
  };

  const closeFuncionarioModal = () => {
    setSelectedFuncionario(null);
    setStatusDraft('Ativo');
  };

  const saveFuncionarioStatus = () => {
    if (!selectedFuncionario) return;
    setFuncionarios(prev => prev.map(funcionario => (
      funcionario.id === selectedFuncionario.id ? { ...funcionario, status: statusDraft } : funcionario
    )));
    closeFuncionarioModal();
  };

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">
        <ConfiguracoesPageHeader
          title="Controle de Acessos"
          subtitle="Gerencie o permissionamento dos funcionários."
          icon={ShieldCheck}
          onBack={onBack}
          action={(
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={{
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 16px',
                border: 'none',
                borderRadius: 'var(--radius)',
                backgroundColor: T.accent,
                color: T.accentText,
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={16} />
              Novo Funcionário
            </button>
          )}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 220px 220px 180px', gap: '16px', marginBottom: '18px' }}>
          <div>
            <label style={labelStyle}>Pesquisar</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
              <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Buscar" style={{ ...inputStyle, paddingRight: '38px' }} />
            </div>
          </div>
          {[
            ['Função', funcaoFilter, setFuncaoFilter, funcoes],
            ['Setor', setorFilter, setSetorFilter, setores],
            ['Status', statusFilter, setStatusFilter, statuses],
          ].map(([label, value, setter, options]) => (
            <SystemDropdown
              key={label as string}
              id={`filter-${label}`}
              label={label as string}
              value={value as string}
              options={options as string[]}
              isOpen={openDropdown === `filter-${label}`}
              onOpen={() => setOpenDropdown(openDropdown === `filter-${label}` ? null : `filter-${label}`)}
              onChange={option => {
                (setter as React.Dispatch<React.SetStateAction<string>>)(option);
                setOpenDropdown(null);
              }}
              T={T}
              labelStyle={labelStyle}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary }}>
            Exibindo {Math.min(filteredFuncionarios.length, 10)} resultados de {filteredFuncionarios.length}
          </span>
        </div>

        <section style={{ display: 'grid', gap: '12px' }}>
          {filteredFuncionarios.slice(0, 10).map(funcionario => (
            <div
              key={funcionario.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1.3fr 0.9fr 1fr 130px 32px',
                gap: '16px',
                alignItems: 'center',
                minHeight: '92px',
                padding: '20px 28px',
                backgroundColor: T.bgCard,
                border: `1px solid ${T.borderSubtle}`,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onClick={() => openFuncionario(funcionario)}
              onMouseEnter={event => {
                event.currentTarget.style.backgroundColor = 'rgba(38,38,38,0.92)';
                event.currentTarget.style.borderColor = T.borderDefault;
              }}
              onMouseLeave={event => {
                event.currentTarget.style.backgroundColor = T.bgCard;
                event.currentTarget.style.borderColor = T.borderSubtle;
              }}
            >
              {[
                ['Nome', funcionario.nome, T.textPrimary],
                ['E-mail', funcionario.email, T.textPrimary],
                ['Função', funcionario.funcao, T.textPrimary],
                ['Setor', funcionario.setor, T.textPrimary],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, fontWeight: 'var(--font-weight-medium)', marginBottom: '8px' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color, fontWeight: 'var(--font-weight-medium)', lineHeight: 1.45 }}>
                    {value}
                  </div>
                </div>
              ))}
              <div>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, fontWeight: 'var(--font-weight-medium)', marginBottom: '8px' }}>
                  Status
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px 12px', borderRadius: '999px', border: `1px solid ${funcionario.status === 'Ativo' ? 'rgba(34,197,94,0.65)' : 'rgba(163,163,163,0.55)'}`, backgroundColor: funcionario.status === 'Ativo' ? 'rgba(34,197,94,0.12)' : 'rgba(163,163,163,0.1)', color: funcionario.status === 'Ativo' ? '#22c55e' : T.textMuted, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                  {funcionario.status}
                </span>
              </div>
              <ChevronRight size={18} style={{ color: T.iconSubdued, justifySelf: 'end' }} />
            </div>
          ))}
        </section>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: 'min(560px, 100%)', backgroundColor: '#171717', border: `1px solid ${T.borderSubtle}`, borderRadius: '10px', padding: '24px', boxShadow: '0 24px 80px rgba(0,0,0,0.55)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: T.textPrimary, margin: 0 }}>
                Cadastrar Novo Funcionário
              </h2>
              <button type="button" onClick={closeModal} aria-label="Fechar" style={{ width: '34px', height: '34px', border: `1px solid ${T.borderSubtle}`, borderRadius: 'var(--radius)', backgroundColor: T.bgInput, color: T.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input value={draft.nome} onChange={event => setDraft(prev => ({ ...prev, nome: event.target.value }))} placeholder="Digite o nome" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input type="email" value={draft.email} onChange={event => setDraft(prev => ({ ...prev, email: event.target.value }))} placeholder="nome@fapes.es.gov.br" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Função</label>
                  <input value={draft.funcao} onChange={event => setDraft(prev => ({ ...prev, funcao: event.target.value }))} placeholder="Digite a função" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Setor</label>
                  <input value={draft.setor} onChange={event => setDraft(prev => ({ ...prev, setor: event.target.value }))} placeholder="Digite o setor" style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={closeModal} style={{ height: '40px', padding: '0 18px', border: `1px solid ${T.borderDefault}`, borderRadius: 'var(--radius)', backgroundColor: 'transparent', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button type="button" onClick={saveFuncionario} style={{ height: '40px', padding: '0 18px', border: 'none', borderRadius: 'var(--radius)', backgroundColor: T.accent, color: T.accentText, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedFuncionario && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: 'min(520px, 100%)', backgroundColor: '#171717', border: `1px solid ${T.borderSubtle}`, borderRadius: '10px', padding: '24px', boxShadow: '0 24px 80px rgba(0,0,0,0.55)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: T.textPrimary, margin: 0 }}>
                {selectedFuncionario.nome}
              </h2>
              <button type="button" onClick={closeFuncionarioModal} aria-label="Fechar" style={{ width: '34px', height: '34px', border: 'none', borderRadius: 'var(--radius)', backgroundColor: 'transparent', color: T.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div>
              <SystemDropdown
                id="modal-status"
                label="Status"
                value={statusDraft}
                options={['Ativo', 'Desativado']}
                isOpen={openDropdown === 'modal-status'}
                onOpen={() => setOpenDropdown(openDropdown === 'modal-status' ? null : 'modal-status')}
                onChange={option => {
                  setStatusDraft(option as Funcionario['status']);
                  setOpenDropdown(null);
                }}
                T={T}
                labelStyle={labelStyle}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={closeFuncionarioModal} style={{ height: '40px', padding: '0 18px', border: `1px solid ${T.borderDefault}`, borderRadius: 'var(--radius)', backgroundColor: 'transparent', color: T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button type="button" onClick={saveFuncionarioStatus} style={{ height: '40px', padding: '0 18px', border: 'none', borderRadius: 'var(--radius)', backgroundColor: T.accent, color: T.accentText, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SystemDropdownProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onOpen: () => void;
  onChange: (value: string) => void;
  T: ReturnType<typeof useThemeTokens>['T'];
  labelStyle: React.CSSProperties;
}

const SystemDropdown: React.FC<SystemDropdownProps> = ({ label, value, options, isOpen, onOpen, onChange, T, labelStyle }) => (
  <div style={{ position: 'relative' }}>
    <label style={labelStyle}>{label}</label>
    <button
      type="button"
      onClick={onOpen}
      style={{
        width: '100%',
        minHeight: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        backgroundColor: T.bgInput,
        border: `1px solid ${isOpen ? T.accent : T.borderDefault}`,
        borderRadius: 'var(--radius)',
        padding: '10px 12px',
        color: T.textPrimary,
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        boxSizing: 'border-box',
        textAlign: 'left',
      }}
    >
      <span>{value}</span>
      <ChevronDown size={16} style={{ color: T.iconSubdued, flexShrink: 0 }} />
    </button>

    {isOpen && (
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          zIndex: 20,
          backgroundColor: '#171717',
          border: `1px solid ${T.borderDefault}`,
          borderRadius: 'var(--radius)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
          overflow: 'hidden',
        }}
      >
        {options.map((option, index) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              style={{
                width: '100%',
                minHeight: '42px',
                padding: '10px 12px',
                border: 'none',
                backgroundColor: selected ? 'rgba(0,193,175,0.12)' : '#171717',
                color: selected ? T.accent : T.textPrimary,
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--text-sm)',
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onMouseEnter={event => {
                event.currentTarget.style.backgroundColor = selected ? 'rgba(0,193,175,0.16)' : 'rgba(38,38,38,0.95)';
              }}
              onMouseLeave={event => {
                event.currentTarget.style.backgroundColor = selected ? 'rgba(0,193,175,0.12)' : '#171717';
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    )}
  </div>
);
