
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product, Order, UserProfile } from '@/types';
import { useAuth } from '@/context/AuthContext';

// Products hooks
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding product to database:', product);
      
      // Accept strings from the form and convert to numbers here
      const productToAdd = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock)
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([productToAdd])
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding product:', error);
        throw error;
      }

      console.log('Product added successfully:', data);
      
      // Update local state with the new product
      setProducts(prev => [data as Product, ...prev]);
      
      toast.success('Product added successfully');
      return data;
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product');
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      // Make sure price and stock are converted to numbers
      const updatesToApply = {
        ...updates,
        price: updates.price !== undefined ? Number(updates.price) : undefined,
        stock: updates.stock !== undefined ? Number(updates.stock) : undefined
      };
      
      const { data, error } = await supabase
        .from('products')
        .update(updatesToApply)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProducts(prev =>
        prev.map(product => (product.id === id ? { ...product, ...data } : product))
      );
      
      toast.success('Product updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Set up realtime subscription
    const channel = supabase
      .channel('product-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

// Orders hooks
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching orders...");
      
      // First, fetch the orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Get all order IDs
      const orderIds = ordersData.map(order => order.id);

      // Then fetch the order items with product information
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id(*)
        `)
        .in('order_id', orderIds);

      if (itemsError) {
        console.error("Error fetching order items:", itemsError);
        throw itemsError;
      }

      // Fetch user IDs from orders
      const userIds = [...new Set(ordersData.map(order => order.user_id))];

      // Fetch profiles to get user information
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      console.log("Orders data:", ordersData);
      console.log("Order items data:", orderItemsData);
      console.log("Profiles data:", profilesData);

      // Map profiles by ID for quick lookup
      const profilesById = profilesData?.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>) || {};
      
      // Transform the data into the expected format
      const transformedOrders = ordersData?.map((order) => {
        // Find all items for this order
        const orderItems = orderItemsData?.filter(item => item.order_id === order.id) || [];
        
        // Find user profile for this order
        const userProfile = profilesById[order.user_id];
        
        const orderData = {
          ...order,
          items: orderItems,
          user: userProfile ? {
            name: userProfile.name || 'Unknown User',
            email: userProfile.email || null
          } : null
        } as Order;
        
        return orderData;
      }) || [];

      console.log("Transformed orders:", transformedOrders);
      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to fetch orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setOrders(prev =>
        prev.map(order => (order.id === id ? { ...order, status } : order))
      );
      
      toast.success(`Order status updated to ${status}`);
      return data;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
  };
};

// User profiles hooks
export const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching user profiles...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      console.log("User profiles data:", data);
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching user profiles:', error);
      setError(error.message || 'Failed to fetch user profiles');
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();

    // Set up realtime subscription
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          fetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
  };
};

// This is the missing hook that was causing the error
export const useAdminData = () => {
  const { products, loading: productsLoading, error: productsError, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, loading: ordersLoading, error: ordersError, fetchOrders, updateOrderStatus } = useOrders();
  const { profiles: userProfiles, loading: usersLoading, error: usersError, fetchProfiles } = useUserProfiles();

  // Transform user profiles to include order count
  const users = userProfiles.map(profile => {
    const userOrders = orders.filter(order => order.user_id === profile.id);
    return {
      ...profile,
      orderCount: userOrders.length,
      email: profile.email || 'N/A' // Add email if available
    };
  });

  console.log("Transformed users with orders:", users);

  // Calculate revenue statistics
  const calculateRevenue = () => {
    const total = orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = orders
      .filter(order => new Date(order.created_at) >= today)
      .reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = orders
      .filter(order => new Date(order.created_at) >= firstDayOfMonth)
      .reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
    
    return {
      total,
      today: todayRevenue,
      monthly: monthlyRevenue
    };
  };

  return {
    // Products data
    products,
    productsLoading,
    productsError,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Orders data
    orders,
    ordersLoading,
    ordersError,
    fetchOrders,
    updateOrderStatus,
    
    // Users data
    users,
    usersLoading,
    usersError,
    fetchUsers: fetchProfiles,
    
    // Revenue statistics
    revenue: calculateRevenue()
  };
};

// Add this for the Profile page
export const useUserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching orders for user:", user.id);

      // First, fetch the orders for the current user
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching user orders:", ordersError);
        throw ordersError;
      }

      if (!ordersData || ordersData.length === 0) {
        console.log("No orders found for user:", user.id);
        setOrders([]);
        setLoading(false);
        return;
      }

      // Get all order IDs to filter order items
      const orderIds = ordersData.map(order => order.id);

      // Then, fetch order items with product information
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id(*)
        `)
        .in('order_id', orderIds);

      if (itemsError) {
        console.error("Error fetching order items:", itemsError);
        throw itemsError;
      }

      console.log("User orders data:", ordersData);
      console.log("Order items data:", orderItemsData);
      
      // Transform the data into the expected format
      const transformedOrders = ordersData.map((order) => {
        // Find all items for this order
        const orderItems = orderItemsData?.filter(item => item.order_id === order.id) || [];
        
        const orderData = {
          ...order,
          items: orderItems,
          user: {
            name: user.name || 'Unknown',
            email: user.email || ''
          }
        } as Order;
        
        return orderData;
      });

      console.log("Transformed user orders:", transformedOrders);
      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching user orders:', error);
      setError(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.name, user?.email]);

  useEffect(() => {
    fetchOrders();

    // Set up realtime subscription if user is authenticated
    if (user?.id) {
      const channel = supabase
        .channel('user-orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchOrders, user?.id]);

  return { orders, loading, error, refetchOrders: fetchOrders };
};
