import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useGetExperimentalAssessmentDetails, useGetExperimentalDetails } from '../UseExperimental';
import React from 'react';

// Mock your PostContext if used in useProductService or any child hook
const PostContext = React.createContext(null);
const mockPostContextValue = {}; // Add necessary mocked values here if needed

// Mock your product service
jest.mock('../../adapters/Api', () => ({
  useProductService: () => ({
    getExperimentalDetails: jest.fn(() => Promise.resolve({ data: 'mocked experimental data' })),
    getExperimentalAssementDetails: jest.fn(() => Promise.resolve({ data: 'mocked assessment data' })),
  }),
}));

const queryClient = new QueryClient();

describe('UseExperimental', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <PostContext.Provider value={mockPostContextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </PostContext.Provider>
  );

  const TestExperimentalDetailsComponent = () => {
    const { data, isLoading } = useGetExperimentalDetails();
    return (
      <div>
        {isLoading ? 'Loading...' : `Data: ${data?.data}`}
      </div>
    );
  };

  const TestAssessmentDetailsComponent = () => {
    const { data, isLoading } = useGetExperimentalAssessmentDetails('test-id');
    return (
      <div>
        {isLoading ? 'Loading...' : `Assessment Data: ${data?.data}`}
      </div>
    );
  };

  it('should render the component useGetExperimentalDetails', async () => {
    const { getByText } = render(
      <TestExperimentalDetailsComponent />,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(getByText(/Data:/)).toBeInTheDocument();
    });
  });

  it('should render the component useGetExperimentalAssessmentDetails', async () => {
    const { getByText } = render(
      <TestAssessmentDetailsComponent />,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(getByText(/Assessment Data:/)).toBeInTheDocument();
    });
  });
});