"use client";

import {
  LayoutDashboard,
  UserCheck,
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
  { id: 'kyc', label: 'KYC', icon: UserCheck },
  { id: 'kyb', label: 'KYB', icon: Shield },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'roles', label: 'Roles', icon: Shield },
  { id: 'audit', label: 'Audit Log', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <div className="w-64 bg-black border-r border-[#38B000] flex flex-col">
      <div className="p-6 border-b border-[#38B000]">
        <h1 className="bg-gradient-to-r from-[#38B000] to-[#4ade80] bg-clip-text text-transparent text-2xl font-bold">
          Paystreet
        </h1>
        <p className="text-sm text-white mt-1">Admin Portal</p>
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
                  ? 'bg-[#38B000] text-black font-semibold shadow-lg'
                  : 'text-white hover:bg-[#1a1a1a] hover:text-[#38B000]'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-r" />
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
