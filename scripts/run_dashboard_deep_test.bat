@echo off
echo Testing Login -> Dashboard -> Filter RED -> Dossier -> Stay Order Dispatch...

call npx agent-browser open http://localhost:5173/
call npx agent-browser wait 1000
call npx agent-browser snapshot -i

echo Step 1: Navigating to Login
call npx agent-browser click @e29
call npx agent-browser wait 1000
call npx agent-browser snapshot -i

echo Step 2: Clicking Sign In & Access Dashboard
call npx agent-browser click @e44
call npx agent-browser wait 1500
call npx agent-browser screenshot dogfood_report/screenshots/14_dashboard_logged_in.png
call npx agent-browser snapshot -i

echo Step 3: Filtering RED Critical Tiers
call npx agent-browser click @e19
call npx agent-browser wait 1000
call npx agent-browser screenshot dogfood_report/screenshots/15_dashboard_filter_red.png
call npx agent-browser snapshot -i

echo Step 4: Opening Dossier Modal for Critical RED Tender
call npx agent-browser click @e180
call npx agent-browser wait 1500
call npx agent-browser screenshot dogfood_report/screenshots/16_case_dossier_modal.png
call npx agent-browser snapshot -i

echo Step 5: Closing Dossier Modal
call npx agent-browser click @e2
call npx agent-browser wait 800
call npx agent-browser snapshot -i

echo Step 6: Opening Pre-Award Stay / Hold Order Modal
call npx agent-browser click @e181
call npx agent-browser wait 1200
call npx agent-browser screenshot dogfood_report/screenshots/17_stay_order_modal.png
call npx agent-browser snapshot -i

echo Step 7: Dispatching Pre-Award Hold Order
call npx agent-browser click @e18
call npx agent-browser wait 1500
call npx agent-browser screenshot dogfood_report/screenshots/18_stay_order_dispatched_toast.png

call npx agent-browser close
echo Dashboard Deep Test completed!
