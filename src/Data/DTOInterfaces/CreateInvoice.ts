export interface invoiceCreationDTO {
    companyId: number,
    startDate: string,
    endDate: string,
    includeErroredShifts: boolean
}