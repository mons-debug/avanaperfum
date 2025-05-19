const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

console.log('🔍 Verifying environment setup...\n');

// Check for .env files
const envFiles = [
  '.env.local',
  '.env.development.local',
  '.env.development',
  '.env'
];

console.log('📁 Checking for environment files:');
envFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// Load environment variables
console.log('\n📥 Loading environment variables...');
dotenv.config({ path: '.env.local' });

// Check MongoDB URI
const mongoUri = process.env.MONGODB_URI;
console.log('\n🔑 Checking MONGODB_URI:');
if (mongoUri) {
  console.log('✅ MONGODB_URI is defined');
  console.log(`📝 URI Format: ${mongoUri.replace(/\/\/[^@]*@/, '//****:****@')}`);
} else {
  console.log('❌ MONGODB_URI is not defined');
}

// Check Node environment
console.log('\n🌍 Environment Information:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// List all non-sensitive environment variables
console.log('\n📋 Available Environment Variables:');
Object.keys(process.env)
  .filter(key => !key.includes('SECRET') && !key.includes('KEY'))
  .sort()
  .forEach(key => {
    const value = key === 'MONGODB_URI' 
      ? '[HIDDEN]' 
      : process.env[key];
    console.log(`${key}: ${value}`);
  });

console.log('\n✨ Environment verification complete!'); 