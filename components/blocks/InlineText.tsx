// Affiche un texte en mettant en valeur les portions entourées de
// back-ticks (`comme ceci`) — c'est ainsi que le contenu écrit des
// commandes, des noms de fichiers ou des chemins (ex: `npm run dev`,
// `package.json`). Pas de Markdown complet ni d'éditeur de code : juste
// ce petit découpage, pour que ces éléments techniques se distinguent
// visuellement du texte normal, comme demandé pour le Module 3.

type InlineTextProps = {
  text: string;
};

export default function InlineText({ text }: InlineTextProps) {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <>
      {parts.map((part, index) => {
        const isCode = part.startsWith("`") && part.endsWith("`") && part.length > 1;
        if (!isCode) {
          return part;
        }
        return (
          <code
            key={index}
            className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-accent"
          >
            {part.slice(1, -1)}
          </code>
        );
      })}
    </>
  );
}
