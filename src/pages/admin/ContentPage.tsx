import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useContent } from '../../hooks/useContent';
import { contentService } from '../../lib/firebase/services';
import { Content, ContentType, ContentStatus } from '../../lib/firebase/types';
import { Plus, Edit, Trash2, Eye, Heart, Share2, Calendar } from 'lucide-react';

const ContentPage: React.FC = () => {
  const { content, loading } = useContent();
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'all'>('all');

  const handleCreate = () => {
    setEditingContent(null);
    setShowModal(true);
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await contentService.deleteContent(id);
      alert('Content deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredContent = content.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400';
      case 'archived':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeColor = (type: ContentType) => {
    switch (type) {
      case 'blog':
        return 'bg-purple-500/20 text-purple-400';
      case 'news':
        return 'bg-pink-500/20 text-pink-400';
      case 'tutorial':
        return 'bg-blue-500/20 text-blue-400';
      case 'press':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Content Management</h1>
            <p className="text-gray-400 mt-2">Manage blog posts, news, tutorials, and press releases</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Content</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Content</p>
            <p className="text-2xl font-bold text-white mt-1">{content.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Published</p>
            <p className="text-2xl font-bold text-white mt-1">
              {content.filter((c) => c.status === 'published').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Featured</p>
            <p className="text-2xl font-bold text-white mt-1">
              {content.filter((c) => c.featured).length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Views</p>
            <p className="text-2xl font-bold text-white mt-1">
              {content.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ContentType | 'all')}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="blog">Blog</option>
              <option value="news">News</option>
              <option value="tutorial">Tutorial</option>
              <option value="press">Press</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ContentStatus | 'all')}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Stats
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Published
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
                      Loading content...
                    </td>
                  </tr>
                ) : filteredContent.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No content found. Create your first content piece!
                    </td>
                  </tr>
                ) : (
                  filteredContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {item.featuredImage && (
                            <img
                              src={item.featuredImage}
                              alt={item.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            {item.excerpt && (
                              <p className="text-sm text-gray-400 truncate max-w-xs">
                                {item.excerpt}
                              </p>
                            )}
                            {item.featured && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm capitalize ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm capitalize ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.authorName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart size={14} />
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 size={14} />
                            <span>{item.shares}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.publishedAt ? (
                          <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <Calendar size={14} />
                            <span>
                              {new Date(item.publishedAt.toDate()).toLocaleDateString()}
                            </span>
                          </div>
                        ) : item.scheduledFor ? (
                          <div className="flex items-center space-x-1 text-sm text-blue-400">
                            <Calendar size={14} />
                            <span>
                              {new Date(item.scheduledFor.toDate()).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
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

      {/* Modal for Create/Edit (Placeholder) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingContent ? 'Edit Content' : 'Create New Content'}
            </h2>
            <p className="text-gray-400 mb-6">
              Content editor will be implemented here with a rich text editor for managing content blocks.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Content editor feature coming soon!');
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContentPage;
