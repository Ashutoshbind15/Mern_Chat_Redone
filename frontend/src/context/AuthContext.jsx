import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      console.log(token);
      // Save token to localStorage
      localStorage.setItem("token", token);

      // Fetch user data
      axios
        .get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
        .catch(() => setToken(null)); // Remove token if invalid
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      username,
      password,
    });
    setToken(response.data.token);
  };

  const signup = async (username, password) => {
    await axios.post("http://localhost:3000/api/auth/signup", {
      username,
      password,
    });
    return login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
