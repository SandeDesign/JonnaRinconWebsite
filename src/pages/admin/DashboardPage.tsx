import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useOrderStatistics } from '../../hooks/useOrders';
import { useCollaborationStats } from '../../hooks/useCollaborations';
import { beatService, orderService } from '../../lib/firebase/services';
import { TrendingUp, DollarSign, ShoppingBag, Music, Handshake, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { stats: orderStats } = useOrderStatistics();
  const { stats: collabStats } = useCollaborationStats();
  const [totalBeats, setTotalBeats] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const beats = await beatService.getAllBeats();
      setTotalBeats(beats.data.length);
      const orders = await orderService.getRecentOrders(5);
      setRecentOrders(orders);
    };
    fetchData();
  }, []);

  const stats = [
    { name: 'Total Revenue', value: `\u20AC${orderStats.totalRevenue.toFixed(2)}`, icon: DollarSign, change: '+12.5%', changeType: 'positive' },
    { name: 'Total Orders', value: orderStats.totalOrders, icon: ShoppingBag, change: `${orderStats.pendingOrders} pending`, changeType: 'neutral' },
    { name: 'Total Beats', value: totalBeats, icon: Music, change: 'In catalog', changeType: 'neutral' },
    { name: 'Active Collabs', value: collabStats.active, icon: Handshake, change: `${collabStats.completed} completed`, changeType: 'positive' },
    { name: 'Avg Order Value', value: `\u20AC${orderStats.averageOrderValue.toFixed(2)}`, icon: TrendingUp, change: '+8.2%', changeType: 'positive' },
    { name: 'Pending Revenue', value: `\u20AC${collabStats.pendingRevenue.toFixed(2)}`, icon: DollarSign, change: 'From collaborations', changeType: 'neutral' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/30 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white/[0.08] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-5 sm:p-6 hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/30 uppercase tracking-wider">{stat.name}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white mt-1.5">{stat.value}</p>
                    <p className={`text-xs mt-1.5 ${stat.changeType === 'positive' ? 'text-emerald-400' : stat.changeType === 'negative' ? 'text-red-400' : 'text-white/25'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-white/40" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white/[0.08] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Orders</h2>
          <div className="space-y-2">
            {recentOrders.length === 0 ? (
              <p className="text-white/30 text-center py-8 text-sm">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3.5 bg-white/[0.06] rounded-2xl hover:bg-white/[0.06] transition-all gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{order.orderNumber}</p>
                    <p className="text-xs text-white/25 truncate">{order.customerEmail}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-semibold text-sm">{`\u20AC${order.total.toFixed(2)}`}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${
                      order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      order.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/admin/beats" className="group bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] rounded-3xl p-5 transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Music size={18} className="text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Manage Beats</h3>
            <p className="text-white/25 text-xs mt-0.5">Add or edit beats</p>
          </Link>
          <Link to="/admin/orders" className="group bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] rounded-3xl p-5 transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag size={18} className="text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">View Orders</h3>
            <p className="text-white/25 text-xs mt-0.5">Process orders</p>
          </Link>
          <Link to="/admin/content" className="group bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] rounded-3xl p-5 transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users size={18} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Content</h3>
            <p className="text-white/25 text-xs mt-0.5">Manage content</p>
          </Link>
          <Link to="/admin/collaborations" className="group bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] rounded-3xl p-5 transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Handshake size={18} className="text-orange-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Collaborations</h3>
            <p className="text-white/25 text-xs mt-0.5">Manage deals</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
