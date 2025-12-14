import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Lock, Shield, Fingerprint, AlertCircle, Check, X, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const failedRequirements = passwordRequirements.filter(req => !req.test(formData.password));
      if (failedRequirements.length > 0) {
        newErrors.password = 'Password does not meet requirements';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Register with email and password only - no name needed
      await register(formData.email, formData.password, 'Anonymous User');
      toast({
        title: "Session started!",
        description: "You're now anonymous. Start exploring and we'll find your matches.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
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
            Start Your Anonymous Session
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-2">
            No names. No profiles. Just pure learning behavior.
          </p>
        </div>

        <Card className="shadow-xl border-2 border-blue-100">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-lg sm:text-xl text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center text-sm">
              We only need login credentials — your identity stays anonymous
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">
            {/* Privacy Notice */}
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs sm:text-sm text-blue-900">
                <strong>Your Privacy Guarantee:</strong> Your email is only used for logging back in. 
                It will <span className="font-semibold underline">never</span> be shared with other users or third parties. 
                You will appear as an anonymous ID (e.g., "User_8492") to everyone.
              </AlertDescription>
            </Alert>

            {/* Registration Form */}
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
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Only for authentication — never visible to others
                </p>
                {errors.email && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setShowPasswordRequirements(true)}
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
                
                {/* Password Requirements */}
                {showPasswordRequirements && formData.password && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">Password requirements:</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {passwordRequirements.map((req, index) => {
                        const isValid = req.test(formData.password);
                        return (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {isValid ? (
                              <Check className="h-3 w-3 text-green-600 shrink-0" />
                            ) : (
                              <X className="h-3 w-3 text-gray-400 shrink-0" />
                            )}
                            <span className={isValid ? 'text-green-600 font-medium' : 'text-gray-500'}>
                              {req.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`pl-10 pr-10 h-11 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.confirmPassword}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* What Happens Next */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                    <Fingerprint className="h-4 w-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">What happens next?</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Once you sign up, our AI observes what you study and how you learn. 
                      Within minutes, we'll match you with peers who have a 95%+ Similarity Score with your current session.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 sm:h-12 text-base font-semibold shadow-lg hover:shadow-xl" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Starting session...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Anonymous Session
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Features */}
        <div className="mt-6 sm:mt-8 grid sm:grid-cols-3 gap-3 sm:gap-4 px-2">
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <Shield className="h-5 w-5 text-blue-600 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-gray-900">Zero Identity</p>
            <p className="text-xs text-gray-500">Anonymous to everyone</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <Lock className="h-5 w-5 text-purple-600 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-gray-900">No Sharing</p>
            <p className="text-xs text-gray-500">Email never visible</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <Fingerprint className="h-5 w-5 text-green-600 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-gray-900">Behavior Only</p>
            <p className="text-xs text-gray-500">Matched by actions</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs text-muted-foreground px-2">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}