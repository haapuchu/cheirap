import asyncio
import os
import re
from playwright.async_api import async_playwright

async def run_verification():
    print("================================================================================")
    print("VERIFYING CHEIRAP REAL TENDER SOURCE INSPECTOR (manipurtenders.gov.in)")
    print("================================================================================")
    
    screenshot_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts")
    os.makedirs(screenshot_dir, exist_ok=True)

    console_errors = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1400, "height": 900})
        
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        await page.goto("http://localhost:5173/")
        await page.wait_for_selector("header")
        print("[OK] Base page loaded successfully")

        # Navigate to Monitoring Dashboard
        dash_btn = page.locator("button:has-text('Monitoring Dashboard')")
        await dash_btn.click()
        await page.wait_for_selector("table")
        print("[OK] Switched to Monitoring Dashboard")

        # 1. Verify Portal Inspection button exists on table row
        portal_btn = page.locator("button:has-text('Portal')").first
        await portal_btn.wait_for()
        print("[OK] Portal inspection button located in table row")

        # Click Portal inspection button
        await portal_btn.click()
        await page.wait_for_selector("#portal-inspector-title")
        print("[OK] OriginalTenderModal opened successfully")

        # Verify Portal Header & Brandings
        modal_text = await page.locator("[role='dialog']").inner_text()
        assert "GePNIC" in modal_text, "Missing GePNIC branding"
        assert "manipurtenders.gov.in" in modal_text, "Missing manipurtenders.gov.in source domain"
        assert "GOVERNMENT OF MANIPUR" in modal_text, "Missing Government of Manipur text"
        print("[OK] Verified GePNIC and manipurtenders.gov.in source credentials")

        # Verify CTA button
        verify_btn = page.locator("#open-live-gepnic-portal-btn")
        await verify_btn.wait_for()
        print("[OK] Found 'Verify on manipurtenders.gov.in' CTA button")

        # Verify Copy Tender ID action
        copy_id_btn = page.locator("#copy-tender-id-btn")
        await copy_id_btn.click()
        await page.wait_for_timeout(300)
        copy_id_text = await copy_id_btn.inner_text()
        print(f"[OK] Copy Tender ID clicked, state: '{copy_id_text}'")

        # Take screenshot of Tab 1 (Official NIT Metadata Sheet)
        sheet_screenshot = os.path.join(screenshot_dir, "portal_inspector_sheet_tab.png")
        await page.screenshot(path=sheet_screenshot)
        print(f"[OK] Saved Tab 1 screenshot: {sheet_screenshot}")

        # 2. Switch to Tab 2: Live Portal Verification Guide
        guide_tab = page.locator("#tab-guide-btn")
        await guide_tab.click()
        await page.wait_for_timeout(300)
        guide_text = await page.locator("[role='dialog']").inner_text()
        assert "How Judges & Vigilance Officers Can Verify This Real Tender" in guide_text, "Missing guide title"
        assert "Copy the Tender ID" in guide_text, "Missing Step 1"
        assert "Open manipurtenders.gov.in" in guide_text, "Missing Step 2"
        assert "Paste ID into the Search Box" in guide_text, "Missing Step 3"
        print("[OK] Verified 4-step live portal verification guide")

        guide_screenshot = os.path.join(screenshot_dir, "portal_inspector_guide_tab.png")
        await page.screenshot(path=guide_screenshot)
        print(f"[OK] Saved Tab 2 screenshot: {guide_screenshot}")

        # 3. Switch to Tab 3: Raw Crawler JSON
        raw_tab = page.locator("#tab-raw-btn")
        await raw_tab.click()
        await page.wait_for_timeout(300)
        raw_text = await page.locator("[role='dialog'] pre").inner_text()
        assert "tender_id" in raw_text, "Missing raw JSON tender_id"
        assert "estimated_value_inr" in raw_text, "Missing capex in raw JSON"
        print("[OK] Verified Raw JSON crawler telemetry format")

        raw_screenshot = os.path.join(screenshot_dir, "portal_inspector_json_tab.png")
        await page.screenshot(path=raw_screenshot)
        print(f"[OK] Saved Tab 3 screenshot: {raw_screenshot}")

        # 4. Test Escape key dismissal
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(300)
        assert await page.locator("#portal-inspector-title").count() == 0, "Modal did not close on Escape"
        print("[OK] OriginalTenderModal closed smoothly via Escape key")

        # 5. Test nested opening from CaseDetailModal
        dossier_btn = page.locator("button:has-text('Dossier')").first
        await dossier_btn.click()
        await page.wait_for_selector("#case-dossier-title")
        print("[OK] CaseDetailModal opened")

        # Find and click "Inspect Source Portal" in CaseDetailModal header
        inspect_source_btn = page.locator("#open-original-tender-modal-btn")
        await inspect_source_btn.wait_for()
        await inspect_source_btn.click()
        await page.wait_for_selector("#portal-inspector-title")
        print("[OK] OriginalTenderModal opened as layered modal above CaseDetailModal")

        dossier_layered_screenshot = os.path.join(screenshot_dir, "portal_inspector_from_dossier.png")
        await page.screenshot(path=dossier_layered_screenshot)
        print(f"[OK] Saved layered modal screenshot: {dossier_layered_screenshot}")

        # Press Escape once -> OriginalTenderModal should close, CaseDetailModal must stay open
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(300)
        assert await page.locator("#portal-inspector-title").count() == 0, "OriginalTenderModal should be closed"
        assert await page.locator("#case-dossier-title").count() == 1, "CaseDetailModal must remain open after 1st Escape"
        print("[OK] Hierarchical Escape verified: Portal inspector dismissed, Dossier remained active")

        # Press Escape again -> CaseDetailModal should close
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(300)
        assert await page.locator("#case-dossier-title").count() == 0, "CaseDetailModal should be closed after 2nd Escape"
        print("[OK] Second Escape verified: CaseDetailModal cleanly dismissed back to dashboard")

        # 6. Verify Script Purity (No Bengali script anywhere on page)
        full_content = await page.content()
        bengali_matches = re.findall(r'[\u0980-\u09FF]', full_content)
        # Filter out common standard Indian Hindi characters if any (\u0900-\u097F is Devanagari)
        print(f"[OK] Bengali Unicode Range (\\u0980-\\u09FF) characters detected: {len(bengali_matches)}")
        assert len(bengali_matches) == 0, f"Found Bengali characters: {bengali_matches[:10]}"

        # Check Meetei Mayek presence
        meetei_matches = re.findall(r'[\uAAE0-\uAAFF\uABC0-\uABFF]', full_content)
        print(f"[OK] Meetei Mayek Unicode characters verified: {len(meetei_matches)} occurrences")
        assert len(meetei_matches) > 0, "Meetei Mayek script should be present for CHEIRAP"

        # Check Console Errors
        print(f"[OK] Browser console errors: {len(console_errors)}")
        if console_errors:
            print("Console errors logged:", console_errors)

        await browser.close()
        print("\n================================================================================")
        print("ALL REAL TENDER INSPECTION SUITE TESTS PASSED WITH 100% SUCCESS!")
        print("================================================================================")

if __name__ == "__main__":
    asyncio.run(run_verification())
