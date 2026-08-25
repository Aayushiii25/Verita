"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomButton } from '@/components/ui/CustomButton';

type Phase = 'INIT' | 'FEEDING' | 'DETECTING' | 'RECONCILING' | 'RESULTS';

export default function DemoRunner({ onReset }: { onReset: () => void }) {
    const [phase, setPhase] = useState<Phase>('INIT');
    const [ingestionData, setIngestionData] = useState<any>(null);
    const [reconciliationData, setReconciliationData] = useState<any>(null);
    
    // Animation progress states
    const [fedSources, setFedSources] = useState<number>(0);
    const [eventsVisible, setEventsVisible] = useState<number>(0);
    
    const [reconCounts, setReconCounts] = useState({ MATCHED: 0, REVIEW: 0, EXCEPTIONS: 0 });

    useEffect(() => {
        // Start the sequence
        const runDemo = async () => {
            try {
                // Fetch ingestion data
                const resIngest = await fetch('http://localhost:8000/demo/run', { method: 'POST' });
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

                // Fetch reconciliation data
                setPhase('RECONCILING');
                const resRecon = await fetch('http://localhost:8000/demo/reconcile', { method: 'POST' });
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

            } catch (err) {
                console.error(err);
            }
        };
        
        runDemo();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold tracking-tight">VERITA Engine</h2>
                <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full">
                    {phase}
                </div>
            </div>

            {/* PHASE A: Feeding Sources */}
            <AnimatePresence>
                {(phase === 'FEEDING' || phase === 'DETECTING' || phase === 'RECONCILING' || phase === 'RESULTS') && ingestionData && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm text-zinc-400 font-mono uppercase tracking-widest">Step 1: Ingestion</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {ingestionData.source_summary.slice(0, fedSources).map((src: any, idx: number) => (
                                <motion.div 
                                    key={src.file}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
                                >
                                    <div>
                                        <p className="font-mono text-xs text-zinc-500 mb-1">{src.file}</p>
                                        <p className="text-2xl font-bold">{src.records} <span className="text-sm font-normal text-zinc-500">records</span></p>
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
                        <h3 className="text-sm text-zinc-400 font-mono uppercase tracking-widest">Step 2: Processing Log</h3>
                        <div className="bg-black border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-400 h-64 overflow-y-auto space-y-2">
                            {ingestionData.event_log.slice(0, eventsVisible).map((event: any, idx: number) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-4 border-b border-zinc-900 pb-2 last:border-0"
                                >
                                    <span className="text-zinc-600 min-w-[120px]">{event.stage}</span>
                                    <span className={event.stage.includes('ERROR') ? 'text-red-400' : 'text-zinc-300'}>
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
                        <h3 className="text-sm text-zinc-400 font-mono uppercase tracking-widest">Step 3: Reconciliation Engine</h3>
                        
                        <div className="grid grid-cols-3 gap-6">
                            {/* Matched */}
                            <div className="bg-zinc-900 border border-green-900/50 rounded-xl overflow-hidden flex flex-col">
                                <div className="bg-green-500/10 p-4 border-b border-green-900/50 flex justify-between items-center">
                                    <h4 className="text-green-400 font-mono font-bold tracking-widest">MATCHED</h4>
                                    <span className="text-2xl font-bold text-white">{reconCounts.MATCHED}</span>
                                </div>
                                {phase === 'RESULTS' && reconciliationData && (
                                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                                        {reconciliationData.MATCHED.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-black/50 border border-zinc-800 p-3 rounded-lg text-sm">
                                                <div className="flex justify-between text-zinc-500 text-xs mb-2 font-mono">
                                                    <span>{item.settlement_id}</span>
                                                    <span>{item.bank_id}</span>
                                                </div>
                                                <p className="text-zinc-300">{item.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Review */}
                            <div className="bg-zinc-900 border border-yellow-900/50 rounded-xl overflow-hidden flex flex-col">
                                <div className="bg-yellow-500/10 p-4 border-b border-yellow-900/50 flex justify-between items-center">
                                    <h4 className="text-yellow-400 font-mono font-bold tracking-widest">REVIEW</h4>
                                    <span className="text-2xl font-bold text-white">{reconCounts.REVIEW}</span>
                                </div>
                                {phase === 'RESULTS' && reconciliationData && (
                                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                                        {reconciliationData.REVIEW.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-black/50 border border-zinc-800 p-3 rounded-lg text-sm">
                                                <div className="flex justify-between text-zinc-500 text-xs mb-2 font-mono">
                                                    <span>{item.invoice_ids.join(', ')}</span>
                                                </div>
                                                <p className="text-zinc-300">{item.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Exceptions */}
                            <div className="bg-zinc-900 border border-red-900/50 rounded-xl overflow-hidden flex flex-col">
                                <div className="bg-red-500/10 p-4 border-b border-red-900/50 flex justify-between items-center">
                                    <h4 className="text-red-400 font-mono font-bold tracking-widest">EXCEPTIONS</h4>
                                    <span className="text-2xl font-bold text-white">{reconCounts.EXCEPTIONS}</span>
                                </div>
                                {phase === 'RESULTS' && reconciliationData && (
                                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                                        {reconciliationData.EXCEPTIONS.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-black/50 border border-zinc-800 p-3 rounded-lg text-sm">
                                                <div className="flex justify-between text-zinc-500 text-xs mb-2 font-mono">
                                                    <span>{item.bank_id || item.invoice_ids.join(', ')}</span>
                                                </div>
                                                <p className="text-zinc-300">{item.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Restart */}
            {phase === 'RESULTS' && (
                <div className="pt-12 flex justify-center">
                    <CustomButton label="Re-run Demo" onClick={onReset} />
                </div>
            )}
        </div>
    );
}
