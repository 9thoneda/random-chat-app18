# 🎯 AjnabiCam Ad Integration Guide

## Overview
This guide explains how to integrate advertisements into your AjnabiCam video chat application. The system supports multiple ad types with privacy compliance and premium ad-free options.

## 🚀 Quick Start

### 1. Set Up Environment Variables
Create a `.env` file in your `client` directory:

```env
# Google AdSense Configuration
VITE_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXXX
VITE_ADSENSE_BANNER_ID=1234567890
VITE_ADSENSE_INTERSTITIAL_ID=1234567891
VITE_ADSENSE_REWARDED_ID=1234567892
VITE_ADSENSE_NATIVE_ID=1234567893

# Optional: Custom ad network URLs
VITE_CUSTOM_AD_NETWORK_URL=https://your-ad-network.com/api
```

### 2. Get Your Google AdSense Publisher ID
1. Sign up for Google AdSense at https://www.google.com/adsense/
2. Add your website domain
3. Get approved (this can take 24-48 hours)
4. Create ad units for each type:
   - **Banner Ads**: For homepage and between content
   - **Interstitial Ads**: Full-screen ads between video calls
   - **Rewarded Video Ads**: Users watch to earn coins
   - **Native Ads**: Ads that blend with your content

### 3. Update Configuration
Replace the placeholder values in `client/src/lib/adService.ts`:

```typescript
private defaultConfig: AdConfig = {
  publisherId: 'ca-pub-YOUR_ACTUAL_PUBLISHER_ID', // Replace this
  adUnitIds: {
    banner: 'YOUR_BANNER_AD_UNIT_ID',
    interstitial: 'YOUR_INTERSTITIAL_AD_UNIT_ID', 
    rewarded: 'YOUR_REWARDED_AD_UNIT_ID',
    native: 'YOUR_NATIVE_AD_UNIT_ID'
  },
  testMode: process.env.NODE_ENV === 'development'
};
```

## 📱 Ad Types Implemented

### 1. Banner Ads
- **Location**: Home screen, profile pages
- **Size**: Responsive (adapts to screen size)
- **Revenue**: Low CPM but high volume
- **Component**: `BannerAd.tsx`

```tsx
import BannerAd from '../components/BannerAd';

// Usage
<BannerAd size="responsive" position="top" />
```

### 2. Interstitial Ads
- **Location**: Between video calls, app navigation
- **Format**: Full-screen overlay
- **Revenue**: High CPM, moderate volume
- **Hook**: `useInterstitialAd.ts`

```tsx
import { useInterstitialAd } from '../hooks/useInterstitialAd';

const { showOnVideoCallEnd } = useInterstitialAd();
// Automatically shows ads after video calls end
```

### 3. Rewarded Video Ads
- **Location**: Coin earning section, treasure chest
- **Reward**: 10 coins per completed view
- **Revenue**: Highest CPM, user-initiated
- **Component**: `RewardedAdButton.tsx`

```tsx
import RewardedAdButton from '../components/RewardedAdButton';

<RewardedAdButton 
  variant="premium"
  onRewardEarned={(amount) => console.log(`Earned ${amount} coins`)}
/>
```

### 4. Native Ads
- **Location**: Content feeds, between conversations
- **Format**: Matches app design
- **Revenue**: Medium CPM, good engagement

## 🔒 Privacy & Compliance

### GDPR/CCPA Compliance
The system includes:
- ✅ User consent collection
- ✅ Consent storage and expiration
- ✅ Privacy policy links
- ✅ Opt-out options

### User Consent Flow
1. First-time users see consent modal
2. Choice between free with ads or premium without ads
3. Consent stored locally for 1 year
4. Can be revoked in settings

## 💰 Monetization Strategy

### Ad Frequency
- **Banner Ads**: Always visible for non-premium users
- **Interstitial Ads**: Max 1 every 2 minutes, 6 per session
- **Rewarded Ads**: User-initiated, no limits
- **Native Ads**: Mixed with content, 1 per page

### Premium Incentives
- No ads at all
- Priority matching
- Exclusive features
- Unlimited video calls

### Revenue Optimization
1. **A/B Test Ad Placements**: Track which positions perform better
2. **Optimize Ad Timing**: Show ads when users are most engaged
3. **Balance UX and Revenue**: Don't oversaturate with ads
4. **Premium Conversion**: Use ads to drive premium subscriptions

## 🛠️ Technical Implementation

### Ad Service Architecture
```
AdService (Singleton)
├── Google AdSense Integration
├── Ad Blocker Detection
├── Consent Management
├── Analytics Tracking
└── Fallback Systems
```

### Key Features
- **Ad Blocker Detection**: Graceful degradation when ads are blocked
- **Fallback Content**: Shows placeholder ads in development
- **Performance Monitoring**: Tracks ad load times and success rates
- **User Experience**: Respects premium users, limits ad frequency

### Integration Points
1. **App.tsx**: Ad service initialization and consent
2. **Home.tsx**: Banner ads and rewarded ad promotions
3. **VideoChat.tsx**: Interstitial ads after calls
4. **TreasureChest.tsx**: Rewarded ads for coin earning

## 📊 Analytics & Metrics

### Track These KPIs
- **Ad Revenue**: Daily/monthly ad earnings
- **Fill Rate**: Percentage of ad requests filled
- **Click-Through Rate**: User engagement with ads
- **Premium Conversion**: Users upgrading to remove ads
- **User Retention**: Impact of ads on user retention

### Implementation
```typescript
// Track ad events
adService.trackAdEvent('shown', 'banner');
adService.trackAdEvent('clicked', 'interstitial');
adService.trackAdEvent('rewarded', 'video');

// Get metrics
const metrics = adService.getMetrics();
console.log('Ads shown today:', metrics.adsShown);
```

## 🎯 Best Practices

### User Experience
1. **Never interrupt video calls** with ads
2. **Respect user preferences** - honor premium subscriptions
3. **Smooth transitions** - don't jarring ad appearances
4. **Clear labeling** - mark ads as "Advertisement"
5. **Relevant content** - use targeting for better user experience

### Revenue Optimization
1. **Strategic placement** - high-visibility areas
2. **Appropriate timing** - natural break points
3. **Premium upselling** - use ads to promote ad-free experience
4. **A/B testing** - continuously optimize placements

### Technical Considerations
1. **Lazy loading** - don't slow down app startup
2. **Error handling** - graceful fallbacks when ads fail
3. **Ad blocker support** - alternative monetization for blocked users
4. **Performance monitoring** - ensure ads don't hurt app performance

## 🚨 Common Issues & Solutions

### Ad Not Showing
1. Check AdSense approval status
2. Verify ad unit IDs are correct
3. Ensure domain is approved in AdSense
4. Check for ad blocker interference

### Low Revenue
1. Optimize ad placements for visibility
2. Increase premium conversion rate
3. Implement better targeting
4. A/B test different ad formats

### User Complaints
1. Reduce ad frequency
2. Improve ad relevance
3. Make premium more attractive
4. Better consent flow explanation

## 📈 Scaling & Advanced Features

### Future Enhancements
- **Header Bidding**: Multiple ad networks competing
- **Video Ads**: Pre-roll ads before video calls
- **Sponsored Content**: Branded virtual backgrounds
- **Affiliate Marketing**: Partner with relevant services
- **Dynamic Pricing**: Premium subscription based on ad exposure

### Alternative Ad Networks
- **Google AdMob**: For mobile apps
- **Facebook Audience Network**: Social targeting
- **Unity Ads**: Gaming-focused (if adding games)
- **Custom Networks**: Direct partnerships

## 📞 Support & Contact

### Getting Help
- AdSense Help Center: https://support.google.com/adsense
- Community Forums: https://support.google.com/adsense/community
- Direct Support: Available for high-volume publishers

### Implementation Support
If you need help implementing these features:
1. Check the code comments in each component
2. Review the TypeScript interfaces for configuration options
3. Test in development mode first (uses mock ads)
4. Monitor browser console for error messages

---

**Ready to monetize your video chat app! 🚀💰**

Remember: The key to successful ad integration is balancing user experience with revenue generation. Start conservative and optimize based on user feedback and analytics.
