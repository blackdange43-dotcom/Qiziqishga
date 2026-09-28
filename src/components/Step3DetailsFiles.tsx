import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FolderPlus, 
  File, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Layers
} from 'lucide-react';
import { ProjectDetails, UploadedFileItem } from '../types';
import { WORK_TYPES } from '../data/constants';
import { scanFileForThreats, formatFileSize, ThreatScanResult } from '../utils/securityScanner';
import { playTap, playStepChange, playVirusAlert } from '../utils/audio';
import { triggerHaptic } from '../utils/telegram';
import { VirusAlertModal } from './VirusAlertModal';

interface Step3DetailsFilesProps {
  data: ProjectDetails;
  onChange: (data: Partial<ProjectDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3DetailsFiles: React.FC<Step3DetailsFilesProps> = ({
  data,
  onChange,
  onNext,
  onBack
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeThreat, setActiveThreat] = useState<ThreatScanResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadedFileItem[] = [...data.files];
    let foundThreat: ThreatScanResult | null = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const scan = scanFileForThreats(file);

      // KUCHLI XAVFSIZLIK: APK yoki virusga moyil fayl aniqlansa darhol to'xtatish!
      if (!scan.isSafe) {
        foundThreat = scan;
        playVirusAlert();
        triggerHaptic('error');
        break;
      }

      // Xavfsiz bo'lsa ro'yxatga qo'shish
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase();
      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        extension: ext,
        uploadedAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      });
    }

    if (foundThreat) {
      setActiveThreat(foundThreat);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (folderInputRef.current) folderInputRef.current.value = '';
      return;
    }

    playTap();
    triggerHaptic('light');
    onChange({ files: newFiles });

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    playTap();
    onChange({ files: data.files.filter((f) => f.id !== id) });
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};

    if (!data.topic.trim()) {
      newErrors.topic = 'Referat yoki loyiha mavzusini kiriting';
    } else if (data.topic.trim().length < 4) {
      newErrors.topic = "Mavzu to'liqroq yozilishi kerak (kamida 4 ta belgi)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      playStepChange();
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Virus & Malware Threat Modal */}
      <VirusAlertModal
        threat={activeThreat}
        onClose={() => setActiveThreat(null)}
      />

      {/* Step Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>3-Bosqich · Ish Turi, Mavzu va Materiallar</span>
        </div>
        <h2 className="mt-1 font-['Outfit'] text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Loyiha mavzusi va fayllarni yuklang
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Mavzuni kiritib, agar qo'lingizda reja, metodichka yoki namunaviy fayllar bo'lsa biriktiring.
        </p>
      </div>

      {/* Ish turi tanlash (Grid) */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Ish turi <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {WORK_TYPES.map((type) => {
            const isSelected = data.workType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  playTap();
                  onChange({ workType: type.id });
                }}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/40 text-slate-900 dark:text-white shadow-md shadow-cyan-500/10'
                    : 'border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">{type.label}</span>
                  {isSelected && <CheckCircle className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />}
                </div>
                <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {type.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mavzu kiritish */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Referat / Loyiha mavzusi <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Mavzuning aniq nomi</span>
        </div>
        <div className="relative">
          <textarea
            rows={2}
            placeholder="Masalan: Raqamli iqtisodiyotda bulutli hisoblash texnologiyalari va kiberxavfsizlik tahdidlari tahlili"
            value={data.topic}
            onChange={(e) => {
              onChange({ topic: e.target.value });
              if (errors.topic) setErrors({ ...errors, topic: '' });
            }}
            className={`w-full rounded-xl border bg-white/80 dark:bg-slate-900/60 p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:outline-none ${
              errors.topic
                ? 'border-rose-500 ring-1 ring-rose-500'
                : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50'
            }`}
          />
        </div>
        {errors.topic && (
          <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.topic}</p>
        )}
      </div>

      {/* Qo'shimcha parametrlar: Betlar soni & Muddat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Taxminiy betlar soni (Ixtiyoriy)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Layers className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Masalan: 15-20 bet"
              value={data.pageCount}
              onChange={(e) => onChange({ pageCount: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Topshirish muddati (Dedlayn)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Clock className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Masalan: Ertaga soat 18:00 gacha"
              value={data.deadline}
              onChange={(e) => onChange({ deadline: e.target.value })}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Fayl va Papka yuklash zonasi */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Fayl yoki materiallar yuklash (Papka / Hujjatlar)
          </label>
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Antivirus Himoyalangan
          </span>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 ring-4 ring-cyan-500/20'
              : 'border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-900/30 hover:border-cyan-500/50 hover:bg-slate-100/50 dark:hover:bg-slate-900/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          {/* Folder upload input */}
          <input
            ref={folderInputRef}
            type="file"
            {...{ webkitdirectory: '', directory: '' }}
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <UploadCloud className="h-6 w-6" />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            Materiallarni bu yerga tashlang yoki tanlang
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Reja, metodichka, adabiyotlar yoki namunaviy fayllar (PDF, Word, PPTX, ZIP)
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                playTap();
                fileInputRef.current?.click();
              }}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 px-3.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-all"
            >
              <File className="h-3.5 w-3.5" />
              <span>Fayllarni tanlash</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playTap();
                folderInputRef.current?.click();
              }}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Butun papkani yuklash</span>
            </button>
          </div>

          {/* Xavfsizlik eslatmasi */}
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-200/60 dark:bg-slate-950/60 px-3 py-1 text-[11px] text-slate-600 dark:text-slate-400 border border-slate-300/40 dark:border-white/5">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span>Diqqat: APK, EXE va shubhali skriptlar darhol rad etiladi.</span>
          </div>
        </div>

        {/* Yuklangan fayllar ro'yxati */}
        {data.files.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Yuklangan materiallar ({data.files.length}):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-2.5 backdrop-blur-md transition-all hover:border-cyan-500/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono text-[10px] font-bold">
                      {file.extension || 'DOC'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {formatFileSize(file.size)} · {file.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    title="Faylni o'chirish"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Qo'shimcha eslatma */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Qo'shimcha talab yoki o'qituvchi eslatmasi (Ixtiyoriy)
        </label>
        <textarea
          rows={2}
          placeholder="Masalan: Mundarija 3 ta bobdan iborat bo'lsin, 2024-2025 yillardagi adabiyotlar qo'shilsin..."
          value={data.additionalNotes}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
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
          <span>Keyingi: Tariflar (4 ta paket)</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
