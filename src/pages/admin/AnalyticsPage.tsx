import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBeats } from '../../hooks/useBeats';
import { useOrders } from '../../hooks/useOrders';
import { useContent } from '../../hooks/useContent';
import { useCollaborations } from '../../hooks/useCollaborations';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Music,
  Eye,
  Users,
  FileText,
  Handshake,
  Calendar,
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { beats } = useBeats();
  const { orders, statistics: orderStats } = useOrders();
  const { content } = useContent();
  const { collaborations, statistics: collabStats } = useCollaborations();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Calculate analytics
  const totalRevenue = orderStats?.totalRevenue || 0;
  const totalOrders = orders.length;
  const totalBeats = beats.length;
  const totalViews = content.reduce((sum, c) => sum + c.views, 0);
  const totalPlays = beats.reduce((sum, b) => sum + b.plays, 0);
  const totalDownloads = beats.reduce((sum, b) => sum + b.downloads, 0);

  // Top performing beats
  const topBeats = [...beats]
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 5);

  // Top content by views
  const topContent = [...content]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Recent activity
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  // Calculate revenue trend (mock for now - would need historical data)
  const revenueTrend = 12.5; // percentage increase

  // Calculate engagement metrics
  const publishedBeats = beats.filter((b) => b.status === 'published').length;
  const featuredBeats = beats.filter((b) => b.featured).length;
  const publishedContent = content.filter((c) => c.status === 'published').length;
  const activeCollaborations = collaborations.filter((c) => c.status === 'active').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-2">Overview of your platform performance</p>
          </div>
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <DollarSign className="text-green-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              €{totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="text-green-400 mr-1" size={16} />
              <span className="text-green-400">+{revenueTrend}%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Orders</p>
              <ShoppingCart className="text-blue-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{totalOrders}</p>
            <p className="text-sm text-gray-400 mt-2">
              {orders.filter((o) => o.status === 'completed').length} completed
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Beats</p>
              <Music className="text-purple-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{totalBeats}</p>
            <p className="text-sm text-gray-400 mt-2">
              {publishedBeats} published • {featuredBeats} featured
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Content Views</p>
              <Eye className="text-pink-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {publishedContent} published articles
            </p>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Beat Performance</h3>
              <Music className="text-purple-400" size={20} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Total Plays</p>
                <p className="text-2xl font-bold text-white">{totalPlays.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Downloads</p>
                <p className="text-2xl font-bold text-white">{totalDownloads.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Plays per Beat</p>
                <p className="text-2xl font-bold text-white">
                  {totalBeats > 0 ? Math.round(totalPlays / totalBeats) : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Content Engagement</h3>
              <FileText className="text-blue-400" size={20} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Total Articles</p>
                <p className="text-2xl font-bold text-white">{content.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Likes</p>
                <p className="text-2xl font-bold text-white">
                  {content.reduce((sum, c) => sum + c.likes, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Shares</p>
                <p className="text-2xl font-bold text-white">
                  {content.reduce((sum, c) => sum + c.shares, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Collaborations</h3>
              <Handshake className="text-green-400" size={20} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Total Collaborations</p>
                <p className="text-2xl font-bold text-white">{collaborations.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white">{activeCollaborations}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  €{(collabStats?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Beats */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Beats</h3>
          <div className="space-y-3">
            {topBeats.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No beats available</p>
            ) : (
              topBeats.map((beat, index) => (
                <div
                  key={beat.id}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                    <img
                      src={beat.artworkUrl}
                      alt={beat.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">{beat.title}</p>
                      <p className="text-sm text-gray-400">{beat.artist}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{beat.plays.toLocaleString()} plays</p>
                    <p className="text-sm text-gray-400">{beat.downloads} downloads</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Content & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Content */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Content by Views</h3>
            <div className="space-y-3">
              {topContent.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No content available</p>
              ) : (
                topContent.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{item.title}</p>
                        <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{item.views.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">views</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-400">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">€{order.totalAmount}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
