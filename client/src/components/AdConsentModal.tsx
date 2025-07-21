import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Shield, Eye, Coins, Crown, X } from 'lucide-react';

interface AdConsentModalProps {
  isOpen: boolean;
  onConsent: (consent: boolean) => void;
}

export default function AdConsentModal({ isOpen, onConsent }: AdConsentModalProps) {
  const [selectedOption, setSelectedOption] = useState<'ads' | 'premium' | null>(null);

  if (!isOpen) return null;

  const handleAcceptAds = () => {
    onConsent(true);
  };

  const handleDeclineAds = () => {
    onConsent(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">🔒 Privacy & Ads</h2>
          <p className="text-sm opacity-90">
            Help us keep AjnabiCam free for everyone
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              To provide our service for free, we show personalized ads. 
              You can choose how you want to experience AjnabiCam:
            </p>
          </div>

          {/* Option 1: Free with Ads */}
          <div 
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
              selectedOption === 'ads' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedOption('ads')}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  🆓 Free with Ads
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  See personalized ads to support our free service
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>✓ Free forever</p>
                  <p>✓ Earn coins by watching ads</p>
                  <p>✓ Minimal ads between video calls</p>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Premium (No Ads) */}
          <div 
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
              selectedOption === 'premium' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSelectedOption('premium')}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  👑 Premium (No Ads)
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Upgrade to Premium for an ad-free experience
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>✓ No ads ever</p>
                  <p>✓ Unlimited features</p>
                  <p>✓ Priority matching</p>
                  <p>✓ Exclusive filters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
            <p className="font-semibold mb-1">🔒 Your Privacy Matters</p>
            <p>
              We use cookies and collect limited data to show relevant ads. 
              No personal conversations are stored. You can change your preferences anytime in settings.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {selectedOption === 'ads' && (
              <Button
                onClick={handleAcceptAds}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >
                Continue with Ads
              </Button>
            )}
            
            {selectedOption === 'premium' && (
              <Button
                onClick={handleDeclineAds}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold"
              >
                Go Premium - No Ads
              </Button>
            )}

            {!selectedOption && (
              <div className="space-y-2">
                <Button
                  onClick={handleAcceptAds}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                >
                  Accept Ads & Continue Free
                </Button>
                <Button
                  onClick={handleDeclineAds}
                  variant="outline"
                  className="w-full py-3 rounded-xl font-semibold"
                >
                  No Ads - Show Premium Options
                </Button>
              </div>
            )}
          </div>

          {/* Legal Links */}
          <div className="text-center text-xs text-gray-500 space-x-4">
            <span className="hover:text-blue-600 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-blue-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
