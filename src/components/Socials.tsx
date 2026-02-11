import { Youtube, Instagram, Music2 } from 'lucide-react';

export default function Socials() {
  const socialPlatforms = [
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://www.instagram.com/jonnarincon/',
      color: 'from-pink-600 to-purple-600'
    },
    { 
      name: 'TikTok', 
      icon: Music2, 
      url: '#',
      color: 'from-black to-teal-600'
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

  return (
    <section id="socials" className="py-64 pb-64 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-6xl font-bold mb-4 neon-glow">Social Media</h2>
          <p className="text-xl text-gray-400"></p>
        </div>

        {/* Social Platform Grid - 4 vakjes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-8 neon-border-subtle hover:neon-border transition-all hover:scale-105 flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                <p className="text-gray-400 text-sm">Follow me</p>
              </a>
            );
          })}
        </div>

        {/* Subscribe Section */}
        <div className="glass rounded-2xl p-8 neon-border text-center">
          <h3 className="text-2xl font-bold mb-4 text-purple-300">Want exclusive releases?</h3>
          <p className="text-gray-400 mb-6">
            Subscribe to get early access to new beats, free downloads, and special offers
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-black/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:neon-border-subtle transition-all"
            />
            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all neon-border-subtle hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
