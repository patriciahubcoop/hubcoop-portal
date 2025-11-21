import React, { useState } from 'react';
// =======================================================================
// 1. IMPORTS DE ÍCONES (COM TODAS AS CORREÇÕES E ADIÇÕES)
// =======================================================================
import {
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Building,
  // Ícones do Dashboard
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users2,
  List,
  AlertTriangle,
  FileCheck,
  FileX,
  FileClock,
  PieChart,
  Wallet,
  Landmark,
  ShieldAlert,
  // Ícones Novos para o Menu
  Home,
  FileText,
  // Ícones para a Página Cooperados
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  X,
  ChevronRight,
  CheckCircle,
  Check,
  // Ícones para a Página Cartões
  ArrowDownUp,
  Percent,
  Save,
  AlertCircle,
  SlidersHorizontal,
  // Ícones para a Página Transações
  FileDown,
  HelpCircle,
  CheckCircle2,
  XCircle,
  BarChart2,
  ChevronDown,
  // Ícones para a Página Faturas
  File,
  Clock,
  AlertOctagon,
  Receipt,
  // Ícones para a Página Relatórios
  CalendarX,
  Banknote,
  AreaChart,
  Contact,
  RefreshCw,
  PackageCheck,
  PackageSearch,
  PackageX,
  // Ícones para a Página Cooperativas
  Library,
  Briefcase,
  MapPin,
  // ÍCONES PARA A PÁGINA USUÁRIOS (CORRIGIDO)
  UserCog,
  History,
  CalendarDays,
  Filter,
  UserCheck, 
  Upload,
  UserPlus,
  Gift, // Para Loyalty
  Armchair, // Para Sala VIP
  Plane, // Para Milhas
  Coffee, // Para Sala VIP
  CheckSquare, // Para Conciliação
  CreditCard as CreditCardIcon, // Alias se necessário
} from 'lucide-react';

// --- Cor Principal da Hubcoop ---
const HUB_BRAND_COLOR = '#3E807D';

// =======================================================================
// DADOS GLOBAIS DO SISTEMA (USUÁRIOS MOCK, CENTRAIS, COOPERATIVAS, PONTOS)
 // =======================================================================

// 1. Novo Tipo de Usuário
type UserProfile = 'Master' | 'Central' | 'Cooperativa' | 'PA';

type User = {
  id: string;
  nome: string;
  email: string;
  perfil: UserProfile;
  centralId: string | null; // ex: 'c2' (Credisis)
  cooperativaId: string | null; // ex: 'coop_coopesa'
  pontoAtendimentoId: string | null; // ex: 'pa_03'
};

// 2. Nosso "Banco de Dados" de usuários para simular o login
const mockUsuariosLogin: Record<string, User> = {
  'hubcoop': {
    id: 'user1',
    nome: 'Admin Hubcoop',
    email: 'patricia.holanda@hubcoop.com.br',
    perfil: 'Master',
    centralId: 'c1', // c1 = Matriz/Hubcoop (Admin)
    cooperativaId: null,
    pontoAtendimentoId: null,
  },
  'credisis': {
    id: 'user2',
    nome: 'Patricia Holanda (Credisis)',
    email: 'patricia.holanda@credisis.com.br',
    perfil: 'Central',
    centralId: 'c2', // Apenas da Credisis
    cooperativaId: null,
    pontoAtendimentoId: null,
  },
  'coopesa': {
    id: 'user3',
    nome: 'Gestor Coopesa',
    email: 'patricia.holanda@cooperativacoopesa.com.br',
    perfil: 'Cooperativa',
    centralId: 'c2',
    cooperativaId: 'coop_coopesa', // ID da Coopesa
    pontoAtendimentoId: null,
  },
  'pa03': {
    id: 'user4',
    nome: 'Atendente PA 03',
    email: 'patricia.holanda@pa03.com.br',
    perfil: 'PA',
    centralId: 'c2',
    cooperativaId: 'coop_coopesa',
    pontoAtendimentoId: 'pa_03', // ID do PA 03
  },
};

// --- Definição de Tipos para Cooperativas e Centrais ---
type Central = {
  id: string;
  nome: string;
  admin: string;
  logo: string;
};
type Cooperativa = {
  id: string;
  centralId: string;
  codigo: string;
  nome: string;
  cnpj: string;
  tipo: 'Central' | 'Singular';
  limiteOutorgado: number;
  limiteUtilizado: number;
  status: 'Ativa' | 'Inativa';
};
type PontoAtendimento = {
  id: string;
  cooperativaId: string;
  codigo: string;
  nome: string;
  status: 'Ativo' | 'Inativo';
};

// Lista de TODAS as Centrais no sistema
const mockCentrais: Central[] = [
  { id: 'c1', nome: 'Hubcoop (Matriz)', admin: 'hubcoop.admin@email.com', logo: 'https://placehold.co/40x40/333333/ffffff?text=H' },
  { id: 'c2', nome: 'CREDISIS CENTRAL', admin: 'patricia.holanda@credisis.com.br', logo: 'https://i.imgur.com/v1bOn4O.png' },
  // Observação:  removida conforme solicitado
];

// Lista de TODAS as Cooperativas
const mockCooperativas: Cooperativa[] = [
  // A própria Central Credisis (para o Master ver)
  { id: 'c2_coop', centralId: 'c1', codigo: '001', nome: 'CREDISIS CENTRAL', cnpj: '12.345.678/0001-00', tipo: 'Central', limiteOutorgado: 50000000, limiteUtilizado: 35000000, status: 'Ativa' },
  // A Hubcoop não deve ver a Uniprime (removida)
  // { id: 'c3_coop', centralId: 'c1', codigo: '100', nome: 'UNIPRIME CENTRAL', ... },

  // Cooperativas da CREDISIS (c2)
  { id: 'coop_crediserv', centralId: 'c2', codigo: '002', nome: 'Crediserv', cnpj: '11.111.111/0001-01', tipo: 'Singular', limiteOutorgado: 10000000, limiteUtilizado: 5000000, status: 'Ativa' },
  { id: 'coop_primacredi', centralId: 'c2', codigo: '003', nome: 'Primacredi', cnpj: '22.222.222/0001-02', tipo: 'Singular', limiteOutorgado: 12000000, limiteUtilizado: 9200000, status: 'Ativa' },
  { id: 'coop_coopesa', centralId: 'c2', codigo: '004', nome: 'Coopesa', cnpj: '33.333.333/0001-03', tipo: 'Singular', limiteOutorgado: 8000000, limiteUtilizado: 4200000, status: 'Ativa' },
  { id: 'coop_credbem', centralId: 'c2', codigo: '005', nome: 'CredBem Metropolitana', cnpj: '44.444.444/0001-04', tipo: 'Singular', limiteOutorgado: 15000000, limiteUtilizado: 8500000, status: 'Ativa' },
  { id: 'coop_uniindustria', centralId: 'c2', codigo: '006', nome: 'Uniindústria', cnpj: '55.555.555/0001-05', tipo: 'Singular', limiteOutorgado: 5000000, limiteUtilizado: 1000000, status: 'Ativa' },
  { id: 'coop_credisul', centralId: 'c2', codigo: '007', nome: 'Credisul', cnpj: '66.666.666/0001-06', tipo: 'Singular', limiteOutorgado: 9000000, limiteUtilizado: 3000000, status: 'Ativa' },
  { id: 'coop_cooperufpa', centralId: 'c2', codigo: '008', nome: 'Cooperufpa', cnpj: '77.777.777/0001-07', tipo: 'Singular', limiteOutorgado: 3000000, limiteUtilizado: 2500000, status: 'Ativa' },
  { id: 'coop_credibras', centralId: 'c2', codigo: '009', nome: 'CrediBrás', cnpj: '88.888.888/0001-08', tipo: 'Singular', limiteOutorgado: 11000000, limiteUtilizado: 5000000, status: 'Ativa' },
  { id: 'coop_oeste', centralId: 'c2', codigo: '010', nome: 'Oeste', cnpj: '99.999.999/0001-09', tipo: 'Singular', limiteOutorgado: 13000000, limiteUtilizado: 7000000, status: 'Ativa' },
  { id: 'coop_crediari', centralId: 'c2', codigo: '011', nome: 'CrediAri', cnpj: '10.101.010/0001-10', tipo: 'Singular', limiteOutorgado: 14000000, limiteUtilizado: 8000000, status: 'Ativa' },
  { id: 'coop_jicred', centralId: 'c2', codigo: '012', nome: 'JiCred', cnpj: '12.121.212/0001-12', tipo: 'Singular', limiteOutorgado: 7000000, limiteUtilizado: 4000000, status: 'Ativa' },
  { id: 'coop_sudoeste', centralId: 'c2', codigo: '013', nome: 'Sudoeste', cnpj: '13.131.313/0001-13', tipo: 'Singular', limiteOutorgado: 6000000, limiteUtilizado: 3000000, status: 'Ativa' },
  { id: 'coop_capitalcredi', centralId: 'c2', codigo: '014', nome: 'CapitalCredi', cnpj: '14.141.414/0001-14', tipo: 'Singular', limiteOutorgado: 18000000, limiteUtilizado: 9000000, status: 'Ativa' },
  { id: 'coop_crediplan', centralId: 'c2', codigo: '015', nome: 'CrediPlan', cnpj: '15.151.515/0001-15', tipo: 'Singular', limiteOutorgado: 10000000, limiteUtilizado: 8000000, status: 'Ativa' },
];

// Lista de TODOS os Pontos de Atendimento (ATUALIZADA)
const mockPontosAtendimento: PontoAtendimento[] = [
  // PAs da Coopesa (para o login "pa03" e "coopesa" funcionarem)
  { id: 'pa_03', cooperativaId: 'coop_coopesa', codigo: '004-03', nome: 'PA Coopesa 03', status: 'Ativo' },
  { id: 'pa_04', cooperativaId: 'coop_coopesa', codigo: '004-04', nome: 'PA Coopesa 04', status: 'Ativo' },
  
  // PAs de outras cooperativas (para a Central "credisis" ver)
  { id: 'pa_05', cooperativaId: 'coop_crediserv', codigo: '002-01', nome: 'PA Crediserv Sede', status: 'Ativo' },
  { id: 'pa_06', cooperativaId: 'coop_primacredi', codigo: '003-01', nome: 'PA Primacredi Centro', status: 'Ativo' },
  { id: 'pa_07', cooperativaId: 'coop_credbem', codigo: '005-01', nome: 'PA CredBem Metropolitana', status: 'Ativo' },
  { id: 'pa_08', cooperativaId: 'coop_uniindustria', codigo: '006-01', nome: 'PA Uniindústria', status: 'Ativo' },
  { id: 'pa_09', cooperativaId: 'coop_credisul', codigo: '007-01', nome: 'PA Credisul', status: 'Ativo' },
  { id: 'pa_10', cooperativaId: 'coop_cooperufpa', codigo: '008-01', nome: 'PA Cooperufpa', status: 'Ativo' },
  { id: 'pa_11', cooperativaId: 'coop_credibras', codigo: '009-01', nome: 'PA CrediBrás', status: 'Ativo' },
  { id: 'pa_12', cooperativaId: 'coop_oeste', codigo: '010-01', nome: 'PA Oeste', status: 'Ativo' },
  { id: 'pa_13', cooperativaId: 'coop_crediari', codigo: '011-01', nome: 'PA CrediAri', status: 'Ativo' },
  { id: 'pa_14', cooperativaId: 'coop_jicred', codigo: '012-01', nome: 'PA JiCred', status: 'Ativo' },
  { id: 'pa_15', cooperativaId: 'coop_sudoeste', codigo: '013-01', nome: 'PA Sudoeste', status: 'Ativo' },
  { id: 'pa_16', cooperativaId: 'coop_capitalcredi', codigo: '014-01', nome: 'PA CapitalCredi', status: 'Ativo' },
  { id: 'pa_17', cooperativaId: 'coop_crediplan', codigo: '015-01', nome: 'PA CrediPlan', status: 'Ativo' },
];

// =======================================================================
// 2. Componente Principal do Aplicativo (Refatorado)
// =======================================================================
export default function App() {
  // O estado agora guarda o OBJETO do usuário, ou null
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    // Passamos os usuários de simulação para a página de login
    return <LoginPage onLogin={handleLogin} simulatedUsers={mockUsuariosLogin} />;
  }

  // Passamos o usuário logado como PROP para o Dashboard
  return <DashboardLayout usuario={currentUser} onLogout={handleLogout} />;
}
// =======================================================================
// 3. A Tela de Login (Refatorada para Simulação)
// =======================================================================
function LoginPage({ onLogin, simulatedUsers }: { onLogin: (user: User) => void; simulatedUsers: Record<string, User> }) {
  // Não precisamos mais do formulário, vamos usar botões para simular
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: 'linear-gradient(120deg, #f0f4f4, #e6f0ef)' }}
    >
      <div className="w-full max-w-md p-10 space-y-6 bg-white shadow-2xl rounded-2xl border border-gray-200">
        <div className="flex justify-center">
          <h1 className="text-6xl font-bold" style={{ color: HUB_BRAND_COLOR }}>
            Hubcoop
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-600">
          Simular Acesso
        </h2>
        <div
          className="w-1/4 mx-auto"
          style={{ height: '3px', backgroundColor: HUB_BRAND_COLOR }}
        ></div>
        
        {/* Botões de Simulação */}
        <div className="space-y-4 pt-4">
          <LoginButton
            onClick={() => onLogin(simulatedUsers.hubcoop)}
            perfil="Master (Hubcoop)"
            email={simulatedUsers.hubcoop.email}
          />
          <LoginButton
            onClick={() => onLogin(simulatedUsers.credisis)}
            perfil="Central (Credisis)"
            email={simulatedUsers.credisis.email}
          />
          <LoginButton
            onClick={() => onLogin(simulatedUsers.coopesa)}
            perfil="Cooperativa (Coopesa)"
            email={simulatedUsers.coopesa.email}
          />
          <LoginButton
            onClick={() => onLogin(simulatedUsers.pa03)}
            perfil="Ponto de Atendimento (PA 03)"
            email={simulatedUsers.pa03.email}
          />
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para os botões de login
function LoginButton({ onClick, perfil, email }: { onClick: () => void; perfil: string; email: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-4 py-3 text-left text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      style={{ backgroundColor: HUB_BRAND_COLOR }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2c5d5a')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = HUB_BRAND_COLOR)}
    >
      <span className="font-semibold text-lg">{perfil}</span>
      <span className="block text-sm opacity-90">{email}</span>
    </button>
  );
}

// ====================================
// 4. O Layout Principal do Dashboard 
// ====================================
function DashboardLayout({ onLogout, usuario }: { onLogout: () => void; usuario: User }) {
  const [activePage, setActivePage] = useState(usuario.perfil === 'Master' ? 'Configuracoes' : 'Dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 4.1. Menu Lateral (Sidebar) */}
      <aside
        className="flex flex-col w-64 text-white shadow-xl"
        style={{ backgroundColor: HUB_BRAND_COLOR }}
      >
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-3xl font-bold">Hubcoop</h1>
        </div>
        
        {/* 4.2. Menu de Navegação Principal */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
          {/* Links visíveis para todos, EXCETO Master */}
          {usuario.perfil !== 'Master' && (
            <>
              <SidebarLink text="Dashboard" icon={<Home size={18} />} active={activePage === 'Dashboard'} onClick={() => setActivePage('Dashboard')} />
              <SidebarLink text="Cooperados" icon={<Users2 size={18} />} active={activePage === 'Cooperados'} onClick={() => setActivePage('Cooperados')} />
              <SidebarLink text="Cartões" icon={<CreditCard size={18} />} active={activePage === 'Cartoes'} onClick={() => setActivePage('Cartoes')} />
              <SidebarLink text="Transações" icon={<DollarSign size={18} />} active={activePage === 'Transacoes'} onClick={() => setActivePage('Transacoes')} />
              <SidebarLink text="Faturas" icon={<FileText size={18} />} active={activePage === 'Faturas'} onClick={() => setActivePage('Faturas')} />
              <SidebarLink text="Relatórios" icon={<BarChart3 size={18} />} active={activePage === 'Relatorios'} onClick={() => setActivePage('Relatorios')} />
              <SidebarLink text="Loyalty (Pontos)" icon={<Gift size={18} />} active={activePage === 'Loyalty'} onClick={() => setActivePage('Loyalty')} />
              <SidebarLink text="Sala VIP" icon={<Armchair size={18} />} active={activePage === 'SalaVIP'} onClick={() => setActivePage('SalaVIP')} />
            </>
          )}

          {/* "Cooperativas" - Apenas Central e Cooperativa */}
          {(usuario.perfil === 'Central' || usuario.perfil === 'Cooperativa') && (
            <SidebarLink text="Cooperativas" icon={<Building size={18} />} active={activePage === 'Cooperativas'} onClick={() => setActivePage('Cooperativas')} />
          )}

          {/* "Usuários" - Apenas Central */}
          {usuario.perfil === 'Central' && (
            <SidebarLink text="Usuários" icon={<Users size={18} />} active={activePage === 'Usuarios'} onClick={() => setActivePage('Usuarios')} />
          )}
        </nav>

        {/* 4.3. Rodapé do Menu (Configurações e Sair) */}
        <div className="p-2 border-t border-white border-opacity-20 space-y-1">
          {/* Configurações agora fica fixo embaixo */}
          <SidebarLink
            text="Configurações"
            icon={<Settings size={18} />}
            active={activePage === 'Configuracoes'}
            onClick={() => setActivePage('Configuracoes')}
          />
          <SidebarLink 
            text="Sair" 
            icon={<LogOut size={18} />} 
            active={false}  
            onClick={onLogout}
          />
        </div>
      </aside>

      {/* Conteúdo Principal (Direita) - Mantido Igual */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between h-20 px-6 bg-white shadow-md">
          <h2 className="text-3xl font-semibold text-gray-700">
            {activePage === 'Loyalty' ? 'Loyalty (Pontos)' : activePage}
          </h2>
          <div className="text-right">
            <div className="flex items-center space-x-6">
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-gray-700">Última atualização:</div>
                <div className="text-xs text-gray-500">17/11/2025 16:30:00</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">{usuario.nome}</div>
                <div className="text-sm text-gray-500">
                  {usuario.perfil}
                  {usuario.centralId && ` | Central: ${mockCentrais.find(c => c.id === usuario.centralId)?.nome}`}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {activePage === 'Dashboard' && <PaginaDashboard usuario={usuario} />}
          {activePage === 'Cooperados' && <PaginaCooperados usuario={usuario} />}
          {activePage === 'Cartoes' && <PaginaCartoes usuario={usuario} />}
          {activePage === 'Transacoes' && <PaginaTransacoes usuario={usuario} />}
          {activePage === 'Faturas' && <PaginaFaturas usuario={usuario} />}
          {activePage === 'Relatorios' && <PaginaRelatorios usuario={usuario} />}
          {activePage === 'Loyalty' && <PaginaLoyalty usuario={usuario} />}
          {activePage === 'SalaVIP' && <PaginaSalaVIP usuario={usuario} />}
          {activePage === 'Cooperativas' && <PaginaCooperativas usuario={usuario} />} 
          {activePage === 'Usuarios' && <PaginaUsuarios usuario={usuario} />}
          {activePage === 'Configuracoes' && <PaginaConfiguracoes usuario={usuario} />}
          
          {activePage !== 'Dashboard' && 
           activePage !== 'Cooperados' && 
           activePage !== 'Cartoes' && 
           activePage !== 'Transacoes' && 
           activePage !== 'Faturas' && 
           activePage !== 'Relatorios' &&
           activePage !== 'Loyalty' &&
           activePage !== 'SalaVIP' &&
           activePage !== 'Cooperativas' &&
           activePage !== 'Usuarios' &&
           activePage !== 'Configuracoes' && (
            <PaginaPlaceholder pageName={activePage} />
          )}
        </main>
      </div>
    </div>
  );
}
// =======================================================================
// 5. Componente auxiliar para os Links do Menu (Sem alterações)
// =======================================================================
interface SidebarLinkProps {
  text: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}
function SidebarLink({ text, icon, active, onClick }: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full px-3 py-2 space-x-3 text-left rounded-lg transition-all duration-200 text-sm
        ${
          active
            ? 'bg-teal-800 font-semibold shadow-md'
            : 'hover:bg-white hover:bg-opacity-10 opacity-90 hover:opacity-100'
        }
      `}
    >
      {icon}
      <span className="truncate">{text}</span>
    </button>
  );
}

// =======================================================================
// 6. Placeholder para páginas futuras (Sem alterações)
// =======================================================================
function PaginaPlaceholder({ pageName }: { pageName: string }) {
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold">
        {pageName}
      </h3>
      <p className="mt-2 text-gray-600">
        Conteúdo da página "{pageName}" apareceria aqui.
      </p>
    </div>
  );
}

// =======================================================================
// 7. A PÁGINA DE DASHBOARD (COM PROP DE USUÁRIO)
// =======================================================================
/* ... (Todo o código da PaginaDashboard e seus sub-componentes continua o mesmo) ... */
// --- Definição de Tipos para o Dashboard ---
type KpiCardProps = {
  title: string; value: string; change: string;
  changeType: 'positive' | 'negative' | 'info';
  icon: React.ElementType;
};
type AlertasBloqueiosProps = { data: { bloqueados: number; atrasadas: number } };
type LimiteDeCreditoProps = { data: { utilizado: number; disponivel: number }; percentual: number };
type ResumoDeFaturasProps = { data: { abertas: number; pagas: number; vencidas: number } };
type Solicitacao = { id: number; nome: string; card: string; status: string };
type Transacao = { id: number; nome: string; card: string; valor: string; status: string };
type Atividade = { name: string; value: number; color: string };

// --- Dados Mockados do Dashboard ---
const mockKpiData: KpiCardProps[] = [
  { title: 'Total de Cartões', value: '12,458', change: '+12%', changeType: 'positive', icon: CreditCard },
  { title: 'Cooperados Ativos', value: '8,342', change: '+8%', changeType: 'positive', icon: Users2 },
  { title: 'Transações Hoje', value: '2,847', change: '-3%', changeType: 'negative', icon: List },
  { title: 'Volume Total', value: 'R$ 2.4M', change: '+18%', changeType: 'positive', icon: DollarSign },
  { title: 'Limite Utilizado', value: 'R$ 105K', change: 'R$ 126.8K disp.', changeType: 'info', icon: Wallet },
  { title: 'Faturas Vencidas', value: '14', change: 'R$ 12.5K', changeType: 'negative', icon: ShieldAlert },
];
const mockLimiteCredito = { utilizado: 105200.00, disponivel: 126800.00, total: 232000.00 };
const mockResumoFaturas = { abertas: 6, pagas: 8, vencidas: 0 };
const mockAlertas = { bloqueados: 2, atrasadas: 0 };
const mockAtividadeCartao: Atividade[] = [
  { name: 'Visa Infinite', value: 3421, color: 'bg-indigo-600' },
  { name: 'Visa Gold', value: 2847, color: 'bg-yellow-500' },
  { name: 'Visa Classic', value: 4190, color: 'bg-sky-500' },
  { name: 'Visa Electron', value: 2000, color: 'bg-teal-500' },
];
const mockSolicitacoesRecentes: Solicitacao[] = [
  { id: 1, nome: 'Daniel C. Oliveira', card: 'Visa Classic - R$ 5.000,00', status: 'Em análise' },
  { id: 2, nome: 'Ana Beatriz Silva', card: 'Visa Infinite - R$ 25.000,00', status: 'Em análise' },
  { id: 3, nome: 'Roberto L. Souza', card: 'Visa Gold - R$ 10.000,00', status: 'Em análise' },
];
const mockTransacoesRecentes: Transacao[] = [
  { id: 1, nome: 'Supermercado Extra', card: 'Supermercado', valor: 'R$ 205.352', status: 'Aprovada' },
  { id: 2, nome: 'Posto Shell', card: 'Gasolina', valor: 'R$ 150.00', status: 'Aprovada' },
  { id: 3, nome: 'Amazon.com.br', card: 'Online', valor: 'R$ 89.90', status: 'Aprovada' },
];

// --- Componente PaginaDashboard ---
function PaginaDashboard({ usuario }: { usuario: User }) {
  // Se for Master, nem renderiza o dashboard
  if (usuario.perfil === 'Master') {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg text-center">
        <h3 className="text-2xl font-semibold">Bem-vindo, Administrador Master</h3>
        <p className="mt-2 text-gray-600">
          Utilize o menu "Configurações" para gerenciar as centrais do sistema.
        </p>
      </div>
    );
  }

  const percentualUtilizado = (mockLimiteCredito.utilizado / mockLimiteCredito.total) * 100;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {mockKpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AlertasBloqueios data={mockAlertas} />
        <LimiteDeCredito data={mockLimiteCredito} percentual={percentualUtilizado} />
        <ResumoDeFaturas data={mockResumoFaturas} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SolicitacoesRecentes data={mockSolicitacoesRecentes} />
        <TransacoesRecentes data={mockTransacoesRecentes} />
        <AtividadePorCartao data={mockAtividadeCartao} />
      </div>
    </div>
  );
}

// --- Componentes do Dashboard (KpiCard, AlertasBloqueios, etc) ---
function KpiCard({ title, value, change, changeType, icon: Icon }: KpiCardProps) {
  // ... (código idêntico)
  const changeColor = { positive: 'text-green-600', negative: 'text-red-600', info: 'text-gray-500' }[changeType];
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
      <div className="flex items-center mt-2 text-xs">
        <span className={`flex items-center font-semibold ${changeColor}`}>
          {changeType === 'positive' && <TrendingUp className="w-4 h-4 mr-1" />}
          {changeType === 'negative' && <TrendingDown className="w-4 h-4 mr-1" />}
          {change}
        </span>
        {changeType !== 'info' && <span className="ml-1 text-gray-500">desde o último mês</span>}
      </div>
    </div>
  );
}
function AlertasBloqueios({ data }: AlertasBloqueiosProps) {
  // ... (código idêntico)
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" /> Alertas e Bloqueios
      </h3>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
          <span className="font-medium text-red-700">Cartões Bloqueados</span>
          <span className="px-2 py-0.5 text-sm font-bold text-white bg-red-600 rounded-full">{data.bloqueados}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <span className="font-medium text-orange-700">Faturas Atrasadas</span>
          <span className="px-2 py-0.5 text-sm font-bold text-white bg-orange-600 rounded-full">{data.atrasadas}</span>
        </div>
      </div>
    </div>
  );
}
function LimiteDeCredito({ data, percentual }: LimiteDeCreditoProps) {
  // ... (código idêntico)
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Landmark className="w-5 h-5 mr-2 text-hub-teal" /> Limite de Crédito
      </h3>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="h-2.5 rounded-full" style={{ width: `${percentual}%`, backgroundColor: HUB_BRAND_COLOR }}></div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="font-medium text-gray-700">Utilizado</span>
          <span className="font-bold text-gray-800">{data.utilizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Disponível</span>
          <span className="font-bold text-green-600">{data.disponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
      </div>
    </div>
  );
}
function ResumoDeFaturas({ data }: ResumoDeFaturasProps) {
  // ... (código idêntico)
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FileCheck className="w-5 h-5 mr-2 text-blue-500" /> Resumo de Faturas
      </h3>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center text-gray-700">
          <span className="flex items-center"><FileClock className="w-4 h-4 mr-2" /> Abertas</span>
          <span className="font-bold">{data.abertas}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span className="flex items-center"><FileCheck className="w-4 h-4 mr-2" /> Pagas</span>
          <span className="font-bold text-green-600">{data.pagas}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span className="flex items-center"><FileX className="w-4 h-4 mr-2" /> Vencidas</span>
          <span className="font-bold text-red-600">{data.vencidas}</span>
        </div>
      </div>
    </div>
  );
}
function SolicitacoesRecentes({ data }: { data: Solicitacao[] }) {
  // ... (código idêntico)
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg xl:col-span-1">
      <h3 className="text-lg font-semibold text-gray-800">Solicitações Recentes</h3>
      <div className="mt-4 space-y-4">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{item.nome}</p>
              <p className="text-sm text-gray-500">{item.card}</p>
            </div>
            <span className="text-xs font-semibold text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function TransacoesRecentes({ data }: { data: Transacao[] }) {
  // ... (código idêntico)
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg xl:col-span-1">
      <h3 className="text-lg font-semibold text-gray-800">Transações Recentes</h3>
      <div className="mt-4 space-y-4">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg mr-3">
                 <Landmark className="w-5 h-5 text-hub-teal" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{item.nome}</p>
                <p className="text-sm text-gray-500">{item.card}</p>
              </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-gray-800">{item.valor}</p>
                <span className="text-xs font-semibold text-green-800 bg-green-100 px-2.5 py-0.5 rounded-full">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function AtividadePorCartao({ data }: { data: Atividade[] }) {
  // ... (código idêntico)
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg xl:col-span-1">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-orange-500" /> Atividade por Tipo de Cartão
      </h3>
      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex justify-between items-center">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></span>
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-800">{item.value.toLocaleString('pt-BR')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// --- Definição de Tipos para Cooperados (ATUALIZADO) ---
type Cooperado = {
  id: number;
  nome: string;
  cpf: string;
  cooperativa: string; // ex: Coopesa
  email: string;
  telefone: string;
  status: 'ativo' | 'bloqueado';
  // --- CAMPOS ADICIONADOS ---
  centralId: string;
  cooperativaId: string;
  pontoAtendimentoId: string;
};
type TransacaoCooperado = {
  id: number; cod: string; data: string;
  status: 'Negado' | 'Aprovado' | 'Em análise';
  cartao: string; limite: string;
};

// --- Dados Mockados da Página Cooperados (ATUALIZADOS) ---
const mockCooperados: Cooperado[] = [
  // Cooperados da Coopesa (PA 03)
  { id: 1, nome: 'Maria Santos Oliveira', cpf: '234.567.890-11', cooperativa: 'Coopesa', email: 'maria.santos@email.com', telefone: '(11) 99076-5432', status: 'ativo', centralId: 'c2', cooperativaId: 'coop_coopesa', pontoAtendimentoId: 'pa_03' },
  { id: 2, nome: 'João Pedro Costa', cpf: '345.678.901-22', cooperativa: 'Coopesa', email: 'joao.costa@email.com', telefone: '(41) 98765-1234', status: 'ativo', centralId: 'c2', cooperativaId: 'coop_coopesa', pontoAtendimentoId: 'pa_03' },
  // Cooperados da Coopesa (PA 04)
  { id: 3, nome: 'Carlos Eduardo Souza', cpf: '567.890.123-44', cooperativa: 'Coopesa', email: 'carlos.souza@email.com', telefone: '(81) 98765-0012', status: 'ativo', centralId: 'c2', cooperativaId: 'coop_coopesa', pontoAtendimentoId: 'pa_04' },
  // Cooperados da Crediserv (PA 05)
  { id: 4, nome: 'Ana Paula Ferreira', cpf: '456.789.012-33', cooperativa: 'Crediserv', email: 'ana.ferreira@email.com', telefone: '(31) 99076-5678', status: 'ativo', centralId: 'c2', cooperativaId: 'coop_crediserv', pontoAtendimentoId: 'pa_05' },
  { id: 5, nome: 'Fernanda Lima Santos', cpf: '678.901.234-55', cooperativa: 'Crediserv', email: 'fernanda.lima@email.com', telefone: '(11) 97654-3210', status: 'bloqueado', centralId: 'c2', cooperativaId: 'coop_crediserv', pontoAtendimentoId: 'pa_05' },
];
const mockTransacoesCooperado: TransacaoCooperado[] = [
  { id: 1, cod: '1538', data: '18/12/19', status: 'Negado', cartao: 'Visa Classic', limite: 'R$5.000,00' },
  { id: 2, cod: '1538', data: '18/12/19', status: 'Em análise', cartao: 'Visa Classic', limite: 'R$5.000,00' },
  { id: 3, cod: '1538', data: '18/12/19', status: 'Aprovado', cartao: 'Visa Classic', limite: 'R$5.000,00' },
  { id: 4, cod: '1538', data: '18/12/19', status: 'Negado', cartao: 'Visa Classic', limite: 'R$5.000,00' },
  { id: 5, cod: '1538', data: '18/12/19', status: 'Aprovado', cartao: 'Visa Empresarial', limite: 'R$5.000,00' },
];
const mockTiposDeCartao = [
  { id: 'classic', nome: 'Classic', img: 'https://placehold.co/100x60/a0aec0/ffffff?text=VISA' },
  { id: 'empresarial', nome: 'Empresarial', img: 'https://placehold.co/100x60/2c5282/ffffff?text=VISA' }, // <-- SUBSTITUÍDO
  { id: 'gold', nome: 'Gold', img: 'https://placehold.co/100x60/d69e2e/ffffff?text=VISA' },
  { id: 'infinite', nome: 'Infinite', img: 'https://placehold.co/100x60/2d3748/ffffff?text=VISA' },
  { id: 'platinum', nome: 'Platinum', img: 'https://placehold.co/100x60/718096/ffffff?text=VISA' },
];

// --- Componente PAI da Página Cooperados (COM LÓGICA DE SEGREGAÇÃO) ---
function PaginaCooperados({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedCooperado, setSelectedCooperado] = useState<Cooperado | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- LÓGICA DE SEGREGAÇÃO (NOVA) ---
  const cooperadosVisiveis = mockCooperados.filter(coop => {
    if (usuario.perfil === 'Central') {
      return coop.centralId === usuario.centralId;
    }
    if (usuario.perfil === 'Cooperativa') {
      return coop.cooperativaId === usuario.cooperativaId;
    }
    if (usuario.perfil === 'PA') {
      return coop.pontoAtendimentoId === usuario.pontoAtendimentoId;
    }
    return false; // Master não vê cooperados
  });

  const filteredCooperados = cooperadosVisiveis.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCooperado = (cooperado: Cooperado) => {
    setSelectedCooperado(cooperado);
    setViewMode('detail');
  };
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCooperado(null);
  };
  const handleOpenModal = () => { setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); };

  // Se o Master cair aqui (não devia, mas por via das dúvidas)
  if (usuario.perfil === 'Master') {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
        <h3 className="text-2xl font-semibold mt-4">Acesso Indisponível</h3>
        <p className="mt-2 text-gray-600">
          O perfil Master não gerencia cooperados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {viewMode === 'list' ? 'Gestão de Cooperados' : `Detalhe: ${selectedCooperado?.nome}`}
        </h2>
        {viewMode === 'detail' && (
          <button
            onClick={handleBackToList}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar para a lista
          </button>
        )}
      </div>
      {viewMode === 'list' && (
        <ListaCooperados
          cooperados={filteredCooperados}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelect={handleSelectCooperado}
        />
      )}
      {viewMode === 'detail' && selectedCooperado && (
        <DetalheCooperado
          cooperado={selectedCooperado}
          transacoes={mockTransacoesCooperado}
          onSolicitarCartao={handleOpenModal}
        />
      )}
      {showModal && selectedCooperado && (
        <ModalSolicitarCartao
          cooperado={selectedCooperado}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// --- Componentes da Página Cooperados ---
type ListaCooperadosProps = {
  cooperados: Cooperado[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelect: (cooperado: Cooperado) => void;
};

function ListaCooperados({ cooperados, searchTerm, setSearchTerm, onSelect }: ListaCooperadosProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome, CPF, CNPJ ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button
          className="flex items-center px-4 py-2 text-white rounded-lg shadow-sm transition-colors"
          style={{ backgroundColor: HUB_BRAND_COLOR }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cooperado
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cooperativa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visualizar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cooperados.map((cooperado) => (
              <tr key={cooperado.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cooperado.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cooperado.cpf}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cooperado.cooperativa}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cooperado.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cooperado.telefone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                    cooperado.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {cooperado.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* REMOVIDO O BOTÃO DE LIXEIRA, MANTEVE APENAS O OLHO */}
                  <button 
                    onClick={() => onSelect(cooperado)} 
                    className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                    title="Visualizar Detalhes"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
type DetalheCooperadoProps = {
  cooperado: Cooperado;
  transacoes: TransacaoCooperado[];
  onSolicitarCartao: () => void;
};
function DetalheCooperado({ cooperado, transacoes, onSolicitarCartao }: DetalheCooperadoProps) {
  // ... (código idêntico)
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
           <h3 className="text-xl font-semibold text-gray-800">Dados do Cooperado</h3>
           <button
             onClick={onSolicitarCartao}
             className="flex items-center px-4 py-2 text-white rounded-lg shadow-sm transition-colors"
             style={{ backgroundColor: HUB_BRAND_COLOR }}
           >
             <Plus className="w-5 h-5 mr-2" />
             Solicitar Novo Cartão
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Nome Completo</label>
            <p className="text-sm text-gray-900">{cooperado.nome}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">CPF</label>
            <p className="text-sm text-gray-900">{cooperado.cpf}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Status</label>
            <p className="text-sm text-gray-900 capitalize">{cooperado.status}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">E-mail</label>
            <p className="text-sm text-gray-900">{cooperado.email}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Telefone</label>
            <p className="text-sm text-gray-900">{cooperado.telefone}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Cooperativa</label>
            <p className="text-sm text-gray-900">{cooperado.cooperativa}</p>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Transações do Cooperado</h3>
        <p className="text-sm text-gray-500 mb-4">Exibindo as últimas transações e solicitações.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cód.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cartão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limite Inicial</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacoes.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.cod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.data}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      tx.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                      tx.status === 'Negado' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.cartao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.limite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// =======================================================================
// 9. Componente Modal de Solicitação de Cartão (Sem alterações)
// =======================================================================
/* ... (Todo o código do ModalSolicitarCartao e seus sub-componentes continua o mesmo) ... */
type ModalSolicitarCartaoProps = {
  cooperado: Cooperado;
  onClose: () => void;
};
type Endereco = { cep: string; rua: string; numero: string; bairro: string; cidade: string; uf: string; compl: string };

function ModalSolicitarCartao({ cooperado, onClose }: ModalSolicitarCartaoProps) {
  // ... (código idêntico)
  const [step, setStep] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [nomeNoCartao, setNomeNoCartao] = useState(cooperado.nome);
  const [tipoEnvio, setTipoEnvio] = useState('cooperado');
  const [outroEndereco, setOutroEndereco] = useState<Endereco>({
    cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', compl: ''
  });

  const dataValidade = new Date();
  dataValidade.setFullYear(dataValidade.getFullYear() + 5);
  const validadeFormatada = dataValidade.toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' });
  const cardSelecionadoInfo = mockTiposDeCartao.find(c => c.id === selectedCardId);

  const proximaEtapa = () => setStep(s => s + 1);
  const etapaAnterior = () => setStep(s => s - 1);

  const renderEtapa = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Selecione abaixo o produto desejado:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTiposDeCartao.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`flex items-center p-4 border rounded-lg transition-all ${
                    selectedCardId === card.id ? 'border-hub-teal ring-2 ring-hub-teal' : 'border-gray-300 hover:shadow-md'
                  }`}
                >
                  <input
                    type="radio"
                    name="card-type"
                    checked={selectedCardId === card.id}
                    readOnly
                    className="w-5 h-5 text-hub-teal focus:ring-hub-teal"
                  />
                  <span className="ml-4 text-lg font-medium">{card.nome}</span>
                  <img src={card.img} alt={card.nome} className="w-20 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Dados do Cartão</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="nomeCartao" className="block text-sm font-medium text-gray-700">
                    Nome do Cooperado (como ficará no cartão)
                  </label>
                  <input
                    type="text"
                    id="nomeCartao"
                    value={nomeNoCartao}
                    onChange={(e) => setNomeNoCartao(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
                  />
                </div>
                <div>
                  <label htmlFor="validade" className="block text-sm font-medium text-gray-700">
                    Data de Validade (calculada)
                  </label>
                  <input
                    type="text"
                    id="validade"
                    value={validadeFormatada}
                    disabled
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-64 h-40 bg-gray-800 rounded-xl p-5 flex flex-col justify-between text-white shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">VISA</span>
                    <img src={cardSelecionadoInfo?.img.replace('100x60', '80x50')} alt={cardSelecionadoInfo?.nome} />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm tracking-widest">**** **** **** ****</p>
                    <p className="text-xs mt-2">VALIDADE {validadeFormatada}</p>
                    <p className="text-lg font-medium tracking-wider mt-1">{nomeNoCartao || 'NOME NO CARTÃO'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Dados do Envio</h3>
            <div className="space-y-3">
              <RadioOpcaoEnvio
                label="Endereço do Cooperado"
                value="cooperado"
                checked={tipoEnvio === 'cooperado'}
                onChange={setTipoEnvio}
              />
              <RadioOpcaoEnvio
                label="Na Cooperativa"
                value="cooperativa"
                checked={tipoEnvio === 'cooperativa'}
                onChange={setTipoEnvio}
              />
              <RadioOpcaoEnvio
                label="No Ponto de Atendimento (PA)"
                value="pa"
                checked={tipoEnvio === 'pa'}
                onChange={setTipoEnvio}
              />
              <RadioOpcaoEnvio
                label="Cadastrar novo endereço de entrega"
                value="outro"
                checked={tipoEnvio === 'outro'}
                onChange={setTipoEnvio}
              />
            </div>
            {tipoEnvio === 'outro' && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="text-md font-semibold mb-3">Cadastrar Novo Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="CEP"
                    value={outroEndereco.cep}
                    onChange={(e) => setOutroEndereco({...outroEndereco, cep: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm col-span-1"
                  />
                  <input
                    type="text"
                    placeholder="Rua / Logradouro"
                    value={outroEndereco.rua}
                    onChange={(e) => setOutroEndereco({...outroEndereco, rua: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    value={outroEndereco.numero}
                    onChange={(e) => setOutroEndereco({...outroEndereco, numero: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm col-span-1"
                  />
                  <input
                    type="text"
                    placeholder="Complemento (Opcional)"
                    value={outroEndereco.compl}
                    onChange={(e) => setOutroEndereco({...outroEndereco, compl: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm col-span-2"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Revisão da Solicitação</h3>
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <InfoRevisao label="Cooperado" value={cooperado.nome} />
              <InfoRevisao label="Produto Selecionado" value={cardSelecionadoInfo?.nome || 'N/A'} />
              <InfoRevisao label="Nome no Cartão" value={nomeNoCartao} />
              <InfoRevisao label="Data de Validade" value={validadeFormatada} />
              <InfoRevisao label="Tipo de Envio" value={
                tipoEnvio === 'cooperado' ? 'Endereço do Cooperado' :
                tipoEnvio === 'cooperativa' ? 'Na Cooperativa' :
                tipoEnvio === 'pa' ? 'No Ponto de Atendimento' :
                'Novo Endereço Cadastrado'
              } />
              {tipoEnvio === 'outro' && (
                <div className="pl-6 text-sm">
                  <p>{outroEndereco.rua}, {outroEndereco.numero} {outroEndereco.compl}</p>

                  <p>{outroEndereco.cep}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center justify-center text-center p-10">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold">Solicitação Enviada!</h3>
            <p className="text-gray-600 mt-2">
              A nova solicitação de cartão para {cooperado.nome} foi processada com sucesso.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    // ... (código idêntico do wrapper do modal)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8 max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h2 className="text-2xl font-semibold">Solicitação de Cartão</h2>
            <p className="text-sm text-gray-500">Cooperado: {cooperado.nome}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper (Etapas) */}
        <div className="flex justify-between items-center my-6">
          <StepperStep num={1} title="Seleção do Produto" active={step === 1} completed={step > 1} />
          <StepperLine />
          <StepperStep num={2} title="Dados do Cartão" active={step === 2} completed={step > 2} />
          <StepperLine />
          <StepperStep num={3} title="Dados do Envio" active={step === 3} completed={step > 3} />
          <StepperLine />
          <StepperStep num={4} title="Revisão" active={step === 4} completed={step > 4} />
          <StepperLine />
          <StepperStep num={5} title="Confirmação" active={step === 5} completed={step > 5} />
        </div>

        {/* Conteúdo da Etapa (flex-1 para ocupar espaço e permitir scroll se necessário) */}
        <div className="flex-1 overflow-y-auto pr-2">
          {renderEtapa()}
        </div>

        {/* Botões de Navegação do Rodapé */}
        <div className="flex justify-between pt-6 border-t mt-6">
          <button
            onClick={etapaAnterior}
            disabled={step === 1 || step === 5}
            className="flex items-center px-6 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm
                       disabled:opacity-0 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Anterior
          </button>
          {step < 4 && (
             <button
              onClick={proximaEtapa}
              disabled={step === 1 && !selectedCardId}
              className="flex items-center px-6 py-2 text-white rounded-lg shadow-sm disabled:opacity-50"
              style={{ backgroundColor: HUB_BRAND_COLOR }}
            >
              Próximo <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          )}
          {step === 4 && (
             <button
              onClick={proximaEtapa}
              className="flex items-center px-6 py-2 text-white bg-green-600 rounded-lg shadow-sm"
            >
              Confirmar Solicitação <CheckCircle className="w-5 h-5 ml-1" />
            </button>
          )}
          {step === 5 && (
             <button
              onClick={onClose}
              className="flex items-center px-6 py-2 text-white rounded-lg shadow-sm"
              style={{ backgroundColor: HUB_BRAND_COLOR }}
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Componentes auxiliares do Modal (AGORA COM 'COMPLETED') ---
/* ... (Todos os componentes auxiliares StepperStep, StepperLine, etc. continuam idênticos) ... */
function StepperStep({ num, title, active, completed }: { num: number; title: string; active: boolean; completed?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
        active ? 'bg-hub-teal text-white' :
        completed ? 'bg-green-500 text-white' :
        'bg-gray-200 text-gray-600'
      }`}>
        {completed ? <Check className="w-5 h-5" /> : num}
      </span>
      <span className={`mt-2 text-xs font-semibold ${active ? 'text-hub-teal' : 'text-gray-500'}`}>{title}</span>
    </div>
  );
}
function StepperLine() {
  return <div className="flex-1 h-0.5 bg-gray-200"></div>;
}
function RadioOpcaoEnvio({ label, value, checked, onChange }: { label: string; value: string; checked: boolean; onChange: (value: string) => void }) {
  return (
    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
      checked ? 'border-hub-teal ring-2 ring-hub-teal' : 'border-gray-300'
    }`}>
      <input
        type="radio"
        name="envio"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="w-5 h-5 text-hub-teal focus:ring-hub-teal"
      />
      <span className="ml-3 text-sm font-medium text-gray-800">{label}</span>
    </label>
  );
}
function InfoRevisao({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col md:flex-row">
      <span className="text-sm font-medium text-gray-500 w-full md:w-1/3">{label}</span>
      <span className="text-sm font-semibold text-gray-900 w-full md:w-2/3">{value}</span>
    </div>
  );
}

// =======================================================================
// 10. A PÁGINA DE CARTÕES (COM PROP DE USUÁRIO)
// =======================================================================
/* ... (Todo o código da PaginaCartoes e seus sub-componentes continua o mesmo) ... */
// --- Definição de Tipos para Cartões ---
type CartaoStatus = 'ativo' | 'vencido' | 'bloqueado_preventivo';
type Cartao = {
  id: number;
  cooperado: string;
  conta: string;
  tipo: string;
  bandeira: string;
  limite: number;
  disponivel: number;
  validade: string;
  status: CartaoStatus;
};
type ProdutoAnuidade = {
  id: string;
  nome: string;
  valor: number;
};
type RegraDesconto = {
  id: number;
  gasto: number;
  desconto: number;
  produto: string;
};
type ProdutoConfig = {
  id: string;
  nome: string;
  multa: number;
  mora: number;
  juros: number;
};

// --- Dados Mockados da Página Cartões ---
const mockKpiCartoes = {
  ativos: 8,
  bloqueados: 2,
  vencidos: 2,
};
const mockListaDeCartoes: Cartao[] = [
  { id: 1, cooperado: 'Fernanda Lima Santos', conta: 'CC-006-123456', tipo: 'classic', bandeira: 'VISA', limite: 6000, disponivel: 1200, validade: '12/11/2023', status: 'vencido' },
  { id: 2, cooperado: 'Carlos Eduardo Souza', conta: 'CC-005-127456', tipo: 'gold', bandeira: 'MASTERCARD', limite: 12000, disponivel: 3600, validade: '12/11/2022', status: 'bloqueado_preventivo' },
  { id: 3, cooperado: 'Ana Paula Ferreira', conta: 'CC-004-120456', tipo: 'infinite', bandeira: 'VISA', limite: 50000, disponivel: 20000, validade: '12/11/2031', status: 'ativo' },
  // ... (o resto da lista de cartões)
  { id: 4, cooperado: 'João Pedro Costa', conta: 'CC-003-125456', tipo: 'classic', bandeira: 'VISA', limite: 8000, disponivel: 4000, validade: '12/11/2030', status: 'ativo' },
  { id: 5, cooperado: 'Maria Santos Oliveira', conta: 'CC-002-124456', tipo: 'platinum', bandeira: 'MASTERCARD', limite: 25000, disponivel: 15000, validade: '12/11/2029', status: 'ativo' },
  { id: 6, cooperado: 'Daniel Oliveira Silva', conta: 'CC-002-123456', tipo: 'gold', bandeira: 'VISA', limite: 15000, disponivel: 10500, validade: '12/11/2028', status: 'ativo' },
  { id: 7, cooperado: 'Ana Paula Ferreira', conta: 'CC-004-456789', tipo: 'infinite', bandeira: 'VISA', limite: 50000, disponivel: 30000, validade: '30/03/2030', status: 'ativo' },
  { id: 8, cooperado: 'Maria Santos Oliveira', conta: 'CC-002-124567', tipo: 'platinum', bandeira: 'MASTERCARD', limite: 25000, disponivel: 15000, validade: '29/06/2029', status: 'ativo' },
];

// --- Novos Tipos para Acompanhamento de Entrega ---
type StatusEntrega = 'Criado' | 'Em produção' | 'Em entrega' | 'Entregue';
type CartaoEntrega = {
  id: number;
  cooperado: string;
  tipoCartao: string; // ex: Visa Infinite
  status: StatusEntrega;
  dataCriacao: string;
  previsaoEntrega?: string; // Apenas se estiver em entrega
  rastreio?: string;
};

// --- Dados Mockados para Acompanhamento de Entrega ---
const mockEntregaCartoes: CartaoEntrega[] = [
  { id: 1, cooperado: 'Ana Beatriz Silva', tipoCartao: 'Visa Infinite', status: 'Em entrega', dataCriacao: '10/11/2025', previsaoEntrega: '20/11/2025', rastreio: 'BR123456789' },
  { id: 2, cooperado: 'Roberto L. Souza', tipoCartao: 'Visa Gold', status: 'Em produção', dataCriacao: '14/11/2025' },
  { id: 3, cooperado: 'Daniel C. Oliveira', tipoCartao: 'Visa Classic', status: 'Criado', dataCriacao: '16/11/2025' },
  { id: 4, cooperado: 'Maria Santos Oliveira', tipoCartao: 'Visa Platinum', status: 'Em entrega', dataCriacao: '08/11/2025', previsaoEntrega: '18/11/2025', rastreio: 'BR987654321' },
  { id: 5, cooperado: 'Carlos Eduardo Souza', tipoCartao: 'Visa Gold', status: 'Criado', dataCriacao: '17/11/2025' },
];

const mockAnuidadeProdutos: ProdutoAnuidade[] = [
  { id: 'infinite', nome: 'Infinite', valor: 480.00 },
  { id: 'classic', nome: 'Classic', valor: 0.00 },
  { id: 'gold', nome: 'Gold', valor: 120.00 },
  { id: 'platinum', nome: 'Platinum', valor: 80.00 },
  { id: 'empresarial', nome: 'Empresarial', valor: 600.00 },
];

const mockRegrasDesconto: RegraDesconto[] = [
  { id: 1, gasto: 4000, desconto: 20, produto: 'Infinite' },
  { id: 2, gasto: 50000, desconto: 70, produto: 'Infinite' },
];

const mockConfiguracoesProduto: ProdutoConfig[] = [
  { id: 'infinite', nome: 'Infinite', multa: 2.0, mora: 10.00, juros: 1.5 },
  { id: 'classic', nome: 'Classic', multa: 2.0, mora: 5.00, juros: 1.0 },
  { id: 'gold', nome: 'Gold', multa: 2.0, mora: 8.00, juros: 1.2 },
  { id: 'platinum', nome: 'Platinum', multa: 2.0, mora: 8.00, juros: 1.2 },
  { id: 'empresarial', nome: 'Empresarial', multa: 3.0, mora: 15.00, juros: 2.0 },
];

// --- Componente PAI da Página Cartões (ATUALIZADO) ---
type CartoesViewMode = 'lista' | 'upgrade' | 'anuidade_cooperado' | 'anuidade_produto' | 'configuracoes_produto' | 'acompanhar_entrega';

function PaginaCartoes({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] = useState<CartoesViewMode>('lista');

  const renderView = () => {
    switch (viewMode) {
      case 'lista':
        return <ViewListaPrincipalCartoes kpis={mockKpiCartoes} cartoes={mockListaDeCartoes} />;
      case 'acompanhar_entrega': // NOVO CASE
        return <ViewAcompanharEntrega entregas={mockEntregaCartoes} />;
      case 'upgrade':
        return <ViewUpgradeDowngrade />;
      case 'anuidade_cooperado':
        return <ViewAnuidadeCooperado />;
      case 'anuidade_produto':
        return <ViewAnuidadeProduto />;
      case 'configuracoes_produto':
        return <ViewConfiguracoesProduto />;
      default:
        return <ViewListaPrincipalCartoes kpis={mockKpiCartoes} cartoes={mockListaDeCartoes} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1">
        <SubMenuButton
          label="Gestão de Cartões"
          active={viewMode === 'lista'}
          onClick={() => setViewMode('lista')}
        />
        <SubMenuButton // NOVO BOTÃO
          label="Acompanhar Entrega"
          active={viewMode === 'acompanhar_entrega'}
          onClick={() => setViewMode('acompanhar_entrega')}
        />
        <SubMenuButton
          label="Upgrade/Downgrade"
          active={viewMode === 'upgrade'}
          onClick={() => setViewMode('upgrade')}
        />
        <SubMenuButton
          label="Anuidade (Cooperado)"
          active={viewMode === 'anuidade_cooperado'}
          onClick={() => setViewMode('anuidade_cooperado')}
        />
        <SubMenuButton
          label="Anuidade (Produto)"
          active={viewMode === 'anuidade_produto'}
          onClick={() => setViewMode('anuidade_produto')}
        />
        <SubMenuButton
          label="Configurações"
          active={viewMode === 'configuracoes_produto'}
          onClick={() => setViewMode('configuracoes_produto')}
        />
      </div>
      <div>
        {renderView()}
      </div>
    </div>
  );
}

// --- Componentes da Página Cartões ---

function SubMenuButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  // ... (código idêntico)
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium transition-colors
        ${active
          ? 'border-b-2 border-hub-teal text-hub-teal'
          : 'text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {label}
    </button>
  );
}

// --- View 1: Lista Principal ---
function ViewListaPrincipalCartoes({ kpis, cartoes }: { kpis: typeof mockKpiCartoes; cartoes: Cartao[] }) {
  const [filtroTabela, setFiltroTabela] = useState('todos');
  
  const cartoesFiltrados = cartoes.filter(c => {
    if (filtroTabela === 'todos') return true;
    return c.status === filtroTabela;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Cartões Ativos" value={kpis.ativos.toString()} change="" changeType="info" icon={CreditCard} />
        <KpiCard title="Cartões Bloqueados" value={kpis.bloqueados.toString()} change="" changeType="info" icon={ShieldAlert} />
        <KpiCard title="Cartões Vencidos" value={kpis.vencidos.toString()} change="" changeType="info" icon={AlertCircle} />
      </div>
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Gestão de Cartões</h3>
            <p className="text-sm text-gray-500">Consulta e gerenciamento de cartões</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Buscar por cooperado, número do cartão ou conta..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              className="flex-shrink-0 flex items-center px-4 py-2 text-white rounded-lg shadow-sm transition-colors"
              style={{ backgroundColor: HUB_BRAND_COLOR }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Solicitar Cartão
            </button>
          </div>
        </div>
        <div className="flex space-x-1 p-4">
          <FiltroTabelaButton label="Todos" active={filtroTabela === 'todos'} onClick={() => setFiltroTabela('todos')} />
          <FiltroTabelaButton label="Ativos" active={filtroTabela === 'ativo'} onClick={() => setFiltroTabela('ativo')} />
          <FiltroTabelaButton label="Bloqueados" active={filtroTabela === 'bloqueado_preventivo'} onClick={() => setFiltroTabela('bloqueado_preventivo')} />
          <FiltroTabelaButton label="Vencidos" active={filtroTabela === 'vencido'} onClick={() => setFiltroTabela('vencido')} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cooperado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conta Cartão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bandeira</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {/* CORREÇÃO: Apenas UMA coluna de ação */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visualizar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cartoesFiltrados.map((cartao) => (
                <tr key={cartao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cartao.cooperado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cartao.conta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{cartao.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cartao.bandeira}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-semibold text-gray-800">{cartao.disponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span className="text-xs text-gray-500"> / {cartao.limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cartao.validade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      cartao.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      cartao.status === 'vencido' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cartao.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// =======================================================
// View NOVO: Acompanhar Entrega de Cartão
// =======================================================
function ViewAcompanharEntrega({ entregas }: { entregas: CartaoEntrega[] }) {
  
  const getStatusStyle = (status: StatusEntrega) => {
    switch (status) {
      case 'Criado': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Em produção': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Em entrega': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Entregue': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Rastreamento de Cartões</h3>
        <p className="text-sm text-gray-500">Acompanhe o status de produção e entrega dos cartões solicitados.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cooperado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cartão Solicitado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Solicitação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Atual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previsão de Entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cód. Rastreio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entregas.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.cooperado}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.tipoCartao}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.dataCriacao}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                  {item.status === 'Em entrega' ? (
                    <span className="text-hub-teal">{item.previsaoEntrega}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {item.rastreio ? (
                     <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{item.rastreio}</span>
                   ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function FiltroTabelaButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  // ... (código idêntico)
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
        active ? 'bg-hub-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

// --- View 2: Upgrade/Downgrade ---
function ViewUpgradeDowngrade() {
  // ... (código idêntico)
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">Solicitar Upgrade ou Downgrade</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">Busque pelo cooperado para iniciar a solicitação.</p>
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou e-mail..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}

// --- View 3: Anuidade por Cooperado ---
function ViewAnuidadeCooperado() {
  // ... (código idêntico)
  const [searchTerm, setSearchTerm] = useState('');
  const [cooperadoEncontrado, setCooperadoEncontrado] = useState<Cooperado | null>(null);
  const [anuidade, setAnuidade] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const handleSearch = () => {
    const cooperado = mockCooperados.find(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf.includes(searchTerm));
    if (cooperado) {
      setCooperadoEncontrado(cooperado);
      setAnuidade(480.00); 
    } else {
      setCooperadoEncontrado(null);
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">Gestão de Anuidade por Cooperado</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">Busque pelo cooperado para gerenciar a anuidade.</p>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
        />
        <button onClick={handleSearch} className="px-4 py-2 text-white bg-hub-teal rounded-lg shadow-sm">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {cooperadoEncontrado && (
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold">{cooperadoEncontrado.nome}</h4>
          <p className="text-sm text-gray-500">CPF: {cooperadoEncontrado.cpf}</p>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Produto Atual</p>
              <p className="text-lg font-semibold">Visa Infinite</p>
            </div>
            <div className="w-px bg-gray-300 h-10 mx-4"></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Anuidade Atual (Anual)</p>
              {editMode ? (
                <div className="flex items-center">
                  <span className="text-lg font-semibold mr-1">R$</span>
                  <input 
                    type="number"
                    value={anuidade}
                    onChange={(e) => setAnuidade(parseFloat(e.target.value))}
                    className="w-32 px-2 py-1 border border-hub-teal rounded-md"
                  />
                </div>
              ) : (
                <p className="text-lg font-semibold">{anuidade.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              )}
            </div>
            {editMode ? (
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-sm"
              >
                <Save className="w-5 h-5 mr-2" /> Salvar
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center px-4 py-2 text-white bg-hub-teal rounded-lg shadow-sm"
              >
                <Edit2 className="w-5 h-5 mr-2" /> Editar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- View 4: Anuidade por Produto ---
function ViewAnuidadeProduto() {
  const [anuidades, setAnuidades] = useState(mockAnuidadeProdutos);
  const [regras, setRegras] = useState(mockRegrasDesconto);

  const handleAnuidadeChange = (id: string, valor: number) => {
    setAnuidades(anuidades.map(a => a.id === id ? { ...a, valor } : a));
  };
  
  const handleRegraChange = (id: number, campo: 'gasto' | 'desconto', valor: number) => {
    setRegras(regras.map(r => r.id === id ? { ...r, [campo]: valor } : r));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Gestão de Anuidade por Produto</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">Defina o valor base da anuidade para cada produto.</p>
        <div className="space-y-4">
          {anuidades.map(prod => (
            <div key={prod.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-lg font-medium text-gray-800">{prod.nome}</span>
              <div className="flex items-center">
                <span className="text-lg font-semibold mr-1">R$</span>
                <input 
                  type="number"
                  value={prod.valor}
                  onChange={(e) => handleAnuidadeChange(prod.id, parseFloat(e.target.value))}
                  className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hub-teal"
                />
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-sm">
            <Save className="w-5 h-5 mr-2" /> Salvar Anuidades
          </button>
        </div>
      </div>

      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Regras de Desconto por Gasto</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">Configure descontos automáticos baseados no gasto mensal.</p>
        <div className="space-y-4">
          {regras.map(regra => (
            <div key={regra.id} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-800 text-sm">Gasto de</span>
                <input 
                  type="number"
                  value={regra.gasto}
                  onChange={(e) => handleRegraChange(regra.id, 'gasto', parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <span className="text-gray-800 text-sm">gera</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={regra.desconto}
                  onChange={(e) => handleRegraChange(regra.id, 'desconto', parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                {/* AQUI ESTÁ O TEXTO QUE VOCÊ PEDIU */}
                <span className="text-gray-800 text-xs leading-tight max-w-[120px]">
                  % de desconto na anuidade (mensal)
                </span>
                <span className="text-sm font-bold text-hub-teal">{regra.produto}</span>
              </div>
            </div>
          ))}
           <button className="w-full flex items-center justify-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-sm">
            <Save className="w-5 h-5 mr-2" /> Salvar Regras
          </button>
        </div>
      </div>
    </div>
  );
}
      
// --- View 5: Configurações do Produto ---
function ViewConfiguracoesProduto() {
  // ... (código idêntico)
  const [configs, setConfigs] = useState(mockConfiguracoesProduto);

  const handleConfigChange = (
    id: string,
    campo: 'multa' | 'mora' | 'juros',
    valor: string
  ) => {
    const novoValor = parseFloat(valor) || 0;
    setConfigs(configs.map(c =>
      c.id === id ? { ...c, [campo]: novoValor } : c
    ));
  };

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Configurações de Encargos do Produto</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Defina os valores de multa, mora e juros para cada produto de cartão.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configs.map((produto) => (
          <div key={produto.id} className="p-6 bg-white rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold text-hub-teal">{produto.nome}</h4>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor={`multa-${produto.id}`} className="block text-sm font-medium text-gray-700">
                  Multa (%)
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    id={`multa-${produto.id}`}
                    value={produto.multa}
                    onChange={(e) => handleConfigChange(produto.id, 'multa', e.target.value)}
                    className="w-full pl-4 pr-7 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">%</span>
                </div>
              </div>
              <div>
                <label htmlFor={`mora-${produto.id}`} className="block text-sm font-medium text-gray-700">
                  Mora (R$)
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">R$</span>
                  <input
                    type="number"
                    id={`mora-${produto.id}`}
                    value={produto.mora}
                    onChange={(e) => handleConfigChange(produto.id, 'mora', e.target.value)}
                    className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`juros-${produto.id}`} className="block text-sm font-medium text-gray-700">
                  Juros (a.m. %)
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    id={`juros-${produto.id}`}
                    value={produto.juros}
                    onChange={(e) => handleConfigChange(produto.id, 'juros', e.target.value)}
                    className="w-full pl-4 pr-7 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
         <button className="w-full md:w-auto flex items-center justify-center px-6 py-3 text-white bg-green-600 rounded-lg shadow-sm">
          <Save className="w-5 h-5 mr-2" /> Salvar Todas as Configurações
        </button>
      </div>
    </div>
  );
}


// =======================================================================
// 11. A PÁGINA DE TRANSAÇÕES (COM PROP DE USUÁRIO)
// =======================================================================
/* ... (Todo o código da PaginaTransacoes e seus sub-componentes continua o mesmo) ... */
// --- Definição de Tipos para Transações ---
type KpiTransacoes = {
  total: number;
  aprovadas: number;
  negadas: number;
  volume: number;
};
type TransacaoStatus = 'aprovada' | 'negada' | 'pendente';
type TransacaoDetalhe = {
  id: number;
  data: string;
  cooperado: string;
  tipo: string;
  estabelecimento: string;
  forma: string;
  valor: number;
  status: TransacaoStatus;
  nsu: string;
};

// --- Dados Mockados da Página Transações ---
const mockKpiTransacoes: KpiTransacoes = {
  total: 30,
  aprovadas: 24,
  negadas: 6,
  volume: 7000,
};

const mockListaDeTransacoes: TransacaoDetalhe[] = [
  { id: 1, data: '13/11/2025 00:00', cooperado: 'Daniel Oliveira Silva', tipo: 'Compra', estabelecimento: 'Supermercado Extra', forma: 'chip', valor: 57.85, status: 'aprovada', nsu: '000123456789' },
  { id: 2, data: '13/11/2025 00:00', cooperado: 'Fernanda Lima Santos', tipo: 'Compra', estabelecimento: 'Supermercado Extra', forma: 'chip', valor: 208.31, status: 'aprovada', nsu: '000123456789' },
  { id: 3, data: '13/11/2025 00:00', cooperado: 'Maria Santos Oliveira', tipo: 'Compra', estabelecimento: 'Supermercado Extra', forma: 'chip', valor: 89.95, status: 'aprovada', nsu: '000123456789' },
  { id: 4, data: '13/11/2025 00:00', cooperado: 'Carlos Eduardo Souza', tipo: 'Compra', estabelecimento: 'Supermercado Extra', forma: 'chip', valor: 200.29, status: 'aprovada', nsu: '000123456789' },
  { id: 5, data: '13/11/2025 00:00', cooperado: 'João Pedro Costa', tipo: 'Compra', estabelecimento: 'Supermercado Extra', forma: 'chip', valor: 205.35, status: 'aprovada', nsu: '000123456789' },
  { id: 6, data: '11/11/2025 00:00', cooperado: 'Daniel Oliveira Silva', tipo: 'Saque', estabelecimento: 'Padaria Pão Quente', forma: 'aproximacao', valor: 212.30, status: 'negada', nsu: '000123456790' },
  { id: 7, data: '11/11/2025 00:00', cooperado: 'Fernanda Lima Santos', tipo: 'Saque', estabelecimento: 'Padaria Pão Quente', forma: 'aproximacao', valor: 170.80, status: 'aprovada', nsu: '000123456790' },
];

const categoriasContestacao = [
  "Desacordo comercial - Cartão presente (chip / senha)",
  "Desacordo comercial - Cartão não-presente (compra e-commerce / APP / CVV2)",
  "Erro de Processamento",
  "Não reconhecida - Cartão Não-Presente (Compra e-commerce / APP / CVV2)",
  "Saque - Cédulas não liberadas",
  "Não reconhecido",
];

// --- Componente PAI da Página Transações ---
type TransacoesViewMode = 'lista' | 'contestar';

function PaginaTransacoes({ usuario }: { usuario: User }) {
  // ... (código idêntico)
  const [viewMode, setViewMode] = useState<TransacoesViewMode>('lista');

  const renderView = () => {
    switch (viewMode) {
      case 'lista':
        return <ViewListaTransacoes kpis={mockKpiTransacoes} transacoes={mockListaDeTransacoes} />;
      case 'contestar':
        return <ViewFormContestacao />;
      default:
        return <ViewListaTransacoes kpis={mockKpiTransacoes} transacoes={mockListaDeTransacoes} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        <SubMenuButton
          label="Histórico de Transações"
          active={viewMode === 'lista'}
          onClick={() => setViewMode('lista')}
        />
        <SubMenuButton
          label="Contestar uma compra"
          active={viewMode === 'contestar'}
          onClick={() => setViewMode('contestar')}
        />
      </div>
      <div>
        {renderView()}
      </div>
    </div>
  );
}

// --- View 1: Lista Principal de Transações ---
function ViewListaTransacoes({ kpis, transacoes }: { kpis: KpiTransacoes; transacoes: TransacaoDetalhe[] }) {
  // ... (código idêntico)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Transações" value={kpis.total.toString()} change="" changeType="info" icon={List} />
        <KpiCard title="Aprovadas" value={kpis.aprovadas.toString()} change="" changeType="info" icon={CheckCircle2} />
        <KpiCard title="Negadas" value={kpis.negadas.toString()} change="" changeType="info" icon={XCircle} />
        <KpiCard title="Volume Total" value={kpis.volume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} change="" changeType="info" icon={BarChart2} />
      </div>
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Transações</h3>
            <p className="text-sm text-gray-500">Histórico completo de transações</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Buscar por cooperado, estabelecimento..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <ExportarDropdown />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cooperado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estabelecimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NSU</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacoes.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.data}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.cooperado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.estabelecimento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.forma}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      tx.status === 'aprovada' ? 'bg-green-100 text-green-800' :
                      tx.status === 'negada' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.nsu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- View 2: Formulário de Contestação ---
function ViewFormContestacao() {
  // ... (código idêntico)
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800">Contestar uma Compra</h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Preencha os dados da transação para abrir uma contestação (chargeback).
      </p>

      <form className="space-y-4">
        <div>
          <label htmlFor="numeroCartao" className="block text-sm font-medium text-gray-700">
            Número do Cartão
          </label>
          <input
            type="text"
            id="numeroCartao"
            placeholder="0000 0000 0000 0000"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nsu" className="block text-sm font-medium text-gray-700">
              NSU (Autorização)
            </label>
            <input
              type="text"
              id="nsu"
              placeholder="000123456789"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
            />
          </div>
          <div>
            <label htmlFor="dataCompra" className="block text-sm font-medium text-gray-700">
              Data da Compra
            </label>
            <input
              type="date"
              id="dataCompra"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="valorCompra" className="block text-sm font-medium text-gray-700">
            Valor da Compra (R$)
          </label>
          <input
            type="number"
            id="valorCompra"
            placeholder="0,00"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
            Categoria da Contestação
          </label>
          <select
            id="categoria"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
          >
            <option value="">Selecione um motivo...</option>
            {categoriasContestacao.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center px-6 py-2 text-white rounded-lg shadow-sm"
            style={{ backgroundColor: HUB_BRAND_COLOR }}
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Abrir Contestação
          </button>
        </div>
      </form>
    </div>
  );
}

// =======================================================================
// DADOS MOCKADOS DE FATURAS (RESTAURADOS)
// =======================================================================

type Fatura = {
  id: number;
  cooperado: string;
  referencia: string;
  vencimento: string;
  valorTotal: number;
  valorPago: number;
  diasAtraso?: number;
  status: 'aberta' | 'paga' | 'vencida';
};

const mockKpiFaturas = {
  total: 6,
  abertas: 6,
  vencidas: 0,
  aReceber: 7000.00,
};

const mockListaDeFaturas: Fatura[] = [
  { id: 1, cooperado: 'Fernanda Lima Santos', referencia: '11/2025', vencimento: '24/11/2025', valorTotal: 1150.00, valorPago: 0.00, status: 'aberta' },
  { id: 2, cooperado: 'Carlos Eduardo Souza', referencia: '11/2025', vencimento: '24/11/2025', valorTotal: 1150.00, valorPago: 0.00, status: 'aberta' },
  { id: 3, cooperado: 'Ana Paula Ferreira', referencia: '11/2025', vencimento: '24/11/2025', valorTotal: 1150.00, valorPago: 0.00, status: 'aberta' },
  { id: 4, cooperado: 'João Pedro Costa', referencia: '11/2025', vencimento: '24/11/2025', valorTotal: 1150.00, valorPago: 0.00, status: 'aberta' },
  { id: 5, cooperado: 'Maria Santos Oliveira', referencia: '11/2025', vencimento: '24/11/2025', valorTotal: 1150.00, valorPago: 0.00, status: 'aberta' },
  { id: 6, cooperado: 'Daniel Oliveira Silva', referencia: '11/2025', vencimento: '24/11/2025', valorTotal: 1250.00, valorPago: 0.00, status: 'aberta' },
];


// =======================================================================
// 12. A PÁGINA DE FATURAS
// =======================================================================

function PaginaFaturas({ usuario }: { usuario: User }) {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Faturas" value={mockKpiFaturas.total.toString()} change="" changeType="info" icon={File} />
        <KpiCard title="Faturas Abertas" value={mockKpiFaturas.abertas.toString()} change="" changeType="info" icon={Clock} />
        <KpiCard title="Faturas Vencidas" value={mockKpiFaturas.vencidas.toString()} change="" changeType="info" icon={AlertOctagon} />
        <KpiCard title="Total a Receber" value={mockKpiFaturas.aReceber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} change="" changeType="info" icon={Receipt} />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Cabeçalho da Tabela */}
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Gestão de Faturas</h3>
            <p className="text-sm text-gray-500">Acompanhamento e gerenciamento de faturas</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Buscar por cooperado ou conta cartão..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            <ExportarDropdown />

          </div>
        </div>

        {/* Tabela de Faturas */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cooperado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Atraso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {/* REMOVIDO: Coluna Ações */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockListaDeFaturas.map((fatura) => (
                <tr key={fatura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fatura.cooperado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fatura.referencia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fatura.vencimento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    {fatura.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {fatura.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fatura.diasAtraso || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      fatura.status === 'aberta' ? 'bg-blue-100 text-blue-800' :
                      fatura.status === 'vencida' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {fatura.status}
                    </span>
                  </td>
                  {/* REMOVIDO: Célula de Ações */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =======================================================================
// 13. A PÁGINA DE RELATÓRIOS (COM PROP DE USUÁRIO)
// =======================================================================
/* ... (Todo o código da PaginaRelatorios e seus sub-componentes continua o mesmo) ... */
// --- Dados Mockados da Página Relatórios ---
type RelatorioTipo = {
  id: number;
  titulo: string;
  desc?: string;
  gerados: number;
  icon: React.ElementType;
};
type HistoricoRelatorio = {
  id: number;
  tipo: string;
  periodo: string;
  cooperativa: string;
  formato: 'XLS' | 'CSV' | 'PDF';
  dataGeracao: string;
  registros: number;
  status: 'concluido' | 'processando' | 'erro';
};

const mockKpiRelatorios = {
  total: 5,
  processando: 1,
  concluidos: 3,
  comErro: 1,
};

const mockHistoricoRelatorios: HistoricoRelatorio[] = [
  { id: 1, tipo: 'Limites Gerencial', periodo: '30/09/2025 - 31/10/2025', cooperativa: 'Central Hubcoop', formato: 'XLS', dataGeracao: '13/11/2025 13:00', registros: 300, status: 'erro' },
  { id: 2, tipo: 'Faturas Pagas', periodo: '30/09/2025 - 31/10/2025', cooperativa: 'Cooperativa Nordeste', formato: 'CSV', dataGeracao: '13/11/2025 13:00', registros: 250, status: 'concluido' },
  { id: 3, tipo: 'Transações (Débito e Crédito)', periodo: '30/09/2025 - 31/10/2025', cooperativa: 'Cooperativa Vale do Aço', formato: 'PDF', dataGeracao: '13/11/2025 13:00', registros: 200, status: 'processando' },
  { id: 4, tipo: 'Cadastral de Cartões', periodo: '30/09/2025 - 31/10/2025', cooperativa: 'Cooperativa Crédito Sul', formato: 'XLS', dataGeracao: '13/11/2025 13:00', registros: 150, status: 'concluido' },
  { id: 5, tipo: 'Cartões em Atraso', periodo: '30/09/2025 - 31/10/2025', cooperativa: 'Central Hubcoop', formato: 'CSV', dataGeracao: '13/11/2025 13:00', registros: 100, status: 'concluido' },
];

// A lista mesclada e sem duplicados
const mockTiposDeRelatorios: RelatorioTipo[] = [
  { id: 1, titulo: 'Cartões em Atraso', desc: 'Cooperados com faturas vencidas', gerados: 1, icon: CalendarX },
  { id: 2, titulo: 'Pagamentos', desc: 'Todos os pagamentos realizados', gerados: 0, icon: Banknote },
  { id: 3, titulo: 'Transações (Débito e Crédito)', desc: 'Todas as transações do período', gerados: 1, icon: List },
  { id: 4, titulo: 'Parcelamentos', desc: 'Parcelamentos de faturas', gerados: 0, icon: PieChart },
  // { id: 5, titulo: 'Receitas e Despesas', desc: 'Movimentações financeiras', gerados: 0, icon: AreaChart },
  { id: 6, titulo: 'Cadastro de Cartões', desc: 'Base completa de cartões', gerados: 1, icon: Contact },
  { id: 7, titulo: 'Parcelamentos Rotativos', desc: 'Parcelamentos de juros rotativos', gerados: 0, icon: PieChart },
  { id: 8, titulo: 'Anuidades', desc: 'Cobranças de anuidade', gerados: 0, icon: Percent },
  { id: 9, titulo: 'Resgates do Programa de Pontos', desc: 'Todos os resgates de pontos', gerados: 0, icon: Users },
  { id: 10, titulo: 'Ajustes da Central', desc: 'Lançamentos manuais e estornos', gerados: 0, icon: Edit2 },
  { id: 11, titulo: 'Cartões Bloqueados por Emissão', desc: 'Cartões que nunca foram ativados', gerados: 0, icon: ShieldAlert },
  { id: 12, titulo: 'CADOC 3040 - Coobrigações', desc: 'Relatório para Banco Central', gerados: 0, icon: Building },
  { id: 17, titulo: 'Conciliação - Cartão de Crédito', desc: 'Conciliação de transações liquidadas', gerados: 0, icon: CheckSquare },
  { id: 18, titulo: 'Relatório de Bins', desc: 'Cartões emitidos vs disponibilizados por BIN', gerados: 0, icon: CreditCardIcon },
  { id: 15, titulo: 'Cessão de Crédito (Honra de Aval)', desc: 'Cooperados em cessão de crédito', gerados: 0, icon: AlertOctagon },
  { id: 16, titulo: 'Faturas Pagas', desc: 'Relação de faturas liquidadas', gerados: 1, icon: FileCheck },
];


// --- Componente PAI da Página Relatórios ---
function PaginaRelatorios({ usuario }: { usuario: User }) {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Relatórios" value={mockKpiRelatorios.total.toString()} change="" changeType="info" icon={File} />
        <KpiCard title="Processando" value={mockKpiRelatorios.processando.toString()} change="" changeType="info" icon={PackageSearch} />
        <KpiCard title="Concluídos" value={mockKpiRelatorios.concluidos.toString()} change="" changeType="info" icon={PackageCheck} />
        <KpiCard title="Com Erro" value={mockKpiRelatorios.comErro.toString()} change="" changeType="info" icon={PackageX} />
      </div>

      {/* Tabela de Histórico (AGORA PASSANDO O USUÁRIO) */}
      <ViewHistoricoRelatorios historico={mockHistoricoRelatorios} usuario={usuario} />

      {/* Grelha de Geração */}
      <ViewGerarRelatorios tipos={mockTiposDeRelatorios} />
    </div>
  );
}

// --- Componentes da Página Relatórios ---
function ViewHistoricoRelatorios({ historico, usuario }: { historico: HistoricoRelatorio[]; usuario: User }) {
  const getStatusClass = (status: HistoricoRelatorio['status']) => {
    switch (status) {
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'processando': return 'bg-yellow-100 text-yellow-800';
      case 'erro': return 'bg-red-100 text-red-800';
    }
  };

  const getFormatoClass = (formato: HistoricoRelatorio['formato']) => {
    switch (formato) {
      case 'XLS': return 'bg-green-700 text-white';
      case 'PDF': return 'bg-red-700 text-white';
      case 'CSV': return 'bg-blue-700 text-white';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="flex flex-col p-5 border-b border-gray-200 space-y-4">
        {/* Cabeçalho e Botão */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Relatórios Disponíveis</h3>
            <p className="text-sm text-gray-500">Geração e download de relatórios</p>
          </div>
          <button
            className="flex-shrink-0 flex items-center px-4 py-2 text-white rounded-lg shadow-sm transition-colors"
            style={{ backgroundColor: HUB_BRAND_COLOR }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Relatório
          </button>
        </div>

        {/* --- FILTROS --- */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro de Produto (Novo) */}
<div>
  <label className="block text-sm font-medium text-gray-700">Produto</label>
  <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
    <option value="">Todos</option>
    <option value="infinite">Infinite</option>
    <option value="black">Black</option>
    <option value="gold">Gold</option>
  </select>
</div>

{/* Filtro de BIN (Novo) */}
<div>
  <label className="block text-sm font-medium text-gray-700">BIN</label>
  <input type="text" placeholder="Ex: 454545" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
</div>
          {/* Filtro de Data (Para Todos) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Período</label>
            <div className="flex items-center space-x-2">
              <input type="date" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
              <span className="text-gray-500">até</span>
              <input type="date" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
            </div>
          </div>

          {/* Filtro de CPF (Para Todos) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input type="text" placeholder="000.000.000-00" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>

          {/* Filtro de Cooperativa (SÓ CENTRAL VÊ) */}
{usuario.perfil === 'Central' && (
  <div>
    <label className="block text-sm font-medium text-gray-700">Cooperativa</label>
    <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
                <option value="">Todas</option>
                {mockCooperativas.filter(c => c.centralId === usuario.centralId).map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filtro de PA (CENTRAL E COOPERATIVA VÊEM) */}
{(usuario.perfil === 'Central' || usuario.perfil === 'Cooperativa') && (
  <div>
    <label className="block text-sm font-medium text-gray-700">Ponto de Atendimento</label>
    <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
                <option value="">Todos</option>
                {mockPontosAtendimento.filter(pa => {
                  if (usuario.perfil === 'Cooperativa') return pa.cooperativaId === usuario.cooperativaId;
                  // Se for central, precisa de uma lógica mais complexa (não implementada no mock)
                  return true;
                }).map(pa => (
                   <option key={pa.id} value={pa.id}>{pa.nome}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        {/* --- FIM DOS NOVOS FILTROS --- */}
      </div>

      {/* Tabela de Histórico */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Relatório</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cooperativa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Geração</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registros</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historico.map((rel) => (
              <tr key={rel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rel.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.periodo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.cooperativa}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold">
                  <span className={`px-2 py-0.5 rounded-md ${getFormatoClass(rel.formato)}`}>{rel.formato}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.dataGeracao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.registros}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${getStatusClass(rel.status)}`}>
                    {rel.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button title="Re-gerar" className="text-gray-400 hover:text-hub-teal p-1">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  {/* Só mostra Download se estiver concluído */}
                  {rel.status === 'concluido' && (
                    <button title="Exportar" className="text-hub-teal hover:text-hub-teal-dark p-1">
                      <FileDown className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ViewGerarRelatorios({ tipos }: { tipos: RelatorioTipo[] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
       <h3 className="text-lg font-semibold text-gray-800">Gerar Novo Relatório</h3>
       <p className="text-sm text-gray-500 mb-4">Selecione um relatório para gerar sob demanda.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tipos.map(rel => (
          <div key={rel.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-start">
            <div className="flex">
              <div className="p-3 bg-gray-200 rounded-lg mr-4">
                <rel.icon className="w-6 h-6 text-hub-teal" />
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-800">{rel.titulo}</h4>
                <p className="text-sm text-gray-500 mt-1">{rel.desc}</p>
                <p className="text-xs text-gray-400 mt-2">Gerados: {rel.gerados}</p>
              </div>
            </div>
            <button className="text-sm font-medium text-hub-teal hover:text-hub-teal-dark">Gerar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// =======================================================================
// 14. A PÁGINA DE COOPERATIVAS (COM LÓGICA DE SEGREGAÇÃO CORRIGIDA)
// =======================================================================
type CooperativasViewMode = 'lista' | 'detalhe';
type ViewListaCooperativasProps = {
  kpis: {
    total: number;
    limiteOutorgado: number;
    limiteUtilizado: number;
    percUtilizacao: number;
  };
  cooperativas: Cooperativa[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelect: (cooperativa: Cooperativa) => void;
  onNovaCooperativa: () => void;
};


function PaginaCooperativas({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] = useState<CooperativasViewMode>('lista');
  const [selectedCooperativa, setSelectedCooperativa] = useState<Cooperativa | null>(null);
  const [showModalNovaCoop, setShowModalNovaCoop] = useState(false);
  // O modal de Nova Central foi movido para Configurações
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false); // <-- Estado para o popup

  // --- LÓGICA DE SEGREGAÇÃO (CORRIGIDA) ---
  const cooperativasVisiveis = mockCooperativas.filter(coop => {
    // Se for Master (c1), vê APENAS as Centrais (tipo: Central)
    if (usuario.perfil === 'Master') {
      return coop.tipo === 'Central';
    }
    // Se for de uma Central (ex: c2), vê APENAS as Singulares (tipo: Singular) da sua central
    if (usuario.perfil === 'Central') {
      return coop.centralId === usuario.centralId && coop.tipo === 'Singular';
    }
    // Se for de uma Cooperativa, vê apenas a si mesma
    if (usuario.perfil === 'Cooperativa') {
      return coop.id === usuario.cooperativaId;
    }
    return false; // PA não vê esta página
  });
  
  const cooperativasFiltradas = cooperativasVisiveis.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.codigo.includes(searchTerm) ||
    c.cnpj.includes(searchTerm)
  );

  const kpis = {
    total: cooperativasFiltradas.length,
    limiteOutorgado: cooperativasFiltradas.reduce((acc, c) => acc + c.limiteOutorgado, 0),
    limiteUtilizado: cooperativasFiltradas.reduce((acc, c) => acc + c.limiteUtilizado, 0),
  };
  const percUtilizacao = (kpis.limiteOutorgado > 0) ? (kpis.limiteUtilizado / kpis.limiteOutorgado) * 100 : 0;

  // --- Funções de Navegação (COM A LÓGICA DO POPUP) ---
  const handleSelectCooperativa = (cooperativa: Cooperativa) => {
    // REGRA: Se o user é Admin (c1)...
    if (usuario?.centralId === 'c1') {
      // E a central clicada NÃO É a Credisis (c2_coop)...
      if (cooperativa.id !== 'c2_coop') { 
        setShowAlert(true); // <-- ABRE O POPUP
        return; // Para a execução
      }
    }
    // Se for permitido (user c1 clicando na c2, ou user c2 clicando nas suas singulares)
    setSelectedCooperativa(cooperativa);
    setViewMode('detalhe');
  };

  const handleBackToList = () => {
    setViewMode('lista');
    setSelectedCooperativa(null);
  };
  
  return (
    <div className="space-y-6">
      {/* O Botão "Cadastrar Nova Central" foi REMOVIDO daqui */}
      
      {/* --- MODAL DE ALERTA (O SEU POPUP) --- */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="flex justify-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mt-4">Acesso Não Permitido</h3>
            <p className="text-gray-600 mt-2">
              Central permitida: {mockCentrais.find(c => c.id === 'c2')?.nome}.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="mt-6 px-6 py-2 text-white rounded-lg shadow-sm"
              style={{ backgroundColor: HUB_BRAND_COLOR }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Renderização da View */}
      {viewMode === 'lista' && (
        <ViewListaCooperativas
          kpis={{...kpis, percUtilizacao}}
          cooperativas={cooperativasFiltradas}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelect={handleSelectCooperativa}
          onNovaCooperativa={() => setShowModalNovaCoop(true)}
          usuario={usuario}
        />
      )}
      
      {viewMode === 'detalhe' && selectedCooperativa && (
        <ViewDetalheCooperativa
          cooperativa={selectedCooperativa}
          onBack={handleBackToList}
        />
      )}

      {/* Modais */}
      {showModalNovaCoop && (
        <ModalNovaCooperativa onClose={() => setShowModalNovaCoop(false)} />
      )}
    </div>
  );
}
// --- Componentes da Página Cooperativas ---
function ViewListaCooperativas({ kpis, cooperativas, searchTerm, setSearchTerm, onSelect, onNovaCooperativa, usuario }: ViewListaCooperativasProps & { usuario: User }) {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Cooperativas" value={kpis.total.toString()} change="" changeType="info" icon={Briefcase} />
        <KpiCard title="Limite Outorgado" value={kpis.limiteOutorgado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })} change="" changeType="info" icon={DollarSign} />
        <KpiCard title="Limite Utilizado" value={kpis.limiteUtilizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })} change="" changeType="info" icon={TrendingUp} />
        <KpiCard title="% Utilização" value={`${kpis.percUtilizacao.toFixed(1)}%`} change="" changeType="info" icon={Percent} />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Cooperativas</h3>
            <p className="text-sm text-gray-500">Gestão de cooperativas e limites</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, código ou CNPJ..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {/* BOTÃO "NOVA COOPERATIVA" REMOVIDO DAQUI CONFORME SOLICITADO */}
          </div>
        </div>

        {/* Tabela de Cooperativas */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lim. Outorgado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lim. Utilizado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Uso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visualizar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cooperativas.map((coop) => {
                const percUso = (coop.limiteOutorgado > 0) ? (coop.limiteUtilizado / coop.limiteOutorgado) * 100 : 0;
                const usoCor = percUso > 75 ? 'bg-orange-400' : percUso > 50 ? 'bg-yellow-400' : 'bg-green-500';
                return (
                  <tr key={coop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coop.codigo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coop.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coop.cnpj}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coop.tipo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coop.limiteOutorgado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{coop.limiteUtilizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className={`h-2 rounded-full ${usoCor}`} style={{ width: `${Math.min(percUso, 100)}%`}}></div>
                        </div>
                        {percUso.toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${coop.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {coop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => onSelect(coop)} 
                        className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                        title="Visualizar Detalhes"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function ViewDetalheCooperativa({ cooperativa, onBack }: { cooperativa: Cooperativa, onBack: () => void }) {
  // Filtra os PAs que pertencem a esta cooperativa
  const pas = mockPontosAtendimento.filter(pa => pa.cooperativaId === cooperativa.id);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
           <h3 className="text-xl font-semibold text-gray-800">Dados da Cooperativa</h3>
           <button
             onClick={onBack}
             className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 border"
           >
             <ChevronLeft className="w-4 h-4 mr-1" />
             Voltar
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div><label className="text-xs font-medium text-gray-500">Nome</label><p className="text-sm text-gray-900">{cooperativa.nome}</p></div>
          <div><label className="text-xs font-medium text-gray-500">CNPJ</label><p className="text-sm text-gray-900">{cooperativa.cnpj}</p></div>
          <div><label className="text-xs font-medium text-gray-500">Código</label><p className="text-sm text-gray-900">{cooperativa.codigo}</p></div>
          <div><label className="text-xs font-medium text-gray-500">Limite Outorgado</label><p className="text-sm text-gray-900">{cooperativa.limiteOutorgado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
          <div><label className="text-xs font-medium text-gray-500">Limite Utilizado</label><p className="text-sm text-gray-900">{cooperativa.limiteUtilizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
          <div><label className="text-xs font-medium text-gray-500">Status</label><p className="text-sm text-gray-900">{cooperativa.status}</p></div>
        </div>
      </div>
      
      {/* Tabela de Pontos de Atendimento (PAs) */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Pontos de Atendimento (PAs)</h3>
        {pas.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pas.map((pa) => (
                  <tr key={pa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pa.codigo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pa.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${pa.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {pa.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-hub-teal hover:text-hub-teal-dark p-1"><Eye className="w-5 h-5" /></button>
                      <button className="text-gray-400 hover:text-gray-600 p-1"><Edit2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4">Nenhum Ponto de Atendimento encontrado para esta cooperativa.</p>
        )}
      </div>
    </div>
  );
}
function ModalNovaCooperativa({ onClose }: { onClose: () => void }) {
  // ... (código idêntico)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold">Nova Cooperativa</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full"><X className="w-6 h-6" /></button>
        </div>
        <div className="mt-4">
          <p>O formulário para cadastrar uma **nova cooperativa** (singular) apareceria aqui.</p>
        </div>
      </div>
    </div>
  );
}
// Este modal não é mais usado aqui, mas o deixamos definido caso outra página precise
function ModalNovaCentral({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold">Nova Central de Cooperativas</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full"><X className="w-6 h-6" /></button>
        </div>
        <div className="mt-4 space-y-4">
           <div>
              <label htmlFor="nomeCentral" className="block text-sm font-medium text-gray-700">
                Nome da Nova Central
              </label>
              <input
                type="text"
                id="nomeCentral"
                placeholder="Ex: SICOOB CENTRAL"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
              />
            </div>
             <p className="text-sm text-gray-600">
               Ao cadastrar uma nova central, ela operará de forma 100% segregada.
               Os seus dados não serão visíveis pela Credisis ou ,
               e ela não terá visibilidade dos dados das outras centrais.
             </p>
             <button
               onClick={onClose} // Apenas fecha o modal por agora
               className="w-full flex items-center justify-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-sm"
             >
               <Save className="w-5 h-5 mr-2" /> Salvar Nova Central
             </button>
        </div>
      </div>
    </div>
  );
}

// =======================================================================
// 15. A PÁGINA DE USUÁRIOS (Backoffice) - (COM PROP DE USUÁRIO)
// =======================================================================

// --- Definição de Tipos para Usuários ---
type PerfilUsuario = 'Atendente' | 'Consulta' | 'Gerente' | 'Administrador';
// ... (o resto dos tipos pode continuar)
type LogAuditoria = {
  // ...
};

// --- Dados Mockados da Página Usuários ---
const mockUsuarios: UsuarioSistema[] = [
  // ... (os dados mockados continuam)
];

const mockLogsAuditoria: LogAuditoria[] = [
  // ... (os dados mockados continuam)
];

// --- Componente PAI da Página Usuários ---
type UsuariosViewMode = 'lista' | 'logs';

// CORREÇÃO AQUI: Adicione a prop { usuario }: { usuario: User }
function PaginaUsuarios({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] = useState<UsuariosViewMode>('lista');

  const renderView = () => {
    switch (viewMode) {
      case 'lista':
        return <ViewListaUsuarios usuarios={mockUsuarios} />;
      case 'logs':
        return <ViewLogsAuditoria logs={mockLogsAuditoria} />;
      default:
        return <ViewListaUsuarios usuarios={mockUsuarios} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-menu Novo */}
      <div className="flex space-x-2 border-b border-gray-200">
        <SubMenuButton
          label="Gestão de Usuários"
          active={viewMode === 'lista'}
          onClick={() => setViewMode('lista')}
        />
        <SubMenuButton
          label="Logs de Auditoria"
          active={viewMode === 'logs'}
          onClick={() => setViewMode('logs')}
        />
      </div>
      
      {/* Conteúdo da View Ativa */}
      <div>
        {renderView()}
      </div>
    </div>
  );
}

// --- Componentes da Página Usuários ---

// --- View 1: Lista de Usuários ---
function ViewListaUsuarios({ usuarios }: { usuarios: UsuarioSistema[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const usuariosAtivos = usuarios.filter(u => u.status === 'Ativo').length;
  const usuariosInativos = usuarios.filter(u => u.status === 'Inativo').length;

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.cpf.includes(searchTerm) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getPerfilClass = (perfil: PerfilUsuario) => {
    switch (perfil) {
      case 'Administrador': return 'bg-red-100 text-red-800';
      case 'Gerente': return 'bg-purple-100 text-purple-800';
      case 'Atendente': return 'bg-blue-100 text-blue-800';
      case 'Consulta': return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total Usuários" value={usuarios.length.toString()} change="" changeType="info" icon={Users} />
        <KpiCard title="Usuários Ativos" value={usuariosAtivos.toString()} change="" changeType="info" icon={UserCheck} />
        <KpiCard title="Usuários Inativos" value={usuariosInativos.toString()} change="" changeType="info" icon={UserCog} />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Cabeçalho da Tabela */}
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Usuários do Sistema</h3>
            <p className="text-sm text-gray-500">Gerenciamento de usuários e permissões</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <ExportarDropdown />
            <button
              className="flex-shrink-0 flex items-center px-4 py-2 text-white rounded-lg shadow-sm transition-colors"
              style={{ backgroundColor: HUB_BRAND_COLOR }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Usuário
            </button>
          </div>
        </div>
        
        {/* Tabela de Usuários */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail Corporativo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acesso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.cpf}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${getPerfilClass(user.perfil)}`}>
                      {user.perfil}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.grupo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.ultimoAcesso}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- View 2: Logs de Auditoria ---
function ViewLogsAuditoria({ logs }: { logs: LogAuditoria[] }) {
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const logsFiltrados = logs.filter(log => {
    const matchUsuario = filtroUsuario === '' || log.usuario.includes(filtroUsuario);
    // Lógica de data simples (apenas "começa com")
    const matchData = filtroData === '' || log.timestamp.startsWith(filtroData.split('-').reverse().join('/'));
    return matchUsuario && matchData;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Cabeçalho com Filtros */}
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Logs de Auditoria</h3>
        <p className="text-sm text-gray-500">Monitoramento de todas as ações realizadas no portal.</p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
          <input
            type="text"
            placeholder="Filtrar por e-mail do usuário..."
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button className="flex items-center justify-center px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP de Acesso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logsFiltrados.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.usuario}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      log.acao === 'CREATE' ? 'bg-green-100 text-green-800' :
                      log.acao === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.acao}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.entidade} (ID: {log.entidadeId})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-sm truncate" title={log.descricao}>{log.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =======================================================================
// 16. A NOVA PÁGINA DE CONFIGURAÇÕES (Segregada)
// =======================================================================
function PaginaConfiguracoes({ usuario }: { usuario: User }) {
  
  // O Perfil 'PA' agora tem acesso, então o bloqueio total foi removido.
  // O menu lateral já o impede de ver o que não deve.

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Coluna 1: Cadastros */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* === VISÍVEL APENAS PARA O MASTER === */}
        {usuario.perfil === 'Master' && (
          <FormCadastroCentral />
        )}

        {/* === VISÍVEL APENAS PARA A CENTRAL === */}
        {usuario.perfil === 'Central' && (
          <>
            <FormCadastroCooperativa usuario={usuario} />
            <FormCadastroPA usuario={usuario} />
            <FormCadastroUsuario usuario={usuario} /> {/* NOVO */}
            <FormConfiguracaoCentral /> {/* NOVO */}
          </>
        )}
        
        {/* === VISÍVEL APENAS PARA A COOPERATIVA === */}
        {usuario.perfil === 'Cooperativa' && (
          <>
            <FormCadastroPA usuario={usuario} />
            <FormCadastroUsuario usuario={usuario} /> {/* NOVO */}
          </>
        )}
        
        {/* === VISÍVEL APENAS PARA O PA === */}
        {usuario.perfil === 'PA' && (
          <FormCadastroUsuario usuario={usuario} /> /* NOVO */
        )}
      </div>

      {/* Coluna 2: Listagens para Edição */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* === VISÍVEL APENAS PARA O MASTER === */}
        {usuario.perfil === 'Master' && (
          <ListaEdicaoCentrais />
        )}

        {/* === VISÍVEL APENAS PARA A CENTRAL === */}
        {usuario.perfil === 'Central' && (
          <>
            <ListaEdicaoCooperativas usuario={usuario} />
            <ListaEdicaoPA usuario={usuario} />
            <ListaEdicaoUsuarios usuario={usuario} /> {/* NOVO */}
          </>
        )}
        
        {/* === VISÍVEL APENAS PARA A COOPERATIVA === */}
        {usuario.perfil === 'Cooperativa' && (
          <>
            <ListaEdicaoPA usuario={usuario} />
            <ListaEdicaoUsuarios usuario={usuario} /> {/* NOVO */}
          </>
        )}

        {/* === VISÍVEL APENAS PARA O PA === */}
        {usuario.perfil === 'PA' && (
          <ListaEdicaoUsuarios usuario={usuario} /> /* NOVO */
        )}
      </div>
    </div>
  );
}

// --- Sub-componentes de Configurações ---

// MASTER: Cadastra Central
function FormCadastroCentral() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">Cadastrar Nova Central</h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Crie um novo administrador e uma nova central segregada.
      </p>
      <form className="space-y-4">
        <div>
          <label htmlFor="adminNome" className="block text-sm font-medium text-gray-700">Nome Completo do Administrador</label>
          <input type="text" id="adminNome" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Email do Administrador</label>
          <input type="email" id="adminEmail" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="centralNome" className="block text-sm font-medium text-gray-700">Nome da Central</label>
          <input type="text" id="centralNome" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="centralLogo" className="block text-sm font-medium text-gray-700">Logo da Central</label>
          <input type="file" id="centralLogo" accept="image/*" onChange={handleLogoChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hub-teal file:text-white hover:file:bg-hub-teal-dark" />
        </div>
        {logoPreview && <img src={logoPreview} alt="Preview" className="w-24 h-24 object-contain mx-auto mt-2" />}
        <button type="submit" className="w-full flex items-center justify-center px-6 py-2 text-white rounded-lg shadow-sm" style={{ backgroundColor: HUB_BRAND_COLOR }}>
          <UserPlus className="w-5 h-5 mr-2" /> Cadastrar Central
        </button>
      </form>
    </div>
  );
}

// MASTER: Edita Centrais
function ListaEdicaoCentrais() {
  const centrais = mockCentrais.filter(c => c.id !== 'c1'); // Não editar a própria Hubcoop
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
       <h3 className="text-xl font-semibold text-gray-800">Centrais Existentes</h3>
       <p className="text-sm text-gray-500 mt-1 mb-6">Edite as centrais já cadastradas.</p>
       <div className="space-y-4">
        {centrais.map(central => (
          <div key={central.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center">
              <img src={central.logo} alt={central.nome} className="w-10 h-10 object-contain rounded-full bg-white border shadow-sm" />
              <div className="ml-4">
                <p className="text-lg font-semibold text-gray-900">{central.nome}</p>
                <p className="text-sm text-gray-500">ID: {central.id} | Admin: {central.admin}</p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 text-sm text-white bg-hub-teal rounded-lg shadow-sm">
              <Edit2 className="w-4 h-4 mr-2" /> Editar
            </button>
          </div>
        ))}
       </div>
    </div>
  );
}


// (FormCadastroCooperativa e ListaEdicaoCooperativas permanecem iguais)
// CENTRAL: Cadastra Cooperativa
function FormCadastroCooperativa({ usuario }: { usuario: User }) {
   return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">Cadastrar Nova Cooperativa</h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Adicionar uma nova cooperativa singular à sua central ({mockCentrais.find(c => c.id === usuario.centralId)?.nome}).
      </p>
      {/* ... (Aqui iria o formulário de Nova Cooperativa) ... */}
      <button className="w-full flex items-center justify-center px-6 py-2 text-white rounded-lg shadow-sm" style={{ backgroundColor: HUB_BRAND_COLOR }}>
        <Plus className="w-5 h-5 mr-2" /> Cadastrar Cooperativa
      </button>
    </div>
  );
}

// CENTRAL: Edita Cooperativas
function ListaEdicaoCooperativas({ usuario }: { usuario: User }) {
  const cooperativas = mockCooperativas.filter(c => c.centralId === usuario.centralId && c.tipo === 'Singular');
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
       <h3 className="text-xl font-semibold text-gray-800">Cooperativas da sua Central</h3>
       <p className="text-sm text-gray-500 mt-1 mb-6">Edite as cooperativas singulares.</p>
       <div className="space-y-4 max-h-96 overflow-y-auto">
        {cooperativas.map(coop => (
          <div key={coop.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div>
              <p className="text-lg font-semibold text-gray-900">{coop.nome} (Cód: {coop.codigo})</p>
              <p className="text-sm text-gray-500">CNPJ: {coop.cnpj}</p>
            </div>
            <button className="flex items-center px-4 py-2 text-sm text-white bg-hub-teal rounded-lg shadow-sm">
              <Edit2 className="w-4 h-4 mr-2" /> Editar
            </button>
          </div>
        ))}
       </div>
    </div>
  );
}


// (FormCadastroPA e ListaEdicaoPA permanecem iguais)
// CENTRAL ou COOPERATIVA: Cadastra PA
function FormCadastroPA({ usuario }: { usuario: User }) {
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">Cadastrar Novo Ponto de Atendimento</h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Adicionar um novo PA.
      </p>
      {/* Se for Central, precisa de um <select> para escolher a cooperativa */}
      {usuario.perfil === 'Central' && (
        <div className="mb-4">
          <label htmlFor="coopSelect" className="block text-sm font-medium text-gray-700">Selecionar Cooperativa</label>
          <select id="coopSelect" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
            {mockCooperativas.filter(c => c.centralId === usuario.centralId && c.tipo === 'Singular').map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
      )}
      {/* ... (Aqui iria o formulário de Novo PA) ... */}
      <button className="w-full flex items-center justify-center px-6 py-2 text-white rounded-lg shadow-sm" style={{ backgroundColor: HUB_BRAND_COLOR }}>
        <Plus className="w-5 h-5 mr-2" /> Cadastrar PA
      </button>
    </div>
  );
}

// CENTRAL ou COOPERATIVA: Edita PA
function ListaEdicaoPA({ usuario }: { usuario: User }) {
  const pas = mockPontosAtendimento.filter(pa => {
    if (usuario.perfil === 'Central') {
      // Pega os IDs das cooperativas da central
      const coopIds = mockCooperativas.filter(c => c.centralId === usuario.centralId).map(c => c.id);
      return coopIds.includes(pa.cooperativaId);
    }
    if (usuario.perfil === 'Cooperativa') {
      return pa.cooperativaId === usuario.cooperativaId;
    }
    return false;
  });

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
       <h3 className="text-xl font-semibold text-gray-800">Pontos de Atendimento</h3>
       <p className="text-sm text-gray-500 mt-1 mb-6">Edite os PAs cadastrados.</p>
       <div className="space-y-4 max-h-96 overflow-y-auto">
        {pas.length > 0 ? pas.map(pa => (
          <div key={pa.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div>
              <p className="text-lg font-semibold text-gray-900">{pa.nome} (Cód: {pa.codigo})</p>
              <p className="text-sm text-gray-500">Status: {pa.status}</p>
            </div>
            <button className="flex items-center px-4 py-2 text-sm text-white bg-hub-teal rounded-lg shadow-sm">
              <Edit2 className="w-4 h-4 mr-2" /> Editar
            </button>
          </div>
        )) : (
          <p className="text-sm text-gray-500 text-center">Nenhum Ponto de Atendimento encontrado para este perfil.</p>
        )}
       </div>
    </div>
  );
}

// --- NOVOS COMPONENTES (CADASTRO DE USUÁRIO E CONFIG) ---

// NOVO: CENTRAL - Configuração de Sincronia
function FormConfiguracaoCentral() {
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">Configurações da Central</h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Defina o tempo de sincronização dos dados do dashboard.
      </p>
      <div className="space-y-3">
        <label className="flex items-center p-3 border rounded-lg">
          <input type="radio" name="sync-time" className="w-4 h-4 text-hub-teal" defaultChecked />
          <span className="ml-3 text-sm font-medium">5 minutos</span>
        </label>
        <label className="flex items-center p-3 border rounded-lg">
          <input type="radio" name="sync-time" className="w-4 h-4 text-hub-teal" />
          <span className="ml-3 text-sm font-medium">10 minutos</span>
        </label>
      </div>
    </div>
  );
}

// NOVO: CENTRAL, COOPERATIVA, PA - Cadastra Usuário
function FormCadastroUsuario({ usuario }: { usuario: User }) {
  let titulo = "Cadastrar Novo Usuário";
  if (usuario.perfil === 'Central') titulo = "Cadastrar Usuário (Central, Coop ou PA)";
  if (usuario.perfil === 'Cooperativa') titulo = "Cadastrar Usuário (Coop ou PA)";
  if (usuario.perfil === 'PA') titulo = "Cadastrar Usuário (PA)";

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">{titulo}</h3>
      <form className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Usuário</label>
          <input type="text" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </div>
        
        {/* Lógica de seleção de perfil com base em quem está logado */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Perfil</label>
          <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
            {usuario.perfil === 'Central' && <option value="central">Central</option>}
            {(usuario.perfil === 'Central' || usuario.perfil === 'Cooperativa') && <option value="cooperativa">Cooperativa</option>}
            <option value="pa">Ponto de Atendimento</option>
          </select>
        </div>

        <button type="submit" className="w-full flex items-center justify-center px-6 py-2 text-white rounded-lg shadow-sm" style={{ backgroundColor: HUB_BRAND_COLOR }}>
          <UserPlus className="w-5 h-5 mr-2" /> Cadastrar Usuário
        </button>
      </form>
    </div>
  );
}

// NOVO: CENTRAL, COOPERATIVA, PA - Edita Usuários
function ListaEdicaoUsuarios({ usuario }: { usuario: User }) {
  // Apenas um mock simples para ilustração
  const usuariosVisiveis = [
    { id: 1, nome: "Usuário Exemplo 1 (Coop)", perfil: "Cooperativa" },
    { id: 2, nome: "Usuário Exemplo 2 (PA)", perfil: "PA" },
  ];
  
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
       <h3 className="text-xl font-semibold text-gray-800">Usuários Cadastrados</h3>
       <p className="text-sm text-gray-500 mt-1 mb-6">Edite os usuários da sua hierarquia.</p>
       <div className="space-y-4 max-h-96 overflow-y-auto">
        {usuariosVisiveis.map(user => (
          // Filtra para não mostrar perfis que o usuário não pode ver
          (usuario.perfil === 'Central' ||
           (usuario.perfil === 'Cooperativa' && user.perfil !== 'Central') ||
           (usuario.perfil === 'PA' && user.perfil === 'PA')) &&
          (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <p className="text-lg font-semibold text-gray-900">{user.nome}</p>
                <p className="text-sm text-gray-500">Perfil: {user.perfil}</p>
              </div>
              <button className="flex items-center px-4 py-2 text-sm text-white bg-hub-teal rounded-lg shadow-sm">
                <Edit2 className="w-4 h-4 mr-2" /> Editar
              </button>
            </div>
          )
        ))}
       </div>
    </div>
  );
}
// =======================================================================
// 17. PÁGINA DE LOYALTY (PONTOS) - CORRIGIDA E EXPANDIDA
// =======================================================================

type ItemLoyalty = { id: number; nome: string; custoPontos: number; categoria: string; limitePorResgate?: number };
type SolicitacaoPontos = { id: number; cooperado: string; cpf: string; produto: string; pontos: number; item: string; data: string; status: 'pendente' | 'aprovado' };
type ConfigValidade = { produto: string; validadeMeses: number };

const mockItensLoyalty: ItemLoyalty[] = [
  { id: 1, nome: 'Voucher iFood', custoPontos: 3000, categoria: 'Voucher', limitePorResgate: 5 },
  { id: 2, nome: 'Voucher Uber', custoPontos: 3000, categoria: 'Voucher', limitePorResgate: 5 },
  { id: 3, nome: 'Aporte Capital Social', custoPontos: 100, categoria: 'Investimento', limitePorResgate: 100000 }, // 100 pts = 1 real (exemplo)
  { id: 4, nome: 'Aporte Previdência', custoPontos: 100, categoria: 'Previdência', limitePorResgate: 100000 },
  { id: 5, nome: 'Transferência Miles', custoPontos: 1, categoria: 'Milhas', limitePorResgate: 50000 },
];

const mockSolicitacoesLoyalty: SolicitacaoPontos[] = [
  { id: 1, cooperado: 'Ana Beatriz Silva', cpf: '123.456.789-00', produto: 'Visa Infinite', pontos: 15000, item: 'Aporte Capital Social', data: '17/11/2025', status: 'pendente' },
];

const mockConfigValidade: ConfigValidade[] = [
  { produto: 'Visa Infinite', validadeMeses: 36 },
  { produto: 'Visa Platinum', validadeMeses: 24 },
  { produto: 'Visa Gold', validadeMeses: 24 },
  { produto: 'Visa Classic', validadeMeses: 12 },
];

function PaginaLoyalty({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'autorizacoes' | 'configuracoes'>('catalogo');

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        <button onClick={() => setActiveTab('catalogo')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'catalogo' ? 'border-b-2 border-hub-teal text-hub-teal' : 'text-gray-500'}`}>Catálogo & Regras</button>
        {/* Autorizações visível para Central */}
        {usuario.perfil === 'Central' && (
          <button onClick={() => setActiveTab('autorizacoes')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'autorizacoes' ? 'border-b-2 border-hub-teal text-hub-teal' : 'text-gray-500'}`}>Autorizações Pendentes</button>
        )}
        <button onClick={() => setActiveTab('configuracoes')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'configuracoes' ? 'border-b-2 border-hub-teal text-hub-teal' : 'text-gray-500'}`}>Validade & Parametrização</button>
      </div>

      {activeTab === 'catalogo' && <ViewCatalogoLoyalty />}
      {activeTab === 'autorizacoes' && <ViewAutorizacoesLoyalty />}
      {activeTab === 'configuracoes' && <ViewConfigLoyalty />}
    </div>
  );
}

function ViewCatalogoLoyalty() {
  // Simulação de adicionar novo item
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Itens de Recompensa</h3>
          <p className="text-sm text-gray-500">Gerencie os itens disponíveis para troca e seus custos.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 text-white rounded-lg shadow-sm" style={{ backgroundColor: HUB_BRAND_COLOR }}>
          <Plus className="w-5 h-5 mr-2" /> Cadastrar Novo Item
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in">
          <h4 className="font-semibold mb-3 text-gray-700">Novo Item de Catálogo</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Nome do Item (Ex: Voucher Uber)" className="px-3 py-2 border rounded-md" />
            <select className="px-3 py-2 border rounded-md">
              <option>Selecione Categoria</option>
              <option>Voucher</option>
              <option>Capital Social</option>
              <option>Previdência</option>
              <option>Milhas</option>
            </select>
            <input type="number" placeholder="Custo em Pontos" className="px-3 py-2 border rounded-md" />
            <button className="bg-green-600 text-white rounded-md px-4 py-2">Salvar Item</button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockItensLoyalty.map(item => (
          <div key={item.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">{item.categoria}</span>
              <button className="text-hub-teal hover:text-hub-teal-dark text-sm font-medium">Editar</button>
            </div>
            <h4 className="text-lg font-bold text-gray-800">{item.nome}</h4>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Custo:</span>
                <span className="font-semibold">{item.custoPontos.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Limite de Uso:</span>
                <span className="font-semibold">{item.limitePorResgate ? item.limitePorResgate.toLocaleString() : 'Ilimitado'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewAutorizacoesLoyalty() {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">Autorizações Pendentes</h3>
        <p className="text-sm text-gray-500">Aprovação de uso de pontos acima do limite automático.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cooperado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Solicitação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Total Pontos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockSolicitacoesLoyalty.map(sol => (
              <tr key={sol.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{sol.data}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {sol.cooperado}<br/>
                  <span className="text-xs text-gray-400">{sol.cpf}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{sol.produto}</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  {sol.item}<br/>
                  <span className="text-xs text-orange-600">Requer Autorização Central</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-hub-teal">{sol.pontos.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-bold">APROVAR</button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-bold">NEGAR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ViewConfigLoyalty() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuração de Validade */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Validade dos Pontos (Meses)</h3>
        <p className="text-sm text-gray-500 mb-4">Defina o tempo de expiração dos pontos por produto.</p>
        <div className="space-y-3">
          {mockConfigValidade.map((conf, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-700">{conf.produto}</span>
              <div className="flex items-center">
                <input 
                  type="number" 
                  defaultValue={conf.validadeMeses} 
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center mr-2 focus:ring-hub-teal focus:border-hub-teal"
                />
                <span className="text-sm text-gray-500">meses</span>
              </div>
            </div>
          ))}
          <button className="w-full py-2 bg-hub-teal text-white rounded-lg shadow-sm mt-4 hover:bg-teal-700 transition-colors">
            <Save className="w-4 h-4 inline mr-2"/> Salvar Validades
          </button>
        </div>
      </div>

      {/* Configuração de Limites Globais */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Limite Global de Uso Automático</h3>
        <p className="text-sm text-gray-500 mb-6">
          Qualquer solicitação de resgate que exceda este valor em pontos necessitará de aprovação manual da Central.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Limite Máximo (Pontos)</label>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input 
                type="number" 
                defaultValue={5000} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-hub-teal focus:border-hub-teal text-lg font-semibold"
              />
              <span className="absolute right-4 top-3 text-gray-400 text-sm">pts</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
          <h5 className="text-sm font-bold text-blue-800 mb-1 flex items-center"><ShieldAlert className="w-4 h-4 mr-1"/> Regra de Segurança</h5>
          <p className="text-xs text-blue-700">
            Se o cooperado possuir 15.000 pontos e tentar usar 6.000, a transação ficará pendente na aba "Autorizações". Se usar 4.000, será aprovada automaticamente.
          </p>
        </div>

        <button className="w-full py-2 bg-hub-teal text-white rounded-lg shadow-sm hover:bg-teal-700 transition-colors">
          <Save className="w-4 h-4 inline mr-2"/> Atualizar Limite Global
        </button>
      </div>
    </div>
  );
}
// =======================================================================
// 18. PÁGINA DE SALA VIP
// =======================================================================

type AcessoSalaVIP = { id: number; data: string; cooperado: string; cpf: string; produto: string; sala: string; acompanhantes: number; custo: string };

const mockAcessosVIP: AcessoSalaVIP[] = [
  { id: 1, data: '15/11/2025 14:30', cooperado: 'Ana Beatriz Silva', cpf: '123.456.789-00', produto: 'Visa Infinite', sala: 'Visa Infinite Lounge GRU', acompanhantes: 1, custo: 'Isento' },
  { id: 2, data: '10/11/2025 09:15', cooperado: 'Daniel Oliveira', cpf: '111.222.333-44', produto: 'Visa Platinum', sala: 'W Premium Lounge', acompanhantes: 0, custo: 'US$ 32.00' },
];

function PaginaSalaVIP({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<'relatorio' | 'liberacao'>('relatorio');

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        <button onClick={() => setActiveTab('relatorio')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'relatorio' ? 'border-b-2 border-hub-teal text-hub-teal' : 'text-gray-500'}`}>Relatório de Uso</button>
        <button onClick={() => setActiveTab('liberacao')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'liberacao' ? 'border-b-2 border-hub-teal text-hub-teal' : 'text-gray-500'}`}>Liberar Acesso</button>
      </div>

      {activeTab === 'relatorio' && <ViewRelatorioSalaVIP />}
      {activeTab === 'liberacao' && <ViewLiberarSalaVIP />}
    </div>
  );
}

function ViewRelatorioSalaVIP() {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">Histórico de Acessos</h3>
        
        {/* Filtros Específicos Solicitados */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
           <input type="date" className="px-3 py-2 border border-gray-300 rounded-md" />
           <select className="px-3 py-2 border border-gray-300 rounded-md"><option>Todas Cooperativas</option></select>
           <select className="px-3 py-2 border border-gray-300 rounded-md"><option>Todos Produtos</option></select>
           <input type="text" placeholder="CPF / CNPJ" className="px-3 py-2 border border-gray-300 rounded-md" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cooperado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Sala</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Acomp.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Custo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockAcessosVIP.map(acesso => (
              <tr key={acesso.id}>
                <td className="px-6 py-4 text-sm text-gray-500">{acesso.data}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{acesso.cooperado}<br/><span className="text-xs text-gray-400">{acesso.cpf}</span></td>
                <td className="px-6 py-4 text-sm text-gray-500">{acesso.produto}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{acesso.sala}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{acesso.acompanhantes}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{acesso.custo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ViewLiberarSalaVIP() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Liberar Acesso Sala VIP</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">CPF do Cooperado</label>
          <input type="text" placeholder="000.000.000-00" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Produto (Cartão)</label>
          <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
            <option>Selecione...</option>
            <option>Visa Infinite</option>
            <option>Visa Platinum</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sala / Aeroporto</label>
          <input type="text" placeholder="Ex: Lounge Key GRU" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
        </div>
        <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg">
          <p className="font-bold flex items-center"><ShieldAlert className="w-4 h-4 mr-2"/> Atenção</p>
          <p>A liberação manual gerará um código QR temporário válido por 4 horas.</p>
        </div>
        <button className="w-full py-3 bg-hub-teal text-white font-semibold rounded-lg shadow-sm flex justify-center items-center">
          <CheckCircle className="w-5 h-5 mr-2" /> Gerar Autorização
        </button>
      </div>
    </div>
); 
}
// =======================================================================
// COMPONENTE AUXILIAR: DROPDOWN DE EXPORTAÇÃO 
// =======================================================================
function ExportarDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
      >
        <FileDown className="w-5 h-5 mr-2 text-gray-500" />
        Exportar
        <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FileText className="w-4 h-4 mr-2 text-green-600" /> Excel (.xlsx)
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <File className="w-4 h-4 mr-2 text-red-600" /> PDF (.pdf)
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <List className="w-4 h-4 mr-2 text-blue-600" /> CSV (.csv)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}