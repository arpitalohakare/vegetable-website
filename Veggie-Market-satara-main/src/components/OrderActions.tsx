
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { RefreshCw, Package, X } from 'lucide-react';

interface OrderActionsProps {
  orderId: string;
  orderStatus: string;
  onStatusChange: () => void;
}

const OrderActions = ({ orderId, orderStatus, onStatusChange }: OrderActionsProps) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin
  React.useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdmin();
  }, [user?.id]);
  
  const handleCancelOrder = async () => {
    try {
      setIsUpdating(true);
      
      console.log("Cancelling order with ID:", orderId);
      
      // Check if the order ID is valid
      if (!orderId || typeof orderId !== 'string') {
        throw new Error('Invalid order ID');
      }
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Order has been cancelled');
      onStatusChange();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      
      if (!orderId || typeof orderId !== 'string') {
        throw new Error('Invalid order ID');
      }
      
      // Log more details for debugging
      console.log('Order ID:', orderId);
      console.log('New status:', newStatus);
      
      // Make sure we're using the correct type for the status column
      if (typeof newStatus !== 'string') {
        throw new Error('Invalid status value type');
      }
      
      // Make the update request with explicit type safety
      const updateResponse = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select();
      
      console.log('Update response:', updateResponse);
      
      if (updateResponse.error) {
        console.error('Supabase error:', updateResponse.error);
        throw updateResponse.error;
      }
      
      toast.success(`Order status updated to ${newStatus}`);
      onStatusChange();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update status: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
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
  
  const canCancel = orderStatus !== 'cancelled' && orderStatus !== 'completed';
  
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge className={getStatusBadgeColor(orderStatus)}>
            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
          </Badge>
        </div>
        
        {isAdmin && (
          <div className="flex items-center">
            <Select
              disabled={isUpdating}
              defaultValue={orderStatus}
              onValueChange={handleUpdateStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {isUpdating && <RefreshCw className="ml-2 h-4 w-4 animate-spin" />}
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        {canCancel && !isAdmin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel Order
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this order? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep order</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelOrder}>
                  Yes, cancel order
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/products')}
        >
          Shop More
        </Button>
      </div>
    </div>
  );
};

export default OrderActions;
