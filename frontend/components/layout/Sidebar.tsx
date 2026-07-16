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
    <aside className="w-[240px] flex-shrink-0 bg-[#1d2327] text-[#dbe4f2] flex flex-col h-full border-r border-[#101416]">
      {/* Logo & Brand Header */}
      <div className="p-4 border-b border-white/5 flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src=""
          alt="Logo Kementerian Luar Negeri Republik Indonesia"
          className="max-h-[80px] w-auto object-contain"
        />


      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 py-3 flex flex-col justify-between overflow-y-auto px-0">
        <div className="flex flex-col gap-[2px]">
          {menuItems.map((item) => {
            // Check if active path matching
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-normal transition-all duration-100  relative ${isActive
                  ? 'bg-[#2c3338] text-white'
                  : 'border-transparent text-[#dbe4f2] hover:bg-[#2c3338] hover:text-[#72aee6]'
                  }`}
              >
                <item.icon className="w-[16px] h-[16px] flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-normal transition-all duration-100 border-l-[4px] border-transparent text-red-400 hover:bg-[#2c3338] hover:text-red-300"
        >
          <LogOut className="w-[16px] h-[16px] flex-shrink-0" />
          Keluar Akun
        </Link>
      </nav>
    </aside>
  );
}
