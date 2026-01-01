import { motion } from "framer-motion";

export function MessageBubble({ m }) {
  const isIn = m.direction === "in";
  const isHuman = m.sender === "human";
  const isBruna = m.sender === "bruna";

  let label = "Lead";
  if (isHuman) label = "Humano";
  if (isBruna) label = "Bruna";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full flex ${isIn ? "justify-start" : "justify-end"}`}
    >
      <div
        className={[
          "max-w-[78%] rounded-2xl px-3 py-2 shadow-sm border",
          isIn
            ? "bg-white border-zinc-200"
            : isHuman
              ? "bg-sky-50 border-sky-200"
              : "bg-emerald-50 border-emerald-200",
        ].join(" ")}
      >
        <div className="text-[11px] text-zinc-500 mb-1 flex items-center justify-between gap-3">
          <span>{label}</span>
          <span>{new Date(m.created_at).toLocaleString()}</span>
        </div>
        <div className="text-sm text-zinc-900 whitespace-pre-wrap">{m.text}</div>
      </div>
    </motion.div>
  );
}
