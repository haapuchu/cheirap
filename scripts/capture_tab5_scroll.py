import sys
import os
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def capture_tab5_scrolled():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1600, 'height': 1050},
            device_scale_factor=2
        )
        page = context.new_page()

        page.goto('http://localhost:5173/', wait_until='networkidle')
        time.sleep(2)

        works_tab = page.locator("button:has-text('Works & Ground Assurance')").first
        works_tab.click()
        time.sleep(2)

        inspect_btn = page.locator("button:has-text('Inspect Priority Case')").first
        inspect_btn.click()
        time.sleep(2)

        # Scroll down inside the modal body
        modal_body = page.locator(".overflow-y-auto").nth(1)
        modal_body.evaluate("e => e.scrollTop = 500")
        time.sleep(1)

        page.screenshot(path='dogfood_report/screenshots/dossier_tab5_scrolled_table.png')
        print("✓ Captured dossier_tab5_scrolled_table.png")

        modal_body.evaluate("e => e.scrollTop = 1000")
        time.sleep(1)
        page.screenshot(path='dogfood_report/screenshots/dossier_tab5_scrolled_bottom.png')
        print("✓ Captured dossier_tab5_scrolled_bottom.png")

        browser.close()

if __name__ == '__main__':
    capture_tab5_scrolled()
