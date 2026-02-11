import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Beat {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  price: number;
  audio_url: string;
  artwork_url: string;
  tags: string[];
  license_basic: boolean;
  license_premium: boolean;
  license_exclusive: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  email: string;
  beat_ids: string[];
  total_amount: number;
  license_types: Record<string, string>;
  status: string;
  payment_intent?: string;
  created_at: string;
}

export interface CartItem {
  beat: Beat;
  license: 'basic' | 'premium' | 'exclusive';
  price: number;
}
