import { Mail, Instagram, Youtube, Cloud as CloudIcon, Music } from 'lucide-react';
import { useState } from 'react';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const contactTitle = useCyberDecodeInView('Get In Touch');
  const { ref: revealRef, isVisible } = useScrollReveal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'commission',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section ref={revealRef as React.RefObject<HTMLElement>} id="contact" className={`py-24 pb-32 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 ref={contactTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-4xl md:text-7xl font-black mb-3 uppercase tracking-wider text-white">{contactTitle.display}</h2>
          <p className="text-lg text-white/40">Let's create something amazing together</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left - Info */}
          <div className="space-y-5">
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Info</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-white/25 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-0.5 text-white text-sm">Email</p>
                    <a href="mailto:contact@jonnarincon.com" className="text-white/40 hover:text-white transition-colors text-sm">
                      contact@jonnarincon.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Music className="w-5 h-5 text-white/25 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-0.5 text-white text-sm">Response Time</p>
                    <p className="text-white/40 text-sm">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-bold mb-5 text-white">Connect</h3>
              <div className="grid grid-cols-2 gap-3">
                <a href="https://www.instagram.com/jonnarincon/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-2xl transition-all duration-300 hover:scale-[1.03]">
                  <Instagram className="w-5 h-5 text-white/30" />
                  <span className="font-semibold text-white text-sm">Instagram</span>
                </a>
                <a href="https://www.youtube.com/jonnarincon" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-2xl transition-all duration-300 hover:scale-[1.03]">
                  <Youtube className="w-5 h-5 text-white/30" />
                  <span className="font-semibold text-white text-sm">YouTube</span>
                </a>
                <a href="https://soundcloud.com/jonnarincon" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-2xl transition-all duration-300 hover:scale-[1.03]">
                  <CloudIcon className="w-5 h-5 text-white/30" />
                  <span className="font-semibold text-white text-sm">SoundCloud</span>
                </a>
                <a href="https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-2xl transition-all duration-300 hover:scale-[1.03]">
                  <Music className="w-5 h-5 text-white/30" />
                  <span className="font-semibold text-white text-sm">Spotify</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-6 text-white">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-2 text-white/50 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 rounded-2xl focus:outline-none focus:border-white/20 transition-all duration-300"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-white/50 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 rounded-2xl focus:outline-none focus:border-white/20 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-white/50 uppercase tracking-wider">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] text-white rounded-2xl focus:outline-none focus:border-white/20 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="commission">Beat Commission</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="booking">Booking</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-white/50 uppercase tracking-wider">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 rounded-2xl focus:outline-none focus:border-white/20 transition-all duration-300 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/90 hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
