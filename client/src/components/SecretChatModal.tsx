import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, EyeOff, Crown, X } from "lucide-react";

interface SecretChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: (enabled: boolean) => void;
  isEnabled: boolean;
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function SecretChatModal({ 
  isOpen, 
  onClose, 
  onToggle, 
  isEnabled, 
  isPremium, 
  onUpgrade 
}: SecretChatModalProps) {
  if (!isOpen) return null;

  const handleToggle = () => {
    if (!isPremium) {
      onUpgrade();
      return;
    }
    onToggle(!isEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm mx-auto bg-white border-2 border-purple-200 shadow-2xl">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 p-1"
          >
            <X size={20} />
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
              {isEnabled ? <EyeOff className="h-8 w-8 text-white" /> : <Eye className="h-8 w-8 text-white" />}
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold text-purple-700">
            Secret Chat Mode
          </CardTitle>
          
          {!isPremium && (
            <div className="flex items-center justify-center gap-1 bg-yellow-100 px-3 py-1 rounded-full mt-2">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-700 text-sm font-bold">Premium Only</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              {isEnabled 
                ? "Secret mode is ON. Messages will disappear after being read." 
                : "Enable secret mode to make messages disappear after reading."
              }
            </p>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">How it works:</h4>
              <ul className="text-sm text-purple-600 space-y-1">
                <li>• Messages disappear after 3 seconds</li>
                <li>• No message history is saved</li>
                <li>• Perfect for private conversations</li>
                <li>• Both users see the secret mode indicator</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleToggle}
              className={`w-full font-semibold py-3 rounded-xl shadow-md ${
                isPremium 
                  ? isEnabled 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isPremium}
            >
              {isPremium 
                ? isEnabled 
                  ? "Turn OFF Secret Mode" 
                  : "Turn ON Secret Mode"
                : "Upgrade to Premium"
              }
            </Button>
            
            {!isPremium && (
              <p className="text-xs text-center text-gray-500">
                Secret chat mode is a premium feature. Upgrade to unlock!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}