import React, { useEffect, useState } from "react";
import AppRouter from "./router/AppRouter";
import { me } from "./utils/apiUtils";
import { User } from "./types/userTypes";

const getCurrentUser = async (setCurrentUser: (currentUser: User) => void) => {
  const currentUser: User = await me();
  setCurrentUser(currentUser);
};

function App() {
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return <AppRouter currentUser={currentUser} />;
}

export default App;
