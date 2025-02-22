import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import ApiService from "../services/api";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([{ text: "Hi! How can I help you today?", isUser: false }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const student_id = localStorage.getItem("student_id") || "0";
    setMessages((prev) => [...prev, { text: inputMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await ApiService.post<{ response: string }>("/chatbot", {
        student_id,
        question: inputMessage,
      });

      setMessages((prev) => [
        ...prev,
        { text: response.response, isUser: false },
      ]);
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble responding right now.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
      setInputMessage("");
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-[28em] h-[40em] flex flex-col">
          {/* Header */}
          <div className="p-4 bg-indigo-400 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-indigo-500 p-1 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.isUser
                      ? "bg-indigo-400 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-indigo-400 text-white p-2 rounded-lg hover:bg-indigo-500 disabled:bg-gray-300"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-400 text-white p-3 rounded-full shadow-lg hover:bg-indigo-500 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default ChatBot;
