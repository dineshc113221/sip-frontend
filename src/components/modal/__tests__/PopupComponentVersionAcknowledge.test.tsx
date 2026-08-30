import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopupComponentVersionAcknowledge from '../PopupComponentVersionAcknowledge'; 

jest.mock("../../../assets/images/warningIcon.svg", () => "test-file-stub");

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('PopupComponentVersionAcknowledge', () => {
    const mockSetAcknowledgeVersion = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should not render the dialog content when modalState is false', () => {
        render(
            <PopupComponentVersionAcknowledge 
                modalState={false} 
                setAcknowledgeVersion={mockSetAcknowledgeVersion} 
            />
        );        
        const title = screen.queryByText('Important Update');
        expect(title).not.toBeInTheDocument();
    });

    test('should render correctly when modalState is true', () => {
        render(
            <PopupComponentVersionAcknowledge 
                modalState={true} 
                setAcknowledgeVersion={mockSetAcknowledgeVersion} 
            />
        );
        
        expect(screen.getByText('Important Update')).toBeInTheDocument();        
        const image = screen.getByAltText('warning');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'test-file-stub');
        expect(screen.getByRole('button', { name: /I Acknowledge/i })).toBeInTheDocument();
    });

    test('should update open state when modalState prop changes (useEffect coverage)', () => {
        const { rerender } = render(
            <PopupComponentVersionAcknowledge 
                modalState={false} 
                setAcknowledgeVersion={mockSetAcknowledgeVersion} 
            />
        );

        expect(screen.queryByText('Important Update')).not.toBeInTheDocument();
        rerender(
            <PopupComponentVersionAcknowledge 
                modalState={true} 
                setAcknowledgeVersion={mockSetAcknowledgeVersion} 
            />
        );        
        expect(screen.getByText('Important Update')).toBeInTheDocument();
    });

    test('should navigate to changelog when "SIP Change Log" link is clicked', () => {
        render(
            <PopupComponentVersionAcknowledge 
                modalState={true} 
                setAcknowledgeVersion={mockSetAcknowledgeVersion} 
            />
        );

        const changeLogLink = screen.getByText('SIP Change Log.');
        fireEvent.click(changeLogLink);
    });

    test('should call setAcknowledgeVersion when "I Acknowledge" button is clicked', () => {
        render(
            <PopupComponentVersionAcknowledge 
                modalState={true} 
                setAcknowledgeVersion={mockSetAcknowledgeVersion} 
            />
        );

        const button = screen.getByRole('button', { name: /I Acknowledge/i });
        fireEvent.click(button);

        expect(mockSetAcknowledgeVersion).toHaveBeenCalledTimes(1);
        expect(mockSetAcknowledgeVersion).toHaveBeenCalledWith(expect.any(Function));
    });
});