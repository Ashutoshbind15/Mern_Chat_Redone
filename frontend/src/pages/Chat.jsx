import { useParams } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import { useEffect } from "react";

const Chat = () => {
  const { roomId } = useParams();
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("joinroom", roomId);
    }

    socket?.on("newuserjoins", (data) => {
      console.log(data);
    });

    return () => {
      socket?.off("newuserjoins");
    };
  }, [socket, roomId]);

  return <div>Chat {roomId}</div>;
};

export default Chat;
