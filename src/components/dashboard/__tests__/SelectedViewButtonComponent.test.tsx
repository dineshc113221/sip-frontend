import { render } from '@testing-library/react';
import { SelectedViewButton } from '../SelectedViewButton';

describe('Test SelectedViewButton Compoenent', () => {
  it('should return List View', () => {
    const viewButton = render(<SelectedViewButton name="List View" gridViewOpenClick={() => {}} />);
    expect(viewButton).toBeTruthy();
  });
  it('should return Grid View', () => {
    const viewButton = render(<SelectedViewButton name="Grid View" gridViewOpenClick={() => {}} />);
    expect(viewButton).toBeTruthy();
  });
});
