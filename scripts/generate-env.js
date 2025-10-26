// simple generator: reads process.env or .env.local and writes environment.ts/.prod.ts
const fs = require('fs');
const path = require('path');

function readDotEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  const content = fs.readFileSync(file, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) return;
    let [, key, val] = match;
    // remove optional surrounding quotes
    if (val && ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  });
  return env;
}

const dotEnv = readDotEnv(path.resolve(__dirname, '..', '.env.local'));
const envSource = Object.assign({}, dotEnv, process.env);

function v(key, fallback = '') {
  return envSource[key] !== undefined ? envSource[key] : fallback;
}

function makeEnv(prod = false) {
  const env = {
    production: prod,
    version: {
      major: Number(v('VERSION_MAJOR', '1')),
      minor: Number(v('VERSION_MINOR', '0')),
      date: v('VERSION_DATE', new Date().toISOString().split('T')[0]),
    },
    firebase: {
      apiKey: v('FIREBASE_API_KEY', ''),
      authDomain: v('FIREBASE_AUTH_DOMAIN', ''),
      projectId: v('FIREBASE_PROJECT_ID', ''),
      storageBucket: v('FIREBASE_STORAGE_BUCKET', ''),
      messagingSenderId: v('FIREBASE_MESSAGING_SENDER_ID', ''),
      appId: v('FIREBASE_APP_ID', ''),
      measurementId: v('FIREBASE_MEASUREMENT_ID', ''),
    },
  };
  return `export const environment = ${JSON.stringify(env, null, 2)};\n`;
}

const outDir = path.resolve(__dirname, '..', 'src', 'environments');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'environment.ts'), makeEnv(false), 'utf8');
fs.writeFileSync(path.join(outDir, 'environment.prod.ts'), makeEnv(true), 'utf8');
console.log('Generated environment files: src/environments/environment.ts(.prod).');

// optional: replace placeholder in src/index.html if present
try {
  const indexPath = path.resolve(__dirname, '..', 'src', 'index.html');
  if (fs.existsSync(indexPath)) {
    let index = fs.readFileSync(indexPath, 'utf8');
    const placeholder = '__FIREBASE_MEASUREMENT_ID__';
    const measurementId = v('FIREBASE_MEASUREMENT_ID', '');
    if (index.includes(placeholder) && measurementId) {
      const replaced = index.replace(new RegExp(placeholder, 'g'), measurementId);
      fs.writeFileSync(indexPath, replaced, 'utf8');
      console.log('Replaced measurement id placeholder in src/index.html');
    }
  }
} catch (e) {
  console.warn('Index.html replacement skipped:', e.message);
}