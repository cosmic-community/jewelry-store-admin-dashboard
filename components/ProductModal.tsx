'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createProduct, updateProduct, getCollections } from '@/lib/cosmic'
import type { Product, Collection, Currency, Material } from '@/types'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product?: Product | null
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    price: '',
    currency: 'USD' as Currency,
    sku: '',
    material: '',
    materialValue: '',
    inStock: true,
    collectionId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchCollections()
      
      if (product) {
        // Populate form for editing
        setFormData({
          title: product.title || '',
          name: product.metadata.name || '',
          description: product.metadata.description || '',
          price: product.metadata.price?.toString() || '',
          currency: (product.metadata.currency?.value as Currency) || 'USD',
          sku: product.metadata.sku || '',
          material: product.metadata.material?.key || '',
          materialValue: product.metadata.material?.value || '',
          inStock: product.metadata.in_stock ?? true,
          collectionId: typeof product.metadata.collection === 'object' ? product.metadata.collection?.id || '' : product.metadata.collection || ''
        })
      } else {
        // Reset form for new product
        setFormData({
          title: '',
          name: '',
          description: '',
          price: '',
          currency: 'USD',
          sku: '',
          material: '',
          materialValue: '',
          inStock: true,
          collectionId: ''
        })
      }
      setError(null)
    }
  }, [isOpen, product])

  async function fetchCollections() {
    try {
      const fetchedCollections = await getCollections()
      setCollections(fetchedCollections)
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const materialOptions = [
    { key: 'gold', value: 'Gold' },
    { key: 'silver', value: 'Silver' },
    { key: 'platinum', value: 'Platinum' },
    { key: 'diamond', value: 'Diamond' },
    { key: 'pearl', value: 'Pearl' }
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.title.trim()) {
      setError('Product title is required')
      return
    }
    
    if (!formData.name.trim()) {
      setError('Product name is required')
      return
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError('Please enter a valid price')
      return
    }

    handleSave()
  }

  async function handleSave() {
    setLoading(true)
    setError(null)

    try {
      const price = parseFloat(formData.price)
      
      const productData: any = {
        title: formData.title.trim(),
        type: 'products',
        status: 'published',
        metadata: {
          name: formData.name.trim(),
          description: formData.description.trim() || '',
          price,
          currency: {
            key: formData.currency,
            value: formData.currency
          },
          sku: formData.sku.trim() || '',
          in_stock: formData.inStock
        }
      }

      // Add material if selected
      if (formData.material && formData.materialValue) {
        productData.metadata.material = {
          key: formData.material,
          value: formData.materialValue
        }
      }

      // Add collection if selected
      if (formData.collectionId) {
        productData.metadata.collection = formData.collectionId
      }

      let savedProduct: Product
      
      if (product) {
        // Update existing product
        savedProduct = await updateProduct(product.id, productData)
      } else {
        // Create new product
        savedProduct = await createProduct(productData)
      }

      onSave(savedProduct)
      onClose()
    } catch (error) {
      console.error('Error saving product:', error)
      setError(error instanceof Error ? error.message : 'Failed to save product. Please check all fields and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleMaterialChange(materialKey: string) {
    const selectedMaterial = materialOptions.find(m => m.key === materialKey)
    setFormData(prev => ({
      ...prev,
      material: materialKey,
      materialValue: selectedMaterial?.value || ''
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Classic Solitaire Diamond Ring"
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
                placeholder="Classic Solitaire Diamond Ring"
                required
              />
            </div>
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
              placeholder="A timeless classic featuring a brilliant diamond..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="2850"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as Currency }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="ER-SOL-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Material
              </label>
              <select
                value={formData.material}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Material</option>
                {materialOptions.map(material => (
                  <option key={material.key} value={material.key}>
                    {material.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Collection
            </label>
            <select
              value={formData.collectionId}
              onChange={(e) => setFormData(prev => ({ ...prev, collectionId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">No Collection</option>
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.metadata.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="inStock"
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">
              In Stock
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
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}