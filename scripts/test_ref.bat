@echo off
call npx agent-browser open http://localhost:5173/
call npx agent-browser wait 1000
call npx agent-browser snapshot -i
call npx agent-browser click @e23
call npx agent-browser wait 1000
call npx agent-browser screenshot dogfood_report/screenshots/test_ref_e23.png
call npx agent-browser close
