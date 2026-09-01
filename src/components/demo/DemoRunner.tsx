"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomButton } from '@/components/ui/CustomButton';
import FinancialGraph from './FinancialGraph';

type Phase = 'INIT' | 'FEEDING' | 'DETECTING' | 'RECONCILING' | 'RESULTS';

export default function DemoRunner({ onReset }: { onReset: () => void }) {
    const [phase, setPhase] = useState<Phase>('INIT');
    const [ingestionData, setIngestionData] = useState<any>(null);
    const [reconciliationData, setReconciliationData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
    // Animation progress states
    const [fedSources, setFedSources] = useState<number>(0);
    const [eventsVisible, setEventsVisible] = useState<number>(0);
    
    const [reconCounts, setReconCounts] = useState({ MATCHED: 0, REVIEW: 0, EXCEPTIONS: 0 });

    useEffect(() => {
        // Start the sequence
        const runDemo = async () => {
            try {
                // Fetch ingestion data
                const resIngest = await fetch('/api/demo/run', { method: 'POST' });
                if (!resIngest.ok) throw new Error("Backend server is not running or unreachable");
                const ingestData = await resIngest.json();
                setIngestionData(ingestData);

                // Start Phase A: Feeding
                setPhase('FEEDING');
                for (let i = 1; i <= ingestData.source_summary.length; i++) {
                    await new Promise(r => setTimeout(r, 600)); // Delay between files
                    setFedSources(i);
                }
                
                await new Promise(r => setTimeout(r, 1000));
                
                // Start Phase B: Detecting & Validating
                setPhase('DETECTING');
                for (let i = 1; i <= ingestData.event_log.length; i++) {
                    await new Promise(r => setTimeout(r, 200)); // Delay between log lines
                    setEventsVisible(i);
                }

                await new Promise(r => setTimeout(r, 1000));

                // Fetch reconciliation data from real backend
                setPhase('RECONCILING');
                const resRecon = await fetch('http://localhost:8000/api/reconcile', { method: 'POST' });
                const reconData = await resRecon.json();
                setReconciliationData(reconData);
                
                // Animate running tally
                const targetMatches = reconData.counts.MATCHED;
                const targetReview = reconData.counts.REVIEW;
                const targetExceptions = reconData.counts.EXCEPTIONS;
                
                const steps = 20;
                for (let i = 1; i <= steps; i++) {
                    await new Promise(r => setTimeout(r, 50));
                    setReconCounts({
                        MATCHED: Math.floor((targetMatches / steps) * i),
                        REVIEW: Math.floor((targetReview / steps) * i),
                        EXCEPTIONS: Math.floor((targetExceptions / steps) * i),
                    });
                }
                
                await new Promise(r => setTimeout(r, 1000));
                setPhase('RESULTS');

            } catch (err: any) {
                console.error(err);
                setErrorMsg(err.message || "Failed to fetch. Make sure uvicorn app.main:app is running.");
            }
        };
        
        runDemo();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold tracking-tight">VERITA Engine</h2>
                <div className="text-sm font-mono text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                    {phase}
                </div>
            </div>

            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                    <h3 className="font-bold mb-1">Backend Connection Failed</h3>
                    <p>{errorMsg}</p>
                    <p className="mt-2 text-sm text-red-500">Please start the python backend server.</p>
                </div>
            )}

            {/* PHASE A: Feeding Sources */}
            <AnimatePresence>
                {(phase === 'FEEDING' || phase === 'DETECTING' || phase === 'RECONCILING' || phase === 'RESULTS') && ingestionData && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm text-gray-500 font-mono uppercase tracking-widest">Step 1: Ingestion</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {ingestionData.source_summary.slice(0, fedSources).map((src: any, idx: number) => (
                                <motion.div 
                                    key={src.file}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex flex-col justify-between"
                                >
                                    <div>
                                        <p className="font-mono text-xs text-gray-400 mb-1">{src.file}</p>
                                        <p className="text-2xl font-bold">{src.records} <span className="text-sm font-normal text-gray-400">records</span></p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE B: Detecting & Validating */}
            <AnimatePresence>
                {(phase === 'DETECTING' || phase === 'RECONCILING' || phase === 'RESULTS') && ingestionData && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm text-gray-500 font-mono uppercase tracking-widest">Step 2: Processing Log</h3>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs text-gray-500 h-64 overflow-y-auto space-y-2">
                            {ingestionData.event_log.slice(0, eventsVisible).map((event: any, idx: number) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-4 border-b border-gray-100 pb-2 last:border-0"
                                >
                                    <span className="text-gray-500 min-w-[120px]">{event.stage}</span>
                                    <span className={event.stage.includes('ERROR') ? 'text-red-400' : 'text-gray-700'}>
                                        {event.message || `Processed ${event.records} records for ${event.source || event.file}`}
                                        {event.confidence && ` (Confidence: ${(event.confidence * 100).toFixed(1)}%)`}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE C & D: Reconciling & Results */}
            <AnimatePresence>
                {(phase === 'RECONCILING' || phase === 'RESULTS') && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm text-gray-500 font-mono uppercase tracking-widest">Step 3: Reconciliation Engine</h3>
                        
                        <div className="grid grid-cols-3 gap-6">
                            {/* Matched */}
                            <div className="bg-gray-100 border border-green-900/50 rounded-xl overflow-hidden flex flex-col">
                                <div className="bg-green-500/10 p-4 border-b border-green-900/50 flex justify-between items-center">
                                    <h4 className="text-green-400 font-mono font-bold tracking-widest">MATCHED</h4>
                                    <span className="text-2xl font-bold text-black">{reconCounts.MATCHED}</span>
                                </div>
                                {phase === 'RESULTS' && reconciliationData && (
                                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                                        {reconciliationData.MATCHED.slice(0, 3).map((item: any, idx: number) => (
                                            <div key={idx} className="bg-white/50 border border-gray-200 p-3 rounded-lg text-sm">
                                                <div className="flex justify-between text-gray-400 text-xs mb-2 font-mono">
                                                    <span>{item.settlement_id}</span>
                                                    <span>{item.bank_id}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="inline-block bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-green-200">
                                                        AI CONFIDENCE: {(item.probability * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">{item.reason || 'Matched by ML model'}</p>
                                            </div>
                                        ))}
                                        {reconCounts.MATCHED > 3 && (
                                            <p className="text-xs text-gray-400 font-mono text-center pt-2">
                                                and {reconCounts.MATCHED - 3} more records…
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Review */}
                            <div className="bg-gray-100 border border-yellow-900/50 rounded-xl overflow-hidden flex flex-col">
                                <div className="bg-yellow-500/10 p-4 border-b border-yellow-900/50 flex justify-between items-center">
                                    <h4 className="text-yellow-400 font-mono font-bold tracking-widest">REVIEW</h4>
                                    <span className="text-2xl font-bold text-black">{reconCounts.REVIEW}</span>
                                </div>
                                {phase === 'RESULTS' && reconciliationData && (
                                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                                        {reconciliationData.REVIEW.slice(0, 3).map((item: any, idx: number) => (
                                            <div key={idx} className="bg-white/50 border border-gray-200 p-3 rounded-lg text-sm">
                                                <div className="flex justify-between text-gray-400 text-xs mb-2 font-mono">
                                                    <span>{item.invoice_ids.join(', ')}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-yellow-200">
                                                        AI CONFIDENCE: {(item.probability * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">{item.reason || 'Flagged for review by ML model'}</p>
                                            </div>
                                        ))}
                                        {reconCounts.REVIEW > 3 && (
                                            <p className="text-xs text-gray-400 font-mono text-center pt-2">
                                                and {reconCounts.REVIEW - 3} more records…
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Exceptions */}
                            <div className="bg-gray-100 border border-red-900/50 rounded-xl overflow-hidden flex flex-col">
                                <div className="bg-red-500/10 p-4 border-b border-red-900/50 flex justify-between items-center">
                                    <h4 className="text-red-400 font-mono font-bold tracking-widest">EXCEPTIONS</h4>
                                    <span className="text-2xl font-bold text-black">{reconCounts.EXCEPTIONS}</span>
                                </div>
                                {phase === 'RESULTS' && reconciliationData && (
                                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                                        {reconciliationData.EXCEPTIONS.slice(0, 3).map((item: any, idx: number) => (
                                            <div key={idx} className="bg-white/50 border border-gray-200 p-3 rounded-lg text-sm">
                                                <div className="flex justify-between text-gray-400 text-xs mb-2 font-mono">
                                                    <span>{item.bank_id || item.invoice_ids.join(', ')}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="inline-block bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-red-200">
                                                        AI CONFIDENCE: {(item.probability * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">{item.reason || 'Exception identified by ML model'}</p>
                                            </div>
                                        ))}
                                        {reconCounts.EXCEPTIONS > 3 && (
                                            <p className="text-xs text-gray-400 font-mono text-center pt-2">
                                                and {reconCounts.EXCEPTIONS - 3} more records…
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE E: Graph */}
            <AnimatePresence>
                {phase === 'RESULTS' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-8 border-t border-gray-200"
                    >
                        <h3 className="text-sm text-gray-500 font-mono uppercase tracking-widest">Step 4: AI Relationship Graph</h3>
                        <FinancialGraph />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Restart */}
            {phase === 'RESULTS' && (
                <div className="pt-12 flex justify-center">
                    <CustomButton label="Re-run Demo" secondaryLabel="Restart" onClick={onReset} />
                </div>
            )}
        </div>
    );
}
