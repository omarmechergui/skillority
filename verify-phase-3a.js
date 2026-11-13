const http = require('http');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = path.join(__dirname, 'docs', 'evidence', 'ui-phase-3a');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

const careerScreens = [
  { name: '21_student_career_opportunities', path: '/student/careers', stitchId: '79547790aeb94096a586ea4cda73ed21' },
  { name: '22_opportunity_details_and_application', path: '/student/careers/opp-1', stitchId: 'dbf83dc12f5b44dfaf8342ce32ffebf2' },
  { name: '23_my_applications_and_saved_opportunities', path: '/student/careers/applications', stitchId: '3aebee52239b42cba8cdd559c94e7412' }
];

console.log('Starting Next.js production server on port 3010 for Phase UI-3A verification...');
const server = spawn('cmd.exe', ['/c', 'npx', 'next', 'start', '-p', '3010'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'pipe'
});

let serverReady = false;

server.stdout.on('data', d => {
  const msg = d.toString();
  console.log('[Next.js]:', msg.trim());
  if (!serverReady && (msg.includes('Ready in') || msg.includes('3010') || msg.includes('started server'))) {
    serverReady = true;
    setTimeout(runVerification, 1200);
  }
});

server.stderr.on('data', d => console.error('[Next.js Error]:', d.toString().trim()));

async function runVerification() {
  console.log('Testing runtime HTTP status and capturing screenshots for Phase UI-3A...');

  const results = [];

  for (const s of careerScreens) {
    const url = 'http://localhost:3010' + s.path;
    const desktopFile = path.join(evidenceDir, `${s.name}_desktop_1440x900.png`);
    const mobileFile = path.join(evidenceDir, `${s.name}_mobile_390x844.png`);

    // 1. HTTP Probe
    let httpStatus = 0;
    let bodyLength = 0;
    let hasHtml = false;

    try {
      const resp = await new Promise((resolve, reject) => {
        const req = http.get(url, r => {
          let body = '';
          r.on('data', c => body += c);
          r.on('end', () => resolve({ status: r.statusCode, length: body.length, html: body.includes('<!DOCTYPE html>') || body.includes('<html') }));
        });
        req.on('error', reject);
        req.setTimeout(5000, () => req.destroy(new Error('timeout')));
      });
      httpStatus = resp.status;
      bodyLength = resp.length;
      hasHtml = resp.html;
      console.log(`HTTP Probe: ${s.path} -> Status: ${httpStatus}, Size: ${bodyLength}B, HTML: ${hasHtml}`);
    } catch (e) {
      console.error(`HTTP Probe FAIL: ${s.path} -> ${e.message}`);
    }

    // 2. Desktop Screenshot (1440x900)
    let desktopSize = 0;
    try {
      execSync(`"${chromePath}" --headless=new --disable-gpu --screenshot="${desktopFile}" --window-size=1440,900 --hide-scrollbars "${url}"`, { timeout: 15000 });
      desktopSize = fs.statSync(desktopFile).size;
      console.log(`  -> Desktop Screenshot OK: ${desktopSize}B (${path.basename(desktopFile)})`);
    } catch (e) {
      console.error(`  -> Desktop Screenshot FAIL: ${e.message}`);
    }

    // 3. Mobile Screenshot (390x844)
    let mobileSize = 0;
    try {
      execSync(`"${chromePath}" --headless=new --disable-gpu --screenshot="${mobileFile}" --window-size=390,844 --hide-scrollbars "${url}"`, { timeout: 15000 });
      mobileSize = fs.statSync(mobileFile).size;
      console.log(`  -> Mobile Screenshot OK: ${mobileSize}B (${path.basename(mobileFile)})`);
    } catch (e) {
      console.error(`  -> Mobile Screenshot FAIL: ${e.message}`);
    }

    results.push({
      screenName: s.name,
      route: s.path,
      stitchId: s.stitchId,
      httpStatus,
      bodyLength,
      hasValidHtml: hasHtml,
      desktopScreenshot: desktopFile,
      desktopSize,
      mobileScreenshot: mobileFile,
      mobileSize,
      status: httpStatus === 200 && desktopSize > 0 && mobileSize > 0 ? 'PASS' : 'FAIL'
    });
  }

  const logFile = path.join(evidenceDir, 'ui-phase-3a-evidence-log.json');
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  console.log('UI Phase 3A verification complete! Log written to: ' + logFile);

  server.kill();
  process.exit(0);
}

setTimeout(() => {
  console.error('Timeout waiting for test run');
  server.kill();
  process.exit(1);
}, 45000);

