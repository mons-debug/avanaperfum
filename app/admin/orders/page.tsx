import { Metadata } from 'next';
import OrdersTable from './OrdersTable';

export const metadata: Metadata = {
  title: 'AVANA PARFUM - Admin Orders',
  description: 'Manage all customer orders',
};

export default function AdminOrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      <OrdersTable />
    </div>
  );
} 