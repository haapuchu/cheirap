import type { GepnicDossier, Tender } from '@/lib/tenderInsights';

/**
 * Prototype GePNIC schema fixtures.
 *
 * These objects demonstrate the multi-layer data shape exposed by the official
 * NIC eProcurement frontend. They are not record-level live extractions until
 * each value has a captured portal response or document attached to it.
 */
export const gepnicDossiers: Record<string, GepnicDossier> = {
  // Flagship 1: High-Value Water Supply Infrastructure (PHED)
  '2025_PHED_2988_3': {
    data_status: 'prototype_fixture',
    evidence_note: 'Prototype fixture; record-level portal and document verification is pending.',
    tender_type: 'Open Tender',
    form_of_contract: 'Item Rate',
    tender_category: 'Works',
    covers_count: 2,
    general_tech_eval_allowed: true,
    payment_mode: 'Offline (Demand Draft / Bankers Cheque / FDR)',
    is_multi_currency: false,
    fee_payable_to: 'Executive Engineer, PHED Churachandpur Division',
    fee_payable_at: 'SBI Churachandpur Main Branch',
    fee_exemption_allowed: false,
    emd_fee_type: 'Percentage',
    emd_percentage: 2.0,
    emd_exemption_allowed: false,
    emd_payable_to: 'Executive Engineer, PHED Churachandpur Division',
    emd_payable_at: 'Churachandpur',
    pre_qualification_details:
      'Bidder must have successfully executed as prime contractor at least one similar water treatment plant work of value not less than ₹30.56 Cr (80% of value) or two similar works each not less than ₹19.10 Cr (50% of value) in the last 5 financial years. Minimum average annual financial turnover of ₹19.10 Cr. Solvency certificate of at least ₹15.28 Cr from scheduled commercial bank required.',
    independent_external_monitor: 'Shri R. K. Singh, IAS (Retd.), Designated IEM for High-Value Procurements (>₹25 Cr), Department of Vigilance & Anti-Corruption, Government of Manipur',
    sub_category: 'Water Works / Rapid Gravity Filtration Plant & River Intake',
    bid_validity_days: 120,
    period_of_work_days: 365,
    pre_bid_meeting_venue: 'Conference Hall, Office of the Chief Engineer, PHED, Lamphelpat, Imphal - 795004',
    pre_bid_meeting_date: '10-Dec-2025 11:30 AM',
    bid_opening_place: 'Tender Opening Room, Chief Engineer Office, PHED Lamphelpat, Imphal',
    nodal_officer: {
      name: 'Er. L. Tombi Singh',
      designation: 'Superintending Engineer (Rural Water Supply Circle)',
      office: 'Public Health Engineering Department, Government of Manipur',
      contact: 'se-phed-manipur@nic.in / 0385-2414120',
    },
    clarification_start: '06-Dec-2025 10:00 AM',
    clarification_end: '09-Dec-2025 04:00 PM',
    financial_bid_opening_date: '18-Dec-2025 03:30 PM',
    covers: [
      {
        cover_no: 1,
        cover_type: 'Fee/PreQual/Technical',
        description: 'Scanned copies of Tender Fee DD, EMD BG/FDR, Class-I PHED Registration, GSTIN clearance, 5-Yr Balance Sheet, Solvency Certificate, and Work Experience',
        document_type: '.pdf',
      },
      {
        cover_no: 2,
        cover_type: 'Finance',
        description: 'Bill of Quantities (BOQ) with item rate price schedule for civil, mechanical pumping, clariflocculator, and chemical dosing units',
        document_type: '.xls',
      },
    ],
    documents: [
      {
        doc_id: 'NIT-DOC-01',
        name: 'Tendernotice_1.pdf',
        category: 'NIT',
        file_type: 'PDF',
        file_size: '1.48 MB',
        published_date: '05-Dec-2025 04:00 PM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app?component=%24DirectLink&page=FrontEndTenderDetails',
      },
      {
        doc_id: 'SPEC-TECH-01',
        name: 'Technical_Specifications_Tuitha_WTP.pdf',
        category: 'TECHNICAL_SPEC',
        file_type: 'PDF',
        file_size: '4.82 MB',
        published_date: '05-Dec-2025 04:15 PM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
      {
        doc_id: 'DWG-01',
        name: 'Structural_Hydraulic_Drawings_5MLD.pdf',
        category: 'DRAWING',
        file_type: 'PDF',
        file_size: '11.20 MB',
        published_date: '05-Dec-2025 04:20 PM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
      {
        doc_id: 'BOQ-XLS-01',
        name: 'BOQ_Tuitha_Pumping_WTP.xls',
        category: 'BOQ',
        file_type: 'Excel (.xls)',
        file_size: '348 KB',
        published_date: '05-Dec-2025 04:30 PM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
    ],
    corrigenda_log: [
      {
        corrigendum_no: 1,
        corrigendum_type: 'Clarification Note',
        published_date: '10-Dec-2025 05:00 PM',
        subject: 'Minutes of Pre-Bid Meeting & Clarifications on MS Pipe Thickness',
        details: 'Clarified intake pipe grade conforming to IS:3589 and chemical dosing pump redundancy requirement.',
        doc_name: 'Corrigendum_1_PreBid_Minutes.pdf',
      },
      {
        corrigendum_no: 2,
        corrigendum_type: 'Technical Amendment',
        published_date: '12-Dec-2025 02:30 PM',
        subject: 'Modification of Clause 4.3 (Turbidity standard rating parameter)',
        details: 'Raw water peak turbidity design standard adjusted from 400 NTU to 650 NTU to accommodate monsoon river discharge.',
        doc_name: 'Corrigendum_2_Clause_Amendment.pdf',
      },
      {
        corrigendum_no: 3,
        corrigendum_type: 'Date Extension',
        published_date: '14-Dec-2025 11:15 AM',
        subject: 'Extension of Bid Submission Deadline due to telecom disruption',
        details: 'Bid submission window extended by 48 hours following internet service disruption reported across Churachandpur district.',
        doc_name: 'Corrigendum_3_Date_Extension.pdf',
      },
      {
        corrigendum_no: 4,
        corrigendum_type: 'Date Extension',
        published_date: '15-Dec-2025 10:00 AM',
        subject: 'Rescheduling of Technical Bid Opening Committee',
        details: 'Technical opening moved from 15-Dec to 16-Dec 02:00 PM due to departmental state audit scheduling.',
        doc_name: 'Corrigendum_4_Opening_Schedule.pdf',
      },
    ],
    bidder_evaluations: [
      {
        bidder_name: 'M/S Highlands Civil Tech Corp',
        bidder_id: 'MAN-BID-2025-0891',
        technical_status: 'Qualified',
        financial_rank: 'L1',
        quoted_amount_inr: 381800000.0,
        variance_from_estimate_pct: -0.05,
      },
      {
        bidder_name: 'M/S Valley Water Engineering Pvt Ltd',
        bidder_id: 'MAN-BID-2025-0904',
        technical_status: 'Disqualified',
        rejection_reason:
          'Cover 1 Technical Rejection: Bank Solvency certificate was dated 8 months prior (exceeding 6-month validity clause); failed to submit Manipur GSTIN 3-B returns for Q2/Q3.',
      },
      {
        bidder_name: 'M/S Barak Infra Concessionaires',
        bidder_id: 'MAN-BID-2025-0918',
        technical_status: 'Disqualified',
        rejection_reason:
          'Cover 1 Technical Rejection: Work experience certificate of completed WTP was for 3 MLD capacity, falling below mandatory 80% threshold (4 MLD equivalent).',
      },
    ],
    contract_number: 'CE/PHED/WTP-CCPUR/AGMT/2026/04',
    contract_awarded_date: '12-Jan-2026',
    contract_period_months: 12,
    debarment_status: 'UNDER_REVIEW',
    debarment_check_note:
      'Prototype fixture only. No entity-level debarment cross-check was completed in the current audit.',
  },

  // Flagship 2: Education / Modular Lab Infrastructure (PWD Buildings)
  'MAN_ED_PROC_2026_0142': {
    data_status: 'prototype_fixture',
    evidence_note: 'Prototype fixture; record-level portal and document verification is pending.',
    tender_type: 'Open Tender',
    form_of_contract: 'Item Rate',
    tender_category: 'Works',
    covers_count: 2,
    general_tech_eval_allowed: true,
    payment_mode: 'Online (SBI MOPS / Internet Banking)',
    is_multi_currency: false,
    fee_payable_to: 'Executive Engineer, PWD Buildings Division I, Imphal',
    fee_payable_at: 'Imphal West',
    fee_exemption_allowed: true,
    emd_fee_type: 'Percentage',
    emd_percentage: 2.5,
    emd_exemption_allowed: true,
    emd_payable_to: 'Executive Engineer, PWD Buildings Division I',
    emd_payable_at: 'Imphal',
    pre_qualification_details:
      'Bidder must be a registered Class-I contractor with PWD Manipur or certified manufacturer of prefabricated modular steel structures conforming to IS 800:2007. Minimum 3 years prior supply/construction experience with government schools/colleges. Turn-over not less than ₹2.5 Cr annually.',
    sub_category: 'Prefabricated Modular Buildings & Composite Science Laboratories',
    bid_validity_days: 90,
    period_of_work_days: 180,
    pre_bid_meeting_venue: 'Conference Room, Chief Engineer PWD Buildings, Khuman Lampak, Imphal',
    pre_bid_meeting_date: '24-Sep-2026 11:00 AM',
    bid_opening_place: 'Executive Engineer Chamber, PWD Buildings Division I, Imphal West',
    nodal_officer: {
      name: 'Er. N. Sanajaoba Singh',
      designation: 'Executive Engineer (PWD Buildings Div-I)',
      office: 'Public Works Department, Government of Manipur',
      contact: 'ee-pwdbuildings1@manipur.gov.in',
    },
    clarification_start: '19-Sep-2026 10:00 AM',
    clarification_end: '23-Sep-2026 03:00 PM',
    financial_bid_opening_date: '08-Oct-2026 02:00 PM',
    covers: [
      {
        cover_no: 1,
        cover_type: 'Fee/PreQual/Technical',
        description: 'Online payment proof / MSME Udyam Exemption certificate, IS 800 factory certification, Class-I PWD license, GSTIN, PAN, and 3-Year Audited Accounts',
        document_type: '.pdf',
      },
      {
        cover_no: 2,
        cover_type: 'Finance',
        description: 'Price Bid BOQ schedule per school module installation and laboratory equipment commissioning',
        document_type: '.xls',
      },
    ],
    documents: [
      {
        doc_id: 'NIT-MOD-01',
        name: 'NIT_Notice_ModularLabs_2026.pdf',
        category: 'NIT',
        file_type: 'PDF',
        file_size: '980 KB',
        published_date: '18-Sep-2026 10:00 AM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
      {
        doc_id: 'BOQ-MOD-01',
        name: 'BOQ_Modular_Classrooms_Labs.xls',
        category: 'BOQ',
        file_type: 'Excel (.xls)',
        file_size: '215 KB',
        published_date: '18-Sep-2026 10:30 AM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
      {
        doc_id: 'SPEC-MOD-01',
        name: 'Architectural_Modular_Layouts.pdf',
        category: 'TECHNICAL_SPEC',
        file_type: 'PDF',
        file_size: '3.40 MB',
        published_date: '18-Sep-2026 10:45 AM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
    ],
    corrigenda_log: [
      {
        corrigendum_no: 1,
        corrigendum_type: 'Scope Revision',
        published_date: '25-Sep-2026 03:30 PM',
        subject: 'Revision of modular panel fire resistance classification (Class 1 to Class O)',
        details: 'Technical specification amended following Education Directorate advisory on school building fire codes.',
        doc_name: 'Corrigendum_1_FireSpecs.pdf',
      },
      {
        corrigendum_no: 2,
        corrigendum_type: 'Technical Amendment',
        published_date: '28-Sep-2026 04:00 PM',
        subject: 'Inclusion of solar backup battery specifications for remote Kangpokpi schools',
        details: 'Added 5kVA hybrid solar inverter battery requirements to BOQ Schedule Item 14.',
        doc_name: 'Corrigendum_2_SolarSpecs.pdf',
      },
      {
        corrigendum_no: 3,
        corrigendum_type: 'Date Extension',
        published_date: '01-Oct-2026 09:30 AM',
        subject: 'Compressed 38.5-hour final submission window adjustment',
        details: 'Final date moved to 02-Oct 16:00, creating rapid window compression flagged in CHEIRAP scrutiny engine.',
        doc_name: 'Corrigendum_3_FinalSchedule.pdf',
      },
    ],
    bidder_evaluations: [
      {
        bidder_name: 'Vendor A (M/S Kangla Prefab Systems)',
        bidder_id: 'MAN-BID-2026-0312',
        technical_status: 'Qualified',
        financial_rank: 'L1',
        quoted_amount_inr: 48100000.0,
        variance_from_estimate_pct: -0.21,
      },
      {
        bidder_name: 'Vendor B (M/S Imphal Valley Structures LLP)',
        bidder_id: 'MAN-BID-2026-0319',
        technical_status: 'Qualified',
        financial_rank: 'L2',
        quoted_amount_inr: 48900000.0,
        variance_from_estimate_pct: 1.45,
      },
    ],
    contract_number: 'EE/PWD-BLD-I/LABS/2026/18 (Under Scrutiny)',
    contract_awarded_date: 'Pending Pre-Award Review',
    contract_period_months: 6,
    debarment_status: 'UNDER_REVIEW',
    debarment_check_note:
      'Prototype fixture only. No entity-level debarment cross-check was completed in the current audit.',
  },

  // Flagship 3: High-Value National Highway Rehabilitation (PWD Highways)
  '2026_PWDM1_3104_1': {
    data_status: 'prototype_fixture',
    evidence_note: 'Prototype fixture; record-level portal and document verification is pending.',
    tender_type: 'Open Tender',
    form_of_contract: 'Percentage',
    tender_category: 'Works',
    covers_count: 2,
    general_tech_eval_allowed: true,
    payment_mode: 'Offline / Online SBI MOPS',
    is_multi_currency: false,
    fee_payable_to: 'Executive Engineer, PWD Highway Division I',
    fee_payable_at: 'Imphal',
    fee_exemption_allowed: false,
    emd_fee_type: 'Percentage',
    emd_percentage: 2.0,
    emd_exemption_allowed: false,
    emd_payable_to: 'Executive Engineer, PWD Highway Division I',
    emd_payable_at: 'Imphal',
    pre_qualification_details:
      'Contractor must be registered as Special Class / Class-I with PWD Manipur or MoRTH. Must possess required road construction machinery (Hot Mix Plant 100-120 TPH, Paver Finisher, Tandem Roller, Soil Stabilizer) either owned or leased with legal affidavit. Must have completed similar hill road 2-laning of minimum 15 Km length in high-rainfall terrain.',
    independent_external_monitor: 'Departmental Vigilance Wing & State Quality Monitor (SQM), National Highway Circle, PWD Manipur',
    sub_category: 'Highways & Hill Roads / Flexible Pavement 2-Laning',
    bid_validity_days: 120,
    period_of_work_days: 730,
    pre_bid_meeting_venue: 'Chief Engineer Conference Hall, PWD Head Office, Babupara, Imphal - 795001',
    pre_bid_meeting_date: '20-Jan-2026 11:00 AM',
    bid_opening_place: 'Superintending Engineer Office, National Highway Circle, PWD Babupara, Imphal',
    nodal_officer: {
      name: 'Er. Th. Brojen Singh',
      designation: 'Superintending Engineer (NH Circle)',
      office: 'PWD Manipur National Highway Wing',
      contact: 'se-nh-pwd-manipur@nic.in',
    },
    clarification_start: '14-Jan-2026 10:00 AM',
    clarification_end: '19-Jan-2026 03:00 PM',
    financial_bid_opening_date: '10-Feb-2026 02:30 PM',
    covers: [
      {
        cover_no: 1,
        cover_type: 'Fee/PreQual/Technical',
        description: 'Tender fee proof, EMD Bank Guarantee from Nationalized Bank, MoRTH/PWD Class-I Registration, Plant & Machinery Ownership Undertaking, Hill Road Experience',
        document_type: '.pdf',
      },
      {
        cover_no: 2,
        cover_type: 'Finance',
        description: 'Standard Percentage Rate BOQ Spreadsheet for Earthwork, DBM, BC, and Hill Culverts',
        document_type: '.xls',
      },
    ],
    documents: [
      {
        doc_id: 'NIT-HW-01',
        name: 'Tendernotice_HW_Tamenglong_Pkg3.pdf',
        category: 'NIT',
        file_type: 'PDF',
        file_size: '2.10 MB',
        published_date: '12-Jan-2026 10:00 AM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
      {
        doc_id: 'BOQ-HW-01',
        name: 'BOQ_Highway_Km35_to_52.xls',
        category: 'BOQ',
        file_type: 'Excel (.xls)',
        file_size: '412 KB',
        published_date: '12-Jan-2026 10:30 AM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
      {
        doc_id: 'DWG-HW-01',
        name: 'Alignment_Drawings_Tamenglong_HillRoad.pdf',
        category: 'DRAWING',
        file_type: 'PDF',
        file_size: '18.4 MB',
        published_date: '12-Jan-2026 11:00 AM',
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
    ],
    corrigenda_log: [
      {
        corrigendum_no: 1,
        corrigendum_type: 'Clarification Note',
        published_date: '21-Jan-2026 04:00 PM',
        subject: 'Clarifications on hill slope stabilization and gabion retaining wall rates',
        details: 'Confirmed geotechnical slope safety standards and designated quarry locations along Package 3 stretch.',
        doc_name: 'Corrigendum_1_SlopeSafety.pdf',
      },
      {
        corrigendum_no: 2,
        corrigendum_type: 'Technical Amendment',
        published_date: '24-Jan-2026 02:00 PM',
        subject: 'Modification to culvert cross-drainage pipe specification',
        details: 'Upgraded NP4 hume pipe requirement to reinforced RCC box culverts at 3 critical landslide ravines.',
        doc_name: 'Corrigendum_2_Culverts.pdf',
      },
      {
        corrigendum_no: 3,
        corrigendum_type: 'Date Extension',
        published_date: '29-Jan-2026 11:30 AM',
        subject: 'Extension of closing date from 30-Jan to 02-Feb',
        details: 'Submission window extended by 72 hours following bidder requests for quarry distance verification.',
        doc_name: 'Corrigendum_3_Extension.pdf',
      },
    ],
    bidder_evaluations: [
      {
        bidder_name: 'M/S Eastern Infrastructure Projects Ltd',
        bidder_id: 'MAN-BID-2026-0104',
        technical_status: 'Qualified',
        financial_rank: 'L1',
        quoted_amount_inr: 484200000.0,
        variance_from_estimate_pct: -0.16,
      },
      {
        bidder_name: 'M/S Barak Valley Infra Corp',
        bidder_id: 'MAN-BID-2026-0112',
        technical_status: 'Disqualified',
        rejection_reason:
          'Cover 1 Technical Rejection: Bank Solvency certificate amount (₹8.0 Cr) was below the mandatory minimum of 30% of tender value (₹14.55 Cr).',
      },
      {
        bidder_name: 'M/S North East Roadways Pvt Ltd',
        bidder_id: 'MAN-BID-2026-0125',
        technical_status: 'Disqualified',
        rejection_reason:
          'Cover 1 Technical Rejection: Plant & Machinery lease affidavit was not registered with First Class Magistrate as required under Clause 7.2 of NIT.',
      },
    ],
    contract_number: 'SE/PWD-NH/LOA/2026/09',
    contract_awarded_date: '18-Feb-2026',
    contract_period_months: 24,
    debarment_status: 'UNDER_REVIEW',
    debarment_check_note:
      'Prototype fixture only. No entity-level debarment cross-check was completed in the current audit.',
  },
};

/**
 * Returns a prototype fixture or an explicitly unverified schema preview.
 * No fallback value should be presented as a live portal extraction.
 */
export const getGepnicDossier = (tender: Tender): GepnicDossier => {
  if (gepnicDossiers[tender.tender_id]) {
    return gepnicDossiers[tender.tender_id];
  }

  // Generate a standard GePNIC-shaped preview for remaining tenders.
  // These values demonstrate the UI schema only; they are not portal facts.
  const emdPct = tender.estimated_value_inr > 0 ? (tender.emd_amount_inr / tender.estimated_value_inr) * 100 : 2.0;
  const isHighValue = tender.estimated_value_inr >= 200000000;
  const feeExempt = tender.tender_fee_inr === 0 || tender.feat_emd_ratio < 0.01;

  return {
    data_status: 'schema_preview',
    evidence_note: 'Generated from the local snapshot for UI/schema demonstration; no live portal detail was retrieved.',
    tender_type: 'Open Tender',
    form_of_contract: isHighValue ? 'Item Rate' : 'Percentage',
    tender_category: 'Works',
    covers_count: 2,
    general_tech_eval_allowed: true,
    payment_mode: 'Online (SBI MOPS) / Offline Challan',
    is_multi_currency: false,
    fee_payable_to: `Executive Engineer / Inviting Authority, ${tender.department.slice(0, 36)}`,
    fee_payable_at: tender.location || 'Imphal, Manipur',
    fee_exemption_allowed: feeExempt,
    emd_fee_type: 'Percentage',
    emd_percentage: Number(emdPct.toFixed(2)),
    emd_exemption_allowed: feeExempt,
    emd_payable_to: `Inviting Authority, ${tender.department.slice(0, 36)}`,
    emd_payable_at: tender.location || 'Imphal, Manipur',
    pre_qualification_details: `Standard PWD/GePNIC Pre-Qualification: Valid Class-I/II contractor registration in Manipur, minimum 50% similar works completion in last 3 financial years, positive net worth, and valid GSTIN 3B clearance.`,
    independent_external_monitor: isHighValue
      ? 'Designated CVC Vigilance Observer / Departmental Vigilance Wing, Government of Manipur'
      : undefined,
    sub_category: tender.product_category || 'Public Works & Civil Infrastructure',
    bid_validity_days: 90,
    period_of_work_days: 180,
    pre_bid_meeting_venue: tender.is_mantripukhri_venue
      ? 'Secretariat / Office Complex, Mantripukhri, Imphal'
      : `Office of the Inviting Authority, ${tender.department.slice(0, 36)}`,
    pre_bid_meeting_date: tender.published_date,
    bid_opening_place: `Tender Committee Room, ${tender.department.slice(0, 42)}`,
    nodal_officer: {
      name: 'Departmental Nodal Procurement Officer',
      designation: 'Executive Engineer / Superintending Engineer',
      office: tender.department,
      contact: 'manipur-etenders@nic.in',
    },
    covers: [
      {
        cover_no: 1,
        cover_type: 'Fee/PreQual/Technical',
        description: 'Scanned EMD deposit instrument, tender fee receipt, registration certificate, PAN, GSTIN, and qualification documents',
        document_type: '.pdf',
      },
      {
        cover_no: 2,
        cover_type: 'Finance',
        description: 'Price Bid / Bill of Quantities (BOQ) Schedule',
        document_type: '.xls',
      },
    ],
    documents: [
      {
        doc_id: `NIT-${tender.tender_id}`,
        name: `Tendernotice_${tender.ref_no.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        category: 'NIT',
        file_type: 'PDF',
        file_size: '1.24 MB',
        published_date: tender.published_date,
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
      {
        doc_id: `BOQ-${tender.tender_id}`,
        name: `BOQ_${tender.tender_id}.xls`,
        category: 'BOQ',
        file_type: 'Excel (.xls)',
        file_size: '286 KB',
        published_date: tender.published_date,
        download_url: 'https://manipurtenders.gov.in/nicgep/app',
      },
    ],
    corrigenda_log:
      tender.corrigendum_count > 0
        ? Array.from({ length: tender.corrigendum_count }, (_, i) => ({
            corrigendum_no: i + 1,
            corrigendum_type: i === 0 ? 'Clarification Note' : 'Date Extension',
            published_date: tender.published_date,
            subject: `Corrigendum No. ${i + 1} - Schedule adjustment and clause notification`,
            details: `Official amendment published under reference ${tender.ref_no}/CORR-${i + 1}.`,
            doc_name: `Corrigendum_${i + 1}.pdf`,
          }))
        : [],
    bidder_evaluations:
      tender.awarded_contractor || tender.awarded_vendor
        ? [
            {
              bidder_name: tender.awarded_contractor || tender.awarded_vendor || 'Awarded Bidder',
              technical_status: 'Qualified',
              financial_rank: 'L1',
              quoted_amount_inr: tender.awarded_value_inr,
              variance_from_estimate_pct:
                tender.awarded_value_inr && tender.estimated_value_inr
                  ? Number((((tender.awarded_value_inr - tender.estimated_value_inr) / tender.estimated_value_inr) * 100).toFixed(2))
                  : 0,
            },
          ]
        : undefined,
    contract_number: tender.status.toLowerCase().includes('award') ? `MAN/PROC/AGMT/${tender.tender_id}` : undefined,
    contract_awarded_date: tender.status.toLowerCase().includes('award') ? tender.closing_date : undefined,
    debarment_status: 'UNDER_REVIEW',
    debarment_check_note:
      'Not checked in the current audit. A future adapter must query the registry and preserve the exact entity, timestamp, and result.',
  };
};
