import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function About() {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    '/DJI_20251115114029_0004_D.JPG',
    '/IMG_1027.jpg',
    '/Maastricht Screenshot 15-12-25.png'
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="about" className="py-8 md:py-80 pb-49 px-4 bg-transparent">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-32">
          {/* GALERIJ - Met ID en extra spacing op mobile */}
          <div id="about-gallery" className="py-12 md:py-0">
            {/* Main Image carousel */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`transition-opacity duration-500 ${
                    idx === currentImage ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Jonna Rincon ${idx + 1}`}
                    className="w-full h-auto object-cover"
                    style={{ minHeight: '300px', maxHeight: '500px' }}
                  />
                </div>
              ))}
            </div>

            {/* Navigation buttons onder foto */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <button
                onClick={prevImage}
                className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-black/60 backdrop-blur-md border border-purple-500/30 flex items-center justify-center hover:bg-purple-600/80 hover:scale-110 transition-all"
                aria-label="Previous image"
              >
                <ChevronUp className="w-5 h-5 lg:w-7 lg:h-7 rotate-[-90deg]" />
              </button>

              <div className="flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentImage ? 'w-8 bg-purple-400' : 'w-2 bg-gray-600'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextImage}
                className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-black/60 backdrop-blur-md border border-purple-500/30 flex items-center justify-center hover:bg-purple-600/80 hover:scale-110 transition-all"
                aria-label="Next image"
              >
                <ChevronDown className="w-5 h-5 lg:w-7 lg:h-7 rotate-[-90deg]" />
              </button>
            </div>
          </div>

          {/* BIO - Met ID en VEEL KLEINERE TEKST + MINDER PADDING TOP MOBILE */}
          <div id="about-bio" className="pt-4 md:pt-0">
            <h3 className="text-2xl lg:text-4xl font-bold mb-2 md:mb-4 neon-glow">About Jonna</h3>
            <div className="space-y-2 text-gray-300 text-xs lg:text-lg leading-relaxed">
              <p>
                Jonathan aka <span className="text-purple-400 font-semibold">j18</span> is a human being with a creative mind which is described by many people as <span className="italic">"not from this world"</span>. You may already recognize his J18 tag at the beginning and/or end of every track, or by the clock sound in his work.
              </p>
              <p>
                Mostly known for his raw and authentic moombahton style in tracks or beats. But have in mind that this young man has much to offer. From modern rap beats to the dirty old classic hip hop beats, from warm and smooth r&b instrumentals to the world of EDM (electronic dance music) to studying to jonna's lo-fi instrumentals which he made on his trip on earth;
              </p>
              <p>
                Born in Maastricht, The Netherlands & based in Tilburg he began making music when first made contact with any music instrument nearby. When he visited his nephews in Dominican Republic, he was shown FL Studio for the first time. When Jonna saw that it was possible to make a track with a PC, he made his first track immediately together with his oldest nephew and that's where the music production journey started.
              </p>
              <p>
                10+ Years later and the stuff what he can do with a creative program like that is absolute crazy. From the most little things and the most weird noises....never-mind, Jonna Rincon is able to make something out of it... And you can hear that on songs like <span className="text-purple-400">___</span> and <span className="text-purple-400">___</span> which have been played on MTV and the Dutch Radio. Not there yet, but on the way. J18
              </p>
              <p className="text-purple-300 font-semibold text-xs lg:text-xl italic">
                (J18=Jeighteen) (Jeighteen=his tag & clothing/brand & nickname)
              </p>
              <p className="text-purple-300 font-semibold text-xs lg:text-xl">
                Based in the Netherlands, working with artists worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}