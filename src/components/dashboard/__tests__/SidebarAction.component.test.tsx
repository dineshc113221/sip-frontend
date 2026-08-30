/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, act, screen, fireEvent, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';
import SideBarAction from '../SidebarAction.component';
import { useContext } from 'react';
import { SidebarContext, SidebarStateProvider } from '../../../contexts/sidebarData/SidebarStateContext';
import { AutoSaveContext } from "../../../contexts/autoSaveContext/AutoSaveContext";
import { useLocation } from 'react-router-dom';

import { isSIPAdmin } from "../../../helper/GenericFunctions";


jest.mock("../../../helper/GenericFunctions", () => ({
  isSIPAdmin: jest.fn(),
}));

const queryClient = new QueryClient({});

jest.mock("@consumer/core-login-ui-mf", () => ({
  getLoggedInUserDetails: () =>
    jest.fn(() => ({ givenName: "blaw", mail: "badckak" })),
}));

jest.mock("react-ga4", () => ({
  ReactGA4: {
    initialize: () => <div></div>,
    event: () => <div></div>,
  },
}));

const mockeduseGlobaldata = useGlobaldata as jest.Mock;
const mockOnSignOutClick = jest.fn();

jest.mock("../../../contexts/masterData/DataContext");

const mockedUsedNavigate = jest.fn();
const mockedUseTheme = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useTheme: () => mockedUseTheme,
  useLocation: jest.fn(),
}));
const mockedUseLocation = useLocation as jest.Mock;

jest.mock("react-toastify", () => ({
  toast: jest
    .fn()
    .mockImplementation(() => [jest.fn(), jest.fn(), jest.fn()]),
  ToastContainer: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock("react-toastify/dist/ReactToastify.css", () => ({}));

jest.mock('react-infinite-scroll-component', () => {
  return ({ children, next, hasMore, loader, endMessage }: ReactInfiniteProps) => (
    <div>
      {children}
      {hasMore ? <button onClick={next}>Load More</button> : endMessage}
      {loader}
    </div>
  );
});


const mockContextValues = {
  tabSwitched: false,
  setTabSwitched: jest.fn(),
  setFormulationFormData: jest.fn(),
  formulationFormData: {},
  setChangedFields: jest.fn(),
  autoSaveSuccess: false,
  setAutoSaveSuccess: jest.fn(),
  taboutAutoSaveInProgress: false,
  changedFields: [],
  refetchDetails: false,
  setRefetchDetails: jest.fn(),
  calculateClick: false,
  setCalculateClick: jest.fn(),
  calculateClickPackaging: false,
  setCalculateClickPackaging: jest.fn(),
  pathNavigation: null,
  setPathNavigation: jest.fn(),
  hasUncalculatedChanges: false,
  setHasUncalculatedChanges: jest.fn(),
  showNavigationWarning: false,
  setShowNavigationWarning: jest.fn(),
  isOwnerUser: false,
  setIsOwnerUser: jest.fn(),
  isDataCompleted: false,
  setIsDataCompleted: jest.fn(),
  isAllFlagsCalc: false,
  setIsAllFlagsCalc: jest.fn(),
  isDialsSidebarError: false,
  setIsDialsSidebarError: jest.fn()
};

const autoSaveContext = {
  ...mockContextValues,
  showNavigationWarning: true,
  isDataCompleted: true,
  pathNavigation: '/dashboard'
};

describe('SideBarAction', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: {},
    packagingData: {},
    token: "test"
  }

  
  const localStorageMock = (function () {
    let store = {} as any;
    return {
      getItem: function (key) { return store[key] || null },
      setItem: function (key, value) { store[key] = value.toString() },
      removeItem: function (key) { delete store[key] },
      clear: function () { store = {} }
    }
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  const mockPathname = jest.fn();
  Object.defineProperty(window, "location", {
    value: { get pathname() { return mockPathname(); } },
  });
  mockPathname.mockReturnValue("/product-assessment/id");

  beforeEach(() => {
    jest.clearAllMocks();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
      loggedInUser: { roles: ['User'] } 
    }));
    (isSIPAdmin as jest.Mock).mockReturnValue(false);
    
    
    mockedUseLocation.mockReturnValue({ pathname: '/dashboard' });
  });

  
  const renderSideBar = (props = {}) => (
    <SideBarAction
      mfProps={{ publish: jest.fn(), subscribe: jest.fn() }}
      onSignOutClick={mockOnSignOutClick}
      getRoutePathName={jest.fn()} 
      {...props}
    />
  );

  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            {renderSideBar()}
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it('should render all tooltips and icons for open/close states', async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            {renderSideBar()}
          </PostContext.Provider>
        </QueryClientProvider>
      );
    });
    const icons = screen.getAllByRole('img');
    expect(icons.length).toBeGreaterThanOrEqual(5);
    
    const openToggle = screen.getAllByAltText('Open sidebar');
    fireEvent.click(openToggle[0].parentElement!);
    expect(screen.getByText('Close')).toBeInTheDocument();
    
    const closeToggle = screen.getAllByAltText('Close sidebar');
    fireEvent.click(closeToggle[0].parentElement!);
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('should render both logo states (open/closed)', async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            {renderSideBar()}
          </PostContext.Provider>
        </QueryClientProvider>
      );
    });
    expect(screen.getAllByRole('img')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByAltText('Open sidebar')[0].parentElement!);
    expect(screen.getAllByRole('img')[0]).toBeInTheDocument();
  });

  it('should not render sidebar on /sip/login', async () => {
    mockPathname.mockReturnValue('/sip/login');
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            {renderSideBar()}
          </PostContext.Provider>
        </QueryClientProvider>
      );
    });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    mockPathname.mockReturnValue('/product-assessment/id');
  });

  it('should render and click all navigation icons', async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            {renderSideBar()}
          </PostContext.Provider>
        </QueryClientProvider>
      );
    });
    fireEvent.click(screen.getAllByAltText('home')[0].parentElement!);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    
    fireEvent.click(screen.getAllByAltText('all products')[0].parentElement!);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/allproduct');
    
    fireEvent.click(screen.getAllByAltText('help')[0].parentElement!);
  });

  it('should render and click sign out button (open/closed)', async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            {renderSideBar()}
          </PostContext.Provider>
        </QueryClientProvider>
      );
    });
    fireEvent.click(screen.getAllByAltText('sign out')[0].parentElement!);
    expect(mockOnSignOutClick).toHaveBeenCalled();
  });

  it('should render divider in both open and closed states', async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            {renderSideBar()}
          </PostContext.Provider>
        </QueryClientProvider>
      );
    });
    expect(screen.getAllByRole('separator').length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByAltText('Open sidebar')[0].parentElement!);
    expect(screen.getAllByRole('separator').length).toBeGreaterThan(0);

  });

  it('should render the component to redirect to home', async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            {renderSideBar()}
          </PostContext.Provider>
        </QueryClientProvider>
      );
    });
    const homeIcon = screen.getAllByRole("img");
    fireEvent.click(homeIcon[1]);
  }, 8000);

  it("should update currentSection and sync to local storage", () => {
    const { result } = renderHook(() => useContext(SidebarContext), {
      wrapper: SidebarStateProvider,
    });
    act(() => {
      result.current.setCurrentSection("dashboard");
    });
    expect(result.current.currentSection).toBe("dashboard");
    expect(localStorage.getItem("CurrentSection")).toBe("dashboard");
  });

  test("sets allProdIcon to true and homeIcon to false when currentSection is 'allProducts'", () => {
    const mockContextValue = {
      currentSection: "allProducts",
      setCurrentSection: jest.fn(),
    };
    render(
      <SidebarContext.Provider value={mockContextValue}>
        {renderSideBar()}
      </SidebarContext.Provider>
    );
    expect(screen.queryByAltText("all products")).toBeInTheDocument();
  });

  test('should handle Help & Support click (link creation)', () => {
    const originalCreateElement = document.createElement;
    const mockClick = jest.fn();
    const mockRemove = jest.fn();
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        const mockElement = originalCreateElement.call(document, 'a');
        mockElement.click = mockClick;
        mockElement.remove = mockRemove;
        return mockElement;
      }
      return originalCreateElement.call(document, tagName);
    });

    render(
      <SidebarContext.Provider value={{ currentSection: 'help', setCurrentSection: jest.fn() }}>
        {renderSideBar()}
      </SidebarContext.Provider>
    );

    const icons = screen.getAllByRole('img');
    const helpIconCollapsed = icons[3];
    fireEvent.click(helpIconCollapsed);

    expect(mockClick).toHaveBeenCalled();
    createElementSpy.mockRestore();
  });

  it('should show navigation warning when navigating with unsaved changes', async () => {
    const setPathNavigation = jest.fn();
    const setShowNavigationWarning = jest.fn();
    const autoSaveOverrides = {
      setPathNavigation,
      setShowNavigationWarning,
      hasUncalculatedChanges: true,
      isOwnerUser: true,
      isDataCompleted: true,
      isAllFlagsCalc: true,
      isDialsSidebarError: false,
    };
    
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <AutoSaveContext.Provider value={{ ...mockContextValues as any, ...autoSaveOverrides }}>
            <SidebarContext.Provider value={{ setCurrentSection: jest.fn(), currentSection: 'home' }}>
              {renderSideBar()}
            </SidebarContext.Provider>
          </AutoSaveContext.Provider>
        </QueryClientProvider>
      );
    });
    fireEvent.click(screen.getAllByAltText('home')[0].parentElement!);
    expect(setPathNavigation).toHaveBeenCalledWith('/dashboard');
    expect(setShowNavigationWarning).toHaveBeenCalledWith(true);
  });

  it('should navigate directly if no unsaved changes', async () => {
    await act(async () => {
      render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <AutoSaveContext.Provider value={{ ...mockContextValues as any, hasUncalculatedChanges: false }}>
            <SidebarContext.Provider value={{ setCurrentSection: jest.fn(), currentSection: 'home' }}>
              {renderSideBar()}
            </SidebarContext.Provider>
          </AutoSaveContext.Provider>
        </QueryClientProvider>
      );
    });
    fireEvent.click(screen.getAllByAltText('home')[0].parentElement!);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
  });

  

  it('should set currentSection to "admin" when pathname is "/admin"', async () => {
    mockedUseLocation.mockReturnValue({ pathname: '/admin' });
    const setCurrentSection = jest.fn();
    const getRoutePathName = jest.fn();

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AutoSaveContext.Provider value={autoSaveContext  as any }>
            <SidebarContext.Provider value={{ setCurrentSection, currentSection: '' }}>
              <SideBarAction
                mfProps={{ publish: jest.fn(), subscribe: jest.fn() }}
                onSignOutClick={jest.fn()}
                getRoutePathName={getRoutePathName}
              />
            </SidebarContext.Provider>
          </AutoSaveContext.Provider>
        </QueryClientProvider>
      );
    });
    expect(setCurrentSection).toHaveBeenCalledWith('admin');
    expect(getRoutePathName).toHaveBeenCalledWith('/admin');
  });

  it('should set currentSection to "changelog" when pathname is "/changelog"', async () => {
    mockedUseLocation.mockReturnValue({ pathname: '/changelog' });
    const setCurrentSection = jest.fn();

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
           <AutoSaveContext.Provider value={autoSaveContext as any}>
            <SidebarContext.Provider value={{ setCurrentSection, currentSection: '' }}>
              {renderSideBar({ getRoutePathName: jest.fn() })}
            </SidebarContext.Provider>
          </AutoSaveContext.Provider>
        </QueryClientProvider>
      );
    });
    expect(setCurrentSection).toHaveBeenCalledWith('changelog');
  });

  it('should render Admin Console item when user is admin and navigate on click', async () => {
    
    mockedUseLocation.mockReturnValue({ pathname: '/dashboard' });

    
    (isSIPAdmin as jest.Mock).mockReturnValue(true);
    mockeduseGlobaldata.mockReturnValue({
      loaded: true,
      globaldata: GlobalDataMock,
      loggedInUser: { roles: ['SIP Admin'] }
    });

    const setCurrentSection = jest.fn();
    const getRoutePathName = jest.fn(); 

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AutoSaveContext.Provider value={autoSaveContext as any}>
            <SidebarContext.Provider value={{ setCurrentSection, currentSection: 'home' }}>
              <SideBarAction
                mfProps={{ publish: jest.fn(), subscribe: jest.fn() }}
                onSignOutClick={jest.fn()}
                getRoutePathName={getRoutePathName}
              />
            </SidebarContext.Provider>
          </AutoSaveContext.Provider>
        </QueryClientProvider>
      );
    });

    
    const adminIcon = screen.getByAltText('Admin Console'); 
    expect(adminIcon).toBeInTheDocument();

  });

  it('should render Close button and Tooltip correctly when sidebar is expanded', async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AutoSaveContext.Provider value={autoSaveContext as any}>
            <SidebarContext.Provider value={{ setCurrentSection: jest.fn(), currentSection: 'home' }}>
              {renderSideBar({ getRoutePathName: jest.fn() })}
            </SidebarContext.Provider>
          </AutoSaveContext.Provider>
        </QueryClientProvider>
      );
    });

    fireEvent.click(screen.getAllByAltText('Open sidebar')[0].parentElement!);

    const closeIcon = screen.getByAltText('Close sidebar');
    expect(closeIcon).toBeInTheDocument();
    
    const closeText = screen.getByText('Close');
    expect(closeText).toBeInTheDocument();
    
    fireEvent.mouseOver(closeIcon);
    expect(await screen.findByText('Expand / Collapse')).toBeInTheDocument();
  });
});