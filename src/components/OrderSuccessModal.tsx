import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  FileCheck, 
  ShieldCheck, 
  X,
  CreditCard
} from 'lucide-react';
import { Order } from '../types';
import { ADMIN_TELEGRAM_USERNAME, generateAdminTelegramUrl, triggerHaptic } from '../utils/telegram';
import { playTap } from '../utils/audio';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onNewOrder
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const adminTelegramUrl = generateAdminTelegramUrl({
    orderNumber: order.orderNumber,
    fullName: `${order.personal.firstName} ${order.personal.lastName}`,
    phone: order.personal.phone || order.personal.telegramUsername || "Ko'rsatilmagan",
    university: order.academic.universityName,
    topic: order.details.topic,
    workType: order.details.workType,
    tariffName: order.tariff.name,
    price: order.tariff.priceFormatted
  });

  const copyReceipt = () => {
    playTap();
    triggerHaptic('light');
    const textToCopy = `🎓 ZAYAVKA #${order.orderNumber}\n` +
      `👤 Talaba: ${order.personal.firstName} ${order.personal.lastName}\n` +
      `🏛 Universitet: ${order.academic.universityName}\n` +
      `📚 Fan: ${order.academic.subjectName}\n` +
      `💡 Mavzu: ${order.details.topic}\n` +
      `⚡ Tarif: ${order.tariff.name} (${order.tariff.priceFormatted})\n` +
      `👨‍💻 Admin: @${ADMIN_TELEGRAM_USERNAME}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto overflow-hidden rounded-3xl border border-cyan-500/30 bg-white/95 dark:bg-slate-900/95 p-6 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
        {/* Glow ambient spots */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={() => {
            playTap();
            onClose();
          }}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Success Header Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/30">
          <CheckCircle2 className="h-9 w-9 text-slate-950 stroke-[2.5]" />
        </div>

        {/* Main Status Text */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zayavka Muvaffaqiyatli Qabul Qilindi!</span>
          </div>

          <h3 className="mt-2 font-['Outfit'] text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Referat yoki loyihangiz tayyorlanmoqda!
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Buyurtma navbatga qo'yildi. To'lov masalasida va ishni tezroq qabul qilib olish uchun adminga murojaat qiling:
          </p>

          {/* Glowing Admin Telegram Tag */}
          <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/50 bg-gradient-to-r from-cyan-50 dark:from-cyan-950/80 to-slate-100 dark:to-slate-900 px-5 py-2.5 shadow-md shadow-cyan-500/10 dark:shadow-cyan-500/20">
            <Send className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-mono text-base font-bold text-cyan-700 dark:text-cyan-300">
              @{ADMIN_TELEGRAM_USERNAME}
            </span>
          </div>
        </div>

        {/* Primary CTA: Directly open Admin Telegram */}
        <div className="mt-5">
          <a
            href={adminTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              playTap();
              triggerHaptic('heavy');
            }}
            className="group flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <span className="flex h-full w-full items-center justify-center gap-2 rounded-[14px] bg-slate-950/20 px-4 text-sm font-bold text-white tracking-wide">
              <Send className="h-4 w-4 text-cyan-200 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span>Adminga Telegramda Yozish (@{ADMIN_TELEGRAM_USERNAME})</span>
              <ExternalLink className="h-3.5 w-3.5 text-cyan-200" />
            </span>
          </a>
        </div>

        {/* Order Receipt Card */}
        <div className="mt-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-950/60 p-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-2 mb-2.5">
            <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
              ID: #{order.orderNumber}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {new Date(order.createdAt).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Talaba:</span>
              <span className="font-medium text-slate-900 dark:text-white">{order.personal.firstName} {order.personal.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Universitet:</span>
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{order.academic.universityName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Mavzu:</span>
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{order.details.topic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Tarif paketi:</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-300">{order.tariff.name}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/80 dark:border-white/10 pt-2 font-semibold">
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                To'lov summasi:
              </span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{order.tariff.priceFormatted}</span>
            </div>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={copyReceipt}
            className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Nusxa olindi!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-400" />
                <span>Chekni nusxalash</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playTap();
              onNewOrder();
            }}
            className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <FileCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span>Yangi zayavka</span>
          </button>
        </div>

        {/* Safety & Guarantee Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>Kafolatlangan sifat va konfidensiallik</span>
        </div>
      </div>
    </div>
  );
};
