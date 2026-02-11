import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../lib/firebase/services/orderService';
import { Order, OrderItem } from '../../lib/firebase/types';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { Download, FileText, Mail } from 'lucide-react';

interface DownloadableItem extends OrderItem {
  orderId: string;
  orderNumber: string;
  downloadUrl: string;
  licenseUrl?: string;
  purchasedAt: Date;
}

const CustomerDownloads: React.FC = () => {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DownloadableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDownloads = async () => {
      try {
        const orders = await orderService.getOrdersByCustomer(user.email);

        // Extract all downloadable items from completed orders
        const downloadableItems: DownloadableItem[] = [];

        orders
          .filter((order) => order.status === 'completed')
          .forEach((order) => {
            order.items.forEach((item) => {
              const downloadUrl = order.downloadLinks?.[item.beatId];
              const licenseUrl = order.licensePDFs?.[item.beatId];

              if (downloadUrl) {
                downloadableItems.push({
                  ...item,
                  orderId: order.id,
                  orderNumber: order.orderNumber,
                  downloadUrl,
                  licenseUrl,
                  purchasedAt: order.completedAt?.toDate?.() || order.createdAt?.toDate?.() || new Date(),
                });
              }
            });
          });

        // Sort by purchase date, newest first
        downloadableItems.sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime());

        setDownloads(downloadableItems);
      } catch (error) {
        console.error('Failed to load downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDownloads();
  }, [user]);

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-white">Loading downloads...</div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">My Downloads</h1>
          <p className="text-gray-400 mt-2">Access all your purchased beats and licenses</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <div className="font-semibold mb-1">Download Tips</div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• All purchases include unlimited re-downloads</li>
                <li>• Download your license agreement for legal protection</li>
                <li>• Files are available in high-quality formats</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Downloads Grid */}
        {downloads.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-4">⬇️</div>
            <p className="text-xl mb-2">No downloads available</p>
            <p className="text-gray-400 mb-6">Purchase beats to access downloads</p>
            <Link
              to="/shop/beats"
              className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition"
            >
              Browse Beats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((item, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition">
                {/* Beat Artwork */}
                <div className="relative">
                  <img
                    src={item.artworkUrl || '/placeholder-beat.png'}
                    alt={item.beatTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs capitalize">
                    {item.licenseType} License
                  </div>
                </div>

                {/* Beat Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{item.beatTitle}</h3>
                  <div className="text-sm text-gray-400 mb-4">
                    Purchased: {item.purchasedAt.toLocaleDateString()}
                  </div>

                  {/* Download Buttons */}
                  <div className="space-y-2">
                    <a
                      href={item.downloadUrl}
                      className="block w-full bg-purple-600 hover:bg-purple-700 text-center py-2 rounded transition"
                      download
                    >
                      ⬇️ Download Beat
                    </a>

                    {item.licenseUrl && (
                      <a
                        href={item.licenseUrl}
                        className="block w-full bg-gray-700 hover:bg-gray-600 text-center py-2 rounded transition text-sm"
                        download
                      >
                        📄 Download License
                      </a>
                    )}
                  </div>

                  {/* Order Reference */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Link
                      to="/customer/orders"
                      className="text-xs text-gray-400 hover:text-gray-300"
                    >
                      Order: {item.orderNumber} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Section */}
        {downloads.length > 0 && (
          <div className="mt-12 bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-gray-400 mb-4">
              Having trouble downloading? Contact support for assistance.
            </p>
            <a
              href="mailto:support@jonnarincon.com"
              className="text-purple-400 hover:text-purple-300"
            >
              support@jonnarincon.com
            </a>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerDownloads;
