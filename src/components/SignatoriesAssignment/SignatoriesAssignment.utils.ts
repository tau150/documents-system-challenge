const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function validateEmailArray(emailArray: string[]): boolean {
  return emailArray.every((email) => validateEmail(email));
}
