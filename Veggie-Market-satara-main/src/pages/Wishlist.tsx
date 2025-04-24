import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Heart,
  ShoppingBag,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            Start adding products to your wishlist by clicking the heart icon.
          </p>
          <Button asChild size="lg">
            <Link to="/products">
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <Button 
            variant="outline" 
            onClick={clearWishlist}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Wishlist
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className="aspect-square relative overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  />
                </Link>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {product.organic && (
                  <Badge className="absolute top-3 left-3 bg-green-100 text-green-800">
                    Organic
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <Link to={`/products/${product.id}`} className="hover:underline">
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {formatCurrency(product.price)}
                  </span>
                  <Button 
                    onClick={() => addItem(product, 1)}
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 