import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, AlertCircle, Clock, CheckCircle, Check, Calendar, FileText, Building2, User, ChevronRight, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Contract as ContractType } from '@/app/data/dummyData';

interface ContractNotificationsProps {
  contracts: ContractType[];
  onViewContract: (contract: ContractType) => void;
}

interface Notification {
  id: string;
  contract: ContractType;
  daysRemaining: number;
  type: 'urgent' | 'warning' | 'info' | 'expired';
  message: string;
  priority: number;
  timestamp: string;
  isRead: boolean;
}

export function ContractNotifications({ contracts, onViewContract }: ContractNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  useEffect(() => {
    const calculateNotifications = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const notifs: Notification[] = [];

      contracts.forEach(contract => {
        // Skip jika terminated
        if (contract.status === 'terminated') return;

        const endDate = new Date(contract.endDate);
        endDate.setHours(0, 0, 0, 0);

        const diffTime = endDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Timeline notifikasi
        const notificationPoints = [
          { days: 30, message: '1 bulan lagi', type: 'info' as const, priority: 1 },
          { days: 14, message: '2 minggu lagi', type: 'info' as const, priority: 2 },
          { days: 7, message: '1 minggu lagi', type: 'warning' as const, priority: 3 },
          { days: 3, message: '3 hari lagi', type: 'warning' as const, priority: 4 },
          { days: 2, message: '2 hari lagi', type: 'urgent' as const, priority: 5 },
          { days: 1, message: '1 hari lagi', type: 'urgent' as const, priority: 6 },
        ];

        // Check notifikasi sebelum expire (30 hari ke belakang dari titik notifikasi)
        notificationPoints.forEach(point => {
          if (daysRemaining <= point.days && daysRemaining > point.days - 30) {
            notifs.push({
              id: `${contract.id}-${point.days}`,
              contract,
              daysRemaining,
              type: point.type,
              message: `Kontrak akan berakhir ${point.message}`,
              priority: point.priority,
              timestamp: getTimeAgo(daysRemaining),
              isRead: false,
            });
          }
        });

        // Notifikasi sudah expired (sampai 30 hari setelah expire)
        if (daysRemaining < 0 && daysRemaining >= -30) {
          notifs.push({
            id: `${contract.id}-expired`,
            contract,
            daysRemaining,
            type: 'expired',
            message: `Kontrak sudah berakhir ${Math.abs(daysRemaining)} hari yang lalu`,
            priority: 7,
            timestamp: `${Math.abs(daysRemaining)} hari yang lalu`,
            isRead: false,
          });
        }
      });

      // Sort berdasarkan priority (higher priority = lebih urgent)
      notifs.sort((a, b) => b.priority - a.priority);
      setNotifications(notifs);
    };

    calculateNotifications();
  }, [contracts]);

  const getTimeAgo = (days: number) => {
    if (days <= 1) return '1 jam yang lalu';
    if (days <= 3) return '2 jam yang lalu';
    if (days <= 7) return '4 jam yang lalu';
    if (days <= 14) return '9 jam yang lalu';
    return '1 hari yang lalu';
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'urgent':
      case 'expired':
        return {
          bgGradient: 'bg-gradient-to-br from-red-50 to-pink-50',
          borderColor: 'border-l-4 border-red-500',
          iconBg: 'bg-gradient-to-br from-red-500 to-pink-500',
          icon: <AlertTriangle className="w-5 h-5 text-white" />,
          badge: 'bg-red-500',
          textColor: 'text-red-900',
          dotColor: 'bg-red-500',
        };
      case 'warning':
        return {
          bgGradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
          borderColor: 'border-l-4 border-amber-500',
          iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
          icon: <AlertCircle className="w-5 h-5 text-white" />,
          badge: 'bg-amber-500',
          textColor: 'text-amber-900',
          dotColor: 'bg-amber-500',
        };
      default:
        return {
          bgGradient: 'bg-gradient-to-br bg-[#EEF7F5]',
          borderColor: 'border-l-4 border-blue-500',
          iconBg: 'bg-gradient-to-br from-[#013E37] to-[#025C52]',
          icon: <CheckCircle className="w-5 h-5 text-white" />,
          badge: 'bg-blue-500',
          textColor: 'text-blue-900',
          dotColor: 'bg-blue-500',
        };
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkAsRead = (notifId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const handleDismissNotification = (notifId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'urgent') return n.type === 'urgent' || n.type === 'expired';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' || n.type === 'expired').length;

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="relative hover:bg-gray-100 transition-all"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notifications Sidebar Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header - Gradient Background */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Notification</h2>
                    <p className="text-xs text-slate-300">
                      {unreadCount} belum dibaca
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Tandai Semua</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Semua</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-gray-50 border-b px-6 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Semua ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === 'unread'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Belum Dibaca ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === 'urgent'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Urgent ({urgentCount})
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {filter === 'all' ? 'Tidak Ada Notification' : 
                     filter === 'unread' ? 'Semua Sudah Dibaca' :
                     'Tidak Ada Urgent'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {filter === 'all' ? 'Semua kontrak dalam kondisi baik' :
                     filter === 'unread' ? 'Anda sudah membaca semua notifikasi' :
                     'Tidak ada notifikasi urgent saat ini'}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredNotifications.map((notification) => {
                    const style = getNotificationStyle(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`relative rounded-xl ${style.bgGradient} ${style.borderColor} shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group ${
                          !notification.isRead ? 'ring-2 ring-offset-1 ring-blue-400/30' : ''
                        }`}
                        onClick={() => {
                          onViewContract(notification.contract);
                          handleMarkAsRead(notification.id, {} as React.MouseEvent);
                          setIsOpen(false);
                        }}
                      >
                        {/* Unread Indicator */}
                        {!notification.isRead && (
                          <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${style.dotColor} animate-pulse`} />
                        )}

                        <div className="p-4">
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}>
                              {style.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Header */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className={`font-bold text-sm ${style.textColor} mb-0.5`}>
                                    {notification.type === 'expired' ? '⚠️ Kontrak Berakhir' :
                                     notification.type === 'urgent' ? '🔥 Perlu Perhatian Segera' :
                                     notification.type === 'warning' ? '⚡ Peringatan Kontrak' :
                                     '✅ Informasi Kontrak'}
                                  </h4>
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {notification.timestamp}
                                  </p>
                                </div>
                                <Badge className={`${style.badge} text-white text-xs font-bold shadow-sm`}>
                                  {notification.daysRemaining >= 0
                                    ? `${notification.daysRemaining} hari`
                                    : `Expired`}
                                </Badge>
                              </div>

                              {/* Message */}
                              <p className="text-sm text-gray-700 mb-3 font-medium">
                                {notification.message}
                              </p>

                              {/* Contract Details */}
                              <div className="space-y-2 bg-white/60 backdrop-blur-sm rounded-lg p-3 mb-3">
                                <div className="flex items-center gap-2 text-xs">
                                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                                  <span className="font-semibold text-gray-700">
                                    {notification.contract.contractNumber}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <Building2 className="w-3.5 h-3.5 text-gray-500" />
                                  <span className="text-gray-600">
                                    {notification.contract.company}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <User className="w-3.5 h-3.5 text-gray-500" />
                                  <span className="text-gray-600">
                                    {notification.contract.clientName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                  <span className="text-gray-600">
                                    Berakhir: {notification.contract.endDate.toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewContract(notification.contract);
                                    handleMarkAsRead(notification.id, e);
                                    setIsOpen(false);
                                  }}
                                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all shadow-sm`}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Lihat Detail
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                                {!notification.isRead && (
                                  <button
                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                    className="px-3 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-all shadow-sm"
                                    title="Tandai sudah dibaca"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => handleDismissNotification(notification.id, e)}
                                  className="px-3 py-2 rounded-lg bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all shadow-sm"
                                  title="Hapus notifikasi"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect Border */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 rounded-xl transition-all pointer-events-none" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t px-6 py-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <span className="text-gray-600 font-medium">
                      Urgent ({urgentCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-gray-600 font-medium">
                      Warning ({notifications.filter(n => n.type === 'warning').length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600 font-medium">
                      Info ({notifications.filter(n => n.type === 'info').length})
                    </span>
                  </div>
                </div>
                <span className="text-gray-500">
                  Total: {notifications.length}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
