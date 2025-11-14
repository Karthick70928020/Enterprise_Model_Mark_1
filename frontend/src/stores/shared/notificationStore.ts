import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
      unreadCount: state.unreadCount + 1
    }));

    // Auto-remove success/info notifications after 5 seconds
    if (['success', 'info'].includes(newNotification.type)) {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, 5000);
    }
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: true })),
      unreadCount: 0
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.read;
      
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0
    });
  }
}));

// Notification utility functions
export const NotificationService = {
  showSuccess: (title: string, message: string, action?: Notification['action']) => {
    useNotificationStore.getState().addNotification({
      type: 'success',
      title,
      message,
      action
    });
  },

  showError: (title: string, message: string, action?: Notification['action']) => {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title,
      message,
      action
    });
  },

  showWarning: (title: string, message: string, action?: Notification['action']) => {
    useNotificationStore.getState().addNotification({
      type: 'warning',
      title,
      message,
      action
    });
  },

  showInfo: (title: string, message: string, action?: Notification['action']) => {
    useNotificationStore.getState().addNotification({
      type: 'info',
      title,
      message,
      action
    });
  }
};