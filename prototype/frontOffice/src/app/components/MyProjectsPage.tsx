import { FolderKanban, ChevronDown, Tag, ListChecks, Target, Zap, Clock, Send, FileText, UserCheck, FileEdit, CheckCircle, PlayCircle, Award, Wallet, GraduationCap, Package, Box, Plane, Hotel, Building2, DollarSign, PauseCircle, XCircle, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type AccessType = 'voluntario' | 'bolsista' | 'proponente' | 'coordenador';

interface MyProjectsPageProps {
  accessType?: AccessType;
  hideHeader?: boolean;
}

export function MyProjectsPage({ accessType = 'bolsista', hideHeader = false }: MyProjectsPageProps) {
  const { t } = useLanguage();
  const [isWorkPlanExpanded, setIsWorkPlanExpanded] = useState(false);
  const [budgetTooltip, setBudgetTooltip] = useState<{ name: string; x: number } | null>(null);
  const timelineActiveColor = '#0e7490';
  const timelineCurrentColor = '#22d3ee';

  const projectStages = [
    { id: 1, label: 'Submissão', date: '15/01/2024', icon: Send, status: 'completed' },
    { id: 2, label: 'Avaliação de Documentos', date: '20/01/2024', icon: FileText, status: 'completed' },
    { id: 3, label: 'Avaliação Ad Hoc', date: '05/02/2024', icon: UserCheck, status: 'completed' },
    { id: 4, label: 'Em Contratação', date: '20/02/2024', icon: FileEdit, status: 'completed' },
    { id: 5, label: 'Contratado', date: '01/03/2024', icon: CheckCircle, status: 'completed' },
    { id: 6, label: 'Em Execução', date: '16/03/2024', icon: PlayCircle, status: 'current' },
    { id: 7, label: 'Em Aprovação de Contas', date: '', icon: DollarSign, status: 'pending' },
    { id: 8, label: 'Concluído', date: '', icon: Award, status: 'pending' },
  ];

  const projectData = [
    { label: accessType === 'voluntario' || accessType === 'bolsista' ? 'Modalidade da Bolsa' : 'Nível', value: accessType === 'voluntario' || accessType === 'bolsista' ? 'BPIG-VIII' : 'V - Atualizada' },
    { label: 'Valor', value: 'R$ 700,00' },
    { label: 'Período de Vigência', value: '01/06/2025 - 01/06/2026' },
    { label: 'Status da Bolsa', value: 'Ativa', badge: true },
  ];

  const projectTermData = {
    dataInicio: '01/03/2024',
    dataFimVigente: '31/08/2026',
  };

  const budgetCategories = [
    {
      name: 'Bolsa',
      total: 'R$ 4.738.032,00',
      consumido: 'R$ 2.100.000,00',
      alocado: 'R$ 1.122.000,00',
      disponivel: 'R$ 1.516.032,00',
      consumidoPercent: 44,
      alocadoPercent: 24,
      Icon: GraduationCap,
      accentColor: '#60a5fa',
    },
    {
      name: 'Diária',
      total: 'R$ 60.000,00',
      consumido: 'R$ 22.432,00',
      alocado: 'R$ 12.080,00',
      disponivel: 'R$ 25.488,00',
      consumidoPercent: 37,
      alocadoPercent: 20,
      Icon: Hotel,
      accentColor: 'var(--primary)',
    },
    {
      name: 'Material Permanente',
      total: 'R$ 500.000,00',
      consumido: 'R$ 180.000,00',
      alocado: null,
      disponivel: 'R$ 267.575,00',
      consumidoPercent: 46,
      alocadoPercent: 0,
      Icon: Package,
      accentColor: 'var(--primary)',
    },
    {
      name: 'Material de Consumo',
      total: 'R$ 260.000,00',
      consumido: 'R$ 150.992,80',
      alocado: null,
      disponivel: 'R$ 73.007,20',
      consumidoPercent: 72,
      alocadoPercent: 0,
      Icon: Box,
      accentColor: 'var(--primary)',
    },
    {
      name: 'Passagem',
      total: 'R$ 85.000,00',
      consumido: 'R$ 28.616,00',
      alocado: null,
      disponivel: 'R$ 45.384,00',
      consumidoPercent: 47,
      alocadoPercent: 0,
      Icon: Plane,
      accentColor: 'var(--primary)',
    },
    {
      name: 'Pessoa Jurídica',
      total: 'R$ 1.650.000,00',
      consumido: 'R$ 1.137.502,00',
      alocado: null,
      disponivel: 'R$ 312.498,00',
      consumidoPercent: 81,
      alocadoPercent: 0,
      Icon: Building2,
      accentColor: 'var(--primary)',
    },
    {
      name: 'Pessoa Física',
      total: 'R$ 0,00',
      consumido: 'R$ 0,00',
      alocado: null,
      disponivel: 'R$ 0,00',
      consumidoPercent: 0,
      alocadoPercent: 0,
      Icon: UserCheck,
      accentColor: 'var(--primary)',
    },
  ];

  const activities = [
    {
      id: 'A.1',
      title: 'Apoio na elicitação de requisitos com stakeholders',
      description: 'Dar suporte na preparação, condução e registro de reuniões com stakeholders, utilizando técnicas como entrevistas, brainstorming, observação direta e workshops, com foco na identificação precisa das necessidades de negócio da plataforma Conecta FAPES.'
    },
    {
      id: 'A.2',
      title: 'Colaboração na modelagem de requisitos',
      description: 'Auxiliar na elaboração de artefatos de análise, como diagramas de casos de uso, diagramas de classe, fluxogramas, mapas de processo (BPMN) e protótipos de tela, apoiando o entendimento sistêmico e a comunicação entre as partes envolvidas no projeto.'
    },
    {
      id: 'A.3',
      title: 'Suporte na documentação técnica e funcional',
      description: 'Acompanhar a redação e manutenção da documentação de requisitos funcionais e não funcionais, especificações de regras de negócio, critérios de aceitação e glossários, assegurando padronização e versionamento adequado.'
    },
    {
      id: 'A.4',
      title: 'Apoio na validação de requisitos com usuários',
      description: 'Auxiliar a organização e execução de atividades de validação de requisitos com os usuários finais e stakeholders, por meio de apresentações, testes de protótipos e ciclos de feedback, garantindo o alinhamento entre as expectativas e a solução a ser desenvolvida.'
    },
    {
      id: 'A.5',
      title: 'Participação em reuniões de planejamento e acompanhamento',
      description: 'Participar de reuniões de planejamento de sprints, cerimônias ágeis (daily standups, planning, review e retrospective) e demais eventos de acompanhamento do projeto, contribuindo ativamente com a visão da Engenharia de Requisitos e apoiando a tomada de decisões.'
    },
    {
      id: 'A.6',
      title: 'Assistência na gestão de mudanças de requisitos',
      description: 'Auxiliar no registro, análise e controle de mudanças de requisitos, avaliando impactos, priorizações e riscos associados, de modo a apoiar a rastreabilidade e o controle de alterações durante o ciclo de vida do sistema.'
    },
  ];

  return (
    <div className={`w-full ${!hideHeader ? 'px-4 md:px-8 py-8' : ''}`}>
      {/* Header with icon */}
      {!hideHeader && (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div
            className="p-2 transition-colors"
            style={{
              color: 'var(--title-icon-foreground)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              }}
            >
              <FolderKanban size={20} />
            </div>
            <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
              Meu Projeto
            </h1>
          </div>

          {/* Subtitle */}
          <p 
            style={{ 
              color: 'var(--muted-foreground)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              marginLeft: 'calc(32px + 0.75rem)', // Aligns with title (icon size + gap)
              marginBottom: '1.5rem',
            }}
          >
            Informações do projeto que você participa.
          </p>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginBottom: '2rem',
            }}
          />
        </>
      )}

      {/* Estágio do Projeto - Only for Coordenador */}
      {accessType === 'coordenador' && (
      <div className="mb-12">
        {/* Card Container - Only Timeline */}
        <div 
          className="p-6"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
            borderTop: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
            borderRight: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
            borderLeft: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
            borderRadius: 'var(--radius)',
          }}
        >
          {/* Desktop: Horizontal Stepper */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div 
                className="absolute top-6 h-0.5"
                style={{ 
                  backgroundColor: 'var(--border)',
                  left: `calc(100% / ${projectStages.length * 2})`,
                  right: `calc(100% / ${projectStages.length * 2})`,
                }}
              />
              
              {/* Active Progress Line */}
              <div 
                className="absolute top-6 h-0.5 transition-all duration-500"
                style={{ 
                  backgroundColor: timelineActiveColor,
                  left: `calc(100% / ${projectStages.length * 2})`,
                  width: `calc((${((projectStages.findIndex(s => s.status === 'current') + 1) / projectStages.length) * 100}% - (100% / ${projectStages.length})))`,
                }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {projectStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div key={stage.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                      {/* Icon Circle */}
                      <div 
                        className="relative z-10 flex items-center justify-center transition-all duration-300"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: isCurrent
                            ? timelineCurrentColor
                            : isCompleted
                            ? timelineActiveColor
                            : 'var(--timeline-pending-circle)',
                          border: isCurrent ? `3px solid ${timelineCurrentColor}` : 'none',
                          boxShadow: isCurrent ? `0 0 0 4px color-mix(in srgb, ${timelineCurrentColor} 20%, transparent)` : 'none',
                        }}
                      >
                        <Icon 
                          size={20} 
                          style={{ 
                            color: isCompleted || isCurrent ? 'var(--background)' : 'var(--muted-foreground)',
                          }} 
                        />
                      </div>

                      {/* Label */}
                      <p 
                        className="mt-3 text-center"
                        style={{ 
                          color: isCompleted || isCurrent ? 'var(--foreground)' : 'var(--muted-foreground)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: isCurrent ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                          maxWidth: '100px',
                          lineHeight: '1.3',
                        }}
                      >
                        {stage.label}
                      </p>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden">
            <div className="relative pl-20">
              {/* Vertical Line */}
              <div 
                className="absolute left-6 top-0 bottom-0 w-0.5"
                style={{ 
                  backgroundColor: 'var(--border)',
                }}
              />
              
              {/* Active Vertical Line */}
              <div 
                className="absolute left-6 top-0 w-0.5 transition-all duration-500"
                style={{ 
                  backgroundColor: timelineActiveColor,
                  height: `calc(${((projectStages.findIndex(s => s.status === 'current') + 1) / projectStages.length) * 100}% - 24px)`,
                }}
              />

              {/* Timeline Items */}
              <div className="space-y-8">
                {projectStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div key={stage.id} className="relative flex items-start gap-4">
                      {/* Icon Circle */}
                      <div 
                        className="absolute -left-20 flex items-center justify-center transition-all duration-300"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: isCurrent
                            ? timelineCurrentColor
                            : isCompleted
                            ? timelineActiveColor
                            : 'var(--timeline-pending-circle)',
                          border: isCurrent ? `3px solid ${timelineCurrentColor}` : 'none',
                          boxShadow: isCurrent ? `0 0 0 4px color-mix(in srgb, ${timelineCurrentColor} 20%, transparent)` : 'none',
                        }}
                      >
                        <Icon 
                          size={20} 
                          style={{ 
                            color: isCompleted || isCurrent ? 'var(--background)' : 'var(--muted-foreground)',
                          }} 
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <p 
                          style={{ 
                            color: isCompleted || isCurrent ? 'var(--foreground)' : 'var(--muted-foreground)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: isCurrent ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                            marginBottom: '4px',
                          }}
                        >
                          {stage.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Budget Section - Only for Coordenador */}
      {accessType === 'coordenador' && (
      <div className="mb-12" style={{ marginTop: '-1.5rem' }}>
        {/* Main Budget Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Total Budget Card */}
          <div 
            className="p-6"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderLeft: '4px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2"
                style={{
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                }}
              >
                <Wallet size={20} />
              </div>
              <div 
                style={{ 
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                Valor Total do Projeto
              </div>
            </div>
            <div 
              style={{ 
                color: 'var(--foreground)',
                fontSize: '1.25rem',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: '12px',
              }}
            >
              R$ 7.350.780,00
            </div>
            <div 
              style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-2)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <div>
                <span style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)' }}>
                  Utilizado:{' '}
                </span>
                <span style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}>
                  R$ 7.350.780,00
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--muted-foreground)', fontWeight: 'var(--font-weight-normal)' }}>
                  Disponível:{' '}
                </span>
                <span style={{ color: 'var(--primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                  R$ 2.572.773,00
                </span>
              </div>
            </div>
          </div>

          {/* Project Start Date Card */}
          <div 
            className="p-6"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderLeft: '4px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2"
                style={{
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                }}
              >
                <CalendarDays size={20} />
              </div>
              <div 
                style={{ 
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                Data de Inicio
              </div>
            </div>
            <div 
              style={{ 
                color: 'var(--foreground)',
                fontSize: '1.25rem',
                fontWeight: 'var(--font-weight-semibold)',
                textAlign: 'center',
              }}
            >
              {projectTermData.dataInicio}
            </div>
          </div>

          {/* Project Current End Date Card */}
          <div 
            className="p-6"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderLeft: '4px solid var(--primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2"
                style={{
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                }}
              >
                <Clock size={20} />
              </div>
              <div 
                style={{ 
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                Data de Fim
              </div>
            </div>
            <div 
              style={{ 
                color: 'var(--foreground)',
                fontSize: '1.25rem',
                fontWeight: 'var(--font-weight-semibold)',
                textAlign: 'center',
              }}
            >
              {projectTermData.dataFimVigente}
            </div>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="space-y-4">
            {budgetCategories.map(({ name, total, consumido, alocado, disponivel, consumidoPercent, alocadoPercent, Icon }) => (
              <article
                key={name}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-5"
                  style={{ alignItems: 'start' }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center justify-center rounded-lg"
                      style={{
                        width: '40px',
                        height: '40px',
                        color: 'var(--primary)',
                        backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div 
                        style={{
                          color: 'var(--foreground)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-normal)',
                        }}
                      >
                        {name}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end" style={{ minWidth: 0 }}>
                    <span
                      className="inline-flex items-center"
                      style={{
                        padding: '0.25rem 0.625rem',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '9999px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Disponível: {disponivel}
                    </span>
                  </div>
                </div>

                <div 
                  onMouseMove={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setBudgetTooltip({ name, x: event.clientX - rect.left });
                  }}
                  onMouseLeave={() => setBudgetTooltip(null)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    marginTop: '14px',
                  }}
                >
                  {budgetTooltip?.name === name && (
                    <div
                      className="pointer-events-none absolute bottom-full mb-2"
                      style={{
                        left: `${Math.min(Math.max(budgetTooltip.x, 120), 9999)}px`,
                        transform: 'translateX(-50%)',
                        minWidth: '220px',
                        padding: '0.75rem',
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        boxShadow: 'var(--elevation-sm)',
                        zIndex: 10,
                      }}
                    >
                      {[
                        { label: 'Total', value: total },
                        { label: 'Consumido', value: consumido },
                        ...(alocado ? [{ label: 'Alocado', value: alocado }] : []),
                      ].map((metric) => (
                        <div key={metric.label} className="flex items-center justify-between gap-4" style={{ marginBottom: metric.label === (alocado ? 'Alocado' : 'Consumido') ? 0 : '0.375rem' }}>
                          <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>{metric.label}</span>
                          <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}>{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: 'var(--muted)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      display: 'flex',
                    }}
                  >
                    <div 
                      style={{
                        width: `${consumidoPercent}%`,
                        height: '100%',
                        backgroundColor: 'var(--primary)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                    {alocado && (
                      <div
                        style={{
                          width: `${alocadoPercent}%`,
                          height: '100%',
                          backgroundColor: 'color-mix(in srgb, var(--primary) 45%, transparent)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    )}
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
      )}

      <section>
        {/* Objetivo do Projeto - Hidden for Coordenador */}
        {accessType !== 'coordenador' && (
        <div className="mb-8">
          <label 
            className="block mb-2"
            style={{ 
              color: 'var(--muted-foreground)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--text-sm)',
            }}
          >
            Objetivo do Projeto
          </label>
          <p 
            style={{ 
              color: 'var(--foreground)',
              fontWeight: 'var(--font-weight-normal)',
              fontSize: 'var(--text-sm)',
              lineHeight: '1.7',
            }}
          >
            O projeto "ConectaFapes: Uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação" é fruto de uma parceria entre a Fundação de Amparo à Pesquisa e Inovação do Espírito Santo (FAPES) e o Laboratório de Extensão em Desenvolvimento de Soluções (LEDS) do Instituto Federal de Educação, Ciência e Tecnologia do Espírito Santo (IFES). O projeto tem como objetivo a realização de pesquisas e o desenvolvimento de uma plataforma que permita: (i) gerenciar os processos operacionais de apoio à Pesquisa, Desenvolvimento e Inovação da FAPES, (ii) promover a integração com as diversas entidades externas à FAPES e (iii) compartilhar informações de Pesquisa, Desenvolvimento, Inovação e Extensão com pesquisadores, instituições e a sociedade em geral, visando ampliar as possibilidades de desenvolvimento nos âmbitos de atuação dos entes envolvidos e fomentar possibilidades de atuação conjunta pela via do estreitamento de relações de interesse mútuo.
          </p>
        </div>
        )}

        {/* Project Information Grid - Hidden for Coordenador */}
        {accessType !== 'coordenador' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
          {projectData.map((item, index) => (
            <div key={index}>
              <label 
                className="block mb-2"
                style={{ 
                  color: 'var(--muted-foreground)',
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {item.label}
              </label>
              <div style={{ minHeight: '32px', display: 'flex', alignItems: 'center' }}>
                {item.badge ? (
                  <span
                    className="inline-flex items-center px-3 py-1"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e',
                      borderTop: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRight: '1px solid rgba(34, 197, 94, 0.3)',
                      borderBottom: '1px solid rgba(34, 197, 94, 0.3)',
                      borderLeft: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '9999px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {item.value}
                  </span>
                ) : (
                  <p 
                    style={{ 
                      color: 'var(--foreground)',
                      fontWeight: 'var(--font-weight-normal)',
                      fontSize: 'var(--text-sm)',
                      margin: 0,
                    }}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Work Plan Collapsible Section */}
        <div className="mt-8">
          <button
            onClick={() => setIsWorkPlanExpanded(!isWorkPlanExpanded)}
            className="w-full flex items-center justify-between py-3 px-4 transition-colors"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              borderRadius: 'var(--radius)',
              borderTop: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderRight: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderBottom: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
              borderLeft: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            }}
          >
            <label 
              className="cursor-pointer"
              style={{ 
                color: 'var(--foreground)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--text-sm)',
              }}
            >
              Plano de Trabalho
            </label>
            <ChevronDown 
              size={20}
              style={{
                color: 'var(--primary)',
                transform: isWorkPlanExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </button>

          {/* Expanded Content */}
          {isWorkPlanExpanded && (
            <div 
              className="mt-6 space-y-6"
              style={{
                animation: 'fadeIn 0.3s ease',
              }}
            >
              {/* 7. PALAVRAS-CHAVE DO PROJETO */}
              <div 
                className="p-5"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                  borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderLeft: '3px solid var(--primary)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Tag 
                    size={18}
                    style={{ color: 'var(--primary)' }}
                  />
                  <h3 
                    style={{ 
                      color: 'var(--foreground)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--text-sm)',
                      margin: 0,
                    }}
                  >
                    PALAVRAS-CHAVE DO PROJETO
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Plataforma', 'Apoio a FAPES', 'Inovação', 'Pesquisa'].map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                        color: 'var(--primary)',
                        borderTop: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                        borderRight: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                        borderBottom: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                        borderLeft: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                        borderRadius: '9999px',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* 8. RESUMO DO PLANO DE ATIVIDADES */}
              <div 
                className="p-5"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                  borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderLeft: '3px solid var(--primary)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <ListChecks 
                    size={18}
                    style={{ color: 'var(--primary)' }}
                  />
                  <h3 
                    style={{ 
                      color: 'var(--foreground)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--text-sm)',
                      margin: 0,
                    }}
                  >
                    RESUMO DO PLANO DE ATIVIDADES
                  </h3>
                </div>

                <div className="space-y-5">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="p-4"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderRadius: 'var(--radius)',
                        borderTop: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                        borderRight: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                        borderBottom: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                        borderLeft: '1px solid color-mix(in srgb, var(--primary) 8%, transparent)',
                      }}
                    >
                      <h4 
                        className="mb-2 flex items-start gap-2"
                        style={{ 
                          color: 'var(--primary)',
                          fontWeight: 'var(--font-weight-semibold)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        <span 
                          className="inline-flex items-center justify-center flex-shrink-0"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                            borderRadius: '50%',
                            fontSize: '11px',
                            fontWeight: 'var(--font-weight-bold)',
                          }}
                        >
                          {activity.id}
                        </span>
                        <span>{activity.title}</span>
                      </h4>
                      <p 
                        className="ml-8"
                        style={{ 
                          color: 'var(--muted-foreground)',
                          fontWeight: 'var(--font-weight-normal)',
                          fontSize: 'var(--text-sm)',
                          lineHeight: '1.7',
                          margin: 0,
                        }}
                      >
                        {activity.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. OBJETIVOS, METAS E ATIVIDADES */}
              <div 
                className="p-5"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                  borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderLeft: '3px solid var(--primary)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target 
                    size={18}
                    style={{ color: 'var(--primary)' }}
                  />
                  <h3 
                    style={{ 
                      color: 'var(--foreground)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--text-sm)',
                      margin: 0,
                    }}
                  >
                    OBJETIVOS, METAS E ATIVIDADES
                  </h3>
                </div>
                <p 
                  style={{ 
                    color: 'var(--muted-foreground)',
                    fontWeight: 'var(--font-weight-normal)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.7',
                    margin: 0,
                  }}
                >
                  Os objetivos e metas deste apoio são garantir a organização e a clareza das informações levantadas junto aos clientes, contribuindo para uma documentação completa e precisa dos processos e requisitos. Espera-se que o Analista de Requisitos facilite a comunicação entre as partes envolvidas, ajude a manter os registros atualizados e colabore para o bom andamento do projeto, apoiando a tomada de decisões assertivas na construção da solução.
                </p>
              </div>

              {/* 10. MÉTODOS */}
              <div 
                className="p-5"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                  borderTop: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderRight: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderBottom: '1px solid color-mix(in srgb, var(--primary) 10%, transparent)',
                  borderLeft: '3px solid var(--primary)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap 
                    size={18}
                    style={{ color: 'var(--primary)' }}
                  />
                  <h3 
                    style={{ 
                      color: 'var(--foreground)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--text-sm)',
                      margin: 0,
                    }}
                  >
                    MÉTODOS
                  </h3>
                </div>
                <p 
                  style={{ 
                    color: 'var(--muted-foreground)',
                    fontWeight: 'var(--font-weight-normal)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.7',
                    margin: 0,
                  }}
                >
                  Aplicar métodos e práticas reconhecidos de Engenharia de Software e Métodos Ágeis no desenvolvimento da Plataforma ConectaFapes.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
