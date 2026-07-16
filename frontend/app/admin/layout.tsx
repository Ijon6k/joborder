import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import PageContainer from '@/components/layout/PageContainer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f0f0f1] text-[#1d2327]">
      {/* Left panel vertical navigation */}
      <Sidebar />

      {/* Right panel view area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* WP Admin Bar and Page header */}
        <Topbar />

        {/* Centered padding viewport */}
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}
