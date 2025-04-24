# Veggie Market E-commerce Platform

![Veggie Market](public/lovable-uploads/50d19bda-bf96-4d17-b05e-116f98216719.png)

A modern e-commerce platform for selling organic produce and groceries, built with React, TypeScript, Tailwind CSS, and Supabase.

## Recent Updates

### Product Catalog Expansion
- **Dairy Product Line Added**: 
  - 10 new dairy products introduced
  - Categories include:
    - Milk (organic and regular)
    - Cheeses (Cheddar, Mozzarella, Paneer)
    - Dairy Specials (Ghee, Butter, Cream)
    - Yogurt and Curd variants

### Navigation Improvements
- Enhanced product filtering
- Improved category-based navigation
- URL-based category filtering for seamless browsing

## Features

- **User Authentication**: Secure login and registration system
- **Product Catalog**: Browse and search products with filtering capabilities
- **Shopping Cart**: Add products to cart and manage quantities
- **Checkout Process**: Complete purchase with shipping and payment information
- **Order Management**: Track order status and history
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Works seamlessly on all devices

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (based on Radix UI)
- **State Management**: React Context API
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Development**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Toast Notifications**: Sonner

## Prerequisites

- Node.js (>= 16.x)
- npm or bun

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd veggie-market
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
veggie-market/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Base UI components (shadcn/ui)
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Third-party service integrations
│   │   └── supabase/    # Supabase client and types
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── services/        # API service modules
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
└── supabase/            # Supabase configuration
```

## Key Dependencies

This project uses the following key dependencies:

- **@hookform/resolvers**: Form validation resolvers (^3.9.0)
- **@radix-ui/react-***: UI primitive components 
- **@supabase/supabase-js**: Supabase JavaScript client (^2.49.1)
- **@tanstack/react-query**: Data fetching and state management (^5.56.2)
- **class-variance-authority**: Utility for creating variant classes (^0.7.1)
- **clsx**: Utility for conditional classes (^2.1.1)
- **lucide-react**: Icon library (^0.462.0)
- **react-hook-form**: Form state management (^7.53.0)
- **react-router-dom**: Routing (^6.26.2)
- **sonner**: Toast notifications (^1.5.0)
- **tailwind-merge**: Utility for merging Tailwind classes (^2.5.2)
- **zod**: Schema validation (^3.23.8)

## Database Structure

The application uses Supabase with the following tables:

- **products**: Store product information
- **orders**: Track customer orders
- **order_items**: Link products to orders
- **profiles**: User profiles and preferences

## User Roles and Permissions

- **Admin**: Can manage products, update order statuses, and view all users
- **Customer**: Can browse products, place orders, and view order history

## Admin Features

Administrators can:
- Add, edit, and delete products
- Update order statuses
- View user information
- Track revenue and sales

## Development Workflow

1. **Authentication Flow**:
   - Users register or login
   - Authenticated state is maintained via Supabase Auth
   
2. **Shopping Flow**:
   - Browse products
   - Add items to cart
   - Proceed to checkout
   - Enter shipping and payment details
   - Complete order
   
3. **Admin Flow**:
   - Access admin dashboard
   - Manage products (add, edit, delete)
   - Update order statuses
   - View user data and analytics

## Common Issues and Solutions

### Order Status Updates

If you encounter issues with order status updates:
- Make sure you're logged in as an admin
- Check console for any error messages
- Ensure the Supabase connection is working

### User Authentication

- Logout and login again if you experience permission issues
- Clear browser cache if auth state becomes inconsistent

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
