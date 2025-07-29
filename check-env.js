require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log(
  'NEXT_PUBLIC_API_KEY:',
  process.env.NEXT_PUBLIC_API_KEY
    ? `${process.env.NEXT_PUBLIC_API_KEY.substring(0, 10)}...`
    : 'undefined'
);
console.log(
  'Expected API_KEY:',
  'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d'.substring(
    0,
    10
  ) + '...'
);
console.log(
  'Keys match:',
  process.env.NEXT_PUBLIC_API_KEY ===
    'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d'
);
