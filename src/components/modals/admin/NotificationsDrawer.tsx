import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Trash2, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useUI } from '@/context/admin/UIContext';
import { GlowButton } from '@/components/ui/GlowButton';

export function NotificationsDrawer() {
  const { 
    showNotificationsDrawer, 
    setShowNotificationsDrawer, 
    notifications, 
    markNotificationRead,
    clearNotifications 
  } = useUI();

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-neon-yellow" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-neon-green" />;
      default: return <Info className="w-5 h-5 text-neon-cyan" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {showNotificationsDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={() => setShowNotificationsDrawer(false)}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-border/50 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neon-cyan/10">
                  <Bell className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-orbitron text-foreground">Notifications</h2>
                  <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationsDrawer(false)}
                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notification, i) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => markNotificationRead(notification.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      notification.read 
                        ? 'bg-muted/20 border-border/30' 
                        : 'bg-muted/40 border-neon-cyan/30 hover:border-neon-cyan/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-neon-cyan flex-shrink-0 mt-2" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-border/50">
                <GlowButton 
                  variant="pink" 
                  className="w-full"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={clearNotifications}
                >
                  Clear All Notifications
                </GlowButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
