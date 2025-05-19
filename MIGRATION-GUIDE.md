# Product Schema Migration Guide

This guide explains the process for migrating product data from the old schema (with `imageUrl`) to the new schema (with `images` array and `price` field).

## Schema Changes

The product schema has been updated to include:

1. **Multiple Images**: Products now support multiple images stored in an `images` array instead of a single `imageUrl` field.
2. **Price Field**: Products now have a required `price` field (type: Number).

## Automated Migration Scripts

Several scripts have been created to help with the migration process:

### 1. Simulate Migration

```bash
npm run simulate-migration
```

This script simulates the migration process using sample product data. It's useful for understanding what changes will be made to your products.

### 2. Export Products from Database

```bash
npm run export-products
```

This script attempts to connect to your MongoDB database and export all existing products to JSON files in the `data/export` directory. If the database connection fails, it will create sample product data instead.

### 3. Finalize Migration

```bash
npm run finalize-migration
```

This script takes the exported product data (from step 2) and converts it to the new schema format. The migrated products are saved in the `data/migrated` directory, with a combined file at `data/migrated/all-migrated-products.json`.

### 4. Import Migrated Products

```bash
npm run import-products
```

This script attempts to import the migrated products back into your MongoDB database. It will update existing products and insert new ones.

### 5. Manual Migration

```bash
npm run manual-migration
```

This script creates migrated product data using sample data and saves it to the `data/products` directory. This is useful if you want to manually specify the products to migrate.

## Complete Migration Process

Follow these steps to migrate your products:

1. **Backup Your Database**: Always create a backup of your production database before performing a migration.

2. **Export Existing Products**: Run `npm run export-products` to export your current products to JSON files.

3. **Finalize Migration**: Run `npm run finalize-migration` to convert the exported products to the new schema format.

4. **Review Migrated Data**: Check the files in `data/migrated` to ensure the migration worked as expected.

5. **Import to Database**: Run `npm run import-products` to import the migrated products back into your database.

## One-line Migration Command

For convenience, you can run all the migration steps in sequence with:

```bash
npm run export-products && npm run finalize-migration && npm run import-products
```

## Manual Database Update

If you have access to MongoDB directly, you can use this update operation to migrate all products at once:

```javascript
db.products.updateMany(
  {}, // Update all products
  [
    {
      $set: {
        // Convert imageUrl to images array if it exists
        images: { 
          $cond: { 
            if: { $or: [{ $ifNull: ["$images", false] }, { $eq: ["$images", []] }] }, 
            then: { $cond: { if: "$imageUrl", then: ["$imageUrl"], else: [] } }, 
            else: "$images" 
          } 
        },
        // Add price field with default 0 if not exists
        price: { $ifNull: ["$price", 0] },
        // Update timestamp
        updatedAt: new Date()
      }
    },
    {
      $unset: ["imageUrl"] // Remove the old imageUrl field
    }
  ]
);
```

## Frontend Component Updates

The codebase has been updated with the following changes:

1. New `MultiImageUploader` component that supports uploading multiple images.
2. Updated `ProductForm` component with price field and multiple image support.
3. Updated API routes to handle the new schema.
4. Updated product detail and listing pages to display multiple images and price.

## Troubleshooting

If you encounter issues during migration:

- Check MongoDB connection: Ensure your database is running and accessible.
- Check file permissions: Make sure the scripts have permission to read/write files in the data directory.
- Review logs: Check the console output for any error messages.

For help, contact the development team or create an issue in the project repository. 