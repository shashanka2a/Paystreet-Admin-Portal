import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Search, Download, Activity } from 'lucide-react';

const auditLogs = [
  {
    id: 1,
    timestamp: '2025-10-13 14:32:15',
    user: 'Sarah Mitchell',
    action: 'KYC Approved',
    target: 'Acme Corporation Ltd',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 2,
    timestamp: '2025-10-13 14:15:42',
    user: 'Michael Roberts',
    action: 'Account Suspended',
    target: 'Global Imports LLC',
    ipAddress: '192.168.1.105',
    status: 'success',
  },
  {
    id: 3,
    timestamp: '2025-10-13 13:48:20',
    user: 'Lisa Kennedy',
    action: 'Transaction Flagged',
    target: 'TX-2025-0846',
    ipAddress: '192.168.1.102',
    status: 'warning',
  },
  {
    id: 4,
    timestamp: '2025-10-13 12:22:33',
    user: 'System',
    action: 'Automated Risk Alert',
    target: 'TechVentures Inc',
    ipAddress: '127.0.0.1',
    status: 'info',
  },
  {
    id: 5,
    timestamp: '2025-10-13 11:55:10',
    user: 'Sarah Mitchell',
    action: 'Login Successful',
    target: 'Admin Portal',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 6,
    timestamp: '2025-10-13 11:30:45',
    user: 'David Chen',
    action: 'Client Data Updated',
    target: 'Innovation Hub Ltd',
    ipAddress: '192.168.1.108',
    status: 'success',
  },
  {
    id: 7,
    timestamp: '2025-10-13 10:12:18',
    user: 'Michael Roberts',
    action: 'Document Downloaded',
    target: 'KYC-2025-0847.pdf',
    ipAddress: '192.168.1.105',
    status: 'success',
  },
  {
    id: 8,
    timestamp: '2025-10-13 09:45:33',
    user: 'System',
    action: 'Compliance Threshold Alert',
    target: 'TX-2025-0845',
    ipAddress: '127.0.0.1',
    status: 'warning',
  },
  {
    id: 9,
    timestamp: '2025-10-13 09:22:55',
    user: 'Lisa Kennedy',
    action: 'User Role Modified',
    target: 'Emma Wilson',
    ipAddress: '192.168.1.102',
    status: 'success',
  },
  {
    id: 10,
    timestamp: '2025-10-13 08:50:12',
    user: 'Sarah Mitchell',
    action: 'Settings Updated',
    target: 'Email Templates',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
];

export function AuditLogView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Audit Log</h1>
          <p className="text-muted-foreground">Complete history of system activities and changes</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Actions</CardTitle>
            <Activity className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Successful</CardTitle>
            <Activity className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,189</div>
            <p className="text-xs text-muted-foreground mt-1">95.3% success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Warnings</CardTitle>
            <Activity className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Failed</CardTitle>
            <Activity className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">11</div>
            <p className="text-xs text-muted-foreground mt-1">System errors</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search audit logs..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter by User
              </Button>
              <Button variant="outline" size="sm">
                Filter by Action
              </Button>
              <Button variant="outline" size="sm">
                Date Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-450px)]">
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-muted/50 rounded-lg hover:bg-muted hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border border-border cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge
                          variant="secondary"
                          className={`group-hover:scale-105 transition-transform duration-200 ${
                            log.status === 'success'
                              ? 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200 font-semibold'
                              : log.status === 'warning'
                              ? 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200 font-semibold'
                              : 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200 font-semibold'
                          }`}
                        >
                          {log.status}
                        </Badge>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">{log.action}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="text-muted-foreground">
                          <span className="font-medium text-foreground">User:</span> {log.user}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium text-foreground">Target:</span> {log.target}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium text-foreground">IP:</span> {log.ipAddress}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium text-foreground">Time:</span> {log.timestamp}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-primary/10 group-hover:scale-105 transition-all duration-200">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
