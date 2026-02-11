/*
  # Create Beat Store Database Schema

  1. New Tables
    - `beats`
      - `id` (uuid, primary key)
      - `title` (text, beat name)
      - `artist` (text, artist name)
      - `bpm` (integer, beats per minute)
      - `key` (text, musical key)
      - `genre` (text, genre category)
      - `price` (numeric, price in euros)
      - `audio_url` (text, audio file URL)
      - `artwork_url` (text, cover art URL)
      - `tags` (text array, searchable tags)
      - `license_basic` (boolean, basic license available)
      - `license_premium` (boolean, premium license available)
      - `license_exclusive` (boolean, exclusive license available)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `featured` (boolean, featured beat flag)

    - `orders`
      - `id` (uuid, primary key)
      - `email` (text, customer email)
      - `beat_ids` (uuid array, purchased beats)
      - `total_amount` (numeric, total price)
      - `license_types` (jsonb, license per beat)
      - `status` (text, order status)
      - `payment_intent` (text, payment reference)
      - `created_at` (timestamp)

    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique subscriber email)
      - `subscribed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for beats (anyone can browse)
    - Authenticated admin access for beat management
    - Order creation open, read restricted to admin
    - Newsletter signup public
*/

-- Create beats table
CREATE TABLE IF NOT EXISTS beats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text DEFAULT 'Jonna Rincon',
  bpm integer NOT NULL,
  key text NOT NULL,
  genre text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 29.00,
  audio_url text NOT NULL,
  artwork_url text NOT NULL,
  tags text[] DEFAULT '{}',
  license_basic boolean DEFAULT true,
  license_premium boolean DEFAULT true,
  license_exclusive boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  beat_ids uuid[] NOT NULL,
  total_amount numeric(10, 2) NOT NULL,
  license_types jsonb NOT NULL,
  status text DEFAULT 'pending',
  payment_intent text,
  created_at timestamptz DEFAULT now()
);

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Beats policies (public read, admin write)
CREATE POLICY "Anyone can view beats"
  ON beats FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert beats"
  ON beats FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update beats"
  ON beats FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete beats"
  ON beats FOR DELETE
  TO authenticated
  USING (true);

-- Orders policies (anyone can create, restricted read)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Newsletter policies (anyone can subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample beats
INSERT INTO beats (title, bpm, key, genre, price, audio_url, artwork_url, tags, featured) VALUES
  ('Midnight Dreams', 140, 'Am', 'Trap', 29.00, 'https://example.com/beat1.mp3', 'https://images.pexels.com/photos/114820/pexels-photo-114820.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['dark', 'trap', 'atmospheric'], true),
  ('Purple Haze', 128, 'Gm', 'Hip Hop', 39.00, 'https://example.com/beat2.mp3', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['chill', 'smooth', 'purple'], true),
  ('Neon Nights', 150, 'F#m', 'Drill', 49.00, 'https://example.com/beat3.mp3', 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['hard', 'drill', 'uk'], false),
  ('Studio Sessions', 90, 'Dm', 'R&B', 35.00, 'https://example.com/beat4.mp3', 'https://images.pexels.com/photos/1933900/pexels-photo-1933900.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['smooth', 'rnb', 'melodic'], false),
  ('Bassline Theory', 174, 'Em', 'Drum & Bass', 45.00, 'https://example.com/beat5.mp3', 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['dnb', 'liquid', 'fast'], false),
  ('Lost in Tokyo', 120, 'Cm', 'Lo-Fi', 25.00, 'https://example.com/beat6.mp3', 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['lofi', 'chill', 'study'], true);
