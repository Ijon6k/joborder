'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePMIs, useCases, useAgreements } from '@/lib/hooks/useApi';

export default function PmiPage() {
  const router = useRouter();

  const { data: pmis = [], isLoading: loadingPmis } = usePMIs();
  const { data: cases = [], isLoading: loadingCases } = useCases();
  const { data: agreements = [], isLoading: loadingAgreements } = useAgreements();

  const isLoading = loadingPmis || loadingCases || loadingAgreements;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[13px] text-zinc-500 italic">
        Memuat data tenaga kerja...
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#1d2327]">
      {/* Page description */}
      <div className="mb-4">
        <h2 className="text-[18px] font-normal text-[#1d2327]">
          Data Tenaga Kerja (PMI)
        </h2>
        <p className="text-[#5b6474] text-[13px] mt-1">
          Daftar Pekerja Migran Indonesia terdaftar dalam sistem. Klik nama pekerja untuk melihat profil lengkap, riwayat laporan kasus, dan riwayat pengajuan perjanjian kerja mereka.
        </p>
      </div>

      {/* Main List Table Card */}
      <div className="bg-white border border-[#ccd0d4] rounded-none shadow-none overflow-hidden">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className=" border-b border-[#ccd0d4] text-[11px] font-normal text-[#5b6474] select-none">
              <th className="px-5 py-3">Nama PMI</th>
              <th className="px-5 py-3">NIK</th>
              <th className="px-5 py-3">Status Akun</th>
              <th className="px-5 py-3">Laporan Kasus</th>
              <th className="px-5 py-3">Perjanjian Kerja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5] font-normal">
            {pmis.map((item) => {
              // Calculate dynamic counters
              const casesCount = cases.filter((c) => c.pmiId === item.id).length;
              const agreementsCount = agreements.filter((a) => a.pmiId === item.id).length;

              return (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/admin/pmi/${item.id}`)}
                  className="hover:bg-[#f6f7f7]/60 cursor-pointer transition-colors duration-75"
                >
                  <td className="px-5 py-3.5 font-normal text-[#1f5aa8] hover:underline">
                    {item.nama}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.nik}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-none text-[11px] font-normal border bg-green-50 text-green-700 border-green-200">
                      {item.statusAkun}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474] font-normal">
                    {casesCount}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474] font-normal">
                    {agreementsCount}
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
