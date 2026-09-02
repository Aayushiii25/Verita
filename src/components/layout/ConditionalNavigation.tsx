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

    // Verita owns the homepage, including locale-prefixed roots such as /en or /id.
    // Never render the portfolio navbar/footer/back-to-top controls on the product page.
    const isLocaleRoot = segments.length === 0 || (segments.length === 1 && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(segments[0]));
    const isVeritaLanding = isLocaleRoot;
    const showChrome = useFullLayout && !isVeritaLanding;

    if (!mounted) {
        return <>{children}</>;
    }

    // Keep the product landing page completely isolated from portfolio chrome.
    if (isVeritaLanding) {
        return <>{children}</>;
    }

    return (
        <div className={useFullLayout ? "relative min-h-screen flex flex-col" : "contents"}>
            {showChrome && <Navbar />}
            <div className={useFullLayout ? "flex-1 relative" : "contents"}>
                {children}
            </div>
            {showChrome && <Footer />}
            {showChrome && <BackToTop />}
        </div>
    );
}
