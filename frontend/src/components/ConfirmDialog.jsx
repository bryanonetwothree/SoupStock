/**
 * ConfirmDialog.jsx
 * Simple modal to confirm destructive actions (e.g. delete ingredient).
 */

export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
        <p className="text-gray-700 font-medium text-center">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}  className="btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} className="btn-danger flex-1">Delete</button>
        </div>
      </div>
    </div>
  )
}
