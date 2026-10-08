import asyncio
import os
import sys

# Force UTF-8 for console output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
from playwright.async_api import async_playwright

async def run_verification():
    print("================================================================================")
    print("VERIFYING DISPATCH BUTTON: RELOADING ANIMATION & 'SENT' TRANSITION")
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
        print("[OK] Base page loaded")

        # Navigate to Monitoring Dashboard
        dash_btn = page.locator("button:has-text('Monitoring Dashboard')")
        await dash_btn.click()
        await page.wait_for_selector("table")
        print("[OK] Switched to Monitoring Dashboard")

        # Open Stay Order Modal from the Top Priority Case banner
        stay_btn = page.locator("button:has-text('Issue Stay Order')").first
        if await stay_btn.count() == 0:
            # Fallback to expanded row button
            info_btn = page.locator("button:has-text('Info')").first
            await info_btn.click()
            stay_btn = page.locator("button:has-text('Pre-Award Hold Notice')").first
        
        await stay_btn.click()
        await page.wait_for_selector("#dispatch-stay-eoffice-btn")
        print("[OK] Stay Order Modal opened successfully")

        dispatch_btn = page.locator("#dispatch-stay-eoffice-btn")
        initial_text = await dispatch_btn.inner_text()
        print(f"[OK] Initial button text: '{initial_text}'")
        assert "Dispatch via e-Office to CVO" in initial_text, f"Unexpected initial text: {initial_text}"

        # Click the dispatch button and verify reloading state
        await dispatch_btn.click()
        
        # Check immediately for reloading animation
        await page.wait_for_selector("#dispatch-stay-eoffice-btn .animate-spin")
        loading_text = await dispatch_btn.inner_text()
        print(f"[OK] Reloading animation triggered! Button text: '{loading_text}'")
        assert "Dispatching" in loading_text, f"Expected 'Dispatching' during loading, got: {loading_text}"
        
        # Verify modal DID NOT CLOSE
        modal_count = await page.locator("#dispatch-stay-eoffice-btn").count()
        assert modal_count == 1, "Modal closed unexpectedly during dispatch!"
        print("[OK] Confirmed: Modal remained open (no jarring dismissal)")

        # Capture screenshot of reloading / spinning state
        loading_screenshot = os.path.join(screenshot_dir, "dispatch_button_loading_state.png")
        await page.screenshot(path=loading_screenshot)
        print(f"[OK] Saved loading state screenshot: {loading_screenshot}")

        # Wait for dispatch completion transition
        await page.wait_for_timeout(1100)

        # Verify button changed to 'Sent'
        sent_text = await dispatch_btn.inner_text()
        print(f"[OK] Post-dispatch button text: {repr(sent_text)}")
        assert "Sent" in sent_text, f"Expected button text to contain 'Sent', got: {sent_text}"

        # Verify in-modal confirmation receipt banner
        receipt_count = await page.locator("text=Transmission Confirmed").count()
        assert receipt_count >= 1, "Expected in-modal transmission receipt banner"
        print("[OK] Verified in-modal transmission confirmation receipt banner")

        # Capture screenshot of 'Sent' state
        sent_screenshot = os.path.join(screenshot_dir, "dispatch_button_sent_state.png")
        await page.screenshot(path=sent_screenshot)
        print(f"[OK] Saved 'Sent' state screenshot: {sent_screenshot}")

        # Verify user can close modal gracefully after seeing 'Sent' state
        close_btn = page.locator("#close-stay-modal-footer-btn")
        await close_btn.click()
        await page.wait_for_timeout(300)
        assert await page.locator("#dispatch-stay-eoffice-btn").count() == 0, "Modal should be closed on Close click"
        print("[OK] User closed modal after reviewing 'Sent' state")

        # Verify table row badge
        badge_count = await page.locator("text='PRE-AWARD HOLD NOTICE DISPATCHED'").count()
        print(f"[OK] Dispatched badge count in table: {badge_count} (>= 1)")
        assert badge_count >= 1, "Table should reflect dispatched badge"

        # Check console errors
        print(f"[OK] Browser console errors: {len(console_errors)}")
        if console_errors:
            print("Console errors:", console_errors)

        await browser.close()
        print("\n================================================================================")
        print("ALL DISPATCH BUTTON ANIMATION & 'SENT' TESTS PASSED WITH 100% SUCCESS!")
        print("================================================================================")

if __name__ == "__main__":
    asyncio.run(run_verification())
