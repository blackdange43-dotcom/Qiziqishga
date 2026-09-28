export type WorkType = 
  | 'referat' 
  | 'kurs_ishi' 
  | 'taqdimot' 
  | 'mustaqil_ish' 
  | 'maqola' 
  | 'diplom_ishi';

export type StudyYear = 
  | '1-kurs' 
  | '2-kurs' 
  | '3-kurs' 
  | '4-kurs' 
  | 'Magistratura 1-kurs' 
  | 'Magistratura 2-kurs' 
  | 'Kollej / Litsey';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthYear: string;
  studyYear: StudyYear;
  phone: string;
  telegramUsername: string;
}

export interface AcademicInfo {
  subjectName: string;
  teacherName: string;
  universityName: string;
  faculty: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
  uploadedAt: string;
}

export interface ProjectDetails {
  workType: WorkType;
  topic: string;
  pageCount: string;
  deadline: string;
  additionalNotes: string;
  files: UploadedFileItem[];
}

export type TariffId = 'normal' | 'medium' | 'pro' | 'ultra';

export interface TariffPlan {
  id: TariffId;
  name: string;
  badge: string;
  price: number;
  priceFormatted: string;
  description: string;
  features: string[];
  deliveryTime: string;
  popular?: boolean;
  accentColor: string;
  borderColor: string;
  glowColor: string;
}

export type OrderStatus = 'yangi' | 'jarayonda' | 'tayyor' | 'tolov_kutilmoqda';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  personal: PersonalInfo;
  academic: AcademicInfo;
  details: ProjectDetails;
  tariff: TariffPlan;
  status: OrderStatus;
  totalPrice: number;
}

export interface SecurityViolation {
  fileName: string;
  extension: string;
  detectedAt: string;
  reason: string;
}
