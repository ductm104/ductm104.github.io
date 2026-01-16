
import React from 'react';
import { formatVND } from '../utils/calculations';

interface SliderSectionProps {
  number: number;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  step?: number;
  onChange: (val: number) => void;
  isCurrency?: boolean;
}

const SliderSection: React.FC<SliderSectionProps> = ({
  number,
  label,
  value,
  min,
  max,
  unit,
  step = 1,
  onChange,
  isCurrency = false
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-8 md:mb-10">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-sm bg-slate-800 text-white flex items-center justify-center font-bold text-xs md:text-sm">
          {number}
        </div>
        <div className="flex-1 flex items-baseline justify-between border-b border-dashed border-gray-300 pb-1 min-w-[200px]">
          <span className="text-slate-600 font-medium text-sm md:text-base">{label}</span>
          <div className="flex items-baseline gap-1.5">
             <input 
              type="text" 
              inputMode="numeric"
              value={isCurrency ? formatVND(value) : value}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                if (raw) onChange(Number(raw));
              }}
              className="text-xl md:text-2xl font-bold text-slate-800 text-right focus:outline-none bg-transparent w-32 md:w-40"
            />
            <span className="text-slate-400 font-medium uppercase text-[10px] md:text-sm">{unit}</span>
          </div>
        </div>
      </div>

      <div className="relative pt-2 px-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 w-full"
          style={{
            background: `linear-gradient(to right, #d97706 0%, #d97706 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
            height: '8px',
            borderRadius: '4px',
            WebkitAppearance: 'none'
          }}
        />
        <div className="flex justify-between mt-4 text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-tight">
          <span>{isCurrency ? formatVND(min) : min} {unit === 'VND' ? 'tr' : unit}</span>
          <span>{isCurrency ? formatVND(max) : max} {unit === 'VND' ? 'tr' : unit}</span>
        </div>
      </div>
    </div>
  );
};

export default SliderSection;
