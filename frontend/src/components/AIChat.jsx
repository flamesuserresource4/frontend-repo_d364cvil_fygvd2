import React, { useEffect, useRef, useState } from 'react';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ciao! Carica un video e ti aiuto a trovare i momenti migliori.' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', content: 'Ricevuto! Sto preparando i suggerimenti…' }]);
    }, 600);
  };

  return (
    <div className="flex h-80 flex-col rounded-xl border border-white/10 bg-white/5">
      <div ref={listRef} className="flex-1 space-y-3 overflow-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === 'assistant' ? 'bg-white/10' : 'ml-auto bg-indigo-500 text-white'}`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-white/10 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Chiedi modifiche o suggerimenti…"
          className="flex-1 rounded-md bg-black/30 px-3 py-2 outline-none ring-0 focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={send} className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400">
          Invia
        </button>
      </div>
    </div>
  );
}
