#!/bin/bash

# Helper script to extract environment variables for Netlify
# Run this to see your values (they won't be printed, just displayed)

echo "=========================================="
echo "Environment Variables for Netlify"
echo "=========================================="
echo ""

if [ -f .env.local ]; then
    echo "📋 Values from .env.local:"
    echo ""
    
    # Extract DATABASE_URL
    if grep -q "DATABASE_URL=" .env.local; then
        DB_URL=$(grep "DATABASE_URL=" .env.local | cut -d'=' -f2-)
        echo "✅ DATABASE_URL found in .env.local"
        echo "   (Check if this is the POOLER URL with port 6543)"
        echo ""
    else
        echo "❌ DATABASE_URL not found in .env.local"
        echo ""
    fi
    
    # Extract GOOGLE_CLIENT_ID
    if grep -q "GOOGLE_CLIENT_ID=" .env.local; then
        echo "✅ GOOGLE_CLIENT_ID found in .env.local"
        echo ""
    else
        echo "❌ GOOGLE_CLIENT_ID not found in .env.local"
        echo ""
    fi
    
    # Extract GOOGLE_CLIENT_SECRET
    if grep -q "GOOGLE_CLIENT_SECRET=" .env.local; then
        echo "✅ GOOGLE_CLIENT_SECRET found in .env.local"
        echo ""
    else
        echo "❌ GOOGLE_CLIENT_SECRET not found in .env.local"
        echo ""
    fi
    
    echo "=========================================="
    echo "To copy values safely, run:"
    echo "  cat .env.local | grep DATABASE_URL"
    echo "  cat .env.local | grep GOOGLE_CLIENT_ID"
    echo "  cat .env.local | grep GOOGLE_CLIENT_SECRET"
    echo "=========================================="
else
    echo "❌ .env.local file not found!"
fi
