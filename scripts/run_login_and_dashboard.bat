@echo off
echo Testing Login Flow and Dashboard Navigation...

call npx agent-browser open http://localhost:5173/
call npx agent-browser wait 1000
call npx agent-browser snapshot -i

echo Navigating to Login Page
call npx agent-browser click @e29
call npx agent-browser wait 1000
call npx agent-browser screenshot dogfood_report/screenshots/13_login_page.png
call npx agent-browser snapshot -i

echo Clicking Authorize Security Clearance (State Vigilance Commissioner)
call npx agent-browser click @e19
call npx agent-browser wait 1500
call npx agent-browser screenshot dogfood_report/screenshots/14_dashboard_authenticated.png
call npx agent-browser snapshot -i

echo Filtering by RED Critical Tiers
call npx agent-browser click @e19
call npx agent-browser wait 1000
call npx agent-browser screenshot dogfood_report/screenshots/15_dashboard_filter_red.png
call npx agent-browser snapshot -i

echo Opening Case Dossier for RED Tender
call npx agent-browser click @e180
call npx agent-browser wait 1500
call npx agent-browser screenshot dogfood_report/screenshots/16_case_dossier_modal.png
call npx agent-browser snapshot -i

call npx agent-browser close
echo Login and Dashboard part 1 completed!
