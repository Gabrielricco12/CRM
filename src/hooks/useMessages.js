import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastConvRef = useRef(null);

  async function load(cid) {
    if (!cid) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", cid)
      .order("created_at", { ascending: true })
      .limit(500);

    if (!error) setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!conversationId) return;
    if (lastConvRef.current !== conversationId) {
      lastConvRef.current = conversationId;
      load(conversationId);
    }

    const channel = supabase
      .channel(`rt-messages-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        () => load(conversationId)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return { messages, loading, reload: () => load(conversationId) };
}
