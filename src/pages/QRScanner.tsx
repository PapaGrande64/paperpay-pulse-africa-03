
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, QrCode, User, DollarSign, CheckCircle } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const QRScanner = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Enter payment pointer, 2: Customer info, 3: Payment amount, 4: Success
  const [paymentPointer, setPaymentPointer] = useState('');
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchCustomer = async () => {
    if (!paymentPointer.trim()) {
      toast({
        title: "Error",
        description: "Please enter a payment pointer",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Find customer by payment pointer
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select(`
          *,
          user:users(*)
        `)
        .eq('payment_pointer', paymentPointer)
        .single();

      if (walletError || !walletData) {
        toast({
          title: "Customer Not Found",
          description: "No customer found with this payment pointer",
          variant: "destructive",
        });
        return;
      }

      if (walletData.user.role !== 'customer') {
        toast({
          title: "Invalid Account",
          description: "This payment pointer belongs to a vendor account",
          variant: "destructive",
        });
        return;
      }

      setCustomerInfo({
        wallet: walletData,
        user: walletData.user
      });
      setStep(2);
    } catch (error: any) {
      console.error('Error finding customer:', error);
      toast({
        title: "Error",
        description: "Failed to find customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const paymentAmount = parseFloat(amount);
    
    // Check if customer has sufficient balance
    if (customerInfo.wallet.balance < paymentAmount) {
      toast({
        title: "Insufficient Funds",
        description: "Customer does not have sufficient balance",
        variant: "destructive",
      });
      return;
    }

    // Check daily limit
    const remainingLimit = customerInfo.wallet.daily_limit - customerInfo.wallet.daily_spent;
    if (paymentAmount > remainingLimit) {
      toast({
        title: "Daily Limit Exceeded",
        description: `Payment exceeds daily spending limit. Remaining: R${remainingLimit.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          vendor_id: profile?.id,
          customer_id: customerInfo.user.id,
          amount: paymentAmount,
          description: `Payment to ${profile?.name}`,
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Payment Successful!",
        description: `Received R${paymentAmount.toFixed(2)} from ${customerInfo.user.name}`,
      });

      setStep(4);
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>Scan Customer QR</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Position QR code within the frame</p>
              </div>
              
              <div className="text-center text-gray-500">
                <p className="text-sm">Or enter payment pointer manually</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-pointer">Payment Pointer</Label>
                <Input
                  id="payment-pointer"
                  placeholder="$ilp.interledger-test.dev/customer-name"
                  value={paymentPointer}
                  onChange={(e) => setPaymentPointer(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSearchCustomer}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Searching...' : 'Find Customer'}
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Customer Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{customerInfo.user.name}</h3>
                <p className="text-sm text-gray-600 font-mono">{customerInfo.wallet.payment_pointer}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Balance:</span>
                  <span className="font-semibold">R {customerInfo.wallet.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Limit:</span>
                  <span className="font-semibold">R {customerInfo.wallet.daily_limit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Today:</span>
                  <span className="font-semibold">R {(customerInfo.wallet.daily_limit - customerInfo.wallet.daily_spent).toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => setStep(3)}
                className="w-full"
              >
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Enter Amount</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Charging:</p>
                <p className="font-semibold">{customerInfo.user.name}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (R)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl text-center"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 50, 100, 200, 500].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset.toString())}
                  >
                    R{preset}
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleProcessPayment}
                disabled={loading || !amount}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {loading ? 'Processing...' : `Charge R${amount || '0.00'}`}
              </Button>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">
                You have received R{amount} from {customerInfo.user.name}
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setStep(1);
                    setPaymentPointer('');
                    setCustomerInfo(null);
                    setAmount('');
                  }}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  New Transaction
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/app')}
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">QR Scanner</h1>
              <p className="text-sm text-gray-600">Process customer payment</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {renderStep()}
      </div>
    </div>
  );
};

export default QRScanner;
