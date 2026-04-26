import React, { useMemo, useState } from 'react';
import { ArrowLeft, Database, Plus, Save, Search, Trash2 } from 'lucide-react';

type ReferenceTab = 'areas' | 'rubricas' | 'regioes' | 'finalidades';

interface AreaConhecimento {
  id: number;
  codigo: string;
  nome: string;
  nivel: string;
  superior: string;
}

interface RubricaFinanceira {
  id: number;
  codigo: string;
  descricao: string;
  categoriaOrcamentaria: string;
  ativa: boolean;
}

interface RegiaoCidade {
  id: number;
  regiao: string;
  descricao: string;
  cidade: string;
  codigoIBGE: string;
}

interface Finalidade {
  id: number;
  nome: string;
  descricao: string;
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

const initialAreas: AreaConhecimento[] = [
  { id: 1, codigo: '1.00.00.00-3', nome: 'Ciências Exatas e da Terra', nivel: 'Grande Área', superior: '' },
  { id: 2, codigo: '1.03.00.00-7', nome: 'Ciência da Computação', nivel: 'Área', superior: 'Ciências Exatas e da Terra' },
  { id: 3, codigo: '1.03.04.00-2', nome: 'Sistemas de Computação', nivel: 'Subárea', superior: 'Ciência da Computação' },
];

const initialRubricas: RubricaFinanceira[] = [
  { id: 1, codigo: '339018', descricao: 'Auxílio financeiro a estudantes', categoriaOrcamentaria: 'Bolsas', ativa: true },
  { id: 2, codigo: '339030', descricao: 'Material de consumo', categoriaOrcamentaria: 'Capital', ativa: true },
  { id: 3, codigo: '449052', descricao: 'Equipamentos e material permanente', categoriaOrcamentaria: 'Capital', ativa: true },
];

const initialRegioes: RegiaoCidade[] = [
  { id: 1, regiao: 'Grande Vitória', descricao: 'Região metropolitana do Espírito Santo', cidade: 'Vitória', codigoIBGE: '3205309' },
  { id: 2, regiao: 'Grande Vitória', descricao: 'Região metropolitana do Espírito Santo', cidade: 'Serra', codigoIBGE: '3205002' },
  { id: 3, regiao: 'Sul', descricao: 'Municípios do sul capixaba', cidade: 'Cachoeiro de Itapemirim', codigoIBGE: '3201209' },
];

const initialFinalidades: Finalidade[] = [
  { id: 1, nome: 'Pesquisa', descricao: 'Fomento a iniciativas de pesquisa científica e tecnológica.' },
  { id: 2, nome: 'Inovação', descricao: 'Fomento a iniciativas de inovação e transferência tecnológica.' },
  { id: 3, nome: 'Extensão', descricao: 'Fomento a iniciativas de extensão e difusão de conhecimento.' },
];

export const ReferenciasCorporativas: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<ReferenceTab>('areas');
  const [searchTerm, setSearchTerm] = useState('');
  const [areas, setAreas] = useState<AreaConhecimento[]>(initialAreas);
  const [rubricas, setRubricas] = useState<RubricaFinanceira[]>(initialRubricas);
  const [regioes, setRegioes] = useState<RegiaoCidade[]>(initialRegioes);
  const [finalidades, setFinalidades] = useState<Finalidade[]>(initialFinalidades);
  const [areaDraft, setAreaDraft] = useState<AreaConhecimento>({ id: 0, codigo: '', nome: '', nivel: 'Grande Área', superior: '' });
  const [rubricaDraft, setRubricaDraft] = useState<RubricaFinanceira>({ id: 0, codigo: '', descricao: '', categoriaOrcamentaria: '', ativa: true });
  const [regiaoDraft, setRegiaoDraft] = useState<RegiaoCidade>({ id: 0, regiao: '', descricao: '', cidade: '', codigoIBGE: '' });
  const [finalidadeDraft, setFinalidadeDraft] = useState<Finalidade>({ id: 0, nome: '', descricao: '' });

  const filteredAreas = areas.filter(item => matches(searchTerm, [item.codigo, item.nome, item.nivel, item.superior]));
  const filteredRubricas = rubricas.filter(item => matches(searchTerm, [item.codigo, item.descricao, item.categoriaOrcamentaria]));
  const filteredRegioes = regioes.filter(item => matches(searchTerm, [item.regiao, item.cidade, item.codigoIBGE]));
  const filteredFinalidades = finalidades.filter(item => matches(searchTerm, [item.nome, item.descricao]));

  const metrics = useMemo(() => ({
    areas: areas.length,
    rubricas: rubricas.length,
    regioes: new Set(regioes.map(item => item.regiao)).size,
    cidades: regioes.length,
    finalidades: finalidades.length,
  }), [areas, rubricas, regioes, finalidades]);

  const saveArea = () => {
    const item = { ...areaDraft, id: areaDraft.id || Date.now() };
    setAreas(prev => upsert(prev, item));
    setAreaDraft({ id: 0, codigo: '', nome: '', nivel: 'Grande Área', superior: '' });
  };

  const saveRubrica = () => {
    const item = { ...rubricaDraft, id: rubricaDraft.id || Date.now() };
    setRubricas(prev => upsert(prev, item));
    setRubricaDraft({ id: 0, codigo: '', descricao: '', categoriaOrcamentaria: '', ativa: true });
  };

  const saveRegiao = () => {
    const item = { ...regiaoDraft, id: regiaoDraft.id || Date.now() };
    setRegioes(prev => upsert(prev, item));
    setRegiaoDraft({ id: 0, regiao: '', descricao: '', cidade: '', codigoIBGE: '' });
  };

  const saveFinalidade = () => {
    const item = { ...finalidadeDraft, id: finalidadeDraft.id || Date.now() };
    setFinalidades(prev => upsert(prev, item));
    setFinalidadeDraft({ id: 0, nome: '', descricao: '' });
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <PageHeader title="Referências Corporativas" subtitle="Gerencie áreas de conhecimento, rubricas financeiras, cidades/regiões e finalidades." onBack={onBack} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '24px' }}>
          <Metric label="Áreas" value={String(metrics.areas)} />
          <Metric label="Rubricas" value={String(metrics.rubricas)} />
          <Metric label="Regiões" value={String(metrics.regioes)} />
          <Metric label="Cidades" value={String(metrics.cidades)} />
          <Metric label="Finalidades" value={String(metrics.finalidades)} />
        </div>

        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
          {[
            ['areas', 'Áreas de Conhecimento'],
            ['rubricas', 'Rubricas Financeiras'],
            ['regioes', 'Cidades e Regiões'],
            ['finalidades', 'Finalidades'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id as ReferenceTab)} style={{ padding: '12px 20px', background: 'none', border: 'none', borderBottom: activeTab === id ? '2px solid #00c1af' : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === id ? '#00c1af' : 'rgba(255,255,255,0.6)', cursor: 'pointer', marginBottom: '-1px' }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '22px' }}>
          <label style={labelStyle}>Pesquisar</label>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Buscar no cadastro selecionado..." value={searchTerm} onChange={event => setSearchTerm(event.target.value)} style={{ ...inputStyle, paddingLeft: '36px' }} />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          </div>
        </div>

        {activeTab === 'areas' && (
          <ReferenceSection title="Áreas de Conhecimento" subtitle="Classificação hierárquica CNPq: grande área, área, subárea e especialidade.">
            <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1fr 0.7fr 1fr auto', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
              <Field label="Código" value={areaDraft.codigo} onChange={value => setAreaDraft(prev => ({ ...prev, codigo: value }))} placeholder="1.03.00" />
              <Field label="Nome" value={areaDraft.nome} onChange={value => setAreaDraft(prev => ({ ...prev, nome: value }))} placeholder="Nome da área" />
              <Select label="Nível" value={areaDraft.nivel} onChange={value => setAreaDraft(prev => ({ ...prev, nivel: value }))} options={['Grande Área', 'Área', 'Subárea', 'Especialidade']} />
              <Field label="Superior" value={areaDraft.superior} onChange={value => setAreaDraft(prev => ({ ...prev, superior: value }))} placeholder="Área superior" />
              <SaveButton onClick={saveArea} />
            </div>
            <ReferenceList items={filteredAreas.map(item => ({ id: item.id, cols: [item.codigo, item.nome, item.nivel, item.superior || '-'], onEdit: () => setAreaDraft(item), onRemove: () => setAreas(prev => prev.filter(row => row.id !== item.id)) }))} labels={['Código', 'Nome', 'Nível', 'Superior']} />
          </ReferenceSection>
        )}

        {activeTab === 'rubricas' && (
          <ReferenceSection title="Rubricas Financeiras" subtitle="Rubricas usadas para classificar despesas e orçamentos nos módulos consumidores.">
            <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.2fr 0.9fr 0.5fr auto', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
              <Field label="Código" value={rubricaDraft.codigo} onChange={value => setRubricaDraft(prev => ({ ...prev, codigo: value }))} placeholder="339018" />
              <Field label="Descrição" value={rubricaDraft.descricao} onChange={value => setRubricaDraft(prev => ({ ...prev, descricao: value }))} placeholder="Descrição da rubrica" />
              <Field label="Categoria" value={rubricaDraft.categoriaOrcamentaria} onChange={value => setRubricaDraft(prev => ({ ...prev, categoriaOrcamentaria: value }))} placeholder="Categoria orçamentária" />
              <Select label="Ativa" value={rubricaDraft.ativa ? 'Sim' : 'Não'} onChange={value => setRubricaDraft(prev => ({ ...prev, ativa: value === 'Sim' }))} options={['Sim', 'Não']} />
              <SaveButton onClick={saveRubrica} />
            </div>
            <ReferenceList items={filteredRubricas.map(item => ({ id: item.id, cols: [item.codigo, item.descricao, item.categoriaOrcamentaria, item.ativa ? 'Ativa' : 'Inativa'], onEdit: () => setRubricaDraft(item), onRemove: () => setRubricas(prev => prev.filter(row => row.id !== item.id)) }))} labels={['Código', 'Descrição', 'Categoria', 'Situação']} />
          </ReferenceSection>
        )}

        {activeTab === 'regioes' && (
          <ReferenceSection title="Cidades e Regiões" subtitle="Regiões agrupam cidades, e cada cidade possui código IBGE.">
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 1fr 0.6fr auto', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
              <Field label="Região" value={regiaoDraft.regiao} onChange={value => setRegiaoDraft(prev => ({ ...prev, regiao: value }))} placeholder="Grande Vitória" />
              <Field label="Descrição" value={regiaoDraft.descricao} onChange={value => setRegiaoDraft(prev => ({ ...prev, descricao: value }))} placeholder="Descrição da região" />
              <Field label="Cidade" value={regiaoDraft.cidade} onChange={value => setRegiaoDraft(prev => ({ ...prev, cidade: value }))} placeholder="Vitória" />
              <Field label="Código IBGE" value={regiaoDraft.codigoIBGE} onChange={value => setRegiaoDraft(prev => ({ ...prev, codigoIBGE: value }))} placeholder="3205309" />
              <SaveButton onClick={saveRegiao} />
            </div>
            <ReferenceList items={filteredRegioes.map(item => ({ id: item.id, cols: [item.regiao, item.cidade, item.codigoIBGE, item.descricao || '-'], onEdit: () => setRegiaoDraft(item), onRemove: () => setRegioes(prev => prev.filter(row => row.id !== item.id)) }))} labels={['Região', 'Cidade', 'Código IBGE', 'Descrição']} />
          </ReferenceSection>
        )}

        {activeTab === 'finalidades' && (
          <ReferenceSection title="Finalidades" subtitle="Finalidades classificam parcerias e iniciativas em módulos consumidores.">
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.8fr auto', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
              <Field label="Nome" value={finalidadeDraft.nome} onChange={value => setFinalidadeDraft(prev => ({ ...prev, nome: value }))} placeholder="Pesquisa" />
              <Field label="Descrição" value={finalidadeDraft.descricao} onChange={value => setFinalidadeDraft(prev => ({ ...prev, descricao: value }))} placeholder="Descrição da finalidade" />
              <SaveButton onClick={saveFinalidade} />
            </div>
            <ReferenceList items={filteredFinalidades.map(item => ({ id: item.id, cols: [item.nome, item.descricao || '-'], onEdit: () => setFinalidadeDraft(item), onRemove: () => setFinalidades(prev => prev.filter(row => row.id !== item.id)) }))} labels={['Nome', 'Descrição']} />
          </ReferenceSection>
        )}
      </div>
    </div>
  );
};

const matches = (query: string, values: string[]) => {
  const normalized = query.toLowerCase();
  return values.some(value => value.toLowerCase().includes(normalized));
};

const upsert = <T extends { id: number }>(items: T[], item: T) => {
  const exists = items.some(row => row.id === item.id);
  return exists ? items.map(row => row.id === item.id ? item : row) : [...items, item];
};

const PageHeader: React.FC<{ title: string; subtitle: string; onBack: () => void }> = ({ title, subtitle, onBack }) => (
  <>
    <div className="mb-6">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', backgroundColor: 'rgba(30,41,59,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', flexShrink: 0, backgroundColor: 'rgba(0,193,175,0.15)', borderRadius: 'var(--radius)' }}>
          <Database size={18} style={{ color: '#00c1af' }} />
        </div>
        <div style={{ flex: 1, marginTop: '6px' }}>
          <h1 className="mb-3" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-weight-normal)', color: '#ffffff', lineHeight: '1.5' }}>{title}</h1>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.5' }}>{subtitle}</p>
        </div>
      </div>
    </div>
    <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '20px 0 28px' }} />
  </>
);

const ReferenceSection: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div style={cardStyle()}>
    <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: '#ffffff', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>{title}</h2>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', margin: '0 0 20px' }}>{subtitle}</p>
    {children}
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

const SaveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" onClick={onClick} style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#00c1af', border: 'none', borderRadius: 'var(--radius)', padding: '0 14px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#0f172a', cursor: 'pointer' }}>
    <Save size={15} />
    Salvar
  </button>
);

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={cardStyle()}>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.62)', margin: '0 0 12px' }}>{label}</p>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: '#ffffff', margin: 0 }}>{value}</p>
  </div>
);

const ReferenceList: React.FC<{ labels: string[]; items: Array<{ id: number; cols: string[]; onEdit: () => void; onRemove: () => void }> }> = ({ labels, items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: `${labels.map(() => '1fr').join(' ')} 88px`, gap: '12px', padding: '0 12px' }}>
      {labels.map(label => (
        <div key={label} style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)' }}>{label}</div>
      ))}
      <div />
    </div>
    {items.map(item => (
      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: `${item.cols.map(() => '1fr').join(' ')} 88px`, gap: '12px', alignItems: 'center', padding: '14px 12px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backgroundColor: 'rgba(15,23,42,0.35)' }}>
        {item.cols.map((col, index) => (
          <div key={`${item.id}-${index}`} style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: index === 0 ? '#ffffff' : 'rgba(255,255,255,0.72)', lineHeight: 1.4 }}>{col}</div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
          <button type="button" onClick={item.onEdit} style={{ width: '34px', height: '34px', border: '1px solid rgba(0,193,175,0.35)', borderRadius: 'var(--radius)', backgroundColor: 'rgba(0,193,175,0.1)', color: '#00c1af', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Editar">
            <Plus size={14} />
          </button>
          <button type="button" onClick={item.onRemove} style={{ width: '34px', height: '34px', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 'var(--radius)', backgroundColor: 'transparent', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Remover">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    ))}
  </div>
);
