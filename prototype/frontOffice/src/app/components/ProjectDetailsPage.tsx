import { CalendarDays, CheckCircle, Clock, FileText, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { MyProjectsPage } from '@/app/components/MyProjectsPage';
import { MyTeamPage } from '@/app/components/MyTeamPage';

interface ProjectDetailsPageProps {
  projectName?: string;
  onBack?: () => void;
}

export function ProjectDetailsPage({ projectName = 'Projeto Selecionado', onBack }: ProjectDetailsPageProps) {
  const [activeTab, setActiveTab] = useState('projeto');

  const aditivos = [
    {
      id: 'TA-2026-014',
      tipo: 'Tempo e financeiro',
      situacao: 'Aprovado',
      data: '15/02/2026',
      dataFimAnterior: '28/02/2026',
      dataFimAditada: '31/08/2026',
      valor: 'R$ 250.000,00',
      documento: 'Termo Aditivo 014/2026',
      observacao: 'Prorrogação de vigência e suplementação para continuidade das entregas previstas.',
    },
    {
      id: 'TA-2025-009',
      tipo: 'Financeiro',
      situacao: 'Aprovado',
      data: '10/09/2025',
      dataFimAnterior: '-',
      dataFimAditada: '-',
      valor: 'R$ 80.000,00',
      documento: 'Termo Aditivo 009/2025',
      observacao: 'Acréscimo financeiro para ampliação de rubricas de execução do projeto.',
    },
  ];

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
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <button
            className="p-2 transition-colors"
            style={{
              backgroundColor: 'rgba(8, 145, 178, 0.1)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.1)';
            }}
            aria-label="Detalhes do Projeto"
          >
            <FileText size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 
              style={{
                color: 'var(--foreground)',
                margin: 0,
                marginBottom: '0.5rem',
              }}
            >
              Detalhes do Projeto
            </h1>
            <p 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                margin: 0,
              }}
            >
              Informações do projeto
            </p>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab Bar Link Style */}
          <div 
            className="flex flex-col sm:flex-row gap-0 sm:gap-6"
            style={{
              borderBottom: '1px solid var(--border)',
              marginBottom: '1rem',
            }}
          >
            <button
              onClick={() => setActiveTab('projeto')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
                color: activeTab === 'projeto' ? 'var(--primary)' : 'var(--muted-foreground)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.2s ease',
                fontFamily: 'var(--font-family)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'projeto') {
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'projeto') {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                }
              }}
            >
              Projeto
              {activeTab === 'projeto' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--primary)',
                  }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('informacoes')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
                color: activeTab === 'informacoes' ? 'var(--primary)' : 'var(--muted-foreground)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.2s ease',
                fontFamily: 'var(--font-family)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'informacoes') {
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'informacoes') {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                }
              }}
            >
              Informações das Bolsas
              {activeTab === 'informacoes' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--primary)',
                  }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('bolsistas')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
                color: activeTab === 'bolsistas' ? 'var(--primary)' : 'var(--muted-foreground)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.2s ease',
                fontFamily: 'var(--font-family)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'bolsistas') {
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'bolsistas') {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                }
              }}
            >
              Bolsistas do Projeto
              {activeTab === 'bolsistas' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--primary)',
                  }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('aditivos')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
                color: activeTab === 'aditivos' ? 'var(--primary)' : 'var(--muted-foreground)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.2s ease',
                fontFamily: 'var(--font-family)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'aditivos') {
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'aditivos') {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                }
              }}
            >
              Aditivos
              {activeTab === 'aditivos' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--primary)',
                  }}
                />
              )}
            </button>
          </div>

          <TabsContent value="projeto">
            <MyProjectsPage accessType="coordenador" hideHeader={true} />
          </TabsContent>

          <TabsContent value="informacoes">
            <MyTeamPage 
              accessType="coordenador" 
              hideHeader={true} 
              defaultTab="informacoes"
              hideTabs={true}
            />
          </TabsContent>

          <TabsContent value="bolsistas">
            <MyTeamPage 
              accessType="coordenador" 
              hideHeader={true} 
              defaultTab="bolsistas"
              hideTabs={true}
              hideAddButton={true}
              hideExpandable={true}
            />
          </TabsContent>

          <TabsContent value="aditivos">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2"
                  style={{
                    color: 'var(--primary)',
                    backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <h2 style={{ color: 'var(--foreground)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>
                    Dados dos aditivos
                  </h2>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: '0.25rem 0 0' }}>
                    Acompanhe os termos aditivos vinculados ao projeto.
                  </p>
                </div>
              </div>

              {aditivos.length > 0 ? (
                <div className="space-y-3">
                  {aditivos.map((aditivo) => (
                    <div
                      key={aditivo.id}
                      className="p-4"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--primary) 3%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--primary) 12%, transparent)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <strong style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)' }}>
                              {aditivo.id}
                            </strong>
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1"
                              style={{
                                color: 'var(--primary)',
                                backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--primary) 24%, transparent)',
                                borderRadius: '9999px',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-weight-medium)',
                              }}
                            >
                              <CheckCircle size={13} />
                              {aditivo.situacao}
                            </span>
                          </div>
                          <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', lineHeight: '1.6', margin: 0 }}>
                            {aditivo.observacao}
                          </p>
                        </div>

                        <div
                          className="px-3 py-2"
                          style={{
                            color: 'var(--foreground)',
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-sm)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {aditivo.documento}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-start gap-2">
                          <FileText size={16} style={{ color: 'var(--primary)', marginTop: 2 }} />
                          <div>
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Tipo</div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{aditivo.tipo}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CalendarDays size={16} style={{ color: 'var(--primary)', marginTop: 2 }} />
                          <div>
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Formalização</div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{aditivo.data}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock size={16} style={{ color: 'var(--primary)', marginTop: 2 }} />
                          <div>
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Prazo</div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                              {aditivo.dataFimAditada !== '-' ? `${aditivo.dataFimAnterior} -> ${aditivo.dataFimAditada}` : 'Sem alteração'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Wallet size={16} style={{ color: 'var(--primary)', marginTop: 2 }} />
                          <div>
                            <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>Valor aditivado</div>
                            <div style={{ color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>{aditivo.valor}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="p-6 text-center"
                  style={{
                    color: 'var(--muted-foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--card)',
                  }}
                >
                  Este projeto não possui aditivos registrados.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
