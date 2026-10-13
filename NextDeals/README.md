# couponkodee - Coupons, Deals & Cashback with Payload CMS

A modern, scalable affiliate site built with Next.js 14, Payload CMS, and designed for growth from 10K to 10M+ visitors.

## 🚀 Architecture Overview

\`\`\`mermaid
graph TB
    A[Users] --> B[Vercel Edge Network]
    B --> C[Next.js Frontend]
    C --> D[Payload CMS API]
    D --> E[PostgreSQL Database]
    
    F[GitHub Actions] --> G[Price Tracking]
    G --> D
    G --> H[ISR Revalidation]
    H --> C
    
    I[Admin Panel] --> D
    J[CSV Imports] --> D
    
    subgraph "Phase 1: MVP ($5-15/month)"
        K[DigitalOcean Droplet]
        K --> D
        K --> E
    end
    
    subgraph "Phase 2: Growth ($50-150/month)"
        L[Managed PostgreSQL]
        M[Redis Cache]
        N[CDN]
    end
    
    subgraph "Phase 3: Scale ($500+/month)"
        O[Kubernetes Cluster]
        P[Microservices]
        Q[Real-time APIs]
    end
\`\`\`

## 🛠 Tech Stack

### Backend (Payload CMS)
- **CMS**: Payload CMS v2.8+ with TypeScript
- **Database**: PostgreSQL with Payload's postgres adapter
- **Admin Panel**: Built-in React admin interface
- **API**: Automatic REST & GraphQL APIs
- **Collections**: Products, Categories, Users, Newsletter, Media

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel (Free tier → Pro)
- **Caching**: Edge caching + ISR (1 hour revalidation)

## 🚀 Quick Start

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd dealscope-affiliate-site
npm install
\`\`\`

### 2. Environment Setup
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your database credentials and Payload secret
\`\`\`

### 3. Database Setup
\`\`\`bash
# Create PostgreSQL database
createdb dealscope

# Set DATABASE_URL in .env.local
DATABASE_URL=postgresql://username:password@localhost:5432/dealscope
\`\`\`

### 4. Initialize Payload CMS
\`\`\`bash
# Build Payload admin panel
npm run build:payload

# Seed initial data
node scripts/seed-payload.js
\`\`\`

### 5. Development
\`\`\`bash
# Start development server
npm run dev

# Access admin panel at http://localhost:3000/admin
# Create your administrator account at /admin/create-first-user
\`\`\`

## 🎛 Payload CMS Collections

### Products Collection
- **Title, Slug, Description**: Product information
- **Pricing**: Original price, current price, auto-calculated discount
- **Category**: Relationship to categories
- **Images**: Media uploads with responsive sizes
- **Features**: Key product specifications
- **Status**: Featured, trending, active flags
- **SEO**: Meta tags and descriptions

### Categories Collection
- **Name, Slug, Description**: Category information
- **Parent**: Support for subcategories
- **Product Count**: Auto-calculated
- **SEO**: Meta optimization

### Users Collection
- **Authentication**: Built-in user management
- **Roles**: Admin, Editor, User levels
- **Access Control**: Collection-level permissions

### Newsletter Collection
- **Email Management**: Subscriber tracking
- **Preferences**: Category interests, frequency
- **Source Tracking**: Signup attribution

## 📊 Admin Panel Features

### Content Management
- **Rich Text Editor**: For product descriptions
- **Media Library**: Image upload and management
- **Bulk Operations**: CSV imports and exports
- **Version Control**: Content revisions and drafts

### E-commerce Features
- **Price Tracking**: Historical price data
- **Affiliate Links**: Managed affiliate URLs
- **Product Status**: Featured/trending controls
- **Category Management**: Hierarchical organization

### User Management
- **Role-based Access**: Admin, Editor, User roles
- **Authentication**: Secure login system
- **Permissions**: Fine-grained access control

## 🔄 Data Flow

1. **Admin creates content** in Payload CMS admin panel
2. **Next.js fetches data** via Payload's Local API
3. **ISR regenerates** static pages every hour
4. **Vercel Edge Cache** serves content globally
5. **Price tracking updates** products automatically

## 📈 Scaling Pathway

| Phase | Traffic | Infrastructure | Monthly Cost | Key Features |
|-------|---------|---------------|--------------|--------------|
| **MVP** | 10K-100K | Single Droplet + Vercel | $5-15 | Payload CMS, ISR, File uploads |
| **Growth** | 100K-1M | Managed DB + Cloud Storage | $50-150 | Real-time sync, CDN, Redis |
| **Scale** | 1M-10M+ | Kubernetes + Microservices | $500+ | Auto-scaling, Global distribution |

## 🚀 Production Deployment

### Option A: Single Server (MVP)
\`\`\`bash
# Build for production
npm run build

# Start production server
npm start

# Admin panel available at /admin
\`\`\`

### Option B: Docker Deployment
\`\`\`bash
# Build and run with Docker
docker-compose up -d

# Access admin panel at http://localhost:3000/admin
\`\`\`

### Option C: Separate Services
- Deploy Next.js to Vercel
- Deploy Payload CMS to Railway/Render/DigitalOcean
- Use managed PostgreSQL (Neon/Supabase/Railway)

## 🎨 Content Strategy

### Product Management
1. **Import via CSV**: Bulk product uploads
2. **Manual Entry**: Individual product creation
3. **API Integration**: Connect to affiliate networks
4. **Price Monitoring**: Automated price updates

### Category Structure
- **Electronics**: Gadgets, phones, computers
- **Home & Garden**: Furniture, appliances, tools
- **Fashion**: Clothing, shoes, accessories
- **Health & Beauty**: Skincare, wellness, beauty

### SEO Optimization
- **Auto-generated slugs** from titles
- **Meta tags** for all content types
- **Schema markup** for products
- **Sitemap generation** from Payload data

## 🔧 Key Features

### Payload CMS Benefits
- **Type-safe**: Full TypeScript support
- **Flexible**: Customizable fields and collections
- **Scalable**: Built for enterprise applications
- **Developer-friendly**: Code-first configuration
- **Self-hosted**: Full control over your data

### Performance Optimization
- **ISR**: 1-hour revalidation for optimal performance
- **Edge Caching**: Vercel's global edge network
- **Image Optimization**: Payload's responsive images
- **Lazy Loading**: Components load on demand

## 🛡 Security & Access Control

### Authentication
- **Secure login** with bcrypt password hashing
- **JWT tokens** for API authentication
- **Role-based access** control
- **CSRF protection** built-in

### Data Protection
- **Environment variables** for sensitive data
- **Database encryption** support
- **File upload validation** with type checking
- **Rate limiting** for API endpoints

---

*Built with ❤️ using Payload CMS for scalable affiliate marketing*
