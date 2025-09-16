'use client'

import { useState, useEffect } from 'react'
import { Star, Trash2, MessageSquare, CheckCircle, Clock } from 'lucide-react'
import { getReviews, deleteReview } from '@/lib/cosmic'
import type { Review } from '@/types'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      setLoading(true)
      const fetchedReviews = await getReviews()
      setReviews(fetchedReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteReview(reviewId: string) {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      await deleteReview(reviewId)
      setReviews(reviews.filter(r => r.id !== reviewId))
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6">
          <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-96"></div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-48"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-16 bg-gray-300 rounded w-full"></div>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor and manage customer feedback and ratings for your jewelry products
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Customer reviews will appear here as they're submitted.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {review.metadata.customer_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {review.metadata.customer_name}
                          </p>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {renderStars(parseInt(review.metadata.rating.key))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">
                              {review.metadata.rating.value}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          {review.metadata.verified_purchase && (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span>Verified Purchase</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDate(review.metadata.review_date || review.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {review.metadata.review_text && (
                        <p className="text-sm text-gray-700 mb-3">
                          {review.metadata.review_text}
                        </p>
                      )}
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          {review.metadata.product.thumbnail && (
                            <img
                              className="h-12 w-12 rounded object-cover"
                              src={`${review.metadata.product.thumbnail}?w=96&h=96&fit=crop&auto=format,compress`}
                              alt={review.metadata.product.title}
                              width="48"
                              height="48"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {review.metadata.product.title}
                            </p>
                            {review.metadata.product.metadata?.price && (
                              <p className="text-sm text-gray-500">
                                ${review.metadata.product.metadata.price} {review.metadata.product.metadata.currency?.value}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete review"
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
    </div>
  )
}