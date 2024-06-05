import { useParams } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import { useEffect, useState } from "react";

const Chat = () => {
  const { roomId } = useParams();
  const { socket } = useWebSocket();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const initialMessagesFetch = async () => {
    const response = await fetch(`http://localhost:3000/api/room/${roomId}`);
    const data = await response.json();
    console.log(data);
    setMessages(data.messages);
  };

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("joinroom", roomId);
    }

    socket?.on("newuserjoins", (data) => {
      console.log(data);
    });

    socket?.on("messagereceive", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    initialMessagesFetch();

    return () => {
      socket?.off("newuserjoins");
    };
  }, [socket, roomId]);

  return (
    <>
      <div>Chat {roomId}</div>

      <input value={message} onChange={(e) => setMessage(e.target.value)} />

      <button
        onClick={() => socket.emit("messagesend", { roomId, text: message })}
      >
        Send
      </button>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.user}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
