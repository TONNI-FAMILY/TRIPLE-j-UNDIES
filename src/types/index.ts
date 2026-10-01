export type CategoryId =
  | 'all'
  | 'everyday-cotton'
  | 'seamless'
  | 'modal-luxe'
  | 'sets-bundles'
  | 'maternity';

export type AccountSubTab = 'orders' | 'wishlist' | 'preferences';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL';

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeVariant?: 'primary' | 'secondary' | 'outline' | 'surface';
  stockStatus: string;
  inStock: boolean;
  lowStockSize?: string;
  rating: number;
  reviewsCount: number;
  category: CategoryId;
  fitType: 'High-Rise' | 'Bikini' | 'Hipster' | 'Boy Short' | 'Bralette' | 'Bundle';
  fabric: string;
  fabricDetails: string;
  description: string;
  careInstructions: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  features: string[];
  bundleIncludes?: string;
}

export interface CartItem {
  id: string; // unique item id based on product + color + size
  productId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  colorName: string;
  size: ProductSize;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready/Dispatched'
  | 'Completed';

export interface Order {
  id: string; // e.g. "TJ-8492"
  date: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusNote: string;
  trackingNumber?: string;
  carbonNeutral: boolean;
}

export interface CuratedBundleProposal {
  title: string;
  discountBadge: string;
  summary: string;
  items: string[];
  regularPrice: number;
  bundlePrice: number;
  freeShipping: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'specialist';
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
  timeLabel: string;
  bundleProposal?: CuratedBundleProposal;
  attachedProduct?: Product;
}

export interface ChatThread {
  id: string;
  title: string;
  lastMessagePreview: string;
  lastMessageTime: string;
  type: 'concierge' | 'order' | 'fit-advice';
  status: 'active' | 'completed';
  pinnedProduct?: {
    product: Product;
    selectedSize: ProductSize;
    selectedColor: ProductColor;
  };
  relatedOrderId?: string;
  unreadCount?: number;
  messages: ChatMessage[];
  isTyping?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  preferredSize: ProductSize;
  preferredRise: string;
  discreetPackaging: boolean;
  carbonOffsetEnabled: boolean;
}

export interface VideoStory {
  id: string;
  title: string;
  tag: string;
  category: string;
  duration: string;
  thumbnail: string;
  description: string;
  featuredProductId: string;
}
