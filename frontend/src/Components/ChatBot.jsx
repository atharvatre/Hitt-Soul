import { useState, useEffect } from "react";
import axios from "axios";


const ChatBot = () => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("userFormData")) fetchInitialData();
  }, [localStorage.getItem("userFormData")]);

  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  console.log("apiEndpoint===>", apiEndpoint);

  const fetchInitialData = async () => {
    try {
      const userFormData = JSON.parse(localStorage.getItem("userFormData"));
      const requestBody = {
        input_value: `Name: ${userFormData.fullname}
      Gender: ${userFormData.gender}
      Date of Birth: ${userFormData.date}/${userFormData.month}/${userFormData.year}
      Time: ${userFormData.hours}:${userFormData.minutes}:${userFormData.seconds}
      Location: ${userFormData.city}, ${userFormData.state}
      Latitude: ${userFormData.latitude}
      Longitude: ${userFormData.longitude}
      Timezone: ${userFormData.timezone} 
      
      Provide a comprehensive analysis including:
        1. Kundali Analysis & Horoscope Reading:
           - Detailed birth chart interpretation
           - Current planetary positions
           - Upcoming astrological predictions
        
        2. Personal Recommendations:
           - Suggested Puja rituals for harmony
           - Beneficial gemstones based on birth chart
           - Essential Dos and Don'ts for spiritual growth
        
        3. Wellness Guidelines:
           - Personalized meditation techniques
           - Recommended workout routines
           - Suitable sleep music and relaxation practices`,
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
      const response = await axios.post(apiEndpoint, requestBody, {
        headers: {
          "Content-Type": "application/json",
        }
      },
      );

      //const data = await response.json();
      setInitialData(response.data);
      setLoading(false);
      setOpenChat(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = {
      type: "user",
      content: userMessage,
    };

    setChatHistory([...chatHistory, newMessage]);
    setUserMessage("");

    try {
      const requestBody = {
        input_value: userMessage,
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
          content: response.data.reply,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Soul Buddy</h1>

      {/* Initial Data Sections */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Kundali and Horoscope</h2>
        <div className="prose">{initialData?.kundali}</div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
        <div className="prose">{initialData?.recommendations}</div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Meditation & Wellness</h2>
        <div className="prose">{initialData?.wellness}</div>
      </div>

      {/* Chat Section */}
      {openChat && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Chat with Soul Buddy</h2>

          <div className="h-80 overflow-y-auto mb-4 p-4 border rounded">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask anything about your astro profile..."
              className="flex-1 p-2 border rounded"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
