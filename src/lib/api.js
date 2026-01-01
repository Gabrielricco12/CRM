const API_BASE = import.meta.env.VITE_API_BASE;

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${txt}`);
  }
  return res.json().catch(() => ({}));
}

export const api = {
  takeover: (wa_id) => post("/takeover", { wa_id }),
  release: (wa_id) => post("/release", { wa_id }),
  sendHuman: (wa_id, text) => post("/meta/send", { wa_id, text }),
};
