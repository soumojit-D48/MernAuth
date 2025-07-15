import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

//We're creating a global state manager using React Context, so that any component in your app can easily access and modify:

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  // This is a provider component. You'll wrap your entire app (or part of it) with this so that all child components can access the context.

  axios.defaults.withCredentials = true; // after reload it reset send the cookie

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth"); // is-auth

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedin(false);
        console.log("User is not logged in.");
      } else {
        toast.error("Something went wrong. Please try again.");
        console.error("Axios error:", error.message);
      }
    }
  };

  useEffect(() => {
    // whenever the page loaded it will check the auuth status
    getAuthState(); // if true then change the navbar, have to remove the login button cause user is already login
  }, []);

  const value = {
    // grouping all the state values and setters into one object to pass to the provider.
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    // This wraps child components with your context provider, making all values available inside any component using useContext(AppContent).
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
  /* AppContextProvider
    This is a component you wrap your app with.
    It supplies the actual data (value) to the context using .Provider.
     */
};

// export default AppContextProvider

/* Whether the user is logged in (isLoggedin)

The logged-in user's data (userData)

Your backend URL from environment variables (backendUrl)

Without prop drilling. This makes your app cleaner, scalable, and easier to maintain.

On logout: reset state

Any component (like Navbar, Profile, Dashboard) can access the user info without prop drilling

*/
