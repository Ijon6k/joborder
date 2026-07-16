'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { usePMIs, useCompanies, useCases, useAgreements } from '@/lib/hooks/useApi';

export default function DashboardPage() {
  const router = useRouter();

  // Fetch all collections using React Query hooks
  const { data: pmis = [], isLoading: loadingPmis } = usePMIs();
  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();
  const { data: cases = [], isLoading: loadingCases } = useCases();
  const { data: agreements = [], isLoading: loadingAgreements } = useAgreements();

  const isLoading = loadingPmis || loadingCompanies || loadingCases || loadingAgreements;

  // 1. Calculate dynamic counts from mock API collections
  const pendingCasesCount = cases.filter((c) => c.statusTinjauan === 'menunggu').length;
  const pendingAgreementsCount = agreements.filter((a) => a.status === 'menunggu').length;

  const countTidakCukupInfo = companies.filter((c) => c.status === 'tidak_cukup_info').length;
  const countNetral = companies.filter((c) => c.status === 'netral').length;
  const countBlacklist = companies.filter((c) => c.status === 'blacklist').length;

  // 2. Fetch pending agreements and join with PMI & Company names
  const pendingAgreementsList = agreements.filter((a) => a.status === 'menunggu')
    .slice(0, 5) // Limit to top 5
    .map((a) => {
      const pmi = pmis.find((p) => p.id === a.pmiId);
      const company = companies.find((c) => c.id === a.companyId);
      return {
        id: a.id,
        pmiName: pmi ? pmi.nama : 'Unknown PMI',
        companyName: company ? company.nama : 'Unknown Company',
        posisi: a.posisi,
        tglPengajuan: a.tglPengajuan,
      };
    });

  // 3. Companies with most cases (limit to top 5)
  const topCompaniesWithCases = companies.map((company) => {
    const totalCasesCount = cases.filter((c) => c.companyId === company.id).length;
    return {
      ...company,
      totalCasesCount,
    };
  })
    .filter((c) => c.totalCasesCount > 0)
    .sort((a, b) => b.totalCasesCount - a.totalCasesCount)
    .slice(0, 3);

  // Bar heights mapping to case counts per month (mock trend matching the screenshot)
  const chartData = [
    { label: 'Jan', value: 450 },
    { label: 'Feb', value: 450 },
    { label: 'Mar', value: 450 },
    { label: 'Apr', value: 450 },
    { label: 'May', value: 450 },
    { label: 'Jun', value: 450 },
    { label: 'Jul', value: 450 },
    { label: 'Aug', value: 450 },
    { label: 'Sep', value: 450 },
    { label: 'Oct', value: 450 },
    { label: 'Nov', value: 450 },
    { label: 'Des', value: 450 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[13px] text-zinc-500 italic">
        Memuat Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#1d2327] font-normal">
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Card 1: Laporan Kasus */}
        <div className="bg-white border border-[#ccd0d4] p-5 flex flex-col justify-between min-h-[190px] shadow-none rounded-none">
          <div>
            <h3 className="text-[13px] font-medium text-[#5b6474]">
              Laporan Menunggu Tinjauan
            </h3>
            <span className="text-[36px] font-semibold text-[#1d2327] block mt-1.5 leading-none">
              {pendingCasesCount}
            </span>
          </div>
          <div className="text-right">
            <Link
              href="/admin/case-reviews"
              className="text-[#1f5aa8] hover:text-[#163f78] text-[12.5px] font-semibold underline transition-colors"
            >
              Akses Halaman
            </Link>
          </div>
        </div>

        {/* Card 2: Perjanjian Kerja */}
        <div className="bg-white border border-[#ccd0d4] p-5 flex flex-col justify-between min-h-[190px] shadow-none rounded-none">
          <div>
            <h3 className="text-[13px] font-medium text-[#5b6474]">
              Perjanjian Kerja Menunggu Keputusan
            </h3>
            <span className="text-[36px] font-semibold text-[#1d2327] block mt-1.5 leading-none">
              {pendingAgreementsCount}
            </span>
          </div>
          <div className="text-right">
            <Link
              href="/admin/contract-reviews"
              className="text-[#1f5aa8] hover:text-[#163f78] text-[12.5px] font-semibold underline transition-colors"
            >
              Akses Halaman
            </Link>
          </div>
        </div>

        {/* Card 3: Ringkasan Perusahaan */}
        <div className="bg-white border border-[#ccd0d4] p-5 flex flex-col justify-between min-h-[190px] shadow-none rounded-none">
          <div>
            <h3 className="text-[13px] font-medium text-[#5b6474]">
              Ringkasan Status Perusahaan
            </h3>

            {/* Status breakdown preview matching prototype design (left bullet + label, right count) */}
            <div className="space-y-1.5 mt-3 text-[13px] font-normal w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8a97a6] inline-block" />
                  <span className="text-zinc-700">Tidak Cukup Info</span>
                </div>
                <span className="font-semibold text-zinc-900">{countTidakCukupInfo}</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1ea34f] inline-block" />
                  <span className="text-zinc-700">Netral</span>
                </div>
                <span className="font-semibold text-zinc-900">{countNetral}</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d33a2c] inline-block" />
                  <span className="text-zinc-700">Blacklist</span>
                </div>
                <span className="font-semibold text-zinc-900">{countBlacklist}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Link
              href="/admin/companies"
              className="text-[#1f5aa8] hover:text-[#163f78] text-[12.5px] font-semibold underline transition-colors"
            >
              Akses Halaman
            </Link>
          </div>
        </div>

      </div>

      {/* Case Reporting Trend Bar Chart */}
      <div className="bg-white border border-[#ccd0d4] shadow-none rounded-none">
        {/* Chart Header */}
        <div className="px-5 py-4 border-b border-[#ccd0d4] flex items-center justify-between">
          <h3 className="text-[14px] font-normal text-[#1d2327] flex items-center gap-1">
            Tren Pelaporan Kasus
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </h3>
        </div>

        {/* Chart Canvas Area */}
        <div className="p-6 relative">

          <div className="flex gap-4 relative">

            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[11px] font-semibold text-zinc-400 w-10 text-right select-none pr-2 h-[200px]">
              <span>500</span>
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
            </div>

            {/* Chart Graphic Area */}
            <div className="flex-1 relative h-[200px] border-b border-zinc-200">

              {/* Horizontal gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none">
                <div className="w-full border-t border-zinc-100" />
                <div className="w-full border-t border-zinc-100" />
                <div className="w-full border-t border-zinc-100" />
                <div className="w-full border-t border-zinc-100" />
                <div className="w-full" />
              </div>

              {/* Flex bars container */}
              <div className="absolute inset-0 flex items-end justify-around px-4">
                {chartData.map((data, index) => {
                  const percentage = (data.value / 500) * 100;
                  return (
                    <div
                      key={index}
                      style={{ height: `${percentage}%` }}
                      className="group flex flex-col items-center w-full max-w-[28px] relative"
                    >
                      {/* Tooltip */}
                      <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm transition-opacity duration-150 z-20 font-normal">
                        {data.value}
                      </span>
                      {/* Bar Column */}
                      <div
                        className="w-full h-full bg-[#1f5aa8] hover:bg-[#163f78] transition-all duration-150"
                      />
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* X-Axis Labels */}
          <div className="flex gap-4 mt-2">
            <div className="w-10" /> {/* Y-Axis padding spacer */}
            <div className="flex-1 flex justify-around px-4 text-[11px] font-bold text-zinc-500  tracking-wide">
              {chartData.map((data, index) => (
                <span key={index} className="w-full max-w-[28px] text-center block">
                  {data.label}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Two Lower Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Lower Left Column: Table of Pending Contract Reviews */}
        <div className="lg:col-span-8 bg-white border border-[#ccd0d4] shadow-none rounded-none">
          <div className="px-5 py-4 border-b border-[#ccd0d4] flex items-center justify-between">
            <h3 className="text-[14px] font-normal text-[#1d2327] flex items-center gap-1">
              Perjanjian Kerja Menunggu Keputusan
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </h3>
          </div>

          <div className="overflow-x-auto">
            {pendingAgreementsList.length === 0 ? (
              <div className="p-5 text-center text-zinc-500 text-[13px] italic">
                Tidak ada perjanjian kerja yang menunggu keputusan.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className=" border-b border-[#ccd0d4] text-[11px] font-normal text-[#5b6474] select-none">
                    <th className="px-5 py-3">Nama Pekerja</th>
                    <th className="px-5 py-3">Perusahaan</th>
                    <th className="px-5 py-3">Pekerjaan</th>
                    <th className="px-5 py-3">Tgl Pengajuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5] font-normal">
                  {pendingAgreementsList.map((contract) => (
                    <tr
                      key={contract.id}
                      onClick={() => router.push(`/admin/contract-reviews/${contract.id}`)}
                      className="hover:bg-[#f6f7f7]/60 cursor-pointer transition-colors duration-75"
                    >
                      <td className="px-5 py-3.5 font-normal text-[#1f5aa8] hover:underline">
                        {contract.pmiName}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-750">
                        {contract.companyName}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-500">
                        {contract.posisi}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-500">
                        {contract.tglPengajuan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Lower Right Column: placeholder list for top companies */}
        <div className="lg:col-span-4 bg-white border border-[#ccd0d4] shadow-none rounded-none">
          <div className="px-5 py-4 border-b border-[#ccd0d4] flex items-center justify-between">
            <h3 className="text-[14px] font-normal text-[#1d2327] flex items-center gap-1">
              Perusahaan dengan Kasus Terbanyak
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </h3>
          </div>

          <div className="p-5 space-y-4">
            {topCompaniesWithCases.length === 0 ? (
              <div className="text-[12px] text-zinc-400 italic">
                Belum ada laporan kasus yang tercatat terhadap perusahaan mana pun.
              </div>
            ) : (
              <div className="space-y-3">
                {topCompaniesWithCases.map((company) => (
                  <div key={company.id} className="border border-zinc-200 p-3 flex justify-between items-center rounded-none bg-white">
                    <div>
                      <h4 className="font-normal text-[13px] text-zinc-800 hover:text-[#1f5aa8]">
                        <Link href={`/admin/companies/${company.id}`}>{company.nama}</Link>
                      </h4>
                      <span className={`text-[9px] font-normal px-1.5 py-0.5 rounded-none border mt-1 inline-block ${company.status === 'blacklist'
                        ? 'bg-red-50 text-red-500 border-red-100'
                        : company.status === 'netral'
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-100'
                        }`}>
                        {company.status === 'tidak_cukup_info' && 'Tidak Cukup Info'}
                        {company.status === 'blacklist' && 'Blacklist'}
                        {company.status === 'netral' && 'Netral'}
                      </span>
                    </div>
                    <span className="font-normal text-xs text-zinc-500">
                      {company.totalCasesCount} Kasus
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
