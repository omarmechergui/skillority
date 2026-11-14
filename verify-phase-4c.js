const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = path.join(__dirname, 'docs', 'evidence', 'ui-phase-4c');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

const instructorScreens = [
  { name: '10_instructor_onboarding', path: '/onboarding/instructor', stitchId: '775f3a0a382c448bbdb979ef1c9b2089' },
  { name: '47_instructor_dashboard', path: '/instructor/dashboard', stitchId: 'a3915873918a4282a597a7daee3610e3' },
  { name: '48_instructor_courses', path: '/instructor/courses', stitchId: '0f2d480da3c847a98eb35cf572c29bc9' },
  { name: '49_create_course', path: '/instructor/courses/create', stitchId: '4859ce873fe741d48c89f5c404dfb4c7' },
  { name: '50_course_overview', path: '/instructor/courses/course-1', stitchId: '91e30a5996054fa29d009772c9162973' },
  { name: '51_curriculum_builder', path: '/instructor/courses/course-1/curriculum', stitchId: '9b360a0b22a2491fa122bc13d96924b2' },
  { name: '52_hybrid_lesson_builder', path: '/instructor/courses/course-1/lessons/les-1-1/edit', stitchId: 'a2969e8528e64885816b754bd67f6677' },
  { name: '53_lesson_preview', path: '/instructor/courses/course-1/lessons/les-1-1/preview', stitchId: 'c50f836371cb4611a2f6fb39f60b4a45' },
  { name: '54_assessment_builder', path: '/instructor/courses/course-1/assessment/edit', stitchId: '7be33f6797a7407cb5cf3c95973c79be' },
  { name: '55_assessment_preview', path: '/instructor/courses/course-1/assessment/preview', stitchId: '90184ade8fcad5958e0f99ce3a63fde6' },
  { name: '56_student_management', path: '/instructor/students', stitchId: 'bf8e7571c5904faa87bf3cdf3f082628' },
  { name: '57_student_directory', path: '/instructor/students/directory', stitchId: 'e9eb8dabe59840414093dae7e4292a2a' },
  { name: '58_student_progress', path: '/instructor/students/usr-student-01', stitchId: '0d788dfe310642e580112a61eb626345' },
  { name: '59_student_course_progress', path: '/instructor/students/usr-student-01/courses/course-1', stitchId: '58222f7b5e49475987792677ec88a620' },
  { name: '60_instructor_profile', path: '/instructor/profile', stitchId: '9d554a99370b42f1a66a7f05809bb45d' },
  { name: '61_instructor_settings', path: '/instructor/settings', stitchId: '26ff641322f241a3bc8c9629b3ae3ef7' },
  { name: '62_instructor_notifications', path: '/instructor/notifications', stitchId: 'bf873fdf08cf4fdbaf6a72ecdd61cb85' },
  { name: '63_create_lesson_basics', path: '/instructor/courses/course-1/lessons/create', stitchId: 'Lesson Builder Project 8177869117756269574' },
];

async function run() {
  console.log('Capturing screenshots for UI-4C (Instructor)...');
  const results = [];

  for (const s of instructorScreens) {
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

  fs.writeFileSync(path.join(evidenceDir, 'ui-phase-4c-evidence-log.json'), JSON.stringify(results, null, 2));
  console.log('UI-4C verification complete!');
  process.exit(0);
}

run();

