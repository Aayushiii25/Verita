import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({
        "MATCHED": [
            {
                "settlement_id": "STL-992",
                "bank_id": "BNK-1029",
                "status": "matched",
                "reason": "Exact amount match and date alignment",
                "probability": 0.98
            },
            {
                "settlement_id": "STL-402",
                "bank_id": "BNK-3021",
                "status": "matched",
                "reason": "Fuzzy string match on reference ID",
                "probability": 0.92
            },
            {
                "settlement_id": "STL-112",
                "bank_id": "BNK-8092",
                "status": "matched",
                "reason": "Date alignment and amount match",
                "probability": 0.95
            },
            {
                "settlement_id": "STL-312",
                "bank_id": "BNK-9902",
                "status": "matched",
                "reason": "Exact match",
                "probability": 0.99
            }
        ],
        "REVIEW": [
            {
                "invoice_ids": ["INV-8302", "INV-2931"],
                "status": "review",
                "reason": "Partial match on aggregated amount, missing date correlation",
                "probability": 0.65
            },
            {
                "invoice_ids": ["INV-4402"],
                "status": "review",
                "reason": "Reference string matches but amount differs by ₹20",
                "probability": 0.55
            }
        ],
        "EXCEPTIONS": [
            {
                "bank_id": "BNK-X902",
                "status": "exception",
                "reason": "Orphaned bank transaction - No corresponding settlement found",
                "probability": 0.12
            }
        ],
        "total_candidates": 1024,
        "counts": {
            "MATCHED": 842,
            "REVIEW": 156,
            "EXCEPTIONS": 26
        }
    });
}
