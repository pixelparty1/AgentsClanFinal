'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ShoppingCart, Target, UserPlus, Briefcase, WifiOff, Wifi } from 'lucide-react';
import { useRealtimeAdminStats } from '@/hooks/useRealtimeSubscription';

interface Notification {
  id: string;
  type: 'order' | 'submission' | 'membership' | 'application';
  message: string;
  timestamp: Date;
}

export function RealtimeNotifications() {
  const { stats, isConnected, resetStats } = useRealtimeAdminStats();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  const totalNew = stats.newOrders + stats.pendingSubmissions + stats.newMemberships + stats.newApplications;

  // Add notifications when stats change
  useEffect(() => {
    if (stats.newOrders > 0) {
      addNotification('order', `${stats.newOrders} new order${stats.newOrders > 1 ? 's' : ''}`);
    }
  }, [stats.newOrders]);

  useEffect(() => {
    if (stats.pendingSubmissions > 0) {
      addNotification('submission', `${stats.pendingSubmissions} quest submission${stats.pendingSubmissions > 1 ? 's' : ''} pending review`);
    }
  }, [stats.pendingSubmissions]);

  useEffect(() => {
    if (stats.newMemberships > 0) {
      addNotification('membership', `${stats.newMemberships} new member${stats.newMemberships > 1 ? 's' : ''} joined!`);
    }
  }, [stats.newMemberships]);

  useEffect(() => {
    if (stats.newApplications > 0) {
      addNotification('application', `${stats.newApplications} new job application${stats.newApplications > 1 ? 's' : ''}`);
    }
  }, [stats.newApplications]);

  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: new Date(),
    };
    setNotifications(prev => [notification, ...prev].slice(0, 20));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    resetStats();
  }, [resetStats]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'submission':
        return <Target className="w-4 h-4 text-purple-400" />;
      case 'membership':
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'application':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        
        {/* Badge */}
        {totalNew > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-red-500 text-white"
          >
            {totalNew > 9 ? '9+' : totalNew}
          </motion.span>
        )}
      </button>

      {/* Connection Status Indicator */}
      <div className="absolute -bottom-1 -right-1">
        {isConnected ? (
          <Wifi className="w-3 h-3 text-emerald-400" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-400" />
        )}
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-[400px] overflow-y-auto rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] shadow-xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-emerald-900/20 bg-[#0a0f0d]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">Notifications</span>
                {isConnected && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-emerald-900/10">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-4 hover:bg-emerald-950/20 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-800 transition-all"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Quick Stats */}
            {totalNew > 0 && (
              <div className="sticky bottom-0 p-4 border-t border-emerald-900/20 bg-emerald-950/30">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-emerald-400">{stats.newOrders}</p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-400">{stats.pendingSubmissions}</p>
                    <p className="text-xs text-gray-500">Quests</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-400">{stats.newMemberships}</p>
                    <p className="text-xs text-gray-500">Members</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-400">{stats.newApplications}</p>
                    <p className="text-xs text-gray-500">Jobs</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
