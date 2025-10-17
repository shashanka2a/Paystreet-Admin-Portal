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
import { Search, Download, Eye, FileText } from 'lucide-react';

const kycApplications = [
  {
    id: 1,
    name: 'Acme Corporation Ltd',
    country: 'United Kingdom',
    type: 'Business',
    submittedDate: '2025-10-10',
    status: 'pending',
  },
  {
    id: 2,
    name: 'TechVentures Inc',
    country: 'United States',
    type: 'Business',
    submittedDate: '2025-10-09',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Global Imports LLC',
    country: 'Canada',
    type: 'Business',
    submittedDate: '2025-10-08',
    status: 'approved',
  },
  {
    id: 4,
    name: 'Innovation Hub Ltd',
    country: 'Singapore',
    type: 'Business',
    submittedDate: '2025-10-07',
    status: 'rejected',
  },
  {
    id: 5,
    name: 'StartupFlow Ltd',
    country: 'Germany',
    type: 'Business',
    submittedDate: '2025-10-06',
    status: 'pending',
  },
];

export function KYCView() {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplications = kycApplications.filter((app) => {
    const matchesTab =
      activeTab === 'all' || app.status === activeTab;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">KYC Applications</h1>
          <p className="text-[#b3b3b3]">Review and approve client verification requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#b3b3b3]" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#333333] rounded-lg bg-[#2a2a2a] text-white placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-[#38B000] focus:border-transparent"
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
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                  {kycApplications.filter((a) => a.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-[#2a2a2a]">
                      <TableCell>{app.name}</TableCell>
                      <TableCell>{app.country}</TableCell>
                      <TableCell>{app.type}</TableCell>
                      <TableCell className="text-[#b3b3b3]">{app.submittedDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            app.status === 'pending'
                              ? 'bg-orange-100 text-orange-700'
                              : app.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {app.status}
                        </Badge>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>KYC Application Review</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Business Name</div>
                  <div className="text-gray-900">{selectedApplication.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Country</div>
                  <div className="text-gray-900">{selectedApplication.country}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Application Type</div>
                  <div className="text-gray-900">{selectedApplication.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Submitted Date</div>
                  <div className="text-gray-900">{selectedApplication.submittedDate}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-3">Uploaded Documents</div>
                <div className="space-y-2">
                  {['Certificate of Incorporation', 'Proof of Address', 'Director IDs'].map(
                    (doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#6366F1]" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Due Diligence Results */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm text-gray-900 mb-4">Due Diligence Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="risk-rating">Risk Rating</Label>
                    <Select>
                      <SelectTrigger id="risk-rating">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="verification-method">Verification Method</Label>
                    <Select>
                      <SelectTrigger id="verification-method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Review</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="third-party">Third Party API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reviewer-name">Reviewed By</Label>
                    <Input id="reviewer-name" defaultValue="Sarah Mitchell" />
                  </div>
                  <div>
                    <Label htmlFor="review-date">Review Date</Label>
                    <Input id="review-date" type="date" defaultValue="2025-10-13" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="dd-findings">Due Diligence Findings</Label>
                  <Textarea
                    id="dd-findings"
                    placeholder="Record due diligence results, background checks, sanctions screening results..."
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Decision</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                    <SelectItem value="pending">Request More Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Internal Notes</label>
                <Textarea placeholder="Add compliance notes..." rows={4} />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                  Submit Decision
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
