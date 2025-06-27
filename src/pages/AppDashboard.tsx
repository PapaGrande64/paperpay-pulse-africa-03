
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { QrCode, User, User2, Shield, ArrowLeft } from "lucide-react";

const AppDashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'vendor' | null>(null);

  // Temporarily bypass authentication for development
  const isAuthenticated = true; // Changed from false to true

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PaperPay+ App</h1>
            <p className="text-gray-600">Secure access to your payment system</p>
          </div>

          <Card className="border-orange-200 mb-6">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please sign in to access your secure PaperPay+ dashboard
              </p>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => navigate('/login')}
              >
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
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

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">How are you using PaperPay+ today?</p>
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
                    <h3 className="font-semibold text-gray-900">Customer Dashboard</h3>
                    <p className="text-sm text-gray-600">Manage QR codes and spending limits</p>
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
                    <h3 className="font-semibold text-gray-900">Vendor Dashboard</h3>
                    <p className="text-sm text-gray-600">scan QR codes and manage payments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to appropriate dashboard
  if (userType === 'customer') {
    navigate('/user-dashboard');
  } else {
    navigate('/vendor-dashboard');
  }

  return null;
};

export default AppDashboard;
