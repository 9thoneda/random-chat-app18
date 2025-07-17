import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Shield, Bell, User, Settings, Globe, Crown, Eye, EyeOff, Volume2, VolumeX, Smartphone, Lock, HelpCircle, Mail, MessageSquare } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingType: 'privacy' | 'notifications' | 'account' | 'general' | null;
}

export default function SettingsModal({ isOpen, onClose, settingType }: SettingsModalProps) {
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    allowDirectMessages: true,
    showLastSeen: false,
    allowScreenshots: false,
    blockUnknownUsers: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newMessages: true,
    friendRequests: true,
    systemUpdates: false,
    promotions: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    dataDownload: false,
    accountDeletion: false,
  });

  if (!isOpen || !settingType) return null;

  const renderPrivacySettings = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-blue-800">Privacy Controls</h4>
        </div>
        <p className="text-sm text-blue-600">Manage who can see your information and interact with you</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-green-600" />
            <div>
              <span className="font-medium text-gray-800">Show Online Status</span>
              <p className="text-xs text-gray-500">Let others see when you're online</p>
            </div>
          </div>
          <button
            onClick={() => setPrivacySettings(prev => ({ ...prev, showOnlineStatus: !prev.showOnlineStatus }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              privacySettings.showOnlineStatus ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              privacySettings.showOnlineStatus ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <div>
              <span className="font-medium text-gray-800">Allow Direct Messages</span>
              <p className="text-xs text-gray-500">Receive messages from other users</p>
            </div>
          </div>
          <button
            onClick={() => setPrivacySettings(prev => ({ ...prev, allowDirectMessages: !prev.allowDirectMessages }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              privacySettings.allowDirectMessages ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              privacySettings.allowDirectMessages ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <EyeOff className="h-5 w-5 text-purple-600" />
            <div>
              <span className="font-medium text-gray-800">Show Last Seen</span>
              <p className="text-xs text-gray-500">Display when you were last active</p>
            </div>
          </div>
          <button
            onClick={() => setPrivacySettings(prev => ({ ...prev, showLastSeen: !prev.showLastSeen }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              privacySettings.showLastSeen ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              privacySettings.showLastSeen ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-orange-600" />
            <div>
              <span className="font-medium text-gray-800">Allow Screenshots</span>
              <p className="text-xs text-gray-500">Let others take screenshots during calls</p>
            </div>
          </div>
          <button
            onClick={() => setPrivacySettings(prev => ({ ...prev, allowScreenshots: !prev.allowScreenshots }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              privacySettings.allowScreenshots ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              privacySettings.allowScreenshots ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-red-600" />
            <div>
              <span className="font-medium text-gray-800">Block Unknown Users</span>
              <p className="text-xs text-gray-500">Only allow friends to contact you</p>
            </div>
          </div>
          <button
            onClick={() => setPrivacySettings(prev => ({ ...prev, blockUnknownUsers: !prev.blockUnknownUsers }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              privacySettings.blockUnknownUsers ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              privacySettings.blockUnknownUsers ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold text-purple-800">Notification Preferences</h4>
        </div>
        <p className="text-sm text-purple-600">Choose what notifications you want to receive</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <div>
              <span className="font-medium text-gray-800">New Messages</span>
              <p className="text-xs text-gray-500">Get notified of new chat messages</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationSettings(prev => ({ ...prev, newMessages: !prev.newMessages }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              notificationSettings.newMessages ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              notificationSettings.newMessages ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-green-600" />
            <div>
              <span className="font-medium text-gray-800">Friend Requests</span>
              <p className="text-xs text-gray-500">Notifications for new friend requests</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationSettings(prev => ({ ...prev, friendRequests: !prev.friendRequests }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              notificationSettings.friendRequests ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              notificationSettings.friendRequests ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gray-600" />
            <div>
              <span className="font-medium text-gray-800">System Updates</span>
              <p className="text-xs text-gray-500">App updates and maintenance notices</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationSettings(prev => ({ ...prev, systemUpdates: !prev.systemUpdates }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              notificationSettings.systemUpdates ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              notificationSettings.systemUpdates ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-yellow-600" />
            <div>
              <span className="font-medium text-gray-800">Promotions</span>
              <p className="text-xs text-gray-500">Special offers and premium features</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationSettings(prev => ({ ...prev, promotions: !prev.promotions }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              notificationSettings.promotions ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              notificationSettings.promotions ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h5 className="font-semibold text-gray-800 mb-3">Sound & Vibration</h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Sound</span>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                className={`w-10 h-5 rounded-full transition-colors ${
                  notificationSettings.soundEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  notificationSettings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Vibration</span>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }))}
                className={`w-10 h-5 rounded-full transition-colors ${
                  notificationSettings.vibrationEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  notificationSettings.vibrationEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-4">
      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-red-600" />
          <h4 className="font-semibold text-red-800">Account Security</h4>
        </div>
        <p className="text-sm text-red-600">Manage your account security and data</p>
      </div>

      <div className="space-y-3">
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <h5 className="font-semibold text-yellow-800 mb-3">Data Management</h5>
          <div className="space-y-3">
            <Button
              onClick={() => {
                if (confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('🗑️ Account deletion request submitted. Your account will be deleted in 30 days. You can cancel this by logging in before then.');
                }
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const getModalContent = () => {
    switch (settingType) {
      case 'privacy':
        return {
          title: 'Privacy Settings',
          icon: <Shield className="h-6 w-6 text-blue-600" />,
          content: renderPrivacySettings()
        };
      case 'notifications':
        return {
          title: 'Notification Preferences',
          icon: <Bell className="h-6 w-6 text-purple-600" />,
          content: renderNotificationSettings()
        };
      case 'account':
        return {
          title: 'Account Settings',
          icon: <User className="h-6 w-6 text-red-600" />,
          content: renderAccountSettings()
        };
      default:
        return {
          title: 'Settings',
          icon: <Settings className="h-6 w-6 text-gray-600" />,
          content: <div>Settings content</div>
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-md mx-auto bg-white border-2 border-gray-200 shadow-3xl relative overflow-hidden my-4 min-h-fit max-h-[95vh]">
        <CardHeader className="text-center relative bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X size={22} />
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              {modalContent.icon}
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold text-gray-800">
            {modalContent.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {modalContent.content}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 rounded-xl"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}