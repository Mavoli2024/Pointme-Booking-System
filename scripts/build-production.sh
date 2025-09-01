#!/bin/bash

# Production Build Script for PointMe Platform

echo "🚀 Starting production build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_SUPABASE_URL not set"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY not set"
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Type check
echo "🔍 Running type check..."
npm run type-check

# Lint check
echo "🔍 Running lint check..."
npm run lint

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build size analysis:"
    du -sh .next
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Generate sitemap (if next-sitemap is installed)
if [ -f "next-sitemap.config.js" ]; then
    echo "🗺️  Generating sitemap..."
    npx next-sitemap
fi

echo "🎉 Production build process completed!"
echo "📁 Build output: .next/"
echo "🌐 Ready to deploy to your hosting platform"

