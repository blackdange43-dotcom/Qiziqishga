import React from 'react';
import { AlertTriangle, ShieldAlert, XCircle, FileWarning, ArrowLeft } from 'lucide-react';
import { ThreatScanResult } from '../utils/securityScanner';
import { playTap } from '../utils/audio';

interface VirusAlertModalProps {
  threat: ThreatScanResult | null;
  onClose: () => void;
}

export const VirusAlertModal: React.FC<VirusAlertModalProps> = ({
  threat,
  onClose
}) => {
  if (!threat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-rose-500/80 bg-white/95 dark:bg-slate-900/95 p-6 shadow-2xl shadow-rose-950/50 text-center animate-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
        {/* Glow backdrop pulse */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-rose-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-rose-600/25 blur-3xl" />

        {/* Shield Alert Icon with animation */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-500 dark:text-rose-400 ring-8 ring-rose-500/10">
          <ShieldAlert className="h-9 w-9 animate-pulse text-rose-500 dark:text-rose-400" />
        </div>

        {/* Title */}
        <h3 className="mt-4 font-['Outfit'] text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          <span>Fayl Qabul Qilinmadi!</span>
        </h3>

        {/* Reason */}
        <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 p-3 text-left">
          <div className="flex items-start gap-2.5">
            <XCircle className="h-5 w-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-200">
                {threat.threatMessage || "Xavfli yoki zararli fayl formati aniqlandi!"}
              </p>
              <p className="mt-1 text-[11px] text-rose-600/90 dark:text-rose-300/80">
                {threat.technicalDetails}
              </p>
            </div>
          </div>
        </div>

        {/* Blocked File Info */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-100 dark:bg-white/5 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 truncate text-slate-700 dark:text-slate-300">
            <FileWarning className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
            <span className="truncate max-w-[200px] font-mono text-[11px]">{threat.fileName}</span>
          </div>
          <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-600 dark:text-rose-300">
            RAD ETILDI
          </span>
        </div>

        {/* Allowed formats hint */}
        <div className="mt-4 text-left text-xs text-slate-500 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">Ruxsat etilgan xavfsiz formatlar:</p>
          <p className="mt-1 font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
            .pdf, .docx, .doc, .pptx, .ppt, .txt, .zip, .rar, .jpg, .png
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playTap();
            onClose();
          }}
          className="mt-6 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 font-semibold text-xs text-white shadow-lg shadow-rose-950/50 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Tushundim, xavfsiz fayl yuklayman</span>
        </button>
      </div>
    </div>
  );
};
