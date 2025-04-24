
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createMockProduct, Product } from '@/types';
import { seedProducts } from '@/services/productService';
import { generateDeterministicUUID } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SeedProducts = () => {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const navigate = useNavigate();

  // Mock products for development - same as in Products.tsx
  const products = [
    createMockProduct({
      id: generateDeterministicUUID("prod1"),
      name: "Organic Spinach",
      description: "Fresh organic spinach, perfect for salads and cooking. Our spinach is grown without pesticides and harvested at peak freshness to ensure the best flavor and nutritional value. Packed with vitamins A, C, and K, iron, and antioxidants.",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1000&auto=format&fit=crop",
      category: "greens",
      stock: 30,
      unit: "bunch",
      organic: true
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod2"),
      name: "Organic Kale",
      description: "Fresh organic kale, perfect for salads and cooking. Kale is an excellent source of vitamins K, A, and C, as well as antioxidants. Our kale is grown using sustainable farming practices without the use of harmful pesticides.",
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
      description: "Sweet and crunchy red bell peppers. Bell peppers are an excellent source of vitamin C and antioxidants. They add vibrant color, crunch, and sweetness to salads, stir-fries, and roasted vegetable dishes.",
      price: 1.49,
      image: "https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=80&w=1998&auto=format&fit=crop",
      category: "vegetables",
      stock: 40,
      unit: "each"
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod4"),
      name: "Organic Carrots",
      description: "Sweet and nutritious organic carrots. Our carrots are grown in rich, organic soil without synthetic fertilizers or pesticides, allowing their natural sweetness and nutrients to thrive. Perfect for snacking, roasting, or adding to soups and stews.",
      price: 2.49,
      image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=1770&auto=format&fit=crop",
      category: "roots",
      stock: 25,
      unit: "bundle",
      organic: true
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod5"),
      name: "Fresh Broccoli",
      description: "Crisp and flavorful broccoli crowns. Broccoli is a nutrient powerhouse packed with vitamins, minerals, and fiber. Our fresh broccoli has tight, dense florets with a vibrant green color, indicating peak freshness and quality.",
      price: 2.29,
      image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=2002&auto=format&fit=crop",
      category: "vegetables",
      stock: 35,
      unit: "head",
      organic: true
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod6"),
      name: "Cucumber",
      description: "Cool and refreshing cucumbers. Cucumbers are incredibly hydrating with their high water content. They provide a refreshing crunch to salads and are perfect for making quick pickles or adding to infused water for a spa-like treat.",
      price: 0.99,
      image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?q=80&w=1000&auto=format&fit=crop",
      category: "vegetables",
      stock: 45,
      unit: "each"
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod7"),
      name: "Organic Tomatoes",
      description: "Juicy and flavorful organic tomatoes. Our organic tomatoes are vine-ripened for maximum flavor development. They're perfect for making fresh salsas, adding to sandwiches, or using as the base for homemade tomato sauce.",
      price: 3.49,
      image: "https://images.unsplash.com/photo-1592924357228-91f67e116b13?q=80&w=1000&auto=format&fit=crop",
      category: "vegetables",
      stock: 30,
      unit: "pound",
      organic: true
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod8"),
      name: "Garlic",
      description: "Fresh aromatic garlic bulbs. Garlic is not only a flavorful addition to countless dishes but also offers numerous health benefits. Our garlic has plump cloves with tight, papery skin, indicating freshness and long shelf life.",
      price: 0.79,
      image: "https://images.unsplash.com/photo-1615475532358-a6b7e5522902?q=80&w=1000&auto=format&fit=crop",
      category: "herbs",
      stock: 50,
      unit: "bulb"
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod9"),
      name: "Yellow Onion",
      description: "Versatile yellow onions for cooking. Yellow onions are the workhorse of the kitchen, providing a foundation of flavor for countless dishes. Their balanced sweet and astringent flavor intensifies when cooked, making them perfect for caramelizing.",
      price: 0.89,
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1000&auto=format&fit=crop",
      category: "vegetables",
      stock: 60,
      unit: "each"
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod10"),
      name: "Green Beans",
      description: "Crisp and fresh green beans. Our green beans are harvested at the peak of tenderness when they snap crisply when bent. They retain their bright green color and sweet flavor when lightly cooked, making them a versatile side dish.",
      price: 2.99,
      image: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?q=80&w=1000&auto=format&fit=crop",
      category: "vegetables",
      stock: 25,
      unit: "pound"
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod11"),
      name: "Organic Potatoes",
      description: "Versatile organic potatoes. Our organic potatoes are grown in rich soil without synthetic chemicals, allowing their natural earthy flavor to develop fully. They're perfect for roasting, mashing, baking, or making into crispy French fries.",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
      category: "roots",
      stock: 40,
      unit: "bag",
      organic: true
    }),
    createMockProduct({
      id: generateDeterministicUUID("prod12"),
      name: "Fresh Cilantro",
      description: "Aromatic herb perfect for garnishing. Cilantro adds a bright, citrusy flavor to Mexican, Asian, and Indian cuisines. Our cilantro is harvested with roots intact for longer-lasting freshness and more intense flavor in your cooking.",
      price: 1.29,
      image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1000&auto=format&fit=crop",
      category: "herbs",
      stock: 20,
      unit: "bunch"
    })
  ];

  useEffect(() => {
    // Check if products are already seeded
    const checkProducts = async () => {
      try {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          throw error;
        }
        
        if (count && count > 0) {
          setSeeded(true);
        }
      } catch (error) {
        console.error('Error checking products:', error);
      }
    };
    
    checkProducts();
  }, []);

  const handleSeedProducts = async () => {
    setLoading(true);
    try {
      await seedProducts(products);
      setSeeded(true);
      toast.success('Products have been added to the database!');
    } catch (error) {
      console.error('Error seeding products:', error);
      toast.error('Failed to seed products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Seed Products</CardTitle>
          <CardDescription>
            Add sample products to your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            {seeded 
              ? 'Products have already been added to the database.' 
              : 'Click the button below to add sample products to your database. This will create 12 products with detailed information.'}
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="text-sm flex items-center gap-2">
                <div className="w-8 h-8 bg-muted rounded overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="truncate">{product.name}</span>
              </div>
            ))}
            <div className="text-sm text-muted-foreground col-span-2 text-center pt-1">
              + 8 more products
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/products')}>
            Go to Products
          </Button>
          <Button 
            onClick={handleSeedProducts} 
            disabled={loading || seeded}
          >
            {loading ? 'Adding...' : seeded ? 'Already Added' : 'Add Products'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SeedProducts;
