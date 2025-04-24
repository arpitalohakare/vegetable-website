
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { createMockProduct } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { seedProducts } from '@/services/productService';
import { useProducts } from '@/hooks/useSupabaseData';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading: productsLoading, error, fetchProducts } = useProducts();
  
  // Get category from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl || 'all');
  const [organicOnly, setOrganicOnly] = useState(false);

  useEffect(() => {
    // Check if products are empty and seed them automatically
    if (products.length === 0 && !productsLoading) {
      handleAddProducts();
    }
    
    // Update category filter if it changes in URL
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl.toLowerCase());
    }
  }, [products, productsLoading, categoryFromUrl]);

  const handleAddProducts = async () => {
    try {
      toast.loading('Adding products to database...');
      const addedProducts = await seedProducts();
      toast.success(`Added ${addedProducts.length} products successfully!`);
      
      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error('Error adding products:', error);
      toast.error('Failed to add products');
    }
  };

  const filteredProducts = products.filter(product => {
    // Convert to lowercase for case-insensitive search
    const productName = product.name ? product.name.toLowerCase() : '';
    const searchLower = searchQuery.toLowerCase();
    
    // For category filtering, ensure case insensitive comparison
    const productCategory = product.category ? product.category.toLowerCase() : '';
    const categoryLower = categoryFilter.toLowerCase();
    
    // Updated category matching for case-insensitivity
    const matchesSearch = productName.includes(searchLower);
    const matchesCategory = categoryFilter === 'all' || productCategory === categoryLower;
    const matchesOrganic = !organicOnly || product.organic === true;

    return matchesSearch && matchesCategory && matchesOrganic;
  });

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Our Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium mb-4">No Products Found</h2>
          <p className="text-muted-foreground mb-6">
            No products found in the database. Adding products now...
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search */}
            <div className="md:col-span-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter - Updated to use shadcn Select */}
            <div className="md:col-span-1">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="herbs">Herbs</SelectItem>
                  <SelectItem value="roots">Roots</SelectItem>
                  <SelectItem value="greens">Greens</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="pantry">Pantry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Organic Only */}
            <div className="md:col-span-1 flex items-center">
              <Checkbox
                id="organic"
                checked={organicOnly}
                onCheckedChange={(checked) => setOrganicOnly(checked === true)}
              />
              <label
                htmlFor="organic"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Organic Only
              </label>
            </div>
          </div>

          {/* Product Grid - Improved layout and spacing */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No products match your filters</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter options.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
