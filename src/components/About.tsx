export default function About() {
  return (
    <section id="about" className="py-16 md:py-32 px-4 bg-transparent">
      <div className="max-w-[1400px] mx-auto">

        {/* BLOK 1: THE STORY */}
        <div className="mb-16 md:mb-32">
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-wider mb-6 md:mb-8">
            The Story
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-3xl mb-10 md:mb-14">
            Jonathan aka <span className="text-white font-semibold">j18</span> is a human being with a creative mind which is described by many people as <span className="italic">"not from this world"</span>. You may already recognize his J18 tag at the beginning and/or end of every track, or by the clock sound in his work.
          </p>
          <div className="w-full overflow-hidden rounded-lg">
            <img
              src="/DJI_20251115114029_0004_D.JPG"
              alt="Jonna Rincon aerial"
              className="w-full h-[300px] md:h-[600px] object-cover"
            />
          </div>
        </div>

        {/* BLOK 2: THE SOUND — foto links, tekst rechts */}
        <div className="mb-16 md:mb-32 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
          <div className="overflow-hidden rounded-lg">
            <img
              src="/DJ Screenshot 3-2-26.png"
              alt="Jonna Rincon DJ"
              className="w-full h-[300px] md:h-[500px] object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-wider mb-6 md:mb-8">
              The Sound
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              Mostly known for his raw and authentic moombahton style in tracks or beats. But have in mind that this young man has much to offer. From modern rap beats to the dirty old classic hip hop beats, from warm and smooth r&b instrumentals to the world of EDM (electronic dance music) to studying to jonna's lo-fi instrumentals which he made on his trip on earth.
            </p>
          </div>
        </div>

        {/* BLOK 3: THE JOURNEY — tekst links, foto rechts */}
        <div className="mb-16 md:mb-32 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-wider mb-6 md:mb-8">
              The Journey
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              Born in Maastricht, The Netherlands & based in Tilburg he began making music when first made contact with any music instrument nearby. When he visited his nephews in Dominican Republic, he was shown FL Studio for the first time. When Jonna saw that it was possible to make a track with a PC, he made his first track immediately together with his oldest nephew and that's where the music production journey started.
            </p>
          </div>
          <div className="order-1 md:order-2 overflow-hidden rounded-lg">
            <img
              src="/Schermafbeelding 2025-12-16 om 17.09.27.png"
              alt="Jonna Rincon studio"
              className="w-full h-[300px] md:h-[500px] object-cover"
            />
          </div>
        </div>

        {/* BLOK 4: Foto grid + closing quote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-14">
          <div className="overflow-hidden rounded-lg">
            <img
              src="/IMG_1027.jpg"
              alt="Jonna Rincon"
              className="w-full h-[250px] md:h-[400px] object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg">
            <img
              src="/Maastricht Screenshot 15-12-25.png"
              alt="Jonna Rincon Maastricht"
              className="w-full h-[250px] md:h-[400px] object-cover"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 font-semibold text-sm md:text-xl italic mb-2">
            (J18=Jeighteen) (Jeighteen=his tag & clothing/brand & nickname)
          </p>
          <p className="text-gray-500 text-sm md:text-lg">
            10+ years of production. Based in the Netherlands, working with artists worldwide.
          </p>
        </div>

      </div>
    </section>
  );
}
