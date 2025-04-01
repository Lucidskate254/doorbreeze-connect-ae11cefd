
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Vibration feedback for error
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  }, [location.pathname]);

  // Function to determine if we should redirect to a specific page
  const getRedirectInfo = () => {
    const path = location.pathname.toLowerCase();
    
    if (path.includes('notification') && path.includes('preferences')) {
      return {
        title: "Notification Preferences",
        description: "This page will be available soon. You can manage your notification settings here.",
        redirectPath: "/notifications"
      };
    }
    
    return null;
  };

  const redirectInfo = getRedirectInfo();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2"></div>
        <CardContent className="p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-blue-600">404</h1>
            <p className="text-xl text-gray-700 mb-6">
              {redirectInfo ? redirectInfo.title : "Oops! Page not found"}
            </p>
            <p className="text-gray-500 mb-8">
              {redirectInfo ? redirectInfo.description : "The page you're looking for doesn't exist or has been moved."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Go Back
              </Button>
              
              <Button 
                onClick={() => navigate(redirectInfo ? redirectInfo.redirectPath : "/dashboard")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Home size={16} />
                {redirectInfo ? "Go to Notifications" : "Go to Dashboard"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
