const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'dogfood_report');
const screenDir = path.join(outDir, 'screenshots');
if (!fs.existsSync(screenDir)) {
  fs.mkdirSync(screenDir, { recursive: true });
}

const testResults = {
  date: new Date().toISOString(),
  url: 'http://localhost:5173/',
  steps: [],
  issues: [],
  a11y: null,
  vitals: null,
  consoleErrors: []
};

function runChain(commands, stepName, description) {
  console.log(`\n========================================`);
  console.log(`▶ [STEP] ${stepName}: ${description}`);
  console.log(`========================================`);
  const fullCmd = commands.join(' && ');
  const wrapped = `cmd.exe /c "${fullCmd} && npx agent-browser close"`;
  const start = Date.now();
  try {
    const res = execSync(wrapped, { encoding: 'utf8', timeout: 35000 });
    const duration = Date.now() - start;
    console.log(`✔ [SUCCESS] (${duration}ms)`);
    testResults.steps.push({
      stepName,
      description,
      status: 'PASS',
      duration,
      output: res.trim()
    });
    return { ok: true, output: res.trim() };
  } catch (err) {
    const duration = Date.now() - start;
    console.error(`✖ [FAIL] (${duration}ms):`, err.message);
    const out = err.stdout ? err.stdout.toString() : '';
    testResults.steps.push({
      stepName,
      description,
      status: 'FAIL',
      duration,
      error: err.message,
      output: out
    });
    return { ok: false, error: err.message, output: out };
  }
}

async function runAllTests() {
  console.log('Starting Dogfood Test Suite for CHEIRAP e-Procurement Integrity Monitoring System...');

  // 1. Initial Orient & Annotated Screenshot
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1500',
    'npx agent-browser screenshot --annotate dogfood_report/screenshots/01_hero_annotated.png',
    'npx agent-browser snapshot -i'
  ], 'ORIENT_HERO', 'Initial page load with annotated screenshot and interactive snapshot');

  // 2. Hero Tab: 4 Exploits
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "2. The 4 Exploits" click',
    'npx agent-browser wait 1000',
    'npx agent-browser screenshot dogfood_report/screenshots/02_hero_exploits.png'
  ], 'HERO_TAB_EXPLOITS', 'Explore Tab 2: The 4 Exploits');

  // 3. Hero Tab: Dual-Brain AI
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "3. Dual-Brain AI" click',
    'npx agent-browser wait 1000',
    'npx agent-browser screenshot dogfood_report/screenshots/03_hero_dual_brain.png'
  ], 'HERO_TAB_DUAL_BRAIN', 'Explore Tab 3: Dual-Brain AI');

  // 4. Hero Tab: Venue Verification
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "4. Venue Verification" click',
    'npx agent-browser wait 1000',
    'npx agent-browser screenshot dogfood_report/screenshots/04_hero_venue.png'
  ], 'HERO_TAB_VENUE', 'Explore Tab 4: Venue Verification');

  // 5. GovTech Accessibility & Localization Bar: High Contrast & Text Size
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Contrast: Normal" click',
    'npx agent-browser wait 500',
    'npx agent-browser screenshot dogfood_report/screenshots/05_high_contrast.png',
    'npx agent-browser find text "A+" click',
    'npx agent-browser wait 500',
    'npx agent-browser screenshot dogfood_report/screenshots/06_text_scale_large.png'
  ], 'GOVTECH_A11Y_CONTROLS', 'Test high contrast toggle and font scaling (A+)');

  // 6. GovTech Localization: Manipuri & Hindi Language Switch
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "মৈতৈলোন্" click',
    'npx agent-browser wait 500',
    'npx agent-browser screenshot dogfood_report/screenshots/07_lang_manipuri.png',
    'npx agent-browser find text "हिन्दी" click',
    'npx agent-browser wait 500',
    'npx agent-browser screenshot dogfood_report/screenshots/08_lang_hindi.png'
  ], 'GOVTECH_LOCALIZATION', 'Test Language selector (Manipuri & Hindi)');

  // 7. Top Navigation Modals: Statutory Compendium
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Statutory Compendium (CVC & GFR)" click',
    'npx agent-browser wait 1000',
    'npx agent-browser screenshot dogfood_report/screenshots/09_statutory_compendium_modal.png'
  ], 'MODAL_STATUTORY_COMPENDIUM', 'Open Statutory Compendium Modal and verify legal provisions');

  // 8. Top Navigation Modals: Regulatory Intelligence & KB
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Regulatory Intelligence & KB" click',
    'npx agent-browser wait 1000',
    'npx agent-browser screenshot dogfood_report/screenshots/10_regulatory_intelligence_modal.png'
  ], 'MODAL_REGULATORY_KB', 'Open Regulatory Intelligence & KB Explorer Modal');

  // 9. Sync NICGEP Feed simulation
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Sync NICGEP Feed" click',
    'npx agent-browser wait 1500',
    'npx agent-browser screenshot dogfood_report/screenshots/11_nicgep_sync_toast.png'
  ], 'SYNC_NICGEP_FEED', 'Trigger real-time SOAP/XML feed sync simulation and verify toast');

  // 10. Login Flow -> Security Clearance Portal
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Login" click',
    'npx agent-browser wait 1000',
    'npx agent-browser screenshot dogfood_report/screenshots/12_login_screen.png',
    'npx agent-browser find text "Authorize Security Clearance" click',
    'npx agent-browser wait 1500',
    'npx agent-browser screenshot dogfood_report/screenshots/13_dashboard_authenticated.png'
  ], 'LOGIN_FLOW', 'Test NIC SSO authentication and transition to Surveillance Dashboard');

  // 11. Dashboard: Tier Filters (RED / AMBER / GREEN)
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Monitoring Dashboard" click',
    'npx agent-browser wait 1000',
    'npx agent-browser find text "RED (Critical): ₹43.0 Cr (1 work)" click',
    'npx agent-browser wait 800',
    'npx agent-browser screenshot dogfood_report/screenshots/14_filter_red.png',
    'npx agent-browser find text "AMBER (Advisory): ₹814.3 Cr (36 works)" click',
    'npx agent-browser wait 800',
    'npx agent-browser screenshot dogfood_report/screenshots/15_filter_amber.png',
    'npx agent-browser find text "GREEN (Compliant): ₹1017.0 Cr (54 works)" click',
    'npx agent-browser wait 800',
    'npx agent-browser screenshot dogfood_report/screenshots/16_filter_green.png'
  ], 'DASHBOARD_TIER_FILTERS', 'Test Vigilance Spectrum filtering: RED, AMBER, GREEN');

  // 12. Dashboard: Search Filtering & Pagination
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Monitoring Dashboard" click',
    'npx agent-browser wait 1000',
    'npx agent-browser fill "input[placeholder*=\'Search\']" "Water"',
    'npx agent-browser wait 800',
    'npx agent-browser screenshot dogfood_report/screenshots/17_search_water.png',
    'npx agent-browser fill "input[placeholder*=\'Search\']" ""',
    'npx agent-browser wait 500',
    'npx agent-browser find text "Next" click',
    'npx agent-browser wait 800',
    'npx agent-browser screenshot dogfood_report/screenshots/18_pagination_page_2.png',
    'npx agent-browser find text "Previous" click',
    'npx agent-browser wait 800',
    'npx agent-browser screenshot dogfood_report/screenshots/19_pagination_page_1.png'
  ], 'DASHBOARD_SEARCH_PAGINATION', 'Test search query input and table pagination');

  // 13. Case Detail Dossier Modal
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Monitoring Dashboard" click',
    'npx agent-browser wait 1000',
    'npx agent-browser find role button click --name "Dossier"',
    'npx agent-browser wait 1500',
    'npx agent-browser screenshot dogfood_report/screenshots/20_case_dossier_modal.png',
    'npx agent-browser scroll down 400',
    'npx agent-browser wait 500',
    'npx agent-browser screenshot dogfood_report/screenshots/21_case_dossier_statutory.png'
  ], 'CASE_DOSSIER_MODAL', 'Open forensic case dossier, verify Radar Chart and CVC statutory breakdown');

  // 14. Pre-Award Stay / Hold Order Modal & Dispatch Flow
  runChain([
    'npx agent-browser open http://localhost:5173/',
    'npx agent-browser wait 1000',
    'npx agent-browser snapshot -i',
    'npx agent-browser find text "Monitoring Dashboard" click',
    'npx agent-browser wait 1000',
    'npx agent-browser find role button click --name "Info"',
    'npx agent-browser wait 1500',
    'npx agent-browser screenshot dogfood_report/screenshots/22_stay_order_modal.png',
    'npx agent-browser find text "Dispatch Pre-Award Hold Order" click',
    'npx agent-browser wait 1500',
    'npx agent-browser screenshot dogfood_report/screenshots/23_stay_order_dispatched_toast.png'
  ], 'PRE_AWARD_STAY_ORDER_DISPATCH', 'Issue statutory Pre-Award Stay Order with notice dispatch');

  // 15. Run A11Y Audit
  console.log(`\n========================================`);
  console.log(`▶ [AUDIT] Running axe-core accessibility audit...`);
  console.log(`========================================`);
  try {
    const a11yRes = execSync('npx agent-browser a11y http://localhost:5173/ --json', { encoding: 'utf8', timeout: 30000 });
    testResults.a11y = JSON.parse(a11yRes);
    console.log(`✔ [A11Y] Violations: ${testResults.a11y.violations ? testResults.a11y.violations.length : 0}`);
  } catch (err) {
    console.warn(`[A11Y WARN]`, err.message);
  }

  // 16. Run Web Vitals
  console.log(`\n========================================`);
  console.log(`▶ [VITALS] Measuring Core Web Vitals...`);
  console.log(`========================================`);
  try {
    const vitalsRes = execSync('npx agent-browser vitals http://localhost:5173/ --json', { encoding: 'utf8', timeout: 30000 });
    testResults.vitals = JSON.parse(vitalsRes);
    console.log(`✔ [VITALS] LCP: ${testResults.vitals.lcp ? testResults.vitals.lcp.value : 'N/A'}ms, TTFB: ${testResults.vitals.ttfb ? testResults.vitals.ttfb.value : 'N/A'}ms`);
  } catch (err) {
    console.warn(`[VITALS WARN]`, err.message);
  }

  // Save JSON test results
  fs.writeFileSync(path.join(outDir, 'test_results.json'), JSON.stringify(testResults, null, 2), 'utf8');
  console.log('\n✔ All dogfood tests completed. Results saved to dogfood_report/test_results.json');
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
});
