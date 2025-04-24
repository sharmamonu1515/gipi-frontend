export interface PromptData {
    editedBy: string
    temperature: number
    maxOutputTokens: number
    topP: number
    topK: number
    _id: string
    section: string
    prompt: string
    createdBy: string
    date: string
}

export interface SummaryData {
    dataToChange: string
    modifiedData: string[]
}

export interface FinancialAnalysisData {
    _id: string;
    company_id: string;
    section: string;
    analysis: string;
    createdAt: string;
    updatedAt: string; 
    __v: number;
  }