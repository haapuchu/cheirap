import os
import sys
import base64
import shutil
from playwright.sync_api import sync_playwright

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

def load_b64(path):
    if os.path.exists(path):
        with open(path, 'rb') as f:
            ext = os.path.splitext(path)[1].lower().replace('.', '')
            mime = "image/png" if ext == "png" else "image/jpeg"
            return f"data:{mime};base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return ""

def generate_script_pdf():
    print("================================================================================")
    print("CHEIRAP AI & PROJECTPROOF: COMPILING UNIFIED GRAND JURY SCRIPT & ACQUISITION DOSSIER")
    print("================================================================================")

    emblem_b64 = load_b64("web/public/manipur_emblem_badge.png")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CHEIRAP AI (ꯆꯩꯔꯥꯞ) & PROJECTPROOF — Grand Jury Pitch Script & Acquisition Proposal</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+Meetei+Mayek:wght@400;600;700&display=swap');

  @page {{
    size: A4 portrait;
    margin: 11mm 11mm 13mm 11mm;
    @bottom-left {{
      content: "CHEIRAP AI (ꯆꯩꯔꯥꯞ) & PROJECTPROOF • PWD-04 & Pre-Award Unified Suite • Govt of Manipur";
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      color: #64748b;
    }}
    @bottom-right {{
      content: "Page " counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      font-weight: 700;
      color: #002244;
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    line-height: 1.48;
    font-size: 8.6pt;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }}

  .font-meetei {{
    font-family: 'Noto Sans Meetei Mayek', 'Inter', sans-serif;
  }}

  .font-mono {{
    font-family: 'JetBrains Mono', monospace;
  }}

  /* Top Masthead */
  .doc-masthead {{
    background: linear-gradient(135deg, #001f3f 0%, #002b55 50%, #001529 100%);
    border: 2px solid #D4AF37;
    border-radius: 8px;
    padding: 12px 16px;
    color: #ffffff;
    margin-bottom: 10px;
    box-shadow: 0 4px 14px rgba(0, 31, 63, 0.15);
  }}

  .masthead-inner {{
    display: flex;
    align-items: center;
    gap: 14px;
  }}

  .emblem-img {{
    width: 54px;
    height: 54px;
    object-fit: contain;
    background: rgba(255, 255, 255, 0.12);
    padding: 4px;
    border-radius: 50%;
    border: 1.5px solid #D4AF37;
    flex-shrink: 0;
  }}

  .masthead-dept {{
    font-size: 7.6pt;
    color: #D4AF37;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }}

  .masthead-title {{
    font-size: 14pt;
    font-weight: 900;
    color: #ffffff;
    margin: 2px 0;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }}

  .masthead-sub {{
    font-size: 8pt;
    color: #cbd5e1;
    font-weight: 500;
  }}

  /* Trilateral Jury Strategy Ribbon */
  .jury-matrix-ribbon {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 7px;
    margin-bottom: 10px;
  }}

  .jury-target-card {{
    border-radius: 6px;
    padding: 6px 9px;
    font-size: 7.6pt;
    border: 1px solid #cbd5e1;
  }}

  .jury-gov {{
    background-color: #f0f7ff;
    border-left: 3.5px solid #003366;
  }}
  .jury-gov .target-role {{ color: #003366; font-weight: 800; }}

  .jury-acad {{
    background-color: #f0fdf4;
    border-left: 3.5px solid #0f766e;
  }}
  .jury-acad .target-role {{ color: #0f766e; font-weight: 800; }}

  .jury-tech {{
    background-color: #faf5ff;
    border-left: 3.5px solid #6b21a8;
  }}
  .jury-tech .target-role {{ color: #6b21a8; font-weight: 800; }}

  .target-title {{
    font-size: 7.4pt;
    font-weight: 800;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
  }}

  .target-focus {{
    color: #334155;
    line-height: 1.35;
  }}

  /* Meta Strip */
  .meta-strip {{
    display: flex;
    justify-content: space-between;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 7.6pt;
    color: #475569;
    margin-bottom: 10px;
  }}

  .meta-item strong {{
    color: #002244;
  }}

  /* Act Sections */
  .section-block {{
    margin-bottom: 10px;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  .section-header {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f1f5f9;
    border-left: 4px solid #002244;
    padding: 4px 8px;
    border-radius: 0 5px 5px 0;
    margin-bottom: 5px;
  }}

  .section-title {{
    font-size: 8.8pt;
    font-weight: 800;
    color: #002244;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 5px;
  }}

  .section-time {{
    font-size: 7.2pt;
    font-weight: 700;
    color: #002244;
    background: #ffffff;
    padding: 1.5px 6px;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
    font-family: 'JetBrains Mono', monospace;
  }}

  /* Badges */
  .stakeholder-badge {{
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1.5px 5px;
    border-radius: 4px;
    font-size: 6.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-right: 4px;
  }}

  .badge-gov {{ background: #002244; color: #ffffff; }}
  .badge-acad {{ background: #0f766e; color: #ffffff; }}
  .badge-tech {{ background: #4338ca; color: #ffffff; }}
  .badge-all {{ background: #b45309; color: #ffffff; }}
  .badge-pwd {{ background: #c2410c; color: #ffffff; }}

  /* Stage Action Box */
  .stage-action {{
    background-color: #fffbeb;
    border: 1px solid #fde68a;
    border-left: 3.5px solid #d97706;
    color: #92400e;
    font-size: 7.6pt;
    font-weight: 600;
    padding: 3.5px 8px;
    border-radius: 0 5px 5px 0;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }}

  .stage-action::before {{
    content: "▶ STAGE ACTION:";
    font-weight: 800;
    font-size: 7pt;
    letter-spacing: 0.04em;
    color: #b45309;
  }}

  /* Speech Box */
  .speech-box {{
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-left: 3.5px solid #0284c7;
    border-radius: 6px;
    padding: 7px 11px;
    margin-bottom: 5px;
    font-size: 8.4pt;
    line-height: 1.45;
    color: #0f172a;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }}

  .speech-box p {{
    margin: 0 0 5px 0;
  }}

  .speech-box p:last-child {{
    margin-bottom: 0;
  }}

  .speech-box ul, .speech-box ol {{
    margin: 3px 0 5px 18px;
    padding: 0;
  }}

  .speech-box li {{
    margin-bottom: 2px;
  }}

  .cue {{
    color: #b45309;
    font-style: italic;
    font-weight: 700;
    font-size: 7.8pt;
  }}

  /* Acquisition Hook */
  .acquisition-hook {{
    background-color: #eff6ff;
    border: 1px dashed #93c5fd;
    border-radius: 5px;
    padding: 4px 8px;
    font-size: 7.6pt;
    color: #1e40af;
    display: flex;
    align-items: center;
    gap: 6px;
  }}

  /* Tender & Project Cards */
  .tender-card {{
    border-radius: 6px;
    padding: 5px 9px;
    margin-bottom: 5px;
    font-size: 7.6pt;
  }}

  .tender-green {{
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-left: 3.5px solid #16a34a;
  }}

  .tender-red {{
    background-color: #fef2f2;
    border: 1px solid #fca5a5;
    border-left: 3.5px solid #dc2626;
  }}

  .tender-amber {{
    background-color: #fffbeb;
    border: 1px solid #fde68a;
    border-left: 3.5px solid #d97706;
  }}

  .pill {{
    display: inline-block;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 7pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }}

  .pill-green {{ background: #16a34a; color: #ffffff; }}
  .pill-red {{ background: #dc2626; color: #ffffff; }}
  .pill-gold {{ background: #d97706; color: #ffffff; }}

  /* Tables */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 6px 0 8px 0;
    font-size: 7.6pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  th {{
    background-color: #002244;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 4.5px 6px;
    border: 1px solid #001f3f;
    text-transform: uppercase;
    font-size: 6.8pt;
    letter-spacing: 0.03em;
  }}

  td {{
    padding: 4px 6px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }}

  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}

  /* Q&A Cards */
  .qa-card {{
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    padding: 6px 9px;
    margin-bottom: 5px;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  .qa-target {{
    font-size: 6.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
  }}

  .qa-q {{
    font-weight: 800;
    color: #991b1b;
    font-size: 8pt;
    margin-bottom: 2px;
  }}

  .qa-a {{
    color: #1e293b;
    font-size: 7.9pt;
    line-height: 1.4;
  }}

  .qa-a strong {{
    color: #002244;
  }}

  .page-break {{
    page-break-before: always;
    break-before: page;
  }}
</style>
</head>
<body>

<!-- Masthead -->
<div class="doc-masthead">
  <div class="masthead-inner">
    {f'<img src="{emblem_b64}" class="emblem-img" alt="State Emblem" />' if emblem_b64 else ''}
    <div>
      <div class="masthead-dept">Government of Manipur • Department of IT & Public Works Department (PWD)</div>
      <h1 class="masthead-title">CHEIRAP AI (<span class="font-meetei">ꯆꯩꯔꯥꯞ</span>) & PROJECTPROOF SUITE</h1>
      <div class="masthead-sub">Unified Pre-Award Procurement Radar & Post-Award Infrastructure Assurance (PWD-04) • Grand Jury Pitch Script</div>
    </div>
  </div>
</div>

<!-- Trilateral Jury Strategy Ribbon -->
<div class="jury-matrix-ribbon">
  <div class="jury-target-card jury-gov">
    <div class="target-title">🏛️ <span class="target-role">OFFICIAL DEPT NOMINEE (30%)</span></div>
    <div class="target-focus"><strong>Core Focus:</strong> PWD-04 direct solution, Darpan MIS integration, PWD Form 44 notices, Section 38 e-Office stays, GFR/DFPR compliance.</div>
  </div>
  <div class="jury-target-card jury-acad">
    <div class="target-title">🔬 <span class="target-role">ACADEMIC & RESEARCH LEAD (35%)</span></div>
    <div class="target-focus"><strong>Core Focus:</strong> Deterministic automata + 4-vector multi-modal triangulation (GPS delta, 64-bit pHash, velocity curve, Benford's Law). 0% hallucination.</div>
  </div>
  <div class="jury-target-card jury-tech">
    <div class="target-title">💻 <span class="target-role">TECH COMPANIES' LEAD (35%)</span></div>
    <div class="target-focus"><strong>Core Focus:</strong> FastAPI/Redis microservices, sub-85ms latency, non-invasive API integration, $500B TAM across 28 states. Ready to acquire.</div>
  </div>
</div>

<!-- Meta Strip -->
<div class="meta-strip">
  <div class="meta-item"><strong>Target Timing:</strong> 4 Minutes 30 Seconds (+ Q&A)</div>
  <div class="meta-item"><strong>Pre-Award Radar:</strong> 91 Live Tenders • ₹1,876.43 Cr Monitored</div>
  <div class="meta-item"><strong>Post-Award Assurance:</strong> 30 Venue Corridor Projects • 11,202 Statewide (₹4,820 Cr)</div>
  <div class="meta-item"><strong>Objective:</strong> Unanimous 1st Place & Direct Acquisition Mandate</div>
</div>

<!-- ========================================== -->
<!-- ACT 1: THE FATAL POST-MORTEM TRAP -->
<!-- ========================================== -->
<div class="section-block">
  <div class="section-header">
    <h2 class="section-title">
      <span class="stakeholder-badge badge-all">TRILATERAL HOOK</span>
      Act 1: The Fatal Post-Mortem Trap (Why Audits Fail)
    </h2>
    <span class="section-time">0:00 – 0:40</span>
  </div>

  <div class="stage-action">
    Display Doppler Radar Command Center on screen with live Doppler scan running across 91 live tenders.
  </div>

  <div class="speech-box">
    <p>
      "Good morning, esteemed members of the Grand Jury. <span class="cue">[Establish direct eye contact with all three: Dept Nominee, Academic Chair, Tech Lead]</span>
    </p>
    <p>
      For decades, public sector governance across India has been trapped in a fatal illusion: <strong>the post-mortem audit trap</strong>.
    </p>
    <p>
      The Comptroller and Auditor General (CAG) and state vigilance departments publish devastating audit reports—noting single-bidder cartels, collusive tenders, and non-existent civil works. But they report it <strong>three to four years after the money has already left the state treasury</strong>. You cannot pave a road or build a hospital with a four-year-old audit paragraph.
    </p>
    <p>
      Today, we introduce the <strong>CHEIRAP AI & PROJECTPROOF Unified Suite</strong>: India's first end-to-end sovereign GovTech integrity system. It protects public funds across both critical frontiers:
    </p>
    <ul>
      <li><strong>Phase 1 (Pre-Award Tender Radar):</strong> Autonomous mathematical interception of rigged tenders on GePNIC <em>before</em> contracts are awarded.</li>
      <li><strong>Phase 2 (Post-Award Infrastructure Assurance):</strong> Real-time multi-modal evidence assurance on National Darpan MIS for civil construction works, directly solving official problem statement <strong>PWD-04</strong>.</li>
    </ul>
    <p>
      Right now, our Doppler radar is actively screening <strong>₹1,876.43 Crores</strong> in live Manipur tenders and <strong>11,202 construction works</strong> across all 16 districts. Let me show you how it works."
    </p>
  </div>

  <div class="acquisition-hook">
    <strong>⚡ Core Proposition:</strong>
    <span>Moving government from delayed retrospective autopsy to real-time statutory interception saves 8% to 12% of total state capital expenditure.</span>
  </div>
</div>

<!-- ========================================== -->
<!-- ACT 2: THE CLEAN BENCHMARK (GREEN PASSPORT) -->
<!-- ========================================== -->
<div class="section-block">
  <div class="section-header">
    <h2 class="section-title">
      <span class="stakeholder-badge badge-gov">DEPT</span>
      <span class="stakeholder-badge badge-acad">ACADEMIC</span>
      Act 2: The Clean Benchmark (Proving Honest Procurement)
    </h2>
    <span class="section-time">0:40 – 1:20</span>
  </div>

  <div class="stage-action">
    Click 'GREEN (48)' filter on Dashboard &rarr; Open Case Dossier for '2026_MED_3493_1' &rarr; Show Green Passport Badge.
  </div>

  <div class="tender-card tender-green">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
      <span style="font-weight: 700; color: #166534;">Tender 2026_MED_3493_1 • Manipur Health Directorate</span>
      <span class="pill pill-green">SCORE: 5 / 100 • GREEN PASSPORT ISSUED</span>
    </div>
    <div style="font-size: 7.6pt; color: #334155;">
      <strong>Work:</strong> Hospital Equipment (PM-DevINE) | <strong>Value:</strong> ₹10.00 Cr | <strong>Bidding Window:</strong> 23 Days | <strong>EMD:</strong> 2.0% | <strong>Corrigenda:</strong> 0 | <strong>Clearance:</strong> 72ms
    </div>
  </div>

  <div class="speech-box">
    <p>
      "To catch fraud, you must first mathematically prove what clean, honest procurement looks like. Look at Tender <code>2026_MED_3493_1</code>: Manipur Health Directorate procuring <strong>₹10 Crores</strong> of medical equipment under PM-DevINE. CHEIRAP clears it with a score of <strong>5 out of 100 — GREEN TIER</strong>.
    </p>
    <p>
      <span class="cue">[Turn to Academic & Tech Leads]</span> How does CHEIRAP verify this with mathematical certainty? We do not rely on probabilistic LLM hallucinations. We engineered a <strong>Hybrid Dual-Engine</strong>:
    </p>
    <ul>
      <li><strong>Engine 1 (Deterministic Statutory Automaton):</strong> GFR Rule 161 requires minimum 21 days—this tender provides <strong>23 full days</strong>. GFR Rule 170 mandates EMD between 2% and 5%—this tender sets exactly <strong>2.0%</strong>. Zero secret corrigenda.</li>
      <li><strong>Engine 2 (Econometric & Statistical Anomaly Scorer):</strong> Verifies bid variance and Benford's Law distribution across the pricing curve. No price clustering, healthy competitive dispersion.</li>
    </ul>
    <p>
      <span class="cue">[Turn to Department Nominee]</span> This clean tender receives an instant, cryptographically logged <strong>'Green Passport'</strong> in <strong>under 85 milliseconds</strong>. Honest officers face zero delays, and critical healthcare procurement proceeds without red tape."
    </p>
  </div>

  <div class="acquisition-hook">
    <strong>⚡ Tech & Academic Value:</strong>
    <span>Sub-85ms evaluation latency on FastAPI/Redis. Zero false-alarm friction for legitimate public infrastructure projects.</span>
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- ACT 3: PRE-AWARD COLLUSION INTERCEPT -->
<!-- ========================================== -->
<div class="section-block">
  <div class="section-header">
    <h2 class="section-title">
      <span class="stakeholder-badge badge-gov">DEPT</span>
      <span class="stakeholder-badge badge-tech">TECH</span>
      Act 3: The Pre-Award Forensic Catch (Section 38 Stay Order via e-Office)
    </h2>
    <span class="section-time">1:20 – 2:20</span>
  </div>

  <div class="stage-action">
    Click 'RED (28)' filter &rarr; Open Case Dossier for 'MAN_ED_PROC_2026_0142' &rarr; Point to XAI Waterfall &rarr; Click 'Pre-Award Hold Notice' &rarr; Watch State Seal slam down &rarr; Click 'Dispatch Stay via e-Office'.
  </div>

  <div class="tender-card tender-red">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
      <span style="font-weight: 700; color: #991b1b;">Tender MAN_ED_PROC_2026_0142 • PWD / Education Directorate</span>
      <span class="pill pill-red">SCORE: 82 / 100 • RED STATUTORY HAZARD</span>
    </div>
    <div style="font-size: 7.6pt; color: #334155;">
      <strong>Work:</strong> Modular Prefab School Labs | <strong>Value:</strong> ₹4.82 Cr | <strong>Window Left:</strong> 38.5 Hours | <strong>EMD:</strong> 2.5% | <strong>Corrigenda:</strong> 3 Rapid | <strong>Bidders:</strong> 2 (99.8% Est.)
    </div>
  </div>

  <div class="speech-box">
    <p>
      "Now, look at what happens when a cartel tries to game the system. This is Tender <code>MAN_ED_PROC_2026_0142</code>: building prefabricated school laboratories for <strong>₹4.82 Crores</strong>. CHEIRAP flags this as <strong>RED CRITICAL PRIORITY — Risk Score: 82 out of 100</strong>.
    </p>
    <p>
      <span class="cue">[Direct attention to the XAI Waterfall on screen]</span> Notice that this score is an evidentiary dossier proving <strong>four synchronized evasion tactics</strong>:
    </p>
    <ol>
      <li><strong>Corrigendum Window Squeeze (CVC Circular 01/01/2021):</strong> The department altered technical specs three consecutive times. Following the final change, bidders were left with just <strong>38.5 hours</strong> before portal lock. CVC mandates at least 7 days post-modification. Only the pre-briefed insider can submit in time.</li>
      <li><strong>Budget Slicing (Manipur DFPR 2020 Evasion):</strong> Under Manipur Delegation of Financial Powers, a Superintending Engineer holds sanctioning powers up to ₹5.00 Crores. Above ₹5 Cr requires State Cabinet clearance. This tender was artificially costed at <strong>₹4.82 Crores</strong>—deliberately sliced below the threshold to escape cabinet oversight.</li>
      <li><strong>Econometric Cover Bidding:</strong> Only 2 vendors bid. The winning bid was priced at <strong>99.8% of estimated cost</strong>. That is a synthetic 0.2% discount—classic cartel collusion.</li>
      <li><strong>Physical Gatekeeping:</strong> Mandated hand-delivered paper samples to a restricted military perimeter gate, artificially excluding outside national competitors.</li>
    </ol>
    <p>
      <span class="cue">[Click: Pre-Award Hold Notice → Slam State Seal → Click: Dispatch Stay via e-Office]</span>
      The engine instantly compiles a formal <strong>Statutory Stay Order under Section 38 of the State Vigilance Commission Act</strong>, and dispatches it via REST webhook directly into the state's digital e-Office registry under <strong>File <code>#MN-VIG-2026-8831</code></strong>. The tender committee is legally barred from unsealing financial bids. <strong>Public funds saved before award: ₹4.82 Crores.</strong>"
    </p>
  </div>

  <div class="acquisition-hook">
    <strong>⚡ Enforceability Fact:</strong>
    <span>Every violation cited maps to codified public procurement jurisprudence. 100% legally defensible in the High Court.</span>
  </div>
</div>

<!-- ========================================== -->
<!-- ACT 4: POST-AWARD ASSURANCE — PROJECTPROOF -->
<!-- ========================================== -->
<div class="section-block">
  <div class="section-header">
    <h2 class="section-title">
      <span class="stakeholder-badge badge-pwd">PWD-04 TRACK</span>
      <span class="stakeholder-badge badge-all">SHOWSTOPPER</span>
      Act 4: Post-Award Infrastructure Assurance (Solving PWD-04)
    </h2>
    <span class="section-time">2:20 – 3:30</span>
  </div>

  <div class="stage-action">
    Click 'PROJECTPROOF (PWD-04 ASSURANCE)' tab on top bar &rarr; Point to Venue Corridor Sandbox (Mantripukhri/Heingang) &rarr; Filter 'HIGH PRIORITY' &rarr; Open Dossier for 'MN-PWD-ED-2026-0812' (Heingang Model School).
  </div>

  <div class="tender-card tender-red">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
      <span style="font-weight: 700; color: #991b1b;">Project MN-PWD-ED-2026-0812 • Heingang Model School (Linked to Tender 0142)</span>
      <span class="pill pill-red">INCONSISTENCY SCORE: 94 / 100 • HIGH VERIFICATION PRIORITY</span>
    </div>
    <div style="font-size: 7.6pt; color: #334155;">
      <strong>Sanctioned:</strong> ₹4.82 Cr | <strong>Disbursed:</strong> ₹4.82 Cr (100%) | <strong>GPS Discrepancy:</strong> 9.42 km away | <strong>Visual Match:</strong> 93.4% Duplicate | <strong>Velocity:</strong> 11-Day Jump
    </div>
  </div>

  <div class="speech-box">
    <p>
      "Now, members of the Grand Jury, what happens once a contract is awarded and civil works begin on the ground?
    </p>
    <p>
      This directly answers official hackathon challenge statement <strong>PWD-04: AI-Based Construction Progress Monitoring</strong>.
    </p>
    <p>
      We built <strong>PROJECTPROOF</strong> on top of the National Darpan MIS. To demonstrate this live for you today, we indexed <strong>30 active infrastructure civil works right around this hackathon venue corridor</strong> in Mantripukhri and Heingang.
    </p>
    <p>
      25 projects are verified green with authentic geo-tags and consistent milestone curves. But look at Project <code>MN-PWD-ED-2026-0812</code> at Heingang Model School—<strong>the exact companion project to our flagged pre-award tender</strong>!
    </p>
    <p>
      The contractor claimed 100% physical completion, and 100% of funds (₹4.82 Crores) were disbursed. But ProjectProof runs <strong>multi-modal evidence triangulation</strong> across 4 mathematical vectors:
    </p>
    <ul>
      <li>📍 <strong>1. Geospatial Geo-Fence Delta:</strong> The sanctioned site is in Heingang (24.8621° N, 93.9312° E). But our Haversine spatial analysis proves the uploaded photo EXIF metadata was taken in Thangmeiband—<strong>9.42 kilometers away</strong>!</li>
      <li>📸 <strong>2. Perceptual Image Matching (pHash):</strong> Running 64-bit Discrete Cosine Transform perceptual hashing against our statewide image database reveals a <strong>93.4% visual duplicate match</strong> with an old 2024 Khabam school project. The contractor submitted recycled photographs!</li>
      <li>🕒 <strong>3. Temporal Progress Velocity:</strong> The reported progress jumped from foundation to 100% completion in just <strong>11 days</strong>—an impossible 9.1% physical progress per day that violates concrete curing and civil engineering physics!</li>
      <li>💰 <strong>4. Fiscal-Physical Divergence:</strong> 100% of funds disbursed while exactly 0 core test inspection logs were uploaded.</li>
    </ul>
    <p>
      <span class="cue">[Turn to Official Dept Nominee & Tech Lead]</span> Notice our administrative discipline: ProjectProof never makes reckless accusations of fraud. It outputs an <strong>Evidence Inconsistency Score of 94 out of 100</strong>, assigns <strong>High Verification Priority</strong>, and automatically compiles <strong>PWD Form 44 — Notice for Special Physical Verification</strong> dispatched to the PWD Chief Engineer with digital timestamp!"
    </p>
  </div>

  <div class="acquisition-hook">
    <strong>⚡ The Connected Corruption Trail:</strong>
    <span>If a cartel escapes pre-award vigilance, ProjectProof intercepts them post-award before final contractor disbursement. End-to-end integrity.</span>
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- ACT 5: MACRO DARPAN TELEMETRY & SOVEREIGNTY -->
<!-- ========================================== -->
<div class="section-block">
  <div class="section-header">
    <h2 class="section-title">
      <span class="stakeholder-badge badge-gov">DEPT</span>
      <span class="stakeholder-badge badge-acad">ACADEMIC</span>
      Act 5: Macro Statewide Darpan Telemetry & Cultural Sovereignty
    </h2>
    <span class="section-time">3:30 – 4:10</span>
  </div>

  <div class="stage-action">
    Point to Statewide MIS counter (11,202 projects, ₹4,820 Cr) &rarr; Toggle to native Meetei Mayek script (<span class="font-meetei">ꯆꯩꯔꯥꯞ</span>) on header.
  </div>

  <div class="speech-box">
    <p>
      "This is not a toy prototype. Statewide across all 16 districts of Manipur, ProjectProof monitors <strong>11,202 civil infrastructure works worth ₹4,820 Crores</strong> on Darpan telemetry.
    </p>
    <p>
      Crucially, <strong>11,062 projects—98.7%—are cleared automatically as verified consistent</strong>. ProjectProof does not overwhelm the government; it acts as a high-precision triage filter, isolating an actionable priority shortlist of just <strong>140 projects</strong> (23 Critical High, 117 Medium) for targeted physical inspection.
    </p>
    <p>
      Furthermore, CHEIRAP is built for sovereign administrative pride: fully localized in native Unicode <strong>Meetei Mayek (<span class="font-meetei">ꯆꯩꯔꯥꯞ</span>)</strong> complying with Manipur's Official Language Policy, complete with AAA High-Contrast accessibility."
    </p>
  </div>
</div>

<!-- ========================================== -->
<!-- ACT 6: THE TRILATERAL ACQUISITION CLOSE -->
<!-- ========================================== -->
<div class="section-block">
  <div class="section-header">
    <h2 class="section-title">
      <span class="stakeholder-badge badge-all">UNANIMOUS CLOSE</span>
      Act 6: The Trilateral Close & The Proposal Acquisition Case
    </h2>
    <span class="section-time">4:10 – 4:50</span>
  </div>

  <div class="stage-action">
    Stand tall, establish direct eye contact with each of the three jury nominees in turn. Deliver with absolute conviction.
  </div>

  <div class="speech-box">
    <p>
      <span class="cue">[THE ACQUISITION PITCH — Address each jury nominee directly with unwavering authority]</span>
    </p>
    <p>
      🏛️ <strong>To our Official Department Nominee:</strong> <strong>Mandate CHEIRAP & ProjectProof as your state's complete pre- and post-award integrity shield.</strong> It delivers an immediate turnkey solution for PWD-04, integrates with Darpan, eliminates CAG audit objections, and protects honest officers with automated Green Passports.
    </p>
    <p>
      🔬 <strong>To our Academic & Research Lead:</strong> <strong>Adopt CHEIRAP as India’s gold-standard computational governance benchmark.</strong> We have solved the explainability crisis in public sector AI by fusing deterministic administrative jurisprudence with multi-modal computer vision and econometric signal processing. Zero black-box hallucinations.
    </p>
    <p>
      💻 <strong>To our Tech Companies' Enterprise Lead:</strong> <strong>Acquire this proposal and scale it nationwide.</strong> Across 28 states and Union Ministries, India spends over <strong>₹40 Lakh Crores ($500 Billion) annually</strong> on public procurement and capital works. CHEIRAP & ProjectProof are cloud-native, microservice-architected, and ready to be licensed into enterprise GovTech platforms, GePNIC, and GeM.
    </p>
    <p>
      CHEIRAP AI proves that artificial intelligence in government shouldn’t just write essays or summarize PDFs. It should protect public funds, guarantee fair competition, and ensure that every single rupee budgeted for schools, roads, and water reaches the citizens of Manipur and India.
    </p>
    <p>
      <strong>Thank you, and we welcome your questions.</strong>"
    </p>
  </div>
</div>

<!-- ========================================== -->
<!-- COMPARATIVE AUDIT TELEMETRY TABLE -->
<!-- ========================================== -->
<h2 style="font-size: 9pt; font-weight: 800; color: #002244; border-bottom: 2px solid #002244; padding-bottom: 2px; margin: 8px 0 4px 0;">
  Comparative Audit Telemetry: Pre-Award Radar & Post-Award Infrastructure Assurance
</h2>

<table>
  <thead>
    <tr>
      <th style="width: 18%;">Lifecycle Stage</th>
      <th style="width: 20%;">Clean Green Benchmark</th>
      <th style="width: 27%;">Flagged Critical Violation</th>
      <th style="width: 35%;">Statutory / Technical Ground</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Pre-Award Tender</strong></td>
      <td><code>2026_MED_3493_1</code><br>Score: 5/100 (Green)</td>
      <td><code>MAN_ED_PROC_2026_0142</code><br>Score: 82/100 (Red Hazard)</td>
      <td>GFR Rule 161 (23d vs 38.5h window squeeze) • DFPR 2020 budget slicing below ₹5.00 Cr SE ceiling • CVC 01/01/2021.</td>
    </tr>
    <tr>
      <td><strong>Post-Award Project (PWD-04)</strong></td>
      <td><code>MN-PWD-ED-2026-0814</code><br>Score: 8/100 (Low Priority)</td>
      <td><code>MN-PWD-ED-2026-0812</code><br>Score: 94/100 (High Priority)</td>
      <td>Haversine GPS 9.42 km delta • 64-bit pHash 93.4% image duplicate • Unrealistic 11-day completion jump (9.1%/day).</td>
    </tr>
    <tr>
      <td><strong>Statutory Output</strong></td>
      <td>Instant Green Passport clearance issued in &lt;85ms.</td>
      <td>Section 38 Stay Order dispatched to e-Office File #MN-VIG-2026-8831.</td>
      <td>State Vigilance Act Sec 38 • Legally bars procurement committee from unsealing financial bids.</td>
    </tr>
    <tr>
      <td><strong>Field Verification</strong></td>
      <td>Standard routine civil engineering measurement book entry.</td>
      <td>PWD Form 44 Notice for Special Physical Verification dispatched to CE.</td>
      <td>CPWD Works Manual 2024 §7.4 • Immediate on-site core extraction & physical inspection order.</td>
    </tr>
  </tbody>
</table>

<!-- ========================================== -->
<!-- TRILATERAL GRAND JURY DEFENSE BIBLE -->
<!-- ========================================== -->
<h2 style="font-size: 9pt; font-weight: 800; color: #002244; border-bottom: 2px solid #002244; padding-bottom: 2px; margin: 8px 0 4px 0;">
  Trilateral Grand Jury Defense Bible: 15-Second Knockout Answers
</h2>

<div class="qa-card">
  <div class="qa-target" style="color: #003366;">🏛️ OFFICIAL DEPARTMENT NOMINEE — PWD & DARPAN INTEGRATION</div>
  <div class="qa-q">Q1: "Will ProjectProof interfere with routine contractor billing and cause administrative gridlock for Executive Engineers?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "The exact opposite. Over 98.7% of projects—like the 25 verified clean civil works in our Mantripukhri corridor—are cleared in under 85 milliseconds with automated Green Passports. ProjectProof acts as a high-precision triage filter: it only flags projects with severe multi-modal discrepancies, such as a 9.42 km GPS mismatch and recycled photos. It saves Executive Engineers and Chief Engineers from catastrophic CAG audit recoveries and vigilance inquiries years later."
  </div>
</div>

<div class="qa-card">
  <div class="qa-target" style="color: #003366;">🏛️ OFFICIAL DEPARTMENT NOMINEE — CONTRACTOR DEFAMATION / DISPUTES</div>
  <div class="qa-q">Q2: "Can a contractor take PWD to the High Court claiming arbitrary AI blacklisting?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "No contractor can succeed because ProjectProof never blacklists or accuses contractors of fraud. It outputs an objective Evidence Inconsistency Score and compiles PWD Form 44—a standard statutory request for on-site physical inspection under the CPWD Works Manual. When we demonstrate that photographic EXIF was captured 9.42 km away from the sanctioned site, the High Court will uphold the department's right to verify ground reality every single time."
  </div>
</div>

<div class="qa-card">
  <div class="qa-target" style="color: #0f766e;">🔬 ACADEMIC & RESEARCH LEAD — COMPUTER VISION & HASHING INVARIANCE</div>
  <div class="qa-q">Q3: "How does your perceptual image hash handle varying lighting, weather, and camera angles on construction sites?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "We use a 64-bit Discrete Cosine Transform perceptual hash (pHash) calibrated on frequency components rather than surface pixel values. It is inherently invariant to minor lighting, compression, and scaling variations. Crucially, our system does not rely on vision alone: visual similarity is cross-triangulated with Haversine GPS geo-fencing and temporal velocity curves. A high similarity score only triggers a critical priority when paired with impossible progress velocity or spatial divergence."
  </div>
</div>

<div class="qa-card">
  <div class="qa-target" style="color: #6b21a8;">💻 TECH COMPANIES' ENTERPRISE LEAD — HORIZONTAL SCALING & ACQUISITION</div>
  <div class="qa-q">Q4: "What is your commercial TAM, defensible IP moat, and enterprise acquisition roadmap?"</div>
  <div class="qa-a">
    <strong>Your Answer:</strong> "India spends over ₹40 Lakh Crores ($500 Billion) annually on public capital works across 28 states, yet zero enterprise GovTech vendors offer unified pre-award radar and post-award evidence assurance. Our defensible moat is the synthesis of codified administrative jurisprudence into computational automata combined with multi-modal physical evidence triangulation. For an enterprise cloud or IT systems integrator, acquiring CHEIRAP & ProjectProof provides an instant, high-margin GovTech SaaS IP ready for state and union ministry contracts."
  </div>
</div>

<!-- ========================================== -->
<!-- 60-SECOND POCKET TELEPROMPTER -->
<!-- ========================================== -->
<div style="background: #f8fafc; border: 1.5px solid #002244; border-radius: 6px; padding: 6px 9px; margin-top: 8px;">
  <div style="font-weight: 800; font-size: 7.6pt; color: #002244; text-transform: uppercase; margin-bottom: 3px;">
    📋 Presenter's 60-Second Pocket Teleprompter (Stage Cue Card)
  </div>
  <div style="font-size: 7.4pt; line-height: 1.4; color: #334155;">
    <strong>0:00</strong> — <em>"Audits are post-mortems; CHEIRAP is real-time interception. ₹1,876 Cr screened live."</em> <span class="cue">[Look: All 3]</span><br>
    <strong>0:40</strong> — <em>"Tender 2026_MED_3493_1: Green Passport (5/100). GFR-161 23 days, 2% EMD. Sub-85ms clearance."</em> <span class="cue">[Look: Academic & Tech]</span><br>
    <strong>1:20</strong> — <em>"Tender MAN_ED_PROC_2026_0142: Red Hazard (82/100). 38.5h squeeze, ₹4.82 Cr slice, 99.8% cartel."</em> <span class="cue">[Look: Dept & Academic]</span><br>
    <strong>2:20</strong> — <em>"PROJECTPROOF for PWD-04: Project 0812 at Heingang. 9.42 km GPS delta, 93.4% image duplicate, 11-day jump! PWD Form 44 dispatched."</em> <span class="cue">[SHOWSTOPPER MOMENT]</span><br>
    <strong>3:30</strong> — <em>"Statewide Darpan: 11,202 works, ₹4,820 Cr, 98.7% verified green, 140 priority audits. Sovereign Meetei Mayek."</em> <span class="cue">[POINT TO STATS]</span><br>
    <strong>4:10</strong> — <em>"Acquisition Call: Dept mandate, Academic benchmark, Enterprise Tech nationwide scale across ₹40 Lakh Crores."</em> <span class="cue">[CONFIDENT CLOSE]</span>
  </div>
</div>

</body>
</html>
"""

    html_out = "artifacts/CHEIRAP_Demo_Speaking_Script.html"
    with open(html_out, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"✓ Saved HTML source: {html_out}")

    print("[Playwright] Rendering Trilateral Grand Jury Speaking Script PDF...")
    pdf_out = "artifacts/CHEIRAP_Demo_Speaking_Script.pdf"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(html_content, wait_until='networkidle')
        page.pdf(
            path=pdf_out,
            format='A4',
            print_background=True,
            margin={'top': '11mm', 'bottom': '13mm', 'left': '11mm', 'right': '11mm'},
            display_header_footer=False
        )
        browser.close()
    print(f"✓ PDF successfully generated: {pdf_out}")

    # Copy to root workspace
    root_pdf = "CHEIRAP_Demo_Speaking_Script.pdf"
    shutil.copyfile(pdf_out, root_pdf)
    print(f"✓ Copied to root workspace: {root_pdf}")

    # Copy to active brain artifact directory
    active_brain_dir = r"C:\\Users\\singh\\.gemini\\antigravity-ide\\brain\\5358bf05-2dd2-4509-af70-70835cbc296c"
    if os.path.exists(active_brain_dir):
        brain_pdf = os.path.join(active_brain_dir, "CHEIRAP_Demo_Speaking_Script.pdf")
        shutil.copyfile(pdf_out, brain_pdf)
        print(f"✓ Copied to active brain artifact dir: {brain_pdf}")

    # Generate companion Markdown playbook
    md_content = """# CHEIRAP AI (ꯆꯩꯔꯥꯞ) & PROJECTPROOF SUITE — Grand Jury Pitch Script & Acquisition Proposal
**Sovereign Pre-Award Vigilance Radar & Post-Award Infrastructure Evidence Assurance (PWD-04)**  
*Government of Manipur • Department of Information Technology & Public Works Department (PWD)*  
*Tailored for the Trilateral Grand Jury: Official Department Nominee • Academic/Research Lead • Tech Companies' Enterprise Lead*

---

## 🏛️ Trilateral Jury Strategic Alignment

| Jury Nominee | Weight | Core Focus & Trigger Keywords | What Winning Looks Like |
| :--- | :---: | :--- | :--- |
| **Official Department Nominee** | **30%** | Solves **PWD-04**, Darpan MIS integration, **PWD Form 44 Notice**, Section 38 Stay Order via e-Office, GFR 161/170, DFPR 2020, CAG audit immunity, zero disruption to honest officers. | Complete statutory compliance shield; eliminates audit liabilities; solves PWD-04. |
| **Academic & Research Lead** | **35%** | Hybrid Dual-Engine (Deterministic Automata + Econometric Scorer), **Multi-Modal Triangulation** (Haversine GPS delta + 64-bit pHash + Velocity Curves + Benford's Law), XAI Waterfall, 0% hallucination. | Solves explainability crisis in public sector AI; sound computer vision & spatial mathematics. |
| **Tech Companies' Enterprise Lead** | **35%** | FastAPI/Redis microservices, sub-85ms latency, GePNIC/Darpan decoupled scrapers, **₹40 Lakh Crore ($500B) TAM** across 28 states, turnkey GovTech IP acquisition/licensing. | Scalable, high-margin commercial SaaS asset ready for nationwide enterprise rollout. |

---

## 🎬 6-Act Grand Jury Speaking Script

### ACT 1: The Fatal Post-Mortem Trap (0:00 – 0:40)
**Stage Cue:** Display **Doppler Radar Command Center** on screen with animated Doppler scan running across 91 live tenders.  
**Eye Contact:** Look directly at all three nominees: Department Nominee, Academic Chair, and Tech Lead.

> *"Good morning, esteemed members of the Grand Jury.*
> 
> *For decades, public sector governance across India has been trapped in a fatal illusion: **the post-mortem audit trap**.*
> 
> *The Comptroller and Auditor General (CAG) and state vigilance departments publish devastating audit reports—noting single-bidder cartels, collusive tenders, and non-existent civil works. But they report it **three to four years after the money has already left the state treasury**. You cannot pave a road or build a hospital with a four-year-old audit paragraph.*
> 
> *Today, we introduce the **CHEIRAP AI & PROJECTPROOF Unified Suite**: India's first end-to-end sovereign GovTech integrity system. It protects public funds across both critical frontiers:*
> 
> *• **Phase 1 (Pre-Award Tender Radar):** Autonomous mathematical interception of rigged tenders on GePNIC before contracts are awarded.*  
> *• **Phase 2 (Post-Award Infrastructure Assurance):** Real-time multi-modal evidence assurance on National Darpan MIS for civil construction works, directly solving official problem statement **PWD-04**.*
> 
> *Right now, our Doppler radar is actively screening **₹1,876.43 Crores** in live Manipur tenders and **11,202 construction works** across all 16 districts. Let me show you how it works."*

---

### ACT 2: The Clean Benchmark — Green Passport (0:40 – 1:20)
**Stage Cue:** Click **'GREEN (48)'** filter on Dashboard → Open Case Dossier for **'2026_MED_3493_1'** → Show Green Passport Badge.  
**Highlighted Tender:** Tender `2026_MED_3493_1` • Manipur Health Directorate • ₹10.00 Cr • Score: **5 / 100 (Green Passport)**.

> *"To catch fraud, you must first mathematically prove what clean, honest procurement looks like. Look at Tender `2026_MED_3493_1`: Manipur Health Directorate procuring **₹10 Crores** of medical equipment under PM-DevINE. CHEIRAP clears it with a score of **5 out of 100 — GREEN TIER**.*
> 
> *[Turn to Academic & Tech Leads] How does CHEIRAP verify this with mathematical certainty? We do not rely on probabilistic LLM hallucinations. We engineered a **Hybrid Dual-Engine**:*
> 
> *1. **Engine 1 (Deterministic Statutory Automaton):** GFR Rule 161 requires minimum 21 days—this tender provides **23 full days**. GFR Rule 170 mandates EMD between 2% and 5%—this tender sets exactly **2.0%**. Zero secret corrigenda.*  
> *2. **Engine 2 (Econometric & Statistical Anomaly Scorer):** Verifies bid variance and Benford's Law distribution across the pricing curve. No price clustering, healthy competitive dispersion.*
> 
> *[Turn to Department Nominee] This clean tender receives an instant, cryptographically logged **'Green Passport'** in **under 85 milliseconds**. Honest officers face zero delays, and critical healthcare procurement proceeds without red tape."*

---

### ACT 3: Pre-Award Collusion Intercept (1:20 – 2:20)
**Stage Cue:** Click **'RED (28)'** filter → Open Case Dossier for **'MAN_ED_PROC_2026_0142'** → Point to XAI Waterfall → Click **'Pre-Award Hold Notice'** → Watch State Seal slam down → Click **'Dispatch Stay via e-Office'**.  
**Highlighted Tender:** Tender `MAN_ED_PROC_2026_0142` • PWD / Education • ₹4.82 Cr • Score: **82 / 100 (Red Statutory Hazard)**.

> *"Now, look at what happens when a cartel tries to game the system. This is Tender `MAN_ED_PROC_2026_0142`: building prefabricated school laboratories for **₹4.82 Crores**. CHEIRAP flags this as **RED CRITICAL PRIORITY — Risk Score: 82 out of 100**.*
> 
> *[Direct attention to the XAI Waterfall on screen] Notice that this score is an evidentiary dossier proving **four synchronized evasion tactics**:*
> 
> *1. **Corrigendum Window Squeeze (CVC Circular 01/01/2021):** The department altered technical specs three consecutive times. Following the final change, bidders were left with just **38.5 hours** before portal lock. CVC mandates at least 7 days post-modification. Only the pre-briefed insider can submit in time.*  
> *2. **Budget Slicing (Manipur DFPR 2020 Evasion):** Under Manipur Delegation of Financial Powers, a Superintending Engineer holds sanctioning powers up to ₹5.00 Crores. Above ₹5 Cr requires State Cabinet clearance. This tender was artificially costed at **₹4.82 Crores**—deliberately sliced below the threshold to escape cabinet oversight.*  
> *3. **Econometric Cover Bidding:** Only 2 vendors bid. The winning bid was priced at **99.8% of estimated cost**. That is a synthetic 0.2% discount—classic cartel collusion.*  
> *4. **Physical Gatekeeping:** Mandated hand-delivered paper samples to a restricted military perimeter gate, artificially excluding outside national competitors.*
> 
> *[Click: Pre-Award Hold Notice → Slam State Seal → Click: Dispatch Stay via e-Office]*  
> *The engine instantly compiles a formal **Statutory Stay Order under Section 38 of the State Vigilance Commission Act**, and dispatches it via REST webhook directly into the state's digital e-Office registry under **File `#MN-VIG-2026-8831`**. The tender committee is legally barred from unsealing financial bids. **Public funds saved before award: ₹4.82 Crores.***"*

---

### ACT 4: Post-Award Infrastructure Assurance — PROJECTPROOF for PWD-04 (2:20 – 3:30)
**Stage Cue:** Click **'PROJECTPROOF (PWD-04 ASSURANCE)'** tab on top nav → Point to Venue Corridor Sandbox (Mantripukhri/Heingang) → Filter **'HIGH PRIORITY'** → Open Dossier for **'MN-PWD-ED-2026-0812'** (Heingang Model School).  
**Highlighted Project:** Project `MN-PWD-ED-2026-0812` • Heingang Model School • ₹4.82 Cr • Score: **94 / 100 (High Verification Priority)**.

> *"Now, members of the Grand Jury, what happens once a contract is awarded and civil works begin on the ground?*
> 
> *This directly answers official hackathon challenge statement **PWD-04: AI-Based Construction Progress Monitoring**.*
> 
> *We built **PROJECTPROOF** on top of the National Darpan MIS. To demonstrate this live for you today, we indexed **30 active infrastructure civil works right around this hackathon venue corridor** in Mantripukhri and Heingang.*
> 
> *25 projects are verified green with authentic geo-tags and consistent milestone curves. But look at Project `MN-PWD-ED-2026-0812` at Heingang Model School—**the exact companion project to our flagged pre-award tender**!*
> 
> *The contractor claimed 100% physical completion, and 100% of funds (₹4.82 Crores) were disbursed. But ProjectProof runs **multi-modal evidence triangulation** across 4 mathematical vectors:*
> 
> *📍 **1. Geospatial Geo-Fence Delta:** The sanctioned site is in Heingang (24.8621° N, 93.9312° E). But our Haversine spatial analysis proves the uploaded photo EXIF metadata was taken in Thangmeiband—**9.42 kilometers away**!*  
> *📸 **2. Perceptual Image Matching (pHash):** Running 64-bit Discrete Cosine Transform perceptual hashing against our statewide image database reveals a **93.4% visual duplicate match** with an old 2024 Khabam school project. The contractor submitted recycled photographs!*  
> *🕒 **3. Temporal Progress Velocity:** The reported progress jumped from foundation to 100% completion in just **11 days**—an impossible 9.1% physical progress per day that violates concrete curing and civil engineering physics!*  
> *💰 **4. Fiscal-Physical Divergence:** 100% of funds disbursed while exactly 0 core test inspection logs were uploaded.*
> 
> *[Turn to Official Dept Nominee & Tech Lead] Notice our administrative discipline: ProjectProof never makes reckless accusations of fraud. It outputs an **Evidence Inconsistency Score of 94 out of 100**, assigns **High Verification Priority**, and automatically compiles **PWD Form 44 — Notice for Special Physical Verification** dispatched to the PWD Chief Engineer with digital timestamp!"*

---

### ACT 5: Macro Statewide Darpan Telemetry & Cultural Sovereignty (3:30 – 4:10)
**Stage Cue:** Point to Statewide MIS counter (11,202 projects, ₹4,820 Cr) → Toggle to native Unicode **Meetei Mayek (<span class="font-meetei">ꯆꯩꯔꯥꯞ</span>)** on top bar.

> *"This is not a toy prototype. Statewide across all 16 districts of Manipur, ProjectProof monitors **11,202 civil infrastructure works worth ₹4,820 Crores** on Darpan telemetry.*
> 
> *Crucially, **11,062 projects—98.7%—are cleared automatically as verified consistent**. ProjectProof does not overwhelm the government; it acts as a high-precision triage filter, isolating an actionable priority shortlist of just **140 projects** (23 Critical High, 117 Medium) for targeted physical inspection.*
> 
> *Furthermore, CHEIRAP is built for sovereign administrative pride: fully localized in native Unicode **Meetei Mayek (ꯆꯩꯔꯥꯞ)** complying with Manipur's Official Language Policy, complete with AAA High-Contrast accessibility."*

---

### ACT 6: The Trilateral Close & Proposal Acquisition (4:10 – 4:50)
**Stage Cue:** Stand tall, establish direct eye contact with each of the three jury nominees in turn. Deliver with absolute conviction.

> *"[THE ACQUISITION PITCH — Address each jury nominee directly with unwavering authority]*
> 
> 🏛️ ***To our Official Department Nominee:** **Mandate CHEIRAP & ProjectProof as your state's complete pre- and post-award integrity shield.** It delivers an immediate turnkey solution for PWD-04, integrates with Darpan, eliminates CAG audit objections, and protects honest officers with automated Green Passports.*
> 
> 🔬 ***To our Academic & Research Lead:** **Adopt CHEIRAP as India’s gold-standard computational governance benchmark.** We have solved the explainability crisis in public sector AI by fusing deterministic administrative jurisprudence with multi-modal computer vision and econometric signal processing. Zero black-box hallucinations.*
> 
> 💻 ***To our Tech Companies' Enterprise Lead:** **Acquire this proposal and scale it nationwide.** Across 28 states and Union Ministries, India spends over **₹40 Lakh Crores ($500 Billion) annually** on public procurement and capital works. CHEIRAP & ProjectProof are cloud-native, microservice-architected, and ready to be licensed into enterprise GovTech platforms, GePNIC, and GeM.*
> 
> *CHEIRAP AI proves that artificial intelligence in government shouldn’t just write essays or summarize PDFs. It should protect public funds, guarantee fair competition, and ensure that every single rupee budgeted for schools, roads, and water reaches the citizens of Manipur and India.*
> 
> ***Thank you, and we welcome your questions.***"*

---

## ⚖️ Comparative Audit Telemetry Table

| Lifecycle Stage | Clean Green Benchmark | Flagged Critical Violation | Statutory / Technical Ground |
| :--- | :--- | :--- | :--- |
| **Pre-Award Tender** | `2026_MED_3493_1`<br>Score: **5/100 (Green)** | `MAN_ED_PROC_2026_0142`<br>Score: **82/100 (Red Hazard)** | GFR Rule 161 (23d vs 38.5h window squeeze) • DFPR 2020 budget slicing below ₹5.00 Cr SE ceiling • CVC 01/01/2021. |
| **Post-Award Project (PWD-04)** | `MN-PWD-ED-2026-0814`<br>Score: **8/100 (Low Priority)** | `MN-PWD-ED-2026-0812`<br>Score: **94/100 (High Priority)** | Haversine GPS 9.42 km delta • 64-bit pHash 93.4% image duplicate • Unrealistic 11-day completion jump (9.1%/day). |
| **Statutory Output** | Instant Green Passport clearance issued in &lt;85ms. | Section 38 Stay Order dispatched to e-Office File #MN-VIG-2026-8831. | State Vigilance Act Sec 38 • Legally bars procurement committee from unsealing financial bids. |
| **Field Verification** | Standard routine civil engineering measurement book entry. | PWD Form 44 Notice for Special Physical Verification dispatched to CE. | CPWD Works Manual 2024 §7.4 • Immediate on-site core extraction & physical inspection order. |

---

## 🥊 Trilateral Grand Jury Defense Bible: 15-Second Knockout Answers

### 🏛️ For the Official Department Nominee
**Q1: "Will ProjectProof interfere with routine contractor billing and cause administrative gridlock for Executive Engineers?"**  
> **Your Answer:** *"The exact opposite. Over 98.7% of projects—like the 25 verified clean civil works in our Mantripukhri corridor—are cleared in under 85 milliseconds with automated Green Passports. ProjectProof acts as a high-precision triage filter: it only flags projects with severe multi-modal discrepancies, such as a 9.42 km GPS mismatch and recycled photos. It saves Executive Engineers and Chief Engineers from catastrophic CAG audit recoveries and vigilance inquiries years later."*

**Q2: "Can a contractor take PWD to the High Court claiming arbitrary AI blacklisting?"**  
> **Your Answer:** *"No contractor can succeed because ProjectProof never blacklists or accuses contractors of fraud. It outputs an objective Evidence Inconsistency Score and compiles PWD Form 44—a standard statutory request for on-site physical inspection under the CPWD Works Manual. When we demonstrate that photographic EXIF was captured 9.42 km away from the sanctioned site, the High Court will uphold the department's right to verify ground reality every single time."*

---

### 🔬 For the Academic & Research Lead
**Q3: "How does your perceptual image hash handle varying lighting, weather, and camera angles on construction sites?"**  
> **Your Answer:** *"We use a 64-bit Discrete Cosine Transform perceptual hash (pHash) calibrated on frequency components rather than surface pixel values. It is inherently invariant to minor lighting, compression, and scaling variations. Crucially, our system does not rely on vision alone: visual similarity is cross-triangulated with Haversine GPS geo-fencing and temporal velocity curves. A high similarity score only triggers a critical priority when paired with impossible progress velocity or spatial divergence."*

---

### 💻 For the Tech Companies' Enterprise Lead
**Q4: "What is your commercial TAM, defensible IP moat, and enterprise acquisition roadmap?"**  
> **Your Answer:** *"India spends over ₹40 Lakh Crores ($500 Billion) annually on public capital works across 28 states, yet zero enterprise GovTech vendors offer unified pre-award radar and post-award evidence assurance. Our defensible moat is the synthesis of codified administrative jurisprudence into computational automata combined with multi-modal physical evidence triangulation. For an enterprise cloud or IT systems integrator, acquiring CHEIRAP & ProjectProof provides an instant, high-margin GovTech SaaS IP ready for state and union ministry contracts."*

---

## 📋 Presenter's 60-Second Pocket Teleprompter (Stage Cue Card)

| Time Marker | Key Action & Target Eye Contact | Spoken Anchor Line |
| :--- | :--- | :--- |
| **0:00** | 🖥️ Doppler Radar moving • 👁️ Look at all 3 Nominees | *"Audits are post-mortems; CHEIRAP is real-time interception. ₹1,876 Cr screened live."* |
| **0:40** | 🖥️ Filter Green • 👁️ Look at Academic & Tech Leads | *"Tender 2026_MED_3493_1: Green Passport (5/100). GFR-161 23 days, 2% EMD. Sub-85ms clearance."* |
| **1:20** | 🖥️ Open Red Dossier & XAI • 👁️ Look at Dept & Academic Leads | *"Tender MAN_ED_PROC_2026_0142: Red Hazard (82/100). 38.5h squeeze, ₹4.82 Cr slice, 99.8% cartel."* |
| **2:20** | 🖥️ Switch to PROJECTPROOF (PWD-04) • 👁️ Point to Flagship 0812 | *"PROJECTPROOF solves PWD-04! 9.42 km GPS delta, 93.4% image duplicate, 11-day jump! PWD Form 44 dispatched."* |
| **3:30** | 🖥️ Point to Statewide MIS (11,202) • 👁️ Toggle Meetei Mayek | *"Statewide Darpan: 11,202 works, ₹4,820 Cr, 98.7% verified green, 140 priority audits. Sovereign Meetei Mayek."* |
| **4:10** | 🖥️ Stand tall • 👁️ Deliver Acquisition Close to each Nominee | *"Dept mandate, Academic benchmark, Enterprise Tech nationwide scale across ₹40 Lakh Crores."* |
"""

    md_out = "CHEIRAP_Demo_Speaking_Script.md"
    with open(md_out, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"✓ Saved Markdown Playbook: {md_out}")

    if os.path.exists(active_brain_dir):
        brain_md = os.path.join(active_brain_dir, "CHEIRAP_Demo_Speaking_Script.md")
        with open(brain_md, "w", encoding="utf-8") as f:
            f.write(md_content)
        print(f"✓ Copied Markdown Playbook to active brain artifact dir: {brain_md}")

    print("================================================================================")
    print("CHEIRAP AI & PROJECTPROOF TRILATERAL JURY DOSSIER SUCCESSFULLY COMPILED!")
    print("================================================================================")

if __name__ == "__main__":
    generate_script_pdf()
