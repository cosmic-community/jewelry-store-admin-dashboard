'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createCollection, updateCollection } from '@/lib/cosmic'
import type { Collection } from '@/types'

interface CollectionModalProps {
  isOpen: boolean
  collection: Collection | null
  onClose: () => void
  onSave: () => Promise<void>
}

export default function CollectionModal({ isOpen, collection, onClose, onSave }: CollectionModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (collection) {
      setName(collection.metadata.name || '')
      setDescription(collection.metadata.description || '')
      setActive(collection.metadata.active ?? true)
    } else {
      setName('')
      setDescription('')
      setActive(true)
    }
  }, [collection])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setSaving(true)
      
      const collectionData = {
        title: name,
        type: 'collections',
        metadata: {
          name: name.trim(),
          description: description.trim(),
          active
        }
      }

      if (collection) {
        await updateCollection(collection.id, collectionData)
      } else {
        await createCollection(collectionData)
      }

      await onSave()
    } catch (error) {
      console.error('Error saving collection:', error)
      alert('Failed to save collection')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {collection ? 'Edit Collection' : 'Create New Collection'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Collection Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Engagement Rings, Vintage Collection"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe this collection..."
            />
          </div>

          <div className="flex items-center">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
              Active collection (visible to customers)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              disabled={saving || !name.trim()}
            >
              {saving ? 'Saving...' : collection ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}