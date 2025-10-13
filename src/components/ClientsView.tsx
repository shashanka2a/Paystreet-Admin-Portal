import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Search, Filter, Download, Eye, Building2, MessageSquare, Send, CheckCircle, XCircle } from 'lucide-react';

const clients = [
  {
    id: 1,
    name: 'Acme Corporation Ltd',
    email: 'contact@acmecorp.com',
    country: 'United Kingdom',
    businessType: 'Technology',
    status: 'active',
    joinDate: '2024-03-15',
    accountBalance: '£245,000',
  },
  {
    id: 2,
    name: 'TechVentures Inc',
    email: 'info@techventures.com',
    country: 'United States',
    businessType: 'Finance',
    status: 'active',
    joinDate: '2024-05-22',
    accountBalance: '$892,400',
  },
  {
    id: 3,
    name: 'Global Imports LLC',
    email: 'admin@globalimports.com',
    country: 'Canada',
    businessType: 'Import/Export',
    status: 'inactive',
    joinDate: '2023-11-08',
    accountBalance: 'CAD 0',
  },
  {
    id: 4,
    name: 'Innovation Hub Ltd',
    email: 'hello@innovationhub.sg',
    country: 'Singapore',
    businessType: 'Consulting',
    status: 'active',
    joinDate: '2024-08-14',
    accountBalance: 'SGD 156,800',
  },
  {
    id: 5,
    name: 'StartupFlow Ltd',
    email: 'team@startupflow.de',
    country: 'Germany',
    businessType: 'Technology',
    status: 'pending',
    joinDate: '2025-10-01',
    accountBalance: '€0',
  },
];

const ongoingDDQueries = [
  {
    id: 1,
    date: '2025-10-12',
    from: 'Admin',
    message: 'Please provide updated proof of address for all directors.',
    status: 'pending',
  },
  {
    id: 2,
    date: '2025-10-10',
    from: 'Client',
    message: 'We have uploaded the requested documents. Please review.',
    status: 'replied',
  },
  {
    id: 3,
    date: '2025-10-08',
    from: 'Admin',
    message: 'Documents verified. No further action required.',
    status: 'resolved',
  },
];

export function ClientsView() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuery, setNewQuery] = useState('');

  const filteredClients = clients.filter((client) => {
    const matchesFilter = activeFilter === 'all' || client.status === activeFilter;
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Client Management</h1>
          <p className="text-gray-600">Manage and monitor all registered clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
                className={activeFilter === 'all' ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : ''}
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('active')}
                className={activeFilter === 'active' ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : ''}
              >
                Active
              </Button>
              <Button
                variant={activeFilter === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('inactive')}
                className={activeFilter === 'inactive' ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : ''}
              >
                Inactive
              </Button>
              <Button
                variant={activeFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('pending')}
                className={activeFilter === 'pending' ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : ''}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <span>{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{client.email}</TableCell>
                  <TableCell>{client.country}</TableCell>
                  <TableCell>{client.businessType}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        client.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : client.status === 'inactive'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-orange-100 text-orange-700'
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClient(client)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Details Drawer */}
      <Sheet open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedClient && (
            <>
              <SheetHeader>
                <SheetTitle>Client Profile</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">{selectedClient.name}</h3>
                    <p className="text-sm text-gray-600">{selectedClient.email}</p>
                  </div>
                </div>

                <Tabs defaultValue="details">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="dd">Ongoing DD</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Edit Status</div>
                      <Select defaultValue={selectedClient.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending Verification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Country</div>
                      <div className="text-gray-900">{selectedClient.country}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Business Type</div>
                      <div className="text-gray-900">{selectedClient.businessType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Join Date</div>
                      <div className="text-gray-900">{selectedClient.joinDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Account Balance</div>
                      <div className="text-gray-900">{selectedClient.accountBalance}</div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <Button className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Activate Account
                      </Button>
                      <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="w-4 h-4 mr-2" />
                        Suspend Account
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="dd" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Query & Reply Thread
                        </div>
                        <ScrollArea className="h-[300px] border border-gray-200 rounded-lg p-3">
                          <div className="space-y-3">
                            {ongoingDDQueries.map((query) => (
                              <div
                                key={query.id}
                                className={`p-3 rounded-lg ${
                                  query.from === 'Admin'
                                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white ml-4'
                                    : 'bg-gray-100 text-gray-900 mr-4'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <span className="text-xs opacity-90">{query.from}</span>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      query.status === 'pending'
                                        ? 'bg-orange-200 text-orange-900 text-xs'
                                        : query.status === 'replied'
                                        ? 'bg-blue-200 text-blue-900 text-xs'
                                        : 'bg-green-200 text-green-900 text-xs'
                                    }
                                  >
                                    {query.status}
                                  </Badge>
                                </div>
                                <p className="text-sm">{query.message}</p>
                                <p className="text-xs opacity-70 mt-1">{query.date}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                          Raise New Query
                        </label>
                        <Textarea
                          placeholder="Type your query or request additional information..."
                          rows={3}
                          value={newQuery}
                          onChange={(e) => setNewQuery(e.target.value)}
                        />
                        <Button className="w-full mt-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                          <Send className="w-4 h-4 mr-2" />
                          Send Query
                        </Button>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve DD
                        </Button>
                        <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject DD
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="notes" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                          Compliance Notes
                        </label>
                        <Textarea
                          placeholder="Add internal compliance notes..."
                          rows={6}
                          defaultValue="KYC approved on 2024-03-15. All documents verified."
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                          Internal Remarks
                        </label>
                        <Textarea
                          placeholder="Add general remarks..."
                          rows={4}
                          defaultValue="Regular transactions. No flags."
                        />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                        Save Notes
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button variant="outline" className="w-full">
                    View Transaction History
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
