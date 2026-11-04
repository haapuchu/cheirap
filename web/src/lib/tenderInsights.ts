export type TenderTier = 'RED' | 'AMBER' | 'GREEN';
export type TenderSourceStatus = 'observed' | 'snapshot' | 'partial' | 'prototype_fixture' | 'schema_preview' | 'not_connected';

export interface GepnicCover {
  cover_no: number;
  cover_type: string;
  description: string;
  document_type: string;
}

export interface GepnicDocument {
  doc_id: string;
  name: string;
  category: 'NIT' | 'BOQ' | 'TECHNICAL_SPEC' | 'DRAWING' | 'CORRIGENDUM';
  file_type: string;
  file_size: string;
  published_date: string;
  download_url?: string;
}

export interface GepnicBidderEvaluation {
  bidder_name: string;
  bidder_id?: string;
  technical_status: 'Qualified' | 'Disqualified';
  rejection_reason?: string;
  financial_rank?: 'L1' | 'L2' | 'L3' | 'L4';
  quoted_amount_inr?: number;
  variance_from_estimate_pct?: number;
}

export interface GepnicCorrigendumEntry {
  corrigendum_no: number;
  corrigendum_type: 'Date Extension' | 'Scope Revision' | 'Technical Amendment' | 'Clarification Note';
  published_date: string;
  subject: string;
  details: string;
  doc_name?: string;
}

export interface GepnicDossier {
  data_status?: 'verified' | 'prototype_fixture' | 'schema_preview' | 'unavailable';
  source_url?: string;
  source_checked_at?: string;
  evidence_note?: string;
  tender_type: 'Open Tender' | 'Limited' | 'Single Tender' | 'EOI';
  form_of_contract: 'Item Rate' | 'Percentage' | 'Lump-Sum' | 'Fixed Rate';
  tender_category: 'Works' | 'Goods' | 'Services';
  covers_count: number;
  general_tech_eval_allowed: boolean;
  payment_mode: string;
  is_multi_currency: boolean;
  fee_payable_to: string;
  fee_payable_at: string;
  fee_exemption_allowed: boolean;
  emd_fee_type: 'Fixed' | 'Percentage';
  emd_percentage?: number;
  emd_exemption_allowed: boolean;
  emd_payable_to: string;
  emd_payable_at: string;
  pre_qualification_details: string;
  independent_external_monitor?: string;
  sub_category?: string;
  bid_validity_days: number;
  period_of_work_days: number;
  pre_bid_meeting_venue?: string;
  pre_bid_meeting_date?: string;
  bid_opening_place: string;
  nodal_officer?: {
    name: string;
    designation: string;
    office: string;
    contact?: string;
  };
  clarification_start?: string;
  clarification_end?: string;
  financial_bid_opening_date?: string;
  covers: GepnicCover[];
  documents: GepnicDocument[];
  corrigenda_log: GepnicCorrigendumEntry[];
  bidder_evaluations?: GepnicBidderEvaluation[];
  contract_number?: string;
  contract_awarded_date?: string;
  contract_period_months?: number;
  debarment_status: 'CLEARED' | 'SUSPICIOUS_MATCH' | 'UNDER_REVIEW';
  debarment_check_note: string;
}

export interface Tender {
  tender_id: string;
  ref_no: string;
  title: string;
  department: string;
  state?: string;
  org_chain?: string;
  location: string;
  pincode?: string;
  estimated_value_inr: number;
  emd_amount_inr: number;
  tender_fee_inr: number;
  published_date: string;
  closing_date: string;
  opening_date: string;
  submission_start?: string;
  submission_end?: string;
  corrigendum_count: number;
  status: string;
  cheirap_risk_score: number;
  if_anomaly_score: number;
  cvc_statutory_penalty: number;
  vigilance_tier: TenderTier;
  vigilance_recommendation?: string;
  feat_window_days: number;
  feat_corr_velocity: number;
  feat_window_compression_hours: number;
  feat_emd_ratio: number;
  feat_single_bidder_risk: number;
  feat_spread_ratio: number;
  feat_emd_skew_dev?: number;
  feat_capex_intensity?: number;
  feat_retender_churn?: number;
  bids_received?: number;
  qualified_bidders?: number;
  awarded_value_inr?: number;
  awarded_vendor?: string;
  awarded_contractor?: string;
  historical_comparable_count?: number;
  recorded_approving_authority?: string;
  work_desc?: string;
  product_category?: string;
  contract_type?: string;
  bid_validity?: string | number;
  period_of_work?: string | number;
  source?: string;
  source_status?: TenderSourceStatus;
  source_url?: string;
  source_checked_at?: string;
  source_note?: string;
  source_lineage?: string;
  is_mantripukhri_venue?: boolean;
  gepnic_dossier?: GepnicDossier;
  audit_flags: string[];
}

export const snapshotMeta = {
  sourceLabel: 'manipurtenders.gov.in',
  sourceUrl: 'https://manipurtenders.gov.in/nicgep/app',
  searchUrl: 'https://manipurtenders.gov.in/nicgep/app?page=FrontEndTenderSearch&service=page',
  snapshotDate: '24 October 2026',
  shortSnapshotDate: '24 Oct 2026',
  status: 'Public portal snapshot',
  recordLevelVerified: false,
  sourceNote: 'Local snapshot; record-level portal evidence was not independently verified for every record.',
};

export const normalizeSnapshotTender = (tender: Tender): Tender => ({
  ...tender,
  source_status: tender.source_status ?? 'snapshot',
  source_url: tender.source_url ?? snapshotMeta.sourceUrl,
  source_checked_at: tender.source_checked_at ?? snapshotMeta.snapshotDate,
  source_note: tender.source_note ?? snapshotMeta.sourceNote,
  source_lineage: tender.source_lineage ?? tender.source ?? 'UNSPECIFIED',
});

const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export const parseTenderDate = (value: string | undefined) => {
  if (!value) return null;
  const legacyMatch = value.match(/^([0-9]{1,2})-([A-Za-z]{3})-([0-9]{4})(?:\s+([0-9]{1,2}):([0-9]{2})\s*(AM|PM))?$/i);
  if (legacyMatch) {
    const [, day, monthLabel, year, hour = '0', minute = '0', meridiem = ''] = legacyMatch;
    const monthIndex = monthNames.indexOf(monthLabel.toLowerCase());
    if (monthIndex >= 0) {
      let parsedHour = Number(hour) || 0;
      if (meridiem) parsedHour = (parsedHour % 12) + (meridiem.toUpperCase() === 'PM' ? 12 : 0);
      return new Date(Number(year), monthIndex, Number(day), parsedHour, Number(minute));
    }
  }

  const parsed = new Date(value.replace(' ', 'T'));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (value: string | undefined) => {
  if (!value) return 'Not listed';
  const parsed = parseTenderDate(value);
  if (!parsed) return value;
  const hasTime = /\d{1,2}:\d{2}/.test(value);
  const dateLabel = parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return hasTime ? `${dateLabel}, ${parsed.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` : dateLabel;
};

export const formatCrores = (value: number | undefined) => `₹${((value || 0) / 1e7).toFixed(2)} Cr`;

export const formatIndianCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return 'Not listed';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

export const getDaysUntilClosing = (tender: Tender, today = new Date('2026-10-24T00:00:00+05:30')) => {
  const closing = parseTenderDate(tender.closing_date);
  if (!closing) return null;
  return Math.ceil((closing.getTime() - today.getTime()) / 86400000);
};

export const getClosingLabel = (tender: Tender) => {
  const days = getDaysUntilClosing(tender);
  if (days === null) return 'Closing date not listed';
  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return 'Closes tomorrow';
  return `Closes in ${days} days`;
};

export const getSignal = (tender: Tender) => {
  if (tender.feat_window_compression_hours < 72) {
    return { label: 'Short bidding window', detail: 'The available response window is shorter than the comparison benchmark used in this snapshot.', tone: 'rose' };
  }
  if (tender.corrigendum_count >= 3) {
    return { label: 'Several changes recorded', detail: 'Multiple amendments were recorded before the closing date.', tone: 'amber' };
  }
  if (tender.feat_single_bidder_risk >= 0.7 || (tender.bids_received ?? 5) <= 2) {
    return { label: 'Low participation signal', detail: 'The record shows fewer participating bidders than the comparison pool.', tone: 'amber' };
  }
  if (tender.feat_emd_ratio > 0.05) {
    return { label: 'Bid-security outlier', detail: 'The bid-security amount appears high relative to the estimated value.', tone: 'amber' };
  }
  if (tender.vigilance_tier === 'GREEN') {
    return { label: 'Open opportunity', detail: 'No prominent review signal is surfaced in this snapshot.', tone: 'green' };
  }
  return { label: 'Pattern observed', detail: 'Some fields differ from similar records and may merit context.', tone: 'blue' };
};

export const getSignalTone = (tone: string) => {
  if (tone === 'rose') return 'signal-rose';
  if (tone === 'amber') return 'signal-amber';
  if (tone === 'green') return 'signal-green';
  return 'signal-blue';
};

export const getSimpleDepartment = (department: string) => {
  const replacements = [
    ['Chief Engineer - Public Health Engineering Department', 'Public Health Engineering'],
    ['Manipur State Power Distribution Company Limited', 'Power Distribution'],
    ['Planning and Development Authority', 'Planning & Development'],
    ['Ministry of Information Technology', 'Information Technology'],
    ['Directorate of Tribal Affairs and Hills', 'Tribal Affairs & Hills'],
    ['National Health Mission - Manipur', 'National Health Mission'],
    ['PWD,Govt. of Manipur', 'Public Works Department'],
  ];
  return replacements.find(([from]) => department.includes(from))?.[1] || department;
};

export const getLocationLabel = (location: string) => {
  if (!location || /as per|manipur districts|epc documents/i.test(location)) return 'Multiple locations / notice details';
  return location;
};

export const getDistrictLabel = (location: string) => {
  const normalized = getLocationLabel(location);
  if (normalized.includes('/')) return normalized.split('/')[0].trim();
  return normalized;
};

const tidyText = (value: string) => value.replace(/\s+/g, ' ').replace(/\|+/g, ',').trim();

export const getScopeText = (tender: Tender) => {
  const source = tidyText(tender.work_desc || tender.title);
  if (source.length > 24) return source.replace(/^(procurement|construction|execution|supply|rehabilitation|upgradation|maintenance)\s+of\s+/i, '');
  return source;
};

export const getProjectType = (tender: Tender) => {
  const text = `${tender.title} ${tender.product_category || ''}`.toLowerCase();
  if (/school|lab|hospital|health|clinic|medical/.test(text)) return 'Public facilities';
  if (/road|bridge|highway|building|construction|rehabilitation/.test(text)) return 'Civil works';
  if (/water|pipeline|filtration|sewer|drain/.test(text)) return 'Water and sanitation';
  if (/power|electric|transformer|substation/.test(text)) return 'Power and electrical';
  if (/plantation|forest|eco|environment/.test(text)) return 'Environment and land';
  return tender.product_category || 'Public procurement';
};

export type SocialImpactDomain =
  | 'WATER_SANITATION'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'ROADS_MOBILITY'
  | 'ENERGY_SAFETY'
  | 'PUBLIC_INFRA';

export interface SocialImpactMeta {
  key: SocialImpactDomain;
  label: string;
  shortLabel: string;
  sdgTag: string;
  iconName: 'Droplets' | 'HeartPulse' | 'GraduationCap' | 'Route' | 'Zap' | 'Building2';
  badgeTone: 'blue' | 'emerald' | 'amber' | 'indigo' | 'violet' | 'slate';
  description: string;
}

export const socialImpactCatalog: Record<SocialImpactDomain, SocialImpactMeta> = {
  WATER_SANITATION: {
    key: 'WATER_SANITATION',
    label: 'Clean Water & Sanitation',
    shortLabel: 'Water & Sanitation',
    sdgTag: 'SDG 6 · Clean Water',
    iconName: 'Droplets',
    badgeTone: 'blue',
    description: 'Drinking water pipelines, filtration plants, drainage chambers, and community sanitation facilities.',
  },
  HEALTHCARE: {
    key: 'HEALTHCARE',
    label: 'Healthcare & Public Hospitals',
    shortLabel: 'Healthcare & Hospitals',
    sdgTag: 'SDG 3 · Good Health',
    iconName: 'HeartPulse',
    badgeTone: 'emerald',
    description: 'District hospital diagnostics, regional blood banks, medical equipment, and surgical supplies.',
  },
  EDUCATION: {
    key: 'EDUCATION',
    label: 'Education & Youth Facilities',
    shortLabel: 'Education & Schools',
    sdgTag: 'SDG 4 · Quality Education',
    iconName: 'GraduationCap',
    badgeTone: 'amber',
    description: 'Secondary school modular labs, classrooms, youth training centres, and learning infrastructure.',
  },
  ROADS_MOBILITY: {
    key: 'ROADS_MOBILITY',
    label: 'Roads, Transit & Connectivity',
    shortLabel: 'Roads & Transit',
    sdgTag: 'SDG 9 & 11 · Sustainable Transit',
    iconName: 'Route',
    badgeTone: 'indigo',
    description: 'Highway corridors, rural road concretisation, pedestrian bridges, and elevated urban metro viaducts.',
  },
  ENERGY_SAFETY: {
    key: 'ENERGY_SAFETY',
    label: 'Energy, Lighting & Public Safety',
    shortLabel: 'Energy & Safety',
    sdgTag: 'SDG 7 & 16 · Safe Communities',
    iconName: 'Zap',
    badgeTone: 'violet',
    description: 'Solar streetlighting, electrical substations, municipal fire safety, and civic area illumination.',
  },
  PUBLIC_INFRA: {
    key: 'PUBLIC_INFRA',
    label: 'Civic Spaces & Public Infrastructure',
    shortLabel: 'Civic Infrastructure',
    sdgTag: 'SDG 11 · Civic Spaces',
    iconName: 'Building2',
    badgeTone: 'slate',
    description: 'Public community parks, administrative complexes, municipal facilities, and public works.',
  },
};

export const getSocialImpactDomain = (tender: Tender): SocialImpactMeta => {
  const text = `${tender.title} ${tender.work_desc || ''} ${tender.department} ${tender.org_chain || ''} ${tender.product_category || ''}`.toLowerCase();
  
  if (/water|pipeline|sewer|drain|filtration|ro unit|wtp|stp|dhapa|pump|well|irrigation|plumbing|jal/i.test(text)) {
    return socialImpactCatalog.WATER_SANITATION;
  }
  if (/hospital|health|medical|clinic|ambulance|diagnostic|medicine|surgical|blood bank|dhs|nurse|pharma|consumable|hygiene/i.test(text)) {
    return socialImpactCatalog.HEALTHCARE;
  }
  if (/school|college|academic|hostel|classroom|laboratory|polytechnic|education|student|textbook|balbharati|curriculum|dmm/i.test(text)) {
    return socialImpactCatalog.EDUCATION;
  }
  if (/road|bridge|culvert|highway|pavement|bypass|flyover|metro|viaduct|station|ramp|tunnel|transit|ccr|concritikaran|khadikaran|lane|sh 119|panand/i.test(text)) {
    return socialImpactCatalog.ROADS_MOBILITY;
  }
  if (/solar|power|electric|substation|transformer|energy|highmast|pole light|street light|led|cctv|surveillance|fire brigade|light fitting/i.test(text)) {
    return socialImpactCatalog.ENERGY_SAFETY;
  }
  return socialImpactCatalog.PUBLIC_INFRA;
};

export const getAwardedName = (tender: Tender) => tender.awarded_contractor || tender.awarded_vendor || '';

export const getAwardDifference = (tender: Tender) => {
  if (!tender.awarded_value_inr || !tender.estimated_value_inr) return null;
  return ((tender.awarded_value_inr - tender.estimated_value_inr) / tender.estimated_value_inr) * 100;
};

export type CoverageStatus = 'available' | 'partial' | 'not-connected';

export interface CoverageItem {
  label: string;
  status: CoverageStatus;
  detail: string;
}

export interface TenderBrief {
  scope: string;
  projectType: string;
  socialImpact: SocialImpactMeta;
  buyer: string;
  location: string;
  summaryParagraphs: string[];
  keyQuestions: string[];
  coverage: CoverageItem[];
  awardDifference: number | null;
}

export const getTenderBrief = (tender: Tender): TenderBrief => {
  const buyer = getSimpleDepartment(tender.department);
  const location = getLocationLabel(tender.location);
  const scope = getScopeText(tender);
  const signal = getSignal(tender);
  const socialImpact = getSocialImpactDomain(tender);
  const awardedName = getAwardedName(tender);
  const awardDifference = getAwardDifference(tender);
  const hasAward = Boolean(awardedName || tender.awarded_value_inr || /award/i.test(tender.status));
  const bidCount = tender.bids_received !== undefined ? `${tender.bids_received} bid${tender.bids_received === 1 ? '' : 's'} recorded` : 'Bid count not listed';
  const projectType = getProjectType(tender).toLowerCase();
  const projectArticle = /^[aeiou]/.test(projectType) ? 'an' : 'a';
  const windowText = tender.feat_window_days > 0 ? `${tender.feat_window_days.toFixed(1)}-day` : 'an unlisted';
  const changeText = tender.corrigendum_count > 0 ? `${tender.corrigendum_count} change${tender.corrigendum_count === 1 ? '' : 's'} recorded` : 'no changes recorded in the snapshot';

  return {
    scope,
    projectType: getProjectType(tender),
    socialImpact,
    buyer,
    location,
    awardDifference,
    summaryParagraphs: [
      `${buyer} has published a public tender for ${scope}. This procurement provides ${projectArticle} ${projectType} intervention supporting ${socialImpact.label.toLowerCase()} (${socialImpact.sdgTag}), impacting public facilities and resident welfare in ${location}.`,
      `The notice estimates the work at ${formatCrores(tender.estimated_value_inr)}. It lists ${formatIndianCurrency(tender.emd_amount_inr)} as bid security and ${formatIndianCurrency(tender.tender_fee_inr)} as the tender fee. These are entry conditions shown in the notice; they do not, by themselves, tell us whether the procurement is fair or unfair.`,
      `The record shows ${windowText} response window, closing on ${formatDate(tender.closing_date)}. ${changeText}. The main review prompt is “${signal.label}”: ${signal.detail.toLowerCase()} Read the original notice and any amendments before relying on this summary.`,
    ],
    keyQuestions: [
      'What exactly will be built, supplied, or repaired, and what is included in the scope?',
      'Which eligibility documents, experience requirements, and payment conditions apply?',
      tender.corrigendum_count > 0 ? 'What changed in the amendments, and did the closing date move with the change?' : 'Was an amendment or clarification published after this snapshot was prepared?',
      hasAward ? 'How many bids were recorded, who was awarded the work, and how does the awarded value compare with the estimate?' : 'Was an award notice published after the tender closed?',
    ],
    coverage: [
      { label: 'Notice and deadline', status: 'available', detail: 'Tender identity, scope label, estimated value, dates, fee, bid security, and official source link are in this snapshot.' },
      {
        label: 'Changes and addenda',
        status: tender.corrigendum_count > 0 ? 'partial' : 'available',
        detail: tender.corrigendum_count > 0 ? `${tender.corrigendum_count} change(s) are counted, but the amendment text is not verified or embedded here.` : 'No corrigendum is counted in the current snapshot.',
      },
      {
        label: 'Award and participation',
        status: hasAward || tender.bids_received !== undefined ? 'partial' : 'not-connected',
        detail: hasAward ? `${bidCount} and award-like fields are present in the local snapshot; verify the original award notice.` : 'Award and bid-participation details are not connected for this record.',
      },
      {
        label: 'Technical / financial evaluation',
        status: 'not-connected',
        detail: 'Full bidder lists, price matrices, and disqualification reasons are not verified in this release.',
      },
      {
        label: 'Debarment registry',
        status: 'not-connected',
        detail: 'No entity-level debarment cross-check was completed for this record.',
      },
      {
        label: 'BOQ and delivery evidence',
        status: 'not-connected',
        detail: 'Itemized quantities, site evidence, and post-award delivery records are not verified or embedded in this release.',
      },
      { label: 'Source integrity', status: 'partial', detail: 'Official identifiers and portal links are preserved, but record-level field provenance is still incomplete.' },
    ],
  };
};
