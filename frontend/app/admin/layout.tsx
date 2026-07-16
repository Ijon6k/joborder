import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import PageContainer from '@/components/layout/PageContainer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f0f0f1] text-[#1d2327]">


      {/* WP Admin Bar spans full screen width */}
      <Topbar />

      {/* Split layout below the top bars */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left panel vertical navigation */}
        <Sidebar />

        {/* Right panel view area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Centered padding viewport */}
          <PageContainer>{children}</PageContainer>
        </div>
      </div>
    </div>
  );
}
