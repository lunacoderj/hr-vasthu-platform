import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotification, type Notification } from '../../hooks/useNotification';

const iconMap = {
  success: <CheckCircle className="text-emerald-500" size={20} />,
  error: <AlertCircle className="text-copper-500" size={20} />,
  warning: <AlertTriangle className="text-gold-500" size={20} />,
  info: <Info className="text-blue-500" size={20} />,
};

const ToastItem: React.FC<{ notification: Notification; onRemove: (id: string) => void }> = ({
  notification,
  onRemove,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg rounded-lg p-4 mb-3 flex items-start gap-3 w-80 pointer-events-auto"
    >
      <div className="flex-shrink-0 mt-0.5">{iconMap[notification.type]}</div>
      <div className="flex-1 text-sm font-medium text-stone-800 dark:text-stone-200">
        {notification.message}
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="flex-shrink-0 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

export const ToastProvider: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastProvider;
