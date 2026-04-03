import React from 'react';
import { Zap, Headphones, Music, Volume2, Users, Palette, ArrowRight } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useCyberDecodeInView } from '../../hooks/useCyberDecode';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  rate: string;
  cta: string;
  gradient: string;
}

const services: Service[] = [
  {
    id: 'beat-production',
    name: 'Beat Production',
    description: 'Custom beats tailored to your style. From hip-hop to electronic, trap to ambient soundscapes.',
    icon: Zap,
    rate: 'From €50',
    cta: 'Inquire Now',
    gradient: 'from-red-600 to-red-500',
  },
  {
    id: 'audio-engineering',
    name: 'Audio Engineering',
    description: 'Professional recording, arrangement, and production engineering for your tracks.',
    icon: Headphones,
    rate: 'From €75',
    cta: 'Get Started',
    gradient: 'from-pink-600 to-pink-500',
  },
  {
    id: 'music-lessons',
    name: 'Music Lessons',
    description: 'Learn production, DJing, or music theory from an experienced electronic music artist.',
    icon: Music,
    rate: 'From €40/hr',
    cta: 'Book Lesson',
    gradient: 'from-purple-600 to-purple-500',
  },
  {
    id: 'mixing-mastering',
    name: 'Mixing & Mastering',
    description: 'Professional mixing and mastering to bring your tracks to commercial quality.',
    icon: Volume2,
    rate: 'From €100',
    cta: 'Submit Track',
    gradient: 'from-blue-600 to-blue-500',
  },
  {
    id: 'collaboration',
    name: 'Collaboration Consulting',
    description: 'Guidance on creative partnerships, production workflows, and collaborative projects.',
    icon: Users,
    rate: 'From €60',
    cta: 'Discuss',
    gradient: 'from-cyan-600 to-cyan-500',
  },
  {
    id: 'sound-design',
    name: 'Sound Design',
    description: 'Custom sound design, synth programming, and audio effects for your unique sonic identity.',
    icon: Palette,
    rate: 'From €85',
    cta: 'Create',
    gradient: 'from-indigo-600 to-indigo-500',
  },
];

const ServicesPage: React.FC = () => {
  const heroTitle = useCyberDecodeInView('Services');

  return (
    <div className="min-h-screen text-white">
      {/* Fixed JEIGHTENESIS Background */}
      <div className="fixed inset-0 w-full h-screen -z-10">
        <img src="/JEIGHTENESIS.jpg" alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center' }} />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <Navigation isDarkOverlay={true} isLightMode={false} />

      {/* Hero Section - Centered Layout */}
      <section className="relative pt-40 px-6 md:px-12 pb-4">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <h1 ref={heroTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-8 text-center">
            {heroTitle.display}
          </h1>

          {/* Description */}
          <p className="text-white/30 text-sm md:text-base text-center max-w-2xl mx-auto">
            Professional music production services to elevate your sound. Get expert guidance from an experienced electronic music artist.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 hover:border-white/[0.12] transition-all duration-500 hover:scale-[1.02] hover:bg-white/[0.08] flex flex-col"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{service.name}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1">{service.description}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
                    <span className="text-sm text-white/30 font-bold uppercase tracking-wider">{service.rate}</span>
                    <button className="flex items-center gap-2 text-xs text-white/40 group-hover:text-red-400 transition-colors font-bold uppercase tracking-wider hover:gap-3">
                      {service.cta}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">Ready to Work Together?</h2>
            <p className="text-white/30 text-sm md:text-base mb-8 max-w-md mx-auto">
              Have a custom project or want to discuss something specific? Get in touch to get started.
            </p>
            <button className="px-8 md:px-10 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all hover:scale-[1.03]">
              Contact Me
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
