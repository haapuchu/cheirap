export const initialWorksStats = {
  "macro_statewide": {
    "state_name": "Government of Manipur",
    "host_department": "Public Works Department (PWD) & Dept of Information Technology",
    "total_infrastructure_projects": 11202,
    "reported_completed_count": 8940,
    "reported_in_progress_count": 2262,
    "total_sanctioned_capital_inr_cr": 4820.5,
    "total_disbursed_capital_inr_cr": 3915.2,
    "assurance_scan_timestamp": "2026-10-07 19:30 IST",
    "priority_breakdown": {
      "high_verification_priority": 23,
      "medium_verification_priority": 117,
      "low_priority_verified_consistent": 11062
    },
    "inconsistency_rates": {
      "gps_discrepancy_rate": "1.42%",
      "visual_duplicate_rate": "0.78%",
      "unrealistic_velocity_rate": "1.15%",
      "financial_divergence_rate": "1.89%"
    }
  },
  "venue_corridor": {
    "corridor_name": "Mantripukhri IT SEZ & Greater Imphal Infrastructure Corridor",
    "sample_size": 30,
    "high_priority_count": 3,
    "medium_priority_count": 2,
    "low_priority_verified_count": 25,
    "total_sanctioned_cr": 42.82,
    "total_disbursed_cr": 33.61
  }
};

export const initialWorksProjects = [
  {
    "project_id": "MN-PWD-ED-2026-0812",
    "project_name": "Construction of Prefabricated Modular Science Labs & Classrooms",
    "scheme": "State Education Infrastructure Mission",
    "department": "Public Works Department (Buildings) / Education (S)",
    "work_location": "Heingang Model Secondary School, Imphal East",
    "linked_tender_id": "MAN_ED_PROC_2026_0142",
    "contractor_name": "Eastern Modular Fabcon Infra Pvt Ltd",
    "sanctioned_cost_cr": 4.82,
    "funds_disbursed_cr": 4.82,
    "reported_status": "COMPLETED",
    "reported_physical_progress_pct": 100.0,
    "reported_financial_progress_pct": 100.0,
    "completion_claim_date": "2026-09-28",
    "evidence_inconsistency_score": 88,
    "verification_priority": "HIGH",
    "primary_flag": "Severe GPS Discrepancy & Perceptual Image Duplicate",
    "site_coords": {
      "lat": 24.8512,
      "lng": 93.9482,
      "label": "Heingang Model Secondary School Site (Near Marjing Complex)"
    },
    "evidence_signals": {
      "gps_analysis": {
        "claimed_site": "Heingang Model Secondary School (24.8512\u00b0 N, 93.9482\u00b0 E)",
        "photo_exif_location": "Lamphelpat Residential Complex (24.8190\u00b0 N, 93.9015\u00b0 E)",
        "discrepancy_delta_km": 9.42,
        "status": "FAIL_CRITICAL",
        "finding": "Submitted progress photos were captured 9.42 km outside the project geo-fence."
      },
      "visual_analysis": {
        "similarity_match_pct": 93.4,
        "matched_historical_project": "MN-ED-2024-1102 (Bishnupur Model Higher Secondary)",
        "perceptual_hash_distance": 3,
        "status": "FAIL_CRITICAL",
        "finding": "The claimed 'Completed Lab' photograph matches an archived 2024 classroom from Bishnupur."
      },
      "temporal_velocity": {
        "expected_duration_days": 180,
        "reported_jump_days": 11,
        "progress_delta": "Jumped from 15% foundation to 100% completion in 11 days (Sept 17 - Sept 28)",
        "status": "FAIL_HIGH_VELOCITY",
        "finding": "Physical progress trajectory shows an impossible 85% leap directly prior to fiscal milestone closure."
      },
      "financial_divergence": {
        "disbursed_pct": 100.0,
        "physical_claim_pct": 100.0,
        "intermediate_inspection_logs": 0,
        "status": "FAIL_UNVERIFIED_DISBURSEMENT",
        "finding": "100% contract funds (\u20b94.82 Cr) were disbursed without any intermediate stage verification logs."
      }
    },
    "recommended_action": "Immediate Physical Inspection Notice (PWD Form 44) & Withhold Utilization Certificate",
    "human_review_status": "FLAGGED_FOR_HUMAN_INSPECTION"
  },
  {
    "project_id": "MN-PWD-RD-2026-4019",
    "project_name": "Pavement Upgradation & Stormwater Drainage, Khabam Lamkhai to Mantripukhri IT Park",
    "scheme": "Special Assistance to States for Capital Investment (SASCI)",
    "department": "Public Works Department (Roads Division-I)",
    "work_location": "Khabam Lamkhai \u2013 Mantripukhri Corridor, Imphal East",
    "linked_tender_id": "2026_PWDM1_3104_1",
    "contractor_name": "Apex Northeast Civilworks Consortium",
    "sanctioned_cost_cr": 2.4,
    "funds_disbursed_cr": 2.4,
    "reported_status": "COMPLETED",
    "reported_physical_progress_pct": 100.0,
    "reported_financial_progress_pct": 100.0,
    "completion_claim_date": "2026-09-24",
    "evidence_inconsistency_score": 84,
    "verification_priority": "HIGH",
    "primary_flag": "GPS Off-Site (6.2 km) & Timestamp Climate Mismatch",
    "site_coords": {
      "lat": 24.845,
      "lng": 93.945,
      "label": "Khabam Lamkhai Junction to IT Park Gate"
    },
    "evidence_signals": {
      "gps_analysis": {
        "claimed_site": "Khabam Lamkhai Corridor (24.8450\u00b0 N, 93.9450\u00b0 E)",
        "photo_exif_location": "Porompat Residential Lane (24.8210\u00b0 N, 93.9680\u00b0 E)",
        "discrepancy_delta_km": 6.2,
        "status": "FAIL_CRITICAL",
        "finding": "Evidence photos geotagged 6.2 km away in Porompat rather than the IT Park corridor."
      },
      "visual_analysis": {
        "similarity_match_pct": 89.2,
        "matched_historical_project": "MN-PWD-2023-8821 (Dingku Road Overlay)",
        "perceptual_hash_distance": 5,
        "status": "FAIL_SUSPICIOUS_SIMILARITY",
        "finding": "Pavement texture and kerbstone layout closely replicates 2023 Dingku Road imagery."
      },
      "temporal_velocity": {
        "expected_duration_days": 120,
        "reported_jump_days": 14,
        "progress_delta": "30% sub-base to 100% blacktopping in 14 calendar days during heavy monsoon weeks",
        "status": "FAIL_WEATHER_ANOMALY",
        "finding": "Bituminous surfacing claimed complete during official IMD monsoon alert with 0 dry weather windows."
      },
      "financial_divergence": {
        "disbursed_pct": 100.0,
        "physical_claim_pct": 100.0,
        "intermediate_inspection_logs": 1,
        "status": "FAIL_DIVERGENCE",
        "finding": "Final bill cleared without Divisional Engineer core sample lab test upload."
      }
    },
    "recommended_action": "Physical Core-Drilling Verification & Road Roughness Inspection",
    "human_review_status": "FLAGGED_FOR_HUMAN_INSPECTION"
  },
  {
    "project_id": "MN-YAS-2026-0319",
    "project_name": "Luwangsangbam Multi-Purpose Sports Complex Drainage & Sub-Base",
    "scheme": "Khelo India State Centre of Excellence",
    "department": "Youth Affairs & Sports / PWD Buildings",
    "work_location": "Luwangsangbam, Imphal East",
    "linked_tender_id": "2026_YAS_1842_2",
    "contractor_name": "Kangleipak Sports Infra Developers",
    "sanctioned_cost_cr": 1.75,
    "funds_disbursed_cr": 1.75,
    "reported_status": "COMPLETED",
    "reported_physical_progress_pct": 100.0,
    "reported_financial_progress_pct": 100.0,
    "completion_claim_date": "2026-09-30",
    "evidence_inconsistency_score": 78,
    "verification_priority": "HIGH",
    "primary_flag": "Repetitive Visual Angle & Missing Soil Compaction Logs",
    "site_coords": {
      "lat": 24.862,
      "lng": 93.952,
      "label": "Luwangsangbam Sports Facility Grounds"
    },
    "evidence_signals": {
      "gps_analysis": {
        "claimed_site": "Luwangsangbam Complex (24.8620\u00b0 N, 93.9520\u00b0 E)",
        "photo_exif_location": "Koirengei Airfield Border (24.8780\u00b0 N, 93.9450\u00b0 E)",
        "discrepancy_delta_km": 3.1,
        "status": "FAIL_MODERATE",
        "finding": "Photo coordinates drift 3.1 km north near Koirengei perimeter."
      },
      "visual_analysis": {
        "similarity_match_pct": 96.1,
        "matched_historical_project": "Same Project Initial Foundation Batch",
        "perceptual_hash_distance": 2,
        "status": "FAIL_DUPLICATE_INTERNAL",
        "finding": "Identical photo submitted for both '50% Masonry' and '100% Final Handover' updates."
      },
      "temporal_velocity": {
        "expected_duration_days": 90,
        "reported_jump_days": 8,
        "progress_delta": "40% to 100% in 8 days",
        "status": "FAIL_VELOCITY",
        "finding": "Masonry drain curing period mathematically impossible in 8 days."
      },
      "financial_divergence": {
        "disbursed_pct": 100.0,
        "physical_claim_pct": 100.0,
        "intermediate_inspection_logs": 1,
        "status": "FAIL_DIVERGENCE",
        "finding": "100% payout released with duplicate photographic evidence."
      }
    },
    "recommended_action": "On-Site Physical Measurement by Executive Engineer YAS",
    "human_review_status": "FLAGGED_FOR_HUMAN_INSPECTION"
  },
  {
    "project_id": "MN-PWD-RD-2026-0214",
    "project_name": "Dingku Road to Chingmeirong Pavement Resurfacing & Kerb Painting",
    "scheme": "Capital Road Infrastructure Maintenance Program",
    "department": "Public Works Department (Roads Division-I)",
    "work_location": "Dingku Road \u2013 Chingmeirong, Imphal East",
    "linked_tender_id": "2026_PWDM1_2901_1",
    "contractor_name": "Meitei Builders & Engineering Works",
    "sanctioned_cost_cr": 1.2,
    "funds_disbursed_cr": 0.9,
    "reported_status": "IN PROGRESS (75%)",
    "reported_physical_progress_pct": 75.0,
    "reported_financial_progress_pct": 75.0,
    "completion_claim_date": "2026-10-02",
    "evidence_inconsistency_score": 8,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent (Green Assurance)",
    "site_coords": {
      "lat": 24.828,
      "lng": 93.942,
      "label": "Dingku Road \u2013 Chingmeirong Main Artery"
    },
    "evidence_signals": {
      "gps_analysis": {
        "claimed_site": "Dingku Road (24.8280\u00b0 N, 93.9420\u00b0 E)",
        "photo_exif_location": "Dingku Road (24.8281\u00b0 N, 93.9421\u00b0 E)",
        "discrepancy_delta_km": 0.015,
        "status": "PASS_EXCELLENT",
        "finding": "GPS location accurate within 15 meters of project center alignment."
      },
      "visual_analysis": {
        "similarity_match_pct": 12.0,
        "matched_historical_project": "None (Unique Progressive Visuals)",
        "perceptual_hash_distance": 28,
        "status": "PASS_AUTHENTIC",
        "finding": "All submitted site photographs are unique, high-resolution, and capture chronological progress."
      },
      "temporal_velocity": {
        "expected_duration_days": 60,
        "reported_jump_days": 44,
        "progress_delta": "Consistent 15-20% incremental gains logged every 10 days",
        "status": "PASS_LINEAR",
        "finding": "Work velocity perfectly aligns with standard PWD engineering norms."
      },
      "financial_divergence": {
        "disbursed_pct": 75.0,
        "physical_claim_pct": 75.0,
        "intermediate_inspection_logs": 3,
        "status": "PASS_MATCHED",
        "finding": "Disbursements strictly pace certified stage completion with 3 engineer signatures."
      }
    },
    "recommended_action": "Standard Milestone Clearance \u2014 Proceed with Stage 4 Disbursement",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-IT-2026-0105",
    "project_name": "Mantripukhri IT Park High-Speed Fiber Backbone & Power Substation Ducting",
    "scheme": "Digital Manipur Core Infrastructure Initiative",
    "department": "Department of Information Technology (DIT)",
    "work_location": "IT SEZ Campus, Mantripukhri, Imphal East",
    "linked_tender_id": "2026_DIT_0921_1",
    "contractor_name": "Manipur Broadband Communications Ltd",
    "sanctioned_cost_cr": 3.1,
    "funds_disbursed_cr": 2.5,
    "reported_status": "IN PROGRESS (80%)",
    "reported_physical_progress_pct": 80.0,
    "reported_financial_progress_pct": 80.6,
    "completion_claim_date": "2026-10-04",
    "evidence_inconsistency_score": 12,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.842,
      "lng": 93.946,
      "label": "IT Park Main Substation Node"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 14.5,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique optical fiber spool photos"
      },
      "temporal_velocity": {
        "progress_delta": "Regular 10% weekly progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Fund withdrawal strictly mirrors ducting metres laid"
      }
    },
    "recommended_action": "Routine Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-PHE-2026-1402",
    "project_name": "Augmentation of Water Supply Pipeline Network, Khabam to Achanbigei",
    "scheme": "Jal Jeevan Mission (JJM)",
    "department": "Public Health Engineering Department (PHE)",
    "work_location": "Khabam \u2013 Achanbigei, Imphal East",
    "linked_tender_id": "2026_PHED_3384_1",
    "contractor_name": "Eastern Hydraulic Infrastructure Works",
    "sanctioned_cost_cr": 2.85,
    "funds_disbursed_cr": 2.0,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.2,
    "completion_claim_date": "2026-10-01",
    "evidence_inconsistency_score": 15,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.856,
      "lng": 93.949,
      "label": "Khabam Water Treatment Plant Pipeline"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.04,
        "status": "PASS_EXCELLENT",
        "finding": "Within 40m"
      },
      "visual_analysis": {
        "similarity_match_pct": 18.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Clear pipe joint welding photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard pipeline laying speed",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Bill pacing pressure test reports"
      }
    },
    "recommended_action": "Routine Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-PWD-RD-2026-1184",
    "project_name": "Widening & Strengthening of Minuthong to Lamlong Bridge Corridor",
    "scheme": "Capital Roads Improvement",
    "department": "Public Works Department (Roads Div-I)",
    "work_location": "Minuthong \u2013 Lamlong, Imphal East",
    "linked_tender_id": "2026_PWDM1_3301_2",
    "contractor_name": "United Builders & Infra Consortium",
    "sanctioned_cost_cr": 3.6,
    "funds_disbursed_cr": 2.9,
    "reported_status": "IN PROGRESS (65%)",
    "reported_physical_progress_pct": 65.0,
    "reported_financial_progress_pct": 80.5,
    "completion_claim_date": "2026-09-29",
    "evidence_inconsistency_score": 48,
    "verification_priority": "MEDIUM",
    "primary_flag": "Financial Drawing Ahead of Physical Progress (15.5% Gap)",
    "site_coords": {
      "lat": 24.815,
      "lng": 93.951,
      "label": "Minuthong Bridge Approach"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.28,
        "status": "PASS_ACCEPTABLE",
        "finding": "Within 280m of bridge pier"
      },
      "visual_analysis": {
        "similarity_match_pct": 22.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Progress photos authentic"
      },
      "temporal_velocity": {
        "progress_delta": "Steady progress",
        "status": "PASS_LINEAR",
        "finding": "Normal pace"
      },
      "financial_divergence": {
        "disbursed_pct": 80.5,
        "physical_claim_pct": 65.0,
        "status": "WARN_FISCAL_LEAD",
        "finding": "Financial billing is running 15.5% ahead of physically logged site progress."
      }
    },
    "recommended_action": "Desktop Audit by PWD Accounts Officer",
    "human_review_status": "FLAGGED_FOR_DESK_REVIEW"
  },
  {
    "project_id": "MN-PWD-BD-2026-0941",
    "project_name": "Modernization of Composite Building, Porompat DC Complex",
    "scheme": "District Administrative Infrastructure Modernization",
    "department": "Public Works Department (Buildings)",
    "work_location": "Porompat, Imphal East",
    "linked_tender_id": "2026_PWDBD_1821_1",
    "contractor_name": "Imphal East Civiltech Associates",
    "sanctioned_cost_cr": 2.15,
    "funds_disbursed_cr": 1.7,
    "reported_status": "IN PROGRESS (75%)",
    "reported_physical_progress_pct": 75.0,
    "reported_financial_progress_pct": 79.0,
    "completion_claim_date": "2026-10-03",
    "evidence_inconsistency_score": 42,
    "verification_priority": "MEDIUM",
    "primary_flag": "Partial Photographic Angle Clustering",
    "site_coords": {
      "lat": 24.8195,
      "lng": 93.9645,
      "label": "Porompat DC Office Block"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.08,
        "status": "PASS_EXCELLENT",
        "finding": "Within 80m of DC compound"
      },
      "visual_analysis": {
        "similarity_match_pct": 64.0,
        "status": "WARN_REPETITIVE_PERSPECTIVE",
        "finding": "Repeated photos of single facade without rear block progress"
      },
      "temporal_velocity": {
        "progress_delta": "Normal velocity",
        "status": "PASS_LINEAR",
        "finding": "Timeline consistent"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Financials within reasonable tolerance"
      }
    },
    "recommended_action": "Request 360-degree Structural Photographs",
    "human_review_status": "FLAGGED_FOR_DESK_REVIEW"
  },
  {
    "project_id": "MN-INFRA-2026-0009",
    "project_name": "Mantripukhri Secretariat Annex Electrification",
    "scheme": "State Development Capital Fund",
    "department": "MSPDCL",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2009_1",
    "contractor_name": "Manipur Infra Syndicate-9",
    "sanctioned_cost_cr": 0.95,
    "funds_disbursed_cr": 0.66,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 14,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.84,
      "lng": 93.947,
      "label": "Mantripukhri Secretariat Annex Electrification Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 19.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0010",
    "project_name": "Heingang Marjing Eco-Tourism Footpath & Railing",
    "scheme": "State Development Capital Fund",
    "department": "Tourism / PWD",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2010_1",
    "contractor_name": "Manipur Infra Syndicate-10",
    "sanctioned_cost_cr": 1.4,
    "funds_disbursed_cr": 0.98,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 15,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.853,
      "lng": 93.951,
      "label": "Heingang Marjing Eco-Tourism Footpath & Railing Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 20.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0011",
    "project_name": "Khabam Lamkhai Community Health Sub-Centre Upgradation",
    "scheme": "State Development Capital Fund",
    "department": "Health / PWD",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2011_1",
    "contractor_name": "Manipur Infra Syndicate-11",
    "sanctioned_cost_cr": 1.1,
    "funds_disbursed_cr": 0.77,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 16,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.847,
      "lng": 93.944,
      "label": "Khabam Lamkhai Community Health Sub-Centre Upgradation Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 21.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0012",
    "project_name": "Chingmeirong High School Computer Lab Power Infrastructure",
    "scheme": "State Development Capital Fund",
    "department": "Education / MSPDCL",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2012_1",
    "contractor_name": "Manipur Infra Syndicate-12",
    "sanctioned_cost_cr": 0.65,
    "funds_disbursed_cr": 0.45,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 5,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.831,
      "lng": 93.94,
      "label": "Chingmeirong High School Computer Lab Power Infrastructure Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 22.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0013",
    "project_name": "Luwangsangbam Youth Recreation Park Lighting",
    "scheme": "State Development Capital Fund",
    "department": "YAS",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2013_1",
    "contractor_name": "Manipur Infra Syndicate-13",
    "sanctioned_cost_cr": 0.85,
    "funds_disbursed_cr": 0.59,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 6,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.864,
      "lng": 93.953,
      "label": "Luwangsangbam Youth Recreation Park Lighting Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 23.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0014",
    "project_name": "Minuthong Riverbank Retaining Wall & Gabion Works",
    "scheme": "State Development Capital Fund",
    "department": "Water Resources (WRD)",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2014_1",
    "contractor_name": "Manipur Infra Syndicate-14",
    "sanctioned_cost_cr": 2.2,
    "funds_disbursed_cr": 1.54,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 7,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.816,
      "lng": 93.95,
      "label": "Minuthong Riverbank Retaining Wall & Gabion Works Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 24.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0015",
    "project_name": "Lamlong Bazar Covered Vegetable Shed Construction",
    "scheme": "State Development Capital Fund",
    "department": "MAHUD / PWD",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2015_1",
    "contractor_name": "Manipur Infra Syndicate-15",
    "sanctioned_cost_cr": 1.35,
    "funds_disbursed_cr": 0.94,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 8,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.821,
      "lng": 93.957,
      "label": "Lamlong Bazar Covered Vegetable Shed Construction Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 10.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0016",
    "project_name": "Dingku Road Storm Drain Desilting & Concrete Slab Replacement",
    "scheme": "State Development Capital Fund",
    "department": "PWD Roads",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2016_1",
    "contractor_name": "Manipur Infra Syndicate-16",
    "sanctioned_cost_cr": 0.75,
    "funds_disbursed_cr": 0.52,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 9,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.826,
      "lng": 93.943,
      "label": "Dingku Road Storm Drain Desilting & Concrete Slab Replacement Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 11.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0017",
    "project_name": "Khabam to Luwangsangbam Link Road Culvert Realignment",
    "scheme": "State Development Capital Fund",
    "department": "PWD Roads",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2017_1",
    "contractor_name": "Manipur Infra Syndicate-17",
    "sanctioned_cost_cr": 1.15,
    "funds_disbursed_cr": 0.8,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 10,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.855,
      "lng": 93.948,
      "label": "Khabam to Luwangsangbam Link Road Culvert Realignment Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 12.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0018",
    "project_name": "Achanbigei Primary School Perimeter Fencing & Gate",
    "scheme": "State Development Capital Fund",
    "department": "Education (S)",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2018_1",
    "contractor_name": "Manipur Infra Syndicate-18",
    "sanctioned_cost_cr": 0.45,
    "funds_disbursed_cr": 0.32,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 11,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.859,
      "lng": 93.946,
      "label": "Achanbigei Primary School Perimeter Fencing & Gate Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 13.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0019",
    "project_name": "Mantripukhri Post Office Lane Bituminous Resurfacing",
    "scheme": "State Development Capital Fund",
    "department": "PWD Roads",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2019_1",
    "contractor_name": "Manipur Infra Syndicate-19",
    "sanctioned_cost_cr": 0.6,
    "funds_disbursed_cr": 0.42,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 12,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.839,
      "lng": 93.945,
      "label": "Mantripukhri Post Office Lane Bituminous Resurfacing Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 14.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0020",
    "project_name": "Heingang Hillside Check Dam for Silt Prevention",
    "scheme": "State Development Capital Fund",
    "department": "Forest & Environment",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2020_1",
    "contractor_name": "Manipur Infra Syndicate-20",
    "sanctioned_cost_cr": 1.5,
    "funds_disbursed_cr": 1.05,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 13,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.856,
      "lng": 93.955,
      "label": "Heingang Hillside Check Dam for Silt Prevention Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 15.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0021",
    "project_name": "Porompat JNIMS Internal Connectivity Road Repair",
    "scheme": "State Development Capital Fund",
    "department": "Health / PWD",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2021_1",
    "contractor_name": "Manipur Infra Syndicate-21",
    "sanctioned_cost_cr": 1.25,
    "funds_disbursed_cr": 0.88,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 14,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.818,
      "lng": 93.962,
      "label": "Porompat JNIMS Internal Connectivity Road Repair Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 16.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0022",
    "project_name": "Lamlong Bridge Structural Health Sensor Installation",
    "scheme": "State Development Capital Fund",
    "department": "PWD Bridges",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2022_1",
    "contractor_name": "Manipur Infra Syndicate-22",
    "sanctioned_cost_cr": 0.4,
    "funds_disbursed_cr": 0.28,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 15,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.82,
      "lng": 93.956,
      "label": "Lamlong Bridge Structural Health Sensor Installation Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 17.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0023",
    "project_name": "Chingmeirong Electric Transformer Augmentation (250 kVA)",
    "scheme": "State Development Capital Fund",
    "department": "MSPDCL",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2023_1",
    "contractor_name": "Manipur Infra Syndicate-23",
    "sanctioned_cost_cr": 0.55,
    "funds_disbursed_cr": 0.39,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 16,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.829,
      "lng": 93.939,
      "label": "Chingmeirong Electric Transformer Augmentation (250 kVA) Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 18.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0024",
    "project_name": "Mantripukhri IT Park Gate Security Kiosk & Solar Array",
    "scheme": "State Development Capital Fund",
    "department": "DIT Manipur",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2024_1",
    "contractor_name": "Manipur Infra Syndicate-24",
    "sanctioned_cost_cr": 0.5,
    "funds_disbursed_cr": 0.35,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 5,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.843,
      "lng": 93.947,
      "label": "Mantripukhri IT Park Gate Security Kiosk & Solar Array Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 19.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0025",
    "project_name": "Heingang Youth Sports Club Ground Leveling & Turfing",
    "scheme": "State Development Capital Fund",
    "department": "YAS",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2025_1",
    "contractor_name": "Manipur Infra Syndicate-25",
    "sanctioned_cost_cr": 0.7,
    "funds_disbursed_cr": 0.49,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 6,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.85,
      "lng": 93.949,
      "label": "Heingang Youth Sports Club Ground Leveling & Turfing Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 20.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0026",
    "project_name": "Khabam Drinking Water Overhead Tank (50,000L)",
    "scheme": "State Development Capital Fund",
    "department": "PHED",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2026_1",
    "contractor_name": "Manipur Infra Syndicate-26",
    "sanctioned_cost_cr": 1.3,
    "funds_disbursed_cr": 0.91,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 7,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.848,
      "lng": 93.946,
      "label": "Khabam Drinking Water Overhead Tank (50,000L) Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 21.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0027",
    "project_name": "Minuthong to Hatta Road Traffic Signal System",
    "scheme": "State Development Capital Fund",
    "department": "Transport / Traffic",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2027_1",
    "contractor_name": "Manipur Infra Syndicate-27",
    "sanctioned_cost_cr": 0.8,
    "funds_disbursed_cr": 0.56,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 8,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.814,
      "lng": 93.952,
      "label": "Minuthong to Hatta Road Traffic Signal System Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 22.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0028",
    "project_name": "Luwangsangbam Flood Relief Sluice Gate Repair",
    "scheme": "State Development Capital Fund",
    "department": "WRD",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2028_1",
    "contractor_name": "Manipur Infra Syndicate-28",
    "sanctioned_cost_cr": 0.95,
    "funds_disbursed_cr": 0.66,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 9,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.866,
      "lng": 93.951,
      "label": "Luwangsangbam Flood Relief Sluice Gate Repair Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 23.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0029",
    "project_name": "Porompat Veterinary Hospital Outpatient Wing Reconstruction",
    "scheme": "State Development Capital Fund",
    "department": "Veterinary / PWD",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2029_1",
    "contractor_name": "Manipur Infra Syndicate-29",
    "sanctioned_cost_cr": 1.05,
    "funds_disbursed_cr": 0.73,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 10,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.817,
      "lng": 93.966,
      "label": "Porompat Veterinary Hospital Outpatient Wing Reconstruction Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 24.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  },
  {
    "project_id": "MN-INFRA-2026-0030",
    "project_name": "Achanbigei Community Hall Roofing Replacement",
    "scheme": "State Development Capital Fund",
    "department": "Rural Development",
    "work_location": "Imphal East (Venue Corridor)",
    "linked_tender_id": "2026_GEN_2030_1",
    "contractor_name": "Manipur Infra Syndicate-30",
    "sanctioned_cost_cr": 0.5,
    "funds_disbursed_cr": 0.35,
    "reported_status": "IN PROGRESS (70%)",
    "reported_physical_progress_pct": 70.0,
    "reported_financial_progress_pct": 70.0,
    "completion_claim_date": "2026-10-05",
    "evidence_inconsistency_score": 11,
    "verification_priority": "LOW",
    "primary_flag": "Verified Evidence Consistent",
    "site_coords": {
      "lat": 24.861,
      "lng": 93.945,
      "label": "Achanbigei Community Hall Roofing Replacement Site"
    },
    "evidence_signals": {
      "gps_analysis": {
        "discrepancy_delta_km": 0.02,
        "status": "PASS_EXCELLENT",
        "finding": "Accurate to 20m"
      },
      "visual_analysis": {
        "similarity_match_pct": 10.0,
        "status": "PASS_AUTHENTIC",
        "finding": "Unique progressive photos"
      },
      "temporal_velocity": {
        "progress_delta": "Standard progress",
        "status": "PASS_LINEAR",
        "finding": "Normal velocity"
      },
      "financial_divergence": {
        "status": "PASS_MATCHED",
        "finding": "Matching milestone funds"
      }
    },
    "recommended_action": "Standard Milestone Clearance",
    "human_review_status": "VERIFIED_CONSISTENT"
  }
];
