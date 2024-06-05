import axios from "axios";
import { useEffect, useState } from "react";
import RoomListItem from "../components/RoomListItem";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await axios.get("http://localhost:3000/api/room");
      setRooms(data);
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h1>Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <RoomListItem key={room._id} room={room} />
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
