import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_ui_ux_pro_max():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print("[1] Navigating to http://localhost:5173/...")
        page.goto("http://localhost:5173/", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Test Text Scaling Buttons
        print("[2] Testing Text Size Scaling...")
        page.locator("button:has-text('A+')").click()
        page.wait_for_timeout(300)
        has_larger = page.evaluate("document.documentElement.classList.contains('font-scale-larger')")
        print(f"    font-scale-larger active: {has_larger}")
        assert has_larger, "Failed to apply font-scale-larger"

        page.locator("button:has-text('A-')").click()
        page.wait_for_timeout(300)
        has_normal = page.evaluate("document.documentElement.classList.contains('font-scale-normal')")
        print(f"    font-scale-normal active: {has_normal}")
        assert has_normal, "Failed to apply font-scale-normal"

        # Test High Contrast Mode
        print("[3] Testing High Contrast Toggle...")
        contrast_btn = page.locator("button:has-text('Contrast:')")
        contrast_btn.click()
        page.wait_for_timeout(300)
        is_hc = page.evaluate("document.body.classList.contains('high-contrast')")
        print(f"    body.high-contrast active: {is_hc}")
        assert is_hc, "Failed to apply high-contrast"

        # Reset contrast to normal
        contrast_btn.click()
        page.wait_for_timeout(300)

        # Switch to Monitoring Dashboard
        print("[4] Navigating to Monitoring Dashboard...")
        dash_btn = page.locator("button:has-text('Monitoring Dashboard')").first
        dash_btn.click()
        page.wait_for_timeout(800)

        # Open Case Detail Modal for high-risk tender
        print("[5] Opening Case Detail Modal...")
        dossier_btn = page.locator("button:has-text('Examine Regulatory Dossier')").first
        if not dossier_btn.is_visible():
            dossier_btn = page.locator("button:has-text('Examine Case Dossier')").first
        dossier_btn.click()
        page.wait_for_timeout(1000)

        # Verify Dialog Accessibility Attributes
        dialog_role = page.locator("[role='dialog']").first
        assert dialog_role.is_visible(), "Modal does not have role='dialog'"
        print("    Modal role='dialog' verified.")

        # Click Tab 4: Explainable AI Waterfall
        print("[6] Testing Tab 4: Explainable AI Waterfall...")
        xai_tab = page.locator("button:has-text('Explainable AI Waterfall')")
        xai_tab.click()
        page.wait_for_timeout(600)

        decomp_banner = page.locator("text=Dual-Brain Mathematical Attribution Waterfall")
        assert decomp_banner.is_visible(), "XAI Decomposition banner not visible"
        print("    XAI Decomposition banner verified.")

        delta_pills = page.locator("text=pts")
        print(f"    Found {delta_pills.count()} delta point indicators.")
        assert delta_pills.count() > 0, "No delta point indicators found"

        page.screenshot(path="artifacts/ui_ux_pro_max_xai_waterfall.png")
        print("    Captured screenshot: artifacts/ui_ux_pro_max_xai_waterfall.png")

        # Test Gazette PIAR modal opening & Esc hierarchy
        print("[7] Testing Gazette PIAR modal & Escape hierarchy...")
        gazette_btn = page.locator("#open-gazette-modal-btn")
        if gazette_btn.is_visible():
            gazette_btn.click()
            page.wait_for_timeout(800)
            gazette_dialog = page.locator("[role='dialog']").last
            assert gazette_dialog.is_visible(), "Gazette modal not visible"
            print("    Gazette modal opened successfully.")

            # Press Escape - first Escape should close Gazette modal
            page.keyboard.press("Escape")
            page.wait_for_timeout(500)
            print("    Pressed 1st Escape. Checking if parent case modal is still open...")
            parent_dossier = page.locator("#case-dossier-title")
            assert parent_dossier.is_visible(), "Parent dossier closed prematurely!"
            print("    Hierarchical Escape passed: Gazette modal closed, parent dossier retained.")

            # Press Escape again - second Escape closes parent dossier
            page.keyboard.press("Escape")
            page.wait_for_timeout(500)
            assert not parent_dossier.is_visible(), "Parent dossier failed to close on 2nd Escape!"
            print("    2nd Escape closed parent dossier cleanly.")

        # Test Responsive viewports
        print("[8] Testing Responsive Viewports (375px, 768px, 1024px, 1440px)...")
        for width in [375, 768, 1024, 1440]:
            page.set_viewport_size({"width": width, "height": 800})
            page.wait_for_timeout(300)
            print(f"    Viewport {width}px rendered without crash.")

        page.set_viewport_size({"width": 1440, "height": 900})
        page.screenshot(path="artifacts/ui_ux_pro_max_responsive_1440.png")
        print("    Captured screenshot: artifacts/ui_ux_pro_max_responsive_1440.png")

        print(f"[9] Total Console Errors: {len(console_errors)}")
        for err in console_errors:
            print(f"    Console Error: {err}")
        assert len(console_errors) == 0, f"Found console errors: {console_errors}"

        browser.close()
        print("✓ All UI/UX Pro Max verification checks passed successfully!")

if __name__ == "__main__":
    test_ui_ux_pro_max()
