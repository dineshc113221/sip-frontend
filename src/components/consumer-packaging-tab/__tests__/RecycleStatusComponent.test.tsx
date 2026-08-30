
import { render, screen } from '@testing-library/react';
import RecycleStatusComponent from '../RecycleStatusComponent';

describe('RecycleStatusComponent', () => {
    it('displays "Recycle Ready" when staticRecycleStatus is "Recycle Ready"', () => {
        render(<RecycleStatusComponent staticRecycleStatus="Recycle Ready" />);

        expect(screen.getByText('Recycle Ready')).toBeInTheDocument();
    });

    it('displays "Not Recycle Ready" when staticRecycleStatus is "Not Recycle Ready"', () => {
        render(<RecycleStatusComponent staticRecycleStatus="Not Recycle Ready" />);

        expect(screen.getByText('Not Recycle Ready')).toBeInTheDocument();
    });

    it('displays "N/A" when staticRecycleStatus is unknown', () => {
        render(<RecycleStatusComponent staticRecycleStatus="InvalidStatus" />);

        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('always renders the red asterisk in the label', () => {
        render(<RecycleStatusComponent staticRecycleStatus="Recycle Ready" />);

        const asteriskSpan = screen.getByText('*');
        expect(asteriskSpan).toBeInTheDocument();
        expect(asteriskSpan).toHaveStyle({ color: 'red' });
    });
});