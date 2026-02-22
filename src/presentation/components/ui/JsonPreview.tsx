import { useState } from 'react';
import { GlassPanel } from './GlassPanel.tsx';
import { Copy, Check } from 'lucide-react';

interface JsonPreviewProps {
  data: unknown;
  title?: string;
  maxHeight?: string;
}

export function JsonPreview({ data, title, maxHeight = '400px' }: JsonPreviewProps) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassPanel padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-medium text-gray-400">{title ?? 'Configuration'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="overflow-auto p-4 text-xs font-mono text-gray-300 leading-relaxed"
        style={{ maxHeight }}
      >
        {json}
      </pre>
    </GlassPanel>
  );
}
