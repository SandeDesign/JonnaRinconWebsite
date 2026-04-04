import React, { useState, useEffect, useRef } from 'react';
import { X, Instagram, Music, Check, Download, ExternalLink } from 'lucide-react';
import { useFollowGate } from '../hooks/useFollowGate';
import { useAuth } from '../hooks/useAuth';
import { FollowGateCompletion } from '../lib/firebase/types';

interface FollowGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    type: 'remix' | 'track' | 'edit' | 'beat';
    title: string;
    artist: string;
    artworkUrl?: string;
    audioUrl?: string;
    downloadUrl?: string;
  };
  instagramUrl?: string;
  spotifyUrl?: string;
  onLoginRequired?: () => void;
}

export default function FollowGateModal({
  isOpen,
  onClose,
  product,
  instagramUrl = 'https://instagram.com/jonnarincon',
  spotifyUrl = 'https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F',
  onLoginRequired,
}: FollowGateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const { completeFollowGate, checkExistingAccess, loading } = useFollowGate();
  const [followedInstagram, setFollowedInstagram] = useState(false);
  const [followedSpotify, setFollowedSpotify] = useState(false);
  const [completion, setCompletion] = useState<FollowGateCompletion | null>(null);
  const [step, setStep] = useState<'follow' | 'complete'>('follow');

  // Check for existing access
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    checkExistingAccess(product.id).then(existing => {
      if (existing) {
        setCompletion(existing);
        setStep('complete');
      }
    });
  }, [isOpen, product.id, isAuthenticated]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div ref={modalRef} className="relative w-full max-w-md bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/[0.1] hover:bg-white/[0.15] rounded-full text-white/60 hover:text-white transition-all">
            <X size={18} />
          </button>
          <h3 className="text-xl font-bold text-white mb-3">Login Required</h3>
          <p className="text-white/50 text-sm mb-6">You need to be logged in to download free content.</p>
          <button
            onClick={() => { onClose(); onLoginRequired?.(); }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleFollowInstagram = () => {
    window.open(instagramUrl, '_blank');
    setFollowedInstagram(true);
  };

  const handleFollowSpotify = () => {
    window.open(spotifyUrl, '_blank');
    setFollowedSpotify(true);
  };

  const handleComplete = async () => {
    const result = await completeFollowGate({
      productId: product.id,
      productType: product.type,
      productTitle: product.title,
      artworkUrl: product.artworkUrl,
      audioUrl: product.audioUrl,
      downloadUrl: product.downloadUrl || product.audioUrl,
    });

    if (result) {
      setCompletion(result);
      setStep('complete');
    }
  };

  const canComplete = followedInstagram && followedSpotify;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div ref={modalRef} className="relative w-full max-w-md bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl overflow-hidden">
        {/* Header with artwork */}
        <div className="relative h-32 overflow-hidden">
          {product.artworkUrl ? (
            <img src={product.artworkUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/60 hover:text-white transition-all">
            <X size={18} />
          </button>
          <div className="absolute bottom-3 left-4">
            <p className="text-white/60 text-xs uppercase tracking-wider">Free Download</p>
            <h3 className="text-lg font-bold text-white">{product.title}</h3>
          </div>
        </div>

        <div className="p-6">
          {step === 'follow' ? (
            <>
              <p className="text-white/50 text-sm mb-6">
                Follow us on Instagram and Spotify to unlock this free download. Available for 30 days after completing.
              </p>

              {/* Step 1: Instagram */}
              <button
                onClick={handleFollowInstagram}
                className={`w-full flex items-center justify-between p-4 rounded-xl mb-3 transition-all ${
                  followedInstagram
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${followedInstagram ? 'bg-green-500/20' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                    {followedInstagram ? <Check size={20} className="text-green-400" /> : <Instagram size={20} className="text-white" />}
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-sm ${followedInstagram ? 'text-green-400' : 'text-white'}`}>
                      {followedInstagram ? 'Following on Instagram' : 'Follow on Instagram'}
                    </p>
                    <p className="text-white/30 text-xs">@jonnarincon</p>
                  </div>
                </div>
                {!followedInstagram && <ExternalLink size={16} className="text-white/30" />}
              </button>

              {/* Step 2: Spotify */}
              <button
                onClick={handleFollowSpotify}
                className={`w-full flex items-center justify-between p-4 rounded-xl mb-6 transition-all ${
                  followedSpotify
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${followedSpotify ? 'bg-green-500/20' : 'bg-green-600'}`}>
                    {followedSpotify ? <Check size={20} className="text-green-400" /> : <Music size={20} className="text-white" />}
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-sm ${followedSpotify ? 'text-green-400' : 'text-white'}`}>
                      {followedSpotify ? 'Following on Spotify' : 'Follow on Spotify'}
                    </p>
                    <p className="text-white/30 text-xs">Jonna Rincon</p>
                  </div>
                </div>
                {!followedSpotify && <ExternalLink size={16} className="text-white/30" />}
              </button>

              {/* Complete Button */}
              <button
                onClick={handleComplete}
                disabled={!canComplete || loading}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  canComplete
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : canComplete ? 'Unlock Download' : 'Complete all steps above'}
              </button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Download Unlocked!</h3>
                <p className="text-white/50 text-sm">
                  Available for 30 days. You can find this in your My Products page.
                </p>
              </div>

              {/* Download Button */}
              {(completion?.downloadUrl || product.downloadUrl || product.audioUrl) && (
                <a
                  href={completion?.downloadUrl || product.downloadUrl || product.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Now
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 mt-3 bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white rounded-xl font-bold transition-all"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
