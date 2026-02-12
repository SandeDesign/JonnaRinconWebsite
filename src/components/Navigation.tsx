import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export default function Navigation({ cartItemCount = 0, onCartClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [scrolled, setScrolled] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { user, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const handleAuthClick = () => {
    if (user) {
      navigate(getDashboardLink());
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setAuthError('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-30">
      <div className="w-full pl-4 pr-4 py-5">
        {/* DESKTOP Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo animatie - midden → links */}
          <div className={`absolute left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
            scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            <Link to="/" className="flex flex-col items-center group">
              <span className="text-3xl font-black text-white leading-none">
                JONNA RINCON
              </span>
              <span className="text-xs text-purple-400 tracking-wide mt-1 text-center">
                Producer • DJ • Audio Engineer
              </span>
            </Link>
          </div>

          <div className={`transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}>
            <Link to="/" className="flex flex-col items-center group">
              <span className="text-3xl font-black text-white leading-none">
                JONNA RINCON
              </span>
              <span className="text-xs text-purple-400 tracking-wide mt-1 text-center">
                Producer • DJ • Audio Engineer
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-5">
            {user ? (
              <Link
                to={getDashboardLink()}
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-base hover:scale-110 transition-all duration-300 neon-border-subtle hover:neon-border"
                style={{width: '60px', height: '60px'}}
                title={user.displayName || user.email || 'Profile'}
              >
                {getUserInitials()}
              </Link>
            ) : (
              <button
                onClick={handleAuthClick}
                className="rounded-full glass flex items-center justify-center text-white hover:text-gray-200 hover:scale-110 transition-all duration-300 neon-border-subtle hover:neon-border"
                style={{width: '60px', height: '60px'}}
                title="Login"
              >
                <User className="w-7 h-7" />
              </button>
            )}

            {onCartClick && (
              <button
                onClick={onCartClick}
                className="relative glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110 active:scale-95 group/cart"
                style={{width: '60px', height: '60px', padding: '16px'}}
              >
                <ShoppingCart className="w-7 h-7 group-hover/cart:animate-pulse" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-black neon-border-subtle animate-pulse" style={{width: '32px', height: '32px'}}>
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
              style={{width: '60px', height: '60px'}}
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* MOBILE Layout - B: Complete nieuwe opzet */}
        <div className="md:hidden">
          {/* Logo gecentreerd + Buttons eronder (fade animaties) */}
          
          {/* Positie 1: Top (niet scrolled) - Logo MIDDEN + Buttons ONDER logo */}
          <div className={`transition-opacity duration-500 ${
            scrolled ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'
          }`}>
            {/* Logo gecentreerd */}
            <div className="flex justify-center mb-4">
              <Link to="/" className="flex flex-col items-center">
                <span className="text-2xl font-black text-white leading-none">
                  JONNA RINCON
                </span>
                <span className="text-xs text-purple-400 tracking-wide mt-1 text-center">
                  Producer • DJ • Audio Engineer
                </span>
              </Link>
            </div>

            {/* Buttons ONDER logo - 50% kleiner */}
            <div className="flex items-center justify-center gap-3">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-all duration-300"
                  style={{width: '30px', height: '30px'}}
                >
                  {getUserInitials()}
                </Link>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="rounded-full glass flex items-center justify-center text-white hover:text-gray-200 hover:scale-110 transition-all duration-300"
                  style={{width: '30px', height: '30px'}}
                >
                  <User className="w-4 h-4" />
                </button>
              )}

              {onCartClick && (
                <button
                  onClick={onCartClick}
                  className="relative glass rounded-full hover:scale-110 transition-all flex items-center justify-center"
                  style={{width: '30px', height: '30px'}}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 rounded-full flex items-center justify-center text-xs font-black" style={{width: '16px', height: '16px', fontSize: '8px'}}>
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="glass rounded-full hover:scale-110 transition-all flex items-center justify-center"
                style={{width: '30px', height: '30px'}}
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Positie 2: Na scroll - Logo LINKS + Buttons RECHTS (kleiner dan desktop: 20-40% kleiner) */}
          <div className={`transition-opacity duration-500 flex items-center justify-between ${
            scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'
          }`}>
            <Link to="/" className="flex flex-col items-start">
              <span className="text-xl font-black text-white leading-none">
                JONNA RINCON
              </span>
              <span className="text-xs text-purple-400 tracking-wide">
                Producer • DJ • Audio Engineer
              </span>
            </Link>

            {/* Buttons rechts - 36px (40% kleiner dan 60px) */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs hover:scale-110 transition-all duration-300"
                  style={{width: '36px', height: '36px'}}
                >
                  {getUserInitials()}
                </Link>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="rounded-full glass flex items-center justify-center text-white hover:text-gray-200 hover:scale-110 transition-all duration-300"
                  style={{width: '36px', height: '36px'}}
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {onCartClick && (
                <button
                  onClick={onCartClick}
                  className="relative glass rounded-full hover:scale-110 transition-all flex items-center justify-center"
                  style={{width: '36px', height: '36px'}}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 rounded-full flex items-center justify-center text-xs font-black" style={{width: '20px', height: '20px', fontSize: '10px'}}>
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="glass rounded-full hover:scale-110 transition-all flex items-center justify-center"
                style={{width: '36px', height: '36px'}}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        {isAuthModalOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-xl z-[120] animate-fade-in"
              onClick={() => setIsAuthModalOpen(false)}
            ></div>
            
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 pointer-events-none">
              <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                <div className="p-8">
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="absolute top-6 right-6 p-2 glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110 hover:rotate-90"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
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
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/5 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white/5 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>

                    {authMode === 'login' && (
                      <div className="flex justify-end">
                        <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                          Forgot password?
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50"
                    >
                      {authLoading ? 'Loading...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                      {authMode === 'login' ? (
                        <>
                          Don't have an account?{' '}
                          <button
                            onClick={toggleAuthMode}
                            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                          >
                            Create one
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{' '}
                          <button
                            onClick={toggleAuthMode}
                            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                          >
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

        {/* Menu - A2: "Don't have an account?" tekst toegevoegd */}
        {isMenuOpen && (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-xl z-[100] animate-fade-in"
                onClick={() => setIsMenuOpen(false)}
              ></div>
              
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 pointer-events-none">
                <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden animate-scale-in">
                  <div className="grid grid-cols-2 min-h-[600px]">
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-black">
                      <img 
                        src="/menu-artist-image.png" 
                        alt="Jonna Rincon" 
                        className="absolute inset-0 w-full h-full object-cover scale-150"
                        style={{objectPosition: 'center 35%', filter: 'brightness(0.9) contrast(1.1)'}}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40"></div>
                    </div>

                    <div className="flex flex-col p-12 justify-center">
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-8 right-8 p-3 glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110 hover:rotate-90"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>

                      <div className="flex flex-col gap-6">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-4xl hover:translate-x-4 transform duration-300">
                          Home
                        </Link>
                        <a href="#beats" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-4xl hover:translate-x-4 transform duration-300">
                          Beats
                        </a>
                        <a href="#music" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-4xl hover:translate-x-4 transform duration-300">
                          Music
                        </a>
                        <a href="#socials" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-4xl hover:translate-x-4 transform duration-300">
                          Socials
                        </a>
                        <Link to="/shop/beats" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-4xl hover:translate-x-4 transform duration-300">
                          Shop
                        </Link>
                        
                        <div className="border-t-2 border-purple-500/30 my-4"></div>
                        
                        {user ? (
                          <>
                            <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-4xl hover:translate-x-4 transform duration-300">
                              Dashboard
                            </Link>
                            <button onClick={() => { setIsMenuOpen(false); handleSignOut(); }} className="text-white hover:text-red-400 transition-all font-black text-4xl text-left hover:translate-x-4 transform duration-300">
                              Sign Out
                            </button>
                          </>
                        ) : (
                          <>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-4xl hover:translate-x-4 transform duration-300">
                              Sign In
                            </Link>

                            {/* A2: Don't have an account tekst */}
                            <div className="mt-4">
                              <p className="text-gray-400 text-base">
                                Don't have an account?{' '}
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                                  Create one
                                </Link>
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-auto pt-8">
                        <p className="text-sm text-gray-500">© 2025 Jonna Rincon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <div 
                className="fixed inset-0 bg-black/25 backdrop-blur-xl z-[100] animate-fade-in"
                onClick={() => setIsMenuOpen(false)}
              ></div>
              
              <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-black/90 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-2xl w-[92%] max-w-lg max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-black flex-shrink-0" style={{height: '45vh'}}>
                    <img 
                      src="/menu-artist-image.png" 
                      alt="Jonna Rincon" 
                      className="w-full h-full object-cover object-center"
                      style={{objectPosition: 'center 35%', filter: 'brightness(0.85) contrast(1.15) saturate(1.1)'}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
                    
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:border-white/20 transition-all"
                    >
                      <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-center px-10 py-8 overflow-y-auto">
                    <div className="flex flex-col items-center gap-6 text-center">
                      <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-3xl tracking-tight hover:scale-105 transform duration-200">
                        Home
                      </Link>
                      <a href="#beats" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-3xl tracking-tight hover:scale-105 transform duration-200">
                        Beats
                      </a>
                      <a href="#music" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-3xl tracking-tight hover:scale-105 transform duration-200">
                        Music
                      </a>
                      <a href="#socials" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-3xl tracking-tight hover:scale-105 transform duration-200">
                        Socials
                      </a>
                      <Link to="/shop/beats" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-3xl tracking-tight hover:scale-105 transform duration-200">
                        Shop
                      </Link>
                      
                      <div className="w-16 border-t border-purple-500/30 my-2"></div>
                      
                      {user ? (
                        <>
                          <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-3xl tracking-tight hover:scale-105 transform duration-200">
                            Dashboard
                          </Link>
                          <button onClick={() => { setIsMenuOpen(false); handleSignOut(); }} className="text-white/80 hover:text-red-400 transition-all font-bold text-xl tracking-tight hover:scale-105 transform duration-200">
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-400 transition-all font-black text-3xl tracking-tight hover:scale-105 transform duration-200">
                            Sign In
                          </Link>

                          {/* A2: Don't have an account tekst - mobile */}
                          <div className="mt-2">
                            <p className="text-gray-400 text-sm">
                              Don't have an account?{' '}
                              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                                Create one
                              </Link>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 py-5 border-t border-white/5">
                    <p className="text-xs text-gray-500 text-center font-medium tracking-wide">
                      © 2025 JONNA RINCON
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