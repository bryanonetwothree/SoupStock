/**
 * Dashboard.jsx  – "My Fridge" page
 *
 * Shows all ingredients with search + category filter.
 * Handles opening the add/edit modal and delete confirmation.
 */

import { useState } from 'react'
import { useIngredients }   from '../hooks/useIngredients'
import IngredientCard       from '../components/IngredientCard'
import IngredientModal      from '../components/IngredientModal'
import ConfirmDialog        from '../components/ConfirmDialog'
import { CATEGORIES, CATEGORY_EMOJI } from '../utils/constants'

export default function Dashboard() {
  const {
    ingredients, loading, error,
    search, setSearch,
    category, setCategory,
    addIngredient, editIngredient, removeIngredient,
  } = useIngredients()

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false)
  const [editingItem, setEditingItem]   = useState(null)   // null = adding new

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const openAddModal = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const openEditModal = (ingredient) => {
    setEditingItem(ingredient)
    setModalOpen(true)
  }

  const handleModalSubmit = async (data) => {
    if (editingItem) {
      await editIngredient(editingItem.id, data)
    } else {
      await addIngredient(data)
    }
  }

  const handleDeleteClick = (ingredient) => {
    setDeleteTarget(ingredient)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await removeIngredient(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  const isEmpty = !loading && ingredients.length === 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-800">My Fridge 🧊</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? 'Loading…' : `${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''} stored`}
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <span className="text-base">＋</span>
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search ingredients…"
          className="input-field"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {/* "All" chip */}
        <button
          onClick={() => setCategory('')}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
            category === ''
              ? 'bg-soup-500 text-white border-soup-500'
              : 'bg-white text-gray-600 border-gray-200 hover:border-soup-300'
          }`}
        >
          All
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(category === cat ? '' : cat)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
              category === cat
                ? 'bg-soup-500 text-white border-soup-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-soup-300'
            }`}
          >
            {CATEGORY_EMOJI[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse h-28 bg-gray-50" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">🫙</span>
          <p className="text-gray-500 font-medium">
            {search || category ? 'No ingredients match your filter.' : 'Your fridge is empty!'}
          </p>
          {!search && !category && (
            <button onClick={openAddModal} className="btn-primary mt-2">
              Add your first ingredient
            </button>
          )}
        </div>
      )}

      {/* Ingredient grid */}
      {!loading && ingredients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ingredients.map((item) => (
            <IngredientCard
              key={item.id}
              ingredient={item}
              onEdit={openEditModal}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <IngredientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        message={`Remove "${deleteTarget?.name}" from your fridge?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
