import { Youtube, Instagram, Music2 } from 'lucide-react';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface SocialsProps {
  isLightMode?: boolean;
}

export default function Socials({ isLightMode = false }: SocialsProps) {
  const socialTitle = useCyberDecodeInView('Social Media');
  const { ref: revealRef, isVisible } = useScrollReveal();

  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/jonnarincon/',
      color: 'from-pink-600 to-red-600'
    },
    {
      name: 'TikTok',
      icon: Music2,
      url: '#',
      color: 'from-gray-800 to-teal-600'
    },
    {
      name: 'Apple Music',
      icon: Music2,
      url: '#',
      color: 'from-red-600 to-pink-600'
    },
    {
      name: 'YouTube Music',
      icon: Youtube,
      url: '#',
      color: 'from-red-600 to-orange-600'
    },
  ];

  const cardBg = isLightMode ? 'bg-black/[0.03] border-black/[0.08] hover:bg-black/[0.06]' : 'bg-white/5 border-white/10 hover:bg-white/10';
  const subtleText = isLightMode ? 'text-black/40' : 'text-gray-400';
  const headingColor = isLightMode ? 'text-black' : 'text-white';
  const inputBg = isLightMode ? 'bg-black/[0.03] border-black/[0.08] text-black placeholder-black/30 focus:border-black/20' : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/30';

  return (
    <section ref={revealRef as React.RefObject<HTMLElement>} id="socials" className={`py-32 md:py-48 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 ref={socialTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-3xl md:text-6xl font-black mb-4 uppercase tracking-wider">{socialTitle.display}</h2>
        </div>

        {/* Social Platform Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cardBg} border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-[1.03] flex flex-col items-center text-center group`}
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className={`text-lg md:text-xl font-bold mb-2 ${headingColor} transition-colors duration-700`}>{platform.name}</h3>
                <p className={`${subtleText} text-sm transition-colors duration-700`}>Follow me</p>
              </a>
            );
          })}
        </div>

        {/* Subscribe Section */}
        <div className={`${isLightMode ? 'bg-black/[0.03] border-black/[0.08]' : 'bg-white/5 border-white/10'} border rounded-2xl p-6 md:p-8 text-center transition-colors duration-700`}>
          <h3 className={`text-2xl font-bold mb-4 ${headingColor} transition-colors duration-700`}>Want exclusive releases?</h3>
          <p className={`${subtleText} mb-6 transition-colors duration-700`}>
            Subscribe to get early access to new beats, free downloads, and special offers
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 py-3 ${inputBg} border rounded-xl focus:outline-none transition-all duration-300`}
            />
            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.03]">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
