'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createCollection } from '@/lib/cosmic'
import type { Collection } from '@/types'

interface CollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (collection: Collection) => void
}

export default function CollectionModal({ isOpen, onClose, onSave }: CollectionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        title: '',
        name: '',
        description: '',
        active: true
      })
      setError(null)
    }
  }, [isOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.title.trim()) {
      setError('Collection title is required')
      return
    }
    
    if (!formData.name.trim()) {
      setError('Collection name is required')
      return
    }

    handleSave()
  }

  async function handleSave() {
    setLoading(true)
    setError(null)

    try {
      const collectionData = {
        title: formData.title.trim(),
        type: 'collections',
        status: 'published',
        metadata: {
          name: formData.name.trim(),
          description: formData.description.trim() || '',
          active: formData.active
        }
      }

      const savedCollection = await createCollection(collectionData)
      onSave(savedCollection)
      onClose()
    } catch (error) {
      console.error('Error saving collection:', error)
      setError(error instanceof Error ? error.message : 'Failed to save collection. Please check all fields and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Collection</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Collection Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Engagement Rings"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Engagement Rings"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Discover our exquisite collection of engagement rings..."
            />
          </div>

          <div className="flex items-center">
            <input
              id="active"
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
              Active Collection
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}