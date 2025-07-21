import { useCallback, useRef } from 'react';
import { adService } from '../lib/adService';
import { usePremium } from '../context/PremiumProvider';

interface InterstitialAdOptions {
  minTimeBetweenAds?: number; // Minimum time in seconds between ads
  maxAdsPerSession?: number;  // Maximum ads per session
  showOnCallEnd?: boolean;    // Show ad when video call ends
  showOnAppStart?: boolean;   // Show ad when app starts
}

export function useInterstitialAd(options: InterstitialAdOptions = {}) {
  const { isPremium } = usePremium();
  const lastAdTimeRef = useRef<number>(0);
  const adsShownRef = useRef<number>(0);
  
  const {
    minTimeBetweenAds = 180, // 3 minutes default
    maxAdsPerSession = 8,    // Max 8 ads per session
    showOnCallEnd = true,
    showOnAppStart = false
  } = options;

  const canShowAd = useCallback((): boolean => {
    // Don't show ads to premium users
    if (isPremium) {
      console.log('🔒 Premium user - skipping interstitial ad');
      return false;
    }

    // Check session limits
    if (adsShownRef.current >= maxAdsPerSession) {
      console.log('📊 Max ads per session reached');
      return false;
    }

    // Check time between ads
    const now = Date.now();
    const timeSinceLastAd = (now - lastAdTimeRef.current) / 1000;
    
    if (timeSinceLastAd < minTimeBetweenAds) {
      console.log(`⏰ Too soon for next ad (${Math.round(minTimeBetweenAds - timeSinceLastAd)}s remaining)`);
      return false;
    }

    return true;
  }, [isPremium, minTimeBetweenAds, maxAdsPerSession]);

  const showAd = useCallback(async (trigger: string): Promise<boolean> => {
    if (!canShowAd()) {
      return false;
    }

    try {
      console.log(`🎬 Showing interstitial ad (trigger: ${trigger})`);
      
      const success = await adService.showInterstitialAd();
      
      if (success) {
        lastAdTimeRef.current = Date.now();
        adsShownRef.current += 1;
        adService.trackAdEvent('shown', 'interstitial');
        
        console.log(`✅ Interstitial ad shown successfully (${adsShownRef.current}/${maxAdsPerSession})`);
        return true;
      } else {
        console.log('❌ Interstitial ad failed to show');
        return false;
      }
    } catch (error) {
      console.error('🚨 Interstitial ad error:', error);
      return false;
    }
  }, [canShowAd, maxAdsPerSession]);

  // Specific trigger methods
  const showOnVideoCallEnd = useCallback(() => {
    if (showOnCallEnd) {
      return showAd('call_end');
    }
    return Promise.resolve(false);
  }, [showAd, showOnCallEnd]);

  const showOnAppLaunch = useCallback(() => {
    if (showOnAppStart) {
      return showAd('app_start');
    }
    return Promise.resolve(false);
  }, [showAd, showOnAppStart]);

  const showOnNavigation = useCallback((route: string) => {
    return showAd(`navigation_${route}`);
  }, [showAd]);

  const showOnAction = useCallback((action: string) => {
    return showAd(`action_${action}`);
  }, [showAd]);

  // Get current ad session info
  const getAdInfo = useCallback(() => ({
    adsShownThisSession: adsShownRef.current,
    maxAdsPerSession,
    canShowAd: canShowAd(),
    timeSinceLastAd: lastAdTimeRef.current ? (Date.now() - lastAdTimeRef.current) / 1000 : 0,
    timeUntilNextAd: Math.max(0, minTimeBetweenAds - ((Date.now() - lastAdTimeRef.current) / 1000)),
    isPremiumUser: isPremium
  }), [canShowAd, maxAdsPerSession, minTimeBetweenAds, isPremium]);

  return {
    showAd,
    showOnVideoCallEnd,
    showOnAppLaunch,
    showOnNavigation,
    showOnAction,
    canShowAd,
    getAdInfo
  };
}
