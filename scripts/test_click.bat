@echo off
call npx agent-browser open http://localhost:5173/
call npx agent-browser wait 1000
call npx agent-browser click "//button[contains(., 'The 4 Exploits')]"
call npx agent-browser wait 500
call npx agent-browser screenshot dogfood_report/screenshots/test_xpath.png
call npx agent-browser close
