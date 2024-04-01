export function generatePassword(
  length: number,
  useUpperCase: boolean,
  useLowerCase: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
): string {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-=_+[]{}|;:,.<>?';

  let chars = '';
  if (useUpperCase) {
    chars += upperCaseChars;
  }
  if (useLowerCase) {
    chars += lowerCaseChars;
  }
  if (useNumbers) {
    chars += numberChars;
  }
  if (useSymbols) {
    chars += symbolChars;
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
