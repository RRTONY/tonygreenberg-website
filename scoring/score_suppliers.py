#!/usr/bin/env python3
"""
score_suppliers.py — Vendor Intake Scoring Engine
Updated to match unified_two_stage_form_spec.pdf.

Usage:
    python3 score_suppliers.py <supplier_json_file>
    python3 score_suppliers.py --batch <directory_of_json_files>
    python3 score_suppliers.py --csv <suppliers.csv>

Each supplier JSON file must have field names matching field_mapping.json.
Missing fields are treated as "Pending" (not scored, not penalised).

Exit codes:
    0  — success
    1  — input file not found or parse error
    2  — config file not found
"""

import json
import sys
import os
import csv
import re
from pathlib import Path
from typing import Any

# ── Config paths ────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
SCORING_RULES_PATH = SCRIPT_DIR / "scoring_rules.json"
FIELD_MAPPING_PATH = SCRIPT_DIR / "field_mapping.json"


def load_config() -> tuple[dict, dict]:
    """Load scoring_rules.json and field_mapping.json."""
    for path in (SCORING_RULES_PATH, FIELD_MAPPING_PATH):
        if not path.exists():
            print(f"ERROR: Config file not found: {path}", file=sys.stderr)
            sys.exit(2)
    with open(SCORING_RULES_PATH) as f:
        rules = json.load(f)
    with open(FIELD_MAPPING_PATH) as f:
        mapping = json.load(f)
    return rules, mapping


# ── Scoring logic ────────────────────────────────────────────────────────────

def score_supplier(supplier: dict[str, Any], rules: dict) -> dict:
    """
    Score a single supplier record against scoring_rules.json.

    Returns a result dict with:
        total_score       — numeric total
        max_possible      — max achievable given submitted fields
        pending_fields    — list of fields not yet submitted
        category_scores   — breakdown by scoring category
        mass_spec_bonus   — bool, whether the bonus was awarded
        scorecard         — per-field detail rows
        grade             — letter grade (A/B/C/D/F)
        recommendation    — human-readable recommendation string
    """
    fields_config = rules["fields"]
    max_score = rules["max_score"]

    total = 0
    max_possible = 0
    pending_fields: list[str] = []
    category_scores: dict[str, dict] = {}
    scorecard: list[dict] = []
    mass_spec_bonus = False

    # ── Scored dropdown fields ────────────────────────────────────────────
    for field_name, field_def in fields_config.items():
        if field_name == "testing_protocols_mass_spec_bonus":
            continue  # handled separately below

        category = field_def["category"]
        max_pts = field_def["max_pts"]
        options = field_def.get("options", {})

        # Initialise category bucket
        if category not in category_scores:
            category_scores[category] = {"earned": 0, "max": 0, "pending": 0}

        value = supplier.get(field_name)

        if value is None or str(value).strip() == "":
            # Field not yet submitted — treat as Pending
            pending_fields.append(field_name)
            category_scores[category]["pending"] += max_pts
            scorecard.append({
                "field": field_name,
                "value": "Pending",
                "pts_earned": "Pending",
                "pts_max": max_pts,
                "category": category,
            })
        else:
            value_str = str(value).strip()
            pts = options.get(value_str)
            if pts is None:
                # Unrecognised option — score 0 but flag it
                pts = 0
                flag = f"UNRECOGNISED VALUE: '{value_str}'"
            else:
                flag = None

            total += pts
            max_possible += max_pts
            category_scores[category]["earned"] += pts
            category_scores[category]["max"] += max_pts
            scorecard.append({
                "field": field_name,
                "value": value_str,
                "pts_earned": pts,
                "pts_max": max_pts,
                "category": category,
                "flag": flag,
            })

    # ── Mass-spectrometry keyword bonus (Stage 2) ─────────────────────────
    bonus_def = fields_config.get("testing_protocols_mass_spec_bonus", {})
    bonus_pts = bonus_def.get("bonus_pts", 5)
    keywords = bonus_def.get("keywords", [])
    testing_protocols_text = supplier.get("testing_protocols", "")

    if testing_protocols_text:
        text_lower = testing_protocols_text.lower()
        for kw in keywords:
            if kw.lower() in text_lower:
                mass_spec_bonus = True
                break
        if mass_spec_bonus:
            total += bonus_pts
            max_possible += bonus_pts
            cat = "quality_assurance"
            if cat not in category_scores:
                category_scores[cat] = {"earned": 0, "max": 0, "pending": 0}
            category_scores[cat]["earned"] += bonus_pts
            category_scores[cat]["max"] += bonus_pts
            scorecard.append({
                "field": "testing_protocols_mass_spec_bonus",
                "value": "Mass-spec keyword detected",
                "pts_earned": bonus_pts,
                "pts_max": bonus_pts,
                "category": cat,
            })
    else:
        pending_fields.append("testing_protocols")

    # ── Grade ─────────────────────────────────────────────────────────────
    pct = (total / max_score * 100) if max_score > 0 else 0
    # Grade thresholds based on raw score out of 50 (45 stage1 + 5 mass-spec bonus)
    thresholds = rules.get('grade_thresholds', {'A': 40, 'B': 30, 'C': 20})
    if total >= thresholds['A']:
        grade = "A"
    elif total >= thresholds['B']:
        grade = "B"
    elif total >= thresholds['C']:
        grade = "C"
    else:
        grade = "D"

    # ── Recommendation ────────────────────────────────────────────────────
    if grade in ("A", "B"):
        recommendation = "Pursue — send Stage 2 link"
    elif grade == "C":
        recommendation = "Conditional — request clarification before Stage 2"
    else:
        recommendation = "Do not pursue at this time"

    return {
        "total_score": total,
        "max_score": max_score,
        "max_possible_given_data": max_possible,
        "pct_of_ceiling": round(pct, 1),
        "pending_fields": pending_fields,
        "category_scores": category_scores,
        "mass_spec_bonus": mass_spec_bonus,
        "scorecard": scorecard,
        "grade": grade,
        "recommendation": recommendation,
    }


def print_scorecard(supplier_id: str, supplier: dict, result: dict) -> None:
    """Pretty-print a single supplier scorecard to stdout."""
    name = supplier.get("legal_entity_name", supplier_id)
    print(f"\n{'='*60}")
    print(f"  SUPPLIER: {name}")
    print(f"  ID:       {supplier_id}")
    print(f"{'='*60}")
    print(f"  SCORE:    {result['total_score']} / {result['max_score']}  "
          f"({result['pct_of_ceiling']}%)  Grade: {result['grade']}")
    print(f"  STATUS:   {result['recommendation']}")
    if result["mass_spec_bonus"]:
        print("  BONUS:    +5 pts — mass-spectrometry keyword detected in testing_protocols")
    print()
    print("  CATEGORY BREAKDOWN:")
    for cat, data in result["category_scores"].items():
        pending_note = f"  (+{data['pending']} pts pending)" if data.get("pending") else ""
        print(f"    {cat:<30} {data['earned']:>3} / {data['max']:>3}{pending_note}")
    if result["pending_fields"]:
        print()
        print(f"  PENDING FIELDS ({len(result['pending_fields'])}):")
        for f in result["pending_fields"]:
            print(f"    - {f}")
    print()
    print("  FIELD DETAIL:")
    for row in result["scorecard"]:
        pts = row["pts_earned"]
        pts_str = f"{pts:>3}" if isinstance(pts, int) else f"{'?':>3}"
        flag = f"  ⚠ {row['flag']}" if row.get("flag") else ""
        print(f"    {row['field']:<45} {pts_str} / {row['pts_max']:>2}  [{row['value']}]{flag}")
    print()


# ── Entry points ─────────────────────────────────────────────────────────────

def score_file(path: str, rules: dict) -> dict:
    """Load a JSON file and score it. Returns {supplier_id, supplier, result}."""
    with open(path) as f:
        data = json.load(f)
    supplier_id = data.get("supplier_id", Path(path).stem)
    result = score_supplier(data, rules)
    return {"supplier_id": supplier_id, "supplier": data, "result": result}


def score_csv(path: str, rules: dict) -> list[dict]:
    """Load a CSV where each row is a supplier and score all rows."""
    results = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            supplier_id = row.get("supplier_id", row.get("legal_entity_name", "unknown"))
            result = score_supplier(dict(row), rules)
            results.append({"supplier_id": supplier_id, "supplier": row, "result": result})
    return results


def main() -> None:
    rules, _mapping = load_config()

    args = sys.argv[1:]

    if not args:
        print(__doc__)
        sys.exit(0)

    if args[0] == "--batch" and len(args) >= 2:
        directory = Path(args[1])
        json_files = sorted(directory.glob("*.json"))
        if not json_files:
            print(f"No JSON files found in {directory}", file=sys.stderr)
            sys.exit(1)
        all_results = []
        for jf in json_files:
            r = score_file(str(jf), rules)
            print_scorecard(r["supplier_id"], r["supplier"], r["result"])
            all_results.append(r)
        # Summary table
        print(f"\n{'='*60}")
        print("  BATCH SUMMARY")
        print(f"{'='*60}")
        print(f"  {'Supplier':<35} {'Score':>6}  {'Grade':>5}  {'Recommendation'}")
        print(f"  {'-'*35} {'-'*6}  {'-'*5}  {'-'*30}")
        for r in sorted(all_results, key=lambda x: x["result"]["total_score"], reverse=True):
            name = r["supplier"].get("legal_entity_name", r["supplier_id"])[:35]
            res = r["result"]
            print(f"  {name:<35} {res['total_score']:>3}/{res['max_score']:<3}  "
                  f"{res['grade']:>5}  {res['recommendation']}")

    elif args[0] == "--csv" and len(args) >= 2:
        results = score_csv(args[1], rules)
        for r in results:
            print_scorecard(r["supplier_id"], r["supplier"], r["result"])

    else:
        # Single file
        path = args[0]
        if not os.path.exists(path):
            print(f"ERROR: File not found: {path}", file=sys.stderr)
            sys.exit(1)
        r = score_file(path, rules)
        print_scorecard(r["supplier_id"], r["supplier"], r["result"])
        # Also write JSON result alongside the input file
        out_path = Path(path).with_suffix(".score.json")
        with open(out_path, "w") as f:
            json.dump(r["result"], f, indent=2)
        print(f"  Score written to: {out_path}")


if __name__ == "__main__":
    main()
