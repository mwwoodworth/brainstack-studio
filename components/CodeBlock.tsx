'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

// Simple syntax highlighting keywords
const LANGUAGE_KEYWORDS: Record<string, { keywords: string[]; color: string }> = {
  javascript: { keywords: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'async', 'await', 'class', 'new', 'this', 'try', 'catch', 'throw'], color: 'text-purple-400' },
  typescript: { keywords: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'async', 'await', 'class', 'new', 'this', 'try', 'catch', 'throw', 'type', 'interface', 'enum', 'extends', 'implements'], color: 'text-purple-400' },
  python: { keywords: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'raise', 'with', 'async', 'await', 'lambda', 'yield', 'True', 'False', 'None'], color: 'text-purple-400' },
  rust: { keywords: ['fn', 'let', 'mut', 'const', 'if', 'else', 'for', 'while', 'loop', 'match', 'impl', 'struct', 'enum', 'trait', 'pub', 'use', 'mod', 'return', 'async', 'await', 'move'], color: 'text-purple-400' },
  go: { keywords: ['func', 'var', 'const', 'if', 'else', 'for', 'range', 'switch', 'case', 'return', 'package', 'import', 'type', 'struct', 'interface', 'chan', 'go', 'defer', 'select'], color: 'text-purple-400' },
  bash: { keywords: ['if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'case', 'esac', 'function', 'return', 'export', 'echo', 'cd', 'ls', 'cat', 'grep', 'sed', 'awk'], color: 'text-purple-400' },
};

function highlightCode(code: string, language: string): string {
  const langConfig = LANGUAGE_KEYWORDS[language.toLowerCase()];
  if (!langConfig) return code;

  let highlighted = code;

  // Highlight strings
  highlighted = highlighted.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-emerald-400">$&</span>');

  // Highlight comments
  highlighted = highlighted.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm, '<span class="text-slate-500">$&</span>');

  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-400">$1</span>');

  // Highlight keywords
  langConfig.keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="${langConfig.color}">$1</span>`);
  });

  return highlighted;
}

export function CodeBlock({ code, language = 'plaintext', showLineNumbers = true, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only highlighting on client
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.split('\n');
  // Only apply highlighting after hydration to prevent mismatch
  const highlightedCode = isClient ? highlightCode(code, language) : code;

  return (
    <div className={cn('group relative rounded-xl overflow-hidden bg-slate-900/80 border border-white/10', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400 hover:text-white rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          {showLineNumbers ? (
            <code className="flex">
              <span className="select-none pr-4 text-slate-600 text-right" style={{ minWidth: '2.5rem' }}>
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </span>
              <span
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </code>
          ) : (
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          )}
        </pre>
      </div>
    </div>
  );
}
