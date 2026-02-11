import { Music, Instagram, Youtube, Cloud as CloudIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-purple-500/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-8 h-8 text-purple-400 neon-glow" />
              <span className="text-2xl font-bold neon-glow">JONNA RINCON</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional producer and beatmaker crafting premium beats for artists worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-300">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="#beats"
                className="block text-gray-400 hover:text-purple-400 transition-colors"
              >
                Browse Beats
              </a>
              <a
                href="#music"
                className="block text-gray-400 hover:text-purple-400 transition-colors"
              >
                Listen to Music
              </a>
              <a
                href="#contact"
                className="block text-gray-400 hover:text-purple-400 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-300">Follow</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/jonnarincon/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/jonnarincon"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://soundcloud.com/jonnarincon"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110"
              >
                <CloudIcon className="w-5 h-5" />
              </a>
              <a
                href="https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110"
              >
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            Copyright © 2025 Jonna Rincon. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}