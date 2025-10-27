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
  Building2,
  Users,
  Shield,
  Globe,
  Calendar,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { 
  useKYBApplications,
  type KYBApplication 
} from '../lib/api-hooks';
import { format } from 'date-fns';

export function KYBView() {
  const [selectedApplication, setSelectedApplication] = useState<KYBApplication | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: applications = [], isLoading } = useKYBApplications();

  const filteredApplications = applications.filter((app) => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = 
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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

  const getSanctionsStatusBadge = (status: string) => {
    const variants = {
      clean: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      flagged: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status === 'clean' ? 'Clean' : status === 'flagged' ? 'Flagged' : 'Pending'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading KYB applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">KYB Management</h1>
          <p className="text-muted-foreground">Review and approve business verification requests with sanctions.io integration</p>
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
                placeholder="Search businesses..."
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
                    <TableHead>Company Name</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Sanctions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/50 border-border">
                      <TableCell className="font-medium text-foreground">{app.companyName}</TableCell>
                      <TableCell className="text-muted-foreground">{app.registrationNumber}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(app.submittedAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {app.sanctionsCheck && getSanctionsStatusBadge(app.sanctionsCheck.status)}
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              KYB Application Review - {selectedApplication?.companyName}
            </DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Company Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Company Name</Label>
                      </div>
                      <div className="text-foreground font-medium">{selectedApplication.companyName}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Registration Number</Label>
                      </div>
                      <div className="text-foreground">{selectedApplication.registrationNumber}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Submitted Date</Label>
                      </div>
                      <div className="text-foreground">
                        {format(new Date(selectedApplication.submittedAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Client ID</Label>
                      </div>
                      <div className="text-foreground">{selectedApplication.clientId}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Directors */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Directors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedApplication.directors.map((director, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">Name</Label>
                            <div className="text-foreground font-medium">{director.name}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Position</Label>
                            <div className="text-foreground">{director.position}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Ownership</Label>
                            <div className="text-foreground font-medium">{director.ownership}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* UBO Details */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    Ultimate Beneficial Owners (UBOs)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedApplication.uboDetails.map((ubo, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">Name</Label>
                            <div className="text-foreground font-medium">{ubo.name}</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Ownership</Label>
                            <div className="text-foreground font-medium">{ubo.ownership}%</div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Nationality</Label>
                            <div className="text-foreground">{ubo.nationality}</div>
                          </div>
                        </div>
                      </div>
                    ))}
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

              {/* Sanctions Check Results */}
              {selectedApplication.sanctionsCheck && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Sanctions.io Screening Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label className="text-sm text-muted-foreground">Screening Status</Label>
                        <div className="flex items-center gap-2">
                          {selectedApplication.sanctionsCheck.status === 'flagged' ? (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          ) : selectedApplication.sanctionsCheck.status === 'clean' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-500" />
                          )}
                          {getSanctionsStatusBadge(selectedApplication.sanctionsCheck.status)}
                        </div>
                      </div>
                      
                      {selectedApplication.sanctionsCheck.matches.length > 0 && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Matches Found</Label>
                          <div className="mt-2 space-y-2">
                            {selectedApplication.sanctionsCheck.matches.map((match, idx) => (
                              <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div className="text-sm font-medium text-red-800 dark:text-red-200">
                                  {match.name || 'Match Found'}
                                </div>
                                <div className="text-xs text-red-600 dark:text-red-300 mt-1">
                                  {match.reason || 'Potential sanctions match'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedApplication.sanctionsCheck.status === 'clean' && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="text-sm font-medium text-green-800 dark:text-green-200">
                            No sanctions matches found
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-300 mt-1">
                            All screened parties appear clean
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                      // Handle rejection logic here
                    }
                  }}
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => {
                    // Handle approval logic here
                    setSelectedApplication(null);
                    setAdminNotes('');
                  }}
                  className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


