import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavBar } from './components/TopNavBar';
import { Footer } from './components/Footer';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { SizeDrawer } from './components/SizeDrawer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { VideoReelModal } from './components/VideoReelModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Toast } from './components/Toast';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { LookbookView } from './views/LookbookView';
import { ChatView } from './views/ChatView';
import { AccountView } from './views/AccountView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f6] text-[#201a18]">
      {/* Top Application Bar */}
      <TopNavBar />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'shop' && <ShopView />}
        {activeTab === 'lookbook' && <LookbookView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'account' && <AccountView />}
      </main>

      {/* Floating Chat Teaser */}
      <FloatingChatWidget />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SizeDrawer />
      <ProductDetailModal />
      <VideoReelModal />
      <CheckoutModal />
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
