import { render, screen } from '@testing-library/react';
import { ConsumerPackagingProvider } from '../ConsumerPackagingContext';
import useConsumerPackaging from '../useConsumerPackaging';

const mockedUseConsumerPackaging = useConsumerPackaging as jest.Mock;

jest.mock("../useConsumerPackaging");

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

const TestComponent = () => {
  
  return (
    <div>
      <span data-testid="currentSection">test</span>
    </div>
  );
};

describe('SidebarStateContext', () => {
  const contextValue = {
    packagingAllData: undefined,
    packagingSavedData: undefined,
    primaryData: [],
    secondaryData: [],
    isSaveEnabled: false,
    productEvacuationValue: '',
    isPrimaryAddEnabled: false,
    isSecondaryAddEnabled: false,
    isComponentDataChangePrimary: [],
    isComponentDataChangeSecondary: [],
    counterPrimary: 0,
    counterSecondary: 0,
    resetData: false,
    buttonText: '',
    primaryRecycleStatus: 'ready',
    secondaryRecycleStatus: 'ready',
    setIsComponentDataChangePrimary: jest.fn(),
    setIsComponentDataChangeSecondary: jest.fn(),
    setIsSaveEnabled: jest.fn(),
    handelChangeTableData: jest.fn(),
    handleChange: jest.fn(),
    handleChangeSelect: jest.fn(),
    handelImportPackingData: jest.fn(),
    handleSavePacking: jest.fn(),
    handelChangeRecycleStatus: jest.fn(),
    setProductEvacuationValue: jest.fn(),
    handleAddPrimary: jest.fn(),
    handleAddSecondary: jest.fn(),
    handleDeleteComponent: jest.fn(),
    handleClickCancelContinue: jest.fn(),
    handleClickEditCancle: jest.fn(),
    setPcNmToEmpty: jest.fn()
  }
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseConsumerPackaging.mockImplementation(() => (contextValue));

  });
  it('should render with initial values', () => {
    render(
      <ConsumerPackagingProvider>
        <TestComponent />
      </ConsumerPackagingProvider>
    );

    expect(screen.getByTestId('currentSection').textContent).toBe('test');
  }, 8000);


});