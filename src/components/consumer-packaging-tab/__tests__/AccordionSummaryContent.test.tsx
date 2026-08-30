import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccordionSummaryContent from '../AccordionSummaryContent';
import { AccordionSummaryContentProps } from '../../breadcrumb/types';

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

describe('AccordionSummaryContent', () => {
  const defaultProps: AccordionSummaryContentProps = {
    expanded: false,
    imageSrc: 'image-source.png',
    imageClassName: 'image-class',
    componentType: null,
    description: null,
    isSaved: false,
  };
  const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props };
    render(<AccordionSummaryContent {...setupProps} />);
  };
  it('renders image with correct src and class', () => {
    setup();
    const imgElement = screen.getByRole('img', { name: /recycle status/i });
    expect(imgElement).toHaveAttribute('src', 'image-source.png');
    expect(imgElement).toHaveClass('image-class');
  }, 8000);

  it('renders default component type when componentType is null', () => {
    setup();
    expect(screen.getByText('Component Type')).toBeInTheDocument();
  }, 8000);

  it('renders provided component type', () => {
    setup({ componentType: 'Test Component Type' });
    expect(screen.getByText('Test Component Type')).toBeInTheDocument();
  }, 8000);

  it('renders default description when description is null', () => {
    setup();
    expect(screen.getByText('Component Description')).toBeInTheDocument();
  }, 8000);

  it('renders "N/A" when description is empty string', () => {
    setup({ description: '' });
    expect(screen.getByText('Component Description')).toBeInTheDocument();
  }, 8000);

  it('applies opacity 0.5 when componentType is null', () => {
    setup({ componentType: null });
    const label = screen.getByText('Component Type');
    expect(label).toHaveStyle({ opacity: '0.5' });
  });

  it('applies opacity 1 when componentType is provided', () => {
    setup({ componentType: 'Test Component Type' });
    const label = screen.getByText('Test Component Type');
    expect(label).toHaveStyle({ opacity: '1' });
  });

  

});