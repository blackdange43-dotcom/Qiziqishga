/**
 * Telegram WebApp (TWA) integratsiya utility
 */

export interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramWebApp {
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  initDataUnsafe?: {
    user?: TelegramUser;
    start_param?: string;
  };
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const ADMIN_TELEGRAM_USERNAME = 'Hack_the_wor1d';

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

export function initTelegramApp(): void {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready?.();
      tg.expand?.();
      tg.setHeaderColor?.('#030712');
      tg.setBackgroundColor?.('#030712');
    } catch {
      // Ignore
    }
  }
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning'): void {
  const tg = getTelegramWebApp();
  if (!tg?.HapticFeedback) return;

  try {
    if (type === 'success' || type === 'error' || type === 'warning') {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  } catch {
    // Ignore
  }
}

export function generateAdminTelegramUrl(orderData: {
  orderNumber: string;
  fullName: string;
  phone: string;
  university: string;
  topic: string;
  workType: string;
  tariffName: string;
  price: string;
}): string {
  const message = [
    `🎓 *YANGI TALABA ZAYAVKASI* (#${orderData.orderNumber})`,
    ``,
    `👤 *Talaba:* ${orderData.fullName}`,
    `📱 *Aloqa:* ${orderData.phone}`,
    `🏛 *Universitet:* ${orderData.university}`,
    `📑 *Ish turi:* ${orderData.workType}`,
    `💡 *Mavzu:* ${orderData.topic}`,
    `⚡ *Tanlangan tarif:* ${orderData.tariffName} (${orderData.price})`,
    ``,
    `Assalomu alaykum @Hack_the_wor1d! Men referat/loyiha bo'yicha zayavka topshirdim. To'lov va buyurtmani qabul qilish tafsilotlarini kelishib olmoqchiman.`
  ].join('\n');

  return `https://t.me/${ADMIN_TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}
