import { Mail, Instagram, Youtube, Cloud as CloudIcon, Music } from 'lucide-react';
import { useState } from 'react';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ContactProps {
  isLightMode?: boolean;
}

export default function Contact({ isLightMode = false }: ContactProps) {
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

  const cardBg = isLightMode ? 'bg-black/[0.03] border-black/[0.08]' : 'bg-white/5 border-white/10';
  const headingColor = isLightMode ? 'text-black' : 'text-white';
  const subtleText = isLightMode ? 'text-black/40' : 'text-gray-400';
  const iconColor = isLightMode ? 'text-black/30' : 'text-gray-400';
  const inputBg = isLightMode
    ? 'bg-black/[0.03] border-black/[0.08] text-black placeholder-black/30 focus:border-black/20'
    : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/30';
  const labelColor = isLightMode ? 'text-black/50' : 'text-gray-300';
  const linkCardBg = isLightMode ? 'bg-black/[0.03] hover:bg-black/[0.06] border-black/[0.08]' : 'bg-white/5 hover:bg-white/10 border-white/10';
  const btnStyle = isLightMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200';

  return (
   <section ref={revealRef as React.RefObject<HTMLElement>} id="contact" className={`py-24 pb-32 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 ref={contactTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-3xl md:text-6xl font-black mb-4 uppercase tracking-wider">{contactTitle.display}</h2>
          <p className={`text-xl ${subtleText} transition-colors duration-700`}>Let's create something amazing together</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className={`${cardBg} border rounded-2xl p-6 md:p-8 mb-8 transition-colors duration-700`}>
              <h3 className={`text-3xl font-bold mb-6 ${headingColor} transition-colors duration-700`}>Contact Info</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className={`w-6 h-6 ${iconColor} mt-1 transition-colors duration-700`} />
                  <div>
                    <p className={`font-semibold mb-1 ${headingColor} transition-colors duration-700`}>Email</p>
                    <a
                      href="mailto:contact@jonnarincon.com"
                      className={`${subtleText} hover:${headingColor} transition-colors duration-300`}
                    >
                      contact@jonnarincon.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Music className={`w-6 h-6 ${iconColor} mt-1 transition-colors duration-700`} />
                  <div>
                    <p className={`font-semibold mb-1 ${headingColor} transition-colors duration-700`}>Response Time</p>
                    <p className={`${subtleText} transition-colors duration-700`}>Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${cardBg} border rounded-2xl p-6 md:p-8 transition-colors duration-700`}>
              <h3 className={`text-2xl font-bold mb-6 ${headingColor} transition-colors duration-700`}>Connect</h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.instagram.com/jonnarincon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-4 ${linkCardBg} border rounded-xl transition-all duration-300 hover:scale-[1.03]`}
                >
                  <Instagram className={`w-6 h-6 ${iconColor} transition-colors duration-700`} />
                  <span className={`font-semibold ${headingColor} transition-colors duration-700`}>Instagram</span>
                </a>

                <a
                  href="https://www.youtube.com/jonnarincon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-4 ${linkCardBg} border rounded-xl transition-all duration-300 hover:scale-[1.03]`}
                >
                  <Youtube className={`w-6 h-6 ${iconColor} transition-colors duration-700`} />
                  <span className={`font-semibold ${headingColor} transition-colors duration-700`}>YouTube</span>
                </a>

                <a
                  href="https://soundcloud.com/jonnarincon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-4 ${linkCardBg} border rounded-xl transition-all duration-300 hover:scale-[1.03]`}
                >
                  <CloudIcon className={`w-6 h-6 ${iconColor} transition-colors duration-700`} />
                  <span className={`font-semibold ${headingColor} transition-colors duration-700`}>SoundCloud</span>
                </a>

                <a
                  href="https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-4 ${linkCardBg} border rounded-xl transition-all duration-300 hover:scale-[1.03]`}
                >
                  <Music className={`w-6 h-6 ${iconColor} transition-colors duration-700`} />
                  <span className={`font-semibold ${headingColor} transition-colors duration-700`}>Spotify</span>
                </a>
              </div>
            </div>
          </div>

          <div className={`${cardBg} border rounded-2xl p-6 md:p-8 transition-colors duration-700`}>
            <h3 className={`text-3xl font-bold mb-6 ${headingColor} transition-colors duration-700`}>Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelColor} transition-colors duration-700`}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 ${inputBg} border rounded-xl focus:outline-none transition-all duration-300`}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelColor} transition-colors duration-700`}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 ${inputBg} border rounded-xl focus:outline-none transition-all duration-300`}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelColor} transition-colors duration-700`}>
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full px-4 py-3 ${inputBg} border rounded-xl focus:outline-none transition-all duration-300 appearance-none cursor-pointer`}
                >
                  <option value="commission">Beat Commission</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="booking">Booking</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${labelColor} transition-colors duration-700`}>
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className={`w-full px-4 py-3 ${inputBg} border rounded-xl focus:outline-none transition-all duration-300 resize-none`}
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 ${btnStyle} rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02]`}
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
