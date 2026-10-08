from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://127.0.0.1:5173/", wait_until="networkidle")
    
    details = page.evaluate("""() => {
        const docW = 390;
        const elements = document.querySelectorAll('*');
        const list = [];
        for (const el of elements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > docW + 5) {
                list.push({
                    tag: el.tagName,
                    html: el.outerHTML.slice(0, 120),
                    parent: el.parentElement ? el.parentElement.tagName + '.' + (el.parentElement.className?.toString?.().slice(0, 40) || '') : null,
                    rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }
                });
            }
        }
        return list;
    }""")
    for d in details[:15]:
        print(d)

    browser.close()
