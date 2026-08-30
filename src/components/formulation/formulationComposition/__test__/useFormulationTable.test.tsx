import { act, renderHook } from "@testing-library/react";
import useFormulationTable from "../useFormulationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { FormulaionTableMock } from "../../../../mocks/FormulationTable.mock.json";
import { useGetRawMaterialDataByKeyword } from "../../../../hooks/UseGetProductDetails";

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
jest.mock("../../../../hooks/UseGetProductDetails", () => ({
    useGetRawMaterialDataByKeyword: jest.fn(),
  }));
describe("useFormulationTable Hook", () => {
    const defaultProps = {
        isClear: false,
        formulationRawMaterials: FormulaionTableMock.rows.map(row => ({
            ...row,
            percentage: String(row.percentage),  // Convert percentage to string
        })),
        handelFormulationTableChanges: jest.fn(),
    };

    it("should initialize with default values", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });

        expect(result.current.errors).toBeInstanceOf(Map);
        expect(result.current.getTotalWeight()).toEqual(129.54); // Adjust as needed
    });

    it("should handle mass change correctly", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });

        const indexPosition = 0; // Change as needed based on your mock data
        const newMassValid = "50"; // A valid mass percentage
        const newMassInvalid = "200"; // An invalid mass percentage for testing

        // Act with valid mass change
        act(() => {
            result.current.handleMassChange(indexPosition, newMassValid);
        });

        // Assert that the row percentage is updated to the new mass
        expect(result.current.rows[indexPosition].percentage).toBe(newMassValid);
        // Assert that there are no errors (should be null not undefined)
        expect(result.current.errors.get(result.current.rows[indexPosition].rawMaterialId)).toBe(undefined);

        // Act with invalid mass change
        act(() => {
            result.current.handleMassChange(indexPosition, newMassInvalid);
        });

        // Assert that the error message is set
        expect(result.current.errors.get(result.current.rows[indexPosition].rawMaterialId)).toEqual(
            "Mass % Composition should be in the range of 0-100% only. Please enter a valid range."
        );
    });

    it("should update in-focus rows", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });

        act(() => {
            result.current.setInFocusRows([1, 2, 3]);
        });

        expect(result.current.inFocusRows).toEqual([1, 2, 3]);
    });

    it("should handle blur events correctly", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });

        act(() => {
            result.current.handleBlur("RAW90023342", "10", 1);
        });

        expect(result.current.errors.has("RAW90023342")).toBe(false);
    });
    it("should handle search select correctly", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });

        const newMaterial =
            { "EUINCIName": "test", "USINCIName": "test", "_id": 1, "carbonFootprint": 1, "cas": "test", "envFootprint": 1, "gaiaScore": "test", "greenChemistry": 1, "leaf_icon_boolean": "test", "percentage": "test", "rawMaterialId": "test", "rmcStatus": "test", "specNumber": "test", "status": "test", "tradeName": "string", "watchlist_icon_boolean": "test" };

        // Act on selecting a new search result
        act(() => {
            result.current.handleSearchSelect(newMaterial);
        });

        // Assert that the new material has been added to the rows
        expect(result.current.rows).toContainEqual({
            ...newMaterial,
            _id: 1, // This will be set according to the current length of prevRows
        });

        // Act on selecting a material that already exists
        act(() => {
            result.current.handleSearchSelect(newMaterial);
        });

        // Assert that the new material is not added again
        expect(result.current.rows).toHaveLength(10); // Check if it still has only one entry
    });
    it("should handle search input changes", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });
      
        // Mock search change
        act(() => {
            result.current.handleSearchChange({ target: { value: "RAW90023342" } } as React.ChangeEvent<HTMLInputElement>);
        });
      
        expect(result.current.searchValue).toBe("RAW90023342");
        expect(result.current.isSearchResultsOpen).toBe(true);
    });
   
    it("should set isHoveredtotal to true on mouse enter", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });
    
        // Act
        act(() => {
            result.current.handleMouseEnterWeight();
        });
    
        // Assert
        expect(result.current.isHoveredtotal).toBe(true);
    });
    
    it("should set isHoveredtotal to false on mouse leave", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });
    
        // First set the state to true
        act(() => {
            result.current.handleMouseEnterWeight();
        });
    
        // Act
        act(() => {
            result.current.handleMouseLeaveWeight();
        });
    
        // Assert
        expect(result.current.isHoveredtotal).toBe(false);
    });
     
    
    it("should reset rows to formulationRawMaterials when isClear is true", () => {
        const props = { ...defaultProps, isClear: true };
    
        // Render the hook
        const { result, rerender } = renderHook(() => useFormulationTable(props), { wrapper });
    
        // Verify that rows are reset to formulationRawMaterials
        expect(result.current.rows).toEqual(props.formulationRawMaterials);
    
        // Trigger a re-render with isClear set to false
        rerender({ ...props, isClear: false });
    
        // Verify that rows are not reset again
        expect(result.current.rows).not.toEqual([]);
    });
    
    it("should toggle the order and update orderBy when handleRequestSort is called", () => {
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });

        // Initial state
        expect(result.current.order).toBe("asc");
        expect(result.current.orderBy).toBe(null);

        // Call handleRequestSort with 'name'
        act(() => {
            result.current.handleRequestSort("tradeName");
        });

        // Verify state changes
        expect(result.current.order).toBe("asc");
        expect(result.current.orderBy).toBe("tradeName");

        // Call handleRequestSort with a new property
        act(() => {
            result.current.handleRequestSort("rawMaterialId");
        });

        // Verify state changes
        expect(result.current.order).toBe("asc");
        expect(result.current.orderBy).toBe("rawMaterialId");
    });
    
    let fetchRawMaterialDataMock: jest.Mock;
   
  
    beforeEach(() => {
        fetchRawMaterialDataMock = jest.fn();
    
  
        // Mock the useGetRawMaterialDataByKeyword hook
        (useGetRawMaterialDataByKeyword as jest.Mock).mockReturnValue({
            mutate: fetchRawMaterialDataMock,
            data: null,
            isLoading: false,
        });
  
    });
    const mockData=[{rawMaterialId:'RAW90023342',tradeName:'abs',percentage:''}]

    it("should call fetchRawMaterialData when debouncedSearchTerm is valid", () => {
        jest.useFakeTimers(); // Use fake timers to control debounce
        const fetchRawMaterialDataMock = jest.fn();
        // Mock the useGetRawMaterialDataByKeyword hook
        (useGetRawMaterialDataByKeyword as jest.Mock).mockReturnValue({
            mutate: fetchRawMaterialDataMock,
            data: mockData,
            isLoading: false,
        });
      
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });
      
        // Simulate search input change
        act(() => {
            result.current.handleSearchChange({
                target: { value: "RAW90023342" },
            } as React.ChangeEvent<HTMLInputElement>);
        });
      
        // Assert searchValue was updated immediately
        expect(result.current.searchValue).toBe("RAW90023342");
      
        // Fast-forward the debounce delay
        act(() => {
            jest.advanceTimersByTime(1000);
        });
      
        // Validate fetchRawMaterialData is called
        expect(fetchRawMaterialDataMock).toHaveBeenCalled();
      
        jest.useRealTimers(); // Reset to real timers
    });
    it("should reset search results when search value is cleared", () => {
        jest.useFakeTimers(); // Use fake timers for debounce
        const fetchRawMaterialDataMock = jest.fn();
      
        // Mock the useGetRawMaterialDataByKeyword hook
        (useGetRawMaterialDataByKeyword as jest.Mock).mockReturnValue({
          mutate: fetchRawMaterialDataMock,
          data: [],
          isLoading: false,
        });
      
        const { result } = renderHook(() => useFormulationTable(defaultProps), { wrapper });

      
        // Simulate valid search input
        act(() => {
          result.current.handleSearchChange({
            target: { value: "RAW90023342" },
          } as React.ChangeEvent<HTMLInputElement>);
        });
      
        // Fast-forward the debounce delay
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      
        // Ensure fetchRawMaterialData was called
        expect(fetchRawMaterialDataMock).toHaveBeenCalled();
      
        // Simulate clearing the search input
        act(() => {
          result.current.handleSearchChange({
            target: { value: "" },
          } as React.ChangeEvent<HTMLInputElement>);
        });
      
        // Fast-forward the debounce delay
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        expect(result.current.searchValue).toBe("");

        // Ensure fetchRawMaterialData is not called again
        expect(fetchRawMaterialDataMock).not.toHaveBeenCalledTimes(2);
    
      
        jest.useRealTimers(); // Reset to real timers
      });
      it("should remove the row at the specified index and call handelFormulationTableChanges", () => {
        const mockHandelFormulationTableChanges = jest.fn();
      
        const props = {
          ...defaultProps,
          handelFormulationTableChanges: mockHandelFormulationTableChanges,
        };
      
        // Render the hook with mock props
        const { result } = renderHook(() => useFormulationTable(props), {
          wrapper,
        });
      
        // Simulate deleting the first row
        act(() => {
          result.current.handleDeleteRow(0); // Deleting the row at index 0
        });
      
  // Expected rows after deletion
  const expectedRows = defaultProps.formulationRawMaterials.slice(1);

  // Validate `handelFormulationTableChanges` is called with updated rows
  expect(mockHandelFormulationTableChanges).toHaveBeenCalledWith(expectedRows);

  // Validate the length of rows after deletion
  expect(expectedRows.length).toBe(7); // Original length was 8
});
      
});