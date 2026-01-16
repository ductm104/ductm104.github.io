
import { CalcMethod, LoanState, CalculationResult, PaymentScheduleEntry } from '../types';

export const calculateLoan = (state: LoanState): CalculationResult => {
  const { amount, interestRate, months, method } = state;
  const monthlyRate = interestRate / 100 / 12;
  const schedule: PaymentScheduleEntry[] = [];
  
  let totalInterest = 0;
  let remainingBalance = amount;

  if (method === CalcMethod.REDUCING_BALANCE) {
    const fixedPrincipal = amount / months;
    for (let i = 1; i <= months; i++) {
      const interest = remainingBalance * monthlyRate;
      const total = fixedPrincipal + interest;
      remainingBalance -= fixedPrincipal;
      
      totalInterest += interest;
      schedule.push({
        month: i,
        principalPayment: fixedPrincipal,
        interestPayment: interest,
        totalPayment: total,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
  } else {
    // Fixed Annuity Payment Formula: P = [L * i * (1 + i)^n] / [(1 + i)^n - 1]
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    for (let i = 1; i <= months; i++) {
      const interest = remainingBalance * monthlyRate;
      const principal = monthlyPayment - interest;
      remainingBalance -= principal;
      
      totalInterest += interest;
      schedule.push({
        month: i,
        principalPayment: principal,
        interestPayment: interest,
        totalPayment: monthlyPayment,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
  }

  return {
    firstMonthPayment: schedule[0]?.totalPayment || 0,
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(amount + totalInterest),
    schedule
  };
};

export const formatVND = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(Math.round(value));
};
