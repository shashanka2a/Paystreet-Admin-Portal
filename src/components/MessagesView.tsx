import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Send, 
  MessageSquare, 
  User, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Plus,
  Reply,
  Forward,
  Archive,
  Flag,
  Star,
  Mail,
  Phone,
  Calendar,
  FileText,
  Paperclip,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  useMessageThreads,
  useSendMessage,
  useMarkAsRead,
  useArchiveMessage,
  type Message,
  type MessageThread 
} from '../lib/api-hooks';
import { format } from 'date-fns';

export function MessagesView() {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  const { data: threads = [], isLoading } = useMessageThreads();
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const archiveMessage = useArchiveMessage();

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = 
      thread.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || thread.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || thread.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'unread': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'replied': return <Reply className="w-4 h-4 text-orange-600" />;
      case 'archived': return <Archive className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      unread: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      read: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      replied: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      archived: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      urgent: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
    };
    
    return (
      <Badge variant="secondary" className={variants[priority as keyof typeof variants]}>
        {priority}
      </Badge>
    );
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <Flag className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const summaryCards = [
    { 
      title: 'Total Messages', 
      value: threads.length.toString(), 
      change: '+15.2%',
      changeType: 'positive',
      icon: MessageSquare,
      gradient: 'from-primary to-chart-2'
    },
    { 
      title: 'Unread Messages', 
      value: threads.filter(t => t.unreadCount > 0).length.toString(), 
      change: '-8.3%',
      changeType: 'positive',
      icon: EyeOff,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'High Priority', 
      value: threads.filter(t => t.priority === 'high' || t.priority === 'urgent').length.toString(), 
      change: '+2.1%',
      changeType: 'negative',
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600'
    },
  ];

  const handleSendMessage = () => {
    if (selectedThread && newMessage.trim()) {
      sendMessage.mutate({
        threadId: selectedThread.id,
        content: newMessage,
        priority: 'normal'
      });
      setNewMessage('');
    }
  };

  const handleReply = () => {
    if (selectedThread && replyMessage.trim()) {
      sendMessage.mutate({
        threadId: selectedThread.id,
        content: replyMessage,
        priority: 'normal'
      });
      setReplyMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Communication Center</h1>
          <p className="text-muted-foreground">Manage admin-client communication and message threads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Message
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
                  <span className="text-xs text-muted-foreground">vs last week</span>
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
                placeholder="Search messages, clients, or subjects..."
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
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredThreads.map((thread) => (
                <TableRow key={thread.id} className="hover:bg-muted/50 border-border">
                  <TableCell className="font-medium text-foreground">{thread.clientName}</TableCell>
                  <TableCell className="text-muted-foreground">{thread.subject}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {thread.lastMessage}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(thread.priority)}
                      {getPriorityBadge(thread.priority)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(thread.status)}
                      {getStatusBadge(thread.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(thread.updatedAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedThread(thread)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {thread.unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead.mutate(thread.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>

      {/* Message Thread Modal */}
      <Dialog open={!!selectedThread} onOpenChange={() => setSelectedThread(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Message Thread - {selectedThread?.clientName}
            </DialogTitle>
          </DialogHeader>
          {selectedThread && (
            <div className="space-y-6">
              {/* Thread Header */}
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Client</Label>
                      </div>
                      <div className="text-foreground font-medium">{selectedThread.clientName}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Subject</Label>
                      </div>
                      <div className="text-foreground">{selectedThread.subject}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Created</Label>
                      </div>
                      <div className="text-foreground">
                        {format(new Date(selectedThread.createdAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm text-muted-foreground">Last Activity</Label>
                      </div>
                      <div className="text-foreground">
                        {format(new Date(selectedThread.updatedAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Priority</Label>
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(selectedThread.priority)}
                          {getPriorityBadge(selectedThread.priority)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Status</Label>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedThread.status)}
                          {getStatusBadge(selectedThread.status)}
                        </div>
              </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Messages</Label>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {selectedThread.unreadCount}
              </Badge>
            </div>
          </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Message History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] border border-border rounded-lg p-4">
            <div className="space-y-4">
                      {selectedThread.messages.map((message) => (
                <div
                  key={message.id}
                          className={`p-4 rounded-lg ${
                      message.senderId === 'admin-1'
                              ? 'bg-primary text-primary-foreground ml-8'
                              : 'bg-muted text-foreground mr-8'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {message.senderId === 'admin-1' ? 'Admin' : selectedThread.clientName}
                              </span>
                              {message.priority === 'high' && (
                                <Flag className="w-3 h-3 text-red-300" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs opacity-70">
                                {format(new Date(message.timestamp), 'dd/MM/yyyy HH:mm')}
                              </span>
                              {message.status === 'read' && (
                                <CheckCircle className="w-3 h-3 opacity-70" />
                              )}
                            </div>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/20">
                              <div className="flex items-center gap-2">
                                <Paperclip className="w-3 h-3" />
                                <span className="text-xs">
                                  {message.attachments.length} attachment(s)
                                </span>
                  </div>
                            </div>
                          )}
                </div>
              ))}
            </div>
          </ScrollArea>
                </CardContent>
              </Card>

              {/* Reply Section */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Reply className="w-5 h-5 text-primary" />
                    Reply to Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reply-message">Your Message</Label>
                      <Textarea
                        id="reply-message"
                        placeholder="Type your reply to the client..."
                        rows={4}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Priority</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
            </div>
              <Button
                        onClick={handleReply}
                        disabled={sendMessage.isPending || !replyMessage.trim()}
                        className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
              >
                        <Send className="w-4 h-4 mr-2" />
                        {sendMessage.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </div>
                </CardContent>
        </Card>

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedThread(null)} className="flex-1">
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => archiveMessage.mutate(selectedThread.id)}
                  disabled={archiveMessage.isPending}
                  className="flex-1"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {archiveMessage.isPending ? 'Archiving...' : 'Archive Thread'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => markAsRead.mutate(selectedThread.id)}
                  disabled={markAsRead.isPending}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {markAsRead.isPending ? 'Marking...' : 'Mark as Read'}
                </Button>
              </div>
      </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}