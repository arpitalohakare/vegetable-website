
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Check if the current user is an admin
  const isAdmin = user?.isAdmin || false;

  // Fallback image URL
  const fallbackImage = 'https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image';

  return (
    <div 
      className={cn(
        'product-card group',
        featured ? 'md:col-span-2 bg-accent/30' : ''
      )}
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image container */}
        <div className={cn(
          'blur-load relative overflow-hidden',
          featured ? 'aspect-[21/9] md:aspect-[2/1]' : 'aspect-square',
          isImageLoaded ? 'loaded' : ''
        )}>
          {/* Placeholder or background image */}
          <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
          
          {/* Product image */}
          <img 
            src={imageError ? fallbackImage : product.image || fallbackImage}
            alt={product.name}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.organic && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800">
                Organic
              </Badge>
            )}
            {product.discount && (
              <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800">
                {product.discount}% Off
              </Badge>
            )}
          </div>
          
          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 bg-white/90 hover:bg-white shadow-sm",
                      isInWishlist(product.id) ? "bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 border-red-200" : ""
                    )}
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/products/${product.id}`;
                    }}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex flex-wrap justify-between items-start mb-2">
            <h3 className="text-base font-medium">{product.name}</h3>
            <div className="text-base font-semibold text-primary">
              {formatCurrency(product.price)}
              <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground capitalize">
              {product.category}
            </span>
            {/* Only show the "Add to Cart" button for non-admin users */}
            {!isAdmin && (
              <Button 
                onClick={handleAddToCart}
                size="sm" 
                className="group-hover:opacity-100 opacity-80 transition-opacity"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
