import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { Order, ProductSize } from '../types';

export const AccountView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    orders,
    favorites,
    toggleFavorite,
    addToCart,
    openProductDetails,
    startChatAboutOrder,
    setActiveTab,
    accountSubTab,
    setAccountSubTab,
    showToast,
  } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const favoritedProducts = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full space-y-8">
      {/* Account Hero Bar */}
      <section className="bg-[#ffffff] rounded-3xl border border-[#d9c1be]/50 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#f8ebe8] border-2 border-[#d9c1be] flex items-center justify-center font-serif text-2xl text-[#8c493f] font-semibold">
            {userProfile.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-[#201a18]">
                {userProfile.name}
              </h1>
              <span className="bg-[#d2e8d6] text-[#384b3e] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                Active Member
              </span>
            </div>
            <p className="text-xs text-[#534340] mt-0.5">
              {userProfile.email} · Preferred Size:{' '}
              <strong className="text-[#8c493f]">{userProfile.preferredSize}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#f8ebe8] hover:bg-[#ffdad4] text-[#8c493f] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#d9c1be]/40"
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
            <span>Direct Concierge</span>
          </button>
        </div>
      </section>

      {/* Sub Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-[#d9c1be]/40 pb-2">
        <button
          onClick={() => setAccountSubTab('orders')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            accountSubTab === 'orders'
              ? 'bg-[#201a18] text-[#ffffff]'
              : 'text-[#534340] hover:text-[#201a18] hover:bg-[#f8ebe8]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">inventory_2</span>
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setAccountSubTab('wishlist')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            accountSubTab === 'wishlist'
              ? 'bg-[#201a18] text-[#ffffff]'
              : 'text-[#534340] hover:text-[#201a18] hover:bg-[#f8ebe8]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">favorite</span>
          <span>Saved Favorites ({favoritedProducts.length})</span>
        </button>

        <button
          onClick={() => setAccountSubTab('preferences')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            accountSubTab === 'preferences'
              ? 'bg-[#201a18] text-[#ffffff]'
              : 'text-[#534340] hover:text-[#201a18] hover:bg-[#f8ebe8]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          <span>Sizing &amp; Privacy</span>
        </button>
      </div>

      {/* Orders Tab */}
      {accountSubTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-[#ffffff] rounded-2xl p-12 text-center border border-[#d9c1be]/40 space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#867370]">receipt_long</span>
              <h3 className="font-serif text-xl text-[#201a18]">No orders found</h3>
              <p className="text-xs text-[#534340]">Your previous purchases will appear here.</p>
              <button
                onClick={() => setActiveTab('shop')}
                className="px-6 py-2.5 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#ffffff] rounded-2xl border border-[#d9c1be]/50 p-5 shadow-xs hover:border-[#8c493f]/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d9c1be]/40 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-semibold text-[#201a18]">
                      Order #{order.id}
                    </span>
                    <span className="text-xs text-[#867370]">{order.date}</span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Completed'
                          ? 'bg-[#d2e8d6] text-[#384b3e]'
                          : order.status === 'Ready/Dispatched'
                          ? 'bg-[#fef1ed] text-[#8c493f] border border-[#ffdad4]'
                          : 'bg-[#f8ebe8] text-[#201a18]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startChatAboutOrder(order.id)}
                      className="px-3 py-1.5 rounded-full bg-[#f8ebe8] hover:bg-[#ffdad4] text-[#8c493f] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      <span>Ask About Order</span>
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fff8f6] border border-[#d9c1be]/30"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-14 rounded-lg object-cover bg-[#f8ebe8]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#201a18] truncate">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-[#867370]">
                          Size: {item.size} · {item.colorName} · Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-semibold text-[#8c493f] mt-0.5">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Note & Total Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#d9c1be]/30 text-xs text-[#534340] gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#506355]">
                      local_shipping
                    </span>
                    <span>{order.statusNote}</span>
                  </div>
                  <div className="font-semibold text-sm text-[#201a18]">
                    Total:{' '}
                    <strong className="text-[#8c493f]">${order.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {accountSubTab === 'wishlist' && (
        <div>
          {favoritedProducts.length === 0 ? (
            <div className="bg-[#ffffff] rounded-2xl p-12 text-center border border-[#d9c1be]/40 space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#867370]">favorite_border</span>
              <h3 className="font-serif text-xl text-[#201a18]">No saved favorites yet</h3>
              <p className="text-xs text-[#534340]">
                Save pieces you love by tapping the heart icon on any product.
              </p>
              <button
                onClick={() => setActiveTab('shop')}
                className="px-6 py-2.5 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] cursor-pointer"
              >
                Explore Underwear
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoritedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#ffffff] rounded-2xl border border-[#d9c1be]/50 p-3.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-[#ece0dc] mb-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-[#fff8f6]/90 flex items-center justify-center text-[#8c493f] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg fill icon-fill">
                          favorite
                        </span>
                      </button>
                    </div>

                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-semibold text-[#201a18]">{product.name}</span>
                      <span className="text-xs font-semibold text-[#8c493f]">${product.price}</span>
                    </div>
                    <p className="text-[11px] text-[#867370] line-clamp-1 mb-3">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#d9c1be]/30 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 py-2 rounded-full bg-[#8c493f] hover:bg-[#aa6055] text-[#ffffff] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Add to Bag
                    </button>
                    <button
                      onClick={() => openProductDetails(product)}
                      className="p-2 rounded-full bg-[#f8ebe8] text-[#201a18] hover:bg-[#ffdad4] transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preferences Tab */}
      {accountSubTab === 'preferences' && (
        <div className="bg-[#ffffff] rounded-3xl border border-[#d9c1be]/50 p-6 md:p-8 space-y-6 max-w-2xl">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-[#201a18]">Fitting &amp; Privacy Preferences</h3>
            <p className="text-xs text-[#534340]">
              Customise your default sizing and delivery preferences for swift ordering.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#201a18] block mb-2">
                Default Body Contour Size
              </label>
              <div className="flex flex-wrap gap-2">
                {(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as ProductSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateUserProfile({ preferredSize: sz })}
                    className={`min-w-10 h-10 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      userProfile.preferredSize === sz
                        ? 'bg-[#8c493f] text-[#ffffff] shadow-xs'
                        : 'border border-[#d9c1be] text-[#201a18] hover:border-[#8c493f]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#d9c1be]/40 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.discreetPackaging}
                  onChange={(e) => updateUserProfile({ discreetPackaging: e.target.checked })}
                  className="mt-0.5 rounded text-[#8c493f] focus:ring-[#8c493f]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#201a18]">
                    Always ship in Discreet Unbranded Packaging
                  </p>
                  <p className="text-[11px] text-[#534340]">
                    Shipped in unlabeled recycled kraft cardboard without external logo references.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.carbonOffsetEnabled}
                  onChange={(e) => updateUserProfile({ carbonOffsetEnabled: e.target.checked })}
                  className="mt-0.5 rounded text-[#8c493f] focus:ring-[#8c493f]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#201a18]">
                    Carbon-Neutral Shipping Offset
                  </p>
                  <p className="text-[11px] text-[#534340]">
                    Complimentary certified botanical reforestation offset with every order.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
