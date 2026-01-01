import { Badge } from "./Badge";

function statusBadge(status) {
  if (status === "human") return <Badge tone="blue">Humano</Badge>;
  if (status === "handoff_pending") return <Badge tone="yellow">Handoff</Badge>;
  if (status === "closed") return <Badge tone="gray">Fechada</Badge>;
  return <Badge tone="green">AI</Badge>;
}

export function ConversationItem({ c, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left p-3 rounded-2xl border transition",
        active ? "bg-zinc-50 border-zinc-300" : "bg-white border-zinc-200 hover:bg-zinc-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-zinc-900 truncate">
            {c.display_name || c.wa_id}
          </div>
          <div className="text-xs text-zinc-500 truncate mt-0.5">
            Última: {new Date(c.last_message_at).toLocaleString()}
          </div>
        </div>
        <div className="shrink-0">{statusBadge(c.status)}</div>
      </div>
      <div className="text-xs text-zinc-600 mt-2">
        Score: <span className="font-semibold">{c.lead_score ?? 0}</span>
      </div>
    </button>
  );
}
