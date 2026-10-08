import sys
import os
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def verify_darpan_preview():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1600, 'height': 1050},
            device_scale_factor=2
        )
        page = context.new_page()

        print("1. Loading application...")
        page.goto('http://localhost:5173/', wait_until='networkidle')
        time.sleep(2)

        print("2. Navigating to Works & Ground Assurance...")
        works_tab = page.locator("button:has-text('Works & Ground Assurance')").first
        works_tab.click()
        time.sleep(2)

        print("3. Clicking Live Darpan preview button in top banner...")
        banner_darpan_btn = page.locator("button:has-text('Live Darpan (darpanmanipur.in)')").first
        banner_darpan_btn.click()
        time.sleep(3)

        os.makedirs('dogfood_report/screenshots', exist_ok=True)
        page.screenshot(path='dogfood_report/screenshots/darpan_live_preview_modal.png')
        print("✓ Captured darpan_live_preview_modal.png")

        # Close the modal
        close_btn = page.locator("button[title='Close Preview (Esc)']").first
        close_btn.click()
        time.sleep(1)

        print("4. Opening ground verification dossier...")
        inspect_btn = page.locator("button:has-text('Inspect Priority Case')").first
        inspect_btn.click()
        time.sleep(2)

        print("5. Clicking Live Darpan Preview inside the dossier modal...")
        dossier_darpan_btn = page.locator("button:has-text('Live Darpan Preview (darpanmanipur.in)')").first
        dossier_darpan_btn.click()
        time.sleep(3)

        page.screenshot(path='dogfood_report/screenshots/darpan_dossier_preview_modal.png')
        print("✓ Captured darpan_dossier_preview_modal.png")

        browser.close()
        print("All Darpan preview verifications completed successfully!")

if __name__ == '__main__':
    verify_darpan_preview()
