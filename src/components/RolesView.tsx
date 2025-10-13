import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { UserPlus, Shield, Mail } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah.m@paystreet.com',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '2025-10-13 14:30',
    twoFactor: true,
  },
  {
    id: 2,
    name: 'Michael Roberts',
    email: 'mike.r@paystreet.com',
    role: 'Compliance Officer',
    status: 'active',
    lastLogin: '2025-10-13 09:15',
    twoFactor: true,
  },
  {
    id: 3,
    name: 'Lisa Kennedy',
    email: 'lisa.k@paystreet.com',
    role: 'Compliance Officer',
    status: 'active',
    lastLogin: '2025-10-12 16:45',
    twoFactor: false,
  },
  {
    id: 4,
    name: 'David Chen',
    email: 'david.c@paystreet.com',
    role: 'Support Admin',
    status: 'active',
    lastLogin: '2025-10-13 11:20',
    twoFactor: true,
  },
  {
    id: 5,
    name: 'Emma Wilson',
    email: 'emma.w@paystreet.com',
    role: 'Compliance Officer',
    status: 'inactive',
    lastLogin: '2025-10-05 14:00',
    twoFactor: true,
  },
];

export function RolesView() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    twoFactor: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Roles & Users</h1>
          <p className="text-gray-600">Manage admin users and their permissions</p>
        </div>
        <Button
          onClick={() => setShowAddUserDialog(true)}
          className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Total Admins</CardTitle>
            <Shield className="w-5 h-5 text-[#6366F1]" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{users.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Super Admins</CardTitle>
            <Shield className="w-5 h-5 text-[#8B5CF6]" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              {users.filter((u) => u.role === 'Super Admin').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Full access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">2FA Enabled</CardTitle>
            <Shield className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              {users.filter((u) => u.twoFactor).length}/{users.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Security active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
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
                <TableHead>2FA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        user.role === 'Super Admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'Compliance Officer'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>
                  <TableCell>
                    {user.twoFactor ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        Disabled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@paystreet.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="compliance-officer">Compliance Officer</SelectItem>
                  <SelectItem value="support-admin">Support Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <Label htmlFor="twoFactor" className="cursor-pointer">
                  Enable Two-Factor Authentication
                </Label>
              </div>
              <Switch
                id="twoFactor"
                checked={newUser.twoFactor}
                onCheckedChange={(checked) => setNewUser({ ...newUser, twoFactor: checked })}
              />
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
                onClick={() => setShowAddUserDialog(false)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
