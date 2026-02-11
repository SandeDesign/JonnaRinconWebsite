import { Mail, Instagram, Youtube, Cloud as CloudIcon, Music } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
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
   <section id="contact" className="py-24 pb-32 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-6xl font-bold mb-4 neon-glow">Get In Touch</h2>
          <p className="text-xl text-gray-400">Let's create something amazing together</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="glass rounded-2xl p-8 neon-border-subtle mb-8">
              <h3 className="text-3xl font-bold mb-6 text-purple-300">Contact Info</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <a
                      href="mailto:contact@jonnarincon.com"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      contact@jonnarincon.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Music className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Response Time</p>
                    <p className="text-gray-400">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 neon-border-subtle">
              <h3 className="text-2xl font-bold mb-6 text-purple-300">Connect</h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.instagram.com/jonnarincon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-purple-900/20 hover:bg-purple-900/40 rounded-xl transition-all neon-border-subtle hover:scale-105"
                >
                  <Instagram className="w-6 h-6 text-purple-400" />
                  <span className="font-semibold">Instagram</span>
                </a>

                <a
                  href="https://www.youtube.com/jonnarincon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-purple-900/20 hover:bg-purple-900/40 rounded-xl transition-all neon-border-subtle hover:scale-105"
                >
                  <Youtube className="w-6 h-6 text-purple-400" />
                  <span className="font-semibold">YouTube</span>
                </a>

                <a
                  href="https://soundcloud.com/jonnarincon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-purple-900/20 hover:bg-purple-900/40 rounded-xl transition-all neon-border-subtle hover:scale-105"
                >
                  <CloudIcon className="w-6 h-6 text-purple-400" />
                  <span className="font-semibold">SoundCloud</span>
                </a>

                <a
                  href="https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-purple-900/20 hover:bg-purple-900/40 rounded-xl transition-all neon-border-subtle hover:scale-105"
                >
                  <Music className="w-6 h-6 text-purple-400" />
                  <span className="font-semibold">Spotify</span>
                </a>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 neon-border-subtle">
            <h3 className="text-3xl font-bold mb-6 text-purple-300">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-purple-200">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:neon-border-subtle transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-purple-200">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:neon-border-subtle transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-purple-200">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 rounded-xl text-white focus:outline-none focus:neon-border-subtle transition-all appearance-none cursor-pointer"
                >
                  <option value="commission">Beat Commission</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="booking">Booking</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-purple-200">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-black/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:neon-border-subtle transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-lg transition-all neon-border hover:scale-105"
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
