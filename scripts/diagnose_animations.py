import asyncio
import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
from playwright.async_api import async_playwright

async def run():
    print("=== ANIMATION DIAGNOSTIC SUITE ===")
    async with async_playwright() as p:
        # Launch with default emulation
        browser = await p.chromium.launch(headless=True)
        
        # Test 1: Default context
        page = await browser.new_page(viewport={"width": 1400, "height": 900})
        await page.goto("http://localhost:5173/")
        await page.wait_for_selector(".gov-ticker-content")
        
        # Check computed styles of ticker
        ticker_info = await page.evaluate("""() => {
            const el = document.querySelector('.gov-ticker-content');
            const track = document.querySelector('.gov-ticker-track');
            const cs = window.getComputedStyle(el);
            const blip = document.querySelector('.radar-blip');
            const blipCs = blip ? window.getComputedStyle(blip, '::after') : null;
            return {
                animationName: cs.animationName,
                animationDuration: cs.animationDuration,
                animationPlayState: cs.animationPlayState,
                animationIterationCount: cs.animationIterationCount,
                transform: cs.transform,
                offsetWidth: el.offsetWidth,
                scrollWidth: el.scrollWidth,
                trackWidth: track.offsetWidth,
                blipAnimation: blipCs ? blipCs.animationName : null,
                reducedMotionMatches: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            };
        }""")
        print("Default Context:", ticker_info)
        
        # Sample transform matrix over 1 second to see if it is moving
        t0 = await page.evaluate("() => window.getComputedStyle(document.querySelector('.gov-ticker-content')).transform")
        await asyncio.sleep(1.0)
        t1 = await page.evaluate("() => window.getComputedStyle(document.querySelector('.gov-ticker-content')).transform")
        print(f"Transform at t=0: {t0}")
        print(f"Transform at t=1s: {t1}")
        is_moving_normal = (t0 != t1)
        print(f"Is ticker moving in normal mode? {is_moving_normal}")

        # Test 2: Emulate prefers-reduced-motion: reduce (which happens on Windows with animations off)
        page_rm = await browser.new_page(viewport={"width": 1400, "height": 900})
        await page_rm.emulate_media(reduced_motion="reduce")
        await page_rm.goto("http://localhost:5173/")
        await page_rm.wait_for_selector(".gov-ticker-content")

        rm_info = await page_rm.evaluate("""() => {
            const el = document.querySelector('.gov-ticker-content');
            const cs = window.getComputedStyle(el);
            const blip = document.querySelector('.radar-blip');
            const blipCs = blip ? window.getComputedStyle(blip, '::after') : null;
            return {
                animationName: cs.animationName,
                animationDuration: cs.animationDuration,
                animationPlayState: cs.animationPlayState,
                animationIterationCount: cs.animationIterationCount,
                transform: cs.transform,
                blipAnimation: blipCs ? blipCs.animationName : null,
                reducedMotionMatches: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            };
        }""")
        print("\nReduced Motion Mode (Windows animation disabled simulation):", rm_info)
        t0_rm = await page_rm.evaluate("() => window.getComputedStyle(document.querySelector('.gov-ticker-content')).transform")
        await asyncio.sleep(1.0)
        t1_rm = await page_rm.evaluate("() => window.getComputedStyle(document.querySelector('.gov-ticker-content')).transform")
        print(f"RM Transform at t=0: {t0_rm}")
        print(f"RM Transform at t=1s: {t1_rm}")
        is_moving_rm = (t0_rm != t1_rm)
        print(f"Is ticker moving in RM mode? {is_moving_rm}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
