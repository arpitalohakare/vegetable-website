
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 animate-fade-in">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">Page not found</p>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
