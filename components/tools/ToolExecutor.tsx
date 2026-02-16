'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Share2, Download, Lightbulb, ListChecks, GitBranch } from 'lucide-react';
import { Tool, ToolResult, executeTool, validateInputs } from '@/lib/tools';
import { ToolInput } from './ToolInput';
import { ToolOutputGrid } from './ToolOutput';
import { ToolChart } from './ToolChart';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Button } from '@/components/ui/Button';

interface ToolExecutorProps {
  tool: Tool;
}

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

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

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const toolResult = executeTool(tool.id, inputs);
      setResult(toolResult);
    } catch (error) {
      console.error('Tool execution error:', error);
      setErrors({ _general: 'An error occurred while calculating. Please check your inputs.' });
    } finally {
      setIsCalculating(false);
    }
  }, [tool, inputs]);

  const handleReset = useCallback(() => {
    const initial: Record<string, string | number> = {};
    tool.inputs.forEach(input => {
      if (input.defaultValue !== undefined) {
        initial[input.id] = input.defaultValue;
      }
    });
    setInputs(initial);
    setResult(null);
    setErrors({});
  }, [tool]);

  const handleShare = useCallback(() => {
    // Create shareable URL with encoded inputs
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) {
        params.set(key, String(value));
      }
    });
    const url = `${window.location.origin}/tools/${tool.slug}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    // Could add toast notification here
  }, [tool.slug, inputs]);

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
          <Button variant="primary" size="sm" className="w-full">
            Talk to Our Team
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
              className="space-y-6"
            >
              {/* Confidence & Actions */}
              <div className="flex items-center justify-between">
                <ConfidenceBadge
                  confidence={result.confidence}
                  level={result.confidenceLevel}
                />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleShare} aria-label="Share results link">
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" size="sm" aria-label="Download results">
                    <Download className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700" role="status" aria-live="polite">
                <p className="text-slate-300">{result.summary}</p>
              </div>

              {/* Outputs Grid */}
              <ToolOutputGrid outputs={result.outputs} />

              {/* Chart */}
              {result.chart && (
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h4 className="text-sm font-medium text-slate-400 mb-4">Projection</h4>
                  <ToolChart data={result.chart} height={220} />
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-cyan-400">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Decision Trail */}
              {result.decisionTrail.length > 0 && (
                <details className="group">
                  <summary className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer hover:text-slate-400">
                    <GitBranch className="w-4 h-4" aria-hidden="true" />
                    Decision Trail
                    <span className="text-xs opacity-50">(click to expand)</span>
                  </summary>
                  <div className="mt-3 p-4 rounded-lg bg-slate-900/30 border border-slate-800">
                    <ol className="space-y-1.5 text-xs text-slate-500">
                      {result.decisionTrail.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-slate-600 font-mono">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              )}
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
