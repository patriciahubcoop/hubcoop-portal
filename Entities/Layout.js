import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  Home,
  CreditCard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Receipt,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Building2,
  Database,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const allMenuItems = [
    { name: 'Dashboard', icon: Home, page: 'Dashboard', roles: ['master', 'central', 'cooperativa', 'ponto_atendimento', 'admin', 'gerente', 'atendente'] },
    { name: 'Centrais', icon: Building2, page: 'Centrais', roles: ['master'] },
    { name: 'Cooperativas', icon: Building2, page: 'Cooperativas', roles: ['master', 'central'] },
    { name: 'Pontos de Atendimento', icon: MapPin, page: 'PontosAtendimento', roles: ['master', 'central', 'cooperativa'] },
    { name: 'Cooperados', icon: Users, page: 'Cooperados', roles: ['master', 'central', 'cooperativa', 'ponto_atendimento'] },
    { name: 'Cartões', icon: CreditCard, page: 'Cartoes', roles: ['master', 'central', 'cooperativa', 'ponto_atendimento'] },
    { name: 'Transações', icon: Receipt, page: 'Transacoes', roles: ['master', 'central', 'cooperativa', 'ponto_atendimento'] },
    { name: 'Faturas', icon: FileText, page: 'Faturas', roles: ['master', 'central', 'cooperativa', 'ponto_atendimento'] },
    { name: 'Relatórios', icon: BarChart3, page: 'Relatorios', roles: ['master', 'central', 'cooperativa', 'ponto_atendimento', 'admin', 'gerente'] },
    { name: 'Usuários', icon: Users, page: 'Usuarios', roles: ['master', 'central', 'cooperativa', 'admin'] },
    { name: 'Configurações', icon: Settings, page: 'Configuracoes', roles: ['master', 'central', 'cooperativa'] },
    { name: 'Popular Dados', icon: Database, page: 'PopularDados', roles: ['master'] },
    { name: 'Gerar Dados Mock', icon: Database, page: 'GerarDadosMock', roles: ['master'] }
  ];

  const menuItems = allMenuItems.filter(item => {
    if (!user || !user.perfil) return true;
    return item.roles.includes(user.perfil);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <style>{`
        :root {
          --hubcoop-primary: #4A9B8E;
          --hubcoop-primary-dark: #3A7B6E;
          --hubcoop-primary-light: #5AABA0;
        }
      `}</style>
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center justify-center border-b border-slate-100 bg-gradient-to-r from-[var(--hubcoop-primary)] to-[var(--hubcoop-primary-dark)] px-6">
            {sidebarOpen ? (
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6914c7064c105ddcc48ec53b/10b21349b_hubcoop-fundo-02-v2.jpg" 
                alt="Hubcoop" 
                className="h-10 object-contain"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white" />
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-6 px-3 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all group ${
                    isActive 
                      ? 'bg-[var(--hubcoop-primary)] text-white shadow-lg shadow-[var(--hubcoop-primary)]/20' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  {sidebarOpen && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                  {isActive && sidebarOpen && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-slate-100 p-4">
            <Button
              variant="ghost"
              onClick={() => base44.auth.logout()}
              className={`w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 ${!sidebarOpen && 'px-2'}`}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Sair</span>}
            </Button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {menuItems.find(item => item.page === currentPageName)?.name || 'Portal Hubcoop'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Gestão de Cartões Corporativos</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right mr-3">
              <p className="font-semibold text-slate-800 text-sm">{user?.full_name || 'Usuário'}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <Avatar className="border-2 border-[var(--hubcoop-primary)]">
              <AvatarFallback className="bg-[var(--hubcoop-primary)] text-white font-semibold">
                {user?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}