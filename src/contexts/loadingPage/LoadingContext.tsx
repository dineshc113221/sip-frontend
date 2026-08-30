import React, { createContext, useContext, ReactNode, useMemo } from "react";
// Define the type for the context
interface LoadingContextType {
 isLoading: boolean;
 setLoading: (loading: boolean) => void;
}
// Create the context with an initial undefined value
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
// Provider component
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const loadingObj= useMemo(() => ({isLoading,setLoading: setIsLoading}), [isLoading]); 
    return (
        <LoadingContext.Provider value={loadingObj}>
            {children}
        </LoadingContext.Provider>
    );
};
// Hook to use the loading context
// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = (): LoadingContextType => {
 const context = useContext(LoadingContext);
 if (!context) {
   throw new Error("useLoading must be used within a LoadingProvider");
 }
 return context;
};
