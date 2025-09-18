import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/contact");
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await API.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10 animate-pulse">Loading messages...</p>;
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: "radial-gradient(circle at top, #e0e7ff, #f8fafc)",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-md"
      >
        📩 Contact Messages
      </motion.h1>

      {messages.length === 0 ? (
        <p className="text-center text-gray-500 font-medium">No messages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg, i) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-[2px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1"
            >
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{msg.name}</h2>
                  <p className="text-sm text-indigo-700 font-semibold">{msg.email}</p>
                  <p className="mt-3 text-gray-700 border-2 border-gray-300 p-2 rounded-md leading-relaxed font-medium">{msg.message}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm font-semibold rounded-xl shadow-md transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
