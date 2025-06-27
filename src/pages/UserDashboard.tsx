
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { QrCode, Wallet, Shield, User, Bell } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [walletBalance] = useState(450.75);
  const [dailyLimit] = useState(50);
  const [todaySpent] = useState(36);
  const [qrFrozen, setQrFrozen] = useState(false);

  const vendors = [
    { name: "Taxi Services", spent: 24, limit: 30 },
    { name: "Spaza Shop", spent: 12, limit: 20 },
    { name: "Street Food", spent: 0, limit: 15 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PaperPay+</h1>
                <p className="text-sm text-gray-600">Customer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-6 h-6 text-gray-400" />
              <User className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 mb-1">Wallet Balance</p>
                <h2 className="text-3xl font-bold">R {walletBalance.toFixed(2)}</h2>
              </div>
              <Wallet className="w-12 h-12 text-orange-200" />
            </div>
            <div className="mt-4 pt-4 border-t border-orange-400">
              <div className="flex justify-between text-sm">
                <span className="text-orange-100">Daily Limit: R {dailyLimit}</span>
                <span className="text-orange-100">Spent Today: R {todaySpent}</span>
              </div>
              <div className="mt-2 bg-orange-400 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(todaySpent / dailyLimit) * 100}%` }}
                />
              </div>
              <p className="text-sm text-orange-100 mt-1">
                R {dailyLimit - todaySpent} remaining today
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Management */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-gray-900">Your QR Code</span>
              <Badge variant={qrFrozen ? "destructive" : "default"}>
                {qrFrozen ? "Frozen" : "Active"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {qrFrozen ? "QR Code is frozen for security" : "Your payment QR code"}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                onClick={() => setQrFrozen(!qrFrozen)}
              >
                <Shield className="w-4 h-4 mr-2" />
                {qrFrozen ? "Unfreeze QR" : "Freeze QR"}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Replace QR
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Spending Limits */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Vendor Spending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vendors.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${(vendor.spent / vendor.limit) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      R{vendor.spent}/R{vendor.limit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white py-6"
            onClick={() => navigate('/wallet-setup')}
          >
            <Wallet className="w-5 h-5 mr-2" />
            Manage Wallet
          </Button>
          <Button 
            variant="outline" 
            className="border-orange-300 text-orange-600 hover:bg-orange-50 py-6"
          >
            Transaction History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
