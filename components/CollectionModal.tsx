'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createCollection, updateCollection } from '@/lib/cosmic'
import type { Collection, CreateCollectionData } from '@/types'

interface CollectionModalProps {
  isOpen: boolean
  collection: Collection | null
  onClose: () => void
  onSave: () => Promise<void>
}

export default function CollectionModal({ 
  isOpen, 
  collection, 
  onClose, 
  onSave 
}: CollectionModalProps) {
  const [formData, setFormData] = useState<CreateCollectionData>({
    title: '',
    metadata: {
      name: '',
      description: '',
      active: true
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (collection) {
      // Editing existing collection
      setFormData({
        title: collection.title,
        metadata: {
          name: collection.metadata.name || collection.title,
          description: collection.metadata.description || '',
          active: collection.metadata.active ?? true
        }
      })
    } else {
      // Creating new collection
      setFormData({
        title: '',
        metadata: {
          name: '',
          description: '',
          active: true
        }
      })
    }
  }, [collection, isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) return

    setLoading(true)
    try {
      const collectionData = {
        title: formData.title.trim(),
        type: 'collections',
        status: 'published',
        metadata: {
          name: formData.metadata.name || formData.title.trim(),
          description: formData.metadata.description,
          active: formData.metadata.active
        }
      }

      if (collection) {
        // Update existing collection
        await updateCollection(collection.id, collectionData)
      } else {
        // Create new collection
        await createCollection(collectionData)
      }
      
      await onSave()
      onClose()
    } catch (error) {
      console.error('Error saving collection:', error)
      alert('Failed to save collection')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {collection ? 'Edit Collection' : 'Add New Collection'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value,
                  metadata: {
                    ...prev.metadata,
                    name: e.target.value
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Engagement Rings"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.metadata.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    description: e.target.value
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Brief description of this collection..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.metadata.active}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    active: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                Active collection
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : (collection ? 'Update Collection' : 'Create Collection')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}