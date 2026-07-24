import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);

  const loadBookmarks = async () => {
    try {
      const storedBookmarks = await AsyncStorage.getItem("favorites");
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const addBookmark = async (title, content,serial) => {
    try {
      const newBookmark = { title, content,serial };
      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const removeBookmark = async (title) => {
    try {
      const updatedBookmarks = bookmarks.filter(
        (bookmark) => bookmark.title !== title
      );
      setBookmarks(updatedBookmarks);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const contextValue = {
    bookmarks,
    addBookmark,
    removeBookmark,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppProvider };
