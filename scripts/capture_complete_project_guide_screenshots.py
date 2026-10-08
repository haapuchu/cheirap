import asyncio
import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

from playwright.async_api import async_playwright

async def capture_all():
    print("================================================================================", flush=True)
    print("CHEIRAP AI: SYSTEMATIC HIGH-RESOLUTION SCREENSHOT HARVESTER FOR PROJECT GUIDE", flush=True)
    print("================================================================================", flush=True)

    artifacts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts", "guide_screenshots")
    os.makedirs(artifacts_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Create 1440x950 high-DPI viewport for crisp government-grade imagery
        page = await browser.new_page(viewport={"width": 1440, "height": 950}, device_scale_factor=1.5)

        # -------------------------------------------------------------
        # 1. OVERVIEW PAGE: Top Header, Marquee, Command Banner & KPI Strip
        # -------------------------------------------------------------
        print("\n[1/18] Capturing Overview Hero Page...", flush=True)
        await page.goto("http://localhost:5173/")
        await page.wait_for_selector(".gov-ticker-content")
        await asyncio.sleep(1.2)
        await page.screenshot(path=os.path.join(artifacts_dir, "01_overview_hero_command_center.png"))
        print("  -> Saved 01_overview_hero_command_center.png", flush=True)

        # -------------------------------------------------------------
        # 2. OVERVIEW PAGE: Tactical Tab 1 - 1. Forensic Articulation
        # -------------------------------------------------------------
        print("\n[2/18] Capturing Overview Tab 1 (1. Forensic Articulation)...", flush=True)
        tab1_btn = page.locator("button:has-text('1. Forensic Articulation')")
        if await tab1_btn.count() > 0:
            await tab1_btn.click()
            await asyncio.sleep(0.5)
            await page.screenshot(path=os.path.join(artifacts_dir, "02_overview_tab_problem_articulation.png"))
            print("  -> Saved 02_overview_tab_problem_articulation.png", flush=True)

        # -------------------------------------------------------------
        # 3. OVERVIEW PAGE: Tactical Tab 2 - 2. The 4 Exploits
        # -------------------------------------------------------------
        print("\n[3/18] Capturing Overview Tab 2 (2. The 4 Exploits)...", flush=True)
        tab2_btn = page.locator("button:has-text('2. The 4 Exploits')")
        if await tab2_btn.count() > 0:
            await tab2_btn.click()
            await asyncio.sleep(0.5)
            await page.screenshot(path=os.path.join(artifacts_dir, "03_overview_tab_four_exploits.png"))
            print("  -> Saved 03_overview_tab_four_exploits.png", flush=True)

        # -------------------------------------------------------------
        # 4. OVERVIEW PAGE: Tactical Tab 3 - 3. Dual-Brain AI
        # -------------------------------------------------------------
        print("\n[4/18] Capturing Overview Tab 3 (3. Dual-Brain AI)...", flush=True)
        tab3_btn = page.locator("button:has-text('3. Dual-Brain AI')")
        if await tab3_btn.count() > 0:
            await tab3_btn.click()
            await asyncio.sleep(0.5)
            await page.screenshot(path=os.path.join(artifacts_dir, "04_overview_tab_dual_brain_ai.png"))
            print("  -> Saved 04_overview_tab_dual_brain_ai.png", flush=True)

        # -------------------------------------------------------------
        # 5. OVERVIEW PAGE: Tactical Tab 4 - 4. Venue Verification & Sonar Radar
        # -------------------------------------------------------------
        print("\n[5/18] Capturing Overview Tab 4 (4. Venue Verification & Sonar Radar)...", flush=True)
        tab4_btn = page.locator("button:has-text('4. Venue Verification')")
        if await tab4_btn.count() > 0:
            await tab4_btn.click()
            await asyncio.sleep(0.8) # Allow Radar Scanner GSAP loop
            await page.screenshot(path=os.path.join(artifacts_dir, "05_overview_tab_venue_sonar_radar.png"))
            print("  -> Saved 05_overview_tab_venue_sonar_radar.png", flush=True)

        # -------------------------------------------------------------
        # 6. STATUTORY COMPENDIUM MODAL (CVC & GFR)
        # -------------------------------------------------------------
        print("\n[6/18] Capturing Statutory Compendium Modal...", flush=True)
        rules_btn = page.locator("button:has-text('Statutory Compendium (CVC & GFR)')").first
        await rules_btn.click()
        await page.wait_for_selector(".max-w-3xl")
        await asyncio.sleep(0.5)
        await page.screenshot(path=os.path.join(artifacts_dir, "06_statutory_compendium_modal.png"))
        print("  -> Saved 06_statutory_compendium_modal.png", flush=True)
        await page.keyboard.press("Escape")
        await asyncio.sleep(0.4)

        # -------------------------------------------------------------
        # 7. REGULATORY INTELLIGENCE & KNOWLEDGE BASE MODAL
        # -------------------------------------------------------------
        print("\n[7/18] Capturing Regulatory Intelligence Explorer Modal...", flush=True)
        reg_btn = page.locator("button:has-text('Regulatory Intelligence & KB')")
        await reg_btn.click()
        await page.wait_for_selector(".max-w-5xl")
        await asyncio.sleep(0.6)
        await page.screenshot(path=os.path.join(artifacts_dir, "07_regulatory_intelligence_kb_modal.png"))
        print("  -> Saved 07_regulatory_intelligence_kb_modal.png", flush=True)

        # -------------------------------------------------------------
        # 8. REGULATORY DETAIL PROVISION DRILL-DOWN MODAL
        # -------------------------------------------------------------
        print("\n[8/18] Capturing Regulatory Detail Drill-Down Modal...", flush=True)
        provision_card = page.locator(".max-w-5xl .space-y-3 > div.group").first
        if await provision_card.count() > 0:
            await provision_card.click()
            await page.wait_for_selector(".max-w-2xl")
            await asyncio.sleep(0.5)
            await page.screenshot(path=os.path.join(artifacts_dir, "08_regulatory_provision_detail_modal.png"))
            print("  -> Saved 08_regulatory_provision_detail_modal.png", flush=True)
            # Close detail modal
            await page.keyboard.press("Escape")
            await asyncio.sleep(0.3)
        # Close explorer modal
        await page.keyboard.press("Escape")
        await asyncio.sleep(0.4)

        # -------------------------------------------------------------
        # 9. LOGIN & AUTHENTICATION PORTAL (NIC e-Pramaan SSO)
        # -------------------------------------------------------------
        print("\n[9/18] Capturing Login & Authentication Portal...", flush=True)
        login_btn = page.locator("button:has-text('Officer Login')")
        await login_btn.click()
        await page.wait_for_selector("text=e-Procurement Integrity Monitoring System")
        await asyncio.sleep(0.5)
        await page.screenshot(path=os.path.join(artifacts_dir, "09_officer_login_portal.png"))
        print("  -> Saved 09_officer_login_portal.png", flush=True)

        # -------------------------------------------------------------
        # 10. SURVEILLANCE & MONITORING DASHBOARD (MIS View)
        # -------------------------------------------------------------
        print("\n[10/18] Capturing Monitoring Dashboard Main View...", flush=True)
        auth_btn = page.locator("button:has-text('Sign In & Access Dashboard')")
        await auth_btn.click()
        await page.wait_for_selector("table")
        await asyncio.sleep(1.2) # Allow AnimatedNumber count-up
        await page.screenshot(path=os.path.join(artifacts_dir, "10_monitoring_dashboard_main.png"))
        print("  -> Saved 10_monitoring_dashboard_main.png", flush=True)

        # -------------------------------------------------------------
        # 11. QUICK VIEW MODAL (Tender Preview)
        # -------------------------------------------------------------
        print("\n[11/18] Capturing Quick View Tender Modal...", flush=True)
        quick_view_btn = page.locator("#quick-view-banner-btn")
        if await quick_view_btn.count() > 0:
            await quick_view_btn.click()
            await page.wait_for_selector("#quickview-titlebar")
            await asyncio.sleep(0.5)
            await page.screenshot(path=os.path.join(artifacts_dir, "11_quick_view_modal.png"))
            print("  -> Saved 11_quick_view_modal.png", flush=True)
            await page.locator("#close-quickview-btn").click()
            await page.wait_for_selector("#quickview-titlebar", state="hidden")
            await asyncio.sleep(0.3)

        # -------------------------------------------------------------
        # 12. FORENSIC CASE DOSSIER MODAL (Full Radar + Timeline + Rules)
        # -------------------------------------------------------------
        print("\n[12/18] Capturing Forensic Case Dossier Modal...", flush=True)
        dossier_btn = page.locator("button:has-text('Examine Regulatory Dossier')").first
        await dossier_btn.click()
        await page.wait_for_selector("#case-dossier-titlebar")
        await asyncio.sleep(0.8) # radar chart render
        await page.screenshot(path=os.path.join(artifacts_dir, "12_forensic_case_dossier_modal.png"))
        print("  -> Saved 12_forensic_case_dossier_modal.png", flush=True)

        # -------------------------------------------------------------
        # 13. REAL SOURCE TENDER INSPECTOR MODAL - Tab 1: Sheet View
        # -------------------------------------------------------------
        print("\n[13/18] Capturing Real Source Tender Inspector Modal (Sheet Tab)...", flush=True)
        source_portal_btn = page.locator("#open-original-tender-modal-btn")
        if await source_portal_btn.count() > 0:
            await source_portal_btn.click()
            await page.wait_for_selector("#portal-inspector-title")
            await asyncio.sleep(0.8)
            await page.screenshot(path=os.path.join(artifacts_dir, "13_real_source_portal_sheet_tab.png"))
            print("  -> Saved 13_real_source_portal_sheet_tab.png", flush=True)
            
            # Capture Tab 2: Verification Guide
            print("  -> Capturing Tab 2: Live Portal Verification Guide...", flush=True)
            tab_guide = page.locator("#tab-guide-btn")
            if await tab_guide.count() > 0:
                await tab_guide.click()
                await asyncio.sleep(0.5)
                await page.screenshot(path=os.path.join(artifacts_dir, "13b_real_source_portal_guide_tab.png"))
                print("  -> Saved 13b_real_source_portal_guide_tab.png", flush=True)

            # Capture Tab 3: Raw Crawler Telemetry
            print("  -> Capturing Tab 3: Ingested JSON & Crawler Telemetry...", flush=True)
            tab_raw = page.locator("#tab-raw-btn")
            if await tab_raw.count() > 0:
                await tab_raw.click()
                await asyncio.sleep(0.5)
                await page.screenshot(path=os.path.join(artifacts_dir, "13c_real_source_portal_raw_telemetry_tab.png"))
                print("  -> Saved 13c_real_source_portal_raw_telemetry_tab.png", flush=True)

            # Close Inspector Modal
            await page.keyboard.press("Escape")
            await page.wait_for_selector("#portal-inspector-title", state="hidden")
            await asyncio.sleep(0.4)

        # -------------------------------------------------------------
        # 14. OFFICIAL STATE GAZETTE REPORT MODAL (Meetei Mayek + Legal Order)
        # -------------------------------------------------------------
        print("\n[14/18] Capturing Official State Gazette Report Modal...", flush=True)
        gazette_btn = page.locator("#open-gazette-modal-btn")
        if await gazette_btn.count() > 0:
            await gazette_btn.click()
            await page.wait_for_selector("#gazette-modal-title")
            await asyncio.sleep(0.8)
            await page.screenshot(path=os.path.join(artifacts_dir, "14_state_gazette_report_modal.png"))
            print("  -> Saved 14_state_gazette_report_modal.png", flush=True)
            await page.keyboard.press("Escape")
            await page.wait_for_selector("#gazette-modal-title", state="hidden")
            await asyncio.sleep(0.4)

        # Close Case Detail Modal
        await page.keyboard.press("Escape")
        await page.wait_for_selector("#case-dossier-titlebar", state="hidden")
        await asyncio.sleep(0.4)

        # -------------------------------------------------------------
        # 15. STATUTORY PRE-AWARD HOLD NOTICE MODAL (Seal Stamp GSAP Animation)
        # -------------------------------------------------------------
        print("\n[15/18] Capturing Pre-Award Hold Notice Modal (with GSAP Stamp)...", flush=True)
        hold_notice_btn = page.locator("button:has-text('Pre-Award Hold Notice')").first
        await hold_notice_btn.click()
        await page.wait_for_selector("#dispatch-stay-eoffice-btn")
        await asyncio.sleep(0.8) # allow seal stamp GSAP animation to settle
        await page.screenshot(path=os.path.join(artifacts_dir, "15_statutory_hold_notice_modal.png"))
        print("  -> Saved 15_statutory_hold_notice_modal.png", flush=True)
        await page.keyboard.press("Escape")
        await page.wait_for_selector("#dispatch-stay-eoffice-btn", state="hidden")
        await asyncio.sleep(0.4)

        # -------------------------------------------------------------
        # 16. EXPANDED TABLE ROW FORENSIC TIMELINE (In Monitoring Dashboard)
        # -------------------------------------------------------------
        print("\n[16/18] Capturing Expanded Table Row Forensic Timeline...", flush=True)
        info_btn = page.locator("button:has-text('Info')").first
        if await info_btn.count() > 0:
            await info_btn.click()
            await asyncio.sleep(0.5)
            # Scroll slightly to show the expanded row clearly
            await page.mouse.wheel(0, 360)
            await asyncio.sleep(0.5)
            await page.screenshot(path=os.path.join(artifacts_dir, "16_dashboard_expanded_row_timeline.png"))
            print("  -> Saved 16_dashboard_expanded_row_timeline.png", flush=True)
            # Close expanded row
            close_info_btn = page.locator("button:has-text('Close')").first
            if await close_info_btn.count() > 0:
                await close_info_btn.click()
                await asyncio.sleep(0.3)

        # Scroll back to top
        await page.evaluate("window.scrollTo(0, 0)")
        await asyncio.sleep(0.3)

        # -------------------------------------------------------------
        # 17. HIGH CONTRAST ACCESSIBILITY MODE
        # -------------------------------------------------------------
        print("\n[17/18] Capturing High Contrast Accessibility Mode...", flush=True)
        contrast_btn = page.locator("button:has-text('Contrast:')")
        await contrast_btn.click()
        await asyncio.sleep(0.5)
        await page.screenshot(path=os.path.join(artifacts_dir, "17_high_contrast_accessibility_mode.png"))
        print("  -> Saved 17_high_contrast_accessibility_mode.png", flush=True)
        # Reset contrast
        await contrast_btn.click()
        await asyncio.sleep(0.3)

        # -------------------------------------------------------------
        # 18. MEATEI MAYEK NATIVE SCRIPT PURITY MODE
        # -------------------------------------------------------------
        print("\n[18/18] Capturing Meetei Mayek Language Purity Mode...", flush=True)
        mn_btn = page.locator("button:has-text('ꯃꯩꯇꯩꯂꯣꯟ')")
        await mn_btn.click()
        await asyncio.sleep(0.5)
        await page.screenshot(path=os.path.join(artifacts_dir, "18_meetei_mayek_language_mode.png"))
        print("  -> Saved 18_meetei_mayek_language_mode.png", flush=True)
        # Switch back to English
        en_btn = page.locator("button:has-text('English')")
        await en_btn.click()
        await asyncio.sleep(0.3)

        await browser.close()
        print("\n================================================================================", flush=True)
        print("ALL 18+ SYSTEMATIC HIGH-RES SCREENSHOTS HARVESTED SUCCESSFULLY!", flush=True)
        print("Location:", artifacts_dir, flush=True)
        print("================================================================================", flush=True)

if __name__ == "__main__":
    asyncio.run(capture_all())
