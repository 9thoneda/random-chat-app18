import BannerAd from './components/BannerAd';
import RewardedAdButton from './components/RewardedAdButton';

export default function WorkingApp() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
          🎯 AjnabiCam - AdMob Ready!
        </h1>
        
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#27ae60' }}>✅ AdMob Account Approved!</h2>
          <p>Your app is ready to start earning money. Follow these steps:</p>
          
          <ol style={{ lineHeight: '1.8' }}>
            <li><strong>Get your AdMob ad unit IDs</strong> from: https://apps.admob.com/</li>
            <li><strong>Create .env file</strong> with your real IDs</li>
            <li><strong>Test the ads below</strong> to see them working</li>
            <li><strong>Deploy and start earning!</strong></li>
          </ol>
        </div>

        {/* Banner Ad Test */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>📱 Banner Ad (Test)</h3>
          <BannerAd size="responsive" />
          <p style={{ fontSize: '14px', color: '#666' }}>
            This will show real ads once you add your AdMob ad unit IDs
          </p>
        </div>

        {/* Rewarded Ad Test */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>💰 Rewarded Ad (Test)</h3>
          <RewardedAdButton 
            onRewardEarned={(amount) => alert(`Earned ${amount} coins!`)}
          />
          <p style={{ fontSize: '14px', color: '#666' }}>
            Users watch ads to earn coins - high revenue potential!
          </p>
        </div>

        {/* Revenue Info */}
        <div style={{ 
          backgroundColor: '#e8f5e8',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#2d8a3e' }}>💰 Revenue Potential</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>$1-5</div>
              <div style={{ fontSize: '14px' }}>Daily (1K users)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>$30-150</div>
              <div style={{ fontSize: '14px' }}>Monthly (1K users)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>$300-1500</div>
              <div style={{ fontSize: '14px' }}>Monthly (10K users)</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => window.open('https://apps.admob.com/', '_blank')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🚀 Open AdMob Dashboard
          </button>
          
          <button 
            onClick={() => alert('1. Get your ad unit IDs from AdMob dashboard\\n2. Create .env file with your real IDs\\n3. Restart server\\n4. Start earning!')}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📋 Setup Instructions
          </button>
        </div>

        <div style={{ 
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <strong>🎉 You're ready to make money!</strong><br />
          Your AdMob account is approved and the ad system is built. 
          Just add your real ad unit IDs and start earning revenue today!
        </div>
      </div>
    </div>
  );
}
