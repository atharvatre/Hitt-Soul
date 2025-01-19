import { useState, useEffect } from "react";
import "./ChatBot.css";
import axios from "axios";
import Markdown from "react-markdown";
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const ChatBot = () => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setInitialData(
      JSON.parse(localStorage.getItem("kundli")).outputs[0]?.outputs[0]?.results
        ?.message?.data?.text
    );
    setUserData(JSON.parse(localStorage.getItem("formdata")));
    setLoading(false);
  }, [localStorage.getItem("kundli")]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);
    const newMessage = {
      type: "user",
      content: userMessage,
    };
    setChatHistory([...chatHistory, newMessage]);
    setUserMessage("");
    try {
      const requestBody = {
        input_value: `userMessage Gender: ${userData?.gender}
      Date of Birth: ${userData?.date}/${userData?.month}/${userData?.year}
      Time: ${userData?.hours}:${userData?.minutes}:${userData?.seconds}
      Location: ${userData?.city}, ${userData?.state}
      Latitude: ${userData?.latitude}
      Longitude: ${userData?.longitude}
      Timezone: ${userData?.timezone} 
       And provide short and precise answer for the following question: ${userMessage}`,
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          "ChatInput-ptY9L": {},
          "TextInput-4eLMO": {},
          "Prompt-s92xM": {},
          "OpenAIModel-MQPYL": {},
          "ChatOutput-eYBF6": {},
          "ParseData-okg1x": {},
          "AstraDB-4WWLe": {},
          "OpenAIEmbeddings-R0WtN": {},
          "SplitText-v2FBv": {},
          "File-PHABe": {},
          "File-QRe0u": {},
          "File-nm52U": {},
        },
      };

      const response = await axios.post(apiEndpoint, requestBody);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            response.data.outputs[0]?.outputs[0]?.results?.message?.data?.text,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="FlexAround ">
        <div className="w-45 left-side">
          <h3>Unlock the Secrets of Your Stars</h3>
          <div className="init-data-div">
            <Markdown>{initialData}</Markdown>
          </div>
        </div>

        <div className="w-45 right-side">
          <h3>Chat with Soul Buddy</h3>

          <div className="chat-screen">
            {chatHistory.length === 0 && (
              <div className="text-center">
                <p>
                  Welcome to our chatbot! Ask me anything about your kundli and
                  I'll provide you with insightful answers.
                </p>
              </div>
            )}
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <Markdown
                  className={`inline-block p-3 rounded-lg ${
                    msg.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.content}
                </Markdown>
              </div>
            ))}
          </div>
          <div className="FlexAround">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask anything about your astro profile..."
              className="user-input"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="submit-btn FlexCenter"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
