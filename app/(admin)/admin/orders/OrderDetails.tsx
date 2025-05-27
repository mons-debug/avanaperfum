'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaBox, FaMoneyBillWave, FaClipboardList, FaShoppingCart } from 'react-icons/fa';

// Define product interface for fetching product details
interface ProductDetails {
  _id: string;
  name: string;
  price: number;
  inspiredBy?: string;
  volume?: string;
  images?: string[];
}

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

interface Order {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  product: string;
  items?: Array<{ id: string; quantity: number; name?: string; price?: number }>;
  originalSubtotal?: number;
  bulkDiscount?: number;
  subtotal: number;
  shipping: number;
  total: number;
  totalQuantity?: number;
  promoMessage?: string;
  note?: string;
  status: string;
  createdAt: string;
}

const OrderDetails = ({ orderId, onClose, onStatusUpdate }: OrderDetailsProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          const orderData = data.data;
          
          // If order has items array, ensure we have complete item data
          if (orderData.items && orderData.items.length > 0) {
            // Fetch product details for each item if needed
            const updatedItems = await Promise.all(
              orderData.items.map(async (item: { id: string; quantity: number; name?: string; price?: number }) => {
                // Only fetch if we don't already have name and price
                if (!item.name || !item.price) {
                  try {
                    const productResponse = await fetch(`/api/products/${item.id}`);
                    if (productResponse.ok) {
                      const productData = await productResponse.json();
                      if (productData.success && productData.data) {
                        return {
                          ...item,
                          name: productData.data.name,
                          price: productData.data.price
                        };
                      }
                    }
                  } catch (err) {
                    console.error(`Error fetching details for product ${item.id}:`, err);
                  }
                }
                return item;
              })
            );
            
            orderData.items = updatedItems;
          }
          
          setOrder(orderData);
          
          // Fetch product details if a single product ID is available
          if (orderData.product) {
            try {
              const productResponse = await fetch(`/api/products/${orderData.product}`);
              if (productResponse.ok) {
                const productData = await productResponse.json();
                if (productData.success && productData.data) {
                  setProductDetails(productData.data);
                }
              }
            } catch (err) {
              console.error('Error fetching product details:', err);
            }
          }
        } else {
          throw new Error(data.error || 'Something went wrong');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order details');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const data = await response.json();
      if (data.success && data.data) {
        // Update local state
        const updatedOrder = {...order, status: data.data.status};
        setOrder(updatedOrder);
        
        // Notify parent component to update immediately
        if (onStatusUpdate) {
          console.log('Updating parent with status:', data.data.status);
          onStatusUpdate(orderId, data.data.status);
        }
        
        // Show success notification
        alert(`✅ Statut mis à jour vers: ${data.data.status}`);
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert(`❌ Erreur: ${err.message || 'Échec de la mise à jour du statut'}`);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error}</p>
          <button 
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {order.name}</p>
                <p><span className="font-medium">Phone:</span> {order.phone}</p>
                <p><span className="font-medium">Email:</span> {order.email}</p>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                Shipping Information
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">City:</span> {order.city ? order.city : 'N/A'}</p>
                <p><span className="font-medium">Address:</span> {order.address || 'No address provided'}</p>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaBox className="mr-2 text-purple-500" />
              Order Information
            </h3>
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium">Order Date:</span> 
                <span>{formatDate(order.createdAt)}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium mr-2">Status:</span>
                <div className="relative inline-block">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="pl-3 pr-8 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Called">Called</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaShoppingCart className="mr-2 text-indigo-500" />
              Produits Commandés
            </h3>
            
            {productDetails ? (
              <div className="border border-gray-200 rounded-lg p-3 mb-2">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{productDetails.name}</span>
                  <span>x1</span>
                </div>
                {productDetails.inspiredBy && (
                  <div className="text-sm text-gray-600 mb-1">
                    Inspiré par : {productDetails.inspiredBy}
                  </div>
                )}
                {productDetails.volume && (
                  <div className="text-sm text-gray-600 mb-1">
                    Volume : {productDetails.volume}
                  </div>
                )}
                <div className="flex justify-between text-[#c8a45d] font-medium">
                  <span>Prix :</span>
                  <span>{productDetails.price.toFixed(2)} DH</span>
                </div>
              </div>
            ) : order.product ? (
              <div className="border border-gray-200 rounded-lg p-3 mb-2">
                <div className="flex justify-between">
                  <span className="font-medium text-red-500">Product name unavailable</span>
                  <span className="text-xs text-gray-500">ID: {order.product}</span>
                </div>
              </div>
            ) : order.items && order.items.length > 0 ? (
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{item.name || 'Product name unavailable'}</span>
                      <span>x{item.quantity}</span>
                    </div>
                    {!item.name && (
                      <div className="text-xs text-gray-500 mb-1">ID: {item.id}</div>
                    )}
                    {item.price && (
                      <div className="flex justify-between text-[#c8a45d] font-medium">
                        <span>Price:</span>
                        <span>{item.price.toFixed(2)} DH</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No product information available</p>
            )}
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-500" />
              Payment Information
            </h3>
            
            {/* Show promotional message if available */}
            {order.promoMessage && (
              <div className="mb-3 p-2 bg-gradient-to-r from-[#c8a45d] to-[#d4b366] text-white rounded-lg text-center text-sm">
                {order.promoMessage}
              </div>
            )}
            
            {/* Show bulk pricing breakdown if available */}
            {order.originalSubtotal && order.bulkDiscount && order.bulkDiscount > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span>Original Subtotal ({order.totalQuantity || 1} item{(order.totalQuantity || 1) > 1 ? 's' : ''}):</span>
                  <span>{order.originalSubtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-green-600">
                  <span>🎉 Bulk Discount:</span>
                  <span>-{order.bulkDiscount.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between items-center mb-2 font-medium">
                  <span>Subtotal with discount:</span>
                  <span>{order.subtotal.toFixed(2)} DH</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal:</span>
                <span>{order.subtotal.toFixed(2)} DH</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-2">
              <span>Shipping:</span>
              <span>{order.shipping.toFixed(2)} DH</span>
            </div>
            <div className="flex justify-between items-center font-bold border-t border-gray-200 pt-2 mt-2">
              <span>Total:</span>
              <span>{order.total.toFixed(2)} DH</span>
            </div>
          </div>

          {/* Notes */}
          {order.note && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FaClipboardList className="mr-2 text-yellow-500" />
                Notes
              </h3>
              <p className="text-gray-700">{order.note}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 