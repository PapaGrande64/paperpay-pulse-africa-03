
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { QrCode, Shield, ArrowLeft } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/hooks/useAuth";
import UserOnboarding from "@/components/UserOnboarding";
import { useEffect } from "react";

const AppDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, needsOnboarding, refreshProfile } = useUserProfile();

  const handleOnboardingComplete = () => {
    refreshProfile();
  };

  // Handle navigation based on profile role
  useEffect(() => {
    if (profile && !loading && !needsOnboarding) {
      if (profile.role === 'customer') {
        navigate('/user-dashboard');
      } else if (profile.role === 'vendor') {
        navigate('/vendor-dashboard');
      }
    }
  }, [profile, loading, needsOnboarding, navigate]);

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!user) {
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

  // Show different states based on profile loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return <UserOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      <p className="text-gray-600">Something went wrong. Please try again.</p>
    </div>
  );
};

export default AppDashboard;
