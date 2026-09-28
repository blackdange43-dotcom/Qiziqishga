import React from 'react';
import { User, School, FileText, CheckCircle2 } from 'lucide-react';
import { playTap } from '../utils/audio';

interface StepProgressBarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  completedSteps: number[];
}

const STEPS = [
  { step: 1, title: 'Shaxsiy', sub: "Ism va ma'lumot", icon: User },
  { step: 2, title: 'Universitet', sub: "Fan va o'qituvchi", icon: School },
  { step: 3, title: 'Mavzu & Fayl', sub: 'Referat tafsiloti', icon: FileText },
  { step: 4, title: 'Tariflar', sub: '4 ta paket', icon: CheckCircle2 }
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
  completedSteps
}) => {
  return (
    <div className="w-full py-4">
      {/* Visual step cards */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {STEPS.map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isCompleted = completedSteps.includes(item.step);
          const isAccessible = item.step <= currentStep || isCompleted;

          return (
            <button
              key={item.step}
              type="button"
              disabled={!isAccessible}
              onClick={() => {
                if (isAccessible) {
                  playTap();
                  onSelectStep(item.step);
                }
              }}
              className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all text-left ${
                isActive
                  ? 'border-cyan-500/50 bg-gradient-to-b from-cyan-50/80 to-cyan-100/40 dark:from-cyan-950/40 dark:to-slate-900/80 shadow-md shadow-cyan-500/10'
                  : isCompleted
                  ? 'border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 hover:border-emerald-500/50 cursor-pointer'
                  : 'border-slate-200/60 dark:border-white/5 bg-slate-100/40 dark:bg-slate-900/30 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Step indicator top */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : item.step}
                </span>
                <span
                  className={`hidden sm:inline text-[11px] font-semibold tracking-wider uppercase ${
                    isActive ? 'text-cyan-600 dark:text-cyan-400' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  Qadam {item.step}
                </span>
              </div>

              {/* Title and Icon */}
              <div className="flex items-center gap-1.5 w-full justify-center sm:justify-start">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400'
                      : isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span
                  className={`text-xs font-semibold truncate ${
                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.title}
                </span>
              </div>

              {/* Bottom active line */}
              {isActive && (
                <div className="absolute -bottom-px left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile progress line */}
      <div className="mt-3 h-1 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>
    </div>
  );
};
