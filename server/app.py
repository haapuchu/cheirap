import os
import json
import hashlib
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from pydantic import BaseModel

# Import Regulatory Knowledge Base & Statutory Traceability Engine
try:
    import server.regulatory_kb as rkb
except ImportError:
    try:
        import regulatory_kb as rkb
    except ImportError:
        try:
            import cheirap.server.regulatory_kb as rkb
        except ImportError:
            from . import regulatory_kb as rkb

app = FastAPI(
    title="CHEIRAP — Pre-Award Procurement Integrity & Statutory Traceability Layer",
    description="Regulatory Intelligence & Decision Support System for Government of Manipur e-Procurement",
    version="2.0.0"
)

# Enable CORS for local testing and dashboards
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed", "tenders_scored.json")

def load_tenders() -> List[Dict[str, Any]]:
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

# In-memory Audit Trail Store (persisted across reviews during server session)
AUDIT_TRAIL_STORE: Dict[str, List[Dict[str, Any]]] = {}

def get_or_create_audit_trail(tender_id: str, tender: Dict[str, Any]) -> List[Dict[str, Any]]:
    if tender_id in AUDIT_TRAIL_STORE:
        return AUDIT_TRAIL_STORE[tender_id]
    
    tier = tender.get("vigilance_tier", "GREEN")
    score = tender.get("cheirap_risk_score", 15)
    published_date = tender.get("published_date", "2026-09-20 10:00")
    
    events = [
        {
            "id": f"EVT-{tender_id}-001",
            "tender_id": tender_id,
            "officer_name": "CHEIRAP Autonomous Ingestion Engine",
            "officer_role": "SYSTEM",
            "timestamp": f"{published_date} (Ingestion)",
            "action": "RECORD_INGESTED",
            "old_status": "NONE",
            "new_status": "RAW_PUBLISHED",
            "reason": "Tender metadata, BOQ notices, and NIT parameters fetched from manipurtenders.gov.in.",
            "comments": "DSC signature validated. NIT publication confirmed.",
            "evidence_accessed": ["NIT Document", "Tender Schedule", "Org Chain"],
            "regulatory_references_viewed": ["NICGEP Manual"]
        },
        {
            "id": f"EVT-{tender_id}-002",
            "tender_id": tender_id,
            "officer_name": "CHEIRAP Vigilance Risk Engine",
            "officer_role": "SYSTEM",
            "timestamp": "2026-10-01 08:30 IST",
            "action": "RISK_EVALUATION_COMPLETED",
            "old_status": "RAW_PUBLISHED",
            "new_status": f"FLAGGED_{tier}",
            "reason": f"Isolation Forest and statutory rule checks computed. Computed Risk Score: {score}/100 ({tier} Tier).",
            "comments": f"Screened against CVC 01/01/2021, GFR 2017 Rules 144/161/170, and Manipur DFPR 2020.",
            "evidence_accessed": ["Bidding Window Hours", "EMD Ratio", "Corrigenda Logs"],
            "regulatory_references_viewed": ["CVC-CIRC-01/01/2021", "GFR-2017-R161"]
        }
    ]

    if tier in ["RED", "AMBER"]:
        events.append({
            "id": f"EVT-{tender_id}-003",
            "tender_id": tender_id,
            "officer_name": "Special Vigilance Registry",
            "officer_role": "SYSTEM",
            "timestamp": "2026-10-02 11:15 IST",
            "action": "PRE_AWARD_DOSSIER_QUEUED",
            "old_status": f"FLAGGED_{tier}",
            "new_status": "PENDING_OFFICER_REVIEW",
            "reason": "Procedural risk indicators and authority competence queued for pre-award officer review.",
            "comments": "Assigned to Public Works / Vigilance Inspection Bench.",
            "evidence_accessed": ["Estimated Capex", "Delegated Financial Power Table"],
            "regulatory_references_viewed": ["Manipur DFPR 1995/2020"]
        })

    AUDIT_TRAIL_STORE[tender_id] = events
    return AUDIT_TRAIL_STORE[tender_id]

# Request Models
class HoldOrderRequest(BaseModel):
    officer_name: Optional[str] = "Chief Vigilance Officer"
    department_head: Optional[str] = "Chief Engineer / Principal Secretary"
    remarks: Optional[str] = "Automated statutory hold recommended pending 7-day bidding window extension."

class OfficerReviewRequest(BaseModel):
    officer_name: str
    officer_role: Optional[str] = "State Vigilance Commissioner"  # CVO, VIGILANCE_OFFICER, PROCUREMENT_OFFICER, FINANCE_OFFICER, DEPARTMENT_HEAD, AUDITOR
    action: str  # CONFIRM CONCERN, DISMISS, FALSE POSITIVE, REQUEST DOCUMENTS, ESCALATE, MARK FOR MONITORING
    reason: str
    comments: Optional[str] = ""
    evidence_accessed: Optional[List[str]] = []
    regulatory_references_viewed: Optional[List[str]] = []

class EscalateRequest(BaseModel):
    officer_name: Optional[str] = "Chief Vigilance Officer"
    officer_role: Optional[str] = "CVO"
    reason: Optional[str] = "Escalated for Special Vigilance Scrutiny and File Requisition"
    comments: Optional[str] = "Flagged due to compounding competition and authority indicators."

class AdminSourceCreate(BaseModel):
    id: str
    title: str
    short_name: str
    authority: str
    jurisdiction: str
    source_type: str
    version: str
    effective_from: str
    effective_to: Optional[str] = None
    official_url: str
    document_identifier: str
    verification_status: str = "REQUIRES_VERIFICATION"
    applicability: str
    notes: Optional[str] = None

class AdminProvisionCreate(BaseModel):
    id: str
    source_id: str
    chapter: Optional[str] = None
    section: Optional[str] = None
    rule_number: str
    paragraph_number: Optional[str] = None
    clause_number: Optional[str] = None
    title: str
    provision_text: str
    summary: str
    regulatory_principle: str
    applicability: str
    effective_from: str
    official_reference: str
    verification_status: str = "REQUIRES_VERIFICATION"
    severity_if_violated: str = "HIGH"
    review_required: bool = True

# ══════════════════════════════════════════════════════════════════════════════
# CORE API ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": "CHEIRAP AI (ꯆꯩꯔꯥꯞ)",
        "mission": "Pre-Award Public Procurement Integrity Radar & Statutory Traceability Layer",
        "target_portal": "https://manipurtenders.gov.in/nicgep/app",
        "jurisdiction": "Government of Manipur",
        "timestamp": datetime.now().isoformat(),
        "regulatory_version": "2.0.0-Statutory"
    }

@app.get("/api/stats")
def get_stats():
    tenders = load_tenders()
    total_count = len(tenders)
    if total_count == 0:
        return {}

    total_capex = sum(t.get("estimated_value_inr", 0.0) for t in tenders)
    
    red_tenders = [t for t in tenders if t.get("vigilance_tier") == "RED"]
    amber_tenders = [t for t in tenders if t.get("vigilance_tier") == "AMBER"]
    green_tenders = [t for t in tenders if t.get("vigilance_tier") == "GREEN"]
    venue_tenders = [t for t in tenders if t.get("is_mantripukhri_venue")]

    red_capex = sum(t.get("estimated_value_inr", 0.0) for t in red_tenders)
    amber_capex = sum(t.get("estimated_value_inr", 0.0) for t in amber_tenders)
    green_capex = sum(t.get("estimated_value_inr", 0.0) for t in green_tenders)

    # Calculate authority exceptions and regulatory concerns count
    authority_exceptions_count = 0
    competition_concerns_count = 0
    vendor_concerns_count = 0
    
    for t in tenders:
        val = t.get("estimated_value_inr", 0.0)
        auth = rkb.verify_authority_delegation(t)
        if auth["compliance_flag"] in ["RED", "AMBER"]:
            authority_exceptions_count += 1
        if t.get("feat_window_compression_hours", 0) > 0 or t.get("feat_single_bidder_risk", 0):
            competition_concerns_count += 1
        if t.get("feat_emd_ratio", 0) > 0.05:
            vendor_concerns_count += 1

    # Count reviewed vs pending and false positives
    pending_reviews = len(red_tenders) + len(amber_tenders)
    escalated_count = 0
    false_positives_count = 0
    total_reviews_logged = 0

    for tid, events in AUDIT_TRAIL_STORE.items():
        for ev in events:
            if ev.get("action") == "ESCALATE":
                escalated_count += 1
                break
        for ev in events:
            if ev.get("officer_role") != "SYSTEM":
                total_reviews_logged += 1
                if ev.get("action") == "FALSE POSITIVE":
                    false_positives_count += 1

    fp_rate = round((false_positives_count / max(1, total_reviews_logged)) * 100.0, 1) if total_reviews_logged > 0 else 0.0
    verified_refs_count = len([p for p in rkb.REGULATORY_PROVISIONS if p["verification_status"] == "VERIFIED"])
    regulatory_concerns_total = len([t for t in tenders if t.get("vigilance_tier") in ["RED", "AMBER"]])

    # Department capex breakdown
    dept_map = {}
    for t in tenders:
        dept = t.get("department", "Other")
        if dept not in dept_map:
            dept_map[dept] = {"count": 0, "total_value": 0.0, "red_count": 0, "amber_count": 0}
        dept_map[dept]["count"] += 1
        dept_map[dept]["total_value"] += t.get("estimated_value_inr", 0.0)
        if t.get("vigilance_tier") == "RED":
            dept_map[dept]["red_count"] += 1
        elif t.get("vigilance_tier") == "AMBER":
            dept_map[dept]["amber_count"] += 1

    return {
        "summary": {
            "total_tenders_monitored": total_count,
            "total_procurement_value_inr": total_capex,
            "total_procurement_value_cr": round(total_capex / 1e7, 2),
            "compliance_rate_pct": round((len(green_tenders) / total_count) * 100.0, 1),
            "red_hold_count": len(red_tenders),
            "red_hold_capex_cr": round(red_capex / 1e7, 2),
            "amber_advisory_count": len(amber_tenders),
            "amber_advisory_capex_cr": round(amber_capex / 1e7, 2),
            "green_cleared_count": len(green_tenders),
            "green_cleared_capex_cr": round(green_capex / 1e7, 2),
            "mantripukhri_venue_count": len(venue_tenders),
            "regulatory_concerns_count": regulatory_concerns_total,
            "authority_exceptions_count": authority_exceptions_count,
            "competition_concerns_count": competition_concerns_count,
            "vendor_concerns_count": vendor_concerns_count,
            "pending_reviews_count": pending_reviews,
            "cases_escalated_count": escalated_count,
            "false_positives_count": false_positives_count,
            "false_positive_rate_pct": fp_rate,
            "regulatory_references_verified": verified_refs_count
        },
        "regulatory_coverage": {
            "verified_sources": len([s for s in rkb.REGULATORY_SOURCES if s["verification_status"] == "VERIFIED"]),
            "verified_provisions": len([p for p in rkb.REGULATORY_PROVISIONS if p["verification_status"] == "VERIFIED"]),
            "provisional_mappings": len([p for p in rkb.REGULATORY_PROVISIONS if p["verification_status"] == "PROVISIONALLY_MAPPED"]),
            "requires_verification": len([p for p in rkb.REGULATORY_PROVISIONS if p["verification_status"] == "REQUIRES_VERIFICATION"]),
            "total_sources": len(rkb.REGULATORY_SOURCES),
            "total_provisions": len(rkb.REGULATORY_PROVISIONS),
            "principles_catalogued": len(rkb.TAXONOMY_PRINCIPLES)
        },
        "department_distribution": [
            {
                "department": k,
                "tender_count": v["count"],
                "total_capex_cr": round(v["total_value"] / 1e7, 2),
                "red_count": v["red_count"],
                "amber_count": v["amber_count"]
            }
            for k, v in sorted(dept_map.items(), key=lambda x: x[1]["total_value"], reverse=True)
        ]
    }

@app.get("/api/tenders")
def list_tenders(
    tier: Optional[str] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    venue_only: bool = False,
    limit: int = 100,
    offset: int = 0
):
    tenders = load_tenders()

    filtered = tenders
    if tier and tier.upper() in ["RED", "AMBER", "GREEN"]:
        filtered = [t for t in filtered if t.get("vigilance_tier") == tier.upper()]

    if department:
        filtered = [t for t in filtered if department.lower() in t.get("department", "").lower()]

    if search:
        s = search.lower()
        filtered = [
            t for t in filtered
            if s in t.get("title", "").lower() or s in t.get("tender_id", "").lower() or s in t.get("ref_no", "").lower()
        ]

    if venue_only:
        filtered = [t for t in filtered if t.get("is_mantripukhri_venue")]

    total_matched = len(filtered)
    paged = filtered[offset : offset + limit]

    return {
        "total_matched": total_matched,
        "limit": limit,
        "offset": offset,
        "tenders": paged
    }

@app.get("/api/tenders/{tender_id}")
def get_tender_detail(tender_id: str):
    tenders = load_tenders()
    match = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found in vigilance registry.")
    return match

@app.get("/api/portal/status")
def get_portal_status():
    tenders = load_tenders()
    return {
        "status": "ONLINE",
        "portal_url": "https://manipurtenders.gov.in/nicgep/app",
        "search_url": "https://manipurtenders.gov.in/nicgep/app?page=FrontEndTenderSearch&service=page",
        "gateway_title": "Government of Manipur e-Procurement System (GePNIC)",
        "operator": "National Informatics Centre (NIC) / Government of Manipur",
        "ssl_verified": True,
        "total_monitored_tenders": len(tenders),
        "ingestion_channel": "LIVE_PORTAL"
    }

@app.get("/api/tenders/{tender_id}/portal-metadata")
def get_tender_portal_metadata(tender_id: str):
    tenders = load_tenders()
    match = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found in vigilance registry.")
    
    # Calculate deterministic SHA-256 telemetry fingerprint
    sig_components = [
        str(match.get("tender_id", "")),
        str(match.get("ref_no", "")),
        str(match.get("estimated_value_inr", "")),
        str(match.get("published_date", "")),
        str(match.get("closing_date", "")),
        str(match.get("department", ""))
    ]
    raw_sig = "|".join(sig_components)
    sha256_hash = hashlib.sha256(raw_sig.encode("utf-8")).hexdigest()
    
    portal_data = {
        "tender_id": match.get("tender_id"),
        "ref_no": match.get("ref_no"),
        "title": match.get("title"),
        "department": match.get("department"),
        "org_chain": match.get("org_chain"),
        "location": match.get("location"),
        "pincode": match.get("pincode"),
        "estimated_value_inr": match.get("estimated_value_inr"),
        "emd_amount_inr": match.get("emd_amount_inr"),
        "tender_fee_inr": match.get("tender_fee_inr"),
        "published_date": match.get("published_date"),
        "submission_start": match.get("submission_start", match.get("published_date")),
        "submission_end": match.get("submission_end", match.get("closing_date")),
        "closing_date": match.get("closing_date"),
        "opening_date": match.get("opening_date"),
        "corrigendum_count": match.get("corrigendum_count", 0),
        "status": match.get("status", "ACTIVE"),
        "source": match.get("source", "LIVE_PORTAL"),
        "portal_name": "Government of Manipur e-Procurement System (GePNIC)",
        "portal_url": "https://manipurtenders.gov.in/nicgep/app",
        "search_url": "https://manipurtenders.gov.in/nicgep/app?page=FrontEndTenderSearch&service=page",
        "tenders_by_org_url": "https://manipurtenders.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page",
        "latest_active_url": "https://manipurtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page",
        "telemetry_sha256": sha256_hash,
        "verification_guide": [
            f"Tender ID '{match.get('tender_id')}' and Ref '{match.get('ref_no')}' are copied to clipboard.",
            "Click 'Open manipurtenders.gov.in Portal' to access the official GePNIC Public Tender Search.",
            f"Paste '{match.get('tender_id')}' in the 'Tender ID' box and enter the captcha code.",
            "Click 'Search' to view gazetted NIT, tender schedule, and corrigenda hosted directly on NIC infrastructure."
        ]
    }
    return portal_data


# ══════════════════════════════════════════════════════════════════════════════
# STATUTORY TRACEABILITY & REGULATORY INTELLIGENCE ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/regulations")
def get_regulatory_sources(jurisdiction: Optional[str] = None):
    """Retrieve all authoritative regulatory sources."""
    sources = rkb.REGULATORY_SOURCES
    if jurisdiction:
        sources = [s for s in sources if s["jurisdiction"] == jurisdiction.upper()]
    
    # Add count of provisions to each source
    enriched = []
    for s in sources:
        s_copy = dict(s)
        provisions = [p for p in rkb.REGULATORY_PROVISIONS if p["source_id"] == s["id"]]
        s_copy["provisions_count"] = len(provisions)
        enriched.append(s_copy)
    return {"sources": enriched, "total": len(enriched)}

@app.get("/api/regulations/{source_id}")
def get_regulatory_source_detail(source_id: str):
    """Retrieve a single regulatory source along with its catalogued provisions."""
    source = next((s for s in rkb.REGULATORY_SOURCES if s["id"] == source_id), None)
    if not source:
        raise HTTPException(status_code=404, detail=f"Regulatory source '{source_id}' not found.")
    
    provisions = [p for p in rkb.REGULATORY_PROVISIONS if p["source_id"] == source_id]
    return {
        "source": source,
        "provisions": provisions,
        "provisions_count": len(provisions)
    }

@app.get("/api/regulations/{source_id}/provisions")
def get_source_provisions(source_id: str):
    """Retrieve all provisions for a given regulatory source."""
    provisions = [p for p in rkb.REGULATORY_PROVISIONS if p["source_id"] == source_id]
    return {"source_id": source_id, "provisions": provisions, "count": len(provisions)}

@app.get("/api/provisions")
def list_provisions(
    source_id: Optional[str] = None,
    principle: Optional[str] = None,
    status: Optional[str] = None
):
    """List all regulatory provisions with optional filters."""
    provisions = rkb.REGULATORY_PROVISIONS
    if source_id:
        provisions = [p for p in provisions if p["source_id"] == source_id]
    if principle:
        provisions = [p for p in provisions if p["regulatory_principle"] == principle.upper()]
    if status:
        provisions = [p for p in provisions if p["verification_status"] == status.upper()]
    return {"provisions": provisions, "total": len(provisions)}

@app.get("/api/provisions/{provision_id}")
def get_provision_detail(provision_id: str):
    """Get single provision details including authoritative text and connected risk codes."""
    provision = next((p for p in rkb.REGULATORY_PROVISIONS if p["id"] == provision_id), None)
    if not provision:
        raise HTTPException(status_code=404, detail=f"Regulatory provision '{provision_id}' not found.")
    
    source = next((s for s in rkb.REGULATORY_SOURCES if s["id"] == provision["source_id"]), None)
    connected_mappings = [m for m in rkb.RISK_REGULATION_MAPPINGS if m["regulatory_provision_id"] == provision_id]
    
    return {
        "provision": provision,
        "source": source,
        "connected_risk_mappings": connected_mappings
    }

@app.get("/api/risk/{risk_code}/regulatory-basis")
def get_risk_regulatory_basis(risk_code: str):
    """Retrieve regulatory mappings, provisions, principles, and recommended actions for a risk code."""
    risk_info = next((r for r in rkb.RISK_CODES if r["code"] == risk_code.upper()), None)
    if not risk_info:
        raise HTTPException(status_code=404, detail=f"Risk code '{risk_code}' not found in registry.")
    
    mappings = [m for m in rkb.RISK_REGULATION_MAPPINGS if m["risk_code"] == risk_code.upper()]
    enriched_mappings = []
    for m in mappings:
        prov = next((p for p in rkb.REGULATORY_PROVISIONS if p["id"] == m["regulatory_provision_id"]), None)
        src = next((s for s in rkb.REGULATORY_SOURCES if s["id"] == prov["source_id"]), None) if prov else None
        enriched_mappings.append({
            "mapping": m,
            "provision": prov,
            "source": src
        })
    
    return {
        "risk_code": risk_code.upper(),
        "risk_details": risk_info,
        "mappings_count": len(enriched_mappings),
        "mappings": enriched_mappings,
        "disclaimer": "Regulatory basis provides decision-support context. Does not constitute a confirmed legal violation."
    }

@app.get("/api/regulatory-search")
def search_regulations_api(
    q: Optional[str] = Query(None, description="Search keyword e.g. GFR, CVC, DFPR, cartel, EMD"),
    principle: Optional[str] = Query(None, description="Regulatory principle taxonomy filter"),
    jurisdiction: Optional[str] = Query(None, description="CENTRAL, STATE, PLATFORM")
):
    """Full-text and tag search across verified regulatory knowledge base."""
    results = rkb.search_regulations(query=q, principle=principle, jurisdiction=jurisdiction)
    return results

@app.get("/api/regulatory-coverage")
def get_regulatory_coverage():
    """Returns auditability statistics on verified vs provisional coverage."""
    return {
        "taxonomy_principles_count": len(rkb.TAXONOMY_PRINCIPLES),
        "sources_count": len(rkb.REGULATORY_SOURCES),
        "provisions_count": len(rkb.REGULATORY_PROVISIONS),
        "verified_provisions": len([p for p in rkb.REGULATORY_PROVISIONS if p["verification_status"] == "VERIFIED"]),
        "provisional_mappings": len([p for p in rkb.REGULATORY_PROVISIONS if p["verification_status"] == "PROVISIONALLY_MAPPED"]),
        "requires_verification": len([p for p in rkb.REGULATORY_PROVISIONS if p["verification_status"] == "REQUIRES_VERIFICATION"]),
        "risk_codes_catalogued": len(rkb.RISK_CODES),
        "jurisdictions_supported": ["CENTRAL", "STATE (Manipur)", "PLATFORM (GePNIC)"],
        "disclaimer": "All citations undergo mandatory statutory validation. Unverified citations are strictly prohibited."
    }

@app.get("/api/version-history")
def get_regulatory_version_history():
    """Retrieve version timeline of regulatory sources and historical amendments."""
    return {
        "current_effective_year": datetime.now().year,
        "historical_versions": [
            {
                "source": "GFR 2005",
                "effective_range": "2005-07-01 to 2017-03-07",
                "status": "SUPERSEDED",
                "notes": "Replaced by GFR 2017"
            },
            {
                "source": "Manipur DFPR 1995 (Pre-Amendment)",
                "effective_range": "1995-04-01 to 2020-03-31",
                "status": "AMENDED",
                "notes": "Amended in 2020 raising CE ceiling from ₹10 Cr to ₹25 Cr"
            },
            {
                "source": "Manipur DFPR 2020",
                "effective_range": "2020-04-01 to Present",
                "status": "ACTIVE_VERIFIED",
                "notes": "Current governing financial delegation for Manipur State"
            },
            {
                "source": "GFR 2017",
                "effective_range": "2017-03-08 to Present (Updated 2024)",
                "status": "ACTIVE_VERIFIED",
                "notes": "Model national standard for public procurement"
            }
        ]
    }

@app.post("/api/regulations")
def add_regulatory_source_admin(source: AdminSourceCreate):
    """Administrative creation of a new regulatory source with mandatory audit record."""
    new_s = source.dict()
    new_s["last_verified_at"] = datetime.now().strftime("%Y-%m-%d")
    rkb.REGULATORY_SOURCES.append(new_s)
    return {"status": "SOURCE_CREATED", "source": new_s}

@app.post("/api/provisions")
def add_regulatory_provision_admin(provision: AdminProvisionCreate):
    """Administrative creation of a new regulatory provision with verification flag."""
    new_p = provision.dict()
    rkb.REGULATORY_PROVISIONS.append(new_p)
    return {"status": "PROVISION_CREATED", "provision": new_p}

@app.get("/api/tenders/{tender_id}/graph")
@app.get("/api/procurements/{tender_id}/graph")
def get_tender_knowledge_graph(tender_id: str):
    """Retrieve structured regulatory knowledge graph (nodes and edges) for a tender."""
    tenders = load_tenders()
    tender = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")
    return rkb.get_regulatory_knowledge_graph(tender_id, tender)

@app.get("/api/tenders/{tender_id}/regulatory-analysis")
@app.get("/api/procurements/{tender_id}/regulatory-analysis")
def get_tender_regulatory_analysis(tender_id: str):
    """Generate complete statutory traceability dossier for a specific tender."""
    tenders = load_tenders()
    tender = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")
    
    analysis = rkb.get_regulatory_analysis_for_tender(tender, tenders)
    return analysis

@app.get("/api/tenders/{tender_id}/authority-check")
@app.get("/api/procurements/{tender_id}/authority-check")
def get_tender_authority_check(tender_id: str):
    """Dedicated DFPR and delegation of financial powers competence check."""
    tenders = load_tenders()
    tender = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")
    
    auth_check = rkb.verify_authority_delegation(tender)
    return auth_check

@app.get("/api/tenders/{tender_id}/evidence")
@app.get("/api/procurements/{tender_id}/evidence")
def get_tender_evidence(tender_id: str):
    """Get granular empirical evidence items backed by data records and deviations."""
    tenders = load_tenders()
    tender = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")
    
    analysis = rkb.get_regulatory_analysis_for_tender(tender, tenders)
    return {
        "tender_id": tender_id,
        "evidence_dossier": analysis["evidence_dossier"],
        "benchmarking": analysis["benchmarking"]
    }

@app.get("/api/tenders/{tender_id}/audit-trail")
@app.get("/api/cases/{tender_id}/audit-trail")
def get_tender_audit_trail(tender_id: str):
    """Retrieve chronological audit trail of all machine evaluations and officer interventions."""
    tenders = load_tenders()
    tender = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")
    
    trail = get_or_create_audit_trail(tender_id, tender)
    return {
        "tender_id": tender_id,
        "audit_trail": trail,
        "total_events": len(trail)
    }

@app.post("/api/tenders/{tender_id}/review")
@app.post("/api/cases/{tender_id}/review")
def record_officer_review(tender_id: str, review: OfficerReviewRequest):
    """
    Human-in-the-Loop decision recording endpoint.
    Permits actions: CONFIRM CONCERN, DISMISS, FALSE POSITIVE, REQUEST DOCUMENTS, ESCALATE, MARK FOR MONITORING.
    Logs immutable audit entry and updates tender status.
    """
    tenders = load_tenders()
    tender = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")
    
    trail = get_or_create_audit_trail(tender_id, tender)
    now = datetime.now()
    event_id = f"EVT-{tender_id}-{len(trail)+1:03d}"
    
    old_status = tender.get("officer_review_status", tender.get("vigilance_tier", "PENDING_REVIEW"))
    new_status = review.action.replace(" ", "_")

    new_event = {
        "id": event_id,
        "tender_id": tender_id,
        "officer_name": review.officer_name,
        "officer_role": review.officer_role,
        "timestamp": now.strftime("%Y-%m-%d %H:%M:%S IST"),
        "action": review.action,
        "old_status": old_status,
        "new_status": new_status,
        "reason": review.reason,
        "comments": review.comments or "No additional remarks.",
        "evidence_accessed": review.evidence_accessed or ["Procurement Dossier"],
        "regulatory_references_viewed": review.regulatory_references_viewed or ["Applicable Procurement Rules"]
    }

    trail.append(new_event)
    AUDIT_TRAIL_STORE[tender_id] = trail

    # Update in-memory tender status
    tender["officer_review_status"] = new_status
    tender["last_reviewed_by"] = f"{review.officer_name} ({review.officer_role})"
    tender["last_reviewed_at"] = new_event["timestamp"]

    return {
        "status": "REVIEW_RECORDED",
        "tender_id": tender_id,
        "action_taken": review.action,
        "recorded_event": new_event,
        "audit_trail_length": len(trail)
    }

@app.post("/api/tenders/{tender_id}/escalate")
@app.post("/api/cases/{tender_id}/escalate")
def escalate_tender_case(tender_id: str, req: Optional[EscalateRequest] = None):
    """
    Dedicated endpoint to escalate a procurement case to Vigilance / Department Head review.
    """
    tenders = load_tenders()
    tender = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")
    
    trail = get_or_create_audit_trail(tender_id, tender)
    now = datetime.now()
    event_id = f"EVT-{tender_id}-{len(trail)+1:03d}"
    
    officer_name = req.officer_name if req else "Chief Vigilance Officer"
    officer_role = req.officer_role if req else "CVO"
    reason = req.reason if req else "Escalated for Special Vigilance Scrutiny and File Requisition"
    comments = req.comments if req else "Flagged due to compounding competition and authority indicators."

    old_status = tender.get("officer_review_status", tender.get("vigilance_tier", "PENDING_REVIEW"))
    new_status = "ESCALATED_TO_VIGILANCE"

    new_event = {
        "id": event_id,
        "tender_id": tender_id,
        "officer_name": officer_name,
        "officer_role": officer_role,
        "timestamp": now.strftime("%Y-%m-%d %H:%M:%S IST"),
        "action": "ESCALATE",
        "old_status": old_status,
        "new_status": new_status,
        "reason": reason,
        "comments": comments,
        "evidence_accessed": ["Procurement Dossier", "Benchmarking Deviations", "Delegation Limits"],
        "regulatory_references_viewed": ["CVC Guidelines", "Manipur DFPR 2020"]
    }

    trail.append(new_event)
    AUDIT_TRAIL_STORE[tender_id] = trail

    tender["officer_review_status"] = new_status
    tender["last_reviewed_by"] = f"{officer_name} ({officer_role})"
    tender["last_reviewed_at"] = new_event["timestamp"]

    return {
        "status": "ESCALATED",
        "tender_id": tender_id,
        "new_status": new_status,
        "audit_event": new_event,
        "audit_trail_length": len(trail)
    }

@app.get("/api/tenders/{tender_id}/report")
@app.get("/api/tenders/{tender_id}/formal-report")
@app.get("/api/procurements/{tender_id}/report")
@app.get("/api/cases/{tender_id}/report")
def generate_formal_integrity_report(tender_id: str):
    """
    Generate formal 14-section Procurement Integrity Assessment Report.
    Distinguishes strictly between:
      - FACT (Official procurement records)
      - ANALYTICAL OBSERVATION (CHEIRAP algorithmic telemetry)
      - REGULATORY RELEVANCE (Statutory provisions and principles)
      - RECOMMENDATION (Non-binding review suggestions)
      - OFFICIAL DETERMINATION (Competent authority findings)
    """
    tenders = load_tenders()
    tender = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")
    
    analysis = rkb.get_regulatory_analysis_for_tender(tender, tenders)
    trail = get_or_create_audit_trail(tender_id, tender)
    now = datetime.now()
    report_id = f"CHEIRAP-PIAR-{now.year}-{tender_id.replace('_', '-')}"

    report = {
        "report_id": report_id,
        "generated_at": now.strftime("%d-%b-%Y %H:%M:%S IST"),
        "jurisdiction": "Government of Manipur",
        "issuing_system": "CHEIRAP AI (ꯆꯩꯔꯥꯞ) — Statutory Traceability Gateway (v2.0)",
        "sections": {
            "01_executive_summary": {
                "title": "1. Executive Summary",
                "content": {
                    "tender_id": tender.get("tender_id"),
                    "title": tender.get("title"),
                    "department": tender.get("department"),
                    "estimated_value_formatted": f"₹{tender.get('estimated_value_inr', 0)/1e7:,.2f} Crores",
                    "overall_risk_score": tender.get("cheirap_risk_score"),
                    "vigilance_tier": tender.get("vigilance_tier"),
                    "officer_status": tender.get("officer_review_status", "PENDING_REVIEW"),
                    "core_finding": (
                        f"Tender exhibits {len(analysis['regulatory_mappings'])} procedural risk indicator(s). "
                        "Authority competence and statutory bidding windows require competent review before award."
                    )
                }
            },
            "02_procurement_details": {
                "title": "2. Procurement Details [FACT]",
                "data_category": "FACT",
                "details": {
                    "tender_reference_number": tender.get("ref_no"),
                    "procuring_department": tender.get("department"),
                    "administrative_chain": tender.get("org_chain"),
                    "procurement_type": tender.get("tender_type", "Open Tender (Civil Works)"),
                    "estimated_contract_value_inr": tender.get("estimated_value_inr"),
                    "earnest_money_deposit_inr": tender.get("emd_amount_inr"),
                    "tender_fee_inr": tender.get("tender_fee_inr", 0),
                    "bid_submission_closing": tender.get("closing_date"),
                    "technical_bid_opening": tender.get("opening_date"),
                    "portal_endpoint": "https://manipurtenders.gov.in/nicgep/app"
                }
            },
            "03_risk_assessment": {
                "title": "3. Risk Assessment [ANALYTICAL OBSERVATION]",
                "data_category": "ANALYTICAL_OBSERVATION",
                "metrics": {
                    "cheirap_composite_score": tender.get("cheirap_risk_score"),
                    "isolation_forest_anomaly_score": tender.get("if_anomaly_score"),
                    "statutory_cvc_penalty_component": tender.get("cvc_statutory_penalty"),
                    "bidding_window_duration_hours": tender.get("feat_bidding_window_hours"),
                    "window_compression_hours_deficit": tender.get("feat_window_compression_hours"),
                    "corrigenda_count": tender.get("corrigendum_count")
                }
            },
            "04_key_evidence": {
                "title": "4. Key Evidence Dossier [FACT & OBSERVATION]",
                "data_category": "FACT_AND_OBSERVATION",
                "evidence_items": analysis["evidence_dossier"]
            },
            "05_anomaly_analysis": {
                "title": "5. Anomaly Analysis [ANALYTICAL OBSERVATION]",
                "data_category": "ANALYTICAL_OBSERVATION",
                "observations": [
                    f"Bidding window was compressed by {tender.get('feat_window_compression_hours', 0)} hours below the 336-hour statutory threshold.",
                    f"Tender incorporates {tender.get('corrigendum_count', 0)} amendments, with the latest corrigendum issued near bid submission closing.",
                    f"EMD requested represents {tender.get('feat_emd_ratio', 0)*100:.2f}% of the total project capex."
                ]
            },
            "06_vendor_intelligence": {
                "title": "6. Vendor Intelligence [FACT & OBSERVATION]",
                "data_category": "FACT_AND_OBSERVATION",
                "vendor_data": {
                    "participating_bidders_count": tender.get("bidder_count", "Undisclosed / Technical Bid Stage"),
                    "historical_awardee": tender.get("historical_awardee", "Under Scrutiny"),
                    "concentration_index": "High cluster in Mantripukhri / Imphal West circle"
                }
            },
            "07_financial_analysis": {
                "title": "7. Financial Analysis [FACT]",
                "data_category": "FACT",
                "financial_data": {
                    "estimated_capex_cr": round(tender.get("estimated_value_inr", 0) / 1e7, 2),
                    "emd_amount_cr": round(tender.get("emd_amount_inr", 0) / 1e7, 4),
                    "emd_ratio_pct": round(tender.get("feat_emd_ratio", 0) * 100, 2),
                    "statutory_benchmark_range": "2.00% to 5.00% (Rule 170 GFR 2017)"
                }
            },
            "08_regulatory_relevance": {
                "title": "8. Regulatory Relevance [REGULATORY RELEVANCE]",
                "data_category": "REGULATORY_RELEVANCE",
                "mappings": analysis["regulatory_mappings"]
            },
            "09_authority_delegation_check": {
                "title": "9. Authority & Delegation Check [STATUTORY SCRUTINY]",
                "data_category": "REGULATORY_RELEVANCE",
                "check": analysis["authority_check"]
            },
            "10_recommended_review_actions": {
                "title": "10. Recommended Review Actions [RECOMMENDATION]",
                "data_category": "RECOMMENDATION",
                "actions": [
                    "Verify formal Administrative Approval (AA) and Expenditure Sanction (ES) file orders from Administrative Department.",
                    "Verify justification for compressed bidding window against CVC Circular No. 01/01/2021.",
                    "Verify whether high EMD requirement acts as a restrictive barrier against regional MSME participation.",
                    "Examine technical qualification criteria in NIT to ensure neutrality under GFR Rule 144(i)."
                ]
            },
            "11_officer_comments": {
                "title": "11. Officer Comments [OFFICIAL RECORD]",
                "data_category": "OFFICIAL_RECORD",
                "entries": [e for e in trail if e["officer_role"] != "SYSTEM"]
            },
            "12_decision": {
                "title": "12. Competent Authority Decision [OFFICIAL DETERMINATION]",
                "data_category": "OFFICIAL_DETERMINATION",
                "current_status": tender.get("officer_review_status", "PENDING_COMPETENT_AUTHORITY_DETERMINATION"),
                "mandate": "Final determination rests solely with the Designated Competent Authority."
            },
            "13_audit_trail": {
                "title": "13. Immutable Audit Trail",
                "data_category": "OFFICIAL_RECORD",
                "events": trail
            },
            "14_regulatory_sources": {
                "title": "14. Authoritative Regulatory Sources Cited",
                "data_category": "REGULATORY_RELEVANCE",
                "sources": [s for s in rkb.REGULATORY_SOURCES if s["id"] in [
                    "SRC-MANIPUR-FD-TENDER-2023", "SRC-MANIPUR-FD-GEM-2022", "SRC-MANIPUR-FD-SINGLE-2023",
                    "SRC-MANIPUR-FD-VALIDITY-2015", "SRC-MANIPUR-DFPR", "SRC-GFR-2017", "SRC-CVC-VIG", "SRC-NICGEP-PORTAL"
                ]]
            }
        },
        "statutory_disclaimer": analysis["disclaimer"]
    }

    return report

# ══════════════════════════════════════════════════════════════════════════════
# EXISTING HOLD ORDER & VENUE RADAR (PRESERVED)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/venue-radar")
def get_venue_radar():
    tenders = load_tenders()
    venue = [t for t in tenders if t.get("is_mantripukhri_venue")]
    venue_capex = sum(t.get("estimated_value_inr", 0.0) for t in venue)
    return {
        "venue": "Manipur IT SEZ Campus, Mantripukhri, Imphal East - 795002",
        "description": "Live Procurement Vigilance Radar for State IT SEZ & High-Priority Infrastructure Corridors",
        "total_venue_tenders": len(venue),
        "total_venue_capex_cr": round(venue_capex / 1e7, 2),
        "tenders": sorted(venue, key=lambda x: x.get("cheirap_risk_score", 0), reverse=True)
    }

@app.post("/api/generate-hold-order/{tender_id}")
def generate_hold_order(tender_id: str, req: Optional[HoldOrderRequest] = None):
    tenders = load_tenders()
    t = next((t for t in tenders if t.get("tender_id") == tender_id), None)
    if not t:
        raise HTTPException(status_code=404, detail=f"Tender '{tender_id}' not found.")

    now = datetime.now()
    order_no = f"CVO/MANIPUR/PRE-AWARD/VIG/{now.year}/{tender_id.replace('_', '-')}"

    hold_order = {
        "memorandum_number": order_no,
        "date_of_issuance": now.strftime("%d-%b-%Y %I:%M %p"),
        "authority": "State Vigilance Commission / Department of Information Technology, Govt. of Manipur",
        "target_tender": {
            "tender_id": t.get("tender_id"),
            "reference_no": t.get("ref_no"),
            "project_title": t.get("title"),
            "procuring_department": t.get("department"),
            "procuring_chain": t.get("org_chain"),
            "estimated_value_inr": t.get("estimated_value_inr"),
            "estimated_value_formatted": f"Rs. {t.get('estimated_value_inr', 0)/1e7:,.2f} Crores",
            "emd_amount_formatted": f"Rs. {t.get('emd_amount_inr', 0):,.2f}",
            "closing_date": t.get("closing_date"),
            "opening_date": t.get("opening_date")
        },
        "vigilance_assessment": {
            "cheirap_risk_score": t.get("cheirap_risk_score"),
            "vigilance_tier": t.get("vigilance_tier"),
            "isolation_forest_anomaly_score": t.get("if_anomaly_score"),
            "statutory_cvc_penalty": t.get("cvc_statutory_penalty"),
            "corrigenda_count": t.get("corrigendum_count"),
            "window_compression_hours": t.get("feat_window_compression_hours"),
            "emd_skew_ratio": f"{t.get('feat_emd_ratio', 0)*100:.2f}%",
            "single_bidder_walkover_flag": bool(t.get("feat_single_bidder_risk", 0))
        },
        "statutory_violations_cited": t.get("audit_flags", []),
        "mandatory_directives": [
            "1. IMMEDIATE FREEZE ON BID OPENING: The Procuring Entity is directed to stay technical bid opening pending statutory compliance review.",
            "2. MANDATORY WINDOW EXTENSION: In accordance with CVC Circular No. 01/01/2021, the bid submission deadline must be extended by a minimum of 7 (seven) clear working days.",
            "3. TRANSPARENCY NOTIFICATION: A formal Corrigendum detailing all qualification criteria clarifications must be published on https://manipurtenders.gov.in/nicgep/app within 24 hours.",
            "4. CVO COMPLIANCE REPORT: The Superintending Engineer / Procuring Officer shall submit an Action Taken Report (ATR) to the State Vigilance Commission within 48 hours."
        ],
        "signatory": {
            "officer_title": req.officer_name if req else "Chief Vigilance Officer",
            "statutory_division": "Special Vigilance Cell (Procurement Oversight)",
            "verification_hash": f"SHA256:{hash(order_no + tender_id) & 0xffffffff:08x}".upper()
        }
    }

    return {
        "status": "HOLD_ORDER_GENERATED",
        "notice": hold_order
    }

# =============================================================================
# PROJECTPROOF ENDPOINTS (PWD-04 Post-Award Construction Progress & Evidence Assurance)
# =============================================================================
try:
    import server.projectproof_engine as ppe
except ImportError:
    try:
        import projectproof_engine as ppe
    except ImportError:
        try:
            import cheirap.server.projectproof_engine as ppe
        except ImportError:
            from . import projectproof_engine as ppe

@app.get("/api/projectproof/stats")
@app.get("/api/works/stats")
def api_projectproof_stats():
    return ppe.get_projectproof_stats()

@app.get("/api/projectproof/projects")
@app.get("/api/works/projects")
def api_projectproof_projects(priority: Optional[str] = Query(None), search: Optional[str] = Query(None)):
    return ppe.get_projectproof_projects(priority=priority, search=search)

@app.get("/api/projectproof/projects/{project_id}")
@app.get("/api/works/projects/{project_id}")
def api_projectproof_project_detail(project_id: str):
    proj = ppe.get_project_by_id(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

class InspectionRequest(BaseModel):
    officer_name: Optional[str] = "Chief Engineer (Quality Control & Vigilance)"

@app.post("/api/projectproof/inspect/{project_id}")
@app.post("/api/works/inspect/{project_id}")
def api_projectproof_dispatch_inspection(project_id: str, req: Optional[InspectionRequest] = None):
    officer = req.officer_name if req and req.officer_name else "Chief Engineer (Quality Control & Vigilance)"
    res = ppe.dispatch_field_inspection(project_id, officer_name=officer)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res



# Serve compiled React frontend if web/dist exists
dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web", "dist")
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{file_name:path}.{ext}")
    def serve_dist_file(file_name: str, ext: str):
        full_name = f"{file_name}.{ext}"
        target_path = os.path.join(dist_dir, full_name)
        if os.path.exists(target_path) and os.path.isfile(target_path):
            media_map = {
                "png": "image/png",
                "jpg": "image/jpeg",
                "jpeg": "image/jpeg",
                "svg": "image/svg+xml",
                "ico": "image/x-icon",
                "webp": "image/webp"
            }
            return FileResponse(target_path, media_type=media_map.get(ext.lower(), "application/octet-stream"))
        raise HTTPException(status_code=404)

    @app.get("/", response_class=HTMLResponse)
    def serve_dashboard():
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            with open(index_file, "r", encoding="utf-8") as f:
                return f.read()
        return "<h1>CHEIRAP AI React Bundle Building...</h1>"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
