import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [userUid, setUserUid] = useState(null);

    return (
        <UserContext.Provider value={{ userEmail, setUserEmail, userUid, setUserUid }}>
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { UserContext, UserContextProvider, useUserContext };
