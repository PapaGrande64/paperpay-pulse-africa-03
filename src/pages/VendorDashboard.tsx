
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { QrCode, Wallet, User, Bell, Search } from "lucide-react";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [todayEarnings] = useState(342.50);
  const [monthEarnings] = useState(8750.25);
  const [transactionCount] = useState(24);

  const recentTransactions = [
    { id: 1, amount: 24, customer: "Customer #1234", time: "2 mins ago", status: "completed" },
    { id: 2, amount: 45, customer: "Customer #5678", time: "15 mins ago", status: "completed" },
    { id: 3, amount: 12, customer: "Customer #9012", time: "1 hour ago", status: "completed" },
    { id: 4, amount: 18, customer: "Customer #3456", time: "2 hours ago", status: "completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PaperPay+</h1>
                <p className="text-sm text-gray-600">Vendor Dashboard</p>
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
        {/* Earnings Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Today's Earnings</p>
                  <h2 className="text-2xl font-bold">R {todayEarnings.toFixed(2)}</h2>
                </div>
                <Wallet className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">This Month</p>
                  <h2 className="text-2xl font-bold text-gray-900">R {monthEarnings.toFixed(2)}</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Transactions</p>
                  <h2 className="text-2xl font-bold text-gray-900">{transactionCount}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan QR Button */}
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Accept Payment</h3>
            <p className="text-gray-600 mb-6">Scan customer's QR code to receive payment</p>
            <Button 
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg"
              onClick={() => navigate('/qr-scanner')}
            >
              <QrCode className="w-6 h-6 mr-2" />
              Scan QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">R {transaction.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{transaction.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {transaction.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="border-green-300 text-green-600 hover:bg-green-50 py-6"
          >
            View All Transactions
          </Button>
          <Button 
            variant="outline" 
            className="border-green-300 text-green-600 hover:bg-green-50 py-6"
            onClick={() => navigate('/wallet-setup')}
          >
            <Wallet className="w-5 h-5 mr-2" />
            Withdraw Funds
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
