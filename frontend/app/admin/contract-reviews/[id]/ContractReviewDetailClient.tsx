'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useAgreement, useCompanies, usePMIs, useUpdateAgreement } from '@/lib/hooks/useApi';

interface ClientProps {
  id: string;
}

export default function ContractReviewDetailClient({ id }: ClientProps) {
  const { data: agreement, isLoading: loadingAgreement } = useAgreement(id);
  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();
  const { data: pmis = [], isLoading: loadingPMIs } = usePMIs();

  const updateAgreementMutation = useUpdateAgreement();
  const [inputNote, setInputNote] = useState('');

  const isLoading = loadingAgreement || loadingCompanies || loadingPMIs;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[13px] text-zinc-500 italic">
        Memuat detail tinjauan...
      </div>
    );
  }

  if (!agreement) {
    notFound();
  }

  const pmi = pmis.find((p) => p.id === agreement.pmiId);
  const company = companies.find((c) => c.id === agreement.companyId);

  const handleDecision = (type: 'disetujui' | 'ditolak') => {
    updateAgreementMutation.mutate({
      id,
      payload: {
        status: type,
        catatan: inputNote.trim() || (type === 'disetujui' ? 'Disetujui oleh Admin' : 'Ditolak oleh Admin'),
      }
    }, {
      onSuccess: () => {
        setInputNote('');
      }
    });
  };

  const isMenunggu = agreement.status === 'menunggu';

  return (
    <div className="space-y-4 text-[#1d2327] font-normal">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/admin/contract-reviews"
          className="flex items-center gap-1 text-[#1f5aa8] hover:text-[#163f78] text-[13px] font-normal underline w-fit select-none"
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
            <h3 className="text-[13.5px] font-normal text-[#1d2327] border-b border-[#ccd0d4] pb-2">
              Data PMI Pemohon
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                  Nama PMI
                </span>
                {pmi ? (
                  <Link
                    href={`/admin/pmi/${pmi.id}`}
                    className="font-normal text-[#1f5aa8] hover:text-[#163f78] underline"
                  >
                    {pmi.nama}
                  </Link>
                ) : (
                  <span className="font-normal">Unknown PMI</span>
                )}
              </div>
              <div>
                <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                  NIK
                </span>
                <span className="font-normal text-zinc-800">
                  {pmi ? pmi.nik : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Perusahaan Tujuan & Warning */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <div className="flex items-center justify-between border-b border-[#ccd0d4] pb-2">
              <h3 className="text-[13.5px] font-normal text-[#1d2327]">
                Data Perusahaan Tujuan
              </h3>
              {company && (
                <span
                  className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-normal border ${
                    company.status === 'blacklist'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : company.status === 'netral'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-zinc-50 text-zinc-650 border-[#ccd0d4]'
                  }`}
                >
                  {company.status === 'blacklist' && 'Blacklist'}
                  {company.status === 'netral' && 'Netral'}
                  {company.status === 'tidak_cukup_info' && 'Tidak Cukup Info'}
                </span>
              )}
            </div>

            <div className="text-[13px] space-y-3">
              <div>
                <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                  Nama Perusahaan
                </span>
                {company ? (
                  <Link
                    href={`/admin/companies/${company.id}`}
                    className="font-normal text-[#1f5aa8] hover:text-[#163f78] underline"
                  >
                    {company.nama}
                  </Link>
                ) : (
                  <span className="font-normal">Unknown Company</span>
                )}
              </div>

              {company && company.status === 'blacklist' && (
                <div className="bg-red-50/50 border border-red-200 p-3 rounded-none mt-2">
                  <span className="text-[10px] font-normal text-red-700 block mb-1">
                    Peringatan Blacklist
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
            <h3 className="text-[13.5px] font-normal text-[#1d2327] border-b border-[#ccd0d4] pb-2">
              Detail Pengajuan Kontrak
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
              <div>
                <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                  Posisi Pekerjaan
                </span>
                <span className="font-normal text-zinc-800">{agreement.posisi}</span>
              </div>
              <div>
                <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                  Negara Tujuan
                </span>
                <span className="font-normal text-zinc-800">{agreement.negara}</span>
              </div>
              <div>
                <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                  Tanggal Pengajuan
                </span>
                <span className="font-normal text-zinc-800">{agreement.tglPengajuan}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Actions sidepanel */}
        <div className="lg:col-span-4">
          
          {isMenunggu ? (
            <div className="bg-white border border-[#ccd0d4] p-5 shadow-none rounded-none space-y-4">
              <h3 className="text-[13.5px] font-normal text-[#1d2327]">
                Aksi Keputusan Admin
              </h3>
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-normal text-[#5b6474]">
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
                  disabled={updateAgreementMutation.isPending}
                  className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-white text-[13px] font-normal transition-colors duration-100 rounded-none flex items-center justify-center gap-1.5 shadow-none"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Setujui Pengajuan
                </button>
                <button
                  onClick={() => handleDecision('ditolak')}
                  disabled={updateAgreementMutation.isPending}
                  className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white text-[13px] font-normal transition-colors duration-100 rounded-none flex items-center justify-center gap-1.5 shadow-none"
                >
                  <XCircle className="w-4 h-4" />
                  Tolak Pengajuan
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#ccd0d4] p-5 shadow-none rounded-none space-y-3.5">
              <h3 className="text-[13.5px] font-normal text-[#1d2327] border-b border-[#ccd0d4] pb-2">
                Status Keputusan
              </h3>
              <div>
                <span
                  className={`inline-flex px-2.5 py-0.5 text-[11px] font-normal rounded-none border ${
                    agreement.status === 'disetujui'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {agreement.status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                </span>
              </div>
              <div className="bg-[#fcfcfc] border border-[#ccd0d4] p-3 text-[13px] leading-relaxed text-zinc-700">
                {agreement.catatan}
              </div>
              <span className="block text-[11px] text-[#8a97a6] font-normal mt-1">
                Diproses oleh Admin BP2MI
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
