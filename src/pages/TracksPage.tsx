import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Play, ExternalLink, ChevronLeft, ChevronRight, Music, Headphones, Disc3, Radio, Award, Mic2, ChevronDown } from 'lucide-react';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { setCurrentTrack } from '../components/GlobalAudioPlayer';
import TrackListItem from '../components/TrackListItem';
import { useTracks } from '../hooks/useTracks';
import { useRemixes } from '../hooks/useRemixes';

const buttons = [
  { id: 'tracks', label: 'Tracks', icon: Music },
  { id: 'djsets', label: 'DJ Sets', icon: Radio },
  { id: 'remixes', label: 'Remixes', icon: Disc3 },
  { id: 'productions', label: 'Productions', icon: Headphones },
  { id: 'spotify', label: 'Spotify', icon: Music },
  { id: 'support', label: 'Support', icon: Award },
];

const spotifyPlaylists = [
  { name: 'Top Tracks', embedUrl: 'https://open.spotify.com/embed/artist/6o3BlWTeK4EKUyByo35y6F?utm_source=generator' },
  { name: 'Playlist 2', embedUrl: 'https://open.spotify.com/embed/playlist/5SaEeqVSV9vyLUvqsrrfJ7?utm_source=generator&theme=0' },
  { name: 'Playlist 3', embedUrl: 'https://open.spotify.com/embed/playlist/7mIjrYgNeQxVw2lBBsEDjE?utm_source=generator&theme=0' },
  { name: 'Playlist 4', embedUrl: 'https://open.spotify.com/embed/playlist/5smfHiU4egb6uyHYzgmqdC?utm_source=generator' },
  { name: 'This is Jonna Rincon', embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO3LPWh3?utm_source=generator' },
];

const compilations = [
  { id: 'this-is', name: 'This Is Jonna Rincon', url: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO3LPWh3', cover: 'ThisIsJonna.png', type: 'Playlist' },
  { id: 'dj-sets', name: 'DJ SETS', url: 'https://youtube.com/playlist?list=PLgWPe6V88vwBmK5X5WCsj5kvvCb4IXjkM', cover: 'TN-DJSet.jpg', type: 'Video Series' },
  { id: 'mix-master', name: 'Mix & Master', url: 'https://open.spotify.com/playlist/5smfHiU4egb6uyHYzgmqdC', cover: 'MixedBy.png', type: 'Production' },
  { id: 'moombahton', name: 'Moombah Time', url: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO3LPWh3', cover: 'MoombahTime.png', type: 'Genre' },
  { id: 'vlogs', name: 'Vlogs', url: 'https://youtube.com/playlist?list=PLgWPe6V88vwAoxr8xVTv85989fwEe5a10', cover: 'Vlog Foto.png', type: 'Video Series' },
];

// Track data structure
interface Track {
  id: string;
  artist: string;
  title: string;
  audioUrl?: string;
  coverArt?: string;
  createdAt: number;     // Timestamp for sorting
  type?: 'Album' | 'EP' | 'Single' | 'Exclusive';
  year?: number;
  collab?: 'Solo' | 'Collab';
  genre?: string;
  bpm?: number;
  duration?: string;
}

// Remix Track Interface
interface RemixTrack extends Track {
  remixType?: 'Remix' | 'Edit' | 'Bootleg';
}

const supportMentions = [
  { name: 'MTV', description: 'Featured multiple times on MTV platforms', type: 'Media' },
  { name: 'Qlas & Blacka', description: 'Support from one of the biggest Dutch rap duos', type: 'Artist' },
  { name: 'Sidney Schmeltz', description: 'Recognized by the renowned DJ & producer', type: 'Artist' },
  { name: 'Servinio', description: 'Support from the Dutch rap & R&B artist', type: 'Artist' },
  { name: 'Xony', description: 'Co-sign from the collective and producer', type: 'Artist' },
  { name: 'Scarface', description: 'Recognized by the crew', type: 'Artist' },
  { name: 'Jared', description: 'Known for his viral house hit — track support', type: 'Artist' },
  { name: 'Blockparty', description: 'Support from the Dutch collective', type: 'Artist' },
  { name: 'Johnny Sellah', description: 'Recognized by the Dutch rap heavyweight', type: 'Artist' },
  { name: 'Makkie', description: 'Support from the Amsterdam rap legend', type: 'Artist' },
  { name: 'Justice Toch', description: 'Support from the producer and engineer', type: 'Artist' },
  { name: 'Jerrih', description: 'Collaboration and track support', type: 'Artist' },
  { name: 'Dreyh', description: 'Recognized for production collaboration', type: 'Artist' },
  { name: 'MC MC', description: 'Support from the Dutch rapper', type: 'Artist' },
  { name: 'Firme Firma', description: 'Co-sign from the collective', type: 'Artist' },
  { name: 'Broertje', description: 'Collaboration and support', type: 'Artist' },
  { name: 'Merdan D', description: 'Recognized by the producer and artist', type: 'Artist' },
  { name: 'De Formule', description: 'Support from the crew', type: 'Artist' },
  { name: 'LV (Lucas Verse)', description: 'Collaboration on multiple tracks', type: 'Artist' },
  { name: 'Pearl Ramos', description: 'Feature and vocal support', type: 'Artist' },
  { name: 'BUR Savants', description: 'Support from the collective', type: 'Artist' },
  { name: 'Jacq B.', description: 'Collaboration on production', type: 'Artist' },
  { name: 'Jong Dios (Boozy)', description: 'Track support and collaboration', type: 'Artist' },
  { name: 'Carli', description: 'Support and collaboration', type: 'Artist' },
  { name: 'SCHETS', description: 'Recognized by the artist', type: 'Artist' },
];

const stats = [
  { value: '1M+', label: 'Spotify Streams' },
  { value: '100K+', label: 'YouTube Views' },
  { value: '100+', label: 'Original Tracks' },
  { value: '100+', label: 'Remixes & Edits' },
  { value: '10+', label: 'Years Producing' },
];

const skills = [
  { title: 'Producer', desc: 'Creating and arranging full tracks from concept to completion' },
  { title: 'Beatmaker', desc: 'Crafting instrumentals and beats across all genres' },
  { title: 'Artist', desc: 'Writing, performing, and recording vocals — combining everything into a finished track' },
  { title: 'Audio Engineer', desc: 'The technical art of recording, editing, and processing audio to achieve professional sound quality' },
  { title: 'Mix & Master', desc: 'Balancing, EQ-ing, and finalizing tracks for distribution-ready quality' },
  { title: 'DJ', desc: 'Live mixing and performing sets across multiple genres' },
  { title: 'Visual Designer', desc: 'Self-made cover arts, video editing, and visual branding' },
  { title: 'Web Developer', desc: 'This website was designed and built by Jonna Rincon' },
];

export default function TracksPage() {
  const { tracks: firebaseTracks, loading: tracksLoading } = useTracks({ status: 'published' });
  const { remixes: firebaseRemixes, loading: remixesLoading } = useRemixes({ status: 'published' });
  const [activeTab, setActiveTab] = useState('tracks');
  const [currentPlaylist, setCurrentPlaylist] = useState(0);
  const [selectedType, setSelectedType] = useState<'Album' | 'EP' | 'Single' | 'Exclusive' | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');
  const [selectedCollab, setSelectedCollab] = useState<'Solo' | 'Collab' | 'All'>('All');
  const [selectedGenre, setSelectedGenre] = useState<'EDM' | 'Rap' | 'Lo-Fi' | 'Urban' | 'All'>('All');
  const [selectedRemixType, setSelectedRemixType] = useState<'Remix' | 'Edit' | 'Bootleg' | 'All'>('All');
  const [selectedRemixYear, setSelectedRemixYear] = useState<number | 'All'>('All');
  const [selectedRemixCollab, setSelectedRemixCollab] = useState<'Solo' | 'Collab' | 'All'>('All');
  const [selectedRemixGenre, setSelectedRemixGenre] = useState<'EDM' | 'Rap' | 'Lo-Fi' | 'Urban' | 'All'>('All');
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());
  const heroTitle = useCyberDecodeInView('Music');

  // Convert Firebase tracks to local Track interface
  const demoTracks: Track[] = firebaseTracks.map(t => ({
    id: t.id,
    title: t.title,
    artist: t.artist,
    duration: '0:00',
    genre: t.genre,
    bpm: t.bpm,
    year: t.year,
    type: t.type,
    collab: t.collab,
    audioUrl: t.audioUrl,
    coverArt: t.artworkUrl,
    coverArtUrl: t.artworkUrl,
    createdAt: t.createdAt.toMillis?.() || Date.now(),
  }));

  // Convert Firebase remixes to local RemixTrack interface
  const remixTracks: RemixTrack[] = firebaseRemixes.map(r => ({
    id: r.id,
    title: r.title,
    artist: r.remixArtist,
    duration: '0:00',
    genre: r.genre,
    bpm: r.bpm,
    year: r.year,
    collab: r.collab,
    remixType: r.remixType,
    audioUrl: r.audioUrl,
    coverArt: r.artworkUrl,
    coverArtUrl: r.artworkUrl,
    createdAt: r.createdAt.toMillis?.() || Date.now(),
  }));

  const handlePlayTrack = (track: Track) => {
    // Filter tracks matching current filters and create queue
    const queue = demoTracks
      .filter((t) => {
        const typeMatch = selectedType === 'All' || t.type === selectedType;
        const yearMatch = selectedYear === 'All' || t.year === selectedYear;
        const collabMatch = selectedCollab === 'All' || t.collab === selectedCollab;
        const genreMatch = selectedGenre === 'All' || t.genre === selectedGenre;
        return typeMatch && yearMatch && collabMatch && genreMatch;
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    setCurrentTrack(track, queue);
  };

  const filteredTracks = demoTracks.filter(track => {
    const typeMatch = selectedType === 'All' || track.type === selectedType;
    const yearMatch = selectedYear === 'All' || track.year === selectedYear;
    const collabMatch = selectedCollab === 'All' || track.collab === selectedCollab;
    const genreMatch = selectedGenre === 'All' || track.genre === selectedGenre;
    return typeMatch && yearMatch && collabMatch && genreMatch;
  });

  const years = Array.from(new Set(demoTracks.map(t => t.year).filter(Boolean))).sort((a, b) => b - a) as number[];

  // Group tracks by album for Album/EP types
  const groupedTracks = filteredTracks.reduce((acc, track) => {
    if ((track.type === 'Album' || track.type === 'EP') && track.album) {
      const albumKey = `${track.type}:${track.album}`;
      if (!acc[albumKey]) {
        acc[albumKey] = {
          albumName: track.album || track.title,
          type: track.type,
          artwork: track.coverArt,
          tracks: [],
          displayTrack: track,
        };
      }
      acc[albumKey].tracks.push(track);
    } else {
      const singleKey = `single:${track.id}`;
      acc[singleKey] = {
        albumName: null,
        type: track.type,
        artwork: track.coverArt,
        tracks: [track],
        displayTrack: track,
      };
    }
    return acc;
  }, {} as Record<string, any>);

  const toggleAlbumExpand = (albumKey: string) => {
    const newExpanded = new Set(expandedAlbums);
    if (newExpanded.has(albumKey)) {
      newExpanded.delete(albumKey);
    } else {
      newExpanded.add(albumKey);
    }
    setExpandedAlbums(newExpanded);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Fixed JEIGHTENESIS Background */}
      <div className="fixed inset-0 w-full h-screen -z-10">
        <img src="/JEIGHTENESIS.jpg" alt="" className="w-full h-full object-cover" style={{objectPosition: 'center'}} />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <Navigation isDarkOverlay={true} isLightMode={false} />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end pb-16 md:pb-24 pt-40 px-6 md:px-12">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <p className="text-[10px] md:text-xs text-red-500/60 uppercase tracking-[0.4em] mb-4">Discography</p>
          <h1 ref={heroTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-6xl md:text-[8rem] lg:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter whitespace-nowrap">
            {heroTitle.display}
          </h1>
          <p className="text-white/30 text-sm md:text-base mt-6 max-w-lg">
            Over 10 years of production in FL Studio. 100+ original tracks, 100+ remixes, millions of streams.
            From moombahton to hip hop, R&B to EDM — explore the full catalog.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-6 md:gap-10 mt-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Button Navigation */}
      <section className="px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-md border border-white/[0.06] p-6 md:p-8">
            <div className="flex flex-wrap gap-3">
              {buttons.map((button) => {
                const Icon = button.icon;
                return (
                  <button
                    key={button.id}
                    onClick={() => setActiveTab(button.id)}
                    className={`flex items-center gap-2 px-6 md:px-7 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                      activeTab === button.id
                        ? 'bg-white text-black'
                        : 'bg-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.10] hover:border-white/[0.12]'
                    } border border-white/[0.06]`}
                  >
                    <Icon size={16} />
                    {button.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* === TRACKS TAB === */}
      {activeTab === 'tracks' && (
        <>
          {/* Track Filters */}
          <section className="px-6 md:px-12 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">My Tracks</h2>
              <p className="text-white/25 text-sm mb-12">Browse and filter through 50+ original tracks, remixes, and exclusives</p>

              {/* Primary Filters */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Album', 'EP', 'Single', 'Exclusive'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type as typeof selectedType)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedType === type || (type === 'All' && selectedType === 'All')
                          ? 'bg-red-600 text-white'
                          : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Year Filter */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Year</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...years].map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year as typeof selectedYear)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedYear === year
                            ? 'bg-red-600 text-white'
                            : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collab Filter */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Solo', 'Collab'].map((collab) => (
                      <button
                        key={collab}
                        onClick={() => setSelectedCollab(collab as typeof selectedCollab)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedCollab === collab
                            ? 'bg-red-600 text-white'
                            : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
                        }`}
                      >
                        {collab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Genre</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'EDM', 'Rap', 'Lo-Fi', 'Urban'].map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre as typeof selectedGenre)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedGenre === genre
                            ? 'bg-red-600 text-white'
                            : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mixed Track List / Album Groups */}
          <section className="px-6 md:px-12 py-8 md:py-16">
            <div className="max-w-7xl mx-auto">
              <p className="text-white/30 text-sm mb-6">
                Showing {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''} (newest first)
              </p>
              <div className="space-y-3">
                {Object.entries(groupedTracks)
                  .sort(([, a], [, b]) => b.displayTrack.createdAt - a.displayTrack.createdAt)
                  .map(([albumKey, group]) => {
                    const isAlbum = group.albumName && (group.type === 'Album' || group.type === 'EP');
                    const isExpanded = expandedAlbums.has(albumKey);

                    return isAlbum ? (
                      <div key={albumKey}>
                        {/* Album Header - Expandible */}
                        <button
                          onClick={() => toggleAlbumExpand(albumKey)}
                          className="w-full rounded-xl p-4 flex items-center gap-4 hover:bg-white/[0.08] transition-all duration-300 border border-white/[0.06] bg-white/[0.04] backdrop-blur-md group"
                        >
                          {/* Album Artwork */}
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600/40 to-red-900/20 border border-white/[0.08] flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {group.artwork ? (
                              <img
                                src={group.artwork}
                                alt={group.albumName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Music size={20} className="text-white/30" />
                            )}
                          </div>

                          {/* Album Info */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-sm md:text-base truncate">
                                {group.albumName}
                              </span>
                              <span className="px-2 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-wider flex-shrink-0">
                                {group.type}
                              </span>
                            </div>
                            <div className="text-white/40 text-sm mt-1">
                              {group.tracks.length} track{group.tracks.length !== 1 ? 's' : ''}
                            </div>
                          </div>

                          {/* Expand Icon */}
                          <ChevronDown
                            size={20}
                            className={`flex-shrink-0 text-white/40 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Album Tracks - Expandible Content */}
                        {isExpanded && (
                          <div className="space-y-2 mt-2 ml-4 pl-4 border-l border-white/[0.06]">
                            {group.tracks
                              .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))
                              .map((track, index) => (
                                <div key={track.id} className="flex items-center gap-3 group/track">
                                  <span className="text-white/40 text-sm font-mono w-6 text-right flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <div className="flex-1">
                                    <TrackListItem
                                      track={track}
                                      onPlay={handlePlayTrack}
                                      showType={false}
                                      showMetadata={false}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Single Tracks
                      <TrackListItem
                        key={albumKey}
                        track={group.displayTrack}
                        onPlay={handlePlayTrack}
                        showType={true}
                        showMetadata={true}
                      />
                    );
                  })}
              </div>
            </div>
          </section>

          {/* Skills & Roles */}
          <section className="px-6 md:px-12 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">What I Do</h2>
              <p className="text-white/25 text-sm mb-10">25 years old — making music since age 13-15 in FL Studio</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.title}
                    className="group bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.06]"
                  >
                    <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">{skill.title}</h3>
                    <p className="text-white/30 text-xs leading-relaxed">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* === DJ SETS TAB === */}
      {activeTab === 'djsets' && (
        <section className="px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">DJ Sets</h2>
            <p className="text-white/25 text-sm mb-10">Live mixes, festival recordings, and studio sessions</p>

            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 md:p-8 mb-8">
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                <div
                  className="absolute inset-0 z-10 transition-opacity duration-500 group-[.playing]:opacity-0 group-[.playing]:pointer-events-none"
                  onClick={(e) => {
                    const container = e.currentTarget.closest('.relative');
                    container?.classList.add('playing');
                    const iframe = container?.querySelector('iframe') as HTMLIFrameElement;
                    if (iframe) {
                      const src = iframe.src;
                      iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
                    }
                  }}
                >
                  <img src="DJI_20251017150728_0019_D.JPG" alt="DJ Set thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/videoseries?si=-lcpC5aW0SSgSOXa&amp;list=PLgWPe6V88vwBmK5X5WCsj5kvvCb4IXjkM"
                  title="DJ Sets"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ borderRadius: '16px' }}
                />
              </div>

              <a
                href="https://youtube.com/playlist?list=PLgWPe6V88vwBmK5X5WCsj5kvvCb4IXjkM"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-block text-center py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02]"
              >
                Watch All DJ Sets on YouTube
              </a>
            </div>

            {/* DJ Set Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
                <Mic2 size={24} className="text-red-500 mb-3" />
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">Live Mixing</h3>
                <p className="text-white/30 text-sm">Real-time DJ performances blending moombahton, hip hop, EDM, and more into seamless sets.</p>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
                <Radio size={24} className="text-red-500 mb-3" />
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">Multi-Genre</h3>
                <p className="text-white/30 text-sm">From moombahton to trap, from R&B to house — every set is a journey through different worlds of sound.</p>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
                <Headphones size={24} className="text-red-500 mb-3" />
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">Studio Sessions</h3>
                <p className="text-white/30 text-sm">Intimate studio recordings and production walkthroughs showing the creative process behind the music.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* === REMIXES TAB === */}
      {activeTab === 'remixes' && (
        <>
          {/* Remix Filters */}
          <section className="px-6 md:px-12 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">Remixes</h2>
              <p className="text-white/25 text-sm mb-12">Bootlegs, Remixes & Edits — Over 100+ remixes exploring all genres</p>

              {/* Primary Filters */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Remix', 'Edit', 'Bootleg'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedRemixType(type as typeof selectedRemixType)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedRemixType === type || (type === 'All' && selectedRemixType === 'All')
                          ? 'bg-red-600 text-white'
                          : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Year Filter */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Year</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...Array.from(new Set(remixTracks.map(t => t.year))).sort((a, b) => b - a)].map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedRemixYear(year as typeof selectedRemixYear)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedRemixYear === year
                            ? 'bg-red-600 text-white'
                            : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collab Filter */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Solo', 'Collab'].map((collab) => (
                      <button
                        key={collab}
                        onClick={() => setSelectedRemixCollab(collab as typeof selectedRemixCollab)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedRemixCollab === collab
                            ? 'bg-red-600 text-white'
                            : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
                        }`}
                      >
                        {collab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-3">Genre</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'EDM', 'Rap', 'Lo-Fi', 'Urban'].map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedRemixGenre(genre as typeof selectedRemixGenre)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedRemixGenre === genre
                            ? 'bg-red-600 text-white'
                            : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12]'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Remix Tracks List */}
          <section className="px-6 md:px-12 py-8 md:py-16">
            <div className="max-w-7xl mx-auto">
              <p className="text-white/30 text-sm mb-6">
                Showing {remixTracks
                  .filter((t) => {
                    const typeMatch = selectedRemixType === 'All' || t.remixType === selectedRemixType;
                    const yearMatch = selectedRemixYear === 'All' || t.year === selectedRemixYear;
                    const collabMatch = selectedRemixCollab === 'All' || t.collab === selectedRemixCollab;
                    const genreMatch = selectedRemixGenre === 'All' || t.genre === selectedRemixGenre;
                    return typeMatch && yearMatch && collabMatch && genreMatch;
                  }).length
                } remix{remixTracks.filter((t) => {
                  const typeMatch = selectedRemixType === 'All' || t.remixType === selectedRemixType;
                  const yearMatch = selectedRemixYear === 'All' || t.year === selectedRemixYear;
                  const collabMatch = selectedRemixCollab === 'All' || t.collab === selectedRemixCollab;
                  const genreMatch = selectedRemixGenre === 'All' || t.genre === selectedRemixGenre;
                  return typeMatch && yearMatch && collabMatch && genreMatch;
                }).length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-3">
                {remixTracks
                  .filter((t) => {
                    const typeMatch = selectedRemixType === 'All' || t.remixType === selectedRemixType;
                    const yearMatch = selectedRemixYear === 'All' || t.year === selectedRemixYear;
                    const collabMatch = selectedRemixCollab === 'All' || t.collab === selectedRemixCollab;
                    const genreMatch = selectedRemixGenre === 'All' || t.genre === selectedRemixGenre;
                    return typeMatch && yearMatch && collabMatch && genreMatch;
                  })
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((remix) => (
                    <TrackListItem
                      key={remix.id}
                      track={remix}
                      onPlay={(t) => {
                        const queue = remixTracks
                          .filter((r) => {
                            const typeMatch = selectedRemixType === 'All' || r.remixType === selectedRemixType;
                            const yearMatch = selectedRemixYear === 'All' || r.year === selectedRemixYear;
                            const collabMatch = selectedRemixCollab === 'All' || r.collab === selectedRemixCollab;
                            const genreMatch = selectedRemixGenre === 'All' || r.genre === selectedRemixGenre;
                            return typeMatch && yearMatch && collabMatch && genreMatch;
                          })
                          .sort((a, b) => b.createdAt - a.createdAt);
                        setCurrentTrack(t, queue);
                      }}
                      showType={false}
                      showMetadata={true}
                    />
                  ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* === PRODUCTIONS TAB === */}
      {activeTab === 'productions' && (
        <section className="px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">Productions</h2>
            <p className="text-white/25 text-sm mb-10">Original beats, collaborations, and commissioned work</p>

            {/* Mix & Master Showcase */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 md:p-8 mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Mixed & Mastered by Jonna Rincon</h3>
              <div className="rounded-2xl overflow-hidden relative">
                <iframe
                  style={{ borderRadius: '16px' }}
                  src="https://open.spotify.com/embed/playlist/5smfHiU4egb6uyHYzgmqdC?utm_source=generator"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Production Process */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-lg font-black uppercase tracking-tight mb-3">The Process</h3>
                <p className="text-white/30 text-sm leading-relaxed">
                  Every track starts in FL Studio — the DAW where it all began over 10 years ago. From the first beat to the final master,
                  every step is handled in-house. Self-made cover arts, self-mixed, self-mastered. Full creative control from start to finish.
                </p>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-lg font-black uppercase tracking-tight mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {['Moombahton', 'Hip Hop', 'R&B', 'Trap', 'EDM', 'Lo-Fi', 'House', 'Drill', 'Afrobeats', 'Reggaeton', 'Pop', 'Latin'].map((genre) => (
                    <span key={genre} className="px-3 py-1.5 bg-white/[0.06] rounded-full text-xs font-bold text-white/50 uppercase tracking-wider">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* === SPOTIFY TAB === */}
      {activeTab === 'spotify' && (
        <section className="px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">Spotify Playlists</h2>
            <p className="text-white/25 text-sm mb-10">Curated collections and compilations</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
              {compilations.map((comp) => (
                <a
                  key={comp.id}
                  href={comp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] mb-3">
                    <img src={comp.cover} alt={comp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                        <Play size={20} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{comp.name}</h3>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider">{comp.type}</p>
                </a>
              ))}
            </div>

            {/* Full Spotify Player with Arrows */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <p className="text-lg font-bold text-white">{spotifyPlaylists[currentPlaylist].name}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPlaylist(Math.max(0, currentPlaylist - 1))}
                    className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.06] transition-all"
                    disabled={currentPlaylist === 0}
                  >
                    <ChevronLeft size={18} className={currentPlaylist === 0 ? 'text-white/10' : 'text-white/40'} />
                  </button>
                  <button
                    onClick={() => setCurrentPlaylist(Math.min(spotifyPlaylists.length - 1, currentPlaylist + 1))}
                    className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.06] transition-all"
                    disabled={currentPlaylist === spotifyPlaylists.length - 1}
                  >
                    <ChevronRight size={18} className={currentPlaylist === spotifyPlaylists.length - 1 ? 'text-white/10' : 'text-white/40'} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-2">
                  {spotifyPlaylists.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPlaylist(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentPlaylist ? 'bg-red-500 w-6' : 'bg-white/10 w-1.5 hover:bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden relative">
                {spotifyPlaylists.map((playlist, i) => (
                  <div key={i} className={`transition-opacity duration-500 ${i === currentPlaylist ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
                    <iframe
                      style={{ borderRadius: '16px' }}
                      src={playlist.embedUrl}
                      width="100%"
                      height="400"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <a
                href="https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-block text-center py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02]"
              >
                Open in Spotify
              </a>
            </div>
          </div>
        </section>
      )}

      {/* === SUPPORT TAB === */}
      {activeTab === 'support' && (
        <section className="px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">Support</h2>
            <p className="text-white/25 text-sm mb-10">
              Recognized by major platforms and artists. Track mentions, playlist features, and co-signs from the biggest names.
            </p>

            {/* Featured Support */}
            <div className="bg-gradient-to-br from-red-600/20 to-red-900/10 backdrop-blur-md border border-red-500/20 rounded-3xl p-6 md:p-10 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Award size={28} className="text-red-400" />
                <h3 className="text-2xl font-black uppercase tracking-tight">MTV Featured</h3>
              </div>
              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                Jonna Rincon has been featured on MTV multiple times — gaining international exposure
                and recognition for his unique sound and production style.
              </p>
            </div>

            {/* Artist Support Grid */}
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Artist Co-Signs & Support</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {supportMentions.filter(s => s.type === 'Artist').map((mention) => (
                <div
                  key={mention.name}
                  className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center">
                      <span className="text-xs font-black text-white/60">{mention.name.charAt(0)}</span>
                    </div>
                    <h4 className="text-base font-black text-white">{mention.name}</h4>
                  </div>
                  <p className="text-white/30 text-xs leading-relaxed">{mention.description}</p>
                </div>
              ))}
            </div>

            {/* Streaming Stats */}
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Streaming Numbers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 text-center">
                <p className="text-3xl md:text-4xl font-black text-red-400">1M+</p>
                <p className="text-white/30 text-xs uppercase tracking-wider mt-2">Spotify Streams</p>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 text-center">
                <p className="text-3xl md:text-4xl font-black text-red-400">100K+</p>
                <p className="text-white/30 text-xs uppercase tracking-wider mt-2">YouTube Views</p>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 text-center">
                <p className="text-3xl md:text-4xl font-black text-red-400">100+</p>
                <p className="text-white/30 text-xs uppercase tracking-wider mt-2">Tracks Released</p>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 text-center">
                <p className="text-3xl md:text-4xl font-black text-red-400">100+</p>
                <p className="text-white/30 text-xs uppercase tracking-wider mt-2">Remixes & Edits</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Want a Custom Beat?</h2>
          <p className="text-white/30 text-sm md:text-base mb-8 max-w-md mx-auto">
            Browse the beat store or get in touch for custom productions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop/beats" className="px-8 py-3.5 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-white/90 transition-all hover:scale-105 rounded-2xl">
              Beat Store
            </Link>
            <Link to="/contact" className="px-8 py-3.5 bg-white/[0.06] border border-white/[0.08] text-white font-bold text-sm uppercase tracking-widest hover:bg-white/[0.10] transition-all hover:scale-105 rounded-2xl">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
