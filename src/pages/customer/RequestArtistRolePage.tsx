import React, { useState } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Music, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RequestArtistRole: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    artistName: '',
    region: '',
    city: '',
    roles: [] as string[],
    instagram: '',
    spotify: '',
    additionalInfo: '',
  });

  const artistRoles = [
    'Producer',
    'Beatmaker',
    'Engineer',
    'Rapper',
    'Singer/Vocalist',
    'Songwriter',
  ];

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'artistRoleRequests'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Customer',
        artistName: formData.artistName,
        region: formData.region,
        city: formData.city,
        roles: formData.roles,
        instagram: formData.instagram,
        spotify: formData.spotify,
        additionalInfo: formData.additionalInfo,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      alert('✅ Artist role request submitted! Admin will review it soon.');
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Failed to submit artist role request:', error);
      alert('❌ Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
              <Music size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Request Artist Role</h1>
          <p className="text-gray-400">
            Apply to become an artist on the Jonna Rincon platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
          {/* Artist Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artist Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.artistName}
              onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
              placeholder="Your stage/artist name"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Region <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="e.g., North Holland"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Amsterdam"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Artist Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              What do you do? <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {artistRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`p-3 rounded-lg border transition ${
                    formData.roles.includes(role)
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-purple-500'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            {formData.roles.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">Select at least one role</p>
            )}
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@yourhandle or full URL"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Spotify Link
              </label>
              <input
                type="text"
                value={formData.spotify}
                onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
                placeholder="Your Spotify profile URL"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Information
            </label>
            <textarea
              rows={4}
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              placeholder="Tell us more about your music, experience, or why you want to join..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || formData.roles.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-4 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Submitting...</>
            ) : (
              <>
                <Send size={20} />
                Submit Application
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
          <p className="text-sm text-blue-200">
            💡 <strong>What happens next?</strong> Your application will be reviewed by our admin team.
            We'll notify you via email once your request has been processed.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default RequestArtistRole;
