'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useCase, usePMIs, useCompanies, useCases, useUpdateCase, useUpdateCompany } from '@/lib/hooks/useApi';

interface ClientProps {
  id: string;
}

export default function CaseReviewDetailClient({ id }: ClientProps) {
  const { data: caseItem, isLoading: loadingCase } = useCase(id);
  const { data: pmis = [], isLoading: loadingPmis } = usePMIs();
  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();
  const { data: cases = [], isLoading: loadingCases } = useCases();

  const updateCaseMutation = useUpdateCase();
  const updateCompanyMutation = useUpdateCompany();

  const [inputNote, setInputNote] = useState('');

  const isLoading = loadingCase || loadingPmis || loadingCompanies || loadingCases;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[13px] text-zinc-500 italic">
        Memuat detail kasus...
      </div>
    );
  }

  if (!caseItem) {
    notFound();
  }

  const pmi = pmis.find((p) => p.id === caseItem.pmiId);
  const company = companies.find((c) => c.id === caseItem.companyId);
  const relatedCases = cases.filter((c) => c.companyId === caseItem.companyId && c.id !== caseItem.id);

  const handleDecision = (type: 'tertoleransi' | 'tidak_toleransi') => {
    if (!inputNote.trim()) return;

    updateCaseMutation.mutate({
      id,
      payload: {
        statusTinjauan: 'ditinjau',
        keputusan: type,
        catatanKeputusan: inputNote,
        tglDiputuskan: '16 Juli 2026',
      }
    }, {
      onSuccess: () => {
        // Also update company status based on decision
        if (company) {
          const newStatus = type === 'tidak_toleransi' ? 'blacklist' : 'netral';
          const newLog = {
            timestamp: '16 Juli 2026, 22:45',
            admin: 'Admin BP2MI',
            before: company.status === 'tidak_cukup_info' ? 'Tidak Cukup Info' : (company.status === 'blacklist' ? 'Blacklist' : 'Netral'),
            after: newStatus === 'blacklist' ? 'Blacklist' : 'Netral',
            alasan: `Diperbarui otomatis dari hasil keputusan kasus: ${inputNote}`,
          };
          updateCompanyMutation.mutate({
            id: company.id,
            payload: {
              status: newStatus,
              statusLog: [newLog, ...(company.statusLog || [])],
            }
          });
        }
        setInputNote('');
      }
    });
  };

  const isMenunggu = caseItem.statusTinjauan === 'menunggu';

  return (
    <div className="space-y-4 text-[#1d2327] font-normal">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/admin/case-reviews"
          className="flex items-center gap-1 text-[#1f5aa8] hover:text-[#163f78] text-[13px] font-normal underline w-fit select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Antrian Kasus
        </Link>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Details panel */}
        <div className="lg:col-span-8 bg-white border border-[#ccd0d4] p-6 rounded-none shadow-none space-y-6">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#ccd0d4]">
            <div>
              <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                Perusahaan Terlapor
              </span>
              <h2 className="text-[18px] font-normal text-[#1f5aa8] hover:text-[#163f78] leading-tight">
                {company ? (
                  <Link href={`/admin/companies/${company.id}`}>{company.nama}</Link>
                ) : (
                  'Unknown Company'
                )}
              </h2>
            </div>
            <div>
              <span
                className={`inline-flex px-3 py-0.5 rounded-none text-[12px] font-normal border ${
                  isMenunggu
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {isMenunggu ? 'Menunggu Tinjauan' : 'Sudah Ditinjau'}
              </span>
            </div>
          </div>

          {/* Details Grid Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-[#ccd0d4] text-[13px]">
            <div>
              <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                Jenis Kasus
              </span>
              <span className="font-normal text-zinc-800">{caseItem.jenis}</span>
            </div>
            <div>
              <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                Tanggal Kejadian
              </span>
              <span className="font-normal text-zinc-800">{caseItem.tglKejadian}</span>
            </div>
            <div>
              <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                Tanggal Lapor
              </span>
              <span className="font-normal text-zinc-800">{caseItem.tglLapor}</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-normal text-[#8a97a6]">
              Deskripsi Kejadian dari Pelapor
            </h4>
            <p className="text-[13.5px] leading-relaxed text-zinc-700 font-normal">
              {caseItem.deskripsi}
            </p>
            <div className="text-[12.5px] text-[#5b6474] pt-2">
              Dilaporkan oleh:{' '}
              {pmi ? (
                <Link
                  href={`/admin/pmi/${pmi.id}`}
                  className="text-[#1f5aa8] hover:text-[#163f78] font-normal underline"
                >
                  {pmi.nama} (NIK: {pmi.nik})
                </Link>
              ) : (
                'Anonim'
              )}
            </div>
          </div>

          {/* Evidence Attachments Block */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[11px] font-normal text-[#8a97a6]">
              Lampiran Bukti
            </h4>
            {!caseItem.lampiran || caseItem.lampiran.length === 0 ? (
              <p className="text-[13px] text-[#8a97a6] italic">
                Tidak ada lampiran bukti pendukung.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {caseItem.lampiran.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f0f1] border border-[#ccd0d4] text-[13px] text-zinc-700 select-none rounded-none"
                  >
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <span className="font-normal">{file.nama}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar actions */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Related Cases Logs */}
          <div className="bg-white border border-[#ccd0d4] p-5 shadow-none rounded-none space-y-4">
            <h3 className="text-[13.5px] font-normal text-[#1d2327] border-b border-[#ccd0d4] pb-2">
              Riwayat Kasus Perusahaan Ini
            </h3>
            {relatedCases.length === 0 ? (
              <p className="text-[12.5px] text-[#8a97a6] italic">
                Belum ada laporan lain terhadap perusahaan ini.
              </p>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {relatedCases.map((rel) => (
                  <div
                    key={rel.id}
                    className="p-3 border border-[#ccd0d4] bg-[#f9f9f9] rounded-none hover:bg-zinc-50 transition-colors"
                  >
                    <Link
                      href={`/admin/case-reviews/${rel.id}`}
                      className="font-normal text-[13px] text-[#1f5aa8] hover:text-[#163f78] block"
                    >
                      {rel.jenis}
                    </Link>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                      Kejadian: {rel.tglKejadian}
                    </span>
                    <span
                      className={`inline-block mt-2 px-1.5 py-0.5 text-[9px] font-normal rounded-none border ${
                        rel.statusTinjauan === 'menunggu'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : rel.keputusan === 'tertoleransi'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      {rel.statusTinjauan === 'menunggu'
                        ? 'Menunggu'
                        : rel.keputusan === 'tertoleransi'
                        ? 'Tertoleransi'
                        : 'Tidak Ditoleransi'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Decision actions box */}
          {isMenunggu ? (
            <div className="bg-white border border-[#ccd0d4] p-5 shadow-none rounded-none space-y-4">
              <h3 className="text-[13.5px] font-normal text-[#1d2327]">
                Aksi Keputusan Admin
              </h3>
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-normal text-[#5b6474]">
                  Catatan Keputusan (Wajib)
                </label>
                <textarea
                  value={inputNote}
                  onChange={(e) => setInputNote(e.target.value)}
                  placeholder="Masukkan alasan keputusan untuk jejak audit..."
                  className="w-full h-24 p-2.5 bg-white border border-[#ccd0d4] text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 rounded-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1.5">
                <button
                  onClick={() => handleDecision('tertoleransi')}
                  disabled={!inputNote.trim() || updateCaseMutation.isPending}
                  className="w-full py-2 bg-white hover:bg-green-50 border border-green-600 text-green-700 text-[13px] font-normal transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none rounded-none flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Tandai Tertoleransi
                </button>
                <button
                  onClick={() => handleDecision('tidak_toleransi')}
                  disabled={!inputNote.trim() || updateCaseMutation.isPending}
                  className="w-full py-2 bg-white hover:bg-red-50 border border-red-600 text-red-700 text-[13px] font-normal transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none rounded-none flex items-center justify-center gap-1.5"
                >
                  <AlertOctagon className="w-4 h-4" />
                  Tandai Tidak Ditoleransi
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#ccd0d4] p-5 shadow-none rounded-none space-y-3.5">
              <h3 className="text-[13.5px] font-normal text-[#1d2327] border-b border-[#ccd0d4] pb-2">
                Hasil Tinjauan Kasus
              </h3>
              <div>
                <span
                  className={`inline-flex px-2 py-0.5 text-[11px] font-normal rounded-none border ${
                    caseItem.keputusan === 'tertoleransi'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {caseItem.keputusan === 'tertoleransi' ? 'Tertoleransi' : 'Tidak Dapat Ditoleransi'}
                </span>
              </div>
              <div className="bg-[#fcfcfc] border border-[#ccd0d4] p-3 text-[13px] leading-relaxed text-zinc-700">
                {caseItem.catatanKeputusan}
              </div>
              <span className="block text-[11px] text-[#8a97a6] font-normal">
                Diputuskan oleh Admin BP2MI pada {caseItem.tglDiputuskan}
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
