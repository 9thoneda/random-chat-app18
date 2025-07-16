import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Crown, X, Check } from "lucide-react";

interface WallpaperSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (wallpaper: string) => void;
  currentWallpaper: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

const wallpapers = [
  { id: 'default', name: 'Default', gradient: 'from-white to-gray-50' },
  { id: 'sunset', name: 'Sunset', gradient: 'from-orange-200 to-pink-200' },
  { id: 'ocean', name: 'Ocean', gradient: 'from-blue-200 to-cyan-200' },
  { id: 'forest', name: 'Forest', gradient: 'from-green-200 to-emerald-200' },
  { id: 'lavender', name: 'Lavender', gradient: 'from-purple-200 to-pink-200' },
  { id: 'mint', name: 'Mint', gradient: 'from-teal-200 to-green-200' },
  { id: 'rose', name: 'Rose', gradient: 'from-rose-200 to-pink-200' },
  { id: 'cosmic', name: 'Cosmic', gradient: 'from-indigo-200 to-purple-200' },
];

export default function WallpaperSelector({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentWallpaper, 
  isPremium, 
  onUpgrade 
}: WallpaperSelectorProps) {
  if (!isOpen) return null;

  const handleSelect = (wallpaperId: string) => {
    if (!isPremium && wallpaperId !== 'default') {
      onUpgrade();
      return;
    }
    onSelect(wallpaperId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto bg-white border-2 border-purple-200 shadow-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 p-1"
          >
            <X size={20} />
          </Button>
          
          <CardTitle className="text-xl font-bold text-purple-700">
            Chat Wallpapers
          </CardTitle>
          
          {!isPremium && (
            <div className="flex items-center justify-center gap-1 bg-yellow-100 px-3 py-1 rounded-full mt-2">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-700 text-sm font-bold">Premium Feature</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4 overflow-y-auto max-h-96">
          <div className="grid grid-cols-2 gap-3">
            {wallpapers.map((wallpaper) => {
              const isLocked = !isPremium && wallpaper.id !== 'default';
              const isSelected = currentWallpaper === wallpaper.id;
              
              return (
                <div
                  key={wallpaper.id}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'border-purple-500 shadow-lg' 
                      : 'border-gray-200 hover:border-purple-300'
                  } ${isLocked ? 'opacity-60' : ''}`}
                  onClick={() => {
                    handleSelect(wallpaper.id);
                    if (isPremium || wallpaper.id === 'default') {
                      onClose();
                    }
                  }}
                >
                  <div className={`h-20 rounded-t-lg bg-gradient-to-br ${wallpaper.gradient} relative overflow-hidden`}>
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Crown className="h-6 w-6 text-yellow-500" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-center">
                    <span className="text-sm font-medium text-gray-700">{wallpaper.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {!isPremium && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-center border border-purple-200">
              <p className="text-sm text-purple-700 mb-3 font-medium">
                🎨 Unlock beautiful wallpapers with Premium!
              </p>
              <Button
                size="sm"
                onClick={onUpgrade}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-6"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}