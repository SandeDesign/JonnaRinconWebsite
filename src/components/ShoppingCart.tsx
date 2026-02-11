import { X, ShoppingCart as CartIcon, Trash2 } from 'lucide-react';
import { CartItem } from '../lib/types';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (beatId: string) => void;
  onCheckout: () => void;
}

export default function ShoppingCart({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
}: ShoppingCartProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - Lichter met meer blur */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xl z-[100] animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Centraal Pop-up Cart */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-2xl border-2 border-purple-500/30 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-purple-500/20 flex-shrink-0">
            <div className="flex items-center gap-3">
              <CartIcon className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Shopping Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-3 glass rounded-full neon-border-subtle hover:neon-border transition-all hover:scale-110 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <CartIcon className="w-24 h-24 text-purple-400/30 mx-auto mb-6" />
                <p className="text-gray-400 text-xl font-medium mb-2">Your cart is empty</p>
                <p className="text-gray-500 text-sm mb-8">Add some beats to get started!</p>
                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
                >
                  Browse Beats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.beat.id}-${item.license}-${index}`}
                    className="glass rounded-2xl p-5 neon-border-subtle hover:neon-border transition-all"
                  >
                    <div className="flex gap-5">
                      <img
                        src={item.beat.artwork_url}
                        alt={item.beat.title}
                        className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-purple-200 mb-1 truncate">
                          {item.beat.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">
                          {item.beat.artist} • {item.beat.bpm} BPM • {item.beat.key}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-purple-600/30 rounded-lg text-xs font-semibold text-purple-300 uppercase">
                            {item.license} License
                          </span>
                          <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            €{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.beat.id)}
                        className="p-3 hover:bg-red-600/20 rounded-xl transition-all group flex-shrink-0"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Checkout */}
          {items.length > 0 && (
            <div className="border-t-2 border-purple-500/20 p-8 flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold text-gray-300">Total:</span>
                <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  €{total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Proceed to Checkout
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                Secure checkout • All licenses included
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}