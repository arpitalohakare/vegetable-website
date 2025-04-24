
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  category: string | null;
  organic: boolean | null;
  unit: string | null;
  created_at: string | null;
  updated_at: string | null;
  discount?: number | null;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CartItems = CartItem[];

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string | null;
  products?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  payment_method: string | null;
  items?: OrderItem[];
  user?: {
    name: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  phone: string | null;
  created_at: string;
  is_admin: boolean | null;
  email?: string | null; // Added email property
  orderCount?: number;
}

export type Category = 'vegetables' | 'fruits' | 'herbs' | 'roots' | 'greens' | 'all';

export interface SearchFilters {
  query: string;
  category: Category;
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
}

export interface WebsiteSettings {
  siteName: string;
  logo: string;
  currency: string;
  currencySymbol: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  features: {
    enableCOD: boolean;
    enableOnlinePayment: boolean;
    enableReviews: boolean;
  };
}

// Mock data helper function to avoid repeated type errors
export function createMockProduct(data: Partial<Product>): Product {
  return {
    id: data.id || '00000000-0000-0000-0000-000000000000',
    name: data.name || 'Product Name',
    description: data.description || null,
    price: data.price || 0,
    stock: data.stock || 0,
    image: data.image || null,
    category: data.category || null,
    organic: data.organic || null,
    unit: data.unit || null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    discount: data.discount || null,
    featured: data.featured || false
  };
}
