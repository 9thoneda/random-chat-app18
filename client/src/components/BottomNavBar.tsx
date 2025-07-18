import React from "react";
import {
  Home as HomeIcon,
  MessageCircle,
  User,
  Users,
  Bot,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageProvider";

const iconSize = 18; // Base size for mobile, will be responsive

export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t("nav.home"), icon: HomeIcon, path: "/" },
    {
      label: t("nav.chat"),
      icon: MessageCircle,
      path: "/chat",
    },
    { label: "AI Chat", icon: Bot, path: "/ai-chatbot" },
    {
      label: t("nav.friends"),
      icon: Users,
      path: "/friends",
    },
    {
      label: t("nav.profile"),
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-peach-50 via-cream-50 to-blush-50 backdrop-blur-md border-t border-peach-200/50 flex justify-around items-center h-16 sm:h-18 lg:h-20 shadow-lg shadow-peach-200/30 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto rounded-t-3xl">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            className={`relative flex flex-col items-center justify-center flex-1 py-2 sm:py-3 px-2 focus:outline-none transition-all duration-300 transform ${
              isActive ? "scale-110 sm:scale-115" : "hover:scale-105"
            }`}
            onClick={() => navigate(item.path)}
          >
            {/* Active background glow */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-peach-300/30 via-coral-200/20 to-blush-300/30 rounded-2xl blur-sm" />
            )}

            {/* Icon container with beautiful styling */}
            <div
              className={`relative p-2 sm:p-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-peach-400 via-coral-300 to-blush-400 shadow-lg shadow-peach-300/50"
                  : "bg-gradient-to-br from-cream-100/80 to-peach-100/60 hover:from-peach-200/80 hover:to-coral-200/60"
              }`}
            >
              <IconComponent
                size={18}
                className={`sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${
                  isActive
                    ? "text-white drop-shadow-sm"
                    : "text-peach-600 hover:text-coral-500"
                }`}
              />
            </div>

            {/* Label with beautiful styling */}
            <span
              className={`text-[10px] sm:text-xs lg:text-sm font-semibold leading-none mt-1 transition-colors duration-300 ${
                isActive
                  ? "text-peach-700 drop-shadow-sm"
                  : "text-peach-500 hover:text-coral-600"
              }`}
            >
              {item.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <div className="absolute -top-1 right-1/2 transform translate-x-1/2 w-2 h-2 bg-gradient-to-r from-coral-400 to-blush-400 rounded-full shadow-sm animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
