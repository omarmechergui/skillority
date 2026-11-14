const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = path.join(__dirname, 'docs', 'evidence', 'ui-phase-4b');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

const companyScreens = [
  { name: '29_company_dashboard', path: '/company/dashboard', stitchId: 'fe166c4068304a08af013915bc6642aa' },
  { name: '30_company_opportunities', path: '/company/opportunities', stitchId: '9827f602301742728cc425d2af95e265' },
  { name: '31_create_opportunity', path: '/company/opportunities/create', stitchId: 'ea413ccc59bd402abb391eb8dabe5984' },
  { name: '32_edit_opportunity', path: '/company/opportunities/opp-1/edit', stitchId: '58222f7b5e49475987792677ec88a620' },
  { name: '33_opportunity_details', path: '/company/opportunities/opp-1', stitchId: 'ac0428d37431429dae749043dddc9b6b' },
  { name: '34_applications_inbox', path: '/company/applications', stitchId: '0414093dae7e4292a2a9a2e5c56a66f3' },
  { name: '35_application_details', path: '/company/applications/usr-student-01', stitchId: '522c04e805cb4277b4e799d929cc6207' },
  { name: '36_talent_discovery', path: '/company/talent', stitchId: '7be33203f6ca4ef59c90a2a4b86377dc' },
  { name: '37_student_talent_profile', path: '/company/talent/usr-student-01', stitchId: '992a5ee11f424fc9b3046fec36270b22' },
  { name: '38_saved_candidates', path: '/company/talent/saved', stitchId: 'd6dfd36dbf5c40498eb73845b4bfaf2c' },
  { name: '39_candidate_evaluation', path: '/company/talent/usr-student-01/evaluate', stitchId: '784ba3bb31e14e1f822e11894a4aeae3' },
  { name: '40_recruitment_pipeline', path: '/company/pipeline', stitchId: '6b9c97b83f3e4bc6a35002ecdf885e78' },
  { name: '41_candidate_chat', path: '/company/messages', stitchId: '10f274cb33bc4076a917e7617b8f9e67' },
  { name: '42_company_profile', path: '/company/profile', stitchId: '9d554a99370b42f1a66a7f05809bb45d' },
  { name: '43_recruiter_profile', path: '/company/profile/personal', stitchId: '773229b4e8e04043b22cf3fe576082c5' },
  { name: '44_recruiter_settings', path: '/company/settings', stitchId: '26ff641322f241a3bc8c9629b3ae3ef7' },
  { name: '45_recruiter_notifications', path: '/company/notifications', stitchId: 'bf873fdf08cf4fdbaf6a72ecdd61cb85' },
];

async function run() {
  console.log('Capturing runtime screenshots for UI-4B (Company)...');
  const results = [];

  for (const s of companyScreens) {
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

  fs.writeFileSync(path.join(evidenceDir, 'ui-phase-4b-evidence-log.json'), JSON.stringify(results, null, 2));
  console.log('UI-4B verification complete!');
  process.exit(0);
}

run();

