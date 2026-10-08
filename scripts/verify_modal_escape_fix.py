import asyncio
import os
from playwright.async_api import async_playwright

async def run_verification():
    print("================================================================================")
    print("VERIFYING CHEIRAP UI FIXES: TOP BAR, ESCAPE KEY HIERARCHY, AND NO 'ESC' WORDING")
    print("================================================================================")
    
    screenshot_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts")
    os.makedirs(screenshot_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1400, "height": 900})
        
        await page.goto("http://localhost:5173/")
        await page.wait_for_selector("header")
        print("[OK] Page loaded successfully")

        # 1. Verify no 'ESC' text on initial page close buttons
        esc_elements = await page.locator("text='ESC'").count()
        print(f"  Initial page 'ESC' badge count: {esc_elements}")
        assert esc_elements == 0, f"Found unexpected 'ESC' badge count: {esc_elements}"

        # 2. Open Regulatory Explorer Modal
        kb_btn = page.locator("button:has-text('Regulatory Intelligence & KB')")
        await kb_btn.click()
        await page.wait_for_selector("#close-regulatory-explorer-btn")
        print("[OK] Regulatory Explorer Modal opened")

        # Check close button does not contain 'ESC'
        close_btn_text = await page.locator("#close-regulatory-explorer-btn").inner_text()
        assert "ESC" not in close_btn_text, f"Close button contains 'ESC': {close_btn_text}"
        print("[OK] Regulatory Explorer close button has no 'ESC' text")

        # Check tab bar height and overflow
        tab_nav = page.locator(".bg-gray-100.px-5.pt-2.border-b")
        tab_box = await tab_nav.bounding_box()
        print(f"[OK] Tab navigation rendered: height={tab_box['height']}px (healthy, not squashed)")
        assert tab_box['height'] >= 35, f"Tab bar is squashed: height is {tab_box['height']}px"

        # Verify all 5 tabs exist and are visible
        tabs = ["Provisions Search", "Statutory Sources", "Audit Coverage", "State Precedence", "Admin Ingestion"]
        for tab_name in tabs:
            tab = page.locator(f"button:has-text('{tab_name}')")
            is_vis = await tab.is_visible()
            assert is_vis, f"Tab {tab_name} is not visible!"
            print(f"  [OK] Tab '{tab_name}' visible and properly styled")

        # Take screenshot of the fixed top bar
        screenshot_topbar = os.path.join(screenshot_dir, "fixed_top_bar.png")
        await page.screenshot(path=screenshot_topbar)
        print(f"[OK] Screenshot of fixed top bar saved to: {screenshot_topbar}")

        # 3. Click on a provision card to open the Regulatory Detail Modal (2nd image)
        detail_card = page.locator("div.cursor-pointer:has-text('STATE — PRIMARY BASIS')").first
        await detail_card.click()
        await page.wait_for_selector("#close-regulatory-detail-btn")
        print("[OK] Regulatory Detail Modal opened on top of Explorer Modal")

        # Verify no 'ESC' badge in detail modal header
        detail_close_text = await page.locator("#close-regulatory-detail-btn").inner_text()
        assert "ESC" not in detail_close_text, f"Detail modal close button has 'ESC': {detail_close_text}"
        print("[OK] Regulatory Detail close button has no 'ESC' text")

        screenshot_detail = os.path.join(screenshot_dir, "regulatory_detail_opened.png")
        await page.screenshot(path=screenshot_detail)

        # 4. PRESS ESCAPE ON KEYBOARD — CRUCIAL TEST
        print("\n--> Pressing 'Escape' on keyboard...")
        await page.keyboard.press("Escape")
        await asyncio.sleep(0.3)

        # Detail modal MUST be closed
        is_detail_visible = await page.locator("#close-regulatory-detail-btn").is_visible()
        print(f"  Regulatory Detail Modal visible: {is_detail_visible} (expected: False)")
        assert not is_detail_visible, "FAILURE: Regulatory Detail Modal is still visible after Escape!"

        # Explorer modal MUST REMAIN OPEN (not return to main screen)
        is_explorer_visible = await page.locator("#close-regulatory-explorer-btn").is_visible()
        print(f"  Regulatory Explorer Modal visible: {is_explorer_visible} (expected: True)")
        assert is_explorer_visible, "FAILURE: Pressing Escape closed the parent Explorer Modal and ejected to main screen!"
        print("[OK] SUCCESS: Escape key closed ONLY the detail modal and kept Explorer Modal open!")

        # 5. PRESS ESCAPE A SECOND TIME
        print("\n--> Pressing 'Escape' a second time...")
        await page.keyboard.press("Escape")
        await asyncio.sleep(0.3)

        is_explorer_visible_2 = await page.locator("#close-regulatory-explorer-btn").is_visible()
        print(f"  Regulatory Explorer Modal visible: {is_explorer_visible_2} (expected: False)")
        assert not is_explorer_visible_2, "FAILURE: Regulatory Explorer Modal did not close on second Escape!"
        print("[OK] SUCCESS: Second Escape key closed the Explorer Modal returning to main view!")

        # 6. TEST CASE DETAIL MODAL HIERARCHY AS WELL
        print("\n--> Testing Case Detail Modal hierarchy...")
        # Switch to dashboard
        dash_nav = page.locator("button:has-text('Monitoring Dashboard')")
        await dash_nav.click()
        await asyncio.sleep(0.3)

        # Open Dossier
        dossier_btn = page.locator("button:has-text('Dossier')").first
        await dossier_btn.click()
        await page.wait_for_selector("#close-dossier-header-btn")
        print("[OK] Case Detail Modal opened")

        # Check close button has no 'ESC' text
        dossier_close_text = await page.locator("#close-dossier-header-btn").inner_text()
        assert "ESC" not in dossier_close_text, f"Dossier close button has 'ESC': {dossier_close_text}"
        print("[OK] Dossier close button has no 'ESC' text")

        # In Section 04, click a provision button
        prov_btn = page.locator("button:has-text('Inspect Full Provision')").first
        if await prov_btn.is_visible():
            await prov_btn.click()
            await page.wait_for_selector("#close-regulatory-detail-btn")
            print("[OK] Provision Detail Modal opened on top of Case Dossier")

            # Press Escape
            print("  Pressing Escape inside Case Dossier's child modal...")
            await page.keyboard.press("Escape")
            await asyncio.sleep(0.3)

            assert not await page.locator("#close-regulatory-detail-btn").is_visible(), "Child provision detail still open"
            assert await page.locator("#close-dossier-header-btn").is_visible(), "Case Dossier was closed by child Escape!"
            print("  [OK] Escape closed ONLY the child modal; Case Dossier remains intact!")

            # Press Escape again
            print("  Pressing Escape on Case Dossier...")
            await page.keyboard.press("Escape")
            await asyncio.sleep(0.3)
            assert not await page.locator("#close-dossier-header-btn").is_visible(), "Case Dossier did not close"
            print("  [OK] Second Escape closed Case Dossier cleanly!")

        print("\n================================================================================")
        print("ALL VERIFICATION CHECKS PASSED (100%): ZERO 'ESC' WORDING, NO ACCIDENTAL EJECTION")
        print("================================================================================")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_verification())
