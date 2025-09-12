export class CsvValidator{
    validateCpf(cpf: string): boolean {
        if (!cpf) return false
        
        const cleanCpf = cpf.replace(/\D/g, '') // removendo tudo que nao e numero!!!
        return cleanCpf.length === 11
    }
}