/**
 * Xavfsizlik va Antivirus Skaneri
 * APK, Executable, Skript va virusga moyil fayllarni aniqlab, darhol bloklaydi.
 */

export interface ThreatScanResult {
  isSafe: boolean;
  threatType?: 'MALICIOUS_EXECUTABLE' | 'SUSPICIOUS_PACKAGE' | 'DANGEROUS_SCRIPT' | 'OVERSIZED';
  fileName: string;
  extension: string;
  threatMessage?: string;
  technicalDetails?: string;
}

// Barcha xavfli va virus tarqatuvchi formatlar ro'yxati
export const BLOCKED_EXTENSIONS = [
  'apk',    // Android paket (foydalanuvchi alohida ta'kidlagan)
  'aab',    // Android App Bundle
  'exe',    // Windows executable
  'bat',    // Batch skript
  'cmd',    // Command script
  'msi',    // Windows installer
  'scr',    // Screensaver virus
  'vbs',    // VBScript
  'vbe',    // VBScript Encoded
  'js',     // JavaScript executable
  'jse',    // JScript Encoded
  'wsf',    // Windows Script File
  'wsh',    // Windows Scripting Host
  'ps1',    // PowerShell script
  'sh',     // Bash script
  'bash',   // Linux script
  'bin',    // Binary payload
  'jar',    // Java executable
  'com',    // MS-DOS executable
  'pif',    // Program Information File
  'reg',    // Windows Registry file
  'hta',    // HTML Application
  'cpl',    // Control Panel Item
  'inf',    // Setup Information
  'iso',    // Disk Image
  'dmg',    // Mac Disk Image
  'dll',    // Dynamic Link Library
  'sys',    // System driver
  'drv',    // Driver file
  'lnk',    // Shortcut vulnerability
];

// Qabul qilinadigan ta'lim va referat formatlari
export const ALLOWED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'txt',
  'rtf',
  'odt',
  'odp',
  'xls',
  'xlsx',
  'zip',
  'rar',
  '7z',
  'tar',
  'gz',
  'jpg',
  'jpeg',
  'png',
  'webp',
  'csv'
];

/**
 * Fayl xavfsizligini skanerlash funksiyasi
 */
export function scanFileForThreats(file: File): ThreatScanResult {
  const fileName = file.name.trim();
  const lowerName = fileName.toLowerCase();
  
  // 1. Kengaytmani ajratish
  const lastDotIndex = lowerName.lastIndexOf('.');
  const ext = lastDotIndex !== -1 ? lowerName.substring(lastDotIndex + 1) : '';

  // 2. Double extension (masalan: referat.docx.apk yoki kitob.pdf.exe) tekshiruvi
  const parts = lowerName.split('.');
  const hasMultipleExtensions = parts.length > 2;

  // Har qanday qismida xavfli kengaytma bormi tekshiramiz
  for (const part of parts.slice(1)) {
    if (BLOCKED_EXTENSIONS.includes(part)) {
      return {
        isSafe: false,
        threatType: part === 'apk' || part === 'aab' ? 'SUSPICIOUS_PACKAGE' : 'MALICIOUS_EXECUTABLE',
        fileName,
        extension: part.toUpperCase(),
        threatMessage: `❌ Xavfli fayl aniqlandi: .${part.toUpperCase()} formati tizim xavfsizligi qoidalariga ko'ra bloklandi!`,
        technicalDetails: `Fayl nomi: "${fileName}". APK va barcha ijro etiluvchi (executable/script) fayllar platformaga yuklanishi qat'iyan man etiladi.`
      };
    }
  }

  // 3. To'g'ridan-to'g'ri bloklanganlar ro'yxatidan tekshirish
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    const isApk = ext === 'apk' || ext === 'aab';
    return {
      isSafe: false,
      threatType: isApk ? 'SUSPICIOUS_PACKAGE' : 'MALICIOUS_EXECUTABLE',
      fileName,
      extension: ext.toUpperCase(),
      threatMessage: isApk 
        ? `🚫 APK fayl yuklash rad etildi! Mobil ilova fayllari referat tizimi uchun xavfli hisoblanadi.`
        : `⚠️ Shubhali virus/skript fayli (.${ext.toUpperCase()}) bloklandi!`,
      technicalDetails: `Xavfsizlik protokoli: Talabalar faqat hujjat (.doc, .docx, .pdf, .ppt, .txt, .zip) yuborishlari mumkin.`
    };
  }

  // 4. Ruxsat berilganlar ro'yxatida bormi?
  if (ext && !ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      isSafe: false,
      threatType: 'DANGEROUS_SCRIPT',
      fileName,
      extension: ext.toUpperCase(),
      threatMessage: `⚠️ Noma'lum yoki qo'llab-quvvatlanmaydigan format: .${ext.toUpperCase()}`,
      technicalDetails: `Faqat Word (.doc, .docx), PDF, PowerPoint (.ppt, .pptx), rasm yoki arxiv (.zip, .rar) fayllari qabul qilinadi.`
    };
  }

  // 5. Hajm tekshiruvi (Maksimal 60MB)
  const MAX_SIZE = 60 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return {
      isSafe: false,
      threatType: 'OVERSIZED',
      fileName,
      extension: ext.toUpperCase(),
      threatMessage: `Fayl hajmi juda katta (maksimal 60 MB)`,
      technicalDetails: `Yuklangan hajm: ${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };
  }

  return {
    isSafe: true,
    fileName,
    extension: ext.toUpperCase()
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
