import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Phone, UserCheck, Bot, Send, ArrowLeftRight } from "lucide-react";

import { useConversations } from "./hooks/useConversations";
import { useMessages } from "./hooks/useMessages";
import { ConversationItem } from "./components/ConversationItem";
import { MessageBubble } from "./components/MessageBubble";
import { api } from "./lib/api";

export default function App() {
  const { items: conversations, loading: loadingConvs } = useConversations();
  const [activeId, setActiveId] = useState(null);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  const { messages, loading: loadingMsgs } = useMessages(activeConv?.id);

  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE;

  async function handleSend() {
    if (!activeConv) return;
    const t = text.trim();
    if (!t) return;

    try {
      setBusy(true);
      await api.sendHuman(activeConv.wa_id, t);
      setText("");
    } catch (e) {
      alert(`Falha ao enviar: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleTakeover() {
    if (!activeConv) return;
    try {
      setBusy(true);
      await api.takeover(activeConv.wa_id);
    } catch (e) {
      alert(`Falha takeover: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleRelease() {
    if (!activeConv) return;
    try {
      setBusy(true);
      await api.release(activeConv.wa_id);
    } catch (e) {
      alert(`Falha release: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <div className="font-semibold text-zinc-900 leading-tight"> CRM</div>
              <div className="text-xs text-zinc-500">Life Aparelhos Auditivos • WhatsApp Inbox</div>
            </div>
          </div>

          <div className="text-xs text-zinc-500">
            
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4">
        {/* Inbox */}
        <section className="bg-white border border-zinc-200 rounded-3xl p-3">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="font-semibold text-zinc-900">Conversas</div>
            <div className="text-xs text-zinc-500">
              {loadingConvs ? "Carregando..." : `${conversations.length}`}
            </div>
          </div>

          <div className="space-y-2 mt-2 max-h-[74vh] overflow-auto pr-1">
            {conversations.map((c) => (
              <ConversationItem
                key={c.id}
                c={c}
                active={c.id === activeId}
                onClick={() => setActiveId(c.id)}
              />
            ))}
            {!loadingConvs && conversations.length === 0 && (
              <div className="text-sm text-zinc-500 p-4">
                Sem conversas ainda. Quando o webhook receber mensagens, elas aparecem aqui.
              </div>
            )}
          </div>
        </section>

        {/* Chat */}
        <section className="bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col min-h-[78vh]">
          {!activeConv ? (
            <div className="h-full flex items-center justify-center text-zinc-500 p-6">
              Selecione uma conversa à esquerda.
            </div>
          ) : (
            <>
              {/* Top bar */}
              <div className="border-b border-zinc-200 p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-900 truncate">
                    {activeConv.display_name || activeConv.wa_id}
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                    <Phone size={14} />
                    <span className="truncate">{activeConv.wa_id}</span>
                    <span className="mx-1">•</span>
                    <span className="font-medium text-zinc-700">{activeConv.status}</span>
                    <span className="mx-1">•</span>
                    <span>Score {activeConv.lead_score ?? 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={busy}
                    onClick={handleTakeover}
                    className="px-3 py-2 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-sm flex items-center gap-2 disabled:opacity-50"
                    title="Humano assume"
                  >
                    <UserCheck size={16} />
                    Assumir
                  </button>

                  <button
                    disabled={busy}
                    onClick={handleRelease}
                    className="px-3 py-2 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-sm flex items-center gap-2 disabled:opacity-50"
                    title="Bruna volta a responder"
                  >
                    <Bot size={16} />
                    Bruna
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 bg-zinc-50 p-4 overflow-auto">
                <div className="space-y-3">
                  {loadingMsgs && <div className="text-sm text-zinc-500">Carregando mensagens...</div>}
                  {messages.map((m) => (
                    <MessageBubble key={m.id} m={m} />
                  ))}
                </div>
              </div>

              {/* Composer */}
              <div className="border-t border-zinc-200 p-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={2}
                      placeholder={
                        activeConv.status === "human"
                          ? "Digite como humano (será enviado pelo WhatsApp)..."
                          : "Dica: clique em “Assumir” para enviar como humano."
                      }
                      className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                    <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
                      <ArrowLeftRight size={12} />
                      <span>
                        Para enviar mensagem humana, use <span className="font-medium">Assumir</span>.
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={busy || !text.trim() || activeConv.status !== "human"}
                    onClick={handleSend}
                    className="h-11 px-4 rounded-2xl bg-zinc-900 text-white text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={activeConv.status !== "human" ? "Assuma a conversa para enviar" : "Enviar"}
                  >
                    <Send size={16} />
                    Enviar
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
