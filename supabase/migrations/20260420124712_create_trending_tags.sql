/*
  # Create trending_tags table

  ## Summary
  Stores trending music tags fetched from Last.fm every 24 hours.

  ## New Tables
  - `trending_tags`
    - `id` (uuid, primary key)
    - `tag` (text) — tag name e.g. "hip-hop", "trap", "lo-fi"
    - `mood_category` (text) — mapped mood: hype/chill/sad/party/rage/dreamy/epic
    - `score` (integer) — relative trending rank/score
    - `fetched_at` (timestamptz) — when this batch was fetched
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public SELECT allowed (tags are non-sensitive public data)
  - No public INSERT/UPDATE/DELETE (only edge functions via service role)
*/

CREATE TABLE IF NOT EXISTS trending_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL,
  mood_category text NOT NULL DEFAULT 'hype',
  score integer NOT NULL DEFAULT 0,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trending_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read trending tags"
  ON trending_tags
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS trending_tags_fetched_at_idx ON trending_tags (fetched_at DESC);
CREATE INDEX IF NOT EXISTS trending_tags_mood_category_idx ON trending_tags (mood_category);
