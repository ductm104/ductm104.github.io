
export const COLORS = {
  primary: '#1e293b', // slate-800
  accent: '#d97706',  // amber-600 (gold)
  accentLight: '#fbbf24', // amber-400
  textMuted: '#64748b', // slate-500
};

export const LOAN_LIMITS = {
  amount: { min: 1000000, max: 2000000000, step: 1000000 },
  interest: { min: 1, max: 25, step: 0.1 },
  months: { min: 1, max: 360, step: 1 }
};
