import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  FileCheck, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Bell,
  Search,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r border-border transition-all duration-300 flex flex-col bg-sidebar text-sidebar-foreground hidden md:flex`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 rounded bg-primary shrink-0 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-lg">Portal FAPES</span>}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={false} isOpen={isSidebarOpen} />
          <NavItem icon={<Wallet size={20} />} label="Financeiro" active={true} isOpen={isSidebarOpen} />
          <NavItem icon={<FileCheck size={20} />} label="Editais" active={false} isOpen={isSidebarOpen} />
          <NavItem icon={<Users size={20} />} label="Usuários" active={false} isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <NavItem icon={<Settings size={20} />} label="Configurações" active={false} isOpen={isSidebarOpen} />
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-destructive-foreground hover:bg-destructive-foreground/10 rounded-md transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:flex hidden">
              <Menu size={20} />
            </Button>
            <div className="md:hidden flex items-center gap-2">
                <div className="size-8 rounded bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xs">F</span>
                </div>
                <span className="font-bold text-sm">Portal FAPES</span>
            </div>
            <div className="hidden sm:flex items-center relative ml-4">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar" className="pl-3 pr-9 h-9 w-[300px] bg-muted/50 border-0" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background"></span>
            </Button>
            <div className="h-8 w-[1px] bg-border mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium">Ana Silva</p>
                <p className="text-xs text-muted-foreground">Administrador FAPES</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" />
                <AvatarFallback><User size={18} /></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  isOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, isOpen }) => {
  return (
    <a 
      href="#"
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group ${
        active 
          ? 'bg-primary text-white shadow-sm' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <div className={active ? 'text-white' : 'text-muted-foreground group-hover:text-primary transition-colors'}>
        {icon}
      </div>
      {isOpen && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
      {!isOpen && active && <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
    </a>
  );
};
