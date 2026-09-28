import React, { useState } from 'react';
import { School, BookOpen, UserCheck, Layers, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { AcademicInfo } from '../types';
import { POPULAR_UNIVERSITIES, COMMON_SUBJECTS } from '../data/constants';
import { playTap, playStepChange } from '../utils/audio';

interface Step2AcademicProps {
  data: AcademicInfo;
  onChange: (data: Partial<AcademicInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Academic: React.FC<Step2AcademicProps> = ({
  data,
  onChange,
  onNext,
  onBack
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    if (!data.subjectName.trim()) {
      newErrors.subjectName = 'Fan nomini kiriting';
    }
    if (!data.teacherName.trim()) {
      newErrors.teacherName = "O'qituvchi yoki ilmiy rahbar ismini kiriting";
    }
    if (!data.universityName.trim()) {
      newErrors.universityName = 'Universitet yoki institut nomini kiriting';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      playStepChange();
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>2-Bosqich · Akademik Ma'lumotlar</span>
        </div>
        <h2 className="mt-1 font-['Outfit'] text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Ta'lim muassasasi va fan tafsilotlari
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ushbu ma'lumotlar rasmiy titul varaqasi va GOST standarti talablari bo'yicha kiritiladi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Fan Nomi */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Fan nomi <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Mavzuga tegishli fan</span>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <BookOpen className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Masalan: Axborot xavfsizligi, Falsafa, Iqtisodiyot..."
              value={data.subjectName}
              onChange={(e) => {
                onChange({ subjectName: e.target.value });
                if (errors.subjectName) setErrors({ ...errors, subjectName: '' });
              }}
              className={`w-full min-h-[44px] rounded-xl border bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:outline-none ${
                errors.subjectName
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50'
              }`}
            />
          </div>
          {errors.subjectName && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.subjectName}</p>
          )}

          {/* Tezkor tavsiyalar */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Tezkor tanlash:</span>
            {COMMON_SUBJECTS.slice(0, 4).map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  playTap();
                  onChange({ subjectName: sub });
                  if (errors.subjectName) setErrors({ ...errors, subjectName: '' });
                }}
                className="text-[11px] rounded-md border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 px-2 py-0.5 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* O'qituvchi / Rahbar ismi */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            O'qituvchi / Ilmiy rahbar F.I.Sh <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <UserCheck className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Masalan: dots. Alimov B.Sh. yoki prof. Yusupov N."
              value={data.teacherName}
              onChange={(e) => {
                onChange({ teacherName: e.target.value });
                if (errors.teacherName) setErrors({ ...errors, teacherName: '' });
              }}
              className={`w-full min-h-[44px] rounded-xl border bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:outline-none ${
                errors.teacherName
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50'
              }`}
            />
          </div>
          {errors.teacherName && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.teacherName}</p>
          )}
        </div>

        {/* Universitet / Institut Nomi */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Universitet / Institut nomi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <School className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Masalan: Toshkent Axborot Texnologiyalari Universiteti"
              value={data.universityName}
              onChange={(e) => {
                onChange({ universityName: e.target.value });
                if (errors.universityName) setErrors({ ...errors, universityName: '' });
              }}
              className={`w-full min-h-[44px] rounded-xl border bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:outline-none ${
                errors.universityName
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50'
              }`}
            />
          </div>
          {errors.universityName && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.universityName}</p>
          )}

          {/* O'zbekiston mashhur OTMlaridan tanlash */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500">OTMlar:</span>
            {POPULAR_UNIVERSITIES.slice(0, 3).map((uni) => (
              <button
                key={uni}
                type="button"
                onClick={() => {
                  playTap();
                  onChange({ universityName: uni });
                  if (errors.universityName) setErrors({ ...errors, universityName: '' });
                }}
                className="text-[11px] rounded-md border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 px-2 py-0.5 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
              >
                {uni.split('(')[1]?.replace(')', '') || uni.substring(0, 15)}
              </button>
            ))}
          </div>
        </div>

        {/* Fakultet / Yo'nalish */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Fakultet va Ta'lim yo'nalishi (Ixtiyoriy)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Layers className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Masalan: Kiberxavfsizlik fakulteti, 310-guruh"
              value={data.faculty}
              onChange={(e) => onChange({ faculty: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
          <span>Orqaga</span>
        </button>

        <button
          type="button"
          onClick={validateAndProceed}
          className="group flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 font-semibold text-sm text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <span>Keyingi: Mavzu & Fayl</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
