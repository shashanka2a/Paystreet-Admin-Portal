import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  Download, 
  Eye, 
  User, 
  Building2,
  CreditCard,
  ArrowLeftRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Users,
  Banknote
} from 'lucide-react';
import { 
  useClients,
  useClientTransactions,
  type Client,
  type Transaction 
} from '../lib/api-hooks';
import { format } from 'date-fns';

export function ClientsView() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: clients = [], isLoading } = useClients();
  const { data: clientTransactions = [] } = useClientTransactions(selectedClient?.id || '');

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'suspended': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      suspended: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      restricted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
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

  const getKYBStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getKYCStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const summaryCards = [
    { 
      title: 'Total Clients', 
      value: clients.length.toString(), 
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      gradient: 'from-primary to-chart-2'
    },
    { 
      title: 'Active Clients', 
      value: clients.filter(c => c.status === 'active').length.toString(), 
      change: '+8.3%',
      changeType: 'positive',
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'High Risk Clients', 
      value: clients.filter(c => c.riskScore > 70).length.toString(), 
      change: '-2.1%',
      changeType: 'positive',
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Client Profiles</h1>
          <p className="text-muted-foreground">Unified view of client KYC/KYB data, transactions, and risk assessment</p>
        </div>
        <div className="flex gap-2">
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
                  <span className="text-xs text-muted-foreground">vs last month</span>
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
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>KYB Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50 border-border">
                  <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.companyName}</TableCell>
                  <TableCell className="text-muted-foreground">{client.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(client.kycStatus)}
                      {getKYCStatusBadge(client.kycStatus)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(client.kybStatus)}
                      {getKYBStatusBadge(client.kybStatus)}
                      </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        client.riskScore < 30 ? 'bg-green-500' : 
                        client.riskScore < 70 ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm">{client.riskScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(client.status)}
                      {getStatusBadge(client.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClient(client)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Profile Modal */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Client Profile - {selectedClient?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="kyc">KYC Data</TabsTrigger>
                  <TabsTrigger value="kyb">KYB Data</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Client Information */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Client Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-sm text-muted-foreground">Full Name</div>
                              <div className="text-foreground font-medium">{selectedClient.name}</div>
                            </div>
                  </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary" />
                  <div>
                              <div className="text-sm text-muted-foreground">Email</div>
                              <div className="text-foreground">{selectedClient.email}</div>
                  </div>
                </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary" />
                    <div>
                              <div className="text-sm text-muted-foreground">Phone</div>
                              <div className="text-foreground">{selectedClient.phone}</div>
                            </div>
                          </div>
                    </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-primary" />
                    <div>
                              <div className="text-sm text-muted-foreground">Company</div>
                              <div className="text-foreground">{selectedClient.companyName}</div>
                            </div>
                    </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary" />
                    <div>
                              <div className="text-sm text-muted-foreground">Joined</div>
                              <div className="text-foreground">
                                {format(new Date(selectedClient.joinedAt), 'dd/MM/yyyy')}
                              </div>
                            </div>
                    </div>
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-primary" />
                    <div>
                              <div className="text-sm text-muted-foreground">Country</div>
                              <div className="text-foreground">{selectedClient.country}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Assessment */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-foreground mb-2">{selectedClient.riskScore}%</div>
                          <div className="text-sm text-muted-foreground mb-2">Risk Score</div>
                          {getRiskBadge(selectedClient.riskScore)}
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-foreground mb-2">{selectedClient.totalTransactions}</div>
                          <div className="text-sm text-muted-foreground mb-2">Total Transactions</div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {selectedClient.totalTransactions > 100 ? 'High Volume' : 'Normal Volume'}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-foreground mb-2">
                            {formatAmount(selectedClient.totalVolume, selectedClient.currency)}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">Total Volume</div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            {selectedClient.totalVolume > 1000000 ? 'High Value' : 'Standard Value'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compliance Status */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Compliance Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">KYC Status</span>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(selectedClient.kycStatus)}
                              {getKYCStatusBadge(selectedClient.kycStatus)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">KYB Status</span>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(selectedClient.kybStatus)}
                              {getKYBStatusBadge(selectedClient.kybStatus)}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Account Status</span>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(selectedClient.status)}
                              {getStatusBadge(selectedClient.status)}
                    </div>
                    </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last Activity</span>
                            <span className="text-sm text-foreground">
                              {format(new Date(selectedClient.lastActivity), 'dd/MM/yyyy HH:mm')}
                            </span>
                    </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* KYC Data Tab */}
                <TabsContent value="kyc" className="space-y-6">
                  {selectedClient.kycData && (
                    <>
                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="text-lg">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Full Name</div>
                              <div className="text-foreground font-medium">
                                {selectedClient.kycData.firstName} {selectedClient.kycData.lastName}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Date of Birth</div>
                              <div className="text-foreground">{selectedClient.kycData.dateOfBirth}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Nationality</div>
                              <div className="text-foreground">{selectedClient.kycData.nationality}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">ID Number</div>
                              <div className="text-foreground font-mono">{selectedClient.kycData.idNumber}</div>
                            </div>
                            <div className="col-span-2 space-y-2">
                              <div className="text-sm text-muted-foreground">Address</div>
                              <div className="text-foreground">{selectedClient.kycData.address}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="text-lg">Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedClient.kycData.documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-primary" />
                                  <div>
                                    <div className="text-sm font-medium text-foreground capitalize">
                                      {doc.type.replace('_', ' ')}
                                    </div>
                                  <Badge
                                    variant="secondary"
                                    className={
                                        doc.status === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                        doc.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                      }
                                    >
                                      {doc.status}
                                  </Badge>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                {/* KYB Data Tab */}
                <TabsContent value="kyb" className="space-y-6">
                  {selectedClient.kybData && (
                    <>
                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="text-lg">Company Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Company Name</div>
                              <div className="text-foreground font-medium">{selectedClient.kybData.companyName}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Registration Number</div>
                              <div className="text-foreground font-mono">{selectedClient.kybData.registrationNumber}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Business Type</div>
                              <div className="text-foreground">{selectedClient.kybData.businessType}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Incorporation Date</div>
                              <div className="text-foreground">{selectedClient.kybData.incorporationDate}</div>
                            </div>
                            <div className="col-span-2 space-y-2">
                              <div className="text-sm text-muted-foreground">Business Address</div>
                              <div className="text-foreground">{selectedClient.kybData.businessAddress}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="text-lg">Directors & UBOs</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Directors</div>
                              <div className="space-y-2">
                                {selectedClient.kybData.directors.map((director, idx) => (
                                  <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border">
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <div className="text-sm text-muted-foreground">Name</div>
                                        <div className="text-foreground font-medium">{director.name}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-muted-foreground">Position</div>
                                        <div className="text-foreground">{director.position}</div>
                      </div>
                      <div>
                                        <div className="text-sm text-muted-foreground">Ownership</div>
                                        <div className="text-foreground font-medium">{director.ownership}%</div>
                                      </div>
                                    </div>
                      </div>
                                ))}
                      </div>
                    </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Ultimate Beneficial Owners</div>
                              <div className="space-y-2">
                                {selectedClient.kybData.ubos.map((ubo, idx) => (
                                  <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border">
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <div className="text-sm text-muted-foreground">Name</div>
                                        <div className="text-foreground font-medium">{ubo.name}</div>
                                      </div>
                      <div>
                                        <div className="text-sm text-muted-foreground">Ownership</div>
                                        <div className="text-foreground font-medium">{ubo.ownership}%</div>
                      </div>
                      <div>
                                        <div className="text-sm text-muted-foreground">Nationality</div>
                                        <div className="text-foreground">{ubo.nationality}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="space-y-6">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Transaction ID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clientTransactions.map((tx) => (
                              <TableRow key={tx.id} className="hover:bg-muted/50 border-border">
                                <TableCell className="text-primary font-semibold">{tx.id}</TableCell>
                                <TableCell className="text-muted-foreground">
                                  {format(new Date(tx.timestamp), 'dd/MM/yyyy HH:mm')}
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
                                    {getStatusIcon(tx.status)}
                                    {getStatusBadge(tx.status)}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Bank Accounts Tab */}
                <TabsContent value="accounts" className="space-y-6">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Bank Account Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedClient.bankAccounts.map((account) => (
                          <div key={account.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-primary" />
                                  <div className="text-sm text-muted-foreground">Account Number</div>
                                </div>
                                <div className="text-foreground font-mono">{account.accountNumber}</div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-primary" />
                                  <div className="text-sm text-muted-foreground">Bank Name</div>
                                </div>
                                <div className="text-foreground">{account.bankName}</div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-primary" />
                                  <div className="text-sm text-muted-foreground">Currency</div>
                                </div>
                                <div className="text-foreground">{account.currency}</div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <div className="text-sm text-muted-foreground">Country</div>
                                </div>
                                <div className="text-foreground">{account.country}</div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm text-muted-foreground">Status</div>
                                  {getStatusBadge(account.status)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-sm text-muted-foreground">Verified</div>
                                  {account.verified ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  </TabsContent>
                </Tabs>
              </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}