import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AutoSaveContext, AutoSaveStateProvider } from '../autoSaveContext/AutoSaveContext';
import axios from 'axios';

jest.mock('react-ga4', () => ({
  ReactGA4: {
    initialize: () => {
      return <div></div>;
    },
    event: () => {
      return <div></div>;
    },
  },
}));

jest.mock('axios');

// Test Component
const TestComponent = () => {
  const context = React.useContext(AutoSaveContext);
  return (
    <div>
      <button
        data-testid="currentSection"
        onClick={() => {
          context.setChangedFields(['test', 'test1']);
          context.setTabSwitched(true);
        }}
      >
        {''}
      </button>
    </div>
  );
};

describe('SidebarStateContext', () => {
  axios.post = jest.fn().mockResolvedValue({ status: 200 });
  it('should render with initial values', () => {
    render(
      <AutoSaveStateProvider>
        <TestComponent />
      </AutoSaveStateProvider>
    );
    const button = screen.getByTestId('currentSection');
    fireEvent.click(button);
    expect(button.textContent).toBe('');
  }, 8000);
});
