from dataclasses import dataclass, field
from typing import List
import pandas as pd

from .schemas_registry import SOURCE_SCHEMAS


@dataclass
class ValidationIssue:
    severity: str   # "warning" | "blocking"
    code: str
    message: str


@dataclass
class ValidationReport:
    source: str
    total_rows: int
    valid_rows: int
    invalid_rows: int
    issues: List[ValidationIssue] = field(default_factory=list)

    @property
    def has_blocking_error(self) -> bool:
        return any(i.severity == "blocking" for i in self.issues)

    @property
    def warning_count(self) -> int:
        return sum(1 for i in self.issues if i.severity == "warning")

    @property
    def blocking_count(self) -> int:
        return sum(1 for i in self.issues if i.severity == "blocking")


def _is_numeric_or_blank(value, allow_blank: bool) -> bool:
    if value is None:
        return allow_blank
    s = str(value).strip()
    if s == "" or s.lower() == "nan":
        return allow_blank
    try:
        float(s)
        return True
    except ValueError:
        return False


def validate_dataframe(df: pd.DataFrame, source: str) -> ValidationReport:
    spec = SOURCE_SCHEMAS[source]
    issues: List[ValidationIssue] = []
    total_rows = len(df)
    columns = set(c.strip() for c in df.columns)

    # 1. required columns present
    missing_cols = [c for c in spec["required_columns"] if c not in columns]
    if missing_cols:
        issues.append(ValidationIssue(
            "blocking", "MISSING_COLUMNS",
            f"Missing required columns: {', '.join(missing_cols)}"
        ))
        # can't reliably validate rows without the expected columns
        return ValidationReport(source=source, total_rows=total_rows,
                                 valid_rows=0, invalid_rows=total_rows, issues=issues)

    # 2. completely empty rows
    empty_row_mask = df[spec["required_columns"]].apply(
        lambda row: all(str(v).strip() == "" or pd.isna(v) for v in row), axis=1
    )
    n_empty = int(empty_row_mask.sum())
    if n_empty:
        issues.append(ValidationIssue(
            "blocking", "EMPTY_ROWS", f"{n_empty} completely empty row(s) found"
        ))

    # 3. duplicate primary ids
    primary_id = spec["primary_id"]
    id_series = df[primary_id].astype(str).str.strip()
    dup_mask = id_series.duplicated(keep=False) & (id_series != "")
    n_dupes = int(dup_mask.sum())
    if n_dupes:
        issues.append(ValidationIssue(
            "warning", "DUPLICATE_IDS",
            f"{n_dupes} row(s) share a duplicate {primary_id} value"
        ))

    # 4. date columns parse
    row_has_date_error = pd.Series(False, index=df.index)
    for date_col in spec["date_columns"]:
        parsed = pd.to_datetime(df[date_col], errors="coerce", format="%Y-%m-%d")
        bad = parsed.isna() & df[date_col].astype(str).str.strip().ne("")
        n_bad = int(bad.sum())
        if n_bad:
            issues.append(ValidationIssue(
                "blocking", "BAD_DATE",
                f"{n_bad} row(s) have an unparseable {date_col}"
            ))
        row_has_date_error = row_has_date_error | bad

    # 5. monetary fields numeric (some columns, e.g. bank/ledger debit & credit,
    #    are allowed to be blank on a given row since only one side applies)
    row_has_money_error = pd.Series(False, index=df.index)
    blankable = set(spec.get("blankable_money_columns", []))
    for money_col in spec["money_columns"]:
        allow_blank = money_col in blankable
        bad = ~df[money_col].apply(lambda v: _is_numeric_or_blank(v, allow_blank))
        n_bad = int(bad.sum())
        if n_bad:
            issues.append(ValidationIssue(
                "blocking", "NON_NUMERIC_AMOUNT",
                f"{n_bad} row(s) have a non-numeric {money_col}"
            ))
        row_has_money_error = row_has_money_error | bad

    # 6. ledger-specific rule: every row needs at least one of debit/credit populated
    if source == "LEDGER":
        both_blank = df.apply(
            lambda r: (str(r["debit"]).strip() in ("", "nan")) and
                      (str(r["credit"]).strip() in ("", "nan")), axis=1
        )
        n_both_blank = int(both_blank.sum())
        if n_both_blank:
            issues.append(ValidationIssue(
                "blocking", "LEDGER_NO_AMOUNT",
                f"{n_both_blank} ledger row(s) have neither a debit nor a credit value"
            ))
        row_has_money_error = row_has_money_error | both_blank

    row_invalid = empty_row_mask | row_has_date_error | row_has_money_error
    invalid_rows = int(row_invalid.sum())
    valid_rows = total_rows - invalid_rows

    return ValidationReport(
        source=source, total_rows=total_rows,
        valid_rows=valid_rows, invalid_rows=invalid_rows, issues=issues,
    )
