import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './screens/HomePage';
import MediatedBannerAd from './components/MediatedBannerAd';
import MediatedRewardedAdButton from './components/MediatedRewardedAdButton';
import AdMobRevenueDashboard from './components/AdMobRevenueDashboard';

export default function MinimalApp() {
  const [showRevenueDashboard, setShowRevenueDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Revenue Dashboard Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowRevenueDashboard(!showRevenueDashboard)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
        >
          💰 Revenue Dashboard
        </button>
      </div>

      {showRevenueDashboard && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">AdMob Revenue Dashboard</h2>
              <button
                onClick={() => setShowRevenueDashboard(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <AdMobRevenueDashboard />
          </div>
        </div>
      )}

      {/* Main App Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎯 AjnabiCam - AdMob Mediation Ready!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your app is now equipped with premium ad mediation for maximum revenue
          </p>
        </div>

        {/* Ad Showcase Section */}
        <div className="space-y-8">
          {/* Banner Ad Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">📱 Banner Ads (AdMob Mediation)</h3>
            <MediatedBannerAd size="banner" />
            <p className="text-sm text-gray-600 mt-2">
              ✅ Multiple networks competing for highest eCPM
            </p>
          </div>

          {/* Rewarded Ad Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">💰 Rewarded Ads (Higher Payouts)</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <MediatedRewardedAdButton variant="default" />
              <MediatedRewardedAdButton variant="premium" />
              <MediatedRewardedAdButton variant="compact" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ✅ 10-15 coins per ad (varies by network performance)
            </p>
          </div>

          {/* Revenue Stats */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">💰 Revenue Potential</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">25-40%</div>
                <div className="text-sm opacity-90">Revenue Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">$3-8</div>
                <div className="text-sm opacity-90">eCPM Range</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">8+</div>
                <div className="text-sm opacity-90">Ad Networks</div>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">🚀 Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <span>Apply for AdMob account at https://admob.google.com/</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <span>Set up mediation networks (Facebook, Unity, AppLovin, etc.)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <span>Replace test IDs with your actual AdMob unit IDs</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <span>Deploy and start earning 25-40% more revenue!</span>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="font-semibold mb-3">🎯 Smart Mediation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Automatic network optimization</li>
                <li>✅ Real-time eCPM bidding</li>
                <li>✅ Fallback network support</li>
                <li>✅ Performance tracking</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="font-semibold mb-3">💡 Revenue Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Multiple ad formats</li>
                <li>✅ Geographic optimization</li>
                <li>✅ User behavior targeting</li>
                <li>✅ Premium conversion tools</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Routes for full app */}
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<div></div>} />
        </Routes>
      </div>
    </div>
  );
}
