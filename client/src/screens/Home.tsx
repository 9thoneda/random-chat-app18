import { useCallback, useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { playSound } from "../lib/audio";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Crown,
  Coins,
  Mic,
  Video,
  Users,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Star,
  Play,
  Globe,
} from "lucide-react";
import GenderFilter from "../components/GenderFilter";
import PremiumPaywall from "../components/PremiumPaywall";
import TreasureChest from "../components/TreasureChest";
import BottomNavBar from "../components/BottomNavBar";
import { usePremium } from "../context/PremiumProvider";
import { useCoin } from "../context/CoinProvider";
import { useLanguage } from "../context/LanguageProvider";

const bannerImages = [
  "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop",
  "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop",
  "https://images.pexels.com/photos/1043472/pexels-photo-1043472.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop",
];

const testimonials = [
  {
    name: "Priya",
    text: "Found my perfect match here! So grateful 💕",
    rating: 5,
  },
  {
    name: "Arjun",
    text: "Every chat is a new adventure, truly amazing!",
    rating: 5,
  },
  {
    name: "Sneha",
    text: "Safe, fun, and full of romantic possibilities 🌟",
    rating: 5,
  },
];

const stats = [
  { number: "10M+", label: "Happy Users", icon: Users },
  { number: "50M+", label: "Connections Made", icon: Heart },
  { number: "99.9%", label: "Uptime", icon: Shield },
];

export default function Home() {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { isPremium, setPremium } = usePremium();
  const {
    coins,
    claimDailyBonus,
    canClaimDailyBonus,
    isLoading: coinsLoading,
  } = useCoin();
  const { t } = useLanguage();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTreasureChest, setShowTreasureChest] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12847);

  // Simulate online users count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-claim daily bonus on app open
  useEffect(() => {
    if (canClaimDailyBonus) {
      // Show daily bonus notification
      setTimeout(() => {
        if (confirm("🎁 Daily bonus available! Claim 5 coins now?")) {
          claimDailyBonus();
        }
      }, 2000);
    }
  }, [canClaimDailyBonus, claimDailyBonus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartCall = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isConnecting) return;

      setIsConnecting(true);
      playSound("join");

      // Send user profile to server for premium priority matching
      socket?.emit("user:profile", {
        isPremium,
        genderFilter: "any",
        voiceOnly: false,
      });

      // Emit find match event
      socket?.emit("find:match");

      // Navigate immediately to video chat page (it will handle the waiting state)
      navigate("/video-chat", {
        state: {
          isSearching: true,
        },
      });

      setIsConnecting(false);
    },
    [navigate, socket, isPremium, isConnecting],
  );

  const handleVoiceChat = useCallback(() => {
    navigate("/voice");
  }, [navigate]);

  const handleUpgrade = () => {
    setShowPaywall(true);
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

  return (
    <>
      <Helmet>
        <title>
          {t("app.name")} - Random Video Chat - Live chat with ajnabis
        </title>
      </Helmet>
      <main className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-gradient-to-br from-sindoor-25 via-jasmine-25 to-henna-25 relative pb-20 overflow-hidden">
        {/* Enhanced Animated Background Elements with Indian flair */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-sindoor-300 to-henna-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-8 w-16 h-16 bg-gradient-to-br from-royal-300 to-gulmohar-400 rounded-full opacity-30 animate-bounce"></div>
          <div
            className="absolute bottom-40 left-6 w-12 h-12 bg-gradient-to-br from-jasmine-300 to-sindoor-400 rounded-full opacity-25 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-60 right-12 w-8 h-8 bg-gradient-to-br from-passion-400 to-royal-400 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>
          {/* Add romantic Indian symbols */}
          <div
            className="absolute top-20 right-20 text-sindoor-400 text-2xl opacity-40 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            💕
          </div>
          <div
            className="absolute bottom-80 left-16 text-henna-400 text-xl opacity-35 animate-bounce"
            style={{ animationDelay: "1.5s" }}
          >
            🌸
          </div>
          <div
            className="absolute top-60 left-8 text-jasmine-400 text-lg opacity-30 animate-pulse"
            style={{ animationDelay: "2.5s" }}
          >
            ✨
          </div>
          <div
            className="absolute top-80 right-6 text-gulmohar-400 text-base opacity-25 animate-bounce"
            style={{ animationDelay: "3s" }}
          >
            🪷
          </div>
        </div>

        {/* Enhanced Header with Indian romantic colors */}
        <header className="w-full bg-gradient-to-r from-sindoor-500 via-gulmohar-500 to-royal-600 shadow-lg px-6 py-6 border-b border-sindoor-100 relative overflow-hidden">
          {/* Header Background Pattern with Indian touch */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-jasmine-100/25 to-white/15 backdrop-blur-sm"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-henna-200/15 to-transparent"></div>

          <div className="relative z-10 flex items-center justify-between">
            {/* App Name & Premium Badge */}
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {t("app.name")}
              </h1>
              {isPremium && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-jasmine-400 to-gulmohar-500 px-3 py-1 rounded-full shadow-md">
                  <Crown className="h-4 w-4 text-white" />
                  <span className="text-white text-xs font-bold">PREMIUM</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Chat Button */}
              <Button
                onClick={handleVoiceChat}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-3 py-2 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 border border-white/30"
              >
                <Mic className="h-4 w-4 mr-1" />
                Voice
              </Button>

              {/* Coins Button */}
              <Button
                onClick={() => setShowTreasureChest(true)}
                disabled={coinsLoading}
                className="bg-gradient-to-r from-jasmine-500 to-gulmohar-600 hover:from-jasmine-600 hover:to-gulmohar-700 text-white font-semibold px-4 py-2 rounded-full shadow-md transform hover:scale-105 transition-all duration-200"
              >
                <Coins className="h-4 w-4 mr-2" />
                {coinsLoading ? "..." : coins}
              </Button>
            </div>
          </div>
        </header>

        {/* Enhanced Banner Carousel - Moved to top as Ad */}
        <div className="w-full relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${currentBannerIndex * 100}%)`,
              }}
            >
              {bannerImages.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 relative">
                  <img
                    src={image}
                    alt={`Ad Banner ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-4 text-white">
                    <p className="text-xs opacity-90">Advertisement</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Carousel Dots */}
          <div className="absolute bottom-1 right-16 flex gap-1">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentBannerIndex === index
                    ? "bg-white w-4"
                    : "bg-white/60 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 py-6 relative z-10">
          {/* Enhanced Gender Filter - Moved to top */}
          <div className="w-full mb-6">
            <GenderFilter
              isPremium={isPremium}
              onGenderSelect={(gender: string) => {
                console.log("Selected gender:", gender);
              }}
              onUpgrade={handleUpgrade}
            />
          </div>

          {/* Enhanced Main Action Button - Moved to top */}
          <div className="w-full mb-6">
            <Button
              className={`w-full py-6 text-xl font-bold rounded-3xl text-white shadow-2xl transform transition-all duration-300 relative overflow-hidden ${
                isConnecting
                  ? "bg-gradient-to-r from-mehendi-500 to-mehendi-600 scale-95"
                  : "bg-gradient-to-r from-sindoor-500 via-gulmohar-500 to-royal-600 hover:scale-105 hover:shadow-3xl"
              }`}
              onClick={handleStartCall}
              disabled={isConnecting}
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-jasmine-200/40 via-white/25 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 flex items-center justify-center gap-3">
                {isConnecting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Finding your match...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-6 w-6" />
                    <span>{t("home.start")}</span>
                    <Sparkles className="h-5 w-5" />
                  </>
                )}
              </div>
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            <Button
              onClick={() => navigate("/friends")}
              className="bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 py-4 rounded-2xl"
            >
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              <span className="font-semibold">Friends</span>
            </Button>

            <Button
              onClick={() => navigate("/ai-chatbot")}
              className="bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 py-4 rounded-2xl"
            >
              <Globe className="h-5 w-5 mr-2 text-purple-500" />
              <span className="font-semibold">AI Chat</span>
            </Button>
          </div>

          {/* Footer Text */}
          <div className="text-xs text-center text-gray-500 px-4 leading-relaxed">
            By using AjnabiCam, you agree to our Terms of Service and Privacy
            Policy.
            <br />
            <span className="text-rose-600 font-medium">✓ Safe & Secure</span> •
            <span className="text-pink-600 font-medium"> ✓ 24/7 Support</span> •
            <span className="text-crimson-600 font-medium">
              {" "}
              ✓ Find True Love
            </span>
          </div>
        </div>

        {/* Floating Coin Store Button with Indian colors */}
        <button
          onClick={() => setShowTreasureChest(true)}
          className="fixed bottom-24 right-4 bg-gradient-to-r from-jasmine-500 via-gulmohar-500 to-sindoor-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40 animate-pulse"
        >
          <div className="relative">
            <Coins className="h-6 w-6" />
            {coins > 0 && (
              <div className="absolute -top-2 -right-2 bg-sindoor-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                {coins > 99 ? "99+" : coins}
              </div>
            )}
          </div>
        </button>

        <BottomNavBar />
      </main>

      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchase={handlePremiumPurchase}
      />

      <TreasureChest
        isOpen={showTreasureChest}
        onClose={() => setShowTreasureChest(false)}
      />
    </>
  );
}
