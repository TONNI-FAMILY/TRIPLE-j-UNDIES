import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Product,
  CartItem,
  Order,
  ChatThread,
  ChatMessage,
  ProductSize,
  ProductColor,
  UserProfile,
  VideoStory,
  CategoryId,
  AccountSubTab,
} from '../types';
import { PRODUCTS, INITIAL_ORDERS, VIDEO_STORIES } from '../data/products';

interface ToastNotification {
  id: string;
  message: string;
  icon?: string;
}

interface AppContextType {
  activeTab: 'home' | 'shop' | 'lookbook' | 'chat' | 'account';
  setActiveTab: (tab: 'home' | 'shop' | 'lookbook' | 'chat' | 'account') => void;
  accountSubTab: AccountSubTab;
  setAccountSubTab: (subTab: AccountSubTab) => void;
  openWishlist: () => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  products: Product[];
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  cart: CartItem[];
  addToCart: (
    product: Product,
    size?: ProductSize,
    color?: ProductColor,
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  promoCode: string;
  promoDiscount: number;
  promoError: string;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date'>) => Order;
  selectedProduct: Product | null;
  openProductDetails: (product: Product) => void;
  closeProductDetails: () => void;
  selectedVideo: VideoStory | null;
  openVideoPlayer: (video: VideoStory) => void;
  closeVideoPlayer: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSizeDrawerOpen: boolean;
  setIsSizeDrawerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedFilterSize: ProductSize | null;
  setSelectedFilterSize: (size: ProductSize | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  chatThreads: ChatThread[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  createNewChatThread: (initialTopic?: string) => string;
  startChatAboutProduct: (
    product: Product,
    size?: ProductSize,
    color?: ProductColor,
    question?: string
  ) => void;
  startChatAboutOrder: (orderId: string) => void;
  sendChatMessage: (text: string) => void;
  acceptCuratedBundle: (threadId: string, messageId: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toast: ToastNotification | null;
  showToast: (message: string, icon?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread-concierge-main',
    title: 'Triple J Concierge & Customer Care',
    lastMessagePreview: 'Curated Bundle Proposal ($54.00)',
    lastMessageTime: '10:18 AM',
    type: 'concierge',
    status: 'active',
    pinnedProduct: {
      product: PRODUCTS[0],
      selectedSize: 'M',
      selectedColor: PRODUCTS[0].colors[3] || PRODUCTS[0].colors[0],
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        text: 'Hi! I am in between size S and M in the Cloud Modal brief. Does this fabric have high stretch or should I size up?',
        timestamp: '2026-09-29T10:14:00Z',
        timeLabel: '10:14 AM',
      },
      {
        id: 'msg-2',
        sender: 'specialist',
        authorName: 'Sarah',
        authorRole: 'Fabric & Fit Specialist',
        authorAvatar: 'S',
        text: 'Hello! Thanks for reaching out to Triple J. The Cloud Modal has 8% elastane with our 4-way micro-weave, so it has gentle generous stretch without losing shape. If you prefer a relaxed sleep fit, size M is lovely; for everyday snug support, size S is perfect!',
        timestamp: '2026-09-29T10:16:00Z',
        timeLabel: '10:16 AM',
      },
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'That is super helpful! Can I add 2 pairs of Blush and 1 Sand in size M right into my order?',
        timestamp: '2026-09-29T10:17:00Z',
        timeLabel: '10:17 AM',
      },
      {
        id: 'msg-4',
        sender: 'specialist',
        authorName: 'Leah',
        authorRole: 'Triple J Concierge',
        authorAvatar: 'L',
        text: "I've assembled a personalized 3-pack bundle for you with our 18% bundle saving applied directly! You can review or accept it straight into checkout below.",
        timestamp: '2026-09-29T10:18:00Z',
        timeLabel: '10:18 AM',
        bundleProposal: {
          title: 'Curated Bundle Proposal',
          discountBadge: '18% Bundle Saving',
          summary: 'Bundle: 3x Cloud Modal High-Rise ($54 with bundle discount applied)',
          items: [
            '2x Cloud Soft High-Rise (Blush Rose, Size M)',
            '1x Cloud Soft High-Rise (Sand Dune, Size M)',
          ],
          regularPrice: 66,
          bundlePrice: 54,
          freeShipping: true,
        },
      },
    ],
  },
  {
    id: 'thread-order-8492',
    title: 'Order #TJ-8492 Inquiry',
    lastMessagePreview: 'Package delivered to concierge lobby',
    lastMessageTime: 'Yesterday',
    type: 'order',
    status: 'active',
    relatedOrderId: 'TJ-8492',
    messages: [
      {
        id: 'msg-o1',
        sender: 'customer',
        text: 'Hi Sarah, tracking shows delivered but I was at work—did USPS leave it with the front desk?',
        timestamp: '2026-09-28T16:20:00Z',
        timeLabel: '4:20 PM',
      },
      {
        id: 'msg-o2',
        sender: 'specialist',
        authorName: 'Sarah',
        authorRole: 'Customer Care Lead',
        authorAvatar: 'S',
        text: 'Hello Sarah! Yes, carrier notes confirm delivery at 2:38 PM directly to the secure lobby concierge desk in your building. Packaged in our discrete recyclable unbranded kraft mailer.',
        timestamp: '2026-09-28T16:24:00Z',
        timeLabel: '4:24 PM',
      },
    ],
  },
  {
    id: 'thread-size-seamless',
    title: 'Size advice on Seamless Set',
    lastMessagePreview: 'Completed with Stylist Maya',
    lastMessageTime: 'Aug 14',
    type: 'fit-advice',
    status: 'completed',
    messages: [
      {
        id: 'msg-s1',
        sender: 'customer',
        text: 'Does the Breathe Bare bikini ride up under athletic leggings?',
        timestamp: '2026-08-14T11:00:00Z',
        timeLabel: '11:00 AM',
      },
      {
        id: 'msg-s2',
        sender: 'specialist',
        authorName: 'Maya',
        authorRole: 'Senior Stylist',
        authorAvatar: 'M',
        text: 'Not at all! The bonded laser edge has micro-grip tension that stays anchored against skin without leaving indentation marks.',
        timestamp: '2026-08-14T11:05:00Z',
        timeLabel: '11:05 AM',
      },
    ],
  },
];

const STORAGE_KEYS = {
  CART: 'triple_j_cart_v2',
  FAVORITES: 'triple_j_favorites_v2',
  ORDERS: 'triple_j_orders_v2',
  PROFILE: 'triple_j_profile_v2',
  PROMO: 'triple_j_promo_v2',
};

function safeGetStorage<T>(key: string, fallback: T, validator?: (val: any) => boolean): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (validator && !validator(parsed)) {
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.warn(`LocalStorage read failed for ${key}:`, err);
    return fallback;
  }
}

function safeSetStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`LocalStorage write failed for ${key}:`, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'lookbook' | 'chat' | 'account'>('home');
  const [accountSubTab, setAccountSubTab] = useState<AccountSubTab>('orders');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const [favorites, setFavorites] = useState<string[]>(() =>
    safeGetStorage<string[]>(
      STORAGE_KEYS.FAVORITES,
      ['cloud-modal-high-rise', 'breathe-bare-bikini'],
      Array.isArray
    )
  );

  const [cart, setCart] = useState<CartItem[]>(() =>
    safeGetStorage<CartItem[]>(
      STORAGE_KEYS.CART,
      [
        {
          id: 'cloud-modal-high-rise-blush-M',
          productId: 'cloud-modal-high-rise',
          product: PRODUCTS[0],
          selectedColor: PRODUCTS[0].colors[3] || PRODUCTS[0].colors[0],
          selectedSize: 'M',
          quantity: 1,
        },
      ],
      (val) => Array.isArray(val) && val.every((item) => item?.product?.images?.length > 0)
    )
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    safeGetStorage<Order[]>(
      STORAGE_KEYS.ORDERS,
      INITIAL_ORDERS,
      (val) => Array.isArray(val) && val.every((o) => Array.isArray(o?.items))
    )
  );

  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    safeGetStorage<UserProfile>(
      STORAGE_KEYS.PROFILE,
      {
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        phone: '+1 (503) 555-0194',
        preferredSize: 'M',
        preferredRise: 'High-Rise',
        discreetPackaging: true,
        carbonOffsetEnabled: true,
      },
      (val) => typeof val === 'object' && val !== null && typeof val.name === 'string'
    )
  );

  // Global promo state
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoStory | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedFilterSize, setSelectedFilterSize] = useState<ProductSize | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-concierge-main');
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const toastCounterRef = useRef(0);
  const toastTimeoutRef = useRef<number | null>(null);
  const chatTimeoutsRef = useRef<{ [key: string]: number }>({});
  const chatThreadsRef = useRef<ChatThread[]>(INITIAL_THREADS);

  // Keep chatThreadsRef in sync
  useEffect(() => {
    chatThreadsRef.current = chatThreads;
  }, [chatThreads]);

  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      Object.values(chatTimeoutsRef.current).forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.PROFILE, userProfile);
  }, [userProfile]);

  const showToast = useCallback((message: string, icon: string = 'check_circle') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    const id = `toast-${Date.now()}-${++toastCounterRef.current}`;
    setToast({ id, message, icon });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  }, []);

  const openWishlist = useCallback(() => {
    setAccountSubTab('wishlist');
    setActiveTab('account');
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const prod = PRODUCTS.find((p) => p.id === productId);
      if (exists) {
        showToast(`Removed ${prod?.name || 'item'} from saved favorites`, 'favorite');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved ${prod?.name || 'item'} to favorites`, 'favorite');
        return [...prev, productId];
      }
    });
  }, [showToast]);

  const isFavorite = useCallback((productId: string) => favorites.includes(productId), [favorites]);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart]
  );

  // Dynamically recompute promo discount so quantities adjustments stay accurate
  const promoDiscount = useMemo(() => {
    if (!promoCode || cartSubtotal === 0) return 0;
    const clean = promoCode.toUpperCase();
    if (clean === 'SOFT20' || clean === 'TRIPLE20') {
      return Math.round(cartSubtotal * 0.2);
    }
    if (clean === 'BUNDLE18') {
      return Math.min(cartSubtotal, 12);
    }
    if (clean === 'FREESHIP') {
      return Math.min(cartSubtotal, 5);
    }
    return 0;
  }, [promoCode, cartSubtotal]);

  const applyPromo = useCallback((code: string): boolean => {
    setPromoError('');
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setPromoError('Please enter a promotion code.');
      return false;
    }

    if (cleanCode === 'SOFT20' || cleanCode === 'TRIPLE20') {
      const discount = Math.round(cartSubtotal * 0.2);
      setPromoCode(cleanCode);
      showToast(`Promo ${cleanCode} applied (-$${discount})!`, 'local_offer');
      return true;
    } else if (cleanCode === 'BUNDLE18') {
      setPromoCode('BUNDLE18');
      showToast('18% Curated Bundle saving applied (-$12.00)!', 'local_offer');
      return true;
    } else if (cleanCode === 'FREESHIP') {
      setPromoCode(cleanCode);
      showToast('Free shipping promo applied!', 'local_shipping');
      return true;
    } else {
      setPromoError('Invalid code. Try "SOFT20" for 20% off.');
      return false;
    }
  }, [cartSubtotal, showToast]);

  const clearPromo = useCallback(() => {
    setPromoCode('');
    setPromoError('');
  }, []);

  const addToCart = useCallback((
    product: Product,
    size?: ProductSize,
    color?: ProductColor,
    quantity: number = 1,
    openDrawer: boolean = true
  ) => {
    const chosenSize =
      size ||
      (product.sizes.includes(userProfile.preferredSize)
        ? userProfile.preferredSize
        : product.sizes[0] || 'M');
    const chosenColor = color || product.colors[0];
    const itemId = `${product.id}-${chosenColor.id}-${chosenSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          product,
          selectedColor: chosenColor,
          selectedSize: chosenSize,
          quantity,
        },
      ];
    });

    showToast(`Added ${product.name} (${chosenSize}) to shopping bag`, 'shopping_bag');
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  }, [userProfile.preferredSize, showToast]);

  const updateCartQuantity = useCallback((itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const filtered = prev.filter((item) => item.id !== itemId);
      if (filtered.length === 0) {
        clearPromo();
      }
      return filtered;
    });
    showToast('Item removed from shopping bag', 'delete');
  }, [clearPromo, showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    clearPromo();
  }, [clearPromo]);

  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'date'>) => {
    const id = `TJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      date: 'Just now',
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  }, [clearCart]);

  const openProductDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const closeProductDetails = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const openVideoPlayer = useCallback((video: VideoStory) => {
    setSelectedVideo(video);
  }, []);

  const closeVideoPlayer = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  const simulateSpecialistResponse = useCallback((
    threadId: string,
    pinnedProduct?: Product,
    queryText?: string
  ) => {
    const lower = (queryText || '').toLowerCase();
    let reply = '';
    let authorName = 'Sarah';
    let authorRole = 'Fabric & Fit Specialist';
    let authorAvatar = 'S';

    if (lower.includes('ship') || lower.includes('delivery') || lower.includes('when')) {
      reply =
        'Orders placed before 2 PM PST ship same-day! Standard delivery takes 2–3 business days in 100% recyclable, discreet unbranded kraft mailers with zero carbon footprint.';
    } else if (lower.includes('exchange') || lower.includes('return') || lower.includes('guarantee')) {
      reply =
        "All first orders are covered by our 30-Day First Pair Guarantee! If the fit isn't completely heavenly, keep the pair and we will send your preferred size or issue a refund immediately.";
    } else if (lower.includes('bulk') || lower.includes('pack') || lower.includes('bundle') || lower.includes('discount')) {
      reply =
        'Yes! For 3 or more pairs, we offer curated custom bundles with 15–20% savings and complimentary carbon-neutral shipping. Let us know which cuts and colors you want to bundle!';
      authorName = 'Leah';
      authorRole = 'Triple J Concierge';
      authorAvatar = 'L';
    } else if (lower.includes('chart') || lower.includes('measure') || lower.includes('size')) {
      reply =
        'Our modal and organic cotton fabrics feature gentle 4-way micro-weave elasticity. For waist 26–28" and hips 36–38", Size S is tailored for a smooth snug fit, while Size M gives a relaxed loungewear feel.';
    } else if (pinnedProduct) {
      reply = `Regarding the ${pinnedProduct.name}: It is crafted with ${pinnedProduct.fabric}. It stretches comfortably without losing recovery or digging into hips. Customers with sensitive skin rave about the tactile softness!`;
    } else {
      reply =
        "Thank you for your note! Sarah and I are on live duty. We're happy to guide you through fabric drape, rise preferences, or bridal party bundle curations. How can we make your day softer?";
    }

    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const replyMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'specialist',
      authorName,
      authorRole,
      authorAvatar,
      text: reply,
      timestamp: now.toISOString(),
      timeLabel,
    };

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [...thread.messages, replyMsg],
            lastMessagePreview: reply,
            lastMessageTime: timeLabel,
            isTyping: false,
          };
        }
        return thread;
      })
    );
  }, []);

  const sendChatMessageToThread = useCallback((threadId: string, text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const customerMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'customer',
      text: cleanText,
      timestamp: now.toISOString(),
      timeLabel,
    };

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [...thread.messages, customerMsg],
            lastMessagePreview: cleanText,
            lastMessageTime: timeLabel,
            isTyping: true,
            status: 'active',
          };
        }
        return thread;
      })
    );

    if (chatTimeoutsRef.current[threadId]) {
      clearTimeout(chatTimeoutsRef.current[threadId]);
    }

    chatTimeoutsRef.current[threadId] = window.setTimeout(() => {
      // Find pinned product directly from latest mutable ref without nested dispatchers
      const target = chatThreadsRef.current.find((t) => t.id === threadId);
      simulateSpecialistResponse(threadId, target?.pinnedProduct?.product, cleanText);
    }, 1400);
  }, [simulateSpecialistResponse]);

  const sendChatMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    sendChatMessageToThread(activeThreadId, text);
  }, [activeThreadId, sendChatMessageToThread]);

  const createNewChatThread = useCallback((initialTopic?: string): string => {
    const newThreadId = `thread-custom-${Date.now()}`;
    const initialText =
      initialTopic || 'Hi Sarah & Leah, I would like to consult on fit and bundle options.';

    const newThread: ChatThread = {
      id: newThreadId,
      title: initialTopic ? `Inquiry: ${initialTopic.slice(0, 26)}` : 'Custom Sizing Consultation',
      lastMessagePreview: initialText,
      lastMessageTime: 'Just now',
      type: 'concierge',
      status: 'active',
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'customer',
          text: initialText,
          timestamp: new Date().toISOString(),
          timeLabel: 'Just now',
        },
      ],
      isTyping: true,
    };

    setChatThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
    setActiveTab('chat');

    if (chatTimeoutsRef.current[newThreadId]) {
      clearTimeout(chatTimeoutsRef.current[newThreadId]);
    }

    chatTimeoutsRef.current[newThreadId] = window.setTimeout(() => {
      simulateSpecialistResponse(newThreadId, undefined, initialText);
    }, 1200);

    return newThreadId;
  }, [setActiveTab, simulateSpecialistResponse]);

  const startChatAboutProduct = useCallback((
    product: Product,
    size?: ProductSize,
    color?: ProductColor,
    question?: string
  ) => {
    const chosenSize =
      size ||
      (product.sizes.includes(userProfile.preferredSize)
        ? userProfile.preferredSize
        : product.sizes[0] || 'M');
    const chosenColor = color || product.colors[0];

    const currentThreads = chatThreadsRef.current;
    const existingThread = currentThreads.find(
      (t) => t.pinnedProduct?.product.id === product.id
    );

    if (existingThread) {
      setChatThreads((prev) =>
        prev.map((t) =>
          t.id === existingThread.id
            ? {
                ...t,
                status: 'active',
                pinnedProduct: {
                  product,
                  selectedSize: chosenSize,
                  selectedColor: chosenColor,
                },
              }
            : t
        )
      );

      if (question && question.trim()) {
        sendChatMessageToThread(existingThread.id, question.trim());
      }
      setActiveThreadId(existingThread.id);
    } else {
      const newThreadId = `thread-product-${product.id}-${Date.now()}`;
      const msgText =
        question || `Hi! I have a question about the ${product.name}. Is size ${chosenSize} true to fit?`;

      const newThread: ChatThread = {
        id: newThreadId,
        title: `${product.name} Inquiry`,
        lastMessagePreview: msgText,
        lastMessageTime: 'Just now',
        type: 'fit-advice',
        status: 'active',
        pinnedProduct: {
          product,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
        },
        messages: [
          {
            id: `msg-${Date.now()}-1`,
            sender: 'customer',
            text: msgText,
            timestamp: new Date().toISOString(),
            timeLabel: 'Just now',
          },
        ],
        isTyping: true,
      };

      setChatThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThreadId);

      if (chatTimeoutsRef.current[newThreadId]) {
        clearTimeout(chatTimeoutsRef.current[newThreadId]);
      }

      chatTimeoutsRef.current[newThreadId] = window.setTimeout(() => {
        simulateSpecialistResponse(newThreadId, product, msgText);
      }, 1200);
    }

    setActiveTab('chat');
    setSelectedProduct(null);
  }, [userProfile.preferredSize, sendChatMessageToThread, simulateSpecialistResponse]);

  const startChatAboutOrder = useCallback((orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    const existing = chatThreadsRef.current.find((t) => t.relatedOrderId === orderId);

    if (existing) {
      setActiveThreadId(existing.id);
    } else {
      const newThreadId = `thread-order-${orderId}`;
      const newThread: ChatThread = {
        id: newThreadId,
        title: `Order #${orderId} Consultation`,
        lastMessagePreview: `Questions regarding order #${orderId}`,
        lastMessageTime: 'Just now',
        type: 'order',
        status: 'active',
        relatedOrderId: orderId,
        messages: [
          {
            id: `msg-${Date.now()}-1`,
            sender: 'customer',
            text: `Hi Sarah, I would like to check on my Order #${orderId} (${order?.status || 'Processing'}).`,
            timestamp: new Date().toISOString(),
            timeLabel: 'Just now',
          },
          {
            id: `msg-${Date.now()}-2`,
            sender: 'specialist',
            authorName: 'Sarah',
            authorRole: 'Customer Care Lead',
            authorAvatar: 'S',
            text: `Hello! Looking into Order #${orderId} right now. Your items are carefully packed in our discreet eco-mailers. ${
              order?.statusNote || 'Everything is on schedule for swift delivery.'
            }`,
            timestamp: new Date().toISOString(),
            timeLabel: 'Just now',
          },
        ],
      };
      setChatThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThreadId);
    }
    setActiveTab('chat');
  }, [orders]);

  const acceptCuratedBundle = useCallback((threadId: string, messageId: string) => {
    // Add curated items into cart atomically without opening cart drawer
    const p1 = PRODUCTS[0]; // Cloud Soft High-Rise
    const colorBlush = p1.colors[3] || p1.colors[0];
    const colorSand = p1.colors[1] || p1.colors[0];

    const item1Id = `${p1.id}-${colorBlush.id}-M`;
    const item2Id = `${p1.id}-${colorSand.id}-M`;

    setCart((prev) => {
      const next = [...prev];
      const idx1 = next.findIndex((i) => i.id === item1Id);
      if (idx1 >= 0) {
        next[idx1] = { ...next[idx1], quantity: next[idx1].quantity + 2 };
      } else {
        next.push({
          id: item1Id,
          productId: p1.id,
          product: p1,
          selectedColor: colorBlush,
          selectedSize: 'M',
          quantity: 2,
        });
      }

      const idx2 = next.findIndex((i) => i.id === item2Id);
      if (idx2 >= 0) {
        next[idx2] = { ...next[idx2], quantity: next[idx2].quantity + 1 };
      } else {
        next.push({
          id: item2Id,
          productId: p1.id,
          product: p1,
          selectedColor: colorSand,
          selectedSize: 'M',
          quantity: 1,
        });
      }
      return next;
    });

    // Ensure cart drawer is closed so CheckoutModal does not clash
    setIsCartDrawerOpen(false);
    setPromoCode('BUNDLE18');
    showToast('Curated Bundle applied: 18% savings (-$12.00)!', 'check_circle');
    setIsCheckoutOpen(true);
  }, [showToast]);

  const updateUserProfile = useCallback((updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    showToast('Preferences updated successfully', 'tune');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        accountSubTab,
        setAccountSubTab,
        openWishlist,
        selectedCategory,
        setSelectedCategory,
        products: PRODUCTS,
        favorites,
        toggleFavorite,
        isFavorite,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        promoCode,
        promoDiscount,
        promoError,
        applyPromo,
        clearPromo,
        orders,
        createOrder,
        selectedProduct,
        openProductDetails,
        closeProductDetails,
        selectedVideo,
        openVideoPlayer,
        closeVideoPlayer,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSizeDrawerOpen,
        setIsSizeDrawerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedFilterSize,
        setSelectedFilterSize,
        searchQuery,
        setSearchQuery,
        chatThreads,
        activeThreadId,
        setActiveThreadId,
        createNewChatThread,
        startChatAboutProduct,
        startChatAboutOrder,
        sendChatMessage,
        acceptCuratedBundle,
        userProfile,
        updateUserProfile,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

