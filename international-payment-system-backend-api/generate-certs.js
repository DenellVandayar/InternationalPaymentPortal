// generate-certs.js
const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

const sslDir = path.join(__dirname, 'ssl');
if (!fs.existsSync(sslDir)) fs.mkdirSync(sslDir);

fs.writeFileSync(path.join(sslDir, 'privatekey.pem'), pems.private);
fs.writeFileSync(path.join(sslDir, 'certificate.pem'), pems.cert);

console.log('Self-signed SSL certs generated in ./ssl folder.');