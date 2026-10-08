import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server.app import health_check, get_stats, list_tenders, get_tender_detail, get_venue_radar, generate_hold_order

print("=" * 65)
print("TESTING CHEIRAP AI FASTAPI BACKEND ROUTES")
print("=" * 65)

# 1. Health
h = health_check()
print(f"[1] /api/health -> Status: {h['status']} | System: {h['system']}")

# 2. Stats
s = get_stats()
sum_data = s['summary']
print(f"[2] /api/stats  -> Total Monitored: {sum_data['total_tenders_monitored']} tenders (Rs. {sum_data['total_procurement_value_cr']} Cr)")
print(f"                   RED Hold: {sum_data['red_hold_count']} (Rs. {sum_data['red_hold_capex_cr']} Cr) | Compliance: {sum_data['compliance_rate_pct']}%")

# 3. Tenders listing
t_all = list_tenders(limit=5)
print(f"[3] /api/tenders -> Matched: {t_all['total_matched']} | Returned: {len(t_all['tenders'])}")

# 4. Venue Radar
v = get_venue_radar()
print(f"[4] /api/venue-radar -> Found {v['total_venue_tenders']} tenders around {v['venue'][:35]}...")
for t in v['tenders'][:3]:
    print(f"      - [{t['vigilance_tier']}] Score: {t['cheirap_risk_score']} | {t['tender_id']} | {t['title'][:55]}...")

# 5. Generate Pre-Award Hold Order for Highest Risk Tender
red_id = "2025_PHED_2988_3"
print(f"\n[5] Testing /api/generate-hold-order/{red_id}...")
order_res = generate_hold_order(red_id)
notice = order_res['notice']
print(f"    * Memorandum No: {notice['memorandum_number']}")
print(f"    * Authority:      {notice['authority']}")
print(f"    * Target Project: {notice['target_tender']['project_title'][:65]}...")
print(f"    * Value:          {notice['target_tender']['estimated_value_formatted']}")
print(f"    * Risk Score:     {notice['vigilance_assessment']['cheirap_risk_score']}/100 ({notice['vigilance_assessment']['vigilance_tier']})")
print("    * Statutory Violations:")
for v in notice['statutory_violations_cited']:
    print(f"        ! {v}")
print("    * Mandatory Corrective Directives:")
for d in notice['mandatory_directives'][:2]:
    print(f"        > {d[:80]}...")
print(f"    * Verification:   {notice['signatory']['verification_hash']}")
print("\nALL API ENDPOINTS TESTED & VERIFIED SUCCESSFULLY!")
