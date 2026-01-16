
export enum CalcMethod {
  REDUCING_BALANCE = 'REDUCING_BALANCE',
  FIXED_ANNUITY = 'FIXED_ANNUITY'
}

export interface LoanState {
  amount: number;
  interestRate: number;
  months: number;
  method: CalcMethod;
}

export interface PaymentScheduleEntry {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

export interface CalculationResult {
  firstMonthPayment: number;
  totalInterest: number;
  totalPayment: number;
  schedule: PaymentScheduleEntry[];
}
