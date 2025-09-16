'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, FolderOpen, Eye, EyeOff } from 'lucide-react'
import { getCollections, deleteCollection } from '@/lib/cosmic'
import type { Collection } from '@/types'
import CollectionModal from '@/components/CollectionModal'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

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

  function handleAddCollection() {
    setShowModal(true)
  }

  function handleModalClose() {
    setShowModal(false)
    fetchCollections() // Refresh the list
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-300 rounded w-32"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize your jewelry into collections like rings, necklaces, and bracelets
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddCollection}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Collection
          </button>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No collections</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first product collection.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddCollection}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Collection
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <div key={collection.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                {collection.metadata.featured_image ? (
                  <img
                    className="h-full w-full object-cover"
                    src={`${collection.metadata.featured_image.imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
                    alt={collection.metadata.name}
                    width="400"
                    height="300"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <FolderOpen className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <div className={`p-2 rounded-full ${collection.metadata.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {collection.metadata.active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {collection.metadata.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        collection.metadata.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {collection.metadata.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {collection.metadata.description && (
                      <div 
                        className="text-sm text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: collection.metadata.description }}
                      />
                    )}
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collection Modal */}
      {showModal && (
        <CollectionModal onClose={handleModalClose} />
      )}
    </div>
  )
}