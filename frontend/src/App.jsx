import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import CreateRoom from "./pages/CreateRoom";
import RoomList from "./pages/RoomList";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

function App() {
  return (
    <>
      <nav className="mb-4">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/room">Rooms</Link>
          </li>
          <li>
            <Link to="/room/create">Create Room</Link>
          </li>

          <li>
            <Link to="/login">Login</Link>
          </li>

          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />

        <Route path="/signup" element={<SignupForm />} />

        <Route path="/room" element={<RoomList />} />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/room/:roomId" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
