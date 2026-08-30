
import { render } from '@testing-library/react';
import ViteLogoMock from '../../mocks/ViteSvgMocks'; // Use require instead of import

describe('ViteLogoMock', () => {
    it('renders the SVG component correctly', () => {
        const { container } = render(<ViteLogoMock />);

        const svgElement = container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();

        const circleElement = container.querySelector('circle');
        expect(circleElement).toBeInTheDocument();
    });
});