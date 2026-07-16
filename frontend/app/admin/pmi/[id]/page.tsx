import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, AlertTriangle, FileSignature } from 'lucide-react';
import { PMIS, CASES, AGREEMENTS, COMPANIES } from '@/lib/mockData';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PmiDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Look up target PMI in the mock dataset
  const pmi = PMIS.find((p) => p.id === id);
  if (!pmi) {
    notFound();
  }

  // Filter reported cases by this PMI
  const pmiCases = CASES.filter((c) => c.pmiId === id);

  // Filter contract agreements requested by this PMI
  const pmiAgreements = AGREEMENTS.filter((a) => a.pmiId === id).map((a) => {
    const company = COMPANIES.find((c) => c.id === a.companyId);
    return {
      ...a,
      companyName: company ? company.nama : 'Unknown Company',
    };
  });

  return (
    <div className="space-y-5 text-[#1d2327] font-normal">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/admin/pmi"
          className="flex items-center gap-1 text-[#1f5aa8] hover:text-[#163f78] text-[13px] font-bold underline w-fit select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Pekerja
        </Link>
      </div>

      {/* Page Header */}
      <div className="pb-3 border-b border-[#ccd0d4]">
        <h2 className="text-[20px] font-bold text-[#1d2327] flex items-center gap-2">
          Profil Tenaga Kerja: {pmi.nama}
        </h2>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: PMI Profile Card */}
        <div className="lg:col-span-4 bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
          <h3 className="text-[13.5px] font-bold text-[#1d2327] border-b border-[#ccd0d4] pb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-zinc-500" />
            Biodata PMI
          </h3>
          <div className="space-y-3 text-[13px]">
            <div>
              <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                Nama Lengkap
              </span>
              <span className="font-semibold text-zinc-800">{pmi.nama}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                NIK (Nomor Induk Kependudukan)
              </span>
              <span className="font-semibold text-zinc-800">{pmi.nik}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8a97a6] uppercase tracking-wider block mb-1">
                Status Akun Portal
              </span>
              <span className="inline-flex px-2 py-0.5 rounded-none text-[10px] font-bold uppercase border bg-green-50 text-green-700 border-green-200">
                {pmi.statusAkun}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Case history & contract history lists */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card 1: Reported Cases History */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <h3 className="text-[13.5px] font-bold text-[#1d2327] border-b border-[#ccd0d4] pb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-zinc-500" />
              Riwayat Pelaporan Kasus
            </h3>
            {pmiCases.length === 0 ? (
              <p className="text-[13px] text-[#8a97a6] italic">
                Belum pernah membuat laporan aduan kasus.
              </p>
            ) : (
              <div className="space-y-2">
                {pmiCases.map((cs) => {
                  const company = COMPANIES.find((c) => c.id === cs.companyId);
                  const isMenunggu = cs.statusTinjauan === 'menunggu';
                  return (
                    <div
                      key={cs.id}
                      className="p-3 border border-[#ccd0d4] bg-zinc-50/50 hover:bg-zinc-50 flex justify-between items-center transition-colors rounded-none"
                    >
                      <div className="text-[13px]">
                        <Link
                          href={`/admin/case-reviews/${cs.id}`}
                          className="font-bold text-[#1f5aa8] hover:text-[#163f78] block"
                        >
                          {cs.jenis}
                        </Link>
                        <span className="text-zinc-500 text-[12px] block mt-0.5">
                          Terlapor: <span className="font-semibold">{company ? company.nama : 'Unknown Company'}</span> · Lapor: {cs.tglLapor}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-none text-[10px] font-bold uppercase border ${
                            isMenunggu
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : cs.keputusan === 'tertoleransi'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {isMenunggu ? 'Menunggu' : cs.keputusan === 'tertoleransi' ? 'Tertoleransi' : 'Tidak Ditoleransi'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 2: Contract Agreements History */}
          <div className="bg-white border border-[#ccd0d4] p-5 rounded-none shadow-none space-y-4">
            <h3 className="text-[13.5px] font-bold text-[#1d2327] border-b border-[#ccd0d4] pb-2 flex items-center gap-1.5">
              <FileSignature className="w-4 h-4 text-zinc-500" />
              Riwayat Pengajuan Perjanjian Kerja
            </h3>
            {pmiAgreements.length === 0 ? (
              <p className="text-[13px] text-[#8a97a6] italic">
                Belum pernah mengajukan perjanjian kerja.
              </p>
            ) : (
              <div className="space-y-2">
                {pmiAgreements.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-3 border border-[#ccd0d4] bg-zinc-50/50 hover:bg-zinc-50 flex justify-between items-center transition-colors rounded-none"
                  >
                    <div className="text-[13px]">
                      {ag.status === 'otomatis' ? (
                        <span className="font-bold text-zinc-700 block">
                          {ag.posisi} · {ag.companyName}
                        </span>
                      ) : (
                        <Link
                          href={`/admin/contract-reviews/${ag.id}`}
                          className="font-bold text-[#1f5aa8] hover:text-[#163f78] block"
                        >
                          {ag.posisi} · {ag.companyName}
                        </Link>
                      )}
                      <span className="text-zinc-500 text-[12px] block mt-0.5">
                        Tujuan: {ag.negara} · Diajukan: {ag.tglPengajuan}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-none text-[10px] font-bold uppercase border ${
                          ag.status === 'menunggu'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : ag.status === 'disetujui'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : ag.status === 'ditolak'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#f1f3f6] text-zinc-600 border-zinc-250'
                        }`}
                      >
                        {ag.status === 'otomatis' ? 'Otomatis Valid' : ag.status}
                      </span>
                    </div>
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
