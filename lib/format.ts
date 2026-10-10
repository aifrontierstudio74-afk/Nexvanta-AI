/**
 * Formats a number as Indian Currency (INR) with proper grouping, e.g. ₹20,000
 */
export function formatINR(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  });
  return `₹${formatter.format(amount)}`;
}

/**
 * Normalizes an Indian phone number to +91XXXXXXXXXX
 */
export function normalizeIndianPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }
  return input.startsWith('+') ? input : `+${input}`;
}

/**
 * Validates 10-digit Indian mobile number
 */
export function isValidIndianPhone(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) {
    return /^[6-9]\d{9}$/.test(digits);
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  return false;
}
