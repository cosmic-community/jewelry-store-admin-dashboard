# Jewelry Store Admin Dashboard

![Dashboard Preview](https://imgix.cosmicjs.com/24d51920-931f-11f0-bba7-d56988718db7-photo-1605100804763-247f67b3557e-1758042241738.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A comprehensive React admin dashboard built with Next.js and TypeScript for managing your jewelry store's e-commerce content. Features full CRUD capabilities for products, collections, and customer reviews with an elegant, responsive interface.

## ✨ Features

- **📊 Dashboard Overview** - Statistics and insights for your jewelry business
- **💎 Product Management** - Create, edit, and delete jewelry products with image galleries
- **📚 Collection Management** - Organize products into collections like "Engagement Rings" and "Vintage Collection"
- **⭐ Review Management** - View and moderate customer reviews with ratings
- **🔍 Advanced Search** - Filter products by material, collection, price range
- **📱 Responsive Design** - Mobile-friendly admin interface
- **🚀 Real-time Updates** - Live synchronization with Cosmic CMS
- **🛡️ TypeScript** - Fully typed for enhanced development experience

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68c997cbfe0840663f64fa9b&clone_repository=68c999dcfe0840663f64facc)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> Design a content model for an e-commerce store with products, collections, and customer reviews gioielleria

### Code Generation Prompt

> Create a React dashboard that displays and manages my existing content

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Cosmic CMS
- **Icons:** Lucide React
- **Package Manager:** Bun

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Bun package manager
- Cosmic account with read/write access

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Cosmic SDK Examples

```typescript
// Fetch all products with collections
const products = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1);

// Create a new product
await cosmic.objects.insertOne({
  type: 'products',
  title: 'Diamond Ring',
  metadata: {
    name: 'Diamond Ring',
    price: 2500,
    currency: { key: 'USD', value: 'USD' },
    material: { key: 'diamond', value: 'Diamond' },
    in_stock: true
  }
});

// Update product inventory
await cosmic.objects.updateOne(productId, {
  metadata: {
    in_stock: false
  }
});
```

## 🌐 Cosmic CMS Integration

This dashboard integrates with your Cosmic bucket's content structure:

- **Products** - Jewelry items with pricing, materials, and image galleries
- **Collections** - Product groupings like "Engagement Rings" and "Vintage Collection"
- **Reviews** - Customer feedback with star ratings and verification status

All content is managed through the Cosmic SDK with real-time updates reflected in your dashboard and live website.

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
bun run build
vercel --prod
```

### Netlify
```bash
bun run build
netlify deploy --prod --dir=out
```

Remember to configure your environment variables in your hosting platform's dashboard.

<!-- README_END -->