import { useEffect, useState } from "react";
import { useChat } from "@/lib/context";
import { MessageCircle, X, ArrowLeft, Paperclip, Smile, Send, Search, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ChatWidget() {
  const { conversations, activeId, setActiveId, isOpen, toggle, close, sendMessage, unreadCount, markRead } = useChat();
  const [q, setQ] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [close]);

  const active = conversations.find((c) => c.id === activeId);
  const filtered = conversations.filter((c) => c.contactName.toLowerCase().includes(q.toLowerCase()));

  const handleSend = () => {
    if (!text.trim() || !activeId) return;
    sendMessage(activeId, text.trim());
    setText("");
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:scale-105 transition-transform flex items-center justify-center animate-pulse-blue"
        aria-label="Messages"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop click-outside */}
      {isOpen && <div className="fixed inset-0 z-[9998]" onClick={close} />}

      {/* Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9999] w-[340px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="h-14 bg-primary text-primary-foreground px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {active && (
                <button onClick={() => setActiveId(null)} className="p-1 rounded-lg hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{active?.contactName ?? "Messages"}</span>
              {active && <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-success">en ligne</span>}
            </div>
            <div className="flex items-center gap-1">
              {!active && <button className="p-1.5 rounded-lg hover:bg-white/10"><PencilLine className="w-4 h-4" /></button>}
              <button className="p-1.5 rounded-lg hover:bg-white/10" onClick={close}><X className="w-4 h-4" /></button>
            </div>
          </header>

          {!active ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Rechercher..." value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10 text-muted-foreground">
                    <MessageCircle className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-sm font-medium text-foreground">Aucune conversation</p>
                    <p className="text-xs mt-1">
                      {q ? "Aucun résultat pour votre recherche." : "Vos messages avec les autres utilisateurs apparaîtront ici."}
                    </p>
                  </div>
                ) : (
                  filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setActiveId(c.id); markRead(c.id); }}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-accent/50 border-b last:border-0 text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-semibold shrink-0"
                      style={{ backgroundColor: c.avatarColor }}
                    >
                      {c.contactName.split(" ").map(s => s[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm truncate">{c.contactName}</span>
                        <span className="text-[11px] text-muted-foreground shrink-0">{c.lastAt}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground truncate">{c.lastMessage}</span>
                        {c.unread > 0 && <span className="w-2 h-2 rounded-full bg-primary-light shrink-0" />}
                      </div>
                    </div>
                  </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-background">
                {active.messages.map((m, i) => {
                  const prev = active.messages[i - 1];
                  const showDate = !prev || prev.at.split(" ")[0] !== m.at.split(" ")[0];
                  return (
                    <div key={m.id}>
                      {showDate && (
                        <div className="text-center text-[11px] text-muted-foreground my-2">{m.at.startsWith("Aujourd'hui") ? "Aujourd'hui" : m.at.startsWith("Hier") ? "Hier" : m.at.split(" ")[0]}</div>
                      )}
                      <div className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.mine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-accent text-foreground rounded-bl-md"}`}>
                          {m.text}
                          <div className={`text-[10px] mt-1 ${m.mine ? "text-white/70" : "text-muted-foreground"}`}>{m.at.split(" ").slice(-1)[0]}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t p-2 flex items-center gap-1.5 bg-white shrink-0">
                <button className="p-2 rounded-lg hover:bg-accent"><Paperclip className="w-4 h-4 text-muted-foreground" /></button>
                <Input
                  className="flex-1"
                  placeholder="Écrire un message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                />
                <button className="p-2 rounded-lg hover:bg-accent"><Smile className="w-4 h-4 text-muted-foreground" /></button>
                <button onClick={handleSend} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
