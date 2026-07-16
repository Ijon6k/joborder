'use client';

import React from 'react';
import { Home, User } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="flex flex-col flex-shrink-0 w-full relative z-30 select-none">
      {/* WordPress-style Admin Toolbar */}
      <div className="h-[32px] w-full bg-[#1d2327] text-[#dbe4f2] text-[12px] flex items-center justify-between px-3 border-b border-black/10">
        <div className="flex items-center gap-2">
          <Home className="w-[13px] h-[13px] text-[#8ea3c4]" />
          <span className="font-normal text-[#f0f0f1]">
            Sistem Informasi Pelindungan Tenaga Kerja (SIPELMI)
          </span>
        </div>
        <div className="flex items-center gap-2.5 cursor-pointer hover:text-white px-2 py-0.5 rounded-sm hover:bg-[#2c3338]">
          <span className="font-normal">Admin</span>
          <div className="w-[18px] h-[18px] rounded-full bg-[#8ea3c4] flex items-center justify-center text-white overflow-hidden">
            <User className="w-[12px] h-[12px]" />
          </div>
        </div>
      </div>
    </header>
  );
}
