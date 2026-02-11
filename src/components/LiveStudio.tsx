import { Radio, Calendar, Clock } from 'lucide-react';

export default function LiveStudio() {
  const isLive = false;

  return (
    <section className="py-48 pb-64 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
          <h2 className="text-3xl md:text-6xl font-bold neon-glow">Live Studio</h2>
          </div>
          <p className="text-xl text-gray-400"></p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden neon-border aspect-video relative">
              {isLive ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-4 animate-pulse neon-border"></div>
                    <p className="text-2xl font-bold text-red-500 neon-glow">LIVE NOW</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-black flex items-center justify-center relative">
                  <img
                    src="https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Studio"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative text-center z-10">
                    <Radio className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-purple-300 mb-2">Currently Offline</p>
                    <p className="text-gray-400">Check back soon for the next session</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 glass rounded-2xl p-6 neon-border-subtle">
              <h3 className="text-2xl font-bold mb-4 text-purple-300">About Live Sessions</h3>
              <p className="text-gray-400 leading-relaxed">
                Join me in the studio as I create beats from scratch. Watch the creative process,
                ask questions in real-time, and get insider tips on production techniques. Sessions
                include beat making, mixing, sound design, and more.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 neon-border-subtle">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="font-semibold text-lg">
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {isLive ? 'Currently streaming' : 'Next stream coming soon'}
              </p>
            </div>

            <div className="glass rounded-2xl p-6 neon-border-subtle">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Upcoming Streams</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">This Friday, 8:00 PM</span>
                  </div>
                  <p className="font-semibold text-purple-200">Beat Making Session</p>
                  <p className="text-sm text-gray-400">Trap & Drill production</p>
                </div>
                <div className="border-l-2 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Next Monday, 7:00 PM</span>
                  </div>
                  <p className="font-semibold text-purple-200">Q&A + Production Tips</p>
                  <p className="text-sm text-gray-400">Ask me anything</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-all neon-border hover:scale-105">
              Set Reminder
            </button>

            <div className="glass rounded-2xl p-6 neon-border-subtle">
              <h3 className="text-lg font-bold mb-3 text-purple-300">Follow on Socials</h3>
              <p className="text-sm text-gray-400 mb-4">
                Get notified when I go live and never miss a session
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.youtube.com/jonnarincon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 bg-purple-900/30 hover:bg-purple-900/50 rounded-lg text-center font-medium transition-all"
                >
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/jonnarincon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 bg-purple-900/30 hover:bg-purple-900/50 rounded-lg text-center font-medium transition-all"
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
