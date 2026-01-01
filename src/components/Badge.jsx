export function Badge({ children, tone = "gray" }) {
  const map = {
    gray: "bg-zinc-100 text-zinc-700 border-zinc-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${map[tone] || map.gray}`}>
      {children}
    </span>
  );
}
