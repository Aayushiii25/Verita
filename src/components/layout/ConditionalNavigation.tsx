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
    // Verita's main landing flow is a focused product experience, not a portfolio page.
    // Remove the portfolio chrome (clock, home/about/contact nav and back-to-top button)
    // from the landing page while preserving it on the rest of the site.
    const isVeritaLanding = pathname === '/';
    const showChrome = useFullLayout && !isVeritaLanding;

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <div className={useFullLayout ? "relative min-h-screen flex flex-col" : "contents"}>
            {showChrome && <Navbar />}
            <div className={useFullLayout ? "flex-1 relative" : "contents"}>
                {children}
            </div>
            {useFullLayout && <Footer />}
            {showChrome && <BackToTop />}
        </div>
    );
}
