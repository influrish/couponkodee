#!/bin/bash

echo "🚀 Installing couponkodee dependencies..."

# Clean any existing node_modules and package-lock
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Generate Payload types
npm run generate:types

# Build Payload admin panel
echo "🏗️ Building Payload admin panel..."
echo "💡 Note: Custom UI components like FloatingElements are already included and do not need 'npx shadcn-ui add'."
npm run build:payload

echo "✅ Installation complete!"
echo "📝 Next steps:"
echo "1. Copy .env.example to .env.local and configure your database"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000/admin to access Payload CMS"
