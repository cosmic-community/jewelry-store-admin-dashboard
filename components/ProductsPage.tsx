'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import { getProducts, deleteProduct } from '@/lib/cosmic'
import ProductModal from './ProductModal'
import type { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const fetchedProducts = await getProducts()
      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product)
    setShowModal(true)
  }

  function handleCreateProduct() {
    setEditingProduct(null)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditingProduct(null)
  }

  async function handleSaveProduct() {
    // Refresh products after save
    await fetchProducts()
    handleCloseModal()
  }

  function formatPrice(price: number, currency: string = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6">
          <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="aspect-h-1 aspect-w-1 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-20"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your jewelry inventory, pricing, and product details
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleCreateProduct}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first jewelry piece.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleCreateProduct}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
              New Product
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="aspect-w-1 aspect-h-1 w-full">
                {product.metadata.product_images?.[0]?.imgix_url ? (
                  <img
                    className="h-48 w-full object-cover"
                    src={`${product.metadata.product_images[0].imgix_url}?w=400&h=192&fit=crop&auto=format,compress`}
                    alt={product.metadata.name}
                    width="400"
                    height="192"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {product.metadata.name}
                    </h3>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {formatPrice(product.metadata.price, product.metadata.currency?.value)}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.metadata.in_stock 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.metadata.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {product.metadata.material?.value && (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                          {product.metadata.material.value}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
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
        <ProductModal
          isOpen={showModal}
          product={editingProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  )
}