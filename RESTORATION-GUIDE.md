# Avana Parfum Restoration Guide

This guide will help you restore and run the Avana Parfum e-commerce website project from GitHub.

## Prerequisites

- Node.js 18.x or later
- npm (included with Node.js)
- MongoDB database (local or Atlas)

## Restoration Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/mons-debug/avanaperfum.git avana-parfum
   cd avana-parfum
   ```

2. **Run the Setup Script:**
   ```bash
   ./setup.sh
   ```
   
   This script will:
   - Install all dependencies
   - Create a `.env.local` file with placeholder values
   - Start the development server

3. **Configure MongoDB:**
   
   Edit the `.env.local` file to add your actual MongoDB connection string:
   ```
   MONGODB_URI=your_actual_mongodb_connection_string
   NODE_ENV=development
   ```

4. **Access the Application:**
   
   Open your browser and go to http://localhost:3000

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and database connection
- `/models` - MongoDB schemas
- `/public` - Static assets
- `/hooks` - Custom React hooks

## Troubleshooting

If you encounter any issues during setup:

1. **Database Connection Issues**:
   - Make sure your MongoDB instance is running
   - Verify your connection string is correct in `.env.local`
   - Check the MongoDB connection status in the browser console

2. **Missing Dependencies**:
   - Run `npm install` manually to ensure all dependencies are installed

3. **Port Conflicts**:
   - If port 3000 is in use, you can change it by running:
     ```bash
     PORT=3001 npm run dev
     ```

4. **Image Loading Issues**:
   - Make sure the `/public/images` directory has all required image assets
   - Check browser console for any 404 errors 