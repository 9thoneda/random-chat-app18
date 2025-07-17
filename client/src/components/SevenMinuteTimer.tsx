import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Crown, Coins } from "lucide-react";
import { useCoin } from "../context/CoinProvider";
import { usePremium } from "../context/PremiumProvider";

interface SevenMinuteTimerProps {
  isConnected: boolean;
  onTimeUp: () => void;
  onUpgrade: () => void;
  onUseCoin: () => void;
}

export default function SevenMinuteTimer({ 
  isConnected, 
  onTimeUp, 
  onUpgrade, 
  onUseCoin 
}: SevenMinuteTimerProps) {
  const [timeLeft, setTimeLeft] = useState(7 * 60); // 7 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const { coins, deductCoins } = useCoin();
  const { isPremium } = usePremium();

  useEffect(() => {
    if (isConnected && !isPremium) {
      setIsActive(true);
      setTimeLeft(7 * 60); // Reset to 7 minutes for new session
    } else {
      setIsActive(false);
    }
  }, [isConnected, isPremium]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0 && !isPremium) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setShowTimeUpModal(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isPremium]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 180) return "text-green-600"; // > 3 minutes
    if (timeLeft > 60) return "text-yellow-600"; // > 1 minute
    return "text-red-600"; // < 1 minute
  };

  const handleUseCoin = async (): Promise<void> => {
    const success = await deductCoins(10);
    if (success) {
      setTimeLeft(7 * 60); // Reset timer
      setIsActive(true);
      setShowTimeUpModal(false);
      onUseCoin();
      alert("🎉 Timer extended! You have 7 more minutes.");
    } else {
      alert("❌ Not enough coins! You need 10 coins to continue.");
    }
  };

  const handleExit = () => {
    setShowTimeUpModal(false);
    onTimeUp();
  };

  if (isPremium || !isConnected) return null;

  return (
    <>
      <Card className="w-full max-w-md mx-auto mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-800">
                Free Time Left
              </span>
            </div>
            
            <div className={`font-mono text-xl font-bold ${getTimeColor()}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                timeLeft > 180 ? 'bg-green-500' :
                timeLeft > 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(timeLeft / (7 * 60)) * 100}%` }}
            />
          </div>
          
          {timeLeft < 120 && ( // Show warning when < 2 minutes left
            <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg text-center">
              <p className="text-sm text-orange-700 mb-2">
                ⏰ Time running out! Get ready to extend or upgrade.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⏰</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Time's up!
              </h2>
              <p className="text-gray-600 mb-4">
                You've used your 7-minute free limit
              </p>
              <p className="text-lg font-semibold text-purple-700">
                Want to continue chatting with this person?
              </p>
            </div>

            <div className="space-y-3">
              {/* Use Coins Option */}
              <Button
                onClick={handleUseCoin}
                disabled={coins < 10}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-md disabled:opacity-50"
              >
                <Coins className="h-5 w-5 mr-2" />
                Use 10 Coins ({coins} available)
              </Button>

              {/* Upgrade to Premium */}
              <Button
                onClick={() => {
                  setShowTimeUpModal(false);
                  onUpgrade();
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-md"
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Premium for Unlimited Time
              </Button>

              {/* Exit */}
              <Button
                onClick={handleExit}
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl"
              >
                Exit
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              💡 Tip: Watch ads or refer friends to earn more coins!
            </p>
          </div>
        </div>
      )}
    </>
  );
}