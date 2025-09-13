import { controlledValidationData } from "./types"
import { cleanDigitsRegex, isAllDigitsSame, isDosagePattern } from "./utils"

export class CsvValidator{
    validateRequired(value: string): boolean {
        return value != null && value.trim().length > 0
    }
    
    validateCpf(cpf: string): boolean {
        if (!cpf) return false
        
        const cleanCpf = cleanDigitsRegex(cpf)
        if(cleanCpf.length !== 11) return false

        if (isAllDigitsSame(cleanCpf)) return false

        const invalidSequences = [
            '01234567890',
            '12345678901', 
            '23456789012',
            '10987654321',
            '09876543210'
        ]
        
        if (invalidSequences.includes(cleanCpf)) return false

        return true
    }

    validateDate(dateString: string): boolean {
        if (!dateString) return false
        
        const date = new Date(dateString)
        const today = new Date()
        today.setHours(23, 59, 59, 999)

        if (isNaN(date.getTime())) return false

        if  (date > today) return false

        return true
    }

    validateCrm(crm: string): boolean {
        if (!crm) return false
        
        const cleanCrm = cleanDigitsRegex(crm)
        return cleanCrm.length === 6
    }

    validateUf(uf: string): boolean {
        if (!uf) return false
        
        const validUfs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
        return validUfs.includes(uf.toUpperCase())
    }

    validateDuration(duration: string): boolean {
        if (!duration) return false
        
        const durationNumber = parseInt(duration)
        return !isNaN(durationNumber) && durationNumber > 0 && durationNumber <= 90
    }

    validateControlledMedication(controlled: string, notes: string, duration: string): { isValid: boolean, errors: controlledValidationData[] } {
        const errors: controlledValidationData[] = []

        const isControlled = controlled?.toLowerCase() === 'true'
        
        if (isControlled) {
            if (!notes || notes.trim().length === 0) {
                errors.push({
                    message: "Medicamentos controlados requerem observações",
                    value: notes
                })
            }
            
            const durationNumber = parseInt(duration)
            if (!isNaN(durationNumber) && durationNumber > 60) {
                errors.push({
                    message: "Medicamentos controlados têm duração máxima de 60 dias",
                    value: duration
                })
            }
        }
        
        return { isValid: errors.length === 0, errors }
    }

    validateFrequency(frequency: string): boolean {
        if (!frequency) return false
        
        const trimmedFreq = frequency.trim()
        
        const allPatterns = [
            /^\d+\/\d+h$/i,
            /^se\s+necessário$/i,
            /^quando\s+necessário$/i, 
            /^conforme\s+necessidade$/i,
            /^\d+x\s*(ao\s*dia|dia)$/i
        ]
        
        return allPatterns.some(pattern => pattern.test(trimmedFreq))
    }

    validateDosage(dosage: string): boolean {
        if (!dosage) return false
        
        const trimmedDosage = dosage.trim()

        return isDosagePattern(trimmedDosage)
    }
}