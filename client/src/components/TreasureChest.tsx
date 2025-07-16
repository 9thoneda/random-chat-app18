import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Coins, Gift, Play, Users, Crown, X, Star, Zap, Sparkles, TrendingUp, Calendar, Video, MessageCircle, Target } from "lucide-react";
import { useCoin } from "../context/CoinProvider";
import { usePremium } from "../context/PremiumProvider";

interface TreasureChestProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TreasureChest({ isOpen, onClose }: TreasureChestProps) {
  const { 
    coins, 
    watchAd, 
    claimDailyBonus, 
    completeChat,
    adsWatchedToday, 
    maxAdsPerDay, 
    canClaimDailyBonus,
    currentStreak,
    hasCompletedOnboarding
  } = useCoin();
  const { isPremium } = usePremium();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const coinPacks = [
    { coins: 50, price: "₹29", popular: false, bonus: "" },
    { coins: 120, price: "₹59", popular: true, bonus: "+20 Bonus!" },
    { coins: 250, price: "₹99", popular: false, bonus: "+50 Bonus!" },
    { coins: 500, price: "₹179", popular: false, bonus: "+100 Bonus!" },
  ];

  const handlePurchasePack = (pack: typeof coinPacks[0]) => {
    // Simulate in-app purchase - in production, integrate with payment gateway
    const purchaseCoins = async () => {
      const success = await addCoins(pack.coins);
      if (success) {
        alert(`🎉 You purchased ${pack.coins} coins for ${pack.price}!`);
      } else {
        alert("❌ Purchase failed. Please try again.");
      }
    };
    
    purchaseCoins();
    onClose();
  };

  const earningMethods = [
    {
      id: 'daily',
      title: 'Daily Login Bonus',
      coins: 5,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Open the app daily',
      action: claimDailyBonus,
      available: canClaimDailyBonus,
      buttonText: canClaimDailyBonus ? 'Claim 5 Coins' : 'Claimed Today',
      streak: currentStreak
    },
    {
      id: 'ads',
      title: 'Watch Rewarded Ads',
      coins: 10,
      icon: Play,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      description: `Up to ${maxAdsPerDay} times per day`,
      action: watchAd,
      available: adsWatchedToday < maxAdsPerDay,
      buttonText: adsWatchedToday < maxAdsPerDay 
        ? `Watch Ad (${maxAdsPerDay - adsWatchedToday} left)` 
        : 'Daily Limit Reached',
      progress: `${adsWatchedToday}/${maxAdsPerDay} today`
    },
    {
      id: 'onboarding',
      title: 'Complete Onboarding',
      coins: 10,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      description: 'One-time bonus',
      action: () => alert('Onboarding already completed!'),
      available: false,
      buttonText: hasCompletedOnboarding ? 'Completed' : 'Complete Setup',
      oneTime: true
    },
    {
      id: 'chat',
      title: 'Finish Video/Voice Chat',
      coins: 3,
      icon: Video,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      description: 'Per completed chat',
      action: completeChat,
      available: true,
      buttonText: 'Complete a Chat',
      automatic: true
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-2 border-rose-200 shadow-3xl relative overflow-hidden my-4 min-h-fit max-h-[95vh]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-12 right-8 w-6 h-6 bg-orange-200 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-16 left-8 w-4 h-4 bg-pink-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-8 right-4 w-5 h-5 bg-purple-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
        </div>

        <CardHeader className="text-center relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 p-2 text-rose-500 hover:bg-rose-100 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X size={22} />
          </Button>
          
          {/* Animated Treasure Chest */}
          <div className="flex justify-center mb-6">
            <div className={`relative ${isAnimating ? 'animate-bounce' : ''} transform hover:scale-110 transition-transform duration-300`}>
              <div className="w-24 h-20 bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 rounded-xl relative overflow-hidden shadow-2xl border-2 border-yellow-300">
                {/* Chest body */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500"></div>
                {/* Chest lid */}
                <div className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-br from-rose-300 via-pink-400 to-purple-400 rounded-t-xl transform-gpu transition-transform duration-500 ${isAnimating ? 'rotate-12 -translate-y-3' : ''}`}></div>
                {/* Lock */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full border border-yellow-500 shadow-sm"></div>
                {/* Sparkles */}
                {isAnimating && (
                  <>
                    <div className="absolute -top-3 -left-3 text-yellow-400 text-xl animate-ping">✨</div>
                    <div className="absolute -top-4 -right-2 text-orange-400 text-lg animate-ping" style={{animationDelay: '0.2s'}}>✨</div>
                    <div className="absolute -top-2 left-1/2 text-yellow-300 text-lg animate-ping" style={{animationDelay: '0.4s'}}>✨</div>
                    <div className="absolute -bottom-1 -left-2 text-pink-400 text-sm animate-ping" style={{animationDelay: '0.6s'}}>✨</div>
                    <div className="absolute -bottom-2 -right-1 text-purple-400 text-sm animate-ping" style={{animationDelay: '0.8s'}}>✨</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            💰 Coin Store! 💰
          </CardTitle>
          
          {/* Current Balance */}
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-8 py-3 inline-block mt-3 border-2 border-rose-300 shadow-lg">
            <div className="flex items-center gap-3">
              <Coins className="h-6 w-6 text-rose-600 animate-pulse" />
              <span className="font-extrabold text-xl text-rose-700">{coins} Coins</span>
            </div>
          </div>

          {/* Streak Display */}
          {currentStreak > 0 && (
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full px-6 py-2 inline-block mt-2 border border-orange-300">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-600" />
                <span className="font-bold text-orange-700">{currentStreak} Day Streak! 🔥</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6 relative z-10 overflow-y-auto max-h-[calc(95vh-200px)] pb-6">
          {/* Earn Free Coins Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-rose-800 text-center flex items-center justify-center gap-3 text-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
              🎁 Ways to Earn Coins
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {earningMethods.map((method) => (
                <div key={method.id} className={`${method.bgColor} rounded-2xl p-4 border-2 border-opacity-30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-r ${method.color} p-2 rounded-full shadow-md`}>
                        <method.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{method.title}</h4>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">+{method.coins}</div>
                      <div className="text-xs text-gray-500">coins</div>
                    </div>
                  </div>

                  {/* Progress or Status */}
                  {method.progress && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-1">{method.progress}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${method.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${(adsWatchedToday / maxAdsPerDay) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {method.streak && method.streak > 0 && (
                    <div className="mb-3 text-center">
                      <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
                        🔥 {method.streak} Day Streak
                      </span>
                      {method.streak >= 3 && method.streak % 3 === 0 && (
                        <div className="text-xs text-green-600 font-bold mt-1">
                          Next streak bonus at day {method.streak + 3}!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  {!method.automatic && !method.oneTime && (
                    <Button
                      onClick={method.action}
                      disabled={!method.available}
                      className={`w-full font-bold py-2 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${
                        method.available 
                          ? `bg-gradient-to-r ${method.color} hover:shadow-lg text-white` 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {method.buttonText}
                    </Button>
                  )}

                  {method.automatic && (
                    <div className="text-center text-sm text-gray-600 font-medium bg-gray-100 py-2 rounded-lg">
                      ⚡ Earned automatically when you complete chats
                    </div>
                  )}

                  {method.oneTime && hasCompletedOnboarding && (
                    <div className="text-center text-sm text-green-600 font-medium bg-green-100 py-2 rounded-lg">
                      ✅ Already completed - You earned 10 coins!
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Special Streak Bonus Info */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border-2 border-orange-200 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-orange-800">3-Day Streak Bonus</h4>
              </div>
              <p className="text-sm text-orange-700 mb-3">
                Use the app for 3 consecutive days to earn a <strong>20 coin bonus</strong>!
              </p>
              <div className="bg-orange-100 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-orange-800">Current Streak:</span>
                  <span className="font-bold text-orange-900">{currentStreak} days</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((currentStreak / 3) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-orange-600 mt-1 text-center">
                  {currentStreak < 3 
                    ? `${3 - currentStreak} more days for bonus!` 
                    : 'Bonus earned! Keep the streak going!'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Coins Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-purple-800 text-center flex items-center justify-center gap-3 text-lg">
              <div className="bg-purple-100 p-2 rounded-full">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              💎 Buy Coin Packs
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {coinPacks.map((pack, index) => (
                <div
                  key={index}
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    pack.popular 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg' 
                      : 'border-gray-300 bg-white hover:border-purple-300'
                  }`}
                  onClick={() => handlePurchasePack(pack)}
                >
                  {pack.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      POPULAR! 🔥
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700 mb-1">
                      {pack.coins}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">coins</div>
                    
                    {pack.bonus && (
                      <div className="text-xs text-green-600 font-bold mb-2 bg-green-100 rounded-full px-2 py-1">
                        {pack.bonus}
                      </div>
                    )}
                    
                    <div className="font-bold text-lg text-gray-800">
                      {pack.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}