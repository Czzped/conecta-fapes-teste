import { X, Search, CheckCheck, AlertTriangle, Info, CheckCircle2, Calendar, PlaneTakeoff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

type TabType = 'avisos' | 'editais';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error' | 'diaria';
  title: string;
  description: string;
  isRead: boolean;
  link?: string;
}

interface EditalNotification {
  id: string;
  month: string;
  day: string;
  title: string;
  description: string;
  link: string;
  isRead: boolean;
}

export function NotificationsSidebar({ isOpen, onClose, onNavigate }: NotificationsSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('avisos');
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const avisosNotifications: Notification[] = [
    {
      id: '6',
      type: 'diaria',
      title: 'Diária aguardando assinatura',
      description: 'Você tem a diária SD-2026-002 para aceitar e assinar o termo.',
      isRead: false,
      link: 'certificados-diarias',
    },
    {
      id: '4',
      type: 'success',
      title: 'Pagamento do mês de janeiro foi processado',
      description: 'Mantenha o seu cadastro sempre atualizado!',
      isRead: true,
    },
    {
      id: '1',
      type: 'warning',
      title: 'Atualize seus documentos',
      description: 'O envio do Diploma de Nível Superior está Pendente.',
      isRead: true,
    },
    {
      id: '5',
      type: 'error',
      title: 'Manutenção Programada',
      description: 'O sistema ficará indisponível nesta sexta-feira das 00:00 às 06:00 para atualizações de segurança.',
      isRead: false,
    },
  ];

  const editaisNotifications: EditalNotification[] = [
    {
      id: '1',
      month: 'FEV',
      day: '20',
      title: 'Inscrições Edital 04/2026',
      description: 'Data limite para submissão de propostas de inovação.',
      link: '#',
      isRead: false,
    },
    {
      id: '2',
      month: 'MAR',
      day: '15',
      title: 'Resultado Edital 27/2025',
      description: 'Divulgação dos projetos aprovados para apoio à publicação.',
      link: '#',
      isRead: false,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} style={{ color: '#eab308' }} />;
      case 'info':
        return <Info size={20} style={{ color: '#3b82f6' }} />;
      case 'success':
        return <CheckCircle2 size={20} style={{ color: '#22c55e' }} />;
      case 'error':
        return <AlertTriangle size={20} style={{ color: '#ef4444' }} />;
      case 'diaria':
        return <PlaneTakeoff size={20} style={{ color: 'var(--primary)' }} />;
      default:
        return <Info size={20} style={{ color: 'var(--muted-foreground)' }} />;
    }
  };

  const getUnreadCount = (tab: TabType) => {
    switch (tab) {
      case 'avisos':
        return avisosNotifications.filter(n => !n.isRead).length;
      case 'editais':
        return editaisNotifications.filter(n => !n.isRead).length;
      default:
        return 0;
    }
  };

  const totalUnread = getUnreadCount('avisos') + getUnreadCount('editais');

  const markAllAsRead = () => {
    // TODO: Implement mark all as read logic
    console.log('Mark all as read');
  };

  const handleAvisoClick = (notification: Notification) => {
    if (!notification.link || !onNavigate) {
      return;
    }

    onClose();
    onNavigate(notification.link);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300 z-50"
        style={{
          opacity: isOpen ? '0.5' : '0',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full flex flex-col transition-transform duration-300 ease-in-out z-50"
        style={{
          width: '400px',
          backgroundColor: 'var(--background)',
          borderLeft: '1px solid var(--border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: isOpen ? 'var(--elevation-sm)' : 'none',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{
            borderBottom: 'none',
          }}
        >
          <div className="flex items-center gap-3">
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              Notificações
            </h2>
            {totalUnread > 0 && (
              <span
                className="inline-flex items-center px-2 py-0.5"
                style={{
                  backgroundColor: 'rgba(34, 211, 238, 0.1)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '9999px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {totalUnread} Novas
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 transition-colors"
            style={{
              color: 'var(--muted-foreground)',
              borderRadius: 'var(--radius)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-4">
          <div
            className="relative"
            style={{
              backgroundColor: 'var(--input-background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted-foreground)',
              }}
            />
            <input
              type="text"
              placeholder="Pesquisar notificações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
              }}
            />
          </div>
        </div>

        {/* Tab Bar */}
        <div className="px-6 pb-4">
          <div 
            className="flex gap-1 p-1"
            style={{
              backgroundColor: 'var(--muted)',
              borderRadius: 'var(--radius-lg)',
              display: 'inline-flex',
            }}
          >
            {[
              { id: 'avisos' as TabType, label: 'Avisos' },
              { id: 'editais' as TabType, label: 'Editais' },
            ].map((tab) => {
              const unreadCount = getUnreadCount(tab.id);
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-2 transition-all"
                  style={{
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? 'var(--background)' : 'var(--muted-foreground)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  {tab.label}{unreadCount > 0 && ` (${unreadCount})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'editais' && (
            <div className="space-y-4">
              {editaisNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-4 p-4 rounded-lg transition-colors cursor-pointer relative"
                  style={{
                    backgroundColor: notification.isRead ? 'transparent' : 'var(--muted)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={(e) => {
                    if (notification.isRead) {
                      e.currentTarget.style.backgroundColor = 'var(--muted)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (notification.isRead) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{
                      width: '56px',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {notification.month}
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--primary)',
                        lineHeight: '1',
                      }}
                    >
                      {notification.day}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)',
                        marginBottom: '4px',
                      }}
                    >
                      {notification.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--muted-foreground)',
                        lineHeight: '1.5',
                        margin: 0,
                      }}
                    >
                      {notification.description}
                    </p>
                    <a
                      href={notification.link}
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Ver Edital →
                    </a>
                  </div>
                  {!notification.isRead && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'avisos' && (
            <div className="space-y-4">
              {avisosNotifications.map((notification) => {
                const content = (
                  <>
                    <div style={{ flexShrink: 0, marginTop: '2px' }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--foreground)',
                          marginBottom: '4px',
                        }}
                      >
                        {notification.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)',
                          lineHeight: '1.5',
                          margin: 0,
                        }}
                      >
                        {notification.description}
                      </p>
                    </div>
                    {!notification.isRead && notification.type !== 'error' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary)',
                        }}
                      />
                    )}
                  </>
                );

                const itemStyle = {
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'inherit',
                  cursor: notification.link ? 'pointer' : 'default',
                };

                if (notification.link) {
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleAvisoClick(notification)}
                      className="flex gap-3 p-4 rounded-lg relative text-left transition-colors"
                      style={itemStyle}
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <div
                    key={notification.id}
                    className="flex gap-3 p-4 rounded-lg relative"
                    style={itemStyle}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
