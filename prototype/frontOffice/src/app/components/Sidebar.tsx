import { Home, User, FolderKanban, CreditCard, ClipboardList, LogOut, ChevronLeft, ChevronRight, X, DollarSign, FileText, RefreshCw, Users, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoIcon from 'figma:asset/db135b6708f6cc7f72f27c6a31dd02aa5500d030.png';
import fapesLogo from 'figma:asset/0d7b9f0810d49a6ee72945d010952cb0ccbd0c9d.png';
import fapesLogoExpanded from 'figma:asset/affecf58de5f5168c562fa312b9d450b8432233b.png';
import { useLanguage } from '@/contexts/LanguageContext';

type AccessType = 'voluntario' | 'bolsista' | 'coordenador' | 'diretor' | 'reitor';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onLogout?: () => void;
  accessType: AccessType;
}

export function Sidebar({ currentPage, onNavigate, isCollapsed, onToggle, isMobile, onLogout, accessType }: SidebarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Watch for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const getLogoSrc = () => {
    if (isCollapsed) {
      return logoIcon;
    }
    // When expanded, show text version based on theme
    return isDarkMode ? fapesLogo : fapesLogoExpanded;
  };

  const handleLogout = () => {
    // Lógica de logout aqui
    console.log('Logout clicked');
    if (onLogout) {
      onLogout();
    }
  };

  const { t } = useLanguage();

  // Translated menu items
  const homeMenuItem = { id: 'inicio', labelKey: 'sidebar.home', icon: Home };

  const managementMenuItems = [
    { id: 'projetos', labelKey: 'sidebar.myProject', icon: FolderKanban },
    { id: 'certificados', labelKey: 'sidebar.requests', icon: ClipboardList },
  ];

  const profileMenuItems = [
    { id: 'informacoes', labelKey: 'sidebar.myInfo', icon: User },
    { id: 'pagamentos', labelKey: 'sidebar.payments', icon: CreditCard },
  ];

  // Menu items for Reitor/Diretor
  const reitorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'projects-list', label: 'Projetos', icon: FolderKanban },
  ];

  // Minha Equipe - Only for Coordenador
  const minhaEquipeItem = { id: 'minha-equipe', labelKey: 'sidebar.myTeam', icon: Users };
  const projectPaymentsItem = { id: 'pagamentos-projeto', labelKey: 'sidebar.projectPayments', icon: CreditCard };

  const prestacaoContasItems = [
    { id: 'financeira', labelKey: 'sidebar.financial', icon: DollarSign },
    { id: 'prestacao-contas-tecnica', labelKey: 'sidebar.technical', icon: FileText },
    { id: 'remanejamento', labelKey: 'sidebar.reallocation', icon: RefreshCw },
  ];

  // Use special menu for Reitor/Diretor
  if (accessType === 'reitor' || accessType === 'diretor') {
    const finalMenuItems = reitorMenuItems;
    
    return (
      <aside 
        className="h-screen border-r flex flex-col transition-all duration-300 ease-in-out sticky top-0"
        style={{
          width: isCollapsed ? '80px' : '240px',
          borderRightColor: 'var(--sidebar-border)',
          backgroundColor: 'var(--sidebar)',
        }}
      >
        <div 
          className="flex items-center gap-3"
          style={{
            paddingLeft: isCollapsed && !isMobile ? '1rem' : '1rem',
            paddingRight: isCollapsed && !isMobile ? '1rem' : '1rem',
            justifyContent: isMobile ? 'space-between' : 'center',
            flexDirection: !isCollapsed && !isMobile ? 'column' : 'row',
            alignItems: !isCollapsed && !isMobile ? 'center' : 'center',
            paddingTop: !isCollapsed && !isMobile ? '1rem' : '0',
            paddingBottom: !isCollapsed && !isMobile ? '1rem' : '0',
            height: !isCollapsed && !isMobile ? 'auto' : '64px',
          }}
        >
          <button
            onClick={() => onNavigate('inicio')}
            className="transition-all duration-300 flex items-center gap-3"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexDirection: !isCollapsed && !isMobile ? 'column' : 'row',
              alignItems: 'center',
            }}
            aria-label="Ir para página inicial"
          >
            {/* Icon Logo - Show when collapsed or mobile */}
            {(isCollapsed || isMobile) && (
              <img 
                src={logoIcon} 
                alt="Logo Icon" 
                className="transition-all duration-300"
                style={{
                  height: '32px',
                  width: 'auto',
                  flexShrink: 0,
                }}
              />
            )}
            
            {/* Fapes Text Logo - Only visible when expanded */}
            {!isCollapsed && (
              <img 
                src={fapesLogoExpanded} 
                alt="Fapes" 
                className="transition-all duration-300"
                style={{
                  height: isMobile ? '28px' : '40px',
                  width: 'auto',
                  marginTop: !isMobile ? '0' : '0',
                }}
              />
            )}
          </button>

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onToggle}
              className="p-2 transition-colors"
              style={{
                color: 'var(--foreground)',
                borderRadius: 'var(--radius)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Toggle button - Only show on desktop */}
        {!isMobile && (
          <div className="flex items-center justify-center py-2">
            <button
              onClick={onToggle}
              className="transition-all duration-200"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                color: 'var(--primary)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.2)';
              }}
              title={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
              aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        )}

        <div className={isCollapsed ? 'px-2 flex-1' : 'px-4 flex-1'}>
          <nav className="mt-2">
            {/* Section: Gerenciamento - Only for Coordenador */}
            {accessType === 'coordenador' && !isCollapsed && (
              <div 
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  paddingLeft: '0.75rem',
                  marginTop: '0.75rem',
                }}
              >
                {t('sidebar.management')}
              </div>
            )}
            
            <ul className="space-y-2">
              {finalMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className="w-full flex items-center gap-3 py-3 transition-colors text-left relative group"
                      style={{
                        backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                        color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                        borderRadius: 'var(--radius)',
                        fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                        fontSize: 'var(--text-sm)',
                        paddingLeft: isCollapsed ? '0' : '0.75rem',
                        paddingRight: isCollapsed ? '0' : '0.75rem',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--muted)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={20} style={{ flexShrink: 0 }} />
                      {!isCollapsed && <span style={{ textAlign: 'left' }}>{item.label}</span>}
                      
                      {/* Tooltip when collapsed */}
                      {isCollapsed && (
                        <div 
                          className="absolute left-full ml-2 px-3 py-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                          style={{
                            backgroundColor: 'var(--popover)',
                            color: 'var(--popover-foreground)',
                            fontSize: 'var(--text-sm)',
                            boxShadow: 'var(--shadow-lg)',
                          }}
                        >
                          {item.label}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            
            {/* Divider and Prestação de Contas - Only for Coordenador */}
            {accessType === 'coordenador' && (
              <>
                {/* Divider */}
                <div 
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--sidebar-border)',
                    marginTop: '1rem',
                    marginBottom: '1.5rem',
                  }}
                />
                
                {/* Section Title: Prestação de Contas */}
                {!isCollapsed && (
                  <div 
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--muted-foreground)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                      paddingLeft: '0.75rem',
                      marginTop: '0.25rem',
                    }}
                  >
                    {t('sidebar.accountability')}
                  </div>
                )}
                
                {/* Prestação de Contas Menu Items */}
                <ul className="space-y-2">
                  {prestacaoContasItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => onNavigate(item.id)}
                          className="w-full flex items-center gap-3 py-3 transition-colors text-left relative group"
                          style={{
                            backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                            color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                            borderRadius: 'var(--radius)',
                            fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                            fontSize: 'var(--text-sm)',
                            paddingLeft: isCollapsed ? '0' : '0.75rem',
                            paddingRight: isCollapsed ? '0' : '0.75rem',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'var(--muted)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon size={20} style={{ flexShrink: 0 }} />
                          {!isCollapsed && <span style={{ textAlign: 'left' }}>{t(item.labelKey)}</span>}
                          
                          {/* Tooltip when collapsed */}
                          {isCollapsed && (
                            <div 
                              className="absolute left-full ml-2 px-3 py-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                              style={{
                                backgroundColor: 'var(--popover)',
                                color: 'var(--popover-foreground)',
                                fontSize: 'var(--text-sm)',
                                boxShadow: 'var(--shadow-lg)',
                              }}
                            >
                              {t(item.labelKey)}
                            </div>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </nav>
        </div>

        {/* Logout button at bottom */}
        <div 
          className={isCollapsed ? 'p-2 border-t' : 'p-4 border-t'}
          style={{ borderColor: 'var(--sidebar-border)' }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 transition-colors relative group"
            style={{
              color: 'var(--sidebar-foreground)',
              borderRadius: 'var(--radius)',
              fontWeight: 'var(--font-weight-normal)',
              fontSize: 'var(--text-sm)',
              paddingLeft: isCollapsed ? '0' : '0.75rem',
              paddingRight: isCollapsed ? '0' : '0.75rem',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? t('header.logout') : undefined}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>{t('header.logout')}</span>}
            
            {/* Tooltip when collapsed */}
            {isCollapsed && (
              <div 
                className="absolute left-full ml-2 px-3 py-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                style={{
                  backgroundColor: 'var(--popover)',
                  color: 'var(--popover-foreground)',
                  fontSize: 'var(--text-sm)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {t('header.logout')}
              </div>
            )}
          </button>
        </div>
      </aside>
    );
  }

  // Filter out 'pagamentos' for voluntario access type
  const filteredProfileMenuItems = accessType === 'voluntario'
    ? profileMenuItems.filter(item => item.id !== 'pagamentos')
    : profileMenuItems;

  // Insert "Minha Equipe" after "Meu Projeto" for Coordenador
  const finalManagementMenuItems = accessType === 'coordenador'
    ? managementMenuItems.reduce((acc, item) => {
        acc.push(item);
        if (item.id === 'projetos') {
          acc.push(minhaEquipeItem);
          acc.push(projectPaymentsItem);
        }
        return acc;
      }, [] as typeof managementMenuItems)
    : managementMenuItems;

  return (
    <aside 
      className="h-screen border-r flex flex-col transition-all duration-300 ease-in-out sticky top-0"
      style={{
        width: isCollapsed ? '80px' : '240px',
        borderRightColor: 'var(--sidebar-border)',
        backgroundColor: 'var(--sidebar)',
      }}
    >
      <div 
        className="flex items-center gap-3"
        style={{
          paddingLeft: isCollapsed && !isMobile ? '1rem' : '1rem',
          paddingRight: isCollapsed && !isMobile ? '1rem' : '1rem',
          justifyContent: isMobile ? 'space-between' : 'center',
          flexDirection: !isCollapsed && !isMobile ? 'column' : 'row',
          alignItems: !isCollapsed && !isMobile ? 'center' : 'center',
          paddingTop: !isCollapsed && !isMobile ? '1rem' : '0',
          paddingBottom: !isCollapsed && !isMobile ? '1rem' : '0',
          height: !isCollapsed && !isMobile ? 'auto' : '64px',
        }}
      >
        <button
          onClick={() => onNavigate('inicio')}
          className="transition-all duration-300 flex items-center gap-3"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flexDirection: !isCollapsed && !isMobile ? 'column' : 'row',
            alignItems: 'center',
          }}
          aria-label="Ir para página inicial"
        >
          {/* Icon Logo - Show when collapsed or mobile */}
          {(isCollapsed || isMobile) && (
            <img 
              src={logoIcon} 
              alt="Logo Icon" 
              className="transition-all duration-300"
              style={{
                height: '32px',
                width: 'auto',
                flexShrink: 0,
              }}
            />
          )}
          
          {/* Fapes Text Logo - Only visible when expanded */}
          {!isCollapsed && (
            <img 
              src={fapesLogoExpanded} 
              alt="Fapes" 
              className="transition-all duration-300"
              style={{
                height: isMobile ? '28px' : '40px',
                width: 'auto',
                marginTop: !isMobile ? '0' : '0',
              }}
            />
          )}
        </button>

        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onToggle}
            className="p-2 transition-colors"
            style={{
              color: 'var(--foreground)',
              borderRadius: 'var(--radius)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Toggle button - Only show on desktop */}
      {!isMobile && (
        <div className="flex items-center justify-center py-2">
          <button
            onClick={onToggle}
            className="transition-all duration-200"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.2)';
            }}
            title={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
            aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      )}

      <div className={isCollapsed ? 'px-2 flex-1' : 'px-4 flex-1'}>
        <nav className="mt-2">
          <ul className="space-y-2">
            {(() => {
              const Icon = homeMenuItem.icon;
              const isActive = currentPage === homeMenuItem.id;

              return (
                <li key={homeMenuItem.id}>
                  <button
                    onClick={() => onNavigate(homeMenuItem.id)}
                    className="w-full flex items-center gap-3 py-3 transition-colors text-left relative group"
                    style={{
                      backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                      color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                      borderRadius: 'var(--radius)',
                      fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                      fontSize: 'var(--text-sm)',
                      paddingLeft: isCollapsed ? '0' : '0.75rem',
                      paddingRight: isCollapsed ? '0' : '0.75rem',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    title={isCollapsed ? t(homeMenuItem.labelKey) : undefined}
                  >
                    <Icon size={20} style={{ flexShrink: 0 }} />
                    {!isCollapsed && <span style={{ textAlign: 'left' }}>{t(homeMenuItem.labelKey)}</span>}

                    {isCollapsed && (
                      <div
                        className="absolute left-full ml-2 px-3 py-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                        style={{
                          backgroundColor: 'var(--popover)',
                          color: 'var(--popover-foreground)',
                          fontSize: 'var(--text-sm)',
                          boxShadow: 'var(--shadow-lg)',
                        }}
                      >
                        {t(homeMenuItem.labelKey)}
                      </div>
                    )}
                  </button>
                </li>
              );
            })()}
          </ul>

          {filteredProfileMenuItems.length > 0 && (
            <>
              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--sidebar-border)',
                  marginTop: '1rem',
                  marginBottom: '1.5rem',
                }}
              />

              {!isCollapsed && (
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--muted-foreground)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                    paddingLeft: '0.75rem',
                    marginTop: '0.75rem',
                  }}
                >
                  {t('sidebar.myProfile')}
                </div>
              )}

              <ul className="space-y-2">
                {filteredProfileMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onNavigate(item.id)}
                        className="w-full flex items-center gap-3 py-3 transition-colors text-left relative group"
                        style={{
                          backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                          color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                          borderRadius: 'var(--radius)',
                          fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                          fontSize: 'var(--text-sm)',
                          paddingLeft: isCollapsed ? '0' : '0.75rem',
                          paddingRight: isCollapsed ? '0' : '0.75rem',
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        title={isCollapsed ? t(item.labelKey) : undefined}
                      >
                        <Icon size={20} style={{ flexShrink: 0 }} />
                        {!isCollapsed && <span style={{ textAlign: 'left' }}>{t(item.labelKey)}</span>}

                        {/* Tooltip when collapsed */}
                        {isCollapsed && (
                          <div
                            className="absolute left-full ml-2 px-3 py-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                            style={{
                              backgroundColor: 'var(--popover)',
                              color: 'var(--popover-foreground)',
                              fontSize: 'var(--text-sm)',
                              boxShadow: 'var(--shadow-lg)',
                            }}
                          >
                            {t(item.labelKey)}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--sidebar-border)',
                  marginTop: '1rem',
                  marginBottom: '1.5rem',
                }}
              />
            </>
          )}

          {/* Section: Gerenciamento - Only for Coordenador */}
          {accessType === 'coordenador' && !isCollapsed && (
            <div 
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                paddingLeft: '0.75rem',
                marginTop: '0.75rem',
              }}
            >
              {t('sidebar.management')}
            </div>
          )}
          
          <ul className="space-y-2">
            {finalManagementMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="w-full flex items-center gap-3 py-3 transition-colors text-left relative group"
                    style={{
                      backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                      color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                      borderRadius: 'var(--radius)',
                      fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                      fontSize: 'var(--text-sm)',
                      paddingLeft: isCollapsed ? '0' : '0.75rem',
                      paddingRight: isCollapsed ? '0' : '0.75rem',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    title={isCollapsed ? t(item.labelKey) : undefined}
                  >
                    <Icon size={20} style={{ flexShrink: 0 }} />
                    {!isCollapsed && <span style={{ textAlign: 'left' }}>{t(item.labelKey)}</span>}
                    
                    {/* Tooltip when collapsed */}
                    {isCollapsed && (
                      <div 
                        className="absolute left-full ml-2 px-3 py-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                        style={{
                          backgroundColor: 'var(--popover)',
                          color: 'var(--popover-foreground)',
                          fontSize: 'var(--text-sm)',
                          boxShadow: 'var(--shadow-lg)',
                        }}
                      >
                        {t(item.labelKey)}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          
          {/* Divider and Prestação de Contas - Only for Coordenador */}
          {accessType === 'coordenador' && (
            <>
              {/* Divider */}
              <div 
                style={{
                  height: '1px',
                  backgroundColor: 'var(--sidebar-border)',
                  marginTop: '1rem',
                  marginBottom: '1.5rem',
                }}
              />
              
              {/* Section Title: Prestação de Contas */}
              {!isCollapsed && (
                <div 
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--muted-foreground)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                    paddingLeft: '0.75rem',
                    marginTop: '0.25rem',
                  }}
                >
                  {t('sidebar.accountability')}
                </div>
              )}
              
              {/* Prestação de Contas Menu Items */}
              <ul className="space-y-2">
                {prestacaoContasItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onNavigate(item.id)}
                        className="w-full flex items-center gap-3 py-3 transition-colors text-left relative group"
                        style={{
                          backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                          color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                          borderRadius: 'var(--radius)',
                          fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                          fontSize: 'var(--text-sm)',
                          paddingLeft: isCollapsed ? '0' : '0.75rem',
                          paddingRight: isCollapsed ? '0' : '0.75rem',
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon size={20} style={{ flexShrink: 0 }} />
                        {!isCollapsed && <span style={{ textAlign: 'left' }}>{t(item.labelKey)}</span>}
                        
                        {/* Tooltip when collapsed */}
                        {isCollapsed && (
                          <div 
                            className="absolute left-full ml-2 px-3 py-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                            style={{
                              backgroundColor: 'var(--popover)',
                              color: 'var(--popover-foreground)',
                              fontSize: 'var(--text-sm)',
                              boxShadow: 'var(--shadow-lg)',
                            }}
                          >
                            {t(item.labelKey)}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div 
        className={isCollapsed ? 'p-2 border-t' : 'p-4 border-t'}
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-3 transition-colors relative group"
          style={{
            color: 'var(--sidebar-foreground)',
            borderRadius: 'var(--radius)',
            fontWeight: 'var(--font-weight-normal)',
            fontSize: 'var(--text-sm)',
            paddingLeft: isCollapsed ? '0' : '0.75rem',
            paddingRight: isCollapsed ? '0' : '0.75rem',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--muted)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title={isCollapsed ? t('header.logout') : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>{t('header.logout')}</span>}
          
          {/* Tooltip when collapsed */}
          {isCollapsed && (
            <div 
              className="absolute left-full ml-2 px-3 py-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
              style={{
                backgroundColor: 'var(--popover)',
                color: 'var(--popover-foreground)',
                fontSize: 'var(--text-sm)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {t('header.logout')}
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
