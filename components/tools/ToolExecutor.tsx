'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play, RotateCcw, ListChecks } from 'lucide-react';
import { Tool, ToolResult, validateInputs } from '@/lib/tools';
import { ToolInput } from './ToolInput';
import { ToolResultDisplay } from './ToolResultDisplay';
import { Button } from '@/components/ui/Button';

interface ToolExecutorProps {
  tool: Tool;
}

type ExecuteToolResponse = {
  success: boolean;
  result?: ToolResult;
  error?: string;
  message?: string;
};

export function ToolExecutor({ tool }: ToolExecutorProps) {
  const [inputs, setInputs] = useState<Record<string, string | number>>(() => {
    // Initialize with default values
    const initial: Record<string, string | number> = {};
    tool.inputs.forEach(input => {
      if (input.defaultValue !== undefined) {
        initial[input.id] = input.defaultValue;
      }
    });
    return initial;
  });

  const [result, setResult] = useState<ToolResult | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleInputChange = useCallback((inputId: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [inputId]: value }));
    // Clear error for this field
    setErrors(prev => {
      const next = { ...prev };
      delete next[inputId];
      return next;
    });
  }, []);

  const handleCalculate = useCallback(async () => {
    // Validate required inputs
    const requiredFields = tool.inputs.filter(i => i.required).map(i => i.id);
    const validation = validateInputs(inputs, requiredFields);

    if (!validation.valid) {
      const newErrors: Record<string, string> = {};
      validation.missing.forEach(field => {
        newErrors[field] = 'This field is required';
      });
      setErrors(newErrors);
      return;
    }

    setIsCalculating(true);
    setErrors({});

    try {
      const response = await fetch(`/api/tools/${tool.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      });

      const data = (await response.json()) as ExecuteToolResponse & { sessionId?: string };
      if (!response.ok || !data.success || !data.result) {
        throw new Error(data.error || data.message || 'Tool execution failed');
      }

      setResult(data.result);
      if (data.sessionId) setSessionId(data.sessionId);
    } catch (error) {
      console.error('Tool execution error:', error);
      setErrors({ _general: 'An error occurred while calculating. Please check your inputs.' });
    } finally {
      setIsCalculating(false);
    }
  }, [tool, inputs]);

  const handleEnhance = useCallback(async () => {
    if (!result) return;
    
    // Find the primary text output (longest text field)
    const textOutputs = result.outputs.filter(o => o.format === 'text' && String(o.value).length > 50);
    const targetOutput = textOutputs.sort((a, b) => String(b.value).length - String(a.value).length)[0];

    if (!targetOutput) return;

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: targetOutput.value,
          context: `Enhance this ${tool.name} output (${targetOutput.label}) to be more professional, clear, and impactful.`
        }),
      });

      const data = await response.json();
      if (data.success && data.enhanced) {
        const newResult = {
          ...result,
          outputs: result.outputs.map(o => 
            o.id === targetOutput.id ? { ...o, value: data.enhanced, description: 'Enhanced by AI' } : o
          ),
          decisionTrail: [...result.decisionTrail, 'Enhanced output with AI']
        };
        
        setResult(newResult);

        // Persist enhancement if session exists
        if (sessionId) {
          await fetch(`/api/dashboard/tool-sessions/${sessionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: newResult, is_enhanced: true }),
          });
        }
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  }, [result, tool.name, sessionId]);

  const handleReset = useCallback(() => {
    const initial: Record<string, string | number> = {};
    tool.inputs.forEach(input => {
      if (input.defaultValue !== undefined) {
        initial[input.id] = input.defaultValue;
      }
    });
    setInputs(initial);
    setResult(null);
    setSessionId(null);
    setErrors({});
  }, [tool]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            Inputs
          </h3>

          <div className="space-y-5">
            {tool.inputs.map(input => (
              <ToolInput
                key={input.id}
                input={input}
                value={inputs[input.id] ?? ''}
                onChange={(value) => handleInputChange(input.id, value)}
                error={errors[input.id]}
              />
            ))}
          </div>

          {errors._general && (
            <p className="mt-4 text-sm text-red-400" role="alert" aria-live="polite">{errors._general}</p>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex-1"
            >
              {isCalculating ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  />
                  Calculating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" aria-hidden="true" />
                  Calculate
                </>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset} aria-label="Reset to default values">
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20">
          <h4 className="font-semibold text-white mb-2">Want this automated?</h4>
          <p className="text-sm text-slate-400 mb-4">
            BrainStack Studio Pro can run this analysis continuously on your real data, with alerts and integrations.
          </p>
          <Button asChild variant="primary" size="sm" className="w-full">
            <Link href="/contact">Talk to Our Team</Link>
          </Button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ToolResultDisplay 
                tool={tool} 
                result={result} 
                inputs={inputs} 
                onEnhance={handleEnhance}
                isEnhancing={isEnhancing}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-96 flex flex-col items-center justify-center text-center p-8 rounded-xl bg-slate-900/30 border border-dashed border-slate-700"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4" aria-hidden="true">
                <Play className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-lg font-medium text-slate-400 mb-2">
                Enter your values and click Calculate
              </h4>
              <p className="text-sm text-slate-500 max-w-sm">
                Results will appear here with confidence scoring, visual projections, and actionable recommendations.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ToolExecutor;
