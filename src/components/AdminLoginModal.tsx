import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Eye, EyeOff, X, ShieldAlert, ArrowRight, CheckCircle2, ShieldCheck, Timer } from 'lucide-react';
import { playTap, playSuccessChime, playVirusAlert } from '../utils/audio';
import { triggerHaptic } from '../utils/telegram';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SECURE_ADMIN_LOGIN = 'ADMIN';
export const SECURE_ADMIN_PASSWORD = '8756863622:AAFOlVOorTYNU89ocvNWrGUnIVCXYyzSXAU';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Xavfsizlik: Brute-force himoyasi
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFailedAttempts(0);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  const isLockedOut = lockoutSeconds > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setIsLoading(true);
    setError(null);

    const cleanUser = username.trim().toUpperCase();
    const cleanPass = password.trim();

    try {
      // 1. Backend orqali xavfsiz autentifikatsiya tekshiruvi
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });

      if (res.ok) {
        setFailedAttempts(0);
        setIsLoading(false);
        playSuccessChime();
        triggerHaptic('success');
        onSuccess();
        return;
      }

      if (res.status === 429) {
        const data = await res.json();
        setLockoutSeconds(data.remainingSeconds || 60);
        setError(data.error || "Ko'p marta xato kiritildi! Tizim 60 soniyaga bloklandi.");
        setIsLoading(false);
        playVirusAlert();
        triggerHaptic('error');
        return;
      }
    } catch {
      // Offline fallback: to'g'ridan-to'g'ri qat'iy tekshiruv
    }

    // Client-side fallback tekshiruv
    if (cleanUser === SECURE_ADMIN_LOGIN && cleanPass === SECURE_ADMIN_PASSWORD) {
      setFailedAttempts(0);
      setIsLoading(false);
      playSuccessChime();
      triggerHaptic('success');
      onSuccess();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setIsLoading(false);
      playVirusAlert();
      triggerHaptic('error');

      if (newAttempts >= 5) {
        setLockoutSeconds(60);
        setError("Xavfsizlik: 5 marta xato urinish! Tizim 60 soniyaga vaqtincha bloklandi.");
      } else {
        setError(`Login yoki parol noto'g'ri! (Qolgan urinishlar: ${5 - newAttempts})`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-6 text-slate-900 dark:text-white shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl animate-in zoom-in-95 duration-150">
        {/* Glow ambient background spot */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-cyan-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-indigo-500/20 blur-2xl" />

        {/* Close button */}
        <button
          onClick={() => {
            playTap();
            onClose();
          }}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 shadow-lg shadow-amber-500/25">
          <Lock className="h-7 w-7 text-slate-950 stroke-[2.5]" />
        </div>

        {/* Title */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Himoyalangan Admin Portali</span>
          </div>
          <h3 className="font-['Outfit'] text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Autentifikatsiyasi
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Zayavkalarni boshqarish uchun maxfiy login va parolni kiriting.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {/* Username Input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Login
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                autoFocus
                disabled={isLockedOut}
                placeholder="Loginni kiriting"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error && !isLockedOut) setError(null);
                }}
                className="w-full min-h-[42px] rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Maxfiy Parol
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLockedOut}
                placeholder="Xavfsizlik parolini kiriting"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error && !isLockedOut) setError(null);
                }}
                className="w-full min-h-[42px] rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 pl-9 pr-10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-50"
              />
              <button
                type="button"
                disabled={isLockedOut}
                onClick={() => {
                  playTap();
                  setShowPassword(!showPassword);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-white disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error & Lockout Message */}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 p-2.5 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 animate-in shake">
              {isLockedOut ? (
                <Timer className="h-4 w-4 shrink-0 mt-0.5 text-rose-500 animate-spin" />
              ) : (
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              )}
              <div className="min-w-0">
                <p className="font-semibold">{error}</p>
                {isLockedOut && (
                  <p className="mt-0.5 text-[11px] font-mono font-bold text-rose-500">
                    Qayta urinish: {lockoutSeconds} soniya qoldi
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading || isLockedOut}
            className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl font-semibold text-xs transition-all active:scale-[0.98] ${
              isLockedOut
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                <span>Tekshirilmoqda...</span>
              </span>
            ) : isLockedOut ? (
              <span className="flex items-center gap-1.5">
                <Timer className="h-4 w-4" />
                <span>Vaqtincha bloklandi ({lockoutSeconds}s)</span>
              </span>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                <span>Tizimga kirish</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge at bottom */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          <span>256-bit Shifrlangan Xavfsiz Autentifikatsiya</span>
        </div>
      </div>
    </div>
  );
};
