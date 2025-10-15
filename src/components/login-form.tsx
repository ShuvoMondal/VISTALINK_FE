import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useLoginMutation } from "@/api/services";
import { useNavigate } from "@tanstack/react-router";
import { PasswordInput } from "@/components/password-input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          // The useLoginMutation already handles token storage in sessionStorage
          
          // Redirect to dashboard after successful login
          navigate({ to: '/dashboard' });
        },
        onError: (error) => {
          console.error('Login failed:', error);
          // You might want to show an error message to the user here
        }
      }
    );
  };

  return (
    <form 
      className={cn("flex flex-col gap-6 p-8", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground text-base text-balance">
          Please enter your username and password to login
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username" className="text-left">Username</Label>
          <Input 
            id="username" 
            type="text" 
            placeholder="Enter your username" 
            required 
            className="h-12"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-left">Password</Label>
            <a
              href="#"
              className="text-sm underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <PasswordInput
            id="password"
            required
            className="h-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 text-lg"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
        </Button>
        {loginMutation.isError && (
          <div className="text-red-500 text-center text-sm">
            Login failed. Please check your credentials and try again.
          </div>
        )}
      </div>
      <div className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <a href="#" className="font-medium text-primary hover:underline">
          Sign up
        </a>
      </div>
    </form>
  )
}
