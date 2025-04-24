
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { 
  ArrowRight, 
  Leaf, 
  Truck, 
  Clock, 
  ThumbsUp,
  ShoppingCart 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createMockProduct } from '@/types';

// Mock categories for the homepage
const categories = [
  { id: 1, name: 'Vegetables', image: 'https://images.unsplash.com/photo-1557844352-761f2dfe67c7?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'Fruits', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&auto=format&fit=crop' },
  { id: 4, name: 'Grains', image: 'https://images.unsplash.com/photo-1565478574907-9b99683017d7?q=80&w=400&auto=format&fit=crop' }
];

const Index = () => {
  // Sample products for the homepage
  const featuredProducts = [
    createMockProduct({
      id: "fp1",
      name: "Organic Mixed Vegetables Box",
      description: "A selection of fresh, seasonal organic vegetables.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1000&auto=format&fit=crop",
      category: "vegetables",
      stock: 15,
      unit: "box",
      organic: true,
      featured: true
    }),
    createMockProduct({
      id: "fp2",
      name: "Farm-Fresh Eggs",
      description: "Free-range eggs from pasture-raised hens.",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1583913836387-35de36b93055?q=80&w=1000&auto=format&fit=crop",
      category: "dairy",
      stock: 30,
      unit: "dozen",
      organic: true
    }),
    createMockProduct({
      id: "fp3",
      name: "Organic Whole Milk",
      description: "Creamy, non-homogenized whole milk from grass-fed cows.",
      price: 4.49,
      image: "https://images.unsplash.com/photo-1563448443-376abacc5733?q=80&w=1000&auto=format&fit=crop",
      category: "dairy",
      stock: 25,
      unit: "half-gallon",
      discount: 0.5
    }),
    createMockProduct({
      id: "fp4",
      name: "Organic Honey",
      description: "Raw, unfiltered honey from local bees.",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1626379801357-537732eb0aec?q=80&w=1000&auto=format&fit=crop",
      category: "pantry",
      stock: 20,
      unit: "jar",
      organic: true
    }),
    createMockProduct({
      id: "fp5",
      name: "Organic Sourdough Bread",
      description: "Artisanal sourdough bread made with organic flour.",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1584441832771-8656a510251a?q=80&w=1000&auto=format&fit=crop",
      category: "bakery",
      stock: 15,
      unit: "loaf",
      organic: true
    })
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                Organic &amp; Sustainable
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Fresh Produce Delivered <span className="text-primary">Direct to You</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Farm-fresh fruits and vegetables harvested at peak ripeness, delivered straight to your door. Taste the difference of local, sustainable farming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
              alt="Fresh produce"
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 rounded-2xl my-16 px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
            What Sets Us Apart
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose Farm Fresh?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to bringing you the highest quality produce while supporting sustainable farming practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Organic</h3>
            <p className="text-muted-foreground">All our produce is certified organic, grown without synthetic pesticides or fertilizers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">From our farm to your table in 24 hours, ensuring maximum freshness.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seasonal Products</h3>
            <p className="text-muted-foreground">We harvest our produce at peak ripeness for maximum flavor and nutrition.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <ThumbsUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainable</h3>
            <p className="text-muted-foreground">Our farming practices are environmentally friendly and support biodiversity.</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
              Browse By Category
            </Badge>
            <h2 className="text-3xl font-bold">Shop Categories</h2>
          </div>
          <Button variant="link" size="sm" asChild className="mt-2 md:mt-0">
            <Link to="/products">View All Categories</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.name.toLowerCase()}`}
              className="group relative rounded-xl overflow-hidden"
            >
              <div className="aspect-square w-full bg-gray-100">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-4">
                <h3 className="text-white font-semibold text-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
              Seasonal Favorites
            </Badge>
            <h2 className="text-3xl font-bold">Featured Products</h2>
          </div>
          <Button variant="link" size="sm" asChild className="mt-2 md:mt-0">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground rounded-2xl my-16 p-8 md:p-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="mb-2 px-3 py-1 text-sm rounded-full bg-white/20 text-white hover:bg-white/30">
            Special Offer
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Get 15% Off Your First Order</h2>
          <p className="text-lg opacity-90">
            Join our community of conscious consumers and get exclusive access to seasonal discounts and recipes.
          </p>
          <Button size="lg" variant="secondary" className="mt-4" asChild>
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
