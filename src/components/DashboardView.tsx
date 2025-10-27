import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  UserCheck, 
  Building2, 
  ArrowLeftRight, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

const kpiCards = [
  {
    title: 'Total Clients',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: Users,
    gradient: 'from-primary to-chart-2',
    description: 'Active client accounts'
  },
  {
    title: 'Pending KYCs',
    value: '47',
    change: '-8.3%',
    changeType: 'positive',
    icon: UserCheck,
    gradient: 'from-orange-500 to-orange-600',
    description: 'Awaiting verification'
  },
  {
    title: 'Approved KYBs',
    value: '1,234',
    change: '+15.2%',
    changeType: 'positive',
    icon: Building2,
    gradient: 'from-green-500 to-green-600',
    description: 'Business verifications'
  },
  {
    title: 'Flagged Transactions',
    value: '23',
    change: '+2.1%',
    changeType: 'negative',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-red-600',
    description: 'Require review'
  },
  {
    title: 'Total Volume',
    value: '$2.4M',
    change: '+18.7%',
    changeType: 'positive',
    icon: DollarSign,
    gradient: 'from-blue-500 to-blue-600',
    description: 'Monthly transaction volume'
  },
];

const alerts = [
  {
    id: 1,
    title: 'High-risk transaction flagged',
    client: 'Acme Corp Ltd',
    status: 'flagged',
    time: '10 minutes ago',
    priority: 'high',
    amount: '$45,000'
  },
  {
    id: 2,
    title: 'KYC document expired',
    client: 'TechStart Inc',
    status: 'pending',
    time: '1 hour ago',
    priority: 'medium',
    type: 'KYC'
  },
  {
    id: 3,
    title: 'Multiple failed login attempts',
    client: 'GlobalTrade LLC',
    status: 'flagged',
    time: '2 hours ago',
    priority: 'high',
    type: 'Security'
  },
  {
    id: 4,
    title: 'KYB verification completed',
    client: 'Innovate Solutions',
    status: 'resolved',
    time: '3 hours ago',
    priority: 'low',
    type: 'KYB'
  },
];

const recentActivity = [
  { action: 'KYC Approved', client: 'Quantum Ventures', admin: 'Sarah M.', time: '5 min ago', icon: CheckCircle },
  { action: 'Account Suspended', client: 'Delta Trading', admin: 'Mike R.', time: '12 min ago', icon: Shield },
  { action: 'Transaction Flagged', client: 'Nexus Corp', admin: 'System', time: '18 min ago', icon: AlertTriangle },
  { action: 'Document Uploaded', client: 'Prime Capital', admin: 'Lisa K.', time: '25 min ago', icon: Clock },
];

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's your PayStreet compliance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.changeType === 'positive' ? TrendingUp : TrendingDown;
          return (
            <Card
              key={kpi.title}
              className="relative overflow-hidden hover:shadow-lg transition-all duration-200 border-border"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient}`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">{kpi.title}</CardTitle>
                <Icon className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">{kpi.value}</div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendIcon className={`w-3 h-3 ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-xs ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Panel */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Compliance Alerts</CardTitle>
              <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                {alerts.filter((a) => a.status === 'flagged').length} Flagged
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer border border-border"
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
                      <div className="text-sm font-medium text-foreground">{alert.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{alert.client}</div>
                      {alert.amount && (
                        <div className="text-xs font-semibold text-primary mt-1">{alert.amount}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        alert.status === 'flagged'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : alert.status === 'pending'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }
                    >
                      {alert.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 text-white hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
              <UserCheck className="w-4 h-4 mr-2" />
              Approve KYC
            </Button>
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Building2 className="w-4 h-4 mr-2" />
              Review KYB
            </Button>
            <Button variant="outline" className="w-full">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              View Transactions
            </Button>
            <Button variant="outline" className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Suspend Account
            </Button>
            <div className="pt-4 border-t border-border mt-4">
              <div className="text-sm text-muted-foreground mb-3">Recent Activity</div>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <ActivityIcon className="w-3 h-3 text-muted-foreground" />
                      <div>
                        <div className="text-foreground font-medium">{activity.action}</div>
                        <div className="text-muted-foreground mt-0.5">
                          {activity.client} • {activity.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
