import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Search, Download, Eye, FileText } from 'lucide-react';

const kybApplications = [
  { id: 101, businessName: 'Acme Corporation Ltd', country: 'United Kingdom', submittedDate: '2025-10-10', status: 'pending' },
  { id: 102, businessName: 'TechVentures Inc', country: 'United States', submittedDate: '2025-10-09', status: 'pending' },
  { id: 103, businessName: 'Global Imports LLC', country: 'Canada', submittedDate: '2025-10-08', status: 'approved' },
  { id: 104, businessName: 'Innovation Hub Ltd', country: 'Singapore', submittedDate: '2025-10-07', status: 'rejected' },
];

export function KYBView() {
  const [selected, setSelected] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = kybApplications.filter((app) => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || app.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2 text-2xl font-bold">KYB Applications</h1>
          <p className="text-white">Review and approve business verification requests</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#38B000] rounded-lg bg-[#1a1a1a] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#38B000] focus:border-[#38B000]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            {['all','pending','approved','rejected'].map((t) => (
              <Button key={t} variant={activeTab===t?'default':'outline'} size="sm" onClick={()=>setActiveTab(t)} className={activeTab===t? 'bg-gradient-to-r from-[#38B000] to-[#4ade80]': ''}>
                {t[0].toUpperCase()+t.slice(1)}
                {t==='pending' && (
                  <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                    {kybApplications.filter((a)=>a.status==='pending').length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((app) => (
                <TableRow key={app.id} className="hover:bg-[#1a1a1a] border-b border-[#38B000]">
                  <TableCell className="text-white">{app.businessName}</TableCell>
                  <TableCell className="text-white">{app.country}</TableCell>
                  <TableCell className="text-white">{app.submittedDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={app.status==='pending'? 'bg-orange-100 text-orange-700' : app.status==='approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(app)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>KYB Application Review</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Business Name</div>
                  <div className="text-gray-900">{selected.businessName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Country</div>
                  <div className="text-gray-900">{selected.country}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Submitted</div>
                  <div className="text-gray-900">{selected.submittedDate}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-sm text-gray-900">KYB Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Registration Number</Label>
                    <Input placeholder="e.g. 12345678" />
                  </div>
                  <div>
                    <Label>Registered Address</Label>
                    <Input placeholder="Line 1, City, Country" />
                  </div>
                  <div>
                    <Label>Ultimate Beneficial Owners (UBOs)</Label>
                    <Textarea rows={3} placeholder="Name, Ownership %, Nationality" />
                  </div>
                  <div>
                    <Label>Directors</Label>
                    <Textarea rows={3} placeholder="Names and roles" />
                  </div>
                  <div>
                    <Label>Nature of Business</Label>
                    <Input placeholder="Brief description" />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input placeholder="https://" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="space-y-2">
                  {['Certificate of Incorporation', 'Memorandum & Articles', 'Shareholding Structure', 'Proof of Address'].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#6366F1]" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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
                <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">Submit Decision</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


