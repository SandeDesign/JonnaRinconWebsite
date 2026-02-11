import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useOrders } from '../../hooks/useOrders';
import { orderService } from '../../lib/firebase/services';
import { OrderStatus } from '../../lib/firebase/types';
import { Eye } from 'lucide-react';

const OrdersPage: React.FC = () => {
  const { orders, loading } = useOrders();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      alert('Order status updated');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      refunded: 'bg-gray-500/20 text-gray-400',
      cancelled: 'bg-gray-500/20 text-gray-400',
    };
    return colors[status];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Orders Management</h1>
            <p className="text-gray-400 mt-2">Manage and process customer orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {orders.filter((o) => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {orders.filter((o) => o.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-white mt-1">
              €{orders.reduce((sum, o) => o.status === 'completed' ? sum + o.total : sum, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Order Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{order.orderNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white">{order.customerName || 'Guest'}</p>
                          <p className="text-sm text-gray-400">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">€{order.total.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)} bg-transparent border-0`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {order.createdAt && new Date((order.createdAt as any).seconds * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
