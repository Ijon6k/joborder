'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Pmi, Company, Agreement } from '@/lib/mockData';

interface ClientProps {
  agreement: Agreement;
  pmi: Pmi | undefined;
  company: Company | undefined;
}

export default function ContractReviewDetailClient({
  agreement,
  pmi,
  company,
}: ClientProps) {
  // Local state for mocking decisions
  const [status, setStatus] = useState(agreement.status);
  const [catatan, setCatatan] = useState(agreement.catatan);

  const [inputNote, setInputNote] = useState('');

  const handleDecision = (type: 'disetujui' | 'ditolak') => {
    setStatus(type);
    setCatatan(inputNote.trim() || (type === 'disetujui' ? 'Disetujui oleh Admin' : 'Ditolak oleh Admin'));
  };

  const isMenunggu = status === 'menunggu';

  return (
    <div className="space-y-4 text-[#1d2327] font-normal">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/admin/contract-reviews"
          className="flex items-center gap-1 text-[#1f5aa8] hover:text-[#163f78] text-[13px] font-bold underline w-fit select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Tinjauan
        </Link>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Info Cards */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card 1: Data PMI Pemohon */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <h3 className="text-[13.5px] font-bold text-[#1d2327] border-b border-[#ccd0d4] pb-2">
              Data PMI Pemohon
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                  Nama PMI
                </span>
                {pmi ? (
                  <Link
                    href={`/admin/pmi/${pmi.id}`}
                    className="font-bold text-[#1f5aa8] hover:text-[#163f78] underline"
                  >
                    {pmi.nama}
                  </Link>
                ) : (
                  <span className="font-semibold">Unknown PMI</span>
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                  NIK
                </span>
                <span className="font-semibold text-zinc-800">
                  {pmi ? pmi.nik : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Perusahaan Tujuan & Warning */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <div className="flex items-center justify-between border-b border-[#ccd0d4] pb-2">
              <h3 className="text-[13.5px] font-bold text-[#1d2327]">
                Data Perusahaan Tujuan
              </h3>
              {company && (
                <span
                  className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-bold uppercase border ${
                    company.status === 'blacklist'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : company.status === 'netral'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-250'
                  }`}
                >
                  {company.status === 'tidak_cukup_info' ? 'Tidak Cukup Info' : company.status}
                </span>
              )}
            </div>

            <div className="text-[13px] space-y-3">
              <div>
                <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                  Nama Perusahaan
                </span>
                {company ? (
                  <Link
                    href={`/admin/companies/${company.id}`}
                    className="font-bold text-[#1f5aa8] hover:text-[#163f78] underline"
                  >
                    {company.nama}
                  </Link>
                ) : (
                  <span className="font-semibold">Unknown Company</span>
                )}
              </div>

              {company && company.status === 'blacklist' && (
                <div className="bg-red-50/50 border border-red-200 p-3 rounded-none mt-2">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block mb-1">
                    PERINGATAN BLACKLIST
                  </span>
                  <p className="text-zinc-700 text-[12.5px] leading-relaxed">
                    {company.statusLog && company.statusLog[0]
                      ? company.statusLog[0].alasan
                      : 'Perusahaan ini terdaftar dalam daftar hitam karena pelanggaran kepatuhan/aduan kekerasan.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Detail Pengajuan */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <h3 className="text-[13.5px] font-bold text-[#1d2327] border-b border-[#ccd0d4] pb-2">
              Detail Pengajuan Kontrak
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
              <div>
                <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                  Posisi Pekerjaan
                </span>
                <span className="font-semibold text-zinc-800">{agreement.posisi}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                  Negara Tujuan
                </span>
                <span className="font-semibold text-zinc-800">{agreement.negara}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                  Tanggal Pengajuan
                </span>
                <span className="font-semibold text-zinc-800">{agreement.tglPengajuan}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Actions sidepanel */}
        <div className="lg:col-span-4">
          
          {isMenunggu ? (
            <div className="bg-white border border-[#ccd0d4] p-5 shadow-none rounded-none space-y-4">
              <h3 className="text-[13.5px] font-bold text-[#1d2327]">
                Aksi Keputusan Admin
              </h3>
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#5b6474] uppercase tracking-wider">
                  Catatan Keputusan (Opsional)
                </label>
                <textarea
                  value={inputNote}
                  onChange={(e) => setInputNote(e.target.value)}
                  placeholder="Catatan tambahan untuk keputusan persetujuan/penolakan..."
                  className="w-full h-24 p-2.5 bg-white border border-[#ccd0d4] text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 rounded-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1.5">
                <button
                  onClick={() => handleDecision('disetujui')}
                  className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-white text-[13px] font-bold transition-colors duration-100 rounded-none flex items-center justify-center gap-1.5 shadow-none"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Setujui Pengajuan
                </button>
                <button
                  onClick={() => handleDecision('ditolak')}
                  className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white text-[13px] font-bold transition-colors duration-100 rounded-none flex items-center justify-center gap-1.5 shadow-none"
                >
                  <XCircle className="w-4 h-4" />
                  Tolak Pengajuan
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#ccd0d4] p-5 shadow-none rounded-none space-y-3.5">
              <h3 className="text-[13.5px] font-bold text-[#1d2327] border-b border-[#ccd0d4] pb-2">
                Status Keputusan
              </h3>
              <div>
                <span
                  className={`inline-flex px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-none border ${
                    status === 'disetujui'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                </span>
              </div>
              <div className="bg-[#fcfcfc] border border-[#ccd0d4] p-3 text-[13px] leading-relaxed text-zinc-700">
                {catatan}
              </div>
              <span className="block text-[11px] text-[#8a97a6] font-medium mt-1">
                Diproses oleh Admin BP2MI
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
