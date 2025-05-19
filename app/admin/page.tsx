// app/admin/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  FaShoppingBag, 
  FaBox, 
  FaTags, 
  FaUsers, 
  FaChartLine, 
  FaRocket,
  FaCalendarAlt,
  FaCloudUploadAlt
} from 'react-icons/fa';
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Category from '@/models/Category';

export const metadata: Metadata = {
  title: 'AVANA PARFUM - Admin Dashboard',
  description: 'Admin dashboard for AVANA PARFUM',
};

async function getStats() {
  try {
    await connectToDB();
    
    const productsCount = await Product.countDocuments({});
    const ordersCount = await Order.countDocuments({});
    const categoriesCount = await Category.countDocuments({});
    
    // Get recent orders (last 5)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get orders by status
    const newOrders = await Order.countDocuments({ status: 'New' });
    const confirmedOrders = await Order.countDocuments({ status: 'Confirmed' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    
    return {
      productsCount,
      ordersCount,
      categoriesCount,
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      newOrders,
      confirmedOrders,
      deliveredOrders
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      productsCount: 0,
      ordersCount: 0,
      categoriesCount: 0,
      recentOrders: [],
      newOrders: 0,
      confirmedOrders: 0,
      deliveredOrders: 0
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaCalendarAlt />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-lg mr-4">
            <FaShoppingBag className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold">{stats.ordersCount}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
          <div className="bg-purple-100 text-purple-600 p-4 rounded-lg mr-4">
            <FaBox className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Products</p>
            <h3 className="text-2xl font-bold">{stats.productsCount}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
          <div className="bg-green-100 text-green-600 p-4 rounded-lg mr-4">
            <FaTags className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <h3 className="text-2xl font-bold">{stats.categoriesCount}</h3>
          </div>
        </div>
      </div>
      
      {/* Order Status Cards */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">New Orders</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                {stats.newOrders}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${stats.ordersCount > 0 ? (stats.newOrders / stats.ordersCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Confirmed</h3>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                {stats.confirmedOrders}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${stats.ordersCount > 0 ? (stats.confirmedOrders / stats.ordersCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Delivered</h3>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                {stats.deliveredOrders}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${stats.ordersCount > 0 ? (stats.deliveredOrders / stats.ordersCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link 
            href="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </Link>
        </div>
        
        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{order.name}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{order.product}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        order.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Called' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Confirmed' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No recent orders</div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/admin/products/new" 
          className="flex items-center p-6 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
        >
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <FaRocket className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Add New Product</h3>
            <p className="text-sm text-gray-600">Create a new product listing</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/categories/new" 
          className="flex items-center p-6 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
        >
          <div className="bg-purple-100 p-3 rounded-lg mr-4">
            <FaTags className="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Add New Category</h3>
            <p className="text-sm text-gray-600">Create a product category</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/settings" 
          className="flex items-center p-6 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
        >
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <FaChartLine className="text-green-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Site Settings</h3>
            <p className="text-sm text-gray-600">Manage your store settings</p>
          </div>
        </Link>
      </div>
      
      {/* Developer Tools Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Developer Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/admin/tools/local-storage-test" 
            className="flex items-center p-6 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg transition-colors"
          >
            <div className="bg-cyan-100 p-3 rounded-lg mr-4">
              <FaCloudUploadAlt className="text-cyan-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Image Upload Test</h3>
              <p className="text-sm text-gray-600">Test local image uploads & storage</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
  