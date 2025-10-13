import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Search, Send, Mail } from 'lucide-react';

const conversations = [
  {
    id: 1,
    client: 'Acme Corporation Ltd',
    lastMessage: 'Thank you for the update on our KYC status',
    time: '10m ago',
    unread: 2,
    status: 'active',
  },
  {
    id: 2,
    client: 'TechVentures Inc',
    lastMessage: 'We have uploaded the requested documents',
    time: '1h ago',
    unread: 0,
    status: 'active',
  },
  {
    id: 3,
    client: 'Global Imports LLC',
    lastMessage: 'Can you clarify the transaction flag?',
    time: '3h ago',
    unread: 1,
    status: 'flagged',
  },
  {
    id: 4,
    client: 'Innovation Hub Ltd',
    lastMessage: 'All information has been verified',
    time: '1d ago',
    unread: 0,
    status: 'resolved',
  },
];

const messages = [
  {
    id: 1,
    sender: 'client',
    content: 'Hello, I wanted to check on the status of our KYC application.',
    timestamp: '2025-10-13 09:15',
  },
  {
    id: 2,
    sender: 'admin',
    content: 'Thank you for reaching out. Your application is currently under review by our compliance team.',
    timestamp: '2025-10-13 09:22',
  },
  {
    id: 3,
    sender: 'client',
    content: 'How long does the review process typically take?',
    timestamp: '2025-10-13 09:25',
  },
  {
    id: 4,
    sender: 'admin',
    content: 'The review process typically takes 2-3 business days. We will notify you once completed.',
    timestamp: '2025-10-13 09:30',
  },
  {
    id: 5,
    sender: 'client',
    content: 'Thank you for the update on our KYC status',
    timestamp: '2025-10-13 14:22',
  },
];

export function MessagesView() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const [sendViaEmail, setSendViaEmail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Communication Center</h1>
        <p className="text-gray-600">Manage client communications and support requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-73px)]">
              <div className="divide-y divide-gray-200">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation.id === conv.id ? 'bg-[#F8F9FB] border-l-4 border-[#6366F1]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm text-gray-900">{conv.client}</span>
                      {conv.unread > 0 && (
                        <Badge variant="secondary" className="bg-[#6366F1] text-white text-xs">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">{conv.lastMessage}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{conv.time}</span>
                      <Badge
                        variant="secondary"
                        className={
                          conv.status === 'flagged'
                            ? 'bg-red-100 text-red-700 text-xs'
                            : conv.status === 'resolved'
                            ? 'bg-green-100 text-green-700 text-xs'
                            : 'bg-gray-100 text-gray-700 text-xs'
                        }
                      >
                        {conv.status}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Thread */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">{selectedConversation.client}</h3>
                <p className="text-xs text-gray-500">Last active: {selectedConversation.time}</p>
              </div>
              <Badge
                variant="secondary"
                className={
                  selectedConversation.status === 'flagged'
                    ? 'bg-red-100 text-red-700'
                    : selectedConversation.status === 'resolved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }
              >
                {selectedConversation.status}
              </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'admin'
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'admin' ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-2">
              <Switch checked={sendViaEmail} onCheckedChange={setSendViaEmail} />
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Send via Email (SMTP/SendGrid)</span>
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
                className="flex-1"
              />
              <Button
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] h-auto"
                onClick={() => setMessageText('')}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
