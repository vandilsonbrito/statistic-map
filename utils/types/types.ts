export interface DataFetched {
    cases: Cases
}

export interface Cases {
    [date: string]: CaseData
}

export interface CaseData {
    new: string;
    total: string;
  }