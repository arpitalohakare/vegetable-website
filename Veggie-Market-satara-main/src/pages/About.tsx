
import React from 'react';
import { 
  Leaf, 
  Truck, 
  Recycle, 
  Users, 
  Truck as TruckDelivery
} from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About VeggieMarket</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Founded in 2010, VeggieMarket has been bringing fresh, organic produce directly 
          from farms to your doorstep. We believe in sustainable farming practices and 
          supporting local farmers.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-accent/50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground">
            To make organic, pesticide-free vegetables and fruits accessible to everyone while 
            supporting sustainable farming practices and local farmers.
          </p>
        </div>
        <div className="bg-accent/50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-muted-foreground">
            To create a healthier community by providing the freshest produce while minimizing 
            our environmental footprint and promoting sustainable living.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 border border-border rounded-lg">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Organic & Fresh</h3>
            <p className="text-muted-foreground">
              We source only the freshest organic produce, harvested at peak ripeness.
            </p>
          </div>
          
          <div className="text-center p-6 border border-border rounded-lg">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Recycle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Sustainable</h3>
            <p className="text-muted-foreground">
              We prioritize eco-friendly farming practices and recyclable packaging.
            </p>
          </div>
          
          <div className="text-center p-6 border border-border rounded-lg">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Community-Focused</h3>
            <p className="text-muted-foreground">
              We support local farmers and give back to our community.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Our Story</h2>
        <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
          <p className="text-muted-foreground mb-4">
            VeggieMarket began as a small farmer's market stall run by the Kumar family. Noticing the 
            growing demand for organic produce and the disconnect between farmers and consumers, 
            the Kumars decided to bridge this gap.
          </p>
          <p className="text-muted-foreground mb-4">
            In 2010, we launched our first delivery service with just three farmers and a small 
            customer base in one neighborhood. Today, we work with over 50 local farmers and 
            deliver to thousands of households across the country.
          </p>
          <p className="text-muted-foreground">
            Our growth hasn't changed our core values. We still personally know each of our 
            partner farmers and ensure fair compensation for their hard work. Every vegetable 
            and fruit is carefully inspected to meet our quality standards before reaching your home.
          </p>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">From Farm to Your Doorstep</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative">
              <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute top-8 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">1</div>
            </div>
            <h3 className="text-xl font-medium mb-2">Harvest</h3>
            <p className="text-muted-foreground">
              Vegetables are harvested early morning to ensure maximum freshness.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative">
              <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute top-8 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">2</div>
            </div>
            <h3 className="text-xl font-medium mb-2">Transportation</h3>
            <p className="text-muted-foreground">
              Produce is carefully transported to our facility in temperature-controlled vehicles.
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative">
              <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckDelivery className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute top-8 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">3</div>
            </div>
            <h3 className="text-xl font-medium mb-2">Delivery</h3>
            <p className="text-muted-foreground">
              Orders are packed and delivered to your doorstep within 24 hours of harvest.
            </p>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-10">Our Promise to You</h2>
        <div className="bg-accent/50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium mb-3">Freshness Guarantee</h3>
          <p className="text-muted-foreground mb-6">
            If you're not 100% satisfied with the freshness of your delivery, we'll replace it or refund your money.
          </p>
          <h3 className="text-xl font-medium mb-3">On-Time Delivery</h3>
          <p className="text-muted-foreground">
            We deliver at your convenience. Choose your preferred delivery slot, and we'll be there.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
