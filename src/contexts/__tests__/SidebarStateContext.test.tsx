import React from 'react';
import { render, screen } from '@testing-library/react';
import { SidebarContext, SidebarStateProvider } from '../sidebarData/SidebarStateContext';

jest.mock("react-ga4", () => ({
  ReactGA4: {
    initialize: () => {
      return <div></div>;
    },
    event: () => {
      return <div></div>;
    },
  },
}));

// Test Component
const TestComponent = () => {
  const context = React.useContext(SidebarContext);
  return (
    <div>
      <span data-testid="currentSection">{context.currentSection}</span>
    </div>
  );
};

describe('SidebarStateContext', () => {

  it('should render with initial values', () => {
    render(
      <SidebarStateProvider>
        <TestComponent />
      </SidebarStateProvider>
    );

    expect(screen.getByTestId('currentSection').textContent).toBe('home');
  });


});