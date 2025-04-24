import { supabase, validateUUID, generateDeterministicUUID, sanitizeProductId } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from 'sonner';

// Add products to the database
export const addProductsToDatabase = async (products: Product[]): Promise<Product[]> => {
  try {
    console.log("Adding products to database:", products);
    
    const addedProducts: Product[] = [];
    
    // Process each product
    for (const product of products) {
      // Ensure the product has a valid UUID
      const productId = validateUUID(product.id) 
        ? product.id 
        : generateDeterministicUUID(product.id);
      
      console.log(`Processing product ${product.name} with ID: ${productId}`);
      
      // Check if the product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', productId)
        .single();
      
      if (!existingProduct) {
        // Insert new product
        const { error, data } = await supabase
          .from('products')
          .insert([
            {
              id: productId,
              name: product.name,
              description: product.description,
              price: product.price,
              stock: product.stock,
              image: product.image,
              category: product.category,
              organic: product.organic,
              unit: product.unit
            }
          ])
          .select();
        
        console.log(`Insert result for ${product.name}:`, { error, data });
        
        if (error) {
          console.error(`Error adding product ${product.name}:`, error);
          throw error;
        }
        
        if (data && data.length > 0) {
          addedProducts.push(data[0] as Product);
        }
      } else {
        console.log(`Product ${product.name} already exists, skipping`);
      }
    }
    
    toast.success('Products added to database successfully');
    return addedProducts;
  } catch (error) {
    console.error('Error adding products to database:', error);
    toast.error('Failed to add products to database: ' + error.message);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    console.log("Getting product with ID:", productId);
    
    // Ensure the product ID is a valid UUID
    const validProductId = sanitizeProductId(productId);
    
    console.log("Sanitized product ID:", validProductId);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', validProductId)
      .single();
    
    if (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
    
    console.log("Fetched product:", data);
    return data as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Seed the database with products
export const seedProducts = async (customProducts?: Product[]): Promise<Product[]> => {
  try {
    // If custom products are provided, use them, otherwise use default products
    if (customProducts && customProducts.length > 0) {
      console.log("Seeding database with custom products:", customProducts);
      return await addProductsToDatabase(customProducts);
    }
    
    // Products from the Supabase table image and additional new products
    const supabaseProducts: Product[] = [
      // Previously added product
      {
        id: "c5d7a4fd-1b2e-4db1-badb-33dfe0add36",
        name: "Onion 1 kg",
        description: "The beauty of an Onion is that it can go just about anywhere a savory dish is found",
        price: 28.00,
        image: "https://www.jiomart.com/images/product/original/590003515/onion-1-kg-product-images-o590003515-p590003515-0-202203170515.jpg",
        category: "vegetables",
        stock: 50,
        unit: "kg",
        organic: false,
        created_at: null,
        updated_at: null
      },
      
      // New products to add to the table
      {
        id: generateDeterministicUUID("tomatoes_product"),
        name: "Fresh Tomatoes - 1 kg",
        description: "Juicy, ripe tomatoes perfect for salads, sauces, and sandwiches. Our fresh tomatoes are carefully selected for optimal flavor and ripeness.",
        price: 35.99,
        image: "https://images.unsplash.com/photo-1592924357229-3cd694c4d025?q=80&w=1000&auto=format&fit=crop",
        category: "vegetables",
        stock: 45,
        unit: "kg",
        organic: true,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("apples_product"),
        name: "Red Apples - 500g",
        description: "Sweet and crunchy red apples. Rich in antioxidants and dietary fiber, these apples make for a healthy snack or a perfect ingredient for pies and desserts.",
        price: 42.50,
        image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1000&auto=format&fit=crop",
        category: "fruits",
        stock: 60,
        unit: "pack",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("potatoes_product"),
        name: "Russet Potatoes - 2 kg",
        description: "Versatile russet potatoes, ideal for baking, mashing, or frying. These potatoes have a fluffy texture when cooked and are perfect for various culinary applications.",
        price: 32.99,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
        category: "roots",
        stock: 40,
        unit: "bag",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("cilantro_product"),
        name: "Fresh Cilantro Bunch",
        description: "Aromatic cilantro (coriander) leaves with a distinctive flavor perfect for garnishing and seasoning dishes. Adds freshness to Mexican, Indian, and Thai cuisines.",
        price: 18.50,
        image: "https://images.unsplash.com/photo-1615485500664-8f3c23744796?q=80&w=1000&auto=format&fit=crop",
        category: "herbs",
        stock: 30,
        unit: "bunch",
        organic: true,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("cucumber_product"),
        name: "Cucumber - 3 pieces",
        description: "Cool and refreshing cucumbers with a crisp texture. Perfect for salads, sandwiches, or making refreshing summer drinks and tzatziki sauce.",
        price: 25.75,
        image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?q=80&w=1000&auto=format&fit=crop",
        category: "vegetables",
        stock: 50,
        unit: "pack",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: "4e3eba56-bb99-4f6c-9dd3-cb59df583e4",
        name: "Fresho! Strawberry, 200 g",
        description: "About the Product Strawberries are juicy",
        price: 80.00,
        image: "https://www.bbassets.com/media/upload",
        category: "fruits",
        stock: 25,
        unit: "pack",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: "7722c4d5-cd6b-4771-9c43-b86b26d4a5c",
        name: "Fresh Carrots",
        description: "Sweet and crunchy organic carrots, perfect",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1582394142869",
        category: "roots",
        stock: 40,
        unit: "bunch",
        organic: true,
        created_at: null,
        updated_at: null
      },
      {
        id: "8006d141-f0af-4df3-bcf7-5935c9b013ff",
        name: "Bell Peppers Mix",
        description: "Colorful mix of fresh bell peppers",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1563699500462",
        category: "vegetables",
        stock: 30,
        unit: "pack",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: "9e4dc5e2-2d0d-474b-9f49-f8e334499f0c",
        name: "Organic Broccoli",
        description: "Fresh organic broccoli, locally grown",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1584270354949",
        category: "vegetables",
        stock: 35,
        unit: "head",
        organic: true,
        created_at: null,
        updated_at: null
      },
      {
        id: "9ed2ac9b-b38a-4eb4-90be-355193f3fb1f",
        name: "Sweet Corn",
        description: "Also known as Maize, Sweet Corn is a cereal",
        price: 16.99,
        image: "https://www.jiomart.com/images/product",
        category: "vegetables",
        stock: 50,
        unit: "piece",
        organic: false,
        created_at: null,
        updated_at: null
      }
    ];
    
    // Add previous additional products as a fallback
    const additionalProducts: Product[] = [
      {
        id: generateDeterministicUUID("prod13"),
        name: "Organic Baby Spinach",
        description: "Tender baby spinach leaves, perfect for salads and smoothies. Our organic baby spinach is grown without synthetic pesticides and harvested at its nutritional peak.",
        price: 3.49,
        image: "https://images.unsplash.com/photo-1580910365329-81b5cbf74775?q=80&w=1000&auto=format&fit=crop",
        category: "greens",
        stock: 40,
        unit: "package",
        organic: true,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("prod14"),
        name: "Red Onions",
        description: "Sweet and colorful red onions. Red onions have a milder, sweeter flavor than yellow onions and add beautiful color to salads, sandwiches, and salsas when used raw. When cooked, they add depth and subtle sweetness to many dishes.",
        price: 1.29,
        image: "https://images.unsplash.com/photo-1618512496248-a3e6c284edaa?q=80&w=1000&auto=format&fit=crop",
        category: "vegetables",
        stock: 50,
        unit: "each",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("prod15"),
        name: "Fresh Ginger Root",
        description: "Aromatic and zesty ginger root. Fresh ginger adds a warm, spicy kick to stir-fries, curries, and teas. It's valued not only for its distinctive flavor but also for its digestive and anti-inflammatory properties.",
        price: 2.99,
        image: "https://images.unsplash.com/photo-1603431777007-fcacc9d41f64?q=80&w=1000&auto=format&fit=crop",
        category: "roots",
        stock: 30,
        unit: "piece",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("prod16"),
        name: "Organic Kiwi Fruit",
        description: "Sweet and tangy organic kiwi fruits. Kiwis are packed with vitamin C, fiber, and antioxidants. Their bright green flesh and tiny black seeds provide a refreshing burst of flavor that's both sweet and slightly tart.",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=1000&auto=format&fit=crop",
        category: "fruits",
        stock: 35,
        unit: "pack",
        organic: true,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("prod17"),
        name: "Fresh Basil",
        description: "Aromatic fresh basil leaves. Basil is the star of Italian cuisine, adding its distinctive aroma and flavor to pastas, pizzas, and salads. Our fresh basil bunches are carefully grown and harvested to ensure maximum flavor.",
        price: 2.49,
        image: "https://images.unsplash.com/photo-1600689042427-b13ef4e29d79?q=80&w=1000&auto=format&fit=crop",
        category: "herbs",
        stock: 25,
        unit: "bunch",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("prod18"),
        name: "Sweet Peas",
        description: "Tender, sweet garden peas. Sweet peas are nature's perfect snack—sweet, nutritious, and satisfying. They're delicious raw as a snack, lightly steamed as a side dish, or added to stir-fries, soups, and pastas.",
        price: 3.29,
        image: "https://images.unsplash.com/photo-1563566925391-3a396a9a0d77?q=80&w=1000&auto=format&fit=crop",
        category: "vegetables",
        stock: 30,
        unit: "pound",
        organic: false,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("prod19"),
        name: "Organic Blueberries",
        description: "Plump, juicy organic blueberries. Our organic blueberries are grown without synthetic pesticides, resulting in berries that are both better for you and the environment. They're perfect for snacking, baking, or adding to your morning oatmeal.",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=1000&auto=format&fit=crop",
        category: "fruits",
        stock: 20,
        unit: "pint",
        organic: true,
        created_at: null,
        updated_at: null
      },
      {
        id: generateDeterministicUUID("prod20"),
        name: "Fresh Mint",
        description: "Refreshing and aromatic mint leaves. Mint adds a refreshing finish to desserts, beverages, and savory dishes alike. It's perfect for making teas, mojitos, and adding to Mediterranean and Middle Eastern cuisine.",
        price: 1.99,
        image: "https://images.unsplash.com/photo-1628468615047-c70ef9e36fca?q=80&w=1000&auto=format&fit=crop",
        category: "herbs",
        stock: 30,
        unit: "bunch",
        organic: false,
        created_at: null,
        updated_at: null
      }
    ];
    
    console.log("Seeding database with Supabase products");
    const addedProducts = await addProductsToDatabase(supabaseProducts);
    
    // If no products were added (which means they all already exist), 
    // try adding the additional products
    if (addedProducts.length === 0) {
      console.log("No new Supabase products added, trying additional products");
      return await addProductsToDatabase(additionalProducts);
    }
    
    return addedProducts;
  } catch (error) {
    console.error('Error seeding database:', error);
    return [];
  }
};
