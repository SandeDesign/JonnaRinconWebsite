import { Youtube, Instagram, Music2 } from 'lucide-react';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Socials() {
  const socialTitle = useCyberDecodeInView('Social Media');
  const { ref: revealRef, isVisible } = useScrollReveal();

  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/jonnarincon/',
      gradient: 'from-purple-600 via-pink-500 to-orange-400'
    },
    {
      name: 'TikTok',
      icon: Music2,
      url: '#',
      gradient: 'from-cyan-400 via-black to-pink-500'
    },
    {
      name: 'Apple Music',
      icon: Music2,
      url: '#',
      gradient: 'from-pink-500 to-red-500'
    },
    {
      name: 'YouTube Music',
      icon: Youtube,
      url: '#',
      gradient: 'from-red-600 to-red-400'
    },
  ];

  return (
    <section ref={revealRef as React.RefObject<HTMLElement>} id="socials" className={`py-24 md:py-40 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 ref={socialTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-4xl md:text-7xl font-black uppercase tracking-wider text-white">{socialTitle.display}</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-sm p-6 md:p-8 transition-all duration-300 hover:scale-[1.03] hover:border-white/[0.12] flex flex-col items-center text-center"
              >
                <div className={`w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 md:w-9 md:h-9 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1">{platform.name}</h3>
                <p className="text-white/30 text-xs uppercase tracking-widest">Follow</p>
              </a>
            );
          })}
        </div>

        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Want exclusive releases?</h3>
          <p className="text-white/40 mb-6 text-sm md:text-base">
            Subscribe to get early access to new beats, free downloads, and special offers
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 rounded-2xl focus:outline-none focus:border-white/20 transition-all duration-300"
            />
            <button className="px-6 md:px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.03]">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
