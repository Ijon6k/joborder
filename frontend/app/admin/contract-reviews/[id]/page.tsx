import React from 'react';
import { notFound } from 'next/navigation';
import { AGREEMENTS, COMPANIES, PMIS } from '@/lib/mockData';
import ContractReviewDetailClient from './ContractReviewDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Look up target agreement request in the mock dataset
  const agreement = AGREEMENTS.find((a) => a.id === id);
  if (!agreement) {
    notFound();
  }

  const pmi = PMIS.find((p) => p.id === agreement.pmiId);
  const company = COMPANIES.find((c) => c.id === agreement.companyId);

  return (
    <ContractReviewDetailClient
      agreement={agreement}
      pmi={pmi}
      company={company}
    />
  );
}
