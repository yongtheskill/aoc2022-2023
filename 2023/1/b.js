const fs = require('fs');

const f = fs.readFileSync('./in.txt').toString();
const lines = f.split('\n');

let total = 0;

const isNumber = (char) => {
  if (typeof char !== 'string') {
    return false;
  }

  if (char.trim() === '') {
    return false;
  }

  return !isNaN(char);
};

const regexNumberStartCheck = (s) => {
  if (s.match(/^(one)/i)) return '1';
  if (s.match(/^(two)/i)) return '2';
  if (s.match(/^(three)/i)) return '3';
  if (s.match(/^(four)/i)) return '4';
  if (s.match(/^(five)/i)) return '5';
  if (s.match(/^(six)/i)) return '6';
  if (s.match(/^(seven)/i)) return '7';
  if (s.match(/^(eight)/i)) return '8';
  if (s.match(/^(nine)/i)) return '9';
  return false;
};

const regexNumberEndCheck = (s) => {
  if (s.match(/(one)$/i)) return '1';
  if (s.match(/(two)$/i)) return '2';
  if (s.match(/(three)$/i)) return '3';
  if (s.match(/(four)$/i)) return '4';
  if (s.match(/(five)$/i)) return '5';
  if (s.match(/(six)$/i)) return '6';
  if (s.match(/(seven)$/i)) return '7';
  if (s.match(/(eight)$/i)) return '8';
  if (s.match(/(nine)$/i)) return '9';
  return false;
};

const firstDigit = (s) => {
  for (let i = 0; i < s.length; i++) {
    if (isNumber(s[i])) return s[i];
    const checkString = s.substring(i);
    const check = regexNumberStartCheck(checkString);
    if (check) return check;
  }
};

const lastDigit = (s) => {
  for (let i = s.length - 1; i >= 0; i--) {
    if (isNumber(s[i])) return s[i];
    const checkString = s.substring(0, i + 1);
    const check = regexNumberEndCheck(checkString);
    if (check) return check;
  }
};

for (const line of lines) {
  const first = firstDigit(line);
  const last = lastDigit(line);
  const n = Number(first.concat(last));
  total += n;
}
console.log(total);
