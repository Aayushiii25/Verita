"use client";
import React, { useState, useEffect } from 'react';
import { GraphCanvas } from '@gravity-ui/graph';
import { useGraph } from '@gravity-ui/graph/react';

const NODE_COLORS: Record<string, string> = {
    invoice: '#eff6ff', // blue-50
    settlement: '#faf5ff', // purple-50
    bank: '#f0fdf4', // green-50
    ledger: '#fff7ed', // orange-50
};

const BORDER_COLORS: Record<string, string> = {
    invoice: '#bfdbfe', // blue-200
    settlement: '#e9d5ff', // purple-200
    bank: '#bbf7d0', // green-200
    ledger: '#fed7aa', // orange-200
};

function GraphComponent({ graphData }: { graphData: any }) {
    const { graph } = useGraph();

    useEffect(() => {
        if (!graph || !graphData) return;

        // Gravity UI Graph setup
        const blocks = graphData.nodes.map((n: any) => ({
            id: n.id,
            name: n.id,
            type: n.type,
            amount: n.amount
        }));

        const connections = graphData.edges.map((e: any, i: number) => ({
            id: `conn-${i}`,
            sourceBlockId: e.source,
            targetBlockId: e.target,
            label: e.relationship,
        }));

        // Use onStateChanged to initialize graph when it's ATTACHED
        const subscription = graph.onStateChanged((state) => {
            if (state === 'ATTACHED') {
                graph.setEntities({ blocks, connections });
            }
        });

        // If graph is already attached, set entities immediately
        if (graph.state === 'ATTACHED') {
            graph.setEntities({ blocks, connections });
        }

        return () => {
            subscription.dispose();
        };
    }, [graph, graphData]);

    const renderBlock = (g: any, block: any) => {
        const type = block.type as string;
        const bgColor = NODE_COLORS[type] || '#ffffff';
        const borderColor = BORDER_COLORS[type] || '#cccccc';

        return (
            <div 
                style={{ 
                    backgroundColor: bgColor, 
                    border: `2px solid ${borderColor}`,
                    padding: '12px',
                    borderRadius: '8px',
                    width: '180px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                }}
            >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{block.id}</div>
                <div style={{ color: '#555' }}>Type: {type.toUpperCase()}</div>
                {block.amount && <div style={{ color: '#000', marginTop: '4px' }}>₹{block.amount}</div>}
            </div>
        );
    };

    return (
        <div style={{ width: '100%', height: '600px', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
            <GraphCanvas graph={graph} renderBlock={renderBlock} />
        </div>
    );
}

export default function FinancialGraph() {
    const [graphData, setGraphData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const res = await fetch('/api/demo/graph', { method: 'POST' });
                const data = await res.json();
                setGraphData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch graph", err);
            }
        };
        fetchGraph();
    }, []);

    if (loading) return <div className="text-sm font-mono text-gray-500 animate-pulse p-12 text-center">Computing Financial Graph...</div>;
    if (!graphData) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Financial Knowledge Graph</h3>
            <p className="text-sm text-gray-500 mb-6">Interactive visualization using @gravity-ui/graph</p>
            
            <GraphComponent graphData={graphData} />
            
            <div className="mt-6 p-4 bg-gray-50 border rounded-lg text-sm text-gray-600">
                <span className="font-bold text-gray-900">Graph Properties:</span> {graphData.nodes.length} nodes, {graphData.edges.length} relationships
            </div>
        </div>
    );
}
