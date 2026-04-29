import React, { useState } from 'react';
import { ArrowLeft, Banknote, BookOpenCheck, CheckCircle2, ClipboardList, FileCheck2, Landmark, Plus, ReceiptText, Search, Settings2, WalletCards } from 'lucide-react';
import { useThemeTokens, ThemeTokens } from '../theme/ThemeContext';

interface Props {
  onBack: () => void;
}

type Tab = 'reservas' | 'plano' | 'execucao' | 'prestacao' | 'regras';

const formatCurrency = (value: number) => (
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);

const formatPercent = (value: number) => (
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
);

const reservas = [
  {
    id: 'AT-2026-001',
    parceria: 'Cooperação Fapes-Ufes em Pesquisa Aplicada',
    origem: 'Aporte original',
    valorBase: 2500000,
    percentual: 4,
    valorReservado: 100000,
    contaContabil: '4.1.2.01 - Recursos institucionais vinculados',
    fundo: 'Fundo Ação Transversal 2026',
    centroCusto: 'Diretoria Técnico-Científica',
    status: 'Classificada',
  },
  {
    id: 'AT-2026-002',
    parceria: 'Parceria Fapes-Ifes para Inovação',
    origem: 'Aporte original',
    valorBase: 3800000,
    percentual: 4,
    valorReservado: 152000,
    contaContabil: 'Pendente',
    fundo: 'Pendente',
    centroCusto: 'Pendente',
    status: 'Pendente',
  },
  {
    id: 'AT-2026-003',
    parceria: 'Cooperação Fapes-USP em Saúde',
    origem: 'Aditivo financeiro 1',
    valorBase: 500000,
    percentual: 5,
    valorReservado: 25000,
    contaContabil: '4.1.2.01 - Recursos institucionais vinculados',
    fundo: 'Fundo Ação Transversal 2026',
    centroCusto: 'Assessoria de Cooperação',
    status: 'Em execução',
  },
];

const planoAplicacao = [
  { rubrica: 'Diárias e passagens', unidade: 'Diretoria Técnico-Científica', planejado: 52000, executado: 18400, saldo: 33600 },
  { rubrica: 'Publicações e eventos', unidade: 'Assessoria de Cooperação', planejado: 38000, executado: 12000, saldo: 26000 },
  { rubrica: 'Serviços de terceiros', unidade: 'Gerência de Programas', planejado: 47000, executado: 0, saldo: 47000 },
  { rubrica: 'Material permanente', unidade: 'Tecnologia da Informação', planejado: 25000, executado: 0, saldo: 25000 },
];

const execucoes = [
  { documento: 'NF 2026-184', rubrica: 'Diárias e passagens', favorecido: 'Servidor FAPES', data: '12/04/2026', valor: 8400, status: 'Aprovada' },
  { documento: 'REC 2026-041', rubrica: 'Publicações e eventos', favorecido: 'Organização de evento científico', data: '18/04/2026', valor: 12000, status: 'Em análise' },
  { documento: 'NF 2026-205', rubrica: 'Diárias e passagens', favorecido: 'Servidor FAPES', data: '22/04/2026', valor: 10000, status: 'Aprovada' },
];

export const AcaoTransversalFinanceiro: React.FC<Props> = ({ onBack }) => {
  const { T } = useThemeTokens();
  const [activeTab, setActiveTab] = useState<Tab>('reservas');
  const [search, setSearch] = useState('');
  const reservadoTotal = reservas.reduce((total, item) => total + item.valorReservado, 0);
  const classificado = reservas.filter(item => item.status !== 'Pendente').reduce((total, item) => total + item.valorReservado, 0);
  const planejado = planoAplicacao.reduce((total, item) => total + item.planejado, 0);
  const executado = planoAplicacao.reduce((total, item) => total + item.executado, 0);
  const saldo = reservadoTotal - executado;
  const reservasFiltradas = reservas.filter(item => `${item.parceria} ${item.id} ${item.origem}`.toLowerCase().includes(search.toLowerCase()));
  const cardStyle = buildCard(T);

  return (
    <div style={{ backgroundColor: T.bgPage, minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-16">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <button onClick={onBack} title="Voltar" style={iconButton(T)}>
              <ArrowLeft size={16} style={{ color: T.textSecondary }} />
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius)', backgroundColor: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Landmark size={18} style={{ color: T.accent }} />
            </div>
            <div style={{ flex: 1, marginTop: '4px' }}>
              <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-medium)', color: T.textPrimary, margin: '0 0 6px' }}>
                Contabilidade e Financeiro
              </h1>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textSecondary, margin: 0 }}>
                Gestão institucional da Ação Transversal recebida das parcerias.
              </p>
            </div>
            <button style={{ ...primaryButton(T), flexShrink: 0 }}>
              <Plus size={15} />
              Novo plano
            </button>
          </div>
          <div style={{ width: '100%', height: '1px', backgroundColor: T.borderSubtle, marginTop: '20px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Reservado total', value: formatCurrency(reservadoTotal), detail: `${reservas.length} reserva(s)`, Icon: Banknote, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
            { label: 'Classificado', value: formatCurrency(classificado), detail: 'Conta, fundo e centro definidos', Icon: Landmark, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
            { label: 'Planejado', value: formatCurrency(planejado), detail: `${formatPercent((planejado / reservadoTotal) * 100)} do reservado`, Icon: ClipboardList, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
            { label: 'Executado', value: formatCurrency(executado), detail: `${formatPercent((executado / reservadoTotal) * 100)} do reservado`, Icon: ReceiptText, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
            { label: 'Saldo institucional', value: formatCurrency(saldo), detail: 'Não retorna para programas', Icon: WalletCards, color: T.accent, bg: T.accentSoft },
          ].map(({ label, value, detail, Icon, color, bg }) => (
            <div key={label} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={19} style={{ color }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, margin: 0 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, margin: '3px 0 0' }}>{detail}</p>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', color: T.textPrimary, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${T.borderSubtle}`, marginBottom: '22px' }}>
          {[
            { id: 'reservas', label: 'Reservas', Icon: Banknote },
            { id: 'plano', label: 'Plano de Aplicação', Icon: ClipboardList },
            { id: 'execucao', label: 'Execução', Icon: ReceiptText },
            { id: 'prestacao', label: 'Prestação Financeira', Icon: FileCheck2 },
            { id: 'regras', label: 'Regras', Icon: Settings2 },
          ].map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id as Tab)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '12px 16px', background: 'none', border: 'none', borderBottom: active ? `2px solid ${T.accent}` : '2px solid transparent', color: active ? T.accent : T.textSecondary, fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', cursor: 'pointer', marginBottom: '-1px' }}>
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>

        {activeTab === 'reservas' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
              <div>
                <h2 style={sectionTitle(T)}>Reservas recebidas das parcerias</h2>
                <p style={sectionSubtitle(T)}>Valores calculados em Parcerias e aguardando ou mantendo classificação contábil no financeiro.</p>
              </div>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.iconSubdued }} />
                <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar parceria ou reserva" style={{ ...inputStyle(T), paddingLeft: '36px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reservasFiltradas.map(item => (
                <Row key={item.id} T={T} columns="0.8fr 2fr 1fr 1fr 1fr 1fr 1.2fr 1fr">
                  <Info T={T} label="Reserva" value={item.id} strong />
                  <Info T={T} label="Parceria" value={item.parceria} />
                  <Info T={T} label="Origem" value={item.origem} />
                  <Info T={T} label="Base" value={formatCurrency(item.valorBase)} />
                  <Info T={T} label="Percentual" value={formatPercent(item.percentual)} />
                  <Info T={T} label="Reservado" value={formatCurrency(item.valorReservado)} strong />
                  <Info T={T} label="Classificação" value={item.contaContabil} />
                  <StatusBadge status={item.status} />
                </Row>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'plano' && (
          <div style={cardStyle}>
            <h2 style={sectionTitle(T)}>Plano de Aplicação da Ação Transversal</h2>
            <p style={sectionSubtitle(T)}>É aqui que a FAPES informa como o percentual reservado será gasto por rubrica institucional.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr repeat(3, 1fr)', gap: '12px' }}>
              {planoAplicacao.map(item => (
                <React.Fragment key={item.rubrica}>
                  <PanelCell T={T} label="Rubrica" value={item.rubrica} />
                  <PanelCell T={T} label="Unidade responsável" value={item.unidade} />
                  <PanelCell T={T} label="Planejado" value={formatCurrency(item.planejado)} />
                  <PanelCell T={T} label="Executado" value={formatCurrency(item.executado)} />
                  <PanelCell T={T} label="Saldo" value={formatCurrency(item.saldo)} highlight />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'execucao' && (
          <div style={cardStyle}>
            <h2 style={sectionTitle(T)}>Execução financeira institucional</h2>
            <p style={sectionSubtitle(T)}>Registro das despesas feitas pela agência com recurso da Ação Transversal.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {execucoes.map(item => (
                <Row key={item.documento} T={T} columns="1fr 1.2fr 1.6fr 0.9fr 0.9fr 0.9fr">
                  <Info T={T} label="Documento" value={item.documento} strong />
                  <Info T={T} label="Rubrica" value={item.rubrica} />
                  <Info T={T} label="Favorecido" value={item.favorecido} />
                  <Info T={T} label="Data" value={item.data} />
                  <Info T={T} label="Valor" value={formatCurrency(item.valor)} strong />
                  <StatusBadge status={item.status} />
                </Row>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prestacao' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
            <div style={cardStyle}>
              <h2 style={sectionTitle(T)}>Prestação financeira da Ação Transversal</h2>
              <p style={sectionSubtitle(T)}>Prestação institucional do financeiro, separada da prestação de contas da iniciativa.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <PanelCell T={T} label="Reservado" value={formatCurrency(reservadoTotal)} />
                <PanelCell T={T} label="Planejado" value={formatCurrency(planejado)} />
                <PanelCell T={T} label="Executado aprovado" value={formatCurrency(18400)} />
                <PanelCell T={T} label="Em análise" value={formatCurrency(12000)} />
                <PanelCell T={T} label="Glosado" value={formatCurrency(0)} />
                <PanelCell T={T} label="Saldo remanescente" value={formatCurrency(saldo)} highlight />
              </div>
            </div>
            <div style={cardStyle}>
              <h2 style={sectionTitle(T)}>Fluxo de análise</h2>
              <p style={sectionSubtitle(T)}>Consolidação, parecer financeiro, glosas e encerramento.</p>
              {['Consolidar documentos', 'Analisar despesas', 'Emitir parecer financeiro', 'Encerrar prestação institucional'].map((step, index) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: index < 3 ? `1px solid ${T.borderSubtle}` : 'none' }}>
                  <CheckCircle2 size={17} style={{ color: index < 2 ? T.success : T.textMuted }} />
                  <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'regras' && (
          <div style={cardStyle}>
            <h2 style={sectionTitle(T)}>Políticas e faixas normativas</h2>
            <p style={sectionSubtitle(T)}>Cadastro parametrizado da Resolução CCAF nº 334/2023 e das rubricas permitidas.</p>
            <Row T={T} columns="1.4fr 1fr 1fr 1fr 2fr 0.8fr">
              <Info T={T} label="Norma" value="Resolução CCAF nº 334/2023" strong />
              <Info T={T} label="Faixa 1" value="5% até R$ 2 mi" />
              <Info T={T} label="Faixa 2" value="4% até R$ 5 mi" />
              <Info T={T} label="Faixa 3" value="3% acima de R$ 5 mi" />
              <Info T={T} label="Rubricas permitidas" value="Diárias, passagens, publicações, serviços e material permanente" />
              <StatusBadge status="Vigente" />
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

const buildCard = (T: ThemeTokens): React.CSSProperties => ({
  backgroundColor: T.bgCard,
  border: `1px solid ${T.borderSubtle}`,
  borderRadius: '10px',
  padding: '20px',
  boxShadow: T.shadowSm,
});

const iconButton = (T: ThemeTokens): React.CSSProperties => ({
  width: '36px',
  height: '36px',
  border: `1px solid ${T.borderSubtle}`,
  borderRadius: 'var(--radius)',
  backgroundColor: T.bgCard,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

const primaryButton = (T: ThemeTokens): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: T.accent,
  border: 'none',
  borderRadius: 'var(--radius)',
  padding: '10px 16px',
  color: T.accentText,
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
});

const inputStyle = (T: ThemeTokens): React.CSSProperties => ({
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
});

const sectionTitle = (T: ThemeTokens): React.CSSProperties => ({
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: T.textPrimary,
  fontWeight: 'var(--font-weight-medium)',
  margin: '0 0 6px',
});

const sectionSubtitle = (T: ThemeTokens): React.CSSProperties => ({
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: T.textSecondary,
  margin: '0 0 18px',
});

const Row: React.FC<{ T: ThemeTokens; columns: string; children: React.ReactNode }> = ({ T, columns, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: columns, gap: '12px', alignItems: 'start', padding: '14px', border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted }}>
    {children}
  </div>
);

const Info: React.FC<{ T: ThemeTokens; label: string; value: string; strong?: boolean }> = ({ T, label, value, strong }) => (
  <div style={{ minWidth: 0 }}>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '4px' }}>{label}</div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: T.textPrimary, fontWeight: strong ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', margin: 0, lineHeight: 1.45 }}>
      {value}
    </p>
  </div>
);

const PanelCell: React.FC<{ T: ThemeTokens; label: string; value: string; highlight?: boolean }> = ({ T, label, value, highlight }) => (
  <div style={{ padding: '14px', border: `1px solid ${T.borderSubtle}`, borderRadius: '8px', backgroundColor: T.bgSurfaceMuted }}>
    <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: T.textMuted, marginBottom: '5px' }}>{label}</div>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: highlight ? T.accent : T.textPrimary, fontWeight: highlight ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)', margin: 0 }}>
      {value}
    </p>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const color = status === 'Pendente' ? '#f59e0b' : status === 'Em análise' ? '#38bdf8' : status === 'Vigente' || status === 'Aprovada' || status === 'Classificada' ? '#22c55e' : '#00c1af';
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Status</div>
      <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: '24px', padding: '4px 9px', borderRadius: '999px', backgroundColor: `${color}20`, color, fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}>
        {status}
      </span>
    </div>
  );
};
