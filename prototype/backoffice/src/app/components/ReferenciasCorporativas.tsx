import React, { useMemo, useState } from 'react';
import { Database, Plus, Save, Search, Trash2 } from 'lucide-react';
import { ConfiguracoesPageHeader } from './ConfiguracoesPageHeader';

type ReferenceTab = 'areas' | 'rubricas' | 'diarias' | 'tiposViagem' | 'regioes' | 'finalidades';

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
  nome: string;
  descricao: string;
  naturezaDespesa: 'CUSTEIO' | 'CAPITAL';
  rubricaPaiId?: number;
  ativa: boolean;
}

interface ValorDiaria {
  id: number;
  codigo: string;
  tipoViagem: string;
  valor: string;
  fracaoCalculo: string;
  vigenciaInicio: string;
  situacao: boolean;
}

interface TipoViagem {
  id: number;
  codigo: string;
  nome: string;
  abrangencia: string;
  descricao: string;
  situacao: string;
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
  backgroundColor: 'var(--dash-input-bg)',
  border: '1px solid var(--dash-input-border)',
  borderRadius: '6px',
  padding: '10px 12px',
  color: 'var(--dash-text-primary)',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--text-sm)',
  color: 'var(--dash-text-secondary)',
  marginBottom: '8px',
};

const cardStyle = (): React.CSSProperties => ({
  backgroundColor: 'var(--dash-card-bg)',
  border: '1px solid var(--dash-card-border)',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: 'var(--dash-shadow)',
});

const initialAreas: AreaConhecimento[] = [
  { id: 1, codigo: '1.00.00.00-3', nome: 'Ciências Exatas e da Terra', nivel: 'Grande Área', superior: '' },
  { id: 2, codigo: '1.03.00.00-7', nome: 'Ciência da Computação', nivel: 'Área', superior: 'Ciências Exatas e da Terra' },
  { id: 3, codigo: '1.03.04.00-2', nome: 'Sistemas de Computação', nivel: 'Subárea', superior: 'Ciência da Computação' },
];

const initialRubricas: RubricaFinanceira[] = [
  { id: 1, codigo: 'RUB-BOLSAS', nome: 'Bolsas', descricao: 'Apoio financeiro por modalidade e nível de bolsa.', naturezaDespesa: 'CUSTEIO', ativa: true },
  { id: 2, codigo: 'RUB-DIARIAS', nome: 'Diárias', descricao: 'Diárias estaduais, nacionais e internacionais vinculadas ao projeto.', naturezaDespesa: 'CUSTEIO', ativa: true },
  { id: 3, codigo: 'RUB-DIARIA-ES', nome: 'Diária dentro do Estado', descricao: 'Deslocamentos dentro do Espírito Santo.', naturezaDespesa: 'CUSTEIO', rubricaPaiId: 2, ativa: true },
  { id: 4, codigo: 'RUB-MAT-CONSUMO', nome: 'Material de Consumo', descricao: 'Insumos e materiais consumíveis usados no projeto.', naturezaDespesa: 'CUSTEIO', ativa: true },
  { id: 5, codigo: 'RUB-MAT-PERM', nome: 'Material Permanente', descricao: 'Bens permanentes e equipamentos incorporáveis.', naturezaDespesa: 'CAPITAL', ativa: true },
];

const initialDiarias: ValorDiaria[] = [
  { id: 1, codigo: 'DIA-2026-001', tipoViagem: 'Dentro do Estado', valor: 'R$ 260,00', fracaoCalculo: '12h', vigenciaInicio: '05/01/2026', situacao: true },
  { id: 2, codigo: 'DIA-2026-002', tipoViagem: 'Fora do Estado', valor: 'R$ 320,00', fracaoCalculo: '12h', vigenciaInicio: '05/01/2026', situacao: true },
  { id: 3, codigo: 'DIA-2026-003', tipoViagem: 'Internacional', valor: 'US$ 210,00', fracaoCalculo: '24h', vigenciaInicio: '05/01/2026', situacao: true },
];

const initialTiposViagem: TipoViagem[] = [
  { id: 1, codigo: 'TVI-001', nome: 'Dentro do Estado', abrangencia: 'Nacional', descricao: 'Deslocamento dentro do Espírito Santo.', situacao: 'Ativo' },
  { id: 2, codigo: 'TVI-002', nome: 'Fora do Estado', abrangencia: 'Nacional', descricao: 'Deslocamento nacional para fora do Espírito Santo.', situacao: 'Ativo' },
  { id: 3, codigo: 'TVI-003', nome: 'Internacional', abrangencia: 'Internacional', descricao: 'Deslocamento para fora do Brasil.', situacao: 'Ativo' },
];

const initialRegioes: RegiaoCidade[] = [
  { id: 1, regiao: 'Grande Vitória', descricao: 'Região metropolitana do Espírito Santo', cidade: 'Vitória', codigoIBGE: '3205309' },
  { id: 2, regiao: 'Grande Vitória', descricao: 'Região metropolitana do Espírito Santo', cidade: 'Serra', codigoIBGE: '3205002' },
  { id: 3, regiao: 'Sul', descricao: 'Municípios do sul capixaba', cidade: 'Cachoeiro de Itapemirim', codigoIBGE: '3201209' },
];

const initialFinalidades: Finalidade[] = [
  { id: 1, nome: 'Pesquisa', descricao: 'Fomento a projetos de pesquisa científica e tecnológica.' },
  { id: 2, nome: 'Inovação', descricao: 'Fomento a projetos de inovação e transferência tecnológica.' },
  { id: 3, nome: 'Extensão', descricao: 'Fomento a projetos de extensão e difusão de conhecimento.' },
];

export const ReferenciasCorporativas: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<ReferenceTab>('areas');
  const [searchTerm, setSearchTerm] = useState('');
  const [areas, setAreas] = useState<AreaConhecimento[]>(initialAreas);
  const [rubricas, setRubricas] = useState<RubricaFinanceira[]>(initialRubricas);
  const [diarias, setDiarias] = useState<ValorDiaria[]>(initialDiarias);
  const [tiposViagem, setTiposViagem] = useState<TipoViagem[]>(initialTiposViagem);
  const [regioes, setRegioes] = useState<RegiaoCidade[]>(initialRegioes);
  const [finalidades, setFinalidades] = useState<Finalidade[]>(initialFinalidades);
  const [areaDraft, setAreaDraft] = useState<AreaConhecimento>({ id: 0, codigo: '', nome: '', nivel: 'Grande Área', superior: '' });
  const [rubricaDraft, setRubricaDraft] = useState<RubricaFinanceira>({ id: 0, codigo: '', nome: '', descricao: '', naturezaDespesa: 'CUSTEIO', rubricaPaiId: undefined, ativa: true });
  const [diariaDraft, setDiariaDraft] = useState<ValorDiaria>({ id: 0, codigo: '', tipoViagem: 'Dentro do Estado', valor: '', fracaoCalculo: '12h', vigenciaInicio: '', situacao: true });
  const [tipoViagemDraft, setTipoViagemDraft] = useState<TipoViagem>({ id: 0, codigo: '', nome: '', abrangencia: 'Nacional', descricao: '', situacao: 'Ativo' });
  const [regiaoDraft, setRegiaoDraft] = useState<RegiaoCidade>({ id: 0, regiao: '', descricao: '', cidade: '', codigoIBGE: '' });
  const [finalidadeDraft, setFinalidadeDraft] = useState<Finalidade>({ id: 0, nome: '', descricao: '' });

  const filteredAreas = areas.filter(item => matches(searchTerm, [item.codigo, item.nome, item.nivel, item.superior]));
  const filteredRubricas = rubricas.filter(item => {
    const parentName = item.rubricaPaiId ? rubricas.find(parent => parent.id === item.rubricaPaiId)?.nome || '' : '';
    return matches(searchTerm, [item.codigo, item.nome, item.descricao, item.naturezaDespesa, parentName, item.ativa ? 'Ativa' : 'Inativa']);
  });
  const filteredDiarias = diarias.filter(item => matches(searchTerm, [item.codigo, item.tipoViagem, item.valor, item.fracaoCalculo, item.vigenciaInicio, item.situacao ? 'Ativo' : 'Inativo']));
  const filteredTiposViagem = tiposViagem.filter(item => matches(searchTerm, [item.codigo, item.nome, item.abrangencia, item.descricao, item.situacao]));
  const filteredRegioes = regioes.filter(item => matches(searchTerm, [item.regiao, item.cidade, item.codigoIBGE]));
  const filteredFinalidades = finalidades.filter(item => matches(searchTerm, [item.nome, item.descricao]));

  const metrics = useMemo(() => ({
    areas: areas.length,
    rubricas: rubricas.length,
    diarias: diarias.length,
    tiposViagem: tiposViagem.length,
    regioes: new Set(regioes.map(item => item.regiao)).size,
    cidades: regioes.length,
    finalidades: finalidades.length,
  }), [areas, rubricas, diarias, tiposViagem, regioes, finalidades]);

  const saveArea = () => {
    const item = { ...areaDraft, id: areaDraft.id || Date.now() };
    setAreas(prev => upsert(prev, item));
    setAreaDraft({ id: 0, codigo: '', nome: '', nivel: 'Grande Área', superior: '' });
  };

  const saveRubrica = () => {
    const item = { ...rubricaDraft, id: rubricaDraft.id || Date.now() };
    setRubricas(prev => upsert(prev, item));
    setRubricaDraft({ id: 0, codigo: '', nome: '', descricao: '', naturezaDespesa: 'CUSTEIO', rubricaPaiId: undefined, ativa: true });
  };

  const saveDiaria = () => {
    const item = { ...diariaDraft, id: diariaDraft.id || Date.now() };
    setDiarias(prev => upsert(prev, item));
    setDiariaDraft({ id: 0, codigo: '', tipoViagem: 'Dentro do Estado', valor: '', fracaoCalculo: '12h', vigenciaInicio: '', situacao: true });
  };

  const saveTipoViagem = () => {
    const item = { ...tipoViagemDraft, id: tipoViagemDraft.id || Date.now() };
    setTiposViagem(prev => upsert(prev, item));
    setTipoViagemDraft({ id: 0, codigo: '', nome: '', abrangencia: 'Nacional', descricao: '', situacao: 'Ativo' });
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
    <div style={{ backgroundColor: 'var(--dash-page-bg)', minHeight: '100vh' }}>
      <div className="pt-8 px-8 pb-8">
        <ConfiguracoesPageHeader
          title="Referências Corporativas"
          subtitle="Gerencie áreas de conhecimento, rubricas financeiras, diárias por tipo de viagem, cidades/regiões e finalidades."
          icon={Database}
          onBack={onBack}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '14px', marginBottom: '24px' }}>
          <Metric label="Áreas" value={String(metrics.areas)} />
          <Metric label="Rubricas" value={String(metrics.rubricas)} />
          <Metric label="Diárias" value={String(metrics.diarias)} />
          <Metric label="Tipos de Viagem" value={String(metrics.tiposViagem)} />
          <Metric label="Regiões" value={String(metrics.regioes)} />
          <Metric label="Cidades" value={String(metrics.cidades)} />
          <Metric label="Finalidades" value={String(metrics.finalidades)} />
        </div>

        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--dash-divider)', marginBottom: '24px' }}>
          {[
            ['areas', 'Áreas de Conhecimento'],
            ['rubricas', 'Rubricas Financeiras'],
            ['diarias', 'Diárias'],
            ['tiposViagem', 'Tipos de Viagem'],
            ['regioes', 'Cidades e Regiões'],
            ['finalidades', 'Finalidades'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id as ReferenceTab)} style={{ padding: '12px 20px', background: 'none', border: 'none', borderBottom: activeTab === id ? '2px solid #00c1af' : '2px solid transparent', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: activeTab === id ? '#00c1af' : 'var(--dash-text-secondary)', cursor: 'pointer', marginBottom: '-1px' }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '22px' }}>
          <label style={labelStyle}>Pesquisar</label>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Buscar" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} style={{ ...inputStyle, paddingRight: '36px' }} />
            <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--dash-icon-subdued)' }} />
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
            <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1fr 1.4fr 0.8fr 0.9fr 0.5fr auto', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
              <Field label="Código" value={rubricaDraft.codigo} onChange={value => setRubricaDraft(prev => ({ ...prev, codigo: value.toUpperCase() }))} placeholder="RUB-DIARIAS" />
              <Field label="Nome" value={rubricaDraft.nome} onChange={value => setRubricaDraft(prev => ({ ...prev, nome: value }))} placeholder="Diárias" />
              <Field label="Descrição" value={rubricaDraft.descricao} onChange={value => setRubricaDraft(prev => ({ ...prev, descricao: value }))} placeholder="Descrição da rubrica" />
              <Select label="Natureza" value={rubricaDraft.naturezaDespesa} onChange={value => setRubricaDraft(prev => ({ ...prev, naturezaDespesa: value as RubricaFinanceira['naturezaDespesa'] }))} options={['CUSTEIO', 'CAPITAL']} />
              <Select label="Rubrica pai" value={rubricaDraft.rubricaPaiId ? String(rubricaDraft.rubricaPaiId) : ''} onChange={value => setRubricaDraft(prev => ({ ...prev, rubricaPaiId: value ? Number(value) : undefined }))} options={['', ...rubricas.filter(item => !item.rubricaPaiId && item.id !== rubricaDraft.id).map(item => String(item.id))]} labels={['Nenhuma', ...rubricas.filter(item => !item.rubricaPaiId && item.id !== rubricaDraft.id).map(item => item.nome)]} />
              <Select label="Ativa" value={rubricaDraft.ativa ? 'Sim' : 'Não'} onChange={value => setRubricaDraft(prev => ({ ...prev, ativa: value === 'Sim' }))} options={['Sim', 'Não']} />
              <SaveButton onClick={saveRubrica} />
            </div>
            <ReferenceList
              items={filteredRubricas.map(item => {
                const parent = item.rubricaPaiId ? rubricas.find(row => row.id === item.rubricaPaiId) : undefined;
                return {
                  id: item.id,
                  cols: [item.codigo, item.nome, item.naturezaDespesa, parent?.nome || 'Rubrica principal', item.ativa ? 'Ativa' : 'Inativa'],
                  onEdit: () => setRubricaDraft(item),
                  onRemove: () => setRubricas(prev => prev.filter(row => row.id !== item.id && row.rubricaPaiId !== item.id)),
                };
              })}
              labels={['Código', 'Nome', 'Natureza', 'Rubrica pai', 'Situação']}
            />
          </ReferenceSection>
        )}

        {activeTab === 'diarias' && (
          <ReferenceSection title="Diárias" subtitle="Cadastre o valor vigente da diária para cada tipo de viagem. O cálculo segue a normativa da FAPES.">
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 0.7fr 0.65fr 0.7fr 0.5fr auto', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
              <Field label="Código" value={diariaDraft.codigo} onChange={value => setDiariaDraft(prev => ({ ...prev, codigo: value }))} placeholder="DIA-2026-001" />
              <Select label="Tipo de viagem" value={diariaDraft.tipoViagem} onChange={value => setDiariaDraft(prev => ({ ...prev, tipoViagem: value }))} options={tiposViagem.map(item => item.nome)} />
              <Field label="Valor" value={diariaDraft.valor} onChange={value => setDiariaDraft(prev => ({ ...prev, valor: value }))} placeholder="R$ 260,00" />
              <Select label="Fração cálculo" value={diariaDraft.fracaoCalculo} onChange={value => setDiariaDraft(prev => ({ ...prev, fracaoCalculo: value }))} options={['12h', '24h']} />
              <Field label="Vigência inicial" value={diariaDraft.vigenciaInicio} onChange={value => setDiariaDraft(prev => ({ ...prev, vigenciaInicio: value }))} placeholder="05/01/2026" />
              <Select label="Situação" value={diariaDraft.situacao ? 'Ativo' : 'Inativo'} onChange={value => setDiariaDraft(prev => ({ ...prev, situacao: value === 'Ativo' }))} options={['Ativo', 'Inativo']} />
              <SaveButton onClick={saveDiaria} />
            </div>
            <ReferenceList items={filteredDiarias.map(item => ({ id: item.id, cols: [item.codigo, item.tipoViagem, item.valor, item.fracaoCalculo, item.vigenciaInicio, item.situacao ? 'Ativo' : 'Inativo'], onEdit: () => setDiariaDraft(item), onRemove: () => setDiarias(prev => prev.filter(row => row.id !== item.id)) }))} labels={['Código', 'Tipo de viagem', 'Valor', 'Fração cálculo', 'Vigência inicial', 'Situação']} />
          </ReferenceSection>
        )}

        {activeTab === 'tiposViagem' && (
          <ReferenceSection title="Tipos de Viagem" subtitle="Classifique o deslocamento operacional usado para vincular os valores de diária.">
            <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 0.9fr 0.7fr 1.4fr 0.5fr auto', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
              <Field label="Código" value={tipoViagemDraft.codigo} onChange={value => setTipoViagemDraft(prev => ({ ...prev, codigo: value }))} placeholder="TVI-001" />
              <Field label="Nome" value={tipoViagemDraft.nome} onChange={value => setTipoViagemDraft(prev => ({ ...prev, nome: value }))} placeholder="Dentro do Estado" />
              <Select label="Abrangência" value={tipoViagemDraft.abrangencia} onChange={value => setTipoViagemDraft(prev => ({ ...prev, abrangencia: value }))} options={['Nacional', 'Internacional']} />
              <Field label="Descrição" value={tipoViagemDraft.descricao} onChange={value => setTipoViagemDraft(prev => ({ ...prev, descricao: value }))} placeholder="Descrição do tipo de viagem" />
              <Select label="Situação" value={tipoViagemDraft.situacao} onChange={value => setTipoViagemDraft(prev => ({ ...prev, situacao: value }))} options={['Ativo', 'Inativo']} />
              <SaveButton onClick={saveTipoViagem} />
            </div>
            <ReferenceList items={filteredTiposViagem.map(item => ({ id: item.id, cols: [item.codigo, item.nome, item.abrangencia, item.descricao || '-', item.situacao], onEdit: () => setTipoViagemDraft(item), onRemove: () => setTiposViagem(prev => prev.filter(row => row.id !== item.id)) }))} labels={['Código', 'Nome', 'Abrangência', 'Descrição', 'Situação']} />
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
          <ReferenceSection title="Finalidades" subtitle="Finalidades classificam parcerias e projetos em módulos consumidores.">
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

const ReferenceSection: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div style={cardStyle()}>
    <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-primary)', fontWeight: 'var(--font-weight-medium)', margin: '0 0 6px' }}>{title}</h2>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: '0 0 20px' }}>{subtitle}</p>
    {children}
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="text" value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} style={inputStyle} />
  </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[]; labels?: string[] }> = ({ label, value, onChange, options, labels }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select value={value} onChange={event => onChange(event.target.value)} style={inputStyle}>
      {options.map((option, index) => <option key={option || 'empty'} value={option}>{labels?.[index] || option}</option>)}
    </select>
  </div>
);

const SaveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" onClick={onClick} style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#00c1af', border: 'none', borderRadius: 'var(--radius)', padding: '0 14px', fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: '#171717', cursor: 'pointer' }}>
    <Save size={15} />
    Salvar
  </button>
);

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={cardStyle()}>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: 'var(--dash-text-secondary)', margin: '0 0 12px' }}>{label}</p>
    <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-lg)', color: 'var(--dash-text-primary)', margin: 0 }}>{value}</p>
  </div>
);

const ReferenceList: React.FC<{ labels: string[]; items: Array<{ id: number; cols: string[]; onEdit: () => void; onRemove: () => void }> }> = ({ labels, items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: `${labels.map(() => '1fr').join(' ')} 88px`, gap: '12px', padding: '0 12px' }}>
      {labels.map(label => (
        <div key={label} style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-xs)', color: 'var(--dash-text-muted)' }}>{label}</div>
      ))}
      <div />
    </div>
    {items.map(item => (
      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: `${item.cols.map(() => '1fr').join(' ')} 88px`, gap: '12px', alignItems: 'center', padding: '14px 12px', border: '1px solid var(--dash-card-border)', borderRadius: '8px', backgroundColor: 'var(--dash-input-bg)' }}>
        {item.cols.map((col, index) => (
          <div key={`${item.id}-${index}`} style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--text-sm)', color: index === 0 ? 'var(--dash-text-primary)' : 'var(--dash-text-secondary)', lineHeight: 1.4 }}>{col}</div>
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
