import React from 'react';
import { render, screen } from '@testing-library/react';
import { PostContext,BasicUserInfo } from '../masterData/DataContext';
import DataProvider from '../masterData/DataProvider';

// Mock data
const mockLoggedInUser: BasicUserInfo = {
  givenName: "John",
  displayName: "John Doe",
  mail: "john@example.com",
  accessToken: "mock-access-token",
  roles: ["SIP_USERS"]
};

// Test Component
const TestComponent = () => {
  const context = React.useContext(PostContext);
  return (
    <div>
      <span data-testid="currentSection">{context.token}</span>
    </div>
  );
};

describe('DataProvider', () => {
  it('should render with initial values', () => {
    render(
      <DataProvider loggedInUser={mockLoggedInUser}>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('currentSection').textContent).toBe('mock-access-token');
  });
});
