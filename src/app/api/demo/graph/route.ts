import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({
        "nodes": [
            { "id": "INV-001", "type": "invoice", "amount": 1000 },
            { "id": "INV-002", "type": "invoice", "amount": 500 },
            { "id": "STL-101", "type": "settlement", "amount": 1450 }, // Total after some fees
            { "id": "BNK-901", "type": "bank", "amount": 1450 },
            { "id": "LED-301", "type": "ledger", "amount": 1000 },
            { "id": "LED-302", "type": "ledger", "amount": 500 }
        ],
        "edges": [
            { "source": "INV-001", "target": "STL-101", "relationship": "settled_in", "confidence": 1.0 },
            { "source": "INV-002", "target": "STL-101", "relationship": "settled_in", "confidence": 1.0 },
            { "source": "STL-101", "target": "BNK-901", "relationship": "bank_deposit", "confidence": 0.98 },
            { "source": "INV-001", "target": "LED-301", "relationship": "posted_to", "confidence": 1.0 },
            { "source": "INV-002", "target": "LED-302", "relationship": "posted_to", "confidence": 1.0 }
        ]
    });
}
