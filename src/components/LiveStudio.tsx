import { Radio, Calendar, Clock } from 'lucide-react';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface LiveStudioProps {
  isLightMode?: boolean;
}

export default function LiveStudio({ isLightMode = false }: LiveStudioProps) {
  const studioTitle = useCyberDecodeInView('Live Studio');
  const { ref: revealRef, isVisible } = useScrollReveal();
  const isLive = false;

  const cardBg = isLightMode ? 'bg-black/[0.03] border-black/[0.08]' : 'bg-white/5 border-white/10';
  const headingColor = isLightMode ? 'text-black' : 'text-white';
  const subtleText = isLightMode ? 'text-black/40' : 'text-gray-400';
  const iconColor = isLightMode ? 'text-black/30' : 'text-gray-400';
  const borderAccent = isLightMode ? 'border-black/10' : 'border-white/20';
  const btnSecondary = isLightMode ? 'bg-black/[0.03] hover:bg-black/[0.06] border-black/[0.08]' : 'bg-white/5 hover:bg-white/10 border-white/10';

  return (
    <section ref={revealRef as React.RefObject<HTMLElement>} className={`py-32 md:py-48 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
          <h2 ref={studioTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-3xl md:text-6xl font-black uppercase tracking-wider">{studioTitle.display}</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className={`${cardBg} border rounded-2xl overflow-hidden aspect-video relative transition-colors duration-700`}>
              {isLive ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-900/20 to-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <p className="text-2xl font-bold text-red-500">LIVE NOW</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative" style={{ background: isLightMode ? '#f8f8f8' : 'linear-gradient(135deg, rgba(17,17,17,1), rgba(0,0,0,1))' }}>
                  <img
                    src="https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Studio"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: isLightMode ? 0.08 : 0.3 }}
                  />
                  <div className="relative text-center z-10">
                    <Radio className={`w-20 h-20 ${iconColor} mx-auto mb-4 transition-colors duration-700`} />
                    <p className={`text-2xl font-bold ${isLightMode ? 'text-black/60' : 'text-gray-300'} mb-2 transition-colors duration-700`}>Currently Offline</p>
                    <p className={`${subtleText} transition-colors duration-700`}>Check back soon for the next session</p>
                  </div>
                </div>
              )}
            </div>

            <div className={`mt-6 ${cardBg} border rounded-2xl p-6 transition-colors duration-700`}>
              <h3 className={`text-2xl font-bold mb-4 ${headingColor} transition-colors duration-700`}>About Live Sessions</h3>
              <p className={`${subtleText} leading-relaxed transition-colors duration-700`}>
                Join me in the studio as I create beats from scratch. Watch the creative process,
                ask questions in real-time, and get insider tips on production techniques. Sessions
                include beat making, mixing, sound design, and more.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${cardBg} border rounded-2xl p-6 transition-colors duration-700`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className={`font-semibold text-lg ${headingColor} transition-colors duration-700`}>
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              <p className={`${subtleText} text-sm transition-colors duration-700`}>
                {isLive ? 'Currently streaming' : 'Next stream coming soon'}
              </p>
            </div>

            <div className={`${cardBg} border rounded-2xl p-6 transition-colors duration-700`}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className={`w-6 h-6 ${iconColor} transition-colors duration-700`} />
                <h3 className={`text-xl font-bold ${headingColor} transition-colors duration-700`}>Upcoming Streams</h3>
              </div>
              <div className="space-y-4">
                <div className={`border-l-2 ${borderAccent} pl-4 transition-colors duration-700`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className={`w-4 h-4 ${iconColor} transition-colors duration-700`} />
                    <span className={`text-sm ${subtleText} transition-colors duration-700`}>This Friday, 8:00 PM</span>
                  </div>
                  <p className={`font-semibold ${headingColor} transition-colors duration-700`}>Beat Making Session</p>
                  <p className={`text-sm ${subtleText} transition-colors duration-700`}>Trap & Drill production</p>
                </div>
                <div className={`border-l-2 ${borderAccent} pl-4 transition-colors duration-700`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className={`w-4 h-4 ${iconColor} transition-colors duration-700`} />
                    <span className={`text-sm ${subtleText} transition-colors duration-700`}>Next Monday, 7:00 PM</span>
                  </div>
                  <p className={`font-semibold ${headingColor} transition-colors duration-700`}>Q&A + Production Tips</p>
                  <p className={`text-sm ${subtleText} transition-colors duration-700`}>Ask me anything</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02]">
              Set Reminder
            </button>

            <div className={`${cardBg} border rounded-2xl p-6 transition-colors duration-700`}>
              <h3 className={`text-lg font-bold mb-3 ${headingColor} transition-colors duration-700`}>Follow on Socials</h3>
              <p className={`text-sm ${subtleText} mb-4 transition-colors duration-700`}>
                Get notified when I go live and never miss a session
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.youtube.com/jonnarincon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-2 ${btnSecondary} border rounded-xl text-center font-medium transition-all duration-300`}
                >
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/jonnarincon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-2 ${btnSecondary} border rounded-xl text-center font-medium transition-all duration-300`}
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
