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
      {/* Filters and Search - Mobile Optimized */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une commande..."
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8a45d] focus:border-transparent text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === 'All' ? 'bg-[#c8a45d] text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Tous
          </button>
          <button 
            onClick={() => setStatusFilter('New')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === 'New' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700'}`}
          >
            Nouveau
          </button>
          <button 
            onClick={() => setStatusFilter('Called')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === 'Called' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700'}`}
          >
            Appelé
          </button>
          <button 
            onClick={() => setStatusFilter('Confirmed')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === 'Confirmed' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700'}`}
          >
            Confirmé
          </button>
          <button 
            onClick={() => setStatusFilter('Shipped')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === 'Shipped' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700'}`}
          >
            Expédié
          </button>
          <button 
            onClick={() => setStatusFilter('Delivered')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === 'Delivered' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700'}`}
          >
            Livré
          </button>
          <button 
            onClick={() => setStatusFilter('Cancelled')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700'}`}
          >
            Annulé
          </button>
        </div>
      </div>
      
      {/* Order Count */}
      <div className="mb-4 text-sm text-gray-600 flex justify-between items-center">
        <div>
          {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''}
          {statusFilter !== 'All' && ` - ${statusFilter}`}
        </div>
        {(searchQuery || statusFilter !== 'All') && (
          <button 
            className="text-[#c8a45d] hover:text-[#b08d48] text-sm font-medium"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
          >
            Effacer les filtres
          </button>
        )}
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-lg text-gray-600">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                {/* Order header with status and date */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </div>
                </div>
                
                {/* Customer info */}
                <div className="flex items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-base">{order.name}</h3>
                    <a href={`tel:${order.phone}`} className="text-sm text-[#c8a45d] hover:underline">{order.phone}</a>
                  </div>
                  <button 
                    onClick={() => viewOrderDetails(order._id)}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600"
                  >
                    <FaEye size={16} />
                  </button>
                </div>
                
                {/* Location */}
                <div className="flex items-start mb-3">
                  <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{order.city || 'N/A'}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{order.address || 'Pas d\'adresse fournie'}</div>
                  </div>
                </div>
                
                {/* Product info */}
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">Produit</div>
                  <div className="text-sm">{getProductDisplay(order)}</div>
                </div>
                
                {/* Status indicator and actions */}
                <div className="mt-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Actions rapides</h4>
                  </div>
                  
                  {/* Status dropdown */}
                  <div className="mb-3">
                    <StatusDropdown 
                      orderId={order._id}
                      currentStatus={order.status}
                      onStatusChange={handleStatusUpdate}
                    />
                  </div>
                  
                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href={`tel:${order.phone}`} 
                      className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="mr-2 text-xl">📞</span> 
                      <span className="font-medium">Appeler</span>
                    </a>
                    <button 
                      onClick={() => viewOrderDetails(order._id)} 
                      className="flex items-center justify-center py-3 px-4 bg-[#c8a45d] rounded-lg text-white hover:bg-[#b08d48] transition-colors"
                    >
                      <span className="mr-2 text-xl">👁</span> 
                      <span className="font-medium">Détails</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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