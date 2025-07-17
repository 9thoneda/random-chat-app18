import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ArrowLeft,
  Play,
  Gift,
  Coins,
  Star,
  Zap,
  X,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Crown,
  Flame,
  Diamond,
} from "lucide-react";
import { useCoin } from "../context/CoinProvider";
import { useNavigate } from "react-router-dom";

interface SpinResult {
  coins: number;
  message: string;
  requiresAd: boolean;
  color: string;
}

const SpinWheel: React.FC = () => {
  const navigate = useNavigate();
  const { coins, addCoins, watchAd, adsWatchedToday, maxAdsPerDay } = useCoin();
  const wheelRef = useRef<HTMLDivElement>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [spinsToday, setSpinsToday] = useState(0);
  const maxSpinsPerDay = 3;

  // Wheel segments with probabilities
  const wheelSegments = [
    { coins: 10, color: "#10B981", label: "10 Coins", probability: 50 }, // 50%
    { coins: 0, color: "#6B7280", label: "0 Coins", probability: 25 }, // 25%
    { coins: 20, color: "#F59E0B", label: "20 Coins", probability: 15 }, // 15%
    { coins: 0, color: "#6B7280", label: "Try Again", probability: 7 }, // 7%
    { coins: 50, color: "#EF4444", label: "50 Coins", probability: 3 }, // 3%
  ];

  useEffect(() => {
    // Check daily spin count from localStorage
    const today = new Date().toDateString();
    const lastSpinDate = localStorage.getItem("lastSpinDate");
    const savedSpinsToday = parseInt(localStorage.getItem("spinsToday") || "0");

    if (lastSpinDate === today) {
      setSpinsToday(savedSpinsToday);
      setHasSpunToday(savedSpinsToday >= maxSpinsPerDay);
    } else {
      // Reset for new day
      setSpinsToday(0);
      setHasSpunToday(false);
      localStorage.setItem("lastSpinDate", today);
      localStorage.setItem("spinsToday", "0");
    }
  }, []);

  const getRandomResult = (): SpinResult => {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const segment of wheelSegments) {
      cumulativeProbability += segment.probability;
      if (random <= cumulativeProbability) {
        if (segment.coins === 0) {
          return {
            coins: 0,
            message: "Better luck next time! 🍀",
            requiresAd: false,
            color: segment.color,
          };
        } else {
          return {
            coins: segment.coins,
            message: `Congratulations! You won ${segment.coins} coins! 🎉`,
            requiresAd: true,
            color: segment.color,
          };
        }
      }
    }

    // Fallback
    return {
      coins: 0,
      message: "Better luck next time! 🍀",
      requiresAd: false,
      color: "#6B7280",
    };
  };

  const spinWheel = () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    // Generate random rotation (3-5 full rotations + random angle)
    const randomRotation = 1080 + Math.random() * 720; // 3-5 full rotations

    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${randomRotation}deg)`;
    }

    // Show result after animation
    setTimeout(() => {
      const spinResult = getRandomResult();
      setResult(spinResult);
      setShowResult(true);
      setIsSpinning(false);

      // Update daily spin count
      const newSpinsToday = spinsToday + 1;
      setSpinsToday(newSpinsToday);
      localStorage.setItem("spinsToday", newSpinsToday.toString());

      if (newSpinsToday >= maxSpinsPerDay) {
        setHasSpunToday(true);
      }
    }, 3000);
  };

  const handleClaimReward = async () => {
    if (!result) return;

    if (result.requiresAd && result.coins > 0) {
      // Check if user can watch more ads
      if (adsWatchedToday >= maxAdsPerDay) {
        alert("You've reached your daily ad limit. Come back tomorrow!");
        return;
      }

      try {
        // Simulate watching ad
        await watchAd();
        // Add coins after ad
        await addCoins(result.coins);
        alert(`🎉 Great! You watched an ad and earned ${result.coins} coins!`);
        setShowResult(false);
        setResult(null);
      } catch (error) {
        alert("Failed to watch ad. Please try again.");
      }
    } else if (result.coins === 0) {
      // Offer to watch ad for 10 coins
      if (confirm("Watch an ad and win 10 coins instantly?")) {
        if (adsWatchedToday >= maxAdsPerDay) {
          alert("You've reached your daily ad limit. Come back tomorrow!");
          return;
        }

        try {
          await watchAd();
          await addCoins(10);
          alert("🎉 You watched an ad and earned 10 coins!");
          setShowResult(false);
          setResult(null);
        } catch (error) {
          alert("Failed to watch ad. Please try again.");
        }
      } else {
        setShowResult(false);
        setResult(null);
      }
    }
  };

  const resetDaily = () => {
    // For testing purposes - reset daily limit
    setSpinsToday(0);
    setHasSpunToday(false);
    localStorage.setItem("spinsToday", "0");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-200">
          <Coins className="h-5 w-5 text-yellow-600" />
          <span className="font-bold text-purple-800">{coins} Coins</span>
        </div>
      </div>

      {/* Main Card */}
      <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            🎰 Spin & Win! 🎰
          </CardTitle>
          <p className="text-purple-600 font-semibold">
            Spin the wheel and win up to 50 coins!
          </p>

          {/* Daily Spin Counter */}
          <div className="bg-purple-100 rounded-full px-4 py-2 mt-3">
            <div className="flex items-center gap-2 justify-center">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-purple-800 font-bold text-sm">
                Spins today: {spinsToday}/{maxSpinsPerDay}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Spinning Wheel */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Wheel Container */}
              <div
                ref={wheelRef}
                className={`w-64 h-64 rounded-full border-8 border-white shadow-2xl transition-all duration-3000 ease-out ${
                  isSpinning ? "animate-spin" : ""
                }`}
                style={{
                  background: `conic-gradient(
                    #10B981 0deg 180deg,
                    #6B7280 180deg 270deg,
                    #F59E0B 270deg 324deg,
                    #6B7280 324deg 349.2deg,
                    #EF4444 349.2deg 360deg
                  )`,
                }}
              >
                {/* Wheel Labels */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white font-bold text-lg drop-shadow-lg">
                      SPIN
                    </div>
                    <div className="text-white font-bold text-lg drop-shadow-lg">
                      TO WIN!
                    </div>
                  </div>
                </div>

                {/* Segment Labels positioned around the wheel */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm drop-shadow-lg">
                  10
                </div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white font-bold text-sm drop-shadow-lg">
                  0
                </div>
                <div className="absolute bottom-8 right-8 text-white font-bold text-sm drop-shadow-lg">
                  20
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm drop-shadow-lg">
                  0
                </div>
                <div className="absolute bottom-8 left-8 text-white font-bold text-sm drop-shadow-lg">
                  50
                </div>
              </div>

              {/* Pointer */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 z-10 drop-shadow-lg"></div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center">
            {hasSpunToday ? (
              <div className="space-y-3">
                <div className="bg-gray-100 text-gray-600 font-bold py-3 px-6 rounded-full">
                  Daily limit reached! Come back tomorrow!
                </div>
                <button
                  onClick={resetDaily}
                  className="text-xs text-purple-600 underline"
                >
                  Reset for testing
                </button>
              </div>
            ) : (
              <Button
                onClick={spinWheel}
                disabled={isSpinning}
                className={`px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isSpinning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:shadow-2xl"
                }`}
              >
                {isSpinning ? (
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 animate-spin" />
                    Spinning...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Spin the Wheel!
                  </div>
                )}
              </Button>
            )}
          </div>

          {/* Probability Info */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Your Chances:
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>10 Coins</span>
                <span className="font-semibold text-green-600">50%</span>
              </div>
              <div className="flex justify-between">
                <span>20 Coins</span>
                <span className="font-semibold text-yellow-600">15%</span>
              </div>
              <div className="flex justify-between">
                <span>50 Coins</span>
                <span className="font-semibold text-red-600">3%</span>
              </div>
              <div className="flex justify-between">
                <span>No coins</span>
                <span className="font-semibold text-gray-600">32%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Modal */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-white border-2 border-purple-200 shadow-3xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {result.coins > 0 ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-gray-500" />
                )}
              </div>
              <CardTitle className="text-xl font-bold">
                {result.coins > 0
                  ? `🎉 You Won ${result.coins} Coins! 🎉`
                  : "Better Luck Next Time! 🍀"}
              </CardTitle>
              <p className="text-gray-600">{result.message}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {result.requiresAd && result.coins > 0 ? (
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm font-medium">
                      🎬 Watch a short ad to claim your {result.coins} coins!
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleClaimReward}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Ad & Claim
                    </Button>
                    <Button
                      onClick={() => setShowResult(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              ) : result.coins === 0 ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm font-medium">
                      🎁 Watch an ad and win 10 coins instantly!
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleClaimReward}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Ad & Win 10 Coins
                    </Button>
                    <Button
                      onClick={() => setShowResult(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowResult(false)} className="w-full">
                  Close
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
