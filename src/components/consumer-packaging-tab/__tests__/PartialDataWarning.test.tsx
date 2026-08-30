import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PartialDataWarning } from '../../consumer-packaging-tab';

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

describe('PartialDataWarning', () => {
  const setup = () => {
    render(<PartialDataWarning message='There are one or more incomplete data fields.'/>);
  };

  it('renders warning icon', () => {
    setup();
    const imgElement = screen.getByRole('img', { name: /warning-icon/i });
    expect(imgElement).toHaveStyle({ height: '24px', width: '24px' });
  }, 8000);

  it('renders warning title', () => {
    setup();
    const titleElement = screen.getByText(/Warning!/i);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle({
      fontFamily: 'kenvue-sans',
      fontWeight: '700',
      fontSize: '15.2px',
      height: '18px',
    });
  }, 8000);

  it('renders warning description', () => {
    setup();
    const descriptionElement = screen.getByText(/There are one or more incomplete data fields/i);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveStyle({
      fontFamily: 'kenvue-sans-regular',
      fontWeight: '400',
      fontSize: '12px',
      height: '18px',
    });
  }, 8000);

  it('renders icon container with correct alignment', () => {
    setup();
    const iconContainer = screen.getByRole('img', { name: /warning-icon/i }).parentElement;
    expect(iconContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginRight: '10px',
    });
  }, 8000);
});
