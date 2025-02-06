const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const dnsValue = process.env.DNS || 'http://localhost:3000';
const dnsFile = `export const dns = "${dnsValue}";`;

const environmentDir = path.join(__dirname, '../../front/src/environment');
const environmentPath = path.join(environmentDir, 'dns.ts');

if (!fs.existsSync(environmentDir)) {
  fs.mkdirSync(environmentDir, { recursive: true });
}

fs.writeFile(environmentPath, dnsFile, 'utf-8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('dns.ts file successfully created/updated.');
  }
});
