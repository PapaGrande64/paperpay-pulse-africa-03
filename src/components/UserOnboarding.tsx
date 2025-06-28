
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, User, User2 } from "lucide-react";

interface UserOnboardingProps {
  onComplete: () => void;
}

const UserOnboarding = ({ onComplete }: UserOnboardingProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [paymentPointer, setPaymentPointer] = useState('');
  const [balance, setBalance] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: crypto.randomUUID(),
          clerk_id: user.id,
          name: user.fullName || user.emailAddresses[0]?.emailAddress || 'User',
          role,
          payment_pointer: paymentPointer,
          balance: parseFloat(balance) || 0,
          daily_limit: parseFloat(dailyLimit) || 0,
        });

      if (error) throw error;

      toast({
        title: "Profile Created!",
        description: "Your PaperPay+ profile has been set up successfully.",
      });
      
      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-orange-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Welcome to PaperPay+!</CardTitle>
            <p className="text-gray-600">Let's set up your account</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium text-gray-900 mb-4 block">
                What's your role?
              </Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as 'customer' | 'vendor')}>
                <div className="flex items-center space-x-3 p-4 border border-orange-200 rounded-lg hover:bg-orange-50">
                  <RadioGroupItem value="customer" />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <Label className="font-medium">Customer</Label>
                      <p className="text-sm text-gray-600">I want to pay with my QR card</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-orange-200 rounded-lg hover:bg-orange-50">
                  <RadioGroupItem value="vendor" />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <Label className="font-medium">Vendor</Label>
                      <p className="text-sm text-gray-600">I want to accept payments</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-orange-200">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Setup Your Wallet</CardTitle>
          <p className="text-gray-600">Configure your Interledger payment details</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="payment-pointer" className="text-gray-700">
              Interledger Payment Pointer
            </Label>
            <Input
              id="payment-pointer"
              placeholder="$ilp.interledger-test.dev/your-name"
              value={paymentPointer}
              onChange={(e) => setPaymentPointer(e.target.value)}
              className="mt-1 border-orange-200 focus:border-orange-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your unique payment identifier (starts with $)
            </p>
          </div>

          <div>
            <Label htmlFor="balance" className="text-gray-700">
              Current Wallet Balance (R)
            </Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="mt-1 border-orange-200 focus:border-orange-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your current wallet balance manually
            </p>
          </div>

          <div>
            <Label htmlFor="daily-limit" className="text-gray-700">
              Daily Spending Limit (R)
            </Label>
            <Input
              id="daily-limit"
              type="number"
              step="0.01"
              placeholder="500.00"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="mt-1 border-orange-200 focus:border-orange-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set your daily spending limit
            </p>
          </div>

          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Back
            </Button>
            <Button 
              onClick={handleSaveProfile}
              disabled={!paymentPointer || loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOnboarding;
