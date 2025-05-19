# AVANA PARFUM - Product Management System

This document provides information about the product management system developed for AVANA PARFUM.

## Features

The product management system includes the following features:

1. **Product List Page** (`/admin/products`)
   - Displays all products in a table format
   - Shows product image thumbnails, name, category, gender, and volume
   - Provides edit and delete actions for each product
   - Includes search functionality to filter products

2. **Add New Product Page** (`/admin/products/new`)
   - Form to create new products with all necessary fields
   - Local image upload feature with server-side storage
   - Required field validation

3. **Edit Product Page** (`/admin/products/[id]/edit`)
   - Pre-populated form with existing product data
   - Ability to update all product fields
   - Image management (view, replace, remove)

## Local File Storage

The implementation uses a local file storage approach for handling image uploads:

1. **Image Upload Process**:
   - Images are uploaded via a form submission to `/api/images/upload`
   - Files are processed server-side and stored in `/public/images/products/`
   - The API returns the file's public URL path

2. **Storage Configuration**:
   - Images are stored directly in the project's public directory
   - URL pattern: `/images/products/{filename}`
   - Supported formats: JPG, PNG, and WEBP
   - Maximum file size: 5MB

3. **Implementation Details**:
   - Uses Next.js API routes with the built-in formData API
   - Handles file validation and error handling
   - Generates unique filenames to prevent conflicts

## Database Schema

The product schema includes the following fields:

- `name`: Product name (required)
- `inspiredBy`: Original product inspiration
- `description`: Product description
- `volume`: Product volume (e.g., "30ml")
- `tags`: Array of product tags
- `ingredients`: Product ingredients list
- `imageUrl`: URL to the product image
- `category`: Product category (required)
- `gender`: Product gender - "Homme", "Femme", or "Mixte" (required)

## API Routes

The system uses the following API endpoints:

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a specific product
- `PUT /api/products/[id]` - Update a specific product
- `DELETE /api/products/[id]` - Delete a specific product
- `POST /api/images/upload` - Upload an image file

## Future Improvements

Potential future improvements include:

1. Adding proper authentication and authorization for admin routes
2. Adding pagination for the product list
3. Adding toast notifications for success/error messages
4. Adding bulk operations (delete multiple, duplicate, etc.)
5. Improving image management with multiple images per product
6. Implementing image optimization and resizing 