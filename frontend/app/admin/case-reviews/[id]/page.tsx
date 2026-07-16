import React from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CaseReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="bg-white border border-[#ccd0d4] p-5 shadow-sm">
      <h2 className="text-[16px] font-bold text-[#1d2327] mb-2">
        Detail Laporan Kasus: #{id}
      </h2>
      <p className="text-zinc-600 text-[13px]">
        Ini adalah halaman rincian untuk laporan kasus dengan ID <strong>{id}</strong>. Fitur peninjauan dan perubahan status perusahaan terkait akan tersedia di sini pada fase berikutnya.
      </p>
    </div>
  );
}
