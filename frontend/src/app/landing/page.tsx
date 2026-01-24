'use client';

import nextDynamic from 'next/dynamic';

// Disable static generation for this page since it uses React Router
export const dynamic = 'force-dynamic';

const LandingPage = nextDynamic(() => import('@/views/LandingPage'), { 
  ssr: false 
});

export default function LandingRoute() {
  return <LandingPage />;
}
