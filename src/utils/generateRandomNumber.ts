import * as crypto from 'crypto';

export function getRandomSixDigitNumber() {
  const randomBytes = crypto.randomBytes(3); // 3 bytes = 24 bits
  const randomNumber = parseInt(randomBytes.toString('hex'), 16); // Convert bytes to hex and then to an integer
  const sixDigitNumber = randomNumber % 1000000; // Ensure it's a 6-digit number by taking the modulo with 1,000,000
  return sixDigitNumber.toString().padStart(6, '0'); // Pad with leading zeros if necessary
}
