'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, DollarSign, Package } from 'lucide-react'
import { getProducts, deleteProduct } from '@/lib/cosmic'
import type { Product } from '@/types'
import ProductModal from '@/components/ProductModal'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter(product =>
    product.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.metadata.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.metadata.material?.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  function handleAddProduct() {
    setEditingProduct(null)
    setShowModal(true)
  }

  function handleModalClose() {
    setShowModal(false)
    setEditingProduct(null)
    fetchProducts() // Refresh the list
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-300 rounded w-32"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="mb-4">
          <div className="h-10 bg-gray-300 rounded w-full max-w-sm"></div>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-md">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
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
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your jewelry inventory, pricing, and product details
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search products by name, SKU, or material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredProducts.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first product.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </button>
                </div>
              )}
            </li>
          ) : (
            filteredProducts.map((product) => (
              <li key={product.id}>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {product.metadata.product_images && product.metadata.product_images[0] ? (
                        <img
                          className="h-16 w-16 rounded object-cover"
                          src={`${product.metadata.product_images[0].imgix_url}?w=128&h=128&fit=crop&auto=format,compress`}
                          alt={product.metadata.name}
                          width="64"
                          height="64"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded bg-gray-200 flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{product.metadata.name}</p>
                        {!product.metadata.in_stock && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{product.metadata.price} {product.metadata.currency?.value || 'USD'}</span>
                        {product.metadata.sku && (
                          <>
                            <span className="mx-2">•</span>
                            <span>SKU: {product.metadata.sku}</span>
                          </>
                        )}
                        {product.metadata.material && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{product.metadata.material.value}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}