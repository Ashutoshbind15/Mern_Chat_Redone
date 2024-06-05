// src/hooks/useWebSocket.js
import { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

const useWebSocket = () => {
  const { token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = io("ws://localhost:8080", {
        query: { token },
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server");
        setSocket(newSocket); // Set the state when connected
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
        setSocket(null); // Clear the state when disconnected
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  return { socket };
};

export default useWebSocket;
