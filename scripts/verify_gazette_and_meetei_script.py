import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_gazette_and_meetei():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        print("[STEP 1] Navigating to http://localhost:5173/...")
        page.goto('http://localhost:5173/', wait_until='networkidle')
        time.sleep(1)

        # 1. Verify Meetei Mayek script in header and hero
        content = page.content()
        assert "ꯆꯩꯔꯥꯞ" in content, "Error: Meetei Mayek script ꯆꯩꯔꯥꯞ not found on page!"
        assert "চৈরাপ" not in content, "Error: Bengali script চৈরাপ found on page! Should be purely Meetei Mayek."
        print("  ✓ Verified Meetei Mayek ꯆꯩꯔꯥꯞ present and Bengali script strictly absent!")

        # Take screenshot of main page with Meetei Mayek
        page.screenshot(path="artifacts/gazette_test_01_main_meetei.png")

        # 2. Switch to Monitoring Dashboard
        print("[STEP 2] Navigating to Monitoring Dashboard...")
        dash_btn = page.locator("button:has-text('Monitoring Dashboard')").first
        dash_btn.click()
        time.sleep(1)

        # 3. Open first case dossier
        print("[STEP 3] Opening case dossier for high-risk tender...")
        dossier_btn = page.locator("button:has-text('Examine Regulatory Dossier'), button:has-text('Dossier')").first
        dossier_btn.click()
        time.sleep(1.5)

        # Verify dossier header has Meetei Mayek
        dossier_text = page.locator("div[role='dialog'], .fixed").first.inner_text()
        assert "ꯆꯩꯔꯥꯞ" in dossier_text, "Meetei Mayek missing in dossier header!"
        print("  ✓ Dossier opened with Meetei Mayek title and Gazette PIAR button visible.")

        page.screenshot(path="artifacts/gazette_test_02_dossier_open.png")

        # 4. Click on Tab 7: "14-Section Gazette PIAR"
        print("[STEP 4] Clicking on Tab 7: 14-Section Gazette PIAR...")
        report_tab = page.locator("button:has-text('14-Section')").first
        report_tab.click()
        time.sleep(2)

        # Verify Gazette Masthead and Sections
        gazette_text = page.locator(".gazette-print-container").inner_text()
        gazette_upper = gazette_text.upper()
        assert "THE MANIPUR GAZETTE" in gazette_upper, "Gazette masthead missing!"
        assert "EXTRAORDINARY" in gazette_upper, "Extraordinary text missing!"
        assert "PRE-AWARD INTEGRITY ASSESSMENT REPORT" in gazette_upper, "PIAR title missing!"
        assert "ꯆꯩꯔꯥꯞ" in gazette_text, "Meetei Mayek missing in Gazette title!"
        assert "EXECUTIVE SUMMARY" in gazette_upper, "Section 1 missing!"
        assert "PROCUREMENT DOSSIER" in gazette_upper or "PROCUREMENT DETAILS" in gazette_upper, "Section 2 missing!"
        assert "DUAL ENGINE TELEMETRY" in gazette_upper or "RISK ASSESSMENT" in gazette_upper, "Section 3 missing!"
        assert "KEY EVIDENTIARY DOSSIER" in gazette_upper, "Section 4 missing!"
        assert "PROCEDURAL & TEMPORAL ANOMALY ANALYSIS" in gazette_upper, "Section 5 missing!"
        assert "BIDDER MARKET INTELLIGENCE" in gazette_upper, "Section 6 missing!"
        assert "FINANCIAL INTEGRITY" in gazette_upper, "Section 7 missing!"
        assert "STATUTORY REGULATORY RELEVANCE" in gazette_upper, "Section 8 missing!"
        assert "DELEGATION OF FINANCIAL POWERS" in gazette_upper, "Section 9 missing!"
        assert "RECOMMENDED STATUTORY VIGILANCE INTERVENTIONS" in gazette_upper, "Section 10 missing!"
        assert "COMPETENT OFFICER COMMENTS" in gazette_upper, "Section 11 missing!"
        assert "COMPETENT AUTHORITY PRE-AWARD DETERMINATION" in gazette_upper, "Section 12 missing!"
        assert "IMMUTABLE AUDIT TRAIL" in gazette_upper, "Section 13 missing!"
        assert "AUTHORITATIVE REGULATORY SOURCES" in gazette_upper, "Section 14 missing!"
        assert "BY ORDER AND IN THE NAME OF THE GOVERNOR OF MANIPUR" in gazette_upper, "Gazette sign-off missing!"
        print("  ✓ Verified all 14 structured Gazette sections and official sign-off!")

        page.screenshot(path="artifacts/gazette_test_03_tab7_gazette_view.png")

        # 5. Open standalone Gazette Print Modal from Header button
        print("[STEP 5] Clicking header 'Gazette PIAR' button...")
        header_gazette_btn = page.locator("#open-gazette-modal-btn")
        header_gazette_btn.click()
        time.sleep(2)

        modal_title = page.locator("text=The Manipur Gazette • Pre-Award Integrity Assessment Report").first
        assert modal_title.is_visible(), "Standalone Gazette Modal failed to open!"
        print("  ✓ Standalone Gazette Modal opened successfully!")

        page.screenshot(path="artifacts/gazette_test_04_standalone_gazette_modal.png")

        # 6. Test Escape key: Should close only the Gazette modal, keeping Case Detail open!
        print("[STEP 6] Testing Escape key behavior...")
        page.keyboard.press("Escape")
        time.sleep(1)

        # Standalone modal should be closed
        assert not page.locator("text=The Manipur Gazette • Pre-Award Integrity Assessment Report").is_visible(), "Gazette modal did not close on first Esc!"
        # Case detail modal should STILL be open
        assert page.locator("button:has-text('Close Dossier')").is_visible(), "Case Detail modal was accidentally closed on first Esc!"
        print("  ✓ First Esc closed only the Gazette Modal. Case Detail remains open!")

        page.screenshot(path="artifacts/gazette_test_05_after_first_esc.png")

        # 7. Second Escape key: Should close the Case Detail modal
        page.keyboard.press("Escape")
        time.sleep(1)
        assert not page.locator("button:has-text('Close Dossier')").is_visible(), "Case Detail modal did not close on second Esc!"
        print("  ✓ Second Esc closed the Case Detail Modal. Clean return to dashboard!")

        page.screenshot(path="artifacts/gazette_test_06_after_second_esc.png")

        browser.close()
        print("\nALL GAZETTE & SCRIPT VERIFICATION CHECKS PASSED 100%!")

if __name__ == "__main__":
    test_gazette_and_meetei()
