import nextDynamic from 'next/dynamic';

// Disable static generation for catch-all routes since they use React Router
export const dynamic = 'force-dynamic';

const Spa = nextDynamic(() => import('@/spa/Spa'), { ssr: false });

export default function CatchAllPage() {
  return <Spa />;
}
