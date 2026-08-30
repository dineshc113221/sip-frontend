import { render } from '@testing-library/react';
import Button from '../Button';

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

describe('Button', () => {
  const onClick = jest.fn();

  it('should render with component', () => {
    render(
      <Button
        label={"button label"}
        onClick={onClick}
      />
    );

  });


});