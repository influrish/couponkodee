# 🚀 couponkodee Installation Guide

## Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

## Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd dealscope-affiliate-site
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Option A: Use the install script
chmod +x scripts/install-dependencies.sh
./scripts/install-dependencies.sh

# Option B: Manual installation
npm install
npm run generate:types
npm run build:payload
\`\`\`

> **Note**: Custom UI components like `FloatingElements` are already included in the project and do not need to be added via `npx shadcn-ui add`.

### 3. Environment Setup
\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your settings
nano .env.local
\`\`\`

**Required Environment Variables:**
\`\`\`env
DATABASE_URL=postgresql://username:password@localhost:5432/dealscope
PAYLOAD_SECRET=your-super-secret-key-minimum-32-characters
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 4. Database Setup
\`\`\`bash
# Create PostgreSQL database
createdb dealscope

# Or using psql
psql -c "CREATE DATABASE dealscope;"
\`\`\`

### 5. Seed Initial Data
\`\`\`bash
# Seed with categories and subcategories
node scripts/seed-payload-with-subcategories.js
\`\`\`

### 6. Start Development
\`\`\`bash
npm run dev
\`\`\`

**Access Points:**
- 🌐 Frontend: http://localhost:3000
- ⚙️ Admin Panel: http://localhost:3000/admin
- 📧 Create your first administrator account at `/admin/create-first-user`

## Troubleshooting

### Common Issues

**1. Package Name Error**
\`\`\`bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`

**2. Payload Config Error**
\`\`\`bash
# Regenerate types
npm run generate:types
npm run build:payload
\`\`\`

**3. Database Connection**
\`\`\`bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT version();"
\`\`\`

**4. Port Conflicts**
\`\`\`bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9
\`\`\`

## Production Deployment

### Docker Deployment
\`\`\`bash
# Build and run
docker-compose up -d
\`\`\`

### Manual Deployment
\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Features Included

✅ **Animated UI Components**
- Lottie animations
- Framer Motion transitions
- 3D tilt effects
- Smooth scrolling

✅ **Hierarchical Categories**
- Main categories + subcategories
- Expandable category cards
- Icon and color themes

✅ **Payload CMS Integration**
- Admin panel at /admin
- Product management
- Category management
- Newsletter subscribers

✅ **Performance Optimized**
- ISR (Incremental Static Regeneration)
- Image optimization
- Edge caching ready

## Next Steps

1. **Customize Design**: Modify components in `/components`
2. **Add Products**: Use admin panel or CSV import
3. **Configure Analytics**: Add Google Analytics ID
4. **Set up Email**: Configure SMTP for newsletters
5. **Deploy**: Use Vercel, Railway, or Docker

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check the console for detailed error messages

Happy coding! 🎉
