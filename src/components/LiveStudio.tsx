import { Radio, Calendar, Clock } from 'lucide-react';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function LiveStudio() {
  const studioTitle = useCyberDecodeInView('Live Studio');
  const { ref: revealRef, isVisible } = useScrollReveal();
  const isLive = false;

  return (
    <section ref={revealRef as React.RefObject<HTMLElement>} className={`py-24 md:py-40 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 ref={studioTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-4xl md:text-7xl font-black uppercase tracking-wider text-white">{studioTitle.display}</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          {/* Main video area */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl overflow-hidden aspect-video relative">
              {isLive ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-900/20 to-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <p className="text-2xl font-bold text-red-500">LIVE NOW</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-neutral-900 to-black">
                  <img
                    src="https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Studio"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <div className="relative text-center z-10">
                    <Radio className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-xl font-bold text-white/50 mb-1">Currently Offline</p>
                    <p className="text-white/30 text-sm">Check back soon for the next session</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-3 text-white">About Live Sessions</h3>
              <p className="text-white/40 leading-relaxed text-sm md:text-base">
                Join me in the studio as I create beats from scratch. Watch the creative process,
                ask questions in real-time, and get insider tips on production techniques. Sessions
                include beat making, mixing, sound design, and more.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Status */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}></div>
                <span className="font-bold text-lg text-white">
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-white/30 text-sm">
                {isLive ? 'Currently streaming' : 'Next stream coming soon'}
              </p>
            </div>

            {/* Schedule */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <Calendar className="w-5 h-5 text-white/30" />
                <h3 className="text-lg font-bold text-white">Upcoming</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-white/10 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-white/25" />
                    <span className="text-xs text-white/30">This Friday, 8:00 PM</span>
                  </div>
                  <p className="font-semibold text-white text-sm">Beat Making Session</p>
                  <p className="text-xs text-white/30">Trap & Drill production</p>
                </div>
                <div className="border-l-2 border-white/10 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-white/25" />
                    <span className="text-xs text-white/30">Next Monday, 7:00 PM</span>
                  </div>
                  <p className="font-semibold text-white text-sm">Q&A + Production Tips</p>
                  <p className="text-xs text-white/30">Ask me anything</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-3xl font-bold transition-all duration-300 hover:scale-[1.02]">
              Set Reminder
            </button>

            {/* Follow */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6">
              <h3 className="text-base font-bold mb-3 text-white">Follow for notifications</h3>
              <div className="space-y-2">
                <a
                  href="https://www.youtube.com/jonnarincon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] rounded-2xl text-center font-medium text-white/80 transition-all duration-300 text-sm"
                >
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/jonnarincon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] rounded-2xl text-center font-medium text-white/80 transition-all duration-300 text-sm"
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
