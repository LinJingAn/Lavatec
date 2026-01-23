import nextDynamic from 'next/dynamic';

// Disable static generation for root page since it uses React Router
export const dynamic = 'force-dynamic';

const Spa = nextDynamic(() => import('@/spa/Spa'), { ssr: false });

export default function RootPage() {
  return <Spa />;
}
