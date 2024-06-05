import { useState } from "react";
import axios from "axios";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Room Name:", roomName);

    const { data } = await axios.post("http://localhost:3000/api/room", {
      name: roomName,
    });

    console.log("Room created:", data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="roomName">Room Name:</label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Room</button>
    </form>
  );
};

export default CreateRoom;
