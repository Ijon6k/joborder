import React from 'react';
import CaseReviewDetailClient from './CaseReviewDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CaseReviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CaseReviewDetailClient id={id} />;
}
