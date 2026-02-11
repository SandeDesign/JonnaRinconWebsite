// Bolt Database Setup for Beat Store - MET 10 EXTRA BEATS
import { Beat, Order } from './types';

class BoltDatabase {
  private beats: Beat[] = [];
  private orders: Order[] = [];
  private subscribers: string[] = [];

  constructor() {
    this.initializeBeats();
  }

  private initializeBeats() {
    this.beats = [
      {
        id: '1',
        title: 'Midnight Dreams',
        artist: 'Jonna Rincon',
        bpm: 140,
        key: 'Am',
        genre: 'Trap',
        price: 29.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        artwork_url: 'https://images.pexels.com/photos/114820/pexels-photo-114820.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['dark', 'trap', 'atmospheric'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Purple Haze',
        artist: 'Jonna Rincon',
        bpm: 128,
        key: 'Gm',
        genre: 'Hip Hop',
        price: 39.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        artwork_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['chill', 'smooth', 'purple'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Neon Nights',
        artist: 'Jonna Rincon',
        bpm: 150,
        key: 'F#m',
        genre: 'Drill',
        price: 49.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        artwork_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['hard', 'drill', 'uk'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Studio Sessions',
        artist: 'Jonna Rincon',
        bpm: 90,
        key: 'Dm',
        genre: 'R&B',
        price: 35.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        artwork_url: 'https://images.pexels.com/photos/1933900/pexels-photo-1933900.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['smooth', 'rnb', 'melodic'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        title: 'Bassline Theory',
        artist: 'Jonna Rincon',
        bpm: 174,
        key: 'Em',
        genre: 'Drum & Bass',
        price: 45.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        artwork_url: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['dnb', 'liquid', 'fast'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '6',
        title: 'Lost in Tokyo',
        artist: 'Jonna Rincon',
        bpm: 120,
        key: 'Cm',
        genre: 'Lo-Fi',
        price: 25.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        artwork_url: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['lofi', 'chill', 'study'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // 10 NIEUWE BEATS
      {
        id: '7',
        title: 'Urban Jungle',
        artist: 'Jonna Rincon',
        bpm: 135,
        key: 'Bm',
        genre: 'Trap',
        price: 32.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        artwork_url: 'https://images.pexels.com/photos/1729951/pexels-photo-1729951.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['urban', 'street', 'hard'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '8',
        title: 'Skyline Dreams',
        artist: 'Jonna Rincon',
        bpm: 110,
        key: 'E',
        genre: 'R&B',
        price: 38.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        artwork_url: 'https://images.pexels.com/photos/1089440/pexels-photo-1089440.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['smooth', 'melodic', 'romantic'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '9',
        title: 'Digital Waves',
        artist: 'Jonna Rincon',
        bpm: 145,
        key: 'A#m',
        genre: 'Trap',
        price: 42.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        artwork_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['digital', 'futuristic', 'bass'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '10',
        title: 'Moonlight Vibes',
        artist: 'Jonna Rincon',
        bpm: 95,
        key: 'F',
        genre: 'Lo-Fi',
        price: 28.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        artwork_url: 'https://images.pexels.com/photos/1820563/pexels-photo-1820563.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['chill', 'night', 'ambient'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '11',
        title: 'Fire & Ice',
        artist: 'Jonna Rincon',
        bpm: 160,
        key: 'C#m',
        genre: 'Drill',
        price: 46.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
        artwork_url: 'https://images.pexels.com/photos/1629239/pexels-photo-1629239.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['hard', 'energetic', 'intense'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '12',
        title: 'Golden Hour',
        artist: 'Jonna Rincon',
        bpm: 85,
        key: 'G',
        genre: 'R&B',
        price: 36.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
        artwork_url: 'https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['warm', 'sunset', 'smooth'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '13',
        title: 'Cosmic Flow',
        artist: 'Jonna Rincon',
        bpm: 132,
        key: 'Bb',
        genre: 'Hip Hop',
        price: 40.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
        artwork_url: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['space', 'ambient', 'hip hop'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '14',
        title: 'Velocity Rush',
        artist: 'Jonna Rincon',
        bpm: 170,
        key: 'D#m',
        genre: 'Drum & Bass',
        price: 44.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
        artwork_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['fast', 'energy', 'dnb'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '15',
        title: 'Café Dreams',
        artist: 'Jonna Rincon',
        bpm: 100,
        key: 'Am',
        genre: 'Lo-Fi',
        price: 26.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
        artwork_url: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['lofi', 'coffee', 'relax'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '16',
        title: 'Street Lights',
        artist: 'Jonna Rincon',
        bpm: 138,
        key: 'Fm',
        genre: 'Hip Hop',
        price: 37.00,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
        artwork_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['street', 'urban', 'night'],
        license_basic: true,
        license_premium: true,
        license_exclusive: true,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  beats = {
    getAll: async (): Promise<Beat[]> => {
      return [...this.beats];
    },

    getById: async (id: string): Promise<Beat | null> => {
      return this.beats.find((b) => b.id === id) || null;
    },

    getByGenre: async (genre: string): Promise<Beat[]> => {
      return this.beats.filter((b) => b.genre === genre);
    },

    search: async (term: string): Promise<Beat[]> => {
      const lowerTerm = term.toLowerCase();
      return this.beats.filter(
        (b) =>
          b.title.toLowerCase().includes(lowerTerm) ||
          b.tags.some((tag) => tag.toLowerCase().includes(lowerTerm)) ||
          b.genre.toLowerCase().includes(lowerTerm)
      );
    },

    create: async (beat: Omit<Beat, 'id' | 'created_at' | 'updated_at'>): Promise<Beat> => {
      const newBeat: Beat = {
        ...beat,
        id: String(this.beats.length + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.beats.push(newBeat);
      return newBeat;
    },
  };

  orders = {
    getAll: async (): Promise<Order[]> => {
      return [...this.orders];
    },

    create: async (order: Omit<Order, 'id' | 'created_at'>): Promise<Order> => {
      const newOrder: Order = {
        ...order,
        id: String(this.orders.length + 1),
        created_at: new Date().toISOString(),
      };
      this.orders.push(newOrder);
      return newOrder;
    },
  };

  newsletter = {
    subscribe: async (email: string): Promise<boolean> => {
      if (!this.subscribers.includes(email)) {
        this.subscribers.push(email);
        return true;
      }
      return false;
    },
  };

  utils = {
    getGenres: (): string[] => {
      const genres = new Set(this.beats.map((b) => b.genre));
      return Array.from(genres).sort();
    },
  };
}

export const database = new BoltDatabase();