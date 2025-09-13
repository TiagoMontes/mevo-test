export function normalizeString(s: string) {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function cleanDigitsRegex(digit: string) {
  // remove todo tipo de caractere diferente de digito
  return digit.replace(/\D/g, '')
}

export function isAllDigitsSame(digits: string) {
  return (/^(\d)\1{10}$/.test(digits))
}

export function isDosagePattern(dosage: string) {
  const dosagePattern = /^\d+(\.\d+)?(mg|g|ml|cp)$/i

  return dosagePattern.test(dosage)
}