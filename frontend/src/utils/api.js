/**
 * api.js
 * Central place for all HTTP calls to the SoupStock backend.
 * The base URL comes from the .env file (VITE_API_BASE_URL).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// ---------------------------------------------------------------------------
// Helper: shared fetch wrapper
// ---------------------------------------------------------------------------
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP ${res.status}`)
  }

  // 204 No Content (delete) has no body
  if (res.status === 204) return null
  return res.json()
}

// ---------------------------------------------------------------------------
// Ingredients
// ---------------------------------------------------------------------------

/** Fetch all ingredients, with optional search query and category filter */
export async function getIngredients({ q = '', category = '' } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  const qs = params.toString() ? `?${params.toString()}` : ''
  return request(`/ingredients/${qs}`)
}

/** Create a new ingredient */
export async function createIngredient(data) {
  return request('/ingredients/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/** Update an existing ingredient by id */
export async function updateIngredient(id, data) {
  return request(`/ingredients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/** Delete an ingredient by id */
export async function deleteIngredient(id) {
  return request(`/ingredients/${id}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Shopping check
// ---------------------------------------------------------------------------

/**
 * Compare a list of ingredient names against the fridge inventory.
 * @param {string[]} items - list of ingredient name strings
 * @returns {{ available: string[], missing: string[] }}
 */
export async function shoppingCheck(items) {
  return request('/shopping-check/', {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
}
