'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { useCompany, useCases, useUpdateCompany } from '@/lib/hooks/useApi';

interface ClientProps {
  id: string;
}

export default function CompanyDetailClient({ id }: ClientProps) {
  const { data: company, isLoading: loadingCompany } = useCompany(id);
  const { data: cases = [], isLoading: loadingCases } = useCases();
  const updateCompanyMutation = useUpdateCompany();

  const [selectedStatus, setSelectedStatus] = useState<'tidak_cukup_info' | 'netral' | 'blacklist' | null>(null);
  const [inputNote, setInputNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const isLoading = loadingCompany || loadingCases;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[13px] text-zinc-500 italic">
        Memuat detail perusahaan...
      </div>
    );
  }

  if (!company) {
    notFound();
  }

  const companyCases = cases.filter((c) => c.companyId === id);

  // Calculate reviewed cases status
  const reviewedCases = companyCases.filter((c) => c.statusTinjauan === 'ditinjau');
  const hasReviewedCases = reviewedCases.length > 0;
  
  const hasToleratedCase = reviewedCases.some((c) => c.keputusan === 'tertoleransi');
  const hasIntolerableCase = reviewedCases.some((c) => c.keputusan === 'tidak_toleransi');

  // Business rules validation
  const tciDisabled = hasReviewedCases;
  const netDisabled = !hasToleratedCase && hasReviewedCases;
  const blDisabled = !hasIntolerableCase && hasReviewedCases;

  const handleStatusChange = (newStatus: 'tidak_cukup_info' | 'netral' | 'blacklist') => {
    if (newStatus === 'tidak_cukup_info' && tciDisabled) return;
    if (newStatus === 'netral' && netDisabled) return;
    if (newStatus === 'blacklist' && blDisabled) return;
    setSelectedStatus(newStatus);
  };

  const submitStatusUpdate = () => {
    if (!inputNote.trim()) return;
    const targetStatus = selectedStatus !== null ? selectedStatus : company.status;

    const newLog = {
      timestamp: '16 Juli 2026, 21:46', // Static current date time
      admin: 'Admin BP2MI',
      before: company.status === 'tidak_cukup_info' ? 'Tidak Cukup Info' : (company.status === 'blacklist' ? 'Blacklist' : 'Netral'),
      after: targetStatus === 'tidak_cukup_info' ? 'Tidak Cukup Info' : (targetStatus === 'blacklist' ? 'Blacklist' : 'Netral'),
      alasan: inputNote,
    };

    updateCompanyMutation.mutate({
      id,
      payload: {
        status: targetStatus,
        statusLog: [newLog, ...(company.statusLog || [])],
      }
    }, {
      onSuccess: () => {
        setInputNote('');
        setSelectedStatus(null);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 4000);
      }
    });
  };

  const statusLog = company.statusLog || [];
  const currentStatus = company.status;
  const activeStatusSelection = selectedStatus !== null ? selectedStatus : currentStatus;

  return (
    <div className="space-y-4 text-[#1d2327] font-normal">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/admin/companies"
          className="flex items-center gap-1 text-[#1f5aa8] hover:text-[#163f78] text-[13px] font-normal underline w-fit select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Direktori Perusahaan
        </Link>
      </div>

      {/* Page Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ccd0d4]">
        <h2 className="text-[20px] font-normal text-[#1d2327] leading-tight">
          {company.nama}
        </h2>
        <div>
          <span
            className={`inline-flex px-3 py-0.5 rounded-none text-[12px] font-normal border ${
              currentStatus === 'blacklist'
                ? 'bg-red-50 text-red-700 border-red-200'
                : currentStatus === 'netral'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-zinc-50 text-[#54606e] border-zinc-200'
            }`}
          >
            {currentStatus === 'blacklist' && 'Blacklist'}
            {currentStatus === 'netral' && 'Netral'}
            {currentStatus === 'tidak_cukup_info' && 'Tidak Cukup Info'}
          </span>
        </div>
      </div>

      {/* Success Notification Bar */}
      {showSuccess && (
        <div className="bg-[#e8f7ee] border border-[#b6e3c6] text-[#0f7a3d] p-3 text-[13px] font-normal rounded-none select-none">
          Status perusahaan berhasil diperbarui.
        </div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Data sheets */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card 1: Data Registrasi */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <h3 className="text-[13.5px] font-normal text-[#1d2327] border-b border-[#ccd0d4] pb-2">
              Data Registrasi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                  NIB
                </span>
                <span className="font-normal text-zinc-800">{company.nib}</span>
              </div>
              <div>
                <span className="text-[11px] font-normal text-[#8a97a6] block mb-1">
                  Nomor SIP3MI
                </span>
                <span className="font-normal text-zinc-800">{company.sip3mi}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Case Reports History */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <h3 className="text-[13.5px] font-normal text-[#1d2327] border-b border-[#ccd0d4] pb-2">
              Riwayat Laporan Kasus
            </h3>
            {companyCases.length === 0 ? (
              <p className="text-[13px] text-[#8a97a6] italic">
                Belum ada laporan kasus terhadap perusahaan ini.
              </p>
            ) : (
              <div className="space-y-2">
                {companyCases.map((cs) => {
                  const isMenunggu = cs.statusTinjauan === 'menunggu';
                  return (
                    <div
                      key={cs.id}
                      className="p-3 border border-[#ccd0d4] bg-zinc-50/50 hover:bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors rounded-none"
                    >
                      <div>
                        <Link
                          href={`/admin/case-reviews/${cs.id}`}
                          className="font-normal text-[13.5px] text-[#1f5aa8] hover:text-[#163f78] block"
                        >
                          {cs.jenis}
                        </Link>
                        <span className="text-[11px] text-[#8a97a6] block mt-0.5">
                          Tgl Kejadian: {cs.tglKejadian}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-none text-[10px] font-normal border ${
                            isMenunggu
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : cs.keputusan === 'tertoleransi'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {isMenunggu
                            ? 'Menunggu'
                            : cs.keputusan === 'tertoleransi'
                            ? 'Tertoleransi'
                            : 'Tidak Ditoleransi'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 3: Status Log History */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <h3 className="text-[13.5px] font-normal text-[#1d2327] border-b border-[#ccd0d4] pb-2">
              Riwayat Perubahan Status (Internal)
            </h3>
            {statusLog.length === 0 ? (
              <p className="text-[13px] text-[#8a97a6] italic">
                Belum ada catatan riwayat perubahan status.
              </p>
            ) : (
              <div className="space-y-3">
                {statusLog.map((log) => (
                  <div key={log.timestamp} className="p-3.5 border border-[#ccd0d4] bg-zinc-50/20 text-[13px] rounded-none">
                    <div className="flex items-center justify-between text-[11px] text-[#8a97a6] mb-1 font-normal">
                      <span>{log.timestamp}</span>
                      <span>Diubah oleh: {log.admin}</span>
                    </div>
                    <div className="font-normal text-[#1d2327] mb-1 text-[12px]">
                      {log.before} → {log.after}
                    </div>
                    <p className="text-zinc-600 leading-relaxed text-[12.5px]">
                      {log.alasan}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Update status card */}
        <div className="lg:col-span-4 bg-white border border-[#ccd0d4] p-5 shadow-none rounded-none space-y-4">
          <div>
            <h3 className="text-[13.5px] font-normal text-[#1d2327]">
              Ubah Status Perusahaan
            </h3>
            <p className="text-[#5b6474] text-[12px] mt-1">
              Pembaruan status kepatuhan publik berdasarkan hasil evaluasi laporan kasus.
            </p>
          </div>

          {/* Radio Status Options */}
          <div className="space-y-2">
            
            {/* TCI Option */}
            <div
              onClick={() => handleStatusChange('tidak_cukup_info')}
              className={`p-3 border rounded-none flex flex-col relative select-none ${
                tciDisabled
                  ? 'opacity-40 border-zinc-200 bg-zinc-50 cursor-not-allowed'
                  : activeStatusSelection === 'tidak_cukup_info'
                  ? 'border-[#54606e] bg-[#f8f9fa] cursor-pointer'
                  : 'border-zinc-200 hover:border-zinc-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-normal text-[13px] text-[#54606e]">Tidak Cukup Info</span>
                {tciDisabled ? (
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  activeStatusSelection === 'tidak_cukup_info' && <Check className="w-4 h-4 text-[#54606e]" />
                )}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 leading-normal">
                Hanya bisa dipilih jika belum ada laporan aduan kasus yang diputuskan.
              </span>
            </div>

            {/* Netral Option */}
            <div
              onClick={() => handleStatusChange('netral')}
              className={`p-3 border rounded-none flex flex-col relative select-none ${
                netDisabled
                  ? 'opacity-40 border-zinc-200 bg-zinc-50 cursor-not-allowed'
                  : activeStatusSelection === 'netral'
                  ? 'border-green-600 bg-green-50/10 cursor-pointer'
                  : 'border-zinc-200 hover:border-zinc-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-normal text-[13px] text-green-700">Netral</span>
                {netDisabled ? (
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  activeStatusSelection === 'netral' && <Check className="w-4 h-4 text-green-700" />
                )}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 leading-normal">
                Memerlukan minimal 1 laporan aduan yang diputuskan &quot;Tertoleransi&quot;.
              </span>
            </div>

            {/* Blacklist Option */}
            <div
              onClick={() => handleStatusChange('blacklist')}
              className={`p-3 border rounded-none flex flex-col relative select-none ${
                blDisabled
                  ? 'opacity-40 border-zinc-200 bg-zinc-50 cursor-not-allowed'
                  : activeStatusSelection === 'blacklist'
                  ? 'border-red-600 bg-red-50/10 cursor-pointer'
                  : 'border-zinc-200 hover:border-zinc-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-normal text-[13px] text-red-700">Blacklist</span>
                {blDisabled ? (
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  activeStatusSelection === 'blacklist' && <Check className="w-4 h-4 text-red-700" />
                )}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 leading-normal">
                Dipilih jika terdapat aduan kasus yang diputuskan &quot;Tidak Dapat Ditoleransi&quot;.
              </span>
            </div>

          </div>

          {/* Textarea Reason */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-[11px] font-normal text-[#5b6474]">
              Catatan Alasan (Wajib)
            </label>
            <textarea
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
              placeholder="Alasan perubahan status perusahaan..."
              className="w-full h-24 p-2.5 bg-white border border-[#ccd0d4] text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 rounded-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={submitStatusUpdate}
            disabled={!inputNote.trim() || currentStatus === activeStatusSelection || updateCompanyMutation.isPending}
            className="w-full py-2.5 bg-[#1f5aa8] hover:bg-[#163f78] text-white text-[13px] font-normal transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none rounded-none shadow-none flex items-center justify-center gap-1.5"
          >
            Simpan Perubahan Status
          </button>
        </div>

      </div>
    </div>
  );
}
