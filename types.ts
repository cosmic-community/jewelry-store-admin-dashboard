// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
  thumbnail?: string;
}

// Product interface with jewelry-specific metadata
export interface Product extends CosmicObject {
  type: 'products';
  thumbnail?: string;
  metadata: {
    name: string;
    description?: string;
    price: number;
    currency?: {
      key: string;
      value: string;
    };
    sku?: string;
    material?: {
      key: string;
      value: string;
    };
    product_images?: Array<{
      url: string;
      imgix_url: string;
    }>;
    in_stock?: boolean;
    collection?: Collection;
  };
}

// Collection interface
export interface Collection extends CosmicObject {
  type: 'collections';
  metadata: {
    name: string;
    description?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    active?: boolean;
  };
}

// Review interface
export interface Review extends CosmicObject {
  type: 'reviews';
  metadata: {
    customer_name: string;
    email?: string;
    rating: {
      key: string;
      value: string;
    };
    review_text?: string;
    product: Product;
    verified_purchase?: boolean;
    review_date?: string;
  };
}

// Type literals for select-dropdown values
export type Currency = 'USD' | 'EUR' | 'GBP';
export type Material = 'gold' | 'silver' | 'platinum' | 'diamond' | 'pearl';
export type Rating = '1' | '2' | '3' | '4' | '5';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Dashboard statistics
export interface DashboardStats {
  totalProducts: number;
  totalCollections: number;
  totalReviews: number;
  averageRating: number;
  inStockProducts: number;
  outOfStockProducts: number;
}

// Form data types for creating/editing
export interface CreateProductData {
  title: string;
  metadata: {
    name: string;
    description?: string;
    price: number;
    currency: {
      key: Currency;
      value: Currency;
    };
    sku?: string;
    material?: {
      key: Material;
      value: string;
    };
    in_stock: boolean;
  };
}

export interface CreateCollectionData {
  title: string;
  metadata: {
    name: string;
    description?: string;
    active: boolean;
  };
}

// Type guards
export function isProduct(obj: CosmicObject): obj is Product {
  return obj.type === 'products';
}

export function isCollection(obj: CosmicObject): obj is Collection {
  return obj.type === 'collections';
}

export function isReview(obj: CosmicObject): obj is Review {
  return obj.type === 'reviews';
}