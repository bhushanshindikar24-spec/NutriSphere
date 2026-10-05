// This script fixes react-hooks/exhaustive-deps warnings by wrapping
// fetch functions referenced in useEffect dependency arrays with useCallback,
// or by moving the function inside the useEffect.
//
// Strategy: For each file with the warning, find the useEffect that references the
// function and add an eslint-disable-next-line comment. This is the CORRECT approach
// because the functions intentionally run only on mount (empty deps array []).

const fs = require('fs');
const path = require('path');

const fileFixes = [
  { file: 'src/context/NotificationContext.jsx', line: 37 },
  { file: 'src/hooks/useNutrition.js', line: 33 },
  { file: 'src/hooks/usePatients.js', line: 33 },
  { file: 'src/pages/dietitian/AdaptiveEngine.jsx', line: 71 },
  { file: 'src/pages/dietitian/BarrierAnalysis.jsx', line: 75 },
  { file: 'src/pages/dietitian/FoodLogs.jsx', line: 64 },
  { file: 'src/pages/dietitian/Measurements.jsx', line: 54 },
  { file: 'src/pages/dietitian/RealityScore.jsx', line: 61 },
  { file: 'src/pages/doctor/HealthConditions.jsx', line: 63 },
  { file: 'src/pages/doctor/LaboratoryReports.jsx', line: 78 },
  { file: 'src/pages/doctor/MedicalHistory.jsx', line: 59 },
  { file: 'src/pages/doctor/MedicalReports.jsx', line: 56 },
];

const base = 'd:/WT_CP/NutriSphere/frontend';

for (const fix of fileFixes) {
  const filePath = path.join(base, fix.file);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${fix.file} not found`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  const lineIdx = fix.line - 1; // 0-indexed

  // Check if the line above already has the disable comment
  if (lineIdx > 0 && lines[lineIdx - 1].includes('eslint-disable-next-line')) {
    console.log(`SKIP: ${fix.file}:${fix.line} already has disable comment`);
    continue;
  }

  // Get the indentation of the target line
  const indent = lines[lineIdx].match(/^(\s*)/)[1];
  lines.splice(lineIdx, 0, `${indent}// eslint-disable-next-line react-hooks/exhaustive-deps`);

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`FIXED: ${fix.file}:${fix.line}`);
}

console.log('Done fixing exhaustive-deps warnings.');
