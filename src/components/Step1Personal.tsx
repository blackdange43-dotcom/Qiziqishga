import React, { useState } from 'react';
import { User, Calendar, Phone, Send, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { PersonalInfo, StudyYear } from '../types';
import { STUDY_YEARS } from '../data/constants';
import { playTap, playStepChange } from '../utils/audio';

interface Step1PersonalProps {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
  onNext: () => void;
}

export const Step1Personal: React.FC<Step1PersonalProps> = ({
  data,
  onChange,
  onNext
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName.trim()) {
      newErrors.firstName = 'Ismingizni kiriting';
    }
    if (!data.lastName.trim()) {
      newErrors.lastName = 'Familiyangizni kiriting';
    }
    if (!data.birthYear) {
      newErrors.birthYear = "Tug'ilgan yilingizni tanlang";
    }
    if (!data.phone.trim() && !data.telegramUsername.trim()) {
      newErrors.contact = "Kamida telefon raqam yoki Telegram username kiritilishi shart";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      playStepChange();
      onNext();
    }
  };

  const currentYear = 2026;
  const years = Array.from({ length: 22 }, (_, i) => String(currentYear - 16 - i));

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>1-Bosqich · Shaxsiy Ma'lumotlar</span>
        </div>
        <h2 className="mt-1 font-['Outfit'] text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          O'zingiz haqingizda ma'lumot bering
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Referat va loyiha topshiriqlarida titul varaqasini to'g'ri shakllantirish uchun zarur.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ism */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Ismingiz <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Masalan: Sardor"
              value={data.firstName}
              onChange={(e) => {
                onChange({ firstName: e.target.value });
                if (errors.firstName) setErrors({ ...errors, firstName: '' });
              }}
              className={`w-full min-h-[44px] rounded-xl border bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:outline-none ${
                errors.firstName
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50'
              }`}
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.firstName}</p>
          )}
        </div>

        {/* Familiya */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Familiyangiz <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Masalan: Karimov"
              value={data.lastName}
              onChange={(e) => {
                onChange({ lastName: e.target.value });
                if (errors.lastName) setErrors({ ...errors, lastName: '' });
              }}
              className={`w-full min-h-[44px] rounded-xl border bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:outline-none ${
                errors.lastName
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50'
              }`}
            />
          </div>
          {errors.lastName && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.lastName}</p>
          )}
        </div>

        {/* Tug'ilgan yili */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Tug'ilgan yilingiz <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Calendar className="h-4 w-4" />
            </div>
            <select
              value={data.birthYear}
              onChange={(e) => {
                playTap();
                onChange({ birthYear: e.target.value });
                if (errors.birthYear) setErrors({ ...errors, birthYear: '' });
              }}
              className={`w-full min-h-[44px] appearance-none rounded-xl border bg-white/80 dark:bg-slate-900/60 pl-10 pr-8 text-sm text-slate-900 dark:text-white transition-all backdrop-blur-md focus:outline-none ${
                errors.birthYear
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50'
              }`}
            >
              <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">
                Yilni tanlang
              </option>
              {years.map((y) => (
                <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {y}-yil
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              ▾
            </div>
          </div>
          {errors.birthYear && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.birthYear}</p>
          )}
        </div>

        {/* O'quv yili (Kursi) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            O'quv kursi / bosqichi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <GraduationCap className="h-4 w-4" />
            </div>
            <select
              value={data.studyYear}
              onChange={(e) => {
                playTap();
                onChange({ studyYear: e.target.value as StudyYear });
              }}
              className="w-full min-h-[44px] appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 pl-10 pr-8 text-sm text-slate-900 dark:text-white transition-all backdrop-blur-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            >
              {STUDY_YEARS.map((course) => (
                <option key={course} value={course} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {course}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              ▾
            </div>
          </div>
        </div>

        {/* Aloqa: Telefon raqam */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Telefon raqam
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Phone className="h-4 w-4" />
            </div>
            <input
              type="tel"
              placeholder="+998 (90) 123-45-67"
              value={data.phone}
              onChange={(e) => {
                onChange({ phone: e.target.value });
                if (errors.contact) setErrors({ ...errors, contact: '' });
              }}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        {/* Telegram Username */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Telegram username
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Send className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <input
              type="text"
              placeholder="@username"
              value={data.telegramUsername}
              onChange={(e) => {
                let val = e.target.value;
                if (val && !val.startsWith('@')) val = '@' + val;
                onChange({ telegramUsername: val });
                if (errors.contact) setErrors({ ...errors, contact: '' });
              }}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {errors.contact && (
        <div className="p-3 rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
          <span>⚠️ {errors.contact}</span>
        </div>
      )}

      {/* Action CTA */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={validateAndProceed}
          className="group flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 font-semibold text-sm text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <span>Keyingi: Universitet ma'lumotlari</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
