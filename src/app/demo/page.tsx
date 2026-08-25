"use client";
import React, { useState } from 'react';
import DemoRunner from '@/components/demo/DemoRunner';
import { CustomButton, CustomButtonFilters } from '@/components/ui/CustomButton';

export default function DemoPage() {
    const [started, setStarted] = useState(false);

    if (!started) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <CustomButtonFilters />
                <div className="space-y-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">VERITA</h1>
                    <p className="text-zinc-400 max-w-lg mx-auto">Financial Reconciliation Engine</p>
                    <div className="pt-8">
                        <CustomButton 
                            label="Play" 
                            secondaryLabel="Run Demo" 
                            onClick={() => setStarted(true)} 
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <DemoRunner onReset={() => setStarted(false)} />
        </div>
    );
}
