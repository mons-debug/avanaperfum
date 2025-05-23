#!/bin/bash

# Setup script for Avana Parfum website

# Step 1: Install dependencies
echo "Installing dependencies..."
npm install

# Step 2: Set up environment variables
echo "Setting up environment variables..."
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    echo "MONGODB_URI=your_mongodb_connection_string" > .env.local
    echo "NODE_ENV=development" >> .env.local
    echo "Please edit .env.local to add your actual MongoDB connection string"
else
    echo ".env.local already exists. Skipping creation."
fi

# Step 3: Start the development server
echo "Starting development server..."
echo "Open http://localhost:3000 in your browser"
npm run dev 