import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def audit_mobile():
    output_dir = os.path.join(os.path.dirname(__file__), "mobile_screenshots")
    os.makedirs(output_dir, exist_ok=True)
    
    with sync_playwright() as p:
        # iPhone 13/14 viewport: 390 x 844
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True
        )
        page = context.new_page()

        print("Testing Hero Page on Mobile (390x844)...")
        page.goto("http://127.0.0.1:5173/", wait_until="networkidle")
        time.sleep(1)
        
        overflow = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
        print(f"Hero page overflow check: {overflow}")
        page.screenshot(path=os.path.join(output_dir, "01_mobile_hero.png"))

        # Test Login Page
        print("Testing Login Page on Mobile...")
        # Click login button or nav
        login_btn = page.locator("button:has-text('Authorized Access')").or_(page.locator("button:has-text('Login')")).or_(page.locator("button:has-text('SSO')")).first
        if login_btn.is_visible():
            login_btn.click()
            time.sleep(1)
            overflow_login = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
            print(f"Login page overflow check: {overflow_login}")
            page.screenshot(path=os.path.join(output_dir, "02_mobile_login.png"))

        # Test Dashboard Page
        print("Testing Dashboard Page on Mobile...")
        page.goto("http://127.0.0.1:5173/", wait_until="networkidle")
        time.sleep(0.5)
        dash_btn = page.locator("button:has-text('Monitoring Dashboard')").or_(page.locator("button:has-text('Enter System')")).first
        if dash_btn.is_visible():
            dash_btn.click()
            time.sleep(1)
            overflow_dash = page.evaluate("() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth })")
            print(f"Dashboard overflow check: {overflow_dash}")
            page.screenshot(path=os.path.join(output_dir, "03_mobile_dashboard.png"))

        browser.close()
        print("Mobile audit finished!")

if __name__ == "__main__":
    audit_mobile()
