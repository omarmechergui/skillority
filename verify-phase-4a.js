const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = path.join(__dirname, 'docs', 'evidence', 'ui-phase-4a');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

const batch1Screens = [
  { name: '18_learning_progress', path: '/student/progress', stitchId: '0c75bd344d1741b9b8de6395dabccc78' },
  { name: '19_student_profile', path: '/student/profile', stitchId: '302749e9b0dd4f38bacfa4a7aa52843e' },
  { name: '20_student_settings', path: '/student/settings', stitchId: 'd06887c3079442ef86d1d986be8856ab' },
  { name: '26_student_chat_messages', path: '/student/messages', stitchId: '002888e279a54f00b81f651888127dc6' },
  { name: '27_student_notifications', path: '/student/notifications', stitchId: 'c94b340d66fb430b9cd77b5593c228d6' },
  { name: '28_coins_wallet', path: '/student/wallet', stitchId: '06485739c3304a5e84434f9bfd208eb7' },
];

async function runVerification() {
  console.log('Testing runtime HTTP status and capturing screenshots for Phase UI-4A on http://localhost:3000...');

  const results = [];

  for (const s of batch1Screens) {
    const url = 'http://localhost:3000' + s.path;
    const desktopFile = path.join(evidenceDir, `${s.name}_desktop_1440x900.png`);
    const mobileFile = path.join(evidenceDir, `${s.name}_mobile_390x844.png`);

    // 1. HTTP Probe
    let httpStatus = 0;
    let bodyLength = 0;
    let hasHtml = false;

    try {
      const resp = await new Promise((resolve, reject) => {
        const req = http.get(url, (r) => {
          let body = '';
          r.on('data', (c) => (body += c));
          r.on('end', () =>
            resolve({
              status: r.statusCode,
              length: body.length,
              html: body.includes('<!DOCTYPE html>') || body.includes('<html'),
            })
          );
        });
        req.on('error', reject);
        req.setTimeout(10000, () => req.destroy(new Error('timeout')));
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
      execSync(
        `"${chromePath}" --headless=new --disable-gpu --screenshot="${desktopFile}" --window-size=1440,900 --hide-scrollbars "${url}"`,
        { timeout: 25000 }
      );
      desktopSize = fs.statSync(desktopFile).size;
      console.log(`  -> Desktop Screenshot OK: ${desktopSize}B (${path.basename(desktopFile)})`);
    } catch (e) {
      console.error(`  -> Desktop Screenshot FAIL: ${e.message}`);
    }

    // 3. Mobile Screenshot (390x844)
    let mobileSize = 0;
    try {
      execSync(
        `"${chromePath}" --headless=new --disable-gpu --screenshot="${mobileFile}" --window-size=390,844 --hide-scrollbars "${url}"`,
        { timeout: 25000 }
      );
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
      status: httpStatus === 200 && desktopSize > 0 && mobileSize > 0 ? 'PASS' : 'FAIL',
    });
  }

  const logFile = path.join(evidenceDir, 'ui-phase-4a-evidence-log.json');
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  console.log('UI Phase 4A verification complete! Log written to: ' + logFile);
  process.exit(0);
}

runVerification();
