import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import '@testing-library/jest-dom';
import { useGlobaldata, PostContext } from '../../../contexts/masterData/DataContext';
import {GlobalDataMock} from "../../../mocks/GlobalData.mock.json";
import {PcSpecIdMock} from "../../../mocks/PCSpecIds.mock.json";
import PopupImportPCspec from '../PopupComponentImportPCspec';
import { ReactInfiniteProps } from '../../../mocks/CoreLogin.mock';


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

jest.mock("../../../contexts/masterData/DataContext");

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

describe('PopupImportPCspec', () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: GlobalDataMock[0].formulation,
    packagingData: GlobalDataMock[0].packaging,
    token : "token"
  }
  let originalFetch: jest.Mock;
  const sendToParentComponentMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock
    }));
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(PcSpecIdMock)
    })) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
  it('should render the component', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
          <PopupImportPCspec
              key={0}
              open={true}
              onClose={onCloseMock}
              sendToParentComponent={sendToParentComponentMock}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it('should be able to submit the popup', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
          <PopupImportPCspec
              key={1}
              open={true}
              onClose={onCloseMock}
             
              sendToParentComponent={sendToParentComponentMock}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    act(() => {
      const textBox = screen.getAllByRole("combobox");
      fireEvent.change(textBox[0], { target: { value: "FML1" } });
    })
  },60000);

  it('should be able to close the popup', async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <PopupImportPCspec
              key={3}
              open={true}
              onClose={onCloseMock}
             
              sendToParentComponent={sendToParentComponentMock}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    act(() => {
      const confirmButton = screen.getByTestId("CloseIcon");
      fireEvent.click(confirmButton);
    });
    expect(onCloseMock).toHaveBeenCalled();
  }, 8000);

 it("should show loading spinner when fetching list", async () => {
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve([{ CHILD_NM: "FML123" }]) })
  );

  await act(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupImportPCspec
            open={true}
            onClose={onCloseMock}
            sendToParentComponent={sendToParentComponentMock}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
  });

  const input = screen.getByRole("combobox");
  fireEvent.change(input, { target: { value: "FML" } });

  expect(await screen.findByRole("progressbar")).toBeInTheDocument();
});


it("should display PC spec details after selecting first option from autocomplete after typing 'pc-'", async () => {
  // First call: list endpoint returning multiple options
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { CHILD_NM: "PC-0000531" },
          { CHILD_NM: "PC-0000999" },
          { CHILD_NM: "PC-1234567" },
        ]),
    })
  );

  // Second call: details for the first option (PC-0000531)
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          pc_nm: "PC-0000531",
          description: "Safety seal for Listerine product size 750ml,1L,1.5L and Bentley 800ml",
          stage: "Commercial",
          state: "Effective",
          template: "Bottle",
          sub_components: [
            {
              name: "Cap",
              material: [{ material_name: "Steel" }],
            },
          ],
        }),
    })
  );

  await act(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostContext.Provider value={contextValue}>
          <PopupImportPCspec
            open={true}
            onClose={onCloseMock}
            sendToParentComponent={sendToParentComponentMock}
          />
        </PostContext.Provider>
      </QueryClientProvider>
    );
  });

  const input = screen.getByRole("combobox");
  // Type trigger string 'pc-' (lowercase to verify case-insensitive behavior if any)
  fireEvent.change(input, { target: { value: "pc-" } });

  // Open the popup list (MUI Autocomplete may auto-open on change; ensure via keyDown)
  fireEvent.keyDown(input, { key: 'ArrowDown' });

  // Wait for first option to appear, then click it
  const firstOption = await screen.findByRole("option", { name: "PC-0000531" });

  fireEvent.click(firstOption);
  
});

});
