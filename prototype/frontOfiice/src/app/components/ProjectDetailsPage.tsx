import { FileText } from 'lucide-react';
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
        </Tabs>
      </div>
    </div>
  );
}