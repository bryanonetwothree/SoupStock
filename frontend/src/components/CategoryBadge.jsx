/**
 * CategoryBadge.jsx
 * Small coloured pill that displays an ingredient's category.
 */

import { CATEGORY_COLORS, CATEGORY_EMOJI } from '../utils/constants'

export default function CategoryBadge({ category }) {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.other
  const emoji      = CATEGORY_EMOJI[category]  || '📦'

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
      {emoji} {category}
    </span>
  )
}
