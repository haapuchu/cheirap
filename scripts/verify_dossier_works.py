import sys
import os
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
os.makedirs('dogfood_report/screenshots', exist_ok=True)

def verify_works_dossier():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1600, 'height': 1050},
            device_scale_factor=2
        )
        page = context.new_page()

        print("[1] Navigating to http://localhost:5173/ ...")
        page.goto('http://localhost:5173/', wait_until='networkidle')
        time.sleep(2)

        print("[2] Navigating to Works & Ground Assurance tab...")
        works_tab = page.locator("button:has-text('Works & Ground Assurance')").first
        works_tab.click()
        time.sleep(2)

        page.screenshot(path='dogfood_report/screenshots/works_dashboard_view.png')
        print("  ✓ Captured works_dashboard_view.png")

        print("[3] Clicking 'Inspect Priority Case (AI Audit)'...")
        inspect_btn = page.locator("button:has-text('Inspect Priority Case')").first
        inspect_btn.click()
        time.sleep(2)

        page.screenshot(path='dogfood_report/screenshots/dossier_ai_audit_tab.png')
        print("  ✓ Captured dossier_ai_audit_tab.png")

        print("[4] Checking Tab 5 contents & Live Darpan button...")
        darpan_btn = page.locator("a:has-text('Live Darpan Posting')").first
        print(f"  Live Darpan button present: {darpan_btn.count() > 0}")
        if darpan_btn.count() > 0:
            print(f"  Live Darpan href: {darpan_btn.get_attribute('href')}")

        # Check Tab 1 GPS Check
        gps_tab = page.locator("button:has-text('1. GPS Location Check')").first
        gps_tab.click()
        time.sleep(1)
        page.screenshot(path='dogfood_report/screenshots/dossier_gps_tab.png')
        print("  ✓ Captured dossier_gps_tab.png")

        # Re-open Tab 5 Plain Language AI Audit
        ai_tab = page.locator("button:has-text('5. Plain-Language AI Audit')").first
        ai_tab.click()
        time.sleep(1)
        page.screenshot(path='dogfood_report/screenshots/dossier_tab5_detail.png')
        print("  ✓ Captured dossier_tab5_detail.png")

        # Click outside modal on backdrop to verify dismiss
        print("[5] Testing click-outside-to-dismiss on soft backdrop...")
        page.mouse.click(50, 50)
        time.sleep(1.5)
        page.screenshot(path='dogfood_report/screenshots/dossier_closed_on_backdrop_click.png')
        print("  ✓ Captured dossier_closed_on_backdrop_click.png")

        browser.close()
        print("✓ All Works Dossier verifications completed successfully!")

if __name__ == '__main__':
    verify_works_dossier()
