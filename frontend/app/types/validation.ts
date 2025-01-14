export interface ValidationResult {
  isValid: boolean;
  discrepancies: Discrepancy[];
}

export interface Discrepancy {
  field: string;
  expected: any;
  actual: any;
  message: string;
}
