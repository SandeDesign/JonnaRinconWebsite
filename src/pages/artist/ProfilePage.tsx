import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../lib/firebase/services/authService';
import ArtistLayout from '../../components/artist/ArtistLayout';
import { User, Mail, Lock, Save, LogOut } from 'lucide-react';

const ArtistProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await authService.updateUserProfile({ displayName });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      await authService.updateUserPassword(newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ArtistLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                {user?.displayName?.charAt(0)?.toUpperCase() || <User size={32} className="text-white" />}
              </div>
              <h3 className="font-bold text-xl text-white mb-1">{user?.displayName || 'Artist'}</h3>
              <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
              <div className="inline-block px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-xs font-semibold border border-orange-700">
                Artist Account
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {message && (
              <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
                {message.text}
              </div>
            )}

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Profile Information</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-orange-400 hover:text-orange-300 text-sm font-medium">
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <User size={16} className="inline mr-1" /> Display Name
                    </label>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" required />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Mail size={16} className="inline mr-1" /> Email
                    </label>
                    <input type="email" value={user?.email || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 opacity-50 cursor-not-allowed" disabled />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" disabled={loading}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-6 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                      <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => { setIsEditing(false); setDisplayName(user?.displayName || ''); }}
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-medium transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">Display Name</div>
                    <div className="font-semibold text-white">{user?.displayName || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Email</div>
                    <div className="font-semibold text-white">{user?.email}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
              <form onSubmit={handleUpdatePassword}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Lock size={16} className="inline mr-1" /> New Password
                  </label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                    placeholder="Enter new password" minLength={6} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Lock size={16} className="inline mr-1" /> Confirm New Password
                  </label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                    placeholder="Confirm new password" minLength={6} />
                </div>
                <button type="submit" disabled={loading || !newPassword || !confirmPassword}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-6 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                  <Save size={16} /> {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Account Actions</h2>
              <button onClick={handleSignOut}
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2">
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </ArtistLayout>
  );
};

export default ArtistProfile;
