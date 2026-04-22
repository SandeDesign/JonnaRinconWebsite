import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

type SidebarPosition = 'floating' | 'left' | 'right';

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [expandedShop, setExpandedShop] = useState(false);
  const [expandedCatalogue, setExpandedCatalogue] = useState(false);
  const [expandedArtist, setExpandedArtist] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>('floating');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollPositionRef = useRef(0);

  const isOnDashboard = location.pathname === '/admin/dashboard' || location.pathname === '/admin';

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const [expandedSocial, setExpandedSocial] = React.useState(false);
  const [expandedAnalytics, setExpandedAnalytics] = React.useState(false);

  const menuItems = [
    {
      label: 'SHOP',
      subtitle: 'Art, Beats, Services, Merchandise',
      action: () => setExpandedShop(!expandedShop),
      submenu: [
        { label: 'Art', subtitle: 'Digital & visual art', href: '/admin/art' },
        { label: 'Beats', subtitle: 'Beat instrumentals', href: '/admin/beats' },
        { label: 'Services', subtitle: 'Audio services', href: '/admin/services' },
        { label: 'Merchandise', subtitle: 'Branded products', href: '/admin/merchandise' },
      ],
      expanded: expandedShop,
    },
    {
      label: 'CATALOGUE',
      subtitle: 'Tracks, Remixes, Playlists',
      action: () => setExpandedCatalogue(!expandedCatalogue),
      submenu: [
        { label: 'Tracks', subtitle: 'Discography', href: '/admin/tracks' },
        { label: 'Remixes', subtitle: 'Remixes & edits', href: '/admin/remixes' },
        { label: 'Playlists', subtitle: 'Playlist management', href: '/admin/playlists' },
      ],
      expanded: expandedCatalogue,
    },
    {
      label: 'ARTIST BOARD',
      subtitle: 'Artist Requests, Collab Requests',
      action: () => setExpandedArtist(!expandedArtist),
      submenu: [
        { label: 'Artist Requests', subtitle: 'Artist role requests', href: '/admin/artist-role-requests' },
        { label: 'Collab Requests', subtitle: 'Collaboration requests', href: '/admin/collab-requests' },
      ],
      expanded: expandedArtist,
    },
    {
      label: 'SOCIAL MEDIA',
      subtitle: 'Social Media, Chat',
      action: () => setExpandedSocial(!expandedSocial),
      submenu: [
        { label: 'Social Media', subtitle: 'Content management', href: '/admin/content' },
        { label: 'Chat', subtitle: 'Messaging', href: '/admin/chat' },
      ],
      expanded: expandedSocial,
    },
    {
      label: 'ORDERS AND STATS',
      subtitle: 'Orders, Products, Analytics',
      action: () => setExpandedAnalytics(!expandedAnalytics),
      submenu: [
        { label: 'Orders', subtitle: 'Order management', href: '/admin/orders' },
        { label: 'Product Management', subtitle: 'Customer purchases', href: '/admin/product-management' },
        { label: 'Analytics', subtitle: 'Dashboard analytics', href: '/admin/analytics' },
        { label: 'Discount Codes', subtitle: 'Promo codes', href: '/admin/discount-codes' },
      ],
      expanded: expandedAnalytics,
    },
  ];

  React.useEffect(() => {
    const updateBodyScroll = () => {
      if (isMenuOpen && !isMenuClosing) {
        scrollPositionRef.current = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollPositionRef.current}px`;
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollPositionRef.current > 0) {
          window.scrollTo(0, scrollPositionRef.current);
        }
      }
    };

    updateBodyScroll();

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMenuOpen, isMenuClosing]);

  React.useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

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

  const menuVisible = isMenuOpen || isMenuClosing;

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar — Menu button right */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
        <div className="flex-shrink-0">
          {!isOnDashboard && (
            <button
              onClick={() => {
                try {
                  navigate(-1);
                } catch {
                  navigate('/admin/dashboard');
                }
              }}
              className="w-10 h-10 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center cursor-pointer"
              title="Go back"
            >
              <ArrowLeft size={18} className="text-white/60 group-hover:text-white transition-colors" />
            </button>
          )}
          {isOnDashboard && (
            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
          )}
        </div>

        {/* Menu button */}
        <button
          onClick={openMenu}
          className="text-lg md:text-xl font-black uppercase tracking-[0.3em] text-white transition-all duration-500 hover:opacity-60 cursor-pointer"
        >
          Menu
        </button>
      </div>

      {/* SIDE PANEL MENU */}
      {menuVisible && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-[100] transition-opacity duration-500 ${
              isMenuClosing ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            onClick={closeMenu}
          />

          {/* Side Panel */}
          <div
            className={`fixed top-0 right-0 bottom-0 z-[101] w-full md:w-[480px] lg:w-[520px] md:border-l md:border-white/[0.06] ${
              isMenuClosing ? 'animate-panel-slide-out' : 'animate-panel-slide-in'
            }`}
          >
            {/* Panel background */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" style={{ WebkitBackdropFilter: 'blur(40px)' }} />

            {/* Panel content */}
            <div className="relative z-10 h-full flex flex-col px-8 md:px-12">
              {/* Top bar — Logo left, X right */}
              <div className="flex items-center justify-between py-3 md:py-4 flex-shrink-0">
                <button
                  onClick={() => {
                    closeMenu();
                    setTimeout(() => navigate('/admin/dashboard'), 100);
                  }}
                  className="block flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  title="Back to Dashboard"
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

              {/* Menu items — clean structure matching homepage */}
              <div className="flex-1 flex flex-col overflow-y-auto pr-2 pb-12">
                {menuItems.map((item, i) => (
                  <div key={item.label}>
                    <button
                      onClick={item.action}
                      className="group w-full text-left py-4 md:py-5 cursor-pointer border-b border-white/[0.04]"
                      style={{
                        animation: isMenuClosing ? 'none' : `menu-item-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.06}s both`,
                      }}
                    >
                      <div className={`flex items-center justify-between transition-transform duration-300 ${!item.expanded ? 'group-hover:translate-x-2' : ''}`}>
                        <div>
                          <span className="block text-3xl md:text-4xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300 tracking-tight">
                            {item.label}
                          </span>
                          <span className="block text-xs text-white/25 mt-1 uppercase tracking-widest font-medium group-hover:text-red-400/60 transition-colors duration-300">
                            {item.subtitle}
                          </span>
                        </div>
                        <ArrowUpRight className={`w-5 h-5 text-white/10 group-hover:text-red-400/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${item.expanded ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    {/* Submenu */}
                    {item.submenu && (
                      <div className={`overflow-hidden transition-all duration-300 ease-out ${item.expanded ? 'max-h-[800px]' : 'max-h-0'}`}>
                        {item.submenu.map((subitem, subIndex) => (
                          <button
                            key={subitem.href}
                            onClick={() => {
                              closeMenu();
                              navigate(subitem.href);
                            }}
                            className="group w-full text-left py-3 md:py-4 cursor-pointer border-b border-white/[0.04] hover:translate-x-1.5 transition-transform duration-300"
                            style={{
                              animation: item.expanded && !isMenuClosing ? `menu-item-reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 + subIndex * 0.04}s both` : 'none',
                              paddingLeft: '2rem',
                            }}
                          >
                            <span className="block text-lg md:text-lg font-semibold text-white/60 group-hover:text-white transition-colors duration-300 tracking-tight">
                              {subitem.label}
                            </span>
                            <span className="block text-xs text-white/20 mt-0.5 uppercase tracking-widest font-medium group-hover:text-white/40 transition-colors duration-300">
                              {subitem.subtitle}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Bottom section with icons and sign out */}
                <div className="flex flex-col gap-4 pt-6">
                  {/* Icon Row */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => { closeMenu(); navigate('/admin/dashboard'); }}
                      className="p-2.5 rounded-xl transition-all duration-200 text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                      title="Dashboard"
                    >
                      <LayoutDashboard size={18} />
                    </button>

                    <button
                      onClick={() => { closeMenu(); navigate('/admin/settings'); }}
                      className="p-2.5 rounded-xl transition-all duration-200 text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                      title="Settings"
                    >
                      <Settings size={18} />
                    </button>

                    <button
                      onClick={() => {
                        if (sidebarPosition === 'floating') {
                          setSidebarPosition('left');
                        } else if (sidebarPosition === 'left') {
                          setSidebarPosition('right');
                        } else {
                          setSidebarPosition('floating');
                        }
                      }}
                      className={`p-2.5 rounded-xl transition-all duration-200 ${
                        sidebarPosition === 'floating'
                          ? 'text-white/40 hover:bg-white/[0.04] hover:text-white/80'
                          : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                      }`}
                      title={`Sidebar: ${sidebarPosition === 'floating' ? 'Floating' : sidebarPosition === 'left' ? 'Left' : 'Right'}`}
                    >
                      {sidebarPosition === 'left' && <ChevronRight size={18} />}
                      {sidebarPosition === 'right' && <ChevronLeft size={18} />}
                      {sidebarPosition === 'floating' && <Menu size={18} />}
                    </button>

                    <button
                      onClick={() => { closeMenu(); handleSignOut(); }}
                      className="p-2.5 rounded-xl transition-all duration-200 text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                      title="Sign Out"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>

                  {/* Sign Out text button */}
                  <button
                    onClick={() => { closeMenu(); handleSignOut(); }}
                    className="text-left cursor-pointer w-full"
                  >
                    <span className="text-sm uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors duration-300 font-medium">
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/[0.06]" />

              {/* Bottom — Admin info */}
              <div className="flex-shrink-0 py-6 md:py-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {user?.displayName?.[0] || user?.email?.[0] || 'A'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.displayName || 'Admin'}
                    </p>
                    <p className="text-xs text-white/25 truncate">{user?.email}</p>
                  </div>
                </div>
                <p className="text-[10px] text-white/15 uppercase tracking-[0.15em] font-medium">
                  &copy; 2025 Jonna Rincon
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-col min-h-screen pt-20">
        {/* Page Content */}
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</main>
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
        @media (max-width: 768px) {
          .animate-panel-slide-in {
            animation: panel-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
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
        @media (max-width: 768px) {
          .animate-panel-slide-out {
            animation: panel-slide-out 0.2s cubic-bezier(0.7, 0, 0.84, 0) forwards;
          }
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

        @media (max-width: 768px) {
          /* Faster animations on mobile */
          [style*="animation-delay"] {
            animation-duration: 0.3s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
