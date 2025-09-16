import { createBucketClient } from '@cosmicjs/sdk';
import type { Product, Collection, Review, CosmicResponse, DashboardStats } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Product functions
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return (response.objects as Product[]).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // Newest first
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch products');
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'products',
      id
    }).depth(1);
    
    return response.object as Product;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createProduct(productData: any): Promise<Product> {
  try {
    const response = await cosmic.objects.insertOne(productData);
    return response.object as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

export async function updateProduct(id: string, productData: any): Promise<Product> {
  try {
    const response = await cosmic.objects.updateOne(id, productData);
    return response.object as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

// Collection functions
export async function getCollections(): Promise<Collection[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'collections' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects as Collection[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch collections');
  }
}

export async function createCollection(collectionData: any): Promise<Collection> {
  try {
    const response = await cosmic.objects.insertOne(collectionData);
    return response.object as Collection;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw new Error('Failed to create collection');
  }
}

export async function updateCollection(id: string, collectionData: any): Promise<Collection> {
  try {
    const response = await cosmic.objects.updateOne(id, collectionData);
    return response.object as Collection;
  } catch (error) {
    console.error('Error updating collection:', error);
    throw new Error('Failed to update collection');
  }
}

export async function deleteCollection(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw new Error('Failed to delete collection');
  }
}

// Review functions
export async function getReviews(): Promise<Review[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'reviews' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return (response.objects as Review[]).sort((a, b) => {
      const dateA = new Date(a.metadata.review_date || a.created_at).getTime();
      const dateB = new Date(b.metadata.review_date || b.created_at).getTime();
      return dateB - dateA; // Newest first
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch reviews');
  }
}

export async function deleteReview(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Failed to delete review');
  }
}

// Dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [products, collections, reviews] = await Promise.all([
      getProducts(),
      getCollections(),
      getReviews()
    ]);

    const inStockProducts = products.filter(p => p.metadata.in_stock).length;
    const outOfStockProducts = products.length - inStockProducts;

    // Calculate average rating
    let totalRating = 0;
    let ratingCount = 0;
    
    reviews.forEach(review => {
      if (review.metadata.rating?.key) {
        totalRating += parseInt(review.metadata.rating.key);
        ratingCount++;
      }
    });

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    return {
      totalProducts: products.length,
      totalCollections: collections.length,
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      inStockProducts,
      outOfStockProducts
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}