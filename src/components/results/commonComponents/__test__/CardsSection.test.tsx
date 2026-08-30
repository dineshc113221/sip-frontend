import { render, act, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import { ReactInfiniteProps } from "../../../../mocks/CoreLogin.mock";
import CardsSection from "../CardsSection";
import { SustainablePackagingSectionDataMock, SustainablePackagingSectionDataMock1, SustainablePackagingSectionDataMock2, SustainablePackagingSectionDataMock3 } from "../../../../mocks/ResultData.mock";

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

const queryClient = new QueryClient({});

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
const mockedUseParams = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
  params: () => mockedUseParams,
  useParams: () => mockedUseParams,
  Link: jest.fn(),
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


describe("CardsSection", () => {

  it("should render the component when score is less than 5", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <CardsSection
            tabSectionData={SustainablePackagingSectionDataMock}
            setCurrentSection={jest.fn()}
            totalScore={'test'}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

  }, 8000);

  it("should render the component for different mock", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <CardsSection
            tabSectionData={SustainablePackagingSectionDataMock2}
            setCurrentSection={jest.fn()}
            totalScore={'test'}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

  }, 8000);

  it("should render the component when score is less than 5", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <CardsSection
            tabSectionData={SustainablePackagingSectionDataMock1}
            setCurrentSection={jest.fn()}
            totalScore={'test'}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

  }, 8000);

  it("should render the component when score is less than 5", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <CardsSection
            tabSectionData={SustainablePackagingSectionDataMock3}
            setCurrentSection={jest.fn()}
            totalScore={'test'}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });

  }, 8000);

  it("should render the component for green chemistry", async () => {
    await act(async () => {
      const { baseElement } = render(
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <CardsSection
            tabSectionData={SustainablePackagingSectionDataMock1}
            setCurrentSection={jest.fn()}
            totalScore={'green'}
          />
        </QueryClientProvider>
      );
      expect(baseElement).not.toBeNull();
    });
    const seeDetails = screen.getAllByRole("button");
    fireEvent.click(seeDetails[0])
  }, 8000);

});
