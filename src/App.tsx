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
  User,
  Gift, // Para Loyalty
  Armchair, // Para Sala VIP
  Plane, // Para Milhas
  Coffee, // Para Sala VIP
  CheckSquare, // Para Conciliação
  CreditCard as CreditCardIcon, 
  ArrowDownCircle,
  Smartphone,
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
              {/* Carteiras Virtuais movido para aqui (geral) para não duplicar */}
              <SidebarLink text="Carteiras Virtuais" icon={<Smartphone size={18} />} active={activePage === 'CarteirasVirtuais'} onClick={() => setActivePage('CarteirasVirtuais')} />
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

          <SidebarLink text="Gestão de Limites" icon={<SlidersHorizontal size={18} />} active={activePage === 'GestaoLimites'} onClick={() => setActivePage('GestaoLimites')} />
          <SidebarLink text="Conta Salário" icon={<Wallet size={18} />} active={activePage === 'ContaSalario'} onClick={() => setActivePage('ContaSalario')} />
          <SidebarLink text="Serviços Adicionais" icon={<Coffee size={18} />} active={activePage === 'ServicosAdicionais'} onClick={() => setActivePage('ServicosAdicionais')} />
          
          {usuario.perfil === 'Central' && (
            <SidebarLink text="Lançamentos" icon={<ArrowDownCircle size={18} />} active={activePage === 'Lancamentos'} onClick={() => setActivePage('Lancamentos')} />
          )}
        </nav>

        {/* 4.3. Rodapé do Menu (Configurações e Sair) */}
        <div className="p-2 border-t border-white border-opacity-20 space-y-1">
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

      {/* Conteúdo Principal (Direita) */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between h-20 px-6 bg-white shadow-md">
          <h2 className="text-3xl font-semibold text-gray-700">
            {activePage === 'Loyalty' ? 'Loyalty (Pontos)' : activePage.replace(/([A-Z])/g, ' $1').trim()}
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
          {activePage === 'GestaoLimites' && <PaginaGestaoLimites usuario={usuario} />} 
          {activePage === 'ContaSalario' && <PaginaContaSalario usuario={usuario} />}
          {activePage === 'ServicosAdicionais' && <PaginaServicosAdicionais usuario={usuario} />}
          {activePage === 'Lancamentos' && <PaginaLancamentos usuario={usuario} />}
          {activePage === 'CarteirasVirtuais' && <PaginaCarteirasVirtuais usuario={usuario} />}

          {/* LÓGICA DE PLACEHOLDER CORRIGIDA ABAIXO */}
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
           activePage !== 'Configuracoes' &&
           activePage !== 'GestaoLimites' &&       
           activePage !== 'ContaSalario' &&        
           activePage !== 'ServicosAdicionais' &&
           activePage !== 'Lancamentos' &&
           activePage !== 'CarteirasVirtuais' &&  // <--- Faltava o && aqui
           (
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
// --- TIPOS ATUALIZADOS PARA COOPERADOS ---
type StatusConta = 'Ativa' | 'Bloqueada';
type TipoVinculo = 'Titular' | 'Adicional' | 'Kids';
type FuncaoCartao = 'Credito' | 'Debito' | 'Multiplo';

type Endereco = {
  logradouro: string; numero: string; bairro: string; cidade: string; uf: string; cep: string;
};

type Gerente = {
  nome: string;
  usuarioSistema: string;
};

type ContaCorrente = {
  id: string;
  banco: string;
  agencia: string;
  numero: string;
  dataAbertura: string;
  status: StatusConta;
  paVinculado: string; // Ex: PA 03
  documentoVinculado: string; // CPF ou CNPJ desta conta
};

type CartaoResumo = {
  id: string; // ID interno
  numeroMascarado: string;
  funcao: FuncaoCartao;
  status: StatusConta;
  paVinculado: string;
  tipo: TipoVinculo; // Se este cartão específico é titular, adicional ou kids
  titularVinculadoId?: number; // Se for adicional/kids, aponta pro pai
  nomeImpresso: string;
};

type Socio = {
  nome: string;
  cpf: string;
};

type CooperadoDetalhado = {
  id: number;
  nome: string;
  cpf: string;
  cnpj?: string; // Opcional, um cooperado pode ter CNPJ vinculado
  socios?: Socio[]; // Se tiver CNPJ
  
  email: string;
  telefone: string;
  
  gerente: Gerente;
  enderecoEntrega: Endereco;
  
  // Arrays para suportar múltiplas contas em PAs diferentes
  contasCorrentes: ContaCorrente[];
  contasCartoes: CartaoResumo[];

  // Dados de Sistema para Permissão de Visualização
  centralId: string;
  cooperativaId: string;
  // O PA principal (para filtros de lista), embora ele possa ter contas em outros
  pontoAtendimentoPrincipalId: string; 
};

// --- MOCKS DE COOPERADOS (CENÁRIOS COMPLEXOS) ---
const mockCooperadosDetalhados: CooperadoDetalhado[] = [
  // EXEMPLO 1: Cooperado "Polvo" (CPF + CNPJ, Múltiplos PAs, Múltiplos Cartões)
  {
    id: 1,
    nome: 'Roberto Empresário Silva',
    cpf: '111.222.333-44',
    cnpj: '12.345.678/0001-90',
    email: 'roberto@empresa.com',
    telefone: '(11) 99999-0000',
    gerente: { nome: 'Mariana Gerente', usuarioSistema: 'mariana.ger' },
    enderecoEntrega: { logradouro: 'Av. Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP', cep: '01310-100' },
    socios: [
      { nome: 'Sócio Irmão Silva', cpf: '999.888.777-66' }
    ],
    contasCorrentes: [
      { id: 'cc1', banco: 'Sicoob', agencia: '0001', numero: '12345-6', dataAbertura: '10/01/2020', status: 'Ativa', paVinculado: 'PA 03', documentoVinculado: '111.222.333-44' },
      { id: 'cc2', banco: 'Sicoob', agencia: '0001', numero: '99887-0', dataAbertura: '15/05/2022', status: 'Ativa', paVinculado: 'PA 04', documentoVinculado: '12.345.678/0001-90' }
    ],
    contasCartoes: [
      { id: 'card1', numeroMascarado: '4984 **** **** 1111', funcao: 'Multiplo', status: 'Ativa', paVinculado: 'PA 03', tipo: 'Titular', nomeImpresso: 'ROBERTO E SILVA' },
      { id: 'card2', numeroMascarado: '5500 **** **** 2222', funcao: 'Credito', status: 'Bloqueada', paVinculado: 'PA 04', tipo: 'Titular', nomeImpresso: 'EMPRESA SILVA LTDA' }
    ],
    centralId: 'c2', cooperativaId: 'coop_coopesa', pontoAtendimentoPrincipalId: 'pa_03'
  },

  // EXEMPLO 2: Titular de Família (Com Adicional e Kids vinculados)
  {
    id: 2,
    nome: 'Ana Mãe de Família',
    cpf: '222.333.444-55',
    email: 'ana.familia@email.com',
    telefone: '(21) 98888-7777',
    gerente: { nome: 'Carlos Atendente', usuarioSistema: 'carlos.pa05' },
    enderecoEntrega: { logradouro: 'Rua das Acácias', numero: '50', bairro: 'Leblon', cidade: 'Rio de Janeiro', uf: 'RJ', cep: '22450-000' },
    contasCorrentes: [
      { id: 'cc3', banco: 'Sicoob', agencia: '0002', numero: '55555-5', dataAbertura: '20/03/2019', status: 'Ativa', paVinculado: 'PA 05', documentoVinculado: '222.333.444-55' }
    ],
    contasCartoes: [
      { id: 'card3', numeroMascarado: '4111 **** **** 3333', funcao: 'Multiplo', status: 'Ativa', paVinculado: 'PA 05', tipo: 'Titular', nomeImpresso: 'ANA FAMILIA' }
    ],
    centralId: 'c2', cooperativaId: 'coop_crediserv', pontoAtendimentoPrincipalId: 'pa_05'
  },

  // EXEMPLO 3: Conta Kids (Vinculada à Ana - ID 2)
  {
    id: 3,
    nome: 'Enzo Filho Kids',
    cpf: '555.666.777-88',
    email: 'enzo.games@email.com',
    telefone: '(21) 98888-7777',
    gerente: { nome: 'Carlos Atendente', usuarioSistema: 'carlos.pa05' },
    enderecoEntrega: { logradouro: 'Rua das Acácias', numero: '50', bairro: 'Leblon', cidade: 'Rio de Janeiro', uf: 'RJ', cep: '22450-000' },
    contasCorrentes: [], // Kids as vezes não tem CC própria, usa mesada na conta cartão
    contasCartoes: [
      { id: 'card4', numeroMascarado: '4111 **** **** 4444', funcao: 'Debito', status: 'Ativa', paVinculado: 'PA 05', tipo: 'Kids', titularVinculadoId: 2, nomeImpresso: 'ENZO FILHO' }
    ],
    centralId: 'c2', cooperativaId: 'coop_crediserv', pontoAtendimentoPrincipalId: 'pa_05'
  },

  // EXEMPLO 4: Adicional (Esposo da Ana - ID 2)
  {
    id: 4,
    nome: 'Paulo Esposo Adicional',
    cpf: '888.999.000-11',
    email: 'paulo.esposo@email.com',
    telefone: '(21) 97777-6666',
    gerente: { nome: 'Carlos Atendente', usuarioSistema: 'carlos.pa05' },
    enderecoEntrega: { logradouro: 'Rua das Acácias', numero: '50', bairro: 'Leblon', cidade: 'Rio de Janeiro', uf: 'RJ', cep: '22450-000' },
    contasCorrentes: [],
    contasCartoes: [
      { id: 'card5', numeroMascarado: '4111 **** **** 5555', funcao: 'Credito', status: 'Ativa', paVinculado: 'PA 05', tipo: 'Adicional', titularVinculadoId: 2, nomeImpresso: 'PAULO ESPOSO' }
    ],
    centralId: 'c2', cooperativaId: 'coop_crediserv', pontoAtendimentoPrincipalId: 'pa_05'
  }
];

function PaginaCooperados({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedCooperado, setSelectedCooperado] = useState<CooperadoDetalhado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtros de Segregação
  const cooperadosVisiveis = mockCooperadosDetalhados.filter(coop => {
    if (usuario.perfil === 'Central') return coop.centralId === usuario.centralId;
    if (usuario.perfil === 'Cooperativa') return coop.cooperativaId === usuario.cooperativaId;
    if (usuario.perfil === 'PA') return coop.pontoAtendimentoPrincipalId === usuario.pontoAtendimentoId;
    return false;
  });

  const filteredCooperados = cooperadosVisiveis.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf.includes(searchTerm) ||
    (c.cnpj && c.cnpj.includes(searchTerm)) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCooperado = (cooperado: CooperadoDetalhado) => {
    setSelectedCooperado(cooperado);
    setViewMode('detail');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {viewMode === 'list' ? 'Gestão de Cooperados' : `Detalhe: ${selectedCooperado?.nome}`}
        </h2>
        {viewMode === 'detail' && (
          <button
            onClick={() => { setViewMode('list'); setSelectedCooperado(null); }}
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
        <DetalheCooperado cooperado={selectedCooperado} />
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

function ListaCooperados({ cooperados, searchTerm, setSearchTerm, onSelect }: { cooperados: CooperadoDetalhado[]; searchTerm: string; setSearchTerm: (t: string) => void; onSelect: (c: CooperadoDetalhado) => void }) {
  
  const getFuncaoBadge = (cards: CartaoResumo[]) => {
    // Simplificação: pega a função do primeiro cartão ativo
    const principal = cards[0];
    if (!principal) return <span className="text-xs text-gray-400">Sem Cartão</span>;
    return <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100">{principal.funcao}</span>;
  };

  const getTipoBadge = (cards: CartaoResumo[]) => {
    const tipo = cards[0]?.tipo || 'Titular';
    const color = tipo === 'Kids' ? 'bg-pink-100 text-pink-800' : tipo === 'Adicional' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800';
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{tipo}</span>;
  };

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
        <button className="flex items-center px-4 py-2 text-white rounded-lg shadow-sm" style={{ backgroundColor: HUB_BRAND_COLOR }}>
          <Plus className="w-5 h-5 mr-2" /> Novo Cooperado
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cooperado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documentos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função Cartão</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gerente / PA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cooperados.map((coop) => (
              <tr key={coop.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{coop.nome}</div>
                  <div className="text-xs text-gray-500">{coop.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">CPF: {coop.cpf}</div>
                  {coop.cnpj && <div className="text-xs text-gray-500">CNPJ: {coop.cnpj}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   {getTipoBadge(coop.contasCartoes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   {getFuncaoBadge(coop.contasCartoes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   <div>{coop.gerente.nome}</div>
                   <div className="text-xs font-mono bg-gray-100 inline px-1 rounded">{coop.pontoAtendimentoPrincipalId.toUpperCase().replace('_', ' ')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => onSelect(coop)} 
                    className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
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
function DetalheCooperado({ cooperado }: { cooperado: CooperadoDetalhado }) {
  const [showModalBloqueio, setShowModalBloqueio] = useState(false);
  const [showLinkedModal, setShowLinkedModal] = useState<number | null>(null); // ID do cooperado vinculado para mostrar (simulação)

  // Encontrar vínculos (Mock Logic)
  const vinculados = mockCooperadosDetalhados.filter(c => 
    c.contasCartoes.some(card => card.titularVinculadoId === cooperado.id)
  );

  const paiVinculado = cooperado.contasCartoes[0]?.titularVinculadoId 
    ? mockCooperadosDetalhados.find(c => c.id === cooperado.contasCartoes[0].titularVinculadoId)
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* CARD 1: Cabeçalho e Ações Principais */}
      <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-hub-teal flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{cooperado.nome}</h3>
          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
            <span>ID: {cooperado.id}</span>
            <span>•</span>
            <span className="flex items-center"><UserCheck className="w-4 h-4 mr-1"/> {cooperado.gerente.nome} ({cooperado.gerente.usuarioSistema})</span>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button 
            onClick={() => setShowModalBloqueio(true)}
            className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
          >
            <ShieldAlert className="w-5 h-5 mr-2"/>
            Gerenciar Bloqueios
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA 1: Dados Cadastrais */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4">Dados Pessoais & Endereço</h4>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500 block">CPF</span> <span className="font-medium">{cooperado.cpf}</span></div>
              {cooperado.cnpj && (
                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500 block text-xs">CNPJ Vinculado</span> 
                  <span className="font-medium">{cooperado.cnpj}</span>
                </div>
              )}
              <div><span className="text-gray-500 block">E-mail</span> <span className="font-medium">{cooperado.email}</span></div>
              <div><span className="text-gray-500 block">Telefone</span> <span className="font-medium">{cooperado.telefone}</span></div>
              <div className="pt-2 border-t mt-2">
                <span className="text-gray-500 block text-xs uppercase mb-1">Endereço de Entrega Cartão</span>
                <p className="font-medium text-gray-700">
                  {cooperado.enderecoEntrega.logradouro}, {cooperado.enderecoEntrega.numero}<br/>
                  {cooperado.enderecoEntrega.bairro} - {cooperado.enderecoEntrega.cidade}/{cooperado.enderecoEntrega.uf}<br/>
                  CEP: {cooperado.enderecoEntrega.cep}
                </p>
              </div>
            </div>
          </div>

          {/* Se for CNPJ, mostra sócios */}
          {cooperado.cnpj && cooperado.socios && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4">Quadro Societário</h4>
              <ul className="space-y-3">
                {cooperado.socios.map((socio, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{socio.nome}</span>
                    <span className="text-gray-500 text-xs">{socio.cpf}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* COLUNA 2: Contas e Cartões */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card de Contas Correntes */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-hub-teal"/> Contas Correntes
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Banco/Ag/Conta</th>
                    <th className="px-3 py-2">Documento</th>
                    <th className="px-3 py-2">Abertura</th>
                    <th className="px-3 py-2">PA</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cooperado.contasCorrentes.map(cc => (
                    <tr key={cc.id}>
                      <td className="px-3 py-2 font-medium">{cc.banco} / {cc.agencia} / {cc.numero}</td>
                      <td className="px-3 py-2 text-gray-500">{cc.documentoVinculado}</td>
                      <td className="px-3 py-2 text-gray-500">{cc.dataAbertura}</td>
                      <td className="px-3 py-2"><span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">{cc.paVinculado}</span></td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cc.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {cc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {cooperado.contasCorrentes.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">Nenhuma conta corrente direta.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card de Cartões */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
             <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-hub-teal"/> Contas Cartão
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Cartão</th>
                    <th className="px-3 py-2">Nome Impresso</th>
                    <th className="px-3 py-2">Função</th>
                    <th className="px-3 py-2">Tipo</th>
                    <th className="px-3 py-2">PA</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cooperado.contasCartoes.map(card => (
                    <tr key={card.id}>
                      <td className="px-3 py-2 font-mono">{card.numeroMascarado}</td>
                      <td className="px-3 py-2 text-gray-600 uppercase text-xs">{card.nomeImpresso}</td>
                      <td className="px-3 py-2">{card.funcao}</td>
                      <td className="px-3 py-2">
                         <span className={`px-2 py-0.5 rounded text-xs ${card.tipo === 'Kids' ? 'bg-pink-100 text-pink-800' : card.tipo === 'Adicional' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}`}>
                           {card.tipo}
                         </span>
                      </td>
                      <td className="px-3 py-2"><span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">{card.paVinculado}</span></td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${card.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {card.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Card de Relacionamentos (Titular/Adicional/Kids) */}
          {(vinculados.length > 0 || paiVinculado) && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
               <h4 className="font-semibold text-blue-800 border-b border-blue-100 pb-2 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2"/> Vínculos Familiares / Adicionais
              </h4>
              
              {/* Se eu sou Titular, mostro meus dependentes */}
              {vinculados.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Este cooperado é titular das seguintes contas vinculadas:</p>
                  {vinculados.map(v => (
                    <div key={v.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-bold text-gray-800">{v.nome}</p>
                        <p className="text-xs text-gray-500">CPF: {v.cpf}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-white rounded text-xs font-semibold border text-blue-600">
                          {v.contasCartoes.find(c => c.titularVinculadoId === cooperado.id)?.tipo || 'Vinculado'}
                        </span>
                        <button 
                           onClick={() => alert(`Abrindo modal com detalhes de ${v.nome}`)}
                           className="p-1 bg-white rounded border hover:bg-gray-100 text-blue-600"
                        >
                          <Eye className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Se eu sou Dependente, mostro meu titular */}
              {paiVinculado && (
                 <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3"/>
                    <div>
                      <p className="text-sm text-yellow-800">
                        Esta é uma conta <strong>{cooperado.contasCartoes[0]?.tipo}</strong> vinculada ao titular:
                      </p>
                      <p className="font-bold text-gray-900 mt-1">{paiVinculado.nome} (CPF: {paiVinculado.cpf})</p>
                    </div>
                    <button 
                       onClick={() => alert(`Abrindo modal com detalhes do titular ${paiVinculado.nome}`)}
                       className="ml-auto p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                    >
                       <Eye className="w-5 h-5 text-gray-600"/>
                    </button>
                 </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Modal de Bloqueio */}
      {showModalBloqueio && (
        <ModalBloqueioCooperado cooperado={cooperado} onClose={() => setShowModalBloqueio(false)} />
      )}
    </div>
  );
}

// --- NOVO COMPONENTE: Modal de Bloqueio Granular ---
function ModalBloqueioCooperado({ cooperado, onClose }: { cooperado: CooperadoDetalhado; onClose: () => void }) {
  // Estado local para gerenciar os checkboxes
  const [contasSelecionadas, setContasSelecionadas] = useState<Record<string, boolean>>({});
  const [cartoesSelecionados, setCartoesSelecionados] = useState<Record<string, boolean>>({});
  const [motivo, setMotivo] = useState('');

  const toggleConta = (id: string) => {
    setContasSelecionadas(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const toggleCartao = (id: string) => {
    setCartoesSelecionados(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSalvarBloqueio = () => {
    const contas = Object.keys(contasSelecionadas).filter(k => contasSelecionadas[k]);
    const cartoes = Object.keys(cartoesSelecionados).filter(k => cartoesSelecionados[k]);
    
    alert(`Bloqueio Aplicado!\nContas: ${contas.join(', ')}\nCartões: ${cartoes.join(', ')}\nMotivo: ${motivo}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="text-xl font-semibold text-red-700 flex items-center">
              <LogOut className="w-5 h-5 mr-2"/> Bloqueio de Produtos
            </h3>
            <p className="text-sm text-gray-500">Selecione os produtos que deseja bloquear para {cooperado.nome}</p>
          </div>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="space-y-6 mt-6">
          {/* Seção Contas Correntes */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Contas Correntes</h4>
            <div className="space-y-2">
              {cooperado.contasCorrentes.map(cc => (
                <label key={cc.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!!contasSelecionadas[cc.id]} 
                    onChange={() => toggleConta(cc.id)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <div className="ml-3">
                    <span className="block font-medium">Conta: {cc.numero} (Ag: {cc.agencia})</span>
                    <span className="text-xs text-gray-500">Banco: {cc.banco} | Doc: {cc.documentoVinculado}</span>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 rounded ${cc.status === 'Bloqueada' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    Atual: {cc.status}
                  </span>
                </label>
              ))}
              {cooperado.contasCorrentes.length === 0 && <p className="text-sm text-gray-400 italic">Nenhuma conta corrente disponível.</p>}
            </div>
          </div>

          {/* Seção Cartões */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Contas Cartão</h4>
            <div className="space-y-2">
              {cooperado.contasCartoes.map(card => (
                <label key={card.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!!cartoesSelecionados[card.id]} 
                    onChange={() => toggleCartao(card.id)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <div className="ml-3">
                    <span className="block font-medium">{card.numeroMascarado} ({card.funcao})</span>
                    <span className="text-xs text-gray-500">Tipo: {card.tipo} | Nome: {card.nomeImpresso}</span>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 rounded ${card.status === 'Bloqueada' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    Atual: {card.status}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo do Bloqueio</label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-red-500 focus:border-red-500"
              rows={3}
              placeholder="Descreva o motivo da ação..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-6 mt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-2">Cancelar</button>
          <button 
            onClick={handleSalvarBloqueio}
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 font-medium"
          >
            Confirmar Bloqueio
          </button>
        </div>
      </div>
    </div>
  );
}
// =======================================================================
// 9. Componente Modal de Solicitação de Cartão (Sem alterações)
// =======================================================================
type ModalSolicitarCartaoProps = {
  cooperado: Cooperado;
  onClose: () => void;
};

// --- Componentes auxiliares do Modal (AGORA COM 'COMPLETED') ---

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
// 10. A PÁGINA DE CARTÕES (ATUALIZADA - CONFIGURAÇÕES DE JUROS)
// =======================================================================

// --- Definição de Tipos para Cartões ---
type CartaoStatus = 'ativo' | 'vencido' | 'bloqueado_preventivo' | 'cancelado';
type CartaoFuncao = 'Credito' | 'Debito' | 'Multiplo';

type Cartao = {
  id: number;
  idCartao: string;
  cooperado: string;
  cooperativa: string;
  conta: string;
  numeroMascarado: string;
  tipo: string;
  funcao: CartaoFuncao;
  bandeira: string;
  limite: number;
  disponivel: number;
  validade: string;
  status: CartaoStatus;
};

// --- Tipos Auxiliares ---
type ProdutoAnuidade = { 
  id: number; 
  nome: string; 
  valorTitular: number; 
  valorAdicional: number; 
};

type RegraDesconto = { 
  id: number; 
  gasto: number; 
  desconto: number; 
  produto: string; 
};

type CustoReposicao = {
  cooperativa: string;
  valor: number;
};

type ProdutoConfig = { 
  id: number; 
  nome: string; 
  multa: number; 
  mora: number; 
  juros: number; // Juros Atraso
  
  // Campos Financeiros
  percRotativo: number;
  percSaque: number;
  percJurosEmissor: number;
  percJurosCrediario: number;
  percParcelamentoFatura: number; // Renomeado visualmente para "Refinanciamento"
  percParcelamentoRotativo: number; // NOVO CAMPO
  
  // Custo Reposição (Lista por Coop)
  custosReposicao: CustoReposicao[];
};

type CartaoEntrega = { 
  id: number; 
  cooperado: string; 
  cooperativa: string;
  pa: string;
  enderecoEntrega: string;
  tipoCartao: string; 
  status: string; 
  dataCriacao: string; 
  previsaoEntrega?: string; 
  rastreio?: string; 
};

type HistoricoCartao = {
  id: number;
  numeroMascarado: string;
  dataEmissao: string;
  dataVencimento: string;
  tipoProduto: string;
  status: 'Ativo' | 'Vencido' | 'Cancelado' | 'Em Entrega';
};

// --- Mocks Atualizados ---
const mockKpiCartoes = { ativos: 8, bloqueados: 2, vencidos: 2 };

const mockListaDeCartoes: Cartao[] = [
  { id: 1, idCartao: '900101', cooperado: 'Fernanda Lima Santos', cooperativa: 'Crediserv', conta: '12345-6', numeroMascarado: '4984 **** **** 1001', tipo: 'classic', funcao: 'Multiplo', bandeira: 'VISA', limite: 6000, disponivel: 1200, validade: '12/11/2023', status: 'vencido' },
  { id: 2, idCartao: '900102', cooperado: 'Carlos Eduardo Souza', cooperativa: 'Coopesa', conta: '54321-0', numeroMascarado: '5200 **** **** 2045', tipo: 'gold', funcao: 'Credito', bandeira: 'MASTERCARD', limite: 12000, disponivel: 3600, validade: '12/11/2026', status: 'bloqueado_preventivo' },
  { id: 3, idCartao: '900103', cooperado: 'Ana Paula Ferreira', cooperativa: 'Crediserv', conta: '99887-1', numeroMascarado: '4001 **** **** 9988', tipo: 'infinite', funcao: 'Multiplo', bandeira: 'VISA', limite: 50000, disponivel: 20000, validade: '12/11/2031', status: 'ativo' },
  { id: 4, idCartao: '900104', cooperado: 'João Pedro Costa', cooperativa: 'Coopesa', conta: '77441-2', numeroMascarado: '4111 **** **** 1111', tipo: 'classic', funcao: 'Debito', bandeira: 'VISA', limite: 0, disponivel: 0, validade: '12/11/2030', status: 'ativo' },
  { id: 5, idCartao: '900105', cooperado: 'Maria Santos Oliveira', cooperativa: 'Coopesa', conta: '33221-X', numeroMascarado: '5500 **** **** 5500', tipo: 'platinum', funcao: 'Credito', bandeira: 'MASTERCARD', limite: 25000, disponivel: 15000, validade: '12/11/2029', status: 'ativo' },
];

const mockEntregaCartoes: CartaoEntrega[] = [
  { 
    id: 1, cooperado: 'Ana Beatriz Silva', cooperativa: 'Crediserv', pa: 'PA 05', 
    enderecoEntrega: 'Rua das Flores, 123, Centro - SP',
    tipoCartao: 'Visa Infinite', status: 'Em entrega', dataCriacao: '10/11/2025', previsaoEntrega: '20/11/2025', rastreio: 'BR123456789' 
  },
];

const mockHistoricoCartoes: HistoricoCartao[] = [
  { id: 1, numeroMascarado: '4111 11** **** 9988', dataEmissao: '10/01/2025', dataVencimento: '01/2030', tipoProduto: 'Visa Infinite', status: 'Ativo' },
  { id: 2, numeroMascarado: '4111 55** **** 5544', dataEmissao: '15/05/2024', dataVencimento: '05/2029', tipoProduto: 'Visa Platinum', status: 'Cancelado' },
  { id: 3, numeroMascarado: '4111 22** **** 1122', dataEmissao: '20/02/2020', dataVencimento: '02/2025', tipoProduto: 'Visa Gold', status: 'Vencido' },
  { id: 4, numeroMascarado: '4111 77** **** 7777', dataEmissao: '15/11/2025', dataVencimento: '11/2030', tipoProduto: 'Visa Infinite Metal', status: 'Em Entrega' },
];

const mockAnuidadeProdutos: ProdutoAnuidade[] = [
  { id: 1, nome: 'Infinite', valorTitular: 480.00, valorAdicional: 240.00 },
  { id: 2, nome: 'Black', valorTitular: 450.00, valorAdicional: 225.00 },
];

const mockRegrasDesconto: RegraDesconto[] = [
  { id: 1, gasto: 4000, desconto: 50, produto: 'Infinite' },
  { id: 2, gasto: 8000, desconto: 100, produto: 'Infinite' },
];

// MOCK DE CONFIGURAÇÕES (ATUALIZADO COM NOVOS CAMPOS)
const mockConfiguracoesProduto: ProdutoConfig[] = [
  { 
    id: 1, nome: 'Infinite', 
    multa: 2.0, mora: 10.00, juros: 1.5,
    percRotativo: 12.5, percSaque: 3.5, percJurosEmissor: 2.0, percJurosCrediario: 4.5, 
    percParcelamentoFatura: 5.0, percParcelamentoRotativo: 8.5, // Novo campo
    custosReposicao: [{ cooperativa: 'Crediserv', valor: 25.00 }, { cooperativa: 'Coopesa', valor: 30.00 }]
  },
  { 
    id: 2, nome: 'Platinum', 
    multa: 2.0, mora: 10.00, juros: 1.5,
    percRotativo: 13.5, percSaque: 4.0, percJurosEmissor: 2.2, percJurosCrediario: 4.8, 
    percParcelamentoFatura: 5.5, percParcelamentoRotativo: 9.0, // Novo campo
    custosReposicao: [{ cooperativa: 'Crediserv', valor: 20.00 }, { cooperativa: 'Coopesa', valor: 25.00 }]
  },
  { 
    id: 3, nome: 'Gold', 
    multa: 2.0, mora: 10.00, juros: 1.5,
    percRotativo: 14.5, percSaque: 4.5, percJurosEmissor: 2.5, percJurosCrediario: 5.0, 
    percParcelamentoFatura: 6.0, percParcelamentoRotativo: 10.0, // Novo campo
    custosReposicao: [{ cooperativa: 'Crediserv', valor: 15.00 }, { cooperativa: 'Coopesa', valor: 15.00 }]
  },
  { 
    id: 4, nome: 'Empresarial', 
    multa: 2.0, mora: 15.00, juros: 2.0,
    percRotativo: 11.5, percSaque: 3.0, percJurosEmissor: 1.8, percJurosCrediario: 4.0, 
    percParcelamentoFatura: 4.5, percParcelamentoRotativo: 7.5, // Novo campo
    custosReposicao: [{ cooperativa: 'Crediserv', valor: 35.00 }, { cooperativa: 'Coopesa', valor: 40.00 }]
  }
];

type CartoesViewMode = 'lista' | 'upgrade' | 'anuidade_cooperado' | 'anuidade_produto' | 'configuracoes_produto' | 'acompanhar_entrega';

// --- Componente PAI da Página Cartões ---
function PaginaCartoes({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] = useState<CartoesViewMode>('lista');

  const renderView = () => {
    switch (viewMode) {
      case 'lista': return <ViewListaPrincipalCartoes kpis={mockKpiCartoes} cartoes={mockListaDeCartoes} usuario={usuario} />;
      case 'acompanhar_entrega': return <ViewAcompanharEntrega entregas={mockEntregaCartoes} />;
      case 'upgrade': return <ViewUpgradeDowngrade />;
      case 'anuidade_cooperado': return <ViewAnuidadeCooperado />;
      case 'anuidade_produto': return <ViewAnuidadeProduto />;
      case 'configuracoes_produto': return <ViewConfiguracoesProduto />;
      default: return <ViewListaPrincipalCartoes kpis={mockKpiCartoes} cartoes={mockListaDeCartoes} usuario={usuario} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1">
        <SubMenuButton label="Gestão de Cartões" active={viewMode === 'lista'} onClick={() => setViewMode('lista')} />
        <SubMenuButton label="Acompanhar Entrega" active={viewMode === 'acompanhar_entrega'} onClick={() => setViewMode('acompanhar_entrega')} />
        <SubMenuButton label="Upgrade/Downgrade" active={viewMode === 'upgrade'} onClick={() => setViewMode('upgrade')} />
        <SubMenuButton label="Anuidade (Cooperado)" active={viewMode === 'anuidade_cooperado'} onClick={() => setViewMode('anuidade_cooperado')} />
        <SubMenuButton label="Anuidade (Produto)" active={viewMode === 'anuidade_produto'} onClick={() => setViewMode('anuidade_produto')} />
        <SubMenuButton label="Configurações" active={viewMode === 'configuracoes_produto'} onClick={() => setViewMode('configuracoes_produto')} />
      </div>
      <div>{renderView()}</div>
    </div>
  );
}

// --- View 1: Lista Principal ---
function ViewListaPrincipalCartoes({ kpis, cartoes, usuario }: { kpis: typeof mockKpiCartoes; cartoes: Cartao[]; usuario: User }) {
  const [statusFilter, setStatusFilter] = useState('todos');
  const [filtroCoop, setFiltroCoop] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartaoSelecionado, setCartaoSelecionado] = useState<Cartao | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const cartoesFiltrados = cartoes.filter(c => {
    const matchText = c.cooperado.toLowerCase().includes(searchTerm.toLowerCase()) || c.idCartao.includes(searchTerm) || c.numeroMascarado.includes(searchTerm);
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter;
    const matchCoop = filtroCoop === '' || c.cooperativa === filtroCoop;
    return matchText && matchStatus && matchCoop;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Cartões Ativos" value={kpis.ativos.toString()} change="" changeType="info" icon={CreditCard} />
        <KpiCard title="Cartões Bloqueados" value={kpis.bloqueados.toString()} change="" changeType="info" icon={ShieldAlert} />
        <KpiCard title="Cartões Vencidos" value={kpis.vencidos.toString()} change="" changeType="info" icon={AlertCircle} />
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Busca</label>
            <div className="relative">
               <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nome, ID ou cartão..." className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm" />
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cooperativa</label>
            <select value={filtroCoop} onChange={(e) => setFiltroCoop(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">Todas</option>
              <option value="Coopesa">Coopesa</option>
              <option value="Crediserv">Crediserv</option>
            </select>
          </div>
          <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="todos">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="bloqueado_preventivo">Bloqueado</option>
                <option value="vencido">Vencido</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID / Cartão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cooperado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limite / Disp.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cartoesFiltrados.map((cartao) => (
                <tr key={cartao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">#{cartao.idCartao}</div>
                    <div className="text-xs text-gray-500 font-mono">{cartao.numeroMascarado}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cartao.cooperado}</div>
                    <div className="text-xs text-gray-500">{cartao.cooperativa} | {cartao.conta}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-bold text-gray-800">{cartao.limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <div className="text-xs text-green-600">{cartao.disponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${cartao.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cartao.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => { 
                        setCartaoSelecionado(cartao); 
                        setModalOpen(true); 
                      }} 
                      className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
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
      
      {modalOpen && cartaoSelecionado && (
        <ModalDetalheCartao 
          cartao={cartaoSelecionado} 
          onClose={() => setModalOpen(false)} 
          onUpdate={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
}

// --- Componente Modal Detalhe ---
function ModalDetalheCartao({ cartao, onClose, onUpdate }: { cartao: Cartao; onClose: () => void; onUpdate: (s: string) => void }) {
  const [novoStatus, setNovoStatus] = useState(cartao.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center pb-4 border-b mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Detalhes do Cartão</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Bloco Visual do Cartão */}
          <div className="col-span-2 md:col-span-1 flex justify-center items-center bg-gray-100 rounded-lg p-4">
             <div className="w-full h-40 bg-gray-800 rounded-xl p-5 flex flex-col justify-between text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20"><CreditCard className="w-24 h-24" /></div>
                <div className="flex justify-between items-center z-10">
                  <span className="text-lg font-bold">{cartao.bandeira}</span>
                  <span className="text-xs uppercase">{cartao.tipo}</span>
                </div>
                <div className="mt-4 z-10">
                  <p className="text-sm tracking-widest font-mono">{cartao.numeroMascarado}</p>
                  <p className="text-xs mt-2 opacity-75">VALIDADE {cartao.validade}</p>
                  <p className="text-md font-medium tracking-wider mt-1 uppercase truncate">{cartao.cooperado}</p>
                </div>
             </div>
          </div>

          {/* Dados Detalhados */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div><label className="text-xs text-gray-500">ID Interno</label><p className="font-medium">{cartao.idCartao}</p></div>
            <div><label className="text-xs text-gray-500">Conta Corrente</label><p className="font-medium">{cartao.conta}</p></div>
            <div><label className="text-xs text-gray-500">Função</label><p className="font-medium">{cartao.funcao}</p></div>
            <div><label className="text-xs text-gray-500">Cooperativa</label><p className="font-medium">{cartao.cooperativa}</p></div>
            <div><label className="text-xs text-gray-500">Limite Total</label><p className="font-bold text-hub-teal">{cartao.limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
          </div>
        </div>

        {/* Área de Ação (Status) */}
        <div className="mt-8 pt-4 border-t border-gray-100">
           <h4 className="text-sm font-bold text-gray-700 mb-2">Gerenciar Status</h4>
           <div className="flex items-center space-x-4">
              <select 
                value={novoStatus} 
                onChange={(e) => setNovoStatus(e.target.value as CartaoStatus)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="ativo">Ativo</option>
                <option value="bloqueado_preventivo">Bloqueado Preventivo</option>
                <option value="cancelado">Cancelado (Perda/Roubo)</option>
              </select>
              <button 
                onClick={() => onUpdate(novoStatus)}
                className="px-6 py-2 text-white rounded-md shadow hover:opacity-90 transition font-medium"
                style={{ backgroundColor: HUB_BRAND_COLOR }}
              >
                Salvar Alteração
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- View 2: Acompanhar Entrega ---
function ViewAcompanharEntrega({ entregas }: { entregas: CartaoEntrega[] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Rastreamento de Cartões</h3>
        <p className="text-sm text-gray-500">Status de produção e entrega.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cooperado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem (Coop/PA)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cartão / Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço de Entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status / Rastreio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entregas.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.cooperado}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{item.cooperativa}</div>
                  <div className="text-xs font-mono">{item.pa}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="font-bold">{item.tipoCartao}</div>
                  <div className="text-xs">Solicitado: {item.dataCriacao}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={item.enderecoEntrega}>
                  {item.enderecoEntrega}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                   <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">{item.status}</span>
                   {item.rastreio && <div className="text-xs mt-1 font-mono text-gray-500">{item.rastreio}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- View 3: Upgrade/Downgrade ---
function ViewUpgradeDowngrade() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cooperadoEncontrado, setCooperadoEncontrado] = useState(false);

  const handleSearch = () => { if (searchTerm.length > 3) setCooperadoEncontrado(true); };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Vencido': return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelado': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Em Entrega': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Solicitar Upgrade ou Downgrade</h3>
        <div className="flex space-x-2 max-w-lg mt-4">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Buscar por nome ou CPF..." 
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal" 
          />
          <button 
            onClick={handleSearch} 
            className="px-4 py-2 text-white rounded-lg shadow-sm hover:opacity-90 transition"
            style={{ backgroundColor: HUB_BRAND_COLOR }}
          >
            Buscar
          </button>
        </div>
      </div>

      {cooperadoEncontrado && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h4 className="text-lg font-bold text-gray-800">Histórico de Cartões - Ana Beatriz Silva</h4>
            <button 
              className="flex items-center px-4 py-2 text-white rounded-lg shadow-sm hover:opacity-90 transition"
              style={{ backgroundColor: HUB_BRAND_COLOR }}
            >
              <ArrowDownUp className="w-4 h-4 mr-2" /> Nova Solicitação
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-white border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emissão</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockHistoricoCartoes.map((hist) => (
                  <tr key={hist.id}>
                    <td className="px-6 py-4 text-sm font-medium">{hist.tipoProduto}</td>
                    <td className="px-6 py-4 text-sm font-mono">{hist.numeroMascarado}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{hist.dataEmissao}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{hist.dataVencimento}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getStatusBadge(hist.status)}`}>{hist.status.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// --- View 4: Anuidade (Cooperado) ---
function ViewAnuidadeCooperado() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cooperado, setCooperado] = useState<any | null>(null);

  const handleSearch = () => {
    if (searchTerm) setCooperado({ 
      nome: 'Ana Beatriz Silva', cpf: '123.***.***-00', produto: 'Visa Infinite',
      dataCobranca: '10/01/2025', parcelas: 12, totalContratado: 480.00, valorPendente: 360.00 
    });
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Gestão de Anuidade por Cooperado</h3>
      <div className="flex space-x-2 mb-6">
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Buscar por nome ou CPF..." 
          className="w-full max-w-md pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal" 
        />
        <button 
          onClick={handleSearch} 
          className="px-4 py-2 text-white rounded-lg shadow-sm hover:opacity-90 transition"
          style={{ backgroundColor: HUB_BRAND_COLOR }}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {cooperado && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-start border-b pb-4 mb-4">
             <div><h4 className="text-lg font-bold text-gray-800">{cooperado.nome}</h4><p className="text-sm text-gray-500">{cooperado.cpf}</p></div>
             <div className="text-right">
               <span className="text-white text-xs px-2 py-1 rounded" style={{ backgroundColor: HUB_BRAND_COLOR }}>
                 {cooperado.produto}
               </span>
             </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div><label className="text-xs text-gray-500 uppercase">Data Cobrança</label><p className="font-medium">{cooperado.dataCobranca}</p></div>
             <div><label className="text-xs text-gray-500 uppercase">Parcelamento</label><p className="font-medium">{cooperado.parcelas}x</p></div>
             <div><label className="text-xs text-gray-500 uppercase">Total Contratado</label><p className="font-bold text-green-700">R$ {cooperado.totalContratado.toFixed(2)}</p></div>
             <div><label className="text-xs text-gray-500 uppercase">Valor Pendente</label><p className="font-bold text-red-700">R$ {cooperado.valorPendente.toFixed(2)}</p></div>
          </div>
          <div className="mt-6 flex justify-end">
             <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100 text-gray-700">
               <Edit2 className="w-4 h-4 mr-2"/> Renegociar
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- View 5: Anuidade Produto ---
function ViewAnuidadeProduto() {
  const [anuidades, setAnuidades] = useState(mockAnuidadeProdutos);
  const [regras, setRegras] = useState(mockRegrasDesconto);

  const handleAnuidadeChange = (id: number, campo: 'valorTitular' | 'valorAdicional', valor: number) => {
    setAnuidades(anuidades.map(a => a.id === id ? { ...a, [campo]: valor } : a));
  };

  const addRegra = () => {
    setRegras([...regras, { id: Date.now(), gasto: 0, desconto: 0, produto: 'Selecione...' }]);
  };

  const addProduto = () => {
    setAnuidades([...anuidades, { id: Date.now(), nome: 'Novo Produto', valorTitular: 0, valorAdicional: 0 }]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-xl font-semibold text-gray-800">Anuidade Base por Produto</h3>
           <button 
             onClick={addProduto} 
             className="p-2 text-white rounded-full shadow-sm hover:opacity-90 transition"
             style={{ backgroundColor: HUB_BRAND_COLOR }}
             title="Adicionar Produto"
           >
             <Plus className="w-5 h-5" />
           </button>
        </div>
        <div className="space-y-4">
          {anuidades.map(prod => (
            <div key={prod.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-lg font-medium text-gray-800 mb-3">{prod.nome}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Valor Titular (R$)</label>
                  <input type="number" value={prod.valorTitular} onChange={(e) => handleAnuidadeChange(prod.id, 'valorTitular', parseFloat(e.target.value))} className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-hub-teal outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Valor Adicional (R$)</label>
                  <input type="number" value={prod.valorAdicional} onChange={(e) => handleAnuidadeChange(prod.id, 'valorAdicional', parseFloat(e.target.value))} className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-hub-teal outline-none" />
                </div>
              </div>
            </div>
          ))}
          <button className="w-full px-4 py-2 text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition">
            <Save className="w-5 h-5 inline mr-2" /> Salvar Anuidades
          </button>
        </div>
      </div>

      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-xl font-semibold text-gray-800">Regras de Desconto</h3>
           <button 
             onClick={addRegra} 
             className="p-2 text-white rounded-full shadow-sm hover:opacity-90 transition"
             style={{ backgroundColor: HUB_BRAND_COLOR }}
             title="Adicionar Regra"
           >
             <Plus className="w-5 h-5" />
           </button>
        </div>
        <div className="space-y-2">
          {regras.map((regra, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
              <div className="flex-1">
                 <label className="text-[10px] text-gray-500 block">Gasto Mensal</label>
                 <input type="number" value={regra.gasto} className="w-full px-1 border rounded text-sm focus:ring-1 focus:ring-hub-teal outline-none" onChange={(e) => { const newRegras = [...regras]; newRegras[idx].gasto = parseFloat(e.target.value); setRegras(newRegras); }} />
              </div>
              <div className="w-20">
                 <label className="text-[10px] text-gray-500 block">Desc (%)</label>
                 <input type="number" value={regra.desconto} className="w-full px-1 border rounded text-sm focus:ring-1 focus:ring-hub-teal outline-none" onChange={(e) => { const newRegras = [...regras]; newRegras[idx].desconto = parseFloat(e.target.value); setRegras(newRegras); }} />
              </div>
              <div className="flex-1">
                 <label className="text-[10px] text-gray-500 block">Produto</label>
                 <input type="text" value={regra.produto} className="w-full px-1 border rounded text-sm focus:ring-1 focus:ring-hub-teal outline-none" onChange={(e) => { const newRegras = [...regras]; newRegras[idx].produto = e.target.value; setRegras(newRegras); }} />
              </div>
            </div>
          ))}
          <button className="w-full px-4 py-2 mt-4 text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition">
            <Save className="w-5 h-5 inline mr-2" /> Salvar Regras
          </button>
        </div>
      </div>
    </div>
  );
}

// --- View 6: Configurações do Produto (ATUALIZADA - NOVOS CAMPOS) ---
function ViewConfiguracoesProduto() {
  const [configs, setConfigs] = useState(mockConfiguracoesProduto);

  const updateVal = (id: number, field: keyof ProdutoConfig, val: string) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, [field]: parseFloat(val) || 0 } : c));
  };

  const addConfig = () => {
    setConfigs([...configs, {
      id: Date.now(), nome: 'Novo Produto', multa: 0, mora: 0, juros: 0,
      percRotativo: 0, percSaque: 0, percJurosEmissor: 0, percJurosCrediario: 0, 
      percParcelamentoFatura: 0, percParcelamentoRotativo: 0,
      custosReposicao: [{ cooperativa: 'Padrão', valor: 0 }]
    }]);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-xl shadow-lg flex justify-between items-center">
        <div>
           <h3 className="text-xl font-semibold text-gray-800">Configurações Financeiras por Produto</h3>
           <p className="text-sm text-gray-500">Defina as taxas e custos para Gold, Platinum, Infinite e Empresarial.</p>
        </div>
        <button 
          onClick={addConfig} 
          className="p-2 text-white rounded-full shadow-sm hover:opacity-90 transition"
          style={{ backgroundColor: HUB_BRAND_COLOR }}
          title="Adicionar Produto"
        >
          <Plus className="w-6 h-6"/>
        </button>
      </div>
      
      <div className="space-y-6">
        {configs.map((prod) => (
          <div key={prod.id} className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
               <div className="p-2 rounded mr-3 text-white" style={{ backgroundColor: HUB_BRAND_COLOR }}>
                 <CreditCard className="w-5 h-5"/> 
               </div>
               <h4 className="text-lg font-bold text-gray-800 uppercase">{prod.nome}</h4>
            </div>
            
            {/* Taxas Gerais */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
               <div><label className="text-xs text-gray-500 font-bold block mb-1">Multa (%)</label><input type="number" value={prod.multa} onChange={(e) => updateVal(prod.id, 'multa', e.target.value)} className="w-full border rounded p-2 bg-gray-50" /></div>
               <div><label className="text-xs text-gray-500 font-bold block mb-1">Mora (R$)</label><input type="number" value={prod.mora} onChange={(e) => updateVal(prod.id, 'mora', e.target.value)} className="w-full border rounded p-2 bg-gray-50" /></div>
               <div><label className="text-xs text-gray-500 font-bold block mb-1">Juros Rotativo (%)</label><input type="number" value={prod.percRotativo} onChange={(e) => updateVal(prod.id, 'percRotativo', e.target.value)} className="w-full border rounded p-2 bg-gray-50" /></div>
               <div><label className="text-xs text-gray-500 font-bold block mb-1">Taxa Saque (%)</label><input type="number" value={prod.percSaque} onChange={(e) => updateVal(prod.id, 'percSaque', e.target.value)} className="w-full border rounded p-2 bg-gray-50" /></div>
               
               {/* Novos Campos */}
               <div>
                 <label className="text-xs text-gray-500 font-bold block mb-1">Refinanciamento de fatura(%)</label>
                 <input type="number" value={prod.percParcelamentoFatura} onChange={(e) => updateVal(prod.id, 'percParcelamentoFatura', e.target.value)} className="w-full border rounded p-2 bg-gray-50" />
               </div>
               <div>
                 <label className="text-xs text-gray-500 font-bold block mb-1">Juros Parc. Rotativo (%)</label>
                 <input type="number" value={prod.percParcelamentoRotativo} onChange={(e) => updateVal(prod.id, 'percParcelamentoRotativo', e.target.value)} className="w-full border rounded p-2 bg-gray-50" />
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               <div className="bg-blue-50 p-3 rounded border border-blue-100">
                 <label className="text-xs text-blue-800 font-bold block mb-1">Juros Emissor (%)</label>
                 <input type="number" value={prod.percJurosEmissor} onChange={(e) => updateVal(prod.id, 'percJurosEmissor', e.target.value)} className="w-full border rounded p-2" />
               </div>
               <div className="bg-blue-50 p-3 rounded border border-blue-100">
                 <label className="text-xs text-blue-800 font-bold block mb-1">Juros Crediário (%)</label>
                 <input type="number" value={prod.percJurosCrediario} onChange={(e) => updateVal(prod.id, 'percJurosCrediario', e.target.value)} className="w-full border rounded p-2" />
               </div>
            </div>

            {/* Custo de Reposição por Cooperativa */}
            <div className="mt-4">
               <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-bold text-gray-700">Valor de Reposição de Cartão (Por Cooperativa)</h5>
                  <button className="text-xs font-bold hover:underline" style={{ color: HUB_BRAND_COLOR }}>+ Adicionar Coop</button>
               </div>
               <div className="bg-gray-50 border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-200 text-gray-600"><tr><th className="p-2 font-bold">Cooperativa</th><th className="p-2 font-bold">Valor (R$)</th></tr></thead>
                    <tbody>
                      {prod.custosReposicao.map((custo, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="p-2">{custo.cooperativa}</td>
                          <td className="p-2"><input type="number" defaultValue={custo.valor} className="w-24 border rounded p-1 bg-white" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end pb-8">
           <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 flex items-center"><Save className="w-5 h-5 mr-2"/> Salvar Todas as Configurações</button>
        </div>
      </div>
    </div>
  );
}

function SubMenuButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${active ? 'border-b-2 border-hub-teal text-hub-teal' : 'text-gray-500 hover:text-gray-700'}`}>
      {label}
    </button>
  );
}
// =======================================================================
// 11. A PÁGINA DE TRANSAÇÕES (ATUALIZADA COM LIMITE DISPONÍVEL)
// =======================================================================

// --- Definição de Tipos para Transações ---
type KpiTransacoes = {
  total: number;
  aprovadas: number;
  negadas: number;
  volume: number;
};

type TransacaoStatus = 'aprovada' | 'reprovada';
type ModalidadeTransacao = 'Debito' | 'Credito';
type PlanoVenda = 'A Vista' | 'Parcelado Emissor' | 'Parcelado Crediario' | '-';

type TransacaoDetalhe = {
  id: number;
  dataHora: string; // Formato DD/MM/YYYY HH:mm
  cooperado: string;
  
  // Novos Campos Solicitados
  modalidade: ModalidadeTransacao;
  planoVenda: PlanoVenda;
  parcelas?: number; // Ex: 12
  
  numeroCartaoMascarado: string; // 6 primeiros + 4 últimos
  idCartao: string;
  contaCorrente: string;
  
  cooperativa: string;
  pa: string;
  
  valor: number;
  limiteDisponivelMomento: number; // NOVO CAMPO SOLICITADO
  status: TransacaoStatus;
  motivoReprovacao?: string; // "-" se aprovada
  
  // Campos Detalhes
  estabelecimento: string;
  formaPagamento: string; // Chip, Contactless, Online
  nsu: string;
  codigoAutorizacao: string;
  mcc: string; // Categoria do estabelecimento
};

// --- Dados Mockados da Página Transações ---
const mockKpiTransacoes: KpiTransacoes = {
  total: 452,
  aprovadas: 410,
  negadas: 42,
  volume: 154300.50,
};

const mockListaDeTransacoes: TransacaoDetalhe[] = [
  { 
    id: 1, dataHora: '17/11/2025 14:30', cooperado: 'Ana Beatriz Silva', 
    modalidade: 'Credito', planoVenda: 'Parcelado Emissor', parcelas: 10,
    numeroCartaoMascarado: '411111 ****** 1111', idCartao: '900103', contaCorrente: '12345-6',
    cooperativa: 'Crediserv', pa: 'PA 05',
    valor: 2500.00, limiteDisponivelMomento: 18000.00, // Limite era alto
    status: 'aprovada', motivoReprovacao: '-',
    estabelecimento: 'Magalu E-commerce', formaPagamento: 'Online/Token', nsu: '123456', codigoAutorizacao: 'AUT889', mcc: '5732'
  },
  { 
    id: 2, dataHora: '17/11/2025 12:15', cooperado: 'Carlos Eduardo Souza', 
    modalidade: 'Debito', planoVenda: 'A Vista', parcelas: 1,
    numeroCartaoMascarado: '550000 ****** 2045', idCartao: '900102', contaCorrente: '54321-0',
    cooperativa: 'Coopesa', pa: 'PA 03',
    valor: 45.90, limiteDisponivelMomento: 3400.50, // Saldo em conta (exemplo para débito)
    status: 'aprovada', motivoReprovacao: '-',
    estabelecimento: 'Padaria Pão Quente', formaPagamento: 'Contactless', nsu: '654321', codigoAutorizacao: 'AUT112', mcc: '5462'
  },
  { 
    id: 3, dataHora: '16/11/2025 19:40', cooperado: 'Fernanda Lima Santos', 
    modalidade: 'Credito', planoVenda: 'A Vista', parcelas: 1,
    numeroCartaoMascarado: '498400 ****** 1001', idCartao: '900101', contaCorrente: '99887-1',
    cooperativa: 'Crediserv', pa: 'PA 05',
    valor: 12000.00, limiteDisponivelMomento: 1500.00, // Limite insuficiente
    status: 'reprovada', motivoReprovacao: 'Saldo Insuficiente',
    estabelecimento: 'Joalheria Ouro Fino', formaPagamento: 'Chip/Senha', nsu: '789012', codigoAutorizacao: '-', mcc: '5944'
  },
  { 
    id: 4, dataHora: '16/11/2025 10:00', cooperado: 'João Pedro Costa', 
    modalidade: 'Credito', planoVenda: 'Parcelado Crediario', parcelas: 24,
    numeroCartaoMascarado: '411100 ****** 9988', idCartao: '900104', contaCorrente: '77441-2',
    cooperativa: 'Coopesa', pa: 'PA 04',
    valor: 5400.00, limiteDisponivelMomento: 10000.00,
    status: 'aprovada', motivoReprovacao: '-',
    estabelecimento: 'Material de Construção Silva', formaPagamento: 'Chip/Senha', nsu: '345678', codigoAutorizacao: 'AUT777', mcc: '5211'
  },
];

const categoriasContestacao = [
  "Desacordo comercial - Cartão presente (chip / senha)",
  "Desacordo comercial - Cartão não-presente (compra e-commerce / APP / CVV2)",
  "Erro de Processamento",
  "Não reconhecida - Cartão Não-Presente",
  "Saque - Cédulas não liberadas",
  "Não reconhecido",
];

// --- Componente PAI da Página Transações ---
type TransacoesViewMode = 'lista' | 'contestar';

function PaginaTransacoes({ usuario }: { usuario: User }) {
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
      <div>{renderView()}</div>
    </div>
  );
}

// --- View 1: Lista Principal de Transações ---
function ViewListaTransacoes({ kpis, transacoes }: { kpis: KpiTransacoes; transacoes: TransacaoDetalhe[] }) {
  // Filtros
  const [filtroCoop, setFiltroCoop] = useState('');
  const [filtroPA, setFiltroPA] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Detalhes
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<TransacaoDetalhe | null>(null);

  // Lógica de Filtragem
  const transacoesFiltradas = transacoes.filter(tx => {
    // Busca Textual (Nome, Cartão, ID Cartão, Conta)
    const matchSearch = 
      tx.cooperado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.numeroCartaoMascarado.includes(searchTerm) ||
      tx.idCartao.includes(searchTerm) ||
      tx.contaCorrente.includes(searchTerm);

    // Filtro Coop
    const matchCoop = filtroCoop === '' || tx.cooperativa === filtroCoop;
    
    // Filtro PA
    const matchPA = filtroPA === '' || tx.pa === filtroPA;

    // Filtro Data (Lógica simples de string para o Mock DD/MM/YYYY)
    let matchData = true;
    if (dataInicio && dataFim) {
        matchData = true; // Simplificado para o exemplo
    }

    return matchSearch && matchCoop && matchPA && matchData;
  });

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Transações" value={kpis.total.toString()} change="" changeType="info" icon={List} />
        <KpiCard title="Aprovadas" value={kpis.aprovadas.toString()} change="" changeType="info" icon={CheckCircle2} />
        <KpiCard title="Reprovadas" value={kpis.negadas.toString()} change="" changeType="info" icon={XCircle} />
        <KpiCard title="Volume Total" value={kpis.volume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} change="" changeType="info" icon={BarChart2} />
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Transações</h3>
            <p className="text-sm text-gray-500">Histórico detalhado de autorizações.</p>
          </div>
          <div className="flex items-center space-x-2">
             <ExportarDropdown />
          </div>
        </div>

        {/* --- BARRA DE FILTROS --- */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
             <label className="text-xs font-semibold text-gray-500">Busca Geral</label>
             <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, Cartão, ID ou Conta"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
          </div>
          <div>
             <label className="text-xs font-semibold text-gray-500">Cooperativa</label>
             <select 
               value={filtroCoop}
               onChange={(e) => setFiltroCoop(e.target.value)}
               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
             >
               <option value="">Todas</option>
               <option value="Crediserv">Crediserv</option>
               <option value="Coopesa">Coopesa</option>
             </select>
          </div>
          <div>
             <label className="text-xs font-semibold text-gray-500">PA</label>
             <select 
               value={filtroPA}
               onChange={(e) => setFiltroPA(e.target.value)}
               className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
             >
               <option value="">Todos</option>
               <option value="PA 03">PA 03</option>
               <option value="PA 04">PA 04</option>
               <option value="PA 05">PA 05</option>
             </select>
          </div>
          <div>
             <label className="text-xs font-semibold text-gray-500">Data Início</label>
             <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div>
             <label className="text-xs font-semibold text-gray-500">Data Fim</label>
             <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
        </div>

        {/* --- TABELA ATUALIZADA --- */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cooperado / Conta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cartão / ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo Compra</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coop / PA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Detalhes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacoesFiltradas.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">{tx.dataHora}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs font-bold text-gray-900">{tx.cooperado}</div>
                    <div className="text-xs text-gray-500">CC: {tx.contaCorrente}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs font-mono text-gray-700">{tx.numeroCartaoMascarado}</div>
                    <div className="text-xs text-gray-400">ID: {tx.idCartao}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                     <span className={`text-xs font-semibold ${tx.modalidade === 'Credito' ? 'text-purple-600' : 'text-blue-600'}`}>
                        {tx.modalidade.toUpperCase()}
                     </span>
                     {tx.modalidade === 'Credito' && tx.planoVenda !== 'A Vista' && (
                        <div className="text-[10px] text-gray-500 mt-0.5">
                           {tx.parcelas}x ({tx.planoVenda.replace('Parcelado ', '')})
                        </div>
                     )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                     {tx.cooperativa} / {tx.pa}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-gray-800">
                     {tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase rounded-full ${
                      tx.status === 'aprovada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {tx.status === 'aprovada' ? '-' : <span className="text-red-600 font-medium">{tx.motivoReprovacao}</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button 
                      onClick={() => setTransacaoSelecionada(tx)}
                      className="text-gray-400 hover:text-hub-teal transition-colors"
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
      
      {/* Modal de Detalhes da Transação */}
      {transacaoSelecionada && (
        <ModalDetalheTransacao 
           tx={transacaoSelecionada} 
           onClose={() => setTransacaoSelecionada(null)} 
        />
      )}
    </div>
  );
}

// --- Componente Modal Detalhes da Transação (Novo) ---
function ModalDetalheTransacao({ tx, onClose }: { tx: TransacaoDetalhe; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Receipt className="w-6 h-6 mr-2 text-hub-teal"/> Detalhes da Transação #{tx.nsu}
          </h3>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           {/* Bloco Valor e Status */}
           <div className="col-span-2 bg-gray-50 p-4 rounded-lg flex justify-between items-center border">
              <div>
                <p className="text-sm text-gray-500 uppercase font-bold">Valor da Compra</p>
                <p className="text-3xl font-bold text-gray-900">{tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                {/* --- CAMPO NOVO: LIMITE DISPONÍVEL NO MOMENTO --- */}
                <p className="text-xs text-gray-500 mt-1">
                  Limite Disp. na Compra: <span className="font-semibold text-gray-700">{tx.limiteDisponivelMomento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase font-bold">Status</p>
                <span className={`text-lg font-bold px-3 py-1 rounded-full ${tx.status === 'aprovada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {tx.status.toUpperCase()}
                </span>
                {tx.status === 'reprovada' && <p className="text-xs text-red-600 mt-1 font-bold">{tx.motivoReprovacao}</p>}
              </div>
           </div>

           {/* Bloco Cartão e Cooperado */}
           <div className="space-y-4">
              <h4 className="font-bold text-gray-700 border-b pb-1">Dados do Pagamento</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div><span className="block text-gray-500 text-xs">Cartão</span> <span className="font-mono">{tx.numeroCartaoMascarado}</span></div>
                 <div><span className="block text-gray-500 text-xs">ID Cartão</span> <span>{tx.idCartao}</span></div>
                 <div><span className="block text-gray-500 text-xs">Modalidade</span> <span className="font-semibold">{tx.modalidade}</span></div>
                 <div><span className="block text-gray-500 text-xs">Plano</span> <span>{tx.planoVenda}</span></div>
                 {tx.parcelas && <div><span className="block text-gray-500 text-xs">Parcelas</span> <span>{tx.parcelas}x</span></div>}
                 <div><span className="block text-gray-500 text-xs">Entrada</span> <span>{tx.formaPagamento}</span></div>
              </div>
           </div>

           {/* Bloco Origem e Estabelecimento */}
           <div className="space-y-4">
              <h4 className="font-bold text-gray-700 border-b pb-1">Origem e Destino</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="col-span-2"><span className="block text-gray-500 text-xs">Cooperado</span> <span className="font-semibold">{tx.cooperado}</span></div>
                 <div><span className="block text-gray-500 text-xs">Conta Corrente</span> <span>{tx.contaCorrente}</span></div>
                 <div><span className="block text-gray-500 text-xs">Cooperativa/PA</span> <span>{tx.cooperativa} / {tx.pa}</span></div>
                 <div className="col-span-2 mt-2 pt-2 border-t border-dashed">
                    <span className="block text-gray-500 text-xs">Estabelecimento</span> 
                    <span className="font-bold text-gray-800">{tx.estabelecimento}</span>
                    <span className="text-xs text-gray-400 block">MCC: {tx.mcc}</span>
                 </div>
              </div>
           </div>
           
           {/* Bloco Técnico */}
           <div className="col-span-2 bg-gray-100 p-3 rounded text-xs font-mono text-gray-600 flex justify-between">
              <span>Data/Hora: {tx.dataHora}</span>
              <span>NSU: {tx.nsu}</span>
              <span>Auth: {tx.codigoAutorizacao}</span>
           </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// --- View 2: Formulário de Contestação ---
function ViewFormContestacao() {
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
// 12. A PÁGINA DE FATURAS (ATUALIZADA COM NOVAS COLUNAS E ABA VENCIMENTO)
// =======================================================================

type Fatura = {
  id: number;
  cooperado: string;
  referencia: string;
  vencimento: string;
  status: 'aberta' | 'paga' | 'vencida';
  
  // Novos Campos Solicitados
  valorTotal: number;
  valorPago: number;
  valorEmAberto: number;
  contaCorrente: string;
  cooperativa: string;
  pa: string;
  valorLimite: number;     // Limite total atribuído
  valorDisponivel: number; // Quanto ainda pode gastar
  diasAtraso?: number;
};

const mockKpiFaturas = {
  total: 6,
  abertas: 6,
  vencidas: 0,
  aReceber: 7000.00,
};

const mockListaDeFaturas: Fatura[] = [
  { 
    id: 1, cooperado: 'Fernanda Lima Santos', referencia: '11/2025', vencimento: '24/11/2025', status: 'aberta',
    valorTotal: 1150.00, valorPago: 0.00, valorEmAberto: 1150.00,
    contaCorrente: '12345-6', cooperativa: 'Crediserv', pa: 'PA 05',
    valorLimite: 5000.00, valorDisponivel: 3850.00
  },
  { 
    id: 2, cooperado: 'Carlos Eduardo Souza', referencia: '11/2025', vencimento: '24/11/2025', status: 'aberta',
    valorTotal: 2500.00, valorPago: 500.00, valorEmAberto: 2000.00,
    contaCorrente: '54321-0', cooperativa: 'Coopesa', pa: 'PA 03',
    valorLimite: 8000.00, valorDisponivel: 1200.00
  },
  { 
    id: 3, cooperado: 'Ana Paula Ferreira', referencia: '11/2025', vencimento: '24/11/2025', status: 'vencida',
    valorTotal: 3000.00, valorPago: 0.00, valorEmAberto: 3000.00, diasAtraso: 5,
    contaCorrente: '99887-1', cooperativa: 'Crediserv', pa: 'PA 05',
    valorLimite: 10000.00, valorDisponivel: 500.00
  },
  { 
    id: 4, cooperado: 'João Pedro Costa', referencia: '11/2025', vencimento: '10/11/2025', status: 'paga',
    valorTotal: 150.00, valorPago: 150.00, valorEmAberto: 0.00,
    contaCorrente: '77441-2', cooperativa: 'Coopesa', pa: 'PA 04',
    valorLimite: 2000.00, valorDisponivel: 1850.00
  },
];

function PaginaFaturas({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<'lista' | 'vencimento'>('lista');

  return (
    <div className="space-y-6">
      {/* Menu de Abas */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('lista')}
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'lista' ? 'border-b-2 border-hub-teal text-hub-teal' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Listagem de Faturas
        </button>
        <button 
          onClick={() => setActiveTab('vencimento')}
          className={`px-4 py-3 text-sm font-medium ${activeTab === 'vencimento' ? 'border-b-2 border-hub-teal text-hub-teal' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Alterar Vencimento
        </button>
      </div>

      {activeTab === 'lista' ? (
        <ViewListagemFaturas />
      ) : (
        <ViewAlterarVencimento />
      )}
    </div>
  );
}

// --- Sub-componente: Listagem (Tabela Completa) ---
function ViewListagemFaturas() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Faturas" value={mockKpiFaturas.total.toString()} change="" changeType="info" icon={File} />
        <KpiCard title="Faturas Abertas" value={mockKpiFaturas.abertas.toString()} change="" changeType="info" icon={Clock} />
        <KpiCard title="Faturas Vencidas" value={mockKpiFaturas.vencidas.toString()} change="" changeType="info" icon={AlertOctagon} />
        <KpiCard title="Total a Receber" value={mockKpiFaturas.aReceber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} change="" changeType="info" icon={Receipt} />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Gestão de Faturas</h3>
            <p className="text-sm text-gray-500">Visão detalhada de débitos e limites.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm">
              <input type="text" placeholder="Buscar cooperado..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <ExportarDropdown />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cooperado / Conta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coop / PA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref. / Vencimento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limites (Disp / Total)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valores (Aberto / Total)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockListaDeFaturas.map((fatura) => (
                <tr key={fatura.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{fatura.cooperado}</div>
                    <div className="text-xs text-gray-500">CC: {fatura.contaCorrente}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    <div>{fatura.cooperativa}</div>
                    <div>{fatura.pa}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    <div className="font-bold">{fatura.referencia}</div>
                    <div className="text-xs">{fatura.vencimento}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="text-green-700 font-semibold">{fatura.valorDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <div className="text-xs text-gray-400">de {fatura.valorLimite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="text-red-700 font-bold">{fatura.valorEmAberto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <div className="text-xs text-gray-500">Total: {fatura.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      fatura.status === 'aberta' ? 'bg-blue-100 text-blue-800' :
                      fatura.status === 'vencida' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {fatura.status.toUpperCase()}
                      {fatura.diasAtraso ? ` (${fatura.diasAtraso}d)` : ''}
                    </span>
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

// --- Sub-componente: Alterar Vencimento ---
function ViewAlterarVencimento() {
  const [diaVencimento, setDiaVencimento] = useState('10');
  
  // Cálculo Simples de Melhor dia de Compra (Aprox. 10 dias antes)
  const calcularMelhorDia = (dia: string) => {
    const d = parseInt(dia);
    let melhor = d - 10;
    if (melhor <= 0) melhor += 30;
    return melhor;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <CalendarDays className="w-6 h-6 mr-2 text-hub-teal" /> Alteração de Ciclo de Faturamento
      </h3>
      
      <div className="space-y-6">
        {/* Busca Cooperado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Cooperado</label>
          <div className="relative">
            <input type="text" placeholder="Digite CPF ou Nome..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal focus:border-hub-teal" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
           <h4 className="font-bold text-gray-800 text-sm uppercase mb-4">Configuração Atual</h4>
           <div className="flex justify-between items-center text-sm">
              <span>Dia de Vencimento Atual: <strong>05</strong></span>
              <span>Melhor dia de compra: <strong>25</strong></span>
           </div>
        </div>

        {/* Nova Configuração */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Novo Dia de Vencimento</label>
          <div className="grid grid-cols-3 gap-4">
             {['05', '10', '15', '20', '25', '30'].map(dia => (
               <button
                 key={dia}
                 onClick={() => setDiaVencimento(dia)}
                 className={`py-2 px-4 rounded-lg border font-medium transition-all ${
                   diaVencimento === dia 
                   ? 'bg-hub-teal text-white border-hub-teal ring-2 ring-offset-1 ring-hub-teal' 
                   : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                 }`}
               >
                 Dia {dia}
               </button>
             ))}
          </div>
        </div>

        {/* Feedback Visual */}
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
           <div>
             <span className="block text-xs text-blue-600 uppercase font-bold">Novo Ciclo</span>
             <span className="text-blue-900 font-medium">Vencimento todo dia {diaVencimento}</span>
           </div>
           <div className="text-right">
             <span className="block text-xs text-blue-600 uppercase font-bold">Melhor Data de Compra</span>
             <span className="text-2xl font-bold text-hub-teal">Dia {calcularMelhorDia(diaVencimento)}</span>
           </div>
        </div>

        <button className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition">
          Confirmar Alteração
        </button>
      </div>
    </div>
  );
}

// =======================================================================
// 13. A PÁGINA DE RELATÓRIOS (ATUALIZADA COM NOVOS FILTROS E CARTEIRAS VIRTUAIS)
// =======================================================================

// --- Tipos e Mocks ---
type RelatorioTipo = {
  id: string;
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

// Dados para a Tabela de Histórico
const mockHistoricoRelatorios: HistoricoRelatorio[] = [
  { id: 1, tipo: 'Limites Gerencial', periodo: '30/09/2025 - 31/10/2025', cooperativa: 'Central Hubcoop', formato: 'XLS', dataGeracao: '13/11/2025 13:00', registros: 300, status: 'erro' },
  { id: 2, tipo: 'Faturas Pagas', periodo: '30/09/2025 - 31/10/2025', cooperativa: 'Cooperativa Nordeste', formato: 'CSV', dataGeracao: '13/11/2025 13:00', registros: 250, status: 'concluido' },
];

// Lista de Tipos de Relatórios Disponíveis
const mockTiposDeRelatorios: RelatorioTipo[] = [
  { id: 'carteiras_virtuais', titulo: 'Carteiras Virtuais Ativas', desc: 'Portadores com token ativo em wallets', gerados: 3, icon: Smartphone }, // NOVO
  { id: 'anuidade', titulo: 'Relatório de Anuidades', desc: 'Cobranças, parcelas e status de anuidade', gerados: 12, icon: Percent },
  { id: 'sala_vip', titulo: 'Uso de Sala VIP', desc: 'Acessos, custos extras e salas utilizadas', gerados: 5, icon: Armchair },
  { id: 'servicos_adicionais', titulo: 'Serviços Adicionais', desc: 'PPR, Notificações e outros serviços contratados', gerados: 8, icon: ShieldAlert },
  { id: 'atraso', titulo: 'Cartões em Atraso', desc: 'Cooperados com faturas vencidas', gerados: 1, icon: CalendarX },
  { id: 'faturas', titulo: 'Faturas Pagas', desc: 'Relação de faturas liquidadas', gerados: 1, icon: FileCheck },
  { id: 'transacoes', titulo: 'Transações', desc: 'Débito e Crédito detalhado', gerados: 1, icon: List },
  { id: 'bins', titulo: 'Relatório de Bins', desc: 'Cartões emitidos vs disponibilizados', gerados: 0, icon: CreditCardIcon },
  { id: 'cartoes_atraso', titulo: 'Cartões em Atraso', desc: 'Cooperados com faturas vencidas', gerados: 1, icon: CalendarX },
  { id: 'pagamentos', titulo: 'Pagamentos', desc: 'Todos os pagamentos realizados', gerados: 0, icon: Banknote },
  { id: 'parcelamentos_fat', titulo: 'Parcelamentos', desc: 'Parcelamentos de faturas', gerados: 0, icon: PieChart },
  { id: 'receitas_despesas', titulo: 'Receitas e Despesas', desc: 'Movimentações financeiras', gerados: 0, icon: AreaChart },
  { id: 'cartoes', titulo: 'Cadastro de Cartões', desc: 'Base completa de cartões', gerados: 1, icon: Contact },
  { id: 'parcelamentos_rot', titulo: 'Parcelamentos Rotativos', desc: 'Parcelamentos de juros rotativos', gerados: 0, icon: PieChart },
  { id: 'resgates', titulo: 'Resgates do Programa de Recompensas', desc: 'Todos os resgates de pontos', gerados: 0, icon: Users },
  { id: 'ajustes_central', titulo: 'Ajustes da Central', desc: 'Lançamentos manuais e estornos', gerados: 0, icon: Edit2 },
  { id: 'cartoes_bloq', titulo: 'Cartões Bloqueados por Emissão', desc: 'Cartões que nunca foram ativados', gerados: 0, icon: ShieldAlert },
  { id: 'cadoc', titulo: 'CADOC 3040 - Coobrigações', desc: 'Relatório para Banco Central', gerados: 0, icon: Building },
  { id: 'limites_gerencial', titulo: 'Limites Gerencial', desc: 'Limites de crédito totais', gerados: 1, icon: BarChart2 },
  { id: 'irpi', titulo: 'IRPI - Imposto de Renda', desc: 'Informe de imposto de renda', gerados: 0, icon: FileText },
  { id: 'cessao_credito', titulo: 'Cessão de Crédito (Honra de Aval)', desc: 'Cooperados em cessão de crédito', gerados: 0, icon: AlertOctagon },
];

// --- MOCKS DE DADOS DETALHADOS PARA OS RELATÓRIOS NOVOS ---

// 1. Mock Anuidade
const mockDadosAnuidade = [
  { id: 1, cpfCnpj: '123.456.789-00', nome: 'Ana Beatriz Silva', idCartao: '900103', cartaoMascarado: '4111 11** **** 1111', valorMensal: 45.90, dataCobranca: '10/11/2025', parcContratadas: 12, parcRestantes: 4 },
  { id: 2, cpfCnpj: '12.345.678/0001-90', nome: 'Empresa Silva LTDA', idCartao: '900105', cartaoMascarado: '5500 99** **** 5500', valorMensal: 89.90, dataCobranca: '15/11/2025', parcContratadas: 12, parcRestantes: 10 },
];

// 2. Mock Sala VIP
const mockDadosSalaVIP = [
  { id: 1, cpfCnpj: '111.222.333-44', nome: 'Carlos Eduardo Souza', idCartao: '900102', cartaoMascarado: '5200 00** **** 2045', valor: 32.00, dataUso: '05/11/2025', cooperado: 'Carlos E. Souza', cooperativa: 'Coopesa', pa: 'PA 03', produto: 'Visa Platinum', custoExtra: 'Sim (R$ 150,00)', sala: 'W Premium Lounge GRU' },
  { id: 2, cpfCnpj: '123.456.789-00', nome: 'Ana Beatriz Silva', idCartao: '900103', cartaoMascarado: '4111 11** **** 1111', valor: 0.00, dataUso: '12/11/2025', cooperado: 'Ana B. Silva', cooperativa: 'Crediserv', pa: 'PA 05', produto: 'Visa Infinite', custoExtra: 'Não', sala: 'Visa Infinite Lounge' },
];

// 3. Mock Serviços Adicionais
const mockDadosServicos = [
  { id: 1, cpfCnpj: '123.456.789-00', nome: 'Ana Beatriz Silva', idCartao: '900103', cartaoMascarado: '4111 11** **** 1111', valor: 29.90, dataContratacao: '10/01/2025', cooperativa: 'Crediserv', pa: 'PA 05', produto: 'Seguro PPR', status: '4 Parcelas Restantes' },
  { id: 2, cpfCnpj: '543.210.987-00', nome: 'João Pedro Costa', idCartao: '900104', cartaoMascarado: '4111 00** **** 1111', valor: 5.90, dataContratacao: '01/06/2025', cooperativa: 'Coopesa', pa: 'PA 04', produto: 'Notificação SMS', status: 'Quitado / Recorrente' },
];

// 4. Mock Carteiras Virtuais (NOVO)
const mockDadosCarteirasVirtuais = [
  { id: 1, cpfCnpj: '123.456.789-00', nome: 'Ana Beatriz Silva', idCartao: '900103', cartaoMascarado: '4111 11** **** 9988', wallet: 'Apple Pay', dataAtivacao: '15/01/2025', ultimoUso: '17/11/2025', status: 'Ativo' },
  { id: 2, cpfCnpj: '111.222.333-44', nome: 'Carlos Eduardo Souza', idCartao: '900102', cartaoMascarado: '5200 00** **** 2045', wallet: 'Google Pay', dataAtivacao: '20/02/2025', ultimoUso: '10/11/2025', status: 'Ativo' },
  { id: 3, cpfCnpj: '987.654.321-11', nome: 'João Pedro Costa', idCartao: '900104', cartaoMascarado: '4111 00** **** 1111', wallet: 'Samsung Pay', dataAtivacao: '05/03/2025', ultimoUso: '-', status: 'Suspenso' },
];

// --- Componente PAI da Página Relatórios ---
function PaginaRelatorios({ usuario }: { usuario: User }) {
  const [relatorioAtivo, setRelatorioAtivo] = useState<string | null>(null);

  // Se um relatório estiver ativo, mostra a visualização detalhada
  if (relatorioAtivo) {
    return (
      <ViewRelatorioDetalhado 
        tipo={relatorioAtivo} 
        onBack={() => setRelatorioAtivo(null)} 
      />
    );
  }

  // Caso contrário, mostra o dashboard de relatórios (Histórico + Grid de Geração)
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Relatórios" value="5" change="" changeType="info" icon={File} />
        <KpiCard title="Processando" value="1" change="" changeType="info" icon={PackageSearch} />
        <KpiCard title="Concluídos" value="3" change="" changeType="info" icon={PackageCheck} />
        <KpiCard title="Com Erro" value="1" change="" changeType="info" icon={PackageX} />
      </div>

      {/* Tabela de Histórico */}
      <ViewHistoricoRelatorios historico={mockHistoricoRelatorios} usuario={usuario} />

      {/* Grid de Geração */}
      <ViewGerarRelatorios tipos={mockTiposDeRelatorios} onGerar={(id) => setRelatorioAtivo(id)} />
    </div>
  );
}

// --- Componente Visualização Detalhada do Relatório ---
function ViewRelatorioDetalhado({ tipo, onBack }: { tipo: string; onBack: () => void }) {
  const getTitulo = () => mockTiposDeRelatorios.find(t => t.id === tipo)?.titulo || 'Relatório';

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col h-full min-h-[600px]">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-hub-teal" /> {getTitulo()}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Visualização prévia dos dados.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Voltar</button>
          <button className="px-4 py-2 bg-hub-teal text-white rounded-lg hover:opacity-90 flex items-center">
            <FileDown className="w-4 h-4 mr-2"/> Exportar Excel
          </button>
        </div>
      </div>

      {/* Renderização Condicional baseada no Tipo */}
      <div className="p-6 overflow-x-auto">
        
        {/* --- 1. RELATÓRIO DE ANUIDADE --- */}
        {tipo === 'anuidade' && (
          <div>
            <div className="flex space-x-4 mb-6 p-4 bg-gray-50 rounded-lg border">
               <div className="flex items-center"><span className="text-sm font-bold mr-2">Filtro de Data:</span> <input type="date" className="border rounded p-1"/> <span className="mx-2">até</span> <input type="date" className="border rounded p-1"/></div>
               <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Filtrar</button>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">CPF/CNPJ</th>
                  <th className="px-4 py-3">Nome Contratante</th>
                  <th className="px-4 py-3">ID Cartão</th>
                  <th className="px-4 py-3">Cartão</th>
                  <th className="px-4 py-3">Valor Mensal</th>
                  <th className="px-4 py-3">Data Cobrança</th>
                  <th className="px-4 py-3">Parc. Contratadas</th>
                  <th className="px-4 py-3">Parc. Restantes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockDadosAnuidade.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.cpfCnpj}</td>
                    <td className="px-4 py-3 font-medium">{item.nome}</td>
                    <td className="px-4 py-3">{item.idCartao}</td>
                    <td className="px-4 py-3 font-mono">{item.cartaoMascarado}</td>
                    <td className="px-4 py-3 text-green-700 font-bold">{item.valorMensal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                    <td className="px-4 py-3">{item.dataCobranca}</td>
                    <td className="px-4 py-3 text-center">{item.parcContratadas}</td>
                    <td className="px-4 py-3 text-center font-bold">{item.parcRestantes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 2. RELATÓRIO DE SALA VIP --- */}
        {tipo === 'sala_vip' && (
          <div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">CPF/CNPJ</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Cartão (ID)</th>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Coop / PA</th>
                  <th className="px-4 py-3">Data Uso</th>
                  <th className="px-4 py-3">Sala Usada</th>
                  <th className="px-4 py-3">Custo Extra</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockDadosSalaVIP.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.cpfCnpj}</td>
                    <td className="px-4 py-3 font-medium">{item.nome}</td>
                    <td className="px-4 py-3 font-mono">{item.cartaoMascarado} ({item.idCartao})</td>
                    <td className="px-4 py-3">{item.produto}</td>
                    <td className="px-4 py-3">{item.cooperativa} / {item.pa}</td>
                    <td className="px-4 py-3">{item.dataUso}</td>
                    <td className="px-4 py-3">{item.sala}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.custoExtra === 'Não' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.custoExtra}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 3. RELATÓRIO DE SERVIÇOS ADICIONAIS --- */}
        {tipo === 'servicos_adicionais' && (
          <div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">CPF/CNPJ</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Cartão (ID)</th>
                  <th className="px-4 py-3">Produto/Serviço</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Data Contratação</th>
                  <th className="px-4 py-3">Coop / PA</th>
                  <th className="px-4 py-3">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockDadosServicos.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.cpfCnpj}</td>
                    <td className="px-4 py-3 font-medium">{item.nome}</td>
                    <td className="px-4 py-3 font-mono">{item.cartaoMascarado} ({item.idCartao})</td>
                    <td className="px-4 py-3">{item.produto}</td>
                    <td className="px-4 py-3 font-bold">{item.valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                    <td className="px-4 py-3">{item.dataContratacao}</td>
                    <td className="px-4 py-3">{item.cooperativa} / {item.pa}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 4. RELATÓRIO DE CARTEIRAS VIRTUAIS (NOVO) --- */}
        {tipo === 'carteiras_virtuais' && (
          <div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">CPF/CNPJ</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Cartão (ID)</th>
                  <th className="px-4 py-3">Wallet</th>
                  <th className="px-4 py-3">Data Ativação</th>
                  <th className="px-4 py-3">Último Uso</th>
                  <th className="px-4 py-3">Status Token</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockDadosCarteirasVirtuais.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.cpfCnpj}</td>
                    <td className="px-4 py-3 font-medium">{item.nome}</td>
                    <td className="px-4 py-3 font-mono">{item.cartaoMascarado} ({item.idCartao})</td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          item.wallet === 'Apple Pay' ? 'bg-gray-900 text-white border-gray-900' :
                          item.wallet === 'Google Pay' ? 'bg-white text-gray-700 border-gray-300' :
                          'bg-blue-900 text-white border-blue-900'
                        }`}>
                          {item.wallet}
                        </span>
                    </td>
                    <td className="px-4 py-3">{item.dataAtivacao}</td>
                    <td className="px-4 py-3">{item.ultimoUso}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Placeholder para outros relatórios --- */}
        {!['anuidade', 'sala_vip', 'servicos_adicionais', 'carteiras_virtuais'].includes(tipo) && (
          <div className="text-center py-10 text-gray-500">
            <p>Visualização detalhada ainda não implementada para este tipo de relatório no protótipo.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Componentes Originais da Página Relatórios (ATUALIZADO COM FILTROS COOP/PA) ---
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

  // Mock de PAs (seriam filtrados dinamicamente em produção)
  const pas = mockPontosAtendimento; 

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="flex flex-col p-5 border-b border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Relatórios Disponíveis</h3>
            <p className="text-sm text-gray-500">Geração e download de relatórios</p>
          </div>
          <button className="flex-shrink-0 flex items-center px-4 py-2 text-white rounded-lg shadow-sm transition-colors" style={{ backgroundColor: HUB_BRAND_COLOR }}>
            <Plus className="w-5 h-5 mr-2" /> Novo Relatório
          </button>
        </div>

        {/* --- FILTROS COMPLETOS --- */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Filtro Cooperativa */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cooperativa</label>
            <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
              <option value="">Todas</option>
              {mockCooperativas.filter(c => c.tipo === 'Singular').map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Filtro PA */}
          <div>
            <label className="block text-sm font-medium text-gray-700">PA</label>
            <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
              <option value="">Todos</option>
              {pas.map(pa => (
                <option key={pa.id} value={pa.id}>{pa.nome}</option>
              ))}
            </select>
          </div>

          {/* Filtro Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Produto</label>
            <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
              <option value="">Todos</option>
              <option value="infinite">Infinite</option>
              <option value="black">Black</option>
              <option value="gold">Gold</option>
            </select>
          </div>

          {/* Filtro Período */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Período</label>
            <div className="flex items-center space-x-2">
              <input type="date" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
              <span className="text-gray-500">até</span>
              <input type="date" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
            </div>
          </div>

          {/* Filtro Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF ou CNPJ</label>
            <input type="text" placeholder="Documento..." className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Tabela de Histórico */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Relatório</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cooperativa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Formato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Geração</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historico.map((rel) => (
              <tr key={rel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rel.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.periodo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.cooperativa}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold"><span className={`px-2 py-0.5 rounded-md ${getFormatoClass(rel.formato)}`}>{rel.formato}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.dataGeracao}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${getStatusClass(rel.status)}`}>{rel.status}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button title="Re-gerar" className="text-gray-400 hover:text-hub-teal p-1"><RefreshCw className="w-5 h-5" /></button>
                  {rel.status === 'concluido' && <button title="Exportar" className="text-hub-teal hover:text-hub-teal-dark p-1"><FileDown className="w-5 h-5" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ViewGerarRelatorios({ tipos, onGerar }: { tipos: RelatorioTipo[], onGerar: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
       <h3 className="text-lg font-semibold text-gray-800">Gerar Novo Relatório</h3>
       <p className="text-sm text-gray-500 mb-4">Selecione um relatório para visualizar ou gerar sob demanda.</p>
      
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
            <button 
              onClick={() => onGerar(rel.id)}
              className="text-sm font-medium text-hub-teal hover:text-hub-teal-dark border border-hub-teal px-3 py-1 rounded hover:bg-teal-50 transition"
            >
              Gerar
            </button>
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
// 15. A PÁGINA DE USUÁRIOS (Backoffice) - (ATUALIZADO COM DETALHES DE AUDITORIA)
// =======================================================================

// --- Definição de Tipos para Usuários ---
type PerfilUsuario = 'Atendente' | 'Consulta' | 'Gerente' | 'Administrador';

type UsuarioSistema = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  perfil: PerfilUsuario;
  grupo: string;
  ultimoAcesso: string;
  status: 'Ativo' | 'Inativo';
};

// --- Definição de Tipos para Logs de Auditoria (ATUALIZADO) ---
type LogAuditoria = {
  id: number;
  dataHora: string;          
  acao: 'CREATE' | 'UPDATE' | 'DELETE' | 'BLOCK';
  descricao: string;
  
  // Quem realizou a ação (Novo detalhamento)
  usuarioResponsavelNome: string;  // Nome completo
  usuarioResponsavelLogin: string; // Login/Email
  cooperativaRealizou: string;
  paRealizou: string;
  
  // Quem sofreu a ação (Novo detalhamento)
  afetadoNome: string;       // Nome do Cooperado
  afetadoCpfCnpj: string;    // CPF/CNPJ
  afetadoContaCartao: string;
};

// --- Dados Mockados da Página Usuários ---
const mockUsuarios: UsuarioSistema[] = [
  { id: 1, nome: 'Patricia Holanda', cpf: '123.456.789-00', email: 'patricia@credisis.com.br', perfil: 'Administrador', grupo: 'Central Credisis', ultimoAcesso: '17/11/2025 14:30', status: 'Ativo' },
  { id: 2, nome: 'João da Silva', cpf: '987.654.321-11', email: 'joao@coopesa.com.br', perfil: 'Gerente', grupo: 'Coopesa', ultimoAcesso: '17/11/2025 10:15', status: 'Ativo' },
  { id: 3, nome: 'Maria Oliveira', cpf: '456.789.123-22', email: 'maria@pa03.com.br', perfil: 'Atendente', grupo: 'PA 03', ultimoAcesso: '16/11/2025 18:00', status: 'Inativo' },
];

// --- Dados Mockados de Logs (ATUALIZADO) ---
const mockLogsAuditoria: LogAuditoria[] = [
  { 
    id: 1, 
    dataHora: '17/11/2025 14:45:22', 
    acao: 'UPDATE', 
    descricao: 'Alteração de limite de crédito de R$ 5.000 para R$ 8.000',
    usuarioResponsavelNome: 'Patricia Holanda',
    usuarioResponsavelLogin: 'patricia.holanda@credisis.com.br',
    cooperativaRealizou: 'Credisis Central',
    paRealizou: '-',
    afetadoNome: 'Carlos Eduardo Souza', // Nome incluído
    afetadoCpfCnpj: '111.222.333-44',
    afetadoContaCartao: '900102'
  },
  { 
    id: 2, 
    dataHora: '17/11/2025 10:30:15', 
    acao: 'BLOCK', 
    descricao: 'Bloqueio preventivo de cartão por suspeita de fraude',
    usuarioResponsavelNome: 'João da Silva',
    usuarioResponsavelLogin: 'joao@coopesa.com.br',
    cooperativaRealizou: 'Coopesa',
    paRealizou: 'PA 03',
    afetadoNome: 'Enzo Filho Kids', // Nome incluído
    afetadoCpfCnpj: '555.666.777-88',
    afetadoContaCartao: '900104'
  },
  { 
    id: 3, 
    dataHora: '16/11/2025 09:15:00', 
    acao: 'CREATE', 
    descricao: 'Cadastro de serviço adicional: Seguro PPR',
    usuarioResponsavelNome: 'Maria Oliveira',
    usuarioResponsavelLogin: 'maria@pa03.com.br',
    cooperativaRealizou: 'Coopesa',
    paRealizou: 'PA 03',
    afetadoNome: 'Ana Beatriz Silva', // Nome incluído
    afetadoCpfCnpj: '999.888.777-66',
    afetadoContaCartao: '900103'
  },
  { 
    id: 4, 
    dataHora: '16/11/2025 08:20:10', 
    acao: 'UPDATE', 
    descricao: 'Atualização de endereço de entrega do cartão',
    usuarioResponsavelNome: 'Sistema Integrado',
    usuarioResponsavelLogin: 'system@hubcoop.adm',
    cooperativaRealizou: 'Credisis Central',
    paRealizou: '-',
    afetadoNome: 'Fernanda Lima Santos', // Nome incluído
    afetadoCpfCnpj: '123.456.789-00',
    afetadoContaCartao: '900101'
  },
];

// --- Componente PAI da Página Usuários ---
type UsuariosViewMode = 'lista' | 'logs';

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

// --- View 2: Logs de Auditoria (ATUALIZADA) ---
function ViewLogsAuditoria({ logs }: { logs: LogAuditoria[] }) {
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const logsFiltrados = logs.filter(log => {
    // Filtra por Descrição, Usuário (Nome/Login), Cooperado (Nome/CPF) ou Cooperativa
    const matchBusca = filtroBusca === '' || 
      log.descricao.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      log.usuarioResponsavelNome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      log.usuarioResponsavelLogin.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      log.afetadoNome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      log.afetadoCpfCnpj.includes(filtroBusca) ||
      log.cooperativaRealizou.toLowerCase().includes(filtroBusca.toLowerCase());

    // Lógica de data simples (apenas "começa com")
    const matchData = filtroData === '' || log.dataHora.startsWith(filtroData.split('-').reverse().join('/'));
    
    return matchBusca && matchData;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Cabeçalho com Filtros */}
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Logs de Auditoria</h3>
        <p className="text-sm text-gray-500">Monitoramento de todas as ações realizadas no portal.</p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar por Nome, Login, CPF, Histórico..."
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hub-teal focus:border-hub-teal"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Tabela de Logs Atualizada */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Histórico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário Responsável</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cooperado Afetado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logsFiltrados.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{log.dataHora}</td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 py-0.5 inline-flex text-xs font-bold rounded ${
                      log.acao === 'CREATE' ? 'bg-green-100 text-green-800' :
                      log.acao === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                      log.acao === 'BLOCK' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.acao}
                    </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium max-w-xs truncate" title={log.descricao}>
                  {log.descricao}
                </td>

                {/* Nova Coluna: Usuário Responsável */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{log.usuarioResponsavelNome}</div>
                  <div className="text-xs text-gray-500">{log.usuarioResponsavelLogin}</div>
                </td>

                {/* Nova Coluna: Cooperado Afetado */}
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-gray-900">{log.afetadoNome}</div>
                   <div className="text-xs text-gray-500 font-mono">{log.afetadoCpfCnpj}</div>
                   <div className="text-[10px] text-gray-400">Cartão: {log.afetadoContaCartao}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                  <div className="font-semibold">{log.cooperativaRealizou}</div>
                  <div className="text-gray-400">{log.paRealizou}</div>
                </td>
              </tr>
            ))}
            {logsFiltrados.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Nenhum registro encontrado.</td></tr>
            )}
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

// =======================================================================
// 19. PÁGINA DE GESTÃO DE LIMITES (COMPLETA E HIERÁRQUICA)
// =======================================================================

// --- Tipos para Gestão de Limites ---
type RegraLimite = {
  id: number;
  origem: 'Cooperativa' | 'PA' | 'Cooperado';
  gatilhoPorcentagem: number; // Ex: 10, 15, 20
  aprovadorDestino: 'Central' | 'Cooperativa'; // Quem deve aprovar
};

type SolicitacaoLimite = {
  id: number;
  solicitante: string; // Nome da Coop, PA ou Cooperado
  tipoSolicitante: 'Cooperativa' | 'PA' | 'Cooperado';
  limiteAtual: number;
  limiteSolicitado: number;
  aumentoPorcentagem: number;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  motivo?: string;
};

// --- Dados Mockados para Limites ---
const mockRegrasLimite: RegraLimite[] = [
  { id: 1, origem: 'Cooperativa', gatilhoPorcentagem: 10, aprovadorDestino: 'Central' },
  { id: 2, origem: 'PA', gatilhoPorcentagem: 15, aprovadorDestino: 'Central' },
  { id: 3, origem: 'Cooperado', gatilhoPorcentagem: 20, aprovadorDestino: 'Central' },
];

const mockSolicitacoesLimite: SolicitacaoLimite[] = [
  { id: 1, solicitante: 'Cooperativa Coopesa', tipoSolicitante: 'Cooperativa', limiteAtual: 8000000, limiteSolicitado: 9500000, aumentoPorcentagem: 18.75, status: 'Pendente' },
  { id: 2, solicitante: 'PA 03 (Coopesa)', tipoSolicitante: 'PA', limiteAtual: 500000, limiteSolicitado: 600000, aumentoPorcentagem: 20.0, status: 'Pendente' },
  { id: 3, solicitante: 'Maria Santos (Cooperado)', tipoSolicitante: 'Cooperado', limiteAtual: 5000, limiteSolicitado: 8000, aumentoPorcentagem: 60.0, status: 'Pendente' },
];

// --- Componente Principal ---
function PaginaGestaoLimites({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<'definir' | 'autorizacoes' | 'configuracoes'>('definir');

  return (
    <div className="space-y-6">
      {/* Menu Superior da Página */}
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1">
        <SubMenuButton 
          label="Definir Limites" 
          active={activeTab === 'definir'} 
          onClick={() => setActiveTab('definir')} 
        />
        <SubMenuButton 
          label="Autorizações Pendentes" 
          active={activeTab === 'autorizacoes'} 
          onClick={() => setActiveTab('autorizacoes')} 
        />
        {/* Configuração só aparece para quem tem poder de definir regras (Geralmente Central ou Master) */}
        {(usuario.perfil === 'Central' || usuario.perfil === 'Master') && (
          <SubMenuButton 
            label="Configuração de Regras" 
            active={activeTab === 'configuracoes'} 
            onClick={() => setActiveTab('configuracoes')} 
          />
        )}
      </div>

      {/* Conteúdo das Abas */}
      <div className="animate-fade-in">
        {activeTab === 'definir' && <TabDefinirLimites usuario={usuario} />}
        {activeTab === 'autorizacoes' && <TabAutorizacoesLimites usuario={usuario} />}
        {activeTab === 'configuracoes' && <TabConfiguracaoRegras usuario={usuario} />}
      </div>
    </div>
  );
}

// --- ABA 1: DEFINIR LIMITES (Lógica de Hierarquia Rígida) ---
function TabDefinirLimites({ usuario }: { usuario: User }) {
  const [searchTerm, setSearchTerm] = useState('');

  // --- LÓGICA DE VISUALIZAÇÃO HIERÁRQUICA ---
  
  // 1. Se for CENTRAL -> Vê lista de COOPERATIVAS (Define limite da Coop)
  if (usuario.perfil === 'Central') {
    const cooperativasDaCentral = mockCooperativas.filter(c => c.centralId === usuario.centralId && c.tipo === 'Singular');
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Definir Limites das Cooperativas</h3>
        <p className="text-sm text-gray-500 mb-6">Você está visualizando as cooperativas vinculadas à sua Central. Ajuste o limite outorgado.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cooperativa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Limite Atual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cooperativasDaCentral.map(coop => (
                <tr key={coop.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{coop.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{coop.cnpj}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{coop.limiteOutorgado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4">
                    <button className="text-hub-teal hover:text-hub-teal-dark font-medium text-sm flex items-center">
                      <Edit2 className="w-4 h-4 mr-1"/> Alterar Limite
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

  // 2. Se for COOPERATIVA -> Vê lista de PAs (Define limite do PA)
  if (usuario.perfil === 'Cooperativa') {
    const pasDaCooperativa = mockPontosAtendimento.filter(pa => pa.cooperativaId === usuario.cooperativaId);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Definir Limites dos Pontos de Atendimento (PA)</h3>
        <p className="text-sm text-gray-500 mb-6">Ajuste o limite operacional de cada PA vinculado à sua Cooperativa.</p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">PA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Limite PA (Simulado)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pasDaCooperativa.map(pa => (
                <tr key={pa.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{pa.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{pa.codigo}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">R$ 500.000,00</td> {/* Mock fixo pois PA não tinha limite no tipo original */}
                  <td className="px-6 py-4">
                    <button className="text-hub-teal hover:text-hub-teal-dark font-medium text-sm flex items-center">
                      <Edit2 className="w-4 h-4 mr-1"/> Alterar Limite
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

  // 3. Se for PA -> Vê lista de COOPERADOS (Define limite do Cooperado)
  if (usuario.perfil === 'PA') {
    // Filtra cooperados deste PA
    const cooperadosDoPA = mockCooperados.filter(c => c.pontoAtendimentoId === usuario.pontoAtendimentoId);
    const cooperadosFiltrados = cooperadosDoPA.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf.includes(searchTerm));

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Definir Limites dos Cooperados</h3>
        <p className="text-sm text-gray-500 mb-4">Gerencie o limite de crédito individual dos cooperados do seu PA.</p>
        
        <div className="mb-6 max-w-md relative">
           <input 
              type="text" 
              placeholder="Buscar cooperado..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cooperado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Limite Cartão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cooperadosFiltrados.map(coop => (
                <tr key={coop.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{coop.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{coop.cpf}</td>
                  {/* Mockando limite individual visualmente */}
                  <td className="px-6 py-4 font-bold text-gray-800">R$ 5.000,00</td> 
                  <td className="px-6 py-4">
                    <button className="text-hub-teal hover:text-hub-teal-dark font-medium text-sm flex items-center">
                      <Edit2 className="w-4 h-4 mr-1"/> Alterar Limite
                    </button>
                  </td>
                </tr>
              ))}
              {cooperadosFiltrados.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhum cooperado encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. Se for MASTER -> Vê as Centrais (Regra implícita de topo de cadeia)
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <h3 className="text-xl font-semibold text-gray-800">Visão Master</h3>
      <p className="text-gray-500 mt-2">O usuário Master gerencia os limites globais das Centrais.</p>
    </div>
  );
}

// --- ABA 2: AUTORIZAÇÕES (Fluxo de Aprovação) ---
function TabAutorizacoesLimites({ usuario }: { usuario: User }) {
  // Filtra as solicitações que este usuário pode ver/aprovar
  const solicitacoesVisiveis = mockSolicitacoesLimite.filter(sol => {
     // Se sou Central, vejo tudo que está direcionado para Central (de Coop, PA ou Cooperado que escalou)
     if (usuario.perfil === 'Central') return true; // Simplificação para o protótipo
     // Se sou Cooperativa, vejo o que veio do PA ou Cooperado
     if (usuario.perfil === 'Cooperativa') return sol.tipoSolicitante !== 'Cooperativa'; 
     return false;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Autorizações de Aumento de Limite</h3>
      <p className="text-sm text-gray-500 mb-6">
        Solicitações que excederam a alçada automática e requerem sua aprovação.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Solicitante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nível</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Limite Atual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Solicitado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">% Aumento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {solicitacoesVisiveis.map(sol => (
              <tr key={sol.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{sol.solicitante}</td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">{sol.tipoSolicitante}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{sol.limiteAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 font-bold text-hub-teal">{sol.limiteSolicitado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4">
                  <span className="text-red-600 font-bold">+{sol.aumentoPorcentagem.toFixed(2)}%</span>
                </td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">{sol.status}</span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Aprovar</button>
                  <button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Rejeitar</button>
                </td>
              </tr>
            ))}
            {solicitacoesVisiveis.length === 0 && (
               <tr><td colSpan={7} className="p-6 text-center text-gray-500">Nenhuma solicitação pendente para seu perfil.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- ABA 3: CONFIGURAÇÃO DE REGRAS (Parametrização) ---
function TabConfiguracaoRegras({ usuario }: { usuario: User }) {
  // Estado local para simular edição
  const [regras, setRegras] = useState(mockRegrasLimite);

  const handleUpdateRegra = (id: number, field: string, value: string | number) => {
    setRegras(regras.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuração de Alçadas de Aprovação</h3>
      <p className="text-sm text-gray-500 mb-6">
        Defina as regras de escalonamento. Quando o aumento solicitado exceder a porcentagem configurada, a aprovação será enviada para o aprovador selecionado.
      </p>

      <div className="grid gap-6">
        {regras.map((regra) => (
          <div key={regra.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
            
            {/* Descrição da Regra */}
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h4 className="font-bold text-gray-800 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-hub-teal"/>
                Solicitação de {regra.origem}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Regra aplicada quando uma {regra.origem} solicita aumento de limite.
              </p>
            </div>

            {/* Configuração do Gatilho */}
            <div className="flex items-center space-x-4 md:w-2/3 justify-end">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Se aumento for acima de:</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={regra.gatilhoPorcentagem}
                    onChange={(e) => handleUpdateRegra(regra.id, 'gatilhoPorcentagem', parseFloat(e.target.value))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal focus:border-hub-teal"
                  />
                  <span className="absolute right-3 top-2 text-gray-500 font-bold">%</span>
                </div>
              </div>

              <div className="flex items-center pt-5">
                <ArrowDownUp className="w-5 h-5 text-gray-400 mx-2 transform rotate-90 md:rotate-0" />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">Enviar para aprovação de:</label>
                <select 
                  value={regra.aprovadorDestino}
                  onChange={(e) => handleUpdateRegra(regra.id, 'aprovadorDestino', e.target.value)}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal focus:border-hub-teal bg-white"
                >
                  <option value="Cooperativa">Cooperativa</option>
                  <option value="Central">Central</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition">
          <Save className="w-5 h-5 mr-2" /> Salvar Regras
        </button>
      </div>
    </div>
  );
}

// =======================================================================
// 20. PÁGINA DE CONTA SALÁRIO (CORRIGIDA)
// =======================================================================

// --- Tipos Específicos para Conta Salário ---
type EnderecoColaborador = {
  logradouro: string; numero: string; bairro: string; cidade: string; uf: string; cep: string;
};

type DadosContaSalario = {
  id: number;
  colaboradorNome: string;
  colaboradorDoc: string;
  colaboradorEndereco: EnderecoColaborador;
  vinculoCnpj: string;
  vinculoNomeFantasia: string;
  vinculoResponsavel: string;
  cartaoNumeroCompleto: string; 
  dataEmissaoCartao: string;
  dataValidadeCartao: string;
  statusCartao: 'Ativo' | 'Bloqueado' | 'Cancelado';
  tipoConta: 'Conta Salário' | 'Conta Corrente';
  numeroConta: string;
  numeroContaCartao: string;
  dataAbertura: string;
  statusContaCorrente: 'Ativa' | 'Bloqueada' | 'Encerrada';
  statusContaCartao: 'Ativa' | 'Bloqueada' | 'Cancelada';
};

// --- Mock de Dados Conta Salário ---
const mockContasSalario: DadosContaSalario[] = [
  {
    id: 1,
    colaboradorNome: 'João da Silva Trabalhador',
    colaboradorDoc: '123.456.789-00',
    colaboradorEndereco: {
      logradouro: 'Rua das Indústrias', numero: '500', bairro: 'Distrito Industrial',
      cidade: 'São Paulo', uf: 'SP', cep: '01000-000'
    },
    vinculoCnpj: '12.345.678/0001-90',
    vinculoNomeFantasia: 'Indústrias Silva LTDA',
    vinculoResponsavel: 'Roberto Empresário Silva',
    cartaoNumeroCompleto: '4855123456789012',
    dataEmissaoCartao: '12/01/2024',
    dataValidadeCartao: '01/29',
    statusCartao: 'Ativo',
    tipoConta: 'Conta Salário',
    numeroConta: '102030-4',
    numeroContaCartao: '99887766',
    dataAbertura: '10/01/2024',
    statusContaCorrente: 'Ativa',
    statusContaCartao: 'Ativa',
  },
  {
    id: 2,
    colaboradorNome: 'Maria Souza Atendente',
    colaboradorDoc: '987.654.321-11',
    colaboradorEndereco: {
      logradouro: 'Av. Brasil', numero: '100', bairro: 'Centro',
      cidade: 'Rio de Janeiro', uf: 'RJ', cep: '20000-000'
    },
    vinculoCnpj: '12.345.678/0001-90',
    vinculoNomeFantasia: 'Indústrias Silva LTDA',
    vinculoResponsavel: 'Roberto Empresário Silva',
    cartaoNumeroCompleto: '5500987654321098',
    dataEmissaoCartao: '16/03/2024',
    dataValidadeCartao: '03/29',
    statusCartao: 'Bloqueado',
    tipoConta: 'Conta Corrente',
    numeroConta: '405060-X',
    numeroContaCartao: '11223344',
    dataAbertura: '15/03/2024',
    statusContaCorrente: 'Ativa',
    statusContaCartao: 'Bloqueada',
  }
];

// --- Componente Principal ---
function PaginaContaSalario({ usuario }: { usuario: User }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConta, setSelectedConta] = useState<DadosContaSalario | null>(null);

  const contasFiltradas = mockContasSalario.filter(c => 
    c.colaboradorNome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.colaboradorDoc.includes(searchTerm) ||
    c.vinculoNomeFantasia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Gestão de Conta Salário</h3>
          <p className="text-sm text-gray-500">Colaboradores vinculados e detalhes de contas.</p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Buscar colaborador, CPF ou Empresa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colaborador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endereço de Entrega</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa (CNPJ)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contasFiltradas.map((conta) => (
                <tr key={conta.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{conta.colaboradorNome}</div>
                    <div className="text-xs text-gray-500">CPF: {conta.colaboradorDoc}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{conta.colaboradorEndereco.logradouro}, {conta.colaboradorEndereco.numero}</p>
                    <p className="text-xs text-gray-400">{conta.colaboradorEndereco.cidade}/{conta.colaboradorEndereco.uf} - {conta.colaboradorEndereco.cep}</p>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-sm font-medium text-gray-800">{conta.vinculoNomeFantasia}</div>
                     <div className="text-xs text-gray-500">{conta.vinculoCnpj}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedConta(conta)}
                      className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                      title="Visualizar Detalhes"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {contasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                    Nenhum colaborador encontrado com os termos pesquisados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedConta && (
        <ModalDetalhesContaSalario 
          dados={selectedConta} 
          onClose={() => setSelectedConta(null)} 
        />
      )}
    </div>
  );
}

// --- Componente Modal de Detalhes ---
function ModalDetalhesContaSalario({ dados, onClose }: { dados: DadosContaSalario; onClose: () => void }) {
  const maskCartao = (num: string) => {
    if (num.length < 10) return num;
    return `${num.substring(0, 6)} ****** ${num.substring(num.length - 4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        <div className="flex justify-between items-start p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-full mr-4">
              {/* SUBSTITUÍDO 'User' POR 'Users' PARA EVITAR ERRO DE IMPORT */}
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{dados.colaboradorNome}</h3>
              <p className="text-sm text-gray-500">CPF: {dados.colaboradorDoc}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              <Building className="w-5 h-5 mr-2 text-hub-teal" /> Empresa Vinculada
            </h4>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Nome Fantasia</label>
                <p className="text-gray-900 font-medium">{dados.vinculoNomeFantasia}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">CNPJ</label>
                <p className="text-gray-900 font-medium">{dados.vinculoCnpj}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Responsável</label>
                <p className="text-gray-900 font-medium">{dados.vinculoResponsavel}</p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              <CreditCard className="w-5 h-5 mr-2 text-hub-teal" /> Cartão de Débito
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-80 h-48 bg-gradient-to-br from-gray-800 to-black rounded-xl p-6 text-white shadow-lg relative overflow-hidden flex-shrink-0">
                <div className="flex justify-between items-start">
                  <CreditCard className="w-8 h-8 opacity-80" />
                  <span className={`text-xs px-2 py-1 rounded font-bold ${dados.statusCartao === 'Ativo' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {dados.statusCartao.toUpperCase()}
                  </span>
                </div>
                <div className="mt-8">
                   <p className="text-xl font-mono tracking-widest">{maskCartao(dados.cartaoNumeroCompleto)}</p>
                </div>
                <div className="mt-auto pt-6 flex justify-between text-xs opacity-80">
                  <div>
                    <span className="block text-[10px] uppercase">Emissão</span>
                    <span>{dados.dataEmissaoCartao}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase">Validade</span>
                    <span>{dados.dataValidadeCartao}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 content-center">
                 <div className="p-3 bg-white border rounded shadow-sm">
                   <label className="text-xs text-gray-500">Número Mascarado</label>
                   <p className="font-mono text-lg">{maskCartao(dados.cartaoNumeroCompleto)}</p>
                 </div>
                 <div className="p-3 bg-white border rounded shadow-sm">
                   <label className="text-xs text-gray-500">Status Cartão</label>
                   <p className={`font-bold ${dados.statusCartao === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>
                     {dados.statusCartao}
                   </p>
                 </div>
                 <div className="p-3 bg-white border rounded shadow-sm">
                   <label className="text-xs text-gray-500">Emissão</label>
                   <p className="font-medium">{dados.dataEmissaoCartao}</p>
                 </div>
                 <div className="p-3 bg-white border rounded shadow-sm">
                   <label className="text-xs text-gray-500">Validade</label>
                   <p className="font-medium">{dados.dataValidadeCartao}</p>
                 </div>
              </div>
            </div>
          </section>

          <section>
            <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              <Wallet className="w-5 h-5 mr-2 text-hub-teal" /> Dados da Conta
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <label className="text-xs text-blue-600 uppercase font-bold mb-1 block">Tipo de Conta</label>
                  <p className="text-xl font-bold text-gray-800">{dados.tipoConta}</p>
               </div>
               
               <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Número da Conta</label>
                  <p className="text-lg font-mono text-gray-900">{dados.numeroConta}</p>
                  <div className="mt-2 text-xs">
                    Status: <span className={`font-bold ${dados.statusContaCorrente === 'Ativa' ? 'text-green-600' : 'text-red-600'}`}>{dados.statusContaCorrente}</span>
                  </div>
               </div>

               <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Conta Cartão</label>
                  <p className="text-lg font-mono text-gray-900">{dados.numeroContaCartao}</p>
                  <div className="mt-2 text-xs">
                    Status: <span className={`font-bold ${dados.statusContaCartao === 'Ativa' ? 'text-green-600' : 'text-red-600'}`}>{dados.statusContaCartao}</span>
                  </div>
               </div>
               
               <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Data Abertura</label>
                  <p className="text-lg text-gray-900">{dados.dataAbertura}</p>
               </div>
            </div>
          </section>

        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
// =======================================================================
// 21. PÁGINA DE SERVIÇOS ADICIONAIS (GERENCIAMENTO DE COBRANÇAS EXTRAS)
// =======================================================================

// --- Tipos ---
type TipoServicoAdicional = 'PPR' | 'Notificacao';
type CanalNotificacao = 'SMS' | 'WhatsApp' | 'Ambos';

type ParcelaPPR = {
  numero: number;
  vencimento: string;
  valor: number;
  status: 'Paga' | 'Pendente' | 'Futura';
};

type ServicoAdicional = {
  id: number;
  tipo: TipoServicoAdicional;
  
  // Dados do Contratante
  cooperadoNome: string;
  documento: string; // CPF ou CNPJ
  idCartao: string;
  cartaoMascarado: string;
  
  // Configuração Financeira
  valorMensal: number;
  diaCobranca: number;
  
  // Específico PPR
  parcelas?: ParcelaPPR[];
  
  // Específico Notificação
  canal?: CanalNotificacao;
  
  status: 'Ativo' | 'Cancelado';
};

// --- Mocks ---
const mockServicosAdicionais: ServicoAdicional[] = [
  {
    id: 1,
    tipo: 'PPR',
    cooperadoNome: 'Ana Beatriz Silva',
    documento: '123.456.789-00',
    idCartao: '900103',
    cartaoMascarado: '4111 11** **** 1111',
    valorMensal: 29.90,
    diaCobranca: 10,
    status: 'Ativo',
    parcelas: [
      { numero: 1, vencimento: '10/10/2025', valor: 29.90, status: 'Paga' },
      { numero: 2, vencimento: '10/11/2025', valor: 29.90, status: 'Paga' },
      { numero: 3, vencimento: '10/12/2025', valor: 29.90, status: 'Pendente' },
      { numero: 4, vencimento: '10/01/2026', valor: 29.90, status: 'Futura' },
      { numero: 5, vencimento: '10/02/2026', valor: 29.90, status: 'Futura' },
      { numero: 6, vencimento: '10/03/2026', valor: 29.90, status: 'Futura' },
    ]
  },
  {
    id: 2,
    tipo: 'Notificacao',
    cooperadoNome: 'Carlos Eduardo Souza',
    documento: '543.210.987-00',
    idCartao: '900102',
    cartaoMascarado: '5500 00** **** 2045',
    valorMensal: 5.90,
    diaCobranca: 5,
    canal: 'SMS',
    status: 'Ativo'
  },
  {
    id: 3,
    tipo: 'Notificacao',
    cooperadoNome: 'Empresa Silva LTDA',
    documento: '12.345.678/0001-90',
    idCartao: '900105',
    cartaoMascarado: '5500 99** **** 5500',
    valorMensal: 9.90,
    diaCobranca: 15,
    canal: 'WhatsApp',
    status: 'Ativo'
  }
];

// --- Componente Principal ---
function PaginaServicosAdicionais({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<TipoServicoAdicional>('PPR');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServico, setSelectedServico] = useState<ServicoAdicional | null>(null);

  const servicosFiltrados = mockServicosAdicionais.filter(s => 
    s.tipo === activeTab &&
    (s.cooperadoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.documento.includes(searchTerm) ||
     s.idCartao.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Serviços Adicionais</h3>
          <p className="text-sm text-gray-500">Gerencie seguros e notificações contratadas.</p>
        </div>
        <button className="mt-4 md:mt-0 flex items-center px-4 py-2 text-white rounded-lg shadow-sm" style={{ backgroundColor: HUB_BRAND_COLOR }}>
          <Plus className="w-5 h-5 mr-2" /> Nova Contratação
        </button>
      </div>

      {/* Abas */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('PPR')}
          className={`px-6 py-3 text-sm font-medium flex items-center transition-colors border-b-2 ${activeTab === 'PPR' ? 'border-hub-teal text-hub-teal' : 'border-transparent text-gray-500'}`}
        >
          <ShieldAlert className="w-4 h-4 mr-2" /> Seguro PPR
        </button>
        <button
          onClick={() => setActiveTab('Notificacao')}
          className={`px-6 py-3 text-sm font-medium flex items-center transition-colors border-b-2 ${activeTab === 'Notificacao' ? 'border-hub-teal text-hub-teal' : 'border-transparent text-gray-500'}`}
        >
          <FileText className="w-4 h-4 mr-2" /> Notificações
        </button>
      </div>

      {/* Filtro e Tabela */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Buscar por Nome, CPF/CNPJ ou ID Cartão..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contratante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cartão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cobrança</th>
                {activeTab === 'PPR' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcelas (Pagas/Total)</th>}
                {activeTab === 'Notificacao' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canal</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {servicosFiltrados.map((servico) => (
                <tr key={servico.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{servico.cooperadoNome}</div>
                    <div className="text-xs text-gray-500">{servico.documento}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-gray-700">{servico.cartaoMascarado}</div>
                    <div className="text-xs text-gray-400">ID: {servico.idCartao}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-green-700">
                      {servico.valorMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-xs text-gray-500">Dia {servico.diaCobranca}</div>
                  </td>
                  
                  {/* Coluna Específica PPR com Barra de Progresso */}
                  {activeTab === 'PPR' && servico.parcelas && (
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-hub-teal h-2 rounded-full" 
                            style={{ width: `${(servico.parcelas.filter(p => p.status === 'Paga').length / servico.parcelas.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          {servico.parcelas.filter(p => p.status === 'Paga').length} / {servico.parcelas.length}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Coluna Específica Notificação */}
                  {activeTab === 'Notificacao' && (
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${servico.canal === 'WhatsApp' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {servico.canal}
                      </span>
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedServico(servico)}
                      className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                      title="Editar e Gerenciar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {servicosFiltrados.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-gray-500">Nenhum serviço encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição/Detalhes */}
      {selectedServico && (
        <ModalGerenciarServico 
          servico={selectedServico} 
          onClose={() => setSelectedServico(null)} 
        />
      )}
    </div>
  );
}

// --- Componente Modal Gerenciar Serviço ---
function ModalGerenciarServico({ servico, onClose }: { servico: ServicoAdicional; onClose: () => void }) {
  const [editandoParcela, setEditandoParcela] = useState<number | null>(null);
  const [novoValorParcela, setNovoValorParcela] = useState('');
  
  const [configNotificacao, setConfigNotificacao] = useState({
    canal: servico.canal || 'SMS',
    valor: servico.valorMensal
  });

  const handleSalvarParcela = (numeroParcela: number) => {
    // Aqui entraria a lógica de chamada à API
    alert(`Valor da parcela ${numeroParcela} atualizado para R$ ${novoValorParcela}`);
    setEditandoParcela(null);
  };

  const handleSalvarNotificacao = () => {
    alert(`Configuração de notificação atualizada:\nCanal: ${configNotificacao.canal}\nNovo Valor: ${configNotificacao.valor}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center pb-4 border-b mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Gerenciar {servico.tipo}</h3>
            <p className="text-sm text-gray-500">{servico.cooperadoNome} - Cartão final {servico.cartaoMascarado.slice(-4)}</p>
          </div>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
        </div>

        {/* --- CONTEÚDO SE FOR PPR --- */}
        {servico.tipo === 'PPR' && servico.parcelas && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
              <div>
                <span className="block text-xs text-blue-600 uppercase font-bold">Status do Contrato</span>
                <span className="text-lg font-bold text-blue-900">
                  {servico.parcelas.filter(p => p.status === 'Paga').length} de {servico.parcelas.length} parcelas pagas
                </span>
              </div>
              <ShieldAlert className="w-8 h-8 text-blue-300"/>
            </div>

            <h4 className="font-semibold text-gray-700 mt-4">Detalhamento das Parcelas</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Vencimento</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Valor</th>
                    <th className="px-4 py-2">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {servico.parcelas.map((p) => (
                    <tr key={p.numero}>
                      <td className="px-4 py-2">{p.numero}</td>
                      <td className="px-4 py-2">{p.vencimento}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          p.status === 'Paga' ? 'bg-green-100 text-green-700' : 
                          p.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {editandoParcela === p.numero ? (
                          <input 
                            type="number" 
                            className="w-20 px-1 border rounded focus:ring-2 focus:ring-hub-teal" 
                            defaultValue={p.valor}
                            onChange={(e) => setNovoValorParcela(e.target.value)}
                          />
                        ) : (
                          p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {p.status !== 'Paga' && (
                          editandoParcela === p.numero ? (
                            <div className="flex space-x-2">
                               <button onClick={() => handleSalvarParcela(p.numero)} className="text-green-600 hover:text-green-800" title="Salvar"><Save className="w-4 h-4"/></button>
                               <button onClick={() => setEditandoParcela(null)} className="text-gray-400 hover:text-gray-600" title="Cancelar"><X className="w-4 h-4"/></button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditandoParcela(p.numero); setNovoValorParcela(p.valor.toString()) }} className="text-blue-600 hover:text-blue-800" title="Editar Valor"><Edit2 className="w-4 h-4"/></button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- CONTEÚDO SE FOR NOTIFICAÇÃO --- */}
        {servico.tipo === 'Notificacao' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">Configuração de Envio</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Canal de Envio</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-hub-teal focus:border-hub-teal"
                    value={configNotificacao.canal}
                    onChange={(e) => setConfigNotificacao({...configNotificacao, canal: e.target.value as CanalNotificacao})}
                  >
                    <option value="SMS">SMS</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Ambos">Ambos (SMS + WhatsApp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mensal (R$)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-hub-teal focus:border-hub-teal"
                    value={configNotificacao.valor}
                    onChange={(e) => setConfigNotificacao({...configNotificacao, valor: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="mt-6 p-3 bg-blue-50 rounded text-sm text-blue-800">
                <p><strong>Nota:</strong> A alteração do canal de envio pode impactar o custo mensal. Confirme com o cooperado antes de salvar.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSalvarNotificacao}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md flex items-center"
              >
                <Save className="w-4 h-4 mr-2" /> Salvar Alterações
              </button>
            </div>
          </div>
        )}

        {servico.tipo === 'PPR' && (
           <div className="mt-6 flex justify-end border-t pt-4">
             <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Fechar</button>
           </div>
        )}

      </div>
    </div>
  );
}
// =======================================================================
// 22. PÁGINA DE LANÇAMENTOS  - APENAS CENTRAL
// =======================================================================

// --- Tipos ---
type CategoriaLancamento = 'Parcelamento' | 'Compra Integral' | 'Fatura' | 'Anuidade' | 'PPR';
type TipoOperacao = 'Credito' | 'Debito';

type LancamentoHistorico = {
  id: number;
  categoria: CategoriaLancamento;
  operacao: TipoOperacao; // Crédito ou Débito
  dataHora: string;
  valor: number;
  status: 'Concluído' | 'Estornado';
  
  // Dados do Cartão/Conta
  contaCartao: string;
  idCartao: string;
  cartaoMascarado: string;
  
  // Auditoria
  quemRealizou: string;
  quemSolicitou: string;
  motivo: string;
};

// --- Mocks ---
const mockHistoricoLancamentos: LancamentoHistorico[] = [
  {
    id: 1,
    categoria: 'Anuidade',
    operacao: 'Credito',
    dataHora: '17/11/2025 10:30',
    valor: 450.00,
    status: 'Concluído',
    contaCartao: '12345-6',
    idCartao: '900103',
    cartaoMascarado: '4111 11** **** 9988',
    quemRealizou: 'Patricia Holanda (Credisis)',
    quemSolicitou: 'Ana Beatriz Silva (Cooperado)',
    motivo: 'Isenção por relacionamento/investimento'
  },
  {
    id: 2,
    categoria: 'Fatura',
    operacao: 'Debito',
    dataHora: '15/11/2025 09:00',
    valor: 3200.00,
    status: 'Concluído',
    contaCartao: '77441-2',
    idCartao: '900104',
    cartaoMascarado: '4111 00** **** 1111',
    quemRealizou: 'Sistema Automático',
    quemSolicitou: 'Processamento Noturno',
    motivo: 'Acerto de processamento'
  }
];

// --- Componente Principal ---
function PaginaLancamentos({ usuario }: { usuario: User }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCat, setFiltroCat] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Filtros
  const lancamentosFiltrados = mockHistoricoLancamentos.filter(b => {
    const matchSearch = 
      b.cartaoMascarado.includes(searchTerm) || 
      b.idCartao.includes(searchTerm) || 
      b.contaCartao.includes(searchTerm) ||
      b.quemSolicitou.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCat = filtroCat === '' || b.categoria === filtroCat;

    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <ArrowDownCircle className="w-6 h-6 mr-2 text-hub-teal"/> Central de Lançamentos
          </h3>
          <p className="text-sm text-gray-500">Gestão de créditos e débitos manuais (baixas e cobranças).</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 text-white rounded-lg shadow-sm hover:opacity-90 transition" 
          style={{ backgroundColor: HUB_BRAND_COLOR }}
        >
          <Plus className="w-5 h-5 mr-2" /> Novo Lançamento
        </button>
      </div>

      {/* Filtros e Tabela */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar Cartão, ID ou Solicitante..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
              value={filtroCat}
              onChange={(e) => setFiltroCat(e.target.value)}
            >
              <option value="">Todas as Categorias</option>
              <option value="Fatura">Fatura</option>
              <option value="Compra Integral">Compra Integral</option>
              <option value="Parcelamento">Parcelamento</option>
              <option value="Anuidade">Anuidade</option>
              <option value="PPR">PPR</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalhes do Cartão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auditoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lancamentosFiltrados.map((lanc) => (
                <tr key={lanc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lanc.dataHora}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                      lanc.operacao === 'Credito' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {lanc.operacao === 'Credito' ? 'Crédito' : 'Débito'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {lanc.categoria}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-mono text-gray-800">{lanc.cartaoMascarado}</div>
                    <div className="text-xs text-gray-500">ID: {lanc.idCartao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {lanc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div><span className="font-bold text-xs">Realizado:</span> {lanc.quemRealizou}</div>
                    <div><span className="font-bold text-xs">Solicitado:</span> {lanc.quemSolicitou}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-bold text-green-700 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1"/> {lanc.status}
                    </span>
                  </td>
                </tr>
              ))}
              {lancamentosFiltrados.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Nenhum registro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançamentos (Seleção + Formulário) */}
      {showModal && (
        <ModalNovoLancamento usuario={usuario} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

// --- Componente Modal Novo Lançamento (Com Etapas) ---
function ModalNovoLancamento({ usuario, onClose }: { usuario: User; onClose: () => void }) {
  const [etapa, setEtapa] = useState<'selecao' | 'formulario'>('selecao');
  const [tipoOperacao, setTipoOperacao] = useState<TipoOperacao | null>(null);
  
  const [categoria, setCategoria] = useState<CategoriaLancamento>('Fatura');
  const [valor, setValor] = useState('');

  const handleSelectTipo = (tipo: TipoOperacao) => {
    setTipoOperacao(tipo);
    setEtapa('formulario');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Lançamento a ${tipoOperacao} registrado com sucesso!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {etapa === 'selecao' ? 'Novo Lançamento' : `Registrar Lançamento a ${tipoOperacao === 'Credito' ? 'Crédito' : 'Débito'}`}
            </h3>
            {etapa === 'formulario' && (
              <p className="text-xs text-gray-500 mt-1">
                {tipoOperacao === 'Credito' ? 'O portador já realizou o pagamento.' : 'O portador ainda irá pagar.'}
              </p>
            )}
          </div>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
        </div>
        
        {/* --- ETAPA 1: SELEÇÃO --- */}
        {etapa === 'selecao' && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => handleSelectTipo('Credito')}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200">
                <ArrowDownCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Lançamento a Crédito</h4>
              <p className="text-sm text-gray-500 text-center">
                Selecione se o portador <strong>já realizou o pagamento</strong>.
              </p>
            </button>

            <button 
              onClick={() => handleSelectTipo('Debito')}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200">
                <ArrowDownCircle className="w-8 h-8 text-red-600 transform rotate-180" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Lançamento a Débito</h4>
              <p className="text-sm text-gray-500 text-center">
                Selecione se o portador <strong>ainda irá pagar</strong> (cobrança).
              </p>
            </button>
          </div>
        )}

        {/* --- ETAPA 2: FORMULÁRIO (IGUAL AO ANTERIOR) --- */}
        {etapa === 'formulario' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Linha 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item (Categoria)</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as CategoriaLancamento)}
                >
                  <option value="Fatura">Pagamento de Fatura</option>
                  <option value="Compra Integral">Compra Integral</option>
                  <option value="Parcelamento">Parcelamento</option>
                  <option value="Anuidade">Anuidade</option>
                  <option value="PPR">PPR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
            </div>

            {/* Linha 2: Identificação do Cartão */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
              <h4 className="text-sm font-bold text-gray-700 border-b pb-1">Dados do Cartão</h4>
              <div className="grid grid-cols-3 gap-3">
                 <div className="col-span-1">
                   <label className="block text-xs text-gray-500">ID do Cartão</label>
                   <input type="text" placeholder="Ex: 900103" className="w-full px-2 py-1 border rounded text-sm"/>
                 </div>
                 <div className="col-span-2">
                   <label className="block text-xs text-gray-500">Número (6 primeiros + 4 últimos)</label>
                   <div className="flex items-center gap-2">
                     <input type="text" maxLength={6} placeholder="411111" className="w-20 px-2 py-1 border rounded text-sm text-center"/>
                     <span>******</span>
                     <input type="text" maxLength={4} placeholder="1234" className="w-16 px-2 py-1 border rounded text-sm text-center"/>
                   </div>
                 </div>
                 <div className="col-span-3">
                   <label className="block text-xs text-gray-500">Conta Cartão</label>
                   <input type="text" className="w-full px-2 py-1 border rounded text-sm"/>
                 </div>
              </div>
            </div>

            {/* Linha 3: Auditoria */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quem Solicitou?</label>
                <input type="text" placeholder="Ex: Gerente João" className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável (Logado)</label>
                <input type="text" value={usuario.nome} disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-500"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo do Lançamento</label>
              <textarea 
                rows={3} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal"
                placeholder="Descreva detalhadamente o motivo..."
              ></textarea>
            </div>

            <div className="pt-4 flex justify-between border-t mt-4">
              <button 
                type="button" 
                onClick={() => setEtapa('selecao')} 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                Voltar
              </button>
              <div className="flex space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                <button 
                  type="submit" 
                  className="px-6 py-2 text-white rounded-lg shadow-sm hover:opacity-90"
                  style={{ backgroundColor: HUB_BRAND_COLOR }}
                >
                  Confirmar Lançamento
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
// =======================================================================
// 23. PÁGINA DE ADMINISTRAÇÃO DAS CARTEIRAS VIRTUAIS (NOVA)
// =======================================================================

// --- Tipos ---
type WalletProvider = 'Apple Pay' | 'Google Pay' | 'Samsung Pay';
type MetodoValidacao = 'OTP (SMS)' | 'App-to-App' | 'Call Center';

type SolicitacaoCarteira = {
  id: number;
  cooperado: string;
  cartaoMascarado: string;
  idCartao: string;
  produto: string;
  dataSolicitacao: string;
  wallet: WalletProvider;
  metodo: MetodoValidacao; // O método exigido ou usado para validação
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  scoreRisco?: string; // Apenas visual
};

// --- Mocks ---
const mockSolicitacoesWallet: SolicitacaoCarteira[] = [
  {
    id: 1,
    cooperado: 'Ana Beatriz Silva',
    cartaoMascarado: '4111 11** **** 9988',
    idCartao: '900103',
    produto: 'Visa Infinite',
    dataSolicitacao: '17/11/2025 10:45',
    wallet: 'Apple Pay',
    metodo: 'App-to-App',
    status: 'Pendente',
    scoreRisco: 'Baixo'
  },
  {
    id: 2,
    cooperado: 'Carlos Eduardo Souza',
    cartaoMascarado: '5200 00** **** 2045',
    idCartao: '900102',
    produto: 'Visa Gold',
    dataSolicitacao: '17/11/2025 11:20',
    wallet: 'Google Pay',
    metodo: 'OTP (SMS)',
    status: 'Pendente',
    scoreRisco: 'Médio'
  },
  {
    id: 3,
    cooperado: 'João Pedro Costa',
    cartaoMascarado: '4111 00** **** 1111',
    idCartao: '900104',
    produto: 'Visa Classic',
    dataSolicitacao: '16/11/2025 15:00',
    wallet: 'Samsung Pay',
    metodo: 'Call Center',
    status: 'Rejeitado',
    scoreRisco: 'Alto'
  }
];

// --- Componente Principal ---
function PaginaCarteirasVirtuais({ usuario }: { usuario: User }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Pendente');
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoCarteira | null>(null);

  const solicitacoesFiltradas = mockSolicitacoesWallet.filter(s => {
    const matchSearch = 
      s.cooperado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cartaoMascarado.includes(searchTerm) ||
      s.idCartao.includes(searchTerm);
    
    const matchStatus = filtroStatus === 'Todos' || s.status === filtroStatus;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Smartphone className="w-6 h-6 mr-2 text-hub-teal"/> Carteiras Virtuais
          </h3>
          <p className="text-sm text-gray-500">Autorização de provisionamento de tokens (Apple, Google, Samsung).</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
           <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-600">
              <strong>Pendentes:</strong> {mockSolicitacoesWallet.filter(s => s.status === 'Pendente').length}
           </div>
        </div>
      </div>

      {/* Filtros e Tabela */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar Cooperado, Cartão ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pendente">Pendentes</option>
              <option value="Aprovado">Aprovados</option>
              <option value="Rejeitado">Rejeitados</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cooperado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dados do Cartão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método Validação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solicitacoesFiltradas.map((sol) => (
                <tr key={sol.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sol.dataSolicitacao}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{sol.cooperado}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-800">{sol.cartaoMascarado}</div>
                    <div className="text-xs text-gray-500">ID: {sol.idCartao} | {sol.produto}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center w-max ${
                      sol.wallet === 'Apple Pay' ? 'bg-gray-900 text-white border-gray-900' :
                      sol.wallet === 'Google Pay' ? 'bg-white text-gray-700 border-gray-300' :
                      'bg-blue-900 text-white border-blue-900'
                    }`}>
                      {sol.wallet}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sol.metodo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                      sol.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                      sol.status === 'Rejeitado' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sol.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {sol.status === 'Pendente' && (
                      <button 
                        onClick={() => setSolicitacaoSelecionada(sol)}
                        className="text-white px-3 py-1 rounded shadow-sm hover:opacity-90 text-xs font-bold bg-hub-teal transition-colors"
                        style={{ backgroundColor: HUB_BRAND_COLOR }}
                      >
                        Avaliar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {solicitacoesFiltradas.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Nenhuma solicitação encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Aprovação/Negação */}
      {solicitacaoSelecionada && (
        <ModalAvaliarWallet 
          solicitacao={solicitacaoSelecionada} 
          onClose={() => setSolicitacaoSelecionada(null)} 
        />
      )}
    </div>
  );
}

// --- Componente Modal Avaliar Wallet ---
function ModalAvaliarWallet({ solicitacao, onClose }: { solicitacao: SolicitacaoCarteira; onClose: () => void }) {
  
  const handleAction = (acao: 'Aprovar' | 'Negar') => {
    alert(`Solicitação ${acao === 'Aprovar' ? 'APROVADA' : 'NEGADA'} com sucesso!\nWallet: ${solicitacao.wallet}\nCooperado: ${solicitacao.cooperado}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Autorização de Provisionamento</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Info Principal */}
          <div className="flex items-center justify-center mb-4">
             <div className="text-center">
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-2 ${
                      solicitacao.wallet === 'Apple Pay' ? 'bg-black text-white' :
                      solicitacao.wallet === 'Google Pay' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      'bg-blue-900 text-white'
                }`}>
                  Adicionar ao {solicitacao.wallet}
                </span>
                <p className="text-gray-500 text-xs">{solicitacao.dataSolicitacao}</p>
             </div>
          </div>

          {/* Detalhes do Portador */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 text-sm">
             <div className="flex justify-between">
               <span className="text-gray-500">Cooperado:</span>
               <span className="font-bold text-gray-800">{solicitacao.cooperado}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">Cartão:</span>
               <span className="font-mono font-bold text-gray-800">{solicitacao.cartaoMascarado}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">ID Cartão:</span>
               <span className="font-medium text-gray-800">{solicitacao.idCartao}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">Produto:</span>
               <span className="font-medium text-gray-800">{solicitacao.produto}</span>
             </div>
          </div>

          {/* Método de Validação */}
          <div className="border-t pt-4">
             <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Método de Validação Requerido</label>
             <div className="flex items-center p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800">
                {solicitacao.metodo === 'OTP (SMS)' && <Smartphone className="w-5 h-5 mr-2"/>}
                {solicitacao.metodo === 'App-to-App' && <CheckCircle2 className="w-5 h-5 mr-2"/>}
                {solicitacao.metodo === 'Call Center' && <History className="w-5 h-5 mr-2"/>}
                
                <div>
                  <span className="block font-bold">{solicitacao.metodo}</span>
                  <span className="text-xs opacity-80">
                    {solicitacao.metodo === 'OTP (SMS)' ? 'Enviar código para celular cadastrado.' : 
                     solicitacao.metodo === 'App-to-App' ? 'Validação via token do aplicativo.' : 
                     'Confirmação positiva de dados via atendimento.'}
                  </span>
                </div>
             </div>
          </div>
          
          {/* Risco (Mock Visual) */}
          <div className="flex justify-between items-center text-xs text-gray-500">
             <span>Score de Risco:</span>
             <span className={`font-bold ${
               solicitacao.scoreRisco === 'Baixo' ? 'text-green-600' :
               solicitacao.scoreRisco === 'Médio' ? 'text-yellow-600' : 'text-red-600'
             }`}>{solicitacao.scoreRisco}</span>
          </div>

        </div>

        {/* Rodapé Ações */}
        <div className="p-5 border-t bg-gray-50 flex space-x-3">
          <button 
            onClick={() => handleAction('Negar')}
            className="flex-1 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition shadow-sm"
          >
            Negar Solicitação
          </button>
          <button 
            onClick={() => handleAction('Aprovar')}
            className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md"
          >
            Aprovar Adição
          </button>
        </div>
      </div>
    </div>
  );
}