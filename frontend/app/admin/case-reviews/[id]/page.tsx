import React from 'react';
import { notFound } from 'next/navigation';
import { CASES, COMPANIES, PMIS } from '@/lib/mockData';
import CaseReviewDetailClient from './CaseReviewDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CaseReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Look up target case in the mock dataset
  const caseItem = CASES.find((c) => c.id === id);
  if (!caseItem) {
    notFound();
  }

  const pmi = PMIS.find((p) => p.id === caseItem.pmiId);
  const company = COMPANIES.find((c) => c.id === caseItem.companyId);

  // Find other cases under the same company
  const relatedCases = CASES.filter((c) => c.companyId === caseItem.companyId && c.id !== caseItem.id).map((c) => ({
    id: c.id,
    jenis: c.jenis,
    tglKejadian: c.tglKejadian,
    statusTinjauan: c.statusTinjauan,
    keputusan: c.keputusan,
  }));

  return (
    <CaseReviewDetailClient
      caseItem={caseItem}
      pmi={pmi}
      company={company}
      relatedCases={relatedCases}
    />
  );
}
