"""
Central registry describing what each source file is supposed to look like.
Source detection and validation both read from this registry instead of
hardcoding column names in multiple places.
"""

SOURCE_SCHEMAS = {
    "BANK": {
        "required_columns": [
            "transaction_id", "transaction_date", "value_date", "description",
            "reference_number", "debit", "credit", "balance", "counterparty_name",
        ],
        # columns whose presence is most distinctive for identifying this source
        "signature_columns": ["transaction_id", "transaction_date", "debit", "credit", "balance"],
        "primary_id": "transaction_id",
        "date_columns": ["transaction_date", "value_date"],
        "money_columns": ["debit", "credit", "balance"],
        # a bank row is either a debit OR a credit, never both - so these two
        # are allowed to be blank on any given row (balance is always required)
        "blankable_money_columns": ["debit", "credit"],
    },
    "INVOICE": {
        "required_columns": [
            "invoice_number", "invoice_date", "order_reference", "customer_id",
            "customer_name", "gross_amount", "tax_amount", "net_amount", "payment_status",
        ],
        "signature_columns": ["invoice_number", "invoice_date", "gross_amount", "customer_id"],
        "primary_id": "invoice_number",
        "date_columns": ["invoice_date"],
        "money_columns": ["gross_amount", "tax_amount", "net_amount"],
        "blankable_money_columns": [],
    },
    "SETTLEMENT": {
        "required_columns": [
            "settlement_id", "settlement_date", "marketplace", "gross_sales",
            "commission_fee", "payment_fee", "refund_amount", "other_adjustments",
            "payout_amount", "bank_reference",
        ],
        "signature_columns": ["settlement_id", "settlement_date", "payout_amount", "commission_fee"],
        "primary_id": "settlement_id",
        "date_columns": ["settlement_date"],
        "money_columns": ["gross_sales", "commission_fee", "payment_fee", "refund_amount",
                           "other_adjustments", "payout_amount"],
        "blankable_money_columns": [],
    },
    "LEDGER": {
        "required_columns": [
            "journal_id", "posting_date", "account_name", "debit", "credit",
            "currency", "narration", "related_reference",
        ],
        "signature_columns": ["journal_id", "posting_date", "account_name", "debit", "credit"],
        "primary_id": "journal_id",
        "date_columns": ["posting_date"],
        # debit/credit are allowed to be blank per row (one or the other), so they are
        # validated with blank-tolerant numeric checks rather than strict numeric checks
        "money_columns": ["debit", "credit"],
        "blankable_money_columns": ["debit", "credit"],
    },
}
