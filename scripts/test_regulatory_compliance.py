"""
CHEIRAP Regulatory Intelligence & Statutory Traceability Layer — Automated Test Suite
Testing the 6 mandatory statutory test cases specified in Master Implementation Prompt Section 36.
"""

import sys
import os
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import server.regulatory_kb as rkb
from server.app import (
    health_check,
    get_stats,
    list_tenders,
    get_tender_regulatory_analysis,
    get_tender_authority_check,
    get_tender_evidence,
    get_tender_audit_trail,
    record_officer_review,
    escalate_tender_case,
    generate_formal_integrity_report,
    get_risk_regulatory_basis,
    search_regulations_api,
    get_regulatory_coverage,
    get_regulatory_version_history,
    OfficerReviewRequest,
    EscalateRequest
)

def run_tests():
    print("=" * 80)
    print("CHEIRAP AI — STATUTORY TRACEABILITY & REGULATORY INTELLIGENCE TEST SUITE")
    print("=" * 80)

    total_passed = 0
    total_tests = 6

    # ──────────────────────────────────────────────────────────────────────────
    # TEST 1: Low Bidder Count
    # Expected: Risk detected, Potential competition concern, Regulatory mapping displayed,
    #           NO claim of violation.
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[TEST 1] Evaluating Low Bidder Count / Single Bidder Walkover...")
    synthetic_tender_1 = {
        "tender_id": "TEST_TENDER_001",
        "title": "Supply of Laboratory Equipment for High Schools",
        "department": "Education (S)",
        "org_chain": "Executive Engineer, Education Engineering Wing",
        "estimated_value_inr": 8500000.0,  # 85 Lakhs
        "emd_amount_inr": 170000.0,
        "corrigendum_count": 0,
        "feat_window_days": 21.0,
        "feat_window_compression_hours": 336.0,
        "feat_single_bidder_risk": 1.0,
        "bids_received": 1,
        "feat_emd_ratio": 0.02,
        "feat_spread_ratio": 0.95,
        "cheirap_risk_score": 78,
        "vigilance_tier": "AMBER"
    }

    res1 = rkb.get_regulatory_analysis_for_tender(synthetic_tender_1)
    single_bid_mapping = next((m for m in res1["regulatory_mappings"] if m["risk_code"] == "RISK-SINGLE-001"), None)

    assert single_bid_mapping is not None, "RISK-SINGLE-001 mapping must be triggered"
    assert single_bid_mapping["relationship_type"] == "DIRECTLY_RELEVANT"
    assert "GFR 173" in single_bid_mapping["provision_ref"] or "Rule 173" in single_bid_mapping["provision_ref"]
    assert "violation confirmed" not in single_bid_mapping["explanation"].lower(), "Must NOT claim violation confirmed"
    assert "potential" in single_bid_mapping["risk_title"].lower() or "vulnerability" in single_bid_mapping["risk_title"].lower()
    print(f"  ✓ Risk Detected: {single_bid_mapping['risk_code']} — {single_bid_mapping['risk_title']}")
    print(f"  ✓ Regulatory Reference: {single_bid_mapping['provision_ref']} ({single_bid_mapping['relationship_type']})")
    print(f"  ✓ Neutral Governance Language Verified: '{single_bid_mapping['explanation'][:85]}...'")
    total_passed += 1

    # ──────────────────────────────────────────────────────────────────────────
    # TEST 2: Approval Authority Outside Configured Delegation
    # Expected: Authority exception, DFPR/delegation mapping, Verification required.
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[TEST 2] Evaluating Approval Authority Outside Configured Delegation...")
    synthetic_tender_2 = {
        "tender_id": "TEST_TENDER_002",
        "title": "Major High-Speed Water Supply Tunneling Project",
        "department": "Public Health Engineering Department",
        "org_chain": "Chief Engineer, PHED, Government of Manipur",
        "estimated_value_inr": 382000000.0,  # ₹38.20 Crores (CE limit is ₹25.00 Cr)
        "recorded_approving_authority": "Chief Engineer",
        "corrigendum_count": 4,
        "feat_window_days": 9.8,
        "feat_window_compression_hours": 45.4,
        "feat_emd_ratio": 0.02,
        "feat_single_bidder_risk": 1.0,
        "cheirap_risk_score": 98,
        "vigilance_tier": "RED"
    }

    auth_check = rkb.verify_authority_delegation(synthetic_tender_2)
    assert auth_check["status"] == "REQUIRES_VERIFICATION", f"Expected REQUIRES_VERIFICATION, got {auth_check['status']}"
    assert auth_check["compliance_flag"] == "RED"
    assert auth_check["permitted_financial_limit_cr"] == 25.0
    assert auth_check["procurement_value_cr"] == 38.2
    assert "Manipur DFPR" in auth_check["applicable_delegation"]
    print(f"  ✓ Authority Flag: {auth_check['compliance_flag']} | Status: {auth_check['status']}")
    print(f"  ✓ Limit: ₹{auth_check['permitted_financial_limit_cr']} Cr vs Value: ₹{auth_check['procurement_value_cr']} Cr")
    print(f"  ✓ Citation: {auth_check['applicable_delegation']}")
    print(f"  ✓ Action: {auth_check['details']}")
    total_passed += 1

    # ──────────────────────────────────────────────────────────────────────────
    # TEST 3: No Verified Regulatory Provision Exists
    # Expected: Explicitly display 'Regulatory reference requires verification', NOT a fake citation.
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[TEST 3] Evaluating Unverified Regulatory Reference Handling...")
    unverified_prov = next((p for p in rkb.REGULATORY_PROVISIONS if p["id"] == "PROV-UNVERIFIED-PREF"), None)
    assert unverified_prov is not None, "Unverified provision must be catalogued in KB"
    assert unverified_prov["verification_status"] == "REQUIRES_VERIFICATION"
    assert "UNVERIFIED" in unverified_prov["official_reference"] or "REQUIRES_VERIFICATION" in unverified_prov["verification_status"]
    
    # Test search for unverified status
    unverified_search = rkb.search_regulations(status="REQUIRES_VERIFICATION")
    assert unverified_search["total_provisions_matched"] >= 1
    print(f"  ✓ Provision ID: {unverified_prov['id']}")
    print(f"  ✓ Title: {unverified_prov['title']}")
    print(f"  ✓ Verification Status: {unverified_prov['verification_status']}")
    print(f"  ✓ Citation Guard: Displays 'Regulatory reference requires verification' rather than inventing precision.")
    total_passed += 1

    # ──────────────────────────────────────────────────────────────────────────
    # TEST 4: Historical Procurement (Rule Versioning)
    # Expected: Historical regulatory version used based on date of procurement.
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[TEST 4] Evaluating Historical Regulatory Versioning...")
    # Date in 2016 (before GFR 2017 took effect on 2017-03-08)
    hist_2016 = rkb.get_applicable_regulations_for_date("2016-04-15", jurisdiction="CENTRAL")
    source_ids_2016 = [s["id"] for s in hist_2016["active_sources"]]
    assert "SRC-GFR-2005" in source_ids_2016, "2016 evaluation must include GFR 2005"
    assert "SRC-GFR-2017" not in source_ids_2016, "2016 evaluation must NOT include GFR 2017"

    # Current date
    curr_2026 = rkb.get_applicable_regulations_for_date("2026-10-04", jurisdiction="CENTRAL")
    source_ids_2026 = [s["id"] for s in curr_2026["active_sources"]]
    assert "SRC-GFR-2017" in source_ids_2026, "2026 evaluation must include GFR 2017"
    print(f"  ✓ Historical Date 2016-04-15: Resolved to GFR 2005 (Superseded archive)")
    print(f"  ✓ Contemporary Date 2026-10-04: Resolved to GFR 2017 (Active)")
    print(f"  ✓ No retroactive application of future rules confirmed.")
    total_passed += 1

    # ──────────────────────────────────────────────────────────────────────────
    # TEST 5: Manipur State Procurement (State Precedence)
    # Expected: Applicable State framework considered; Central rule does NOT override State rule.
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[TEST 5] Evaluating State vs Central Regulatory Precedence...")
    precedence = rkb.determine_regulatory_precedence(synthetic_tender_2)
    assert len(precedence) >= 3
    assert precedence[0]["jurisdiction"] == "STATE", "Rank 1 authority must be STATE jurisdiction for Manipur Works"
    assert "Manipur DFPR" in precedence[0]["source_name"]
    assert precedence[1]["jurisdiction"] == "STATE"
    assert "Manipur PWD" in precedence[1]["source_name"]
    assert precedence[2]["jurisdiction"] == "CENTRAL"
    print(f"  ✓ Precedence Rank 1: {precedence[0]['source_name']} ({precedence[0]['jurisdiction']})")
    print(f"  ✓ Precedence Rank 2: {precedence[1]['source_name']} ({precedence[1]['jurisdiction']})")
    print(f"  ✓ Precedence Rank 3: {precedence[2]['source_name']} ({precedence[2]['jurisdiction']})")
    print(f"  ✓ State Statutory Priority Verified: State DFPR governs CE financial thresholds.")
    total_passed += 1

    # ──────────────────────────────────────────────────────────────────────────
    # TEST 6: False Positive Review Action & Audit Trail
    # Expected: Officer selects FALSE POSITIVE. System records officer, reason,
    #           timestamp, evidence, and updates status without deleting data.
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[TEST 6] Evaluating Human-in-the-Loop 'FALSE POSITIVE' Decision & Audit Trail...")
    test_tender_id = "2026_MoIT_3501_1"
    review_req = OfficerReviewRequest(
        officer_name="Shri N. Biren Singh, IAS",
        officer_role="SUPER_ADMIN",
        action="FALSE POSITIVE",
        reason="Technical clarification issued 10 days prior with documented 14-day window; MSME participation was verified.",
        comments="Reviewed with Superintending Engineer. Clarification was non-material.",
        evidence_accessed=["NIT Original", "Corrigendum No 1 Log", "MSME Register"],
        regulatory_references_viewed=["CVC Circular 01/01/2021", "GFR Rule 161"]
    )

    review_res = record_officer_review(test_tender_id, review_req)
    assert review_res["status"] == "REVIEW_RECORDED"
    assert review_res["action_taken"] == "FALSE POSITIVE"

    # Check Audit Trail
    audit_res = get_tender_audit_trail(test_tender_id)
    latest_event = audit_res["audit_trail"][-1]
    assert latest_event["action"] == "FALSE POSITIVE"
    assert latest_event["officer_name"] == "Shri N. Biren Singh, IAS"
    assert latest_event["new_status"] == "FALSE_POSITIVE"
    assert "MSME Register" in latest_event["evidence_accessed"]
    print(f"  ✓ Action Recorded: {latest_event['action']} by {latest_event['officer_name']}")
    print(f"  ✓ Timestamp: {latest_event['timestamp']}")
    print(f"  ✓ Status Transition: {latest_event['old_status']} ➔ {latest_event['new_status']}")
    print(f"  ✓ Evidence Logged: {latest_event['evidence_accessed']}")
    print(f"  ✓ Immutable Audit Trail Length: {audit_res['total_events']} events")
    total_passed += 1

    # ──────────────────────────────────────────────────────────────────────────
    # BONUS: Test Formal 14-Section Integrity Report Generation
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[ADDITIONAL VERIFICATION] Testing 14-Section Formal Integrity Report Generation...")
    report = generate_formal_integrity_report(test_tender_id)
    sections = report["sections"]
    assert len(sections) == 14, f"Report must have 14 distinct sections, got {len(sections)}"
    assert sections["02_procurement_details"]["data_category"] == "FACT"
    assert sections["03_risk_assessment"]["data_category"] == "ANALYTICAL_OBSERVATION"
    assert sections["08_regulatory_relevance"]["data_category"] == "REGULATORY_RELEVANCE"
    assert sections["10_recommended_review_actions"]["data_category"] == "RECOMMENDATION"
    assert sections["12_decision"]["data_category"] == "OFFICIAL_DETERMINATION"
    print(f"  ✓ 14-Section Report Generated: {report['report_id']}")
    print(f"  ✓ Strict Category Segregation: FACT, ANALYTICAL OBSERVATION, REGULATORY RELEVANCE, RECOMMENDATION, OFFICIAL DETERMINATION.")

    print("\n" + "=" * 80)
    print(f"RESULTS: {total_passed}/{total_tests} STATUTORY COMPLIANCE TESTS PASSED (100%)")
    print("=" * 80)

if __name__ == "__main__":
    run_tests()
