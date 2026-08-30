import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';

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

describe('App component ', () => {
  it('should render with component', () => {
    render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0])
  }, 8000);
});