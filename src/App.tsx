/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AppHeader 
} from './components/AppHeader';
import { 
  StepProgressBar 
} from './components/StepProgressBar';
import { 
  Step1Personal 
} from './components/Step1Personal';
import { 
  Step2Academic 
} from './components/Step2Academic';
import { 
  Step3DetailsFiles 
} from './components/Step3DetailsFiles';
import { 
  Step4Tariffs 
} from './components/Step4Tariffs';
import { 
  OrderSuccessModal 
} from './components/OrderSuccessModal';
import { 
  AdminDashboard 
} from './components/AdminDashboard';
import { 
  AdminLoginModal 
} from './components/AdminLoginModal';
import { 
  PersonalInfo, 
  AcademicInfo, 
  ProjectDetails, 
  TariffPlan, 
  Order, 
  OrderStatus 
} from './types';
import { 
  initTelegramApp, 
  triggerHaptic, 
  ADMIN_TELEGRAM_USERNAME 
} from './utils/telegram';
import { 
  toggleAudio, 
  isSoundEnabled, 
  playSuccessChime, 
  playTap 
} from './utils/audio';
import { fireOrderConfetti } from './utils/confetti';
import { 
  ShieldCheck, 
  Zap, 
  Send, 
  Clock, 
  HelpCircle,
  FileCheck2,
  Smartphone
} from 'lucide-react';

const STORAGE_KEY = 'studentbot_orders_v1';
const THEME_STORAGE_KEY = 'studentbot_theme';
const ADMIN_AUTH_KEY = 'studentbot_admin_auth';

const INITIAL_PERSONAL: PersonalInfo = {
  firstName: '',
  lastName: '',
  birthYear: '2004',
  studyYear: '2-kurs',
  phone: '',
  telegramUsername: ''
};

const INITIAL_ACADEMIC: AcademicInfo = {
  subjectName: '',
  teacherName: '',
  universityName: '',
  faculty: ''
};

const INITIAL_DETAILS: ProjectDetails = {
  workType: 'referat',
  topic: '',
  pageCount: '15-20 bet',
  deadline: 'Ertaga kechgacha',
  additionalNotes: '',
  files: []
};

// Namunaviy dastlabki zayavka
const DEMO_ORDERS: Order[] = [
  {
    id: 'demo-1',
    orderNumber: 'REF-2026-8941',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    personal: {
      firstName: 'Bekzod',
      lastName: 'Rustamov',
      birthYear: '2003',
      studyYear: '3-kurs',
      phone: '+998 (97) 777-12-34',
      telegramUsername: '@bekzod_r'
    },
    academic: {
      subjectName: 'Sun\'iy intellekt va neyron tarmoqlar',
      teacherName: 'dots. Qosimov M.A.',
      universityName: 'Toshkent Axborot Texnologiyalari Universiteti',
      faculty: 'Dasturiy injiniring'
    },
    details: {
      workType: 'referat',
      topic: 'Generativ sun\'iy intellekt modellarining ta\'lim sohasiga integratsiyasi va xavflari',
      pageCount: '18 bet',
      deadline: 'Ertaga 14:00 gacha',
      additionalNotes: 'GOST 7.32 standarti bo\'yicha va mundarijali bo\'lsin',
      files: [
        {
          id: 'f-1',
          name: 'Talablar_va_reja.docx',
          size: 45200,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          extension: 'DOCX',
          uploadedAt: '12:30'
        }
      ]
    },
    tariff: {
      id: 'pro',
      name: 'Pro',
      badge: 'Professional',
      price: 25000,
      priceFormatted: "25 000 so'm",
      description: 'GOST standart, anti-plagiat 85%+ va slayd taqdimot',
      deliveryTime: '3-6 soat ichida',
      features: ['Anti-plagiat 85%+', 'GOST standart', 'PowerPoint taqdimot'],
      accentColor: 'from-purple-500 to-indigo-500',
      borderColor: 'border-purple-500/40',
      glowColor: 'rgba(168, 85, 247, 0.2)'
    },
    status: 'jarayonda',
    totalPrice: 25000
  }
];

export default function App() {
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch {
      // Ignore
    }
    return 'dark';
  });

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Form states
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [personal, setPersonal] = useState<PersonalInfo>(INITIAL_PERSONAL);
  const [academic, setAcademic] = useState<AcademicInfo>(INITIAL_ACADEMIC);
  const [details, setDetails] = useState<ProjectDetails>(INITIAL_DETAILS);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEMO_ORDERS;
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isTelegramFrame, setIsTelegramFrame] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  // Toggle Theme Handler
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize Telegram WebApp hooks on mount
  useEffect(() => {
    initTelegramApp();
    setIsSoundOn(isSoundEnabled());
  }, []);

  // Save orders to localStorage and sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  const handleToggleSound = () => {
    const newState = toggleAudio();
    setIsSoundOn(newState);
  };

  // Open Admin handling: checks authentication
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminMode(!isAdminMode);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } catch {
      // Ignore
    }
    setIsAdminLoginOpen(false);
    setIsAdminMode(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {
      // Ignore
    }
  };

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const handleSelectTariff = (tariff: TariffPlan) => {
    // Generate order ID
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `REF-${new Date().getFullYear()}-${randomId}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      personal: { ...personal },
      academic: { ...academic },
      details: { ...details },
      tariff,
      status: 'yangi',
      totalPrice: tariff.price
    };

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Audio & tactile feedback
    playSuccessChime();
    triggerHaptic('success');
    fireOrderConfetti();

    // Mark all steps completed
    setCompletedSteps([1, 2, 3, 4]);

    // Send to backend API asynchronously if server exists
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {
      // Offline / client storage handles state gracefully
    });
  };

  const handleNewOrder = () => {
    setPersonal(INITIAL_PERSONAL);
    setAcademic(INITIAL_ACADEMIC);
    setDetails(INITIAL_DETAILS);
    setCurrentStep(1);
    setCompletedSteps([]);
    setActiveOrder(null);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    playTap();
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    playTap();
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* Dynamic Glowing Mesh Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/15 dark:bg-cyan-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-indigo-500/15 dark:bg-indigo-600/15 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/10 blur-[130px]" />
      </div>

      {/* Top Header Contract */}
      <AppHeader
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isSoundOn={isSoundOn}
        onToggleSound={handleToggleSound}
        isTelegramFrame={isTelegramFrame}
        onToggleTelegramFrame={() => setIsTelegramFrame(!isTelegramFrame)}
        isAdminMode={isAdminMode}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdmin={handleOpenAdmin}
        onLogoutAdmin={handleAdminLogout}
        ordersCount={orders.length}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8">
        {/* Device frame wrapper if Telegram Mock View is enabled */}
        <div
          className={`w-full transition-all duration-300 ${
            isTelegramFrame
              ? 'max-w-[420px] rounded-[36px] border-[6px] border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-2xl shadow-cyan-950/20 dark:shadow-cyan-950/60 my-2'
              : 'max-w-4xl'
          }`}
        >
          {/* Simulated Telegram status bar when in Telegram frame */}
          {isTelegramFrame && (
            <div className="flex items-center justify-between px-3 py-1 mb-3 text-[11px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
              <span className="font-semibold text-slate-900 dark:text-white">9:41</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Smartphone className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                <span>Telegram WebApp</span>
              </div>
            </div>
          )}

          {/* Conditional Admin View vs Client Wizard */}
          {isAdminMode ? (
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60">
              <AdminDashboard
                orders={orders}
                onUpdateStatus={handleUpdateStatus}
                onDeleteOrder={handleDeleteOrder}
                onClose={() => setIsAdminMode(false)}
                onLogout={handleAdminLogout}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Hero Banner / Mini Kicker */}
              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-50/70 via-white/80 to-indigo-50/70 dark:from-cyan-950/40 dark:via-slate-900/60 dark:to-indigo-950/40 p-4 sm:p-5 backdrop-blur-xl shadow-sm dark:shadow-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                        Tezkor & Kafolatlangan
                      </span>
                    </div>
                    <h1 className="mt-1 font-['Outfit'] text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      Referat, Kurs ishi va Loyihalar
                    </h1>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                      Zayavka qoldiring, narxni tanlang — 1 soatdan boshlab professional tayyorlab beramiz.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <a
                      href={`https://t.me/${ADMIN_TELEGRAM_USERNAME}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all"
                    >
                      <Send className="h-3 w-3" />
                      <span>Admin: @{ADMIN_TELEGRAM_USERNAME}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Multi-step Navigation Indicator */}
              <StepProgressBar
                currentStep={currentStep}
                onSelectStep={(step) => setCurrentStep(step)}
                completedSteps={completedSteps}
              />

              {/* Main Step Glass Card Container */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 p-5 sm:p-7 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 transition-colors duration-200">
                {currentStep === 1 && (
                  <Step1Personal
                    data={personal}
                    onChange={(updated) => setPersonal({ ...personal, ...updated })}
                    onNext={() => {
                      handleStepComplete(1);
                      setCurrentStep(2);
                    }}
                  />
                )}

                {currentStep === 2 && (
                  <Step2Academic
                    data={academic}
                    onChange={(updated) => setAcademic({ ...academic, ...updated })}
                    onNext={() => {
                      handleStepComplete(2);
                      setCurrentStep(3);
                    }}
                    onBack={() => setCurrentStep(1)}
                  />
                )}

                {currentStep === 3 && (
                  <Step3DetailsFiles
                    data={details}
                    onChange={(updated) => setDetails({ ...details, ...updated })}
                    onNext={() => {
                      handleStepComplete(3);
                      setCurrentStep(4);
                    }}
                    onBack={() => setCurrentStep(2)}
                  />
                )}

                {currentStep === 4 && (
                  <Step4Tariffs
                    onSelectTariff={handleSelectTariff}
                    onBack={() => setCurrentStep(3)}
                  />
                )}
              </div>

              {/* Trust & Guarantee Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-white/5 bg-white/60 dark:bg-slate-900/30 p-2.5 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">Anti-Plagiat</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">80-95% originallik</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-white/5 bg-white/60 dark:bg-slate-900/30 p-2.5 text-slate-700 dark:text-slate-300">
                  <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">Tezkor topshirish</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">1 soatdan boshlab</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-white/5 bg-white/60 dark:bg-slate-900/30 p-2.5 text-slate-700 dark:text-slate-300">
                  <FileCheck2 className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">GOST Standart</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Titul & mundarija</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-white/5 bg-white/60 dark:bg-slate-900/30 p-2.5 text-slate-700 dark:text-slate-300">
                  <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">Cheksiz tahrir</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Ultra tarifda kafolat</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Admin Login Modal (Restricts Admin Panel with login & password) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Order Success Modal with @Hack_the_wor1d Telegram link */}
      <OrderSuccessModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        onNewOrder={handleNewOrder}
      />

      {/* Quiet Footer Contract */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/5 py-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
          <p>© 2026 StudentBot Pro. Talabalar uchun qulay zayavka xizmati.</p>
          <div className="flex items-center gap-4">
            <a
              href={`https://t.me/${ADMIN_TELEGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Send className="h-3 w-3" />
              <span>@{ADMIN_TELEGRAM_USERNAME}</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <HelpCircle className="h-3 w-3" />
              24/7 Qo'llab-quvvatlash
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
