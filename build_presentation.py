import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def create_presentation():
    input_path = r"C:\Users\singh\Downloads\hack for social clause\Template_HSC_Presentation_v7.0-1.pptx"
    output_download = r"C:\Users\singh\Downloads\hack for social clause\Manipur_TeamLotux_Presentation.pptx"
    output_local = r"c:\Users\singh\.gemini\antigravity-ide\scratch\cheirap\Manipur_TeamLotux_Presentation.pptx"

    prs = Presentation(input_path)
    print(f"Initial slide count: {len(prs.slides)}")

    NAVY = RGBColor(21, 51, 91)
    GOLD = RGBColor(200, 130, 40)
    DARK = RGBColor(30, 41, 59)
    GRAY = RGBColor(100, 116, 139)

    # -------------------------------------------------------------
    # SLIDE 1 (Index 1): COVER PAGE
    # -------------------------------------------------------------
    slide1 = prs.slides[1]
    
    # Update Cover Title
    for shape in slide1.shapes:
        if shape.name == "object 4" and shape.has_text_frame:
            shape.text_frame.clear()
            p = shape.text_frame.paragraphs[0]
            p.text = "CHEIRAP (ꯆꯩꯔꯥꯞ)"
            p.font.name = "Aptos"
            p.font.size = Pt(28)
            p.font.bold = True
            p.font.color.rgb = NAVY
            p.alignment = PP_ALIGN.CENTER

    # Update Cover Metadata (object 5)
    for shape in slide1.shapes:
        if shape.name == "object 5" and shape.has_text_frame:
            # Expand width and position cleanly
            shape.left = Inches(0.8)
            shape.top = Inches(1.5)
            shape.width = Inches(5.8)
            shape.height = Inches(4.8)
            
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            items = [
                ("Project Title", "CHEIRAP: Public Procurement Transparency & Civic Vigilance Platform for Manipur"),
                ("Thematic Area", "Theme 4: Governance & Civic Technology\n(Cross-impact: Theme 7 AI & Theme 6 Digital Inclusion)"),
                ("Team Name", "Lotux"),
                ("Team ID", "HSC|MN|00019"),
                ("State / Region", "Manipur (Northeast Region)"),
                ("Institution", "Manipur Technical University (MTU), Imphal\n(State Public University | AISHE: U-0881)"),
                ("Team Members", "1. Yumnam Adit Singh (CSE 2nd Yr | ID: 2501CS0119)\n2. Waikhom Preety Devi (CSE 2nd Yr | ID: 2501CS0117)"),
            ]

            for idx, (label, val) in enumerate(items):
                p = tf.add_paragraph() if idx > 0 else tf.paragraphs[0]
                p.space_after = Pt(8)
                p.space_before = Pt(2)
                
                run_lbl = p.add_run()
                run_lbl.text = f"{label}: "
                run_lbl.font.bold = True
                run_lbl.font.size = Pt(13)
                run_lbl.font.name = "Aptos"
                run_lbl.font.color.rgb = NAVY

                run_val = p.add_run()
                run_val.text = val
                run_val.font.bold = False
                run_val.font.size = Pt(12)
                run_val.font.name = "Aptos"
                run_val.font.color.rgb = DARK

    # Add Landing Hero Screenshot on Right of Cover
    hero_img = r"assets\screenshots\00_landing_hero.png"
    if os.path.exists(hero_img):
        slide1.shapes.add_picture(hero_img, Inches(6.8), Inches(1.6), Inches(5.0), Inches(4.5))

    # Helper function to style team ribbon
    def set_team_ribbon(slide):
        for shape in slide.shapes:
            if shape.name == "object 10" and shape.has_text_frame:
                shape.text_frame.clear()
                p = shape.text_frame.paragraphs[0]
                p.text = "Team Lotux"
                p.font.name = "Aptos"
                p.font.size = Pt(12)
                p.font.bold = True
                p.font.color.rgb = RGBColor(255, 255, 255)
                p.alignment = PP_ALIGN.CENTER

    # -------------------------------------------------------------
    # SLIDE 2 (Index 2): PROBLEM & PROPOSED SOLUTION
    # -------------------------------------------------------------
    slide2 = prs.slides[2]
    set_team_ribbon(slide2)

    for shape in slide2.shapes:
        if shape.name == "object 3" and shape.has_text_frame:
            shape.left = Inches(0.8)
            shape.top = Inches(1.5)
            shape.width = Inches(5.8)
            shape.height = Inches(4.8)
            
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            def add_header(title):
                p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
                p.text = title
                p.font.bold = True
                p.font.size = Pt(14)
                p.font.name = "Aptos"
                p.font.color.rgb = NAVY
                p.space_before = Pt(6)
                p.space_after = Pt(4)

            def add_bullet(lead, text):
                p = tf.add_paragraph()
                p.space_after = Pt(4)
                p.level = 0
                r1 = p.add_run()
                r1.text = f"• {lead}: "
                r1.font.bold = True
                r1.font.size = Pt(11)
                r1.font.name = "Aptos"
                r1.font.color.rgb = DARK

                r2 = p.add_run()
                r2.text = text
                r2.font.bold = False
                r2.font.size = Pt(11)
                r2.font.name = "Aptos"
                r2.font.color.rgb = DARK

            add_header("Core Problem in Manipur Public Procurement")
            add_bullet("Capital Outlay", "Procurement accounts for 20-25% of Manipur's GDP funding critical roads, schools, and hospitals.")
            add_bullet("Information Asymmetry", "Tenders on manipurtenders.gov.in are buried in 80+ page legal dockets and opaque PDF schedules.")
            add_bullet("Window Compression", "Corrigenda issued close to deadlines compress bidding to narrow windows under 72 hours, excluding honest bidders.")
            add_bullet("Linguistic Exclusion", "Zero citizen access in the constitutional Meetei Mayek script alongside English.")

            add_header("Proposed Solution: CHEIRAP")
            add_bullet("Plain-Language Briefs", "Converts 80-page tenders into 4 clear citizen anchors: Who, What, Where, and Budget.")
            add_bullet("Notice Flow Stepper", "4-stage milestone tracker highlighting compressed bidding windows (GFR Rule 161 / CVC).")
            add_bullet("Bilingual Accessibility", "Native Meetei Mayek script (ꯆꯩꯔꯥꯞ) rendering alongside English for true grassroots inclusion.")
            add_bullet("Citizen Action / RTI", "One-click evidence-cited inquiry letters with direct official portal verification.")

    # Add Executive Brief Screenshot on Right
    brief_img = r"assets\screenshots\02_tender_executive_brief.png"
    if os.path.exists(brief_img):
        slide2.shapes.add_picture(brief_img, Inches(6.8), Inches(1.5), Inches(5.0), Inches(4.8))

    # -------------------------------------------------------------
    # SLIDE 3 (Index 3): TECHNICAL APPROACH
    # -------------------------------------------------------------
    slide3 = prs.slides[3]
    set_team_ribbon(slide3)

    for shape in slide3.shapes:
        if shape.name == "object 3" and shape.has_text_frame:
            shape.left = Inches(0.8)
            shape.top = Inches(1.5)
            shape.width = Inches(5.8)
            shape.height = Inches(4.8)
            
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            def add_header(title):
                p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
                p.text = title
                p.font.bold = True
                p.font.size = Pt(14)
                p.font.name = "Aptos"
                p.font.color.rgb = NAVY
                p.space_before = Pt(6)
                p.space_after = Pt(4)

            def add_bullet(lead, text):
                p = tf.add_paragraph()
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = f"• {lead}: "
                r1.font.bold = True
                r1.font.size = Pt(11)
                r1.font.name = "Aptos"
                r1.font.color.rgb = DARK

                r2 = p.add_run()
                r2.text = text
                r2.font.bold = False
                r2.font.size = Pt(11)
                r2.font.name = "Aptos"
                r2.font.color.rgb = DARK

            add_header("System Architecture & Tech Stack")
            add_bullet("Frontend Architecture", "React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, GSAP for accessible motion.")
            add_bullet("Backend API Services", "FastAPI, Python 3.12, Uvicorn, Pydantic schemas, REST endpoints (/api/tenders).")
            add_bullet("Local-First Privacy", "100% browser-based storage (localStorage) for bookmarks, notes, and inquiries. Zero citizen tracking.")

            add_header("Methodology & Implementation Pipeline")
            add_bullet("Data Ingestion", "Parses multi-table GePNIC portal notices across 32 standardized procurement attributes.")
            add_bullet("Vigilance Rule Engine", "Evaluates GFR 2017 Rule 161 thresholds and CVC Circular 01/01/2021 window rules.")
            add_bullet("Code & Deliverables", "GitHub: https://github.com/haapuchu/cheirap/ | 92 Scored Snapshots | Runnable Unit Tests.")
            add_bullet("Deterministic Rule Verification", "Strict rule-based evaluation mapped directly to GFR 2017 and CVC statutory standards.")

    # Add Timeline Stepper Screenshot on Right
    stepper_img = r"assets\screenshots\03_visual_timeline_stepper.png"
    if os.path.exists(stepper_img):
        slide3.shapes.add_picture(stepper_img, Inches(6.8), Inches(1.6), Inches(5.0), Inches(4.6))

    # -------------------------------------------------------------
    # SLIDE 4 (Index 4): IMPACT POTENTIAL
    # -------------------------------------------------------------
    slide4 = prs.slides[4]
    set_team_ribbon(slide4)

    for shape in slide4.shapes:
        if shape.name == "object 3" and shape.has_text_frame:
            shape.left = Inches(0.8)
            shape.top = Inches(1.5)
            shape.width = Inches(5.8)
            shape.height = Inches(4.8)
            
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            def add_header(title):
                p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
                p.text = title
                p.font.bold = True
                p.font.size = Pt(14)
                p.font.name = "Aptos"
                p.font.color.rgb = NAVY
                p.space_before = Pt(6)
                p.space_after = Pt(4)

            def add_bullet(lead, text):
                p = tf.add_paragraph()
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = f"• {lead}: "
                r1.font.bold = True
                r1.font.size = Pt(11)
                r1.font.name = "Aptos"
                r1.font.color.rgb = DARK

                r2 = p.add_run()
                r2.text = text
                r2.font.bold = False
                r2.font.size = Pt(11)
                r2.font.name = "Aptos"
                r2.font.color.rgb = DARK

            add_header("Target Beneficiaries")
            add_bullet("Citizens & Youth Leaders", "Real-time visibility into local public works (schools, roads, water supply, health clinics).")
            add_bullet("Local MSME Contractors", "Fair, early notification of tender opportunities without exclusion by late corrigenda.")
            add_bullet("Journalists & CSOs", "Instant, verified data points for evidence-grounded investigative reporting and RTI filings.")

            add_header("Measurable Socio-Economic Outcomes (KPIs)")
            add_bullet("Bidding Fairness", "Increases competitive bidder turnout and eliminates uncompetitive single-bidder walkovers.")
            add_bullet("Taxpayer Value", "Fair competition delivers better infrastructure at optimal public expenditure.")
            add_bullet("Time Efficiency", "Reduces document review time from 2+ hours (dense legal PDF) to under 90 seconds.")

            add_header("UN Sustainable Development Goals (SDGs)")
            add_bullet("SDG 16.6 & 16.10", "Transparent, accountable public institutions & universal public access to information.")
            add_bullet("SDG 9.1", "Quality, resilient, and sustainable public infrastructure development.")

    # Add Peer Comparison Screenshot on Right
    peer_img = r"assets\screenshots\04_peer_comparison_benchmark.png"
    if os.path.exists(peer_img):
        slide4.shapes.add_picture(peer_img, Inches(6.8), Inches(1.6), Inches(5.0), Inches(4.6))

    # -------------------------------------------------------------
    # SLIDE 5 (Index 5): FEASIBILITY & RISK ANALYSIS
    # -------------------------------------------------------------
    slide5 = prs.slides[5]
    set_team_ribbon(slide5)

    for shape in slide5.shapes:
        if shape.name == "object 3" and shape.has_text_frame:
            shape.left = Inches(0.8)
            shape.top = Inches(1.5)
            shape.width = Inches(5.8)
            shape.height = Inches(4.8)
            
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            def add_header(title):
                p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
                p.text = title
                p.font.bold = True
                p.font.size = Pt(14)
                p.font.name = "Aptos"
                p.font.color.rgb = NAVY
                p.space_before = Pt(6)
                p.space_after = Pt(4)

            def add_bullet(lead, text):
                p = tf.add_paragraph()
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = f"• {lead}: "
                r1.font.bold = True
                r1.font.size = Pt(11)
                r1.font.name = "Aptos"
                r1.font.color.rgb = DARK

                r2 = p.add_run()
                r2.text = text
                r2.font.bold = False
                r2.font.size = Pt(11)
                r2.font.name = "Aptos"
                r2.font.color.rgb = DARK

            add_header("Technical & Operational Feasibility")
            add_bullet("Zero Infrastructure Cost", "Built on static client assets and lightweight REST APIs; can run on standard edge or free-tier cloud.")
            add_bullet("Sub-100ms Response", "Pre-indexed client database ensures rapid search across all 92 tenders even on low-spec devices.")
            add_bullet("Universal Browser Support", "Fully functional on smartphones, tablets, and desktops without requiring app installation.")

            add_header("Key Challenges & Risks")
            add_bullet("Portal Variations", "Changes to official GePNIC HTML/table layouts across portal updates.")
            add_bullet("Legal & Neutrality Risks", "Risk of citizens misinterpreting vigilance review signals as judicial accusations.")
            add_bullet("Hill District Connectivity", "Intermittent internet connectivity across remote border districts in Manipur.")

            add_header("Risk Mitigation Strategies")
            add_bullet("Adapter Architecture", "Modular scraper adapters isolate DOM changes without touching core scoring logic.")
            add_bullet("Strict Legal Neutrality", "All signals are framed as non-accusatory review pointers linking to official sources.")
            add_bullet("Offline-First PWA", "Client-side caching ensures tender briefs remain readable even during network blackouts.")

    # Add Citizen Inquiry Drafter Screenshot on Right
    inquiry_img = r"assets\screenshots\05_citizen_inquiry_drafter.png"
    if os.path.exists(inquiry_img):
        slide5.shapes.add_picture(inquiry_img, Inches(6.8), Inches(1.6), Inches(5.0), Inches(4.6))

    # -------------------------------------------------------------
    # SLIDE 6 (Index 6): TEAM & IMPLEMENTATION ROADMAP
    # -------------------------------------------------------------
    slide6 = prs.slides[6]
    set_team_ribbon(slide6)

    for shape in slide6.shapes:
        if shape.name == "object 3" and shape.has_text_frame:
            shape.left = Inches(0.8)
            shape.top = Inches(1.5)
            shape.width = Inches(10.5)
            shape.height = Inches(4.8)
            
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            def add_header(title):
                p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
                p.text = title
                p.font.bold = True
                p.font.size = Pt(14)
                p.font.name = "Aptos"
                p.font.color.rgb = NAVY
                p.space_before = Pt(6)
                p.space_after = Pt(4)

            def add_bullet(lead, text):
                p = tf.add_paragraph()
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = f"• {lead}: "
                r1.font.bold = True
                r1.font.size = Pt(11)
                r1.font.name = "Aptos"
                r1.font.color.rgb = DARK

                r2 = p.add_run()
                r2.text = text
                r2.font.bold = False
                r2.font.size = Pt(11)
                r2.font.name = "Aptos"
                r2.font.color.rgb = DARK

            add_header("Team Composition & Academic Details")
            add_bullet("Yumnam Adit Singh", "Manipur Technical University, CSE 2nd Year (Student ID: 2501CS0119)")
            add_bullet("Waikhom Preety Devi", "Manipur Technical University, CSE 2nd Year (Student ID: 2501CS0117)")
            add_bullet("Institution", "Manipur Technical University (MTU), Imphal (State Public University | AISHE: U-0881)")
            add_bullet("Registration Details", "Team ID: HSC|MN|00019 | State: Manipur | Track: Theme 4 Governance & Civic Technology")

            add_header("Key Challenges Overcome During Hackathon")
            add_bullet("Data Standardization", "Normalized chaotic dates, EMD formulas, and multi-round corrigenda across 92 legacy GePNIC records.")
            add_bullet("Legal Grounding", "Formulated a transparent 0-100 risk score strictly mapped to CVC orders without subjective speculation.")

            add_header("Implementation Roadmap & Scalability")
            add_bullet("Phase 1 (Months 1-3)", "Northeast Federation: Expand GePNIC connectors to Assam, Meghalaya, Tripura, Mizoram, Nagaland.")
            add_bullet("Phase 2 (Months 4-8)", "Pan-India 28-State Rollout: Custom adapters for state e-procurement portals (Karnataka, Maharashtra, UP).")
            add_bullet("Phase 3 (Months 9-12)", "22 Schedule VIII Languages: Extend plain-language translations to Gram Panchayats and Village Councils.")
            add_bullet("Phase 4 (Months 13-18)", "Grassroots Alerts: WhatsApp/SMS push notifications for verified community leaders when tenders are modified.")

    # -------------------------------------------------------------
    # SLIDE 7 (Index 7): REFERENCES
    # -------------------------------------------------------------
    slide7 = prs.slides[7]
    set_team_ribbon(slide7)

    for shape in slide7.shapes:
        if shape.name == "object 3" and shape.has_text_frame:
            shape.left = Inches(0.8)
            shape.top = Inches(1.5)
            shape.width = Inches(10.5)
            shape.height = Inches(4.8)
            
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            def add_header(title):
                p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
                p.text = title
                p.font.bold = True
                p.font.size = Pt(14)
                p.font.name = "Aptos"
                p.font.color.rgb = NAVY
                p.space_before = Pt(6)
                p.space_after = Pt(4)

            def add_bullet(lead, text):
                p = tf.add_paragraph()
                p.space_after = Pt(5)
                r1 = p.add_run()
                r1.text = f"• {lead}: "
                r1.font.bold = True
                r1.font.size = Pt(11)
                r1.font.name = "Aptos"
                r1.font.color.rgb = DARK

                r2 = p.add_run()
                r2.text = text
                r2.font.bold = False
                r2.font.size = Pt(11)
                r2.font.name = "Aptos"
                r2.font.color.rgb = DARK

            add_header("Statutory & Regulatory Frameworks")
            add_bullet("Ministry of Finance, GoI", "General Financial Rules (GFR 2017) - Rule 144 (Fundamental Principles of Public Buying), Rule 161 (Bidding Timelines).")
            add_bullet("Central Vigilance Commission (CVC)", "Office Order No. 01/01/2021: Procedural Guidelines on Pre-Award Timeline Extensions and Corrigenda.")
            add_bullet("Government of Manipur", "Delegation of Financial Powers Rules (DFPR 2020) and State Procurement Manual.")

            add_header("Official Portals & Public Sources")
            add_bullet("National Informatics Centre (NIC)", "Government e-Procurement System of Manipur: https://manipurtenders.gov.in/")
            add_bullet("Constitution of India", "Eighth Schedule - Official recognition and standards for Manipuri in Meetei Mayek script.")

            add_header("Open Source Repository & Deliverables")
            add_bullet("Code Repository", "GitHub: https://github.com/haapuchu/cheirap/ (Full source code, API, tests, and documentation).")
            add_bullet("Sample Data & Verification", "92 Scored Manipur Tender Snapshots at web/src/data/tenders_scored.json.")
            add_bullet("Automated Test Suite", "tests/test_tenders_api.py (Schema validation, regulatory score bounds, and API health checks).")

    # -------------------------------------------------------------
    # DELETE SLIDE 0 (Instructions Slide) as mandated by guidelines
    # -------------------------------------------------------------
    print("Deleting Slide 0 (instruction slide)...")
    rId = prs.slides._sldIdLst[0].rId
    prs.part.drop_rel(rId)
    del prs.slides._sldIdLst[0]

    print(f"Final slide count: {len(prs.slides)} (Mandated 7 slides)")

    # Save to Downloads directory
    prs.save(output_download)
    print(f"Saved final presentation to: {output_download}")

    # Save to local workspace
    prs.save(output_local)
    print(f"Saved local copy to: {output_local}")

if __name__ == "__main__":
    create_presentation()
