import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a href="/" className="inline-block">
          <button className="px-6 py-3 bg-gradient-primary text-white rounded-lg shadow-glow hover:opacity-90 transition-opacity">
            Return to Home
          </button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
