import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';

interface ISidebarContext {
    currentSection: string;
    setCurrentSection: (value: string) => void;
}

// Creating SidebarState context 
const SidebarContext = createContext<ISidebarContext>({
    currentSection: 'home',
    setCurrentSection: () => {},
});

interface ISidebarStateProvider {
    children: ReactNode;
}

function getSectionFromStorage(){
    return localStorage.getItem("CurrentSection") || "home"
}

// provider
const SidebarStateProvider: React.FC<ISidebarStateProvider> = ({ children }) => {

    const [currentSection, setCurrentSection] = useState<string>(()=>getSectionFromStorage());

    // Memoizing the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        currentSection,
        setCurrentSection,
    }), [currentSection, setCurrentSection]);

    useEffect(()=>{
        localStorage.setItem("CurrentSection",currentSection)
    },[currentSection])

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};

export { SidebarContext, SidebarStateProvider };
