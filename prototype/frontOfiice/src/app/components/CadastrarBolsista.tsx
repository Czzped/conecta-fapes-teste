import { UserPlus, Search, ChevronRight, Home, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DatePicker } from '@/app/components/DatePicker';

interface CadastrarBolsistaProps {
  onBack: () => void;
}

export function CadastrarBolsista({ onBack }: CadastrarBolsistaProps) {
  const { t } = useLanguage();
  const [cpf, setCpf] = useState('');
  const [bolsistaName, setBolsistaName] = useState('');
  const [orientador, setOrientador] = useState('');
  const [modalidade, setModalidade] = useState('BPIG-X');
  const [isModalidadeOpen, setIsModalidadeOpen] = useState(false);
  const [tipoBolsa, setTipoBolsa] = useState('Iniciação Científica');
  const [status, setStatus] = useState('Ativo');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [valorMensal, setValorMensal] = useState('180,00');
  const [planoTrabalho, setPlanoTrabalho] = useState('');
  const [objetivos, setObjetivos] = useState('');
  const [isTipoBolsaOpen, setIsTipoBolsaOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const modalidades = [
    'BPIG-I', 'BPIG-II', 'BPIG-III', 'BPIG-IV', 'BPIG-V',
    'BPIG-VI', 'BPIG-VII', 'BPIG-VIII', 'BPIG-IX', 'BPIG-X',
  ];

  const tiposBolsa = [
    'Iniciação Científica',
    'Mestrado',
    'Doutorado',
    'Pós-Doutorado',
  ];

  const statusOptions = ['Ativo', 'Inativo'];

  const handleBuscarCPF = () => {
    // Mock: populate bolsista name from CPF search
    if (cpf.length >= 3) {
      setBolsistaName('Marcela Starling');
    }
  };

  const handleCadastrar = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSalvar = () => {
    setIsConfirmModalOpen(false);
    onBack();
  };

  const handleCancel = () => {
    onBack();
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={onBack}
          style={{
            color: 'var(--muted-foreground)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}
        >
          <Home size={16} />
        </button>
        <ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} />
        <button
          onClick={onBack}
          style={{
            color: 'var(--muted-foreground)',
            fontSize: 'var(--text-sm)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.2s',
            fontFamily: 'var(--font-family)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}
        >
          Minha Equipe
        </button>
        <ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} />
        <span
          style={{
            color: 'var(--foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'var(--font-family)',
          }}
        >
          Cadastrar Bolsista
        </span>
      </div>

      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="p-2 transition-colors"
          style={{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }}
        >
          <UserPlus size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-family)' }}>
          Cadastrar Bolsista
        </h1>
      </div>

      {/* Subtitle */}
      <p
        style={{
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          marginLeft: 'calc(32px + 0.75rem)',
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-family)',
        }}
      >
        Incluir nova pessoa para atuar no projeto ou atualizar bolsa de pessoa que já atua no projeto
      </p>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '2rem' }} />

      {/* Form */}
      <div>
        {/* Projeto Vinculado */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Projeto Vinculado
          </label>
          <input
            type="text"
            value="ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação"
            readOnly
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', cursor: 'not-allowed', fontFamily: 'var(--font-family)' }}
          />
        </div>

        {/* CPF do Bolsista */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            CPF do Bolsista <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              style={{ flex: 1, padding: '0.625rem 0.75rem', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <button
              onClick={handleBuscarCPF}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'var(--font-family)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 10%, transparent)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--foreground)'; }}
            >
              <Search size={16} />
              Buscar
            </button>
          </div>
          {bolsistaName && (
            <div
              className="flex items-center gap-2 mt-2 px-3 py-2"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family)' }}>
                {bolsistaName}
              </span>
              <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>
                encontrado
              </span>
            </div>
          )}
        </div>

        {/* Orientador */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Orientador <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
          </label>
          <input
            type="text"
            value={orientador}
            onChange={(e) => setOrientador(e.target.value)}
            placeholder="Nome do orientador responsável"
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Modalidade and Tipo de Bolsa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Modalidade */}
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Modalidade <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setIsModalidadeOpen(!isModalidadeOpen)}
                style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-family)' }}
              >
                {modalidade}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isModalidadeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isModalidadeOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsModalidadeOpen(false)} />
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)', zIndex: 50, overflow: 'hidden', maxHeight: '200px', overflowY: 'auto' }}>
                    {modalidades.map((mod) => (
                      <button
                        key={mod}
                        onClick={() => { setModalidade(mod); setIsModalidadeOpen(false); }}
                        style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: modalidade === mod ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent', color: modalidade === mod ? 'var(--primary)' : 'var(--foreground)', border: 'none', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.15s', fontFamily: 'var(--font-family)' }}
                        onMouseEnter={(e) => { if (modalidade !== mod) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                        onMouseLeave={(e) => { if (modalidade !== mod) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tipo de Bolsa */}
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Tipo de Bolsa
            </label>
            <div className="relative">
              <button
                onClick={() => setIsTipoBolsaOpen(!isTipoBolsaOpen)}
                style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-family)' }}
              >
                {tipoBolsa}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isTipoBolsaOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isTipoBolsaOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsTipoBolsaOpen(false)} />
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)', zIndex: 50, overflow: 'hidden' }}>
                    {tiposBolsa.map((tipo) => (
                      <button
                        key={tipo}
                        onClick={() => { setTipoBolsa(tipo); setIsTipoBolsaOpen(false); }}
                        style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: tipoBolsa === tipo ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent', color: tipoBolsa === tipo ? 'var(--primary)' : 'var(--foreground)', border: 'none', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.15s', fontFamily: 'var(--font-family)' }}
                        onMouseEnter={(e) => { if (tipoBolsa !== tipo) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                        onMouseLeave={(e) => { if (tipoBolsa !== tipo) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Status
          </label>
          <div className="relative" style={{ maxWidth: '240px' }}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-family)' }}
            >
              {status}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isStatusOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isStatusOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsStatusOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--elevation-sm)', zIndex: 50, overflow: 'hidden' }}>
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => { setStatus(option); setIsStatusOpen(false); }}
                      style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: status === option ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent', color: status === option ? 'var(--primary)' : 'var(--foreground)', border: 'none', fontSize: 'var(--text-sm)', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.15s', fontFamily: 'var(--font-family)' }}
                      onMouseEnter={(e) => { if (status !== option) e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                      onMouseLeave={(e) => { if (status !== option) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Data de Início, Data de Término, and Valor Mensal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Data de Início <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
            </label>
            <DatePicker value={dataInicio} onChange={(date) => setDataInicio(date)} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Data de Término <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
            </label>
            <DatePicker value={dataTermino} onChange={(date) => setDataTermino(date)} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
              Valor Mensal (R$) <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
            </label>
            <input
              type="text"
              value={valorMensal}
              onChange={(e) => setValorMensal(e.target.value)}
              placeholder="0,00"
              style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'var(--font-family)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Plano de Trabalho */}
        <div className="mb-6">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Plano de Trabalho <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
          </label>
          <textarea
            value={planoTrabalho}
            onChange={(e) => setPlanoTrabalho(e.target.value)}
            placeholder="Descreva o plano de trabalho do bolsista, incluindo atividades previstas e metodologia..."
            rows={4}
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-family)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Objetivos */}
        <div className="mb-8">
          <label style={{ display: 'block', color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '0.5rem', fontFamily: 'var(--font-family)' }}>
            Objetivos <span style={{ color: 'var(--destructive-foreground)' }}>*</span>
          </label>
          <textarea
            value={objetivos}
            onChange={(e) => setObjetivos(e.target.value)}
            placeholder="Liste os objetivos do bolsista (um por linha) 1. Objetivo 1 2. Objetivo 2 3. Objetivo 3"
            rows={4}
            style={{ width: '100%', padding: '0.625rem 0.75rem', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-family)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            style={{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Cancelar
          </button>
          <button
            onClick={handleCadastrar}
            style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            Cadastrar
          </button>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {isConfirmModalOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
            onClick={() => setIsConfirmModalOpen(false)}
          />

          {/* Modal panel */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              width: '90%',
              maxWidth: '480px',
              zIndex: 1000,
              boxShadow: 'var(--elevation-sm)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              {/* Header row */}
              <div className="flex items-start justify-between" style={{ marginBottom: '1.25rem' }}>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <AlertCircle size={18} />
                  </div>
                  <h2
                    style={{
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    Confirmar Cadastro
                  </h2>
                </div>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', flexShrink: 0, transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)'; e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '1.25rem' }} />

              {/* Confirmation message */}
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground)',
                  lineHeight: '1.6',
                  margin: '0 0 1.25rem 0',
                  fontFamily: 'var(--font-family)',
                }}
              >
                Tem certeza que deseja criar a bolsa de{' '}
                <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  {bolsistaName || 'bolsista'}
                </strong>{' '}
                na modalidade{' '}
                <strong style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {modalidade}
                </strong>{' '}
                — R${' '}
                <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  {valorMensal}
                </strong>
                ?
              </p>

              {/* Summary card */}
              <div
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                  borderRadius: 'var(--radius)',
                  padding: '0.875rem 1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                }}
              >
                {[
                  { label: 'Bolsista', value: bolsistaName || '—', highlight: false },
                  { label: 'Modalidade', value: modalidade, highlight: true },
                  { label: 'Tipo de Bolsa', value: tipoBolsa, highlight: false },
                  { label: 'Valor Mensal', value: `R$ ${valorMensal}`, highlight: false },
                ].map((row, idx, arr) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-family)' }}>
                        {row.label}
                      </span>
                      <span
                        style={{
                          color: row.highlight ? 'var(--primary)' : 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          fontFamily: 'var(--font-family)',
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div style={{ height: '1px', backgroundColor: 'color-mix(in srgb, var(--border) 60%, transparent)', marginTop: '0.625rem' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  style={{ padding: '0.625rem 1.25rem', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSalvar}
                  style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-family)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
