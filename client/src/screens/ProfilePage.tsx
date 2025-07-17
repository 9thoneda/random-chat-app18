import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BottomNavBar from "../components/BottomNavBar";
import PremiumPaywall from "../components/PremiumPaywall";
import LanguageSelector from "../components/LanguageSelector";
import SettingsModal from "../components/SettingsModal";
import HelpSupportModal from "../components/HelpSupportModal";

import { useFriends } from "../context/FriendsProvider";
import { useCoin } from "../context/CoinProvider";
import {
  uploadProfileImage,
  getStorageErrorMessage,
  validateImageFile,
} from "../lib/storageUtils";
import {
  Crown,
  Camera,
  Copy,
  Star,
  Gift,
  ArrowLeft,
  Edit3,
  Check,
  Settings,
  User,
  Globe,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Trash2,
  Download,
  Share2,
  Heart,
  Zap,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
  Medal,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { usePremium } from "../context/PremiumProvider";
import { useLanguage } from "../context/LanguageProvider";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { friends, removeFriend, canAddMoreFriends, maxFreeLimit } =
    useFriends();
  const { isPremium, setPremium, premiumExpiry } = usePremium();
  const { coins, isLoading: coinsLoading } = useCoin();
  const { t } = useLanguage();

  const [username, setUsername] = useState<string>("User");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<string>("other");
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showLanguageSelector, setShowLanguageSelector] =
    useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [settingsType, setSettingsType] = useState<
    "privacy" | "notifications" | "account" | "general" | null
  >(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<
    "profile" | "stats" | "achievements"
  >("profile");

  const referralId = "AJNABICAM12345";

  // Mock user stats
  const userStats = {
    totalChats: 127,
    friendsMade: 23,
    hoursSpent: 45,
    favoriteTime: "Evening",
    joinDate: "Dec 2024",
    streak: 7,
  };

  // Mock achievements
  const achievements = [
    {
      id: 1,
      title: "First Chat",
      description: "Complete your first video chat",
      unlocked: true,
      icon: "🎉",
    },
    {
      id: 2,
      title: "Social Butterfly",
      description: "Make 10 friends",
      unlocked: true,
      icon: "🦋",
    },
    {
      id: 3,
      title: "Night Owl",
      description: "Chat after midnight 5 times",
      unlocked: true,
      icon: "🦉",
    },
    {
      id: 4,
      title: "Premium Member",
      description: "Subscribe to Premium",
      unlocked: isPremium,
      icon: "👑",
    },
    {
      id: 5,
      title: "Conversation Master",
      description: "Have 100 chats",
      unlocked: true,
      icon: "💬",
    },
    {
      id: 6,
      title: "Global Connector",
      description: "Chat with people from 10 countries",
      unlocked: false,
      icon: "🌍",
    },
  ];

  // Gender-specific avatar URLs
  const getDefaultAvatar = (gender: string): string => {
    switch (gender) {
      case "male":
        return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop";
      case "female":
        return "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop";
      default:
        return "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop";
    }
  };

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("ajnabicam_user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.username) {
          setUsername(parsedData.username);
        }
        if (parsedData.gender) {
          setUserGender(parsedData.gender);
        }

        const savedProfileImage = localStorage.getItem(
          "ajnabicam_profile_image",
        );
        if (savedProfileImage) {
          setProfileImage(savedProfileImage);
        } else {
          setProfileImage(getDefaultAvatar(parsedData.gender || "other"));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setProfileImage(getDefaultAvatar("other"));
      }
    } else {
      setProfileImage(getDefaultAvatar("other"));
    }
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setProfileImage(imageDataUrl);
        localStorage.setItem("ajnabicam_profile_image", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUsernameSave = () => {
    setIsEditingUsername(false);

    const userData = localStorage.getItem("ajnabicam_user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        parsedData.username = username;
        localStorage.setItem("ajnabicam_user_data", JSON.stringify(parsedData));
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const handlePremiumClick = () => {
    setShowPaywall(true);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralId);
    alert(t("profile.referral.copy") + "!");
  };

  const handlePremiumPurchase = (plan: string) => {
    const now = new Date();
    const expiry = new Date(now);
    if (plan === "weekly") {
      expiry.setDate(now.getDate() + 7);
    } else {
      expiry.setMonth(now.getMonth() + 1);
    }

    setPremium(true, expiry);
    setShowPaywall(false);
    alert(`🎉 Welcome to Premium! Your ${plan} subscription is now active!`);
  };

  const handleSettingsClick = (
    type: "privacy" | "notifications" | "account" | "general",
  ) => {
    setSettingsType(type);
    setShowSettingsModal(true);
  };

  const formatPremiumExpiry = () => {
    if (!premiumExpiry) return "";
    return premiumExpiry.toLocaleDateString();
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Enhanced Profile Image Section */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          {/* Larger circular profile image */}
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-rose-200 via-pink-300 to-purple-300 flex justify-center items-center overflow-hidden cursor-pointer border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative">
            {/* Animated border ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-rose-400 via-pink-400 to-purple-400 animate-pulse opacity-30"></div>

            {/* Premium glow effect for premium users */}
            {isPremium && (
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.6)]"></div>
            )}

            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <div className="text-rose-700 text-xs font-bold text-center">
                  {t("profile.addPhoto")}
                </div>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-8 w-8 mx-auto mb-1" />
                <div className="text-xs font-semibold">Change Photo</div>
              </div>
            </div>
          </div>

          {/* Camera button with premium styling */}
          <button
            onClick={handleImageUploadClick}
            className={`absolute -bottom-2 -right-2 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
              isPremium
                ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"
                : "bg-gradient-to-r from-rose-500 to-pink-600"
            }`}
          >
            <Camera className="h-5 w-5" />
          </button>

          {/* Premium crown indicator */}
          {isPremium && (
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg animate-bounce">
              <Crown className="h-5 w-5 text-white" />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Username Section */}
        <div className="mt-6 w-full max-w-sm">
          {isEditingUsername ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="flex-grow px-4 py-3 rounded-xl border-2 border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500 bg-rose-50 text-lg font-semibold transition-all duration-200"
                autoFocus
              />
              <Button
                onClick={handleUsernameSave}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-grow text-center px-4 py-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 text-rose-800 font-bold text-xl border-2 border-rose-200 shadow-sm">
                {username}
              </div>
              <Button
                onClick={() => setIsEditingUsername(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* User Level Badge */}
        <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-200">
          <Medal className="h-5 w-5 text-purple-600" />
          <span className="text-purple-700 font-semibold">Level 5 Chatter</span>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {coinsLoading ? "..." : coins}
            </div>
            <div className="text-xs text-yellow-600 font-medium">Coins</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {userStats.friendsMade}
            </div>
            <div className="text-xs text-green-600 font-medium">
              Friends Made
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Section */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-green-800">
            <div className="bg-green-100 p-2 rounded-full">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            {t("profile.referral.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-green-600 font-bold">
                  {t("profile.referral.id")}
                </span>
                <div className="font-mono text-green-800 text-lg font-extrabold tracking-wider">
                  {referralId}
                </div>
              </div>
              <Button
                onClick={handleCopyReferral}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Copy className="h-4 w-4 mr-2" />
                {t("profile.referral.copy")}
              </Button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-green-700 font-bold mb-2">
              {t("profile.referral.reward")}
            </p>
            <p className="text-xs text-green-600 font-medium">
              {t("profile.referral.share")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <Card
          key={achievement.id}
          className={`${achievement.unlocked ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gray-50 border-gray-200"} transition-all duration-300 hover:shadow-lg`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div
                className={`text-3xl ${achievement.unlocked ? "grayscale-0" : "grayscale"}`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-bold ${achievement.unlocked ? "text-green-800" : "text-gray-600"}`}
                >
                  {achievement.title}
                </h3>
                <p
                  className={`text-sm ${achievement.unlocked ? "text-green-600" : "text-gray-500"}`}
                >
                  {achievement.description}
                </p>
              </div>
              {achievement.unlocked && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Unlocked
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          {t("app.name")} - {t("profile.title")}
        </title>
      </Helmet>
      <main className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto bg-gradient-to-br from-rose-50 to-pink-50 px-2 py-4 relative pb-20">
        {/* Enhanced Header */}
        <div className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-bold text-xl rounded-t-2xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

          <div className="relative z-10 flex items-center justify-between w-full">
            <button
              onClick={handleBackClick}
              className="text-white font-bold text-xl hover:scale-110 transition-transform"
            >
              <ArrowLeft size={24} />
            </button>

            <button
              onClick={handlePremiumClick}
              className="hover:scale-110 transition-transform bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <Crown className="h-6 w-6 text-yellow-300" />
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col bg-white/90 backdrop-blur-sm rounded-b-2xl border border-rose-100 shadow-2xl mb-6 overflow-hidden">
          {/* Premium Status Banner */}
          {isPremium ? (
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-3 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Crown className="h-5 w-5 text-yellow-200" />
                  <h2 className="text-base font-bold">
                    {t("profile.premium.active")}
                  </h2>
                </div>
                <p className="text-yellow-200 text-xs">
                  Expires: {formatPremiumExpiry()}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-3 text-white text-center cursor-pointer relative overflow-hidden hover:shadow-lg transition-all duration-300"
              onClick={handlePremiumClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Crown className="h-5 w-5 text-yellow-200" />
                  <h2 className="text-base font-bold">
                    {t("profile.premium.upgrade")}
                  </h2>
                </div>
                <div className="flex justify-center gap-3 text-purple-100 text-xs font-medium mb-1">
                  <span>{t("profile.premium.features.gender")}</span>
                  <span>{t("profile.premium.features.voice")}</span>
                  <span>{t("profile.premium.features.unlimited")}</span>
                </div>
                <div className="text-yellow-200 text-xs font-bold">
                  ✨ Tap to upgrade! ✨
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex bg-gray-50 border-b border-gray-200">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "achievements", label: "Awards", icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-rose-600 border-b-2 border-rose-500"
                    : "text-gray-600 hover:text-rose-500 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "achievements" && renderAchievementsTab()}
          </div>

          {/* Settings Section */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h3 className="font-bold text-rose-800 text-base flex items-center gap-2 mb-3">
              <div className="bg-rose-100 p-1.5 rounded-full">
                <Settings className="h-4 w-4 text-rose-600" />
              </div>
              {t("profile.settings")}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSettingsClick("privacy")}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-rose-50 transition-all duration-300 border border-rose-200 shadow-sm hover:shadow-md"
              >
                <Shield className="h-5 w-5 text-rose-600 mb-1" />
                <span className="text-rose-700 font-semibold text-xs">
                  Privacy
                </span>
              </button>

              <button
                onClick={() => handleSettingsClick("notifications")}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-rose-50 transition-all duration-300 border border-rose-200 shadow-sm hover:shadow-md"
              >
                <Bell className="h-5 w-5 text-rose-600 mb-1" />
                <span className="text-rose-700 font-semibold text-xs">
                  Notifications
                </span>
              </button>

              <button
                onClick={() => handleSettingsClick("account")}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-rose-50 transition-all duration-300 border border-rose-200 shadow-sm hover:shadow-md"
              >
                <User className="h-5 w-5 text-rose-600 mb-1" />
                <span className="text-rose-700 font-semibold text-xs">
                  Account
                </span>
              </button>

              <button
                onClick={() => setShowLanguageSelector(true)}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-rose-50 transition-all duration-300 border border-rose-200 shadow-sm hover:shadow-md"
              >
                <Globe className="h-5 w-5 text-rose-600 mb-1" />
                <span className="text-rose-700 font-semibold text-xs">
                  Language
                </span>
              </button>

              <button
                onClick={() => setShowHelpModal(true)}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-rose-50 transition-all duration-300 border border-rose-200 shadow-sm hover:shadow-md"
              >
                <HelpCircle className="h-5 w-5 text-rose-600 mb-1" />
                <span className="text-rose-700 font-semibold text-xs">
                  Help
                </span>
              </button>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to logout?")) {
                    localStorage.clear();
                    navigate("/onboarding");
                  }
                }}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-red-50 transition-all duration-300 border border-red-200 shadow-sm hover:shadow-md"
              >
                <LogOut className="h-5 w-5 text-red-600 mb-1" />
                <span className="text-red-700 font-semibold text-xs">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>

        <BottomNavBar />
      </main>

      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchase={handlePremiumPurchase}
      />

      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          setSettingsType(null);
        }}
        settingType={settingsType}
      />

      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <TreasureChest
        isOpen={showTreasureChest}
        onClose={() => setShowTreasureChest(false)}
      />
    </>
  );
};

export default ProfilePage;
