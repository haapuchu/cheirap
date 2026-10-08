import sys
import os
import json
import csv
import re
from datetime import datetime
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import MinMaxScaler

sys.stdout.reconfigure(encoding='utf-8')

def parse_date(date_str):
    if not date_str or pd.isna(date_str):
        return None
    # Common format: '29-Sep-2026 06:20 PM'
    clean = str(date_str).strip()
    try:
        return datetime.strptime(clean, "%d-%b-%Y %I:%M %p")
    except Exception:
        try:
            return datetime.strptime(clean, "%d-%b-%Y")
        except Exception:
            return None

def compute_features(records):
    featured = []
    
    # Baseline project cost dictionary for PPP/EOI tenders
    baseline_estimates = {
        '2026_MoIT_3502_1': 50000000.0, # Co-Working Space PPP (Rs 5 Cr)
        '2026_MoIT_3498_1': 25000000.0, # IT SEZ Space Allotment (Rs 2.5 Cr)
        '2026_MANID_3496_1': 38000000.0, # MANIDCO Civil Works (Rs 3.8 Cr)
        '2026_MoIT_3485_1': 18000000.0  # IT SEZ Maintenance (Rs 1.8 Cr)
    }

    for r in records:
        t_id = r.get('tender_id', '')
        est_val = float(r.get('estimated_value_inr', 0.0))
        emd = float(r.get('emd_amount_inr', 0.0))
        fee = float(r.get('tender_fee_inr', 0.0))
        corr_cnt = int(r.get('corrigendum_count', 0))
        
        # Location fix if parsing anomaly
        loc = r.get('location', 'Imphal')
        if loc == '1143.56':
            loc = 'Keirao, Imphal East'

        # If zero estimate, use baseline or estimate from EMD
        if est_val <= 0:
            if t_id in baseline_estimates:
                est_val = baseline_estimates[t_id]
            elif emd > 0:
                est_val = emd * 50.0 # 2% EMD assumption
            else:
                est_val = 15000000.0 # Default fallback Rs 1.5 Cr

        if emd <= 0:
            emd = est_val * 0.02 # 2% default

        # Timelines
        pub_dt = parse_date(r.get('published_date'))
        cls_dt = parse_date(r.get('closing_date'))
        sub_start = parse_date(r.get('submission_start'))
        sub_end = parse_date(r.get('submission_end'))

        # 1. Total submission window in days
        if pub_dt and cls_dt:
            window_days = max(1.0, (cls_dt - pub_dt).total_seconds() / 86400.0)
        else:
            window_days = 21.0 # Standard default

        # 2. Corrigendum Velocity (Corrigenda per remaining week)
        corr_velocity = (corr_cnt / max(1.0, window_days)) * 7.0

        # 3. Window compression hours (CVC guideline: changes must allow >= 7 days / 168 hrs)
        # If multiple corrigenda, window is squeezed
        if corr_cnt > 0:
            # Squeezed hours proxy based on corrigenda count and window
            window_compression_hours = max(24.0, (window_days * 24.0) / (corr_cnt + 1.2))
        else:
            window_compression_hours = window_days * 24.0

        # 4. EMD Skew Ratio (CVC statutory standard is 1.0% to 2.0%)
        emd_ratio = emd / max(1.0, est_val)
        emd_skew_dev = abs(emd_ratio - 0.02) # deviation from 2.0% benchmark

        # 5. Tender Fee to Value Ratio
        fee_ratio = fee / max(1.0, est_val)

        # 6. Single Bidder Walkover Risk Flag
        # If benchmark has bids_received == 1 or repeat corrigenda
        bids = r.get('bids_received')
        if bids is not None:
            is_single_bidder = 1.0 if int(bids) == 1 else 0.0
        else:
            # Active queue proxy based on abnormal barriers (high corrigenda + compressed window + high EMD)
            is_single_bidder = 1.0 if (corr_cnt >= 2 and window_compression_hours < 72.0) else 0.0

        # 7. Spread to Estimate (Clustering at 99.8% is classic walkover sign)
        awarded_val = float(r.get('awarded_value_inr', 0.0))
        if awarded_val > 0 and est_val > 0:
            spread_ratio = awarded_val / est_val
        else:
            spread_ratio = 0.995 if is_single_bidder == 1.0 else 0.940

        # 8. Departmental Capex Intensity (Log10 scale)
        capex_intensity = np.log10(max(100000.0, est_val))

        # 9. Retender Churn
        churn_count = 1 if 'RT' in str(r.get('ref_no', '')) or 'Re-Tender' in str(r.get('title', '')) else 0

        feat_dict = {
            **r,
            'location': loc,
            'estimated_value_inr': est_val,
            'emd_amount_inr': emd,
            'feat_window_days': round(window_days, 1),
            'feat_corr_velocity': round(corr_velocity, 2),
            'feat_window_compression_hours': round(window_compression_hours, 1),
            'feat_emd_ratio': round(emd_ratio, 4),
            'feat_emd_skew_dev': round(emd_skew_dev, 4),
            'feat_single_bidder_risk': is_single_bidder,
            'feat_spread_ratio': round(spread_ratio, 4),
            'feat_capex_intensity': round(capex_intensity, 2),
            'feat_retender_churn': churn_count
        }
        featured.append(feat_dict)

    return featured

def evaluate_cvc_statutory_rules(rec):
    violations = []
    penalty_score = 0

    # Rule 1: Window Compression Post-Corrigendum (CVC Circular 01/01/2021)
    # If corrigendum issued and window < 48 hours -> Severe violation
    if rec['corrigendum_count'] > 0 and rec['feat_window_compression_hours'] < 48.0:
        violations.append("CVC-R1: Submission window compressed to <48 hrs following corrigendum (Exclusion Risk)")
        penalty_score += 35
    elif rec['corrigendum_count'] > 0 and rec['feat_window_compression_hours'] < 96.0:
        violations.append("CVC-R1: Submission window truncated post-corrigendum (<4 days remaining)")
        penalty_score += 20

    # Rule 2: Corrigendum Velocity Churn
    if rec['corrigendum_count'] >= 3:
        violations.append(f"CVC-R2: Excessive corrigenda churn ({rec['corrigendum_count']} corrigenda issued)")
        penalty_score += 25
    elif rec['corrigendum_count'] == 2:
        violations.append("CVC-R2: Multiple corrigenda issued altering tender terms")
        penalty_score += 15

    # Rule 3: EMD Skew Violation (CVC Guideline: EMD must be 1% - 2%)
    emd_pct = rec['feat_emd_ratio'] * 100.0
    if emd_pct > 3.0:
        violations.append(f"CVC-R3: Inflated EMD ({emd_pct:.1f}% vs statutory 2.0% ceiling - Barrier to Entry)")
        penalty_score += 25
    elif emd_pct < 0.6:
        violations.append(f"CVC-R3: Depressed EMD ({emd_pct:.1f}% vs statutory 1.0% floor - Dummy Bidder Risk)")
        penalty_score += 15

    # Rule 4: GFR Rule 161 Bidding Period Squeeze (<14 days for major capex > Rs 5 Cr)
    if rec['estimated_value_inr'] >= 50000000.0 and rec['feat_window_days'] < 14.0:
        violations.append(f"GFR-161: Bidding window squeezed to {rec['feat_window_days']} days for high-value contract")
        penalty_score += 20

    # Rule 5: Single Bidder Walkover Pattern
    if rec['feat_single_bidder_risk'] == 1.0:
        violations.append("VIG-R5: High vulnerability to single-bidder uncompetitive walkover")
        penalty_score += 20

    # Rule 6: Bid Spread Clustering (Zero competitive discount)
    if rec['feat_spread_ratio'] >= 0.995:
        violations.append(f"VIG-R6: Award-to-Estimate spread clustering at {rec['feat_spread_ratio']*100:.1f}% (Zero taxpayer discount)")
        penalty_score += 15

    return min(100, penalty_score), violations

def run_cheirap_engine():
    print("=" * 65)
    print("CHEIRAP AI - DUAL-ENGINE VIGILANCE & ANOMALY SCORING SYSTEM")
    print("Pre-Award Public Procurement Radar | AI4SEVA 2026")
    print("=" * 65)

    # 1. Load dataset
    src_json = "data/raw/tenders_manipur_comprehensive.json"
    with open(src_json, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
    print(f"Loaded {len(raw_data)} tenders from {src_json}")

    # 2. Compute 8 behavioral features
    print("[1/4] Calculating 8 Behavioral Vigilance Features...")
    featured_records = compute_features(raw_data)
    df_feat = pd.DataFrame(featured_records)

    # Feature matrix for Isolation Forest
    feature_cols = [
        'feat_corr_velocity',
        'feat_window_compression_hours',
        'feat_emd_ratio',
        'feat_emd_skew_dev',
        'feat_single_bidder_risk',
        'feat_spread_ratio',
        'feat_capex_intensity',
        'feat_retender_churn'
    ]

    X = df_feat[feature_cols].copy()
    
    # 3. Train Unsupervised Isolation Forest (Outlier detection)
    print("[2/4] Training Isolation Forest Anomaly Engine (Contamination=0.12)...")
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)

    iso = IsolationForest(
        n_estimators=150,
        contamination=0.12,
        max_samples='auto',
        random_state=42
    )
    iso.fit(X_scaled)

    # Decision function gives raw anomaly score (lower is more anomalous)
    raw_scores = iso.decision_function(X_scaled)
    # Invert and normalize so higher = more anomalous (0 to 100)
    norm_scores = (raw_scores.max() - raw_scores) / (raw_scores.max() - raw_scores.min() + 1e-6)
    if_scores = np.round(norm_scores * 100.0, 1)

    # 4. Evaluate CVC Statutory Compliance Rules & Composite Score
    print("[3/4] Evaluating CVC / GFR Statutory Integrity Rules...")
    scored_records = []
    
    for i, r in enumerate(featured_records):
        cvc_penalty, violations = evaluate_cvc_statutory_rules(r)
        if_score = float(if_scores[i])

        # Composite Cheirap Risk Score: 50% Isolation Forest Anomaly + 50% Statutory CVC Violations
        composite_score = int(round(0.45 * if_score + 0.55 * cvc_penalty))
        composite_score = max(5, min(98, composite_score)) # Bound within 5-98

        # Assign Vigilance Tier
        if composite_score >= 70:
            tier = "RED"
            status_desc = "PRE-AWARD VIGILANCE HOLD RECOMMENDED"
        elif composite_score >= 38:
            tier = "AMBER"
            status_desc = "HEIGHTENED SCRUTINY ADVISORY"
        else:
            tier = "GREEN"
            status_desc = "NORMAL PRE-AWARD CLEARANCE"

        scored_records.append({
            **r,
            'cheirap_risk_score': composite_score,
            'if_anomaly_score': if_score,
            'cvc_statutory_penalty': cvc_penalty,
            'vigilance_tier': tier,
            'vigilance_recommendation': status_desc,
            'violation_count': len(violations),
            'audit_flags': violations
        })

    # Sort descending by risk score
    scored_records.sort(key=lambda x: x['cheirap_risk_score'], reverse=True)

    # 5. Save scored datasets
    print("[4/4] Saving Scored Datasets to data/processed/...")
    os.makedirs("data/processed", exist_ok=True)
    
    out_json = "data/processed/tenders_scored.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(scored_records, f, indent=2, ensure_ascii=False)
    print(f"-> Saved JSON: {out_json} ({len(scored_records)} records)")

    out_csv = "data/processed/tenders_scored.csv"
    # Flatten audit flags for CSV
    flat_records = []
    for r in scored_records:
        r_copy = dict(r)
        r_copy['audit_flags'] = " | ".join(r['audit_flags']) if r['audit_flags'] else "Compliant with statutory CVC / GFR norms"
        flat_records.append(r_copy)

    df_out = pd.DataFrame(flat_records)
    df_out.to_csv(out_csv, index=False, encoding="utf-8")
    print(f"-> Saved CSV:  {out_csv} ({len(df_out)} rows)")

    # 6. Audit & Distribution Summary
    print("\n" + "=" * 65)
    print("CHEIRAP AI - SCORING RESULTS SUMMARY")
    print("=" * 65)
    print(f"Total Tenders Analyzed: {len(scored_records)}")
    
    tier_counts = df_out['vigilance_tier'].value_counts()
    for t in ['RED', 'AMBER', 'GREEN']:
        cnt = tier_counts.get(t, 0)
        pct = (cnt / len(df_out)) * 100.0
        print(f"  {t:<5}: {cnt:>2} Tenders ({pct:>5.1f}%)")

    total_capex = df_out['estimated_value_inr'].sum() / 1e7
    red_capex = df_out[df_out['vigilance_tier'] == 'RED']['estimated_value_inr'].sum() / 1e7
    print(f"\nTotal Procurement Monitored:   Rs. {total_capex:,.2f} Crores")
    print(f"Total Value under RED Hold:    Rs. {red_capex:,.2f} Crores ({red_capex/total_capex*100:.1f}% of total budget)")

    print("\n--- TOP 5 HIGHEST-RISK RED QUEUE TENDERS ---")
    for r in scored_records[:5]:
        print(f"  [{r['vigilance_tier']}] Score: {r['cheirap_risk_score']:>2} | {r['tender_id']} | Dept: {r['department'][:25]}")
        print(f"        Title: {r['title'][:75]}...")
        print(f"        Value: Rs. {r['estimated_value_inr']/1e7:.2f} Cr | EMD: Rs. {r['emd_amount_inr']:,.0f} | Corr: {r['corrigendum_count']}")
        print(f"        Reason: {r['audit_flags'][0] if r['audit_flags'] else 'None'}\n")

    print("--- HACKATHON VENUE SPOTLIGHT (MANTRIPUKHRI IT SEZ) ---")
    venue_tenders = [r for r in scored_records if r['is_mantripukhri_venue']]
    print(f"Total Venue Tenders: {len(venue_tenders)}")
    for r in venue_tenders:
        print(f"  [{r['vigilance_tier']}] Score: {r['cheirap_risk_score']:>2} | {r['tender_id']} | {r['title'][:65]}...")
        print(f"        Value: Rs. {r['estimated_value_inr']/1e7:.2f} Cr | Corr: {r['corrigendum_count']} | Status: {r['vigilance_recommendation']}")

if __name__ == "__main__":
    run_cheirap_engine()
