'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, Footer } from '@/components/layout';
import { BackToTop } from '@/components/ui/BackToTop';

export function ConditionalNavigation({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const segments = pathname?.split('/').filter(Boolean) || [];
    const projectsIndex = segments.indexOf('projects');
    const isProjectDetail = projectsIndex !== -1 && segments.length > projectsIndex + 1;
    const blogIndex = segments.indexOf('blog');
    const isBlogDetail = blogIndex !== -1 && segments.length > blogIndex + 1;

    const useFullLayout = !(isProjectDetail || isBlogDetail);
    // The Verita landing experience is intentionally chrome-free.
    // Keep the shared navigation on the rest of the site, but remove the
    // floating portfolio badge (clock / home / about / contact) from `/`.
    const showNavbar = useFullLayout && pathname !== '/';

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <div className={useFullLayout ? "relative min-h-screen flex flex-col" : "contents"}>
            {showNavbar && <Navbar />}
            <div className={useFullLayout ? "flex-1 relative" : "contents"}>
                {children}
            </div>
            {useFullLayout && <Footer />}
            {useFullLayout && <BackToTop />}
        </div>
    );
}
