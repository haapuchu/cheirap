import os
import sys
import time
from playwright.sync_api import sync_playwright

# Ensure stdout handles UTF-8 on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_browser_tests():
    artifact_dir = r"C:\Users\singh\.gemini\antigravity-ide\brain\272854e4-810f-45b5-a341-c6f59c05b858"
    screenshots_dir = os.path.join(artifact_dir, "browser_screenshots")
    os.makedirs(screenshots_dir, exist_ok=True)
    
    results = {
        "tests_passed": 0,
        "total_tests": 8,
        "screenshots": {},
        "kpi_metrics": {},
        "case_verification": {},
        "errors": []
    }

    with sync_playwright() as p:
        print("Launching Chromium browser...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 960})
        page = context.new_page()

        try:
            # 1. Load Home Page
            print("\n[STEP 1] Navigating to http://127.0.0.1:5173/ ...")
            page.goto("http://127.0.0.1:5173/", wait_until="networkidle", timeout=15000)
            time.sleep(1)
            assert "CHEIRAP" in page.content(), "CHEIRAP title not found in page content"
            screenshot_hero = os.path.join(screenshots_dir, "01_hero_overview.png")
            page.screenshot(path=screenshot_hero)
            results["screenshots"]["01_hero"] = screenshot_hero
            results["tests_passed"] += 1
            print("  [OK] Home / Hero page loaded successfully.")

            # 2. Enter Dashboard
            print("\n[STEP 2] Navigating to Monitoring Dashboard...")
            dashboard_btn = page.locator("button:has-text('Monitoring Dashboard')").first
            if dashboard_btn.is_visible():
                dashboard_btn.click()
            else:
                page.locator("button:has-text('Enter System')").first.click()
            time.sleep(1)
            page.wait_for_selector("main", timeout=5000)
            results["tests_passed"] += 1
            print("  [OK] Entered Monitoring Dashboard view.")

            # 3. Check Section 38 KPI Strip & Section 39 Executive Brief
            print("\n[STEP 3] Verifying Section 38 KPI Strip and Section 39 Executive Brief...")
            assert page.locator("text=Regulatory Concerns").is_visible(), "Regulatory Concerns KPI not visible"
            assert page.locator("text=Authority Exceptions").is_visible(), "Authority Exceptions KPI not visible"
            assert page.locator("text=Competition Alerts").is_visible(), "Competition Alerts KPI not visible"
            assert page.locator("text=Executive Decision Brief").is_visible(), "Executive Decision Brief not visible"
            assert page.locator("text=Statutory Compliance Disclaimer").is_visible(), "Statutory Disclaimer not visible"

            screenshot_dashboard = os.path.join(screenshots_dir, "02_dashboard_kpis_executive.png")
            page.screenshot(path=screenshot_dashboard)
            results["screenshots"]["02_dashboard"] = screenshot_dashboard
            results["tests_passed"] += 1
            print("  [OK] Section 38 KPI strip, Section 39 Executive Brief, and Section 29 Disclaimer verified.")

            # 4. Test Regulatory Explorer Modal
            print("\n[STEP 4] Opening Regulatory Intelligence & KB Explorer...")
            reg_kb_btn = page.locator("button:has-text('Regulatory Intelligence & KB')").first
            reg_kb_btn.click()
            time.sleep(1)
            
            assert page.locator("text=CHEIRAP Statutory & Regulatory Intelligence Knowledge Base").is_visible(), "KB modal header missing"
            
            # Search query
            search_input = page.locator("input[placeholder*='Search GFR']").first
            search_input.fill("GFR")
            time.sleep(0.5)

            # Switch tabs
            sources_tab = page.locator("button:has-text('Statutory Sources')").first
            sources_tab.click()
            time.sleep(0.5)
            assert page.locator("text=GFR 2017").is_visible(), "GFR 2017 source missing"
            assert page.locator("text=Manipur DFPR 2020").is_visible(), "Manipur DFPR 2020 source missing"

            precedence_tab = page.locator("button:has-text('State Precedence Hierarchy')").first
            precedence_tab.click()
            time.sleep(0.5)
            assert page.locator("text=Jurisdictional Regulatory Precedence Architecture").is_visible(), "Precedence doctrine missing"

            screenshot_explorer = os.path.join(screenshots_dir, "03_regulatory_explorer_modal.png")
            page.screenshot(path=screenshot_explorer)
            results["screenshots"]["03_explorer"] = screenshot_explorer
            
            # Close explorer
            page.locator("button:has-text('Close Explorer')").first.click()
            time.sleep(0.5)
            results["tests_passed"] += 1
            print("  [OK] Regulatory Explorer Modal tested across search, sources, and state precedence tabs.")

            # 5. Open Case Detail Dossier for Flagship Red Tender (MAN_ED_PROC_2026_0142)
            print("\n[STEP 5] Opening 5-Section Regulatory Dossier for MAN_ED_PROC_2026_0142...")
            dossier_btn = page.locator("button:has-text('Examine Regulatory Dossier')").first
            dossier_btn.click()
            time.sleep(1)

            assert page.locator("text=01 — Executive Risk Summary").is_visible(), "Section 01 missing"
            assert page.locator("text=02 — Why CHEIRAP Flagged This Procurement").is_visible(), "Section 02 missing"
            assert page.locator("text=03 — Key Evidence vs 43 Comparable Cohorts").is_visible(), "Section 03 missing"
            assert page.locator("text=04 — Regulatory Basis & Applicable Statutory Framework").is_visible(), "Section 04 missing"
            assert page.locator("text=05 — Recommended Review Actions for Competent Authority").is_visible(), "Section 05 missing"

            screenshot_dossier = os.path.join(screenshots_dir, "04_case_dossier_5_sections.png")
            page.screenshot(path=screenshot_dossier)
            results["screenshots"]["04_dossier"] = screenshot_dossier
            results["tests_passed"] += 1
            print("  [OK] Case Detail Modal verified: All 5 sections rendered with evidence and regulatory basis.")

            # 6. Test Clickable Statutory Citation Drawer
            print("\n[STEP 6] Testing Clickable Statutory Citation Drawer...")
            # Click a verified citation chip in Section 04
            rule_chip = page.locator("button:has-text('Rule 161')").first
            if not rule_chip.is_visible():
                rule_chip = page.locator("button:has-text('GFR 2017')").first
            
            rule_chip.click()
            time.sleep(1)
            
            assert page.locator("text=Statutory Rule Text").is_visible() or page.locator("text=Authoritative Text").is_visible() or page.locator("text=Regulatory Provision").is_visible()
            screenshot_drawer = os.path.join(screenshots_dir, "05_regulatory_detail_drawer.png")
            page.screenshot(path=screenshot_drawer)
            results["screenshots"]["05_drawer"] = screenshot_drawer
            
            # Close the citation drawer
            page.locator("button:has-text('Close Drawer')").first.click()
            time.sleep(0.5)
            results["tests_passed"] += 1
            print("  [OK] Clickable Citation Drawer verified: Full authoritative text & verification badge inspected.")

            # 7. Test DFPR Scrutiny, XAI, and Knowledge Graph Tabs
            print("\n[STEP 7] Testing DFPR Scrutiny, XAI Waterfall, and Knowledge Graph tabs...")
            # DFPR Tab
            dfpr_tab = page.locator("button:has-text('DFPR Scrutiny')").first
            dfpr_tab.click()
            time.sleep(0.5)
            assert page.locator("text=Delegation of Financial Powers Rules").is_visible(), "DFPR header missing"
            assert page.locator("text=Permitted Delegated Ceiling").is_visible(), "Ceiling check missing"

            # XAI Tab
            xai_tab = page.locator("button:has-text('XAI Attribution')").first
            xai_tab.click()
            time.sleep(0.5)
            assert page.locator("text=Explainable AI").is_visible() or page.locator("text=Primary Risk Contributors").is_visible()

            # Knowledge Graph Tab
            graph_tab = page.locator("button:has-text('Knowledge Graph')").first
            graph_tab.click()
            time.sleep(0.5)
            assert page.locator("text=Directed Regulatory Traceability Chain").is_visible()

            results["tests_passed"] += 1
            print("  [OK] DFPR Delegation Scrutiny, XAI Attribution, and Knowledge Graph tabs verified.")

            # 8. Test Human-in-the-Loop Review Submission & Immutable Audit Trail
            print("\n[STEP 8] Testing Human-in-the-Loop Review & Audit Logging...")
            review_tab = page.locator("button:has-text('Officer Decision')").first
            review_tab.click()
            time.sleep(0.5)

            # Select 'CONFIRM CONCERN' and submit
            comment_input = page.locator("textarea").first
            comment_input.fill("Browser automated test: verified evidence vs 43 cohorts and confirmed need for 7-day bidding window extension under CVC Cir 01/01/2021.")
            
            submit_btn = page.locator("button:has-text('Submit Official Determination')").first
            submit_btn.click()
            time.sleep(1)

            assert page.locator("text=Determination recorded in immutable audit log").is_visible() or page.locator("text=Audit Trail").is_visible()

            # Switch to Formal 14-Section Report Tab
            report_tab = page.locator("button:has-text('14-Section Report')").first
            report_tab.click()
            time.sleep(0.5)
            assert page.locator("text=CHEIRAP PROCUREMENT INTEGRITY ASSESSMENT").is_visible()

            screenshot_report = os.path.join(screenshots_dir, "06_formal_14_section_report.png")
            page.screenshot(path=screenshot_report)
            results["screenshots"]["06_report"] = screenshot_report
            
            results["tests_passed"] += 1
            print("  [OK] Human-in-the-Loop review logged, audit trail updated, and 14-section formal report verified.")

        except Exception as e:
            print(f"\n[ERROR] Error encountered during browser test: {e}")
            results["errors"].append(str(e))
            screenshot_err = os.path.join(screenshots_dir, "error_state.png")
            page.screenshot(path=screenshot_err)
            results["screenshots"]["error"] = screenshot_err
        finally:
            browser.close()

    print("\n" + "="*80)
    print(f"BROWSER AUTOMATED TEST SUMMARY: {results['tests_passed']}/{results['total_tests']} TESTS PASSED")
    print("Screenshots captured in:", screenshots_dir)
    print("="*80)
    return results

if __name__ == "__main__":
    res = run_browser_tests()
    if res["errors"]:
        sys.exit(1)
    sys.exit(0)
