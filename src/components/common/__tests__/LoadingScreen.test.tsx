import { render, screen } from "@testing-library/react";
import { LoadingProvider, useLoading } from "../../../contexts/loadingPage/LoadingContext";
import LoadingScreen from "../LoadingScreen";
import React from "react";

// Custom component to test loading state
const TestWrapper = ({ isLoading }: { isLoading: boolean }) => {
    const { setLoading } = useLoading();
    
    React.useEffect(() => {
      setLoading(isLoading);
    }, [isLoading, setLoading]);
  
    return <LoadingScreen />;
  };
  
  describe("LoadingScreen Component", () => {
    it("should not render anything when isLoading is false", () => {
      const { container } = render(
        <LoadingProvider>
          <TestWrapper isLoading={false} />
        </LoadingProvider>
      );
  
      expect(container.firstChild).toBeNull(); // Should render nothing
    });
  
    it("should render loading spinner when isLoading is true", () => {
      render(
        <LoadingProvider>
          <TestWrapper isLoading={true} />
        </LoadingProvider>
      );
  
      expect(screen.getByRole("progressbar")).toBeInTheDocument(); // Ensures CircularProgress is rendered
    });
  });