import { Calendar, Users, ChevronRight, FolderKanban, Search } from 'lucide-react';
import { useState } from 'react';
import { Dropdown } from '@/app/components/Dropdown';

interface Project {
  id: string;
  editalNumber: string;
  status: 'Aberto' | 'Fechado' | 'Em Análise';
  title: string;
  description: string;
  deadline: string;
  validityPeriod: string;
  inscriptions: number;
  category: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    editalNumber: 'Edital Fapes Nº 27/2025',
    status: 'Aberto',
    title: 'Apoio à Editoração e Publicação de Periódicos Científicos',
    description: 'Apoio financeiro para publicação de periódicos científicos de instituições do Espírito Santo.',
    deadline: '01/06/2026',
    validityPeriod: '01/06/2026 - 01/06/2027',
    inscriptions: 42,
    category: 'Periódicos Científicos',
  },
  {
    id: '2',
    editalNumber: 'Edital Fapes Nº 15/2025',
    status: 'Aberto',
    title: 'Bolsas de Iniciação Científica - IC',
    description: 'Programa de bolsas para estudantes de graduação desenvolverem pesquisas científicas.',
    deadline: '15/07/2026',
    validityPeriod: '15/07/2026 - 15/07/2027',
    inscriptions: 128,
    category: 'Iniciação Científica',
  },
  {
    id: '3',
    editalNumber: 'Edital Fapes Nº 08/2025',
    status: 'Em Análise',
    title: 'Apoio a Eventos Científicos',
    description: 'Financiamento para realização de congressos, seminários e workshops científicos no ES.',
    deadline: '30/04/2026',
    validityPeriod: '30/04/2026 - 30/04/2027',
    inscriptions: 67,
    category: 'Eventos',
  },
  {
    id: '4',
    editalNumber: 'Edital Fapes Nº 03/2025',
    status: 'Fechado',
    title: 'Infraestrutura para Pesquisa',
    description: 'Aquisição de equipamentos e modernização de laboratórios de pesquisa.',
    deadline: '01/03/2026',
    validityPeriod: '01/03/2026 - 01/03/2027',
    inscriptions: 89,
    category: 'Infraestrutura',
  },
];

export function ProjectsListPage({ onNavigate }: { onNavigate?: (page: string, projectId?: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCoordinator, setSelectedCoordinator] = useState('');

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Aberto':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          color: 'rgb(16, 185, 129)',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'Fechado':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          color: 'rgb(239, 68, 68)',
          border: 'rgba(239, 68, 68, 0.3)',
        };
      case 'Em Análise':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          color: 'rgb(245, 158, 11)',
          border: 'rgba(245, 158, 11, 0.3)',
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          color: 'rgb(107, 114, 128)',
          border: 'rgba(107, 114, 128, 0.3)',
        };
    }
  };

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.editalNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || selectedStatus === 'todos' || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div 
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
      className="px-4 sm:px-6 md:px-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-6">
          <button
            className="p-2 transition-colors"
            style={{
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
            }}
            aria-label="Projetos"
          >
            <FolderKanban size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 
              style={{
                color: 'var(--foreground)',
                margin: 0,
                marginBottom: '0.5rem',
              }}
            >
              Projetos
            </h1>
            <p 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                margin: 0,
              }}
            >
              Acompanhe os projetos da sua instituição e suas informações.
            </p>
          </div>
        </div>
        
        {/* Divider */}
        <div 
          style={{
            height: '1px',
            backgroundColor: 'var(--border)',
            width: '100%',
          }}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div 
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {/* Search Field */}
          <div>
            <label 
              style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: '0.5rem',
              }}
            >
              Pesquisar
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Digite aqui"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  backgroundColor: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              />
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-foreground)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label 
              style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: '0.5rem',
              }}
            >
              Status
            </label>
            <Dropdown
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: '', label: 'Todos' },
                { value: 'Aberto', label: 'Aberto' },
                { value: 'Em Análise', label: 'Em Análise' },
                { value: 'Fechado', label: 'Fechado' },
              ]}
              placeholder="Selecione"
            />
          </div>

          {/* Type Dropdown */}
          <div>
            <label 
              style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: '0.5rem',
              }}
            >
              Tipo
            </label>
            <Dropdown
              value={selectedType}
              onChange={setSelectedType}
              options={[
                { value: '', label: 'Todos' },
                { value: 'carreira-cientifica', label: 'Carreira Científica' },
                { value: 'pesquisa', label: 'Pesquisa' },
                { value: 'difusao-conhecimento', label: 'Difusão do Conhecimento' },
                { value: 'extensao', label: 'Extensão' },
                { value: 'inovacao', label: 'Inovação' },
                { value: 'chamadas-internacionais', label: 'Chamadas Internacionais' },
              ]}
              placeholder="Selecione"
            />
          </div>

          {/* Area Dropdown */}
          <div>
            <label 
              style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: '0.5rem',
              }}
            >
              Área
            </label>
            <Dropdown
              value={selectedArea}
              onChange={setSelectedArea}
              options={[
                { value: '', label: 'Todos' },
                { value: 'ciencias-exatas', label: 'Ciências Exatas e da Terra' },
                { value: 'ciencias-biologicas', label: 'Ciências Biológicas' },
                { value: 'engenharias', label: 'Engenharias' },
                { value: 'ciencias-saude', label: 'Ciências da Saúde' },
                { value: 'ciencias-agrarias', label: 'Ciências Agrárias' },
                { value: 'ciencias-sociais', label: 'Ciências Sociais Aplicadas' },
                { value: 'ciencias-humanas', label: 'Ciências Humanas' },
                { value: 'linguistica', label: 'Linguística, Letras e Artes' },
              ]}
              placeholder="Selecione"
            />
          </div>

          {/* Coordinator Dropdown */}
          <div>
            <label 
              style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                marginBottom: '0.5rem',
              }}
            >
              Coordenador
            </label>
            <Dropdown
              value={selectedCoordinator}
              onChange={setSelectedCoordinator}
              options={[
                { value: '', label: 'Todos' },
                { value: 'ana-silva', label: 'Ana Silva' },
                { value: 'carlos-santos', label: 'Carlos Santos' },
                { value: 'fernanda-oliveira', label: 'Fernanda Oliveira' },
                { value: 'joao-pereira', label: 'João Pereira' },
                { value: 'maria-costa', label: 'Maria Costa' },
                { value: 'pedro-almeida', label: 'Pedro Almeida' },
                { value: 'renata-souza', label: 'Renata Souza' },
                { value: 'roberto-lima', label: 'Roberto Lima' },
              ]}
              placeholder="Selecione"
            />
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div 
        style={{
          display: 'grid',
          gap: '1.5rem',
        }}
      >
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => {
              // Navigate to project details only if status is "Aberto"
              if (project.status === 'Aberto' && onNavigate) {
                onNavigate('project-details', project.id);
              }
            }}
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              cursor: project.status === 'Aberto' ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (project.status === 'Aberto') {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (project.status === 'Aberto') {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {/* Header with Edital Number and Status */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span 
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--primary)',
                  }}
                >
                  {project.editalNumber}
                </span>
                
                <span 
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: getStatusColor(project.status).color,
                    backgroundColor: getStatusColor(project.status).bg,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    border: `1.5px solid ${getStatusColor(project.status).border}`,
                  }}
                >
                  {project.status}
                </span>
              </div>
              
              <ChevronRight 
                size={20} 
                style={{ color: 'var(--muted-foreground)' }}
              />
            </div>

            {/* Title */}
            <h3 
              style={{
                color: 'var(--card-foreground)',
                margin: 0,
                marginBottom: '0.5rem',
              }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                lineHeight: '1.5',
                marginBottom: '1rem',
              }}
            >
              {project.description}
            </p>

            {/* Footer with metadata */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Calendar 
                  size={16} 
                  style={{ color: 'var(--muted-foreground)' }}
                />
                <span 
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Período de Vigência: {project.validityPeriod}
                </span>
              </div>

              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Users 
                  size={16} 
                  style={{ color: 'var(--muted-foreground)' }}
                />
                <span 
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {project.inscriptions} Bolsistas
                </span>
              </div>

              <span 
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--primary)',
                  backgroundColor: 'rgba(34, 211, 238, 0.1)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--primary)',
                }}
              >
                {project.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}