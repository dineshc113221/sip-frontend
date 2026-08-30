import { act, fireEvent, render, screen } from '@testing-library/react';
import Tooltipcommon from '../Tooltip';

jest.useFakeTimers();

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
describe('Tooltipcommon', () => {

  it('should render with initial values', () => {
    render(
      <Tooltipcommon
        content={"FML_NUMBER_TOOLTIP_CONTENT"}
        direction="fml-top"
        disable={false}
        subTitle={"test"}
      >
        <div>test</div>
      </Tooltipcommon>
    );

    const text = screen.getByText("test");
    act(() => {
      fireEvent(
        text,
        new MouseEvent('mouseover', {
          bubbles: true,
        }),
      );
      jest.advanceTimersByTime(5000);
      fireEvent.mouseLeave(text)
    });
    
  }, 8000);


});