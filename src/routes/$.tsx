import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { BrandedNotFound } from '@/components/branded-not-found';

export const Route = createFileRoute('/$')({
  component: NotFoundRoute,
});

function NotFoundRoute() {
  return <BrandedNotFound />;
}

