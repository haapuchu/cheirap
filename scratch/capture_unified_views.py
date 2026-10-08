import os
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs('artifacts', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://127.0.0.1:5173", wait_until="networkidle")
    page.wait_for_timeout(1500)

    # Check 1: Overview Landing Page (No Login, Pure GovTech Branding)
    page.screenshot(path="artifacts/01_cheirap_overview_landing.png", full_page=False)
    print("[✓] Saved artifacts/01_cheirap_overview_landing.png")

    # Check 2: Tender Surveillance (Pre-Award)
    tender_tab = page.locator("button:has-text('Tender Surveillance (Pre-Award)')").first
    tender_tab.click()
    page.wait_for_timeout(1500)
    page.screenshot(path="artifacts/02_tender_surveillance_unified.png", full_page=False)
    print("[✓] Saved artifacts/02_tender_surveillance_unified.png")

    # Check 3: Pre-Award Tender Modal (Inspect Official Notice / Records)
    notice_btn = page.locator("button:has-text('Official Notice')").first
    if notice_btn.count() > 0:
        notice_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="artifacts/03_tender_official_notice_modal.png", full_page=False)
        print("[✓] Saved artifacts/03_tender_official_notice_modal.png")
        # Close notice modal
        page.keyboard.press("Escape")
        page.wait_for_timeout(500)

    # Check 4: Works & Ground Assurance (Post-Award)
    works_tab = page.locator("button:has-text('Works & Ground Assurance (Post-Award)')").first
    works_tab.click()
    page.wait_for_timeout(1500)
    page.screenshot(path="artifacts/04_works_assurance_unified.png", full_page=False)
    print("[✓] Saved artifacts/04_works_assurance_unified.png")

    # Check 5: Filter Critical Projects
    crit_btn = page.locator("button:has-text('At Risk / Critical')").first
    if crit_btn.count() > 0:
        crit_btn.click()
        page.wait_for_timeout(800)
        page.screenshot(path="artifacts/05_works_critical_filtered.png", full_page=False)
        print("[✓] Saved artifacts/05_works_critical_filtered.png")

    # Check 6: Open Evidence Dossier on Works Assurance
    dossier_btn = page.locator("button:has-text('Inspect Official Dossier')").first
    if dossier_btn.count() == 0:
        dossier_btn = page.locator("button:has-text('Dossier')").first
    
    if dossier_btn.count() > 0:
        dossier_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="artifacts/06_works_dossier_tab1_gps.png", full_page=False)
        print("[✓] Saved artifacts/06_works_dossier_tab1_gps.png")

        # Tab 2: Photo Authenticity
        photo_tab = page.locator("button:has-text('Photo Authenticity')").first
        if photo_tab.count() > 0:
            photo_tab.click()
            page.wait_for_timeout(600)
            page.screenshot(path="artifacts/07_works_dossier_tab2_photos.png", full_page=False)
            print("[✓] Saved artifacts/07_works_dossier_tab2_photos.png")

        # Tab 3: Timeline & Milestones
        timeline_tab = page.locator("button:has-text('Timeline & Milestones')").first
        if timeline_tab.count() > 0:
            timeline_tab.click()
            page.wait_for_timeout(600)
            page.screenshot(path="artifacts/08_works_dossier_tab3_timeline.png", full_page=False)
            print("[✓] Saved artifacts/08_works_dossier_tab3_timeline.png")

        # Tab 4: Fund Release Matching
        fund_tab = page.locator("button:has-text('Fund Release Matching')").first
        if fund_tab.count() > 0:
            fund_tab.click()
            page.wait_for_timeout(600)
            page.screenshot(path="artifacts/09_works_dossier_tab4_funds.png", full_page=False)
            print("[✓] Saved artifacts/09_works_dossier_tab4_funds.png")

        # Close Modal
        close_btn = page.locator("button:has-text('Close Dossier')").first
        if close_btn.count() > 0:
            close_btn.click()
        else:
            page.keyboard.press("Escape")
        page.wait_for_timeout(500)

    # Check 7: District Matrix View
    matrix_btn = page.locator("button:has-text('District Matrix')").first
    if matrix_btn.count() > 0:
        matrix_btn.click()
        page.wait_for_timeout(800)
        page.screenshot(path="artifacts/10_works_district_matrix.png", full_page=False)
        print("[✓] Saved artifacts/10_works_district_matrix.png")

    # Check 8: Mobile Responsiveness (iPhone 14 Pro viewport 390x844)
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(800)
    page.screenshot(path="artifacts/11_cheirap_mobile_view.png", full_page=False)
    print("[✓] Saved artifacts/11_cheirap_mobile_view.png")

    browser.close()
    print("\n[SUCCESS] All unified CHEIRAP browser verifications completed!")
