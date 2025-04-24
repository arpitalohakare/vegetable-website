
import { toast as sonnerToast } from "sonner";

// Define our own toast types to not rely on sonner's internal types
type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Custom toast function that maintains compatibility with both APIs
export const toast = {
  // Basic toast with default styling
  default: (message: string) => sonnerToast(message),
  
  // Success toast
  success: (message: string) => sonnerToast.success(message),
  
  // Error toast
  error: (message: string) => sonnerToast.error(message),
  
  // Warning toast
  warning: (message: string) => sonnerToast.warning(message),
  
  // Info toast
  info: (message: string) => sonnerToast.info(message),
  
  // Custom toast for compatibility with the object-style API
  custom: (props: ToastProps) => {
    if (props.variant === "destructive") {
      return sonnerToast.error(props.title || "", { description: props.description });
    }
    return sonnerToast(props.title || "", { description: props.description });
  }
};

// Hook to use toast (for compatibility)
export const useToast = () => {
  return {
    toast
  };
};
