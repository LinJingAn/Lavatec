import dynamic from 'next/dynamic';

const Spa = dynamic(() => import('@/spa/Spa'), { ssr: false });

export default function CatchAllPage() {
  return <Spa />;
}
