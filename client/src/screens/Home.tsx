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

      // Simulate connection delay for better UX
      setTimeout(() => {
        navigate("/video-chat");
        setIsConnecting(false);
      }, 1500);
    },
    [navigate, socket, isPremium],
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
      <main className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-8 w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full opacity-30 animate-bounce"></div>
          <div
            className="absolute bottom-40 left-6 w-12 h-12 bg-gradient-to-br from-rose-300 to-crimson-400 rounded-full opacity-25 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-60 right-12 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>
          {/* Add romantic heart shapes */}
          <div
            className="absolute top-20 right-20 text-pink-300 text-2xl opacity-30 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            💕
          </div>
          <div
            className="absolute bottom-80 left-16 text-rose-300 text-xl opacity-25 animate-bounce"
            style={{ animationDelay: "1.5s" }}
          >
            💖
          </div>
          <div
            className="absolute top-60 left-8 text-purple-300 text-lg opacity-20 animate-pulse"
            style={{ animationDelay: "2.5s" }}
          >
            ✨
          </div>
        </div>

        {/* Enhanced Header */}
        <header className="w-full bg-gradient-to-r from-crimson-500 via-rose-500 to-pink-600 shadow-lg px-6 py-6 border-b border-pink-100 relative overflow-hidden">
          {/* Header Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-gold-100/20 to-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gold-200/10 to-transparent"></div>

          <div className="relative z-10 flex items-center justify-between">
            {/* Live Status & Premium Badge */}
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold">
                  {onlineUsers.toLocaleString()} Online
                </span>
              </div>
              {isPremium && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full">
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
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold px-4 py-2 rounded-full shadow-md transform hover:scale-105 transition-all duration-200"
              >
                <Coins className="h-4 w-4 mr-2" />
                {coinsLoading ? "..." : coins}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col px-6 py-6 relative z-10">
          {/* App Name & Tagline */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-crimson-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-2 tracking-tight">
              {t("app.name")}
            </h1>
            <p className="text-rose-700 text-lg font-medium">
              {t("app.tagline")}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm text-rose-500 font-medium">
                4.8/5 Rating • Where Love Stories Begin
              </span>
            </div>
          </div>

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
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 scale-95"
                  : "bg-gradient-to-r from-crimson-500 via-rose-500 to-pink-600 hover:scale-105 hover:shadow-3xl"
              }`}
              onClick={handleStartCall}
              disabled={isConnecting}
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold-200/30 via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

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

          {/* Enhanced Banner Carousel */}
          <div className="w-full mb-6 relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
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
                      alt={`Banner ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">Find Your Soulmate</h3>
                      <p className="text-sm opacity-90">
                        Where hearts connect across India
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Carousel Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentBannerIndex === index
                      ? "bg-white w-8 shadow-lg"
                      : "bg-white/60 w-2"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="w-full grid grid-cols-3 gap-3 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border border-white/50 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-rose-500" />
                <div className="font-bold text-lg text-gray-800">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Features Grid */}
          <div className="w-full grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-4 text-center shadow-lg border border-rose-200 hover:scale-105 hover:shadow-xl transition-all duration-300 hover:from-rose-150 hover:to-pink-150">
              <Video className="h-8 w-8 mx-auto mb-2 text-rose-600" />
              <div className="font-bold text-sm text-rose-700">
                {t("home.features.hd")}
              </div>
              <div className="text-xs text-rose-500">See every smile</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl p-4 text-center shadow-lg border border-emerald-200 hover:scale-105 hover:shadow-xl transition-all duration-300 hover:from-emerald-150 hover:to-green-150">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="font-bold text-sm text-green-700">
                {t("home.features.secure")}
              </div>
              <div className="text-xs text-green-500">Your moments, secure</div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-4 text-center shadow-lg border border-purple-200 hover:scale-105 hover:shadow-xl transition-all duration-300 hover:from-purple-150 hover:to-indigo-150">
              <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-bold text-sm text-purple-700">
                {t("home.features.instant")}
              </div>
              <div className="text-xs text-purple-500">Find your spark</div>
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="w-full mb-6">
            <div className="bg-gradient-to-br from-white/95 to-rose-50/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-rose-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crimson-500 via-rose-500 to-pink-500"></div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-crimson-400 to-rose-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {testimonials[currentTestimonial].name[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-rose-800">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-gold-500 fill-current"
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
              <p className="text-rose-700 text-sm italic font-medium">
                "{testimonials[currentTestimonial].text}"
              </p>
            </div>
          </div>

          {/* Enhanced Gender Filter */}
          <div className="w-full mb-6">
            <GenderFilter
              isPremium={isPremium}
              onGenderSelect={(gender: string) => {
                console.log("Selected gender:", gender);
              }}
              onUpgrade={handleUpgrade}
            />
          </div>

          {/* Enhanced Main Action Button */}
          <div className="w-full mb-4">
            <Button
              className={`w-full py-6 text-xl font-bold rounded-3xl text-white shadow-2xl transform transition-all duration-300 relative overflow-hidden ${
                isConnecting
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 scale-95"
                  : "bg-gradient-to-r from-crimson-500 via-rose-500 to-pink-600 hover:scale-105 hover:shadow-3xl"
              }`}
              onClick={handleStartCall}
              disabled={isConnecting}
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold-200/30 via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

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
