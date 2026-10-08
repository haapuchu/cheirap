@echo off
call npx agent-browser open http://localhost:5173/
call npx agent-browser wait 1000
call npx agent-browser snapshot -i
call npx agent-browser click @e28
call npx agent-browser wait 1200
call npx agent-browser snapshot -i
call npx agent-browser click @e180
call npx agent-browser wait 1500
call npx agent-browser snapshot -i
call npx agent-browser click @e210
call npx agent-browser wait 1200
call npx agent-browser screenshot dogfood_report/screenshots/verified_audit_trail_timeline_fixed.png
call npx agent-browser close
echo Fixed Timeline Verified!
