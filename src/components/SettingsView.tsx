import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Settings, Mail, Shield, DollarSign, Bell } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure system preferences and integrations</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="thresholds">
            <DollarSign className="w-4 h-4 mr-2" />
            Thresholds
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Basic details about your Paystreet admin portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Paystreet Admin Portal" />
              </div>
              <div>
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@paystreet.com" />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="UTC +00:00" />
              </div>
              <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage external API integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" defaultValue="sk_live_••••••••••••••••" />
              </div>
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" defaultValue="https://api.paystreet.com/webhooks" />
              </div>
              <Button variant="outline">Regenerate API Key</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email sending service (SendGrid/SMTP)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.sendgrid.net" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input id="smtp-port" defaultValue="587" />
                </div>
                <div>
                  <Label htmlFor="smtp-user">Username</Label>
                  <Input id="smtp-user" defaultValue="apikey" />
                </div>
              </div>
              <div>
                <Label htmlFor="smtp-pass">Password / API Key</Label>
                <Input id="smtp-pass" type="password" defaultValue="••••••••••••••••" />
              </div>
              <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                Save Configuration
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize automated email templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="kyc-approval">KYC Approval Email</Label>
                <Textarea
                  id="kyc-approval"
                  rows={4}
                  defaultValue="Dear {{client_name}}, Your KYC application has been approved. You can now access all platform features."
                />
              </div>
              <div>
                <Label htmlFor="kyc-rejection">KYC Rejection Email</Label>
                <Textarea
                  id="kyc-rejection"
                  rows={4}
                  defaultValue="Dear {{client_name}}, Unfortunately, we were unable to approve your KYC application. Please contact support for more information."
                />
              </div>
              <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                Update Templates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Thresholds</CardTitle>
              <CardDescription>Set limits for automatic transaction flagging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="single-tx-limit">Single Transaction Limit (USD)</Label>
                <Input id="single-tx-limit" type="number" defaultValue="100000" />
                <p className="text-xs text-gray-500 mt-1">
                  Transactions above this amount will be flagged for review
                </p>
              </div>
              <div>
                <Label htmlFor="daily-limit">Daily Transaction Limit (USD)</Label>
                <Input id="daily-limit" type="number" defaultValue="500000" />
                <p className="text-xs text-gray-500 mt-1">
                  Total daily volume above this will trigger alerts
                </p>
              </div>
              <div>
                <Label htmlFor="monthly-limit">Monthly Transaction Limit (USD)</Label>
                <Input id="monthly-limit" type="number" defaultValue="5000000" />
              </div>
              <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                Update Thresholds
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Score Thresholds</CardTitle>
              <CardDescription>Configure risk assessment parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="low-risk">Low Risk Threshold</Label>
                <Input id="low-risk" type="number" defaultValue="30" />
              </div>
              <div>
                <Label htmlFor="medium-risk">Medium Risk Threshold</Label>
                <Input id="medium-risk" type="number" defaultValue="60" />
              </div>
              <div>
                <Label htmlFor="high-risk">High Risk Threshold</Label>
                <Input id="high-risk" type="number" defaultValue="80" />
              </div>
              <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure alert and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-900">Transaction Alerts</div>
                  <div className="text-xs text-gray-500">Get notified about flagged transactions</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-900">KYC Application Updates</div>
                  <div className="text-xs text-gray-500">Alerts for new KYC submissions</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-900">System Alerts</div>
                  <div className="text-xs text-gray-500">Important system notifications</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-900">Daily Digest</div>
                  <div className="text-xs text-gray-500">Receive daily summary email</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-900">Compliance Warnings</div>
                  <div className="text-xs text-gray-500">Critical compliance alerts</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage authentication and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-900">Enforce Two-Factor Authentication</div>
                  <div className="text-xs text-gray-500">Require 2FA for all admin users</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-900">Session Timeout</div>
                  <div className="text-xs text-gray-500">Auto-logout after inactivity</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                <Input id="session-duration" type="number" defaultValue="30" />
              </div>
              <div>
                <Label htmlFor="password-min">Minimum Password Length</Label>
                <Input id="password-min" type="number" defaultValue="12" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-900">IP Whitelist</div>
                  <div className="text-xs text-gray-500">Restrict access to specific IPs</div>
                </div>
                <Switch />
              </div>
              <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                Update Security Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your admin account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
