@echo off
echo Running Modals and Feeds Dogfood Tests...

call npx agent-browser open http://localhost:5173/
call npx agent-browser wait 1000
call npx agent-browser snapshot -i

echo Testing Statutory Compendium Modal
call npx agent-browser click @e30
call npx agent-browser wait 1200
call npx agent-browser screenshot dogfood_report/screenshots/10_statutory_compendium_modal.png
call npx agent-browser snapshot -i
call npx agent-browser click @e2
call npx agent-browser wait 500

echo Testing Regulatory Intelligence & KB Modal
call npx agent-browser snapshot -i
call npx agent-browser click @e31
call npx agent-browser wait 1200
call npx agent-browser screenshot dogfood_report/screenshots/11_regulatory_intelligence_modal.png
call npx agent-browser snapshot -i
call npx agent-browser click @e2
call npx agent-browser wait 500

echo Testing Sync NICGEP Feed Button
call npx agent-browser snapshot -i
call npx agent-browser click @e32
call npx agent-browser wait 1500
call npx agent-browser screenshot dogfood_report/screenshots/12_nicgep_sync_toast.png

call npx agent-browser close
echo Modals and Feeds Tests completed!
