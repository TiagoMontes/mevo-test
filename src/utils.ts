export function normalizeString(s: string) {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function hasRepeatingDigits(digits: string) {
  return (/^(\d)\1{10}$/.test(digits))
}

export function hasLetter(digits: string) {
  return /[a-zA-Z]/.test(digits)
}

export function matchesDosageFormat(dosage: string) {
  const dosagePattern = /^\d+(\.\d+)?(mg|g|ml|cp)$/i

  return dosagePattern.test(dosage)
}