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
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-rose-200">
      <CardHeader className="pb-2 sm:pb-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg px-3 sm:px-6 py-3 sm:py-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-rose-700">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          Gender Preference
          {!isPremium && (
            <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {genderOptions.map((option) => {
            const isLocked = !isPremium && option.id !== "any";

            return (
              <Button
                key={option.id}
                variant={selectedGender === option.id ? "default" : "outline"}
                className={`justify-start h-auto p-4 rounded-xl transition-all duration-200 ${
                  selectedGender === option.id
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg transform scale-105 border-rose-500"
                    : "hover:bg-rose-50 border-rose-200"
                } ${isLocked ? "opacity-60" : ""}`}
                onClick={() => handleGenderChange(option.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl">{option.emoji}</span>
                  <div className="text-left flex-1">
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs opacity-75">
                      {option.description}
                    </div>
                  </div>
                  {isLocked && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
              </Button>
            );
          })}
        </div>

        {!isPremium && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl text-center border border-purple-300">
            <p className="text-sm text-purple-700 mb-3 font-medium">
              🎯 Unlock gender filtering with Premium!
            </p>
            <Button
              size="sm"
              onClick={onUpgrade}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-6 shadow-md transform hover:scale-105 transition-all duration-200"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
