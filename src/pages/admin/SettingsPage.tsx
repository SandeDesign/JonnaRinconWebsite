import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Store, Globe, Bell, Shield, Database, Save } from 'lucide-react';
import { settingsService, ShopSettings, GeneralSettings, NotificationSettings, SecuritySettings } from '../../lib/firebase/services/settingsService';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shop' | 'general' | 'notifications' | 'security'>('shop');
  const [loading, setLoading] = useState(true);
  const [shopSettings, setShopSettings] = useState<ShopSettings>({
    storeName: '',
    storeDescription: '',
    heroTitle: '',
    heroSubtitle: '',
    featuredEnabled: true,
    trendingEnabled: true,
    genres: [],
    currency: 'EUR',
    taxRate: 21,
    enableDownloads: true,
    watermarkPreviews: true,
  });

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    platformName: '',
    supportEmail: '',
    websiteUrl: '',
    timezone: 'Europe/Amsterdam',
    language: 'en',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailOrderNotifications: true,
    emailCollaborationNotifications: true,
    emailAnalyticsReports: false,
    emailSecurityAlerts: true,
    emailNewFeatures: false,
    pushNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    passwordMinLength: 12,
    sessionTimeout: 30,
    enableAutoBackup: true,
    backupFrequency: 'daily',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const [shopData, generalData, notificationData, securityData] = await Promise.all([
          settingsService.getShopSettings(),
          settingsService.getGeneralSettings(),
          settingsService.getNotificationSettings(),
          settingsService.getSecuritySettings(),
        ]);

        if (shopData) setShopSettings(shopData);
        if (generalData) setGeneralSettings(generalData);
        if (notificationData) setNotificationSettings(notificationData);
        if (securityData) setSecuritySettings(securityData);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveShopSettings = async () => {
    try {
      await settingsService.saveShopSettings(shopSettings);
      setMessage({ type: 'success', text: 'Shop settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save shop settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    }
  };

  const handleSaveGeneralSettings = async () => {
    try {
      await settingsService.saveGeneralSettings(generalSettings);
      setMessage({ type: 'success', text: 'General settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save general settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      await settingsService.saveNotificationSettings(notificationSettings);
      setMessage({ type: 'success', text: 'Notification settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      await settingsService.saveSecuritySettings(securitySettings);
      setMessage({ type: 'success', text: 'Security settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save security settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    }
  };

  const tabs = [
    { id: 'shop' as const, name: 'Shop Settings', icon: Store },
    { id: 'general' as const, name: 'General', icon: Globe },
    { id: 'notifications' as const, name: 'Notifications', icon: Bell },
    { id: 'security' as const, name: 'Security', icon: Shield },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your platform configuration and preferences</p>
        </div>

        {loading && (
          <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
            <p className="text-blue-300">Loading settings...</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-900/20 border-green-700 text-green-400'
                : 'bg-red-900/20 border-red-700 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Shop Settings Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            {/* Store Information */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Store size={24} className="text-purple-400" />
                Store Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={shopSettings.storeName}
                    onChange={(e) =>
                      setShopSettings({ ...shopSettings, storeName: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Store Description
                  </label>
                  <textarea
                    value={shopSettings.storeDescription}
                    onChange={(e) =>
                      setShopSettings({ ...shopSettings, storeDescription: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={shopSettings.heroTitle}
                      onChange={(e) =>
                        setShopSettings({ ...shopSettings, heroTitle: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hero Subtitle
                    </label>
                    <input
                      type="text"
                      value={shopSettings.heroSubtitle}
                      onChange={(e) =>
                        setShopSettings({ ...shopSettings, heroSubtitle: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Features */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Shop Features</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Featured Beats</p>
                    <p className="text-sm text-gray-400">Show featured badge on selected beats</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopSettings.featuredEnabled}
                      onChange={(e) =>
                        setShopSettings({ ...shopSettings, featuredEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Trending Beats</p>
                    <p className="text-sm text-gray-400">Show trending badge on popular beats</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopSettings.trendingEnabled}
                      onChange={(e) =>
                        setShopSettings({ ...shopSettings, trendingEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Enable Downloads</p>
                    <p className="text-sm text-gray-400">Allow customers to download purchased beats</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopSettings.enableDownloads}
                      onChange={(e) =>
                        setShopSettings({ ...shopSettings, enableDownloads: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Watermark Previews</p>
                    <p className="text-sm text-gray-400">Add watermark to preview audio files</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shopSettings.watermarkPreviews}
                      onChange={(e) =>
                        setShopSettings({ ...shopSettings, watermarkPreviews: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Settings */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Payment Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={shopSettings.currency}
                    onChange={(e) =>
                      setShopSettings({ ...shopSettings, currency: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={shopSettings.taxRate}
                    onChange={(e) =>
                      setShopSettings({ ...shopSettings, taxRate: parseFloat(e.target.value) })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveShopSettings}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
              >
                <Save size={20} />
                Save Shop Settings
              </button>
            </div>
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe size={24} className="text-blue-400" />
                General Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={generalSettings.platformName}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, platformName: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={generalSettings.websiteUrl}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, websiteUrl: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Europe/Amsterdam">Europe/Amsterdam</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="America/Los_Angeles">America/Los_Angeles</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, language: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="nl">Dutch</option>
                      <option value="de">German</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveGeneralSettings}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
              >
                <Save size={20} />
                Save General Settings
              </button>
            </div>
          </div>
        )}

        {/* Notifications Settings Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Bell size={24} className="text-yellow-400" />
                Notification Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Email on New Orders</p>
                    <p className="text-sm text-gray-400">Get notified when customers place orders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailOrderNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailOrderNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Email on Collaborations</p>
                    <p className="text-sm text-gray-400">Get notified about collaboration requests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailCollaborationNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailCollaborationNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Email Analytics Reports</p>
                    <p className="text-sm text-gray-400">Receive weekly analytics reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailAnalyticsReports}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailAnalyticsReports: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Email Security Alerts</p>
                    <p className="text-sm text-gray-400">Important security notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailSecurityAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailSecurityAlerts: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Email New Features</p>
                    <p className="text-sm text-gray-400">Learn about new features and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNewFeatures}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNewFeatures: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-sm text-gray-400">Receive browser push notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotificationSettings}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
              >
                <Save size={20} />
                Save Notification Settings
              </button>
            </div>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield size={24} className="text-red-400" />
                Security Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-400">Require 2FA for admin accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorEnabled}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          twoFactorEnabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Password Length
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="8"
                      max="20"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordMinLength: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-white font-medium w-12 text-center">
                      {securitySettings.passwordMinLength}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Users will be logged out after this period of inactivity
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Enable Auto Backup</p>
                    <p className="text-sm text-gray-400">Automatically backup database daily</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableAutoBackup}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          enableAutoBackup: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={securitySettings.backupFrequency}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        backupFrequency: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
              <p className="text-sm text-blue-300">
                💡 <strong>Tip:</strong> Strong security settings protect your platform and user data. We recommend enabling 2FA and auto-backups.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveSecuritySettings}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
              >
                <Save size={20} />
                Save Security Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
