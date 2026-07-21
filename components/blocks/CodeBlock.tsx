// Affiche un extrait de code en lecture seule (pas d'éditeur intégré) :
// un en-tête avec le nom de fichier et le langage, le code ligne par
// ligne (pour pouvoir mettre certaines lignes en avant via "focusLines"),
// et une explication en dessous.

type CodeBlockProps = {
  filename: string;
  language: string;
  code: string;
  explanation: string;
  focusLines?: number[];
};

export default function CodeBlock({
  filename,
  language,
  code,
  explanation,
  focusLines,
}: CodeBlockProps) {
  const lines = code.split("\n");
  const focused = new Set(focusLines ?? []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-xs text-foreground/70">{filename}</span>
        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-foreground/40">
          {language}
        </span>
      </div>

      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed">
        <code className="font-mono">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            return (
              <div
                key={index}
                className={
                  "px-2 -mx-2 rounded " +
                  (focused.has(lineNumber)
                    ? "bg-accent/10 text-foreground"
                    : "text-foreground/70")
                }
              >
                <span className="mr-4 inline-block w-4 select-none text-right text-foreground/25">
                  {lineNumber}
                </span>
                {line || " "}
              </div>
            );
          })}
        </code>
      </pre>

      <p className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-foreground/70">
        {explanation}
      </p>
    </div>
  );
}
