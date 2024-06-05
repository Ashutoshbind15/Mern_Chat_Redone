import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RoomListItem = ({ room }) => {
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("http://localhost:3000/api/user");
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleCheckboxChange = (userId, username) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.some((user) => user.userId === userId)) {
        return prevSelectedUsers.filter((user) => user.userId !== userId);
      } else {
        return [...prevSelectedUsers, { userId, username }];
      }
    });
  };

  const handleSubmit = async () => {
    const userIds = selectedUsers.map((user) => user.userId);
    await axios.put(`http://localhost:3000/api/room/${room._id}`, {
      users: userIds,
    });
  };

  return (
    <div className="my-4 border-y-2 border-black">
      <h3>{room.name}</h3>
      {room.users.length > 0 && (
        <p>
          Users:{" "}
          {room.users.map((user) => (
            <span key={user._id}>{user.username}, </span>
          ))}
        </p>
      )}

      <button onClick={() => setShowUserSelector(!showUserSelector)}>
        Add Users
      </button>

      {showUserSelector && (
        <>
          {users.map((user) => (
            <div key={user._id}>
              <input
                type="checkbox"
                id={user._id}
                value={user._id}
                onChange={() => handleCheckboxChange(user._id, user.username)}
              />
              <label htmlFor={user._id}>{user.username}</label>
            </div>
          ))}

          <div>
            <p>Selected Users:</p>
            <ul>
              {selectedUsers.map((user, index) => (
                <li key={index}>{user.username}</li>
              ))}
            </ul>
          </div>

          <button onClick={handleSubmit}>Submit</button>
        </>
      )}

      <Link to={`/room/${room._id}`}>Join Room</Link>
    </div>
  );
};

export default RoomListItem;
