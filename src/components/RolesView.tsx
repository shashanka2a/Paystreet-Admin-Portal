import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Shield,
  User,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Key,
  Settings,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { 
  useUsers,
  useRoles,
  useAuditLogs,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  type User as UserType,
  type Role,
  type AuditLogEntry
} from '../lib/api-hooks';
import { format } from 'date-fns';

export function RolesView() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);

  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const { data: auditLogs = [], isLoading: auditLoading } = useAuditLogs();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      suspended: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      'super_admin': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'compliance_officer': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'admin': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'viewer': 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[role as keyof typeof variants]}>
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="w-4 h-4 text-green-600" />;
      case 'update': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'login': return <Key className="w-4 h-4 text-purple-600" />;
      case 'logout': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <Activity className="w-4 h-4 text-orange-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants = {
      create: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      update: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      delete: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      login: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      logout: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
      view: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    };
    
    return (
      <Badge variant="secondary" className={variants[action as keyof typeof variants]}>
        {action}
      </Badge>
    );
  };

  const summaryCards = [
    { 
      title: 'Total Users', 
      value: users.length.toString(), 
      change: '+8.3%',
      changeType: 'positive',
      icon: Users,
      gradient: 'from-primary to-chart-2'
    },
    { 
      title: 'Active Users', 
      value: users.filter(u => u.status === 'active').length.toString(), 
      change: '+12.5%',
      changeType: 'positive',
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'Admin Roles', 
      value: roles.length.toString(), 
      change: '+5.2%',
      changeType: 'positive',
      icon: Shield,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Audit Events', 
      value: auditLogs.length.toString(), 
      change: '+18.7%',
      changeType: 'positive',
      icon: Activity,
      gradient: 'from-purple-500 to-purple-600'
    },
  ];

  if (usersLoading || rolesLoading || auditLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading user management data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Roles & Audit Log</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, permissions, and audit trail</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
        </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border-border">
        <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => setShowCreateUser(true)}
                  className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 border-border">
                      <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          {getRoleBadge(user.role)}
                        </div>
                  </TableCell>
                  <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          {getStatusBadge(user.status)}
                        </div>
                  </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastLogin ? format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm') : 'Never'}
                  </TableCell>
                  <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                    </Button>
                        </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search roles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => setShowCreateRole(true)}
                  className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <Card key={role.id} className="border-border hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          {role.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRole(role)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRole.mutate({ roleId: role.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-muted-foreground">Description</Label>
                          <div className="text-foreground text-sm">{role.description}</div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Users</Label>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {users.filter(u => u.role === role.name).length} users
                          </Badge>
            </div>
            <div>
                          <Label className="text-sm text-muted-foreground">Permissions</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {role.permissions.slice(0, 3).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search audit logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuditLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/50 border-border">
                        <TableCell className="font-medium text-foreground">{log.userName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            {getActionBadge(log.action)}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{log.resource}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {log.details}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {log.ipAddress}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Details - {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <div className="text-foreground font-medium">{selectedUser.name}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="text-foreground">{selectedUser.email}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Role</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Status</Label>
              <div className="flex items-center gap-2">
                    {getStatusIcon(selectedUser.status)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Last Login</Label>
                  <div className="text-foreground">
                    {selectedUser.lastLogin ? format(new Date(selectedUser.lastLogin), 'dd/MM/yyyy HH:mm') : 'Never'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Created</Label>
                  <div className="text-foreground">
                    {format(new Date(selectedUser.createdAt), 'dd/MM/yyyy HH:mm')}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Label className="text-sm text-muted-foreground mb-2 block">Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedUser.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-foreground">{permission}</span>
                    </div>
                  ))}
                </div>
            </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedUser(null)} className="flex-1">
                  Close
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => updateUser.mutate({ userId: selectedUser.id, status: selectedUser.status === 'active' ? 'suspended' : 'active' })}
                  className="flex-1"
                >
                  {selectedUser.status === 'active' ? 'Suspend' : 'Activate'}
              </Button>
              <Button
                  variant="destructive" 
                  onClick={() => deleteUser.mutate({ userId: selectedUser.id })}
                  className="flex-1"
              >
                  Delete User
              </Button>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}