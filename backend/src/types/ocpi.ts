export interface OCPITariff {
  id: string;
  currency: string;
  elements: TariffElement[];
  last_updated: string;
}

export interface TariffElement {
  price_components: PriceComponent[];
  restrictions?: Restrictions;
}

export interface PriceComponent {
  type: "TIME" | "ENERGY" | "FLAT";
  price: number;
  step_size: number;
}

export interface Restrictions {
  start_time?: string;
  end_time?: string;
}

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
