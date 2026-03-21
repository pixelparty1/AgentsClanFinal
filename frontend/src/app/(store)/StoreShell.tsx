'use client';

import { Toaster } from 'react-hot-toast';
import StoreMarquee from '@/components/store/StoreMarquee';
import StoreNavbar from '@/components/store/StoreNavbar';
import StoreFooter from '@/components/store/StoreFooter';

export default function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" />
      <StoreMarquee />
      <StoreNavbar />
      <div className="pt-[108px]">{/* offset: 36px marquee + ~72px navbar */}
        {children}
      </div>
      <StoreFooter />
    </>
  );
}
