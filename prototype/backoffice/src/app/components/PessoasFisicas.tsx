import React, { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Save, Search, Trash2, UserRound } from 'lucide-react';

type EstadoPessoa = 'Ativa' | 'Suspensa';
type ActiveTab = 'listagem' | 'dashboard';
type PersonDetailTab = 'cadastro' | 'dashboard';

interface PessoaFisicaItem {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  lattes: string;
  estado: EstadoPessoa;
  justificativa?: string;
}

interface ProjetoPessoa {
  pessoaId: number;
  nome: string;
  programa: string;
  papel: string;
  status: string;
  inicio: string;
  fim: string;
}

interface BolsaPessoa {
  pessoaId: number;
  modalidade: string;
  nivel: string;
  projeto: string;
  valorMensal: number;
  inicio: string;
  fim: string;
  status: 'Recebendo' | 'Encerrada';
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(30,41,59,0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  padding: '10px 12px',
  color: '#ffffff',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '8px',
};

const cardStyle = (): React.CSSProperties => ({
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '20px',
});

const emptyPessoa: PessoaFisicaItem = {
  id: 0,
  cpf: '',
  nome: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  lattes: '',
  estado: 'Ativa',
  justificativa: '',
};

const initialPessoas: PessoaFisicaItem[] = [
  { id: 1, cpf: '111.222.333-44', nome: 'Maria Souza', email: 'maria.souza@email.com', telefone: '(27) 99999-1000', dataNascimento: '1985-03-14', lattes: 'http://lattes.cnpq.br/1234567890', estado: 'Ativa' },
  { id: 2, cpf: '222.333.444-55', nome: 'João Silva', email: 'joao.silva@email.com', telefone: '(27) 99999-2000', dataNascimento: '1979-09-21', lattes: 'http://lattes.cnpq.br/2345678901', estado: 'Ativa' },
  { id: 3, cpf: '333.444.555-66', nome: 'Ana Ribeiro', email: 'ana.ribeiro@email.com', telefone: '(27) 99999-3000', dataNascimento: '1991-01-10', lattes: '', estado: 'Suspensa', justificativa: 'Pendência cadastral em validação.' },
];

const projetosPorPessoa: ProjetoPessoa[] = [
  { pessoaId: 1, nome: 'Iniciativa Pesquisa Aplicada em Saúde', programa: 'Programa de Pesquisa Aplicada', papel: 'Coordenadora', status: 'Em execução', inicio: '2025-02-01', fim: '2027-01-31' },
  { pessoaId: 1, nome: 'Plataforma de Dados para Políticas Públicas', programa: 'Programa Governo Digital', papel: 'Pesquisadora', status: 'Em execução', inicio: '2024-08-01', fim: '2026-07-31' },
  { pessoaId: 2, nome: 'Rede Capixaba de Inovação Industrial', programa: 'Programa de Inovação', papel: 'Pesquisador', status: 'Em execução', inicio: '2025-01-15', fim: '2026-12-15' },
  { pessoaId: 3, nome: 'Observatório de Indicadores Educacionais', programa: 'Programa de Educação Científica', papel: 'Consultora', status: 'Suspenso', inicio: '2024-03-01', fim: '2025-12-31' },
];

const bolsasPorPessoa: BolsaPessoa[] = [
  { pessoaId: 1, modalidade: 'Mestrado', nivel: 'MS-1', projeto: 'Iniciativa Pesquisa Aplicada em Saúde', valorMensal: 2100, inicio: '2025-03-01', fim: '2027-02-28', status: 'Recebendo' },
  { pessoaId: 1, modalidade: 'Pesquisa', nivel: 'DTI-B', projeto: 'Plataforma de Dados para Políticas Públicas', valorMensal: 3200, inicio: '2024-09-01', fim: '2025-08-31', status: 'Encerrada' },
  { pessoaId: 2, modalidade: 'Doutorado', nivel: 'DR-1', projeto: 'Rede Capixaba de Inovação Industrial', valorMensal: 3100, inicio: '2025-02-01', fim: '2028-01-31', status: 'Recebendo' },
];

const maskCpf = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

const estadoColor = (estado: EstadoPessoa) => estado === 'Ativa' ? '#22c55e' : '#f59e0b';

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const rowCardStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.4fr 0.8fr 0.6fr',
  gap: '14px',
  alignItems: 'start',
  padding: '14px',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  backgroundColor: 'rgba(15,23,42,0.35)',
};

export const PessoasFisicas: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('listagem');
  const [detailTab, setDetailTab] = useState<PersonDetailTab>('cadastro');
  const [searchTerm, setSearchTerm] = useState('');
  const [pessoas, setPessoas] = useState<PessoaFisicaItem[]>(initialPessoas);
  const [selected, setSelected] = useState<PessoaFisicaItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<PessoaFisicaItem>(emptyPessoa);

  const filtered = pessoas.filter(item => {
    const query = searchTerm.toLowerCase();
    return item.nome.toLowerCase().includes(query) || item.cpf.toLowerCase().includes(query) || item.email.toLowerCase().includes(query);
  });

  const metrics = useMemo(() => ({
    total: pessoas.length,
    ativas: pessoas.filter(item => item.estado === 'Ativa').length,
    suspensas: pessoas.filter(item => item.estado === 'Suspensa').length,
    comLattes: pessoas.filter(item => item.lattes).length,
  }), [pessoas]);

  const openNew = () => {
    setDraft({ ...emptyPessoa, id: Date.now() });
    setSelected(null);
    setDetailTab('cadastro');
    setShowForm(true);
  };

  const openDetails = (item: PessoaFisicaItem) => {
    setDraft({ ...item });
    setSelected(item);
    setDetailTab('dashboard');
    setShowForm(false);
  };

  const updateDraft = (field: keyof PessoaFisicaItem, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = () => {
    setPessoas(prev => {
      const exists = prev.some(item => item.id === draft.id);
      return exists ? prev.map(item => item.id === draft.id ? draft : item) : [...prev, draft];
    });
    setSelected(draft);
    setShowForm(false);
  };

  const removeDraft = () => {
    if (!selected) return;
    setPessoas(prev => prev.filter(item => item.id !== selected.id));
    setSelected(null);
  };

  if (showForm || selected) {
    const projetos = selected ? projetosPorPessoa.filter(item => item.pessoaId === selected.id) : [];
    const bolsas = selected ? bolsasPorPessoa.filter(item => item.pessoaId === selected.id) : [];
    const bolsasAtivas = bolsas.filter(item => item.status === 'Recebendo');
    const valorMensalAtivo = bolsasAtivas.reduce((total, item) => total + item.valorMensal, 0);

    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
        <div className="pt-8 px-8 pb-8">
          <Header title={showForm ? 'Nova Pessoa Física' : draft.nome} subtitle="Cadastre pessoas físicas com CPF único, dados de contato e situação cadastral." onBack={() => { setShowForm(false); setSelected(null); }} />

          {selected && (
            <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '28px' }}>
              {[
                ['dashboard', 'Dashboard'],
                ['cadastro', 'Cadastro'],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setDetailTab(id as PersonDetailTab)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: detailTab === id ? '2px solid #00c1af' : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: detailTab === id ? '#00c1af' : 'rgba(255,255,255,0.6)', cursor: 'pointer', marginBottom: '-1px' }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {selected && detailTab === 'dashboard' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <Metric label="Projetos vinculados" value={String(projetos.length)} color="#38bdf8" bg="rgba(56,189,248,0.12)" />
                <Metric label="Bolsas recebidas" value={String(bolsas.length)} color="#a855f7" bg="rgba(168,85,247,0.12)" />
                <Metric label="Bolsas em andamento" value={String(bolsasAtivas.length)} color="#22c55e" bg="rgba(34,197,94,0.12)" />
                <Metric label="Valor mensal ativo" value={formatCurrency(valorMensalAtivo)} color="#f59e0b" bg="rgba(245,158,11,0.12)" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <InfoCard title="Projetos em que a pessoa está presente" subtitle="Vínculos da pessoa com iniciativas/projetos captados.">
                  {projetos.length === 0 ? (
                    <EmptyState text="Nenhum projeto vinculado." />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {projetos.map((item, index) => (
                        <div key={`${item.nome}-${index}`} style={rowCardStyle}>
                          <ListCell label="Projeto" value={item.nome} detail={item.programa} strong />
                          <ListCell label="Papel" value={item.papel} detail={`${item.inicio} a ${item.fim}`} />
                          <ListCell label="Status" value={item.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </InfoCard>

                <InfoCard title="Bolsas recebidas ou em recebimento" subtitle="Histórico e bolsas ativas associadas à pessoa.">
                  {bolsas.length === 0 ? (
                    <EmptyState text="Nenhuma bolsa registrada." />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {bolsas.map((item, index) => (
                        <div key={`${item.projeto}-${index}`} style={rowCardStyle}>
                          <ListCell label="Bolsa" value={`${item.modalidade} · ${item.nivel}`} detail={item.projeto} strong />
                          <ListCell label="Valor mensal" value={formatCurrency(item.valorMensal)} detail={`${item.inicio} a ${item.fim}`} />
                          <ListCell label="Status" value={item.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </InfoCard>
              </div>
            </>
          )}

          {(!selected || detailTab === 'cadastro') && (
            <>
              <FormSection number="1" title="Identificação" subtitle="Dados obrigatórios para identificar unicamente a pessoa.">
                <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gap: '16px', marginBottom: '16px' }}>
                  <Field label="CPF" value={draft.cpf} onChange={value => updateDraft('cpf', maskCpf(value))} placeholder="000.000.000-00" />
                  <Field label="Nome completo" value={draft.nome} onChange={value => updateDraft('nome', value)} placeholder="Nome da pessoa" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr 0.6fr', gap: '16px' }}>
                  <Field label="Email" value={draft.email} onChange={value => updateDraft('email', value)} placeholder="email@dominio.com" />
                  <Field label="Telefone" value={draft.telefone} onChange={value => updateDraft('telefone', value)} placeholder="(00) 00000-0000" />
                  <Field label="Data de nascimento" value={draft.dataNascimento} onChange={value => updateDraft('dataNascimento', value)} placeholder="AAAA-MM-DD" />
                </div>
              </FormSection>

              <FormSection number="2" title="Dados Acadêmicos e Situação" subtitle="Informações complementares e controle de suspensão/reativação.">
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '16px', marginBottom: '16px' }}>
                  <Field label="Currículo Lattes" value={draft.lattes} onChange={value => updateDraft('lattes', value)} placeholder="URL do currículo Lattes" />
                  <Select label="Estado" value={draft.estado} onChange={value => updateDraft('estado', value)} options={['Ativa', 'Suspensa']} />
                </div>
                <Field label="Justificativa" value={draft.justificativa || ''} onChange={value => updateDraft('justificativa', value)} placeholder="Obrigatória para suspensão e reativação" />
              </FormSection>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                {selected && (
                  <button type="button" onClick={removeDraft} style={dangerButtonStyle}>
                    <Trash2 size={15} />
                    Remover
                  </button>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flex: 1 }}>
                  <button type="button" onClick={() => { setShowForm(false); setSelected(null); }} style={secondaryButtonStyle}>Cancelar</button>
                  <button type="button" onClick={saveDraft} style={primaryButtonStyle}>
                    <Save size={15} />
                    Salvar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <PageHeader title="Pessoas Físicas" subtitle="Gerencie cadastros de pessoas, CPF único, situação e dados complementares." onBack={onBack} onAdd={openNew} addLabel="Nova Pessoa" />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} labels={[['listagem', 'Pessoas'], ['dashboard', 'Dashboard']]} />

        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <Metric label="Total de pessoas" value={String(metrics.total)} color="#ffffff" bg="rgba(255,255,255,0.08)" />
            <Metric label="Ativas" value={String(metrics.ativas)} color="#22c55e" bg="rgba(34,197,94,0.12)" />
            <Metric label="Suspensas" value={String(metrics.suspensas)} color="#f59e0b" bg="rgba(245,158,11,0.12)" />
            <Metric label="Com Lattes" value={String(metrics.comLattes)} color="#38bdf8" bg="rgba(56,189,248,0.12)" />
          </div>
        )}

        {activeTab === 'listagem' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Pesquisar</label>
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="Buscar por nome, CPF ou email..." value={searchTerm} onChange={event => setSearchTerm(event.target.value)} style={{ ...inputStyle, paddingLeft: '36px' }} />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map(item => (
                <button key={item.id} onClick={() => openDetails(item)} style={{ textAlign: 'left', backgroundColor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '18px 20px', cursor: 'pointer' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 1.2fr 0.8fr 0.7fr', gap: '18px', alignItems: 'start' }}>
                    <ListCell label="Pessoa" value={item.nome} detail={item.email} strong />
                    <ListCell label="CPF" value={item.cpf} />
                    <ListCell label="Contato" value={item.telefone || '-'} detail={item.lattes ? 'Lattes informado' : 'Sem Lattes'} />
                    <ListCell label="Nascimento" value={item.dataNascimento} />
                    <StatusPill estado={item.estado} />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Header: React.FC<{ title: string; subtitle: string; onBack: () => void }> = ({ title, subtitle, onBack }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px' }}>
    <button onClick={onBack} style={{ width: '36px', height: '36px', border: 'none', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
      <ArrowLeft size={18} style={{ color: '#00c1af' }} />
    </button>
    <div>
      <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 8px' }}>{title}</h1>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>{subtitle}</p>
    </div>
  </div>
);

const PageHeader: React.FC<{ title: string; subtitle: string; onBack: () => void; onAdd: () => void; addLabel: string }> = ({ title, subtitle, onBack, onAdd, addLabel }) => (
  <>
    <div className="mb-6">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', backgroundColor: 'rgba(30,41,59,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: 'rgba(0,193,175,0.15)', borderRadius: 'var(--radius)' }}>
            <UserRound size={18} style={{ color: '#00c1af' }} />
          </div>
          <div style={{ flex: 1, marginTop: '6px' }}>
            <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: '#ffffff', lineHeight: '1.5' }}>{title}</h1>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.5' }}>{subtitle}</p>
          </div>
        </div>
        <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#00c1af', border: 'none', borderRadius: 'var(--radius)', padding: '10px 18px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#0f172a', cursor: 'pointer', flexShrink: 0 }}>
          <Plus size={16} />
          {addLabel}
        </button>
      </div>
    </div>
    <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '20px 0 28px' }} />
  </>
);

const Tabs: React.FC<{ activeTab: string; setActiveTab: (tab: ActiveTab) => void; labels: Array<[ActiveTab, string]> }> = ({ activeTab, setActiveTab, labels }) => (
  <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '28px' }}>
    {labels.map(([id, label]) => (
      <button key={id} onClick={() => setActiveTab(id)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === id ? '2px solid #00c1af' : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === id ? '#00c1af' : 'rgba(255,255,255,0.6)', cursor: 'pointer', marginBottom: '-1px' }}>
        {label}
      </button>
    ))}
  </div>
);

const FormSection: React.FC<{ number: string; title: string; subtitle: string; children: React.ReactNode }> = ({ number, title, subtitle, children }) => (
  <div style={{ ...cardStyle(), marginBottom: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(0,193,175,0.15)', color: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{number}</div>
      <div>
        <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>{title}</h2>
        <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const InfoCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div style={cardStyle()}>
    <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>{title}</h2>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: '0 0 18px' }}>{subtitle}</p>
    {children}
  </div>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ border: '1px dashed rgba(255,255,255,0.14)', borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)' }}>
    {text}
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="text" value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} style={inputStyle} />
  </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select value={value} onChange={event => onChange(event.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

const Metric: React.FC<{ label: string; value: string; color: string; bg: string }> = ({ label, value, color, bg }) => (
  <div style={cardStyle()}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: bg, borderRadius: 'var(--radius)', flexShrink: 0 }}>
        <UserRound size={20} style={{ color }} />
      </div>
      <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{label}</p>
    </div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: '#ffffff', textAlign: 'center', margin: 0 }}>{value}</p>
  </div>
);

const ListCell: React.FC<{ label: string; value: string; detail?: string; strong?: boolean }> = ({ label, value, detail, strong }) => (
  <div>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: strong ? '#ffffff' : 'rgba(255,255,255,0.75)', fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', lineHeight: 1.4 }}>{value || '-'}</div>
    {detail && <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{detail}</div>}
  </div>
);

const StatusPill: React.FC<{ estado: EstadoPessoa }> = ({ estado }) => (
  <div>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Estado</div>
    <span style={{ display: 'inline-block', backgroundColor: `${estadoColor(estado)}20`, border: `1px solid ${estadoColor(estado)}`, borderRadius: '999px', padding: '3px 12px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: estadoColor(estado) }}>
      {estado}
    </span>
  </div>
);

const primaryButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#00c1af',
  border: 'none',
  borderRadius: 'var(--radius)',
  padding: '10px 16px',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: '#0f172a',
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 'var(--radius)',
  padding: '10px 16px',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'rgba(255,255,255,0.75)',
  cursor: 'pointer',
};

const dangerButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'transparent',
  border: '1px solid rgba(239,68,68,0.35)',
  borderRadius: 'var(--radius)',
  padding: '10px 16px',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: '#f87171',
  cursor: 'pointer',
};
