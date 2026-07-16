import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function DashboardPage() {
  // Mock data for lower table
  const pendingContracts = [
    { name: 'Ahmad Fauzi', company: 'PT. Maju Bersama', job: 'Construction Worker', date: '14 Jul 2026' },
    { name: 'Siti Aminah', company: 'PT. Global Penempatan', job: 'Domestic Helper', date: '15 Jul 2026' },
    { name: 'Budi Santoso', company: 'PT. Sejahtera Jaya', job: 'Factory Operator', date: '16 Jul 2026' },
  ];

  // Bar heights mapping to mock chart values (value / 500 * 100%)
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

  return (
    <div className="space-y-6 text-[#1d2327]">
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Laporan Kasus */}
        <div className="bg-white border border-[#ccd0d4] p-5 flex flex-col justify-between h-[150px] shadow-sm">
          <div>
            <h3 className="text-[13px] font-bold text-[#5b6474] uppercase tracking-wider">
              Laporan Menunggu Tinjauan
            </h3>
            <span className="text-[36px] font-extrabold text-[#1d2327] block mt-2">
              50
            </span>
          </div>
          <div className="text-right">
            <Link
              href="/admin/case-reviews"
              className="text-[#1f5aa8] hover:text-[#163f78] text-[12px] font-bold underline transition-colors"
            >
              Akses Halaman
            </Link>
          </div>
        </div>

        {/* Card 2: Perjanjian Kerja */}
        <div className="bg-white border border-[#ccd0d4] p-5 flex flex-col justify-between h-[150px] shadow-sm">
          <div>
            <h3 className="text-[13px] font-bold text-[#5b6474] uppercase tracking-wider">
              Perjanjian Menunggu Keputusan
            </h3>
            <span className="text-[36px] font-extrabold text-[#1d2327] block mt-2">
              50
            </span>
          </div>
          <div className="text-right">
            <Link
              href="/admin/contract-reviews"
              className="text-[#1f5aa8] hover:text-[#163f78] text-[12px] font-bold underline transition-colors"
            >
              Akses Halaman
            </Link>
          </div>
        </div>

        {/* Card 3: Ringkasan Perusahaan */}
        <div className="bg-white border border-[#ccd0d4] p-5 flex flex-col justify-between h-[150px] shadow-sm">
          <div>
            <h3 className="text-[13px] font-bold text-[#5b6474] uppercase tracking-wider">
              Ringkasan Status Perusahaan
            </h3>
            
            {/* Status breakdown preview matching template style */}
            <div className="flex gap-4 mt-3 text-[12px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8a97a6]" />
                <span className="text-zinc-500">TCI: 12</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1ea34f]" />
                <span className="text-zinc-500">Netral: 45</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d33a2c]" />
                <span className="text-zinc-500">Blacklist: 8</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Link
              href="/admin/companies"
              className="text-[#1f5aa8] hover:text-[#163f78] text-[12px] font-bold underline transition-colors"
            >
              Akses Halaman
            </Link>
          </div>
        </div>

      </div>

      {/* Case Reporting Trend Bar Chart */}
      <div className="bg-white border border-[#ccd0d4] shadow-sm">
        {/* Chart Header */}
        <div className="px-5 py-4 border-b border-[#ccd0d4] flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[#1d2327] flex items-center gap-1">
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
                      className="group flex flex-col items-center w-full max-w-[28px] relative"
                    >
                      {/* Tooltip */}
                      <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm transition-opacity duration-150 z-20 font-bold">
                        {data.value}
                      </span>
                      {/* Bar Column */}
                      <div
                        style={{ height: `${percentage}%` }}
                        className="w-full bg-[#1f5aa8] hover:bg-[#163f78] transition-all duration-150"
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
            <div className="flex-1 flex justify-around px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
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
        <div className="lg:col-span-8 bg-white border border-[#ccd0d4] shadow-sm">
          <div className="px-5 py-4 border-b border-[#ccd0d4] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#1d2327] flex items-center gap-1">
              Perjanjian Kerja Menunggu Keputusan
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="bg-[#f6f7f7] border-b border-[#ccd0d4] text-[11px] font-bold text-[#5b6474] uppercase tracking-wider select-none">
                  <th className="px-5 py-3">Nama Pekerja</th>
                  <th className="px-5 py-3">Perusahaan</th>
                  <th className="px-5 py-3">Pekerjaan</th>
                  <th className="px-5 py-3">Tgl Pengajuan</th>
                  <th className="px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {pendingContracts.map((contract, index) => (
                  <tr key={index} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3.5 font-bold text-[#1f5aa8]">
                      {contract.name}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#1d2327]">
                      {contract.company}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">
                      {contract.job}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 font-medium">
                      {contract.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/contract-reviews/${index + 1}`}
                        className="text-[#1f5aa8] hover:text-[#163f78] underline font-bold"
                      >
                        Tinjau
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lower Right Column: placeholder list for top companies */}
        <div className="lg:col-span-4 bg-white border border-[#ccd0d4] shadow-sm">
          <div className="px-5 py-4 border-b border-[#ccd0d4] flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#1d2327] flex items-center gap-1">
              Perusahaan dengan Kasus Terbanyak
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </h3>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="text-[12px] text-zinc-400 italic">
              Daftar perusahaan dengan akumulasi aduan terbanyak dari PMI akan ditampilkan di sini setelah integrasi database selesai.
            </div>
            
            {/* Display simple placeholder list cards */}
            <div className="space-y-3">
              <div className="border border-zinc-100 p-3 flex justify-between items-center rounded-sm">
                <div>
                  <h4 className="font-bold text-[13px] text-zinc-700">PT. Penempatan Bermasalah A</h4>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-red-50 text-red-500 border border-red-100">Blacklist</span>
                </div>
                <span className="font-extrabold text-sm text-zinc-600">12 Kasus</span>
              </div>
              <div className="border border-zinc-100 p-3 flex justify-between items-center rounded-sm">
                <div>
                  <h4 className="font-bold text-[13px] text-zinc-700">PT. Agensi Penempatan B</h4>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-amber-50 text-amber-600 border border-amber-100">Netral</span>
                </div>
                <span className="font-extrabold text-sm text-zinc-600">5 Kasus</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
