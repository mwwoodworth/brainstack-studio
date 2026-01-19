'use client';

import { parseCodeBlocks } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

interface MessageContentProps {
  content: string;
  isStreaming?: boolean;
}

export function MessageContent({ content, isStreaming }: MessageContentProps) {
  const parts = parseCodeBlocks(content);

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock
              key={index}
              code={part.content}
              language={part.language}
              className="my-4"
            />
          );
        }

        // Render text with basic markdown
        return (
          <div key={index} className="whitespace-pre-wrap">
            {renderMarkdown(part.content)}
          </div>
        );
      })}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5" />
      )}
    </div>
  );
}

function renderMarkdown(text: string): React.ReactNode {
  // Split by lines to handle block-level elements
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType;
      elements.push(
        <ListTag key={elements.length} className={listType === 'ul' ? 'list-disc pl-5 my-2' : 'list-decimal pl-5 my-2'}>
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ListTag>
      );
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2">{renderInline(line.slice(4))}</h3>);
      return;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-semibold mt-4 mb-2">{renderInline(line.slice(3))}</h2>);
      return;
    }
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-2xl font-bold mt-4 mb-2">{renderInline(line.slice(2))}</h1>);
      return;
    }

    // Unordered list
    if (line.match(/^[-*]\s/)) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(line.slice(2));
      return;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(line.replace(/^\d+\.\s/, ''));
      return;
    }

    // Regular paragraph
    flushList();
    if (line.trim()) {
      elements.push(<p key={index} className="my-1">{renderInline(line)}</p>);
    } else if (index > 0 && index < lines.length - 1) {
      elements.push(<br key={index} />);
    }
  });

  flushList();
  return elements;
}

function renderInline(text: string): React.ReactNode {
  // Process inline elements: bold, italic, code, links
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Inline code
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300 text-xs font-mono">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Bold
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++} className="font-semibold">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Links
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(
        <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Regular text - take until next special character
    const nextSpecial = remaining.search(/[`*\[]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}
