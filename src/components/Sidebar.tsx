"use client";

import {
  LayoutDashboard,
  UserCheck,
  Building2,
  Users,
  ArrowLeftRight,
  MessageSquare,
  Shield,
  FileText,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'kyc', label: 'KYC Management', icon: UserCheck },
  { id: 'kyb', label: 'KYB Management', icon: Building2 },
  { id: 'clients', label: 'Client Profiles', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'roles', label: 'User Roles', icon: Shield },
  { id: 'audit', label: 'Audit Log', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent text-2xl font-bold">
          PayStreet
        </h1>
        <p className="text-sm text-sidebar-foreground mt-1">Admin Portal v2</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-lg paystreet-glow'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary-foreground rounded-r" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
