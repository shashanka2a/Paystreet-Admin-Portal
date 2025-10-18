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
    <div className="bg-black border-b border-[#00A878] px-8 py-4 flex items-center justify-between shadow-lg">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
          <input
            type="text"
            placeholder="Search clients, transactions, KYC applications..."
            className="w-full pl-10 pr-4 py-2 border border-[#00A878] rounded-lg bg-[#1a1a1a] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00A878] focus:border-[#00A878]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-8">
        <button className="relative p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D4D] rounded-full"></span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-[#1a1a1a] rounded-lg p-2 transition-colors">
            <Avatar className="w-9 h-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#00A878] text-black font-bold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-sm text-white font-medium">Admin User</div>
              <div className="text-xs text-white">Super Admin</div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black border border-[#00A878]">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#00A878]" />
            <DropdownMenuItem className="text-white hover:bg-[#1a1a1a]">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-[#1a1a1a]">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#00A878]" />
            <DropdownMenuItem className="text-[#FF4D4D] hover:bg-[#1a1a1a]">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
