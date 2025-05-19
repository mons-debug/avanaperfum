'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import StatusDropdown from './StatusDropdown';
import OrderDetails from './OrderDetails';
import { FaSearch, FaSort, FaFilter, FaEllipsisV, FaMapMarkerAlt, FaEye } from 'react-icons/fa';

interface Order {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  product: string;
  items?: any[];
  note?: string;
  status: 'New' | 'Called' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          console.log('Orders data:', data.data);
          setOrders(data.data);
          setFilteredOrders(data.data);
        } else {
          throw new Error(data.error || 'Something went wrong');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching orders');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search query and status filter
  useEffect(() => {
    let result = orders;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.name?.toLowerCase().includes(query) || 
        order.phone?.toLowerCase().includes(query) || 
        order.product?.toLowerCase().includes(query) ||
        order.city?.toLowerCase().includes(query) ||
        order.address?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
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

      // Update local state after successful API call
      const data = await response.json();
      if (data.success && data.data) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: data.data.status } : order
        ));
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert(`Error: ${err.message || 'Failed to update status'}`);
    }
  };

  // Format date display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        <div>
          <div>{formatDistanceToNow(date, { addSuffix: true })}</div>
          <div className="text-xs text-gray-500">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      );
    } catch (error) {
      return dateString;
    }
  };
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    let classes = "px-3 py-1 text-xs font-bold rounded-full ";
    
    switch (status) {
      case 'New':
        classes += "bg-blue-100 text-blue-800";
        break;
      case 'Called':
        classes += "bg-yellow-100 text-yellow-800";
        break;
      case 'Confirmed':
        classes += "bg-purple-100 text-purple-800";
        break;
      case 'Shipped':
        classes += "bg-indigo-100 text-indigo-800";
        break;
      case 'Delivered':
        classes += "bg-green-100 text-green-800";
        break;
      case 'Cancelled':
        classes += "bg-red-100 text-red-800";
        break;
      default:
        classes += "bg-gray-100 text-gray-800";
    }
    
    return <span className={classes}>{status}</span>;
  };

  // Get product name display
  const getProductDisplay = (order: Order) => {
    if (order.product) {
      return order.product;
    } else if (order.items && order.items.length > 0) {
      return `${order.items.length} items`;
    } else {
      return <span className="text-gray-400 italic">No product</span>;
    }
  };

  // View order details
  const viewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6 mx-auto"></div>
          <div className="h-64 w-full bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="sm:w-48">
          <select
            className="w-full border border-gray-300 rounded-lg py-2 pl-4 pr-8 appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Called">Called</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Order Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        {statusFilter !== 'All' && ` with status: ${statusFilter}`}
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-lg text-gray-600">No orders found</p>
          {(searchQuery || statusFilter !== 'All') && (
            <button 
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Customer</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Location</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Product</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Note</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Date</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Status</th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium">{order.name}</div>
                      <div className="text-sm text-gray-600">{order.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-red-500 mt-1 mr-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{order.city ? order.city : 'N/A'}</div>
                          <div className="text-sm text-gray-600 truncate max-w-[200px]">{order.address || 'No address provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getProductDisplay(order)}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="truncate">
                        {order.note || <span className="text-gray-400 italic">No note</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <StatusDropdown 
                          orderId={order._id}
                          currentStatus={order.status}
                          onStatusChange={handleStatusUpdate}
                        />
                        <button 
                          className="p-1.5 hover:bg-gray-100 rounded text-blue-600" 
                          title="View details"
                          onClick={() => viewOrderDetails(order._id)}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderId && (
        <OrderDetails 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
        />
      )}
    </div>
  );
} 