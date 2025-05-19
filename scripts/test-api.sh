#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000/api"
PRODUCT_ID=""
CATEGORY_ID=""
ORDER_ID=""

# Color codes for output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

echo -e "${GREEN}🧪 Starting API tests for AVANA PARFUM${NC}"
echo "====================================="

# Function to print response
print_response() {
  local endpoint=$1
  local method=$2
  local status=$3
  local response=$4
  
  echo -e "\n${method} ${endpoint}"
  echo "Status: ${status}"
  
  # Truncate response if it's too long
  local preview=$(echo "${response}" | head -c 150)
  echo "Response: ${preview}..."
  
  if [[ $status -ge 200 && $status -lt 300 ]]; then
    echo -e "${GREEN}✅ Test passed${NC}\n"
  else
    echo -e "${RED}❌ Test failed${NC}\n"
  fi
}

# 1. GET /api/products - Fetch all products
echo -e "\n${YELLOW}Testing GET /api/products${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/products")
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/products" "GET" "$status" "$body"

# 2. POST /api/products - Create a new product
echo -e "\n${YELLOW}Testing POST /api/products${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Perfume (Curl)",
    "inspiredBy": "Test Original",
    "description": "A test fragrance with notes of vanilla and citrus",
    "volume": "30",
    "tags": ["test", "vanilla", "citrus"],
    "ingredients": "Alcohol, Aqua, Parfum, Vanilla, Citrus",
    "imageUrl": "/images/products/test-perfume.jpg",
    "category": "Unisexe",
    "gender": "Mixte"
  }')
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/products" "POST" "$status" "$body"

# Extract the product ID from the response
if [[ $status -ge 200 && $status -lt 300 ]]; then
  PRODUCT_ID=$(echo "$body" | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')
  echo -e "Extracted product ID: ${PRODUCT_ID}"
fi

# 3. GET /api/products/[id] - Get single product
if [[ -n "$PRODUCT_ID" ]]; then
  echo -e "\n${YELLOW}Testing GET /api/products/${PRODUCT_ID}${NC}"
  response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/products/${PRODUCT_ID}")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_response "/products/${PRODUCT_ID}" "GET" "$status" "$body"
else
  echo -e "\n${YELLOW}⚠️ Skipping GET product by ID test - No product ID available${NC}"
fi

# 4. PUT /api/products/[id] - Update a product
if [[ -n "$PRODUCT_ID" ]]; then
  echo -e "\n${YELLOW}Testing PUT /api/products/${PRODUCT_ID}${NC}"
  response=$(curl -s -w "\n%{http_code}" -X PUT "${BASE_URL}/products/${PRODUCT_ID}" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Updated Test Perfume (Curl)",
      "description": "An updated test fragrance with notes of vanilla and citrus"
    }')
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_response "/products/${PRODUCT_ID}" "PUT" "$status" "$body"
else
  echo -e "\n${YELLOW}⚠️ Skipping PUT product test - No product ID available${NC}"
fi

# 5. GET /api/categories - Get all categories
echo -e "\n${YELLOW}Testing GET /api/categories${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/categories")
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/categories" "GET" "$status" "$body"

# 6. POST /api/categories - Create a new category
echo -e "\n${YELLOW}Testing POST /api/categories${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category (Curl)",
    "slug": "test-category-curl",
    "description": "A test category for perfumes"
  }')
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/categories" "POST" "$status" "$body"

# Extract the category ID from the response
if [[ $status -ge 200 && $status -lt 300 ]]; then
  CATEGORY_ID=$(echo "$body" | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')
  echo -e "Extracted category ID: ${CATEGORY_ID}"
fi

# 7. GET /api/categories/[id] - Get single category
if [[ -n "$CATEGORY_ID" ]]; then
  echo -e "\n${YELLOW}Testing GET /api/categories/${CATEGORY_ID}${NC}"
  response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/categories/${CATEGORY_ID}")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_response "/categories/${CATEGORY_ID}" "GET" "$status" "$body"
else
  echo -e "\n${YELLOW}⚠️ Skipping GET category by ID test - No category ID available${NC}"
fi

# 8. PUT /api/categories/[id] - Update a category
if [[ -n "$CATEGORY_ID" ]]; then
  echo -e "\n${YELLOW}Testing PUT /api/categories/${CATEGORY_ID}${NC}"
  response=$(curl -s -w "\n%{http_code}" -X PUT "${BASE_URL}/categories/${CATEGORY_ID}" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Updated Test Category (Curl)",
      "description": "An updated test category for perfumes"
    }')
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_response "/categories/${CATEGORY_ID}" "PUT" "$status" "$body"
else
  echo -e "\n${YELLOW}⚠️ Skipping PUT category test - No category ID available${NC}"
fi

# 9. POST /api/contact - Send a contact form
echo -e "\n${YELLOW}Testing POST /api/contact${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User (Curl)",
    "phone": "+33123456789",
    "message": "This is a test message from the curl test script"
  }')
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/contact" "POST" "$status" "$body"

# 10. GET /api/static/about - Get about page content
echo -e "\n${YELLOW}Testing GET /api/static/about${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/static/about")
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/static/about" "GET" "$status" "$body"

# 11. PUT /api/static/about - Update about page content
echo -e "\n${YELLOW}Testing PUT /api/static/about${NC}"
response=$(curl -s -w "\n%{http_code}" -X PUT "${BASE_URL}/static/about" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<h1>About AVANA PARFUM</h1><p>This is test content for the about page, updated via the curl test.</p><p>AVANA PARFUM offers premium quality fragrances inspired by the world\"s most iconic perfumes.</p>"
  }')
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/static/about" "PUT" "$status" "$body"

# 12. GET /api/orders - Get all orders
echo -e "\n${YELLOW}Testing GET /api/orders${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/orders")
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/orders" "GET" "$status" "$body"

# 13. POST /api/orders - Create a new order
echo -e "\n${YELLOW}Testing POST /api/orders${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer (Curl)",
    "phone": "+33987654321",
    "product": "Test Perfume",
    "note": "This is a test order"
  }')
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
print_response "/orders" "POST" "$status" "$body"

# Extract the order ID from the response
if [[ $status -ge 200 && $status -lt 300 ]]; then
  ORDER_ID=$(echo "$body" | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')
  echo -e "Extracted order ID: ${ORDER_ID}"
fi

# 14. GET /api/orders/[id] - Get single order
if [[ -n "$ORDER_ID" ]]; then
  echo -e "\n${YELLOW}Testing GET /api/orders/${ORDER_ID}${NC}"
  response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/orders/${ORDER_ID}")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_response "/orders/${ORDER_ID}" "GET" "$status" "$body"
else
  echo -e "\n${YELLOW}⚠️ Skipping GET order by ID test - No order ID available${NC}"
fi

# 15. PUT /api/orders/[id] - Update order status
if [[ -n "$ORDER_ID" ]]; then
  echo -e "\n${YELLOW}Testing PUT /api/orders/${ORDER_ID}${NC}"
  response=$(curl -s -w "\n%{http_code}" -X PUT "${BASE_URL}/orders/${ORDER_ID}" \
    -H "Content-Type: application/json" \
    -d '{
      "status": "Called"
    }')
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_response "/orders/${ORDER_ID}" "PUT" "$status" "$body"
else
  echo -e "\n${YELLOW}⚠️ Skipping PUT order test - No order ID available${NC}"
fi

# Cleanup - DELETE resources we created for testing

# 16. DELETE /api/products/[id] - Delete a product
if [[ -n "$PRODUCT_ID" ]]; then
  echo -e "\n${YELLOW}Testing DELETE /api/products/${PRODUCT_ID}${NC}"
  response=$(curl -s -w "\n%{http_code}" -X DELETE "${BASE_URL}/products/${PRODUCT_ID}")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_response "/products/${PRODUCT_ID}" "DELETE" "$status" "$body"
  if [[ $status -ge 200 && $status -lt 300 ]]; then
    echo -e "${GREEN}✅ Successfully deleted test product with ID: ${PRODUCT_ID}${NC}"
  fi
fi

# 17. DELETE /api/categories/[id] - Delete a category
if [[ -n "$CATEGORY_ID" ]]; then
  echo -e "\n${YELLOW}Testing DELETE /api/categories/${CATEGORY_ID}${NC}"
  response=$(curl -s -w "\n%{http_code}" -X DELETE "${BASE_URL}/categories/${CATEGORY_ID}")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_response "/categories/${CATEGORY_ID}" "DELETE" "$status" "$body"
  if [[ $status -ge 200 && $status -lt 300 ]]; then
    echo -e "${GREEN}✅ Successfully deleted test category with ID: ${CATEGORY_ID}${NC}"
  fi
fi

echo -e "\n${GREEN}=====================================\n🎉 API tests completed${NC}" 