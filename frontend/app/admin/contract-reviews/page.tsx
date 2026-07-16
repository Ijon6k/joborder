'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAgreements, useCompanies, usePMIs } from '@/lib/hooks/useApi';

export default function ContractReviewsPage() {
  const router = useRouter();

  const { data: agreements = [], isLoading: loadingAgreements } = useAgreements();
  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();
  const { data: pmis = [], isLoading: loadingPmis } = usePMIs();

  const isLoading = loadingAgreements || loadingCompanies || loadingPmis;

  // Sort agreements: 'menunggu' first
  const sortedAgreements = [...agreements].sort((a, b) => {
    if (a.status === 'menunggu' && b.status !== 'menunggu') return -1;
    if (a.status !== 'menunggu' && b.status === 'menunggu') return 1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[13px] text-zinc-500 italic">
        Memuat antrian perjanjian kerja...
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#1d2327]">
      {/* Page description */}
      <div className="mb-4">
        <h2 className="text-[18px] font-normal text-[#1d2327]">
          Tinjauan Pengajuan Perjanjian Kerja
        </h2>
        <p className="text-[#5b6474] text-[13px] mt-1">
          Hanya pengajuan ke perusahaan berstatus Blacklist yang masuk ke antrean tinjauan manual ini. Pengajuan ke perusahaan Netral / Tidak Cukup Info terproses secara otomatis.
        </p>
      </div>

      {/* Main List Table Card */}
      <div className="bg-white border border-[#ccd0d4] rounded-none shadow-none overflow-hidden">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#ccd0d4] text-[11px] font-normal text-[#5b6474] select-none">
              <th className="px-5 py-3">PMI Pemohon</th>
              <th className="px-5 py-3">Perusahaan Tujuan</th>
              <th className="px-5 py-3">Posisi</th>
              <th className="px-5 py-3">Negara</th>
              <th className="px-5 py-3">Tgl Pengajuan</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5] font-normal">
            {sortedAgreements.map((item) => {
              const pmi = pmis.find((p) => p.id === item.pmiId);
              const company = companies.find((c) => c.id === item.companyId);

              const pmiName = pmi ? pmi.nama : 'Unknown PMI';
              const companyName = company ? company.nama : 'Unknown Company';

              return (
                <tr
                  key={item.id}
                  onClick={() => {
                    // Navigate only if it requires review (non-otomatis)
                    if (item.status !== 'otomatis') {
                      router.push(`/admin/contract-reviews/${item.id}`);
                    }
                  }}
                  className={`transition-colors duration-75 ${item.status === 'otomatis'
                      ? 'hover:bg-zinc-50/20 opacity-80'
                      : 'hover:bg-[#f6f7f7]/60 cursor-pointer'
                    }`}
                >
                  <td className={`px-5 py-3.5 font-normal ${item.status !== 'otomatis' ? 'text-[#1f5aa8] hover:underline' : 'text-zinc-700'}`}>
                    {pmiName}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {companyName}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.posisi}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.negara}
                  </td>
                  <td className="px-5 py-3.5 text-[#5b6474]">
                    {item.tglPengajuan}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-normal border ${item.status === 'menunggu'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : item.status === 'disetujui'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : item.status === 'ditolak'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-zinc-50 text-zinc-650 border-[#ccd0d4]'
                        }`}
                    >
                      {item.status === 'menunggu' && 'Menunggu'}
                      {item.status === 'disetujui' && 'Disetujui'}
                      {item.status === 'ditolak' && 'Ditolak'}
                      {item.status === 'otomatis' && 'Otomatis Valid'}
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
