import sys
import os
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('artifacts/pitch_assets', exist_ok=True)

def capture_pitch_assets():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 1600x1000 with 2x device scale for crystal clear 4K-like screenshots
        context = browser.new_context(
            viewport={'width': 1600, 'height': 1000},
            device_scale_factor=2
        )
        page = context.new_page()

        print("[1] Capturing Hero & Executive Telemetry...")
        page.goto('http://localhost:5173/', wait_until='networkidle')
        time.sleep(1.5)
        page.screenshot(path='artifacts/pitch_assets/01_hero_portal.png', full_page=False)

        print("[2] Capturing Monitoring Dashboard Queue...")
        dash_btn = page.locator("button:has-text('Monitoring Dashboard')").first
        dash_btn.click()
        time.sleep(1.5)
        page.screenshot(path='artifacts/pitch_assets/02_dashboard_queue.png', full_page=False)

        print("[3] Capturing 5-Section Case Detail Dossier...")
        dossier_btn = page.locator("button:has-text('Examine Regulatory Dossier'), button:has-text('Dossier')").first
        dossier_btn.click()
        time.sleep(2)
        page.screenshot(path='artifacts/pitch_assets/03_case_dossier.png', full_page=False)

        print("[4] Capturing Explainable AI Waterfall Tab...")
        xai_tab = page.locator("button:has-text('Explainable AI')").first
        xai_tab.click()
        time.sleep(1.5)
        page.screenshot(path='artifacts/pitch_assets/04_xai_waterfall.png', full_page=False)

        print("[5] Capturing 14-Section Gazette PIAR Tab...")
        report_tab = page.locator("button:has-text('14-Section')").first
        report_tab.click()
        time.sleep(2)
        page.screenshot(path='artifacts/pitch_assets/05_gazette_report_tab.png', full_page=False)

        print("[6] Capturing Standalone Gazette Print Modal...")
        header_gazette_btn = page.locator("#open-gazette-modal-btn")
        header_gazette_btn.click()
        time.sleep(2)
        page.screenshot(path='artifacts/pitch_assets/06_standalone_gazette_modal.png', full_page=False)

        # Close standalone modal
        page.keyboard.press("Escape")
        time.sleep(1)
        # Close case detail modal
        page.keyboard.press("Escape")
        time.sleep(1)

        print("[7] Capturing Regulatory Intelligence Explorer...")
        reg_btn = page.locator("button:has-text('Regulatory Intelligence & KB')").first
        reg_btn.click()
        time.sleep(2)
        page.screenshot(path='artifacts/pitch_assets/07_regulatory_explorer.png', full_page=False)

        page.keyboard.press("Escape")
        time.sleep(1)

        print("[8] Capturing Statutory Compendium...")
        rules_btn = page.locator("button:has-text('Statutory Compendium')").first
        rules_btn.click()
        time.sleep(2)
        page.screenshot(path='artifacts/pitch_assets/08_statutory_compendium.png', full_page=False)

        browser.close()
        print("✓ All 8 high-resolution pitch screenshots captured successfully!")

if __name__ == '__main__':
    capture_pitch_assets()
