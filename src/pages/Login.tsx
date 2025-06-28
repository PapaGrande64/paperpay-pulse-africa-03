
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Join PaperPay+' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
          </p>
        </div>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            {isSignUp ? (
              <SignUp 
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-orange-500 hover:bg-orange-600",
                    footerActionLink: "text-orange-600 hover:text-orange-700"
                  }
                }}
                fallbackRedirectUrl="/app"
                forceRedirectUrl="/app"
              />
            ) : (
              <SignIn 
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-orange-500 hover:bg-orange-600",
                    footerActionLink: "text-orange-600 hover:text-orange-700"
                  }
                }}
                fallbackRedirectUrl="/app"
                forceRedirectUrl="/app"
              />
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-600"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
