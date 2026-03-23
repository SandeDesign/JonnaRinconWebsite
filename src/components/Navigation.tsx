import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  isDarkOverlay?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function Navigation({ cartItemCount = 0, onCartClick, isDarkOverlay = false, onMenuToggle }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { user, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    onMenuToggle?.(isMenuOpen);
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen, onMenuToggle]);

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

  const closeMenu = () => setIsMenuOpen(false);

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

  // Build menu items
  const menuItems: { label: string; subtitle?: string; action: () => void }[] = [
    { label: 'HOME', action: () => { closeMenu(); navigate('/'); } },
    { label: 'BEATS', subtitle: 'Browse instrumentals', action: () => { closeMenu(); window.location.hash = 'beats'; } },
    { label: 'MUSIC', subtitle: 'Latest releases', action: () => { closeMenu(); window.location.hash = 'music'; } },
    { label: 'SHOP', subtitle: 'Beats & Licenses', action: () => { closeMenu(); navigate('/shop/beats'); } },
    { label: 'SOCIALS', action: () => { closeMenu(); window.location.hash = 'socials'; } },
    { label: 'CONTACT', action: () => { closeMenu(); window.location.hash = 'contact'; } },
  ];

  const socialLinks = [
    { label: 'INSTAGRAM', href: 'https://www.instagram.com/jonnarincon/' },
    { label: 'YOUTUBE', href: 'https://www.youtube.com/jonnarincon' },
    { label: 'SPOTIFY', href: 'https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F' },
    { label: 'SOUNDCLOUD', href: 'https://soundcloud.com/jonnarincon' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-30">
      {/* Top bar — logo left, MENU right, SAME line */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 py-6 md:py-8">
        {/* Logo — top-left */}
        <Link to="/" className="block flex-shrink-0">
          <div className="relative h-[60px] md:h-[80px]">
            <img
              src="/Jonna Rincon Logo BL.png"
              alt="Jonna Rincon"
              className="h-full w-auto transition-opacity duration-500"
              style={{ opacity: isDarkOverlay ? 0 : 1 }}
            />
            <img
              src="/Jonna Rincon Logo WH.png"
              alt="Jonna Rincon"
              className="absolute top-0 left-0 h-full w-auto transition-opacity duration-500"
              style={{ opacity: isDarkOverlay ? 1 : 0 }}
            />
          </div>
        </Link>

        {/* MENU button — top-right, same line as logo */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`relative text-lg md:text-2xl font-black uppercase tracking-wider transition-colors duration-500 hover:opacity-70 cursor-pointer ${
            isDarkOverlay ? 'text-white' : 'text-black'
          }`}
        >
          MENU
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-4 md:-right-5 w-2 md:w-2.5 h-2 md:h-2.5 bg-red-600 rounded-full" />
          )}
        </button>
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

        {/* ========== MENU OVERLAY ========== */}
        {isMenuOpen && (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:block">
              {/* Backdrop — blurred */}
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in" onClick={closeMenu} />

              {/* Menu Panel — glass effect, inset */}
              <div className="fixed inset-0 z-[101] flex items-center justify-center p-10 pointer-events-none">
                <div className="pointer-events-auto bg-black/70 backdrop-blur-2xl rounded-2xl overflow-hidden w-full max-w-[1400px] max-h-[90vh] animate-scale-in border border-white/10 shadow-2xl">
                  {/* Close button */}
                  <button
                    onClick={closeMenu}
                    className="absolute top-6 right-6 z-[110] transition-all hover:scale-110 hover:rotate-90 duration-300"
                  >
                    <X className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </button>

                  {/* Main grid: image left, menu right */}
                  <div className="h-[90vh] max-h-[90vh] grid grid-cols-[40%_60%]">
                    {/* Left — Artist Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src="/menu-artist-image.png"
                        alt="Jonna Rincon"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: 'center 35%', filter: 'brightness(0.85) contrast(1.1)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
                    </div>

                    {/* Right — Menu Items */}
                    <div className="flex flex-col justify-between py-12 px-14 overflow-y-auto">
                      <div className="flex-1 flex flex-col justify-center">
                        {menuItems.map((item, i) => (
                          <button
                            key={item.label}
                            onClick={item.action}
                            className="group w-full text-left border-b border-white/10 py-5 transition-all duration-300 hover:pl-4"
                          >
                            <div className="flex items-baseline gap-6">
                              <span className="text-xs text-white/30 font-medium tracking-wider w-6">
                                {ROMAN[i]}
                              </span>
                              <span className="text-4xl xl:text-5xl font-black uppercase tracking-wider text-white group-hover:text-white/70 transition-colors duration-300">
                                {item.label}
                              </span>
                              {item.subtitle && (
                                <span className="text-sm text-white/40 font-normal tracking-wide">
                                  {item.subtitle}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}

                        {/* Cart */}
                        {onCartClick && (
                          <button
                            onClick={handleCartClick}
                            className="group w-full text-left border-b border-white/10 py-5 transition-all duration-300 hover:pl-4"
                          >
                            <div className="flex items-baseline gap-6">
                              <span className="text-xs text-white/30 font-medium tracking-wider w-6">
                                {ROMAN[menuItems.length]}
                              </span>
                              <span className="text-4xl xl:text-5xl font-black uppercase tracking-wider text-white group-hover:text-white/70 transition-colors duration-300">
                                CART
                              </span>
                              {cartItemCount > 0 && (
                                <span className="text-sm text-red-400 font-medium tracking-wide">
                                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                                </span>
                              )}
                            </div>
                          </button>
                        )}

                        {/* Auth */}
                        <button
                          onClick={handleMenuAuthClick}
                          className="group w-full text-left border-b border-white/10 py-5 transition-all duration-300 hover:pl-4"
                        >
                          <div className="flex items-baseline gap-6">
                            <span className="text-xs text-white/30 font-medium tracking-wider w-6">
                              {ROMAN[menuItems.length + (onCartClick ? 1 : 0)]}
                            </span>
                            <span className="text-4xl xl:text-5xl font-black uppercase tracking-wider text-white group-hover:text-white/70 transition-colors duration-300">
                              {user ? 'DASHBOARD' : 'SIGN IN'}
                            </span>
                            {user && (
                              <span className="text-sm text-white/40 font-normal tracking-wide">
                                {user.displayName || user.email}
                              </span>
                            )}
                          </div>
                        </button>

                        {user && (
                          <button
                            onClick={() => { closeMenu(); handleSignOut(); }}
                            className="group w-full text-left py-5 transition-all duration-300 hover:pl-4"
                          >
                            <div className="flex items-baseline gap-6">
                              <span className="text-xs text-white/30 font-medium tracking-wider w-6" />
                              <span className="text-lg uppercase tracking-wider text-white/40 group-hover:text-red-400 transition-colors duration-300 font-medium">
                                Sign Out
                              </span>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Bottom bar — social links */}
                      <div className="flex items-center justify-between pt-8 border-t border-white/10">
                        <p className="text-xs text-white/20 uppercase tracking-widest font-medium">
                          &copy; 2025 Jonna Rincon
                        </p>
                        <div className="flex items-center gap-6">
                          {socialLinks.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-white/40 uppercase tracking-widest font-medium hover:text-white transition-colors duration-300 border-b border-transparent hover:border-white/50 pb-0.5"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              {/* Backdrop */}
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in" onClick={closeMenu} />

              {/* Menu Panel — glass effect */}
              <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto bg-black/70 backdrop-blur-2xl rounded-2xl overflow-hidden w-full max-h-[95vh] animate-scale-in border border-white/10 shadow-2xl flex flex-col">
                  {/* Close button */}
                  <button
                    onClick={closeMenu}
                    className="absolute top-4 right-4 z-[110] transition-all hover:scale-110 hover:rotate-90 duration-300"
                  >
                    <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </button>

                  {/* Artist image — top */}
                  <div className="relative w-full flex-shrink-0" style={{ height: '30vh' }}>
                    <img
                      src="/menu-artist-image.png"
                      alt="Jonna Rincon"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 35%', filter: 'brightness(0.85) contrast(1.1)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                  </div>

                  {/* Menu items */}
                  <div className="px-6 py-6 flex-1 overflow-y-auto">
                    {menuItems.map((item, i) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="group w-full text-left border-b border-white/10 py-4 transition-all duration-300 active:pl-2"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="text-[10px] text-white/30 font-medium tracking-wider w-5">
                            {ROMAN[i]}
                          </span>
                          <span className="text-2xl font-black uppercase tracking-wider text-white">
                            {item.label}
                          </span>
                          {item.subtitle && (
                            <span className="text-xs text-white/40 font-normal tracking-wide">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}

                    {/* Cart */}
                    {onCartClick && (
                      <button
                        onClick={handleCartClick}
                        className="group w-full text-left border-b border-white/10 py-4 transition-all duration-300 active:pl-2"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="text-[10px] text-white/30 font-medium tracking-wider w-5">
                            {ROMAN[menuItems.length]}
                          </span>
                          <span className="text-2xl font-black uppercase tracking-wider text-white">
                            CART
                          </span>
                          {cartItemCount > 0 && (
                            <span className="text-xs text-red-400 font-medium">
                              {cartItemCount}
                            </span>
                          )}
                        </div>
                      </button>
                    )}

                    {/* Auth */}
                    <button
                      onClick={handleMenuAuthClick}
                      className="group w-full text-left border-b border-white/10 py-4 transition-all duration-300 active:pl-2"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="text-[10px] text-white/30 font-medium tracking-wider w-5">
                          {ROMAN[menuItems.length + (onCartClick ? 1 : 0)]}
                        </span>
                        <span className="text-2xl font-black uppercase tracking-wider text-white">
                          {user ? 'DASHBOARD' : 'SIGN IN'}
                        </span>
                      </div>
                    </button>

                    {user && (
                      <button
                        onClick={() => { closeMenu(); handleSignOut(); }}
                        className="w-full text-left py-4"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="w-5" />
                          <span className="text-base uppercase tracking-wider text-white/40 font-medium">
                            Sign Out
                          </span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Social links — bottom */}
                  <div className="px-6 py-5 border-t border-white/10 flex-shrink-0">
                    <div className="flex flex-wrap gap-4 justify-center">
                      {socialLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-white/40 uppercase tracking-widest font-medium hover:text-white transition-colors border-b border-transparent hover:border-white/50 pb-0.5"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest text-center mt-3 font-medium">
                      &copy; 2025 Jonna Rincon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
