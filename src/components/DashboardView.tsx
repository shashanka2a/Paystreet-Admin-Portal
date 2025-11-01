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
import { useWallexBalances, useWallexTransactions, useWallexBeneficiaries } from '../lib/api-hooks';

function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
}

export function DashboardView() {
  // Live Wallex data
  const { data: balances = [] } = useWallexBalances();
  const { data: transactions = [] } = useWallexTransactions({ limit: 200 });
  const { data: beneficiaries = [] } = useWallexBeneficiaries();

  // KPIs derived from live data
  const totalClients = beneficiaries.length;
  const totalPayments = Array.isArray(transactions) ? transactions.length : 0;
  const flaggedPayments = Array.isArray(transactions)
    ? transactions.filter((t: any) => (t.status || '').toString().toLowerCase() === 'flagged').length
    : 0;
  const totalVolumeNum = Array.isArray(transactions)
    ? transactions.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0)
    : 0;
  const primaryCurrency = balances[0]?.currency || 'USD';
  const totalVolume = formatCurrency(totalVolumeNum, primaryCurrency);

  const kpiCards = [
    {
      title: 'Total Clients',
      value: String(totalClients),
      change: '+0.0%',
      changeType: 'positive' as const,
      icon: Users,
      gradient: 'from-primary to-chart-2',
      description: 'Active beneficiary records'
    },
    {
      title: 'Payments (last fetch)',
      value: String(totalPayments),
      change: '+0.0%',
      changeType: 'positive' as const,
      icon: ArrowLeftRight,
      gradient: 'from-blue-500 to-blue-600',
      description: 'Count of listed payments'
    },
    {
      title: 'Flagged Payments',
      value: String(flaggedPayments),
      change: flaggedPayments > 0 ? '+0.0%' : '-0.0%',
      changeType: flaggedPayments > 0 ? 'negative' : 'positive' as const,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600',
      description: 'Require review'
    },
    {
      title: 'Total Volume',
      value: totalVolume,
      change: '+0.0%',
      changeType: 'positive' as const,
      icon: DollarSign,
      gradient: 'from-green-500 to-green-600',
      description: 'Sum of listed payments'
    },
  ];

  const alerts = [
    {
      id: 1,
      title: 'High-risk transaction flagged',
      client: '—',
      status: 'flagged',
      time: 'recent',
      priority: 'high',
      amount: flaggedPayments > 0 ? `${flaggedPayments} items` : undefined
    },
  ];

  const recentActivity = [
    { action: 'Balances fetched', client: 'Wallex', admin: 'System', time: 'now', icon: CheckCircle },
    { action: 'Payments synced', client: 'Wallex', admin: 'System', time: 'now', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Live KPIs sourced from Wallex</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.changeType === 'positive' ? TrendingUp : TrendingDown;
          return (
            <Card
              key={kpi.title}
              className="relative overflow-hidden hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-border cursor-pointer group"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient} group-hover:h-2 transition-all duration-300`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">{kpi.title}</CardTitle>
                <Icon className="w-5 h-5 text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">{kpi.value}</div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendIcon className={`w-3 h-3 ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'} group-hover:scale-110 transition-transform duration-200`} />
                  <span className={`text-xs ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'} group-hover:font-semibold transition-all duration-200`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">vs last snapshot</span>
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">{kpi.description}</p>
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
                {flaggedPayments} Flagged
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border border-border group"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`w-5 h-5 mt-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-200 ${
                        'text-red-500'
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
                      className={`group-hover:scale-105 transition-transform duration-200 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}
                    >
                      flagged
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
