
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { QrCode, Check, ArrowLeft } from "lucide-react";

const QRScanner = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'scan' | 'amount' | 'confirm' | 'success'>('scan');
  const [amount, setAmount] = useState('');
  const [customerInfo] = useState({
    id: "Customer #1234",
    remainingLimit: 14.00,
    dailyLimit: 50.00
  });

  const handleScanComplete = () => {
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    if (amount && parseFloat(amount) > 0) {
      setStep('confirm');
    }
  };

  const handlePaymentConfirm = () => {
    setStep('success');
    setTimeout(() => {
      navigate('/vendor-dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/vendor-dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QR Scanner</h1>
                <p className="text-sm text-gray-600">Accept Payment</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4">
        {step === 'scan' && (
          <Card className="border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-gray-900">Scan Customer QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <div className="w-48 h-48 bg-white border-4 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Position customer's QR code within the frame
                </p>
              </div>
              
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                onClick={handleScanComplete}
              >
                Simulate QR Scan
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                Camera access required for QR scanning
              </p>
            </CardContent>
          </Card>
        )}

        {step === 'amount' && (
          <Card className="border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-gray-900">Enter Payment Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Customer: {customerInfo.id}</p>
                <p className="text-sm text-gray-600">
                  Remaining Daily Limit: R {customerInfo.remainingLimit.toFixed(2)}
                </p>
              </div>
              
              <div>
                <Label htmlFor="amount" className="text-gray-700">Amount (ZAR)</Label>
                <Input 
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 text-2xl text-center border-green-200 focus:border-green-400"
                  step="0.01"
                  min="0"
                  max={customerInfo.remainingLimit}
                />
              </div>
              
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > customerInfo.remainingLimit}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'confirm' && (
          <Card className="border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-gray-900">Confirm Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{customerInfo.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-2xl text-green-600">R {parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining Limit:</span>
                  <span>R {(customerInfo.remainingLimit - parseFloat(amount)).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                  onClick={handlePaymentConfirm}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Confirm Payment
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-green-300 text-green-600 hover:bg-green-50"
                  onClick={() => setStep('amount')}
                >
                  Change Amount
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card className="border-green-200">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">R {parseFloat(amount).toFixed(2)} received</p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  Payment processed via Interledger Protocol
                </p>
              </div>
              
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                onClick={() => navigate('/vendor-dashboard')}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
