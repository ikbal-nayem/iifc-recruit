
'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { candidateNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const profileTabs = candidateNavLinks.find(item => item.label === 'Edit Profile')?.submenu || [];

export default function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkForScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // 1px buffer
    }
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkForScroll();
      container.addEventListener('scroll', checkForScroll);
      window.addEventListener('resize', checkForScroll);
      
      // Check again after a short delay for initial render
      const timeoutId = setTimeout(checkForScroll, 100);

      return () => {
        container.removeEventListener('scroll', checkForScroll);
        window.removeEventListener('resize', checkForScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [checkForScroll, children]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
     <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          Edit Your Profile
        </h1>
        <p className="text-muted-foreground">
          Keep your profile updated to attract the best opportunities.
        </p>
      </div>
       <div className="space-y-4">
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide border-b"
          >
            {profileTabs.map(tab => (
                <Link 
                    key={tab.href} 
                    href={tab.href}
                    className={cn(
                        "inline-block py-3 px-4 text-sm font-medium transition-colors border-b-2",
                        (tab.isActive ? tab.isActive(pathname) : pathname === tab.href)
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    {tab.label}
                </Link>
            ))}
          </div>

          {isMobile && canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-full px-1 bg-gradient-to-r from-background to-transparent"
              onClick={() => handleScroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {isMobile && canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-1 bg-gradient-to-l from-background to-transparent"
              onClick={() => handleScroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
         <div className="pt-4">
             {children}
         </div>
       </div>
    </div>
  );
}
