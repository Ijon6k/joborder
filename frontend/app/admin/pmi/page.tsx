'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PMIS, CASES, AGREEMENTS } from '@/lib/mockData';

export default function PmiPage() {
  const router = useRouter();

  return (
    <div className="space-y-4 text-[#1d2327]">
      {/* Page description */}
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-[#1d2327]">
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
            <tr className="bg-[#f6f7f7] border-b border-[#ccd0d4] text-[11px] font-bold text-[#5b6474] select-none">
              <th className="px-5 py-3">Nama PMI</th>
              <th className="px-5 py-3">NIK</th>
              <th className="px-5 py-3">Status Akun</th>
              <th className="px-5 py-3">Laporan Kasus</th>
              <th className="px-5 py-3">Perjanjian Kerja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5] font-normal">
            {PMIS.map((item) => {
              // Calculate dynamic counters
              const casesCount = CASES.filter((c) => c.pmiId === item.id).length;
              const agreementsCount = AGREEMENTS.filter((a) => a.pmiId === item.id).length;

              return (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/admin/pmi/${item.id}`)}
                  className="hover:bg-[#f6f7f7]/60 cursor-pointer transition-colors duration-75"
                >
                  <td className="px-5 py-3.5 font-semibold text-[#1f5aa8] hover:underline">
                    {item.nama}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.nik}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-none text-[11px] font-normal uppercase border bg-green-50 text-green-700 border-green-200">
                      {item.statusAkun}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474] font-medium">
                    {casesCount}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474] font-medium">
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
