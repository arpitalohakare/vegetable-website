import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Eye as EyeIcon,
  Pencil as PencilIcon,
  Trash2 as TrashIcon,
  Package as PackageIcon,
  MoreHorizontal as MoreHorizontalIcon
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import { useAdminData } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { Product, UserProfile } from '@/types';

interface AdminPageProps {}

const Admin: React.FC<AdminPageProps> = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const productSchema = z.object({
    name: z.string().min(2, { message: 'Product name is required' }),
    description: z.string().optional(),
    price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
    stock: z.coerce.number().min(0, { message: 'Stock must be a positive number' }),
    image: z.string().optional(),
    category: z.string().optional(),
    organic: z.boolean().optional(),
    unit: z.string().optional(),
  });

  type ProductFormValues = z.infer<typeof productSchema>;

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      category: '',
      organic: false,
      unit: '',
    },
  });

  const {
    products: productsData,
    productsLoading,
    productsError,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    
    orders,
    ordersLoading,
    ordersError,
    fetchOrders,
    updateOrderStatus,
    
    users,
    usersLoading,
    usersError,
    fetchUsers,
    
    revenue
  } = useAdminData();

  console.log("Admin page data:", { orders, users });

  const products = productsData as Product[];

  const handleAddProduct = () => {
    productForm.reset();
    setSelectedProductId(null);
    setIsProductDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    productForm.reset(product);
    setSelectedProductId(product.id);
    setIsProductEditOpen(true);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setIsDeleteConfirmationOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDeleteProduct = () => {
    setIsDeleteConfirmationOpen(false);
    setProductToDelete(null);
  };

  const onSubmitProduct = async (data: ProductFormValues) => {
    try {
      console.log("Submitting product data:", data);
      
      const productData = {
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        stock: Number(data.stock),
        image: data.image || '',
        category: data.category || '',
        organic: data.organic || false,
        unit: data.unit || ''
      };

      if (selectedProductId) {
        await updateProduct(selectedProductId, productData);
        toast.success('Product updated successfully!');
        setIsProductEditOpen(false);
      } else {
        console.log("Adding new product:", productData);
        const result = await addProduct(productData);
        console.log("Product added result:", result);
        toast.success('Product added successfully!');
        setIsProductDialogOpen(false);
      }
      
      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error('Failed to save product. Please try again.');
    }
  };

  const renderProductCard = (product: Product) => {
    return (
      <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="relative h-48 w-full bg-gray-200">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-100">
              <PackageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium truncate">{product.name}</h3>
          
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description || 'No description available'}
          </p>
          
          <div className="mt-3 flex items-center justify-between">
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
              {product.category || 'Uncategorized'}
            </span>
            <span className={`${product.organic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 text-xs rounded-full`}>
              {product.organic ? 'Organic' : 'Non-Organic'}
            </span>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600">
              {product.stock} in stock ({product.unit || 'item'})
            </span>
          </div>
          
          <div className="mt-4 flex justify-between gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1"
              onClick={() => handleEditProduct(product)}
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              className="flex-1"
              onClick={() => handleDeleteProduct(product.id)}
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderProductRow = (product: Product) => {
    return (
      <TableRow key={product.id}>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <PackageIcon className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
            <div className="font-medium">{product.name}</div>
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">{product.category || 'Uncategorized'}</TableCell>
        <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
        <TableCell className="text-right hidden md:table-cell">{product.stock}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  const handleViewOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setViewingOrderId(orderId);
      setSelectedOrderStatus(order.status);
      setIsOrderDetailOpen(true);
    }
  };

  const handleStatusUpdate = async () => {
    if (!viewingOrderId || !selectedOrderStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(viewingOrderId, selectedOrderStatus);
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage products, orders, and users
        </p>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="products" className="focus:outline-none">Products</TabsTrigger>
          <TabsTrigger value="orders" className="focus:outline-none">Orders</TabsTrigger>
          <TabsTrigger value="users" className="focus:outline-none">Users</TabsTrigger>
          <TabsTrigger value="revenue" className="focus:outline-none">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Products</CardTitle>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : productsError ? (
                <div className="text-center py-12">
                  <h3 className="mt-4 text-lg font-medium">Error</h3>
                  <p className="text-muted-foreground">{productsError}</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <PackageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No products yet</h3>
                  <p className="text-muted-foreground">
                    Add new products to start selling.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleAddProduct}
                  >
                    Add Product
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(renderProductCard)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage and view all orders</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : ordersError ? (
                <div className="text-center py-12">
                  <h3 className="mt-4 text-lg font-medium">Error</h3>
                  <p className="text-muted-foreground">{ordersError}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <PackageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Orders will appear here when customers place them.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>All recent orders.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>
                            {order.user?.name || 'Unknown User'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(Number(order.total))}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              className={
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewOrder(order.id)}
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage and view all users</CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : usersError ? (
                <div className="text-center py-12">
                  <h3 className="mt-4 text-lg font-medium">Error</h3>
                  <p className="text-muted-foreground">{usersError}</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <PackageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No users yet</h3>
                  <p className="text-muted-foreground">
                    New users will appear here when they register.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>All registered users.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Orders</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name || 'N/A'}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {user.email || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">{user.orderCount}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Overview of revenue statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(revenue.total)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(revenue.today)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(revenue.monthly)}</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product to sell in the store.
            </DialogDescription>
          </DialogHeader>
          <Form {...productForm}>
            <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
              <FormField
                control={productForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={productForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="Unit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={productForm.control}
                name="organic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Organic</FormLabel>
                      <FormDescription>
                        This product is certified organic.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isProductEditOpen} onOpenChange={setIsProductEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Edit the details of the selected product.
            </DialogDescription>
          </DialogHeader>
          <Form {...productForm}>
            <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
              <FormField
                control={productForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={productForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="Unit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={productForm.control}
                name="organic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Organic</FormLabel>
                      <FormDescription>
                        This product is certified organic.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Product</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={cancelDeleteProduct}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View and manage order information.
            </DialogDescription>
          </DialogHeader>
          
          {viewingOrderId && (
            <div className="space-y-6">
              {(() => {
                const order = orders.find(o => o.id === viewingOrderId);
                if (!order) return <p>Order not found</p>;
                
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-2">Order Information</h3>
                        <div className="space-y-1">
                          <p><span className="font-medium">Order ID:</span> #{order.id.substring(0, 8)}</p>
                          <p><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                          <p><span className="font-medium">Status:</span> {order.status}</p>
                          <p><span className="font-medium">Total:</span> {formatCurrency(Number(order.total))}</p>
                          <p><span className="font-medium">Payment Method:</span> {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-2">Customer Information</h3>
                        <div className="space-y-1">
                          <p><span className="font-medium">Name:</span> {order.user?.name || 'Unknown'}</p>
                          <p><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
                          <p><span className="font-medium">Address:</span> {order.street}</p>
                          <p><span className="font-medium">City:</span> {order.city}, {order.state} {order.zip_code}</p>
                          <p><span className="font-medium">Country:</span> {order.country}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">Order Items</h3>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Quantity</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items && order.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 bg-muted rounded-md overflow-hidden flex-shrink-0 mr-3">
                                      {item.products?.image ? (
                                        <img 
                                          src={item.products.image} 
                                          alt={item.products.name} 
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-muted">
                                          <PackageIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                      )}
                                    </div>
                                    {item.products?.name || 'Unknown Product'}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(Number(item.price))}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(Number(item.price) * item.quantity)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">Update Status</h3>
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={selectedOrderStatus} 
                          onValueChange={setSelectedOrderStatus}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={handleStatusUpdate} 
                          disabled={isUpdatingStatus || selectedOrderStatus === order.status}
                        >
                          {isUpdatingStatus ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </div>
                          ) : (
                            'Update Status'
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
