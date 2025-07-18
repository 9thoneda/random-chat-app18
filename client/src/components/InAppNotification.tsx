import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle, Gift, Crown, Zap } from "lucide-react";

interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}

interface InAppNotificationProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "success" | "warning" | "error" | "info" | "bonus" | "premium";
  icon?: React.ReactNode;
  actions?: NotificationAction[];
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function InAppNotification({
  isOpen,
  title,
  message,
  type = "info",
  icon,
  actions = [],
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
}: InAppNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow fade-out animation to complete
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          container: "from-emerald-50 to-green-100 border-green-200",
          titleColor: "text-green-800",
          messageColor: "text-green-700",
          icon: <Check className="h-6 w-6 text-green-600" />,
          iconBg: "bg-green-100",
        };
      case "warning":
        return {
          container: "from-amber-50 to-yellow-100 border-yellow-200",
          titleColor: "text-amber-800",
          messageColor: "text-amber-700",
          icon: <AlertCircle className="h-6 w-6 text-amber-600" />,
          iconBg: "bg-amber-100",
        };
      case "error":
        return {
          container: "from-red-50 to-rose-100 border-red-200",
          titleColor: "text-red-800",
          messageColor: "text-red-700",
          icon: <AlertCircle className="h-6 w-6 text-red-600" />,
          iconBg: "bg-red-100",
        };
      case "bonus":
        return {
          container: "from-marigold-50 to-bollywood-100 border-marigold-200",
          titleColor: "text-marigold-800",
          messageColor: "text-bollywood-700",
          icon: <Gift className="h-6 w-6 text-marigold-600" />,
          iconBg: "bg-marigold-100",
        };
      case "premium":
        return {
          container: "from-purple-50 to-royal-100 border-purple-200",
          titleColor: "text-purple-800",
          messageColor: "text-royal-700",
          icon: <Crown className="h-6 w-6 text-purple-600" />,
          iconBg: "bg-purple-100",
        };
      default:
        return {
          container: "from-passion-50 to-romance-100 border-passion-200",
          titleColor: "text-passion-800",
          messageColor: "text-romance-700",
          icon: <Zap className="h-6 w-6 text-passion-600" />,
          iconBg: "bg-passion-100",
        };
    }
  };

  const getActionButtonStyle = (variant: string = "primary") => {
    switch (variant) {
      case "secondary":
        return "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300";
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return type === "bonus"
          ? "bg-gradient-to-r from-marigold-500 to-bollywood-600 hover:from-marigold-600 hover:to-bollywood-700 text-white"
          : "bg-gradient-to-r from-passion-500 to-romance-600 hover:from-passion-600 hover:to-romance-700 text-white";
    }
  };

  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Notification Card */}
      <div
        className={`relative max-w-sm w-full bg-gradient-to-br ${styles.container} rounded-2xl border-2 shadow-2xl transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Header with Icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-full ${styles.iconBg} shadow-lg`}>
              {icon || styles.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${styles.titleColor} mb-1`}>
                {title}
              </h3>
              <p className={`text-sm ${styles.messageColor} leading-relaxed`}>
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-3 mt-6">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    handleClose();
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${getActionButtonStyle(
                    action.variant,
                  )}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Decorative elements for bonus type */}
        {type === "bonus" && (
          <>
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-marigold-400 rounded-full opacity-70 animate-pulse" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-bollywood-400 rounded-full opacity-70 animate-pulse delay-300" />
            <div className="absolute top-1/2 -left-1 w-4 h-4 bg-coral-400 rounded-full opacity-50 animate-bounce delay-500" />
          </>
        )}

        {/* Premium sparkles */}
        {type === "premium" && (
          <>
            <div className="absolute top-4 right-8 text-yellow-400 animate-pulse">
              ✨
            </div>
            <div className="absolute bottom-4 left-8 text-purple-400 animate-bounce delay-200">
              ✨
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Helper component for simple notifications
export function useInAppNotification() {
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: InAppNotificationProps["type"];
    icon?: React.ReactNode;
    actions?: NotificationAction[];
    autoClose?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showNotification = (config: Omit<typeof notification, "isOpen">) => {
    setNotification({ ...config, isOpen: true });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const showBonusNotification = (
    title: string,
    message: string,
    onClaim: () => void,
  ) => {
    showNotification({
      title,
      message,
      type: "bonus",
      actions: [
        {
          label: "Claim Now",
          onClick: onClaim,
          variant: "primary",
        },
        {
          label: "Later",
          onClick: () => {},
          variant: "secondary",
        },
      ],
    });
  };

  const NotificationComponent = () => (
    <InAppNotification
      isOpen={notification.isOpen}
      title={notification.title}
      message={notification.message}
      type={notification.type}
      icon={notification.icon}
      actions={notification.actions}
      onClose={hideNotification}
      autoClose={notification.autoClose}
    />
  );

  return {
    showNotification,
    hideNotification,
    showBonusNotification,
    NotificationComponent,
  };
}
