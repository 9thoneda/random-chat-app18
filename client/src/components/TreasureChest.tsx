import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Coins,
  Gift,
  Play,
  Users,
  Crown,
  X,
  Star,
  Zap,
  Sparkles,
  TrendingUp,
  Calendar,
  Video,
  MessageCircle,
  Target,
  Clock,
  Percent,
  Shield,
  Heart,
  Flame,
  Trophy,
  Diamond,
  AlertCircle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useCoin } from "../context/CoinProvider";
import { usePremium } from "../context/PremiumProvider";

interface TreasureChestProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TreasureChest({ isOpen, onClose }: TreasureChestProps) {
  const {
    coins,
    addCoins,
    watchAd,
    claimDailyBonus,
    completeChat,
    adsWatchedToday,
    maxAdsPerDay,
    canClaimDailyBonus,
    currentStreak,
    hasCompletedOnboarding,
  } = useCoin();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLimitedOffer, setShowLimitedOffer] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [urgencyMessage, setUrgencyMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Timer for limited offers
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Urgency messages
  useEffect(() => {
    const messages = [
      "⚡ Flash Sale! Don't miss out!",
      "🔥 Limited Time Offer!",
      "💎 Exclusive Deal Today Only!",
      "⏰ Hurry! Sale ends soon!",
      "🎯 Best Value Pack!",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setUrgencyMessage(randomMessage);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  // Enhanced coin packs with psychological pricing and scarcity
  const coinPacks = [
    {
      id: "starter",
      coins: 100,
      price: "₹39",
      originalPrice: "₹59",
      popular: false,
      bonus: "+20 Free!",
      savings: "33% OFF",
      tag: "STARTER",
      color: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-sky-50",
      description: "Perfect for beginners",
    },
    {
      id: "popular",
      coins: 300,
      price: "₹99",
      originalPrice: "₹149",
      popular: true,
      bonus: "+75 FREE!",
      savings: "50% OFF",
      tag: "MOST POPULAR",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      description: "Best value for money",
      badge: "💖 Loved by 89% users",
    },
    {
      id: "mega",
      coins: 750,
      price: "₹199",
      originalPrice: "₹299",
      popular: false,
      bonus: "+200 FREE!",
      savings: "67% OFF",
      tag: "MEGA DEAL",
      color: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      description: "For power users",
      badge: "🔥 Limited time",
    },
    {
      id: "ultimate",
      coins: 1500,
      price: "₹349",
      originalPrice: "₹599",
      popular: false,
      bonus: "+500 FREE!",
      savings: "83% OFF",
      tag: "ULTIMATE",
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      description: "Maximum value pack",
      badge: "💎 VIP Special",
      vip: true,
    },
  ];

  const handlePurchasePack = (pack: (typeof coinPacks)[0]) => {
    // Add purchase psychology with confirmation
    const message = `🎉 Great choice! You're getting ${pack.coins + parseInt(pack.bonus.replace(/\D/g, ""))} coins for just ${pack.price}!\n\n💰 That's ${pack.savings} savings!\n\nConfirm purchase?`;

    if (confirm(message)) {
      const purchaseCoins = async () => {
        try {
          const totalCoins =
            pack.coins + parseInt(pack.bonus.replace(/\D/g, ""));
          const success = await addCoins(totalCoins);
          if (success) {
            alert(
              `🎊 SUCCESS! ${totalCoins} coins added to your account!\n\n✨ Enjoy your enhanced chat experience!`,
            );
          } else {
            alert(`❌ Purchase failed. Please try again.`);
          }
        } catch (error) {
          console.error("Error purchasing coins:", error);
          alert(`❌ Purchase failed. Please try again.`);
        }
      };

      purchaseCoins();
      onClose();
    }
  };

  const earningMethods = [
    {
      id: "daily",
      title: "Daily Login Bonus",
      coins: 5,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      description: "Open the app daily",
      action: claimDailyBonus,
      available: canClaimDailyBonus,
      buttonText: canClaimDailyBonus ? "Claim 5 Coins" : "Claimed Today",
      streak: currentStreak,
    },
    {
      id: "ads",
      title: "Watch Rewarded Ads",
      coins: 10,
      icon: Play,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      description: `Up to ${maxAdsPerDay} times per day`,
      action: watchAd,
      available: adsWatchedToday < maxAdsPerDay,
      buttonText:
        adsWatchedToday < maxAdsPerDay
          ? `Watch Ad (${maxAdsPerDay - adsWatchedToday} left)`
          : "Daily Limit Reached",
      progress: `${adsWatchedToday}/${maxAdsPerDay} today`,
    },
    {
      id: "chat",
      title: "Complete Video/Voice Chats",
      coins: 3,
      icon: Video,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      description: "Per completed chat",
      action: completeChat,
      available: true,
      buttonText: "Complete a Chat",
      automatic: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-2 overflow-y-auto">
      <Card className="w-full max-w-lg mx-auto bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-2 border-rose-200 shadow-3xl relative overflow-hidden my-2 min-h-fit max-h-[98vh]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-12 right-8 w-6 h-6 bg-orange-200 rounded-full opacity-40 animate-bounce"></div>
          <div
            className="absolute bottom-16 left-8 w-4 h-4 bg-pink-200 rounded-full opacity-25 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-8 right-4 w-5 h-5 bg-purple-200 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <CardHeader className="text-center relative z-10 pb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 p-2 text-rose-500 hover:bg-rose-100 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X size={22} />
          </Button>

          {/* Animated Treasure Chest */}
          <div className="flex justify-center mb-4">
            <div
              className={`relative ${isAnimating ? "animate-bounce" : ""} transform hover:scale-110 transition-transform duration-300`}
            >
              <div className="w-24 h-20 bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 rounded-xl relative overflow-hidden shadow-2xl border-2 border-yellow-300">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500"></div>
                <div
                  className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-br from-rose-300 via-pink-400 to-purple-400 rounded-t-xl transform-gpu transition-transform duration-500 ${isAnimating ? "rotate-12 -translate-y-3" : ""}`}
                ></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full border border-yellow-500 shadow-sm"></div>
                {isAnimating && (
                  <>
                    <div className="absolute -top-3 -left-3 text-yellow-400 text-xl animate-ping">
                      ✨
                    </div>
                    <div
                      className="absolute -top-4 -right-2 text-orange-400 text-lg animate-ping"
                      style={{ animationDelay: "0.2s" }}
                    >
                      ✨
                    </div>
                    <div
                      className="absolute -top-2 left-1/2 text-yellow-300 text-lg animate-ping"
                      style={{ animationDelay: "0.4s" }}
                    >
                      ✨
                    </div>
                    <div
                      className="absolute -bottom-1 -left-2 text-pink-400 text-sm animate-ping"
                      style={{ animationDelay: "0.6s" }}
                    >
                      ✨
                    </div>
                    <div
                      className="absolute -bottom-2 -right-1 text-purple-400 text-sm animate-ping"
                      style={{ animationDelay: "0.8s" }}
                    >
                      ✨
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            💰 Coin Store 💰
          </CardTitle>

          {/* Current Balance */}
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 inline-block border-2 border-rose-300 shadow-lg">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-rose-600 animate-pulse" />
              <span className="font-extrabold text-lg text-rose-700">
                {coins} Coins
              </span>
            </div>
          </div>

          {/* Urgency Timer */}
          {showLimitedOffer && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full px-4 py-2 mt-2 inline-block animate-pulse">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Clock className="h-4 w-4" />
                <span>{urgencyMessage}</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}

          {/* Spin Wheel Button */}
          <div className="mt-3">
            <button
              onClick={() => {
                onClose();
                window.location.href = "/spin-wheel";
              }}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-bounce"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                <span>🎰 Spin & Win Coins!</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </button>
            <div className="text-xs text-purple-600 font-semibold mt-1 bg-purple-100 rounded-full px-3 py-1 inline-block">
              ✨ Try your luck! Watch ads to win up to 50 coins! ✨
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10 overflow-y-auto max-h-[calc(98vh-180px)] pb-4">
          {/* Social Proof Banner */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 border border-green-200">
            <div className="flex items-center gap-2 text-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-semibold text-sm">
                🎉 <strong>2,847</strong> users bought coins today!
              </span>
            </div>
          </div>

          {/* Purchase Coins Section with Compelling Design */}
          <div className="space-y-3">
            <h3 className="font-bold text-purple-800 text-center flex items-center justify-center gap-2 text-base">
              <div className="bg-purple-100 p-1.5 rounded-full">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              💎 Special Coin Packs
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {coinPacks.map((pack, index) => (
                <div
                  key={pack.id}
                  className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    pack.popular
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg ring-2 ring-purple-200"
                      : "border-gray-300 bg-white hover:border-purple-300"
                  }`}
                  onClick={() => handlePurchasePack(pack)}
                >
                  {/* Popular/VIP Badge */}
                  {pack.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      {pack.tag} 🔥
                    </div>
                  )}

                  {pack.vip && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      💎 {pack.tag}
                    </div>
                  )}

                  {/* Savings Badge */}
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold transform rotate-12">
                    {pack.savings}
                  </div>

                  <div className="text-center">
                    {/* Coins Amount */}
                    <div className="text-xl font-bold text-purple-700 mb-1">
                      {pack.coins}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">base coins</div>

                    {/* Bonus Display */}
                    {pack.bonus && (
                      <div className="text-xs text-green-600 font-bold mb-2 bg-green-100 rounded-full px-2 py-1 animate-pulse">
                        {pack.bonus}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 line-through">
                        {pack.originalPrice}
                      </div>
                      <div className="font-bold text-lg text-gray-800">
                        {pack.price}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="text-xs text-gray-600 mb-2">
                      {pack.description}
                    </div>

                    {/* User Badge */}
                    {pack.badge && (
                      <div className="text-xs text-purple-600 font-semibold bg-purple-100 rounded px-2 py-1">
                        {pack.badge}
                      </div>
                    )}

                    {/* Total Value Display */}
                    <div className="text-xs text-green-700 font-bold mt-2 bg-green-50 rounded px-2 py-1">
                      Total:{" "}
                      {pack.coins +
                        parseInt(pack.bonus.replace(/\D/g, "") || "0")}{" "}
                      coins
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                <Shield className="h-4 w-4 text-green-600 mb-1" />
                <span className="text-green-700 font-semibold">
                  Secure Payment
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                <Zap className="h-4 w-4 text-blue-600 mb-1" />
                <span className="text-blue-700 font-semibold">
                  Instant Delivery
                </span>
              </div>
              <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                <Heart className="h-4 w-4 text-purple-600 mb-1" />
                <span className="text-purple-700 font-semibold">
                  Best Value
                </span>
              </div>
            </div>
          </div>

          {/* Earn Free Coins Section - Condensed */}
          <div className="space-y-3">
            <h3 className="font-bold text-green-800 text-center flex items-center justify-center gap-2 text-base">
              <div className="bg-green-100 p-1.5 rounded-full">
                <Gift className="h-5 w-5 text-green-600" />
              </div>
              🎁 Free Coins
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {earningMethods.map((method) => (
                <div
                  key={method.id}
                  className={`${method.bgColor} rounded-xl p-3 border-2 border-opacity-30 shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`bg-gradient-to-r ${method.color} p-1.5 rounded-full shadow-md`}
                      >
                        <method.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">
                          {method.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-green-600">
                        +{method.coins}
                      </div>
                      <div className="text-xs text-gray-500">coins</div>
                    </div>
                  </div>

                  {/* Progress or Status */}
                  {method.progress && (
                    <div className="mb-2">
                      <div className="text-xs text-gray-600 mb-1">
                        {method.progress}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`bg-gradient-to-r ${method.color} h-1.5 rounded-full transition-all duration-300`}
                          style={{
                            width: `${(adsWatchedToday / maxAdsPerDay) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {!method.automatic && (
                    <Button
                      onClick={method.action}
                      disabled={!method.available}
                      className={`w-full font-bold py-1.5 rounded-lg shadow-md transition-all duration-300 text-sm ${
                        method.available
                          ? `bg-gradient-to-r ${method.color} hover:shadow-lg text-white`
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {method.buttonText}
                    </Button>
                  )}

                  {method.automatic && (
                    <div className="text-center text-xs text-gray-600 font-medium bg-gray-100 py-1.5 rounded-lg">
                      ⚡ Earned automatically when you complete chats
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 border-2 border-purple-200 text-center">
            <div className="text-purple-800 font-bold text-sm mb-1">
              💫 Why Buy Coins?
            </div>
            <div className="text-purple-700 text-xs">
              • Skip waiting times • Premium features • Unlimited chats •
              Special filters
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
