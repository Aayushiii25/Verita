'use client';
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

export function TechnicalDetailsModal() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="px-5 py-2 bg-black/50 hover:bg-black/80 text-white border border-white/20 font-semibold rounded-full transition-all text-sm backdrop-blur-md flex items-center gap-2 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Architecture Details
                </button>
            </Dialog.Trigger>
            
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] p-6"
                            >
                                <div className="bg-background/95 dark:bg-black/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-8 max-h-[85vh] overflow-y-auto">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <Dialog.Title className="text-2xl font-bold font-sans tracking-tight">VERITA Engine Architecture</Dialog.Title>
                                            <Dialog.Description className="text-muted-foreground mt-2">
                                                Technical breakdown of the AI-powered financial reconciliation pipeline.
                                            </Dialog.Description>
                                        </div>
                                        <Dialog.Close asChild>
                                            <button className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                            </button>
                                        </Dialog.Close>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                                            <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                                                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-mono">01</span>
                                                Python FastAPI Backend
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                The core logic is decoupled from the frontend, running on a high-performance Python ASGI server. This enables seamless integration with heavy data-science libraries that Node.js struggles with.
                                            </p>
                                            <div className="flex gap-2 flex-wrap text-xs font-mono">
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">FastAPI</span>
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">Uvicorn</span>
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">Pandas</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                                            <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                                                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-mono">02</span>
                                                Scikit-Learn ML Record Linking
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Traditional rules-based matching fails on noisy financial data. We trained a <strong>RandomForestClassifier</strong> on synthesized tabular data to compute similarity probabilities across fuzzy dates, amounts, and reference strings.
                                            </p>
                                            <div className="flex gap-2 flex-wrap text-xs font-mono">
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">Scikit-Learn</span>
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">RandomForest</span>
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">Pickle</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                                            <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                                                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-mono">03</span>
                                                NetworkX Temporal Graph
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Reconciliation isn't just 1-to-1 matching; it's a web of multi-way relationships. Using <strong>NetworkX</strong>, we construct a <code>MultiDiGraph</code> linking Ledgers to Invoices to Settlements to Bank Deposits, visualizing the complete lineage of cash flow.
                                            </p>
                                            <div className="flex gap-2 flex-wrap text-xs font-mono">
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">NetworkX</span>
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">Gravity-UI Graph</span>
                                                <span className="px-2 py-1 bg-white dark:bg-black border rounded">React Canvas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
