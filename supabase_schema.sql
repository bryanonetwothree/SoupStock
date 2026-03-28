-- ============================================================
-- SoupStock – Supabase SQL Schema
-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- Create the ingredients table
-- ============================================================
CREATE TABLE IF NOT EXISTS ingredients (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT        NOT NULL,
  quantity     NUMERIC     NOT NULL CHECK (quantity >= 0),
  unit         TEXT        NOT NULL,
  category     TEXT        NOT NULL DEFAULT 'other'
               CHECK (category IN (
                 'meat', 'vegetables', 'herbs', 'dried goods',
                 'seafood', 'mushrooms', 'soup base', 'other'
               )),
  date_added   DATE        NOT NULL DEFAULT CURRENT_DATE,
  expiry_date  DATE,                          -- nullable
  notes        TEXT                           -- nullable
);


-- ============================================================
-- Index on name for fast search
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients (name);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients (category);


-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
-- SoupStock v1 has no user auth.
-- We disable RLS so all requests via the anon key can read/write.
-- If you add auth later, re-enable RLS and add policies here.

ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;


-- ============================================================
-- Optional: seed data for testing
-- Remove or comment out before going live!
-- ============================================================
INSERT INTO ingredients (name, quantity, unit, category, notes) VALUES
  ('Ginger',            1,    'head',  'herbs',        'Fresh, bought from wet market'),
  ('Pork ribs',         500,  'g',     'meat',         'For old fire soup'),
  ('Dried red dates',   20,   'pcs',   'dried goods',  '红枣 – wolfberry pack in pantry'),
  ('Lotus root',        2,    'pcs',   'vegetables',   NULL),
  ('Dried shiitake',    50,   'g',     'mushrooms',    'Soaking overnight'),
  ('Corn',              2,    'pcs',   'vegetables',   NULL),
  ('Carrot',            3,    'pcs',   'vegetables',   NULL),
  ('Wolfberries',       30,   'g',     'dried goods',  '枸杞'),
  ('Chicken',           1,    'kg',    'meat',         'Whole chicken, frozen'),
  ('Spring onion',      1,    'bunch', 'herbs',        NULL)
ON CONFLICT DO NOTHING;
