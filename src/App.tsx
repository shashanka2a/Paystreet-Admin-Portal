"use client";

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { KYCView } from './components/KYCView';
import { KYBView } from './components/KYBView';
import { ClientsView } from './components/ClientsView';
import { TransactionsView } from './components/TransactionsView';
import { MessagesView } from './components/MessagesView';
import { RolesView } from './components/RolesView';
import { AuditLogView } from './components/AuditLogView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'kyc':
        return <KYCView />;
      case 'kyb':
        return <KYBView />;
      case 'clients':
        return <ClientsView />;
      case 'transactions':
        return <TransactionsView />;
      case 'messages':
        return <MessagesView />;
      case 'roles':
        return <RolesView />;
      case 'audit':
        return <AuditLogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#121212]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
