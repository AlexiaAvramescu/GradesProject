import React, { createContext, useContext, useState, } from "react";

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [classId, setClassId] = useState(() => {
    const savedClassId = localStorage.getItem("classId");
    return savedClassId ? JSON.parse(savedClassId) : null;
  });

  

  // Fetch favorites on login and save to session
  const login = async (userInfo) => {
    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
  };

  // Clear session data on logout
  const logout = () => {
    setUser(null);
    setClassId(null);
    localStorage.removeItem("user");
   
  };

  

  return (
    <SessionContext.Provider
      value={{ user, classId, setClassId, login, logout}}
    >
      {children}
    </SessionContext.Provider>
  );
};
