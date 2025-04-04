import React, { createContext, useContext, useState, useEffect } from "react";

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
    //setToken(token);

    localStorage.setItem("user", JSON.stringify(userInfo));
    //localStorage.setItem("token", token);
    //try {
    //  const response = await fetch(
    //    `http://localhost:5000/favorites?userId=${userInfo.id}`,
    //    {
    //      headers: {
    //        Authorization: `Bearer ${token}`,
    //      },
    //    }
    //  );
    //  if (response.ok) {
    //    const data = await response.json();
    //    const favoriteMovieIds = data.favorites.map((fav) => fav.movieId);
    //    setFavorites(favoriteMovieIds);
    //    localStorage.setItem("favorites", JSON.stringify(favoriteMovieIds));
    //  }
    //} catch (error) {
    //  console.error("Error fetching favorites during login:", error);
    //}
  };

  // Clear session data on logout
  const logout = () => {
    setUser(null);
    //setToken(null);
    //setFavorites([]);
    localStorage.removeItem("user");
    //localStorage.removeItem("token");
    //localStorage.removeItem("favorites");
  };

  // Add a favorite movie locally and update server
  //const addFavorite = async (movieId) => {
  //  if (!favorites.includes(movieId)) {
  //    const updatedFavorites = [...favorites, movieId];
  //    setFavorites(updatedFavorites);
  //    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
//
  //    try {
  //      await fetch(`http://localhost:5000/favorites`, {
  //        method: "POST",
  //        headers: {
  //          "Content-Type": "application/json",
  //          Authorization: `Bearer ${token}`,
  //        },
  //        body: JSON.stringify({ userId: user.id, movieId }),
  //      });
  //    } catch (error) {
  //      console.error("Error adding favorite:", error);
  //    }
  //  }
  //};
//
  //const removeFavorite = async (movieId) => {
  //  const updatedFavorites = favorites.filter((id) => id !== movieId);
  //  setFavorites(updatedFavorites);
  //  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
//
  //  try {
  //    await fetch(`http://localhost:5000/favorites`, {
  //      method: "DELETE",
  //      headers: {
  //        "Content-Type": "application/json",
  //        Authorization: `Bearer ${token}`,
  //      },
  //      body: JSON.stringify({ userId: user.id, movieId }),
  //    });
  //  } catch (error) {
  //    console.error("Error removing favorite:", error);
  //  }
  //};
//
  //useEffect(() => {
  //  const syncFavorites = async () => {
  //    if (user) {
  //      try {
  //        const response = await fetch(
  //          `http://localhost:5000/favorites?userId=${user.id}`,
  //        {
  //          headers: {
  //            Authorization: `Bearer ${token}`,
  //          },
  //        }
  //        );
  //        if (response.ok) {
  //          const data = await response.json();
  //          const favoriteMovieIds = data.favorites.map((fav) => fav.movieId);
  //          setFavorites(favoriteMovieIds);
  //          localStorage.setItem("favorites", JSON.stringify(favoriteMovieIds));
  //        }
  //      } catch (error) {
  //        console.error("Error syncing favorites:", error);
  //      }
  //    }
  //  };
//
  //  const interval = setInterval(syncFavorites, 300000); 
  //  return () => clearInterval(interval); 
  //}, [user]);

  return (
    <SessionContext.Provider
      value={{ user, classId, login, logout /*, addFavorite, removeFavorite */}}
    >
      {children}
    </SessionContext.Provider>
  );
};
