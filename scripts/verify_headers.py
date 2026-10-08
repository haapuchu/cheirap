import asyncio
import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

from playwright.async_api import async_playwright

async def verify_headers():
    print("=== VERIFYING MODAL HEADERS AND ZERO-OVERLAP LAYOUT ===")
    artifacts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts", "header_verification")
    os.makedirs(artifacts_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for width in [1280, 1440]:
            page = await browser.new_page(viewport={"width": width, "height": 900}, device_scale_factor=1.5)
            await page.goto("http://localhost:5173/")
            await page.wait_for_selector("header")

            # Go to dashboard
            dash_btn = page.locator("button:has-text('Monitoring Dashboard')")
            await dash_btn.click()
            await page.wait_for_selector("table")

            # 1. Open Case Detail Modal via the Examine Regulatory Dossier button on top banner
            dossier_btn = page.locator("button:has-text('Examine Regulatory Dossier')").first
            await dossier_btn.click()
            await page.wait_for_selector("#case-dossier-titlebar")
            await asyncio.sleep(0.5)

            # Capture Case Detail header
            modal_header = page.locator("#case-dossier-titlebar")
            await modal_header.screenshot(path=os.path.join(artifacts_dir, f"case_detail_modal_header_{width}px.png"))
            print(f"  -> Saved case_detail_modal_header_{width}px.png")

            # Close modal via Escape
            await page.keyboard.press("Escape")
            await asyncio.sleep(0.3)

            # 2. Open Quick View modal via quick view button
            quick_btn = page.locator("#quick-view-banner-btn").first
            await quick_btn.click()
            await page.wait_for_selector("#quickview-titlebar")
            await asyncio.sleep(0.4)

            # Capture Quick View header
            qv_header = page.locator("#quickview-titlebar")
            await qv_header.screenshot(path=os.path.join(artifacts_dir, f"quickview_header_{width}px.png"))
            print(f"  -> Saved quickview_header_{width}px.png")

            await page.keyboard.press("Escape")
            await asyncio.sleep(0.3)
            await page.close()

        await browser.close()
        print("=== HEADER VERIFICATION COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(verify_headers())
