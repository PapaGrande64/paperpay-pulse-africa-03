
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { QrCode, Wallet, Shield, User, Bell, History, RefreshCw, Copy, Eye, EyeOff } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [walletBalance] = useState(450.75);
  const [dailyLimit] = useState(50);
  const [todaySpent] = useState(36);
  const [activeQRIndex] = useState(0);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrFrozen, setQrFrozen] = useState(false);

  // Simulate 8 QR codes (in real app, these would be generated server-side)
  const qrCodes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    code: `QR-${String(i + 1).padStart(2, '0')}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    isActive: i === activeQRIndex,
    isUsed: i < activeQRIndex
  }));

  const recentTransactions = [
    { id: 1, vendor: "Taxi Services", amount: -24, time: "2 hours ago", status: "completed" },
    { id: 2, vendor: "Spaza Shop", amount: -12, time: "4 hours ago", status: "completed" },
    { id: 3, vendor: "Street Food", amount: -8, time: "Yesterday", status: "completed" },
    { id: 4, vendor: "Taxi Services", amount: -22, time: "Yesterday", status: "completed" },
  ];

  const trustedVendors = [
    { name: "Taxi Services", spent: 24, limit: 30, status: "active" },
    { name: "Spaza Shop", spent: 12, limit: 20, status: "active" },
    { name: "Street Food", spent: 0, limit: 15, status: "active" },
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

        {/* Active QR Code Management */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-gray-900">Active QR Code</span>
              <div className="flex items-center space-x-2">
                <Badge variant={qrFrozen ? "destructive" : "default"}>
                  {qrFrozen ? "Frozen" : "Active"}
                </Badge>
                <Badge variant="outline">
                  Code {activeQRIndex + 1}/8
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-mono">
                {qrFrozen ? "QR Code is frozen for security" : qrCodes[activeQRIndex]?.code}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                onClick={() => setQrFrozen(!qrFrozen)}
              >
                <Shield className="w-4 h-4 mr-2" />
                {qrFrozen ? "Unfreeze QR" : "Freeze QR"}
              </Button>
              <Button 
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
              >
                {showBackupCodes ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showBackupCodes ? "Hide" : "Show"} Backups
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup QR Codes */}
        {showBackupCodes && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Backup QR Codes</CardTitle>
              <p className="text-sm text-gray-600">
                Use these backup codes if your primary QR is lost or stolen
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {qrCodes.slice(1).map((qr) => (
                  <div 
                    key={qr.id}
                    className={`p-3 rounded-lg border text-center ${
                      qr.isUsed 
                        ? 'bg-gray-100 border-gray-200 text-gray-500' 
                        : 'bg-orange-50 border-orange-200 text-orange-800'
                    }`}
                  >
                    <p className="text-xs font-mono">{qr.code}</p>
                    <p className="text-xs mt-1">
                      {qr.isUsed ? 'Used' : 'Available'}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Backup Codes
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset All Codes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trusted Vendors */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Trusted Vendors</CardTitle>
            <p className="text-sm text-gray-600">
              Pre-approved vendors where you can use your QR code
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {trustedVendors.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {vendor.status}
                    </Badge>
                  </div>
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

        {/* Transaction History */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-gray-900">Recent Transactions</span>
              <Button 
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <History className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.vendor}</p>
                      <p className="text-sm text-gray-600">{transaction.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">R {Math.abs(transaction.amount).toFixed(2)}</p>
                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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
            <History className="w-5 h-5 mr-2" />
            Full History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
