'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  FileSignature,
  Building2,
  Users,
  LogOut,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Laporan Kasus', href: '/admin/case-reviews', icon: AlertTriangle },
    { name: 'Perjanjian Kerja', href: '/admin/contract-reviews', icon: FileSignature },
    { name: 'Direktori Perusahaan', href: '/admin/companies', icon: Building2 },
    { name: 'Data Tenaga Kerja', href: '/admin/pmi', icon: Users },
  ];

  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#1d2327] text-[#dbe4f2] flex flex-col sticky top-0 h-screen border-r border-[#101416]">
      {/* Logo & Brand Header */}
      <div className="p-4 border-b border-white/5 flex flex-col items-center gap-3">
        {/* Empty Logo Placeholder */}
        <div className="w-[120px] h-[80px] border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-center p-2 rounded-sm text-[10px] text-zinc-400 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src=""
            alt="Logo Kementerian"
            className="max-w-full max-h-full object-contain hidden"
            onError={(e) => {
              // Hide image if empty or error
              e.currentTarget.style.display = 'none';
            }}
          />
          <span>[ Logo ]</span>
          <span className="text-[9px] text-zinc-500 mt-1">Ready to insert src</span>
        </div>
        
        <div className="text-center w-full">
          <h1 className="text-white font-bold text-sm tracking-wide uppercase">
            SIPELMI
          </h1>
          <p className="text-[#8ea3c4] text-[10px] uppercase font-semibold tracking-wider mt-0.5">
            Admin Pemerintah
          </p>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 py-3 flex flex-col gap-[2px] overflow-y-auto px-0">
        {menuItems.map((item) => {
          // Check if active path matching
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-all duration-100 border-l-[4px] relative ${
                isActive
                  ? 'bg-[#2c3338] text-white border-[#72aee6] font-semibold'
                  : 'border-transparent text-[#dbe4f2] hover:bg-[#2c3338] hover:text-[#72aee6]'
              }`}
            >
              <item.icon className="w-[16px] h-[16px] flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout Info */}
      <div className="border-t border-white/5 bg-[#171c1f]">
        <div className="px-4 py-3 text-[11px] text-[#6f84a8] leading-relaxed">
          Masuk sebagai:
          <span className="block text-[#d7e2f5] font-semibold text-[12px] mt-0.5">
            Admin BP2MI
          </span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/10 border-t border-white/5 transition-colors font-medium"
        >
          <LogOut className="w-[14px] h-[14px] flex-shrink-0" />
          Keluar Akun
        </Link>
      </div>
    </aside>
  );
}
