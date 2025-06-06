"use client"

import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react"

export const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}

export const AppContextProvider = ({ children }) => {
    const { isLoaded, user } = useUser();
    const [contextUser, setContextUser] = useState(null);

    useEffect(() => {
        if (isLoaded) {
            setContextUser(user);
        }
    }, [isLoaded, user]);

    const value = {
        user: contextUser,
        isUserLoaded: isLoaded
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}