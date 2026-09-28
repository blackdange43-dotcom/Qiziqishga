import React from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowLeft, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Crown,
  ChevronRight
} from 'lucide-react';
import { TariffPlan } from '../types';
import { TARIFF_PLANS } from '../data/constants';
import { playTap } from '../utils/audio';
import { triggerHaptic } from '../utils/telegram';

interface Step4TariffsProps {
  onSelectTariff: (tariff: TariffPlan) => void;
  onBack: () => void;
  selectedTariffId?: string;
  isSubmitting?: boolean;
}

export const Step4Tariffs: React.FC<Step4TariffsProps> = ({
  onSelectTariff,
  onBack,
  selectedTariffId,
  isSubmitting = false
}) => {
  const getTariffIcon = (id: string) => {
    switch (id) {
      case 'normal':
        return <ShieldCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />;
      case 'medium':
        return <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case 'pro':
        return <Flame className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'ultra':
        return <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>4-Bosqich · Xizmat Paketi va Tariflar</span>
        </div>
        <h2 className="mt-1 font-['Outfit'] text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sizga mos tarifni tanlang
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Istalgan paketni tanlang, zayavka darhol adminga yo'naltiriladi va tayyorlash boshlanadi.
        </p>
      </div>

      {/* 4 Ta Tariflar Ro'yxati / Kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TARIFF_PLANS.map((plan) => {
          const isSelected = selectedTariffId === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] ${
                plan.borderColor
              } ${
                isSelected
                  ? 'bg-cyan-50/70 dark:bg-slate-900/90 ring-2 ring-cyan-500 shadow-2xl'
                  : 'bg-white/80 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/70 shadow-lg shadow-slate-200/50 dark:shadow-none'
              }`}
              style={{
                boxShadow: isSelected ? `0 0 30px ${plan.glowColor}` : undefined
              }}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase text-slate-950 shadow-md">
                  ★ Eng ko'p tanlangan
                </div>
              )}

              {/* VIP Ultra Badge */}
              {plan.id === 'ultra' && (
                <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase text-slate-950 shadow-md">
                  👑 VIP Tezkor
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner">
                      {getTariffIcon(plan.id)}
                    </div>
                    <div>
                      <h3 className="font-['Outfit'] text-base font-bold text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <Clock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span>{plan.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-4 pb-3 border-b border-slate-200/80 dark:border-white/10 flex items-baseline gap-2">
                  <span className="font-['Outfit'] text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {plan.priceFormatted}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ 1 ta ish uchun</span>
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {plan.description}
                </p>

                {/* Feature checklist */}
                <ul className="mt-4 space-y-2 text-xs">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button for Tariff */}
              <div className="mt-6 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    playTap();
                    triggerHaptic('medium');
                    onSelectTariff(plan);
                  }}
                  className={`group relative flex w-full min-h-[46px] items-center justify-center gap-2 rounded-xl font-semibold text-xs transition-all active:scale-[0.98] ${
                    plan.id === 'ultra'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 font-bold'
                      : plan.id === 'pro'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:brightness-110'
                      : plan.id === 'medium'
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110 font-bold'
                      : 'border border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500/20'
                  }`}
                >
                  <span>{plan.name}ni tanlash</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to edit */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            playTap();
            onBack();
          }}
          className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 px-4 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Mavzuni o'zgartirish</span>
        </button>

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Tanlangan tarif bo'yicha to'lov adminga bog'lanish orqali amalga oshiriladi.
        </p>
      </div>
    </div>
  );
};
