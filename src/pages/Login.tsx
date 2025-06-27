import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { QrCode, User, User2, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'vendor' | null>(null);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | null>(null);

  const handleLogin = () => {
    // In a real app, this would integrate with Clerk and then redirect to app
    navigate('/app');
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join PaperPay+</h1>
            <p className="text-gray-600">Choose how you'll use PaperPay+</p>
          </div>

          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-orange-200 hover:border-orange-400"
              onClick={() => setUserType('customer')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">I'm a Customer</h3>
                    <p className="text-sm text-gray-600">I want to make payments with my QR card</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-orange-200 hover:border-orange-400"
              onClick={() => setUserType('vendor')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <User2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">I'm a Vendor</h3>
                    <p className="text-sm text-gray-600">I want to accept payments by scanning QR codes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Landing Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!authMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">
              {userType === 'customer' ? 'Customer' : 'Vendor'} Login
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
              onClick={() => setAuthMethod('email')}
            >
              Continue with Email
            </Button>
            <Button 
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 py-3"
              onClick={() => setAuthMethod('phone')}
            >
              Continue with Phone
            </Button>
          </div>

          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setUserType(null)}
              className="text-gray-500"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-orange-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-900">
            {authMethod === 'email' ? 'Email Login' : 'Phone Login'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="auth-input" className="text-gray-700">
              {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </Label>
            <Input 
              id="auth-input"
              type={authMethod === 'email' ? 'email' : 'tel'}
              placeholder={authMethod === 'email' ? 'your@email.com' : '+27 XX XXX XXXX'}
              className="mt-1 border-orange-200 focus:border-orange-400"
            />
          </div>
          
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
            onClick={handleLogin}
          >
            {authMethod === 'email' ? 'Send Magic Link' : 'Send OTP'}
          </Button>

          <div className="text-center space-y-2">
            <Button 
              variant="ghost" 
              onClick={() => setAuthMethod(null)}
              className="text-gray-500"
            >
              Try different method
            </Button>
            <p className="text-xs text-gray-500">
              Powered by Clerk for secure authentication
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
