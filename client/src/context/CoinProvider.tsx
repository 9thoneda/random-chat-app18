import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CoinContextType {
  coins: number;
  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => boolean;
  watchAd: () => void;
  referFriend: () => void;
  claimDailyBonus: () => boolean;
  completeChat: () => void;
  checkStreakBonus: () => void;
  adsWatchedToday: number;
  maxAdsPerDay: number;
  canClaimDailyBonus: boolean;
  currentStreak: number;
  hasCompletedOnboarding: boolean;
}

const CoinContext = createContext<CoinContextType | null>(null);

export const useCoin = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error("useCoin must be used within a CoinProvider");
  }
  return context;
};

interface CoinProviderProps {
  children: ReactNode;
}

export const CoinProvider = ({ children }: CoinProviderProps) => {
  const [coins, setCoins] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [canClaimDailyBonus, setCanClaimDailyBonus] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  const maxAdsPerDay = 3;

  // Initialize coins and daily data on mount
  useEffect(() => {
    const savedCoins = localStorage.getItem("ajnabicam_coins");
    const hasOnboarded = localStorage.getItem("ajnabicam_onboarded");
    const lastDailyBonus = localStorage.getItem("ajnabicam_last_daily_bonus");
    const adsToday = localStorage.getItem("ajnabicam_ads_today");
    const adsDate = localStorage.getItem("ajnabicam_ads_date");
    const streakData = localStorage.getItem("ajnabicam_streak_data");
    const onboardingComplete = localStorage.getItem("ajnabicam_onboarding_complete");
    
    const today = new Date().toDateString();
    
    // Initialize coins
    if (savedCoins) {
      setCoins(parseInt(savedCoins));
    } else if (!hasOnboarded) {
      // Give 30 free coins for new users
      setCoins(30);
      localStorage.setItem("ajnabicam_coins", "30");
      localStorage.setItem("ajnabicam_onboarded", "true");
    }

    // Check onboarding completion
    if (onboardingComplete === "true") {
      setHasCompletedOnboarding(true);
    }

    // Check daily bonus eligibility
    if (lastDailyBonus !== today) {
      setCanClaimDailyBonus(true);
    } else {
      setCanClaimDailyBonus(false);
    }

    // Reset ads count if it's a new day
    if (adsDate !== today) {
      setAdsWatchedToday(0);
      localStorage.setItem("ajnabicam_ads_today", "0");
      localStorage.setItem("ajnabicam_ads_date", today);
    } else if (adsToday) {
      setAdsWatchedToday(parseInt(adsToday));
    }

    // Load streak data
    if (streakData) {
      try {
        const { streak, lastDate } = JSON.parse(streakData);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate === today) {
          // Already checked in today
          setCurrentStreak(streak);
        } else if (lastDate === yesterday.toDateString()) {
          // Can continue streak
          setCurrentStreak(streak);
        } else {
          // Streak broken
          setCurrentStreak(0);
          localStorage.setItem("ajnabicam_streak_data", JSON.stringify({
            streak: 0,
            lastDate: ""
          }));
        }
      } catch (error) {
        console.error("Error parsing streak data:", error);
        setCurrentStreak(0);
      }
    }
  }, []);

  const addCoins = (amount: number) => {
    const newAmount = coins + amount;
    setCoins(newAmount);
    localStorage.setItem("ajnabicam_coins", newAmount.toString());
  };

  const deductCoins = (amount: number): boolean => {
    if (coins >= amount) {
      const newAmount = coins - amount;
      setCoins(newAmount);
      localStorage.setItem("ajnabicam_coins", newAmount.toString());
      return true;
    }
    return false;
  };

  const watchAd = () => {
    if (adsWatchedToday >= maxAdsPerDay) {
      alert("❌ You've reached the daily limit of 3 ads. Come back tomorrow!");
      return;
    }

    // Simulate watching an ad
    const newAdsCount = adsWatchedToday + 1;
    setAdsWatchedToday(newAdsCount);
    localStorage.setItem("ajnabicam_ads_today", newAdsCount.toString());
    
    addCoins(10);
    
    const remaining = maxAdsPerDay - newAdsCount;
    if (remaining > 0) {
      alert(`🎉 You earned 10 coins! ${remaining} ads remaining today.`);
    } else {
      alert("🎉 You earned 10 coins! That's all ads for today. Come back tomorrow for more!");
    }
  };

  const claimDailyBonus = (): boolean => {
    if (!canClaimDailyBonus) {
      return false;
    }

    const today = new Date().toDateString();
    addCoins(5);
    setCanClaimDailyBonus(false);
    localStorage.setItem("ajnabicam_last_daily_bonus", today);
    
    // Update streak
    const streakData = localStorage.getItem("ajnabicam_streak_data");
    let newStreak = 1;
    
    if (streakData) {
      try {
        const { streak, lastDate } = JSON.parse(streakData);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate === yesterday.toDateString()) {
          newStreak = streak + 1;
        }
      } catch (error) {
        console.error("Error parsing streak data:", error);
      }
    }
    
    setCurrentStreak(newStreak);
    localStorage.setItem("ajnabicam_streak_data", JSON.stringify({
      streak: newStreak,
      lastDate: today
    }));

    // Check for streak bonus
    if (newStreak === 3) {
      addCoins(20);
      alert("🎉 Daily bonus claimed! +5 coins\n🔥 3-day streak bonus! +20 coins\nTotal: +25 coins!");
    } else {
      alert(`🎉 Daily bonus claimed! +5 coins\n🔥 Current streak: ${newStreak} days`);
    }

    return true;
  };

  const completeChat = () => {
    addCoins(3);
    alert("🎉 Chat completed! You earned 3 coins!");
  };

  const checkStreakBonus = () => {
    if (currentStreak >= 3 && currentStreak % 3 === 0) {
      addCoins(20);
      alert(`🔥 ${currentStreak}-day streak bonus! You earned 20 coins!`);
    }
  };

  const referFriend = () => {
    // Simulate successful referral
    addCoins(25);
    alert("🎉 You earned 25 coins for referring a friend!");
  };

  return (
    <CoinContext.Provider
      value={{
        coins,
        addCoins,
        deductCoins,
        watchAd,
        referFriend,
        claimDailyBonus,
        completeChat,
        checkStreakBonus,
        adsWatchedToday,
        maxAdsPerDay,
        canClaimDailyBonus,
        currentStreak,
        hasCompletedOnboarding,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};