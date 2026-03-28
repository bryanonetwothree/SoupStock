/**
 * ShoppingCheck.jsx
 *
 * Lets the user type ingredient names they plan to buy, then compares
 * that list against the fridge inventory.
 *
 * Input UX: chip/tag style – type a name and press Enter (or comma) to add it.
 */

import { useState, useRef } from 'react'
import { shoppingCheck } from '../utils/api'

export default function ShoppingCheck() {
  // The list of ingredient name chips the user is building
  const [chips, setChips]       = useState([])
  // Current text in the input field (before pressing Enter)
  const [inputVal, setInputVal] = useState('')
  // API result
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const inputRef = useRef(null)

  // ---------------------------------------------------------------------------
  // Chip management
  // ---------------------------------------------------------------------------
  const addChip = (raw) => {
    const value = raw.trim()
    if (!value) return
    // Avoid exact duplicates (case-insensitive)
    if (chips.some((c) => c.toLowerCase() === value.toLowerCase())) return
    setChips((prev) => [...prev, value])
    setInputVal('')
  }

  const removeChip = (index) => {
    setChips((prev) => prev.filter((_, i) => i !== index))
    // Also clear result if chips are changed after a check
    setResult(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addChip(inputVal)
    }
    // Backspace on empty input removes last chip
    if (e.key === 'Backspace' && !inputVal && chips.length > 0) {
      setChips((prev) => prev.slice(0, -1))
      setResult(null)
    }
  }

  // ---------------------------------------------------------------------------
  // Submit to API
  // ---------------------------------------------------------------------------
  const handleCheck = async () => {
    // Add any text still in the input box before checking
    const finalChips = inputVal.trim()
      ? [...chips, inputVal.trim()]
      : chips

    if (finalChips.length === 0) return

    setChips(finalChips)
    setInputVal('')
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await shoppingCheck(finalChips)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setChips([])
    setInputVal('')
    setResult(null)
    setError(null)
    inputRef.current?.focus()
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-800">
          Shopping Check 🛒
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Type the ingredients you need, then see what's already in your fridge.
        </p>
      </div>

      {/* Chip input area */}
      <div className="card mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ingredients I plan to buy
        </label>

        {/* The chip container + input field together */}
        <div
          className="min-h-[64px] flex flex-wrap gap-2 border border-gray-200 rounded-xl p-3 bg-white cursor-text focus-within:ring-2 focus-within:ring-soup-400 focus-within:border-transparent transition"
          onClick={() => inputRef.current?.focus()}
        >
          {chips.map((chip, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-soup-100 text-soup-700 text-sm font-medium px-3 py-1 rounded-full"
            >
              {chip}
              <button
                onClick={(e) => { e.stopPropagation(); removeChip(i) }}
                className="ml-0.5 text-soup-400 hover:text-soup-700 font-bold leading-none"
                aria-label={`Remove ${chip}`}
              >
                ×
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addChip(inputVal)}
            placeholder={chips.length === 0 ? 'Type an ingredient, press Enter…' : ''}
            className="flex-1 min-w-[140px] outline-none text-sm bg-transparent placeholder-gray-400"
          />
        </div>

        <p className="text-xs text-gray-400 mt-1.5">
          Press <kbd className="bg-gray-100 px-1 py-0.5 rounded text-gray-500 font-mono">Enter</kbd> or{' '}
          <kbd className="bg-gray-100 px-1 py-0.5 rounded text-gray-500 font-mono">,</kbd> after each ingredient.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCheck}
          disabled={loading || (chips.length === 0 && !inputVal.trim())}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking…' : '🔍 Check My Fridge'}
        </button>
        {(chips.length > 0 || result) && (
          <button onClick={handleReset} className="btn-secondary">
            Reset
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4">

          {/* Already have */}
          <div className="card border-green-200 bg-green-50">
            <h2 className="font-display font-bold text-green-700 mb-3 flex items-center gap-2">
              <span className="text-xl">✅</span>
              Already in fridge
              <span className="ml-auto text-xs font-medium bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                {result.available.length}
              </span>
            </h2>
            {result.available.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {result.available.map((item) => (
                  <li key={item} className="text-sm text-green-800 flex items-center gap-2">
                    <span>🧊</span> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-600 italic">None of these are in your fridge.</p>
            )}
          </div>

          {/* Still need to buy */}
          <div className="card border-amber-200 bg-amber-50">
            <h2 className="font-display font-bold text-amber-700 mb-3 flex items-center gap-2">
              <span className="text-xl">🛒</span>
              Still need to buy
              <span className="ml-auto text-xs font-medium bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full">
                {result.missing.length}
              </span>
            </h2>
            {result.missing.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {result.missing.map((item) => (
                  <li key={item} className="text-sm text-amber-800 flex items-center gap-2">
                    <span>➕</span> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-amber-600 italic">You already have everything! 🎉</p>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
