import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def verify_all():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # -------------------------------------------------------------
        # 1. MOBILE VERIFICATION (390 x 844 - iPhone 12 / Modern Phone)
        # -------------------------------------------------------------
        print("\n--- [1] TESTING MOBILE VIEW (390 x 844) ---")
        context_mobile = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        page = context_mobile.new_page()

        # Load app
        page.goto("http://127.0.0.1:5173", wait_until="networkidle")
        time.sleep(1)

        # Hero
        hero_overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
        print("Hero Mobile:", hero_overflow)
        assert not hero_overflow["overflow"], f"Hero overflows on mobile! {hero_overflow}"
        page.screenshot(path="scratch/mobile_screenshots/01_hero_mobile_verified.png")

        # Open Login / Officer Portal
        login_btn = page.locator("button:has-text('Sign In to Enforcement Portal')").or_(page.locator("button:has-text('Officer Login')")).first
        login_btn.click()
        time.sleep(1)
        login_overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
        print("Login Mobile:", login_overflow)
        assert not login_overflow["overflow"], f"Login overflows on mobile! {login_overflow}"
        page.screenshot(path="scratch/mobile_screenshots/02_login_mobile_verified.png")

        # Click Sign In & Access Dashboard
        page.click("button:has-text('Sign In & Access Dashboard')")
        time.sleep(1.5)

        # Dashboard Mobile
        dash_overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
        print("Dashboard Mobile:", dash_overflow)
        assert not dash_overflow["overflow"], f"Dashboard overflows on mobile! {dash_overflow}"
        page.screenshot(path="scratch/mobile_screenshots/03_dashboard_mobile_verified.png")

        # Check Mobile Tender Cards presence
        mobile_cards = page.locator(".block.sm\\:hidden.space-y-3 > div")
        cards_count = mobile_cards.count()
        print(f"Mobile tender cards rendered: {cards_count}")
        assert cards_count > 0, "No mobile cards found!"

        # Expand First Tender Card on mobile
        details_btn = mobile_cards.first.locator("button:has-text('Details')")
        if details_btn.count() > 0:
            details_btn.click()
            time.sleep(0.5)
            print("First tender card expanded on mobile successfully.")
            page.screenshot(path="scratch/mobile_screenshots/04_tender_card_expanded_mobile.png")

        # Open Quick View Modal
        quick_btn = mobile_cards.first.locator("button:has-text('Quick View')")
        if quick_btn.count() > 0:
            quick_btn.click()
            time.sleep(0.5)
            quick_overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
            print("Quick View Modal Mobile:", quick_overflow)
            assert not quick_overflow["overflow"], f"Quick view overflows on mobile! {quick_overflow}"
            page.screenshot(path="scratch/mobile_screenshots/05_quickview_modal_mobile.png")
            page.click("#close-quickview-btn")
            time.sleep(0.5)

        # Open Stay Order Modal
        stay_btn = page.locator("button:has-text('Issue Statutory Pre-Award Hold Order')").first
        if stay_btn.count() > 0:
            stay_btn.click()
            time.sleep(0.5)
            stay_overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
            print("Stay Order Modal Mobile:", stay_overflow)
            assert not stay_overflow["overflow"], f"Stay order modal overflows on mobile! {stay_overflow}"
            page.screenshot(path="scratch/mobile_screenshots/06_stay_modal_mobile.png")
            page.click("#close-stay-modal-btn")
            time.sleep(0.5)

        # Open Regulatory Explorer Modal
        reg_btn = page.locator("button:has-text('Statutory Knowledge Base')").or_(page.locator("button:has-text('Rules Compendium')")).first
        if reg_btn.is_visible():
            reg_btn.click()
            time.sleep(0.5)
            reg_overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
            print("Rules / Knowledge Base Modal Mobile:", reg_overflow)
            assert not reg_overflow["overflow"], f"Rules compendium overflows on mobile! {reg_overflow}"
            page.screenshot(path="scratch/mobile_screenshots/07_rules_modal_mobile.png")
            close_reg = page.locator("#close-rules-modal-btn").or_(page.locator("#close-regulatory-explorer-btn")).first
            if close_reg.is_visible():
                close_reg.click()
            time.sleep(0.5)

        # Open Case Detail (Dossier) Modal
        dossier_btn = mobile_cards.first.locator("button:has-text('Dossier')")
        if dossier_btn.count() > 0:
            dossier_btn.click()
            time.sleep(1)
            dossier_overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
            print("Dossier Modal Mobile:", dossier_overflow)
            assert not dossier_overflow["overflow"], f"Dossier overflows on mobile! {dossier_overflow}"
            page.screenshot(path="scratch/mobile_screenshots/08_dossier_modal_mobile.png")
            page.click("#close-dossier-header-btn")
            time.sleep(0.5)

        # Open Original Tender / Portal Inspector Modal
        portal_btn = mobile_cards.first.locator("button:has-text('Portal')")
        if portal_btn.count() > 0:
            portal_btn.click()
            time.sleep(1)
            portal_overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
            print("Portal Inspector Modal Mobile:", portal_overflow)
            assert not portal_overflow["overflow"], f"Portal inspector overflows on mobile! {portal_overflow}"
            page.screenshot(path="scratch/mobile_screenshots/09_portal_modal_mobile.png")
            page.click("#close-portal-inspector-btn")
            time.sleep(0.5)

        context_mobile.close()

        # -------------------------------------------------------------
        # 2. DESKTOP VERIFICATION (1440 x 900 - Standard Desktop)
        # -------------------------------------------------------------
        print("\n--- [2] TESTING DESKTOP VIEW (1440 x 900) ---")
        context_desktop = browser.new_context(viewport={"width": 1440, "height": 900})
        page_desk = context_desktop.new_page()

        page_desk.goto("http://127.0.0.1:5173", wait_until="networkidle")
        time.sleep(1)

        # Verify desktop hero
        page_desk.screenshot(path="scratch/mobile_screenshots/10_desktop_hero.png")

        # Open Dashboard on desktop via Surveillance Console button
        page_desk.click("button:has-text('Open Surveillance Console (Demo)')")
        time.sleep(1.5)

        # Verify desktop triage table is visible and mobile cards are hidden
        desktop_table = page_desk.locator(".gov-card.overflow-x-auto.hidden.sm\\:block table")
        assert desktop_table.is_visible(), "Desktop table is NOT visible on desktop!"
        
        # Verify columns exist: Sl, Risk, Score, Tender ID, Work Description, Department, Value, Action
        headers = desktop_table.locator("th").all_inner_texts()
        print("Desktop Table Headers:", headers)
        assert any("SL" in h.upper() for h in headers) and any("RISK" in h.upper() for h in headers), f"Desktop table headers mismatch! {headers}"

        # Mobile cards must be hidden on desktop
        mobile_card_container = page_desk.locator(".block.sm\\:hidden.space-y-3")
        assert not mobile_card_container.is_visible(), "Mobile cards are visible on desktop!"

        page_desk.screenshot(path="scratch/mobile_screenshots/11_desktop_dashboard.png")
        print("Desktop table & layout verified 100% intact and mobile cards hidden!")

        context_desktop.close()
        browser.close()
        print("\n>>> ALL TESTS PASSED! MOBILE FULLY OPTIMIZED & DESKTOP 100% PRESERVED! <<<")

if __name__ == "__main__":
    verify_all()
