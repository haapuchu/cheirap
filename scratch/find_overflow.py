from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://127.0.0.1:5173/", wait_until="networkidle")
    
    # Find overflowing elements on Hero view
    overflowing = page.evaluate("""() => {
        const docW = window.innerWidth;
        const elements = document.querySelectorAll('*');
        const bad = [];
        for (const el of elements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > docW + 1) {
                bad.push({
                    tag: el.tagName,
                    id: el.id,
                    className: el.className?.toString?.().slice(0, 80),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width)
                });
            }
        }
        return bad.slice(0, 15);
    }""")
    print("Hero overflowing elements:", overflowing)

    # Now navigate to dashboard
    page.locator("button:has-text('Monitoring Dashboard')").or_(page.locator("button:has-text('Enter System')")).first.click()
    page.wait_for_timeout(1000)

    overflowing_dash = page.evaluate("""() => {
        const docW = window.innerWidth;
        const elements = document.querySelectorAll('*');
        const bad = [];
        for (const el of elements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > docW + 1) {
                bad.push({
                    tag: el.tagName,
                    id: el.id,
                    className: el.className?.toString?.().slice(0, 80),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width)
                });
            }
        }
        return bad.slice(0, 15);
    }""")
    print("Dashboard overflowing elements:", overflowing_dash)

    browser.close()
