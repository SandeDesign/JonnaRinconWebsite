import SocialCard from './SocialCard';
import { useInView } from '../hooks/useInView';

function AnimatedBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, isInView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-12 md:py-20 px-4 bg-transparent">
      <div className="max-w-[1200px] mx-auto">

        {/* BLOK 1: THE STORY */}
        <div className="mb-10 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <AnimatedBlock>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-3 md:mb-4">
              The Story
            </h2>
            <div className="w-12 h-0.5 bg-white/30 mb-4 md:mb-6" />
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              Jonathan aka <span className="text-white font-semibold">j18</span> is a human being with a creative mind which is described by many people as <span className="italic text-gray-300">"not from this world"</span>. You may already recognize his <span className="text-white font-semibold">J18 tag</span> at the beginning and/or end of every track, or by the clock sound in his work.
            </p>
          </AnimatedBlock>
          <SocialCard
            imageSrc="/DJI_20251115114029_0004_D.JPG"
            imageAlt="Jonna Rincon aerial"
            location="Netherlands"
            caption="Creative mind at work. The story continues..."
            initialLikes={847}
          />
        </div>

        {/* BLOK 2: THE SOUND — card links, tekst rechts */}
        <div className="mb-10 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="order-2 md:order-1">
            <SocialCard
              imageSrc="/DJ Screenshot 3-2-26.png"
              imageAlt="Jonna Rincon DJ"
              location="DJ Set"
              caption="Raw and authentic. From moombahton to lo-fi."
              initialLikes={623}
              delay={100}
            />
          </div>
          <AnimatedBlock delay={150}>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-3 md:mb-4">
                The Sound
              </h2>
              <div className="w-12 h-0.5 bg-white/30 mb-4 md:mb-6" />
              <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                Mostly known for his raw and authentic <span className="text-white/80 font-medium">moombahton</span> style in tracks or beats. But have in mind that this young man has much to offer. From modern <span className="text-white/80 font-medium">rap beats</span> to the dirty old classic <span className="text-white/80 font-medium">hip hop</span> beats, from warm and smooth <span className="text-white/80 font-medium">r&b</span> instrumentals to the world of <span className="text-white/80 font-medium">EDM</span> to studying to jonna's <span className="text-white/80 font-medium">lo-fi</span> instrumentals which he made on his trip on earth.
              </p>
            </div>
          </AnimatedBlock>
        </div>

        {/* BLOK 3: THE JOURNEY — tekst links, card rechts */}
        <div className="mb-10 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <AnimatedBlock>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-3 md:mb-4">
              The Journey
            </h2>
            <div className="w-12 h-0.5 bg-white/30 mb-4 md:mb-6" />
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              Born in <span className="text-white font-semibold">Maastricht, The Netherlands</span> & based in <span className="text-white font-semibold">Tilburg</span> he began making music when first made contact with any music instrument nearby. When he visited his nephews in <span className="text-white font-semibold">Dominican Republic</span>, he was shown <span className="text-white font-semibold">FL Studio</span> for the first time. When Jonna saw that it was possible to make a track with a PC, he made his first track immediately together with his oldest nephew and that's where the music production journey started.
            </p>
          </AnimatedBlock>
          <SocialCard
            imageSrc="/Schermafbeelding 2025-12-16 om 17.09.27.png"
            imageAlt="Jonna Rincon studio"
            location="In the studio"
            caption="Where it all began. FL Studio changed everything."
            initialLikes={512}
            delay={100}
          />
        </div>

        {/* BLOK 4: Bottom cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <SocialCard
            imageSrc="/IMG_1027.jpg"
            imageAlt="Jonna Rincon"
            location="Tilburg, NL"
            caption="10+ years of production. The grind never stops."
            initialLikes={934}
          />
          <SocialCard
            imageSrc="/Maastricht Screenshot 15-12-25.png"
            imageAlt="Jonna Rincon Maastricht"
            location="Maastricht, NL"
            caption="Where the roots are. Born and raised."
            initialLikes={718}
            delay={150}
          />
        </div>

        {/* Closing quote */}
        <AnimatedBlock>
          <div className="text-center pt-2">
            <p className="text-gray-500 text-xs md:text-sm italic mb-1">
              (J18=Jeighteen) (Jeighteen=his tag & clothing/brand & nickname)
            </p>
            <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">
              10+ years of production. Based in the Netherlands, working with artists worldwide.
            </p>
          </div>
        </AnimatedBlock>

      </div>
    </section>
  );
}
