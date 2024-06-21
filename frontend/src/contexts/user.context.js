import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Updated to interact with your Express backend
  const emailPasswordLogin = async (loginIdentifier, password) => {
    try {
        const response = await fetch('******', { // confidential
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                loginIdentifier, // This can be either username or email
                password
            }),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Login failed: ${errorDetails.message || "Unknown error"}`);
        }

        const userData = await response.json();
        setUser(userData);
        return userData;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};


  const emailPasswordSignup = async (email, password, username) => {
    try {
      const response = await fetch('*****', { // Confidential
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
        credentials: 'include', // Include credentials for cross-origin requests
      });
      if (!response.ok) {
        const errorDetails = await response.json(); // Assuming the server sends JSON with error details
        throw new Error(`Signup failed: ${errorDetails.error || "Unknown error"}`);
      }
      const userData = await response.json(); // Assuming your endpoint responds with user data
      setUser(userData); // You might adjust this based on your backend response
      return userData;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  //  Placeholder for fetching user data, adjust based on your auth method
  // const fetchUser = async () => {
    
  // };

  // const logOutUser = async () => {
    
  // };

  return (
    <UserContext.Provider value={{ user, setUser, emailPasswordLogin, emailPasswordSignup, fetchUser, logOutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
