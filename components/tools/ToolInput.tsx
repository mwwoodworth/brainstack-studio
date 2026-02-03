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

  const inputId = `tool-input-${input.id}`;
  const errorId = `tool-input-${input.id}-error`;
  const helpId = `tool-input-${input.id}-help`;

  const renderInput = () => {
    if (input.type === 'select' && input.options) {
      return (
        <select
          id={inputId}
          value={value as string}
          onChange={handleChange}
          className={baseInputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
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
            id={inputId}
            type="range"
            min={input.min || 0}
            max={input.max || 100}
            step={input.step || 1}
            value={value as number}
            onChange={handleChange}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            aria-valuenow={value as number}
            aria-valuemin={input.min || 0}
            aria-valuemax={input.max || 100}
          />
          <span className="text-white font-medium w-16 text-right" aria-hidden="true">
            {value}{input.suffix || ''}
          </span>
        </div>
      );
    }

    const inputType = input.type === 'currency' || input.type === 'percentage' ? 'number' : input.type;

    return (
      <div className="relative">
        {input.prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
            {input.prefix}
          </span>
        )}
        <input
          id={inputId}
          type={inputType}
          value={value === '' ? '' : value}
          onChange={handleChange}
          placeholder={input.placeholder}
          min={input.min}
          max={input.max}
          step={input.step || (input.type === 'currency' ? 0.01 : 1)}
          required={input.required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={`
            ${baseInputClasses}
            ${input.prefix ? 'pl-8' : ''}
            ${input.suffix ? 'pr-16' : ''}
          `}
        />
        {input.suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
            {input.suffix}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {input.label}
          {input.required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
          {input.required && <span className="sr-only">(required)</span>}
        </label>
        {input.helpText && (
          <div className="group relative">
            <button
              type="button"
              aria-label={`Help for ${input.label}`}
              aria-describedby={helpId}
              className="text-slate-500 hover:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
            >
              <Info className="w-4 h-4" aria-hidden="true" />
            </button>
            <div
              id={helpId}
              role="tooltip"
              className="absolute right-0 bottom-full mb-2 w-64 p-2 text-xs text-slate-300 bg-slate-800 rounded-lg border border-slate-700 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-10"
            >
              {input.helpText}
            </div>
          </div>
        )}
      </div>
      {renderInput()}
      {error && (
        <p id={errorId} className="text-xs text-red-400" role="alert">{error}</p>
      )}
    </div>
  );
}

export default ToolInput;
