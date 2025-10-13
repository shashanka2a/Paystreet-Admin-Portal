import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, UserCheck, ArrowLeftRight, Wallet, TrendingUp, AlertTriangle } from 'lucide-react';

const kpiCards = [
  {
    title: 'Total Clients',
    value: '2,847',
    change: '+12.5%',
    icon: Users,
    gradient: 'from-[#6366F1] to-[#8B5CF6]',
  },
  {
    title: 'Pending KYCs',
    value: '47',
    change: '-8.3%',
    icon: UserCheck,
    gradient: 'from-[#8B5CF6] to-[#A855F7]',
  },
  {
    title: 'Total Transactions',
    value: '18,492',
    change: '+23.1%',
    icon: ArrowLeftRight,
    gradient: 'from-[#6366F1] to-[#8B5CF6]',
  },
  {
    title: 'Active Accounts',
    value: '2,456',
    change: '+5.2%',
    icon: Wallet,
    gradient: 'from-[#8B5CF6] to-[#A855F7]',
  },
];

const alerts = [
  {
    id: 1,
    title: 'High-risk transaction flagged',
    client: 'Acme Corp Ltd',
    status: 'flagged',
    time: '10 minutes ago',
  },
  {
    id: 2,
    title: 'KYC document expired',
    client: 'TechStart Inc',
    status: 'pending',
    time: '1 hour ago',
  },
  {
    id: 3,
    title: 'Multiple failed login attempts',
    client: 'GlobalTrade LLC',
    status: 'flagged',
    time: '2 hours ago',
  },
  {
    id: 4,
    title: 'Address verification completed',
    client: 'Innovate Solutions',
    status: 'resolved',
    time: '3 hours ago',
  },
];

const recentActivity = [
  { action: 'KYC Approved', client: 'Quantum Ventures', admin: 'Sarah M.', time: '5 min ago' },
  { action: 'Account Suspended', client: 'Delta Trading', admin: 'Mike R.', time: '12 min ago' },
  { action: 'Transaction Flagged', client: 'Nexus Corp', admin: 'System', time: '18 min ago' },
  { action: 'Document Uploaded', client: 'Prime Capital', admin: 'Lisa K.', time: '25 min ago' },
];

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, here's your compliance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient}`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-gray-600">{kpi.title}</CardTitle>
                <Icon className="w-5 h-5 text-[#6366F1]" />
              </CardHeader>
              <CardContent>
                <div className="text-gray-900 mb-1">{kpi.value}</div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">{kpi.change}</span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Compliance Alerts</CardTitle>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {alerts.filter((a) => a.status === 'flagged').length} Flagged
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`w-5 h-5 mt-0.5 ${
                        alert.status === 'flagged'
                          ? 'text-red-500'
                          : alert.status === 'pending'
                          ? 'text-orange-500'
                          : 'text-green-500'
                      }`}
                    />
                    <div>
                      <div className="text-sm text-gray-900">{alert.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{alert.client}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        alert.status === 'flagged'
                          ? 'bg-red-100 text-red-700'
                          : alert.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }
                    >
                      {alert.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 transition-opacity">
              <UserCheck className="w-4 h-4 mr-2" />
              Approve KYC
            </Button>
            <Button variant="outline" className="w-full border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              View Transactions
            </Button>
            <Button variant="outline" className="w-full">
              Suspend Account
            </Button>
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="text-sm text-gray-600 mb-3">Recent Activity</div>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="text-gray-900">{activity.action}</div>
                    <div className="text-gray-500 mt-0.5">
                      {activity.client} • {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
