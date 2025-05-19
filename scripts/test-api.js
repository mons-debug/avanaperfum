const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
let testProductId;
let testCategoryId;
let testOrderId;

// Utility function to log responses
const logResponse = (endpoint, method, response) => {
  console.log(`\n${method} ${endpoint}`);
  console.log(`Status: ${response.status}`);
  
  if (response.data) {
    const dataPreview = JSON.stringify(response.data).substring(0, 150);
    console.log(`Response: ${dataPreview}${dataPreview.length >= 150 ? '...' : ''}`);
  }
  
  console.log('✅ Test passed\n');
};

// Utility function to handle errors
const handleError = (endpoint, method, error) => {
  console.error(`\n❌ Error in ${method} ${endpoint}:`);
  
  if (error.response) {
    // The request was made and the server responded with a status code outside of 2xx
    console.error(`Status: ${error.response.status}`);
    console.error(`Response data: ${JSON.stringify(error.response.data)}`);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received from server');
  } else {
    // Something happened in setting up the request
    console.error(`Error message: ${error.message}`);
  }
  
  console.error('❌ Test failed\n');
};

// Utility function to wait for a specified time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test all API routes
async function testAllRoutes() {
  console.log('🧪 Starting API tests for AVANA PARFUM');
  console.log('=====================================\n');
  
  try {
    console.log('Waiting for Next.js server to be ready...');
    // Wait for 5 seconds to ensure the Next.js server is up and running
    await sleep(5000);
    console.log('Starting tests...\n');
    
    // 1. GET /api/products - Fetch all products
    await axios.get(`${BASE_URL}/products`)
      .then(response => logResponse('/products', 'GET', response))
      .catch(error => handleError('/products', 'GET', error));
    
    // 2. POST /api/products - Create a new product
    const newProduct = {
      name: 'Test Perfume',
      inspiredBy: 'Test Original',
      description: 'A test fragrance with notes of vanilla and citrus',
      volume: '30',
      tags: ['test', 'vanilla', 'citrus'],
      ingredients: 'Alcohol, Aqua, Parfum, Vanilla, Citrus',
      imageUrl: '/images/products/test-perfume.jpg',
      category: 'Unisexe',
      gender: 'Mixte'
    };
    
    await axios.post(`${BASE_URL}/products`, newProduct)
      .then(response => {
        logResponse('/products', 'POST', response);
        // Save the ID for later tests
        if (response.data && response.data.data && response.data.data._id) {
          testProductId = response.data.data._id;
          console.log(`Created test product with ID: ${testProductId}`);
        }
      })
      .catch(error => handleError('/products', 'POST', error));
    
    // 3. GET /api/products/[id] - Get single product
    if (testProductId) {
      await axios.get(`${BASE_URL}/products/${testProductId}`)
        .then(response => logResponse(`/products/${testProductId}`, 'GET', response))
        .catch(error => handleError(`/products/${testProductId}`, 'GET', error));
    } else {
      console.warn('⚠️ Skipping GET product by ID test - No product ID available');
    }
    
    // 4. PUT /api/products/[id] - Update a product
    if (testProductId) {
      const updatedProduct = {
        name: 'Updated Test Perfume',
        description: 'An updated test fragrance with notes of vanilla and citrus',
      };
      
      await axios.put(`${BASE_URL}/products/${testProductId}`, updatedProduct)
        .then(response => logResponse(`/products/${testProductId}`, 'PUT', response))
        .catch(error => handleError(`/products/${testProductId}`, 'PUT', error));
    } else {
      console.warn('⚠️ Skipping PUT product test - No product ID available');
    }
    
    // 5. Categories tests
    // 5.1 GET /api/categories - Get all categories
    await axios.get(`${BASE_URL}/categories`)
      .then(response => logResponse('/categories', 'GET', response))
      .catch(error => handleError('/categories', 'GET', error));
    
    // 5.2 POST /api/categories - Create a new category
    const newCategory = {
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category for perfumes'
    };
    
    await axios.post(`${BASE_URL}/categories`, newCategory)
      .then(response => {
        logResponse('/categories', 'POST', response);
        // Save the ID for later tests
        if (response.data && response.data.data && response.data.data._id) {
          testCategoryId = response.data.data._id;
          console.log(`Created test category with ID: ${testCategoryId}`);
        }
      })
      .catch(error => handleError('/categories', 'POST', error));
    
    // 5.3 GET /api/categories/[id] - Get single category
    if (testCategoryId) {
      await axios.get(`${BASE_URL}/categories/${testCategoryId}`)
        .then(response => logResponse(`/categories/${testCategoryId}`, 'GET', response))
        .catch(error => handleError(`/categories/${testCategoryId}`, 'GET', error));
    } else {
      console.warn('⚠️ Skipping GET category by ID test - No category ID available');
    }
    
    // 5.4 PUT /api/categories/[id] - Update a category
    if (testCategoryId) {
      const updatedCategory = {
        name: 'Updated Test Category',
        description: 'An updated test category for perfumes'
      };
      
      await axios.put(`${BASE_URL}/categories/${testCategoryId}`, updatedCategory)
        .then(response => logResponse(`/categories/${testCategoryId}`, 'PUT', response))
        .catch(error => handleError(`/categories/${testCategoryId}`, 'PUT', error));
    } else {
      console.warn('⚠️ Skipping PUT category test - No category ID available');
    }
    
    // 6. POST /api/contact - Send a contact form
    const contactForm = {
      name: 'Test User',
      phone: '+33123456789',
      message: 'This is a test message from the API test script'
    };
    
    await axios.post(`${BASE_URL}/contact`, contactForm)
      .then(response => logResponse('/contact', 'POST', response))
      .catch(error => handleError('/contact', 'POST', error));
    
    // 7. GET /api/static/about - Get about page content
    await axios.get(`${BASE_URL}/static/about`)
      .then(response => logResponse('/static/about', 'GET', response))
      .catch(error => handleError('/static/about', 'GET', error));
    
    // 8. PUT /api/static/about - Update about page content
    const aboutContent = {
      content: `<h1>About AVANA PARFUM</h1>
<p>This is test content for the about page, updated via the API test.</p>
<p>AVANA PARFUM offers premium quality fragrances inspired by the world's most iconic perfumes.</p>`
    };
    
    await axios.put(`${BASE_URL}/static/about`, aboutContent)
      .then(response => logResponse('/static/about', 'PUT', response))
      .catch(error => handleError('/static/about', 'PUT', error));
    
    // 9. Test Orders API
    // 9.1 GET /api/orders - Get all orders
    await axios.get(`${BASE_URL}/orders`)
      .then(response => logResponse('/orders', 'GET', response))
      .catch(error => handleError('/orders', 'GET', error));
    
    // 9.2 POST /api/orders - Create a new order
    const newOrder = {
      name: 'Test Customer',
      phone: '+33987654321',
      product: 'Test Perfume',
      note: 'This is a test order'
    };
    
    await axios.post(`${BASE_URL}/orders`, newOrder)
      .then(response => {
        logResponse('/orders', 'POST', response);
        // Save the ID for later tests
        if (response.data && response.data.data && response.data.data._id) {
          testOrderId = response.data.data._id;
          console.log(`Created test order with ID: ${testOrderId}`);
        }
      })
      .catch(error => handleError('/orders', 'POST', error));
    
    // 9.3 GET /api/orders/[id] - Get single order
    if (testOrderId) {
      await axios.get(`${BASE_URL}/orders/${testOrderId}`)
        .then(response => logResponse(`/orders/${testOrderId}`, 'GET', response))
        .catch(error => handleError(`/orders/${testOrderId}`, 'GET', error));
    } else {
      console.warn('⚠️ Skipping GET order by ID test - No order ID available');
    }
    
    // 9.4 PUT /api/orders/[id] - Update order status
    if (testOrderId) {
      const updatedOrder = {
        status: 'Called'
      };
      
      await axios.put(`${BASE_URL}/orders/${testOrderId}`, updatedOrder)
        .then(response => logResponse(`/orders/${testOrderId}`, 'PUT', response))
        .catch(error => handleError(`/orders/${testOrderId}`, 'PUT', error));
    } else {
      console.warn('⚠️ Skipping PUT order test - No order ID available');
    }
    
    // Finally, clean up by deleting the test entities
    // 10. DELETE /api/products/[id] - Delete a product
    if (testProductId) {
      await axios.delete(`${BASE_URL}/products/${testProductId}`)
        .then(response => {
          logResponse(`/products/${testProductId}`, 'DELETE', response);
          console.log(`✅ Successfully deleted test product with ID: ${testProductId}`);
        })
        .catch(error => handleError(`/products/${testProductId}`, 'DELETE', error));
    }
    
    // 11. DELETE /api/categories/[id] - Delete a category
    if (testCategoryId) {
      await axios.delete(`${BASE_URL}/categories/${testCategoryId}`)
        .then(response => {
          logResponse(`/categories/${testCategoryId}`, 'DELETE', response);
          console.log(`✅ Successfully deleted test category with ID: ${testCategoryId}`);
        })
        .catch(error => handleError(`/categories/${testCategoryId}`, 'DELETE', error));
    }
    
    console.log('\n=====================================');
    console.log('🎉 API tests completed');
    
  } catch (error) {
    console.error('❌ Unexpected error in test suite:', error);
  }
}

// Run the tests
testAllRoutes(); 