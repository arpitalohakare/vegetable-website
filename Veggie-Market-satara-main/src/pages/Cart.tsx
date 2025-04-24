import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  MinusCircle, 
  PlusCircle, 
  ArrowRight,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';

const Cart = () => {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Calculate estimated tax (for demo purposes)
  const taxRate = 0.18; // 18% GST for India
  const estimatedTax = subtotal * taxRate;
  
  // Calculate shipping (free over ₹1000)
  const shippingThreshold = 1000;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 99;
  
  // Calculate total
  const total = subtotal + estimatedTax + shippingCost;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="bg-accent/50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any vegetables to your cart yet.
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
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Shopping Cart</h1>
        <p className="text-muted-foreground mt-1">
          You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Cart Items</h2>
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Cart
              </Button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
                  {/* Product image */}
                  <div className="flex-shrink-0">
                    <Link to={`/products/${item.product.id}`}>
                      <div className="h-24 w-24 bg-accent/30 rounded-md overflow-hidden">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </Link>
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 sm:ml-6 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <Link to={`/products/${item.product.id}`} className="text-base font-medium hover:text-primary">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.product.price)} / {item.product.unit}
                        </p>
                      </div>
                      
                      <div className="flex items-center mt-3 sm:mt-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-destructive px-0"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                      <span className="font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to="/products" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span>{formatCurrency(estimatedTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
              </div>
              {subtotal < shippingThreshold && (
                <div className="text-sm text-muted-foreground bg-accent/30 p-2 rounded">
                  Add {formatCurrency(shippingThreshold - subtotal)} more to qualify for free shipping.
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-medium text-lg mb-6">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            <Button asChild className="w-full">
              <Link to={isAuthenticated ? "/checkout" : "/login?redirect=checkout"}>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Secure checkout with SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
