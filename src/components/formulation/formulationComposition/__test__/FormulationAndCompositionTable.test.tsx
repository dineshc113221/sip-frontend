import { render, act, screen, fireEvent} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { FormulaionTableMock } from "../../../../mocks/FormulationTable.mock.json";
import { PackagingMock } from "../../../../mocks/Packaging.mock.json";
import { TablePackagingMock } from "../../../../mocks/TablePackaging.mock.json";
import { ReactInfiniteProps } from '../../../../mocks/CoreLogin.mock';
import { PrimaryPackagingMock, SecondaryPackagingMock } from '../../../../mocks/ProductDetails.mock';
import { GlobalDataMock } from "../../../../mocks/GlobalData.mock.json";
import { PostContext, useGlobaldata } from '../../../../contexts/masterData/DataContext';
import useFormulationTable from '../useFormulationTable';
import usePackaging from '../../../consumer-packaging-tab/usePackaging';
import { useConsumerPackagingContext } from '../../../consumer-packaging-tab/ConsumerPackagingContext';
import FormulationAndCompositionTable from '../FormulationAndCompositionTable';


const queryClient = new QueryClient({});

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: () =>
    jest.fn(() => ({ givenName: "blaw", mail: "badckak" })),
}));

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

jest.useFakeTimers();
const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockedUseFormulationTable = useFormulationTable as jest.Mock;
const mockedUsePackaging = usePackaging as jest.Mock;
const mockedUseConsumerPackagingContext = useConsumerPackagingContext as jest.Mock;

jest.mock("../useFormulationTable");
jest.mock("../../../../contexts/masterData/DataContext");
jest.mock("../../../consumer-packaging-tab/usePackaging");
jest.mock("../../../consumer-packaging-tab/ConsumerPackagingContext");

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("react-toastify/dist/ReactToastify.css", () => ({}));

jest.mock('react-infinite-scroll-component', () => {
  return ({ children, next, hasMore, loader, endMessage }: ReactInfiniteProps) => {
    return (
      <div>
        {children}
        {hasMore ? (
          <button onClick={next}>Load More</button>
        ) : (
          endMessage
        )}
        {loader}
      </div>
    );
  };
});

describe('FormulationAndCompositionTable', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: GlobalDataMock[0].formulation,
    packagingData: GlobalDataMock[0].packaging,
    token: "test"
  }

  beforeEach(() => {
    jest.clearAllMocks();

    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      formulationData: GlobalDataMock[0].formulation,
      packagingData: GlobalDataMock[0].packaging
    }));
    mockedUseFormulationTable.mockImplementation(() => ({
      ...FormulaionTableMock,
      handleMassChange: jest.fn(),
      handleNameChange: jest.fn(),
      handleCodeChange: jest.fn(),
      handleDeleteRow: jest.fn(),
      handleSearchChange: jest.fn(),
      handleSearchSelect: jest.fn(),
      handleMouseEnterWeight: jest.fn(),
      handleMouseLeaveWeight: jest.fn(),
      getTotalWeight: jest.fn(() => {return 6}),
      formattedTotalWeight: 10,
      cancelChanges: jest.fn(),
      handleRequestSort: jest.fn(),
      getComparator: jest.fn(),
      handleBlur: jest.fn(),
      setInFocusRows: jest.fn(),
      stableSort: () => {
        return FormulaionTableMock.rows
      },
      errors: new Map([
        ["RAW90023340", "300"],
        ["RAW90023342", "200"]
      ]),
      inFocusRows : [0],
      getColorByValue: jest.fn(),
      descendingComparator: jest.fn(),
    }));
    mockedUsePackaging.mockImplementation(() => ({
      ...PackagingMock,
      rows: TablePackagingMock,
      errors: new Map([
        [9, "500"],
        [10, "300"],
        [12, "200"]
      ]),
      handleFieldChange: jest.fn(),
      handleCloseChangeDailog: jest.fn(),
      handleContinueChangevlaue: jest.fn(),
      handleChangeComponentType: jest.fn(),
      handleCloseImportComponentDialog: jest.fn(),
      handleOpenImportComponentPopup: jest.fn(),
      handleCloseRecyclabilityStatusDialog: jest.fn(),
      handleDescriptionChange: jest.fn(),
      handleVPCSpecChange: jest.fn(),
      handleOpenRecyclabilityStatusPopup: jest.fn(),
      handleClickCancelButton: jest.fn(),
      handleMenuClose: jest.fn(),
      handleOpenDeletePopup: jest.fn(),
      handleMoreHorizClick: jest.fn(),
      handleEditPackagingComponent: jest.fn(),
      handleSave: jest.fn(),
      handleChangeAccordion: jest.fn(),
      handleClickSaveButton: jest.fn(),
      handleCloseDialog: jest.fn(),
      handleExpandClick: jest.fn(),
      handleComponentWeightChange: jest.fn(),
      handleComponentUnitsChange: jest.fn(),
      handleOpacityChange: jest.fn(),
      handleOpacifiersChange: jest.fn(),
      handleColorChange: jest.fn(),
      updateSaveButtonState: jest.fn(),
      setRows: jest.fn(),
      setRowsChangedFlag: jest.fn(),
      callChildComponentData: jest.fn(),
      callChildRecycleComponentData: jest.fn(),
      handleDelete: jest.fn(),
      setErrors: jest.fn(),
      handleCloseDeletePopup: jest.fn(),
    }));
    mockedUseConsumerPackagingContext.mockImplementation(() => ({
      primaryData: PrimaryPackagingMock.components,
      secondaryData: SecondaryPackagingMock.components,
      handelChangeTableData: jest.fn(),
      resetData: true
    }));
  });

  it('should render the component', () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <FormulationAndCompositionTable
            mode={"view"}
            formulationRawMaterials={GlobalDataMock[0].formulation.rawMaterials}
            handelFormulationTableChanges={jest.fn()}
            isClear={false}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();
  }, 8000);

  it('should render the component to change the number', async () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <FormulationAndCompositionTable
            mode={"edit"}
            formulationRawMaterials={GlobalDataMock[0].formulation.rawMaterials}
            handelFormulationTableChanges={jest.fn()}
            isClear={false}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();

    await act(() => {
      const textBox = screen.getAllByRole("spinbutton" );
      fireEvent.change(textBox[0], { target : {value : "20.12"}});
      fireEvent.blur(textBox[0]);
    })
  }, 8000);

  it('should render the component to change the number', async () => {
    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <FormulationAndCompositionTable
            mode={"edit"}
            formulationRawMaterials={GlobalDataMock[0].formulation.rawMaterials}
            handelFormulationTableChanges={jest.fn()}
            isClear={false}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();

    await act(() => {
      const textBox = screen.getAllByTestId("ArrowDownwardIcon");
      fireEvent.click(textBox[0])
      fireEvent.click(textBox[1])
      fireEvent.click(textBox[2])
      fireEvent.click(textBox[3])
      fireEvent.click(textBox[4])
      fireEvent.click(textBox[5])
      const infoIcon = screen.getAllByTestId("InfoIcon");
      fireEvent.click(infoIcon[0])
      fireEvent.click(infoIcon[1])
      fireEvent.click(infoIcon[2])
    })
  }, 8000);


  it('should calculate progress bar percentages when totalEnvFootprint and totalCarbonFootprint are greater than 0', () => {
    mockedUseFormulationTable.mockImplementation(() => ({
      ...FormulaionTableMock,
      handleMassChange: jest.fn(),
      handleNameChange: jest.fn(),
      handleCodeChange: jest.fn(),
      handleDeleteRow: jest.fn(),
      handleSearchChange: jest.fn(),
      handleSearchSelect: jest.fn(),
      handleMouseEnterWeight: jest.fn(),
      handleMouseLeaveWeight: jest.fn(),
      getTotalWeight: jest.fn(() => 6),
      formattedTotalWeight: 10,
      cancelChanges: jest.fn(),
      handleRequestSort: jest.fn(),
      getComparator: jest.fn(),
      handleBlur: jest.fn(),
      setInFocusRows: jest.fn(),
      stableSort: () => FormulaionTableMock.rows,
      errors: new Map(),
      inFocusRows: [0],
      getColorByValue: jest.fn(),
      descendingComparator: jest.fn(),
      totalEnvFootprint: 100,
      totalCarbonFootprint: 80,
    }));

    const { baseElement } = render(
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <FormulationAndCompositionTable
            mode={"view"}
            formulationRawMaterials={GlobalDataMock[0].formulation.rawMaterials}
            handelFormulationTableChanges={jest.fn()}
            isClear={false}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
    expect(baseElement).not.toBeNull();

    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
    const values = progressBars.map((bar) => Number(bar.getAttribute('aria-valuenow')));
    expect(values.some((v) => v > 0)).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────────
  // Additional coverage tests
  // ──────────────────────────────────────────────────────────────────────
  describe('Additional coverage', () => {
    // Helper that builds a fresh hook mock, allowing per-test overrides and
    // returning the spy fns so tests can assert call args.
    const buildFormulationMock = (overrides = {}) => {
      const spies = {
        handleMassChange: jest.fn(),
        handleNameChange: jest.fn(),
        handleCodeChange: jest.fn(),
        handleDeleteRow: jest.fn(),
        handleSearchChange: jest.fn(),
        handleSearchSelect: jest.fn(),
        handleMouseEnterWeight: jest.fn(),
        handleMouseLeaveWeight: jest.fn(),
        getTotalWeight: jest.fn(() => 6),
        cancelChanges: jest.fn(),
        handleRequestSort: jest.fn(),
        getComparator: jest.fn(),
        handleBlur: jest.fn(),
        setInFocusRows: jest.fn(),
        getColorByValue: jest.fn(),
        descendingComparator: jest.fn(),
      };
      const baseValue = {
        ...FormulaionTableMock,
        ...spies,
        formattedTotalWeight: 10,
        stableSort: () => (overrides ?? FormulaionTableMock.rows),
        errors: new Map(),
        inFocusRows: [0],
        ...overrides,
      };
      mockedUseFormulationTable.mockImplementation(() => baseValue);
      return spies;
    };

    const renderComponent = (mode: 'view' | 'edit' = 'edit') =>
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <FormulationAndCompositionTable
              mode={mode}
              formulationRawMaterials={GlobalDataMock[0].formulation.rawMaterials}
              handelFormulationTableChanges={jest.fn()}
              isClear={false}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );

    // ── validateEnteredValue branches ──
    describe('validateEnteredValue', () => {
      test('strips leading zeros when value is "01.5"', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: '01.5' } });
        expect(spies.handleMassChange).toHaveBeenCalledWith(0, '1.5');
      });

      test('truncates decimals beyond 6 digits', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: '1.1234567' } });
        expect(spies.handleMassChange).toHaveBeenCalledWith(0, '1.123456');
      });

      test('passes "0.0" through (zeroDotRegex)', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: '0.0' } });
        expect(spies.handleMassChange).toHaveBeenCalledWith(0, '0.0');
      });

      test('passes "0.5" through (zeroDecimalRegex)', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: '0.5' } });
        expect(spies.handleMassChange).toHaveBeenCalledWith(0, '0.5');
      });

      test('clamps values greater than 100 to 100', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: '150' } });
        expect(spies.handleMassChange).toHaveBeenCalledWith(0, '100');
      });

      test('coerces NaN (empty string) to "0"', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: '' } });
        expect(spies.handleMassChange).toHaveBeenCalledWith(0, '0');
      });
    });

    // ── Delete row & view-mode rendering ──
    describe('Delete & view mode', () => {
      test('clicking delete icon-button invokes handleDeleteRow with row index', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const deleteImgs = screen.getAllByAltText('Delete Material');
        expect(deleteImgs.length).toBeGreaterThan(0);
        fireEvent.click(deleteImgs[0]);
        expect(spies.handleDeleteRow).toHaveBeenCalledWith(0);
      });

      test('view mode does NOT render the delete-material image', () => {
        buildFormulationMock();
        renderComponent('view');
        expect(screen.queryAllByAltText('Delete Material')).toHaveLength(0);
      });

      test('view mode also hides the search-result table cells', () => {
        buildFormulationMock({
          isSearchResultsOpen: true,
          anchorEl: document.createElement('input'),
          searchResults: [{ tradeName: 'Hidden Result', rawMaterialId: 'HID01', percentage: '1' }],
        });
        renderComponent('view');
        expect(screen.queryByText('Hidden Result')).not.toBeInTheDocument();
      });
    });

    // ── Search interactions ──
    describe('Search', () => {
      test('typing in search field calls handleSearchChange', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const searchInput = screen.getByPlaceholderText('Search Raw material or code here...');
        fireEvent.change(searchInput, { target: { value: 'aqua' } });
        expect(spies.handleSearchChange).toHaveBeenCalled();
      });

      test('clicking a search result invokes handleSearchSelect with the row', () => {
        const result = { tradeName: 'Aqua Pura', rawMaterialId: 'AQUA01', percentage: '1.5' };
        const spies = buildFormulationMock({
          isSearchResultsOpen: true,
          anchorEl: document.createElement('input'),
          searchResults: [result],
        });
        renderComponent('edit');
        fireEvent.click(screen.getByText('Aqua Pura'));
        expect(spies.handleSearchSelect).toHaveBeenCalledWith(result);
      });

      test('renders "Raw material not found." when noResultFound and terms match', () => {
        buildFormulationMock({
          noResultFound: true,
          searchValue: 'unknown',
          debouncedSearchTerm: 'unknown',
        });
        renderComponent('edit');
        expect(screen.getByText('Raw material not found.')).toBeInTheDocument();
      });

      test('does NOT render not-found message when terms do not match', () => {
        buildFormulationMock({
          noResultFound: true,
          searchValue: 'abc',
          debouncedSearchTerm: 'xyz',
        });
        renderComponent('edit');
        expect(screen.queryByText('Raw material not found.')).not.toBeInTheDocument();
      });

      test('renders CircularProgress in search field when isLoading is true', () => {
        buildFormulationMock({ isLoading: true });
        renderComponent('edit');
        expect(screen.getAllByRole('progressbar').some((el) => el.tagName.toLowerCase() === 'span')).toBe(true);
      });
    });

    // ── Total weight icons ──
    describe('Total weight indicators', () => {
      test('renders success icon when total weight equals 100', () => {
        buildFormulationMock({
          getTotalWeight: jest.fn(() => 100),
          formattedTotalWeight: 100,
        });
        const { container } = renderComponent('edit');
        // CheckCircleOutlineIcon has class "success-icon"
        expect(container.querySelector('.success-icon')).toBeInTheDocument();
        expect(container.querySelector('.error-icon')).not.toBeInTheDocument();
      });

      test('renders error icon when total weight is NOT 100', () => {
        buildFormulationMock({
          getTotalWeight: jest.fn(() => 50),
          formattedTotalWeight: 50,
        });
        const { container } = renderComponent('edit');
        expect(container.querySelector('.error-icon')).toBeInTheDocument();
        expect(container.querySelector('.success-icon')).not.toBeInTheDocument();
      });
    });

    // ── Indicator icons (LEAF / WARNING) ──
    describe('Indicator icons', () => {
      const rowsWithIndicators = [
        {
          ...FormulaionTableMock.rows[0],
          leaf_icon_boolean: 'LEAF',
          watchlist_icon_boolean: '1',
        },
        {
          ...FormulaionTableMock.rows[1],
          leaf_icon_boolean: 'NO LEAF',
          watchlist_icon_boolean: '0',
        },
      ];

      test('renders LEAF image when leaf_icon_boolean is "LEAF"', () => {
        buildFormulationMock({ rows: rowsWithIndicators });
        renderComponent('edit');
        expect(screen.getAllByAltText('LEAF').length).toBeGreaterThan(0);
      });

      test('renders WARNING image when watchlist_icon_boolean is "1"', () => {
        buildFormulationMock({ rows: rowsWithIndicators });
        renderComponent('edit');
        expect(screen.getAllByAltText('WARNING').length).toBeGreaterThan(0);
      });

      test('does NOT render LEAF/WARNING images when flags are not set', () => {
        buildFormulationMock({
          rows: [
            {
              ...FormulaionTableMock.rows[0],
              leaf_icon_boolean: 'NO LEAF',
              watchlist_icon_boolean: '0',
            },
          ],
        });
        renderComponent('edit');
        expect(screen.queryAllByAltText('LEAF')).toHaveLength(0);
        expect(screen.queryAllByAltText('WARNING')).toHaveLength(0);
      });
    });

    // ── isFormulaCompositionEditable=false branch ──
    describe('Read-only (isFormulaCompositionEditable=false)', () => {
      test('hides search input and delete icon when not editable', () => {
        buildFormulationMock({ isFormulaCompositionEditable: false });
        renderComponent('edit');
        expect(screen.queryByPlaceholderText('Search Raw material or code here...')).not.toBeInTheDocument();
        expect(screen.queryAllByAltText('Delete Material')).toHaveLength(0);
      });
    });

    // ── Sort direction branches (orderBy matches the field) ──
    describe('getSortDirection / getDirection branches', () => {
      test('applies sortDirection on the matched column when orderBy is set', () => {
        buildFormulationMock({ orderBy: 'tradeName', order: 'desc' });
        renderComponent('edit');
        // The matched header cell receives aria-sort reflecting the order.
        const matchedHeader = screen.getByText('Raw Material Trade Name').closest('th');
        expect(matchedHeader?.getAttribute('aria-sort')).toBe('descending');
      });

      test('invokes handleRequestSort when a sort label is clicked', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const sortIcons = screen.getAllByTestId('ArrowDownwardIcon');
        fireEvent.click(sortIcons[0]);
        expect(spies.handleRequestSort).toHaveBeenCalled();
      });
    });

    // ── Scroll interaction handler ──
    describe('handleScrollInteraction', () => {
      test('wheel event on table container calls handleMouseLeaveWeight', () => {
        const spies = buildFormulationMock();
        const { container } = renderComponent('edit');
        const tableContainer = container.querySelector('.table-containers');
        expect(tableContainer).not.toBeNull();
        fireEvent.wheel(tableContainer as Element);
        expect(spies.handleMouseLeaveWeight).toHaveBeenCalled();
      });

      test('scroll capture on table container calls handleMouseLeaveWeight', () => {
        const spies = buildFormulationMock();
        const { container } = renderComponent('edit');
        const tableContainer = container.querySelector('.table-containers');
        fireEvent.scroll(tableContainer as Element);
        expect(spies.handleMouseLeaveWeight).toHaveBeenCalled();
      });
    });

    // ── Error border path on percentage input ──
    describe('Error styling on percentage input', () => {
      test('renders even when an error exists for the row (errors map populated)', () => {
        // Use an id that actually exists in the rows so the error branch fires.
        buildFormulationMock({
          errors: new Map([['RAW90023341', 'Mass % Composition should be in the range of 0-100% only. Please enter a valid range.']]),
        });
        const { baseElement } = renderComponent('edit');
        expect(baseElement).not.toBeNull();
      });
    });

    // ── Blur handler removes row from inFocusRows ──
    describe('Row blur', () => {
      test('blurring the percentage input calls handleBlur with id, value, and index', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.blur(inputs[0], { target: { value: '12.5' } });
        expect(spies.handleBlur).toHaveBeenCalled();
        // setInFocusRows is invoked inside handleRowBlur with a functional updater
        expect(spies.setInFocusRows).toHaveBeenCalled();
      });

      test('focusing the percentage input registers the row via setInFocusRows', () => {
        const spies = buildFormulationMock();
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.focus(inputs[0]);
        expect(spies.setInFocusRows).toHaveBeenCalled();
      });
    });

    // ── inFocusRows-aware value rendering ──
    describe('Percentage value rendering', () => {
      test('renders raw percentage value when row index is in focus', () => {
        buildFormulationMock({ inFocusRows: [0] });
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
        // First row percentage is 51.27 → in-focus path returns it as-is
        expect(inputs[0].value).toBe('51.27');
      });

      test('renders formatted toFixed(2) value when row is NOT in focus', () => {
        buildFormulationMock({ inFocusRows: [] });
        renderComponent('edit');
        const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
        // 51.27 formatted to 2 decimals stays "51.27"; verify the 18 row formats to "18.00"
        const tegoRow = inputs.find((i) => i.value === '18.00');
        expect(tegoRow).toBeDefined();
      });
    });
  });
}); 