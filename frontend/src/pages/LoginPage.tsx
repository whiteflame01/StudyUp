import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, BookOpen, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      toast({
        title: "Session resumed!",
        description: "Welcome back. Let's find your study matches.",
      });
      navigate('/app/feed');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 p-4">
      <div className="w-full max-w-lg">
        {/* Header with Privacy Focus */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
            Resume Your Session
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-2">
            Sign in to continue your anonymous learning journey
          </p>
        </div>

        <Card className="shadow-xl border-2 border-blue-100">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-lg sm:text-xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-sm">
              Enter your credentials to access your session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">
            {/* Privacy Reminder */}
            <Alert className="bg-purple-50 border-purple-200">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-xs sm:text-sm text-purple-900">
                Your identity remains anonymous. We only use your email to restore your session and match history.
              </AlertDescription>
            </Alert>


            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-11 ${errors.email ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 h-11 ${errors.password ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 sm:h-12 text-base font-semibold shadow-lg hover:shadow-xl" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Resume Session
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials - Updated styling */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Try Demo Session:
              </p>
              <div className="space-y-1 text-blue-700 font-mono text-xs sm:text-sm">
                <p><span className="text-blue-500">Email:</span> demo@studyup.com</p>
                <p><span className="text-blue-500">Password:</span> Demo123!</p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                Start anonymous session
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs text-muted-foreground px-2">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}