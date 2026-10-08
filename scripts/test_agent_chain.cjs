const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runChain(commands) {
  const fullCmd = commands.join(' && ');
  const wrapped = `cmd.exe /c "${fullCmd} && npx agent-browser close"`;
  console.log(`[RUN] ${wrapped}`);
  const start = Date.now();
  try {
    const res = execSync(wrapped, { encoding: 'utf8', timeout: 25000 });
    console.log(`[DONE] in ${Date.now() - start}ms:`, res.trim());
    return { ok: true, output: res };
  } catch (err) {
    console.log(`[ERR] in ${Date.now() - start}ms:`, err.message);
    return { ok: false, error: err.message, output: err.stdout ? err.stdout.toString() : '' };
  }
}

console.log('Testing chained command with close...');
const res = runChain([
  'npx agent-browser open http://localhost:5173/',
  'npx agent-browser screenshot dogfood_report/screenshots/test_clean.png'
]);
console.log('Test clean result ok:', res.ok);
