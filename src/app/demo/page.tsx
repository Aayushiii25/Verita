"use client";
import React, { useState } from 'react';
import DemoRunner from '@/components/demo/DemoRunner';
import { CustomButton, CustomButtonFilters } from '@/components/ui/CustomButton';

export default function DemoPage() {
    const [started, setStarted] = useState(true);

    if (!started) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black">
                <CustomButtonFilters />
                <div className="space-y-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">VERITA</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">Financial Reconciliation Engine</p>
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
        <div className="min-h-screen bg-white text-black p-4 md:p-8">
            <DemoRunner onReset={() => setStarted(false)} />
        </div>
    );
}
