import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Search, Download, Flag, ArrowUpDown, TrendingUp, MessageSquare, Send, CheckCircle, XCircle } from 'lucide-react';
import { convertToTimeZone } from '../lib/datetime';
import { decideFlaggedTransaction } from '../lib/transactions';

const transactions = [
  {
    id: 'TX-2025-0847',
    date: '2025-10-13',
    time: '14:32',
    client: 'Acme Corporation Ltd',
    amount: '£45,000',
    currency: 'GBP',
    type: 'Transfer Out',
    status: 'completed',
    flagged: false,
  },
  {
    id: 'TX-2025-0846',
    date: '2025-10-13',
    time: '11:15',
    client: 'TechVentures Inc',
    amount: '$128,500',
    currency: 'USD',
    type: 'Transfer In',
    status: 'completed',
    flagged: true,
  },
  {
    id: 'TX-2025-0845',
    date: '2025-10-12',
    time: '16:45',
    client: 'Innovation Hub Ltd',
    amount: 'SGD 89,200',
    currency: 'SGD',
    type: 'Transfer Out',
    status: 'pending',
    flagged: false,
  },
  {
    id: 'TX-2025-0844',
    date: '2025-10-12',
    time: '09:22',
    client: 'Global Imports LLC',
    amount: 'CAD 256,000',
    currency: 'CAD',
    type: 'Transfer In',
    status: 'completed',
    flagged: true,
  },
  {
    id: 'TX-2025-0843',
    date: '2025-10-11',
    time: '13:50',
    client: 'StartupFlow Ltd',
    amount: '€32,400',
    currency: 'EUR',
    type: 'Transfer Out',
    status: 'completed',
    flagged: false,
  },
];

const summaryCards = [
  { title: 'Total Volume (24h)', value: '£2.4M', change: '+18.2%' },
  { title: 'Transactions Count', value: '847', change: '+12.5%' },
  { title: 'Flagged Transactions', value: '23', change: '-5.3%' },
];

const queryReplies = [
  {
    id: 1,
    date: '2025-10-13 15:20',
    from: 'Admin',
    message: 'This transaction exceeds the daily threshold. Please provide invoice and business justification.',
    status: 'pending',
  },
  {
    id: 2,
    date: '2025-10-13 14:45',
    from: 'Client',
    message: 'This is payment for enterprise software licensing. Invoice attached in portal.',
    status: 'replied',
  },
];

export function TransactionsView() {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const zones = [
    { id: undefined, label: 'Local' },
    { id: 'UTC', label: 'UTC' },
    { id: 'Europe/London', label: 'Europe/London' },
    { id: 'America/New_York', label: 'America/New_York' },
    { id: 'Asia/Singapore', label: 'Asia/Singapore' },
  ];

  async function onApprove(id: string) {
    await decideFlaggedTransaction(id, 'approved');
    setSelectedTransaction(null);
  }

  async function onReject(id: string) {
    await decideFlaggedTransaction(id, 'rejected');
    setSelectedTransaction(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2 text-2xl font-bold">Transaction Monitor</h1>
          <p className="text-white">Track and review all financial transactions</p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            className="border border-[#00A878] rounded-md px-2 py-1 text-sm bg-[#1a1a1a] text-white"
            value={timeZone || ''}
            onChange={(e) => setTimeZone(e.target.value || undefined)}
          >
            {zones.map((z) => (
              <option key={String(z.id)} value={z.id || ''}>{z.label}</option>
            ))}
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 mb-1">{card.value}</div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">{card.change}</span>
                <span className="text-xs text-gray-500">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
              <input
                type="text"
                placeholder="Search by transaction ID or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#00A878] rounded-lg bg-[#1a1a1a] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00A878] focus:border-[#00A878]"
              />
            </div>
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
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => {
                const { date, time } = convertToTimeZone(`${tx.date}T${tx.time}:00`, timeZone);
                return (
                  <TableRow key={tx.id} className="hover:bg-[#1a1a1a] border-b border-[#00A878]">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.flagged && <Flag className="w-4 h-4 text-[#FF4D4D]" />}
                        <span className="text-[#00A878] font-semibold">{tx.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {date}
                      <br />
                      <span className="text-xs text-white">{time}</span>
                    </TableCell>
                    <TableCell className="text-white">{tx.client}</TableCell>
                    <TableCell className="text-white font-semibold">{tx.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          tx.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }
                      >
                        {tx.status}
                      </Badge>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Transaction ID</div>
                  <div className="text-gray-900">{selectedTransaction.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <Badge
                    variant="secondary"
                    className={
                      selectedTransaction.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }
                  >
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Client</div>
                  <div className="text-gray-900">{selectedTransaction.client}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Amount</div>
                  <div className="text-gray-900">{selectedTransaction.amount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Date</div>
                  <div className="text-gray-900">{convertToTimeZone(`${selectedTransaction.date}T${selectedTransaction.time}:00`, timeZone).date}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Time</div>
                  <div className="text-gray-900">{convertToTimeZone(`${selectedTransaction.date}T${selectedTransaction.time}:00`, timeZone).time}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className="text-gray-900">{selectedTransaction.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Currency</div>
                  <div className="text-gray-900">{selectedTransaction.currency}</div>
                </div>
              </div>

              {selectedTransaction.flagged && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Flag className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-red-900">Flagged Transaction</div>
                      <div className="text-xs text-red-700 mt-1">
                        This transaction has been flagged for manual review due to threshold limits.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Query Raising and Reply Management */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm text-gray-900">Query & Reply Thread</h3>
                </div>
                <ScrollArea className="h-[200px] border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="space-y-3">
                    {queryReplies.map((query) => (
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
                                : 'bg-blue-200 text-blue-900 text-xs'
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
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Raise Query / Add Notes
                  </label>
                  <Textarea
                    placeholder="Request additional information or add compliance notes..."
                    rows={3}
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                  />
                  <Button className="w-full mt-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                    <Send className="w-4 h-4 mr-2" />
                    Send Query
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setSelectedTransaction(null)} className="flex-1">
                  Close
                </Button>
                {selectedTransaction.flagged && (
                  <>
                    <Button variant="outline" className="flex-1 text-[#FF4D4D] border-[#FF4D4D] hover:bg-[#FF4D4D]/10" onClick={() => onReject(selectedTransaction.id)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-[#007A5E] to-[#00C084] hover:from-[#00A878] hover:to-[#2DD881] text-white paystreet-glow" onClick={() => onApprove(selectedTransaction.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
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
