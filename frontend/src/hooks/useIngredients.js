/**
 * useIngredients.js
 * Custom React hook that manages ingredient state, loading, and errors.
 * Components import this hook instead of calling the API directly.
 */

import { useState, useEffect, useCallback } from 'react'
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from '../utils/api'

export function useIngredients() {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  // Current search / filter state
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('')

  // ---------------------------------------------------------------------------
  // Fetch (re-runs whenever search or category changes)
  // ---------------------------------------------------------------------------
  const fetchIngredients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getIngredients({ q: search, category })
      setIngredients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => {
    fetchIngredients()
  }, [fetchIngredients])

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------
  const addIngredient = async (data) => {
    const created = await createIngredient(data)
    // Optimistically refresh the list
    await fetchIngredients()
    return created
  }

  const editIngredient = async (id, data) => {
    const updated = await updateIngredient(id, data)
    await fetchIngredients()
    return updated
  }

  const removeIngredient = async (id) => {
    await deleteIngredient(id)
    // Remove from local state immediately for snappy UX
    setIngredients((prev) => prev.filter((i) => i.id !== id))
  }

  return {
    ingredients,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    refetch: fetchIngredients,
    addIngredient,
    editIngredient,
    removeIngredient,
  }
}
