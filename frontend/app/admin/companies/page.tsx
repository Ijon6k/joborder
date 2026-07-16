'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCompanies, useCases } from '@/lib/hooks/useApi';

export default function CompaniesPage() {
  const router = useRouter();

  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();
  const { data: cases = [], isLoading: loadingCases } = useCases();

  const isLoading = loadingCompanies || loadingCases;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[13px] text-zinc-500 italic">
        Memuat direktori perusahaan...
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#1d2327]">
      {/* Page description */}
      <div className="mb-4">
        <h2 className="text-[18px] font-normal text-[#1d2327]">
          Direktori Perusahaan Penempatan
        </h2>
        <p className="text-[#5b6474] text-[13px] mt-1">
          Seluruh perusahaan penempatan terdaftar di portal SIPELMI. Klik nama perusahaan untuk melihat profil lengkap, riwayat kasus, dan mengubah status kepatuhan.
        </p>
      </div>

      {/* Main List Table Card */}
      <div className="bg-white border border-[#ccd0d4] rounded-none shadow-none overflow-hidden">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className=" border-b border-[#ccd0d4] text-[11px] font-normal text-[#5b6474] select-none">
              <th className="px-5 py-3">Nama Perusahaan</th>
              <th className="px-5 py-3">NIB</th>
              <th className="px-5 py-3">SIP3MI</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Laporan (Ditinjau/Total)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5] font-normal">
            {companies.map((item) => {
              // Calculate case counters
              const totalCases = cases.filter((c) => c.companyId === item.id).length;
              const reviewedCases = cases.filter((c) => c.companyId === item.id && c.statusTinjauan === 'ditinjau').length;

              return (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/admin/companies/${item.id}`)}
                  className="hover:bg-[#f6f7f7]/60 cursor-pointer transition-colors duration-75"
                >
                  <td className="px-5 py-3.5 font-normal text-[#1f5aa8] hover:underline">
                    {item.nama}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.nib}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.sip3mi}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-normal border ${item.status === 'blacklist'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : item.status === 'netral'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-zinc-50 text-[#54606e] border-zinc-200'
                        }`}
                    >
                      {item.status === 'blacklist' && 'Blacklist'}
                      {item.status === 'netral' && 'Netral'}
                      {item.status === 'tidak_cukup_info' && 'Tidak Cukup Info'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474] font-normal">
                    {reviewedCases} / {totalCases}
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
