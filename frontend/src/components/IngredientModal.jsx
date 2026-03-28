/**
 * IngredientModal.jsx
 * Modal dialog used for both adding and editing an ingredient.
 * Controlled by the parent (Dashboard) via `isOpen`, `onClose`, and `onSubmit`.
 */

import { useState, useEffect } from 'react'
import { CATEGORIES, UNITS } from '../utils/constants'

const EMPTY_FORM = {
  name:        '',
  quantity:    '',
  unit:        'g',
  category:    'other',
  expiry_date: '',
  notes:       '',
}

export default function IngredientModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [form, setForm]     = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const isEditing = Boolean(initialData)

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name:        initialData.name        || '',
        quantity:    initialData.quantity    || '',
        unit:        initialData.unit        || 'g',
        category:    initialData.category    || 'other',
        expiry_date: initialData.expiry_date || '',
        notes:       initialData.notes       || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError(null)
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!form.name.trim()) return setError('Name is required.')
    if (!form.quantity || isNaN(Number(form.quantity))) return setError('Please enter a valid quantity.')

    setSaving(true)
    try {
      const payload = {
        ...form,
        quantity:    Number(form.quantity),
        expiry_date: form.expiry_date || null,
        notes:       form.notes.trim() || null,
      }
      await onSubmit(payload)
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Sheet / dialog */}
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="font-display font-bold text-lg text-gray-800">
            {isEditing ? '✏️ Edit Ingredient' : '➕ Add Ingredient'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ginger"
              className="input-field"
              autoFocus
            />
          </div>

          {/* Quantity + Unit (side by side) */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-400">*</span>
              </label>
              <input
                name="quantity"
                type="number"
                min="0"
                step="any"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 200"
                className="input-field"
              />
            </div>
            <div className="w-28">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Expiry date (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              name="expiry_date"
              type="date"
              value={form.expiry_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Notes (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="e.g. From the wet market, freeze if unused"
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1 pb-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Add to Fridge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
