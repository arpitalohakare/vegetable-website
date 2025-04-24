import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Heart, ShoppingCart, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from '@/components/ProductCard';
import { formatCurrency } from '@/lib/utils';
import { createMockProduct, Product } from '@/types';
import { getProductById } from '@/services/productService';
import { generateDeterministicUUID } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check if user is admin
  const isAdmin = user?.isAdmin || false;
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error('Product ID is missing');
        }
        
        // Try to fetch from the database first
        let productData = await getProductById(id);
        
        // If not found in the database, use mock data
        if (!productData) {
          // Use mock product as fallback
          productData = createMockProduct({
            id: generateDeterministicUUID(id),
            name: "Organic Spinach",
            description: "Fresh organic spinach, perfect for salads and cooking. Our spinach is grown without pesticides and harvested at peak freshness to ensure the best flavor and nutritional value. Packed with vitamins A, C, and K, iron, and antioxidants.",
            price: 3.99,
            image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1000&auto=format&fit=crop",
            category: "greens",
            stock: 30,
            unit: "bunch",
            organic: true
          });
        }
        
        setProduct(productData);
        
        // Fetch related products based on category
        const { data: relatedData, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', productData.id)
          .limit(4);
        
        if (error) {
          throw error;
        }
        
        if (relatedData && relatedData.length > 0) {
          setRelatedProducts(relatedData as Product[]);
        } else {
          // Fallback to mock related products
          setRelatedProducts([
            createMockProduct({
              id: generateDeterministicUUID("prod2"),
              name: "Organic Kale",
              description: "Fresh organic kale, perfect for salads and cooking.",
              price: 2.99,
              image: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?q=80&w=1000&auto=format&fit=crop",
              category: "greens",
              stock: 25,
              unit: "bunch",
              organic: true
            }),
            createMockProduct({
              id: generateDeterministicUUID("prod3"),
              name: "Red Bell Pepper",
              description: "Sweet and crunchy red bell peppers.",
              price: 1.49,
              image: "https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=80&w=1998&auto=format&fit=crop",
              category: "vegetables",
              stock: 40,
              unit: "each",
              discount: 10
            }),
            createMockProduct({
              id: generateDeterministicUUID("prod4"),
              name: "Organic Carrots",
              description: "Sweet and nutritious organic carrots.",
              price: 2.49,
              image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=1770&auto=format&fit=crop",
              category: "roots",
              stock: 25,
              unit: "bundle",
              organic: true
            })
          ]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // The success toast will be shown in the CartContext
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleShare = async () => {
    if (!product) return;

    // Create a formatted share message
    const shareMessage = `Check out ${product.name}!\n\n` +
      `Price: ${formatCurrency(product.price)} per ${product.unit}\n` +
      `${product.organic ? '🌱 Organic\n' : ''}` +
      `${product.description}\n\n` +
      `Shop now at: ${window.location.href}`;

    try {
      if (navigator.share) {
        // Use Web Share API if available (mobile devices)
        await navigator.share({
          title: `${product.name} - Veggie Market`,
          text: shareMessage,
          url: window.location.href
        });
        toast.success('Thanks for sharing!');
      } else {
        // On desktop, show a dropdown with sharing options
        const textArea = document.createElement('textarea');
        textArea.value = shareMessage;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success message with instructions
        toast.success(
          <div className="space-y-2">
            <p>Product details copied to clipboard!</p>
            <p className="text-sm text-muted-foreground">You can now paste and share it anywhere.</p>
          </div>
        );
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying the URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Product link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        toast.error('Failed to share product');
      }
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center mb-4 text-sm font-medium hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.location.href = '/products'}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center mb-4 text-sm font-medium hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto rounded-lg shadow-md object-cover aspect-square" 
          />
          <div className="mt-4 flex justify-between items-center">
            <Button 
              variant={isInWishlist(product.id) ? "default" : "secondary"} 
              size="icon"
              onClick={handleWishlistToggle}
              className={isInWishlist(product.id) ? "bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 border-red-200" : ""}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </Button>
            <Button 
              variant="secondary" 
              className="flex items-center gap-2 px-4" 
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <div className="mt-2 flex items-center">
            <Badge variant="secondary" className="mr-2">{product.category}</Badge>
            {product.organic && <Badge variant="outline">Organic</Badge>}
            {product.discount && <Badge variant="destructive">-{product.discount}%</Badge>}
          </div>
          <p className="text-muted-foreground mt-4">{product.description}</p>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">{formatCurrency(product.price)}</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                -
              </Button>
              <span>{quantity}</span>
              <Button variant="outline" size="icon" onClick={incrementQuantity}>
                +
              </Button>
            </div>
          </div>
          
          {/* Only show Add to Cart button for non-admin users */}
          {!isAdmin ? (
            <Button className="w-full mt-4" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          ) : (
            <div className="w-full mt-4 p-2 text-center bg-gray-100 rounded-md text-gray-500">
              Admin mode - cannot add to cart
            </div>
          )}

          <Separator className="my-4" />

          {/* Product Tabs */}
          <Tabs defaultValue="description" className="space-y-4">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-2">
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </TabsContent>
            <TabsContent value="details">
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Weight: 1 lb</li>
                <li>Origin: Local Farm</li>
                <li>Organic: {product.organic ? 'Yes' : 'No'}</li>
                <li>Unit: {product.unit}</li>
                <li>Stock: {product.stock} available</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews">
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          {/* Accordion for Shipping & Returns */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping Information</AccordionTrigger>
              <AccordionContent>
                We ship to all 50 states. Shipping rates are calculated at checkout. Standard delivery takes 3-5 business days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>Returns & Exchanges</AccordionTrigger>
              <AccordionContent>
                We accept returns and exchanges within 30 days of purchase. Items must be in original condition with tags attached.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
