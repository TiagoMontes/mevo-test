import { BRAZILIAN_STATES, VALIDATION_LIMITS } from "./app.constants"
import { ValidationError } from "./types"
import { hasLetter, hasRepeatingDigits, matchesDosageFormat } from "./utils"

export class prescriptionValidator{
    isFieldRequired(value: string): boolean {
        return value != null && value.trim().length > 0
    }
    
    validateCpf(cpf: string): boolean {
        if (!cpf) return false
        
        if (hasLetter(cpf)) return false
        if(cpf.length !== VALIDATION_LIMITS.CPF_LENGTH) return false

        if (hasRepeatingDigits(cpf)) return false

        const invalidSequences = [
            '01234567890',
            '12345678901', 
            '23456789012',
            '10987654321',
            '09876543210'
        ]
        
        if (invalidSequences.includes(cpf)) return false

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
        
        if (hasLetter(crm)) return false
        
        return crm.length === VALIDATION_LIMITS.CRM_LENGTH
    }

    validateUf(uf: string): boolean {
        if (!uf) return false
    
        return BRAZILIAN_STATES.includes(uf.toUpperCase())
    }

    validateDuration(duration: string): boolean {
        if (!duration) return false
        
        const durationNumber = parseInt(duration)
        return !isNaN(durationNumber) && durationNumber >= VALIDATION_LIMITS.MIN_DURATION_DAYS && durationNumber <= VALIDATION_LIMITS.MAX_DURATION_DAYS
    }

    validateControlledMedication(controlled: string, notes: string, duration: string): { isValid: boolean, errors: ValidationError[] } {
        const errors: ValidationError[] = []

        const isControlled = controlled?.toLowerCase() === 'true'
        
        if (isControlled) {
            if (!notes || notes.trim().length === 0) {
                errors.push({
                    message: "Medicamentos controlados requerem observações",
                    value: notes
                })
            }
            
            const durationNumber = parseInt(duration)
            if (!isNaN(durationNumber) && durationNumber > VALIDATION_LIMITS.MAX_CONTROLLED_DURATION_DAYS) {
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

        return matchesDosageFormat(trimmedDosage)
    }
}