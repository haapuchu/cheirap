@echo off
echo Running Hero and Accessibility Dogfood Tests...
call npx agent-browser open http://localhost:5173/
call npx agent-browser wait 1000
call npx agent-browser snapshot -i

echo Testing Tab 2: The 4 Exploits
call npx agent-browser click @e23
call npx agent-browser wait 800
call npx agent-browser screenshot dogfood_report/screenshots/02_hero_tab_exploits.png

echo Testing Tab 3: Dual-Brain AI
call npx agent-browser snapshot -i
call npx agent-browser click @e24
call npx agent-browser wait 800
call npx agent-browser screenshot dogfood_report/screenshots/03_hero_tab_dual_brain.png

echo Testing Tab 4: Venue Verification
call npx agent-browser snapshot -i
call npx agent-browser click @e25
call npx agent-browser wait 800
call npx agent-browser screenshot dogfood_report/screenshots/04_hero_tab_venue.png

echo Testing Tab 1: Forensic Articulation
call npx agent-browser snapshot -i
call npx agent-browser click @e22
call npx agent-browser wait 800
call npx agent-browser screenshot dogfood_report/screenshots/05_hero_tab_forensic.png

echo Testing GovTech Text Scaling A+
call npx agent-browser snapshot -i
call npx agent-browser click @e4
call npx agent-browser wait 500
call npx agent-browser screenshot dogfood_report/screenshots/06_text_scale_large.png

echo Testing GovTech High Contrast Mode
call npx agent-browser snapshot -i
call npx agent-browser click @e5
call npx agent-browser wait 500
call npx agent-browser screenshot dogfood_report/screenshots/07_high_contrast.png

echo Testing GovTech Language: Manipuri
call npx agent-browser snapshot -i
call npx agent-browser click @e7
call npx agent-browser wait 500
call npx agent-browser screenshot dogfood_report/screenshots/08_lang_manipuri.png

echo Testing GovTech Language: Hindi
call npx agent-browser snapshot -i
call npx agent-browser click @e8
call npx agent-browser wait 500
call npx agent-browser screenshot dogfood_report/screenshots/09_lang_hindi.png

call npx agent-browser close
echo Hero and Accessibility Tests completed!
