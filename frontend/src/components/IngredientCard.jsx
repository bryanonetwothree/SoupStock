/**
 * IngredientCard.jsx
 * Displays a single ingredient in the fridge list.
 * Shows name, quantity, category, expiry, and edit/delete actions.
 */

import CategoryBadge from './CategoryBadge'

/** Format ISO date string as a readable label, e.g. "31 Dec 2025" */
function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Return warning if expiry is within 3 days, expired if past */
function expiryStatus(dateStr) {
  if (!dateStr) return null
  const today  = new Date()
  const expiry = new Date(dateStr)
  const diffMs = expiry - today
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0)  return 'expired'
  if (diffDays <= 3) return 'soon'
  return 'ok'
}

export default function IngredientCard({ ingredient, onEdit, onDelete }) {
  const { name, quantity, unit, category, expiry_date, notes } = ingredient
  const status  = expiryStatus(expiry_date)
  const dateStr = formatDate(expiry_date)

  return (
    <div className="card flex flex-col gap-2">
      {/* Top row: name + actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-bold text-base text-gray-800 leading-tight">
          {name}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(ingredient)}
            className="p-1.5 rounded-lg hover:bg-soup-50 text-gray-400 hover:text-soup-500 transition-colors"
            aria-label={`Edit ${name}`}
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(ingredient)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            aria-label={`Delete ${name}`}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Quantity + category row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-soup-600 font-semibold text-sm">
          {quantity} {unit}
        </span>
        <CategoryBadge category={category} />
      </div>

      {/* Expiry date */}
      {dateStr && (
        <div className={`text-xs font-medium flex items-center gap-1 ${
          status === 'expired' ? 'text-red-600' :
          status === 'soon'    ? 'text-amber-600' :
                                  'text-gray-400'
        }`}>
          {status === 'expired' && '⚠️ Expired: '}
          {status === 'soon'    && '⏳ Expires soon: '}
          {status === 'ok'      && '📅 Expires: '}
          {dateStr}
        </div>
      )}

      {/* Notes */}
      {notes && (
        <p className="text-xs text-gray-400 italic leading-snug">{notes}</p>
      )}
    </div>
  )
}
