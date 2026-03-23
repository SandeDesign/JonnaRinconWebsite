import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import BeatStore from './components/BeatStore';
import Music from './components/Music';
import Socials from './components/Socials';
import LiveStudio from './components/LiveStudio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart';
import Marquee from './components/Marquee';
import { Beat, CartItem } from './lib/types';

// FIREBASE IMPORTS - NO MORE database.ts
import { collection, addDoc } from 'firebase/firestore';
import { db } from './lib/firebase/config';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const [hasClickedButton, setHasClickedButton] = useState(false);
  const [isDarkOverlay, setIsDarkOverlay] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dynamische sections
  const getSections = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return ['hero', 'about', 'beats', 'music', 'compilations', 'youtube', 'socials', 'live-studio', 'contact'];
    }
    return ['hero', 'about', 'beats', 'music', 'youtube', 'socials', 'live-studio', 'contact'];
  };

  const [sections, setSections] = useState(getSections());

  const handleAddToCart = (beat: Beat, license: 'basic' | 'premium' | 'exclusive') => {
    let price = beat.price;
    if (license === 'premium') price = beat.price * 1.5;
    if (license === 'exclusive') price = beat.price * 3;

    const newItem: CartItem = { beat, license, price };
    setCartItems([...cartItems, newItem]);
    setIsCartOpen(true);
  };

  const handleRemoveItem = (beatId: string) => {
    setCartItems(cartItems.filter((item) => item.beat.id !== beatId));
  };

  const handleCheckout = async () => {
    // REAL FIREBASE ORDER CREATION
    const order = {
      customerEmail: 'customer@example.com',
      items: cartItems.map(item => ({
        beatId: item.beat.id,
        beatTitle: item.beat.title,
        licenseType: item.license,
        price: item.price
      })),
      total: cartItems.reduce((sum, item) => sum + item.price, 0),
      status: 'pending',
      createdAt: new Date(),
    };
    
    try {
      await addDoc(collection(db, 'orders'), order);
      alert('Order created successfully!');
      setCartItems([]);
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order');
    }
  };

  const scrollToNext = () => {
    const isMobile = window.innerWidth < 768;

    if (!hasClickedButton) {
      setHasClickedButton(true);
    }

    if (scrollDirection === 'down') {
      // Normale scroll - GEEN speciale About logica meer
      const nextIndex = Math.min(currentSection + 1, sections.length - 1);
      const targetElement = document.getElementById(sections[nextIndex]);
      
      if (targetElement) {
        if (sections[nextIndex] === 'music' && !isMobile) {
          const elementTop = targetElement.offsetTop;
          window.scrollTo({ top: elementTop - 50, behavior: 'smooth' });
          setCurrentSection(nextIndex);
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setCurrentSection(nextIndex);
        }
      }
      
      if (nextIndex === sections.length - 1) {
        setScrollDirection('up');
      }
    } else {
      const prevIndex = Math.max(currentSection - 1, 0);
      const targetElement = document.getElementById(sections[prevIndex]);
      
      if (targetElement) {
        if (sections[prevIndex] === 'music' && !isMobile) {
          const elementTop = targetElement.offsetTop;
          window.scrollTo({ top: elementTop - 50, behavior: 'smooth' });
          setCurrentSection(prevIndex);
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setCurrentSection(prevIndex);
        }
      }
      
      if (prevIndex === 0) {
        setScrollDirection('down');
      }
    }
  };

  // Detect current section on scroll - REAL-TIME SYNC + overlay darkness
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Determine if overlay is dark enough for white elements
      const scrollPercent = (window.scrollY / window.innerHeight) * 100;
      setIsDarkOverlay(scrollPercent >= 15);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setCurrentSection(prev => {
            if (prev !== i) {
              if (i === 0) setScrollDirection('down');
              if (i === sections.length - 1) setScrollDirection('up');
              return i;
            }
            return prev;
          });
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Lock section during resize - PREVENT SCROLL JUMP
  useEffect(() => {
    let savedScrollPosition = 0;
    let isResizing = false;
    
    const handleResizeStart = () => {
      if (!isResizing) {
        isResizing = true;
        savedScrollPosition = window.scrollY;
      }
    };
    
    const handleResizeEnd = () => {
      if (isResizing) {
        window.scrollTo({ top: savedScrollPosition, behavior: 'auto' });
        setSections(getSections());
        isResizing = false;
      }
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      handleResizeStart();
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResizeEnd, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const isAtEnd = currentSection === sections.length - 1;
  const showText = !hasClickedButton || isAtEnd;
  const buttonText = scrollDirection === 'up' ? 'Back' : 'Click Me!';

  return (
    <div className="min-h-screen">
      <Navigation cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} isDarkOverlay={isDarkOverlay} onMenuToggle={setIsMenuOpen} />

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Scroll Button — bottom-left, hidden when menu is open */}
      {!isMenuOpen && (
        <div className="fixed bottom-10 left-8 z-50">
          <button
            onClick={scrollToNext}
            className="animate-bounce cursor-pointer hover:scale-125 transition-all duration-500 focus:outline-none flex flex-col items-center gap-2"
          >
            {showText && (
              <span
                className={`text-xs md:text-sm uppercase tracking-[0.3em] font-semibold transition-colors duration-500 ${
                  isDarkOverlay ? 'text-white/80' : 'text-black/70'
                }`}
              >
                {scrollDirection === 'up' ? 'Back to top' : 'Scroll Down'}
              </span>
            )}
            <svg
              className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-500 ${scrollDirection === 'up' ? 'rotate-180' : ''} ${
                isDarkOverlay ? 'text-white' : 'text-black'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </button>
        </div>
      )}

      <main className="pt-20">
        <div id="hero" className="h-screen overflow-hidden"><Hero /></div>
        <About />
        <Marquee />
        <BeatStore onAddToCart={handleAddToCart} />
        <Music />
        <Socials />
        <div id="live-studio"><LiveStudio /></div>
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;