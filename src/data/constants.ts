import { TariffPlan, WorkType, StudyYear } from '../types';

export const TARIFF_PLANS: TariffPlan[] = [
  {
    id: 'normal',
    name: 'Normal Referat yasash',
    badge: 'Standart',
    price: 12000,
    priceFormatted: "12 000 so'm",
    description: 'Kundalik topshiriqlar va referatlar uchun tejamkor va ishonchli paket.',
    deliveryTime: '12-24 soat ichida',
    features: [
      'Standart Word (.docx) va PDF format',
      '10-15 bet gacha hajmdagi material',
      'Mundarija va foydalanilgan adabiyotlar',
      'Asosiy mavzu to\'liq yoritilishi',
      'Asosiy shrift va GOST qoidalari'
    ],
    accentColor: 'from-blue-500 to-cyan-500',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.15)'
  },
  {
    id: 'medium',
    name: 'Medium',
    badge: 'Ommabop',
    price: 20000,
    priceFormatted: "20 000 so'm",
    description: 'Chiroyli dizayn, sarlavha varaqasi va yuqori anti-plagiat ko\'rsatkichi.',
    deliveryTime: '6-12 soat ichida',
    popular: true,
    features: [
      'Barcha Normal imkoniyatlari',
      'Anti-plagiat tekshiruvi (75%+ originallik)',
      'Zamonaviy titul varaqasi (Universitet logosi bilan)',
      '15-20 bet gacha chuqur tahliliy matn',
      'Jadvallar va grafik illyustratsiyalar'
    ],
    accentColor: 'from-cyan-400 to-emerald-400',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.2)'
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Professional',
    price: 25000,
    priceFormatted: "25 000 so'm",
    description: 'Universitet va o\'qituvchilar talabiga to\'liq javob beruvchi professional daraja.',
    deliveryTime: '3-6 soat ichida',
    features: [
      'Barcha Medium imkoniyatlari',
      'Anti-plagiat 85%+ va to\'liq hisobot',
      'GOST 7.32 qat\'iy standartlariga moslik',
      'Ilmiy annotatsiya va xulosa qismi',
      'Sovg\'aga 5-7 slaydlik PowerPoint taqdimot',
      '1 martalik bepul tuzatish/tahrir'
    ],
    accentColor: 'from-purple-500 to-indigo-500',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.2)'
  },
  {
    id: 'ultra',
    name: 'Ultra',
    badge: 'VIP / Tezkor',
    price: 32000,
    priceFormatted: "32 000 so'm",
    description: 'Eng yuqori VIP xizmat: super tezkor tayyorlash, taqdimot va himoya nutqi.',
    deliveryTime: '1-2 soatda tezkor!',
    features: [
      'Barcha Pro imkoniyatlari',
      '1-2 soat ichida ultra tezkor topshirish',
      'Anti-plagiat 95%+ eng yuqori daraja',
      'Professional 10-15 slaydlik premium taqdimot',
      'O\'qituvchi oldida himoya qilish uchun nutq matni (Spich)',
      'Cheksiz va bepul qayta tahrirlash kafolati',
      'Shaxsiy admin yordamchisi bilan 24/7 aloqa'
    ],
    accentColor: 'from-amber-400 to-rose-500',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.2)'
  }
];

export const WORK_TYPES: { id: WorkType; label: string; icon: string; desc: string }[] = [
  { id: 'referat', label: 'Referat', icon: 'FileText', desc: 'Mavzu bo\'yicha tahliliy referat' },
  { id: 'kurs_ishi', label: 'Kurs ishi', icon: 'BookOpen', desc: 'Nazariy va amaliy boblar bilan' },
  { id: 'taqdimot', label: 'Taqdimot (Slide)', icon: 'Presentation', desc: 'PowerPoint slaydlar to\'plami' },
  { id: 'mustaqil_ish', label: 'Mustaqil ish', icon: 'Edit3', desc: 'Amaliy savollar va javoblar' },
  { id: 'maqola', label: 'Ilmiy Maqola', icon: 'Award', desc: 'Konferensiya va jurnallar uchun' },
  { id: 'diplom_ishi', label: 'BMI / Diplom ishi', icon: 'GraduationCap', desc: 'To\'liq bitiruv malakaviy ishi' }
];

export const STUDY_YEARS: StudyYear[] = [
  '1-kurs',
  '2-kurs',
  '3-kurs',
  '4-kurs',
  'Magistratura 1-kurs',
  'Magistratura 2-kurs',
  'Kollej / Litsey'
];

export const POPULAR_UNIVERSITIES = [
  'O\'zbekiston Milliy Universiteti (O\'zMU)',
  'Toshkent Axborot Texnologiyalari Universiteti (TATU)',
  'Toshkent Davlat Iqtisodiyot Universiteti (TDIU)',
  'Toshkent Davlat Texnika Universiteti (TDTU)',
  'Samarqand Davlat Universiteti (SamDU)',
  'Toshkent Davlat Sharqshunoslik Universiteti (TDShU)',
  'Toshkent Tibbiyot Akademiyasi (TTA)',
  'Jahon Iqtisodiyoti va Diplomatiya Universiteti (JIDU)',
  'Inha Universiteti Toshkent',
  'Turin Politexnika Universiteti'
];

export const COMMON_SUBJECTS = [
  'Axborot texnologiyalari va dasturlash',
  'Falsafa va mantiq',
  'Iqtisodiyot nazariyasi',
  'Huquqshunoslik va davlat asoslari',
  'Oliy matematika va ehtimollar nazariyasi',
  'Pedagogika va psixologiya',
  'Buxgalteriya hisobi va audit',
  'Tibbiyot va biofizika',
  'Chet tili (Ingliz tili)',
  'Fizika va elektrotexnika'
];
