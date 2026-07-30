const crypto = require('crypto');

console.log('\n=== SECRETS STRAPI POUR PRODUCTION ===\n');
console.log('IMPORTANT : Copie ces valeurs dans ton fichier .env.production\n');

console.log('APP_KEYS (2 clés séparées par une virgule):');
const key1 = crypto.randomBytes(32).toString('base64');
const key2 = crypto.randomBytes(32).toString('base64');
console.log(`${key1},${key2}\n`);

console.log('API_TOKEN_SALT:');
console.log(crypto.randomBytes(32).toString('base64') + '\n');

console.log('ADMIN_JWT_SECRET:');
console.log(crypto.randomBytes(32).toString('base64') + '\n');

console.log('TRANSFER_TOKEN_SALT:');
console.log(crypto.randomBytes(32).toString('base64') + '\n');

console.log('JWT_SECRET:');
console.log(crypto.randomBytes(32).toString('base64') + '\n');

console.log('==========================================\n');
