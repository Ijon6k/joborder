'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Home, User } from 'lucide-react';

export default function Topbar() {
  const pathname = usePathname();

  // Helper to dynamically resolve titles
  const getPageTitle = (path: string) => {
    if (path.startsWith('/admin/dashboard')) return 'Dashboard';
    if (path.startsWith('/admin/case-reviews/')) {
      // Dynamic id subroute
      return 'Detail Laporan Kasus';
    }
    if (path.startsWith('/admin/case-reviews')) return 'Antrian Tinjauan Laporan Kasus';
    if (path.startsWith('/admin/contract-reviews/')) {
      // Dynamic id subroute
      return 'Detail Pengajuan Perjanjian';
    }
    if (path.startsWith('/admin/contract-reviews')) return 'Tinjauan Perjanjian Kerja';
    if (path.startsWith('/admin/companies')) return 'Direktori Perusahaan';
    if (path.startsWith('/admin/pmi')) return 'Data Tenaga Kerja';
    return 'SIPELMI Admin Portal';
  };

  const title = getPageTitle(pathname);

  return (
    <header className="flex flex-col flex-shrink-0 w-full relative z-30 select-none">
      {/* WordPress-style Admin Toolbar */}
      <div className="h-[32px] w-full bg-[#1d2327] text-[#dbe4f2] text-[12px] flex items-center justify-between px-3 border-b border-black/10">
        <div className="flex items-center gap-2">
          <Home className="w-[13px] h-[13px] text-[#8ea3c4]" />
          <span className="font-semibold text-[#f0f0f1]">
            Sistem Informasi Pelindungan Tenaga Kerja (SIPELMI)
          </span>
        </div>
        <div className="flex items-center gap-2.5 cursor-pointer hover:text-white px-2 py-0.5 rounded-sm hover:bg-[#2c3338]">
          <span className="font-medium">Admin</span>
          <div className="w-[18px] h-[18px] rounded-full bg-[#8ea3c4] flex items-center justify-center text-white overflow-hidden">
            <User className="w-[12px] h-[12px]" />
          </div>
        </div>
      </div>

      {/* Sub-header / WP Page Header */}
      <div className="h-[52px] bg-white border-b border-[#ccd0d4] flex items-center justify-between px-6">
        <h1 className="text-[20px] font-bold text-[#1d2327] tracking-tight">
          {title}
        </h1>
        {/* Placeholder date display matching SIPELMI layout */}
        <div className="text-[12px] text-[#5b6474] font-medium">
          16 Juli 2026
        </div>
      </div>
    </header>
  );
}
