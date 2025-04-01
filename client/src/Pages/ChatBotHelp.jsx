import React, { useState } from "react";
import { Navbar } from "../Components/Navbar";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatBotHelp = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // Handle sending messages
    const handleSendMessage = async () => {
        if (!input.trim()) return;

        // Display user message
        setMessages([...messages, { sender: "user", text: input }]);

        try {
            console.log("Sending message to ChatGPT...", input);
            const response = await axios.post("http://localhost:8000/api/v1/chat", { message: input });
            console.log("Got the response...", response);
            setMessages([...messages, { sender: "user", text: input }, { sender: "bot", text: response.data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages([...messages, { sender: "bot", text: "Error communicating with ChatGPT." }]);
        }

        setInput("");
    };

    return (
        <div className="sec-1 w-full h-full bg-gradient-to-tl from-[#76dbcf]">
            <Navbar />
            <div className="header w-full flex justify-center mt-7">
                <h1 className="font-semibold text-2xl">Chat with Caresync AI</h1>
            </div>
            <div className="chat-container p-5 flex justify-center items-center">
                <div className="chat-box bg-white w-3/4 h-[840px] rounded-3xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Welcome to Caresync AI!</h2>
                    <div className="chat-ui bg-gray-100 h-[700px] rounded-lg p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                <span className={`inline-block p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask something..."
                            className="flex-grow p-2 rounded-l-lg border"
                        />
                        <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBotHelp;