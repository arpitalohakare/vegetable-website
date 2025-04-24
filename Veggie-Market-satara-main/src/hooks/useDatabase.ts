
import { Database } from '@/integrations/supabase/types';

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

// Define specific table row types
export type ProductRow = Tables['products']['Row'];
export type OrderRow = Tables['orders']['Row'];
export type OrderItemRow = Tables['order_items']['Row'];
export type ProfileRow = Tables['profiles']['Row'];

// This type helps ensure we only use valid table names
export function isValidTable(tableName: string): tableName is TableName {
  const validTables: TableName[] = ['products', 'orders', 'order_items', 'profiles'];
  return validTables.includes(tableName as TableName);
}

// Helper for getting the correct row type based on table name
export type TableRow<T extends TableName> = Tables[T]['Row'];

// Convert any database errors to a more usable format
export function handleDatabaseError(error: any): string {
  if (typeof error === 'object' && error !== null) {
    if ('message' in error) return error.message;
    if ('error' in error) return error.error;
  }
  return 'Unknown database error';
}

// Safe cast for database rows with fallback to empty object
export function safeCast<T>(data: any): T {
  if (!data) return {} as T;
  return data as T;
}
