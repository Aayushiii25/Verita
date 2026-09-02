"use client";

import { useEffect, useState } from "react";
import { UploadFinanceDashboard } from "./UploadFinanceDashboard";

/** Opens the guided upload dashboard from the existing Slide 3 Upload CTA. */
export function FinanceUploadMount() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      if (!button) return;
      if (!button.textContent?.trim().startsWith("Upload")) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <UploadFinanceDashboard open={open} onClose={() => setOpen(false)} />;
}
