import React from 'react';
import CompanyDetailClient from './CompanyDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CompanyDetailClient id={id} />;
}
