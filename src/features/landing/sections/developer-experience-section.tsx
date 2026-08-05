import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";
import { DEVELOPER_CHECKLIST } from "@/features/landing/constants/content";

type Lang = "TypeScript" | "JavaScript" | "React";

const SNIPPETS: Record<Lang, { code: string; lines: string[] }> = {
  TypeScript: {
    code: `import { Aegis } from "@aegis/sdk";

const aegis = new Aegis({
  clientId,
  baseUrl,
});

const { data } = await aegis.auth.login({
  email: "amir@example.com",
  password: "********",
});

console.log(data.user);`,
    lines: [],
  },
  JavaScript: {
    code: `const { Aegis } = require("@aegis/sdk");

const aegis = new Aegis({
  clientId,
  baseUrl,
});

aegis.auth.login({
  email: "amir@example.com",
  password: "********",
}).then(({ data }) => {
  console.log(data.user);
});`,
    lines: [],
  },
  React: {
    code: `import { useAegis } from "@aegis/sdk/react";

function LoginForm() {
  const { login, isLoading } = useAegis();

  return (
    <button onClick={() => login({ email, password })}>
      {isLoading ? "Signing in..." : "Sign in"}
    </button>
  );
}`,
    lines: [],
  },
};

const KEYWORDS = new Set([
  "import", "from", "const", "await", "function", "return", "require",
]);

function highlight(code: string) {
  return code.split("\n").map((line, i) => {
    const tokens = line.split(/(\s+|[(){};,])/);
    return (
      <div key={i}>
        {tokens.map((token, j) => {
          if (KEYWORDS.has(token)) {
            return (
              <span key={j} className="text-[#c792ea]">
                {token}
              </span>
            );
          }
          if (/^["'].*["']$/.test(token)) {
            return (
              <span key={j} className="text-[#c3e88d]">
                {token}
              </span>
            );
          }
          if (/^\/\/.*/.test(token)) {
            return (
              <span key={j} className="text-white/40">
                {token}
              </span>
            );
          }
          return <span key={j}>{token}</span>;
        })}
      </div>
    );
  });
}

export function DeveloperExperienceSection() {
  const [lang, setLang] = useState<Lang>("TypeScript");
  const { copy, copied } = useCopyToClipboard();

  return (
    <section id="developer-experience" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-3">
            <div className="flex">
              {(Object.keys(SNIPPETS) as Lang[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLang(item)}
                  className={
                    "border-b-2 px-3 py-2.5 text-xs font-medium transition-colors " +
                    (lang === item
                      ? "border-primary text-white"
                      : "border-transparent text-white/50 hover:text-white/80")
                  }
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => copy(SNIPPETS[lang].code)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-white/90">
            <code>{highlight(SNIPPETS[lang].code)}</code>
          </pre>
        </div>

        <div>
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Developer Experience
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Developer Experience First
          </h2>
          <p className="mt-3 text-muted-foreground">
            Aegis is built to make your life easier with intuitive APIs,
            powerful SDKs, and excellent developer tools.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {DEVELOPER_CHECKLIST.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-3" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}