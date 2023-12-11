const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split('\n');

let total = 0;

for (const line of lines) {
  const digits = line.replace(/\D/g, '');
  const first = digits.charAt(0);
  const last = digits.charAt(digits.length - 1);
  const n = Number(first.concat(last));
  total += n;
}

console.log(total);
