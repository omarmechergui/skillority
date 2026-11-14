const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = path.join(__dirname, 'docs', 'evidence', 'ui-phase-4d');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

const adminScreens = [
  { name: '66_admin_dashboard', path: '/admin/dashboard', stitchId: '270034a7479743a493a7972ba7352f1e' },
  { name: '67_user_management', path: '/admin/users', stitchId: 'e4ad9b36b5b1e4596c2d5d16204f83ae' },
  { name: '68_user_details', path: '/admin/users/usr-student-01', stitchId: 'cba8cdd559c94e74123aebee52239b42' },
  { name: '69_user_actions', path: '/admin/users/usr-student-01/manage', stitchId: '1b174a7cb08f427778b9e696902c3836' },
  { name: '70_course_review_dashboard', path: '/admin/courses/reviews', stitchId: '2e437dcbb5bf41cea9eba1dfcd8a6851' },
  { name: '71_course_review_details', path: '/admin/courses/reviews/rev-1', stitchId: '9b50e2ddc9943efb387052637738f61a' },
  { name: '72_approval_rejection_decision', path: '/admin/courses/reviews/rev-1/decide', stitchId: 'a9573a08ec384d3ea3b969e0879404dd' },
  { name: '73_platform_activity_dashboard', path: '/admin/activity', stitchId: '7be33203f6ca4ef59c90a2a4b86377dc' },
  { name: '74_activity_log_details', path: '/admin/activity/log', stitchId: '0414093dae7e4292a2a9a2e5c56a66f3' },
  { name: '75_reports_analytics', path: '/admin/reports', stitchId: '3747ecdd3ecf45bb96fae8538258b6c4' },
  { name: '76_admin_notifications', path: '/admin/notifications', stitchId: 'c94b340d66fb430b9cd77b5593c228d6' },
  { name: '77_admin_settings', path: '/admin/settings', stitchId: '26ff641322f241a3bc8c9629b3ae3ef7' },
  { name: '78_admin_profile', path: '/admin/profile', stitchId: '902c38361b174a7cb08f427778b9e696' },
];

async function run() {
  console.log('Capturing runtime screenshots for UI-4D (Admin)...');
  const results = [];

  for (const s of adminScreens) {
    const url = 'http://localhost:3000' + s.path;
    const desktopFile = path.join(evidenceDir, `${s.name}_desktop_1440x900.png`);
    const mobileFile = path.join(evidenceDir, `${s.name}_mobile_390x844.png`);

    let httpStatus = 0;
    try {
      const resp = await new Promise((res, rej) => {
        const req = http.get(url, (r) => {
          let b = '';
          r.on('data', c => b += c);
          r.on('end', () => res(r.statusCode));
        });
        req.on('error', rej);
        req.setTimeout(8000, () => req.destroy(new Error('timeout')));
      });
      httpStatus = resp;
    } catch (e) {
      console.log(`Probe failed for ${s.path}: ${e.message}`);
    }

    let desktopSize = 0;
    try {
      execSync(`"${chromePath}" --headless=new --disable-gpu --screenshot="${desktopFile}" --window-size=1440,900 --hide-scrollbars "${url}"`, { timeout: 25000 });
      desktopSize = fs.statSync(desktopFile).size;
    } catch (e) {
      console.error(`Desktop FAIL ${s.name}: ${e.message}`);
    }

    let mobileSize = 0;
    try {
      execSync(`"${chromePath}" --headless=new --disable-gpu --screenshot="${mobileFile}" --window-size=390,844 --hide-scrollbars "${url}"`, { timeout: 25000 });
      mobileSize = fs.statSync(mobileFile).size;
    } catch (e) {
      console.error(`Mobile FAIL ${s.name}: ${e.message}`);
    }

    console.log(`Screen ${s.name} -> HTTP: ${httpStatus}, Desktop: ${desktopSize}B, Mobile: ${mobileSize}B`);
    results.push({ ...s, httpStatus, desktopSize, mobileSize, status: desktopSize > 0 && mobileSize > 0 ? 'PASS' : 'FAIL' });
  }

  fs.writeFileSync(path.join(evidenceDir, 'ui-phase-4d-evidence-log.json'), JSON.stringify(results, null, 2));
  console.log('UI-4D verification complete!');
  process.exit(0);
}

run();

