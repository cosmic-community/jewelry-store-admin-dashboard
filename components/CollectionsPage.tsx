'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react'
import { getCollections, deleteCollection } from '@/lib/cosmic'
import CollectionModal from './CollectionModal'
import type { Collection } from '@/types'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)

  useEffect(() => {
    fetchCollections()
  }, [])

  async function fetchCollections() {
    try {
      setLoading(true)
      const fetchedCollections = await getCollections()
      setCollections(fetchedCollections)
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteCollection(collectionId: string) {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      await deleteCollection(collectionId)
      setCollections(collections.filter(c => c.id !== collectionId))
    } catch (error) {
      console.error('Error deleting collection:', error)
      alert('Failed to delete collection')
    }
  }

  function handleEditCollection(collection: Collection) {
    setEditingCollection(collection)
    setShowModal(true)
  }

  function handleCreateCollection() {
    setEditingCollection(null)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditingCollection(null)
  }

  async function handleSaveCollection() {
    // Refresh collections after save
    await fetchCollections()
    handleCloseModal()
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6">
          <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-300 rounded flex-1"></div>
                  <div className="h-8 bg-gray-300 rounded w-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize your jewelry products into collections for better discovery
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleCreateCollection}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add Collection
          </button>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No collections</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new collection to organize your jewelry.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleCreateCollection}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
              New Collection
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <div key={collection.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                {collection.metadata.featured_image ? (
                  <img
                    className="h-full w-full object-cover"
                    src={`${collection.metadata.featured_image.imgix_url}?w=400&h=192&fit=crop&auto=format,compress`}
                    alt={collection.metadata.name}
                    width="400"
                    height="192"
                  />
                ) : (
                  <FolderOpen className="h-16 w-16 text-white" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {collection.metadata.name}
                    </h3>
                    {collection.metadata.description && (
                      <div 
                        className="mt-1 text-sm text-gray-500 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: collection.metadata.description }}
                      />
                    )}
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      collection.metadata.active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {collection.metadata.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEditCollection(collection)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CollectionModal
          isOpen={showModal}
          collection={editingCollection}
          onClose={handleCloseModal}
          onSave={handleSaveCollection}
        />
      )}
    </div>
  )
}