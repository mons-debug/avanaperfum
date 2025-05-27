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

  // Handle status update from OrderDetails modal
  const handleStatusUpdateFromModal = (orderId: string, newStatus: string) => {
    console.log('Received status update from modal:', orderId, newStatus);
    
    // Update local state immediately since the API call was already made in OrderDetails
    const updatedOrders = orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus as Order['status'] } : order
    );
    
    console.log('Updated orders:', updatedOrders.find(o => o._id === orderId));
    setOrders(updatedOrders);
    
    // Force a re-render of filtered orders as well
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      let result = updatedOrders;
      
      if (searchQuery) {
        result = result.filter(order => 
          order.name?.toLowerCase().includes(query) || 
          order.phone?.toLowerCase().includes(query) || 
          order.product?.toLowerCase().includes(query) ||
          order.city?.toLowerCase().includes(query) ||
          order.address?.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter !== 'All') {
        result = result.filter(order => order.status === statusFilter);
      }
      
      setFilteredOrders(result);
    }, 100);
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

  // Close modal and refresh
  const closeOrderDetails = () => {
    setSelectedOrderId(null);
    // Force a small refresh to ensure UI is in sync
    setTimeout(() => {
      setFilteredOrders([...filteredOrders]);
    }, 100);
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
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, ville..."
            className="pl-12 pr-4 py-4 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c8a45d] focus:border-transparent text-base bg-gray-50 focus:bg-white transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setStatusFilter('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              statusFilter === 'All' 
                ? 'bg-[#c8a45d] text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({orders.length})
          </button>
          <button 
            onClick={() => setStatusFilter('New')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              statusFilter === 'New' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Nouveau ({orders.filter(o => o.status === 'New').length})
          </button>
          <button 
            onClick={() => setStatusFilter('Called')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              statusFilter === 'Called' 
                ? 'bg-yellow-500 text-white shadow-md' 
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            Appelé ({orders.filter(o => o.status === 'Called').length})
          </button>
          <button 
            onClick={() => setStatusFilter('Confirmed')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              statusFilter === 'Confirmed' 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Confirmé ({orders.filter(o => o.status === 'Confirmed').length})
          </button>
          <button 
            onClick={() => setStatusFilter('Shipped')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              statusFilter === 'Shipped' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            Expédié ({orders.filter(o => o.status === 'Shipped').length})
          </button>
          <button 
            onClick={() => setStatusFilter('Delivered')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              statusFilter === 'Delivered' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Livré ({orders.filter(o => o.status === 'Delivered').length})
          </button>
          <button 
            onClick={() => setStatusFilter('Cancelled')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              statusFilter === 'Cancelled' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Annulé ({orders.filter(o => o.status === 'Cancelled').length})
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
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="text-gray-400 text-xl" />
          </div>
          <p className="text-lg font-medium text-gray-600 mb-2">Aucune commande trouvée</p>
          <p className="text-sm text-gray-500">
            {searchQuery || statusFilter !== 'All' 
              ? 'Essayez de modifier vos filtres de recherche' 
              : 'Les nouvelles commandes apparaîtront ici'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-6">
                {/* Order header with status and date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-gray-500 font-medium">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </div>
                </div>
                
                {/* Customer info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{order.name}</h3>
                    <a 
                      href={`tel:${order.phone}`} 
                      className="text-[#c8a45d] hover:text-[#b08d48] font-medium text-sm flex items-center transition-colors"
                    >
                      📞 {order.phone}
                    </a>
                  </div>
                  <button 
                    onClick={() => viewOrderDetails(order._id)}
                    className="p-3 bg-gray-100 hover:bg-[#c8a45d] hover:text-white rounded-xl text-gray-600 transition-all duration-200 group"
                  >
                    <FaEye size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                
                {/* Location and Product Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Location */}
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                    <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm">{order.city || 'N/A'}</div>
                      <div className="text-xs text-gray-500 truncate">{order.address || 'Pas d\'adresse fournie'}</div>
                    </div>
                  </div>
                  
                  {/* Product info */}
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-xs font-bold">P</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm">Produit</div>
                      <div className="text-xs text-gray-500 truncate">{getProductDisplay(order)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Actions Section */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Actions Rapides</h4>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  {/* Action buttons - Enhanced mobile layout */}
                  <div className="space-y-3">
                    {/* Status dropdown - full width */}
                    <div className="w-full">
                      <StatusDropdown 
                        orderId={order._id}
                        currentStatus={order.status}
                        onStatusChange={handleStatusUpdate}
                      />
                    </div>
                    
                    {/* Action buttons - improved mobile design */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a 
                        href={`tel:${order.phone}`} 
                        className="flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 hover:border-[#c8a45d] hover:text-[#c8a45d] hover:bg-[#c8a45d]/5 transition-all duration-200 min-h-[52px] group"
                      >
                        <span className="mr-3 text-lg group-hover:scale-110 transition-transform">📞</span> 
                        <span className="font-medium">Appeler Client</span>
                      </a>
                      <button 
                        onClick={() => viewOrderDetails(order._id)} 
                        className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-[#c8a45d] to-[#d4b366] rounded-xl text-white hover:from-[#b08d48] hover:to-[#c8a45d] transition-all duration-200 min-h-[52px] shadow-sm hover:shadow-md group"
                      >
                        <span className="mr-3 text-lg group-hover:scale-110 transition-transform">👁</span> 
                        <span className="font-medium">Voir Détails</span>
                      </button>
                    </div>
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
          onClose={closeOrderDetails} 
          onStatusUpdate={handleStatusUpdateFromModal}
        />
      )}
    </div>
  );
} 