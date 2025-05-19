# AVANA PARFUM

A modern e-commerce website for a luxury inspired fragrance brand built with Next.js and MongoDB.

## Features

- Responsive design for all devices
- Product catalog with gender and category filtering
- Product detail pages with image galleries
- About and Contact pages
- WhatsApp integration for direct ordering
- Admin dashboard for product management

## Tech Stack

- **Frontend:** Next.js 14, React, TailwindCSS
- **Backend:** Next.js API routes
- **Database:** MongoDB
- **State Management:** React Hooks
- **Styling:** TailwindCSS with custom components
- **Icons:** React Icons
- **Fonts:** Playfair Display, DM Sans

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/mons-debug/avanaperfum.git
   cd avanaperfum
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file and add your MongoDB connection string
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and database connection
- `/models` - MongoDB schemas
- `/public` - Static assets
- `/hooks` - Custom React hooks

## Deployment

This application can be deployed on Vercel or any other hosting platform that supports Next.js applications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
