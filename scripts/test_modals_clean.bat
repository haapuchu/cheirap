@echo off
echo Testing Statutory Compendium and Close...
call npx agent-browser open http://localhost:5173/
call npx agent-browser wait 1000
call npx agent-browser snapshot -i
call npx agent-browser click @e30
call npx agent-browser wait 1000
call npx agent-browser screenshot dogfood_report/screenshots/10_statutory_compendium_open.png
call npx agent-browser snapshot -i
call npx agent-browser click @e40
call npx agent-browser wait 800

echo Testing Regulatory Intelligence Explorer and Close...
call npx agent-browser snapshot -i
call npx agent-browser click @e31
call npx agent-browser wait 1200
call npx agent-browser screenshot dogfood_report/screenshots/11_regulatory_explorer_open.png
call npx agent-browser snapshot -i
call npx agent-browser click @e2
call npx agent-browser wait 800

echo Testing Sync NICGEP Feed...
call npx agent-browser snapshot -i
call npx agent-browser click @e32
call npx agent-browser wait 1500
call npx agent-browser screenshot dogfood_report/screenshots/12_nicgep_sync_toast_active.png

call npx agent-browser close
echo Modals Clean Test Completed!
