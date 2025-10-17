"use client";

import { Search, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function TopBar() {
  return (
    <div className="bg-[#1a1a1a] border-b border-[#333333] px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
          <input
            type="text"
            placeholder="Search clients, transactions, KYC applications..."
            className="w-full pl-10 pr-4 py-2 border border-[#333333] rounded-lg bg-[#2a2a2a] text-white placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-[#38B000] focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-8">
        <button className="relative p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-[#b3b3b3]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-[#2a2a2a] rounded-lg p-2 transition-colors">
            <Avatar className="w-9 h-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-[#38B000] to-[#4ade80] text-white">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-sm text-white">Admin User</div>
              <div className="text-xs text-[#b3b3b3]">Super Admin</div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
