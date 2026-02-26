import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Home as HomeIcon, Users, Package, Calendar, FileText, BarChart3, Settings, Menu, X, User, LogOut, Target, ChevronDown, ChevronRight, TrendingUp, Percent, CheckSquare, Book, Clipboard } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Toaster } from '@/app/components/ui/sonner';
import { Home } from '@/app/components/Home';
// Lazy load heavy components
const OpportunityManagement = lazy(() => import('@/app/components/OpportunityManagement').then(m => ({ default: m.OpportunityManagement })));
const SalesTeam = lazy(() => import('@/app/components/SalesTeam').then(m => ({ default: m.SalesTeam })));
const SalesRepresentative = lazy(() => import('@/app/components/SalesRepresentative').then(m => ({ default: m.default })));
const ProductCatalog = lazy(() => import('@/app/components/ProductCatalog'));
const DemoScheduler = lazy(() => import('@/app/components/DemoScheduler').then(m => ({ default: m.DemoScheduler })));
const Contract = lazy(() => import('@/app/components/Contract').then(m => ({ default: m.Contract })));
const SalesReports = lazy(() => import('@/app/components/SalesReports').then(m => ({ default: m.SalesReports })));
const AdminSystem = lazy(() => import('@/app/components/AdminSystem').then(m => ({ default: m.AdminSystem })));
const AdvancedAnalytics = lazy(() => import('@/app/components/AdvancedAnalytics').then(m => ({ default: m.AdvancedAnalytics })));
const SalesLeaderboard = lazy(() => import('@/app/components/SalesLeaderboard').then(m => ({ default: m.SalesLeaderboard })));
const PerformanceHub = lazy(() => import('@/app/components/PerformanceHub').then(m => ({ default: m.PerformanceHub })));
const KPIAIEnhanced = lazy(() => import('@/app/components/KPIAIEnhanced').then(m => ({ default: m.KPIAIEnhanced })));
// New feature components
const DiscountApprovalSystem = lazy(() => import('@/app/components/DiscountApprovalSystem').then(m => ({ default: m.DiscountApprovalSystem })));
const QuotationManagement = lazy(() => import('@/app/components/QuotationManagement').then(m => ({ default: m.QuotationManagement })));
const TaskManagement = lazy(() => import('@/app/components/TaskManagement').then(m => ({ default: m.TaskManagement })));
const KnowledgeBase = lazy(() => import('@/app/components/KnowledgeBase').then(m => ({ default: m.KnowledgeBase })));
const ConfigurePriceQuote = lazy(() => import('@/app/components/ConfigurePriceQuote').then(m => ({ default: m.ConfigurePriceQuote })));
import { AIAssistant } from '@/app/components/AIAssistant';
import { AIChatAssistant } from '@/app/components/ai/AIChatAssistant';
import { AppNotifications } from '@/app/components/AppNotifications';
import { CollaborationIndicator } from '@/app/components/CollaborationIndicator';
import { LoadingScreen } from '@/app/components/LoadingScreen';
import { ComponentLoader } from '@/app/components/ComponentLoader';
import { Login } from '@/app/components/Login';
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { initializeAllData } from '@/utils/initializeAllData';
import '@/utils/demoDebug'; // Load debug utilities
import { toast } from 'sonner';
import { contracts as dummyContracts, Contract as ContractType } from '@/app/data/dummyData';

type SubMenuItem = {
  id: string;
  name: string;
  component: React.ComponentType;
};

type MenuItem = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  component?: React.ComponentType;
  subMenus?: SubMenuItem[];
};

function AppContent() {
  const { user, logout, login, isAuthenticated } = useAuth();
  const [activeMenu, setActiveMenu] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]); // All menus collapsed by default
  const [contracts, setContracts] = useState<ContractType[]>(dummyContracts);
  const [selectedContract, setSelectedContract] = useState<ContractType | null>(null);

  // Reset to Home menu whenever authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      setActiveMenu('home');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Initialize all dummy data on app load
    initializeAllData();
    
    // Optimized loading - reduced from 1500ms to 500ms
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register Service Worker (async, non-blocking)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const menuItems: MenuItem[] = [
    { id: 'home', name: 'Home', icon: HomeIcon, component: Home },
    { id: 'opportunities', name: 'Opportunity Management', icon: TrendingUp, component: OpportunityManagement },
    { id: 'team', name: 'CRM', icon: Users, component: SalesTeam },
    { id: 'sales-representative', name: 'Sales Representative', icon: Users, component: SalesRepresentative },
    { id: 'products', name: 'Product Catalog', icon: Package, component: ProductCatalog },
    { id: 'cpq', name: 'Configure, Propose & Quote', icon: Clipboard, component: ConfigurePriceQuote },
    { id: 'quotations', name: 'Quotation Management', icon: FileText, component: QuotationManagement },
    { id: 'demos', name: 'Demo Scheduler', icon: Calendar, component: DemoScheduler },
    { id: 'contracts', name: 'Contract', icon: FileText, component: Contract },
    { id: 'discount-approval', name: 'Discount Approval', icon: Percent, component: DiscountApprovalSystem },
    { id: 'reports', name: 'Sales Reports', icon: BarChart3, component: SalesReports },
    { 
      id: 'kpi', 
      name: 'KPI', 
      icon: Target,
      subMenus: [
        { id: 'kpi-tracker', name: 'KPI Tracker', component: PerformanceHub },
        { id: 'leaderboard', name: 'Leaderboard', component: SalesLeaderboard },
        { id: 'kpi-ai-enhanced', name: 'KPI Target', component: KPIAIEnhanced }
      ]
    },
    { id: 'tasks', name: 'Task Management', icon: CheckSquare, component: TaskManagement },
    { id: 'knowledge-base', name: 'Knowledge Base', icon: Book, component: KnowledgeBase },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, component: AdvancedAnalytics },
    { id: 'admin', name: 'Admin System', icon: Settings, component: AdminSystem }
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast.success('Berhasil logout!');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={(email, role, name) => {
          login(email, role, name);
          toast.success('Login berhasil! Selamat datang.');
        }} 
      />
    );
  }

  // Find active component from menu items or submenus
  const findActiveComponent = (): React.ComponentType => {
    for (const item of menuItems) {
      if (item.id === activeMenu && item.component) {
        return item.component;
      }
      if (item.subMenus) {
        const subItem = item.subMenus.find(sub => sub.id === activeMenu);
        if (subItem) {
          return subItem.component;
        }
      }
    }
    return Home;
  };

  // Find active menu name
  const findActiveMenuName = (): string => {
    for (const item of menuItems) {
      if (item.id === activeMenu) {
        return item.name;
      }
      if (item.subMenus) {
        const subItem = item.subMenus.find(sub => sub.id === activeMenu);
        if (subItem) {
          return subItem.name;
        }
      }
    }
    return 'Home';
  };

  const ActiveComponent = findActiveComponent();
  const activeMenuName = findActiveMenuName();
  
  // Get user initials for avatar
  const userInitials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-[#01544e]">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold text-white">Sales Monitoring</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-white/20"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 sidebar-nav-scroll">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.subMenus) {
                      setExpandedMenus(prev => {
                        if (prev.includes(item.id)) {
                          return prev.filter(id => id !== item.id);
                        } else {
                          return [...prev, item.id];
                        }
                      });
                    } else {
                      setActiveMenu(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    activeMenu === item.id
                      ? 'bg-[#01544e] text-white shadow-md'
                      : 'text-gray-700 hover:bg-[#e6f2f1] hover:text-[#01544e]'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <>
                      <span className="font-medium text-sm truncate flex-1 text-left">{item.name}</span>
                      {item.subMenus && (
                        expandedMenus.includes(item.id) 
                          ? <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          : <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                    </>
                  )}
                </button>
                {isSidebarOpen && item.subMenus && expandedMenus.includes(item.id) && (
                  <div className="mt-1 space-y-1">
                    {item.subMenus.map(subItem => (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveMenu(subItem.id)}
                        className={`w-full flex items-center gap-3 pl-11 pr-3 py-2.5 rounded-lg transition-all ${
                          activeMenu === subItem.id
                            ? 'bg-[#01544e] text-white shadow-md'
                            : 'text-gray-600 hover:bg-[#e6f2f1] hover:text-[#01544e]'
                        }`}
                      >
                        <span className="text-sm truncate">{subItem.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="h-10 w-10 rounded-full bg-[#01544e] flex items-center justify-center text-white font-semibold flex-shrink-0">
              {userInitials}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#01544e]">
              {activeMenuName}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* PWA Install Button */}
            {deferredPrompt && (
              <Button
                onClick={() => {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult: any) => {
                    if (choiceResult.outcome === 'accepted') {
                      console.log('PWA installed');
                    }
                    setDeferredPrompt(null);
                  });
                }}
                variant="outline"
                size="sm"
                className="hidden md:flex"
              >
                Install App
              </Button>
            )}
            
            {/* Collaboration Indicator */}
            <div className="hidden lg:block">
              <CollaborationIndicator />
            </div>
            
            {/* Notification Center */}
            <AppNotifications 
              contracts={contracts}
              onViewContract={(contract) => {
                setSelectedContract(contract);
                setActiveMenu('contracts');
              }}
            />
            
            <div className="relative user-menu-container">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="h-5 w-5" />
              </Button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="h-12 w-12 rounded-full bg-[#01544e] flex items-center justify-center text-white font-semibold">
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                      <p className="text-xs text-[#01544e] font-medium mt-1">{user?.role}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<ComponentLoader />}>
              <ActiveComponent />
            </Suspense>
          </div>
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant />
      <AIChatAssistant />

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}