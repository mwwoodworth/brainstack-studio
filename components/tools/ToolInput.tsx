'use client';

import { ToolInput as ToolInputType } from '@/lib/tools';
import { Info } from 'lucide-react';

interface ToolInputProps {
  input: ToolInputType;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
}

export function ToolInput({ input, value, onChange, error }: ToolInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (input.type === 'number' || input.type === 'currency' || input.type === 'percentage' || input.type === 'range') {
      onChange(newValue === '' ? '' : parseFloat(newValue) || 0);
    } else {
      onChange(newValue);
    }
  };

  const baseInputClasses = `
    w-full px-4 py-3 rounded-lg
    bg-slate-800/50 border border-slate-700
    text-white placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
  `;

  const renderInput = () => {
    if (input.type === 'select' && input.options) {
      return (
        <select
          value={value as string}
          onChange={handleChange}
          className={baseInputClasses}
        >
          <option value="">Select {input.label}</option>
          {input.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (input.type === 'range') {
      return (
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={input.min || 0}
            max={input.max || 100}
            step={input.step || 1}
            value={value as number}
            onChange={handleChange}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-white font-medium w-16 text-right">
            {value}{input.suffix || ''}
          </span>
        </div>
      );
    }

    const inputType = input.type === 'currency' || input.type === 'percentage' ? 'number' : input.type;

    return (
      <div className="relative">
        {input.prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {input.prefix}
          </span>
        )}
        <input
          type={inputType}
          value={value === '' ? '' : value}
          onChange={handleChange}
          placeholder={input.placeholder}
          min={input.min}
          max={input.max}
          step={input.step || (input.type === 'currency' ? 0.01 : 1)}
          required={input.required}
          className={`
            ${baseInputClasses}
            ${input.prefix ? 'pl-8' : ''}
            ${input.suffix ? 'pr-16' : ''}
          `}
        />
        {input.suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {input.suffix}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300">
          {input.label}
          {input.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {input.helpText && (
          <div className="group relative">
            <Info className="w-4 h-4 text-slate-500 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 w-64 p-2 text-xs text-slate-300 bg-slate-800 rounded-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {input.helpText}
            </div>
          </div>
        )}
      </div>
      {renderInput()}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

export default ToolInput;
