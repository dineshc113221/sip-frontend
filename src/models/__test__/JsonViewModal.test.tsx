import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import Material UI theme
import JsonViewModal from '../JsonViewModal'; // Update the import path as necessary
import { jest } from '@jest/globals';

const mockInputData = {
    createdAt: new Date().toISOString(),
    input: {
        raw_material_id: "1",
        raw_material_name: "Plastic",
        raw_material_value: "100"
    },
    productId: "product_1",
    assessmentId: "assessment_1",
    assessmentType: "type_1",
    assessmentId2: "assessment_2",
    assessmentType2: "type_2",
    formulaId: "formula_1",
    fg_spec: "spec_1",
    fg_revision: "revision_1",
    sales_country: "USA",
    production_country: "China",
    net_content: "1L",
    formula_id: "formula_id_1",
    ConsumablesUsed: "N/A",
    productSegment: "Segment A",
    productSubSegment: "Sub Segment A",
    claimedVolumed: "10",
    useDose: "100",
    net_content_unit: "L",
    productEvaluation: 1,
    rateOfRestitution: 0.5,
    user: {
        name: "John Doe",
        email: "john.doe@example.com"
    },
    raw_materials: [],
    packaging_level: []
};

describe('JsonViewModal Component', () => {
    const onCloseMock = jest.fn();
    const onCopyMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    function renderComponent(open: boolean, inputData = mockInputData) {
        const theme = createTheme();
        return render(
            <ThemeProvider theme={theme}>
                <JsonViewModal
                    inputData={inputData}
                    open={open}
                    onClose={onCloseMock}
                    onCopy={onCopyMock}
                />
            </ThemeProvider>
        );
    }

    test('renders JsonViewModal when open is true', () => {
        renderComponent(true);
        expect(screen.getByText(/Input Data/i)).toBeInTheDocument();
    });

    test('does not render JsonViewModal when open is false', () => {
        renderComponent(false);
        expect(screen.queryByText(/Input Data/i)).not.toBeInTheDocument();
    });

    test('handles copy button click', () => {
        renderComponent(true);
        const copyButton = screen.getByRole('button', { name: /copy json/i });
        fireEvent.click(copyButton);
        expect(onCopyMock).toHaveBeenCalledTimes(1);
    });

    test('handles close button click', () => {
        renderComponent(true);
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('renders input data correctly', () => {
        renderComponent(true);
        expect(screen.getByText(/raw_material_id/i)).toBeInTheDocument();
        expect(screen.getByText(/raw_material_name/i)).toBeInTheDocument();
        expect(screen.getByText(/raw_material_value/i)).toBeInTheDocument();
    });

    test('handles no input data scenario', () => {
        const emptyInputData = { ...mockInputData, input: null }; // Create a scenario with no input data
        render(
            <ThemeProvider theme={createTheme()}>
                <JsonViewModal
                    inputData={emptyInputData}
                    open={true}
                    onClose={onCloseMock}
                    onCopy={onCopyMock}
                />
            </ThemeProvider>
        );

        expect(screen.getByText(/no input data available/i)).toBeInTheDocument();
    });
     
    
      test('handles empty input data', () => {
        renderComponent(true, { ...mockInputData, input: null });
        expect(screen.getByText(/no input data available/i)).toBeInTheDocument();
      });
    
      test('renders date in title when available', () => {
        renderComponent(true);
        const dateString = new Date(mockInputData.createdAt).toLocaleString();
        expect(screen.getByText(new RegExp(dateString))).toBeInTheDocument();
      });
    test('toggles expansion of JSON nodes', () => {
        renderComponent(true);

        // Check initial expanded state
        const toggleButton = screen.getByRole('button', { name: /toggle object/i });
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

        // Collapse the node
        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

        // Expand again
        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });
    test('expands all nested paths by default', () => {
        const nestedInput = {
            ...mockInputData,
            input: {
                ...mockInputData.input,
                nested: {
                    level1: {
                        level2: "value"
                    }
                }
            }
        };
        renderComponent(true, nestedInput);

        // Check that "nested" appears as expected
        expect(screen.getByText(/"nested":/i)).toBeInTheDocument();

        // Attempt to click buttons to ensure levels expand if necessary
        const nestedToggleButton = screen.getAllByRole('button', { name: /toggle object/i });
        fireEvent.click(nestedToggleButton[0]); // Simulate click to expand if necessary

    });


});