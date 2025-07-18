import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, User, Crown } from "lucide-react";

interface GenderFilterProps {
  isPremium: boolean;
  onGenderSelect: (gender: string) => void;
  onUpgrade: () => void;
}

export default function GenderFilter({
  isPremium,
  onGenderSelect,
  onUpgrade,
}: GenderFilterProps) {
  const [selectedGender, setSelectedGender] = useState<string>("any");

  const genderOptions = [
    {
      id: "any",
      label: "Anyone",
      icon: Users,
      description: "Connect with all genders",
      emoji: "👥",
    },
    {
      id: "male",
      label: "Male",
      icon: User,
      description: "Connect with males only",
      emoji: "👨",
    },
    {
      id: "female",
      label: "Female",
      icon: User,
      description: "Connect with females only",
      emoji: "👩",
    },
  ];

  const handleGenderChange = (gender: string) => {
    if (!isPremium && gender !== "any") {
      onUpgrade();
      return;
    }
    setSelectedGender(gender);
    onGenderSelect(gender);
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl border-rose-200 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg px-4 py-4">
        <CardTitle className="text-lg flex items-center gap-2 text-rose-700">
          <div className="p-2 bg-rose-100 rounded-full">
            <Users className="h-5 w-5 text-rose-600" />
          </div>
          Gender Preference 💗
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Gender Options - Vertical Stack */}
        <div className="space-y-3">
          {genderOptions.map((option, index) => {
            const isLocked = !isPremium && option.id !== "any";
            const isSelected = selectedGender === option.id;

            return (
              <div
                key={option.id}
                className={`relative transform transition-all duration-300 hover:scale-105 ${
                  isSelected ? "scale-105" : ""
                } animate-slide-in`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <Button
                  variant="ghost"
                  className={`w-full h-auto p-4 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-2xl border-rose-400 glow-effect"
                      : "hover:bg-rose-50 border-rose-200 hover:border-rose-300 hover:shadow-lg"
                  } ${isLocked ? "opacity-70" : ""}`}
                  onClick={() => handleGenderChange(option.id)}
                >
                  {/* Animated Background for Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  )}

                  <div className="flex items-center gap-4 w-full relative z-10">
                    {/* Large Avatar/Emoji */}
                    <div
                      className={`relative transition-all duration-300 ${isSelected ? "animate-bounce" : ""}`}
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                          isSelected
                            ? "bg-white/20 backdrop-blur-sm shadow-lg"
                            : "bg-rose-100 hover:bg-rose-200"
                        } transition-all duration-300`}
                      >
                        {option.emoji}
                      </div>
                      {isSelected && (
                        <div className="absolute -inset-2 bg-white/30 rounded-full animate-ping"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="text-left flex-1">
                      <div
                        className={`text-lg font-bold mb-1 ${
                          isSelected ? "text-white" : "text-rose-800"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div
                        className={`text-sm ${
                          isSelected ? "text-white/90" : "text-rose-600"
                        }`}
                      >
                        {option.description}
                      </div>
                    </div>

                    {/* Lock Icon */}
                    {isLocked && (
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Crown className="h-5 w-5 text-yellow-600" />
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Premium Upsell Card - Standout Design */}
        {!isPremium && (
          <div className="mt-6 relative">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-rose-300/30 backdrop-blur-sm rounded-2xl"></div>

            {/* Main Card */}
            <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-5 rounded-2xl shadow-2xl border-2 border-white/50 overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

              {/* Glow Effects */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-70 animation-delay-500"></div>

              <div className="relative z-10 text-center text-white">
                <div className="mb-3">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    <Crown className="h-4 w-4 text-yellow-300" />
                    Premium Feature
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">
                  🎯 Unlock Gender Filtering!
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Choose exactly who you want to meet with premium gender
                  preferences
                </p>

                <Button
                  onClick={onUpgrade}
                  className="bg-white text-purple-600 hover:bg-white/90 font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-white/20"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now ✨
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
