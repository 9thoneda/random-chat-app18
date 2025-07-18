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
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      id: "male",
      label: "Male",
      icon: User,
      description: "Connect with males only",
      emoji: "👨",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50 hover:bg-cyan-100",
    },
    {
      id: "female",
      label: "Female",
      icon: User,
      description: "Connect with females only",
      emoji: "👩",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50 hover:bg-pink-100",
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
        {/* Gender Options - Enhanced Design */}
        <div className="space-y-4">
          {genderOptions.map((option, index) => {
            const isLocked = !isPremium && option.id !== "any";
            const isSelected = selectedGender === option.id;

            return (
              <div
                key={option.id}
                className={`relative group transform transition-all duration-500 hover:scale-102 ${
                  isSelected ? "scale-105 z-10" : ""
                } animate-slide-in`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Glow Effect Background */}
                {isSelected && (
                  <div className="absolute -inset-3 bg-gradient-to-r from-rose-400/30 via-pink-400/30 to-purple-400/30 rounded-3xl blur-xl animate-pulse"></div>
                )}

                <Button
                  variant="ghost"
                  className={`w-full h-auto p-6 rounded-3xl transition-all duration-500 border-3 relative overflow-hidden group ${
                    isSelected
                      ? `bg-gradient-to-r ${option.color} text-white shadow-2xl border-white/50 animate-pulse-glow`
                      : `${option.bgColor} border-gray-200 hover:border-gray-300 hover:shadow-xl group-hover:shadow-2xl`
                  } ${isLocked ? "opacity-75" : ""}`}
                  onClick={() => handleGenderChange(option.id)}
                >
                  {/* Shimmer Animation for Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                  )}

                  <div className="flex items-center gap-6 w-full relative z-10">
                    {/* Extra Large Avatar/Emoji */}
                    <div className="relative">
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-500 ${
                          isSelected
                            ? "bg-white/20 backdrop-blur-md shadow-2xl animate-bounce"
                            : "bg-white/80 group-hover:bg-white shadow-lg group-hover:shadow-xl"
                        }`}
                      >
                        {option.emoji}
                      </div>

                      {/* Animated Ring for Selected */}
                      {isSelected && (
                        <>
                          <div className="absolute -inset-3 border-3 border-white/50 rounded-full animate-ping"></div>
                          <div className="absolute -inset-1 border-2 border-white/80 rounded-full animate-pulse"></div>
                        </>
                      )}

                      {/* Hover Ring */}
                      <div className="absolute -inset-2 border-2 border-transparent group-hover:border-gray-300 rounded-full transition-all duration-300"></div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="text-left flex-1">
                      <div
                        className={`text-xl font-bold mb-2 transition-all duration-300 ${
                          isSelected
                            ? "text-white drop-shadow-lg"
                            : "text-gray-800 group-hover:text-gray-900"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div
                        className={`text-sm font-medium transition-all duration-300 ${
                          isSelected
                            ? "text-white/90"
                            : "text-gray-600 group-hover:text-gray-700"
                        }`}
                      >
                        {option.description}
                      </div>
                    </div>

                    {/* Lock Icon with Animation */}
                    {isLocked && (
                      <div className="p-3 bg-yellow-100 rounded-full shadow-lg animate-bounce">
                        <Crown className="h-6 w-6 text-yellow-600" />
                      </div>
                    )}

                    {/* Enhanced Selection Indicator */}
                    {isSelected && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="text-white text-xs font-bold">
                          Selected
                        </div>
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
