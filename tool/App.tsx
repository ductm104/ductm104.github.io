
import React, { useState, useMemo } from 'react';
import { CalcMethod, LoanState } from './types';
import { calculateLoan, formatVND } from './utils/calculations';
import { LOAN_LIMITS } from './constants';
import SliderSection from './components/SliderSection';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [loan, setLoan] = useState<LoanState>({
    amount: 1000000000,
    interestRate: 11,
    months: 180,
    method: CalcMethod.REDUCING_BALANCE
  });

  const [showAllSchedule, setShowAllSchedule] = useState(false);

  const results = useMemo(() => calculateLoan(loan), [loan]);

  const handleAmountChange = (val: number) => setLoan(prev => ({ ...prev, amount: val }));
  const handleRateChange = (val: number) => setLoan(prev => ({ ...prev, interestRate: val }));
  const handleMonthsChange = (val: number) => setLoan(prev => ({ ...prev, months: val }));

  // Prepare chart data (limit to first 12-24 months for visual clarity)
  const chartData = results.schedule.slice(0, 18).map(item => ({
    name: `T${item.month}`,
    'Gốc': Math.round(item.principalPayment / 1000000),
    'Lãi': Math.round(item.interestPayment / 1000000),
  }));

  const visibleSchedule = showAllSchedule ? results.schedule : results.schedule.slice(0, 12);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
        
        {/* Left Side: Inputs */}
        <div className="flex-1 p-6 md:p-12">
          <header className="mb-8 md:mb-12">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 border-l-4 border-amber-600 pl-4">Công cụ tính khoản vay</h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 ml-4">Ước tính lịch trả nợ của bạn một cách chính xác</p>
          </header>
          
          <SliderSection 
            number={1}
            label="Số tiền vay"
            value={loan.amount}
            min={LOAN_LIMITS.amount.min}
            max={LOAN_LIMITS.amount.max}
            unit="VND"
            step={LOAN_LIMITS.amount.step}
            onChange={handleAmountChange}
            isCurrency={true}
          />

          <SliderSection 
            number={2}
            label="Lãi suất"
            value={loan.interestRate}
            min={LOAN_LIMITS.interest.min}
            max={LOAN_LIMITS.interest.max}
            unit="%"
            step={LOAN_LIMITS.interest.step}
            onChange={handleRateChange}
          />

          <SliderSection 
            number={3}
            label="Thời hạn"
            value={loan.months}
            min={LOAN_LIMITS.months.min}
            max={LOAN_LIMITS.months.max}
            unit="tháng"
            onChange={handleMonthsChange}
          />

          {/* Calculation Method Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-sm bg-slate-800 text-white flex items-center justify-center font-bold text-xs md:text-sm">
                4
              </div>
              <span className="text-slate-600 font-medium text-sm md:text-base">Phương pháp trả nợ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <button 
                onClick={() => setLoan(p => ({ ...p, method: CalcMethod.REDUCING_BALANCE }))}
                className={`p-4 text-xs md:text-sm rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  loan.method === CalcMethod.REDUCING_BALANCE 
                  ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' 
                  : 'border-gray-100 hover:border-gray-200 text-slate-500 font-medium'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${loan.method === CalcMethod.REDUCING_BALANCE ? 'border-amber-600' : 'border-gray-300'}`}>
                  {loan.method === CalcMethod.REDUCING_BALANCE && <div className="w-2 h-2 rounded-full bg-amber-600" />}
                </div>
                Dư nợ giảm dần
              </button>

              <button 
                onClick={() => setLoan(p => ({ ...p, method: CalcMethod.FIXED_ANNUITY }))}
                className={`p-4 text-xs md:text-sm rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  loan.method === CalcMethod.FIXED_ANNUITY 
                  ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' 
                  : 'border-gray-100 hover:border-gray-200 text-slate-500 font-medium'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${loan.method === CalcMethod.FIXED_ANNUITY ? 'border-amber-600' : 'border-gray-300'}`}>
                  {loan.method === CalcMethod.FIXED_ANNUITY && <div className="w-2 h-2 rounded-full bg-amber-600" />}
                </div>
                Trả góp đều hàng tháng
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="w-full lg:w-[400px] bg-slate-50 lg:bg-white p-6 md:p-12 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100">
          <div className="lg:hidden mb-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tóm tắt kết quả</h2>
          </div>
          
          <div className="space-y-8 md:space-y-12">
            <div className="bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl shadow-sm lg:shadow-none">
              <p className="text-slate-500 text-xs md:text-sm font-medium mb-1 uppercase tracking-tight">Trả tháng đầu</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600">
                {formatVND(results.firstMonthPayment)} <span className="text-xs md:text-sm font-medium text-amber-500">VND</span>
              </p>
            </div>

            <div className="bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl shadow-sm lg:shadow-none">
              <p className="text-slate-500 text-xs md:text-sm font-medium mb-1 uppercase tracking-tight">Tổng lãi phải trả</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600">
                {formatVND(results.totalInterest)} <span className="text-xs md:text-sm font-medium text-amber-500">VND</span>
              </p>
            </div>

            <div className="bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl shadow-sm lg:shadow-none">
              <p className="text-slate-500 text-xs md:text-sm font-medium mb-1 uppercase tracking-tight">Tổng gốc và lãi</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600">
                {formatVND(results.totalPayment)} <span className="text-xs md:text-sm font-medium text-amber-500">VND</span>
              </p>
            </div>
          </div>

          <div className="mt-10 lg:mt-auto pt-8 border-t border-gray-200">
            <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Phân bổ thanh toán (Tr VND)</h3>
            <div className="h-40 md:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis fontSize={9} axisLine={false} tickLine={false} />
                  <Bar dataKey="Gốc" stackId="a" fill="#1e293b" />
                  <Bar dataKey="Lãi" stackId="a" fill="#d97706" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 justify-center">
               <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">Gốc</span>
               </div>
               <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">Lãi</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Schedule Table */}
      <div className="mt-6 md:mt-10 bg-white rounded-2xl shadow-lg p-5 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base md:text-lg font-bold text-slate-800">Lịch thanh toán chi tiết</h2>
          <div className="hidden md:block text-[10px] text-slate-400 uppercase font-bold tracking-widest">Bản xem đầy đủ</div>
        </div>
        
        <div className="overflow-x-auto -mx-5 md:mx-0">
          <div className="inline-block min-w-full align-middle px-5 md:px-0">
            <table className="min-w-full text-left text-xs md:text-sm border-separate border-spacing-0">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 md:py-4 font-bold text-slate-400 uppercase tracking-tighter text-[10px] md:text-xs border-b border-gray-100">Tháng</th>
                  <th className="py-3 md:py-4 font-bold text-slate-400 uppercase tracking-tighter text-[10px] md:text-xs border-b border-gray-100">Gốc</th>
                  <th className="py-3 md:py-4 font-bold text-slate-400 uppercase tracking-tighter text-[10px] md:text-xs border-b border-gray-100">Lãi</th>
                  <th className="py-3 md:py-4 font-bold text-slate-400 uppercase tracking-tighter text-[10px] md:text-xs border-b border-gray-100">Tổng</th>
                  <th className="py-3 md:py-4 font-bold text-slate-400 uppercase tracking-tighter text-[10px] md:text-xs border-b border-gray-100 hidden sm:table-cell">Dư nợ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visibleSchedule.map((item) => {
                  return (
                    <tr key={item.month} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 md:py-4 font-bold text-slate-700">{item.month}</td>
                      <td className="py-3 md:py-4 text-slate-600">{formatVND(item.principalPayment)}</td>
                      <td className="py-3 md:py-4 text-amber-600 font-medium">{formatVND(item.interestPayment)}</td>
                      <td className="py-3 md:py-4 text-slate-900 font-bold">{formatVND(item.totalPayment)}</td>
                      <td className="py-3 md:py-4 text-slate-400 italic hidden sm:table-cell">{formatVND(item.remainingBalance)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {results.schedule.length > 12 && (
          <button
            onClick={() => setShowAllSchedule(!showAllSchedule)}
            className="w-full mt-6 py-4 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 text-slate-500 font-bold rounded-xl transition-all border border-slate-100 flex items-center justify-center gap-2 group text-xs md:text-sm"
          >
            {showAllSchedule ? (
              <>
                Thu gọn 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            ) : (
              <>
                Xem thêm {results.schedule.length - 12} tháng còn lại
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      <footer className="mt-10 mb-6 text-center text-slate-400 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">
        Vietnam Loan Calculator &copy; 2024
      </footer>
    </div>
  );
};

export default App;
