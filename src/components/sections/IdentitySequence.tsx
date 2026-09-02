"use client";

import React from "react";

interface IdentitySequenceProps {
    scrollYProgress: any;
    isVisible: boolean;
}

/**
 * The old identity/AI Engineer cinematic slide has been intentionally removed.
 * The About section's GitHub dashboard remains rendered independently via
 * GitHubShowcase, so the dashboard is shown without the portfolio background.
 */
export const IdentitySequence = ({
    scrollYProgress: _scrollYProgress,
    isVisible: _isVisible,
}: IdentitySequenceProps) => {
    return null;
};
