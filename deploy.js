const surgeSDK = require('C:/Users/USER/AppData/Roaming/npm/node_modules/surge/node_modules/surge-sdk');
const { execSync } = require('child_process');
const path = require('path');

const email = 'techfest.iitb.ca.landing@gmail.com';
const pass = 'TechfestIITB@2025!Secret';
const domain = 'techfest-iitb-landing.surge.sh';
const projectPath = __dirname;

console.log('Authenticating with Surge API...');
const sdk = surgeSDK({
  endpoint: 'https://surge.surge.sh'
});

sdk.token({ user: email, pass: pass }, { msg: 'Techfest IIT Bombay Deploy' }, (err, creds) => {
  if (err) {
    console.error('Auth error:', err);
    process.exit(1);
  }
  
  const token = creds.pass.trim();
  console.log('Surge token acquired successfully.');
  
  // Set env vars and run surge CLI
  try {
    const cmd = `npx.cmd surge "${projectPath}" "${domain}" --token "${token}"`;
    console.log(`Executing: ${cmd}`);
    const output = execSync(cmd, {
      env: {
        ...process.env,
        SURGE_LOGIN: email,
        SURGE_TOKEN: token
      },
      stdio: 'inherit'
    });
    console.log(`\n========================================`);
    console.log(`SUCCESS! Live Hosted Link:`);
    console.log(`https://${domain}`);
    console.log(`========================================\n`);
  } catch (deployErr) {
    console.error('Deployment error:', deployErr.message);
    process.exit(1);
  }
});
