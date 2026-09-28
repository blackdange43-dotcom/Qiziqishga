import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Clock, 
  Download, 
  Trash2, 
  Send,
  Eye,
  X,
  LogOut
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { ADMIN_TELEGRAM_USERNAME } from '../utils/telegram';
import { playTap } from '../utils/audio';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onClose: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateStatus,
  onDeleteOrder,
  onClose,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.personal.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.personal.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.academic.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.details.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderNumber.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'yangi':
        return <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 dark:text-cyan-300">Yangi</span>;
      case 'jarayonda':
        return <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">Jarayonda</span>;
      case 'tayyor':
        return <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">Tayyor</span>;
      case 'tolov_kutilmoqda':
        return <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">To'lov kutilmoqda</span>;
    }
  };

  const exportToJson = () => {
    playTap();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `studentbot_zayavkalar_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Users className="h-3.5 w-3.5" />
            <span>Admin Boshqaruv Paneli</span>
          </div>
          <h2 className="mt-1 font-['Outfit'] text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kelib tushgan zayavkalar ({orders.length})
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Admin: <span className="text-cyan-600 dark:text-cyan-400 font-mono">@{ADMIN_TELEGRAM_USERNAME}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportToJson}
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>JSON Eksport</span>
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={() => {
                playTap();
                onLogout();
              }}
              title="Admin hisobidan chiqish"
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Chiqish</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playTap();
              onClose();
            }}
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-3 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
          >
            <X className="h-4 w-4" />
            <span>Mijoz shakliga qaytish</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Ism, mavzu, universitet yoki ID bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-[42px] rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 pl-10 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all backdrop-blur-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => {
              playTap();
              setStatusFilter(e.target.value);
            }}
            className="min-h-[42px] rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 px-3 text-xs text-slate-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">Barcha holatlar</option>
            <option value="yangi">Yangi</option>
            <option value="jarayonda">Jarayonda</option>
            <option value="tolov_kutilmoqda">To'lov kutilmoqda</option>
            <option value="tayyor">Tayyor</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 p-12 text-center">
          <Clock className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-600" />
          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Zayavka topilmadi</p>
          <p className="mt-1 text-xs text-slate-500">
            {orders.length === 0
              ? "Hozircha hech qanday zayavka yo'q. Birinchi zayavkani yuboring!"
              : "Qidiruv bo'yicha natija chiqmadi."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-4 backdrop-blur-md transition-all hover:border-cyan-500/30 shadow-sm dark:shadow-none"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    #{order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {order.personal.firstName} {order.personal.lastName}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">({order.personal.studyYear})</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                  <span className="text-slate-400">Mavzu:</span> {order.details.topic}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                  <span>🏛 {order.academic.universityName}</span>
                  <span>·</span>
                  <span>📚 {order.academic.subjectName}</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{order.tariff.priceFormatted} ({order.tariff.name})</span>
                  {order.details.files.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-cyan-600 dark:text-cyan-300">📎 {order.details.files.length} ta fayl</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status change and actions */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="yangi">Yangi</option>
                  <option value="jarayonda">Jarayonda</option>
                  <option value="tolov_kutilmoqda">To'lov kutilmoqda</option>
                  <option value="tayyor">Tayyor</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                  title="Tafsilotlarni ko'rish"
                >
                  <Eye className="h-4 w-4" />
                </button>

                {order.personal.telegramUsername && (
                  <a
                    href={`https://t.me/${order.personal.telegramUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20"
                    title="Talabaga Telegramda yozish"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteOrder(order.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
                  title="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 text-xs text-slate-700 dark:text-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <span className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">
                Zayavka #{selectedOrder.orderNumber}
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Talaba ma'lumotlari:</p>
              <p className="mt-1">{selectedOrder.personal.firstName} {selectedOrder.personal.lastName} ({selectedOrder.personal.birthYear}-yil, {selectedOrder.personal.studyYear})</p>
              <p className="text-slate-500 dark:text-slate-400">Tel: {selectedOrder.personal.phone || 'Kiritilmagan'} | TG: {selectedOrder.personal.telegramUsername || 'Kiritilmagan'}</p>
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Akademik ma'lumotlar:</p>
              <p className="mt-1">OTM: {selectedOrder.academic.universityName}</p>
              <p>Fan: {selectedOrder.academic.subjectName}</p>
              <p>O'qituvchi: {selectedOrder.academic.teacherName}</p>
              {selectedOrder.academic.faculty && <p>Fakultet: {selectedOrder.academic.faculty}</p>}
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Mavzu va talablar:</p>
              <p className="mt-1 text-cyan-700 dark:text-cyan-200 font-medium">{selectedOrder.details.topic}</p>
              {selectedOrder.details.deadline && <p>Muddat: {selectedOrder.details.deadline}</p>}
              {selectedOrder.details.pageCount && <p>Hajm: {selectedOrder.details.pageCount}</p>}
              {selectedOrder.details.additionalNotes && <p>Eslatma: {selectedOrder.details.additionalNotes}</p>}
            </div>

            {selectedOrder.details.files.length > 0 && (
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Biriktirilgan fayllar ({selectedOrder.details.files.length}):</p>
                <ul className="mt-1.5 space-y-1">
                  {selectedOrder.details.files.map((f) => (
                    <li key={f.id} className="flex items-center justify-between rounded bg-slate-100 dark:bg-white/5 p-2 font-mono">
                      <span>{f.name}</span>
                      <span className="text-slate-500">{(f.size / 1024).toFixed(0)} KB</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-slate-200 dark:border-white/10 pt-3 flex items-center justify-between">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Tarif: </span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedOrder.tariff.name}</span>
                <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-bold">{selectedOrder.tariff.priceFormatted}</span>
              </div>

              {selectedOrder.personal.telegramUsername && (
                <a
                  href={`https://t.me/${selectedOrder.personal.telegramUsername.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 font-bold text-slate-950 text-xs"
                >
                  <Send className="h-3 w-3" />
                  <span>Bog'lanish</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
