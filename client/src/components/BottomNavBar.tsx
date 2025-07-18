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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-passion-100 flex justify-around items-center h-14 sm:h-16 lg:h-18 shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 sm:py-2 px-1 focus:outline-none transition-all duration-200 ${
              location.pathname === item.path
                ? "text-passion-500 scale-105 sm:scale-110"
                : "text-gray-400 hover:text-passion-300"
            }`}
            onClick={() => navigate(item.path)}
          >
            <IconComponent
              size={16}
              className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 mb-0.5"
            />
            <span className="text-[9px] sm:text-[10px] lg:text-xs font-semibold leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
