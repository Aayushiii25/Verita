"use client";

import { useEffect, useState } from "react";
import { UploadFinanceDashboard } from "./UploadFinanceDashboard";

/** Mounts the guided finance upload dashboard and opens it from Slide 3. */
export function FinanceUploadMount() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openDashboard = () => setOpen(true);
    window.addEventListener("open-verita-upload", openDashboard);
    return () => window.removeEventListener("open-verita-upload", openDashboard);
  }, []);

  return <UploadFinanceDashboard open={open} onClose={() => setOpen(false)} />;
}
