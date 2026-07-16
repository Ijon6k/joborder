import React from 'react';
import ContractReviewDetailClient from './ContractReviewDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractReviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ContractReviewDetailClient id={id} />;
}
