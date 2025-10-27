import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Settings, Mail, Shield, DollarSign, Bell, Save, RefreshCw } from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '../lib/api-hooks';
import { toast } from 'sonner';

export function SettingsView() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: settings = [], isLoading: settingsLoading } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();

  const handleSave = async (settingId: string, value: string | number | boolean) => {
    setIsLoading(true);
    try {
      await updateSetting.mutateAsync({ id: settingId, value });
      toast.success('Setting updated successfully');
    } catch (error) {
      toast.error('Failed to update setting');
    } finally {
      setIsLoading(false);
    }
  };

  const getSettingValue = (settingId: string) => {
    return settings.find(s => s.id === settingId)?.value || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">System Settings</h1>
        <p className="text-muted-foreground">Configure system preferences, thresholds, and integrations</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5">
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
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Platform Information</CardTitle>
              <CardDescription className="text-muted-foreground">Basic details about your PayStreet admin portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name" className="text-foreground font-medium">Platform Name</Label>
                <Input 
                  id="platform-name" 
                  defaultValue="PayStreet Admin Portal" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email" className="text-foreground font-medium">Support Email</Label>
                <Input 
                  id="support-email" 
                  type="email" 
                  defaultValue="support@paystreet.com" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-foreground font-medium">Timezone</Label>
                <Input 
                  id="timezone" 
                  defaultValue="UTC +00:00" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">API Configuration</CardTitle>
              <CardDescription className="text-muted-foreground">Manage external API integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-foreground font-medium">API Key</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  defaultValue="sk_live_••••••••••••••••" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url" className="text-foreground font-medium">Webhook URL</Label>
                <Input 
                  id="webhook-url" 
                  defaultValue="https://api.paystreet.com/webhooks" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Regenerate API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">SMTP Configuration</CardTitle>
              <CardDescription className="text-muted-foreground">Configure email sending service (SendGrid/SMTP)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="smtp-host" className="text-foreground font-medium">SMTP Host</Label>
                <Input 
                  id="smtp-host" 
                  defaultValue="smtp.sendgrid.net" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp-port" className="text-foreground font-medium">Port</Label>
                  <Input 
                    id="smtp-port" 
                    defaultValue="587" 
                    className="bg-input-background text-foreground border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user" className="text-foreground font-medium">Username</Label>
                  <Input 
                    id="smtp-user" 
                    defaultValue="apikey" 
                    className="bg-input-background text-foreground border-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-pass" className="text-foreground font-medium">Password / API Key</Label>
                <Input 
                  id="smtp-pass" 
                  type="password" 
                  defaultValue="••••••••••••••••" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Configuration
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Email Templates</CardTitle>
              <CardDescription className="text-muted-foreground">Customize automated email templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="kyc-approval" className="text-foreground font-medium">KYC Approval Email</Label>
                <Textarea
                  id="kyc-approval"
                  rows={4}
                  defaultValue="Dear {{client_name}}, Your KYC application has been approved. You can now access all platform features."
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kyc-rejection" className="text-foreground font-medium">KYC Rejection Email</Label>
                <Textarea
                  id="kyc-rejection"
                  rows={4}
                  defaultValue={getSettingValue('setting-6') as string}
                  className="bg-input-background text-foreground border-input"
                  onChange={(e) => handleSave('setting-6', e.target.value)}
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Update Templates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-6 mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Transaction Thresholds</CardTitle>
              <CardDescription className="text-muted-foreground">Set limits for automatic transaction flagging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="single-tx-limit" className="text-foreground font-medium">Single Transaction Limit (USD)</Label>
                <Input 
                  id="single-tx-limit" 
                  type="number" 
                  defaultValue={getSettingValue('setting-2') as number} 
                  className="bg-input-background text-foreground border-input"
                  onChange={(e) => handleSave('setting-2', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Transactions above this amount will be flagged for review
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="daily-limit" className="text-foreground font-medium">Daily Transaction Limit (USD)</Label>
                <Input 
                  id="daily-limit" 
                  type="number" 
                  defaultValue="500000" 
                  className="bg-input-background text-foreground border-input"
                />
                <p className="text-xs text-muted-foreground">
                  Total daily volume above this will trigger alerts
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-limit" className="text-foreground font-medium">Monthly Transaction Limit (USD)</Label>
                <Input 
                  id="monthly-limit" 
                  type="number" 
                  defaultValue="5000000" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Update Thresholds
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Risk Score Thresholds</CardTitle>
              <CardDescription className="text-muted-foreground">Configure risk assessment parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="low-risk" className="text-foreground font-medium">Low Risk Threshold</Label>
                <Input 
                  id="low-risk" 
                  type="number" 
                  defaultValue="30" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium-risk" className="text-foreground font-medium">Medium Risk Threshold</Label>
                <Input 
                  id="medium-risk" 
                  type="number" 
                  defaultValue="60" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="high-risk" className="text-foreground font-medium">High Risk Threshold</Label>
                <Input 
                  id="high-risk" 
                  type="number" 
                  defaultValue="80" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Notification Preferences</CardTitle>
              <CardDescription className="text-muted-foreground">Configure alert and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">Transaction Alerts</div>
                  <div className="text-xs text-muted-foreground">Get notified about flagged transactions</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">KYC Application Updates</div>
                  <div className="text-xs text-muted-foreground">Alerts for new KYC submissions</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">System Alerts</div>
                  <div className="text-xs text-muted-foreground">Important system notifications</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">Daily Digest</div>
                  <div className="text-xs text-muted-foreground">Receive daily summary email</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">Compliance Warnings</div>
                  <div className="text-xs text-muted-foreground">Critical compliance alerts</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Security Settings</CardTitle>
              <CardDescription className="text-muted-foreground">Manage authentication and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">Enforce Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground">Require 2FA for all admin users</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">Session Timeout</div>
                  <div className="text-xs text-muted-foreground">Auto-logout after inactivity</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-duration" className="text-foreground font-medium">Session Duration (minutes)</Label>
                <Input 
                  id="session-duration" 
                  type="number" 
                  defaultValue="30" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-min" className="text-foreground font-medium">Minimum Password Length</Label>
                <Input 
                  id="password-min" 
                  type="number" 
                  defaultValue="12" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">IP Whitelist</div>
                  <div className="text-xs text-muted-foreground">Restrict access to specific IPs</div>
                </div>
                <Switch />
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Update Security Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Change Password</CardTitle>
              <CardDescription className="text-muted-foreground">Update your admin account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-foreground font-medium">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-foreground font-medium">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground font-medium">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  className="bg-input-background text-foreground border-input"
                />
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
