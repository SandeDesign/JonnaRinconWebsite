import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { purchaseService } from '../../lib/firebase/services';
import { Purchase } from '../../lib/firebase/types';
import CustomerLayout from '../../components/customer/CustomerLayout';
import ProductCard from '../../components/ProductCard';
import ProductDetailModal from '../../components/ProductDetailModal';
import { Download, Calendar, Package, AlertCircle } from 'lucide-react';

export default function MyProductsPage() {
  const { user, isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Purchase | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'expiry'>('recent');

  useEffect(() => {
    if (!isAuthenticated || !user?.uid) return;

    const fetchPurchases = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await purchaseService.getUserPurchases(user.uid);
        setPurchases(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch purchases');
        console.error('Failed to fetch purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user, isAuthenticated]);

  const sortedPurchases = [...purchases].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    } else {
      return a.expiresAt.toMillis() - b.expiresAt.toMillis();
    }
  });

  const activeProducts = sortedPurchases.filter(p => !purchaseService.isDownloadExpired(p.expiresAt));
  const expiredProducts = sortedPurchases.filter(p => purchaseService.isDownloadExpired(p.expiresAt));

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">My Products</h1>
          <p className="text-white/40">Your purchased beats and products</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm font-semibold">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-red-500" />
              <p className="text-white/40 text-sm uppercase tracking-wider">Total Products</p>
            </div>
            <p className="text-3xl font-black text-white">{purchases.length}</p>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5 text-green-500" />
              <p className="text-white/40 text-sm uppercase tracking-wider">Available</p>
            </div>
            <p className="text-3xl font-black text-white">{activeProducts.length}</p>
          </div>

          <div className="bg-white/[0.08] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <p className="text-white/40 text-sm uppercase tracking-wider">Expires Soon</p>
            </div>
            <p className="text-3xl font-black text-white">
              {activeProducts.filter(p => purchaseService.getDaysUntilExpiry(p.expiresAt) <= 7).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-12 h-12 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
            <p className="text-sm text-white/30 uppercase tracking-widest">Loading your products...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-12 max-w-md mx-auto">
              <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-xl font-bold text-white mb-2">No Products Yet</p>
              <p className="text-white/40 text-sm">
                Start building your library by purchasing beats from the shop
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Active Products */}
            {activeProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white uppercase">Active Products</h2>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'expiry')}
                    className="px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white text-sm"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="expiry">Expires Soon</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      daysUntilExpiry={purchaseService.getDaysUntilExpiry(product.expiresAt)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Expired Products */}
            {expiredProducts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-white uppercase">Expired Downloads</h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-semibold mb-1">Download Period Expired</p>
                      <p className="text-yellow-400/80 text-sm">
                        These products are no longer available for download. If you need them again, please contact support with your product number and we can provide access.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expiredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      isExpired={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </CustomerLayout>
  );
}
