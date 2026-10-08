import os
import sys
import time
from playwright.sync_api import sync_playwright

def inspect_sections():
    output_dir = os.path.join(os.path.dirname(__file__), "mobile_screenshots")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True
        )
        page = context.new_page()

        # Load dashboard directly
        page.goto("http://127.0.0.1:5173/", wait_until="networkidle")
        page.locator("button:has-text('Open Surveillance Console (Demo)')").or_(page.locator("button:has-text('Monitoring Dashboard')")).first.click()
        time.sleep(1)

        # Full page screenshot of dashboard
        page.screenshot(path=os.path.join(output_dir, "04_mobile_dashboard_full.png"), full_page=True)

        # Open Case Detail Modal
        first_examine_btn = page.locator("button:has-text('Examine Regulatory Dossier')").or_(page.locator("button:has-text('Examine Case Dossier')")).first
        if first_examine_btn.is_visible():
            first_examine_btn.click()
            time.sleep(1)
            page.screenshot(path=os.path.join(output_dir, "05_mobile_case_modal.png"))
            # Close modal
            page.keyboard.press("Escape")
            time.sleep(0.5)

        # Open Quick View Modal
        quick_view_btn = page.locator("button:has-text('Quick View')").first
        if quick_view_btn.is_visible():
            quick_view_btn.click()
            time.sleep(1)
            page.screenshot(path=os.path.join(output_dir, "06_mobile_quickview_modal.png"))
            page.keyboard.press("Escape")
            time.sleep(0.5)

        # Open Regulatory Explorer
        reg_btn = page.locator("button:has-text('Regulatory Intelligence')").first
        if reg_btn.is_visible():
            reg_btn.click()
            time.sleep(1)
            page.screenshot(path=os.path.join(output_dir, "07_mobile_reg_explorer_modal.png"))
            page.keyboard.press("Escape")
            time.sleep(0.5)

        browser.close()
        print("Inspection completed!")

if __name__ == "__main__":
    inspect_sections()
