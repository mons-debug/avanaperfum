import { Metadata } from 'next';
import OrdersTable from './OrdersTable';

export const metadata: Metadata = {
  title: 'AVANA PARFUM - Gestion des Commandes',
  description: 'Gérer toutes les commandes clients',
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérez et suivez toutes les commandes de vos clients
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Temps réel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <OrdersTable />
      </div>
    </div>
  );
} 