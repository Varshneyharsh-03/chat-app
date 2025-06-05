import { useState, useEffect, useRef } from "react";

function App() {
  const [messages, setMessages] = useState<string[]>(["hi there", "hello"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://localhost:9090"); // Use wss for secure connection
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send(JSON.stringify({ type: "join", room: "red" }));
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    const message = inputRef.current?.value.trim();
    if (
      !message ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    )
      return;

    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        room: "red",
        message,
      })
    );
    inputRef.current.value = "";
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className="text-white rounded-lg p-4 border border-white bg-gray-800"
          >
            {message}
          </div>
        ))}
      </div>
      <form
        className="flex items-center gap-2 bg-gray-900 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          ref={inputRef}
          className="flex-1 rounded px-3 py-2 bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
