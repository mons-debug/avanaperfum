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
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-[#c8a45d] to-[#d4b366] rounded-xl shadow-sm p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Tableau de Bord</h1>
            <p className="text-white/90">
              Aperçu de votre boutique AVANA PARFUM
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-white/90">
            <FaCalendarAlt />
            <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl mr-4">
              <FaShoppingBag className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Commandes</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.ordersCount}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 text-purple-600 p-4 rounded-xl mr-4">
              <FaBox className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Produits</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.productsCount}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-100 text-green-600 p-4 rounded-xl mr-4">
              <FaTags className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Catégories</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.categoriesCount}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Status Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Statut des Commandes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-blue-900">Nouvelles</h3>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.newOrders}
              </span>
            </div>
            <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.ordersCount > 0 ? (stats.newOrders / stats.ordersCount) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              {stats.ordersCount > 0 ? Math.round((stats.newOrders / stats.ordersCount) * 100) : 0}% du total
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-yellow-900">Confirmées</h3>
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.confirmedOrders}
              </span>
            </div>
            <div className="h-3 bg-yellow-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.ordersCount > 0 ? (stats.confirmedOrders / stats.ordersCount) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              {stats.ordersCount > 0 ? Math.round((stats.confirmedOrders / stats.ordersCount) * 100) : 0}% du total
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-green-900">Livrées</h3>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.deliveredOrders}
              </span>
            </div>
            <div className="h-3 bg-green-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.ordersCount > 0 ? (stats.deliveredOrders / stats.ordersCount) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              {stats.ordersCount > 0 ? Math.round((stats.deliveredOrders / stats.ordersCount) * 100) : 0}% du total
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Commandes Récentes</h2>
          <Link 
            href="/admin/orders"
            className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#c8a45d] text-white rounded-lg hover:bg-[#b08d48] transition-colors text-sm font-medium"
          >
            Voir Toutes
          </Link>
        </div>
        
        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Client</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order: any, index: number) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.name}</div>
                        <div className="text-sm text-gray-500">{order.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.product || `${order.items?.length || 0} articles`}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Called' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Confirmed' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
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
          <div className="text-center py-8 text-gray-500">
            <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Aucune commande récente</p>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/admin/products/new" 
            className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <div className="bg-blue-500 p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform">
              <FaRocket className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Nouveau Produit</h3>
              <p className="text-sm text-blue-700">Ajouter un nouveau parfum</p>
            </div>
          </Link>
          
          <Link 
            href="/admin/categories/new" 
            className="group flex items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <div className="bg-purple-500 p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform">
              <FaTags className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">Nouvelle Catégorie</h3>
              <p className="text-sm text-purple-700">Créer une catégorie</p>
            </div>
          </Link>
          
          <Link 
            href="/admin/settings" 
            className="group flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <div className="bg-green-500 p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Paramètres</h3>
              <p className="text-sm text-green-700">Gérer la boutique</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
  