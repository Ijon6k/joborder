'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCases, useCompanies } from '@/lib/hooks/useApi';

export default function CaseReviewsPage() {
  const router = useRouter();

  const { data: cases = [], isLoading: loadingCases } = useCases();
  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();

  const isLoading = loadingCases || loadingCompanies;

  // Sort cases: 'menunggu' first, then 'ditinjau'
  const sortedCases = [...cases].sort((a, b) => {
    if (a.statusTinjauan === 'menunggu' && b.statusTinjauan !== 'menunggu') return -1;
    if (a.statusTinjauan !== 'menunggu' && b.statusTinjauan === 'menunggu') return 1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[13px] text-zinc-500 italic">
        Memuat antrian kasus...
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#1d2327]">
      {/* Title description card */}
      <div className="mb-4">
        <h2 className="text-[18px] font-normal text-[#1d2327]">
          Antrian Tinjauan Laporan Kasus
        </h2>
        <p className="text-[#5b6474] text-[13px] mt-1">
          Laporan dari PMI yang perlu ditinjau satu per satu oleh admin untuk menentukan tindakan lebih lanjut.
        </p>
      </div>

      {/* Main List Table Card */}
      <div className="bg-white border border-[#ccd0d4] rounded-none shadow-none overflow-hidden">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className=" border-b border-[#ccd0d4] text-[11px] font-normal text-[#5b6474] select-none">
              <th className="px-5 py-3">Perusahaan Terlapor</th>
              <th className="px-5 py-3">Jenis Kasus</th>
              <th className="px-5 py-3">Tgl Kejadian</th>
              <th className="px-5 py-3">Tgl Lapor</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5] font-normal">
            {sortedCases.map((item) => {
              const company = companies.find((c) => c.id === item.companyId);
              const companyName = company ? company.nama : 'Unknown Company';
              const isMenunggu = item.statusTinjauan === 'menunggu';

              return (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/admin/case-reviews/${item.id}`)}
                  className="hover:bg-[#f6f7f7]/60 cursor-pointer transition-colors duration-75"
                >
                  <td className="px-5 py-3.5 font-normal text-[#1f5aa8] hover:underline">
                    {companyName}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.jenis}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.tglKejadian}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.tglLapor}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-normal border ${isMenunggu
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                    >
                      {isMenunggu ? 'Menunggu Tinjauan' : 'Sudah Ditinjau'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
