import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBeats } from '../../hooks/useBeats';
import { useTracks } from '../../hooks/useTracks';
import { useRemixes } from '../../hooks/useRemixes';
import { useOrders } from '../../hooks/useOrders';
import { useContent } from '../../hooks/useContent';
import { useCollaborations } from '../../hooks/useCollaborations';
import { db } from '../../lib/firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
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
  MessageSquare,
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { beats, loading: beatsLoading } = useBeats();
  const { tracks, loading: tracksLoading } = useTracks({ status: 'published' });
  const { remixes, loading: remixesLoading } = useRemixes({ status: 'published' });
  const { orders, statistics: orderStats } = useOrders();
  const { content } = useContent();
  const { collaborations, statistics: collabStats } = useCollaborations();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [chatStats, setChatStats] = useState({
    totalMessages: 0,
    uniqueConversations: 0,
    messagesByRole: { customer: 0, artist: 0, manager: 0, admin: 0 },
  });

  // Load chat statistics
  useEffect(() => {
    const messagesRef = collection(db, 'supportMessages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      const uniqueSenders = new Set(messages.map((m: any) => m.senderId));
      const roleCount = {
        customer: 0,
        artist: 0,
        manager: 0,
        admin: 0,
      };

      messages.forEach((msg: any) => {
        if (msg.senderRole === 'customer') roleCount.customer++;
        else if (msg.senderRole === 'artist') roleCount.artist++;
        else if (msg.senderRole === 'manager') roleCount.manager++;
        else if (msg.senderRole === 'admin') roleCount.admin++;
      });

      setChatStats({
        totalMessages: messages.length,
        uniqueConversations: uniqueSenders.size,
        messagesByRole: roleCount,
      });
    });

    return () => unsubscribe();
  }, []);

  // Calculate analytics
  const totalRevenue = orderStats?.totalRevenue || 0;
  const totalOrders = orders.length;
  const totalBeats = beats.length;
  const totalTracks = tracks.length;
  const totalRemixes = remixes.length;
  const totalViews = content.reduce((sum, c) => sum + c.views, 0);

  // Calculate total plays across all content types
  const beatPlays = beats.reduce((sum, b) => sum + b.plays, 0);
  const trackPlays = tracks.reduce((sum, t) => sum + t.plays, 0);
  const remixPlays = remixes.reduce((sum, r) => sum + r.plays, 0);
  const totalPlays = beatPlays + trackPlays + remixPlays;

  // Calculate total downloads across all content types
  const beatDownloads = beats.reduce((sum, b) => sum + b.downloads, 0);
  const trackDownloads = tracks.reduce((sum, t) => sum + t.downloads, 0);
  const remixDownloads = remixes.reduce((sum, r) => sum + r.downloads, 0);
  const totalDownloads = beatDownloads + trackDownloads + remixDownloads;

  // Calculate total likes across all content types
  const beatLikes = beats.reduce((sum, b) => sum + b.likes, 0);
  const trackLikes = tracks.reduce((sum, t) => sum + t.likes, 0);
  const remixLikes = remixes.reduce((sum, r) => sum + r.likes, 0);
  const totalLikes = beatLikes + trackLikes + remixLikes;

  // Top performing content across all types
  interface ContentItem {
    id: string;
    title: string;
    artist: string;
    artworkUrl: string;
    plays: number;
    downloads: number;
    type: 'Beat' | 'Track' | 'Remix';
  }

  const allContent: ContentItem[] = [
    ...beats.map((b) => ({
      id: b.id,
      title: b.title,
      artist: b.artist,
      artworkUrl: b.artworkUrl,
      plays: b.plays,
      downloads: b.downloads,
      type: 'Beat' as const,
    })),
    ...tracks.map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      artworkUrl: t.artworkUrl,
      plays: t.plays,
      downloads: t.downloads,
      type: 'Track' as const,
    })),
    ...remixes.map((r) => ({
      id: r.id,
      title: r.title,
      artist: r.remixArtist,
      artworkUrl: r.artworkUrl,
      plays: r.plays,
      downloads: r.downloads,
      type: 'Remix' as const,
    })),
  ];

  const topPerformingContent = [...allContent]
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
  const publishedTracks = tracks.filter((t) => t.status === 'published').length;
  const featuredTracks = tracks.filter((t) => t.featured).length;
  const publishedRemixes = remixes.filter((r) => r.status === 'published').length;
  const featuredRemixes = remixes.filter((r) => r.featured).length;
  const publishedContent = content.filter((c) => c.status === 'published').length;
  const activeCollaborations = collaborations.filter((c) => c.status === 'active').length;

  // Loading states
  const isLoading = beatsLoading || tracksLoading || remixesLoading;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-white/40 mt-2">Overview of your platform performance</p>
          </div>
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
              className="bg-white/[0.08] border border-white/[0.06] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
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
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">Total Revenue</p>
              <DollarSign className="text-green-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              €{totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="text-green-400 mr-1" size={16} />
              <span className="text-green-400">+{revenueTrend}%</span>
              <span className="text-white/25 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">Total Orders</p>
              <ShoppingCart className="text-blue-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{totalOrders}</p>
            <p className="text-sm text-white/40 mt-2">
              {orders.filter((o) => o.status === 'completed').length} completed
            </p>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">Total Beats</p>
              <Music className="text-purple-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{totalBeats}</p>
            <p className="text-sm text-white/40 mt-2">
              {publishedBeats} published • {featuredBeats} featured
            </p>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">Content Views</p>
              <Eye className="text-pink-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-white/40 mt-2">
              {publishedContent} published articles
            </p>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Beat Performance</h3>
              <Music className="text-purple-400" size={20} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-white/40">Plays</p>
                <p className="text-2xl font-bold text-white">{beatPlays.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Downloads</p>
                <p className="text-2xl font-bold text-white">{beatDownloads.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Likes</p>
                <p className="text-2xl font-bold text-white">{beatLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Track Performance</h3>
              <Music className="text-blue-400" size={20} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-white/40">Plays</p>
                <p className="text-2xl font-bold text-white">{trackPlays.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Downloads</p>
                <p className="text-2xl font-bold text-white">{trackDownloads.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Likes</p>
                <p className="text-2xl font-bold text-white">{trackLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Remix Performance</h3>
              <Music className="text-pink-400" size={20} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-white/40">Plays</p>
                <p className="text-2xl font-bold text-white">{remixPlays.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Downloads</p>
                <p className="text-2xl font-bold text-white">{remixDownloads.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Likes</p>
                <p className="text-2xl font-bold text-white">{remixLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Content Engagement</h3>
              <FileText className="text-blue-400" size={20} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-white/40">Total Articles</p>
                <p className="text-2xl font-bold text-white">{content.length}</p>
              </div>
              <div>
                <p className="text-sm text-white/40">Total Likes</p>
                <p className="text-2xl font-bold text-white">
                  {content.reduce((sum, c) => sum + c.likes, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/40">Total Shares</p>
                <p className="text-2xl font-bold text-white">
                  {content.reduce((sum, c) => sum + c.shares, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content Across All Types */}
        <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Content</h3>
          <div className="space-y-3">
            {topPerformingContent.length === 0 ? (
              <p className="text-white/40 text-center py-4">No content available</p>
            ) : (
              topPerformingContent.map((item, index) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between p-3 bg-white/[0.06] rounded-lg hover:bg-white/[0.08] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-white/25">#{index + 1}</span>
                    <img
                      src={item.artworkUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            item.type === 'Beat'
                              ? 'bg-purple-500/20 text-purple-300'
                              : item.type === 'Track'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-pink-500/20 text-pink-300'
                          }`}
                        >
                          {item.type}
                        </span>
                        <p className="text-sm text-white/40">{item.artist}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{item.plays.toLocaleString()} plays</p>
                    <p className="text-sm text-white/40">{item.downloads} downloads</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">Total Messages</p>
              <MessageSquare className="text-red-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{chatStats.totalMessages}</p>
            <p className="text-sm text-white/40 mt-2">support messages</p>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">Conversations</p>
              <Users className="text-blue-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{chatStats.uniqueConversations}</p>
            <p className="text-sm text-white/40 mt-2">unique participants</p>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">Customer Messages</p>
              <ShoppingCart className="text-cyan-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{chatStats.messagesByRole.customer}</p>
            <p className="text-sm text-white/40 mt-2">from customers</p>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">Admin Responses</p>
              <FileText className="text-green-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{chatStats.messagesByRole.admin}</p>
            <p className="text-sm text-white/40 mt-2">admin messages</p>
          </div>
        </div>

        {/* Top Content & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Content */}
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Content by Views</h3>
            <div className="space-y-3">
              {topContent.length === 0 ? (
                <p className="text-white/40 text-center py-4">No content available</p>
              ) : (
                topContent.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white/[0.06] rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-lg font-bold text-white/25">#{index + 1}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{item.title}</p>
                        <p className="text-xs text-white/40 capitalize">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{item.views.toLocaleString()}</p>
                      <p className="text-xs text-white/40">views</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-white/40 text-center py-4">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-white/[0.06] rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-white/40">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">€{order.totalAmount}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-white/[0.06] text-white/40'
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
