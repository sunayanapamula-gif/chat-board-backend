import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";

function ChatBoard({ backendCall }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const cleanReply = (reply) => {
    if (!reply) return "";
    return reply
      .replace(/^User:.*$/i, "")
      .replace(/undefined/g, "")
      .trim();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input, time: timestamp, status: "✓" },
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await backendCall(input);
      setIsTyping(false);

      const replyTimestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let reply = cleanReply(result?.reply);

      if (!reply) return;

      setMessages((prev) => {
        const updated = [...prev];
        const lastUserIndex = updated.findIndex(
          (m) => m.role === "user" && m.status === "✓"
        );
        if (lastUserIndex !== -1) {
          updated[lastUserIndex].status = "✓✓";
        }

        return [
          ...updated,
          { role: "llama", content: reply, time: replyTimestamp },
        ];
      });
    } catch (error) {
      console.error("Error calling backend:", error);
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "llama",
          content: "⚠️ I couldn’t generate a reply, but I’m here 🙂✨💬",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Chat Board</h2>

      <div className="chat-container">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              msg.role === "user" ? "user-message" : "llama-message"
            }`}
          >
            <ReactMarkdown
              children={msg.content}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <span {...props}>{children}</span>
                  );
                },
              }}
            />
            <div className="timestamp">
              {msg.time}{" "}
              {msg.role === "user" && msg.status && (
                <span className="status">{msg.status}</span>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="llama-message typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBoard;