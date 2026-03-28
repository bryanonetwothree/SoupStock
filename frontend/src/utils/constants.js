/**
 * constants.js
 * Shared constants used across the app.
 */

/** All valid ingredient categories (must match the Supabase CHECK constraint) */
export const CATEGORIES = [
  'meat',
  'vegetables',
  'herbs',
  'dried goods',
  'seafood',
  'mushrooms',
  'soup base',
  'other',
]

/** Emoji icon for each category – makes the UI friendlier on mobile */
export const CATEGORY_EMOJI = {
  meat:        '🥩',
  vegetables:  '🥦',
  herbs:       '🌿',
  'dried goods': '🌾',
  seafood:     '🦐',
  mushrooms:   '🍄',
  'soup base': '🍲',
  other:       '📦',
}

/** Colour classes for category badges (Tailwind) */
export const CATEGORY_COLORS = {
  meat:          'bg-red-100 text-red-700',
  vegetables:    'bg-green-100 text-green-700',
  herbs:         'bg-emerald-100 text-emerald-700',
  'dried goods': 'bg-yellow-100 text-yellow-700',
  seafood:       'bg-blue-100 text-blue-700',
  mushrooms:     'bg-amber-100 text-amber-700',
  'soup base':   'bg-orange-100 text-orange-700',
  other:         'bg-gray-100 text-gray-600',
}

/** Common units to show in the unit dropdown */
export const UNITS = [
  'g', 'kg', 'ml', 'L',
  'pcs', 'bunch', 'pack', 'box',
  'tbsp', 'tsp', 'cup',
  'slice', 'clove', 'head', 'stalk',
]
