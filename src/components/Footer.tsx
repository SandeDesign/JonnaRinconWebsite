import { Music, Instagram, Youtube, Cloud as CloudIcon } from 'lucide-react';

interface FooterProps {
  isLightMode?: boolean;
}

export default function Footer({ isLightMode = false }: FooterProps) {
  const borderColor = isLightMode ? 'border-black/[0.08]' : 'border-white/10';
  const subtleText = isLightMode ? 'text-black/40' : 'text-gray-400';
  const headingColor = isLightMode ? 'text-black' : 'text-white';
  const iconBg = isLightMode ? 'bg-black/[0.03] border-black/[0.08] hover:bg-black/[0.06]' : 'bg-white/5 border-white/10 hover:bg-white/10';

  return (
    <footer className={`${borderColor} border-t py-12 px-4 transition-colors duration-700`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={isLightMode ? '/Jonna Rincon Logo BL.png' : '/Jonna Rincon Logo WH.png'}
                alt="Jonna Rincon"
                className="h-8 w-auto transition-opacity duration-700"
              />
            </div>
            <p className={`${subtleText} mb-4 transition-colors duration-700`}>
              Professional producer and beatmaker crafting premium beats for artists worldwide.
            </p>
          </div>

          <div>
            <h3 className={`text-xl font-bold mb-4 ${headingColor} transition-colors duration-700`}>Quick Links</h3>
            <div className="space-y-2">
              <a
                href="#beats"
                className={`block ${subtleText} hover:${headingColor} transition-colors duration-300`}
              >
                Browse Beats
              </a>
              <a
                href="#music"
                className={`block ${subtleText} hover:${headingColor} transition-colors duration-300`}
              >
                Listen to Music
              </a>
              <a
                href="#contact"
                className={`block ${subtleText} hover:${headingColor} transition-colors duration-300`}
              >
                Get in Touch
              </a>
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-bold mb-4 ${headingColor} transition-colors duration-700`}>Follow</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/jonnarincon/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 ${iconBg} border rounded-full transition-all duration-300 hover:scale-110`}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/jonnarincon"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 ${iconBg} border rounded-full transition-all duration-300 hover:scale-110`}
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://soundcloud.com/jonnarincon"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 ${iconBg} border rounded-full transition-all duration-300 hover:scale-110`}
              >
                <CloudIcon className="w-5 h-5" />
              </a>
              <a
                href="https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 ${iconBg} border rounded-full transition-all duration-300 hover:scale-110`}
              >
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className={`${borderColor} border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-700`}>
          <p className={`${subtleText} text-sm transition-colors duration-700`}>
            Copyright &copy; 2025 Jonna Rincon. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className={`${subtleText} hover:${headingColor} transition-colors duration-300`}>
              Privacy Policy
            </a>
            <a href="#" className={`${subtleText} hover:${headingColor} transition-colors duration-300`}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
