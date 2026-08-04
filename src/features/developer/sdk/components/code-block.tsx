import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";
import { cn } from "@/shared/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const { copy, copied } = useCopyToClipboard();
  const lines = code.replace(/^\n/, "").replace(/\n$/, "").split("\n");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-[#0D0F1A]",
        className,
      )}
    >
      {language && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs font-medium text-white/50">{language}</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => copy(code)}
        aria-label="Copy code"
        className={cn(
          "absolute right-3 rounded-md p-1.5 text-white/50 opacity-0 transition-opacity hover:bg-white/10 hover:text-white group-hover:opacity-100",
          language ? "top-2" : "top-3",
        )}
      >
        {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
      </button>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-white/90">
          {lines.map((line, index) => (
            <div key={index} className="table-row">
              <span className="table-cell pr-4 text-right text-white/25 select-none">
                {index + 1}
              </span>
              <span className="table-cell whitespace-pre">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}