import React from 'react';
import { notFound } from 'next/navigation';
import { COMPANIES, CASES } from '@/lib/mockData';
import CompanyDetailClient from './CompanyDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Look up company
  const company = COMPANIES.find((c) => c.id === id);
  if (!company) {
    notFound();
  }

  // Filter cases related to this company
  const companyCases = CASES.filter((c) => c.companyId === id);

  return (
    <CompanyDetailClient
      company={company}
      cases={companyCases}
    />
  );
}
