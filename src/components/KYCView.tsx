import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Search, 
  Download, 
  Eye, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Brain
} from 'lucide-react';
import { 
  useKYCApplications, 
  useApproveKYC, 
  useRejectKYC,
  type KYCApplication 
} from '../lib/api-hooks';
import { format } from 'date-fns';

export function KYCView() {
  const [selectedApplication, setSelectedApplication] = useState<KYCApplication | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: applications = [], isLoading } = useKYCApplications();
  const approveKYC = useApproveKYC();
  const rejectKYC = useRejectKYC();

  const filteredApplications = applications.filter((app) => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = 
      app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = () => {
    if (selectedApplication) {
      approveKYC.mutate({
        applicationId: selectedApplication.id,
        adminNotes
      });
      setSelectedApplication(null);
      setAdminNotes('');
    }
  };

  const handleReject = () => {
    if (selectedApplication && rejectionReason) {
      rejectKYC.mutate({
        applicationId: selectedApplication.id,
        reason: rejectionReason
      });
      setSelectedApplication(null);
      setRejectionReason('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'under_review': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading KYC applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">KYC Management</h1>
          <p className="text-muted-foreground">Review and approve client verification requests with AiPrise integration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  {applications.filter((a) => a.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="under_review">Under Review</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/50 border-border">
                      <TableCell className="font-medium text-foreground">{app.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{app.personalInfo.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(app.submittedAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            app.riskScore < 30 ? 'bg-green-500' : 
                            app.riskScore < 70 ? 'bg-orange-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm">{app.riskScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          {getStatusBadge(app.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              KYC Application Review - {selectedApplication?.clientName}
            </DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Full Name</Label>
                      </div>
                      <div className="text-foreground font-medium">
                        {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Email</Label>
                      </div>
                      <div className="text-foreground">{selectedApplication.personalInfo.email}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Phone</Label>
                      </div>
                      <div className="text-foreground">{selectedApplication.personalInfo.phone}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                      </div>
                      <div className="text-foreground">{selectedApplication.personalInfo.dateOfBirth}</div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Address</Label>
                      </div>
                      <div className="text-foreground">{selectedApplication.personalInfo.address}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedApplication.documents.map((doc) => (
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

              {/* AiPrise Results */}
              {selectedApplication.aiPriseResult && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      AiPrise Verification Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Confidence Score</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${selectedApplication.aiPriseResult.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {(selectedApplication.aiPriseResult.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Verification Status</Label>
                        <Badge 
                          variant="secondary"
                          className={
                            selectedApplication.aiPriseResult.verificationStatus === 'verified' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                          }
                        >
                          {selectedApplication.aiPriseResult.verificationStatus}
                        </Badge>
                      </div>
                    </div>
                    {selectedApplication.aiPriseResult.flags.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm text-muted-foreground">Flags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedApplication.aiPriseResult.flags.map((flag, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              {flag.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Risk Assessment */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label className="text-sm text-muted-foreground">Risk Score</Label>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedApplication.riskScore < 30 ? 'bg-green-500' : 
                          selectedApplication.riskScore < 70 ? 'bg-orange-500' : 'bg-red-500'
                        }`} />
                        <span className="text-lg font-bold text-foreground">
                          {selectedApplication.riskScore}%
                        </span>
                        <Badge 
                          variant="secondary"
                          className={
                            selectedApplication.riskScore < 30 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            selectedApplication.riskScore < 70 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }
                        >
                          {selectedApplication.riskScore < 30 ? 'Low Risk' :
                           selectedApplication.riskScore < 70 ? 'Medium Risk' : 'High Risk'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Add compliance notes, additional verification steps, or decision rationale..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Decision Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    const reason = prompt('Please provide rejection reason:');
                    if (reason) {
                      setRejectionReason(reason);
                      handleReject();
                    }
                  }}
                  disabled={rejectKYC.isPending}
                >
                  {rejectKYC.isPending ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button 
                  onClick={handleApprove}
                  disabled={approveKYC.isPending}
                  className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 text-white hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {approveKYC.isPending ? 'Approving...' : 'Approve'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
