import React from 'react';
import { INITIAL_APPS } from '@/data/initialApps';
import AppDetailClient from '@/components/AppDetailClient';

export function generateStaticParams() {
  return INITIAL_APPS.map((app) => ({
    id: app.id,
  }));
}

export default function AppDetailPage() {
  return <AppDetailClient />;
}
