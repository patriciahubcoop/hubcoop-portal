import { supabase } from './supabase';
import React, { useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Building,
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
  Home,
  FileText,
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
  ArrowDownUp,
  Percent,
  Save,
  AlertCircle,
  SlidersHorizontal,
  FileDown,
  HelpCircle,
  CheckCircle2,
  XCircle,
  BarChart2,
  ChevronDown,
  File,
  Clock,
  AlertOctagon,
  Receipt,
  CalendarX,
  Banknote,
  AreaChart,
  Contact,
  RefreshCw,
  PackageCheck,
  PackageSearch,
  PackageX,
  Library,
  Briefcase,
  MapPin,
  UserCog,
  History,
  CalendarDays,
  Filter,
  UserCheck,
  Upload,
  UserPlus,
  User as UserIcon, // Renamed to avoid conflict with type User
  Gift,
  Armchair,
  Plane,
  Coffee,
  CheckSquare,
  CreditCard as CreditCardIcon,
  ArrowDownCircle,
  Smartphone,
} from "lucide-react";

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart as RechartsArea, 
  Area
} from 'recharts';

// =======================================================================
// DADOS GLOBAIS DO SISTEMA (USUÁRIOS MOCK, CENTRAIS, COOPERATIVAS, PONTOS)
// =======================================================================

// 1. Novo Tipo de Usuário
type UserProfile = "Master" | "Central" | "Cooperativa" | "PA";

type User = {
  id: string;
  nome: string;
  email: string;
  perfil: UserProfile;
  centralId: string | null;
  cooperativaId: string | null;
  pontoAtendimentoId: string | null;
};

// 2. Nosso "Banco de Dados" de usuários para simular o login
const mockUsuariosLogin: Record<string, User> = {
  // --- MASTER ---
  hubcoop: {
    id: "user1",
    nome: "Admin Hubcoop",
    email: "patricia.holanda@hubcoop.com.br",
    perfil: "Master",
    centralId: "c1",
    cooperativaId: null,
    pontoAtendimentoId: null,
  },

  // --- ECOSSISTEMA CREDISIS ---
  credisis: {
    id: "user2",
    nome: "Patricia Holanda (Credisis)",
    email: "patricia.holanda@credisis.com.br",
    perfil: "Central",
    centralId: "c2",
    cooperativaId: null,
    pontoAtendimentoId: null,
  },
  coopesa: {
    id: "user3",
    nome: "Gestor Coopesa",
    email: "patricia.holanda@cooperativacoopesa.com.br",
    perfil: "Cooperativa",
    centralId: "c2",
    cooperativaId: "coop_coopesa",
    pontoAtendimentoId: null,
  },
  pa03: {
    id: "user4",
    nome: "Atendente PA 03",
    email: "patricia.holanda@pa03.com.br",
    perfil: "PA",
    centralId: "c2",
    cooperativaId: "coop_coopesa",
    pontoAtendimentoId: "pa_03",
  },

  // --- ECOSSISTEMA UNIPRIME (NOVOS) ---
  uniprime: {
    id: "user5",
    nome: "Gestor Uniprime Central",
    email: "admin@uniprime.com.br",
    perfil: "Central",
    centralId: "c3",
    cooperativaId: null,
    pontoAtendimentoId: null,
  },
  pioneira: {
    id: "user6",
    nome: "Gestor Uniprime Pioneira",
    email: "gerente@pioneira.com.br",
    perfil: "Cooperativa",
    centralId: "c3",
    cooperativaId: "coop_uni_pioneira",
    pontoAtendimentoId: null,
  },
  pa_pioneira: {
    id: "user7",
    nome: "Atendente PA Toledo",
    email: "atendente@pioneira.com.br",
    perfil: "PA",
    centralId: "c3",
    cooperativaId: "coop_uni_pioneira",
    pontoAtendimentoId: "pa_uni_01",
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
  tipo: "Central" | "Singular";
  limiteOutorgado: number;
  limiteUtilizado: number;
  status: "Ativa" | "Inativa";
};
type PontoAtendimento = {
  id: string;
  cooperativaId: string;
  codigo: string;
  nome: string;
  status: "Ativo" | "Inativo";
};

// Lista de TODAS as Centrais no sistema
const mockCentrais: Central[] = [
  {
    id: "c1",
    nome: "Hubcoop (Matriz)",
    admin: "hubcoop.admin@email.com",
    logo: "https://placehold.co/40x40/333333/ffffff?text=H",
  },
  {
    id: "c2",
    nome: "CREDISIS CENTRAL",
    admin: "patricia.holanda@credisis.com.br",
    logo: "https://i.imgur.com/v1bOn4O.png",
  },
];

// =======================================================================
// 2. Componente Principal do Aplicativo (Refatorado)
// =======================================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cooperativasReais, setCooperativasReais] = useState<any[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        simulatedUsers={mockUsuariosLogin}
      />
    );
  }

  return (
    <DashboardLayout
      onLogout={handleLogout}
      usuario={currentUser}
      cooperativas={cooperativasReais}
    />
  );
}

// =======================================================================
// 3. A Tela de Login (Refatorada com Navegação entre Centrais)
// =======================================================================
function LoginPage({
  onLogin,
  simulatedUsers,
}: {
  onLogin: (user: User) => void;
  simulatedUsers: Record<string, User>;
}) {
  const [view, setView] = useState<'home' | 'credisis' | 'uniprime'>('home');

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-10 space-y-6 bg-card shadow-2xl rounded-2xl border border-border">
        
        {/* Cabeçalho Dinâmico */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-foreground mb-2">Hubcoop</h1>
          
          {view === 'home' && <span className="text-sm text-gray-500">Selecione o ecossistema</span>}
          {view === 'credisis' && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-widest">Credisis</span>}
          {view === 'uniprime' && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-widest">Uniprime</span>}
        </div>

        <div className="w-1/4 mx-auto bg-primary h-[3px]"></div>

        {/* --- VIEW: HOME (MASTER + SELEÇÃO) --- */}
        {view === 'home' && (
          <div className="space-y-4 pt-4 animate-fade-in">
            {/* 1. Master Sempre Visível */}
            <LoginButton
              onClick={() => onLogin(simulatedUsers.hubcoop)}
              perfil="Master (Hubcoop)"
              email={simulatedUsers.hubcoop.email}
              variant="master"
            />
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">Simular Central</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* 2. Botão Pasta Credisis */}
            <button
              onClick={() => setView('credisis')}
              className="w-full px-4 py-4 flex justify-between items-center bg-white border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold mr-4 group-hover:scale-110 transition-transform">
                  C
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-800">CrediSIS Central</span>
                  <span className="text-xs text-gray-500">Central, Coopesa, PAs</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-600" />
            </button>

            {/* 3. Botão Pasta Uniprime */}
            <button
              onClick={() => setView('uniprime')}
              className="w-full px-4 py-4 flex justify-between items-center bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-4 group-hover:scale-110 transition-transform">
                  U
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-800"> Central Uniprime</span>
                  <span className="text-xs text-gray-500">Central, Pioneira, PAs</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
            </button>
          </div>
        )}

        {/* --- VIEW: CREDISIS --- */}
        {view === 'credisis' && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <button onClick={() => setView('home')} className="text-xs text-gray-500 hover:text-gray-900 flex items-center mb-4">
               <ChevronLeft className="w-4 h-4 mr-1"/> Voltar para seleção
            </button>

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
        )}

        {/* --- VIEW: UNIPRIME --- */}
        {view === 'uniprime' && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <button onClick={() => setView('home')} className="text-xs text-gray-500 hover:text-gray-900 flex items-center mb-4">
               <ChevronLeft className="w-4 h-4 mr-1"/> Voltar para seleção
            </button>

            <LoginButton
              onClick={() => onLogin(simulatedUsers.uniprime)}
              perfil="Central (Uniprime)"
              email={simulatedUsers.uniprime.email}
            />
            <LoginButton
              onClick={() => onLogin(simulatedUsers.pioneira)}
              perfil="Cooperativa (Pioneira)"
              email={simulatedUsers.pioneira.email}
            />
            <LoginButton
              onClick={() => onLogin(simulatedUsers.pa_pioneira)}
              perfil="Ponto de Atendimento (Toledo)"
              email={simulatedUsers.pa_pioneira.email}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Componente auxiliar atualizado para aceitar variante
function LoginButton({
  onClick,
  perfil,
  email,
  variant = "default"
}: {
  onClick: () => void;
  perfil: string;
  email: string;
  variant?: "default" | "master";
}) {
  const baseClasses = "w-full px-4 py-3 text-left rounded-lg shadow-md transition-all duration-300 transform hover:scale-105";
  const colorClasses = variant === "master" 
    ? "bg-gray-800 text-white hover:bg-gray-900 ring-2 ring-gray-800 ring-offset-2" 
    : "bg-primary text-primary-foreground hover:bg-accent";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${colorClasses}`}
    >
      <span className="font-semibold text-lg">{perfil}</span>
      <span className="block text-sm opacity-90">{email}</span>
    </button>
  );
}

// ====================================
// 4. O Layout Principal do Dashboard 
// ====================================
function DashboardLayout({
  onLogout,
  usuario,
  cooperativas,
}: {
  onLogout: () => void;
  usuario: User;
  cooperativas: any[];
}) {
  const [activePage, setActivePage] = useState(
    usuario.perfil === "Master" ? "Configuracoes" : "Dashboard",
  );

  return (
    <div className="flex h-screen bg-background">
      {/* 4.1. Menu Lateral (Sidebar) */}
      <aside
        className="flex flex-col w-[280px] bg-white text-foreground shadow-xl"
      >
        <div className="flex items-center justify-center h-[120px] shadow-md">
          <h1 className="text-foreground" style={{ fontSize: '40px', lineHeight: '1.3' }}>Hubcoop</h1>
        </div>

        {/* 4.2. Menu de Navegação Principal */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
          
          {/* --- LINKS OPERACIONAIS (Visíveis para todos, EXCETO Master) --- */}
          {usuario.perfil !== "Master" && (
            <>
              <SidebarLink
                text="Dashboard"
                icon={<Home size={18} />}
                active={activePage === "Dashboard"}
                onClick={() => setActivePage("Dashboard")}
              />
              <SidebarLink
                text="Cooperados"
                icon={<Users2 size={18} />}
                active={activePage === "Cooperados"}
                onClick={() => setActivePage("Cooperados")}
              />
              <SidebarLink
                text="Cartões"
                icon={<CreditCard size={18} />}
                active={activePage === "Cartoes"}
                onClick={() => setActivePage("Cartoes")}
              />
              <SidebarLink
                text="Transações"
                icon={<DollarSign size={18} />}
                active={activePage === "Transacoes"}
                onClick={() => setActivePage("Transacoes")}
              />
              <SidebarLink
                text="Faturas"
                icon={<FileText size={18} />}
                active={activePage === "Faturas"}
                onClick={() => setActivePage("Faturas")}
              />
              <SidebarLink
                text="Relatórios"
                icon={<BarChart3 size={18} />}
                active={activePage === "Relatorios"}
                onClick={() => setActivePage("Relatorios")}
              />
              <SidebarLink
                text="Loyalty (Pontos)"
                icon={<Gift size={18} />}
                active={activePage === "Loyalty"}
                onClick={() => setActivePage("Loyalty")}
              />
              <SidebarLink
                text="Sala VIP"
                icon={<Armchair size={18} />}
                active={activePage === "SalaVIP"}
                onClick={() => setActivePage("SalaVIP")}
              />
              <SidebarLink
                text="Carteiras Virtuais"
                icon={<Smartphone size={18} />}
                active={activePage === "CarteirasVirtuais"}
                onClick={() => setActivePage("CarteirasVirtuais")}
              />
              
              {/* ITENS QUE O MASTER NÃO PODE VER (MOVIDOS PARA CÁ) */}
              <SidebarLink
                text="Gestão de Limites"
                icon={<SlidersHorizontal size={18} />}
                active={activePage === "GestaoLimites"}
                onClick={() => setActivePage("GestaoLimites")}
              />
              <SidebarLink
                text="Conta Salário"
                icon={<Wallet size={18} />}
                active={activePage === "ContaSalario"}
                onClick={() => setActivePage("ContaSalario")}
              />
              <SidebarLink
                text="Serviços Adicionais"
                icon={<Coffee size={18} />}
                active={activePage === "ServicosAdicionais"}
                onClick={() => setActivePage("ServicosAdicionais")}
              />
            </>
          )}

          {/* --- LINKS ESPECÍFICOS DE GESTÃO (CENTRAL / COOPERATIVA) --- */}
          
          {/* "Cooperativas" - Apenas Central e Cooperativa */}
          {(usuario.perfil === "Central" ||
            usuario.perfil === "Cooperativa") && (
            <SidebarLink
              text="Cooperativas"
              icon={<Building size={18} />}
              active={activePage === "Cooperativas"}
              onClick={() => setActivePage("Cooperativas")}
            />
          )}

          {/* "Usuários" - Apenas Central (Master vê apenas configurações) */}
          {usuario.perfil === "Central" && (
            <SidebarLink
              text="Usuários"
              icon={<Users size={18} />}
              active={activePage === "Usuarios"}
              onClick={() => setActivePage("Usuarios")}
            />
          )}

          {/* "Lançamentos" - Apenas Central */}
          {usuario.perfil === "Central" && (
            <SidebarLink
              text="Lançamentos"
              icon={<ArrowDownCircle size={18} />}
              active={activePage === "Lancamentos"}
              onClick={() => setActivePage("Lancamentos")}
            />
          )}
        </nav>

        {/* 4.3. Rodapé do Menu (Configurações e Sair) */}
        <div className="p-2 border-t border-border space-y-1">
          {/* Configurações é o único item além de sair que o Master vê sempre */}
          <SidebarLink
            text="Configurações"
            icon={<Settings size={18} />}
            active={activePage === "Configuracoes"}
            onClick={() => setActivePage("Configuracoes")}
          />
          <SidebarLink
            text="Sair"
            icon={<LogOut size={18} />}
            active={false}
            onClick={onLogout}
          />
          <div className="pt-4 px-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Última atualização:</p>
              <p className="text-xs text-muted-foreground">17/11/2025 16:30:00</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal (Direita) */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between h-[120px] px-10 bg-white shadow-md">
          <h2 className="text-foreground" style={{ fontSize: '30px', lineHeight: '1.3' }}>
            {activePage === "Loyalty"
              ? "Loyalty (Pontos)"
              : activePage.replace(/([A-Z])/g, " $1").trim()}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted"></div>
            <div className="text-right">
              <div className="text-foreground" style={{ fontSize: '16px' }}>
                {usuario.nome}
              </div>
              <div className="text-sm text-muted-foreground">
                {usuario.perfil}
                {usuario.centralId &&
                  ` | Central: ${mockCentrais.find((c) => c.id === usuario.centralId)?.nome}`}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {activePage === "Dashboard" && (
            <PaginaDashboard usuario={usuario} cooperativas={cooperativas} />
          )}
          {activePage === "Cooperados" && (
            <PaginaCooperados usuario={usuario} />
          )}
          {activePage === "Cartoes" && (
            <PaginaCartoes usuario={usuario} />
          )}
          {activePage === "Transacoes" && (
            <PaginaTransacoes usuario={usuario} />
          )}
          {activePage === "Faturas" && (
            <PaginaFaturas usuario={usuario} />
          )}
          {activePage === "Relatorios" && (
            <PaginaRelatorios usuario={usuario} />
          )}
          {activePage === "Loyalty" && (
            <PaginaLoyalty usuario={usuario} />
          )}
          {activePage === "SalaVIP" && (
            <PaginaSalaVIP usuario={usuario} />
          )}
          {activePage === "Cooperativas" && (
            <PaginaCooperativas usuario={usuario} />
          )}
          {activePage === "Usuarios" && (
            <PaginaUsuarios usuario={usuario} />
          )}
          {activePage === "Configuracoes" && (
            <PaginaConfiguracoes usuario={usuario} />
          )}
          {activePage === "GestaoLimites" && (
            <PaginaGestaoLimites usuario={usuario} />
          )}
          {activePage === "ContaSalario" && (
            <PaginaContaSalario usuario={usuario} />
          )}
          {activePage === "ServicosAdicionais" && (
            <PaginaServicosAdicionais usuario={usuario} />
          )}
          {activePage === "Lancamentos" && (
            <PaginaLancamentos usuario={usuario} />
          )}
          {activePage === "CarteirasVirtuais" && (
            <PaginaCarteirasVirtuais usuario={usuario} />
          )}

          {activePage !== "Dashboard" &&
            activePage !== "Cooperados" &&
            activePage !== "Cartoes" &&
            activePage !== "Transacoes" &&
            activePage !== "Faturas" &&
            activePage !== "Relatorios" &&
            activePage !== "Loyalty" &&
            activePage !== "SalaVIP" &&
            activePage !== "Cooperativas" &&
            activePage !== "Usuarios" &&
            activePage !== "Configuracoes" &&
            activePage !== "GestaoLimites" &&
            activePage !== "ContaSalario" &&
            activePage !== "ServicosAdicionais" &&
            activePage !== "Lancamentos" &&
            activePage !== "CarteirasVirtuais" && (
              <PaginaPlaceholder pageName={activePage} />
            )}
        </main>
      </div>
    </div>
  );
}

// =======================================================================
// 5. Componente auxiliar para os Links do Menu
// =======================================================================
interface SidebarLinkProps {
  text: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}
function SidebarLink({
  text,
  icon,
  active,
  onClick,
}: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full px-3 py-2 space-x-3 text-left rounded-lg transition-all duration-200
        ${
          active
            ? "bg-accent text-accent-foreground"
            : "hover:bg-muted text-card-foreground opacity-90 hover:opacity-100"
        }
      `}
      style={{ height: '40px' }}
    >
      {icon}
      <span className="truncate" style={{ fontSize: '16px', lineHeight: '24px' }}>{text}</span>
    </button>
  );
}

// =======================================================================
// 6. Placeholder para páginas futuras
// =======================================================================
function PaginaPlaceholder({ pageName }: { pageName: string }) {
  return (
    <div className="p-8 bg-card rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-foreground">{pageName}</h3>
      <p className="mt-2 text-muted-foreground">
        Conteúdo da página "{pageName}" apareceria aqui.
      </p>
    </div>
  );
}

// =======================================================================
// 7. A PÁGINA DE DASHBOARD (VISÃO ESTRATÉGICA + VISÃO OPERACIONAL - DADOS REAIS)
// =======================================================================
function PaginaDashboard({ usuario, cooperativas }: { usuario: User; cooperativas: any[] }) {
  const [coopSelecionada, setCoopSelecionada] = useState<string>("");
  const [paSelecionado, setPaSelecionado] = useState<string>("");
  const [tab, setTab] = useState<"estrategica" | "operacional">("estrategica");
  const [loading, setLoading] = useState(true);

  // --- Estados para os Dropdowns (Filtros) ---
  const [listaCoops, setListaCoops] = useState<any[]>([]);
  const [listaPAs, setListaPAs] = useState<any[]>([]);

  // --- Estados de Dados ---
  const [kpiTransacoesHoje, setKpiTransacoesHoje] = useState(0);
  const [kpiTotalCartoes, setKpiTotalCartoes] = useState(0);
  const [limiteUtilizado, setLimiteUtilizado] = useState(0);
  const [limiteDisponivel, setLimiteDisponivel] = useState(0);
  const [ticketMedio, setTicketMedio] = useState("R$ 0,00");
  const [transacoesSeries, setTransacoesSeries] = useState<any[]>([]);

  const [volumeModalidadeData, setVolumeModalidadeData] = useState<any[]>([]);
  const [faturasData, setFaturasData] = useState<any[]>([]);
  const [aderenciaPct, setAderenciaPct] = useState(0);
  const [ativacaoPct, setAtivacaoPct] = useState(0);

  const [cartoesEmitidos, setCartoesEmitidos] = useState(0);
  const [cartoesCancelados, setCartoesCancelados] = useState(0);
  const [emissoesPorProduto, setEmissoesPorProduto] = useState<any[]>([]);

  const [inadimplenciaData, setInadimplenciaData] = useState<any[]>([]);
  const [tendenciaAtraso, setTendenciaAtraso] = useState(0);
  const [chargebacks, setChargebacks] = useState(0);

  const [oportunidadesSeries, setOportunidadesSeries] = useState<any[]>([]);
  const [propensaoSeries, setPropensaoSeries] = useState<any[]>([]);
  const [quedaSeries, setQuedaSeries] = useState<any[]>([]);
  const [kpiOportunidades, setKpiOportunidades] = useState(0);
  const [kpiPropensao, setKpiPropensao] = useState(0);
  const [kpiQueda, setKpiQueda] = useState(0);

  const [solicitacoesRecentes, setSolicitacoesRecentes] = useState(0);
  const [ativosVsInativos, setAtivosVsInativos] = useState<any[]>([]);
  const [bloqueadosVsDesbloqueados, setBloqueadosVsDesbloqueados] = useState<any[]>([]);

  const [emissoesBIN, setEmissoesBIN] = useState(0);
  const [entregasPendentes, setEntregasPendentes] = useState(0);
  const [walletsData, setWalletsData] = useState<any[]>([]);

  const [valorServicos, setValorServicos] = useState(0);
  const [usoSalaVIP, setUsoSalaVIP] = useState(0);
  const [contestacoes, setContestacoes] = useState(0);

  // --- Efeitos ---
  useEffect(() => {
    fetchFiltros();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [coopSelecionada, paSelecionado, usuario]);

  // --- Buscas ---
  async function fetchFiltros() {
    const { data: coops } = await supabase.from('cooperativas').select('*');
    const { data: pas } = await supabase.from('pontos_atendimento').select('*');
    setListaCoops(coops || []);
    setListaPAs(pas || []);
  }

  async function fetchDashboardData() {
    setLoading(true);
    try {
      let matchQuery: any = {};
      if (usuario.perfil === 'Central') matchQuery.central_id = usuario.centralId;
      if (usuario.perfil === 'Cooperativa') matchQuery.cooperativa_id = usuario.cooperativaId;
      if (usuario.perfil === 'PA') matchQuery.ponto_atendimento_id = usuario.pontoAtendimentoId;
      
      if (coopSelecionada) matchQuery.cooperativa_id = coopSelecionada;
      if (paSelecionado) matchQuery.ponto_atendimento_id = paSelecionado;

      // 2. Busca Transações
      const { data: transacoes } = await supabase.from('transacoes').select('*').match(matchQuery);
      const txData = transacoes || [];
      const hoje = new Date().toISOString().split('T')[0];
      const txHoje = txData.filter((t: any) => t.created_at.startsWith(hoje));

      setKpiTransacoesHoje(txHoje.length);

      const totalVol = txData.reduce((acc: number, t: any) => acc + Number(t.valor), 0);
      const avgTicket = txData.length ? totalVol / txData.length : 0;
      setTicketMedio(avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

      // Series Transações
      const mockSeries = [
        { dia: "Seg", valor: totalVol * 0.1 }, { dia: "Ter", valor: totalVol * 0.15 },
        { dia: "Qua", valor: totalVol * 0.12 }, { dia: "Qui", valor: totalVol * 0.18 },
        { dia: "Sex", valor: totalVol * 0.25 }, { dia: "Sáb", valor: totalVol * 0.15 },
        { dia: "Dom", valor: totalVol * 0.05 },
      ];
      setTransacoesSeries(mockSeries);

      // Volume Modalidade
      const debito = txData.filter((t: any) => t.funcao === 'Debito').reduce((acc: number, t: any) => acc + Number(t.valor), 0);
      const credito = txData.filter((t: any) => t.funcao === 'Credito').reduce((acc: number, t: any) => acc + Number(t.valor), 0);
      setVolumeModalidadeData([
        { name: "Débito", value: debito },
        { name: "Crédito", value: credito },
        { name: "Parcelado", value: credito * 0.4 },
      ]);

      // 3. Busca Cartões
      const { data: cartoes } = await supabase.from('cartoes').select('*').match(matchQuery);
      const cards = cartoes || [];
      const totalCards = cards.length;
      setKpiTotalCartoes(totalCards);

      const limTotal = cards.reduce((acc: number, c: any) => acc + Number(c.limite), 0);
      const limDisp = cards.reduce((acc: number, c: any) => acc + Number(c.disponivel), 0);
      const limUsed = limTotal - limDisp;

      setLimiteUtilizado(limUsed);
      setLimiteDisponivel(limDisp);

      // Status Cartões
      const ativos = cards.filter((c: any) => c.status === 'ativo').length;
      const inativos = totalCards - ativos;
      setAderenciaPct(totalCards > 0 ? Math.round((ativos / totalCards) * 100) : 0);
      setAtivacaoPct(92);

      setAtivosVsInativos([
        { name: "Ativos", value: ativos },
        { name: "Inativos", value: inativos }
      ]);

      const bloq = cards.filter((c: any) => c.status.includes('bloqueado')).length;
      setBloqueadosVsDesbloqueados([
        { name: "Bloq", v: bloq },
        { name: "Desb", v: totalCards - bloq }
      ]);

      // Emissões por Produto
      const produtos = ["Infinite", "Platinum", "Gold", "Classic"];
      const emissoesProd = produtos.map(p => ({
         name: `Visa ${p}`,
         value: cards.filter((c: any) => c.tipo_produto?.includes(p) || (p === "Classic" && !c.tipo_produto)).length
      }));
      setEmissoesPorProduto(emissoesProd);
      setCartoesEmitidos(totalCards);
      setCartoesCancelados(cards.filter((c: any) => c.status === 'cancelado').length);

      // 4. Busca Faturas
      const { data: faturas } = await supabase.from('faturas').select('*').match(matchQuery);
      const fats = faturas || [];
      const pagas = fats.filter((f: any) => f.status === 'paga').length;
      const abertas = fats.filter((f: any) => f.status === 'aberta').length;
      const atrasadas = fats.filter((f: any) => f.status === 'vencida').length;

      setFaturasData([
        { name: "Pagas", value: pagas },
        { name: "Abertas", value: abertas },
        { name: "Atrasadas", value: atrasadas },
      ]);

      // Inadimplência Calculada
      const inadData = [
         { cat: "INFINITE", pf: atrasadas * 10, pj: atrasadas * 5 },
         { cat: "PLATINUM", pf: atrasadas * 8, pj: atrasadas * 6 },
         { cat: "GOLD", pf: atrasadas * 4, pj: atrasadas * 3 },
         { cat: "CLASSIC", pf: atrasadas * 12, pj: atrasadas * 8 },
         { cat: "EMPRESARIAL", pf: atrasadas * 5, pj: atrasadas * 15 },
      ];
      setInadimplenciaData(inadData);
      setTendenciaAtraso(16);
      setChargebacks(totalVol * 0.005);

      // 5. Dados Operacionais Extras
      setSolicitacoesRecentes(Math.floor(totalCards * 0.05));
      setEmissoesBIN(totalCards);
      setEntregasPendentes(Math.floor(totalCards * 0.02));
      
      setWalletsData([
         { name: "Apple Pay", uso: Math.floor(totalCards * 0.2) },
         { name: "Google Pay", uso: Math.floor(totalCards * 0.3) },
         { name: "Samsung Pay", uso: Math.floor(totalCards * 0.05) },
      ]);

      setValorServicos(totalCards * 5.90);
      setUsoSalaVIP(Math.floor(totalCards * 0.01));
      setContestacoes(Math.floor(totalCards * 0.005));

      // 6. Dados Estratégicos Analíticos
      setKpiOportunidades(Math.floor(totalCards * 1.5));
      setOportunidadesSeries([{x:1,y:10}, {x:2,y:40}, {x:3,y:25}, {x:4,y:60}]);
      
      setKpiPropensao(Math.floor(totalCards * 0.1));
      setPropensaoSeries([{x:1,y:20}, {x:2,y:10}, {x:3,y:15}, {x:4,y:8}]);

      setKpiQueda(Math.floor(totalCards * 0.02));
      setQuedaSeries([{x:1,y:30}, {x:2,y:15}, {x:3,y:10}, {x:4,y:5}]);

    } catch (error) {
      console.error("Erro dashboard", error);
    } finally {
      setLoading(false);
    }
  }

  const fmtBRL = (v: number) => "R$ " + Math.round(v).toLocaleString("pt-BR");

  if(loading) return <div className="p-8 text-center text-gray-500">Carregando Dashboard...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* ABAS */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("estrategica")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              tab === "estrategica"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            Visão Estratégica
          </button>
          <button
            onClick={() => setTab("operacional")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              tab === "operacional"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            Visão Operacional
          </button>
        </div>

        {/* Filtros Reais */}
        <div className="flex items-center gap-3">
          {usuario.perfil === "Central" && (
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
              value={coopSelecionada}
              onChange={(e) => {
                setCoopSelecionada(e.target.value);
                setPaSelecionado("");
              }}
            >
              <option value="">Todas as Cooperativas</option>
              {listaCoops
                .filter((c) => c.central_id === usuario.centralId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
            </select>
          )}

          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
            value={paSelecionado}
            onChange={(e) => setPaSelecionado(e.target.value)}
            disabled={usuario.perfil === "Central" && !coopSelecionada}
          >
            <option value="">Todos os PAs</option>
            {listaPAs
              .filter((pa) => {
                  if (usuario.perfil === 'Cooperativa') return pa.cooperativa_id === usuario.cooperativaId;
                  if (coopSelecionada) return pa.cooperativa_id === coopSelecionada;
                  return true;
              })
              .map((pa) => (
                <option key={pa.id} value={pa.id}>
                  {pa.nome}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Conteúdo da aba */}
      {tab === "estrategica" ? (
        <div className="space-y-6">
          {/* Linha 1: KPIs principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Transações Hoje */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="text-sm text-gray-500 font-bold uppercase">Transações Hoje</div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-3xl font-extrabold text-gray-900">{kpiTransacoesHoje.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase">Maior que o último mês</div>
                </div>
                <div style={{ width: 140, height: 70 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsArea data={transacoesSeries}>
                      <Area dataKey="valor" stroke="#111827" fill="#6B7280" fillOpacity={0.12} />
                    </RechartsArea>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Limite de Crédito */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="text-sm text-gray-500 font-bold uppercase">Limite de Crédito</div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-gray-900">
                    {limiteUtilizado + limiteDisponivel > 0 
                        ? Math.round((limiteUtilizado / (limiteUtilizado + limiteDisponivel)) * 100) 
                        : 0}%
                </div>
                <div className="text-xs text-gray-400 uppercase">De limit. total utilizado no mês</div>
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Utilizado</span><span>{fmtBRL(limiteUtilizado)}</span></div>
                  <div className="flex justify-between font-bold text-green-700"><span>Disponível</span><span>{fmtBRL(limiteDisponivel)}</span></div>
                </div>
              </div>
              <div className="mt-4" style={{ width: "100%", height: 60 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={[
                        { name: "Used", value: limiteUtilizado },
                        { name: "Avail", value: limiteDisponivel },
                      ]}
                      innerRadius={18}
                      outerRadius={28}
                      dataKey="value"
                      startAngle={180}
                      endAngle={-180}
                    >
                      <Cell fill="#111827" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ticket Médio */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="text-sm text-gray-500 font-bold uppercase">Ticket Médio</div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-gray-900">{ticketMedio}</div>
                  <div className="text-xs text-gray-400 uppercase">Valor médio das transações</div>
                </div>
                <div style={{ width: 120, height: 60 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsArea data={transacoesSeries}>
                      <Area dataKey="valor" stroke="#111827" fill="#6B7280" fillOpacity={0.08} />
                    </RechartsArea>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Total de Cartões */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="text-sm text-gray-500 font-bold uppercase">Total de Cartões</div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-gray-900">{kpiTotalCartoes.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase">Cartões ativos</div>
                </div>
                <div style={{ width: 120, height: 60 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBar data={[{ name: "T", v: kpiTotalCartoes }]}>
                      <Bar dataKey="v" fill="#111827" />
                    </RechartsBar>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Linha 2: volume modal + faturas + aderência */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Volume por Modalidade (donut com legenda) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Volume por modalidade</h3>
                <div className="text-xs text-gray-400">R$</div>
              </div>

              <div className="flex items-center mt-4">
                <div style={{ width: 160, height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={volumeModalidadeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={72}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        <Cell fill="#111827" />
                        <Cell fill="#6B7280" />
                        <Cell fill="#9CA3AF" />
                      </Pie>
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                <div className="ml-6 text-sm text-gray-700 space-y-2">
                  {volumeModalidadeData.map((d) => (
                    <div key={d.name} className="flex justify-between w-40">
                      <div className="flex items-center gap-2">
                        <div style={{ width: 10, height: 10, borderRadius: 4, background: d.name === "Débito" ? "#111827" : d.name === "Crédito" ? "#6B7280" : "#9CA3AF" }} />
                        <div>{d.name}</div>
                      </div>
                      <div className="font-bold">{Math.round(d.value).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Faturas (donut + números) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Faturas</h3>
                <div className="text-sm text-gray-400">Status</div>
              </div>

              <div className="flex items-center mt-4">
                <div style={{ width: 140, height: 140 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={faturasData}
                        cx="50%"
                        cy="50%"
                        innerRadius={44}
                        outerRadius={66}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        <Cell fill="#111827" />
                        <Cell fill="#6B7280" />
                        <Cell fill="#9CA3AF" />
                      </Pie>
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                <div className="ml-6">
                  {faturasData.length > 0 && (
                    <>
                    <div className="text-2xl font-extrabold text-gray-900">{Math.floor(faturasData[0].value).toLocaleString()}</div>
                    <div className="text-xs text-gray-400 uppercase">Pagas</div>
                    <div className="mt-3 text-sm text-gray-700">
                        <div className="flex justify-between"><span>Abertas</span><span>{Math.floor(faturasData[1].value).toLocaleString()}</span></div>
                        <div className="flex justify-between mt-1"><span>Atrasadas</span><span>{Math.floor(faturasData[2].value).toLocaleString()}</span></div>
                    </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Aderência (gauge semi-donut com número grande) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 font-bold uppercase">Aderência</div>
              <div className="relative flex items-center justify-center mt-4">
                <div style={{ width: 160, height: 100 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie startAngle={180} endAngle={0}>
                      <Pie
                        data={[{ name: "Ativos", value: aderenciaPct }, { name: "Inativos", value: 100 - aderenciaPct }]}
                        cx="50%"
                        cy="100%"
                        innerRadius={48}
                        outerRadius={80}
                        dataKey="value"
                      >
                        <Cell fill="#111827" />
                        <Cell fill="#E5E7EB" />
                      </Pie>
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                {/* número grande sobreposto */}
                <div className="absolute text-center" style={{ transform: "translateY(8px)" }}>
                  <div className="text-4xl font-extrabold text-gray-900">{aderenciaPct}%</div>
                  <div className="text-xs text-gray-400 uppercase">cooperados com cartão ativo</div>
                </div>
              </div>

              {/* segundo indicador de ativação (menor) */}
              <div className="mt-6 text-center">
                <div className="text-3xl font-bold text-gray-900">{ativacaoPct}%</div>
                <div className="text-xs text-gray-400 uppercase">de ativação para novos cartões</div>
              </div>
            </div>
          </div>

          {/* Linha 3: Emissões / Cancelamentos / Emissões por produto */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Cartões emitidos</div>
              <div className="text-4xl font-extrabold text-gray-900 mt-4">{cartoesEmitidos.toLocaleString()}</div>
              <div className="text-xs text-red-500 font-bold mt-2 uppercase">▼ 3% vs último mês</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Cancelamentos</div>
              <div className="text-4xl font-extrabold text-gray-900 mt-4">{cartoesCancelados.toLocaleString()}</div>
              <div className="text-xs text-green-600 font-bold mt-2 uppercase">▼ 1% vs último mês</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Emissões por produto</div>
              <div className="mt-4 text-sm space-y-2">
                {emissoesPorProduto.map((prod, idx) => (
                    <div key={idx} className="flex justify-between"><span>{prod.name}</span><span className="font-bold">{prod.value.toLocaleString()}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Linha 4: Inadimplência (grande) + chargebacks / tendência */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
              <div className="text-sm text-gray-500 font-bold uppercase mb-4">Inadimplência</div>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBar data={inadimplenciaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="cat" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Bar dataKey="pj" fill="#111827" />
                    <Bar dataKey="pf" fill="#9CA3AF" />
                  </RechartsBar>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-sm text-gray-500 font-bold uppercase">Tendência de atraso</div>
                <div className="text-4xl font-extrabold text-gray-900 mt-4">{tendenciaAtraso}%</div>
                <div className="text-xs text-green-600 font-bold mt-2 uppercase">▼ 1% vs último mês</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-sm text-gray-500 font-bold uppercase">Chargebacks</div>
                <div className="text-3xl font-extrabold text-gray-900 mt-4">{fmtBRL(chargebacks)}</div>
                <div className="text-xs text-green-600 font-bold mt-2 uppercase">▼ 3% vs último mês</div>
              </div>
            </div>
          </div>

          {/* Linha 5: Oportunidades / Propensão / Queda (microcharts) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Oportunidades</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{kpiOportunidades.toLocaleString()}</div>
              <div style={{ height: 60, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsArea data={oportunidadesSeries}>
                    <Area dataKey="y" stroke="#111827" fill="#6B7280" fillOpacity={0.12} />
                  </RechartsArea>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Propensão a Upgrade</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{kpiPropensao.toLocaleString()}</div>
              <div style={{ height: 60, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsArea data={propensaoSeries}>
                    <Area dataKey="y" stroke="#111827" fill="#6B7280" fillOpacity={0.12} />
                  </RechartsArea>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Queda de uso</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{kpiQueda.toLocaleString()}</div>
              <div style={{ height: 60, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsArea data={quedaSeries}>
                    <Area dataKey="y" stroke="#111827" fill="#6B7280" fillOpacity={0.12} />
                  </RechartsArea>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VISÃO OPERACIONAL */
        <div className="space-y-6">
          {/* Linha 1 operacional: Gestão da base / Sol. recentes / Cartões ativos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Solicitações recentes de cartões</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{solicitacoesRecentes.toLocaleString()}</div>
              <div style={{ height: 60, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsArea data={[{ d: 1, v: 10 }, { d: 2, v: 20 }, { d: 3, v: 15 }]}>
                    <Area dataKey="v" stroke="#111827" fill="#6B7280" fillOpacity={0.08} />
                  </RechartsArea>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Cartões ativos x inativos</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{kpiTotalCartoes.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Ativos: {ativosVsInativos[0]?.value} • Inativos: {ativosVsInativos[1]?.value}</div>
              <div style={{ marginTop: 10, height: 60 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie data={ativosVsInativos} innerRadius={18} outerRadius={28} dataKey="value">
                      <Cell fill="#111827" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Cartões bloqueados/desbloqueados</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{bloqueadosVsDesbloqueados[0]?.v}</div>
              <div style={{ marginTop: 10, height: 60 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBar data={bloqueadosVsDesbloqueados}>
                    <Bar dataKey="v" fill="#111827" />
                  </RechartsBar>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Linha 2 operacional: Processos / Emissões por BIN / Entregas pendentes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Emissões por BIN</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{emissoesBIN.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Controla volume de cartões produzidos</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Entregas pendentes</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{entregasPendentes.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Mostra cartões ainda não recebidos</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Carteiras cadastradas</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{walletsData.reduce((acc, w) => acc + w.uso, 0)}</div>
              <div style={{ marginTop: 10, height: 80 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBar layout="vertical" data={walletsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} style={{fontSize: '10px'}} />
                    <Tooltip />
                    <Bar dataKey="uso" fill="#111827" />
                  </RechartsBar>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Linha 3 operacional: Serviços adicionais / Sala VIP / Limites */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Serviços Adicionais (SMS / Seguro)</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{fmtBRL(valorServicos)}</div>
              <div className="text-xs text-gray-400 mt-1">Receita / adesões</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Uso de Benefícios - Sala VIP</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{usoSalaVIP.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Volume de utilização</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 font-bold uppercase">Contestações</div>
              <div className="text-3xl font-extrabold text-gray-900 mt-4">{contestacoes.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Registros abertos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- TIPOS ATUALIZADOS PARA COOPERADOS ---
type StatusConta = "Ativa" | "Bloqueada";
type TipoVinculo = "Titular" | "Adicional" | "Kids";
type FuncaoCartao = "Credito" | "Debito" | "Multiplo";

type Endereco = {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
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
  paVinculado: string;
  documentoVinculado: string;
};

type CartaoResumo = {
  id: string;
  numeroMascarado: string;
  funcao: FuncaoCartao;
  status: StatusConta;
  paVinculado: string;
  tipo: TipoVinculo;
  titularVinculadoId?: number;
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
  cnpj?: string;
  socios?: Socio[];
  email: string;
  telefone: string;
  gerente: Gerente;
  enderecoEntrega: Endereco;
  contasCorrentes: ContaCorrente[];
  contasCartoes: CartaoResumo[];
  centralId: string;
  cooperativaId: string;
  pontoAtendimentoPrincipalId: string;
};

// =======================================================================
// PÁGINA DE COOPERADOS (CORRIGIDA E BLINDADA)
// =======================================================================

function PaginaCooperados({ usuario }: { usuario: any }) {
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedCooperado, setSelectedCooperado] = useState<CooperadoDetalhado | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cooperadosReais, setCooperadosReais] = useState<CooperadoDetalhado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCooperadosCompletos();
  }, [usuario]);

  async function fetchCooperadosCompletos() {
    setLoading(true);
    try {
      // 1) busca todos os cooperados
      const { data: cooperados, error: coopErr } = await supabase
        .from('cooperados')
        .select('*');

      if (coopErr) throw coopErr;
      if (!cooperados) {
        setCooperadosReais([]);
        return;
      }

      // 2) busca todos os cartões relacionados em 1 única query (mais eficiente)
      const coopIds = cooperados.map((c: any) => c.id);
      const { data: allCartoes, error: cartErr } = await supabase
        .from('cartoes')
        .select('*')
        .in('cooperado_id', coopIds);

      if (cartErr) throw cartErr;

      // 3) agrupa cartões por cooperado_id
      const cartoesByCoop: Record<string, any[]> = {};
      (allCartoes || []).forEach((card: any) => {
        const key = String(card.cooperado_id);
        if (!cartoesByCoop[key]) cartoesByCoop[key] = [];
        cartoesByCoop[key].push(card);
      });

      // 4) mescla os cartões no objeto de cada cooperado
      const cooperadosComCartoes = cooperados.map((c: any) => ({
        ...c,
        cartoes: cartoesByCoop[String(c.id)] || []
      }));

      // 5) formata para a estrutura CooperadoDetalhado
      const formatados: CooperadoDetalhado[] = cooperadosComCartoes.map((item: any) => ({
        id: item.id,
        nome: item.nome || "Sem Nome",
        cpf: item.cpf || "",
        email: item.email || "",
        telefone: item.telefone || "",
        cnpj: undefined,
        socios: [],

        gerente: {
          nome: "Gerente da Conta",
          usuarioSistema: "gerente.pa"
        },
        enderecoEntrega: {
          logradouro: "Endereço não informado",
          numero: "S/N",
          bairro: "-",
          cidade: "-",
          uf: "-",
          cep: "00000-000"
        },

        centralId: item.central_id,
        cooperativaId: item.cooperativa_id,
        pontoAtendimentoPrincipalId: String(item.ponto_atendimento_id || "Não Vinculado"),

        contasCorrentes: item.contas_correntes ? item.contas_correntes.map((cc: any) => ({
          id: cc.id,
          banco: cc.banco || "Sicoob",
          agencia: cc.agencia,
          numero: cc.numero,
          dataAbertura: cc.created_at ? new Date(cc.created_at).toLocaleDateString('pt-BR') : '-',
          status: cc.status,
          paVinculado: String(cc.ponto_atendimento_id || ""),
          documentoVinculado: item.cpf
        })) : [],

        contasCartoes: (item.cartoes ? item.cartoes : []).map((card: any) => ({
          id: card.id,
          numeroMascarado: card.numero_mascarado,
          funcao: card.funcao,
          status: card.status === 'ativo' ? 'Ativa' : 'Bloqueada',
          paVinculado: String(card.ponto_atendimento_id || ""),
          tipo: "Titular",
          nomeImpresso: card.nome_impresso
        }))
      }));

      setCooperadosReais(formatados);

    } catch (error) {
      console.error("Erro ao buscar cooperados:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filtros de segurança
  const cooperadosVisiveis = cooperadosReais.filter((coop) => {
      if (usuario.perfil === "Master") return true; 
      if (usuario.perfil === "Central") return coop.centralId === usuario.centralId;
      if (usuario.perfil === "Cooperativa") return coop.cooperativaId === usuario.cooperativaId;
      if (usuario.perfil === "PA") return coop.pontoAtendimentoPrincipalId === usuario.pontoAtendimentoId;
      return false;
  });

  const filteredCooperados = cooperadosVisiveis.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hub-teal"></div>
        <p className="mt-4 text-gray-500">Carregando carteira de cooperados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {viewMode === "list" ? "Gestão de Cooperados" : `Detalhe: ${selectedCooperado?.nome}`}
        </h2>
        {viewMode === "detail" && (
          <button
            onClick={() => { setViewMode("list"); setSelectedCooperado(null); }}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
          </button>
        )}
      </div>

      {viewMode === "list" ? (
        <ListaCooperados
          cooperados={filteredCooperados}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelect={(c) => { setSelectedCooperado(c); setViewMode("detail"); }}
        />
      ) : (
        selectedCooperado && <DetalheCooperado cooperado={selectedCooperado} />
      )}
    </div>
  );
}

function ListaCooperados({
  cooperados,
  searchTerm,
  setSearchTerm,
  onSelect,
}: {
  cooperados: CooperadoDetalhado[];
  searchTerm: string;
  setSearchTerm: (t: string) => void;
  onSelect: (c: CooperadoDetalhado) => void;
}) {
  const getFuncaoBadge = (cards: CartaoResumo[]) => {
    const principal = cards && cards.length > 0 ? cards[0] : null;
    if (!principal) return <span className="text-xs text-gray-400">Sem Cartão</span>;
    return (
      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100">
        {principal.funcao}
      </span>
    );
  };

  const getTipoBadge = (cards: CartaoResumo[]) => {
    const tipo = (cards && cards.length > 0) ? cards[0].tipo : "Titular";
    const color = tipo === "Kids" ? "bg-pink-100 text-pink-800" : 
                  tipo === "Adicional" ? "bg-purple-100 text-purple-800" : 
                  "bg-gray-100 text-gray-800";
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{tipo}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar por nome, CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PA</th>
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
                  <div className="text-sm text-gray-900">{coop.cpf}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getTipoBadge(coop.contasCartoes)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getFuncaoBadge(coop.contasCartoes)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="text-xs font-mono bg-gray-100 inline px-1 rounded">
                    {String(coop.pontoAtendimentoPrincipalId).toUpperCase().replace("_", " ")}
                  </div>
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
            {cooperados.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500">Nenhum cooperado encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function DetalheCooperado({ cooperado }: { cooperado: CooperadoDetalhado }) {
  const [showModalBloqueio, setShowModalBloqueio] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Detalhe */}
      <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-hub-teal flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{cooperado.nome}</h3>
          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
            <span>ID: {cooperado.id}</span>
            <span>•</span>
            <span className="flex items-center"><UserCheck className="w-4 h-4 mr-1"/> {cooperado.gerente?.nome}</span>
          </div>
        </div>
        <button 
          onClick={() => setShowModalBloqueio(true)}
          className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
        >
          <ShieldAlert className="w-5 h-5 mr-2"/> Bloqueios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dados Pessoais */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-3">
          <h4 className="font-semibold text-gray-800 border-b pb-2">Dados Cadastrais</h4>
          <p className="text-sm"><span className="text-gray-500 block">CPF</span> {cooperado.cpf}</p>
          <p className="text-sm"><span className="text-gray-500 block">Email</span> {cooperado.email}</p>
          <p className="text-sm"><span className="text-gray-500 block">Telefone</span> {cooperado.telefone}</p>
        </div>

        {/* Cartões e Contas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4">Produtos Vinculados</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr><th>Produto</th><th>Detalhe</th><th>Status</th></tr>
              </thead>
              <tbody className="divide-y">
                {cooperado.contasCartoes.map((card, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-2 font-medium">{card.nomeImpresso}</td>
                    <td className="py-2 px-2 text-gray-500">{card.numeroMascarado} ({card.funcao})</td>
                    <td className="py-2 px-2"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">{card.status}</span></td>
                  </tr>
                ))}
                {cooperado.contasCartoes.length === 0 && <tr><td colSpan={3} className="p-2 text-center text-gray-400">Sem cartões</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModalBloqueio && (
        <ModalBloqueioCooperado cooperado={cooperado} onClose={() => setShowModalBloqueio(false)} />
      )}
    </div>
  );
}

function ModalBloqueioCooperado({ cooperado, onClose }: { cooperado: CooperadoDetalhado; onClose: () => void }) {
  const [cartoesSelecionados, setCartoesSelecionados] = useState<Record<string, boolean>>({});
  const [motivo, setMotivo] = useState('');

  const toggleCartao = (id: string) => {
    setCartoesSelecionados(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSalvarBloqueio = () => {
    const cartoes = Object.keys(cartoesSelecionados).filter(k => cartoesSelecionados[k]);
    alert(`Bloqueio Aplicado!\nCartões: ${cartoes.join(', ')}\nMotivo: ${motivo}`);
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
// 10. A PÁGINA DE CARTÕES (ATUALIZADA - CONFIGURAÇÕES DE JUROS)
// =======================================================================

type CartaoStatus = "ativo" | "vencido" | "bloqueado_preventivo" | "cancelado";
type CartaoFuncao = "Credito" | "Debito" | "Multiplo";

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
  juros: number;
  percRotativo: number;
  percSaque: number;
  percJurosEmissor: number;
  percJurosCrediario: number;
  percParcelamentoFatura: number;
  percParcelamentoRotativo: number;
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
  status: "Ativo" | "Vencido" | "Cancelado" | "Em Entrega";
};

// --- Mocks Atualizados ---
const mockKpiCartoes = {
  ativos: 8,
  bloqueados: 2,
  vencidos: 2,
};

const mockListaDeCartoes: Cartao[] = [
  {
    id: 1,
    idCartao: "900101",
    cooperado: "Fernanda Lima Santos",
    cooperativa: "Crediserv",
    conta: "12345-6",
    numeroMascarado: "4984 **** **** 1001",
    tipo: "classic",
    funcao: "Multiplo",
    bandeira: "VISA",
    limite: 6000,
    disponivel: 1200,
    validade: "12/11/2023",
    status: "vencido",
  },
  {
    id: 2,
    idCartao: "900102",
    cooperado: "Carlos Eduardo Souza",
    cooperativa: "Coopesa",
    conta: "54321-0",
    numeroMascarado: "5200 **** **** 2045",
    tipo: "gold",
    funcao: "Credito",
    bandeira: "MASTERCARD",
    limite: 12000,
    disponivel: 3600,
    validade: "12/11/2026",
    status: "bloqueado_preventivo",
  },
];

const mockEntregaCartoes: CartaoEntrega[] = [
  {
    id: 1,
    cooperado: "Ana Beatriz Silva",
    cooperativa: "Crediserv",
    pa: "PA 05",
    enderecoEntrega: "Rua das Flores, 123, Centro - SP",
    tipoCartao: "Visa Infinite",
    status: "Em entrega",
    dataCriacao: "10/11/2025",
    previsaoEntrega: "20/11/2025",
    rastreio: "BR123456789",
  },
];

const mockHistoricoCartoes: HistoricoCartao[] = [
  {
    id: 1,
    numeroMascarado: "4111 11** **** 9988",
    dataEmissao: "10/01/2025",
    dataVencimento: "01/2030",
    tipoProduto: "Visa Infinite",
    status: "Ativo",
  },
];

const mockAnuidadeProdutos: ProdutoAnuidade[] = [
  {
    id: 1,
    nome: "Infinite",
    valorTitular: 480.0,
    valorAdicional: 240.0,
  },
];

const mockRegrasDesconto: RegraDesconto[] = [
  { id: 1, gasto: 4000, desconto: 50, produto: "Infinite" },
];

const mockConfiguracoesProduto: ProdutoConfig[] = [
  {
    id: 1,
    nome: "Infinite",
    multa: 2.0,
    mora: 10.0,
    juros: 1.5,
    percRotativo: 12.5,
    percSaque: 3.5,
    percJurosEmissor: 2.0,
    percJurosCrediario: 4.5,
    percParcelamentoFatura: 5.0,
    percParcelamentoRotativo: 8.5,
    custosReposicao: [
      { cooperativa: "Crediserv", valor: 25.0 },
      { cooperativa: "Coopesa", valor: 30.0 },
    ],
  },
];

type CartoesViewMode =
  | "lista"
  | "upgrade"
  | "anuidade_cooperado"
  | "anuidade_produto"
  | "configuracoes_produto"
  | "acompanhar_entrega";

// --- Componente PAI da Página Cartões ---
function PaginaCartoes({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] =
    useState<CartoesViewMode>("lista");

  const renderView = () => {
    switch (viewMode) {
      case "lista":
        return (
          <ViewListaPrincipalCartoes
            kpis={mockKpiCartoes}
            cartoes={mockListaDeCartoes}
            usuario={usuario}
          />
        );
      case "acompanhar_entrega":
        return (
          <ViewAcompanharEntrega
            entregas={mockEntregaCartoes}
          />
        );
      case "upgrade":
        return <ViewUpgradeDowngrade />;
      case "anuidade_cooperado":
        return <ViewAnuidadeCooperado />;
      case "anuidade_produto":
        return <ViewAnuidadeProduto />;
      case "configuracoes_produto":
        return <ViewConfiguracoesProduto />;
      default:
        return (
          <ViewListaPrincipalCartoes
            kpis={mockKpiCartoes}
            cartoes={mockListaDeCartoes}
            usuario={usuario}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1">
        <SubMenuButton
          label="Gestão de Cartões"
          active={viewMode === "lista"}
          onClick={() => setViewMode("lista")}
        />
        <SubMenuButton
          label="Acompanhar Entrega"
          active={viewMode === "acompanhar_entrega"}
          onClick={() => setViewMode("acompanhar_entrega")}
        />
        <SubMenuButton
          label="Upgrade/Downgrade"
          active={viewMode === "upgrade"}
          onClick={() => setViewMode("upgrade")}
        />
        <SubMenuButton
          label="Anuidade (Cooperado)"
          active={viewMode === "anuidade_cooperado"}
          onClick={() => setViewMode("anuidade_cooperado")}
        />
        <SubMenuButton
          label="Anuidade (Produto)"
          active={viewMode === "anuidade_produto"}
          onClick={() => setViewMode("anuidade_produto")}
        />
        <SubMenuButton
          label="Configurações"
          active={viewMode === "configuracoes_produto"}
          onClick={() => setViewMode("configuracoes_produto")}
        />
      </div>
      <div>{renderView()}</div>
    </div>
  );
}

// --- View 1: Lista Principal ---
function ViewListaPrincipalCartoes({
  kpis,
  cartoes,
  usuario,
}: {
  kpis: typeof mockKpiCartoes;
  cartoes: Cartao[];
  usuario: User;
}) {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [filtroCoop, setFiltroCoop] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartaoSelecionado, setCartaoSelecionado] =
    useState<Cartao | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const cartoesFiltrados = cartoes.filter((c) => {
    const matchText =
      c.cooperado
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.idCartao.includes(searchTerm) ||
      c.numeroMascarado.includes(searchTerm);
    const matchStatus =
      statusFilter === "todos" || c.status === statusFilter;
    const matchCoop =
      filtroCoop === "" || c.cooperativa === filtroCoop;
    return matchText && matchStatus && matchCoop;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Cartões Ativos"
          value={kpis.ativos.toString()}
          change=""
          changeType="info"
          icon={CreditCard}
        />
        <KpiCard
          title="Cartões Bloqueados"
          value={kpis.bloqueados.toString()}
          change=""
          changeType="info"
          icon={ShieldAlert}
        />
        <KpiCard
          title="Cartões Vencidos"
          value={kpis.vencidos.toString()}
          change=""
          changeType="info"
          icon={AlertCircle}
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Busca
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, ID ou cartão..."
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Cooperativa
            </label>
            <select
              value={filtroCoop}
              onChange={(e) => setFiltroCoop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todas</option>
              <option value="Coopesa">Coopesa</option>
              <option value="Crediserv">Crediserv</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="bloqueado_preventivo">
                Bloqueado
              </option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID / Cartão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cooperado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Limite / Disp.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cartoesFiltrados.map((cartao) => (
                <tr
                  key={cartao.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">
                      #{cartao.idCartao}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {cartao.numeroMascarado}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cartao.cooperado}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cartao.cooperativa} | {cartao.conta}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-bold text-gray-800">
                      {cartao.limite.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                    <div className="text-xs text-green-600">
                      {cartao.disponivel.toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" },
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${cartao.status === "ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {cartao.status.replace("_", " ")}
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
function ModalDetalheCartao({
  cartao,
  onClose,
  onUpdate,
}: {
  cartao: Cartao;
  onClose: () => void;
  onUpdate: (s: string) => void;
}) {
  const [novoStatus, setNovoStatus] = useState(cartao.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center pb-4 border-b mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Detalhes do Cartão
          </h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Bloco Visual do Cartão */}
          <div className="col-span-2 md:col-span-1 flex justify-center items-center bg-gray-100 rounded-lg p-4">
            <div className="w-full h-40 bg-gray-800 rounded-xl p-5 flex flex-col justify-between text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <CreditCard className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-center z-10">
                <span className="text-lg font-bold">
                  {cartao.bandeira}
                </span>
                <span className="text-xs uppercase">
                  {cartao.tipo}
                </span>
              </div>
              <div className="mt-4 z-10">
                <p className="text-sm tracking-widest font-mono">
                  {cartao.numeroMascarado}
                </p>
                <p className="text-xs mt-2 opacity-75">
                  VALIDADE {cartao.validade}
                </p>
                <p className="text-md font-medium tracking-wider mt-1 uppercase truncate">
                  {cartao.cooperado}
                </p>
              </div>
            </div>
          </div>

          {/* Dados Detalhados */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div>
              <label className="text-xs text-gray-500">
                ID Interno
              </label>
              <p className="font-medium">{cartao.idCartao}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">
                Conta Corrente
              </label>
              <p className="font-medium">{cartao.conta}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">
                Função
              </label>
              <p className="font-medium">{cartao.funcao}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">
                Cooperativa
              </label>
              <p className="font-medium">
                {cartao.cooperativa}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">
                Limite Total
              </label>
              <p className="font-bold text-hub-teal">
                {cartao.limite.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Área de Ação (Status) */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-700 mb-2">
            Gerenciar Status
          </h4>
          <div className="flex items-center space-x-4">
            <select
              value={novoStatus}
              onChange={(e) =>
                setNovoStatus(e.target.value as CartaoStatus)
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="ativo">Ativo</option>
              <option value="bloqueado_preventivo">
                Bloqueado Preventivo
              </option>
              <option value="cancelado">
                Cancelado (Perda/Roubo)
              </option>
            </select>
            <button
              onClick={() => onUpdate(novoStatus)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-accent transition font-medium"
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
function ViewAcompanharEntrega({
  entregas,
}: {
  entregas: CartaoEntrega[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Rastreamento de Cartões
        </h3>
        <p className="text-sm text-gray-500">
          Status de produção e entrega.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cooperado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Origem (Coop/PA)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cartão / Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Endereço de Entrega
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status / Rastreio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entregas.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.cooperado}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{item.cooperativa}</div>
                  <div className="text-xs font-mono">
                    {item.pa}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="font-bold">
                    {item.tipoCartao}
                  </div>
                  <div className="text-xs">
                    Solicitado: {item.dataCriacao}
                  </div>
                </td>
                <td
                  className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                  title={item.enderecoEntrega}
                >
                  {item.enderecoEntrega}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                    {item.status}
                  </span>
                  {item.rastreio && (
                    <div className="text-xs mt-1 font-mono text-gray-500">
                      {item.rastreio}
                    </div>
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

// --- View 3: Upgrade/Downgrade ---
function ViewUpgradeDowngrade() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cooperadoEncontrado, setCooperadoEncontrado] =
    useState(false);

  const handleSearch = () => {
    if (searchTerm.length > 3) setCooperadoEncontrado(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800 border-green-200";
      case "Vencido":
        return "bg-red-100 text-red-800 border-red-200";
      case "Cancelado":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "Em Entrega":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-50 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">
          Solicitar Upgrade ou Downgrade
        </h3>
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
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {cooperadoEncontrado && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h4 className="text-lg font-bold text-gray-800">
              Histórico de Cartões - Ana Beatriz Silva
            </h4>
            <button
              className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent transition"
            >
              <ArrowDownUp className="w-4 h-4 mr-2" /> Nova
              Solicitação
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-white border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Emissão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockHistoricoCartoes.map((hist) => (
                  <tr key={hist.id}>
                    <td className="px-6 py-4 text-sm font-medium">
                      {hist.tipoProduto}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {hist.numeroMascarado}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {hist.dataEmissao}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {hist.dataVencimento}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getStatusBadge(hist.status)}`}
                      >
                        {hist.status.toUpperCase()}
                      </span>
                    </td>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [cooperado, setCooperado] = useState<any | null>(null);

  const handleSearch = () => {
    if (searchTerm)
      setCooperado({
        nome: "Ana Beatriz Silva",
        cpf: "123.***.***-00",
        produto: "Visa Infinite",
        dataCobranca: "10/01/2025",
        parcelas: 12,
        totalContratado: 480.0,
        valorPendente: 360.0,
      });
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Gestão de Anuidade por Cooperado
      </h3>
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
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {cooperado && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-800">
                {cooperado.nome}
              </h4>
              <p className="text-sm text-gray-500">
                {cooperado.cpf}
              </p>
            </div>
            <div className="text-right">
              <span
                className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded"
              >
                {cooperado.produto}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Data Cobrança
              </label>
              <p className="font-medium">
                {cooperado.dataCobranca}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Parcelamento
              </label>
              <p className="font-medium">
                {cooperado.parcelas}x
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Total Contratado
              </label>
              <p className="font-bold text-green-700">
                R$ {cooperado.totalContratado.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">
                Valor Pendente
              </label>
              <p className="font-bold text-red-700">
                R$ {cooperado.valorPendente.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100 text-gray-700">
              <Edit2 className="w-4 h-4 mr-2" /> Renegociar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- View 5: Anuidade Produto ---
function ViewAnuidadeProduto() {
  const [anuidades, setAnuidades] = useState(
    mockAnuidadeProdutos,
  );
  const [regras, setRegras] = useState(mockRegrasDesconto);

  const handleAnuidadeChange = (
    id: number,
    campo: "valorTitular" | "valorAdicional",
    valor: number,
  ) => {
    setAnuidades(
      anuidades.map((a) =>
        a.id === id ? { ...a, [campo]: valor } : a,
      ),
    );
  };

  const addRegra = () => {
    setRegras([
      ...regras,
      {
        id: Date.now(),
        gasto: 0,
        desconto: 0,
        produto: "Selecione...",
      },
    ]);
  };

  const addProduto = () => {
    setAnuidades([
      ...anuidades,
      {
        id: Date.now(),
        nome: "Novo Produto",
        valorTitular: 0,
        valorAdicional: 0,
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Anuidade Base por Produto
          </h3>
          <button
            onClick={addProduto}
            className="p-2 bg-primary text-primary-foreground rounded-full shadow-sm hover:bg-accent transition"
            title="Adicionar Produto"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {anuidades.map((prod) => (
            <div
              key={prod.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h4 className="text-lg font-medium text-gray-800 mb-3">
                {prod.nome}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Valor Titular (R$)
                  </label>
                  <input
                    type="number"
                    value={prod.valorTitular}
                    onChange={(e) =>
                      handleAnuidadeChange(
                        prod.id,
                        "valorTitular",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-hub-teal outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Valor Adicional (R$)
                  </label>
                  <input
                    type="number"
                    value={prod.valorAdicional}
                    onChange={(e) =>
                      handleAnuidadeChange(
                        prod.id,
                        "valorAdicional",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-hub-teal outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="w-full px-4 py-2 text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition">
            <Save className="w-5 h-5 inline mr-2" /> Salvar
            Anuidades
          </button>
        </div>
      </div>

      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Regras de Desconto
          </h3>
          <button
            onClick={addRegra}
            className="p-2 bg-primary text-primary-foreground rounded-full shadow-sm hover:bg-accent transition"
            title="Adicionar Regra"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {regras.map((regra, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
            >
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 block">
                  Gasto Mensal
                </label>
                <input
                  type="number"
                  value={regra.gasto}
                  className="w-full px-1 border rounded text-sm focus:ring-1 focus:ring-hub-teal outline-none"
                  onChange={(e) => {
                    const newRegras = [...regras];
                    newRegras[idx].gasto = parseFloat(
                      e.target.value,
                    );
                    setRegras(newRegras);
                  }}
                />
              </div>
              <div className="w-20">
                <label className="text-[10px] text-gray-500 block">
                  Desc (%)
                </label>
                <input
                  type="number"
                  value={regra.desconto}
                  className="w-full px-1 border rounded text-sm focus:ring-1 focus:ring-hub-teal outline-none"
                  onChange={(e) => {
                    const newRegras = [...regras];
                    newRegras[idx].desconto = parseFloat(
                      e.target.value,
                    );
                    setRegras(newRegras);
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 block">
                  Produto
                </label>
                <input
                  type="text"
                  value={regra.produto}
                  className="w-full px-1 border rounded text-sm focus:ring-1 focus:ring-hub-teal outline-none"
                  onChange={(e) => {
                    const newRegras = [...regras];
                    newRegras[idx].produto = e.target.value;
                    setRegras(newRegras);
                  }}
                />
              </div>
            </div>
          ))}
          <button className="w-full px-4 py-2 mt-4 text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition">
            <Save className="w-5 h-5 inline mr-2" /> Salvar
            Regras
          </button>
        </div>
      </div>
    </div>
  );
}

// --- View 6: Configurações do Produto (ATUALIZADA - NOVOS CAMPOS) ---
function ViewConfiguracoesProduto() {
  const [configs, setConfigs] = useState(
    mockConfiguracoesProduto,
  );

  const updateVal = (
    id: number,
    field: keyof ProdutoConfig,
    val: string,
  ) => {
    setConfigs(
      configs.map((c) =>
        c.id === id
          ? { ...c, [field]: parseFloat(val) || 0 }
          : c,
      ),
    );
  };

  const addConfig = () => {
    setConfigs([
      ...configs,
      {
        id: Date.now(),
        nome: "Novo Produto",
        multa: 0,
        mora: 0,
        juros: 0,
        percRotativo: 0,
        percSaque: 0,
        percJurosEmissor: 0,
        percJurosCrediario: 0,
        percParcelamentoFatura: 0,
        percParcelamentoRotativo: 0,
        custosReposicao: [{ cooperativa: "Padrão", valor: 0 }],
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Configurações Financeiras por Produto
          </h3>
          <p className="text-sm text-gray-500">
            Defina as taxas e custos para Gold, Platinum,
            Infinite e Empresarial.
          </p>
        </div>
        <button
          onClick={addConfig}
          className="p-2 bg-primary text-primary-foreground rounded-full shadow-sm hover:bg-accent transition"
          title="Adicionar Produto"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {configs.map((prod) => (
          <div
            key={prod.id}
            className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div
                className="p-2 rounded mr-3 bg-primary text-primary-foreground"
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 uppercase">
                {prod.nome}
              </h4>
            </div>

            {/* Taxas Gerais */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">
                  Multa (%)
                </label>
                <input
                  type="number"
                  value={prod.multa}
                  onChange={(e) =>
                    updateVal(prod.id, "multa", e.target.value)
                  }
                  className="w-full border rounded p-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">
                  Mora (R$)
                </label>
                <input
                  type="number"
                  value={prod.mora}
                  onChange={(e) =>
                    updateVal(prod.id, "mora", e.target.value)
                  }
                  className="w-full border rounded p-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">
                  Juros Rotativo (%)
                </label>
                <input
                  type="number"
                  value={prod.percRotativo}
                  onChange={(e) =>
                    updateVal(
                      prod.id,
                      "percRotativo",
                      e.target.value,
                    )
                  }
                  className="w-full border rounded p-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">
                  Taxa Saque (%)
                </label>
                <input
                  type="number"
                  value={prod.percSaque}
                  onChange={(e) =>
                    updateVal(
                      prod.id,
                      "percSaque",
                      e.target.value,
                    )
                  }
                  className="w-full border rounded p-2 bg-gray-50"
                />
              </div>

              {/* Novos Campos */}
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">
                  Refinanciamento de fatura(%)
                </label>
                <input
                  type="number"
                  value={prod.percParcelamentoFatura}
                  onChange={(e) =>
                    updateVal(
                      prod.id,
                      "percParcelamentoFatura",
                      e.target.value,
                    )
                  }
                  className="w-full border rounded p-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1">
                  Juros Parc. Rotativo (%)
                </label>
                <input
                  type="number"
                  value={prod.percParcelamentoRotativo}
                  onChange={(e) =>
                    updateVal(
                      prod.id,
                      "percParcelamentoRotativo",
                      e.target.value,
                    )
                  }
                  className="w-full border rounded p-2 bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <label className="text-xs text-blue-800 font-bold block mb-1">
                  Juros Emissor (%)
                </label>
                <input
                  type="number"
                  value={prod.percJurosEmissor}
                  onChange={(e) =>
                    updateVal(
                      prod.id,
                      "percJurosEmissor",
                      e.target.value,
                    )
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <label className="text-xs text-blue-800 font-bold block mb-1">
                  Juros Crediário (%)
                </label>
                <input
                  type="number"
                  value={prod.percJurosCrediario}
                  onChange={(e) =>
                    updateVal(
                      prod.id,
                      "percJurosCrediario",
                      e.target.value,
                    )
                  }
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            {/* Custo de Reposição por Cooperativa */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-bold text-gray-700">
                  Valor de Reposição de Cartão (Por Cooperativa)
                </h5>
                <button
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Adicionar Coop
                </button>
              </div>
              <div className="bg-gray-50 border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-200 text-gray-600">
                    <tr>
                      <th className="p-2 font-bold">
                        Cooperativa
                      </th>
                      <th className="p-2 font-bold">
                        Valor (R$)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prod.custosReposicao.map((custo, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-200"
                      >
                        <td className="p-2">
                          {custo.cooperativa}
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            defaultValue={custo.valor}
                            className="w-24 border rounded p-1 bg-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end pb-8">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 flex items-center">
            <Save className="w-5 h-5 mr-2" /> Salvar Todas as
            Configurações
          </button>
        </div>
      </div>
    </div>
  );
}

function SubMenuButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${active ? "border-b-2 border-hub-teal text-hub-teal" : "text-gray-500 hover:text-gray-700"}`}
    >
      {label}
    </button>
  );
}

// =======================================================================
// 11. A PÁGINA DE TRANSAÇÕES
// =======================================================================

// --- Definição de Tipos para Transações ---
type KpiTransacoes = {
  total: number;
  aprovadas: number;
  negadas: number;
  volume: number;
};

type TransacaoStatus = "aprovada" | "reprovada";
type ModalidadeTransacao = "Debito" | "Credito";
type PlanoVenda =
  | "A Vista"
  | "Parcelado Emissor"
  | "Parcelado Crediario"
  | "-";

type TransacaoDetalhe = {
  id: number;
  dataHora: string;
  cooperado: string;
  modalidade: ModalidadeTransacao;
  planoVenda: PlanoVenda;
  parcelas?: number;
  numeroCartaoMascarado: string;
  idCartao: string;
  contaCorrente: string;
  cooperativa: string;
  pa: string;
  valor: number;
  limiteDisponivelMomento: number;
  status: TransacaoStatus;
  motivoReprovacao?: string;
  estabelecimento: string;
  formaPagamento: string;
  nsu: string;
  codigoAutorizacao: string;
  mcc: string;
};

// --- Dados Mockados da Página Transações ---
const mockKpiTransacoes: KpiTransacoes = {
  total: 452,
  aprovadas: 410,
  negadas: 42,
  volume: 154300.5,
};

const mockListaDeTransacoes: TransacaoDetalhe[] = [
  {
    id: 1,
    dataHora: "17/11/2025 14:30",
    cooperado: "Ana Beatriz Silva",
    modalidade: "Credito",
    planoVenda: "Parcelado Emissor",
    parcelas: 10,
    numeroCartaoMascarado: "411111 ****** 1111",
    idCartao: "900103",
    contaCorrente: "12345-6",
    cooperativa: "Crediserv",
    pa: "PA 05",
    valor: 2500.0,
    limiteDisponivelMomento: 18000.0,
    status: "aprovada",
    motivoReprovacao: "-",
    estabelecimento: "Magalu E-commerce",
    formaPagamento: "Online/Token",
    nsu: "123456",
    codigoAutorizacao: "AUT889",
    mcc: "5732",
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
type TransacoesViewMode = "lista" | "contestar";

function PaginaTransacoes({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] =
    useState<TransacoesViewMode>("lista");

  const renderView = () => {
    switch (viewMode) {
      case "lista":
        return (
          <ViewListaTransacoes
            kpis={mockKpiTransacoes}
            transacoes={mockListaDeTransacoes}
          />
        );
      case "contestar":
        return <ViewFormContestacao />;
      default:
        return (
          <ViewListaTransacoes
            kpis={mockKpiTransacoes}
            transacoes={mockListaDeTransacoes}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        <SubMenuButton
          label="Histórico de Transações"
          active={viewMode === "lista"}
          onClick={() => setViewMode("lista")}
        />
        <SubMenuButton
          label="Contestar uma compra"
          active={viewMode === "contestar"}
          onClick={() => setViewMode("contestar")}
        />
      </div>
      <div>{renderView()}</div>
    </div>
  );
}

// --- View 1: Lista Principal de Transações ---
function ViewListaTransacoes({
  kpis,
  transacoes,
}: {
  kpis: KpiTransacoes;
  transacoes: TransacaoDetalhe[];
}) {
  const [filtroCoop, setFiltroCoop] = useState("");
  const [filtroPA, setFiltroPA] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [transacaoSelecionada, setTransacaoSelecionada] =
    useState<TransacaoDetalhe | null>(null);

  const transacoesFiltradas = transacoes.filter((tx) => {
    const matchSearch =
      tx.cooperado
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tx.numeroCartaoMascarado.includes(searchTerm) ||
      tx.idCartao.includes(searchTerm) ||
      tx.contaCorrente.includes(searchTerm);

    const matchCoop =
      filtroCoop === "" || tx.cooperativa === filtroCoop;

    const matchPA = filtroPA === "" || tx.pa === filtroPA;

    return matchSearch && matchCoop && matchPA;
  });

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Total Transações"
          value={kpis.total.toString()}
          change=""
          changeType="info"
          icon={List}
        />
        <KpiCard
          title="Aprovadas"
          value={kpis.aprovadas.toString()}
          change=""
          changeType="info"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Reprovadas"
          value={kpis.negadas.toString()}
          change=""
          changeType="info"
          icon={XCircle}
        />
        <KpiCard
          title="Volume Total"
          value={kpis.volume.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          change=""
          changeType="info"
          icon={BarChart2}
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Transações
            </h3>
            <p className="text-sm text-gray-500">
              Histórico detalhado de autorizações.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ExportarDropdown />
          </div>
        </div>

        {/* --- BARRA DE FILTROS --- */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-gray-500">
              Busca Geral
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome, Cartão, ID ou Conta"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Cooperativa
            </label>
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
            <label className="text-xs font-semibold text-gray-500">
              PA
            </label>
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
            <label className="text-xs font-semibold text-gray-500">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* --- TABELA ATUALIZADA --- */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data/Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cooperado / Conta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cartão / ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo Compra
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Coop / PA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Motivo
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Detalhes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacoesFiltradas.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    {tx.dataHora}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs font-bold text-gray-900">
                      {tx.cooperado}
                    </div>
                    <div className="text-xs text-gray-500">
                      CC: {tx.contaCorrente}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs font-mono text-gray-700">
                      {tx.numeroCartaoMascarado}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {tx.idCartao}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`text-xs font-semibold ${tx.modalidade === "Credito" ? "text-purple-600" : "text-blue-600"}`}
                    >
                      {tx.modalidade.toUpperCase()}
                    </span>
                    {tx.modalidade === "Credito" &&
                      tx.planoVenda !== "A Vista" && (
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {tx.parcelas}x (
                          {tx.planoVenda.replace(
                            "Parcelado ",
                            "",
                          )}
                          )
                        </div>
                      )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {tx.cooperativa} / {tx.pa}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-gray-800">
                    {tx.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase rounded-full ${
                        tx.status === "aprovada"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {tx.status === "aprovada" ? (
                      "-"
                    ) : (
                      <span className="text-red-600 font-medium">
                        {tx.motivoReprovacao}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      onClick={() =>
                        setTransacaoSelecionada(tx)
                      }
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

      {transacaoSelecionada && (
        <ModalDetalheTransacao
          tx={transacaoSelecionada}
          onClose={() => setTransacaoSelecionada(null)}
        />
      )}
    </div>
  );
}

// --- Componente Modal Detalhes da Transação ---
function ModalDetalheTransacao({
  tx,
  onClose,
}: {
  tx: TransacaoDetalhe;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Receipt className="w-6 h-6 mr-2 text-hub-teal" />{" "}
            Detalhes da Transação #{tx.nsu}
          </h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Bloco Valor e Status */}
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg flex justify-between items-center border">
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">
                Valor da Compra
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {tx.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Limite Disp. na Compra:{" "}
                <span className="font-semibold text-gray-700">
                  {tx.limiteDisponivelMomento.toLocaleString(
                    "pt-BR",
                    { style: "currency", currency: "BRL" },
                  )}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase font-bold">
                Status
              </p>
              <span
                className={`text-lg font-bold px-3 py-1 rounded-full ${tx.status === "aprovada" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {tx.status.toUpperCase()}
              </span>
              {tx.status === "reprovada" && (
                <p className="text-xs text-red-600 mt-1 font-bold">
                  {tx.motivoReprovacao}
                </p>
              )}
            </div>
          </div>

          {/* Bloco Cartão e Cooperado */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 border-b pb-1">
              Dados do Pagamento
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500 text-xs">
                  Cartão
                </span>{" "}
                <span className="font-mono">
                  {tx.numeroCartaoMascarado}
                </span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">
                  ID Cartão
                </span>{" "}
                <span>{tx.idCartao}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">
                  Modalidade
                </span>{" "}
                <span className="font-semibold">
                  {tx.modalidade}
                </span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">
                  Plano
                </span>{" "}
                <span>{tx.planoVenda}</span>
              </div>
              {tx.parcelas && (
                <div>
                  <span className="block text-gray-500 text-xs">
                    Parcelas
                  </span>{" "}
                  <span>{tx.parcelas}x</span>
                </div>
              )}
              <div>
                <span className="block text-gray-500 text-xs">
                  Entrada
                </span>{" "}
                <span>{tx.formaPagamento}</span>
              </div>
            </div>
          </div>

          {/* Bloco Origem e Destino */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 border-b pb-1">
              Origem e Destino
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <span className="block text-gray-500 text-xs">
                  Cooperado
                </span>{" "}
                <span className="font-semibold">
                  {tx.cooperado}
                </span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">
                  Conta Corrente
                </span>{" "}
                <span>{tx.contaCorrente}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">
                  Cooperativa/PA
                </span>{" "}
                <span>
                  {tx.cooperativa} / {tx.pa}
                </span>
              </div>
              <div className="col-span-2 mt-2 pt-2 border-t border-dashed">
                <span className="block text-gray-500 text-xs">
                  Estabelecimento
                </span>
                <span className="font-bold text-gray-800">
                  {tx.estabelecimento}
                </span>
                <span className="text-xs text-gray-400 block">
                  MCC: {tx.mcc}
                </span>
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
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
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
      <h3 className="text-xl font-semibold text-gray-800">
        Contestar uma Compra
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Preencha os dados da transação para abrir uma
        contestação (chargeback).
      </p>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="numeroCartao"
            className="block text-sm font-medium text-gray-700"
          >
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
            <label
              htmlFor="nsu"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="dataCompra"
              className="block text-sm font-medium text-gray-700"
            >
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
          <label
            htmlFor="valorCompra"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-gray-700"
          >
            Categoria da Contestação
          </label>
          <select
            id="categoria"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-hub-teal"
          >
            <option value="">Selecione um motivo...</option>
            {categoriasContestacao.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent"
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
// 12. A PÁGINA DE FATURAS (ATUALIZADA COM DETALHAMENTO DE ITENS)
// =======================================================================

type ItemFatura = {
  data: string;
  descricao: string;
  categoria:
    | "Compra a Vista"
    | "Parcelado"
    | "Encargos"
    | "Serviços"
    | "Pagamento";
  parcelaAtual?: number;
  totalParcelas?: number;
  valor: number;
};

type Fatura = {
  id: number;
  cooperado: string;
  referencia: string;
  vencimento: string;
  status: "aberta" | "paga" | "vencida";
  valorTotal: number;
  valorPago: number;
  valorEmAberto: number;
  contaCorrente: string;
  cooperativa: string;
  pa: string;
  valorLimite: number;
  valorDisponivel: number;
  diasAtraso?: number;
  itens: ItemFatura[];
};

const mockKpiFaturas = {
  total: 6,
  abertas: 6,
  vencidas: 0,
  aReceber: 7000.0,
};

const mockListaDeFaturas: Fatura[] = [
  {
    id: 1,
    cooperado: "Fernanda Lima Santos",
    referencia: "11/2025",
    vencimento: "24/11/2025",
    status: "aberta",
    valorTotal: 1150.0,
    valorPago: 0.0,
    valorEmAberto: 1150.0,
    contaCorrente: "12345-6",
    cooperativa: "Crediserv",
    pa: "PA 05",
    valorLimite: 5000.0,
    valorDisponivel: 3850.0,
    itens: [
      {
        data: "05/11",
        descricao: "Supermercado Extra",
        categoria: "Compra a Vista",
        valor: 450.0,
      },
    ],
  },
];

function PaginaFaturas({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<
    "lista" | "vencimento"
  >("lista");

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("lista")}
          className={`px-4 py-3 text-sm font-medium ${activeTab === "lista" ? "border-b-2 border-hub-teal text-hub-teal" : "text-gray-500 hover:text-gray-700"}`}
        >
          Listagem de Faturas
        </button>
        <button
          onClick={() => setActiveTab("vencimento")}
          className={`px-4 py-3 text-sm font-medium ${activeTab === "vencimento" ? "border-b-2 border-hub-teal text-hub-teal" : "text-gray-500 hover:text-gray-700"}`}
        >
          Alterar Vencimento
        </button>
      </div>

      {activeTab === "lista" ? (
        <ViewListagemFaturas />
      ) : (
        <ViewAlterarVencimento />
      )}
    </div>
  );
}

function ViewListagemFaturas() {
  const [faturaSelecionada, setFaturaSelecionada] =
    useState<Fatura | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Total Faturas"
          value={mockKpiFaturas.total.toString()}
          change=""
          changeType="info"
          icon={File}
        />
        <KpiCard
          title="Faturas Abertas"
          value={mockKpiFaturas.abertas.toString()}
          change=""
          changeType="info"
          icon={Clock}
        />
        <KpiCard
          title="Faturas Vencidas"
          value={mockKpiFaturas.vencidas.toString()}
          change=""
          changeType="info"
          icon={AlertOctagon}
        />
        <KpiCard
          title="Total a Receber"
          value={mockKpiFaturas.aReceber.toLocaleString(
            "pt-BR",
            { style: "currency", currency: "BRL" },
          )}
          change=""
          changeType="info"
          icon={Receipt}
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Gestão de Faturas
            </h3>
            <p className="text-sm text-gray-500">
              Visão detalhada de débitos e limites.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Buscar cooperado..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cooperado / Conta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Coop / PA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ref. / Vencimento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Limites (Disp / Total)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valores (Aberto / Total)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Detalhes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockListaDeFaturas.map((fatura) => (
                <tr
                  key={fatura.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {fatura.cooperado}
                    </div>
                    <div className="text-xs text-gray-500">
                      CC: {fatura.contaCorrente}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    <div>{fatura.cooperativa}</div>
                    <div>{fatura.pa}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    <div className="font-bold">
                      {fatura.referencia}
                    </div>
                    <div className="text-xs">
                      {fatura.vencimento}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="text-green-700 font-semibold">
                      {fatura.valorDisponivel.toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" },
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      de{" "}
                      {fatura.valorLimite.toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" },
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="text-red-700 font-bold">
                      {fatura.valorEmAberto.toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" },
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total:{" "}
                      {fatura.valorTotal.toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" },
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                        fatura.status === "aberta"
                          ? "bg-blue-100 text-blue-800"
                          : fatura.status === "vencida"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {fatura.status.toUpperCase()}
                      {fatura.diasAtraso
                        ? ` (${fatura.diasAtraso}d)`
                        : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      onClick={() =>
                        setFaturaSelecionada(fatura)
                      }
                      className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                      title="Ver Detalhes da Fatura"
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

      {faturaSelecionada && (
        <ModalDetalhesFatura
          fatura={faturaSelecionada}
          onClose={() => setFaturaSelecionada(null)}
        />
      )}
    </div>
  );
}

function ModalDetalhesFatura({
  fatura,
  onClose,
}: {
  fatura: Fatura;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Receipt className="w-6 h-6 mr-2 text-hub-teal" />{" "}
              Detalhes da Fatura
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Referência: <strong>{fatura.referencia}</strong> |
              Vencimento: {fatura.vencimento}
            </p>
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Resumo do Portador */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex flex-col md:flex-row justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase">
                Cooperado
              </span>
              <p className="text-gray-900 font-medium">
                {fatura.cooperado}
              </p>
              <p className="text-xs text-gray-500">
                Conta: {fatura.contaCorrente} |{" "}
                {fatura.cooperativa}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Valor Total da Fatura
              </span>
              <p className="text-2xl font-bold text-hub-teal">
                {fatura.valorTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              {fatura.valorPago > 0 && (
                <p className="text-xs text-green-600">
                  Pago:{" "}
                  {fatura.valorPago.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Tabela de Lançamentos (Extrato) */}
          <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase border-b pb-2">
            Extrato de Lançamentos
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Descrição</th>
                  <th className="px-4 py-2">Categoria</th>
                  <th className="px-4 py-2 text-center">
                    Parcela
                  </th>
                  <th className="px-4 py-2 text-right">
                    Valor (R$)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fatura.itens && fatura.itens.length > 0 ? (
                  fatura.itens.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500">
                        {item.data}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.descricao}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            item.categoria === "Encargos"
                              ? "bg-red-100 text-red-700"
                              : item.categoria === "Pagamento"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500">
                        {item.parcelaAtual
                          ? `${item.parcelaAtual}/${item.totalParcelas}`
                          : "-"}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${item.valor < 0 ? "text-green-600" : "text-gray-800"}`}
                      >
                        {item.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-gray-500"
                    >
                      Nenhum lançamento registrado nesta fatura.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewAlterarVencimento() {
  const [diaVencimento, setDiaVencimento] = useState("10");

  const calcularMelhorDia = (dia: string) => {
    const d = parseInt(dia);
    let melhor = d - 10;
    if (melhor <= 0) melhor += 30;
    return melhor;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <CalendarDays className="w-6 h-6 mr-2 text-hub-teal" />{" "}
        Alteração de Ciclo de Faturamento
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selecione o Cooperado
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Digite CPF ou Nome..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal focus:border-hub-teal"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 text-sm uppercase mb-4">
            Configuração Atual
          </h4>
          <div className="flex justify-between items-center text-sm">
            <span>
              Dia de Vencimento Atual: <strong>05</strong>
            </span>
            <span>
              Melhor dia de compra: <strong>25</strong>
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Novo Dia de Vencimento
          </label>
          <div className="grid grid-cols-3 gap-4">
            {["05", "10", "15", "20", "25", "30"].map((dia) => (
              <button
                key={dia}
                onClick={() => setDiaVencimento(dia)}
                className={`py-2 px-4 rounded-lg border font-medium transition-all ${
                  diaVencimento === dia
                    ? "bg-hub-teal text-white border-hub-teal ring-2 ring-offset-1 ring-hub-teal"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Dia {dia}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <div>
            <span className="block text-xs text-blue-600 uppercase font-bold">
              Novo Ciclo
            </span>
            <span className="text-blue-900 font-medium">
              Vencimento todo dia {diaVencimento}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-blue-600 uppercase font-bold">
              Melhor Data de Compra
            </span>
            <span className="text-2xl font-bold text-hub-teal">
              Dia {calcularMelhorDia(diaVencimento)}
            </span>
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
// 13. A PÁGINA DE RELATÓRIOS (CONECTADA AO SUPABASE)
// =======================================================================

// --- Tipos ---
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
  cooperativa: string; // ou join com tabela cooperativas
  formato: 'XLS' | 'CSV' | 'PDF';
  data_geracao: string; // Supabase usa snake_case por padrão
  registros: number;
  status: 'concluido' | 'processando' | 'erro';
};

// Lista de Tipos de Relatórios Disponíveis (Menu Fixo)
const tiposDeRelatorios: RelatorioTipo[] = [
  // --- Transacional e Operacional ---
  { id: 'transacoes_credito', titulo: 'Transações na Função Crédito', desc: 'Detalhamento de compras aprovadas no crédito', gerados: 15, icon: CreditCard },
  { id: 'transacoes_debito', titulo: 'Transações na Função Débito', desc: 'Detalhamento de compras aprovadas no débito', gerados: 12, icon: CreditCard },
  { id: 'saques_credito', titulo: 'Relatório de Saques no Crédito', desc: 'Monitoramento de retiradas em espécie (Cash Advance)', gerados: 2, icon: Banknote },
  { id: 'contestacoes', titulo: 'Relatório de Contestações', desc: 'Disputas, Chargebacks e fraudes em análise', gerados: 4, icon: ShieldAlert },
  
  // --- Produtos e Serviços ---
  { id: 'carteiras_virtuais', titulo: 'Relatório de Cartões Virtuais', desc: 'Tokenização em carteiras digitais (Wallets)', gerados: 6, icon: Smartphone },
  { id: 'anuidade', titulo: 'Relatório de Anuidades', desc: 'Receita de anuidades e isenções concedidas', gerados: 12, icon: Percent },
  { id: 'sala_vip', titulo: 'Uso de Sala VIP', desc: 'Acessos LoungeKey/DragonPass e custos', gerados: 5, icon: Armchair },
  { id: 'servicos_adicionais', titulo: 'Serviços Adicionais', desc: 'Adesão de seguros, SMS e outros serviços', gerados: 8, icon: FileCheck },

  // --- Financeiro e Conciliação ---
  { id: 'receitas', titulo: 'Relatório de Receitas', desc: 'Consolidado de receitas de intercâmbio e tarifas', gerados: 3, icon: TrendingUp },
  { id: 'despesas', titulo: 'Relatório de Despesas', desc: 'Custos operacionais, bandeiras e processamento', gerados: 3, icon: TrendingDown },
  { id: 'cext', titulo: 'CEXT - Conciliação de Extrato', desc: 'Arquivo de conciliação financeira diária', gerados: 30, icon: CheckSquare },
  { id: 'daut', titulo: 'DAUT - Débito Automático', desc: 'Arquivo de remessa de débito em conta', gerados: 10, icon: RefreshCw },
  { id: 'daur', titulo: 'DAUR - Débito Automático (Retorno)', desc: 'Processamento de retorno dos débitos', gerados: 10, icon: FileDown },

  // --- Gestão de Limites e Risco ---
  { id: 'limites_coop', titulo: 'Relatório de Limites Cooperativas', desc: 'Acompanhamento de teto operacional por singular', gerados: 1, icon: BarChart2 },
  { id: 'cartoes_atraso', titulo: 'Cartões em Atraso (Aging)', desc: 'Carteira de crédito vencida por faixa de atraso', gerados: 4, icon: CalendarX },
  
  // --- Regulatórios ---
  { id: 'cb117', titulo: 'Coobrigações (CB117)', desc: 'Relatório regulatório de garantias de cartão', gerados: 1, icon: Building },
  { id: 'cadoc', titulo: 'CADOC 3040', desc: 'Informações de risco de crédito (SCR)', gerados: 1, icon: FileText },
  { id: 'irpi', titulo: 'IRPI - Informe de Rendimentos', desc: 'Dados para declaração de imposto de renda', gerados: 0, icon: FileText },
];

// --- Componente PAI da Página Relatórios ---
function PaginaRelatorios({ usuario }: { usuario: User }) {
  const [relatorioAtivo, setRelatorioAtivo] = useState<string | null>(null);
  const [historico, setHistorico] = useState<HistoricoRelatorio[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Busca o Histórico de Relatórios Gerados
  useEffect(() => {
    async function fetchHistorico() {
      try {
        setLoading(true);
        // Filtra por cooperativa se não for Master/Central
        let query = supabase.from('historico_relatorios').select('*').order('data_geracao', { ascending: false });
        
        if (usuario.perfil === 'Cooperativa') {
           // Assumindo que a tabela tenha coluna 'cooperativa_id' ou nome
           query = query.eq('cooperativa_id', usuario.cooperativaId);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (data) setHistorico(data);
      } catch (error) {
        console.error("Erro ao buscar histórico de relatórios:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistorico();
  }, [usuario]);

  // Se um relatório estiver ativo, mostra a visualização detalhada
  if (relatorioAtivo) {
    return (
      <ViewRelatorioDetalhado 
        tipo={relatorioAtivo} 
        onBack={() => setRelatorioAtivo(null)} 
        usuario={usuario}
      />
    );
  }

  // Dashboard de relatórios (Histórico + Grid de Geração)
  return (
    <div className="space-y-6">
      {/* KPIs dinâmicos baseados no histórico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Relatórios" value={historico.length.toString()} change="" changeType="info" icon={File} />
        <KpiCard title="Processando" value={historico.filter(h => h.status === 'processando').length.toString()} change="" changeType="info" icon={PackageSearch} />
        <KpiCard title="Concluídos" value={historico.filter(h => h.status === 'concluido').length.toString()} change="" changeType="info" icon={PackageCheck} />
        <KpiCard title="Com Erro" value={historico.filter(h => h.status === 'erro').length.toString()} change="" changeType="info" icon={PackageX} />
      </div>

      {/* Tabela de Histórico */}
      <ViewHistoricoRelatorios historico={historico} loading={loading} />

      {/* Grid de Geração */}
      <ViewGerarRelatorios tipos={tiposDeRelatorios} onGerar={(id) => setRelatorioAtivo(id)} />
    </div>
  );
}

// --- Componente Visualização Detalhada do Relatório (Com Fetch Específico) ---
function ViewRelatorioDetalhado({ tipo, onBack, usuario }: { tipo: string; onBack: () => void; usuario: User }) {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const getTitulo = () => tiposDeRelatorios.find(t => t.id === tipo)?.titulo || 'Relatório';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let { data, error } = { data: null, error: null } as any;

        // Seleciona a tabela correta baseada no tipo de relatório
        // NOTA: Certifique-se de criar essas tabelas ou Views no Supabase
        switch (tipo) {
          case 'anuidade':
            ({ data, error } = await supabase.from('relatorio_anuidade').select('*').limit(50));
            break;
          case 'sala_vip':
            ({ data, error } = await supabase.from('acessos_sala_vip').select('*').limit(50));
            break;
          case 'servicos_adicionais':
            ({ data, error } = await supabase.from('servicos_adicionais').select('*').limit(50));
            break;
          case 'carteiras_virtuais':
            ({ data, error } = await supabase.from('carteiras_virtuais').select('*').limit(50));
            break;
          default:
            // Para outros relatórios não mapeados, não busca nada por enquanto
            break;
        }

        if (error) {
            console.error(`Erro ao buscar relatório ${tipo}:`, error);
        } else {
            setDados(data || []);
        }
      } catch (err) {
        console.error("Erro genérico fetch relatorio:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tipo]);

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col h-full min-h-[600px]">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-hub-teal" /> {getTitulo()}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Carregando dados..." : `Visualizando ${dados.length} registros.`}
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Voltar</button>
          <button className="px-4 py-2 bg-hub-teal text-white rounded-lg hover:opacity-90 flex items-center">
            <FileDown className="w-4 h-4 mr-2"/> Exportar Excel
          </button>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        {loading && <div className="text-center py-10 text-gray-500">Carregando dados do servidor...</div>}

        {!loading && dados.length === 0 && (
             <div className="text-center py-10 text-gray-500">
                <p>Nenhum dado encontrado para este relatório.</p>
             </div>
        )}
        
        {/* --- 1. RELATÓRIO DE ANUIDADE --- */}
        {!loading && tipo === 'anuidade' && dados.length > 0 && (
          <div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">CPF/CNPJ</th>
                  <th className="px-4 py-3">Nome Contratante</th>
                  <th className="px-4 py-3">Cartão</th>
                  <th className="px-4 py-3">Valor Mensal</th>
                  <th className="px-4 py-3">Data Cobrança</th>
                  <th className="px-4 py-3">Parc. Restantes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dados.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.cpf_cnpj}</td>
                    <td className="px-4 py-3 font-medium">{item.nome}</td>
                    <td className="px-4 py-3 font-mono">{item.cartao_mascarado}</td>
                    <td className="px-4 py-3 text-green-700 font-bold">
                        {Number(item.valor_mensal).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </td>
                    <td className="px-4 py-3">{new Date(item.data_cobranca).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-center font-bold">{item.parc_restantes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 2. RELATÓRIO DE SALA VIP --- */}
        {!loading && tipo === 'sala_vip' && dados.length > 0 && (
          <div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Coop / PA</th>
                  <th className="px-4 py-3">Data Uso</th>
                  <th className="px-4 py-3">Sala Usada</th>
                  <th className="px-4 py-3">Custo Extra</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dados.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.nome}</td>
                    <td className="px-4 py-3">{item.produto}</td>
                    <td className="px-4 py-3">{item.cooperativa} / {item.pa}</td>
                    <td className="px-4 py-3">{new Date(item.data_uso).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">{item.sala}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${!item.custo_extra ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.custo_extra ? `Sim` : 'Não'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 3. RELATÓRIO DE SERVIÇOS ADICIONAIS --- */}
        {!loading && tipo === 'servicos_adicionais' && dados.length > 0 && (
          <div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Produto/Serviço</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Contratação</th>
                  <th className="px-4 py-3">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dados.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.nome}</td>
                    <td className="px-4 py-3">{item.produto}</td>
                    <td className="px-4 py-3 font-bold">{Number(item.valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                    <td className="px-4 py-3">{new Date(item.data_contratacao).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 4. RELATÓRIO DE CARTEIRAS VIRTUAIS --- */}
        {!loading && tipo === 'carteiras_virtuais' && dados.length > 0 && (
          <div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Cartão</th>
                  <th className="px-4 py-3">Wallet</th>
                  <th className="px-4 py-3">Ativação</th>
                  <th className="px-4 py-3">Último Uso</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dados.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.nome}</td>
                    <td className="px-4 py-3 font-mono">{item.cartao_mascarado}</td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          item.wallet === 'Apple Pay' ? 'bg-gray-900 text-white border-gray-900' :
                          item.wallet === 'Google Pay' ? 'bg-white text-gray-700 border-gray-300' :
                          'bg-blue-900 text-white border-blue-900'
                        }`}>
                          {item.wallet}
                        </span>
                    </td>
                    <td className="px-4 py-3">{new Date(item.data_ativacao).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">{item.ultimo_uso ? new Date(item.ultimo_uso).toLocaleDateString('pt-BR') : '-'}</td>
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
            <p>Selecione um relatório suportado ou implemente a View no banco de dados.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Componentes de Listagem (Histórico) ---
function ViewHistoricoRelatorios({ historico, loading }: { historico: HistoricoRelatorio[]; loading: boolean }) {
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
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Relatórios Disponíveis</h3>
            <p className="text-sm text-gray-500">Geração e download de relatórios</p>
          </div>
          <button className="flex-shrink-0 flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5 mr-2" /> Novo Relatório
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cooperativa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Formato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gerado em</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">Carregando histórico...</td></tr>
            )}
            {!loading && historico.length === 0 && (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">Nenhum relatório gerado recentemente.</td></tr>
            )}
            {historico.map((rel) => (
              <tr key={rel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rel.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.periodo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rel.cooperativa}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold"><span className={`px-2 py-0.5 rounded-md ${getFormatoClass(rel.formato)}`}>{rel.formato}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rel.data_geracao).toLocaleString('pt-BR')}</td>
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
          <div key={rel.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-start transition hover:shadow-md cursor-pointer" onClick={() => onGerar(rel.id)}>
            <div className="flex">
              <div className="p-3 bg-gray-100 rounded-lg mr-4">
                <rel.icon className="w-6 h-6 text-hub-teal" />
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-800">{rel.titulo}</h4>
                <p className="text-sm text-gray-500 mt-1">{rel.desc}</p>
                <p className="text-xs text-gray-400 mt-2">Gerados: {rel.gerados}</p>
              </div>
            </div>
            <button 
              className="text-xs font-medium text-hub-teal border border-hub-teal px-2 py-1 rounded hover:bg-teal-50 transition"
            >
              Abrir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// =======================================================================
// 14. A PÁGINA DE COOPERATIVAS
// =======================================================================
type CooperativasViewMode = "lista" | "detalhe";

function PaginaCooperativas({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] = useState<CooperativasViewMode>("lista");
  const [selectedCooperativa, setSelectedCooperativa] = useState<Cooperativa | null>(null);
  const [showModalNovaCoop, setShowModalNovaCoop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cooperativasReais, setCooperativasReais] = useState<Cooperativa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCooperativas();
  }, []);

  async function fetchCooperativas() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("cooperativas").select("*");
      if (error) throw error;
      if (data) {
        const formatadas: Cooperativa[] = data.map((item: any) => ({
          id: item.id,
          centralId: item.central_id,
          codigo: item.codigo,
          nome: item.nome,
          cnpj: item.cnpj,
          tipo: item.tipo as "Central" | "Singular",
          limiteOutorgado: Number(item.limite_outorgado || 0),
          limiteUtilizado: Number(item.limite_utilizado || 0),
          status: (item.status as "Ativa" | "Inativa") || "Ativa",
        }));
        setCooperativasReais(formatadas);
      }
    } catch (error) {
      console.error("Erro ao buscar cooperativas:", error);
    } finally {
      setLoading(false);
    }
  }

  const cooperativasVisiveis = cooperativasReais.filter((coop) => {
    if (usuario.perfil === "Master") return true;
    if (usuario.perfil === "Central") return coop.centralId === usuario.centralId;
    return false;
  });

  const cooperativasFiltradas = cooperativasVisiveis.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.codigo || "").includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Cooperativas</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">CNPJ</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cooperativasFiltradas.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{c.nome}</td>
                  <td className="p-3">{c.cnpj || "-"}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedCooperativa(c);
                        setViewMode("detalhe");
                      }}
                      className="px-3 py-1 rounded border text-sm"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewMode === "detalhe" && selectedCooperativa && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg">{selectedCooperativa.nome}</h3>
          <button onClick={() => setViewMode("lista")}>Voltar</button>
        </div>
      )}
    </div>
  );
}

// =======================================================================
// 15. A PÁGINA DE USUÁRIOS
// =======================================================================

// --- Definição de Tipos para Usuários ---
type PerfilUsuario =
  | "Atendente"
  | "Consulta"
  | "Gerente"
  | "Administrador";

type UsuarioSistema = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  perfil: PerfilUsuario;
  grupo: string;
  ultimoAcesso: string;
  status: "Ativo" | "Inativo";
};

// --- Definição de Tipos para Logs de Auditoria (ATUALIZADO) ---
type LogAuditoria = {
  id: number;
  dataHora: string;
  acao: "CREATE" | "UPDATE" | "DELETE" | "BLOCK";
  descricao: string;

  // Quem realizou a ação (Novo detalhamento)
  usuarioResponsavelNome: string; // Nome completo
  usuarioResponsavelLogin: string; // Login/Email
  cooperativaRealizou: string;
  paRealizou: string;

  // Quem sofreu a ação (Novo detalhamento)
  afetadoNome: string; // Nome do Cooperado
  afetadoCpfCnpj: string; // CPF/CNPJ
  afetadoContaCartao: string;
};

// --- Dados Mockados da Página Usuários ---
const mockUsuarios: UsuarioSistema[] = [
  {
    id: 1,
    nome: "Patricia Holanda",
    cpf: "123.456.789-00",
    email: "patricia@credisis.com.br",
    perfil: "Administrador",
    grupo: "Central Credisis",
    ultimoAcesso: "17/11/2025 14:30",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "João da Silva",
    cpf: "987.654.321-11",
    email: "joao@coopesa.com.br",
    perfil: "Gerente",
    grupo: "Coopesa",
    ultimoAcesso: "17/11/2025 10:15",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Maria Oliveira",
    cpf: "456.789.123-22",
    email: "maria@pa03.com.br",
    perfil: "Atendente",
    grupo: "PA 03",
    ultimoAcesso: "16/11/2025 18:00",
    status: "Inativo",
  },
];

// --- Dados Mockados de Logs (ATUALIZADO) ---
const mockLogsAuditoria: LogAuditoria[] = [
  {
    id: 1,
    dataHora: "17/11/2025 14:45:22",
    acao: "UPDATE",
    descricao:
      "Alteração de limite de crédito de R$ 5.000 para R$ 8.000",
    usuarioResponsavelNome: "Patricia Holanda",
    usuarioResponsavelLogin: "patricia.holanda@credisis.com.br",
    cooperativaRealizou: "Credisis Central",
    paRealizou: "-",
    afetadoNome: "Carlos Eduardo Souza", // Nome incluído
    afetadoCpfCnpj: "111.222.333-44",
    afetadoContaCartao: "900102",
  },
  {
    id: 2,
    dataHora: "17/11/2025 10:30:15",
    acao: "BLOCK",
    descricao:
      "Bloqueio preventivo de cartão por suspeita de fraude",
    usuarioResponsavelNome: "João da Silva",
    usuarioResponsavelLogin: "joao@coopesa.com.br",
    cooperativaRealizou: "Coopesa",
    paRealizou: "PA 03",
    afetadoNome: "Enzo Filho Kids", // Nome incluído
    afetadoCpfCnpj: "555.666.777-88",
    afetadoContaCartao: "900104",
  },
  {
    id: 3,
    dataHora: "16/11/2025 09:15:00",
    acao: "CREATE",
    descricao: "Cadastro de serviço adicional: Seguro PPR",
    usuarioResponsavelNome: "Maria Oliveira",
    usuarioResponsavelLogin: "maria@pa03.com.br",
    cooperativaRealizou: "Coopesa",
    paRealizou: "PA 03",
    afetadoNome: "Ana Beatriz Silva", // Nome incluído
    afetadoCpfCnpj: "999.888.777-66",
    afetadoContaCartao: "900103",
  },
  {
    id: 4,
    dataHora: "16/11/2025 08:20:10",
    acao: "UPDATE",
    descricao: "Atualização de endereço de entrega do cartão",
    usuarioResponsavelNome: "Sistema Integrado",
    usuarioResponsavelLogin: "system@hubcoop.adm",
    cooperativaRealizou: "Credisis Central",
    paRealizou: "-",
    afetadoNome: "Fernanda Lima Santos", // Nome incluído
    afetadoCpfCnpj: "123.456.789-00",
    afetadoContaCartao: "900101",
  },
];

// --- Componente PAI da Página Usuários ---
type UsuariosViewMode = "lista" | "logs";

function PaginaUsuarios({ usuario }: { usuario: User }) {
  const [viewMode, setViewMode] =
    useState<UsuariosViewMode>("lista");

  const renderView = () => {
    switch (viewMode) {
      case "lista":
        return <ViewListaUsuarios usuarios={mockUsuarios} />;
      case "logs":
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
          active={viewMode === "lista"}
          onClick={() => setViewMode("lista")}
        />
        <SubMenuButton
          label="Logs de Auditoria"
          active={viewMode === "logs"}
          onClick={() => setViewMode("logs")}
        />
      </div>

      {/* Conteúdo da View Ativa */}
      <div>{renderView()}</div>
    </div>
  );
}

// --- Componentes da Página Usuários ---

// --- View 1: Lista de Usuários ---
function ViewListaUsuarios({
  usuarios,
}: {
  usuarios: UsuarioSistema[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const usuariosAtivos = usuarios.filter(
    (u) => u.status === "Ativo",
  ).length;
  const usuariosInativos = usuarios.filter(
    (u) => u.status === "Inativo",
  ).length;

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cpf.includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getPerfilClass = (perfil: PerfilUsuario) => {
    switch (perfil) {
      case "Administrador":
        return "bg-red-100 text-red-800";
      case "Gerente":
        return "bg-purple-100 text-purple-800";
      case "Atendente":
        return "bg-blue-100 text-blue-800";
      case "Consulta":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total Usuários"
          value={usuarios.length.toString()}
          change=""
          changeType="info"
          icon={Users}
        />
        <KpiCard
          title="Usuários Ativos"
          value={usuariosAtivos.toString()}
          change=""
          changeType="info"
          icon={UserCheck}
        />
        <KpiCard
          title="Usuários Inativos"
          value={usuariosInativos.toString()}
          change=""
          changeType="info"
          icon={UserCog}
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Cabeçalho da Tabela */}
        <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-200 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Usuários do Sistema
            </h3>
            <p className="text-sm text-gray-500">
              Gerenciamento de usuários e permissões
            </p>
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
              className="flex-shrink-0 flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent transition-colors"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail Corporativo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${getPerfilClass(user.perfil)}`}
                    >
                      {user.perfil}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.grupo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.ultimoAcesso}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                        user.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
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
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const logsFiltrados = logs.filter((log) => {
    // Filtra por Descrição, Usuário (Nome/Login), Cooperado (Nome/CPF) ou Cooperativa
    const matchBusca =
      filtroBusca === "" ||
      log.descricao
        .toLowerCase()
        .includes(filtroBusca.toLowerCase()) ||
      log.usuarioResponsavelNome
        .toLowerCase()
        .includes(filtroBusca.toLowerCase()) ||
      log.usuarioResponsavelLogin
        .toLowerCase()
        .includes(filtroBusca.toLowerCase()) ||
      log.afetadoNome
        .toLowerCase()
        .includes(filtroBusca.toLowerCase()) ||
      log.afetadoCpfCnpj.includes(filtroBusca) ||
      log.cooperativaRealizou
        .toLowerCase()
        .includes(filtroBusca.toLowerCase());

    // Lógica de data simples (apenas "começa com")
    const matchData =
      filtroData === "" ||
      log.dataHora.startsWith(
        filtroData.split("-").reverse().join("/"),
      );

    return matchBusca && matchData;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Cabeçalho com Filtros */}
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Logs de Auditoria
        </h3>
        <p className="text-sm text-gray-500">
          Monitoramento de todas as ações realizadas no portal.
        </p>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Histórico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cooperado Afetado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origem
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logsFiltrados.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                  {log.dataHora}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs font-bold rounded ${
                      log.acao === "CREATE"
                        ? "bg-green-100 text-green-800"
                        : log.acao === "UPDATE"
                          ? "bg-blue-100 text-blue-800"
                          : log.acao === "BLOCK"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {log.acao}
                  </span>
                </td>

                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium max-w-xs truncate"
                  title={log.descricao}
                >
                  {log.descricao}
                </td>

                {/* Nova Coluna: Usuário Responsável */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {log.usuarioResponsavelNome}
                  </div>
                  <div className="text-xs text-gray-500">
                    {log.usuarioResponsavelLogin}
                  </div>
                </td>

                {/* Nova Coluna: Cooperado Afetado */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {log.afetadoNome}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {log.afetadoCpfCnpj}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Cartão: {log.afetadoContaCartao}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                  <div className="font-semibold">
                    {log.cooperativaRealizou}
                  </div>
                  <div className="text-gray-400">
                    {log.paRealizou}
                  </div>
                </td>
              </tr>
            ))}
            {logsFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
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
        {usuario.perfil === "Master" && <FormCadastroCentral />}

        {/* === VISÍVEL APENAS PARA A CENTRAL === */}
        {usuario.perfil === "Central" && (
          <>
            <FormCadastroCooperativa usuario={usuario} />
            <FormCadastroPA usuario={usuario} />
            <FormCadastroUsuario usuario={usuario} />{" "}
            {/* NOVO */}
            <FormConfiguracaoCentral /> {/* NOVO */}
          </>
        )}

        {/* === VISÍVEL APENAS PARA A COOPERATIVA === */}
        {usuario.perfil === "Cooperativa" && (
          <>
            <FormCadastroPA usuario={usuario} />
            <FormCadastroUsuario usuario={usuario} />{" "}
            {/* NOVO */}
          </>
        )}

        {/* === VISÍVEL APENAS PARA O PA === */}
        {usuario.perfil === "PA" && (
          <FormCadastroUsuario usuario={usuario} /> /* NOVO */
        )}
      </div>

      {/* Coluna 2: Listagens para Edição */}
      <div className="lg:col-span-2 space-y-6">
        {/* === VISÍVEL APENAS PARA O MASTER === */}
        {usuario.perfil === "Master" && <ListaEdicaoCentrais />}

        {/* === VISÍVEL APENAS PARA A CENTRAL === */}
        {usuario.perfil === "Central" && (
          <>
            <ListaEdicaoCooperativas usuario={usuario} />
            <ListaEdicaoPA usuario={usuario} />
            <ListaEdicaoUsuarios usuario={usuario} />{" "}
            {/* NOVO */}
          </>
        )}

        {/* === VISÍVEL APENAS PARA A COOPERATIVA === */}
        {usuario.perfil === "Cooperativa" && (
          <>
            <ListaEdicaoPA usuario={usuario} />
            <ListaEdicaoUsuarios usuario={usuario} />{" "}
            {/* NOVO */}
          </>
        )}

        {/* === VISÍVEL APENAS PARA O PA === */}
        {usuario.perfil === "PA" && (
          <ListaEdicaoUsuarios usuario={usuario} /> /* NOVO */
        )}
      </div>
    </div>
  );
}

// --- Sub-componentes de Configurações ---

// MASTER: Cadastra Central
function FormCadastroCentral() {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    null,
  );

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setLogoPreview(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">
        Cadastrar Nova Central
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Crie um novo administrador e uma nova central segregada.
      </p>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="adminNome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome Completo do Administrador
          </label>
          <input
            type="text"
            id="adminNome"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="adminEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Email do Administrador
          </label>
          <input
            type="email"
            id="adminEmail"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="centralNome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome da Central
          </label>
          <input
            type="text"
            id="centralNome"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="centralLogo"
            className="block text-sm font-medium text-gray-700"
          >
            Logo da Central
          </label>
          <input
            type="file"
            id="centralLogo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hub-teal file:text-white hover:file:bg-hub-teal-dark"
          />
        </div>
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Preview"
            className="w-24 h-24 object-contain mx-auto mt-2"
          />
        )}
        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent"
        >
          <UserPlus className="w-5 h-5 mr-2" /> Cadastrar
          Central
        </button>
      </form>
    </div>
  );
}

// MASTER: Edita Centrais
function ListaEdicaoCentrais() {
  const centrais = mockCentrais.filter((c) => c.id !== "c1"); // Não editar a própria Hubcoop
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">
        Centrais Existentes
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Edite as centrais já cadastradas.
      </p>
      <div className="space-y-4">
        {centrais.map((central) => (
          <div
            key={central.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center">
              <img
                src={central.logo}
                alt={central.nome}
                className="w-10 h-10 object-contain rounded-full bg-white border shadow-sm"
              />
              <div className="ml-4">
                <p className="text-lg font-semibold text-gray-900">
                  {central.nome}
                </p>
                <p className="text-sm text-gray-500">
                  ID: {central.id} | Admin: {central.admin}
                </p>
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
function FormCadastroCooperativa({
  usuario,
}: {
  usuario: User;
}) {
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">
        Cadastrar Nova Cooperativa
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Adicionar uma nova cooperativa singular à sua central (
        {
          mockCentrais.find((c) => c.id === usuario.centralId)
            ?.nome
        }
        ).
      </p>
      {/* ... (Aqui iria o formulário de Nova Cooperativa) ... */}
      <button
        className="w-full flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent"
      >
        <Plus className="w-5 h-5 mr-2" /> Cadastrar Cooperativa
      </button>
    </div>
  );
}

// CENTRAL: Edita Cooperativas
function ListaEdicaoCooperativas({
  usuario,
}: {
  usuario: User;
}) {
  const cooperativas = cooperativasReais.length ? cooperativasReais : cooperativas
.filter(
    (c) =>
      c.centralId === usuario.centralId &&
      c.tipo === "Singular",
  );
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">
        Cooperativas da sua Central
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Edite as cooperativas singulares.
      </p>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {cooperativas.map((coop) => (
          <div
            key={coop.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
          >
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {coop.nome} (Cód: {coop.codigo})
              </p>
              <p className="text-sm text-gray-500">
                CNPJ: {coop.cnpj}
              </p>
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
      <h3 className="text-xl font-semibold text-gray-800">
        Cadastrar Novo Ponto de Atendimento
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Adicionar um novo PA.
      </p>
      {/* Se for Central, precisa de um <select> para escolher a cooperativa */}
      {usuario.perfil === "Central" && (
        <div className="mb-4">
          <label
            htmlFor="coopSelect"
            className="block text-sm font-medium text-gray-700"
          >
            Selecionar Cooperativa
          </label>
          <select
            id="coopSelect"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          >
            {cooperativasReais.length ? cooperativasReais : cooperativas

              .filter(
                (c) =>
                  c.centralId === usuario.centralId &&
                  c.tipo === "Singular",
              )
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
          </select>
        </div>
      )}
      {/* ... (Aqui iria o formulário de Novo PA) ... */}
      <button
        className="w-full flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent"
      >
        <Plus className="w-5 h-5 mr-2" /> Cadastrar PA
      </button>
    </div>
  );
}

// CENTRAL ou COOPERATIVA: Edita PA
function ListaEdicaoPA({ usuario }: { usuario: User }) {
  const pas = mockPontosAtendimento.filter((pa) => {
    if (usuario.perfil === "Central") {
      // Pega os IDs das cooperativas da central
      const coopIds = cooperativasReais.length ? cooperativasReais : mockCooperativas

        .filter((c) => c.centralId === usuario.centralId)
        .map((c) => c.id);
      return coopIds.includes(pa.cooperativaId);
    }
    if (usuario.perfil === "Cooperativa") {
      return pa.cooperativaId === usuario.cooperativaId;
    }
    return false;
  });

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">
        Pontos de Atendimento
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Edite os PAs cadastrados.
      </p>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {pas.length > 0 ? (
          pas.map((pa) => (
            <div
              key={pa.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
            >
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {pa.nome} (Cód: {pa.codigo})
                </p>
                <p className="text-sm text-gray-500">
                  Status: {pa.status}
                </p>
              </div>
              <button className="flex items-center px-4 py-2 text-sm text-white bg-hub-teal rounded-lg shadow-sm">
                <Edit2 className="w-4 h-4 mr-2" /> Editar
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Nenhum Ponto de Atendimento encontrado para este
            perfil.
          </p>
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
      <h3 className="text-xl font-semibold text-gray-800">
        Configurações da Central
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Defina o tempo de sincronização dos dados do dashboard.
      </p>
      <div className="space-y-3">
        <label className="flex items-center p-3 border rounded-lg">
          <input
            type="radio"
            name="sync-time"
            className="w-4 h-4 text-hub-teal"
            defaultChecked
          />
          <span className="ml-3 text-sm font-medium">
            5 minutos
          </span>
        </label>
        <label className="flex items-center p-3 border rounded-lg">
          <input
            type="radio"
            name="sync-time"
            className="w-4 h-4 text-hub-teal"
          />
          <span className="ml-3 text-sm font-medium">
            10 minutos
          </span>
        </label>
      </div>
    </div>
  );
}

// NOVO: CENTRAL, COOPERATIVA, PA - Cadastra Usuário
function FormCadastroUsuario({ usuario }: { usuario: User }) {
  let titulo = "Cadastrar Novo Usuário";
  if (usuario.perfil === "Central")
    titulo = "Cadastrar Usuário (Central, Coop ou PA)";
  if (usuario.perfil === "Cooperativa")
    titulo = "Cadastrar Usuário (Coop ou PA)";
  if (usuario.perfil === "PA")
    titulo = "Cadastrar Usuário (PA)";

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">
        {titulo}
      </h3>
      <form className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Usuário
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        {/* Lógica de seleção de perfil com base em quem está logado */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Perfil
          </label>
          <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
            {usuario.perfil === "Central" && (
              <option value="central">Central</option>
            )}
            {(usuario.perfil === "Central" ||
              usuario.perfil === "Cooperativa") && (
              <option value="cooperativa">Cooperativa</option>
            )}
            <option value="pa">Ponto de Atendimento</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent"
        >
          <UserPlus className="w-5 h-5 mr-2" /> Cadastrar
          Usuário
        </button>
      </form>
    </div>
  );
}

// NOVO: CENTRAL, COOPERATIVA, PA - Edita Usuários
function ListaEdicaoUsuarios({ usuario }: { usuario: User }) {
  // Apenas um mock simples para ilustração
  const usuariosVisiveis = [
    {
      id: 1,
      nome: "Usuário Exemplo 1 (Coop)",
      perfil: "Cooperativa",
    },
    { id: 2, nome: "Usuário Exemplo 2 (PA)", perfil: "PA" },
  ];

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">
        Usuários Cadastrados
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Edite os usuários da sua hierarquia.
      </p>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {usuariosVisiveis.map(
          (user) =>
            // Filtra para não mostrar perfis que o usuário não pode ver
            (usuario.perfil === "Central" ||
              (usuario.perfil === "Cooperativa" &&
                user.perfil !== "Central") ||
              (usuario.perfil === "PA" &&
                user.perfil === "PA")) && (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.nome}
                  </p>
                  <p className="text-sm text-gray-500">
                    Perfil: {user.perfil}
                  </p>
                </div>
                <button className="flex items-center px-4 py-2 text-sm text-white bg-hub-teal rounded-lg shadow-sm">
                  <Edit2 className="w-4 h-4 mr-2" /> Editar
                </button>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
// =======================================================================
// 17. PÁGINA DE LOYALTY (PONTOS) - CORRIGIDA E EXPANDIDA
// =======================================================================

type ItemLoyalty = {
  id: number;
  nome: string;
  custoPontos: number;
  categoria: string;
  limitePorResgate?: number;
};
type SolicitacaoPontos = {
  id: number;
  cooperado: string;
  cpf: string;
  produto: string;
  pontos: number;
  item: string;
  data: string;
  status: "pendente" | "aprovado";
};
type ConfigValidade = {
  produto: string;
  validadeMeses: number;
};

const mockItensLoyalty: ItemLoyalty[] = [
  {
    id: 1,
    nome: "Voucher iFood",
    custoPontos: 3000,
    categoria: "Voucher",
    limitePorResgate: 5,
  },
  {
    id: 2,
    nome: "Voucher Uber",
    custoPontos: 3000,
    categoria: "Voucher",
    limitePorResgate: 5,
  },
  {
    id: 3,
    nome: "Aporte Capital Social",
    custoPontos: 100,
    categoria: "Investimento",
    limitePorResgate: 100000,
  }, // 100 pts = 1 real (exemplo)
  {
    id: 4,
    nome: "Aporte Previdência",
    custoPontos: 100,
    categoria: "Previdência",
    limitePorResgate: 100000,
  },
  {
    id: 5,
    nome: "Transferência Miles",
    custoPontos: 1,
    categoria: "Milhas",
    limitePorResgate: 50000,
  },
];

const mockSolicitacoesLoyalty: SolicitacaoPontos[] = [
  {
    id: 1,
    cooperado: "Ana Beatriz Silva",
    cpf: "123.456.789-00",
    produto: "Visa Infinite",
    pontos: 15000,
    item: "Aporte Capital Social",
    data: "17/11/2025",
    status: "pendente",
  },
];

const mockConfigValidade: ConfigValidade[] = [
  { produto: "Visa Infinite", validadeMeses: 36 },
  { produto: "Visa Platinum", validadeMeses: 24 },
  { produto: "Visa Gold", validadeMeses: 24 },
  { produto: "Visa Classic", validadeMeses: 12 },
];

function PaginaLoyalty({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<
    "catalogo" | "autorizacoes" | "configuracoes"
  >("catalogo");

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("catalogo")}
          className={`px-4 py-3 text-sm font-medium ${activeTab === "catalogo" ? "border-b-2 border-hub-teal text-hub-teal" : "text-gray-500"}`}
        >
          Catálogo & Regras
        </button>
        {/* Autorizações visível para Central */}
        {usuario.perfil === "Central" && (
          <button
            onClick={() => setActiveTab("autorizacoes")}
            className={`px-4 py-3 text-sm font-medium ${activeTab === "autorizacoes" ? "border-b-2 border-hub-teal text-hub-teal" : "text-gray-500"}`}
          >
            Autorizações Pendentes
          </button>
        )}
        <button
          onClick={() => setActiveTab("configuracoes")}
          className={`px-4 py-3 text-sm font-medium ${activeTab === "configuracoes" ? "border-b-2 border-hub-teal text-hub-teal" : "text-gray-500"}`}
        >
          Validade & Parametrização
        </button>
      </div>

      {activeTab === "catalogo" && <ViewCatalogoLoyalty />}
      {activeTab === "autorizacoes" && (
        <ViewAutorizacoesLoyalty />
      )}
      {activeTab === "configuracoes" && <ViewConfigLoyalty />}
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
          <h3 className="text-xl font-semibold text-gray-800">
            Itens de Recompensa
          </h3>
          <p className="text-sm text-gray-500">
            Gerencie os itens disponíveis para troca e seus
            custos.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent"
        >
          <Plus className="w-5 h-5 mr-2" /> Cadastrar Novo Item
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in">
          <h4 className="font-semibold mb-3 text-gray-700">
            Novo Item de Catálogo
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nome do Item (Ex: Voucher Uber)"
              className="px-3 py-2 border rounded-md"
            />
            <select className="px-3 py-2 border rounded-md">
              <option>Selecione Categoria</option>
              <option>Voucher</option>
              <option>Capital Social</option>
              <option>Previdência</option>
              <option>Milhas</option>
            </select>
            <input
              type="number"
              placeholder="Custo em Pontos"
              className="px-3 py-2 border rounded-md"
            />
            <button className="bg-green-600 text-white rounded-md px-4 py-2">
              Salvar Item
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockItensLoyalty.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                {item.categoria}
              </span>
              <button className="text-hub-teal hover:text-hub-teal-dark text-sm font-medium">
                Editar
              </button>
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              {item.nome}
            </h4>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Custo:</span>
                <span className="font-semibold">
                  {item.custoPontos.toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Limite de Uso:
                </span>
                <span className="font-semibold">
                  {item.limitePorResgate
                    ? item.limitePorResgate.toLocaleString()
                    : "Ilimitado"}
                </span>
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
        <h3 className="text-xl font-semibold text-gray-800">
          Autorizações Pendentes
        </h3>
        <p className="text-sm text-gray-500">
          Aprovação de uso de pontos acima do limite automático.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Cooperado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Solicitação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Total Pontos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockSolicitacoesLoyalty.map((sol) => (
              <tr key={sol.id}>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {sol.data}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {sol.cooperado}
                  <br />
                  <span className="text-xs text-gray-400">
                    {sol.cpf}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {sol.produto}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  {sol.item}
                  <br />
                  <span className="text-xs text-orange-600">
                    Requer Autorização Central
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-hub-teal">
                  {sol.pontos.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-bold">
                    APROVAR
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-bold">
                    NEGAR
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

function ViewConfigLoyalty() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuração de Validade */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Validade dos Pontos (Meses)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Defina o tempo de expiração dos pontos por produto.
        </p>
        <div className="space-y-3">
          {mockConfigValidade.map((conf, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="font-medium text-gray-700">
                {conf.produto}
              </span>
              <div className="flex items-center">
                <input
                  type="number"
                  defaultValue={conf.validadeMeses}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center mr-2 focus:ring-hub-teal focus:border-hub-teal"
                />
                <span className="text-sm text-gray-500">
                  meses
                </span>
              </div>
            </div>
          ))}
          <button className="w-full py-2 bg-hub-teal text-white rounded-lg shadow-sm mt-4 hover:bg-teal-700 transition-colors">
            <Save className="w-4 h-4 inline mr-2" /> Salvar
            Validades
          </button>
        </div>
      </div>

      {/* Configuração de Limites Globais */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Limite Global de Uso Automático
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Qualquer solicitação de resgate que exceda este valor
          em pontos necessitará de aprovação manual da Central.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Limite Máximo (Pontos)
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="number"
                defaultValue={5000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-hub-teal focus:border-hub-teal text-lg font-semibold"
              />
              <span className="absolute right-4 top-3 text-gray-400 text-sm">
                pts
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
          <h5 className="text-sm font-bold text-blue-800 mb-1 flex items-center">
            <ShieldAlert className="w-4 h-4 mr-1" /> Regra de
            Segurança
          </h5>
          <p className="text-xs text-blue-700">
            Se o cooperado possuir 15.000 pontos e tentar usar
            6.000, a transação ficará pendente na aba
            "Autorizações". Se usar 4.000, será aprovada
            automaticamente.
          </p>
        </div>

        <button className="w-full py-2 bg-hub-teal text-white rounded-lg shadow-sm hover:bg-teal-700 transition-colors">
          <Save className="w-4 h-4 inline mr-2" /> Atualizar
          Limite Global
        </button>
      </div>
    </div>
  );
}
// =======================================================================
// 18. PÁGINA DE SALA VIP
// =======================================================================

type AcessoSalaVIP = {
  id: number;
  data: string;
  cooperado: string;
  cpf: string;
  produto: string;
  sala: string;
  acompanhantes: number;
  custo: string;
};

const mockAcessosVIP: AcessoSalaVIP[] = [
  {
    id: 1,
    data: "15/11/2025 14:30",
    cooperado: "Ana Beatriz Silva",
    cpf: "123.456.789-00",
    produto: "Visa Infinite",
    sala: "Visa Infinite Lounge GRU",
    acompanhantes: 1,
    custo: "Isento",
  },
  {
    id: 2,
    data: "10/11/2025 09:15",
    cooperado: "Daniel Oliveira",
    cpf: "111.222.333-44",
    produto: "Visa Platinum",
    sala: "W Premium Lounge",
    acompanhantes: 0,
    custo: "US$ 32.00",
  },
];

function PaginaSalaVIP({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<
    "relatorio" | "liberacao"
  >("relatorio");

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("relatorio")}
          className={`px-4 py-3 text-sm font-medium ${activeTab === "relatorio" ? "border-b-2 border-hub-teal text-hub-teal" : "text-gray-500"}`}
        >
          Relatório de Uso
        </button>
        <button
          onClick={() => setActiveTab("liberacao")}
          className={`px-4 py-3 text-sm font-medium ${activeTab === "liberacao" ? "border-b-2 border-hub-teal text-hub-teal" : "text-gray-500"}`}
        >
          Liberar Acesso
        </button>
      </div>

      {activeTab === "relatorio" && <ViewRelatorioSalaVIP />}
      {activeTab === "liberacao" && <ViewLiberarSalaVIP />}
    </div>
  );
}

function ViewRelatorioSalaVIP() {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          Histórico de Acessos
        </h3>

        {/* Filtros Específicos Solicitados */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option>Todas Cooperativas</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option>Todos Produtos</option>
          </select>
          <input
            type="text"
            placeholder="CPF / CNPJ"
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Cooperado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Sala
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Acomp.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Custo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockAcessosVIP.map((acesso) => (
              <tr key={acesso.id}>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acesso.data}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {acesso.cooperado}
                  <br />
                  <span className="text-xs text-gray-400">
                    {acesso.cpf}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acesso.produto}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acesso.sala}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acesso.acompanhantes}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                  {acesso.custo}
                </td>
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
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Liberar Acesso Sala VIP
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            CPF do Cooperado
          </label>
          <input
            type="text"
            placeholder="000.000.000-00"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Produto (Cartão)
          </label>
          <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
            <option>Selecione...</option>
            <option>Visa Infinite</option>
            <option>Visa Platinum</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sala / Aeroporto
          </label>
          <input
            type="text"
            placeholder="Ex: Lounge Key GRU"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg">
          <p className="font-bold flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2" /> Atenção
          </p>
          <p>
            A liberação manual gerará um código QR temporário
            válido por 4 horas.
          </p>
        </div>
        <button className="w-full py-3 bg-hub-teal text-white font-semibold rounded-lg shadow-sm flex justify-center items-center">
          <CheckCircle className="w-5 h-5 mr-2" /> Gerar
          Autorização
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
              <FileText className="w-4 h-4 mr-2 text-green-600" />{" "}
              Excel (.xlsx)
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <File className="w-4 h-4 mr-2 text-red-600" /> PDF
              (.pdf)
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <List className="w-4 h-4 mr-2 text-blue-600" />{" "}
              CSV (.csv)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =======================================================================
// 19. PÁGINA DE GESTÃO DE LIMITES (CORRIGIDA COM SUPABASE)
// 19. PÁGINA DE GESTÃO DE LIMITES (CORRIGIDA COM SUPABASE)
// =======================================================================

// --- Tipos para Gestão de Limites ---
type RegraLimite = {
  id: number;
  origem: "Cooperativa" | "PA" | "Cooperado";
  gatilhoPorcentagem: number;
  aprovadorDestino: "Central" | "Cooperativa";
  gatilhoPorcentagem: number;
  aprovadorDestino: "Central" | "Cooperativa";
};

type SolicitacaoLimite = {
  id: number;
  solicitante: string;
  solicitante: string;
  tipoSolicitante: "Cooperativa" | "PA" | "Cooperado";
  limiteAtual: number;
  limiteSolicitado: number;
  aumentoPorcentagem: number;
  status: "Pendente" | "Aprovado" | "Rejeitado";
};

// --- Mocks para configurações (mantidos locais pois não temos tabela de regras ainda) ---
// --- Mocks para configurações (mantidos locais pois não temos tabela de regras ainda) ---
const mockRegrasLimite: RegraLimite[] = [
  { id: 1, origem: "Cooperativa", gatilhoPorcentagem: 10, aprovadorDestino: "Central" },
  { id: 2, origem: "PA", gatilhoPorcentagem: 15, aprovadorDestino: "Central" },
  { id: 3, origem: "Cooperado", gatilhoPorcentagem: 20, aprovadorDestino: "Central" },
];

const mockSolicitacoesLimite: SolicitacaoLimite[] = [
  { id: 1, solicitante: "Cooperativa Coopesa", tipoSolicitante: "Cooperativa", limiteAtual: 8000000, limiteSolicitado: 9500000, aumentoPorcentagem: 18.75, status: "Pendente" },
  { id: 2, solicitante: "PA 03 (Coopesa)", tipoSolicitante: "PA", limiteAtual: 500000, limiteSolicitado: 600000, aumentoPorcentagem: 20.0, status: "Pendente" },
  { id: 3, solicitante: "Maria Santos (Cooperado)", tipoSolicitante: "Cooperado", limiteAtual: 5000, limiteSolicitado: 8000, aumentoPorcentagem: 60.0, status: "Pendente" },
];

// --- Componente Principal ---
function PaginaGestaoLimites({ usuario }: { usuario: User }) {
  const [activeTab, setActiveTab] = useState<"definir" | "autorizacoes" | "configuracoes">("definir");

  return (
    <div className="space-y-6">
      {/* Menu Superior */}
      {/* Menu Superior */}
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1">
        <SubMenuButton
          label="Definir Limites"
          active={activeTab === "definir"}
          onClick={() => setActiveTab("definir")}
        />
        <SubMenuButton
          label="Autorizações Pendentes"
          active={activeTab === "autorizacoes"}
          onClick={() => setActiveTab("autorizacoes")}
        />
        {(usuario.perfil === "Central" || usuario.perfil === "Master") && (
          <SubMenuButton
            label="Configuração de Regras"
            active={activeTab === "configuracoes"}
            onClick={() => setActiveTab("configuracoes")}
          />
        )}
      </div>

      {/* Conteúdo das Abas */}
      <div className="animate-fade-in">
        {activeTab === "definir" && <TabDefinirLimites usuario={usuario} />}
        {activeTab === "autorizacoes" && <TabAutorizacoesLimites usuario={usuario} />}
        {activeTab === "configuracoes" && <TabConfiguracaoRegras usuario={usuario} />}
      </div>
    </div>
  );
}

// --- ABA 1: DEFINIR LIMITES (CORRIGIDA - BUSCA DO SUPABASE) ---
function TabDefinirLimites({ usuario }: { usuario: User }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados reais baseados no perfil
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let data: any[] = [];

        if (usuario.perfil === "Central") {
          // Central vê Cooperativas
          const { data: coops } = await supabase
            .from("cooperativas")
            .select("*")
            .eq("central_id", usuario.centralId);

          if (coops) {
            data = coops.map((c: any) => ({
              id: c.id,
              nome: c.nome,
              doc: c.cnpj,
              limite: Number(c.limite_outorgado || 0),
            }));
          }
        } else if (usuario.perfil === "Cooperativa") {
          // Cooperativa vê PAs
          const { data: pas } = await supabase
            .from("pontos_atendimento")
            .select("*")
            .eq("cooperativa_id", usuario.cooperativaId);

          if (pas) {
            data = pas.map((p: any) => ({
              id: p.id,
              nome: p.nome,
              doc: p.codigo,
              limite: 500000, // Mock: PA não tem coluna de limite no banco ainda
            }));
          }
        } else if (usuario.perfil === "PA") {
          // PA vê Cooperados
          const { data: cooperados } = await supabase
            .from("cooperados")
            .select("*, cartoes(*)")
            .eq("ponto_atendimento_id", usuario.pontoAtendimentoId);

          if (cooperados) {
            data = cooperados.map((c: any) => {
              // Soma limites dos cartões
              const limiteTotal =
                c.cartoes?.reduce(
                  (acc: number, card: any) => acc + Number(card.limite || 0),
                  0
                ) || 0;
              return {
                id: c.id,
                nome: c.nome,
                doc: c.cpf,
                limite: limiteTotal,
              };
            });
          }
        }

        setItems(data);
      } catch (error) {
        console.error("Erro ao buscar limites:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [usuario]);

  // Filtragem local
  const itemsFiltrados = items.filter((item) =>
    (item.nome || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (item.doc && item.doc.toString().includes(searchTerm))
  );

  // 1. Visão MASTER (retorno rápido)
  if (usuario.perfil === "Master") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800">Visão Master</h3>
        <p className="text-gray-500 mt-2">
          O usuário Master gerencia os limites globais das Centrais.
        </p>
      </div>
    );
  }

  // --- RENDERIZAÇÃO P/ Central / Cooperativa / PA ---
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {usuario.perfil === "Central"
          ? "Limites das Cooperativas"
          : usuario.perfil === "Cooperativa"
          ? "Limites dos Pontos de Atendimento"
          : "Limites dos Cooperados"}
      </h3>

      <div className="mb-6 max-w-md relative">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hub-teal"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento / Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limite Atual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Carregando dados...
                </td>
              </tr>
            ) : itemsFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              itemsFiltrados.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{item.doc}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {Number(item.limite || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-hub-teal hover:text-hub-teal-dark font-medium text-sm flex items-center">
                      <Edit2 className="w-4 h-4 mr-1" /> Alterar Limite
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// --- ABA 2: AUTORIZAÇÕES (Mantida com Mocks por enquanto, mas segura) ---
function TabAutorizacoesLimites({ usuario }: { usuario: User }) {
  const solicitacoesVisiveis = mockSolicitacoesLimite.filter((sol) => {
    if (usuario.perfil === "Central") return true; 
    if (usuario.perfil === "Cooperativa") return sol.tipoSolicitante !== "Cooperativa";
    return false;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Autorizações de Aumento de Limite</h3>
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
            {solicitacoesVisiveis.map((sol) => (
              <tr key={sol.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{sol.solicitante}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">{sol.tipoSolicitante}</span></td>
                <td className="px-6 py-4 text-gray-500">{sol.limiteAtual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td className="px-6 py-4 font-bold text-hub-teal">{sol.limiteSolicitado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td className="px-6 py-4"><span className="text-red-600 font-bold">+{sol.aumentoPorcentagem.toFixed(2)}%</span></td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">{sol.status}</span></td>
                <td className="px-6 py-4 space-x-2">
                  <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Aprovar</button>
                  <button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Rejeitar</button>
                </td>
              </tr>
            ))}
            {solicitacoesVisiveis.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">Nenhuma solicitação pendente.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function TabConfiguracaoRegras({ usuario }: { usuario: User }) {
  const [regras, setRegras] = useState<
    { id: number; origem: string; aprovadorDestino: string; gatilhoPorcentagem?: number }[]
  >(Array.isArray(mockRegrasLimite) ? mockRegrasLimite : []);

  // Atualiza um campo da regra localmente (imuta o estado)
  const handleUpdateRegra = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setRegras((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // Simula salvar a regra (substitua pela chamada real ao supabase quando disponível)
  const handleSalvarRegra = (id: number) => {
    const regra = regras.find((r) => r.id === id);
    console.log("Salvar regra (mock):", regra);
    // TODO: chamar API/supabase para persistir
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Configuração de Alçadas de Aprovação
      </h3>

      <div className="grid gap-6">
        {regras.map((regra) => (
          <div
            key={regra.id}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between shadow-sm"
          >
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h4 className="font-bold text-gray-800 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-hub-teal" />
                Solicitação de {regra.origem}
              </h4>
              <div className="text-xs text-gray-500 mt-2">Regra #{regra.id}</div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-600">Gatilho (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={regra.gatilhoPorcentagem ?? 0}
                onChange={(e) =>
                  handleUpdateRegra(regra.id, "gatilhoPorcentagem", Number(e.target.value))
                }
                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
              />

              <label className="text-xs text-gray-600 hidden md:block">Aprovador</label>
              <select
                value={regra.aprovadorDestino}
                onChange={(e) => handleUpdateRegra(regra.id, "aprovadorDestino", e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="Central">Central</option>
                <option value="Cooperativa">Cooperativa</option>
                <option value="PA">PA</option>
              </select>

              <button
                onClick={() => handleSalvarRegra(regra.id)}
                className="ml-2 px-3 py-1 bg-hub-teal text-white rounded-md text-sm hover:bg-hub-teal-dark"
              >
                Salvar
              </button>
            </div>
          </div>
        ))}

        {regras.length === 0 && (
          <div className="p-4 text-center text-gray-500">Nenhuma regra configurada.</div>
        )}
      </div>
    </div>
  );
}

// =======================================================================
// 20. PÁGINA DE CONTA SALÁRIO (CORRIGIDA)
// =======================================================================

// --- Tipos Específicos para Conta Salário ---
type EnderecoColaborador = {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
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
  statusCartao: "Ativo" | "Bloqueado" | "Cancelado";
  tipoConta: "Conta Salário" | "Conta Corrente";
  numeroConta: string;
  numeroContaCartao: string;
  dataAbertura: string;
  statusContaCorrente: "Ativa" | "Bloqueada" | "Encerrada";
  statusContaCartao: "Ativa" | "Bloqueada" | "Cancelada";
};

// --- Mock de Dados Conta Salário ---
const mockContasSalario: DadosContaSalario[] = [
  {
    id: 1,
    colaboradorNome: "João da Silva Trabalhador",
    colaboradorDoc: "123.456.789-00",
    colaboradorEndereco: {
      logradouro: "Rua das Indústrias",
      numero: "500",
      bairro: "Distrito Industrial",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01000-000",
    },
    vinculoCnpj: "12.345.678/0001-90",
    vinculoNomeFantasia: "Indústrias Silva LTDA",
    vinculoResponsavel: "Roberto Empresário Silva",
    cartaoNumeroCompleto: "4855123456789012",
    dataEmissaoCartao: "12/01/2024",
    dataValidadeCartao: "01/29",
    statusCartao: "Ativo",
    tipoConta: "Conta Salário",
    numeroConta: "102030-4",
    numeroContaCartao: "99887766",
    dataAbertura: "10/01/2024",
    statusContaCorrente: "Ativa",
    statusContaCartao: "Ativa",
  },
  {
    id: 2,
    colaboradorNome: "Maria Souza Atendente",
    colaboradorDoc: "987.654.321-11",
    colaboradorEndereco: {
      logradouro: "Av. Brasil",
      numero: "100",
      bairro: "Centro",
      cidade: "Rio de Janeiro",
      uf: "RJ",
      cep: "20000-000",
    },
    vinculoCnpj: "12.345.678/0001-90",
    vinculoNomeFantasia: "Indústrias Silva LTDA",
    vinculoResponsavel: "Roberto Empresário Silva",
    cartaoNumeroCompleto: "5500987654321098",
    dataEmissaoCartao: "16/03/2024",
    dataValidadeCartao: "03/29",
    statusCartao: "Bloqueado",
    tipoConta: "Conta Corrente",
    numeroConta: "405060-X",
    numeroContaCartao: "11223344",
    dataAbertura: "15/03/2024",
    statusContaCorrente: "Ativa",
    statusContaCartao: "Bloqueada",
  },
];

// --- Componente Principal ---
function PaginaContaSalario({ usuario }: { usuario: User }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConta, setSelectedConta] =
    useState<DadosContaSalario | null>(null);

  const contasFiltradas = mockContasSalario.filter(
    (c) =>
      c.colaboradorNome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.colaboradorDoc.includes(searchTerm) ||
      c.vinculoNomeFantasia
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Gestão de Conta Salário
          </h3>
          <p className="text-sm text-gray-500">
            Colaboradores vinculados e detalhes de contas.
          </p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Colaborador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Endereço de Entrega
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Empresa (CNPJ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contasFiltradas.map((conta) => (
                <tr
                  key={conta.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">
                      {conta.colaboradorNome}
                    </div>
                    <div className="text-xs text-gray-500">
                      CPF: {conta.colaboradorDoc}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>
                      {conta.colaboradorEndereco.logradouro},{" "}
                      {conta.colaboradorEndereco.numero}
                    </p>
                    <p className="text-xs text-gray-400">
                      {conta.colaboradorEndereco.cidade}/
                      {conta.colaboradorEndereco.uf} -{" "}
                      {conta.colaboradorEndereco.cep}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {conta.vinculoNomeFantasia}
                    </div>
                    <div className="text-xs text-gray-500">
                      {conta.vinculoCnpj}
                    </div>
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
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500 italic"
                  >
                    Nenhum colaborador encontrado com os termos
                    pesquisados.
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
function ModalDetalhesContaSalario({
  dados,
  onClose,
}: {
  dados: DadosContaSalario;
  onClose: () => void;
}) {
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
              <h3 className="text-2xl font-bold text-gray-800">
                {dados.colaboradorNome}
              </h3>
              <p className="text-sm text-gray-500">
                CPF: {dados.colaboradorDoc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              <Building className="w-5 h-5 mr-2 text-hub-teal" />{" "}
              Empresa Vinculada
            </h4>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">
                  Nome Fantasia
                </label>
                <p className="text-gray-900 font-medium">
                  {dados.vinculoNomeFantasia}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">
                  CNPJ
                </label>
                <p className="text-gray-900 font-medium">
                  {dados.vinculoCnpj}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">
                  Responsável
                </label>
                <p className="text-gray-900 font-medium">
                  {dados.vinculoResponsavel}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              <CreditCard className="w-5 h-5 mr-2 text-hub-teal" />{" "}
              Cartão de Débito
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-80 h-48 bg-gradient-to-br from-gray-800 to-black rounded-xl p-6 text-white shadow-lg relative overflow-hidden flex-shrink-0">
                <div className="flex justify-between items-start">
                  <CreditCard className="w-8 h-8 opacity-80" />
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold ${dados.statusCartao === "Ativo" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {dados.statusCartao.toUpperCase()}
                  </span>
                </div>
                <div className="mt-8">
                  <p className="text-xl font-mono tracking-widest">
                    {maskCartao(dados.cartaoNumeroCompleto)}
                  </p>
                </div>
                <div className="mt-auto pt-6 flex justify-between text-xs opacity-80">
                  <div>
                    <span className="block text-[10px] uppercase">
                      Emissão
                    </span>
                    <span>{dados.dataEmissaoCartao}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase">
                      Validade
                    </span>
                    <span>{dados.dataValidadeCartao}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 content-center">
                <div className="p-3 bg-white border rounded shadow-sm">
                  <label className="text-xs text-gray-500">
                    Número Mascarado
                  </label>
                  <p className="font-mono text-lg">
                    {maskCartao(dados.cartaoNumeroCompleto)}
                  </p>
                </div>
                <div className="p-3 bg-white border rounded shadow-sm">
                  <label className="text-xs text-gray-500">
                    Status Cartão
                  </label>
                  <p
                    className={`font-bold ${dados.statusCartao === "Ativo" ? "text-green-600" : "text-red-600"}`}
                  >
                    {dados.statusCartao}
                  </p>
                </div>
                <div className="p-3 bg-white border rounded shadow-sm">
                  <label className="text-xs text-gray-500">
                    Emissão
                  </label>
                  <p className="font-medium">
                    {dados.dataEmissaoCartao}
                  </p>
                </div>
                <div className="p-3 bg-white border rounded shadow-sm">
                  <label className="text-xs text-gray-500">
                    Validade
                  </label>
                  <p className="font-medium">
                    {dados.dataValidadeCartao}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              <Wallet className="w-5 h-5 mr-2 text-hub-teal" />{" "}
              Dados da Conta
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <label className="text-xs text-blue-600 uppercase font-bold mb-1 block">
                  Tipo de Conta
                </label>
                <p className="text-xl font-bold text-gray-800">
                  {dados.tipoConta}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">
                  Número da Conta
                </label>
                <p className="text-lg font-mono text-gray-900">
                  {dados.numeroConta}
                </p>
                <div className="mt-2 text-xs">
                  Status:{" "}
                  <span
                    className={`font-bold ${dados.statusContaCorrente === "Ativa" ? "text-green-600" : "text-red-600"}`}
                  >
                    {dados.statusContaCorrente}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">
                  Conta Cartão
                </label>
                <p className="text-lg font-mono text-gray-900">
                  {dados.numeroContaCartao}
                </p>
                <div className="mt-2 text-xs">
                  Status:{" "}
                  <span
                    className={`font-bold ${dados.statusContaCartao === "Ativa" ? "text-green-600" : "text-red-600"}`}
                  >
                    {dados.statusContaCartao}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">
                  Data Abertura
                </label>
                <p className="text-lg text-gray-900">
                  {dados.dataAbertura}
                </p>
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
type TipoServicoAdicional = "PPR" | "Notificacao";
type CanalNotificacao = "SMS" | "WhatsApp" | "Ambos";

type ParcelaPPR = {
  numero: number;
  vencimento: string;
  valor: number;
  status: "Paga" | "Pendente" | "Futura";
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

  status: "Ativo" | "Cancelado";
};

// --- Mocks ---
const mockServicosAdicionais: ServicoAdicional[] = [
  {
    id: 1,
    tipo: "PPR",
    cooperadoNome: "Ana Beatriz Silva",
    documento: "123.456.789-00",
    idCartao: "900103",
    cartaoMascarado: "4111 11** **** 1111",
    valorMensal: 29.9,
    diaCobranca: 10,
    status: "Ativo",
    parcelas: [
      {
        numero: 1,
        vencimento: "10/10/2025",
        valor: 29.9,
        status: "Paga",
      },
      {
        numero: 2,
        vencimento: "10/11/2025",
        valor: 29.9,
        status: "Paga",
      },
      {
        numero: 3,
        vencimento: "10/12/2025",
        valor: 29.9,
        status: "Pendente",
      },
      {
        numero: 4,
        vencimento: "10/01/2026",
        valor: 29.9,
        status: "Futura",
      },
      {
        numero: 5,
        vencimento: "10/02/2026",
        valor: 29.9,
        status: "Futura",
      },
      {
        numero: 6,
        vencimento: "10/03/2026",
        valor: 29.9,
        status: "Futura",
      },
    ],
  },
  {
    id: 2,
    tipo: "Notificacao",
    cooperadoNome: "Carlos Eduardo Souza",
    documento: "543.210.987-00",
    idCartao: "900102",
    cartaoMascarado: "5500 00** **** 2045",
    valorMensal: 5.9,
    diaCobranca: 5,
    canal: "SMS",
    status: "Ativo",
  },
  {
    id: 3,
    tipo: "Notificacao",
    cooperadoNome: "Empresa Silva LTDA",
    documento: "12.345.678/0001-90",
    idCartao: "900105",
    cartaoMascarado: "5500 99** **** 5500",
    valorMensal: 9.9,
    diaCobranca: 15,
    canal: "WhatsApp",
    status: "Ativo",
  },
];

// --- Componente Principal ---
function PaginaServicosAdicionais({
  usuario,
}: {
  usuario: User;
}) {
  const [activeTab, setActiveTab] =
    useState<TipoServicoAdicional>("PPR");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServico, setSelectedServico] =
    useState<ServicoAdicional | null>(null);

  const servicosFiltrados = mockServicosAdicionais.filter(
    (s) =>
      s.tipo === activeTab &&
      (s.cooperadoNome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        s.documento.includes(searchTerm) ||
        s.idCartao.includes(searchTerm)),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Serviços Adicionais
          </h3>
          <p className="text-sm text-gray-500">
            Gerencie seguros e notificações contratadas.
          </p>
        </div>
        <button
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent"
        >
          <Plus className="w-5 h-5 mr-2" /> Nova Contratação
        </button>
      </div>

      {/* Abas */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("PPR")}
          className={`px-6 py-3 text-sm font-medium flex items-center transition-colors border-b-2 ${activeTab === "PPR" ? "border-hub-teal text-hub-teal" : "border-transparent text-gray-500"}`}
        >
          <ShieldAlert className="w-4 h-4 mr-2" /> Seguro PPR
        </button>
        <button
          onClick={() => setActiveTab("Notificacao")}
          className={`px-6 py-3 text-sm font-medium flex items-center transition-colors border-b-2 ${activeTab === "Notificacao" ? "border-hub-teal text-hub-teal" : "border-transparent text-gray-500"}`}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contratante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cartão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cobrança
                </th>
                {activeTab === "PPR" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Parcelas (Pagas/Total)
                  </th>
                )}
                {activeTab === "Notificacao" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Canal
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {servicosFiltrados.map((servico) => (
                <tr
                  key={servico.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">
                      {servico.cooperadoNome}
                    </div>
                    <div className="text-xs text-gray-500">
                      {servico.documento}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-gray-700">
                      {servico.cartaoMascarado}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {servico.idCartao}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-green-700">
                      {servico.valorMensal.toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" },
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Dia {servico.diaCobranca}
                    </div>
                  </td>

                  {/* Coluna Específica PPR com Barra de Progresso */}
                  {activeTab === "PPR" && servico.parcelas && (
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-hub-teal h-2 rounded-full"
                            style={{
                              width: `${(servico.parcelas.filter((p) => p.status === "Paga").length / servico.parcelas.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          {
                            servico.parcelas.filter(
                              (p) => p.status === "Paga",
                            ).length
                          }{" "}
                          / {servico.parcelas.length}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Coluna Específica Notificação */}
                  {activeTab === "Notificacao" && (
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${servico.canal === "WhatsApp" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                      >
                        {servico.canal}
                      </span>
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        setSelectedServico(servico)
                      }
                      className="text-hub-teal hover:text-hub-teal-dark p-2 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                      title="Editar e Gerenciar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {servicosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500"
                  >
                    Nenhum serviço encontrado.
                  </td>
                </tr>
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
function ModalGerenciarServico({
  servico,
  onClose,
}: {
  servico: ServicoAdicional;
  onClose: () => void;
}) {
  const [editandoParcela, setEditandoParcela] = useState<
    number | null
  >(null);
  const [novoValorParcela, setNovoValorParcela] = useState("");

  const [configNotificacao, setConfigNotificacao] = useState({
    canal: servico.canal || "SMS",
    valor: servico.valorMensal,
  });

  const handleSalvarParcela = (numeroParcela: number) => {
    // Aqui entraria a lógica de chamada à API
    alert(
      `Valor da parcela ${numeroParcela} atualizado para R$ ${novoValorParcela}`,
    );
    setEditandoParcela(null);
  };

  const handleSalvarNotificacao = () => {
    alert(
      `Configuração de notificação atualizada:\nCanal: ${configNotificacao.canal}\nNovo Valor: ${configNotificacao.valor}`,
    );
    onClose();
  };

  
}
// =======================================================================
// 22. PÁGINA DE LANÇAMENTOS (ANTIGA BAIXAS) - APENAS CENTRAL
// =======================================================================

// --- Tipos ---
type CategoriaLancamento =
  | "Parcelamento"
  | "Compra Integral"
  | "Fatura"
  | "Anuidade"
  | "PPR"
  | "AntecipacaoCompra" // Novo
  | "AntecipacaoFatura"; // Novo

type TipoOperacao = "Credito" | "Debito" | "Antecipacao";

type LancamentoHistorico = {
  id: number;
  categoria: string;
  operacao: TipoOperacao;
  dataHora: string;
  valor: number;
  status: "Concluído" | "Estornado";

  // Dados do Cartão/Conta
  contaCartao: string;
  idCartao: string;
  cartaoMascarado: string;

  // Auditoria
  quemRealizou: string;
  quemSolicitou: string;
  motivo: string;

  // Detalhes Extras
  parcelasAdiantadas?: number;
};

// --- Mocks ---
const mockHistoricoLancamentos: LancamentoHistorico[] = [
  {
    id: 1,
    categoria: "Anuidade",
    operacao: "Credito",
    dataHora: "17/11/2025 10:30",
    valor: 450.0,
    status: "Concluído",
    contaCartao: "12345-6",
    idCartao: "900103",
    cartaoMascarado: "4111 11** **** 9988",
    quemRealizou: "Patricia Holanda (Credisis)",
    quemSolicitou: "Ana Beatriz Silva (Cooperado)",
    motivo: "Isenção por relacionamento/investimento",
  },
  {
    id: 2,
    categoria: "Fatura",
    operacao: "Debito",
    dataHora: "15/11/2025 09:00",
    valor: 3200.0,
    status: "Concluído",
    contaCartao: "77441-2",
    idCartao: "900104",
    cartaoMascarado: "4111 00** **** 1111",
    quemRealizou: "Sistema Automático",
    quemSolicitou: "Processamento Noturno",
    motivo: "Acerto de processamento",
  },
  {
    id: 3,
    categoria: "Antecipação Parc. Compras",
    operacao: "Antecipacao",
    dataHora: "14/11/2025 14:20",
    valor: 500.0,
    status: "Concluído",
    contaCartao: "54321-0",
    idCartao: "900102",
    cartaoMascarado: "5200 00** **** 2045",
    quemRealizou: "João da Silva",
    quemSolicitou: "Cooperado via Chat",
    motivo: "Adiantamento de 2 parcelas",
    parcelasAdiantadas: 2,
  },
];

// --- Componente Principal ---
function PaginaLancamentos({ usuario }: { usuario: User }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCat, setFiltroCat] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Filtros
  const lancamentosFiltrados = mockHistoricoLancamentos.filter(
    (b) => {
      const matchSearch =
        b.cartaoMascarado.includes(searchTerm) ||
        b.idCartao.includes(searchTerm) ||
        b.contaCartao.includes(searchTerm) ||
        b.quemSolicitou
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchCat =
        filtroCat === "" || b.categoria.includes(filtroCat);

      return matchSearch && matchCat;
    },
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <ArrowDownCircle className="w-6 h-6 mr-2 text-hub-teal" />{" "}
            Central de Lançamentos
          </h3>
          <p className="text-sm text-gray-500">
            Gestão de créditos, débitos e antecipações manuais.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent transition"
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
              <option value="Compra Integral">
                Compra Integral
              </option>
              <option value="Parcelamento">Parcelamento</option>
              <option value="Anuidade">Anuidade</option>
              <option value="Antecipação">Antecipação</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Operação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Detalhes do Cartão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Auditoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lancamentosFiltrados.map((lanc) => (
                <tr key={lanc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {lanc.dataHora}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold border ${
                        lanc.operacao === "Credito"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : lanc.operacao === "Debito"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {lanc.operacao}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {lanc.categoria}
                    {lanc.parcelasAdiantadas && (
                      <span className="text-xs text-gray-500 block">
                        ({lanc.parcelasAdiantadas} parcelas)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-mono text-gray-800">
                      {lanc.cartaoMascarado}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {lanc.idCartao}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {lanc.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>
                      <span className="font-bold text-xs">
                        Realizado:
                      </span>{" "}
                      {lanc.quemRealizou}
                    </div>
                    <div>
                      <span className="font-bold text-xs">
                        Solicitado:
                      </span>{" "}
                      {lanc.quemSolicitou}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-bold text-green-700 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />{" "}
                      {lanc.status}
                    </span>
                  </td>
                </tr>
              ))}
              {lancamentosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-gray-500"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançamentos (Seleção + Formulário) */}
      {showModal && (
        <ModalNovoLancamento
          usuario={usuario}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// --- Componente Modal Novo Lançamento (ATUALIZADO) ---
type OpcaoLancamento =
  | "Credito"
  | "Debito"
  | "AntecipacaoCompra"
  | "AntecipacaoFatura";

function ModalNovoLancamento({
  usuario,
  onClose,
}: {
  usuario: User;
  onClose: () => void;
}) {
  const [etapa, setEtapa] = useState<"selecao" | "formulario">(
    "selecao",
  );
  const [tipoSelecionado, setTipoSelecionado] =
    useState<OpcaoLancamento | null>(null);

  // Campos do Formulário
  const [categoria, setCategoria] = useState<string>("Fatura");
  const [valor, setValor] = useState("");
  const [numParcelas, setNumParcelas] = useState("1");

  // Mock de parcelas restantes (simulando retorno do sistema)
  const parcelasRestantesMock = 10;

  const handleSelect = (tipo: OpcaoLancamento) => {
    setTipoSelecionado(tipo);

    // Pré-seleciona a categoria correta
    if (tipo === "AntecipacaoCompra")
      setCategoria("Antecipação Parc. Compras");
    else if (tipo === "AntecipacaoFatura")
      setCategoria("Antecipação Parc. Fatura");
    else setCategoria("Fatura"); // Default para Crédito/Débito

    setEtapa("formulario");
  };

  const getTituloModal = () => {
    switch (tipoSelecionado) {
      case "Credito":
        return "Novo Lançamento a Crédito";
      case "Debito":
        return "Novo Lançamento a Débito";
      case "AntecipacaoCompra":
        return "Antecipação de Parcela de Compras";
      case "AntecipacaoFatura":
        return "Antecipação de Parcelamento de Fatura";
      default:
        return "Novo Lançamento";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Operação realizada com sucesso!\nTipo: ${tipoSelecionado}\nValor: R$ ${valor}`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {etapa === "selecao"
                ? "Selecionar Tipo de Lançamento"
                : getTituloModal()}
            </h3>
            {etapa === "formulario" &&
              tipoSelecionado === "Credito" && (
                <p className="text-xs text-green-600 mt-1">
                  O portador JÁ realizou o pagamento.
                </p>
              )}
            {etapa === "formulario" &&
              tipoSelecionado === "Debito" && (
                <p className="text-xs text-red-600 mt-1">
                  O portador AINDA IRÁ pagar (Cobrança).
                </p>
              )}
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* --- ETAPA 1: SELEÇÃO (4 BOTÕES) --- */}
        {etapa === "selecao" && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opção 1: Crédito */}
            <button
              onClick={() => handleSelect("Credito")}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200">
                <ArrowDownCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-800">
                Lançamento a Crédito
              </h4>
              <p className="text-xs text-gray-500 text-center mt-1">
                Pagamento já realizado / Estorno
              </p>
            </button>

            {/* Opção 2: Débito */}
            <button
              onClick={() => handleSelect("Debito")}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-200">
                <ArrowDownCircle className="w-6 h-6 text-red-600 transform rotate-180" />
              </div>
              <h4 className="font-bold text-gray-800">
                Lançamento a Débito
              </h4>
              <p className="text-xs text-gray-500 text-center mt-1">
                Cobrança / Dívida nova
              </p>
            </button>

            {/* Opção 3: Antecipação Compras */}
            <button
              onClick={() => handleSelect("AntecipacaoCompra")}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800">
                Antecipação de Compras
              </h4>
              <p className="text-xs text-gray-500 text-center mt-1">
                Adiantar parcelas de compras parceladas
              </p>
            </button>

            {/* Opção 4: Antecipação Fatura */}
            <button
              onClick={() => handleSelect("AntecipacaoFatura")}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-800">
                Antecipação de Fatura
              </h4>
              <p className="text-xs text-gray-500 text-center mt-1">
                Adiantar refinanciamento de fatura
              </p>
            </button>
          </div>
        )}

        {/* --- ETAPA 2: FORMULÁRIO --- */}
        {etapa === "formulario" && (
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 overflow-y-auto"
          >
            {/* Linha 1: Categoria e Valor */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                {/* Se for antecipação, trava o select */}
                {tipoSelecionado?.includes("Antecipacao") ? (
                  <input
                    type="text"
                    value={categoria}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-600"
                  />
                ) : (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal"
                    value={categoria}
                    onChange={(e) =>
                      setCategoria(e.target.value)
                    }
                  >
                    <option value="Fatura">Fatura</option>
                    <option value="Compra Integral">
                      Compra Integral
                    </option>
                    <option value="Parcelamento">
                      Parcelamento
                    </option>
                    <option value="Anuidade">Anuidade</option>
                    <option value="PPR">PPR</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Total (R$)
                </label>
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

            {/* Linha Extra: Apenas para Antecipações */}
            {tipoSelecionado?.includes("Antecipacao") && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Nº Parcelas a Adiantar
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={parcelasRestantesMock}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-hub-teal"
                    value={numParcelas}
                    onChange={(e) =>
                      setNumParcelas(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Parcelas Restantes (Sistema)
                  </label>
                  <div className="w-full px-3 py-2 bg-blue-100 border border-transparent rounded-lg text-blue-900 font-bold">
                    {parcelasRestantesMock} parcelas
                  </div>
                </div>
                <p className="col-span-2 text-xs text-blue-600">
                  * O valor total será calculado com base no
                  desconto de juros proporcional.
                </p>
              </div>
            )}

            {/* Linha 2: Identificação do Cartão */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
              <h4 className="text-sm font-bold text-gray-700 border-b pb-1">
                Dados do Cartão
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs text-gray-500">
                    ID do Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 900103"
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500">
                    Número (6 primeiros + 4 últimos)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="411111"
                      className="w-20 px-2 py-1 border rounded text-sm text-center"
                    />
                    <span>******</span>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="1234"
                      className="w-16 px-2 py-1 border rounded text-sm text-center"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-gray-500">
                    Conta Cartão
                  </label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Linha 3: Auditoria */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quem Solicitou?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Gerente João"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável (Logado)
                </label>
                <input
                  type="text"
                  value={usuario.nome}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo do Lançamento
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-hub-teal"
                placeholder="Descreva detalhadamente o motivo..."
              ></textarea>
            </div>

            <div className="pt-4 flex justify-between border-t mt-4">
              <button
                type="button"
                onClick={() => setEtapa("selecao")}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                Voltar
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-accent"
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
type WalletProvider =
  | "Apple Pay"
  | "Google Pay"
  | "Samsung Pay";
type MetodoValidacao =
  | "OTP (SMS)"
  | "App-to-App"
  | "Call Center";

type SolicitacaoCarteira = {
  id: number;
  cooperado: string;
  cartaoMascarado: string;
  idCartao: string;
  produto: string;
  dataSolicitacao: string;
  wallet: WalletProvider;
  metodo: MetodoValidacao; // O método exigido ou usado para validação
  status: "Pendente" | "Aprovado" | "Rejeitado";
  scoreRisco?: string; // Apenas visual
};

// --- Mocks ---
const mockSolicitacoesWallet: SolicitacaoCarteira[] = [
  {
    id: 1,
    cooperado: "Ana Beatriz Silva",
    cartaoMascarado: "4111 11** **** 9988",
    idCartao: "900103",
    produto: "Visa Infinite",
    dataSolicitacao: "17/11/2025 10:45",
    wallet: "Apple Pay",
    metodo: "App-to-App",
    status: "Pendente",
    scoreRisco: "Baixo",
  },
  {
    id: 2,
    cooperado: "Carlos Eduardo Souza",
    cartaoMascarado: "5200 00** **** 2045",
    idCartao: "900102",
    produto: "Visa Gold",
    dataSolicitacao: "17/11/2025 11:20",
    wallet: "Google Pay",
    metodo: "OTP (SMS)",
    status: "Pendente",
    scoreRisco: "Médio",
  },
  {
    id: 3,
    cooperado: "João Pedro Costa",
    cartaoMascarado: "4111 00** **** 1111",
    idCartao: "900104",
    produto: "Visa Classic",
    dataSolicitacao: "16/11/2025 15:00",
    wallet: "Samsung Pay",
    metodo: "Call Center",
    status: "Rejeitado",
    scoreRisco: "Alto",
  },
];

// --- Componente Principal ---
function PaginaCarteirasVirtuais({
  usuario,
}: {
  usuario: User;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Pendente");
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
    useState<SolicitacaoCarteira | null>(null);

  const solicitacoesFiltradas = mockSolicitacoesWallet.filter(
    (s) => {
      const matchSearch =
        s.cooperado
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        s.cartaoMascarado.includes(searchTerm) ||
        s.idCartao.includes(searchTerm);

      const matchStatus =
        filtroStatus === "Todos" || s.status === filtroStatus;

      return matchSearch && matchStatus;
    },
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Smartphone className="w-6 h-6 mr-2 text-hub-teal" />{" "}
            Carteiras Virtuais
          </h3>
          <p className="text-sm text-gray-500">
            Autorização de provisionamento de tokens (Apple,
            Google, Samsung).
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-600">
            <strong>Pendentes:</strong>{" "}
            {
              mockSolicitacoesWallet.filter(
                (s) => s.status === "Pendente",
              ).length
            }
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cooperado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dados do Cartão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Método Validação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solicitacoesFiltradas.map((sol) => (
                <tr key={sol.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sol.dataSolicitacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {sol.cooperado}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-800">
                      {sol.cartaoMascarado}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {sol.idCartao} | {sol.produto}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center w-max ${
                        sol.wallet === "Apple Pay"
                          ? "bg-gray-900 text-white border-gray-900"
                          : sol.wallet === "Google Pay"
                            ? "bg-white text-gray-700 border-gray-300"
                            : "bg-blue-900 text-white border-blue-900"
                      }`}
                    >
                      {sol.wallet}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sol.metodo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                        sol.status === "Aprovado"
                          ? "bg-green-100 text-green-800"
                          : sol.status === "Rejeitado"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {sol.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {sol.status === "Pendente" && (
                      <button
                        onClick={() =>
                          setSolicitacaoSelecionada(sol)
                        }
                        className="bg-primary text-primary-foreground px-3 py-1 rounded shadow-sm hover:bg-accent text-xs font-bold transition-colors"
                      >
                        Avaliar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {solicitacoesFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-gray-500"
                  >
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
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
function ModalAvaliarWallet({
  solicitacao,
  onClose,
}: {
  solicitacao: SolicitacaoCarteira;
  onClose: () => void;
}) {
  const handleAction = (acao: "Aprovar" | "Negar") => {
    alert(
      `Solicitação ${acao === "Aprovar" ? "APROVADA" : "NEGADA"} com sucesso!\nWallet: ${solicitacao.wallet}\nCooperado: ${solicitacao.cooperado}`,
    );
    onClose();
  };

  
}

// =======================================================================
// COMPONENTES UTILITÁRIOS (KpiCard e Outros)
// =======================================================================

// COMPONENTES UTILITÁRIOS: KpiCard (versão para colar dentro do App.tsx sem 'import'/'export')
function KpiCard({
  title,
  value,
  change = "",
  changeType = "info",
  icon: Icon,
}: {
  title: string;
  value: string | number | React.ReactNode;
  change?: string | number | React.ReactNode;
  changeType?: "positive" | "negative" | "info";
  icon?: React.ElementType<any>;
}) {
  const bgClass =
    changeType === "info"
      ? "bg-gray-100"
      : changeType === "positive"
      ? "bg-green-50"
      : "bg-red-50";

  const iconColorClass =
    changeType === "info"
      ? "text-gray-600"
      : changeType === "positive"
      ? "text-green-600"
      : "text-red-600";

  const changeTextClass =
    changeType === "positive"
      ? "text-green-600"
      : changeType === "negative"
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div
      role="group"
      aria-label={title}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
        </div>

        {Icon ? (
          <div className={`p-3 rounded-lg ${bgClass}`}>
            <Icon className={`w-6 h-6 ${iconColorClass}`} aria-hidden="true" />
          </div>
        ) : null}
      </div>

      {change ? (
        <div className="mt-4 flex items-center">
          <span className={`text-xs font-bold ${changeTextClass}`}>{change}</span>
          {changeType !== "info" && (
            <span className="text-xs text-gray-400 ml-1">vs mês anterior</span>
          )}
        </div>
      ) : null}
    </div>
  );
}
