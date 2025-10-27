import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Download, 
  Flag, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown,
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  ArrowRightLeft,
  Globe,
  Calendar,
  User,
  Zap,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { 
  useWallexTransactions,
  useWallexTransactionStats,
  useWallexProviderStatus,
  useWallexHighRiskTransactions,
  useCreateWallexPayment,
  useSwitchWallexProvider
} from '../lib/api-hooks';
import { format } from 'date-fns';

export function TransactionsView() {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [timeZone, setTimeZone] = useState<string>('UTC');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  // Wallex API hooks
  const { data: wallexTransactions = [], isLoading: transactionsLoading, refetch: refetchTransactions } = useWallexTransactions({
    limit: 100,
    sort: 'timestamp:desc'
  });
  
  const { data: transactionStats, isLoading: statsLoading } = useWallexTransactionStats();
  const { data: providerStatus, isLoading: statusLoading } = useWallexProviderStatus();
  const { data: highRiskTransactions = [] } = useWallexHighRiskTransactions();
  const createPayment = useCreateWallexPayment();
  const switchProvider = useSwitchWallexProvider();

  // Real-time monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      refetchTransactions();
    }, 30000); // Refetch every 30 seconds

    return () => clearInterval(interval);
  }, [refetchTransactions]);

  const filteredTransactions = wallexTransactions.filter((tx) => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.beneficiaryName && tx.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: format(date, 'dd/MM/yyyy'),
      time: format(date, 'HH:mm')
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'flagged': return <Flag className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      flagged: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore < 30) {
      return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Low Risk</Badge>;
    } else if (riskScore < 70) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Medium Risk</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">High Risk</Badge>;
    }
  };

  const timeZones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  ];

  const summaryCards = [
    { 
      title: 'Total Volume (24h)', 
      value: transactionStats ? `$${(transactionStats.totalVolume / 1000).toFixed(1)}K` : '$0',
      change: '+18.2%',
      changeType: 'positive',
      icon: DollarSign,
      gradient: 'from-primary to-chart-2'
    },
    { 
      title: 'Transactions Count', 
      value: transactionStats ? transactionStats.transactionCount.toString() : '0',
      change: '+12.5%',
      changeType: 'positive',
      icon: ArrowRightLeft,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'High Risk Transactions', 
      value: highRiskTransactions.length.toString(),
      change: '-5.3%',
      changeType: 'positive',
      icon: Flag,
      gradient: 'from-red-500 to-red-600'
    },
  ];

  if (transactionsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading Wallex transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transaction Monitoring</h1>
          <p className="text-muted-foreground">Track and review all financial transactions with Wallex API integration</p>
          {providerStatus && (
            <div className="flex items-center gap-2 mt-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                providerStatus.WALLEX === 'active' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                {providerStatus.WALLEX === 'active' ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                Wallex {providerStatus.WALLEX}
              </div>
              {providerStatus.FALLBACK === 'active' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  <Wifi className="w-3 h-3" />
                  Fallback Active
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Select value={timeZone} onValueChange={setTimeZone}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.changeType === 'positive' ? TrendingUp : TrendingDown;
          return (
            <Card key={card.title} className="relative overflow-hidden hover:shadow-lg transition-all duration-200 border-border">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
                <Icon className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">{card.value}</div>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`w-3 h-3 ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-xs ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs yesterday</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by transaction ID, client, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => {
                const { date, time } = formatDateTime(tx.timestamp);
                return (
                  <TableRow key={tx.id} className="hover:bg-muted/50 border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.status === 'flagged' && <Flag className="w-4 h-4 text-red-500" />}
                        <span className="text-primary font-semibold">{tx.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {date}
                      <br />
                      <span className="text-xs">{time}</span>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {tx.beneficiaryName || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-foreground font-semibold">
                      {formatAmount(tx.amount, tx.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          tx.amount < 1000 ? 'bg-green-500' : 
                          tx.amount < 10000 ? 'bg-orange-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm">
                          {tx.amount < 1000 ? 'Low' : tx.amount < 10000 ? 'Medium' : 'High'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        {getStatusBadge(tx.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(tx)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Transaction Details - {selectedTransaction?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Transaction ID</Label>
                      </div>
                      <div className="text-foreground font-medium">{selectedTransaction.id}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Client</Label>
                      </div>
                      <div className="text-foreground">{selectedTransaction.beneficiaryName || 'Unknown'}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Amount</Label>
                      </div>
                      <div className="text-foreground font-semibold text-lg">
                        {formatAmount(selectedTransaction.amount, selectedTransaction.currency)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Type</Label>
                      </div>
                      <div className="text-foreground">{selectedTransaction.type}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Date & Time</Label>
                      </div>
                      <div className="text-foreground">
                        {format(new Date(selectedTransaction.timestamp), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Description</Label>
                      </div>
                      <div className="text-foreground">{selectedTransaction.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label className="text-sm text-muted-foreground">Risk Score</Label>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedTransaction.riskScore < 30 ? 'bg-green-500' : 
                          selectedTransaction.riskScore < 70 ? 'bg-orange-500' : 'bg-red-500'
                        }`} />
                        <span className="text-lg font-bold text-foreground">
                          {selectedTransaction.amount < 1000 ? 'Low' : selectedTransaction.amount < 10000 ? 'Medium' : 'High'}
                        </span>
                        {getRiskBadge(selectedTransaction.amount < 1000 ? 20 : selectedTransaction.amount < 10000 ? 50 : 80)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallex Data */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Wallex API Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Wallex Transaction ID</Label>
                      <div className="text-foreground font-mono text-sm">
                        {selectedTransaction.id}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Exchange Rate</Label>
                      <div className="text-foreground font-medium">
                        {selectedTransaction.exchangeRate ? selectedTransaction.exchangeRate.toFixed(4) : 'N/A'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Fees</Label>
                      <div className="text-foreground font-medium">
                        {selectedTransaction.fees ? formatAmount(selectedTransaction.fees, selectedTransaction.currency) : 'N/A'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Reference</Label>
                      <div className="text-foreground font-medium">
                        {selectedTransaction.reference || 'N/A'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flagged Transaction Alert */}
              {selectedTransaction.status === 'flagged' && (
                <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Flag className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-red-800 dark:text-red-200">
                          Flagged Transaction
                        </div>
                        <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                          This transaction has been flagged for manual review due to high risk score or suspicious patterns.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Query & Reply Thread */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Query & Reply Thread
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] border border-border rounded-lg p-3 mb-4">
                    <div className="space-y-3">
                      {/* Mock query replies */}
                      <div className="p-3 rounded-lg bg-primary text-primary-foreground ml-4">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs opacity-90">Admin</span>
                          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs">
                            pending
                          </Badge>
                        </div>
                        <p className="text-sm">This transaction exceeds the daily threshold. Please provide invoice and business justification.</p>
                        <p className="text-xs opacity-70 mt-1">2024-01-15 15:20</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted text-foreground mr-4">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs opacity-90">Client</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            replied
                          </Badge>
                        </div>
                        <p className="text-sm">This is payment for enterprise software licensing. Invoice attached in portal.</p>
                        <p className="text-xs opacity-70 mt-1">2024-01-15 14:45</p>
                      </div>
                    </div>
                  </ScrollArea>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Raise Query / Add Notes
                    </Label>
                    <Textarea
                      placeholder="Request additional information or add compliance notes..."
                      rows={3}
                      value={newQuery}
                      onChange={(e) => setNewQuery(e.target.value)}
                    />
                    <Button className="w-full mt-2 bg-gradient-to-r from-primary to-chart-2 hover:opacity-90">
                      <Send className="w-4 h-4 mr-2" />
                      Send Query
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Decision Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedTransaction(null)} className="flex-1">
                  Close
                </Button>
                {selectedTransaction.status === 'pending' && (
                  <>
                    <Button 
                      variant="destructive" 
                      className="flex-1" 
                      onClick={() => {
                        const reason = prompt('Please provide rejection reason:');
                        if (reason) {
                          // In real implementation, this would call Wallex API to reject transaction
                          console.log('Rejecting transaction:', selectedTransaction.id, reason);
                          setSelectedTransaction(null);
                        }
                      }}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 text-white hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl" 
                      onClick={() => {
                        // In real implementation, this would call Wallex API to approve transaction
                        console.log('Approving transaction:', selectedTransaction.id, newQuery);
                        setSelectedTransaction(null);
                        setNewQuery('');
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
