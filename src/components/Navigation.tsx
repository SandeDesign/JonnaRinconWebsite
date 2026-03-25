import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  isDarkOverlay?: boolean;
  isLightMode?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function Navigation({ cartItemCount = 0, onCartClick, isDarkOverlay = false, isLightMode = false, onMenuToggle }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { user, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Lock scroll when menu is open - improved state management
  useEffect(() => {
    const updateBodyScroll = () => {
      if (isMenuOpen && !isMenuClosing) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    };

    updateBodyScroll();
    onMenuToggle?.(isMenuOpen);

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen, isMenuClosing, onMenuToggle]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        await signIn(authEmail, authPassword);
      } else {
        if (authPassword.length < 6) {
          setAuthError('Password must be at least 6 characters');
          setAuthLoading(false);
          return;
        }
        await signUp(authEmail, authPassword, authName || undefined);
      }
      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      navigate('/customer/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Something went wrong');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'artist': return '/artist/dashboard';
      case 'user': return '/customer/dashboard';
      default: return '/login';
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setAuthError('');
  };

  const closeMenu = () => {
    setIsMenuClosing(true);
    closeTimeout.current = setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 500);
  };

  const openMenu = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsMenuClosing(false);
    setIsMenuOpen(true);
  };

  const handleCartClick = () => {
    closeMenu();
    onCartClick?.();
  };

  const handleMenuAuthClick = () => {
    closeMenu();
    if (user) {
      navigate(getDashboardLink());
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  // Determine nav colors based on context
  const useWhiteNav = isDarkOverlay && !isLightMode;
  const useBlackNav = isLightMode || !isDarkOverlay;

  const navTextColor = useWhiteNav ? 'text-white' : 'text-black';

  const menuItems: { label: string; subtitle: string; href?: string; action?: () => void }[] = [
    { label: 'BEAT SHOP', subtitle: 'Browse instrumentals', action: () => { closeMenu(); navigate('/shop/beats'); } },
    { label: 'MY TRACKS', subtitle: 'Full discography', action: () => { closeMenu(); navigate('/tracks'); } },
    { label: 'SOCIALS', subtitle: 'Follow the journey', action: () => { closeMenu(); navigate('/socials'); } },
    { label: 'CONTACT', subtitle: 'Get in touch', action: () => { closeMenu(); navigate('/contact'); } },
  ];

  const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/jonnarincon/' },
    { label: 'YouTube', href: 'https://www.youtube.com/jonnarincon' },
    { label: 'Spotify', href: 'https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F' },
    { label: 'SoundCloud', href: 'https://soundcloud.com/jonnarincon' },
  ];

  const menuVisible = isMenuOpen || isMenuClosing;

  return (
    <nav className="fixed top-0 left-0 right-0 z-30">
      {/* Top bar — logo left, MENU right */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
        {/* Logo — top-left */}
        <Link to="/" className="block flex-shrink-0">
          <div className="relative h-[120px] md:h-[160px]">
            <img
              src="/Jonna Rincon Logo BL.png"
              alt="Jonna Rincon"
              className="h-full w-auto transition-opacity duration-500"
              style={{ opacity: useWhiteNav ? 0 : 1 }}
            />
            <img
              src="/Jonna Rincon Logo WH.png"
              alt="Jonna Rincon"
              className="absolute top-0 left-0 h-full w-auto transition-opacity duration-500"
              style={{ opacity: useWhiteNav ? 1 : 0 }}
            />
          </div>
        </Link>

        {/* Right side — Cart + MENU */}
        <div className="flex items-center gap-5 md:gap-6">
          {/* Cart icon */}
          {onCartClick && cartItemCount > 0 && (
            <button
              onClick={onCartClick}
              className={`relative transition-all duration-300 hover:scale-110 cursor-pointer ${navTextColor}`}
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                {cartItemCount}
              </span>
            </button>
          )}

          {/* MENU button */}
          <button
            onClick={openMenu}
            className={`text-lg md:text-xl font-black uppercase tracking-[0.3em] transition-all duration-500 hover:opacity-60 cursor-pointer ${navTextColor}`}
          >
            Menu
          </button>
        </div>
      </div>

      <div className="w-full">

        {/* Auth Modal */}
        {isAuthModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[120] animate-fade-in"
              onClick={() => setIsAuthModalOpen(false)}
            />

            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 pointer-events-none">
              <div className="pointer-events-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                <div className="p-8">
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full transition-all hover:scale-110 hover:rotate-90"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-wider">
                    {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>

                  <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
                    {authError && (
                      <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm">
                        {authError}
                      </div>
                    )}

                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Password</label>
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>

                    {authMode === 'login' && (
                      <div className="flex justify-end">
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                          Forgot password?
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {authLoading ? 'Loading...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                      {authMode === 'login' ? (
                        <>
                          Don't have an account?{' '}
                          <button onClick={toggleAuthMode} className="text-white hover:text-gray-300 font-semibold transition-colors">
                            Create one
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{' '}
                          <button onClick={toggleAuthMode} className="text-white hover:text-gray-300 font-semibold transition-colors">
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========== SIDE PANEL MENU (Martin Garrix style) ========== */}
        {menuVisible && (
          <>
            {/* Backdrop — subtle dark overlay */}
            <div
              className={`fixed inset-0 z-[100] transition-opacity duration-500 ${
                isMenuClosing ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              onClick={closeMenu}
            />

            {/* Side Panel — slides in from right */}
            <div
              className={`fixed top-0 right-0 bottom-0 z-[101] w-full md:w-[480px] lg:w-[520px] md:border-l md:border-white/[0.06] ${
                isMenuClosing ? 'animate-panel-slide-out' : 'animate-panel-slide-in'
              }`}
            >
              {/* Panel background — glassmorphism */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" style={{ WebkitBackdropFilter: 'blur(40px)' }} />

              {/* Panel content */}
              <div className="relative z-10 h-full flex flex-col px-8 md:px-12">

                {/* Top bar — Logo left, X right */}
                <div className="flex items-center justify-between py-5 md:py-6 flex-shrink-0">
                  <button
                    onClick={() => { closeMenu(); navigate('/'); }}
                    className="block flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src="/Jonna Rincon Logo WH.png"
                      alt="Jonna Rincon"
                      className="h-[80px] md:h-[110px] w-auto opacity-50 hover:opacity-100 transition-opacity duration-300"
                    />
                  </button>

                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                  >
                    <X className="w-5 h-5 text-white/60 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                  </button>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/[0.06]" />

                {/* Menu items — clean, modern, spaced */}
                <div className="flex-1 flex flex-col justify-center -mt-8">
                  {menuItems.map((item, i) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="group w-full text-left py-4 md:py-5 cursor-pointer border-b border-white/[0.04] last:border-b-0"
                      style={{
                        animation: isMenuClosing ? 'none' : `menu-item-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.06}s both`,
                      }}
                    >
                      <div className="flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300">
                        <div>
                          <span className="block text-2xl md:text-3xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300 tracking-tight">
                            {item.label}
                          </span>
                          <span className="block text-xs text-white/25 mt-1 uppercase tracking-widest font-medium group-hover:text-red-400/60 transition-colors duration-300">
                            {item.subtitle}
                          </span>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-red-400/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </button>
                  ))}

                  {/* Auth item */}
                  <button
                    onClick={handleMenuAuthClick}
                    className="group w-full text-left py-4 md:py-5 cursor-pointer"
                    style={{
                      animation: isMenuClosing ? 'none' : `menu-item-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + menuItems.length * 0.06}s both`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-2xl md:text-3xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300 tracking-tight">
                          {user ? 'DASHBOARD' : 'SIGN IN'}
                        </span>
                        {user && (
                          <span className="block text-xs text-white/25 mt-1 uppercase tracking-widest font-medium">
                            {user.displayName || user.email}
                          </span>
                        )}
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-white/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </button>

                  {/* Bottom row: Cart + Sign Out side by side */}
                  <div className="flex items-center gap-5 pt-2">
                    <button
                      onClick={() => {
                        if (onCartClick) {
                          handleCartClick();
                        } else {
                          closeMenu();
                          navigate('/shop/beats');
                        }
                      }}
                      className="relative transition-all hover:scale-110 duration-300 cursor-pointer"
                    >
                      <ShoppingBag className="w-5 h-5 text-white/30 hover:text-white transition-colors" strokeWidth={1.5} />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                          {cartItemCount}
                        </span>
                      )}
                    </button>

                    {user && (
                      <button
                        onClick={() => { closeMenu(); handleSignOut(); }}
                        className="cursor-pointer"
                      >
                        <span className="text-sm uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors duration-300 font-medium">
                          Sign Out
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/[0.06]" />

                {/* Bottom — Social links */}
                <div className="flex-shrink-0 py-6 md:py-8">
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-white/25 uppercase tracking-[0.15em] font-medium hover:text-white/60 transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/15 uppercase tracking-[0.15em] font-medium">
                    &copy; 2025 Jonna Rincon
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes panel-slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-panel-slide-in {
          animation: panel-slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes panel-slide-out {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-panel-slide-out {
          animation: panel-slide-out 0.5s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        @keyframes menu-item-reveal {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}
