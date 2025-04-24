import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { validateUUID, generateDeterministicUUID } from '@/integrations/supabase/client';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Function to sanitize product for database compatibility
const sanitizeProduct = (product: Product): Product => {
  if (!product.id) return product;
  
  // If the product id is not a valid UUID, generate a deterministic UUID
  const sanitizedId = validateUUID(product.id) 
    ? product.id 
    : generateDeterministicUUID(product.id);
  
  return {
    ...product,
    id: sanitizedId
  };
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { user } = useAuth();
  
  // Get the current user's ID or use 'guest' for non-logged in users
  const currentUserId = user?.id || 'guest';

  // Load wishlist from localStorage on initial render or when user changes
  useEffect(() => {
    const loadWishlist = () => {
      // Always reset the wishlist state first when user changes
      setItems([]);
      
      const wishlistKey = `wishlist_${currentUserId}`;
      const savedWishlist = localStorage.getItem(wishlistKey);
      
      if (savedWishlist) {
        try {
          // Ensure all product IDs are valid UUIDs
          const parsedWishlist: Product[] = JSON.parse(savedWishlist);
          const validatedWishlist = parsedWishlist.map(item => sanitizeProduct(item));
          setItems(validatedWishlist);
        } catch (error) {
          console.error('Failed to parse saved wishlist:', error);
          localStorage.removeItem(wishlistKey);
        }
      }
    };
    
    loadWishlist();
  }, [currentUserId, user?.id]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const wishlistKey = `wishlist_${currentUserId}`;
    
    if (items.length > 0) {
      localStorage.setItem(wishlistKey, JSON.stringify(items));
    } else {
      // Remove the wishlist entry if it's empty
      localStorage.removeItem(wishlistKey);
    }
  }, [items, currentUserId]);

  const addToWishlist = (product: Product) => {
    // Ensure the product has a valid UUID
    const sanitizedProduct = sanitizeProduct(product);
    
    setItems(prevItems => {
      const isExisting = prevItems.some(item => item.id === sanitizedProduct.id);
      
      if (isExisting) {
        // If product is already in wishlist, don't add it again
        toast.info(`${sanitizedProduct.name} is already in your wishlist`);
        return prevItems;
      } else {
        // Add new item
        toast.success(`Added ${sanitizedProduct.name} to wishlist`);
        return [...prevItems, sanitizedProduct];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from wishlist`);
      }
      
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    localStorage.removeItem(`wishlist_${currentUserId}`);
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 