import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "history") {
        setMessages(msg.data.map(m => m.data));
      }

      if (msg.type === "message") {
        setMessages(prev => [...prev, msg.data]);
      }
    };

    return () => ws.current?.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    ws.current.send(JSON.stringify({ type: "message", data: input }));
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg w-fit max-w-xs">
            {msg}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
          placeholder="Введите сообщение"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
