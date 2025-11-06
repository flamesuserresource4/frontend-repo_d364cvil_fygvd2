import { useEffect, useRef, useState } from "react";
import { Send, Image as ImageIcon, Film, Bot, User } from "lucide-react";

export default function AIChat({ onUpload }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ciao! Inviami istruzioni o carica media per modificare il tuo video." },
  ]);
  const [input, setInput] = useState("");
  const fileRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const mockAssistant = async (text) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(`Ho capito: ${text}. Applicherò le modifiche richieste.`), 500)
    );
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const reply = await mockAssistant(userMsg.content);
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  };

  const handleFiles = (files) => {
    onUpload?.(files);
    setMessages((m) => [
      ...m,
      { role: "user", content: `Caricati ${files.length} file multimediali per ulteriori modifiche.` },
    ]);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Bot /> Chat AI per modifiche finali
      </div>
      <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
            }`}> 
              <div className="flex items-center gap-2 mb-1 opacity-80 text-xs">
                {m.role === "user" ? <User size={14}/> : <Bot size={14}/>} {m.role}
              </div>
              <div>{m.content}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Descrivi le modifiche (tagli, musica, sottotitoli, ecc.)"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">
          <ImageIcon size={18}/> / <Film size={18}/>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*,image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="hidden"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Send size={18}/> Invia
        </button>
      </form>
    </div>
  );
}
