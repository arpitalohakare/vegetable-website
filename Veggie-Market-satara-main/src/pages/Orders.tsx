
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserOrders } from '@/hooks/useSupabaseData';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { 
  Package as PackageIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CreditCard as CreditCardIcon,
  Truck as TruckIcon
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import OrderActions from '@/components/OrderActions';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const { orders, loading, error, refetchOrders } = useUserOrders();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Orders</CardTitle>
            <CardDescription>
              There was a problem loading your orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">
          View and track all your orders
        </p>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <PackageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
              <p className="text-muted-foreground">
                You haven't placed any orders yet.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/products')}
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-2">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <CardDescription className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Order placed: {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                      <CardTitle className="text-lg mt-1">
                        Order #{order.id.substring(0, 8)}
                      </CardTitle>
                    </div>
                    <div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground">Items</h3>
                      <div className="space-y-4">
                        {order.items && order.items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                              {item.products?.image ? (
                                <img 
                                  src={item.products.image} 
                                  alt={item.products.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-muted">
                                  <PackageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.products?.name}</h4>
                              <p className="text-muted-foreground text-sm">
                                Quantity: {item.quantity} × {formatCurrency(Number(item.price))}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-full lg:w-64 space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground">Order Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping Address:</span>
                        </div>
                        <p className="text-sm">
                          {order.street}, {order.city}, {order.state} {order.zip_code}, {order.country}
                        </p>
                        
                        <div className="flex justify-between mt-4">
                          <span className="text-muted-foreground">Payment Method:</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CreditCardIcon className="h-4 w-4" />
                          {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>{formatCurrency(Number(order.total))}</span>
                        </div>
                        
                        <div className="pt-4">
                          <OrderActions 
                            orderId={order.id}
                            orderStatus={order.status}
                            onStatusChange={refetchOrders}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
