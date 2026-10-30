# CHEIRAP (ꯆꯩꯔꯥꯞ)

> **Public Tender Transparency & Civic Vigilance for Manipur**  
> *"See what public money is buying."*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Track](https://img.shields.io/badge/VBYLD%202027-Governance%20%26%20Civic%20Tech-orange.svg)](https://mybharat.gov.in/vbyld-2027)
[![State](https://img.shields.io/badge/State-Manipur-emerald.svg)]()
[![Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20FastAPI%20%7C%20GSAP-15335b.svg)]()

---

## 🏆 Project Overview

**CHEIRAP** (Meetei Mayek: `ꯆꯩꯔꯥꯞ`, historically referring to the traditional court of justice and civic assembly in Manipur) is an autonomous, open-source public procurement transparency platform. It transforms complex, fragmented government e-tender notices into understandable, comparable, and source-verified citizen briefs.

* **Competition**: **Hack for Social Cause (HSC 2027)** under **Viksit Bharat Young Leaders Dialogue (VBYLD)**
* **Organized by**: Ministry of Youth Affairs & Sports (MoYAS), Government of India
* **Knowledge Partner**: Indian Institute of Technology Bombay (GISE Hub & SJMSoM)
* **Thematic Area**: **Theme 4 — Governance & Civic Technology** *(with cross-impact on Theme 7: AI & Emerging Tech and Theme 6: Digital Inclusion)*
* **Team Name**: **Team Lotux** (Manipur)
* **Team Members**:
  * **Waikhom Preety Devi** — *Civic Policy, GFR 2017 & CVC Guidelines Research, Meetei Mayek Validation*
  * **Yumnam Adit Singh** — *System Architecture, Full-Stack Engineering (React/FastAPI), UI/UX Motion*

---

## 💡 The Problem: The Civic Procurement Gap

Public procurement accounts for nearly **20% to 25% of India's GDP**, funding critical schools, roads, medical centers, and public infrastructure. In Manipur—a border state where logistical costs and infrastructure resilience are paramount—every public rupee counts.

While official portals like the National Informatics Centre (NIC) GePNIC (`manipurtenders.gov.in`) make tender notices *technically available*, they remain *practically inaccessible* to citizens, journalists, and community leaders:

1. **Information Asymmetry**: Notices are buried in technical codes, multi-page PDFs, and fragmented portal pages.
2. **Compressed Bidding Windows**: High-value tenders are often modified by rapid, consecutive corrigenda, compressing the remaining bidding window to less than 72 hours—restricting fair participation without formally violating portal defaults.
3. **Absence of Plain Language**: Procurement legalisms obscure basic questions: *Who is procuring? What is being bought? How much money is involved? Where is the site?*
4. **Linguistic Exclusion**: Lack of bilingual access in the constitutional **Meetei Mayek** script alongside English.

```
[Official Portal PDF] ──> [Dense Legal Jargon] ──> [Information Gap] ──> Irreversible Contracts
                                                            │
                                                     [CHEIRAP LAYER]
                                                            │
                                              Actionable Civic Transparency
```

---

## 🚀 The Solution: What CHEIRAP Does

CHEIRAP acts as an intelligent comprehension layer between complex government portals and public questions. It adheres to **CVC (Central Vigilance Commission)** guidelines and **General Financial Rules (GFR 2017 Rule 161)** without ever making accusatory or speculative claims.

### Core Features

* 🔍 **Citizen Tender Explorer**: Search and filter Manipur tenders across departments, districts, values, and closing dates with an intuitive **Deadline View**.
* 📖 **Plain-Language Executive Brief**: Converts 80-page tenders into 4 clear citizen anchors:
  * *Who is procuring?* (Department & administrative chain)
  * *What is being bought?* (Scope & deliverables)
  * *Where is it located?* (District & PIN code)
  * *What does the budget mean?* (Estimated expenditure, EMD security, tender fee)
* ⏱️ **Visual Notice Flow Timeline Stepper**: A continuous 4-stage stepper (*Notice $\rightarrow$ Amendments $\rightarrow$ Submission Closes $\rightarrow$ Technical Opening*) that highlights when post-corrigendum response windows are compressed to $<72\text{ hours}$.
* 📊 **Peer Comparison Benchmark**: Automatically benchmarks a tender's duration and estimated expenditure against historical tenders from the same department to contextualize outliers.
* ✍️ **Citizen Action & Inquiry Generator**: One-click generation of polite, evidence-based inquiry letters citing specific Tender IDs, dates, and official URLs for RTI (Right to Information) filings or community oversight.
* 🌐 **Bilingual Meetei Mayek Support**: Complete rendering in the indigenous Meetei Mayek script (`ꯆꯩꯔꯥꯞ`) alongside English for genuine regional inclusion.
* 🔗 **100% Provenance & Source Traceability**: Direct one-click verification links back to the original `manipurtenders.gov.in` record.

---

## 🛠️ Architecture & Tech Stack

```mermaid
flowchart TD
    subgraph Data["1. Data Ingestion & Scoring"]
        Raw["Raw Manipur GePNIC Data (manipurtenders.gov.in)"] --> Normalizer["Normalization Engine"]
        Normalizer --> RuleEngine["GFR 2017 / CVC Rule Engine"]
        RuleEngine --> ScoredDB["92 Scored & Normalized Tender Snapshots"]
    end

    subgraph Backend["2. Backend Services (FastAPI + Python 3.12)"]
        ScoredDB --> API["FastAPI REST Endpoints (/api/tenders)"]
        API --> RegKB["Statutory Traceability & Knowledge Base"]
    end

    subgraph Frontend["3. Civic Interface (React 19 + TypeScript + Vite)"]
        API --> App["CHEIRAP Public App"]
        App --> Explorer["Tender Explorer & Deadline View"]
        App --> Brief["Executive Brief & Plain Decoder"]
        App --> Stepper["Notice Flow Timeline Stepper"]
        App --> Inquiry["Citizen Inquiry & RTI Drafter"]
    end

    style Data fill:#f8fafc,stroke:#cbd5e1
    style Backend fill:#e2e8f0,stroke:#64748b
    style Frontend fill:#15335b,stroke:#0284c7,color:#fff
```

### Technology Stack
* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, GSAP (GreenSock) for accessible UI motion.
* **Backend**: FastAPI, Uvicorn, Python 3.12, Pydantic schemas.
* **Storage & Privacy**: Zero server tracking; bookmarks, private notes, and draft inquiries remain securely in the citizen's browser storage.
* **Performance**: Sub-100ms local interaction response; fully responsive across desktop, tablet, and mobile.

---

## 📦 Getting Started

### Prerequisites
* **Node.js**: v18+ (v20+ recommended)
* **Python**: 3.10+
* **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/haapuchu/cheirap.git
   cd cheirap
   ```

2. **Install Python backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Frontend dependencies**:
   ```bash
   cd web
   npm install
   cd ..
   ```

### Running Locally

1. **Start the FastAPI Backend Service** (Port 8000):
   ```bash
   python -m uvicorn server.app:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Start the Vite Frontend Dev Server** (Port 5173):
   ```bash
   npm --prefix web run dev
   ```

3. **Open the App**:
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎯 Sample Demonstration Tenders

* **Tender ID `MAN_ED_PROC_2026_0142`**: *Procurement of Prefabricated Modular Infrastructure & Labs for Secondary Schools* (₹4.82 Cr, 3 Corrigenda, short response window).
* **Tender ID `2026_MSPDC_3473_1`**: *High-voltage power supply distribution works* (Complete timeline stepper lifecycle).
* **Tender ID `2026_FDM_3484_2`**: *Forest Department conservation logistics* (Standard 20-day open window).

---

## 🌏 Regional Scalability (Northeast Expansion)

While seeded with Manipur procurement data, CHEIRAP's normalized data dictionary is engineered to support e-tender portals across the Northeast:
* **Assam**: `assamtenders.gov.in`
* **Meghalaya**: `meghalayatenders.gov.in`
* **Tripura**: `tripuratenders.gov.in`
* **Mizoram**: `mizoramtenders.gov.in`
* **Nagaland**: `nagalandtenders.gov.in`

---

## 🇺🇳 Alignment with UN Sustainable Development Goals (SDGs)

* **SDG 16.6**: Develop effective, accountable, and transparent institutions at all levels.
* **SDG 16.10**: Ensure public access to information and protect fundamental freedoms in accordance with national legislation.
* **SDG 9.1**: Develop quality, reliable, sustainable, and resilient infrastructure for economic development and human wellbeing.

---

## 🛡️ Responsible Use & Legal Neutrality Disclaimer

CHEIRAP is an educational, civic-information, and decision-support layer. It is **not** a court of law, a formal vigilance authority, or an enforcement agency. All flags (such as *"Short bidding window"* or *"Several changes recorded"*) are **review signals** designed to encourage public scrutiny of original records—never accusations of wrongdoing. All claims link directly to the official government source for independent verification.

---

## 🤖 AI Tool Usage Disclosure

*In compliance with Section 2.2 of the Hack for Social Cause competition guidelines:*
* **Extent of AI Tool Usage**: Approximately **25%** of the engineering workflow.
* **Application**: Used AI coding assistants for writing Playwright UI regression tests, optimizing CSS variable mappings, and structuring documentation outlines.
* **Original Human Architecture**: Core scoring logic, CVC compliance heuristics, GFR 2017 thresholds, Meetei Mayek script validation, and full-stack product architecture were 100% human-designed and implemented by Team Lotux.

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ in Manipur by Team Lotux**  
*Waikhom Preety Devi & Yumnam Adit Singh*  
*Viksit Bharat Young Leaders Dialogue 2027*
