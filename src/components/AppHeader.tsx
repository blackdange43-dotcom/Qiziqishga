import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Lock, 
  Unlock, 
  LogOut, 
  Sun, 
  Moon 
} from 'lucide-react';
import { playTap } from '../utils/audio';

interface AppHeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  isTelegramFrame: boolean;
  onToggleTelegramFrame: () => void;
  isAdminMode: boolean;
  isAdminAuthenticated: boolean;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
  ordersCount: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  theme,
  onToggleTheme,
  isSoundOn,
  onToggleSound,
  isTelegramFrame,
  onToggleTelegramFrame,
  isAdminMode,
  isAdminAuthenticated,
  onOpenAdmin,
  onLogoutAdmin,
  ordersCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
            <span className="text-base font-black text-white tracking-wider">SB</span>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
          </div>
          <span className="font-['Outfit'] text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            StudentBot <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">Pro</span>
          </span>
        </div>

        {/* Zone 2: Clean unboxed metadata with typographic separators */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            Antivirus Himoya Faol
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>Referat & Loyihalar</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>Telegram WebApp v2.5</span>
        </div>

        {/* Zone 3: Actions (Theme Toggle, Sound, TWA View, Admin) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={() => {
              playTap();
              onToggleTheme();
            }}
            title={theme === 'dark' ? "Yorug' rejimga o'tish (Light Mode)" : "Qorong'i rejimga o'tish (Dark Mode)"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95"
            aria-label="Mavzuni almashtirish"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              playTap();
              onToggleSound();
            }}
            title={isSoundOn ? "Ovozni o'chirish" : "Ovozni yoqish"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95"
            aria-label="Ovoz sozlamasi"
          >
            {isSoundOn ? (
              <Volume2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            )}
          </button>

          {/* Telegram View Mock Toggle (TWA vs Web) */}
          <button
            type="button"
            onClick={() => {
              playTap();
              onToggleTelegramFrame();
            }}
            title={isTelegramFrame ? "To'liq veb ko'rinish" : "Telegram Mini App ko'rinishi"}
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-white/10"
          >
            {isTelegramFrame ? (
              <>
                <Monitor className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="whitespace-nowrap">Veb rejim</span>
              </>
            ) : (
              <>
                <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="whitespace-nowrap">Telegram ko'rinish</span>
              </>
            )}
          </button>

          {/* Admin Mode Button (Locked / Unlocked / Active) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                playTap();
                onOpenAdmin();
              }}
              className={`flex h-9 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 text-xs font-semibold transition-all ${
                isAdminMode
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : isAdminAuthenticated
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
                  : 'border border-slate-300 dark:border-cyan-500/30 bg-slate-100 dark:bg-cyan-500/10 text-slate-700 dark:text-cyan-300 hover:bg-slate-200 dark:hover:bg-cyan-500/20'
              }`}
            >
              {isAdminMode ? (
                <>
                  <Unlock className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">Mijoz rejimi</span>
                </>
              ) : isAdminAuthenticated ? (
                <>
                  <Unlock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="whitespace-nowrap">Admin ({ordersCount})</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 text-slate-500 dark:text-cyan-400" />
                  <span className="whitespace-nowrap">Admin</span>
                </>
              )}
            </button>

            {/* Logout button if authenticated */}
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  playTap();
                  onLogoutAdmin();
                }}
                title="Admin hisobidan chiqish"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-rose-500 hover:bg-rose-500/10 transition-colors"
                aria-label="Chiqish"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
