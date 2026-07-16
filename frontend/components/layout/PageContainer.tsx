import React from 'react';

export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 p-5 overflow-y-auto w-full box-border max-w-[1400px] mx-auto">
      {children}
    </main>
  );
}
