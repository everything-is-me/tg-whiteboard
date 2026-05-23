'use client';

import dynamic from 'next/dynamic';
import Toolbar from '@/components/toolbar/Toolbar';

const Canvas = dynamic(() => import('@/components/whiteboard/Canvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen ml-80">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Whiteboard...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Toolbar />
      <div className="ml-80">
        <Canvas />
      </div>
    </div>
  );
}