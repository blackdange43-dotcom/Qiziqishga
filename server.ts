import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent storage for orders
interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  personal: Record<string, unknown>;
  academic: Record<string, unknown>;
  details: {
    workType: string;
    topic: string;
    pageCount?: string;
    deadline?: string;
    additionalNotes?: string;
    files?: Array<{ name: string; size: number; extension: string }>;
  };
  tariff: {
    id: string;
    name: string;
    price: number;
    priceFormatted: string;
  };
  status: 'yangi' | 'jarayonda' | 'tayyor' | 'tolov_kutilmoqda';
  totalPrice: number;
}

const ordersDb: OrderRecord[] = [
  {
    id: 'demo-1',
    orderNumber: 'REF-2026-8941',
    createdAt: new Date().toISOString(),
    personal: {
      firstName: 'Bekzod',
      lastName: 'Rustamov',
      birthYear: '2003',
      studyYear: '3-kurs',
      phone: '+998 (97) 777-12-34',
      telegramUsername: '@bekzod_r'
    },
    academic: {
      subjectName: "Sun'iy intellekt va neyron tarmoqlar",
      teacherName: 'dots. Qosimov M.A.',
      universityName: 'Toshkent Axborot Texnologiyalari Universiteti',
      faculty: 'Dasturiy injiniring'
    },
    details: {
      workType: 'referat',
      topic: "Generativ sun'iy intellekt modellarining ta'lim sohasiga integratsiyasi va xavflari",
      pageCount: '18 bet',
      deadline: 'Ertaga 14:00 gacha',
      additionalNotes: "GOST 7.32 standarti bo'yicha",
      files: [
        {
          name: 'Talablar_va_reja.docx',
          size: 45200,
          extension: 'DOCX'
        }
      ]
    },
    tariff: {
      id: 'pro',
      name: 'Pro',
      price: 25000,
      priceFormatted: "25 000 so'm"
    },
    status: 'jarayonda',
    totalPrice: 25000
  }
];

// Xavfli formatlar tekshiruvi (Server-side Antivirus Shield)
const DANGEROUS_EXTS = ['apk', 'aab', 'exe', 'bat', 'cmd', 'msi', 'scr', 'vbs', 'sh', 'ps1', 'js', 'jar', 'iso'];

// Xavfsiz Admin Kalitlari
const ADMIN_USERNAME = 'ADMIN';
const ADMIN_PASSWORD = '8756863622:AAFOlVOorTYNU89ocvNWrGUnIVCXYyzSXAU';

// Server-side brute-force himoyasi
interface FailedAttemptRecord {
  count: number;
  lockUntil: number;
}
const loginAttempts = new Map<string, FailedAttemptRecord>();

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    admin: '@Hack_the_wor1d',
    platform: 'StudentBot Pro',
    timestamp: new Date().toISOString()
  });
});

// API: Admin Login & Authentication
app.post('/api/admin/login', (req: Request, res: Response): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = loginAttempts.get(ip) || { count: 0, lockUntil: 0 };

  if (record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
    res.status(429).json({
      error: `Ko'p marta xato urinish! Tizim vaqtincha bloklandi. ${remainingSeconds} soniyadan so'ng qayta urining.`,
      remainingSeconds
    });
    return;
  }

  const { username, password } = req.body;
  const cleanUser = String(username || '').trim().toUpperCase();
  const cleanPass = String(password || '').trim();

  if (cleanUser === ADMIN_USERNAME && cleanPass === ADMIN_PASSWORD) {
    // Reset failed attempts on success
    loginAttempts.delete(ip);
    res.json({
      success: true,
      message: 'Admin autentifikatsiyasi muvaffaqiyatli yakunlandi',
      token: ADMIN_PASSWORD
    });
    return;
  }

  // Record failed attempt
  record.count += 1;
  if (record.count >= 5) {
    record.lockUntil = now + 60 * 1000; // 60 soniya bloklash
  }
  loginAttempts.set(ip, record);

  const attemptsLeft = Math.max(0, 5 - record.count);
  res.status(401).json({
    error: "Login yoki parol noto'g'ri!",
    attemptsLeft: record.count >= 5 ? 0 : attemptsLeft
  });
});

// API: Get all orders
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: ordersDb.length,
    orders: ordersDb
  });
});

// API: Create new order with strict security check
app.post('/api/orders', (req: Request, res: Response): void => {
  const newOrder = req.body;

  if (!newOrder || !newOrder.details || !newOrder.personal) {
    res.status(400).json({ error: "Noto'g'ri zayavka ma'lumotlari" });
    return;
  }

  // Antivirus tekshiruvi: Agar fayllar orasida APK yoki virus bo'lsa darhol rad etish
  if (Array.isArray(newOrder.details.files)) {
    for (const f of newOrder.details.files) {
      const ext = (f.name?.split('.').pop() || '').toLowerCase();
      if (DANGEROUS_EXTS.includes(ext)) {
        res.status(400).json({
          error: "XAVFSIZLIK TO'SIg'I: APK va xavfli skript fayllari qabul qilinmaydi!",
          blockedFile: f.name
        });
        return;
      }
    }
  }

  ordersDb.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: "Zayavka qabul qilindi. Adminga murojaat qiling: @Hack_the_wor1d",
    order: newOrder
  });
});

// API: Update order status
app.patch('/api/orders/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  const found = ordersDb.find((o) => o.id === id);
  if (!found) {
    res.status(404).json({ error: 'Zayavka topilmadi' });
    return;
  }

  found.status = status;
  res.json({ success: true, order: found });
});

// API: Delete order
app.delete('/api/orders/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = ordersDb.findIndex((o) => o.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Zayavka topilmadi' });
    return;
  }

  ordersDb.splice(index, 1);
  res.json({ success: true, message: "Zayavka o'chirildi" });
});

// Vite middleware initialization
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`🚀 StudentBot Pro Server running at http://localhost:${PORT}`);
  });
}

startServer();
