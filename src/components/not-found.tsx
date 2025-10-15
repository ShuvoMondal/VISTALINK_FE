import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
        </div>
        <p className="text-muted-foreground max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button 
            onClick={() => navigate({ to: '/' })} 
            className="w-full max-w-xs"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}