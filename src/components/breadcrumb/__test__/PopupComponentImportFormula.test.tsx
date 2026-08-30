import { render, screen, fireEvent, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import {
  useGlobaldata,
  PostContext,
} from "../../../contexts/masterData/DataContext";
import { GlobalDataMock } from "../../../mocks/GlobalData.mock.json";
import { FormulaIdMock } from "../../../mocks/FormulaIds.mock.json";
import PopupImportFormula from "../PopupComponentImportFormula";
import { ReactInfiniteProps } from "../../../mocks/CoreLogin.mock";

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

jest.mock("react-infinite-scroll-component", () => {
  return ({
    children,
    next,
    hasMore,
    loader,
    endMessage,
  }: ReactInfiniteProps) => {
    return (
      <div>
        {children}
        {hasMore ? <button onClick={next}>Load More</button> : endMessage}
        {loader}
      </div>
    );
  };
});

describe("PopupImportFormula", () => {
  const contextValue = {
    loaded: true,
    globaldata: GlobalDataMock,
    formulationData: GlobalDataMock[0].formulation,
    packagingData: GlobalDataMock[0].packaging,
    token: "token",
  };
  let originalFetch: jest.Mock;
  const sendToParentMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockeduseGlobaldata.mockImplementation(() => ({
      isLoading: true,
      loaded: true,
      globaldata: GlobalDataMock,
    }));
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(FormulaIdMock),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
  it("should render the component", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <PopupImportFormula
              key={0}
              open={true}
              onClose={jest.fn()}
              sendToParent={jest.fn()}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
  }, 8000);

  it("should be able to submit the popup", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <PopupImportFormula
              key={0}
              open={true}
              onClose={onCloseMock}
              sendToParent={sendToParentMock}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    await act(() => {
      const textBox = screen.getAllByRole("combobox");
      fireEvent.change(textBox[0], { target: { value: "FML1" } });
      fireEvent.keyDown(textBox[0], { key: "ArrowDown" });
    });
    await act(() => {
      const associateToChassisOptions = screen.getAllByRole("option");
      fireEvent.click(associateToChassisOptions[1]);
    });
  }, 20000);

  it("should be able to close the popup", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <PostContext.Provider value={contextValue}>
            <PopupImportFormula
              key={0}
              open={true}
              onClose={onCloseMock}
              sendToParent={sendToParentMock}
            />
          </PostContext.Provider>
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

    await act(() => {
      const confirmButton = screen.getByTestId("CloseIcon");
      fireEvent.click(confirmButton);
    });
    expect(onCloseMock).toHaveBeenCalled();
  } , 8000);
});
